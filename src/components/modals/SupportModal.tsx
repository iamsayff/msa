import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  ShieldCheck, 
  X, 
  LogIn, 
  Sparkles,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, signInWithGoogle } = useAuth();
  const [copied, setCopied] = useState(false);
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [volunteerEmail, setVolunteerEmail] = useState('');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      'Check out AMUSUElections.in — The official student-led democracy portal for AMUSU Elections 2025! Explore candidate profiles, manifestos, and cast your vote: ' + window.location.origin
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerEmail.trim()) return;
    setVolunteerSubmitted(true);
    setTimeout(() => {
      setVolunteerSubmitted(false);
      setVolunteerEmail('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Support AMUSUElections.in</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Empowering student democracy across Aligarh Muslim University
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            <strong>AMUSUElections.in</strong> is run independently by students to promote transparency, manifesto debates, and fair elections. We do not accept political advertisements or outside endorsements.
          </p>
          <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Here is how you can support our university democracy:</span>
          </p>
        </div>

        {/* 1. Share & Spread the Word */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                1. Share with Halls & Faculties
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">#AMUPulse</span>
          </div>
          <p className="text-xs text-slate-500">
            Share the portal on WhatsApp groups and hostel notices so every student knows their leaders before voting.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Portal Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold transition-colors border border-[#25D366]/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* 2. Join as Campus Volunteer */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              2. Volunteer with Election Desk
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            Help verify candidate manifestos, report hall polling updates, or contribute design & tech skills.
          </p>

          {volunteerSubmitted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Our volunteer coordinator will reach out.</span>
            </div>
          ) : (
            <form onSubmit={handleVolunteerSubmit} className="flex gap-2 pt-1">
              <input
                type="email"
                required
                value={volunteerEmail}
                onChange={(e) => setVolunteerEmail(e.target.value)}
                placeholder="Enter your AMU or personal email"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs shrink-0"
              >
                Join Team
              </button>
            </form>
          )}
        </div>

        {/* 3. Sign In as Verified Voter */}
        {!user && !profile && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <h4 className="font-extrabold text-xs text-amber-900 uppercase tracking-wider">
                3. Register Your Student Profile
              </h4>
            </div>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              Sign in with your Google account to cast sample ballots, upvote campus issues, and participate in discussion forums.
            </p>
            <button
              onClick={() => {
                onClose();
                signInWithGoogle();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs active:scale-98 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          </div>
        )}

        <div className="pt-2 text-center border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            Aligarh Muslim University • Est. 1875 • Student Democracy Initiative
          </p>
        </div>
      </div>
    </div>
  );
};
