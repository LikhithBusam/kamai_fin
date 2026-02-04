// StoreBuddy - Business Health Page
// 7-dimension health scoring system

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { healthAPI } from '@/services/uaeApi';
import { formatAED, formatPercentage, getHealthStatusColor } from '@/lib/uaeUtils';
import type { BusinessHealthScore, HealthDimension } from '@/types/uae';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Droplets,
  CreditCard,
  PiggyBank,
  BarChart3,
  Scale,
  Shield,
  ArrowLeft,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

// Helper function to extract score value from HealthDimension or number
const getScoreValue = (dimension: HealthDimension | number | undefined): number => {
  if (dimension === undefined || dimension === null) return 0;
  if (typeof dimension === 'number') return dimension;
  if (typeof dimension === 'object' && 'score' in dimension) return dimension.score;
  return 0;
};

// Health dimension configuration
const DIMENSIONS = [
  {
    key: 'profitability',
    label: 'Profitability',
    icon: TrendingUp,
    color: 'emerald',
    weight: 30,
    description: 'Revenue vs expenses ratio and margin trends',
  },
  {
    key: 'liquidity',
    label: 'Liquidity',
    icon: Droplets,
    color: 'blue',
    weight: 20,
    description: 'Cash flow and ability to meet short-term obligations',
  },
  {
    key: 'credit_health',
    label: 'Credit Health',
    icon: CreditCard,
    color: 'purple',
    weight: 15,
    description: 'Outstanding credit quality and collection efficiency',
  },
  {
    key: 'expense_control',
    label: 'Expense Control',
    icon: PiggyBank,
    color: 'orange',
    weight: 10,
    description: 'Operating expenses relative to industry benchmarks',
  },
  {
    key: 'growth',
    label: 'Growth',
    icon: BarChart3,
    color: 'cyan',
    weight: 10,
    description: 'Revenue and customer growth trends',
  },
  {
    key: 'debt_burden',
    label: 'Debt Burden',
    icon: Scale,
    color: 'red',
    weight: 10,
    description: 'Debt-to-income ratio and repayment capacity',
  },
  {
    key: 'compliance',
    label: 'Compliance',
    icon: Shield,
    color: 'indigo',
    weight: 5,
    description: 'VAT filing, license renewals, regulatory compliance',
  },
];

export default function BusinessHealthPage() {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  
  // State
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState<BusinessHealthScore | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  
  const userId = 'demo-user';

  // Fetch health data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await healthAPI.getHealthScore(userId) as { data?: typeof healthScore };
        
        if (res?.data) {
          setHealthScore(res.data);
        } else {
          // Mock data for demo
          setHealthScore(generateMockHealthScore());
        }
      } catch (err) {
        console.error('Health fetch error:', err);
        setHealthScore(generateMockHealthScore());
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [userId]);

  // Generate mock health score
  function generateMockHealthScore(): BusinessHealthScore {
    return {
      overall_score: 72,
      status: 'success',
      health_level: 'GOOD',
      health_color: 'blue',
      health_emoji: '👍',
      dimensions: {
        profitability: 78,
        liquidity: 65,
        credit_health: 82,
        expense_control: 58,
        growth: 75,
        debt_burden: 70,
        compliance: 90,
      },
      top_issues: [
        { dimension: 'expense_control', score: 58, insight: 'High utility costs detected' }
      ],
      strengths: [
        { dimension: 'compliance', score: 90, insight: 'Excellent compliance record' }
      ],
      recommendations: [
        {
          dimension: 'expense_control',
          priority: 'high',
          suggestion: 'Reduce utility costs by switching to energy-efficient appliances',
          potential_impact: 2500,
        },
        {
          dimension: 'liquidity',
          priority: 'medium',
          suggestion: 'Build emergency fund of 3 months operating expenses',
          potential_impact: 15000,
        },
        {
          dimension: 'growth',
          priority: 'low',
          suggestion: 'Consider adding online sales channel to increase revenue',
          potential_impact: 5000,
        },
      ],
      business_type: 'general',
      trend: 'improving',
      last_month_score: 68,
      calculated_at: new Date().toISOString(),
    };
  }

  // Get grade info
  const getGradeInfo = (score: number) => {
    if (score >= 80) return { grade: 'A', label: t('health.excellent'), color: 'emerald', emoji: '🌟' };
    if (score >= 60) return { grade: 'B', label: t('health.good'), color: 'blue', emoji: '👍' };
    if (score >= 40) return { grade: 'C', label: t('health.fair'), color: 'yellow', emoji: '⚠️' };
    if (score >= 20) return { grade: 'D', label: t('health.poor'), color: 'orange', emoji: '🔻' };
    return { grade: 'F', label: t('health.critical'), color: 'red', emoji: '🚨' };
  };

  // Get dimension score color
  const getDimensionColor = (score: number): string => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const gradeInfo = healthScore ? getGradeInfo(healthScore.overall_score) : null;
  const scoreChange = healthScore ? healthScore.overall_score - (healthScore.last_month_score || healthScore.overall_score) : 0;

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className={`w-5 h-5 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('health.title')}</h1>
              <p className="text-sm text-gray-500">7-Dimension Health Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overall Score Card */}
        {healthScore && gradeInfo && (
          <div className={`bg-gradient-to-br from-${gradeInfo.color}-500 to-${gradeInfo.color}-700 rounded-2xl p-6 mb-6 text-white`}
            style={{ 
              background: gradeInfo.color === 'emerald' ? 'linear-gradient(135deg, #10b981, #047857)' :
                         gradeInfo.color === 'blue' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                         gradeInfo.color === 'yellow' ? 'linear-gradient(135deg, #eab308, #ca8a04)' :
                         gradeInfo.color === 'orange' ? 'linear-gradient(135deg, #f97316, #ea580c)' :
                         'linear-gradient(135deg, #ef4444, #dc2626)'
            }}>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Overall Health Score</p>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-6xl font-bold">{healthScore.overall_score}</span>
                  <div>
                    <div className="bg-white/20 px-3 py-1 rounded-lg text-lg font-bold">
                      Grade {gradeInfo.grade}
                    </div>
                    <p className="text-white/80 text-sm mt-1">{gradeInfo.label}</p>
                  </div>
                </div>
                
                {/* Trend */}
                <div className={`flex items-center gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {healthScore.trend === 'improving' ? (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm">+{scoreChange} points from last month</span>
                    </>
                  ) : healthScore.trend === 'declining' ? (
                    <>
                      <TrendingDown className="w-5 h-5" />
                      <span className="text-sm">{scoreChange} points from last month</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      <span className="text-sm">Stable from last month</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Emoji */}
              <div className="hidden sm:flex items-center justify-center text-6xl">
                {gradeInfo.emoji}
              </div>
            </div>
          </div>
        )}

        {/* Dimension Cards */}
        <div className="space-y-4 mb-6">
          <h2 className="font-semibold text-gray-900">Health Dimensions</h2>
          
          {DIMENSIONS.map((dimension) => {
            const rawScore = healthScore?.dimensions?.[dimension.key as keyof typeof healthScore.dimensions];
            const score = getScoreValue(rawScore);
            const isExpanded = expandedDimension === dimension.key;
            const Icon = dimension.icon;
            
            return (
              <div 
                key={dimension.key}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedDimension(isExpanded ? null : dimension.key)}
                  className={`w-full p-5 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${dimension.color}-100`}
                        style={{
                          backgroundColor: 
                            dimension.color === 'emerald' ? '#d1fae5' :
                            dimension.color === 'blue' ? '#dbeafe' :
                            dimension.color === 'purple' ? '#ede9fe' :
                            dimension.color === 'orange' ? '#ffedd5' :
                            dimension.color === 'cyan' ? '#cffafe' :
                            dimension.color === 'red' ? '#fee2e2' :
                            '#e0e7ff'
                        }}>
                        <Icon className={`w-6 h-6`}
                          style={{
                            color:
                              dimension.color === 'emerald' ? '#10b981' :
                              dimension.color === 'blue' ? '#3b82f6' :
                              dimension.color === 'purple' ? '#8b5cf6' :
                              dimension.color === 'orange' ? '#f97316' :
                              dimension.color === 'cyan' ? '#06b6d4' :
                              dimension.color === 'red' ? '#ef4444' :
                              '#6366f1'
                          }} />
                      </div>
                      
                      <div>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <h3 className="font-semibold text-gray-900">{dimension.label}</h3>
                          <span className="text-xs text-gray-400">{dimension.weight}% weight</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{dimension.description}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(score)}</p>
                        <p className="text-xs text-gray-500">/ 100</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getDimensionColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </button>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div className={`px-5 pb-5 border-t border-gray-100 ${isRTL ? 'text-right' : ''}`}>
                    <div className="pt-4">
                      {/* Score Breakdown */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Current</p>
                          <p className="text-xl font-bold text-gray-900">{Math.round(score)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Target</p>
                          <p className="text-xl font-bold text-gray-900">80</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Gap</p>
                          <p className={`text-xl font-bold ${score >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                            {score >= 80 ? '+' : ''}{Math.round(score - 80)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                        score >= 80 ? 'bg-green-50' :
                        score >= 60 ? 'bg-blue-50' :
                        score >= 40 ? 'bg-yellow-50' : 'bg-red-50'
                      }`}>
                        {score >= 60 ? (
                          <CheckCircle className={`w-5 h-5 ${score >= 80 ? 'text-green-600' : 'text-blue-600'}`} />
                        ) : (
                          <AlertTriangle className={`w-5 h-5 ${score >= 40 ? 'text-yellow-600' : 'text-red-600'}`} />
                        )}
                        <span className={`text-sm font-medium ${
                          score >= 80 ? 'text-green-700' :
                          score >= 60 ? 'text-blue-700' :
                          score >= 40 ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                          {score >= 80 ? 'Excellent performance in this area' :
                           score >= 60 ? 'Good, but room for improvement' :
                           score >= 40 ? 'Needs attention' : 'Critical - immediate action required'}
                        </span>
                      </div>
                      
                      {/* Improvement Tips */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Tips to Improve</span>
                        </div>
                        <ul className={`space-y-2 text-sm text-blue-700 ${isRTL ? 'pr-7' : 'pl-7'} list-disc`}>
                          {dimension.key === 'profitability' && (
                            <>
                              <li>Review pricing strategy for better margins</li>
                              <li>Focus on high-margin products</li>
                              <li>Reduce supplier costs through negotiation</li>
                            </>
                          )}
                          {dimension.key === 'liquidity' && (
                            <>
                              <li>Build 3-month emergency fund</li>
                              <li>Reduce payment terms to customers</li>
                              <li>Negotiate longer terms with suppliers</li>
                            </>
                          )}
                          {dimension.key === 'credit_health' && (
                            <>
                              <li>Follow up on overdue payments</li>
                              <li>Set credit limits for new customers</li>
                              <li>Offer early payment discounts</li>
                            </>
                          )}
                          {dimension.key === 'expense_control' && (
                            <>
                              <li>Review recurring expenses monthly</li>
                              <li>Compare utility rates and switch if beneficial</li>
                              <li>Automate where possible to reduce labor costs</li>
                            </>
                          )}
                          {dimension.key === 'growth' && (
                            <>
                              <li>Add online sales channels</li>
                              <li>Implement customer loyalty program</li>
                              <li>Expand product range strategically</li>
                            </>
                          )}
                          {dimension.key === 'debt_burden' && (
                            <>
                              <li>Prioritize high-interest debt repayment</li>
                              <li>Consider debt consolidation</li>
                              <li>Avoid new debt unless essential</li>
                            </>
                          )}
                          {dimension.key === 'compliance' && (
                            <>
                              <li>File VAT returns on time</li>
                              <li>Keep trade license updated</li>
                              <li>Maintain proper records for 5 years</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Recommendations */}
        {healthScore?.recommendations && healthScore.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="font-semibold text-gray-900">AI Recommendations</h2>
            </div>
            
            <div className="space-y-4">
              {healthScore.recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {String(rec.priority).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        rec.priority === 'high' ? 'text-red-900' :
                        rec.priority === 'medium' ? 'text-yellow-900' :
                        'text-blue-900'
                      }`}>
                        {rec.suggestion}
                      </p>
                      <div className={`flex items-center gap-2 mt-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-500">Potential Impact:</span>
                        <span className="font-medium text-emerald-600">
                          {formatAED(rec.potential_impact)}/month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
