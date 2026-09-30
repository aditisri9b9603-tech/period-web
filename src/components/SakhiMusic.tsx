import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { Music, Sparkles, Heart, ExternalLink, Headphones, Moon, Activity, Flame, Smile, Play } from 'lucide-react';

export interface MusicCategory {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  spotifyWebUrl: string;
  spotifyAppUri: string;
  embedUrl: string;
  color: string;
  bgGradient: string;
  tracksCount: string;
  vibePills: string[];
}

export const SakhiMusic: React.FC = () => {
  const { t } = useTranslation();

  const musicCategories: MusicCategory[] = [
    {
      id: 'period-relaxation',
      name: 'Period Relaxation',
      emoji: '🌸',
      tagline: 'Gentle warmth & soothing uterine comfort',
      description: 'Slow acoustic melodies, gentle warm rain sounds, and soft harp strums to calm cramp discomfort and quiet tension.',
      spotifyWebUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS',
      spotifyAppUri: 'spotify:playlist:37i9dQZF1DX8Uebhn9wzrS',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
      color: 'border-pink-300 text-rose-800',
      bgGradient: 'from-pink-100/80 via-[#FFF5F8] to-purple-50',
      tracksCount: '60 soothing tracks',
      vibePills: ['Cramp Soothing', 'Acoustic Calm', 'Cozy Warmth'],
    },
    {
      id: 'calm-sleep',
      name: 'Calm & Deep Sleep',
      emoji: '🌙',
      tagline: '528 Hz delta waves & dreamy soundscapes',
      description: 'Restorative nighttime frequencies crafted to melt away late-night overthinking, restless legs, and PMS insomnia.',
      spotifyWebUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp',
      spotifyAppUri: 'spotify:playlist:37i9dQZF1DWZd79rJ6a7lp',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp?utm_source=generator&theme=0',
      color: 'border-purple-300 text-purple-900',
      bgGradient: 'from-purple-100/80 via-[#FAF5FF] to-indigo-50',
      tracksCount: '75 sleep tracks',
      vibePills: ['Deep Sleep', '528 Hz Healing', 'Insomnia Relief'],
    },
    {
      id: 'focus-flow',
      name: 'Focus & Quiet Clarity',
      emoji: '🎧',
      tagline: 'Gentle lo-fi beats for studying & creative work',
      description: 'Non-intrusive mellow lo-fi beats and soft vinyl rhythms to keep you centered and productive during brain fog hours.',
      spotifyWebUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4t95PaoR1To',
      spotifyAppUri: 'spotify:playlist:37i9dQZF1DX4t95PaoR1To',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4t95PaoR1To?utm_source=generator&theme=0',
      color: 'border-amber-300 text-amber-900',
      bgGradient: 'from-amber-100/80 via-[#FFFBF5] to-orange-50',
      tracksCount: '100 chill tracks',
      vibePills: ['Study Lo-Fi', 'Gentle Flow', 'Anti-Brainfog'],
    },
    {
      id: 'workout-energy',
      name: 'Workout & High Energy',
      emoji: '🏃‍♀️',
      tagline: 'High-tempo rhythm for your ovulatory power',
      description: 'Upbeat pop, energizing beats, and rhythmic female power anthems to match your peak follicular and ovulatory radiance.',
      spotifyWebUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
      spotifyAppUri: 'spotify:playlist:37i9dQZF1DX76Wlfdnj7AP',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator&theme=0',
      color: 'border-rose-400 text-rose-900',
      bgGradient: 'from-rose-100/80 via-[#FFF1F2] to-pink-50',
      tracksCount: '80 high-energy bops',
      vibePills: ['Ovulatory Peak', 'Pilates & Cardio', 'Goddess Energy'],
    },
    {
      id: 'mood-boost',
      name: 'Mood Boost & Joy',
      emoji: '🦋',
      tagline: 'Feel-good sunshine indie & dopamine blooms',
      description: 'Warm acoustic indie pop, feel-good female harmonies, and joyful tunes to lift heavy spirits during luteal mood drops.',
      spotifyWebUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0',
      spotifyAppUri: 'spotify:playlist:37i9dQZF1DX3rxVfibe1L0',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0?utm_source=generator&theme=0',
      color: 'border-emerald-300 text-emerald-900',
      bgGradient: 'from-emerald-100/80 via-[#F0FDF4] to-teal-50',
      tracksCount: '90 joyful tunes',
      vibePills: ['Instant Smile', 'PMS Pick-me-up', 'Warm Hug'],
    },
  ];

  const [activeCategory, setActiveCategory] = useState<MusicCategory>(musicCategories[0]);

  const handleOpenSpotify = (category: MusicCategory) => {
    window.open(category.spotifyWebUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-rose-800 border border-pink-200 text-xs font-semibold">
          <Music className="w-3.5 h-3.5 text-pink-600" />
          <span>🎵 Sakhi Music Sanctuary</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">Curated Soundscapes for Your Cycle</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">
          Music tailored for comfort, deep sleep, focus, endorphins, and emotional warmth.
        </p>
      </div>

      {/* Main Active Player with Prominent "Open in Spotify" Button */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="text-3xl p-3 rounded-2xl bg-pink-50 border border-pink-200 shadow-2xs">
              {activeCategory.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1E29]">
                  {activeCategory.name}
                </h3>
                <span className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-0.5 rounded-full">
                  Spotify Verified
                </span>
              </div>
              <p className="text-xs text-[#7A4B55] mt-0.5">{activeCategory.tagline}</p>
            </div>
          </div>

          {/* Prominent "Open in Spotify" Button */}
          <button
            type="button"
            onClick={() => handleOpenSpotify(activeCategory)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#1DB954] hover:bg-[#1AA34A] text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex-shrink-0"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.306c-.215.353-.674.466-1.026.25-2.812-1.718-6.353-2.107-10.524-1.155-.403.092-.806-.16-.898-.564-.092-.403.16-.806.564-.898 4.568-1.044 8.484-.597 11.634 1.341.353.216.466.674.25 1.026zm1.468-3.26c-.27.44-.848.58-1.288.31-3.218-1.978-8.125-2.55-11.93-1.394-.495.15-1.02-.132-1.17-.627-.15-.495.132-1.02.627-1.17 4.356-1.322 9.774-.683 13.45 1.578.44.27.58.848.311 1.303zm.126-3.41c-3.858-2.29-10.223-2.502-13.88-1.391-.59.18-1.218-.16-1.397-.751-.18-.59.16-1.218.751-1.397 4.215-1.28 11.248-1.034 15.688 1.6c.53.314.704 1.002.39 1.532-.314.53-1.002.704-1.552.407z" />
            </svg>
            <span>Open in Spotify ↗</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#522932] leading-relaxed">
          {activeCategory.description}
        </p>

        {/* Embedded Interactive Spotify Player Widget */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-200">
          <iframe
            src={activeCategory.embedUrl}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={`${activeCategory.name} Spotify Player`}
            className="w-full rounded-2xl"
          />
        </div>
      </div>

      {/* Music Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {musicCategories.map((cat) => {
          const isSelected = activeCategory.id === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              role="button"
              tabIndex={0}
              className={`rounded-3xl p-5 border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 bg-gradient-to-b ${cat.bgGradient} ${
                isSelected
                  ? 'ring-2 ring-pink-400 shadow-md scale-[1.01]'
                  : 'hover:border-pink-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-[10px] font-bold text-neutral-600 bg-white/80 px-2 py-0.5 rounded-full border border-black/5">
                    {cat.tracksCount}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#4A1E29] leading-tight">
                  {cat.name}
                </h4>
                <p className="text-xs text-[#6A3945] leading-relaxed">{cat.tagline}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {cat.vibePills.map((v, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white/70 text-[#7A1E34]"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-black/5">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSelected ? 'Loaded in player' : 'Listen Now'}</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenSpotify(cat);
                  }}
                  className="text-[11px] font-bold text-[#1DB954] hover:underline flex items-center gap-1"
                >
                  <span>Spotify ↗</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
