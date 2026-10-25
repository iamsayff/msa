import React from 'react';
import { X, Calendar, MapPin, Clock, FileCheck, CheckCircle2 } from 'lucide-react';
import { TimelinePhase } from '../../types/election';
import { TIMELINE_PHASES } from '../../data/mockElectionData';

interface TimelineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhase?: TimelinePhase | null;
}

export const TimelineDetailModal: React.FC<TimelineDetailModalProps> = ({
  isOpen,
  onClose,
  selectedPhase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#008060] text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-200" />
            <div>
              <h2 className="text-lg font-extrabold leading-none">AMU Elections 2025 Schedule & Roadmap</h2>
              <p className="text-xs text-emerald-100 mt-1">Official Calendar Ratified by Chief Election Officer</p>
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
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {TIMELINE_PHASES.map((phase) => {
              const isHighlight = selectedPhase && selectedPhase.id === phase.id;

              return (
                <div
                  key={phase.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isHighlight
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-extrabold text-sm shrink-0">
                        <span>{phase.date}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 -mt-0.5">{phase.month}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {phase.phaseNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {phase.status}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                          {phase.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {phase.details}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                    {phase.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{phase.location}</span>
                      </span>
                    )}
                    {phase.time && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{phase.time}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-800">Proctorial Board Regulations:</p>
            <p>1. No unauthorized wall posters or loudspeaker campaigning permitted past 10 PM.</p>
            <p>2. Strict adherence to Lyngdoh Committee recommendations for student union elections.</p>
            <p>3. Valid AMU Student Identity Card is mandatory to enter the polling station on 05 Nov.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
