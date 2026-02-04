/**
 * Cash Flow Alert Component
 * Shows real-time daily cash flow status - the #1 concern for shop owners
 * "Am I on track to pay my bills this month?"
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Wallet,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import db from '@/services/database';

interface CashFlowStatus {
  status: 'on_track' | 'at_risk' | 'critical' | 'loading';
  daysRemaining: number;
  monthToDate: {
    income: number;
    expenses: number;
    net: number;
  };
  upcomingBills: {
    total: number;
    count: number;
    nextDue?: string;
    nextAmount?: number;
  };
  projectedGap: number;
  dailyTarget: number;
  message: string;
  lastUpdated?: Date;
}

export const CashFlowAlert = () => {
  const { user } = useApp();
  const [status, setStatus] = useState<CashFlowStatus>({
    status: 'loading',
    daysRemaining: 0,
    monthToDate: { income: 0, expenses: 0, net: 0 },
    upcomingBills: { total: 0, count: 0 },
    projectedGap: 0,
    dailyTarget: 0,
    message: 'Calculating your cash flow...',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateCashFlow = async () => {
    if (!user?.id) return;

    try {
      setIsRefreshing(true);

      // Get current date info
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysRemaining = daysInMonth - now.getDate();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

      // Get this month's transactions
      const transactions = await db.transactions.getAll({
        date_start: monthStart,
        date_end: now.toISOString().split('T')[0],
      });

      const income = transactions
        .filter((t) => t.transaction_type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter((t) => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const net = income - expenses;

      // Get upcoming bills (if bills table exists)
      let upcomingBills = { total: 0, count: 0, nextDue: undefined as string | undefined, nextAmount: undefined as number | undefined };
      try {
        const bills = await db.bills?.getUpcoming?.() || [];
        const pendingBills = bills.filter((b: any) => b.status === 'pending' || b.status === 'upcoming');
        upcomingBills = {
          total: pendingBills.reduce((sum: number, b: any) => sum + (b.amount || 0), 0),
          count: pendingBills.length,
          nextDue: pendingBills[0]?.due_date,
          nextAmount: pendingBills[0]?.amount,
        };
      } catch {
        // Bills table might not exist or be empty
      }

      // Calculate projections
      const projectedGap = net - upcomingBills.total;
      const dailyTarget = daysRemaining > 0 ? Math.max(0, upcomingBills.total - net) / daysRemaining : 0;

      // Determine status
      let cashFlowStatus: 'on_track' | 'at_risk' | 'critical';
      let message: string;

      if (projectedGap >= upcomingBills.total * 0.2) {
        cashFlowStatus = 'on_track';
        message = `Looking good! You have AED ${Math.abs(projectedGap).toLocaleString('en-AE')} buffer after all bills.`;
      } else if (projectedGap >= 0) {
        cashFlowStatus = 'at_risk';
        message = `Heads up: You're cutting it close. Earn AED ${dailyTarget.toLocaleString('en-AE')}/day to stay safe.`;
      } else {
        cashFlowStatus = 'critical';
        message = `Alert: You're AED ${Math.abs(projectedGap).toLocaleString('en-AE')} short for upcoming bills. Consider extra work.`;
      }

      setStatus({
        status: cashFlowStatus,
        daysRemaining,
        monthToDate: { income, expenses, net },
        upcomingBills,
        projectedGap,
        dailyTarget,
        message,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error calculating cash flow:', error);
      setStatus((prev) => ({
        ...prev,
        status: 'at_risk',
        message: 'Could not calculate cash flow. Add transactions to see your status.',
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    calculateCashFlow();

    // Refresh every 5 minutes
    const interval = setInterval(calculateCashFlow, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  if (status.status === 'loading') {
    return (
      <Card className="border-border/40">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    on_track: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      badgeVariant: 'default' as const,
      badgeClass: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    at_risk: {
      bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      border: 'border-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      badgeVariant: 'default' as const,
      badgeClass: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    critical: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200',
      icon: TrendingDown,
      iconColor: 'text-red-600',
      badgeVariant: 'destructive' as const,
      badgeClass: '',
    },
  };

  const config = statusConfig[status.status];
  const StatusIcon = config.icon;

  const progressPercent = status.upcomingBills.total > 0
    ? Math.min(100, (status.monthToDate.net / status.upcomingBills.total) * 100)
    : 100;

  return (
    <Card className={`${config.bg} ${config.border} border`}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center`}>
              <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-foreground">Cash Flow Status</h3>
                <Badge variant={config.badgeVariant} className={config.badgeClass}>
                  {status.status === 'on_track' ? 'On Track' : status.status === 'at_risk' ? 'Watch Out' : 'Critical'}
                </Badge>
              </div>
              <p className="text-[12px] text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {status.daysRemaining} days left in month
              </p>
            </div>
          </div>
          <button
            onClick={calculateCashFlow}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Message */}
        <p className="text-[13px] font-medium text-foreground">{status.message}</p>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Net savings vs upcoming bills</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/60 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Income</p>
            <p className="text-[14px] font-semibold text-green-600">
              AED {status.monthToDate.income.toLocaleString('en-AE')}
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Expenses</p>
            <p className="text-[14px] font-semibold text-red-600">
              AED {status.monthToDate.expenses.toLocaleString('en-AE')}
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Bills Due</p>
            <p className="text-[14px] font-semibold text-foreground">
              AED {status.upcomingBills.total.toLocaleString('en-AE')}
            </p>
          </div>
        </div>

        {/* Daily Target (if at risk or critical) */}
        {status.status !== 'on_track' && status.dailyTarget > 0 && (
          <div className="flex items-center justify-between bg-white/60 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground">Daily earning target</span>
            </div>
            <span className="text-[14px] font-semibold text-foreground">
              AED {Math.ceil(status.dailyTarget).toLocaleString('en-AE')}/day
            </span>
          </div>
        )}

        {/* Next bill reminder */}
        {status.upcomingBills.nextDue && (
          <div className="flex items-center justify-between text-[12px] text-muted-foreground pt-2 border-t border-border/30">
            <span>Next bill: {new Date(status.upcomingBills.nextDue).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}</span>
            <span className="font-medium text-foreground">AED {status.upcomingBills.nextAmount?.toLocaleString('en-AE')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowAlert;
