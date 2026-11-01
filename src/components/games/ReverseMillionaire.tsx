"use client";

import React, { useState, useEffect, useRef } from "react";
import { MILLIONAIRE_QUESTIONS_POOL, MillionaireQuestion } from "@/data/millionaire";
import { pickNonRepeatingItems } from "@/lib/questionTracker";
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
  isDemo?: boolean;
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: {
    title: string;
    score: number;
    roundInfo?: string;
    timeLeft?: number;
    totalTime?: number;
    onEndGame?: () => void;
  }) => void;
}

// Equal coin distribution helper: assigns base whole coins to each door,
// then distributes any remainder (1, 2, or 3) to distinct random doors (never giving both to the same door)
function distributeCoinsEqually(total: number): [number, number, number, number] {
  if (total <= 0) return [0, 0, 0, 0];
  const base = Math.floor(total / 4);
  const remainder = total % 4; // 0, 1, 2, or 3

  const result: [number, number, number, number] = [base, base, base, base];

  if (remainder > 0) {
    // Pick `remainder` distinct random indices among [0, 1, 2, 3]
    const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
    for (let i = 0; i < remainder; i++) {
      result[indices[i]] += 1;
    }
  }

  return result;
}

export default function ReverseMillionaire({ isDemo = false, onFinish, onBack, onUpdateMeta }: ReverseMillionaireProps) {
  // Fixed game rules: 5 questions, 100 initial coins, 60s (1 min) per question
  const TOTAL_QUESTIONS = 5;
  const INITIAL_COINS = 100;
  const QUESTION_TIMEOUT = 60;

  const [pool] = useState<MillionaireQuestion[]>(MILLIONAIRE_QUESTIONS_POOL);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState<MillionaireQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(INITIAL_COINS);

  // Exact coins allocated across [A, B, C, D] (starts at 0 for all rounds, manually assigned by player)
  const [coinsAllocated, setCoinsAllocated] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [isDropping, setIsDropping] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [survivedCoins, setSurvivedCoins] = useState(0);

  // 60 seconds (1 minute) timer per question
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMEOUT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const currentQ = questions[currentQIndex] || pool[0];

  const handleStartGame = () => {
    sound.playClick(600);
    const selected = pickNonRepeatingItems("epc_used_millionaire_questions", pool, TOTAL_QUESTIONS, (q) => q.id);
    setQuestions(selected);
    setCurrentQIndex(0);
    setCurrentCoins(INITIAL_COINS);
    setCoinsAllocated([0, 0, 0, 0]);
    setIsRevealed(false);
    setIsDropping(false);
    setGameStarted(true);
    setTimeLeft(QUESTION_TIMEOUT);
  };

  const totalAllocated = coinsAllocated[0] + coinsAllocated[1] + coinsAllocated[2] + coinsAllocated[3];
  const unallocatedCoins = currentCoins - totalAllocated;

  // 60-second countdown effect
  useEffect(() => {
    if (!gameStarted || isRevealed || isDropping) return;

    setTimeLeft(QUESTION_TIMEOUT);
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
      setCoinsAllocated(distributeCoinsEqually(currentCoins));
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

    // If no coins have been assigned to anyone, assign coins equally (e.g. 6 pts -> 1, 2, 2, 1)
    let finalAllocation: [number, number, number, number] = [...coinsAllocated];
    const totalAllocatedSoFar = finalAllocation[0] + finalAllocation[1] + finalAllocation[2] + finalAllocation[3];

    if (totalAllocatedSoFar === 0) {
      finalAllocation = distributeCoinsEqually(currentCoins);
      setCoinsAllocated(finalAllocation);
    } else if (totalAllocatedSoFar < currentCoins) {
      // Distribute remaining unallocated coins equally among doors
      const remainderToDistribute = currentCoins - totalAllocatedSoFar;
      const extra = distributeCoinsEqually(remainderToDistribute);
      finalAllocation = [
        finalAllocation[0] + extra[0],
        finalAllocation[1] + extra[1],
        finalAllocation[2] + extra[2],
        finalAllocation[3] + extra[3],
      ];
      setCoinsAllocated(finalAllocation);
    }

    setTimeout(() => {
      setIsDropping(false);
      setIsRevealed(true);

      const safe = finalAllocation[currentQ.correctIndex];
      setSurvivedCoins(safe);
      setCurrentCoins(safe);

      onUpdateMeta?.({
        title: "Rev. Millionaire",
        score: safe,
        roundInfo: `Q ${currentQIndex + 1}/${TOTAL_QUESTIONS} • ${safe} Coins Safe`,
      });

      if (safe > 0) {
        sound.playSuccess();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        sound.playBuzzer();
      }
    }, 1200);
  };

  const handleLockIn = () => {
    executeLockIn();
  };

  const [autoAdvanceSec, setAutoAdvanceSec] = useState<number | null>(null);
  const handleProceedRef = useRef<() => void>(() => {});

  const handleProceed = () => {
    sound.playClick();
    const nextCoins = survivedCoins;

    if (nextCoins === 0 || currentQIndex + 1 >= TOTAL_QUESTIONS) {
      sound.playSuccess();
      confetti({ particleCount: 100, spread: 80 });
      onFinish(nextCoins);
    } else {
      const nextQ = currentQIndex + 1;
      setCurrentQIndex(nextQ);
      // All rounds start at 0 coins allocated, so player assigns them manually!
      setCoinsAllocated([0, 0, 0, 0]);
      setIsRevealed(false);
      setAutoAdvanceSec(null);
      onUpdateMeta?.({
        title: "Rev. Millionaire",
        score: nextCoins,
        roundInfo: `Q ${nextQ + 1}/${TOTAL_QUESTIONS} • ${nextCoins} Coins • 1 Min`,
      });
    }
  };

  useEffect(() => {
    handleProceedRef.current = handleProceed;
  });

  // Auto-advance in 5s when answer is revealed
  useEffect(() => {
    if (!isRevealed) {
      setAutoAdvanceSec(null);
      return;
    }
    setAutoAdvanceSec(5);
    const advanceTimer = setInterval(() => {
      setAutoAdvanceSec((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(advanceTimer);
          handleProceedRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(advanceTimer);
  }, [isRevealed, currentQIndex]);

  const optionLabels = ["A", "B", "C", "D"];

  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  const onUpdateMetaRef = useRef(onUpdateMeta);
  useEffect(() => {
    onUpdateMetaRef.current = onUpdateMeta;
  });

  useEffect(() => {
    onUpdateMetaRef.current?.({
      title: "Rev. Millionaire",
      score: gameStarted && (isRevealed || currentQIndex > 0) ? currentCoins : 0,
      roundInfo: gameStarted
        ? `Q ${currentQIndex + 1}/${TOTAL_QUESTIONS} • ${currentCoins} Coins • ${isRevealed ? "Revealed" : `${timeLeft}s`}`
        : "Ready",
      timeLeft: gameStarted && !isRevealed && !isDropping ? timeLeft : undefined,
      totalTime: 60,
      onEndGame: gameStarted ? () => onFinishRef.current(isRevealed ? survivedCoins : currentCoins) : undefined,
    });
  }, [currentCoins, currentQIndex, gameStarted, isRevealed, isDropping, timeLeft, survivedCoins]);

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
              Distribute your coins across the 4 trapdoors. Each question gives you <strong>1 minute (60s)</strong>.
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
              <div>⏱ Time per Question: 60s (1 min)</div>
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
                      {!isRevealed ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                          <input
                            type="number"
                            min={0}
                            max={currentCoins}
                            value={coinsOnThis === 0 ? "" : coinsOnThis}
                            placeholder="0"
                            onChange={(e) => {
                              const raw = e.target.value.trim();
                              if (raw === "") {
                                setExactCoins(idx, 0);
                              } else {
                                const parsed = parseInt(raw, 10);
                                if (!isNaN(parsed)) {
                                  setExactCoins(idx, Math.max(0, parsed));
                                }
                              }
                            }}
                            className="podium-coin-input"
                            style={{
                              width: "82px",
                              height: "40px",
                              textAlign: "center",
                              fontSize: "1.45rem",
                              fontWeight: 900,
                              fontFamily: "var(--font-mono, monospace)",
                              background: "#ffffff",
                              color: "var(--ink, #000)",
                              border: "2px solid var(--ink, #000)",
                              borderRadius: "8px",
                              boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
                              outline: "none",
                            }}
                            aria-label={`Enter coins for option ${optionLabels[idx]}`}
                          />
                          <FontAwesomeIcon icon={faCoins} style={{ fontSize: "1.1rem", color: "var(--gold-primary, #f5af19)" }} />
                        </div>
                      ) : (
                        <div className="coin-amt" style={{ fontSize: "1.6rem", fontWeight: 900 }}>
                          {coinsOnThis}
                          <FontAwesomeIcon icon={faCoins} style={{ fontSize: "1rem", marginLeft: "0.35rem" }} />
                        </div>
                      )}
                      <div className="coin-pct" style={{ fontSize: "0.82rem", color: "var(--muted-paper)", marginTop: "0.25rem" }}>
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
                  disabled={isDropping}
                  onClick={handleLockIn}
                >
                  {isDropping ? (
                    <>
                      <FontAwesomeIcon icon={faHourglassHalf} spin style={{ marginRight: "0.5rem" }} />
                      OPENING TRAPDOORS...
                    </>
                  ) : totalAllocated === 0 ? (
                    <>
                      <FontAwesomeIcon icon={faLock} style={{ marginRight: "0.5rem" }} />
                      SPLIT EQUALLY & LOCK IN ({currentCoins} COINS)
                    </>
                  ) : unallocatedCoins > 0 ? (
                    <>
                      <FontAwesomeIcon icon={faLock} style={{ marginRight: "0.5rem" }} />
                      SPLIT REST ({unallocatedCoins}) & LOCK IN
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
                  style={{ width: "100%", maxWidth: "420px" }}
                >
                  {survivedCoins > 0 && currentQIndex + 1 < TOTAL_QUESTIONS ? (
                    <>
                      PROCEED TO QUESTION {currentQIndex + 2} OF {TOTAL_QUESTIONS} {autoAdvanceSec !== null ? `(${autoAdvanceSec}s)` : ""}
                      <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                    </>
                  ) : (
                    <>
                      FINISH GAME & LOCK TOURNAMENT SCORE ({survivedCoins} PTS) {autoAdvanceSec !== null ? `(${autoAdvanceSec}s)` : ""}
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
