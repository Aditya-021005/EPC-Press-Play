export interface CategoryCard {
  id: string;
  name: string;
  icon: string;
  hint: string;
  popularKeywords?: string[];
}

export const CATEGORY_CARDS_POOL: CategoryCard[] = [
  { id: "c1", name: "Country or Capital City", icon: "globe", hint: "e.g. France, Madrid, Brazil..." },
  { id: "c2", name: "Animal or Sea Creature", icon: "paw", hint: "e.g. Tiger, Dolphin, Elephant..." },
  { id: "c3", name: "Something Found in a Kitchen", icon: "utensils", hint: "e.g. Microwave, Fork, Blender..." },
  { id: "c4", name: "Movie or TV Series Title", icon: "film", hint: "e.g. Titanic, Friends, Gladiator..." },
  { id: "c5", name: "Famous Celebrity or Musician", icon: "star", hint: "e.g. Beyoncé, Tom Cruise, Adele..." },
  { id: "c6", name: "Fruit, Vegetable or Dish", icon: "carrot", hint: "e.g. Mango, Pizza, Broccoli..." },
  { id: "c7", name: "Superhero or Comic Character", icon: "mask", hint: "e.g. Batman, Spider-Man, Thor..." },
  { id: "c8", name: "Global Brand or Company", icon: "tag", hint: "e.g. Nike, Apple, Ferrari, Sony..." },
  { id: "c9", name: "Something You Yell When Angry", icon: "bullhorn", hint: "e.g. Stop, No, Damn, Wait..." },
  { id: "c10", name: "Things You Pack in a Suitcase", icon: "suitcase", hint: "e.g. Passport, Socks, Sunscreen..." },
  { id: "c11", name: "Musical Instrument", icon: "guitar", hint: "e.g. Guitar, Piano, Saxophone..." },
  { id: "c12", name: "Sport or Physical Game", icon: "futbol", hint: "e.g. Soccer, Tennis, Basketball..." },
  { id: "c13", name: "Job or Profession", icon: "briefcase", hint: "e.g. Doctor, Architect, Pilot..." },
  { id: "c14", name: "Something Made of Metal", icon: "wrench", hint: "e.g. Coin, Wrench, Engine, Key..." },
  { id: "c15", name: "Dessert or Sweet Snack", icon: "cookie", hint: "e.g. Donut, Chocolate, Ice Cream..." },
  { id: "c16", name: "Things in an Office", icon: "paperclip", hint: "e.g. Stapler, Computer, Printer..." }
];

export const PLAYABLE_LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
  "K", "L", "M", "N", "O", "P", "R", "S", "T", "W"
];

// Quick helper to validate whether an answer begins with the required letter and is non-empty
export function validateCategoryAnswer(input: string, letter: string): { valid: boolean; reason: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, reason: "No answer provided" };
  }
  // Remove leading articles like 'The ', 'A ', 'An ' if user typed them
  let normalized = trimmed.toUpperCase();
  if (normalized.startsWith("THE ")) normalized = normalized.substring(4);
  else if (normalized.startsWith("A ")) normalized = normalized.substring(2);
  else if (normalized.startsWith("AN ")) normalized = normalized.substring(3);

  if (!normalized.startsWith(letter.toUpperCase()) && !trimmed.toUpperCase().startsWith(letter.toUpperCase())) {
    return { valid: false, reason: `Must start with letter '${letter.toUpperCase()}'` };
  }

  if (trimmed.length < 2) {
    return { valid: false, reason: "Answer too short" };
  }

  return { valid: true, reason: "Valid letter match" };
}
