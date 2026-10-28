"use client";

import React from "react";
import { TeamScore } from "@/lib/tournamentState";
import { sound } from "@/lib/audio";
import "@/styles/hub.css";

interface ArcadeHubProps {
  activeTeam: TeamScore;
  allTeams: TeamScore[];
  onSelectGame: (gameId: string) => void;
  onLogout: () => void;
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
    blurb: "Points only for green tiles. 30 seconds per word. Yellow hazards bust the round!",
    facts: ["5 words", "30s per guess", "Yellow busts"],
    cta: "Play Greener Grass",
  },
  {
    id: "headlines",
    key: "realHeadline",
    title: "Real Headline or Not",
    short: "Headlines",
    tag: "Truth vs fiction",
    accent: "var(--c-sun)",
    blurb: "Bizarre headlines with a 20-second clock. Spot the real-world madness among fakes.",
    facts: ["10 rounds", "20s per headline", "10 pts per call"],
    cta: "Play Headlines",
  },
  {
    id: "name-tune",
    key: "nameThatTune",
    title: "Name That Tune",
    short: "Tune",
    tag: "Lyric sleuth",
    accent: "var(--c-sky)",
    blurb: "Single lyric snippet under a 30s clock. Manually type song and artist. Host evaluated.",
    facts: ["10 lyrics", "30s per track", "EPC scored (0, 5, 10 pts)"],
    cta: "Play Name That Tune",
  },
  {
    id: "categories",
    key: "categories",
    title: "Categories",
    short: "Categories",
    tag: "52 Playing Cards",
    accent: "var(--c-grape)",
    blurb: "52 playing cards deck, draw 10, roll a random letter, and sprint for 60 seconds. EPC scored.",
    facts: ["52 playing cards", "60s sprint", "EPC scored (0, 5, 10 pts)"],
    cta: "Play Categories",
  },
  {
    id: "reverse-millionaire",
    key: "reverseMillionaire",
    title: "Reverse Millionaire",
    short: "Millionaire",
    tag: "Trapdoor heist",
    accent: "var(--c-coin)",
    blurb: "5 questions, 100 coins, 30s per question. Distribute coins across trapdoors. Safe door carries on.",
    facts: ["100 coins", "5 questions", "30s per question"],
    cta: "Play Reverse Millionaire",
  },
  {
    id: "offline",
    key: "offlineGame",
    title: "Bullseye",
    short: "Bullseye",
    tag: "Darts & Archery",
    accent: "var(--c-cherry)",
    blurb: "Physical darts & archery simulation. Shoot 5 target boards & enter 3 category guesses each.",
    facts: ["5 Target Boards", "3 Guesses Each", "Host Scored (0–100 pts)"],
    cta: "Play Bullseye",
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

export default function ArcadeHub({
  activeTeam,
  allTeams,
  onSelectGame,
  onLogout,
}: ArcadeHubProps) {
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
            Six games, 100 points each. Play through all challenges, then finish your turn to let the next team log in.
          </p>
        </div>

        <section className="scorecard" aria-label="Active team score">
          <div className="scorecard__head">
            <span>Now playing on this laptop</span>
            {activeRank > 0 && <span className="scorecard__rank">#{activeRank}</span>}
          </div>
          <p className="scorecard__team">{activeTeam.name}</p>

          <button
            type="button"
            className="btn-secondary-sm"
            onClick={() => {
              sound.playClick();
              onLogout();
            }}
            style={{ width: "100%", margin: "0.5rem 0", fontSize: "0.82rem", padding: "0.5rem" }}
          >
            Finish Turn / Give Up (Log Out)
          </button>

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