import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { AllGameContent, getDefaultGameContent } from "./gameContent";

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
}

export interface TournamentState {
  activeTeam: string;
  adminPin: string;
  lockedGames: string[];
  teams: TeamScore[];
  version: number;
}

export const DEFAULT_TOURNAMENT_STATE: TournamentState = {
  activeTeam: "",
  adminPin: process.env.ADMIN_PIN || "1234",
  lockedGames: [],
  teams: [],
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
          parsed.adminPin = "1234";
        }
        if (!parsed.lockedGames) parsed.lockedGames = [];
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
        memoryTournamentState = remote;
        return remote;
      }

      // If Redis has no data yet, seed it from local file or defaults
      const seedState = readLocalTournamentFile() || memoryTournamentState || DEFAULT_TOURNAMENT_STATE;
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
    memoryTournamentState = local;
    return local;
  }

  return memoryTournamentState;
}

export async function saveTournamentState(state: TournamentState): Promise<void> {
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
