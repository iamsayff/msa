import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Filter, 
  SlidersHorizontal, 
  Users, 
  GraduationCap, 
  Vote, 
  Heart,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { Candidate, PostCategoryConfig, PostType } from '../types/election';
import { POST_CATEGORIES, MOCK_CANDIDATES } from '../data/mockElectionData';
import { CandidateCard } from '../components/candidates/CandidateCard';
import { AmuSkyline } from '../components/common/AmuSkyline';
import { useElection } from '../context/ElectionContext';

interface AllCandidatesPageProps {
  onBackToHome: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onCastVote: () => void;
  ballotSelections: Record<PostType, string>;
  initialPostFilter?: PostType | 'all';
}

export const AllCandidatesPage: React.FC<AllCandidatesPageProps> = ({
  onBackToHome,
  onSelectCandidate,
  onCastVote,
  ballotSelections,
  initialPostFilter = 'all',
}) => {
  const { candidates = [] } = useElection();
  const candidateList = candidates;

  const [selectedPost, setSelectedPost] = useState<PostType | 'all'>(initialPostFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc' | 'votes'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Unique faculties from candidates
  const faculties = useMemo(() => {
    const list = Array.from(new Set(candidateList.map((c) => c.faculty)));
    return list.sort();
  }, [candidateList]);

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    return candidateList.filter((c) => {
      const matchesPost = selectedPost === 'all' || c.post === selectedPost;
      const matchesFaculty = selectedFaculty === 'all' || c.faculty === selectedFaculty;
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.symbolName && c.symbolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        String(c.serialNumber ?? 0).includes(searchQuery);

      return matchesPost && matchesFaculty && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      // Default & votes sort both sort by highest votes descending first, grouped by post category
      return (b.votesCount || 0) - (a.votesCount || 0);
    });
  }, [candidateList, selectedPost, selectedFaculty, searchQuery, sortBy]);

  const totalCandidateCount = candidateList.length;


  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation Back */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-800">All Candidates</span>
        </div>

        {/* Quick action: Open Support Booth */}
        <button
          onClick={onCastVote}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          <span>Support Candidates</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs overflow-hidden">
        {/* Subtle background skyline watermark */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
          <AmuSkyline className="w-96 h-20" fill="#059669" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Official Contesting List • AMUSU 2025</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            AMU Election Candidates Directory
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed font-normal">
            Explore verified candidate profiles, faculty backgrounds, manifestos, and official ballot serial numbers across all 5 student union posts.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
            <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200/80">
              {totalCandidateCount} Contesting Candidates
            </span>
            <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200/80">
              5 Union Posts
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200">
              Verified Nomination Scrutiny
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs space-y-4">
        {/* Category Post Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedPost('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedPost === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Candidates ({MOCK_CANDIDATES.length})
          </button>

          {POST_CATEGORIES.map((cat) => {
            const count = MOCK_CANDIDATES.filter((c) => c.post === cat.id).length;
            const isSelected = selectedPost === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedPost(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? `${cat.themeColor.buttonBg} text-white shadow-sm`
                    : `${cat.themeColor.badgeBg} ${cat.themeColor.badgeText} hover:brightness-95 border ${cat.themeColor.border}`
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Search, Faculty, Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, faculty, or quote..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            {/* Faculty Dropdown */}
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Faculties</option>
              {faculties.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="default">Sort: Official Order</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="votes">Most Supports</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Display */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-2xs space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Candidates Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No candidates matched your search criteria. Try clearing filters or searching with a different keyword.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFaculty('all');
              setSelectedPost('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : selectedPost === 'all' ? (
        /* Grouped by Category */
        <div className="space-y-10">
          {POST_CATEGORIES.map((cat) => {
            const candidatesInCat = filteredCandidates.filter((c) => c.post === cat.id);
            if (candidatesInCat.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between p-3.5 sm:px-5 sm:py-3 rounded-2xl bg-white border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: cat.themeColor.accentColor }}
                    >
                      <Users className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">
                        {cat.label} Candidates
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                        {candidatesInCat.length} Verified Contestants
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: cat.themeColor.accentColor }}
                  >
                    {cat.label}
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {candidatesInCat.map((cand) => (
                    <CandidateCard
                      key={cand.id}
                      candidate={cand}
                      categoryConfig={cat}
                      onSelect={onSelectCandidate}
                      onQuickVote={() => onSelectCandidate(cand)}
                      isVoted={ballotSelections[cand.post] === cand.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Selected Category View */
        <div className="space-y-6">
          {(() => {
            const currentCat = POST_CATEGORIES.find((c) => c.id === selectedPost)!;
            return (
              <>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{currentCat.label} Candidates</h2>
                    <p className="text-xs text-slate-400">Showing all contesting leaders for {currentCat.label}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: currentCat.themeColor.accentColor }}
                  >
                    {filteredCandidates.length} Candidates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCandidates.map((cand) => (
                    <CandidateCard
                      key={cand.id}
                      candidate={cand}
                      categoryConfig={currentCat}
                      onSelect={onSelectCandidate}
                      onQuickVote={() => onSelectCandidate(cand)}
                      isVoted={ballotSelections[cand.post] === cand.id}
                    />
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
