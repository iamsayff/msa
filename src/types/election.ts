/**
 * AMUSU Elections - Student Election Dashboard Data Types
 * Clean, structured types ready for future backend API & database integration.
 */

export type PostType = 
  | 'president'
  | 'vice_president'
  | 'honorary_secretary'
  | 'cabinet_member'
  | 'court_member';

export interface CandidateQuestion {
  id: string;
  question: string;
  askedBy: string;
  faculty: string;
  answer?: string;
  answeredAt?: string;
}

export interface Candidate {
  id: string;
  name: string;
  slug?: string;
  post: PostType;
  quote: string;

  faculty: string;
  year?: string;
  program?: string;
  hallOfResidence?: string;
  enrollmentNo?: string;
  avatarUrl?: string;
  symbol?: string;
  symbolName?: string;
  serialNumber?: number | string;
  claimedEmail?: string;
  isClaimed?: boolean;
  isVerified?: boolean;
  bio?: string;
  fullBio?: string[];
  manifestoHighlights?: string[];
  manifestoDetails?: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  leadershipRoles?: string[];
  qaAnswers?: CandidateQuestion[];
  campaignVideoUrl?: string;
  manifestoPdfUrl?: string;
  manifestoPdfName?: string;
  contactEmail?: string;
  instagram?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
  officeAddress?: string;
  visitingHours?: string;
  votesCount?: number;
  aboutMe?: string;
  whyRunning?: string;
  skills?: string[];
  signatureQuote?: string;
  sloganBanner?: string;
  galleryPhotos?: CandidateGalleryItem[];
  experienceRecords?: CandidateExperienceItem[];
  achievementsList?: CandidateAchievementItem[];
  visionGoals?: CandidateVisionItem[];
}

export interface CandidateGalleryItem {
  id: string;
  url: string;
  title: string;
  caption?: string;
  location?: string;
}

export interface CandidateExperienceItem {
  id: string;
  year: string;
  title: string;
  organization: string;
  description: string;
}

export interface CandidateAchievementItem {
  id: string;
  year: string;
  title: string;
  category: string;
  description: string;
}

export interface CandidateVisionItem {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface ProfileClaimRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  applicantName?: string;
  email?: string;
  phone?: string;
  studentId?: string;
  admissionCardInfo?: string;
  message?: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface PostCategoryConfig {
  id: PostType;
  title: string;
  label: string;
  colorName: string;
  themeColor: {
    badgeBg: string;
    badgeText: string;
    border: string;
    headerBg: string;
    headerText: string;
    accentColor: string;
    buttonBg: string;
    buttonHover: string;
    avatarBorder: string;
    viewAllBorder: string;
    viewAllBg: string;
  };
}

export interface TimelinePhase {
  id: number;
  phaseNumber: string;
  title: string;
  date: string;
  month: string;
  status: 'Completed' | 'Ongoing' | 'Upcoming' | 'Voting Day';
  statusColor: string;
  description: string;
  details: string;
  location?: string;
  time?: string;
}

export interface CampusIssue {
  id: string;
  title: string;
  category: string;
  description: string;
  talksCount: number;
  upvotesCount: number;
  hasUpvoted?: boolean;
  imageUrl?: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  postedAt: string;
  comments?: Array<{
    author: string;
    faculty: string;
    text: string;
    time: string;
  }>;
}

export interface ManifestoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  points: string[];
  author: string;
  post: string;
}
