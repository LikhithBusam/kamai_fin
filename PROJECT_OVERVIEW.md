# 🏦 KAMAI - Personal Finance App for Gig Workers

## What is Kamai?

Kamai is a **personal finance management app** designed specifically for **gig economy workers** in India (delivery partners, cab drivers, freelancers, street vendors, etc.). It helps track income/expenses, provides AI-powered financial advice, and connects users with government schemes.

---

## 🔧 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript + Vite |
| UI Library | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Backend | Python FastAPI (for AI agents) |
| Charts | Recharts |

---

## 📱 Features & How They Work

### 1. **Dashboard** (`/dashboard`)
- Shows **Today's Income**, **Today's Expenses**, **Current Balance**
- Displays **Recent Transactions** (last 5)
- Quick access to add transactions (Manual, Voice, Image)
- Import transactions from **SMS** or **PDF bank statements**

**Data needed:** Works immediately with 0 transactions

---

### 2. **Transactions** (`/transactions`)
- View all income and expense records
- Filter by date, type (income/expense), category
- Edit or delete transactions
- Shows Today's summary and grouped by date

**Data needed:** Works immediately

---

### 3. **Statistics** (`/stats`)
- **Pie chart:** Expense breakdown by category
- **Bar chart:** Income vs Expense (last 7 days)
- **Line chart:** Income trend over time
- Emergency fund tracker

**Data needed:** 📊 **Minimum 7 days** of transactions for meaningful charts

---

### 4. **Budget** (`/budget`)
- AI-generated budget based on your spending patterns
- Category-wise spending limits
- Tracks budget vs actual spending
- Feast/Famine mode detection (for irregular income)

**Data needed:** 📊 **Minimum 30 days** of transactions for accurate budgeting

---

### 5. **Savings & Goals** (`/savings`)
- Create savings goals (Emergency Fund, Vehicle, etc.)
- Track progress toward each goal
- AI recommendations for monthly contribution
- Investment suggestions (PPF, FD, etc.)

**Data needed:** 📊 **Minimum 30 days** for personalized recommendations

---

### 6. **Government Schemes** (`/benefits`)
- Lists eligible government schemes based on:
  - Occupation (delivery partner, vendor, etc.)
  - Income level
  - Location (state)
- Shows application process and required documents
- Tracks application status

**Data needed:** Complete profile information (occupation, income, state)

---

### 7. **Tax** (`/tax`)
- Calculates estimated tax liability
- Identifies tax-saving opportunities
- Tracks deductions (80C, 80D, etc.)
- For gig workers: presumptive taxation under Section 44AD

**Data needed:** 📊 **1 full financial year** of transactions for accurate tax calculation

---

### 8. **Risk Assessment** (`/risk`)
- Analyzes financial health score (0-100)
- Identifies risk factors:
  - Low emergency fund
  - High debt-to-income ratio
  - Irregular income patterns
- Provides actionable recommendations

**Data needed:** 📊 **Minimum 60 days** for pattern detection

---

### 9. **Tips & Insights** (`/tips`)
- Occupation-specific financial tips
- Personalized advice based on spending patterns
- Seasonal earning opportunities
- Cost-saving suggestions

**Data needed:** Works with profile + 📊 **14+ days** for personalized tips

---

### 10. **Profile** (`/profile`)
- User information (name, phone, occupation, city)
- Income range settings
- Preferred language
- Account settings

---

## 📊 Data Requirements Summary

| Feature | Minimum Data Needed |
|---------|---------------------|
| Dashboard | 0 days (works immediately) |
| Transactions | 0 days (works immediately) |
| Statistics Charts | 7 days |
| Tips & Insights | 14 days |
| Budget Planning | 30 days |
| Savings Goals | 30 days |
| Risk Assessment | 60 days |
| Tax Calculation | 1 financial year (April-March) |

---

## 🔐 How Authentication Works

1. **Signup:** Enter phone number → Create account → Stored in Supabase `users` table
2. **Login:** Enter phone number + password → Validates against database → Stores `user_id` in browser localStorage
3. **Session:** All data queries filter by `user_id` from localStorage
4. **Logout:** Clears localStorage → Redirects to login page

---

## 💾 Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts and profiles |
| `transactions` | All income/expense records |
| `budgets` | Monthly budget plans |
| `recommendations` | AI-generated suggestions |
| `savings_goals` | User savings targets |
| `financial_goals` | Long-term financial goals |
| `risk_assessments` | Financial health analysis |
| `tax_records` | Tax calculations |
| `government_schemes` | Available schemes |
| `user_schemes` | Matched schemes for users |
| `bills` | Recurring bill reminders |

---

## 🚀 How to Add Transactions

### Method 1: Manual Entry
1. Go to Dashboard
2. Select Income/Expense tab
3. Enter amount, category, description
4. Click "Add Transaction"

### Method 2: SMS Import
1. Click "Paste SMS" on Dashboard
2. Paste bank SMS (e.g., "Rs.500 debited from A/c...")
3. App auto-extracts amount, type, date
4. Confirm and import

### Method 3: PDF Statement Import
1. Click "Upload" on Dashboard
2. Select PDF bank statement
3. App parses transactions
4. Select which ones to import

### Method 4: Voice Input
1. Click microphone icon
2. Speak: "Spent 500 rupees on food"
3. App extracts details
4. Confirm and save

---

## 🎯 For Best Results

1. **Add transactions daily** for accurate tracking
2. **Complete your profile** (occupation, income range, city) for scheme matching
3. **Use for 30+ days** to unlock all AI features
4. **Categorize correctly** for better budget suggestions

---

## 📞 Your Account Info

- **Phone:** 7993599818
- **User ID:** `1d1ea389-e073-4aa9-8d17-135fc425080b`
- **Database:** Supabase (ppkwqebglrkznjsrwccz)

---

## 🛠️ Running the App

```bash
# Frontend (React)
cd frontend
npm install
npm run dev
# Opens at http://localhost:8080

# Backend (Python - optional, for AI features)
cd backend
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8000
```

---

*Built for India's gig workers 🇮🇳*
