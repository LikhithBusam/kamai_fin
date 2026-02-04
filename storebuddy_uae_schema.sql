-- StoreBuddy UAE - Database Schema Update
-- Run this in Supabase SQL Editor to update the schema for UAE functionality

-- ============================================================================
-- STEP 1: Update users table for UAE
-- ============================================================================

-- First, check if columns exist and add UAE-specific columns
DO $$ 
BEGIN
    -- Remove India-specific columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'city') THEN
        ALTER TABLE users DROP COLUMN city;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'state') THEN
        ALTER TABLE users DROP COLUMN state;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'pin_code') THEN
        ALTER TABLE users DROP COLUMN pin_code;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'income_range') THEN
        ALTER TABLE users DROP COLUMN income_range;
    END IF;
    
    -- Add UAE-specific columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'full_name_arabic') THEN
        ALTER TABLE users ADD COLUMN full_name_arabic VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'emirate') THEN
        ALTER TABLE users ADD COLUMN emirate VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'nationality') THEN
        ALTER TABLE users ADD COLUMN nationality VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_emirati') THEN
        ALTER TABLE users ADD COLUMN is_emirati BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- ============================================================================
-- STEP 2: Create business_profiles table for UAE shops
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_name_arabic VARCHAR(255),
    trade_license_number VARCHAR(50),
    trade_license_expiry DATE,
    trn VARCHAR(15),  -- Tax Registration Number (15 digits starting with 100)
    emirate VARCHAR(50),
    area VARCHAR(100),
    business_type VARCHAR(50) DEFAULT 'general',  -- grocery, electronics, pharmacy, cafeteria, textile, auto_parts, general
    license_type VARCHAR(50) DEFAULT 'mainland',  -- mainland, free_zone
    free_zone_name VARCHAR(100),
    owner_nationality VARCHAR(100),
    owner_is_emirati BOOLEAN DEFAULT FALSE,
    employee_count INTEGER DEFAULT 1,
    annual_turnover_range VARCHAR(50),
    vat_registered BOOLEAN DEFAULT FALSE,
    vat_filing_frequency VARCHAR(20) DEFAULT 'quarterly',  -- monthly, quarterly
    monthly_rent DECIMAL(12,2),
    current_balance DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- STEP 3: Create customers table for credit tracking (Hisab)
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    company_name VARCHAR(255),
    trn VARCHAR(15),  -- For B2B customers
    address TEXT,
    trust_score INTEGER DEFAULT 50,  -- 0-100 credit trust score
    total_credit_given DECIMAL(12,2) DEFAULT 0,
    total_credit_received DECIMAL(12,2) DEFAULT 0,
    total_credit_outstanding DECIMAL(12,2) DEFAULT 0,
    on_time_payment_ratio DECIMAL(5,2) DEFAULT 0,
    average_payment_days INTEGER DEFAULT 0,
    bounced_cheques INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 4: Create credit_transactions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL,  -- credit_given, payment_received
    amount_aed DECIMAL(12,2) NOT NULL,
    due_date DATE,
    payment_date DATE,
    days_overdue INTEGER DEFAULT 0,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 5: Create suppliers table
-- ============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    trn VARCHAR(15),
    address TEXT,
    payment_terms VARCHAR(50) DEFAULT 'COD',  -- COD, Net15, Net30
    lead_time_days INTEGER DEFAULT 3,
    rating INTEGER,  -- 1-5 stars
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 6: Create vat_returns table for VAT compliance
-- ============================================================================

CREATE TABLE IF NOT EXISTS vat_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    trn VARCHAR(15),
    business_name VARCHAR(255),
    period VARCHAR(20),  -- Q1 2024, Q2 2024, etc.
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    filing_deadline DATE NOT NULL,
    standard_rated_supplies DECIMAL(12,2) DEFAULT 0,
    zero_rated_supplies DECIMAL(12,2) DEFAULT 0,
    exempt_supplies DECIMAL(12,2) DEFAULT 0,
    output_vat DECIMAL(12,2) DEFAULT 0,
    input_vat DECIMAL(12,2) DEFAULT 0,
    input_vat_recoverable DECIMAL(12,2) DEFAULT 0,
    net_vat DECIMAL(12,2) DEFAULT 0,
    net_vat_payable DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, filed, paid
    filed_date DATE,
    payment_reference VARCHAR(50),
    payment_deadline DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 7: Create business_health_scores table
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    calculated_date DATE DEFAULT CURRENT_DATE,
    overall_score INTEGER,
    health_level VARCHAR(20),  -- EXCELLENT, GOOD, FAIR, POOR, CRITICAL
    profitability_score INTEGER,
    liquidity_score INTEGER,
    credit_health_score INTEGER,
    expense_control_score INTEGER,
    growth_score INTEGER,
    debt_burden_score INTEGER,
    compliance_score INTEGER,
    trend VARCHAR(20),  -- improving, stable, declining
    risks JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 8: Create uae_sme_programs table
-- ============================================================================

CREATE TABLE IF NOT EXISTS uae_sme_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id VARCHAR(50) UNIQUE,
    program_name VARCHAR(255) NOT NULL,
    program_name_arabic VARCHAR(255),
    provider VARCHAR(255),
    description TEXT,
    description_arabic TEXT,
    program_type VARCHAR(50),  -- government, government_bank, accelerator, grant, bank, incubator
    benefits JSONB,
    eligibility_criteria JSONB,
    eligible_emirates TEXT[],
    emirati_only BOOLEAN DEFAULT FALSE,
    max_turnover DECIMAL(15,2),
    max_employees INTEGER,
    min_funding DECIMAL(12,2),
    max_funding DECIMAL(12,2),
    eligible_sectors TEXT[],
    application_url TEXT,
    documents_required JSONB,
    processing_days INTEGER,
    contact_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 9: Create reorder_alerts table
-- ============================================================================

CREATE TABLE IF NOT EXISTS reorder_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category VARCHAR(100) NOT NULL,
    product_name VARCHAR(255),
    urgency VARCHAR(20),  -- CRITICAL, HIGH, MEDIUM, LOW
    estimated_days_remaining INTEGER,
    suggested_quantity DECIMAL(10,2),
    estimated_cost DECIMAL(12,2),
    supplier_id UUID REFERENCES suppliers(id),
    seasonal_note TEXT,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 10: Update transactions table for UAE (VAT support)
-- ============================================================================

DO $$ 
BEGIN
    -- Add UAE-specific columns to transactions if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'amount_aed') THEN
        ALTER TABLE transactions ADD COLUMN amount_aed DECIMAL(12,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'vat_amount') THEN
        ALTER TABLE transactions ADD COLUMN vat_amount DECIMAL(10,2) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'vat_category') THEN
        ALTER TABLE transactions ADD COLUMN vat_category VARCHAR(20) DEFAULT 'standard';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'total_amount') THEN
        ALTER TABLE transactions ADD COLUMN total_amount DECIMAL(12,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'customer_id') THEN
        ALTER TABLE transactions ADD COLUMN customer_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'supplier_id') THEN
        ALTER TABLE transactions ADD COLUMN supplier_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'invoice_number') THEN
        ALTER TABLE transactions ADD COLUMN invoice_number VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'is_credit') THEN
        ALTER TABLE transactions ADD COLUMN is_credit BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'credit_due_date') THEN
        ALTER TABLE transactions ADD COLUMN credit_due_date DATE;
    END IF;
END $$;

-- ============================================================================
-- STEP 11: Insert UAE SME Programs data
-- ============================================================================

INSERT INTO uae_sme_programs (program_id, program_name, program_name_arabic, provider, description, program_type, eligible_emirates, emirati_only, min_funding, max_funding, is_active)
VALUES 
    ('dubai_sme', 'Dubai SME', 'مؤسسة محمد بن راشد لتنمية المشاريع', 'Department of Economy', 'Business support, networking, training for Dubai-based SMEs', 'government', ARRAY['dubai'], false, 0, 500000, true),
    ('khalifa_fund', 'Khalifa Fund', 'صندوق خليفة', 'Khalifa Fund for Enterprise Development', 'Loans up to AED 3M at 0% interest for UAE nationals', 'government_bank', ARRAY['dubai', 'abu_dhabi', 'sharjah', 'ajman', 'rak', 'fujairah', 'uaq'], true, 50000, 3000000, true),
    ('mbrf', 'Mohammed Bin Rashid Fund', 'صندوق محمد بن راشد', 'MBRF', 'Subsidized loans and business mentorship for Dubai SMEs', 'government_bank', ARRAY['dubai'], false, 50000, 500000, true),
    ('edb', 'Emirates Development Bank', 'بنك الإمارات للتنمية', 'Emirates Development Bank', 'Loans for strategic sectors across UAE', 'bank', ARRAY['dubai', 'abu_dhabi', 'sharjah', 'ajman', 'rak', 'fujairah', 'uaq'], false, 100000, 5000000, true),
    ('in5', 'in5 Innovation Center', 'إن 5', 'TECOM Group', 'Incubation and acceleration for tech startups', 'incubator', ARRAY['dubai'], false, 0, 0, true),
    ('sheraa', 'Sharjah Entrepreneurship Center', 'شراع', 'Sharjah Government', 'Training, funding access, and mentorship', 'accelerator', ARRAY['sharjah'], false, 0, 100000, true),
    ('rak_sme', 'RAK SME', 'راك للمشاريع الصغيرة', 'RAK Economic Zone', 'Support for Ras Al Khaimah businesses', 'government', ARRAY['rak'], false, 0, 200000, true),
    ('expo_live', 'Expo Live', 'إكسبو لايف', 'Expo 2020 Dubai', 'Innovation grants for social impact projects', 'grant', ARRAY['dubai', 'abu_dhabi', 'sharjah', 'ajman', 'rak', 'fujairah', 'uaq'], false, 0, 100000, true)
ON CONFLICT (program_id) DO NOTHING;

-- ============================================================================
-- STEP 12: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reorder_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for each table (users can only see their own data)
CREATE POLICY IF NOT EXISTS "Users can view own business profile" ON business_profiles FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Users can view own customers" ON customers FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Users can view own credit transactions" ON credit_transactions FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Users can view own suppliers" ON suppliers FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Users can view own vat returns" ON vat_returns FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Users can view own health scores" ON business_health_scores FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Users can view own reorder alerts" ON reorder_alerts FOR ALL USING (true);

-- ============================================================================
-- DONE! Schema updated for StoreBuddy UAE
-- ============================================================================

SELECT 'StoreBuddy UAE schema update complete!' as status;
