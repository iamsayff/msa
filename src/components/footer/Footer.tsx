import React from 'react';
import { 
  ChevronRight, 
  Heart, 
  Send,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Users,
  Compass
} from 'lucide-react';
import { AmuSkyline } from '../common/AmuSkyline';
import { NavTabId } from '../layout/Sidebar';

interface FooterProps {
  onNavigate: (tab: NavTabId) => void;
  onOpenVoting: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenVoting,
  onOpenAdmin,
}) => {
  const quickLinks: Array<{ label: string; tab: NavTabId }> = [
    { label: 'Home', tab: 'home' },
    { label: 'All Candidates', tab: 'candidates' },
    { label: 'Candidate Manifestos', tab: 'manifesto' },
    { label: 'Important Dates', tab: 'timeline' },
    { label: 'Campus Issues', tab: 'issues' },
    { label: 'Community Guidelines', tab: 'guidelines' },
    { label: 'Privacy Policy', tab: 'privacy' },
    { label: 'Student Support Desk', tab: 'support' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 mt-8 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. LIGHT & GRAPHICALLY BEAUTIFUL ABOUT US SECTION */}
        <div className="bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/20 rounded-3xl p-6 sm:p-7 border border-emerald-100/90 shadow-2xs relative overflow-hidden">
          {/* Subtle decorative background circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Header: Badge & Concise Tagline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>About Our Initiative</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  AMUSU Elections • Know Your Candidates
                </h3>
              </div>
              <p className="text-xs text-slate-500 sm:max-w-md sm:text-right font-medium leading-relaxed">
                An independent, non-partisan student initiative dedicated to transparency, issue awareness, and candidate accountability across Aligarh Muslim University.
              </p>
            </div>

            {/* 4 Graphic Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1 */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-100 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">100% Non-Partisan</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Independent student platform free from external political interference.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-blue-100 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Manifesto-Driven</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Verified policy scrutiny, student priorities & institutional reforms.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-purple-100 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Student-Powered</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Initiative built by AMU peers across all faculties, halls & departments.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Open Dialogue</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Real-time campus issue discussions and democratic accountability.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Heritage Strip & Civic Notice */}
            <div className="pt-2 border-t border-emerald-100/70 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
              <p className="text-slate-600 text-[11px] italic font-medium text-center sm:text-left">
                &ldquo;When a nation becomes devoid of education and intellectual freedom, it ceases to be a nation.&rdquo; — Sir Syed Ahmad Khan
              </p>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[10px] font-bold text-slate-500 shrink-0">
                Non-official Student Civic Platform
              </span>
            </div>
          </div>
        </div>

        {/* 2. MAIN 3-COLUMN FOOTER LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-slate-100">
          {/* Col 1: Brand & Campus Tagline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center">
              <img
                src="https://i.ibb.co/rrNwtYY/Green-Mosque-Emblem-and-Election-Wordmark.png"
                alt="AMUSU Elections.in - Know Your Candidate"
                className="h-18 sm:h-24 w-auto max-w-[340px] sm:max-w-[400px] object-contain drop-shadow-xs transition-transform hover:scale-102"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal max-w-sm">
              Connecting, informing, and empowering the AMU student community. Your voice shapes the future of our university.
            </p>

            {/* Handwritten Quote and Skyline */}
            <div className="pt-2">
              <span className="font-handwriting text-2xl font-bold text-slate-800 block">
                Same Campus. Bigger Dreams.
              </span>
              <div className="pt-2">
                <AmuSkyline className="w-64 h-12 opacity-35" fill="#059669" />
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.tab)}
                    className="text-xs text-slate-500 hover:text-emerald-700 hover:translate-x-1 transition-all flex items-center justify-between w-full py-0.5 group cursor-pointer text-left"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Stay Connected */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Stay Connected</h4>

            {/* Social Icons row */}
            <div className="flex items-center gap-2.5">
              
              {/* Instagram */}
              <a
                href="https://www.instagram.com/amusuelections.in"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://whatsapp.com/channel/0029VbDP92P8F2p9PrEios38"
                className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.979-.276-.101-.477-.15-.678.15-.2.301-.777.979-.953 1.18-.176.2-.351.226-.652.075-.301-.151-1.272-.469-2.423-1.496-.897-.799-1.502-1.787-1.678-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.2-.301.301-.502.101-.201.05-.377-.025-.527-.075-.151-.678-1.633-.929-2.235-.245-.588-.493-.508-.678-.518-.176-.009-.377-.01-.578-.01s-.527.075-.803.377c-.276.301-1.055 1.03-1.055 2.512s1.08 2.912 1.231 3.113c.151.201 2.126 3.245 5.15 4.553.719.311 1.281.497 1.719.636.723.23 1.381.198 1.901.12.579-.087 1.782-.728 2.033-1.432.251-.703.251-1.306.176-1.432-.075-.125-.276-.201-.577-.351z"/>
                </svg>
              </a>
            </div>

            <p className="text-[11px] text-slate-400">
              Follow us for real-time updates, announcements and more.
            </p>

            {/* Quote Card */}
            <div className="bg-[#ecfdf5] border border-emerald-200/90 rounded-2xl p-4 shadow-2xs">
              <p className="font-semibold text-slate-800 text-xs sm:text-sm italic leading-snug">
                &ldquo;We are Independent Student led Initiative to help Fellow AMU Students know about their candidates, and to help the candidates reach more students. A stronger AMU begins with Student AWARENESS.&rdquo;
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 tracking-wider">
                  • Founder - AMUSUElections.in 
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>© 2025 AMUSU Elections. All rights reserved.</span>
            <span>|</span>
            <button
              onClick={() => onOpenAdmin && onOpenAdmin()}
              title="Secret Admin Control Panel"
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold group cursor-pointer transition-transform active:scale-95 text-xs text-left"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 group-hover:scale-125 transition-transform" />
              <span>Built for the AMU Community</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              onClick={() => onNavigate('guidelines')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Community Guidelines
            </button>
            <span>|</span>
            <button
              onClick={() => onNavigate('support')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
