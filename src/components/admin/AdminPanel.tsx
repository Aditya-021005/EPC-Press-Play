"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  TeamScore,
  verifyAdminPin,
  adminOverrideScore,
  adminSetActiveTeam,
  adminAddTeam,
  adminDeleteTeam,
  adminResetTournament,
  adminWipeAllTeams,
  adminToggleGamePlayed,
  adminEvaluateSubmission,
  isGamePlayed,
  getPlayedGamesCount,
  GameSubmissionRecord,
  NameThatTuneSubmissionItem,
  CategorySubmissionItem,
  BullseyeSubmissionItem,
} from "@/lib/tournamentState";
import {
  AllGameContent,
  fetchGameContent,
  updateGameContentSection,
  getDefaultGameContent,
} from "@/lib/gameContent";
import { CategoryCard, CardSuit, validateCategoryAnswer } from "@/data/categories";
import { TuneItem, TUNES_POOL } from "@/data/tunes";
import { HeadlineItem } from "@/data/headlines";
import { MillionaireQuestion } from "@/data/millionaire";
import { BullseyeCategory, BULLSEYE_SPINNERS } from "@/data/bullseye";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";
import "@/styles/admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faLockOpen,
  faBolt,
  faCrown,
  faChartColumn,
  faLeaf,
  faNewspaper,
  faMusic,
  faLayerGroup,
  faCoins,
  faBullseye,
  faTrashCan,
  faCheck,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faPlus,
  faFloppyDisk,
  faRotate,
  faPenToSquare,
  faUsers,
  faClipboardCheck,
  faStar,
  faWandMagicSparkles,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

interface AdminPanelProps {
  teams: TeamScore[];
  activeTeamName: string;
  adminPin: string | null;
  submissions?: Record<string, Record<string, GameSubmissionRecord>>;
  onAdminAuth: (pin: string | null) => void;
  onRefresh: () => void;
  onClose: () => void;
}

type AdminMainTab = "scoring" | "content" | "roster";
type ContentGameSubTab = "categories" | "tunes" | "headlines" | "millionaire" | "words" | "bullseye";

const SUIT_FILTERS: { key: CardSuit | "all"; label: string; symbol: string }[] = [
  { key: "all", label: "All 52 Cards", symbol: "🂠" },
  { key: "spades", label: "Spades", symbol: "♠" },
  { key: "hearts", label: "Hearts", symbol: "♥" },
  { key: "diamonds", label: "Diamonds", symbol: "♦" },
  { key: "clubs", label: "Clubs", symbol: "♣" },
];

export default function AdminPanel({
  teams,
  activeTeamName,
  adminPin,
  submissions = {},
  onAdminAuth,
  onRefresh,
  onClose,
}: AdminPanelProps) {
  const [enteredPin, setEnteredPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Navigation Tabs
  const [mainTab, setMainTab] = useState<AdminMainTab>("scoring");
  const [contentSubTab, setContentSubTab] = useState<ContentGameSubTab>("categories");
  const [suitFilter, setSuitFilter] = useState<CardSuit | "all">("all");

  // Evaluator Mode Tab: "nameThatTune" | "categories" | "offlineGame" | "quickTiles"
  const [evaluatorGameTab, setEvaluatorGameTab] = useState<"nameThatTune" | "categories" | "offlineGame" | "quickTiles">("nameThatTune");
  const [markPlayedOnSave, setMarkPlayedOnSave] = useState(true);
  const [isSavingEvaluation, setIsSavingEvaluation] = useState(false);

  // Granular item scores per team:
  // Tune: teamKey -> array of { song: number (0, 2.5, 5), artist: number (0, 2.5, 5) }
  const [tuneScores, setTuneScores] = useState<Record<string, { song: number; artist: number }[]>>({});
  // Categories: teamKey -> array of numbers (0, 5, 10)
  const [catScores, setCatScores] = useState<Record<string, number[]>>({});
  // Bullseye: teamKey -> array of numbers (0-20)
  const [offlineScores, setOfflineScores] = useState<Record<string, number[]>>({});

  // Score override state: teamName -> gameKey -> value
  const [overrideData, setOverrideData] = useState<Record<string, Record<string, number>>>({});
  const [currentActiveTeam, setCurrentActiveTeam] = useState<string>(activeTeamName || (teams[0]?.name ?? ""));
  const [selectedScoringTeam, setSelectedScoringTeam] = useState<string>(activeTeamName || (teams[0]?.name ?? ""));
  const [newTeamName, setNewTeamName] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [deleteTargetTeam, setDeleteTargetTeam] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetMode, setResetMode] = useState<"scoresOnly" | "wipeAll">("wipeAll");

  // Game Content State
  const [gameContent, setGameContent] = useState<AllGameContent>(getDefaultGameContent());
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Load Content from API
  useEffect(() => {
    fetchGameContent().then((data) => {
      if (data) {
        setGameContent(data);
      }
    });
  }, []);

  useEffect(() => {
    if (activeTeamName) {
      setCurrentActiveTeam(activeTeamName);
      if (!selectedScoringTeam) {
        setSelectedScoringTeam(activeTeamName);
      }
    }
  }, [activeTeamName, selectedScoringTeam]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = enteredPin.trim();
    if (!cleanPin) return;

    setIsVerifying(true);
    setPinError("");

    const ok = await verifyAdminPin(cleanPin);
    setIsVerifying(false);

    if (ok) {
      sound.playSuccess();
      onAdminAuth(cleanPin);
    } else {
      sound.playBuzzer();
      setPinError("Invalid Admin PIN. Access denied.");
    }
  };

  const handleLogout = () => {
    sound.playClick();
    onAdminAuth(null);
  };

  const flashMessage = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  // -------------------------------------------------------------
  // SCORING CONSOLE HANDLERS
  // -------------------------------------------------------------
  const handleScoreChange = (teamName: string, gameKey: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setOverrideData((prev) => ({
      ...prev,
      [teamName]: {
        ...(prev[teamName] || {}),
        [gameKey]: num,
      },
    }));
  };

  const handleSaveScore = async (teamName: string, gameKey: string) => {
    if (!adminPin) return;
    const teamOverrides = overrideData[teamName];
    if (!teamOverrides || teamOverrides[gameKey] === undefined) return;

    const score = teamOverrides[gameKey];
    sound.playClick();
    const ok = await adminOverrideScore(adminPin, teamName, gameKey, score);
    if (ok) {
      flashMessage(`Updated ${gameKey} for ${teamName} to ${score} pts!`);
      onRefresh();
    }
  };

  const handleQuickAward = async (teamName: string, gameKey: string, score: number) => {
    if (!adminPin) return;
    sound.playSuccess();
    handleScoreChange(teamName, gameKey, String(score));
    const ok = await adminOverrideScore(adminPin, teamName, gameKey, score);
    if (ok) {
      flashMessage(`Awarded ${score} pts in ${gameKey} to ${teamName}!`);
      onRefresh();
    }
  };

  const handleToggleUnlock = async (
    teamName: string,
    gameKey: string,
    currentlyPlayed: boolean,
    resetScore = false
  ) => {
    if (!adminPin) return;
    sound.playClick();
    if (currentlyPlayed) {
      const confirmRemove = window.confirm(
        `Remove play for ${gameKey} on ${teamName}? This will reset played status, unlock replay access for the team, and clear previous submissions.`
      );
      if (!confirmRemove) return;
    }
    const ok = await adminToggleGamePlayed(adminPin, teamName, gameKey, currentlyPlayed, resetScore);
    if (ok) {
      flashMessage(
        currentlyPlayed
          ? `Removed play for ${gameKey} on ${teamName} (Replay Allowed)!`
          : `Marked ${gameKey} as Played for ${teamName}!`
      );
      onRefresh();
    }
  };

  // -------------------------------------------------------------
  // MANUAL EVALUATION CALCULATIONS & HANDLERS
  // -------------------------------------------------------------
  const cleanTeamKey = (selectedScoringTeam || "").trim().toLowerCase();

  // 1. Name That Tune Data
  const tuneSubRecord = submissions[cleanTeamKey]?.nameThatTune;
  const tuneItems: NameThatTuneSubmissionItem[] = useMemo(() => {
    if (tuneSubRecord?.items && Array.isArray(tuneSubRecord.items) && tuneSubRecord.items.length > 0) {
      return tuneSubRecord.items;
    }
    const pool = (gameContent.tunes && gameContent.tunes.length > 0 ? gameContent.tunes : TUNES_POOL).slice(0, 10);
    return pool.map((t, idx) => ({
      trackIdx: idx,
      lyric: t.lyric,
      expectedSong: t.song,
      expectedArtist: t.artist,
      genre: t.genre,
      year: t.year,
      enteredSong: "",
      enteredArtist: "",
      songScore: 0,
      artistScore: 0,
    }));
  }, [tuneSubRecord, gameContent.tunes]);

  const currentTuneScores = tuneScores[cleanTeamKey] || tuneItems.map((it) => ({
    song: it.songScore ?? 0,
    artist: it.artistScore ?? 0,
  }));

  const tuneTotalScore = currentTuneScores.reduce(
    (acc, cur) => acc + (cur?.song || 0) + (cur?.artist || 0),
    0
  );

  const handleTuneScoreChange = (trackIdx: number, part: "song" | "artist", val: number) => {
    sound.playClick(val === 5 ? 750 : val === 2.5 ? 650 : 500);
    setTuneScores((prev) => {
      const existing = prev[cleanTeamKey] ? [...prev[cleanTeamKey]] : tuneItems.map((it) => ({
        song: it.songScore ?? 0,
        artist: it.artistScore ?? 0,
      }));
      while (existing.length <= trackIdx) {
        existing.push({ song: 0, artist: 0 });
      }
      existing[trackIdx] = {
        ...existing[trackIdx],
        [part]: val,
      };
      return {
        ...prev,
        [cleanTeamKey]: existing,
      };
    });
  };

  const handleAutoGradeTune = () => {
    sound.playClick(700);
    const newScores = tuneItems.map((it) => {
      const cleanExpectedSong = it.expectedSong.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanEnteredSong = (it.enteredSong || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      let sScore = 0;
      if (cleanEnteredSong && cleanExpectedSong === cleanEnteredSong) {
        sScore = 5;
      } else if (cleanEnteredSong && (cleanExpectedSong.includes(cleanEnteredSong) || cleanEnteredSong.includes(cleanExpectedSong))) {
        sScore = 2.5;
      }

      const cleanExpectedArtist = it.expectedArtist.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanEnteredArtist = (it.enteredArtist || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      let aScore = 0;
      if (cleanEnteredArtist && cleanExpectedArtist === cleanEnteredArtist) {
        aScore = 5;
      } else if (cleanEnteredArtist && (cleanExpectedArtist.includes(cleanEnteredArtist) || cleanEnteredArtist.includes(cleanExpectedArtist))) {
        aScore = 2.5;
      }

      return { song: sScore, artist: aScore };
    });

    setTuneScores((prev) => ({
      ...prev,
      [cleanTeamKey]: newScores,
    }));
    flashMessage(`Auto-graded ${tuneItems.length} tracks based on matches!`);
  };

  const handleSaveTuneEvaluation = async () => {
    if (!adminPin || !selectedScoringTeam) return;
    setIsSavingEvaluation(true);
    sound.playSuccess();
    confetti({ particleCount: 70, spread: 60 });

    const evaluatedItems: NameThatTuneSubmissionItem[] = tuneItems.map((it, idx) => ({
      ...it,
      songScore: currentTuneScores[idx]?.song ?? 0,
      artistScore: currentTuneScores[idx]?.artist ?? 0,
    }));

    const ok = await adminEvaluateSubmission(
      adminPin,
      selectedScoringTeam,
      "nameThatTune",
      evaluatedItems,
      tuneTotalScore,
      markPlayedOnSave
    );
    setIsSavingEvaluation(false);

    if (ok) {
      flashMessage(`Saved Name That Tune score: ${tuneTotalScore} pts for ${selectedScoringTeam}!`);
      onRefresh();
    } else {
      sound.playBuzzer();
      flashMessage("Error saving evaluation to server.");
    }
  };

  // 2. Categories Data
  const catSubRecord = submissions[cleanTeamKey]?.categories;
  const activeLetter = catSubRecord?.letter || "A";
  const catItems: CategorySubmissionItem[] = useMemo(() => {
    if (catSubRecord?.items && Array.isArray(catSubRecord.items) && catSubRecord.items.length > 0) {
      return catSubRecord.items;
    }
    const pool = (gameContent.categories && gameContent.categories.length > 0 ? gameContent.categories : []).slice(0, 10);
    return pool.map((c) => ({
      cardId: c.id,
      cardName: c.name,
      cardRank: c.rank,
      cardSuit: c.suit,
      hint: c.hint,
      letter: activeLetter,
      enteredAnswer: "",
      score: 0,
    }));
  }, [catSubRecord, gameContent.categories, activeLetter]);

  const currentCatScores = catScores[cleanTeamKey] || catItems.map((it) => it.score ?? 0);
  const catTotalScore = currentCatScores.reduce((acc, s) => acc + (s || 0), 0);

  const handleCatScoreChange = (idx: number, val: 0 | 5 | 10) => {
    sound.playClick(val === 10 ? 750 : val === 5 ? 650 : 500);
    setCatScores((prev) => {
      const existing = prev[cleanTeamKey] ? [...prev[cleanTeamKey]] : catItems.map((it) => it.score ?? 0);
      while (existing.length <= idx) existing.push(0);
      existing[idx] = val;
      return {
        ...prev,
        [cleanTeamKey]: existing,
      };
    });
  };

  const handleAutoGradeCategories = () => {
    sound.playClick(700);
    const newScores = catItems.map((it) => {
      const ans = (it.enteredAnswer || "").trim();
      const validation = validateCategoryAnswer(ans, it.letter || activeLetter);
      return validation.valid ? 10 : 0;
    });
    setCatScores((prev) => ({
      ...prev,
      [cleanTeamKey]: newScores,
    }));
    flashMessage(`Auto-graded ${catItems.length} categories based on letter '${activeLetter}'!`);
  };

  const handleSaveCatEvaluation = async () => {
    if (!adminPin || !selectedScoringTeam) return;
    setIsSavingEvaluation(true);
    sound.playSuccess();
    confetti({ particleCount: 70, spread: 60 });

    const evaluatedItems: CategorySubmissionItem[] = catItems.map((it, idx) => ({
      ...it,
      score: currentCatScores[idx] ?? 0,
    }));

    const ok = await adminEvaluateSubmission(
      adminPin,
      selectedScoringTeam,
      "categories",
      evaluatedItems,
      catTotalScore,
      markPlayedOnSave,
      activeLetter
    );
    setIsSavingEvaluation(false);

    if (ok) {
      flashMessage(`Saved Categories score: ${catTotalScore} pts for ${selectedScoringTeam}!`);
      onRefresh();
    } else {
      sound.playBuzzer();
      flashMessage("Error saving categories evaluation to server.");
    }
  };

  // 3. Bullseye Data (5 Spinners + 3 Answers)
  const offlineSubRecord = submissions[cleanTeamKey]?.offlineGame;
  const offlineItems: BullseyeSubmissionItem[] = useMemo(() => {
    if (offlineSubRecord?.items && Array.isArray(offlineSubRecord.items) && offlineSubRecord.items.length > 0) {
      return offlineSubRecord.items;
    }
    // Default 5-spinner submission structure
    return [
      {
        criteria: BULLSEYE_SPINNERS.map((sp) => ({
          id: sp.id,
          title: sp.title,
          shortLabel: sp.shortLabel,
          selectedOption: sp.options[0],
        })),
        answers: ["", "", ""],
        answerNotes: ["", "", ""],
        guesses: ["", "", ""],
        categoryName: "5 Simultaneous Spinners",
        hint: "Genre • Rating • Year • Setting • Country",
        score: 0,
      },
    ];
  }, [offlineSubRecord]);

  const isSpinnerSubmission = Boolean(offlineItems[0]?.criteria && offlineItems[0].criteria.length > 0);

  const currentOfflineScores = useMemo(() => {
    if (offlineScores[cleanTeamKey]) {
      return offlineScores[cleanTeamKey];
    }
    if (isSpinnerSubmission) {
      const saved = offlineItems[0]?.answerScores;
      if (Array.isArray(saved) && saved.length > 0) return saved;
      return [0, 0, 0];
    }
    return offlineItems.map((it) => it.score ?? 0);
  }, [offlineScores, cleanTeamKey, isSpinnerSubmission, offlineItems]);

  const offlineTotalScore = isSpinnerSubmission
    ? Math.min(100, Math.round(((currentOfflineScores[0] || 0) + (currentOfflineScores[1] || 0) + (currentOfflineScores[2] || 0)) * 10) / 10)
    : Math.min(100, currentOfflineScores.reduce((acc, s) => acc + (s || 0), 0));

  const handleOfflineScoreChange = (idx: number, val: number) => {
    sound.playClick(650);
    setOfflineScores((prev) => {
      const existing = prev[cleanTeamKey]
        ? [...prev[cleanTeamKey]]
        : (isSpinnerSubmission ? (offlineItems[0]?.answerScores || [0, 0, 0]) : offlineItems.map((it) => it.score ?? 0));
      const next = [...existing];
      while (next.length <= idx) next.push(0);
      next[idx] = val;
      return {
        ...prev,
        [cleanTeamKey]: next,
      };
    });
  };

  const handleSaveOfflineEvaluation = async () => {
    if (!adminPin || !selectedScoringTeam) return;
    setIsSavingEvaluation(true);
    sound.playSuccess();
    confetti({ particleCount: 70, spread: 60 });

    const evaluatedItems: BullseyeSubmissionItem[] = isSpinnerSubmission
      ? [
          {
            ...offlineItems[0],
            answerScores: [
              currentOfflineScores[0] || 0,
              currentOfflineScores[1] || 0,
              currentOfflineScores[2] || 0,
            ],
            score: offlineTotalScore,
          },
        ]
      : offlineItems.map((it, idx) => ({
          ...it,
          score: currentOfflineScores[idx] ?? 0,
        }));

    const ok = await adminEvaluateSubmission(
      adminPin,
      selectedScoringTeam,
      "offlineGame",
      evaluatedItems,
      offlineTotalScore,
      markPlayedOnSave
    );
    setIsSavingEvaluation(false);

    if (ok) {
      flashMessage(`Saved Bullseye score: ${offlineTotalScore} pts for ${selectedScoringTeam}!`);
      onRefresh();
    } else {
      sound.playBuzzer();
      flashMessage("Error saving offline evaluation to server.");
    }
  };

  // -------------------------------------------------------------
  // ROSTER HANDLERS
  // -------------------------------------------------------------
  const handleSelectActiveTeam = async (name: string) => {
    if (!adminPin) return;
    sound.playClick();
    setCurrentActiveTeam(name);
    setSelectedScoringTeam(name);
    const ok = await adminSetActiveTeam(adminPin, name);
    if (ok) {
      flashMessage(`Active team on stage set to: ${name}`);
      onRefresh();
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPin || !newTeamName.trim()) return;

    sound.playClick();
    const ok = await adminAddTeam(adminPin, newTeamName.trim());
    if (ok) {
      setNewTeamName("");
      flashMessage(`Registered new team: "${newTeamName.trim()}"`);
      onRefresh();
    }
  };

  const handleConfirmDelete = async () => {
    if (!adminPin || !deleteTargetTeam) return;

    sound.playBuzzer();
    const target = deleteTargetTeam;
    setDeleteTargetTeam(null);
    const ok = await adminDeleteTeam(adminPin, target);
    if (ok) {
      if (currentActiveTeam.trim().toLowerCase() === target.trim().toLowerCase()) {
        setCurrentActiveTeam("");
      }
      if (selectedScoringTeam.trim().toLowerCase() === target.trim().toLowerCase()) {
        setSelectedScoringTeam("");
      }
      flashMessage(`Deleted team "${target}" permanently`);
      onRefresh();
    }
  };

  const handleConfirmReset = async () => {
    if (!adminPin) return;

    sound.playBuzzer();
    setShowResetConfirm(false);
    if (resetMode === "wipeAll") {
      const ok = await adminWipeAllTeams(adminPin);
      if (ok) {
        setCurrentActiveTeam("");
        setSelectedScoringTeam("");
        flashMessage("All teams and scores have been wiped completely!");
        onRefresh();
      }
    } else {
      const ok = await adminResetTournament(adminPin, false);
      if (ok) {
        flashMessage("All tournament scores have been reset to zero!");
        onRefresh();
      }
    }
  };

  // -------------------------------------------------------------
  // GAME CONTENT MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const handleSaveContentSection = async (section: ContentGameSubTab) => {
    if (!adminPin) return;
    setIsSavingContent(true);
    sound.playClick(750);

    const ok = await updateGameContentSection(adminPin, section, gameContent[section]);
    setIsSavingContent(false);

    if (ok) {
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 60 });
      flashMessage(`Successfully saved customized ${section} to tournament server!`);
    } else {
      sound.playBuzzer();
      alert("Failed to save content. Check PIN or server connection.");
    }
  };

  const handleResetContent = async () => {
    if (!adminPin) return;
    if (!confirm("Are you sure you want to restore factory default questions and cards for all games?")) return;

    setIsSavingContent(true);
    const defaults = getDefaultGameContent();
    const ok = await updateGameContentSection(adminPin, "categories", defaults.categories);
    await updateGameContentSection(adminPin, "tunes", defaults.tunes);
    await updateGameContentSection(adminPin, "headlines", defaults.headlines);
    await updateGameContentSection(adminPin, "millionaire", defaults.millionaire);
    await updateGameContentSection(adminPin, "words", defaults.words);
    await updateGameContentSection(adminPin, "bullseye", defaults.bullseye);
    setIsSavingContent(false);

    if (ok) {
      setGameContent(defaults);
      sound.playSuccess();
      flashMessage("All questions, card mappings, and song tracks restored to defaults!");
    }
  };

  // Content Editors - Card Mapping Edit
  const handleCardTopicChange = (cardId: string, newTopic: string) => {
    setGameContent((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === cardId ? { ...c, name: newTopic } : c)),
    }));
  };

  const handleCardHintChange = (cardId: string, newHint: string) => {
    setGameContent((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === cardId ? { ...c, hint: newHint } : c)),
    }));
  };

  // Tunes Edit
  const handleTuneChange = (idx: number, field: keyof TuneItem, val: string | number) => {
    setGameContent((prev) => {
      const copy = [...prev.tunes];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, tunes: copy };
    });
  };

  const handleAddTune = () => {
    const newId = `t_${Date.now()}`;
    const newItem: TuneItem = {
      id: newId,
      song: "New Song Title",
      artist: "Artist Name",
      year: 2024,
      genre: "Pop",
      lyric: "Enter single lyric snippet here...",
    };
    setGameContent((prev) => ({ ...prev, tunes: [newItem, ...prev.tunes] }));
    sound.playClick();
  };

  const handleDeleteTune = (idx: number) => {
    setGameContent((prev) => ({
      ...prev,
      tunes: prev.tunes.filter((_, i) => i !== idx),
    }));
    sound.playBuzzer();
  };

  // Headlines Edit
  const handleHeadlineChange = (idx: number, field: keyof HeadlineItem, val: string | boolean) => {
    setGameContent((prev) => {
      const copy = [...prev.headlines];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, headlines: copy };
    });
  };

  const handleAddHeadline = () => {
    const newItem: HeadlineItem = {
      id: `h_${Date.now()}`,
      headline: "New news headline to verify...",
      isReal: true,
      outletHint: "News Source • City",
      explanation: "Explanation of whether real or fabricated...",
      source: "Source Reference",
    };
    setGameContent((prev) => ({ ...prev, headlines: [newItem, ...prev.headlines] }));
    sound.playClick();
  };

  const handleDeleteHeadline = (idx: number) => {
    setGameContent((prev) => ({
      ...prev,
      headlines: prev.headlines.filter((_, i) => i !== idx),
    }));
    sound.playBuzzer();
  };

  // Millionaire Edit
  const handleMillionaireChange = (idx: number, field: keyof MillionaireQuestion, val: unknown) => {
    setGameContent((prev) => {
      const copy = [...prev.millionaire];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, millionaire: copy };
    });
  };

  const handleMillionaireOptionChange = (qIdx: number, optIdx: number, val: string) => {
    setGameContent((prev) => {
      const copy = [...prev.millionaire];
      const opts = [...copy[qIdx].options] as [string, string, string, string];
      opts[optIdx] = val;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return { ...prev, millionaire: copy };
    });
  };

  const handleAddMillionaire = () => {
    const newItem: MillionaireQuestion = {
      id: `m_${Date.now()}`,
      category: "GENERAL KNOWLEDGE",
      question: "Enter new multiple choice trivia question here...",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      explanation: "Explanation of the correct answer...",
    };
    setGameContent((prev) => ({ ...prev, millionaire: [...prev.millionaire, newItem] }));
    sound.playClick();
  };

  const handleDeleteMillionaire = (idx: number) => {
    setGameContent((prev) => ({
      ...prev,
      millionaire: prev.millionaire.filter((_, i) => i !== idx),
    }));
    sound.playBuzzer();
  };

  // Bullseye Edit
  const handleBullseyeChange = (idx: number, field: keyof BullseyeCategory, val: unknown) => {
    setGameContent((prev) => {
      const copy = [...prev.bullseye];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, bullseye: copy };
    });
  };

  const handleAddBullseye = () => {
    const newItem: BullseyeCategory = {
      id: `b_${Date.now()}`,
      name: "New Target Board Category",
      hint: "Brief category hint",
      examples: ["Example 1", "Example 2", "Example 3"],
    };
    setGameContent((prev) => ({ ...prev, bullseye: [...prev.bullseye, newItem] }));
    sound.playClick();
  };

  const handleDeleteBullseye = (idx: number) => {
    setGameContent((prev) => ({
      ...prev,
      bullseye: prev.bullseye.filter((_, i) => i !== idx),
    }));
    sound.playBuzzer();
  };

  // Words Edit
  const handleWordsChange = (text: string) => {
    const list = text
      .split(/[\n,]/)
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length === 5);
    setGameContent((prev) => ({ ...prev, words: list }));
  };

  /* ========================================================================= */
  /* SCREEN 1: PIN AUTHENTICATION                                              */
  /* ========================================================================= */
  if (!adminPin) {
    return (
      <div className="admin-page-wrap">
        <div className="admin-login-wrap">
          <button type="button" className="admin-back-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} />
            EXIT TO ARENA
          </button>

          <div className="admin-card">
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  margin: "0 auto 1rem",
                  borderRadius: "50%",
                  background: "var(--gold-gradient)",
                  color: "#0d041c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  border: "3px solid var(--gold-dark)",
                  boxShadow: "0 0 20px rgba(245, 175, 25, 0.4)",
                }}
              >
                <FontAwesomeIcon icon={faLock} />
              </div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0, color: "var(--ink)" }}>
                Host Admin Console
              </h1>
              <p style={{ color: "var(--muted-paper)", fontSize: "0.92rem", marginTop: "0.4rem", fontWeight: 600 }}>
                Manage live scores, edit all 6 game questions, cards & songs, and tournament controls.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="admin-pin-input-group">
                <label
                  htmlFor="host-pin-field"
                  style={{
                    display: "block",
                    fontWeight: 900,
                    fontSize: "0.92rem",
                    color: "var(--ink)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Enter Host Password / PIN:
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="host-pin-field"
                    type={showPin ? "text" : "password"}
                    maxLength={64}
                    placeholder="Enter host password..."
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    className="admin-pin-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--ink)",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      padding: "0.2rem",
                    }}
                    title={showPin ? "Hide PIN" : "Show PIN"}
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  >
                    <FontAwesomeIcon icon={showPin ? faEyeSlash : faEye} />
                  </button>
                </div>

                {pinError && (
                  <p style={{ color: "#dc2626", fontSize: "0.85rem", fontWeight: 800, marginTop: "0.6rem" }}>
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn-action btn-gold"
                disabled={isVerifying || !enteredPin.trim()}
                style={{
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  letterSpacing: "0.5px",
                }}
              >
                {isVerifying ? (
                  "AUTHENTICATING..."
                ) : (
                  <>
                    UNLOCK ADMIN CONSOLE
                    <FontAwesomeIcon icon={faLockOpen} style={{ marginLeft: "0.5rem" }} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* SCREEN 2: AUTHENTICATED HOST MASTER CONSOLE                               */
  /* ========================================================================= */
  const activeScoringTeamData = teams.find((t) => t.name === selectedScoringTeam);

  return (
    <div className="admin-page-wrap">
      <div className="admin-console-wrap">
        {/* Top Header Bar */}
        <div className="admin-topbar">
          <div className="admin-title-area">
            <button type="button" className="admin-back-btn" onClick={onClose} style={{ margin: 0 }}>
              <FontAwesomeIcon icon={faArrowLeft} />
              EXIT TO ARENA
            </button>
            <h2 className="admin-title">
              <FontAwesomeIcon icon={faBolt} style={{ color: "var(--gold-primary)", marginRight: "0.45rem" }} />
              HOST MASTER CONSOLE
            </h2>
          </div>

          <div className="admin-actions-group">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                fontWeight: 900,
                background: "var(--gold-gradient)",
                color: "#0d041c",
                border: "2px solid #ffe082",
                padding: "0.4rem 0.85rem",
                borderRadius: "9999px",
                boxShadow: "0 0 10px rgba(245, 175, 25, 0.35)",
              }}
            >
              HOST AUTHENTICATED
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: "#fee2e2",
                border: "2px solid #991b1b",
                color: "#991b1b",
                borderRadius: "10px",
                padding: "0.45rem 0.85rem",
                fontWeight: 800,
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={faLock} style={{ marginRight: "0.4rem" }} />
              LOCK & LOGOUT
            </button>
          </div>
        </div>

        {/* Live Notification Banner */}
        {saveSuccessMsg && (
          <div
            style={{
              background: "#dcfce7",
              border: "3px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
              color: "#166534",
              padding: "0.85rem 1.2rem",
              borderRadius: "14px",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 800,
            }}
          >
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.5rem" }} />
            {saveSuccessMsg}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRIMARY NAVIGATION TABS (Scoring / Content Manager / Roster)             */}
        {/* ========================================================================= */}
        <div className="admin-main-tabs">
          <button
            type="button"
            className={`admin-main-tab-btn ${mainTab === "scoring" ? "is-active" : ""}`}
            onClick={() => {
              sound.playClick();
              setMainTab("scoring");
            }}
          >
            <FontAwesomeIcon icon={faChartColumn} />
            LIVE HOST SCORING CONSOLE
          </button>

          <button
            type="button"
            className={`admin-main-tab-btn ${mainTab === "content" ? "is-active" : ""}`}
            onClick={() => {
              sound.playClick();
              setMainTab("content");
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            GAME CONTENT & QUESTIONS MANAGER
          </button>

          <button
            type="button"
            className={`admin-main-tab-btn ${mainTab === "roster" ? "is-active" : ""}`}
            onClick={() => {
              sound.playClick();
              setMainTab("roster");
            }}
          >
            <FontAwesomeIcon icon={faUsers} />
            ROSTER & TOURNAMENT RESET
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LIVE HOST SCORING CONSOLE                                          */}
        {/* ========================================================================= */}
        {mainTab === "scoring" && (
          <div>
            {/* Active Team Scoring Pad */}
            <div className="admin-section" style={{ marginBottom: "1.5rem" }}>
              <span className="admin-badge">LIVE EVALUATOR & MANUAL SCORER</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.2rem" }}>
                <div>
                  <h3 className="admin-section-title">Manual Scoring & Evaluation Console</h3>
                  <p className="admin-section-sub">
                    View official questions side-by-side with team submissions. Grade tracks and cards with 1-click precision (0, 2.5, 5 for Tune; 0, 5, 10 for Categories).
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <label htmlFor="scoring-team-select" style={{ fontWeight: 800, fontSize: "0.9rem" }}>
                      Select Team:
                    </label>
                    <select
                      id="scoring-team-select"
                      value={selectedScoringTeam}
                      onChange={(e) => setSelectedScoringTeam(e.target.value)}
                      className="admin-input-sm"
                      style={{ minWidth: "180px", padding: "0.6rem" }}
                    >
                      {teams.map((t) => {
                        const hasTune = Boolean(submissions[t.name.toLowerCase()]?.nameThatTune);
                        const hasCat = Boolean(submissions[t.name.toLowerCase()]?.categories);
                        return (
                          <option key={t.name} value={t.name}>
                            {t.name} ({t.total} pts){hasTune || hasCat ? " • 🟡 Submitted" : ""}{t.name === currentActiveTeam ? " ★ STAGE ACTIVE" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {selectedScoringTeam === currentActiveTeam ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.45rem 0.85rem",
                        borderRadius: "8px",
                        background: "var(--c-sun)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 900,
                        fontSize: "0.82rem",
                        border: "2px solid var(--ink)",
                        boxShadow: "2px 2px 0 var(--ink)",
                      }}
                    >
                      <FontAwesomeIcon icon={faCrown} />
                      ACTIVE ON STAGE
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn-action btn-gold"
                      style={{ padding: "0.48rem 0.9rem", fontSize: "0.82rem", whiteSpace: "nowrap" }}
                      onClick={() => handleSelectActiveTeam(selectedScoringTeam)}
                    >
                      <FontAwesomeIcon icon={faCrown} style={{ marginRight: "0.4rem" }} />
                      SET AS ACTIVE ON STAGE
                    </button>
                  )}
                </div>
              </div>

              {/* Evaluator Mode Tabs */}
              <div className="eval-tabs-bar" role="tablist">
                <button
                  type="button"
                  className={`eval-tab-btn ${evaluatorGameTab === "nameThatTune" ? "is-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setEvaluatorGameTab("nameThatTune");
                  }}
                >
                  <FontAwesomeIcon icon={faMusic} style={{ color: "var(--c-sky)" }} />
                  Name That Tune
                  {tuneSubRecord ? (
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem", borderRadius: "999px", background: "#10b981", color: "#fff", fontWeight: 900 }}>
                      ✓ 10 Submitted
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 800 }}>
                      Live Stage
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className={`eval-tab-btn ${evaluatorGameTab === "categories" ? "is-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setEvaluatorGameTab("categories");
                  }}
                >
                  <FontAwesomeIcon icon={faLayerGroup} style={{ color: "var(--c-grape)" }} />
                  Categories (Scattergories)
                  {catSubRecord ? (
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem", borderRadius: "999px", background: "#10b981", color: "#fff", fontWeight: 900 }}>
                      ✓ 10 Submitted
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 800 }}>
                      Live Stage
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className={`eval-tab-btn ${evaluatorGameTab === "offlineGame" ? "is-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setEvaluatorGameTab("offlineGame");
                  }}
                >
                  <FontAwesomeIcon icon={faBullseye} style={{ color: "var(--c-cherry)" }} />
                  Bullseye Arena
                  {offlineSubRecord ? (
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem", borderRadius: "999px", background: "#10b981", color: "#fff", fontWeight: 900 }}>
                      ✓ 5 Boards
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontWeight: 800 }}>
                      Live Darts
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className={`eval-tab-btn ${evaluatorGameTab === "quickTiles" ? "is-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setEvaluatorGameTab("quickTiles");
                  }}
                >
                  <FontAwesomeIcon icon={faBolt} style={{ color: "var(--c-sun)" }} />
                  Quick Override Tiles (All 6 Games)
                </button>
              </div>

              {/* ========================================================================= */}
              {/* TAB 1A: NAME THAT TUNE EVALUATION (0, 2.5, 5 per Song & Artist)           */}
              {/* ========================================================================= */}
              {evaluatorGameTab === "nameThatTune" && (
                <div>
                  {/* Sticky Evaluation Summary Card (Top) */}
                  <div className="eval-summary-card">
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", display: "block" }}>
                        Name That Tune • Evaluated Score for {selectedScoringTeam}
                      </span>
                      <div className="eval-total-display">
                        <span className="eval-total-num">{tuneTotalScore}</span>
                        <span className="eval-total-max">/ 100 PTS</span>
                        <span style={{ marginLeft: "0.8rem", fontSize: "0.85rem", fontWeight: 800, color: "#10b981" }}>
                          ({tuneItems.length} Tracks • 10 pts max each)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="btn-action btn-gold"
                        style={{ padding: "0.5rem 0.9rem", fontSize: "0.82rem" }}
                        onClick={handleAutoGradeTune}
                        title="Auto-grade exact matches to 5 pts and partial matches to 2.5 pts"
                      >
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ marginRight: "0.4rem" }} />
                        Auto-Grade Matches
                      </button>

                      <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={markPlayedOnSave}
                          onChange={(e) => setMarkPlayedOnSave(e.target.checked)}
                        />
                        Lock as Played (1-Play limit)
                      </label>

                      <button
                        type="button"
                        className="btn-action btn-green"
                        style={{ padding: "0.6rem 1.3rem", fontSize: "0.9rem", fontWeight: 900 }}
                        onClick={handleSaveTuneEvaluation}
                        disabled={isSavingEvaluation}
                      >
                        <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: "0.4rem" }} />
                        {isSavingEvaluation ? "Saving…" : `SAVE & PUBLISH (${tuneTotalScore} PTS)`}
                      </button>

                      {isGamePlayed(activeScoringTeamData, "nameThatTune") && (
                        <button
                          type="button"
                          onClick={() => handleToggleUnlock(selectedScoringTeam, "nameThatTune", true, true)}
                          style={{
                            padding: "0.55rem 0.95rem",
                            fontSize: "0.82rem",
                            borderRadius: "8px",
                            border: "1.5px solid #dc2626",
                            background: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                          title="Remove this game's play to allow the team to replay it"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          Remove Play (Allow Replay)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 10 Side-by-Side Track Evaluation Cards */}
                  <div className="eval-side-by-side-list">
                    {tuneItems.map((item, idx) => {
                      const scores = currentTuneScores[idx] || { song: 0, artist: 0 };
                      const trackSubtotal = (scores.song || 0) + (scores.artist || 0);

                      return (
                        <div key={idx} className="eval-card">
                          {/* Left Column: Official Question & Expected Answer */}
                          <div className="eval-box-expected">
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "999px",
                                    background: "var(--stage)",
                                    color: "#fff",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    fontWeight: 900,
                                  }}
                                >
                                  TRACK {idx + 1} OF {tuneItems.length}
                                </span>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b" }}>
                                  {item.genre || "Music"} {item.year ? `• ${item.year}` : ""}
                                </span>
                              </div>

                              <blockquote
                                style={{
                                  margin: "0 0 0.8rem 0",
                                  padding: "0.65rem 0.85rem",
                                  background: "#ffffff",
                                  borderLeft: "4px solid var(--c-sky)",
                                  borderRadius: "6px",
                                  fontStyle: "italic",
                                  fontSize: "0.92rem",
                                  color: "var(--ink)",
                                  lineHeight: 1.4,
                                }}
                              >
                                “{item.lyric}”
                              </blockquote>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", background: "#ffffff", padding: "0.7rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}>
                              <div>
                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                                  Official Song Title:
                                </span>
                                <strong style={{ display: "block", color: "var(--ink)", fontSize: "0.98rem" }}>
                                  <FontAwesomeIcon icon={faMusic} style={{ color: "var(--c-sky)", marginRight: "0.4rem" }} />
                                  {item.expectedSong}
                                </strong>
                              </div>

                              <div>
                                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                                  Official Artist / Singer:
                                </span>
                                <strong style={{ display: "block", color: "var(--ink)", fontSize: "0.98rem" }}>
                                  <FontAwesomeIcon icon={faCrown} style={{ color: "var(--c-sun)", marginRight: "0.4rem" }} />
                                  {item.expectedArtist}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Participant's Guess & 0, 2.5, 5 Scoring Controls */}
                          <div className="eval-box-submission">
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--gold-dark)", textTransform: "uppercase" }}>
                                  Team Submission & Evaluation
                                </span>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 900,
                                    fontSize: "0.85rem",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "8px",
                                    background: trackSubtotal === 10 ? "#d1fae5" : trackSubtotal > 0 ? "#fef3c7" : "#fee2e2",
                                    color: trackSubtotal === 10 ? "#065f46" : trackSubtotal > 0 ? "#92400e" : "#991b1b",
                                    border: "1.5px solid currentColor",
                                  }}
                                >
                                  Track Subtotal: {trackSubtotal} / 10 PTS
                                </span>
                              </div>

                              {/* Part 1: Song Title Scoring (0, 2.5, 5) */}
                              <div className="eval-part-row">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
                                  <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#475569" }}>
                                    PART A: SONG TITLE GUESS
                                  </span>
                                  <strong style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: scores.song === 5 ? "#10b981" : scores.song === 2.5 ? "#f59e0b" : "#64748b" }}>
                                    Score: {scores.song} / 5 pts
                                  </strong>
                                </div>

                                <div
                                  style={{
                                    padding: "0.45rem 0.75rem",
                                    background: "#ffffff",
                                    borderRadius: "8px",
                                    border: "1.5px solid #cbd5e1",
                                    fontSize: "0.92rem",
                                    fontWeight: 700,
                                    color: item.enteredSong ? "var(--ink)" : "#94a3b8",
                                    fontStyle: item.enteredSong ? "normal" : "italic",
                                  }}
                                >
                                  {item.enteredSong ? `“${item.enteredSong}”` : "(No song title entered)"}
                                </div>

                                <div className="eval-pill-group">
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scores.song === 0 ? "is-selected-zero" : ""}`}
                                    onClick={() => handleTuneScoreChange(idx, "song", 0)}
                                  >
                                    0 PTS (Incorrect)
                                  </button>
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scores.song === 2.5 ? "is-selected-half" : ""}`}
                                    onClick={() => handleTuneScoreChange(idx, "song", 2.5)}
                                  >
                                    2.5 PTS (Half / Close)
                                  </button>
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scores.song === 5 ? "is-selected" : ""}`}
                                    onClick={() => handleTuneScoreChange(idx, "song", 5)}
                                  >
                                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.3rem" }} />
                                    5 PTS (Correct)
                                  </button>
                                </div>
                              </div>

                              {/* Part 2: Artist Scoring (0, 2.5, 5) */}
                              <div className="eval-part-row" style={{ marginTop: "0.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
                                  <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#475569" }}>
                                    PART B: ARTIST / SINGER GUESS
                                  </span>
                                  <strong style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: scores.artist === 5 ? "#10b981" : scores.artist === 2.5 ? "#f59e0b" : "#64748b" }}>
                                    Score: {scores.artist} / 5 pts
                                  </strong>
                                </div>

                                <div
                                  style={{
                                    padding: "0.45rem 0.75rem",
                                    background: "#ffffff",
                                    borderRadius: "8px",
                                    border: "1.5px solid #cbd5e1",
                                    fontSize: "0.92rem",
                                    fontWeight: 700,
                                    color: item.enteredArtist ? "var(--ink)" : "#94a3b8",
                                    fontStyle: item.enteredArtist ? "normal" : "italic",
                                  }}
                                >
                                  {item.enteredArtist ? `“${item.enteredArtist}”` : "(No artist entered)"}
                                </div>

                                <div className="eval-pill-group">
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scores.artist === 0 ? "is-selected-zero" : ""}`}
                                    onClick={() => handleTuneScoreChange(idx, "artist", 0)}
                                  >
                                    0 PTS (Incorrect)
                                  </button>
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scores.artist === 2.5 ? "is-selected-half" : ""}`}
                                    onClick={() => handleTuneScoreChange(idx, "artist", 2.5)}
                                  >
                                    2.5 PTS (Half / Close)
                                  </button>
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scores.artist === 5 ? "is-selected" : ""}`}
                                    onClick={() => handleTuneScoreChange(idx, "artist", 5)}
                                  >
                                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.3rem" }} />
                                    5 PTS (Correct)
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Save Bar for convenient submission */}
                  <div className="eval-summary-card" style={{ marginTop: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#64748b" }}>
                        All 10 Tracks Evaluated for {selectedScoringTeam}
                      </span>
                      <div className="eval-total-display">
                        <span className="eval-total-num">{tuneTotalScore}</span>
                        <span className="eval-total-max">/ 100 PTS</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-action btn-green"
                      style={{ padding: "0.7rem 1.6rem", fontSize: "0.95rem", fontWeight: 900 }}
                      onClick={handleSaveTuneEvaluation}
                      disabled={isSavingEvaluation}
                    >
                      <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: "0.5rem" }} />
                      {isSavingEvaluation ? "Saving…" : `SAVE & PUBLISH TUNE SCORE (${tuneTotalScore} PTS)`}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 1B: CATEGORIES EVALUATION (0, 5, 10 for each 10-point question)       */}
              {/* ========================================================================= */}
              {evaluatorGameTab === "categories" && (
                <div>
                  {/* Sticky Evaluation Summary Card (Top) */}
                  <div className="eval-summary-card">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.6rem",
                            borderRadius: "8px",
                            background: "var(--c-sun)",
                            color: "var(--ink)",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 900,
                            fontSize: "0.82rem",
                            border: "1.5px solid var(--ink)",
                          }}
                        >
                          LETTER ‘{activeLetter}’
                        </span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b" }}>
                          Categories Evaluation • {selectedScoringTeam}
                        </span>
                      </div>
                      <div className="eval-total-display">
                        <span className="eval-total-num">{catTotalScore}</span>
                        <span className="eval-total-max">/ 100 PTS</span>
                        <span style={{ marginLeft: "0.8rem", fontSize: "0.85rem", fontWeight: 800, color: "#10b981" }}>
                          ({catItems.length} Cards • 10 pts each)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="btn-action btn-gold"
                        style={{ padding: "0.5rem 0.9rem", fontSize: "0.82rem" }}
                        onClick={handleAutoGradeCategories}
                        title={`Auto-grade valid answers starting with letter '${activeLetter}' to 10 pts`}
                      >
                        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ marginRight: "0.4rem" }} />
                        Auto-Grade ‘{activeLetter}’
                      </button>

                      <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={markPlayedOnSave}
                          onChange={(e) => setMarkPlayedOnSave(e.target.checked)}
                        />
                        Lock as Played (1-Play limit)
                      </label>

                      <button
                        type="button"
                        className="btn-action btn-green"
                        style={{ padding: "0.6rem 1.3rem", fontSize: "0.9rem", fontWeight: 900 }}
                        onClick={handleSaveCatEvaluation}
                        disabled={isSavingEvaluation}
                      >
                        <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: "0.4rem" }} />
                        {isSavingEvaluation ? "Saving…" : `SAVE & PUBLISH (${catTotalScore} PTS)`}
                      </button>

                      {isGamePlayed(activeScoringTeamData, "categories") && (
                        <button
                          type="button"
                          onClick={() => handleToggleUnlock(selectedScoringTeam, "categories", true, true)}
                          style={{
                            padding: "0.55rem 0.95rem",
                            fontSize: "0.82rem",
                            borderRadius: "8px",
                            border: "1.5px solid #dc2626",
                            background: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                          title="Remove this game's play to allow the team to replay it"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          Remove Play (Allow Replay)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 10 Side-by-Side Category Card Evaluation */}
                  <div className="eval-side-by-side-list">
                    {catItems.map((item, idx) => {
                      const scoreVal = currentCatScores[idx] ?? 0;
                      const ans = (item.enteredAnswer || "").trim();
                      const letterForCheck = item.letter || activeLetter;
                      const validation = validateCategoryAnswer(ans, letterForCheck);

                      return (
                        <div key={idx} className="eval-card">
                          {/* Left Column: Official Category Prompt & Card Details */}
                          <div className="eval-box-expected">
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "999px",
                                    background: "var(--stage)",
                                    color: "#fff",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    fontWeight: 900,
                                  }}
                                >
                                  CARD {idx + 1} OF {catItems.length}
                                </span>
                                {item.cardRank && (
                                  <span
                                    style={{
                                      fontFamily: "var(--font-mono)",
                                      fontWeight: 900,
                                      fontSize: "0.95rem",
                                      color: item.cardSuit === "hearts" || item.cardSuit === "diamonds" ? "#dc2626" : "var(--ink)",
                                    }}
                                  >
                                    {item.cardRank}
                                    {item.cardSuit === "hearts" ? "♥" : item.cardSuit === "diamonds" ? "♦" : item.cardSuit === "clubs" ? "♣" : "♠"}
                                  </span>
                                )}
                              </div>

                              <h4 style={{ margin: "0.3rem 0", fontSize: "1.1rem", fontWeight: 900, color: "var(--ink)" }}>
                                {item.cardName}
                              </h4>
                              {item.hint && (
                                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#64748b", fontStyle: "italic" }}>
                                  Hint: {item.hint}
                                </p>
                              )}
                            </div>

                            <div style={{ background: "#ffffff", padding: "0.6rem 0.8rem", borderRadius: "10px", border: "1.5px solid #cbd5e1" }}>
                              <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                                Constraint Rule:
                              </span>
                              <strong style={{ display: "block", color: "var(--gold-dark)", fontFamily: "var(--font-mono)", fontSize: "0.92rem" }}>
                                Must start with letter “{letterForCheck}”
                              </strong>
                            </div>
                          </div>

                          {/* Right Column: Participant's Answer & 0, 5, 10 Scoring */}
                          <div className="eval-box-submission">
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--gold-dark)", textTransform: "uppercase" }}>
                                  Participant Submission
                                </span>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 900,
                                    fontSize: "0.85rem",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "8px",
                                    background: scoreVal === 10 ? "#d1fae5" : scoreVal === 5 ? "#fef3c7" : "#fee2e2",
                                    color: scoreVal === 10 ? "#065f46" : scoreVal === 5 ? "#92400e" : "#991b1b",
                                    border: "1.5px solid currentColor",
                                  }}
                                >
                                  Awarded: {scoreVal} / 10 PTS
                                </span>
                              </div>

                              <div style={{ marginBottom: "0.8rem" }}>
                                <div
                                  style={{
                                    padding: "0.6rem 0.85rem",
                                    background: "#ffffff",
                                    borderRadius: "10px",
                                    border: "2px solid #cbd5e1",
                                    fontSize: "1.05rem",
                                    fontWeight: 800,
                                    color: ans ? "var(--ink)" : "#94a3b8",
                                    fontStyle: ans ? "normal" : "italic",
                                    marginBottom: "0.4rem",
                                  }}
                                >
                                  {ans ? ans : "(No answer entered)"}
                                </div>

                                {ans ? (
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.3rem",
                                      fontSize: "0.78rem",
                                      fontWeight: 800,
                                      padding: "0.2rem 0.55rem",
                                      borderRadius: "6px",
                                      background: validation.valid ? "#d1fae5" : "#fee2e2",
                                      color: validation.valid ? "#065f46" : "#991b1b",
                                    }}
                                  >
                                    {validation.valid ? `✓ Starts with '${letterForCheck}'` : `✕ ${validation.reason}`}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 700 }}>
                                    Blank entry
                                  </span>
                                )}
                              </div>

                              {/* 0, 5, 10 Scoring Buttons for 10-point question */}
                              <div style={{ marginTop: "0.6rem" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", display: "block", marginBottom: "0.3rem" }}>
                                  AWARD POINTS (10 PTS MAX):
                                </span>
                                <div className="eval-pill-group">
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scoreVal === 0 ? "is-selected-zero" : ""}`}
                                    onClick={() => handleCatScoreChange(idx, 0)}
                                  >
                                    0 PTS (Invalid / Blank)
                                  </button>
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scoreVal === 5 ? "is-selected-half" : ""}`}
                                    onClick={() => handleCatScoreChange(idx, 5)}
                                  >
                                    5 PTS (Duplicate / Borderline)
                                  </button>
                                  <button
                                    type="button"
                                    className={`eval-score-btn ${scoreVal === 10 ? "is-selected" : ""}`}
                                    onClick={() => handleCatScoreChange(idx, 10)}
                                  >
                                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: "0.3rem" }} />
                                    10 PTS (Unique Valid)
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Save Bar for convenient submission */}
                  <div className="eval-summary-card" style={{ marginTop: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#64748b" }}>
                        All 10 Category Cards Evaluated for {selectedScoringTeam}
                      </span>
                      <div className="eval-total-display">
                        <span className="eval-total-num">{catTotalScore}</span>
                        <span className="eval-total-max">/ 100 PTS</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-action btn-green"
                      style={{ padding: "0.7rem 1.6rem", fontSize: "0.95rem", fontWeight: 900 }}
                      onClick={handleSaveCatEvaluation}
                      disabled={isSavingEvaluation}
                    >
                      <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: "0.5rem" }} />
                      {isSavingEvaluation ? "Saving…" : `SAVE & PUBLISH CATEGORIES SCORE (${catTotalScore} PTS)`}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 1C: BULLSEYE ARENA EVALUATION                                         */}
              {/* ========================================================================= */}
              {evaluatorGameTab === "offlineGame" && (
                <div>
                  <div className="eval-summary-card">
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", display: "block" }}>
                        Bullseye Arena Evaluation • {selectedScoringTeam}
                      </span>
                      <div className="eval-total-display">
                        <span className="eval-total-num">{offlineTotalScore}</span>
                        <span className="eval-total-max">/ 100 PTS</span>
                        <span style={{ marginLeft: "0.8rem", fontSize: "0.85rem", fontWeight: 800, color: "#10b981" }}>
                          {isSpinnerSubmission ? "(3 Answers • Evaluated against 5 Spun Criteria)" : `(${offlineItems.length} Target Boards • 20 pts max each)`}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={markPlayedOnSave}
                          onChange={(e) => setMarkPlayedOnSave(e.target.checked)}
                        />
                        Lock as Played (1-Play limit)
                      </label>

                      <button
                        type="button"
                        className="btn-action btn-green"
                        style={{ padding: "0.6rem 1.3rem", fontSize: "0.9rem", fontWeight: 900 }}
                        onClick={handleSaveOfflineEvaluation}
                        disabled={isSavingEvaluation}
                      >
                        <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: "0.4rem" }} />
                        {isSavingEvaluation ? "Saving…" : `SAVE & PUBLISH (${offlineTotalScore} PTS)`}
                      </button>

                      {isGamePlayed(activeScoringTeamData, "offlineGame") && (
                        <button
                          type="button"
                          onClick={() => handleToggleUnlock(selectedScoringTeam, "offlineGame", true, true)}
                          style={{
                            padding: "0.55rem 0.95rem",
                            fontSize: "0.82rem",
                            borderRadius: "8px",
                            border: "1.5px solid #dc2626",
                            background: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                          title="Remove this game's play to allow the team to replay it"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                          Remove Play (Allow Replay)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 5-SPINNER SUBMISSION EVALUATOR */}
                  {isSpinnerSubmission ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1rem" }}>
                      {/* Spun Criteria Banner */}
                      <div
                        style={{
                          background: "#ffffff",
                          border: "2.5px solid var(--ink)",
                          borderRadius: "14px",
                          padding: "1rem 1.4rem",
                          boxShadow: "3px 3px 0 var(--gold-primary)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.78rem",
                            fontWeight: 900,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            color: "var(--gold-dark)",
                            display: "block",
                            marginBottom: "0.5rem",
                          }}
                        >
                          TEAM'S 5 LANDED CRITERIA:
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {(offlineItems[0]?.criteria || []).map((crit, cIdx) => (
                            <span
                              key={cIdx}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                padding: "0.35rem 0.8rem",
                                background: "var(--stage-3)",
                                color: "#ffffff",
                                border: "1.5px solid var(--gold-border)",
                                borderRadius: "9999px",
                                fontSize: "0.85rem",
                                fontWeight: 800,
                              }}
                            >
                              <strong style={{ color: "var(--gold-bright)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                                {crit.shortLabel}:
                              </strong>
                              <span>{crit.selectedOption}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 3 Answers Evaluation Cards */}
                      <div className="eval-side-by-side-list">
                        {[0, 1, 2].map((ansIdx) => {
                          const ansNum = ansIdx + 1;
                          const answersList = offlineItems[0]?.answers || offlineItems[0]?.guesses || [];
                          const answerText = answersList[ansIdx] || "";
                          const noteText = offlineItems[0]?.answerNotes?.[ansIdx] || "";
                          const scoreVal = currentOfflineScores[ansIdx] ?? 0;

                          return (
                            <div key={ansIdx} className="eval-card">
                              <div className="eval-box-expected">
                                <div>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      padding: "0.2rem 0.6rem",
                                      borderRadius: "999px",
                                      background: "var(--stage)",
                                      color: "#fff",
                                      fontFamily: "var(--font-mono)",
                                      fontSize: "0.75rem",
                                      fontWeight: 900,
                                      marginBottom: "0.4rem",
                                    }}
                                  >
                                    ANSWER #{ansNum} OF 3
                                  </span>

                                  <h4 style={{ margin: "0.3rem 0", fontSize: "1.2rem", fontWeight: 900, color: "var(--ink)" }}>
                                    {answerText ? `"${answerText}"` : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>(Blank Answer #{ansNum})</span>}
                                  </h4>

                                  {noteText && (
                                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "#475569", background: "#f8fafc", padding: "0.4rem 0.65rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                                      <strong>Note:</strong> {noteText}
                                    </p>
                                  )}

                                  <div style={{ marginTop: "0.8rem" }}>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                                      Check against 5 criteria:
                                    </span>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.3rem" }}>
                                      {(offlineItems[0]?.criteria || []).map((crit, cIdx) => (
                                        <span
                                          key={cIdx}
                                          style={{
                                            fontSize: "0.72rem",
                                            padding: "0.2rem 0.5rem",
                                            borderRadius: "6px",
                                            background: "#f1f5f9",
                                            border: "1px solid #cbd5e1",
                                            fontWeight: 700,
                                            color: "#334155",
                                          }}
                                        >
                                          {crit.shortLabel}: {crit.selectedOption}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="eval-box-submission">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                                  <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--gold-dark)", textTransform: "uppercase" }}>
                                    Score for Answer #{ansNum}
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "var(--font-mono)",
                                      fontWeight: 900,
                                      fontSize: "0.92rem",
                                      padding: "0.25rem 0.75rem",
                                      borderRadius: "8px",
                                      background: scoreVal > 0 ? "#d1fae5" : "#fee2e2",
                                      color: scoreVal > 0 ? "#065f46" : "#991b1b",
                                      border: "1.5px solid currentColor",
                                    }}
                                  >
                                    {scoreVal} PTS
                                  </span>
                                </div>

                                <div>
                                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", display: "block", marginBottom: "0.35rem" }}>
                                    AWARD ANSWER POINTS:
                                  </span>
                                  <div className="eval-pill-group" style={{ flexWrap: "wrap" }}>
                                    {[0, 5, 10, 15, 20, 25, 30, 33.3].map((pts) => (
                                      <button
                                        key={pts}
                                        type="button"
                                        className={`eval-score-btn ${scoreVal === pts ? (pts > 0 ? "is-selected" : "is-selected-zero") : ""}`}
                                        onClick={() => handleOfflineScoreChange(ansIdx, pts)}
                                      >
                                        {pts} PTS
                                      </button>
                                    ))}
                                  </div>

                                  <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b" }}>Custom:</span>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      step={0.5}
                                      value={scoreVal}
                                      onChange={(e) => handleOfflineScoreChange(ansIdx, parseFloat(e.target.value) || 0)}
                                      style={{
                                        width: "80px",
                                        padding: "0.3rem 0.5rem",
                                        fontWeight: 900,
                                        fontSize: "0.95rem",
                                        border: "2px solid var(--ink)",
                                        borderRadius: "6px",
                                        textAlign: "center",
                                      }}
                                    />
                                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>PTS</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Legacy 5 Target Boards Evaluator */
                    <div className="eval-side-by-side-list">
                      {offlineItems.map((item, idx) => {
                        const scoreVal = currentOfflineScores[idx] ?? 0;
                        return (
                          <div key={idx} className="eval-card">
                            <div className="eval-box-expected">
                              <div>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "999px",
                                    background: "var(--stage)",
                                    color: "#fff",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    fontWeight: 900,
                                    marginBottom: "0.4rem",
                                  }}
                                >
                                  TARGET BOARD {idx + 1} OF {offlineItems.length}
                                </span>
                                <h4 style={{ margin: "0.3rem 0", fontSize: "1.1rem", fontWeight: 900, color: "var(--ink)" }}>
                                  <FontAwesomeIcon icon={faBullseye} style={{ color: "var(--c-cherry)", marginRight: "0.4rem" }} />
                                  {item.categoryName}
                                </h4>
                                {item.hint && (
                                  <p style={{ margin: "0", fontSize: "0.85rem", color: "#64748b" }}>
                                    Target: {item.hint}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="eval-box-submission">
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--gold-dark)", textTransform: "uppercase" }}>
                                  Recorded Guesses & Score
                                </span>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 900,
                                    fontSize: "0.85rem",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "8px",
                                    background: scoreVal > 0 ? "#d1fae5" : "#fee2e2",
                                    color: scoreVal > 0 ? "#065f46" : "#991b1b",
                                    border: "1.5px solid currentColor",
                                  }}
                                >
                                  Board Score: {scoreVal} / 20 PTS
                                </span>
                              </div>

                              {item.guesses && item.guesses.some((g) => g) ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.7rem" }}>
                                  {item.guesses.map((g, gIdx) => (
                                    <div key={gIdx} style={{ fontSize: "0.88rem", fontWeight: 700, padding: "0.3rem 0.6rem", background: "#ffffff", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                                      Guess #{gIdx + 1}: {g || "(blank)"}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p style={{ fontSize: "0.85rem", color: "#64748b", fontStyle: "italic", margin: "0 0 0.7rem 0" }}>
                                  Live Stage Dart Throw (No digital text guesses)
                                </p>
                              )}

                              <div>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", display: "block", marginBottom: "0.3rem" }}>
                                  AWARD BOARD POINTS (20 PTS MAX):
                                </span>
                                <div className="eval-pill-group">
                                  {[0, 5, 10, 15, 20].map((pts) => (
                                    <button
                                      key={pts}
                                      type="button"
                                      className={`eval-score-btn ${scoreVal === pts ? (pts > 0 ? "is-selected" : "is-selected-zero") : ""}`}
                                      onClick={() => handleOfflineScoreChange(idx, pts)}
                                    >
                                      {pts} PTS
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 1D: QUICK OVERRIDE TILES (ALL 6 GAMES)                                */}
              {/* ========================================================================= */}
              {evaluatorGameTab === "quickTiles" && (
                <div>
                  <p style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "1rem" }}>
                    Direct numerical scoring tiles for all 6 challenges. Enter any custom score (0–100) or tap quick presets.
                  </p>
                  {activeScoringTeamData ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
                      {/* 1. Greener Grass */}
                      <div className="admin-card-item">
                        <div className="admin-card-item-header">
                          <strong>
                            <FontAwesomeIcon icon={faLeaf} style={{ color: "var(--c-grass)", marginRight: "0.4rem" }} />
                            Greener Grass
                          </strong>
                          <span style={{ fontWeight: 900 }}>{activeScoringTeamData.greenerGrass}/100 PTS</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="admin-score-input"
                            value={overrideData[activeScoringTeamData.name]?.greenerGrass ?? activeScoringTeamData.greenerGrass}
                            onChange={(e) => handleScoreChange(activeScoringTeamData.name, "greenerGrass", e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-action btn-gold"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}
                            onClick={() => handleSaveScore(activeScoringTeamData.name, "greenerGrass")}
                          >
                            Award Score
                          </button>
                        </div>
                      </div>

                      {/* 2. Real Headline */}
                      <div className="admin-card-item">
                        <div className="admin-card-item-header">
                          <strong>
                            <FontAwesomeIcon icon={faNewspaper} style={{ color: "var(--c-sun)", marginRight: "0.4rem" }} />
                            Real Headline or Not
                          </strong>
                          <span style={{ fontWeight: 900 }}>{activeScoringTeamData.realHeadline}/100 PTS</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="admin-score-input"
                            value={overrideData[activeScoringTeamData.name]?.realHeadline ?? activeScoringTeamData.realHeadline}
                            onChange={(e) => handleScoreChange(activeScoringTeamData.name, "realHeadline", e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-action btn-gold"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}
                            onClick={() => handleSaveScore(activeScoringTeamData.name, "realHeadline")}
                          >
                            Award Score
                          </button>
                        </div>
                      </div>

                      {/* 3. Name That Tune */}
                      <div className="admin-card-item">
                        <div className="admin-card-item-header">
                          <strong>
                            <FontAwesomeIcon icon={faMusic} style={{ color: "var(--c-sky)", marginRight: "0.4rem" }} />
                            Name That Tune
                          </strong>
                          <span style={{ fontWeight: 900 }}>{activeScoringTeamData.nameThatTune}/100 PTS</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="admin-score-input"
                            value={overrideData[activeScoringTeamData.name]?.nameThatTune ?? activeScoringTeamData.nameThatTune}
                            onChange={(e) => handleScoreChange(activeScoringTeamData.name, "nameThatTune", e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-action btn-gold"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}
                            onClick={() => handleSaveScore(activeScoringTeamData.name, "nameThatTune")}
                          >
                            Award Score
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-paper)" }}>Presets:</span>
                          {[20, 40, 60, 80, 100].map((pts) => (
                            <button
                              key={pts}
                              type="button"
                              className="admin-quick-score-btn"
                              onClick={() => handleQuickAward(activeScoringTeamData.name, "nameThatTune", pts)}
                            >
                              {pts}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 4. Categories */}
                      <div className="admin-card-item">
                        <div className="admin-card-item-header">
                          <strong>
                            <FontAwesomeIcon icon={faLayerGroup} style={{ color: "var(--c-grape)", marginRight: "0.4rem" }} />
                            Categories (Scattergories)
                          </strong>
                          <span style={{ fontWeight: 900 }}>{activeScoringTeamData.categories}/100 PTS</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="admin-score-input"
                            value={overrideData[activeScoringTeamData.name]?.categories ?? activeScoringTeamData.categories}
                            onChange={(e) => handleScoreChange(activeScoringTeamData.name, "categories", e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-action btn-gold"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}
                            onClick={() => handleSaveScore(activeScoringTeamData.name, "categories")}
                          >
                            Award Score
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-paper)" }}>Presets:</span>
                          {[25, 50, 75, 90, 100].map((pts) => (
                            <button
                              key={pts}
                              type="button"
                              className="admin-quick-score-btn"
                              onClick={() => handleQuickAward(activeScoringTeamData.name, "categories", pts)}
                            >
                              {pts}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 5. Reverse Millionaire */}
                      <div className="admin-card-item">
                        <div className="admin-card-item-header">
                          <strong>
                            <FontAwesomeIcon icon={faCoins} style={{ color: "var(--c-coin)", marginRight: "0.4rem" }} />
                            Reverse Millionaire
                          </strong>
                          <span style={{ fontWeight: 900 }}>{activeScoringTeamData.reverseMillionaire}/100 PTS</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="admin-score-input"
                            value={overrideData[activeScoringTeamData.name]?.reverseMillionaire ?? activeScoringTeamData.reverseMillionaire}
                            onChange={(e) => handleScoreChange(activeScoringTeamData.name, "reverseMillionaire", e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-action btn-gold"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}
                            onClick={() => handleSaveScore(activeScoringTeamData.name, "reverseMillionaire")}
                          >
                            Award Score
                          </button>
                        </div>
                      </div>

                      {/* 6. Bullseye Arena */}
                      <div className="admin-card-item">
                        <div className="admin-card-item-header">
                          <strong>
                            <FontAwesomeIcon icon={faBullseye} style={{ color: "var(--c-cherry)", marginRight: "0.4rem" }} />
                            Bullseye: Darts & Archery
                          </strong>
                          <span style={{ fontWeight: 900 }}>{activeScoringTeamData.offlineGame}/100 PTS</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="admin-score-input"
                            value={overrideData[activeScoringTeamData.name]?.offlineGame ?? activeScoringTeamData.offlineGame}
                            onChange={(e) => handleScoreChange(activeScoringTeamData.name, "offlineGame", e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-action btn-gold"
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}
                            onClick={() => handleSaveScore(activeScoringTeamData.name, "offlineGame")}
                          >
                            Award Score
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-paper)" }}>Boards:</span>
                          {[20, 40, 60, 80, 100].map((pts) => (
                            <button
                              key={pts}
                              type="button"
                              className="admin-quick-score-btn"
                              onClick={() => handleQuickAward(activeScoringTeamData.name, "offlineGame", pts)}
                            >
                              {pts}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>No team selected.</p>
                  )}
                </div>
              )}
            </div>

            {/* Master Score Matrix */}
            <div className="admin-section">
              <span className="admin-badge">SCORE MATRIX</span>
              <h3 className="admin-section-title">
                <FontAwesomeIcon icon={faChartColumn} style={{ marginRight: "0.5rem" }} />
                Tournament Master Score Matrix (All Teams)
              </h3>
              <p className="admin-section-sub">
                Edit any cell to adjust scores live. Click Award / Enter to save to the persistent database.
              </p>

              <div className="admin-table-wrap">
                <table className="admin-matrix-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: "140px" }}>Team</th>
                      <th>Greener Grass</th>
                      <th>Headline</th>
                      <th>Name Tune</th>
                      <th>Categories</th>
                      <th>Millionaire</th>
                      <th>Bullseye</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((t) => {
                      const isStageTeam = t.name === currentActiveTeam;
                      const teamOverrides = overrideData[t.name] || {};
                      const grassVal = teamOverrides.greenerGrass ?? t.greenerGrass;
                      const headVal = teamOverrides.realHeadline ?? t.realHeadline;
                      const tuneVal = teamOverrides.nameThatTune ?? t.nameThatTune;
                      const catVal = teamOverrides.categories ?? t.categories;
                      const milVal = teamOverrides.reverseMillionaire ?? t.reverseMillionaire;
                      const offVal = teamOverrides.offlineGame ?? t.offlineGame;
                      const currentTotal = grassVal + headVal + tuneVal + catVal + milVal + offVal;

                      return (
                        <tr key={t.name} style={{ background: isStageTeam ? "#fefce8" : "#ffffff" }}>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
                              <strong>{t.name}</strong>
                              {isStageTeam ? (
                                <span className="admin-stage-badge" style={{ background: "var(--c-sun)", color: "var(--ink)", border: "1px solid var(--ink)" }}>
                                  👑 ON STAGE
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSelectActiveTeam(t.name)}
                                  style={{
                                    background: "#fff",
                                    border: "1.5px solid var(--ink)",
                                    borderRadius: "6px",
                                    padding: "0.15rem 0.5rem",
                                    fontSize: "0.72rem",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    color: "var(--ink)",
                                    boxShadow: "1px 1px 0 var(--ink)",
                                    whiteSpace: "nowrap",
                                  }}
                                  title="Make this team active on stage"
                                >
                                  Make Stage Active
                                </button>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="admin-score-input"
                                value={grassVal}
                                onChange={(e) => handleScoreChange(t.name, "greenerGrass", e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleUnlock(t.name, "greenerGrass", isGamePlayed(t, "greenerGrass"))}
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  padding: "0.15rem 0.35rem",
                                  borderRadius: "4px",
                                  border: isGamePlayed(t, "greenerGrass") ? "1px solid #16a34a" : "1px dashed #94a3b8",
                                  background: isGamePlayed(t, "greenerGrass") ? "#dcfce7" : "#f1f5f9",
                                  color: isGamePlayed(t, "greenerGrass") ? "#15803d" : "#64748b",
                                  cursor: "pointer",
                                }}
                                title={isGamePlayed(t, "greenerGrass") ? "Click to unlock replay" : "Click to mark as played"}
                              >
                                {isGamePlayed(t, "greenerGrass") ? "✓ Played" : "○ Ready"}
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="admin-score-input"
                                value={headVal}
                                onChange={(e) => handleScoreChange(t.name, "realHeadline", e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleUnlock(t.name, "realHeadline", isGamePlayed(t, "realHeadline"))}
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  padding: "0.15rem 0.35rem",
                                  borderRadius: "4px",
                                  border: isGamePlayed(t, "realHeadline") ? "1px solid #16a34a" : "1px dashed #94a3b8",
                                  background: isGamePlayed(t, "realHeadline") ? "#dcfce7" : "#f1f5f9",
                                  color: isGamePlayed(t, "realHeadline") ? "#15803d" : "#64748b",
                                  cursor: "pointer",
                                }}
                                title={isGamePlayed(t, "realHeadline") ? "Click to unlock replay" : "Click to mark as played"}
                              >
                                {isGamePlayed(t, "realHeadline") ? "✓ Played" : "○ Ready"}
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="admin-score-input"
                                value={tuneVal}
                                onChange={(e) => handleScoreChange(t.name, "nameThatTune", e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleUnlock(t.name, "nameThatTune", isGamePlayed(t, "nameThatTune"))}
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  padding: "0.15rem 0.35rem",
                                  borderRadius: "4px",
                                  border: isGamePlayed(t, "nameThatTune") ? "1px solid #16a34a" : "1px dashed #94a3b8",
                                  background: isGamePlayed(t, "nameThatTune") ? "#dcfce7" : "#f1f5f9",
                                  color: isGamePlayed(t, "nameThatTune") ? "#15803d" : "#64748b",
                                  cursor: "pointer",
                                }}
                                title={isGamePlayed(t, "nameThatTune") ? "Click to unlock replay" : "Click to mark as played"}
                              >
                                {isGamePlayed(t, "nameThatTune") ? "✓ Played" : "○ Ready"}
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="admin-score-input"
                                value={catVal}
                                onChange={(e) => handleScoreChange(t.name, "categories", e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleUnlock(t.name, "categories", isGamePlayed(t, "categories"))}
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  padding: "0.15rem 0.35rem",
                                  borderRadius: "4px",
                                  border: isGamePlayed(t, "categories") ? "1px solid #16a34a" : "1px dashed #94a3b8",
                                  background: isGamePlayed(t, "categories") ? "#dcfce7" : "#f1f5f9",
                                  color: isGamePlayed(t, "categories") ? "#15803d" : "#64748b",
                                  cursor: "pointer",
                                }}
                                title={isGamePlayed(t, "categories") ? "Click to unlock replay" : "Click to mark as played"}
                              >
                                {isGamePlayed(t, "categories") ? "✓ Played" : "○ Ready"}
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="admin-score-input"
                                value={milVal}
                                onChange={(e) => handleScoreChange(t.name, "reverseMillionaire", e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleUnlock(t.name, "reverseMillionaire", isGamePlayed(t, "reverseMillionaire"))}
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  padding: "0.15rem 0.35rem",
                                  borderRadius: "4px",
                                  border: isGamePlayed(t, "reverseMillionaire") ? "1px solid #16a34a" : "1px dashed #94a3b8",
                                  background: isGamePlayed(t, "reverseMillionaire") ? "#dcfce7" : "#f1f5f9",
                                  color: isGamePlayed(t, "reverseMillionaire") ? "#15803d" : "#64748b",
                                  cursor: "pointer",
                                }}
                                title={isGamePlayed(t, "reverseMillionaire") ? "Click to unlock replay" : "Click to mark as played"}
                              >
                                {isGamePlayed(t, "reverseMillionaire") ? "✓ Played" : "○ Ready"}
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="admin-score-input"
                                value={offVal}
                                onChange={(e) => handleScoreChange(t.name, "offlineGame", e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleUnlock(t.name, "offlineGame", isGamePlayed(t, "offlineGame"))}
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  padding: "0.15rem 0.35rem",
                                  borderRadius: "4px",
                                  border: isGamePlayed(t, "offlineGame") ? "1px solid #16a34a" : "1px dashed #94a3b8",
                                  background: isGamePlayed(t, "offlineGame") ? "#dcfce7" : "#f1f5f9",
                                  color: isGamePlayed(t, "offlineGame") ? "#15803d" : "#64748b",
                                  cursor: "pointer",
                                }}
                                title={isGamePlayed(t, "offlineGame") ? "Click to unlock replay" : "Click to mark as played"}
                              >
                                {isGamePlayed(t, "offlineGame") ? "✓ Played" : "○ Ready"}
                              </button>
                            </div>
                          </td>
                          <td className="admin-total-cell">
                            <strong>{currentTotal}</strong> / 600
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-action btn-gold"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                              onClick={async () => {
                                if (!adminPin) return;
                                sound.playSuccess();
                                await adminOverrideScore(adminPin, t.name, "greenerGrass", grassVal);
                                await adminOverrideScore(adminPin, t.name, "realHeadline", headVal);
                                await adminOverrideScore(adminPin, t.name, "nameThatTune", tuneVal);
                                await adminOverrideScore(adminPin, t.name, "categories", catVal);
                                await adminOverrideScore(adminPin, t.name, "reverseMillionaire", milVal);
                                await adminOverrideScore(adminPin, t.name, "offlineGame", offVal);
                                flashMessage(`All scores for "${t.name}" saved live!`);
                                onRefresh();
                              }}
                            >
                              Save All
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GAME CONTENT & QUESTIONS MANAGER                                  */}
        {/* ========================================================================= */}
        {mainTab === "content" && (
          <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.2rem" }}>
              <div>
                <span className="admin-badge">CUSTOM CONTENT ENGINE</span>
                <h3 className="admin-section-title">Edit Challenge Questions & Mappings</h3>
                <p className="admin-section-sub">
                  Change the questions, card topics, lyrics, and words. Changes update immediately across all participants.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={handleResetContent}
                  style={{ color: "#b91c1c", borderColor: "#b91c1c" }}
                >
                  <FontAwesomeIcon icon={faRotate} />
                  Restore Defaults
                </button>
                <button
                  type="button"
                  className="btn-action btn-gold"
                  disabled={isSavingContent}
                  onClick={() => handleSaveContentSection(contentSubTab)}
                  style={{ padding: "0.6rem 1.4rem" }}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {isSavingContent ? "SAVING..." : `Save ${contentSubTab.toUpperCase()}`}
                </button>
              </div>
            </div>

            {/* Game Subtabs */}
            <div className="admin-subtabs">
              <button
                type="button"
                className={`admin-subtab-btn ${contentSubTab === "categories" ? "is-active" : ""}`}
                onClick={() => setContentSubTab("categories")}
              >
                <FontAwesomeIcon icon={faLayerGroup} />
                Categories (52 Cards)
              </button>
              <button
                type="button"
                className={`admin-subtab-btn ${contentSubTab === "tunes" ? "is-active" : ""}`}
                onClick={() => setContentSubTab("tunes")}
              >
                <FontAwesomeIcon icon={faMusic} />
                Name That Tune ({gameContent.tunes.length} Songs)
              </button>
              <button
                type="button"
                className={`admin-subtab-btn ${contentSubTab === "headlines" ? "is-active" : ""}`}
                onClick={() => setContentSubTab("headlines")}
              >
                <FontAwesomeIcon icon={faNewspaper} />
                Headlines ({gameContent.headlines.length} News)
              </button>
              <button
                type="button"
                className={`admin-subtab-btn ${contentSubTab === "millionaire" ? "is-active" : ""}`}
                onClick={() => setContentSubTab("millionaire")}
              >
                <FontAwesomeIcon icon={faCoins} />
                Millionaire ({gameContent.millionaire.length} Qs)
              </button>
              <button
                type="button"
                className={`admin-subtab-btn ${contentSubTab === "words" ? "is-active" : ""}`}
                onClick={() => setContentSubTab("words")}
              >
                <FontAwesomeIcon icon={faLeaf} />
                Greener Grass ({gameContent.words.length} Words)
              </button>
              <button
                type="button"
                className={`admin-subtab-btn ${contentSubTab === "bullseye" ? "is-active" : ""}`}
                onClick={() => setContentSubTab("bullseye")}
              >
                <FontAwesomeIcon icon={faBullseye} />
                Bullseye ({gameContent.bullseye.length} Categories)
              </button>
            </div>

            {/* SUB-PANEL 1: CATEGORIES (52 CARDS DECK MAPPING) */}
            {contentSubTab === "categories" && (
              <div>
                {/* Suit filter */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  {SUIT_FILTERS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      className={`admin-subtab-btn ${suitFilter === s.key ? "is-active" : ""}`}
                      onClick={() => setSuitFilter(s.key)}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{s.symbol}</span>
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="admin-card-grid">
                  {gameContent.categories
                    .filter((c) => suitFilter === "all" || c.suit === suitFilter)
                    .map((card) => (
                      <div key={card.id} className="admin-card-item">
                        <div className="admin-card-item-header">
                          <span
                            className="admin-card-code"
                            style={{ color: card.color === "red" ? "#dc2626" : "var(--ink)" }}
                          >
                            {card.code} ({card.suit.toUpperCase()})
                          </span>
                          <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--muted-paper)" }}>
                            ID: {card.id}
                          </span>
                        </div>
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 800, display: "block", marginBottom: "0.2rem" }}>
                            Category Topic Name:
                          </label>
                          <input
                            type="text"
                            value={card.name}
                            onChange={(e) => handleCardTopicChange(card.id, e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 800, display: "block", marginBottom: "0.2rem" }}>
                            Hint / Examples:
                          </label>
                          <input
                            type="text"
                            value={card.hint}
                            onChange={(e) => handleCardHintChange(card.id, e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUB-PANEL 2: NAME THAT TUNE (SONGS & LYRICS) */}
            {contentSubTab === "tunes" && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <button type="button" className="btn-action btn-gold" onClick={handleAddTune}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Song Track
                  </button>
                </div>

                <div className="admin-items-list">
                  {gameContent.tunes.map((t, idx) => (
                    <div key={t.id || idx} className="admin-editor-card">
                      <div className="admin-editor-card-head">
                        <strong>Track #{idx + 1} — {t.song}</strong>
                        <button
                          type="button"
                          onClick={() => handleDeleteTune(idx)}
                          style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} /> Delete
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Song Title:</label>
                          <input
                            type="text"
                            value={t.song}
                            onChange={(e) => handleTuneChange(idx, "song", e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Artist:</label>
                          <input
                            type="text"
                            value={t.artist}
                            onChange={(e) => handleTuneChange(idx, "artist", e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Year:</label>
                          <input
                            type="number"
                            value={t.year}
                            onChange={(e) => handleTuneChange(idx, "year", parseInt(e.target.value, 10) || 2000)}
                            className="admin-input-sm"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Genre:</label>
                          <input
                            type="text"
                            value={t.genre}
                            onChange={(e) => handleTuneChange(idx, "genre", e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Single Lyric Snippet (Provided to players):</label>
                        <textarea
                          rows={2}
                          value={t.lyric}
                          onChange={(e) => handleTuneChange(idx, "lyric", e.target.value)}
                          className="admin-textarea"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PANEL 3: REAL HEADLINE OR NOT */}
            {contentSubTab === "headlines" && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <button type="button" className="btn-action btn-gold" onClick={handleAddHeadline}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Headline
                  </button>
                </div>

                <div className="admin-items-list">
                  {gameContent.headlines.map((h, idx) => (
                    <div key={h.id || idx} className="admin-editor-card">
                      <div className="admin-editor-card-head">
                        <div>
                          <strong>Headline #{idx + 1}</strong>
                          <button
                            type="button"
                            onClick={() => handleHeadlineChange(idx, "isReal", !h.isReal)}
                            style={{
                              marginLeft: "0.8rem",
                              padding: "0.2rem 0.6rem",
                              borderRadius: "999px",
                              border: "1.5px solid var(--ink)",
                              background: h.isReal ? "var(--c-grass)" : "var(--c-cherry)",
                              color: "#ffffff",
                              fontWeight: 900,
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            {h.isReal ? "✓ REAL WORLD NEWS" : "✕ SATIRE / FAKE"} (Click to Toggle)
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteHeadline(idx)}
                          style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} /> Delete
                        </button>
                      </div>

                      <div style={{ marginBottom: "0.75rem" }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Headline Text:</label>
                        <textarea
                          rows={2}
                          value={h.headline}
                          onChange={(e) => handleHeadlineChange(idx, "headline", e.target.value)}
                          className="admin-textarea"
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Outlet Hint (e.g. BBC News • London):</label>
                          <input
                            type="text"
                            value={h.outletHint}
                            onChange={(e) => handleHeadlineChange(idx, "outletHint", e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Source / Verification:</label>
                          <input
                            type="text"
                            value={h.source}
                            onChange={(e) => handleHeadlineChange(idx, "source", e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Truth/Satire Explanation:</label>
                        <textarea
                          rows={2}
                          value={h.explanation}
                          onChange={(e) => handleHeadlineChange(idx, "explanation", e.target.value)}
                          className="admin-textarea"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PANEL 4: REVERSE MILLIONAIRE */}
            {contentSubTab === "millionaire" && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <button type="button" className="btn-action btn-gold" onClick={handleAddMillionaire}>
                    <FontAwesomeIcon icon={faPlus} /> Add Trivia Question
                  </button>
                </div>

                <div className="admin-items-list">
                  {gameContent.millionaire.map((m, idx) => (
                    <div key={m.id || idx} className="admin-editor-card">
                      <div className="admin-editor-card-head">
                        <strong>Question #{idx + 1} — {m.category}</strong>
                        <button
                          type="button"
                          onClick={() => handleDeleteMillionaire(idx)}
                          style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} /> Delete
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Question Text:</label>
                          <textarea
                            rows={2}
                            value={m.question}
                            onChange={(e) => handleMillionaireChange(idx, "question", e.target.value)}
                            className="admin-textarea"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Category Badge:</label>
                          <input
                            type="text"
                            value={m.category}
                            onChange={(e) => handleMillionaireChange(idx, "category", e.target.value)}
                            className="admin-input-sm"
                          />
                          <label style={{ fontSize: "0.8rem", fontWeight: 800, marginTop: "0.5rem", display: "block" }}>
                            Safe Door (Correct Answer):
                          </label>
                          <select
                            value={m.correctIndex}
                            onChange={(e) => handleMillionaireChange(idx, "correctIndex", parseInt(e.target.value, 10))}
                            className="admin-input-sm"
                          >
                            <option value={0}>Option A</option>
                            <option value={1}>Option B</option>
                            <option value={2}>Option C</option>
                            <option value={3}>Option D</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        {(["A", "B", "C", "D"] as const).map((letter, optIdx) => (
                          <div key={letter}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>
                              Door {letter} {m.correctIndex === optIdx ? "★ SAFE DOOR" : ""}:
                            </label>
                            <input
                              type="text"
                              value={m.options[optIdx]}
                              onChange={(e) => handleMillionaireOptionChange(idx, optIdx, e.target.value)}
                              className="admin-input-sm"
                              style={{ borderColor: m.correctIndex === optIdx ? "var(--c-grass)" : "var(--ink)" }}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Answer Fact / Explanation:</label>
                        <textarea
                          rows={2}
                          value={m.explanation}
                          onChange={(e) => handleMillionaireChange(idx, "explanation", e.target.value)}
                          className="admin-textarea"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-PANEL 5: GREENER GRASS (5-LETTER TARGET WORDS) */}
            {contentSubTab === "words" && (
              <div>
                <p style={{ color: "var(--muted-paper)", fontSize: "0.95rem", marginBottom: "1rem", fontWeight: 600 }}>
                  Enter 5-letter secret words separated by commas or newlines. Players will guess these target words.
                </p>
                <textarea
                  rows={8}
                  value={gameContent.words.join(", ")}
                  onChange={(e) => handleWordsChange(e.target.value)}
                  className="admin-textarea"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", textTransform: "uppercase" }}
                />
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", fontWeight: 700 }}>
                  Total active target words: <strong>{gameContent.words.length}</strong>
                </p>
              </div>
            )}

            {/* SUB-PANEL 6: BULLSEYE (TARGET BOARDS CATEGORIES) */}
            {contentSubTab === "bullseye" && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <button type="button" className="btn-action btn-gold" onClick={handleAddBullseye}>
                    <FontAwesomeIcon icon={faPlus} /> Add Target Board Category
                  </button>
                </div>

                <div className="admin-items-list">
                  {gameContent.bullseye.map((b, idx) => (
                    <div key={b.id || idx} className="admin-editor-card">
                      <div className="admin-editor-card-head">
                        <strong>Target Category #{idx + 1} — {b.name}</strong>
                        <button
                          type="button"
                          onClick={() => handleDeleteBullseye(idx)}
                          style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} /> Delete
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Category Name:</label>
                          <input
                            type="text"
                            value={b.name}
                            onChange={(e) => handleBullseyeChange(idx, "name", e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Hint for Target Board:</label>
                          <input
                            type="text"
                            value={b.hint}
                            onChange={(e) => handleBullseyeChange(idx, "hint", e.target.value)}
                            className="admin-input-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.8rem", fontWeight: 800 }}>Example Answers (Comma-separated):</label>
                        <input
                          type="text"
                          value={b.examples.join(", ")}
                          onChange={(e) =>
                            handleBullseyeChange(
                              idx,
                              "examples",
                              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                            )
                          }
                          className="admin-input-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ROSTER & TOURNAMENT RESET                                         */}
        {/* ========================================================================= */}
        {mainTab === "roster" && (
          <div>
            <div className="admin-grid-2">
              {/* Active Stage Team Director */}
              <div className="admin-section">
                <span className="admin-badge">STAGE DIRECTOR</span>
                <h3 className="admin-section-title">Select Active Team on Stage</h3>
                <p className="admin-section-sub">
                  Dictates which participant is currently live in the arena and accumulating game points.
                </p>

                <div className="admin-team-chips">
                  {teams.map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      className={`admin-team-chip ${t.name === currentActiveTeam ? "is-active" : ""}`}
                      onClick={() => handleSelectActiveTeam(t.name)}
                    >
                      {t.name}
                      {t.name === currentActiveTeam && (
                        <FontAwesomeIcon icon={faCrown} style={{ marginLeft: "0.4rem", color: "var(--ink)" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Team Panel */}
              <div className="admin-section">
                <span className="admin-badge">ROSTER MANAGER</span>
                <h3 className="admin-section-title">Register New Team / Player</h3>
                <p className="admin-section-sub">
                  Add customized team names directly to the persistent tournament roster.
                </p>

                <form onSubmit={handleAddTeam} className="admin-add-form">
                  <input
                    type="text"
                    placeholder="e.g. Phoenix, Team Titan..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="admin-text-input"
                  />
                  <button
                    type="submit"
                    className="btn-action btn-gold"
                    disabled={!newTeamName.trim()}
                    style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem", fontWeight: 900 }}
                  >
                    + ADD
                  </button>
                </form>
              </div>
            </div>

            {/* Game Plays & Replays Management */}
            <div className="admin-section" style={{ marginTop: "1.5rem" }}>
              <span className="admin-badge">GAME PLAYS & REPLAY ACCESS</span>
              <h3 className="admin-section-title">Remove a Play for Any Team / Game</h3>
              <p className="admin-section-sub">
                Click on any played game below to remove the play, unlock replay access for that team, and clear previous submissions for that game.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                {teams.map((t) => (
                  <div
                    key={t.name}
                    style={{
                      background: "#f8fafc",
                      border: "2px solid var(--ink)",
                      borderRadius: "12px",
                      padding: "0.85rem 1.1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "1rem", color: "var(--ink)" }}>{t.name}</strong>
                      <span style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                        {t.playedGames?.length || 0} / 6 Games Played
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                      {[
                        { key: "greenerGrass", label: "Wordle" },
                        { key: "realHeadline", label: "Real Headline" },
                        { key: "nameThatTune", label: "Name That Tune" },
                        { key: "categories", label: "Categories" },
                        { key: "reverseMillionaire", label: "Rev. Millionaire" },
                        { key: "offlineGame", label: "Bullseye" },
                      ].map((g) => {
                        const played = isGamePlayed(t, g.key);
                        return (
                          <button
                            key={g.key}
                            type="button"
                            onClick={() => handleToggleUnlock(t.name, g.key, played, true)}
                            style={{
                              padding: "0.4rem 0.8rem",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: 800,
                              fontFamily: "var(--font-mono)",
                              cursor: "pointer",
                              border: played ? "2px solid #dc2626" : "1.5px dashed #cbd5e1",
                              background: played ? "#fee2e2" : "#ffffff",
                              color: played ? "#991b1b" : "#64748b",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              transition: "all 0.15s ease",
                            }}
                            title={played ? `Click to remove play for ${g.label} on ${t.name}` : `Click to mark ${g.label} as played on ${t.name}`}
                          >
                            {played ? (
                              <>
                                <FontAwesomeIcon icon={faTrashCan} />
                                {g.label} (Played • Click to Remove)
                              </>
                            ) : (
                              <>
                                <span style={{ opacity: 0.5 }}>○</span>
                                {g.label} (Not Played)
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Deletion Management */}
            <div className="admin-section" style={{ marginTop: "1.5rem" }}>
              <span className="admin-badge">TEAM ROSTER MANAGEMENT</span>
              <h3 className="admin-section-title">Remove Specific Team</h3>
              <p className="admin-section-sub">
                Permanently delete a team and their records from the tournament database.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                {teams.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setDeleteTargetTeam(t.name)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "8px",
                      border: "1.5px solid #dc2626",
                      background: "#fee2e2",
                      color: "#991b1b",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                    Delete {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Danger Zone: Full Reset & Wipeout */}
            <div className="admin-reset-box" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h4 style={{ margin: 0, color: "#991b1b", fontSize: "1.1rem", fontWeight: 900 }}>
                    RESET ALL SCORES TO ZERO
                  </h4>
                  <p style={{ margin: "0.3rem 0 0", color: "#7f1d1d", fontSize: "0.88rem" }}>
                    Keeps all registered team names on the roster, but resets every score back to 0.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResetMode("scoresOnly");
                    setShowResetConfirm(true);
                  }}
                  style={{
                    background: "var(--c-sun, #f5af19)",
                    color: "var(--ink)",
                    border: "2px solid var(--ink)",
                    boxShadow: "3px 3px 0 var(--ink)",
                    borderRadius: "10px",
                    padding: "0.65rem 1.2rem",
                    fontWeight: 900,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  RESET SCORES ONLY
                </button>
              </div>

              <div style={{ height: "1px", background: "#fca5a5", margin: "0.4rem 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h4 style={{ margin: 0, color: "#991b1b", fontSize: "1.1rem", fontWeight: 900 }}>
                    DANGER: WIPE ALL TEAMS & CLEAR ROSTER
                  </h4>
                  <p style={{ margin: "0.3rem 0 0", color: "#7f1d1d", fontSize: "0.88rem" }}>
                    Completely deletes all participants, teams, and scores from the database (empty tournament).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResetMode("wipeAll");
                    setShowResetConfirm(true);
                  }}
                  style={{
                    background: "#b91c1c",
                    color: "#ffffff",
                    border: "2px solid #7f1d1d",
                    boxShadow: "3px 3px 0 #7f1d1d",
                    borderRadius: "10px",
                    padding: "0.65rem 1.2rem",
                    fontWeight: 900,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  WIPE ALL TEAMS & ROSTER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetTeam && (
          <div className="tourney-modal" role="dialog" aria-modal="true">
            <div className="modal-card">
              <h2 style={{ color: "#b91c1c" }}>Delete Team "{deleteTargetTeam}"?</h2>
              <p>This action cannot be undone. All scores for this team will be permanently deleted.</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button type="button" className="btn-secondary-sm" onClick={() => setDeleteTargetTeam(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-action"
                  style={{ background: "#b91c1c", color: "#fff", borderColor: "#7f1d1d" }}
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete Team
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="tourney-modal" role="dialog" aria-modal="true">
            <div className="modal-card">
              <h2 style={{ color: "#b91c1c" }}>
                {resetMode === "wipeAll" ? "Wipe All Teams & Roster?" : "Reset All Scores to 0?"}
              </h2>
              <p>
                {resetMode === "wipeAll"
                  ? "Are you sure? This will permanently delete every participant, team, and score from the database."
                  : "Are you sure? All registered team names will be preserved, but their scores across all 6 games will reset to 0."}
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button type="button" className="btn-secondary-sm" onClick={() => setShowResetConfirm(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-action"
                  style={{ background: "#b91c1c", color: "#fff", borderColor: "#7f1d1d" }}
                  onClick={handleConfirmReset}
                >
                  {resetMode === "wipeAll" ? "Yes, Wipe All Teams" : "Yes, Reset Scores"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
