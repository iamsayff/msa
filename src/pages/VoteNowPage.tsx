import React, { useState } from 'react';
import { 
  Vote, 
  CheckCircle2, 
  ArrowLeft, 
  Edit3, 
  AlertCircle, 
  Lock, 
  ChevronRight,
  User,
  Users,
  UserCheck,
  Star,
  Award,
  Sparkles,
  Heart,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useElection } from '../context/ElectionContext';
import { POST_CATEGORIES } from '../data/mockElectionData';
import { PostType, Candidate } from '../types/election';
import { CandidateAvatar } from '../components/candidates/CandidateAvatar';

interface VoteNowPageProps {
  onBackToDashboard: () => void;
  onOpenEditProfile: () => void;
  onNavigateCandidate: (candidate: Candidate) => void;
}

export const VoteNowPage: React.FC<VoteNowPageProps> = ({
  onBackToDashboard,
  onOpenEditProfile,
  onNavigateCandidate,
}) => {
  const { user, profile, signInWithGoogle } = useAuth();
  const { candidates, ballot, changeSinglePostVote, toggleCabinetMemberVote, hasVoted } = useElection();

  const [selectedPosition, setSelectedPosition] = useState<PostType | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [justVotedCandidateId, setJustVotedCandidateId] = useState<string | null>(null);

  const isLoggedIn = Boolean(user || profile);

  const positionIcons: Record<PostType, React.ElementType> = {
    president: User,
    vice_president: Users,
    honorary_secretary: UserCheck,
    court_member: Star,
    cabinet_member: Award,
  };

  const getPositionCurrentChoiceName = (postId: PostType): string | null => {
    if (postId === 'president' && ballot.president) {
      return candidates.find((c) => c.id === ballot.president)?.name || 'Candidate selected';
    }
    if (postId === 'vice_president' && ballot.vicePresident) {
      return candidates.find((c) => c.id === ballot.vicePresident)?.name || 'Candidate selected';
    }
    if (postId === 'honorary_secretary' && ballot.honorarySecretary) {
      return candidates.find((c) => c.id === ballot.honorarySecretary)?.name || 'Candidate selected';
    }
    if (postId === 'court_member' && ballot.courtMember) {
      return candidates.find((c) => c.id === ballot.courtMember)?.name || 'Candidate selected';
    }
    if (postId === 'cabinet_member' && ballot.cabinetMembers?.length) {
      return `${ballot.cabinetMembers.length} candidate${ballot.cabinetMembers.length > 1 ? 's' : ''} selected`;
    }
    return null;
  };

  const handleVoteCandidate = async (candidate: Candidate) => {
    if (!isLoggedIn) {
      await signInWithGoogle();
      return;
    }

    setJustVotedCandidateId(candidate.id);

    if (candidate.post === 'cabinet_member') {
      await toggleCabinetMemberVote(candidate.id);
      const isNowSelected = !(ballot.cabinetMembers || []).includes(candidate.id);
      setSuccessToast(isNowSelected ? `Added ${candidate.name} to your cabinet ballot!` : `Removed ${candidate.name} from cabinet ballot`);
      setTimeout(() => setSuccessToast(null), 2500);
    } else {
      await changeSinglePostVote(candidate.post, candidate.id);
      setSuccessToast(`Support recorded for ${candidate.name}!`);
      // Smooth auto-return to positions after short delay
      setTimeout(() => {
        setSuccessToast(null);
        setSelectedPosition(null);
      }, 900);
    }
  };

  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => {
            if (selectedPosition) {
              setSelectedPosition(null);
            } else {
              onBackToDashboard();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{selectedPosition ? 'Back to Positions' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          {hasVoted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>You Have Selected Candidates (Changeable Anytime)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-2xs">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>No Support Recorded Yet</span>
            </span>
          )}
        </div>
      </div>

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs sm:text-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* STEP 1: POSITION SELECTION VIEW */}
      {selectedPosition === null ? (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AMUSU Elections 2025</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Select a Union Position to Support
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Choose a position below to see contesting candidates. You can express your support or update your choice at any time.
              </p>
            </div>

            {/* Voter Status Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shrink-0 min-w-[260px] space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Signed In Student
                    </span>
                    <button
                      onClick={onOpenEditProfile}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-emerald-800"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{profile?.name || user?.displayName || 'Student'}</h4>
                    <p className="text-xs text-slate-500 truncate">{profile?.email || user?.email}</p>
                    {profile?.hall && <p className="text-[11px] text-slate-400 mt-0.5">{profile.hall}</p>}
                  </div>
                </>
              ) : (
                <div className="text-center py-2 space-y-2">
                  <Lock className="w-5 h-5 text-amber-500 mx-auto" />
                  <p className="text-xs text-slate-600 font-semibold">Sign in with Google to express or change your candidate choice</p>
                  <button
                    onClick={() => signInWithGoogle()}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 5 Position Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POST_CATEGORIES.map((cat) => {
              const Icon = positionIcons[cat.id];
              const currentChoice = getPositionCurrentChoiceName(cat.id);
              const candidatesForThisPost = candidates.filter((c) => c.post === cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedPosition(cat.id)}
                  className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 group ${
                    currentChoice ? 'border-emerald-500/80 bg-emerald-50/20' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top: Icon & Candidate Count */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: cat.themeColor.accentColor }}
                      >
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>

                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                        {candidatesForThisPost.length} Candidates
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {cat.id === 'cabinet_member'
                          ? 'Select up to 10 student representatives'
                          : `Select 1 candidate for ${cat.label}`}
                      </p>
                    </div>

                    {/* Vote Status Pill */}
                    <div>
                      {currentChoice ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">Voted: {currentChoice}</span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500 font-medium">
                          No candidate chosen yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 group-hover:text-emerald-800 transition-colors">
                      {currentChoice ? 'Change Vote' : 'View Candidates'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STEP 2: CANDIDATES VIEW FOR SELECTED POSITION */
        <div className="space-y-6">
          {(() => {
            const currentCat = POST_CATEGORIES.find((c) => c.id === selectedPosition)!;
            const candidatesForPost = candidates.filter((c) => c.post === selectedPosition);
            const isCabinet = selectedPosition === 'cabinet_member';

            const currentVotedCandidateId =
              selectedPosition === 'president' ? ballot.president :
              selectedPosition === 'vice_president' ? ballot.vicePresident :
              selectedPosition === 'honorary_secretary' ? ballot.honorarySecretary :
              selectedPosition === 'court_member' ? ballot.courtMember :
              null;

            const cabinetSelectedList = ballot.cabinetMembers || [];

            return (
              <>
                {/* Position Header Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Position</span>
                    <h2 className="text-2xl font-extrabold text-slate-900">{currentCat.label} Candidates</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {isCabinet
                        ? `Select up to 10 candidates. You currently have selected ${cabinetSelectedList.length} of 10.`
                        : `Click on any candidate below to vote. If you already voted, clicking another candidate will change your vote.`}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedPosition(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs self-start sm:self-center transition-colors"
                  >
                    <span>Change Position</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Candidate Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {candidatesForPost.map((candidate) => {
                    const isCandidateSelected = isCabinet
                      ? cabinetSelectedList.includes(candidate.id)
                      : currentVotedCandidateId === candidate.id;

                    return (
                      <div
                        key={candidate.id}
                        className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-xs relative ${
                          isCandidateSelected
                            ? 'border-emerald-500 bg-emerald-50/30 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {/* Top Right Supports Label & Ballot No in WhatsApp Green */}
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                            #{candidate.serialNumber ?? 0}
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white font-extrabold text-xs shadow-xs tracking-tight"
                            style={{ backgroundColor: currentCat.themeColor.accentColor }}
                          >
                            <Heart className="w-3 h-3 fill-white text-white" />
                            <span>{(candidate.votesCount || 0).toLocaleString()} Supports</span>
                          </span>
                        </div>

                        {/* Top Info */}
                        <div className="space-y-3 pt-1">
                          <div className="flex items-start gap-3.5 pr-20">
                            <CandidateAvatar
                              candidate={candidate}
                              categoryConfig={currentCat}
                              size="md"
                            />
                            <div>
                              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                                {candidate.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">{candidate.faculty}</p>
                              <p className="text-[11px] text-slate-400">{candidate.year}</p>
                            </div>
                          </div>

                          {/* Candidate Quote */}
                          <p className="text-xs text-slate-600 italic line-clamp-2 pt-1 font-normal">
                            &ldquo;{candidate.quote}&rdquo;
                          </p>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                          {/* Main Support / Change Support Button */}
                          <button
                            onClick={() => handleVoteCandidate(candidate)}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isCandidateSelected
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-600/30'
                                : currentVotedCandidateId
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-[#25D366] hover:bg-[#1faa53] text-white'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>
                              {isCandidateSelected
                                ? isCabinet ? '✓ Supported (Click to Remove)' : '✓ Currently Supported'
                                : currentVotedCandidateId
                                ? `Switch Support to ${candidate.name.split(' ')[0]}`
                                : `Support ${candidate.name.split(' ')[0]}`}
                            </span>
                          </button>

                          {/* View Candidate Full Profile */}
                          <button
                            type="button"
                            onClick={() => onNavigateCandidate(candidate)}
                            className="w-full text-center py-1 text-[11px] font-bold text-slate-500 hover:text-emerald-800 transition-colors"
                          >
                            View Candidate Profile &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
