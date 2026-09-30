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
  Flower2,
  Smile,
  Coffee,
  HelpCircle,
} from 'lucide-react';

interface VoiceMessage {
  id: string;
  sender: 'user' | 'sakhi';
  text: string;
  time: string;
}

interface TalkToSakhiProps {
  cycleStatus?: CycleStatus;
}

export const TalkToSakhi: React.FC<TalkToSakhiProps> = ({ cycleStatus }) => {
  const { t, language } = useTranslation();

  // Voice Interaction State: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [lastSakhiReply, setLastSakhiReply] = useState<string>('');

  // Initial welcome greeting from Sakhi Bestie
  const initialGreeting =
    language === 'hi'
      ? 'अरे मेरी प्यारी सखी! 🌸 आज मन कैसा है तुम्हारा? कोई बात सता रही है या सिर्फ गपशप करनी है? माइक पर टैप करो, मैं सब सुन रही हूँ 💗'
      : language === 'hinglish'
      ? 'Aww hello meri pyari Sakhi! 🌸 Aaj din kaisa tha? Kuch share karna hai ya vent karna hai? Just tap the mic button and talk to your Didi, I am right here for you 💗'
      : 'Hello my sweet darling! 🌸 How are you feeling in your heart and body today? Tap the mic whenever you want to vent, ask anything, or just chat. Your Sakhi bestie is listening! 💗';

  const [conversation, setConversation] = useState<VoiceMessage[]>([
    {
      id: 'greet',
      sender: 'sakhi',
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

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
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserSpeechReceived(transcript);
        }
      };

      recognition.onerror = () => {
        setVoiceState('idle');
      };

      recognition.onend = () => {
        if (voiceState === 'listening') {
          // If no transcript was captured, return to idle
          setTimeout(() => {
            setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
          }, 600);
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
    };
  }, [language]);

  // Scroll chat into view on updates
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, voiceState]);

  // Voice speech synthesis helper
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.96;
    utterance.pitch = 1.08; // slightly higher, friendlier tone

    utterance.onstart = () => {
      setIsSpeakingAudio(true);
      setVoiceState('speaking');
    };
    utterance.onend = () => {
      setIsSpeakingAudio(false);
      setVoiceState('idle');
    };
    utterance.onerror = () => {
      setIsSpeakingAudio(false);
      setVoiceState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingAudio(false);
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
        recognitionRef.current.stop();
      }
      setVoiceState('idle');
      return;
    }

    // Start listening
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setVoiceState('listening');
      } catch (err) {
        console.warn('Speech recognition error:', err);
        setVoiceState('idle');
      }
    } else {
      // Fallback for browsers without speech recognition
      const promptText = window.prompt(
        language === 'hi'
          ? 'सखी से अपनी बात कहें:'
          : 'Talk to your Sakhi Bestie:'
      );
      if (promptText) {
        handleUserSpeechReceived(promptText);
      }
    }
  };

  // Process user speech or text
  const handleUserSpeechReceived = async (userInput: string) => {
    const text = userInput.trim();
    if (!text) {
      setVoiceState('idle');
      return;
    }

    const userMsg: VoiceMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, userMsg]);
    setVoiceState('thinking');

    try {
      const userCycleContext = cycleStatus
        ? {
            currentDay: cycleStatus.currentDay,
            phase: cycleStatus.phase,
            phaseName: cycleStatus.phase,
          }
        : null;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          mode: 'standard',
          userCycleContext,
        }),
      });

      let reply = '';
      if (response.ok) {
        const data = await response.json();
        reply = data.reply;
      }

      if (!reply) {
        // Warm Didi fallback
        reply =
          language === 'hi'
            ? 'अरे मेरी प्यारी सखी 🥺 तुम्हारी हर बात मेरे दिल को छूती है। तुम बिल्कुल अकेली नहीं हो, गरम पानी से सिकाई करो और गहरी सांस लो। मैं हमेशा तुम्हारे साथ हूँ 💗'
            : language === 'hinglish'
            ? 'Aww Sakhi 🥺 Come here! Main samajh sakti hoon dear. Thoda aaram karo, hot chai piyo aur bilkul stress mat lo. Your Didi is right here with you 💗'
            : "Aww my dear Sakhi 🥺 I hear you and I'm right here with open arms. Take a slow deep breath, cuddle in a cozy blanket, and know that you are deeply loved 💗";
      }

      setLastSakhiReply(reply);
      const sakhiMsg: VoiceMessage = {
        id: `s-${Date.now()}`,
        sender: 'sakhi',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversation((prev) => [...prev, sakhiMsg]);

      // Speak back with audio!
      speakText(reply);
    } catch (err) {
      console.error('Error in Talk to Sakhi:', err);
      const fallbackReply =
        language === 'hi'
          ? 'सखी, मैं यहीं हूँ तुम्हारे साथ। थोड़ा विश्राम करो और मुस्कुराओ 🌸'
          : 'Aww Sakhi 🥺 I am right here for you. Take a warm cup of tea and rest easy 💗';

      setConversation((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          sender: 'sakhi',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakText(fallbackReply);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || voiceState === 'thinking') return;
    const query = textInput;
    setTextInput('');
    handleUserSpeechReceived(query);
  };

  const quickVentingPrompts = [
    { text: language === 'hi' ? 'आज मूड बहुत खराब है 🥺' : 'Aaj mood bahut kharab hai 🥺', icon: '🥺' },
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
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-300 shadow-md ring-2 ring-pink-100">
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
                {t.bestieBadge}
              </span>
            </div>
            <p className="text-xs text-[#8A5A66] mt-0.5">{t.talkToSakhiSub}</p>
          </div>
        </div>

        {/* Mode switcher tabs: Voice vs Text */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/80 border border-[#ECCACF] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveMode('voice')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 text-xs sm:text-sm font-bold text-[#8A1E38] shadow-xs">
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
                <span className="text-pink-600">{t.sakhiThinking}</span>
              </>
            )}
            {voiceState === 'speaking' && (
              <>
                <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="text-rose-700">{t.sakhiSpeaking}</span>
              </>
            )}
          </div>

          {/* Animated sound wave bars when listening */}
          {voiceState === 'listening' && (
            <div className="flex items-center justify-center gap-1.5 h-6 pt-2">
              <span className="w-1.5 h-3 bg-pink-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-8 bg-purple-500 rounded-full animate-bounce [animation-delay:0.3s]" />
              <span className="w-1.5 h-5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.45s]" />
              <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]" />
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
                <VolumeX className="w-10 h-10 mb-1" />
              ) : voiceState === 'listening' ? (
                <MicOff className="w-10 h-10 mb-1" />
              ) : (
                <Mic className="w-10 h-10 mb-1" />
              )}
              <span className="text-[11px] font-bold tracking-wide uppercase">
                {voiceState === 'speaking'
                  ? 'Stop'
                  : voiceState === 'listening'
                  ? 'Listening'
                  : 'Tap & Talk'}
              </span>
            </button>
          </div>
        )}

        {/* Recent conversation balloon */}
        <div className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-[#FAD2D8] shadow-xs text-left max-h-48 overflow-y-auto space-y-2.5">
          {conversation.slice(-3).map((item) => (
            <div
              key={item.id}
              className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[90%] shadow-2xs ${
                  item.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs'
                    : 'bg-[#FFF8FA] text-[#4A1E29] border border-pink-200 rounded-bl-xs font-medium'
                }`}
              >
                {item.text}
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

      {/* Bottom Text Input Field (When in Text Mode or Quick Typing) */}
      {activeMode === 'text' && (
        <form onSubmit={handleSendText} className="relative z-10 pt-3 flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t.talkToSakhiPlaceholder}
            className="flex-1 px-4 py-3 rounded-full bg-white border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] placeholder:text-[#B38790] focus:outline-none focus:border-[#D86B84] focus:ring-2 focus:ring-pink-200 shadow-xs"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || voiceState === 'thinking'}
            className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white disabled:opacity-40 shadow-md active:scale-95 transition-all"
            aria-label="Send to Sakhi"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
