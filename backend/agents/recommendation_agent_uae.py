"""
StoreBuddy UAE - Recommendation Agent
Master recommendation engine aggregating insights from all agents
"""

import os
from datetime import datetime
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

class RecommendationAgent:
    """
    Master recommendation engine that aggregates insights from:
    - ProfitAgent: Profitability improvements
    - CreditRiskAgent: Collection priorities
    - VATAgent: Tax compliance
    - BusinessHealthAgent: Overall health improvements
    - ReorderAgent: Inventory actions
    - UAEProgramsAgent: Funding opportunities
    - SalesPatternAgent: Sales optimization
    
    Prioritizes and presents actionable recommendations
    """
    
    # Recommendation categories with icons
    CATEGORIES = {
        'URGENT': {'priority': 1, 'icon': '🚨', 'color': 'red'},
        'FINANCIAL': {'priority': 2, 'icon': '💰', 'color': 'green'},
        'OPERATIONAL': {'priority': 3, 'icon': '⚙️', 'color': 'blue'},
        'GROWTH': {'priority': 4, 'icon': '📈', 'color': 'purple'},
        'COMPLIANCE': {'priority': 5, 'icon': '📋', 'color': 'orange'},
        'OPPORTUNITY': {'priority': 6, 'icon': '💡', 'color': 'yellow'}
    }

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')

    async def get_daily_recommendations(self, user_id: str) -> Dict[str, Any]:
        """
        Get prioritized daily recommendations
        
        Args:
            user_id: Shop owner's UUID
        
        Returns:
            Prioritized list of actionable recommendations
        """
        try:
            recommendations = []
            
            # 1. Check for urgent items (credit collection, low stock)
            urgent = await self._get_urgent_recommendations(user_id)
            recommendations.extend(urgent)
            
            # 2. Get financial recommendations
            financial = await self._get_financial_recommendations(user_id)
            recommendations.extend(financial)
            
            # 3. Get operational recommendations
            operational = await self._get_operational_recommendations(user_id)
            recommendations.extend(operational)
            
            # 4. Get compliance recommendations
            compliance = await self._get_compliance_recommendations(user_id)
            recommendations.extend(compliance)
            
            # 5. Get growth opportunities
            growth = await self._get_growth_recommendations(user_id)
            recommendations.extend(growth)
            
            # Sort by priority and impact
            recommendations.sort(key=lambda x: (
                self.CATEGORIES.get(x['category'], {}).get('priority', 99),
                -x.get('impact_score', 0)
            ))
            
            # Take top 10 recommendations
            top_recommendations = recommendations[:10]
            
            # Calculate summary metrics
            potential_impact = sum(r.get('potential_aed', 0) for r in top_recommendations)
            urgent_count = len([r for r in top_recommendations if r['category'] == 'URGENT'])
            
            return {
                'status': 'success',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'total_recommendations': len(recommendations),
                'top_recommendations': len(top_recommendations),
                'urgent_items': urgent_count,
                'potential_monthly_impact': round(potential_impact, 2),
                'recommendations': top_recommendations,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def get_recommendation_by_category(self, user_id: str, category: str) -> Dict[str, Any]:
        """Get all recommendations for a specific category"""
        try:
            category = category.upper()
            
            if category == 'URGENT':
                recs = await self._get_urgent_recommendations(user_id)
            elif category == 'FINANCIAL':
                recs = await self._get_financial_recommendations(user_id)
            elif category == 'OPERATIONAL':
                recs = await self._get_operational_recommendations(user_id)
            elif category == 'COMPLIANCE':
                recs = await self._get_compliance_recommendations(user_id)
            elif category == 'GROWTH':
                recs = await self._get_growth_recommendations(user_id)
            elif category == 'OPPORTUNITY':
                recs = await self._get_opportunity_recommendations(user_id)
            else:
                return {'status': 'error', 'message': f'Unknown category: {category}'}
            
            return {
                'status': 'success',
                'category': category,
                'total': len(recs),
                'recommendations': recs
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def mark_recommendation_action(
        self, 
        user_id: str, 
        recommendation_id: str, 
        action: str
    ) -> Dict[str, Any]:
        """
        Record action taken on a recommendation
        
        Actions: 'completed', 'dismissed', 'snoozed'
        """
        try:
            async with httpx.AsyncClient() as client:
                # Update recommendation status
                response = await client.patch(
                    f"{self.supabase_url}/rest/v1/recommendations",
                    headers={
                        'apikey': self.supabase_key,
                        'Authorization': f'Bearer {self.supabase_key}',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    params={'id': f'eq.{recommendation_id}'},
                    json={
                        'status': action,
                        'actioned_at': datetime.now().isoformat()
                    }
                )
                
                if response.status_code in [200, 204]:
                    return {'status': 'success', 'action': action}
                else:
                    return {'status': 'error', 'message': 'Failed to update recommendation'}
                    
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def _get_urgent_recommendations(self, user_id: str) -> List[Dict]:
        """Get urgent recommendations (immediate action needed)"""
        recommendations = []
        
        # Check for severely overdue credit
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/customers",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'total_credit_outstanding': 'gt.1000',
                    'select': 'id,name,total_credit_outstanding,average_payment_days'
                }
            )
            
            if response.status_code == 200:
                customers = response.json()
                for customer in customers:
                    if customer.get('average_payment_days', 0) > 45:
                        recommendations.append({
                            'id': f"urgent_credit_{customer['id']}",
                            'category': 'URGENT',
                            'icon': '🚨',
                            'title': f"Collect from {customer['name']}",
                            'title_arabic': f"تحصيل من {customer['name']}",
                            'description': f"AED {customer['total_credit_outstanding']:,.0f} outstanding, {customer['average_payment_days']:.0f} days overdue on average",
                            'description_arabic': f"{customer['total_credit_outstanding']:,.0f} درهم مستحق",
                            'action': 'Call customer for payment',
                            'action_arabic': 'اتصل بالعميل للدفع',
                            'potential_aed': customer['total_credit_outstanding'],
                            'impact_score': 90,
                            'source': 'credit_risk_agent'
                        })
        
        # Check for critical stock levels
        response = await self._fetch_data(
            f"{self.supabase_url}/rest/v1/inventory_items",
            {
                'user_id': f'eq.{user_id}',
                'select': 'id,name,current_stock,reorder_point,unit_cost'
            }
        )
        
        if response:
            for item in response:
                if item.get('current_stock', 0) <= item.get('reorder_point', 0) * 0.5:
                    recommendations.append({
                        'id': f"urgent_stock_{item['id']}",
                        'category': 'URGENT',
                        'icon': '🚨',
                        'title': f"Reorder {item['name']} immediately",
                        'title_arabic': f"اطلب {item['name']} فوراً",
                        'description': f"Only {item['current_stock']} units left (below 50% of reorder point)",
                        'description_arabic': f"متبقي {item['current_stock']} وحدة فقط",
                        'action': 'Place order with supplier',
                        'action_arabic': 'اطلب من المورد',
                        'potential_aed': 0,  # Prevents stockout loss
                        'impact_score': 85,
                        'source': 'reorder_agent'
                    })
        
        return recommendations[:5]  # Max 5 urgent

    async def _get_financial_recommendations(self, user_id: str) -> List[Dict]:
        """Get financial optimization recommendations"""
        recommendations = []
        
        # Check profit margins
        profile = await self._get_business_profile(user_id)
        business_type = profile.get('business_type', 'general') if profile else 'general'
        
        # Get recent profit data
        end_date = datetime.now()
        start_date = datetime.now().replace(day=1)
        
        sales = await self._get_sum(user_id, 'sale', start_date, end_date)
        expenses = await self._get_sum(user_id, 'expense', start_date, end_date)
        purchases = await self._get_sum(user_id, 'purchase', start_date, end_date)
        
        if sales > 0:
            gross_margin = (sales - purchases) / sales
            net_margin = (sales - purchases - expenses) / sales
            
            # Industry benchmarks
            benchmarks = {
                'grocery': 0.08,
                'electronics': 0.05,
                'pharmacy': 0.10,
                'cafeteria': 0.15,
                'textile': 0.12,
                'general': 0.08
            }
            
            target_margin = benchmarks.get(business_type, 0.08)
            
            if net_margin < target_margin:
                improvement_needed = (target_margin - net_margin) * sales
                recommendations.append({
                    'id': f"financial_margin_{datetime.now().strftime('%Y%m')}",
                    'category': 'FINANCIAL',
                    'icon': '💰',
                    'title': 'Improve profit margins',
                    'title_arabic': 'حسّن هوامش الربح',
                    'description': f"Net margin {net_margin*100:.1f}% is below industry average {target_margin*100:.0f}%",
                    'description_arabic': f"هامش الربح {net_margin*100:.1f}% أقل من المتوسط {target_margin*100:.0f}%",
                    'action': 'Review pricing and reduce expenses',
                    'action_arabic': 'راجع الأسعار وقلل المصاريف',
                    'potential_aed': improvement_needed,
                    'impact_score': 75,
                    'source': 'profit_agent'
                })
            
            # Check expense ratio
            expense_ratio = expenses / sales
            if expense_ratio > 0.3:
                recommendations.append({
                    'id': f"financial_expenses_{datetime.now().strftime('%Y%m')}",
                    'category': 'FINANCIAL',
                    'icon': '💰',
                    'title': 'Reduce operating expenses',
                    'title_arabic': 'قلل مصاريف التشغيل',
                    'description': f"Operating expenses are {expense_ratio*100:.0f}% of sales (target: <30%)",
                    'description_arabic': f"مصاريف التشغيل {expense_ratio*100:.0f}% من المبيعات",
                    'action': 'Audit and negotiate costs',
                    'action_arabic': 'راجع وفاوض على التكاليف',
                    'potential_aed': (expense_ratio - 0.25) * sales,
                    'impact_score': 70,
                    'source': 'profit_agent'
                })
        
        return recommendations[:3]

    async def _get_operational_recommendations(self, user_id: str) -> List[Dict]:
        """Get operational efficiency recommendations"""
        recommendations = []
        
        # Check inventory efficiency
        items = await self._fetch_data(
            f"{self.supabase_url}/rest/v1/inventory_items",
            {
                'user_id': f'eq.{user_id}',
                'select': 'id,name,current_stock,average_daily_sales,unit_cost'
            }
        )
        
        if items:
            # Find slow-moving inventory
            for item in items:
                daily_sales = item.get('average_daily_sales', 0)
                current_stock = item.get('current_stock', 0)
                
                if daily_sales > 0:
                    days_of_stock = current_stock / daily_sales
                    if days_of_stock > 90:  # More than 3 months stock
                        tied_capital = current_stock * item.get('unit_cost', 0)
                        if tied_capital > 1000:
                            recommendations.append({
                                'id': f"ops_slowmove_{item['id']}",
                                'category': 'OPERATIONAL',
                                'icon': '⚙️',
                                'title': f"Clear slow-moving: {item['name']}",
                                'title_arabic': f"صفّي البضاعة البطيئة: {item['name']}",
                                'description': f"{int(days_of_stock)} days of stock (AED {tied_capital:,.0f} tied up)",
                                'description_arabic': f"مخزون {int(days_of_stock)} يوم",
                                'action': 'Discount or bundle to clear',
                                'action_arabic': 'خصم أو حزمة للتصفية',
                                'potential_aed': tied_capital * 0.3,  # Recover 30%
                                'impact_score': 50,
                                'source': 'reorder_agent'
                            })
        
        return recommendations[:3]

    async def _get_compliance_recommendations(self, user_id: str) -> List[Dict]:
        """Get compliance-related recommendations"""
        recommendations = []
        
        profile = await self._get_business_profile(user_id)
        if not profile:
            return recommendations
        
        # Check VAT registration
        if not profile.get('trn'):
            recommendations.append({
                'id': 'compliance_trn',
                'category': 'COMPLIANCE',
                'icon': '📋',
                'title': 'Register for VAT',
                'title_arabic': 'سجّل في ضريبة القيمة المضافة',
                'description': 'VAT registration may be required if revenue exceeds AED 375,000',
                'description_arabic': 'تسجيل ضريبة القيمة المضافة قد يكون مطلوباً',
                'action': 'Check eligibility on FTA website',
                'action_arabic': 'تحقق من الأهلية على موقع الهيئة الاتحادية للضرائب',
                'potential_aed': 0,
                'impact_score': 80,
                'source': 'vat_agent'
            })
        
        # Check license expiry
        license_expiry = profile.get('license_expiry')
        if license_expiry:
            expiry = datetime.fromisoformat(license_expiry.replace('Z', '+00:00'))
            days_to_expiry = (expiry - datetime.now()).days
            
            if days_to_expiry <= 30:
                recommendations.append({
                    'id': 'compliance_license',
                    'category': 'COMPLIANCE',
                    'icon': '📋',
                    'title': 'Renew trade license',
                    'title_arabic': 'جدد الرخصة التجارية',
                    'description': f"License expires in {days_to_expiry} days",
                    'description_arabic': f"الرخصة تنتهي خلال {days_to_expiry} يوم",
                    'action': 'Apply for renewal at DED',
                    'action_arabic': 'قدم طلب التجديد في دائرة التنمية الاقتصادية',
                    'potential_aed': 0,
                    'impact_score': 95,
                    'source': 'business_health_agent'
                })
        
        return recommendations

    async def _get_growth_recommendations(self, user_id: str) -> List[Dict]:
        """Get growth opportunity recommendations"""
        recommendations = []
        
        # Suggest UAE programs
        recommendations.append({
            'id': 'growth_programs',
            'category': 'GROWTH',
            'icon': '📈',
            'title': 'Explore UAE SME programs',
            'title_arabic': 'استكشف برامج المشاريع الصغيرة',
            'description': 'You may qualify for Dubai SME, Khalifa Fund, or other support programs',
            'description_arabic': 'قد تكون مؤهلاً لبرامج دعم متعددة',
            'action': 'Check program eligibility',
            'action_arabic': 'تحقق من أهلية البرامج',
            'potential_aed': 100000,  # Potential funding
            'impact_score': 60,
            'source': 'uae_programs_agent'
        })
        
        return recommendations

    async def _get_opportunity_recommendations(self, user_id: str) -> List[Dict]:
        """Get opportunity-based recommendations"""
        # Similar to growth but for one-time opportunities
        return []

    async def _get_business_profile(self, user_id: str) -> Optional[Dict]:
        """Fetch business profile"""
        data = await self._fetch_data(
            f"{self.supabase_url}/rest/v1/business_profiles",
            {'user_id': f'eq.{user_id}', 'select': '*'}
        )
        return data[0] if data else None

    async def _fetch_data(self, url: str, params: Dict) -> Optional[List]:
        """Generic data fetch helper"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params=params
            )
            if response.status_code == 200:
                return response.json()
        return None

    async def _get_sum(self, user_id: str, txn_type: str, start: datetime, end: datetime) -> float:
        """Get sum of transactions by type"""
        data = await self._fetch_data(
            f"{self.supabase_url}/rest/v1/transactions",
            {
                'user_id': f'eq.{user_id}',
                'transaction_type': f'eq.{txn_type}',
                'date': f'gte.{start.isoformat()}',
                'select': 'amount_aed'
            }
        )
        return sum(t.get('amount_aed', 0) for t in (data or []))


# Singleton instance
recommendation_agent = RecommendationAgent()
