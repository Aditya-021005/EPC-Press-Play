"use client";

import React, { useState, useEffect } from "react";
import { MILLIONAIRE_QUESTIONS_POOL, MillionaireQuestion } from "@/data/millionaire";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faSackDollar,
  faBolt,
  faFire,
  faHourglassHalf,
  faLock,
  faCheck,
  faXmark,
  faTrophy,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

interface ReverseMillionaireProps {
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

export default function ReverseMillionaire({ onFinish, onBack, onUpdateMeta }: ReverseMillionaireProps) {
  // Mode: 100 coins with 5 questions, or 200 coins with 10 questions
  const [initialCoins, setInitialCoins] = useState<number>(100);
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [gameStarted, setGameStarted] = useState(false);

  const [questions, setQuestions] = useState<MillionaireQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(100);

  // Allocations in percentage [A, B, C, D]
  const [percentages, setPercentages] = useState<[number, number, number, number]>([25, 25, 25, 25]);
  const [isDropping, setIsDropping] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [survivedCoins, setSurvivedCoins] = useState(0);

  const currentQ = questions[currentQIndex];

  const handleStartGame = () => {
    sound.playClick(600);
    const shuffled = [...MILLIONAIRE_QUESTIONS_POOL].sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setCurrentCoins(initialCoins);
    setPercentages([25, 25, 25, 25]);
    setIsRevealed(false);
    setIsDropping(false);
    setGameStarted(true);
  };

  const totalAllocatedPct = percentages.reduce((a, b) => a + b, 0);

  const adjustPct = (idx: number, delta: number) => {
    if (isRevealed || isDropping) return;
    sound.playClick(500);
    setPercentages((prev) => {
      const copy = [...prev] as [number, number, number, number];
      const newVal = Math.max(0, Math.min(100, copy[idx] + delta));
      copy[idx] = newVal;
      return copy;
    });
  };

  const applyPreset = (preset: "even" | "clear" | "allIn", index = 0) => {
    if (isRevealed || isDropping) return;
    sound.playClick(600);
    if (preset === "even") {
      setPercentages([25, 25, 25, 25]);
    } else if (preset === "clear") {
      setPercentages([0, 0, 0, 0]);
    } else if (preset === "allIn") {
      const p: [number, number, number, number] = [0, 0, 0, 0];
      p[index] = 100;
      setPercentages(p);
    }
  };

  const handleLockIn = () => {
    if (totalAllocatedPct !== 100) {
      sound.playBuzzer();
      return;
    }

    setIsDropping(true);
    sound.playTrapdoorDrop();

    // After animation, reveal
    setTimeout(() => {
      setIsDropping(false);
      setIsRevealed(true);

      const correctPct = percentages[currentQ.correctIndex];
      const safeCoins = Math.floor((currentCoins * correctPct) / 100);
      setSurvivedCoins(safeCoins);

      if (safeCoins > 0) {
        sound.playSuccess();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        sound.playBuzzer();
      }
    }, 1200);
  };

  const handleProceed = () => {
    sound.playClick();
    const nextCoins = survivedCoins;
    setCurrentCoins(nextCoins);

    // If game over (out of coins) or finished all questions
    if (nextCoins === 0 || currentQIndex + 1 >= totalQuestions) {
      // Calculate tournament score (0 - 100)
      const tournamentPoints = Math.round((nextCoins / initialCoins) * 100);
      sound.playSuccess();
      confetti({ particleCount: 100, spread: 80 });
      onFinish(tournamentPoints);
    } else {
      setCurrentQIndex((prev) => prev + 1);
      setPercentages([25, 25, 25, 25]);
      setIsRevealed(false);
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  useEffect(() => {
    onUpdateMeta?.({
      title: "Rev. Millionaire",
      score: Math.round((currentCoins / initialCoins) * 100),
      roundInfo: gameStarted ? `Q ${currentQIndex + 1}/${totalQuestions} • ${currentCoins} Coins` : "Setup",
    });
  }, [currentCoins, initialCoins, currentQIndex, totalQuestions, gameStarted, onUpdateMeta]);

  return (
    <div className="game-arena">
      <div className="game-body-center rm-stage">
        {!gameStarted ? (
          <div className="offline-hero-card" style={{ maxWidth: "650px" }}>
            <div className="offline-icon-large">
              <FontAwesomeIcon icon={faSackDollar} />
            </div>
            <h3>SELECT GAME LENGTH</h3>
            <p>
              Divide your total coins across 4 trapdoors with percentages adding up to 100%. Only coins on the safe trapdoor carry forward!
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.8rem" }}>
              <button
                className={`btn-mode-toggle ${initialCoins === 100 ? "active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setInitialCoins(100);
                  setTotalQuestions(5);
                }}
              >
                <FontAwesomeIcon icon={faBolt} style={{ marginRight: "0.5rem" }} />
                5 Questions • 100 Coins
              </button>

              <button
                className={`btn-mode-toggle ${initialCoins === 200 ? "active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setInitialCoins(200);
                  setTotalQuestions(10);
                }}
              >
                <FontAwesomeIcon icon={faFire} style={{ marginRight: "0.5rem" }} />
                10 Questions • 200 Coins
              </button>
            </div>

            <button
              className="btn-action btn-gold"
              onClick={handleStartGame}
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
            >
              START TOURNAMENT RUN
              <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
            </button>
          </div>
        ) : (
          <>
            {/* Vault Status Bar */}
            <div className="vault-status-bar">
              <div className="vault-stat">
                <span className="stat-lbl">QUESTION</span>
                <span className="stat-big">{currentQIndex + 1} / {totalQuestions}</span>
              </div>

              <div className="vault-stat highlight-coins">
                <span className="stat-lbl">VAULT COINS REMAINING</span>
                <span className="stat-big">
                  {currentCoins}
                  <FontAwesomeIcon icon={faCoins} style={{ fontSize: "1.05rem", marginLeft: "0.35rem" }} />
                </span>
              </div>

              <div className="vault-stat">
                <span className="stat-lbl">ALLOCATION STATUS</span>
                <span className="stat-big" style={{ color: totalAllocatedPct === 100 ? "var(--neon-green)" : "var(--neon-red)" }}>
                  {totalAllocatedPct}% / 100%
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="rm-question-card">
              <span className="category-pill">{currentQ.category}</span>
              <h3 className="rm-question-text">{currentQ.question}</h3>
            </div>

            {/* 4 Trapdoor Drop Podiums */}
            <div className="trapdoors-grid">
              {currentQ.options.map((optText, idx) => {
                const pct = percentages[idx];
                const coinsOnThis = Math.floor((currentCoins * pct) / 100);
                const isCorrect = idx === currentQ.correctIndex;

                let podiumClass = "";
                if (isRevealed) {
                  podiumClass = isCorrect ? "survived" : "dropped";
                }

                return (
                  <div key={idx} className={`trapdoor-podium ${podiumClass}`}>
                    <div className="podium-letter">{optionLabels[idx]}</div>
                    <div className="podium-option-text">{optText}</div>

                    <div className="podium-coin-display">
                      <div className="coin-amt">
                        {coinsOnThis}
                        <FontAwesomeIcon icon={faCoins} style={{ fontSize: "0.85rem", marginLeft: "0.25rem" }} />
                      </div>
                      <div className="coin-pct">{pct}% of total</div>
                    </div>

                    {!isRevealed && (
                      <>
                        <div className="podium-steppers">
                          <button className="step-btn" onClick={() => adjustPct(idx, -10)}>-10%</button>
                          <button className="step-btn" onClick={() => adjustPct(idx, -5)}>-5%</button>
                          <button className="step-btn" onClick={() => adjustPct(idx, 5)}>+5%</button>
                          <button className="step-btn" onClick={() => adjustPct(idx, 10)}>+10%</button>
                        </div>
                        <button
                          className="btn-secondary-sm"
                          style={{ marginTop: "0.5rem", width: "100%", fontSize: "0.7rem" }}
                          onClick={() => applyPreset("allIn", idx)}
                        >
                          All-In (100%)
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Lock In / Results Controls */}
            {!isRevealed ? (
              <div className="rm-controls-bar">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn-secondary-sm" onClick={() => applyPreset("even")}>
                    Equal Split (25% Each)
                  </button>
                  <button className="btn-secondary-sm" onClick={() => applyPreset("clear")}>
                    Clear (0%)
                  </button>
                </div>

                <button
                  className="btn-lock-in"
                  disabled={totalAllocatedPct !== 100 || isDropping}
                  onClick={handleLockIn}
                >
                  {isDropping ? (
                    <>
                      <FontAwesomeIcon icon={faHourglassHalf} spin style={{ marginRight: "0.5rem" }} />
                      OPENING TRAPDOORS...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faLock} style={{ marginRight: "0.5rem" }} />
                      LOCK IN & OPEN TRAPDOORS!
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="headline-reveal-panel" style={{ width: "100%" }}>
                <span className={`reveal-badge ${survivedCoins > 0 ? "badge-correct" : "badge-wrong"}`}>
                  {survivedCoins > 0 ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.4rem" }} />
                      SAVED {survivedCoins} COINS!
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faXmark} style={{ marginRight: "0.4rem" }} />
                      ALL COINS LOST IN THE DROP!
                    </>
                  )}
                </span>

                <h4 className="reveal-title">
                  Safe Podium was Option {optionLabels[currentQ.correctIndex]}: {currentQ.options[currentQ.correctIndex]}
                </h4>
                <p className="reveal-context">{currentQ.explanation}</p>

                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", marginBottom: "1.2rem" }}>
                  Coins Carrying Forward:{" "}
                  <strong style={{ color: "var(--neon-yellow)" }}>
                    {survivedCoins}
                    <FontAwesomeIcon icon={faCoins} style={{ fontSize: "0.95rem", marginLeft: "0.25rem" }} />
                  </strong>
                </div>

                <button
                  className="btn-action btn-gold"
                  onClick={handleProceed}
                  style={{ width: "100%", maxWidth: "380px" }}
                >
                  {survivedCoins > 0 && currentQIndex + 1 < totalQuestions ? (
                    <>
                      PROCEED TO QUESTION {currentQIndex + 2} OF {totalQuestions}
                      <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                    </>
                  ) : (
                    <>
                      FINISH GAME & AUDIT TOURNAMENT SCORE
                      <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.5rem" }} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
