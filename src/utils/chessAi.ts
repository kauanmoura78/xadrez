import { Chess, Move, Square } from 'chess.js';
import { Bot, HintMove } from '../types/chess';

// Piece values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece square tables (PST) from White's perspective (8x8 array)
// Row 0 is 8th rank, Row 7 is 1st rank
const PAWN_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 27, 27, 10,  5,  5],
  [0,  0,  0, 25, 25,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_PST = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_PST = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_PST = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];

const QUEEN_PST = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

const KING_MIDGAME_PST = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-20,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

function getSquareCoords(square: string): { r: number; c: number } {
  const col = square.charCodeAt(0) - 97; // 'a' -> 0
  const row = 8 - parseInt(square[1], 10); // '8' -> 0, '1' -> 7
  return { r: row, c: col };
}

// Position evaluation in centipawns from White's perspective
export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -100000 : 100000;
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
    return 0;
  }

  let whiteScore = 0;
  let blackScore = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const type = piece.type;
      const isWhite = piece.color === 'w';
      const val = PIECE_VALUES[type] || 0;

      // PST table calculation
      let pstVal = 0;
      const pr = isWhite ? r : 7 - r;
      const pc = c;

      if (type === 'p') pstVal = PAWN_PST[pr][pc];
      else if (type === 'n') pstVal = KNIGHT_PST[pr][pc];
      else if (type === 'b') pstVal = BISHOP_PST[pr][pc];
      else if (type === 'r') pstVal = ROOK_PST[pr][pc];
      else if (type === 'q') pstVal = QUEEN_PST[pr][pc];
      else if (type === 'k') pstVal = KING_MIDGAME_PST[pr][pc];

      if (isWhite) {
        whiteScore += val + pstVal;
      } else {
        blackScore += val + pstVal;
      }
    }
  }

  // Turn bonus (mobility)
  const mobility = chess.moves().length * 8;
  if (chess.turn() === 'w') {
    whiteScore += mobility;
  } else {
    blackScore += mobility;
  }

  return whiteScore - blackScore;
}

// Minimax with Alpha-Beta Pruning
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = chess.moves({ verbose: true });
  // Move ordering: prioritize captures and checks
  moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    if (b.captured) scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    if (a.san.includes('+')) scoreA += 50;
    if (b.san.includes('+')) scoreB += 50;
    return scoreB - scoreA;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Prune
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Prune
    }
    return minEval;
  }
}

// Bot move selection based on bot level and personality
export function getBotMove(chess: Chess, bot: Bot): Move | null {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  const isWhite = chess.turn() === 'w';

  // Blunder simulation based on bot rating
  if (Math.random() < bot.blunderChance) {
    // If blunder happens, intentionally pick a suboptimal or random move
    const randomIdx = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIdx];
  }

  // Nelson's Queen obsession playstyle
  if (bot.queenAggression) {
    const queenMoves = legalMoves.filter(m => m.piece === 'q');
    // Nelson prefers queen checks, captures, or advances
    if (queenMoves.length > 0 && Math.random() < 0.65) {
      // Prioritize capture or check with queen
      const aggressiveQueenMoves = queenMoves.filter(m => m.captured || m.san.includes('+'));
      if (aggressiveQueenMoves.length > 0) {
        return aggressiveQueenMoves[Math.floor(Math.random() * aggressiveQueenMoves.length)];
      }
      return queenMoves[Math.floor(Math.random() * queenMoves.length)];
    }
  }

  let bestMove: Move = legalMoves[0];
  let bestEval = isWhite ? -Infinity : Infinity;

  // Search through legal moves
  for (const move of legalMoves) {
    chess.move(move);
    const score = minimax(chess, bot.depth - 1, -Infinity, Infinity, !isWhite);
    chess.undo();

    if (isWhite) {
      if (score > bestEval) {
        bestEval = score;
        bestMove = move;
      }
    } else {
      if (score < bestEval) {
        bestEval = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

// Hint calculation for human player
export function getBestMoveHint(chess: Chess): HintMove | null {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  const isWhite = chess.turn() === 'w';
  let bestMove: Move = legalMoves[0];
  let bestEval = isWhite ? -Infinity : Infinity;

  for (const move of legalMoves) {
    chess.move(move);
    const score = minimax(chess, 2, -Infinity, Infinity, !isWhite);
    chess.undo();

    if (isWhite) {
      if (score > bestEval) {
        bestEval = score;
        bestMove = move;
      }
    } else {
      if (score < bestEval) {
        bestEval = score;
        bestMove = move;
      }
    }
  }

  // Generate tactical coaching explanation
  let explanation = `Jogue ${bestMove.san} para melhorar a posição.`;
  if (bestMove.captured) {
    const pieceNames: Record<string, string> = {
      p: 'o peão', n: 'o cavalo', b: 'o bispo', r: 'a torre', q: 'a dama'
    };
    explanation = `Capture ${pieceNames[bestMove.captured] || 'a peça'} em ${bestMove.to} ganhando material valioso!`;
  } else if (bestMove.san.includes('+')) {
    explanation = `Aplique xeque em ${bestMove.to} forçando o rei adversário a se mover e perder tempos.`;
  } else if (bestMove.san.includes('O-O')) {
    explanation = `Faça o roque para colocar seu rei em total segurança e ativar sua torre.`;
  } else if (bestMove.piece === 'n') {
    explanation = `Desenvolva seu cavalo para ${bestMove.to}, controlando casas centrais importantes.`;
  } else if (bestMove.piece === 'b') {
    explanation = `Ative seu bispo em ${bestMove.to} apontando para as diagonais chave do tabuleiro.`;
  } else if (bestMove.piece === 'p' && (bestMove.to.endsWith('4') || bestMove.to.endsWith('5'))) {
    explanation = `Avance o peão em direção ao centro para disputar o espaço e abrir linhas.`;
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    san: bestMove.san,
    explanation,
  };
}
