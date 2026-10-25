import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  User, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Star, 
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { Candidate, PostCategoryConfig, PostType } from '../../types/election';
import { POST_CATEGORIES, MOCK_CANDIDATES } from '../../data/mockElectionData';
import { CandidateCard } from './CandidateCard';
import { AmuSkyline } from '../common/AmuSkyline';
import { useElection } from '../../context/ElectionContext';

interface CandidatesSectionProps {
  onSelectCandidate: (candidate: Candidate) => void;
  onExploreCategory: (category: PostType) => void;
  externalSearch?: string;
}

export const CandidatesSection: React.FC<CandidatesSectionProps> = ({
  onSelectCandidate,
  onExploreCategory,
  externalSearch = '',
}) => {
  const { candidates = MOCK_CANDIDATES } = useElection();
  const [selectedPostFilter, setSelectedPostFilter] = useState<PostType | 'all'>('all');
  const [candidateSearch, setCandidateSearch] = useState('');

  // Active search query combines local search or global header search
  const activeSearch = externalSearch || candidateSearch;

  // Category icons mapping
  const categoryIcons: Record<PostType, React.ElementType> = {
    president: User,
    vice_president: Users,
    honorary_secretary: UserCheck,
    cabinet_member: Award,
    court_member: Star,
  };

  // Filter candidates
  const filteredCandidates = (candidates.length > 0 ? candidates : MOCK_CANDIDATES).filter((c) => {
    const matchesSearch =
      activeSearch === '' ||
      c.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      c.faculty.toLowerCase().includes(activeSearch.toLowerCase()) ||
      c.quote.toLowerCase().includes(activeSearch.toLowerCase());
    return matchesSearch;
  });


  // Categories to display
  const categoriesToDisplay = POST_CATEGORIES.filter(
    (cat) => selectedPostFilter === 'all' || selectedPostFilter === cat.id
  );

  return (
    <section id="candidates-section" className="pt-3 pb-6 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet the Candidates
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl font-normal">
            Explore the verified profiles and manifestos of candidate leaders contesting in AMU Elections 2025.
          </p>
        </div>

        {/* Search Candidate Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={candidateSearch}
            onChange={(e) => setCandidateSearch(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Role Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedPostFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPostFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Posts
        </button>

        {POST_CATEGORIES.map((cat) => {
          const isSelected = selectedPostFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedPostFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? `${cat.themeColor.buttonBg} text-white shadow-sm`
                  : `${cat.themeColor.badgeBg} ${cat.themeColor.badgeText} hover:brightness-95 border ${cat.themeColor.border}`
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Rows */}
      <div className="space-y-10">
        {categoriesToDisplay.map((cat) => {
          const candidatesInCat = filteredCandidates.filter((c) => c.post === cat.id);
          const Icon = categoryIcons[cat.id];

          if (candidatesInCat.length === 0 && activeSearch) {
            return null;
          }

          return (
            <div key={cat.id} className="space-y-4">
              {/* Category Header Row */}
              <div className="relative flex items-center justify-between p-3.5 sm:px-5 sm:py-3 rounded-2xl bg-white border border-slate-100 shadow-2xs overflow-hidden">
                {/* AMU Minaret Skyline Watermark on the Right */}
                <div className="absolute right-28 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
                  <AmuSkyline className="w-56 h-10 opacity-15" fill={cat.themeColor.accentColor} />
                </div>

                {/* Left: Category Icon & Title */}
                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: cat.themeColor.accentColor }}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-none">
                      {cat.label}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                      Candidates
                    </p>
                  </div>
                </div>

                {/* Right: View All Button */}
                <button
                  onClick={() => onExploreCategory(cat.id)}
                  className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-bold transition-transform hover:scale-102 active:scale-98 shadow-xs"
                  style={{ backgroundColor: cat.themeColor.accentColor }}
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Cards Grid: 3 Candidate Cards + 1 View All Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Candidates in category */}
                {candidatesInCat.slice(0, 3).map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    categoryConfig={cat}
                    onSelect={onSelectCandidate}
                  />
                ))}

                {/* If fewer than 3 candidates found in search, fill or show match */}
                {candidatesInCat.length === 0 && (
                  <div className="col-span-3 py-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                    No candidates found matching &ldquo;{activeSearch}&rdquo; in {cat.label}
                  </div>
                )}

                {/* 4th Card: "View All" Card */}
                <div
                  className={`rounded-2xl ${cat.themeColor.viewAllBorder} ${cat.themeColor.viewAllBg} p-5 flex flex-col items-center justify-between text-center transition-all hover:shadow-md h-full group`}
                >
                  <div className="w-full flex flex-col items-center pt-2">
                    {/* Centered Icon Button */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xs mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: cat.themeColor.accentColor }}
                    >
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {cat.label}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-0.5">View All</h4>
                    <p className="text-xs text-slate-400 mt-1">All profiles & manifests</p>
                  </div>

                  {/* Explore All Button */}
                  <button
                    onClick={() => onExploreCategory(cat.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-white font-bold text-xs tracking-wide shadow-xs hover:brightness-105 active:scale-98 transition-all mt-4"
                    style={{ backgroundColor: cat.themeColor.accentColor }}
                  >
                    <span>Explore All</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
