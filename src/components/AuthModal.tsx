import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { UserProfile, CycleSettings } from '../types/cycle';
import { BrandLogo } from './BrandLogo';
import {
  auth,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logoutUser,
  resetPasswordForEmail,
} from '../lib/firebase';
import {
  X,
  Mail,
  Lock,
  User,
  CheckCircle2,
  Sparkles,
  Heart,
  Eye,
  EyeOff,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Calendar,
  KeyRound,
  RefreshCw,
  Compass,
} from 'lucide-react';

export type AuthViewMode =
  | 'welcome'
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'resetPassword'
  | 'onboarding'
  | 'profile'
  | 'logoutConfirm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  initialMode?: AuthViewMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  initialMode = 'login',
}) => {
  const { t, language } = useTranslation();

  const [mode, setMode] = useState<AuthViewMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  // Onboarding survey fields
  const [onboardingCycleLength, setOnboardingCycleLength] = useState(28);
  const [onboardingPeriodDuration, setOnboardingPeriodDuration] = useState(5);
  const [primaryGoal, setPrimaryGoal] = useState<'comfort' | 'tracking' | 'fertility' | 'hormones'>('comfort');

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
    setResetCode('');
  };

  const switchMode = (newMode: AuthViewMode) => {
    resetFormState();
    setMode(newMode);
  };

  // Continue as Guest
  const handleContinueAsGuest = () => {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      name: language === 'hi' ? 'सखी मेहमान' : 'Sakhi Guest',
      email: 'guest@sakhicycle.com',
      isGuest: true,
      cycleSettings: currentUser.cycleSettings || {
        lastPeriodDate: new Date().toISOString().split('T')[0],
        cycleLength: 28,
        periodDuration: 5,
      },
    };
    onUserChange(guestUser);
    onClose();
  };

  // Google Sign-In
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profile = await signInWithGoogle();
      onUserChange(profile);
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(
          err?.message || (language === 'hi' ? 'Google साइन-इन विफल रहा।' : 'Google Sign-in could not be completed.')
        );
      }
      setIsLoading(false);
    }
  };

  // 1. Submit Sign Up with Firebase + Backend Sync
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(language === 'hi' ? 'कृपया एक वैध ईमेल दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      let createdUser: UserProfile | null = null;

      // 1. Firebase Auth Registration
      try {
        createdUser = await signUpWithEmail(name, email, password, currentUser.cycleSettings);
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] signUpWithEmail note:', fbErr?.code || fbErr?.message);
        if (fbErr?.code === 'auth/email-already-in-use') {
          setErrorMessage(
            language === 'hi'
              ? 'इस ईमेल के साथ पहले से अकाउंट मौजूद है। कृपया साइन इन करें।'
              : 'An account with this email already exists. Please sign in.'
          );
          setIsLoading(false);
          return;
        }
      }

      // 2. Server mirror for demo credentials & token
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            cycleSettings: currentUser.cycleSettings,
          }),
        });

        const data = await res.json();
        if (data.token) {
          if (rememberMe) {
            localStorage.setItem('sakhi_auth_token', data.token);
          } else {
            sessionStorage.setItem('sakhi_auth_token', data.token);
          }
        }
        if (!createdUser && data.user) {
          createdUser = data.user;
        }
      } catch (srvErr) {
        console.warn('[API Auth] signup mirror error:', srvErr);
      }

      if (!createdUser) {
        createdUser = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          isGuest: false,
          cycleSettings: currentUser.cycleSettings || {
            lastPeriodDate: new Date().toISOString().split('T')[0],
            cycleLength: 28,
            periodDuration: 5,
          },
        };
      }

      onUserChange(createdUser);
      setIsLoading(false);
      setMode('onboarding');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || (language === 'hi' ? 'पंजीकरण में त्रुटि हुई।' : 'Network error during registration.'));
      setIsLoading(false);
    }
  };

  // 2. Submit Log In with Firebase + Backend Sync
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना ईमेल दर्ज करें।' : 'Please enter your email.');
      return;
    }
    if (!password) {
      setErrorMessage(language === 'hi' ? 'कृपया पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      let loggedInUser: UserProfile | null = null;
      let firebaseSucceeded = false;

      // Try Firebase Auth Sign In
      try {
        loggedInUser = await signInWithEmail(email, password);
        firebaseSucceeded = true;
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] signInWithEmail note:', fbErr?.code || fbErr?.message);
      }

      // Try server mirror / demo user
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        const data = await res.json();
        if (res.ok && data.user) {
          if (rememberMe) {
            localStorage.setItem('sakhi_auth_token', data.token);
          } else {
            sessionStorage.setItem('sakhi_auth_token', data.token);
          }
          if (!loggedInUser) {
            loggedInUser = data.user;
          }
        } else if (!firebaseSucceeded) {
          setErrorMessage(
            data.error ||
              (language === 'hi' ? 'ईमेल या पासवर्ड गलत है।' : 'Invalid email or password.')
          );
          setIsLoading(false);
          return;
        }
      } catch (srvErr) {
        if (!firebaseSucceeded) {
          setErrorMessage(language === 'hi' ? 'साइन इन करने में समस्या आई।' : 'Network error while signing in.');
          setIsLoading(false);
          return;
        }
      }

      if (loggedInUser) {
        onUserChange(loggedInUser);
        setIsLoading(false);
        onClose();
      } else {
        setErrorMessage(
          language === 'hi' ? 'कृपया ईमेल और पासवर्ड जांचें।' : 'Invalid credentials. Please verify and try again.'
        );
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Login service encountered an issue.');
      setIsLoading(false);
    }
  };

  // 3. Submit Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना ईमेल दर्ज करें।' : 'Please enter your email.');
      return;
    }

    setIsLoading(true);
    try {
      try {
        await resetPasswordForEmail(email.trim());
      } catch (fbErr) {
        console.warn('[Firebase Auth] reset password email note:', fbErr);
      }

      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (data.demoCode) {
        setDemoCodeHint(data.demoCode);
      }
      setSuccessMessage(
        data.message ||
          (language === 'hi' ? 'पासवर्ड रीसेट वेरिफिकेशन कोड भेजा गया है।' : 'Verification instructions sent.')
      );
      setMode('resetPassword');
    } catch (err) {
      console.error(err);
      setErrorMessage(language === 'hi' ? 'रीसेट कोड नहीं भेजा जा सका।' : 'Could not send reset code.');
      setIsLoading(false);
    }
  };

  // 4. Submit Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resetCode.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया वेरिफिकेशन कोड दर्ज करें।' : 'Please enter verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage(language === 'hi' ? 'नया पासवर्ड 6 अक्षरों से अधिक होना चाहिए।' : 'New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          resetCode: resetCode.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to reset password.');
        return;
      }

      setSuccessMessage(
        data.message ||
          (language === 'hi' ? 'पासवर्ड सफलतापूर्वक बदल दिया गया!' : 'Password reset successfully!')
      );
      setTimeout(() => {
        setMode('login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not update password.');
      setIsLoading(false);
    }
  };

  // 5. Complete Onboarding
  const handleCompleteOnboarding = () => {
    const updatedSettings: CycleSettings = {
      lastPeriodDate: currentUser.cycleSettings?.lastPeriodDate || new Date().toISOString().split('T')[0],
      cycleLength: onboardingCycleLength,
      periodDuration: onboardingPeriodDuration,
    };

    onUserChange({
      ...currentUser,
      cycleSettings: updatedSettings,
    });
    onClose();
  };

  // 6. Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (fbErr) {
      console.warn('[Firebase Auth] logout note:', fbErr);
    }
    try {
      const token = localStorage.getItem('sakhi_auth_token') || sessionStorage.getItem('sakhi_auth_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    }
    localStorage.removeItem('sakhi_auth_token');
    sessionStorage.removeItem('sakhi_auth_token');

    handleContinueAsGuest();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-2xl border border-pink-200 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Soft floating background auras */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-pink-200/50 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-purple-200/40 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-pink-50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1">
          <BrandLogo size="md" className="justify-center" />
        </div>

        {/* Error / Success Toast alerts */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* =========================================
            VIEW 1: WELCOME SCREEN
        ========================================= */}
        {mode === 'welcome' && (
          <div className="space-y-6 text-center animate-in fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200">
                🌸 Safe Sanctuary
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
                {language === 'hi' ? 'सखी साइकिल में आपका स्वागत है' : 'Welcome to Sakhi Cycle'}
              </h3>
              <p className="text-xs sm:text-sm text-[#7A4B55] leading-relaxed">
                {language === 'hi'
                  ? 'अपने पीरियड को ट्रैक करें, हार्मोन्स को समझें और सखी AI से प्यार भरी बातें करें।'
                  : 'Track your sacred rhythm, balance your hormonal health, and confide in your caring voice bestie.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-3 rounded-full text-xs sm:text-sm font-bold bg-white text-[#4A1E29] border border-pink-200 hover:bg-pink-50/70 shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{language === 'hi' ? 'Google के साथ जारी रखें' : 'Continue with Google'}</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-rose-200 transition-all active:scale-98"
              >
                {language === 'hi' ? 'साइन इन करें' : 'Sign In with Email'}
              </button>

              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="w-full py-3 rounded-full text-sm font-bold bg-white text-rose-800 border border-pink-200 hover:bg-pink-50 shadow-2xs transition-all active:scale-98"
              >
                {language === 'hi' ? 'नया अकाउंट बनाएं' : 'Create Free Account'}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-xs font-semibold text-[#8A5A66] hover:text-[#5C2E38] underline decoration-pink-300 underline-offset-4 flex items-center justify-center gap-1 mx-auto"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'मेहमान के रूप में जारी रखें' : 'Continue as Guest'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            VIEW 2: LOGIN SCREEN
        ========================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
                {language === 'hi' ? 'सखी साइन इन' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-[#7A4B55]">
                {language === 'hi' ? 'अपने सुरक्षित अकाउंट में प्रवेश करें' : 'Log in to your private cycle sanctuary'}
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#5C2E38]">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgotPassword')}
                  className="text-[11px] font-semibold text-rose-700 hover:underline"
                >
                  {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-[#5C2E38]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-400"
                />
                <span>{language === 'hi' ? 'मुझे याद रखें' : 'Remember me'}</span>
              </label>

              <span className="text-[10px] text-[#A66F7B]">
                Demo: aditiclearwitssih@gmail.com
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md shadow-rose-200 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'hi' ? 'सत्यापित कर रहे हैं...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{language === 'hi' ? 'साइन इन करें' : 'Sign In with Email'}</span>
              )}
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-pink-100 w-full" />
              <span className="bg-[#FFFDFB] px-3 text-[11px] font-semibold text-[#A66F7B]">
                {language === 'hi' ? 'या फिर' : 'OR'}
              </span>
              <div className="border-t border-pink-100 w-full" />
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 rounded-full text-xs font-bold bg-white text-[#4A1E29] border border-pink-200 hover:bg-pink-50/70 shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{language === 'hi' ? 'Google के साथ साइन इन' : 'Continue with Google'}</span>
            </button>

            {/* Switch to Sign Up */}
            <div className="text-center pt-2 space-y-2 border-t border-pink-100">
              <p className="text-xs text-[#7A4B55]">
                {language === 'hi' ? 'क्या आपका अकाउंट नहीं है?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-rose-700 hover:underline"
                >
                  {language === 'hi' ? 'साइन अप करें' : 'Sign Up'}
                </button>
              </p>

              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-xs font-semibold text-[#8A5A66] hover:text-[#5C2E38] block mx-auto hover:underline"
              >
                {language === 'hi' ? 'मेहमान के रूप में जारी रखें' : 'Continue as Guest'}
              </button>
            </div>
          </form>
        )}

        {/* =========================================
            VIEW 3: SIGN UP SCREEN
        ========================================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
                {language === 'hi' ? 'नया अकाउंट बनाएं' : 'Join Sakhi Cycle'}
              </h3>
              <p className="text-xs text-[#7A4B55]">
                {language === 'hi' ? 'सहेलियों का अपना सुरक्षित स्वास्थ्य चक्र' : 'Begin your personalized wellness journey'}
              </p>
            </div>

            {/* Name/Nickname */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'नाम या उपनाम' : 'Your Name / Nickname'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aditi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'ईमेल' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'पासवर्ड (कम से कम 6 अक्षर)' : 'Password (min 6 characters)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Submit Sign Up */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-md shadow-rose-200 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'hi' ? 'अकाउंट तैयार हो रहा है...' : 'Creating Sanctuary...'}</span>
                </>
              ) : (
                <span>{language === 'hi' ? 'साइन अप करें' : 'Create My Account'}</span>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-2 space-y-2 border-t border-pink-100">
              <p className="text-xs text-[#7A4B55]">
                {language === 'hi' ? 'पहले से अकाउंट है?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-rose-700 hover:underline"
                >
                  {language === 'hi' ? 'साइन इन करें' : 'Log In'}
                </button>
              </p>

              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-xs font-semibold text-[#8A5A66] hover:text-[#5C2E38] block mx-auto hover:underline"
              >
                {language === 'hi' ? 'मेहमान के रूप में जारी रखें' : 'Continue as Guest'}
              </button>
            </div>
          </form>
        )}

        {/* =========================================
            VIEW 4: FORGOT PASSWORD
        ========================================= */}
        {mode === 'forgotPassword' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
                {language === 'hi' ? 'पासवर्ड रीसेट करें' : 'Forgot Password?'}
              </h3>
              <p className="text-xs text-[#7A4B55]">
                {language === 'hi'
                  ? 'अपना ईमेल दर्ज करें, हम वेरिफिकेशन कोड भेजेंगे।'
                  : 'Enter your email to receive a password reset code.'}
              </p>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'ईमेल पता' : 'Registered Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-rose-200 transition-all active:scale-98"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-xs font-semibold text-rose-700 block mx-auto hover:underline"
            >
              ← Back to Login
            </button>
          </form>
        )}

        {/* =========================================
            VIEW 5: RESET PASSWORD
        ========================================= */}
        {mode === 'resetPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
                {language === 'hi' ? 'नया पासवर्ड बनाएं' : 'Reset Your Password'}
              </h3>
              <p className="text-xs text-[#7A4B55]">
                {language === 'hi' ? 'वेरिफिकेशन कोड और नया पासवर्ड दर्ज करें' : 'Enter the code and set your fresh password'}
              </p>
            </div>

            {demoCodeHint && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span>Demo Code: </span>
                <strong className="font-mono font-bold text-amber-950">{demoCodeHint}</strong>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'वेरिफिकेशन कोड' : 'Verification Code'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 123456 or SAKHI-2026"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#5C2E38] block">
                {language === 'hi' ? 'नया पासवर्ड' : 'New Password (min 6 chars)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-rose-200 transition-all active:scale-98"
            >
              {isLoading ? 'Updating...' : 'Set New Password'}
            </button>

            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-xs font-semibold text-rose-700 block mx-auto hover:underline"
            >
              ← Back to Login
            </button>
          </form>
        )}

        {/* =========================================
            VIEW 6: POST-SIGNUP CUTE ONBOARDING
        ========================================= */}
        {mode === 'onboarding' && (
          <div className="space-y-5 animate-in fade-in text-center">
            <div className="space-y-2">
              <div className="text-3xl animate-bounce">🌸</div>
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
                Welcome to Sakhi 🌸
              </h3>
              <p className="text-xs text-[#7A4B55] max-w-xs mx-auto">
                Let's calibrate your personalized wellness dashboard in 30 seconds!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-pink-200 space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-[#4A1E29] flex items-center justify-between">
                  <span>Average Cycle Length:</span>
                  <span className="font-bold text-rose-700">{onboardingCycleLength} days</span>
                </label>
                <input
                  type="range"
                  min="21"
                  max="45"
                  value={onboardingCycleLength}
                  onChange={(e) => setOnboardingCycleLength(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500 mt-2"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A1E29] flex items-center justify-between">
                  <span>Period Bleeding Duration:</span>
                  <span className="font-bold text-rose-700">{onboardingPeriodDuration} days</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={onboardingPeriodDuration}
                  onChange={(e) => setOnboardingPeriodDuration(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500 mt-2"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A1E29] block mb-1.5">
                  Primary Focus:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'comfort', label: '🌸 Cramp Relief', desc: 'Teas & massage' },
                    { id: 'tracking', label: '📅 Easy Tracking', desc: 'Predict periods' },
                    { id: 'fertility', label: '🌷 Fertility Horizon', desc: 'Ovulation peak' },
                    { id: 'hormones', label: '🧘‍♀️ PCOS Harmony', desc: 'Diet & mood' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setPrimaryGoal(g.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        primaryGoal === g.id
                          ? 'bg-rose-50 border-rose-400 font-bold text-rose-900 shadow-2xs'
                          : 'bg-white border-pink-100 text-[#5C2E38] hover:bg-pink-50/50'
                      }`}
                    >
                      <div className="font-semibold">{g.label}</div>
                      <div className="text-[10px] text-[#8A5A66]">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteOnboarding}
              className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <span>Enter My Sanctuary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================
            VIEW 7: LOGOUT CONFIRMATION
        ========================================= */}
        {mode === 'logoutConfirm' && (
          <div className="space-y-5 text-center animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#4A1E29]">
                Sign Out of Sakhi?
              </h3>
              <p className="text-xs text-[#7A4B55]">
                Your cycle logs and private health records remain safely protected.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 rounded-full text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all"
              >
                Sign Out
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-full text-xs font-semibold text-[#7A4B55] hover:bg-pink-50"
              >
                Cancel & Stay Signed In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
