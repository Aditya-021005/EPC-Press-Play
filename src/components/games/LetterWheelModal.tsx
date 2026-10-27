"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PLAYABLE_LETTERS } from "@/data/categories";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck, faPlay, faRotate, faSpinner, faDice } from "@fortawesome/free-solid-svg-icons";

interface LetterWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLetter: (letter: string) => void;
  currentLetter: string;
}

const SLICE_COLORS = [
  "#ffc93c", // Sun
  "#5bbeff", // Sky
  "#3dd68c", // Grass
  "#b79bff", // Grape
  "#ffa23a", // Coin
];

export default function LetterWheelModal({
  isOpen,
  onClose,
  onSelectLetter,
  currentLetter,
}: LetterWheelModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [landedLetter, setLandedLetter] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const wheelSize = 320;
  const cx = wheelSize / 2;
  const cy = wheelSize / 2;
  const radius = wheelSize / 2 - 12;
  const angleStep = 360 / PLAYABLE_LETTERS.length; // 18 deg per slice

  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    sound.playClick(750);
    setIsSpinning(true);
    setLandedLetter(null);
    setHasSpun(false);

    // Pick random target letter
    const targetIdx = Math.floor(Math.random() * PLAYABLE_LETTERS.length);
    const chosenLetter = PLAYABLE_LETTERS[targetIdx];

    // Top pointer is at 12 o'clock (270 degrees in SVG coordinate space)
    // Center angle of slice targetIdx is (targetIdx * angleStep + angleStep / 2)
    const sliceCenterAngle = targetIdx * angleStep + angleStep / 2;
    const currentMod = ((rotation % 360) + 360) % 360;

    // Delta needed so that after rotation, (sliceCenterAngle + finalAngle) % 360 === 270
    const delta = (270 - sliceCenterAngle - currentMod + 720) % 360;
    const additionalSpins = 360 * 6; // 6 full dramatic spins
    const targetRotation = rotation + additionalSpins + delta;

    setRotation(targetRotation);

    // Play tactile decelerating ticks
    const spinDuration = 3800; // ms
    let elapsed = 0;
    const tickStep = () => {
      const progress = elapsed / spinDuration;
      const interval = 55 + Math.pow(progress, 2.4) * 380;
      sound.playWheelTick();
      elapsed += interval;
      if (elapsed < spinDuration - 120) {
        setTimeout(tickStep, interval);
      }
    };
    tickStep();

    // End of spin
    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      setLandedLetter(chosenLetter);
      setHasSpun(true);
      sound.playSuccess();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, spinDuration);
  }, [isSpinning, rotation, angleStep]);

  if (!isOpen) return null;

  return (
    <div className="wheel-modal-overlay" onClick={isSpinning ? undefined : onClose}>
      <div className="wheel-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        {!isSpinning && (
          <button
            type="button"
            className="wheel-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}

        <div className="wheel-modal-header">
          <span className="wheel-badge">SCATTERGORIES • ROULETTE</span>
          <h3 className="wheel-modal-title">SPIN THE LETTER WHEEL</h3>
          <p className="wheel-modal-sub">
            The arrow at 12 o&apos;clock decides your target letter for all 5 categories!
          </p>
        </div>

        {/* Roulette Wheel Stage */}
        <div className="wheel-stage-wrap">
          {/* Top Ticker Pointer */}
          <div className={`wheel-ticker-needle ${isSpinning ? "ticking" : ""}`} aria-hidden="true">
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
              <polygon
                points="14,32 2,4 26,4"
                fill="var(--c-cherry)"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="14" cy="10" r="3.5" fill="var(--paper)" />
            </svg>
          </div>

          {/* Rotating SVG Wheel */}
          <div
            className="wheel-disc"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 3.8s cubic-bezier(0.12, 0.8, 0.18, 1)"
                : "none",
            }}
          >
            <svg
              width={wheelSize}
              height={wheelSize}
              viewBox={`0 0 ${wheelSize} ${wheelSize}`}
              className="wheel-svg"
            >
              {/* Outer Rim */}
              <circle
                cx={cx}
                cy={cy}
                r={radius + 8}
                fill="var(--stage-2)"
                stroke="var(--ink)"
                strokeWidth="6"
              />

              {/* 20 Letter Wedges */}
              {PLAYABLE_LETTERS.map((char, idx) => {
                const startAngle = idx * angleStep;
                const endAngle = (idx + 1) * angleStep;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = cx + radius * Math.cos(startRad);
                const y1 = cy + radius * Math.sin(startRad);
                const x2 = cx + radius * Math.cos(endRad);
                const y2 = cy + radius * Math.sin(endRad);

                // Slice path
                const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                // Letter placement along wedge
                const midAngle = startAngle + angleStep / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textR = radius * 0.74;
                const tx = cx + textR * Math.cos(midRad);
                const ty = cy + textR * Math.sin(midRad);

                const fillColor = SLICE_COLORS[idx % SLICE_COLORS.length];

                return (
                  <g key={char}>
                    <path
                      d={pathData}
                      fill={fillColor}
                      stroke="var(--ink)"
                      strokeWidth="2.5"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="var(--ink)"
                      fontSize="17"
                      fontWeight="900"
                      fontFamily="var(--font-hub), system-ui, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                    >
                      {char}
                    </text>
                  </g>
                );
              })}

              {/* Center Hub Tactile Pin */}
              <circle
                cx={cx}
                cy={cy}
                r="38"
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth="4"
              />
              <circle
                cx={cx}
                cy={cy}
                r="26"
                fill="var(--c-sun)"
                stroke="var(--ink)"
                strokeWidth="2.5"
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fontWeight="900"
                fontFamily="var(--font-hub), system-ui, sans-serif"
                fill="var(--ink)"
                letterSpacing="1"
              >
                SPIN
              </text>
            </svg>
          </div>
        </div>

        {/* Result & Actions */}
        <div className="wheel-modal-actions">
          {landedLetter && hasSpun ? (
            <div className="wheel-result-box">
              <span className="wheel-result-label">TARGET LETTER LOCKED:</span>
              <div className="wheel-result-letter">{landedLetter}</div>
              <div className="wheel-btn-group">
                <button
                  type="button"
                  className="btn-action btn-green"
                  style={{ flex: 1, padding: "0.85rem 1.4rem" }}
                  onClick={() => {
                    sound.playClick();
                    onSelectLetter(landedLetter);
                    onClose();
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.5rem" }} />
                  LOCK IN &apos;{landedLetter}&apos; & PLAY
                  <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                </button>
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={handleSpin}
                >
                  <FontAwesomeIcon icon={faRotate} style={{ marginRight: "0.45rem" }} />
                  Spin Again
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn-action btn-gold wheel-spin-btn"
              onClick={handleSpin}
              disabled={isSpinning}
            >
              {isSpinning ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: "0.6rem" }} />
                  WHEEL IS SPINNING...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDice} style={{ marginRight: "0.6rem" }} />
                  SPIN THE WHEEL
                  <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
