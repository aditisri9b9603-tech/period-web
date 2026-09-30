import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/context';
import { CycleStatus } from '../types/cycle';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Trash2,
  AlertTriangle,
  Zap,
  Brain,
  Scale,
  RefreshCw,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface SakhiChatProps {
  cycleStatus?: CycleStatus;
}

export const SakhiChat: React.FC<SakhiChatProps> = ({ cycleStatus }) => {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'initial-greeting',
        role: 'assistant',
        content: t.sakhiGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'standard' | 'low_latency' | 'high_thinking'>('standard');
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Update initial greeting when language changes if chat is fresh
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'initial-greeting') {
      setMessages([
        {
          id: 'initial-greeting',
          role: 'assistant',
          content: t.sakhiGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language, t.sakhiGreeting]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech synthesis stop on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Gentle, comforting cadence

    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const userCycleContext = cycleStatus
        ? {
            currentDay: cycleStatus.currentDay,
            phase: cycleStatus.phase,
            phaseName:
              cycleStatus.phase === 'menstrual'
                ? t.phaseMenstrual
                : cycleStatus.phase === 'follicular'
                ? t.phaseFollicular
                : cycleStatus.phase === 'ovulatory'
                ? t.phaseOvulatory
                : t.phaseLuteal,
            daysUntilNextPeriod: cycleStatus.daysUntilNextPeriod,
          }
        : null;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          language,
          mode,
          userCycleContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || t.sakhiErrorNotice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to send message to Sakhi:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: t.sakhiErrorNotice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeakingId(null);
    setMessages([
      {
        id: 'initial-greeting',
        role: 'assistant',
        content: t.sakhiGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    t.quickPrompt1,
    t.quickPrompt2,
    t.quickPrompt3,
    t.quickPrompt4,
  ];

  return (
    <div className="bg-[#FFFDFB] rounded-3xl border border-[#F4DFE2] shadow-sm flex flex-col h-[700px] max-h-[82vh] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#F7E7E9] bg-gradient-to-r from-[#FFF6F3] via-[#FFF9F6] to-[#FAF5FF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FAD2D8] via-[#FFEADB] to-[#FCEEE9] border border-[#F4D7DB] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-[#A63A50]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-[#4A1E29]">{t.sakhiChatTitle}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCEEE9] text-[#8B263E] border border-[#F4D7DB]">
                {t.sakhiAiBadge}
              </span>
            </div>
            <p className="text-xs text-[#7A4B55] mt-0.5">{t.chatLanguagePrompt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-white/90 border border-[#ECCACF] shadow-2xs">
            <button
              type="button"
              onClick={() => setMode('low_latency')}
              title={t.lowLatencyMode}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'low_latency'
                  ? 'bg-amber-100 text-amber-900 font-bold shadow-xs'
                  : 'text-[#8A5A66] hover:bg-neutral-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMode('standard')}
              title={t.standardMode}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'standard'
                  ? 'bg-[#FBE4E8] text-[#841935] font-bold shadow-xs'
                  : 'text-[#8A5A66] hover:bg-neutral-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMode('high_thinking')}
              title={t.highThinkingMode}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'high_thinking'
                  ? 'bg-purple-100 text-purple-900 font-bold shadow-xs'
                  : 'text-[#8A5A66] hover:bg-neutral-100'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            title={t.clearChat}
            className="p-2 rounded-xl text-[#9E6571] hover:text-[#5C2E38] hover:bg-[#FCEEE9] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="px-4 py-2 bg-[#FFF8FA] border-b border-[#F7E7E9] flex items-center gap-2 text-[11px] text-[#8B3B4C]">
        <Info className="w-3.5 h-3.5 text-[#C04D68] flex-shrink-0" />
        <span className="truncate">{t.sakhiAiDisclaimer}</span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-r from-[#D86B84] to-[#C04D68] text-white rounded-br-xs'
                    : 'bg-[#FFF9F6] text-[#422027] border border-[#F4DFE2] rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {/* Message Footer with Audio & Timestamp */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-[#A66F7B]">
                <span>{msg.timestamp}</span>
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(msg.id, msg.content)}
                    className="hover:text-[#5C2E38] p-0.5 rounded transition-colors inline-flex items-center gap-1"
                    title={isSpeakingId === msg.id ? t.stopSpeakingBtn : t.speakBtn}
                  >
                    {isSpeakingId === msg.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-[#A63A50] animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-[#9E6571]" />
                    )}
                  </button>
                )}
                {msg.modelUsed && (
                  <span className="text-[10px] text-[#A66F7B] border border-[#F4D7DB] px-1.5 py-0.2 rounded-md">
                    {msg.modelUsed.replace('gemini-', '')}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-[#7A4B55] bg-[#FFF9F6] p-3 rounded-2xl border border-[#F4DFE2] max-w-xs animate-pulse">
            <RefreshCw className="w-4 h-4 text-[#C04D68] animate-spin" />
            <span>{t.sakhiThinkingNotice}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-[#F7E7E9] bg-[#FFFDFB] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66F7B] mr-1">
            {t.quickPromptsLabel}:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="text-xs px-3 py-1 rounded-full bg-[#FFF4F0] hover:bg-[#FCEEE9] text-[#7A2A3E] border border-[#F4D7DB] transition-all duration-150 whitespace-nowrap active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field & Send Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 sm:p-4 border-t border-[#F7E7E9] bg-white flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-full transition-colors ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-[#FFF4F0] text-[#9E6571] hover:text-[#5C2E38]'
          }`}
          title={isListening ? t.listeningBtn : 'Voice Input'}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.askSakhiPlaceholder}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-full bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] placeholder:text-[#B38790] focus:outline-none focus:border-[#D86B84] focus:ring-1 focus:ring-[#D86B84]"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-full bg-gradient-to-r from-[#D86B84] to-[#C04D68] hover:from-[#C75A73] hover:to-[#AC3E57] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all duration-200 active:scale-95"
          title={t.sendBtn}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
