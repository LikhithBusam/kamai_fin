/**
 * SMS Transaction Parser
 * Parses bank SMS messages to extract transaction data automatically
 * Supports major Indian banks: HDFC, ICICI, SBI, Axis, Kotak, PNB, etc.
 */

export interface ParsedSMSTransaction {
  amount: number;
  type: 'income' | 'expense';
  date: string;
  time?: string;
  balance?: number;
  merchant?: string;
  bankName: string;
  upiId?: string;
  accountLastDigits?: string;
  referenceNumber?: string;
  raw: string;
}

export interface SMSParseResult {
  success: boolean;
  transaction?: ParsedSMSTransaction;
  error?: string;
}

// Bank patterns for identification
const bankPatterns: Record<string, RegExp[]> = {
  'HDFC': [/HDFC/i, /HDFCBK/i],
  'ICICI': [/ICICI/i, /ICICIB/i],
  'SBI': [/SBI/i, /STATE BANK/i],
  'Axis': [/AXIS/i, /AXISBANK/i],
  'Kotak': [/KOTAK/i, /KOTAKB/i],
  'PNB': [/PNB/i, /PUNJAB NATIONAL/i],
  'BOB': [/BOB/i, /BANK OF BARODA/i],
  'Canara': [/CANARA/i, /CANARAB/i],
  'Union': [/UNION/i, /UNIONB/i],
  'IDBI': [/IDBI/i],
  'Yes': [/YES BANK/i, /YESB/i],
  'IndusInd': [/INDUSIND/i],
  'Paytm': [/PAYTM/i],
  'PhonePe': [/PHONEPE/i],
  'GPay': [/GPAY/i, /GOOGLE PAY/i],
};

// Amount extraction patterns
const amountPatterns = [
  /Rs\.?\s*([0-9,]+(?:\.[0-9]{2})?)/i,
  /INR\.?\s*([0-9,]+(?:\.[0-9]{2})?)/i,
  /₹\s*([0-9,]+(?:\.[0-9]{2})?)/i,
  /Rupees?\s*([0-9,]+(?:\.[0-9]{2})?)/i,
];

// Transaction type patterns
const creditPatterns = [
  /credited/i,
  /received/i,
  /deposited/i,
  /added/i,
  /cr\b/i,
  /refund/i,
  /cashback/i,
];

const debitPatterns = [
  /debited/i,
  /withdrawn/i,
  /paid/i,
  /spent/i,
  /dr\b/i,
  /purchase/i,
  /transferred to/i,
  /sent to/i,
];

// Balance patterns
const balancePatterns = [
  /(?:bal|balance)[:\s]*(?:Rs\.?|INR\.?|₹)?\s*([0-9,]+(?:\.[0-9]{2})?)/i,
  /(?:avl|available)[:\s]*(?:Rs\.?|INR\.?|₹)?\s*([0-9,]+(?:\.[0-9]{2})?)/i,
];

// Account number patterns
const accountPatterns = [
  /(?:a\/c|ac|acct|account)[:\s]*(?:no\.?\s*)?(?:XX|xx|\*+)?(\d{4})/i,
  /(?:ending|linked)\s*(?:with\s*)?(\d{4})/i,
  /XX(\d{4})/i,
];

// UPI ID patterns
const upiPatterns = [
  /([a-zA-Z0-9._-]+@[a-zA-Z0-9]+)/,
  /(?:UPI|VPA)[:\s]*([a-zA-Z0-9._@-]+)/i,
];

// Merchant/recipient patterns
const merchantPatterns = [
  /(?:to|from|at|by)\s+([A-Za-z0-9\s]+?)(?:\s+on|\s+ref|\s+UPI|$)/i,
  /(?:paid to|received from|credited by)\s+([A-Za-z0-9\s]+)/i,
];

// Reference number patterns
const referencePatterns = [
  /(?:ref|txn|transaction)[:\s#]*([A-Za-z0-9]+)/i,
  /(?:UPI)[:\s]*([0-9]+)/i,
];

/**
 * Detect bank name from SMS content
 */
function detectBank(sms: string): string {
  for (const [bankName, patterns] of Object.entries(bankPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(sms)) {
        return bankName;
      }
    }
  }
  return 'Unknown';
}

/**
 * Extract amount from SMS
 */
function extractAmount(sms: string): number | null {
  for (const pattern of amountPatterns) {
    const match = sms.match(pattern);
    if (match) {
      const amountStr = match[1].replace(/,/g, '');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  return null;
}

/**
 * Determine transaction type (credit/debit)
 */
function determineType(sms: string): 'income' | 'expense' | null {
  for (const pattern of creditPatterns) {
    if (pattern.test(sms)) {
      return 'income';
    }
  }
  for (const pattern of debitPatterns) {
    if (pattern.test(sms)) {
      return 'expense';
    }
  }
  return null;
}

/**
 * Extract balance from SMS
 */
function extractBalance(sms: string): number | null {
  for (const pattern of balancePatterns) {
    const match = sms.match(pattern);
    if (match) {
      const balanceStr = match[1].replace(/,/g, '');
      const balance = parseFloat(balanceStr);
      if (!isNaN(balance)) {
        return balance;
      }
    }
  }
  return null;
}

/**
 * Extract account last digits
 */
function extractAccountDigits(sms: string): string | null {
  for (const pattern of accountPatterns) {
    const match = sms.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Extract UPI ID
 */
function extractUPI(sms: string): string | null {
  for (const pattern of upiPatterns) {
    const match = sms.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Extract merchant/recipient name
 */
function extractMerchant(sms: string): string | null {
  for (const pattern of merchantPatterns) {
    const match = sms.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * Extract reference number
 */
function extractReference(sms: string): string | null {
  for (const pattern of referencePatterns) {
    const match = sms.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Parse a single SMS message
 */
export function parseSMS(sms: string): SMSParseResult {
  if (!sms || sms.trim().length < 10) {
    return {
      success: false,
      error: 'SMS too short or empty',
    };
  }

  const amount = extractAmount(sms);
  if (!amount) {
    return {
      success: false,
      error: 'Could not extract amount from SMS',
    };
  }

  const type = determineType(sms);
  if (!type) {
    return {
      success: false,
      error: 'Could not determine if this is income or expense',
    };
  }

  const bankName = detectBank(sms);
  const balance = extractBalance(sms);
  const accountLastDigits = extractAccountDigits(sms);
  const upiId = extractUPI(sms);
  const merchant = extractMerchant(sms);
  const referenceNumber = extractReference(sms);

  // Use current date/time
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].substring(0, 5);

  return {
    success: true,
    transaction: {
      amount,
      type,
      date,
      time,
      balance: balance || undefined,
      bankName,
      accountLastDigits: accountLastDigits || undefined,
      upiId: upiId || undefined,
      merchant: merchant || undefined,
      referenceNumber: referenceNumber || undefined,
      raw: sms,
    },
  };
}

/**
 * Parse multiple SMS messages (separated by newlines)
 */
export function parseMultipleSMS(smsText: string): ParsedSMSTransaction[] {
  const messages = smsText
    .split(/\n\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  const transactions: ParsedSMSTransaction[] = [];

  for (const sms of messages) {
    const result = parseSMS(sms);
    if (result.success && result.transaction) {
      transactions.push(result.transaction);
    }
  }

  return transactions;
}

/**
 * Categorize transaction based on merchant/description
 */
export function categorizeTransaction(transaction: ParsedSMSTransaction): string {
  const merchant = (transaction.merchant || '').toLowerCase();
  const raw = transaction.raw.toLowerCase();

  // Food & Dining
  if (/swiggy|zomato|dominos|pizza|restaurant|food|cafe|hotel/i.test(raw)) {
    return 'Food';
  }

  // Transport
  if (/uber|ola|rapido|metro|railway|irctc|petrol|fuel|diesel/i.test(raw)) {
    return 'Transport';
  }

  // Shopping
  if (/amazon|flipkart|myntra|ajio|shopping|mall|store/i.test(raw)) {
    return 'Shopping';
  }

  // Bills & Utilities
  if (/electricity|water|gas|broadband|wifi|phone|mobile|recharge/i.test(raw)) {
    return 'Bills';
  }

  // Rent
  if (/rent|lease|housing/i.test(raw)) {
    return 'Rent';
  }

  // Health
  if (/hospital|medical|pharmacy|medicine|doctor|clinic/i.test(raw)) {
    return 'Health';
  }

  // Entertainment
  if (/netflix|spotify|hotstar|prime|movie|theatre/i.test(raw)) {
    return 'Entertainment';
  }

  // ATM
  if (/atm|cash\s*withdrawal/i.test(raw)) {
    return 'Cash';
  }

  // Salary/Income
  if (transaction.type === 'income') {
    if (/salary|wage|payment\s*received/i.test(raw)) {
      return 'Salary';
    }
    return 'Income';
  }

  return 'Other';
}
