"""
StoreBuddy UAE - Sales Pattern Agent
Analyzes sales patterns with UAE-specific factors
"""

import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from collections import defaultdict
import httpx
from dotenv import load_dotenv

load_dotenv()

class SalesPatternAgent:
    """
    Analyzes sales patterns with UAE-specific factors:
    - UAE weekend (Sat-Sun since 2022, was Fri-Sat before)
    - Prayer times impact
    - Ramadan patterns (late night shopping)
    - Summer slowdown (expat travel)
    - Salary cycles (end of month)
    - Dubai Shopping Festival, Eid, National Day
    """
    
    # UAE-specific time patterns
    DAILY_PATTERNS = {
        'morning': {'start': 9, 'end': 12, 'label': 'Morning', 'label_ar': 'الصباح'},
        'afternoon': {'start': 12, 'end': 16, 'label': 'Afternoon', 'label_ar': 'بعد الظهر'},
        'evening': {'start': 16, 'end': 21, 'label': 'Evening', 'label_ar': 'المساء'},
        'night': {'start': 21, 'end': 24, 'label': 'Night', 'label_ar': 'الليل'}
    }
    
    # Day of week patterns (UAE weekend is Sat-Sun since 2022)
    DAY_NAMES = {
        0: {'en': 'Monday', 'ar': 'الإثنين'},
        1: {'en': 'Tuesday', 'ar': 'الثلاثاء'},
        2: {'en': 'Wednesday', 'ar': 'الأربعاء'},
        3: {'en': 'Thursday', 'ar': 'الخميس'},
        4: {'en': 'Friday', 'ar': 'الجمعة'},
        5: {'en': 'Saturday', 'ar': 'السبت'},
        6: {'en': 'Sunday', 'ar': 'الأحد'}
    }
    
    # Monthly salary cycle patterns
    SALARY_PATTERNS = {
        'government': [25, 28],  # Govt employees paid 25th-28th
        'private': [28, 1, 2, 3],  # Private sector end of month
        'construction': [1, 5, 10, 15]  # Construction often mid-month
    }

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_ANON_KEY')

    async def analyze_patterns(self, user_id: str, days: int = 90) -> Dict[str, Any]:
        """
        Comprehensive sales pattern analysis
        
        Args:
            user_id: Shop owner's UUID
            days: Number of days to analyze
        
        Returns:
            Pattern analysis with actionable insights
        """
        try:
            # Fetch sales data
            transactions = await self._get_sales_transactions(user_id, days)
            
            if not transactions:
                return {
                    'status': 'success',
                    'message': 'No sales data available for analysis',
                    'patterns': {}
                }
            
            # Analyze various patterns
            hourly = self._analyze_hourly_pattern(transactions)
            daily = self._analyze_daily_pattern(transactions)
            weekly = self._analyze_weekly_pattern(transactions)
            monthly = self._analyze_monthly_pattern(transactions)
            category = self._analyze_category_pattern(transactions)
            payment = self._analyze_payment_pattern(transactions)
            
            # Generate insights
            insights = self._generate_insights(hourly, daily, weekly, monthly)
            
            return {
                'status': 'success',
                'analysis_period': {
                    'days': days,
                    'start_date': (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d'),
                    'end_date': datetime.now().strftime('%Y-%m-%d')
                },
                'total_transactions': len(transactions),
                'total_revenue': sum(t.get('amount_aed', 0) for t in transactions),
                'patterns': {
                    'hourly': hourly,
                    'daily': daily,
                    'weekly': weekly,
                    'monthly': monthly,
                    'category': category,
                    'payment_method': payment
                },
                'insights': insights,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def get_peak_times(self, user_id: str) -> Dict[str, Any]:
        """
        Identify peak selling times for staffing and inventory
        """
        try:
            transactions = await self._get_sales_transactions(user_id, 30)
            
            if not transactions:
                return {'status': 'success', 'message': 'Insufficient data', 'peak_times': []}
            
            # Aggregate by hour and day
            hour_day_sales = defaultdict(lambda: {'count': 0, 'revenue': 0})
            
            for txn in transactions:
                date_str = txn.get('date', '')
                if not date_str:
                    continue
                    
                try:
                    dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    key = (dt.weekday(), dt.hour)
                    hour_day_sales[key]['count'] += 1
                    hour_day_sales[key]['revenue'] += txn.get('amount_aed', 0)
                except:
                    continue
            
            # Find top 10 peak slots
            slots = []
            for (day, hour), data in hour_day_sales.items():
                slots.append({
                    'day': day,
                    'day_name': self.DAY_NAMES[day]['en'],
                    'day_name_arabic': self.DAY_NAMES[day]['ar'],
                    'hour': hour,
                    'time_range': f"{hour:02d}:00 - {hour+1:02d}:00",
                    'transaction_count': data['count'],
                    'revenue': data['revenue'],
                    'avg_transaction': data['revenue'] / data['count'] if data['count'] > 0 else 0
                })
            
            # Sort by revenue
            slots.sort(key=lambda x: -x['revenue'])
            peak_slots = slots[:10]
            
            # Identify slow times
            slow_slots = sorted(slots, key=lambda x: x['revenue'])[:5]
            
            return {
                'status': 'success',
                'peak_times': peak_slots,
                'slow_times': slow_slots,
                'recommendations': self._generate_staffing_recommendations(peak_slots, slow_slots)
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def get_customer_segments(self, user_id: str) -> Dict[str, Any]:
        """
        Identify customer segments based on transaction patterns
        """
        try:
            # Get customer transaction data
            customers = await self._get_customer_transactions(user_id)
            
            if not customers:
                return {'status': 'success', 'message': 'No customer data', 'segments': []}
            
            segments = {
                'high_value': [],
                'regular': [],
                'occasional': [],
                'at_risk': []
            }
            
            for customer_id, data in customers.items():
                avg_transaction = data['total_revenue'] / data['transaction_count'] if data['transaction_count'] > 0 else 0
                frequency = data['transaction_count']
                days_since_last = data.get('days_since_last', 999)
                
                customer_info = {
                    'customer_id': customer_id,
                    'customer_name': data.get('name', 'Unknown'),
                    'total_revenue': data['total_revenue'],
                    'transaction_count': frequency,
                    'avg_transaction': round(avg_transaction, 2),
                    'days_since_last': days_since_last
                }
                
                # Segment based on RFM-like analysis
                if avg_transaction >= 500 and frequency >= 5:
                    segments['high_value'].append(customer_info)
                elif frequency >= 10:
                    segments['regular'].append(customer_info)
                elif days_since_last > 60 and data['total_revenue'] > 1000:
                    segments['at_risk'].append(customer_info)
                else:
                    segments['occasional'].append(customer_info)
            
            # Sort each segment by revenue
            for key in segments:
                segments[key].sort(key=lambda x: -x['total_revenue'])
                segments[key] = segments[key][:10]  # Top 10 per segment
            
            return {
                'status': 'success',
                'segments': {
                    'high_value': {
                        'label': 'High Value Customers',
                        'label_arabic': 'عملاء ذوي قيمة عالية',
                        'description': 'Frequent buyers with high transaction values',
                        'count': len(segments['high_value']),
                        'customers': segments['high_value']
                    },
                    'regular': {
                        'label': 'Regular Customers',
                        'label_arabic': 'عملاء منتظمون',
                        'description': 'Consistent repeat buyers',
                        'count': len(segments['regular']),
                        'customers': segments['regular']
                    },
                    'at_risk': {
                        'label': 'At-Risk Customers',
                        'label_arabic': 'عملاء معرضون للخسارة',
                        'description': "Previously active but haven't purchased recently",
                        'count': len(segments['at_risk']),
                        'customers': segments['at_risk']
                    },
                    'occasional': {
                        'label': 'Occasional Customers',
                        'label_arabic': 'عملاء عرضيون',
                        'description': 'Infrequent buyers',
                        'count': len(segments['occasional']),
                        'customers': segments['occasional']
                    }
                },
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    async def forecast_sales(self, user_id: str, days_ahead: int = 7) -> Dict[str, Any]:
        """
        Simple sales forecast based on historical patterns
        """
        try:
            # Get historical data
            transactions = await self._get_sales_transactions(user_id, 90)
            
            if len(transactions) < 30:
                return {'status': 'success', 'message': 'Insufficient data for forecast'}
            
            # Calculate daily averages by day of week
            daily_totals = defaultdict(list)
            
            for txn in transactions:
                date_str = txn.get('date', '')
                if date_str:
                    try:
                        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                        day_key = dt.strftime('%Y-%m-%d')
                        daily_totals[day_key].append(txn.get('amount_aed', 0))
                    except:
                        continue
            
            # Calculate day-of-week averages
            dow_averages = defaultdict(list)
            for day_str, amounts in daily_totals.items():
                dt = datetime.fromisoformat(day_str)
                dow_averages[dt.weekday()].append(sum(amounts))
            
            dow_avg = {
                dow: sum(amounts) / len(amounts) if amounts else 0
                for dow, amounts in dow_averages.items()
            }
            
            # Overall daily average
            all_daily = [sum(amounts) for amounts in daily_totals.values()]
            overall_avg = sum(all_daily) / len(all_daily) if all_daily else 0
            
            # Generate forecast
            forecasts = []
            total_forecast = 0
            
            for i in range(days_ahead):
                date = datetime.now() + timedelta(days=i+1)
                dow = date.weekday()
                
                # Use day-of-week average if available, otherwise overall
                predicted = dow_avg.get(dow, overall_avg)
                
                # Apply seasonal adjustment
                season = self._get_season(date)
                seasonal_factor = {
                    'ramadan': 1.3,
                    'eid': 1.5,
                    'summer': 0.7,
                    'dsf': 1.2,
                    'normal': 1.0
                }.get(season, 1.0)
                
                adjusted_prediction = predicted * seasonal_factor
                total_forecast += adjusted_prediction
                
                forecasts.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'day': self.DAY_NAMES[dow]['en'],
                    'day_arabic': self.DAY_NAMES[dow]['ar'],
                    'predicted_sales': round(adjusted_prediction, 2),
                    'season': season,
                    'seasonal_factor': seasonal_factor
                })
            
            # Calculate confidence based on data consistency
            variance = sum((x - overall_avg) ** 2 for x in all_daily) / len(all_daily) if all_daily else 0
            cv = (variance ** 0.5) / overall_avg if overall_avg > 0 else 1
            confidence = max(0, min(95, 80 - cv * 30))
            
            return {
                'status': 'success',
                'forecast_period': f'{days_ahead} days',
                'total_predicted': round(total_forecast, 2),
                'daily_average_predicted': round(total_forecast / days_ahead, 2),
                'confidence_percent': round(confidence, 0),
                'forecasts': forecasts,
                'currency': 'AED'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def _analyze_hourly_pattern(self, transactions: List[Dict]) -> Dict:
        """Analyze sales by hour"""
        hourly = defaultdict(lambda: {'count': 0, 'revenue': 0})
        
        for txn in transactions:
            date_str = txn.get('date', '')
            if date_str:
                try:
                    dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    hourly[dt.hour]['count'] += 1
                    hourly[dt.hour]['revenue'] += txn.get('amount_aed', 0)
                except:
                    continue
        
        # Find peak hour
        peak_hour = max(hourly.keys(), key=lambda h: hourly[h]['revenue']) if hourly else 12
        
        return {
            'distribution': dict(hourly),
            'peak_hour': peak_hour,
            'peak_revenue': hourly[peak_hour]['revenue'] if hourly else 0
        }

    def _analyze_daily_pattern(self, transactions: List[Dict]) -> Dict:
        """Analyze sales by day of week"""
        daily = {i: {'count': 0, 'revenue': 0} for i in range(7)}
        
        for txn in transactions:
            date_str = txn.get('date', '')
            if date_str:
                try:
                    dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    daily[dt.weekday()]['count'] += 1
                    daily[dt.weekday()]['revenue'] += txn.get('amount_aed', 0)
                except:
                    continue
        
        # Format with day names
        formatted = {}
        for dow, data in daily.items():
            formatted[self.DAY_NAMES[dow]['en']] = {
                **data,
                'name_arabic': self.DAY_NAMES[dow]['ar']
            }
        
        peak_day = max(daily.keys(), key=lambda d: daily[d]['revenue'])
        
        return {
            'distribution': formatted,
            'peak_day': self.DAY_NAMES[peak_day]['en'],
            'peak_day_arabic': self.DAY_NAMES[peak_day]['ar'],
            'weekend_note': 'UAE weekend is Saturday-Sunday since 2022'
        }

    def _analyze_weekly_pattern(self, transactions: List[Dict]) -> Dict:
        """Analyze sales by week"""
        weekly = defaultdict(lambda: {'count': 0, 'revenue': 0})
        
        for txn in transactions:
            date_str = txn.get('date', '')
            if date_str:
                try:
                    dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    week_key = dt.strftime('%Y-W%W')
                    weekly[week_key]['count'] += 1
                    weekly[week_key]['revenue'] += txn.get('amount_aed', 0)
                except:
                    continue
        
        weeks = sorted(weekly.keys())
        if len(weeks) >= 2:
            trend = weekly[weeks[-1]]['revenue'] - weekly[weeks[-2]]['revenue']
            trend_direction = 'up' if trend > 0 else 'down' if trend < 0 else 'stable'
        else:
            trend = 0
            trend_direction = 'insufficient_data'
        
        return {
            'weeks': dict(weekly),
            'trend': round(trend, 2),
            'trend_direction': trend_direction
        }

    def _analyze_monthly_pattern(self, transactions: List[Dict]) -> Dict:
        """Analyze by day of month (salary cycle patterns)"""
        day_of_month = defaultdict(lambda: {'count': 0, 'revenue': 0})
        
        for txn in transactions:
            date_str = txn.get('date', '')
            if date_str:
                try:
                    dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    day_of_month[dt.day]['count'] += 1
                    day_of_month[dt.day]['revenue'] += txn.get('amount_aed', 0)
                except:
                    continue
        
        # Check for salary cycle patterns
        salary_days = list(range(25, 32)) + list(range(1, 6))
        salary_revenue = sum(day_of_month.get(d, {}).get('revenue', 0) for d in salary_days if d in day_of_month)
        total_revenue = sum(d['revenue'] for d in day_of_month.values())
        
        salary_pattern_strength = (salary_revenue / total_revenue) if total_revenue > 0 else 0
        
        return {
            'distribution': dict(day_of_month),
            'salary_cycle_impact': f"{salary_pattern_strength*100:.0f}% of sales near salary days",
            'salary_days': salary_days
        }

    def _analyze_category_pattern(self, transactions: List[Dict]) -> Dict:
        """Analyze sales by category"""
        categories = defaultdict(lambda: {'count': 0, 'revenue': 0})
        
        for txn in transactions:
            cat = txn.get('category', 'uncategorized')
            categories[cat]['count'] += 1
            categories[cat]['revenue'] += txn.get('amount_aed', 0)
        
        # Sort by revenue
        sorted_cats = sorted(categories.items(), key=lambda x: -x[1]['revenue'])
        
        return {
            'distribution': dict(categories),
            'top_category': sorted_cats[0][0] if sorted_cats else None,
            'top_category_revenue': sorted_cats[0][1]['revenue'] if sorted_cats else 0
        }

    def _analyze_payment_pattern(self, transactions: List[Dict]) -> Dict:
        """Analyze by payment method"""
        methods = defaultdict(lambda: {'count': 0, 'revenue': 0})
        
        for txn in transactions:
            method = txn.get('payment_method', 'cash')
            methods[method]['count'] += 1
            methods[method]['revenue'] += txn.get('amount_aed', 0)
        
        total = sum(m['revenue'] for m in methods.values())
        
        return {
            'distribution': {
                method: {
                    **data,
                    'percentage': round(data['revenue'] / total * 100, 1) if total > 0 else 0
                }
                for method, data in methods.items()
            }
        }

    def _generate_insights(self, hourly: Dict, daily: Dict, weekly: Dict, monthly: Dict) -> List[Dict]:
        """Generate actionable insights from patterns"""
        insights = []
        
        # Peak hour insight
        insights.append({
            'type': 'timing',
            'insight': f"Peak sales hour is {hourly['peak_hour']:02d}:00 - consider extra staff",
            'insight_arabic': f"ساعة الذروة هي {hourly['peak_hour']:02d}:00 - فكر في موظفين إضافيين",
            'priority': 'medium'
        })
        
        # Day of week insight
        insights.append({
            'type': 'timing',
            'insight': f"{daily['peak_day']} is your best day - ensure full stock",
            'insight_arabic': f"{daily['peak_day_arabic']} هو أفضل يوم - تأكد من توفر المخزون",
            'priority': 'high'
        })
        
        # Weekly trend
        if weekly['trend_direction'] == 'down':
            insights.append({
                'type': 'alert',
                'insight': f"Sales declining - down AED {abs(weekly['trend']):,.0f} vs last week",
                'insight_arabic': f"المبيعات تنخفض - أقل {abs(weekly['trend']):,.0f} درهم من الأسبوع الماضي",
                'priority': 'high'
            })
        elif weekly['trend_direction'] == 'up':
            insights.append({
                'type': 'positive',
                'insight': f"Sales growing - up AED {weekly['trend']:,.0f} vs last week",
                'insight_arabic': f"المبيعات تنمو - أعلى {weekly['trend']:,.0f} درهم من الأسبوع الماضي",
                'priority': 'low'
            })
        
        return insights

    def _generate_staffing_recommendations(self, peak_slots: List, slow_slots: List) -> List[Dict]:
        """Generate staffing recommendations"""
        recs = []
        
        if peak_slots:
            top = peak_slots[0]
            recs.append({
                'type': 'staffing',
                'recommendation': f"Add staff {top['time_range']} on {top['day_name']}s",
                'recommendation_arabic': f"أضف موظفين {top['time_range']} أيام {top['day_name_arabic']}",
                'reason': f"Highest revenue slot: AED {top['revenue']:,.0f}"
            })
        
        if slow_slots:
            slow = slow_slots[0]
            recs.append({
                'type': 'efficiency',
                'recommendation': f"Consider reducing staff {slow['time_range']} on {slow['day_name']}s",
                'recommendation_arabic': f"فكر في تقليل الموظفين {slow['time_range']} أيام {slow['day_name_arabic']}",
                'reason': f"Lowest revenue slot: AED {slow['revenue']:,.0f}"
            })
        
        return recs

    def _get_season(self, date: datetime) -> str:
        """Get current season/event for a date"""
        month = date.month
        if month in [6, 7, 8]:
            return 'summer'
        if month == 12 and date.day >= 15 or month == 1 and date.day <= 29:
            return 'dsf'
        return 'normal'

    async def _get_sales_transactions(self, user_id: str, days: int) -> List[Dict]:
        """Fetch sales transactions"""
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
                    'transaction_type': 'eq.sale',
                    'date': f'gte.{start_date.isoformat()}',
                    'select': '*',
                    'order': 'date.desc'
                }
            )
            
            if response.status_code == 200:
                return response.json()
        return []

    async def _get_customer_transactions(self, user_id: str) -> Dict:
        """Fetch and aggregate customer transactions"""
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
                    'select': 'customer_id,amount_aed,date,customers(name)'
                }
            )
            
            if response.status_code == 200:
                transactions = response.json()
                
                # Aggregate by customer
                customers = defaultdict(lambda: {
                    'transaction_count': 0,
                    'total_revenue': 0,
                    'last_date': None,
                    'name': ''
                })
                
                for txn in transactions:
                    cid = txn.get('customer_id')
                    if cid:
                        customers[cid]['transaction_count'] += 1
                        customers[cid]['total_revenue'] += txn.get('amount_aed', 0)
                        customers[cid]['name'] = txn.get('customers', {}).get('name', '') if txn.get('customers') else ''
                        
                        txn_date = txn.get('date')
                        if txn_date and (not customers[cid]['last_date'] or txn_date > customers[cid]['last_date']):
                            customers[cid]['last_date'] = txn_date
                
                # Calculate days since last
                now = datetime.now()
                for cid, data in customers.items():
                    if data['last_date']:
                        try:
                            last = datetime.fromisoformat(data['last_date'].replace('Z', '+00:00'))
                            data['days_since_last'] = (now - last).days
                        except:
                            data['days_since_last'] = 999
                
                return dict(customers)
        return {}


# Singleton instance
sales_pattern_agent = SalesPatternAgent()
