# StoreBuddy UAE - Setup Instructions

## 🚨 IMPORTANT: Database Schema Update Required

The signup error `"Could not find the 'city' column of 'users'"` indicates your Supabase database schema needs to be updated for UAE functionality.

## Step 1: Run SQL Schema Update in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Copy and paste the contents of `storebuddy_uae_schema.sql` (in this folder)
5. Click **Run** to execute

This will:
- Remove India-specific columns (city, state, pin_code, income_range)
- Add UAE-specific columns (emirate, nationality, is_emirati, full_name_arabic)
- Create new tables: business_profiles, customers, suppliers, vat_returns, etc.
- Insert 8 UAE SME programs data

## Step 2: Alternative Quick Fix (if you don't want full schema update)

If you just want to fix the signup error quickly, run this minimal SQL:

```sql
-- Quick fix: Remove city column and add emirate
ALTER TABLE users DROP COLUMN IF EXISTS city;
ALTER TABLE users DROP COLUMN IF EXISTS state;
ALTER TABLE users DROP COLUMN IF EXISTS pin_code;
ALTER TABLE users DROP COLUMN IF EXISTS income_range;

-- Add UAE columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS emirate VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_emirati BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name_arabic VARCHAR(255);
```

## What Changed in the Frontend

### 1. Signup Page (`frontend/src/pages/Signup.tsx`)
- **Step 2:** Now asks for Full Name, UAE Phone Number (+971), and Nationality
- **Step 3:** Now asks for Business Name, Emirate (7 emirates), Business Type, and TRN (optional)
- Removed: City, State, Occupation (India-specific fields)

### 2. Database Service (`frontend/src/services/database.ts`)
- Updated User interface for UAE schema
- Added BusinessProfile interface
- Signup now creates both user record and business_profiles record
- Phone validation updated for UAE numbers (9-12 digits)

### 3. New Database Tables (from storebuddy_uae_schema.sql)
- `business_profiles` - Store business details (TRN, license, etc.)
- `customers` - For credit tracking (Hisab)
- `suppliers` - Supplier management
- `credit_transactions` - Credit given/received tracking
- `vat_returns` - VAT compliance records
- `business_health_scores` - 7-dimension health scores
- `uae_sme_programs` - 8 pre-loaded UAE SME programs
- `reorder_alerts` - Inventory reorder notifications

## UAE Features Available

After signup, users can access these features from the dashboard:

1. **Credit Book** (`/credit-book`) - Track customer credit (Hisab/حساب)
2. **VAT Management** (`/vat`) - 5% VAT calculations and filing
3. **Business Health** (`/business-health`) - 7-dimension health score
4. **UAE Programs** (`/uae-programs`) - 8 SME support programs

## Emirates Supported
- Dubai
- Abu Dhabi
- Sharjah
- Ajman
- Ras Al Khaimah (RAK)
- Fujairah
- Umm Al Quwain (UAQ)

## Business Types Supported
- Grocery / Baqala
- Electronics
- Pharmacy
- Cafeteria / Restaurant
- Textile / Garments
- Auto Parts
- General Trading

## Currency & Tax
- Currency: AED (د.إ)
- VAT Rate: 5% standard
- TRN Format: 15 digits starting with 100

## Languages
- English (default)
- Arabic (RTL support)
- Hindi
- Urdu

---

After running the SQL schema update, the signup should work correctly!
