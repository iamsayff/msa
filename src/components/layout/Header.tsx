import React, { useState } from 'react';
import { 
  ChevronDown, 
  CheckCircle2, 
  Shield, 
  Menu, 
  X, 
  Heart,
  LogOut, 
  Edit3,
  User 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SupportModal } from '../modals/SupportModal';

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
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Stylish Site Logo & Mobile hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo Badge for AMUSU Elections.in */}
            <div className="flex items-center cursor-pointer hover:opacity-95 transition-opacity py-1">
              <img
                src="https://i.ibb.co/rrNwtYY/Green-Mosque-Emblem-and-Election-Wordmark.png"
                alt="AMUSU Elections.in - Know Your Candidate"
                className="h-13 sm:h-16 md:h-18 w-auto max-w-[280px] sm:max-w-[340px] object-contain drop-shadow-xs transition-transform hover:scale-102"
              />
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Your Support Matters Badge / Button */}
            <button
              onClick={onOpenVoting}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold tracking-wide transition-all shadow-2xs group"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500/20 group-hover:scale-110 transition-transform" />
              <span>{hasVoted ? 'Support Registered' : 'Your Support Matters'}</span>
              {hasVoted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>

            {/* Red "Support Now" Button */}
            <button
              onClick={() => setIsSupportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Support Now</span>
            </button>

            {/* User Profile Menu (when signed in) */}
            {(user || profile) ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors"
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
                  <span className="text-sm font-semibold text-slate-800 hidden xl:inline-block">
                    {profile?.name || user?.displayName || 'Student'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden xl:inline-block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-extrabold text-slate-900">{profile?.name || user?.displayName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">ID: {profile?.studentId || '21ENG0492'}</p>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Verified AMU Student</p>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenEditProfile();
                        }}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl font-semibold transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile (Hall & Course)</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenVoting();
                        }}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-600" />
                        <span>My Candidate Choices</span>
                      </button>

                      <div className="px-3 py-1.5 text-[11px] text-slate-400 border-t border-slate-50">
                        <p className="truncate font-medium">{profile?.hall || 'Sir Syed Hall'}</p>
                        <p className="truncate text-[10px] text-slate-400">{profile?.course || 'Student'}</p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOutUser();
                        }}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors border-t border-slate-50"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Support AMU Pulse Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </>
  );
};
