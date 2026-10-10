import React from 'react';
import { HintMove } from '../types/chess';
import { Lightbulb, Check, X } from 'lucide-react';

interface HintBoxProps {
  hint: HintMove | null;
  onApplyHint: () => void;
  onClose: () => void;
}

export const HintBox: React.FC<HintBoxProps> = ({ hint, onApplyHint, onClose }) => {
  if (!hint) return null;

  return (
    <div className="p-3 bg-zinc-850 border border-emerald-500/40 rounded-lg bg-zinc-900 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">Dica do Treinador: {hint.san}</span>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{hint.explanation}</p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={onApplyHint}
              className="py-1 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>Jogar este lance</span>
            </button>
            <button
              onClick={onClose}
              className="py-1 px-2 rounded text-zinc-400 hover:text-zinc-200 text-[11px] cursor-pointer"
            >
              Ignorar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
