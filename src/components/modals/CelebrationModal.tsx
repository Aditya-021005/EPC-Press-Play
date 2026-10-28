"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faPlay } from "@fortawesome/free-solid-svg-icons";

interface CelebrationModalProps {
  isOpen: boolean;
  gameTitle: string;
  pointsEarned: number;
  newTotal: number;
  onClose: () => void;
}

export default function CelebrationModal({
  isOpen,
  gameTitle,
  pointsEarned,
  newTotal,
  onClose
}: CelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="tourney-modal">
      <div className="modal-card">
        <div className="confetti-launcher">
          <FontAwesomeIcon icon={faAward} />
        </div>
        <h2>{gameTitle.toUpperCase()} SUBMITTED!</h2>
        <p>
          {pointsEarned > 0
            ? "Awesome performance! Points have been recorded to the official 600-point tournament scorekeeper."
            : "Awesome performance! Your responses have been submitted to the EPC Host for live evaluation and scoring."}
        </p>

        <div className="celeb-points" style={{ fontSize: pointsEarned > 0 ? "2.5rem" : "1.4rem" }}>
          {pointsEarned > 0 ? `+${pointsEarned} PTS` : "HOST SCORING LIVE"}
        </div>

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
