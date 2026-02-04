/**
 * Quick Transaction Input
 * WhatsApp-style fast input for transactions
 * Just type "500 swiggy" or "earned 1000 uber" and it auto-parses
 */

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Plus, Minus, Loader2, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import db from '@/services/database';

interface QuickTransactionInputProps {
  onSuccess?: () => void;
  placeholder?: string;
}

// Keywords for income detection
const incomeKeywords = [
  'earned', 'received', 'got', 'salary', 'payment', 'credit', 'credited',
  'income', 'bonus', 'tip', 'tips', 'cashback', 'refund', 'mila', 'aaya'
];

// Keywords for expense detection
const expenseKeywords = [
  'spent', 'paid', 'bought', 'expense', 'debit', 'debited', 'purchase',
  'bill', 'rent', 'emi', 'fuel', 'petrol', 'diesel', 'kharch', 'diya'
];

// Category detection patterns
const categoryPatterns: Record<string, RegExp[]> = {
  'Food': [/swiggy|zomato|food|lunch|dinner|breakfast|chai|coffee|restaurant|hotel/i],
  'Transport': [/uber|ola|rapido|petrol|diesel|fuel|metro|auto|cab|taxi/i],
  'Shopping': [/amazon|flipkart|myntra|shopping|clothes|shoes/i],
  'Bills': [/electricity|water|gas|wifi|broadband|phone|mobile|recharge/i],
  'Rent': [/rent|lease|housing|room/i],
  'Health': [/medicine|medical|doctor|hospital|pharmacy/i],
  'Entertainment': [/movie|netflix|spotify|hotstar|game/i],
  'Salary': [/salary|wage|payment|client/i],
  'Delivery': [/swiggy\s*delivery|zomato\s*delivery|uber\s*eats|delivery\s*earning/i],
  'Ride': [/uber\s*ride|ola\s*ride|rapido\s*ride|ride\s*earning/i],
};

interface ParsedInput {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  confidence: number;
}

const parseQuickInput = (input: string): ParsedInput | null => {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  // Extract amount (look for numbers)
  const amountMatch = trimmed.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  if (isNaN(amount) || amount <= 0) return null;

  // Determine type based on keywords
  let type: 'income' | 'expense' = 'expense'; // Default to expense
  let confidence = 0.7;

  for (const keyword of incomeKeywords) {
    if (trimmed.includes(keyword)) {
      type = 'income';
      confidence = 0.9;
      break;
    }
  }

  for (const keyword of expenseKeywords) {
    if (trimmed.includes(keyword)) {
      type = 'expense';
      confidence = 0.9;
      break;
    }
  }

  // If amount is large (>5000) and no clear keywords, likely income
  if (amount > 5000 && confidence < 0.9) {
    type = 'income';
    confidence = 0.6;
  }

  // Detect category
  let category = type === 'income' ? 'Income' : 'Other';
  for (const [cat, patterns] of Object.entries(categoryPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(trimmed)) {
        category = cat;
        break;
      }
    }
  }

  // Generate description from remaining text
  const description = trimmed
    .replace(amountMatch[0], '')
    .replace(/[AED $]/g, '')
    .replace(/\b(rs|rupees?|inr)\b/gi, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 100);

  return {
    amount,
    type,
    category,
    description: description || `${type === 'income' ? 'Earned' : 'Spent'} AED ${amount}`,
    confidence,
  };
};

export const QuickTransactionInput = ({ onSuccess, placeholder }: QuickTransactionInputProps) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<ParsedInput | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Parse input on change for preview
  useEffect(() => {
    if (input.length > 2) {
      const parsed = parseQuickInput(input);
      setPreview(parsed);
    } else {
      setPreview(null);
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!preview || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const today = new Date();

      await db.transactions.create({
        transaction_date: today.toISOString().split('T')[0],
        transaction_time: today.toTimeString().split(' ')[0].substring(0, 5),
        amount: preview.amount,
        transaction_type: preview.type,
        category: preview.category,
        description: preview.description,
        source: 'Quick Input',
      });

      toast({
        title: `${preview.type === 'income' ? 'Income' : 'Expense'} Added`,
        description: `AED ${preview.amount.toLocaleString('en-AE')} - ${preview.category}`,
      });

      setInput('');
      setPreview(null);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && preview) {
      handleSubmit();
    }
  };

  // Voice input (Web Speech API)
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Voice input is not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-AE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: 'Voice Error',
        description: 'Could not recognize speech',
        variant: 'destructive',
      });
    };

    recognition.start();
  };

  return (
    <div className="space-y-2">
      {/* Input Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Type: "500 swiggy" or "earned 1000 uber"'}
            className="pr-10 h-11 text-[14px]"
            disabled={isSubmitting}
          />
          {preview && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {preview.type === 'income' ? (
                <Plus className="w-4 h-4 text-green-500" />
              ) : (
                <Minus className="w-4 h-4 text-red-500" />
              )}
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={startVoiceInput}
          disabled={isListening || isSubmitting}
          className="h-11 w-11"
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-red-500 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!preview || isSubmitting}
          className="h-11 px-4"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Preview */}
      {preview && (
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg text-[12px] ${
            preview.type === 'income'
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-red-50 text-red-800 border border-red-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {preview.type === 'income' ? (
              <Plus className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span className="font-medium">AED {preview.amount.toLocaleString('en-AE')}</span>
            <span className="text-muted-foreground">•</span>
            <span>{preview.category}</span>
          </div>
          <span className="text-muted-foreground truncate max-w-[150px]">{preview.description}</span>
        </div>
      )}

      {/* Quick Suggestions */}
      {!input && (
        <div className="flex flex-wrap gap-1.5">
          {['100 chai', '50 auto', 'earned 500 uber', '200 lunch'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="px-2.5 py-1 text-[11px] bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickTransactionInput;
