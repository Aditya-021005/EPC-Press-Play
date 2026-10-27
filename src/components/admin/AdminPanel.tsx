"use client";

import React, { useState } from "react";
import { TeamScore, verifyAdminPin, adminOverrideScore, adminSetActiveTeam, adminAddTeam, adminDeleteTeam, adminResetTournament } from "@/lib/tournamentState";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faKey,
  faLockOpen,
  faBolt,
  faCrown,
  faChartColumn,
  faLeaf,
  faNewspaper,
  faMusic,
  faLayerGroup,
  faCoins,
  faPeopleGroup,
  faTrashCan,
  faTriangleExclamation,
  faBomb,
  faCheck,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

interface AdminPanelProps {
  teams: TeamScore[];
  activeTeamName: string;
  adminPin: string | null;
  onAdminAuth: (pin: string | null) => void;
  onRefresh: () => void;
  onClose: () => void;
}

export default function AdminPanel({
  teams,
  activeTeamName,
  adminPin,
  onAdminAuth,
  onRefresh,
  onClose,
}: AdminPanelProps) {
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Score override state: teamName -> gameKey -> value
  const [overrideData, setOverrideData] = useState<Record<string, Record<string, number>>>({});
  const [newTeamName, setNewTeamName] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin.trim()) return;

    setIsVerifying(true);
    setPinError("");

    const ok = await verifyAdminPin(enteredPin.trim());
    setIsVerifying(false);

    if (ok) {
      sound.playSuccess();
      onAdminAuth(enteredPin.trim());
    } else {
      sound.playBuzzer();
      setPinError("Invalid Admin PIN. (Default is 1234)");
    }
  };

  const handleLogout = () => {
    sound.playClick();
    onAdminAuth(null);
  };

  const handleScoreChange = (teamName: string, gameKey: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setOverrideData((prev) => ({
      ...prev,
      [teamName]: {
        ...(prev[teamName] || {}),
        [gameKey]: num,
      },
    }));
  };

  const handleSaveScore = async (teamName: string, gameKey: string) => {
    if (!adminPin) return;
    const teamOverrides = overrideData[teamName];
    const val = teamOverrides ? teamOverrides[gameKey] : undefined;

    if (val === undefined) return;

    sound.playClick(750);
    const ok = await adminOverrideScore(adminPin, teamName, gameKey, val);
    if (ok) {
      setSaveSuccessMsg(`Updated ${teamName} (${gameKey}) to ${val} pts!`);
      setTimeout(() => setSaveSuccessMsg(""), 3000);
      onRefresh();
    }
  };

  const handleSelectActiveTeam = async (name: string) => {
    if (!adminPin) return;
    sound.playClick();
    await adminSetActiveTeam(adminPin, name);
    onRefresh();
  };

  const handleAddTeam = async () => {
    if (!adminPin || !newTeamName.trim()) return;
    sound.playSuccess();
    await adminAddTeam(adminPin, newTeamName.trim());
    setNewTeamName("");
    onRefresh();
  };

  const handleDeleteTeam = async (name: string) => {
    if (!adminPin) return;
    if (confirm(`Are you sure you want to delete "${name}" from the tournament?`)) {
      sound.playBuzzer();
      await adminDeleteTeam(adminPin, name);
      onRefresh();
    }
  };

  const handleResetTournament = async () => {
    if (!adminPin) return;
    if (confirm("DANGER: Are you sure you want to reset ALL tournament scores to 0?")) {
      if (confirm("Please confirm a second time: This cannot be undone!")) {
        sound.playBuzzer();
        await adminResetTournament(adminPin);
        confetti({ particleCount: 30 });
        onRefresh();
      }
    }
  };

  // If not authenticated, render secure keypad lock
  if (!adminPin) {
    return (
      <div className="game-arena">
        <div className="arena-topbar">
          <button className="btn-back" onClick={onClose}>
            <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: "0.4rem" }} />
            BACK TO PUBLIC ARENA
          </button>
          <div className="arena-title-wrap">
            <h2>
              <FontAwesomeIcon icon={faLock} style={{ marginRight: "0.5rem" }} />
              HOST & ADMIN AUTHENTICATION
            </h2>
            <span className="rules-hint">Authorized Event Officials Only</span>
          </div>
          <div className="arena-score-badge">
            <span style={{ color: "var(--neon-red)" }}>RESTRICTED ACCESS</span>
          </div>
        </div>

        <div className="game-body-center">
          <div className="offline-hero-card" style={{ maxWidth: "460px", borderColor: "var(--neon-purple)" }}>
            <div className="offline-icon-large">
              <FontAwesomeIcon icon={faKey} />
            </div>
            <h3 style={{ color: "var(--neon-cyan)" }}>HOST MASTER CONSOLE</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Enter the Host PIN to manage team scores, select the active stage team, award offline points, and configure the event.
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1.2rem" }}>
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Enter Host PIN..."
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "2px solid var(--border-neon)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.4rem",
                    textAlign: "center",
                    letterSpacing: "4px",
                    outline: "none",
                  }}
                  autoFocus
                />
                {pinError && (
                  <p style={{ color: "var(--neon-red)", fontSize: "0.85rem", marginTop: "0.6rem" }}>
                    {pinError}
                  </p>
                )}
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                  (Default PIN: <code>1234</code>)
                </span>
              </div>

              <button
                type="submit"
                className="btn-action btn-cyan"
                disabled={isVerifying || !enteredPin.trim()}
                style={{ width: "100%", padding: "1rem" }}
              >
                {isVerifying ? "AUTHENTICATING..." : (
                  <>
                    UNLOCK ADMIN CONSOLE
                    <FontAwesomeIcon icon={faLockOpen} style={{ marginLeft: "0.5rem" }} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin / Host Master View
  return (
    <div className="game-arena" style={{ maxWidth: "1150px" }}>
      {/* Top Bar */}
      <div className="arena-topbar" style={{ borderColor: "var(--neon-purple)" }}>
        <button className="btn-back" onClick={onClose}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: "0.4rem" }} />
          EXIT TO ARENA
        </button>
        <div className="arena-title-wrap">
          <h2 style={{ color: "var(--neon-purple)" }}>
            <FontAwesomeIcon icon={faBolt} style={{ marginRight: "0.5rem" }} />
            HOST MASTER CONTROL CONSOLE
          </h2>
          <span className="rules-hint">Live Backend Database Master • Full Override Authority</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn-outline-danger" onClick={handleLogout}>
            LOCK & LOGOUT
            <FontAwesomeIcon icon={faLock} style={{ marginLeft: "0.5rem" }} />
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.2)",
            border: "1px solid #10b981",
            color: "#6ee7b7",
            padding: "0.75rem 1.2rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.5rem" }} />
          {saveSuccessMsg}
        </div>
      )}

      {/* Control Strip 1: Active Stage Team & Team Creation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Active Stage Team Selector */}
        <div className="game-card" style={{ padding: "1.4rem" }}>
          <span className="card-badge purple-badge">STAGE DIRECTOR</span>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Select Active Team on Stage</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Dictates which participant is currently live in the arena and accumulates game points.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {teams.map((t) => (
              <button
                key={t.name}
                className={`btn-mode-toggle ${t.name === activeTeamName ? "active" : ""}`}
                onClick={() => handleSelectActiveTeam(t.name)}
                style={{ flex: "1 1 120px" }}
              >
                {t.name}
                {t.name === activeTeamName && (
                  <FontAwesomeIcon icon={faCrown} style={{ marginLeft: "0.4rem", color: "var(--c-sun)" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Add Team Panel */}
        <div className="game-card" style={{ padding: "1.4rem" }}>
          <span className="card-badge cyan-badge">ROSTER MANAGER</span>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Register New Team / Player</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Add customized team names directly to the persistent tournament roster.
          </p>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="e.g. Team Delta..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="cat-input-field"
              style={{ flex: 1 }}
            />
            <button
              className="btn-action btn-cyan"
              onClick={handleAddTeam}
              disabled={!newTeamName.trim()}
            >
              + ADD
            </button>
          </div>
        </div>
      </div>

      {/* Control Strip 2: Master Score Override Matrix */}
      <div className="leaderboard-panel" style={{ marginBottom: "2rem" }}>
        <div className="panel-header">
          <div>
            <h3 className="panel-title" style={{ color: "var(--neon-yellow)" }}>
              <FontAwesomeIcon icon={faChartColumn} style={{ marginRight: "0.5rem" }} />
              TOURNAMENT MASTER SCORE MATRIX (EDIT & OVERRIDE)
            </h3>
            <span className="panel-sub">
              Change any score (0-100) and click &apos;Save&apos; to immediately sync to all clients and screens.
            </span>
          </div>
        </div>

        <div className="standings-table-wrap">
          <table className="standings-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>
                  <FontAwesomeIcon icon={faLeaf} style={{ marginRight: "0.35rem", color: "var(--c-grass)" }} />
                  Greener Grass
                </th>
                <th>
                  <FontAwesomeIcon icon={faNewspaper} style={{ marginRight: "0.35rem", color: "var(--c-sun)" }} />
                  Headlines
                </th>
                <th>
                  <FontAwesomeIcon icon={faMusic} style={{ marginRight: "0.35rem", color: "var(--c-sky)" }} />
                  Name That Tune
                </th>
                <th>
                  <FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: "0.35rem", color: "var(--c-grape)" }} />
                  Categories
                </th>
                <th>
                  <FontAwesomeIcon icon={faCoins} style={{ marginRight: "0.35rem", color: "var(--c-coin)" }} />
                  Rev. Millionaire
                </th>
                <th>
                  <FontAwesomeIcon icon={faPeopleGroup} style={{ marginRight: "0.35rem", color: "var(--c-cherry)" }} />
                  Live Offline
                </th>
                <th>Total / 600</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => {
                const teamOverrides = overrideData[team.name] || {};
                const isStageActive = team.name === activeTeamName;

                return (
                  <tr
                    key={team.name}
                    style={{
                      background: isStageActive ? "rgba(0, 245, 255, 0.08)" : undefined,
                    }}
                  >
                    <td>
                      <strong>{team.name}</strong>
                      {isStageActive && (
                        <span style={{ color: "var(--neon-cyan)", fontSize: "0.75rem", display: "block" }}>
                          (Active on Stage)
                        </span>
                      )}
                    </td>

                    {/* Game 1: Greener Grass */}
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={teamOverrides.greenerGrass ?? team.greenerGrass}
                        onChange={(e) => handleScoreChange(team.name, "greenerGrass", e.target.value)}
                        onBlur={() => handleSaveScore(team.name, "greenerGrass")}
                        style={matrixInputStyle}
                      />
                    </td>

                    {/* Game 2: Real Headline */}
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={teamOverrides.realHeadline ?? team.realHeadline}
                        onChange={(e) => handleScoreChange(team.name, "realHeadline", e.target.value)}
                        onBlur={() => handleSaveScore(team.name, "realHeadline")}
                        style={matrixInputStyle}
                      />
                    </td>

                    {/* Game 3: Name That Tune */}
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={teamOverrides.nameThatTune ?? team.nameThatTune}
                        onChange={(e) => handleScoreChange(team.name, "nameThatTune", e.target.value)}
                        onBlur={() => handleSaveScore(team.name, "nameThatTune")}
                        style={matrixInputStyle}
                      />
                    </td>

                    {/* Game 4: Categories */}
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={teamOverrides.categories ?? team.categories}
                        onChange={(e) => handleScoreChange(team.name, "categories", e.target.value)}
                        onBlur={() => handleSaveScore(team.name, "categories")}
                        style={matrixInputStyle}
                      />
                    </td>

                    {/* Game 5: Reverse Millionaire */}
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={teamOverrides.reverseMillionaire ?? team.reverseMillionaire}
                        onChange={(e) => handleScoreChange(team.name, "reverseMillionaire", e.target.value)}
                        onBlur={() => handleSaveScore(team.name, "reverseMillionaire")}
                        style={matrixInputStyle}
                      />
                    </td>

                    {/* Game 6: Offline Arena */}
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={teamOverrides.offlineGame ?? team.offlineGame}
                        onChange={(e) => handleScoreChange(team.name, "offlineGame", e.target.value)}
                        onBlur={() => handleSaveScore(team.name, "offlineGame")}
                        style={{ ...matrixInputStyle, borderColor: "var(--neon-red)" }}
                      />
                    </td>

                    {/* Total */}
                    <td className="total-col" style={{ fontSize: "1.1rem" }}>
                      {team.total} / 600
                    </td>

                    {/* Delete Team Button */}
                    <td>
                      <button
                        className="btn-outline-danger"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        onClick={() => handleDeleteTeam(team.name)}
                        title="Delete team from tournament"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control Strip 3: Tournament Emergency Actions */}
      <div
        style={{
          background: "rgba(255, 42, 95, 0.08)",
          border: "1px solid rgba(255, 42, 95, 0.35)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h4 style={{ color: "var(--neon-red)", marginBottom: "0.2rem" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: "0.45rem" }} />
            TOURNAMENT RESET ZONE
          </h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Permanently wipes all scores for all teams back to 0. (Requires double confirmation)
          </p>
        </div>

        <button className="btn-action btn-red" onClick={handleResetTournament}>
          RESET TOURNAMENT TO 0
          <FontAwesomeIcon icon={faBomb} style={{ marginLeft: "0.5rem" }} />
        </button>
      </div>
    </div>
  );
}

const matrixInputStyle: React.CSSProperties = {
  width: "65px",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid var(--border-glass)",
  borderRadius: "6px",
  color: "#fff",
  fontFamily: "var(--font-mono)",
  fontSize: "0.95rem",
  fontWeight: 800,
  textAlign: "center",
  padding: "0.35rem",
  outline: "none",
};
