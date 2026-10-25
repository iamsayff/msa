import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ArrowRight, 
  PlusCircle, 
  Layers, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { CampusIssue } from '../../types/election';
import { CAMPUS_ISSUES } from '../../data/mockElectionData';

import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';

interface IssuesSectionProps {
  onOpenSubmitModal: () => void;
  onOpenIssueDiscussion: (issue: CampusIssue) => void;
  externalSearch?: string;
}

export const IssuesSection: React.FC<IssuesSectionProps> = ({
  onOpenSubmitModal,
  onOpenIssueDiscussion,
  externalSearch = '',
}) => {
  const { issues, toggleIssueUpvote } = useElection();
  const { user, profile, openAuthModal } = useAuth();
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  const handleToggleUpvote = (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvotedIds((prev) => ({ ...prev, [issueId]: !prev[issueId] }));
    toggleIssueUpvote(issueId);
  };

  const handleCheckAuthBeforeSubmit = () => {
    if (!user && !profile) {
      openAuthModal();
    } else {
      onOpenSubmitModal();
    }
  };

  const filteredIssues = (issues || CAMPUS_ISSUES).filter((issue) => {
    if (!externalSearch) return true;
    return (
      issue.title.toLowerCase().includes(externalSearch.toLowerCase()) ||
      issue.category.toLowerCase().includes(externalSearch.toLowerCase()) ||
      issue.description.toLowerCase().includes(externalSearch.toLowerCase())
    );
  });


  return (
    <section id="issues-section" className="py-12 border-t border-slate-100">
      {/* Header and Badge */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Real Voices • Real Student Change</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Issues & Student Voices
        </h2>

        <p className="text-sm text-slate-500 font-normal">
          Key challenges and student reforms raised across AMU residential halls, academic faculties, and libraries.
        </p>
      </div>

      {/* Issues Grid (2 rows of 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIssues.map((issue) => {
          const isUpvoted = !!upvotedIds[issue.id];

          return (
            <div
              key={issue.id}
              onClick={() => onOpenIssueDiscussion(issue)}
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-300/80 p-5 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
            >
              <div>
                {/* Header: Thumbnail & Category + Title */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  {/* Square Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-2xs">
                    {issue.imageUrl ? (
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <Layers className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Category pill */}
                    <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {issue.category}
                    </span>
                    {/* Title */}
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug mt-1 group-hover:text-emerald-800 transition-colors">
                      {issue.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Bottom Footer: Stats & View & Vote */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                <div className="flex items-center gap-3.5 text-xs text-slate-400">
                  {/* Talks count */}
                  <span className="inline-flex items-center gap-1 font-medium hover:text-slate-600 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{issue.talksCount} Talks</span>
                  </span>

                  {/* Upvotes button & count */}
                  <button
                    onClick={(e) => handleToggleUpvote(issue.id, e)}
                    className={`inline-flex items-center gap-1 font-semibold transition-colors px-1.5 py-0.5 rounded-md ${
                      isUpvoted
                        ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-300'
                        : 'hover:text-slate-700'
                    }`}
                    title="Upvote this student issue"
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${
                        isUpvoted ? 'fill-emerald-600 text-emerald-600' : ''
                      }`}
                    />
                    <span>{issue.upvotesCount}</span>
                  </button>
                </div>

                {/* View & Vote Link */}
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                  <span>View & Vote</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Action Buttons below issues */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
        {/* Submit Issue Button */}
        <button
          onClick={handleCheckAuthBeforeSubmit}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-emerald-50/60 border border-emerald-500/80 text-emerald-800 font-bold text-xs sm:text-sm tracking-wide shadow-2xs hover:shadow-sm active:scale-98 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>Submit Student Issue</span>
        </button>

        {/* View All Issues Button */}
        <button
          onClick={() => onOpenIssueDiscussion(issues[0])}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1528] hover:bg-[#1e293b] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-98 transition-all group"
        >
          <span>View All Issues & Discussions</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
