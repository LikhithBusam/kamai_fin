<div align="center">

# 🏪 StoreBuddy UAE

### AI-Powered Financial Companion for UAE Retail & Distribution Businesses

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

<br/>

**Empowering UAE small businesses with intelligent financial management**

[Features](#-features) | [Installation](#-installation) | [Tech Stack](#-tech-stack) | [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [UAE-Specific Tools](#-uae-specific-tools)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)

---

## 🎯 Overview

**StoreBuddy UAE** is a comprehensive financial management platform designed specifically for UAE's retail and distribution businesses. From small grocery stores (baqalas) to electronics shops and pharmacies, StoreBuddy helps business owners manage their finances, track VAT compliance, and grow their business.

### Why StoreBuddy?

| Challenge | StoreBuddy Solution |
|-----------|-------------------|
| **VAT Compliance** | Automated 5% VAT tracking & FTA-ready reports |
| **Customer Credit (Udhar)** | Trust score system & collection priority |
| **Cash Flow Management** | Real-time income/expense tracking |
| **Business Growth** | UAE SME program matching & funding access |
| **Financial Health** | 7-dimension business health scoring |

---

## ✨ Features

### Core Financial Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Real-time business overview with UAE-specific insights |
| 💰 **Transactions** | Income & expense tracking in AED |
| 📈 **Budget Management** | Adaptive budgeting for feast/famine periods |
| 🎯 **Financial Goals** | Set and track savings & investment goals |
| 💳 **Bill Payments** | Priority-based payment scheduling |
| 📱 **SMS Import** | Parse bank SMS for automatic transaction logging |

### Analytics & Insights

| Feature | Description |
|---------|-------------|
| 📊 **Statistics** | Revenue trends, expense analysis, profit margins |
| 🔮 **Cash Flow Forecasting** | Predict future cash position |
| ⚠️ **Risk Assessment** | Identify business vulnerabilities |
| 💡 **AI Recommendations** | Personalized financial advice |

---

## 🇦🇪 UAE-Specific Tools

### 1. VAT Management (`/vat`)
- **5% VAT** tracking (UAE standard rate)
- Input/Output VAT calculation
- Quarterly filing reminders
- FTA-compliant report generation
- Tax Registration Number (TRN) management

### 2. Credit Book - Udhar System (`/credit-book`)
- Customer credit tracking
- **Trust Score** algorithm (0-100)
- Collection priority recommendations
- Payment reminder system
- WhatsApp integration for reminders

### 3. Business Health Score (`/business-health`)
7-dimension scoring system:
- 📈 Profitability (30%)
- 💧 Liquidity (20%)
- 💳 Credit Health (15%)
- 💰 Expense Control (10%)
- 🚀 Growth (10%)
- ⚖️ Debt Burden (10%)
- 🛡️ Compliance (5%)

### 4. UAE SME Programs (`/uae-programs`)
Access to 8+ government & private funding programs:
- **Dubai SME** - Up to AED 15M funding
- **Khalifa Fund** - Interest-free loans (Abu Dhabi)
- **Emirates Development Bank** - Term loans up to AED 50M
- **Mohammed Bin Rashid Fund** - Soft loans
- **in5 Dubai** - Innovation incubator
- **Sharjah Entrepreneurship Center**
- **RAKCEZ Programs**
- And more...

### 5. Tax Information (`/tax`)
- **0% Personal Income Tax** - UAE benefit
- **5% VAT** compliance
- **9% Corporate Tax** information (profits > AED 375,000)
- VAT Calculator
- Compliance checklist

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **Shadcn/UI** | Component Library |
| **Framer Motion** | Animations |
| **React Router** | Navigation |
| **Recharts** | Data Visualization |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL Database |
| **Supabase Auth** | Authentication |
| **Row Level Security** | Data Protection |

### Additional Libraries
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kamai-main/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:8080
   ```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Shadcn/UI components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── AppContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   │   ├── supabase.ts
│   │   ├── uaeUtils.ts
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── VATManagementPage.tsx
│   │   ├── CreditBookPage.tsx
│   │   ├── BusinessHealthPage.tsx
│   │   ├── UAEProgramsPage.tsx
│   │   ├── Tax.tsx
│   │   └── ...
│   ├── services/          # API & database services
│   │   ├── database.ts
│   │   ├── uaeApi.ts
│   │   └── api.ts
│   ├── types/             # TypeScript types
│   │   └── uae.ts
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── .env                   # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔐 Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API (Optional - for AI features)
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📱 Screenshots

### Dashboard
- Real-time business overview
- UAE Business Tools quick access
- Recent transactions
- AI-powered recommendations

### VAT Management
- Input/Output VAT tracking
- Quarterly filing status
- FTA-compliant reports

### Credit Book
- Customer list with trust scores
- Outstanding balance tracking
- Collection priority

### Business Health
- 7-dimension radar chart
- Health score breakdown
- Improvement recommendations

---

## 🌐 Supported Languages

- 🇬🇧 English
- 🇦🇪 Arabic (العربية)
- 🇮🇳 Hindi (हिंदी)
- 🇵🇰 Urdu (اردو)

---

## 📄 License

This project is proprietary software developed for UAE retail businesses.

---

## 🤝 Support

For support or queries, contact the development team.

---

<div align="center">

**Built with ❤️ for UAE Small Businesses**

🇦🇪 Dubai | Abu Dhabi | Sharjah | Ajman | RAK | Fujairah | UAQ 🇦🇪

</div>
