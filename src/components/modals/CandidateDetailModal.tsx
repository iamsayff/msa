import React from 'react';
import { 
  X, 
  GraduationCap, 
  Vote, 
  Mail, 
  Instagram, 
  BookOpen, 
  ShieldCheck
} from 'lucide-react';
import { Candidate } from '../../types/election';
import { POST_CATEGORIES } from '../../data/mockElectionData';
import { CandidateAvatar } from '../candidates/CandidateAvatar';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onVoteForCandidate: (candidate: Candidate) => void;
  hasVotedForThisPost?: boolean;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onVoteForCandidate,
  hasVotedForThisPost = false,
}) => {
  if (!candidate) return null;

  const category = POST_CATEGORIES.find((c) => c.id === candidate.post);
  const accentColor = category?.themeColor.accentColor || '#059669';
  const isVerifiedCandidate = Boolean(candidate.claimedEmail || candidate.isClaimed || candidate.isVerified);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Themed Banner */}
        <div 
          className="relative px-6 py-6 text-white rounded-t-3xl flex items-center justify-between"
          style={{ backgroundColor: accentColor }}
        >
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
              {category?.label} Candidate
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-1 flex items-center gap-1.5">
              <span>{candidate.name}</span>
              {isVerifiedCandidate && <VerifiedBadge size={20} title="Verified Candidate" />}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Identity & Symbol Banner */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {/* Avatar Placeholder or Real Photo */}
            <div className="shrink-0">
              <CandidateAvatar
                candidate={candidate}
                categoryConfig={category || POST_CATEGORIES[0]}
                size="lg"
                showPlaceholderBadge={false}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Official Ballot Serial No.: <strong>#{candidate.serialNumber ?? 0}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{candidate.faculty} • {candidate.year}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {candidate.avatarUrl ? 'Photo Verified by Election Officer' : 'Official Photo Placeholder (Awaiting candidate submission)'}
              </div>
            </div>
          </div>

          {/* Candidate Slogan Quote */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-center">
            <p className="text-sm font-semibold text-amber-950 italic">
              &ldquo;{candidate.quote}&rdquo;
            </p>
          </div>

          {/* Biography */}
          {candidate.bio && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Candidate Profile
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {candidate.bio}
              </p>
            </div>
          )}

          {/* Key Manifesto Pledges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Manifesto Highlights & Reform Pledges</span>
            </h4>
            <ul className="space-y-2.5">
              {(candidate.manifestoHighlights || []).map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: accentColor }}
                  >
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and Social Links */}
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
            {candidate.contactEmail && (
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{candidate.contactEmail}</span>
              </span>
            )}
            {candidate.instagram && (
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Instagram className="w-3.5 h-3.5 text-slate-400" />
                <span>{candidate.instagram}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onVoteForCandidate(candidate);
              onClose();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:brightness-105 active:scale-98"
            style={{ backgroundColor: accentColor }}
          >
            <Vote className="w-4 h-4" />
            <span>{hasVotedForThisPost ? 'Change Vote To This Candidate' : 'Vote For Candidate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
