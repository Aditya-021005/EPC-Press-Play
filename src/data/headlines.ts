export interface HeadlineItem {
  id: string;
  headline: string;
  isReal: boolean;
  outletHint: string;
  explanation: string;
  source: string;
}

export const HEADLINES_POOL: HeadlineItem[] = [
  {
    id: "h1",
    headline: "Swedish city dumps one ton of chicken manure in central park to stop festival party crowds",
    isReal: true,
    outletHint: "BBC News • Lund, Sweden",
    explanation: "In 2020, officials in Lund dumped smelly chicken manure in the park to deter 30,000 students from gathering for Walpurgis Night festivities during lockdowns.",
    source: "BBC News / The Guardian"
  },
  {
    id: "h2",
    headline: "NASA astronauts successfully brew first batch of espresso in zero gravity using space tomatoes",
    isReal: false,
    outletHint: "Cosmos Weekly",
    explanation: "While NASA did send an 'ISSpresso' machine to space in 2015, they definitely did not brew coffee using tomatoes!",
    source: "Fabricated"
  },
  {
    id: "h3",
    headline: "Pigeon detained by police in India under suspicion of espionage released after 8-month investigation",
    isReal: true,
    outletHint: "Associated Press • Mumbai",
    explanation: "A suspected Pakistani spy pigeon captured near a port in Mumbai was cleared and released into the wild after police confirmed it was just an open-water racing bird from Taiwan.",
    source: "Associated Press"
  },
  {
    id: "h4",
    headline: "Man calls 911 to complain about tiny portion size of his takeout fried rice",
    isReal: true,
    outletHint: "ABC News • Ohio, USA",
    explanation: "An Ohio man was charged with improper use of emergency services after calling 911 because he was dissatisfied with the food portions from a local Chinese restaurant.",
    source: "ABC News"
  },
  {
    id: "h5",
    headline: "French parliament legally reclassifies baguettes as emotional support items for commuters",
    isReal: false,
    outletHint: "Le Figaro Satire",
    explanation: "Baguettes were placed on UNESCO's intangible cultural heritage list, but they are not legally recognized as emotional therapy tools.",
    source: "Fabricated"
  },
  {
    id: "h6",
    headline: "Chess grandmaster loses exhibition match after chess-playing robot arm snatches and breaks his finger",
    isReal: true,
    outletHint: "The Guardian • Moscow",
    explanation: "During the Moscow Chess Open in 2022, an AI robot arm mistook a 7-year-old opponent's rapid finger movement for a chess piece and grabbed it, fracturing his finger.",
    source: "The Guardian"
  },
  {
    id: "h7",
    headline: "Bank robber hands teller demand note written on the back of his own personal employment paycheck",
    isReal: true,
    outletHint: "Fox News • Pennsylvania",
    explanation: "Police quickly arrested the robber after finding his full legal name, home address, and employer printed directly on the demand note he handed to the cashier.",
    source: "Fox News / CBS"
  },
  {
    id: "h8",
    headline: "Tesla announces software update enabling Cybertrucks to float autonomously as deep-sea submarines",
    isReal: false,
    outletHint: "Tech Drive Gazette",
    explanation: "Elon Musk tweeted that Cybertruck could 'briefly serve as a boat', but autonomous deep-sea submarine navigation remains purely science fiction.",
    source: "Fabricated"
  },
  {
    id: "h9",
    headline: "Town in Japan installs robotic monster wolves with red flashing eyes to scare wild bears away from neighborhoods",
    isReal: true,
    outletHint: "Reuters • Takikawa, Japan",
    explanation: "Takikawa town deployed solar-powered 'Monster Wolves' featuring motorized heads, flashing LED eyes, and 60 different howling sounds to deter foraging bears.",
    source: "Reuters"
  },
  {
    id: "h10",
    headline: "Florida man attempts to pay for McDonald's drive-thru order with large bag of marijuana",
    isReal: true,
    outletHint: "Tampa Bay Times • Florida",
    explanation: "A 23-year-old Florida man was arrested after McDonald's drive-thru employees rejected his offer to trade marijuana for fast food burgers and called the sheriff.",
    source: "Tampa Bay Times"
  },
  {
    id: "h11",
    headline: "Archaeologists unearth 2,000-year-old Roman tomb containing functional copper battery powering an LED",
    isReal: false,
    outletHint: "History Today Mysteries",
    explanation: "While the ancient Baghdad Battery existed in antiquity, LEDs weren't invented until the 20th century and no ancient battery is powering modern diodes!",
    source: "Fabricated"
  },
  {
    id: "h12",
    headline: "Man fakes his own kidnapping and hides in garage for two days to avoid paying for girlfriend's wedding",
    isReal: true,
    outletHint: "Sky News • Colombia",
    explanation: "A 55-year-old man in Colombia staged his own violent abduction with friend accomplices hours before his wedding ceremony because he got cold feet and lacked funds.",
    source: "Sky News"
  },
  {
    id: "h13",
    headline: "Police deploy riot squad after dispute over pineapple on pizza escalates into street brawl outside Italian restaurant",
    isReal: false,
    outletHint: "Naples Morning Gazette",
    explanation: "Italians may hate Hawaiian pizza with a passion, but no Italian city has ever deployed riot police with water cannons over pineapple toppings.",
    source: "Fabricated"
  },
  {
    id: "h14",
    headline: "Airline passengers vote unanimously mid-flight to eject man refusing to put away bag of durian fruit",
    isReal: false,
    outletHint: "Aviation Daily",
    explanation: "Planes have made emergency diversions due to durian odor, but federal aviation safety regulations strictly prohibit passenger mob ejections!",
    source: "Fabricated"
  },
  {
    id: "h15",
    headline: "Escaped zoo flamingo spotted living happily with wild flock in Texas 17 years after breaking out",
    isReal: true,
    outletHint: "National Geographic • Texas Gulf",
    explanation: "Flamingo No. 492 escaped a Wichita, Kansas zoo during a 2005 storm and was photographed thriving alongside local coastal wildlife in Texas almost two decades later.",
    source: "National Geographic"
  },
  {
    id: "h16",
    headline: "Man breaks into restaurant, cooks himself a full gourmet three-course meal, does the dishes, and leaves cash on counter",
    isReal: true,
    outletHint: "NPR • North Carolina",
    explanation: "Surveillance footage showed the polite burglar making cheese burgers, pouring himself a beverage, wiping down the grill, and leaving $20 on the register.",
    source: "NPR / Police Blotter"
  }
];
