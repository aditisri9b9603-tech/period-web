import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { CyclePhase } from '../types/cycle';
import { Play, Sparkles, Utensils, Heart, Activity, Check, ExternalLink } from 'lucide-react';

interface YogaSession {
  phase: CyclePhase;
  title: string;
  duration: string;
  instructor: string;
  youtubeId: string;
  poses: string[];
  focusBenefit: string;
}

export const YogaDiet: React.FC = () => {
  const { t, language } = useTranslation();
  const [activeVideoId, setActiveVideoId] = useState<string>('4JaCcp39iVI');

  const yogaSessions: YogaSession[] = [
    {
      phase: 'menstrual',
      title: 'Gentle Restorative Yoga for Period Cramps & Lower Back Relief',
      duration: '21 mins',
      instructor: 'Yoga With Adriene',
      youtubeId: '4JaCcp39iVI',
      poses: ['Balasana (Child’s Pose)', 'Supta Baddha Konasana (Reclined Butterfly)', 'Apanasana (Knees to Chest)'],
      focusBenefit: 'Releases deep pelvic congestion, reduces prostaglandins, and relaxes uterine wall tension.',
    },
    {
      phase: 'follicular',
      title: 'Energizing Morning Yoga Stretch & Hormone Awakening Flow',
      duration: '10 mins',
      instructor: 'Yoga with Kassandra',
      youtubeId: 'BPRE9o1cEgk',
      poses: ['Surya Namaskar (Sun Salutations)', 'Warrior II', 'Cobra Pose (Bhujangasana)'],
      focusBenefit: 'Stimulates lymphatic drainage, boosts rising estrogen, and elevates morning mood.',
    },
    {
      phase: 'ovulatory',
      title: 'Radiant Vitality & Movement Energy Practice',
      duration: '18 mins',
      instructor: 'Yoga With Adriene',
      youtubeId: 'F47hdaNXwT4',
      poses: ['Utkatasana (Chair Pose)', 'Navasana (Boat Pose)', 'Bridge Pose (Setu Bandhasana)'],
      focusBenefit: 'Harnesses peak metabolic energy, enhances stamina, and supports cardiovascular radiance.',
    },
    {
      phase: 'luteal',
      title: 'Grounding Evening Yin Yoga for PMS Calm & Sweet Sleep',
      duration: '22 mins',
      instructor: 'The Yoga Ranger Studio',
      youtubeId: 'FYohLlJUYAo',
      poses: ['Viparita Karani (Legs Up the Wall)', 'Paschimottanasana (Seated Forward Bend)', 'Shavasana'],
      focusBenefit: 'Balances progesterone shifts, calms irritability and water retention, and lowers cortisol.',
    },
  ];

  const currentYoga = yogaSessions.find((s) => s.youtubeId === activeVideoId) || yogaSessions[0];

  const dailyDietPillars = [
    {
      phase: 'Menstrual',
      food: 'Warm Moong Dal Khichdi with A2 Ghee & Beetroot Salad',
      herb: 'Fresh Ginger-Cinnamon infusion with raw honey',
      nutrient: 'Iron & Magnesium',
      emoji: '🍲',
    },
    {
      phase: 'Follicular',
      food: 'Sprouted Moong & Chickpea Chat, Avocado, Fermented Dahi',
      herb: 'Lemon mint water & Green Tea',
      nutrient: 'Probiotics & Vitamin C',
      emoji: '🥑',
    },
    {
      phase: 'Ovulatory',
      food: 'Colorful Quinoa Bowls, Pomegranate, Berries, Steamed Greens',
      herb: 'Coconut water & Golden Turmeric Almond Milk',
      nutrient: 'Antioxidants & Glutathione',
      emoji: '🥥',
    },
    {
      phase: 'Luteal',
      food: 'Roasted Sweet Potatoes (Shakarkand), Roasted Chana, Brown Rice',
      herb: 'Fennel-Ajwain-Jeera warm digestive tea',
      nutrient: 'Complex Carbs & Vitamin B6',
      emoji: '🍠',
    },
  ];

  const handleOpenYouTube = (id: string) => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#A63A50] border border-[#FAD2D8] text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-[#C04D68]" />
          <span>Daily Healing Asanas & Nourishment</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.yogaTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">{t.yogaSub}</p>
      </div>

      {/* Main Active Yoga Video Player */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#4A1E29] flex items-center gap-2">
              <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>{currentYoga.title}</span>
            </h3>
            <p className="text-xs text-[#7A4B55] mt-0.5">
              Duration: {currentYoga.duration} • {currentYoga.instructor}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-300">
              {currentYoga.phase} Phase
            </span>
            <button
              type="button"
              onClick={() => handleOpenYouTube(activeVideoId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-all active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Watch on YouTube ↗</span>
            </button>
          </div>
        </div>

        {/* Video Iframe Container */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-neutral-900 border border-black/10">
          <iframe
            key={activeVideoId}
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
            title={currentYoga.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#7A4B55]">
          <p className="italic">
            Recommended gentle sequence to release pelvic congestion and calm hormonal fluctuations.
          </p>
          <button
            type="button"
            onClick={() => handleOpenYouTube(activeVideoId)}
            className="text-rose-600 hover:text-rose-800 font-semibold underline text-[11px]"
          >
            Video not loading? Open in YouTube app ↗
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFF6F3] border border-[#F5D8DF] text-xs text-[#522530] space-y-1">
          <strong className="text-[#8B263E] block font-semibold">Therapeutic Effect:</strong>
          <p>{currentYoga.focusBenefit}</p>
        </div>
      </div>

      {/* Yoga Phase Sessions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {yogaSessions.map((session) => {
          const isSelected = activeVideoId === session.youtubeId;
          return (
            <div
              key={session.youtubeId}
              className={`rounded-3xl p-5 border shadow-2xs space-y-3 flex flex-col justify-between transition-all bg-white/75 backdrop-blur-sm ${
                isSelected ? 'border-rose-400 ring-2 ring-rose-200' : 'border-[#F4DFE2] hover:border-pink-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A63A50]">
                    {session.phase} Routine
                  </span>
                  <span className="text-xs text-[#A66F7B] font-semibold">{session.duration}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#4A1E29] mt-1 leading-snug">
                  {session.title}
                </h4>

                <div className="pt-2 space-y-1">
                  <span className="text-[10px] font-bold text-[#7A4B55] uppercase block">
                    Key Asanas:
                  </span>
                  {session.poses.map((p, idx) => (
                    <div key={idx} className="text-xs text-[#522932] flex items-center gap-1.5">
                      <span className="text-rose-500">•</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveVideoId(session.youtubeId);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-[#FFF9F6] text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSelected ? 'Currently Playing' : 'Start Practice'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenYouTube(session.youtubeId)}
                  className="p-2 rounded-full text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                  title="Watch on YouTube"
                  aria-label="Watch on YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cycle-Synced Nourishment Recipes */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-orange-600" />
          <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
            Phase-Synced Nourishment & Healing Elixirs
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyDietPillars.map((diet, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#FFF9F6] border border-[#F4DFE2] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-[#4A1E29] flex items-center gap-1.5">
                  <span>{diet.emoji}</span>
                  <span>{diet.phase} Phase Diet</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
                  {diet.nutrient}
                </span>
              </div>
              <p className="text-[#522932]">
                <strong className="text-[#8B263E]">Nourishing Meal: </strong>
                {diet.food}
              </p>
              <p className="text-[#522932]">
                <strong className="text-[#8B263E]">Herbal Tea/Elixir: </strong>
                {diet.herb}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
