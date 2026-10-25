import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, Lock, LogIn } from 'lucide-react';
import { CampusIssue } from '../../types/election';
import { useAuth } from '../../context/AuthContext';
import { AMU_HALLS, AMU_FACULTIES } from '../../constants/amuData';

interface SubmitIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIssue: (newIssue: Omit<CampusIssue, 'id' | 'talksCount' | 'upvotesCount' | 'status' | 'postedAt'>) => void;
}

export const SubmitIssueModal: React.FC<SubmitIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmitIssue,
}) => {
  const { user, profile, signInWithGoogle } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hostel & Accommodation');
  const [description, setDescription] = useState('');
  const [facultyHall, setFacultyHall] = useState(profile?.hall || profile?.faculty || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Hostel & Accommodation',
    'Academics & Exams',
    'Infrastructure',
    'Mess & Food',
    'Transport',
    'Student Welfare',
  ];

  const isLoggedIn = Boolean(user || profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const locationText = facultyHall.trim() ? ` (Submitted from: ${facultyHall.trim()})` : '';

    onSubmitIssue({
      title: title.trim(),
      category,
      description: `${description.trim()}${locationText}`,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setTitle('');
      setDescription('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#008060] text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PlusCircle className="w-5 h-5 text-emerald-200" />
            <div>
              <h2 className="text-lg font-extrabold leading-none">Submit Student Campus Issue</h2>
              <p className="text-xs text-emerald-100 mt-1">Raise voice directly to student union candidates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isLoggedIn ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Signed Profile Required</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                To prevent spam and ensure genuine student accountability, please sign in with your Google account before posting a campus issue.
              </p>
            </div>
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          </div>
        ) : submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-slate-900">Issue Submitted!</h3>
            <p className="text-xs text-slate-500">
              Your issue has been published in real-time for student discussion and upvoting.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 text-xs text-emerald-900">
              Posting as: <strong className="font-bold">{profile?.name || user?.displayName}</strong> ({profile?.email || user?.email})
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Issue Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Water Cooler breakdown at Aftab Hall"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Residential Hall / Faculty
              </label>
              <select
                value={facultyHall}
                onChange={(e) => setFacultyHall(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">Select Hall or Faculty...</option>
                <optgroup label="Halls of Residence">
                  {AMU_HALLS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </optgroup>
                <optgroup label="Faculties">
                  {AMU_FACULTIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Detailed Description & Suggested Reform
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue clearly and what action the student union should commit to."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold shadow-md active:scale-98 transition-all"
              >
                Post Issue to Forum
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
