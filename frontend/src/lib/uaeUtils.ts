// StoreBuddy UAE - Utility Functions

/**
 * Format amount in AED (UAE Dirhams)
 * @param amount - Amount in AED
 * @param options - Formatting options
 */
export function formatAED(
  amount: number,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
    locale?: string;
  } = {}
): string {
  const { showSymbol = true, showCode = false, decimals = 2, locale = 'en-AE' } = options;
  
  const formatted = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  
  if (showSymbol && showCode) {
    return `AED ${formatted} د.إ`;
  } else if (showCode) {
    return `AED ${formatted}`;
  } else if (showSymbol) {
    return `${formatted} د.إ`;
  }
  return formatted;
}

/**
 * Format amount in Arabic locale
 */
export function formatAEDArabic(amount: number, decimals: number = 2): string {
  const formatted = new Intl.NumberFormat('ar-AE', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return `${formatted} د.إ`;
}

/**
 * Calculate VAT (5% standard rate)
 */
export function calculateVAT(
  amount: number,
  options: {
    rate?: number;
    isInclusive?: boolean;
  } = {}
): {
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
  vatRate: number;
} {
  const { rate = 0.05, isInclusive = true } = options;
  
  let baseAmount: number;
  let vatAmount: number;
  let totalAmount: number;
  
  if (isInclusive) {
    // Amount includes VAT
    baseAmount = amount / (1 + rate);
    vatAmount = amount - baseAmount;
    totalAmount = amount;
  } else {
    // Amount excludes VAT
    baseAmount = amount;
    vatAmount = amount * rate;
    totalAmount = amount + vatAmount;
  }
  
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    vatRate: rate,
  };
}

/**
 * Validate UAE TRN (Tax Registration Number)
 * Format: 15 digits starting with 100
 */
export function validateTRN(trn: string): {
  isValid: boolean;
  formatted: string;
  errors: string[];
} {
  const cleaned = trn.replace(/[\s-]/g, '');
  const errors: string[] = [];
  
  if (!/^\d+$/.test(cleaned)) {
    errors.push('TRN must contain only digits');
  }
  
  if (cleaned.length !== 15) {
    errors.push(`TRN must be 15 digits (got ${cleaned.length})`);
  }
  
  if (!cleaned.startsWith('100')) {
    errors.push('TRN must start with 100');
  }
  
  return {
    isValid: errors.length === 0,
    formatted: cleaned,
    errors,
  };
}

/**
 * Format TRN for display (XXX-XXXX-XXXXXXX)
 */
export function formatTRN(trn: string): string {
  const cleaned = trn.replace(/[\s-]/g, '');
  if (cleaned.length !== 15) return trn;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
}

/**
 * Get UAE emirate display name
 */
export function getEmirateName(
  emirate: string,
  language: string = 'en'
): string {
  const names: Record<string, { en: string; ar: string }> = {
    dubai: { en: 'Dubai', ar: 'دبي' },
    abu_dhabi: { en: 'Abu Dhabi', ar: 'أبو ظبي' },
    sharjah: { en: 'Sharjah', ar: 'الشارقة' },
    ajman: { en: 'Ajman', ar: 'عجمان' },
    rak: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' },
    fujairah: { en: 'Fujairah', ar: 'الفجيرة' },
    uaq: { en: 'Umm Al Quwain', ar: 'أم القيوين' },
  };
  
  const lang = language === 'ar' ? 'ar' : 'en';
  return names[emirate.toLowerCase()]?.[lang] || emirate;
}

/**
 * Get business type display name
 */
export function getBusinessTypeName(
  type: string,
  language: 'en' | 'ar' = 'en'
): string {
  const names: Record<string, { en: string; ar: string }> = {
    grocery: { en: 'Grocery Store', ar: 'بقالة' },
    electronics: { en: 'Electronics Shop', ar: 'محل إلكترونيات' },
    pharmacy: { en: 'Pharmacy', ar: 'صيدلية' },
    cafeteria: { en: 'Cafeteria / Restaurant', ar: 'كافتيريا / مطعم' },
    textile: { en: 'Textile / Garments', ar: 'نسيج / ملابس' },
    auto_parts: { en: 'Auto Parts', ar: 'قطع غيار سيارات' },
    general: { en: 'General Trading', ar: 'تجارة عامة' },
  };
  
  return names[type.toLowerCase()]?.[language] || type;
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(level: string): string {
  const colors: Record<string, string> = {
    LOW: 'green',
    MEDIUM: 'yellow',
    HIGH: 'orange',
    VERY_HIGH: 'red',
    CRITICAL: 'red',
  };
  return colors[level.toUpperCase()] || 'gray';
}

/**
 * Get health level color
 */
export function getHealthLevelColor(level: string): string {
  const colors: Record<string, string> = {
    EXCELLENT: 'green',
    GOOD: 'blue',
    FAIR: 'yellow',
    POOR: 'orange',
    CRITICAL: 'red',
  };
  return colors[level.toUpperCase()] || 'gray';
}

/**
 * Get health status color (alias for getHealthLevelColor)
 */
export function getHealthStatusColor(level: string): string {
  return getHealthLevelColor(level);
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    IMMEDIATE: 'red',
    CRITICAL: 'red',
    URGENT: 'orange',
    HIGH: 'orange',
    MEDIUM: 'yellow',
    NORMAL: 'yellow',
    LOW: 'green',
  };
  return colors[priority.toUpperCase()] || 'gray';
}

/**
 * Format date for UAE locale
 */
export function formatDateUAE(
  date: string | Date,
  options: {
    includeTime?: boolean;
    language?: 'en' | 'ar';
  } = {}
): string {
  const { includeTime = false, language = 'en' } = options;
  const locale = language === 'ar' ? 'ar-AE' : 'en-AE';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }
  
  return d.toLocaleDateString(locale, dateOptions);
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: string | Date, language: 'en' | 'ar' = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (language === 'ar') {
    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    return `منذ ${Math.floor(diffDays / 30)} أشهر`;
  }
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

/**
 * Get UAE seasonal factor for a date
 */
export function getSeasonalFactor(date: Date = new Date()): {
  season: string;
  factor: number;
  description: string;
  description_ar: string;
} {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Summer (June-August)
  if (month >= 6 && month <= 8) {
    return {
      season: 'summer',
      factor: 0.7,
      description: 'Summer slowdown (-30%)',
      description_ar: 'تباطؤ الصيف (-30%)',
    };
  }
  
  // Dubai Shopping Festival (Dec 15 - Jan 29)
  if ((month === 12 && day >= 15) || (month === 1 && day <= 29)) {
    return {
      season: 'dsf',
      factor: 1.2,
      description: 'Dubai Shopping Festival (+20%)',
      description_ar: 'مهرجان دبي للتسوق (+20%)',
    };
  }
  
  // UAE National Day (Dec 1-3)
  if (month === 12 && day >= 1 && day <= 3) {
    return {
      season: 'national_day',
      factor: 1.15,
      description: 'UAE National Day (+15%)',
      description_ar: 'اليوم الوطني الإماراتي (+15%)',
    };
  }
  
  return {
    season: 'normal',
    factor: 1.0,
    description: 'Normal season',
    description_ar: 'موسم عادي',
  };
}

/**
 * Get day of week name
 */
export function getDayName(dayIndex: number, language: 'en' | 'ar' = 'en'): string {
  const days: Record<number, { en: string; ar: string }> = {
    0: { en: 'Monday', ar: 'الإثنين' },
    1: { en: 'Tuesday', ar: 'الثلاثاء' },
    2: { en: 'Wednesday', ar: 'الأربعاء' },
    3: { en: 'Thursday', ar: 'الخميس' },
    4: { en: 'Friday', ar: 'الجمعة' },
    5: { en: 'Saturday', ar: 'السبت' },
    6: { en: 'Sunday', ar: 'الأحد' },
  };
  return days[dayIndex]?.[language] || '';
}

/**
 * Check if date is UAE weekend (Saturday-Sunday since 2022)
 */
export function isUAEWeekend(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): {
  change: number;
  direction: 'up' | 'down' | 'stable';
  formatted: string;
} {
  if (previous === 0) {
    return {
      change: current > 0 ? 100 : 0,
      direction: current > 0 ? 'up' : 'stable',
      formatted: current > 0 ? '+100%' : '0%',
    };
  }
  
  const change = ((current - previous) / previous) * 100;
  const direction = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';
  const formatted = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  
  return { change, direction, formatted };
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get score emoji
 */
export function getScoreEmoji(score: number): string {
  if (score >= 80) return '🟢';
  if (score >= 60) return '🔵';
  if (score >= 40) return '🟡';
  if (score >= 20) return '🟠';
  return '🔴';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
