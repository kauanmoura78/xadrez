import React from 'react';

interface EvalBarProps {
  scoreCentipawns: number; // positive = white advantage, negative = black advantage
  isFlipped: boolean; // true if playing black / flipped
}

export const EvalBar: React.FC<EvalBarProps> = ({ scoreCentipawns, isFlipped }) => {
  // Convert centipawns to percentage (0% = Black totally winning, 100% = White totally winning, 50% = equal)
  // Clamp between -1500 and +1500 centipawns (+-15 pawns)
  const isMate = Math.abs(scoreCentipawns) >= 50000;
  let displayScore = '0.0';

  if (isMate) {
    displayScore = scoreCentipawns > 0 ? '+M' : '-M';
  } else {
    const pawns = scoreCentipawns / 100;
    displayScore = (pawns > 0 ? '+' : '') + pawns.toFixed(1);
  }

  // Sigmoid-like scaling for responsive evaluation visual
  // 0 -> 50%
  // +300 -> ~75%
  // -300 -> ~25%
  let whitePercent = 50;
  if (isMate) {
    whitePercent = scoreCentipawns > 0 ? 98 : 2;
  } else {
    // Normal logistic transformation
    const clamped = Math.max(-1000, Math.min(1000, scoreCentipawns));
    whitePercent = 50 + (clamped / 1000) * 45;
  }

  // If flipped, invert bar so the player's side is at the bottom
  const fillHeight = isFlipped ? 100 - whitePercent : whitePercent;

  return (
    <div className="relative w-7 sm:w-8 h-full bg-zinc-900 border border-zinc-700/80 rounded-sm overflow-hidden flex flex-col justify-end select-none shrink-0 shadow-inner">
      {/* Top section (Black background if not flipped, White if flipped) */}
      <div
        className="w-full bg-zinc-900 transition-all duration-300 ease-out relative flex items-center justify-center"
        style={{ height: `${100 - fillHeight}%` }}
      >
        {!isFlipped && whitePercent < 50 && (
          <span className="text-[10px] font-mono font-bold text-zinc-300 transform -rotate-90 whitespace-nowrap">
            {displayScore}
          </span>
        )}
        {isFlipped && whitePercent > 50 && (
          <span className="text-[10px] font-mono font-bold text-zinc-300 transform -rotate-90 whitespace-nowrap">
            {displayScore}
          </span>
        )}
      </div>

      {/* Bottom section (White fill if not flipped) */}
      <div
        className="w-full bg-zinc-100 transition-all duration-300 ease-out relative flex items-center justify-center border-t border-zinc-400/50"
        style={{ height: `${fillHeight}%` }}
      >
        {!isFlipped && whitePercent >= 50 && (
          <span className="text-[10px] font-mono font-bold text-zinc-900 transform -rotate-90 whitespace-nowrap">
            {displayScore}
          </span>
        )}
        {isFlipped && whitePercent <= 50 && (
          <span className="text-[10px] font-mono font-bold text-zinc-900 transform -rotate-90 whitespace-nowrap">
            {displayScore}
          </span>
        )}
      </div>
    </div>
  );
};
