"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faBolt,
  faCircleCheck,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import { sound } from "@/lib/audio";
import "@/styles/game-loader.css";

export default function ArcadeBootLoader() {
  const [progress, setProgress] = useState(18);
  const [stageText, setStageText] = useState("INITIALIZING SYSTEM...");

  useEffect(() => {
    // Initial sound
    try {
      sound.playClick(500);
    } catch {
      // Audio context might be restricted before first gesture
    }

    const t1 = setTimeout(() => {
      setProgress(52);
      setStageText("SYNCING TOURNAMENT BOARD & TEAMS...");
      try {
        sound.playClick(680);
      } catch {}
    }, 250);

    const t2 = setTimeout(() => {
      setProgress(86);
      setStageText("PREPARING CHALLENGE ENGINES...");
      try {
        sound.playClick(850);
      } catch {}
    }, 550);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStageText("ARENA READY! BOOTING...");
      try {
        sound.playSuccess();
      } catch {}
    }, 850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      className="game-loader-overlay arcade-boot-overlay"
      role="status"
      aria-live="polite"
      aria-label="Booting Press Play Arcade"
    >
      <div className="game-loader-card arcade-boot-card">
        {/* Pulsing Arcade Badge */}
        <span className="game-loader-badge">
          <FontAwesomeIcon icon={faBolt} style={{ marginRight: "0.45rem" }} />
          🌙 ARABIAN NIGHTS • ARENA BOOT
        </span>

        {/* Animated Icon */}
        <div
          className="game-loader-icon-wrap"
          style={{
            background: "var(--gold-gradient)",
            color: "var(--ink, #0d041c)",
            border: "3px solid var(--gold-dark)",
            boxShadow: "0 0 20px rgba(245, 175, 25, 0.5)",
          }}
        >
          <FontAwesomeIcon icon={faGamepad} />
        </div>

        {/* Title */}
        <h1 className="game-loader-title" style={{ fontSize: "2.1rem", marginBottom: "0.25rem" }}>
          Press Play
        </h1>
        <div className="game-loader-tag" style={{ color: "var(--muted-paper, #5d4680)", marginBottom: "1.2rem" }}>
          THE GAME ROOM • ARABIAN NIGHTS
        </div>

        {/* Terminal / Status logs */}
        <div
          style={{
            background: "#0c051f",
            color: "#e09f19",
            border: "2px solid var(--gold-border)",
            borderRadius: "14px",
            padding: "0.85rem 1rem",
            marginBottom: "1.3rem",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.82rem",
            textAlign: "left",
            lineHeight: 1.6,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(245, 175, 25, 0.15)",
          }}
        >
          <div style={{ color: progress >= 18 ? "#10b981" : "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: "0.75rem" }} />
            <span>Audio Synthesizer: ONLINE</span>
          </div>
          <div style={{ color: progress >= 52 ? "#ffd700" : "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <FontAwesomeIcon icon={progress >= 52 ? faCircleCheck : faTowerBroadcast} style={{ fontSize: "0.75rem" }} />
            <span>Sultan's Leaderboard: {progress >= 52 ? "SYNCHRONIZED" : "CONNECTING..."}</span>
          </div>
          <div style={{ color: progress >= 86 ? "#ffd700" : "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <FontAwesomeIcon icon={progress >= 86 ? faCircleCheck : faBolt} style={{ fontSize: "0.75rem" }} />
            <span>Palace Challenges: {progress >= 86 ? "6 ARENAS READY" : "STANDBY"}</span>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="game-loader-progress-wrap">
          <div className="game-loader-track">
            <div
              className="game-loader-bar"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--c-sun, #ffc93c), var(--c-grass, #3dd68c))",
              }}
            />
          </div>

          <div className="game-loader-status-text">
            <span>{stageText}</span>
            <span style={{ color: "var(--ink, #16133f)" }}>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
