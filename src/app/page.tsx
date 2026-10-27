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
import AdminPanel from "@/components/admin/AdminPanel";
import CelebrationModal from "@/components/modals/CelebrationModal";
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
} from "@/lib/tournamentState";
import { sound } from "@/lib/audio";

export default function ArcadePage() {
  const [teams, setTeams] = useState<TeamScore[]>(DEFAULT_TEAMS);
  const [activeTeamName, setActiveTeamName] = useState<string>("Team Alpha");
  const [currentView, setCurrentView] = useState<string>("hub");
  const [isClient, setIsClient] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [adminPin, setAdminPin] = useState<string | null>(null);

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
    const localActive = getStoredActiveTeam();
    const storedAuth = getStoredAdminAuth();
    setTeams(localTeams);
    setActiveTeamName(localActive);
    setAdminPin(storedAuth);

    // Fetch from backend API
    const backendData = await fetchBackendTournamentState();
    if (backendData) {
      setTeams(backendData.teams);
      setActiveTeamName(backendData.activeTeam);
      setIsBackendConnected(true);
    } else {
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    loadState();

    // Periodic sync poll every 6s for live multi-screen synchronization
    const pollInterval = setInterval(() => {
      fetchBackendTournamentState().then((backendData) => {
        if (backendData) {
          setTeams(backendData.teams);
          setActiveTeamName(backendData.activeTeam);
          setIsBackendConnected(true);
        }
      });
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [loadState]);

  const activeTeam = teams.find((t) => t.name === activeTeamName) || teams[0] || DEFAULT_TEAMS[0];

  const handleAdminAuth = (pin: string | null) => {
    setAdminPin(pin);
    setStoredAdminAuth(pin);
  };

  // Legit Player Completion of a Game Round
  const handleGameFinish = async (
    gameKey: keyof Omit<TeamScore, "name" | "total" | "lastUpdated">,
    title: string,
    score: number
  ) => {
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

    const updatedActive = updated.find((t) => t.name === activeTeam.name);
    setCelebrationData({
      isOpen: true,
      gameTitle: title,
      pointsEarned: score,
      newTotal: updatedActive ? updatedActive.total : 0,
    });

    // Sync legitimate game result to backend API
    await submitPlayerGameResult(activeTeam.name, gameKey, score);
  };

  const handleCloseCelebration = () => {
    sound.playClick();
    setCelebrationData((prev) => ({ ...prev, isOpen: false }));
    setCurrentView("hub");
  };

  if (!isClient) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ArcadeHeader
        activeTeam={activeTeam}
        allTeams={teams}
        isAdmin={!!adminPin}
        onOpenAdmin={() => {
          sound.playClick();
          setCurrentView("admin");
        }}
        onGoHome={() => {
          sound.playClick();
          setActiveGameMeta(null);
          setCurrentView("hub");
        }}
        isBackendConnected={isBackendConnected}
        gameMeta={activeGameMeta}
      />

      <main className="arcade-main">
        {/* VIEW: ARCADE HUB */}
        {currentView === "hub" && (
          <ArcadeHub
            activeTeam={activeTeam}
            allTeams={teams}
            onSelectGame={(gameId) => {
              setActiveGameMeta(null);
              setCurrentView(gameId);
            }}
          />
        )}

        {/* VIEW: PROTECTED ADMIN PANEL */}
        {currentView === "admin" && (
          <AdminPanel
            teams={teams}
            activeTeamName={activeTeamName}
            adminPin={adminPin}
            onAdminAuth={handleAdminAuth}
            onRefresh={loadState}
            onClose={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
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

        {/* GAME 6: OFFLINE ARENA */}
        {currentView === "offline" && (
          <OfflineArena
            currentScore={activeTeam.offlineGame}
            activeTeamName={activeTeam.name}
            adminPin={adminPin}
            onFinish={(score) => {
              setActiveGameMeta(null);
              handleGameFinish("offlineGame", "Offline Live Arena", score);
            }}
            onBack={() => {
              sound.playClick();
              setActiveGameMeta(null);
              setCurrentView("hub");
            }}
            onOpenAdmin={() => {
              sound.playClick();
              setCurrentView("admin");
            }}
            onUpdateMeta={setActiveGameMeta}
          />
        )}
      </main>

      <CelebrationModal
        isOpen={celebrationData.isOpen}
        gameTitle={celebrationData.gameTitle}
        pointsEarned={celebrationData.pointsEarned}
        newTotal={celebrationData.newTotal}
        onClose={handleCloseCelebration}
      />
    </div>
  );
}
