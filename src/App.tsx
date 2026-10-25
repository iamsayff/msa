/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AMU Pulse - Student Election Dashboard
 * 110% Faithful Replica of the Official AMU Election Theme
 * With Real-time Firebase Firestore Backend, Google Authentication,
 * Interactive Electronic Ballot with Vote-Change Support,
 * Candidate Profile with Live Vote Counters, Separate URL Pages,
 * and Sticky Floating "VOTE NOW" Button.
 */

import React, { useState } from 'react';
import { Sidebar, NavTabId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/hero/HeroSection';
import { FeatureProps } from './components/hero/FeatureProps';
import { CandidatesSection } from './components/candidates/CandidatesSection';
import { TimelineSection } from './components/timeline/TimelineSection';
import { IssuesSection } from './components/issues/IssuesSection';
import { Footer } from './components/footer/Footer';

// Pages
import { AllCandidatesPage } from './pages/AllCandidatesPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { VoteNowPage } from './pages/VoteNowPage';
import { AdminPage } from './pages/AdminPage';
import { EditCandidatePage } from './pages/EditCandidatePage';
import { ManifestoPage } from './pages/ManifestoPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { SupportPage } from './pages/SupportPage';

// Common Components & Floating Sticky Button
import { StickyVoteButton } from './components/common/StickyVoteButton';
import { FullWidthBanner } from './components/common/FullWidthBanner';
import { BANNERS } from './config/banners';

// Modals
import { CandidateDetailModal } from './components/modals/CandidateDetailModal';
import { VotingBoothModal } from './components/modals/VotingBoothModal';
import { SubmitIssueModal } from './components/modals/SubmitIssueModal';
import { TimelineDetailModal } from './components/modals/TimelineDetailModal';
import { IssueDiscussionModal } from './components/modals/IssueDiscussionModal';
import { AuthRequiredModal } from './components/modals/AuthRequiredModal';
import { EditProfileModal } from './components/modals/EditProfileModal';

// Routing, Context & Types
import { useRouter } from './lib/router';
import { useAuth } from './context/AuthContext';
import { useElection } from './context/ElectionContext';
import { Candidate, PostType, CampusIssue, TimelinePhase } from './types/election';
import { getCandidateSlug } from './utils/candidateSlug';
import { Newspaper, Info, ArrowLeft } from 'lucide-react';

export default function App() {
  const { route, navigate } = useRouter();
  const { user, profile, openAuthModal } = useAuth();
  const { candidates, issues, ballot, hasVoted, castVote, createCampusIssue, addCommentToIssue } = useElection();

  // Navigation & UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [candidatesPageFilter, setCandidatesPageFilter] = useState<PostType | 'all'>('all');

  // Modals State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [quickModalCandidate, setQuickModalCandidate] = useState<Candidate | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [isSubmitIssueOpen, setIsSubmitIssueOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedTimelinePhase, setSelectedTimelinePhase] = useState<TimelinePhase | null>(null);
  const [selectedIssueDiscussion, setSelectedIssueDiscussion] = useState<CampusIssue | null>(null);

  // Derive active tab for sidebar highlight
  let activeTab: NavTabId = 'home';
  if (route.name === 'candidates') activeTab = 'candidates';
  if (route.name === 'candidate_profile') activeTab = 'candidate_profile';
  if (route.name === 'manifesto') activeTab = 'manifesto';
  if (route.name === 'news') activeTab = 'news';
  if (route.name === 'about') activeTab = 'about';

  // Find candidate for candidate profile page
  const selectedCandidate: Candidate | undefined = route.name === 'candidate_profile'
    ? candidates.find((c) => 
        c.id === route.candidateId || 
        c.slug === route.candidateId || 
        getCandidateSlug(c) === route.candidateId
      ) || candidates[0]
    : undefined;

  // Scroll to section helper for home anchor links
  const scrollToSection = (sectionId: string) => {
    if (route.name !== 'home') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open candidate profile with dedicated URL
  const handleOpenCandidateProfile = (candidate: Candidate) => {
    navigate(`/candidate/${getCandidateSlug(candidate)}`);
  };

  // Vote for candidate handler (redirects to vote booth with candidate picked)
  const handleVoteForCandidate = async (candidate: Candidate) => {
    if (!user && !profile) {
      openAuthModal();
      return;
    }
    navigate('/vote');
  };

  // Add new issue via Firestore
  const handleCreateIssue = async (
    newIssueData: Omit<CampusIssue, 'id' | 'talksCount' | 'upvotesCount' | 'status' | 'postedAt'>
  ) => {
    await createCampusIssue(newIssueData);
  };

  // Add comment to issue via Firestore
  const handleAddCommentToIssue = async (issueId: string, commentText: string) => {
    await addCommentToIssue(issueId, commentText);
  };

  // Explore Category: Navigates to the Dedicated All Candidates Page with category filter
  const handleExploreCategory = (category: PostType) => {
    setCandidatesPageFilter(category);
    navigate('/candidates');
  };

  // Open Detailed Timeline
  const handleOpenDetailedTimeline = (phase?: TimelinePhase) => {
    setSelectedTimelinePhase(phase || null);
    setIsTimelineModalOpen(true);
  };

  // Convert ballot to key-value record for legacy modal & candidate card badges
  const ballotSelections: Record<PostType, string> = {
    president: ballot.president || '',
    vice_president: ballot.vicePresident || '',
    honorary_secretary: ballot.honorarySecretary || '',
    court_member: ballot.courtMember || '',
    cabinet_member: ballot.cabinetMembers?.[0] || '',
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8fafc] text-slate-900 flex flex-col font-sans relative">
      {/* 1. Global Sticky Floating "VOTE NOW" Button across all pages */}
      <StickyVoteButton
        onClick={() => setIsVotingOpen(true)}
        hasVoted={hasVoted}
      />

      {/* 2. Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'home') {
            navigate('/');
          } else if (tab === 'candidates') {
            setCandidatesPageFilter('all');
            navigate('/candidates');
          } else if (tab === 'issues') {
            scrollToSection('issues-section');
          } else if (tab === 'timeline') {
            scrollToSection('timeline-section');
          } else if (tab === 'manifesto') {
            navigate('/manifesto');
          } else if (tab === 'news') {
            navigate('/news');
          } else if (tab === 'about') {
            navigate('/about');
          } else if (tab === 'privacy') {
            navigate('/privacy');
          } else if (tab === 'guidelines') {
            navigate('/guidelines');
          } else if (tab === 'support') {
            navigate('/support');
          }
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 transition-all">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenVoting={() => setIsVotingOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          hasVoted={hasVoted}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* VIEW 1: Dedicated Vote Now Booth Page */}
          {route.name === 'vote' && (
            <VoteNowPage
              onBackToDashboard={() => navigate('/')}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onNavigateCandidate={handleOpenCandidateProfile}
            />
          )}

          {/* VIEW 2: Candidate Full Page Profile View */}
          {route.name === 'candidate_profile' && selectedCandidate && (
            <CandidateProfilePage
              candidate={selectedCandidate}
              onBackToCandidates={() => navigate('/candidates')}
              onBackToDashboard={() => navigate('/')}
              onVoteForCandidate={handleVoteForCandidate}
              onViewManifestoModal={() => navigate('/manifesto')}
              onNavigateToEdit={(cand) => navigate(`/candidate/${getCandidateSlug(cand)}/edit`)}
            />
          )}

          {/* VIEW 2B: Full Page Candidate Profile Editor */}
          {route.name === 'edit_candidate' && (
            <EditCandidatePage
              candidateId={route.candidateId}
              onBackToProfile={() => navigate(`/candidate/${route.candidateId}`)}
            />
          )}

          {/* VIEW 2C: Full Page Admin Panel */}
          {route.name === 'admin' && (
            <AdminPage
              onBackToHome={() => navigate('/')}
              onNavigateToEditCandidate={(cand) => navigate(`/candidate/${getCandidateSlug(cand)}/edit`)}
            />
          )}

          {/* VIEW 3: Dedicated Separate All Candidates Page */}
          {route.name === 'candidates' && (
            <AllCandidatesPage
              onBackToHome={() => navigate('/')}
              onSelectCandidate={handleOpenCandidateProfile}
              onCastVote={() => setIsVotingOpen(true)}
              ballotSelections={ballotSelections}
              initialPostFilter={candidatesPageFilter}
            />
          )}

          {/* VIEW 3B: Dedicated Separate Manifestos Page */}
          {route.name === 'manifesto' && (
            <ManifestoPage
              onBackToDashboard={() => navigate('/')}
              onSelectCandidate={handleOpenCandidateProfile}
              onSupportCandidate={handleVoteForCandidate}
            />
          )}

          {/* VIEW 4: Home Dashboard View */}
          {route.name === 'home' && (
            <div className="space-y-4">
              {/* Banner 1: Just above the Hero Section - Full device width, no overlay, no text */}
              <FullWidthBanner
                src={BANNERS.topHeroBanner.src}
                alt={BANNERS.topHeroBanner.alt}
              />

              {/* 1. Hero Section */}
              <HeroSection
                onCastVote={() => setIsVotingOpen(true)}
                onViewManifesto={() => navigate('/manifesto')}
              />

              {/* 2. 4 Feature Highlights */}
              <FeatureProps
                onScrollToCandidates={() => {
                  setCandidatesPageFilter('all');
                  navigate('/candidates');
                }}
                onOpenManifesto={() => navigate('/manifesto')}
                onCastVote={() => setIsVotingOpen(true)}
              />

              {/* Banner 2: Just above Meet the Candidates Section - Full device width, no overlay, no text */}
              <FullWidthBanner
                src={BANNERS.aboveCandidatesBanner.src}
                alt={BANNERS.aboveCandidatesBanner.alt}
              />

              {/* 3. Meet the Candidates (Home Section with 5 Rows) */}
              <CandidatesSection
                onSelectCandidate={handleOpenCandidateProfile}
                onExploreCategory={handleExploreCategory}
                externalSearch={searchQuery}
              />

              {/* Banner 3: Just above Date and Timelines Section - Full device width, no overlay, no text */}
              <FullWidthBanner
                src={BANNERS.aboveTimelineBanner.src}
                alt={BANNERS.aboveTimelineBanner.alt}
              />

              {/* 4. Key Election Dates & Timeline */}
              <TimelineSection
                onOpenDetailedTimeline={handleOpenDetailedTimeline}
              />

              {/* 5. Campus Issues & Student Voices */}
              <IssuesSection
                onOpenSubmitModal={() => setIsSubmitIssueOpen(true)}
                onOpenIssueDiscussion={(issue) => setSelectedIssueDiscussion(issue)}
                externalSearch={searchQuery}
              />
            </div>
          )}

          {/* VIEW 5: News & Press Bulletins */}
          {route.name === 'news' && (
            <div className="py-8 space-y-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">AMU Election News & Press Releases</h2>
                    <p className="text-xs text-slate-500">Official bulletins released by the AMU Proctorial Board & Election Officer</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <article className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-emerald-700 uppercase">Chief Election Officer</span>
                      <span>Oct 24, 2025</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Final Verification of Voter ID Lists in All Halls</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All Hall Provosts have submitted authenticated voter rolls. Students can verify their hall serial numbers at the dining hall notice boards.
                    </p>
                  </article>

                  <article className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-blue-700 uppercase">Presidential Debate Committee</span>
                      <span>Oct 22, 2025</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Official Presidential Debate Scheduled at Kennedy Auditorium</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      The traditional annual Presidential Debate will take place on November 02 at 7:00 PM. All contesting candidates will present their vision followed by moderated Q&A.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: About Us */}
          {route.name === 'about' && (
            <div className="py-8 space-y-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">About AMU Pulse</h2>
                    <p className="text-xs text-slate-500">Know Your Leader • A Student-Led Democracy Initiative</p>
                  </div>
                </div>

                <div className="prose prose-sm text-slate-600 space-y-4 max-w-none">
                  <p>
                    <strong>AMU Pulse</strong> is an independent, non-partisan, student-driven election information portal designed to bring absolute transparency, verified candidate profiles, and genuine student issue tracking to the Aligarh Muslim University community.
                  </p>
                  <p>
                    Established on the timeless principles of Sir Syed Ahmad Khan, this platform empowers students across all faculties, halls, and academic departments to evaluate candidate manifestos, engage in civil discourse, and participate actively in shaping the university’s future.
                  </p>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                    &ldquo;Same Campus. Bigger Dreams. Your voice matters, and together we build a stronger AMU.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: Privacy Policy */}
          {route.name === 'privacy' && (
            <PrivacyPage onBackToDashboard={() => navigate('/')} />
          )}

          {/* VIEW 8: Community Guidelines */}
          {route.name === 'guidelines' && (
            <GuidelinesPage 
              onBackToDashboard={() => navigate('/')} 
              onNavigateToSupport={() => navigate('/support')}
            />
          )}

          {/* VIEW 9: Student Support Desk */}
          {route.name === 'support' && (
            <SupportPage onBackToDashboard={() => navigate('/')} />
          )}
        </main>

        {/* Banner 4: Just before the Footer - Display fully according to device width, no overlay, no text */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-4">
          <FullWidthBanner
            src={BANNERS.bottomFooterBanner.src}
            alt={BANNERS.bottomFooterBanner.alt}
            edgeToEdge={false}
          />
        </div>

        {/* Global Footer */}
        <Footer
          onNavigate={(tab) => {
            if (tab === 'candidates') {
              setCandidatesPageFilter('all');
              navigate('/candidates');
            } else if (tab === 'issues') {
              scrollToSection('issues-section');
            } else if (tab === 'timeline') {
              scrollToSection('timeline-section');
            } else if (tab === 'manifesto') {
              navigate('/manifesto');
            } else if (tab === 'news') {
              navigate('/news');
            } else if (tab === 'about') {
              navigate('/about');
            } else if (tab === 'privacy') {
              navigate('/privacy');
            } else if (tab === 'guidelines') {
              navigate('/guidelines');
            } else if (tab === 'support') {
              navigate('/support');
            } else {
              navigate('/');
            }
          }}
          onOpenVoting={() => setIsVotingOpen(true)}
          onOpenAdmin={() => navigate('/admin')}
        />
      </div>

      {/* Global Interactive Modals */}
      <AuthRequiredModal />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <CandidateDetailModal
        candidate={quickModalCandidate}
        onClose={() => setQuickModalCandidate(null)}
        onVoteForCandidate={handleVoteForCandidate}
        hasVotedForThisPost={quickModalCandidate ? !!ballotSelections[quickModalCandidate.post] : false}
      />

      <VotingBoothModal
        isOpen={isVotingOpen}
        onClose={() => setIsVotingOpen(false)}
        ballotSelections={ballotSelections}
        onSelectBallotCandidate={(post, id) => {
          castVote({ ...ballot, [post === 'president' ? 'president' : post === 'vice_president' ? 'vicePresident' : post === 'honorary_secretary' ? 'honorarySecretary' : 'courtMember']: id });
        }}
        onSubmitBallot={() => {
          setIsVotingOpen(false);
        }}
        hasSubmittedVote={hasVoted}
      />

      <SubmitIssueModal
        isOpen={isSubmitIssueOpen}
        onClose={() => setIsSubmitIssueOpen(false)}
        onSubmitIssue={handleCreateIssue}
      />

      <TimelineDetailModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        selectedPhase={selectedTimelinePhase}
      />

      <IssueDiscussionModal
        issue={issues.find((i) => i.id === selectedIssueDiscussion?.id) || selectedIssueDiscussion}
        isOpen={!!selectedIssueDiscussion}
        onClose={() => setSelectedIssueDiscussion(null)}
        onAddComment={handleAddCommentToIssue}
      />
    </div>
  );
}
