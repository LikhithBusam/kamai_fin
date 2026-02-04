// StoreBuddy UAE - TypeScript Types

// ===== CURRENCY & LOCALIZATION =====
export type Currency = 'AED';
export type Language = 'en' | 'ar' | 'hi' | 'ur';
export type Emirate = 'dubai' | 'abu_dhabi' | 'sharjah' | 'ajman' | 'rak' | 'fujairah' | 'uaq';

// ===== USER & BUSINESS PROFILE =====
export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  preferred_language: Language;
  created_at: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_name_arabic?: string;
  business_type: BusinessType;
  emirate: Emirate;
  trade_license_number?: string;
  license_expiry?: string;
  trn?: string; // Tax Registration Number (15 digits starting with 100)
  owner_nationality: string;
  monthly_rent?: number;
  employee_count?: number;
  current_balance?: number;
  created_at: string;
  updated_at: string;
}

export type BusinessType = 
  | 'grocery' 
  | 'electronics' 
  | 'pharmacy' 
  | 'cafeteria' 
  | 'textile' 
  | 'auto_parts'
  | 'general';

// ===== TRANSACTIONS =====
export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  amount_aed: number;
  vat_amount_aed: number;
  vat_category: VATCategory;
  category?: string;
  description?: string;
  customer_id?: string;
  supplier_id?: string;
  item_id?: string;
  payment_method: PaymentMethod;
  date: string;
  created_at: string;
}

export type TransactionType = 'sale' | 'purchase' | 'expense' | 'credit_given' | 'credit_received';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'credit' | 'cheque';
export type VATCategory = 'standard' | 'zero_rated' | 'exempt';

// ===== CUSTOMERS & CREDIT =====
export interface Customer {
  id: string;
  user_id: string;
  name: string;
  name_arabic?: string;
  phone: string;
  email?: string;
  business_name?: string;
  trust_score: number;
  total_credit_given: number;
  total_credit_received?: number;
  total_credit_outstanding?: number;
  total_payments_received?: number;
  current_balance?: number;
  on_time_payment_ratio?: number;
  average_payment_days: number;
  bounced_cheques?: number;
  last_transaction_date?: string;
  created_at: string;
}

export interface CreditAnalysis {
  total_outstanding: number;
  total_customers: number;
  high_risk_count: number;
  overdue_amount?: number;
  collection_priority: CollectionPriority[];
  aging_summary: {
    current: number;
    days_30: number;
    days_60: number;
    days_90_plus: number;
  };
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  customer_id: string;
  transaction_id: string;
  credit_type: 'credit_given' | 'payment_received';
  amount_aed: number;
  due_date?: string;
  payment_date?: string;
  days_overdue: number;
  status: CreditStatus;
  notes?: string;
  created_at: string;
}

export type CreditStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'written_off';

export interface TrustScore {
  customer_id: string;
  customer_name: string;
  trust_score: number;
  risk_level: RiskLevel;
  risk_color: string;
  recommended_credit_limit: number;
  factors: TrustScoreFactors;
  current_outstanding: number;
  currency: Currency;
}

export interface TrustScoreFactors {
  payment_punctuality: {
    ratio: number;
    score_impact: number;
    description: string;
  };
  payment_speed: {
    avg_days: number;
    score_impact: number;
    description: string;
  };
  bounced_cheques: {
    count: number;
    score_impact: number;
    description: string;
  };
  relationship_duration: {
    months: number;
    score_impact: number;
    description: string;
  };
  business_volume: {
    total: number;
    score_impact: number;
    description: string;
  };
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface CollectionPriority {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  outstanding_amount: number;
  days_overdue: number;
  trust_score: number;
  priority: 'IMMEDIATE' | 'URGENT' | 'NORMAL' | 'LOW';
  priority_color: string;
  recommended_action: string;
  recommended_action_arabic: string;
  risk_weighted_amount: number;
}

// ===== VAT =====
export interface VATPosition {
  status: string;
  period: string;
  period_start: string;
  period_end: string;
  output_vat?: number;
  input_vat?: number;
  sales: {
    total_sales: number;
    standard_rated: number;
    zero_rated: number;
    exempt: number;
    output_vat: number;
  };
  purchases: {
    total_purchases: number;
    input_vat: number;
  };
  net_vat: number;
  position: 'PAYABLE' | 'REFUNDABLE';
  amount_due: number;
  due_date: string;
  currency: Currency;
}

export interface VATReturn {
  id?: string;
  user_id?: string;
  trn: string;
  business_name: string;
  period: string;
  period_start?: string;
  period_end?: string;
  status?: 'pending' | 'filed' | 'paid';
  due_date?: string;
  filed_date?: string;
  output_vat?: number;
  input_vat?: number;
  net_vat?: number;
  created_at?: string;
  boxes?: {
    box_1_standard_rated_sales: number;
    box_2_output_vat_standard: number;
    box_3_zero_rated_sales: number;
    box_4_exempt_sales: number;
    box_5_total_sales: number;
    box_6_standard_rated_expenses: number;
    box_7_input_vat: number;
    box_8_net_vat: number;
    box_9_vat_payable: number;
    box_10_vat_refundable: number;
  };
  filing_deadline: string;
  payment_deadline: string;
}

export interface VATCalculation {
  base_amount: number;
  vat_rate: number;
  vat_type: VATCategory;
  vat_amount: number;
  total_amount: number;
  currency: Currency;
}

// ===== BUSINESS HEALTH =====
export interface BusinessHealthScore {
  status: string;
  overall_score: number;
  health_level: HealthLevel;
  health_color: string;
  health_emoji: string;
  trend?: 'improving' | 'stable' | 'declining';
  last_month_score?: number;
  dimensions: {
    profitability: HealthDimension | number;
    liquidity: HealthDimension | number;
    credit_health: HealthDimension | number;
    expense_control: HealthDimension | number;
    growth: HealthDimension | number;
    debt_burden: HealthDimension | number;
    compliance: HealthDimension | number;
  };
  top_issues: HealthIssue[];
  strengths: HealthIssue[];
  recommendations: HealthRecommendation[];
  business_type: BusinessType;
  calculated_at: string;
}

export type HealthLevel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';

export interface HealthDimension {
  score: number;
  weight: number;
  insight: string;
  insight_arabic: string;
  [key: string]: any;
}

export interface HealthIssue {
  dimension: string;
  score: number;
  insight: string;
}

export interface HealthRecommendation {
  dimension: string;
  current_score?: number;
  message?: string;
  message_arabic?: string;
  priority: number | string;
  suggestion?: string;
  potential_impact?: number;
}

// ===== INVENTORY & REORDER =====
export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  name_arabic?: string;
  sku?: string;
  category: string;
  current_stock: number;
  reorder_point: number;
  unit_cost: number;
  unit_price: number;
  average_daily_sales: number;
  supplier_id?: string;
  min_order_quantity?: number;
  pack_size?: number;
  is_active: boolean;
  created_at: string;
}

export interface ReorderAlert {
  item_id: string;
  item_name: string;
  item_name_arabic?: string;
  sku?: string;
  category: string;
  current_stock: number;
  reorder_point: number;
  dynamic_reorder_point: number;
  recommended_order_qty: number;
  days_until_stockout: number;
  lead_time_days: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  urgency_color: string;
  supplier_id?: string;
  supplier_name?: string;
  unit_cost: number;
  estimated_order_value: number;
  seasonal_adjustment: string;
  season: string;
}

export interface DemandPrediction {
  date: string;
  day_of_week: string;
  predicted_demand: number;
  season: string;
  seasonal_factor: number;
}

// ===== UAE PROGRAMS =====
export interface UAEProgram {
  id?: string;
  program_id?: string;
  name: string;
  name_ar?: string;
  name_arabic?: string;
  description?: string;
  provider?: string;
  type: 'government' | 'government_bank' | 'accelerator' | 'grant' | 'bank' | 'incubator';
  emirates?: string[];
  eligibility?: {
    business_types?: string[];
    nationalities?: string[];
    min_years?: number;
    max_revenue?: number;
  };
  match_score?: number;
  benefits: string[];
  benefits_arabic?: string[];
  funding_available?: boolean;
  funding_min?: number;
  funding_max?: number;
  max_funding?: number;
  icon?: string;
  website?: string;
  eligibility_notes?: string[];
  missing_requirements?: string[];
}

export interface ProgramMatch {
  status: string;
  program_id?: string;
  match_score?: number;
  total_matches: number;
  funding_programs: number;
  total_potential_funding: number;
  matches: UAEProgram[];
  business_summary: {
    emirate: string;
    nationality: string;
    business_type: string;
    employees: number;
    annual_revenue: number;
  };
  currency: Currency;
}

// ===== RECOMMENDATIONS =====
export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  icon: string;
  title: string;
  title_arabic: string;
  description: string;
  description_arabic: string;
  action: string;
  action_arabic: string;
  potential_aed: number;
  impact_score: number;
  source: string;
}

export type RecommendationCategory = 
  | 'URGENT' 
  | 'FINANCIAL' 
  | 'OPERATIONAL' 
  | 'GROWTH' 
  | 'COMPLIANCE' 
  | 'OPPORTUNITY';

export interface DailyRecommendations {
  status: string;
  date: string;
  total_recommendations: number;
  top_recommendations: number;
  urgent_items: number;
  potential_monthly_impact: number;
  recommendations: Recommendation[];
  currency: Currency;
}

// ===== SALES PATTERNS =====
export interface SalesPatterns {
  status: string;
  analysis_period: {
    days: number;
    start_date: string;
    end_date: string;
  };
  total_transactions: number;
  total_revenue: number;
  patterns: {
    hourly: HourlyPattern;
    daily: DailyPattern;
    weekly: WeeklyPattern;
    monthly: MonthlyPattern;
    category: CategoryPattern;
    payment_method: PaymentPattern;
  };
  insights: SalesInsight[];
  currency: Currency;
}

export interface HourlyPattern {
  distribution: Record<number, { count: number; revenue: number }>;
  peak_hour: number;
  peak_revenue: number;
}

export interface DailyPattern {
  distribution: Record<string, { count: number; revenue: number; name_arabic: string }>;
  peak_day: string;
  peak_day_arabic: string;
  weekend_note: string;
}

export interface WeeklyPattern {
  weeks: Record<string, { count: number; revenue: number }>;
  trend: number;
  trend_direction: 'up' | 'down' | 'stable' | 'insufficient_data';
}

export interface MonthlyPattern {
  distribution: Record<number, { count: number; revenue: number }>;
  salary_cycle_impact: string;
  salary_days: number[];
}

export interface CategoryPattern {
  distribution: Record<string, { count: number; revenue: number }>;
  top_category: string;
  top_category_revenue: number;
}

export interface PaymentPattern {
  distribution: Record<string, { count: number; revenue: number; percentage: number }>;
}

export interface SalesInsight {
  type: 'timing' | 'alert' | 'positive';
  insight: string;
  insight_arabic: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PeakTime {
  day: number;
  day_name: string;
  day_name_arabic: string;
  hour: number;
  time_range: string;
  transaction_count: number;
  revenue: number;
  avg_transaction: number;
}

export interface CustomerSegment {
  customer_id: string;
  customer_name: string;
  total_revenue: number;
  transaction_count: number;
  avg_transaction: number;
  days_since_last: number;
}

export interface SalesForecast {
  date: string;
  day: string;
  day_arabic: string;
  predicted_sales: number;
  season: string;
  seasonal_factor: number;
}

// ===== PROFIT ANALYSIS =====
export interface ProfitAnalysis {
  status: string;
  period: string;
  sales: {
    total: number;
    transaction_count: number;
    average_ticket: number;
  };
  cost_of_goods: number;
  gross_profit: number;
  gross_margin: number;
  expenses: {
    total: number;
    breakdown: Record<string, number>;
  };
  net_profit: number;
  net_margin: number;
  vat_position: {
    output_vat: number;
    input_vat: number;
    net_vat: number;
  };
  benchmark_comparison: {
    industry: string;
    benchmark_margin: number;
    performance: 'above' | 'at' | 'below';
  };
  profit_leaks: ProfitLeak[];
  recommendations: ProfitRecommendation[];
  currency: Currency;
}

export interface ProfitLeak {
  category: string;
  issue: string;
  issue_arabic: string;
  impact_aed: number;
  severity: 'high' | 'medium' | 'low';
}

export interface ProfitRecommendation {
  action: string;
  action_arabic: string;
  potential_savings: number;
  priority: 'high' | 'medium' | 'low';
}

// ===== API RESPONSES =====
export interface APIResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  currency?: Currency;
}

export interface AnalysisStatus {
  user_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'error';
  agents_completed: number;
  total_agents: number;
  last_updated: string;
}
