import React from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  ShieldAlert, 
  Scale, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  Check, 
  XCircle,
  Flag,
  HelpCircle
} from 'lucide-react';

interface GuidelinesPageProps {
  onBackToDashboard: () => void;
  onNavigateToSupport?: () => void;
}

export const GuidelinesPage: React.FC<GuidelinesPageProps> = ({ 
  onBackToDashboard,
  onNavigateToSupport
}) => {
  return (
    <div className="py-6 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl transition-all shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          AMUSU Elections.in • Democratic Code of Conduct
        </span>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/20 p-6 sm:p-9 border border-emerald-100 shadow-2xs overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Community & Democratic Guidelines</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Fairness, Impartiality & Student Empowerment
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
            We are an independent student-led initiative. We are not official, and we do not take sides. This platform is 100% free forever. Our sole mission is to help AMU students evaluate manifestos, know their candidates, and decide who best serves our university.
          </p>
        </div>
      </div>

      {/* 3 Core Ethical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">100% Impartial & Non-Partisan</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            AMUSU Elections.in does not endorse, favor, or promote any contesting candidate, slate, or student organization. Every contestant receives equal digital space and discovery.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">100% Free For Everyone</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            There are zero paid features. No candidate can pay for top placement, boosted cards, or sponsored visibility. The platform is entirely free for all AMU students and contestants.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Empowering Informed Decisions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            By aggregating verified agendas, video messages, and student issue debates in one place, we enable peers across all faculties to make educated, issue-based choices.
          </p>
        </div>
      </div>

      {/* Do's and Don'ts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* DO's */}
        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base">Platform Standards We Encourage</h3>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Issue-Focused Debate:</strong> Critique candidate manifestos, hostel food quality, and library hours constructively on the Campus Issues board.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Candidate Transparency:</strong> Candidates are encouraged to upload authentic campaign videos, verified credentials, and full manifesto PDFs.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Civil Student Discourse:</strong> Treat peers across different faculties, halls, and academic programs with dignity and mutual respect.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Fact-Checking & Feedback:</strong> Promptly report any outdated candidate information so volunteer moderators can verify and correct records.</span>
            </li>
          </ul>
        </div>

        {/* DON'Ts */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-rose-800">
            <XCircle className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-base">Actions Strictly Prohibited</h3>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>No Slander or Defamation:</strong> Unsubstantiated personal attacks, character assassination, or abusive language will be removed immediately.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>No Automated Voting Bots:</strong> Any script or bot manipulation of candidate support counts triggers automatic IP blocking and reset.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>No Candidate Impersonation:</strong> Falsely claiming another student&apos;s candidate profile is an academic violation subject to university report.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>No Hate Speech or Sectarianism:</strong> Content promoting regional, sectarian, or identity polarization is strictly zero-tolerance.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Community Reporting Box */}
      <div className="bg-[#f0fdf4] border border-emerald-200 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              Notice a Violation or Incorrect Candidate Data?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Help us maintain democratic integrity. Our volunteer student moderation team reviews all reports within hours.
            </p>
          </div>
        </div>

        {onNavigateToSupport && (
          <button
            onClick={onNavigateToSupport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Contact Help Desk</span>
          </button>
        )}
      </div>
    </div>
  );
};
