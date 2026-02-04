// StoreBuddy UAE - Internationalization (i18n)
// Supports: English (en), Arabic (ar), Hindi (hi), Urdu (ur)

export type Language = 'en' | 'ar' | 'hi' | 'ur';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
    hi: string;
    ur: string;
  };
}

export const translations: Translations = {
  // ===== APP GENERAL =====
  'app.name': {
    en: 'StoreBuddy UAE',
    ar: 'ستور بادي الإمارات',
    hi: 'स्टोरबडी यूएई',
    ur: 'اسٹور بڈی یو اے ای',
  },
  'app.tagline': {
    en: 'Your AI Financial Companion',
    ar: 'مرافقك المالي الذكي',
    hi: 'आपका AI वित्तीय साथी',
    ur: 'آپ کا AI مالی ساتھی',
  },
  
  // ===== NAVIGATION =====
  'nav.dashboard': {
    en: 'Dashboard',
    ar: 'لوحة التحكم',
    hi: 'डैशबोर्ड',
    ur: 'ڈیش بورڈ',
  },
  'nav.transactions': {
    en: 'Transactions',
    ar: 'المعاملات',
    hi: 'लेन-देन',
    ur: 'لین دین',
  },
  'nav.credit': {
    en: 'Credit Book',
    ar: 'دفتر الائتمان',
    hi: 'उधार बुक',
    ur: 'ادھار بک',
  },
  'nav.vat': {
    en: 'VAT',
    ar: 'ضريبة القيمة المضافة',
    hi: 'वैट',
    ur: 'وی اے ٹی',
  },
  'nav.health': {
    en: 'Business Health',
    ar: 'صحة الأعمال',
    hi: 'व्यापार स्वास्थ्य',
    ur: 'کاروباری صحت',
  },
  'nav.inventory': {
    en: 'Inventory',
    ar: 'المخزون',
    hi: 'इन्वेंटरी',
    ur: 'انوینٹری',
  },
  'nav.programs': {
    en: 'UAE Programs',
    ar: 'برامج الإمارات',
    hi: 'यूएई कार्यक्रम',
    ur: 'یو اے ای پروگرام',
  },
  'nav.analytics': {
    en: 'Analytics',
    ar: 'التحليلات',
    hi: 'विश्लेषण',
    ur: 'تجزیات',
  },
  'nav.settings': {
    en: 'Settings',
    ar: 'الإعدادات',
    hi: 'सेटिंग्स',
    ur: 'ترتیبات',
  },
  
  // ===== DASHBOARD =====
  'dashboard.welcome': {
    en: 'Welcome back',
    ar: 'مرحباً بعودتك',
    hi: 'वापसी पर स्वागत है',
    ur: 'واپسی پر خوش آمدید',
  },
  'dashboard.todaySales': {
    en: "Today's Sales",
    ar: 'مبيعات اليوم',
    hi: 'आज की बिक्री',
    ur: 'آج کی فروخت',
  },
  'dashboard.creditOutstanding': {
    en: 'Credit Outstanding',
    ar: 'الائتمان المستحق',
    hi: 'बकाया उधार',
    ur: 'واجب الادا ادھار',
  },
  'dashboard.monthlyProfit': {
    en: 'Monthly Profit',
    ar: 'الربح الشهري',
    hi: 'मासिक लाभ',
    ur: 'ماہانہ منافع',
  },
  'dashboard.vatDue': {
    en: 'VAT Due',
    ar: 'ضريبة مستحقة',
    hi: 'देय वैट',
    ur: 'واجب الادا وی اے ٹی',
  },
  'dashboard.healthScore': {
    en: 'Health Score',
    ar: 'درجة الصحة',
    hi: 'स्वास्थ्य स्कोर',
    ur: 'صحت سکور',
  },
  
  // ===== CREDIT =====
  'credit.title': {
    en: 'Credit Book',
    ar: 'دفتر الائتمان',
    hi: 'उधार बुक',
    ur: 'ادھار بک',
  },
  'credit.trustScore': {
    en: 'Trust Score',
    ar: 'درجة الثقة',
    hi: 'विश्वास स्कोर',
    ur: 'اعتماد سکور',
  },
  'credit.outstanding': {
    en: 'Outstanding',
    ar: 'مستحق',
    hi: 'बकाया',
    ur: 'واجب الادا',
  },
  'credit.overdue': {
    en: 'Overdue',
    ar: 'متأخر',
    hi: 'अतिदेय',
    ur: 'تاخیر شدہ',
  },
  'credit.collectNow': {
    en: 'Collect Now',
    ar: 'حصّل الآن',
    hi: 'अभी वसूल करें',
    ur: 'ابھی وصول کریں',
  },
  'credit.addCredit': {
    en: 'Give Credit',
    ar: 'أعط ائتمان',
    hi: 'उधार दें',
    ur: 'ادھار دیں',
  },
  'credit.receivePayment': {
    en: 'Receive Payment',
    ar: 'استلم دفعة',
    hi: 'भुगतान प्राप्त करें',
    ur: 'ادائیگی وصول کریں',
  },
  
  // ===== VAT =====
  'vat.title': {
    en: 'VAT Management',
    ar: 'إدارة ضريبة القيمة المضافة',
    hi: 'वैट प्रबंधन',
    ur: 'وی اے ٹی انتظام',
  },
  'vat.rate': {
    en: '5% VAT',
    ar: '5% ضريبة',
    hi: '5% वैट',
    ur: '5% وی اے ٹی',
  },
  'vat.outputVat': {
    en: 'Output VAT',
    ar: 'ضريبة المخرجات',
    hi: 'आउटपुट वैट',
    ur: 'آؤٹ پٹ وی اے ٹی',
  },
  'vat.inputVat': {
    en: 'Input VAT',
    ar: 'ضريبة المدخلات',
    hi: 'इनपुट वैट',
    ur: 'ان پٹ وی اے ٹی',
  },
  'vat.netVat': {
    en: 'Net VAT',
    ar: 'صافي الضريبة',
    hi: 'शुद्ध वैट',
    ur: 'خالص وی اے ٹی',
  },
  'vat.payable': {
    en: 'Payable',
    ar: 'مستحق الدفع',
    hi: 'देय',
    ur: 'قابل ادائیگی',
  },
  'vat.refundable': {
    en: 'Refundable',
    ar: 'قابل للاسترداد',
    hi: 'वापसी योग्य',
    ur: 'واپسی قابل',
  },
  'vat.trn': {
    en: 'Tax Registration Number',
    ar: 'رقم التسجيل الضريبي',
    hi: 'कर पंजीकरण संख्या',
    ur: 'ٹیکس رجسٹریشن نمبر',
  },
  'vat.filingDeadline': {
    en: 'Filing Deadline',
    ar: 'موعد تقديم الإقرار',
    hi: 'दाखिल करने की समय सीमा',
    ur: 'فائلنگ کی آخری تاریخ',
  },
  
  // ===== BUSINESS HEALTH =====
  'health.title': {
    en: 'Business Health',
    ar: 'صحة الأعمال',
    hi: 'व्यापार स्वास्थ्य',
    ur: 'کاروباری صحت',
  },
  'health.excellent': {
    en: 'Excellent',
    ar: 'ممتاز',
    hi: 'उत्कृष्ट',
    ur: 'بہترین',
  },
  'health.good': {
    en: 'Good',
    ar: 'جيد',
    hi: 'अच्छा',
    ur: 'اچھا',
  },
  'health.fair': {
    en: 'Fair',
    ar: 'متوسط',
    hi: 'ठीक',
    ur: 'ٹھیک',
  },
  'health.poor': {
    en: 'Poor',
    ar: 'ضعيف',
    hi: 'खराब',
    ur: 'خراب',
  },
  'health.critical': {
    en: 'Critical',
    ar: 'حرج',
    hi: 'गंभीर',
    ur: 'نازک',
  },
  'health.profitability': {
    en: 'Profitability',
    ar: 'الربحية',
    hi: 'लाभप्रदता',
    ur: 'منافع بخشی',
  },
  'health.liquidity': {
    en: 'Liquidity',
    ar: 'السيولة',
    hi: 'तरलता',
    ur: 'لیکویڈیٹی',
  },
  'health.creditHealth': {
    en: 'Credit Health',
    ar: 'صحة الائتمان',
    hi: 'क्रेडिट स्वास्थ्य',
    ur: 'کریڈٹ صحت',
  },
  'health.expenseControl': {
    en: 'Expense Control',
    ar: 'التحكم بالنفقات',
    hi: 'खर्च नियंत्रण',
    ur: 'اخراجات کنٹرول',
  },
  'health.growth': {
    en: 'Growth',
    ar: 'النمو',
    hi: 'विकास',
    ur: 'ترقی',
  },
  
  // ===== INVENTORY =====
  'inventory.title': {
    en: 'Inventory & Reorder',
    ar: 'المخزون وإعادة الطلب',
    hi: 'इन्वेंटरी और पुनः ऑर्डर',
    ur: 'انوینٹری اور ری آرڈر',
  },
  'inventory.reorderAlert': {
    en: 'Reorder Alert',
    ar: 'تنبيه إعادة الطلب',
    hi: 'पुनः ऑर्डर अलर्ट',
    ur: 'ری آرڈر الرٹ',
  },
  'inventory.lowStock': {
    en: 'Low Stock',
    ar: 'مخزون منخفض',
    hi: 'कम स्टॉक',
    ur: 'کم اسٹاک',
  },
  'inventory.orderNow': {
    en: 'Order Now',
    ar: 'اطلب الآن',
    hi: 'अभी ऑर्डर करें',
    ur: 'ابھی آرڈر کریں',
  },
  'inventory.daysUntilStockout': {
    en: 'Days until stockout',
    ar: 'أيام حتى نفاد المخزون',
    hi: 'स्टॉकआउट तक के दिन',
    ur: 'اسٹاک ختم ہونے تک دن',
  },
  
  // ===== UAE PROGRAMS =====
  'programs.title': {
    en: 'UAE SME Programs',
    ar: 'برامج المشاريع الصغيرة والمتوسطة',
    hi: 'यूएई एसएमई कार्यक्रम',
    ur: 'یو اے ای ایس ایم ای پروگرام',
  },
  'programs.eligible': {
    en: 'You may be eligible for',
    ar: 'قد تكون مؤهلاً لـ',
    hi: 'आप इसके लिए पात्र हो सकते हैं',
    ur: 'آپ اس کے اہل ہو سکتے ہیں',
  },
  'programs.fundingAvailable': {
    en: 'Funding Available',
    ar: 'تمويل متاح',
    hi: 'फंडिंग उपलब्ध',
    ur: 'فنڈنگ دستیاب',
  },
  'programs.applyNow': {
    en: 'Apply Now',
    ar: 'قدّم الآن',
    hi: 'अभी आवेदन करें',
    ur: 'ابھی درخواست دیں',
  },
  'programs.learnMore': {
    en: 'Learn More',
    ar: 'اعرف أكثر',
    hi: 'और जानें',
    ur: 'مزید جانیں',
  },
  
  // ===== RECOMMENDATIONS =====
  'recommendations.title': {
    en: 'Today\'s Recommendations',
    ar: 'توصيات اليوم',
    hi: 'आज की सिफारिशें',
    ur: 'آج کی سفارشات',
  },
  'recommendations.urgent': {
    en: 'Urgent',
    ar: 'عاجل',
    hi: 'जरूरी',
    ur: 'فوری',
  },
  'recommendations.potentialImpact': {
    en: 'Potential Impact',
    ar: 'التأثير المحتمل',
    hi: 'संभावित प्रभाव',
    ur: 'ممکنہ اثر',
  },
  
  // ===== COMMON ACTIONS =====
  'action.save': {
    en: 'Save',
    ar: 'حفظ',
    hi: 'सहेजें',
    ur: 'محفوظ کریں',
  },
  'action.cancel': {
    en: 'Cancel',
    ar: 'إلغاء',
    hi: 'रद्द करें',
    ur: 'منسوخ کریں',
  },
  'action.delete': {
    en: 'Delete',
    ar: 'حذف',
    hi: 'हटाएं',
    ur: 'حذف کریں',
  },
  'action.edit': {
    en: 'Edit',
    ar: 'تعديل',
    hi: 'संपादित करें',
    ur: 'ترمیم کریں',
  },
  'action.add': {
    en: 'Add',
    ar: 'إضافة',
    hi: 'जोड़ें',
    ur: 'شامل کریں',
  },
  'action.view': {
    en: 'View',
    ar: 'عرض',
    hi: 'देखें',
    ur: 'دیکھیں',
  },
  'action.refresh': {
    en: 'Refresh',
    ar: 'تحديث',
    hi: 'रिफ्रेश',
    ur: 'ریفریش',
  },
  'action.export': {
    en: 'Export',
    ar: 'تصدير',
    hi: 'निर्यात',
    ur: 'برآمد',
  },
  
  // ===== TIME =====
  'time.today': {
    en: 'Today',
    ar: 'اليوم',
    hi: 'आज',
    ur: 'آج',
  },
  'time.yesterday': {
    en: 'Yesterday',
    ar: 'أمس',
    hi: 'कल',
    ur: 'کل',
  },
  'time.thisWeek': {
    en: 'This Week',
    ar: 'هذا الأسبوع',
    hi: 'इस सप्ताह',
    ur: 'اس ہفتے',
  },
  'time.thisMonth': {
    en: 'This Month',
    ar: 'هذا الشهر',
    hi: 'इस महीने',
    ur: 'اس مہینے',
  },
  'time.thisQuarter': {
    en: 'This Quarter',
    ar: 'هذا الربع',
    hi: 'इस तिमाही',
    ur: 'اس سہ ماہی',
  },
  'time.thisYear': {
    en: 'This Year',
    ar: 'هذا العام',
    hi: 'इस साल',
    ur: 'اس سال',
  },
  
  // ===== EMIRATES =====
  'emirate.dubai': {
    en: 'Dubai',
    ar: 'دبي',
    hi: 'दुबई',
    ur: 'دبئی',
  },
  'emirate.abuDhabi': {
    en: 'Abu Dhabi',
    ar: 'أبو ظبي',
    hi: 'अबू धाबी',
    ur: 'ابو ظہبی',
  },
  'emirate.sharjah': {
    en: 'Sharjah',
    ar: 'الشارقة',
    hi: 'शारजाह',
    ur: 'شارجہ',
  },
  'emirate.ajman': {
    en: 'Ajman',
    ar: 'عجمان',
    hi: 'अजमान',
    ur: 'عجمان',
  },
  'emirate.rak': {
    en: 'Ras Al Khaimah',
    ar: 'رأس الخيمة',
    hi: 'रास अल खैमाह',
    ur: 'راس الخیمہ',
  },
  'emirate.fujairah': {
    en: 'Fujairah',
    ar: 'الفجيرة',
    hi: 'फुजैराह',
    ur: 'فجیرہ',
  },
  'emirate.uaq': {
    en: 'Umm Al Quwain',
    ar: 'أم القيوين',
    hi: 'उम्म अल कुवैन',
    ur: 'ام القیوین',
  },
};

/**
 * Get translation for a key in specified language
 */
export function t(key: string, language: Language = 'en'): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }
  return translation[language] || translation.en || key;
}

/**
 * Check if language is RTL
 */
export function isRTL(language: Language): boolean {
  return language === 'ar' || language === 'ur';
}

/**
 * Get direction for language
 */
export function getDirection(language: Language): 'ltr' | 'rtl' {
  return isRTL(language) ? 'rtl' : 'ltr';
}

/**
 * Get font family for language
 */
export function getFontFamily(language: Language): string {
  if (language === 'ar') return 'Cairo, Noto Sans Arabic, sans-serif';
  if (language === 'ur') return 'Noto Nastaliq Urdu, Noto Sans Arabic, sans-serif';
  if (language === 'hi') return 'Noto Sans Devanagari, sans-serif';
  return 'Inter, system-ui, sans-serif';
}

export default t;
