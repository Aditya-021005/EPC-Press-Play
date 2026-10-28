"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { sound } from "@/lib/audio";
import "@/styles/modal.css";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  teamName: string;
  totalScore: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmLogoutModal({
  isOpen,
  teamName,
  totalScore,
  onConfirm,
  onCancel,
}: ConfirmLogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="tourney-modal" onClick={onCancel} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: "4px solid var(--ink)",
          boxShadow: "10px 10px 0 var(--ink)",
          borderRadius: "28px",
          padding: "2.2rem 2rem",
          position: "relative",
          maxWidth: "480px",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "2px solid var(--ink)",
            background: "var(--paper)",
            color: "var(--ink)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
          aria-label="Cancel"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Badge */}
        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.3rem 0.85rem",
              borderRadius: "9999px",
              background: "var(--c-sun)",
              color: "var(--ink)",
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              fontSize: "0.78rem",
              border: "2px solid var(--ink)",
              boxShadow: "2px 2px 0 var(--ink)",
            }}
          >
            END SESSION • LOGOUT
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2rem)",
            fontWeight: 900,
            color: "var(--ink)",
            lineHeight: 1.2,
            margin: "0 0 0.6rem",
          }}
        >
          Finish Turn or Give Up?
        </h2>

        {/* Team & Score summary box */}
        <div
          style={{
            background: "#fef08a",
            border: "3px solid var(--ink)",
            borderRadius: "16px",
            padding: "0.9rem 1.2rem",
            margin: "1.2rem 0",
            boxShadow: "3px 3px 0 var(--ink)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.78rem",
              fontWeight: 900,
              fontFamily: "var(--font-mono)",
              color: "var(--ink)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "0.2rem",
            }}
          >
            Active Team on Stage
          </span>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--ink)",
              margin: 0,
              fontFamily: "var(--font-mono)",
            }}
          >
            {teamName || "Current Player"}
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: "0.3rem",
              fontSize: "0.85rem",
              fontWeight: 800,
              color: "var(--ink)",
              background: "var(--paper)",
              padding: "0.2rem 0.6rem",
              borderRadius: "6px",
              border: "1.5px solid var(--ink)",
            }}
          >
            Recorded Score: {totalScore} / 600 pts
          </span>
        </div>

        {/* Message */}
        <p
          style={{
            color: "var(--muted-paper)",
            fontSize: "0.95rem",
            fontWeight: 600,
            lineHeight: 1.45,
            marginBottom: "1.8rem",
          }}
        >
          All your scores are safely recorded in the tournament standings. Logging out will complete your turn and return to the username entry screen for the next team.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            type="button"
            className="btn-action"
            onClick={() => {
              sound.playSuccess();
              onConfirm();
            }}
            style={{
              width: "100%",
              padding: "1rem",
              background: "#ef4444",
              color: "#ffffff",
              border: "3px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
              fontSize: "1.05rem",
              fontWeight: 900,
              letterSpacing: "0.5px",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: "0.6rem" }} />
            FINISH TURN & LOG OUT
          </button>

          <button
            type="button"
            className="btn-secondary-sm"
            onClick={onCancel}
            style={{
              width: "100%",
              padding: "0.85rem",
              fontSize: "0.95rem",
              fontWeight: 800,
            }}
          >
            <FontAwesomeIcon icon={faPlay} style={{ marginRight: "0.5rem" }} />
            Keep Playing
          </button>
        </div>
      </div>
    </div>
  );
}
