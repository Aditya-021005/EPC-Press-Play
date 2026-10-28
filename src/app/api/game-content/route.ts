import { NextResponse } from "next/server";
import { getDefaultGameContent } from "@/lib/gameContent";
import {
  loadGameContent,
  saveGameContent,
  loadTournamentState,
} from "@/lib/serverStorage";

// GET /api/game-content
export async function GET() {
  const content = await loadGameContent();
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
    const tournament = await loadTournamentState();
    const adminPin = tournament.adminPin || "1234";

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

    const current = await loadGameContent();

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
      fresh.version = (current.version || 1) + 1;
      await saveGameContent(fresh);
      return NextResponse.json({ success: true, data: fresh });
    } else {
      return NextResponse.json(
        { success: false, message: "Unknown section" },
        { status: 400 }
      );
    }

    current.version = (current.version || 1) + 1;
    await saveGameContent(current);

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
