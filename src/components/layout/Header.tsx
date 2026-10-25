import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  CheckCircle2, 
  Shield, 
  Menu, 
  LogOut, 
  Edit3,
  User 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenVoting: () => void;
  onOpenMobileMenu: () => void;
  onOpenEditProfile: () => void;
  hasVoted?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenVoting,
  onOpenMobileMenu,
  onOpenEditProfile,
  hasVoted = false,
}) => {
  const { user, profile, signOutUser, openAuthModal } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 w-full shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-18 sm:h-22 flex items-center justify-between gap-1.5 sm:gap-4 w-full">
        {/* Left: Site Logo & Mobile hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 shrink-0 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo Badge for AMUSU Elections */}
          <div className="flex items-center cursor-pointer hover:opacity-95 transition-opacity py-1 min-w-0">
            <img
              src="https://i.ibb.co/rrNwtYY/Green-Mosque-Emblem-and-Election-Wordmark.png"
              alt="AMUSU Elections.in - Know Your Candidate"
              className="h-10 sm:h-14 md:h-18 w-auto max-w-[170px] xs:max-w-[210px] sm:max-w-[320px] md:max-w-[360px] object-contain drop-shadow-xs transition-transform hover:scale-102"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Profile Menu (when signed in) */}
          {(user || profile) ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20 shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-xs font-bold ring-2 ring-emerald-500/20 shadow-2xs">
                    {(profile?.name || user?.displayName || 'AMU').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="text-xs sm:text-sm font-semibold text-slate-800 max-w-[120px] truncate hidden sm:inline-block">
                  {profile?.name || user?.displayName || 'Student'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-extrabold text-slate-900 truncate">{profile?.name || user?.displayName}</p>
                      <VerifiedBadge size={14} title="Verified AMU Voter" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{profile?.email || user?.email}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Verified AMU Student Voter</p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenEditProfile();
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Edit Profile (Hall & Course)</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenVoting();
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-colors cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span>My Support / Candidate Ballot</span>
                    </button>

                    <div className="px-3 py-1.5 text-[11px] text-slate-400 border-t border-slate-50">
                      <p className="truncate font-medium text-slate-600">{profile?.hall || 'Hall of Residence Not Set'}</p>
                      <p className="truncate text-[10px] text-slate-400">{profile?.faculty || profile?.course || 'Faculty / Program'}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOutUser();
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors border-t border-slate-50 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
