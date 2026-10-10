import React from 'react';
import { RotateCcw, Lightbulb, Flag, Handshake, Volume2, VolumeX, Shuffle, Palette, Settings } from 'lucide-react';
import { BoardTheme } from '../types/chess';

interface GameControlsProps {
  onTakeback: () => void;
  onHint: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onFlipBoard: () => void;
  onNewGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentTheme: BoardTheme;
  onChangeTheme: (theme: BoardTheme) => void;
  showLegalMoves: boolean;
  onToggleLegalMoves: () => void;
  showEvalBar: boolean;
  onToggleEvalBar: () => void;
  disabled?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onTakeback,
  onHint,
  onResign,
  onOfferDraw,
  onFlipBoard,
  onNewGame,
  soundEnabled,
  onToggleSound,
  currentTheme,
  onChangeTheme,
  showLegalMoves,
  onToggleLegalMoves,
  showEvalBar,
  onToggleEvalBar,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2.5 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onTakeback}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Desfazer o último lance"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Voltar Lance</span>
        </button>

        <button
          onClick={onHint}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Receber uma dica do melhor lance"
        >
          <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
          <span>Pedir Dica</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOfferDraw}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Propor empate ao bot"
        >
          <Handshake className="w-3.5 h-3.5 text-sky-400" />
          <span>Propor Empate</span>
        </button>

        <button
          onClick={onResign}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-transparent hover:border-rose-900/40"
          title="Abandonar a partida"
        >
          <Flag className="w-3.5 h-3.5 text-rose-400" />
          <span>Abandonar</span>
        </button>
      </div>

      {/* Secondary Quick Toggles & Board Settings */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1">
          <button
            onClick={onFlipBoard}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Girar Tabuleiro"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title={soundEnabled ? 'Silenciar Sons' : 'Ativar Sons'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>

        {/* Board theme selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-500">Tema:</span>
          {(['green', 'wood', 'neo', 'charcoal'] as BoardTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTheme(t)}
              className={`w-4 h-4 rounded-full border transition-transform ${
                currentTheme === t ? 'scale-125 ring-2 ring-emerald-400' : 'opacity-70 hover:opacity-100'
              } ${
                t === 'green'
                  ? 'bg-[#769656] border-[#eeeed2]'
                  : t === 'wood'
                  ? 'bg-[#b58863] border-[#f0d9b5]'
                  : t === 'neo'
                  ? 'bg-[#4b7399] border-[#eae9d2]'
                  : 'bg-[#475569] border-[#e2e8f0]'
              }`}
              title={`Tema ${t}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
