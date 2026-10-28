"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/audio";
import { BULLSEYE_CATEGORIES_POOL, BullseyeCategory } from "@/data/bullseye";
import { fetchGameContent } from "@/lib/gameContent";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCrosshairs,
  faTrophy,
  faCheck,
  faRotate,
  faClipboardCheck,
  faFeatherPointed,
} from "@fortawesome/free-solid-svg-icons";

interface OfflineArenaProps {
  currentScore: number;
  activeTeamName: string;
  adminPin: string | null;
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

interface BoardData {
  category: BullseyeCategory;
  guesses: [string, string, string];
  dartsLanded: Array<{ x: number; y: number; id: number }>;
}

export default function OfflineArena({
  currentScore,
  activeTeamName,
  adminPin,
  onFinish,
  onBack,
  onUpdateMeta,
}: OfflineArenaProps) {
  const [categoriesPool, setCategoriesPool] = useState<BullseyeCategory[]>(BULLSEYE_CATEGORIES_POOL);

  // 5 Active Target Boards
  const [boards, setBoards] = useState<BoardData[]>(() => {
    const chosen = [...BULLSEYE_CATEGORIES_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
    return chosen.map((category) => ({
      category,
      guesses: ["", "", ""],
      dartsLanded: [{ x: 50 + (Math.random() * 16 - 8), y: 50 + (Math.random() * 16 - 8), id: 1 }],
    }));
  });

  useEffect(() => {
    fetchGameContent().then((content) => {
      if (content?.bullseye && content.bullseye.length > 0) {
        setCategoriesPool(content.bullseye);
        const chosen = [...content.bullseye].sort(() => 0.5 - Math.random()).slice(0, 5);
        setBoards(
          chosen.map((category) => ({
            category,
            guesses: ["", "", ""],
            dartsLanded: [{ x: 50 + (Math.random() * 16 - 8), y: 50 + (Math.random() * 16 - 8), id: 1 }],
          }))
        );
      }
    });
  }, []);

  const [activeBoardIdx, setActiveBoardIdx] = useState(0);
  const [isThrowing, setIsThrowing] = useState(false);
  const [throwProjectile, setThrowProjectile] = useState<{ active: boolean; targetX: number; targetY: number }>({
    active: false,
    targetX: 50,
    targetY: 50,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Shuffle categories
  const handleReshuffleCategories = () => {
    sound.playClick();
    const chosen = [...categoriesPool].sort(() => 0.5 - Math.random()).slice(0, 5);
    setBoards(
      chosen.map((category) => ({
        category,
        guesses: ["", "", ""],
        dartsLanded: [{ x: 50 + (Math.random() * 16 - 8), y: 50 + (Math.random() * 16 - 8), id: 1 }],
      }))
    );
    setActiveBoardIdx(0);
  };

  // Dart throw simulation
  const handleThrowDart = (boardIdx: number) => {
    if (isThrowing) return;
    setIsThrowing(true);
    sound.playDartThrow();

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.pow(Math.random(), 1.5) * 35;
    const hitX = Math.round(50 + Math.cos(angle) * distance);
    const hitY = Math.round(50 + Math.sin(angle) * distance);

    setThrowProjectile({ active: true, targetX: hitX, targetY: hitY });

    setTimeout(() => {
      sound.playDartHit();
      setBoards((prev) => {
        const copy = [...prev];
        const curBoard = { ...copy[boardIdx] };
        curBoard.dartsLanded = [...curBoard.dartsLanded, { x: hitX, y: hitY, id: Date.now() }].slice(-5);
        copy[boardIdx] = curBoard;
        return copy;
      });
      setThrowProjectile({ active: false, targetX: hitX, targetY: hitY });
      setIsThrowing(false);
    }, 450);
  };

  // Direct click on target
  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>, boardIdx: number) => {
    if (isThrowing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setIsThrowing(true);
    sound.playDartThrow();
    setThrowProjectile({ active: true, targetX: clickX, targetY: clickY });

    setTimeout(() => {
      sound.playDartHit();
      setBoards((prev) => {
        const copy = [...prev];
        const curBoard = { ...copy[boardIdx] };
        curBoard.dartsLanded = [...curBoard.dartsLanded, { x: clickX, y: clickY, id: Date.now() }].slice(-5);
        copy[boardIdx] = curBoard;
        return copy;
      });
      setThrowProjectile({ active: false, targetX: clickX, targetY: clickY });
      setIsThrowing(false);
    }, 400);
  };

  // Guess input change
  const handleGuessChange = (boardIdx: number, guessIdx: number, val: string) => {
    setBoards((prev) => {
      const copy = [...prev];
      const cur = { ...copy[boardIdx] };
      const g = [...cur.guesses] as [string, string, string];
      g[guessIdx] = val;
      cur.guesses = g;
      copy[boardIdx] = cur;
      return copy;
    });
  };

  const handleSubmitAllBoards = () => {
    sound.playSuccess();
    confetti({ particleCount: 80, spread: 70 });
    setIsSubmitted(true);
  };

  const handleReturnToHub = () => {
    sound.playClick();
    onFinish(0);
  };

  useEffect(() => {
    onUpdateMeta?.({
      title: "Bullseye Stage",
      score: currentScore,
      roundInfo: !isSubmitted ? `Board ${activeBoardIdx + 1}/5` : `Boards Submitted to Host`,
    });
  }, [isSubmitted, activeBoardIdx, currentScore, onUpdateMeta]);

  const activeBoard = boards[activeBoardIdx];

  return (
    <div className="game-arena">
      <div className="game-body-center offline-stage" style={{ maxWidth: "1150px" }}>
        {/* Top Control Header */}
        <div
          style={{
            width: "100%",
            background: "var(--paper)",
            border: "3px solid var(--gold-border, var(--ink))",
            boxShadow: "6px 6px 0 var(--ink)",
            borderRadius: "var(--radius-lg)",
            padding: "1.2rem 1.8rem",
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
                background: "var(--c-cherry)",
                color: "#fff",
                fontFamily: "var(--font-mono)",
                fontWeight: 900,
                fontSize: "0.8rem",
                marginBottom: "0.4rem",
                border: "2px solid var(--ink)",
              }}
            >
              LIVE PHYSICAL EVENT SHOWDOWN
            </span>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--ink)" }}>
              <FontAwesomeIcon icon={faBullseye} style={{ marginRight: "0.5rem", color: "var(--c-cherry)" }} />
              Bullseye: Darts & Archery Arena
            </h2>
            <p style={{ color: "var(--muted-paper)", fontSize: "0.9rem", fontWeight: 600 }}>
              Team: <strong style={{ color: "var(--ink)" }}>{activeTeamName}</strong> • Throw darts at 5 target boards & submit 3 guesses per category!
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
            {!isSubmitted && (
              <button type="button" className="btn-secondary-sm" onClick={handleReshuffleCategories}>
                <FontAwesomeIcon icon={faRotate} style={{ marginRight: "0.4rem" }} />
                Re-roll Categories
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE PLAYING MODE: 5 TARGET BOARDS */}
        {!isSubmitted ? (
          <div style={{ width: "100%" }}>
            {/* Board Selector Tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                marginBottom: "1.5rem",
                overflowX: "auto",
                paddingBottom: "0.3rem",
              }}
            >
              {boards.map((b, idx) => {
                const isCurrent = idx === activeBoardIdx;
                const guessesFilled = b.guesses.filter((g) => g.trim().length > 0).length;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setActiveBoardIdx(idx);
                    }}
                    style={{
                      flex: "1 1 180px",
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      border: "3px solid var(--ink)",
                      background: isCurrent ? "var(--c-cherry)" : "var(--paper)",
                      color: isCurrent ? "#fff" : "var(--ink)",
                      boxShadow: isCurrent ? "4px 4px 0 var(--ink)" : "2px 2px 0 var(--ink)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "transform 0.1s ease",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 900 }}>
                      BOARD #{idx + 1}
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {b.category.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", marginTop: "0.2rem", opacity: 0.9 }}>
                      {guessesFilled}/3 Guesses • {b.dartsLanded.length} Darts
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Stage Grid: Interactive Target + Category Guesses */}
            {activeBoard && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* Left: Interactive Target Face with Darts */}
                <div
                  style={{
                    background: "var(--paper)",
                    border: "4px solid var(--ink)",
                    boxShadow: "6px 6px 0 var(--ink)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "0.85rem", color: "var(--muted-paper)" }}>
                      🎯 PHYSICAL TARGET SIMULATOR
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: "0.85rem", color: "var(--c-cherry)" }}>
                      {activeBoard.dartsLanded.length} PROJECTILES ON BOARD
                    </span>
                  </div>

                  {/* SVG Bullseye Board */}
                  <div
                    onClick={(e) => handleTargetClick(e, activeBoardIdx)}
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "340px",
                      aspectRatio: "1/1",
                      borderRadius: "50%",
                      border: "5px solid var(--ink)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                      background: "#111",
                      cursor: "crosshair",
                      overflow: "hidden",
                      margin: "0.5rem 0 1.2rem 0",
                    }}
                  >
                    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block" }}>
                      {/* Outer Ring 1 */}
                      <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#111" strokeWidth="1.5" />
                      {/* Outer Ring 2 */}
                      <circle cx="50" cy="50" r="38" fill="#111111" stroke="#fff" strokeWidth="1" />
                      {/* Mid Ring 1 */}
                      <circle cx="50" cy="50" r="28" fill="#38a3a5" stroke="#111" strokeWidth="1" />
                      {/* Mid Ring 2 */}
                      <circle cx="50" cy="50" r="18" fill="#e63946" stroke="#111" strokeWidth="1" />
                      {/* Inner Bullseye */}
                      <circle cx="50" cy="50" r="8" fill="#ffd166" stroke="#111" strokeWidth="1" />
                      <circle cx="50" cy="50" r="3" fill="#e63946" />

                      {/* Crosshairs */}
                      <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                    </svg>

                    {/* Render Landed Darts */}
                    {activeBoard.dartsLanded.map((dart) => (
                      <div
                        key={dart.id}
                        style={{
                          position: "absolute",
                          left: `${dart.x}%`,
                          top: `${dart.y}%`,
                          transform: "translate(-50%, -50%)",
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#ff0044",
                            border: "2px solid #fff",
                            boxShadow: "0 0 8px #ff0044",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "6px",
                            left: "6px",
                            transform: "rotate(-35deg)",
                            fontSize: "1.2rem",
                            color: "#fff",
                            filter: "drop-shadow(2px 2px 2px #000)",
                          }}
                        >
                          <FontAwesomeIcon icon={faFeatherPointed} />
                        </div>
                      </div>
                    ))}

                    {/* Flying projectile animation */}
                    {throwProjectile.active && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${throwProjectile.targetX}%`,
                          top: `${throwProjectile.targetY}%`,
                          transform: "translate(-50%, -50%) scale(1.6)",
                          transition: "all 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)",
                          fontSize: "1.8rem",
                          color: "#ffc93c",
                          pointerEvents: "none",
                          filter: "drop-shadow(0 0 10px #ffc93c)",
                        }}
                      >
                        🎯
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-action btn-red"
                    onClick={() => handleThrowDart(activeBoardIdx)}
                    disabled={isThrowing}
                    style={{ width: "100%", padding: "0.9rem", fontSize: "1.05rem" }}
                  >
                    <FontAwesomeIcon icon={faBullseye} style={{ marginRight: "0.5rem" }} />
                    {isThrowing ? "THROWING PROJECTILE..." : "THROW DART / SHOOT ARROW"}
                  </button>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--muted-paper)", marginTop: "0.5rem" }}>
                    (Or click directly on the target face above!)
                  </span>
                </div>

                {/* Right: Board Category & 3 Guesses Inputs */}
                <div
                  style={{
                    background: "var(--paper)",
                    border: "4px solid var(--ink)",
                    boxShadow: "6px 6px 0 var(--ink)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.8rem",
                  }}
                >
                  <div style={{ marginBottom: "1.2rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 900,
                        fontSize: "0.8rem",
                        color: "var(--c-cherry)",
                        textTransform: "uppercase",
                      }}
                    >
                      BOARD #{activeBoardIdx + 1} CATEGORY
                    </span>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--ink)", marginTop: "0.2rem" }}>
                      {activeBoard.category.name}
                    </h3>
                    <p style={{ color: "var(--muted-paper)", fontSize: "0.88rem", fontWeight: 600 }}>
                      Category Context: {activeBoard.category.hint}
                    </p>
                  </div>

                  {/* 3 Guesses */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[0, 1, 2].map((gIdx) => (
                      <div key={gIdx}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 800,
                            fontSize: "0.88rem",
                            color: "var(--ink)",
                            marginBottom: "0.35rem",
                          }}
                        >
                          🎯 Guess #{gIdx + 1} for this Category:
                        </label>
                        <input
                          type="text"
                          placeholder={`Enter guess #${gIdx + 1}...`}
                          value={activeBoard.guesses[gIdx]}
                          onChange={(e) => handleGuessChange(activeBoardIdx, gIdx, e.target.value)}
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
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "0.8rem", justifyContent: "space-between" }}>
                    <button
                      type="button"
                      className="btn-secondary-sm"
                      onClick={() => setActiveBoardIdx((prev) => (prev > 0 ? prev - 1 : 4))}
                    >
                      ← Previous Board
                    </button>

                    {activeBoardIdx < 4 ? (
                      <button
                        type="button"
                        className="btn-action btn-gold"
                        onClick={() => setActiveBoardIdx((prev) => prev + 1)}
                      >
                        Next Board →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-action btn-gold"
                        onClick={handleSubmitAllBoards}
                      >
                        SUBMIT ALL TARGET BOARDS
                        <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.5rem" }} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* SUBMITTED CONFIRMATION SCREEN (HOST EVALUATES IN REAL-TIME FROM ADMIN PANEL) */
          /* ========================================================================= */
          <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
            <div
              style={{
                background: "var(--paper)",
                border: "3px solid var(--gold-border, var(--ink))",
                boxShadow: "6px 6px 0 var(--ink)",
                borderRadius: "var(--radius-lg)",
                padding: "1.6rem",
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
                  TARGET ARENA SUBMISSION
                </span>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--ink)" }}>
                  <FontAwesomeIcon icon={faClipboardCheck} style={{ marginRight: "0.5rem", color: "var(--c-cherry)" }} />
                  Target Boards & Guesses Submitted!
                </h2>
                <p style={{ color: "var(--muted-paper)", fontSize: "0.9rem", fontWeight: 600 }}>
                  All 5 boards have been logged for team <strong style={{ color: "var(--ink)" }}>{activeTeamName}</strong>. Official scoring will be completed in real time by the EPC Host via the Admin Panel.
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
                  SUBMITTED
                </strong>
                <span style={{ fontSize: "0.85rem", display: "block", color: "var(--muted-stage)" }}>
                  Awaiting Host Score
                </span>
              </div>
            </div>

            {/* Review Cards for 5 Boards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "1.8rem" }}>
              {boards.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--paper)",
                    border: "3px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--ink)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.1rem 1.4rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: "0.85rem", color: "var(--c-cherry)" }}>
                        BOARD #{idx + 1}
                      </span>
                      <strong style={{ fontSize: "1.1rem", color: "var(--ink)" }}>{b.category.name}</strong>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--muted-paper)", fontWeight: 700 }}>
                      {b.dartsLanded.length} Darts Landed
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
                    {b.guesses.map((g, gIdx) => (
                      <div
                        key={gIdx}
                        style={{
                          background: "rgba(245, 175, 25, 0.1)",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          border: "1px solid var(--ink)",
                        }}
                      >
                        <span style={{ fontSize: "0.7rem", color: "var(--muted-paper)", fontWeight: 800, display: "block" }}>
                          GUESS #{gIdx + 1}
                        </span>
                        <strong style={{ color: "var(--ink)", fontSize: "0.9rem" }}>{g.trim() || "—"}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
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
                Watch the leaderboard update live when your host posts scores.
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
