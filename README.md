# 🕹️ PRESS PLAY: THE GAME ROOM

An electrifying, broadcast-grade 6-game tournament arena built with **Next.js (App Router)**, **TypeScript**, **Vanilla CSS**, and a **lightweight persistent REST API backend**.

> **Tournament Format**: 6 Games • 100 Points Each • **Max Points: 600**  
> Features 5 interactive digital showdowns + 1 live physical stage scorekeeper.

---

## 🚀 Live Local Dev Server
The development server is running locally:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Simple Backend API (Deploy & Host Anywhere)

This application includes a self-contained, file-backed backend that requires **no external database** setup and can be hosted anywhere (Vercel, Railway, Render, Fly.io, Heroku, Docker, VPS, or locally).

### API Endpoints
* **`GET /api/tournament`**: Returns the active team, all team scores, and tournament version.
* **`POST /api/tournament`**:
  * `{ "action": "updateScore", "teamName": "⚡ Team Alpha", "gameKey": "greenerGrass", "score": 80 }`
  * `{ "action": "setActiveTeam", "teamName": "🔥 Team Bravo" }`
  * `{ "action": "addTeam", "teamName": "⚡ Team Delta" }`
* **`DELETE /api/tournament`**: Resets all scores back to 0.

### Persistence
* Scores and teams are persisted to `data/tournament.json` on disk.
* Automatically falls back to memory / browser storage if running in a read-only serverless environment.
* Features **live multi-screen synchronization**: any score updated by a player or host broadcasts across all screens connected to the server.

---

## 🚢 How to Host Anywhere

### Option 1: One-Click on Vercel
1. Push this folder to a GitHub repository.
2. Import to [Vercel](https://vercel.com) (zero configuration needed).
3. Click **Deploy**.

### Option 2: Render / Railway / Fly.io / Heroku
* A production-ready [`Dockerfile`](file:///Users/anujkumar/Desktop/EPC/Dockerfile) is included:
```bash
docker build -t game-room .
docker run -p 3000:3000 game-room
```

### Option 3: Standard Node.js Server / VPS
```bash
# Install dependencies & build
npm install
npm run build

# Start production server
npm start
```

---

## 🎮 The 6 Games

1. **🌿 Greener Grass (100 PTS)**: Wordle-style push-your-luck. Points are awarded **only for green tiles** (4 pts each). If **any yellow tile** appears, the round halts immediately!
2. **📰 Real Headline or Not (100 PTS)**: 10 rounds of hilarious real-world headlines vs believable fabrications with backstory reveals and source citations.
3. **🎵 Name That Tune (100 PTS)**: 10 tracks with lyrics teleprompter, progressive hints, and a **real-time Web Audio Synthesizer** playing 8-bit melodic themes with an animated equalizer visualizer.
4. **🃏 Categories / Scattergories (100 PTS)**: 5 category cards dealt from a party deck. An interactive 3D letter roulette wheel spins and players race a **60s timer** with auto-check & host audit.
5. **💰 Reverse Who Wants To Be A Millionaire (100 PTS)**: *The Money Drop* format. Split 100/200 coins across 4 trapdoors (A, B, C, D) totaling 100%. Incorrect trapdoors plunge into the abyss; only coins on the safe trapdoor carry forward!
6. **🎪 Live Offline Arena (100 PTS)**: Dedicated host console to enter and audit 0–100 points for physical stage games (Minute-to-Win-It, live relay, charades).
