/**
 * Real-Time Sync Hook
 * Provides instant updates for transactions, recommendations, and alerts
 * Uses Supabase Realtime subscriptions
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  data: any;
  timestamp: Date;
}

export interface UseRealtimeSyncOptions {
  onTransaction?: (event: RealtimeEvent) => void;
  onRecommendation?: (event: RealtimeEvent) => void;
  onBudgetUpdate?: (event: RealtimeEvent) => void;
  onCashFlowAlert?: (event: RealtimeEvent) => void;
  showNotifications?: boolean;
}

export const useRealtimeSync = (options: UseRealtimeSyncOptions = {}) => {
  const { user, refreshData } = useApp();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [eventCount, setEventCount] = useState(0);

  const showNotification = useCallback((title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    if (options.showNotifications !== false) {
      toast({ title, description, variant });

      // Also show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: description,
          icon: '/logo.png',
          tag: 'storebuddy-realtime',
        });
      }
    }
  }, [toast, options.showNotifications]);

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;

    // Subscribe to transactions table
    const transactionChannel = supabase
      .channel(`transactions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const event: RealtimeEvent = {
            type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            table: 'transactions',
            data: payload.new || payload.old,
            timestamp: new Date(),
          };

          setLastEvent(event);
          setEventCount((c) => c + 1);

          if (payload.eventType === 'INSERT') {
            const txn = payload.new as any;
            const amount = txn.amount?.toLocaleString('en-IN') || '0';
            const type = txn.transaction_type === 'income' ? 'Income' : 'Expense';

            showNotification(
              `New ${type} Recorded`,
              `AED ${amount} - ${txn.category || 'Transaction'}`
            );
          }

          options.onTransaction?.(event);
          refreshData();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        console.log('[Realtime] Transactions channel:', status);
      });

    // Subscribe to recommendations table
    const recommendationChannel = supabase
      .channel(`recommendations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recommendations',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const event: RealtimeEvent = {
            type: 'INSERT',
            table: 'recommendations',
            data: payload.new,
            timestamp: new Date(),
          };

          setLastEvent(event);
          setEventCount((c) => c + 1);

          const rec = payload.new as any;
          showNotification(
            'New AI Recommendation',
            rec.title || 'Check your dashboard for new insights'
          );

          options.onRecommendation?.(event);
          refreshData();
        }
      )
      .subscribe();

    // Subscribe to budgets table
    const budgetChannel = supabase
      .channel(`budgets:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const event: RealtimeEvent = {
            type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            table: 'budgets',
            data: payload.new || payload.old,
            timestamp: new Date(),
          };

          setLastEvent(event);
          setEventCount((c) => c + 1);

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const budget = payload.new as any;
            showNotification(
              'Budget Updated',
              `${budget.budget_mode || 'Normal'} mode budget is now active`
            );
          }

          options.onBudgetUpdate?.(event);
          refreshData();
        }
      )
      .subscribe();

    // Subscribe to agent_logs for cash flow alerts
    const alertChannel = supabase
      .channel(`alerts:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_logs',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const log = payload.new as any;

          // Only show cash flow alerts
          if (log.agent_name === 'cashflow_agent' || log.agent_name === 'cashflow_monitor') {
            const event: RealtimeEvent = {
              type: 'INSERT',
              table: 'agent_logs',
              data: log,
              timestamp: new Date(),
            };

            setLastEvent(event);
            setEventCount((c) => c + 1);

            // Parse the output for status
            try {
              const output = typeof log.output === 'string' ? JSON.parse(log.output) : log.output;
              const status = output?.status || 'unknown';
              const message = output?.message || 'Check your cash flow status';

              const variant = status === 'critical' ? 'destructive' : 'default';
              showNotification('Cash Flow Alert', message, variant);
            } catch {
              showNotification('Cash Flow Update', 'Your financial status has been updated');
            }

            options.onCashFlowAlert?.(event);
          }
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(transactionChannel);
      supabase.removeChannel(recommendationChannel);
      supabase.removeChannel(budgetChannel);
      supabase.removeChannel(alertChannel);
    };
  }, [user?.id, refreshData, showNotification, options]);

  return {
    isConnected,
    lastEvent,
    eventCount,
  };
};

/**
 * Request browser notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('[Notifications] Not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export default useRealtimeSync;
