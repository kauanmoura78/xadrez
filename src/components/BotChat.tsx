import React from 'react';
import { Bot } from '../types/chess';
import { MessageSquare, Bot as BotIcon } from 'lucide-react';

interface BotChatProps {
  bot: Bot;
  currentMessage: string;
  isThinking: boolean;
  isBotTurn: boolean;
  crowns: number;
}

export const BotChat: React.FC<BotChatProps> = ({
  bot,
  currentMessage,
  isThinking,
  isBotTurn,
  crowns,
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
      {/* Bot Avatar with Crown Badges */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 shadow-md">
          {bot.avatar.startsWith('http') || bot.avatar.startsWith('/') || bot.avatar.startsWith('data:') ? (
            <img
              src={bot.avatar}
              alt={bot.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400">
              <BotIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Crown indicator */}
        {crowns > 0 && (
          <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-950 text-[10px] font-black px-1 rounded-full shadow flex items-center gap-0.5">
            <span>👑</span>
            <span>{crowns}</span>
          </div>
        )}
      </div>

      {/* Bot Info & Message Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm text-zinc-100 truncate">{bot.name}</span>
          {bot.title && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-amber-400 px-1.5 py-0.5 rounded border border-zinc-700">
              {bot.title}
            </span>
          )}
          <span className="text-xs font-mono text-zinc-400">({bot.rating})</span>
          {isBotTurn && (
            <span className="text-[10px] font-medium text-emerald-400 ml-auto flex items-center gap-1">
              {isThinking ? 'Pensando...' : 'Vez do bot'}
            </span>
          )}
        </div>

        {/* Speech Bubble */}
        <div className="relative bg-zinc-800/90 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 shadow-sm">
          {isThinking ? (
            <div className="flex items-center gap-1.5 text-zinc-400 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{currentMessage || 'Calculando variantes...'}</span>
            </div>
          ) : (
            <p className="line-clamp-2 italic">"{currentMessage || 'Boa sorte!'}"</p>
          )}
        </div>
      </div>
    </div>
  );
};
