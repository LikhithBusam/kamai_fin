"""
StoreBuddy UAE - VAT Compliance Agent
Handles UAE Federal Tax Authority (FTA) VAT requirements
"""

import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

class VATAgent:
    """
    UAE VAT Compliance Agent
    - Standard rate: 5%
    - Zero-rated: Exports, healthcare, education
    - Exempt: Residential rent, life insurance
    - TRN format: 15 digits starting with 100
    """
    
    # UAE VAT rates
    VAT_RATES = {
        'standard': 0.05,        # 5% standard
        'zero_rated': 0.00,      # 0% for exports, healthcare, education
        'exempt': None           # Exempt - no VAT charged or claimed
    }
    
    # Category to VAT rate mapping
    CATEGORY_VAT_RATES = {
        'general_goods': 'standard',
        'electronics': 'standard',
        'grocery': 'standard',
        'pharmacy_general': 'standard',
        'pharmacy_healthcare': 'zero_rated',
        'textiles': 'standard',
        'auto_parts': 'standard',
        'food_beverage': 'standard',
        'exports': 'zero_rated',
        'education': 'zero_rated',
        'residential_rent': 'exempt',
        'life_insurance': 'exempt'
    }
    
    # VAT filing thresholds
    THRESHOLDS = {
        'mandatory_registration': 375000,  # AED - must register if exceeded
        'voluntary_registration': 187500,  # AED - can register if exceeded
        'filing_period': 'quarterly'       # Most SMEs file quarterly
    }

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')

    async def calculate_vat_position(self, user_id: str, period: str = None) -> Dict[str, Any]:
        """
        Calculate VAT position for filing period
        
        Args:
            user_id: Shop owner's UUID
            period: Optional period (format: 'YYYY-Q1/Q2/Q3/Q4')
        
        Returns:
            VAT position with output, input, and net VAT
        """
        try:
            # Default to current quarter
            if not period:
                now = datetime.now()
                quarter = (now.month - 1) // 3 + 1
                period = f"{now.year}-Q{quarter}"
            
            # Parse period
            year, quarter = period.split('-Q')
            start_month = (int(quarter) - 1) * 3 + 1
            start_date = datetime(int(year), start_month, 1)
            end_date = start_date + timedelta(days=91)
            
            # Get sales (output VAT)
            sales_data = await self._get_sales(user_id, start_date, end_date)
            
            # Get purchases (input VAT)
            purchases_data = await self._get_purchases(user_id, start_date, end_date)
            
            # Calculate output VAT (what you collected)
            output_vat = sales_data['total_vat']
            standard_rated_sales = sales_data['standard_rated']
            zero_rated_sales = sales_data['zero_rated']
            exempt_sales = sales_data['exempt']
            
            # Calculate input VAT (what you paid)
            input_vat = purchases_data['total_vat']
            
            # Net VAT position
            net_vat = output_vat - input_vat
            
            return {
                'status': 'success',
                'period': period,
                'period_start': start_date.isoformat(),
                'period_end': end_date.isoformat(),
                'sales': {
                    'total_sales': sales_data['total_amount'],
                    'standard_rated': standard_rated_sales,
                    'zero_rated': zero_rated_sales,
                    'exempt': exempt_sales,
                    'output_vat': output_vat
                },
                'purchases': {
                    'total_purchases': purchases_data['total_amount'],
                    'input_vat': input_vat
                },
                'net_vat': net_vat,
                'position': 'PAYABLE' if net_vat > 0 else 'REFUNDABLE',
                'amount_due': abs(net_vat),
                'due_date': self._get_filing_deadline(period),
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def generate_vat_return(self, user_id: str, period: str = None) -> Dict[str, Any]:
        """
        Generate VAT return data for FTA filing
        """
        try:
            position = await self.calculate_vat_position(user_id, period)
            
            if position['status'] != 'success':
                return position
            
            # Get business profile for TRN
            profile = await self._get_business_profile(user_id)
            
            return {
                'status': 'success',
                'return_data': {
                    'trn': profile.get('trn', 'NOT_REGISTERED'),
                    'business_name': profile.get('business_name', ''),
                    'period': position['period'],
                    'boxes': {
                        'box_1_standard_rated_sales': position['sales']['standard_rated'],
                        'box_2_output_vat_standard': round(position['sales']['standard_rated'] * 0.05, 2),
                        'box_3_zero_rated_sales': position['sales']['zero_rated'],
                        'box_4_exempt_sales': position['sales']['exempt'],
                        'box_5_total_sales': position['sales']['total_sales'],
                        'box_6_standard_rated_expenses': position['purchases']['total_purchases'],
                        'box_7_input_vat': position['purchases']['input_vat'],
                        'box_8_net_vat': position['net_vat'],
                        'box_9_vat_payable': max(0, position['net_vat']),
                        'box_10_vat_refundable': abs(min(0, position['net_vat']))
                    },
                    'filing_deadline': position['due_date'],
                    'payment_deadline': position['due_date']
                },
                'recommendations': self._get_filing_recommendations(position),
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def check_registration_status(self, user_id: str) -> Dict[str, Any]:
        """
        Check if business needs to register for VAT
        """
        try:
            # Get business profile
            profile = await self._get_business_profile(user_id)
            
            # Get last 12 months sales
            end_date = datetime.now()
            start_date = end_date - timedelta(days=365)
            sales_data = await self._get_sales(user_id, start_date, end_date)
            
            annual_revenue = sales_data['total_amount']
            
            # Check registration status
            is_registered = bool(profile.get('trn'))
            
            if annual_revenue > self.THRESHOLDS['mandatory_registration']:
                status = 'MANDATORY'
                message = 'Registration is mandatory. Your revenue exceeds AED 375,000'
                message_arabic = 'التسجيل إلزامي. إيراداتك تتجاوز 375,000 درهم'
            elif annual_revenue > self.THRESHOLDS['voluntary_registration']:
                status = 'VOLUNTARY'
                message = 'Registration is optional. Your revenue exceeds AED 187,500'
                message_arabic = 'التسجيل اختياري. إيراداتك تتجاوز 187,500 درهم'
            else:
                status = 'NOT_REQUIRED'
                message = 'Registration not required. Revenue below threshold'
                message_arabic = 'التسجيل غير مطلوب. الإيرادات أقل من الحد'
            
            return {
                'status': 'success',
                'is_registered': is_registered,
                'trn': profile.get('trn'),
                'annual_revenue': annual_revenue,
                'registration_status': status,
                'message': message,
                'message_arabic': message_arabic,
                'thresholds': self.THRESHOLDS,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def validate_trn(self, trn: str) -> Dict[str, Any]:
        """
        Validate UAE TRN format
        Format: 15 digits starting with 100
        """
        # Remove spaces and dashes
        trn_clean = trn.replace(' ', '').replace('-', '')
        
        errors = []
        
        if not trn_clean.isdigit():
            errors.append('TRN must contain only digits')
        
        if len(trn_clean) != 15:
            errors.append(f'TRN must be 15 digits (got {len(trn_clean)})')
        
        if not trn_clean.startswith('100'):
            errors.append('TRN must start with 100')
        
        return {
            'status': 'success' if not errors else 'invalid',
            'trn': trn_clean,
            'is_valid': len(errors) == 0,
            'errors': errors
        }

    async def get_vat_summary(self, user_id: str, months: int = 12) -> Dict[str, Any]:
        """
        Get VAT summary for past N months
        """
        try:
            summaries = []
            now = datetime.now()
            
            for i in range(months):
                month_start = datetime(now.year, now.month, 1) - timedelta(days=30 * i)
                month_end = month_start + timedelta(days=30)
                
                sales = await self._get_sales(user_id, month_start, month_end)
                purchases = await self._get_purchases(user_id, month_start, month_end)
                
                net_vat = sales['total_vat'] - purchases['total_vat']
                
                summaries.append({
                    'month': month_start.strftime('%Y-%m'),
                    'output_vat': sales['total_vat'],
                    'input_vat': purchases['total_vat'],
                    'net_vat': net_vat
                })
            
            return {
                'status': 'success',
                'summaries': summaries[::-1],  # Oldest first
                'total_output_vat': sum(s['output_vat'] for s in summaries),
                'total_input_vat': sum(s['input_vat'] for s in summaries),
                'total_net_vat': sum(s['net_vat'] for s in summaries),
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def calculate_vat_for_transaction(self, amount: float, category: str, is_inclusive: bool = True) -> Dict[str, Any]:
        """
        Calculate VAT for a single transaction
        
        Args:
            amount: Transaction amount in AED
            category: Transaction category
            is_inclusive: Whether the amount includes VAT
        
        Returns:
            Breakdown of base amount, VAT, and total
        """
        rate_type = self.CATEGORY_VAT_RATES.get(category, 'standard')
        rate = self.VAT_RATES.get(rate_type, 0.05)
        
        if rate is None:  # Exempt
            return {
                'base_amount': amount,
                'vat_rate': 0,
                'vat_type': 'exempt',
                'vat_amount': 0,
                'total_amount': amount,
                'currency': 'AED'
            }
        
        if is_inclusive:
            # Amount includes VAT, extract it
            base_amount = amount / (1 + rate)
            vat_amount = amount - base_amount
        else:
            # Amount excludes VAT, add it
            base_amount = amount
            vat_amount = amount * rate
        
        return {
            'base_amount': round(base_amount, 2),
            'vat_rate': rate,
            'vat_type': rate_type,
            'vat_amount': round(vat_amount, 2),
            'total_amount': round(base_amount + vat_amount, 2),
            'currency': 'AED'
        }

    def _get_filing_deadline(self, period: str) -> str:
        """Get filing deadline for a period (28th of month after quarter ends)"""
        year, quarter = period.split('-Q')
        quarter = int(quarter)
        end_month = quarter * 3
        deadline_month = end_month + 1 if end_month < 12 else 1
        deadline_year = int(year) if end_month < 12 else int(year) + 1
        
        return f"{deadline_year}-{deadline_month:02d}-28"

    def _get_filing_recommendations(self, position: Dict) -> List[Dict]:
        """Generate filing recommendations"""
        recommendations = []
        
        if position['position'] == 'PAYABLE':
            recommendations.append({
                'type': 'PAYMENT',
                'message': f"Set aside AED {position['amount_due']:,.2f} for VAT payment",
                'message_arabic': f"خصص {position['amount_due']:,.2f} درهم لدفع ضريبة القيمة المضافة",
                'priority': 'high'
            })
        
        if position['sales']['zero_rated'] > 0:
            recommendations.append({
                'type': 'DOCUMENTATION',
                'message': 'Ensure export documentation is complete for zero-rated sales',
                'message_arabic': 'تأكد من اكتمال وثائق التصدير للمبيعات بنسبة صفر',
                'priority': 'medium'
            })
        
        if position['purchases']['input_vat'] < position['sales']['output_vat'] * 0.3:
            recommendations.append({
                'type': 'INPUT_VAT',
                'message': 'Collect VAT invoices for all business purchases to claim input VAT',
                'message_arabic': 'اجمع فواتير ضريبة القيمة المضافة لجميع مشتريات العمل',
                'priority': 'medium'
            })
        
        return recommendations

    async def _get_business_profile(self, user_id: str) -> Dict:
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
                return data[0] if data else {}
        return {}

    async def _get_sales(self, user_id: str, start_date: datetime, end_date: datetime) -> Dict:
        """Fetch sales data"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'transaction_type': 'eq.sale',
                    'date': f'gte.{start_date.isoformat()}',
                    'date': f'lt.{end_date.isoformat()}',
                    'select': '*'
                }
            )
            if response.status_code == 200:
                transactions = response.json()
                
                standard = sum(t.get('amount_aed', 0) for t in transactions if t.get('vat_category') != 'zero_rated' and t.get('vat_category') != 'exempt')
                zero_rated = sum(t.get('amount_aed', 0) for t in transactions if t.get('vat_category') == 'zero_rated')
                exempt = sum(t.get('amount_aed', 0) for t in transactions if t.get('vat_category') == 'exempt')
                
                return {
                    'total_amount': standard + zero_rated + exempt,
                    'standard_rated': standard,
                    'zero_rated': zero_rated,
                    'exempt': exempt,
                    'total_vat': sum(t.get('vat_amount_aed', 0) for t in transactions)
                }
        return {'total_amount': 0, 'standard_rated': 0, 'zero_rated': 0, 'exempt': 0, 'total_vat': 0}

    async def _get_purchases(self, user_id: str, start_date: datetime, end_date: datetime) -> Dict:
        """Fetch purchase data"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'transaction_type': 'eq.expense',
                    'date': f'gte.{start_date.isoformat()}',
                    'date': f'lt.{end_date.isoformat()}',
                    'select': '*'
                }
            )
            if response.status_code == 200:
                transactions = response.json()
                return {
                    'total_amount': sum(t.get('amount_aed', 0) for t in transactions),
                    'total_vat': sum(t.get('vat_amount_aed', 0) for t in transactions)
                }
        return {'total_amount': 0, 'total_vat': 0}


# Singleton instance
vat_agent = VATAgent()
