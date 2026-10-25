import React from 'react';
import { Calendar, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TIMELINE_PHASES } from '../../data/mockElectionData';
import { TimelinePhase } from '../../types/election';

interface TimelineSectionProps {
  onOpenDetailedTimeline: (phase?: TimelinePhase) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  onOpenDetailedTimeline,
}) => {
  return (
    <section id="timeline-section" className="pt-6 pb-6 border-t border-slate-100">
      {/* Header and Badge */}
      <div className="text-center max-w-3xl mx-auto space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Official AMU Elections Roadmap</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Key Election Dates & Timeline
        </h2>

        <p className="text-sm text-slate-500 font-normal">
          Approved schedule ratified by the AMU Chief Election Officer. Mark your calendar for key polling phases.
        </p>
      </div>

      {/* 5 Timeline Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {TIMELINE_PHASES.map((phase) => {
          // Dynamic badge styles based on status
          let badgeClass = 'bg-slate-100 text-slate-700';
          let dateCircleClass = 'bg-blue-600 text-white';

          if (phase.status === 'Completed') {
            badgeClass = 'bg-blue-50 text-blue-700 border border-blue-200';
            dateCircleClass = 'bg-blue-600 text-white';
          } else if (phase.status === 'Ongoing') {
            badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            dateCircleClass = 'bg-emerald-600 text-white';
          } else if (phase.id === 3) {
            badgeClass = 'bg-rose-50 text-rose-700 border border-rose-200';
            dateCircleClass = 'bg-rose-600 text-white';
          } else if (phase.id === 4) {
            badgeClass = 'bg-purple-50 text-purple-700 border border-purple-200';
            dateCircleClass = 'bg-purple-600 text-white';
          } else if (phase.status === 'Voting Day') {
            badgeClass = 'bg-amber-50 text-amber-800 border border-amber-200 font-bold';
            dateCircleClass = 'bg-amber-600 text-white';
          }

          return (
            <div
              key={phase.id}
              className={`bg-white rounded-2xl border p-4 flex flex-col justify-between transition-all hover:shadow-md hover:border-slate-300 relative group ${
                phase.status === 'Ongoing'
                  ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs'
                  : 'border-slate-100'
              }`}
            >
              <div>
                {/* Header: Date Block & Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  {/* Date Circle */}
                  <div className={`w-11 h-11 rounded-xl ${dateCircleClass} flex flex-col items-center justify-center font-extrabold leading-none shadow-xs`}>
                    <span className="text-base">{phase.date}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90">
                      {phase.month}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                    {phase.status}
                  </span>
                </div>

                {/* Phase Number */}
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {phase.phaseNumber}
                </p>

                {/* Title */}
                <h3 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                  {phase.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 font-normal mt-2 leading-relaxed">
                  {phase.description}
                </p>
              </div>

              {/* View Roadmap Link */}
              <button
                onClick={() => onOpenDetailedTimeline(phase)}
                className="inline-flex items-center justify-between w-full pt-4 mt-3 border-t border-slate-50 text-[11px] font-bold text-slate-600 group-hover:text-emerald-700 transition-colors"
              >
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Big Action Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => onOpenDetailedTimeline()}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#008060] hover:bg-[#006e52] text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-700/20 hover:shadow-lg active:scale-98 transition-all group"
        >
          <Calendar className="w-4 h-4 text-emerald-200" />
          <span>View Detailed Schedule & Full Timeline</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
