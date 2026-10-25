import React from 'react';
import { Vote, ShieldCheck, Check } from 'lucide-react';

interface StickyVoteButtonProps {
  onClick: () => void;
  hasVotedAll?: boolean;
  votedCount?: number;
  totalPosts?: number;
}

export const StickyVoteButton: React.FC<StickyVoteButtonProps> = ({
  onClick,
  hasVotedAll = false,
  votedCount = 0,
  totalPosts = 5,
}) => {
  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 select-none">
      <button
        onClick={onClick}
        aria-label={hasVotedAll ? 'Supported View - AMU Elections' : 'Support Now - AMU Elections'}
        className="group relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white/90 hover:bg-emerald-50/80 backdrop-blur-md border-3 border-[#00684a] text-[#00684a] flex flex-col items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer p-2 text-center"
      >
        {/* Progress Pill Badge */}
        <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#00684a] text-white text-[9px] font-black tracking-wider shadow-xs flex items-center gap-0.5 border-2 border-white">
          {hasVotedAll ? (
            <>
              <Check className="w-2.5 h-2.5 text-emerald-200 stroke-[3]" />
              <span>5/5</span>
            </>
          ) : (
            <span>{votedCount}/{totalPosts}</span>
          )}
        </div>

        {/* Dark Green Icon */}
        <div className="mb-0.5 group-hover:scale-110 transition-transform">
          {hasVotedAll ? (
            <ShieldCheck className="w-5 h-5 text-[#00684a] stroke-[2.5]" />
          ) : (
            <Vote className="w-5 h-5 text-[#00684a] stroke-[2.5]" />
          )}
        </div>

        {/* Dark Green Text - Displays "SUPPORTED VIEW" only if all 5 posts voted */}
        {hasVotedAll ? (
          <div className="flex flex-col items-center leading-none">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#00684a]">
              SUPPORTED
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#00684a] mt-0.5">
              VIEW
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center leading-none">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#00684a]">
              SUPPORT
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#00684a] mt-0.5">
              NOW
            </span>
          </div>
        )}
      </button>
    </div>
  );
};
