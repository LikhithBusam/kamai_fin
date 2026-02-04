// StoreBuddy - UAE SME Programs Page
// Government and private sector support programs

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { programsAPI } from '@/services/uaeApi';
import { formatAED, getEmirateName } from '@/lib/uaeUtils';
import type { UAEProgram, ProgramMatch } from '@/types/uae';
import {
  Building2,
  Landmark,
  Briefcase,
  GraduationCap,
  Rocket,
  Globe,
  Lightbulb,
  Users,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  ExternalLink,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';

// UAE Programs Data
const UAE_PROGRAMS: UAEProgram[] = [
  {
    id: 'dubai_sme',
    name: 'Dubai SME',
    name_ar: 'دبي للمشاريع الصغيرة',
    description: 'Government initiative supporting SMEs in Dubai with funding, training, and market access',
    provider: 'Dubai Economy',
    type: 'government',
    emirates: ['dubai'],
    eligibility: {
      business_types: ['all'],
      nationalities: ['all'],
      min_years: 0,
      max_revenue: 250000000,
    },
    benefits: [
      'Up to AED 15M funding',
      'Business training programs',
      'Networking events',
      'Market access support',
    ],
    funding_min: 50000,
    funding_max: 15000000,
    website: 'https://dubaisme.ae',
    icon: 'building',
  },
  {
    id: 'khalifa_fund',
    name: 'Khalifa Fund',
    name_ar: 'صندوق خليفة',
    description: 'Supporting Emirati entrepreneurs with funding and development programs',
    provider: 'Government of Abu Dhabi',
    type: 'government',
    emirates: ['abu_dhabi'],
    eligibility: {
      business_types: ['all'],
      nationalities: ['emirati'],
      min_years: 0,
      max_revenue: 100000000,
    },
    benefits: [
      'Interest-free loans up to AED 3M',
      'Equity financing',
      'Mentorship programs',
      'Business incubation',
    ],
    funding_min: 50000,
    funding_max: 3000000,
    website: 'https://khalifafund.gov.ae',
    icon: 'landmark',
  },
  {
    id: 'mbrf',
    name: 'Mohammed Bin Rashid Fund (MBRF)',
    name_ar: 'صندوق محمد بن راشد',
    description: 'Supporting innovative SMEs across the UAE',
    provider: 'Federal Government',
    type: 'government',
    emirates: ['all'],
    eligibility: {
      business_types: ['all'],
      nationalities: ['all'],
      min_years: 1,
      max_revenue: 50000000,
    },
    benefits: [
      'Soft loans at competitive rates',
      'Business development support',
      'Training and capacity building',
    ],
    funding_min: 100000,
    funding_max: 5000000,
    website: 'https://mbrf.ae',
    icon: 'briefcase',
  },
  {
    id: 'edb',
    name: 'Emirates Development Bank (EDB)',
    name_ar: 'مصرف الإمارات للتنمية',
    description: 'Financing solutions for strategic sectors',
    provider: 'Federal Government',
    type: 'bank',
    emirates: ['all'],
    eligibility: {
      business_types: ['manufacturing', 'technology', 'healthcare', 'agriculture'],
      nationalities: ['all'],
      min_years: 2,
      max_revenue: 500000000,
    },
    benefits: [
      'Term loans up to AED 50M',
      'Working capital financing',
      'Trade finance',
      'Competitive interest rates',
    ],
    funding_min: 500000,
    funding_max: 50000000,
    website: 'https://edb.gov.ae',
    icon: 'building',
  },
  {
    id: 'in5',
    name: 'in5 (Dubai)',
    name_ar: 'إن فايف',
    description: 'Innovation center for startups in tech, media, and design',
    provider: 'TECOM Group',
    type: 'incubator',
    emirates: ['dubai'],
    eligibility: {
      business_types: ['technology', 'media', 'design'],
      nationalities: ['all'],
      min_years: 0,
      max_revenue: 10000000,
    },
    benefits: [
      '100% foreign ownership',
      'Subsidized office space',
      'Mentorship programs',
      'Investor networking',
      'Visa sponsorship',
    ],
    funding_min: 0,
    funding_max: 500000,
    website: 'https://infive.ae',
    icon: 'rocket',
  },
  {
    id: 'sheraa',
    name: 'Sheraa (Sharjah)',
    name_ar: 'شراع',
    description: "Sharjah's entrepreneurship center",
    provider: 'Government of Sharjah',
    type: 'incubator',
    emirates: ['sharjah'],
    eligibility: {
      business_types: ['all'],
      nationalities: ['all'],
      min_years: 0,
      max_revenue: 5000000,
    },
    benefits: [
      'Free co-working space',
      'Startup bootcamps',
      'Acceleration programs',
      'Seed funding opportunities',
    ],
    funding_min: 0,
    funding_max: 200000,
    website: 'https://sheraa.ae',
    icon: 'graduation',
  },
  {
    id: 'rak_sme',
    name: 'RAK SME',
    name_ar: 'راك للمشاريع الصغيرة',
    description: 'Supporting SMEs in Ras Al Khaimah',
    provider: 'Government of RAK',
    type: 'government',
    emirates: ['rak'],
    eligibility: {
      business_types: ['all'],
      nationalities: ['all'],
      min_years: 0,
      max_revenue: 50000000,
    },
    benefits: [
      'Business setup support',
      'Subsidized licenses',
      'Training programs',
      'Networking events',
    ],
    funding_min: 0,
    funding_max: 1000000,
    website: 'https://raksme.ae',
    icon: 'map',
  },
  {
    id: 'expo_live',
    name: 'Expo Live (Legacy)',
    name_ar: 'إكسبو لايف',
    description: 'Innovation impact grant program',
    provider: 'Expo 2020 Dubai',
    type: 'grant',
    emirates: ['all'],
    eligibility: {
      business_types: ['technology', 'sustainability', 'social_impact'],
      nationalities: ['all'],
      min_years: 0,
      max_revenue: 10000000,
    },
    benefits: [
      'Innovation grants up to USD 100K',
      'Global exposure',
      'Mentorship from experts',
      'Networking opportunities',
    ],
    funding_min: 0,
    funding_max: 367000,
    website: 'https://expo2020dubai.com',
    icon: 'globe',
  },
];

export default function UAEProgramsPage() {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  
  // State
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<UAEProgram[]>(UAE_PROGRAMS);
  const [matches, setMatches] = useState<ProgramMatch[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<UAEProgram | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEmirate, setFilterEmirate] = useState<string>('all');
  
  const userId = 'demo-user';

  // Fetch program matches
  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await programsAPI.findMatches(userId) as { data?: typeof matches };
        if (res?.data) {
          setMatches(res.data);
        }
      } catch (err) {
        console.error('Programs fetch error:', err);
      }
    }
    
    fetchMatches();
  }, [userId]);

  // Get icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'building': return Building2;
      case 'landmark': return Landmark;
      case 'briefcase': return Briefcase;
      case 'graduation': return GraduationCap;
      case 'rocket': return Rocket;
      case 'globe': return Globe;
      case 'map': return MapPin;
      default: return Lightbulb;
    }
  };

  // Get type badge color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'government': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Government' };
      case 'bank': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Bank' };
      case 'incubator': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Incubator' };
      case 'grant': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Grant' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Other' };
    }
  };

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesEmirate = filterEmirate === 'all' || 
      program.emirates.includes('all') || 
      program.emirates.includes(filterEmirate);
    return matchesType && matchesEmirate;
  });

  // Check eligibility match
  const getMatchScore = (programId: string): number | null => {
    const match = matches.find(m => m.program_id === programId);
    return match?.match_score || null;
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className={`w-5 h-5 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('programs.title')}</h1>
              <p className="text-sm text-gray-500">{programs.length} programs available</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className={`flex flex-wrap gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Type Filter */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="government">Government</option>
              <option value="bank">Bank</option>
              <option value="incubator">Incubator</option>
              <option value="grant">Grant</option>
            </select>
          </div>
          
          {/* Emirate Filter */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="w-4 h-4 text-gray-400" />
            <select
              value={filterEmirate}
              onChange={(e) => setFilterEmirate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Emirates</option>
              <option value="dubai">Dubai</option>
              <option value="abu_dhabi">Abu Dhabi</option>
              <option value="sharjah">Sharjah</option>
              <option value="ajman">Ajman</option>
              <option value="rak">Ras Al Khaimah</option>
              <option value="fujairah">Fujairah</option>
              <option value="uaq">Umm Al Quwain</option>
            </select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => {
            const Icon = getIcon(program.icon || 'building');
            const typeBadge = getTypeBadge(program.type);
            const matchScore = getMatchScore(program.id);
            
            return (
              <div
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-emerald-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <h3 className="font-semibold text-gray-900">
                          {language === 'ar' && program.name_ar ? program.name_ar : program.name}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge.bg} ${typeBadge.text}`}>
                          {typeBadge.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{program.provider}</p>
                    </div>
                    
                    {/* Match Score */}
                    {matchScore && (
                      <div className={`flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Star className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">{matchScore}%</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className={`text-sm text-gray-600 mt-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                    {program.description}
                  </p>
                  
                  {/* Funding */}
                  {(program.funding_min > 0 || program.funding_max > 0) && (
                    <div className={`flex items-center gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {program.funding_min > 0 ? formatAED(program.funding_min) : 'AED 0'} - {formatAED(program.funding_max)}
                      </span>
                    </div>
                  )}
                  
                  {/* Emirates */}
                  <div className={`flex items-center gap-2 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {program.emirates.map(emirate => (
                        <span key={emirate} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {emirate === 'all' ? 'All UAE' : getEmirateName(emirate, language)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Benefits Preview */}
                  <div className="mt-4 space-y-1">
                    {program.benefits.slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                    {program.benefits.length > 2 && (
                      <p className="text-xs text-gray-400">+{program.benefits.length - 2} more benefits</p>
                    )}
                  </div>
                </div>
                
                {/* Footer */}
                <div className={`px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-emerald-600 font-medium">{t('programs.learnMore')}</span>
                  <ArrowRight className={`w-4 h-4 text-emerald-600 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No programs found matching your filters</p>
          </div>
        )}
      </main>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          matchScore={getMatchScore(selectedProgram.id)}
        />
      )}
    </div>
  );
}

// Program Detail Modal
interface ProgramDetailModalProps {
  program: UAEProgram;
  onClose: () => void;
  matchScore: number | null;
}

function ProgramDetailModal({ program, onClose, matchScore }: ProgramDetailModalProps) {
  const { t, isRTL, language } = useLanguage();
  const typeBadge = getTypeBadgeLocal(program.type);
  
  function getTypeBadgeLocal(type: string) {
    switch (type) {
      case 'government': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Government' };
      case 'bank': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Bank' };
      case 'incubator': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Incubator' };
      case 'grant': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Grant' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Other' };
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className={`bg-white w-full sm:w-[540px] sm:rounded-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-lg font-bold text-gray-900">Program Details</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Program Info */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'ar' && program.name_ar ? program.name_ar : program.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge.bg} ${typeBadge.text}`}>
                  {typeBadge.label}
                </span>
              </div>
              <p className="text-gray-500">{program.provider}</p>
            </div>
          </div>
          
          {/* Match Score */}
          {matchScore && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Star className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-800">{matchScore}% Match</p>
                  <p className="text-sm text-emerald-600">Based on your business profile</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-gray-600">{program.description}</p>
          </div>
          
          {/* Funding */}
          {(program.funding_min > 0 || program.funding_max > 0) && (
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-2">{t('programs.fundingAvailable')}</h4>
              <p className="text-2xl font-bold text-green-700">
                {program.funding_min > 0 ? formatAED(program.funding_min) : 'AED 0'} - {formatAED(program.funding_max)}
              </p>
            </div>
          )}
          
          {/* Benefits */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
            <div className="space-y-2">
              {program.benefits.map((benefit, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Eligibility */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Eligibility</h4>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {program.eligibility.nationalities.includes('all') 
                    ? 'Open to all nationalities' 
                    : 'UAE Nationals only'}
                </span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {program.eligibility.min_years === 0 
                    ? 'New businesses welcome' 
                    : `Minimum ${program.eligibility.min_years} years in business`}
                </span>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {program.eligibility.business_types.includes('all')
                    ? 'All business types'
                    : program.eligibility.business_types.join(', ')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3 pt-4">
            <a
              href={program.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              {t('programs.applyNow')}
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
