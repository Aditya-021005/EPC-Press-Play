"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  CATEGORY_CARDS_POOL,
  CategoryCard,
  CardSuit,
  PLAYABLE_LETTERS,
  validateCategoryAnswer,
} from "@/data/categories";
import { fetchGameContent } from "@/lib/gameContent";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LetterWheelModal from "@/components/games/LetterWheelModal";
import {
  faCheck,
  faRotate,
  faClipboardCheck,
  faTrophy,
  faDice,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

interface CategoriesProps {
  onFinish: (score: number) => void;
  onBack: () => void;
  onUpdateMeta?: (meta: { title: string; score: number; roundInfo?: string }) => void;
}

type GamePhase = "select" | "play" | "score";

const MAX_PICKS = 10;
const ROUND_SECONDS = 60;
const RANK_ORDER = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUIT_ORDER: CardSuit[] = ["spades", "hearts", "diamonds", "clubs"];

const SUIT_TABS: { key: CardSuit | "all"; label: string; symbol: string; red?: boolean }[] = [
  { key: "all", label: "All", symbol: "🂠" },
  { key: "spades", label: "Spades", symbol: "♠" },
  { key: "hearts", label: "Hearts", symbol: "♥", red: true },
  { key: "diamonds", label: "Diamonds", symbol: "♦", red: true },
  { key: "clubs", label: "Clubs", symbol: "♣" },
];

const RANK_NAMES: Record<string, string> = { A: "Ace", J: "Jack", Q: "Queen", K: "King" };

/* ---------- Real pip layouts (x: 0 left, 50 centre, 100 right · y: 0 top → 100 bottom) ---------- */
const L = 0, C = 50, R = 100;
const sides = (ys: number[]) => ys.flatMap((y) => [[L, y], [R, y]] as [number, number][]);
const PIP_LAYOUTS: Record<string, [number, number][]> = {
  "2": [[C, 0], [C, 100]],
  "3": [[C, 0], [C, 50], [C, 100]],
  "4": sides([0, 100]),
  "5": [...sides([0, 100]), [C, 50]],
  "6": sides([0, 50, 100]),
  "7": [...sides([0, 50, 100]), [C, 25]],
  "8": [...sides([0, 50, 100]), [C, 25], [C, 75]],
  "9": [...sides([0, 33.33, 66.67, 100]), [C, 50]],
  "10": [...sides([0, 33.33, 66.67, 100]), [C, 16.67], [C, 83.33]],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Card visuals ---------- */
const Crown = () => (
  <svg className="pc-crown" viewBox="0 0 24 14" aria-hidden="true">
    <path d="M1 13 L3 3 L8 8 L12 1 L16 8 L21 3 L23 13 Z" fill="currentColor" />
  </svg>
);

function CourtHalf({ card }: { card: CategoryCard }) {
  return (
    <span className="pc-court-half">
      {card.rank !== "J" && <Crown />}
      <span className="pc-court-rank">{card.rank}</span>
      <span className="pc-court-suit">{card.suitSymbol}</span>
    </span>
  );
}

function PlayingCard({
  card,
  selected,
  order,
  dimmed,
  onClick,
}: {
  card: CategoryCard;
  selected: boolean;
  order?: number;
  dimmed?: boolean;
  onClick: () => void;
}) {
  const isFace = ["J", "Q", "K"].includes(card.rank);
  const isAce = card.rank === "A";
  const pips = PIP_LAYOUTS[card.rank] ?? [];
  const label = `${RANK_NAMES[card.rank] ?? card.rank} of ${card.suit}`;

  return (
    <button
      type="button"
      className={`pc ${card.color === "red" ? "pc--red" : ""} ${selected ? "is-selected" : ""} ${
        dimmed ? "is-dimmed" : ""
      }`}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
    >
      <span className="pc-face">
        <span className="pc-corner">
          <span className="pc-corner-rank">{card.rank}</span>
          <span className="pc-corner-suit">{card.suitSymbol}</span>
        </span>
        <span className="pc-corner pc-corner--br">
          <span className="pc-corner-rank">{card.rank}</span>
          <span className="pc-corner-suit">{card.suitSymbol}</span>
        </span>

        {isAce && <span className="pc-ace">{card.suitSymbol}</span>}

        {isFace && (
          <span className="pc-court">
            <CourtHalf card={card} />
            <span className="pc-court-flip">
              <CourtHalf card={card} />
            </span>
          </span>
        )}

        {!isAce && !isFace && (
          <span className="pc-pips">
            {pips.map(([x, y], i) => (
              <span
                key={i}
                className="pc-pip"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%)${y > 50 ? " rotate(180deg)" : ""}`,
                }}
              >
                {card.suitSymbol}
              </span>
            ))}
          </span>
        )}
      </span>
      {selected && <span className="pc-badge">{order}</span>}
    </button>
  );
}

function MiniCard({ card }: { card: CategoryCard }) {
  return (
    <span className={`pc-mini ${card.color === "red" ? "pc-mini--red" : ""}`} aria-hidden="true">
      <span className="pc-mini-rank">{card.rank}</span>
      <span className="pc-mini-suit">{card.suitSymbol}</span>
    </span>
  );
}

/* ====================================================================== */

export default function Categories({ onFinish, onBack, onUpdateMeta }: CategoriesProps) {
  const [cardsPool, setCardsPool] = useState<CategoryCard[]>(CATEGORY_CARDS_POOL);
  const [phase, setPhase] = useState<GamePhase>("select");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeSuit, setActiveSuit] = useState<CardSuit | "all">("all");

  const [letter, setLetter] = useState("?");
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [answers, setAnswers] = useState<string[]>(Array(MAX_PICKS).fill(""));
  const [marks, setMarks] = useState<number[]>(Array(MAX_PICKS).fill(0));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load custom card mappings from backend
  useEffect(() => {
    fetchGameContent().then((data) => {
      if (data && data.categories && data.categories.length > 0) {
        setCardsPool(data.categories);
      }
    });
  }, []);

  const selectedCards = useMemo(
    () =>
      selectedIds
        .map((id) => cardsPool.find((c) => c.id === id))
        .filter((c): c is CategoryCard => Boolean(c)),
    [selectedIds, cardsPool]
  );

  const deckBySuit = useMemo(() => {
    const suits = activeSuit === "all" ? SUIT_ORDER : [activeSuit];
    return suits.map((suit) => ({
      suit,
      cards: cardsPool.filter((c) => c.suit === suit).sort(
        (a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank)
      ),
    }));
  }, [activeSuit, cardsPool]);

  const isFull = selectedIds.length >= MAX_PICKS;
  const totalScore = marks.reduce((acc, m) => acc + m, 0);

  /* ---------- Selection ---------- */
  const handleToggleCard = (cardId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(cardId)) {
        sound.playClick(500);
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= MAX_PICKS) {
        sound.playBuzzer();
        return prev;
      }
      sound.playClick(650);
      return [...prev, cardId];
    });
  };

  const handleRandom = () => {
    sound.playClick(700);
    setSelectedIds(shuffle(cardsPool).slice(0, MAX_PICKS).map((c) => c.id));
  };

  const handleClear = () => {
    sound.playClick(500);
    setSelectedIds([]);
  };

  const handleConfirmSelection = () => {
    if (selectedIds.length !== MAX_PICKS) {
      sound.playBuzzer();
      return;
    }
    sound.playClick(750);
    setIsWheelOpen(true);
  };

  const handleWheelLetterSelected = (selectedLetter: string) => {
    setLetter(selectedLetter);
    setAnswers(Array(MAX_PICKS).fill(""));
    setTimeLeft(ROUND_SECONDS);
    setPhase("play");
    setTimerRunning(true);
    setIsWheelOpen(false);
  };

  /* ---------- Timer ---------- */
  useEffect(() => {
    if (phase !== "play" || !timerRunning) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, timerRunning]);

  // Runs on the render where timeLeft changed, so it always sees the latest answers
  useEffect(() => {
    if (phase !== "play" || !timerRunning) return;
    if (timeLeft <= 0) {
      sound.playBuzzer();
      handleProceedToScoring();
    } else if (timeLeft <= 5) {
      sound.playCountdownBeep(timeLeft === 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleInputChange = (idx: number, val: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleInputKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleProceedToScoring = () => {
    setTimerRunning(false);
    sound.playSuccess();
    setMarks(answers.map((ans) => (validateCategoryAnswer(ans, letter).valid ? 10 : 0)));
    setPhase("score");
  };

  /* ---------- Scoring ---------- */
  const setCategoryMark = (idx: number, value: 0 | 5 | 10) => {
    sound.playClick(650);
    setMarks((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleConfirmAndLockScore = () => {
    sound.playSuccess();
    confetti({ particleCount: 100, spread: 80 });
    onFinish(totalScore);
  };

  /* ---------- Header meta ---------- */
  useEffect(() => {
    if (phase === "select") {
      onUpdateMeta?.({ title: "Categories", score: 0, roundInfo: `Pick 10 Cards (${selectedIds.length}/10)` });
    } else if (phase === "play") {
      onUpdateMeta?.({ title: "Categories", score: 0, roundInfo: `Letter '${letter}' • ${timeLeft}s Left` });
    } else {
      onUpdateMeta?.({ title: "Categories", score: totalScore, roundInfo: `EPC Audit (${totalScore}/100 PTS)` });
    }
  }, [phase, selectedIds.length, letter, timeLeft, totalScore, onUpdateMeta]);

  /* ====================================================================== */
  return (
    <div className="game-arena">
      <div className="game-body-center cat-stage">
        {/* ============================ PHASE 1: DECK ============================ */}
        {phase === "select" && (
          <div className="cat-select">
            <header className="cat-panel cat-select-head">
              <span className="cat-pill">52-card deck</span>
              <h2>Draw 10 cards</h2>
              <p>Tap the same 10 cards the participant pulled from the physical deck.</p>
            </header>

            <div className="cat-suit-tabs" role="tablist" aria-label="Filter by suit">
              {SUIT_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeSuit === tab.key}
                  className={`cat-suit-tab ${activeSuit === tab.key ? "is-active" : ""}`}
                  onClick={() => {
                    sound.playClick(700);
                    setActiveSuit(tab.key);
                  }}
                >
                  <span className={`cat-suit-sym ${tab.red ? "is-red" : ""}`}>{tab.symbol}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {deckBySuit.map(({ suit, cards }) => (
              <section key={`${suit}-${activeSuit}`} className="cat-suit-section tab-content-animate">
                {activeSuit === "all" && (
                  <h3 className="cat-suit-title">
                    <span className={suit === "hearts" || suit === "diamonds" ? "is-red" : ""}>
                      {cards[0]?.suitSymbol}
                    </span>
                    {suit}
                  </h3>
                )}
                <div className="cat-deck-grid">
                  {cards.map((card) => {
                    const pos = selectedIds.indexOf(card.id);
                    const selected = pos !== -1;
                    return (
                      <PlayingCard
                        key={card.id}
                        card={card}
                        selected={selected}
                        order={pos + 1}
                        dimmed={isFull && !selected}
                        onClick={() => handleToggleCard(card.id)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Sticky dock: selected tray + actions */}
            <div className="cat-panel cat-dock">
              <div className="cat-dock-tray">
                <div className="cat-slots">
                  {Array.from({ length: MAX_PICKS }).map((_, i) => {
                    const card = selectedCards[i];
                    return card ? (
                      <button
                        key={card.id}
                        type="button"
                        className="cat-slot is-filled"
                        onClick={() => handleToggleCard(card.id)}
                        aria-label={`Remove ${RANK_NAMES[card.rank] ?? card.rank} of ${card.suit}`}
                      >
                        <MiniCard card={card} />
                      </button>
                    ) : (
                      <span key={`empty-${i}`} className="cat-slot" />
                    );
                  })}
                </div>
                <span className={`cat-dock-count ${isFull ? "is-full" : ""}`}>
                  {selectedIds.length}/{MAX_PICKS}
                </span>
              </div>

              <div className="cat-dock-actions">
                <button type="button" className="btn-secondary-sm" onClick={handleRandom}>
                  <FontAwesomeIcon icon={faDice} /> Random
                </button>
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={handleClear}
                  disabled={selectedIds.length === 0}
                >
                  <FontAwesomeIcon icon={faRotate} /> Clear
                </button>
                <button
                  type="button"
                  className="btn-action btn-gold cat-lock-btn"
                  disabled={!isFull}
                  onClick={handleConfirmSelection}
                >
                  <FontAwesomeIcon icon={faRotate} /> Lock 10 Cards & Spin Wheel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Letter Wheel Modal: Letter roll is via the spinning wheel only */}
        <LetterWheelModal
          isOpen={isWheelOpen}
          onClose={() => setIsWheelOpen(false)}
          currentLetter={letter}
          onSelectLetter={handleWheelLetterSelected}
        />

        {/* ============================ PHASE 2: PLAY ============================ */}
        {phase === "play" && (
          <div className="cat-play">
            <div className="cat-panel cat-play-head">
              <div className="cat-letter-tile">{letter}</div>
              <div className="cat-play-meta">
                <span className="cat-kicker">Active letter</span>
                <h3>Answers start with “{letter}”</h3>
              </div>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => {
                  sound.playClick();
                  setIsWheelOpen(true);
                }}
                title="Re-spin letter wheel"
                style={{ fontSize: "0.78rem", padding: "0.45rem 0.75rem" }}
              >
                <FontAwesomeIcon icon={faRotate} /> Re-spin Wheel
              </button>
              <div className={`cat-timer ${timeLeft <= 10 ? "is-low" : ""}`}>{timeLeft}s</div>
              <button type="button" className="btn-action btn-green cat-finish" onClick={handleProceedToScoring}>
                <FontAwesomeIcon icon={faCheck} /> Finish & audit
              </button>
              <div className="cat-timer-bar" aria-hidden="true">
                <span style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }} />
              </div>
            </div>

            <ol className="cat-rows">
              {selectedCards.map((card, idx) => (
                <li key={card.id} className="cat-row">
                  <MiniCard card={card} />
                  <div className="cat-row-text">
                    <strong>{card.name}</strong>
                    {card.hint && <span>{card.hint}</span>}
                  </div>
                  <input
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    className="cat-input-field"
                    placeholder={`Starts with ${letter}…`}
                    value={answers[idx]}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleInputKeyDown(idx, e)}
                    enterKeyHint={idx === selectedCards.length - 1 ? "done" : "next"}
                    autoComplete="off"
                    autoCapitalize="words"
                    autoFocus={idx === 0}
                  />
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ============================ PHASE 3: SUBMITTED ============================ */}
        {phase === "score" && (
          <div className="cat-score">
            <header className="cat-panel cat-score-head">
              <div>
                <span className="cat-pill">Round Complete • Letter {letter}</span>
                <h2>
                  <FontAwesomeIcon icon={faCheck} className="cat-head-icon" />
                  Answers Submitted for Host Evaluation
                </h2>
                <p>Official points are evaluated and entered live by the host from the Admin Panel.</p>
              </div>
            </header>

            <ol className="cat-rows">
              {selectedCards.map((card, idx) => {
                const ans = answers[idx].trim();
                const validation = validateCategoryAnswer(ans, letter);
                return (
                  <li key={card.id} className="cat-row cat-score-row">
                    <MiniCard card={card} />
                    <div className="cat-row-text">
                      <strong>{card.name}</strong>
                      <div className="cat-answer-line">
                        <span className={`cat-answer ${ans ? "" : "is-empty"}`}>{ans || "No answer entered"}</span>
                        {ans && (
                          <span className={`cat-verdict ${validation.valid ? "is-ok" : "is-bad"}`}>
                            {validation.valid ? `✓ Starts with ${letter}` : `✕ ${validation.reason}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="cat-panel cat-dock cat-score-dock">
              <div className="cat-dock-total" style={{ fontSize: "1rem" }}>
                <span>Host evaluation in progress in Admin Panel</span>
              </div>
              <button
                type="button"
                className="btn-action btn-gold cat-lock-btn"
                onClick={() => {
                  sound.playSuccess();
                  onFinish(totalScore);
                }}
              >
                Return to Arcade Hub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}