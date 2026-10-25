import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc,
  writeBatch,
  increment,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Candidate, PostType, CampusIssue, ProfileClaimRequest } from '../types/election';
import { MOCK_CANDIDATES, CAMPUS_ISSUES } from '../data/mockElectionData';
import { useAuth } from './AuthContext';

export interface UserBallot {
  president?: string;
  vicePresident?: string;
  honorarySecretary?: string;
  courtMember?: string;
  cabinetMembers: string[]; // Up to 10 candidates allowed
  updatedAt?: string;
}

interface ElectionContextType {
  candidates: Candidate[];
  issues: CampusIssue[];
  ballot: UserBallot;
  claimRequests: ProfileClaimRequest[];
  loading: boolean;
  hasVoted: boolean;
  castVote: (newBallot: UserBallot) => Promise<boolean>;
  changeSinglePostVote: (post: PostType, candidateId: string) => Promise<boolean>;
  toggleCabinetMemberVote: (candidateId: string) => Promise<boolean>;
  toggleIssueUpvote: (issueId: string) => Promise<void>;
  createCampusIssue: (newIssue: Omit<CampusIssue, 'id' | 'talksCount' | 'upvotesCount' | 'status' | 'postedAt'>) => Promise<boolean>;
  addCommentToIssue: (issueId: string, text: string) => Promise<boolean>;
  getCandidateVotes: (candidateId: string) => number;
  updateCandidate: (candidateId: string, updates: Partial<Candidate>) => Promise<boolean>;
  addCandidate: (newCandidateData: { name: string; post: PostType; faculty: string }) => Promise<string>;
  deleteCandidate: (candidateId: string) => Promise<boolean>;
  assignCandidateEmail: (candidateId: string, email: string) => Promise<boolean>;
  submitClaimRequest: (claimData: Omit<ProfileClaimRequest, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateClaimStatus: (requestId: string, status: 'pending' | 'verified' | 'rejected') => Promise<void>;
  deleteCampusIssue: (issueId: string) => Promise<void>;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, openAuthModal } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [issues, setIssues] = useState<CampusIssue[]>(CAMPUS_ISSUES);
  const [claimRequests, setClaimRequests] = useState<ProfileClaimRequest[]>([]);
  const [ballot, setBallot] = useState<UserBallot>(() => {
    try {
      const saved = localStorage.getItem('amu_pulse_ballot');
      return saved ? JSON.parse(saved) : { cabinetMembers: [] };
    } catch {
      return { cabinetMembers: [] };
    }
  });
  const [loading, setLoading] = useState(true);

  // 1. Seed & Listen to Candidates in Real-Time
  useEffect(() => {
    const candidatesCol = collection(db, 'candidates');

    const unsubscribe = onSnapshot(candidatesCol, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial candidates into Firestore
        try {
          const batch = writeBatch(db);
          MOCK_CANDIDATES.forEach((cand) => {
            const candRef = doc(db, 'candidates', cand.id);
            batch.set(candRef, {
              ...cand,
              serialNumber: cand.serialNumber !== undefined ? cand.serialNumber : 0,
              votesCount: cand.votesCount || 100,
            }, { merge: true });
          });
          await batch.commit();
        } catch (err) {
          console.warn('Initial candidate seeding notice:', err);
        }
      } else {
        const liveCandidates: Candidate[] = [];
        snapshot.forEach((docSnap) => {
          const cdata = docSnap.data() as Candidate;
          liveCandidates.push({ 
            ...cdata, 
            id: docSnap.id,
            serialNumber: cdata.serialNumber !== undefined ? cdata.serialNumber : 0,
          });
        });
        setCandidates(liveCandidates);
        setLoading(false);
      }
    }, (error) => {
      console.warn('Realtime candidates sync notice:', error);
      setCandidates(MOCK_CANDIDATES);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-Time Listener for Candidate Profile Claim Requests
  useEffect(() => {
    const claimsCol = collection(db, 'claimRequests');

    const unsubscribe = onSnapshot(claimsCol, (snapshot) => {
      const claims: ProfileClaimRequest[] = [];
      snapshot.forEach((docSnap) => {
        claims.push({ ...(docSnap.data() as ProfileClaimRequest), id: docSnap.id });
      });
      claims.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setClaimRequests(claims);
    }, (error) => {
      console.warn('Claims sync notice:', error);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-Time Listener for Campus Issues
  useEffect(() => {
    const issuesCol = collection(db, 'campusIssues');

    const unsubscribe = onSnapshot(issuesCol, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial campus issues into Firestore
        try {
          const batch = writeBatch(db);
          CAMPUS_ISSUES.forEach((iss) => {
            const issRef = doc(db, 'campusIssues', iss.id);
            batch.set(issRef, iss, { merge: true });
          });
          await batch.commit();
        } catch (err) {
          console.warn('Initial issues seeding notice:', err);
        }
      } else {
        const liveIssues: CampusIssue[] = [];
        snapshot.forEach((docSnap) => {
          liveIssues.push({ ...(docSnap.data() as CampusIssue), id: docSnap.id });
        });
        setIssues(liveIssues);
      }
    }, (error) => {
      console.warn('Issues sync notice:', error);
      setIssues(CAMPUS_ISSUES);
    });

    return () => unsubscribe();
  }, []);

  // 3. Real-Time Listener for User's Confidential Ballot
  const effectiveUserId = user?.uid || profile?.uid;

  useEffect(() => {
    if (!effectiveUserId) {
      return;
    }

    const ballotRef = doc(db, 'votes', effectiveUserId);
    const unsubscribe = onSnapshot(ballotRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserBallot;
        const syncedBallot: UserBallot = {
          ...data,
          cabinetMembers: Array.isArray(data.cabinetMembers) ? data.cabinetMembers : [],
        };
        setBallot(syncedBallot);
        try {
          localStorage.setItem('amu_pulse_ballot', JSON.stringify(syncedBallot));
        } catch {}
      }
    }, (error) => {
      console.warn('Ballot sync notice:', error);
    });

    return () => unsubscribe();
  }, [effectiveUserId]);

  // Helper to read candidate live votes
  const getCandidateVotes = (candidateId: string): number => {
    const cand = candidates.find((c) => c.id === candidateId);
    return cand?.votesCount || 0;
  };

  const hasVoted = Boolean(
    ballot.president || 
    ballot.vicePresident || 
    ballot.honorarySecretary || 
    ballot.courtMember || 
    (ballot.cabinetMembers && ballot.cabinetMembers.length > 0)
  );

  // 4. Smooth Cast / Update Ballot with Atomic Vote Counting
  const castVote = async (newBallot: UserBallot): Promise<boolean> => {
    if (!user && !profile) {
      openAuthModal();
      return false;
    }

    const voterId = effectiveUserId || 'amu-student-voter-01';

    // 1. Optimistic instant local updates for immediate feedback
    const previousBallot = { ...ballot };
    setBallot(newBallot);
    try {
      localStorage.setItem('amu_pulse_ballot', JSON.stringify(newBallot));
    } catch {}

    // 2. Adjust local candidate votes instantaneously
    setCandidates((currCandidates) => {
      return currCandidates.map((c) => {
        let diff = 0;
        // President
        if (previousBallot.president === c.id && newBallot.president !== c.id) diff -= 1;
        if (newBallot.president === c.id && previousBallot.president !== c.id) diff += 1;
        // VP
        if (previousBallot.vicePresident === c.id && newBallot.vicePresident !== c.id) diff -= 1;
        if (newBallot.vicePresident === c.id && previousBallot.vicePresident !== c.id) diff += 1;
        // Secretary
        if (previousBallot.honorarySecretary === c.id && newBallot.honorarySecretary !== c.id) diff -= 1;
        if (newBallot.honorarySecretary === c.id && previousBallot.honorarySecretary !== c.id) diff += 1;
        // Court Member
        if (previousBallot.courtMember === c.id && newBallot.courtMember !== c.id) diff -= 1;
        if (newBallot.courtMember === c.id && previousBallot.courtMember !== c.id) diff += 1;
        // Cabinet Members
        const wasInCabinet = (previousBallot.cabinetMembers || []).includes(c.id);
        const isInCabinet = (newBallot.cabinetMembers || []).includes(c.id);
        if (wasInCabinet && !isInCabinet) diff -= 1;
        if (!wasInCabinet && isInCabinet) diff += 1;

        if (diff !== 0) {
          return { ...c, votesCount: Math.max(0, (c.votesCount || 0) + diff) };
        }
        return c;
      });
    });

    // 3. Persist to Firestore with safety timeout
    try {
      const batch = writeBatch(db);

      // Save ballot doc
      const ballotRef = doc(db, 'votes', voterId);
      batch.set(ballotRef, {
        ...newBallot,
        userId: voterId,
        userEmail: user?.email || profile?.email || '',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Handle increment/decrement for President
      if (newBallot.president !== previousBallot.president) {
        if (previousBallot.president) {
          batch.set(doc(db, 'candidates', previousBallot.president), { votesCount: increment(-1) }, { merge: true });
        }
        if (newBallot.president) {
          batch.set(doc(db, 'candidates', newBallot.president), { votesCount: increment(1) }, { merge: true });
        }
      }

      // Handle Vice President
      if (newBallot.vicePresident !== previousBallot.vicePresident) {
        if (previousBallot.vicePresident) {
          batch.set(doc(db, 'candidates', previousBallot.vicePresident), { votesCount: increment(-1) }, { merge: true });
        }
        if (newBallot.vicePresident) {
          batch.set(doc(db, 'candidates', newBallot.vicePresident), { votesCount: increment(1) }, { merge: true });
        }
      }

      // Handle Honorary Secretary
      if (newBallot.honorarySecretary !== previousBallot.honorarySecretary) {
        if (previousBallot.honorarySecretary) {
          batch.set(doc(db, 'candidates', previousBallot.honorarySecretary), { votesCount: increment(-1) }, { merge: true });
        }
        if (newBallot.honorarySecretary) {
          batch.set(doc(db, 'candidates', newBallot.honorarySecretary), { votesCount: increment(1) }, { merge: true });
        }
      }

      // Handle Court Member
      if (newBallot.courtMember !== previousBallot.courtMember) {
        if (previousBallot.courtMember) {
          batch.set(doc(db, 'candidates', previousBallot.courtMember), { votesCount: increment(-1) }, { merge: true });
        }
        if (newBallot.courtMember) {
          batch.set(doc(db, 'candidates', newBallot.courtMember), { votesCount: increment(1) }, { merge: true });
        }
      }

      // Handle Cabinet Members
      const oldCabinet = previousBallot.cabinetMembers || [];
      const nextCabinet = newBallot.cabinetMembers || [];

      oldCabinet.filter((id) => !nextCabinet.includes(id)).forEach((id) => {
        batch.set(doc(db, 'candidates', id), { votesCount: increment(-1) }, { merge: true });
      });

      nextCabinet.filter((id) => !oldCabinet.includes(id)).forEach((id) => {
        batch.set(doc(db, 'candidates', id), { votesCount: increment(1) }, { merge: true });
      });

      const writePromise = batch.commit();
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
      await Promise.race([writePromise, timeoutPromise]);
    } catch (err) {
      console.warn('Firestore vote commit warning (saved locally):', err);
    }

    return true;
  };

  // 5. Change single post vote
  const changeSinglePostVote = async (post: PostType, candidateId: string): Promise<boolean> => {
    if (!user && !profile) {
      openAuthModal();
      return false;
    }

    let updated: UserBallot = { ...ballot };
    if (post === 'president') updated.president = candidateId;
    if (post === 'vice_president') updated.vicePresident = candidateId;
    if (post === 'honorary_secretary') updated.honorarySecretary = candidateId;
    if (post === 'court_member') updated.courtMember = candidateId;

    return await castVote(updated);
  };

  // 6. Toggle Cabinet Member (Max 10)
  const toggleCabinetMemberVote = async (candidateId: string): Promise<boolean> => {
    if (!user && !profile) {
      openAuthModal();
      return false;
    }

    const currentCabinet = ballot.cabinetMembers || [];
    let updatedCabinet: string[];

    if (currentCabinet.includes(candidateId)) {
      updatedCabinet = currentCabinet.filter((id) => id !== candidateId);
    } else {
      if (currentCabinet.length >= 10) {
        alert('You have reached the maximum limit of 10 Cabinet Members. Deselect one to choose another.');
        return false;
      }
      updatedCabinet = [...currentCabinet, candidateId];
    }

    return await castVote({
      ...ballot,
      cabinetMembers: updatedCabinet,
    });
  };

  // 7. Upvote Campus Issue
  const toggleIssueUpvote = async (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const wasUpvoted = !!iss.hasUpvoted;
          const newCount = wasUpvoted ? Math.max(0, iss.upvotesCount - 1) : iss.upvotesCount + 1;
          
          // Sync with Firestore
          try {
            setDoc(doc(db, 'campusIssues', issueId), {
              upvotesCount: increment(wasUpvoted ? -1 : 1),
            }, { merge: true }).catch(() => {});
          } catch {}

          return {
            ...iss,
            hasUpvoted: !wasUpvoted,
            upvotesCount: newCount,
          };
        }
        return iss;
      })
    );
  };

  // 8. Create Campus Issue (Requires Sign-In)
  const createCampusIssue = async (
    newIssueData: Omit<CampusIssue, 'id' | 'talksCount' | 'upvotesCount' | 'status' | 'postedAt'>
  ): Promise<boolean> => {
    if (!user && !profile) {
      openAuthModal();
      return false;
    }

    const newId = `issue-${Date.now()}`;
    const authorName = profile?.name || user?.displayName || 'Student';
    const authorFaculty = profile?.faculty || 'AMU Student';

    const created: CampusIssue = {
      ...newIssueData,
      id: newId,
      talksCount: 1,
      upvotesCount: 1,
      status: 'Open',
      postedAt: 'Just now',
      comments: [
        {
          author: authorName,
          faculty: authorFaculty,
          text: 'Submitted this issue to the AMU Pulse student board.',
          time: 'Just now',
        },
      ],
    };

    // Instant local update
    setIssues((prev) => [created, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'campusIssues', newId), created);
    } catch (err) {
      console.warn('Error saving issue to Firestore:', err);
    }

    return true;
  };

  // 9. Add Comment to Issue (Requires Sign-In)
  const addCommentToIssue = async (issueId: string, text: string): Promise<boolean> => {
    if (!user && !profile) {
      openAuthModal();
      return false;
    }

    const authorName = profile?.name || user?.displayName || 'Student';
    const authorFaculty = profile?.faculty || 'AMU Student';

    const newComment = {
      author: authorName,
      faculty: authorFaculty,
      text,
      time: 'Just now',
    };

    let updatedIssue: CampusIssue | null = null;

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const updatedComments = [...(iss.comments || []), newComment];
          const updated = {
            ...iss,
            talksCount: (iss.talksCount || 0) + 1,
            comments: updatedComments,
          };
          updatedIssue = updated;
          return updated;
        }
        return iss;
      })
    );

    if (updatedIssue) {
      try {
        await setDoc(doc(db, 'campusIssues', issueId), updatedIssue, { merge: true });
      } catch (err) {
        console.warn('Error saving comment to Firestore:', err);
      }
    }

    return true;
  };

  // 10. Update Candidate
  const updateCandidate = async (candidateId: string, updates: Partial<Candidate>): Promise<boolean> => {
    setCandidates((curr) =>
      curr.map((c) => (c.id === candidateId ? { ...c, ...updates } : c))
    );
    try {
      await setDoc(doc(db, 'candidates', candidateId), updates, { merge: true });
      return true;
    } catch (err) {
      console.warn('Candidate update warning:', err);
      return false;
    }
  };

  // Add New Candidate
  const addCandidate = async (newCandidateData: { name: string; post: PostType; faculty: string }): Promise<string> => {
    const id = `cand-${Date.now()}`;
    const newCand: Candidate = {
      id,
      name: newCandidateData.name.trim(),
      post: newCandidateData.post,
      faculty: newCandidateData.faculty.trim() || 'Faculty of Arts',
      quote: '',
      year: 'Final Year',
      program: '',
      hallOfResidence: '',
      enrollmentNo: '',
      avatarUrl: '',
      symbol: '🌟',
      symbolName: 'Candidate Star',
      bio: '',
      manifestoHighlights: [],
      manifestoDetails: [],
      votesCount: 0,
      serialNumber: candidates.length + 1,
    };

    setCandidates((curr) => [...curr, newCand]);
    try {
      await setDoc(doc(db, 'candidates', id), newCand);
      return id;
    } catch (err) {
      console.warn('Error adding candidate to Firestore:', err);
      return id;
    }
  };

  // Delete Candidate
  const deleteCandidate = async (candidateId: string): Promise<boolean> => {
    setCandidates((curr) => curr.filter((c) => c.id !== candidateId));
    try {
      await deleteDoc(doc(db, 'candidates', candidateId));
      return true;
    } catch (err) {
      console.warn('Error deleting candidate from Firestore:', err);
      return false;
    }
  };

  // 11. Assign candidate email for profile editing
  const assignCandidateEmail = async (candidateId: string, email: string): Promise<boolean> => {
    return await updateCandidate(candidateId, { claimedEmail: email.trim().toLowerCase() });
  };

  // 12. Submit Profile Claim Request
  const submitClaimRequest = async (
    claimData: Omit<ProfileClaimRequest, 'id' | 'status' | 'createdAt'>
  ): Promise<boolean> => {
    const newId = `claim-${Date.now()}`;
    const newClaim: ProfileClaimRequest = {
      ...claimData,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setClaimRequests((prev) => [newClaim, ...prev]);
    try {
      await setDoc(doc(db, 'claimRequests', newId), newClaim);
      return true;
    } catch (err) {
      console.warn('Error saving claim request:', err);
      return true;
    }
  };

  // 13. Update Claim Status
  const updateClaimStatus = async (
    requestId: string,
    status: 'pending' | 'verified' | 'rejected'
  ) => {
    setClaimRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
    try {
      await setDoc(doc(db, 'claimRequests', requestId), { status }, { merge: true });
    } catch (err) {
      console.warn('Error updating claim status:', err);
    }
  };

  // 14. Delete Campus Issue
  const deleteCampusIssue = async (issueId: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
    try {
      await deleteDoc(doc(db, 'campusIssues', issueId));
    } catch (err) {
      console.warn('Error deleting issue from Firestore:', err);
    }
  };

  return (
    <ElectionContext.Provider
      value={{
        candidates,
        issues,
        ballot,
        claimRequests,
        loading,
        hasVoted,
        castVote,
        changeSinglePostVote,
        toggleCabinetMemberVote,
        toggleIssueUpvote,
        createCampusIssue,
        addCommentToIssue,
        getCandidateVotes,
        updateCandidate,
        addCandidate,
        deleteCandidate,
        assignCandidateEmail,
        submitClaimRequest,
        updateClaimStatus,
        deleteCampusIssue,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};
