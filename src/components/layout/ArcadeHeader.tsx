"use client";

import React, { useState } from "react";
import { TeamScore } from "@/lib/tournamentState";
import { sound } from "@/lib/audio";
import "@/styles/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHourglassHalf, faXmark } from "@fortawesome/free-solid-svg-icons";

interface ArcadeHeaderProps {
  activeTeam: TeamScore;
  allTeams: TeamScore[];
  onGoHome: () => void;
  onLogout?: () => void;
  isBackendConnected?: boolean;
  gameMeta?: {
    title: string;
    score: number;
    roundInfo?: string;
    timeLeft?: number;
    totalTime?: number;
    isDemo?: boolean;
    onEndGame?: () => void;
  } | null;
}

const MAX_TOTAL = 600;

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" />
      ) : (
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
      )}
    </svg>
  );
}

export default function ArcadeHeader({
  activeTeam,
  allTeams,
  onGoHome,
  onLogout,
  isBackendConnected = true,
  gameMeta,
}: ArcadeHeaderProps) {
  const [isMuted, setIsMuted] = useState(() => sound.isMuted());

  const toggleSound = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) sound.playClick();
  };

  const progressPct = Math.min(100, Math.max(0, (activeTeam.total / MAX_TOTAL) * 100));
  const rank =
    [...allTeams].sort((a, b) => b.total - a.total).findIndex((t) => t.name === activeTeam.name) + 1;

  return (
    <header className="topbar">
      <div className="topbar__inner">
        {/* Brand / Back button & In-Game Timer */}
        <div className="topbar__brand-col">
          {gameMeta ? (
            <button
              type="button"
              className="topbar__back-btn"
              onClick={onGoHome}
              title="Return to Arcade Hub"
            >
              <span className="topbar__back-icon">
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
              <span className="topbar__back-text">HUB</span>
              <span className="topbar__game-tag">{gameMeta.title}</span>
              {gameMeta.isDemo && (
                <span
                  style={{
                    marginLeft: "0.4rem",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "999px",
                    background: "#f5af19",
                    color: "#0d041c",
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    letterSpacing: "0.5px",
                  }}
                >
                  DEMO RUN (0 PTS)
                </span>
              )}
            </button>
          ) : (
            <button type="button" className="topbar__brand" onClick={onGoHome} title="Back to the hub">
              <img src="/icon.svg" alt="Press Play" className="topbar__logo-icon" />
              <span className="topbar__logo">Press Play</span>
              <span className="topbar__brand-text">
                <span className="topbar__name">The Game Room</span>
                <span className="topbar__sub">6 games · 100 pts each</span>
              </span>
            </button>
          )}

          {/* Integrated In-Game Timer */}
          {gameMeta && gameMeta.timeLeft !== undefined && (
            <div
              className={`topbar__timer ${gameMeta.timeLeft <= 6 ? "is-urgent" : ""}`}
              title="Round countdown timer"
            >
              <span className="topbar__timer-icon">
                <FontAwesomeIcon icon={faHourglassHalf} />
              </span>
              <div className="topbar__timer-info">
                <span className="topbar__timer-label">TIME</span>
                <span className="topbar__timer-digits">
                  {Math.floor(gameMeta.timeLeft / 60)}:{(gameMeta.timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
              {gameMeta.totalTime && (
                <div className="topbar__timer-gauge">
                  <div
                    className={`topbar__timer-gauge-fill ${gameMeta.timeLeft <= 6 ? "fill-urgent" : ""}`}
                    style={{
                      width: `${Math.max(0, Math.min(100, (gameMeta.timeLeft / gameMeta.totalTime) * 100))}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active team / Game score meter */}
        <div className="topbar__meter" aria-label="Score meter">
          <div className="topbar__meter-labels">
            <span>
              {activeTeam.name}
              {gameMeta?.roundInfo ? (
                <span className="topbar__rank" style={{ background: "var(--c-sun)", color: "var(--ink)", fontWeight: 800 }}>
                  {gameMeta.roundInfo}
                </span>
              ) : (
                rank > 0 && <span className="topbar__rank">#{rank}</span>
              )}
            </span>
            <span className="topbar__meter-val">
              {gameMeta ? (
                gameMeta.isDemo ? (
                  <>
                    <span style={{ fontSize: "0.76rem", color: "#f5af19", marginRight: "0.25rem", fontWeight: 800 }}>PRACTICE:</span>
                    <strong style={{ color: "var(--gold-glow, #ffd700)" }}>{gameMeta.score}</strong>/100
                    <span style={{ margin: "0 0.4rem", color: "#cbd5e1" }}>•</span>
                    <span style={{ fontSize: "0.76rem", color: "var(--muted-paper)", marginRight: "0.25rem" }}>TOTAL:</span>
                    <strong style={{ color: "var(--ink)" }}>{activeTeam.total}</strong>/{MAX_TOTAL}
                    <span style={{ marginLeft: "0.25rem", fontSize: "0.72rem", color: "#f5af19", fontWeight: 800 }}>(+0)</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "0.76rem", color: "var(--muted-paper)", marginRight: "0.25rem" }}>GAME:</span>
                    <strong style={{ color: "var(--gold-glow, #ffd700)" }}>{gameMeta.score}</strong>/100
                    <span style={{ margin: "0 0.4rem", color: "#cbd5e1" }}>•</span>
                    <span style={{ fontSize: "0.76rem", color: "var(--muted-paper)", marginRight: "0.25rem" }}>NET:</span>
                    <strong style={{ color: "var(--ink)" }}>{activeTeam.total}</strong>/{MAX_TOTAL}
                  </>
                )
              ) : (
                <>
                  <span style={{ fontSize: "0.76rem", color: "var(--muted-paper)", marginRight: "0.3rem" }}>NET TOTAL:</span>
                  <strong style={{ color: "var(--ink)" }}>{activeTeam.total}</strong> / {MAX_TOTAL}
                </>
              )}
            </span>
          </div>
          <div
            className="topbar__track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={gameMeta ? 100 : MAX_TOTAL}
            aria-valuenow={gameMeta ? gameMeta.score : activeTeam.total}
          >
            <div
              className="topbar__fill"
              style={{
                width: gameMeta
                  ? `${Math.min(100, Math.max(0, gameMeta.score))}%`
                  : `${progressPct}%`,
                background: gameMeta ? "var(--c-sun)" : "var(--ink)",
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="topbar__actions">
          {/* Integrated In-Game END GAME Button */}
          {gameMeta?.onEndGame && (
            <button
              type="button"
              className="topbar__end-btn"
              onClick={gameMeta.onEndGame}
              title="End game and audit score"
            >
              <FontAwesomeIcon icon={faXmark} />
              <span>END GAME</span>
            </button>
          )}

          <span className="topbar__chip" title="Team currently on stage">
            <span className="topbar__chip-label">On stage</span>
            <strong>{activeTeam.name}</strong>
          </span>

          <span
            className={`topbar__chip topbar__chip--sync${isBackendConnected ? "" : " is-local"}`}
            title={isBackendConnected ? "Scores are saving to the cloud" : "Scores are saved on this device only"}
          >
            <span className="topbar__dot" aria-hidden="true" />
            {isBackendConnected ? "Live" : "Local"}
          </span>

          <button
            type="button"
            className="topbar__icon-btn"
            onClick={toggleSound}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            <SpeakerIcon muted={isMuted} />
          </button>

          {/* Finish Turn / Give Up & Log Out button when on hub */}
          {!gameMeta && onLogout && (
            <button
              type="button"
              className="topbar__icon-btn"
              onClick={() => {
                sound.playClick();
                onLogout();
              }}
              title="Finish turn or give up and return to Enter Username screen"
              style={{
                width: "auto",
                padding: "0 0.85rem",
                fontSize: "0.8rem",
                fontWeight: 800,
                fontFamily: "var(--font-mono)",
                background: "var(--paper)",
                border: "2px solid var(--ink)",
                borderRadius: "10px",
                color: "var(--ink)",
                cursor: "pointer",
              }}
            >
              Finish / Give Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}