"""
StoreBuddy UAE - UAE Programs Agent
Matches businesses with UAE SME support programs
"""

import os
from datetime import datetime
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

class UAEProgramsAgent:
    """
    Matches UAE shop owners with government and private SME programs:
    - Dubai SME (all businesses)
    - Khalifa Fund (Emiratis only)
    - MBRF (all nationalities)
    - Emirates Development Bank (priority sectors)
    - in5 (startups)
    - Sheraa (Sharjah startups)
    - RAK SME (Ras Al Khaimah)
    - Expo Live (innovation)
    """
    
    # Program eligibility criteria
    PROGRAMS = {
        'dubai_sme': {
            'name': 'Dubai SME',
            'name_arabic': 'مؤسسة محمد بن راشد لتنمية المشاريع الصغيرة والمتوسطة',
            'type': 'government',
            'emirates': ['dubai'],
            'nationalities': 'all',
            'business_age_years': 0,  # Can be new
            'max_employees': 250,
            'annual_revenue_max': 250000000,  # AED 250M
            'sectors': ['all'],
            'benefits': [
                'Business incubation',
                'Training programs',
                'Mentorship',
                'Networking events',
                'Government procurement priority'
            ],
            'benefits_arabic': [
                'حاضنات الأعمال',
                'برامج تدريبية',
                'إرشاد ودعم',
                'فعاليات التواصل',
                'أولوية المشتريات الحكومية'
            ],
            'website': 'https://www.sme.ae/',
            'funding_available': False
        },
        'khalifa_fund': {
            'name': 'Khalifa Fund for Enterprise Development',
            'name_arabic': 'صندوق خليفة لتطوير المشاريع',
            'type': 'government',
            'emirates': ['abu_dhabi', 'all'],  # HQ in AD but serves all
            'nationalities': 'emirati_only',
            'business_age_years': 0,
            'max_employees': 100,
            'annual_revenue_max': 50000000,  # AED 50M
            'sectors': ['all'],
            'benefits': [
                'Interest-free loans up to AED 3M',
                'Business coaching',
                'Training programs',
                'Export support'
            ],
            'benefits_arabic': [
                'قروض بدون فوائد حتى 3 مليون درهم',
                'تدريب على الأعمال',
                'برامج تدريبية',
                'دعم التصدير'
            ],
            'website': 'https://www.khalifafund.gov.ae/',
            'funding_available': True,
            'max_funding': 3000000
        },
        'mbrf': {
            'name': 'Mohammed Bin Rashid Innovation Fund',
            'name_arabic': 'صندوق محمد بن راشد للابتكار',
            'type': 'government',
            'emirates': ['all'],
            'nationalities': 'all',
            'business_age_years': 1,
            'max_employees': None,  # No limit
            'annual_revenue_max': None,
            'sectors': ['technology', 'innovation', 'manufacturing'],
            'benefits': [
                'Innovation funding',
                'R&D grants',
                'Patent support',
                'Technology transfer'
            ],
            'benefits_arabic': [
                'تمويل الابتكار',
                'منح البحث والتطوير',
                'دعم براءات الاختراع',
                'نقل التكنولوجيا'
            ],
            'website': 'https://www.mbrif.ae/',
            'funding_available': True,
            'max_funding': 5000000
        },
        'edb': {
            'name': 'Emirates Development Bank',
            'name_arabic': 'مصرف الإمارات للتنمية',
            'type': 'government_bank',
            'emirates': ['all'],
            'nationalities': 'all',
            'business_age_years': 1,
            'max_employees': 250,
            'annual_revenue_max': 250000000,
            'sectors': ['manufacturing', 'technology', 'healthcare', 'food_processing', 'renewable_energy'],
            'benefits': [
                'Competitive financing',
                'Working capital loans',
                'Equipment financing',
                'Trade finance'
            ],
            'benefits_arabic': [
                'تمويل تنافسي',
                'قروض رأس المال العامل',
                'تمويل المعدات',
                'تمويل التجارة'
            ],
            'website': 'https://www.edb.gov.ae/',
            'funding_available': True,
            'max_funding': 10000000
        },
        'in5': {
            'name': 'in5 Innovation Centers',
            'name_arabic': 'مراكز الابتكار in5',
            'type': 'accelerator',
            'emirates': ['dubai'],
            'nationalities': 'all',
            'business_age_years': 0,  # Startups welcome
            'max_employees': 20,
            'annual_revenue_max': 10000000,
            'sectors': ['technology', 'media', 'design'],
            'benefits': [
                'Co-working space',
                'Visa sponsorship',
                '100% ownership',
                'Mentorship',
                'Access to investors'
            ],
            'benefits_arabic': [
                'مساحة عمل مشتركة',
                'كفالة التأشيرة',
                'ملكية 100%',
                'إرشاد',
                'الوصول للمستثمرين'
            ],
            'website': 'https://infive.ae/',
            'funding_available': False
        },
        'sheraa': {
            'name': 'Sheraa Sharjah Entrepreneurship Center',
            'name_arabic': 'مركز الشارقة لريادة الأعمال شرّاع',
            'type': 'accelerator',
            'emirates': ['sharjah'],
            'nationalities': 'all',
            'business_age_years': 0,
            'max_employees': 50,
            'annual_revenue_max': 20000000,
            'sectors': ['all'],
            'benefits': [
                'Startup incubation',
                'Seed funding',
                'Mentorship',
                'Office space',
                'Legal support'
            ],
            'benefits_arabic': [
                'حاضنة الشركات الناشئة',
                'تمويل تأسيسي',
                'إرشاد',
                'مساحة مكتبية',
                'دعم قانوني'
            ],
            'website': 'https://sheraa.ae/',
            'funding_available': True,
            'max_funding': 500000
        },
        'rak_sme': {
            'name': 'RAK SME',
            'name_arabic': 'دائرة المشاريع الصغيرة والمتوسطة رأس الخيمة',
            'type': 'government',
            'emirates': ['rak'],
            'nationalities': 'all',
            'business_age_years': 0,
            'max_employees': 100,
            'annual_revenue_max': 50000000,
            'sectors': ['all'],
            'benefits': [
                'Business licensing support',
                'Training',
                'Networking',
                'Exhibition support'
            ],
            'benefits_arabic': [
                'دعم ترخيص الأعمال',
                'تدريب',
                'تواصل',
                'دعم المعارض'
            ],
            'website': 'https://raksme.ae/',
            'funding_available': False
        },
        'expo_live': {
            'name': 'Expo Live Innovation Impact Grant',
            'name_arabic': 'منحة إكسبو لايف للابتكار',
            'type': 'grant',
            'emirates': ['all'],
            'nationalities': 'all',
            'business_age_years': 0,
            'max_employees': None,
            'annual_revenue_max': None,
            'sectors': ['sustainability', 'social_impact', 'innovation'],
            'benefits': [
                'Grant up to $100K',
                'Global exposure',
                'Mentorship',
                'Network access'
            ],
            'benefits_arabic': [
                'منحة حتى 100 ألف دولار',
                'انتشار عالمي',
                'إرشاد',
                'الوصول للشبكات'
            ],
            'website': 'https://www.expo2020dubai.com/en/programmes/expo-live',
            'funding_available': True,
            'max_funding': 367000  # ~$100K in AED
        }
    }

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')

    async def find_matching_programs(self, user_id: str) -> Dict[str, Any]:
        """
        Find programs matching the business profile
        
        Args:
            user_id: Shop owner's UUID
        
        Returns:
            List of matching programs with eligibility details
        """
        try:
            # Get business profile
            profile = await self._get_business_profile(user_id)
            if not profile:
                return {'status': 'error', 'message': 'Business profile not found'}
            
            # Get additional business metrics
            metrics = await self._get_business_metrics(user_id)
            
            # Check each program
            matches = []
            for program_id, program in self.PROGRAMS.items():
                eligibility = self._check_eligibility(profile, metrics, program)
                
                if eligibility['eligible']:
                    matches.append({
                        'program_id': program_id,
                        'name': program['name'],
                        'name_arabic': program['name_arabic'],
                        'type': program['type'],
                        'match_score': eligibility['score'],
                        'benefits': program['benefits'],
                        'benefits_arabic': program['benefits_arabic'],
                        'funding_available': program['funding_available'],
                        'max_funding': program.get('max_funding', 0),
                        'website': program['website'],
                        'eligibility_notes': eligibility['notes'],
                        'missing_requirements': eligibility.get('missing', [])
                    })
            
            # Sort by match score
            matches.sort(key=lambda x: -x['match_score'])
            
            # Generate summary
            total_potential_funding = sum(
                m['max_funding'] for m in matches if m['funding_available']
            )
            
            return {
                'status': 'success',
                'total_matches': len(matches),
                'funding_programs': len([m for m in matches if m['funding_available']]),
                'total_potential_funding': total_potential_funding,
                'matches': matches,
                'business_summary': {
                    'emirate': profile.get('emirate', ''),
                    'nationality': profile.get('owner_nationality', ''),
                    'business_type': profile.get('business_type', ''),
                    'employees': metrics.get('employee_count', 0),
                    'annual_revenue': metrics.get('annual_revenue', 0)
                },
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def get_program_details(self, program_id: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific program
        """
        program = self.PROGRAMS.get(program_id)
        if not program:
            return {'status': 'error', 'message': 'Program not found'}
        
        # Fetch from database for any additional details
        db_program = await self._get_program_from_db(program_id)
        
        return {
            'status': 'success',
            'program_id': program_id,
            **program,
            'application_process': db_program.get('application_process', []) if db_program else [],
            'required_documents': db_program.get('required_documents', []) if db_program else [],
            'success_stories': db_program.get('success_stories', 0) if db_program else 0
        }

    async def apply_for_program(self, user_id: str, program_id: str) -> Dict[str, Any]:
        """
        Record interest in a program and provide application guidance
        """
        try:
            program = self.PROGRAMS.get(program_id)
            if not program:
                return {'status': 'error', 'message': 'Program not found'}
            
            # Check eligibility first
            profile = await self._get_business_profile(user_id)
            metrics = await self._get_business_metrics(user_id)
            eligibility = self._check_eligibility(profile, metrics, program)
            
            if not eligibility['eligible']:
                return {
                    'status': 'not_eligible',
                    'message': 'You are not eligible for this program',
                    'reasons': eligibility.get('missing', [])
                }
            
            # Record the application interest
            await self._record_program_match(user_id, program_id, 'applied')
            
            # Generate application checklist
            checklist = self._generate_application_checklist(program, profile)
            
            return {
                'status': 'success',
                'program_id': program_id,
                'program_name': program['name'],
                'website': program['website'],
                'application_checklist': checklist,
                'next_steps': [
                    {
                        'step': 1,
                        'action': 'Visit the program website',
                        'action_arabic': 'زيارة موقع البرنامج',
                        'url': program['website']
                    },
                    {
                        'step': 2,
                        'action': 'Prepare required documents',
                        'action_arabic': 'تحضير الوثائق المطلوبة'
                    },
                    {
                        'step': 3,
                        'action': 'Submit online application',
                        'action_arabic': 'تقديم الطلب عبر الإنترنت'
                    },
                    {
                        'step': 4,
                        'action': 'Schedule assessment meeting',
                        'action_arabic': 'جدولة اجتماع التقييم'
                    }
                ]
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def _check_eligibility(self, profile: Dict, metrics: Dict, program: Dict) -> Dict:
        """Check if business is eligible for a program"""
        score = 100
        notes = []
        missing = []
        
        # Check emirate
        emirates = program.get('emirates', ['all'])
        if 'all' not in emirates:
            business_emirate = profile.get('emirate', '').lower()
            if business_emirate not in emirates:
                score -= 100  # Disqualified
                missing.append(f"Must be in {', '.join(emirates)}")
        
        # Check nationality
        nationality_req = program.get('nationalities', 'all')
        if nationality_req == 'emirati_only':
            owner_nationality = profile.get('owner_nationality', '').lower()
            if owner_nationality not in ['emirati', 'uae', 'emirati national']:
                score -= 100
                missing.append("Emirati ownership required")
        
        # Check employees
        max_employees = program.get('max_employees')
        if max_employees:
            current_employees = metrics.get('employee_count', 0)
            if current_employees > max_employees:
                score -= 30
                missing.append(f"Maximum {max_employees} employees")
        
        # Check revenue
        max_revenue = program.get('annual_revenue_max')
        if max_revenue:
            annual_revenue = metrics.get('annual_revenue', 0)
            if annual_revenue > max_revenue:
                score -= 30
                missing.append(f"Maximum revenue AED {max_revenue:,}")
        
        # Check business age
        min_age = program.get('business_age_years', 0)
        if min_age > 0:
            license_date = profile.get('license_issue_date')
            if license_date:
                age_years = (datetime.now() - datetime.fromisoformat(
                    license_date.replace('Z', '+00:00')
                )).days / 365
                if age_years < min_age:
                    score -= 20
                    missing.append(f"Business must be {min_age}+ years old")
        
        # Check sector
        sectors = program.get('sectors', ['all'])
        if 'all' not in sectors:
            business_type = profile.get('business_type', '').lower()
            if not any(s in business_type for s in sectors):
                score -= 20
                notes.append(f"Priority sectors: {', '.join(sectors)}")
        
        # Bonus for funding programs if business needs capital
        if program.get('funding_available'):
            score += 10
            notes.append("Funding available")
        
        return {
            'eligible': score > 0,
            'score': max(0, min(100, score)),
            'notes': notes,
            'missing': missing
        }

    def _generate_application_checklist(self, program: Dict, profile: Dict) -> List[Dict]:
        """Generate document checklist for application"""
        base_docs = [
            {
                'document': 'Trade License',
                'document_arabic': 'الرخصة التجارية',
                'required': True,
                'status': 'ready' if profile.get('trade_license_number') else 'missing'
            },
            {
                'document': 'Emirates ID (Owner)',
                'document_arabic': 'الهوية الإماراتية للمالك',
                'required': True,
                'status': 'unknown'
            },
            {
                'document': 'Bank Statement (6 months)',
                'document_arabic': 'كشف حساب بنكي (6 أشهر)',
                'required': True,
                'status': 'unknown'
            },
            {
                'document': 'Business Plan',
                'document_arabic': 'خطة العمل',
                'required': program.get('funding_available', False),
                'status': 'unknown'
            },
            {
                'document': 'Financial Statements',
                'document_arabic': 'البيانات المالية',
                'required': program.get('funding_available', False),
                'status': 'unknown'
            }
        ]
        
        if program.get('nationalities') == 'emirati_only':
            base_docs.append({
                'document': 'Family Book (Khulasat Al Qaid)',
                'document_arabic': 'خلاصة القيد',
                'required': True,
                'status': 'unknown'
            })
        
        return base_docs

    async def _get_business_profile(self, user_id: str) -> Optional[Dict]:
        """Fetch business profile"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/business_profiles",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={'user_id': f'eq.{user_id}', 'select': '*'}
            )
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        return None

    async def _get_business_metrics(self, user_id: str) -> Dict:
        """Fetch business metrics"""
        # Get annual revenue estimate
        async with httpx.AsyncClient() as client:
            # Get last 12 months sales
            response = await client.get(
                f"{self.supabase_url}/rest/v1/transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'transaction_type': 'eq.sale',
                    'select': 'amount_aed'
                }
            )
            
            annual_revenue = 0
            if response.status_code == 200:
                transactions = response.json()
                # Estimate annual from recent data
                total = sum(t.get('amount_aed', 0) for t in transactions)
                months_of_data = len(set(t.get('date', '')[:7] for t in transactions if t.get('date')))
                if months_of_data > 0:
                    annual_revenue = (total / months_of_data) * 12
        
        return {
            'annual_revenue': annual_revenue,
            'employee_count': 5  # Default - would come from business profile
        }

    async def _get_program_from_db(self, program_id: str) -> Optional[Dict]:
        """Fetch program details from database"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/uae_sme_programs",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={'program_code': f'eq.{program_id}', 'select': '*'}
            )
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        return None

    async def _record_program_match(self, user_id: str, program_id: str, status: str):
        """Record user's interest in a program"""
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{self.supabase_url}/rest/v1/user_matched_programs",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}',
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                json={
                    'user_id': user_id,
                    'program_id': program_id,
                    'status': status,
                    'matched_at': datetime.now().isoformat()
                }
            )


# Singleton instance
uae_programs_agent = UAEProgramsAgent()
