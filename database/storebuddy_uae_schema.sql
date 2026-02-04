-- =====================================================
-- StoreBuddy UAE - Complete Database Schema
-- AI Financial Companion for Shop Owners in UAE
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (Clean Start)
-- =====================================================
DROP TABLE IF EXISTS daily_summaries CASCADE;
DROP TABLE IF EXISTS agent_logs CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS reorder_alerts CASCADE;
DROP TABLE IF EXISTS user_matched_programs CASCADE;
DROP TABLE IF EXISTS business_health_scores CASCADE;
DROP TABLE IF EXISTS vat_returns CASCADE;
DROP TABLE IF EXISTS credit_transactions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS business_profiles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS uae_sme_programs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    full_name_arabic VARCHAR(255),
    preferred_language VARCHAR(5) DEFAULT 'en', -- en, ar, hi, ur
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. UAE SME PROGRAMS (Reference Table)
-- =====================================================
CREATE TABLE uae_sme_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_name VARCHAR(255) NOT NULL,
    program_name_arabic VARCHAR(255),
    provider VARCHAR(255),
    provider_arabic VARCHAR(255),
    description TEXT,
    description_arabic TEXT,
    program_type VARCHAR(50), -- funding, grant, incubation, training
    benefits JSONB,
    max_funding_amount DECIMAL(15,2),
    interest_rate DECIMAL(5,2),
    eligible_emirates TEXT[], -- ['dubai', 'abu_dhabi', 'sharjah', etc.]
    emirati_only BOOLEAN DEFAULT FALSE,
    min_turnover DECIMAL(15,2),
    max_turnover DECIMAL(15,2),
    min_employees INTEGER,
    max_employees INTEGER,
    eligible_sectors TEXT[],
    eligible_license_types TEXT[], -- ['mainland', 'free_zone']
    min_years_in_business INTEGER,
    application_url TEXT,
    portal_name VARCHAR(100),
    documents_required JSONB,
    processing_days INTEGER,
    application_deadline DATE,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    contact_address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CATEGORIES
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_arabic VARCHAR(100),
    category_type VARCHAR(20) NOT NULL, -- income, expense, inventory
    icon VARCHAR(50),
    color VARCHAR(20),
    vat_category VARCHAR(20) DEFAULT 'standard', -- standard, zero_rated, exempt
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. BUSINESS PROFILES
-- =====================================================
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_name_arabic VARCHAR(255),
    trade_license_number VARCHAR(50),
    trade_license_expiry DATE,
    trn VARCHAR(15), -- Tax Registration Number (15 digits)
    emirate VARCHAR(50) NOT NULL, -- dubai, abu_dhabi, sharjah, ajman, rak, fujairah, uaq
    area VARCHAR(100),
    full_address TEXT,
    business_type VARCHAR(50) DEFAULT 'retail', -- retail, wholesale, services, f_and_b
    business_sector VARCHAR(100), -- grocery, electronics, pharmacy, cafeteria, textile, auto_parts
    license_type VARCHAR(50) DEFAULT 'mainland', -- mainland, free_zone
    free_zone_name VARCHAR(100),
    owner_nationality VARCHAR(50),
    owner_is_emirati BOOLEAN DEFAULT FALSE,
    employee_count INTEGER DEFAULT 1,
    annual_turnover DECIMAL(15,2),
    annual_turnover_range VARCHAR(50), -- 'below_375k', '375k_to_1m', '1m_to_5m', 'above_5m'
    vat_registered BOOLEAN DEFAULT FALSE,
    vat_registration_date DATE,
    vat_filing_frequency VARCHAR(20) DEFAULT 'quarterly', -- monthly, quarterly
    opening_cash DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CUSTOMERS (for Credit/Hisab tracking)
-- =====================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    company_name VARCHAR(255),
    company_name_arabic VARCHAR(255),
    trn VARCHAR(15), -- For B2B customers
    address TEXT,
    customer_type VARCHAR(20) DEFAULT 'individual', -- individual, business
    trust_score INTEGER DEFAULT 50, -- 0-100
    credit_limit DECIMAL(12,2) DEFAULT 0,
    total_credit_given DECIMAL(12,2) DEFAULT 0,
    total_credit_outstanding DECIMAL(12,2) DEFAULT 0,
    total_payments_received DECIMAL(12,2) DEFAULT 0,
    average_payment_days INTEGER DEFAULT 0,
    on_time_payment_ratio DECIMAL(5,2) DEFAULT 0,
    bounced_cheques INTEGER DEFAULT 0,
    last_transaction_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. SUPPLIERS
-- =====================================================
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    company_name VARCHAR(255),
    trn VARCHAR(15),
    address TEXT,
    payment_terms VARCHAR(50) DEFAULT 'COD', -- COD, Net15, Net30, Net60
    lead_time_days INTEGER DEFAULT 3,
    rating INTEGER, -- 1-5 stars
    total_purchases DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TRANSACTIONS (Sales, Purchases, Expenses)
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- sale, purchase, expense
    category_id UUID REFERENCES categories(id),
    category_name VARCHAR(100),
    amount_aed DECIMAL(12,2) NOT NULL,
    vat_rate DECIMAL(5,2) DEFAULT 5.00,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    vat_category VARCHAR(20) DEFAULT 'standard', -- standard, zero_rated, exempt
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'cash', -- cash, card, bank_transfer, apple_pay, samsung_pay, cheque
    description TEXT,
    notes TEXT,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255),
    supplier_id UUID REFERENCES suppliers(id),
    supplier_name VARCHAR(255),
    invoice_number VARCHAR(50),
    reference_number VARCHAR(50),
    is_credit BOOLEAN DEFAULT FALSE,
    credit_due_date DATE,
    credit_status VARCHAR(20), -- pending, partial, paid, overdue
    receipt_image_url TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    transaction_time TIME DEFAULT CURRENT_TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. CREDIT TRANSACTIONS (Hisab/حساب)
-- =====================================================
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id),
    credit_type VARCHAR(20) NOT NULL, -- credit_given, payment_received
    amount_aed DECIMAL(12,2) NOT NULL,
    running_balance DECIMAL(12,2) NOT NULL,
    due_date DATE,
    payment_date DATE,
    payment_method VARCHAR(30),
    days_overdue INTEGER DEFAULT 0,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_date TIMESTAMP WITH TIME ZONE,
    reminder_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. VAT RETURNS
-- =====================================================
CREATE TABLE vat_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    filing_deadline DATE NOT NULL,
    -- Output VAT (Sales)
    standard_rated_supplies DECIMAL(15,2) DEFAULT 0,
    standard_rated_vat DECIMAL(12,2) DEFAULT 0,
    zero_rated_supplies DECIMAL(15,2) DEFAULT 0,
    exempt_supplies DECIMAL(15,2) DEFAULT 0,
    total_supplies DECIMAL(15,2) DEFAULT 0,
    total_output_vat DECIMAL(12,2) DEFAULT 0,
    -- Input VAT (Purchases)
    standard_rated_expenses DECIMAL(15,2) DEFAULT 0,
    input_vat_recoverable DECIMAL(12,2) DEFAULT 0,
    input_vat_non_recoverable DECIMAL(12,2) DEFAULT 0,
    -- Net Position
    net_vat_payable DECIMAL(12,2) DEFAULT 0,
    net_vat_refundable DECIMAL(12,2) DEFAULT 0,
    -- Filing Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, draft, filed, paid
    filed_date DATE,
    payment_reference VARCHAR(50),
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. BUSINESS HEALTH SCORES
-- =====================================================
CREATE TABLE business_health_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    calculated_date DATE DEFAULT CURRENT_DATE,
    overall_score INTEGER, -- 0-100
    status VARCHAR(20), -- EXCELLENT, GOOD, FAIR, AT_RISK, CRITICAL
    -- 7 Dimension Scores
    profitability_score INTEGER,
    liquidity_score INTEGER,
    credit_health_score INTEGER,
    expense_control_score INTEGER,
    growth_score INTEGER,
    debt_burden_score INTEGER,
    compliance_score INTEGER,
    -- Details
    risks JSONB,
    recommendations JSONB,
    trend VARCHAR(20), -- up, down, stable
    previous_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. USER MATCHED PROGRAMS
-- =====================================================
CREATE TABLE user_matched_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES uae_sme_programs(id) ON DELETE CASCADE,
    match_score INTEGER, -- 0-100
    match_date DATE DEFAULT CURRENT_DATE,
    eligibility_status VARCHAR(20) DEFAULT 'eligible', -- eligible, partial, ineligible
    missing_requirements JSONB,
    application_status VARCHAR(20), -- not_applied, in_progress, approved, rejected
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, program_id)
);

-- =====================================================
-- 12. REORDER ALERTS
-- =====================================================
CREATE TABLE reorder_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    product_name VARCHAR(255),
    urgency VARCHAR(20), -- HIGH, MEDIUM, LOW
    estimated_days_remaining INTEGER,
    suggested_quantity DECIMAL(10,2),
    estimated_cost DECIMAL(12,2),
    supplier_id UUID REFERENCES suppliers(id),
    supplier_name VARCHAR(255),
    seasonal_note TEXT,
    seasonal_factor DECIMAL(3,2) DEFAULT 1.00,
    is_dismissed BOOLEAN DEFAULT FALSE,
    is_ordered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. INVENTORY ITEMS
-- =====================================================
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    category_id UUID REFERENCES categories(id),
    category_name VARCHAR(100),
    sku VARCHAR(50),
    barcode VARCHAR(50),
    current_quantity DECIMAL(10,2) DEFAULT 0,
    min_quantity DECIMAL(10,2) DEFAULT 0, -- Reorder point
    unit VARCHAR(20) DEFAULT 'piece', -- piece, kg, litre, box, pack
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    vat_category VARCHAR(20) DEFAULT 'standard',
    supplier_id UUID REFERENCES suppliers(id),
    lead_time_days INTEGER DEFAULT 3,
    last_purchase_date DATE,
    last_sale_date DATE,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 14. RECOMMENDATIONS
-- =====================================================
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_name VARCHAR(50) NOT NULL,
    recommendation_type VARCHAR(50), -- profit_improvement, cost_reduction, credit_collection, vat_compliance, reorder
    title VARCHAR(255) NOT NULL,
    title_arabic VARCHAR(255),
    description TEXT,
    description_arabic TEXT,
    priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
    potential_impact DECIMAL(12,2), -- Estimated AED impact
    action_required TEXT,
    action_required_arabic TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, dismissed
    due_date DATE,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 15. AGENT LOGS
-- =====================================================
CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_name VARCHAR(50) NOT NULL,
    action VARCHAR(100),
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'success', -- success, error, warning
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 16. DAILY SUMMARIES
-- =====================================================
CREATE TABLE daily_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_date DATE NOT NULL,
    -- Sales
    total_sales DECIMAL(12,2) DEFAULT 0,
    cash_sales DECIMAL(12,2) DEFAULT 0,
    card_sales DECIMAL(12,2) DEFAULT 0,
    credit_sales DECIMAL(12,2) DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    -- Purchases & Expenses
    total_purchases DECIMAL(12,2) DEFAULT 0,
    total_expenses DECIMAL(12,2) DEFAULT 0,
    -- Profit
    gross_profit DECIMAL(12,2) DEFAULT 0,
    -- VAT
    output_vat DECIMAL(10,2) DEFAULT 0,
    input_vat DECIMAL(10,2) DEFAULT 0,
    -- Credit
    credit_given DECIMAL(12,2) DEFAULT 0,
    credit_collected DECIMAL(12,2) DEFAULT 0,
    -- Cash Position
    opening_cash DECIMAL(12,2) DEFAULT 0,
    closing_cash DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, summary_date)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_credit_transactions_customer ON credit_transactions(customer_id);
CREATE INDEX idx_credit_transactions_due_date ON credit_transactions(due_date);
CREATE INDEX idx_customers_user ON customers(user_id);
CREATE INDEX idx_customers_trust_score ON customers(trust_score);
CREATE INDEX idx_vat_returns_user_period ON vat_returns(user_id, period_start, period_end);
CREATE INDEX idx_health_scores_user_date ON business_health_scores(user_id, calculated_date);
CREATE INDEX idx_recommendations_user_status ON recommendations(user_id, status);
CREATE INDEX idx_reorder_alerts_user ON reorder_alerts(user_id, urgency);
CREATE INDEX idx_inventory_user ON inventory_items(user_id);
CREATE INDEX idx_daily_summaries_user_date ON daily_summaries(user_id, summary_date);

-- =====================================================
-- SEED DATA: UAE SME PROGRAMS
-- =====================================================
INSERT INTO uae_sme_programs (
    program_name, program_name_arabic, provider, provider_arabic,
    description, description_arabic, program_type, benefits,
    max_funding_amount, eligible_emirates, emirati_only,
    min_turnover, max_turnover, eligible_sectors, application_url,
    contact_phone, contact_email, is_active
) VALUES
(
    'Dubai SME', 'دبي للمشاريع الصغيرة',
    'Department of Economy', 'دائرة الاقتصاد',
    'Comprehensive support for SMEs including funding, training, and mentorship',
    'دعم شامل للمشاريع الصغيرة والمتوسطة يشمل التمويل والتدريب والإرشاد',
    'funding',
    '["Funding up to AED 5M", "Business mentorship", "Free training programs", "Government contract access"]',
    5000000, ARRAY['dubai'], FALSE,
    100000, 50000000,
    ARRAY['retail', 'wholesale', 'services', 'f_and_b', 'technology'],
    'https://sme.ae',
    '+971 4 261 2000', 'info@sme.ae', TRUE
),
(
    'Khalifa Fund', 'صندوق خليفة',
    'Khalifa Fund for Enterprise Development', 'صندوق خليفة لتطوير المشاريع',
    'UAE''s largest SME funding program for Emirati entrepreneurs',
    'أكبر برنامج تمويل للمشاريع الصغيرة والمتوسطة لرواد الأعمال الإماراتيين',
    'funding',
    '["Interest-free loans up to AED 10M", "Business incubation", "Expert mentoring", "Training programs"]',
    10000000, ARRAY['dubai', 'abu_dhabi', 'sharjah', 'ajman', 'rak', 'fujairah', 'uaq'], TRUE,
    0, 100000000,
    ARRAY['retail', 'wholesale', 'services', 'f_and_b', 'technology', 'manufacturing'],
    'https://khalifafund.ae',
    '+971 2 616 8888', 'info@khalifafund.ae', TRUE
),
(
    'Emirates Development Bank', 'مصرف الإمارات للتنمية',
    'Emirates Development Bank', 'مصرف الإمارات للتنمية',
    'Strategic financing for priority sectors in UAE',
    'تمويل استراتيجي للقطاعات ذات الأولوية في الإمارات',
    'funding',
    '["Competitive rates", "Working capital loans", "Equipment financing", "Long-term financing"]',
    3000000, ARRAY['dubai', 'abu_dhabi', 'sharjah', 'ajman', 'rak', 'fujairah', 'uaq'], FALSE,
    375000, 50000000,
    ARRAY['retail', 'wholesale', 'manufacturing', 'technology', 'healthcare'],
    'https://edb.gov.ae',
    '+971 2 672 8888', 'info@edb.gov.ae', TRUE
),
(
    'Mohammed Bin Rashid Fund', 'مؤسسة محمد بن راشد لدعم المشاريع',
    'MBRF', 'مؤسسة محمد بن راشد',
    'Subsidized loans and grants for innovative businesses',
    'قروض مدعومة ومنح للأعمال المبتكرة',
    'funding',
    '["Subsidized interest rates", "Business mentorship", "Networking events", "Training programs"]',
    500000, ARRAY['dubai'], FALSE,
    100000, 5000000,
    ARRAY['retail', 'services', 'technology', 'creative'],
    'https://mbrf.ae',
    '+971 4 423 3301', 'info@mbrf.ae', TRUE
),
(
    'in5 Tech', 'in5 للتكنولوجيا',
    'TECOM Group', 'مجموعة تيكوم',
    'Free co-working space and incubation for tech startups',
    'مساحة عمل مشتركة مجانية وحاضنة للشركات التقنية الناشئة',
    'incubation',
    '["Free co-working space", "Visa support", "Investor connections", "Mentorship"]',
    0, ARRAY['dubai'], FALSE,
    0, 1000000,
    ARRAY['technology', 'digital'],
    'https://in5.ae',
    '+971 4 556 0500', 'info@in5.ae', TRUE
),
(
    'Sheraa', 'شراع',
    'Sharjah Entrepreneurship Center', 'مركز الشارقة لريادة الأعمال',
    'Sharjah Entrepreneurship Center for startup acceleration',
    'مركز الشارقة لريادة الأعمال لتسريع الشركات الناشئة',
    'incubation',
    '["Seed funding up to AED 100K", "6-month accelerator program", "Mentor network", "Investor pitch events"]',
    100000, ARRAY['sharjah'], FALSE,
    0, 2000000,
    ARRAY['technology', 'services', 'creative', 'social_enterprise'],
    'https://sheraa.ae',
    '+971 6 526 8888', 'info@sheraa.ae', TRUE
),
(
    'RAK SME', 'رأس الخيمة للمشاريع الصغيرة',
    'RAK Economic Zone', 'منطقة رأس الخيمة الاقتصادية',
    'Support program for SMEs in Ras Al Khaimah',
    'برنامج دعم للمشاريع الصغيرة والمتوسطة في رأس الخيمة',
    'funding',
    '["Discounted licenses", "Subsidized rent", "Business support services"]',
    500000, ARRAY['rak'], FALSE,
    50000, 5000000,
    ARRAY['retail', 'wholesale', 'manufacturing', 'services'],
    'https://rakez.com',
    '+971 7 204 1111', 'info@rakez.com', TRUE
),
(
    'Expo Live', 'إكسبو لايف',
    'Expo 2020 Dubai Legacy', 'إرث إكسبو 2020 دبي',
    'Innovation impact grant program',
    'برنامج منح للابتكار ذو الأثر الاجتماعي',
    'grant',
    '["Grants up to AED 400K", "Global exposure", "Mentorship", "No equity required"]',
    400000, ARRAY['dubai', 'abu_dhabi', 'sharjah', 'ajman', 'rak', 'fujairah', 'uaq'], FALSE,
    0, 10000000,
    ARRAY['technology', 'sustainability', 'social_enterprise'],
    'https://www.expo2020dubai.com/en/programmes/expo-live',
    '+971 4 555 5555', 'info@expo2020.ae', TRUE
);

-- =====================================================
-- SEED DATA: DEFAULT CATEGORIES
-- =====================================================
INSERT INTO categories (user_id, name, name_arabic, category_type, icon, vat_category, is_default) VALUES
-- Income Categories
(NULL, 'General Sales', 'مبيعات عامة', 'income', '💰', 'standard', TRUE),
(NULL, 'Grocery', 'بقالة', 'income', '🛒', 'standard', TRUE),
(NULL, 'Electronics', 'إلكترونيات', 'income', '📱', 'standard', TRUE),
(NULL, 'Clothing', 'ملابس', 'income', '👕', 'standard', TRUE),
(NULL, 'Food & Beverage', 'أطعمة ومشروبات', 'income', '🍔', 'standard', TRUE),
(NULL, 'Services', 'خدمات', 'income', '🔧', 'standard', TRUE),
-- Expense Categories
(NULL, 'Shop Rent', 'إيجار المحل', 'expense', '🏢', 'exempt', TRUE),
(NULL, 'DEWA (Utilities)', 'ديوا (كهرباء وماء)', 'expense', '💡', 'standard', TRUE),
(NULL, 'Staff Salary', 'رواتب الموظفين', 'expense', '👷', 'exempt', TRUE),
(NULL, 'Trade License', 'رخصة تجارية', 'expense', '📄', 'exempt', TRUE),
(NULL, 'Visa & Labour', 'تأشيرة وعمالة', 'expense', '🛂', 'exempt', TRUE),
(NULL, 'Internet & Phone', 'إنترنت وهاتف', 'expense', '📞', 'standard', TRUE),
(NULL, 'Insurance', 'تأمين', 'expense', '🛡️', 'exempt', TRUE),
(NULL, 'Transportation', 'نقل', 'expense', '🚚', 'standard', TRUE),
(NULL, 'Marketing', 'تسويق', 'expense', '📢', 'standard', TRUE),
(NULL, 'Bank Charges', 'رسوم بنكية', 'expense', '🏦', 'exempt', TRUE),
(NULL, 'POS/Card Fees', 'رسوم نقاط البيع', 'expense', '💳', 'exempt', TRUE),
(NULL, 'Stock Purchase', 'شراء بضاعة', 'expense', '📦', 'standard', TRUE),
(NULL, 'Maintenance', 'صيانة', 'expense', '🔨', 'standard', TRUE),
(NULL, 'Municipality Fees', 'رسوم البلدية', 'expense', '🏛️', 'exempt', TRUE);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reorder_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users to access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own business" ON business_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own customers" ON customers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own suppliers" ON suppliers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own credit_transactions" ON credit_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own vat_returns" ON vat_returns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own health_scores" ON business_health_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own recommendations" ON recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reorder_alerts" ON reorder_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own inventory" ON inventory_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own summaries" ON daily_summaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own agent_logs" ON agent_logs FOR ALL USING (auth.uid() = user_id);

-- Public read access for SME programs and default categories
CREATE POLICY "Anyone can view SME programs" ON uae_sme_programs FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view default categories" ON categories FOR SELECT USING (is_default = TRUE OR auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate VAT
CREATE OR REPLACE FUNCTION calculate_vat(amount DECIMAL, vat_cat VARCHAR)
RETURNS DECIMAL AS $$
BEGIN
    IF vat_cat = 'standard' THEN
        RETURN ROUND(amount * 0.05, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer credit totals
CREATE OR REPLACE FUNCTION update_customer_credit_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.credit_type = 'credit_given' THEN
            UPDATE customers 
            SET total_credit_given = total_credit_given + NEW.amount_aed,
                total_credit_outstanding = total_credit_outstanding + NEW.amount_aed,
                last_transaction_date = CURRENT_DATE,
                updated_at = NOW()
            WHERE id = NEW.customer_id;
        ELSIF NEW.credit_type = 'payment_received' THEN
            UPDATE customers 
            SET total_payments_received = total_payments_received + NEW.amount_aed,
                total_credit_outstanding = total_credit_outstanding - NEW.amount_aed,
                last_transaction_date = CURRENT_DATE,
                updated_at = NOW()
            WHERE id = NEW.customer_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_credit
AFTER INSERT ON credit_transactions
FOR EACH ROW EXECUTE FUNCTION update_customer_credit_totals();

-- Function to auto-calculate transaction totals with VAT
CREATE OR REPLACE FUNCTION calculate_transaction_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vat_category = 'standard' THEN
        NEW.vat_amount := ROUND(NEW.amount_aed * 0.05, 2);
    ELSE
        NEW.vat_amount := 0;
    END IF;
    NEW.total_amount := NEW.amount_aed + NEW.vat_amount;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_transaction_totals
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION calculate_transaction_totals();

-- =====================================================
-- DONE!
-- =====================================================
