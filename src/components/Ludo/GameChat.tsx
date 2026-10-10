import React, { useState } from 'react';
import { Send, Smile, X } from 'lucide-react';
import { ChatMessage } from '../../types';

interface GameChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, isEmoji?: boolean) => void;
  onClose: () => void;
}

export const GameChat: React.FC<GameChatProps> = ({ messages, onSendMessage, onClose }) => {
  const [input, setInput] = useState('');

  const quickEmojis = ['😀', '🔥', '🎉', '😡', '😱', '👑', '🎲', '👍'];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="bg-[#04260f] border border-purple-500/40 rounded-2xl p-3 w-full space-y-3 shadow-2xl">
      <div className="flex justify-between items-center border-b border-purple-800/60 pb-2">
        <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1">
          <Smile className="w-4 h-4" />
          <span>Match Live Chat & Emojis</span>
        </h4>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white text-xs">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Emojis */}
      <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {quickEmojis.map((emoji, eIdx) => (
          <button
            key={`quick-emoji-${emoji}-${eIdx}`}
            onClick={() => onSendMessage(emoji, true)}
            className="p-1.5 bg-[#04260f] hover:bg-emerald-800/60 border border-emerald-600/50 rounded-xl text-lg transition-transform hover:scale-115 shrink-0 cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="h-32 overflow-y-auto space-y-2 bg-[#04260f] p-2.5 rounded-xl border border-emerald-700/50 text-xs">
        {messages.map((m, mIdx) => (
          <div key={`game-chat-msg-${m.id || mIdx}-${mIdx}`} className="flex flex-col">
            <span className="text-[10px] text-emerald-300 font-bold">{m.senderName}:</span>
            <span className={`text-slate-100 font-medium ${m.isEmoji ? 'text-lg' : ''}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-[#031e0c] border border-emerald-600/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
