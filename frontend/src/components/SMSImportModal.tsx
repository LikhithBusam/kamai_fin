import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2, Check, AlertCircle, Smartphone } from "lucide-react";
import { parseSMS, parseMultipleSMS, categorizeTransaction, type ParsedSMSTransaction } from "@/lib/smsParser";
import db from "@/services/database";
import { useToast } from "@/hooks/use-toast";

interface SMSImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const SMSImportModal = ({ open, onOpenChange, onSuccess }: SMSImportModalProps) => {
  const { toast } = useToast();
  const [smsText, setSmsText] = useState("");
  const [parsedTransactions, setParsedTransactions] = useState<ParsedSMSTransaction[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<"input" | "review">("input");

  const handleParse = () => {
    if (!smsText.trim()) {
      toast({
        title: "No SMS Text",
        description: "Please paste your bank SMS messages",
        variant: "destructive",
      });
      return;
    }

    // Try single SMS first
    const singleResult = parseSMS(smsText);
    if (singleResult.success && singleResult.transaction) {
      setParsedTransactions([singleResult.transaction]);
      setSelectedIndexes(new Set([0]));
      setStep("review");
      return;
    }

    // Try multiple SMS
    const transactions = parseMultipleSMS(smsText);
    if (transactions.length === 0) {
      toast({
        title: "Could not parse SMS",
        description: "The SMS format is not recognized. Please paste a bank transaction SMS.",
        variant: "destructive",
      });
      return;
    }

    setParsedTransactions(transactions);
    setSelectedIndexes(new Set(transactions.map((_, i) => i)));
    setStep("review");
  };

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedIndexes);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndexes(newSelected);
  };

  const handleImport = async () => {
    if (selectedIndexes.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one transaction to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const transactionsToImport = parsedTransactions
        .filter((_, i) => selectedIndexes.has(i))
        .map((t) => ({
          transaction_date: t.date,
          transaction_time: t.time,
          amount: t.amount,
          transaction_type: t.type,
          category: categorizeTransaction(t),
          description: t.merchant || `${t.bankName} ${t.type === 'income' ? 'Credit' : 'Debit'}`,
          merchant_name: t.merchant,
          source: `SMS - ${t.bankName}`,
          payment_method: t.upiId ? 'UPI' : 'Bank Transfer',
        }));

      await db.transactions.bulkCreate(transactionsToImport);

      toast({
        title: "Import Successful",
        description: `${transactionsToImport.length} transaction(s) imported from SMS`,
      });

      // Reset and close
      setSmsText("");
      setParsedTransactions([]);
      setSelectedIndexes(new Set());
      setStep("input");
      onOpenChange(false);
      onSuccess?.();
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

  const handleBack = () => {
    setStep("input");
    setParsedTransactions([]);
    setSelectedIndexes(new Set());
  };

  const handleClose = () => {
    setSmsText("");
    setParsedTransactions([]);
    setSelectedIndexes(new Set());
    setStep("input");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Import from SMS
          </DialogTitle>
          <DialogDescription>
            {step === "input"
              ? "Paste your bank SMS messages to automatically extract transactions"
              : "Review and select transactions to import"}
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">How it works:</p>
                  <p className="mt-1 text-blue-700">
                    Copy-paste your bank SMS messages below. We'll automatically extract the amount, type, and details.
                  </p>
                </div>
              </div>
            </div>

            <Textarea
              placeholder={`Paste SMS here, e.g.:\n\nRs 500 credited to A/c XX1234 by UPI. Bal: Rs 12,500\n\nOr:\n\nINR 1,500 debited from A/c XX5678 for Swiggy. Avl Bal: Rs 8,000`}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />

            <div className="text-xs text-muted-foreground">
              Supports: HDFC, ICICI, SBI, Axis, Kotak, PNB, Paytm, PhonePe, GPay, and more
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Found {parsedTransactions.length} transaction(s)
            </div>

            <div className="max-h-[300px] overflow-auto space-y-2">
              {parsedTransactions.map((transaction, index) => (
                <div
                  key={index}
                  onClick={() => toggleSelection(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedIndexes.has(index)
                      ? "bg-primary/5 border-primary/30"
                      : "hover:bg-muted/50 border-border"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedIndexes.has(index)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {selectedIndexes.has(index) && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                        {transaction.bankName}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {transaction.merchant || categorizeTransaction(transaction)}
                      {transaction.balance && ` • Bal: ₹${transaction.balance.toLocaleString("en-IN")}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {parsedTransactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No transactions found in the SMS</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-shrink-0">
          {step === "input" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleParse} disabled={!smsText.trim()}>
                Parse SMS
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={isImporting || selectedIndexes.size === 0}>
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Importing...
                  </>
                ) : (
                  <>Import {selectedIndexes.size} Transaction(s)</>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SMSImportModal;
