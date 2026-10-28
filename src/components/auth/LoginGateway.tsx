"use client";

import React, { useState } from "react";
import { TeamScore } from "@/lib/tournamentState";
import { sound } from "@/lib/audio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faCrown,
  faChartColumn,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";

interface LoginGatewayProps {
  allTeams: TeamScore[];
  onEnterArena: (teamName: string) => void;
}

export default function LoginGateway({
  allTeams,
  onEnterArena,
}: LoginGatewayProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const [showStandings, setShowStandings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    if (!trimmed) return;
    sound.playSuccess();
    onEnterArena(trimmed);
  };

  const rankedTeams = [...allTeams].sort((a, b) => b.total - a.total);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fffdf5",
          color: "var(--ink)",
          border: "3.5px solid var(--gold-primary)",
          boxShadow: "12px 12px 0 var(--gold-dark), 0 0 35px rgba(245, 175, 25, 0.3)",
          borderRadius: "28px",
          padding: "clamp(2rem, 5vw, 2.8rem)",
          textAlign: "center",
          animation: "scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Arabian Nights Badge */}
        <div style={{ marginBottom: "1.2rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.38rem 1.15rem",
              borderRadius: "9999px",
              background: "var(--gold-gradient)",
              color: "#0d041c",
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              fontSize: "0.85rem",
              border: "2px solid #ffe082",
              boxShadow: "2px 2px 0 var(--gold-dark), 0 0 14px rgba(245, 175, 25, 0.4)",
            }}
          >
            🌙 ARABIAN NIGHTS • SULTAN'S ARENA
          </span>
        </div>

        {/* Title & Tagline */}
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 2.6rem)",
            fontWeight: 900,
            color: "var(--ink)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "0.6rem",
          }}
        >
          Enter the Arena
        </h1>
        <p
          style={{
            color: "var(--muted-paper)",
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: 1.45,
            marginBottom: "2rem",
          }}
        >
          One laptop, 6 challenges, 100 points each. Enter your username or team name below to begin your tournament run.
        </p>

        {/* Username / Team Name Input Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
            <label
              htmlFor="gateway-username"
              style={{
                display: "block",
                fontWeight: 900,
                fontSize: "0.95rem",
                color: "var(--ink)",
                marginBottom: "0.45rem",
              }}
            >
              Enter Username or Team Name:
            </label>
            <input
              id="gateway-username"
              type="text"
              placeholder="e.g. Phoenix, Saumya, Matrix..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem 1.2rem",
                borderRadius: "14px",
                border: "3px solid var(--gold-border)",
                background: "#ffffff",
                color: "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontSize: "1.2rem",
                fontWeight: 800,
                outline: "none",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06), 0 0 10px rgba(245, 175, 25, 0.15)",
              }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-action btn-gold"
            disabled={!usernameInput.trim()}
            style={{
              width: "100%",
              padding: "1.05rem",
              fontSize: "1.15rem",
              fontWeight: 900,
              letterSpacing: "0.5px",
            }}
          >
            ENTER THE SULTAN'S ARENA
            <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "0.6rem" }} />
          </button>
        </form>

        {/* Toggle Standings Preview */}
        <div style={{ marginTop: "1.5rem" }}>
          <button
            type="button"
            className="btn-secondary-sm"
            onClick={() => {
              sound.playClick();
              setShowStandings((prev) => !prev);
            }}
            style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
          >
            <FontAwesomeIcon icon={faChartColumn} style={{ marginRight: "0.45rem" }} />
            {showStandings ? "Hide Standings" : "View Tournament Leaderboard"}
          </button>
        </div>

        {/* Standings Table Accordion */}
        {showStandings && (
          <div
            style={{
              marginTop: "1.2rem",
              background: "#f8fafc",
              border: "2px solid var(--ink)",
              borderRadius: "16px",
              padding: "1rem",
              maxHeight: "220px",
              overflowY: "auto",
              textAlign: "left",
            }}
          >
            {rankedTeams.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--muted-paper)",
                  margin: "0.6rem 0",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                No teams registered yet. Be the first to enter!
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--ink)" }}>
                    <th style={{ padding: "0.4rem 0.6rem" }}>#</th>
                    <th style={{ padding: "0.4rem 0.6rem" }}>Team</th>
                    <th style={{ padding: "0.4rem 0.6rem", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedTeams.map((team, idx) => (
                    <tr key={team.name} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "0.4rem 0.6rem", fontWeight: 900 }}>{idx + 1}</td>
                      <td style={{ padding: "0.4rem 0.6rem", fontWeight: 800 }}>{team.name}</td>
                      <td style={{ padding: "0.4rem 0.6rem", textAlign: "right", fontWeight: 900, color: "var(--c-grass)" }}>
                        {team.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
