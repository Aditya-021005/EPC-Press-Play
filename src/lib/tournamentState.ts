export type {
  NameThatTuneSubmissionItem,
  CategorySubmissionItem,
  BullseyeSubmissionItem,
  BullseyeCriteriaItem,
  GameSubmissionRecord,
} from "./serverStorage";

import type { GameSubmissionRecord } from "./serverStorage";

export interface TeamScore {
  name: string;
  greenerGrass: number;
  realHeadline: number;
  nameThatTune: number;
  categories: number;
  reverseMillionaire: number;
  offlineGame: number;
  total: number;
  lastUpdated: number;
  playedGames: string[];
}

export const ALL_GAME_KEYS = [
  "greenerGrass",
  "realHeadline",
  "nameThatTune",
  "categories",
  "reverseMillionaire",
  "offlineGame",
] as const;

export function isGamePlayed(team: TeamScore | undefined | null, gameKey: string): boolean {
  if (!team) return false;
  if (Array.isArray(team.playedGames) && team.playedGames.includes(gameKey)) {
    return true;
  }
  return false;
}

export function getPlayedGamesCount(team: TeamScore | undefined | null): number {
  if (!team) return 0;
  if (Array.isArray(team.playedGames)) {
    return team.playedGames.length;
  }
  return 0;
}

export const DEFAULT_TEAMS: TeamScore[] = [];

export const STORAGE_KEY_TEAMS = "epc_tournament_teams_v1";
export const STORAGE_KEY_ACTIVE = "epc_tournament_active_team_v1";
export const STORAGE_KEY_ADMIN_PIN = "epc_admin_auth_pin_v1";

export function cleanTeamName(name: string): string {
  return name.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]+\s*/u, "").trim();
}

export function getStoredTeams(): TeamScore[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((t: any) => {
        const played = Array.isArray(t.playedGames) ? [...t.playedGames] : [];
        for (const gk of ALL_GAME_KEYS) {
          if ((t[gk] || 0) > 0 && !played.includes(gk)) {
            played.push(gk);
          }
        }
        return {
          ...t,
          name: cleanTeamName(t.name),
          playedGames: played,
        };
      });
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredTeams(teams: TeamScore[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
  } catch (err) {
    console.error("Failed to save teams to localStorage", err);
  }
}

export function getStoredActiveTeam(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem(STORAGE_KEY_ACTIVE);
  return stored ? cleanTeamName(stored) : "";
}

export function saveStoredActiveTeam(teamName: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ACTIVE, teamName);
}

export function getStoredAdminAuth(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY_ADMIN_PIN);
}

export function setStoredAdminAuth(pin: string | null) {
  if (typeof window === "undefined") return;
  if (pin) {
    sessionStorage.setItem(STORAGE_KEY_ADMIN_PIN, pin);
  } else {
    sessionStorage.removeItem(STORAGE_KEY_ADMIN_PIN);
  }
}

// Backend API Fetch
export async function fetchBackendTournamentState(): Promise<{
  activeTeam: string;
  teams: TeamScore[];
  submissions?: Record<string, Record<string, GameSubmissionRecord>>;
} | null> {
  try {
    const res = await fetch("/api/tournament", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      saveStoredTeams(json.data.teams);
      saveStoredActiveTeam(json.data.activeTeam);
      return json.data;
    }
  } catch (err) {
    console.warn("Backend API unreachable:", err);
  }
  return null;
}

// Check Backend Game Eligibility
export async function checkBackendGameEligibility(
  teamName: string,
  gameKey: string
): Promise<{ canPlay: boolean; isPlayed: boolean; score: number }> {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkGameEligibility",
        teamName,
        gameKey,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      return {
        canPlay: json.canPlay === true,
        isPlayed: json.isPlayed === true,
        score: json.score || 0,
      };
    }
  } catch (err) {
    console.warn("Could not check game eligibility with backend:", err);
  }
  return { canPlay: true, isPlayed: false, score: 0 };
}

// Player Action: Legitimate Game Round Completion
export async function submitPlayerGameResult(
  teamName: string,
  gameKey: string,
  score: number
): Promise<{ success: boolean; alreadyPlayed?: boolean; error?: string }> {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submitGameResult",
        teamName,
        gameKey,
        score,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.status === 403 || json.code === "ALREADY_PLAYED") {
      return { success: false, alreadyPlayed: true, error: json.message };
    }
    return { success: res.ok, error: json.message };
  } catch (err) {
    console.warn("Failed to sync score to backend:", err);
    return { success: false, error: String(err) };
  }
}

// Admin Action: Toggle or Unlock Game Played Status (allow replay or remove play)
export async function adminToggleGamePlayed(
  pin: string,
  teamName: string,
  gameKey: string,
  allowReplay = false,
  resetScore = false
) {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminToggleGamePlayed",
        pin,
        teamName,
        gameKey,
        allowReplay,
        resetScore,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Admin Action: Verify PIN
export async function verifyAdminPin(pin: string): Promise<boolean> {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verifyPin",
        pin,
      }),
    });
    const json = await res.json();
    return json.success === true;
  } catch {
    return false;
  }
}

// Admin Action: Set Active Team
export async function adminSetActiveTeam(pin: string, teamName: string) {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminSetActiveTeam",
        pin,
        teamName,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Admin Action: Add Custom Team
export async function adminAddTeam(pin: string, teamName: string) {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminAddTeam",
        pin,
        teamName,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Admin Action: Delete Team
export async function adminDeleteTeam(pin: string, teamName: string) {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminDeleteTeam",
        pin,
        teamName,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data.teams)) {
        saveStoredTeams(json.data.teams);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Admin Action: Wipe All Teams (Clear Roster)
export async function adminWipeAllTeams(pin: string) {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminWipeAllTeams",
        pin,
      }),
    });
    if (res.ok) {
      saveStoredTeams([]);
      saveStoredActiveTeam("");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("epc_active_session_user");
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Admin Action: Manual Score Override
export async function adminOverrideScore(pin: string, teamName: string, gameKey: string, score: number) {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminOverrideScore",
        pin,
        teamName,
        gameKey,
        score,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Participant Action: Submit Detailed Answers for Host Manual Scoring
export async function submitGameAnswers(
  teamName: string,
  gameKey: string,
  payload: { items: any[]; letter?: string }
): Promise<boolean> {
  const clean = cleanTeamName(teamName);
  if (!clean) return false;
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submitGameAnswers",
        teamName: clean,
        gameKey,
        items: payload.items,
        letter: payload.letter,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn("Could not submit game answers to backend:", err);
    return false;
  }
}

// Admin Action: Evaluate Itemized Submissions (0/2.5/5 for Tune parts, 0/5/10 for Categories)
export async function adminEvaluateSubmission(
  pin: string,
  teamName: string,
  gameKey: string,
  items: any[],
  totalScore: number,
  markPlayed = true,
  letter?: string
): Promise<boolean> {
  const clean = cleanTeamName(teamName);
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminEvaluateSubmission",
        pin,
        teamName: clean,
        gameKey,
        items,
        totalScore,
        markPlayed,
        letter,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data.teams)) {
        saveStoredTeams(json.data.teams);
      }
      return true;
    }
    return false;
  } catch (err) {
    console.warn("Could not evaluate submission on backend:", err);
    return false;
  }
}

// Admin Action: Reset Tournament (Scores to 0 or Full Wipe)
export async function adminResetTournament(pin: string, wipeRoster = false) {
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminResetTournament",
        pin,
        wipeRoster,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data.teams)) {
        saveStoredTeams(json.data.teams);
      }
      if (wipeRoster) {
        saveStoredTeams([]);
        saveStoredActiveTeam("");
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("epc_active_session_user");
        }
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Registration Laptop Action: Register Team without stealing other laptops' active sessions
export async function registerTeamOnly(teamName: string): Promise<{
  teams: TeamScore[];
} | null> {
  const cleanName = cleanTeamName(teamName);
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "registerTeam",
        teamName: cleanName,
        skipSetActive: true,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveStoredTeams(json.data.teams);
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not register team to backend:", err);
  }
  return null;
}

// Single-Laptop Event Action: Select or Register Active Team
export async function selectOrCreateTeam(teamName: string): Promise<{
  activeTeam: string;
  teams: TeamScore[];
} | null> {
  const cleanName = cleanTeamName(teamName);
  saveStoredActiveTeam(cleanName);

  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "selectOrCreateTeam",
        teamName: cleanName,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveStoredTeams(json.data.teams);
        saveStoredActiveTeam(json.data.activeTeam);
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not sync team to backend, using local fallback:", err);
  }

  // Local fallback
  const localTeams = getStoredTeams();
  let existing = localTeams.find((t) => t.name.toLowerCase() === cleanName.toLowerCase());
  if (!existing) {
    existing = {
      name: cleanName,
      greenerGrass: 0,
      realHeadline: 0,
      nameThatTune: 0,
      categories: 0,
      reverseMillionaire: 0,
      offlineGame: 0,
      total: 0,
      lastUpdated: Date.now(),
      playedGames: [],
    };
    localTeams.push(existing);
    saveStoredTeams(localTeams);
  }
  return { activeTeam: cleanName, teams: localTeams };
}

// Player Action: Logout / Finish Turn / Give Up
export async function playerLogout(teamName?: string): Promise<boolean> {
  saveStoredActiveTeam("");
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("epc_active_session_user");
  }
  try {
    const res = await fetch("/api/tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "playerLogout",
        teamName: teamName || "",
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveStoredTeams(json.data.teams);
        saveStoredActiveTeam("");
        return true;
      }
    }
    return false;
  } catch (err) {
    console.warn("Could not sync logout to backend:", err);
    return false;
  }
}

