"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "@/lib/tournamentState";
import { sound } from "@/lib/audio";

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

  // Celebration modal state
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    gameTitle: string;
    pointsEarned: number;
    newTotal: number;
  }>({
    isOpen: false,
    gameTitle: "",
    pointsEarned: 0,
    newTotal: 0,
  });

  // In-Game topbar HUD metadata (back button & live score moved to topbar)
  const [activeGameMeta, setActiveGameMeta] = useState<{
    title: string;
    score: number;
    roundInfo?: string;
  } | null>(null);

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
      if (backendData.activeTeam) {
        setActiveTeamName(backendData.activeTeam);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("epc_active_session_user", backendData.activeTeam);
        }
        setCurrentView("hub");
      } else if (storedSessionUser) {
        setActiveTeamName(storedSessionUser);
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

    // Periodic sync poll every 2.5s for real-time live host score evaluation & active team sync
    const pollInterval = setInterval(() => {
      fetchBackendTournamentState().then((backendData) => {
        if (backendData) {
          setTeams(backendData.teams);
          saveStoredTeams(backendData.teams);
          if (backendData.activeTeam) {
            setActiveTeamName(backendData.activeTeam);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("epc_active_session_user", backendData.activeTeam);
            }
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
  };

  const handleAdminAuth = (pin: string | null) => {
    setAdminPin(pin);
    setStoredAdminAuth(pin);
  };

  const handleLaunchComplete = useCallback((targetGameId: string) => {
    setLaunchingGameId(null);
    if (targetGameId === "arena-hub") {
      setCurrentView("hub");
    } else {
      setCurrentView(targetGameId);
    }
  }, []);

  const handleEnterArena = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setActiveTeamName(trimmed);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("epc_active_session_user", trimmed);
    }
    setCurrentView("hub");
    const result = await selectOrCreateTeam(trimmed);
    if (result) {
      setTeams(result.teams);
      setActiveTeamName(result.activeTeam);
    }
  };

  const handleLogout = () => {
    sound.playClick();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("epc_active_session_user");
    }
    setActiveGameMeta(null);
    setIsLogoutModalOpen(false);
    setCurrentView("login");
  };

  // Legit Player Completion of a Game Round
  // Legit Player Completion of a Game Round (Host evaluates & awards points from Admin)
  const handleGameFinish = async (
    gameKey: keyof Omit<TeamScore, "name" | "total" | "lastUpdated">,
    title: string,
    score: number
  ) => {
    if (score > 0) {
      const updated = teams.map((team) => {
        if (team.name === activeTeam.name) {
          const newScore = Math.max(team[gameKey], score);
          const newTotal =
            (gameKey === "greenerGrass" ? newScore : team.greenerGrass) +
            (gameKey === "realHeadline" ? newScore : team.realHeadline) +
            (gameKey === "nameThatTune" ? newScore : team.nameThatTune) +
            (gameKey === "categories" ? newScore : team.categories) +
            (gameKey === "reverseMillionaire" ? newScore : team.reverseMillionaire) +
            (gameKey === "offlineGame" ? newScore : team.offlineGame);

          return {
            ...team,
            [gameKey]: newScore,
            total: newTotal,
            lastUpdated: Date.now(),
          };
        }
        return team;
      });

      setTeams(updated);
      saveStoredTeams(updated);
      await submitPlayerGameResult(activeTeam.name, gameKey, score);
    }

    setCelebrationData({
      isOpen: true,
      gameTitle: title,
      pointsEarned: score,
      newTotal: activeTeam.total,
    });
  };

  const handleCloseCelebration = () => {
    sound.playClick();
    setCelebrationData((prev) => ({ ...prev, isOpen: false }));
    setCurrentView("hub");
  };

  if (!isClient || isAppLoading) {
    return <ArcadeBootLoader />;
  }

  // VIEW: ENTER USERNAME GATEWAY
  if (currentView === "login") {
    return (
      <div className="view-transition-wrap">
        <LoginGateway
          allTeams={teams}
          onEnterArena={handleEnterArena}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ArcadeHeader
        activeTeam={activeTeam}
        allTeams={teams}
        onGoHome={() => {
          sound.playClick();
          setActiveGameMeta(null);
          setCurrentView("hub");
        }}
        onLogout={() => setIsLogoutModalOpen(true)}
        isBackendConnected={isBackendConnected}
        gameMeta={activeGameMeta}
      />

      <main className="arcade-main">
        <div key={currentView} className="view-transition-wrap">
          {/* VIEW: ARCADE HUB */}
          {currentView === "hub" && (
            <ArcadeHub
              activeTeam={activeTeam}
              allTeams={teams}
              onSelectGame={(gameId) => {
                setActiveGameMeta(null);
                setLaunchingGameId(gameId);
              }}
              onLogout={() => setIsLogoutModalOpen(true)}
            />
          )}

        {/* GAME 1: GREENER GRASS */}
        {currentView === "greener-grass" && (
          <GreenerGrass
            onFinish={(score) => {
              setActiveGameMeta(null);
              handleGameFinish("greenerGrass", "Greener Grass", score);
            }}
            onBack={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
            onUpdateMeta={setActiveGameMeta}
          />
        )}

        {/* GAME 2: REAL HEADLINE OR NOT */}
        {currentView === "headlines" && (
          <RealHeadline
            onFinish={(score) => {
              setActiveGameMeta(null);
              handleGameFinish("realHeadline", "Real Headline or Not", score);
            }}
            onBack={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
            onUpdateMeta={setActiveGameMeta}
          />
        )}

        {/* GAME 3: NAME THAT TUNE */}
        {currentView === "name-tune" && (
          <NameThatTune
            onFinish={(score) => {
              setActiveGameMeta(null);
              handleGameFinish("nameThatTune", "Name That Tune", score);
            }}
            onBack={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
            onUpdateMeta={setActiveGameMeta}
          />
        )}

        {/* GAME 4: CATEGORIES */}
        {currentView === "categories" && (
          <Categories
            onFinish={(score) => {
              setActiveGameMeta(null);
              handleGameFinish("categories", "Categories (Scattergories)", score);
            }}
            onBack={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
            onUpdateMeta={setActiveGameMeta}
          />
        )}

        {/* GAME 5: REVERSE MILLIONAIRE */}
        {currentView === "reverse-millionaire" && (
          <ReverseMillionaire
            onFinish={(score) => {
              setActiveGameMeta(null);
              handleGameFinish("reverseMillionaire", "Reverse Who Wants To Be A Millionaire", score);
            }}
            onBack={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
            onUpdateMeta={setActiveGameMeta}
          />
        )}

        {/* GAME 6: BULLSEYE (LIVE ARENA) */}
        {currentView === "offline" && (
          <OfflineArena
            currentScore={activeTeam.offlineGame}
            activeTeamName={activeTeam.name}
            adminPin={adminPin}
            onFinish={(score) => {
              setActiveGameMeta(null);
              handleGameFinish("offlineGame", "Bullseye: Darts & Archery Arena", score);
            }}
            onBack={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
            onUpdateMeta={setActiveGameMeta}
          />
        )}
        </div>
      </main>

      <CelebrationModal
        isOpen={celebrationData.isOpen}
        gameTitle={celebrationData.gameTitle}
        pointsEarned={celebrationData.pointsEarned}
        newTotal={celebrationData.newTotal}
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
          onComplete={handleLaunchComplete}
        />
      )}
    </div>
  );
}
