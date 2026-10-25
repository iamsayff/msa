import React from 'react';
import { Search, FileText, CheckSquare, Users } from 'lucide-react';

interface FeaturePropsProps {
  onScrollToCandidates: () => void;
  onOpenManifesto: () => void;
  onCastVote: () => void;
}

export const FeatureProps: React.FC<FeaturePropsProps> = ({
  onScrollToCandidates,
  onOpenManifesto,
  onCastVote,
}) => {
  const items = [
    {
      id: 'candidates',
      icon: Search,
      iconColor: 'bg-blue-600 text-white',
      title: 'Know',
      titleSecond: 'Your Candidates',
      description: 'Real profiles. Real vision.',
      onClick: onScrollToCandidates,
    },
    {
      id: 'manifesto',
      icon: FileText,
      iconColor: 'bg-emerald-600 text-white',
      title: 'Read',
      titleSecond: 'Their Manifesto',
      description: 'Ideas for a better tomorrow.',
      onClick: onOpenManifesto,
    },
    {
      id: 'vote',
      icon: CheckSquare,
      iconColor: 'bg-amber-600 text-white',
      title: 'Make',
      titleSecond: 'Your Choice',
      description: 'Your support matters.',
      onClick: onCastVote,
    },
    {
      id: 'unity',
      icon: Users,
      iconColor: 'bg-rose-700 text-white',
      title: 'Build a',
      titleSecond: 'Stronger AMU',
      description: 'Together we can.',
      onClick: onScrollToCandidates,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-md transition-all text-left group"
          >
            <div
              className={`w-11 h-11 rounded-full ${item.iconColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight">
                <span>{item.title}</span>{' '}
                <span className="block text-slate-800">{item.titleSecond}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
