import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { ShieldCheck, Phone, MapPin, Calendar, Award, Star, ExternalLink, Search } from 'lucide-react';

interface DoctorInfo {
  id: string;
  name: string;
  title: string;
  credentials: string;
  experience: string;
  hospital: string;
  location: string;
  specializations: string[];
  bio: string;
  phone: string;
  image: string;
  rating: string;
}

export const DoctorDirectory: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const doctors: DoctorInfo[] = [
    {
      id: 'doc1',
      name: 'Dr. Manisha Singh',
      title: 'Senior Consultant - Obstetrics & Gynecological Medicine',
      credentials: 'MBBS, MD (Obstetrics & Gynae), MRCOG (London)',
      experience: '22+ Years Experience',
      hospital: 'Apollo Cradle & Children’s Hospital',
      location: 'Bengaluru / New Delhi',
      specializations: ['PCOS & Hormonal Imbalances', 'Laparoscopic Surgery', 'Endometriosis Management'],
      bio: 'Renowned expert in compassionate, patient-centered women’s reproductive health with extensive clinical experience across the UK and premier Indian hospitals.',
      phone: '+91 1860 500 1066',
      image: 'https://images.unsplash.com/photo-1594824813589-3221b65ea113?auto=format&fit=crop&q=80&w=350',
      rating: '4.9 ★ (1,400+ reviews)',
    },
    {
      id: 'doc2',
      name: 'Dr. Ananya Sen',
      title: 'Director of Women’s Health & Reproductive Endocrinology',
      credentials: 'MBBS, MS (OB-GYN), Fellowship in Reproductive Medicine',
      experience: '18+ Years Experience',
      hospital: 'Fortis La Femme - Centre for Women',
      location: 'New Delhi / Gurugram',
      specializations: ['Adolescent Menstrual Health', 'Severe Dysmenorrhea', 'Hormone Replacement & Care'],
      bio: 'Specialist in evidence-based non-invasive treatments for pelvic pain, painful heavy flows, and hormonal harmony for women of all ages.',
      phone: '+91 11 4057 9400',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=350',
      rating: '4.8 ★ (980+ reviews)',
    },
    {
      id: 'doc3',
      name: 'Dr. Priya Sharma',
      title: 'Chief Obstetrician & Gynecologist',
      credentials: 'MBBS, DGO, FICOG, Advanced Laparoscopy Fellowship',
      experience: '16+ Years Experience',
      hospital: 'Max Super Speciality Hospital Women’s Wing',
      location: 'Mumbai / Pan-India Virtual',
      specializations: ['PCOD Reversal Programs', 'Preventive Cervical Health', 'Holistic Cycle Wellness'],
      bio: 'Passionate advocate for menstrual stigma elimination and adolescent health education, delivering gentle compassionate consultations.',
      phone: '+91 22 2660 7000',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=350',
      rating: '4.9 ★ (1,150+ reviews)',
    },
    {
      id: 'doc4',
      name: 'Dr. Rajeshwari Nair',
      title: 'Senior Consultant & Infertility Specialist',
      credentials: 'MBBS, DNB (Obstetrics & Gynae), Dip. Pelvic Endoscopy',
      experience: '20+ Years Experience',
      hospital: 'Cloudnine Hospitals - Specialized Women’s Care',
      location: 'Bengaluru / Mumbai / Pune',
      specializations: ['Fertility Windows', 'Uterine Fibroids Care', 'Pre-Conception & Luteal Support'],
      bio: 'Leading gynecologist dedicated to providing empathetic, clear explanations without fear, guiding women through every natural season of life.',
      phone: '+91 99728 99728',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=350',
      rating: '4.9 ★ (820+ reviews)',
    },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specializations.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity =
      selectedCity === 'All' || doc.location.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#A63A50] border border-[#FAD2D8] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C04D68]" />
          <span>Verified Women's Health Clinicians</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.doctorsTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">{t.doctorsSub}</p>
      </div>

      {/* Emergency Notice Pill */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-4">
        <div>
          <strong className="block font-semibold">Emergency or Severe Acute Pain?</strong>
          <span>
            If experiencing sudden extreme bleeding or fainting, please contact the 24/7 National Women’s Health Helpline: <strong className="font-bold underline">1091 / 112</strong>
          </span>
        </div>
        <a
          href="tel:112"
          className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex-shrink-0"
        >
          Call 112
        </a>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#F4DFE2] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A66F7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor, hospital, or PCOS..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['All', 'Delhi', 'Bengaluru', 'Mumbai'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-[#C04D68] text-white shadow-xs'
                  : 'bg-[#FFF9F6] text-[#6E3C48] hover:bg-[#FCEEE9] border border-[#ECCACF]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-sm space-y-4 flex flex-col justify-between hover:border-pink-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border-2 border-pink-100">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#4A1E29] leading-tight">
                      {doc.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {doc.rating}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#C04D68] mt-0.5">{doc.title}</p>
                  <p className="text-[11px] text-[#7A4B55] mt-0.5">{doc.credentials}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFF9F6] border border-[#F4DFE2] space-y-1.5 text-xs text-[#522932]">
                <div className="flex items-center gap-1.5 font-semibold text-[#8B263E]">
                  <Award className="w-3.5 h-3.5 text-[#C04D68]" />
                  <span>{doc.hospital}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7A4B55]">
                  <MapPin className="w-3.5 h-3.5 text-[#A66F7B]" />
                  <span>{doc.location} • {doc.experience}</span>
                </div>
              </div>

              <p className="text-xs text-[#6A3945] leading-relaxed">{doc.bio}</p>

              {/* Specializations Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {doc.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-900 border border-pink-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-3 border-t border-[#F7E7E9] flex items-center justify-between gap-3">
              <a
                href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#C04D68] hover:bg-[#A63A50] text-white shadow-xs transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Helpline / Book</span>
              </a>

              <span className="text-[11px] text-[#A66F7B]">{doc.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
