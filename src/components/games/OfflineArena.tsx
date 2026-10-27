"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/audio";
import { verifyAdminPin, adminOverrideScore } from "@/lib/tournamentState";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup, faTrophy, faKey } from "@fortawesome/free-solid-svg-icons";

interface OfflineArenaProps {
  currentScore: number;
  activeTeamName: string;
  adminPin: string | null;
  onFinish: (score: number) => void;
  onBack: () => void;
  onOpenAdmin: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

export default function OfflineArena({
  currentScore,
  activeTeamName,
  adminPin,
  onFinish,
  onBack,
  onOpenAdmin,
  onUpdateMeta,
}: OfflineArenaProps) {
  const [inputVal, setInputVal] = useState<string>(String(currentScore || 0));
  const [pinPrompt, setPinPrompt] = useState("");
  const [pinError, setPinError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleSave = async () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val) || val < 0 || val > 100) {
      sound.playBuzzer();
      alert("Please enter a valid score between 0 and 100.");
      return;
    }

    // If admin is already authenticated
    if (adminPin) {
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 70 });
      await adminOverrideScore(adminPin, activeTeamName, "offlineGame", val);
      onFinish(val);
      return;
    }

    // If not authenticated, require PIN
    if (!pinPrompt.trim()) {
      sound.playBuzzer();
      setPinError("Host PIN is required to officially record offline stage points.");
      return;
    }

    setIsAuthorizing(true);
    setPinError("");
    const ok = await verifyAdminPin(pinPrompt.trim());
    setIsAuthorizing(false);

    if (ok) {
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 70 });
      await adminOverrideScore(pinPrompt.trim(), activeTeamName, "offlineGame", val);
      onFinish(val);
    } else {
      sound.playBuzzer();
      setPinError("Invalid Host PIN. Only event officials can award points.");
    }
  };

  useEffect(() => {
    onUpdateMeta?.({
      title: "Offline Stage",
      score: currentScore,
      roundInfo: "Host Console",
    });
  }, [currentScore, onUpdateMeta]);

  return (
    <div className="game-arena">
      <div className="game-body-center offline-stage">
        <div className="offline-hero-card">
          <div className="offline-icon-large">
            <FontAwesomeIcon icon={faPeopleGroup} />
          </div>
          <h3>PHYSICAL / LIVE EVENT STAGE</h3>
          <p>
            The 6th showdown of <strong>PRESS PLAY: THE GAME ROOM</strong> is hosted live in your physical arena (e.g. Minute-To-Win-It, Relay Obstacle Course, Live Charades Face-Off, or Mystery Box Challenge).
          </p>

          <div
            style={{
              background: "rgba(255, 215, 0, 0.08)",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "10px",
              padding: "0.85rem",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
            }}
          >
            Awarding Points To: <strong style={{ color: "var(--neon-yellow)" }}>{activeTeamName}</strong>
          </div>

          <div className="offline-score-form">
            <label htmlFor="offline-score-input">
              Points Earned by {activeTeamName} (0 - 100 PTS):
            </label>

            <div className="input-score-group" style={{ marginBottom: "1.2rem" }}>
              <input
                id="offline-score-input"
                type="number"
                min="0"
                max="100"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            </div>

            {!adminPin && (
              <div style={{ maxWidth: "280px", margin: "0 auto 1.2rem" }}>
                <input
                  type="password"
                  placeholder="Enter Host PIN..."
                  value={pinPrompt}
                  onChange={(e) => setPinPrompt(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid var(--border-glass)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
                {pinError && (
                  <p style={{ color: "var(--neon-red)", fontSize: "0.78rem", marginTop: "0.4rem" }}>
                    {pinError}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn-action btn-red"
                onClick={handleSave}
                disabled={isAuthorizing}
              >
                {isAuthorizing ? "AUTHORIZING..." : (
                  <>
                    OFFICIALLY RECORD POINTS
                    <FontAwesomeIcon icon={faTrophy} style={{ marginLeft: "0.5rem" }} />
                  </>
                )}
              </button>

              <button
                className="btn-secondary-sm"
                onClick={onOpenAdmin}
                style={{ padding: "0.85rem 1.2rem" }}
              >
                OPEN HOST PANEL
                <FontAwesomeIcon icon={faKey} style={{ marginLeft: "0.5rem" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
