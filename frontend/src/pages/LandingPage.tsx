import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Shield, 
  Store, 
  Calculator, 
  CreditCard, 
  Receipt,
  ChevronRight,
  Linkedin,
  Package,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: Calculator, 
      title: 'AI Profit Analysis', 
      desc: 'Real profit after all costs & VAT',
      color: 'from-emerald-600 to-emerald-700'
    },
    { 
      icon: CreditCard, 
      title: 'Credit Management', 
      desc: 'Track customer Udhar & payments',
      color: 'from-blue-600 to-blue-700'
    },
    { 
      icon: Receipt, 
      title: 'VAT Compliance', 
      desc: 'UAE 5% VAT auto-calculated',
      color: 'from-purple-600 to-purple-700'
    },
    { 
      icon: TrendingUp, 
      title: 'Business Health Score', 
      desc: '7-dimension health assessment',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      icon: Package, 
      title: 'Reorder Intelligence', 
      desc: 'Smart inventory alerts',
      color: 'from-slate-600 to-slate-700'
    },
    { 
      icon: Users, 
      title: 'SME Programs', 
      desc: '8+ UAE funding programs',
      color: 'from-emerald-500 to-emerald-600'
    },
  ];

  const team = [
    {
      name: 'Nikhileswara Rao Sulake',
      role: 'Medical Image Analysis Researcher | Computer Vision & Deep Learning',
      initials: 'NR',
      linkedin: 'https://www.linkedin.com/in/nikhileswara-rao-sulake/'
    },
    {
      name: 'Sai Manikanta Eswar Machara',
      role: 'Computer Vision Researcher | Medical Imaging | Deep Learning',
      initials: 'SM',
      linkedin: 'https://www.linkedin.com/in/sai-manikanta-eswar-machara/'
    },
    {
      name: 'Siva Teja Reddy Annapureddy',
      role: 'Machine Learning Engineer | Generative AI',
      initials: 'ST',
      linkedin: 'https://www.linkedin.com/in/siva-teja-reddy-annapureddy/'
    },
    {
      name: 'Likhith Busam',
      role: 'Agentic AI Specialist | Generative AI',
      initials: 'LB',
      linkedin: 'https://www.linkedin.com/in/likhith-busam-7b465a31b/'
    }
  ];

  const stats = [
    { number: '5M+', label: 'UAE Retail Businesses' },
    { number: '8+', label: 'SME Programs' },
    { number: '5%', label: 'VAT Compliant' },
    { number: '100%', label: 'Data Protected' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Brand Badge */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-medium mb-8"
            >
              <Store size={16} />
              AI-Powered Retail Finance Platform
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                StoreBuddy
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-600 font-normal">
                UAE Retail Intelligence
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed"
            >
              AI-Powered Financial Companion for Retail and Distribution Businesses
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto"
            >
              Track sales, manage credit, calculate VAT, and grow your business with 
              intelligent insights designed for UAE grocery stores, pharmacies, and retail outlets.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/phases')}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg font-medium"
              >
                View Features
                <ChevronRight className="ml-2" size={20} />
              </Button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Complete Retail Business Management
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              AI-powered tools designed for UAE grocery stores, pharmacies, cafeterias, and retail outlets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow border-slate-200">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/features')}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Explore All Features
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-emerald-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-emerald-600 text-white mb-6">About StoreBuddy</Badge>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Built for UAE Retail Economy
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Unlike generic accounting software, StoreBuddy understands the unique needs of 
                UAE retail businesses: credit management (Udhar/Hisab), VAT compliance, 
                multi-currency customers, and seasonal demand patterns.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Track customer credit with 30/60/90+ day aging reports',
                  'Automatic 5% VAT calculation aligned with FTA format',
                  'Match with 8+ UAE SME funding and support programs',
                  'Real-time profit analysis after all costs and expenses'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-slate-600">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate('/phases')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Learn How It Works
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8 bg-white shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Store className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    AI-Powered Intelligence
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Our multi-agent system analyzes your sales, expenses, and credit data 
                    to provide actionable insights for better business decisions.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="font-bold text-emerald-700">7</div>
                      <div className="text-xs text-slate-600">AI Agents</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="font-bold text-emerald-700">7</div>
                      <div className="text-xs text-slate-600">Emirates</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-slate-600">
              Built by AI researchers and ML engineers with deep expertise in financial technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarFallback className="bg-slate-900 text-white text-lg font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-slate-900 mb-2">{member.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{member.role}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(member.linkedin, '_blank')}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Linkedin size={16} />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              Join thousands of UAE retail businesses using AI-powered financial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg font-medium"
              >
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/features')}
                className="border-emerald-300 text-white hover:bg-emerald-700 px-8 py-6 text-lg font-medium"
              >
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
