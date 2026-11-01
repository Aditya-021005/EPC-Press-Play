"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { sound } from "@/lib/audio";
import { BULLSEYE_SPINNERS, SpinnerDefinition } from "@/data/bullseye";
import confetti from "canvas-confetti";
import "@/styles/offline.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faRotate,
  faCheck,
  faPaperPlane,
  faTrophy,
  faArrowLeft,
  faStar,
  faDice,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { submitGameAnswers, BullseyeSubmissionItem, BullseyeCriteriaItem } from "@/lib/tournamentState";

interface OfflineArenaProps {
  currentScore: number;
  activeTeamName: string;
  adminPin: string | null;
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

// 6 Distinct Jewel Colors for the 6 Slices
const SLICE_COLORS = [
  "#f5af19", // Sultan Gold
  "#8b5cf6", // Royal Violet
  "#10b981", // Emerald Green
  "#ec4899", // Ruby Rose
  "#3b82f6", // Sapphire Blue
  "#f97316", // Amber Sunset
];

// Short wedge labels for high-legibility rendering inside wheel slices
const SHORT_SLICE_LABELS: Record<string, string[]> = {
  genre: ["Romance", "Comedy", "Thriller", "Horror", "Fantasy", "Drama"],
  rating: ["4–5", "5–6", "6–7", "7–8", "8–9", "9–10"],
  releaseYear: ["< 1970", "1970–89", "1990–99", "2000–09", "2010–19", "2020–26"],
  setting: ["School", "Work", "Village", "City", "History", "Fantasy"],
  origin: ["IND/PK", "USA/MEX", "UK/AUS", "KR/JPN", "FRA/ESP", "GER/RUS"],
};

export default function OfflineArena({
  currentScore,
  activeTeamName,
  adminPin,
  isDemo = false,
  onFinish,
  onBack,
  onUpdateMeta,
}: OfflineArenaProps) {
  // 5 Spinners: Current landed option index (0 to 5) for each wheel
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() =>
    BULLSEYE_SPINNERS.map((sp) => Math.floor(Math.random() * sp.options.length))
  );

  // Rotation angles for each of the 5 wheels in degrees
  const [rotations, setRotations] = useState<number[]>(() =>
    BULLSEYE_SPINNERS.map((_, idx) => {
      // Initialize rotation so that initial selectedIndex is aligned at 12 o'clock (270 deg)
      const angleStep = 60;
      const midAngle = 0 * angleStep + angleStep / 2;
      return (270 - midAngle + 720) % 360;
    })
  );

  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // 3 Answer Input Boxes + Optional Notes
  const [answers, setAnswers] = useState<[string, string, string]>(["", "", ""]);
  const [notes, setNotes] = useState<[string, string, string]>(["", "", ""]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const answersRef = useRef(answers);
  const notesRef = useRef(notes);
  const selectedIndicesRef = useRef(selectedIndices);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { notesRef.current = notes; }, [notes]);
  useEffect(() => { selectedIndicesRef.current = selectedIndices; }, [selectedIndices]);

  // Clean up timers on unmount and scroll to top
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = useCallback(async (isForced = false) => {
    if (isSubmitted) return;

    const currentAnswers = answersRef.current;
    const currentNotes = notesRef.current;
    const currentSelected = selectedIndicesRef.current;

    const hasAnyAnswer = currentAnswers.some((a) => a.trim().length > 0);
    if (!isForced && !hasAnyAnswer) {
      sound.playBuzzer();
      setValidationError("Please enter at least 1 answer before submitting for evaluation!");
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    sound.playSuccess();
    confetti({ particleCount: 90, spread: 75 });
    setIsSubmitted(true);
    setTimeLeft(null);

    const criteriaPayload: BullseyeCriteriaItem[] = BULLSEYE_SPINNERS.map((sp, idx) => ({
      id: sp.id,
      title: sp.title,
      shortLabel: sp.shortLabel,
      selectedOption: sp.options[currentSelected[idx]],
    }));

    const submissionPayload: BullseyeSubmissionItem = {
      criteria: criteriaPayload,
      answers: currentAnswers,
      answerNotes: currentNotes,
      guesses: currentAnswers,
      categoryName: "5 Simultaneous Spinners",
      hint: criteriaPayload.map((c) => `${c.shortLabel}: ${c.selectedOption}`).join(" • "),
    };

    if (!isDemo && activeTeamName) {
      await submitGameAnswers(activeTeamName, "offlineGame", { items: [submissionPayload] });
    }
  }, [isSubmitted, activeTeamName, isDemo]);

  // Simultaneous 5-Wheel Spin Handler
  const handleSpinAll = useCallback(() => {
    if (isSpinning || isSubmitted) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(null);

    sound.playClick(750);
    setIsSpinning(true);
    setValidationError("");
    setHasSpun(false);

    // Pick 5 random target indices (one for each wheel)
    const targetIndices = BULLSEYE_SPINNERS.map((sp) =>
      Math.floor(Math.random() * sp.options.length)
    );

    const angleStep = 60; // 360 / 6 options
    const nextRotations = targetIndices.map((targetIdx, wheelIdx) => {
      const currentRotation = rotations[wheelIdx];
      // Pointer is at 12 o'clock (270 degrees in SVG coordinate space)
      const sliceCenterAngle = targetIdx * angleStep + angleStep / 2;
      const currentMod = ((currentRotation % 360) + 360) % 360;
      const delta = (270 - sliceCenterAngle - currentMod + 720) % 360;

      // 5 to 7 full dramatic revolutions per wheel
      const extraRevolutions = 360 * (5 + wheelIdx * 0.4);
      return currentRotation + extraRevolutions + delta;
    });

    setRotations(nextRotations);

    // Decelerating tactile clicking sounds
    const spinDuration = 3800;
    let elapsed = 0;
    const tickStep = () => {
      const progress = elapsed / spinDuration;
      const interval = 60 + Math.pow(progress, 2.5) * 380;
      sound.playWheelTick();
      elapsed += interval;
      if (elapsed < spinDuration - 120) {
        setTimeout(tickStep, interval);
      }
    };
    tickStep();

    // Wheel stop resolution - topics are assigned now, giving 2 minutes (120s)!
    spinTimeoutRef.current = setTimeout(() => {
      setSelectedIndices(targetIndices);
      setIsSpinning(false);
      setHasSpun(true);
      setTimeLeft(120); // 2 minutes starts once topics are assigned
      sound.playSuccess();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, spinDuration);
  }, [isSpinning, isSubmitted, rotations]);

  // 2-minute countdown interval once topics are assigned
  useEffect(() => {
    if (!hasSpun || isSubmitted || isSpinning || timeLeft === null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      // Auto-submit when time expires!
      handleSubmit(true);
      return;
    }

    if (timeLeft <= 5) {
      sound.playCountdownBeep(timeLeft === 1);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t !== null && t > 0 ? t - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasSpun, isSubmitted, isSpinning, timeLeft, handleSubmit]);

  const handleAnswerChange = (idx: 0 | 1 | 2, val: string) => {
    setAnswers((prev) => {
      const next: [string, string, string] = [...prev];
      next[idx] = val;
      return next;
    });
    if (validationError) setValidationError("");
  };

  const handleNoteChange = (idx: 0 | 1 | 2, val: string) => {
    setNotes((prev) => {
      const next: [string, string, string] = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const onUpdateMetaRef = useRef(onUpdateMeta);
  useEffect(() => {
    onUpdateMetaRef.current = onUpdateMeta;
  });

  useEffect(() => {
    const formattedTimer = timeLeft !== null
      ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`
      : "2:00";
    onUpdateMetaRef.current?.({
      title: "Bullseye Spinners",
      score: currentScore,
      roundInfo: !hasSpun
        ? "Spin 5 Wheels to Begin"
        : !isSubmitted
        ? `2 Min Timer • ${formattedTimer} Left`
        : "Answers Submitted",
      timeLeft: hasSpun && !isSubmitted && !isSpinning && timeLeft !== null ? timeLeft : undefined,
      totalTime: 120,
      onEndGame: !isSubmitted && hasSpun ? () => handleSubmit(true) : undefined,
    });
  }, [isSubmitted, currentScore, hasSpun, isSpinning, timeLeft, handleSubmit]);

  const landedCriteria = BULLSEYE_SPINNERS.map((sp, idx) => ({
    label: sp.shortLabel,
    value: sp.options[selectedIndices[idx]],
  }));

  // SVG dimensions for each circular spinner wheel
  const wheelSize = 200;
  const cx = wheelSize / 2;
  const cy = wheelSize / 2;
  const radius = wheelSize / 2 - 10;
  const angleStep = 360 / 6; // 60 degrees

  return (
    <div className="game-arena">
      <div className="bullseye-arena-wrap">
        {/* Top Hero Banner */}
        <div className="bullseye-hero-card">
          <div className="bullseye-hero-title-group">
            <span className="bullseye-hero-tag">
              <FontAwesomeIcon icon={faDice} />
              5 SIMULTANEOUS WHEEL SPINNERS
            </span>
            <h2>
              <FontAwesomeIcon icon={faBullseye} style={{ color: "var(--c-sun)" }} />
              Bullseye: 5 Criteria Spinners
            </h2>
            <p className="bullseye-hero-sub">
              Active Team: <strong style={{ color: "var(--ink)" }}>{activeTeamName || "Current Team"}</strong> • Spin all 5 wheels simultaneously, then enter 3 answers matching as many criteria as possible!
            </p>
          </div>

          {!isSubmitted && (
            <button
              type="button"
              className="btn-spin-all"
              onClick={handleSpinAll}
              disabled={isSpinning}
            >
              <FontAwesomeIcon icon={faRotate} spin={isSpinning} />
              {isSpinning ? "SPINNING ALL 5 WHEELS..." : "SPIN ALL 5 WHEELS"}
            </button>
          )}
        </div>

        {/* 5 CIRCULAR WHEELS MACHINE */}
        <div className="spinners-machine-card">
          <div className="spinners-machine-header">
            <div className="spinners-machine-badge">
              <FontAwesomeIcon icon={faStar} style={{ color: "var(--gold-primary)" }} />
              CIRCULAR WHEEL SPINNERS (SIMULTANEOUS ROTATION)
            </div>
            <div style={{ color: "var(--muted-stage)", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}>
              {isSpinning ? "Wheels spinning at high speed..." : "5 Criteria Locked"}
            </div>
          </div>

          <div className="spinners-wheels-grid">
            {BULLSEYE_SPINNERS.map((spinner, wheelIdx) => {
              const currentLandedOpt = spinner.options[selectedIndices[wheelIdx]];
              const shortLabels = SHORT_SLICE_LABELS[spinner.id] || spinner.options;
              const currentRot = rotations[wheelIdx];

              return (
                <div
                  key={spinner.id}
                  className={`wheel-card ${isSpinning ? "is-spinning" : ""}`}
                >
                  <div className="wheel-card-head">
                    <span>#{wheelIdx + 1}</span>
                    <span>{spinner.shortLabel}</span>
                  </div>

                  {/* Circular Wheel Stage with Top Needle Pointer */}
                  <div className="wheel-stage">
                    <div className="wheel-pointer" />

                    <div
                      className="wheel-rotor"
                      style={{
                        transform: `rotate(${currentRot}deg)`,
                        transition: isSpinning
                          ? "transform 3.8s cubic-bezier(0.12, 0.8, 0.18, 1)"
                          : "none",
                      }}
                    >
                      <svg viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
                        {/* Outer Metallic Rim */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius + 8}
                          fill="#1d0a3d"
                          stroke="#0d041c"
                          strokeWidth="5"
                        />

                        {/* 6 Pie Slices */}
                        {spinner.options.map((_, sliceIdx) => {
                          const startAngle = sliceIdx * angleStep;
                          const endAngle = (sliceIdx + 1) * angleStep;
                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (endAngle * Math.PI) / 180;

                          const x1 = cx + radius * Math.cos(startRad);
                          const y1 = cy + radius * Math.sin(startRad);
                          const x2 = cx + radius * Math.cos(endRad);
                          const y2 = cy + radius * Math.sin(endRad);

                          const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                          // Text angle and placement along wedge
                          const midAngle = startAngle + angleStep / 2;
                          const midRad = (midAngle * Math.PI) / 180;
                          const textR = radius * 0.65;
                          const tx = cx + textR * Math.cos(midRad);
                          const ty = cy + textR * Math.sin(midRad);

                          const sliceColor = SLICE_COLORS[sliceIdx % SLICE_COLORS.length];
                          const labelText = shortLabels[sliceIdx] || `${sliceIdx + 1}`;

                          return (
                            <g key={sliceIdx}>
                              <path
                                d={pathData}
                                fill={sliceColor}
                                stroke="#0d041c"
                                strokeWidth="2.5"
                              />
                              <text
                                x={tx}
                                y={ty}
                                fill="#ffffff"
                                stroke="#0d041c"
                                strokeWidth="0.8"
                                fontSize="12"
                                fontWeight="900"
                                fontFamily="var(--font-mono), system-ui, sans-serif"
                                textAnchor="middle"
                                dominantBaseline="central"
                                transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                              >
                                {labelText}
                              </text>
                            </g>
                          );
                        })}

                        {/* Outer Rim Studs / Rivets */}
                        {[0, 60, 120, 180, 240, 300].map((deg) => {
                          const rad = (deg * Math.PI) / 180;
                          const rx = cx + (radius + 4) * Math.cos(rad);
                          const ry = cy + (radius + 4) * Math.sin(rad);
                          return (
                            <circle
                              key={deg}
                              cx={rx}
                              cy={ry}
                              r="2.5"
                              fill="#ffd700"
                              stroke="#0d041c"
                              strokeWidth="1"
                            />
                          );
                        })}

                        {/* Center Golden Medallion Hub */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="18"
                          fill="url(#goldSheen)"
                          stroke="#0d041c"
                          strokeWidth="3"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r="14"
                          fill="#f5af19"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r="6"
                          fill="#ffd700"
                          stroke="#0d041c"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Landed Option Badge Under Wheel */}
                  <div className="wheel-landed-badge">
                    {isSpinning ? "Spinning…" : currentLandedOpt}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Respin / Status Bar */}
          {!isSubmitted && (
            <div className="spin-controls-bar">
              <button
                type="button"
                className="btn-spin-all"
                onClick={handleSpinAll}
                disabled={isSpinning}
                style={{ fontSize: "1.1rem", padding: "0.9rem 2rem" }}
              >
                <FontAwesomeIcon icon={faRotate} spin={isSpinning} />
                {isSpinning ? "SPINNING ALL 5 WHEELS..." : "RE-SPIN ALL 5 WHEELS"}
              </button>
            </div>
          )}
        </div>

        {/* CRITERIA SUMMARY BANNER */}
        <div className="criteria-summary-banner">
          <div className="criteria-banner-title">
            CURRENT 5 LANDED CRITERIA:
          </div>
          <div className="criteria-chips-row">
            {landedCriteria.map((c, idx) => (
              <span key={idx} className="criteria-pill">
                <span className="criteria-pill-label">{c.label}:</span>
                <span>{c.value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3 ANSWERS SUBMISSION SECTION */}
        {!isSubmitted ? (
          <div className="answers-section-card">
            <div className="answers-section-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3>ENTER YOUR 3 ANSWERS</h3>
                  <p>
                    Enter 3 answers that satisfy as many of the 5 criteria above as possible. Judges will score based on how many criteria each answer satisfies (up to 100 PTS total).
                  </p>
                </div>
                {hasSpun && !isSubmitted && timeLeft !== null && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.6rem 1.4rem",
                      borderRadius: "14px",
                      background: timeLeft <= 15 ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 175, 25, 0.15)",
                      border: timeLeft <= 15 ? "2.5px solid #ef4444" : "2.5px solid var(--gold-primary, #f5af19)",
                      color: timeLeft <= 15 ? "#ef4444" : "var(--gold-primary, #f5af19)",
                      fontWeight: 900,
                      fontSize: "1.3rem",
                      fontFamily: "var(--font-mono, monospace)",
                    }}
                  >
                    <FontAwesomeIcon icon={faClock} spin={timeLeft <= 15} />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")} LEFT</span>
                  </div>
                )}
              </div>
            </div>

            {validationError && (
              <div
                style={{
                  padding: "0.75rem 1.2rem",
                  background: "#fee2e2",
                  color: "#991b1b",
                  border: "2px solid #ef4444",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                }}
              >
                {validationError}
              </div>
            )}

            <div className="answer-cards-grid">
              {[0, 1, 2].map((idx) => {
                const num = idx + 1;
                return (
                  <div key={idx} className="answer-card">
                    <div className="answer-card-header">
                      <span className="answer-card-badge">ANSWER #{num}</span>
                      <span className="answer-card-hint">
                        Matches: {landedCriteria.map((c) => c.label).join(", ")}
                      </span>
                    </div>

                    <input
                      type="text"
                      className="answer-input-title"
                      placeholder={`Answer #${num}`}
                      value={answers[idx as 0 | 1 | 2]}
                      onChange={(e) => handleAnswerChange(idx as 0 | 1 | 2, e.target.value)}
                    />

                    <textarea
                      className="answer-input-notes"
                      rows={1}
                      placeholder={`Optional note for Answer #${num}...`}
                      value={notes[idx as 0 | 1 | 2]}
                      onChange={(e) => handleNoteChange(idx as 0 | 1 | 2, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="bullseye-submit-bar">
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={onBack}
                style={{ padding: "0.8rem 1.4rem", fontSize: "0.95rem" }}
              >
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "0.4rem" }} />
                Back to Arcade Hub
              </button>

              <button
                type="button"
                className="btn-submit-bullseye"
                onClick={() => handleSubmit(false)}
                disabled={isSpinning || !hasSpun}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                {!hasSpun ? "SPIN 5 WHEELS FIRST" : "SUBMIT 3 ANSWERS FOR HOST EVALUATION"}
              </button>
            </div>
          </div>
        ) : (
          /* SUBMITTED SUCCESS VIEW */
          <div className="bullseye-submitted-card">
            <div className="submitted-badge-check">
              <FontAwesomeIcon icon={faCheck} />
            </div>

            <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--ink)", margin: 0 }}>
              ANSWERS SUBMITTED SUCCESSFULLY!
            </h3>

            <p style={{ color: "var(--muted-paper)", fontSize: "1.05rem", fontWeight: 600, maxWidth: "580px", margin: 0 }}>
              Your 3 answers have been sent to the Admin Scorer Panel. The judges will review your submissions side-by-side against the 5 criteria and award your tournament score!
            </p>

            {/* Submitted recap */}
            <div
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "2px solid var(--ink)",
                borderRadius: "14px",
                padding: "1.2rem",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "var(--gold-dark)", textTransform: "uppercase" }}>
                SUBMITTED SUMMARY:
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {landedCriteria.map((c, i) => (
                  <span key={i} className="criteria-pill" style={{ fontSize: "0.78rem" }}>
                    <span className="criteria-pill-label">{c.label}:</span> {c.value}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: "0.4rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {answers.map((ans, i) => (
                  <div key={i} style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--ink)" }}>
                    #{i + 1}: {ans || "(blank)"}{" "}
                    {notes[i] && <span style={{ color: "#64748b", fontWeight: 500, fontSize: "0.82rem" }}>({notes[i]})</span>}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn-action btn-gold"
              onClick={() => onFinish(currentScore || 0)}
              style={{ width: "100%", maxWidth: "380px", padding: "1rem 2rem", fontSize: "1.1rem" }}
            >
              <FontAwesomeIcon icon={faTrophy} style={{ marginRight: "0.5rem" }} />
              RETURN TO ARCADE HUB
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
