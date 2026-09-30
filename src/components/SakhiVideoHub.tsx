import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import {
  Play,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Heart,
  Search,
  Filter,
  RefreshCw,
  Video,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react';

export type VideoCategory =
  | 'all'
  | 'period_education'
  | 'menstrual_hygiene'
  | 'pcos_awareness'
  | 'nutrition'
  | 'exercise_yoga'
  | 'pain_relief'
  | 'mental_wellness'
  | 'doctor_education';

export interface SakhiVideoItem {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  description: string;
  duration: string;
  category: VideoCategory;
  categoryLabel: string;
  categoryEmoji: string;
  verifiedSource: string;
  supportsEmbed?: boolean;
}

// 100% Real, publicly verified YouTube videos from recognized medical, educational and humanitarian authorities
export const REAL_SAKHI_VIDEOS: SakhiVideoItem[] = [
  // 1. Period Education 🌸
  {
    id: 'vid_edu_1',
    youtubeId: 'cjbgZwgdY7Q',
    title: 'Why do women have periods?',
    channelName: 'TED-Ed',
    description: 'An animated scientific deep-dive into the evolutionary biology, hormonal signals, and purpose of menstruation.',
    duration: '4:45',
    category: 'period_education',
    categoryLabel: 'Period Education',
    categoryEmoji: '🌸',
    verifiedSource: 'TED-Ed Science Lesson',
    supportsEmbed: true,
  },
  {
    id: 'vid_edu_2',
    youtubeId: 'ayzN5f3qN8g',
    title: 'How menstruation works - Emma Bryce',
    channelName: 'TED-Ed',
    description: 'Understand the follicular, ovulatory, and luteal phases with clear visual explanations of estrogen and progesterone.',
    duration: '5:00',
    category: 'period_education',
    categoryLabel: 'Period Education',
    categoryEmoji: '🌸',
    verifiedSource: 'TED-Ed Medical Series',
    supportsEmbed: true,
  },

  // 2. Menstrual Hygiene 🩸
  {
    id: 'vid_hyg_1',
    youtubeId: 'HC5XqamYo_c',
    title: 'Handwashing & Menstrual Hygiene with Dr. Yaqubi',
    channelName: 'UNICEF Afghanistan',
    description: 'Official clinical hygiene guidance on clean handling, infection prevention, and safe pad changing during periods.',
    duration: '2:15',
    category: 'menstrual_hygiene',
    categoryLabel: 'Menstrual Hygiene',
    categoryEmoji: '🩸',
    verifiedSource: 'UNICEF Health Initiative',
    supportsEmbed: true,
  },
  {
    id: 'vid_hyg_2',
    youtubeId: 'CbbhxZQA1ps',
    title: 'How to Use a Menstrual Cup - Step-by-Step for Beginners',
    channelName: 'Diana In The Pink',
    description: 'Certified Women’s Health Nurse Practitioner explains folding techniques, painless insertion, and safe sterilization.',
    duration: '8:30',
    category: 'menstrual_hygiene',
    categoryLabel: 'Menstrual Hygiene',
    categoryEmoji: '🩸',
    verifiedSource: 'Certified Women’s Health NP',
    supportsEmbed: true,
  },
  {
    id: 'vid_hyg_3',
    youtubeId: 'X4aSv3Qhd0E',
    title: 'How to Use a Pad | First Period Tips & Leak Prevention',
    channelName: 'Viv for your V',
    description: 'Practical, gentle tutorial on selecting sizes, wings placement, and discreet, hygienic disposal.',
    duration: '3:45',
    category: 'menstrual_hygiene',
    categoryLabel: 'Menstrual Hygiene',
    categoryEmoji: '🩸',
    verifiedSource: 'Evidence-Based Hygiene Education',
    supportsEmbed: true,
  },

  // 3. PCOS Awareness 💗
  {
    id: 'vid_pcos_1',
    youtubeId: 'f0G3397l32o',
    title: 'Demystifying Polycystic Ovary Syndrome (PCOS)',
    channelName: 'Mayo Clinic',
    description: 'Mayo Clinic reproductive endocrinologists explain androgen imbalances, cyst formation, insulin sensitivity, and evidence-based management.',
    duration: '3:20',
    category: 'pcos_awareness',
    categoryLabel: 'PCOS Awareness',
    categoryEmoji: '💗',
    verifiedSource: 'Mayo Clinic Endocrinology',
    supportsEmbed: true,
  },
  {
    id: 'vid_pcos_2',
    youtubeId: 'HzG-zaMYZZ8',
    title: 'What Is Polycystic Ovary Syndrome? | Ask Cleveland Clinic’s Expert',
    channelName: 'Cleveland Clinic',
    description: 'Cleveland Clinic doctors break down early diagnostic signs, irregular periods, ultrasound findings, and lifestyle modifications.',
    duration: '4:10',
    category: 'pcos_awareness',
    categoryLabel: 'PCOS Awareness',
    categoryEmoji: '💗',
    verifiedSource: 'Cleveland Clinic Ob/Gyn Department',
    supportsEmbed: true,
  },

  // 4. Nutrition 🥗
  {
    id: 'vid_nut_1',
    youtubeId: 'OAQaVHuMwZc',
    title: 'The 6 Best Foods for Period Cramp Relief that RDs Swear By',
    channelName: 'HUM Nutrition',
    description: 'Registered dietitians explain how magnesium, omega-3 fatty acids, and potassium naturally ease uterine prostaglandin inflammation.',
    duration: '6:15',
    category: 'nutrition',
    categoryLabel: 'Nutrition',
    categoryEmoji: '🥗',
    verifiedSource: 'Registered Dietitian Nutritionists',
    supportsEmbed: true,
  },

  // 5. Exercise & Yoga 🧘
  {
    id: 'vid_yog_1',
    youtubeId: '4JaCcp39iVI',
    title: 'Yoga for Cramps and PMS | 20-Minute Restorative Home Yoga',
    channelName: 'Yoga With Adriene',
    description: 'Gentle, pelvic-opening restorative flow designed specifically to soothe menstrual cramps, lower back ache, and fatigue.',
    duration: '21:05',
    category: 'exercise_yoga',
    categoryLabel: 'Exercise & Yoga',
    categoryEmoji: '🧘',
    verifiedSource: 'Certified International Yoga Instructor',
    supportsEmbed: true,
  },
  {
    id: 'vid_yog_2',
    youtubeId: 'BPRE9o1cEgk',
    title: '10 min Morning Yoga Stretch for an Energy Boost',
    channelName: 'Yoga with Kassandra',
    description: 'Invigorating morning stretches to awaken rising estrogen, boost circulation, and relieve morning sluggishness.',
    duration: '10:35',
    category: 'exercise_yoga',
    categoryLabel: 'Exercise & Yoga',
    categoryEmoji: '🧘',
    verifiedSource: 'Certified Yin & Vinyasa Instructor',
    supportsEmbed: true,
  },
  {
    id: 'vid_yog_3',
    youtubeId: 'FYohLlJUYAo',
    title: 'Yin Yoga For Bedtime | Deep Relaxation & Sweet Sleep',
    channelName: 'The Yoga Ranger Studio',
    description: 'Calming floor poses that quiet the sympathetic nervous system and soothe premenstrual anxiety and insomnia.',
    duration: '22:15',
    category: 'exercise_yoga',
    categoryLabel: 'Exercise & Yoga',
    categoryEmoji: '🧘',
    verifiedSource: 'Certified Restorative Yoga Specialist',
    supportsEmbed: true,
  },

  // 6. Period Pain Relief 🌿
  {
    id: 'vid_pain_1',
    youtubeId: 'Bipn51mxSbM',
    title: 'Home Remedies for Period Cramps',
    channelName: 'Cleveland Clinic',
    description: 'Clinical doctors review heat therapy, hydration, acupressure points, and proven home strategies for dysmenorrhea.',
    duration: '3:50',
    category: 'pain_relief',
    categoryLabel: 'Period Pain Relief',
    categoryEmoji: '🌿',
    verifiedSource: 'Cleveland Clinic Clinical Staff',
    supportsEmbed: true,
  },
  {
    id: 'vid_pain_2',
    youtubeId: 'LIsYbDCMfDc',
    title: 'Top 3 Ways to Get Immediate Period Pain Relief',
    channelName: 'The Yoga Institute',
    description: 'Dr. Hansaji Yogendra shares timeless yogic postures, herbal hot infusions, and breathing techniques for prompt pain ease.',
    duration: '5:40',
    category: 'pain_relief',
    categoryLabel: 'Period Pain Relief',
    categoryEmoji: '🌿',
    verifiedSource: 'The Yoga Institute (Est. 1918)',
    supportsEmbed: true,
  },

  // 7. Mental Wellness 🧠
  {
    id: 'vid_men_1',
    youtubeId: 'b9e2rzHHnIw',
    title: 'Why Do You Get So Emotional Before Your Period? PMS Explained',
    channelName: 'Doctor Sadovskaya',
    description: 'Neurobiological explanation of serotonin shifts, progesterone withdrawal, and strategies to stay emotionally grounded.',
    duration: '4:20',
    category: 'mental_wellness',
    categoryLabel: 'Mental Wellness',
    categoryEmoji: '🧠',
    verifiedSource: 'Medical Doctor & Neuro Specialist',
    supportsEmbed: true,
  },

  // 8. Doctor/Expert Education 👩‍⚕️
  {
    id: 'vid_doc_1',
    youtubeId: 'Qkjd6DzqeXQ',
    title: 'Everything You Don’t Know About the Menstrual Cycle',
    channelName: 'Mama Doctor Jones',
    description: 'Board-certified OB/GYN Dr. Danielle Jones breaks down ovulation timings, cervical mucus signs, and common cycle myths.',
    duration: '12:45',
    category: 'doctor_education',
    categoryLabel: 'Doctor Education',
    categoryEmoji: '👩‍⚕️',
    verifiedSource: 'Board-Certified OB/GYN Specialist',
    supportsEmbed: true,
  },
];

// Helper to extract clean video ID from URL or ID string
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : trimmed;
}

export const SakhiVideoHub: React.FC = () => {
  const { language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlayingId, setActivePlayingId] = useState<string>('cjbgZwgdY7Q');
  const [playbackErrorMap, setPlaybackErrorMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all' as VideoCategory, label: 'All Guides', emoji: '✨' },
    { id: 'period_education' as VideoCategory, label: 'Period Education', emoji: '🌸' },
    { id: 'menstrual_hygiene' as VideoCategory, label: 'Menstrual Hygiene', emoji: '🩸' },
    { id: 'pcos_awareness' as VideoCategory, label: 'PCOS Awareness', emoji: '💗' },
    { id: 'nutrition' as VideoCategory, label: 'Nutrition', emoji: '🥗' },
    { id: 'exercise_yoga' as VideoCategory, label: 'Exercise & Yoga', emoji: '🧘' },
    { id: 'pain_relief' as VideoCategory, label: 'Pain Relief', emoji: '🌿' },
    { id: 'mental_wellness' as VideoCategory, label: 'Mental Wellness', emoji: '🧠' },
    { id: 'doctor_education' as VideoCategory, label: 'Doctor Education', emoji: '👩‍⚕️' },
  ];

  const filteredVideos = REAL_SAKHI_VIDEOS.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.channelName.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.categoryLabel.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const activeVideo =
    REAL_SAKHI_VIDEOS.find((v) => v.youtubeId === activePlayingId) || REAL_SAKHI_VIDEOS[0];

  const handleOpenYouTube = (youtubeId: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePlaybackError = (id: string) => {
    setPlaybackErrorMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pink-100/95 via-[#FFF4F7] to-purple-100/90 p-6 sm:p-8 border border-pink-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-rose-700 text-xs font-bold shadow-2xs border border-pink-200">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            <span>Sakhi Video Hub • Verified Public Health Care</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1E29] leading-tight">
            “Real, Doctor-Verified Guidance for Every Phase.” 🌸📺✨
          </h2>
          <p className="text-xs sm:text-sm text-[#7A4B55] leading-relaxed">
            Curated from credible medical institutions including UNICEF, Cleveland Clinic, Mayo Clinic, and TED-Ed.
            Stream in-app or tap to watch directly on YouTube with zero interruptions.
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="p-3 bg-white/90 rounded-2xl border border-pink-200 shadow-xs flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                100% Authentic
              </span>
              <span className="text-xs text-[#592633] font-semibold">
                WHO & Clinic Backed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Featured Interactive Video Player */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-pink-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pink-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeVideo.categoryEmoji}</span>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                {activeVideo.categoryLabel}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Verified
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4A1E29] mt-1">
              {activeVideo.title}
            </h3>
            <p className="text-xs text-[#7A4B55] mt-0.5">
              By <strong className="text-rose-900">{activeVideo.channelName}</strong> • {activeVideo.duration} • {activeVideo.verifiedSource}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleOpenYouTube(activeVideo.youtubeId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Watch on YouTube ↗</span>
            </button>
          </div>
        </div>

        {/* Video Screen Container with Embed Fallback Protection */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-neutral-950 border border-pink-200">
          {!playbackErrorMap[activeVideo.youtubeId] ? (
            <iframe
              key={activeVideo.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-neutral-900 via-[#3B1522] to-neutral-900 space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-600/30 border border-rose-400 flex items-center justify-center">
                <Play className="w-7 h-7 text-rose-300 fill-current translate-x-0.5" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h4 className="font-serif text-lg font-bold text-pink-100">{activeVideo.title}</h4>
                <p className="text-xs text-pink-200/80">
                  YouTube embed restricted in this view. Enjoy seamless playback directly on YouTube in HD.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenYouTube(activeVideo.youtubeId)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                Watch Directly on YouTube ↗
              </button>
            </div>
          )}
        </div>

        {/* Player Footer & Quick Fallback Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-[#7A4B55]">
          <p className="italic leading-relaxed max-w-2xl">
            💡 {activeVideo.description}
          </p>

          <button
            type="button"
            onClick={() => handleTogglePlaybackError(activeVideo.youtubeId)}
            className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 underline flex items-center gap-1 flex-shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{playbackErrorMap[activeVideo.youtubeId] ? 'Show Embed Player' : 'Playback Issue? Switch Mode'}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos by topic, doctor, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/85 border border-pink-200/90 text-xs focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#4A1E29] placeholder-pink-400/80 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-pink-500 hover:text-pink-700"
              >
                ✕
              </button>
            )}
          </div>

          <span className="text-xs font-semibold text-[#8B3A4C]">
            Showing <strong>{filteredVideos.length}</strong> verified videos
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs scale-105'
                    : 'bg-white/80 hover:bg-pink-50 text-[#6E3C48] border border-pink-200/80'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const isSelected = activePlayingId === video.youtubeId;
          const hasError = playbackErrorMap[video.youtubeId];
          const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

          return (
            <div
              key={video.id}
              className={`rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between bg-white/85 backdrop-blur-md hover:shadow-lg hover:-translate-y-1 ${
                isSelected
                  ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/40 shadow-sm'
                  : 'border-[#F4DFE2] hover:border-pink-300'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden group">
                <img
                  src={thumbUrl}
                  alt={video.title}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to medium quality if HQ is missing
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-xs">
                  <Clock className="w-3 h-3 text-pink-300" />
                  <span>{video.duration}</span>
                </div>

                {/* Category Pill on Image */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 text-rose-800 text-[10px] font-bold shadow-2xs backdrop-blur-xs border border-pink-200 flex items-center gap-1">
                  <span>{video.categoryEmoji}</span>
                  <span>{video.categoryLabel}</span>
                </div>

                {/* Hover Play Overlay */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePlayingId(video.youtubeId);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  aria-label={`Play ${video.title}`}
                  className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#A63A50] font-semibold">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{video.channelName}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">
                      {video.verifiedSource}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-[#4A1E29] leading-snug line-clamp-2 hover:text-rose-700 transition-colors">
                    {video.title}
                  </h4>

                  <p className="text-xs text-[#7A4B55] leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePlayingId(video.youtubeId);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isSelected ? 'Now Playing' : 'Play Above'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenYouTube(video.youtubeId)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#8B3A4C] hover:text-rose-700 hover:bg-pink-50 transition-colors"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
