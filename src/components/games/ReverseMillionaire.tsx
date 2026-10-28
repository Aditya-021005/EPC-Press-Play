"use client";

import React, { useState, useEffect, useRef } from "react";
import { MILLIONAIRE_QUESTIONS_POOL, MillionaireQuestion } from "@/data/millionaire";
import { fetchGameContent } from "@/lib/gameContent";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faSackDollar,
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
  // Fixed game rules: 5 questions, 100 initial coins, 30s per question
  const TOTAL_QUESTIONS = 5;
  const INITIAL_COINS = 100;

  const [pool, setPool] = useState<MillionaireQuestion[]>(MILLIONAIRE_QUESTIONS_POOL);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState<MillionaireQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(INITIAL_COINS);

  useEffect(() => {
    fetchGameContent().then((content) => {
      if (content?.millionaire && content.millionaire.length > 0) {
        setPool(content.millionaire);
      }
    });
  }, []);

  // Exact coins allocated across [A, B, C, D]
  const [coinsAllocated, setCoinsAllocated] = useState<[number, number, number, number]>([25, 25, 25, 25]);
  const [isDropping, setIsDropping] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [survivedCoins, setSurvivedCoins] = useState(0);

  // 30 seconds timer per question
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = questions[currentQIndex] || pool[0];

  const handleStartGame = () => {
    sound.playClick(600);
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setCurrentCoins(INITIAL_COINS);
    setCoinsAllocated([25, 25, 25, 25]);
    setIsRevealed(false);
    setIsDropping(false);
    setGameStarted(true);
    setTimeLeft(30);
  };

  const totalAllocated = coinsAllocated[0] + coinsAllocated[1] + coinsAllocated[2] + coinsAllocated[3];
  const unallocatedCoins = currentCoins - totalAllocated;

  // 30-second countdown effect
  useEffect(() => {
    if (!gameStarted || isRevealed || isDropping) return;

    setTimeLeft(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          sound.playBuzzer();
          executeLockIn();
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
  }, [gameStarted, currentQIndex, isRevealed, isDropping]);

  const adjustCoins = (idx: number, delta: number) => {
    if (isRevealed || isDropping) return;
    sound.playClick(500);

    setCoinsAllocated((prev) => {
      const copy = [...prev] as [number, number, number, number];
      const otherSum = copy.reduce((sum, val, i) => (i === idx ? sum : sum + val), 0);
      const maxPossibleForThis = currentCoins - otherSum;

      const requested = copy[idx] + delta;
      const finalVal = Math.max(0, Math.min(maxPossibleForThis, requested));
      copy[idx] = finalVal;
      return copy;
    });
  };

  const setExactCoins = (idx: number, val: number) => {
    if (isRevealed || isDropping) return;
    setCoinsAllocated((prev) => {
      const copy = [...prev] as [number, number, number, number];
      const otherSum = copy.reduce((sum, v, i) => (i === idx ? sum : sum + v), 0);
      const maxPossibleForThis = currentCoins - otherSum;
      copy[idx] = Math.max(0, Math.min(maxPossibleForThis, val));
      return copy;
    });
  };

  const applyPreset = (preset: "even" | "clear" | "allIn", targetIdx = 0) => {
    if (isRevealed || isDropping) return;
    sound.playClick(600);
    if (preset === "even") {
      const base = Math.floor(currentCoins / 4);
      const rem = currentCoins % 4;
      setCoinsAllocated([base + (rem > 0 ? 1 : 0), base + (rem > 1 ? 1 : 0), base + (rem > 2 ? 1 : 0), base]);
    } else if (preset === "clear") {
      setCoinsAllocated([0, 0, 0, 0]);
    } else if (preset === "allIn") {
      const p: [number, number, number, number] = [0, 0, 0, 0];
      p[targetIdx] = currentCoins;
      setCoinsAllocated(p);
    }
  };

  const executeLockIn = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsDropping(true);
    sound.playTrapdoorDrop();

    setTimeout(() => {
      setIsDropping(false);
      setIsRevealed(true);

      const safe = coinsAllocated[currentQ.correctIndex];
      setSurvivedCoins(safe);

      if (safe > 0) {
        sound.playSuccess();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        sound.playBuzzer();
      }
    }, 1200);
  };

  const handleLockIn = () => {
    if (totalAllocated !== currentCoins) {
      sound.playBuzzer();
      return;
    }
    executeLockIn();
  };

  const handleProceed = () => {
    sound.playClick();
    const nextCoins = survivedCoins;
    setCurrentCoins(nextCoins);

    if (nextCoins === 0 || currentQIndex + 1 >= TOTAL_QUESTIONS) {
      sound.playSuccess();
      confetti({ particleCount: 100, spread: 80 });
      onFinish(0);
    } else {
      setCurrentQIndex((prev) => prev + 1);
      // Default even split of next coins
      const base = Math.floor(nextCoins / 4);
      const rem = nextCoins % 4;
      setCoinsAllocated([base + (rem > 0 ? 1 : 0), base + (rem > 1 ? 1 : 0), base + (rem > 2 ? 1 : 0), base]);
      setIsRevealed(false);
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  useEffect(() => {
    onUpdateMeta?.({
      title: "Rev. Millionaire",
      score: currentCoins,
      roundInfo: gameStarted
        ? `Q ${currentQIndex + 1}/${TOTAL_QUESTIONS} • ${currentCoins} Coins • ${isRevealed ? "Revealed" : `${timeLeft}s`}`
        : "Ready",
    });
  }, [currentCoins, currentQIndex, gameStarted, isRevealed, timeLeft, onUpdateMeta]);

  return (
    <div className="game-arena">
      <div className="game-body-center rm-stage">
        {!gameStarted ? (
          <div className="offline-hero-card" style={{ maxWidth: "600px" }}>
            <div className="offline-icon-large">
              <FontAwesomeIcon icon={faSackDollar} />
            </div>
            <h3 style={{ fontSize: "1.7rem", fontWeight: 900 }}>REVERSE MILLIONAIRE</h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.5, margin: "1rem 0 1.5rem" }}>
              You start with <strong>100 Coins</strong> and face <strong>5 high-stakes questions</strong>.
              Distribute your coins across the 4 trapdoors. Each question gives you <strong>30 seconds</strong>.
              Only coins placed on the safe trapdoor carry forward!
            </p>

            <div
              style={{
                background: "rgba(255, 215, 0, 0.1)",
                border: "2px solid var(--ink)",
                borderRadius: "14px",
                padding: "1rem",
                marginBottom: "1.8rem",
                display: "flex",
                justifyContent: "space-around",
                fontFamily: "var(--font-mono)",
                fontWeight: 800,
              }}
            >
              <div>💰 Starting Vault: 100 Coins</div>
              <div>⏱ Time per Question: 30s</div>
              <div>❓ Total: 5 Questions</div>
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
            {/* Vault Status Bar with 30s Countdown */}
            <div className="vault-status-bar">
              <div className="vault-stat">
                <span className="stat-lbl">QUESTION</span>
                <span className="stat-big">
                  {currentQIndex + 1} / {TOTAL_QUESTIONS}
                </span>
              </div>

              <div className="vault-stat highlight-coins">
                <span className="stat-lbl">VAULT COINS</span>
                <span className="stat-big">
                  {currentCoins}
                  <FontAwesomeIcon icon={faCoins} style={{ fontSize: "1.05rem", marginLeft: "0.35rem" }} />
                </span>
              </div>

              <div className="vault-stat">
                <span className="stat-lbl">UNALLOCATED</span>
                <span
                  className="stat-big"
                  style={{ color: unallocatedCoins === 0 ? "var(--neon-green)" : "var(--neon-red)" }}
                >
                  {unallocatedCoins} Coins
                </span>
              </div>

              <div className="vault-stat">
                <span className="stat-lbl">ROUND TIMER</span>
                <span
                  className="stat-big"
                  style={{ color: timeLeft <= 6 ? "var(--neon-red)" : "var(--c-sun)" }}
                >
                  {isRevealed ? "—" : `${timeLeft}s`}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="rm-question-card">
              <span className="category-pill">{currentQ.category}</span>
              <h3 className="rm-question-text">{currentQ.question}</h3>
            </div>

            {/* 4 Trapdoor Drop Podiums with Direct Coin Allocations */}
            <div className="trapdoors-grid">
              {currentQ.options.map((optText, idx) => {
                const coinsOnThis = coinsAllocated[idx];
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
                      <div className="coin-amt" style={{ fontSize: "1.8rem", fontWeight: 900 }}>
                        {coinsOnThis}
                        <FontAwesomeIcon icon={faCoins} style={{ fontSize: "1rem", marginLeft: "0.35rem" }} />
                      </div>
                      <div className="coin-pct" style={{ fontSize: "0.85rem", color: "var(--muted-paper)" }}>
                        {currentCoins > 0 ? Math.round((coinsOnThis / currentCoins) * 100) : 0}% of vault
                      </div>
                    </div>

                    {!isRevealed && (
                      <>
                        <div className="podium-steppers">
                          <button type="button" className="step-btn" onClick={() => adjustCoins(idx, -10)}>
                            -10
                          </button>
                          <button type="button" className="step-btn" onClick={() => adjustCoins(idx, -1)}>
                            -1
                          </button>
                          <button type="button" className="step-btn" onClick={() => adjustCoins(idx, 1)}>
                            +1
                          </button>
                          <button type="button" className="step-btn" onClick={() => adjustCoins(idx, 10)}>
                            +10
                          </button>
                        </div>

                        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
                          <button
                            type="button"
                            className="btn-secondary-sm"
                            style={{ flex: 1, padding: "0.35rem", fontSize: "0.72rem" }}
                            onClick={() => applyPreset("allIn", idx)}
                          >
                            All-In
                          </button>
                          <button
                            type="button"
                            className="btn-secondary-sm"
                            style={{ flex: 1, padding: "0.35rem", fontSize: "0.72rem" }}
                            onClick={() => setExactCoins(idx, 0)}
                          >
                            Clear
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Lock In / Results Controls */}
            {!isRevealed ? (
              <div className="rm-controls-bar">
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn-secondary-sm" onClick={() => applyPreset("even")}>
                    Even Split
                  </button>
                  <button type="button" className="btn-secondary-sm" onClick={() => applyPreset("clear")}>
                    Clear All
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-lock-in"
                  disabled={unallocatedCoins !== 0 || isDropping}
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
                      LOCK IN {totalAllocated} COINS!
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
                      ALL COINS DROPPED & LOST!
                    </>
                  )}
                </span>

                <h4 className="reveal-title">
                  Safe Door was {optionLabels[currentQ.correctIndex]}: {currentQ.options[currentQ.correctIndex]}
                </h4>
                <p className="reveal-context">{currentQ.explanation}</p>

                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", margin: "1rem 0" }}>
                  Coins Carrying Forward:{" "}
                  <strong style={{ color: "var(--c-sun)", fontSize: "1.5rem" }}>
                    {survivedCoins}
                    <FontAwesomeIcon icon={faCoins} style={{ fontSize: "1.1rem", marginLeft: "0.35rem" }} />
                  </strong>
                </div>

                <button
                  type="button"
                  className="btn-action btn-gold"
                  onClick={handleProceed}
                  style={{ width: "100%", maxWidth: "400px" }}
                >
                  {survivedCoins > 0 && currentQIndex + 1 < TOTAL_QUESTIONS ? (
                    <>
                      PROCEED TO QUESTION {currentQIndex + 2} OF {TOTAL_QUESTIONS}
                      <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                    </>
                  ) : (
                    <>
                      FINISH GAME & LOCK TOURNAMENT SCORE ({survivedCoins} PTS)
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
