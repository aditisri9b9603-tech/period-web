import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { Play, Sparkles, ExternalLink, ShieldCheck, Heart, Info, CheckCircle2 } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  highlights: string[];
  youtubeVideoId: string;
  tutorialTitle: string;
  icon: string;
}

export const ProductsTutorials: React.FC = () => {
  const { t } = useTranslation();
  const [activeVideoId, setActiveVideoId] = useState<string>('q1xQx796g18');

  const products: ProductItem[] = [
    {
      id: 'cup',
      name: 'Ultra-Soft Medical Grade Menstrual Cup',
      category: 'Sustainable Flow Care',
      description: '100% hypoallergenic medical silicone, 12-hour leak-free protection, zero plastic waste, and comfortable wear.',
      badge: 'Bestseller • Reusable 5+ Years',
      highlights: ['Zero rash or dryness', '12 hours uninterrupted protection', 'Safe for swimming & yoga'],
      youtubeVideoId: 'q1xQx796g18',
      tutorialTitle: 'How to Fold & Insert a Menstrual Cup Easily for Beginners',
      icon: '🌸',
    },
    {
      id: 'pads',
      name: 'Organic Bamboo & Cotton Day & Night Pads',
      category: 'Gentle Protection',
      description: 'Pure chemical-free organic cotton top sheet with breathable bamboo fiber core. No synthetic fragrances or chlorine bleaching.',
      badge: '100% Biodegradable',
      highlights: ['Ultra-thin with high absorbency', 'Hypoallergenic & anti-chafing', 'Comes in discreet biodegradable wrappers'],
      youtubeVideoId: 'QZJ6M6V2bKk',
      tutorialTitle: 'Choosing the Right Pad & Preventing Leaks Comfortably',
      icon: '🌿',
    },
    {
      id: 'rollon',
      name: 'Ayurvedic Cramp Soothing Herbal Roll-On',
      category: 'Pain Relief & Muscle Ease',
      description: 'Infused with cooling peppermint, wintergreen, eucalyptus, and lavender essentials oils for instant topical cramp relief.',
      badge: 'Fast Acting • 100% Natural',
      highlights: ['Non-greasy roll-on applicator', 'Fast transdermal absorption', 'Calms uterine spasms without pills'],
      youtubeVideoId: 'U_Yw0CjI854',
      tutorialTitle: 'Where and How to Apply Cramp Relief Essential Oil Roll-On',
      icon: '🌱',
    },
    {
      id: 'heatpatch',
      name: 'Air-Activated Herbal Heat Patches',
      category: 'Comfort & Warmth',
      description: 'Self-heating adhesive patches providing 8 continuous hours of gentle 40°C thermal therapy to loosen tight lower belly muscles.',
      badge: '8 Hours Warmth',
      highlights: ['Ultra-thin and invisible under clothes', 'Air activated within 5 minutes', 'Natural mineral & iron heating core'],
      youtubeVideoId: 'b7VnE59W_98',
      tutorialTitle: 'How to Wear Heat Patches for Pelvic & Lower Back Ache',
      icon: '🔥',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#A63A50] border border-[#FAD2D8] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C04D68]" />
          <span>Body-Kind Period Care & Tutorials</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.productsTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">{t.productsSub}</p>
      </div>

      {/* Main Active YouTube Tutorial Player */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#4A1E29] flex items-center gap-2">
            <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Interactive Video Tutorial</span>
          </h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            Verified Educational Guide
          </span>
        </div>

        {/* Video Iframe Container */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-neutral-900 border border-black/10">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
            title="Sakhi Cycle Video Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-[#7A4B55] italic text-center">
          Tap on any product guide below to switch the video player tutorial.
        </p>
      </div>

      {/* Curated Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((item) => {
          const isSelected = activeVideoId === item.youtubeVideoId;
          return (
            <div
              key={item.id}
              className={`rounded-3xl p-6 border shadow-sm transition-all flex flex-col justify-between space-y-4 bg-white/80 backdrop-blur-md ${
                isSelected
                  ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/40'
                  : 'border-[#F4DFE2] hover:border-pink-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A63A50] block">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#4A1E29] leading-tight">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200 flex-shrink-0">
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-[#6A3945] leading-relaxed">{item.description}</p>

                <div className="pt-2 border-t border-pink-100/80 space-y-1.5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#522932]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Watch Trigger */}
              <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveVideoId(item.youtubeVideoId);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSelected ? 'Now Playing Above' : 'Watch How to Use'}</span>
                </button>

                <span className="text-[11px] text-[#A66F7B]">Doctor approved</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
