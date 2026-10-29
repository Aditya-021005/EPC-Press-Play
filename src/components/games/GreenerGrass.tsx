"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TARGET_WORDS, isValidWord } from "@/data/words";
import { fetchGameContent } from "@/lib/gameContent";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import "@/styles/greener-grass.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faBomb,
  faBuildingColumns,
  faTrophy,
  faArrowRight,
  faHourglassHalf,
  faArrowLeft,
  faHouse,
  faCoins,
  faXmark,
  faCheck,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";

interface GreenerGrassProps {
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

type TileStatus = "empty" | "active" | "green" | "yellow" | "gray";

interface GuessRecord {
  letters: string[];
  statuses: TileStatus[];
}

const MAX_GUESSES = 6;
const TURN_TIMEOUT_SECONDS = 30;

export default function GreenerGrass({ onFinish, onBack, onUpdateMeta }: GreenerGrassProps) {
  // 5 words per run
  const [wordList, setWordList] = useState<string[]>(() => {
    const shuffled = [...TARGET_WORDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });

  useEffect(() => {
    fetchGameContent().then((content) => {
      if (content?.words && content.words.length > 0) {
        const shuffled = [...content.words].sort(() => 0.5 - Math.random());
        setWordList(shuffled.slice(0, 5));
      }
    });
  }, []);

  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [hazardTriggered, setHazardTriggered] = useState(false);
  const [totalGameScore, setTotalGameScore] = useState(0);
  const [currentWordBanked, setCurrentWordBanked] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Type a guess or use the on-screen keyboard.");
  const [wordFinished, setWordFinished] = useState(false);
  const [keyboardLetterStatus, setKeyboardLetterStatus] = useState<Record<string, TileStatus>>({});
  const [solvedWordsCount, setSolvedWordsCount] = useState(0);
  const [showRules, setShowRules] = useState(false);

  // 30-second timer per word guess
  const [timeLeft, setTimeLeft] = useState(TURN_TIMEOUT_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const targetWord = wordList[currentWordIdx] || "GAMES";

  // Reset board for next word
  const initWord = useCallback(() => {
    setGuesses([]);
    setCurrentGuess("");
    setHazardTriggered(false);
    setCurrentWordBanked(0);
    setWordFinished(false);
    setStatusMsg("Type a guess or use the on-screen keyboard.");
    setKeyboardLetterStatus({});
    setTimeLeft(TURN_TIMEOUT_SECONDS);
  }, []);

  // 30s countdown effect
  useEffect(() => {
    if (hazardTriggered || wordFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(TURN_TIMEOUT_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          sound.playHazardAlarm();
          setHazardTriggered(true);
          setWordFinished(true);
          setStatusMsg(`TIME EXPIRED (30s)! The target word was '${targetWord}'`);
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
  }, [guesses.length, currentWordIdx, hazardTriggered, wordFinished, targetWord]);

  // Handle key submissions
  const handleKeyPress = useCallback((key: string) => {
    if (hazardTriggered || wordFinished) return;

    if (key === "ENTER") {
      if (currentGuess.length < 5) {
        sound.playBuzzer();
        setStatusMsg("Word must be 5 letters long!");
        return;
      }
      if (!isValidWord(currentGuess)) {
        sound.playBuzzer();
        setStatusMsg(`'${currentGuess}' is not in dictionary!`);
        return;
      }

      // Reset timer for next guess
      setTimeLeft(TURN_TIMEOUT_SECONDS);

      // Evaluate guess
      const guessArr = currentGuess.split("");
      const targetArr = targetWord.split("");
      const newStatuses: TileStatus[] = ["gray", "gray", "gray", "gray", "gray"];
      const targetLetterCounts: Record<string, number> = {};

      targetArr.forEach((char) => {
        targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
      });

      let greenCount = 0;
      let hasYellow = false;

      // Pass 1: Greens (exact match)
      for (let i = 0; i < 5; i++) {
        if (guessArr[i] === targetArr[i]) {
          newStatuses[i] = "green";
          targetLetterCounts[guessArr[i]]--;
          greenCount++;
        }
      }

      // Pass 2: Yellows (wrong spot)
      for (let i = 0; i < 5; i++) {
        if (newStatuses[i] !== "green") {
          const char = guessArr[i];
          if (targetLetterCounts[char] && targetLetterCounts[char] > 0) {
            newStatuses[i] = "yellow";
            targetLetterCounts[char]--;
            hasYellow = true;
          }
        }
      }

      // Update keyboard letter colors
      const updatedKb = { ...keyboardLetterStatus };
      newStatuses.forEach((status, idx) => {
        const letter = guessArr[idx];
        sound.playTileFlip(idx, status === "green");
        if (status === "green") {
          updatedKb[letter] = "green";
        } else if (status === "yellow" && updatedKb[letter] !== "green") {
          updatedKb[letter] = "yellow";
        } else if (!updatedKb[letter]) {
          updatedKb[letter] = "gray";
        }
      });
      setKeyboardLetterStatus(updatedKb);

      const updatedGuesses = [...guesses, { letters: guessArr, statuses: newStatuses }];
      setGuesses(updatedGuesses);
      setCurrentGuess("");

      // Check for yellow hazard
      if (hasYellow) {
        sound.playHazardAlarm();
        setHazardTriggered(true);
        setWordFinished(true);
        setStatusMsg(`YELLOW HAZARD! Word contained letters in wrong spots. Target was '${targetWord}'`);
        return;
      }

      // Safe: calculate banked greens (4 pts per green)
      const earned = greenCount * 4;
      const newBanked = Math.max(currentWordBanked, earned);
      setCurrentWordBanked(newBanked);

      // Check for 5 greens (Full solve)
      if (greenCount === 5) {
        sound.playSuccess();
        confetti({ particleCount: 60, spread: 65 });
        setWordFinished(true);
        setStatusMsg(`SOLVED! All 5 greens matched (+20 PTS)! Word was '${targetWord}'`);
        setTotalGameScore((prev) => prev + 20);
        setSolvedWordsCount((prev) => prev + 1);
        return;
      }

      // Check if max guesses (6) reached
      if (updatedGuesses.length >= MAX_GUESSES) {
        setWordFinished(true);
        setStatusMsg(`All 6 guesses used! Banked ${newBanked} pts. Target was '${targetWord}'`);
        setTotalGameScore((prev) => prev + newBanked);
        if (newBanked > 0) setSolvedWordsCount((prev) => prev + 1);
      } else {
        sound.playSuccess();
        setStatusMsg(`Safe! +${newBanked} pts available. Bank greens or keep guessing!`);
      }
    } else if (key === "BACKSPACE" || key === "DEL") {
      sound.playClick(400);
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      sound.playClick(600);
      setCurrentGuess((prev) => prev + key);
    }
  }, [currentGuess, targetWord, hazardTriggered, wordFinished, guesses, currentWordBanked, keyboardLetterStatus]);

  // Listen to physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE") {
        handleKeyPress(key);
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  // Bank greens and advance
  const bankAndAdvance = () => {
    sound.playCoinDrop();
    const finalScore = totalGameScore + currentWordBanked;
    setTotalGameScore(finalScore);
    if (currentWordBanked > 0) {
      setSolvedWordsCount((prev) => prev + 1);
    }

    if (currentWordIdx + 1 < 5) {
      setCurrentWordIdx((prev) => prev + 1);
      initWord();
    } else {
      finishGame(finalScore);
    }
  };

  // Next word after round finish or hazard
  const handleNextWord = () => {
    sound.playClick();
    if (currentWordIdx + 1 < 5) {
      setCurrentWordIdx((prev) => prev + 1);
      initWord();
    } else {
      finishGame(totalGameScore);
    }
  };

  const finishGame = (score: number) => {
    sound.playSuccess();
    confetti({ particleCount: 100, spread: 80 });
    onFinish(score);
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  // Sync with global header meta (Timer & End Game are integrated into ArcadeHeader)
  useEffect(() => {
    onUpdateMeta?.({
      title: "Greener Grass",
      score: totalGameScore,
      roundInfo: `Word ${currentWordIdx + 1}/5`,
      timeLeft: hazardTriggered || wordFinished ? 0 : timeLeft,
      totalTime: TURN_TIMEOUT_SECONDS,
      onEndGame: () => finishGame(totalGameScore),
    });
  }, [totalGameScore, currentWordIdx, timeLeft, hazardTriggered, wordFinished, onUpdateMeta]);

  // Format digital timer string: 0:29 or 1:59 style
  const formattedMinutes = Math.floor(timeLeft / 60);
  const formattedSeconds = timeLeft % 60;
  const timeDisplay = `${formattedMinutes}:${formattedSeconds < 10 ? "0" : ""}${formattedSeconds}`;
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / TURN_TIMEOUT_SECONDS) * 100));

  return (
    <div className="gg-screen-wrap">
      {/* =========================================================================
          MAIN TWO-COLUMN SPLIT (DESKTOP/LAPTOP)
          LEFT: 6x5 Greener Grass Board | RIGHT: Stats, Progress, Keyboard, Action
          ========================================================================= */}
      <div className="gg-desktop-grid">
        {/* LEFT COLUMN: GREENER GRASS 6x5 BOARD */}
        <div className="gg-board-card">
          <div className="gg-board-header">
            <span className="gg-badge-round">
              WORD {currentWordIdx + 1} OF 5
            </span>
            <div className="gg-badge-solved">
              <span className="solved-gem">◆</span>
              SOLVED {solvedWordsCount}/5
            </div>
          </div>

          {/* 6 Rows of 5 Letter Tiles */}
          <div className="gg-grid-container" role="grid" aria-label="Greener Grass guess board">
            {Array.from({ length: MAX_GUESSES }).map((_, rIdx) => {
              // Past Evaluated Guess Row
              if (rIdx < guesses.length) {
                const row = guesses[rIdx];
                return (
                  <div key={rIdx} className="gg-grid-row" role="row">
                    {row.letters.map((char, cIdx) => (
                      <div
                        key={cIdx}
                        className={`gg-tile-cell tile-${row.statuses[cIdx]}`}
                        role="gridcell"
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                );
              }

              // Active Typing Row
              if (rIdx === guesses.length && !wordFinished && !hazardTriggered) {
                return (
                  <div key={rIdx} className="gg-grid-row" role="row">
                    {Array.from({ length: 5 }).map((_, cIdx) => {
                      const char = currentGuess[cIdx] || "";
                      const isActiveSlot = cIdx === currentGuess.length;
                      const tileClass = char
                        ? "tile-filled"
                        : isActiveSlot
                        ? "tile-active"
                        : "tile-empty";

                      return (
                        <div
                          key={cIdx}
                          className={`gg-tile-cell ${tileClass}`}
                          role="gridcell"
                        >
                          {char}
                        </div>
                      );
                    })}
                  </div>
                );
              }

              // Future Empty Row
              return (
                <div key={rIdx} className="gg-grid-row" role="row">
                  {Array.from({ length: 5 }).map((_, cIdx) => (
                    <div
                      key={cIdx}
                      className="gg-tile-cell tile-empty"
                      role="gridcell"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS, STATS, PROGRESS & KEYBOARD */}
        <div className="gg-controls-card">
          {/* Top Two Stats Cards (SCORE & ROUND PROGRESS) */}
          <div className="gg-stats-row">
            {/* SCORE CARD */}
            <div className="gg-stat-card card-score">
              <span className="gg-stat-label">TOTAL SCORE</span>
              <div className="gg-stat-val val-score">
                <span>◆</span>
                <span>{totalGameScore}</span>
              </div>
              {currentWordBanked > 0 && !wordFinished && (
                <span className="gg-stat-sub">+{currentWordBanked} pts ready</span>
              )}
            </div>

            {/* ROUND PROGRESS CARD */}
            <div className="gg-stat-card card-progress">
              <span className="gg-stat-label">ROUND PROGRESS</span>
              <div className="gg-stat-val val-word-num">
                <span>WORD {currentWordIdx + 1}</span>
                <span className="val-word-of">/ 5</span>
              </div>
              <span className="gg-stat-sub solved-sub">
                {solvedWordsCount} Words Solved
              </span>
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div
            className="gg-progress-track"
            role="progressbar"
            aria-valuenow={timerPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`gg-progress-fill ${timeLeft <= 6 ? "fill-low" : ""}`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>

          {/* Instructional / Status Message */}
          <div
            className={`gg-instruction-bar ${
              hazardTriggered ? "hazard-active" : currentWordBanked > 0 ? "success-active" : ""
            }`}
          >
            {hazardTriggered && (
              <FontAwesomeIcon icon={faBomb} style={{ marginRight: "0.5rem", color: "#f87171" }} />
            )}
            {statusMsg}
          </div>

          {/* Virtual Keyboard */}
          <div className="gg-keyboard-frame" aria-label="On-screen Keyboard">
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="gg-kb-row">
                {row.map((k) => {
                  const isWide = k === "ENTER" || k === "⌫";
                  const letterStatus = keyboardLetterStatus[k];
                  const statusClass = letterStatus ? `key-${letterStatus}` : "";

                  return (
                    <button
                      key={k}
                      type="button"
                      className={`gg-kb-btn ${isWide ? "kb-btn-wide" : ""} ${statusClass}`}
                      onClick={() => handleKeyPress(k === "⌫" ? "BACKSPACE" : k)}
                      disabled={hazardTriggered || wordFinished}
                      aria-label={k === "⌫" ? "Backspace" : k}
                    >
                      {k === "⌫" ? <FontAwesomeIcon icon={faDeleteLeft} /> : k}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Big Action Submit / Advance Button */}
          <div className="gg-actions-wrap">
            {hazardTriggered || wordFinished ? (
              <button
                type="button"
                className="gg-submit-main-btn"
                onClick={handleNextWord}
              >
                {currentWordIdx + 1 < 5 ? (
                  <>
                    PROCEED TO WORD {currentWordIdx + 2} OF 5
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                ) : (
                  <>
                    FINISH GAME & AUDIT SCORE
                    <FontAwesomeIcon icon={faTrophy} />
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="gg-submit-main-btn"
                  onClick={() => handleKeyPress("ENTER")}
                  disabled={currentGuess.length < 5}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  SUBMIT GUESS
                </button>

                {currentWordBanked > 0 && (
                  <button
                    type="button"
                    className="gg-bank-advance-btn"
                    onClick={bankAndAdvance}
                  >
                    <FontAwesomeIcon icon={faBuildingColumns} />
                    BANK CURRENT GREENS (+{currentWordBanked} PTS) & ADVANCE
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          RULES MODAL (PRESS PLAY THEMED)
          ========================================================================= */}
      {showRules && (
        <div className="gg-rules-overlay" onClick={() => setShowRules(false)}>
          <div className="gg-rules-box" onClick={(e) => e.stopPropagation()}>
            <div className="gg-rules-title">
              <h3>HOW TO PLAY GREENER GRASS</h3>
              <button
                type="button"
                className="gg-top-btn gg-btn-icon"
                onClick={() => setShowRules(false)}
                aria-label="Close rules"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="gg-rules-list">
              <div className="gg-rule-item">
                <div className="gg-rule-icon ri-green">✓</div>
                <div>
                  <strong>GREEN TILE (+4 PTS):</strong> Letter is in the word and in the exact correct position.
                </div>
              </div>

              <div className="gg-rule-item">
                <div className="gg-rule-icon ri-yellow">!</div>
                <div>
                  <strong>YELLOW TILE (HAZARD!):</strong> Letter is in the word but wrong spot. This causes a hazard and ends your current word turn!
                </div>
              </div>

              <div className="gg-rule-item">
                <div className="gg-rule-icon ri-gray">✕</div>
                <div>
                  <strong>GRAY TILE:</strong> Letter is not in the word at all. Safe to continue guessing!
                </div>
              </div>

              <div className="gg-rule-item">
                <div className="gg-rule-icon ri-green">★</div>
                <div>
                  <strong>ALL 5 GREENS (+20 PTS):</strong> Matching all 5 green letters scores the maximum +20 points for that word!
                </div>
              </div>

              <div className="gg-rule-item">
                <div className="gg-rule-icon ri-yellow">⏱</div>
                <div>
                  <strong>30s PER TURN:</strong> Submit each guess before the timer runs out. You can bank your earned greens anytime to advance safely!
                </div>
              </div>
            </div>

            <button
              type="button"
              className="gg-submit-main-btn"
              onClick={() => setShowRules(false)}
              style={{ marginTop: "1.4rem" }}
            >
              GOT IT • RESUME PLAYING
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
