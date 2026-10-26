import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Paperclip,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Candidate } from '../../types/election';

interface ClaimProfileModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimProfileModal: React.FC<ClaimProfileModalProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !candidate) return null;

  const emailAddress = 'reach.lastminute@gmail.com';
  
  const mailtoUrl = `mailto:${emailAddress}?subject=Profile%20Claim%20Request%20-%20${encodeURIComponent(
    candidate.name
  )}&body=Dear%20AMUSUElections.in%20Admin,%0A%0AI%20am%20writing%20to%20claim%20my%20candidate%20profile%20page%20for%20${encodeURIComponent(
    candidate.name
  )}%20(${encodeURIComponent(
    candidate.post.replace('_', ' ').toUpperCase()
  )}).%0A%0AI%20have%20attached%20my%20Admission%20Card/ID%20Card/Registration%20Card%20for%20verification.%0A%0ACandidate%20Name:%20${encodeURIComponent(candidate.name)}%0APost:%20${encodeURIComponent(candidate.post.replace('_', ' ').toUpperCase())}%0A%0APlease%20verify%20my%20documents%20and%20enable%20profile%20editing%20access.`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Container */}
        <div className="flex flex-col">
          {/* Header/Icon */}
          <div className="pt-10 pb-6 px-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 rotate-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Claim Your Profile
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Verify your identity to manage <span className="text-emerald-600 font-bold">{candidate.name}'s</span> page.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pb-10 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 1: Contact Admin</p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Send an email to <span className="font-bold text-slate-900">{emailAddress}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Paperclip className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 2: Attach ID</p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    Attach your <span className="font-bold text-slate-900 italic">Admission Card, ID Card, or Registration Card</span> for verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="space-y-3 pt-2">
              <a
                href={mailtoUrl}
                className="group relative flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <span>Email Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              
              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                <ExternalLink className="w-3 h-3" />
                <span>Opens Default Email App</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
      </div>
    </div>
  );
};
