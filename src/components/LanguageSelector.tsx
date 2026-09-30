import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/context';
import { SupportedLanguage } from '../i18n/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage, languages, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${t.selectLanguage}: ${currentLang.nativeName}`}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border border-[#ECCACF]/80 bg-[#FFFBF8] hover:bg-[#FFF4F0] text-[#5C2E38] shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84]"
      >
        <Globe className="w-3.5 h-3.5 text-[#C04D68]" aria-hidden="true" />
        <span className="font-semibold text-[#8B263E]">{currentLang.nativeName}</span>
        {!compact && <span className="text-[11px] text-[#A66F7B]">({currentLang.name})</span>}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#9E6571] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t.selectLanguage}
          className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#FFFDFB] shadow-xl border border-[#F4D7DB] py-2 z-50 focus:outline-none ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A66F7B] border-b border-[#F7E7E9] mb-1">
            {t.selectLanguage}
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLanguage(lang.code as SupportedLanguage);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm text-left transition-colors duration-150 ${
                  isSelected
                    ? 'bg-[#FCEEE9] text-[#7A1E34] font-semibold'
                    : 'text-[#4A262E] hover:bg-[#FFF5F2]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <div className="flex flex-col">
                    <span className="leading-snug">{lang.nativeName}</span>
                    <span className="text-[11px] text-[#A66F7B] font-normal">{lang.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#A63A50]" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
