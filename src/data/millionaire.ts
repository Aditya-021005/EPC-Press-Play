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
    "id": "m_1",
    "category": "GENERAL TRIVIA",
    "question": "Which was the the first spacecraft to pass through Venus twice?",
    "options": [
      "New Horizons",
      "Hubbles",
      "Parker Solar Probe",
      "Cassini-Huygens"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Cassini-Huygens"
  },
  {
    "id": "m_2",
    "category": "GENERAL TRIVIA",
    "question": "Which is the coldest liquid on Earth?",
    "options": [
      "Liquid Neon",
      "Liquid Nitrogen",
      "Liquid Helium",
      "Cooled glass"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Liquid Helium"
  },
  {
    "id": "m_3",
    "category": "GENERAL TRIVIA",
    "question": "Jacques Piccard and Don Walsh were the first to...",
    "options": [
      "discovering the Titanic wreck",
      "reach the north pole",
      "take a non-stop flight across Atlantic",
      "reach the bottom of Mariana Trench"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: reach the bottom of Mariana Trench"
  },
  {
    "id": "m_4",
    "category": "GENERAL TRIVIA",
    "question": "Which animated TV show holds the Guinness World Record for global demand?",
    "options": [
      "Dragon Ball Z",
      "Attack on Titan",
      "My Hero Academia",
      "One piece"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: My Hero Academia"
  },
  {
    "id": "m_5",
    "category": "GENERAL TRIVIA",
    "question": "Who is the author of To Kill a Mockingbird?",
    "options": [
      "Mark Twain",
      "George Eliot",
      "Ernest Hemingway",
      "Harper Lee"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Harper Lee"
  },
  {
    "id": "m_6",
    "category": "GENERAL TRIVIA",
    "question": "With which country do you attribute the ancient wonder of Colossus of Rhodes?",
    "options": [
      "Egypt",
      "Spain",
      "Italy",
      "Greece"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Greece"
  },
  {
    "id": "m_7",
    "category": "GENERAL TRIVIA",
    "question": "Who is considered the father of medicine?",
    "options": [
      "Aristotle",
      "Socrates",
      "Hippocrates",
      "Galen"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Hippocrates"
  },
  {
    "id": "m_8",
    "category": "GENERAL TRIVIA",
    "question": "Who actually drew the sketches in Titanic?",
    "options": [
      "Leonardo DiCaprio",
      "Peter Lamont",
      "James Cameron",
      "Ken Marschall"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: James Cameron"
  },
  {
    "id": "m_9",
    "category": "GENERAL TRIVIA",
    "question": "If you want to watch the Marvel movies in chronological order, which will you watch first?",
    "options": [
      "Captain America: The first Avenger",
      "Iron Man",
      "Infinity War",
      "The Age of Ultron"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Captain America: The first Avenger"
  },
  {
    "id": "m_10",
    "category": "GENERAL TRIVIA",
    "question": "Who is the author of Sense & Sensibility?",
    "options": [
      "Virginia Wolfe",
      "Enid Blyton",
      "Jane Austen",
      "Charlotte Bront\u00eb"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Jane Austen"
  },
  {
    "id": "m_11",
    "category": "GENERAL TRIVIA",
    "question": "Which NASA mission carries a physical message from humans in outer space?",
    "options": [
      "Curiosity Rover",
      "James Webb",
      "Grace Roman Space Telescope",
      "Voyager"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Voyager"
  },
  {
    "id": "m_12",
    "category": "GENERAL TRIVIA",
    "question": "Who is remembered as Portugal's Posthumous Queen?",
    "options": [
      "Maria Theresa",
      "Joana of Castille",
      "Eleanor of Aragon",
      "Ines de Castro"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Ines de Castro"
  },
  {
    "id": "m_13",
    "category": "GENERAL TRIVIA",
    "question": "In which city would you be in if you are standing at Spanish Steps?",
    "options": [
      "Mexico City",
      "Madrid",
      "Rome",
      "Barcelona"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Rome"
  },
  {
    "id": "m_14",
    "category": "GENERAL TRIVIA",
    "question": "Which software giant has its headquarsters in Redmond, Washington?",
    "options": [
      "Apple",
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Microsoft"
  },
  {
    "id": "m_15",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the most number of islands?",
    "options": [
      "Sweden",
      "Japan",
      "Australia",
      "Greenland"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Sweden"
  },
  {
    "id": "m_16",
    "category": "GENERAL TRIVIA",
    "question": "Which is the only continent to lie in all 4 hemispheres?",
    "options": [
      "Europe",
      "Africa",
      "Asia",
      "North America"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Africa"
  },
  {
    "id": "m_17",
    "category": "GENERAL TRIVIA",
    "question": "Which is the hottest place on Earth?",
    "options": [
      "Sahara desert",
      "El Azizia, Libya",
      "Lut desert, Iran",
      "Death Valley, USA"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Death Valley, USA"
  },
  {
    "id": "m_18",
    "category": "GENERAL TRIVIA",
    "question": "Which Renaissance artist is buried in Rome's Pantheon?",
    "options": [
      "Leonardo Da Vinci",
      "Donatello",
      "Raphael",
      "Michelangelo"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Raphael"
  },
  {
    "id": "m_19",
    "category": "GENERAL TRIVIA",
    "question": "What was the first computer virus called?",
    "options": [
      "Trojan",
      "Stuxnet",
      "Brain",
      "Creeper"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Creeper"
  },
  {
    "id": "m_20",
    "category": "GENERAL TRIVIA",
    "question": "Which company was initially called Cadabra?",
    "options": [
      "Amazon",
      "Snapdeals",
      "GoDaddy",
      "Walmart"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Amazon"
  },
  {
    "id": "m_21",
    "category": "GENERAL TRIVIA",
    "question": "Who is the Most Streamed artist on Spotify?",
    "options": [
      "Taylor Swift",
      "Sabrina Carpenter",
      "Shawn Mendes",
      "Bruno Mars"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Taylor Swift"
  },
  {
    "id": "m_22",
    "category": "GENERAL TRIVIA",
    "question": "On whose work is Christopher Nolan's 'The Odyssey' based on?",
    "options": [
      "Homer",
      "James Joyce",
      "Dante Aleghieri",
      "Hesiod"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Homer"
  },
  {
    "id": "m_23",
    "category": "GENERAL TRIVIA",
    "question": "Who has won the most Academy Awards?",
    "options": [
      "Steven Spielberg",
      "Stanley Kubrick",
      "James Cameron",
      "Walt Disney"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Walt Disney"
  },
  {
    "id": "m_24",
    "category": "GENERAL TRIVIA",
    "question": "First name of the Argentian football star Maradona is...",
    "options": [
      "Hugo",
      "Fabrizio",
      "Diego",
      "Alfredo"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Diego"
  },
  {
    "id": "m_25",
    "category": "GENERAL TRIVIA",
    "question": "Which animal has the longest lifespan?",
    "options": [
      "Jellyfish",
      "Glass sponge",
      "Tortoise",
      "Elephants"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Glass sponge"
  },
  {
    "id": "m_26",
    "category": "GENERAL TRIVIA",
    "question": "Which country passes through the most timezones?",
    "options": [
      "Russia",
      "China",
      "France",
      "Australia"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: France"
  },
  {
    "id": "m_27",
    "category": "GENERAL TRIVIA",
    "question": "Which book by Paulo Coelho mirrors the essay The Myth of Sisyphus?",
    "options": [
      "The Alchemist",
      "The Fifth Mountain",
      "The Devil & Miss Prym",
      "Veronika Decides to Die"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Veronika Decides to Die"
  },
  {
    "id": "m_28",
    "category": "GENERAL TRIVIA",
    "question": "In Greek mythology, who is condemned to hold the world on his shoulders forever?",
    "options": [
      "Hercules",
      "Zeus",
      "Atlas",
      "Poseidon"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Atlas"
  },
  {
    "id": "m_29",
    "category": "GENERAL TRIVIA",
    "question": "Which stringed instrument has its peg box bent at a right angle to the neck?",
    "options": [
      "Harp",
      "Cello",
      "Lute",
      "Violin"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Lute"
  },
  {
    "id": "m_30",
    "category": "GENERAL TRIVIA",
    "question": "Which bird shares its name with the term for three consecutive strikes in bowling?",
    "options": [
      "Turkey",
      "Albatross",
      "Eagle",
      "Goose"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Turkey"
  },
  {
    "id": "m_31",
    "category": "GENERAL TRIVIA",
    "question": "What is the deepest lake in the world by maximum depth?",
    "options": [
      "Lake Superior",
      "Lake Baikal",
      "Caspian Sea",
      "Lake Tanganyika"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Lake Baikal"
  },
  {
    "id": "m_32",
    "category": "GENERAL TRIVIA",
    "question": "Which human body part has no blood supply and gets O2 from air?",
    "options": [
      "The Cornea",
      "Sclera",
      "Eardrum",
      "Retina"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: The Cornea"
  },
  {
    "id": "m_33",
    "category": "GENERAL TRIVIA",
    "question": "Which novel famously opens with the line \"Call me Ishmael.\"?",
    "options": [
      "Moby- Dick",
      "The Old Man and the Sea",
      "Treasure Island",
      "20,000 Leagues Under the Sea"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Moby- Dick"
  },
  {
    "id": "m_34",
    "category": "GENERAL TRIVIA",
    "question": "What is the only sea on Earth that has no land boundaries?",
    "options": [
      "Baltic Sea",
      "Red Sea",
      "Sargasso Sea",
      "Coral Sea"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Sargasso Sea"
  },
  {
    "id": "m_35",
    "category": "GENERAL TRIVIA",
    "question": "Which Planet has a day longer than its year?",
    "options": [
      "Mercury",
      "Mars",
      "Venus",
      "Neptune"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Venus"
  },
  {
    "id": "m_36",
    "category": "GENERAL TRIVIA",
    "question": "Which element was the first artificial one synthesized",
    "options": [
      "Promethium",
      "Plutonium",
      "Neptunium",
      "Technetium (Tc)"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Technetium (Tc)"
  },
  {
    "id": "m_37",
    "category": "GENERAL TRIVIA",
    "question": "What is the highest waterfall in the world above ground?",
    "options": [
      "Victoria Falls",
      "Angel Falls, Venezuela",
      "Niagara Falls",
      "Iguazu Falls"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Angel Falls, Venezuela"
  },
  {
    "id": "m_38",
    "category": "GENERAL TRIVIA",
    "question": "What is the largest land carnivore currently living on Earth?",
    "options": [
      "Polar Bear",
      "African Lion",
      "Kodiak Bear",
      "Grizzly Bear"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Polar Bear"
  },
  {
    "id": "m_39",
    "category": "GENERAL TRIVIA",
    "question": "Which musical instrument features a keyboard, bellows, and reed pipes?",
    "options": [
      "Harmonium",
      "Accordion",
      "Concertina",
      "Pipe Organ"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Accordion"
  },
  {
    "id": "m_40",
    "category": "GENERAL TRIVIA",
    "question": "What is the standard number of holes played in a regulation round of golf?",
    "options": [
      "36.0",
      "9.0",
      "12.0",
      "18.0"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: 18.0"
  },
  {
    "id": "m_41",
    "category": "GENERAL TRIVIA",
    "question": "What is the official currency used in Mexico?",
    "options": [
      "Bolivar",
      "Real",
      "Peso",
      "Sol"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Peso"
  },
  {
    "id": "m_42",
    "category": "GENERAL TRIVIA",
    "question": "Which citrus fruit is a natural hybrid of the pomelo and sweet orange?",
    "options": [
      "Lemon",
      "Tangerine",
      "Grapefruit",
      "Kumquat"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Grapefruit"
  },
  {
    "id": "m_43",
    "category": "GENERAL TRIVIA",
    "question": "What is the term for a word that sounds like what it describes",
    "options": [
      "Synecdoche",
      "Alliteration",
      "Oxymoron",
      "Onomatopoeia"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Onomatopoeia"
  },
  {
    "id": "m_44",
    "category": "GENERAL TRIVIA",
    "question": "Which ancient Greek philosopher was sentenced to death by drinking hemlock?",
    "options": [
      "Pythagoras",
      "Socrates",
      "Aristotle",
      "Plato"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Socrates"
  },
  {
    "id": "m_45",
    "category": "GENERAL TRIVIA",
    "question": "What is the only sea on Earth that has no land boundaries?",
    "options": [
      "Baltic Sea",
      "Sargasso Sea",
      "Red Sea",
      "Coral Sea"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Sargasso Sea"
  },
  {
    "id": "m_46",
    "category": "GENERAL TRIVIA",
    "question": "Which element was the first artificial one synthesized",
    "options": [
      "Plutonium",
      "Technetium (Tc)",
      "Neptunium",
      "Promethium"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Technetium (Tc)"
  },
  {
    "id": "m_47",
    "category": "GENERAL TRIVIA",
    "question": "What is the capital city of Australia?",
    "options": [
      "Brisbane",
      "Sydney",
      "Melbourne",
      "Canberra"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Canberra"
  },
  {
    "id": "m_48",
    "category": "GENERAL TRIVIA",
    "question": "Which chemical element has the symbol Au?",
    "options": [
      "Silver",
      "Copper",
      "Gold",
      "Aluminum"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Gold"
  },
  {
    "id": "m_49",
    "category": "GENERAL TRIVIA",
    "question": "How many teeth does an adult human normally have?",
    "options": [
      "36.0",
      "32.0",
      "28.0",
      "30.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 32.0"
  },
  {
    "id": "m_50",
    "category": "GENERAL TRIVIA",
    "question": "What is the hardest natural substance on Earth?",
    "options": [
      "Quartz",
      "Topaz",
      "Corundum",
      "Diamond"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Diamond"
  },
  {
    "id": "m_51",
    "category": "GENERAL TRIVIA",
    "question": "Which country is the smallest in the world?",
    "options": [
      "San Marino",
      "Monaco",
      "Nauru",
      "Vatican City"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Vatican City"
  },
  {
    "id": "m_52",
    "category": "GENERAL TRIVIA",
    "question": "What is the largest ocean on Earth?",
    "options": [
      "Atlantic Ocean",
      "Arctic Ocean",
      "Indian Ocean",
      "Pacific Ocean"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Pacific Ocean"
  },
  {
    "id": "m_53",
    "category": "GENERAL TRIVIA",
    "question": "Which country gifted the Statue of Liberty to the US?",
    "options": [
      "France",
      "Germany",
      "Spain",
      "England"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: France"
  },
  {
    "id": "m_54",
    "category": "GENERAL TRIVIA",
    "question": "How many bones are in the adult human body?",
    "options": [
      "206.0",
      "212.0",
      "250.0",
      "186.0"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: 206.0"
  },
  {
    "id": "m_55",
    "category": "GENERAL TRIVIA",
    "question": "What is the fastest land animal in the world?",
    "options": [
      "Gazelle",
      "Cheetah",
      "Pronghorn",
      "Lion"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Cheetah"
  },
  {
    "id": "m_56",
    "category": "GENERAL TRIVIA",
    "question": "Which planet is known as the Red Planet?",
    "options": [
      "Mars",
      "Venus",
      "Jupiter",
      "Saturn"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Mars"
  },
  {
    "id": "m_57",
    "category": "GENERAL TRIVIA",
    "question": "What is the main gas found in Earth's atmosphere?",
    "options": [
      "Nitrogen",
      "Oxygen",
      "Carbon Dioxide",
      "Hydrogen"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Nitrogen"
  },
  {
    "id": "m_58",
    "category": "GENERAL TRIVIA",
    "question": "Who painted the Mona Lisa?",
    "options": [
      "Michelangelo",
      "Raphael",
      "Vincent van Gogh",
      "Leonardo da Vinci"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Leonardo da Vinci"
  },
  {
    "id": "m_59",
    "category": "GENERAL TRIVIA",
    "question": "What is the national animal of Canada?",
    "options": [
      "Grizzly Bear",
      "Bison",
      "Moose",
      "Beaver"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Beaver"
  },
  {
    "id": "m_60",
    "category": "GENERAL TRIVIA",
    "question": "Which blood type is known as the universal donor?",
    "options": [
      "B negative",
      "O negative",
      "AB positive",
      "A positive"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: O negative"
  },
  {
    "id": "m_61",
    "category": "GENERAL TRIVIA",
    "question": "What was Disney's first feature-length animated film?",
    "options": [
      "Fantasia",
      "Sleeping Beauty",
      "melody time",
      "Snow White and the Seven Dwarves"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Snow White and the Seven Dwarves"
  },
  {
    "id": "m_62",
    "category": "GENERAL TRIVIA",
    "question": "what is the hardest substance found in the human body?",
    "options": [
      "nail",
      "Cartilage",
      "Enamel",
      "Bone"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Enamel"
  },
  {
    "id": "m_63",
    "category": "GENERAL TRIVIA",
    "question": "How many bones are in the adult human body?",
    "options": [
      "300.0",
      "232.0",
      "206.0",
      "261.0"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: 206.0"
  },
  {
    "id": "m_64",
    "category": "GENERAL TRIVIA",
    "question": "which jagged peaks from the natural border between France and Spain?",
    "options": [
      "The Pyrenees",
      "Sutter Buttes",
      "The Appalachians",
      "Kodar mountains"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: The Pyrenees"
  },
  {
    "id": "m_65",
    "category": "GENERAL TRIVIA",
    "question": "What global conflict ended with the signing of the Treaty of Versailles?",
    "options": [
      "Battle of Waterloo",
      "World War 1",
      "Vietnam war",
      "World War 2"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: World War 1"
  },
  {
    "id": "m_66",
    "category": "GENERAL TRIVIA",
    "question": "which famous creator painted the sistine chappel?",
    "options": [
      "vincent van gogh",
      "michaelangelo",
      "leonardo da vinci",
      "claude monet"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: leonardo da vinci"
  },
  {
    "id": "m_67",
    "category": "GENERAL TRIVIA",
    "question": "which british monarch was infamous for having seven wives?",
    "options": [
      "George VIII",
      "Henry VI",
      "Henry VIII",
      "James VI"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Henry VIII"
  },
  {
    "id": "m_68",
    "category": "GENERAL TRIVIA",
    "question": "Which ancient civilization built the Macchu Picchu complex?",
    "options": [
      "The Cherokee",
      "The Aztec",
      "The Maya",
      "The Inca"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: The Inca"
  },
  {
    "id": "m_69",
    "category": "GENERAL TRIVIA",
    "question": "What is the escape velocity of Earth's atmosphere?",
    "options": [
      "11.2km/s",
      "22.4 km/hr",
      "11.2m/s",
      "11.2km/hr"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: 11.2km/s"
  },
  {
    "id": "m_70",
    "category": "GENERAL TRIVIA",
    "question": "Which scale are earthquakes measured on?",
    "options": [
      "Magnitude Scale",
      "Richter's scale",
      "Thorson's Scale",
      "Wilson's scale"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Richter's scale"
  },
  {
    "id": "m_71",
    "category": "GENERAL TRIVIA",
    "question": "what planet has the shortest day",
    "options": [
      "Venus",
      "Mercury",
      "Mars",
      "Jupiter"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Jupiter"
  },
  {
    "id": "m_72",
    "category": "GENERAL TRIVIA",
    "question": "how many feet are in a yard?",
    "options": [
      "12.0",
      "6.0",
      "3.0",
      "5.0"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: 3.0"
  },
  {
    "id": "m_73",
    "category": "GENERAL TRIVIA",
    "question": "what river runs through paris",
    "options": [
      "rhine",
      "volga",
      "seine",
      "loire"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: seine"
  },
  {
    "id": "m_74",
    "category": "GENERAL TRIVIA",
    "question": "Most commonly spoken language of Brazil",
    "options": [
      "Nahuatl",
      "Portugese",
      "French",
      "Spanish"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Portugese"
  },
  {
    "id": "m_75",
    "category": "GENERAL TRIVIA",
    "question": "What part of a plant is a sweet potato?",
    "options": [
      "shoot",
      "root",
      "tuber",
      "stem"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: root"
  },
  {
    "id": "m_76",
    "category": "GENERAL TRIVIA",
    "question": "Where is the smallest bone of the human body located?",
    "options": [
      "Toes",
      "ankle",
      "septum",
      "ear"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: ear"
  },
  {
    "id": "m_77",
    "category": "GENERAL TRIVIA",
    "question": "Most commonly spoken language in the world",
    "options": [
      "english",
      "cantonese",
      "spanish",
      "mandarin"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: mandarin"
  },
  {
    "id": "m_78",
    "category": "GENERAL TRIVIA",
    "question": "What country has the national language with the most alphabets?",
    "options": [
      "Tazmania",
      "Georgia",
      "Barbados",
      "Cambodia"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Cambodia"
  },
  {
    "id": "m_79",
    "category": "GENERAL TRIVIA",
    "question": "Which intercontinental city is divided into two separate parts by the Bosphorus Strait",
    "options": [
      "Istanbul",
      "Rabat",
      "Port Moresby",
      "Bridgetown"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Istanbul"
  },
  {
    "id": "m_80",
    "category": "GENERAL TRIVIA",
    "question": "What nation has the highest number of time zones in the world?",
    "options": [
      "Brazil",
      "France",
      "Russia",
      "Usa"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: France"
  },
  {
    "id": "m_81",
    "category": "GENERAL TRIVIA",
    "question": "What is the term for the fear of being without a mobile phone or unable to use it",
    "options": [
      "Antiphonobia",
      "Nomophobia",
      "Phononobia",
      "Unaccphonobia"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Nomophobia"
  },
  {
    "id": "m_82",
    "category": "GENERAL TRIVIA",
    "question": "Where was coffee invented?",
    "options": [
      "Ethiopia",
      "Colombia",
      "Mexico",
      "Tanzania"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Ethiopia"
  },
  {
    "id": "m_83",
    "category": "GENERAL TRIVIA",
    "question": "What is the name of the ship that rescued Titanic passengers",
    "options": [
      "The Carpathia",
      "The Cornocupia",
      "The Cathiopia",
      "The Crown"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: The Carpathia"
  },
  {
    "id": "m_84",
    "category": "GENERAL TRIVIA",
    "question": "How many Bones do sharks have?",
    "options": [
      "465.0",
      "456.0",
      "0.0",
      "546.0"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: 0.0"
  },
  {
    "id": "m_85",
    "category": "GENERAL TRIVIA",
    "question": "What is the rarest blood type",
    "options": [
      "O+",
      "O-",
      "AB-",
      "B-"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: AB-"
  },
  {
    "id": "m_86",
    "category": "GENERAL TRIVIA",
    "question": "What phase does a moon enter after the full moon?",
    "options": [
      "Waning Gibbous",
      "Waning cresent",
      "Waxing Gibbous",
      "Waxing cresent"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Waxing Gibbous"
  },
  {
    "id": "m_87",
    "category": "GENERAL TRIVIA",
    "question": "How many ribs are there in the human body",
    "options": [
      "26.0",
      "24.0",
      "22.0",
      "28.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 24.0"
  },
  {
    "id": "m_88",
    "category": "GENERAL TRIVIA",
    "question": "What does \"D\" stand for in D-Day?",
    "options": [
      "Dinner",
      "Destiny",
      "Destined",
      "Day"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Day"
  },
  {
    "id": "m_89",
    "category": "GENERAL TRIVIA",
    "question": "What letter of the english alphabet does not apper in the alphabet",
    "options": [
      "L",
      "Q",
      "J",
      "T"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: J"
  },
  {
    "id": "m_90",
    "category": "GENERAL TRIVIA",
    "question": "What country has the most UNESCO world heritage sites",
    "options": [
      "India",
      "Italy",
      "France",
      "Greece"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Italy"
  },
  {
    "id": "m_91",
    "category": "GENERAL TRIVIA",
    "question": "What year did the movie The Godfather come out?",
    "options": [
      "1975.0",
      "1972.0",
      "1980.0",
      "1970.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 1972.0"
  },
  {
    "id": "m_92",
    "category": "GENERAL TRIVIA",
    "question": "Which mineral ranks second hardest on the Moh's hardness scale?",
    "options": [
      "Topaz",
      "Emerald",
      "Diamond",
      "Corundum"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Corundum"
  },
  {
    "id": "m_93",
    "category": "GENERAL TRIVIA",
    "question": "Which planet has the longet day",
    "options": [
      "Uranus",
      "Mercury",
      "Venus",
      "Jupiter"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Venus"
  },
  {
    "id": "m_94",
    "category": "GENERAL TRIVIA",
    "question": "What is a group of owls called?",
    "options": [
      "Parliament",
      "Bunch",
      "Pride",
      "Murder"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Parliament"
  },
  {
    "id": "m_95",
    "category": "GENERAL TRIVIA",
    "question": "Which country is home to Angel Falls, the tallest waterfall on Earth?",
    "options": [
      "Venezuela",
      "Ecuador",
      "USA",
      "Brazil"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Venezuela"
  },
  {
    "id": "m_96",
    "category": "GENERAL TRIVIA",
    "question": "What is the largest internal organ in the human body?",
    "options": [
      "Lung",
      "Liver",
      "Intestines",
      "Stomach"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Liver"
  },
  {
    "id": "m_97",
    "category": "GENERAL TRIVIA",
    "question": "Who won the F1 championship in 2005?",
    "options": [
      "Max Verstappen",
      "Michael Schumacher",
      "Lewis Hamilton",
      "Fernando Alonso"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Fernando Alonso"
  },
  {
    "id": "m_98",
    "category": "GENERAL TRIVIA",
    "question": "Which country has won the most Winter Olympics medals of all time?",
    "options": [
      "Russia",
      "China",
      "USA",
      "Norway"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Norway"
  },
  {
    "id": "m_99",
    "category": "GENERAL TRIVIA",
    "question": "Which poet composed Paradise Lost?",
    "options": [
      "Virgil",
      "Homer",
      "Milton",
      "Dante"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Milton"
  },
  {
    "id": "m_100",
    "category": "GENERAL TRIVIA",
    "question": "Which molecule carries DNA's instructions to the ribosome to build proteins?",
    "options": [
      "t-RNA",
      "RNA",
      "Mitochondria",
      "m-RNA"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: m-RNA"
  },
  {
    "id": "m_101",
    "category": "GENERAL TRIVIA",
    "question": "What is the only country crossed by both the Equator and the Tropic of Capricorn?",
    "options": [
      "Chile",
      "Indonesia",
      "Brazil",
      "Algeria"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Brazil"
  },
  {
    "id": "m_102",
    "category": "GENERAL TRIVIA",
    "question": "Which letter does not appear in the name of any element on the periodic table?",
    "options": [
      "P",
      "J",
      "Q",
      "K"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: J"
  },
  {
    "id": "m_103",
    "category": "GENERAL TRIVIA",
    "question": "In how many languages were the Spoken Greetings recorded for the Voyager Records?",
    "options": [
      "30.0",
      "55.0",
      "60.0",
      "25.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 55.0"
  },
  {
    "id": "m_104",
    "category": "GENERAL TRIVIA",
    "question": "Which album won Album Of The Year at the 2014 Grammy Awards?",
    "options": [
      "1989.0",
      "Random Access Memories",
      "Born To Die",
      "Pure Heroine"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Random Access Memories"
  },
  {
    "id": "m_105",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the most territory in Antarctica?",
    "options": [
      "Argentina",
      "France",
      "UK",
      "Australia"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Australia"
  },
  {
    "id": "m_106",
    "category": "GENERAL TRIVIA",
    "question": "Which Harry Potter movie has no on-screen deaths?",
    "options": [
      "The Philosopher's Stone",
      "Prisoner of Azkaban",
      "Chamber of Secrets",
      "Deathly Hallows - 1"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Prisoner of Azkaban"
  },
  {
    "id": "m_107",
    "category": "GENERAL TRIVIA",
    "question": "Which Star Wars character(s) have been in every Episode (I-IX)?",
    "options": [
      "Darth Vader",
      "Luke Skywalker",
      "C-3PO and R2-D2",
      "Palpatine"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: C-3PO and R2-D2"
  },
  {
    "id": "m_108",
    "category": "GENERAL TRIVIA",
    "question": "What did Chani's name mean in Dune?",
    "options": [
      "Water",
      "Desert spring",
      "Desert",
      "Messiah"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Desert spring"
  },
  {
    "id": "m_109",
    "category": "GENERAL TRIVIA",
    "question": "What major evolutionary event gave rise to nearly every modern animal phylum?",
    "options": [
      "The Great Dying",
      "Big Bang",
      "Great Oxidation Event",
      "Cambrian Explosion"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Cambrian Explosion"
  },
  {
    "id": "m_110",
    "category": "GENERAL TRIVIA",
    "question": "Who is the director of the hit 2023 movie, Barbie?",
    "options": [
      "Ava DuVernay",
      "James Cameron",
      "Greta Gerwig",
      "Sofia Coppola"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Greta Gerwig"
  },
  {
    "id": "m_111",
    "category": "GENERAL TRIVIA",
    "question": "How many countries are in the European Union?",
    "options": [
      "37.0",
      "34.0",
      "27.0",
      "42.0"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: 27.0"
  },
  {
    "id": "m_112",
    "category": "GENERAL TRIVIA",
    "question": "Who is the lead singer of the American Band Green Day?",
    "options": [
      "Billie Joe Armstrong",
      "Gerard Way",
      "Mike Durnst",
      "Tre Cool"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Billie Joe Armstrong"
  },
  {
    "id": "m_113",
    "category": "GENERAL TRIVIA",
    "question": "How many keys are on a modern, standard-sized piano?",
    "options": [
      "79.0",
      "88.0",
      "92.0",
      "75.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 88.0"
  },
  {
    "id": "m_114",
    "category": "GENERAL TRIVIA",
    "question": "How many double landlocked countries are there in the world?",
    "options": [
      "5.0",
      "3.0",
      "9.0",
      "2.0"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: 2.0"
  },
  {
    "id": "m_115",
    "category": "GENERAL TRIVIA",
    "question": "Who invented the World Wide Web?",
    "options": [
      "Steve Jobs",
      "Dennis Ritchie",
      "Ada Lovelace",
      "Tim Berners-Lee"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Tim Berners-Lee"
  },
  {
    "id": "m_116",
    "category": "GENERAL TRIVIA",
    "question": "What was the name of the merchant famous for selling low quality copper in ancient Mesopotamia?",
    "options": [
      "Gilgamesh",
      "En Kidu",
      "Ea Nasir",
      "Babylon"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Ea Nasir"
  },
  {
    "id": "m_117",
    "category": "GENERAL TRIVIA",
    "question": "What is the world's largest flower?",
    "options": [
      "Hydrangea",
      "Rafflesia",
      "Dinnerplate Dahlia",
      "Titan Sunflower"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Rafflesia"
  },
  {
    "id": "m_118",
    "category": "GENERAL TRIVIA",
    "question": "How many bones do sharks have?",
    "options": [
      "124.0",
      "131.0",
      "0.0",
      "342.0"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: 0.0"
  },
  {
    "id": "m_119",
    "category": "GENERAL TRIVIA",
    "question": "What is the rarest blood type?",
    "options": [
      "B+",
      "AB+",
      "O-",
      "AB-"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: AB-"
  },
  {
    "id": "m_120",
    "category": "GENERAL TRIVIA",
    "question": "What phase does a moon enter into after it's full?",
    "options": [
      "Half moon",
      "Waxing Crescent",
      "Waxing Gibbous",
      "Waning Gibbous"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Waxing Gibbous"
  },
  {
    "id": "m_121",
    "category": "GENERAL TRIVIA",
    "question": "Which Ballon d'Or winner has played for the most number of clubs?",
    "options": [
      "Pavel Nedved",
      "George Best",
      "Thierry Henry",
      "George Weah"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: George Best"
  },
  {
    "id": "m_122",
    "category": "GENERAL TRIVIA",
    "question": "Max Verstappen holds the record for the most number of F1 races won in a row. How many?",
    "options": [
      "10.0",
      "12.0",
      "11.0",
      "9.0"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: 10.0"
  },
  {
    "id": "m_123",
    "category": "GENERAL TRIVIA",
    "question": "Which is the longest English novel written without the letter 'E'?",
    "options": [
      "Orthogonal Galaxy",
      "Gadsby",
      "Crash",
      "Zodiac"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Gadsby"
  },
  {
    "id": "m_124",
    "category": "GENERAL TRIVIA",
    "question": "Which element of the periodic table has the highest number of stable isotopes?",
    "options": [
      "Manganese",
      "Osmium",
      "Tin",
      "Carbon"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Tin"
  },
  {
    "id": "m_125",
    "category": "GENERAL TRIVIA",
    "question": "Which TV show has been nominated for an Emmy the most number of times without winning any?",
    "options": [
      "Black Mirror",
      "The Flash",
      "Better Call Saul",
      "Ozark"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Better Call Saul"
  },
  {
    "id": "m_126",
    "category": "GENERAL TRIVIA",
    "question": "Who is known as the Father of AI?",
    "options": [
      "Sam Altman",
      "Huang Lee",
      "John McCarthy",
      "Charles Babbage"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: John McCarthy"
  },
  {
    "id": "m_127",
    "category": "GENERAL TRIVIA",
    "question": "Who is the creator of Calvin and Hobbes?",
    "options": [
      "Scott Adams",
      "Bill Watterson",
      "Jim Davis",
      "Mort Walker"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Bill Watterson"
  },
  {
    "id": "m_128",
    "category": "GENERAL TRIVIA",
    "question": "Which is the newest country to have gained independence?",
    "options": [
      "Catalonia",
      "Hong Kong",
      "South Sudan",
      "Taiwan"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: South Sudan"
  },
  {
    "id": "m_129",
    "category": "GENERAL TRIVIA",
    "question": "Who has the longest win streak in UFC history?",
    "options": [
      "Islam Makachev",
      "Conor McGregor",
      "Khabib Nurmagomedov",
      "Anderson Silva"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Islam Makachev"
  },
  {
    "id": "m_130",
    "category": "GENERAL TRIVIA",
    "question": "What does the 'S' in LASER stand for?",
    "options": [
      "Scintillated",
      "Siphoned",
      "Simulated",
      "Stimulated"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Stimulated"
  },
  {
    "id": "m_131",
    "category": "GENERAL TRIVIA",
    "question": "Which is the largest moon in the Solar System?",
    "options": [
      "Ganymede",
      "Io",
      "Titan",
      "Callisto"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Ganymede"
  },
  {
    "id": "m_132",
    "category": "GENERAL TRIVIA",
    "question": "Who lost the Battle of Waterloo?",
    "options": [
      "Charlemagne",
      "King Henry VIII",
      "Louis XIV",
      "Napoleon Bonaparte"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Napoleon Bonaparte"
  },
  {
    "id": "m_133",
    "category": "GENERAL TRIVIA",
    "question": "Which member of The Beatles was the first to die?",
    "options": [
      "John Lennon",
      "Paul McCartney",
      "Ringo Starr",
      "George Harrison"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: John Lennon"
  },
  {
    "id": "m_134",
    "category": "GENERAL TRIVIA",
    "question": "Who directed 2001: A Space Odyssey?",
    "options": [
      "Ridley Scott",
      "Denis Villeneuve",
      "Christopher Nolan",
      "Stanley Kubrick"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Stanley Kubrick"
  },
  {
    "id": "m_135",
    "category": "GENERAL TRIVIA",
    "question": "Who is the oldest F1 driver in history to have won a World Driver's Championship?",
    "options": [
      "Juan Manuel Fangio",
      "Fernando Alonso",
      "Michael Schumacher",
      "Lewis Hamilton"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Juan Manuel Fangio"
  },
  {
    "id": "m_136",
    "category": "GENERAL TRIVIA",
    "question": "Who was the first actor to portray the role of James Bond on the big screen?",
    "options": [
      "Roger Moore",
      "Sean Connery",
      "Timothy Dalton",
      "Pierce Brosnan"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Sean Connery"
  },
  {
    "id": "m_137",
    "category": "GENERAL TRIVIA",
    "question": "Who composed Clair de lune?",
    "options": [
      "Liszt",
      "Debussy",
      "Schumann",
      "Chopin"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Debussy"
  },
  {
    "id": "m_138",
    "category": "GENERAL TRIVIA",
    "question": "Which Green Lantern is a living planet?",
    "options": [
      "Dalor",
      "Aa",
      "Mogo",
      "Arx"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Mogo"
  },
  {
    "id": "m_139",
    "category": "GENERAL TRIVIA",
    "question": "Who is the author of the Twilight book series?",
    "options": [
      "Colleen Hoover",
      "Greta Gerwig",
      "Sally Rooney",
      "Stephenie Meyer"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Stephenie Meyer"
  },
  {
    "id": "m_140",
    "category": "GENERAL TRIVIA",
    "question": "Which of the following countries used to have a solid green flag?",
    "options": [
      "Syria",
      "Libya",
      "Saudi Arabia",
      "Bangladesh"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Libya"
  },
  {
    "id": "m_141",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the highest number of islands?",
    "options": [
      "Sweden",
      "Japan",
      "Canada",
      "Indonesia"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Sweden"
  },
  {
    "id": "m_142",
    "category": "GENERAL TRIVIA",
    "question": "Who handed Muhammad Ali his first loss?",
    "options": [
      "Mike Tyson",
      "Sugar Ray Robinson",
      "George Foreman",
      "Joe Frazier"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Joe Frazier"
  },
  {
    "id": "m_143",
    "category": "GENERAL TRIVIA",
    "question": "Which sport did Usain Bolt professionally begin playing after retiring from track and field?",
    "options": [
      "Football",
      "Rugby",
      "Boxing",
      "Cycling"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Football"
  },
  {
    "id": "m_144",
    "category": "GENERAL TRIVIA",
    "question": "Which US state shares a land border with only one other state?",
    "options": [
      "Maine",
      "California",
      "New Hampshire",
      "Wyoming"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Maine"
  },
  {
    "id": "m_145",
    "category": "GENERAL TRIVIA",
    "question": "Which country is completely surrounded by South Africa?",
    "options": [
      "Botswana",
      "Tanzania",
      "Lesotho",
      "Namibia"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Lesotho"
  },
  {
    "id": "m_146",
    "category": "GENERAL TRIVIA",
    "question": "Which iconic rock band's logo was inspired by the Hindu goddess Kali?",
    "options": [
      "Rage Against the Machine",
      "The Rolling Stones",
      "Foo Fighters",
      "Pineapple Express"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: The Rolling Stones"
  },
  {
    "id": "m_147",
    "category": "GENERAL TRIVIA",
    "question": "What are the only two letters that do not appear in any element of the periodic table?",
    "options": [
      "X & Z",
      "J & Q",
      "J & X",
      "Q & X"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: J & Q"
  },
  {
    "id": "m_148",
    "category": "GENERAL TRIVIA",
    "question": "Which unit is the heat of chilli peppers measured in?",
    "options": [
      "Jolok",
      "Scoville",
      "Burwell",
      "Bolo"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Scoville"
  },
  {
    "id": "m_149",
    "category": "GENERAL TRIVIA",
    "question": "Which video game holds the title for the best-selling game of all time?",
    "options": [
      "Minecraft",
      "GTA V",
      "Fortnite",
      "Five Nights at Freddy's"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Minecraft"
  },
  {
    "id": "m_150",
    "category": "GENERAL TRIVIA",
    "question": "Which famous artist cut off a portion of his own left ear during a breakdown?",
    "options": [
      "Vincent van Gogh",
      "Picasso",
      "Leonardo da Vinci",
      "Michelangelo"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Vincent van Gogh"
  },
  {
    "id": "m_151",
    "category": "GENERAL TRIVIA",
    "question": "Which river flows through the highest number of sovereign nations?",
    "options": [
      "Danube",
      "Mekong",
      "Nile",
      "Amazon"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Danube"
  },
  {
    "id": "m_152",
    "category": "GENERAL TRIVIA",
    "question": "Which body of water separates the island of Madagascar from mainland Africa?",
    "options": [
      "Strait of Hormuz",
      "Mozambique Channel",
      "Persian Gulf",
      "Red Sea"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Mozambique Channel"
  },
  {
    "id": "m_153",
    "category": "GENERAL TRIVIA",
    "question": "What gas gives the planet Neptune its distinct blue color?",
    "options": [
      "Methane",
      "Helium",
      "Ammonia",
      "Carbon Monoxide"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Methane"
  },
  {
    "id": "m_154",
    "category": "GENERAL TRIVIA",
    "question": "In which year did the Berlin Wall fall, leading to the reunification of Germany?",
    "options": [
      "1987.0",
      "1990.0",
      "1991.0",
      "1989.0"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: 1989.0"
  },
  {
    "id": "m_155",
    "category": "GENERAL TRIVIA",
    "question": "Which museum in Paris houses Leonardo da Vinci's Mona Lisa?",
    "options": [
      "Centre Pompidou",
      "Mus\u00e9e de l'Orangerie",
      "The Louvre",
      "Mus\u00e9e d'Orsay"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: The Louvre"
  },
  {
    "id": "m_156",
    "category": "GENERAL TRIVIA",
    "question": "What was the operational code name for the Axis invasion of the Soviet Union during World War II?",
    "options": [
      "Operation Citadel",
      "Operation Overlord",
      "Operation Sea Lion",
      "Operation Barbarossa"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Operation Barbarossa"
  },
  {
    "id": "m_157",
    "category": "GENERAL TRIVIA",
    "question": "What was the name of the experimental spacecraft in Christopher Nolan's 2014 sci-fi film Interstellar that docked with the Endurance?",
    "options": [
      "Hermes",
      "Ranger",
      "Discovery One",
      "Icarus"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Ranger"
  },
  {
    "id": "m_158",
    "category": "GENERAL TRIVIA",
    "question": "What is the official administrative capital of South Africa where the executive branch resides?",
    "options": [
      "Johannesburg",
      "Pretoria",
      "Cape Town",
      "Bloemfontein"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Pretoria"
  },
  {
    "id": "m_159",
    "category": "GENERAL TRIVIA",
    "question": "Which landlocked country is entirely surrounded by a single other nation?",
    "options": [
      "Lesotho",
      "Eswatini",
      "Bolivia",
      "Liechtenstein"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Lesotho"
  },
  {
    "id": "m_160",
    "category": "GENERAL TRIVIA",
    "question": "Which subatomic particle was theoretical until its experimental discovery at CERN's Large Hadron Collider in 2012?",
    "options": [
      "Tau neutrino",
      "Top quark",
      "Higgs Boson",
      "Charm quark"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Higgs Boson"
  },
  {
    "id": "m_161",
    "category": "GENERAL TRIVIA",
    "question": "In Norse mythology, what is the name of the realm inhabited by humans?",
    "options": [
      "Jotunheim",
      "Niflheim",
      "Asgard",
      "Midgard"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Midgard"
  },
  {
    "id": "m_162",
    "category": "GENERAL TRIVIA",
    "question": "What creature in Greek mythology was half-man and half-bull, trapped inside the Labyrinth of Crete?",
    "options": [
      "Minotaur",
      "Cyclops",
      "Chimera",
      "Centaur"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Minotaur"
  },
  {
    "id": "m_163",
    "category": "GENERAL TRIVIA",
    "question": "Which hero in Greek mythology famously slew the Gorgon Medusa using a reflective shield?",
    "options": [
      "Theseus",
      "Bellerophon",
      "Jason",
      "Perseus"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Perseus"
  },
  {
    "id": "m_164",
    "category": "GENERAL TRIVIA",
    "question": "In Norse mythology, what is the name of the apocalyptic battle predicted to result in the death of major gods and the submersion of the world in water?",
    "options": [
      "Valhalla",
      "Fimbulwinter",
      "Yggdrasil",
      "Ragnar\u00f6k"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Ragnar\u00f6k"
  },
  {
    "id": "m_165",
    "category": "GENERAL TRIVIA",
    "question": "Which Greek goddess of wisdom and strategic warfare sprang fully grown and armored from Zeus's forehead?",
    "options": [
      "Athena",
      "Aphrodite",
      "Artemis",
      "Hera"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Athena"
  },
  {
    "id": "m_166",
    "category": "GENERAL TRIVIA",
    "question": "In The Avengers (2012), which alien army invades New York City under Loki's command?",
    "options": [
      "The Chitauri",
      "The Skrulls",
      "The Kree",
      "The Outriders"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: The Chitauri"
  },
  {
    "id": "m_167",
    "category": "GENERAL TRIVIA",
    "question": "In the Harry Potter series, what object is used to travel instantly between places by touching it?",
    "options": [
      "Remembrall",
      "Horcrux",
      "Portkey",
      "Time-Turner"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Portkey"
  },
  {
    "id": "m_168",
    "category": "GENERAL TRIVIA",
    "question": "In Harry Potter, which magical creature guards the underground vaults at Gringotts Wizarding Bank?",
    "options": [
      "Basilisk",
      "Dragon",
      "Hippogriff",
      "Centaur"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Dragon"
  },
  {
    "id": "m_169",
    "category": "GENERAL TRIVIA",
    "question": "In Harry Potter, what spell is used to disarm an opponent?",
    "options": [
      "Expelliarmus",
      "Lumos",
      "Avada Kedavra",
      "Alohomora"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Expelliarmus"
  },
  {
    "id": "m_170",
    "category": "GENERAL TRIVIA",
    "question": "In golf, what is the term for scoring one stroke under par on a hole?",
    "options": [
      "Birdie",
      "Bogey",
      "Albatross",
      "Eagle"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Birdie"
  },
  {
    "id": "m_171",
    "category": "GENERAL TRIVIA",
    "question": "What is the distance of an official full marathon race?",
    "options": [
      "22.5 miles",
      "20 miles",
      "24.5 miles",
      "26.2 miles"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: 26.2 miles"
  },
  {
    "id": "m_172",
    "category": "GENERAL TRIVIA",
    "question": "Which country won the FIFA Women's World Cup in 2023?",
    "options": [
      "Spain",
      "England",
      "Netherlands",
      "United States"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Spain"
  },
  {
    "id": "m_173",
    "category": "GENERAL TRIVIA",
    "question": "Which fighter holds the longest win streak in UFC history?",
    "options": [
      "Anderson Silva",
      "Khabib Nurmagomedov",
      "Carlos Ulberg",
      "Conor Mcgregor"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Khabib Nurmagomedov"
  },
  {
    "id": "m_174",
    "category": "GENERAL TRIVIA",
    "question": "Which streamer set the record for the highest peak concurrent viewers on Twitch (over 3.3 million)?",
    "options": [
      "ishowspeed",
      "xQc",
      "Ibai Llanos",
      "Kai Cenat"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Ibai Llanos"
  },
  {
    "id": "m_175",
    "category": "GENERAL TRIVIA",
    "question": "Who posted the viral video of lip-syncing to \"M to the B\", which held the title for the most-liked video on TikTok for years?",
    "options": [
      "Zack King",
      "Bella Poarch",
      "Dixie D'Amelio",
      "Loren Gray"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Bella Poarch"
  },
  {
    "id": "m_176",
    "category": "GENERAL TRIVIA",
    "question": "What short-form video platform was acquired by ByteDance in 2017 and merged into TikTok in 2018?",
    "options": [
      "Vine",
      "Byte",
      "Musical.ly",
      "Triller"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Musical.ly"
  },
  {
    "id": "m_177",
    "category": "GENERAL TRIVIA",
    "question": "Which social audio app surged in massive popularity during early 2021 by hosting drop-in audio chatrooms with celebrities?",
    "options": [
      "Clubhouse",
      "Houseparty",
      "Discord",
      "BeReal"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Clubhouse"
  },
  {
    "id": "m_178",
    "category": "GENERAL TRIVIA",
    "question": "In Stranger Things, what is Eleven\u2019s favorite food that she frequently steals from grocery stores?",
    "options": [
      "Pop-Tarts",
      "Twinkies",
      "Eggo Waffles",
      "Reese's Pieces"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Eggo Waffles"
  },
  {
    "id": "m_179",
    "category": "GENERAL TRIVIA",
    "question": "In Breaking Bad, what company did Walter White co-found in college before selling his shares for $5,000?",
    "options": [
      "Beneke Fabricators",
      "Gray Matter Technologies",
      "Mesa Verde",
      "Madrigal Electromotive"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Gray Matter Technologies"
  },
  {
    "id": "m_180",
    "category": "GENERAL TRIVIA",
    "question": "In Squid Game, what number is assigned to Seong Gi-hun, the main protagonist who ultimately wins the competition?",
    "options": [
      "457.0",
      "456.0",
      "455.0",
      "1.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 456.0"
  },
  {
    "id": "m_181",
    "category": "GENERAL TRIVIA",
    "question": "In Breaking Bad, what brand of tequila does Gus Fring poison to eliminate Don Eladio and the Juarez Cartel leadership?",
    "options": [
      "Azul Reposado",
      "Don Julio",
      "Zafiro A\u00f1ejo",
      "Patron Silver"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Azul Reposado"
  },
  {
    "id": "m_182",
    "category": "GENERAL TRIVIA",
    "question": "Who was the first person to swim the English Channel?",
    "options": [
      "Robert Matthew",
      "Matthew Webb",
      "John Davis",
      "Michael Phelps"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Matthew Webb"
  },
  {
    "id": "m_183",
    "category": "GENERAL TRIVIA",
    "question": "Which ancient civilization is credited with creating the first known writing system?",
    "options": [
      "Greeks",
      "Egyptians",
      "Sumerians",
      "Romans"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Sumerians"
  },
  {
    "id": "m_184",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the longest coastline in the world?",
    "options": [
      "United States",
      "Canada",
      "Australia",
      "Russia"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Canada"
  },
  {
    "id": "m_185",
    "category": "GENERAL TRIVIA",
    "question": "Which of these is one of the only two double landlocked countries in the world?",
    "options": [
      "Uzbekistan",
      "Kyrgyzstan",
      "Kazakhstan",
      "Tajikistan"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Uzbekistan"
  },
  {
    "id": "m_186",
    "category": "GENERAL TRIVIA",
    "question": "What is the name of the cat in Cinderella?",
    "options": [
      "Duchess",
      "Lucifer",
      "Tremaine",
      "Figaro"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Lucifer"
  },
  {
    "id": "m_187",
    "category": "GENERAL TRIVIA",
    "question": "What is the capital of Brazil?",
    "options": [
      "Salvador",
      "S\u00e3o Paulo",
      "Rio de Janeiro",
      "Brasilia"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Brasilia"
  },
  {
    "id": "m_188",
    "category": "GENERAL TRIVIA",
    "question": "What is the name of the fictional hotel in The Shining (1980)?",
    "options": [
      "The Timberline Hotel",
      "The Overwatch Hotel",
      "The Oakwood Lodge",
      "The Overlook Hotel"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: The Overlook Hotel"
  },
  {
    "id": "m_189",
    "category": "GENERAL TRIVIA",
    "question": "What is the dot over the letters \"i\" and \"j\" called?",
    "options": [
      "A Tipple",
      "A Tittle",
      "A Tiddle",
      "A Tilde"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: A Tittle"
  },
  {
    "id": "m_190",
    "category": "GENERAL TRIVIA",
    "question": "How many years did the Hundred Years' War actually last?",
    "options": [
      "101.0",
      "127.0",
      "100.0",
      "116.0"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: 116.0"
  },
  {
    "id": "m_191",
    "category": "GENERAL TRIVIA",
    "question": "What is the only continent with no active volcanoes?",
    "options": [
      "South America",
      "Europe",
      "Australia",
      "North America"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Australia"
  },
  {
    "id": "m_192",
    "category": "GENERAL TRIVIA",
    "question": "What was bubble wrap originally invented to be?",
    "options": [
      "Textured wallpaper",
      "Shock-absorbing flooring",
      "Greenhouse insulation",
      "Waterproof curtains"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Textured wallpaper"
  },
  {
    "id": "m_193",
    "category": "GENERAL TRIVIA",
    "question": "Which animal's fingerprints are virtually identical to humans'?",
    "options": [
      "Koalas",
      "Raccoon",
      "Chimpanzee",
      "Lemur"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Koalas"
  },
  {
    "id": "m_194",
    "category": "GENERAL TRIVIA",
    "question": "What was the first message ever sent over the internet?",
    "options": [
      "SO",
      "TO",
      "GO",
      "LO"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: LO"
  },
  {
    "id": "m_195",
    "category": "GENERAL TRIVIA",
    "question": "What was the topic of the oldest known recorded joke?",
    "options": [
      "a mother-in-law",
      "a lazy servant",
      "Burping",
      "flatulence"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: flatulence"
  },
  {
    "id": "m_196",
    "category": "GENERAL TRIVIA",
    "question": "How many writing systems (scripts) are written from right to left?",
    "options": [
      "8.0",
      "20.0",
      "15.0",
      "12.0"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: 12.0"
  },
  {
    "id": "m_197",
    "category": "GENERAL TRIVIA",
    "question": "What is the most stolen food in the world?",
    "options": [
      "Coffee",
      "Baby Formula",
      "Milk",
      "Cheese"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Cheese"
  },
  {
    "id": "m_198",
    "category": "GENERAL TRIVIA",
    "question": "What popular drink was originally green?",
    "options": [
      "Pepsi",
      "7 Up",
      "Lemonade",
      "Coca-Cola"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Coca-Cola"
  },
  {
    "id": "m_199",
    "category": "GENERAL TRIVIA",
    "question": "Which fast food chain has the most locations worldwide?",
    "options": [
      "Pizza Hut",
      "KFC",
      "Subway",
      "McDonald\u2019s"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Subway"
  },
  {
    "id": "m_200",
    "category": "GENERAL TRIVIA",
    "question": "What nut is used to make marzipan?",
    "options": [
      "Pistachios",
      "Walnuts",
      "Cashews",
      "Almonds"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Almonds"
  },
  {
    "id": "m_201",
    "category": "GENERAL TRIVIA",
    "question": "What country eats the most chocolate per person?",
    "options": [
      "Switzerland",
      "Belgium",
      "United States",
      "France"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Switzerland"
  },
  {
    "id": "m_202",
    "category": "GENERAL TRIVIA",
    "question": "What is a group of flamingos called?",
    "options": [
      "A parade",
      "A Rafter",
      "A flamboyance",
      "A colony"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: A flamboyance"
  },
  {
    "id": "m_203",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the most pyramids?",
    "options": [
      "Eritrea",
      "Sudan",
      "Libya",
      "Egypt"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Sudan"
  },
  {
    "id": "m_204",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the most timezones?",
    "options": [
      "China",
      "United States",
      "Russia",
      "France"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: France"
  },
  {
    "id": "m_205",
    "category": "GENERAL TRIVIA",
    "question": "Which country does not have an official capital city?",
    "options": [
      "Tuvalu",
      "Nauru",
      "Kiribati",
      "Palau"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Nauru"
  },
  {
    "id": "m_206",
    "category": "GENERAL TRIVIA",
    "question": "Which is the flattest country in the world?",
    "options": [
      "Netherlands",
      "Egypt",
      "Marshall Islands",
      "The Maldives"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: The Maldives"
  },
  {
    "id": "m_207",
    "category": "GENERAL TRIVIA",
    "question": "In Pulp Fiction, what is inside the mysterious glowing briefcase?",
    "options": [
      "Daimonds",
      "A head",
      "Stacks of Money",
      "It's never revealed"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: It's never revealed"
  },
  {
    "id": "m_208",
    "category": "GENERAL TRIVIA",
    "question": "What year was The Matrix released?",
    "options": [
      "1998.0",
      "2000.0",
      "1997.0",
      "1999.0"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: 1999.0"
  },
  {
    "id": "m_209",
    "category": "GENERAL TRIVIA",
    "question": "Which film won the first-ever Academy Award for Best Picture in 1929?",
    "options": [
      "Wings",
      "The Jazz Singer",
      "Metropolis",
      "Sunrise: A Song of Two Humans"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Wings"
  },
  {
    "id": "m_210",
    "category": "GENERAL TRIVIA",
    "question": "In Die Hard, what building does the film take place in?",
    "options": [
      "Takagi Cooperation",
      "Yamamoto Plaza",
      "Nakatomi Plaza",
      "Nakamoka Tower"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Nakatomi Plaza"
  },
  {
    "id": "m_211",
    "category": "GENERAL TRIVIA",
    "question": "Which film won best picture at the 2017 Oscar's after the famous card mix-up?",
    "options": [
      "Hidden Figures",
      "Mancester By The Sea",
      "La La Land",
      "Moonlight"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Moonlight"
  },
  {
    "id": "m_212",
    "category": "GENERAL TRIVIA",
    "question": "What was the first pixar movie to be released?",
    "options": [
      "Monsters Inc.",
      "Anastasia",
      "Finding Nemo",
      "Toy Story"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Toy Story"
  },
  {
    "id": "m_213",
    "category": "GENERAL TRIVIA",
    "question": "What does ISBN stand for?",
    "options": [
      "Indexed Serial Bibliography Number",
      "International Standard Book Number",
      "Integrated System for Book Nomenclature",
      "International Standard Bibliographic Notation"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: International Standard Book Number"
  },
  {
    "id": "m_214",
    "category": "GENERAL TRIVIA",
    "question": "Which 19th century author popularised cliffhangers through serialising their novels?",
    "options": [
      "Robert Louis Stevenson",
      "Sir Arthur Conan Doyle",
      "Charles Dickens",
      "Thomas Hardy"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Charles Dickens"
  },
  {
    "id": "m_215",
    "category": "GENERAL TRIVIA",
    "question": "What literary device involves the repetition of the same vowel sound in stressed syllables?",
    "options": [
      "Assonance",
      "Sibilance",
      "Alliteration",
      "Consonance"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Assonance"
  },
  {
    "id": "m_216",
    "category": "GENERAL TRIVIA",
    "question": "In Shakespeare\u2019s Macbeth, what are the exact three titles the witches prophesy that Macbeth will hold?",
    "options": [
      "Earl of Ross, Thane of Glamis, and Protector of the Realm",
      "Thane of Glamis, Thane of Cawdor, and King hereafter",
      "Thane of Fife, Duke of Cumberland, and Lord of Scotland",
      "Prince of Inverness, Thane of Cawdor, and Sovereign of Scone"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Thane of Glamis, Thane of Cawdor, and King hereafter"
  },
  {
    "id": "m_217",
    "category": "GENERAL TRIVIA",
    "question": "What is the full name of the author who wrote the A Song of Ice and Fire series?",
    "options": [
      "Gregory Ryan Raymond Martin",
      "George Richard Robert Miller",
      "George Robert Ronald Martin",
      "George Raymond Richard Martin"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: George Raymond Richard Martin"
  },
  {
    "id": "m_218",
    "category": "GENERAL TRIVIA",
    "question": "What language was J.R.R. Tolkien's inspiration while creating his fictional elf language?",
    "options": [
      "Finnish",
      "Gaelic",
      "Old Norse",
      "Welsh"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Finnish"
  },
  {
    "id": "m_219",
    "category": "GENERAL TRIVIA",
    "question": "What is the boundary that marks the edge of the solar system?",
    "options": [
      "The Kuiper Terminator",
      "The Oort Limit",
      "The Heliopause",
      "The Event Horizon"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: The Heliopause"
  },
  {
    "id": "m_220",
    "category": "GENERAL TRIVIA",
    "question": "What animal has the strongest bite force relative to its body weight?",
    "options": [
      "Komodo Dragon",
      "Spotted Hyena",
      "Tasmanian Devil",
      "Hippopotamus"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Tasmanian Devil"
  },
  {
    "id": "m_221",
    "category": "GENERAL TRIVIA",
    "question": "What year did the Ottoman Empire officially dissolve, leading to the modern Republic of Turkey?",
    "options": [
      "1922.0",
      "1937.0",
      "1944.0",
      "1918.0"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: 1922.0"
  },
  {
    "id": "m_222",
    "category": "GENERAL TRIVIA",
    "question": "What was the very first video game ever to feature a pause button",
    "options": [
      "Tetris",
      "Space Invaders",
      "Pac-Man",
      "Super Mario Bros."
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Tetris"
  },
  {
    "id": "m_223",
    "category": "GENERAL TRIVIA",
    "question": "Who directed the critically acclaimed 2001 anime masterpiece 'Spirited Away'?",
    "options": [
      "Makoto Shinkai",
      "Mamoru Hosda",
      "Satoshi Kon",
      "Hayao Miyazaki"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Hayao Miyazaki"
  },
  {
    "id": "m_224",
    "category": "GENERAL TRIVIA",
    "question": "What is the highest-grossing independent film of all time worldwide?",
    "options": [
      "Parasite",
      "Pulp Fiction",
      "The Blair Witch Project",
      "The Passion of the Christ"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: The Passion of the Christ"
  },
  {
    "id": "m_225",
    "category": "GENERAL TRIVIA",
    "question": "What is the primary flavor ingredient that gives traditional Worcestershire sauce its distinct taste?",
    "options": [
      "Fermented Soy Beans",
      "Fermented Anchovies",
      "Crushed Capers",
      "Black Truffle Extract"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Fermented Anchovies"
  },
  {
    "id": "m_226",
    "category": "GENERAL TRIVIA",
    "question": "What currency is shared by the largest number of sovereign countries in the world?",
    "options": [
      "The Euro",
      "The Dollar",
      "The CFA Franc",
      "The East Caribbean Dollar"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: The Euro"
  },
  {
    "id": "m_227",
    "category": "GENERAL TRIVIA",
    "question": "How many squares are there in total on a standard chess board (including 1x1, 2x2, up to the full 8x8)?",
    "options": [
      "64.0",
      "128.0",
      "204.0",
      "512.0"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: 204.0"
  },
  {
    "id": "m_228",
    "category": "GENERAL TRIVIA",
    "question": "What defence mechanism do horned lizards use against predators by shooting it directly out of their eyes?",
    "options": [
      "Foul-smelling Slime",
      "Venom",
      "Blood",
      "Acid"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Blood"
  },
  {
    "id": "m_229",
    "category": "GENERAL TRIVIA",
    "question": "What was the ancient Roman unit of measurement \"mile\" (mille passus) originally based on?",
    "options": [
      "A thousand paces of a Roman soldier",
      "The length of the Roman main highway system divided by ten",
      "The distance an arrow could fly from a standard bow",
      "The distance an ox could plow in a single day"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: A thousand paces of a Roman soldier"
  },
  {
    "id": "m_230",
    "category": "GENERAL TRIVIA",
    "question": "Which fruit is known as the \"king of fruits\" in Southeast Asia?",
    "options": [
      "Durian",
      "Jackfruit",
      "Rambutan",
      "Dragon Fruit"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Durian"
  },
  {
    "id": "m_231",
    "category": "GENERAL TRIVIA",
    "question": "What is the most widely consumed manufactured drink in the entire world, second only to water?",
    "options": [
      "Tea",
      "Coffee",
      "Coca-Cola",
      "Juice"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Tea"
  },
  {
    "id": "m_232",
    "category": "GENERAL TRIVIA",
    "question": "What type of creature is a \"blue dragon\" (Glaucus atlanticus), that floats upside down on the ocean's surface?",
    "options": [
      "A sea slug",
      "A jellyfish",
      "A relative of the octopus",
      "A miniature species of ray"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: A sea slug"
  },
  {
    "id": "m_233",
    "category": "GENERAL TRIVIA",
    "question": "Which Shakespearean play features the famous, melancholic soliloquy starting with \"To be, or not to be, that is the question\"?",
    "options": [
      "Hamlet",
      "King Lear",
      "Macbeth",
      "Julius Caesar"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Hamlet"
  },
  {
    "id": "m_234",
    "category": "GENERAL TRIVIA",
    "question": "In Greek mythology, who was the clever king of Corinth condemned for eternity in the underworld to endlessly push a massive boulder up a steep hill?",
    "options": [
      "Tityos",
      "Prometheus",
      "Sisyphus",
      "Tantalus"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Sisyphus"
  },
  {
    "id": "m_235",
    "category": "GENERAL TRIVIA",
    "question": "What is the name of the optical illusion phenomenon where parallel lines appear to converge as they stretch into the distance?",
    "options": [
      "Chromatic Aberration",
      "Refraction Depth",
      "Linear Perspective",
      "Parallax Shift"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Linear Perspective"
  },
  {
    "id": "m_236",
    "category": "GENERAL TRIVIA",
    "question": "Which planet in our solar system has the shortest day?",
    "options": [
      "Mars",
      "Neptune",
      "Jupiter",
      "Saturn"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Jupiter"
  },
  {
    "id": "m_237",
    "category": "GENERAL TRIVIA",
    "question": "What is the name of the specialized scale used to measure the sweetness or sugar concentration of wine and fruit juice?",
    "options": [
      "The Brix Scale",
      "The Scoville Scale",
      "The Mohs Scale",
      "The Beaufort Scale"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: The Brix Scale"
  },
  {
    "id": "m_238",
    "category": "GENERAL TRIVIA",
    "question": "What is the primary chemical compound that gives old, vintage books their distinct smell",
    "options": [
      "Residual printer ink solvents",
      "Fermented leather oils",
      "Natural cotton plant resins",
      "Lignin and cellulose breakdown"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Lignin and cellulose breakdown"
  },
  {
    "id": "m_239",
    "category": "GENERAL TRIVIA",
    "question": "How many total keys are on a standard, full-size acoustic piano keyboard?",
    "options": [
      "64.0",
      "88.0",
      "92.0",
      "76.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 88.0"
  },
  {
    "id": "m_240",
    "category": "GENERAL TRIVIA",
    "question": "What was the original name of New York City before it was captured by the British in 1664?",
    "options": [
      "New Rotterdam",
      "New Utrecht",
      "New Amsterdam",
      "Fort Orange"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: New Amsterdam"
  },
  {
    "id": "m_241",
    "category": "GENERAL TRIVIA",
    "question": "What mythical creature from Scottish folklore is a shape-shifting water spirit that usually appears as a horse and haunts lochs and pools?",
    "options": [
      "The Selkie",
      "The Brownie",
      "The Kelpie",
      "The Banshee"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: The Kelpie"
  },
  {
    "id": "m_242",
    "category": "GENERAL TRIVIA",
    "question": "What is the official national sport of Canada?",
    "options": [
      "Canadian Football",
      "Ice Hockey",
      "Rugby Union",
      "Curling"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Ice Hockey"
  },
  {
    "id": "m_243",
    "category": "GENERAL TRIVIA",
    "question": "Which Roman god had no Greek equivalent and was uniquely Roman?",
    "options": [
      "Juno",
      "Vulcan",
      "Janus",
      "Bacchus"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Janus"
  },
  {
    "id": "m_244",
    "category": "GENERAL TRIVIA",
    "question": "Julius Caesar was assassinated on the Ides of March, which is what date?",
    "options": [
      "15.0",
      "1.0",
      "31.0",
      "30.0"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: 15.0"
  },
  {
    "id": "m_245",
    "category": "GENERAL TRIVIA",
    "question": "What year was the Titanic's wreckage found?",
    "options": [
      "1997.0",
      "1985.0",
      "1912.0",
      "1942.0"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: 1985.0"
  },
  {
    "id": "m_246",
    "category": "GENERAL TRIVIA",
    "question": "Who spent the longest cumulative time in space?",
    "options": [
      "Yuri Malenchenko",
      "Neil Armstrong",
      "Sunita Williams",
      "Oleg Kononenko"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Oleg Kononenko"
  },
  {
    "id": "m_247",
    "category": "GENERAL TRIVIA",
    "question": "First person to get married while in space?",
    "options": [
      "John Glenn",
      "Yuri Gagarin",
      "Valentina Tereshkova",
      "Yuri Malenchenko"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Yuri Malenchenko"
  },
  {
    "id": "m_248",
    "category": "GENERAL TRIVIA",
    "question": "Who is the only woman to have been on a solo space mission?",
    "options": [
      "Sunita Williams",
      "Svetlana Savitskaya",
      "Valentina Tereshkova",
      "Sally Ride"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Valentina Tereshkova"
  },
  {
    "id": "m_249",
    "category": "GENERAL TRIVIA",
    "question": "Who was the third man on the moon?",
    "options": [
      "David Scott",
      "John Young",
      "Charles \"Pete\" Conrad",
      "Buzz Aldrin"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Charles \"Pete\" Conrad"
  },
  {
    "id": "m_250",
    "category": "GENERAL TRIVIA",
    "question": "What is the nickname of the most complete T-rex specimen ever discovered?",
    "options": [
      "Mary",
      "Jack",
      "Steve",
      "Sue"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Sue"
  },
  {
    "id": "m_251",
    "category": "GENERAL TRIVIA",
    "question": "Which of these is not a real dinosaur found in the Indian subcontinent?",
    "options": [
      "Kotasaurus",
      "Delhisaurus",
      "Rajasauras",
      "Isisaurus"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Delhisaurus"
  },
  {
    "id": "m_252",
    "category": "GENERAL TRIVIA",
    "question": "How many wives did King Henry VIII have?",
    "options": [
      "6.0",
      "7.0",
      "4.0",
      "5.0"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: 6.0"
  },
  {
    "id": "m_253",
    "category": "GENERAL TRIVIA",
    "question": "Which Renaissance artist painted the Sistine Chapel ceiling?",
    "options": [
      "Michelangelo",
      "Raphael",
      "Leonardo da Vinci",
      "Donatello"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Michelangelo"
  },
  {
    "id": "m_254",
    "category": "GENERAL TRIVIA",
    "question": "Which US president signed the Civil Rights Act of 1964 into law?",
    "options": [
      "John F. Kennedy",
      "Lyndon B. Johnson",
      "Dwight D. Eisenhower",
      "Richard NIxon"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Lyndon B. Johnson"
  },
  {
    "id": "m_255",
    "category": "GENERAL TRIVIA",
    "question": "The storming of which of the following kicked off the French Revolution in 1789?",
    "options": [
      "Conciergerie",
      "Palace of Versailles",
      "Ch\u00e2teau d'If",
      "The Bastille"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: The Bastille"
  },
  {
    "id": "m_256",
    "category": "GENERAL TRIVIA",
    "question": "Which US president's home is called Monticello?",
    "options": [
      "George Washington",
      "Thomas Jefferson",
      "Andrew Jackson",
      "James Madison"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Thomas Jefferson"
  },
  {
    "id": "m_257",
    "category": "GENERAL TRIVIA",
    "question": "Which famous actress created the principles behind Wi-Fi and bluetooth?",
    "options": [
      "Rita Hayworth",
      "Grace Kelly",
      "Hedy Lamarr",
      "Marilyn Monroe"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Hedy Lamarr"
  },
  {
    "id": "m_258",
    "category": "GENERAL TRIVIA",
    "question": "Which actress has won the most Oscars?",
    "options": [
      "Meryl Streep",
      "Bette Davis",
      "Ingrid Bergman",
      "Katharine Hepburn"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Katharine Hepburn"
  },
  {
    "id": "m_259",
    "category": "GENERAL TRIVIA",
    "question": "Which famous actress helped the Dutch Resistance during World War II?",
    "options": [
      "Audrey Hepburn",
      "Vivien Leigh",
      "Ingrid Bergman",
      "Marlene Dietrich"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Audrey Hepburn"
  },
  {
    "id": "m_260",
    "category": "GENERAL TRIVIA",
    "question": "Which award is keeping Cynthia Erivo from achieving EGOT (Emmy, Grammy, Oscar, Tony) status?",
    "options": [
      "Grammy",
      "Emmy",
      "Oscar",
      "Tony"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Oscar"
  },
  {
    "id": "m_261",
    "category": "GENERAL TRIVIA",
    "question": "The first patent ever granted in the US was for a process of making:",
    "options": [
      "Potash and pearlash",
      "Gunpowder",
      "The cotton gin",
      "the polio vaccine"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Potash and pearlash"
  },
  {
    "id": "m_262",
    "category": "GENERAL TRIVIA",
    "question": "Which is the fastest rollercoaster ride in the world?",
    "options": [
      "Formula Rossa",
      "Steel Dragon 2000",
      "Falcon's Flight",
      "Kingda Ka"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Falcon's Flight"
  },
  {
    "id": "m_263",
    "category": "GENERAL TRIVIA",
    "question": "Which country's flag has an eagle eating a snake?",
    "options": [
      "Egypt",
      "Mexico",
      "Peru",
      "Spain"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Mexico"
  },
  {
    "id": "m_264",
    "category": "GENERAL TRIVIA",
    "question": "Which of these countries is not part of Scandinavia?",
    "options": [
      "Norway",
      "Sweden",
      "Finland",
      "Denmark"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Finland"
  },
  {
    "id": "m_265",
    "category": "GENERAL TRIVIA",
    "question": "Which river is known as the 'Sorrow of Bihar'?",
    "options": [
      "Brahmaputra",
      "Kosi",
      "Mahanadi",
      "Yamuna"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Kosi"
  },
  {
    "id": "m_266",
    "category": "GENERAL TRIVIA",
    "question": "The Ten Degree Channel separates which two island groups?",
    "options": [
      "Lakshwadeep and Minicoy",
      "Maldives and Minicoy",
      "Seychelles and Mauritius",
      "Andaman and Nicobar"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Andaman and Nicobar"
  },
  {
    "id": "m_267",
    "category": "GENERAL TRIVIA",
    "question": "The Union Jack is the flag of which country?",
    "options": [
      "UK",
      "US",
      "Australia",
      "New Zealand"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: UK"
  },
  {
    "id": "m_268",
    "category": "GENERAL TRIVIA",
    "question": "What human bone is the only bone not connected to another bone?",
    "options": [
      "patella",
      "incus",
      "hyoid",
      "clavicle"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: hyoid"
  },
  {
    "id": "m_269",
    "category": "GENERAL TRIVIA",
    "question": "Which unit is used to measure spiciness of chili peppers?",
    "options": [
      "Scoville Heat Units",
      "Biot Number",
      "Nusselt Number",
      "Froude Number"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Scoville Heat Units"
  },
  {
    "id": "m_270",
    "category": "GENERAL TRIVIA",
    "question": "Which animal has the highest known blood pressure?",
    "options": [
      "giraffe",
      "squirrel",
      "cheetah",
      "goat"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: giraffe"
  },
  {
    "id": "m_271",
    "category": "GENERAL TRIVIA",
    "question": "How many hearts does an octopus have?",
    "options": [
      "4.0",
      "2.0",
      "3.0",
      "5.0"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: 3.0"
  },
  {
    "id": "m_272",
    "category": "GENERAL TRIVIA",
    "question": "Who has the most Grammys?",
    "options": [
      "Beyonc\u00e9",
      "Quincy Jones",
      "Stevie Wonder",
      "Kendrick Lamar"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Beyonc\u00e9"
  },
  {
    "id": "m_273",
    "category": "GENERAL TRIVIA",
    "question": "What is the only letter that does not appear in the name of any chemical element?",
    "options": [
      "z",
      "q",
      "J",
      "x"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: J"
  },
  {
    "id": "m_274",
    "category": "GENERAL TRIVIA",
    "question": "What is the SI unit of catalytic activity?",
    "options": [
      "siemens",
      "katal",
      "Pascal",
      "Joule"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: katal"
  },
  {
    "id": "m_275",
    "category": "GENERAL TRIVIA",
    "question": "Which planet in our solar system has the shortest day?",
    "options": [
      "mercury",
      "JUpiter",
      "mars",
      "saturn"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: JUpiter"
  },
  {
    "id": "m_276",
    "category": "GENERAL TRIVIA",
    "question": "What is the boundary around a black hole beyond which nothing can escape?",
    "options": [
      "event horizon",
      "accretion disk",
      "roche limit",
      "phton sphere"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: event horizon"
  },
  {
    "id": "m_277",
    "category": "GENERAL TRIVIA",
    "question": "What is the most abundant element in Earth's crust by mass?",
    "options": [
      "iron",
      "silicon",
      "oxygen",
      "aluminium"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: oxygen"
  },
  {
    "id": "m_278",
    "category": "GENERAL TRIVIA",
    "question": "Which ancient civilisation developed cuneiform writing?",
    "options": [
      "Minoans",
      "Phoenicians",
      "Sumerians",
      "Hittites"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Sumerians"
  },
  {
    "id": "m_279",
    "category": "GENERAL TRIVIA",
    "question": "Who was the last ruler of the Ptolemaic Kingdom of Egypt?",
    "options": [
      "Cleopatra VII",
      "Arsinoe II",
      "Nefertiti",
      "Hatshepsut"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Cleopatra VII"
  },
  {
    "id": "m_280",
    "category": "GENERAL TRIVIA",
    "question": "Which empire built Machu Picchu?",
    "options": [
      "Aztec Empire",
      "Inca Empire",
      "Olmec civilisation",
      "Maya civilisation"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Inca Empire"
  },
  {
    "id": "m_281",
    "category": "GENERAL TRIVIA",
    "question": "Who was the first Secretary-General of the United Nations?",
    "options": [
      "Trygve Lie",
      "U Thant",
      "Kurt Waldheim",
      "Dag Hammarskj\u00f6ld"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Trygve Lie"
  },
  {
    "id": "m_282",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the most natural lakes in the world?",
    "options": [
      "Canada",
      "Finland",
      "Russia",
      "United States"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Canada"
  },
  {
    "id": "m_283",
    "category": "GENERAL TRIVIA",
    "question": "Which African country was historically known as Abyssinia?",
    "options": [
      "sudan",
      "somalia",
      "eritrea",
      "Ethiopia"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Ethiopia"
  },
  {
    "id": "m_284",
    "category": "GENERAL TRIVIA",
    "question": "Which sea has no land coastline and is defined by ocean currents?",
    "options": [
      "Sargasso Sea",
      "Coral Sea",
      "Caribbean Sea",
      "Arabian Sea"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Sargasso Sea"
  },
  {
    "id": "m_285",
    "category": "GENERAL TRIVIA",
    "question": "Who wrote The Discovery of India?",
    "options": [
      "Rabindranath Tagore",
      "B. R. Ambedkar",
      "Mahatma Gandhi",
      "Jawaharlal Nehru"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Jawaharlal Nehru"
  },
  {
    "id": "m_286",
    "category": "GENERAL TRIVIA",
    "question": "Which Indian mathematician is associated with the number 1729, known as the Hardy\u2013Ramanujan number?",
    "options": [
      "Brahmagupta",
      "Srinivasa Ramanujan",
      "Aryabhata",
      "Bhaskara II"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Srinivasa Ramanujan"
  },
  {
    "id": "m_287",
    "category": "GENERAL TRIVIA",
    "question": "Which schedule of the Indian Constitution lists the officially recognised languages?",
    "options": [
      "Eighth Schedule",
      "Tenth Schedule",
      "seventh schedule",
      "Sixth Schedule"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Eighth Schedule"
  },
  {
    "id": "m_288",
    "category": "GENERAL TRIVIA",
    "question": "Who wrote The Brothers Karamazov?",
    "options": [
      "Fyodor Dostoevsky",
      "Leo Tolstoy",
      "Anton Chekhov",
      "Ivan Turgenev"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Fyodor Dostoevsky"
  },
  {
    "id": "m_289",
    "category": "GENERAL TRIVIA",
    "question": "Who painted The Persistence of Memory, famous for its melting clocks?",
    "options": [
      "Ren\u00e9 Magritte",
      "Pablo Picasso",
      "Claude Monet",
      "Salvador Dal\u00ed"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Salvador Dal\u00ed"
  },
  {
    "id": "m_290",
    "category": "GENERAL TRIVIA",
    "question": "Which composer continued composing major works after becoming profoundly deaf?",
    "options": [
      "Ludwig van Beethoven",
      "Fr\u00e9d\u00e9ric Chopin",
      "Johann Sebastian Bach",
      "Wolfgang Amadeus Mozart"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Ludwig van Beethoven"
  },
  {
    "id": "m_291",
    "category": "GENERAL TRIVIA",
    "question": "Which moon in our solar system has a dense atmosphere and lakes of liquid methane and ethane?",
    "options": [
      "Europa",
      "Ganymede",
      "Titan",
      "Triton"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Titan"
  },
  {
    "id": "m_292",
    "category": "GENERAL TRIVIA",
    "question": "What is the name of the boundary separating Earth's crust from its mantle?",
    "options": [
      "Conrad discontinuity",
      "Mohorovi\u010di\u0107 discontinuity",
      "Lehmann discontinuity",
      "Gutenberg discontinuity"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Mohorovi\u010di\u0107 discontinuity"
  },
  {
    "id": "m_293",
    "category": "GENERAL TRIVIA",
    "question": "Which enzyme unwinds the DNA double helix during DNA replication?",
    "options": [
      "ligase",
      "helicase",
      "amylase",
      "primase"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: helicase"
  },
  {
    "id": "m_294",
    "category": "GENERAL TRIVIA",
    "question": "Which programming language was originally developed by Guido van Rossum?",
    "options": [
      "java",
      "ruby",
      "python",
      "swift"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: python"
  },
  {
    "id": "m_295",
    "category": "GENERAL TRIVIA",
    "question": "Which ancient Greek historian is commonly called the \u201cFather of History\u201d?",
    "options": [
      "Xenophon",
      ") Plutarch",
      "Thucydides",
      "Herodotus"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Herodotus"
  },
  {
    "id": "m_296",
    "category": "GENERAL TRIVIA",
    "question": "Which agreement established the European Economic Community in 1957?",
    "options": [
      "Treaty of Rome",
      "Treaty of Lisbon",
      "Treaty of Amsterdam",
      "Treaty of Maastricht"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Treaty of Rome"
  },
  {
    "id": "m_297",
    "category": "GENERAL TRIVIA",
    "question": "Who was the first emperor of a unified China?",
    "options": [
      "Qin Shi Huang",
      "Sun Yat-sen",
      "Han Wudi",
      "Kublai Khan"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Qin Shi Huang"
  },
  {
    "id": "m_298",
    "category": "GENERAL TRIVIA",
    "question": "Which civilisation built the ancient city of Petra?",
    "options": [
      "Assyrians",
      "Phoenicians",
      "Nabataeans",
      "Minoans"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Nabataeans"
  },
  {
    "id": "m_299",
    "category": "GENERAL TRIVIA",
    "question": "The Rosetta Stone helped scholars decipher which ancient writing system?",
    "options": [
      "Linear B",
      "Egyptian hieroglyphs",
      "Sanskrit",
      "Cuneiform"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Egyptian hieroglyphs"
  },
  {
    "id": "m_300",
    "category": "GENERAL TRIVIA",
    "question": "Which country is completely surrounded by South Africa?",
    "options": [
      "Botswana",
      "Namibia",
      "Lesotho",
      "Eswatini"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Lesotho"
  },
  {
    "id": "m_301",
    "category": "GENERAL TRIVIA",
    "question": "What is the world's highest uninterrupted waterfall?",
    "options": [
      "Angel Falls",
      "Victoria Falls",
      "Niagara Falls",
      "Iguazu Falls"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Angel Falls"
  },
  {
    "id": "m_302",
    "category": "GENERAL TRIVIA",
    "question": "Which mountain range traditionally marks part of the boundary between Europe and Asia",
    "options": [
      "Carpathians",
      "Pyrenees",
      "Alps",
      "Ural Mountains"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Ural Mountains"
  },
  {
    "id": "m_303",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the exclave of Kaliningrad on the Baltic Sea?",
    "options": [
      "Lithuania",
      "Poland",
      "Russia",
      "Belarus"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Russia"
  },
  {
    "id": "m_304",
    "category": "GENERAL TRIVIA",
    "question": "What is the deepest freshwater lake in the world?",
    "options": [
      "Lake Baikal",
      "Lake Superior",
      "Lake Tanganyika",
      "Lake Victoria"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Lake Baikal"
  },
  {
    "id": "m_305",
    "category": "GENERAL TRIVIA",
    "question": "Who was the first Indian woman to become president of the Indian National Congress?",
    "options": [
      "Sarojini Naidu",
      "Sucheta Kripalani",
      "Annie Besant",
      "Vijayalakshmi Pandit"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Sarojini Naidu"
  },
  {
    "id": "m_306",
    "category": "GENERAL TRIVIA",
    "question": "Which Harappan site is famous for its ancient dockyard?",
    "options": [
      "Dholavira",
      "Lothal",
      "Rakhigarhi",
      "Kalibangan"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Lothal"
  },
  {
    "id": "m_307",
    "category": "GENERAL TRIVIA",
    "question": "Which Indian classical dance form originated in Kerala and is known for elaborate makeup and facial expressions?",
    "options": [
      "Odissi",
      "Kathak",
      "Kathakali",
      "Manipuri"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Kathakali"
  },
  {
    "id": "m_308",
    "category": "GENERAL TRIVIA",
    "question": "Who was the first Indian to receive a Nobel Prize?",
    "options": [
      "Amartya Sen",
      "Mother teresa",
      "C. V. Raman",
      "Rabindranath Tagore"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Rabindranath Tagore"
  },
  {
    "id": "m_309",
    "category": "GENERAL TRIVIA",
    "question": "Who wrote the novel One Hundred Years of Solitude?",
    "options": [
      "Mario Vargas Llosa",
      "Gabriel Garc\u00eda M\u00e1rquez",
      "Jorge Luis Borges",
      "Pablo Neruda"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Gabriel Garc\u00eda M\u00e1rquez"
  },
  {
    "id": "m_310",
    "category": "GENERAL TRIVIA",
    "question": "In chess, which player is credited with popularising the \u201cImmortal Game\u201d of 1851?",
    "options": [
      "Paul Morphy",
      "Wilhelm Steinitz",
      "Adolf Anderssen",
      "Emanuel Lasker"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Adolf Anderssen"
  },
  {
    "id": "m_311",
    "category": "GENERAL TRIVIA",
    "question": "Which country has its national animal as the unicorn?",
    "options": [
      "Norway",
      "Wales",
      "Scotland",
      "Ireland"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Scotland"
  },
  {
    "id": "m_312",
    "category": "GENERAL TRIVIA",
    "question": "Whch is the only country with a non-rectangluar flag?",
    "options": [
      "Mozambique",
      "Bhutan",
      "Malta",
      "Nepal"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Nepal"
  },
  {
    "id": "m_313",
    "category": "GENERAL TRIVIA",
    "question": "Which protein does octopus blood get its colour from?",
    "options": [
      "Haemoglobin",
      "Hemerythrin",
      "Chlorocruorin",
      "Hemocyanin"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Hemocyanin"
  },
  {
    "id": "m_314",
    "category": "GENERAL TRIVIA",
    "question": "Which organism among these produces true blue pigment?",
    "options": [
      "Blue Jay",
      "Obrina Olivewing Butterfly",
      "Peacock",
      "Ultramine flycatcher (bird)"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Obrina Olivewing Butterfly"
  },
  {
    "id": "m_315",
    "category": "GENERAL TRIVIA",
    "question": "Which of Henry VIII's wives gave one of europe's most influential queens--Queen Elizabeth the first?",
    "options": [
      "Marie louise-victorire",
      "Catherine of Aragon",
      "Marie Antoinette",
      "Anne Boleyn"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Anne Boleyn"
  },
  {
    "id": "m_316",
    "category": "GENERAL TRIVIA",
    "question": "Which famous historical woman was executed on the orders of her first cousin- Queen Mary Tudor?",
    "options": [
      "Mary, Queen of scotts",
      "Lady Jane Grey",
      "Lady Arabella Stuart",
      "Catherine de Medici"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Mary, Queen of scotts"
  },
  {
    "id": "m_317",
    "category": "GENERAL TRIVIA",
    "question": "Who is the painter of \"The Starry Night\"",
    "options": [
      "Frida Kahlo",
      "Pablo Picasso",
      "Leonardo Da Vinci",
      "Vincent Van Gogh"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Vincent Van Gogh"
  },
  {
    "id": "m_318",
    "category": "GENERAL TRIVIA",
    "question": "Who painted the famous Sistine chapel ceiling and sculpted David",
    "options": [
      "Michaelangelo",
      "Donatello",
      "Louise Bourgeois",
      "Claude Monet"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Michaelangelo"
  },
  {
    "id": "m_319",
    "category": "GENERAL TRIVIA",
    "question": "Which of the Great Lake houses the largest lake island in the world?",
    "options": [
      "Lake Superior",
      "Lake Michigan",
      "Lake Ontario",
      "Lake Huron"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Lake Huron"
  },
  {
    "id": "m_320",
    "category": "GENERAL TRIVIA",
    "question": "Which Ocean contains the infamous Drake Passage, known have sunk close to 800 ships?",
    "options": [
      "Southern Ocean",
      "Pacific",
      "Arctic",
      "Atlantic"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Southern Ocean"
  },
  {
    "id": "m_321",
    "category": "GENERAL TRIVIA",
    "question": "Which performer holds the record for winning the most competitive acting Academy Awards (Oscars) in history, with a total of four wins?",
    "options": [
      "Jack Nicholson",
      "Katharine Hepburn",
      "Daniel Day-Lewis",
      "Meryl Streep"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Katharine Hepburn"
  },
  {
    "id": "m_322",
    "category": "GENERAL TRIVIA",
    "question": "Which singer's real name is Stefani Joanne Angelina Germanotta?",
    "options": [
      "Madonna",
      "SZA",
      "Lady Gaga",
      "Sia"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Lady Gaga"
  },
  {
    "id": "m_323",
    "category": "GENERAL TRIVIA",
    "question": "Which figure of speech is used to imitate or suggest the sound it describes?",
    "options": [
      "Imagery",
      "Alliteration",
      "onomatopoeia",
      "Anaphora"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: onomatopoeia"
  },
  {
    "id": "m_324",
    "category": "GENERAL TRIVIA",
    "question": "Who is the author of the famous poem \"Daffodils\"",
    "options": [
      "John Milton",
      "Charles Dickens",
      "Daniel Defoe",
      "William Wordsworth"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: William Wordsworth"
  },
  {
    "id": "m_325",
    "category": "GENERAL TRIVIA",
    "question": "Which large, fluffy, friendly forest spirit became the iconic mascot and logo for the legendary Studio Ghibli?",
    "options": [
      "Snorlax",
      "Stitch",
      "Pikachu",
      "Totoro"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Totoro"
  },
  {
    "id": "m_326",
    "category": "GENERAL TRIVIA",
    "question": "Which gemstone is unique because it displays an iridescent flash of colors ,making it look like a galaxy or a rainbow trapped inside a rock?",
    "options": [
      "Amethyst",
      "Opal",
      "Alexandrite",
      "Turquoise"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Opal"
  },
  {
    "id": "m_327",
    "category": "GENERAL TRIVIA",
    "question": "What is the closest star system to our solar system",
    "options": [
      "Alpha centauri",
      "Luhman 16",
      "Sirius",
      "Barnard's star"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Alpha centauri"
  },
  {
    "id": "m_328",
    "category": "GENERAL TRIVIA",
    "question": "What unusual color are sunsets when viewed from the surface of Mars?",
    "options": [
      "Pink",
      "Crimson red",
      "Blue",
      "Green"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Blue"
  },
  {
    "id": "m_329",
    "category": "GENERAL TRIVIA",
    "question": "Which historic crewed mission achieved humanity's first landing on the lunar surface?",
    "options": [
      "Apollo 12",
      "Apollo 8",
      "Apollo 10",
      "Apollo 11"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Apollo 11"
  },
  {
    "id": "m_330",
    "category": "GENERAL TRIVIA",
    "question": "What corrosive chemical compound forms the principal, persistent cloud decks blanketing Venus?",
    "options": [
      "Ammonia",
      "Sulphuric Acid",
      "Water",
      "Methane"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Sulphuric Acid"
  },
  {
    "id": "m_331",
    "category": "GENERAL TRIVIA",
    "question": "What was the name of the event that occured in 1859, which featured the most intense geomagmagnetic storm ever recorded in history",
    "options": [
      "Carrington event",
      "Tunguska event",
      "The Maunder minimum",
      "Halley disruption"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Carrington event"
  },
  {
    "id": "m_332",
    "category": "GENERAL TRIVIA",
    "question": "In the anime, One Piece  what is the name of King of pirates?",
    "options": [
      "Rocks D xebek",
      "Gol D Rogers",
      "Monkey D Luffy",
      "White Beard"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Gol D Rogers"
  },
  {
    "id": "m_333",
    "category": "GENERAL TRIVIA",
    "question": "Grigori Perelman solved which on of the seven millenial problems and refused to claim te milleniium prize",
    "options": [
      "Hodge conjecture",
      "Poincara conjecture",
      "Navier Stoke's Equation",
      "Birch and Swinnerton-Dyer Conjecture"
    ],
    "correctIndex": 1,
    "explanation": "Correct Answer: Poincara conjecture"
  },
  {
    "id": "m_334",
    "category": "GENERAL TRIVIA",
    "question": "what was the name of the planet that is theorized to have crashed with earth millions of years ago, leading to the creation of the moon?",
    "options": [
      "Ceres",
      "Phaeton",
      "Vulcan",
      "Theia"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Theia"
  },
  {
    "id": "m_335",
    "category": "GENERAL TRIVIA",
    "question": "The famous quote-\" My battery is low, and it's getting dark\", is associated with which of NASA's rovers?",
    "options": [
      "Oppurtunity",
      "Perseverance",
      "Spirit",
      "Curiosity"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Oppurtunity"
  },
  {
    "id": "m_336",
    "category": "GENERAL TRIVIA",
    "question": "Where on a crab are its taste buds?",
    "options": [
      "Toes",
      "Gills",
      "Claws",
      "Antennae"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Toes"
  },
  {
    "id": "m_337",
    "category": "GENERAL TRIVIA",
    "question": "Which is the most abundant Organic compound on Earth",
    "options": [
      "Cellulose",
      "Glycogen",
      "Starch",
      "Methane"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Cellulose"
  },
  {
    "id": "m_338",
    "category": "GENERAL TRIVIA",
    "question": "Which country developed the world's first jet powered fighter plane",
    "options": [
      "USA",
      "USSR",
      "Britain",
      "Germany"
    ],
    "correctIndex": 3,
    "explanation": "Correct Answer: Germany"
  },
  {
    "id": "m_339",
    "category": "GENERAL TRIVIA",
    "question": "Which country has the longest border with France?",
    "options": [
      "Brazil",
      "Spain",
      "Algeria",
      "Germany"
    ],
    "correctIndex": 0,
    "explanation": "Correct Answer: Brazil"
  },
  {
    "id": "m_340",
    "category": "GENERAL TRIVIA",
    "question": "Who is the Roman equivalent of Hera?",
    "options": [
      "Ceres",
      "Venus",
      "Juno",
      "Vesta"
    ],
    "correctIndex": 2,
    "explanation": "Correct Answer: Juno"
  }
];
