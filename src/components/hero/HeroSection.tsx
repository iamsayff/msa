import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Timer, 
  Hourglass,
  Heart,
  FileText
} from 'lucide-react';

interface HeroSectionProps {
  onCastVote: () => void;
  onViewManifesto: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onCastVote,
  onViewManifesto,
}) => {
  // Live countdown timer state: 12d 6h 34m 20s
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 3,
    minutes: 23,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format2Digits = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="relative pt-2 pb-8">
      <div className="max-w-4xl space-y-6">
        {/* Badge: AMU ELECTIONS 2025 */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-bold tracking-wide">
          <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>AMU ELECTIONS 2025</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.14]">
          Shape a Better <br className="hidden sm:inline" />
          <span className="text-[#008060] inline-block relative">
            AMU
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#008060]/20 rounded-full" />
          </span>{' '}
          Together
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
          Meet the candidates, explore their vision, and make an informed choice for a stronger, brighter AMU.
        </p>

        {/* Countdown Box */}
        <div className="bg-[#fefce8] border border-amber-200/90 rounded-2xl p-4 sm:p-5 max-w-xl shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900/80 mb-3.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE
            </span>
            <span>Elections Begin In</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
            {/* Days */}
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-amber-200/60 shadow-2xs">
              <span className="block text-2xl sm:text-3xl font-extrabold text-rose-600 leading-none">
                {format2Digits(timeLeft.days)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1.5">
                Days <Calendar className="w-2.5 h-2.5 text-slate-400" />
              </span>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-amber-200/60 shadow-2xs">
              <span className="block text-2xl sm:text-3xl font-extrabold text-blue-600 leading-none">
                {format2Digits(timeLeft.hours)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1.5">
                Hours <Clock className="w-2.5 h-2.5 text-slate-400" />
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-amber-200/60 shadow-2xs">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-none">
                {format2Digits(timeLeft.minutes)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1.5">
                Minutes <Timer className="w-2.5 h-2.5 text-slate-400" />
              </span>
            </div>

            {/* Seconds */}
            <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-amber-200/60 shadow-2xs">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-600 leading-none">
                {format2Digits(timeLeft.seconds)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1.5">
                Seconds <Hourglass className="w-2.5 h-2.5 text-slate-400" />
              </span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-1">
          <div className="flex flex-wrap items-center gap-4">
            {/* Support Your Candidates Button */}
            <button
              onClick={onCastVote}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-500/20 hover:shadow-lg active:scale-[0.98] transition-all group cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Support Your Candidates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* View Manifesto Button */}
            <button
              onClick={onViewManifesto}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-emerald-400/80 text-emerald-800 font-bold text-sm tracking-wide shadow-2xs hover:shadow-sm active:scale-[0.98] transition-all group cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>View Manifestos</span>
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Sub-badge: LIVE • STUDENT SUPPORT PLATFORM OPEN */}
          <div className="flex items-center gap-2 mt-3 text-[11px] font-bold text-emerald-700 pl-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
            <span className="tracking-wider uppercase">Live • Student Support Platform Open</span>
          </div>
        </div>
      </div>
    </section>
  );
};
