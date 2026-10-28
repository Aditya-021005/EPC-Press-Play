import { NextResponse } from "next/server";
import {
  TeamScore,
  TournamentState,
  loadTournamentState,
  saveTournamentState,
  isUsingRedis,
} from "@/lib/serverStorage";

// Helper to recalculate total
function recalcTotal(team: TeamScore) {
  team.total =
    team.greenerGrass +
    team.realHeadline +
    team.nameThatTune +
    team.categories +
    team.reverseMillionaire +
    team.offlineGame;
  team.lastUpdated = Date.now();
}

// GET /api/tournament - Fetch current standings, public state (strips adminPin)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pin = url.searchParams.get("pin");
  const state = await loadTournamentState();

  const isAdmin = pin === state.adminPin;

  return NextResponse.json({
    success: true,
    data: {
      activeTeam: state.activeTeam,
      teams: state.teams,
      lockedGames: state.lockedGames,
      version: state.version,
      isAdmin,
    },
    isRedis: isUsingRedis(),
    timestamp: Date.now(),
  });
}

// POST /api/tournament - Handles actions (Player submissions vs Admin actions)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state = await loadTournamentState();

    // 1. Admin Verification
    if (body.action === "verifyPin") {
      const isValid = String(body.pin).trim() === state.adminPin;
      return NextResponse.json({ success: isValid, message: isValid ? "Admin authenticated" : "Invalid PIN" });
    }

    // 2. Player Legit Game Finish (Automatic submission from completing a game round)
    if (body.action === "submitGameResult" && body.teamName && body.gameKey) {
      const { teamName, gameKey, score } = body;
      const team = state.teams.find((t) => t.name === teamName);
      if (team) {
        const val = Math.min(100, Math.max(0, parseInt(score, 10) || 0));
        // Keep highest or new score
        const current = (team as unknown as Record<string, number>)[gameKey] || 0;
        (team as unknown as Record<string, number>)[gameKey] = Math.max(current, val);
        recalcTotal(team);
        state.version++;
        await saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // 3. Public Participant Action: Select or Register Team
    if (body.action === "selectOrCreateTeam" && body.teamName) {
      const name = String(body.teamName).trim();
      if (name) {
        let existing = state.teams.find((t) => t.name.toLowerCase() === name.toLowerCase());
        if (!existing) {
          existing = {
            name,
            greenerGrass: 0,
            realHeadline: 0,
            nameThatTune: 0,
            categories: 0,
            reverseMillionaire: 0,
            offlineGame: 0,
            total: 0,
            lastUpdated: Date.now(),
          };
          state.teams.push(existing);
        }
        state.activeTeam = existing.name;
        state.version++;
        await saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // --- PROTECTED ADMIN ACTIONS (Require valid PIN) ---
    const adminCheck = String(body.pin).trim() === state.adminPin;
    if (!adminCheck) {
      return NextResponse.json({ success: false, message: "Unauthorized: Admin PIN required" }, { status: 403 });
    }

    // Admin: Set Active Team
    if (body.action === "adminSetActiveTeam" && body.teamName) {
      state.activeTeam = body.teamName;
      state.version++;
      await saveTournamentState(state);
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Add Custom Team
    if (body.action === "adminAddTeam" && body.teamName) {
      const name = String(body.teamName).trim();
      if (!state.teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
        state.teams.push({
          name,
          greenerGrass: 0,
          realHeadline: 0,
          nameThatTune: 0,
          categories: 0,
          reverseMillionaire: 0,
          offlineGame: 0,
          total: 0,
          lastUpdated: Date.now(),
        });
        state.activeTeam = name;
        state.version++;
        await saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Delete Team
    if (body.action === "adminDeleteTeam" && body.teamName) {
      const targetName = String(body.teamName).trim().toLowerCase();
      state.teams = state.teams.filter((t) => t.name.trim().toLowerCase() !== targetName);
      if (state.activeTeam.trim().toLowerCase() === targetName) {
        state.activeTeam = state.teams.length > 0 ? state.teams[0].name : "";
      }
      state.version++;
      await saveTournamentState(state);
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Wipe All Teams (Empty Entire Roster)
    if (body.action === "adminWipeAllTeams") {
      state.teams = [];
      state.activeTeam = "";
      state.version++;
      await saveTournamentState(state);
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Direct Matrix Score Override (Can edit ANY score for ANY team)
    if (body.action === "adminOverrideScore" && body.teamName && body.gameKey) {
      const { teamName, gameKey, score } = body;
      const team = state.teams.find((t) => t.name === teamName);
      if (team) {
        const val = Math.min(100, Math.max(0, parseInt(score, 10) || 0));
        (team as unknown as Record<string, number>)[gameKey] = val;
        recalcTotal(team);
        state.version++;
        await saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Reset Tournament (Scores to 0 or Full Wipe)
    if (body.action === "adminResetTournament") {
      if (body.wipeRoster === true) {
        state.teams = [];
        state.activeTeam = "";
      } else {
        state.teams = state.teams.map((t) => ({
          ...t,
          greenerGrass: 0,
          realHeadline: 0,
          nameThatTune: 0,
          categories: 0,
          reverseMillionaire: 0,
          offlineGame: 0,
          total: 0,
          lastUpdated: Date.now(),
        }));
      }
      state.version++;
      await saveTournamentState(state);
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Change PIN
    if (body.action === "adminChangePin" && body.newPin) {
      state.adminPin = String(body.newPin).trim();
      await saveTournamentState(state);
      return NextResponse.json({ success: true, message: "PIN updated" });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
