import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  course: string;
  faculty: string;
  hall: string;
  studentId: string;
  avatarUrl?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setAuthError(null);
        // Listen to User Profile in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeDoc = onSnapshot(
          userRef, 
          async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              setProfile(data);
              localStorage.setItem('amu_pulse_user_session', JSON.stringify(data));
            } else {
              // Create default profile upon first Google sign in
              const initialProfile: UserProfile = {
                uid: currentUser.uid,
                name: currentUser.displayName || 'AMU Student',
                email: currentUser.email || '',
                course: '',
                faculty: '',
                hall: '',
                studentId: '',
                avatarUrl: currentUser.photoURL || undefined,
                updatedAt: new Date().toISOString(),
              };
              try {
                await setDoc(userRef, initialProfile);
                setProfile(initialProfile);
                localStorage.setItem('amu_pulse_user_session', JSON.stringify(initialProfile));
              } catch (err) {
                console.error('Error creating initial user profile:', err);
                setProfile(initialProfile);
              }
            }
            setLoading(false);
          }, 
          (error) => {
            console.warn('Profile sync listener notice:', error?.message);
            const fallbackProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || 'AMU Student',
              email: currentUser.email || '',
              course: '',
              faculty: '',
              hall: '',
              studentId: '',
              avatarUrl: currentUser.photoURL || undefined,
              updatedAt: new Date().toISOString(),
            };
            setProfile((prev) => prev || fallbackProfile);
            setLoading(false);
          }
        );
      } else {
        // Unauthenticated - clear profile completely so no residual user session appears
        setProfile(null);
        localStorage.removeItem('amu_pulse_user_session');
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      // Force Google account selection prompt on every login attempt
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        setUser(res.user);
        const userRef = doc(db, 'users', res.user.uid);
        const userProf: UserProfile = {
          uid: res.user.uid,
          name: res.user.displayName || 'AMU Student',
          email: res.user.email || '',
          course: profile?.course || '',
          faculty: profile?.faculty || '',
          hall: profile?.hall || '',
          studentId: profile?.studentId || '',
          avatarUrl: res.user.photoURL || undefined,
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(userRef, userProf, { merge: true });
        } catch (e) {
          console.warn('Firestore write notice:', e);
        }
        setProfile(userProf);
        localStorage.setItem('amu_pulse_user_session', JSON.stringify(userProf));
      }
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.warn('Google Sign-In notice:', error?.code, error?.message);
      
      // If user closed the popup, don't show an error
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return;
      }

      // If popup blocked or unauthorized domain
      if (error?.code === 'auth/popup-blocked') {
        setAuthError('Google Sign-In popup was blocked by your browser. Please allow popups for this site and try again.');
        return;
      }

      setAuthError('Unable to complete Google Sign-In. Please click Sign In with Google again to choose your account.');
    }
  };

  const signOutUser = async () => {
    try {
      localStorage.removeItem('amu_pulse_user_session');
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile && !user) return;

    const baseProfile: UserProfile = profile || {
      uid: user?.uid || 'user-' + Date.now().toString(36),
      name: user?.displayName || 'AMU Student',
      email: user?.email || '',
      course: '',
      faculty: '',
      hall: '',
      studentId: '',
      avatarUrl: user?.photoURL || undefined,
    };

    const updated = {
      ...baseProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setProfile(updated);
    try {
      localStorage.setItem('amu_pulse_user_session', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, updated, { merge: true });
      } catch (err) {
        console.error('Error updating user profile in Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        signInWithGoogle,
        signOutUser,
        updateProfile,
        isAuthModalOpen,
        openAuthModal: () => {
          setAuthError(null);
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false),
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
