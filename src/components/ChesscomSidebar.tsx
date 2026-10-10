import React, { useState } from 'react';
import { 
  Puzzle, 
  GraduationCap, 
  ChevronDown, 
  Diamond, 
  Search, 
  Users, 
  Mail, 
  Bell, 
  Settings, 
  Trophy, 
  BookOpen, 
  Swords,
  ChevronRight
} from 'lucide-react';
import { PlayerStats } from '../types/chess';

interface ChesscomSidebarProps {
  playerStats: PlayerStats;
  onOpenBots: () => void;
  onOpenRanking: () => void;
  onOpenRules: () => void;
  onNewGame: () => void;
}

export const ChesscomSidebar: React.FC<ChesscomSidebarProps> = ({
  playerStats,
  onOpenBots,
  onOpenRanking,
  onOpenRules,
  onNewGame,
}) => {
  const [isCollapsedMobile, setIsCollapsedMobile] = useState(true);

  return (
    <>
      {/* Mobile Bar Top / Drawer toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#262522] border-b border-[#363430] w-full shrink-0 z-40">
        <div className="flex items-center gap-2">
          {/* Chess.com logo icon */}
          <div className="w-7 h-7 rounded bg-[#81b64c] flex items-center justify-center text-white font-black text-sm shadow">
            ♟
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-sans">
            Chess<span className="text-[#81b64c]">.com</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBots}
            className="px-3 py-1.5 rounded-lg bg-[#81b64c] text-white text-xs font-bold shadow-sm"
          >
            Jogar com Bots
          </button>
          <button
            onClick={onOpenRanking}
            className="px-2.5 py-1.5 rounded-lg bg-[#312e2b] text-zinc-300 text-xs font-semibold"
          >
            Ranking
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Left side, exactly matching Chess.com) */}
      <aside className="hidden md:flex flex-col w-[170px] lg:w-[195px] h-screen bg-[#21201d] border-r border-[#2d2b27] shrink-0 select-none z-30 justify-between">
        {/* Top: Logo & Main Navigation */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="px-5 py-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#81b64c] flex items-center justify-center text-white font-black text-lg shadow">
              ♟
            </div>
            <div className="flex items-baseline">
              <span className="font-black text-lg tracking-tight text-white">Chess</span>
              <span className="text-zinc-400 font-bold text-xs">.com</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-2 flex flex-col space-y-0.5 px-2">
            <button
              onClick={onNewGame}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white bg-[#2d2b26] hover:bg-[#36342e] transition-colors cursor-pointer text-left group"
            >
              <div className="w-5 h-5 flex items-center justify-center text-[#81b64c] text-lg">
                ♟
              </div>
              <span className="truncate">Jogar</span>
            </button>

            <button
              onClick={onOpenBots}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white hover:bg-[#2d2b27] transition-colors cursor-pointer text-left"
            >
              <Swords className="w-4 h-4 text-[#81b64c]" />
              <span className="truncate">Robôs de IA</span>
            </button>

            <button
              onClick={onOpenRanking}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white hover:bg-[#2d2b27] transition-colors cursor-pointer text-left"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="truncate">Ranking Elo</span>
            </button>

            <button
              onClick={onOpenRules}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white hover:bg-[#2d2b27] transition-colors cursor-pointer text-left"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span className="truncate">Regras</span>
            </button>

            <button
              onClick={() => {}}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-[#2d2b27] transition-colors cursor-pointer text-left opacity-80"
            >
              <Puzzle className="w-4 h-4 text-amber-500" />
              <span className="truncate">Problemas</span>
            </button>

            <button
              onClick={() => {}}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-[#2d2b27] transition-colors cursor-pointer text-left opacity-80"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="truncate">Aprender</span>
            </button>

            {/* Free Trial / Diamond link from screenshot */}
            <div className="pt-3 px-1">
              <div className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#00d2d3] hover:text-[#48dbfb] transition-colors cursor-pointer">
                <Diamond className="w-4 h-4 text-[#00d2d3]" />
                <span className="truncate">Avaliação Gratuita</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom: Search + User Profile from screenshot ("kauanmoura72 🇧🇷") */}
        <div className="p-3 border-t border-[#2d2b27] flex flex-col gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#181715] rounded-md text-xs text-zinc-400 border border-[#2a2824]">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span className="truncate">Pesquisar</span>
          </div>

          {/* User Profile matching the screenshot: kauanmoura72 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#81b64c]/20 border border-[#81b64c]/40 flex items-center justify-center text-sm font-bold text-white shrink-0">
                👤
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-zinc-100 truncate">kauanmoura72</span>
                  <span className="text-xs">🇧🇷</span>
                </div>
                <div className="text-[10px] font-mono font-semibold text-[#81b64c]">
                  {playerStats.rating} Elo
                </div>
              </div>
            </div>

            {/* Micro bottom bar icons matching screenshot */}
            <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-[#2a2824] px-1">
              <button className="hover:text-zinc-200 transition-colors p-1" title="Amigos">
                <Users className="w-3.5 h-3.5" />
              </button>
              <button className="hover:text-zinc-200 transition-colors p-1 relative" title="Mensagens">
                <Mail className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                  1
                </span>
              </button>
              <button className="hover:text-zinc-200 transition-colors p-1" title="Notificações">
                <Bell className="w-3.5 h-3.5" />
              </button>
              <button className="hover:text-zinc-200 transition-colors p-1" title="Configurações">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
