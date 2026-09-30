import React from 'react';
import { useTranslation } from '../i18n/context';
import {
  AlertTriangle,
  Phone,
  Heart,
  ShieldAlert,
  X,
  ExternalLink,
  MessageCircle,
  Thermometer,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToGynac?: () => void;
  onNavigateToBuddy?: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  onNavigateToGynac,
  onNavigateToBuddy,
}) => {
  const { language } = useTranslation();

  if (!isOpen) return null;

  const helplines = [
    {
      name: language === 'hi' ? 'राष्ट्रीय आपातकालीन नंबर' : 'National Emergency',
      number: '112',
      desc: language === 'hi' ? 'पुलिस, एम्बुलेंस व आपातकालीन सेवाएं' : 'All-in-one Emergency Services (Police, Medical, Fire)',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      name: language === 'hi' ? 'महिला हेल्पलाइन (भारत सरकार)' : 'National Women Helpline',
      number: '1091',
      desc: language === 'hi' ? '24/7 संकट व महिला सुरक्षा हेल्पलाइन' : '24/7 Women in Distress Support & Assistance',
      color: 'bg-pink-50 text-pink-800 border-pink-200',
    },
    {
      name: language === 'hi' ? 'टेली-मानस मानसिक स्वास्थ्य' : 'Tele-MANAS Mental Health',
      number: '14416',
      desc: language === 'hi' ? 'निःशुल्क मनोवैज्ञानिक परामर्श (24/7)' : 'Toll-free 24/7 Psychological & Crisis Counseling',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const handleWhatsappSos = () => {
    const text = encodeURIComponent(
      language === 'hi'
        ? 'हे, मुझे इस समय बहुत तेज पीरियड्स क्रैम्प्स / असहजता हो रही है और मुझे थोड़े आराम या मदद की ज़रूरत है 🥺 💗 (Sent via Sakhi SOS)'
        : 'Hey, I am having really severe period cramps/discomfort right now and need some care/rest 🥺 💗 (Sent via Sakhi SOS)'
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl border border-rose-200 shadow-2xl p-6 sm:p-7 space-y-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100/90 border border-rose-200 flex items-center justify-center text-2xl shadow-xs">
              🆘
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/80 mb-1">
                <span>🚨 Emergency & Care SOS</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1E29]">
                {language === 'hi' ? 'सखी एसओएस (आपातकालीन मदद)' : 'Sakhi Care & Emergency SOS'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#8A5A66] hover:text-[#4A1E29] hover:bg-pink-100/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200/70 text-xs text-[#5C2E38] leading-relaxed flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>
            {language === 'hi'
              ? 'आप बिल्कुल सुरक्षित हैं। यदि दर्द अत्यधिक या असामान्य है, तो किसी करीबी या डॉक्टर से संपर्क करने में संकोच न करें।'
              : 'You are safe. If your pain is unusually severe, sudden, or accompanied by dizziness/fainting, please seek immediate help.'}
          </span>
        </div>

        {/* 24/7 Helplines */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center justify-between">
            <span>📞 24/7 Verified Helplines (India)</span>
            <span className="text-[10px] text-[#8A5A66] font-normal">Toll-free</span>
          </div>

          <div className="space-y-2">
            {helplines.map((h, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${h.color} transition-all`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm">{h.name}</div>
                  <div className="text-[11px] text-[#7A4B55] mt-0.5">{h.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCall(h.number)}
                  className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <Phone className="w-3 h-3" />
                  <span>{h.number}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick WhatsApp SOS to Buddy */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span className="font-bold text-xs sm:text-sm text-emerald-950">
                {language === 'hi' ? 'व्हाट्सएप बडी को तुरंत सूचित करें' : 'One-Tap WhatsApp Cramp Alert'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200">
              Quick Buddy
            </span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            {language === 'hi'
              ? 'अपनी मां, बहन या पार्टनर को बिना संकोच तुरंत एक पूर्व-लिखित संदेश भेजें।'
              : 'Send a pre-formatted gentle distress message to your mom, partner or bestie in one tap.'}
          </p>
          <button
            type="button"
            onClick={handleWhatsappSos}
            className="w-full py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Send WhatsApp SOS Alert'}</span>
          </button>
        </div>

        {/* Severe Cramp Relief Checklist */}
        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200/80 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#4A1E29]">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <span>{language === 'hi' ? 'अत्यधिक दर्द में तुरंत राहत उपाय' : 'Immediate Cramp Comfort Guide'}</span>
          </div>
          <ul className="text-xs text-[#6B3A44] space-y-1.5 list-disc list-inside">
            <li>{language === 'hi' ? 'पेट के निचले हिस्से पर गर्म पानी की सिकाई (Hot water bottle) रखें।' : 'Apply warm heat pad or hot water bottle to lower abdomen.'}</li>
            <li>{language === 'hi' ? 'करवट लेकर घुटनों को मोड़कर (Fetal position) लेटें।' : 'Curl up in fetal position with a pillow between knees to ease pelvic pressure.'}</li>
            <li>{language === 'hi' ? 'गुनगुना पानी या अदरक-अजवाइन की चाय धीरे-धीरे पिएं।' : 'Sip warm water or soothing ginger/chamomile tea slowly.'}</li>
            <li>{language === 'hi' ? 'यदि चक्कर आए या अत्यधिक रक्तस्राव हो (1-2 घंटे में पैड भीगना), तुरंत अस्पताल जाएं।' : 'Seek urgent medical care if bleeding saturates >1 pad/hour or you feel dizzy/faint.'}</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-between gap-3">
          {onNavigateToGynac && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToGynac();
              }}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 cursor-pointer hover:underline"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'डॉक्टर खोजें →' : 'Find Verified Gynac →'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-xs font-bold text-[#5C2E38] shadow-2xs transition-all cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'I am Okay'}
          </button>
        </div>
      </div>
    </div>
  );
};
