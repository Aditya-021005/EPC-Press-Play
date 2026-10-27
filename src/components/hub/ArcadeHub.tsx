"use client";

import React from "react";
import { TeamScore } from "@/lib/tournamentState";
import { sound } from "@/lib/audio";
import "@/styles/hub.css";

interface ArcadeHubProps {
  activeTeam: TeamScore;
  allTeams: TeamScore[];
  onSelectGame: (gameId: string) => void;
}

type ScoreKey =
  | "greenerGrass"
  | "realHeadline"
  | "nameThatTune"
  | "categories"
  | "reverseMillionaire"
  | "offlineGame";

interface GameDef {
  id: string;
  key: ScoreKey;
  title: string;
  short: string;
  tag: string;
  accent: string;
  blurb: string;
  facts: string[];
  cta: string;
}

const GAMES: GameDef[] = [
  {
    id: "greener-grass",
    key: "greenerGrass",
    title: "Greener Grass",
    short: "Grass",
    tag: "Wordle twist",
    accent: "var(--c-grass)",
    blurb: "Points only for green tiles. The moment a yellow tile shows up, play stops.",
    facts: ["5 words", "4 pts per green", "Yellow ends the round"],
    cta: "Play Greener Grass",
  },
  {
    id: "headlines",
    key: "realHeadline",
    title: "Real Headline or Not",
    short: "Headlines",
    tag: "Truth vs fiction",
    accent: "var(--c-sun)",
    blurb: "Bizarre, unbelievable headlines. Spot the real-world madness among the fakes.",
    facts: ["10 rounds", "10 pts per correct call", "Source dossier reveal"],
    cta: "Play Headlines",
  },
  {
    id: "name-tune",
    key: "nameThatTune",
    title: "Name That Tune",
    short: "Tune",
    tag: "Audio sleuth",
    accent: "var(--c-sky)",
    blurb: "Name the song and artist from lyric snippets. Fewer hints means more points.",
    facts: ["10 songs", "Synth melody previews", "Hint ladder"],
    cta: "Play Name That Tune",
  },
  {
    id: "categories",
    key: "categories",
    title: "Categories",
    short: "Categories",
    tag: "Scattergories",
    accent: "var(--c-grape)",
    blurb: "Draw a category, spin for a letter, and beat the 60-second clock.",
    facts: ["Letter roulette", "60s clock", "Auto-check answers"],
    cta: "Play Categories",
  },
  {
    id: "reverse-millionaire",
    key: "reverseMillionaire",
    title: "Reverse Millionaire",
    short: "Millionaire",
    tag: "Trapdoor heist",
    accent: "var(--c-coin)",
    blurb: "Split your coins across 4 trapdoors. Wrong doors drop; safe coins carry on.",
    facts: ["100 or 200 coins", "Coin splitting", "5 or 10 puzzles"],
    cta: "Play Reverse Millionaire",
  },
  {
    id: "offline",
    key: "offlineGame",
    title: "Live Offline Stage",
    short: "Live",
    tag: "In the room",
    accent: "var(--c-cherry)",
    blurb: "A physical activity hosted live. The host records points here.",
    facts: ["Physical stage", "Host scorekeeper", "0–100 pts"],
    cta: "Open scorekeeper",
  },
];

const MAX_PER_GAME = 100;
const MAX_TOTAL = MAX_PER_GAME * GAMES.length;

function PointsBar({ team, size }: { team: TeamScore; size?: "lg" | "sm" }) {
  return (
    <div
      className={`points-bar${size ? ` points-bar--${size}` : ""}`}
      role="img"
      aria-label={`${team.total} of ${MAX_TOTAL} points`}
    >
      {GAMES.map((g) => {
        const pct = Math.min(100, Math.max(0, (team[g.key] / MAX_PER_GAME) * 100));
        return (
          <span key={g.id} className="points-bar__seg">
            <span
              className="points-bar__fill"
              style={{ "--accent": g.accent, width: `${pct}%` } as React.CSSProperties}
            />
          </span>
        );
      })}
    </div>
  );
}

export default function ArcadeHub({ activeTeam, allTeams, onSelectGame }: ArcadeHubProps) {
  const rankedTeams = [...allTeams].sort((a, b) => b.total - a.total);
  const activeRank = rankedTeams.findIndex((t) => t.name === activeTeam.name) + 1;
  const gamesPlayed = GAMES.filter((g) => activeTeam[g.key] > 0).length;

  const handleLaunch = (gameId: string) => {
    sound.playClick(650);
    onSelectGame(gameId);
  };

  return (
    <div className="hub">
      {/* Intro + active team scorecard */}
      <div className="hub-top">
        <div>
          <p className="hub-event">
            <span className="hub-logo">Press Play</span> The Game Room
          </p>
          <h2 className="hub-title">Choose your challenge</h2>
          <p className="hub-lede">
            Six games, 100 points each. Five on screen, one live in the room. Highest total out of {MAX_TOTAL} wins.
          </p>
        </div>

        <section className="scorecard" aria-label="Active team score">
          <div className="scorecard__head">
            <span>Now playing</span>
            {activeRank > 0 && <span className="scorecard__rank">#{activeRank}</span>}
          </div>
          <p className="scorecard__team">{activeTeam.name}</p>
          <p className="scorecard__total">
            <span>{activeTeam.total}</span> / {MAX_TOTAL}
          </p>
          <PointsBar team={activeTeam} size="lg" />
          <p className="scorecard__meta">
            {gamesPlayed} of {GAMES.length} games scored
          </p>
        </section>
      </div>

      {/* Game cards */}
      <ul className="games">
        {GAMES.map((g, i) => (
          <li key={g.id} className="game" style={{ "--accent": g.accent } as React.CSSProperties}>
            <div className="game__band">
              <span className="game__num">{i + 1}</span>
              <span>{g.tag}</span>
              <span className="game__score">
                <strong>{activeTeam[g.key]}</strong> / {MAX_PER_GAME}
              </span>
            </div>
            <div className="game__body">
              <h3 className="game__title">{g.title}</h3>
              <p className="game__blurb">{g.blurb}</p>
              <ul className="game__facts">
                {g.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button type="button" className="game__btn" onClick={() => handleLaunch(g.id)}>
                {g.cta}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Standings */}
      <section className="standings">
        <div className="standings__head">
          <h3>Standings</h3>
          <p>
            Active team: <strong>{activeTeam.name}</strong>
          </p>
        </div>

        {rankedTeams.length === 0 ? (
          <p className="standings__empty">No teams yet.</p>
        ) : (
          <table className="standings__table">
            <thead>
              <tr>
                <th className="col-rank">Rank</th>
                <th>Team</th>
                {GAMES.map((g) => (
                  <th key={g.id} className="col-game">
                    {g.short}
                  </th>
                ))}
                <th className="col-total">Total</th>
              </tr>
            </thead>
            <tbody>
              {rankedTeams.map((team, idx) => {
                const isActive = team.name === activeTeam.name;
                const classes = [idx === 0 && "is-leader", isActive && "is-active"]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <tr key={team.name} className={classes || undefined}>
                    <td className="col-rank">
                      <span className="rank">{idx + 1}</span>
                    </td>
                    <td>
                      <div className="team-name">
                        {team.name}
                        {isActive && <span className="team-tag">Playing</span>}
                      </div>
                      <PointsBar team={team} size="sm" />
                    </td>
                    {GAMES.map((g) => (
                      <td
                        key={g.id}
                        className="col-game"
                        style={{ "--accent": g.accent } as React.CSSProperties}
                      >
                        <span className="dot" />
                        {team[g.key]}
                      </td>
                    ))}
                    <td className="col-total">
                      <strong>{team.total}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}