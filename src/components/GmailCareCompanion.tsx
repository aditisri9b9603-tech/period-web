import React, { useState, useEffect } from 'react';
import {
  signInWithGoogle,
  getGmailAccessToken,
  setGmailAccessToken,
  logoutUser,
  auth,
} from '../firebase/config';
import { sendGmailEmail, listRecentGmailMessages, GmailMessageHeader } from '../services/gmail';
import { CycleStatus } from '../types/cycle';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Inbox,
  LogOut,
  Sparkles,
  Lock,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';

interface GmailCareCompanionProps {
  cycleStatus?: CycleStatus;
}

export const GmailCareCompanion: React.FC<GmailCareCompanionProps> = ({ cycleStatus }) => {
  const [user, setUser] = useState<any>(auth.currentUser);
  const [token, setToken] = useState<string | null>(getGmailAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [recentMessages, setRecentMessages] = useState<GmailMessageHeader[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  // Email composer state
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState(
    `Sakhi Wellness & Cycle Report 🌸 (Day ${cycleStatus?.currentDay || 1})`
  );
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Confirmation modal state (MANDATORY for mutating Workspace actions)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setToken(getGmailAccessToken());
      if (u?.email) {
        setRecipientEmail(u.email);
      }
    });
    return () => unsub();
  }, []);

  // Pre-fill body based on current cycle context
  useEffect(() => {
    const phaseName = cycleStatus?.phase || 'menstrual';
    const day = cycleStatus?.currentDay || 1;
    const daysToPeriod = cycleStatus?.daysUntilNextPeriod || 28;

    const defaultContent = `Dear Doctor / Sakhi Care Companion,

Here is my recent menstrual and hormonal wellness summary exported from Sakhi Cycle:

🌸 Current Cycle Day: Day ${day}
🌸 Phase: ${phaseName.toUpperCase()}
🌸 Next Estimated Period: In ${daysToPeriod} days

Recent Self-Care Observations:
- Mood & Energy: Resting, hydrating, tracking symptoms
- Notes: Staying mindful of my body and cycle rhythms

Warmly,
${user?.displayName || 'Sakhi Cycle User'} 💗`;

    setEmailBody(defaultContent);
  }, [cycleStatus, user]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setMessageError(null);
    try {
      const res = await signInWithGoogle();
      setUser(res.user);
      setToken(res.accessToken);
      if (res.user.email) {
        setRecipientEmail(res.user.email);
      }
      if (res.accessToken) {
        loadMessages();
      }
    } catch (err: any) {
      console.error(err);
      setMessageError(err.message || 'Failed to connect Google account.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
    setRecentMessages([]);
  };

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    setMessageError(null);
    try {
      const msgs = await listRecentGmailMessages();
      setRecentMessages(msgs);
    } catch (err: any) {
      console.warn(err);
      setMessageError(err.message || 'Could not fetch recent emails.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleOpenSendConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !emailBody) {
      setSendError('Please fill in recipient email and message content.');
      return;
    }
    setSendError(null);
    setIsConfirmModalOpen(true);
  };

  const handleExecuteSend = async () => {
    setIsConfirmModalOpen(false);
    setIsSending(true);
    setSendSuccess(null);
    setSendError(null);

    try {
      await sendGmailEmail({
        to: recipientEmail.trim(),
        userEmail: user?.email || recipientEmail.trim(),
        subject: emailSubject,
        body: emailBody,
      });

      setSendSuccess(`Email successfully sent to ${recipientEmail}! 🌸`);
      setTimeout(() => setSendSuccess(null), 5000);
    } catch (err: any) {
      console.error('Send email error:', err);
      setSendError(err.message || 'Failed to send email via Gmail.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F3] via-[#FFF9FA] to-[#FCEEE9] border border-pink-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-rose-800 text-xs font-bold border border-pink-200">
            <span>💌 Gmail Health Companion</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1E29] tracking-tight">
            Share Cycle Reports & Doctor Consultations with Gmail 🌸
          </h2>
          <p className="text-xs sm:text-sm text-[#7A4B55]">
            Securely send personalized cycle summaries to your own inbox or to your gynecologist, and review health appointment confirmations in one place.
          </p>
        </div>

        {/* Auth / Account Status */}
        <div className="flex-shrink-0 text-center">
          {user ? (
            <div className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-2xl p-4 text-center shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white font-bold flex items-center justify-center mx-auto text-sm">
                {user.displayName?.charAt(0) || 'G'}
              </div>
              <div>
                <span className="font-bold text-xs text-[#4A1E29] block">
                  {user.displayName || 'Google Account'}
                </span>
                <span className="text-[11px] text-gray-500 block truncate max-w-[180px]">
                  {user.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="px-5 py-3 rounded-full bg-white border border-gray-300 text-gray-800 font-bold text-xs shadow-xs hover:bg-gray-50 transition-all flex items-center gap-2.5 mx-auto"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Connect Gmail Account'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Send Cycle Report & Quick Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Email Composer */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md border border-[#F4DFE2] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-rose-600" />
              <h3 className="font-serif text-lg font-bold text-[#4A1E29]">
                Send Cycle Health Report
              </h3>
            </div>
            <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
              Direct via Gmail
            </span>
          </div>

          {sendSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sendSuccess}</span>
            </div>
          )}

          {sendError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-900 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sendError}</span>
            </div>
          )}

          <form onSubmit={handleOpenSendConfirmation} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#7A4B55] block mb-1">
                Recipient Email (Self or Doctor):
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="e.g. your_email@gmail.com or doctor@clinic.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-300 font-sans text-xs text-[#4A1E29]"
              />
            </div>

            <div>
              <label className="font-bold text-[#7A4B55] block mb-1">
                Email Subject:
              </label>
              <input
                type="text"
                required
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-300 font-sans text-xs text-[#4A1E29]"
              />
            </div>

            <div>
              <label className="font-bold text-[#7A4B55] block mb-1">
                Cycle & Health Summary:
              </label>
              <textarea
                rows={8}
                required
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-300 font-mono text-xs text-[#4A1E29] leading-relaxed resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Protected by Google Workspace OAuth</span>
              </div>

              <button
                type="submit"
                disabled={isSending || !user}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'Review & Send with Gmail'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Quick Inbox / Appointments View */}
        <div className="bg-white/90 backdrop-blur-md border border-[#F4DFE2] rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-purple-600" />
                <h3 className="font-serif text-base font-bold text-[#4A1E29]">
                  Health Inbox
                </h3>
              </div>
              {user && (
                <button
                  type="button"
                  onClick={loadMessages}
                  disabled={isLoadingMessages}
                  className="p-1 rounded-full text-pink-600 hover:bg-pink-50 transition-colors"
                  title="Refresh emails"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {messageError && (
              <div className="p-2.5 bg-pink-50 rounded-xl text-[11px] text-rose-800">
                {messageError}
              </div>
            )}

            {!user ? (
              <div className="text-center py-8 space-y-2">
                <span className="text-2xl">🔒</span>
                <p className="text-xs text-[#7A4B55]">
                  Sign in with Google above to view recent clinic and cycle notification emails.
                </p>
              </div>
            ) : isLoadingMessages ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#7A4B55]">Checking Gmail messages...</p>
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <span className="text-2xl">💌</span>
                <p className="text-xs text-[#7A4B55]">
                  No recent health emails found or inbox is clear!
                </p>
                <button
                  type="button"
                  onClick={loadMessages}
                  className="text-xs font-bold text-pink-700 hover:underline"
                >
                  Load Messages
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {recentMessages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-pink-50/50 hover:bg-pink-50 rounded-2xl border border-pink-100 text-xs space-y-1 transition-colors"
                  >
                    <div className="font-bold text-[#4A1E29] line-clamp-1">
                      {m.subject}
                    </div>
                    <div className="text-[10px] text-gray-500 flex justify-between">
                      <span className="truncate max-w-[120px]">{m.from}</span>
                      <span>{m.date ? new Date(m.date).toLocaleDateString() : ''}</span>
                    </div>
                    {m.snippet && (
                      <p className="text-[11px] text-[#7A4B55] line-clamp-2 leading-relaxed">
                        {m.snippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="pt-3 border-t border-pink-50 text-[10px] text-[#8A5A66] flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-pink-400 flex-shrink-0" />
            <span>Zero server storage: all Gmail calls happen directly in your browser session.</span>
          </div>
        </div>
      </div>

      {/* MANDATORY Explicit Confirmation Dialog for Sending Email */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md border border-pink-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-serif text-lg font-bold text-[#4A1E29]">
                Confirm Sending Email via Gmail
              </h3>
            </div>

            <p className="text-xs text-[#7A4B55] leading-relaxed">
              Are you sure you want to send this cycle wellness email to{' '}
              <strong className="text-[#4A1E29]">{recipientEmail}</strong> with subject "{emailSubject}"?
            </p>

            <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-xl text-[11px] text-[#7A4B55] max-h-32 overflow-y-auto font-mono">
              {emailBody}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteSend}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Yes, Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
