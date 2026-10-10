import React, { useState } from 'react';
import { Bot, PlayerSide, PlayerStats } from '../types/chess';
import { CHESS_BOTS } from '../data/bots';
import { Swords, Trophy, Crown, Sparkles, User, Shuffle } from 'lucide-react';
import { WhiteKing, BlackKing } from '../utils/chessPieces';

interface BotSelectorProps {
  currentBot: Bot;
  onSelectBotAndStart: (bot: Bot, color: PlayerSide) => void;
  playerStats: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
}

export const BotSelector: React.FC<BotSelectorProps> = ({
  currentBot,
  onSelectBotAndStart,
  playerStats,
  isOpen,
  onClose,
}) => {
  const [activeTier, setActiveTier] = useState<string>('all');
  const [selectedBotToChallenge, setSelectedBotToChallenge] = useState<Bot | null>(null);
  const [chosenColor, setChosenColor] = useState<PlayerSide>('white');

  if (!isOpen) return null;

  const tiers: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'Todos os Bots (Classificados por Rating)', count: CHESS_BOTS.length },
    { id: 'beginner', label: 'Iniciantes (250-800) · Fácil', count: CHESS_BOTS.filter(b => b.tier === 'beginner').length },
    { id: 'intermediate', label: 'Intermediários (1100-1450) · Médio', count: CHESS_BOTS.filter(b => b.tier === 'intermediate').length },
    { id: 'advanced', label: 'Avançados (1550-1950) · Difícil', count: CHESS_BOTS.filter(b => b.tier === 'advanced').length },
    { id: 'master', label: 'Mestres & GM (2150-2800) · Mestre', count: CHESS_BOTS.filter(b => b.tier === 'master').length },
    { id: 'legendary', label: 'Lendários (3000-3200) · Sobrenatural', count: CHESS_BOTS.filter(b => b.tier === 'legendary').length },
  ];

  const filteredBots = (
    activeTier === 'all'
      ? CHESS_BOTS
      : CHESS_BOTS.filter((bot) => bot.tier === activeTier)
  ).sort((a, b) => a.rating - b.rating);

  const handleStartGame = () => {
    if (selectedBotToChallenge) {
      onSelectBotAndStart(selectedBotToChallenge, chosenColor);
      setSelectedBotToChallenge(null);
      onClose();
    }
  };

  const getDifficultyPill = (diff: string) => {
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#21201d] border border-[#363430] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#262522] border-b border-[#363430] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#81b64c]/20 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c]">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Escolha seu Oponente de IA</h2>
              <p className="text-xs text-zinc-400">Classificados por nível de dificuldade e pontuação Elo real.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 text-sm rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ✕ Fechar
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-2.5 border-b border-[#312e2b] flex items-center gap-2 overflow-x-auto bg-[#1a1917]">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTier === tier.id
                  ? 'bg-[#81b64c] text-white shadow-sm'
                  : 'bg-[#262522] text-zinc-400 hover:text-zinc-200 hover:bg-[#312e2b]'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Bot Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 bg-[#1e1d1b]">
          {filteredBots.map((bot) => {
            const prog = playerStats.botProgress[bot.id];
            const isDefeated = prog?.defeated;
            const crowns = prog?.crowns || 0;
            const isSelected = selectedBotToChallenge?.id === bot.id;

            return (
              <div
                key={bot.id}
                onClick={() => setSelectedBotToChallenge(bot)}
                className={`relative rounded-xl p-3 border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#2a2824] border-[#81b64c] ring-2 ring-[#81b64c]/40 shadow-lg'
                    : 'bg-[#262522] border-[#363430] hover:border-zinc-500 hover:bg-[#2c2a26]'
                }`}
              >
                <div>
                  {/* Portrait with Badge */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2.5 bg-[#181715] border border-[#363430]">
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Elo Badge */}
                    <div className="absolute bottom-2 left-2 bg-black/85 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono font-bold text-amber-300 border border-zinc-700">
                      {bot.rating} Elo
                    </div>

                    {/* Defeated / Crown Indicator */}
                    {isDefeated && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-zinc-950 text-[11px] font-extrabold px-1.5 py-0.5 rounded-full shadow flex items-center gap-1">
                        <span>👑</span>
                        <span>{crowns}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Name */}
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-white group-hover:text-[#81b64c] transition-colors truncate">
                      {bot.name}
                    </span>
                    <span className="text-xs">{bot.flag}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getDifficultyPill(
                        bot.difficulty
                      )}`}
                    >
                      {bot.difficultyLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
                    {bot.description}
                  </p>
                </div>

                {/* Bottom Meta & Action */}
                <div className="pt-2 border-t border-[#363430] flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 truncate mr-2 font-medium">{bot.tierLabel}</span>
                  <span
                    className={`font-bold shrink-0 ${
                      isSelected ? 'text-[#81b64c]' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {isSelected ? 'Selecionado' : 'Desafiar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Color Picker & Confirm Action */}
        <div className="px-6 py-4 bg-[#262522] border-t border-[#363430] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedBotToChallenge ? (
              <div className="flex items-center gap-2">
                <img
                  src={selectedBotToChallenge.avatar}
                  alt={selectedBotToChallenge.name}
                  className="w-10 h-10 rounded-lg object-cover border border-[#3d3a36]"
                />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    Oponente: <span className="text-[#81b64c] font-bold">{selectedBotToChallenge.name}</span> ({selectedBotToChallenge.rating} Elo)
                  </div>
                  <div className="text-[11px] text-zinc-400">{selectedBotToChallenge.playstyle}</div>
                </div>
              </div>
            ) : (
              <span className="text-xs text-zinc-400 italic">
                Selecione uma máquina acima para jogar.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center bg-[#1e1d1b] p-1 rounded-xl border border-[#363430]">
              <button
                onClick={() => setChosenColor('white')}
                className={`p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  chosenColor === 'white' ? 'bg-[#363430] ring-1 ring-white' : 'opacity-60 hover:opacity-100'
                }`}
                title="Jogar de Brancas"
              >
                <div className="w-5 h-5">
                  <WhiteKing />
                </div>
              </button>

              <button
                onClick={() => setChosenColor('random')}
                className={`p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer text-zinc-300 font-bold ${
                  chosenColor === 'random' ? 'bg-[#363430] text-[#81b64c] ring-1 ring-[#81b64c]' : 'opacity-60 hover:opacity-100'
                }`}
                title="Cor Aleatória"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={() => setChosenColor('black')}
                className={`p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                  chosenColor === 'black' ? 'bg-[#363430] ring-1 ring-zinc-400' : 'opacity-60 hover:opacity-100'
                }`}
                title="Jogar de Pretas"
              >
                <div className="w-5 h-5">
                  <BlackKing />
                </div>
              </button>
            </div>

            <button
              onClick={handleStartGame}
              disabled={!selectedBotToChallenge}
              className="py-2.5 px-6 rounded-xl bg-[#81b64c] hover:bg-[#72a343] text-white font-bold text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Swords className="w-4 h-4" />
              <span>Jogar Partida</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
