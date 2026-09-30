import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import {
  Sparkles,
  Heart,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export type ProductType =
  | 'pads'
  | 'tampons'
  | 'cups'
  | 'underwear'
  | 'reusable-pads'
  | 'pantyliners';

interface ProductGuideDetail {
  id: ProductType;
  name: string;
  emoji: string;
  oneLiner: string;
  whatIsIt: string;
  whoPrefers: string[];
  howToUse: string;
  changeCleanFreq: string;
  pros: string[];
  considerations: string[];
  beginnerTips: string[];
  steps: {
    number: number;
    stepTitle: string;
    action: string;
    tip: string;
    icon: string;
  }[];
}

export const PeriodProductGuide: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('cups');

  const productData: Record<ProductType, ProductGuideDetail> = {
    cups: {
      id: 'cups',
      name: 'Menstrual Cups',
      emoji: '🌷',
      oneLiner: 'Eco-friendly, medical-grade silicone cup that collects flow instead of absorbing it.',
      whatIsIt:
        'A flexible bell-shaped cup made from 100% hypoallergenic medical-grade silicone. It sits gently in the vaginal canal below the cervix, collecting menstrual fluid for up to 8–12 hours without drying natural vaginal flora.',
      whoPrefers: [
        'Swimmers, travelers, and active fitness enthusiasts',
        'Those seeking zero plastic waste and eco-consciousness',
        'Women looking to save thousands of rupees over 5+ years',
        'People comfortable with their body and internal insertion',
      ],
      howToUse:
        'Wash hands with unscented soap. Fold the cup into a "C-Fold" or "Punch-Down Fold". Relax pelvic floor, gently insert angled towards the tailbone, and rotate slightly until it pops open to form a vacuum seal.',
      changeCleanFreq:
        'Empty and rinse every 8 to 12 hours with warm water. Sterilize in boiling water for 5 minutes at the start and end of each cycle.',
      pros: [
        'Up to 12 hours uninterrupted protection',
        'No dryness, itching, or pH disruption',
        'Reusable for 5 to 10 years (Massive financial savings)',
        'Odorless and completely leakproof when sealed',
      ],
      considerations: [
        'Takes 2–3 cycles to master insertion/removal technique',
        'Requires access to clean potable water for rinsing',
        'Not ideal for those hesitant about touching vaginal fluids',
      ],
      beginnerTips: [
        'Use water or a drop of water-based lube on the rim for easier entry.',
        'Never pull directly on the stem! Pinch the base first to release the suction seal.',
        'Wear a pantyliner for the first 2 cycles while learning your seal.',
      ],
      steps: [
        {
          number: 1,
          stepTitle: 'Choose',
          action: 'Select Size S/M (if under 30 or haven’t given birth vaginally) or Size L (if given birth or heavier flow).',
          tip: 'Soft silicone works best for sensitive bladders.',
          icon: '🔍',
        },
        {
          number: 2,
          stepTitle: 'Prepare',
          action: 'Boil in clean rolling water for 5 minutes before your period begins. Wash hands thoroughly with soap.',
          tip: 'Let it cool down completely before touching!',
          icon: '🫧',
        },
        {
          number: 3,
          stepTitle: 'Use',
          action: 'Fold into a Punch-Down shape, squat slightly, insert gently, and let it pop open to seal against the vaginal walls.',
          tip: 'Run a clean finger around base to ensure no folds remain.',
          icon: '🌷',
        },
        {
          number: 4,
          stepTitle: 'Change/Clean',
          action: 'Pinch base to release vacuum, empty fluid in toilet, rinse with tap water, and reinsert immediately.',
          tip: 'Empty at least twice daily (morning & before sleep).',
          icon: '🚿',
        },
        {
          number: 5,
          stepTitle: 'Dispose/Store',
          action: 'At cycle end, boil again for 5 mins, dry completely, and store in its breathable cotton pouch (never in airtight plastic).',
          tip: 'Store away from direct sunlight.',
          icon: '🎀',
        },
      ],
    },

    pads: {
      id: 'pads',
      name: 'Disposable Sanitary Pads',
      emoji: '🌸',
      oneLiner: 'The most popular, user-friendly external absorbent pad with adhesive backing.',
      whatIsIt:
        'An external absorbent pad made of cotton or synthetic fibers that sticks securely inside the gusset of underwear to absorb menstrual fluid as it leaves the body.',
      whoPrefers: [
        'Beginners having their first period or teens',
        'Anyone who prefers non-invasive external protection',
        'Postpartum recovery and overnight heavy flow',
      ],
      howToUse:
        'Unpeel the paper strip from the back. Center the pad firmly in the underwear gusset and wrap wings around the sides to prevent shifting.',
      changeCleanFreq:
        'Change every 4 to 6 hours (even on light days) to avoid bacterial growth, moisture rashes, and odor.',
      pros: [
        'Zero learning curve; extremely easy to use anywhere',
        'Widely available in every pharmacy and grocery store',
        'Easy to track blood flow volume, color, and clot texture',
      ],
      considerations: [
        'Can feel bulky or cause friction rashes with synthetic plastics',
        'Generates non-biodegradable landfill waste unless choosing organic bamboo/cotton',
        'Cannot be worn while swimming',
      ],
      beginnerTips: [
        'Choose pads with wings for zero side-leakage.',
        'Opt for unbleached, perfume-free cotton pads to prevent vulvar dermatitis.',
      ],
      steps: [
        {
          number: 1,
          stepTitle: 'Choose',
          action: 'Select Regular length for light/medium days, XL or XXL with wide back wings for heavy flow or sleep.',
          tip: 'Pure cotton top sheets prevent plastic rash.',
          icon: '📐',
        },
        {
          number: 2,
          stepTitle: 'Prepare',
          action: 'Wash hands. Remove pad from wrapper, keeping the wrapper intact for hygienic disposal later.',
          tip: 'Keep spare pads in a clean pouch.',
          icon: '✨',
        },
        {
          number: 3,
          stepTitle: 'Use',
          action: 'Press adhesive strip firmly into the center of underwear. Fold wings under the edges securely.',
          tip: 'Wear snug cotton underwear so pad stays in place.',
          icon: '🌸',
        },
        {
          number: 4,
          stepTitle: 'Change/Clean',
          action: 'Change every 4-6 hours. Never leave a pad on for more than 8 hours.',
          tip: 'Cleanse vulva gently with plain warm water from front to back.',
          icon: '⏱️',
        },
        {
          number: 5,
          stepTitle: 'Dispose/Store',
          action: 'Roll used pad tightly, wrap in paper or disposal wrapper, and bin it. NEVER flush pads down the toilet!',
          tip: 'Always use dedicated dry sanitary bins.',
          icon: '🗑️',
        },
      ],
    },

    tampons: {
      id: 'tampons',
      name: 'Tampons',
      emoji: '💧',
      oneLiner: 'Discreet internal cylinder of compressed absorbent cotton with removal string.',
      whatIsIt:
        'A compact cylindrical plug made of rayon/cotton inserted into the vagina to absorb fluid before it leaves the body. Available with or without an applicator.',
      whoPrefers: [
        'Athletes, swimmers, dancers, and active individuals',
        'Those who dislike the wet sensation of external pads',
        'Wearing tight athletic wear or form-fitting clothing',
      ],
      howToUse:
        'Squat or place one foot on toilet. Using applicator or clean finger, push tampon into vagina at a 45-degree angle towards back. String stays outside for removal.',
      changeCleanFreq:
        'Must change every 4 to 8 hours. NEVER wear a single tampon for longer than 8 hours to prevent Toxic Shock Syndrome (TSS).',
      pros: [
        'Completely invisible under all clothing and swimwear',
        'No sensation when inserted at the correct depth',
        'Keeps outer skin dry and odor-free',
      ],
      considerations: [
        'Small risk of Toxic Shock Syndrome (TSS) if left in too long or high absorbency is misused',
        'Requires proper insertion angle; can feel uncomfortable if not deep enough',
        'Disposable single-use waste',
      ],
      beginnerTips: [
        'Always start with the lowest absorbency (Regular/Light) and an applicator.',
        'If you feel the tampon while walking or sitting, it is not inserted deep enough!',
      ],
      steps: [
        {
          number: 1,
          stepTitle: 'Choose',
          action: 'Match absorbency strictly to your current flow (Regular for normal, Super for heavy).',
          tip: 'Never use high absorbency for light flow.',
          icon: '🎯',
        },
        {
          number: 2,
          stepTitle: 'Prepare',
          action: 'Wash hands thoroughly. Check string is securely attached to base before insertion.',
          tip: 'Take a slow exhale to relax pelvic muscles.',
          icon: '🫱',
        },
        {
          number: 3,
          stepTitle: 'Use',
          action: 'Insert applicator gently at a 45-degree angle towards your spine. Push inner plunger, then remove applicator.',
          tip: 'The removal cord hangs 2-3 inches outside.',
          icon: '💧',
        },
        {
          number: 4,
          stepTitle: 'Change/Clean',
          action: 'Change every 4-6 hours. Pull the string gently at the same angle it entered.',
          tip: 'Alternate with pads at night.',
          icon: '🕒',
        },
        {
          number: 5,
          stepTitle: 'Dispose/Store',
          action: 'Wrap used tampon in toilet paper and dispose in waste bin. Never flush tampons or plastic applicators.',
          tip: 'Store tampons in a dry, cool medicine cabinet.',
          icon: '📦',
        },
      ],
    },

    underwear: {
      id: 'underwear',
      name: 'Period Underwear',
      emoji: '🩲',
      oneLiner: 'Washable, leakproof underwear with multi-layer built-in absorbent gusset.',
      whatIsIt:
        'Specially engineered underwear with an integrated multi-tier gusset: moisture-wicking top layer, antimicrobial absorbent core, and breathable waterproof barrier.',
      whoPrefers: [
        'Anyone wanting comfortable, zero-waste, all-day protection',
        'Teenagers who feel self-conscious carrying pads to school',
        'Back-up protection for menstrual cups or light bladder leaks',
        'Overnight sleep without shifting pads or wedgies',
      ],
      howToUse:
        'Wear like standard underwear! Put on in the morning, wear throughout the day, and change when full or at bedtime.',
      changeCleanFreq:
        'Wear up to 8–12 hours depending on absorbency rating (1–4 tampons worth). Rinse in cold water after use until clear, then machine wash.',
      pros: [
        'Feels identical to wearing soft normal underwear',
        'Zero waste, washable and reusable for 2+ years',
        'No plastic rustling sound or bulky adhesive wings',
      ],
      considerations: [
        'Higher upfront initial cost per pair (₹600–₹1,200)',
        'Requires changing whole pair of pants/underwear if full outside home',
        'Requires cold water rinse before laundry',
      ],
      beginnerTips: [
        'Always rinse with cold water—hot water sets blood stains!',
        'Never use fabric softener or bleach, as they destroy the absorbent membrane.',
      ],
      steps: [
        {
          number: 1,
          stepTitle: 'Choose',
          action: 'Pick your regular underwear size and flow rating (Moderate, Heavy, or Overnight Super).',
          tip: 'High-waisted cuts feel super cozy during cramps.',
          icon: '🩲',
        },
        {
          number: 2,
          stepTitle: 'Prepare',
          action: 'Wash once before first use to activate the fibers in the absorbent core.',
          tip: 'Ensure gusset is fully dry.',
          icon: '☀️',
        },
        {
          number: 3,
          stepTitle: 'Use',
          action: 'Wear just like regular panties. Go about your day, school, work, or sleep with confidence.',
          tip: 'Bring a waterproof wet-bag if changing during the day.',
          icon: '💃',
        },
        {
          number: 4,
          stepTitle: 'Change/Clean',
          action: 'Rinse under cold running water in sink until water runs completely clear. Squeeze gently.',
          tip: 'Do not twist or wring hard.',
          icon: '💧',
        },
        {
          number: 5,
          stepTitle: 'Dispose/Store',
          action: 'Machine wash on delicate cold cycle with mild detergent. Hang dry in sunlight for natural disinfection.',
          tip: 'Never tumble dry on high heat.',
          icon: '🌬️',
        },
      ],
    },

    'reusable-pads': {
      id: 'reusable-pads',
      name: 'Cloth Reusable Pads',
      emoji: '🌿',
      oneLiner: 'Washable fabric pads with snap buttons for gentle, sustainable care.',
      whatIsIt:
        'Soft pads made from organic cotton, bamboo fleece, or flannel with an internal waterproof PUL lining that snap around underwear with small push buttons.',
      whoPrefers: [
        'Those with sensitive skin prone to rashes from plastic disposables',
        'Eco-warriors committed to zero monthly waste',
        'Anyone working from home with easy access to laundry',
      ],
      howToUse:
        'Place pattern side facing your body (or fleece side up), wrap wings around bottom of underwear, and fasten snap button securely.',
      changeCleanFreq:
        'Change every 4–6 hours. Soak in cold water and wash thoroughly with natural soap.',
      pros: [
        'Extremely breathable, ultra-soft, zero chemical burns',
        'Lasts 3 to 5 years, saving thousands of rupees',
        'Cute prints and comfortable natural fibers',
      ],
      considerations: [
        'Requires regular washing, soaking, and sun-drying routine',
        'Carrying used pads home in wet-bags when out',
      ],
      beginnerTips: [
        'Use baking soda and cold water to eliminate any blood spots naturally.',
        'Drying in bright outdoor sunlight acts as a natural sanitizer.',
      ],
      steps: [
        {
          number: 1,
          stepTitle: 'Choose',
          action: 'Select bamboo charcoal pads for odor control or organic cotton flannel for sensitive skin.',
          tip: 'Start with a trial kit of 3 pads.',
          icon: '🌿',
        },
        {
          number: 2,
          stepTitle: 'Prepare',
          action: 'Pre-wash brand new pads to fluff the absorbent cotton fibers.',
          tip: 'Keep a small wet-bag handy.',
          icon: '🧺',
        },
        {
          number: 3,
          stepTitle: 'Use',
          action: 'Place soft side against body. Fasten the snap button around the underside of your underwear.',
          tip: 'Wear snug underwear to prevent sliding.',
          icon: '🧷',
        },
        {
          number: 4,
          stepTitle: 'Change/Clean',
          action: 'Change every 4-6 hours. Soak in cold water for 15-30 minutes, wash with mild soap.',
          tip: 'Cold water is key to prevent protein stains.',
          icon: '🚿',
        },
        {
          number: 5,
          stepTitle: 'Dispose/Store',
          action: 'Hang to dry in direct sunlight. Store folded into small squares in a clean basket.',
          tip: 'Sunlight naturally kills microbes.',
          icon: '☀️',
        },
      ],
    },

    pantyliners: {
      id: 'pantyliners',
      name: 'Pantyliners',
      emoji: '✨',
      oneLiner: 'Ultra-thin, feather-light liners for spotting, ovulation discharge, or cup backup.',
      whatIsIt:
        'Very thin, miniature absorbent liners designed for daily freshness, light ovulation discharge, beginning or end-of-period spotting, or as back-up for tampons and cups.',
      whoPrefers: [
        'Tracking ovulation fluid and cervical mucus discharge',
        'Days 5–7 when flow is just light brown spotting',
        'Extra security against accidental cup or tampon spotting',
      ],
      howToUse:
        'Peel backing paper and stick in the center of underwear. So thin you will completely forget it is there!',
      changeCleanFreq:
        'Change every 3 to 5 hours. Never wear the same liner all day to avoid trapping vaginal humidity.',
      pros: [
        'Ultra-lightweight, invisible, discreet',
        'Protects favourite underwear from stains and daily discharge',
        'Inexpensive and compact to carry in pocket',
      ],
      considerations: [
        'NOT designed for actual menstrual flow (too thin to absorb real bleeding)',
        'Daily continuous use can trap humidity if not 100% breathable cotton',
      ],
      beginnerTips: [
        'Avoid scented/perfumed liners; natural vaginal discharge does not need artificial perfume!',
      ],
      steps: [
        {
          number: 1,
          stepTitle: 'Choose',
          action: 'Choose 100% breathable organic cotton, unfragranced liners.',
          tip: 'Avoid synthetic plastic-backed liners.',
          icon: '✨',
        },
        {
          number: 2,
          stepTitle: 'Prepare',
          action: 'Unwrap with clean hands. Great to slip into pencil cases or pockets.',
          tip: 'Keep 2 liners in your daily bag.',
          icon: '👛',
        },
        {
          number: 3,
          stepTitle: 'Use',
          action: 'Adhere firmly to underwear gusset for spotting or ovulation days.',
          tip: 'Comfortable for light daily discharge.',
          icon: '🌸',
        },
        {
          number: 4,
          stepTitle: 'Change/Clean',
          action: 'Change every 3-4 hours to allow skin to breathe.',
          tip: 'Do not sleep in liners unless necessary.',
          icon: '⏳',
        },
        {
          number: 5,
          stepTitle: 'Dispose/Store',
          action: 'Wrap in paper and bin. Never flush.',
          tip: 'Keep box dry in bedroom drawer.',
          icon: '🗑️',
        },
      ],
    },
  };

  const current = productData[selectedProduct];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-rose-800 border border-pink-200 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-pink-600" />
          <span>🩷 Sakhi Product Guide</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">Your Body-Kind Period Guide</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">
          Evidence-based, medically verified hygiene guides for every method of flow protection.
        </p>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar p-1.5 bg-white/70 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs max-w-3xl mx-auto">
        {(
          [
            { id: 'pads', label: '🌸 Pads' },
            { id: 'cups', label: '🌷 Menstrual Cups' },
            { id: 'tampons', label: '💧 Tampons' },
            { id: 'underwear', label: '🩲 Period Underwear' },
            { id: 'reusable-pads', label: '🌿 Reusable Cloth' },
            { id: 'pantyliners', label: '✨ Pantyliners' },
          ] as const
        ).map((item) => {
          const isSelected = selectedProduct === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedProduct(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs scale-105'
                  : 'text-[#6E3C48] hover:bg-pink-50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Product Feature Card */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-8">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-[#FFF9FA] to-purple-50 border border-pink-200">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl p-2.5 rounded-2xl bg-white shadow-xs border border-pink-100">
              {current.emoji}
            </span>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">{current.name}</h3>
              <p className="text-xs text-[#7A4B55] mt-0.5">{current.oneLiner}</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            Certified Hygiene Guide
          </span>
        </div>

        {/* 2-Column Overview: What is it & Who Prefers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#FFF9F6] border border-[#F4DFE2] space-y-2.5">
            <h4 className="font-serif text-base font-bold text-[#4A1E29] flex items-center gap-1.5">
              <span>❓ What is it?</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#522932] leading-relaxed">{current.whatIsIt}</p>

            <div className="pt-2 border-t border-[#F2D7CD]">
              <strong className="text-xs font-semibold text-[#8B263E] block mb-1">
                ⏱️ How often to change / clean:
              </strong>
              <p className="text-xs text-[#522932]">{current.changeCleanFreq}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF9F6] border border-[#F4DFE2] space-y-2.5">
            <h4 className="font-serif text-base font-bold text-[#4A1E29] flex items-center gap-1.5">
              <span>💖 Who may prefer it?</span>
            </h4>
            <ul className="space-y-1.5">
              {current.whoPrefers.map((item, i) => (
                <li key={i} className="text-xs sm:text-sm text-[#522932] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pros & Considerations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <h4 className="font-semibold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1">
              <span>✨ Pros & Benefits</span>
            </h4>
            <ul className="space-y-1.5">
              {current.pros.map((p, i) => (
                <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <h4 className="font-semibold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <span>⚠️ Considerations</span>
            </h4>
            <ul className="space-y-1.5">
              {current.considerations.map((c, i) => (
                <li key={i} className="text-xs text-amber-950 flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-Step Illustrated 5-Stage Tutorial */}
        <div className="space-y-4 pt-4 border-t border-[#F7E7E9]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h4 className="font-serif text-xl font-bold text-[#4A1E29]">
              5-Step Step-by-Step Guide for {current.name}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {current.steps.map((st) => (
              <div
                key={st.number}
                className="p-4 rounded-2xl bg-white border border-pink-200 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{st.icon}</span>
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-rose-800 text-xs font-bold flex items-center justify-center">
                      {st.number}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-[#4A1E29] mt-2 uppercase tracking-wide">
                    {st.stepTitle}
                  </h5>
                  <p className="text-[11px] text-[#522932] mt-1 leading-snug">{st.action}</p>
                </div>
                <div className="p-2 rounded-xl bg-pink-50/80 text-[10px] text-rose-900 font-medium mt-2">
                  💡 {st.tip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beginner Tips Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-[#FFF9FA] to-purple-50 border border-pink-200 text-xs text-[#522932] space-y-1.5">
          <strong className="text-rose-900 font-bold flex items-center gap-1.5">
            <span>🌸 Sisterly Beginner Tip:</span>
          </strong>
          {current.beginnerTips.map((tip, i) => (
            <p key={i} className="leading-relaxed">
              • {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
