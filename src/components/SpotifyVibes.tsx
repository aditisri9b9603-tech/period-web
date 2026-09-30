import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { Music, Sparkles, Heart, Headphones, Play } from 'lucide-react';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  mood: string;
  spotifyUri: string;
  embedSrc: string;
  badge: string;
}

export const SpotifyVibes: React.FC = () => {
  const { t } = useTranslation();

  const playlists: SpotifyPlaylist[] = [
    {
      id: 'pl1',
      name: 'PMS Relief & Cozy Lo-Fi Vibes',
      description: 'Gentle, comforting beats with soft vinyl crackles and mellow piano chords to soothe menstrual mood shifts.',
      mood: 'Soothing & Grounding',
      spotifyUri: 'spotify:playlist:37i9dQZF1DX8Uebhn9wzrS',
      embedSrc: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
      badge: 'Most Popular',
    },
    {
      id: 'pl2',
      name: 'Deep Sleep & Healing Frequencies (528 Hz)',
      description: 'Dreamy ambient delta waves and soft rain sounds designed to quiet racing thoughts and induce restful restorative sleep.',
      mood: 'Deep Sleep & Healing',
      spotifyUri: 'spotify:playlist:37i9dQZF1DWZd79rJ6a7lp',
      embedSrc: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp?utm_source=generator&theme=0',
      badge: 'Night Comfort',
    },
    {
      id: 'pl3',
      name: 'Peaceful Acoustic & Warm Chai Mornings',
      description: 'Delicate acoustic guitar fingerpicking and warm indie folk for slow, mindful tea-sipping mornings.',
      mood: 'Peaceful & Gentle',
      spotifyUri: 'spotify:playlist:37i9dQZF1DX4E3UdUs7fUx',
      embedSrc: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4E3UdUs7fUx?utm_source=generator&theme=0',
      badge: 'Follicular Energy',
    },
    {
      id: 'pl4',
      name: 'Goddess Bloom & Radiant Motivation',
      description: 'Empowering, uplifting female vocals and rhythmic pop to celebrate your radiant ovulatory peak.',
      mood: 'Radiant & Joyful',
      spotifyUri: 'spotify:playlist:37i9dQZF1DX3rxVfibe1L0',
      embedSrc: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0?utm_source=generator&theme=0',
      badge: 'Peak Energy',
    },
  ];

  const [activePlaylist, setActivePlaylist] = useState<SpotifyPlaylist>(playlists[0]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#A63A50] border border-[#FAD2D8] text-xs font-semibold">
          <Headphones className="w-3.5 h-3.5 text-[#C04D68]" />
          <span>Spotify Menstrual Wellness Soundscapes</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.vibesTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">{t.vibesSub}</p>
      </div>

      {/* Main Spotify Interactive Embed Player */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#4A1E29]">{activePlaylist.name}</h3>
              <p className="text-xs text-[#7A4B55]">{activePlaylist.description}</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {activePlaylist.mood}
          </span>
        </div>

        {/* Embedded Player */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-200">
          <iframe
            src={activePlaylist.embedSrc}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist Embed"
            className="w-full rounded-2xl"
          />
        </div>
      </div>

      {/* Playlist Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {playlists.map((pl) => {
          const isSelected = activePlaylist.id === pl.id;
          return (
            <button
              key={pl.id}
              type="button"
              onClick={() => setActivePlaylist(pl)}
              className={`p-5 rounded-3xl border text-left transition-all flex flex-col justify-between space-y-3 bg-white/70 backdrop-blur-sm ${
                isSelected
                  ? 'border-[#1DB954] ring-2 ring-emerald-200 bg-emerald-50/30 shadow-xs'
                  : 'border-[#F4DFE2] hover:border-pink-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-[#8A1E38] bg-pink-100/70 px-2.5 py-0.5 rounded-full">
                  {pl.mood}
                </span>
                <span className="text-[10px] text-[#1DB954] font-bold uppercase tracking-wider">
                  Spotify
                </span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#4A1E29]">{pl.name}</h4>
              <p className="text-xs text-[#6A3945] leading-relaxed">{pl.description}</p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#1DB954]">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSelected ? 'Loaded in player above' : 'Switch to this playlist'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
