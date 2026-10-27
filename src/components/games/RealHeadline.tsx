"use client";

import React, { useState, useEffect } from "react";
import { HEADLINES_POOL, HeadlineItem } from "@/data/headlines";
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
  const [rounds] = useState<HeadlineItem[]>(() => {
    return [...HEADLINES_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    onUpdateMeta?.({
      title: "Headlines",
      score,
      roundInfo: `Round ${currentIdx + 1}/10`,
    });
  }, [score, currentIdx, onUpdateMeta]);

  const currentItem = rounds[currentIdx];

  const handleChoice = (choice: boolean) => {
    if (isRevealed) return;
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
      onFinish(score);
    }
  };

  const isCorrect = selectedAnswer === currentItem?.isReal;

  return (
    <div className="game-arena">
      <div className="game-body-center headline-stage">
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
            <span>Can you separate genuine human oddity from fabricated clickbait?</span>
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
            <span className={`reveal-badge ${isCorrect ? "badge-correct" : "badge-wrong"}`}>
              {isCorrect ? (
                <>
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.4rem" }} />
                  CORRECT GUESS (+10 PTS)
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faXmark} style={{ marginRight: "0.4rem" }} />
                  INCORRECT
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
