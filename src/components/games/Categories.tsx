"use client";

import React, { useState, useEffect, useRef } from "react";
import { CATEGORY_CARDS_POOL, CategoryCard, validateCategoryAnswer } from "@/data/categories";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import LetterWheelModal from "./LetterWheelModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDharmachakra,
  faHourglassHalf,
  faPlay,
  faCheck,
  faRotate,
  faClipboardCheck,
  faTrophy,
  faGlobe,
  faPaw,
  faUtensils,
  faFilm,
  faStar,
  faCarrot,
  faMask,
  faTag,
  faBullhorn,
  faSuitcaseRolling,
  faGuitar,
  faFutbol,
  faBriefcase,
  faWrench,
  faCookie,
  faPaperclip,
  faShapes,
} from "@fortawesome/free-solid-svg-icons";

const CATEGORY_ICON_MAP: Record<string, any> = {
  globe: faGlobe,
  paw: faPaw,
  utensils: faUtensils,
  film: faFilm,
  star: faStar,
  carrot: faCarrot,
  mask: faMask,
  tag: faTag,
  bullhorn: faBullhorn,
  suitcase: faSuitcaseRolling,
  guitar: faGuitar,
  futbol: faFutbol,
  briefcase: faBriefcase,
  wrench: faWrench,
  cookie: faCookie,
  paperclip: faPaperclip,
};

interface CategoriesProps {
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

export default function Categories({ onFinish, onBack, onUpdateMeta }: CategoriesProps) {
  // Deal 5 random category cards
  const [cards, setCards] = useState<CategoryCard[]>(() => {
    return [...CATEGORY_CARDS_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
  });

  const [letter, setLetter] = useState<string>("?");
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditApprovals, setAuditApprovals] = useState<boolean[]>([false, false, false, false, false]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Open letter wheel modal
  const handleOpenWheel = () => {
    if (timerRunning) return;
    sound.playClick();
    setIsWheelModalOpen(true);
  };

  // Re-deal new category cards
  const handleRedeal = () => {
    if (timerRunning) return;
    sound.playClick();
    setCards([...CATEGORY_CARDS_POOL].sort(() => 0.5 - Math.random()).slice(0, 5));
    setAnswers(["", "", "", "", ""]);
    setIsAuditing(false);
  };

  // Start 60s countdown
  const handleStartTimer = () => {
    if (letter === "?" || timerRunning) return;
    sound.playClick(800);
    setTimeLeft(60);
    setTimerRunning(true);
    setIsAuditing(false);
  };

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            sound.playBuzzer();
            handleSubmitAnswers();
            return 0;
          }
          if (prev <= 6) {
            sound.playCountdownBeep(prev === 1);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const handleInputChange = (idx: number, val: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleSubmitAnswers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    sound.playSuccess();

    // Auto check answers with letter
    const approvals = answers.map((ans) => {
      const res = validateCategoryAnswer(ans, letter);
      return res.valid;
    });

    setAuditApprovals(approvals);
    setIsAuditing(true);
  };

  const toggleApproval = (idx: number) => {
    sound.playClick();
    setAuditApprovals((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const finalScore = auditApprovals.filter(Boolean).length * 20;

  const handleConfirmScore = () => {
    sound.playSuccess();
    confetti({ particleCount: 100, spread: 80 });
    onFinish(finalScore);
  };

  useEffect(() => {
    onUpdateMeta?.({
      title: "Categories",
      score: finalScore,
      roundInfo: letter !== "?" ? `Letter: ${letter}` : "Spin Wheel",
    });
  }, [finalScore, letter, onUpdateMeta]);

  return (
    <div className="game-arena">
      <div className="game-body-center cat-stage">
        {/* Controls Strip: Spinner, Timer, Submit */}
        <div className="cat-control-strip">
          <div className="spinner-card">
            <span className="stat-lbl">TARGET LETTER</span>
            <div
              className="spinner-display letter-preview-clickable"
              onClick={handleOpenWheel}
              title="Click to spin the roulette wheel"
            >
              {letter}
            </div>
            <button
              type="button"
              className="btn-action btn-cyan"
              onClick={handleOpenWheel}
              disabled={timerRunning}
            >
              <FontAwesomeIcon icon={faDharmachakra} style={{ marginRight: "0.5rem" }} />
              SPIN LETTER WHEEL
            </button>
          </div>

          <div className="timer-card">
            <span className="stat-lbl">ROUND CLOCK</span>
            <div className="timer-countdown" style={{ color: timeLeft <= 10 ? "var(--neon-red)" : "var(--neon-yellow)" }}>
              {timeLeft}s
            </div>
            <button
              className="btn-action btn-gold"
              onClick={handleStartTimer}
              disabled={letter === "?" || timerRunning || isAuditing}
            >
              {timerRunning ? (
                <>
                  <FontAwesomeIcon icon={faHourglassHalf} spin style={{ marginRight: "0.5rem" }} />
                  TICKING...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlay} style={{ marginRight: "0.5rem" }} />
                  START 60s TIMER
                </>
              )}
            </button>
          </div>

          <div className="action-card">
            <span className="stat-lbl">ACTIONS</span>
            <button
              className="btn-action btn-green"
              onClick={handleSubmitAnswers}
              disabled={!timerRunning && !isAuditing && letter === "?"}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            >
              <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.5rem" }} />
              SUBMIT & AUDIT
            </button>
            <button
              className="btn-secondary-sm"
              onClick={handleRedeal}
              disabled={timerRunning}
              style={{ width: "100%" }}
            >
              <FontAwesomeIcon icon={faRotate} style={{ marginRight: "0.5rem" }} />
              Re-deal Cards
            </button>
          </div>
        </div>

        {/* 5 Category Cards with Inputs */}
        <div className="category-cards-grid">
          {cards.map((card, idx) => (
            <div key={card.id} className="cat-input-card">
              <div className="cat-card-left">
                <span className="cat-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", fontSize: "1.4rem" }}>
                  <FontAwesomeIcon icon={CATEGORY_ICON_MAP[card.icon] || faShapes} />
                </span>
                <div>
                  <div className="cat-title">{card.name}</div>
                  <div className="cat-hint">{card.hint}</div>
                </div>
              </div>

              <input
                type="text"
                className="cat-input-field"
                placeholder={letter !== "?" ? `Answer starting with '${letter}'...` : "Spin letter first..."}
                value={answers[idx]}
                disabled={!timerRunning && !isAuditing}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && timerRunning) {
                    sound.playClick();
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Audit / Review Panel */}
        {isAuditing && (
          <div className="headline-reveal-panel" style={{ width: "100%", textAlign: "left" }}>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--ink)", marginBottom: "0.4rem" }}>
              <FontAwesomeIcon icon={faClipboardCheck} style={{ marginRight: "0.5rem", color: "var(--c-grape)" }} />
              ANSWER AUDIT FOR LETTER{" "}
              <span style={{ background: "var(--c-sun)", color: "var(--ink)", padding: "0.2rem 0.65rem", borderRadius: "8px", border: "2px solid var(--ink)" }}>
                {letter}
              </span>
            </h3>
            <p style={{ color: "var(--muted-paper)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1.2rem" }}>
              Smart auto-check evaluated words starting with &apos;{letter}&apos;. You can click any checkbox to approve/disapprove answers!
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
              {cards.map((card, idx) => {
                const ans = answers[idx].trim();
                const approved = auditApprovals[idx];
                return (
                  <div
                    key={card.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1.2rem",
                      background: approved ? "rgba(61, 214, 140, 0.15)" : "rgba(255, 68, 92, 0.1)",
                      border: `2px solid ${approved ? "var(--c-grass)" : "rgba(22, 19, 63, 0.25)"}`,
                      borderRadius: "12px",
                      color: "var(--ink)",
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--ink)", fontSize: "1.02rem" }}>{card.name}:</strong>{" "}
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: 800, color: approved ? "var(--ink)" : "var(--c-cherry)" }}>
                        {ans || "— (No answer)"}
                      </span>
                    </div>

                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                      <input
                        type="checkbox"
                        checked={approved}
                        onChange={() => toggleApproval(idx)}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: 800, color: "var(--ink)" }}>{approved ? "+20 PTS" : "0 PTS"}</span>
                    </label>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", color: "var(--ink)", fontWeight: 700 }}>
                Total Points Awarded: <strong style={{ color: "var(--c-grass)", fontWeight: 900 }}>{finalScore}</strong> / 100 PTS
              </div>
              <button
                className="btn-action btn-gold"
                onClick={handleConfirmScore}
              >
                ACCEPT & LOCK SCORE INTO TOURNAMENT
                <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.6rem" }} />
              </button>
            </div>
          </div>
        )}
        {/* Letter Wheel Roulette Modal */}
        <LetterWheelModal
          isOpen={isWheelModalOpen}
          onClose={() => setIsWheelModalOpen(false)}
          onSelectLetter={(selectedLetter) => {
            setLetter(selectedLetter);
          }}
          currentLetter={letter}
        />
      </div>
    </div>
  );
}
