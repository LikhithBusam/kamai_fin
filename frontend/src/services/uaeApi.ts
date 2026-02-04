// StoreBuddy UAE - API Service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// ===== ANALYSIS ENDPOINTS =====

export const analysisAPI = {
  /**
   * Trigger full analysis (async)
   */
  triggerAnalysis: (userId: string) =>
    fetchAPI('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),

  /**
   * Trigger quick analysis (3 agents)
   */
  triggerQuickAnalysis: (userId: string) =>
    fetchAPI('/api/analyze-quick', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),

  /**
   * Get analysis status
   */
  getStatus: (userId: string) =>
    fetchAPI(`/api/status/${userId}`),

  /**
   * Health check
   */
  healthCheck: () => fetchAPI('/api/health'),
};

// ===== PROFIT ENDPOINTS =====

export const profitAPI = {
  /**
   * Get profit analysis
   */
  getAnalysis: (userId: string) =>
    fetchAPI(`/api/profit/${userId}`),

  /**
   * Get daily profit analysis
   */
  getDailyAnalysis: (userId: string) =>
    fetchAPI(`/api/profit/daily/${userId}`),
};

// ===== CREDIT RISK ENDPOINTS =====

export const creditAPI = {
  /**
   * Get credit analysis summary
   */
  getAnalysis: (userId: string) =>
    fetchAPI(`/api/credit/analysis/${userId}`),

  /**
   * Get customer trust score
   */
  getTrustScore: (userId: string, customerId: string) =>
    fetchAPI(`/api/credit/trust-score/${userId}/${customerId}`),

  /**
   * Get collection priority list
   */
  getCollectionPriority: (userId: string) =>
    fetchAPI(`/api/credit/collection-priority/${userId}`),

  /**
   * Get credit aging analysis
   */
  getAgingAnalysis: (userId: string) =>
    fetchAPI(`/api/credit/aging/${userId}`),
};

// ===== VAT ENDPOINTS =====

export const vatAPI = {
  /**
   * Get VAT position for period
   */
  getPosition: (userId: string, period?: string) =>
    fetchAPI(`/api/vat/position/${userId}${period ? `?period=${period}` : ''}`),

  /**
   * Generate VAT return data
   */
  getReturn: (userId: string, period?: string) =>
    fetchAPI(`/api/vat/return/${userId}${period ? `?period=${period}` : ''}`),

  /**
   * Check VAT registration status
   */
  getRegistrationStatus: (userId: string) =>
    fetchAPI(`/api/vat/registration-status/${userId}`),

  /**
   * Validate TRN
   */
  validateTRN: (trn: string) =>
    fetchAPI('/api/vat/validate-trn', {
      method: 'POST',
      body: JSON.stringify({ trn }),
    }),

  /**
   * Calculate VAT for a transaction
   */
  calculateVAT: (amount: number, category: string = 'general_goods', isInclusive: boolean = true) =>
    fetchAPI('/api/vat/calculate', {
      method: 'POST',
      body: JSON.stringify({ amount, category, is_inclusive: isInclusive }),
    }),
};

// ===== BUSINESS HEALTH ENDPOINTS =====

export const healthAPI = {
  /**
   * Get business health score
   */
  getScore: (userId: string) =>
    fetchAPI(`/api/health-score/${userId}`),

  /**
   * Get business health score (alias)
   */
  getHealthScore: (userId: string) =>
    fetchAPI(`/api/health-score/${userId}`),

  /**
   * Get health score trend
   */
  getTrend: (userId: string, months: number = 6) =>
    fetchAPI(`/api/health-trend/${userId}?months=${months}`),
};

// ===== REORDER ENDPOINTS =====

export const reorderAPI = {
  /**
   * Get reorder alerts
   */
  getAlerts: (userId: string) =>
    fetchAPI(`/api/reorder/alerts/${userId}`),

  /**
   * Predict demand for item
   */
  predictDemand: (userId: string, itemId: string, daysAhead: number = 30) =>
    fetchAPI(`/api/reorder/predict/${userId}/${itemId}?days_ahead=${daysAhead}`),

  /**
   * Get supplier order summary
   */
  getSupplierOrders: (userId: string) =>
    fetchAPI(`/api/reorder/supplier-orders/${userId}`),
};

// ===== UAE PROGRAMS ENDPOINTS =====

export const programsAPI = {
  /**
   * Find matching programs
   */
  findMatches: (userId: string) =>
    fetchAPI(`/api/programs/match/${userId}`),

  /**
   * Get program details
   */
  getDetails: (programId: string) =>
    fetchAPI(`/api/programs/${programId}`),

  /**
   * Apply for program
   */
  apply: (userId: string, programId: string) =>
    fetchAPI(`/api/programs/apply/${userId}/${programId}`, {
      method: 'POST',
    }),
};

// ===== RECOMMENDATIONS ENDPOINTS =====

export const recommendationsAPI = {
  /**
   * Get daily recommendations
   */
  getDaily: (userId: string) =>
    fetchAPI(`/api/recommendations/${userId}`),

  /**
   * Get recommendations (alias)
   */
  getRecommendations: (userId: string, limit: number = 5) =>
    fetchAPI(`/api/recommendations/${userId}?limit=${limit}`),

  /**
   * Get recommendations by category
   */
  getByCategory: (userId: string, category: string) =>
    fetchAPI(`/api/recommendations/${userId}/${category}`),

  /**
   * Mark recommendation action
   */
  markAction: (userId: string, recommendationId: string, action: 'completed' | 'dismissed' | 'snoozed') =>
    fetchAPI(`/api/recommendations/${userId}/${recommendationId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),
};

// ===== SALES ENDPOINTS =====

export const salesAPI = {
  /**
   * Get sales patterns
   */
  getPatterns: (userId: string, days: number = 90) =>
    fetchAPI(`/api/sales/patterns/${userId}?days=${days}`),

  /**
   * Get peak times
   */
  getPeakTimes: (userId: string) =>
    fetchAPI(`/api/sales/peak-times/${userId}`),

  /**
   * Get customer segments
   */
  getCustomerSegments: (userId: string) =>
    fetchAPI(`/api/sales/customers/${userId}`),

  /**
   * Get sales forecast
   */
  getForecast: (userId: string, daysAhead: number = 7) =>
    fetchAPI(`/api/sales/forecast/${userId}?days_ahead=${daysAhead}`),
};

// ===== COMBINED API EXPORT =====

export const api = {
  analysis: analysisAPI,
  profit: profitAPI,
  credit: creditAPI,
  vat: vatAPI,
  health: healthAPI,
  reorder: reorderAPI,
  programs: programsAPI,
  recommendations: recommendationsAPI,
  sales: salesAPI,
};

export default api;
