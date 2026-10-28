export interface TuneItem {
  id: string;
  song: string;
  artist: string;
  year: number;
  genre: string;
  lyric: string; // Exactly one lyric line provided to participants
}

export const TUNES_POOL: TuneItem[] = [
  {
    id: "t1",
    song: "Bohemian Rhapsody",
    artist: "Queen",
    year: 1975,
    genre: "Classic Rock",
    lyric: "Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality."
  },
  {
    id: "t2",
    song: "Billie Jean",
    artist: "Michael Jackson",
    year: 1982,
    genre: "Pop / Funk",
    lyric: "She was more like a beauty queen from a movie scene, I said don't mind, but what do you mean I am the one."
  },
  {
    id: "t3",
    song: "Never Gonna Give You Up",
    artist: "Rick Astley",
    year: 1987,
    genre: "Dance Pop",
    lyric: "We're no strangers to love, you know the rules and so do I, a full commitment's what I'm thinking of."
  },
  {
    id: "t4",
    song: "Lose Yourself",
    artist: "Eminem",
    year: 2002,
    genre: "Hip-Hop",
    lyric: "His palms are sweaty, knees weak, arms are heavy, there's vomit on his sweater already, mom's spaghetti."
  },
  {
    id: "t5",
    song: "Rolling in the Deep",
    artist: "Adele",
    year: 2010,
    genre: "Soul / Pop",
    lyric: "There's a fire starting in my heart, reaching a fever pitch and it's bringing me out the dark."
  },
  {
    id: "t6",
    song: "Livin' on a Prayer",
    artist: "Bon Jovi",
    year: 1986,
    genre: "Arena Rock",
    lyric: "Tommy used to work on the docks, union's been on strike, he's down on his luck, it's tough, so tough."
  },
  {
    id: "t7",
    song: "Bad Guy",
    artist: "Billie Eilish",
    year: 2019,
    genre: "Alt Pop",
    lyric: "White shirt now red, my bloody nose, sleepin', you're on your tippy toes, creepin' around like no one knows."
  },
  {
    id: "t8",
    song: "Viva La Vida",
    artist: "Coldplay",
    year: 2008,
    genre: "Alt Rock",
    lyric: "I used to rule the world, seas would rise when I gave the word, now in the morning I sleep alone."
  },
  {
    id: "t9",
    song: "Shape of You",
    artist: "Ed Sheeran",
    year: 2017,
    genre: "Pop",
    lyric: "The club isn't the best place to find a lover, so the bar is where I go, me and my friends at the table doing shots."
  },
  {
    id: "t10",
    song: "Hotel California",
    artist: "Eagles",
    year: 1976,
    genre: "Rock",
    lyric: "On a dark desert highway, cool wind in my hair, warm smell of colitas rising up through the air."
  },
  {
    id: "t11",
    song: "Smells Like Teen Spirit",
    artist: "Nirvana",
    year: 1991,
    genre: "Grunge / Rock",
    lyric: "Load up on guns, bring your friends, it's fun to lose and to pretend, she's over-bored and self-assured."
  },
  {
    id: "t12",
    song: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    year: 1987,
    genre: "Hard Rock",
    lyric: "She's got a smile that it seems to me reminds me of childhood memories, where everything was as fresh as the bright blue sky."
  },
  {
    id: "t13",
    song: "Blinding Lights",
    artist: "The Weeknd",
    year: 2020,
    genre: "Synthwave / Pop",
    lyric: "I look around and Sin City's cold and empty, no one's around to judge me, I can't see clearly when you're gone."
  },
  {
    id: "t14",
    song: "Wonderwall",
    artist: "Oasis",
    year: 1995,
    genre: "Britpop",
    lyric: "Today is gonna be the day that they're gonna throw it back to you, by now you should've somehow realized what you gotta do."
  },
  {
    id: "t15",
    song: "Counting Stars",
    artist: "OneRepublic",
    year: 2013,
    genre: "Pop Rock",
    lyric: "Lately, I've been, I've been losing sleep, dreaming about the things that we could be, but baby, I've been praying hard."
  }
];
