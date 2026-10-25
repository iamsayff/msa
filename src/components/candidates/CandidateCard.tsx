import React from 'react';
import { ArrowRight, GraduationCap, Heart } from 'lucide-react';
import { Candidate, PostCategoryConfig } from '../../types/election';
import { CandidateAvatar } from './CandidateAvatar';
import { useElection } from '../../context/ElectionContext';

interface CandidateCardProps {
  candidate: Candidate;
  categoryConfig: PostCategoryConfig;
  onSelect: (candidate: Candidate) => void;
  onQuickVote?: (candidate: Candidate) => void;
  isVoted?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  categoryConfig,
  onSelect,
  onQuickVote,
  isVoted = false,
}) => {
  const { getCandidateVotes } = useElection();
  const liveSupports = getCandidateVotes(candidate.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200/90 shadow-2xs hover:shadow-lg transition-all p-5 flex flex-col items-center text-center group justify-between h-full relative">
      {/* Top Left: Ballot Serial Number or Supported badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1">
        {isVoted ? (
          <div className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span>✓ Supported</span>
          </div>
        ) : (
          <div className="bg-slate-100/90 border border-slate-200 text-slate-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs tracking-tight">
            <span>Ballot #{candidate.serialNumber ?? 0}</span>
          </div>
        )}
      </div>

      {/* Top Right: Supports Label matching Navbar Support Button style with heart icon & outline border color */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-white font-extrabold text-xs shadow-sm tracking-tight cursor-default"
          style={{ backgroundColor: categoryConfig.themeColor.accentColor }}
        >
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
          <span>{liveSupports.toLocaleString()} Supports</span>
        </span>
      </div>

      <div className="w-full flex flex-col items-center mt-3">
        {/* Candidate Avatar with Real Photo or Stylized Photo Placeholder */}
        <div className="mb-3.5">
          <CandidateAvatar
            candidate={candidate}
            categoryConfig={categoryConfig}
            size="md"
          />
        </div>

        {/* Candidate Name */}
        <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-slate-800">
          {candidate.name}
        </h3>

        {/* Candidate Quote in Quotes */}
        <p className="text-xs text-slate-500 font-normal mt-1.5 line-clamp-2 px-1 italic">
          &ldquo;{candidate.quote}&rdquo;
        </p>

        {/* Faculty and Year Meta */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2.5 flex-wrap">
          <GraduationCap className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span>{candidate.faculty}</span>
          <span>•</span>
          <span>{candidate.year}</span>
        </div>
      </div>

      {/* Action Buttons: View Profile and Quick Action */}
      <div className="w-full pt-3.5 mt-3 border-t border-slate-50 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(candidate)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold transition-all py-1.5 px-2 rounded-lg hover:bg-slate-50"
          style={{ color: categoryConfig.themeColor.accentColor }}
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        {onQuickVote && (
          <button
            onClick={() => onQuickVote(candidate)}
            title="Support this candidate"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-50 text-rose-500" />
          </button>
        )}
      </div>
    </div>
  );
};
