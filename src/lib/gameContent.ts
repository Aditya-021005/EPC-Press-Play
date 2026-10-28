import { CATEGORY_CARDS_POOL, CategoryCard } from "@/data/categories";
import { TUNES_POOL, TuneItem } from "@/data/tunes";
import { HEADLINES_POOL, HeadlineItem } from "@/data/headlines";
import { MILLIONAIRE_QUESTIONS_POOL, MillionaireQuestion } from "@/data/millionaire";
import { TARGET_WORDS } from "@/data/words";
import { BULLSEYE_CATEGORIES_POOL, BullseyeCategory } from "@/data/bullseye";

export interface AllGameContent {
  categories: CategoryCard[];
  tunes: TuneItem[];
  headlines: HeadlineItem[];
  millionaire: MillionaireQuestion[];
  words: string[];
  bullseye: BullseyeCategory[];
  version: number;
}

export function getDefaultGameContent(): AllGameContent {
  return {
    categories: [...CATEGORY_CARDS_POOL],
    tunes: [...TUNES_POOL],
    headlines: [...HEADLINES_POOL],
    millionaire: [...MILLIONAIRE_QUESTIONS_POOL],
    words: [...TARGET_WORDS],
    bullseye: [...BULLSEYE_CATEGORIES_POOL],
    version: 1,
  };
}

export async function fetchGameContent(): Promise<AllGameContent | null> {
  try {
    const res = await fetch("/api/game-content", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch game content from API, using defaults:", err);
  }
  return null;
}

export async function updateGameContentSection<K extends keyof Omit<AllGameContent, "version">>(
  pin: string,
  section: K,
  data: AllGameContent[K]
): Promise<boolean> {
  try {
    const res = await fetch("/api/game-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pin,
        section,
        data,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
