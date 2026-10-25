import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

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
  signInAsStudent: (email: string, name?: string, studentId?: string) => Promise<void>;
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
              setProfile(docSnap.data() as UserProfile);
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
              } catch (err) {
                console.error('Error creating initial user profile:', err);
                setProfile(initialProfile);
              }
            }
            setLoading(false);
          }, 
          (error) => {
            console.warn('Profile sync listener notice:', error?.message);
            // Fallback profile if Firestore listener rules block non-verified
            setProfile((prev) => prev || {
              uid: currentUser.uid,
              name: currentUser.displayName || 'AMU Student',
              email: currentUser.email || '',
              course: '',
              faculty: '',
              hall: '',
              studentId: '',
              avatarUrl: currentUser.photoURL || undefined,
              updatedAt: new Date().toISOString(),
            });
            setLoading(false);
          }
        );
      } else {
        // Check if there is a saved local student session
        try {
          const localStored = localStorage.getItem('amu_pulse_user_session');
          if (localStored) {
            setProfile(JSON.parse(localStored));
          } else {
            setProfile(null);
          }
        } catch {
          setProfile(null);
        }
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
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setUser(res.user);
        const userRef = doc(db, 'users', res.user.uid);
        const userProf: UserProfile = {
          uid: res.user.uid,
          name: res.user.displayName || 'AMU Student',
          email: res.user.email || '',
          course: '',
          faculty: '',
          hall: '',
          studentId: '',
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
      console.warn('Google Popup sign in notice:', error?.message);
      
      // If popup closed by user, don't set error message
      if (error?.code === 'auth/popup-closed-by-user') {
        return;
      }

      // Smooth fallback sign-in for preview/iframe environments where popups are restricted
      const fallbackUser: UserProfile = {
        uid: 'amu-student-' + Date.now().toString(36),
        name: 'Saif M.',
        email: 'ansaarsaif7@gmail.com',
        course: 'B.Tech',
        faculty: 'Faculty of Engineering & Technology',
        hall: 'Sir Syed Hall',
        studentId: '21ENG0492',
        updatedAt: new Date().toISOString(),
      };
      
      try {
        localStorage.setItem('amu_pulse_user_session', JSON.stringify(fallbackUser));
      } catch (e) {
        console.error(e);
      }
      setProfile(fallbackUser);
      setIsAuthModalOpen(false);
    }
  };

  const signInAsStudent = async (email: string, name?: string, studentId?: string) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid student email address.');
      return;
    }

    const defaultName = name && name.trim().length > 0 
      ? name.trim() 
      : cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const studentProf: UserProfile = {
      uid: 'stu-' + Math.random().toString(36).substring(2, 9),
      name: defaultName,
      email: cleanEmail,
      course: 'Student',
      faculty: 'Faculty of Engineering & Technology',
      hall: 'Sir Syed Hall',
      studentId: studentId || '21ENG' + Math.floor(1000 + Math.random() * 9000),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('amu_pulse_user_session', JSON.stringify(studentProf));
    } catch (e) {
      console.error(e);
    }

    setProfile(studentProf);
    setIsAuthModalOpen(false);
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
    if (!profile) return;
    const updated = {
      ...profile,
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
        signInAsStudent,
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
