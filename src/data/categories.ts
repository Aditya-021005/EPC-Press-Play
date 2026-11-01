export type CardSuit = "spades" | "hearts" | "diamonds" | "clubs";
export type CardRank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface CategoryCard {
  id: string; // e.g. "spades-A", "hearts-K"
  suit: CardSuit;
  suitSymbol: string;
  rank: CardRank;
  code: string; // e.g. "A♠", "K♥"
  color: "black" | "red";
  name: string; // The topic mapped to this playing card
  icon: string;
  hint: string;
}

const SUITS: { suit: CardSuit; symbol: string; color: "black" | "red" }[] = [
  { suit: "spades", symbol: "♠", color: "black" },
  { suit: "hearts", symbol: "♥", color: "red" },
  { suit: "diamonds", symbol: "♦", color: "red" },
  { suit: "clubs", symbol: "♣", color: "black" },
];

const RANKS: CardRank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// 52 unique category topics requested by user, mapped 1:1 to the 52 playing cards
const TOPIC_DEFINITIONS: { name: string; hint: string; icon: string }[] = [
  // 13 Spades (♠)
  { name: "Bollywood movies", hint: "", icon: "film" },
  { name: "Hollywood movies", hint: "", icon: "film" },
  { name: "Anime characters", hint: "", icon: "mask" },
  { name: "Book titles", hint: "", icon: "film" },
  { name: "Musical artists or bands", hint: "", icon: "guitar" },
  { name: "Marvel Characters", hint: "", icon: "mask" },
  { name: "Video games", hint: "", icon: "film" },
  { name: "Ice cream flavours", hint: "", icon: "cookie" },
  { name: "Things found in a kitchen", hint: "", icon: "utensils" },
  { name: "Fast food chains", hint: "", icon: "cookie" },
  { name: "Things you find in a supermarket", hint: "", icon: "paperclip" },
  { name: "Things people collect", hint: "", icon: "star" },
  { name: "Things found in a classroom", hint: "", icon: "paperclip" },

  // 13 Hearts (♥)
  { name: "Things you pack for a trip", hint: "", icon: "suitcase" },
  { name: "Things you find in a bathroom", hint: "", icon: "utensils" },
  { name: "Countries", hint: "", icon: "globe" },
  { name: "Capital cities", hint: "", icon: "globe" },
  { name: "Indian cities", hint: "", icon: "globe" },
  { name: "Rivers", hint: "", icon: "globe" },
  { name: "Mountains", hint: "", icon: "globe" },
  { name: "Things found at an airport", hint: "", icon: "suitcase" },
  { name: "Places where people go on dates", hint: "", icon: "star" },
  { name: "Animals", hint: "", icon: "paw" },
  { name: "Birds", hint: "", icon: "paw" },
  { name: "Flowers", hint: "", icon: "carrot" },
  { name: "Electrical Appliances", hint: "", icon: "wrench" },

  // 13 Diamonds (♦)
  { name: "Famous historical figures", hint: "", icon: "star" },
  { name: "Scientists", hint: "", icon: "star" },
  { name: "Languages", hint: "", icon: "globe" },
  { name: "Professions", hint: "", icon: "briefcase" },
  { name: "Festivals", hint: "", icon: "star" },
  { name: "Chemical Elements", hint: "", icon: "wrench" },
  { name: "Currencies", hint: "", icon: "star" },
  { name: "Clothing Items", hint: "", icon: "tag" },
  { name: "Diseases", hint: "", icon: "briefcase" },
  { name: "Body Parts", hint: "", icon: "paw" },
  { name: "Emotions", hint: "", icon: "bullhorn" },
  { name: "World Festivals & Celebrations", hint: "", icon: "star" },
  { name: "Religions", hint: "", icon: "globe" },

  // 13 Clubs (♣)
  { name: "Spices", hint: "", icon: "carrot" },
  { name: "School Subjects", hint: "", icon: "paperclip" },
  { name: "Clothing Brands", hint: "", icon: "tag" },
  { name: "Makeup Products", hint: "", icon: "star" },
  { name: "Skincare Products", hint: "", icon: "utensils" },
  { name: "Constellations", hint: "", icon: "globe" },
  { name: "Dance Styles", hint: "", icon: "star" },
  { name: "Olympic Sports", hint: "", icon: "futbol" },
  { name: "Car Brands", hint: "", icon: "wrench" },
  { name: "Song Titles", hint: "", icon: "guitar" },
  { name: "BITS Course Titles", hint: "", icon: "paperclip" },
  { name: "Places inside BITS", hint: "", icon: "globe" },
  { name: "BITS Professor/Admin Names", hint: "", icon: "briefcase" },
];

export const CATEGORY_CARDS_POOL: CategoryCard[] = [];

let topicIdx = 0;
for (const s of SUITS) {
  for (const r of RANKS) {
    const topic = TOPIC_DEFINITIONS[topicIdx] || {
      name: `Category for ${r}${s.symbol}`,
      hint: "",
      icon: "star",
    };
    CATEGORY_CARDS_POOL.push({
      id: `${s.suit}-${r}`,
      suit: s.suit,
      suitSymbol: s.symbol,
      rank: r,
      code: `${r}${s.symbol}`,
      color: s.color,
      name: topic.name,
      icon: topic.icon,
      hint: topic.hint,
    });
    topicIdx++;
  }
}

export const PLAYABLE_LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
  "K", "L", "M", "N", "O", "P", "R", "S", "T", "W"
];

export function validateCategoryAnswer(input: string, letter: string): { valid: boolean; reason: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, reason: "No answer provided" };
  }
  let normalized = trimmed.toUpperCase();
  if (normalized.startsWith("THE ")) normalized = normalized.substring(4);
  else if (normalized.startsWith("A ")) normalized = normalized.substring(2);
  else if (normalized.startsWith("AN ")) normalized = normalized.substring(3);

  if (!normalized.startsWith(letter.toUpperCase()) && !trimmed.toUpperCase().startsWith(letter.toUpperCase())) {
    return { valid: false, reason: `Must start with '${letter.toUpperCase()}'` };
  }

  if (trimmed.length < 2) {
    return { valid: false, reason: "Too short" };
  }

  return { valid: true, reason: "Starts with letter" };
}
