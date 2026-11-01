export interface SpinnerDefinition {
  id: string;
  title: string;
  shortLabel: string;
  options: string[];
}

export const BULLSEYE_SPINNERS: SpinnerDefinition[] = [
  {
    id: "genre",
    title: "1. Genre",
    shortLabel: "Genre",
    options: [
      "Romance",
      "Comedy",
      "Thriller / Mystery",
      "Horror",
      "Fantasy / Sci-fi",
      "Drama / Adventure",
    ],
  },
  {
    id: "rating",
    title: "2. IMDb / Goodreads Rating",
    shortLabel: "Rating",
    options: [
      "IMDb 4–5 / Goodreads 2–2.5",
      "IMDb 5–6 / Goodreads 2.5–3",
      "IMDb 6–7 / Goodreads 3–3.5",
      "IMDb 7–8 / Goodreads 3.5–4",
      "IMDb 8–9 / Goodreads 4–4.5",
      "IMDb 9–10 / Goodreads 4.5–5",
    ],
  },
  {
    id: "releaseYear",
    title: "3. Release / Publication Year",
    shortLabel: "Release Year",
    options: [
      "Before 1970",
      "1970–1989",
      "1990–1999",
      "2000–2009",
      "2010–2019",
      "2020–2026",
    ],
  },
  {
    id: "setting",
    title: "4. Setting",
    shortLabel: "Setting",
    options: [
      "School / University",
      "Workplace",
      "Small Town / Village",
      "Big City / Metropolis",
      "Historical Setting",
      "Fictional / Fantasy World",
    ],
  },
  {
    id: "origin",
    title: "5. Country of Origin",
    shortLabel: "Country",
    options: [
      "India / Pakistan / Bangladesh",
      "USA / Canada / Mexico",
      "UK / Ireland / Australia",
      "South Korea / Japan / China",
      "France / Italy / Spain",
      "Germany / Russia / Sweden",
    ],
  },
];

export interface BullseyeCategory {
  id: string;
  name: string;
  hint: string;
  examples: string[];
}

export const BULLSEYE_CATEGORIES_POOL: BullseyeCategory[] = [
  {
    id: "b1",
    name: "Oscar Best Picture Winners (Post-2000)",
    hint: "Academy Award winning films",
    examples: ["Gladiator", "The Departed", "Parasite", "Oppenheimer", "Slumdog Millionaire", "The Artist"]
  },
  {
    id: "b2",
    name: "European Capital Cities",
    hint: "Official capital cities located in Europe",
    examples: ["Paris", "Berlin", "Rome", "Madrid", "Lisbon", "Amsterdam", "Dublin", "Oslo"]
  },
  {
    id: "b3",
    name: "Billion-Dollar Video Game Franchises",
    hint: "Massive gaming series/titles",
    examples: ["Grand Theft Auto", "Call of Duty", "Minecraft", "Pokemon", "Mario", "FIFA", "Fortnite"]
  },
  {
    id: "b4",
    name: "Chemical Elements Named After People or Places",
    hint: "From the periodic table",
    examples: ["Curium", "Einsteinium", "Californium", "Polonium", "Americium", "Francium", "Nobelium"]
  },
  {
    id: "b5",
    name: "Superheroes with Zero Inherent Superpowers",
    hint: "Fighters relying solely on wealth, tech, or martial arts",
    examples: ["Batman", "Iron Man", "Hawkeye", "Black Widow", "Green Arrow", "Punisher"]
  },
  {
    id: "b6",
    name: "Countries That Have Hosted the FIFA World Cup",
    hint: "Nations that hosted men's football World Cup",
    examples: ["Brazil", "Qatar", "Russia", "South Africa", "Germany", "France", "Japan", "Mexico"]
  },
  {
    id: "b7",
    name: "Companies in the S&P 500 / Trillion Dollar Club",
    hint: "World's most valuable tech & commercial titans",
    examples: ["Apple", "Microsoft", "Nvidia", "Alphabet / Google", "Amazon", "Meta", "Tesla"]
  },
  {
    id: "b8",
    name: "Fictional Magic Spells or Potions",
    hint: "From fantasy lore (Harry Potter, LOTR, D&D)",
    examples: ["Expelliarmus", "Avada Kedavra", "Polyjuice", "Lumos", "Alohomora", "Felix Felicis"]
  },
  {
    id: "b9",
    name: "Mammals That Lay Eggs or Live Underwater",
    hint: "Monotremes or marine mammals",
    examples: ["Platypus", "Echidna", "Dolphin", "Blue Whale", "Sea Otter", "Walrus", "Seal"]
  },
  {
    id: "b10",
    name: "Languages with over 100 Million Native Speakers",
    hint: "Most widely spoken world tongues",
    examples: ["Mandarin", "Spanish", "English", "Hindi", "Bengali", "Portuguese", "Russian", "Japanese"]
  }
];
