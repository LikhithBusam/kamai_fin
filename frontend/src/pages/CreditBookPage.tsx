// StoreBuddy - Credit Book (Udhar) Page
// Customer credit management with trust scores and collection priority

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { creditAPI } from '@/services/uaeApi';
import { formatAED, getRiskLevelColor, formatDateUAE } from '@/lib/uaeUtils';
import type { Customer, CreditTransaction, TrustScore, CreditAnalysis } from '@/types/uae';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  Plus,
  MessageCircle,
  Star,
  ChevronRight,
  RefreshCw,
  XCircle,
} from 'lucide-react';

export default function CreditBookPage() {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  
  // State
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CreditAnalysis | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const userId = 'demo-user';

  // Fetch credit data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [analysisRes] = await Promise.all([
          creditAPI.getAnalysis(userId),
        ]) as [{ data?: typeof analysis }];
        
        if (analysisRes?.data) {
          setAnalysis(analysisRes.data);
          // Mock customers for demo - in production would come from API
          setCustomers(generateMockCustomers());
        }
      } catch (err) {
        console.error('Credit fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [userId]);

  // Mock customers for demo
  function generateMockCustomers(): Customer[] {
    return [
      {
        id: '1',
        user_id: userId,
        name: 'Mohammed Al-Rashid',
        phone: '+971501234567',
        business_name: 'Al-Rashid Trading',
        trust_score: 85,
        total_credit_given: 15000,
        total_credit_received: 12000,
        current_balance: 3000,
        average_payment_days: 12,
        last_transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: userId,
        name: 'Ahmed Hassan',
        phone: '+971502345678',
        trust_score: 62,
        total_credit_given: 8000,
        total_credit_received: 4000,
        current_balance: 4000,
        average_payment_days: 25,
        last_transaction_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        user_id: userId,
        name: 'Fatima Khalid',
        phone: '+971503456789',
        business_name: 'Fatima Electronics',
        trust_score: 92,
        total_credit_given: 25000,
        total_credit_received: 24500,
        current_balance: 500,
        average_payment_days: 7,
        last_transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        user_id: userId,
        name: 'Rashid Al-Mansoori',
        phone: '+971504567890',
        trust_score: 35,
        total_credit_given: 12000,
        total_credit_received: 3000,
        current_balance: 9000,
        average_payment_days: 45,
        last_transaction_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
  }

  // Get risk level from trust score
  const getRiskLevel = (score: number): string => {
    if (score >= 80) return 'LOW';
    if (score >= 60) return 'MEDIUM';
    if (score >= 40) return 'HIGH';
    return 'VERY_HIGH';
  };

  // Get trust score color
  const getTrustScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery) ||
      customer.business_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const riskLevel = getRiskLevel(customer.trust_score);
    const matchesRisk = filterRisk === 'all' || riskLevel === filterRisk;
    
    return matchesSearch && matchesRisk;
  });

  // Sort by collection priority (low trust score + high balance first)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const priorityA = (100 - a.trust_score) * a.current_balance;
    const priorityB = (100 - b.trust_score) * b.current_balance;
    return priorityB - priorityA;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
                <ArrowLeft className={`w-5 h-5 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('credit.title')}</h1>
                <p className="text-sm text-gray-500">
                  {customers.length} customers • {formatAED(analysis?.total_outstanding || 0)} outstanding
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('credit.addCredit')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Outstanding */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('credit.outstanding')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatAED(analysis?.total_outstanding || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Overdue Amount */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('credit.overdue')}</p>
                <p className="text-xl font-bold text-red-600">
                  {formatAED(analysis?.overdue_amount || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* High Risk Customers */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">High Risk</p>
                <p className="text-xl font-bold text-gray-900">
                  {customers.filter(c => c.trust_score < 50).length}
                </p>
              </div>
            </div>
          </div>

          {/* Average Trust Score */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('credit.trustScore')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(customers.reduce((sum, c) => sum + c.trust_score, 0) / customers.length || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="flex-1 relative">
            <Search className={`w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-gray-200 rounded-lg 
                focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${filterRisk === risk 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {risk === 'all' ? 'All' : risk.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sortedCustomers.map((customer) => {
              const riskLevel = getRiskLevel(customer.trust_score);
              const daysOverdue = Math.floor(
                (Date.now() - new Date(customer.last_transaction_date).getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-5 hover:bg-gray-50 cursor-pointer transition-colors ${isRTL ? 'text-right' : ''}`}
                >
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar with Trust Score */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-lg">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getTrustScoreColor(customer.trust_score)}`}>
                        {customer.trust_score}
                      </div>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRiskLevelColor(riskLevel)}`}>
                          {riskLevel.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {customer.business_name && (
                        <p className="text-sm text-gray-500 truncate">{customer.business_name}</p>
                      )}
                      
                      <div className={`flex items-center gap-4 mt-1 text-xs text-gray-400 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </span>
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Clock className="w-3 h-3" />
                          {customer.average_payment_days} days avg
                        </span>
                      </div>
                    </div>
                    
                    {/* Balance */}
                    <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                      <p className="text-lg font-bold text-gray-900">
                        {formatAED(customer.current_balance)}
                      </p>
                      {daysOverdue > 0 && customer.current_balance > 0 && (
                        <p className="text-xs text-red-500">
                          {daysOverdue} days ago
                        </p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${customer.phone}`;
                        }}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/${customer.phone?.replace('+', '')}`, '_blank');
                        }}
                        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <ChevronRight className={`w-5 h-5 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {sortedCustomers.length === 0 && (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No customers found</p>
              </div>
            )}
          </div>
        </div>

        {/* Collection Priority Alert */}
        {analysis?.collection_priority && analysis.collection_priority.length > 0 && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5">
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Priority Collections</h3>
            </div>
            <p className="text-sm text-orange-700 mb-4">
              {analysis.collection_priority.length} customers need immediate follow-up
            </p>
            <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              {t('credit.collectNow')}
            </button>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

// Customer Detail Modal Component
interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

function CustomerDetailModal({ customer, onClose }: CustomerDetailModalProps) {
  const { t, isRTL, language } = useLanguage();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className={`bg-white w-full sm:w-[480px] sm:rounded-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-lg font-bold text-gray-900">Customer Details</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Customer Info */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-2xl">
                {customer.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
              {customer.business_name && (
                <p className="text-gray-500">{customer.business_name}</p>
              )}
              <p className="text-sm text-gray-400">{customer.phone}</p>
            </div>
          </div>
          
          {/* Trust Score */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <p className="text-gray-600 font-medium">{t('credit.trustScore')}</p>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-3xl font-bold text-gray-900">{customer.trust_score}</span>
                <span className="text-gray-400">/100</span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  customer.trust_score >= 80 ? 'bg-green-500' :
                  customer.trust_score >= 60 ? 'bg-yellow-500' :
                  customer.trust_score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${customer.trust_score}%` }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium">Current Balance</p>
              <p className="text-xl font-bold text-blue-900">{formatAED(customer.current_balance)}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-green-600 font-medium">Avg Payment Days</p>
              <p className="text-xl font-bold text-green-900">{customer.average_payment_days} days</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-xs text-purple-600 font-medium">Total Given</p>
              <p className="text-xl font-bold text-purple-900">{formatAED(customer.total_credit_given)}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-emerald-600 font-medium">Total Received</p>
              <p className="text-xl font-bold text-emerald-900">{formatAED(customer.total_credit_received)}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              {t('credit.receivePayment')}
            </button>
            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              {t('credit.addCredit')}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => window.location.href = `tel:${customer.phone}`}
                className="py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${customer.phone?.replace('+', '')}`, '_blank')}
                className="py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
