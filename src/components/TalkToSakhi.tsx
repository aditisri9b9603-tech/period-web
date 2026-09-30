import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../i18n/context';
import { CycleStatus } from '../types/cycle';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  MessageCircle,
  RotateCcw,
  Square,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Languages,
} from 'lucide-react';

interface VoiceMessage {
  id: string;
  sender: 'user' | 'sakhi';
  text: string;
  time: string;
  isStreaming?: boolean;
}

interface TalkToSakhiProps {
  cycleStatus?: CycleStatus;
}

const STORAGE_SESSION_CONVO = 'sakhi_voice_convo_v4';

// Helper to clean speech text before feeding to SpeechSynthesis
const cleanTextForSpeaking = (raw: string): string => {
  return raw
    // Remove emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    // Remove markdown formatting
    .replace(/\*+/g, '')
    .replace(/#+/g, '')
    .replace(/_+/g, '')
    .replace(/`+/g, '')
    .replace(/~+/g, '')
    // Remove bullet points / dashes
    .replace(/^[\s-•*]+/gm, '')
    // Replace multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper to fix common Hinglish speech recognition phonetic misunderstandings
const normalizeHinglishTranscript = (input: string): string => {
  let text = input.trim();
  // Common misrecognitions: "DD" -> "Didi", "The day" -> "Didi"
  text = text.replace(/^(dd|the day|d d|di di)\b/i, 'Didi');
  // "cracks" / "clam" -> "cramps" if talking about periods
  text = text.replace(/\b(cracks|clamp|clamps)\b/gi, 'cramps');
  return text;
};

export const TalkToSakhi: React.FC<TalkToSakhiProps> = ({ cycleStatus }) => {
  const { t, language } = useTranslation();

  // Voice States: 'idle' | 'listening' | 'thinking' | 'speaking' | 'paused'
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'paused'>('idle');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  // Live real-time speech preview while user is actively talking
  const [interimSpeech, setInterimSpeech] = useState<string>('');

  // Speech Recognition Language Mode:
  // 'en-IN' = Best for Hinglish & Indian English conversational speech
  // 'hi-IN' = Best for pure Devanagari Hindi speech
  const [speechLanguageMode, setSpeechLanguageMode] = useState<'en-IN' | 'hi-IN'>(() => {
    return language === 'hi' ? 'hi-IN' : 'en-IN';
  });

  // Keep speech language mode synced if user changes global app language
  useEffect(() => {
    setSpeechLanguageMode(language === 'hi' ? 'hi-IN' : 'en-IN');
  }, [language]);

  // Available speech synthesis voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Initial welcome greeting from Sakhi Bestie
  const getInitialGreeting = useCallback(() => {
    if (language === 'hi') {
      return 'अरे मेरी प्यारी सखी! 🌸 आज मन कैसा है तुम्हारा? कोई बात सता रही है या सिर्फ गपशप करनी है? "Start Talking" पर टैप करो, मैं सब सुन रही हूँ 💗';
    }
    if (language === 'hinglish') {
      return 'Aww hello meri pyari Sakhi! 🌸 Aaj din kaisa tha? Kuch share karna hai ya vent karna hai? Just tap Start Talking, your Didi is right here for you 💗';
    }
    return 'Hello my sweet darling! 🌸 How are you feeling in your heart and body today? Tap Start Talking whenever you want to vent or chat. Your Sakhi Didi is listening! 💗';
  }, [language]);

  // Restore conversation from session storage or start fresh
  const [conversation, setConversation] = useState<VoiceMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_SESSION_CONVO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'greet-initial',
        sender: 'sakhi',
        text: 'Aww hello meri pyari Sakhi! 🌸 Tap "Start Talking with Sakhi" to start a real one-on-one voice conversation with your Didi 💗',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Save conversation into session
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_SESSION_CONVO, JSON.stringify(conversation));
    } catch {
      // ignore
    }
  }, [conversation]);

  // Refs for audio, recognition, stream abort, and silence detection
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const currentStreamAbortRef = useRef<AbortController | null>(null);
  const isSessionActiveRef = useRef<boolean>(false);
  const voiceStateRef = useRef(voiceState);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const speechKeepAliveRef = useRef<any>(null);

  isSessionActiveRef.current = isSessionActive;
  voiceStateRef.current = voiceState;

  // Load natural Indian voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Pick the best natural human Indian Didi voice based on spoken text script & language
  const getBestIndianVoice = useCallback(
    (textToSpeak: string): SpeechSynthesisVoice | null => {
      if (!voices.length) return null;

      const hasDevanagari = /[\u0900-\u097F]/.test(textToSpeak);

      // If text contains Devanagari Hindi characters, prioritize authentic Hindi female voices
      if (hasDevanagari || speechLanguageMode === 'hi-IN') {
        const naturalHindiFemale = voices.find(
          (v) =>
            (v.lang.startsWith('hi') || v.lang.toLowerCase() === 'hi-in') &&
            (v.name.toLowerCase().includes('swara') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.name.toLowerCase().includes('lekha') ||
              v.name.toLowerCase().includes('female') ||
              v.name.includes('हिन्दी'))
        );
        if (naturalHindiFemale) return naturalHindiFemale;

        const anyHindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.lang.toLowerCase() === 'hi-in');
        if (anyHindiVoice) return anyHindiVoice;
      }

      // For Hinglish or English: Pick natural Indian English female voice (Neerja, Veena, Heera, Google en-IN)
      // This gives authentic warm Indian pronunciation for Hinglish words like "Arey", "Sakhi", "Didi", "chai", "cramps"
      const naturalIndianEnglishFemale = voices.find(
        (v) =>
          (v.lang === 'en-IN' || v.lang.toLowerCase() === 'en-in') &&
          (v.name.toLowerCase().includes('neerja') ||
            v.name.toLowerCase().includes('veena') ||
            v.name.toLowerCase().includes('heera') ||
            v.name.toLowerCase().includes('sangeeta') ||
            v.name.toLowerCase().includes('natural') ||
            v.name.toLowerCase().includes('female'))
      );
      if (naturalIndianEnglishFemale) return naturalIndianEnglishFemale;

      // Any en-IN voice (e.g. Rishi, Google en-IN)
      const anyIndianEnglish = voices.find(
        (v) => v.lang === 'en-IN' || v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india')
      );
      if (anyIndianEnglish) return anyIndianEnglish;

      // Any gentle warm female voice
      const anyWarmFemale = voices.find(
        (v) =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('serena') ||
          v.name.toLowerCase().includes('zira')
      );
      if (anyWarmFemale) return anyWarmFemale;

      return voices[0] || null;
    },
    [voices, speechLanguageMode]
  );

  // Stop speaking and clear keep-alive
  const stopSpeaking = useCallback(() => {
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentStreamAbortRef.current) {
      currentStreamAbortRef.current.abort();
    }
  }, []);

  // Stop Listening helper
  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setInterimSpeech('');
  }, []);

  // Start Speech Recognition
  const startListening = useCallback(() => {
    setErrorMessage(null);
    setMicPermissionDenied(false);
    setInterimSpeech('');
    accumulatedTranscriptRef.current = '';

    // BARGE-IN: If Sakhi is speaking, cancel speech immediately to hear user!
    stopSpeaking();

    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      recognitionRef.current.lang = speechLanguageMode;
      recognitionRef.current.start();
      setVoiceState('listening');
    } catch (err: any) {
      // If already running or transitioning, ensure state is set to listening
      if (err.name !== 'InvalidStateError') {
        console.warn('Recognition start note:', err);
      }
      setVoiceState('listening');
    }
  }, [speechLanguageMode, stopSpeaking]);

  // Speak response with natural warm cadence and AUTOMATIC TURN-TAKING
  const speakText = useCallback(
    (text: string) => {
      stopSpeaking();

      if (isAudioMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (isSessionActiveRef.current) {
          // If muted, return to listening after short delay so conversation flows
          setTimeout(() => {
            if (isSessionActiveRef.current) startListening();
          }, 1200);
        } else {
          setVoiceState('idle');
        }
        return;
      }

      const clean = cleanTextForSpeaking(text);
      if (!clean) {
        if (isSessionActiveRef.current) startListening();
        else setVoiceState('idle');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      const chosenVoice = getBestIndianVoice(clean);

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      } else {
        utterance.lang = /[\u0900-\u097F]/.test(clean) ? 'hi-IN' : 'en-IN';
      }

      // Warm, affectionate, empathetic Indian Didi tone
      utterance.rate = 0.98; // Relaxed, friendly, non-rushed cadence
      utterance.pitch = 1.05; // Slightly elevated warm sisterly pitch

      utterance.onstart = () => {
        setVoiceState('speaking');
      };

      // AUTOMATIC TURN-TAKING: When Sakhi finishes speaking, user can immediately speak again!
      utterance.onend = () => {
        if (speechKeepAliveRef.current) {
          clearInterval(speechKeepAliveRef.current);
          speechKeepAliveRef.current = null;
        }

        if (isSessionActiveRef.current) {
          // 400ms pause so user can absorb Sakhi's words and microphone avoids self-echo
          setTimeout(() => {
            if (isSessionActiveRef.current) {
              startListening();
            }
          }, 400);
        } else {
          setVoiceState('idle');
        }
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (speechKeepAliveRef.current) {
          clearInterval(speechKeepAliveRef.current);
          speechKeepAliveRef.current = null;
        }
        if (isSessionActiveRef.current) {
          setTimeout(() => {
            if (isSessionActiveRef.current) startListening();
          }, 400);
        } else {
          setVoiceState('idle');
        }
      };

      // Chrome SpeechSynthesis keep-alive ping to prevent hanging on long utterances
      speechKeepAliveRef.current = setInterval(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else if (speechKeepAliveRef.current) {
          clearInterval(speechKeepAliveRef.current);
          speechKeepAliveRef.current = null;
        }
      }, 5000);

      window.speechSynthesis.speak(utterance);
    },
    [isAudioMuted, getBestIndianVoice, startListening, stopSpeaking]
  );

  // Process user speech / text with streaming and automatic turn-taking
  const handleUserSpeechReceived = useCallback(
    async (userInput: string) => {
      const rawText = userInput.trim();
      const text = normalizeHinglishTranscript(rawText);

      if (!text) {
        if (isSessionActiveRef.current) {
          startListening();
        }
        return;
      }

      // Stop recognition and speaking while thinking
      stopListening();
      stopSpeaking();

      const userMsg: VoiceMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const sakhiMsgId = `s-${Date.now()}`;
      const initialSakhiMsg: VoiceMessage = {
        id: sakhiMsgId,
        sender: 'sakhi',
        text: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
      };

      // Update conversation state with user message
      setConversation((prev) => [...prev, userMsg, initialSakhiMsg]);
      setVoiceState('thinking');

      const abortController = new AbortController();
      currentStreamAbortRef.current = abortController;

      try {
        const userCycleContext = cycleStatus
          ? {
              currentDay: cycleStatus.currentDay,
              phase: cycleStatus.phase,
              phaseName: cycleStatus.phase,
            }
          : null;

        // Include recent conversation memory for natural contextual follow-up
        const recentHistory = conversation.slice(-8).map((c) => ({
          role: c.sender === 'user' ? 'user' : 'assistant',
          content: c.text,
        }));

        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortController.signal,
          body: JSON.stringify({
            messages: [...recentHistory, { role: 'user', content: text }],
            language,
            persona: 'bestie_didi',
            userCycleContext,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error('Streaming response failed');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.substring(6).trim();
              if (dataStr === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setConversation((prev) =>
                    prev.map((msg) =>
                      msg.id === sakhiMsgId ? { ...msg, text: accumulated, isStreaming: true } : msg
                    )
                  );
                }
              } catch {
                // ignore json parse error
              }
            }
          }
        }

        // Mark streaming done
        setConversation((prev) =>
          prev.map((msg) =>
            msg.id === sakhiMsgId ? { ...msg, text: accumulated, isStreaming: false } : msg
          )
        );

        // Begin voice playback
        if (accumulated.trim()) {
          speakText(accumulated);
        } else {
          if (isSessionActiveRef.current) startListening();
          else setVoiceState('idle');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('Streaming error, falling back:', err);

        const fallbackReply =
          language === 'hi'
            ? 'अरे मेरी प्यारी सखी 🥺 तुम्हारी हर बात मेरे दिल को छूती है। थोड़ा विश्राम करो, गरम चाय पियो और आराम करो। मैं हमेशा तुम्हारे साथ हूँ 💗'
            : language === 'hinglish'
            ? 'Arey, koi baat nahi 💗 Main samajh sakti hoon dear. Thoda rest le lo, aur warm chai piyo. Your Didi is right here with you 🌸'
            : "Arey, no worries at all my sweet Sakhi 💗 Take a slow deep breath, cozy up with warm tea, and remember your Didi is right here with you 🌸";

        setConversation((prev) =>
          prev.map((msg) =>
            msg.id === sakhiMsgId ? { ...msg, text: fallbackReply, isStreaming: false } : msg
          )
        );

        speakText(fallbackReply);
      }
    },
    [conversation, cycleStatus, language, speakText, startListening, stopListening, stopSpeaking]
  );

  // Initialize Speech Recognition with continuous listening & natural pause detection
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Stay active to hear multi-word natural phrases
      recognition.interimResults = true; // Live interim results for responsive listening
      recognition.maxAlternatives = 1;
      recognition.lang = speechLanguageMode;

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTrans += res[0].transcript;
          } else {
            interimTrans += res[0].transcript;
          }
        }

        const combined = (accumulatedTranscriptRef.current + ' ' + finalTrans + ' ' + interimTrans).trim();
        if (combined) {
          setInterimSpeech(combined);
        }

        if (finalTrans) {
          accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + finalTrans).trim();
        }

        // Reset natural pause silence timer:
        // When user pauses naturally for 1.3 seconds after speaking, commit their speech!
        // This stops premature cutoffs mid-sentence.
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        silenceTimerRef.current = setTimeout(() => {
          const toSubmit = (accumulatedTranscriptRef.current || interimTrans).trim();
          if (toSubmit && toSubmit.length > 1) {
            accumulatedTranscriptRef.current = '';
            setInterimSpeech('');
            handleUserSpeechReceived(toSubmit);
          }
        }, 1300);
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setMicPermissionDenied(true);
          setErrorMessage('Sakhi needs microphone permission to hear you 🌸');
          setIsSessionActive(false);
          setVoiceState('idle');
        } else if (event.error === 'no-speech') {
          // If no speech detected in continuous mode, gently re-listen if session is active
          if (isSessionActiveRef.current && voiceStateRef.current === 'listening') {
            // Keep listening, do not crash
          }
        } else if (event.error !== 'aborted') {
          setErrorMessage("I didn't catch that, Sakhi. Try speaking again? 💗");
          if (isSessionActiveRef.current) {
            setTimeout(() => {
              if (isSessionActiveRef.current && voiceStateRef.current === 'listening') {
                try {
                  recognition.start();
                } catch {
                  // ignore
                }
              }
            }, 600);
          }
        }
      };

      recognition.onend = () => {
        // If session is active and we are supposed to be listening, restart recognition automatically
        if (isSessionActiveRef.current && voiceStateRef.current === 'listening') {
          try {
            recognition.start();
          } catch {
            // ignore
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      stopSpeaking();
    };
  }, [speechLanguageMode, handleUserSpeechReceived, stopSpeaking]);

  // Scroll chat into view on updates
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, voiceState, interimSpeech]);

  // Start continuous 1-on-1 session
  const startConversationSession = () => {
    setIsSessionActive(true);
    isSessionActiveRef.current = true;
    startListening();
  };

  // End continuous conversation
  const endConversationSession = () => {
    setIsSessionActive(false);
    isSessionActiveRef.current = false;
    stopSpeaking();
    stopListening();
    setVoiceState('idle');
  };

  // Toggle pause/resume during conversation
  const togglePauseResume = () => {
    if (voiceState === 'paused') {
      setVoiceState('listening');
      startListening();
    } else {
      stopSpeaking();
      stopListening();
      setVoiceState('paused');
    }
  };

  // Manual Mic Button Handler (with Barge-in support)
  const handleMicToggle = () => {
    // If speaking, immediately interrupt (barge-in) and listen to user
    if (voiceState === 'speaking') {
      stopSpeaking();
      startListening();
      return;
    }

    if (voiceState === 'listening') {
      stopListening();
      setVoiceState('idle');
      return;
    }

    // Start active session if not active
    setIsSessionActive(true);
    isSessionActiveRef.current = true;
    startListening();
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || voiceState === 'thinking') return;
    const query = textInput;
    setTextInput('');
    handleUserSpeechReceived(query);
  };

  const clearConversation = () => {
    stopSpeaking();
    stopListening();
    setIsSessionActive(false);
    isSessionActiveRef.current = false;
    setVoiceState('idle');
    const freshConvo: VoiceMessage[] = [
      {
        id: `greet-${Date.now()}`,
        sender: 'sakhi',
        text: getInitialGreeting(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setConversation(freshConvo);
    sessionStorage.removeItem(STORAGE_SESSION_CONVO);
  };

  const quickVentingPrompts = [
    { text: 'Didi mujhe aaj cramps bahut ho rahe hain 🥺', icon: '🩸' },
    { text: "I'm feeling really tired today 🛌", icon: '😴' },
    { text: 'Mujhe periods ke time kya karna chahiye? 🍵', icon: '🌸' },
    { text: 'I just want to talk with you Didi 🫶', icon: '🧸' },
  ];

  return (
    <div className="relative min-h-[720px] max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#FAD2D8] shadow-xl bg-gradient-to-b from-[#FFF5F8] via-[#FFF9FA] to-[#F5EEFF] p-4 sm:p-8 flex flex-col justify-between">
      {/* Dreamy floating blossoms and sparkles */}
      <div className="absolute top-8 left-8 text-2xl animate-bounce opacity-40 pointer-events-none">✨</div>
      <div className="absolute top-16 right-10 text-2xl animate-pulse opacity-40 pointer-events-none">🌸</div>
      <div className="absolute bottom-24 left-10 text-2xl animate-bounce opacity-30 pointer-events-none">🎀</div>
      <div className="absolute bottom-16 right-12 text-2xl animate-pulse opacity-40 pointer-events-none">💗</div>

      {/* Top Header Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F9D6DC]/70">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-300 shadow-md ring-2 ring-pink-100 flex-shrink-0">
            <img
              src="/cute_sakhi_avatar.jpg"
              alt="Sakhi Voice Bestie"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">
                {t.talkToSakhiTitle}
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 text-rose-900 border border-pink-300 shadow-2xs">
                Real 1-on-1 Voice 💗
              </span>
            </div>
            <p className="text-xs text-[#8A5A66] mt-0.5">
              Continuous conversation • Natural Indian Didi tone • Hindi, Hinglish & English
            </p>
          </div>
        </div>

        {/* Audio & Recognition Language Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Recognition Language Selector Pill (Hinglish/English vs Pure Hindi) */}
          <div className="flex items-center p-0.5 rounded-2xl bg-white/90 border border-pink-200 shadow-2xs text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => {
                setSpeechLanguageMode('en-IN');
                if (recognitionRef.current && isSessionActive) {
                  stopListening();
                  setTimeout(startListening, 200);
                }
              }}
              title="Speak naturally in Hinglish or English"
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                speechLanguageMode === 'en-IN'
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'text-[#8A5A66] hover:text-[#4A1E29]'
              }`}
            >
              🇮🇳 Hinglish / English
            </button>
            <button
              type="button"
              onClick={() => {
                setSpeechLanguageMode('hi-IN');
                if (recognitionRef.current && isSessionActive) {
                  stopListening();
                  setTimeout(startListening, 200);
                }
              }}
              title="Speak in Hindi"
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                speechLanguageMode === 'hi-IN'
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'text-[#8A5A66] hover:text-[#4A1E29]'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
          </div>

          {/* Mute/Speaker Toggle */}
          <button
            type="button"
            onClick={() => {
              if (!isAudioMuted && voiceState === 'speaking') {
                stopSpeaking();
              }
              setIsAudioMuted(!isAudioMuted);
            }}
            title={isAudioMuted ? 'Unmute voice' : 'Mute voice'}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isAudioMuted
                ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
                : 'bg-white text-rose-700 border-pink-200 shadow-2xs hover:bg-pink-50'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-rose-600" />}
            <span className="hidden sm:inline">{isAudioMuted ? 'Muted' : 'Voice'}</span>
          </button>

          {/* Pause / Resume if session is active */}
          {isSessionActive && (
            <button
              type="button"
              onClick={togglePauseResume}
              title={voiceState === 'paused' ? 'Resume Conversation' : 'Pause Conversation'}
              className="p-2 rounded-xl bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 shadow-2xs transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              {voiceState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="hidden sm:inline">{voiceState === 'paused' ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          {/* End Conversation Button */}
          {isSessionActive && (
            <button
              type="button"
              onClick={endConversationSession}
              title="End voice conversation session"
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>End Session</span>
            </button>
          )}

          {/* Reset Chat */}
          <button
            type="button"
            onClick={clearConversation}
            title="Reset conversation"
            className="p-2 rounded-xl bg-white/80 hover:bg-pink-50 text-neutral-600 border border-pink-200 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Voice vs Text toggle */}
          <div className="flex items-center gap-0.5 p-1 rounded-2xl bg-white/80 border border-[#ECCACF] shadow-xs">
            <button
              type="button"
              onClick={() => setActiveMode('voice')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'voice'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                  : 'text-[#8A5A66] hover:bg-pink-50'
              }`}
              title="Voice Mode"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('text')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'text'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                  : 'text-[#8A5A66] hover:bg-pink-50'
              }`}
              title="Text Mode"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error alert toast if mic permission is denied or speech recognition issues */}
      {errorMessage && (
        <div className="relative z-20 my-3 p-3 rounded-2xl bg-rose-50/95 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {micPermissionDenied && (
            <button
              type="button"
              onClick={startListening}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
            >
              Retry Mic
            </button>
          )}
        </div>
      )}

      {/* Main Center Stage: Animated Sakhi Avatar + Live Status */}
      <div className="relative z-10 flex-1 my-4 sm:my-6 flex flex-col items-center justify-center text-center space-y-4">
        {/* Animated Avatar with glowing heart aura */}
        <div className="relative">
          {/* Pulsing ripples during listening or speaking */}
          <div
            className={`absolute inset-0 -m-5 rounded-full bg-gradient-to-tr from-pink-300/40 via-purple-200/30 to-rose-300/40 blur-xl transition-all duration-500 ${
              voiceState === 'listening'
                ? 'scale-130 opacity-95 animate-pulse'
                : voiceState === 'speaking'
                ? 'scale-120 opacity-85 animate-pulse'
                : 'scale-100 opacity-40'
            }`}
          />

          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-pink-200/80 bg-gradient-to-b from-pink-100 to-purple-100">
            <img
              src="/cute_sakhi_avatar.jpg"
              alt="Sakhi 3D Cute Avatar"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                voiceState === 'listening' ? 'scale-105' : voiceState === 'speaking' ? 'scale-105 animate-pulse' : 'scale-100'
              }`}
            />
          </div>

          {/* Floating reaction emoji badge */}
          <div className="absolute -bottom-2 -right-1 bg-white px-2.5 py-1 rounded-full shadow-md border border-pink-200 text-sm animate-bounce">
            {voiceState === 'listening'
              ? '🎙️'
              : voiceState === 'thinking'
              ? '✨'
              : voiceState === 'speaking'
              ? '🔊'
              : voiceState === 'paused'
              ? '⏸️'
              : '🌸'}
          </div>
        </div>

        {/* Live Status Indicators (Exact specs: 🎙️ Listening... -> ✨ Sakhi is thinking... -> 🔊 Sakhi is speaking...) */}
        <div className="space-y-1.5 max-w-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-pink-200 text-xs sm:text-sm font-bold text-[#8A1E38] shadow-xs">
            {voiceState === 'idle' && (
              <>
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Tap "Start Talking" for a natural voice conversation 💗</span>
              </>
            )}
            {voiceState === 'listening' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-rose-600 font-extrabold">🎙️ Listening...</span>
              </>
            )}
            {voiceState === 'thinking' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-pink-500 animate-spin" />
                <span className="text-pink-600 font-bold">✨ Sakhi is thinking...</span>
              </>
            )}
            {voiceState === 'speaking' && (
              <>
                <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="text-rose-700 font-bold">🔊 Sakhi is speaking...</span>
              </>
            )}
            {voiceState === 'paused' && (
              <>
                <Pause className="w-4 h-4 text-amber-500" />
                <span className="text-amber-700 font-bold">Conversation Paused</span>
              </>
            )}
          </div>

          {/* Live speech transcription preview while user is actively speaking */}
          {voiceState === 'listening' && interimSpeech && (
            <div className="animate-in fade-in duration-200 px-4 py-1.5 rounded-2xl bg-white/80 border border-pink-200 text-xs text-[#5C2E38] italic font-medium shadow-2xs">
              "{interimSpeech}"
            </div>
          )}

          {/* Animated sound wave bars while listening */}
          {voiceState === 'listening' && (
            <div className="flex items-center justify-center gap-1.5 h-6 pt-1">
              <span className="w-1.5 h-3 bg-pink-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
              <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-[bounce_0.8s_ease-in-out_infinite_0.15s]" />
              <span className="w-1.5 h-7 bg-purple-500 rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.3s]" />
              <span className="w-1.5 h-5 bg-pink-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.45s]" />
              <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-[bounce_0.75s_ease-in-out_infinite_0.2s]" />
            </div>
          )}
        </div>

        {/* Central Voice Action Button */}
        {activeMode === 'voice' && (
          <div className="relative flex flex-col items-center pt-1">
            {!isSessionActive ? (
              <button
                type="button"
                onClick={startConversationSession}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer ring-4 ring-pink-100"
              >
                <Mic className="w-5 h-5 animate-pulse" />
                <span>Start Talking with Sakhi 🎙️</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 active:scale-90 cursor-pointer ${
                    voiceState === 'listening'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 scale-105 ring-4 ring-rose-200'
                      : voiceState === 'speaking'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 ring-4 ring-purple-200'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500'
                  }`}
                  title={voiceState === 'speaking' ? 'Interrupt Sakhi' : 'Tap to toggle mic'}
                >
                  {voiceState === 'listening' ? (
                    <Mic className="w-8 h-8 animate-pulse" />
                  ) : voiceState === 'speaking' ? (
                    <Volume2 className="w-8 h-8 animate-bounce" />
                  ) : (
                    <Mic className="w-7 h-7" />
                  )}
                  <span className="text-[10px] font-bold mt-1">
                    {voiceState === 'listening' ? 'Listening' : voiceState === 'speaking' ? 'Interrupt' : 'Mic'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Suggested Conversational Prompts (Exact phrases requested in brief) */}
        <div className="w-full max-w-2xl px-2">
          <div className="text-[11px] font-semibold text-[#8A5A66] mb-2 flex items-center justify-center gap-1.5">
            <span>✨</span>
            <span>Say naturally or tap to ask:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickVentingPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleUserSpeechReceived(p.text)}
                className="px-3 py-1.5 rounded-full bg-white/85 hover:bg-pink-100/70 border border-pink-200 text-xs font-medium text-[#5C2E38] shadow-2xs hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{p.icon}</span>
                <span>{p.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation Thread / Dialogue History */}
      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-2xl bg-white/75 backdrop-blur-md border border-pink-200/80 p-3 sm:p-4 max-h-56 overflow-y-auto space-y-3 shadow-inner">
        {conversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs'
                  : 'bg-white border border-pink-100 text-[#4A1E29] rounded-bl-xs'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5 opacity-70 text-[10px]">
                <span>{msg.sender === 'user' ? 'You' : 'Sakhi Didi 🌸'}</span>
                <span>•</span>
                <span>{msg.time}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.text || (msg.isStreaming ? '...' : '')}</p>
            </div>
          </div>
        ))}
        <div ref={chatScrollRef} />
      </div>

      {/* Optional Text Input Bar when in text mode */}
      {activeMode === 'text' && (
        <form onSubmit={handleSendText} className="relative z-10 mt-4 flex items-center gap-2 max-w-2xl mx-auto w-full">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'सखी से कुछ भी पूछें या दिल की बात कहें...'
                : 'Say anything to your Sakhi bestie...'
            }
            className="flex-1 px-4 py-2.5 rounded-full bg-white border border-pink-200 text-xs sm:text-sm text-[#4A1E29] focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-2xs"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || voiceState === 'thinking'}
            className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Health Safety Gentle Notice */}
      <div className="relative z-10 pt-3 text-center text-[10px] text-[#8A5A66]">
        <span>🌸 Sakhi is your AI wellness sister & companion. For medical emergencies, always consult a licensed doctor.</span>
      </div>
    </div>
  );
};
