export interface MillionaireQuestion {
  id: string;
  category: string;
  question: string;
  options: [string, string, string, string]; // [A, B, C, D]
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export const MILLIONAIRE_QUESTIONS_POOL: MillionaireQuestion[] = [
  {
    id: "m1",
    category: "GEOGRAPHY & NATURE",
    question: "Which of these countries has the longest continuous coastline in the world?",
    options: ["Canada", "Russia", "Australia", "Indonesia"],
    correctIndex: 0,
    explanation: "Canada boasts 243,042 kilometers of coastline across three oceans, vastly outranking any other nation!"
  },
  {
    id: "m2",
    category: "SCIENCE & ASTRONOMY",
    question: "Which planet in our solar system rotates clockwise on its axis (retrograde rotation)?",
    options: ["Mars", "Venus", "Saturn", "Neptune"],
    correctIndex: 1,
    explanation: "Venus (along with Uranus) rotates backwards compared to most other planets, so the Sun rises in the west and sets in the east."
  },
  {
    id: "m3",
    category: "HISTORY & ARCHAEOLOGY",
    question: "Which ancient civilization constructed the cliffside city of Machu Picchu?",
    options: ["Maya Empire", "Aztec Empire", "Inca Empire", "Olmec Civilization"],
    correctIndex: 2,
    explanation: "Machu Picchu was built by the Inca Empire around 1450 AD in the Eastern Cordillera of southern Peru."
  },
  {
    id: "m4",
    category: "ANIMAL KINGDOM",
    question: "Which mammal possesses the most powerful bite force relative to its body size?",
    options: ["Grizzly Bear", "Hippopotamus", "Tasmanian Devil", "Hyena"],
    correctIndex: 2,
    explanation: "The Tasmanian Devil possesses a bite force quotient of 181, generating enough pressure to crush thick bones despite weighing only 18 lbs!"
  },
  {
    id: "m5",
    category: "TECHNOLOGY & INNOVATION",
    question: "In what year was the very first iPhone officially announced by Steve Jobs?",
    options: ["2005", "2007", "2009", "2010"],
    correctIndex: 1,
    explanation: "Steve Jobs unveiled the revolutionary original iPhone on January 9, 2007 at the Macworld convention in San Francisco."
  },
  {
    id: "m6",
    category: "POP CULTURE & CINEMA",
    question: "Which film was the very first animated feature movie released by Walt Disney Studios?",
    options: ["Pinocchio", "Bambi", "Snow White and the Seven Dwarfs", "Dumbo"],
    correctIndex: 2,
    explanation: "Snow White and the Seven Dwarfs premiered in December 1937 as Hollywood's first full-length cel-animated feature."
  },
  {
    id: "m7",
    category: "WORLD RECORDS",
    question: "What is the deepest known location in Earth's oceans?",
    options: ["Challenger Deep", "Java Trench", "Puerto Rico Trench", "Sunda Deep"],
    correctIndex: 0,
    explanation: "Challenger Deep in the Mariana Trench plunges nearly 11,000 meters (36,000 feet) below sea level."
  },
  {
    id: "m8",
    category: "CHEMISTRY & ELEMENTS",
    question: "What is the only metal element that remains a liquid at standard room temperature and pressure?",
    options: ["Gallium", "Mercury", "Bromine", "Cesium"],
    correctIndex: 1,
    explanation: "Mercury (Hg) is a liquid at room temperature. Bromine is also liquid, but it is a halogen non-metal!"
  },
  {
    id: "m9",
    category: "LITERATURE & ARTS",
    question: "Who painted the iconic surrealist masterpiece 'The Persistence of Memory' featuring melting clocks?",
    options: ["Pablo Picasso", "René Magritte", "Salvador Dalí", "Claude Monet"],
    correctIndex: 2,
    explanation: "Salvador Dalí completed 'The Persistence of Memory' in 1931, cementing melting watches as the hallmark of Surrealism."
  },
  {
    id: "m10",
    category: "SPORTS & ATHLETICS",
    question: "In standard Olympic archery competitions, how far away from the archer is the target placed?",
    options: ["50 meters", "70 meters", "90 meters", "100 meters"],
    correctIndex: 1,
    explanation: "Standard World Archery and Olympic recurve competition distance is exactly 70 meters."
  }
];
