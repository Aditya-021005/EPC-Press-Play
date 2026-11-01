"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ArcadeHeader from "@/components/layout/ArcadeHeader";
import ArcadeHub from "@/components/hub/ArcadeHub";
import GreenerGrass from "@/components/games/GreenerGrass";
import RealHeadline from "@/components/games/RealHeadline";
import NameThatTune from "@/components/games/NameThatTune";
import Categories from "@/components/games/Categories";
import ReverseMillionaire from "@/components/games/ReverseMillionaire";
import OfflineArena from "@/components/games/OfflineArena";
import CelebrationModal from "@/components/modals/CelebrationModal";
import ConfirmLogoutModal from "@/components/modals/ConfirmLogoutModal";
import GameLaunchLoader from "@/components/transitions/GameLaunchLoader";
import ArcadeBootLoader from "@/components/transitions/ArcadeBootLoader";
import LoginGateway from "@/components/auth/LoginGateway";
import "@/styles/game-loader.css";
import {
  TeamScore,
  DEFAULT_TEAMS,
  getStoredTeams,
  saveStoredTeams,
  getStoredActiveTeam,
  saveStoredActiveTeam,
  getStoredAdminAuth,
  setStoredAdminAuth,
  fetchBackendTournamentState,
  submitPlayerGameResult,
  selectOrCreateTeam,
  playerLogout,
  isGamePlayed,
} from "@/lib/tournamentState";
import { sound } from "@/lib/audio";

export interface ActiveGameMeta {
  title: string;
  score: number;
  roundInfo?: string;
  timeLeft?: number;
  totalTime?: number;
  isDemo?: boolean;
  onEndGame?: () => void;
}

export default function ArcadePage() {
  const [teams, setTeams] = useState<TeamScore[]>([]);
  const [activeTeamName, setActiveTeamName] = useState<string>("");
  const [currentView, setCurrentView] = useState<string>("login");
  const [isClient, setIsClient] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [adminPin, setAdminPin] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<"official" | "demo">("official");

  // Celebration modal state
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    gameTitle: string;
    pointsEarned: number;
    newTotal: number;
    isDemo?: boolean;
    rawScore?: number;
  }>({
    isOpen: false,
    gameTitle: "",
    pointsEarned: 0,
    newTotal: 0,
    isDemo: false,
    rawScore: 0,
  });

  // In-Game topbar HUD metadata (back button & live score moved to topbar)
  const [activeGameMeta, setActiveGameMeta] = useState<ActiveGameMeta | null>(null);

  // Multi-laptop Station Mode (e.g. "greener-grass", "headlines", "register", "all")
  const [stationMode, setStationMode] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlStation = urlParams.get("station");
      if (urlStation) {
        setStationMode(urlStation);
        localStorage.setItem("epc_station_mode", urlStation);
      } else {
        const savedStation = localStorage.getItem("epc_station_mode") || "all";
        setStationMode(savedStation);
      }
    }
  }, []);

  const handleSetStationMode = (mode: string) => {
    setStationMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("epc_station_mode", mode);
    }
  };

  // Initial load
  const loadState = useCallback(async () => {
    const localTeams = getStoredTeams();
    const storedAuth = getStoredAdminAuth();
    setTeams(localTeams);
    setAdminPin(storedAuth);

    const storedSessionUser =
      typeof window !== "undefined" ? sessionStorage.getItem("epc_active_session_user") : null;

    if (storedSessionUser) {
      setActiveTeamName(storedSessionUser);
      setCurrentView("hub");
    } else {
      setActiveTeamName("");
      setCurrentView("login");
    }

    // Fetch from backend API
    const backendData = await fetchBackendTournamentState();
    if (backendData) {
      setTeams(backendData.teams);
      saveStoredTeams(backendData.teams);

      // Independent multi-laptop session: keep this laptop's local session
      if (storedSessionUser) {
        setActiveTeamName(storedSessionUser);
        setCurrentView("hub");
      } else {
        setActiveTeamName("");
        setCurrentView("login");
      }
      setIsBackendConnected(true);
    } else {
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    const startTime = Date.now();

    loadState().finally(() => {
      const elapsed = Date.now() - startTime;
      const minDisplay = 800; // Guarantee retro arcade loader is visible on initial load / refresh!
      const delay = Math.max(0, minDisplay - elapsed);
      setTimeout(() => {
        setIsAppLoading(false);
      }, delay);
    });

    // Periodic sync poll every 2.5s for real-time live host score evaluation & roster updates
    const pollInterval = setInterval(() => {
      fetchBackendTournamentState().then((backendData) => {
        if (backendData) {
          setTeams((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(backendData.teams)) {
              return prev;
            }
            saveStoredTeams(backendData.teams);
            return backendData.teams;
          });

          // Multi-laptop isolation: NEVER let another laptop's login hijack this laptop!
          const currentSession =
            typeof window !== "undefined" ? sessionStorage.getItem("epc_active_session_user") : null;
          if (currentSession) {
            setActiveTeamName(currentSession);
          } else {
            setActiveTeamName("");
          }
          setIsBackendConnected(true);
        }
      });
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [loadState]);

  const activeTeam: TeamScore = teams.find((t) => t.name === activeTeamName) || {
    name: activeTeamName || "Player",
    greenerGrass: 0,
    realHeadline: 0,
    nameThatTune: 0,
    categories: 0,
    reverseMillionaire: 0,
    offlineGame: 0,
    total: 0,
    lastUpdated: 0,
    playedGames: [],
  };

  const handleAdminAuth = (pin: string | null) => {
    setAdminPin(pin);
    setStoredAdminAuth(pin);
  };

  const handleLaunchComplete = useCallback((targetGameId: string) => {
    setLaunchingGameId(null);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    if (targetGameId === "arena-hub") {
      setCurrentView("hub");
    } else {
      setCurrentView(targetGameId);
    }
  }, []);

  const handleEnterArena = async (name: string, directGameId?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (directGameId) {
      const gKey = viewToGameKey(directGameId);
      const targetTeam = teams.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
      if (gKey && targetTeam && isGamePlayed(targetTeam, gKey)) {
        sound.playHazard();
        alert(`Team "${trimmed}" has already completed this challenge! Each team gets only 1 attempt per game.`);
        return;
      }
    }

    setActiveTeamName(trimmed);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("epc_active_session_user", trimmed);
    }

    if (directGameId) {
      setLaunchingGameId(directGameId);
    } else {
      setCurrentView("hub");
    }

    const result = await selectOrCreateTeam(trimmed);
    if (result) {
      setTeams(result.teams);
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    const teamToLogout = activeTeamName;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("epc_active_session_user");
    }
    saveStoredActiveTeam("");
    setActiveTeamName("");
    setActiveGameMeta(null);
    setIsLogoutModalOpen(false);
    setCurrentView("login");

    // Clear backend / Redis activeTeam so refresh won't resurrect this session
    await playerLogout(teamToLogout);
  };

type PlayableGameKey =
  | "greenerGrass"
  | "realHeadline"
  | "nameThatTune"
  | "categories"
  | "reverseMillionaire"
  | "offlineGame";

function viewToGameKey(view: string): PlayableGameKey | null {
  switch (view) {
    case "greener-grass":
      return "greenerGrass";
    case "headlines":
      return "realHeadline";
    case "name-tune":
      return "nameThatTune";
    case "categories":
      return "categories";
    case "reverse-millionaire":
      return "reverseMillionaire";
    case "offline":
      return "offlineGame";
    default:
      return null;
  }
}

  // Session base scores: records team's starting scores when entering a game
  const gameSessionBaseRef = useRef<{ baseGameScore: number; baseTotal: number }>({
    baseGameScore: 0,
    baseTotal: 0,
  });
  const prevViewRef = useRef<string>("");

  useEffect(() => {
    if (currentView !== prevViewRef.current) {
      prevViewRef.current = currentView;
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      if (currentView === "login" || currentView === "hub") {
        setActiveGameMeta(null);
      } else {
        const gameKey = viewToGameKey(currentView);
        if (gameKey) {
          const currentTeam = teams.find((t) => t.name === activeTeamName);
          gameSessionBaseRef.current = {
            baseGameScore: (currentTeam ? currentTeam[gameKey] : 0) || 0,
            baseTotal: (currentTeam ? currentTeam.total : 0) || 0,
          };
        }
      }
    }
  }, [currentView, activeTeamName, teams]);

  // Live progressive score update during game play (syncs net score simultaneously)
  const handleLiveGameScoreUpdate = useCallback(
    (
      gameKey: keyof Omit<TeamScore, "name" | "total" | "lastUpdated">,
      meta: ActiveGameMeta
    ) => {
      // Defer state update to microtask so React never updates parent state synchronously during a child component's render phase
      queueMicrotask(() => {
        // Guard: strictly ignore updates if user is not currently in this game (e.g. back on hub)
        if (viewToGameKey(currentView) !== gameKey) {
          return;
        }

        // Guard: ignore if this game has already been completed in official mode
        const currentTeam = teams.find((t) => t.name.trim().toLowerCase() === activeTeamName.trim().toLowerCase());
        if (gameMode === "official" && currentTeam && isGamePlayed(currentTeam, gameKey)) {
          return;
        }

        // Check if values actually changed before triggering a re-render in page.tsx
        setActiveGameMeta((prev) => {
          const nextMeta: ActiveGameMeta = {
            ...meta,
            isDemo: gameMode === "demo",
          };
          if (
            prev &&
            prev.title === nextMeta.title &&
            prev.score === nextMeta.score &&
            prev.roundInfo === nextMeta.roundInfo &&
            prev.timeLeft === nextMeta.timeLeft &&
            prev.totalTime === nextMeta.totalTime &&
            prev.isDemo === nextMeta.isDemo
          ) {
            return prev;
          }
          return nextMeta;
        });

        // If playing in demo mode, do NOT add or sync points to team scorecard!
        if (gameMode === "demo") {
          return;
        }

        if (activeTeamName && meta.score !== undefined) {
          const sessionEarned = Math.max(0, meta.score);
          const baseGame = gameSessionBaseRef.current.baseGameScore;
          const baseTot = gameSessionBaseRef.current.baseTotal;
          const newScore = Math.min(100, baseGame + sessionEarned);
          const newTotal = baseTot + sessionEarned;

          setTeams((prevTeams) => {
            const activeNameClean = activeTeamName.trim().toLowerCase();
            let changed = false;
            let found = false;

            const updated = prevTeams.map((team) => {
              if (team.name.trim().toLowerCase() === activeNameClean) {
                found = true;
                if (team[gameKey] === newScore && team.total === newTotal) {
                  return team;
                }
                changed = true;
                return {
                  ...team,
                  [gameKey]: newScore,
                  total: newTotal,
                  lastUpdated: Date.now(),
                };
              }
              return team;
            });

            if (!found && activeTeamName) {
              changed = true;
              const newTeamObj: TeamScore = {
                name: activeTeamName,
                greenerGrass: gameKey === "greenerGrass" ? newScore : 0,
                realHeadline: gameKey === "realHeadline" ? newScore : 0,
                nameThatTune: gameKey === "nameThatTune" ? newScore : 0,
                categories: gameKey === "categories" ? newScore : 0,
                reverseMillionaire: gameKey === "reverseMillionaire" ? newScore : 0,
                offlineGame: gameKey === "offlineGame" ? newScore : 0,
                total: newTotal,
                lastUpdated: Date.now(),
                playedGames: [],
              };
              updated.push(newTeamObj);
            }

            if (changed) {
              saveStoredTeams(updated);
              return updated;
            }
            return prevTeams;
          });
        }
      });
    },
    [activeTeamName, currentView, gameMode, teams]
  );

  const handleUpdateGreenerGrass = useCallback(
    (meta: ActiveGameMeta) => handleLiveGameScoreUpdate("greenerGrass", meta),
    [handleLiveGameScoreUpdate]
  );
  const handleUpdateHeadlines = useCallback(
    (meta: ActiveGameMeta) => handleLiveGameScoreUpdate("realHeadline", meta),
    [handleLiveGameScoreUpdate]
  );
  const handleUpdateNameTune = useCallback(
    (meta: ActiveGameMeta) => handleLiveGameScoreUpdate("nameThatTune", meta),
    [handleLiveGameScoreUpdate]
  );
  const handleUpdateCategories = useCallback(
    (meta: ActiveGameMeta) => handleLiveGameScoreUpdate("categories", meta),
    [handleLiveGameScoreUpdate]
  );
  const handleUpdateReverseMillionaire = useCallback(
    (meta: ActiveGameMeta) => handleLiveGameScoreUpdate("reverseMillionaire", meta),
    [handleLiveGameScoreUpdate]
  );
  const handleUpdateOffline = useCallback(
    (meta: ActiveGameMeta) => handleLiveGameScoreUpdate("offlineGame", meta),
    [handleLiveGameScoreUpdate]
  );

  // Player Completion of a Game Round
  const handleGameFinish = async (
    gameKey: keyof Omit<TeamScore, "name" | "total" | "lastUpdated" | "playedGames">,
    title: string,
    score: number
  ) => {
    const sessionEarned = Math.max(0, score);

    // DEMO RUN: Do NOT save points to team and do NOT mark playedGames!
    if (gameMode === "demo") {
      setActiveGameMeta(null);
      sound.playSuccess();
      setCelebrationData({
        isOpen: true,
        gameTitle: title,
        pointsEarned: 0,
        rawScore: sessionEarned,
        newTotal: activeTeam.total,
        isDemo: true,
      });
      return;
    }

    const baseGame = gameSessionBaseRef.current.baseGameScore;
    const baseTot = gameSessionBaseRef.current.baseTotal;
    const newScore = Math.min(100, baseGame + sessionEarned);
    const finalTeamTotal = baseTot + sessionEarned;

    if (activeTeamName) {
      const activeNameClean = activeTeamName.trim().toLowerCase();
      let found = false;

      const updated = teams.map((team) => {
        if (team.name.trim().toLowerCase() === activeNameClean) {
          found = true;
          const played = Array.isArray(team.playedGames) ? [...team.playedGames] : [];
          if (!played.includes(gameKey)) {
            played.push(gameKey);
          }
          return {
            ...team,
            [gameKey]: newScore,
            total: finalTeamTotal,
            lastUpdated: Date.now(),
            playedGames: played,
          };
        }
        return team;
      });

      if (!found) {
        const newTeamObj: TeamScore = {
          name: activeTeamName,
          greenerGrass: gameKey === "greenerGrass" ? newScore : 0,
          realHeadline: gameKey === "realHeadline" ? newScore : 0,
          nameThatTune: gameKey === "nameThatTune" ? newScore : 0,
          categories: gameKey === "categories" ? newScore : 0,
          reverseMillionaire: gameKey === "reverseMillionaire" ? newScore : 0,
          offlineGame: gameKey === "offlineGame" ? newScore : 0,
          total: finalTeamTotal,
          lastUpdated: Date.now(),
          playedGames: [gameKey],
        };
        updated.push(newTeamObj);
      }

      setTeams(updated);
      saveStoredTeams(updated);
      const res = await submitPlayerGameResult(activeTeamName, gameKey, newScore);
      if (res && res.alreadyPlayed) {
        sound.playHazard();
        alert(`Notice: Team "${activeTeamName}" has already completed this game previously.`);
      }
    }

    if (sessionEarned > 0) {
      setCelebrationData({
        isOpen: true,
        gameTitle: title,
        pointsEarned: sessionEarned,
        newTotal: finalTeamTotal,
      });
    } else {
      setActiveGameMeta(null);
      if (stationMode && stationMode !== "all" && stationMode !== "register") {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("epc_active_session_user");
        }
        setActiveTeamName("");
        setCurrentView("login");
      } else {
        setCurrentView("hub");
      }
    }
  };

  const handleCloseCelebration = () => {
    sound.playClick();
    setCelebrationData((prev) => ({ ...prev, isOpen: false }));
    setActiveGameMeta(null);
    if (stationMode && stationMode !== "all" && stationMode !== "register") {
      // In dedicated station mode, return immediately to the team selector for the next player!
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("epc_active_session_user");
      }
      setActiveTeamName("");
      setCurrentView("login");
    } else {
      setCurrentView("hub");
    }
  };

  if (!isClient || isAppLoading) {
    return <ArcadeBootLoader />;
  }

  // VIEW: ENTER USERNAME / SELECT TEAM GATEWAY
  if (currentView === "login") {
    return (
      <div className="view-transition-wrap">
        <LoginGateway
          allTeams={teams}
          onEnterArena={handleEnterArena}
          stationMode={stationMode}
          onSetStationMode={handleSetStationMode}
        />
      </div>
    );
  }

  const renderAlreadyPlayedNotice = (
    gameTitle: string,
    gameKey: keyof Omit<TeamScore, "name" | "total" | "lastUpdated" | "playedGames">
  ) => (
    <div className="game-arena" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔒</div>
      <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffd700", marginBottom: "0.5rem" }}>
        {gameTitle} Already Completed
      </h2>
      <p style={{ color: "#c8b8ec", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
        Team <strong>{activeTeam.name}</strong> has already played this challenge and scored{" "}
        <strong>{activeTeam[gameKey]} / 100 points</strong>. Each team is permitted only 1 attempt per game.
      </p>
      <button
        type="button"
        className="btn-action btn-gold"
        onClick={() => {
          sound.playClick();
          setActiveGameMeta(null);
          setCurrentView("hub");
        }}
        style={{ padding: "0.85rem 1.8rem", fontSize: "1rem", fontWeight: 900, cursor: "pointer" }}
      >
        Return to Arcade Hub
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ArcadeHeader
        activeTeam={activeTeam}
        allTeams={teams}
        onGoHome={() => {
          sound.playClick();
          setActiveGameMeta(null);
          if (stationMode && stationMode !== "all" && stationMode !== "register") {
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("epc_active_session_user");
            }
            setActiveTeamName("");
            setCurrentView("login");
          } else {
            setCurrentView("hub");
          }
        }}
        onLogout={() => setIsLogoutModalOpen(true)}
        isBackendConnected={isBackendConnected}
        gameMeta={currentView !== "hub" && currentView !== "login" ? activeGameMeta : null}
      />

      <main className="arcade-main">
        <div key={currentView} className="view-transition-wrap">
          {/* VIEW: ARCADE HUB */}
          {currentView === "hub" && (
            <ArcadeHub
              activeTeam={activeTeam}
              allTeams={teams}
              onSelectGame={(gameId, mode) => {
                const gKey = viewToGameKey(gameId);
                if (mode === "official" && gKey && isGamePlayed(activeTeam, gKey)) {
                  sound.playHazard();
                  alert(`Notice: Team "${activeTeam.name}" has already completed this game in normal playing! (1 play limit)`);
                  return;
                }
                setGameMode(mode);
                setActiveGameMeta(null);
                setLaunchingGameId(gameId);
              }}
              onLogout={() => setIsLogoutModalOpen(true)}
            />
          )}

        {/* GAME 1: GREENER GRASS */}
        {currentView === "greener-grass" && (
          isGamePlayed(activeTeam, "greenerGrass") && gameMode === "official" ? (
            renderAlreadyPlayedNotice("Greener Grass", "greenerGrass")
          ) : (
            <GreenerGrass
              isDemo={gameMode === "demo"}
              onFinish={(score) => {
                setActiveGameMeta(null);
                handleGameFinish("greenerGrass", "Greener Grass", score);
              }}
              onBack={() => {
                sound.playClick();
                setActiveGameMeta(null);
                setCurrentView("hub");
              }}
              onUpdateMeta={handleUpdateGreenerGrass}
            />
          )
        )}

        {/* GAME 2: REAL HEADLINE OR NOT */}
        {currentView === "headlines" && (
          isGamePlayed(activeTeam, "realHeadline") && gameMode === "official" ? (
            renderAlreadyPlayedNotice("Real Headline or Not", "realHeadline")
          ) : (
            <RealHeadline
              isDemo={gameMode === "demo"}
              onFinish={(score) => {
                setActiveGameMeta(null);
                handleGameFinish("realHeadline", "Real Headline or Not", score);
              }}
              onBack={() => {
                sound.playClick();
                setActiveGameMeta(null);
                setCurrentView("hub");
              }}
              onUpdateMeta={handleUpdateHeadlines}
            />
          )
        )}

        {/* GAME 3: NAME THAT TUNE */}
        {currentView === "name-tune" && (
          isGamePlayed(activeTeam, "nameThatTune") && gameMode === "official" ? (
            renderAlreadyPlayedNotice("Name That Tune", "nameThatTune")
          ) : (
            <NameThatTune
              activeTeamName={activeTeam.name}
              isDemo={gameMode === "demo"}
              onFinish={(score) => {
                setActiveGameMeta(null);
                handleGameFinish("nameThatTune", "Name That Tune", score);
              }}
              onBack={() => {
                sound.playClick();
                setActiveGameMeta(null);
                setCurrentView("hub");
              }}
              onUpdateMeta={handleUpdateNameTune}
            />
          )
        )}

        {/* GAME 4: CATEGORIES */}
        {currentView === "categories" && (
          isGamePlayed(activeTeam, "categories") && gameMode === "official" ? (
            renderAlreadyPlayedNotice("Categories", "categories")
          ) : (
            <Categories
              activeTeamName={activeTeam.name}
              isDemo={gameMode === "demo"}
              onFinish={(score) => {
                setActiveGameMeta(null);
                handleGameFinish("categories", "Categories (Scattergories)", score);
              }}
              onBack={() => {
                sound.playClick();
                setActiveGameMeta(null);
                setCurrentView("hub");
              }}
              onUpdateMeta={handleUpdateCategories}
            />
          )
        )}

        {/* GAME 5: REVERSE MILLIONAIRE */}
        {currentView === "reverse-millionaire" && (
          isGamePlayed(activeTeam, "reverseMillionaire") && gameMode === "official" ? (
            renderAlreadyPlayedNotice("Reverse Millionaire", "reverseMillionaire")
          ) : (
            <ReverseMillionaire
              isDemo={gameMode === "demo"}
              onFinish={(score) => {
                setActiveGameMeta(null);
                handleGameFinish("reverseMillionaire", "Reverse Who Wants To Be A Millionaire", score);
              }}
              onBack={() => {
                sound.playClick();
                setActiveGameMeta(null);
                setCurrentView("hub");
              }}
              onUpdateMeta={handleUpdateReverseMillionaire}
            />
          )
        )}

        {/* GAME 6: BULLSEYE (LIVE ARENA) */}
        {currentView === "offline" && (
          isGamePlayed(activeTeam, "offlineGame") && gameMode === "official" ? (
            renderAlreadyPlayedNotice("Bullseye", "offlineGame")
          ) : (
            <OfflineArena
              currentScore={activeTeam.offlineGame}
              activeTeamName={activeTeam.name}
              adminPin={adminPin}
              isDemo={gameMode === "demo"}
              onFinish={(score) => {
                setActiveGameMeta(null);
                handleGameFinish("offlineGame", "Bullseye: Darts & Archery Arena", score);
              }}
              onBack={() => {
                sound.playClick();
                setActiveGameMeta(null);
                setCurrentView("hub");
              }}
              onUpdateMeta={handleUpdateOffline}
            />
          )
        )}
        </div>
      </main>

      <CelebrationModal
        isOpen={celebrationData.isOpen}
        gameTitle={celebrationData.gameTitle}
        pointsEarned={celebrationData.pointsEarned}
        newTotal={celebrationData.newTotal}
        isDemo={celebrationData.isDemo}
        rawScore={celebrationData.rawScore}
        onClose={handleCloseCelebration}
      />

      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        teamName={activeTeam.name}
        totalScore={activeTeam.total}
        onConfirm={handleLogout}
        onCancel={() => {
          sound.playClick();
          setIsLogoutModalOpen(false);
        }}
      />

      {launchingGameId && (
        <GameLaunchLoader
          gameId={launchingGameId}
          teamName={activeTeam.name}
          mode={gameMode}
          onComplete={handleLaunchComplete}
        />
      )}
    </div>
  );
}
