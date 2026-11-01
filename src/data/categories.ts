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
  { name: "Bollywood movies", hint: "e.g. Sholay, 3 Idiots, DDLJ, Dangal...", icon: "film" },
  { name: "Hollywood movies", hint: "e.g. Inception, Titanic, Gladiator, Avatar...", icon: "film" },
  { name: "Anime characters", hint: "e.g. Naruto, Goku, Luffy, Levi...", icon: "mask" },
  { name: "Book titles", hint: "e.g. 1984, Harry Potter, Dune, The Hobbit...", icon: "film" },
  { name: "Musical artists or bands", hint: "e.g. Queen, Arijit Singh, Coldplay, Taylor Swift...", icon: "guitar" },
  { name: "Marvel Characters", hint: "e.g. Iron Man, Thor, Spider-Man, Loki...", icon: "mask" },
  { name: "Video games", hint: "e.g. Minecraft, GTA, Valorant, FIFA...", icon: "film" },
  { name: "Ice cream flavours", hint: "e.g. Vanilla, Butterscotch, Belgian Chocolate...", icon: "cookie" },
  { name: "Things found in a kitchen", hint: "e.g. Blender, Spatula, Microwave, Pan...", icon: "utensils" },
  { name: "Fast food chains", hint: "e.g. McDonald's, KFC, Subway, Domino's...", icon: "cookie" },
  { name: "Things you find in a supermarket", hint: "e.g. Trolley, Cereal, Barcode scanner, Milk...", icon: "paperclip" },
  { name: "Things people collect", hint: "e.g. Stamps, Coins, Sneakers, Action figures...", icon: "star" },
  { name: "Things found in a classroom", hint: "e.g. Blackboard, Chalk, Projector, Duster...", icon: "paperclip" },

  // 13 Hearts (♥)
  { name: "Things you pack for a trip", hint: "e.g. Passport, Charger, Sunscreen, Toothbrush...", icon: "suitcase" },
  { name: "Things you find in a bathroom", hint: "e.g. Shampoo, Towel, Mirror, Soap...", icon: "utensils" },
  { name: "Countries", hint: "e.g. Japan, Germany, Brazil, Canada...", icon: "globe" },
  { name: "Capital cities", hint: "e.g. Tokyo, Paris, London, New Delhi...", icon: "globe" },
  { name: "Indian cities", hint: "e.g. Mumbai, Bengaluru, Jaipur, Hyderabad...", icon: "globe" },
  { name: "Rivers", hint: "e.g. Ganga, Nile, Amazon, Danube...", icon: "globe" },
  { name: "Mountains", hint: "e.g. Everest, K2, Kilimanjaro, Alps...", icon: "globe" },
  { name: "Things found at an airport", hint: "e.g. Boarding pass, Runway, Luggage carousel...", icon: "suitcase" },
  { name: "Places where people go on dates", hint: "e.g. Cafe, Cinema, Beach, Park...", icon: "star" },
  { name: "Animals", hint: "e.g. Tiger, Elephant, Kangaroo, Cheetah...", icon: "paw" },
  { name: "Birds", hint: "e.g. Peacock, Eagle, Penguin, Flamingo...", icon: "paw" },
  { name: "Flowers", hint: "e.g. Rose, Lotus, Jasmine, Sunflower...", icon: "carrot" },
  { name: "Electrical Appliances", hint: "e.g. Refrigerator, Washing machine, Toaster...", icon: "wrench" },

  // 13 Diamonds (♦)
  { name: "Famous historical figures", hint: "e.g. Gandhi, Julius Caesar, Napoleon, Lincoln...", icon: "star" },
  { name: "Scientists", hint: "e.g. Einstein, Newton, Marie Curie, Raman...", icon: "star" },
  { name: "Languages", hint: "e.g. Hindi, Spanish, Mandarin, French...", icon: "globe" },
  { name: "Professions", hint: "e.g. Doctor, Architect, Pilot, Software Engineer...", icon: "briefcase" },
  { name: "Festivals", hint: "e.g. Diwali, Holi, Eid, Christmas...", icon: "star" },
  { name: "Chemical Elements", hint: "e.g. Oxygen, Gold, Carbon, Helium...", icon: "wrench" },
  { name: "Currencies", hint: "e.g. Rupee, Dollar, Euro, Yen...", icon: "star" },
  { name: "Clothing Items", hint: "e.g. Kurta, Hoodie, Jeans, Blazer...", icon: "tag" },
  { name: "Diseases", hint: "e.g. Malaria, Diabetes, Dengue, Asthma...", icon: "briefcase" },
  { name: "Body Parts", hint: "e.g. Forehead, Elbow, Lungs, Shoulder...", icon: "paw" },
  { name: "Emotions", hint: "e.g. Euphoria, Nostalgia, Anxiety, Joy...", icon: "bullhorn" },
  { name: "World Festivals & Celebrations", hint: "e.g. Oktoberfest, Carnival, Thanksgiving...", icon: "star" },
  { name: "Religions", hint: "e.g. Hinduism, Buddhism, Christianity, Islam...", icon: "globe" },

  // 13 Clubs (♣)
  { name: "Spices", hint: "e.g. Cardamom, Turmeric, Cumin, Cinnamon...", icon: "carrot" },
  { name: "School Subjects", hint: "e.g. Physics, History, Calculus, Geography...", icon: "paperclip" },
  { name: "Clothing Brands", hint: "e.g. Zara, Nike, Gucci, Levi's...", icon: "tag" },
  { name: "Makeup Products", hint: "e.g. Lipstick, Mascara, Concealer, Eyeliner...", icon: "star" },
  { name: "Skincare Products", hint: "e.g. Sunscreen, Moisturizer, Serum, Toner...", icon: "utensils" },
  { name: "Constellations", hint: "e.g. Orion, Ursa Major, Cassiopeia, Pegasus...", icon: "globe" },
  { name: "Dance Styles", hint: "e.g. Kathak, Hip Hop, Salsa, Bharatnatyam...", icon: "star" },
  { name: "Olympic Sports", hint: "e.g. Archery, Javelin, Swimming, Gymnastics...", icon: "futbol" },
  { name: "Car Brands", hint: "e.g. Porsche, Ferrari, BMW, Tesla...", icon: "wrench" },
  { name: "Song Titles", hint: "e.g. Bohemian Rhapsody, Chaiyya Chaiyya, Shape of You...", icon: "guitar" },
  { name: "BITS Course Titles", hint: "e.g. DSA, Mechatronics, Microprocessors, Thermo...", icon: "paperclip" },
  { name: "Places inside BITS", hint: "e.g. ANC, Rotunda, SAC, Sky Lawns, Clock Tower...", icon: "globe" },
  { name: "BITS Professor/Admin Names", hint: "e.g. Director, Dean, Campus Faculty...", icon: "briefcase" },
];

export const CATEGORY_CARDS_POOL: CategoryCard[] = [];

let topicIdx = 0;
for (const s of SUITS) {
  for (const r of RANKS) {
    const topic = TOPIC_DEFINITIONS[topicIdx] || {
      name: `Category for ${r}${s.symbol}`,
      hint: "Creative category topic",
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
