"use client";

import React, { useState } from "react";
import { TeamScore } from "@/lib/tournamentState";
import { sound } from "@/lib/audio";
import "@/styles/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface ArcadeHeaderProps {
  activeTeam: TeamScore;
  allTeams: TeamScore[];
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onGoHome: () => void;
  isBackendConnected?: boolean;
  gameMeta?: {
    title: string;
    score: number;
    roundInfo?: string;
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
  isAdmin,
  onOpenAdmin,
  onGoHome,
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
        {/* Brand / Back button when in game */}
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
          </button>
        ) : (
          <button type="button" className="topbar__brand" onClick={onGoHome} title="Back to the hub">
            <span className="topbar__logo">Press Play</span>
            <span className="topbar__brand-text">
              <span className="topbar__name">The Game Room</span>
              <span className="topbar__sub">6 games · 100 pts each</span>
            </span>
          </button>
        )}

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
                <>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted-paper)", marginRight: "0.35rem" }}>GAME:</span>
                  <strong style={{ color: "var(--ink)" }}>{gameMeta.score}</strong> / 100
                </>
              ) : (
                <>
                  <strong>{activeTeam.total}</strong> / {MAX_TOTAL}
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

          <button
            type="button"
            className={`topbar__host${isAdmin ? " is-active" : ""}`}
            onClick={() => {
              sound.playClick();
              onOpenAdmin();
            }}
            title="Open the host control panel"
          >
            {isAdmin ? "Host console" : "Host panel"}
          </button>
        </div>
      </div>
    </header>
  );
}