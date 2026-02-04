"""
StoreBuddy UAE - Reorder Agent
Smart inventory reorder predictions with UAE seasonality
"""

import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

class ReorderAgent:
    """
    Smart inventory reorder agent with UAE-specific seasonality:
    - Ramadan: +40% demand
    - Eid Al-Fitr: +50% demand
    - Eid Al-Adha: +30% demand
    - Summer (Jun-Aug): -30% demand (many expats travel)
    - Dubai Shopping Festival (Jan): +20% demand
    - UAE National Day (Dec 2): +15% demand
    """
    
    # UAE seasonal factors
    SEASONAL_FACTORS = {
        'ramadan': 1.40,           # +40%
        'eid_al_fitr': 1.50,       # +50%
        'eid_al_adha': 1.30,       # +30%
        'summer': 0.70,            # -30%
        'dsf': 1.20,               # Dubai Shopping Festival +20%
        'national_day': 1.15,      # UAE National Day +15%
        'normal': 1.00
    }
    
    # Category-specific lead times (days)
    LEAD_TIMES = {
        'perishable': 1,
        'grocery': 3,
        'electronics': 7,
        'pharmacy': 5,
        'textile': 14,
        'auto_parts': 7,
        'general': 5
    }
    
    # Safety stock multiplier by category
    SAFETY_STOCK = {
        'perishable': 1.2,    # Minimal - avoid spoilage
        'grocery': 1.5,
        'electronics': 1.3,
        'pharmacy': 2.0,      # High - avoid stockouts
        'textile': 1.5,
        'auto_parts': 1.5,
        'general': 1.5
    }

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')

    async def get_reorder_alerts(self, user_id: str) -> Dict[str, Any]:
        """
        Get items that need to be reordered
        
        Args:
            user_id: Shop owner's UUID
        
        Returns:
            List of items needing reorder with quantities
        """
        try:
            # Get inventory items
            items = await self._get_inventory_items(user_id)
            
            # Get current seasonal factor
            season = self._get_current_season()
            seasonal_factor = self.SEASONAL_FACTORS.get(season, 1.0)
            
            alerts = []
            for item in items:
                # Calculate days until stockout
                avg_daily_sales = item.get('average_daily_sales', 0)
                current_stock = item.get('current_stock', 0)
                reorder_point = item.get('reorder_point', 0)
                category = item.get('category', 'general')
                
                # Adjust for seasonality
                adjusted_daily_sales = avg_daily_sales * seasonal_factor
                
                if adjusted_daily_sales > 0:
                    days_until_stockout = current_stock / adjusted_daily_sales
                else:
                    days_until_stockout = 999
                
                lead_time = self.LEAD_TIMES.get(category, 5)
                safety_multiplier = self.SAFETY_STOCK.get(category, 1.5)
                
                # Calculate dynamic reorder point
                dynamic_reorder_point = (adjusted_daily_sales * lead_time * safety_multiplier)
                
                # Check if reorder needed
                if current_stock <= dynamic_reorder_point or current_stock <= reorder_point:
                    # Calculate recommended order quantity (EOQ-based)
                    recommended_qty = self._calculate_order_quantity(
                        item, adjusted_daily_sales, lead_time
                    )
                    
                    urgency = self._calculate_urgency(days_until_stockout, lead_time)
                    
                    alerts.append({
                        'item_id': item['id'],
                        'item_name': item.get('name', ''),
                        'item_name_arabic': item.get('name_arabic', ''),
                        'sku': item.get('sku', ''),
                        'category': category,
                        'current_stock': current_stock,
                        'reorder_point': reorder_point,
                        'dynamic_reorder_point': round(dynamic_reorder_point, 0),
                        'recommended_order_qty': recommended_qty,
                        'days_until_stockout': round(days_until_stockout, 1),
                        'lead_time_days': lead_time,
                        'urgency': urgency['level'],
                        'urgency_color': urgency['color'],
                        'supplier_id': item.get('supplier_id'),
                        'supplier_name': item.get('supplier_name', ''),
                        'unit_cost': item.get('unit_cost', 0),
                        'estimated_order_value': round(recommended_qty * item.get('unit_cost', 0), 2),
                        'seasonal_adjustment': f'{seasonal_factor:.0%}',
                        'season': season
                    })
            
            # Sort by urgency and days until stockout
            urgency_order = {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3}
            alerts.sort(key=lambda x: (urgency_order.get(x['urgency'], 4), x['days_until_stockout']))
            
            # Calculate summary
            total_order_value = sum(a['estimated_order_value'] for a in alerts)
            critical_count = len([a for a in alerts if a['urgency'] == 'CRITICAL'])
            
            return {
                'status': 'success',
                'total_alerts': len(alerts),
                'critical_items': critical_count,
                'total_estimated_order_value': round(total_order_value, 2),
                'current_season': season,
                'seasonal_factor': seasonal_factor,
                'alerts': alerts,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def predict_demand(self, user_id: str, item_id: str, days_ahead: int = 30) -> Dict[str, Any]:
        """
        Predict demand for a specific item
        
        Args:
            user_id: Shop owner's UUID
            item_id: Item UUID
            days_ahead: Number of days to predict
        
        Returns:
            Demand prediction with daily breakdown
        """
        try:
            # Get item details
            item = await self._get_item(item_id)
            if not item:
                return {'status': 'error', 'message': 'Item not found'}
            
            # Get historical sales
            history = await self._get_sales_history(user_id, item_id, days=90)
            
            # Calculate base daily demand
            if len(history) >= 7:
                recent_avg = sum(h['quantity'] for h in history[:7]) / 7
                historical_avg = sum(h['quantity'] for h in history) / len(history)
                # Weight recent data more heavily
                base_demand = recent_avg * 0.7 + historical_avg * 0.3
            else:
                base_demand = item.get('average_daily_sales', 1)
            
            # Generate daily predictions with seasonal adjustments
            predictions = []
            total_predicted = 0
            
            for i in range(days_ahead):
                date = datetime.now() + timedelta(days=i)
                season = self._get_season_for_date(date)
                factor = self.SEASONAL_FACTORS.get(season, 1.0)
                
                # Day of week adjustment
                dow_factor = self._get_day_of_week_factor(date.weekday())
                
                daily_demand = base_demand * factor * dow_factor
                total_predicted += daily_demand
                
                predictions.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'day_of_week': date.strftime('%A'),
                    'predicted_demand': round(daily_demand, 1),
                    'season': season,
                    'seasonal_factor': factor
                })
            
            # Calculate confidence based on data quality
            confidence = min(95, 50 + len(history) * 0.5)
            
            return {
                'status': 'success',
                'item_id': item_id,
                'item_name': item.get('name', ''),
                'current_stock': item.get('current_stock', 0),
                'prediction_days': days_ahead,
                'total_predicted_demand': round(total_predicted, 0),
                'average_daily_demand': round(total_predicted / days_ahead, 1),
                'confidence_percent': round(confidence, 0),
                'predictions': predictions,
                'recommendation': self._generate_demand_recommendation(
                    item, total_predicted, days_ahead
                )
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def get_supplier_order_summary(self, user_id: str) -> Dict[str, Any]:
        """
        Group reorder alerts by supplier for efficient ordering
        """
        try:
            alerts_result = await self.get_reorder_alerts(user_id)
            
            if alerts_result['status'] != 'success':
                return alerts_result
            
            # Group by supplier
            supplier_orders = {}
            for alert in alerts_result['alerts']:
                supplier_id = alert.get('supplier_id', 'unknown')
                supplier_name = alert.get('supplier_name', 'Unknown Supplier')
                
                if supplier_id not in supplier_orders:
                    supplier_orders[supplier_id] = {
                        'supplier_id': supplier_id,
                        'supplier_name': supplier_name,
                        'items': [],
                        'total_value': 0,
                        'critical_items': 0
                    }
                
                supplier_orders[supplier_id]['items'].append(alert)
                supplier_orders[supplier_id]['total_value'] += alert['estimated_order_value']
                if alert['urgency'] == 'CRITICAL':
                    supplier_orders[supplier_id]['critical_items'] += 1
            
            # Convert to list and sort by critical items
            orders_list = list(supplier_orders.values())
            orders_list.sort(key=lambda x: (-x['critical_items'], -x['total_value']))
            
            return {
                'status': 'success',
                'total_suppliers': len(orders_list),
                'total_order_value': sum(o['total_value'] for o in orders_list),
                'supplier_orders': orders_list,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def _get_current_season(self) -> str:
        """Determine current UAE season/event"""
        today = datetime.now()
        
        # Check for specific events (approximate dates)
        month = today.month
        day = today.day
        
        # Ramadan (moves ~11 days earlier each year - this is approximate)
        # For 2024, Ramadan is around March 10 - April 9
        # For 2025, around February 28 - March 30
        # This would need to be updated annually or use Hijri calendar
        
        # Summer months
        if month in [6, 7, 8]:
            return 'summer'
        
        # Dubai Shopping Festival (Dec 15 - Jan 29 approximately)
        if month == 12 and day >= 15 or month == 1 and day <= 29:
            return 'dsf'
        
        # UAE National Day (Dec 2-3)
        if month == 12 and day in [1, 2, 3]:
            return 'national_day'
        
        return 'normal'

    def _get_season_for_date(self, date: datetime) -> str:
        """Get season for a specific date"""
        month = date.month
        day = date.day
        
        if month in [6, 7, 8]:
            return 'summer'
        if month == 12 and day >= 15 or month == 1 and day <= 29:
            return 'dsf'
        if month == 12 and day in [1, 2, 3]:
            return 'national_day'
        
        return 'normal'

    def _get_day_of_week_factor(self, weekday: int) -> float:
        """
        Get demand factor by day of week
        UAE weekend is Saturday-Sunday (changed from Fri-Sat in 2022)
        """
        # Monday=0, Sunday=6
        factors = {
            0: 1.0,   # Monday
            1: 1.0,   # Tuesday
            2: 1.0,   # Wednesday
            3: 1.1,   # Thursday (pre-weekend shopping)
            4: 1.2,   # Friday
            5: 0.8,   # Saturday (weekend - lower B2B)
            6: 0.9    # Sunday (weekend - lower B2B)
        }
        return factors.get(weekday, 1.0)

    def _calculate_urgency(self, days_until_stockout: float, lead_time: int) -> Dict:
        """Calculate reorder urgency"""
        if days_until_stockout <= lead_time:
            return {'level': 'CRITICAL', 'color': 'red'}
        elif days_until_stockout <= lead_time * 1.5:
            return {'level': 'HIGH', 'color': 'orange'}
        elif days_until_stockout <= lead_time * 2:
            return {'level': 'MEDIUM', 'color': 'yellow'}
        else:
            return {'level': 'LOW', 'color': 'blue'}

    def _calculate_order_quantity(self, item: Dict, daily_demand: float, lead_time: int) -> int:
        """
        Calculate optimal order quantity
        Uses simplified EOQ with practical constraints
        """
        # Target 2-4 weeks of stock depending on category
        category = item.get('category', 'general')
        
        if category == 'perishable':
            days_of_stock = 7  # 1 week
        elif category == 'pharmacy':
            days_of_stock = 30  # 1 month for critical items
        else:
            days_of_stock = 21  # 3 weeks
        
        # Calculate quantity
        base_qty = daily_demand * days_of_stock
        
        # Round up to case/pack quantity if applicable
        min_order_qty = item.get('min_order_quantity', 1)
        pack_size = item.get('pack_size', 1)
        
        if pack_size > 1:
            base_qty = ((base_qty // pack_size) + 1) * pack_size
        
        return max(min_order_qty, int(base_qty))

    def _generate_demand_recommendation(self, item: Dict, total_demand: float, days: int) -> Dict:
        """Generate recommendation based on demand prediction"""
        current_stock = item.get('current_stock', 0)
        
        if current_stock >= total_demand * 1.2:
            return {
                'action': 'NO_ACTION',
                'message': 'Stock is sufficient for the forecast period',
                'message_arabic': 'المخزون كافي للفترة المتوقعة'
            }
        elif current_stock >= total_demand:
            return {
                'action': 'MONITOR',
                'message': 'Stock is adequate but monitor closely',
                'message_arabic': 'المخزون مناسب لكن راقب عن كثب'
            }
        elif current_stock >= total_demand * 0.5:
            return {
                'action': 'REORDER_SOON',
                'message': f'Reorder within {int(days * 0.5)} days',
                'message_arabic': f'اطلب خلال {int(days * 0.5)} يوم'
            }
        else:
            return {
                'action': 'REORDER_NOW',
                'message': 'Immediate reorder recommended',
                'message_arabic': 'يوصى بالطلب فوراً'
            }

    async def _get_inventory_items(self, user_id: str) -> List[Dict]:
        """Fetch inventory items"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/inventory_items",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'is_active': 'eq.true',
                    'select': '*,suppliers(name)'
                }
            )
            if response.status_code == 200:
                items = response.json()
                # Flatten supplier name
                for item in items:
                    if item.get('suppliers'):
                        item['supplier_name'] = item['suppliers'].get('name', '')
                return items
        return []

    async def _get_item(self, item_id: str) -> Optional[Dict]:
        """Fetch single item"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/inventory_items",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={'id': f'eq.{item_id}', 'select': '*'}
            )
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        return None

    async def _get_sales_history(self, user_id: str, item_id: str, days: int = 90) -> List[Dict]:
        """Fetch sales history for an item"""
        start_date = datetime.now() - timedelta(days=days)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/transactions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'user_id': f'eq.{user_id}',
                    'item_id': f'eq.{item_id}',
                    'transaction_type': 'eq.sale',
                    'date': f'gte.{start_date.isoformat()}',
                    'select': 'date,quantity,amount_aed',
                    'order': 'date.desc'
                }
            )
            if response.status_code == 200:
                return response.json()
        return []


# Singleton instance
reorder_agent = ReorderAgent()
