"""
StoreBuddy UAE - Credit Risk Agent
Calculates customer creditworthiness and collection priority
"""

import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

class CreditRiskAgent:
    """
    Calculates customer creditworthiness based on:
    1. Payment history (on-time vs late)
    2. Total credit volume
    3. Average days to pay
    4. Bounced cheques (serious in UAE)
    5. Business relationship duration
    """
    
    # Trust score thresholds
    RISK_LEVELS = {
        'LOW': {'min_score': 80, 'credit_limit': 'AED 10,000+', 'color': 'green'},
        'MEDIUM': {'min_score': 60, 'credit_limit': 'AED 2,000 - 5,000', 'color': 'yellow'},
        'HIGH': {'min_score': 40, 'credit_limit': 'AED 500 - 1,000', 'color': 'orange'},
        'VERY_HIGH': {'min_score': 0, 'credit_limit': 'Cash only recommended', 'color': 'red'}
    }
    
    # Collection priority based on overdue days
    COLLECTION_PRIORITY = {
        'IMMEDIATE': {'min_days': 60, 'action': 'Personal visit or legal notice'},
        'URGENT': {'min_days': 30, 'action': 'Phone call and formal reminder'},
        'NORMAL': {'min_days': 7, 'action': 'Send WhatsApp/SMS reminder'},
        'LOW': {'min_days': 0, 'action': 'Monitor'}
    }

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')

    async def calculate_trust_score(self, user_id: str, customer_id: str) -> Dict[str, Any]:
        """
        Calculate trust score for a specific customer
        
        Args:
            user_id: Shop owner's UUID
            customer_id: Customer's UUID
        
        Returns:
            Trust score with risk assessment
        """
        try:
            # Fetch customer data
            customer = await self._get_customer(customer_id)
            if not customer:
                return {'status': 'error', 'message': 'Customer not found'}
            
            # Fetch payment history
            history = await self._get_payment_history(customer_id)
            
            # Calculate scoring factors
            base_score = 50
            
            # Factor 1: Payment punctuality (+/- 25 points)
            on_time_ratio = customer.get('on_time_payment_ratio', 0)
            if on_time_ratio >= 0.9:
                punctuality_score = 25
            elif on_time_ratio >= 0.7:
                punctuality_score = 15
            elif on_time_ratio >= 0.5:
                punctuality_score = 5
            else:
                punctuality_score = -15
            
            # Factor 2: Average days to pay (+/- 15 points)
            avg_days = customer.get('average_payment_days', 30)
            if avg_days <= 7:
                speed_score = 15
            elif avg_days <= 15:
                speed_score = 10
            elif avg_days <= 30:
                speed_score = 0
            else:
                speed_score = -10
            
            # Factor 3: Bounced cheques (-20 points each, max -40)
            bounced = customer.get('bounced_cheques', 0)
            bounced_score = -min(bounced * 20, 40)
            
            # Factor 4: Relationship duration (+10 max)
            created_at = customer.get('created_at')
            if created_at:
                months = (datetime.now() - datetime.fromisoformat(created_at.replace('Z', '+00:00'))).days // 30
                relationship_score = min(months // 6, 10)
            else:
                relationship_score = 0
            
            # Factor 5: Total business volume bonus (+5 for high volume)
            total_business = customer.get('total_credit_given', 0) + customer.get('total_payments_received', 0)
            volume_score = 5 if total_business > 50000 else 0
            
            # Calculate final score
            final_score = base_score + punctuality_score + speed_score + bounced_score + relationship_score + volume_score
            final_score = max(0, min(100, final_score))
            
            # Determine risk level
            risk_level = self._get_risk_level(final_score)
            
            # Calculate recommended credit limit based on history
            recommended_limit = self._calculate_recommended_limit(final_score, total_business)
            
            return {
                'status': 'success',
                'customer_id': customer_id,
                'customer_name': customer.get('name', ''),
                'trust_score': final_score,
                'risk_level': risk_level['level'],
                'risk_color': risk_level['color'],
                'recommended_credit_limit': recommended_limit,
                'factors': {
                    'payment_punctuality': {
                        'ratio': on_time_ratio,
                        'score_impact': punctuality_score,
                        'description': f'{int(on_time_ratio * 100)}% payments on time'
                    },
                    'payment_speed': {
                        'avg_days': avg_days,
                        'score_impact': speed_score,
                        'description': f'Average {avg_days} days to pay'
                    },
                    'bounced_cheques': {
                        'count': bounced,
                        'score_impact': bounced_score,
                        'description': f'{bounced} bounced cheques' if bounced > 0 else 'No bounced cheques'
                    },
                    'relationship_duration': {
                        'months': relationship_score * 6,
                        'score_impact': relationship_score,
                        'description': f'Customer for {relationship_score * 6}+ months'
                    },
                    'business_volume': {
                        'total': total_business,
                        'score_impact': volume_score,
                        'description': f'Total business: AED {total_business:,.2f}'
                    }
                },
                'current_outstanding': customer.get('total_credit_outstanding', 0),
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def get_collection_priority(self, user_id: str) -> Dict[str, Any]:
        """
        Get prioritized list of customers for credit collection
        
        Returns:
            List of customers sorted by collection priority
        """
        try:
            # Fetch all customers with outstanding credit
            customers = await self._get_customers_with_credit(user_id)
            
            # Fetch overdue credit transactions
            prioritized = []
            
            for customer in customers:
                outstanding = customer.get('total_credit_outstanding', 0)
                if outstanding <= 0:
                    continue
                
                # Get oldest overdue transaction
                oldest_overdue = await self._get_oldest_overdue(customer['id'])
                days_overdue = oldest_overdue.get('days_overdue', 0) if oldest_overdue else 0
                
                # Determine priority
                priority = self._get_collection_priority(days_overdue)
                
                # Calculate risk-weighted amount
                trust_score = customer.get('trust_score', 50)
                risk_weight = 1 + (100 - trust_score) / 100  # Higher weight for low trust
                risk_weighted_amount = outstanding * risk_weight
                
                prioritized.append({
                    'customer_id': customer['id'],
                    'customer_name': customer.get('name', ''),
                    'customer_phone': customer.get('phone', ''),
                    'outstanding_amount': outstanding,
                    'days_overdue': days_overdue,
                    'trust_score': trust_score,
                    'priority': priority['level'],
                    'priority_color': priority['color'],
                    'recommended_action': priority['action'],
                    'recommended_action_arabic': priority['action_arabic'],
                    'risk_weighted_amount': round(risk_weighted_amount, 2)
                })
            
            # Sort by priority and risk-weighted amount
            priority_order = {'IMMEDIATE': 0, 'URGENT': 1, 'NORMAL': 2, 'LOW': 3}
            prioritized.sort(key=lambda x: (priority_order.get(x['priority'], 4), -x['risk_weighted_amount']))
            
            # Calculate summary
            total_outstanding = sum(c['outstanding_amount'] for c in prioritized)
            immediate_count = len([c for c in prioritized if c['priority'] == 'IMMEDIATE'])
            urgent_count = len([c for c in prioritized if c['priority'] == 'URGENT'])
            
            return {
                'status': 'success',
                'total_outstanding': round(total_outstanding, 2),
                'customer_count': len(prioritized),
                'immediate_attention': immediate_count,
                'urgent_attention': urgent_count,
                'customers': prioritized,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def analyze_credit_aging(self, user_id: str) -> Dict[str, Any]:
        """
        Analyze credit aging (30/60/90+ days buckets)
        """
        try:
            customers = await self._get_customers_with_credit(user_id)
            
            aging = {
                'current': {'amount': 0, 'count': 0, 'label': '0-30 days'},
                'overdue_30': {'amount': 0, 'count': 0, 'label': '31-60 days'},
                'overdue_60': {'amount': 0, 'count': 0, 'label': '61-90 days'},
                'overdue_90': {'amount': 0, 'count': 0, 'label': '90+ days'}
            }
            
            for customer in customers:
                outstanding = customer.get('total_credit_outstanding', 0)
                if outstanding <= 0:
                    continue
                
                oldest = await self._get_oldest_overdue(customer['id'])
                days = oldest.get('days_overdue', 0) if oldest else 0
                
                if days <= 30:
                    aging['current']['amount'] += outstanding
                    aging['current']['count'] += 1
                elif days <= 60:
                    aging['overdue_30']['amount'] += outstanding
                    aging['overdue_30']['count'] += 1
                elif days <= 90:
                    aging['overdue_60']['amount'] += outstanding
                    aging['overdue_60']['count'] += 1
                else:
                    aging['overdue_90']['amount'] += outstanding
                    aging['overdue_90']['count'] += 1
            
            total = sum(bucket['amount'] for bucket in aging.values())
            
            # Calculate percentages
            for key in aging:
                aging[key]['percentage'] = round((aging[key]['amount'] / total * 100) if total > 0 else 0, 1)
                aging[key]['amount'] = round(aging[key]['amount'], 2)
            
            return {
                'status': 'success',
                'total_outstanding': round(total, 2),
                'aging_buckets': aging,
                'health_status': 'GOOD' if aging['overdue_90']['percentage'] < 10 else 'AT_RISK',
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def _get_risk_level(self, score: int) -> Dict[str, str]:
        """Determine risk level from score"""
        if score >= 80:
            return {'level': 'LOW', 'color': 'green'}
        elif score >= 60:
            return {'level': 'MEDIUM', 'color': 'yellow'}
        elif score >= 40:
            return {'level': 'HIGH', 'color': 'orange'}
        else:
            return {'level': 'VERY_HIGH', 'color': 'red'}

    def _calculate_recommended_limit(self, score: int, total_business: float) -> float:
        """Calculate recommended credit limit"""
        if score >= 80:
            base_limit = 10000
        elif score >= 60:
            base_limit = 5000
        elif score >= 40:
            base_limit = 1000
        else:
            return 0  # Cash only
        
        # Adjust based on business history (max 2x)
        history_multiplier = min(1 + (total_business / 100000), 2)
        
        return round(base_limit * history_multiplier, 2)

    def _get_collection_priority(self, days_overdue: int) -> Dict[str, str]:
        """Determine collection priority"""
        if days_overdue >= 60:
            return {
                'level': 'IMMEDIATE', 
                'color': 'red',
                'action': 'Personal visit or legal notice',
                'action_arabic': 'زيارة شخصية أو إشعار قانوني'
            }
        elif days_overdue >= 30:
            return {
                'level': 'URGENT', 
                'color': 'orange',
                'action': 'Phone call and formal reminder',
                'action_arabic': 'مكالمة هاتفية وتذكير رسمي'
            }
        elif days_overdue >= 7:
            return {
                'level': 'NORMAL', 
                'color': 'yellow',
                'action': 'Send WhatsApp/SMS reminder',
                'action_arabic': 'إرسال تذكير واتساب/رسالة'
            }
        else:
            return {
                'level': 'LOW', 
                'color': 'green',
                'action': 'Monitor',
                'action_arabic': 'مراقبة'
            }

    async def _get_customer(self, customer_id: str) -> Optional[Dict]:
        """Fetch customer data"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/customers",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={'id': f'eq.{customer_id}', 'select': '*'}
            )
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        return None

    async def _get_customers_with_credit(self, user_id: str) -> List[Dict]:
        """Fetch all customers with outstanding credit"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/customers",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'total_credit_outstanding': 'gt.0',
                    'select': '*'
                }
            )
            if response.status_code == 200:
                return response.json()
        return []

    async def _get_payment_history(self, customer_id: str) -> List[Dict]:
        """Fetch payment history for customer"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/credit_transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'customer_id': f'eq.{customer_id}',
                    'select': '*',
                    'order': 'created_at.desc'
                }
            )
            if response.status_code == 200:
                return response.json()
        return []

    async def _get_oldest_overdue(self, customer_id: str) -> Optional[Dict]:
        """Get oldest overdue transaction"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/credit_transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'customer_id': f'eq.{customer_id}',
                    'credit_type': 'eq.credit_given',
                    'days_overdue': 'gt.0',
                    'select': 'days_overdue,due_date,amount_aed',
                    'order': 'days_overdue.desc',
                    'limit': 1
                }
            )
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        return None


# Singleton instance
credit_risk_agent = CreditRiskAgent()
