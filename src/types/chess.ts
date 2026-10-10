export type PieceColor = 'w' | 'b';
export type PlayerSide = 'white' | 'black' | 'random';

export type BotTier = 'beginner' | 'intermediate' | 'advanced' | 'master' | 'legendary';

export type BotDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'impossible';

export type BotCategory = 'all' | 'beginners' | 'intermediate' | 'advanced' | 'masters' | 'legendary' | 'cryptids';

export interface Bot {
  id: string;
  name: string;
  title?: string;
  rating: number;
  flag: string;
  difficulty: BotDifficulty;
  difficultyLabel: string;
  difficultyColor: string;
  category: BotCategory;
  categoryLabel: string;
  tier: BotTier;
  tierLabel: string;
  avatar: string;
  description: string;
  playstyle: string;
  depth: number;
  blunderChance: number;
  queenAggression?: boolean;
  dialogues: {
    start: string[];
    playerCheck: string[];
    botCheck: string[];
    playerBlunder: string[];
    botBlunder: string[];
    playerWin: string[];
    botWin: string[];
    draw: string[];
    thinking: string[];
  };
}

export interface PlayerStats {
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  highestRating: number;
  botProgress: Record<string, {
    defeated: boolean;
    wins: number;
    crowns: number; // 0-3
    bestWinDate?: string;
  }>;
}

export type BoardTheme = 'green' | 'wood' | 'neo' | 'charcoal';

export interface GameSettings {
  boardTheme: BoardTheme;
  soundEnabled: boolean;
  showLegalMoves: boolean;
  showEvalBar: boolean;
  autoFlip: boolean;
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  botId: string;
  botName: string;
  botRating: number;
  playerColor: 'white' | 'black';
  result: 'win' | 'loss' | 'draw';
  reason: string;
  ratingChange: number;
  newRating: number;
  moveCount: number;
  pgn: string;
}

export interface HintMove {
  from: string;
  to: string;
  san: string;
  explanation: string;
}
