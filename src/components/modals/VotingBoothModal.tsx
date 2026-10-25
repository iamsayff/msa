import React, { useState } from 'react';
import { 
  X, 
  Vote, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight,
  User,
  Users,
  UserCheck,
  Star,
  Award,
  Check,
  Heart
} from 'lucide-react';
import { PostType, Candidate } from '../../types/election';
import { POST_CATEGORIES } from '../../data/mockElectionData';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { CandidateAvatar } from '../candidates/CandidateAvatar';

interface VotingBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  ballotSelections?: Record<PostType, string>;
  onSelectBallotCandidate?: (post: PostType, candidateId: string) => void;
  onSubmitBallot?: () => void;
  hasSubmittedVote?: boolean;
}

export const VotingBoothModal: React.FC<VotingBoothModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, profile, signInWithGoogle } = useAuth();
  const { candidates, ballot, changeSinglePostVote, toggleCabinetMemberVote } = useElection();

  const [selectedPosition, setSelectedPosition] = useState<PostType | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const positionIcons: Record<PostType, React.ElementType> = {
    president: User,
    vice_president: Users,
    honorary_secretary: UserCheck,
    court_member: Star,
    cabinet_member: Award,
  };

  const getPositionCurrentChoiceName = (postId: PostType): string | null => {
    if (postId === 'president' && ballot.president) {
      return candidates.find((c) => c.id === ballot.president)?.name || 'Selected';
    }
    if (postId === 'vice_president' && ballot.vicePresident) {
      return candidates.find((c) => c.id === ballot.vicePresident)?.name || 'Selected';
    }
    if (postId === 'honorary_secretary' && ballot.honorarySecretary) {
      return candidates.find((c) => c.id === ballot.honorarySecretary)?.name || 'Selected';
    }
    if (postId === 'court_member' && ballot.courtMember) {
      return candidates.find((c) => c.id === ballot.courtMember)?.name || 'Selected';
    }
    if (postId === 'cabinet_member' && ballot.cabinetMembers?.length) {
      return `${ballot.cabinetMembers.length} candidate${ballot.cabinetMembers.length > 1 ? 's' : ''}`;
    }
    return null;
  };

  const handleVoteCandidate = async (candidate: Candidate) => {
    if (!user && !profile) {
      await signInWithGoogle();
      return;
    }

    if (candidate.post === 'cabinet_member') {
      await toggleCabinetMemberVote(candidate.id);
      const isNowSelected = !(ballot.cabinetMembers || []).includes(candidate.id);
      setSuccessToast(isNowSelected ? `Added ${candidate.name}` : `Removed ${candidate.name}`);
      setTimeout(() => setSuccessToast(null), 2000);
    } else {
      await changeSinglePostVote(candidate.post, candidate.id);
      setSuccessToast(`Vote recorded for ${candidate.name}!`);
      setTimeout(() => {
        setSuccessToast(null);
        setSelectedPosition(null);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#008060] text-white rounded-t-3xl flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-none">
                {selectedPosition
                  ? `${POST_CATEGORIES.find((p) => p.id === selectedPosition)?.label} Candidates`
                  : 'Candidate Support Desk'}
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                {selectedPosition
                  ? 'Choose a candidate to express or update your support'
                  : 'Select any union position to express or update your candidate choice'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedPosition(null);
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {selectedPosition === null ? (
            /* Position Selection Grid */
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Click on any position to view contestants and cast your ballot. You can change your choice anytime before election day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {POST_CATEGORIES.map((cat) => {
                  const Icon = positionIcons[cat.id];
                  const currentChoice = getPositionCurrentChoiceName(cat.id);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedPosition(cat.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md flex items-center justify-between ${
                        currentChoice ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: cat.themeColor.accentColor }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate">{cat.label}</h4>
                          {currentChoice ? (
                            <p className="text-[11px] font-bold text-emerald-700 mt-0.5 truncate flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">Voted: {currentChoice}</span>
                            </p>
                          ) : (
                            <p className="text-[11px] text-slate-400 mt-0.5">No vote cast yet</p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        {currentChoice ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold shadow-2xs transition-colors">
                            Change Vote
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Candidates for Selected Position */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  onClick={() => setSelectedPosition(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Positions</span>
                </button>
                <span className="text-xs font-bold text-slate-400">
                  {POST_CATEGORIES.find((p) => p.id === selectedPosition)?.label}
                </span>
              </div>

              <div className="space-y-3">
                {candidates
                  .filter((c) => c.post === selectedPosition)
                  .map((candidate) => {
                    const isSelected =
                      selectedPosition === 'cabinet_member'
                        ? (ballot.cabinetMembers || []).includes(candidate.id)
                        : (selectedPosition === 'president' && ballot.president === candidate.id) ||
                          (selectedPosition === 'vice_president' && ballot.vicePresident === candidate.id) ||
                          (selectedPosition === 'honorary_secretary' && ballot.honorarySecretary === candidate.id) ||
                          (selectedPosition === 'court_member' && ballot.courtMember === candidate.id);

                    return (
                      <div
                        key={candidate.id}
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/40'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CandidateAvatar
                            candidate={candidate}
                            categoryConfig={POST_CATEGORIES.find((p) => p.id === selectedPosition)!}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                {candidate.name}
                              </h4>
                              {/* Supports Badge matching Navbar Support Button style with heart icon & outline border color */}
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white font-extrabold text-[10px] shadow-xs"
                                style={{ backgroundColor: POST_CATEGORIES.find((p) => p.id === selectedPosition)?.themeColor.accentColor || '#059669' }}
                              >
                                <Heart className="w-2.5 h-2.5 fill-white text-white" />
                                <span>{candidate.votesCount || 0} Supports</span>
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">{candidate.faculty}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleVoteCandidate(candidate)}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#25D366] hover:bg-[#1faa53] text-white'
                          }`}
                        >
                          {isSelected ? '✓ Supported' : 'Support'}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
