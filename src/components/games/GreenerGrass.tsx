"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TARGET_WORDS, isValidWord } from "@/data/words";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleCheck,
  faBomb,
  faBuildingColumns,
  faTrophy,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

interface GreenerGrassProps {
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

type TileStatus = "empty" | "active" | "green" | "yellow" | "gray";

interface GuessRecord {
  letters: string[];
  statuses: TileStatus[];
}

const MAX_GUESSES = 6;

export default function GreenerGrass({ onFinish, onBack, onUpdateMeta }: GreenerGrassProps) {
  // 5 words per run
  const [wordList] = useState<string[]>(() => {
    const shuffled = [...TARGET_WORDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });

  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [hazardTriggered, setHazardTriggered] = useState(false);
  const [totalGameScore, setTotalGameScore] = useState(0);
  const [currentWordBanked, setCurrentWordBanked] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Type a 5-letter word and press ENTER");
  const [wordFinished, setWordFinished] = useState(false);
  const [keyboardLetterStatus, setKeyboardLetterStatus] = useState<Record<string, TileStatus>>({});

  const targetWord = wordList[currentWordIdx];

  // Reset board for next word
  const initWord = useCallback(() => {
    setGuesses([]);
    setCurrentGuess("");
    setHazardTriggered(false);
    setCurrentWordBanked(0);
    setWordFinished(false);
    setStatusMsg("Guess 1 of 6: Find green tiles! Avoid yellow hazards!");
    setKeyboardLetterStatus({});
  }, []);

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

      // Pass 1: Greens (exact position)
      for (let i = 0; i < 5; i++) {
        if (guessArr[i] === targetArr[i]) {
          newStatuses[i] = "green";
          targetLetterCounts[guessArr[i]]--;
          greenCount++;
        }
      }

      // Pass 2: Yellows (wrong position)
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

      // Update keyboard
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
        setStatusMsg(`YELLOW HAZARD! Word contained letters in wrong spots. Turn stopped! Target was ${targetWord}`);
        return;
      }

      // Safe: calculate banked greens (4 pts per green)
      const earned = greenCount * 4;
      const newBanked = Math.max(currentWordBanked, earned);
      setCurrentWordBanked(newBanked);

      // Check for 5 greens
      if (greenCount === 5) {
        sound.playSuccess();
        confetti({ particleCount: 50, spread: 60 });
        setWordFinished(true);
        setStatusMsg(`BRILLIANT! Solved in full (+20 PTS)! Target was ${targetWord}`);
        setTotalGameScore((prev) => prev + 20);
        return;
      }

      // Check if max guesses (6) reached
      if (updatedGuesses.length >= MAX_GUESSES) {
        setWordFinished(true);
        setStatusMsg(`All 6 guesses used! Banked ${newBanked} pts.`);
        setTotalGameScore((prev) => prev + newBanked);
      } else {
        sound.playSuccess();
        setStatusMsg(`Safe! Banked ${newBanked} pts. Push your luck or click 'Bank & Advance'!`);
      }
    } else if (key === "BACKSPACE" || key === "DEL") {
      sound.playClick(400);
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      sound.playClick(600);
      setCurrentGuess((prev) => prev + key);
    }
  }, [currentGuess, targetWord, hazardTriggered, wordFinished, guesses, currentWordBanked, keyboardLetterStatus]);

  // Listen to physical keyboard
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

  // Bank & advance to next word
  const bankAndAdvance = () => {
    sound.playCoinDrop();
    const finalScore = totalGameScore + currentWordBanked;
    setTotalGameScore(finalScore);

    if (currentWordIdx + 1 < 5) {
      setCurrentWordIdx((prev) => prev + 1);
      initWord();
    } else {
      finishGame(finalScore);
    }
  };

  // Next word after hazard or finish
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
    onFinish(Math.min(100, score));
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"]
  ];

  useEffect(() => {
    onUpdateMeta?.({
      title: "Greener Grass",
      score: totalGameScore,
      roundInfo: `Word ${currentWordIdx + 1}/5`,
    });
  }, [totalGameScore, currentWordIdx, onUpdateMeta]);

  return (
    <div className="game-arena wordle-arena">
      <div className="game-body-center">
        {/* Rules Reminder / Hazard Banner */}
        {hazardTriggered ? (
          <div className="rules-banner hazard-alert-banner">
            <span className="banner-icon">
              <FontAwesomeIcon icon={faBomb} />
            </span>
            <div>
              <strong>HAZARD STRUCK:</strong> Yellow tile appeared! Play stopped. The word was <strong>{targetWord}</strong>.
            </div>
          </div>
        ) : (
          <div className="rules-banner">
            <span className="banner-icon">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </span>
            <div>
              <strong>RULE:</strong> <strong>4 PTS</strong> for every <strong>GREEN</strong>. <strong>YELLOW</strong> busts! Bank current greens or push your luck!
            </div>
          </div>
        )}

        {/* Wordle Board Grid (6 rows of 5 tiles visible like normal Wordle) */}
        <div className="wordle-board">
          {Array.from({ length: MAX_GUESSES }).map((_, rIdx) => {
            if (rIdx < guesses.length) {
              const row = guesses[rIdx];
              return (
                <div key={rIdx} className="wordle-row">
                  {row.letters.map((char, cIdx) => (
                    <div key={cIdx} className={`wordle-tile ${row.statuses[cIdx]}`}>
                      {char}
                    </div>
                  ))}
                </div>
              );
            }
            if (rIdx === guesses.length && !wordFinished && !hazardTriggered) {
              return (
                <div key={rIdx} className="wordle-row">
                  {Array.from({ length: 5 }).map((_, cIdx) => {
                    const char = currentGuess[cIdx] || "";
                    return (
                      <div key={cIdx} className={`wordle-tile ${char ? "filled" : "empty"}`}>
                        {char}
                      </div>
                    );
                  })}
                </div>
              );
            }
            return (
              <div key={rIdx} className="wordle-row">
                {Array.from({ length: 5 }).map((_, cIdx) => (
                  <div key={cIdx} className="wordle-tile empty" />
                ))}
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="board-action-bar">
          <div className="gg-status-message">{statusMsg}</div>

          {hazardTriggered || wordFinished ? (
            <button
              className="btn-action btn-gold wordle-btn-action"
              onClick={handleNextWord}
            >
              {currentWordIdx + 1 < 5 ? (
                <>
                  PROCEED TO WORD {currentWordIdx + 2} OF 5
                  <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "0.5rem" }} />
                </>
              ) : (
                <>
                  FINISH GAME & AUDIT SCORE
                  <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.5rem" }} />
                </>
              )}
            </button>
          ) : (
            <button
              className="btn-action btn-gold wordle-btn-action"
              onClick={bankAndAdvance}
              disabled={currentWordBanked === 0}
            >
              <FontAwesomeIcon icon={faBuildingColumns} style={{ marginRight: "0.5rem" }} />
              BANK CURRENT GREENS ({currentWordBanked} pts) & ADVANCE
            </button>
          )}
        </div>

        {/* Virtual Keyboard */}
        <div className="virtual-keyboard">
          {keyboardRows.map((row, rIdx) => (
            <div key={rIdx} className="kb-row">
              {row.map((k) => {
                const isWide = k === "ENTER" || k === "DEL";
                const letterStatus = keyboardLetterStatus[k];
                const statusClass = letterStatus ? `key-${letterStatus}` : "";
                return (
                  <button
                    key={k}
                    className={`kb-key ${isWide ? "wide" : ""} ${statusClass}`}
                    onClick={() => handleKeyPress(k === "DEL" ? "BACKSPACE" : k)}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
