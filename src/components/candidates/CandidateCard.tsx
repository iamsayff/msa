import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Candidate, PostCategoryConfig } from '../../types/election';
import { useElection } from '../../context/ElectionContext';

interface CandidateCardProps {
  candidate: Candidate;
  categoryConfig: PostCategoryConfig;
  onSelect: (candidate: Candidate) => void;
  onQuickVote?: (candidate: Candidate) => void;
  isVoted?: boolean;
}

// Color palette mapping for "different colors" requirement
const VIBRANT_COLOR_PALETTE: Record<string, string> = {
  president: '#dc2626',           // Crimson Red (as shown in reference image)
  vice_president: '#059669',      // Emerald Green
  honorary_secretary: '#2563eb',  // Royal Blue
  cabinet_member: '#7c3aed',      // Deep Purple
  court_member: '#d97706',        // Amber Gold
};

const EXTRA_COLORS = ['#dc2626', '#059669', '#2563eb', '#7c3aed', '#d97706', '#0d9488', '#c026d3', '#4f46e5'];

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  categoryConfig,
  onSelect,
  isVoted = false,
}) => {
  const { getCandidateVotes } = useElection();
  const liveSupports = getCandidateVotes(candidate.id);
  const [imgError, setImgError] = useState(false);

  // Pick vibrant accent color for this specific candidate/post
  const postKey = candidate.post || 'president';
  let cardAccentColor = VIBRANT_COLOR_PALETTE[postKey] || categoryConfig?.themeColor?.accentColor || '#dc2626';

  // If candidate has a specific serial number or ID offset, allow color variation
  if (!VIBRANT_COLOR_PALETTE[postKey] && candidate.id) {
    const charCode = candidate.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    cardAccentColor = EXTRA_COLORS[charCode % EXTRA_COLORS.length];
  }

  // Label for top-left ribbon
  const postLabel = categoryConfig?.label || candidate.post?.replace('_', ' ') || 'Candidate';

  // Initials for avatar fallback
  const initials = (candidate.name || 'Candidate')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col items-center text-center relative overflow-hidden group justify-between h-full w-full">
      
      {/* 1. TOP-LEFT DIAGONAL RIBBON BADGE */}
      <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-10">
        <div
          className="absolute top-6 -left-10 w-40 -rotate-45 py-1 text-center font-black text-[10px] sm:text-[11px] text-white shadow-md uppercase tracking-wider leading-tight select-none"
          style={{ backgroundColor: cardAccentColor }}
        >
          {postLabel}
        </div>
      </div>

      {/* 2. TOP-RIGHT SUPPORTS BADGE */}
      <div className="absolute top-3.5 right-3.5 z-10">
        <div
          className="px-3.5 py-1.5 rounded-2xl text-white shadow-md flex flex-col items-center justify-center text-center transition-transform group-hover:scale-105 select-none"
          style={{ backgroundColor: cardAccentColor }}
        >
          <div className="flex items-center gap-1 font-black text-xs sm:text-sm leading-none">
            <Heart className="w-3.5 h-3.5 fill-white text-white shrink-0" />
            <span>{liveSupports.toLocaleString()}</span>
          </div>
          <span className="text-[9px] font-extrabold opacity-95 leading-tight mt-0.5">Supports</span>
        </div>
      </div>

      {/* 3. CENTER CONTENT AREA */}
      <div className="w-full flex flex-col items-center mt-3">
        
        {/* Large Circular Avatar with Thick Accent Border */}
        <div className="mt-4 mb-2 flex justify-center">
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-white shadow-md flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-102 shrink-0"
            style={{ border: `4px solid ${cardAccentColor}` }}
          >
            {candidate.avatarUrl && !imgError ? (
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover rounded-full select-none"
              />
            ) : (
              <div
                className="w-full h-full rounded-full flex flex-col items-center justify-center select-none"
                style={{ backgroundColor: `${cardAccentColor}18` }}
              >
                <span
                  className="text-xl sm:text-2xl font-black tracking-wider"
                  style={{ color: cardAccentColor }}
                >
                  {initials}
                </span>
                <span
                  className="text-[9px] font-extrabold uppercase mt-0.5 opacity-80"
                  style={{ color: cardAccentColor }}
                >
                  Ballot #{candidate.serialNumber ?? 0}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Name */}
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug mt-1">
          {candidate.name}
        </h3>

        {/* Bio / Tagline in Double Quotes */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium italic mt-1 line-clamp-2 px-1 max-w-xs">
          &ldquo;{candidate.quote || candidate.bio || 'Working for Student Rights & Reform'}&rdquo;
        </p>

        {/* Department / Faculty Name • Course */}
        <p className="text-xs font-bold text-slate-800 mt-2 tracking-tight">
          {candidate.faculty || 'Department / Faculty'} • {candidate.program || candidate.year || 'Course'}
        </p>

        {isVoted && (
          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold">
            <span>✓ Voted</span>
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACTION BUTTON: "View Profile -->" */}
      <div className="w-full pt-4 mt-2">
        <button
          onClick={() => onSelect(candidate)}
          className="w-full py-2.5 px-6 rounded-2xl border-2 font-black text-xs sm:text-sm tracking-wide transition-all shadow-2xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
          style={{
            borderColor: cardAccentColor,
            color: cardAccentColor,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = cardAccentColor;
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = cardAccentColor;
          }}
        >
          <span>View Profile --&gt;</span>
        </button>
      </div>

    </div>
  );
};
