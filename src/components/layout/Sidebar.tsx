import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  MessageSquareWarning, 
  Calendar, 
  Newspaper, 
  Info,
  X
} from 'lucide-react';
import { AmuSkyline } from '../common/AmuSkyline';

export type NavTabId = 
  | 'home' 
  | 'candidates' 
  | 'manifesto' 
  | 'issues' 
  | 'timeline' 
  | 'news' 
  | 'about' 
  | 'privacy' 
  | 'guidelines' 
  | 'support' 
  | 'candidate_profile';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'home' as NavTabId, label: 'Home', icon: Home },
    { id: 'candidates' as NavTabId, label: 'Candidates', icon: Users },
    { id: 'manifesto' as NavTabId, label: 'Manifesto', icon: FileText },
    { id: 'issues' as NavTabId, label: 'Issues', icon: MessageSquareWarning },
    { id: 'timeline' as NavTabId, label: 'Important Dates', icon: Calendar },
    { id: 'news' as NavTabId, label: 'News', icon: Newspaper },
    { id: 'about' as NavTabId, label: 'About Us', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
            <div className="flex items-center cursor-pointer hover:opacity-95 transition-opacity">
              <img
                src="/assets/aistudio/AMUSU_Elections_Logo_Badge__1__6faee246.png"
                alt="AMUSU Elections.in - Know Your Candidate"
                className="h-10 w-auto max-w-[175px] object-contain"
              />
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-700 stroke-[2.4]' : 'text-slate-400 stroke-[1.8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Skyline Graphic & Calligraphic Tagline */}
        <div className="p-4 pt-0">
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/60 relative overflow-hidden">
            <AmuSkyline className="w-full h-14 text-emerald-600 opacity-30 mb-2" fill="#059669" />
            <div className="font-handwriting text-2xl font-bold leading-tight text-emerald-800 text-center select-none">
              <span className="block transform -rotate-1 text-emerald-700">Your Voice</span>
              <span className="block transform rotate-1 text-emerald-900 text-3xl font-extrabold -mt-1">
                Your AMU
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
