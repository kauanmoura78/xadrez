import React from 'react';
import { Swords } from 'lucide-react';

interface TopBarProps {
  onOpenBots: () => void;
  onOpenRanking: () => void;
  onOpenRules: () => void;
  onNewGame: () => void;
  playerRating: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenBots,
  onOpenRanking,
  onOpenRules,
  onNewGame,
  playerRating,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 bg-zinc-900 border-b border-zinc-800 shrink-0">
      {/* Zone 1: Brand title, one line */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
          ♞
        </div>
        <span className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-100">
          ChessMaster AI
        </span>
      </div>

      {/* Zone 2: 4 nav links, single-line text links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
        <button
          onClick={onNewGame}
          className="hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Partida
        </button>
        <button
          onClick={onOpenBots}
          className="hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Robôs de IA
        </button>
        <button
          onClick={onOpenRanking}
          className="hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <span>Ranking Elo</span>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
            {playerRating}
          </span>
        </button>
        <button
          onClick={onOpenRules}
          className="hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Regras
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenBots}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Escolher Bot</span>
        </button>
      </div>
    </header>
  );
};
