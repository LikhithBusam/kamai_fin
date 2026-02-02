-- Occupation-Specific Government Schemes for Gig Workers
-- This SQL file adds government schemes tailored for different gig worker professions
-- Run this to populate the government_schemes table with profession-specific benefits

-- ============================================================================
-- COMMON SCHEMES FOR ALL GIG WORKERS
-- ============================================================================

INSERT INTO government_schemes (
    scheme_name, scheme_code, scheme_type, description,
    benefits, eligibility_criteria, max_benefit_amount,
    government_level, state_applicable, is_active,
    application_process, required_documents, official_url
) VALUES

-- PM-SYM (Pradhan Mantri Shram Yogi Maan-Dhan)
(
    'PM Shram Yogi Maan-dhan Pension Scheme',
    'PM-SYM',
    'pension',
    'Guaranteed monthly pension of ₹3,000 after 60 years for unorganized workers including gig workers, delivery partners, auto drivers, and all informal sector workers.',
    'Monthly pension of ₹3,000 after age 60. Government contributes equal amount to your contribution. In case of death, spouse receives 50% pension.',
    '{"age": "18-40 years", "monthly_income": "Less than ₹15,000", "sector": "Unorganized worker", "requirement": "Not covered under EPFO/NPS/ESIC"}',
    36000.00,
    'central',
    'All India',
    true,
    '1. Visit nearest CSC (Common Service Centre) 2. Provide Aadhaar and bank account 3. Monthly contribution: ₹55-₹200 based on age 4. Auto-debit from bank account',
    '["Aadhaar Card", "Bank Account (savings)", "Mobile Number"]',
    'https://www.india.gov.in/spotlight/pradhan-mantri-shram-yogi-maan-dhan-pm-sym'
),

-- Ayushman Bharat
(
    'Ayushman Bharat - PM Jan Arogya Yojana',
    'AB-PMJAY',
    'health',
    'Free health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization. Covers all gig workers and their families.',
    'Health cover of ₹5 lakh per family annually. Covers 1,393 procedures. Cashless treatment at 24,000+ empaneled hospitals across India. Pre and post hospitalization expenses covered.',
    '{"income": "As per SECC 2011 database", "eligibility": "BPL families and vulnerable occupational categories including gig workers", "coverage": "Entire family"}',
    500000.00,
    'central',
    'All India',
    true,
    '1. Check eligibility at ayushmanbharat.pmjay.gov.in 2. Visit nearest Ayushman Mitra at empaneled hospital 3. Provide Aadhaar for verification 4. Get Ayushman card instantly',
    '["Aadhaar Card", "Ration Card (if applicable)", "Mobile Number"]',
    'https://pmjay.gov.in/'
),

-- Atal Pension Yojana
(
    'Atal Pension Yojana',
    'APY',
    'pension',
    'Government guaranteed pension scheme providing monthly pension of ₹1,000 to ₹5,000 after age 60. Open to all citizens including gig workers, auto drivers, delivery partners.',
    'Choose monthly pension from ₹1,000 to ₹5,000. Pension guaranteed for life. After death, same pension to spouse. Pension corpus to nominee after both pass away.',
    '{"age": "18-40 years", "account": "Must have savings bank account", "Aadhaar": "Mandatory", "contribution": "Regular monthly contributions"}',
    60000.00,
    'central',
    'All India',
    true,
    '1. Open APY account through your bank 2. Choose pension amount (₹1K-₹5K) 3. Auto-debit monthly contribution 4. Government co-contributes 50% for eligible subscribers',
    '["Aadhaar Card", "Bank Account", "Mobile Number", "Nominee Details"]',
    'https://www.npscra.nsdl.co.in/atal-pension-yojana.php'
),

-- PM Jan Dhan Yojana
(
    'Pradhan Mantri Jan Dhan Yojana',
    'PMJDY',
    'social_security',
    'Free basic savings bank account with RuPay debit card, accident insurance of ₹2 lakh, and overdraft facility up to ₹10,000. Essential for all gig workers.',
    'Zero balance account. Free RuPay debit card. Accident insurance cover of ₹2 lakh. ₹10,000 overdraft facility after 6 months. Access to government benefit transfers.',
    '{"age": "Above 10 years", "documents": "Aadhaar or other ID proof", "existing_account": "No other savings account required"}',
    200000.00,
    'central',
    'All India',
    true,
    '1. Visit any bank branch 2. Fill PMJDY account opening form 3. Provide Aadhaar 4. Get instant account and RuPay card',
    '["Aadhaar Card or Voter ID or Driving License", "Passport-size photograph"]',
    'https://pmjdy.gov.in/'
),

-- PMJJBY - Life Insurance
(
    'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    'PMJJBY',
    'insurance',
    'Life insurance cover of ₹2 lakh for just ₹436 per year (₹1.19/day). Covers death due to any reason. Perfect for gig workers supporting families.',
    'Life cover of ₹2 lakh. Death benefit paid to nominee. Annual premium only ₹436 (auto-debit). Age limit 18-50 years. Renewable yearly till age 55.',
    '{"age": "18-50 years (renewable till 55)", "account": "Savings bank account", "premium": "₹436 per year auto-debit", "Aadhaar": "Required"}',
    200000.00,
    'central',
    'All India',
    true,
    '1. Enroll through your bank 2. Give consent for auto-debit of ₹436 annually 3. Fill nomination form 4. Coverage starts immediately',
    '["Aadhaar Card", "Bank Account", "Consent Form", "Nominee Details"]',
    'https://www.jansuraksha.gov.in/'
),

-- PMSBY - Accident Insurance
(
    'Pradhan Mantri Suraksha Bima Yojana',
    'PMSBY',
    'insurance',
    'Accident insurance of ₹2 lakh for only ₹20 per year. Covers accidental death and disability. Critical for delivery partners and drivers who face road risks daily.',
    'Accidental death: ₹2 lakh. Permanent total disability: ₹2 lakh. Permanent partial disability: ₹1 lakh. Premium just ₹20 per year.',
    '{"age": "18-70 years", "account": "Savings bank account", "premium": "₹20 per year", "Aadhaar": "Required for claim"}',
    200000.00,
    'central',
    'All India',
    true,
    '1. Enroll through bank where you have savings account 2. Auto-debit of ₹20 annually 3. Coverage from June 1 to May 31 4. Renewable every year',
    '["Aadhaar Card", "Bank Account", "Consent Form for Auto-debit"]',
    'https://www.jansuraksha.gov.in/'
);

-- ============================================================================
-- AUTO DRIVER / RICKSHAW DRIVER SPECIFIC SCHEMES
-- ============================================================================

INSERT INTO government_schemes (
    scheme_name, scheme_code, scheme_type, description,
    benefits, eligibility_criteria, max_benefit_amount,
    government_level, state_applicable, is_active,
    application_process, required_documents, official_url
) VALUES

(
    'Auto Rickshaw Driver Welfare Scheme - Delhi',
    'ARD-WELFARE-DL',
    'social_security',
    'Financial assistance and welfare benefits for registered auto rickshaw drivers in Delhi. Includes education support, health benefits, and emergency assistance.',
    'Education scholarship for children: ₹2,000-₹3,000 per child. Medical emergency assistance: up to ₹50,000. Accident insurance: ₹2 lakh. Death benefit: ₹1 lakh to family.',
    '{"location": "Delhi", "permit": "Valid auto rickshaw permit", "registration": "Must be registered with Delhi Auto Rickshaw Welfare Board"}',
    50000.00,
    'state',
    'Delhi',
    true,
    '1. Register with Delhi Auto Rickshaw Welfare Board 2. Get welfare card 3. Apply for benefits as needed 4. Submit documents to regional transport office',
    '["Auto Rickshaw Permit", "Driving License", "Aadhaar Card", "Bank Account Details", "Passport Photos"]',
    'https://transport.delhi.gov.in/'
),

(
    'Vehicle Loan Subsidy for Auto Drivers',
    'AUTO-LOAN',
    'employment',
    'Subsidized loans for purchasing new auto rickshaws. Lower interest rates (7-9% instead of 12-15%) with extended repayment period.',
    'Loan amount: Up to ₹2 lakh. Interest subsidy: 3-4% reduction. Repayment period: 5-7 years. Processing fee waiver. Insurance bundled at discounted rates.',
    '{"experience": "Valid driving license", "income_proof": "Past 3 months income proof", "age": "21-60 years", "existing_loans": "No loan default history"}',
    200000.00,
    'central',
    'All India',
    true,
    '1. Approach NABARD-partnered banks 2. Submit income proof and DL 3. Get vehicle quote from authorized dealer 4. Bank disburses directly to dealer',
    '["Driving License", "Aadhaar Card", "Income Proof (3 months)", "Quotation from dealer", "Guarantor details"]',
    'https://www.nabard.org/'
);

-- ============================================================================
-- DELIVERY PARTNER SPECIFIC SCHEMES (Swiggy/Zomato/Dunzo/Amazon)
-- ============================================================================

INSERT INTO government_schemes (
    scheme_name, scheme_code, scheme_type, description,
    benefits, eligibility_criteria, max_benefit_amount,
    government_level, state_applicable, is_active,
    application_process, required_documents, official_url
) VALUES

(
    'Two-Wheeler Loan for Gig Workers',
    '2W-LOAN-GIG',
    'employment',
    'Special loan facility for delivery partners to purchase two-wheelers. Offered by banks in partnership with Swiggy, Zomato, and other gig platforms.',
    'Loan up to ₹1.5 lakh. Interest rate: 9-11% (vs 14-16% market rate). Down payment: 10-15%. Tenure: 3-5 years. Doorstep documentation.',
    '{"occupation": "Active delivery partner", "platform": "Registered on Swiggy/Zomato/Dunzo/Amazon", "income": "Minimum ₹15,000/month for 3 months", "age": "21-55 years"}',
    150000.00,
    'central',
    'All India',
    true,
    '1. Apply through delivery platform app 2. Bank verification of income 3. Choose two-wheeler model 4. Complete documentation 5. Loan disbursed to dealer',
    '["Aadhaar Card", "PAN Card", "Driving License", "3 months platform income proof", "Bank statement", "Vehicle quotation"]',
    'https://www.pmegp.in/'
),

(
    'Gig Worker Accident Insurance Scheme',
    'GIG-ACCIDENT',
    'insurance',
    'Specialized accident insurance for delivery partners covering on-duty and off-duty accidents. Higher coverage than regular PMSBY due to high-risk nature of work.',
    'Death: ₹5 lakh. Permanent total disability: ₹5 lakh. Permanent partial disability: ₹2.5 lakh. Hospitalization: Up to ₹1 lakh. Premium: ₹500/year.',
    '{"occupation": "Delivery partner/gig worker", "active_status": "Minimum 20 hours/week on platform", "age": "18-65 years"}',
    500000.00,
    'central',
    'All India',
    true,
    '1. Enroll through gig platform app 2. Premium deducted from earnings 3. Instant coverage activation 4. Claim through app in case of accident',
    '["Platform Registration", "Aadhaar Card", "Bank Account", "Nominee Details"]',
    'https://labour.gov.in/'
);

-- ============================================================================
-- RIDE-SHARING DRIVER SPECIFIC (Uber/Ola/Rapido)
-- ============================================================================

INSERT INTO government_schemes (
    scheme_name, scheme_code, scheme_type, description,
    benefits, eligibility_criteria, max_benefit_amount,
    government_level, state_applicable, is_active,
    application_process, required_documents, official_url
) VALUES

(
    'Commercial Vehicle Loan Scheme',
    'CV-LOAN',
    'employment',
    'Loan for purchasing commercial vehicles (cars/taxis) for ride-sharing. Subsidized interest rates and extended tenure for Uber/Ola drivers.',
    'Loan: Up to ₹8 lakh. Interest rate: 10-12%. Tenure: 7 years. Down payment: 15-20%. Insurance bundled. Fuel card benefits.',
    '{"license": "Valid commercial driving license (badge)", "experience": "Minimum 2 years driving", "age": "21-60 years", "platform": "Uber/Ola partner or willing to join"}',
    800000.00,
    'central',
    'All India',
    true,
    '1. Apply through partner bank 2. Submit commercial DL and badge 3. Platform income verification 4. Vehicle selection from approved list 5. Loan disbursement',
    '["Commercial Driving License", "Badge", "Aadhaar", "PAN", "6 months income proof", "Police verification", "Vehicle quotation"]',
    'https://www.nabard.org/commercial-vehicle-loans'
),

(
    'Driver Training & Skill Upgradation Program',
    'DRIVER-SKILL',
    'education',
    'Free training programs for ride-sharing drivers to improve driving skills, customer service, and platform optimization. Government-certified courses.',
    'Free 30-day training program. Certification recognized by transport departments. ₹3,000 stipend during training. Placement assistance. Advanced driving certification.',
    '{"license": "Valid driving license", "age": "21-55 years", "platform_active": "Can be new or existing driver"}',
    3000.00,
    'state',
    'All India',
    true,
    '1. Register at district skill development center 2. Submit DL and documents 3. Attend 30-day course 4. Pass certification exam 5. Receive stipend and certificate',
    '["Driving License", "Aadhaar Card", "Educational certificates", "Passport photos"]',
    'https://www.msde.gov.in/'
);

-- ============================================================================
-- FREELANCER / CONSULTANT SPECIFIC SCHEMES
-- ============================================================================

INSERT INTO government_schemes (
    scheme_name, scheme_code, scheme_type, description,
    benefits, eligibility_criteria, max_benefit_amount,
    government_level, state_applicable, is_active,
    application_process, required_documents, official_url
) VALUES

(
    'Pradhan Mantri Employment Generation Programme',
    'PMEGP',
    'employment',
    'Loan up to ₹50 lakh for starting/expanding service businesses. 15-35% government subsidy. Perfect for freelancers wanting to formalize their consulting practice.',
    'Loan: ₹25 lakh (service sector) to ₹50 lakh (manufacturing). Subsidy: 15-35% of project cost. Low interest: 1% above bank rate. Working capital included.',
    '{"age": "Above 18 years", "education": "Class 8th pass minimum", "existing_business": "Can apply for expansion too", "project_cost": "Above ₹10 lakh"}',
    5000000.00,
    'central',
    'All India',
    true,
    '1. Prepare detailed project report 2. Submit to KVIC/KVIB office 3. Attend EDP training 4. Loan sanctioned through bank 5. Subsidy after loan disbursement',
    '["Aadhaar Card", "PAN Card", "Educational certificates", "Project Report", "Quotations", "Address proof"]',
    'https://www.kviconline.gov.in/pmegp/'
),

(
    'Startup India Scheme',
    'STARTUP-INDIA',
    'employment',
    'Tax benefits, easier compliance, and funding support for freelancers registering as startups. 3-year tax holiday and access to ₹10,000 crore fund.',
    '80% rebate on patents/trademarks. 3-year income tax exemption. Self-certification for compliance. Access to fund of funds. Fast-track IPR processing.',
    '{"entity": "Private Limited / LLP / Partnership", "age": "Company less than 10 years old", "turnover": "Less than ₹100 crore", "innovation": "Working on innovation/technology"}',
    10000000.00,
    'central',
    'All India',
    true,
    '1. Incorporate company 2. Register on Startup India portal 3. Get DPIIT recognition 4. Apply for tax benefits 5. Access to funding and support',
    '["Certificate of Incorporation", "PAN of Company", "Website/pitch deck", "Description of innovation", "Recommendation letter (optional)"]',
    'https://www.startupindia.gov.in/'
);

-- ============================================================================
-- STREET VENDOR / SMALL BUSINESS SPECIFIC
-- ============================================================================

INSERT INTO government_schemes (
    scheme_name, scheme_code, scheme_type, description,
    benefits, eligibility_criteria, max_benefit_amount,
    government_level, state_applicable, is_active,
    application_process, required_documents, official_url
) VALUES

(
    'PM SVANidhi - Street Vendor Loan',
    'PM-SVANIDHI',
    'employment',
    'Collateral-free working capital loan up to ₹50,000 for street vendors. Digital transaction incentives. No processing fee. 7% interest subsidy on timely repayment.',
    'Loan: ₹10,000 (first), ₹20,000 (second), ₹50,000 (third). 7% interest subsidy. Digital payment cashback: ₹100/month. No collateral. 1-year tenure.',
    '{"occupation": "Street vendor", "vending_certificate": "Certificate of Vending or letter from ULB", "active_since": "Vending before March 24, 2020"}',
    50000.00,
    'central',
    'All India',
    true,
    '1. Get vending certificate from municipal corporation 2. Apply through PM SVANidhi portal or bank 3. Instant in-principle approval 4. Complete KYC 5. Loan within 7 days',
    '["Aadhaar Card", "Vending Certificate/ULB Letter", "Bank Account", "Mobile Number"]',
    'https://pmsvanidhi.mohua.gov.in/'
),

(
    'Mudra Loan - Shishu Category',
    'MUDRA-SHISHU',
    'employment',
    'Loans up to ₹50,000 for micro-enterprises and small businesses. No collateral. Lower interest rates. Perfect for small vendors, food stalls, repair shops.',
    'Loan: Up to ₹50,000. Interest: 10-12%. Tenure: 5 years. No processing fee. No collateral. Working capital and equipment both covered.',
    '{"business": "Existing or new micro-enterprise", "activity": "Manufacturing, trading, services", "ownership": "Individual, partnership, or company"}',
    50000.00,
    'central',
    'All India',
    true,
    '1. Approach any bank with Mudra scheme 2. Fill application form 3. Submit business plan 4. Provide quotations if needed 5. Loan approved in 2-3 weeks',
    '["Aadhaar Card", "PAN Card", "Business plan/proposal", "Quotation (if purchasing equipment)", "Bank statement"]',
    'https://www.mudra.org.in/'
),

(
    'National Urban Livelihoods Mission',
    'NULM',
    'social_security',
    'Support for urban poor including street vendors and small business owners. Skill training, subsidized loans, and social security benefits.',
    'Skill training: Free courses. Self-employment loan: Up to ₹2 lakh with 7% interest subsidy. Vendor market upgradation. Shelter for homeless.',
    '{"location": "Urban areas", "income": "Below poverty line or vulnerable categories", "business": "Micro-enterprise or street vendor"}',
    200000.00,
    'central',
    'All India',
    true,
    '1. Contact city NULM office 2. Register as beneficiary 3. Choose - skill training or self-employment 4. Complete training if opted 5. Apply for loan subsidy',
    '["Aadhaar Card", "Income Certificate", "Residence Proof", "Business details"]',
    'https://nulm.gov.in/'
);

-- ============================================================================
-- HOUSING AND SAVINGS SCHEMES (Common but important)
-- ============================================================================

INSERT INTO government_schemes (
    scheme_name, scheme_code, scheme_type, description,
    benefits, eligibility_criteria, max_benefit_amount,
    government_level, state_applicable, is_active,
    application_process, required_documents, official_url
) VALUES

(
    'Pradhan Mantri Awas Yojana - Urban',
    'PMAY-U',
    'housing',
    'Interest subsidy on home loans for EWS/LIG families. Gig workers earning less than ₹18,000/month can get subsidy of up to ₹2.67 lakh on home loan.',
    'Interest subsidy: 6.5% on loan up to ₹6 lakh (EWS) or ₹9 lakh (LIG). Direct benefit of ₹1.5-₹2.67 lakh. House size: 30-60 sqm. Women ownership encouraged.',
    '{"income": "Up to ₹18,000/month (EWS) or ₹18,001-₹30,000 (LIG)", "ownership": "No pucca house in family", "location": "Urban areas"}',
    267000.00,
    'central',
    'All India',
    true,
    '1. Apply through bank lending home loan 2. Submit income and property documents 3. Bank forwards to PMAY portal 4. Subsidy credited directly to loan account',
    '["Aadhaar Card", "Income Proof", "Property documents", "Bank Account", "Affidavit of no house ownership"]',
    'https://pmaymis.gov.in/'
),

(
    'Public Provident Fund',
    'PPF',
    'pension',
    'Government-backed long-term savings scheme with 7.1% interest (tax-free). Lock-in of 15 years but allows partial withdrawals. Best retirement planning tool.',
    'Interest: 7.1% compounded annually (tax-free). Maturity: 15 years (extendable). Investment: ₹500 to ₹1.5 lakh per year. Loan facility after 3 years. Tax deduction under 80C.',
    '{"citizenship": "Indian citizen", "age": "No age limit", "account": "Only one PPF account allowed per person"}',
    150000.00,
    'central',
    'All India',
    true,
    '1. Visit any nationalized bank or post office 2. Fill PPF account opening form 3. Deposit minimum ₹500 4. Account activated immediately 5. Invest yearly',
    '["Aadhaar Card", "PAN Card", "Passport photo", "Address proof", "Nomination form"]',
    'https://www.indiapost.gov.in/VAS/Pages/IndiaPostHome.aspx'
),

(
    'National Pension System',
    'NPS',
    'pension',
    'Market-linked pension scheme with government contribution benefits. Lower fees, tax benefits, and choice of investment. Good for long-term retirement planning.',
    'Tax deduction: Up to ₹2 lakh under 80C and 80CCD. Low charges: 0.01-0.25%. Flexible withdrawals: 60% lump sum, 40% annuity. Government co-contribution for low-income subscribers.',
    '{"age": "18-70 years", "citizenship": "Indian citizen or NRI", "kyc": "KYC compliant"}',
    200000.00,
    'central',
    'All India',
    true,
    '1. Open NPS account through POP-SP (bank/post office) 2. Get PRAN number 3. Choose investment option (Auto/Active) 4. Contribute regularly (minimum ₹1,000/year)',
    '["Aadhaar Card", "PAN Card", "Bank Account (canceled cheque)", "Passport photo", "Subscriber registration form"]',
    'https://www.npscra.nsdl.co.in/'
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schemes_occupation ON government_schemes(scheme_name, description);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON government_schemes(state_applicable);
CREATE INDEX IF NOT EXISTS idx_schemes_type ON government_schemes(scheme_type);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON government_schemes(is_active);

-- Success message
SELECT
    COUNT(*) as total_schemes,
    COUNT(CASE WHEN scheme_type = 'pension' THEN 1 END) as pension_schemes,
    COUNT(CASE WHEN scheme_type = 'insurance' THEN 1 END) as insurance_schemes,
    COUNT(CASE WHEN scheme_type = 'employment' THEN 1 END) as employment_schemes,
    COUNT(CASE WHEN scheme_type = 'health' THEN 1 END) as health_schemes,
    COUNT(CASE WHEN scheme_type = 'housing' THEN 1 END) as housing_schemes
FROM government_schemes
WHERE is_active = true;
