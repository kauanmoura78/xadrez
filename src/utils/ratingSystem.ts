import { MatchHistoryItem, PlayerStats } from '../types/chess';
import { CHESS_BOTS } from '../data/bots';

const STATS_STORAGE_KEY = 'chessmaster_player_stats_v1';
const HISTORY_STORAGE_KEY = 'chessmaster_match_history_v1';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  rating: 1000,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  highestRating: 1000,
  botProgress: {},
};

export function loadPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') return INITIAL_PLAYER_STATS;
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_PLAYER_STATS,
        ...parsed,
        botProgress: parsed.botProgress || {},
      };
    }
  } catch (err) {
    console.error('Failed to load player stats', err);
  }
  return INITIAL_PLAYER_STATS;
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save player stats', err);
  }
}

export function loadMatchHistory(): MatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load match history', err);
  }
  return [];
}

export function saveMatchHistory(history: MatchHistoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 50))); // keep latest 50
  } catch (err) {
    console.error('Failed to save match history', err);
  }
}

/**
 * Calculates Elo rating change
 * @param playerRating current player Elo
 * @param botRating opponent bot Elo
 * @param result 'win' | 'loss' | 'draw'
 */
export function calculateEloDelta(
  playerRating: number,
  botRating: number,
  result: 'win' | 'loss' | 'draw'
): number {
  // K-factor: higher for newer/lower players to allow brisk climbing
  const k = playerRating < 1400 ? 32 : 24;
  const expectedScore = 1 / (1 + Math.pow(10, (botRating - playerRating) / 400));
  const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;

  const rawDelta = Math.round(k * (actualScore - expectedScore));

  // Minimum 1 point change for wins/losses
  if (result === 'win') return Math.max(rawDelta, 5);
  if (result === 'loss') return Math.min(rawDelta, -3);
  return rawDelta;
}

/**
 * Updates stats after a completed match
 */
export function recordMatchResult(params: {
  botId: string;
  botRating: number;
  result: 'win' | 'loss' | 'draw';
  usedAssistance: boolean; // true if hint or takeback was used
}): { newStats: PlayerStats; ratingDelta: number } {
  const currentStats = loadPlayerStats();
  const { botId, botRating, result, usedAssistance } = params;

  const delta = calculateEloDelta(currentStats.rating, botRating, result);
  const newRating = Math.max(100, currentStats.rating + delta);

  const prevBotProg = currentStats.botProgress[botId] || {
    defeated: false,
    wins: 0,
    crowns: 0,
  };

  let newWins = prevBotProg.wins + (result === 'win' ? 1 : 0);
  let isDefeated = prevBotProg.defeated || result === 'win';
  let crowns = prevBotProg.crowns;

  if (result === 'win') {
    if (crowns < 1) crowns = 1; // 1st win
    if (!usedAssistance && crowns < 2) crowns = 2; // win without hints/takebacks
    if (newWins >= 3 && crowns < 3) crowns = 3; // 3 wins mastery
  }

  const updatedStats: PlayerStats = {
    ...currentStats,
    rating: newRating,
    highestRating: Math.max(currentStats.highestRating, newRating),
    gamesPlayed: currentStats.gamesPlayed + 1,
    wins: currentStats.wins + (result === 'win' ? 1 : 0),
    losses: currentStats.losses + (result === 'loss' ? 1 : 0),
    draws: currentStats.draws + (result === 'draw' ? 1 : 0),
    botProgress: {
      ...currentStats.botProgress,
      [botId]: {
        defeated: isDefeated,
        wins: newWins,
        crowns,
        bestWinDate: result === 'win' ? new Date().toISOString() : prevBotProg.bestWinDate,
      },
    },
  };

  savePlayerStats(updatedStats);
  return { newStats: updatedStats, ratingDelta: delta };
}

export function getPlayerTitle(rating: number): string {
  if (rating < 600) return 'Iniciante Curioso';
  if (rating < 1000) return 'Praticante de Clube';
  if (rating < 1300) return 'Tático Astuto';
  if (rating < 1600) return 'Estrategista Intermediário';
  if (rating < 1900) return 'Candidato a Mestre';
  if (rating < 2200) return 'Mestre FIDE';
  if (rating < 2500) return 'Mestre Internacional';
  return 'Grande Mestre de Elite';
}
