import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  FileText, 
  Hash, 
  Mail, 
  Check, 
  Trash2, 
  ExternalLink, 
  Edit, 
  Save, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  Plus,
  Vote,
  Database
} from 'lucide-react';
import { Candidate, PostType, ProfileClaimRequest } from '../types/election';
import { AMU_FACULTIES } from '../constants/faculties';
import { useElection } from '../context/ElectionContext';
import { useAuth } from '../context/AuthContext';
import { POST_CATEGORIES } from '../data/mockElectionData';

export const AUTHORIZED_ADMIN_EMAILS = [
  'talktoaamirsaif@gmail.com',
  'ansaarsaif7@gmail.com',
];

interface AdminPageProps {
  onBackToHome: () => void;
  onNavigateToEditCandidate: (candidate: Candidate) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToHome,
  onNavigateToEditCandidate,
}) => {
  const { 
    candidates, 
    issues, 
    claimRequests, 
    updateCandidate, 
    addCandidate,
    deleteCandidate,
    assignCandidateEmail, 
    updateClaimStatus, 
    deleteCampusIssue 
  } = useElection();
  const { user, profile, signInWithGoogle, signOutUser } = useAuth();

  const currentEmail = (profile?.email || user?.email || '').toLowerCase().trim();
  const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(currentEmail);

  const [activeTab, setActiveTab] = useState<'candidates' | 'claims' | 'issues'>('candidates');
  const [filterPost, setFilterPost] = useState<PostType | 'all'>('all');
  const [filterFaculty, setFilterFaculty] = useState<string>('all');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);

  // In-line edits
  const [candidateEmailInput, setCandidateEmailInput] = useState<{ [id: string]: string }>({});
  const [candidateSerialInput, setCandidateSerialInput] = useState<{ [id: string]: number | string }>({});
  const [candidateVotesInput, setCandidateVotesInput] = useState<{ [id: string]: number | string }>({});
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Add Candidate modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCandName, setNewCandName] = useState('');
  const [newCandPost, setNewCandPost] = useState<PostType>('president');
  const [newCandFaculty, setNewCandFaculty] = useState<string>(AMU_FACULTIES[0]);

  // If not authorized, render restricted screen without displaying the secret emails
  if (!isAuthorized) {
    return (
      <div className="py-12 max-w-lg mx-auto text-center px-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Restricted Admin Access
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              This election management console is strictly restricted to designated election administrators. When an authorized administrator account is signed in, the control panel opens automatically.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {(!user && !profile) ? (
              <button
                onClick={() => signInWithGoogle()}
                className="w-full py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <span>Sign In with Authorized Google Account</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span>Current account: </span>
                  <span className="font-bold text-slate-800">{currentEmail}</span>
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                    This account is not authorized for administrator access.
                  </p>
                </div>
                <button
                  onClick={() => signOutUser()}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Switch / Sign Out
                </button>
              </div>
            )}

            <button
              onClick={onBackToHome}
              className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
            >
              Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter candidates safely
  const filteredCandidates = candidates.filter((c) => {
    const name = c.name || '';
    const post = c.post || '';
    const faculty = c.faculty || '';
    const matchesPost = filterPost === 'all' || post === filterPost;
    const matchesFaculty = filterFaculty === 'all' || faculty === filterFaculty;
    const matchesSearch = !candidateSearch || 
      name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.claimedEmail?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      faculty.toLowerCase().includes(candidateSearch.toLowerCase());
    return matchesPost && matchesFaculty && matchesSearch;
  });

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName.trim()) return;
    const newId = await addCandidate({
      name: newCandName,
      post: newCandPost,
      faculty: newCandFaculty || AMU_FACULTIES[0],
    });
    setNewCandName('');
    setNewCandFaculty(AMU_FACULTIES[0]);
    setIsAddModalOpen(false);
    setSavedNotice(`Successfully added candidate to Firestore database!`);
    setTimeout(() => setSavedNotice(null), 4000);
  };

  const handleDeleteCandidate = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete candidate "${name}"? This action is permanent.`)) {
      await deleteCandidate(id);
      setSavedNotice(`Candidate "${name}" deleted successfully.`);
      setTimeout(() => setSavedNotice(null), 4000);
    }
  };

  const handleSaveRow = async (cand: Candidate) => {
    const updatedEmail = candidateEmailInput[cand.id] !== undefined
      ? candidateEmailInput[cand.id]
      : cand.claimedEmail || '';

    const serialVal = candidateSerialInput[cand.id] !== undefined
      ? candidateSerialInput[cand.id]
      : (cand.serialNumber ?? 0);

    const votesVal = candidateVotesInput[cand.id] !== undefined
      ? candidateVotesInput[cand.id]
      : (cand.votesCount ?? 100);

    const parsedSerial = typeof serialVal === 'string' ? parseInt(serialVal, 10) : serialVal;
    const parsedVotes = typeof votesVal === 'string' ? parseInt(votesVal, 10) : votesVal;

    await updateCandidate(cand.id, {
      claimedEmail: updatedEmail.trim().toLowerCase(),
      serialNumber: isNaN(parsedSerial as number) ? 0 : parsedSerial,
      votesCount: isNaN(parsedVotes as number) ? 0 : parsedVotes,
    });

    setSavedNotice(`Updated ${cand.name} in Firestore!`);
    setEditingCandidateId(null);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleApproveClaim = async (claim: ProfileClaimRequest) => {
    await assignCandidateEmail(claim.candidateId, claim.email);
    await updateClaimStatus(claim.id, 'verified');
    setSavedNotice(`Claim approved! ${claim.email} assigned to ${claim.candidateName}`);
    setTimeout(() => setSavedNotice(null), 4000);
  };

  const handleRejectClaim = async (claim: ProfileClaimRequest) => {
    await updateClaimStatus(claim.id, 'rejected');
  };

  const totalVotesCount = candidates.reduce((sum, c) => sum + (c.votesCount || 0), 0);
  const totalAssignedCandidates = candidates.filter((c) => !!c.claimedEmail).length;

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
              <button
                onClick={onBackToHome}
                className="hover:text-white inline-flex items-center gap-1 font-bold text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to AMUSU Elections Public Site</span>
              </button>
              <span>/</span>
              <span className="text-emerald-400 font-bold">Admin Control Center</span>
            </div>

            <div className="flex items-center gap-2.5 mt-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Election Master Database & Admin Portal
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live Realtime Firestore Database Controller • Authorized Administrator Session Active
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Admin Mode</span>
          </button>
        </div>

        {/* Real-time KPI Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Candidates</span>
            <span className="text-2xl font-black text-white">{candidates.length}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Across 5 union posts</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Claimed / Assigned</span>
            <span className="text-2xl font-black text-emerald-400">{totalAssignedCandidates}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{candidates.length - totalAssignedCandidates} unassigned</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Claims</span>
            <span className="text-2xl font-black text-amber-400">
              {claimRequests.filter((r) => r.status === 'pending').length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Verification requests</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Votes Cast</span>
            <span className="text-2xl font-black text-rose-400">{totalVotesCount.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Real-time tally</span>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2 border-t border-slate-800 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'candidates' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidates & Email Assignment ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'claims' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Verification Claims ({claimRequests.length})</span>
            {claimRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                {claimRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'issues' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Campus Issues Moderation ({issues.length})</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 2. TAB CONTENT PANELS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        {/* TAB 1: CANDIDATES MANAGEMENT */}
        {activeTab === 'candidates' && (
          <div className="space-y-5">
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Manage Election Candidates</h3>
                <p className="text-xs text-slate-500">Add new candidates or manage existing election profiles.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-98 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Candidate</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-1 max-w-xl">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    placeholder="Search candidate name, email, or faculty..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Faculty Dropdown Filter */}
                <select
                  value={filterFaculty}
                  onChange={(e) => setFilterFaculty(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="all">All Faculties</option>
                  {AMU_FACULTIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(['all', 'president', 'vice_president', 'honorary_secretary', 'cabinet_member', 'court_member'] as const).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setFilterPost(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 ${
                        filterPost === p
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Candidates Directory Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Candidate & Post</th>
                      <th className="py-3.5 px-3">Ballot No.</th>
                      <th className="py-3.5 px-3">Assigned Owner Email (Google Login)</th>
                      <th className="py-3.5 px-3">Live Votes</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.map((cand) => {
                      const isEditingThis = editingCandidateId === cand.id;
                      const currentEmail = candidateEmailInput[cand.id] !== undefined
                        ? candidateEmailInput[cand.id]
                        : cand.claimedEmail || '';
                      const currentSerial = candidateSerialInput[cand.id] !== undefined
                        ? candidateSerialInput[cand.id]
                        : (cand.serialNumber ?? 0);
                      const currentVotes = candidateVotesInput[cand.id] !== undefined
                        ? candidateVotesInput[cand.id]
                        : (cand.votesCount ?? 100);

                      return (
                        <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Candidate Column */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-700 border border-slate-300">
                                {cand.avatarUrl ? (
                                  <img src={cand.avatarUrl} alt={cand.name || 'Candidate'} className="w-full h-full object-cover" />
                                ) : (
                                  (cand.name || 'Candidate').charAt(0)
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm">
                                  {cand.name || 'Unnamed Candidate'}
                                </div>
                                <div className="text-[11px] text-slate-400 capitalize">
                                  {(cand.post || '').replace('_', ' ')} • {cand.faculty || 'Faculty'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Ballot Serial Number */}
                          <td className="py-3.5 px-3">
                            {isEditingThis ? (
                              <input
                                type="number"
                                min="0"
                                value={currentSerial}
                                onChange={(e) =>
                                  setCandidateSerialInput((prev) => ({
                                    ...prev,
                                    [cand.id]: e.target.value,
                                  }))
                                }
                                className="w-16 px-2 py-1 rounded-lg border border-slate-300 font-bold text-xs"
                              />
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-black text-xs border border-slate-200">
                                #{cand.serialNumber ?? 0}
                              </span>
                            )}
                          </td>

                          {/* Assigned Email */}
                          <td className="py-3.5 px-3">
                            {isEditingThis ? (
                              <div className="relative">
                                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                                <input
                                  type="email"
                                  value={currentEmail}
                                  onChange={(e) =>
                                    setCandidateEmailInput((prev) => ({
                                      ...prev,
                                      [cand.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="candidate@myamu.ac.in"
                                  className="w-64 pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                                />
                              </div>
                            ) : cand.claimedEmail ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{cand.claimedEmail}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">
                                Unassigned (Click Quick Edit to assign email)
                              </span>
                            )}
                          </td>

                          {/* Live Votes */}
                          <td className="py-3.5 px-3">
                            {isEditingThis ? (
                              <input
                                type="number"
                                min="0"
                                value={currentVotes}
                                onChange={(e) =>
                                  setCandidateVotesInput((prev) => ({
                                    ...prev,
                                    [cand.id]: e.target.value,
                                  }))
                                }
                                className="w-20 px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold"
                              />
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#990000] text-white font-extrabold text-[11px] shadow-2xs">
                                {(cand.votesCount || 0).toLocaleString()} Votes
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isEditingThis ? (
                                <>
                                  <button
                                    onClick={() => handleSaveRow(cand)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingCandidateId(null)}
                                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCandidateId(cand.id);
                                      setCandidateEmailInput((prev) => ({
                                        ...prev,
                                        [cand.id]: cand.claimedEmail || '',
                                      }));
                                      setCandidateSerialInput((prev) => ({
                                        ...prev,
                                        [cand.id]: cand.serialNumber ?? 0,
                                      }));
                                      setCandidateVotesInput((prev) => ({
                                        ...prev,
                                        [cand.id]: cand.votesCount ?? 100,
                                      }));
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                                  >
                                    <Edit className="w-3 h-3" />
                                    <span>Assign Email</span>
                                  </button>

                                  <button
                                    onClick={() => onNavigateToEditCandidate(cand)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Full Profile Editor Page</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteCandidate(cand.id, cand.name)}
                                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-rose-200 shadow-2xs cursor-pointer"
                                    title="Delete Candidate"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Delete</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE CLAIM REQUESTS */}
        {activeTab === 'claims' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Candidate ID Verification & Profile Claims Desk
              </h3>
              <p className="text-xs text-slate-500">
                Review submitted Student ID cards and link verified email addresses with full profile ownership privileges.
              </p>
            </div>

            {claimRequests.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-1">
                <p className="font-bold text-slate-700">No Profile Claim Requests Yet</p>
                <p>When candidates click &ldquo;Claim This Profile&rdquo; on their page, their verification requests will appear here in real time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {claimRequests.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            claim.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {claim.status}
                        </span>
                        <span className="font-extrabold text-base text-slate-900">
                          Claim Request for: {claim.candidateName}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Submitted: {new Date(claim.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant Name</span>
                        <span className="font-semibold text-slate-900">{claim.applicantName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                        <span className="font-semibold text-blue-600">{claim.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Number</span>
                        <span className="font-semibold text-slate-900">{claim.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Enrollment / ID</span>
                        <span className="font-semibold text-slate-900">{claim.studentId}</span>
                      </div>
                      {claim.admissionCardInfo && (
                        <div className="sm:col-span-4 pt-2 border-t border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">ID / Admission Card Link</span>
                          <a
                            href={claim.admissionCardInfo}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                          >
                            <span>{claim.admissionCardInfo}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                      {claim.message && (
                        <div className="sm:col-span-4">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Notes & Details</span>
                          <span className="text-slate-700">{claim.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {claim.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2.5 pt-1">
                        <button
                          onClick={() => handleRejectClaim(claim)}
                          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => handleApproveClaim(claim)}
                          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Assign Profile to {claim.email}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CAMPUS ISSUES MODERATION */}
        {activeTab === 'issues' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Campus Issues & Student Board Moderation
              </h3>
              <p className="text-xs text-slate-500">
                Manage student grievance posts, review discussions, and remove inappropriate submissions.
              </p>
            </div>

            <div className="space-y-3">
              {issues.map((iss) => (
                <div
                  key={iss.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {iss.category}
                      </span>
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">{iss.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{iss.description}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>{iss.upvotesCount} Student Upvotes</span>
                      <span>•</span>
                      <span>{iss.talksCount} Discussions</span>
                      <span>•</span>
                      <span>Status: {iss.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => deleteCampusIssue(iss.id)}
                      className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors border border-rose-200/80"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Issue</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Add New Candidate</h3>
                  <p className="text-xs text-slate-500">Create a clean candidate profile instantly in Firestore.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={newCandName}
                  onChange={(e) => setNewCandName(e.target.value)}
                  placeholder="e.g. Alija Khan"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contesting Union Post</label>
                <select
                  value={newCandPost}
                  onChange={(e) => setNewCandPost(e.target.value as PostType)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="president">President</option>
                  <option value="vice_president">Vice President</option>
                  <option value="honorary_secretary">Honorary Secretary</option>
                  <option value="cabinet_member">Cabinet Member</option>
                  <option value="court_member">Court Member</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty / Department</label>
                <select
                  value={newCandFaculty}
                  onChange={(e) => setNewCandFaculty(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  {AMU_FACULTIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all active:scale-98"
                >
                  Create Candidate Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
