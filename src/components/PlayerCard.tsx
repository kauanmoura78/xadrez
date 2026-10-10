import React from 'react';
import { User } from 'lucide-react';
import { getPlayerTitle } from '../utils/ratingSystem';

interface PlayerCardProps {
  rating: number;
  isPlayerTurn: boolean;
  playerColor: 'white' | 'black';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  rating,
  isPlayerTurn,
  playerColor,
}) => {
  const title = getPlayerTitle(rating);

  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
      {/* Player Avatar */}
      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shadow-sm shrink-0">
        <User className="w-5 h-5" />
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-zinc-100 truncate">Você</span>
          <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800/90 px-1.5 py-0.5 rounded border border-zinc-700/80">
            {playerColor === 'white' ? '⚪ Brancas' : '⚫ Pretas'}
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">({rating})</span>
          {isPlayerTurn && (
            <span className="text-[10px] font-bold text-emerald-400 ml-auto flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sua vez
            </span>
          )}
        </div>
        <p className="text-[11px] text-zinc-400 truncate mt-0.5">{title}</p>
      </div>
    </div>
  );
};
