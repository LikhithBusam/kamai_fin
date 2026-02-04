"""
StoreBuddy UAE - Business Health Agent
Calculates overall business health score (0-100) based on 7 dimensions
"""

import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

class BusinessHealthAgent:
    """
    Calculates business health score based on 7 key dimensions:
    1. Profitability (30%) - Net profit margin vs industry benchmark
    2. Liquidity (20%) - Cash vs short-term obligations
    3. Credit Health (15%) - Collection rate and aging
    4. Expense Control (10%) - Expense ratio trends
    5. Growth (10%) - Revenue growth trajectory
    6. Debt Burden (10%) - Debt to income ratio
    7. Compliance (5%) - VAT filing, license status
    """
    
    # Dimension weights (total = 100%)
    DIMENSION_WEIGHTS = {
        'profitability': 30,
        'liquidity': 20,
        'credit_health': 15,
        'expense_control': 10,
        'growth': 10,
        'debt_burden': 10,
        'compliance': 5
    }
    
    # Health thresholds
    HEALTH_LEVELS = {
        'EXCELLENT': {'min': 80, 'color': 'green', 'emoji': '🟢'},
        'GOOD': {'min': 60, 'color': 'blue', 'emoji': '🔵'},
        'FAIR': {'min': 40, 'color': 'yellow', 'emoji': '🟡'},
        'POOR': {'min': 20, 'color': 'orange', 'emoji': '🟠'},
        'CRITICAL': {'min': 0, 'color': 'red', 'emoji': '🔴'}
    }
    
    # Industry benchmarks
    BENCHMARKS = {
        'grocery': {'profit_margin': 0.08, 'expense_ratio': 0.85},
        'electronics': {'profit_margin': 0.05, 'expense_ratio': 0.88},
        'pharmacy': {'profit_margin': 0.10, 'expense_ratio': 0.82},
        'cafeteria': {'profit_margin': 0.15, 'expense_ratio': 0.75},
        'textile': {'profit_margin': 0.12, 'expense_ratio': 0.80},
        'auto_parts': {'profit_margin': 0.10, 'expense_ratio': 0.82},
        'general': {'profit_margin': 0.08, 'expense_ratio': 0.85}
    }

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')

    async def calculate_health_score(self, user_id: str) -> Dict[str, Any]:
        """
        Calculate comprehensive business health score
        
        Args:
            user_id: Shop owner's UUID
        
        Returns:
            Overall health score with dimension breakdown
        """
        try:
            # Get business profile
            profile = await self._get_business_profile(user_id)
            business_type = profile.get('business_type', 'general')
            benchmark = self.BENCHMARKS.get(business_type, self.BENCHMARKS['general'])
            
            # Calculate each dimension
            profitability = await self._calculate_profitability(user_id, benchmark)
            liquidity = await self._calculate_liquidity(user_id)
            credit_health = await self._calculate_credit_health(user_id)
            expense_control = await self._calculate_expense_control(user_id, benchmark)
            growth = await self._calculate_growth(user_id)
            debt_burden = await self._calculate_debt_burden(user_id)
            compliance = await self._calculate_compliance(user_id)
            
            # Calculate weighted score
            dimensions = {
                'profitability': profitability,
                'liquidity': liquidity,
                'credit_health': credit_health,
                'expense_control': expense_control,
                'growth': growth,
                'debt_burden': debt_burden,
                'compliance': compliance
            }
            
            weighted_score = sum(
                d['score'] * (self.DIMENSION_WEIGHTS[key] / 100)
                for key, d in dimensions.items()
            )
            
            overall_score = round(weighted_score, 1)
            health_level = self._get_health_level(overall_score)
            
            # Identify top issues and strengths
            sorted_dimensions = sorted(
                dimensions.items(),
                key=lambda x: x[1]['score']
            )
            top_issues = sorted_dimensions[:2]
            strengths = sorted_dimensions[-2:][::-1]
            
            # Generate recommendations
            recommendations = self._generate_recommendations(dimensions, business_type)
            
            return {
                'status': 'success',
                'overall_score': overall_score,
                'health_level': health_level['level'],
                'health_color': health_level['color'],
                'health_emoji': health_level['emoji'],
                'dimensions': {
                    key: {
                        **d,
                        'weight': self.DIMENSION_WEIGHTS[key]
                    }
                    for key, d in dimensions.items()
                },
                'top_issues': [
                    {
                        'dimension': issue[0],
                        'score': issue[1]['score'],
                        'insight': issue[1]['insight']
                    }
                    for issue in top_issues
                ],
                'strengths': [
                    {
                        'dimension': s[0],
                        'score': s[1]['score'],
                        'insight': s[1]['insight']
                    }
                    for s in strengths
                ],
                'recommendations': recommendations,
                'business_type': business_type,
                'calculated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def get_health_trend(self, user_id: str, months: int = 6) -> Dict[str, Any]:
        """
        Get health score trend over time
        """
        try:
            # Fetch stored health scores
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.supabase_url}/rest/v1/business_health_scores",
                    headers={
                        'apikey': self.supabase_key,
                        'Authorization': f'Bearer {self.supabase_key}'
                    },
                    params={
                        'user_id': f'eq.{user_id}',
                        'select': '*',
                        'order': 'calculated_at.desc',
                        'limit': months
                    }
                )
                
                if response.status_code == 200:
                    scores = response.json()
                    
                    if len(scores) >= 2:
                        trend = scores[0].get('overall_score', 0) - scores[-1].get('overall_score', 0)
                        trend_direction = 'improving' if trend > 0 else 'declining' if trend < 0 else 'stable'
                    else:
                        trend = 0
                        trend_direction = 'insufficient_data'
                    
                    return {
                        'status': 'success',
                        'scores': scores,
                        'trend': round(trend, 1),
                        'trend_direction': trend_direction,
                        'data_points': len(scores)
                    }
                    
            return {'status': 'error', 'message': 'Failed to fetch health trend'}
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def _calculate_profitability(self, user_id: str, benchmark: Dict) -> Dict:
        """Calculate profitability dimension (0-100)"""
        # Get last 3 months data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=90)
        
        sales = await self._get_total_sales(user_id, start_date, end_date)
        cogs = await self._get_cogs(user_id, start_date, end_date)
        expenses = await self._get_expenses(user_id, start_date, end_date)
        
        if sales == 0:
            return {
                'score': 0,
                'insight': 'No sales recorded',
                'insight_arabic': 'لا توجد مبيعات مسجلة'
            }
        
        gross_profit = sales - cogs
        net_profit = gross_profit - expenses
        net_margin = net_profit / sales
        
        benchmark_margin = benchmark['profit_margin']
        
        # Score: 100 if margin >= benchmark, scaled down if below
        if net_margin >= benchmark_margin:
            score = min(100, 70 + (net_margin / benchmark_margin) * 30)
        elif net_margin > 0:
            score = 30 + (net_margin / benchmark_margin) * 40
        else:
            score = max(0, 30 + (net_margin * 100))  # Negative margins hurt score
        
        return {
            'score': round(score, 1),
            'net_margin': round(net_margin * 100, 1),
            'benchmark_margin': round(benchmark_margin * 100, 1),
            'insight': f'Net margin: {net_margin*100:.1f}% (benchmark: {benchmark_margin*100:.1f}%)',
            'insight_arabic': f'هامش الربح الصافي: {net_margin*100:.1f}% (المعيار: {benchmark_margin*100:.1f}%)'
        }

    async def _calculate_liquidity(self, user_id: str) -> Dict:
        """Calculate liquidity dimension (0-100)"""
        # Get cash position vs outstanding liabilities
        profile = await self._get_business_profile(user_id)
        
        # Simplified: use current balance vs credit given
        current_balance = profile.get('current_balance', 0)
        credit_outstanding = await self._get_total_credit_given(user_id)
        monthly_expenses = await self._get_average_monthly_expenses(user_id)
        
        # Calculate months of runway
        if monthly_expenses > 0:
            runway_months = (current_balance + credit_outstanding) / monthly_expenses
        else:
            runway_months = 12  # Assume good if no expenses tracked
        
        # Score based on runway
        if runway_months >= 3:
            score = min(100, 70 + runway_months * 5)
        elif runway_months >= 1:
            score = 40 + runway_months * 15
        else:
            score = max(0, runway_months * 40)
        
        return {
            'score': round(min(100, score), 1),
            'runway_months': round(runway_months, 1),
            'current_balance': current_balance,
            'insight': f'{runway_months:.1f} months runway available',
            'insight_arabic': f'السيولة تكفي {runway_months:.1f} شهر'
        }

    async def _calculate_credit_health(self, user_id: str) -> Dict:
        """Calculate credit health dimension (0-100)"""
        # Get collection metrics
        total_given = await self._get_total_credit_given(user_id)
        total_collected = await self._get_total_collected(user_id)
        overdue_amount = await self._get_overdue_amount(user_id)
        
        if total_given == 0:
            return {
                'score': 100,  # No credit means no risk
                'insight': 'No credit extended',
                'insight_arabic': 'لا يوجد ائتمان ممنوح'
            }
        
        collection_rate = total_collected / total_given if total_given > 0 else 1
        overdue_rate = overdue_amount / total_given if total_given > 0 else 0
        
        # Score: high collection rate and low overdue is good
        score = (collection_rate * 60) + ((1 - overdue_rate) * 40)
        score = max(0, min(100, score * 100))
        
        return {
            'score': round(score, 1),
            'collection_rate': round(collection_rate * 100, 1),
            'overdue_rate': round(overdue_rate * 100, 1),
            'insight': f'Collection rate: {collection_rate*100:.0f}%, Overdue: {overdue_rate*100:.0f}%',
            'insight_arabic': f'معدل التحصيل: {collection_rate*100:.0f}%، متأخر: {overdue_rate*100:.0f}%'
        }

    async def _calculate_expense_control(self, user_id: str, benchmark: Dict) -> Dict:
        """Calculate expense control dimension (0-100)"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=90)
        
        sales = await self._get_total_sales(user_id, start_date, end_date)
        expenses = await self._get_expenses(user_id, start_date, end_date) + await self._get_cogs(user_id, start_date, end_date)
        
        if sales == 0:
            return {
                'score': 50,
                'insight': 'No sales to measure against',
                'insight_arabic': 'لا توجد مبيعات للمقارنة'
            }
        
        expense_ratio = expenses / sales
        benchmark_ratio = benchmark['expense_ratio']
        
        # Score: lower expense ratio is better
        if expense_ratio <= benchmark_ratio:
            score = 70 + ((benchmark_ratio - expense_ratio) / benchmark_ratio) * 30
        else:
            over_benchmark = (expense_ratio - benchmark_ratio) / benchmark_ratio
            score = max(0, 70 - over_benchmark * 100)
        
        return {
            'score': round(score, 1),
            'expense_ratio': round(expense_ratio * 100, 1),
            'benchmark_ratio': round(benchmark_ratio * 100, 1),
            'insight': f'Expense ratio: {expense_ratio*100:.0f}% (target: <{benchmark_ratio*100:.0f}%)',
            'insight_arabic': f'نسبة المصاريف: {expense_ratio*100:.0f}% (الهدف: <{benchmark_ratio*100:.0f}%)'
        }

    async def _calculate_growth(self, user_id: str) -> Dict:
        """Calculate growth dimension (0-100)"""
        now = datetime.now()
        
        # Current quarter
        current_start = now - timedelta(days=90)
        current_sales = await self._get_total_sales(user_id, current_start, now)
        
        # Previous quarter
        prev_start = now - timedelta(days=180)
        prev_end = now - timedelta(days=90)
        prev_sales = await self._get_total_sales(user_id, prev_start, prev_end)
        
        if prev_sales == 0:
            return {
                'score': 50,
                'insight': 'Not enough history to measure growth',
                'insight_arabic': 'لا توجد بيانات كافية لقياس النمو'
            }
        
        growth_rate = (current_sales - prev_sales) / prev_sales
        
        # Score: positive growth is good
        if growth_rate >= 0.20:  # 20%+ growth
            score = 90 + min(10, growth_rate * 20)
        elif growth_rate >= 0.10:  # 10-20% growth
            score = 75 + growth_rate * 50
        elif growth_rate >= 0:  # 0-10% growth
            score = 50 + growth_rate * 250
        else:  # Negative growth
            score = max(0, 50 + growth_rate * 100)
        
        return {
            'score': round(min(100, score), 1),
            'growth_rate': round(growth_rate * 100, 1),
            'insight': f'Quarter-over-quarter growth: {growth_rate*100:+.1f}%',
            'insight_arabic': f'النمو ربع السنوي: {growth_rate*100:+.1f}%'
        }

    async def _calculate_debt_burden(self, user_id: str) -> Dict:
        """Calculate debt burden dimension (0-100)"""
        profile = await self._get_business_profile(user_id)
        
        # Get monthly income
        now = datetime.now()
        start = now - timedelta(days=30)
        monthly_income = await self._get_total_sales(user_id, start, now)
        
        # Estimate monthly debt payments (rent, loans, etc.)
        rent = profile.get('monthly_rent', 0)
        other_obligations = profile.get('monthly_obligations', 0)
        total_obligations = rent + other_obligations
        
        if monthly_income == 0:
            debt_to_income = 1 if total_obligations > 0 else 0
        else:
            debt_to_income = total_obligations / monthly_income
        
        # Score: lower debt-to-income is better
        if debt_to_income <= 0.3:
            score = 90 + (0.3 - debt_to_income) * 33
        elif debt_to_income <= 0.5:
            score = 70 + (0.5 - debt_to_income) * 100
        elif debt_to_income <= 0.7:
            score = 40 + (0.7 - debt_to_income) * 150
        else:
            score = max(0, 40 - (debt_to_income - 0.7) * 100)
        
        return {
            'score': round(min(100, score), 1),
            'debt_to_income': round(debt_to_income * 100, 1),
            'insight': f'Debt-to-income: {debt_to_income*100:.0f}%',
            'insight_arabic': f'نسبة الدين للدخل: {debt_to_income*100:.0f}%'
        }

    async def _calculate_compliance(self, user_id: str) -> Dict:
        """Calculate compliance dimension (0-100)"""
        profile = await self._get_business_profile(user_id)
        
        score = 100
        issues = []
        
        # Check TRN registration
        if not profile.get('trn'):
            score -= 30
            issues.append('No VAT registration')
        
        # Check license expiry
        license_expiry = profile.get('license_expiry')
        if license_expiry:
            expiry_date = datetime.fromisoformat(license_expiry.replace('Z', '+00:00'))
            days_to_expiry = (expiry_date - datetime.now()).days
            if days_to_expiry < 0:
                score -= 50
                issues.append('License expired')
            elif days_to_expiry < 30:
                score -= 20
                issues.append('License expiring soon')
        
        # Check visa status
        if profile.get('visa_status') == 'expired':
            score -= 30
            issues.append('Visa expired')
        
        return {
            'score': max(0, score),
            'issues': issues,
            'insight': ', '.join(issues) if issues else 'All compliant',
            'insight_arabic': 'متوافق' if not issues else 'يوجد مشاكل امتثال'
        }

    def _get_health_level(self, score: float) -> Dict:
        """Determine health level from score"""
        for level, config in self.HEALTH_LEVELS.items():
            if score >= config['min']:
                return {'level': level, **config}
        return {'level': 'CRITICAL', **self.HEALTH_LEVELS['CRITICAL']}

    def _generate_recommendations(self, dimensions: Dict, business_type: str) -> List[Dict]:
        """Generate actionable recommendations"""
        recommendations = []
        
        for dim_name, dim_data in dimensions.items():
            if dim_data['score'] < 50:
                rec = self._get_recommendation_for_dimension(dim_name, dim_data, business_type)
                if rec:
                    recommendations.append(rec)
        
        return sorted(recommendations, key=lambda x: x['priority'])[:5]

    def _get_recommendation_for_dimension(self, dimension: str, data: Dict, business_type: str) -> Optional[Dict]:
        """Get specific recommendation for low-scoring dimension"""
        recommendations_map = {
            'profitability': {
                'message': 'Review pricing strategy and reduce cost of goods',
                'message_arabic': 'راجع استراتيجية التسعير وقلل تكلفة البضائع',
                'priority': 1
            },
            'liquidity': {
                'message': 'Accelerate credit collection and build cash reserves',
                'message_arabic': 'سرّع تحصيل الديون وابني احتياطي نقدي',
                'priority': 2
            },
            'credit_health': {
                'message': 'Follow up on overdue payments and tighten credit terms',
                'message_arabic': 'تابع المدفوعات المتأخرة وشدد شروط الائتمان',
                'priority': 2
            },
            'expense_control': {
                'message': 'Audit expenses and negotiate better supplier terms',
                'message_arabic': 'راجع المصاريف وفاوض على شروط أفضل مع الموردين',
                'priority': 3
            },
            'growth': {
                'message': 'Invest in marketing and explore new customer segments',
                'message_arabic': 'استثمر في التسويق واستكشف شرائح عملاء جديدة',
                'priority': 3
            },
            'debt_burden': {
                'message': 'Prioritize paying down high-interest obligations',
                'message_arabic': 'أولوية سداد الالتزامات ذات الفائدة العالية',
                'priority': 2
            },
            'compliance': {
                'message': 'Update licenses and complete VAT registration',
                'message_arabic': 'جدد الرخص وأكمل تسجيل ضريبة القيمة المضافة',
                'priority': 1
            }
        }
        
        rec = recommendations_map.get(dimension)
        if rec:
            return {
                'dimension': dimension,
                'current_score': data['score'],
                **rec
            }
        return None

    # Helper methods for database queries
    async def _get_business_profile(self, user_id: str) -> Dict:
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

    async def _get_total_sales(self, user_id: str, start: datetime, end: datetime) -> float:
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
                    'date': f'gte.{start.isoformat()}',
                    'select': 'amount_aed'
                }
            )
            if response.status_code == 200:
                return sum(t.get('amount_aed', 0) for t in response.json())
        return 0

    async def _get_cogs(self, user_id: str, start: datetime, end: datetime) -> float:
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
                    'date': f'gte.{start.isoformat()}',
                    'select': 'amount_aed'
                }
            )
            if response.status_code == 200:
                return sum(t.get('amount_aed', 0) for t in response.json())
        return 0

    async def _get_expenses(self, user_id: str, start: datetime, end: datetime) -> float:
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
                    'date': f'gte.{start.isoformat()}',
                    'select': 'amount_aed'
                }
            )
            if response.status_code == 200:
                return sum(t.get('amount_aed', 0) for t in response.json())
        return 0

    async def _get_average_monthly_expenses(self, user_id: str) -> float:
        now = datetime.now()
        start = now - timedelta(days=90)
        total = await self._get_expenses(user_id, start, now) + await self._get_cogs(user_id, start, now)
        return total / 3

    async def _get_total_credit_given(self, user_id: str) -> float:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/customers",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'select': 'total_credit_outstanding'
                }
            )
            if response.status_code == 200:
                return sum(c.get('total_credit_outstanding', 0) for c in response.json())
        return 0

    async def _get_total_collected(self, user_id: str) -> float:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/customers",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'select': 'total_payments_received'
                }
            )
            if response.status_code == 200:
                return sum(c.get('total_payments_received', 0) for c in response.json())
        return 0

    async def _get_overdue_amount(self, user_id: str) -> float:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/credit_transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'days_overdue': 'gt.0',
                    'select': 'amount_aed'
                }
            )
            if response.status_code == 200:
                return sum(t.get('amount_aed', 0) for t in response.json())
        return 0


# Singleton instance
business_health_agent = BusinessHealthAgent()
