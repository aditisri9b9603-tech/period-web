import { useState, useEffect, useCallback } from 'react';
import {
  auth,
  onAuthStateChanged,
  User,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logoutUser,
  resetPasswordForEmail,
  db,
} from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, CycleSettings } from '../types/cycle';

const STORAGE_USER_PROFILE = 'sakhi_user_profile_v1';
const STORAGE_CYCLE_SETTINGS = 'sakhi_cycle_settings_v1';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize profile from local storage or guest
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: 'usr_guest',
      name: 'Aditi',
      email: 'aditiclearwitssih@gmail.com',
      isGuest: false,
      cycleSettings: {
        lastPeriodDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        cycleLength: 28,
        periodDuration: 5,
      },
    };
  });

  const setUserProfile = useCallback((profile: UserProfile) => {
    setUserProfileState(profile);
    try {
      localStorage.setItem(STORAGE_USER_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, []);

  // Monitor Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // User is logged in via Firebase
        let currentSettings: CycleSettings = {
          lastPeriodDate: new Date().toISOString().split('T')[0],
          cycleLength: 28,
          periodDuration: 5,
        };

        // Try getting cycle settings from localStorage first
        try {
          const savedCycle = localStorage.getItem(STORAGE_CYCLE_SETTINGS);
          if (savedCycle) {
            currentSettings = JSON.parse(savedCycle);
          }
        } catch {
          // ignore
        }

        // Try fetching user document from Firestore to sync cycle data
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.cycleSettings) {
              currentSettings = data.cycleSettings;
            }
          }
        } catch (fsErr) {
          console.warn('[useAuth] Could not read user document from Firestore:', fsErr);
        }

        const profile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Sakhi Friend',
          email: firebaseUser.email || '',
          isGuest: false,
          cycleSettings: currentSettings,
        };

        setUserProfile(profile);
      } else {
        // No Firebase user session
        setUserProfileState((prev) => {
          // If previous user was logged in with an ID other than guest, reset to guest
          if (!prev.isGuest && prev.id !== 'usr_guest') {
            const guestProfile: UserProfile = {
              id: `guest_${Date.now()}`,
              name: 'Sakhi Guest',
              email: '',
              isGuest: true,
              cycleSettings: prev.cycleSettings,
            };
            try {
              localStorage.setItem(STORAGE_USER_PROFILE, JSON.stringify(guestProfile));
            } catch {
              // ignore
            }
            return guestProfile;
          }
          return prev;
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUserProfile]);

  // Auth actions
  const signup = useCallback(
    async (name: string, email: string, password: string, settings?: CycleSettings) => {
      const profile = await signUpWithEmail(name, email, password, settings);
      setUserProfile(profile);
      return profile;
    },
    [setUserProfile]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const profile = await signInWithEmail(email, password);
      setUserProfile(profile);
      return profile;
    },
    [setUserProfile]
  );

  const googleSignIn = useCallback(async () => {
    const profile = await signInWithGoogle();
    setUserProfile(profile);
    return profile;
  }, [setUserProfile]);

  const logout = useCallback(async () => {
    await logoutUser();
    const guestProfile: UserProfile = {
      id: `guest_${Date.now()}`,
      name: 'Sakhi Guest',
      email: '',
      isGuest: true,
      cycleSettings: {
        lastPeriodDate: new Date().toISOString().split('T')[0],
        cycleLength: 28,
        periodDuration: 5,
      },
    };
    setUserProfile(guestProfile);
  }, [setUserProfile]);

  const resetPassword = useCallback(async (email: string) => {
    await resetPasswordForEmail(email);
  }, []);

  const isAuthenticated = !userProfile.isGuest && Boolean(user || userProfile.id);

  return {
    user,
    userProfile,
    setUserProfile,
    loading,
    isAuthenticated,
    login,
    signup,
    googleSignIn,
    logout,
    resetPassword,
  };
}
