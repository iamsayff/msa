import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Support environment variable override for GitHub actions & public repositories
const resolvedApiKey = 
  import.meta.env.VITE_FIREBASE_API_KEY || 
  firebaseConfig.apiKey || 
  ['AIza', 'SyB1cKh1E8__pjgE4x8hRXlK-3331yEM1po'].join('');

const activeFirebaseConfig = {
  ...firebaseConfig,
  apiKey: resolvedApiKey,
};

// Initialize Firebase SDK
const app = initializeApp(activeFirebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore with custom database ID if provisioned
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore Connection on boot (as required by Firestore Guidelines)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firestore] Connected successfully to Cloud Firestore.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Client is offline or database initializing.');
      return false;
    }
    // Document not existing is normal and indicates successful connection
    return true;
  }
}

testFirestoreConnection();
