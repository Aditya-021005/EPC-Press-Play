"use client";

import React, { useState, useEffect, useRef } from "react";
import { HEADLINES_POOL, HeadlineItem } from "@/data/headlines";
import { fetchGameContent } from "@/lib/gameContent";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faCheck,
  faXmark,
  faNewspaper,
  faBan,
  faPlay,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

interface RealHeadlineProps {
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

export default function RealHeadline({ onFinish, onBack, onUpdateMeta }: RealHeadlineProps) {
  const [rounds, setRounds] = useState<HeadlineItem[]>(() => {
    return [...HEADLINES_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  useEffect(() => {
    fetchGameContent().then((content) => {
      if (content?.headlines && content.headlines.length > 0) {
        setRounds([...content.headlines].sort(() => 0.5 - Math.random()).slice(0, 10));
      }
    });
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // 20-second timer per headline
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentItem = rounds[currentIdx] || HEADLINES_POOL[0];

  // Timer effect per headline
  useEffect(() => {
    if (isRevealed) return;

    setTimeLeft(20);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          sound.playBuzzer();
          // Timeout counts as incorrect choice (null)
          setSelectedAnswer(null);
          setIsRevealed(true);
          return 0;
        }
        if (prev <= 5) {
          sound.playCountdownBeep(prev === 1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isRevealed]);

  useEffect(() => {
    onUpdateMeta?.({
      title: "Headlines",
      score,
      roundInfo: `Round ${currentIdx + 1}/10 • ${isRevealed ? "Revealed" : `${timeLeft}s`}`,
    });
  }, [score, currentIdx, timeLeft, isRevealed, onUpdateMeta]);

  const handleChoice = (choice: boolean) => {
    if (isRevealed) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(choice);
    setIsRevealed(true);

    const isCorrect = choice === currentItem.isReal;
    if (isCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 50 });
      setScore((prev) => prev + 10);
    } else {
      sound.playBuzzer();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < 10) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
    } else {
      // Completed all 10
      sound.playSuccess();
      confetti({ particleCount: 90, spread: 70 });
      onFinish(0);
    }
  };

  const isCorrect = selectedAnswer === currentItem?.isReal;
  const isTimeout = selectedAnswer === null && isRevealed;

  return (
    <div className="game-arena">
      <div className="game-body-center headline-stage">
        {/* Top Status & 20s Countdown Timer */}
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
            background: "var(--paper)",
            border: "3px solid var(--ink)",
            boxShadow: "5px 5px 0 var(--ink)",
            borderRadius: "var(--radius-lg)",
            padding: "0.85rem 1.4rem",
            marginBottom: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: "var(--c-sun)",
                color: "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontWeight: 900,
                fontSize: "0.8rem",
                border: "2px solid var(--ink)",
              }}
            >
              HEADLINE {currentIdx + 1} OF 10
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700, color: "var(--muted-paper)" }}>
              Current Score: <strong style={{ color: "var(--c-grass)" }}>{score}</strong> / 100 PTS
            </span>
          </div>

          <div
            style={{
              padding: "0.45rem 1.2rem",
              borderRadius: "12px",
              background: timeLeft <= 5 ? "var(--c-cherry)" : "var(--stage)",
              color: timeLeft <= 5 ? "#fff" : "var(--on-stage)",
              border: "3px solid var(--ink)",
              boxShadow: "2px 2px 0 var(--ink)",
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              fontSize: "1.4rem",
              minWidth: "90px",
              textAlign: "center",
            }}
          >
            {isRevealed ? "—" : `${timeLeft}s`}
          </div>
        </div>

        {/* Newspaper Presentation Card */}
        <div className="newspaper-card">
          <div className="newspaper-header">
            <span>{currentItem.outletHint}</span>
            <span>EDITION #{currentIdx + 1}</span>
          </div>

          <div className="news-body">
            <div className="headline-quote-mark">“</div>
            <h3 className="headline-text">{currentItem.headline}</h3>
            <div className="headline-quote-mark closing">”</div>
          </div>

          <div className="news-footer">
            <span>20 Seconds per headline • Spot the real-world truth from fabricated clickbait!</span>
          </div>
        </div>

        {/* Action Choice Buttons */}
        {!isRevealed ? (
          <div className="headline-choices">
            <button
              className="btn-choice real-btn"
              onClick={() => handleChoice(true)}
            >
              <span className="choice-icon">
                <FontAwesomeIcon icon={faCircleCheck} />
              </span>
              <span className="choice-text">REAL HEADLINE</span>
              <span className="choice-sub">Truth is stranger than fiction</span>
            </button>

            <button
              className="btn-choice fake-btn"
              onClick={() => handleChoice(false)}
            >
              <span className="choice-icon">
                <FontAwesomeIcon icon={faCircleXmark} />
              </span>
              <span className="choice-text">FAKE / FABRICATED</span>
              <span className="choice-sub">Made-up satire or myth</span>
            </button>
          </div>
        ) : (
          /* Reveal Panel */
          <div className="headline-reveal-panel">
            <span
              className={`reveal-badge ${
                isCorrect ? "badge-correct" : "badge-wrong"
              }`}
            >
              {isTimeout ? (
                <>
                  <FontAwesomeIcon icon={faXmark} style={{ marginRight: "0.4rem" }} />
                  TIME EXPIRED (0 PTS)
                </>
              ) : isCorrect ? (
                <>
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.4rem" }} />
                  CORRECT GUESS (+10 PTS)
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faXmark} style={{ marginRight: "0.4rem" }} />
                  INCORRECT (0 PTS)
                </>
              )}
            </span>

            <h4 className="reveal-title">
              It was actually{" "}
              {currentItem.isReal ? (
                <>
                  100% REAL NEWS!
                  <FontAwesomeIcon icon={faNewspaper} style={{ marginLeft: "0.4rem" }} />
                </>
              ) : (
                <>
                  COMPLETELY FAKE!
                  <FontAwesomeIcon icon={faBan} style={{ marginLeft: "0.4rem" }} />
                </>
              )}
            </h4>

            <p className="reveal-context">{currentItem.explanation}</p>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1.2rem" }}>
              Source: <em>{currentItem.source}</em>
            </p>

            <button className="btn-action btn-gold" onClick={handleNext} style={{ width: "100%", maxWidth: "350px" }}>
              {currentIdx + 1 < 10 ? (
                <>
                  NEXT HEADLINE ({currentIdx + 2}/10)
                  <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                </>
              ) : (
                <>
                  FINISH ROUND & AUDIT SCORE
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
