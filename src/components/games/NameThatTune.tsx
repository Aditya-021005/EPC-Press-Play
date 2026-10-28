"use client";

import React, { useState, useEffect, useRef } from "react";
import { TUNES_POOL, TuneItem } from "@/data/tunes";
import { fetchGameContent } from "@/lib/gameContent";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faScroll,
  faPlay,
  faCheck,
  faTrophy,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

interface NameThatTuneProps {
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

interface TrackSubmission {
  track: TuneItem;
  enteredSong: string;
  enteredArtist: string;
}

export default function NameThatTune({ onFinish, onBack, onUpdateMeta }: NameThatTuneProps) {
  // 10 tracks per play
  const [tracks, setTracks] = useState<TuneItem[]>(() => {
    return [...TUNES_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  useEffect(() => {
    fetchGameContent().then((content) => {
      if (content?.tunes && content.tunes.length > 0) {
        setTracks([...content.tunes].sort(() => 0.5 - Math.random()).slice(0, 10));
      }
    });
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [songInput, setSongInput] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [submissions, setSubmissions] = useState<TrackSubmission[]>([]);

  // 30s timer per track
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompletedPhase, setIsCompletedPhase] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = tracks[currentIdx] || TUNES_POOL[0];

  // 30s countdown timer effect
  useEffect(() => {
    if (isCompletedPhase) return;

    setTimeLeft(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          sound.playBuzzer();
          handleNextTrack(true);
          return 0;
        }
        if (prev <= 6) {
          sound.playCountdownBeep(prev === 1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isCompletedPhase]);

  const handleNextTrack = (isAuto = false) => {
    if (!isAuto) {
      sound.playClick();
    }

    const currentSub: TrackSubmission = {
      track: currentTrack,
      enteredSong: songInput.trim(),
      enteredArtist: artistInput.trim(),
    };

    const newSubs = [...submissions, currentSub];
    setSubmissions(newSubs);

    if (currentIdx + 1 < Math.min(10, tracks.length)) {
      setCurrentIdx((prev) => prev + 1);
      setSongInput("");
      setArtistInput("");
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 60 });
      setIsCompletedPhase(true);
    }
  };

  const handleReturnToHub = () => {
    sound.playClick();
    onBack();
  };

  useEffect(() => {
    if (!isCompletedPhase) {
      onUpdateMeta?.({
        title: "Name That Tune",
        score: 0,
        roundInfo: `Track ${currentIdx + 1}/10 • ${timeLeft}s Left`,
      });
    } else {
      onUpdateMeta?.({
        title: "Name That Tune",
        score: 0,
        roundInfo: `Guesses Submitted to Host`,
      });
    }
  }, [currentIdx, timeLeft, isCompletedPhase, onUpdateMeta]);

  return (
    <div className="game-arena">
      <div className="game-body-center tune-stage">
        {!isCompletedPhase ? (
          /* ========================================================================= */
          /* PLAYING PHASE: SINGLE LYRIC + 30s TIMER + SONG & ARTIST INPUTS */
          /* ========================================================================= */
          <div style={{ width: "100%", maxWidth: "800px" }}>
            {/* Top Status & 30s Timer Bar */}
            <div
              style={{
                background: "var(--paper)",
                border: "3px solid var(--ink)",
                boxShadow: "5px 5px 0 var(--ink)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem 1.5rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    background: "var(--c-sky)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 900,
                    fontSize: "0.8rem",
                    border: "2px solid var(--ink)",
                  }}
                >
                  TRACK {currentIdx + 1} OF 10
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--ink)", marginTop: "0.3rem" }}>
                  Name the Song Title & Artist
                </h3>
              </div>

              <div
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "14px",
                  background: timeLeft <= 6 ? "var(--c-cherry)" : "var(--stage)",
                  color: timeLeft <= 6 ? "#fff" : "var(--on-stage)",
                  border: "3px solid var(--ink)",
                  boxShadow: "3px 3px 0 var(--ink)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  minWidth: "100px",
                  textAlign: "center",
                }}
              >
                {timeLeft}s
              </div>
            </div>

            {/* Exactly One Lyric Card */}
            <div
              style={{
                background: "var(--paper)",
                border: "4px solid var(--ink)",
                boxShadow: "7px 7px 0 var(--ink)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                marginBottom: "1.8rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--muted-paper)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                <FontAwesomeIcon icon={faScroll} />
                LYRIC SNIPPET ({currentTrack.genre.toUpperCase()})
              </div>

              <div
                style={{
                  fontSize: "clamp(1.2rem, 3.2vw, 1.65rem)",
                  fontWeight: 900,
                  color: "var(--ink)",
                  lineHeight: 1.45,
                  fontStyle: "italic",
                  padding: "0.8rem 1rem",
                  background: "rgba(91, 190, 255, 0.1)",
                  borderRadius: "14px",
                  border: "2px dashed var(--ink)",
                }}
              >
                “{currentTrack.lyric}”
              </div>

              <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--muted-paper)", fontWeight: 600 }}>
                No melodies played. Identify the track purely from this single lyric line!
              </p>
            </div>

            {/* Manual Text Inputs: Song Name & Artist Name */}
            <div
              style={{
                background: "var(--paper)",
                border: "3px solid var(--ink)",
                boxShadow: "5px 5px 0 var(--ink)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "var(--ink)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    1. Song Title:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter song name..."
                    value={songInput}
                    onChange={(e) => setSongInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "2px solid var(--ink)",
                      background: "#f8fafc",
                      color: "var(--ink)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      outline: "none",
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNextTrack();
                      }
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "var(--ink)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    2. Artist / Band:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter artist or band..."
                    value={artistInput}
                    onChange={(e) => setArtistInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "2px solid var(--ink)",
                      background: "#f8fafc",
                      color: "var(--ink)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      outline: "none",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNextTrack();
                      }
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn-action btn-gold"
                onClick={() => handleNextTrack(false)}
                style={{ width: "100%", padding: "0.95rem" }}
              >
                {currentIdx + 1 < Math.min(10, tracks.length) ? (
                  <>
                    SUBMIT & NEXT TRACK ({currentIdx + 2}/{Math.min(10, tracks.length)})
                    <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                  </>
                ) : (
                  <>
                    FINISH & SUBMIT GUESSES TO HOST
                    <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.5rem" }} />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* GUESSES SUBMITTED PHASE (HOST SCORES LIVE FROM ADMIN PANEL) */
          /* ========================================================================= */
          <div style={{ width: "100%", maxWidth: "900px" }}>
            <div
              style={{
                background: "var(--paper)",
                border: "3px solid var(--gold-border, var(--ink))",
                boxShadow: "6px 6px 0 var(--ink)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    background: "var(--c-gold, #f5af19)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 900,
                    fontSize: "0.8rem",
                    marginBottom: "0.4rem",
                    border: "2px solid var(--ink)",
                  }}
                >
                  TRACK GUESSES LOGGED
                </span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--ink)" }}>
                  <FontAwesomeIcon icon={faClipboardCheck} style={{ marginRight: "0.5rem", color: "var(--c-gold, #f5af19)" }} />
                  Answers Submitted for Host Evaluation
                </h2>
                <p style={{ color: "var(--muted-paper)", fontSize: "0.9rem", fontWeight: 600 }}>
                  Your answers have been securely logged! The host will evaluate Song Title and Artist points directly in real-time from the Host Admin Panel.
                </p>
              </div>

              <div
                style={{
                  padding: "0.85rem 1.6rem",
                  borderRadius: "16px",
                  background: "var(--stage)",
                  color: "#fff",
                  border: "3px solid var(--ink)",
                  boxShadow: "4px 4px 0 var(--ink)",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--c-sun)", display: "block", textTransform: "uppercase" }}>
                  Status
                </span>
                <strong style={{ fontSize: "1.2rem", fontFamily: "var(--font-mono)", fontWeight: 900, color: "var(--c-grass)" }}>
                  LOGGED
                </strong>
                <span style={{ fontSize: "0.85rem", display: "block", color: "var(--muted-stage)" }}>
                  Host Scoring Live
                </span>
              </div>
            </div>

            {/* 10 Track Submissions Review List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.8rem" }}>
              {submissions.map((sub, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--paper)",
                    border: "3px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--ink)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: "1 1 350px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 900,
                          fontSize: "0.85rem",
                          color: "var(--muted-paper)",
                        }}
                      >
                        TRACK #{idx + 1}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--muted-paper)" }}>
                        “{sub.track.lyric.length > 60 ? sub.track.lyric.substring(0, 60) + "..." : sub.track.lyric}”
                      </span>
                    </div>

                    <div style={{ background: "rgba(245, 175, 25, 0.12)", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--ink)", marginTop: "0.3rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted-paper)", fontWeight: 800, display: "block" }}>
                        YOUR GUESS:
                      </span>
                      <strong style={{ color: "var(--ink)", fontSize: "0.95rem" }}>
                        {sub.enteredSong || "(No song entered)"}
                      </strong>
                      <span style={{ display: "block", color: "var(--muted-paper)", fontSize: "0.82rem" }}>
                        by {sub.enteredArtist || "(No artist entered)"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "8px",
                        background: "rgba(61, 214, 140, 0.15)",
                        border: "1.5px solid var(--c-grass)",
                        color: "var(--ink)",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Awaiting Host Mark
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Bar */}
            <div
              style={{
                background: "var(--paper)",
                border: "3px solid var(--gold-border, var(--ink))",
                boxShadow: "6px 6px 0 var(--ink)",
                borderRadius: "var(--radius-lg)",
                padding: "1.2rem 1.8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", fontWeight: 700, color: "var(--muted-paper)" }}>
                Scores are awarded by host in real time and synced to leaderboard.
              </div>

              <button
                type="button"
                className="btn-action btn-gold"
                onClick={handleReturnToHub}
                style={{ padding: "0.95rem 2rem", fontSize: "1.05rem" }}
              >
                RETURN TO ARCADE HUB
                <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.6rem" }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
