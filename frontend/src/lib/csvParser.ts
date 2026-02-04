/**
 * PRODUCTION-GRADE CSV Parser for Bank Statements
 * Supports manual CSV exports from any bank
 */

export interface CSVTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
}

export interface CSVParseResult {
  transactions: CSVTransaction[];
  error?: string;
}

// Parse CSV file content
export async function parseCSV(file: File): Promise<CSVParseResult> {
  try {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      return { transactions: [], error: 'Empty CSV file' };
    }

    // Detect delimiter (comma, semicolon, or tab)
    const delimiter = detectDelimiter(lines[0]);

    // Parse header to find column indices
    const header = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    const columnMap = mapColumns(header);

    if (!columnMap.date || !columnMap.amount) {
      return {
        transactions: [],
        error: 'CSV must have Date and Amount columns. Supported headers: Date, Amount, Description, Type, Credit, Debit'
      };
    }

    const transactions: CSVTransaction[] = [];

    // Parse each row
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map(cell => cell.trim());

      if (row.length < 2) continue; // Skip invalid rows

      try {
        const transaction = parseRow(row, columnMap);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (err) {
        console.warn(`Skipping row ${i + 1}:`, err);
      }
    }

    return { transactions };
  } catch (error) {
    return {
      transactions: [],
      error: error instanceof Error ? error.message : 'Failed to parse CSV'
    };
  }
}

// Detect CSV delimiter
function detectDelimiter(line: string): string {
  const commaCount = (line.match(/,/g) || []).length;
  const semicolonCount = (line.match(/;/g) || []).length;
  const tabCount = (line.match(/\t/g) || []).length;

  if (tabCount > 0) return '\t';
  if (semicolonCount > commaCount) return ';';
  return ',';
}

// Map column headers to indices
function mapColumns(header: string[]): Record<string, number> {
  const map: Record<string, number> = {};

  header.forEach((col, index) => {
    const lower = col.toLowerCase().replace(/[^a-z]/g, '');

    // Date column
    if (lower.includes('date') || lower === 'txndate' || lower === 'transactiondate') {
      map.date = index;
    }

    // Description column
    if (lower.includes('description') || lower.includes('narration') || lower.includes('particular')) {
      map.description = index;
    }

    // Amount column
    if (lower === 'amount' || lower === 'txnamount') {
      map.amount = index;
    }

    // Credit/Debit columns
    if (lower === 'credit' || lower === 'cr' || lower === 'deposit') {
      map.credit = index;
    }

    if (lower === 'debit' || lower === 'dr' || lower === 'withdrawal') {
      map.debit = index;
    }

    // Type column
    if (lower === 'type' || lower === 'transactiontype') {
      map.type = index;
    }

    // Category column
    if (lower === 'category' || lower === 'tag') {
      map.category = index;
    }
  });

  return map;
}

// Parse a single row
function parseRow(row: string[], columnMap: Record<string, number>): CSVTransaction | null {
  // Parse date
  const dateStr = row[columnMap.date];
  const date = parseDate(dateStr);
  if (!date) return null;

  // Parse description
  const description = columnMap.description !== undefined
    ? row[columnMap.description] || 'Transaction'
    : 'Transaction';

  // Parse amount and type
  let amount: number;
  let type: 'income' | 'expense';

  if (columnMap.credit !== undefined && columnMap.debit !== undefined) {
    // Separate Credit/Debit columns
    const credit = parseFloat(row[columnMap.credit]?.replace(/[^\d.]/g, '') || '0');
    const debit = parseFloat(row[columnMap.debit]?.replace(/[^\d.]/g, '') || '0');

    if (credit > 0) {
      amount = credit;
      type = 'income';
    } else if (debit > 0) {
      amount = debit;
      type = 'expense';
    } else {
      return null; // Skip zero amounts
    }
  } else if (columnMap.amount !== undefined) {
    // Single amount column
    const amountStr = row[columnMap.amount];
    const parsedAmount = parseFloat(amountStr.replace(/[^\d.-]/g, ''));

    if (isNaN(parsedAmount) || parsedAmount === 0) return null;

    amount = Math.abs(parsedAmount);

    // Determine type from amount sign or type column
    if (columnMap.type !== undefined) {
      const typeStr = row[columnMap.type].toLowerCase();
      type = typeStr.includes('credit') || typeStr.includes('deposit') ? 'income' : 'expense';
    } else {
      type = parsedAmount > 0 ? 'income' : 'expense';
    }
  } else {
    return null;
  }

  // Parse category
  const category = columnMap.category !== undefined
    ? row[columnMap.category] || categorize(description, type)
    : categorize(description, type);

  return { date, description, amount, type, category };
}

// Parse date from various formats
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;

  // Try DD/MM/YYYY, DD-MM-YYYY
  let match = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    const year = match[3];
    return `${year}-${month}-${day}`;
  }

  // Try YYYY-MM-DD (ISO)
  match = dateStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (match) {
    const year = match[1];
    const month = match[2].padStart(2, '0');
    const day = match[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Try DD Mon YYYY
  match = dateStr.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
  if (match) {
    const monthMap: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const day = match[1].padStart(2, '0');
    const month = monthMap[match[2].toLowerCase()];
    const year = match[3];
    return `${year}-${month}-${day}`;
  }

  return null;
}

// Simple categorization
function categorize(description: string, type: 'income' | 'expense'): string {
  const lower = description.toLowerCase();

  if (type === 'income') {
    if (lower.includes('salary')) return 'Salary';
    if (lower.includes('interest')) return 'Interest';
    return 'Other Income';
  }

  if (lower.includes('atm') || lower.includes('cash')) return 'ATM Withdrawal';
  if (lower.includes('upi') || lower.includes('gpay') || lower.includes('paytm')) return 'UPI Payment';
  if (lower.includes('swiggy') || lower.includes('zomato')) return 'Food & Dining';
  if (lower.includes('uber') || lower.includes('ola') || lower.includes('rapido')) return 'Transportation';
  if (lower.includes('amazon') || lower.includes('flipkart')) return 'Shopping';
  if (lower.includes('netflix') || lower.includes('spotify')) return 'Entertainment';
  if (lower.includes('rent')) return 'Rent';
  if (lower.includes('electricity') || lower.includes('water') || lower.includes('gas')) return 'Utilities';

  return 'Other Expense';
}
