import React, { useState } from 'react';
import { Bot, BotCategory, PlayerSide, PlayerStats } from '../types/chess';
import { CHESS_BOTS } from '../data/bots';
import { 
  Bot as BotIcon, 
  Volume2, 
  VolumeX, 
  Info, 
  Clock, 
  ChevronDown, 
  RotateCcw, 
  Lightbulb, 
  Flag, 
  Handshake, 
  Sparkles,
  Swords,
  Crown,
  Filter,
  Flame
} from 'lucide-react';
import { WhiteKing, BlackKing } from '../utils/chessPieces';

interface BotSelectionPanelProps {
  selectedBot: Bot;
  onSelectBot: (bot: Bot) => void;
  onStartGame: (side: PlayerSide) => void;
  isPlaying: boolean;
  onReturnToSelection: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  playerStats: PlayerStats;
  onTakeback: () => void;
  onHint: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  isThinking: boolean;
  botDialogue: string;
}

export const BotSelectionPanel: React.FC<BotSelectionPanelProps> = ({
  selectedBot,
  onSelectBot,
  onStartGame,
  isPlaying,
  onReturnToSelection,
  soundEnabled,
  onToggleSound,
  playerStats,
  onTakeback,
  onHint,
  onResign,
  onOfferDraw,
  isThinking,
  botDialogue,
}) => {
  const [selectedColor, setSelectedColor] = useState<PlayerSide>('white');
  const [activeCategory, setActiveCategory] = useState<BotCategory>('all');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // Categories classified by rating and difficulty matching Chess.com tiers
  const categories: { id: BotCategory; label: string; badge: string; icon: string }[] = [
    { id: 'all', label: 'Todos (Rating)', badge: '19 Bots', icon: '⭐' },
    { id: 'beginners', label: 'Iniciantes (250-800)', badge: 'Fácil', icon: '♟' },
    { id: 'intermediate', label: 'Intermediários (1100-1450)', badge: 'Médio', icon: '♞' },
    { id: 'advanced', label: 'Avançados (1550-1950)', badge: 'Difícil', icon: '⚔️' },
    { id: 'masters', label: 'Mestres & GM (2150-2800)', badge: 'Mestre', icon: '👑' },
    { id: 'legendary', label: 'Lendários (3000-3200)', badge: 'Impossível', icon: '⚡' },
    { id: 'cryptids', label: 'Criptídeos', badge: 'Evento', icon: '🐾' },
  ];

  // Filter bots and ensure they remain sorted ascending by rating
  const filteredBots = (
    activeCategory === 'all'
      ? CHESS_BOTS
      : CHESS_BOTS.filter((b) => {
          if (activeCategory === 'cryptids') return b.category === 'cryptids';
          return b.category === activeCategory;
        })
  ).sort((a, b) => a.rating - b.rating);

  const getDifficultyBadgeClass = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
      case 'medium':
        return 'bg-sky-950/80 text-sky-400 border-sky-800/80';
      case 'hard':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      case 'expert':
        return 'bg-orange-950/80 text-orange-400 border-orange-800/80';
      case 'impossible':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/80';
      default:
        return 'bg-purple-950/80 text-purple-400 border-purple-800/80';
    }
  };

  return (
    <div className="w-full max-w-[360px] lg:max-w-[390px] bg-[#262522] border border-[#363430] rounded-xl overflow-hidden shadow-2xl flex flex-col shrink-0 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#21201d] border-b border-[#312e2b]">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <BotIcon className="w-4 h-4 text-[#81b64c]" />
          <span>Jogar Com Bots</span>
        </div>

        <button
          onClick={onToggleSound}
          className="text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
          title={soundEnabled ? 'Silenciar sons' : 'Ativar sons'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#81b64c]" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>
      </div>

      {!isPlaying ? (
        /* Pre-game Setup Mode */
        <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
          {/* Spotlight Active Bot */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#181715] border-2 border-[#363430] mb-2 shadow-lg group">
              <img
                src={selectedBot.avatar}
                alt={selectedBot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {playerStats.botProgress[selectedBot.id]?.defeated && (
                <div className="absolute top-1.5 right-1.5 bg-amber-500 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                  <span>👑</span>
                  <span>{playerStats.botProgress[selectedBot.id]?.crowns || 1}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <span className="font-extrabold text-base text-white tracking-tight">
                {selectedBot.name}
              </span>
              <span className="text-zinc-400 font-mono font-bold text-sm">
                {selectedBot.rating}
              </span>
              <span className="text-base">{selectedBot.flag}</span>
            </div>

            {/* Rating & Difficulty Badges */}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadgeClass(
                  selectedBot.difficulty
                )}`}
              >
                {selectedBot.difficultyLabel} · {selectedBot.tierLabel}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-[#1e1d1b] px-2 py-0.5 rounded-full border border-[#363430]">
                Rating {selectedBot.rating} Elo
              </span>
            </div>

            <p className="text-xs text-zinc-400 mt-1 max-w-[280px] line-clamp-2">
              {selectedBot.playstyle}
            </p>
          </div>

          {/* Difficulty & Category Filter Strip */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1.5">
              <span>Classificação por Dificuldade & Rating:</span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {filteredBots.length} IA
              </span>
            </div>

            {/* Horizontal scrolling Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const matchingBot = CHESS_BOTS.find((b) =>
                      cat.id === 'all'
                        ? true
                        : cat.id === 'cryptids'
                        ? b.category === 'cryptids'
                        : b.category === cat.id
                    );
                    if (matchingBot) onSelectBot(matchingBot);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-[#81b64c] text-white shadow'
                      : 'bg-[#1e1d1b] text-zinc-400 hover:text-zinc-200 hover:bg-[#312e2b] border border-[#312e2b]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Grid of bots in selected category - sorted by rating */}
            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-[#1a1917] rounded-lg border border-[#312e2b]">
              {filteredBots.map((bot) => {
                const isSelected = selectedBot.id === bot.id;
                return (
                  <div
                    key={bot.id}
                    onClick={() => onSelectBot(bot)}
                    className="flex flex-col items-center cursor-pointer group p-1 rounded-lg hover:bg-[#282724] transition-colors"
                  >
                    <div
                      className={`relative w-11 h-11 rounded-lg overflow-hidden bg-[#181715] border-2 transition-all ${
                        isSelected
                          ? 'border-[#81b64c] ring-2 ring-[#81b64c]/40 scale-105'
                          : 'border-[#363430] group-hover:border-zinc-500'
                      }`}
                    >
                      <img
                        src={bot.avatar}
                        alt={bot.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Rating badge below avatar */}
                    <div className="mt-1 bg-[#1e1d1b] border border-[#363430] rounded-full px-1.5 py-0.2 flex items-center gap-0.5 text-[9px] font-bold text-zinc-300">
                      <span>{bot.rating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options & Piece Color Selector row */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#312e2b]">
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Opções</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* 3 Color Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedColor('white')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  selectedColor === 'white'
                    ? 'bg-[#403e39] border-2 border-white text-white shadow-sm'
                    : 'bg-[#312e2b] border border-[#403e39] opacity-60 hover:opacity-100'
                }`}
                title="Jogar de Brancas"
              >
                <div className="w-5 h-5">
                  <WhiteKing />
                </div>
              </button>

              <button
                onClick={() => setSelectedColor('random')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all cursor-pointer ${
                  selectedColor === 'random'
                    ? 'bg-[#403e39] border-2 border-[#81b64c] text-[#81b64c] shadow-sm'
                    : 'bg-[#312e2b] border border-[#403e39] text-zinc-400 opacity-60 hover:opacity-100'
                }`}
                title="Cor Aleatória"
              >
                ?
              </button>

              <button
                onClick={() => setSelectedColor('black')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  selectedColor === 'black'
                    ? 'bg-[#403e39] border-2 border-zinc-300 text-white shadow-sm'
                    : 'bg-[#312e2b] border border-[#403e39] opacity-60 hover:opacity-100'
                }`}
                title="Jogar de Pretas"
              >
                <div className="w-5 h-5">
                  <BlackKing />
                </div>
              </button>
            </div>
          </div>

          {isOptionsOpen && (
            <div className="p-3 bg-[#1e1d1b] rounded-lg border border-[#312e2b] text-xs text-zinc-300 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex justify-between items-center">
                <span>Dificuldade do Bot:</span>
                <span className={`font-bold ${selectedBot.difficultyColor}`}>
                  {selectedBot.difficultyLabel} ({selectedBot.rating} Elo)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Modo de Ranking:</span>
                <span className="font-bold text-[#81b64c]">Valendo Elo e Coroas</span>
              </div>
            </div>
          )}

          {/* Big Green "Jogar" Button */}
          <button
            onClick={() => onStartGame(selectedColor)}
            className="w-full py-3.5 rounded-lg bg-[#81b64c] hover:bg-[#72a343] active:bg-[#63903a] text-white font-black text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer tracking-wide flex items-center justify-center gap-2"
          >
            <span>Jogar contra {selectedBot.name}</span>
          </button>
        </div>
      ) : (
        /* In-Game Active Mode */
        <div className="p-4 flex flex-col justify-between flex-1 gap-3">
          <div className="p-3 bg-[#1e1d1b] rounded-xl border border-[#312e2b] flex items-center gap-3">
            <img
              src={selectedBot.avatar}
              alt={selectedBot.name}
              className="w-12 h-12 rounded-lg object-cover border border-[#363430] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white truncate">{selectedBot.name}</span>
                <span className="text-xs font-mono font-bold text-zinc-400">({selectedBot.rating})</span>
                <span className="text-xs">{selectedBot.flag}</span>
              </div>
              <div className="text-[10px] font-bold text-zinc-400">
                Nível: <span className={selectedBot.difficultyColor}>{selectedBot.difficultyLabel}</span>
              </div>
              <p className="text-xs text-zinc-300 italic mt-0.5 line-clamp-2">
                "{botDialogue || (isThinking ? 'Pensando na melhor jogada...' : 'Sua vez!')}"
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onTakeback}
              disabled={isThinking}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-200 text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Voltar Lance</span>
            </button>

            <button
              onClick={onHint}
              disabled={isThinking}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-200 text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              <span>Pedir Dica</span>
            </button>

            <button
              onClick={onOfferDraw}
              disabled={isThinking}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#312e2b]/80 hover:bg-[#3d3a36] text-zinc-300 text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Handshake className="w-3.5 h-3.5 text-sky-400" />
              <span>Propor Empate</span>
            </button>

            <button
              onClick={onResign}
              disabled={isThinking}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#312e2b]/80 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer border border-transparent hover:border-rose-900/40"
            >
              <Flag className="w-3.5 h-3.5 text-rose-400" />
              <span>Abandonar</span>
            </button>
          </div>

          <button
            onClick={onReturnToSelection}
            className="w-full py-2.5 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-[#3d3a36]"
          >
            Trocar de Robô / Novo Jogo
          </button>
        </div>
      )}
    </div>
  );
};
