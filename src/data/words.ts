import wordleDictionary from "./wordleDictionary.json";
import wordleAnswers from "./wordleAnswers.json";

// The official 2,315 Wordle solution words (familiar, common 5-letter words)
export const TARGET_WORDS: string[] = (wordleAnswers as string[]).map((w) => w.toUpperCase());

// Complete Wordle database with 12,972 valid 5-letter English words (2,315 answers + 10,657 allowed guesses)
export const VALID_GUESSES = new Set<string>(
  (wordleDictionary as string[]).map((w) => w.toUpperCase())
);

export function isValidWord(word: string): boolean {
  const upper = word.toUpperCase().trim();
  return upper.length === 5 && VALID_GUESSES.has(upper);
}

