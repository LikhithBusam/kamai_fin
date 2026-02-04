"""
StoreBuddy UAE - Profit Analysis Agent
Calculates true profit after ALL UAE-specific costs
"""

import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

class ProfitAnalysisAgent:
    """
    UAE-specific profit analysis considering:
    1. VAT implications (5% standard rate)
    2. High rent costs (Dubai/Abu Dhabi)
    3. Visa and labor costs
    4. Import duties and customs
    5. Seasonal variations (Ramadan, Eid, Summer)
    """
    
    # UAE retail industry benchmarks
    INDUSTRY_BENCHMARKS = {
        'grocery': {'gross_margin': 20, 'net_margin': 8},
        'electronics': {'gross_margin': 15, 'net_margin': 5},
        'pharmacy': {'gross_margin': 25, 'net_margin': 10},
        'cafeteria': {'gross_margin': 60, 'net_margin': 15},
        'textile': {'gross_margin': 40, 'net_margin': 12},
        'auto_parts': {'gross_margin': 30, 'net_margin': 10},
        'general_trading': {'gross_margin': 25, 'net_margin': 8},
    }
    
    # UAE-specific expense categories
    UAE_EXPENSE_CATEGORIES = [
        'rent',
        'dewa',  # Dubai Electricity & Water Authority
        'salaries',
        'visa_costs',
        'trade_license',
        'municipality_fees',
        'insurance',
        'marketing',
        'bank_charges',
        'pos_fees',
        'loan_emi',
        'internet_phone',
        'transportation'
    ]

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        self.openai_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT')
        self.openai_key = os.getenv('AZURE_OPENAI_KEY')
        self.openai_deployment = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-4')
    
    async def analyze(self, user_id: str, period: str = "monthly") -> Dict[str, Any]:
        """
        Main analysis method - calculates true profit after all costs
        
        Args:
            user_id: User's UUID
            period: 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
        
        Returns:
            Complete profit analysis with recommendations
        """
        try:
            # Get date range based on period
            start_date, end_date = self._get_date_range(period)
            
            # Fetch financial data
            sales_data = await self._get_sales(user_id, start_date, end_date)
            purchase_data = await self._get_purchases(user_id, start_date, end_date)
            expense_data = await self._get_expenses(user_id, start_date, end_date)
            business_profile = await self._get_business_profile(user_id)
            
            # Calculate profit metrics
            revenue = sales_data.get('total', 0)
            cogs = purchase_data.get('total', 0)
            gross_profit = revenue - cogs
            gross_margin = (gross_profit / revenue * 100) if revenue > 0 else 0
            
            # Calculate operating expenses
            operating_expenses = self._calculate_operating_expenses(expense_data)
            operating_profit = gross_profit - operating_expenses['total']
            
            # Calculate financial costs
            financial_costs = self._calculate_financial_costs(expense_data)
            
            # Calculate VAT position
            vat_position = self._calculate_vat_position(sales_data, purchase_data)
            
            # Net profit
            net_profit = operating_profit - financial_costs['total'] - max(0, vat_position['net_payable'])
            net_margin = (net_profit / revenue * 100) if revenue > 0 else 0
            
            # Identify profit leaks
            profit_leaks = self._identify_profit_leaks(expense_data, revenue, business_profile)
            
            # Get industry benchmark comparison
            sector = business_profile.get('business_sector', 'general_trading')
            benchmark = self.INDUSTRY_BENCHMARKS.get(sector, self.INDUSTRY_BENCHMARKS['general_trading'])
            benchmark_comparison = {
                'sector': sector,
                'your_gross_margin': round(gross_margin, 1),
                'industry_gross_margin': benchmark['gross_margin'],
                'your_net_margin': round(net_margin, 1),
                'industry_net_margin': benchmark['net_margin'],
                'gross_margin_status': 'above' if gross_margin > benchmark['gross_margin'] else 'below',
                'net_margin_status': 'above' if net_margin > benchmark['net_margin'] else 'below'
            }
            
            # Generate AI recommendations
            recommendations = await self._generate_recommendations(
                gross_margin, net_margin, profit_leaks, benchmark_comparison, expense_data
            )
            
            # Get trend data
            trend = await self._calculate_trend(user_id, net_profit, period)
            
            return {
                'status': 'success',
                'period': period,
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'revenue': round(revenue, 2),
                'cogs': round(cogs, 2),
                'gross_profit': round(gross_profit, 2),
                'gross_margin_percent': round(gross_margin, 1),
                'operating_expenses': operating_expenses,
                'operating_profit': round(operating_profit, 2),
                'financial_costs': financial_costs,
                'vat_position': vat_position,
                'net_profit': round(net_profit, 2),
                'net_margin_percent': round(net_margin, 1),
                'profit_leaks': profit_leaks,
                'benchmark_comparison': benchmark_comparison,
                'recommendations': recommendations,
                'trend': trend,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'period': period
            }
    
    def _get_date_range(self, period: str) -> tuple:
        """Get start and end dates based on period"""
        today = datetime.now().date()
        
        if period == 'daily':
            return today, today
        elif period == 'weekly':
            start = today - timedelta(days=today.weekday())
            return start, today
        elif period == 'monthly':
            start = today.replace(day=1)
            return start, today
        elif period == 'quarterly':
            quarter = (today.month - 1) // 3
            start = today.replace(month=quarter * 3 + 1, day=1)
            return start, today
        elif period == 'yearly':
            start = today.replace(month=1, day=1)
            return start, today
        else:
            # Default to monthly
            start = today.replace(day=1)
            return start, today
    
    async def _get_sales(self, user_id: str, start_date, end_date) -> Dict[str, Any]:
        """Fetch sales data from database"""
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
                    'transaction_date': f'gte.{start_date}&transaction_date=lte.{end_date}',
                    'select': 'amount_aed,vat_amount,total_amount,payment_method,vat_category'
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                total = sum(t.get('amount_aed', 0) for t in data)
                output_vat = sum(t.get('vat_amount', 0) for t in data)
                
                # Breakdown by payment method
                cash = sum(t.get('total_amount', 0) for t in data if t.get('payment_method') == 'cash')
                card = sum(t.get('total_amount', 0) for t in data if t.get('payment_method') in ['card', 'apple_pay', 'samsung_pay'])
                bank = sum(t.get('total_amount', 0) for t in data if t.get('payment_method') == 'bank_transfer')
                
                # Breakdown by VAT category
                standard = sum(t.get('amount_aed', 0) for t in data if t.get('vat_category') == 'standard')
                zero_rated = sum(t.get('amount_aed', 0) for t in data if t.get('vat_category') == 'zero_rated')
                exempt = sum(t.get('amount_aed', 0) for t in data if t.get('vat_category') == 'exempt')
                
                return {
                    'total': total,
                    'output_vat': output_vat,
                    'cash_sales': cash,
                    'card_sales': card,
                    'bank_sales': bank,
                    'standard_rated': standard,
                    'zero_rated': zero_rated,
                    'exempt': exempt,
                    'count': len(data)
                }
            return {'total': 0, 'output_vat': 0, 'count': 0}
    
    async def _get_purchases(self, user_id: str, start_date, end_date) -> Dict[str, Any]:
        """Fetch purchase data from database"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'transaction_type': 'eq.purchase',
                    'transaction_date': f'gte.{start_date}&transaction_date=lte.{end_date}',
                    'select': 'amount_aed,vat_amount,total_amount'
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                total = sum(t.get('amount_aed', 0) for t in data)
                input_vat = sum(t.get('vat_amount', 0) for t in data)
                
                return {
                    'total': total,
                    'input_vat': input_vat,
                    'count': len(data)
                }
            return {'total': 0, 'input_vat': 0, 'count': 0}
    
    async def _get_expenses(self, user_id: str, start_date, end_date) -> Dict[str, Any]:
        """Fetch expense data categorized by UAE expense types"""
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
                    'transaction_date': f'gte.{start_date}&transaction_date=lte.{end_date}',
                    'select': 'amount_aed,vat_amount,category_name'
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Categorize expenses
                expenses = {}
                for t in data:
                    category = t.get('category_name', 'other').lower().replace(' ', '_')
                    if category not in expenses:
                        expenses[category] = 0
                    expenses[category] += t.get('amount_aed', 0)
                
                return expenses
            return {}
    
    async def _get_business_profile(self, user_id: str) -> Dict[str, Any]:
        """Fetch business profile"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/business_profiles",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'select': '*'
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else {}
            return {}
    
    def _calculate_operating_expenses(self, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate total operating expenses with breakdown"""
        operating_categories = ['rent', 'shop_rent', 'dewa', 'salaries', 'staff_salary', 
                               'visa_costs', 'visa_&_labour', 'trade_license', 
                               'municipality_fees', 'insurance', 'marketing',
                               'internet_&_phone', 'transportation', 'maintenance']
        
        breakdown = {}
        total = 0
        
        for category, amount in expense_data.items():
            normalized = category.lower().replace(' ', '_')
            if any(op in normalized for op in operating_categories):
                breakdown[category] = amount
                total += amount
        
        return {
            'breakdown': breakdown,
            'total': round(total, 2)
        }
    
    def _calculate_financial_costs(self, expense_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate financial costs (bank charges, POS fees, loans)"""
        financial_categories = ['bank_charges', 'pos_fees', 'pos/card_fees', 'loan_emi', 'loan']
        
        breakdown = {}
        total = 0
        
        for category, amount in expense_data.items():
            normalized = category.lower().replace(' ', '_')
            if any(fin in normalized for fin in financial_categories):
                breakdown[category] = amount
                total += amount
        
        return {
            'breakdown': breakdown,
            'total': round(total, 2)
        }
    
    def _calculate_vat_position(self, sales_data: Dict, purchase_data: Dict) -> Dict[str, Any]:
        """Calculate VAT position"""
        output_vat = sales_data.get('output_vat', 0)
        input_vat = purchase_data.get('input_vat', 0)
        net = output_vat - input_vat
        
        return {
            'output_vat': round(output_vat, 2),
            'input_vat': round(input_vat, 2),
            'net_payable': round(net, 2) if net > 0 else 0,
            'net_refundable': round(abs(net), 2) if net < 0 else 0
        }
    
    def _identify_profit_leaks(self, expense_data: Dict, revenue: float, profile: Dict) -> List[Dict]:
        """Identify areas where profit is being lost"""
        leaks = []
        
        if revenue == 0:
            return leaks
        
        # Check rent ratio (should be < 10% of revenue)
        rent = expense_data.get('rent', 0) + expense_data.get('shop_rent', 0)
        rent_ratio = (rent / revenue) * 100 if revenue > 0 else 0
        if rent_ratio > 10:
            leaks.append({
                'category': 'Rent',
                'category_arabic': 'الإيجار',
                'amount': round(rent, 2),
                'percentage': round(rent_ratio, 1),
                'threshold': 10,
                'severity': 'high' if rent_ratio > 15 else 'medium',
                'message': f'Rent is {rent_ratio:.1f}% of revenue (should be <10%)',
                'message_arabic': f'الإيجار يشكل {rent_ratio:.1f}% من الإيرادات (يجب أن يكون أقل من 10%)'
            })
        
        # Check POS fees (should be < 2.5%)
        pos_fees = expense_data.get('pos_fees', 0) + expense_data.get('pos/card_fees', 0)
        pos_ratio = (pos_fees / revenue) * 100 if revenue > 0 else 0
        if pos_ratio > 2.5:
            leaks.append({
                'category': 'POS/Card Fees',
                'category_arabic': 'رسوم نقاط البيع',
                'amount': round(pos_fees, 2),
                'percentage': round(pos_ratio, 1),
                'threshold': 2.5,
                'severity': 'medium',
                'message': f'Card processing fees at {pos_ratio:.1f}% (negotiate for <2%)',
                'message_arabic': f'رسوم معالجة البطاقات {pos_ratio:.1f}% (تفاوض للحصول على أقل من 2%)'
            })
        
        # Check utilities (DEWA)
        dewa = expense_data.get('dewa', 0) + expense_data.get('dewa_(utilities)', 0)
        dewa_ratio = (dewa / revenue) * 100 if revenue > 0 else 0
        if dewa_ratio > 3:
            leaks.append({
                'category': 'DEWA (Utilities)',
                'category_arabic': 'ديوا (الكهرباء والماء)',
                'amount': round(dewa, 2),
                'percentage': round(dewa_ratio, 1),
                'threshold': 3,
                'severity': 'low',
                'message': f'Utilities at {dewa_ratio:.1f}% of revenue - check for inefficiencies',
                'message_arabic': f'المرافق تشكل {dewa_ratio:.1f}% من الإيرادات - تحقق من الكفاءة'
            })
        
        return leaks
    
    async def _generate_recommendations(self, gross_margin: float, net_margin: float, 
                                        profit_leaks: List, benchmark: Dict, 
                                        expenses: Dict) -> List[Dict]:
        """Generate AI-powered recommendations"""
        recommendations = []
        
        # Based on profit leaks
        for leak in profit_leaks:
            if leak['category'] == 'Rent' and leak['severity'] == 'high':
                recommendations.append({
                    'type': 'cost_reduction',
                    'priority': 'high',
                    'title': 'Negotiate rent or consider relocation',
                    'title_arabic': 'تفاوض على الإيجار أو فكر في الانتقال',
                    'description': f'Your rent is {leak["percentage"]}% of revenue. Consider negotiating with landlord or exploring more affordable locations.',
                    'potential_savings': round(leak['amount'] * 0.2, 2)  # 20% potential savings
                })
            
            if leak['category'] == 'POS/Card Fees':
                recommendations.append({
                    'type': 'cost_reduction',
                    'priority': 'medium',
                    'title': 'Negotiate POS machine rates',
                    'title_arabic': 'تفاوض على رسوم نقاط البيع',
                    'description': f'Contact your bank to negotiate lower card processing fees. Target rate: 2% or below.',
                    'potential_savings': round(leak['amount'] * 0.3, 2)
                })
        
        # Based on margin comparison
        if benchmark['gross_margin_status'] == 'below':
            gap = benchmark['industry_gross_margin'] - benchmark['your_gross_margin']
            recommendations.append({
                'type': 'profit_improvement',
                'priority': 'high',
                'title': 'Improve gross margin',
                'title_arabic': 'تحسين هامش الربح الإجمالي',
                'description': f'Your gross margin is {gap:.1f}% below industry average. Review pricing strategy and negotiate better rates with suppliers.',
                'potential_savings': None
            })
        
        if benchmark['net_margin_status'] == 'below':
            recommendations.append({
                'type': 'profit_improvement',
                'priority': 'medium',
                'title': 'Reduce operating costs',
                'title_arabic': 'خفض تكاليف التشغيل',
                'description': 'Review all operating expenses for potential savings. Focus on rent, utilities, and staffing efficiency.',
                'potential_savings': None
            })
        
        return recommendations
    
    async def _calculate_trend(self, user_id: str, current_profit: float, period: str) -> Dict[str, Any]:
        """Calculate profit trend vs previous period"""
        # For simplicity, return placeholder
        # In production, fetch previous period data
        return {
            'direction': 'up',
            'change_percent': 5.2,
            'previous_profit': round(current_profit * 0.95, 2)
        }


# Singleton instance
profit_agent = ProfitAnalysisAgent()
