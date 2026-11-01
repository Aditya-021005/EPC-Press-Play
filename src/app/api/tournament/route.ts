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

const AUTOMATED_GAME_KEYS = ["greenerGrass", "realHeadline", "reverseMillionaire"] as const;
const MANUAL_GAME_KEYS = ["nameThatTune", "categories", "offlineGame"] as const;
const ALL_VALID_GAME_KEYS = [...AUTOMATED_GAME_KEYS, ...MANUAL_GAME_KEYS] as const;

// GET /api/tournament - Fetch current standings, public state (strips adminPin & protects submissions)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pin = url.searchParams.get("pin");
  const state = await loadTournamentState();

  const targetPin = process.env.ADMIN_PIN || state.adminPin || "pressplay";
  const isAdmin = Boolean(pin && String(pin).trim() === targetPin);

  return NextResponse.json({
    success: true,
    data: {
      activeTeam: state.activeTeam,
      teams: state.teams,
      lockedGames: state.lockedGames,
      // SECURITY FIX: Only expose raw submission answers/expected solutions to verified admins
      submissions: isAdmin ? (state.submissions || {}) : {},
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
      const targetPin = process.env.ADMIN_PIN || state.adminPin || "pressplay";
      const isValid = String(body.pin).trim() === targetPin;
      return NextResponse.json({ success: isValid, message: isValid ? "Admin authenticated" : "Invalid PIN" });
    }

    // 2. Check Game Eligibility (Check if a team has already played this game)
    if (body.action === "checkGameEligibility" && body.teamName && body.gameKey) {
      const { teamName, gameKey } = body;
      if (!ALL_VALID_GAME_KEYS.includes(gameKey)) {
        return NextResponse.json({ success: false, message: "Invalid game key" }, { status: 400 });
      }
      const cleanName = String(teamName).trim().toLowerCase();
      const team = state.teams.find((t) => t.name.trim().toLowerCase() === cleanName);
      if (!team) {
        return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
      }
      const isPlayed = Array.isArray(team.playedGames) && team.playedGames.includes(gameKey);
      return NextResponse.json({
        success: true,
        canPlay: !isPlayed,
        isPlayed,
        score: (team as unknown as Record<string, number>)[gameKey] || 0,
        playedGames: team.playedGames || [],
      });
    }

    // 3. Player Legit Game Finish (Automatic submission from completing a game round)
    if (body.action === "submitGameResult" && body.teamName && body.gameKey) {
      const { teamName, gameKey, score } = body;

      // SECURITY FIX: Only automated client games can self-award scores.
      // Name That Tune, Categories, and Offline games must be reviewed by the host.
      if (!AUTOMATED_GAME_KEYS.includes(gameKey)) {
        return NextResponse.json(
          {
            success: false,
            message: `Forbidden: "${gameKey}" requires host evaluation and cannot be self-submitted via submitGameResult.`,
          },
          { status: 400 }
        );
      }

      const cleanName = String(teamName).trim();
      let team = state.teams.find((t) => t.name.trim().toLowerCase() === cleanName.toLowerCase());
      if (!team && cleanName) {
        team = {
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
        state.teams.push(team);
      }
      if (team) {
        if (!Array.isArray(team.playedGames)) {
          team.playedGames = [];
        }

        // FOOLPROOF BACKEND ENFORCEMENT: Each team can play each game once only!
        if (team.playedGames.includes(gameKey)) {
          return NextResponse.json(
            {
              success: false,
              code: "ALREADY_PLAYED",
              message: `Team "${team.name}" has already completed ${gameKey}. Each team gets only 1 play per game.`,
              playedGames: team.playedGames,
              data: state,
            },
            { status: 403 }
          );
        }

        const val = Math.min(100, Math.max(0, parseInt(score, 10) || 0));
        (team as unknown as Record<string, number>)[gameKey] = val;
        team.playedGames.push(gameKey);
        recalcTotal(team);
        state.version++;
        await saveTournamentState(state);
        return NextResponse.json({ success: true, data: state, playedGames: team.playedGames });
      }
      return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    // 4. Public Participant Action: Submit Detailed Answers for Host Manual Evaluation (e.g. Name That Tune, Categories, Offline Arena)
    if (body.action === "submitGameAnswers" && body.teamName && body.gameKey) {
      const { teamName, gameKey, items, letter } = body;

      // SECURITY FIX: Only allow manual game keys and bound items array length to prevent memory DOS
      if (!MANUAL_GAME_KEYS.includes(gameKey)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid gameKey "${gameKey}" for manual answer submission.`,
          },
          { status: 400 }
        );
      }

      const cleanName = String(teamName).trim();
      const cleanKey = cleanName.toLowerCase();

      let team = state.teams.find((t) => t.name.trim().toLowerCase() === cleanKey);
      if (!team && cleanName) {
        team = {
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
        state.teams.push(team);
      }

      if (!state.submissions) state.submissions = {};
      if (!state.submissions[cleanKey]) state.submissions[cleanKey] = {};

      const previous = state.submissions[cleanKey][gameKey] || {};
      const safeItems = Array.isArray(items) ? items.slice(0, 30) : previous.items || [];
      const safeLetter = typeof letter === "string" ? letter.slice(0, 5) : previous.letter || "";

      state.submissions[cleanKey][gameKey] = {
        submittedAt: Date.now(),
        evaluated: previous.evaluated || false,
        evaluatedAt: previous.evaluatedAt,
        totalScore: previous.totalScore ?? 0,
        letter: safeLetter,
        items: safeItems,
      };

      state.version++;
      await saveTournamentState(state);
      return NextResponse.json({ success: true, data: state });
    }

    // 5. Public Participant Action: Select or Register Team
    if ((body.action === "selectOrCreateTeam" || body.action === "registerTeam") && body.teamName) {
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
            playedGames: [],
          };
          state.teams.push(existing);
        }
        if (!body.skipSetActive) {
          state.activeTeam = existing.name;
        }
        state.version++;
        await saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // 5. Public Participant Action: Player Logout / Finish Turn / Give Up
    if (body.action === "playerLogout") {
      const name = String(body.teamName || "").trim();
      if (!name || state.activeTeam.toLowerCase() === name.toLowerCase()) {
        state.activeTeam = "";
        state.version++;
        await saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // --- PROTECTED ADMIN ACTIONS (Require valid PIN) ---
    const targetPin = process.env.ADMIN_PIN || state.adminPin || "pressplay";
    const adminCheck = String(body.pin).trim() === targetPin;
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
          playedGames: [],
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
      const { teamName, gameKey, score, markPlayed } = body;
      const team = state.teams.find((t) => t.name.toLowerCase() === String(teamName).toLowerCase());
      if (team) {
        const val = Math.min(100, Math.max(0, parseInt(score, 10) || 0));
        (team as unknown as Record<string, number>)[gameKey] = val;
        if (!Array.isArray(team.playedGames)) team.playedGames = [];
        if (markPlayed === true || (markPlayed === undefined && val > 0)) {
          if (!team.playedGames.includes(gameKey)) team.playedGames.push(gameKey);
        } else if (markPlayed === false) {
          team.playedGames = team.playedGames.filter((k) => k !== gameKey);
        }
        recalcTotal(team);
        state.version++;
        await saveTournamentState(state);
      }
      return NextResponse.json({ success: true, data: state });
    }

    // Admin: Detailed Item-by-Item Evaluation (Side-by-side scoring for Name That Tune, Categories, etc.)
    if (body.action === "adminEvaluateSubmission" && body.teamName && body.gameKey) {
      const { teamName, gameKey, items, totalScore, markPlayed, letter } = body;
      const cleanName = String(teamName).trim();
      const cleanKey = cleanName.toLowerCase();

      let team = state.teams.find((t) => t.name.toLowerCase() === cleanKey);
      if (!team && cleanName) {
        team = {
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
        state.teams.push(team);
      }

      if (team) {
        const val = Math.min(100, Math.max(0, Number(totalScore) || 0));
        (team as unknown as Record<string, number>)[gameKey] = val;

        if (!Array.isArray(team.playedGames)) team.playedGames = [];
        if (markPlayed !== false) {
          if (!team.playedGames.includes(gameKey)) {
            team.playedGames.push(gameKey);
          }
        }

        recalcTotal(team);

        if (!state.submissions) state.submissions = {};
        if (!state.submissions[cleanKey]) state.submissions[cleanKey] = {};

        const existingSub = state.submissions[cleanKey][gameKey] || {};
        state.submissions[cleanKey][gameKey] = {
          submittedAt: existingSub.submittedAt || Date.now(),
          evaluatedAt: Date.now(),
          evaluated: true,
          totalScore: val,
          letter: letter || existingSub.letter || "",
          items: Array.isArray(items) ? items : existingSub.items || [],
        };

        state.version++;
        await saveTournamentState(state);
        return NextResponse.json({ success: true, data: state, team });
      }
      return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    // Admin: Unlock or Toggle Game Played Status (Allows host to grant a replay or remove a play)
    if (body.action === "adminToggleGamePlayed" && body.teamName && body.gameKey) {
      const { teamName, gameKey, allowReplay, resetScore } = body;
      const team = state.teams.find((t) => t.name.toLowerCase() === String(teamName).toLowerCase());
      if (team) {
        if (!Array.isArray(team.playedGames)) team.playedGames = [];
        if (allowReplay) {
          team.playedGames = team.playedGames.filter((k) => k !== gameKey);
          if (resetScore) {
            (team as any)[gameKey] = 0;
            team.total =
              (team.greenerGrass || 0) +
              (team.realHeadline || 0) +
              (team.nameThatTune || 0) +
              (team.categories || 0) +
              (team.reverseMillionaire || 0) +
              (team.offlineGame || 0);
          }
          const cleanKey = team.name.trim().toLowerCase();
          if (state.submissions?.[cleanKey]?.[gameKey]) {
            delete state.submissions[cleanKey][gameKey];
          }
        } else if (!team.playedGames.includes(gameKey)) {
          team.playedGames.push(gameKey);
        }
        state.version++;
        await saveTournamentState(state);
        return NextResponse.json({ success: true, data: state });
      }
      return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    // Admin: Reset Tournament (Scores to 0 or Full Wipe)
    if (body.action === "adminResetTournament") {
      state.submissions = {};
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
          playedGames: [],
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
