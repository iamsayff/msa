import React from 'react';
import { Vote } from 'lucide-react';

interface StickyVoteButtonProps {
  onClick: () => void;
  hasVoted?: boolean;
}

export const StickyVoteButton: React.FC<StickyVoteButtonProps> = ({
  onClick,
  hasVoted = false,
}) => {
  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 select-none">
      <button
        onClick={onClick}
        aria-label="Vote Now in AMU Elections"
        className="group relative flex flex-col items-center justify-center bg-[#e11d48] hover:bg-[#be123c] active:scale-95 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-rose-500/40 transition-all duration-200 border-2 border-white/80"
      >
        {/* Pulsing indicator dot on top-right */}
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 border-2 border-white" />
        </span>

        {/* Ballot Icon */}
        <div className="w-6 h-6 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
          <Vote className="w-5 h-5 text-white stroke-[2.2]" />
        </div>

        {/* VOTE NOW Text */}
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-none text-white block">
          VOTE
        </span>
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-none text-white block mt-0.5">
          NOW
        </span>
      </button>
    </div>
  );
};
