import React, { useState } from 'react';
import { Bot, MatchHistoryItem, PlayerStats } from '../types/chess';
import { CHESS_BOTS } from '../data/bots';
import { getPlayerTitle } from '../utils/ratingSystem';
import { Trophy, Award, Crown, CheckCircle2, Clock, Flame, Shield, Swords } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  matchHistory: MatchHistoryItem[];
  onChallengeBot: (bot: Bot) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  matchHistory,
  onChallengeBot,
}) => {
  const [activeTab, setActiveTab] = useState<'ladder' | 'history'>('ladder');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');

  if (!isOpen) return null;

  const totalBots = CHESS_BOTS.length;
  const defeatedCount = CHESS_BOTS.filter((b) => playerStats.botProgress[b.id]?.defeated).length;
  const totalCrowns = Object.values(playerStats.botProgress).reduce((acc, p) => acc + (p.crowns || 0), 0);
  const maxPossibleCrowns = totalBots * 3;
  const playerTitle = getPlayerTitle(playerStats.rating);

  const totalGames = playerStats.gamesPlayed;
  const winRate = totalGames > 0 ? Math.round((playerStats.wins / totalGames) * 100) : 0;

  // Filter bots by difficulty if selected, keep sorted ascending by rating
  const sortedBots = [...CHESS_BOTS].sort((a, b) => a.rating - b.rating);
  const displayedBots = sortedBots.filter((bot) => {
    if (selectedDifficultyFilter === 'all') return true;
    return bot.difficulty === selectedDifficultyFilter;
  });

  const getDifficultyPillClass = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80';
      case 'medium':
        return 'bg-sky-950/70 text-sky-400 border-sky-800/80';
      case 'hard':
        return 'bg-amber-950/70 text-amber-400 border-amber-800/80';
      case 'expert':
        return 'bg-orange-950/70 text-orange-400 border-orange-800/80';
      case 'impossible':
        return 'bg-rose-950/70 text-rose-400 border-rose-800/80';
      default:
        return 'bg-purple-950/70 text-purple-400 border-purple-800/80';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#21201d] border border-[#363430] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#262522] border-b border-[#363430] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 leading-tight">Escada de Dificuldade & Ranking de IA</h2>
              <p className="text-xs text-zinc-400">Classificação ordenada por rating e dificuldade (250 até 3200 Elo).</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-2 text-sm rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ✕ Fechar
          </button>
        </div>

        {/* Player Profile Summary Cards */}
        <div className="p-6 bg-[#1e1d1b] border-b border-[#312e2b] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#262522] border border-[#363430] rounded-xl p-3">
            <span className="text-[11px] text-zinc-400 font-medium">Seu Elo Atual</span>
            <div className="text-2xl font-black font-mono text-[#81b64c] mt-0.5">
              {playerStats.rating}
            </div>
            <span className="text-[10px] text-zinc-400 truncate block mt-0.5">{playerTitle}</span>
          </div>

          <div className="bg-[#262522] border border-[#363430] rounded-xl p-3">
            <span className="text-[11px] text-zinc-400 font-medium">Bots Vencidos</span>
            <div className="text-2xl font-black font-mono text-zinc-100 mt-0.5">
              {defeatedCount} / {totalBots}
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#81b64c] h-full rounded-full transition-all"
                style={{ width: `${(defeatedCount / totalBots) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-[#262522] border border-[#363430] rounded-xl p-3">
            <span className="text-[11px] text-zinc-400 font-medium">Coroas Coletadas</span>
            <div className="text-2xl font-black font-mono text-amber-400 mt-0.5 flex items-center gap-1">
              <span>👑</span>
              <span>{totalCrowns}</span>
              <span className="text-xs text-zinc-500 font-normal">/{maxPossibleCrowns}</span>
            </div>
            <span className="text-[10px] text-zinc-400 block mt-0.5">3 coroas por bot</span>
          </div>

          <div className="bg-[#262522] border border-[#363430] rounded-xl p-3">
            <span className="text-[11px] text-zinc-400 font-medium">Aproveitamento</span>
            <div className="text-2xl font-black font-mono text-zinc-100 mt-0.5">
              {winRate}%
            </div>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              {playerStats.wins}V · {playerStats.losses}D · {playerStats.draws}E
            </span>
          </div>
        </div>

        {/* Tab & Difficulty Filters */}
        <div className="px-6 py-2.5 bg-[#262522] border-b border-[#312e2b] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ladder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'ladder'
                  ? 'bg-[#81b64c] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Classificação por Rating ({totalBots} IA)
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#81b64c] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Histórico de Partidas
            </button>
          </div>

          {activeTab === 'ladder' && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {['all', 'easy', 'medium', 'hard', 'expert', 'impossible'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficultyFilter(diff)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer capitalize ${
                    selectedDifficultyFilter === diff
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {diff === 'all'
                    ? 'Todas'
                    : diff === 'easy'
                    ? 'Fácil'
                    : diff === 'medium'
                    ? 'Médio'
                    : diff === 'hard'
                    ? 'Difícil'
                    : diff === 'expert'
                    ? 'Mestre'
                    : 'Impossível'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#1e1d1b]">
          {activeTab === 'ladder' ? (
            <div className="space-y-2.5">
              {displayedBots.map((bot, index) => {
                const prog = playerStats.botProgress[bot.id];
                const isDefeated = prog?.defeated;
                const crowns = prog?.crowns || 0;

                return (
                  <div
                    key={bot.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isDefeated
                        ? 'bg-[#262522] border-[#3d3a36]'
                        : 'bg-[#181715]/70 border-[#2b2926] opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Ladder rank index */}
                      <div className="w-7 text-xs font-mono font-bold text-zinc-500 text-center">
                        #{index + 1}
                      </div>

                      <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#363430] shrink-0">
                        <img
                          src={bot.avatar}
                          alt={bot.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white truncate">{bot.name}</span>
                          <span className="text-sm">{bot.flag}</span>
                          <span className="text-xs font-mono font-bold text-amber-400 bg-[#2b2926] px-1.5 py-0.5 rounded border border-[#3d3a36]">
                            {bot.rating} Elo
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getDifficultyPillClass(
                              bot.difficulty
                            )}`}
                          >
                            {bot.difficultyLabel}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{bot.playstyle}</p>
                      </div>
                    </div>

                    {/* Progress / Crowns / Challenge Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-0.5 bg-[#262522] px-2 py-1 rounded-lg border border-[#363430]">
                        {[1, 2, 3].map((star) => (
                          <span
                            key={star}
                            className={`text-xs ${
                              crowns >= star ? 'opacity-100 scale-110' : 'opacity-20 grayscale'
                            }`}
                            title={
                              star === 1
                                ? 'Derrotar o bot'
                                : star === 2
                                ? 'Vencer sem dicas'
                                : 'Vencer 3 vezes'
                            }
                          >
                            👑
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          onChallengeBot(bot);
                          onClose();
                        }}
                        className="py-1.5 px-3 rounded-lg bg-[#81b64c] hover:bg-[#72a343] text-white text-xs font-bold transition-colors cursor-pointer shadow"
                      >
                        Desafiar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {matchHistory.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-sm italic">
                  Nenhuma partida registrada no histórico ainda. Jogue sua primeira partida!
                </div>
              ) : (
                <div className="divide-y divide-[#2d2b27]">
                  {matchHistory.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.result === 'win'
                              ? 'bg-emerald-400'
                              : item.result === 'loss'
                              ? 'bg-rose-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        <div>
                          <div className="font-semibold text-zinc-200">
                            vs {item.botName} ({item.botRating})
                          </div>
                          <div className="text-zinc-500 text-[11px]">
                            {item.reason} · {item.moveCount} lances · jogou de {item.playerColor === 'white' ? 'Brancas' : 'Pretas'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-mono font-bold ${
                            item.ratingChange > 0
                              ? 'text-emerald-400'
                              : item.ratingChange < 0
                              ? 'text-rose-400'
                              : 'text-zinc-400'
                          }`}
                        >
                          {item.ratingChange > 0 ? `+${item.ratingChange}` : item.ratingChange} Elo
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          Elo final: {item.newRating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
