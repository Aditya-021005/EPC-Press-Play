import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File storage path for persistent backend
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tournament.json");

interface TeamScore {
  name: string;
  greenerGrass: number;
  realHeadline: number;
  nameThatTune: number;
  categories: number;
  reverseMillionaire: number;
  offlineGame: number;
  total: number;
  lastUpdated: number;
}

interface TournamentState {
  activeTeam: string;
  adminPin: string;
  lockedGames: string[];
  teams: TeamScore[];
  version: number;
}

const DEFAULT_STATE: TournamentState = {
  activeTeam: "",
  adminPin: "1234",
  lockedGames: [],
  teams: [],
  version: 1,
};

let memoryState: TournamentState = { ...DEFAULT_STATE };

function loadTournamentState(): TournamentState {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.teams)) {
        if (!parsed.adminPin) parsed.adminPin = "1234";
        if (!parsed.lockedGames) parsed.lockedGames = [];
        memoryState = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read tournament data file, falling back to memory:", err);
  }
  return memoryState;
}

function saveTournamentState(state: TournamentState) {
  memoryState = state;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write tournament data file, kept in memory:", err);
  }
}

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
  const state = loadTournamentState();

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
    timestamp: Date.now(),
  });
}

// POST /api/tournament - Handles actions (Player submissions vs Admin actions)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state = loadTournamentState();

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
        saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // 3. Public Participant Action: Select or Register Team on the single laptop
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
        saveTournamentState(state);
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
      saveTournamentState(state);
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
        saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Delete Team
    if (body.action === "adminDeleteTeam" && body.teamName) {
      state.teams = state.teams.filter((t) => t.name !== body.teamName);
      if (state.activeTeam === body.teamName && state.teams.length > 0) {
        state.activeTeam = state.teams[0].name;
      }
      state.version++;
      saveTournamentState(state);
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
        saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Reset Tournament
    if (body.action === "adminResetTournament") {
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
      state.version++;
      saveTournamentState(state);
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Change PIN
    if (body.action === "adminChangePin" && body.newPin) {
      state.adminPin = String(body.newPin).trim();
      saveTournamentState(state);
      return NextResponse.json({ success: true, message: "PIN updated" });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
