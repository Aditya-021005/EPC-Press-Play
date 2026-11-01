"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faPlay } from "@fortawesome/free-solid-svg-icons";

interface CelebrationModalProps {
  isOpen: boolean;
  gameTitle: string;
  pointsEarned: number;
  newTotal: number;
  isDemo?: boolean;
  rawScore?: number;
  onClose: () => void;
}

export default function CelebrationModal({
  isOpen,
  gameTitle,
  pointsEarned,
  newTotal,
  isDemo = false,
  rawScore,
  onClose
}: CelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="tourney-modal">
      <div className="modal-card">
        <div className="confetti-launcher">
          <FontAwesomeIcon icon={faAward} />
        </div>
        <h2>{isDemo ? "DEMO RUN COMPLETED!" : `${gameTitle.toUpperCase()} SUBMITTED!`}</h2>
        <p>
          {isDemo
            ? "Great practice run! This was a demo round, so 0 points were added to your official tournament scorecard."
            : pointsEarned > 0
            ? "Awesome performance! Points have been recorded to the official 600-point tournament scorekeeper."
            : "Awesome performance! Your responses have been submitted to the EPC Host for live evaluation and scoring."}
        </p>

        <div className="celeb-points" style={{ fontSize: pointsEarned > 0 || isDemo ? "2.2rem" : "1.4rem" }}>
          {isDemo ? `PRACTICE: ${rawScore ?? pointsEarned} PTS` : pointsEarned > 0 ? `+${pointsEarned} PTS` : "HOST SCORING LIVE"}
        </div>

        {isDemo && (
          <div style={{ color: "#f5af19", fontWeight: 800, fontSize: "0.92rem", marginBottom: "0.5rem" }}>
            (Demo Run: 0 points added to tournament total)
          </div>
        )}

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", marginBottom: "1.8rem", color: "var(--neon-yellow)" }}>
          Active Tournament Score: <strong>{newTotal} / 600 PTS</strong>
        </div>

        <button className="btn-action btn-gold" onClick={onClose} style={{ width: "100%", padding: "1rem" }}>
          RETURN TO ARCADE HUB
          <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.5rem" }} />
        </button>
      </div>
    </div>
  );
}
