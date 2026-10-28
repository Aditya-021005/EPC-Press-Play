"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/admin/AdminPanel";
import {
  TeamScore,
  DEFAULT_TEAMS,
  getStoredTeams,
  saveStoredTeams,
  getStoredAdminAuth,
  setStoredAdminAuth,
  fetchBackendTournamentState,
} from "@/lib/tournamentState";
import { sound } from "@/lib/audio";

export default function AdminRoutePage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamScore[]>([]);
  const [activeTeamName, setActiveTeamName] = useState<string>("");
  const [adminPin, setAdminPin] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const loadState = useCallback(async () => {
    const localTeams = getStoredTeams();
    const storedAuth = getStoredAdminAuth();
    setTeams(localTeams);
    setAdminPin(storedAuth);

    const sessionUser =
      typeof window !== "undefined" ? sessionStorage.getItem("epc_active_session_user") : null;

    const backendData = await fetchBackendTournamentState();
    if (backendData) {
      setTeams(backendData.teams);
      saveStoredTeams(backendData.teams);
      if (backendData.activeTeam) {
        setActiveTeamName(backendData.activeTeam);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("epc_active_session_user", backendData.activeTeam);
        }
      } else {
        setActiveTeamName("");
      }
    } else if (sessionUser) {
      setActiveTeamName(sessionUser);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    loadState();

    // Auto-poll every 2.5s to keep admin panel data fresh
    const pollInterval = setInterval(() => {
      fetchBackendTournamentState().then((backendData) => {
        if (backendData) {
          setTeams(backendData.teams);
          saveStoredTeams(backendData.teams);
          if (backendData.activeTeam) {
            setActiveTeamName(backendData.activeTeam);
          } else {
            setActiveTeamName("");
          }
        }
      });
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [loadState]);

  const handleAdminAuth = (pin: string | null) => {
    setAdminPin(pin);
    setStoredAdminAuth(pin);
  };

  const handleClose = () => {
    sound.playClick();
    router.push("/");
  };

  if (!isClient) return null;

  return (
    <AdminPanel
      teams={teams}
      activeTeamName={activeTeamName}
      adminPin={adminPin}
      onAdminAuth={handleAdminAuth}
      onRefresh={loadState}
      onClose={handleClose}
    />
  );
}
