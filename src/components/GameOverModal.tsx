import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Bot, MatchHistoryItem } from '../types/chess';
import { Trophy, RefreshCw, Users, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  bot: Bot;
  ratingDelta: number;
  newRating: number;
  botQuote: string;
  crownsEarned: number;
  onPlayAgain: () => void;
  onChangeBot: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  reason,
  bot,
  ratingDelta,
  newRating,
  botQuote,
  crownsEarned,
  onPlayAgain,
  onChangeBot,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && result === 'win') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  const isWin = result === 'win';
  const isLoss = result === 'loss';
  const isDraw = result === 'draw';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Result Icon & Title */}
        <div className="mb-4">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
              isWin
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : isLoss
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isWin ? (
              <Trophy className="w-8 h-8" />
            ) : isLoss ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <Award className="w-8 h-8" />
            )}
          </div>

          <h3 className="text-2xl font-black text-zinc-100 tracking-tight">
            {isWin ? 'Vitória!' : isLoss ? 'Derrota!' : 'Empate!'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">{reason}</p>
        </div>

        {/* Rating adjustment banner */}
        <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-3 mb-4 flex items-center justify-around">
          <div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Novo Elo</div>
            <div className="text-xl font-bold font-mono text-zinc-100">{newRating}</div>
          </div>

          <div className="h-8 w-px bg-zinc-700" />

          <div>
            <div className="text-[11px] text-zinc-400 uppercase font-semibold">Variação</div>
            <div
              className={`text-xl font-bold font-mono ${
                ratingDelta > 0
                  ? 'text-emerald-400'
                  : ratingDelta < 0
                  ? 'text-rose-400'
                  : 'text-zinc-400'
              }`}
            >
              {ratingDelta > 0 ? `+${ratingDelta}` : ratingDelta}
            </div>
          </div>

          {isWin && (
            <>
              <div className="h-8 w-px bg-zinc-700" />
              <div>
                <div className="text-[11px] text-zinc-400 uppercase font-semibold">Coroas</div>
                <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-0.5">
                  <span>👑</span>
                  <span>{crownsEarned}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bot commentary response */}
        <div className="bg-zinc-800/50 border border-zinc-750 rounded-xl p-3 mb-5 text-left flex items-start gap-3">
          <img
            src={bot.avatar}
            alt={bot.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-700"
          />
          <div>
            <div className="text-xs font-semibold text-zinc-300">{bot.name} disse:</div>
            <p className="text-xs text-zinc-400 italic mt-0.5">"{botQuote}"</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Jogar Novamente</span>
          </button>

          <button
            onClick={onChangeBot}
            className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>Outro Oponente</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          Revisar o tabuleiro final
        </button>
      </div>
    </div>
  );
};
