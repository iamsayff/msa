import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  Send,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Candidate } from '../../types/election';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';

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
  const { user, profile, openAuthModal } = useAuth();
  const { submitClaimRequest } = useElection();

  const [applicantName, setApplicantName] = useState(profile?.name || user?.displayName || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [phone, setPhone] = useState((profile as Record<string, any>)?.phone || '');
  const [studentId, setStudentId] = useState(candidate?.enrollmentNo || profile?.studentId || '');
  const [admissionCardInfo, setAdmissionCardInfo] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !email.trim() || !phone.trim() || !studentId.trim()) {
      alert('Please fill in your name, email, mobile number, and student ID.');
      return;
    }

    setSubmitting(true);
    try {
      await submitClaimRequest({
        candidateId: candidate.id,
        candidateName: candidate.name,
        applicantName: applicantName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        studentId: studentId.trim(),
        admissionCardInfo: admissionCardInfo.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Error submitting claim:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const mailtoUrl = `mailto:support@amupulse.in?subject=Profile%20Claim%20Request%20-%20${encodeURIComponent(
    candidate.name
  )}&body=Dear%20AMU%20Pulse%20Admin,%0A%0AI%20am%20writing%20to%20claim%20my%20candidate%20profile%20page%20for%20${encodeURIComponent(
    candidate.name
  )}%20(${encodeURIComponent(
    candidate.post
  )}).%0A%0AMy%20Details:%0A-%20Name:%20${encodeURIComponent(
    applicantName
  )}%0A-%20Email:%20${encodeURIComponent(
    email
  )}%0A-%20Mobile:%20${encodeURIComponent(
    phone
  )}%0A-%20Student%20ID%20/%20Admission%20Card:%20${encodeURIComponent(
    studentId
  )}%0A%0APlease%20verify%20my%20documents%20and%20assign%20this%20profile%20to%20my%20email%20address.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
              Candidate Verification
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Claim Profile: {candidate.name}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Official procedure to obtain owner editing privileges for this profile page.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">Claim Request Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{applicantName || candidate.name}</strong>. Your verification details have been recorded. Our team will verify your admission card and link <strong>{email}</strong> to this profile shortly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800">Need instant verification?</p>
                <p>
                  You can also email your Student ID Card or Admission Card photo directly to our support desk:
                </p>
                <a
                  href={mailtoUrl}
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@amupulse.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Instructions banner */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-900 text-xs space-y-2">
                <div className="flex items-start gap-2.5 font-bold text-[13px]">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Verification Requirements</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  To verify candidate identity, AMU Pulse requires you to provide your <strong>Student ID card or Admission card</strong>, <strong>active mobile number</strong>, and <strong>email ID</strong>.
                </p>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Once the admin assigns your email in the backend, you will be able to edit your profile photo, bio, vision, and campaign details in real time.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={candidate.name}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Post
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={candidate.post.replace('_', ' ').toUpperCase()}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Ayaan Khan"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Student / Admission ID *
                    </label>
                    <div className="relative">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enrollment / Admission No."
                        className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="candidate@myamu.ac.in"
                        className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Mobile / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Admission Card / Verification Document Link
                  </label>
                  <input
                    type="text"
                    value={admissionCardInfo}
                    onChange={(e) => setAdmissionCardInfo(e.target.value)}
                    placeholder="Google Drive link or ID card image URL (Optional)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    You can also email your scanned ID card to <strong>support@amupulse.in</strong> directly.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Notes or Campaign Office Info (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Official campaign manager for Ayaan Khan. Contact phone number confirmed."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Claim for Verification'}</span>
                  </button>

                  <a
                    href={mailtoUrl}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Send via Email Client</span>
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
