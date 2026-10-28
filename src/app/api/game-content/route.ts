import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDefaultGameContent, AllGameContent } from "@/lib/gameContent";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "game_content.json");
const TOURNAMENT_FILE = path.join(DATA_DIR, "tournament.json");

let memoryContent: AllGameContent = getDefaultGameContent();

function loadAdminPin(): string {
  try {
    if (fs.existsSync(TOURNAMENT_FILE)) {
      const raw = fs.readFileSync(TOURNAMENT_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.adminPin) return String(parsed.adminPin).trim();
    }
  } catch {}
  return "1234";
}

function loadGameContent(): AllGameContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories)) {
        memoryContent = {
          ...getDefaultGameContent(),
          ...parsed,
        };
        return memoryContent;
      }
    }
  } catch (err) {
    console.warn("Could not read game_content.json, using defaults:", err);
  }

  // Initialize file if not exists
  const defaults = getDefaultGameContent();
  saveGameContent(defaults);
  return defaults;
}

function saveGameContent(content: AllGameContent) {
  memoryContent = content;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write game_content.json:", err);
  }
}

// GET /api/game-content
export async function GET() {
  const content = loadGameContent();
  return NextResponse.json({
    success: true,
    data: content,
    timestamp: Date.now(),
  });
}

// POST /api/game-content (Admin only)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminPin = loadAdminPin();

    if (String(body.pin).trim() !== adminPin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid Host PIN" },
        { status: 401 }
      );
    }

    const { section, data } = body;
    if (!section || !data) {
      return NextResponse.json(
        { success: false, message: "Invalid payload: section and data required" },
        { status: 400 }
      );
    }

    const current = loadGameContent();

    if (section === "categories" && Array.isArray(data)) {
      current.categories = data;
    } else if (section === "tunes" && Array.isArray(data)) {
      current.tunes = data;
    } else if (section === "headlines" && Array.isArray(data)) {
      current.headlines = data;
    } else if (section === "millionaire" && Array.isArray(data)) {
      current.millionaire = data;
    } else if (section === "words" && Array.isArray(data)) {
      current.words = data;
    } else if (section === "bullseye" && Array.isArray(data)) {
      current.bullseye = data;
    } else if (section === "resetAll") {
      const fresh = getDefaultGameContent();
      fresh.version = current.version + 1;
      saveGameContent(fresh);
      return NextResponse.json({ success: true, data: fresh });
    } else {
      return NextResponse.json(
        { success: false, message: "Unknown section" },
        { status: 400 }
      );
    }

    current.version = (current.version || 1) + 1;
    saveGameContent(current);

    return NextResponse.json({
      success: true,
      message: `Updated ${section} successfully`,
      data: current,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 }
    );
  }
}
