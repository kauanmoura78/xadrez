import React, { useState, useEffect } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { BoardTheme, HintMove } from '../types/chess';
import { renderPiece } from '../utils/chessPieces';
import { WhiteQueen, WhiteRook, WhiteBishop, WhiteKnight, BlackQueen, BlackRook, BlackBishop, BlackKnight } from '../utils/chessPieces';

interface ChessBoardProps {
  game: Chess;
  onMove: (move: { from: string; to: string; promotion?: string }) => boolean;
  theme: BoardTheme;
  isFlipped: boolean;
  isPlayerTurn: boolean;
  playerColor: 'white' | 'black';
  showLegalMoves: boolean;
  lastMove: { from: string; to: string } | null;
  hint: HintMove | null;
  disabled?: boolean;
}

// Authentic Chess.com color palette matching user's uploaded screenshot
const THEME_COLORS: Record<BoardTheme, { light: string; dark: string; highlightLight: string; highlightDark: string; border: string }> = {
  green: {
    light: 'bg-[#ebecd0]',
    dark: 'bg-[#779556]',
    highlightLight: 'bg-[#f5f682]/90',
    highlightDark: 'bg-[#baca44]/90',
    border: 'border-[#282622]',
  },
  wood: {
    light: 'bg-[#f0d9b5]',
    dark: 'bg-[#b58863]',
    highlightLight: 'bg-[#ced26b]/85',
    highlightDark: 'bg-[#aaa23a]/90',
    border: 'border-[#3e2723]',
  },
  neo: {
    light: 'bg-[#eae9d2]',
    dark: 'bg-[#4b7399]',
    highlightLight: 'bg-[#9ae6b4]/85',
    highlightDark: 'bg-[#48bb78]/90',
    border: 'border-[#1e293b]',
  },
  charcoal: {
    light: 'bg-[#e2e8f0]',
    dark: 'bg-[#475569]',
    highlightLight: 'bg-[#cbd5e1]/85',
    highlightDark: 'bg-[#64748b]/90',
    border: 'border-[#18181b]',
  },
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  onMove,
  theme,
  isFlipped,
  isPlayerTurn,
  playerColor,
  showLegalMoves,
  lastMove,
  hint,
  disabled = false,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

  const colors = THEME_COLORS[theme] || THEME_COLORS.green;

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  useEffect(() => {
    setSelectedSquare(null);
    setValidMoves([]);
  }, [game.fen(), isPlayerTurn]);

  // Check if a move is a castling intent (supports clicking destination g1/c1 OR clicking rook h1/a1!)
  const resolveCastlingMove = (from: Square, to: Square): Square | null => {
    const piece = game.get(from);
    if (!piece) return null;

    // 1. King initiating castling by clicking or dragging to Rook or castling square
    if (piece.type === 'k') {
      const isWhite = piece.color === 'w';
      if (isWhite && from === 'e1') {
        // Kingside castle: target can be g1 OR h1
        if (to === 'g1' || to === 'h1') {
          const hasKingside = validMoves.some((m) => m.to === 'g1' && (m.flags.includes('k') || m.san.includes('O-O')));
          if (hasKingside) return 'g1' as Square;
        }
        // Queenside castle: target can be c1 OR a1
        if (to === 'c1' || to === 'a1') {
          const hasQueenside = validMoves.some((m) => m.to === 'c1' && (m.flags.includes('q') || m.san.includes('O-O-O')));
          if (hasQueenside) return 'c1' as Square;
        }
      } else if (!isWhite && from === 'e8') {
        // Black Kingside: g8 OR h8
        if (to === 'g8' || to === 'h8') {
          const hasKingside = validMoves.some((m) => m.to === 'g8' && (m.flags.includes('k') || m.san.includes('O-O')));
          if (hasKingside) return 'g8' as Square;
        }
        // Black Queenside: c8 OR a8
        if (to === 'c8' || to === 'a8') {
          const hasQueenside = validMoves.some((m) => m.to === 'c8' && (m.flags.includes('q') || m.san.includes('O-O-O')));
          if (hasQueenside) return 'c8' as Square;
        }
      }
    }

    // 2. Rook clicked first, then player clicks King to castle
    if (piece.type === 'r') {
      const isWhite = piece.color === 'w';
      if (isWhite && to === 'e1') {
        const kingMoves = game.moves({ square: 'e1', verbose: true });
        if (from === 'h1' && kingMoves.some((m) => m.to === 'g1')) return 'g1' as Square;
        if (from === 'a1' && kingMoves.some((m) => m.to === 'c1')) return 'c1' as Square;
      } else if (!isWhite && to === 'e8') {
        const kingMoves = game.moves({ square: 'e8', verbose: true });
        if (from === 'h8' && kingMoves.some((m) => m.to === 'g8')) return 'g8' as Square;
        if (from === 'a8' && kingMoves.some((m) => m.to === 'c8')) return 'c8' as Square;
      }
    }

    return null;
  };

  const handleSquareClick = (square: Square) => {
    if (disabled || !isPlayerTurn || pendingPromotion) return;

    if (selectedSquare) {
      // 1. Check if this is a castling move (supports clicking King then g1, King then Rook, or Rook then King)
      const castleTarget = resolveCastlingMove(selectedSquare, square);
      if (castleTarget) {
        const kingSquare = game.get(selectedSquare)?.type === 'k' ? selectedSquare : square;
        attemptMove(kingSquare, castleTarget);
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // 2. Standard valid move check
      const isTargetValid = validMoves.some((m) => m.to === square);
      if (isTargetValid) {
        attemptMove(selectedSquare, square);
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // 3. Deselect if clicking same square
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
    }

    // Try selecting piece on clicked square
    const piece = game.get(square);
    const expectedColor = playerColor === 'white' ? 'w' : 'b';

    if (piece && piece.color === expectedColor && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const attemptMove = (from: Square, to: Square) => {
    const piece = game.get(from);
    if (!piece) return;

    // Check pawn promotion
    const isPawn = piece.type === 'p';
    const isPromotionRank = (piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1');

    if (isPawn && isPromotionRank) {
      setPendingPromotion({ from, to });
      return;
    }

    onMove({ from, to });
  };

  const handlePromotionSelect = (promotionPiece: 'q' | 'r' | 'b' | 'n') => {
    if (!pendingPromotion) return;
    onMove({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: promotionPiece,
    });
    setPendingPromotion(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (disabled || !isPlayerTurn || pendingPromotion) {
      e.preventDefault();
      return;
    }
    const piece = game.get(square);
    const expectedColor = playerColor === 'white' ? 'w' : 'b';
    if (!piece || piece.color !== expectedColor || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setValidMoves(moves);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toSquare: Square) => {
    e.preventDefault();
    if (!draggedSquare) return;

    // Check castling drop
    const castleTarget = resolveCastlingMove(draggedSquare, toSquare);
    if (castleTarget) {
      const kingSquare = game.get(draggedSquare)?.type === 'k' ? draggedSquare : toSquare;
      attemptMove(kingSquare, castleTarget);
      setDraggedSquare(null);
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Standard drop check
    const isValid = validMoves.some((m) => m.to === toSquare);
    if (isValid) {
      attemptMove(draggedSquare, toSquare);
    }
    setDraggedSquare(null);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  // Checked king indicator
  const inCheck = game.inCheck();
  let checkedKingSquare: Square | null = null;
  if (inCheck) {
    const board = game.board();
    const currentTurn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === currentTurn) {
          checkedKingSquare = (files[c] + ranks[r]) as Square;
        }
      }
    }
  }

  // Castling indicators for the rooks when King is selected
  const isKingSelected = selectedSquare && game.get(selectedSquare)?.type === 'k';
  const hasKingsideCastle = isKingSelected && validMoves.some((m) => m.flags.includes('k') || m.san.includes('O-O'));
  const hasQueensideCastle = isKingSelected && validMoves.some((m) => m.flags.includes('q') || m.san.includes('O-O-O'));

  return (
    <div
      className={`relative w-full max-w-[540px] aspect-square rounded-md overflow-hidden select-none border-[5px] ${colors.border} shadow-[0_12px_36px_rgba(0,0,0,0.65)] bg-[#21201d]`}
    >
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {displayRanks.map((rank, rankIdx) =>
          displayFiles.map((file, fileIdx) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);

            const isLight = (file.charCodeAt(0) - 97 + parseInt(rank, 10)) % 2 !== 0;
            const defaultSquareColor = isLight ? colors.light : colors.dark;

            // Highlight states
            const isSelected = selectedSquare === square;
            const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
            const isCheckSquare = checkedKingSquare === square;
            const isHintSquare = hint && (hint.from === square || hint.to === square);

            // Compute background color
            let bgClass = defaultSquareColor;
            if (isLastMoveSquare) {
              bgClass = isLight ? colors.highlightLight : colors.highlightDark;
            }

            const validMove = validMoves.find((m) => m.to === square);
            const isCaptureTarget = validMove && (piece || validMove.flags.includes('e'));

            // Castling visual aid on Rook square
            const isCastleRookSquare =
              isKingSelected &&
              ((hasKingsideCastle && (square === 'h1' || square === 'h8')) ||
                (hasQueensideCastle && (square === 'a1' || square === 'a8')));

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-100 ${bgClass} ${
                  isSelected ? 'ring-inset ring-4 ring-[#baca44]' : ''
                } ${isHintSquare ? 'ring-inset ring-4 ring-emerald-400' : ''}`}
                style={
                  isCheckSquare
                    ? {
                        background:
                          'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.5) 65%, transparent 100%)',
                      }
                    : undefined
                }
              >
                {/* Coordinates in square corners matching Chess.com image */}
                {fileIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[11px] sm:text-xs font-bold select-none leading-none pointer-events-none ${
                      isLight ? 'text-[#779556]' : 'text-[#ebecd0]'
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {rankIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[11px] sm:text-xs font-bold select-none leading-none pointer-events-none ${
                      isLight ? 'text-[#779556]' : 'text-[#ebecd0]'
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Neo Vector Piece */}
                {piece && (
                  <div
                    draggable={isPlayerTurn && !disabled}
                    onDragStart={(e) => handleDragStart(e, square)}
                    className={`w-[88%] h-[88%] z-10 transition-transform active:scale-95 duration-75 ${
                      isPlayerTurn && piece.color === (playerColor === 'white' ? 'w' : 'b')
                        ? 'hover:scale-105'
                        : ''
                    }`}
                  >
                    {renderPiece(piece.type, piece.color)}
                  </div>
                )}

                {/* Legal Move Dot on empty squares */}
                {showLegalMoves && validMove && !isCaptureTarget && (
                  <div className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 bg-black/25 rounded-full z-20 pointer-events-none shadow-sm" />
                )}

                {/* Legal Capture Ring on enemy squares */}
                {showLegalMoves && isCaptureTarget && (
                  <div className="absolute inset-1 sm:inset-1.5 rounded-full border-[4.5px] border-black/25 z-20 pointer-events-none" />
                )}

                {/* Castling highlight ring on the Rook to show clicking the Rook also castles */}
                {showLegalMoves && isCastleRookSquare && (
                  <div
                    className="absolute inset-1 sm:inset-1.5 rounded-full border-[4px] border-[#81b64c] z-20 pointer-events-none animate-pulse"
                    title="Clique para rocar!"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#262522] border border-[#3d3a36] rounded-xl p-4 sm:p-5 shadow-2xl text-center max-w-xs w-full animate-in fade-in zoom-in-95 duration-150">
            <h4 className="text-sm font-bold text-white mb-1">Promoção do Peão</h4>
            <p className="text-xs text-zinc-400 mb-3">Escolha a peça promovida:</p>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handlePromotionSelect('q')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#312e2b] hover:bg-[#81b64c] transition-colors group cursor-pointer"
                title="Dama"
              >
                <div className="w-10 h-10 group-hover:scale-110 transition-transform">
                  {playerColor === 'white' ? <WhiteQueen /> : <BlackQueen />}
                </div>
                <span className="text-[11px] font-bold text-zinc-200 mt-1">Dama</span>
              </button>

              <button
                onClick={() => handlePromotionSelect('r')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#312e2b] hover:bg-[#81b64c] transition-colors group cursor-pointer"
                title="Torre"
              >
                <div className="w-10 h-10 group-hover:scale-110 transition-transform">
                  {playerColor === 'white' ? <WhiteRook /> : <BlackRook />}
                </div>
                <span className="text-[11px] font-bold text-zinc-200 mt-1">Torre</span>
              </button>

              <button
                onClick={() => handlePromotionSelect('b')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#312e2b] hover:bg-[#81b64c] transition-colors group cursor-pointer"
                title="Bispo"
              >
                <div className="w-10 h-10 group-hover:scale-110 transition-transform">
                  {playerColor === 'white' ? <WhiteBishop /> : <BlackBishop />}
                </div>
                <span className="text-[11px] font-bold text-zinc-200 mt-1">Bispo</span>
              </button>

              <button
                onClick={() => handlePromotionSelect('n')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#312e2b] hover:bg-[#81b64c] transition-colors group cursor-pointer"
                title="Cavalo"
              >
                <div className="w-10 h-10 group-hover:scale-110 transition-transform">
                  {playerColor === 'white' ? <WhiteKnight /> : <BlackKnight />}
                </div>
                <span className="text-[11px] font-bold text-zinc-200 mt-1">Cavalo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
