import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Camera, 
  Video, 
  FileText, 
  Trash2, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Target, 
  Briefcase, 
  Star, 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  Building, 
  Eye, 
  Hash,
  Instagram,
  Twitter,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  Candidate, 
  CandidateGalleryItem, 
  CandidateExperienceItem, 
  CandidateAchievementItem, 
  CandidateVisionItem 
} from '../types/election';
import { useElection } from '../context/ElectionContext';
import { useAuth } from '../context/AuthContext';
import { POST_CATEGORIES } from '../data/mockElectionData';

interface EditCandidatePageProps {
  candidateId: string;
  onBackToProfile: () => void;
  onNavigateToCandidate?: (candidateId: string) => void;
}

export const EditCandidatePage: React.FC<EditCandidatePageProps> = ({
  candidateId,
  onBackToProfile,
  onNavigateToCandidate,
}) => {
  const { candidates, updateCandidate } = useElection();
  const { user, profile } = useAuth();

  const candidate = candidates.find((c) => c.id === candidateId || c.slug === candidateId);

  const [activeTab, setActiveTab] = useState<
    'basic' | 'about' | 'vision' | 'experience' | 'achievements' | 'gallery' | 'contact'
  >('basic');

  // Core Form State
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState<number | string>(0);
  const [quote, setQuote] = useState('');
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [hallOfResidence, setHallOfResidence] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [claimedEmail, setClaimedEmail] = useState('');

  // Media
  const [avatarUrl, setAvatarUrl] = useState('');
  const [campaignVideoUrl, setCampaignVideoUrl] = useState('');
  const [manifestoPdfUrl, setManifestoPdfUrl] = useState('');
  const [manifestoPdfName, setManifestoPdfName] = useState('');

  // About Tab
  const [bio, setBio] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [whyRunning, setWhyRunning] = useState('');
  const [signatureQuote, setSignatureQuote] = useState('');
  const [sloganBanner, setSloganBanner] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillText, setNewSkillText] = useState('');

  // Vision Points
  const [visionGoals, setVisionGoals] = useState<CandidateVisionItem[]>([]);

  // Experience Items
  const [experienceRecords, setExperienceRecords] = useState<CandidateExperienceItem[]>([]);

  // Achievements Items
  const [achievementsList, setAchievementsList] = useState<CandidateAchievementItem[]>([]);

  // Gallery Photos
  const [galleryPhotos, setGalleryPhotos] = useState<CandidateGalleryItem[]>([]);

  // Contact Info
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [visitingHours, setVisitingHours] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize with candidate data
  useEffect(() => {
    if (candidate) {
      setName(candidate.name || '');
      setSerialNumber(candidate.serialNumber !== undefined ? candidate.serialNumber : 0);
      setQuote(candidate.quote || '');
      setFaculty(candidate.faculty || '');
      setProgram(candidate.program || '');
      setYear(candidate.year || '');
      setHallOfResidence(candidate.hallOfResidence || '');
      setEnrollmentNo(candidate.enrollmentNo || '');
      setClaimedEmail(candidate.claimedEmail || '');

      setAvatarUrl(candidate.avatarUrl || '');
      setCampaignVideoUrl(candidate.campaignVideoUrl || '');
      setManifestoPdfUrl(candidate.manifestoPdfUrl || '');
      setManifestoPdfName(candidate.manifestoPdfName || (candidate.manifestoPdfUrl ? 'AMUSU_Candidate_Manifesto.pdf' : ''));

      setBio(candidate.bio || '');
      setAboutMe(candidate.aboutMe || `I am ${candidate.name}, a dedicated student from the ${candidate.faculty}. I believe in the power of unity, open dialogue and collective action.`);
      setWhyRunning(candidate.whyRunning || `I am running for the student union because I want to create a campus where students feel heard, supported and empowered.`);
      setSignatureQuote(candidate.signatureQuote || candidate.quote || 'Real change happens when students stop being just recipients of policies and start authoring them.');
      setSloganBanner(candidate.sloganBanner || 'Stronger Students • Brighter AMU');
      setSkills(candidate.skills && candidate.skills.length > 0 ? candidate.skills : [
        'Student Welfare Advocacy',
        'Open Governance',
        'Active Problem Solving',
        'Public Speaking',
        'Campus Unity',
      ]);

      setVisionGoals(candidate.visionGoals && candidate.visionGoals.length > 0 ? candidate.visionGoals : [
        { id: '1', title: '24x7 Digital Library & Extended Reading Rooms', category: 'Academic', description: 'Expanding high-speed Wi-Fi, adding 200 new charging desks, and extending midnight reading room hours in Maulana Azad Library.' },
        { id: '2', title: 'Dining Hall Quality & Drinking Water Standards', category: 'Hostel', description: 'Institutionalizing democratic student mess committees in each hall, ensuring certified RO water coolers on every floor.' },
        { id: '3', title: '48-Hour Student Grievance Redressal', category: 'Governance', description: 'Launching an open online ticket portal where maintenance requests, scholarship inquiries, and fee issues are monitored.' },
        { id: '4', title: 'Placement & Internship Drives for All Faculties', category: 'Career', description: 'Connecting with national alumni networks to bring dedicated job fairs and skill workshops to Arts, Science, Commerce, and Social Sciences students.' },
        { id: '5', title: 'Cultural & Sports Budget Revival', category: 'Campus Life', description: 'Revitalizing inter-hall sports tournaments, Sir Syed Day debate cups, and providing direct financial backing to active student cultural clubs.' },
      ]);

      setExperienceRecords(candidate.experienceRecords && candidate.experienceRecords.length > 0 ? candidate.experienceRecords : [
        { id: '1', year: '2024', title: 'Senior Student Council Representative', organization: `Faculty of ${candidate.faculty}`, description: 'Represented over 800 students in departmental academic reviews, successfully negotiating flexible seminar schedules.' },
        { id: '2', year: '2023', title: 'Convenor, Inter-Hall Cultural Meet', organization: 'General Education Centre (GEC)', description: 'Coordinated student teams across Kennedy Auditorium and Strachey Hall, managing event budgeting and reception.' },
        { id: '3', year: '2022', title: 'Dining & Health Committee Member', organization: candidate.hallOfResidence || 'Sir Syed Hall', description: 'Audited dining hall groceries, hygiene standards, and instituted a regular feedback log for student residents.' },
      ]);

      setAchievementsList(candidate.achievementsList && candidate.achievementsList.length > 0 ? candidate.achievementsList : [
        { id: '1', year: '2024', title: 'Kennedy Memorial Debate Champion', category: 'Literary', description: 'First place among 32 contesting universities across India.' },
        { id: '2', year: '2023', title: 'Dean\'s Academic Merit Roll', category: 'Academic', description: 'Maintained consistent distinction in coursework and departmental seminars.' },
        { id: '3', year: '2023', title: 'Campus Blood Donation Organizer', category: 'Community', description: 'Helped mobilize over 350 student voluntary blood donors in a single drive.' },
        { id: '4', year: '2022', title: 'Best Student Resident Award', category: 'Hostel', description: 'Awarded for exemplary discipline, peer mentorship, and hall community service.' },
      ]);

      setGalleryPhotos(candidate.galleryPhotos && candidate.galleryPhotos.length > 0 ? candidate.galleryPhotos : [
        { id: '1', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=600', title: 'Kennedy Auditorium Lawn Gathering', caption: 'Open Q&A on Student Charter with undergraduate students.' },
        { id: '2', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600', title: 'Dining Reform Dialogue', caption: 'Listening to boarders regarding nutrition, mess fees, and clean drinking water.' },
        { id: '3', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600', title: 'Alumni & Placement Roundtable', caption: 'Discussing internships and competitive exam guidance with department seniors.' },
      ]);

      setContactEmail(candidate.contactEmail || `${candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@myamu.ac.in`);
      setPhone(candidate.phone || '+91 98765 43210');
      setWhatsapp(candidate.whatsapp || '+91 98765 43210');
      setOfficeAddress(candidate.officeAddress || `Room 14, ${candidate.hallOfResidence || 'Sir Syed Hall North'}`);
      setVisitingHours(candidate.visitingHours || '4:30 PM - 7:30 PM Daily');
      setInstagram(candidate.instagram || `@${candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_amu2025`);
      setTwitter(candidate.twitter || `@${candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_amu`);
    }
  }, [candidate]);

  if (!candidate) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Candidate Not Found</h2>
        <button
          onClick={onBackToProfile}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Candidates
        </button>
      </div>
    );
  }

  // --- Handlers for File Uploads ---

  // 1. Profile Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Video File Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCampaignVideoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Manifesto PDF Upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setManifestoPdfName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setManifestoPdfUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Campaign Gallery Multiple Photos Upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setGalleryPhotos((prev) => [
            ...prev,
            {
              id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              url: reader.result as string,
              title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
              caption: 'Live campaign discussion photo',
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add skill chip
  const handleAddSkill = () => {
    if (newSkillText.trim() && !skills.includes(newSkillText.trim())) {
      setSkills([...skills, newSkillText.trim()]);
      setNewSkillText('');
    }
  };

  // Remove skill chip
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Save All Changes
  const handleSaveAll = async () => {
    setSaving(true);
    const parsedSerial = typeof serialNumber === 'string' ? parseInt(serialNumber, 10) : serialNumber;

    const updatedData: Partial<Candidate> = {
      name: name.trim(),
      serialNumber: isNaN(parsedSerial as number) ? 0 : parsedSerial,
      quote: quote.trim(),
      faculty: faculty.trim(),
      program: program.trim(),
      year: year.trim(),
      hallOfResidence: hallOfResidence.trim(),
      enrollmentNo: enrollmentNo.trim(),
      claimedEmail: claimedEmail.trim().toLowerCase(),

      avatarUrl: avatarUrl.trim(),
      campaignVideoUrl: campaignVideoUrl.trim(),
      manifestoPdfUrl: manifestoPdfUrl.trim(),
      manifestoPdfName: manifestoPdfName.trim(),

      bio: bio.trim(),
      aboutMe: aboutMe.trim(),
      whyRunning: whyRunning.trim(),
      signatureQuote: signatureQuote.trim(),
      sloganBanner: sloganBanner.trim(),
      skills,

      visionGoals,
      manifestoHighlights: visionGoals.map((v) => v.title).slice(0, 3),
      experienceRecords,
      achievementsList,
      galleryPhotos,

      contactEmail: contactEmail.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      officeAddress: officeAddress.trim(),
      visitingHours: visitingHours.trim(),
      instagram: instagram.trim(),
      twitter: twitter.trim(),
    };

    try {
      await updateCandidate(candidate.id, updatedData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.warn('Error updating candidate:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <button
              onClick={onBackToProfile}
              className="hover:text-slate-900 inline-flex items-center gap-1 font-bold text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Candidate Profile</span>
            </button>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{candidate.name}</span>
            <span>/</span>
            <span className="text-emerald-700 font-extrabold">Editor Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Candidate Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-page real-time customization workspace. Changes update live across the entire student portal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onBackToProfile}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Profile</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Database...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p>Profile updated successfully!</p>
            <p className="text-[11px] font-normal text-emerald-700">All student information, photos, videos, and manifesto files are synced with Firestore.</p>
          </div>
        </div>
      )}

      {/* 2. TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'basic' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>1. Basic & Media Uploads</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'about' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. About & Manifesto</span>
        </button>

        <button
          onClick={() => setActiveTab('vision')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'vision' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>3. Vision & 5-Point Goals</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'experience' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>4. Experience & Leadership</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'achievements' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>5. Key Achievements</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'gallery' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>6. Campaign Gallery ({galleryPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'contact' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>7. Contact Coordinates</span>
        </button>
      </div>

      {/* 3. TAB WORKSPACE CONTENTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        {/* TAB 1: BASIC INFO & MEDIA UPLOADS */}
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Electoral Meta & File Upload Slots</h3>
              <p className="text-xs text-slate-500">
                Upload your high-resolution profile photo, candidate 1-minute intro video, and printed manifesto PDF.
              </p>
            </div>

            {/* Media Uploads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Slot 1: Profile Photo Upload */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Profile Photo</span>
                    </span>
                    {avatarUrl && (
                      <button
                        onClick={() => setAvatarUrl('')}
                        className="text-[11px] font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Photo Preview */}
                  <div className="w-28 h-28 rounded-full mx-auto border-2 border-emerald-500 overflow-hidden bg-white shadow-xs flex items-center justify-center mb-3">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-emerald-800">
                        {name ? name.charAt(0) : 'U'}
                      </span>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="block w-full text-center py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 inline mr-1.5 text-emerald-600" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Or Enter Image Web URL:
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Slot 2: Intro Video Upload */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-blue-600" />
                      <span>1-Min Intro Video</span>
                    </span>
                    {campaignVideoUrl && (
                      <button
                        onClick={() => setCampaignVideoUrl('')}
                        className="text-[11px] font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Video Preview */}
                  <div className="w-full h-28 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center mb-3">
                    {campaignVideoUrl ? (
                      <video
                        src={campaignVideoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>No video uploaded</span>
                      </span>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="block w-full text-center py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 inline mr-1.5 text-blue-600" />
                    <span>Upload Video File</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Or Enter Video / YouTube Link:
                  </label>
                  <input
                    type="url"
                    value={campaignVideoUrl}
                    onChange={(e) => setCampaignVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Slot 3: Manifesto PDF Upload */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Manifesto PDF Document</span>
                    </span>
                    {manifestoPdfUrl && (
                      <button
                        onClick={() => {
                          setManifestoPdfUrl('');
                          setManifestoPdfName('');
                        }}
                        className="text-[11px] font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* PDF Status / Download Preview */}
                  <div className="w-full h-28 rounded-xl bg-purple-50/50 border border-purple-200/60 p-3 flex flex-col items-center justify-center text-center mb-3">
                    <FileText className="w-8 h-8 text-purple-600 mb-1" />
                    <span className="text-xs font-bold text-purple-950 truncate max-w-[200px]">
                      {manifestoPdfName || 'Official Manifesto PDF'}
                    </span>
                    <span className="text-[10px] text-purple-700">
                      {manifestoPdfUrl ? 'PDF attached & ready to download' : 'No document uploaded yet'}
                    </span>
                  </div>

                  {/* Upload Button */}
                  <label className="block w-full text-center py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-purple-500 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 inline mr-1.5 text-purple-600" />
                    <span>Upload Manifesto PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Or Enter Document URL:
                  </label>
                  <input
                    type="url"
                    value={manifestoPdfUrl}
                    onChange={(e) => setManifestoPdfUrl(e.target.value)}
                    placeholder="https://example.com/manifesto.pdf"
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Core Candidate Fields */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ballot Serial Number *
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-emerald-800"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Default 0 until election office allotment</span>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contesting Union Post
                </label>
                <input
                  type="text"
                  readOnly
                  value={candidate.post.replace('_', ' ').toUpperCase()}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Slogan / Slogan Quote
                </label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="e.g. A stronger AMU; a brighter future."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs italic"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty
                </label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="e.g. Faculty of Engineering & Technology"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Degree / Program
                </label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g. B.Tech Computer Engineering"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. Final Year (2021-2025)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hall of Residence
                </label>
                <input
                  type="text"
                  value={hallOfResidence}
                  onChange={(e) => setHallOfResidence(e.target.value)}
                  placeholder="e.g. Sir Syed Hall North"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  value={enrollmentNo}
                  onChange={(e) => setEnrollmentNo(e.target.value)}
                  placeholder="e.g. GL-2894"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT & MANIFESTO */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">About Me, Motivations & Skills</h3>
              <p className="text-xs text-slate-500">
                Personal bio and campaign narrative displayed on the first tab of your profile.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Signature Slogan Quote (Featured in Gold Card)
                </label>
                <input
                  type="text"
                  value={signatureQuote}
                  onChange={(e) => setSignatureQuote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short One-Paragraph Bio (Used in previews & search)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>&ldquo;About Me&rdquo; Section Text</span>
                  </label>
                  <textarea
                    rows={6}
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Detailed about me text..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    <span>&ldquo;Why I&apos;m Running&rdquo; Section Text</span>
                  </label>
                  <textarea
                    rows={6}
                    value={whyRunning}
                    onChange={(e) => setWhyRunning(e.target.value)}
                    placeholder="Explain why you are contesting..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Skills / Advocacy Badges */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Advocacy Strengths & Skills Chips
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-emerald-700 hover:text-emerald-950 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    placeholder="Add a new skill or advocacy focus..."
                    className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add Chip
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bottom Callout Slogan Banner
                </label>
                <input
                  type="text"
                  value={sloganBanner}
                  onChange={(e) => setSloganBanner(e.target.value)}
                  placeholder="e.g. More Opportunities • Stronger AMU"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISION & GOALS */}
        {activeTab === 'vision' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">5-Point Campus Transformation Plan</h3>
                <p className="text-xs text-slate-500">
                  Custom actionable student union pledges presented in your Vision & Goals tab.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setVisionGoals([
                    ...visionGoals,
                    {
                      id: `vis-${Date.now()}`,
                      title: 'New Student Initiative',
                      category: 'Welfare',
                      description: 'Describe the concrete campus transformation here.',
                    },
                  ])
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </div>

            <div className="space-y-4">
              {visionGoals.map((vg, idx) => (
                <div
                  key={vg.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-800">
                      Pledge #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setVisionGoals(visionGoals.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-9">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Title / Proposal
                      </label>
                      <input
                        type="text"
                        value={vg.title}
                        onChange={(e) => {
                          const updated = [...visionGoals];
                          updated[idx].title = e.target.value;
                          setVisionGoals(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={vg.category}
                        onChange={(e) => {
                          const updated = [...visionGoals];
                          updated[idx].category = e.target.value;
                          setVisionGoals(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-12">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Detailed Description & Student Impact
                      </label>
                      <textarea
                        rows={2}
                        value={vg.description}
                        onChange={(e) => {
                          const updated = [...visionGoals];
                          updated[idx].description = e.target.value;
                          setVisionGoals(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXPERIENCE & LEADERSHIP */}
        {activeTab === 'experience' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Leadership & Campus Service Record</h3>
                <p className="text-xs text-slate-500">
                  Past student representation, societies, committees, and hostel responsibilities.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setExperienceRecords([
                    ...experienceRecords,
                    {
                      id: `exp-${Date.now()}`,
                      year: '2024',
                      title: 'Student Representative Role',
                      organization: 'Departmental Forum',
                      description: 'Details of service to students.',
                    },
                  ])
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>

            <div className="space-y-4">
              {experienceRecords.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-800">
                      Record #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExperienceRecords(experienceRecords.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Year</label>
                      <input
                        type="text"
                        value={exp.year}
                        onChange={(e) => {
                          const updated = [...experienceRecords];
                          updated[idx].year = e.target.value;
                          setExperienceRecords(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Role Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...experienceRecords];
                          updated[idx].title = e.target.value;
                          setExperienceRecords(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Organization / Hall</label>
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) => {
                          const updated = [...experienceRecords];
                          updated[idx].organization = e.target.value;
                          setExperienceRecords(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-12">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Accomplishments</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...experienceRecords];
                          updated[idx].description = e.target.value;
                          setExperienceRecords(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ACHIEVEMENTS & AWARDS */}
        {activeTab === 'achievements' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Key Accolades & Milestones</h3>
                <p className="text-xs text-slate-500">
                  Awards, debate cups, academic merit recognitions, and community achievements.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAchievementsList([
                    ...achievementsList,
                    {
                      id: `ach-${Date.now()}`,
                      year: '2024',
                      title: 'Award or Milestone Title',
                      category: 'Recognized Body',
                      description: 'Details of recognition received.',
                    },
                  ])
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="space-y-4">
              {achievementsList.map((ach, idx) => (
                <div
                  key={ach.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-800">
                      Accolade #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAchievementsList(achievementsList.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Year</label>
                      <input
                        type="text"
                        value={ach.year}
                        onChange={(e) => {
                          const updated = [...achievementsList];
                          updated[idx].year = e.target.value;
                          setAchievementsList(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => {
                          const updated = [...achievementsList];
                          updated[idx].title = e.target.value;
                          setAchievementsList(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Awarding Body / Category</label>
                      <input
                        type="text"
                        value={ach.category}
                        onChange={(e) => {
                          const updated = [...achievementsList];
                          updated[idx].category = e.target.value;
                          setAchievementsList(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-12">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Summary Description</label>
                      <textarea
                        rows={2}
                        value={ach.description}
                        onChange={(e) => {
                          const updated = [...achievementsList];
                          updated[idx].description = e.target.value;
                          setAchievementsList(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CAMPAIGN GALLERY WITH PHOTO UPLOAD */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Campaign Trail Gallery</h3>
                <p className="text-xs text-slate-500">
                  Upload multiple campaign photographs with titles and captions to showcase your presence across halls and faculties.
                </p>
              </div>

              {/* Upload Multi-Photos Button */}
              <label className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs self-start transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Campaign Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleryPhotos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs space-y-2 pb-3"
                >
                  <div className="h-44 bg-slate-900 overflow-hidden relative group">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => setGalleryPhotos(galleryPhotos.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 space-y-2">
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(e) => {
                        const updated = [...galleryPhotos];
                        updated[idx].title = e.target.value;
                        setGalleryPhotos(updated);
                      }}
                      placeholder="Photo Title"
                      className="w-full p-1.5 font-bold text-xs rounded-lg border border-slate-200"
                    />

                    <textarea
                      rows={2}
                      value={photo.caption || ''}
                      onChange={(e) => {
                        const updated = [...galleryPhotos];
                        updated[idx].caption = e.target.value;
                        setGalleryPhotos(updated);
                      }}
                      placeholder="Photo Caption / Description"
                      className="w-full p-1.5 text-[11px] rounded-lg border border-slate-200 text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT COORDINATES */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Campaign Office & Public Contact</h3>
              <p className="text-xs text-slate-500">
                Official communication lines for students, press, and voter inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Campaign Email Address</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="candidate@myamu.ac.in"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Helpline / Mobile Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Campaign Office Location</span>
                </label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="e.g. Room 14, Sir Syed Hall North"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Visiting / Office Hours</span>
                </label>
                <input
                  type="text"
                  value={visitingHours}
                  onChange={(e) => setVisitingHours(e.target.value)}
                  placeholder="e.g. 4:30 PM - 7:30 PM Daily"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Handle</span>
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@candidate_amu2025"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-500" />
                  <span>Twitter / X Handle</span>
                </label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@candidate_amu"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            #{serialNumber}
          </div>
          <div>
            <span className="font-extrabold text-sm block">{name}</span>
            <span className="text-xs text-slate-400">
              Ballot #{serialNumber} • {candidate.post.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToProfile}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
