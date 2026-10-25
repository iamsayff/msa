import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  GraduationCap, 
  Calendar, 
  Vote, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Briefcase, 
  Star, 
  Image as ImageIcon, 
  Mail, 
  Play, 
  ChevronRight,
  ChevronLeft,
  Maximize2,
  X,
  Film,
  User,
  Heart,
  ExternalLink,
  Phone,
  FileText,
  Clock,
  Award,
  Send,
  Building,
  Check,
  BookOpen,
  Wifi,
  Coffee,
  HelpCircle,
  Edit3
} from 'lucide-react';
import { Candidate, PostType, CandidateGalleryItem } from '../types/election';
import { POST_CATEGORIES } from '../data/mockElectionData';
import { useElection } from '../context/ElectionContext';
import { useAuth } from '../context/AuthContext';
import { ClaimProfileModal } from '../components/modals/ClaimProfileModal';

// Helper to resolve YouTube, Vimeo, or direct embed URLs
function getEmbedVideoUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  
  // YouTube watch / share URL
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  
  return null;
}

function isDirectVideoFile(url: string): boolean {
  if (!url) return false;
  return url.startsWith('data:video') || url.startsWith('blob:') || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

// Default atmospheric AMU campaign photos for high-aesthetic presentation
const DEFAULT_CAMPUS_GALLERY: CandidateGalleryItem[] = [
  {
    id: 'g1',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    title: 'Kennedy Auditorium Student Assembly',
    caption: 'Student Charter open discussion on campus academic facilities.'
  },
  {
    id: 'g2',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    title: 'Strachey Hall Quadrangle Meeting',
    caption: 'Listening to boarders regarding dining hygiene and amenities.'
  },
  {
    id: 'g3',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    title: 'Maulana Azad Library Discussion',
    caption: 'Deliberating research support and 24/7 digital reading access.'
  },
  {
    id: 'g4',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    title: 'Faculty Lawn Youth Interaction',
    caption: 'Presenting manifesto benchmarks to undergraduate peers.'
  },
  {
    id: 'g5',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    title: 'Inter-Hall Student Council Meet',
    caption: 'Constructive deliberations on student rights and equal representation.'
  },
  {
    id: 'g6',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    title: 'Historic Victoria Gate Student Forum',
    caption: 'Campus grievance redressal dialogue with senior scholars.'
  }
];

interface CandidateProfilePageProps {
  candidate: Candidate;
  onBackToCandidates: () => void;
  onBackToDashboard: () => void;
  onVoteForCandidate: (candidate: Candidate) => void;
  onViewManifestoModal: (post: PostType) => void;
  onNavigateToEdit?: (candidate: Candidate) => void;
}

export const CandidateProfilePage: React.FC<CandidateProfilePageProps> = ({
  candidate,
  onBackToCandidates,
  onBackToDashboard,
  onVoteForCandidate,
  onViewManifestoModal,
  onNavigateToEdit,
}) => {
  const [activeTab, setActiveTab] = useState<
    'about' | 'vision' | 'experience' | 'achievements' | 'gallery' | 'contact'
  >('about');
  const [copied, setCopied] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  // Resolved gallery photos: custom photos with fallback to high-res AMU campus campaign moments
  const galleryItems: CandidateGalleryItem[] = (candidate.galleryPhotos && candidate.galleryPhotos.length > 0
    ? candidate.galleryPhotos.map((p, idx) => ({
        ...p,
        url: p.url && p.url.trim() ? p.url : (DEFAULT_CAMPUS_GALLERY[idx % DEFAULT_CAMPUS_GALLERY.length]?.url || '')
      }))
    : DEFAULT_CAMPUS_GALLERY);

  // Keyboard navigation for Lightbox image viewer
  useEffect(() => {
    if (activeLightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null));
      }
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, galleryItems.length]);

  const { getCandidateVotes, ballot } = useElection();
  const { user, profile } = useAuth();

  const currentUserEmail = (profile?.email || user?.email || '').toLowerCase().trim();
  const isOwner = Boolean(
    (candidate.claimedEmail && candidate.claimedEmail.toLowerCase() === currentUserEmail && currentUserEmail) ||
    ['talktoaamirsaif@gmail.com', 'ansaarsaif7@gmail.com'].includes(currentUserEmail)
  );

  const category = POST_CATEGORIES.find((c) => c.id === candidate.post) || POST_CATEGORIES[0];
  const liveVotesCount = getCandidateVotes(candidate.id);

  const isVotedForThis = 
    candidate.post === 'president' ? ballot.president === candidate.id :
    candidate.post === 'vice_president' ? ballot.vicePresident === candidate.id :
    candidate.post === 'honorary_secretary' ? ballot.honorarySecretary === candidate.id :
    candidate.post === 'court_member' ? ballot.courtMember === candidate.id :
    (ballot.cabinetMembers || []).includes(candidate.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    setTimeout(() => {
      setQuestionSent(false);
      setQuestionText('');
    }, 2500);
  };

  const skills = [
    'Student Welfare Advocacy',
    'Open Governance',
    'Active Problem Solving',
    'Public Speaking',
    'Campus Unity',
  ];

  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCandidates}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Candidates</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">Candidate Profile</span>
      </div>

      {/* 1. HERO BANNER - Clean mint container without the right landmark image banner */}
      <div className="relative rounded-3xl bg-[#f0fdf9] border border-emerald-100/90 p-6 sm:p-8 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Avatar & Candidate Info */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar with Verified Candidate pill underneath */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-[#059669] ring-offset-2 overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5">
                {candidate.avatarUrl ? (
                  <img
                    src={candidate.avatarUrl}
                    alt={candidate.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-2xl">
                    {candidate.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}
              </div>
              <span className="-mt-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#059669] text-white text-[11px] font-bold shadow-xs">
                <span>Verified Candidate</span>
              </span>
            </div>

            {/* Candidate Info */}
            <div className="space-y-3 flex-1">
              {/* NOMINATED FOR [POST] Pill */}
              <div className="inline-block">
                <span className="px-3.5 py-1 rounded-full bg-[#dcfce7] text-[#15803d] border border-emerald-200 text-[10px] font-extrabold tracking-wider uppercase">
                  Nominated for {category.label}
                </span>
              </div>

              {/* Candidate Name */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {candidate.name}
              </h1>

              {/* Slogan Quote */}
              <p className="text-sm sm:text-base text-slate-600 font-normal italic">
                &ldquo;{candidate.quote}&rdquo;
              </p>

              {/* Meta pills: Faculty, Year, Votes */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200/80 font-medium shadow-2xs">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>{candidate.faculty}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200/80 font-medium shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{candidate.year}</span>
                </span>

                {/* Supports Pill in Top Header matching Navbar Support Button style with heart icon & outline border color */}
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 sm:py-1.5 rounded-full text-white font-extrabold text-xs shadow-sm"
                  style={{ backgroundColor: category.themeColor.accentColor }}
                >
                  <Heart className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{liveVotesCount.toLocaleString()} Supports</span>
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
                {/* 1. Support Candidate */}
                <button
                  onClick={() => onVoteForCandidate(candidate)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-xs active:scale-98 transition-all cursor-pointer ${
                    isVotedForThis
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-[#25D366] hover:bg-[#1faa53] text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{isVotedForThis ? 'Supported Candidate' : 'Support Candidate'}</span>
                </button>

                {/* 2. Share Profile */}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied Link!' : 'Share Profile'}</span>
                </button>

                {/* 3. View Manifesto (PDF or Interactive Modal) */}
                {candidate.manifestoPdfUrl ? (
                  <a
                    href={candidate.manifestoPdfUrl}
                    download={candidate.manifestoPdfName || 'Candidate_Manifesto.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Manifesto PDF</span>
                  </a>
                ) : (
                  <button
                    onClick={() => onViewManifestoModal(candidate.post)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Manifesto</span>
                  </button>
                )}

                {/* 4. Edit Profile (Visible for Profile Owner or Admin) - Full Page */}
                {isOwner && (
                  <button
                    onClick={() => onNavigateToEdit && onNavigateToEdit(candidate)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                )}

                {/* 5. Claim This Profile (Opens verification modal) */}
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{candidate.claimedEmail ? 'Claimed (Verify / Contact)' : 'Claim This Profile'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Official Ballot Serial Number & Tagline */}
          <div className="lg:col-span-4 w-full flex flex-col items-center lg:items-end justify-center space-y-3">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs w-full max-w-full sm:max-w-xl lg:max-w-[280px]">
              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3.5 sm:gap-4 lg:gap-2 text-center sm:text-left lg:text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-3xl sm:text-4xl flex items-center justify-center shrink-0 border-2 border-emerald-200 shadow-2xs">
                  #{candidate.serialNumber ?? 0}
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Official Ballot Serial No.
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Candidate #{candidate.serialNumber ?? 0}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    AMUSU Official Ballot Number Allotted by Election Officer
                  </p>
                  {candidate.claimedEmail && (
                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-center sm:justify-start lg:justify-center gap-1 text-[10px] font-bold text-emerald-700">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Candidate</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right font-handwriting select-none leading-tight hidden lg:block">
              <span className="block text-2xl font-bold text-slate-800">Stronger Students</span>
              <span className="block text-3xl font-extrabold text-[#008060] -mt-1">Brighter AMU</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('about')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'about'
              ? 'bg-[#059669] text-white shadow-sm'
              : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>About</span>
        </button>

        <button
          onClick={() => setActiveTab('vision')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'vision'
              ? 'bg-[#059669] text-white shadow-sm'
              : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Vision & Goals</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'experience'
              ? 'bg-[#059669] text-white shadow-sm'
              : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'achievements'
              ? 'bg-[#059669] text-white shadow-sm'
              : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Achievements</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'gallery'
              ? 'bg-[#059669] text-white shadow-sm'
              : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Campaign Gallery</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'contact'
              ? 'bg-[#059669] text-white shadow-sm'
              : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT SECTION PER TAB */}
      <div className="space-y-6">
        {/* TAB 1: ABOUT */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Row 1: Candidate Video Intro + Quote Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Modern Sleek Cinema Video Player */}
              <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-2 sm:p-2.5 shadow-md border border-slate-800 relative group overflow-hidden flex flex-col justify-between">
                <div 
                  onClick={() => setShowVideoModal(true)}
                  className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer flex items-center justify-center select-none"
                >
                  {/* Atmospheric campus backdrop */}
                  <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-40 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-white z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 border border-white/10">
                      <Film className="w-3 h-3 text-emerald-400" />
                      <span>Campaign Address</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-300">
                      01:32 • HD
                    </span>
                  </div>

                  {/* Center Frosted Glass Play Button */}
                  <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 text-slate-900 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
                  </div>

                  {/* Bottom Minimal Title */}
                  <div className="absolute bottom-3 inset-x-4 z-10 flex items-center justify-between pointer-events-none">
                    <div>
                      <h4 className="text-white text-xs sm:text-sm font-extrabold tracking-tight drop-shadow-md">
                        {candidate.name} • Official Address
                      </h4>
                      <p className="text-[11px] text-slate-300 drop-shadow-sm">Click to play video</p>
                    </div>
                    <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Signature Quote Card */}
              <div className="lg:col-span-5 bg-[#fefce8] border border-amber-200/90 rounded-3xl p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-amber-500 font-serif text-2xl font-black block leading-none select-none">
                    &ldquo;&ldquo;&ldquo;&ldquo;
                  </span>
                  <p className="font-handwriting text-xl sm:text-2xl font-bold text-slate-800 leading-snug mt-2">
                    {candidate.signatureQuote || candidate.quote || 'Real change happens when students stop being just recipients of policies and start authoring them.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-amber-200/60">
                  <span className="text-xs font-bold text-slate-900">— {candidate.name}</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </div>

            {/* Row 2: About Me + Why I'm Running */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">About Me</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {candidate.aboutMe || ''}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {(candidate.skills && candidate.skills.length > 0 ? candidate.skills : skills).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200/80 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h3 className="font-extrabold text-base text-slate-900">Why I&apos;m Running</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {candidate.whyRunning || `I'm running for the ${category.label} post because I want to create a campus where students feel heard, supported and empowered. AMU has given us so much — now it's time to give back and work for a better future, together.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50 text-center">
                  <span className="font-handwriting text-xl font-bold text-emerald-800">
                    {candidate.sloganBanner || "More Opportunities • Stronger AMU"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISION & GOALS */}
        {activeTab === 'vision' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">5-Point Campus Transformation Plan</h3>
                  <p className="text-xs text-slate-500">Concrete student reforms committed for {candidate.name}&apos;s union tenure</p>
                </div>
              </div>

              {candidate.visionGoals && candidate.visionGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {candidate.visionGoals.map((vg, idx) => (
                    <div key={vg.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span>{idx + 1}. {vg.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {vg.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm">
                      <BookOpen className="w-4 h-4" />
                      <span>1. 24x7 Digital Library & Extended Reading Rooms</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Expanding high-speed Wi-Fi, adding 200 new charging desks, and extending midnight reading room hours in Maulana Azad Library during examination periods.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2.5 text-blue-700 font-bold text-sm">
                      <Coffee className="w-4 h-4" />
                      <span>2. Dining Hall Quality & Drinking Water Standards</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Institutionalizing democratic student mess committees in each hall, ensuring certified RO water coolers on every floor, and healthy dietary options.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2.5 text-purple-700 font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      <span>3. 48-Hour Student Grievance Redressal</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Launching an open online ticket portal where maintenance requests, scholarship inquiries, and fee issues are actively monitored and resolved.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm">
                      <Briefcase className="w-4 h-4" />
                      <span>4. Placement & Internship Drives for All Faculties</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Connecting with national alumni networks to bring dedicated job fairs and skill workshops to Arts, Science, Commerce, and Social Sciences students.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm">
                      <Award className="w-4 h-4" />
                      <span>5. Cultural & Sports Budget Revival</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Revitalizing inter-hall sports tournaments, Sir Syed Day debate cups, and providing direct financial backing to active student cultural clubs.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                {candidate.manifestoPdfUrl ? (
                  <a
                    href={candidate.manifestoPdfUrl}
                    download={candidate.manifestoPdfName || 'Candidate_Manifesto.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Full Printed Manifesto (PDF)</span>
                  </a>
                ) : (
                  <button
                    onClick={() => onViewManifestoModal(candidate.post)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Full Printed Manifesto</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Leadership & Campus Service Record</h3>
                  <p className="text-xs text-slate-500">Demonstrated history of serving the AMU student community</p>
                </div>
              </div>

              <div className="space-y-4">
                {(candidate.experienceRecords && candidate.experienceRecords.length > 0
                  ? candidate.experienceRecords
                  : [
                      { id: '1', year: '2024', title: 'Senior Student Council Representative', organization: `Faculty of ${candidate.faculty}`, description: 'Represented over 800 students in departmental academic reviews, successfully negotiating flexible seminar schedules and textbook access.' },
                      { id: '2', year: '2023', title: 'Convenor, Inter-Hall Cultural & Literary Meet', organization: 'General Education Centre (GEC)', description: 'Coordinated 16 student teams across Kennedy Auditorium and Strachey Hall, managing event budgeting, judges, and student reception.' },
                      { id: '3', year: '2022', title: 'Dining & Health Committee Member', organization: candidate.hallOfResidence || 'Sir Syed Hall of Residence', description: 'Audited dining hall groceries, hygiene standards, and instituted a regular feedback log for student residents.' },
                    ]
                ).map((exp, idx) => (
                  <div key={exp.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {exp.year}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{exp.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{exp.organization}</p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Key Accolades & Milestones</h3>
                  <p className="text-xs text-slate-500">Recognitions awarded during academic career at AMU</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(candidate.achievementsList && candidate.achievementsList.length > 0
                  ? candidate.achievementsList
                  : [
                      { id: '1', year: '2024', title: 'Kennedy Memorial Debate Champion', category: 'University Literary Club • 2024', description: 'First place among 32 contesting universities across India.' },
                      { id: '2', year: '2023', title: "Dean's Academic Merit Roll", category: `Faculty of ${candidate.faculty} • 2023`, description: 'Maintained consistent distinction in coursework and departmental seminars.' },
                      { id: '3', year: '2023', title: 'Campus Blood Donation Organizer', category: 'J.N. Medical College Blood Bank • 2023', description: 'Helped mobilize over 350 student voluntary blood donors in a single drive.' },
                      { id: '4', year: '2022', title: 'Best Student Resident Award', category: 'Sir Syed Hall Provostial Board • 2022', description: 'Awarded for exemplary discipline, peer mentorship, and hall community service.' },
                    ]
                ).map((ach, idx) => (
                  <div key={ach.id || idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{ach.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{ach.category} {ach.year ? `• ${ach.year}` : ''}</p>
                      <p className="text-xs text-slate-600 mt-1.5">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CAMPAIGN GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
              {/* Clean Minimal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                      Campaign Gallery
                    </h3>
                    <p className="text-[11px] text-slate-400">Click any photo to open full-screen viewer</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {galleryItems.length} Photos
                </span>
              </div>

              {/* Clean Responsive Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {galleryItems.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    onClick={() => setActiveLightboxIndex(idx)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3" />

                    {/* Expand icon top right */}
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Clean minimal title at bottom */}
                    <div className="absolute bottom-2.5 inset-x-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-xs font-bold truncate drop-shadow-sm">
                        {photo.title}
                      </p>
                      {photo.caption && (
                        <p className="text-[10px] text-slate-300 truncate drop-shadow-xs">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Connect with Candidate</h3>
                  <p className="text-xs text-slate-500">Reach the campaign office directly or ask a public question</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900">Official Campaign Coordinates</h4>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{candidate.contactEmail || `${candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@myamu.ac.in`}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span>{candidate.officeAddress || `Campaign Office: Room 14, ${candidate.hallOfResidence || 'Sir Syed Hall North'}`}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>Helpline: {candidate.phone || '+91 571 2700920 (Extension 492)'}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Office Visiting Hours: {candidate.visitingHours || '4:30 PM - 7:30 PM Daily'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">Campaign Social Links:</span>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
                        Instagram: {candidate.instagram || `@${candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_amu2025`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ask a Question Form */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-sm text-slate-900">Ask {candidate.name.split(' ')[0]} a Question</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Questions submitted by students are addressed during the live presidential & candidate debates.
                  </p>

                  {questionSent ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                      <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-emerald-900">Question Received!</p>
                      <p className="text-[11px] text-emerald-700">Thank you. Your question will be reviewed for the Kennedy Auditorium debate.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendQuestion} className="space-y-3 pt-1">
                      <textarea
                        required
                        rows={3}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder={`e.g., How do you plan to address the hostel allotment delay in ${candidate.faculty}?`}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Question to Candidate</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom "Let's Build a Better AMU Together" Banner */}
        <div className="bg-[#fefce8] border border-amber-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                Let&apos;s Build a Better AMU Together
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Show your support on 05 November 2025. Your voice shapes our university.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToCandidates}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-98 transition-all shrink-0"
          >
            <span>Back to All Candidates</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Improved Sleek Video Theater Modal */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="bg-slate-950 rounded-3xl max-w-4xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white leading-tight">
                    {candidate.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Official Campaign Address</p>
                </div>
              </div>

              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {(() => {
                const videoUrl = candidate.campaignVideoUrl;
                const embedUrl = videoUrl ? getEmbedVideoUrl(videoUrl) : null;
                const isDirect = videoUrl ? isDirectVideoFile(videoUrl) : false;

                if (embedUrl) {
                  return (
                    <iframe
                      src={embedUrl}
                      title={`${candidate.name} Campaign Video`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                }

                if (isDirect && videoUrl) {
                  return (
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  );
                }

                if (videoUrl) {
                  return (
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  );
                }

                // Default high-production campaign address broadcast
                return (
                  <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-radial from-slate-900 via-slate-950 to-black">
                    <img
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
                      alt="Address backdrop"
                      className="absolute inset-0 w-full h-full object-cover opacity-25"
                    />
                    <div className="relative z-10 space-y-3 max-w-md">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
                        <Play className="w-8 h-8 fill-current translate-x-0.5" />
                      </div>
                      <h4 className="text-white text-base font-extrabold">Campaign Address Broadcast</h4>
                      <p className="text-xs text-slate-300">
                        {candidate.name} • {candidate.faculty}
                      </p>
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                        Recorded at Kennedy Hall Lawn
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Lightbox Image Viewer */}
      {activeLightboxIndex !== null && galleryItems[activeLightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div 
            className="relative max-w-5xl w-full h-full max-h-[92vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Counter & Close */}
            <div className="flex items-center justify-between py-2 text-white z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/15">
                  {activeLightboxIndex + 1} / {galleryItems.length}
                </span>
                <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                  {galleryItems[activeLightboxIndex].title}
                </span>
              </div>

              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close image viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image Display with Navigation Arrows */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2">
              <img
                src={galleryItems[activeLightboxIndex].url}
                alt={galleryItems[activeLightboxIndex].title}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-200 select-none"
              />

              {/* Prev Button */}
              {galleryItems.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null));
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
                </button>
              )}

              {/* Next Button */}
              {galleryItems.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryItems.length : null));
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6 translate-x-0.5" />
                </button>
              )}
            </div>

            {/* Bottom Caption and Thumbnails */}
            <div className="space-y-2 py-2 text-center text-white z-10">
              <div>
                <h4 className="text-sm font-extrabold text-white">
                  {galleryItems[activeLightboxIndex].title}
                </h4>
                {galleryItems[activeLightboxIndex].caption && (
                  <p className="text-xs text-slate-400 mt-0.5 max-w-lg mx-auto">
                    {galleryItems[activeLightboxIndex].caption}
                  </p>
                )}
              </div>

              {/* Thumbnails strip */}
              {galleryItems.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto pt-1 scrollbar-none max-w-md mx-auto">
                  {galleryItems.map((thumb, idx) => (
                    <button
                      key={thumb.id || idx}
                      onClick={() => setActiveLightboxIndex(idx)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        idx === activeLightboxIndex
                          ? 'border-emerald-400 scale-105 shadow-md'
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claim Profile Modal */}
      <ClaimProfileModal
        candidate={candidate}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />
    </div>
  );
};
