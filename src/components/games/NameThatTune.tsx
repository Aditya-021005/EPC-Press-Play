"use client";

import React, { useState, useEffect } from "react";
import { TUNES_POOL, TuneItem } from "@/data/tunes";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faVolumeHigh,
  faScroll,
  faPlus,
  faCheck,
  faXmark,
  faPlay,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

interface NameThatTuneProps {
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

export default function NameThatTune({ onFinish, onBack, onUpdateMeta }: NameThatTuneProps) {
  const [tracks] = useState<TuneItem[]>(() => {
    return [...TUNES_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onUpdateMeta?.({
      title: "Name That Tune",
      score,
      roundInfo: `Track ${currentIdx + 1}/10`,
    });
  }, [score, currentIdx, onUpdateMeta]);
  const [revealedLinesCount, setRevealedLinesCount] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);

  const currentTrack = tracks[currentIdx];

  const currentPotentialPoints = Math.max(4, 10 - (revealedLinesCount - 1) * 3);

  const handleRevealMoreLyrics = () => {
    if (revealedLinesCount < currentTrack.lyricsLines.length) {
      sound.playClick(700);
      setRevealedLinesCount((prev) => prev + 1);
    }
  };

  const handlePlaySynth = () => {
    if (isPlayingSynth) return;
    setIsPlayingSynth(true);
    sound.playSynthMelody(currentTrack.melodyNotes, 220);
    setTimeout(() => {
      setIsPlayingSynth(false);
    }, currentTrack.melodyNotes.length * 220 + 200);
  };

  const handleSelectOption = (option: string) => {
    if (isRevealed) return;
    setSelectedOption(option);
    setIsRevealed(true);

    const correctStr = `${currentTrack.song} - ${currentTrack.artist}`;
    const isCorrect = option === correctStr;

    if (isCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 45, spread: 60 });
      setScore((prev) => prev + currentPotentialPoints);
    } else {
      sound.playBuzzer();
    }
  };

  const handleNextTrack = () => {
    sound.playClick();
    if (currentIdx + 1 < 10) {
      setCurrentIdx((prev) => prev + 1);
      setRevealedLinesCount(1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      sound.playSuccess();
      confetti({ particleCount: 90, spread: 70 });
      onFinish(score);
    }
  };

  const correctStr = `${currentTrack.song} - ${currentTrack.artist}`;
  const isCorrect = selectedOption === correctStr;

  return (
    <div className="game-arena">
      <div className="game-body-center tune-stage">
        {/* Audio Deck with Glowing Vinyl & Equalizer */}
        <div className="audio-deck-wrap">
          <div className={`vinyl-disc ${isPlayingSynth ? "playing" : ""}`}>
            <div className="vinyl-center-label">
              <span>PRESS PLAY</span>
              <span>#{currentIdx + 1}</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                className="btn-synth-preview"
                onClick={handlePlaySynth}
                disabled={isPlayingSynth}
              >
                <span>
                  {isPlayingSynth ? (
                    <>
                      <FontAwesomeIcon icon={faMusic} pulse style={{ marginRight: "0.5rem" }} />
                      PLAYING SYNTH THEME...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faVolumeHigh} style={{ marginRight: "0.5rem" }} />
                      PLAY SYNTH MELODY THEME
                    </>
                  )}
                </span>
              </button>

              {/* Real-time frequency bars simulation */}
              <div className="synth-audio-visualizer">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((b) => (
                  <div
                    key={b}
                    className={`viz-bar ${isPlayingSynth ? "active" : ""}`}
                    style={{
                      animationDelay: `${(b * 0.08) % 0.4}s`,
                      height: isPlayingSynth ? undefined : `${(b * 3) % 14 + 4}px`
                    }}
                  />
                ))}
              </div>
            </div>

            <span className="deck-subtext">
              Real-time Web Audio Synthesizer playing 8-bit melodic hook motifs!
            </span>
          </div>
        </div>

        {/* Lyrics Teleprompter */}
        <div className="teleprompter-card">
          <div className="teleprompter-header">
            <span>
              <FontAwesomeIcon icon={faScroll} style={{ marginRight: "0.5rem" }} />
              LYRIC TELEPROMPTER ({currentTrack.genre.toUpperCase()})
            </span>
            <span style={{ color: "var(--neon-yellow)" }}>
              Current Value: {currentPotentialPoints} PTS ({revealedLinesCount} of {currentTrack.lyricsLines.length} hints)
            </span>
          </div>

          <div className="lyrics-lines-box">
            {currentTrack.lyricsLines.slice(0, revealedLinesCount).map((line, idx) => (
              <div key={idx} className="lyric-line-item">
                “{line}”
              </div>
            ))}
          </div>

          {!isRevealed && revealedLinesCount < currentTrack.lyricsLines.length && (
            <button className="btn-secondary-sm" onClick={handleRevealMoreLyrics}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "0.45rem" }} />
              Reveal Next Lyric Line (-3 pts penalty)
            </button>
          )}
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="tune-options-grid">
          {currentTrack.options.map((opt) => {
            const isThisCorrect = opt === correctStr;
            const isThisChosen = opt === selectedOption;

            let extraStyle: React.CSSProperties = {};
            if (isRevealed) {
              if (isThisCorrect) {
                extraStyle = { borderColor: "var(--neon-green)", background: "rgba(16, 185, 129, 0.25)", color: "#6ee7b7", boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" };
              } else if (isThisChosen) {
                extraStyle = { borderColor: "var(--neon-red)", background: "rgba(255, 42, 95, 0.25)", color: "#fca5a5", boxShadow: "0 0 20px rgba(255, 42, 95, 0.4)" };
              }
            }

            return (
              <button
                key={opt}
                className="tune-opt-btn"
                style={extraStyle}
                disabled={isRevealed}
                onClick={() => handleSelectOption(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Reveal Result Banner */}
        {isRevealed && (
          <div className="headline-reveal-panel" style={{ marginTop: "1rem" }}>
            <span className={`reveal-badge ${isCorrect ? "badge-correct" : "badge-wrong"}`}>
              {isCorrect ? (
                <>
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.4rem" }} />
                  SPOT ON! (+{currentPotentialPoints} PTS)
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faXmark} style={{ marginRight: "0.4rem" }} />
                  INCORRECT
                </>
              )}
            </span>
            <h4 className="reveal-title">
              {currentTrack.song} by {currentTrack.artist} ({currentTrack.year})
            </h4>
            <p className="reveal-context">
              Genre: {currentTrack.genre} • Recorded in official tournament rotation!
            </p>

            <button
              className="btn-action btn-gold"
              onClick={handleNextTrack}
              style={{ width: "100%", maxWidth: "350px" }}
            >
              {currentIdx + 1 < 10 ? (
                <>
                  NEXT TRACK ({currentIdx + 2}/10)
                  <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                </>
              ) : (
                <>
                  FINISH TRACKS & AUDIT SCORE
                  <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.5rem" }} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
