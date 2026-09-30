import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/context';
import { useTokens } from '../context/TokenContext';
import {
  AFFIRMATIONS,
  MOOD_CHOICES,
  WHEEL_ITEMS,
  MYTH_FACT_ITEMS,
  DAILY_CHALLENGES,
} from '../data/playData';
import { MoodType, MemoryCard } from '../types/play';
import {
  Sparkles,
  Heart,
  RotateCw,
  Volume2,
  Share2,
  Bookmark,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Smile,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';

const STORAGE_PLAY_STATE = 'sakhi_play_state_v1';

export const SakhiPlay: React.FC = () => {
  const { t, language } = useTranslation();
  const { earnTokens } = useTokens();

  // Active game tab
  type PlayTab = 'affirmation' | 'mood' | 'memory' | 'bubble' | 'wheel' | 'myth' | 'challenge';
  const [activeTab, setActiveTab] = useState<PlayTab>('affirmation');

  // Daily anti-abuse tracker
  const [completedGames, setCompletedGames] = useState<Record<string, boolean>>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`${STORAGE_PLAY_STATE}_${today}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const markGameDone = (gameKey: string, tokens: number, reason: string) => {
    if (!completedGames[gameKey]) {
      earnTokens(tokens, reason, 'care', '🌸');
      const updated = { ...completedGames, [gameKey]: true };
      setCompletedGames(updated);
      try {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`${STORAGE_PLAY_STATE}_${today}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  // --- 1. DAILY AFFIRMATION STATE ---
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [savedAffirmations, setSavedAffirmations] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('sakhi_saved_affirmations');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const currentAffirmation = AFFIRMATIONS[affirmationIndex];

  const handleNextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  const handleSaveAffirmation = () => {
    if (!savedAffirmations.includes(currentAffirmation.id)) {
      const updated = [...savedAffirmations, currentAffirmation.id];
      setSavedAffirmations(updated);
      try {
        localStorage.setItem('sakhi_saved_affirmations', JSON.stringify(updated));
      } catch {
        // ignore
      }
      markGameDone('affirmation_saved', 5, 'Saved Affirmation 💗');
    }
  };

  const handleSpeakAffirmation = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      language === 'hi' ? currentAffirmation.hindiText : currentAffirmation.text
    );
    utterance.rate = 0.88;
    utterance.pitch = 1.1;
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    markGameDone('affirmation_spoken', 5, 'Listened to Daily Affirmation 🎙️');
  };

  const handleShareAffirmation = async () => {
    const textToShare = `${currentAffirmation.text}\n${currentAffirmation.hindiText}\n— From Sakhi Cycle 🌸`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sakhi Daily Affirmation 💗',
          text: textToShare,
        });
      } catch {
        // user cancel
      }
    } else {
      navigator.clipboard?.writeText(textToShare);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  // --- 2. MOOD MATCH STATE ---
  const [selectedMood, setSelectedMood] = useState<MoodType | null>('tired');
  const [moodActionDone, setMoodActionDone] = useState(false);

  const matchedMood = MOOD_CHOICES.find((m) => m.id === selectedMood);

  // --- 3. MEMORY BLOOM STATE ---
  const ICONS = ['🌸', '🦋', '💗', '🎀', '🌷', '✨'];
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const initMemoryGame = () => {
    const deck: MemoryCard[] = [];
    let idCounter = 0;
    const duplicated = [...ICONS, ...ICONS];
    // shuffle
    const shuffled = duplicated.sort(() => Math.random() - 0.5);
    shuffled.forEach((symbol) => {
      deck.push({
        id: idCounter++,
        symbol,
        isFlipped: false,
        isMatched: false,
      });
    });
    setCards(deck);
    setFlippedIndexes([]);
    setMatchesCount(0);
    setMemoryMoves(0);
  };

  useEffect(() => {
    if (activeTab === 'memory' && cards.length === 0) {
      initMemoryGame();
    }
  }, [activeTab]);

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].symbol === newCards[secondIdx].symbol) {
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setFlippedIndexes([]);
        setMatchesCount((c) => {
          const next = c + 1;
          if (next === ICONS.length) {
            markGameDone('memory_bloom', 15, 'Completed Memory Bloom 🌸');
          }
          return next;
        });
      } else {
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndexes([]);
        }, 800);
      }
    }
  };

  // --- 4. BUBBLE CALM STATE ---
  interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    popped: boolean;
  }
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bubblesPopped, setBubblesPopped] = useState(0);
  const [calmTimer, setCalmTimer] = useState(60);
  const [isCalmTimerActive, setIsCalmTimerActive] = useState(false);
  const [calmPhase, setCalmPhase] = useState<'Inhale 🌸' | 'Hold ✨' | 'Exhale 💗'>('Inhale 🌸');

  const generateBubbles = () => {
    const pastelColors = ['#FDE2E4', '#FFCAD4', '#B5E2FA', '#EDDCD2', '#F0E6EF', '#D8E2DC'];
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < 18; i++) {
      newBubbles.push({
        id: i,
        x: Math.floor(Math.random() * 85) + 5,
        y: Math.floor(Math.random() * 70) + 10,
        size: Math.floor(Math.random() * 26) + 38,
        color: pastelColors[i % pastelColors.length],
        popped: false,
      });
    }
    setBubbles(newBubbles);
  };

  useEffect(() => {
    if (activeTab === 'bubble' && bubbles.length === 0) {
      generateBubbles();
    }
  }, [activeTab]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalmTimerActive && calmTimer > 0) {
      interval = setInterval(() => {
        setCalmTimer((prev) => {
          const next = prev - 1;
          const cycle = next % 8;
          if (cycle >= 5) setCalmPhase('Inhale 🌸');
          else if (cycle >= 3) setCalmPhase('Hold ✨');
          else setCalmPhase('Exhale 💗');

          if (next <= 0) {
            setIsCalmTimerActive(false);
            markGameDone('bubble_calm_60s', 15, '60s Bubble Calm Breathing 🫧');
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCalmTimerActive, calmTimer]);

  const popBubble = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setBubblesPopped((p) => {
      const next = p + 1;
      if (next % 10 === 0) {
        markGameDone(`bubble_pop_${next}`, 5, `Popped ${next} Calm Bubbles 🫧`);
      }
      return next;
    });
  };

  // --- 5. SELF-CARE WHEEL STATE ---
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWheelItem, setSelectedWheelItem] = useState<typeof WHEEL_ITEMS[0] | null>(null);
  const [spinsToday, setSpinsToday] = useState(0);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedWheelItem(null);

    const randomIndex = Math.floor(Math.random() * WHEEL_ITEMS.length);
    const sliceDeg = 360 / WHEEL_ITEMS.length;
    // Calculate rotation ensuring multiple full spins + target segment
    const extraSpins = 360 * 5;
    const targetDeg = wheelRotation + extraSpins + (360 - randomIndex * sliceDeg);

    setWheelRotation(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = WHEEL_ITEMS[randomIndex];
      setSelectedWheelItem(chosen);
      setSpinsToday((s) => s + 1);
      if (spinsToday < 3) {
        markGameDone(`wheel_spin_${spinsToday}`, chosen.tokens, `Care Wheel: ${chosen.label} 🌷`);
      }
    }, 3200);
  };

  // --- 6. PERIOD MYTH OR FACT STATE ---
  const [mythIndex, setMythIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const currentMyth = MYTH_FACT_ITEMS[mythIndex];

  const handleAnswerMyth = (isMythSelected: boolean) => {
    setUserAnswer(isMythSelected);
    const isCorrect = isMythSelected === currentMyth.isMyth;
    if (isCorrect) {
      markGameDone(`myth_answered_${currentMyth.id}`, 5, 'Answered Period Fact/Myth 🎀');
    }
  };

  const handleNextMyth = () => {
    setUserAnswer(null);
    setMythIndex((prev) => (prev + 1) % MYTH_FACT_ITEMS.length);
  };

  // --- 7. DAILY CHALLENGE STATE ---
  const [challengeDoneMap, setChallengeDoneMap] = useState<Record<string, boolean>>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const s = localStorage.getItem(`sakhi_challenges_${today}`);
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  const handleToggleChallenge = (chalId: string, tokens: number, title: string) => {
    const isNowDone = !challengeDoneMap[chalId];
    const updated = { ...challengeDoneMap, [chalId]: isNowDone };
    setChallengeDoneMap(updated);
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`sakhi_challenges_${today}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (isNowDone) {
      earnTokens(tokens, `Completed: ${title} 🏆`, 'care', '✨');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Girly Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-pink-100 via-[#FFF0F5] to-rose-100 border border-pink-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-rose-700 text-xs font-bold border border-pink-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              <span>Sakhi Play 🎀 • A Tiny Happy Break for You</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1E29] tracking-tight">
              {language === 'hi' ? 'सखी प्ले — आपके लिए प्यार भरा विश्राम 🌸' : 'Cute Games, Affirmations & Calming Breaks 🌸'}
            </h1>
            <p className="text-xs sm:text-sm text-[#7A4B55]">
              {language === 'hi'
                ? 'छोटे-छोटे प्यारे खेल खेलें, माइंडफुलनेस अपनाएं और सखी टोकन अर्जित करें 💗'
                : 'Relax with soothing mini-games, positive affirmations, and gentle self-care rewards.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="px-4 py-2 rounded-2xl bg-white/90 border border-pink-200 text-center shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Today's Play</span>
              <span className="text-sm font-bold text-[#4A1E29]">
                {Object.keys(completedGames).length} Activities Done ✨
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Play Navigation Pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap p-1.5 max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-full border border-pink-200/90 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('affirmation')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'affirmation'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>💗</span>
          <span>Affirmation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mood')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'mood'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🧠</span>
          <span>Mood Match</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('memory')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'memory'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🌸</span>
          <span>Memory Bloom</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bubble')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'bubble'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🫧</span>
          <span>Bubble Calm</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wheel')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'wheel'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🌷</span>
          <span>Care Wheel</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('myth')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'myth'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🎀</span>
          <span>Myth or Fact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('challenge')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'challenge'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>✨</span>
          <span>Daily Challenge</span>
        </button>
      </div>

      {/* --- TAB 1: DAILY AFFIRMATION --- */}
      {activeTab === 'affirmation' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto space-y-6 text-center animate-in fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-rose-700 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Today's Sakhi Affirmation 🌷</span>
          </div>

          <div className="space-y-4 py-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4A1E29] leading-relaxed">
              "{currentAffirmation.text}"
            </h2>
            <p className="font-devanagari text-base sm:text-lg text-rose-800 leading-relaxed font-medium">
              "{currentAffirmation.hindiText}"
            </p>
            <span className="text-xs text-[#8A5A66] block">— {currentAffirmation.author}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
            <button
              type="button"
              onClick={handleSaveAffirmation}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                savedAffirmations.includes(currentAffirmation.id)
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-white hover:bg-pink-50 text-rose-700 border border-pink-200 shadow-2xs'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{savedAffirmations.includes(currentAffirmation.id) ? 'Saved 💗' : 'Save 💗'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextAffirmation}
              className="px-4 py-2 rounded-full text-xs font-bold bg-white hover:bg-pink-50 text-rose-700 border border-pink-200 shadow-2xs flex items-center gap-1.5 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>New Affirmation 🔄</span>
            </button>

            <button
              type="button"
              onClick={handleSpeakAffirmation}
              disabled={isSpeaking}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSpeaking
                  ? 'bg-pink-300 text-white'
                  : 'bg-white hover:bg-pink-50 text-rose-700 border border-pink-200 shadow-2xs'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>{isSpeaking ? 'Listening... 🎙️' : 'Hear It 🎙️'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareAffirmation}
              className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs hover:opacity-95 flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copyFeedback ? 'Copied! ✨' : 'Share ✨'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-pink-100 flex items-center justify-between text-xs text-[#8A5A66]">
            <span>Save or listen to earn +5 ✨ Sakhi Tokens</span>
            <span className="font-bold text-rose-600">Saved: {savedAffirmations.length}</span>
          </div>
        </div>
      )}

      {/* --- TAB 2: MOOD MATCH --- */}
      {activeTab === 'mood' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Emotional Check-In 🌸
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">
              How are you feeling right this moment, Sakhi?
            </h2>
            <p className="text-xs text-[#7A4B55]">
              Select your mood and receive a gentle, loving recommendation tailored for you.
            </p>
          </div>

          {/* Mood Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MOOD_CHOICES.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => {
                    setSelectedMood(mood.id);
                    setMoodActionDone(false);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-200 shadow-xs'
                      : 'bg-white/70 border-pink-100 hover:bg-pink-50/50'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="font-bold text-xs text-[#4A1E29]">{mood.label}</span>
                  <span className="font-devanagari text-[11px] text-[#8A5A66]">{mood.hindiLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Personalized Response Card */}
          {matchedMood && (
            <div className="bg-gradient-to-r from-pink-50 via-[#FFF5F8] to-rose-50 border border-pink-200 rounded-2xl p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  Didi's Note for You 🌷
                </span>
                <p className="font-serif text-base sm:text-lg font-bold text-[#4A1E29]">
                  "{language === 'hi' ? matchedMood.hindiResponse : matchedMood.response}"
                </p>
              </div>

              {/* Suggested Micro-Activity */}
              <div className="bg-white/90 rounded-xl p-4 border border-pink-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-pink-100">{matchedMood.actionIcon}</span>
                  <div className="text-left">
                    <span className="font-bold text-xs text-[#4A1E29] block">
                      {matchedMood.actionTitle}
                    </span>
                    <span className="text-xs text-[#7A4B55]">{matchedMood.actionDesc}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMoodActionDone(true);
                    markGameDone(`mood_${matchedMood.id}`, 5, `Completed ${matchedMood.actionTitle} 🌸`);
                  }}
                  disabled={moodActionDone}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    moodActionDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs hover:opacity-95'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{moodActionDone ? 'Completed (+5 ✨)' : 'Mark Done (+5 ✨)'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: MEMORY BLOOM --- */}
      {activeTab === 'memory' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 text-center animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Card Matching Game 🌸
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">Memory Bloom</h2>
            <p className="text-xs text-[#7A4B55]">
              Flip and match pairs of flowers, bows, butterflies and hearts.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#7A4B55]">
            <span>
              Moves: <strong className="text-[#4A1E29]">{memoryMoves}</strong>
            </span>
            <span>
              Matches: <strong className="text-rose-600">{matchesCount} / {ICONS.length}</strong>
            </span>
            <button
              type="button"
              onClick={initMemoryGame}
              className="text-xs text-rose-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Game</span>
            </button>
          </div>

          {/* Memory Card Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {cards.map((card, idx) => {
              const isRevealed = card.isFlipped || card.isMatched;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardClick(idx)}
                  className={`h-20 sm:h-24 rounded-2xl text-3xl flex items-center justify-center font-bold transition-all transform ${
                    isRevealed
                      ? 'bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-300 scale-100 shadow-2xs'
                      : 'bg-white hover:bg-pink-50 border-2 border-dashed border-pink-200 hover:scale-105 active:scale-95 shadow-xs'
                  }`}
                >
                  {isRevealed ? card.symbol : '🌸'}
                </button>
              );
            })}
          </div>

          {matchesCount === ICONS.length && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1.5 animate-in zoom-in">
              <span className="text-2xl">🎉</span>
              <h3 className="font-serif text-lg font-bold text-emerald-800">
                Blooming Sakhi! 🌸
              </h3>
              <p className="text-xs text-emerald-700">
                You matched all pairs in {memoryMoves} moves! +15 ✨ Sakhi Tokens awarded.
              </p>
              <button
                type="button"
                onClick={initMemoryGame}
                className="mt-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs"
              >
                Play Again 🔄
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 4: BUBBLE CALM --- */}
      {activeTab === 'bubble' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6 text-center animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Interactive Calm 🫧
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">Bubble Calm</h2>
            <p className="text-xs text-[#7A4B55]">
              Tap floating bubbles gently as you breathe in and out. Take your time, Sakhi.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-rose-700">
              Popped: {bubblesPopped} 🫧
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCalmTimerActive(!isCalmTimerActive);
                if (calmTimer === 0) setCalmTimer(60);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>
                {isCalmTimerActive
                  ? `Breathing... (${calmTimer}s)`
                  : 'Start 60s Breathing Mode 🧘'}
              </span>
            </button>

            <button
              type="button"
              onClick={generateBubbles}
              className="text-xs text-rose-700 font-bold hover:underline"
            >
              Refresh Bubbles 🔄
            </button>
          </div>

          {isCalmTimerActive && (
            <div className="py-2 text-center animate-pulse">
              <span className="font-serif text-xl font-bold text-rose-700">{calmPhase}</span>
              <p className="text-xs text-[#7A4B55] mt-0.5">Soften your shoulders and let tension melt.</p>
            </div>
          )}

          {/* Interactive Floating Bubbles Canvas Container */}
          <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-gradient-to-b from-[#FFF5F8] to-[#FCEEE9] border border-pink-200 overflow-hidden select-none">
            {bubbles.map((bubble) => {
              if (bubble.popped) return null;
              return (
                <button
                  key={bubble.id}
                  type="button"
                  onClick={() => popBubble(bubble.id)}
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    backgroundColor: bubble.color,
                  }}
                  className="absolute rounded-full border border-white/80 shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 hover:scale-125 active:scale-75 animate-bounce opacity-85 cursor-pointer"
                >
                  <span className="text-[11px] opacity-70">🫧</span>
                </button>
              );
            })}

            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none text-xs text-[#8A5A66]">
              "Take a breath, Sakhi. You're doing okay. 💗"
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 5: SELF-CARE WHEEL --- */}
      {activeTab === 'wheel' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 text-center animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Spin for Mindful Care 🌷
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">Self-Care Wheel</h2>
            <p className="text-xs text-[#7A4B55]">
              Give it a spin whenever you need a tiny healthy suggestion for your day.
            </p>
          </div>

          {/* Spinning Wheel Graphic Container */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Pointer Pin */}
            <div className="absolute -top-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-rose-600 filter drop-shadow-sm" />

            {/* Rotating Circle with Slices */}
            <div
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
              }}
              className="w-56 h-56 rounded-full border-4 border-white shadow-md relative overflow-hidden flex items-center justify-center bg-white"
            >
              {WHEEL_ITEMS.map((item, idx) => {
                const angle = (360 / WHEEL_ITEMS.length) * idx;
                return (
                  <div
                    key={item.id}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: 'center center',
                    }}
                    className="absolute inset-0 flex items-start justify-center pt-2 text-xs font-bold text-[#4A1E29]"
                  >
                    <span className="text-lg">{item.icon}</span>
                  </div>
                );
              })}

              {/* Center Hub */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 border-2 border-white shadow-inner flex items-center justify-center text-white text-xs font-bold z-10">
                Sakhi 🌸
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all inline-flex items-center gap-2"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning with Love... 🌸' : 'Spin the Wheel 🌷'}</span>
            </button>
            <span className="text-[11px] text-[#8A5A66] block mt-1.5">
              Spins today: {spinsToday} / 3 eligible for tokens
            </span>
          </div>

          {/* Selected Item Modal Card */}
          {selectedWheelItem && !isSpinning && (
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-5 text-left space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedWheelItem.icon}</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#4A1E29]">
                    {selectedWheelItem.label}
                  </h3>
                  <span className="font-devanagari text-xs text-rose-700">
                    {selectedWheelItem.hindiLabel}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#7A4B55] leading-relaxed">
                {selectedWheelItem.description}
              </p>
              <div className="pt-1 text-[11px] font-bold text-rose-600">
                ✨ +{selectedWheelItem.tokens} Sakhi Tokens Awarded!
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 6: PERIOD MYTH OR FACT --- */}
      {activeTab === 'myth' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 text-center animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Evidence-Based Learning 🎀
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">Period Myth or Fact?</h2>
            <p className="text-xs text-[#7A4B55]">
              Bust taboos with certified gynecological and public health facts.
            </p>
          </div>

          {/* Statement Card */}
          <div className="bg-gradient-to-tr from-pink-50 via-[#FFF9FA] to-rose-50 border border-pink-200 rounded-2xl p-6 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
              Statement {mythIndex + 1} of {MYTH_FACT_ITEMS.length}
            </span>
            <h3 className="font-serif text-xl font-bold text-[#4A1E29] leading-relaxed">
              "{currentMyth.statement}"
            </h3>
            <p className="font-devanagari text-sm text-rose-800">
              "{currentMyth.hindiStatement}"
            </p>
          </div>

          {/* Answer Buttons */}
          {userAnswer === null ? (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleAnswerMyth(true)}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-200 shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>❌ It's a Myth</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnswerMyth(false)}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-200 shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>✅ It's a Fact</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              {/* Feedback Alert */}
              <div
                className={`p-4 rounded-2xl border text-left space-y-2 ${
                  userAnswer === currentMyth.isMyth
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {userAnswer === currentMyth.isMyth ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Correct! It is {currentMyth.isMyth ? 'a Myth ❌' : 'a Fact ✅'}</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>Actually, it is {currentMyth.isMyth ? 'a Myth ❌' : 'a Fact ✅'}</span>
                    </>
                  )}
                </div>

                <p className="text-xs leading-relaxed">
                  {language === 'hi' ? currentMyth.hindiExplanation : currentMyth.explanation}
                </p>

                <span className="text-[10px] text-gray-500 block pt-1">
                  Verified by: {currentMyth.reference}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMyth}
                className="px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs hover:opacity-95 inline-flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 7: DAILY CHALLENGES --- */}
      {activeTab === 'challenge' && (
        <div className="bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 animate-in fade-in">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Daily Sakhi Challenges ✨
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#4A1E29]">Small Daily Wins</h2>
            <p className="text-xs text-[#7A4B55]">
              Tiny self-care commitments to show up for your mind and body today.
            </p>
          </div>

          <div className="space-y-3">
            {DAILY_CHALLENGES.map((chal) => {
              const isDone = Boolean(challengeDoneMap[chal.id]);
              return (
                <div
                  key={chal.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-50/80 border-emerald-200'
                      : 'bg-white/80 border-pink-200 hover:bg-pink-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-pink-100">{chal.icon}</span>
                    <div className="text-left">
                      <span className="font-bold text-xs text-[#4A1E29] block">
                        {language === 'hi' ? chal.hindiTitle : chal.title}
                      </span>
                      <span className="text-xs text-[#7A4B55]">{chal.description}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleChallenge(chal.id, chal.tokens, chal.title)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white hover:bg-pink-100 text-rose-700 border border-pink-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Done (+10 ✨)' : 'Tap to Complete'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center text-xs text-[#8A5A66]">
            Every challenge completed adds to your Care Streak and awards Sakhi Tokens 💗
          </div>
        </div>
      )}
    </div>
  );
};
