import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Search, 
  Download, 
  ExternalLink, 
  Heart, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Check 
} from 'lucide-react';
import { POST_CATEGORIES, MANIFESTO_POLICIES } from '../data/mockElectionData';
import { useElection } from '../context/ElectionContext';
import { Candidate, PostType } from '../types/election';

interface ManifestoPageProps {
  onBackToDashboard: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onSupportCandidate: (candidate: Candidate) => void;
  initialPostFilter?: PostType | 'all';
}

export const ManifestoPage: React.FC<ManifestoPageProps> = ({
  onBackToDashboard,
  onSelectCandidate,
  onSupportCandidate,
  initialPostFilter = 'all',
}) => {
  const { candidates } = useElection();
  const [filterPost, setFilterPost] = useState<PostType | 'all'>(initialPostFilter);
  const [search, setSearch] = useState('');

  // Filter candidates based on selected post and search query
  const filteredCandidates = candidates.filter((c) => {
    const matchesPost = filterPost === 'all' || c.post === filterPost;
    const matchesSearch =
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.faculty.toLowerCase().includes(search.toLowerCase()) ||
      (c.manifestoHighlights || []).some((m) => m.toLowerCase().includes(search.toLowerCase())) ||
      (c.visionGoals || []).some((v) => v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase()));
    return matchesPost && matchesSearch;
  });

  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          AMUSU Elections 2025 • Candidate Manifestos
        </span>
      </div>

      {/* Hero Banner for Manifestos */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0b1528] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl ring-1 ring-emerald-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AMUSU Candidate Manifestos & Agendas
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Read comprehensive reform pledges, university development goals, and official documents.
            </p>
          </div>
        </div>

        {/* Filter Tabs and Search Bar */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-white/10">
          {/* Post categories filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full md:w-auto">
            <button
              onClick={() => setFilterPost('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterPost === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              All Manifestos
            </button>
            {POST_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterPost(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  filterPost === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agendas & pledges..."
              className="w-full px-4 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* University Reforms Benchmark Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-extrabold text-slate-900">
            AMU Core Institutional Reform Benchmarks
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Standard student priorities across all faculties against which candidate manifestos are evaluated:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {MANIFESTO_POLICIES.map((pol) => (
            <div
              key={pol.id}
              className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5"
            >
              <h3 className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{pol.title}</span>
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">{pol.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Manifestos Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            Contesting Candidates & Official Pledges ({filteredCandidates.length})
          </h2>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No Manifestos Matched Your Query</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or selecting a different union post category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredCandidates.map((cand) => {
              const cat = POST_CATEGORIES.find((p) => p.id === cand.post);
              return (
                <div
                  key={cand.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3.5">
                    {/* Candidate Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {cand.avatarUrl ? (
                          <img
                            src={cand.avatarUrl}
                            alt={cand.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-2xs"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base shadow-2xs">
                            {cand.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                              {cand.name}
                            </h3>
                            <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              #{cand.serialNumber ?? 0}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {cat?.label} • {cand.faculty}
                          </p>
                        </div>
                      </div>

                      <span 
                        className="text-[10px] font-black px-3 py-1 rounded-full text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: cat?.themeColor.accentColor || '#059669' }}
                      >
                        {cat?.label}
                      </span>
                    </div>

                    {/* Slogan */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs italic text-slate-700">
                      &ldquo;{cand.quote}&rdquo;
                    </div>

                    {/* Key Manifesto Highlights */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Key Manifesto Pledges:
                      </span>
                      <ul className="space-y-2">
                        {(cand.manifestoHighlights || []).map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 5-point Vision items if available */}
                    {cand.visionGoals && cand.visionGoals.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          Vision Goals:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {cand.visionGoals.slice(0, 2).map((vg) => (
                            <div key={vg.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                              <span className="font-bold text-slate-800 block text-[11px] truncate">{vg.title}</span>
                              <span className="text-[10px] text-slate-500 line-clamp-1">{vg.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Download PDF, View Full Profile, Support */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {cand.manifestoPdfUrl ? (
                      <a
                        href={cand.manifestoPdfUrl}
                        download={cand.manifestoPdfName || 'Manifesto.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Digital Manifesto Verified
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCandidate(cand)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                      >
                        <span>Full Profile</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </button>

                      <button
                        onClick={() => onSupportCandidate(cand)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Show Support</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
