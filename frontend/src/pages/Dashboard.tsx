import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import TransactionInputCard from "@/components/TransactionInputCard";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Wallet, AlertTriangle, Receipt, Upload, FileText, Check, Lightbulb, BadgeCheck, ArrowRight, MessageSquare } from "lucide-react";
import db from "@/services/database";
import type { Transaction } from "@/services/database";
import PageIntro from "@/components/PageIntro";
import AIAnalysisStatus from "@/components/AIAnalysisStatus";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { extractTextFromPDF, parseBankStatement, type ParsedTransaction } from "@/lib/bankStatementParser";
import { parseCSV } from "@/lib/csvParser";
import { useToast } from "@/hooks/use-toast";
import SMSImportModal from "@/components/SMSImportModal";

// Occupation-based quick tips and schemes
const occupationInsights: Record<string, { tips: string[]; schemes: { name: string; benefit: string }[] }> = {
  delivery_partner: {
    tips: [
      "Track fuel expenses separately - they're tax deductible",
      "Peak hours (7-9 PM) typically earn 1.5x more",
      "Set aside 10% of daily earnings for vehicle maintenance",
    ],
    schemes: [
      { name: "PM-SVANidhi", benefit: "Up to ₹50,000 working capital loan at low interest" },
      { name: "E-Shram Card", benefit: "₹2 lakh accidental insurance free" },
      { name: "Ayushman Bharat", benefit: "₹5 lakh health insurance for family" },
    ],
  },
  cab_driver: {
    tips: [
      "Airport runs during flight arrivals are premium fares",
      "Keep a logbook for tax deductions on vehicle expenses",
      "Consider multi-platform (Uber + Ola) for better utilization",
    ],
    schemes: [
      { name: "PM-SYM Pension", benefit: "₹3,000/month pension after 60 years" },
      { name: "E-Shram Card", benefit: "₹2 lakh accidental insurance free" },
      { name: "PMJJBY", benefit: "₹2 lakh life insurance at ₹436/year" },
    ],
  },
  freelancer: {
    tips: [
      "Invoice clients within 48 hours of project completion",
      "Set aside 30% of income for quarterly advance tax",
      "Diversify clients - never rely on one for >40% income",
    ],
    schemes: [
      { name: "Atal Pension Yojana", benefit: "₹1,000-5,000/month pension after 60" },
      { name: "Stand-Up India", benefit: "Loans ₹10 lakh to ₹1 crore for entrepreneurs" },
      { name: "PMEGP", benefit: "35% subsidy on loans up to ₹25 lakh" },
    ],
  },
  street_vendor: {
    tips: [
      "Best selling hours are 5-8 PM on weekdays",
      "Register for GST only if turnover exceeds ₹40 lakh",
      "Keep daily sales records for loan applications",
    ],
    schemes: [
      { name: "PM-SVANidhi", benefit: "₹10,000-50,000 collateral-free loan" },
      { name: "PM Jan Dhan Yojana", benefit: "Zero-balance bank account + ₹10,000 OD" },
      { name: "Ayushman Bharat", benefit: "₹5 lakh health insurance for family" },
    ],
  },
  home_service: {
    tips: [
      "Weekend bookings typically pay 20% more",
      "Upsell maintenance contracts for recurring income",
      "Carry business cards for referral growth",
    ],
    schemes: [
      { name: "PM Vishwakarma", benefit: "₹3 lakh loan + skill training for artisans" },
      { name: "PMEGP", benefit: "Up to 35% subsidy on business loans" },
      { name: "E-Shram Card", benefit: "₹2 lakh accidental insurance free" },
    ],
  },
  beauty_wellness: {
    tips: [
      "Bridal season (Oct-Feb) can 3x your monthly income",
      "Offer package deals for repeat customers",
      "Track product costs separately from service income",
    ],
    schemes: [
      { name: "PM Vishwakarma", benefit: "Training + tools support for beauticians" },
      { name: "Mudra Loan", benefit: "Up to ₹10 lakh for small business" },
      { name: "PMJJBY", benefit: "₹2 lakh life insurance at ₹436/year" },
    ],
  },
  tutor: {
    tips: [
      "Exam season (Feb-May) is peak earning time",
      "Group batches increase hourly rate by 2-3x",
      "Online tutoring expands reach beyond local area",
    ],
    schemes: [
      { name: "Stand-Up India", benefit: "Loans for education sector startups" },
      { name: "Atal Pension Yojana", benefit: "₹1,000-5,000/month pension after 60" },
      { name: "PMSBY", benefit: "₹2 lakh accident insurance at ₹20/year" },
    ],
  },
  other: {
    tips: [
      "Track all income sources for accurate tax filing",
      "Build an emergency fund of 3 months' expenses",
      "Separate business and personal expenses",
    ],
    schemes: [
      { name: "E-Shram Card", benefit: "₹2 lakh accidental insurance free" },
      { name: "PM Jan Dhan Yojana", benefit: "Zero-balance account + benefits" },
      { name: "Atal Pension Yojana", benefit: "₹1,000-5,000/month pension after 60" },
    ],
  },
};

const Dashboard = () => {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todaySummary, setTodaySummary] = useState({ income: 0, expense: 0, count: 0 });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  // PDF Upload state
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());
  const [bankName, setBankName] = useState("");
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!isAuthenticated && !userId) {
      navigate("/login");
      return;
    }
    // Load data if authenticated OR if user_id exists (for testing)
    if (isAuthenticated || userId) {
      loadData();
    }
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const summary = await db.transactions.getTodaySummary();
      setTodaySummary(summary);

      // Use local date instead of UTC (toISOString uses UTC)
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      const transactions = await db.transactions.getAll({
        date_start: today,
        date_end: today,
      });
      setRecentTransactions(transactions.slice(0, 5));

      // Calculate balance from all transactions
      const allTransactions = await db.transactions.getAll();
      const total = allTransactions.reduce((sum, t) => {
        return sum + (t.transaction_type === "income" ? t.amount : -t.amount);
      }, 0);
      setBalance(total);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // PDF Upload Handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsParsingPdf(true);
    setPdfError(null);
    setIsPdfDialogOpen(true);

    try {
      const pdfText = await extractTextFromPDF(file);
      const result = await parseBankStatement(pdfText);

      if (result.error) {
        setPdfError(result.error);
        setParsedTransactions([]);
      } else if (result.transactions.length === 0) {
        setPdfError("No transactions found in the PDF. Please check the file format.");
        setParsedTransactions([]);
      } else {
        setParsedTransactions(result.transactions);
        setBankName(result.bankName);
        // Select all transactions by default
        setSelectedTransactions(new Set(result.transactions.map((_, i) => i)));
      }
    } catch (error) {
      console.error("PDF parsing error:", error);
      setPdfError("Failed to parse PDF. Please ensure it's a valid bank statement.");
      setParsedTransactions([]);
    } finally {
      setIsParsingPdf(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleTransactionSelection = (index: number) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTransactions(newSelected);
  };

  const selectAllTransactions = () => {
    setSelectedTransactions(new Set(parsedTransactions.map((_, i) => i)));
  };

  const deselectAllTransactions = () => {
    setSelectedTransactions(new Set());
  };

  const handleImportTransactions = async () => {
    if (selectedTransactions.size === 0) {
      toast({
        title: "No Transactions Selected",
        description: "Please select at least one transaction to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const transactionsToImport = parsedTransactions
        .filter((_, i) => selectedTransactions.has(i))
        .map((t) => ({
          transaction_date: t.date,
          amount: t.amount,
          transaction_type: t.type,
          category: t.category,
          description: t.description,
          merchant_name: t.merchant,
          source: bankName,
        }));

      // PRODUCTION: Check for duplicates before importing
      const existingTransactions = await db.transactions.getAll();
      const duplicateCount = transactionsToImport.filter(newTxn => {
        return existingTransactions.some(existing =>
          existing.transaction_date === newTxn.transaction_date &&
          existing.amount === newTxn.amount &&
          existing.description?.substring(0, 20) === newTxn.description?.substring(0, 20)
        );
      }).length;

      // Filter out duplicates
      const uniqueTransactions = transactionsToImport.filter(newTxn => {
        return !existingTransactions.some(existing =>
          existing.transaction_date === newTxn.transaction_date &&
          existing.amount === newTxn.amount &&
          existing.description?.substring(0, 20) === newTxn.description?.substring(0, 20)
        );
      });

      if (uniqueTransactions.length === 0) {
        toast({
          title: "All Duplicates",
          description: "All selected transactions already exist in the database",
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }

      await db.transactions.bulkCreate(uniqueTransactions);

      const message = duplicateCount > 0
        ? `${uniqueTransactions.length} imported, ${duplicateCount} duplicates skipped`
        : `${uniqueTransactions.length} transactions imported successfully`;

      toast({
        title: "Import Successful",
        description: `${message} from ${bankName} statement`,
      });

      setIsPdfDialogOpen(false);
      setParsedTransactions([]);
      setSelectedTransactions(new Set());
      setBankName("");

      // Reload data to show new transactions
      loadData();
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Get personalized financial recommendations",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Wallet,
      title: "Dynamic Budgeting",
      description: "Feast and famine week budgets",
      color: "from-green-500 to-green-600",
    },
    {
      icon: AlertTriangle,
      title: "Risk Analysis",
      description: "Monitor your financial health",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Receipt,
      title: "Tax Automation",
      description: "Auto-calculate and file ITR",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section - Asymmetric, natural spacing */}
      <div className="space-y-1">
        <h1 className="text-[32px] font-semibold tracking-tight text-foreground">
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}
          {user?.name?.split(" ")[0] && `, ${user.name.split(" ")[0]}`}
          </h1>
        <p className="text-[15px] text-muted-foreground font-normal">Here's your financial overview</p>
      </div>

      <PageIntro
        title="What is this page?"
        description="This is your daily money hub. Add today's income and expenses from here and see a quick overview of how you're doing."
      />

      {/* AI Analysis Status */}
      <AIAnalysisStatus />

      {/* Instant Value Section - Shows immediately based on occupation */}
      {user?.occupation && occupationInsights[user.occupation] && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Tips Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[8px] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[15px] font-semibold text-blue-900">Tips for You</h3>
            </div>
            <ul className="space-y-3">
              {occupationInsights[user.occupation].tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-[13px] text-blue-800">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Government Schemes Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-[8px] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-green-900">Schemes You May Qualify For</h3>
              </div>
              <button
                onClick={() => navigate("/benefits")}
                className="text-[12px] text-green-700 hover:text-green-900 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <ul className="space-y-3">
              {occupationInsights[user.occupation].schemes.map((scheme, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-green-900">{scheme.name}</p>
                    <p className="text-[12px] text-green-700">{scheme.benefit}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Transaction Input Card */}
      <div>
        <TransactionInputCard onSuccess={loadData} />
      </div>

      {/* Quick Import Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* SMS Import Section */}
        <div className="bg-background border border-border/40 rounded-[6px] p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Import from SMS</h3>
                <p className="text-[12px] text-muted-foreground">Paste bank SMS to auto-import</p>
              </div>
            </div>
            <Button
              onClick={() => setIsSmsModalOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Paste SMS
            </Button>
          </div>
        </div>

        {/* PDF Upload Section */}
        <div className="bg-background border border-border/40 rounded-[6px] p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Import Statement</h3>
                <p className="text-[12px] text-muted-foreground">Upload PDF bank statement</p>
              </div>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Import Modal */}
      <SMSImportModal
        open={isSmsModalOpen}
        onOpenChange={setIsSmsModalOpen}
        onSuccess={loadData}
      />

      {/* Summary Cards - Asymmetric grid, real shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-background border border-border/40 rounded-[6px] p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-shadow">
          <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Today's Income</p>
          <p className="text-[28px] font-semibold tracking-tight text-[#16a34a]">
            ₹{todaySummary.income.toLocaleString("en-IN")}
          </p>
                </div>
        <div className="bg-background border border-border/40 rounded-[6px] p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-shadow">
          <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Today's Expenses</p>
          <p className="text-[28px] font-semibold tracking-tight text-[#dc2626]">
            ₹{todaySummary.expense.toLocaleString("en-IN")}
          </p>
              </div>
        <div className="bg-background border border-border/40 rounded-[6px] p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-shadow md:col-span-1">
          <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Current Balance</p>
          <p className="text-[28px] font-semibold tracking-tight text-foreground">
            ₹{balance.toLocaleString("en-IN")}
          </p>
                </div>
        </div>

      {/* Recent Transactions - Section with divider */}
      {recentTransactions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[20px] font-semibold tracking-tight text-foreground">Recent Transactions</h2>
            <button
              onClick={() => navigate("/transactions")}
              className="text-[13px] text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="bg-background border border-border/40 rounded-[6px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.transaction_id}
                className={`flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/30 ${
                  index !== recentTransactions.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-[5px] flex items-center justify-center text-[13px] font-semibold ${
                      transaction.transaction_type === "income"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#fee2e2] text-[#dc2626]"
                    }`}
                  >
                    {transaction.transaction_type === "income" ? "+" : "−"}
                  </div>
                      <div>
                    <div className="text-[14px] font-medium text-foreground">{transaction.category || "Uncategorized"}</div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      {transaction.transaction_time || "N/A"} • {transaction.description || "No description"}
                    </div>
                      </div>
                    </div>
                    <div
                  className={`text-[15px] font-semibold tracking-tight ${
                    transaction.transaction_type === "income"
                      ? "text-[#16a34a]"
                      : "text-[#dc2626]"
                  }`}
                >
                  {transaction.transaction_type === "income" ? "+" : "−"}₹
                  {transaction.amount.toLocaleString("en-IN")}
                </div>
                    </div>
                ))}
              </div>
          </div>
      )}

      {/* Feature Section - Asymmetric layout */}
                      <div>
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold tracking-tight text-foreground mb-1.5">What is Agente AI?</h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Your personal finance coach for the gig economy. Smart insights, better savings, brighter future.
          </p>
                      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-background border border-border/40 rounded-[6px] p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5"
              >
                <div className={`w-10 h-10 rounded-[5px] bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3.5`}>
                  <Icon className="w-5 h-5 text-white" />
                    </div>
                <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Import Dialog */}
      <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Import Bank Statement
              {bankName && bankName !== "UNKNOWN" && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({bankName} Bank)
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Review and select transactions to import into your account
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {isParsingPdf ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Parsing PDF...</p>
              </div>
            ) : pdfError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                <p className="text-destructive font-medium mb-2">Error Parsing PDF</p>
                <p className="text-muted-foreground text-sm max-w-md">{pdfError}</p>
              </div>
            ) : parsedTransactions.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-muted-foreground">
                    Found {parsedTransactions.length} transactions
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAllTransactions}
                      className="text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={deselectAllTransactions}
                      className="text-xs"
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  {parsedTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      onClick={() => toggleTransactionSelection(index)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                        selectedTransactions.has(index)
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedTransactions.has(index)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {selectedTransactions.has(index) && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {transaction.description}
                          </span>
                          {transaction.merchant && (
                            <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                              {transaction.merchant}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>

                      <div
                        className={`text-sm font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-muted-foreground">
                {selectedTransactions.size} of {parsedTransactions.length} selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPdfDialogOpen(false);
                    setParsedTransactions([]);
                    setSelectedTransactions(new Set());
                    setBankName("");
                    setPdfError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImportTransactions}
                  disabled={isImporting || selectedTransactions.size === 0}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      Import {selectedTransactions.size} Transactions
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
