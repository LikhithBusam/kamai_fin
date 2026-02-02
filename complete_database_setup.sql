-- ============================================
-- COMPLETE DATABASE SETUP FOR KAMAI
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT '',
    occupation VARCHAR(100) DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    state VARCHAR(100) DEFAULT '',
    pin_code VARCHAR(10) DEFAULT '',
    income_range VARCHAR(50) DEFAULT '',
    date_of_birth DATE DEFAULT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    kyc_verified BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    monthly_income_min DECIMAL(12,2) DEFAULT 0,
    monthly_income_max DECIMAL(12,2) DEFAULT 0,
    monthly_expenses_avg DECIMAL(12,2) DEFAULT 0,
    emergency_fund_target DECIMAL(12,2) DEFAULT 0,
    current_emergency_fund DECIMAL(12,2) DEFAULT 0,
    risk_tolerance VARCHAR(20) DEFAULT 'moderate',
    financial_goals JSONB DEFAULT '{}',
    income_sources JSONB DEFAULT '{}',
    debt_obligations JSONB DEFAULT '{}',
    dependents INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_time TIME DEFAULT CURRENT_TIME,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    transaction_type VARCHAR(10) DEFAULT 'expense' CHECK (transaction_type IN ('income', 'expense')),
    category VARCHAR(50) DEFAULT 'Other',
    subcategory VARCHAR(50) DEFAULT '',
    description TEXT DEFAULT '',
    payment_method VARCHAR(50) DEFAULT 'cash',
    merchant_name VARCHAR(100) DEFAULT '',
    location VARCHAR(100) DEFAULT '',
    source VARCHAR(50) DEFAULT '',
    account_id UUID DEFAULT NULL,
    input_method VARCHAR(20) DEFAULT 'manual',
    verified BOOLEAN DEFAULT true,
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(20) DEFAULT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- 4. BANK ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS bank_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    account_name VARCHAR(100) NOT NULL,
    provider VARCHAR(100) DEFAULT '',
    account_number VARCHAR(50) DEFAULT '',
    current_balance DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE bank_accounts DISABLE ROW LEVEL SECURITY;

-- 5. BUDGETS TABLE
CREATE TABLE IF NOT EXISTS budgets (
    budget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    budget_type VARCHAR(20) DEFAULT 'normal',
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
    total_income_expected DECIMAL(12,2) DEFAULT 0,
    fixed_costs JSONB DEFAULT '{}',
    variable_costs JSONB DEFAULT '{}',
    savings_target DECIMAL(12,2) DEFAULT 0,
    discretionary_budget DECIMAL(12,2) DEFAULT 0,
    category_limits JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2) DEFAULT 0.8,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;

-- 6. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(10) DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    reasoning TEXT DEFAULT '',
    action_items JSONB DEFAULT '[]',
    target_amount DECIMAL(12,2) DEFAULT NULL,
    target_date DATE DEFAULT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.8,
    success_probability DECIMAL(3,2) DEFAULT NULL,
    agent_source VARCHAR(50) DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending',
    user_feedback TEXT DEFAULT NULL,
    actual_outcome JSONB DEFAULT NULL,
    delivered_at TIMESTAMPTZ DEFAULT NULL,
    actioned_at TIMESTAMPTZ DEFAULT NULL,
    completed_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE recommendations DISABLE ROW LEVEL SECURITY;

-- 7. INCOME PATTERNS TABLE
CREATE TABLE IF NOT EXISTS income_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    average_weekly_income DECIMAL(12,2) DEFAULT 0,
    income_volatility DECIMAL(5,2) DEFAULT 0,
    seasonal_factors TEXT DEFAULT '',
    confidence_score DECIMAL(3,2) DEFAULT 0.8,
    last_calculated TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ DEFAULT NOW() + INTERVAL '120 days',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE income_patterns DISABLE ROW LEVEL SECURITY;

-- 8. INCOME FORECASTS TABLE
CREATE TABLE IF NOT EXISTS income_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    forecast_date DATE DEFAULT CURRENT_DATE,
    forecast_period_days INTEGER DEFAULT 30,
    pessimistic_scenario JSONB DEFAULT '{}',
    realistic_scenario JSONB DEFAULT '{}',
    optimistic_scenario JSONB DEFAULT '{}',
    volatility_score DECIMAL(3,2) DEFAULT 0.5,
    forecast_confidence DECIMAL(3,2) DEFAULT 0.7,
    recommendation TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE income_forecasts DISABLE ROW LEVEL SECURITY;

-- 9. RISK ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assessment_date DATE DEFAULT CURRENT_DATE,
    overall_risk_level VARCHAR(20) DEFAULT 'medium',
    risk_score DECIMAL(4,2) DEFAULT 5.0,
    risk_factors JSONB DEFAULT '[]',
    debt_to_income_ratio DECIMAL(5,2) DEFAULT 0,
    emergency_fund_coverage DECIMAL(5,2) DEFAULT 0,
    escalation_needed BOOLEAN DEFAULT false,
    recommended_actions JSONB DEFAULT '[]',
    ai_risk_analysis TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE risk_assessments DISABLE ROW LEVEL SECURITY;

-- 10. TAX RECORDS TABLE
CREATE TABLE IF NOT EXISTS tax_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    financial_year VARCHAR(10) NOT NULL,
    gross_income DECIMAL(12,2) DEFAULT 0,
    total_deductions DECIMAL(12,2) DEFAULT 0,
    taxable_income DECIMAL(12,2) DEFAULT 0,
    tax_liability DECIMAL(12,2) DEFAULT 0,
    tax_paid DECIMAL(12,2) DEFAULT 0,
    filing_status VARCHAR(20) DEFAULT 'not_filed',
    filing_date DATE DEFAULT NULL,
    acknowledgement_number VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tax_records DISABLE ROW LEVEL SECURITY;

-- 11. GOVERNMENT SCHEMES TABLE
CREATE TABLE IF NOT EXISTS government_schemes (
    scheme_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_code VARCHAR(50) UNIQUE,
    scheme_name VARCHAR(255) NOT NULL,
    scheme_type VARCHAR(50) DEFAULT 'welfare',
    description TEXT DEFAULT '',
    benefits TEXT DEFAULT '',
    eligibility_criteria JSONB DEFAULT '{}',
    required_documents JSONB DEFAULT '[]',
    application_process TEXT DEFAULT '',
    government_level VARCHAR(20) DEFAULT 'central',
    state_applicable VARCHAR(100) DEFAULT 'All',
    official_website VARCHAR(255) DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE government_schemes DISABLE ROW LEVEL SECURITY;

-- 12. USER SCHEMES TABLE
CREATE TABLE IF NOT EXISTS user_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    scheme_id UUID REFERENCES government_schemes(scheme_id) ON DELETE CASCADE,
    match_confidence DECIMAL(3,2) DEFAULT 0.8,
    match_reason TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_schemes DISABLE ROW LEVEL SECURITY;

-- 13. USER SCHEME APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS user_scheme_applications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    scheme_id UUID REFERENCES government_schemes(scheme_id) ON DELETE CASCADE,
    application_date DATE DEFAULT CURRENT_DATE,
    application_status VARCHAR(20) DEFAULT 'submitted',
    documents_submitted JSONB DEFAULT NULL,
    documents_verified JSONB DEFAULT NULL,
    approval_date DATE DEFAULT NULL,
    disbursement_date DATE DEFAULT NULL,
    benefit_received DECIMAL(12,2) DEFAULT 0,
    application_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_scheme_applications DISABLE ROW LEVEL SECURITY;

-- 14. EXECUTED ACTIONS TABLE
CREATE TABLE IF NOT EXISTS executed_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT DEFAULT '',
    amount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    schedule VARCHAR(20) DEFAULT 'once',
    next_execution DATE DEFAULT CURRENT_DATE,
    user_approved BOOLEAN DEFAULT false,
    is_reversible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE executed_actions DISABLE ROW LEVEL SECURITY;

-- 15. FINANCIAL HEALTH TABLE
CREATE TABLE IF NOT EXISTS financial_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assessment_date DATE DEFAULT CURRENT_DATE,
    health_score DECIMAL(4,2) DEFAULT 50.0,
    income_stability DECIMAL(3,2) DEFAULT 0.5,
    expense_control DECIMAL(3,2) DEFAULT 0.5,
    savings_rate DECIMAL(3,2) DEFAULT 0.1,
    debt_management DECIMAL(3,2) DEFAULT 0.5,
    emergency_preparedness DECIMAL(3,2) DEFAULT 0.3,
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE financial_health DISABLE ROW LEVEL SECURITY;

-- 16. SAVINGS GOALS TABLE
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    goal_type VARCHAR(50) DEFAULT 'savings',
    goal_name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(12,2) DEFAULT 0,
    current_amount DECIMAL(12,2) DEFAULT 0,
    monthly_contribution DECIMAL(12,2) DEFAULT 0,
    priority VARCHAR(10) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'not_started',
    reasoning TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE savings_goals DISABLE ROW LEVEL SECURITY;

-- 17. INVESTMENT RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS investment_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    investment_type VARCHAR(50) NOT NULL,
    provider VARCHAR(100) DEFAULT '',
    recommended_amount DECIMAL(12,2) DEFAULT 0,
    frequency VARCHAR(20) DEFAULT 'monthly',
    expected_return DECIMAL(5,2) DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'low',
    reasoning TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE investment_recommendations DISABLE ROW LEVEL SECURITY;

-- 18. BILLS TABLE
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    bill_name VARCHAR(255) NOT NULL,
    bill_type VARCHAR(50) DEFAULT 'utility',
    amount DECIMAL(12,2) DEFAULT 0,
    due_date DATE NOT NULL,
    frequency VARCHAR(20) DEFAULT 'monthly',
    priority VARCHAR(20) DEFAULT 'medium',
    auto_pay_recommended BOOLEAN DEFAULT false,
    payment_method VARCHAR(50) DEFAULT 'upi',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE bills DISABLE ROW LEVEL SECURITY;

-- 19. FINANCIAL GOALS TABLE
CREATE TABLE IF NOT EXISTS financial_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    goal_name VARCHAR(255) NOT NULL,
    goal_type VARCHAR(50) DEFAULT 'savings',
    description TEXT DEFAULT '',
    target_amount DECIMAL(12,2) DEFAULT 0,
    current_amount DECIMAL(12,2) DEFAULT 0,
    target_date DATE DEFAULT NULL,
    priority INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'not_started',
    monthly_target DECIMAL(12,2) DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    explanation JSONB DEFAULT '{}',
    milestones JSONB DEFAULT '[]',
    action_steps JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE financial_goals DISABLE ROW LEVEL SECURITY;

-- 20. AGENT LOGS TABLE
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    agent_name VARCHAR(50) NOT NULL,
    action VARCHAR(100) DEFAULT '',
    status VARCHAR(20) DEFAULT 'completed',
    output JSONB DEFAULT '{}',
    details TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE agent_logs DISABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_income_patterns_user_id ON income_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_id ON risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_user_id ON agent_logs(user_id);

-- ============================================
-- VERIFY TABLES CREATED
-- ============================================
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
