import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, CycleSettings } from '../types/cycle';

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Enforce local session persistence so user remains logged in across browser refreshes and tabs
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Sakhi Firebase] Could not set local persistence:', err);
});

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Google Provider configured for sign-in
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign Up with Email and Password in Firebase Auth
 */
export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
  initialCycleSettings?: CycleSettings
): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const fbUser = userCredential.user;

  // Set display name in Firebase Auth profile
  if (name.trim()) {
    await updateProfile(fbUser, { displayName: name.trim() });
  }

  const defaultCycleSettings: CycleSettings = initialCycleSettings || {
    lastPeriodDate: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    periodDuration: 5,
  };

  const userProfile: UserProfile = {
    id: fbUser.uid,
    name: name.trim() || fbUser.email?.split('@')[0] || 'Sakhi Friend',
    email: fbUser.email || email.trim(),
    isGuest: false,
    cycleSettings: defaultCycleSettings,
  };

  // Persist profile to Firestore user document
  try {
    const userRef = doc(db, 'users', fbUser.uid);
    await setDoc(
      userRef,
      {
        id: fbUser.uid,
        name: userProfile.name,
        email: userProfile.email,
        cycleSettings: userProfile.cycleSettings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (fsErr) {
    console.warn('[Sakhi Firebase] Could not persist profile to Firestore (using local state):', fsErr);
  }

  return userProfile;
}

/**
 * Sign In with Email and Password
 */
export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const fbUser = userCredential.user;

  // Attempt to fetch profile details from Firestore
  let cycleSettings: CycleSettings = {
    lastPeriodDate: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    periodDuration: 5,
  };

  try {
    const userRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.cycleSettings) {
        cycleSettings = data.cycleSettings;
      }
    }
  } catch (fsErr) {
    console.warn('[Sakhi Firebase] Could not read profile from Firestore:', fsErr);
  }

  const userProfile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Sakhi Friend',
    email: fbUser.email || email.trim(),
    isGuest: false,
    cycleSettings,
  };

  return userProfile;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  let cycleSettings: CycleSettings = {
    lastPeriodDate: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    periodDuration: 5,
  };

  try {
    const userRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data().cycleSettings) {
      cycleSettings = snap.data().cycleSettings;
    } else {
      await setDoc(
        userRef,
        {
          id: fbUser.uid,
          name: fbUser.displayName || 'Sakhi Friend',
          email: fbUser.email || '',
          cycleSettings,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (fsErr) {
    console.warn('[Sakhi Firebase] Firestore user doc error during Google sign-in:', fsErr);
  }

  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Sakhi Friend',
    email: fbUser.email || '',
    isGuest: false,
    cycleSettings,
  };
}

/**
 * Log out from Firebase Auth
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Send Password Reset Email
 */
export async function resetPasswordForEmail(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export { onAuthStateChanged, type User };
