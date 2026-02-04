# 🏪 StoreBuddy UAE - AI Financial Companion for Shop Owners

> **One-liner:** AI-powered financial companion for small retail shop owners in UAE that turns daily chaos into business clarity.

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Target Market](#target-market)
3. [Product Overview](#product-overview)
4. [10 Feature Ideas](#10-feature-ideas)
5. [Phase 1 MVP (Ideas 1-7)](#phase-1-mvp-scope)
6. [UAE-Specific Adaptations](#uae-specific-adaptations)
7. [Technical Architecture](#technical-architecture)
8. [Database Schema](#database-schema)
9. [AI Agents Design](#ai-agents-design)
10. [UI/UX Design](#uiux-design)
11. [Development Roadmap](#development-roadmap)
12. [Compliance & Regulations](#compliance--regulations)

---

## 🎯 Executive Summary

### Why UAE Retail?

| Kamai (Gig Workers - India) | StoreBuddy (Shop Owners - UAE) | Alignment |
|----------------------------|--------------------------------|-----------|
| Irregular income | Seasonal sales fluctuations | ✓ Same problem |
| Track daily earnings | Track daily sales/revenue | ✓ Same workflow |
| Personal finance management | Business finance management | ✓ Direct extension |
| Government schemes | UAE SME support programs | ✓ Same concept |
| Tax compliance (GST/ITR) | Tax compliance (VAT) | ✓ Same requirement |
| AI recommendations | AI business insights | ✓ Same architecture |

### UAE Retail Market Opportunity

- **150,000+** small retail shops in UAE
- **70%** still use manual bookkeeping
- **5% VAT** compliance mandatory since 2018
- **AED 375,000** threshold for mandatory VAT registration
- Growing push for **digital transformation** by UAE government

---

## 🎯 Target Market

### Primary Users

| Segment | Description | Pain Points |
|---------|-------------|-------------|
| **Grocery/Baqala** | Small neighborhood grocery stores | Manual tracking, VAT compliance |
| **General Trading** | Electronics, mobile accessories | Credit management, profit tracking |
| **Pharmacies** | Independent pharmacies | Inventory, expiry tracking |
| **Cafeterias** | Small restaurants, cafeterias | Daily cash reconciliation |
| **Textile/Garments** | Small clothing shops | Seasonal inventory, credit sales |
| **Auto Parts** | Spare parts shops | Supplier management, reorder |

### User Profile

- **Business Size:** 1-10 employees
- **Annual Turnover:** AED 100,000 - AED 5,000,000
- **Location:** Dubai, Abu Dhabi, Sharjah, Ajman, RAK
- **Tech Comfort:** Basic smartphone users
- **Languages:** Arabic, English, Hindi, Urdu, Malayalam, Tagalog

---

## 📦 Product Overview

### Product Name: **StoreBuddy UAE**

### Tagline Options
- "Your Smart Business Partner" (English)
- "شريكك التجاري الذكي" (Arabic)
- "Apka Smart Business Partner" (Hindi/Urdu)

### Core Value Proposition

1. **Track Everything** - Sales, expenses, credit in one place
2. **Know Your Profit** - Real profit after ALL costs
3. **Stay Compliant** - VAT calculations done automatically
4. **Get Paid** - Smart credit reminders
5. **Never Run Out** - AI-powered reorder alerts
6. **Access Support** - UAE government SME programs

---

## 💡 10 Feature Ideas

### Complete Feature Matrix

| # | Idea | Description | Kamai Reuse | Priority |
|---|------|-------------|-------------|----------|
| 1 | Smart Sales & Expense Tracking | Digital ledger with quick entry, receipt scanning, voice | 90% | ⭐ MVP |
| 2 | AI Profit Analysis Agent | True profit calculation, margin analysis, hidden costs | 70% | ⭐ MVP |
| 3 | Credit Management (Hisab/حساب) | Track credit given, smart reminders, risk scoring | 60% | ⭐ MVP |
| 4 | Smart Reorder Alerts | AI predicts when to restock based on purchase patterns | 50% | ⭐ MVP |
| 5 | VAT Compliance | Auto VAT calculation, FTA filing reminders, return summaries | 70% | ⭐ MVP |
| 6 | Business Health Score | 7-dimension health scoring with early warnings | 80% | ⭐ MVP |
| 7 | UAE SME Programs | Match Dubai SME, Khalifa Fund, MBRF based on profile | 90% | ⭐ MVP |
| 8 | Supplier Price Comparison | Track prices, compare suppliers, alert on increases | 30% | Phase 2 |
| 9 | Multi-Store Support | Manage 2-3 shops from one dashboard | 40% | Phase 2 |
| 10 | WhatsApp Bot | Quick entries via chat ("/sale 500", "/balance") | 20% | Phase 2 |

---

## 📋 Phase 1 MVP Scope

### Selected Features (Ideas 1-7)

---

### 🧾 IDEA 1: Smart Sales & Expense Tracking

**Problem:** Shop owners track sales in notebooks, miss expenses, can't see real profit.

**Solution:** Digital ledger with multiple input methods + automatic categorization.

#### Features

| Feature | Description | UAE Adaptation |
|---------|-------------|----------------|
| Quick Sale Entry | One-tap sale recording (AED 500 → Category) | AED currency, VAT auto-calculation |
| Expense Logging | Stock purchases, rent, utilities, wages | UAE expense categories |
| Cash vs Digital | Track cash/card/bank transfer separately | Apple Pay, Samsung Pay support |
| Photo Receipt | Snap supplier bills → auto-extract data | Arabic + English OCR |
| Voice Entry | "Bought rice 50kg for 200 dirhams" | Multi-language voice (AR/EN/HI) |
| Daily Summary | Day-end cash position | Shift-based summaries |

#### UAE-Specific Fields

```
Transaction Fields:
- amount_aed: DECIMAL(10,2)
- vat_amount: DECIMAL(10,2)  -- Auto-calculated 5%
- vat_category: ENUM('standard', 'zero_rated', 'exempt')
- payment_method: ENUM('cash', 'card', 'bank_transfer', 'apple_pay', 'samsung_pay')
- customer_trn: VARCHAR(15)  -- For B2B sales
- invoice_number: VARCHAR(50)
- is_credit: BOOLEAN
- credit_due_date: DATE
```

#### Screen: Sales Entry

```
┌─────────────────────────────────────┐
│  ☰  StoreBuddy     🔔  👤          │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │     AED 0.00                │   │
│  │     ___________________     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │ 7   │ │ 8   │ │ 9   │ │ ⌫   │  │
│  ├─────┤ ├─────┤ ├─────┤ ├─────┤  │
│  │ 4   │ │ 5   │ │ 6   │ │ +   │  │
│  ├─────┤ ├─────┤ ├─────┤ ├─────┤  │
│  │ 1   │ │ 2   │ │ 3   │ │ VAT │  │
│  ├─────┤ ├─────┤ ├─────┤ ├─────┤  │
│  │ .   │ │ 0   │ │ 00  │ │ ✓   │  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│                                     │
│  [💵 Cash] [💳 Card] [🏦 Transfer] │
│                                     │
│  Category: [Grocery ▼]              │
│  Customer: [Optional]               │
│                                     │
│  [ 🎤 Voice Entry ]                 │
│  [ 📷 Scan Receipt ]                │
│                                     │
└─────────────────────────────────────┘
```

---

### 📊 IDEA 2: AI Profit Analysis Agent

**Problem:** Shop owners know revenue but not actual profit (hidden costs eat margins).

**Solution:** Multi-agent system that calculates true profit after ALL expenses.

#### Profit Calculation Model

```
REVENUE (Sales)
├── Cash Sales
├── Card Sales
└── Credit Sales (Collected)

MINUS: Cost of Goods Sold (COGS)
├── Purchase Cost
├── Shipping/Import Duties
└── Customs Clearance

= GROSS PROFIT

MINUS: Operating Expenses
├── Rent (Shop rent in UAE is significant)
├── Utilities (DEWA - Dubai Electricity & Water)
├── Salaries (Staff + WPS compliance)
├── Visa/Labor Costs (Unique to UAE)
├── Trade License Renewal
├── Municipality Fees
├── Insurance
└── Marketing

= OPERATING PROFIT

MINUS: Financial Costs
├── Bank Charges
├── POS Machine Fees
├── Loan EMI (if any)
└── Credit Card Processing (2-3%)

MINUS: VAT Payable
├── Output VAT (Sales)
└── Input VAT Credit (Purchases)

= NET PROFIT
```

#### UAE-Specific Cost Categories

| Cost Category | Typical Range | Notes |
|--------------|---------------|-------|
| Shop Rent | AED 50,000 - 200,000/year | Major expense in UAE |
| Trade License | AED 10,000 - 50,000/year | DED/Free Zone |
| Visa Costs | AED 5,000 - 8,000/employee | Every 2-3 years |
| DEWA (Utilities) | AED 500 - 3,000/month | Electricity + Water |
| Etisalat/Du | AED 200 - 500/month | Internet + Phone |
| Insurance | AED 1,000 - 5,000/year | Shop insurance |
| POS Fees | 1.5% - 3% per transaction | Card processing |

#### Agent Design

```python
# profit_agent.py
class ProfitAnalysisAgent:
    """
    UAE-specific profit analysis considering:
    1. VAT implications (5% standard rate)
    2. High rent costs (Dubai/Abu Dhabi)
    3. Visa and labor costs
    4. Import duties and customs
    5. Seasonal variations (Ramadan, Eid, Summer)
    """

    def analyze(self, user_id: str, period: str = "monthly"):
        # Get financial data
        sales = get_sales(user_id, period)
        purchases = get_purchases(user_id, period)
        expenses = get_expenses(user_id, period)
        
        # Calculate UAE-specific metrics
        gross_profit = sales.total - purchases.cogs
        gross_margin = (gross_profit / sales.total) * 100
        
        # Operating expenses (UAE categories)
        operating_costs = sum([
            expenses.rent,
            expenses.dewa,  # Utilities
            expenses.salaries,
            expenses.visa_costs,
            expenses.trade_license,
            expenses.municipality_fees,
            expenses.insurance,
            expenses.marketing
        ])
        
        operating_profit = gross_profit - operating_costs
        
        # Financial costs
        financial_costs = sum([
            expenses.bank_charges,
            expenses.pos_fees,
            expenses.loan_emi
        ])
        
        # VAT calculation
        vat_payable = sales.output_vat - purchases.input_vat
        
        net_profit = operating_profit - financial_costs - vat_payable
        
        return {
            "revenue": sales.total,
            "gross_profit": gross_profit,
            "gross_margin_percent": gross_margin,
            "operating_profit": operating_profit,
            "net_profit": net_profit,
            "net_margin_percent": (net_profit / sales.total) * 100,
            "vat_payable": vat_payable,
            "top_expenses": get_top_expenses(expenses),
            "profit_leaks": identify_profit_leaks(expenses),
            "recommendations": generate_recommendations(metrics),
            "benchmark_comparison": compare_with_industry(gross_margin)
        }
```

#### Screen: Profit Dashboard

```
┌─────────────────────────────────────┐
│  ☰  Profit Analysis    January 2026│
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  NET PROFIT                 │   │
│  │  AED 12,450                 │   │
│  │  ↑ 8% vs last month         │   │
│  └─────────────────────────────┘   │
│                                     │
│  Revenue          AED 85,000       │
│  ├─ COGS          AED 55,000       │
│  ├─ Gross Profit  AED 30,000 (35%) │
│  ├─ Operating     AED 15,000       │
│  ├─ VAT Payable   AED 2,550        │
│  └─ Net Profit    AED 12,450 (15%) │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📊 Margin Trend (6 months)  │   │
│  │ [Chart: Line graph]         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⚠️ Profit Leaks Detected:         │
│  • POS fees high: AED 2,100 (2.5%) │
│  • Electricity up 15% this month   │
│                                     │
│  💡 Recommendations:                │
│  • Negotiate POS rates (target 2%) │
│  • Consider LED lighting upgrade   │
│                                     │
└─────────────────────────────────────┘
```

---

### 💳 IDEA 3: Credit Management (Hisab/حساب)

**Problem:** Shop owners give credit ("hisab" / "khata"), forget to collect, lose money.

**Solution:** Digital credit ledger with smart reminders and risk scoring.

#### UAE Context

- Credit sales common in B2B (restaurant supplies, office supplies)
- Also common with regular customers in baqalas
- Arabic term: "حساب" (Hisab) - Account
- Hindi/Urdu term: "Udhar" / "Khata"
- Payment collection via cash, bank transfer, or cheque

#### Features

| Feature | Description |
|---------|-------------|
| Customer Credit Book | Track all credit given per customer |
| Payment Recording | Record partial/full payments |
| Smart Reminders | WhatsApp/SMS reminders in customer's language |
| Credit Risk Score | AI-calculated trust score (0-100) |
| Credit Aging | 30/60/90+ days overdue reports |
| Credit Limits | AI-recommended limits per customer |
| Collection Analytics | Recovery rate, average collection days |

#### Credit Risk Scoring Model

```python
# credit_risk_agent.py
class CreditRiskAgent:
    """
    Calculates customer creditworthiness based on:
    1. Payment history (on-time vs late)
    2. Total credit volume
    3. Average days to pay
    4. Bounced cheques (if any)
    5. Business relationship duration
    """

    def calculate_trust_score(self, customer_id: str) -> dict:
        history = get_payment_history(customer_id)
        
        # Scoring factors (UAE-adapted)
        on_time_ratio = history.on_time_payments / history.total_payments
        avg_days_to_pay = history.average_payment_days
        bounced_cheques = history.bounced_cheque_count
        relationship_months = history.customer_since_months
        
        # Calculate score (0-100)
        base_score = 50
        
        # Payment punctuality (+/- 25 points)
        if on_time_ratio >= 0.9:
            base_score += 25
        elif on_time_ratio >= 0.7:
            base_score += 15
        elif on_time_ratio >= 0.5:
            base_score += 5
        else:
            base_score -= 15
        
        # Speed of payment (+/- 15 points)
        if avg_days_to_pay <= 7:
            base_score += 15
        elif avg_days_to_pay <= 15:
            base_score += 10
        elif avg_days_to_pay <= 30:
            base_score += 0
        else:
            base_score -= 10
        
        # Bounced cheques (-20 points each, max -40)
        base_score -= min(bounced_cheques * 20, 40)
        
        # Relationship bonus (+10 max)
        base_score += min(relationship_months // 6, 10)
        
        # Ensure 0-100 range
        final_score = max(0, min(100, base_score))
        
        # Recommend credit limit
        if final_score >= 80:
            risk_level = "LOW"
            credit_limit = "AED 10,000+"
        elif final_score >= 60:
            risk_level = "MEDIUM"
            credit_limit = "AED 2,000 - 5,000"
        elif final_score >= 40:
            risk_level = "HIGH"
            credit_limit = "AED 500 - 1,000"
        else:
            risk_level = "VERY HIGH"
            credit_limit = "Cash only recommended"
        
        return {
            "score": final_score,
            "risk_level": risk_level,
            "recommended_limit": credit_limit,
            "factors": {
                "payment_punctuality": on_time_ratio,
                "avg_days_to_pay": avg_days_to_pay,
                "bounced_cheques": bounced_cheques,
                "relationship_months": relationship_months
            }
        }
```

#### Screen: Credit Ledger

```
┌─────────────────────────────────────┐
│  ☰  Credit Book (حساب)    🔍       │
├─────────────────────────────────────┤
│                                     │
│  Total Outstanding: AED 15,750     │
│  ├─ Current (< 30d):  AED 8,200    │
│  ├─ Overdue (30-60d): AED 4,550    │
│  └─ Critical (60d+):  AED 3,000 ⚠️ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Ahmed Trading LLC        │   │
│  │    AED 5,200 outstanding    │   │
│  │    ⭐ Trust Score: 85/100   │   │
│  │    📅 Last payment: 5 days  │   │
│  │    [💬 Remind] [📝 Details] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Mohammed (Regular)       │   │
│  │    AED 350 outstanding      │   │
│  │    ⭐ Trust Score: 72/100   │   │
│  │    📅 Due: 3 days ago ⚠️    │   │
│  │    [💬 Remind] [📝 Details] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Fatima Cafeteria         │   │
│  │    AED 3,000 outstanding    │   │
│  │    ⭐ Trust Score: 45/100   │   │
│  │    📅 Overdue: 45 days 🔴   │   │
│  │    [💬 Remind] [📝 Details] │   │
│  └─────────────────────────────────┘│
│                                     │
│  [ + Add New Credit Sale ]          │
│                                     │
└─────────────────────────────────────┘
```

---

### 📦 IDEA 4: Smart Reorder Alerts

**Problem:** Shop owners run out of stock OR overstock items, tying up capital.

**Solution:** AI predicts when to reorder based on sales velocity and supplier lead times.

#### UAE-Specific Considerations

- Import lead times (many goods imported)
- Ramadan/Eid demand spikes
- Summer slowdown (many residents travel)
- Dubai Shopping Festival periods
- Expo/major events impact

#### Features

| Feature | Description |
|---------|-------------|
| Purchase Pattern Analysis | Learn when you usually buy each category |
| Sales Velocity Tracking | How fast items sell |
| Seasonal Demand Prediction | Ramadan, Eid, Summer, DSF adjustments |
| Supplier Lead Time | Factor in delivery delays |
| Capital Optimization | Avoid overstocking |
| Reorder Alerts | Push notifications when stock likely low |

#### Agent Design

```python
# reorder_agent.py
class ReorderAgent:
    """
    UAE-specific reorder intelligence:
    1. Import timelines (7-30 days for international)
    2. Local supplier delivery (1-3 days)
    3. Seasonal patterns (Ramadan +40%, Summer -30%)
    4. Festival periods (Eid, DSF)
    5. Cash flow consideration
    """

    # UAE seasonal multipliers
    SEASONAL_FACTORS = {
        "ramadan": 1.4,      # 40% increase
        "eid_al_fitr": 1.5,  # 50% spike
        "eid_al_adha": 1.3,  # 30% increase
        "summer": 0.7,       # 30% decrease (July-Aug)
        "dsf": 1.2,          # Dubai Shopping Festival
        "normal": 1.0
    }

    def predict_reorder(self, user_id: str, category: str) -> dict:
        # Get purchase history
        purchases = get_purchases(user_id, category, last_12_months)
        sales = get_sales(user_id, category, last_12_months)
        
        # Calculate average purchase cycle
        avg_purchase_cycle = calculate_avg_days_between_purchases(purchases)
        days_since_last = days_since_last_purchase(purchases)
        
        # Calculate daily sales velocity
        daily_velocity = sales.total_quantity / 365
        
        # Get seasonal adjustment
        current_season = get_current_season()  # Returns ramadan, eid, summer, etc.
        seasonal_factor = self.SEASONAL_FACTORS.get(current_season, 1.0)
        adjusted_velocity = daily_velocity * seasonal_factor
        
        # Estimate days of stock remaining (if inventory tracked)
        if has_inventory_data(user_id, category):
            current_stock = get_current_stock(user_id, category)
            days_remaining = current_stock / adjusted_velocity
        else:
            # Estimate based on purchase patterns
            days_remaining = avg_purchase_cycle - days_since_last
        
        # Get supplier lead time
        supplier_lead_time = get_supplier_lead_time(user_id, category)
        
        # Calculate reorder point
        safety_stock_days = 3  # 3-day buffer
        reorder_point = (adjusted_velocity * supplier_lead_time) + (adjusted_velocity * safety_stock_days)
        
        # Determine if reorder needed
        needs_reorder = days_remaining <= (supplier_lead_time + safety_stock_days)
        
        # Optimal order quantity (considering cash flow)
        cash_available = get_available_cash(user_id)
        optimal_qty = calculate_eoq(adjusted_velocity, category, cash_available)
        
        return {
            "category": category,
            "needs_reorder": needs_reorder,
            "urgency": "HIGH" if days_remaining < supplier_lead_time else "MEDIUM" if needs_reorder else "LOW",
            "days_remaining": days_remaining,
            "suggested_quantity": optimal_qty,
            "estimated_cost": optimal_qty * get_avg_unit_cost(category),
            "supplier_lead_time": supplier_lead_time,
            "seasonal_note": f"Currently {current_season}: demand is {int((seasonal_factor-1)*100)}% {'higher' if seasonal_factor > 1 else 'lower'}" if seasonal_factor != 1 else None,
            "last_purchase": {
                "date": purchases.last_date,
                "quantity": purchases.last_quantity,
                "supplier": purchases.last_supplier
            }
        }
```

#### Screen: Reorder Alerts

```
┌─────────────────────────────────────┐
│  ☰  Reorder Alerts     🔔 3 alerts │
├─────────────────────────────────────┤
│                                     │
│  🕌 Ramadan starts in 15 days!     │
│  Demand expected to increase 40%   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  🔴 URGENT - Order Now             │
│  ┌─────────────────────────────┐   │
│  │ 🛒 Rice (Basmati)           │   │
│  │    Est. stock: 2 days       │   │
│  │    Lead time: 5 days        │   │
│  │    Suggest: 200 kg          │   │
│  │    Est. cost: AED 1,400     │   │
│  │    [📞 Call Supplier]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  🟡 ORDER SOON - This Week         │
│  ┌─────────────────────────────┐   │
│  │ 🧴 Cooking Oil              │   │
│  │    Est. stock: 8 days       │   │
│  │    Lead time: 3 days        │   │
│  │    Suggest: 50 L            │   │
│  │    Est. cost: AED 450       │   │
│  └─────────────────────────────┘   │
│                                     │
│  🟢 HEALTHY STOCK                   │
│  ┌─────────────────────────────┐   │
│  │ 🧹 Cleaning Supplies        │   │
│  │    Est. stock: 25 days      │   │
│  │    Next order: ~3 weeks     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

### 🧾 IDEA 5: VAT Compliance Assistant

**Problem:** Small shops struggle with VAT calculations, filing, and FTA compliance.

**Solution:** Automated VAT calculation and filing reminders with FTA-compliant reports.

#### UAE VAT Overview

| Aspect | Details |
|--------|---------|
| Standard Rate | 5% |
| Zero-Rated | Exports, international transport, some food items |
| Exempt | Residential rent, local transport, bare land |
| Registration Threshold | AED 375,000 (mandatory) / AED 187,500 (voluntary) |
| Filing Frequency | Quarterly (most SMEs) or Monthly |
| Return Due Date | 28th of month following period end |
| Record Keeping | 5 years minimum |

#### Features

| Feature | Description |
|---------|-------------|
| Auto VAT Calculation | Calculate 5% VAT on each sale |
| VAT Category Tagging | Standard / Zero-rated / Exempt |
| Input VAT Tracking | Track VAT paid on purchases |
| VAT Return Summary | Auto-generate VAT return data |
| Filing Reminders | Notify before due dates |
| TRN Validation | Validate customer TRN for B2B |
| Tax Invoice Generation | FTA-compliant invoices |

#### UAE VAT Categories

```python
VAT_CATEGORIES = {
    "standard": {
        "rate": 0.05,
        "description": "Standard rated supplies",
        "examples": ["General goods", "Services", "Electronics"]
    },
    "zero_rated": {
        "rate": 0.00,
        "description": "Zero-rated supplies",
        "examples": [
            "Exports outside GCC",
            "International transportation",
            "First sale of residential property (within 3 years)",
            "Certain education and healthcare services"
        ]
    },
    "exempt": {
        "rate": None,  # No VAT, no input credit
        "description": "Exempt supplies",
        "examples": [
            "Residential rent",
            "Bare land",
            "Local passenger transport",
            "Life insurance"
        ]
    }
}
```

#### Agent Design

```python
# vat_agent.py
class VATComplianceAgent:
    """
    UAE FTA VAT compliance assistant:
    1. Auto-calculate VAT on transactions
    2. Track input vs output VAT
    3. Generate VAT return summaries
    4. Filing deadline reminders
    5. TRN validation
    """

    UAE_VAT_RATE = 0.05
    FILING_DEADLINE_DAY = 28

    def calculate_vat_position(self, user_id: str, period: str) -> dict:
        # Get all transactions for period
        sales = get_sales(user_id, period)
        purchases = get_purchases(user_id, period)
        
        # Calculate Output VAT (VAT collected on sales)
        output_vat = {
            "standard_rated": {
                "amount": sum(s.amount for s in sales if s.vat_category == "standard"),
                "vat": sum(s.vat_amount for s in sales if s.vat_category == "standard")
            },
            "zero_rated": {
                "amount": sum(s.amount for s in sales if s.vat_category == "zero_rated"),
                "vat": 0
            },
            "exempt": {
                "amount": sum(s.amount for s in sales if s.vat_category == "exempt"),
                "vat": 0
            }
        }
        
        total_output_vat = output_vat["standard_rated"]["vat"]
        
        # Calculate Input VAT (VAT paid on purchases)
        input_vat = {
            "recoverable": sum(p.vat_amount for p in purchases if p.has_valid_tax_invoice),
            "non_recoverable": sum(p.vat_amount for p in purchases if not p.has_valid_tax_invoice)
        }
        
        total_input_vat = input_vat["recoverable"]
        
        # Net VAT position
        net_vat = total_output_vat - total_input_vat
        
        # Filing deadline
        period_end = get_period_end_date(period)
        filing_deadline = get_next_month(period_end).replace(day=self.FILING_DEADLINE_DAY)
        days_until_due = (filing_deadline - today()).days
        
        return {
            "period": period,
            "output_vat": {
                "total": total_output_vat,
                "breakdown": output_vat
            },
            "input_vat": {
                "total": total_input_vat,
                "recoverable": input_vat["recoverable"],
                "non_recoverable": input_vat["non_recoverable"]
            },
            "net_vat_payable": net_vat if net_vat > 0 else 0,
            "net_vat_refundable": abs(net_vat) if net_vat < 0 else 0,
            "filing_deadline": filing_deadline,
            "days_until_due": days_until_due,
            "status": "URGENT" if days_until_due <= 7 else "OK",
            "vat_return_summary": self.generate_vat_return_summary(output_vat, input_vat)
        }

    def generate_vat_return_summary(self, output_vat: dict, input_vat: dict) -> dict:
        """Generate FTA VAT return format summary"""
        return {
            "box1_standard_rated_supplies": output_vat["standard_rated"]["amount"],
            "box2_tax_on_standard_rated": output_vat["standard_rated"]["vat"],
            "box3_zero_rated_supplies": output_vat["zero_rated"]["amount"],
            "box4_exempt_supplies": output_vat["exempt"]["amount"],
            "box5_total_supplies": sum(v["amount"] for v in output_vat.values()),
            "box6_standard_rated_expenses": input_vat["recoverable"] / self.UAE_VAT_RATE,
            "box7_input_vat_recoverable": input_vat["recoverable"],
            "box8_net_vat": output_vat["standard_rated"]["vat"] - input_vat["recoverable"]
        }
```

#### Screen: VAT Dashboard

```
┌─────────────────────────────────────┐
│  ☰  VAT Compliance      Q4 2025    │
├─────────────────────────────────────┤
│                                     │
│  ⏰ Filing Deadline: Jan 28, 2026   │
│     12 days remaining              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  NET VAT PAYABLE            │   │
│  │  AED 2,850                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  OUTPUT VAT (Sales)                │
│  ┌─────────────────────────────┐   │
│  │ Standard (5%):  AED 4,250   │   │
│  │ Zero-rated:     AED 0       │   │
│  │ Exempt:         AED 0       │   │
│  │ ─────────────────────────   │   │
│  │ Total Output:   AED 4,250   │   │
│  └─────────────────────────────┘   │
│                                     │
│  INPUT VAT (Purchases)             │
│  ┌─────────────────────────────┐   │
│  │ Recoverable:    AED 1,400   │   │
│  │ Non-recoverable: AED 150    │   │
│  │ ─────────────────────────   │   │
│  │ Total Input:    AED 1,400   │   │
│  └─────────────────────────────┘   │
│                                     │
│  📋 VAT Return Summary              │
│  ┌─────────────────────────────┐   │
│  │ Box 1: AED 85,000 (Std)     │   │
│  │ Box 2: AED 4,250 (VAT)      │   │
│  │ Box 7: AED 1,400 (Input)    │   │
│  │ Box 8: AED 2,850 (Net)      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [ 📄 Export VAT Report ]          │
│  [ 💳 Pay VAT via e-Dirham ]       │
│                                     │
│  TRN: 100123456789012              │
│                                     │
└─────────────────────────────────────┘
```

---

### 📈 IDEA 6: Business Health Score

**Problem:** Shop owners don't know if their business is healthy until it's too late.

**Solution:** Real-time 7-dimension business health scoring with early warning signals.

#### Health Dimensions (UAE-Adapted)

| Dimension | What It Measures | UAE Context |
|-----------|------------------|-------------|
| **Profitability** | Net profit margin | Are you making money after all UAE costs? |
| **Liquidity** | Cash + receivables vs payables | Can you pay rent, DEWA, salaries? |
| **Credit Health** | Receivables collection | How much is stuck in customer credit? |
| **Expense Control** | Operating expense ratio | Are rent/visa/utility costs in check? |
| **Growth Trend** | Revenue growth rate | Is business growing or declining? |
| **Debt Burden** | Loan EMI vs income | Bank loan / supplier credit burden |
| **Compliance** | VAT filing, license status | FTA compliance, trade license validity |

#### Scoring Model

```python
# business_health_agent.py
class BusinessHealthAgent:
    """
    7-dimension business health scoring for UAE retail.
    Each dimension scored 0-100.
    Overall score is weighted average.
    """

    DIMENSION_WEIGHTS = {
        "profitability": 0.20,
        "liquidity": 0.20,
        "credit_health": 0.15,
        "expense_control": 0.15,
        "growth": 0.10,
        "debt_burden": 0.10,
        "compliance": 0.10
    }

    def calculate_health_score(self, user_id: str) -> dict:
        # Calculate each dimension
        scores = {
            "profitability": self.calc_profitability_score(user_id),
            "liquidity": self.calc_liquidity_score(user_id),
            "credit_health": self.calc_credit_health_score(user_id),
            "expense_control": self.calc_expense_control_score(user_id),
            "growth": self.calc_growth_score(user_id),
            "debt_burden": self.calc_debt_burden_score(user_id),
            "compliance": self.calc_compliance_score(user_id)
        }
        
        # Calculate weighted average
        overall = sum(
            scores[dim] * self.DIMENSION_WEIGHTS[dim]
            for dim in scores
        )
        
        # Determine health status
        if overall >= 80:
            status = "EXCELLENT"
            color = "green"
        elif overall >= 60:
            status = "GOOD"
            color = "blue"
        elif overall >= 40:
            status = "FAIR"
            color = "yellow"
        elif overall >= 20:
            status = "AT RISK"
            color = "orange"
        else:
            status = "CRITICAL"
            color = "red"
        
        # Identify risks and recommendations
        risks = self.identify_risks(scores)
        recommendations = self.generate_recommendations(scores)
        
        return {
            "overall_score": round(overall),
            "status": status,
            "color": color,
            "dimension_scores": scores,
            "risks": risks,
            "recommendations": recommendations,
            "trend": self.calculate_trend(user_id)  # vs last month
        }

    def calc_profitability_score(self, user_id: str) -> int:
        """Score based on net profit margin"""
        margin = get_net_profit_margin(user_id)
        
        # UAE retail benchmarks
        if margin >= 15:
            return 100  # Excellent
        elif margin >= 10:
            return 80   # Good
        elif margin >= 5:
            return 60   # Fair
        elif margin >= 0:
            return 40   # Breaking even
        else:
            return max(0, 20 + margin * 2)  # Loss-making

    def calc_liquidity_score(self, user_id: str) -> int:
        """Score based on ability to meet obligations"""
        cash = get_cash_balance(user_id)
        receivables = get_receivables(user_id, days=30)
        payables = get_payables(user_id, days=30)
        monthly_fixed_costs = get_monthly_fixed_costs(user_id)  # Rent, salaries, DEWA
        
        # Quick ratio
        quick_ratio = (cash + receivables) / (payables + monthly_fixed_costs)
        
        if quick_ratio >= 2.0:
            return 100
        elif quick_ratio >= 1.5:
            return 80
        elif quick_ratio >= 1.0:
            return 60
        elif quick_ratio >= 0.5:
            return 40
        else:
            return 20

    def calc_compliance_score(self, user_id: str) -> int:
        """Score based on VAT and license compliance"""
        score = 100
        
        # VAT filing status
        if has_overdue_vat_filing(user_id):
            score -= 40
        
        # Trade license validity
        days_to_license_expiry = get_trade_license_days_remaining(user_id)
        if days_to_license_expiry < 0:
            score -= 50  # Expired!
        elif days_to_license_expiry < 30:
            score -= 20  # Expiring soon
        
        # Visa status (if employees)
        if has_expiring_visas(user_id, days=30):
            score -= 10
        
        return max(0, score)
```

#### Screen: Business Health

```
┌─────────────────────────────────────┐
│  ☰  Business Health Score          │
├─────────────────────────────────────┤
│                                     │
│         ┌─────────────┐             │
│         │             │             │
│         │     72      │             │
│         │    GOOD     │             │
│         │   ↑ +5      │             │
│         └─────────────┘             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    [Radar Chart showing     │   │
│  │     7 dimensions with       │   │
│  │     scores plotted]         │   │
│  └─────────────────────────────┘   │
│                                     │
│  DIMENSION BREAKDOWN               │
│  ─────────────────────────────────  │
│  Profitability    ████████░░  78   │
│  Liquidity        ███████░░░  65   │
│  Credit Health    ██████░░░░  58   │
│  Expense Control  ████████░░  75   │
│  Growth           ████████░░  80   │
│  Debt Burden      █████████░  85   │
│  Compliance       ██████████  100  │
│                                     │
│  ⚠️ ATTENTION NEEDED               │
│  ┌─────────────────────────────┐   │
│  │ 📉 Credit collection slow   │   │
│  │    AED 8,500 overdue 30d+   │   │
│  │    [Send Reminders]         │   │
│  └─────────────────────────────┘   │
│                                     │
│  💡 RECOMMENDATIONS                 │
│  • Follow up on overdue credits    │
│  • DEWA costs up 20% - audit usage │
│  • Consider trade license renewal  │
│                                     │
└─────────────────────────────────────┘
```

---

### 🏛️ IDEA 7: UAE SME Support Programs

**Problem:** Small shop owners miss out on government support and funding programs.

**Solution:** AI matches eligible programs based on business profile.

#### UAE SME Programs Database

| Program | Provider | Benefits | Eligibility |
|---------|----------|----------|-------------|
| **Dubai SME** | Dept. of Economy | Business support, networking, training | Dubai-based SMEs |
| **Khalifa Fund** | Khalifa Fund | Loans up to AED 3M, 0% interest for Emiratis | UAE nationals |
| **Mohammed Bin Rashid Fund** | MBRF | Subsidized loans, training | SMEs in Dubai |
| **SMBF (SME Market)** | Dubai SME | Access to government contracts | Registered SMEs |
| **Hamdan Innovation Incubator** | Dubai SME | Incubation, mentorship | Innovative startups |
| **Emirates Development Bank** | EDB | Loans for strategic sectors | UAE businesses |
| **Ruwad Program** | UAE government | Entrepreneurship support | UAE nationals |
| **ADDED Grants** | Abu Dhabi | Industrial sector support | Abu Dhabi-based |
| **Sharjah Entrepreneurship Center** | SHERAA | Training, funding access | Sharjah-based |
| **Ajman SME** | Ajman DED | License discounts, support | Ajman-based |

#### Free Zone Benefits

| Free Zone | Best For | Benefits |
|-----------|----------|----------|
| **DMCC** | Trading | 100% ownership, tax exemption |
| **JAFZA** | Logistics | No customs duty on re-export |
| **DAFZA** | Services | Fast setup, 0% tax |
| **SAIF Zone** | Trading | Low-cost setup |
| **RAK FTZ** | Manufacturing | Affordable licenses |

#### Agent Design

```python
# knowledge_agent.py (UAE-adapted)
class UAESMEProgramAgent:
    """
    Matches eligible UAE SME support programs based on:
    1. Business location (Dubai, Abu Dhabi, Sharjah, etc.)
    2. Owner nationality (Emirati vs Expat)
    3. Business size (turnover, employees)
    4. Business sector
    5. License type (Mainland vs Free Zone)
    """

    def match_programs(self, user_id: str) -> list:
        profile = get_business_profile(user_id)
        
        eligible_programs = []
        
        # Check each program's eligibility
        for program in get_all_programs():
            if self.check_eligibility(profile, program):
                match_score = self.calculate_match_score(profile, program)
                eligible_programs.append({
                    "program": program,
                    "match_score": match_score,
                    "benefits": program.benefits,
                    "how_to_apply": program.application_process,
                    "documents_needed": program.required_documents
                })
        
        # Sort by match score
        eligible_programs.sort(key=lambda x: x["match_score"], reverse=True)
        
        return eligible_programs

    def check_eligibility(self, profile: dict, program: dict) -> bool:
        """Check if business meets program criteria"""
        
        # Location check
        if program.location_requirement:
            if profile.emirate not in program.eligible_emirates:
                return False
        
        # Nationality check (some programs are Emirati-only)
        if program.emirati_only and not profile.owner_is_emirati:
            return False
        
        # Size check
        if profile.annual_turnover > program.max_turnover:
            return False
        
        if profile.employee_count > program.max_employees:
            return False
        
        # Sector check
        if program.eligible_sectors:
            if profile.business_sector not in program.eligible_sectors:
                return False
        
        return True

    def generate_application_guide(self, program_id: str, profile: dict) -> dict:
        """Generate step-by-step application guide"""
        program = get_program(program_id)
        
        return {
            "program_name": program.name,
            "steps": [
                {
                    "step": 1,
                    "title": "Prepare Documents",
                    "details": program.required_documents,
                    "tips": "Ensure all documents are attested if required"
                },
                {
                    "step": 2,
                    "title": "Online Registration",
                    "details": f"Visit {program.portal_url}",
                    "tips": "Use UAE Pass for faster verification"
                },
                {
                    "step": 3,
                    "title": "Submit Application",
                    "details": "Fill application form with business details",
                    "tips": "Keep trade license number handy"
                },
                {
                    "step": 4,
                    "title": "Follow Up",
                    "details": f"Expected processing time: {program.processing_days} days",
                    "tips": "Check application status regularly"
                }
            ],
            "contact": program.contact_info,
            "deadline": program.application_deadline
        }
```

#### Screen: SME Programs

```
┌─────────────────────────────────────┐
│  ☰  UAE SME Programs    🔍         │
├─────────────────────────────────────┤
│                                     │
│  Your Profile:                      │
│  📍 Dubai | 🏪 Retail | 👤 Expat   │
│  💰 AED 500K turnover | 3 staff    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  🎯 MATCHED PROGRAMS (4)            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏛️ Dubai SME Membership     │   │
│  │    Match: 95%               │   │
│  │                             │   │
│  │    Benefits:                │   │
│  │    • Government contract    │   │
│  │      access                 │   │
│  │    • Networking events      │   │
│  │    • Training programs      │   │
│  │                             │   │
│  │    [ How to Apply → ]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏦 Mohammed Bin Rashid Fund │   │
│  │    Match: 88%               │   │
│  │                             │   │
│  │    Benefits:                │   │
│  │    • Loans up to AED 500K   │   │
│  │    • Subsidized rates       │   │
│  │    • Business mentorship    │   │
│  │                             │   │
│  │    [ How to Apply → ]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏢 Emirates Dev Bank        │   │
│  │    Match: 75%               │   │
│  │                             │   │
│  │    [ View Details → ]       │   │
│  └─────────────────────────────┘   │
│                                     │
│  💡 Tip: Complete your profile     │
│  for better program matching!      │
│                                     │
└─────────────────────────────────────┘
```

---

## 🌍 UAE-Specific Adaptations

### Currency & Localization

| Aspect | India (Kamai) | UAE (StoreBuddy) |
|--------|---------------|------------------|
| Currency | INR (₹) | AED (د.إ) |
| Currency Symbol | ₹ | AED or د.إ |
| Number Format | 1,00,000 (Lakhs) | 100,000 (Standard) |
| Decimal | 2 places | 2 places |
| Languages | Hindi, English | Arabic, English, Hindi, Urdu |
| Calendar | Gregorian | Gregorian + Hijri |
| Weekend | Sunday | Friday-Saturday (changed to Saturday-Sunday 2022) |

### Tax System

| Aspect | India (Kamai) | UAE (StoreBuddy) |
|--------|---------------|------------------|
| Sales Tax | GST (0%, 5%, 12%, 18%, 28%) | VAT (5% standard) |
| Tax ID | GSTIN (15 digits) | TRN (15 digits) |
| Filing | GSTR-1, GSTR-3B | VAT Return (FTA) |
| Frequency | Monthly | Quarterly (most SMEs) |
| Authority | GSTN | FTA (Federal Tax Authority) |
| Portal | gst.gov.in | tax.gov.ae |
| Threshold | ₹20L/40L | AED 375,000 |

### Business Costs

| Cost | India | UAE | Notes |
|------|-------|-----|-------|
| Rent | ₹10K-50K/month | AED 5K-30K/month | UAE much higher per sqft |
| Utilities | ₹2K-10K/month | AED 500-3K/month | DEWA (Dubai), ADDC (Abu Dhabi) |
| Labor | ₹15K-25K/month | AED 2K-5K/month | Plus visa costs in UAE |
| License | ₹5K-20K/year | AED 10K-50K/year | Trade license, renewals |
| Internet | ₹500-2K/month | AED 200-500/month | Etisalat/Du |
| Insurance | ₹5K-20K/year | AED 1K-5K/year | Shop insurance |

### UAE-Specific Costs (Not in India)

| Cost | Typical Amount | Frequency |
|------|----------------|-----------|
| Trade License | AED 10,000 - 50,000 | Annual |
| Visa per employee | AED 5,000 - 8,000 | Every 2-3 years |
| Health Insurance | AED 700 - 2,000/person | Annual |
| Emirates ID | AED 370 | Every 2-3 years |
| Ejari (Rent contract) | AED 220 | Per contract |
| Municipality Fees | 5% of rent | Annual |
| Chamber of Commerce | AED 1,200 | Annual |

### Government Schemes

| India (Kamai) | UAE (StoreBuddy) |
|---------------|------------------|
| MUDRA Loans | Khalifa Fund, MBRF |
| PM-SVANidhi | Dubai SME Support |
| PMEGP | Emirates Development Bank |
| E-Shram | - |
| State subsidies | Emirate-specific programs |

### Terminology Mapping

| English | India Term | UAE Term (Arabic) | UAE Term (English) |
|---------|------------|-------------------|-------------------|
| Credit given | Udhar / Khata | حساب (Hisab) | Account/Credit |
| Customer | Grahak | زبون (Zaboon) | Customer |
| Supplier | Supplier | مورد (Muwared) | Supplier |
| Profit | Munafa | ربح (Ribh) | Profit |
| Loss | Nuksan | خسارة (Khasara) | Loss |
| Invoice | Bill | فاتورة (Fatura) | Invoice |
| Receipt | Raseed | إيصال (Eesal) | Receipt |

---

## 🛠️ Technical Architecture

### Tech Stack (Unchanged from Kamai)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + TypeScript + Vite | UI Framework |
| UI Library | Tailwind CSS + shadcn/ui | Styling |
| Database | Supabase (PostgreSQL) | Data storage |
| Backend | Python FastAPI | API server |
| AI | Azure OpenAI GPT-4 | AI agents |
| Charts | Recharts | Visualizations |

### New Requirements for UAE

| Requirement | Solution |
|-------------|----------|
| Arabic RTL support | Tailwind RTL plugin, i18n |
| Multi-language | react-i18next |
| Hijri calendar | moment-hijri or date-fns-jalali |
| Arabic voice input | Web Speech API with AR locale |
| TRN validation | Custom validation (15 digits, starts with 100) |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Shop Owner)                         │
│               🌐 Browser / 📱 PWA                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          FRONTEND (React + TypeScript)                       │
│  - Multi-language (AR/EN/HI/UR)                             │
│  - RTL support for Arabic                                   │
│  - AED currency formatting                                  │
│  - 15+ Pages | 50+ Components                               │
└────────────┬────────────────────────────┬───────────────────┘
             │                             │
             ▼                             ▼
┌──────────────────────────────┐    ┌──────────────────────────┐
│  SUPABASE (PostgreSQL)        │    │  BACKEND (FastAPI)       │
│  - 25+ tables                 │◄───│  - 8 AI Agents           │
│  - UAE-specific schema        │    │  - Azure OpenAI GPT-4    │
│  - Row-level security         │    │  - VAT calculations      │
└──────────────────────────────┘    └──────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    full_name_arabic VARCHAR(255),
    preferred_language VARCHAR(5) DEFAULT 'en',  -- en, ar, hi, ur
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### business_profiles
```sql
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    business_name VARCHAR(255) NOT NULL,
    business_name_arabic VARCHAR(255),
    trade_license_number VARCHAR(50),
    trade_license_expiry DATE,
    trn VARCHAR(15),  -- Tax Registration Number
    emirate VARCHAR(50),  -- Dubai, Abu Dhabi, Sharjah, etc.
    area VARCHAR(100),
    business_type VARCHAR(50),  -- retail, wholesale, services
    business_sector VARCHAR(100),  -- grocery, electronics, pharmacy
    license_type VARCHAR(50),  -- mainland, free_zone
    free_zone_name VARCHAR(100),
    owner_nationality VARCHAR(50),
    owner_is_emirati BOOLEAN DEFAULT FALSE,
    employee_count INTEGER DEFAULT 1,
    annual_turnover_range VARCHAR(50),
    vat_registered BOOLEAN DEFAULT FALSE,
    vat_filing_frequency VARCHAR(20),  -- monthly, quarterly
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### transactions
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) NOT NULL,  -- sale, purchase, expense
    category VARCHAR(100),
    amount_aed DECIMAL(12,2) NOT NULL,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    vat_category VARCHAR(20) DEFAULT 'standard',  -- standard, zero_rated, exempt
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30),  -- cash, card, bank_transfer, apple_pay
    description TEXT,
    customer_id UUID REFERENCES customers(id),
    supplier_id UUID REFERENCES suppliers(id),
    invoice_number VARCHAR(50),
    is_credit BOOLEAN DEFAULT FALSE,
    credit_due_date DATE,
    receipt_image_url TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### customers (for credit tracking)
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    company_name VARCHAR(255),
    trn VARCHAR(15),  -- For B2B
    address TEXT,
    trust_score INTEGER DEFAULT 50,  -- 0-100
    total_credit_given DECIMAL(12,2) DEFAULT 0,
    total_credit_outstanding DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### credit_transactions
```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    customer_id UUID REFERENCES customers(id),
    transaction_id UUID REFERENCES transactions(id),
    type VARCHAR(20) NOT NULL,  -- credit_given, payment_received
    amount_aed DECIMAL(12,2) NOT NULL,
    due_date DATE,
    payment_date DATE,
    days_overdue INTEGER DEFAULT 0,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### suppliers
```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    trn VARCHAR(15),
    address TEXT,
    payment_terms VARCHAR(50),  -- COD, Net15, Net30
    lead_time_days INTEGER DEFAULT 3,
    rating INTEGER,  -- 1-5 stars
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### vat_returns
```sql
CREATE TABLE vat_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    filing_deadline DATE NOT NULL,
    standard_rated_supplies DECIMAL(12,2) DEFAULT 0,
    zero_rated_supplies DECIMAL(12,2) DEFAULT 0,
    exempt_supplies DECIMAL(12,2) DEFAULT 0,
    output_vat DECIMAL(12,2) DEFAULT 0,
    input_vat_recoverable DECIMAL(12,2) DEFAULT 0,
    net_vat_payable DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, filed, paid
    filed_date DATE,
    payment_reference VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### business_health_scores
```sql
CREATE TABLE business_health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    calculated_date DATE DEFAULT CURRENT_DATE,
    overall_score INTEGER,
    profitability_score INTEGER,
    liquidity_score INTEGER,
    credit_health_score INTEGER,
    expense_control_score INTEGER,
    growth_score INTEGER,
    debt_burden_score INTEGER,
    compliance_score INTEGER,
    risks JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### uae_sme_programs
```sql
CREATE TABLE uae_sme_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_name VARCHAR(255) NOT NULL,
    program_name_arabic VARCHAR(255),
    provider VARCHAR(255),
    description TEXT,
    description_arabic TEXT,
    benefits JSONB,
    eligibility_criteria JSONB,
    eligible_emirates TEXT[],
    emirati_only BOOLEAN DEFAULT FALSE,
    max_turnover DECIMAL(15,2),
    max_employees INTEGER,
    eligible_sectors TEXT[],
    application_url TEXT,
    documents_required JSONB,
    processing_days INTEGER,
    contact_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### reorder_alerts
```sql
CREATE TABLE reorder_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    category VARCHAR(100) NOT NULL,
    product_name VARCHAR(255),
    urgency VARCHAR(20),  -- HIGH, MEDIUM, LOW
    estimated_days_remaining INTEGER,
    suggested_quantity DECIMAL(10,2),
    estimated_cost DECIMAL(12,2),
    supplier_id UUID REFERENCES suppliers(id),
    seasonal_note TEXT,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 AI Agents Design

### Agent Summary

| # | Agent | Purpose | Kamai Mapping |
|---|-------|---------|---------------|
| 1 | **Sales Pattern Agent** | Analyze sales patterns, peak hours, trends | Pattern Agent |
| 2 | **Profit Analysis Agent** | Calculate true profit, identify leaks | Budget Agent |
| 3 | **Credit Risk Agent** | Customer risk scoring, collection priority | NEW |
| 4 | **Reorder Agent** | Predict restock needs, seasonal adjustments | Cashflow Agent |
| 5 | **VAT Compliance Agent** | VAT calculations, return summaries | Tax Agent |
| 6 | **Business Health Agent** | 7-dimension health scoring | Risk Agent |
| 7 | **UAE Programs Agent** | Match eligible SME programs | Knowledge Agent |
| 8 | **Recommendation Agent** | General business recommendations | Recommendation Agent |

### Agent Configuration (agent_config.yaml)

```yaml
agents:
  sales_pattern_agent:
    name: "Sales Pattern Analyst"
    description: "Analyzes sales patterns for UAE retail businesses"
    system_prompt: |
      You are a retail sales analyst specializing in UAE market.
      Consider:
      - Seasonal patterns (Ramadan +40%, Summer -30%, Eid peaks)
      - Weekly patterns (Friday-Saturday weekend impact)
      - Payment method trends (cash vs digital)
      - Category performance
      Provide insights in English and Arabic summary.
    
  profit_analysis_agent:
    name: "Profit Analyst"
    description: "Calculates true profit after all UAE business costs"
    system_prompt: |
      You are a financial analyst for UAE small businesses.
      Calculate profit considering:
      - UAE-specific costs: rent, DEWA, visa, trade license
      - VAT implications (5% standard rate)
      - Payment processing fees (2-3% for cards)
      - Hidden costs and profit leaks
      Provide AED amounts and percentages.
    
  credit_risk_agent:
    name: "Credit Risk Analyst"
    description: "Scores customer creditworthiness and collection priority"
    system_prompt: |
      You are a credit risk analyst for UAE retail.
      Evaluate customers based on:
      - Payment history (on-time vs late)
      - Bounced cheques (serious in UAE)
      - Credit amount vs relationship duration
      - Business vs individual customers
      Recommend credit limits and collection priority.
    
  vat_compliance_agent:
    name: "VAT Compliance Assistant"
    description: "UAE FTA VAT compliance and filing assistance"
    system_prompt: |
      You are a VAT compliance expert for UAE businesses.
      Help with:
      - 5% VAT calculations (standard rate)
      - Zero-rated and exempt supplies identification
      - Input VAT credit calculations
      - VAT return preparation (FTA format)
      - Filing deadline reminders (28th of following month)
      Always mention TRN requirements for B2B.
    
  business_health_agent:
    name: "Business Health Analyst"
    description: "7-dimension business health scoring for UAE retail"
    system_prompt: |
      You are a business health analyst for UAE SMEs.
      Score these dimensions (0-100 each):
      1. Profitability (net margin vs UAE retail benchmark 8-15%)
      2. Liquidity (can cover rent, DEWA, salaries?)
      3. Credit Health (receivables collection)
      4. Expense Control (operating ratio)
      5. Growth (revenue trend)
      6. Debt Burden (loan EMI ratio)
      7. Compliance (VAT, license validity)
      Provide overall score and actionable recommendations.
    
  uae_programs_agent:
    name: "UAE SME Programs Matcher"
    description: "Matches eligible UAE government support programs"
    system_prompt: |
      You are an expert on UAE SME support programs.
      Match programs based on:
      - Location (Dubai, Abu Dhabi, Sharjah, other emirates)
      - Owner nationality (Emirati-only vs all)
      - Business size (turnover, employees)
      - Sector (retail, F&B, services, manufacturing)
      - License type (mainland vs free zone)
      
      Key programs to consider:
      - Dubai SME (all Dubai businesses)
      - Khalifa Fund (Emiratis only)
      - Mohammed Bin Rashid Fund (Dubai)
      - Emirates Development Bank (UAE-wide)
      - Emirate-specific programs
      
      Provide application steps and required documents.
```

---

## 🎨 UI/UX Design

### Page Mapping

| Kamai Page | StoreBuddy Page | Changes |
|------------|-----------------|---------|
| /dashboard | /dashboard | Sales focus, AED currency |
| /transactions | /transactions | Sale/Purchase/Expense types |
| /stats | /analytics | Sales trends, profit margins |
| /budget | /targets | Revenue and profit targets |
| /tax | /vat | VAT compliance (not income tax) |
| /risk | /health | Business health score |
| /benefits | /programs | UAE SME programs |
| /tips | /insights | Business tips |
| NEW | /credit | Credit management (Hisab) |
| NEW | /suppliers | Supplier management |
| NEW | /reorder | Reorder alerts |

### Navigation Structure

```
Bottom Navigation:
┌─────────────────────────────────────┐
│ 🏠 Home | 💰 Sales | 📊 Analytics  │
│ 💳 Credit | 👤 Profile              │
└─────────────────────────────────────┘

Side Menu:
├── Dashboard
├── Sales & Expenses
│   ├── Record Sale
│   ├── Record Purchase
│   └── Record Expense
├── Credit Book (حساب)
│   ├── Customers
│   └── Outstanding
├── Analytics
│   ├── Profit Analysis
│   └── Sales Trends
├── VAT Compliance
│   ├── VAT Summary
│   └── VAT Returns
├── Business Health
├── Reorder Alerts
├── SME Programs
├── Settings
│   ├── Business Profile
│   ├── Language
│   └── Notifications
└── Help
```

### Color Scheme

```css
/* UAE-inspired colors */
:root {
  --primary: #00732F;      /* UAE flag green */
  --secondary: #C8102E;    /* UAE flag red */
  --accent: #000000;       /* UAE flag black */
  --background: #FFFFFF;   /* UAE flag white */
  
  /* Status colors */
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;
  
  /* Neutral */
  --gray-50: #F9FAFB;
  --gray-900: #111827;
}
```

### RTL Support

```tsx
// App.tsx
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
      {/* App content */}
    </div>
  );
}
```

---

## 📅 Development Roadmap

### Phase 1: MVP (6 Weeks)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1-2 | Core Tracking | Sales/expense entry, AED support, basic dashboard |
| 2-3 | Credit System | Customer management, credit tracking, reminders |
| 3-4 | Profit + Health | Profit agent, health score, analytics |
| 4-5 | VAT + Reorder | VAT compliance, reorder alerts |
| 5-6 | Programs + Polish | UAE SME programs, testing, launch prep |

### Phase 2: Enhancements (4 Weeks)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 7-8 | Supplier Management | Supplier tracking, price comparison |
| 9-10 | Multi-language | Arabic UI, Hindi/Urdu support |

### Phase 3: Advanced (4 Weeks)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 11-12 | Multi-Store | Multiple location support |
| 13-14 | WhatsApp Bot | Chat-based entries and queries |

---

## 📜 Compliance & Regulations

### UAE Business Compliance

| Requirement | Details | StoreBuddy Support |
|-------------|---------|-------------------|
| **VAT Registration** | Mandatory if turnover > AED 375K | Track turnover, alert on threshold |
| **VAT Filing** | Quarterly/Monthly returns | Auto-generate VAT return data |
| **Record Keeping** | 5 years minimum | Cloud storage, export feature |
| **Tax Invoice** | Must include TRN, VAT amount | Invoice generation |
| **Trade License** | Annual renewal | Expiry reminders |
| **Visa Compliance** | Employee visas, WPS | Track visa expiry |

### Data Privacy (UAE)

- Comply with UAE Federal Decree-Law No. 45/2021 (Data Protection)
- Store data in UAE region (Supabase UAE/Middle East region)
- Provide data export/deletion features
- Clear privacy policy in Arabic and English

### Financial Regulations

- Not a financial institution - no banking license needed
- Educational/tracking tool only
- No financial advice (only insights)
- Partner with licensed entities for loans/insurance

---

## 📞 Contact & Support

### Support Channels

| Channel | Details |
|---------|---------|
| WhatsApp | +971-XXX-XXXX |
| Email | support@storebuddy.ae |
| In-app | Help center + chat |

### Languages Supported

- 🇬🇧 English (default)
- 🇦🇪 Arabic (العربية)
- 🇮🇳 Hindi (हिंदी)
- 🇵🇰 Urdu (اردو)
- 🇵🇭 Tagalog (future)
- 🇧🇩 Bengali (future)

---

## 📝 Summary

**StoreBuddy UAE** is a UAE-localized version of the Kamai platform, adapted for small retail shop owners. Key adaptations include:

1. **Currency**: AED with proper formatting
2. **Tax**: VAT (5%) instead of GST
3. **Language**: Arabic + English + Hindi/Urdu
4. **Regulations**: FTA compliance, trade license tracking
5. **Programs**: UAE SME support (Dubai SME, Khalifa Fund, MBRF)
6. **Costs**: UAE-specific expenses (rent, DEWA, visa, license)
7. **Culture**: Ramadan/Eid seasonality, weekend adjustments

**Reuse from Kamai**: 70-80% of codebase
**New Development**: ~20-30% UAE-specific features

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Product: StoreBuddy UAE*
