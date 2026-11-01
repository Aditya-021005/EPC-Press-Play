/**
 * Question & Item Tracking Utility
 * Ensures questions, headlines, words, and tunes are never repeated across game runs
 * until the entire pool is exhausted, then seamlessly cycles.
 */

export function pickNonRepeatingItems<T>(
  storageKey: string,
  pool: T[],
  count: number,
  getId: (item: T) => string
): T[] {
  if (!pool || pool.length === 0) return [];
  if (pool.length <= count) return [...pool].sort(() => 0.5 - Math.random());

  let usedIds: string[] = [];
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        usedIds = JSON.parse(stored);
        if (!Array.isArray(usedIds)) usedIds = [];
      }
    }
  } catch {
    usedIds = [];
  }

  // Filter out items already played
  let available = pool.filter((item) => !usedIds.includes(getId(item)));

  // If fewer than needed, reset usedIds to cycle through again
  if (available.length < count) {
    usedIds = [];
    available = [...pool];
  }

  // Shuffle available items
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  // Update storage
  const nextUsedIds = Array.from(new Set([...usedIds, ...selected.map(getId)]));
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(nextUsedIds));
    }
  } catch {
    // Graceful fallback if storage quota exceeded or disabled
  }

  return selected;
}
