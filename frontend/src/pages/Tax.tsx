// StoreBuddy - UAE VAT & Tax Compliance Page
// UAE has 0% personal income tax, 5% VAT, 9% Corporate Tax (for large businesses)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Home, 
  Percent, 
  FileText, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Building2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Info,
  Shield,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import PageIntro from "@/components/PageIntro";

const Tax = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock VAT data for demo
  const vatSummary = {
    currentPeriod: "Q1 2026",
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    filingDeadline: "2026-04-28",
    daysRemaining: 83,
    
    // Sales (Output VAT)
    totalSales: 125000,
    standardRatedSales: 115000,
    zeroRatedSales: 8000,
    exemptSales: 2000,
    outputVAT: 5750, // 5% of standard rated
    
    // Purchases (Input VAT)
    totalPurchases: 78000,
    standardRatedPurchases: 72000,
    inputVAT: 3600, // 5% of standard rated
    
    // Net Position
    netVAT: 2150, // Output - Input (payable)
    
    // Previous Returns
    previousReturns: [
      { period: "Q4 2025", status: "filed", netVAT: 1850, filedDate: "2026-01-15" },
      { period: "Q3 2025", status: "filed", netVAT: 2200, filedDate: "2025-10-20" },
      { period: "Q2 2025", status: "filed", netVAT: 1650, filedDate: "2025-07-18" },
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
            <Home className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Percent className="w-8 h-8 text-primary" />
              UAE Tax & VAT
            </h1>
            <p className="text-muted-foreground">VAT compliance and tax information</p>
          </div>
        </div>
        <Button onClick={() => navigate("/vat")} className="bg-emerald-600 hover:bg-emerald-700">
          <FileText className="w-4 h-4 mr-2" />
          Full VAT Management
        </Button>
      </div>

      <PageIntro
        title="UAE Tax System"
        description="UAE has 0% personal income tax. Businesses with turnover above AED 375,000 must register for 5% VAT. Corporate tax of 9% applies to businesses with profits over AED 375,000."
      />

      {/* UAE Tax Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Personal Income Tax</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">0%</div>
            <p className="text-sm text-green-700 dark:text-green-300">
              No personal income tax in UAE - keep 100% of your salary!
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Percent className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">VAT Rate</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">5%</div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Value Added Tax on most goods and services
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Corporate Tax</h3>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">9%</div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Only on profits above AED 375,000
            </p>
          </Card>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">VAT Overview</TabsTrigger>
          <TabsTrigger value="calculator">VAT Calculator</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* VAT Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Current Period Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Current Period: {vatSummary.currentPeriod}
              </h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {vatSummary.daysRemaining} days to file
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                <p className="text-2xl font-bold">AED {vatSummary.totalSales.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Output VAT (Collected)</p>
                <p className="text-2xl font-bold text-red-600">AED {vatSummary.outputVAT.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Input VAT (Paid)</p>
                <p className="text-2xl font-bold text-green-600">AED {vatSummary.inputVAT.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-muted-foreground mb-1">Net VAT Payable</p>
                <p className="text-2xl font-bold text-blue-600">AED {vatSummary.netVAT.toLocaleString()}</p>
              </div>
            </div>

            {/* Sales Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Sales Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <span className="text-sm">Standard Rated (5%)</span>
                    <span className="font-medium">AED {vatSummary.standardRatedSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <span className="text-sm">Zero Rated (0%)</span>
                    <span className="font-medium">AED {vatSummary.zeroRatedSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <span className="text-sm">Exempt</span>
                    <span className="font-medium">AED {vatSummary.exemptSales.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  Input VAT Recovery
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <span className="text-sm">Business Purchases</span>
                    <span className="font-medium">AED {vatSummary.standardRatedPurchases.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="text-sm">Recoverable VAT</span>
                    <span className="font-medium text-green-600">AED {vatSummary.inputVAT.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Previous Returns */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Previous VAT Returns
            </h3>
            <div className="space-y-3">
              {vatSummary.previousReturns.map((ret, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">{ret.period}</p>
                      <p className="text-sm text-muted-foreground">Filed: {ret.filedDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">AED {ret.netVAT.toLocaleString()}</p>
                    <Badge className={getStatusColor(ret.status)}>{ret.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* VAT Calculator Tab */}
        <TabsContent value="calculator" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Quick VAT Calculator
            </h3>
            
            <VATCalculator />
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              VAT Compliance Checklist
            </h3>
            
            <div className="space-y-4">
              <ComplianceItem 
                title="VAT Registration"
                description="Required if annual turnover exceeds AED 375,000"
                status="complete"
                tip="Voluntary registration available for turnover above AED 187,500"
              />
              <ComplianceItem 
                title="Tax Registration Number (TRN)"
                description="15-digit TRN issued by Federal Tax Authority"
                status="complete"
                tip="Display TRN on all invoices and receipts"
              />
              <ComplianceItem 
                title="Tax Invoices"
                description="Issue compliant invoices for all taxable supplies"
                status="complete"
                tip="Include TRN, VAT amount, and total with VAT"
              />
              <ComplianceItem 
                title="Record Keeping"
                description="Maintain records for minimum 5 years"
                status="warning"
                tip="Keep purchase invoices, sales records, and bank statements"
              />
              <ComplianceItem 
                title="Quarterly Filing"
                description="File VAT returns within 28 days after quarter end"
                status="pending"
                tip="Next deadline: April 28, 2026"
              />
            </div>
          </Card>

          {/* FTA Resources */}
          <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <h3 className="font-semibold text-lg mb-4">Federal Tax Authority Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://tax.gov.ae" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg hover:shadow-md transition-shadow">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">FTA Portal</p>
                  <p className="text-sm text-muted-foreground">tax.gov.ae</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </a>
              <a href="https://eservices.tax.gov.ae" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-lg hover:shadow-md transition-shadow">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">E-Services</p>
                  <p className="text-sm text-muted-foreground">File returns online</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </a>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// VAT Calculator Component
const VATCalculator = () => {
  const [amount, setAmount] = useState("");
  const [includesVAT, setIncludesVAT] = useState(false);

  const calculateVAT = () => {
    const value = parseFloat(amount) || 0;
    if (includesVAT) {
      // Amount includes VAT - extract it
      const vatAmount = value - (value / 1.05);
      const netAmount = value / 1.05;
      return { netAmount, vatAmount, totalAmount: value };
    } else {
      // Amount excludes VAT - add it
      const vatAmount = value * 0.05;
      const totalAmount = value + vatAmount;
      return { netAmount: value, vatAmount, totalAmount };
    }
  };

  const result = calculateVAT();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (AED)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 border rounded-lg text-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount Type</label>
          <div className="flex gap-2">
            <Button
              variant={!includesVAT ? "default" : "outline"}
              onClick={() => setIncludesVAT(false)}
              className="flex-1"
            >
              Excludes VAT
            </Button>
            <Button
              variant={includesVAT ? "default" : "outline"}
              onClick={() => setIncludesVAT(true)}
              className="flex-1"
            >
              Includes VAT
            </Button>
          </div>
        </div>
      </div>

      {amount && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Net Amount</p>
            <p className="text-2xl font-bold">AED {result.netAmount.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">VAT (5%)</p>
            <p className="text-2xl font-bold text-blue-600">AED {result.vatAmount.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">AED {result.totalAmount.toFixed(2)}</p>
          </div>
        </motion.div>
      )}

      {/* Quick Reference */}
      <Alert>
        <Info className="w-4 h-4" />
        <AlertTitle>VAT Quick Reference</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• <strong>Standard Rate:</strong> 5% on most goods and services</li>
            <li>• <strong>Zero Rate:</strong> Exports, international transport, certain healthcare/education</li>
            <li>• <strong>Exempt:</strong> Financial services, residential property, bare land</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Compliance Item Component
const ComplianceItem = ({ title, description, status, tip }: {
  title: string;
  description: string;
  status: "complete" | "warning" | "pending";
  tip: string;
}) => {
  const getIcon = () => {
    switch (status) {
      case "complete": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "pending": return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (status) {
      case "complete": return "bg-green-50 dark:bg-green-900/20 border-green-200";
      case "warning": return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200";
      case "pending": return "bg-blue-50 dark:bg-blue-900/20 border-blue-200";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground mt-1 italic">💡 {tip}</p>
        </div>
      </div>
    </div>
  );
};

export default Tax;
