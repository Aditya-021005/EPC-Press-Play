"use client";

import React, { useState, useMemo } from "react";
import { TeamScore, registerTeamOnly, isGamePlayed, getPlayedGamesCount } from "@/lib/tournamentState";
import { sound } from "@/lib/audio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faCrown,
  faChartColumn,
  faGamepad,
  faMagnifyingGlass,
  faUsers,
  faUserPlus,
  faCheck,
  faXmark,
  faArrowRight,
  faSliders,
  faSeedling,
  faNewspaper,
  faMusic,
  faLayerGroup,
  faCoins,
  faBullseye,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export interface GameStationConfig {
  id: string;
  name: string;
  icon: any;
  viewId: string;
  gameKey?: keyof Omit<TeamScore, "name" | "total" | "lastUpdated">;
  tagline: string;
  badgeColor: string;
}

export const GAME_STATIONS: GameStationConfig[] = [
  {
    id: "all",
    name: "Arcade Hub (All Games)",
    icon: faGamepad,
    viewId: "hub",
    tagline: "Explore the full suite of 6 arcade challenges",
    badgeColor: "#f5af19",
  },
  {
    id: "greener-grass",
    name: "Game 1: Greener Grass Station",
    icon: faSeedling,
    viewId: "greener-grass",
    gameKey: "greenerGrass",
    tagline: "5-letter word deduction • 30s turns • Yellow hazard alarm",
    badgeColor: "#ffd700",
  },
  {
    id: "headlines",
    name: "Game 2: Real Headline Station",
    icon: faNewspaper,
    viewId: "headlines",
    gameKey: "realHeadline",
    tagline: "True or fake bizarre news headlines • 15s timer",
    badgeColor: "#8b5cf6",
  },
  {
    id: "name-tune",
    name: "Game 3: Name That Tune Station",
    icon: faMusic,
    viewId: "name-tune",
    gameKey: "nameThatTune",
    tagline: "Listen to music snippets • Speed trivia",
    badgeColor: "#f5af19",
  },
  {
    id: "categories",
    name: "Game 4: Categories Station",
    icon: faLayerGroup,
    viewId: "categories",
    gameKey: "categories",
    tagline: "Scattergories letter challenge • Fast category recall",
    badgeColor: "#a855f7",
  },
  {
    id: "reverse-millionaire",
    name: "Game 5: Reverse Millionaire Station",
    icon: faCoins,
    viewId: "reverse-millionaire",
    gameKey: "reverseMillionaire",
    tagline: "Protect your 100,000 dinars bank • Split chips on doors",
    badgeColor: "#e69500",
  },
  {
    id: "offline",
    name: "Game 6: Bullseye Arena Station",
    icon: faBullseye,
    viewId: "offline",
    gameKey: "offlineGame",
    tagline: "Live Darts & Archery • Spin wheel & arena targets",
    badgeColor: "#7c3aed",
  },
  {
    id: "register",
    name: "Registration Desk (Laptop 0)",
    icon: faUserPlus,
    viewId: "login",
    tagline: "Participant Sign In • Instantly syncs to all game stations",
    badgeColor: "#ffd700",
  },
];

interface LoginGatewayProps {
  allTeams: TeamScore[];
  onEnterArena: (teamName: string, directGameId?: string) => void;
  stationMode: string;
  onSetStationMode: (mode: string) => void;
}

export default function LoginGateway({
  allTeams,
  onEnterArena,
  stationMode,
  onSetStationMode,
}: LoginGatewayProps) {
  // Tabs: "select" (team picker), "register" (sign-up input), "standings" (leaderboard)
  const defaultTab = stationMode === "register" || allTeams.length === 0 ? "register" : "select";
  const [activeTab, setActiveTab] = useState<"select" | "register" | "standings">(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTeamInput, setNewTeamInput] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [registeredSuccessMsg, setRegisteredSuccessMsg] = useState<string | null>(null);
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);
  const [showStationPicker, setShowStationPicker] = useState(false);

  // Active station config
  const currentStation = useMemo(() => {
    return GAME_STATIONS.find((s) => s.id === stationMode) || GAME_STATIONS[0];
  }, [stationMode]);

  // Filtered & ranked teams
  const rankedTeams = useMemo(() => {
    return [...allTeams].sort((a, b) => b.total - a.total);
  }, [allTeams]);

  const filteredTeams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rankedTeams;
    return rankedTeams.filter((t) => t.name.toLowerCase().includes(q));
  }, [rankedTeams, searchQuery]);

  // Handle player clicking their team to play
  const handleSelectTeam = (teamName: string) => {
    setBlockedMsg(null);
    const targetTeam = allTeams.find((t) => t.name.trim().toLowerCase() === teamName.trim().toLowerCase());

    // Single-game station mode check: Has this team already played this station's game?
    if (currentStation.gameKey && targetTeam) {
      if (isGamePlayed(targetTeam, currentStation.gameKey)) {
        sound.playHazard();
        setBlockedMsg(
          `Team "${targetTeam.name}" has already played ${currentStation.name}! (Score: ${targetTeam[currentStation.gameKey]} pts). Each team may only play each game once.`
        );
        return;
      }
    }

    sound.playSuccess();
    if (currentStation.id === "all" || currentStation.id === "register") {
      onEnterArena(teamName);
    } else {
      // Launch dedicated game station directly!
      onEnterArena(teamName, currentStation.viewId);
    }
  };

  // Handle registration desk submitting a new team
  const handleRegisterNewTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTeamInput.trim();
    if (!trimmed || isSubmittingNew) return;

    setIsSubmittingNew(true);
    sound.playSuccess();

    try {
      const result = await registerTeamOnly(trimmed);
      setRegisteredSuccessMsg(`Team "${trimmed}" registered successfully! Available at all 6 game laptops.`);
      setNewTeamInput("");

      // If this laptop is also in a game station mode, allow immediate play
      if (currentStation.id !== "register") {
        setTimeout(() => {
          handleSelectTeam(trimmed);
        }, 1200);
      }
    } catch {
      setRegisteredSuccessMsg(`Failed to sync to backend. Saved locally.`);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "1.25rem 1rem 3rem",
        position: "relative",
        zIndex: 1,
        maxWidth: "1140px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* =========================================================================
          TOP BAR: SULTAN'S TITLE & CURRENT LAPTOP STATION BADGE
          ========================================================================= */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.45rem 1.15rem",
            borderRadius: "9999px",
            background: "var(--gold-gradient)",
            color: "#0d041c",
            fontFamily: "var(--font-mono)",
            fontWeight: 900,
            fontSize: "0.85rem",
            border: "2px solid #ffe082",
            boxShadow: "2px 2px 0 var(--gold-dark), 0 0 14px rgba(245, 175, 25, 0.3)",
          }}
        >
          🌙 ARABIAN NIGHTS • SULTAN'S ARENA
        </span>

        {/* Station Mode Indicator & Switcher Button */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowStationPicker((prev) => !prev)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.45rem 1.1rem",
              borderRadius: "12px",
              background: "#fffdf5",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              boxShadow: "3px 3px 0 var(--ink)",
              fontFamily: "var(--font-mono)",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "transform 0.1s ease",
            }}
            title="Configure which game station this laptop runs"
          >
            <FontAwesomeIcon icon={currentStation.icon} style={{ color: currentStation.badgeColor }} />
            <span>{currentStation.name}</span>
            <FontAwesomeIcon icon={faSliders} style={{ marginLeft: "0.35rem", fontSize: "0.75rem", opacity: 0.7 }} />
          </button>

          {/* Station Mode Dropdown Modal */}
          {showStationPicker && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "320px",
                background: "#fffdf5",
                border: "3px solid var(--ink)",
                boxShadow: "6px 6px 0 var(--ink)",
                borderRadius: "18px",
                padding: "0.85rem",
                zIndex: 100,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  fontFamily: "var(--font-mono)",
                  color: "var(--muted-paper)",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem",
                  paddingBottom: "0.4rem",
                  borderBottom: "1.5px solid rgba(0,0,0,0.1)",
                }}
              >
                Set Laptop Station Role
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {GAME_STATIONS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onSetStationMode(st.id);
                      setShowStationPicker(false);
                      if (st.id === "register") {
                        setActiveTab("register");
                      } else {
                        setActiveTab("select");
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.55rem 0.8rem",
                      borderRadius: "10px",
                      background: st.id === stationMode ? "var(--gold-gradient)" : "transparent",
                      border: st.id === stationMode ? "2px solid var(--ink)" : "1px solid transparent",
                      color: "var(--ink)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.82rem",
                      fontWeight: st.id === stationMode ? 900 : 700,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <FontAwesomeIcon icon={st.icon} style={{ width: "18px", color: st.badgeColor }} />
                    <div>
                      <div>{st.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTAINER CARD
          ========================================================================= */}
      <div
        style={{
          width: "100%",
          background: "#fffdf5",
          color: "var(--ink)",
          border: "3.5px solid var(--gold-primary)",
          boxShadow: "10px 10px 0 var(--gold-dark), 0 0 35px rgba(245, 175, 25, 0.25)",
          borderRadius: "26px",
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          textAlign: "center",
        }}
      >
        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.6rem",
            marginBottom: "1.8rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("select");
            }}
            style={{
              padding: "0.65rem 1.35rem",
              borderRadius: "14px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.95rem",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "2.5px solid var(--ink)",
              boxShadow: activeTab === "select" ? "4px 4px 0 var(--ink)" : "2px 2px 0 var(--ink)",
              background: activeTab === "select" ? "var(--gold-gradient)" : "#ffffff",
              color: "var(--ink)",
              transform: activeTab === "select" ? "translate(-2px, -2px)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>SELECT TEAM ({allTeams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("register");
            }}
            style={{
              padding: "0.65rem 1.35rem",
              borderRadius: "14px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.95rem",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "2.5px solid var(--ink)",
              boxShadow: activeTab === "register" ? "4px 4px 0 var(--ink)" : "2px 2px 0 var(--ink)",
              background: activeTab === "register" ? "var(--gold-gradient)" : "#ffffff",
              color: "var(--ink)",
              transform: activeTab === "register" ? "translate(-2px, -2px)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>REGISTER NEW TEAM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab("standings");
            }}
            style={{
              padding: "0.65rem 1.35rem",
              borderRadius: "14px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.95rem",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "2.5px solid var(--ink)",
              boxShadow: activeTab === "standings" ? "4px 4px 0 var(--ink)" : "2px 2px 0 var(--ink)",
              background: activeTab === "standings" ? "var(--gold-gradient)" : "#ffffff",
              color: "var(--ink)",
              transform: activeTab === "standings" ? "translate(-2px, -2px)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <FontAwesomeIcon icon={faChartColumn} />
            <span>STANDINGS</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: SELECT YOUR TEAM (MAIN FLOW FOR GAME LAPTOPS)
            ========================================================================= */}
        {activeTab === "select" && (
          <div>
            {/* Station Banner */}
            <div
              style={{
                marginBottom: "1.4rem",
                padding: "1rem 1.25rem",
                background: "rgba(20, 7, 44, 0.04)",
                border: "2px solid var(--ink)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FontAwesomeIcon icon={currentStation.icon} style={{ color: currentStation.badgeColor, fontSize: "1.2rem" }} />
                  <strong style={{ fontSize: "1.15rem", fontFamily: "var(--font-mono)" }}>
                    {currentStation.name}
                  </strong>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted-paper)", marginTop: "0.15rem" }}>
                  {currentStation.tagline}
                </div>
              </div>

              <div
                style={{
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 900,
                  background: "var(--paper)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "999px",
                  border: "2px solid var(--ink)",
                }}
              >
                {allTeams.length} {allTeams.length === 1 ? "Team" : "Teams"} Ready
              </div>
            </div>

            {/* Fast Filter Search Box */}
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{
                  position: "absolute",
                  left: "1.1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--muted-paper)",
                  fontSize: "1rem",
                }}
              />
              <input
                type="text"
                placeholder="Search your team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.8rem",
                  borderRadius: "14px",
                  border: "2.5px solid var(--ink)",
                  background: "#ffffff",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "var(--ink)",
                  outline: "none",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--muted-paper)",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                  title="Clear search"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>

            {/* Blocked / Already Played Warning Banner */}
            {blockedMsg && (
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.22) 100%)",
                  border: "2px solid #ef4444",
                  borderRadius: "14px",
                  padding: "0.9rem 1.2rem",
                  marginBottom: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  color: "#ffdada",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.88rem",
                  boxShadow: "0 0 16px rgba(239, 68, 68, 0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <FontAwesomeIcon icon={faLock} style={{ color: "#ef4444", fontSize: "1.1rem" }} />
                  <span>{blockedMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBlockedMsg(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#ffffff",
                    padding: "0.25rem 0.6rem",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Teams Grid */}
            {allTeams.length === 0 ? (
              <div
                style={{
                  padding: "3rem 1.5rem",
                  background: "#f8fafc",
                  border: "2.5px dashed var(--ink)",
                  borderRadius: "20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>🏜️</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.4rem" }}>
                  No Teams Registered Yet
                </h3>
                <p style={{ color: "var(--muted-paper)", fontSize: "0.95rem", marginBottom: "1.2rem" }}>
                  Register the first team on Laptop 0 (or use the Register tab below) to start playing!
                </p>
                <button
                  type="button"
                  className="btn-action btn-gold"
                  onClick={() => setActiveTab("register")}
                  style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem", fontWeight: 900 }}
                >
                  <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "0.5rem" }} />
                  REGISTER FIRST TEAM
                </button>
              </div>
            ) : filteredTeams.length === 0 ? (
              <div
                style={{
                  padding: "2.5rem 1rem",
                  background: "#f8fafc",
                  borderRadius: "16px",
                  border: "2px solid #e2e8f0",
                }}
              >
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "var(--muted-paper)" }}>
                  No teams matching "<strong>{searchQuery}</strong>" found.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    marginTop: "0.6rem",
                    background: "none",
                    border: "none",
                    color: "var(--gold-dark)",
                    fontWeight: 800,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Clear search filter
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.1rem",
                  textAlign: "left",
                }}
              >
                {filteredTeams.map((team, idx) => {
                  const stationKey = currentStation.gameKey;
                  const isPlayed = stationKey ? isGamePlayed(team, stationKey) : false;
                  const stationScore = stationKey ? team[stationKey] : null;
                  const playedCount = getPlayedGamesCount(team);

                  return (
                    <div
                      key={team.name}
                      onClick={() => handleSelectTeam(team.name)}
                      style={{
                        background: isPlayed ? "#fdfbf7" : "#ffffff",
                        border: isPlayed ? "2.5px solid #a855f7" : "3px solid var(--ink)",
                        borderRadius: "18px",
                        boxShadow: isPlayed ? "3px 3px 0 #4a3b69" : "4px 4px 0 var(--ink)",
                        padding: "1.25rem 1.25rem 1.15rem",
                        cursor: isPlayed ? "not-allowed" : "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
                        position: "relative",
                        overflow: "hidden",
                        opacity: isPlayed ? 0.88 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isPlayed) {
                          e.currentTarget.style.transform = "translate(-2px, -3px)";
                          e.currentTarget.style.boxShadow = "6px 6px 0 var(--gold-dark)";
                          e.currentTarget.style.borderColor = "var(--gold-dark)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isPlayed) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)";
                          e.currentTarget.style.borderColor = "var(--ink)";
                        }
                      }}
                    >
                      {/* Top Team Info Row */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.75rem",
                              fontWeight: 900,
                              background: idx < 3 ? "var(--gold-gradient)" : "rgba(0,0,0,0.06)",
                              color: "var(--ink)",
                              padding: "0.15rem 0.6rem",
                              borderRadius: "999px",
                              border: "1.5px solid var(--ink)",
                            }}
                          >
                            RANK #{idx + 1}
                          </span>

                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.82rem",
                              fontWeight: 900,
                              color: "var(--ink)",
                            }}
                          >
                            ◆ {team.total} PTS
                          </span>
                        </div>

                        {/* Team Name */}
                        <h4
                          style={{
                            fontSize: "1.35rem",
                            fontWeight: 900,
                            color: "var(--ink)",
                            lineHeight: 1.2,
                            wordBreak: "break-word",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {team.name}
                        </h4>
                      </div>

                      {/* Bottom Action / Status Row */}
                      <div
                        style={{
                          borderTop: "1.5px solid #e2e8f0",
                          paddingTop: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {stationKey ? (
                          <div style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 800 }}>
                            {isPlayed ? (
                              <span style={{ color: "#7c3aed", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                                <FontAwesomeIcon icon={faLock} /> Played ({stationScore} pts)
                              </span>
                            ) : (
                              <span style={{ color: "#16a34a" }}>
                                ● Ready (0/1 Plays)
                              </span>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--muted-paper)" }}>
                            {playedCount === 6 ? "✓ All 6 Played" : `${playedCount}/6 Games Played`}
                          </div>
                        )}

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontSize: "0.82rem",
                            fontWeight: 900,
                            fontFamily: "var(--font-mono)",
                            color: isPlayed ? "#e2d9f3" : "var(--ink)",
                            background: isPlayed ? "#3b2a54" : "var(--gold-gradient)",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "8px",
                            border: isPlayed ? "1.5px solid #231738" : "1.5px solid var(--ink)",
                            boxShadow: isPlayed ? "none" : "2px 2px 0 var(--ink)",
                          }}
                        >
                          {isPlayed ? (
                            <>
                              LOCKED <FontAwesomeIcon icon={faLock} style={{ fontSize: "0.75rem" }} />
                            </>
                          ) : (
                            <>
                              PLAY <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "0.75rem" }} />
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick helper footer */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.2rem",
                borderTop: "2px solid rgba(0,0,0,0.08)",
                fontSize: "0.9rem",
                color: "var(--muted-paper)",
              }}
            >
              Don't see your team in the list?{" "}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab("register");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gold-dark)",
                  fontWeight: 900,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Register your team here
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: REGISTER NEW TEAM (PRIMARY FLOW FOR LAPTOP 0)
            ========================================================================= */}
        {activeTab === "register" && (
          <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "2.4rem", marginBottom: "0.6rem" }}>📝</div>
            <h2
              style={{
                fontSize: "1.85rem",
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1.2,
                marginBottom: "0.5rem",
              }}
            >
              Team Registration & Sign In
            </h2>
            <p
              style={{
                color: "var(--muted-paper)",
                fontSize: "0.95rem",
                fontWeight: 600,
                lineHeight: 1.45,
                marginBottom: "1.8rem",
              }}
            >
              Enter the name once below. The team will be available immediately across all 6 game laptops in real time!
            </p>

            {/* Success Alert Banner */}
            {registeredSuccessMsg && (
              <div
                style={{
                  background: "#dcfce7",
                  border: "2.5px solid var(--c-grass)",
                  boxShadow: "3px 3px 0 var(--c-grass)",
                  borderRadius: "14px",
                  padding: "0.85rem 1.1rem",
                  marginBottom: "1.4rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>{registeredSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterNewTeam} style={{ marginBottom: "1.8rem" }}>
              <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
                <label
                  htmlFor="reg-username"
                  style={{
                    display: "block",
                    fontWeight: 900,
                    fontSize: "0.95rem",
                    color: "var(--ink)",
                    marginBottom: "0.45rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Enter Username or Team Name:
                </label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="e.g. Phoenix, Saumya, Matrix..."
                  value={newTeamInput}
                  onChange={(e) => setNewTeamInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "1rem 1.2rem",
                    borderRadius: "14px",
                    border: "3px solid var(--ink)",
                    background: "#ffffff",
                    color: "var(--ink)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    outline: "none",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06), 3px 3px 0 var(--ink)",
                  }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!newTeamInput.trim() || isSubmittingNew}
                style={{
                  width: "100%",
                  padding: "1.05rem",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.5px",
                  background: !newTeamInput.trim() ? "#e2e8f0" : "var(--gold-gradient)",
                  color: "var(--ink)",
                  border: "3px solid var(--ink)",
                  borderRadius: "14px",
                  boxShadow: !newTeamInput.trim() ? "none" : "4px 4px 0 var(--ink)",
                  cursor: !newTeamInput.trim() ? "not-allowed" : "pointer",
                  transition: "transform 0.12s ease",
                }}
              >
                {isSubmittingNew ? "REGISTERING..." : "REGISTER TEAM & SYNC ▶"}
              </button>
            </form>

            {/* Quick Roster Count & Recent List */}
            <div
              style={{
                background: "#f8fafc",
                border: "2px solid var(--ink)",
                borderRadius: "16px",
                padding: "1.1rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.6rem",
                }}
              >
                <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                  REGISTERED TEAMS ({allTeams.length})
                </strong>
                <button
                  type="button"
                  onClick={() => setActiveTab("select")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--gold-dark)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  View All Teams
                </button>
              </div>

              {allTeams.length === 0 ? (
                <div style={{ color: "var(--muted-paper)", fontSize: "0.85rem" }}>
                  No teams registered yet. Type above to register the first team!
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {allTeams.slice(-8).reverse().map((t) => (
                    <span
                      key={t.name}
                      style={{
                        padding: "0.3rem 0.7rem",
                        borderRadius: "8px",
                        background: "#ffffff",
                        border: "1.5px solid var(--ink)",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: STANDINGS / LEADERBOARD
            ========================================================================= */}
        {activeTab === "standings" && (
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, margin: 0 }}>
                Live Tournament Leaderboard
              </h3>
              <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)", color: "var(--muted-paper)" }}>
                {allTeams.length} Total Contenders
              </span>
            </div>

            {rankedTeams.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted-paper)", margin: "2rem 0", fontFamily: "var(--font-mono)" }}>
                No teams registered yet.
              </p>
            ) : (
              <div style={{ overflowX: "auto", border: "2.5px solid var(--ink)", borderRadius: "16px", background: "#ffffff" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", fontFamily: "var(--font-mono)" }}>
                  <thead>
                    <tr style={{ background: "var(--gold-gradient)", borderBottom: "2.5px solid var(--ink)", color: "var(--ink)" }}>
                      <th style={{ padding: "0.65rem 0.9rem" }}>#</th>
                      <th style={{ padding: "0.65rem 0.9rem" }}>Team</th>
                      <th style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>Grass</th>
                      <th style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>News</th>
                      <th style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>Tune</th>
                      <th style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>Cats</th>
                      <th style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>RevM</th>
                      <th style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>Arena</th>
                      <th style={{ padding: "0.65rem 0.9rem", textAlign: "right", fontWeight: 900 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedTeams.map((team, idx) => (
                      <tr key={team.name} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "0.65rem 0.9rem", fontWeight: 900 }}>{idx + 1}</td>
                        <td style={{ padding: "0.65rem 0.9rem", fontWeight: 800 }}>{team.name}</td>
                        <td style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>{team.greenerGrass}</td>
                        <td style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>{team.realHeadline}</td>
                        <td style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>{team.nameThatTune}</td>
                        <td style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>{team.categories}</td>
                        <td style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>{team.reverseMillionaire}</td>
                        <td style={{ padding: "0.65rem 0.6rem", textAlign: "center" }}>{team.offlineGame}</td>
                        <td style={{ padding: "0.65rem 0.9rem", textAlign: "right", fontWeight: 900, color: "var(--c-grass)" }}>
                          {team.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
