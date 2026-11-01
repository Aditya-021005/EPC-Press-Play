import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { AllGameContent, getDefaultGameContent } from "./gameContent";

export const GAME_KEYS = [
  "greenerGrass",
  "realHeadline",
  "nameThatTune",
  "categories",
  "reverseMillionaire",
  "offlineGame",
] as const;

export type GameKeyType = (typeof GAME_KEYS)[number];

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

export function normalizeTeamRecord(team: Partial<TeamScore>): TeamScore {
  let played: string[];
  if (Array.isArray(team.playedGames)) {
    played = [...team.playedGames];
  } else {
    // Only infer from scores for legacy migrations if playedGames was missing
    played = [];
    for (const gk of GAME_KEYS) {
      if (((team as any)[gk] || 0) > 0) {
        played.push(gk);
      }
    }
  }
  return {
    name: team.name || "Player",
    greenerGrass: team.greenerGrass || 0,
    realHeadline: team.realHeadline || 0,
    nameThatTune: team.nameThatTune || 0,
    categories: team.categories || 0,
    reverseMillionaire: team.reverseMillionaire || 0,
    offlineGame: team.offlineGame || 0,
    total: team.total || 0,
    lastUpdated: team.lastUpdated || Date.now(),
    playedGames: played,
  };
}

export interface NameThatTuneSubmissionItem {
  trackIdx: number;
  lyric: string;
  expectedSong: string;
  expectedArtist: string;
  genre?: string;
  year?: number;
  enteredSong: string;
  enteredArtist: string;
  songScore?: number; // 0, 2.5, 5
  artistScore?: number; // 0, 2.5, 5
}

export interface CategorySubmissionItem {
  cardId: string;
  cardName: string;
  cardRank?: string;
  cardSuit?: string;
  hint?: string;
  letter: string;
  enteredAnswer: string;
  score?: number; // 0, 5, 10
}

export interface BullseyeCriteriaItem {
  id: string;
  title: string;
  shortLabel: string;
  selectedOption: string;
}

export interface BullseyeSubmissionItem {
  // 5 Spinners + 3 Answers format:
  criteria?: BullseyeCriteriaItem[];
  answers?: [string, string, string] | string[];
  answerNotes?: string[];
  answerScores?: number[];

  // Legacy board format compatibility:
  boardIdx?: number;
  categoryName?: string;
  hint?: string;
  examples?: string[];
  guesses?: [string, string, string];
  dartPoints?: number;
  score?: number; // 0 to 100
}

export interface GameSubmissionRecord {
  submittedAt: number;
  evaluated?: boolean;
  evaluatedAt?: number;
  totalScore?: number;
  letter?: string;
  items: Array<NameThatTuneSubmissionItem | CategorySubmissionItem | BullseyeSubmissionItem | any>;
}

export interface TournamentState {
  activeTeam: string;
  adminPin: string;
  lockedGames: string[];
  teams: TeamScore[];
  submissions?: Record<string, Record<string, GameSubmissionRecord>>;
  version: number;
}

export const DEFAULT_TOURNAMENT_STATE: TournamentState = {
  activeTeam: "",
  adminPin: process.env.ADMIN_PIN || "pressplay",
  lockedGames: [],
  teams: [],
  submissions: {},
  version: 1,
};

const DATA_DIR = path.join(process.cwd(), "data");
const TOURNAMENT_FILE = path.join(DATA_DIR, "tournament.json");
const CONTENT_FILE = path.join(DATA_DIR, "game_content.json");

function initRedis(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (url && token) {
      return new Redis({ url, token });
    }
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

const redis = initRedis();

let memoryTournamentState: TournamentState = { ...DEFAULT_TOURNAMENT_STATE };
let memoryGameContent: AllGameContent = getDefaultGameContent();

export function isUsingRedis(): boolean {
  return redis !== null;
}

// ---------------------------------------------------------------------------
// TOURNAMENT STATE
// ---------------------------------------------------------------------------

function readLocalTournamentFile(): TournamentState | null {
  try {
    if (fs.existsSync(TOURNAMENT_FILE)) {
      const raw = fs.readFileSync(TOURNAMENT_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.teams)) {
        if (process.env.ADMIN_PIN) {
          parsed.adminPin = process.env.ADMIN_PIN;
        } else if (!parsed.adminPin) {
          parsed.adminPin = "pressplay";
        }
        if (!parsed.lockedGames) parsed.lockedGames = [];
        if (!parsed.submissions) parsed.submissions = {};
        parsed.teams = parsed.teams.map(normalizeTeamRecord);
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local tournament file:", err);
  }
  return null;
}

function writeLocalTournamentFile(state: TournamentState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TOURNAMENT_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    // Expected on Vercel's read-only serverless environment
    console.warn("Local tournament disk write bypassed (serverless environment):", err);
  }
}

export async function loadTournamentState(): Promise<TournamentState> {
  if (redis) {
    try {
      const remote = await redis.get<TournamentState>("epc_tournament_state");
      if (remote && Array.isArray(remote.teams)) {
        remote.adminPin = process.env.ADMIN_PIN || "pressplay";
        remote.teams = remote.teams.map(normalizeTeamRecord);
        if (!remote.submissions) remote.submissions = {};
        memoryTournamentState = remote;
        return remote;
      }

      // If Redis has no data yet, seed it from local file or defaults
      const seedState = readLocalTournamentFile() || memoryTournamentState || DEFAULT_TOURNAMENT_STATE;
      seedState.adminPin = process.env.ADMIN_PIN || "pressplay";
      seedState.teams = seedState.teams.map(normalizeTeamRecord);
      if (!seedState.submissions) seedState.submissions = {};
      await redis.set("epc_tournament_state", seedState);
      memoryTournamentState = seedState;
      return seedState;
    } catch (err) {
      console.error("Upstash Redis load failed, falling back to local/memory:", err);
    }
  }

  // Local fallback (offline / non-Vercel dev)
  const local = readLocalTournamentFile();
  if (local) {
    local.adminPin = process.env.ADMIN_PIN || "pressplay";
    memoryTournamentState = local;
    return local;
  }

  memoryTournamentState.adminPin = process.env.ADMIN_PIN || "pressplay";
  return memoryTournamentState;
}

export async function saveTournamentState(state: TournamentState): Promise<void> {
  state.adminPin = process.env.ADMIN_PIN || "pressplay";
  memoryTournamentState = state;

  if (redis) {
    try {
      await redis.set("epc_tournament_state", state);
    } catch (err) {
      console.error("Upstash Redis save error:", err);
    }
  }

  // Always attempt local disk save for local dev (gracefully catches EROFS on Vercel)
  writeLocalTournamentFile(state);
}

// ---------------------------------------------------------------------------
// GAME CONTENT & QUESTIONS
// ---------------------------------------------------------------------------

function readLocalGameContentFile(): AllGameContent | null {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories)) {
        return {
          ...getDefaultGameContent(),
          ...parsed,
        };
      }
    }
  } catch (err) {
    console.warn("Could not read local game content file:", err);
  }
  return null;
}

function writeLocalGameContentFile(content: AllGameContent) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
  } catch (err) {
    console.warn("Local game content disk write bypassed (serverless environment):", err);
  }
}

export async function loadGameContent(): Promise<AllGameContent> {
  if (redis) {
    try {
      const remote = await redis.get<AllGameContent>("epc_game_content");
      if (remote && Array.isArray(remote.categories)) {
        memoryGameContent = {
          ...getDefaultGameContent(),
          ...remote,
        };
        return memoryGameContent;
      }

      // If Redis has no content yet, seed from local file or defaults
      const seedContent = readLocalGameContentFile() || getDefaultGameContent();
      await redis.set("epc_game_content", seedContent);
      memoryGameContent = seedContent;
      return seedContent;
    } catch (err) {
      console.error("Upstash Redis game content load failed:", err);
    }
  }

  // Local fallback
  const local = readLocalGameContentFile();
  if (local) {
    memoryGameContent = local;
    return local;
  }

  const defaults = getDefaultGameContent();
  writeLocalGameContentFile(defaults);
  return defaults;
}

export async function saveGameContent(content: AllGameContent): Promise<void> {
  memoryGameContent = content;

  if (redis) {
    try {
      await redis.set("epc_game_content", content);
    } catch (err) {
      console.error("Upstash Redis game content save error:", err);
    }
  }

  writeLocalGameContentFile(content);
}
