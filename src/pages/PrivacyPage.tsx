import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  UserCheck, 
  Sparkles, 
  Database, 
  Heart, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PrivacyPageProps {
  onBackToDashboard: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBackToDashboard }) => {
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
          AMUSU Elections.in • Transparency & Trust
        </span>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/20 p-6 sm:p-9 border border-emerald-100 shadow-2xs overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Independent Student Initiative • Privacy Guarantee</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Privacy Policy & Student Data Protection
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
            AMUSU Elections.in is an independent, student-led, non-official, and 100% free platform. Our sole purpose is to help AMU students evaluate manifestos, know their candidates, and make informed choices with complete confidentiality.
          </p>
        </div>
      </div>

      {/* 4 Core Pillars of our Privacy Commitment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <EyeOff className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Secret Support Choices</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your candidate choices and bookmarks are kept confidential. We never publicly display which candidate an individual student supports.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Lock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Zero Commercial Ads</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            This site is 100% free and volunteer-run. We never sell student data, run commercial ad networks, or share information with third-party marketers.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Strictly Non-Official</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We are an independent student initiative and not affiliated with the official AMU administrative election office. We take zero political sides.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Database className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">Encrypted Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All stored student records and discussion posts are protected with Firebase Firestore security rules and SSL encryption.
          </p>
        </div>
      </div>

      {/* Comprehensive Policy Articles */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-7">
        {/* Article 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">1</span>
            <h2 className="font-extrabold text-base text-slate-900">Information We Collect</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
            When you sign in using Google Authentication, we collect your display name and email address. This is strictly required to verify student identity, maintain community safety on the campus issues board, and prevent automated voting bots from skewing democratic support counts. You may optionally provide your faculty and hall of residence on your profile to customize your peer view.
          </p>
        </div>

        {/* Article 2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">2</span>
            <h2 className="font-extrabold text-base text-slate-900">How Student Data is Used</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
            Your data is used solely to provide a transparent, interactive experience on AMUSU Elections.in. We aggregate support counts across contesting union candidates to present public student enthusiasm trends. Individual voting selections are never displayed publicly, nor are they linked to any voter roll.
          </p>
        </div>

        {/* Article 3 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">3</span>
            <h2 className="font-extrabold text-base text-slate-900">Candidate Profiles & Manifesto Transparency</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
            Candidate biographical records, speeches, videos, and election manifestos displayed on this site are collected from public student announcements or provided directly by the contesting candidates. Every candidate retains full intellectual property over their campaign materials and may request modifications or profile claiming through our verified candidate desk at any time.
          </p>
        </div>

        {/* Article 4 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">4</span>
            <h2 className="font-extrabold text-base text-slate-900">Account Deletion & Data Rights</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
            You may sign out at any moment. If you wish to delete your saved profile records, campus issue posts, or candidate support bookmarks from our database, please contact our student team at <span className="font-bold text-emerald-800">support@amusuelections.in</span> and your data will be permanently wiped within 24 hours.
          </p>
        </div>

        {/* Non-official Civic Callout */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed space-y-1">
            <span className="font-extrabold block">Important Civic Notice</span>
            <p>
              AMUSU Elections.in is an independent, non-official student awareness portal. It is not managed, sponsored, or affiliated with the official Returning Officer or the Proctorial Election Committee of Aligarh Muslim University. Official election notices, nominations, and polling procedures are issued exclusively by AMU administration at amu.ac.in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
