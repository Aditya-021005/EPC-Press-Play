"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faNewspaper,
  faMusic,
  faLayerGroup,
  faCoins,
  faBullseye,
  faGamepad,
  faBolt,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { sound } from "@/lib/audio";
import "@/styles/game-loader.css";

interface GameLaunchLoaderProps {
  gameId: string;
  teamName: string;
  onComplete: (gameId: string) => void;
}

interface GameMeta {
  title: string;
  tag: string;
  accent: string;
  tip: string;
  icon: typeof faLeaf;
}

const GAME_METAS: Record<string, GameMeta> = {
  "arena-hub": {
    title: "Entering Press Play Arena",
    tag: "Player Authenticated • Gateway Open",
    accent: "var(--c-sun, #ffc93c)",
    tip: "Welcome to the game room! 6 challenges await your team on this laptop.",
    icon: faTrophy,
  },
  "greener-grass": {
    title: "Greener Grass",
    tag: "Wordle Twist • Yellow Hazards",
    accent: "var(--c-grass, #3dd68c)",
    tip: "Only green letters earn points! Yellow tiles bust the round.",
    icon: faLeaf,
  },
  headlines: {
    title: "Real Headline or Not",
    tag: "Truth vs Satire • 20s Clock",
    accent: "var(--c-sun, #ffc93c)",
    tip: "10 rounds, 20s per headline. Spot real-world news among clever fakes!",
    icon: faNewspaper,
  },
  "name-tune": {
    title: "Name That Tune",
    tag: "Lyric Sleuth • 30s per Song",
    accent: "var(--c-sky, #5bbeff)",
    tip: "Read the lyrics snippet under a 30s clock. Manually type Song and Artist.",
    icon: faMusic,
  },
  categories: {
    title: "Categories",
    tag: "Scattergories • 52 Cards Deck",
    accent: "var(--c-grape, #b79bff)",
    tip: "Draw 10 playing cards, spin the letter wheel, and race the 60s sprint!",
    icon: faLayerGroup,
  },
  "reverse-millionaire": {
    title: "Reverse Millionaire",
    tag: "Trapdoor Heist • 100 Coins",
    accent: "var(--c-coin, #ffa23a)",
    tip: "5 questions, 30s each. Distribute your 100 coins across safe doors.",
    icon: faCoins,
  },
  offline: {
    title: "Bullseye Arena",
    tag: "Darts & Archery • 5 Boards",
    accent: "var(--c-cherry, #ff7a93)",
    tip: "Shoot darts/arrows at 5 target boards & enter 3 category guesses each!",
    icon: faBullseye,
  },
};

export default function GameLaunchLoader({
  gameId,
  teamName,
  onComplete,
}: GameLaunchLoaderProps) {
  const [progress, setProgress] = useState(15);
  const [statusMsg, setStatusMsg] = useState("INITIALIZING STAGE...");

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const meta = GAME_METAS[gameId] || {
    title: "Loading Challenge",
    tag: "Press Play Arena",
    accent: "var(--c-sun)",
    tip: "Get ready to compete!",
    icon: faGamepad,
  };

  useEffect(() => {
    setProgress(15);
    setStatusMsg("INITIALIZING STAGE...");

    try {
      sound.playClick(600);
    } catch {}

    const step1 = setTimeout(() => {
      setProgress(46);
      setStatusMsg("LOADING ASSETS & AUDIO...");
      try {
        sound.playClick(750);
      } catch {}
    }, 320);

    const step2 = setTimeout(() => {
      setProgress(82);
      setStatusMsg("CALIBRATING ARENA BOARD...");
      try {
        sound.playClick(920);
      } catch {}
    }, 720);

    const step3 = setTimeout(() => {
      setProgress(100);
      setStatusMsg("STAGE READY! LAUNCHING ARENA...");
      try {
        sound.playSuccess();
      } catch {}
    }, 1150);

    const finishTimeout = setTimeout(() => {
      onCompleteRef.current(gameId);
    }, 1450);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(finishTimeout);
    };
  }, [gameId]);

  return (
    <div className="game-loader-overlay" role="dialog" aria-modal="true" aria-label="Loading game">
      <div className="game-loader-card">
        {/* Arcade Badge */}
        <span className="game-loader-badge" style={{ background: meta.accent, color: "#0d041c" }}>
          <FontAwesomeIcon icon={faBolt} style={{ marginRight: "0.4rem" }} />
          🌙 ARABIAN NIGHTS • CHALLENGE LAUNCH
        </span>

        {/* Game Icon */}
        <div
          className="game-loader-icon-wrap"
          style={{
            background: meta.accent,
            color: "#0d041c",
            border: "3.5px solid var(--gold-dark)",
            boxShadow: "0 0 18px rgba(245, 175, 25, 0.4)",
          }}
        >
          <FontAwesomeIcon icon={meta.icon} />
        </div>

        {/* Title & Tagline */}
        <h2 className="game-loader-title">{meta.title}</h2>
        <div className="game-loader-tag">{meta.tag}</div>

        {/* Pro Tip Box */}
        <div className="game-loader-tip-box">
          <strong
            style={{
              display: "block",
              marginBottom: "0.2rem",
              fontSize: "0.8rem",
              color: "var(--muted-paper)",
              textTransform: "uppercase",
            }}
          >
            Challenge Brief
          </strong>
          {meta.tip}
        </div>

        {/* Progress Bar & Status */}
        <div className="game-loader-progress-wrap">
          <div className="game-loader-track">
            <div
              className="game-loader-bar"
              style={{
                width: `${progress}%`,
                background: meta.accent,
              }}
            />
          </div>

          <div className="game-loader-status-text">
            <span>{statusMsg}</span>
            <span style={{ color: "var(--ink)" }}>{progress}%</span>
          </div>
        </div>

        {/* Player Name Footer */}
        <div
          style={{
            marginTop: "1.2rem",
            paddingTop: "0.8rem",
            borderTop: "2px dashed #e2e8f0",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: "var(--muted-paper)",
          }}
        >
          PLAYER ON STAGE: <strong style={{ color: "var(--ink)" }}>{teamName || "READY"}</strong>
        </div>
      </div>
    </div>
  );
}
