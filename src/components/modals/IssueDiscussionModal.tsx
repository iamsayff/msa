import React, { useState } from 'react';
import { X, MessageSquare, ThumbsUp, Send, User, Lock, LogIn } from 'lucide-react';
import { CampusIssue } from '../../types/election';
import { useAuth } from '../../context/AuthContext';

interface IssueDiscussionModalProps {
  issue: CampusIssue | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (issueId: string, comment: string) => void;
}

export const IssueDiscussionModal: React.FC<IssueDiscussionModalProps> = ({
  issue,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const { user, profile, signInWithGoogle } = useAuth();
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !issue) return null;

  const isLoggedIn = Boolean(user || profile);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(issue.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#0b1528] text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {issue.category}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold leading-tight">
                {issue.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {issue.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-200">
              <span className="font-semibold text-emerald-700">{issue.upvotesCount} Student Upvotes</span>
              <span>•</span>
              <span>{issue.talksCount} Discussions</span>
              <span>•</span>
              <span className="text-slate-500">Status: {issue.status}</span>
            </div>
          </div>

          {/* Student comments list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Student Voices & Feedback ({issue.comments?.length || 0})
            </h4>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {issue.comments && issue.comments.length > 0 ? (
                issue.comments.map((comment, index) => (
                  <div key={index} className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {comment.author} {comment.faculty ? `(${comment.faculty})` : ''}
                      </span>
                      <span className="text-[10px] text-slate-400">{comment.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No comments posted yet. Be the first to share your thoughts.</p>
              )}
            </div>
          </div>

          {/* Comment input form or sign in prompt */}
          {isLoggedIn ? (
            <form onSubmit={handlePost} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Join student discussion as ${profile?.name || user?.displayName || 'Voter'}...`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-2">
              <p className="text-xs text-amber-900 font-semibold">
                Sign in with Google to post your feedback and join the student discussion.
              </p>
              <button
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In with Google to Comment</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
