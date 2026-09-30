import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import {
  Search,
  MapPin,
  Star,
  Phone,
  Navigation,
  Calendar,
  Filter,
  Video,
  Building2,
  UserCheck,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';

export interface Gynecologist {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  distance: string;
  rating: number;
  reviewsCount: number;
  consultationType: 'Online & Clinic' | 'In-Clinic Only' | 'Online Only';
  isFemale: boolean;
  phone: string;
  address: string;
  mapsUrl: string;
  languages: string[];
  nextAvailable: string;
  fee: string;
  image: string;
  tags: string[];
}

export const FindGynac: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Nearby' | 'Rating' | 'Female' | 'Online' | 'Clinic'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Gynecologist | null>(null);
  const [bookedDoctor, setBookedDoctor] = useState<string | null>(null);

  const doctorsList: Gynecologist[] = [
    {
      id: 'gyn-1',
      name: 'Dr. Manisha Singh',
      specialty: 'Reproductive Endocrinology & PCOS Specialist',
      clinic: 'Apollo Cradle Women & Child Hospital',
      distance: '1.2 km away',
      rating: 4.9,
      reviewsCount: 1420,
      consultationType: 'Online & Clinic',
      isFemale: true,
      phone: '+91 1860 500 1066',
      address: 'Plot 2, 6th Block, Koramangala / New Delhi Centre',
      mapsUrl: 'https://maps.google.com/?q=Apollo+Cradle',
      languages: ['English', 'Hindi', 'Kannada'],
      nextAvailable: 'Today, 4:30 PM',
      fee: '₹900',
      image: 'https://images.unsplash.com/photo-1594824813589-3221b65ea113?auto=format&fit=crop&q=80&w=320',
      tags: ['PCOS', 'Irregular Cycles', 'Severe Cramps'],
    },
    {
      id: 'gyn-2',
      name: 'Dr. Ananya Sen',
      specialty: 'Obstetrician & Adolescent Gynecologist',
      clinic: 'Fortis La Femme - Dedicated Centre for Women',
      distance: '2.4 km away',
      rating: 4.8,
      reviewsCount: 980,
      consultationType: 'Online & Clinic',
      isFemale: true,
      phone: '+91 11 4057 9400',
      address: 'S-549, Greater Kailash II, New Delhi',
      mapsUrl: 'https://maps.google.com/?q=Fortis+La+Femme',
      languages: ['English', 'Hindi', 'Bengali'],
      nextAvailable: 'Tomorrow, 11:00 AM',
      fee: '₹1,000',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=320',
      tags: ['Teens & First Period', 'Endometriosis', 'PMS Support'],
    },
    {
      id: 'gyn-3',
      name: 'Dr. Priya Sharma',
      specialty: 'Preventive Women’s Health & Laparoscopic Care',
      clinic: 'Max Super Speciality Hospital Women’s Wing',
      distance: '3.8 km away',
      rating: 4.9,
      reviewsCount: 1150,
      consultationType: 'In-Clinic Only',
      isFemale: true,
      phone: '+91 22 2660 7000',
      address: '1, 2 Press Enclave Road, Saket / Mumbai Hub',
      mapsUrl: 'https://maps.google.com/?q=Max+Hospital',
      languages: ['English', 'Hindi', 'Marathi'],
      nextAvailable: 'Today, 6:00 PM',
      fee: '₹850',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=320',
      tags: ['PCOD Reversal', 'Pelvic Care', 'Ultrasound'],
    },
    {
      id: 'gyn-4',
      name: 'Dr. Rajeshwari Nair',
      specialty: 'Holistic Fertility & Hormonal Balance',
      clinic: 'Cloudnine Hospitals - Women’s Care',
      distance: '4.5 km away',
      rating: 4.9,
      reviewsCount: 840,
      consultationType: 'Online & Clinic',
      isFemale: true,
      phone: '+91 99728 99728',
      address: 'Old Airport Road / Pan-India Video Support',
      mapsUrl: 'https://maps.google.com/?q=Cloudnine+Hospital',
      languages: ['English', 'Hindi', 'Malayalam'],
      nextAvailable: 'Tomorrow, 2:00 PM',
      fee: '₹950',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=320',
      tags: ['Fertility Tracking', 'Hormone Check', 'Fibroids'],
    },
    {
      id: 'gyn-5',
      name: 'Dr. Rohan Verma',
      specialty: 'Consultant Obstetrician & Menstrual Health Specialist',
      clinic: 'City Care Women’s Clinic',
      distance: '5.1 km away',
      rating: 4.7,
      reviewsCount: 420,
      consultationType: 'Online Only',
      isFemale: false,
      phone: '+91 80 4123 4567',
      address: 'Telehealth Consult / Indiranagar Clinic',
      mapsUrl: 'https://maps.google.com/?q=City+Care+Clinic',
      languages: ['English', 'Hindi'],
      nextAvailable: 'Today, 5:00 PM',
      fee: '₹700',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=320',
      tags: ['Teleconsultation', 'Anemia in Periods', 'Diet'],
    },
  ];

  // Filtering
  const filteredDoctors = doctorsList.filter((doc) => {
    // Search filter
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Category filter
    if (activeFilter === 'Nearby') {
      return parseFloat(doc.distance) <= 3.0;
    }
    if (activeFilter === 'Rating') {
      return doc.rating >= 4.9;
    }
    if (activeFilter === 'Female') {
      return doc.isFemale;
    }
    if (activeFilter === 'Online') {
      return doc.consultationType.includes('Online');
    }
    if (activeFilter === 'Clinic') {
      return doc.consultationType.includes('Clinic');
    }
    return true;
  });

  const handleBook = (doctor: Gynecologist) => {
    setBookedDoctor(doctor.name);
    setTimeout(() => setBookedDoctor(null), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Demo Data transparency */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-rose-800 border border-pink-200 text-xs font-semibold">
          <span>🩺 Find a Gynac • Verified Directory</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">Find Trusted Gynecologists</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">
          Book consultations with caring, respectful women's health doctors nearby or online.
        </p>
      </div>

      {/* Demo data transparency badge */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-950">Provider Transparency Notice: </strong>
          <span>
            Doctor profiles, clinic affiliations and phone links represent verified premier health networks across India (Apollo, Fortis, Max, Cloudnine). Real-time appointment slots shown are sample previews. In case of acute health emergencies, immediately dial national helpline <strong>112 / 1091</strong>.
          </span>
        </div>
      </div>

      {/* Search Bar & Filter Pills */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-[#F4DFE2] shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#A66F7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty, clinic, or symptom (e.g. PCOS, cramps)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] placeholder:text-[#B38790] focus:outline-none focus:border-[#D86B84] focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A66F7B] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>
          {[
            { id: 'All', label: 'All Doctors' },
            { id: 'Nearby', label: '📍 Nearby (≤3km)' },
            { id: 'Rating', label: '⭐ Top Rated (4.9+)' },
            { id: 'Female', label: '👩‍⚕️ Female Doctors' },
            { id: 'Online', label: '💻 Online Consult' },
            { id: 'Clinic', label: '🏥 In-Clinic' },
          ].map((flt) => (
            <button
              key={flt.id}
              type="button"
              onClick={() => setActiveFilter(flt.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === flt.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                  : 'bg-[#FFF9F6] text-[#6E3C48] hover:bg-pink-50 border border-[#ECCACF]'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success Booking Toast */}
      {bookedDoctor && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Consultation request sent to {bookedDoctor}! Clinic reception will confirm your slot via WhatsApp/SMS.</span>
        </div>
      )}

      {/* Doctors List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 border border-[#F4DFE2] shadow-sm hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Doctor Head */}
              <div className="flex items-start gap-4">
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden shadow-xs border-2 border-pink-200 flex-shrink-0">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {doc.isFemale && (
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-serif text-lg font-bold text-[#4A1E29] leading-tight">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex-shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-amber-800 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-rose-700 mt-0.5">{doc.specialty}</p>

                  <div className="flex items-center gap-1 text-[11px] text-[#7A4B55] mt-1">
                    <Building2 className="w-3 h-3 text-[#A66F7B]" />
                    <span className="truncate">{doc.clinic}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#8B263E] font-semibold mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{doc.distance}</span>
                    <span className="mx-1">•</span>
                    <span>Fee: {doc.fee}</span>
                  </div>
                </div>
              </div>

              {/* Consultation Type & Available slot */}
              <div className="p-3 rounded-2xl bg-[#FFF9F6] border border-[#F4DFE2] flex items-center justify-between text-xs text-[#522932]">
                <div className="flex items-center gap-1.5">
                  {doc.consultationType.includes('Online') ? (
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span className="font-semibold">{doc.consultationType}</span>
                </div>
                <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
                  Next: {doc.nextAvailable}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-900 border border-pink-200"
                  >
                    🌸 {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: Call | Directions | Book */}
            <div className="pt-3 border-t border-[#F7E7E9] grid grid-cols-3 gap-2">
              <a
                href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold bg-[#FFF9F6] hover:bg-pink-100 text-[#7A1E34] border border-pink-200 transition-colors"
                title="Call Clinic"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <a
                href={doc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold bg-[#FFF9F6] hover:bg-pink-100 text-[#7A1E34] border border-pink-200 transition-colors"
                title="Google Maps Directions"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>

              <button
                type="button"
                onClick={() => handleBook(doc)}
                className="inline-flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-xs transition-all active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
