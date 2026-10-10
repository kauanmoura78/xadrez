import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Bot, BoardTheme, HintMove, MatchHistoryItem, PlayerSide, PlayerStats } from './types/chess';
import { CHESS_BOTS } from './data/bots';
import { soundEngine } from './utils/soundEngine';
import { evaluateBoard, getBotMove, getBestMoveHint } from './utils/chessAi';
import { loadPlayerStats, savePlayerStats, loadMatchHistory, saveMatchHistory, recordMatchResult } from './utils/ratingSystem';

import { ChesscomSidebar } from './components/ChesscomSidebar';
import { ChessBoard } from './components/ChessBoard';
import { EvalBar } from './components/EvalBar';
import { BotSelectionPanel } from './components/BotSelectionPanel';
import { BotSelector } from './components/BotSelector';
import { MoveHistory } from './components/MoveHistory';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { RulesModal } from './components/RulesModal';
import { HintBox } from './components/HintBox';
import { Settings, Sparkles, Trophy } from 'lucide-react';

export default function App() {
  // State
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [currentBot, setCurrentBot] = useState<Bot>(CHESS_BOTS[0]); // Martinfoot by default (matching screenshot!)
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [botMessage, setBotMessage] = useState<string>('');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hint, setHint] = useState<HintMove | null>(null);
  const [usedAssistance, setUsedAssistance] = useState<boolean>(false);
  const [theme, setTheme] = useState<BoardTheme>('green');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showLegalMoves, setShowLegalMoves] = useState<boolean>(true);
  const [showEvalBar, setShowEvalBar] = useState<boolean>(true);

  // Stats and history
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>(() => loadMatchHistory());

  // Modals
  const [isBotSelectorOpen, setIsBotSelectorOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [gameOverState, setGameOverState] = useState<{
    isOpen: boolean;
    result: 'win' | 'loss' | 'draw';
    reason: string;
    ratingDelta: number;
    newRating: number;
    botQuote: string;
    crownsEarned: number;
  }>({
    isOpen: false,
    result: 'draw',
    reason: '',
    ratingDelta: 0,
    newRating: 1000,
    botQuote: '',
    crownsEarned: 0,
  });

  const [evalScore, setEvalScore] = useState<number>(0);

  // Sync sound engine
  useEffect(() => {
    soundEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  // Set initial greeting
  useEffect(() => {
    const greetings = currentBot.dialogues.start;
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setBotMessage(randomGreeting);
  }, [currentBot]);

  const updateEvaluation = useCallback((currentChess: Chess) => {
    const score = evaluateBoard(currentChess);
    setEvalScore(score);
  }, []);

  // Check Game Over
  const checkGameOver = useCallback(
    (currentChess: Chess, lastColorMoved: 'w' | 'b') => {
      const isPlayerMove =
        (lastColorMoved === 'w' && playerColor === 'white') ||
        (lastColorMoved === 'b' && playerColor === 'black');

      if (currentChess.isCheckmate()) {
        const playerWon = isPlayerMove;
        const result: 'win' | 'loss' = playerWon ? 'win' : 'loss';
        const reason = playerWon
          ? 'Xeque-mate! Você encurralou o rei adversário!'
          : 'Xeque-mate! Seu rei foi encurralado.';

        const botQuotes = playerWon ? currentBot.dialogues.playerWin : currentBot.dialogues.botWin;
        const botQuote = botQuotes[Math.floor(Math.random() * botQuotes.length)] || 'Fim de partida!';

        if (playerWon) soundEngine.playVictory();
        else soundEngine.playDefeat();

        const { newStats, ratingDelta } = recordMatchResult({
          botId: currentBot.id,
          botRating: currentBot.rating,
          result,
          usedAssistance,
        });

        const newHistoryItem: MatchHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('pt-BR'),
          botId: currentBot.id,
          botName: currentBot.name,
          botRating: currentBot.rating,
          playerColor,
          result,
          reason,
          ratingChange: ratingDelta,
          newRating: newStats.rating,
          moveCount: currentChess.history().length,
          pgn: currentChess.pgn(),
        };

        const updatedHistory = [newHistoryItem, ...matchHistory];
        setMatchHistory(updatedHistory);
        saveMatchHistory(updatedHistory);
        setPlayerStats(newStats);

        const crowns = newStats.botProgress[currentBot.id]?.crowns || 0;

        setGameOverState({
          isOpen: true,
          result,
          reason,
          ratingDelta,
          newRating: newStats.rating,
          botQuote,
          crownsEarned: crowns,
        });
        return true;
      }

      if (
        currentChess.isDraw() ||
        currentChess.isStalemate() ||
        currentChess.isThreefoldRepetition() ||
        currentChess.isInsufficientMaterial()
      ) {
        let reason = 'Empate técnico';
        if (currentChess.isStalemate()) reason = 'Empate por afogamento do rei';
        else if (currentChess.isThreefoldRepetition()) reason = 'Empate por repetição de três lances';
        else if (currentChess.isInsufficientMaterial()) reason = 'Empate por material insuficiente';

        const botQuotes = currentBot.dialogues.draw;
        const botQuote = botQuotes[Math.floor(Math.random() * botQuotes.length)] || 'Empate!';

        soundEngine.playDefeat();

        const { newStats, ratingDelta } = recordMatchResult({
          botId: currentBot.id,
          botRating: currentBot.rating,
          result: 'draw',
          usedAssistance,
        });

        const newHistoryItem: MatchHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('pt-BR'),
          botId: currentBot.id,
          botName: currentBot.name,
          botRating: currentBot.rating,
          playerColor,
          result: 'draw',
          reason,
          ratingChange: ratingDelta,
          newRating: newStats.rating,
          moveCount: currentChess.history().length,
          pgn: currentChess.pgn(),
        };

        const updatedHistory = [newHistoryItem, ...matchHistory];
        setMatchHistory(updatedHistory);
        saveMatchHistory(updatedHistory);
        setPlayerStats(newStats);

        setGameOverState({
          isOpen: true,
          result: 'draw',
          reason,
          ratingDelta,
          newRating: newStats.rating,
          botQuote,
          crownsEarned: 0,
        });
        return true;
      }

      return false;
    },
    [playerColor, currentBot, usedAssistance, matchHistory]
  );

  // Bot move logic
  const triggerBotMove = useCallback(
    (currentChess: Chess) => {
      setIsThinking(true);
      const thinkingQuotes = currentBot.dialogues.thinking;
      const thinkQuote = thinkingQuotes[Math.floor(Math.random() * thinkingQuotes.length)];
      setBotMessage(thinkQuote);

      const delay = Math.min(900, 400 + currentBot.depth * 140 + Math.random() * 200);

      setTimeout(() => {
        try {
          const botMove = getBotMove(currentChess, currentBot);
          if (!botMove) {
            setIsThinking(false);
            return;
          }

          const moveResult = currentChess.move(botMove);
          if (moveResult) {
            const nextGame = new Chess(currentChess.fen());
            setGame(nextGame);
            setLastMove({ from: botMove.from, to: botMove.to });
            updateEvaluation(nextGame);

            if (nextGame.inCheck()) {
              soundEngine.playCheck();
              const checkQuotes = currentBot.dialogues.botCheck;
              setBotMessage(checkQuotes[Math.floor(Math.random() * checkQuotes.length)] || 'Xeque!');
            } else if (moveResult.captured) {
              soundEngine.playCapture();
              const blunderQuotes = currentBot.dialogues.playerBlunder;
              setBotMessage(blunderQuotes[Math.floor(Math.random() * blunderQuotes.length)] || 'Obrigado pela peça!');
            } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
              soundEngine.playCastle();
            } else {
              soundEngine.playMove();
            }

            checkGameOver(nextGame, moveResult.color);
          }
        } catch (err) {
          console.error('Error during bot move calculation', err);
        } finally {
          setIsThinking(false);
        }
      }, delay);
    },
    [currentBot, updateEvaluation, checkGameOver]
  );

  // Player move
  const handlePlayerMove = useCallback(
    (moveData: { from: string; to: string; promotion?: string }): boolean => {
      if (isThinking || gameOverState.isOpen) return false;

      const currentTurn = game.turn();
      const expectedTurn = playerColor === 'white' ? 'w' : 'b';
      if (currentTurn !== expectedTurn) return false;

      try {
        const moveResult = game.move({
          from: moveData.from,
          to: moveData.to,
          promotion: moveData.promotion || 'q',
        });

        if (!moveResult) return false;

        const nextGame = new Chess(game.fen());
        setGame(nextGame);
        setLastMove({ from: moveData.from, to: moveData.to });
        setHint(null);
        updateEvaluation(nextGame);

        if (moveData.promotion) {
          soundEngine.playPromotion();
        } else if (nextGame.inCheck()) {
          soundEngine.playCheck();
          const checkQuotes = currentBot.dialogues.playerCheck;
          setBotMessage(checkQuotes[Math.floor(Math.random() * checkQuotes.length)] || 'Belo xeque!');
        } else if (moveResult.captured) {
          soundEngine.playCapture();
          const botBlunderQuotes = currentBot.dialogues.botBlunder;
          if (botBlunderQuotes.length > 0 && Math.random() < 0.5) {
            setBotMessage(botBlunderQuotes[Math.floor(Math.random() * botBlunderQuotes.length)]);
          }
        } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
          soundEngine.playCastle();
        } else {
          soundEngine.playMove();
        }

        const isOver = checkGameOver(nextGame, moveResult.color);
        if (!isOver) {
          triggerBotMove(nextGame);
        }

        return true;
      } catch (err) {
        return false;
      }
    },
    [game, isThinking, gameOverState.isOpen, playerColor, updateEvaluation, currentBot, checkGameOver, triggerBotMove]
  );

  // Start new game from panel
  const handleStartGameWithColor = (chosenSide: PlayerSide) => {
    const newChess = new Chess();
    let resolvedColor: 'white' | 'black' = 'white';

    if (chosenSide === 'random') {
      resolvedColor = Math.random() < 0.5 ? 'white' : 'black';
    } else {
      resolvedColor = chosenSide;
    }

    setGame(newChess);
    setPlayerColor(resolvedColor);
    setIsFlipped(resolvedColor === 'black');
    setLastMove(null);
    setHint(null);
    setUsedAssistance(false);
    setEvalScore(0);
    setIsThinking(false);
    setIsPlaying(true);
    setGameOverState((prev) => ({ ...prev, isOpen: false }));

    const greetings = currentBot.dialogues.start;
    setBotMessage(greetings[Math.floor(Math.random() * greetings.length)] || 'Boa partida!');

    if (resolvedColor === 'black') {
      setTimeout(() => {
        triggerBotMove(newChess);
      }, 500);
    }
  };

  // Takeback
  const handleTakeback = () => {
    if (isThinking || gameOverState.isOpen) return;
    const history = game.history();
    if (history.length === 0) return;

    setUsedAssistance(true);
    setHint(null);

    const isPlayerTurn = game.turn() === (playerColor === 'white' ? 'w' : 'b');
    const undoCount = isPlayerTurn ? (history.length >= 2 ? 2 : 1) : 1;

    for (let i = 0; i < undoCount; i++) {
      game.undo();
    }

    const updatedChess = new Chess(game.fen());
    setGame(updatedChess);
    setLastMove(null);
    updateEvaluation(updatedChess);
    soundEngine.playMove();
  };

  // Hint
  const handleRequestHint = () => {
    if (isThinking || gameOverState.isOpen) return;
    const currentTurn = game.turn();
    const expectedTurn = playerColor === 'white' ? 'w' : 'b';
    if (currentTurn !== expectedTurn) return;

    const calculatedHint = getBestMoveHint(game);
    if (calculatedHint) {
      setHint(calculatedHint);
      setUsedAssistance(true);
    }
  };

  // Resign
  const handleResign = () => {
    if (gameOverState.isOpen) return;

    soundEngine.playDefeat();
    const botQuotes = currentBot.dialogues.botWin;
    const botQuote = botQuotes[Math.floor(Math.random() * botQuotes.length)] || 'Obrigado pela partida!';
    const reason = 'Você abandonou a partida.';

    const { newStats, ratingDelta } = recordMatchResult({
      botId: currentBot.id,
      botRating: currentBot.rating,
      result: 'loss',
      usedAssistance,
    });

    const newHistoryItem: MatchHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      botId: currentBot.id,
      botName: currentBot.name,
      botRating: currentBot.rating,
      playerColor,
      result: 'loss',
      reason,
      ratingChange: ratingDelta,
      newRating: newStats.rating,
      moveCount: game.history().length,
      pgn: game.pgn(),
    };

    const updatedHistory = [newHistoryItem, ...matchHistory];
    setMatchHistory(updatedHistory);
    saveMatchHistory(updatedHistory);
    setPlayerStats(newStats);

    setGameOverState({
      isOpen: true,
      result: 'loss',
      reason,
      ratingDelta,
      newRating: newStats.rating,
      botQuote,
      crownsEarned: newStats.botProgress[currentBot.id]?.crowns || 0,
    });
  };

  // Draw offer
  const handleOfferDraw = () => {
    if (isThinking || gameOverState.isOpen) return;

    const isBotAdvantaged =
      (playerColor === 'white' && evalScore < -150) || (playerColor === 'black' && evalScore > 150);

    if (isBotAdvantaged) {
      setBotMessage('Minha posição está muito superior para aceitar um empate! Vamos jogar até o fim.');
    } else {
      soundEngine.playDefeat();
      const reason = 'Empate acordado por comum acordo.';
      const botQuote = 'Proposta aceita! Foi uma partida muito equilibrada.';

      const { newStats, ratingDelta } = recordMatchResult({
        botId: currentBot.id,
        botRating: currentBot.rating,
        result: 'draw',
        usedAssistance,
      });

      const newHistoryItem: MatchHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        botId: currentBot.id,
        botName: currentBot.name,
        botRating: currentBot.rating,
        playerColor,
        result: 'draw',
        reason,
        ratingChange: ratingDelta,
        newRating: newStats.rating,
        moveCount: game.history().length,
        pgn: game.pgn(),
      };

      const updatedHistory = [newHistoryItem, ...matchHistory];
      setMatchHistory(updatedHistory);
      saveMatchHistory(updatedHistory);
      setPlayerStats(newStats);

      setGameOverState({
        isOpen: true,
        result: 'draw',
        reason,
        ratingDelta,
        newRating: newStats.rating,
        botQuote,
        crownsEarned: 0,
      });
    }
  };

  const isPlayerTurn =
    !isThinking && !gameOverState.isOpen && game.turn() === (playerColor === 'white' ? 'w' : 'b');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#19231a] text-zinc-100 font-sans selection:bg-[#81b64c] selection:text-white overflow-x-hidden">
      {/* 1. Left Sidebar matching Chess.com */}
      <ChesscomSidebar
        playerStats={playerStats}
        onOpenBots={() => setIsBotSelectorOpen(true)}
        onOpenRanking={() => setIsLeaderboardOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onNewGame={() => setIsPlaying(false)}
      />

      {/* 2. Main Center Arena with Forest Atmosphere Background matching screenshot */}
      <div className="flex-1 flex flex-col items-center justify-between min-h-screen relative overflow-hidden bg-gradient-to-b from-[#172418] via-[#151f16] to-[#121813]">
        {/* Subtle background forest pines silhouette matching screenshot */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-black" />
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-48 opacity-15 pointer-events-none text-emerald-950 fill-current"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
        >
          <path d="M0,280 L0,180 L60,190 L120,160 L180,210 L240,150 L300,190 L360,140 L420,180 L480,130 L540,170 L600,140 L660,190 L720,120 L780,180 L840,130 L900,180 L960,140 L1020,190 L1080,150 L1140,200 L1200,140 L1260,180 L1320,150 L1380,190 L1440,160 L1440,280 Z" />
        </svg>

        {/* Center Content Row: Board Stage + Right Bot Panel */}
        <div className="w-full max-w-[1240px] flex-1 p-3 sm:p-6 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-6 lg:gap-8 z-10">
          {/* Chessboard Area with Top & Bottom Player Strips */}
          <div className="flex flex-col items-center justify-center w-full max-w-[560px] shrink-0">
            {/* Top Strip: Bot Avatar, Name (Rating), Flag, Gear (Exact screenshot match) */}
            <div className="w-full flex items-center justify-between px-2 py-2 mb-1.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#181715] border border-[#363430] overflow-hidden shrink-0 shadow">
                  <img
                    src={currentBot.avatar}
                    alt={currentBot.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                  <span>{currentBot.name}</span>
                  <span className="text-zinc-400 font-mono text-xs">({currentBot.rating})</span>
                  <span>{currentBot.flag}</span>
                </div>
              </div>

              {/* Settings gear */}
              <button
                onClick={() => setIsRulesOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                title="Regras e Configurações"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Board Row: Eval bar + Chessboard */}
            <div className="flex items-center justify-center gap-2 w-full">
              {showEvalBar && (
                <div className="h-[320px] sm:h-[460px] md:h-[520px]">
                  <EvalBar scoreCentipawns={evalScore} isFlipped={isFlipped} />
                </div>
              )}

              <div className="flex-1 max-w-[520px]">
                <ChessBoard
                  game={game}
                  onMove={handlePlayerMove}
                  theme={theme}
                  isFlipped={isFlipped}
                  isPlayerTurn={isPlayerTurn}
                  playerColor={playerColor}
                  showLegalMoves={showLegalMoves}
                  lastMove={lastMove}
                  hint={hint}
                  disabled={gameOverState.isOpen || isThinking}
                />
              </div>
            </div>

            {/* Bottom Strip: Player Avatar, kauanmoura72 🇧🇷 🎺 (Exact screenshot match) */}
            <div className="w-full flex items-center justify-between px-2 py-2 mt-1.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#363430] border border-zinc-600 flex items-center justify-center text-sm font-bold text-white shadow shrink-0">
                  ♟
                </div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                  <span>kauanmoura72</span>
                  <span>🇧🇷</span>
                  <span title="Corneta de honra">🎺</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#81b64c] ml-1">
                  ({playerStats.rating})
                </span>
              </div>

              {isPlayerTurn && isPlaying && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#81b64c]">
                  <span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse" />
                  <span>Sua vez</span>
                </div>
              )}
            </div>

            {/* Hint Box overlay if requested */}
            {hint && (
              <div className="w-full mt-2">
                <HintBox
                  hint={hint}
                  onApplyHint={() => {
                    handlePlayerMove({ from: hint.from, to: hint.to });
                    setHint(null);
                  }}
                  onClose={() => setHint(null)}
                />
              </div>
            )}
          </div>

          {/* Right Side: Chess.com Bot Selector Panel (Exact match to screenshot) */}
          <div className="flex flex-col gap-3">
            <BotSelectionPanel
              selectedBot={currentBot}
              onSelectBot={(bot) => setCurrentBot(bot)}
              onStartGame={handleStartGameWithColor}
              isPlaying={isPlaying}
              onReturnToSelection={() => setIsPlaying(false)}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((prev) => !prev)}
              playerStats={playerStats}
              onTakeback={handleTakeback}
              onHint={handleRequestHint}
              onResign={handleResign}
              onOfferDraw={handleOfferDraw}
              isThinking={isThinking}
              botDialogue={botMessage}
            />

            {/* In-Game Move History when playing */}
            {isPlaying && (
              <div className="w-full max-w-[360px] lg:max-w-[390px] h-40">
                <MoveHistory
                  history={game.history()}
                  game={game}
                  playerColor={playerColor}
                  botName={currentBot.name}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BotSelector
        isOpen={isBotSelectorOpen}
        onClose={() => setIsBotSelectorOpen(false)}
        currentBot={currentBot}
        onSelectBotAndStart={(bot, color) => {
          setCurrentBot(bot);
          handleStartGameWithColor(color);
        }}
        playerStats={playerStats}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        playerStats={playerStats}
        matchHistory={matchHistory}
        onChallengeBot={(bot) => {
          setCurrentBot(bot);
          handleStartGameWithColor('white');
        }}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <GameOverModal
        isOpen={gameOverState.isOpen}
        result={gameOverState.result}
        reason={gameOverState.reason}
        bot={currentBot}
        ratingDelta={gameOverState.ratingDelta}
        newRating={gameOverState.newRating}
        botQuote={gameOverState.botQuote}
        crownsEarned={gameOverState.crownsEarned}
        onPlayAgain={() => handleStartGameWithColor(playerColor)}
        onChangeBot={() => {
          setGameOverState((prev) => ({ ...prev, isOpen: false }));
          setIsPlaying(false);
        }}
        onClose={() => setGameOverState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
