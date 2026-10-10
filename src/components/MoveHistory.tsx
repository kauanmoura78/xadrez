import React, { useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { renderPiece } from '../utils/chessPieces';

interface MoveHistoryProps {
  history: string[]; // array of SAN moves: ['e4', 'e5', 'Nf3', ...]
  game: Chess;
  playerColor: 'white' | 'black';
  botName: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  history,
  game,
  playerColor,
  botName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest move
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length]);

  // Group moves into pairs (e.g. 1. e4 e5)
  const movePairs: { num: number; white: string; black?: string }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1],
    });
  }

  // Calculate captured pieces & material difference
  // Standard starting pieces count
  const initialCounts: Record<string, number> = {
    p: 8, n: 2, b: 2, r: 2, q: 1,
  };

  const pieceValues: Record<string, number> = {
    p: 1, n: 3, b: 3, r: 5, q: 9,
  };

  const currentBoard = game.board();
  const whiteOnBoard: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
  const blackOnBoard: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  let whiteMaterial = 0;
  let blackMaterial = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = currentBoard[r][c];
      if (p && p.type !== 'k') {
        if (p.color === 'w') {
          whiteOnBoard[p.type] = (whiteOnBoard[p.type] || 0) + 1;
          whiteMaterial += pieceValues[p.type] || 0;
        } else {
          blackOnBoard[p.type] = (blackOnBoard[p.type] || 0) + 1;
          blackMaterial += pieceValues[p.type] || 0;
        }
      }
    }
  }

  // Captured by White = Black pieces missing
  const whiteCaptured: string[] = [];
  // Captured by Black = White pieces missing
  const blackCaptured: string[] = [];

  ['q', 'r', 'b', 'n', 'p'].forEach((type) => {
    const missingBlack = (initialCounts[type] || 0) - (blackOnBoard[type] || 0);
    for (let i = 0; i < missingBlack; i++) whiteCaptured.push(type);

    const missingWhite = (initialCounts[type] || 0) - (whiteOnBoard[type] || 0);
    for (let i = 0; i < missingWhite; i++) blackCaptured.push(type);
  });

  const materialDiff = whiteMaterial - blackMaterial;

  const handleCopyPGN = () => {
    const pgn = game.pgn() || history.join(' ');
    navigator.clipboard.writeText(pgn);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/80 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
        <span>Histórico de Lances</span>
        <button
          onClick={handleCopyPGN}
          className="text-[11px] text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          title="Copiar PGN da partida"
        >
          Copiar PGN
        </button>
      </div>

      {/* Captured pieces bar: Top (Opponent side) */}
      <div className="px-3 py-1.5 bg-zinc-900/60 border-b border-zinc-800/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {(playerColor === 'white' ? whiteCaptured : blackCaptured).map((type, idx) => (
            <div key={idx} className="w-4 h-4 shrink-0">
              {renderPiece(type, playerColor === 'white' ? 'b' : 'w')}
            </div>
          ))}
        </div>
        {((playerColor === 'white' && materialDiff > 0) || (playerColor === 'black' && materialDiff < 0)) && (
          <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0 ml-1">
            +{Math.abs(materialDiff)}
          </span>
        )}
      </div>

      {/* Scrollable Move List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-xs">
        {movePairs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-xs italic">
            Nenhum lance jogado ainda
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.num}
              className="grid grid-cols-6 py-1 px-2 rounded hover:bg-zinc-800/60 transition-colors items-center"
            >
              <span className="col-span-1 text-zinc-500 font-semibold">{pair.num}.</span>
              <span className="col-span-2 text-zinc-200 font-medium">{pair.white}</span>
              <span className="col-span-3 text-zinc-300">{pair.black || ''}</span>
            </div>
          ))
        )}
      </div>

      {/* Captured pieces bar: Bottom (Player side) */}
      <div className="px-3 py-1.5 bg-zinc-900/60 border-t border-zinc-800/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {(playerColor === 'white' ? blackCaptured : whiteCaptured).map((type, idx) => (
            <div key={idx} className="w-4 h-4 shrink-0">
              {renderPiece(type, playerColor === 'white' ? 'w' : 'b')}
            </div>
          ))}
        </div>
        {((playerColor === 'white' && materialDiff < 0) || (playerColor === 'black' && materialDiff > 0)) && (
          <span className="text-[11px] font-mono font-bold text-rose-400 shrink-0 ml-1">
            +{Math.abs(materialDiff)}
          </span>
        )}
      </div>
    </div>
  );
};
