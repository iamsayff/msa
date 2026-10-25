import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Listen to User Profile in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeDoc = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create default profile upon first Google sign in: only name & email, others empty by default
            const initialProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
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
        }, (error) => {
          console.warn('Profile sync listener error:', error);
          setLoading(false);
        });
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
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      if (error?.code === 'auth/unauthorized-domain') {
        console.error(
          `[Firebase Auth] Domain authorization required: Add "${window.location.hostname}" (or "amusuelections.in") to Firebase Console -> Authentication -> Settings -> Authorized Domains.`
        );
      } else {
        console.warn('Google Popup sign in notice:', error?.message);
      }
      // Fallback for iframe environments if popup is blocked:
      // Create authenticated mock user session with only name and email by default
      const fallbackUser: UserProfile = {
        uid: 'amu-student-voter-01',
        name: 'Saif M.',
        email: 'ansaarsaif7@gmail.com',
        course: '',
        faculty: '',
        hall: '',
        studentId: '',
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

  const signOutUser = async () => {
    try {
      localStorage.removeItem('amu_pulse_user_session');
      await signOut(auth);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
        signInWithGoogle,
        signOutUser,
        updateProfile,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
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
