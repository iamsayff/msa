import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  Send, 
  Check, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin,
  Heart
} from 'lucide-react';

interface SupportPageProps {
  onBackToDashboard: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onBackToDashboard }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('candidate_update');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'Is AMUSU Elections.in an official university voting website?',
      a: 'No. AMUSU Elections.in is an independent, non-official student-led initiative. It is not affiliated with the administrative election office or Returning Officer of Aligarh Muslim University. Official voting takes place in physical booths established by the university administration. Our platform exists solely to help students learn about candidate manifestos, agendas, and achievements in one organized, accessible directory.'
    },
    {
      q: 'Does this platform endorse or favor any candidate or slate?',
      a: 'Absolutely not. We maintain 100% strict non-partisanship and impartiality. Every contesting candidate across all five union posts receives equal profile slots, identical display dimensions, and equal discovery opportunity. We take no political sides.'
    },
    {
      q: 'Is there any fee for students or candidates to use this platform?',
      a: 'Never. AMUSU Elections.in is 100% free forever. We do not accept sponsored ads, and no candidate is ever permitted to pay for promoted placement or priority ranking.'
    },
    {
      q: 'How can contesting candidates edit their photos, intro videos, or manifestos?',
      a: 'Candidates can claim their verified profile by signing in with their official email and clicking "Edit Profile Details" on their candidate page. Candidates can update their bio, manifesto highlights, manifesto PDF, intro video link, and campaign gallery photos at any time.'
    },
    {
      q: 'What is the "Support" button on candidate cards?',
      a: 'The Support button allows verified AMU students to express informal peer encouragement. It is completely confidential and helps the student community gauge collective enthusiasm around various reform pledges.'
    },
    {
      q: 'How can students submit campus issues for candidate debate?',
      a: 'Any verified student can post campus challenges, dining concerns, or academic priorities under the "Campus Issues" section. These discussions are compiled to formulate candidate debate questions at Kennedy Auditorium.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

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
          AMUSU Elections.in • Student Support Desk
        </span>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/20 p-6 sm:p-9 border border-emerald-100 shadow-2xs overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Independent Student Help Desk • 100% Free</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Student Support & Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
            Have questions about candidate manifestos, profile claiming, or the election timeline? We are an independent student initiative committed to helping every AMU student make an informed democratic decision.
          </p>
        </div>
      </div>

      {/* Quick Contact Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Mail className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Email Volunteer Desk</h3>
          <p className="text-xs text-slate-500 leading-snug">
            Direct student coordination for profile updates and data corrections.
          </p>
          <p className="text-xs font-bold text-emerald-800 pt-1">
            support@amusuelections.in
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Volunteer Response Time</h3>
          <p className="text-xs text-slate-500 leading-snug">
            Our volunteer student team actively responds within 2-4 hours daily.
          </p>
          <p className="text-xs font-bold text-blue-800 pt-1">
            Active 9:00 AM — 10:00 PM
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">On-Campus Help Desk</h3>
          <p className="text-xs text-slate-500 leading-snug">
            Student volunteer counters during lunch hours and evening assemblies.
          </p>
          <p className="text-xs font-bold text-purple-800 pt-1">
            Kennedy Hall & Strachey Lawn
          </p>
        </div>
      </div>

      {/* Main Content: FAQ Accordion + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive FAQ Accordion */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact & Issue Submission Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Send a Message to Volunteers
              </h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Need candidate info verified, profile claimed, or have a suggestion? Drop us a note below:
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-sm text-emerald-950">Message Dispatched!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you for reaching out. A student volunteer will follow up with you promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Ahmad"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tariq@myamu.ac.in"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="candidate_update">Candidate Profile Update</option>
                    <option value="claim_profile">Profile Claim Verification</option>
                    <option value="report_issue">Report Platform/Data Issue</option>
                    <option value="general_feedback">General Feedback & Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or suggested correction..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Volunteers</span>
                </button>
              </form>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Independent initiative • Built with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> by AMU students
          </div>
        </div>
      </div>
    </div>
  );
};
