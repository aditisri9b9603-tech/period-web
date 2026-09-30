import React, { useState, useRef, useEffect } from 'react';
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

const STORAGE_SESSION_CONVO = 'sakhi_voice_convo_v2';

export const TalkToSakhi: React.FC<TalkToSakhiProps> = ({ cycleStatus }) => {
  const { t, language } = useTranslation();

  // Voice Interaction State: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Initial welcome greeting from Sakhi Bestie
  const getInitialGreeting = () => {
    if (language === 'hi') {
      return 'अरे मेरी प्यारी सखी! 🌸 आज मन कैसा है तुम्हारा? कोई बात सता रही है या सिर्फ गपशप करनी है? माइक पर टैप करो, मैं सब सुन रही हूँ 💗';
    }
    if (language === 'hinglish') {
      return 'Aww hello meri pyari Sakhi! 🌸 Aaj din kaisa tha? Kuch share karna hai ya vent karna hai? Just tap the mic button and talk to your Didi, I am right here for you 💗';
    }
    return 'Hello my sweet darling! 🌸 How are you feeling in your heart and body today? Tap the mic whenever you want to vent, ask anything, or just chat. Your Sakhi bestie is listening! 💗';
  };

  // Restore conversation from session storage or initial
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
        text: getInitialGreeting(),
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

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const currentStreamAbortRef = useRef<AbortController | null>(null);

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          handleUserSpeechReceived(transcript);
        }
      };

      recognition.onerror = () => {
        setVoiceState('idle');
      };

      recognition.onend = () => {
        if (voiceState === 'listening') {
          setTimeout(() => {
            setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
          }, 400);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (currentStreamAbortRef.current) {
        currentStreamAbortRef.current.abort();
      }
    };
  }, [language]);

  // Scroll chat into view on updates
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, voiceState]);

  // Voice speech synthesis helper
  const speakText = (text: string) => {
    if (isAudioMuted || !window.speechSynthesis) {
      setVoiceState('idle');
      return;
    }

    window.speechSynthesis.cancel();
    // Clean emojis & stars for natural speaking
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\*/g, '')
      .trim();

    if (!cleanText) {
      setVoiceState('idle');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.02; // natural conversational pacing
    utterance.pitch = 1.08; // friendly, warm bestie tone

    utterance.onstart = () => {
      setVoiceState('speaking');
    };
    utterance.onend = () => {
      setVoiceState('idle');
    };
    utterance.onerror = () => {
      setVoiceState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (currentStreamAbortRef.current) {
      currentStreamAbortRef.current.abort();
    }
    setVoiceState('idle');
  };

  // User taps Central Mic
  const handleMicToggle = () => {
    if (voiceState === 'speaking') {
      stopSpeaking();
      return;
    }

    if (voiceState === 'listening') {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setVoiceState('idle');
      return;
    }

    // Stop ongoing speech before listening
    stopSpeaking();

    // Start listening immediately
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setVoiceState('listening');
      } catch (err) {
        console.warn('Speech recognition start issue, retrying:', err);
        setVoiceState('idle');
      }
    } else {
      // Fallback prompt for environments without Web Speech API
      const promptText = window.prompt(
        language === 'hi' ? 'सखी से अपनी बात कहें:' : 'Talk to your Sakhi Bestie:'
      );
      if (promptText) {
        handleUserSpeechReceived(promptText);
      }
    }
  };

  // Process user speech or text with STREAMING for fast immediate feedback
  const handleUserSpeechReceived = async (userInput: string) => {
    const text = userInput.trim();
    if (!text) {
      setVoiceState('idle');
      return;
    }

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

    setConversation((prev) => [...prev, userMsg, initialSakhiMsg]);
    setVoiceState('thinking'); // Shown briefly until first token arrives

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

      // Request streaming response
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: [
            ...conversation.map((c) => ({
              role: c.sender === 'user' ? 'user' : 'assistant',
              content: c.text,
            })),
            { role: 'user', content: text },
          ],
          language,
          persona: 'bestie_didi',
          userCycleContext,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming failed or not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let isFirstChunk = true;
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
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                if (isFirstChunk) {
                  // Switch from thinking to active speaking as soon as first token streams!
                  setVoiceState('speaking');
                  isFirstChunk = false;
                }
                accumulated += parsed.text;

                // Update text in real time
                setConversation((prev) =>
                  prev.map((msg) =>
                    msg.id === sakhiMsgId
                      ? { ...msg, text: accumulated, isStreaming: true }
                      : msg
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

      // Begin audio speech immediately once available
      if (accumulated.trim() && !isAudioMuted) {
        speakText(accumulated);
      } else {
        setVoiceState('idle');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.warn('Streaming error, falling back gracefully:', err);

      const fallbackReply =
        language === 'hi'
          ? 'अरे मेरी प्यारी सखी 🥺 तुम्हारी हर बात मेरे दिल को छूती है। थोड़ा विश्राम करो, गरम चाय पियो और आराम करो। मैं हमेशा तुम्हारे साथ हूँ 💗'
          : language === 'hinglish'
          ? 'Aww Sakhi 🥺 Come here! Main samajh sakti hoon dear. Thoda rest le lo, aur warm chai piyo. Your Didi is right here with you 💗'
          : "Aww my sweet Sakhi 🥺 I am right here for you. Take a slow deep breath, cozy up with warm tea, and know you are deeply loved 💗";

      setConversation((prev) =>
        prev.map((msg) =>
          msg.id === sakhiMsgId
            ? { ...msg, text: fallbackReply, isStreaming: false }
            : msg
        )
      );

      if (!isAudioMuted) {
        speakText(fallbackReply);
      } else {
        setVoiceState('idle');
      }
    }
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
    { text: language === 'hi' ? 'आज बहुत थकान महसूस हो रही है 🥺' : 'Yaar aaj bahut tired feel ho raha hai 🥺', icon: '🥺' },
    { text: language === 'hi' ? 'पीरियड के दर्द से बहुत परेशान हूँ 😭' : 'Cramps are hurting so bad 😭', icon: '🩸' },
    { text: language === 'hi' ? 'रात में बहुत ओवरथिंकिंग हो रही है 🌙' : 'Overthinking everything tonight 🌙', icon: '💭' },
    { text: language === 'hi' ? 'बस एक प्यारी झप्पी चाहिए 🫶' : 'I just need a warm hug 🫶', icon: '🧸' },
    { text: language === 'hi' ? 'आज कुछ मीठा खाने का मन है 🍫' : 'Craving chocolate & sweets 🍫', icon: '🍫' },
  ];

  return (
    <div className="relative min-h-[720px] max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#FAD2D8] shadow-xl bg-gradient-to-b from-[#FFF5F8] via-[#FFF9FA] to-[#F5EEFF] p-4 sm:p-8 flex flex-col justify-between">
      {/* Dreamy floating sparkles and hearts */}
      <div className="absolute top-8 left-8 text-2xl animate-bounce opacity-40 pointer-events-none">✨</div>
      <div className="absolute top-16 right-10 text-2xl animate-pulse opacity-40 pointer-events-none">🌸</div>
      <div className="absolute bottom-24 left-10 text-2xl animate-bounce opacity-30 pointer-events-none">🎀</div>
      <div className="absolute bottom-16 right-12 text-2xl animate-pulse opacity-40 pointer-events-none">💗</div>

      {/* Header bar */}
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
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 text-rose-900 border border-pink-300 shadow-2xs">
                Fast Voice Bestie 💗
              </span>
            </div>
            <p className="text-xs text-[#8A5A66] mt-0.5">
              Instant streaming replies • Like talking to your sweetest Indian Didi
            </p>
          </div>
        </div>

        {/* Right Controls: Mode, Audio Mute, and Clear */}
        <div className="flex items-center gap-2">
          {/* Mute/Unmute audio toggle */}
          <button
            type="button"
            onClick={() => {
              if (!isAudioMuted && voiceState === 'speaking') {
                stopSpeaking();
              }
              setIsAudioMuted(!isAudioMuted);
            }}
            title={isAudioMuted ? 'Unmute voice' : 'Mute voice'}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
              isAudioMuted
                ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
                : 'bg-white text-rose-700 border-pink-200 shadow-2xs hover:bg-pink-50'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAudioMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          {/* Clear Session Chat */}
          <button
            type="button"
            onClick={clearConversation}
            title="Reset conversation"
            className="p-2 rounded-xl bg-white/80 hover:bg-pink-50 text-neutral-600 border border-pink-200 shadow-2xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mode switcher tabs: Voice vs Text */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/80 border border-[#ECCACF] shadow-xs">
            <button
              type="button"
              onClick={() => setActiveMode('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'voice'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                  : 'text-[#8A5A66] hover:bg-pink-50'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{t.justTalk}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'text'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                  : 'text-[#8A5A66] hover:bg-pink-50'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t.askByText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Center Area: Cute Sakhi Avatar + Mic or Voice Interaction */}
      <div className="relative z-10 flex-1 my-6 flex flex-col items-center justify-center text-center space-y-6">
        {/* Animated Avatar with glowing heart aura */}
        <div className="relative">
          {/* Pulsing ripples */}
          <div
            className={`absolute inset-0 -m-4 rounded-full bg-gradient-to-tr from-pink-300/40 via-purple-200/30 to-rose-300/40 blur-xl transition-all duration-700 ${
              voiceState === 'listening'
                ? 'scale-125 opacity-90 animate-pulse'
                : voiceState === 'speaking'
                ? 'scale-115 opacity-80 animate-pulse'
                : 'scale-100 opacity-50'
            }`}
          />

          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-pink-200/80 bg-gradient-to-b from-pink-100 to-purple-100">
            <img
              src="/cute_sakhi_avatar.jpg"
              alt="Sakhi 3D Cute Avatar"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                voiceState === 'listening' ? 'scale-105' : 'scale-100 hover:scale-105'
              }`}
            />
          </div>

          {/* Floating reaction badge */}
          <div className="absolute -bottom-2 -right-1 bg-white px-2.5 py-1 rounded-full shadow-md border border-pink-200 text-sm animate-bounce">
            {voiceState === 'listening'
              ? '🎧'
              : voiceState === 'thinking'
              ? '✨'
              : voiceState === 'speaking'
              ? '💕'
              : '🌸'}
          </div>
        </div>

        {/* Status Callout Text */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-pink-200 text-xs sm:text-sm font-bold text-[#8A1E38] shadow-xs">
            {voiceState === 'idle' && (
              <>
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Tap the microphone & pour your heart out 💗</span>
              </>
            )}
            {voiceState === 'listening' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-rose-600 font-extrabold">{t.listeningWave}</span>
              </>
            )}
            {voiceState === 'thinking' && (
              <>
                <span className="w-3.5 h-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-pink-600">Sakhi is thinking... ✨</span>
              </>
            )}
            {voiceState === 'speaking' && (
              <>
                <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="text-rose-700">Sakhi is speaking... 💕</span>
              </>
            )}
          </div>

          {/* Animated sound wave bars while listening */}
          {voiceState === 'listening' && (
            <div className="flex items-center justify-center gap-1.5 h-7 pt-2">
              <span className="w-1.5 h-3 bg-pink-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
              <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-[bounce_0.8s_ease-in-out_infinite_0.15s]" />
              <span className="w-1.5 h-8 bg-purple-500 rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.3s]" />
              <span className="w-1.5 h-5 bg-pink-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.45s]" />
              <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-[bounce_0.75s_ease-in-out_infinite_0.2s]" />
            </div>
          )}
        </div>

        {/* Large Main Central Microphone Button */}
        {activeMode === 'voice' && (
          <div className="relative flex flex-col items-center pt-2">
            {/* Pulsing ripple rings */}
            {voiceState === 'listening' && (
              <>
                <div className="absolute inset-0 -m-6 rounded-full border-2 border-pink-400/50 animate-ping pointer-events-none" />
                <div className="absolute inset-0 -m-12 rounded-full border-2 border-rose-300/30 animate-pulse pointer-events-none" />
              </>
            )}

            <button
              type="button"
              onClick={handleMicToggle}
              className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 active:scale-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 ${
                voiceState === 'listening'
                  ? 'bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 ring-8 ring-pink-200 animate-pulse'
                  : voiceState === 'speaking'
                  ? 'bg-gradient-to-tr from-purple-600 to-pink-500 ring-4 ring-purple-200'
                  : 'bg-gradient-to-tr from-[#D86B84] via-[#C04D68] to-[#FF758F] hover:from-[#C75A73] hover:to-[#FF607D] ring-4 ring-pink-100 hover:scale-105'
              }`}
              aria-label={t.tapAndTalk}
            >
              {voiceState === 'speaking' ? (
                <Square className="w-8 h-8 fill-current mb-1" />
              ) : voiceState === 'listening' ? (
                <MicOff className="w-9 h-9 mb-1" />
              ) : (
                <Mic className="w-9 h-9 mb-1" />
              )}
              <span className="text-[11px] font-bold tracking-wide uppercase">
                {voiceState === 'speaking'
                  ? 'Stop Voice'
                  : voiceState === 'listening'
                  ? 'Listening'
                  : 'Tap & Talk'}
              </span>
            </button>
          </div>
        )}

        {/* Real-time Streaming Conversation Window */}
        <div className="w-full max-w-lg bg-white/75 backdrop-blur-md rounded-2xl p-4 border border-[#FAD2D8] shadow-xs text-left max-h-56 overflow-y-auto space-y-2.5">
          {conversation.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[92%] shadow-2xs transition-all ${
                  item.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs'
                    : 'bg-[#FFF8FA] text-[#4A1E29] border border-pink-200 rounded-bl-xs font-medium'
                }`}
              >
                <span>{item.text}</span>
                {item.isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 bg-rose-500 ml-1 rounded-full animate-pulse align-middle" />
                )}
              </div>
              <span className="text-[10px] text-[#A66F7B] mt-0.5 px-1">{item.time}</span>
            </div>
          ))}
          <div ref={chatScrollRef} />
        </div>
      </div>

      {/* Quick vent / bestie prompts chips */}
      <div className="relative z-10 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A66F7B]">
            Tap to vent:
          </span>
          {quickVentingPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUserSpeechReceived(q.text)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 hover:bg-pink-100 text-[#841935] border border-pink-200 shadow-2xs transition-all duration-150 active:scale-95"
            >
              <span>{q.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Text Input Field */}
      {activeMode === 'text' && (
        <form onSubmit={handleSendText} className="relative z-10 pt-3 flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'सखी को अपना संदेश लिखें... (उदा. आज बहुत थकान है 🥺)'
                : 'Type to your Sakhi bestie... (e.g. Yaar aaj bahut tired feel ho raha hai)'
            }
            className="flex-1 px-4 py-3 rounded-full bg-white border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] placeholder:text-[#B38790] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-pink-100 shadow-2xs"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || voiceState === 'thinking'}
            className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white shadow-md shadow-rose-200 transition-all active:scale-90"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
