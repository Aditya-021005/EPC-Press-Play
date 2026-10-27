export interface TuneItem {
  id: string;
  song: string;
  artist: string;
  year: number;
  genre: string;
  lyricsLines: string[];
  options: string[]; // 4 options formatted as "Song - Artist"
  melodyNotes: number[]; // Frequencies in Hz for Web Audio playback
}

export const TUNES_POOL: TuneItem[] = [
  {
    id: "t1",
    song: "Bohemian Rhapsody",
    artist: "Queen",
    year: 1975,
    genre: "Classic Rock",
    lyricsLines: [
      "Is this the real life? Is this just fantasy?",
      "Caught in a landslide, no escape from reality",
      "Open your eyes, look up to the skies and see..."
    ],
    options: [
      "Bohemian Rhapsody - Queen",
      "Stairway to Heaven - Led Zeppelin",
      "Hotel California - Eagles",
      "Sweet Child O' Mine - Guns N' Roses"
    ],
    // F - G - A - Bb melody
    melodyNotes: [349.23, 392.00, 440.00, 466.16, 440.00, 392.00, 349.23]
  },
  {
    id: "t2",
    song: "Billie Jean",
    artist: "Michael Jackson",
    year: 1982,
    genre: "Pop / Funk",
    lyricsLines: [
      "She was more like a beauty queen from a movie scene",
      "I said don't mind, but what do you mean, I am the one...",
      "People always told me, be careful of what you do"
    ],
    options: [
      "Billie Jean - Michael Jackson",
      "Super Freak - Rick James",
      "Beat It - Michael Jackson",
      "Stayin' Alive - Bee Gees"
    ],
    // Iconic F# bassline
    melodyNotes: [370, 293.66, 329.63, 370, 329.63, 293.66, 246.94]
  },
  {
    id: "t3",
    song: "Never Gonna Give You Up",
    artist: "Rick Astley",
    year: 1987,
    genre: "Dance Pop",
    lyricsLines: [
      "We're no strangers to love, you know the rules and so do I",
      "A full commitment's what I'm thinking of...",
      "Never gonna give you up, never gonna let you down"
    ],
    options: [
      "Never Gonna Give You Up - Rick Astley",
      "Together Forever - Rick Astley",
      "Take On Me - a-ha",
      "Wake Me Up Before You Go-Go - Wham!"
    ],
    // Iconic synth riff: G - A - C - A - E - E - D
    melodyNotes: [392, 440, 523.25, 440, 659.25, 659.25, 587.33]
  },
  {
    id: "t4",
    song: "Lose Yourself",
    artist: "Eminem",
    year: 2002,
    genre: "Hip-Hop",
    lyricsLines: [
      "Look, if you had one shot or one opportunity...",
      "His palms are sweaty, knees weak, arms are heavy",
      "There's vomit on his sweater already, mom's spaghetti"
    ],
    options: [
      "Lose Yourself - Eminem",
      "In Da Club - 50 Cent",
      "Empire State of Mind - Jay-Z",
      "Without Me - Eminem"
    ],
    melodyNotes: [293.66, 293.66, 311.13, 293.66, 261.63, 293.66]
  },
  {
    id: "t5",
    song: "Rolling in the Deep",
    artist: "Adele",
    year: 2010,
    genre: "Soul / Pop",
    lyricsLines: [
      "There's a fire starting in my heart",
      "Reaching a fever pitch and it's bringing me out the dark",
      "The scars of your love remind me of us"
    ],
    options: [
      "Rolling in the Deep - Adele",
      "Someone Like You - Adele",
      "Set Fire to the Rain - Adele",
      "Grenade - Bruno Mars"
    ],
    melodyNotes: [440, 440, 392, 440, 523.25, 440, 392]
  },
  {
    id: "t6",
    song: "Livin' on a Prayer",
    artist: "Bon Jovi",
    year: 1986,
    genre: "Arena Rock",
    lyricsLines: [
      "Tommy used to work on the docks, union's been on strike",
      "Gina works the diner all day working for her man",
      "We've got to hold on to what we've got, it doesn't make a difference if we make it or not"
    ],
    options: [
      "Livin' on a Prayer - Bon Jovi",
      "Don't Stop Believin' - Journey",
      "You Give Love a Bad Name - Bon Jovi",
      "Eye of the Tiger - Survivor"
    ],
    melodyNotes: [329.63, 329.63, 392, 440, 493.88, 440, 392, 329.63]
  },
  {
    id: "t7",
    song: "Bad Guy",
    artist: "Billie Eilish",
    year: 2019,
    genre: "Alt Pop",
    lyricsLines: [
      "White shirt now red, my bloody nose",
      "Sleepin', you're on your tippy toes",
      "Creepin' around like no one knows, think you're so criminal"
    ],
    options: [
      "Bad Guy - Billie Eilish",
      "Therefore I Am - Billie Eilish",
      "Bury a Friend - Billie Eilish",
      "Levitating - Dua Lipa"
    ],
    // Catchy synth bass hook: G - G - Bb - C - G
    melodyNotes: [392, 392, 466.16, 523.25, 392, 466.16, 392]
  },
  {
    id: "t8",
    song: "Viva La Vida",
    artist: "Coldplay",
    year: 2008,
    genre: "Alt Rock",
    lyricsLines: [
      "I used to rule the world, seas would rise when I gave the word",
      "Now in the morning I sleep alone, sweep the streets I used to own",
      "I hear Jerusalem bells a-ringing, Roman Cavalry choirs are singing"
    ],
    options: [
      "Viva La Vida - Coldplay",
      "Yellow - Coldplay",
      "Clocks - Coldplay",
      "Radioactive - Imagine Dragons"
    ],
    // Iconic orchestral string chords: C# - D# - G#
    melodyNotes: [554.37, 622.25, 830.61, 739.99, 659.25, 554.37]
  },
  {
    id: "t9",
    song: "Shape of You",
    artist: "Ed Sheeran",
    year: 2017,
    genre: "Pop",
    lyricsLines: [
      "The club isn't the best place to find a lover, so the bar is where I go",
      "Me and my friends at the table doing shots, drinking fast and then we talk slow",
      "Girl, you know I want your love, your love was handmade for somebody like me"
    ],
    options: [
      "Shape of You - Ed Sheeran",
      "Castle on the Hill - Ed Sheeran",
      "Blinding Lights - The Weeknd",
      "Uptown Funk - Mark Ronson ft. Bruno Mars"
    ],
    // Marimba plucked motif: C# - E - C# - C# - F# - E
    melodyNotes: [554.37, 659.25, 554.37, 554.37, 739.99, 659.25]
  },
  {
    id: "t10",
    song: "Hotel California",
    artist: "Eagles",
    year: 1976,
    genre: "Rock",
    lyricsLines: [
      "On a dark desert highway, cool wind in my hair",
      "Warm smell of colitas, rising up through the air",
      "Up ahead in the distance, I saw a shimmering light"
    ],
    options: [
      "Hotel California - Eagles",
      "Take It Easy - Eagles",
      "Free Fallin' - Tom Petty",
      "Sultans of Swing - Dire Straits"
    ],
    melodyNotes: [440, 493.88, 523.25, 587.33, 493.88, 440]
  }
];
