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

// 52 unique category topics mapped to the 52 playing cards
const TOPIC_DEFINITIONS: { name: string; hint: string; icon: string }[] = [
  // 13 Spades (♠)
  { name: "Country or Capital City", hint: "e.g. France, Madrid, Brazil...", icon: "globe" },
  { name: "Animal or Sea Creature", hint: "e.g. Tiger, Dolphin, Elephant...", icon: "paw" },
  { name: "Kitchen Appliance or Utensil", hint: "e.g. Microwave, Fork, Blender...", icon: "utensils" },
  { name: "Movie or TV Series Title", hint: "e.g. Titanic, Friends, Gladiator...", icon: "film" },
  { name: "Famous Musician or Band", hint: "e.g. Adele, Beatles, Coldplay...", icon: "guitar" },
  { name: "Fruit, Vegetable or Herb", hint: "e.g. Mango, Broccoli, Basil...", icon: "carrot" },
  { name: "Superhero or Comic Character", hint: "e.g. Batman, Spider-Man, Thor...", icon: "mask" },
  { name: "Global Brand or Company", hint: "e.g. Nike, Apple, Ferrari...", icon: "tag" },
  { name: "Words Yelled in Anger/Excitement", hint: "e.g. Stop, Hurray, Wow, No...", icon: "bullhorn" },
  { name: "Things in a Suitcase", hint: "e.g. Passport, Socks, Sunscreen...", icon: "suitcase" },
  { name: "Musical Instrument", hint: "e.g. Guitar, Piano, Saxophone...", icon: "guitar" },
  { name: "Sport or Physical Game", hint: "e.g. Soccer, Tennis, Basketball...", icon: "futbol" },
  { name: "Job or Profession", hint: "e.g. Doctor, Architect, Pilot...", icon: "briefcase" },

  // 13 Hearts (♥)
  { name: "Things Found in a Hospital", hint: "e.g. Stethoscope, Syringe, Wheelchair...", icon: "briefcase" },
  { name: "Dessert or Sweet Snack", hint: "e.g. Donut, Chocolate, Ice Cream...", icon: "cookie" },
  { name: "Item on an Office Desk", hint: "e.g. Stapler, Computer, Printer...", icon: "paperclip" },
  { name: "College / Campus Stereotype", hint: "e.g. Exam, Hostel, Canteen...", icon: "star" },
  { name: "Clothing Item or Accessory", hint: "e.g. Jacket, Scarf, Sneakers...", icon: "tag" },
  { name: "Vehicle, Aircraft or Vessel", hint: "e.g. Ferrari, Helicopter, Yacht...", icon: "wrench" },
  { name: "Things Found in a Bathroom", hint: "e.g. Shampoo, Towel, Mirror...", icon: "utensils" },
  { name: "Pizza Topping", hint: "e.g. Mushroom, Pepperoni, Jalapeno...", icon: "cookie" },
  { name: "Board Game or Card Game", hint: "e.g. Monopoly, Catan, Poker, Uno...", icon: "mask" },
  { name: "Beverage or Drink", hint: "e.g. Cappuccino, Lemonade, Cola...", icon: "utensils" },
  { name: "Fictional Monster or Creature", hint: "e.g. Dragon, Vampire, Goblin...", icon: "paw" },
  { name: "Color or Shade", hint: "e.g. Crimson, Turquoise, Amber...", icon: "film" },
  { name: "Something That Flies", hint: "e.g. Eagle, Airplane, Mosquito...", icon: "globe" },

  // 13 Diamonds (♦)
  { name: "Fast Food Chain", hint: "e.g. McDonald's, Subway, Domino's...", icon: "cookie" },
  { name: "Song Title (Any Language)", hint: "e.g. Stay, Believer, Kesariya...", icon: "guitar" },
  { name: "Famous World Leader / Ruler", hint: "e.g. Gandhi, Caesar, Churchill...", icon: "star" },
  { name: "Part of the Human Body", hint: "e.g. Forehead, Elbow, Kidney...", icon: "paw" },
  { name: "Something Very Cold", hint: "e.g. Iceberg, Gelato, Glacier...", icon: "globe" },
  { name: "Something Very Hot", hint: "e.g. Lava, Chili, Sun, Steam...", icon: "bullhorn" },
  { name: "Social Media App or Website", hint: "e.g. Instagram, Reddit, YouTube...", icon: "tag" },
  { name: "Language or Dialect", hint: "e.g. Spanish, German, Japanese...", icon: "globe" },
  { name: "Things Found at the Beach", hint: "e.g. Seashell, Towel, Umbrella...", icon: "suitcase" },
  { name: "Things in a Classroom", hint: "e.g. Blackboard, Chalk, Projector...", icon: "paperclip" },
  { name: "Cartoon or Anime Character", hint: "e.g. Pikachu, Homer, Mickey...", icon: "mask" },
  { name: "Video Game Title", hint: "e.g. Minecraft, Zelda, Fortnite...", icon: "film" },
  { name: "Things That Make You Sneeze", hint: "e.g. Dust, Pepper, Smoke...", icon: "bullhorn" },

  // 13 Clubs (♣)
  { name: "Tree, Flower or Plant", hint: "e.g. Orchid, Pine, Rose, Cactus...", icon: "carrot" },
  { name: "Breakfast Food", hint: "e.g. Pancake, Omelette, Waffle...", icon: "cookie" },
  { name: "Weapon or Armor", hint: "e.g. Sword, Shield, Dagger, Helmet...", icon: "wrench" },
  { name: "Reason to Be Late to Class", hint: "e.g. Traffic, Alarm failed, Flat tire...", icon: "bullhorn" },
  { name: "Book or Novel Title", hint: "e.g. 1984, Hamlet, Dune, Odyssey...", icon: "film" },
  { name: "Things Under the Bed", hint: "e.g. Slippers, Dust, Storage box...", icon: "suitcase" },
  { name: "Amusement Park Ride / Food", hint: "e.g. Rollercoaster, Popcorn...", icon: "star" },
  { name: "Things with Wheels", hint: "e.g. Bicycle, Skateboard, Tractor...", icon: "wrench" },
  { name: "Crime or Illegal Action", hint: "e.g. Robbery, Speeding, Fraud...", icon: "mask" },
  { name: "Holiday or Festival", hint: "e.g. Diwali, Christmas, Halloween...", icon: "star" },
  { name: "Things Found in Outer Space", hint: "e.g. Comet, Galaxy, Asteroid...", icon: "globe" },
  { name: "Excuses People Give When Caught", hint: "e.g. It was a prank, I forgot...", icon: "bullhorn" },
  { name: "Something Made of Metal", hint: "e.g. Key, Coin, Anchor, Fork...", icon: "wrench" }
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
