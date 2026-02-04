// StoreBuddy - VAT Management Page
// UAE Federal Tax Authority compliance with 5% VAT

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { vatAPI } from '@/services/uaeApi';
import { formatAED, formatPercentage, validateTRN, formatTRN, formatDateUAE } from '@/lib/uaeUtils';
import type { VATPosition, VATReturn } from '@/types/uae';
import {
  Percent,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Clock,
  Building2,
  RefreshCw,
  Info,
  Shield,
} from 'lucide-react';

export default function VATManagementPage() {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  
  // State
  const [loading, setLoading] = useState(true);
  const [vatPosition, setVatPosition] = useState<VATPosition | null>(null);
  const [vatReturns, setVatReturns] = useState<VATReturn[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');
  const [trn, setTrn] = useState<string>('');
  const [trnValid, setTrnValid] = useState<boolean | null>(null);
  
  const userId = 'demo-user';

  // Fetch VAT data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const positionRes = await vatAPI.getPosition(userId) as { data?: typeof vatPosition };
        
        if (positionRes?.data) {
          setVatPosition(positionRes.data);
        }
        
        // Mock VAT returns for demo
        setVatReturns(generateMockVATReturns());
      } catch (err) {
        console.error('VAT fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [userId]);

  // Generate mock VAT returns
  function generateMockVATReturns(): VATReturn[] {
    return [
      {
        id: '1',
        user_id: userId,
        trn: '100123456789012',
        business_name: 'Sample Business',
        period: 'Q1 2024',
        period_start: '2024-01-01',
        period_end: '2024-03-31',
        output_vat: 15000,
        input_vat: 8500,
        net_vat: 6500,
        status: 'filed',
        filed_date: '2024-04-15',
        filing_deadline: '2024-04-28',
        payment_deadline: '2024-04-28',
        created_at: '2024-04-15',
      },
      {
        id: '2',
        user_id: userId,
        trn: '100123456789012',
        business_name: 'Sample Business',
        period: 'Q2 2024',
        period_start: '2024-04-01',
        period_end: '2024-06-30',
        output_vat: 18500,
        input_vat: 9200,
        net_vat: 9300,
        status: 'pending',
        due_date: '2024-07-28',
        filing_deadline: '2024-07-28',
        payment_deadline: '2024-07-28',
        created_at: '2024-07-01',
      },
    ];
  }

  // Handle TRN validation
  const handleTrnChange = (value: string) => {
    setTrn(value);
    if (value.length >= 15) {
      setTrnValid(validateTRN(value).isValid);
    } else {
      setTrnValid(null);
    }
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = (dueDate: string): number => {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const pendingReturn = vatReturns.find(r => r.status === 'pending');
  const daysUntilDeadline = pendingReturn?.due_date ? getDaysUntilDeadline(pendingReturn.due_date) : null;

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
                <h1 className="text-xl font-bold text-gray-900">{t('vat.title')}</h1>
                <p className="text-sm text-gray-500">UAE Federal Tax Authority - 5% VAT</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Report</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filing Deadline Alert */}
        {pendingReturn && daysUntilDeadline !== null && daysUntilDeadline <= 14 && (
          <div className={`mb-6 p-5 rounded-xl ${daysUntilDeadline <= 7 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle className={`w-6 h-6 ${daysUntilDeadline <= 7 ? 'text-red-600' : 'text-yellow-600'}`} />
              <div>
                <h3 className={`font-semibold ${daysUntilDeadline <= 7 ? 'text-red-800' : 'text-yellow-800'}`}>
                  {t('vat.filingDeadline')} Approaching
                </h3>
                <p className={`text-sm ${daysUntilDeadline <= 7 ? 'text-red-700' : 'text-yellow-700'}`}>
                  {daysUntilDeadline} days remaining to file Q{Math.ceil((new Date().getMonth() + 1) / 3)} VAT return
                </p>
              </div>
            </div>
            <button className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors
              ${daysUntilDeadline <= 7 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}>
              File Now
            </button>
          </div>
        )}

        {/* TRN Registration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('vat.trn')}</h3>
              <p className="text-sm text-gray-500">Tax Registration Number</p>
            </div>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className="flex-1 relative">
              <input
                type="text"
                value={trn}
                onChange={(e) => handleTrnChange(e.target.value)}
                placeholder="100XXXXXXXXXXXX"
                maxLength={15}
                className={`w-full px-4 py-3 border rounded-lg font-mono text-lg tracking-wider
                  ${trnValid === true ? 'border-green-500 bg-green-50' : 
                    trnValid === false ? 'border-red-500 bg-red-50' : 
                    'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
              {trnValid !== null && (
                <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2`}>
                  {trnValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
            </div>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Verify TRN
            </button>
          </div>
          
          {trnValid === false && (
            <p className="mt-2 text-sm text-red-600">
              Invalid TRN format. Must be 15 digits starting with 100.
            </p>
          )}
          
          <div className={`flex items-center gap-2 mt-4 text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Info className="w-4 h-4" />
            <span>TRN is required for businesses with taxable supplies over AED 375,000/year</span>
          </div>
        </div>

        {/* VAT Position Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Output VAT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('vat.outputVat')}</p>
                  <p className="text-xs text-gray-400">VAT on Sales</p>
                </div>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatAED(vatPosition?.output_vat || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Based on sales of {formatAED((vatPosition?.output_vat || 0) * 20)}
            </p>
          </div>

          {/* Input VAT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('vat.inputVat')}</p>
                  <p className="text-xs text-gray-400">VAT on Purchases</p>
                </div>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatAED(vatPosition?.input_vat || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Based on purchases of {formatAED((vatPosition?.input_vat || 0) * 20)}
            </p>
          </div>

          {/* Net VAT */}
          <div className={`rounded-xl shadow-sm border p-5 ${
            (vatPosition?.net_vat || 0) > 0 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  (vatPosition?.net_vat || 0) > 0 ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <Percent className={`w-5 h-5 ${
                    (vatPosition?.net_vat || 0) > 0 ? 'text-orange-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('vat.netVat')}</p>
                  <p className="text-xs text-gray-400">
                    {(vatPosition?.net_vat || 0) > 0 ? t('vat.payable') : t('vat.refundable')}
                  </p>
                </div>
              </div>
            </div>
            <p className={`text-3xl font-bold ${
              (vatPosition?.net_vat || 0) > 0 ? 'text-orange-700' : 'text-green-700'
            }`}>
              {formatAED(Math.abs(vatPosition?.net_vat || 0))}
            </p>
            <p className={`text-sm mt-2 ${
              (vatPosition?.net_vat || 0) > 0 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {(vatPosition?.net_vat || 0) > 0 
                ? 'Amount to pay to FTA' 
                : 'Amount claimable from FTA'}
            </p>
          </div>
        </div>

        {/* VAT Rate Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">VAT Rate Categories</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Standard Rate */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-medium text-gray-900">Standard Rate</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">5%</p>
              <p className="text-xs text-gray-500 mt-1">Most goods & services</p>
            </div>
            
            {/* Zero Rate */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-medium text-gray-900">Zero Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-600">0%</p>
              <p className="text-xs text-gray-500 mt-1">Exports, healthcare, education</p>
            </div>
            
            {/* Exempt */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="font-medium text-gray-900">Exempt</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">N/A</p>
              <p className="text-xs text-gray-500 mt-1">Residential rent, life insurance</p>
            </div>
          </div>
        </div>

        {/* VAT Returns History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`p-5 border-b border-gray-100 ${isRTL ? 'text-right' : ''}`}>
            <h3 className="font-semibold text-gray-900">VAT Returns History</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {vatReturns.map((vatReturn) => (
              <div key={vatReturn.id} className={`p-5 hover:bg-gray-50 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      vatReturn.status === 'filed' ? 'bg-green-100' : 
                      vatReturn.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {vatReturn.status === 'filed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <h4 className="font-medium text-gray-900">
                          Q{Math.ceil((new Date(vatReturn.period_start).getMonth() + 1) / 3)} {new Date(vatReturn.period_start).getFullYear()}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          vatReturn.status === 'filed' ? 'bg-green-100 text-green-700' :
                          vatReturn.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {vatReturn.status.charAt(0).toUpperCase() + vatReturn.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(vatReturn.period_start).toLocaleDateString()} - {new Date(vatReturn.period_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                    <p className={`text-xl font-bold ${vatReturn.net_vat > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatAED(vatReturn.net_vat)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vatReturn.status === 'filed' && vatReturn.filed_date
                        ? `Filed ${new Date(vatReturn.filed_date).toLocaleDateString()}`
                        : vatReturn.due_date
                          ? `Due ${new Date(vatReturn.due_date).toLocaleDateString()}`
                          : ''}
                    </p>
                  </div>
                </div>
                
                {/* VAT Breakdown */}
                <div className={`mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 ${isRTL ? 'text-right' : ''}`}>
                  <div>
                    <p className="text-xs text-gray-500">{t('vat.outputVat')}</p>
                    <p className="font-medium text-gray-900">{formatAED(vatReturn.output_vat)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('vat.inputVat')}</p>
                    <p className="font-medium text-gray-900">{formatAED(vatReturn.input_vat)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('vat.netVat')}</p>
                    <p className={`font-medium ${vatReturn.net_vat > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatAED(vatReturn.net_vat)}
                    </p>
                  </div>
                </div>
                
                {vatReturn.status === 'pending' && (
                  <div className="mt-4">
                    <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                      File This Return
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FTA Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Federal Tax Authority (FTA)</h4>
              <p className="text-sm text-blue-700 mt-1">
                For VAT registration, filing, and inquiries, visit the official FTA portal.
              </p>
              <a 
                href="https://tax.gov.ae" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Visit FTA Portal
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
