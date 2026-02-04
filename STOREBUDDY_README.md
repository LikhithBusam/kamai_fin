<div align="center">

# 🏪 StoreBuddy UAE

### AI-Powered Financial Companion for UAE Shop Owners

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Azure OpenAI](https://img.shields.io/badge/Azure_OpenAI-GPT--4-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)

<br/>

**Empowering UAE's 400,000+ SME shop owners with intelligent financial management**

🇦🇪 **AED** | 🕌 **UAE Holidays** | 📊 **5% VAT Compliance** | 🤝 **Udhar (Credit) Book**

</div>

---

## 🎯 Problem Statement

### The UAE Small Shop Owner Challenge

UAE has over **400,000 small and medium enterprises**, with many being small retail shops (baqalas, groceries, electronics, etc.) facing unique challenges:

| Challenge | Impact |
|-----------|--------|
| **Credit (Udhar) Management** | Tracking who owes what, collection follow-ups |
| **VAT Compliance** | 5% VAT filing, TRN management, FTA deadlines |
| **Cash Flow Visibility** | Daily sales vs expenses, seasonal variations |
| **Multi-Language Customers** | Arabic, English, Hindi, Urdu speaking customers |
| **Government Programs** | Unaware of available SME support programs |

---

## 🚀 Our Solution: StoreBuddy UAE

StoreBuddy UAE is an AI-powered financial companion designed specifically for UAE shop owners. It provides:

### 💰 Credit Book (Udhar Management)
- Track customer credit with trust scores (0-100)
- Collection priority recommendations
- WhatsApp/Call integration for follow-ups
- Payment history tracking

### 📊 VAT Compliance
- Automatic VAT calculation (5% standard rate)
- TRN validation and management
- Quarterly filing reminders
- Output/Input VAT tracking

### 🏥 Business Health Score
- 7-dimension health analysis
- Real-time scoring (0-100)
- AI-powered improvement recommendations
- Industry benchmark comparisons

### 🎯 UAE SME Programs
- Matching with 8+ UAE government programs
- Eligibility checking
- Application guidance
- Funding opportunities

### 🌍 Multi-Language Support
- English 🇬🇧
- Arabic 🇦🇪 (RTL support)
- Hindi 🇮🇳
- Urdu 🇵🇰

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    StoreBuddy UAE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Dashboard  │  │ Credit Book │  │    VAT      │        │
│  │  (Health)   │  │  (Udhar)    │  │ Management  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │
│  ┌──────┴────────────────┴────────────────┴──────┐        │
│  │              React + TypeScript               │        │
│  │         (Tailwind CSS + shadcn/ui)           │        │
│  └──────────────────────┬───────────────────────┘        │
│                         │                                  │
├─────────────────────────┼──────────────────────────────────┤
│                         │                                  │
│  ┌──────────────────────┴───────────────────────┐        │
│  │           FastAPI (Python 3.11+)             │        │
│  └──────────────────────┬───────────────────────┘        │
│                         │                                  │
│  ┌──────────────────────┴───────────────────────┐        │
│  │              8 AI Agents                      │        │
│  │  ┌─────────┬─────────┬─────────┬─────────┐  │        │
│  │  │ Profit  │ Credit  │   VAT   │ Health  │  │        │
│  │  │ Agent   │ Risk    │  Agent  │ Agent   │  │        │
│  │  └─────────┴─────────┴─────────┴─────────┘  │        │
│  │  ┌─────────┬─────────┬─────────┬─────────┐  │        │
│  │  │Reorder  │ Programs│ Recom-  │ Sales   │  │        │
│  │  │ Agent   │ Agent   │mendation│ Pattern │  │        │
│  │  └─────────┴─────────┴─────────┴─────────┘  │        │
│  └──────────────────────┬───────────────────────┘        │
│                         │                                  │
├─────────────────────────┼──────────────────────────────────┤
│                         │                                  │
│  ┌──────────────────────┴───────────────────────┐        │
│  │          Supabase (PostgreSQL)               │        │
│  │    16 UAE-specific tables with RLS           │        │
│  └──────────────────────┬───────────────────────┘        │
│                         │                                  │
│  ┌──────────────────────┴───────────────────────┐        │
│  │           Azure OpenAI (GPT-4)               │        │
│  └──────────────────────────────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Agents

| Agent | Purpose | Key Features |
|-------|---------|--------------|
| **Profit Agent** | Profit analysis | Industry benchmarks, margin tracking |
| **Credit Risk Agent** | Customer trust scoring | Payment history, risk levels |
| **VAT Agent** | UAE FTA compliance | TRN validation, return generation |
| **Business Health Agent** | 7-dimension scoring | Comprehensive health analysis |
| **Reorder Agent** | Inventory management | UAE seasonal factors (Ramadan, Eid) |
| **UAE Programs Agent** | Government program matching | 8 SME programs eligibility |
| **Recommendation Agent** | Daily action items | Priority-based suggestions |
| **Sales Pattern Agent** | Sales analysis | UAE weekend, salary patterns |

---

## 🛠 Tech Stack

### Backend
- **Python 3.11+** - Core language
- **FastAPI** - High-performance API
- **Azure OpenAI GPT-4** - AI reasoning
- **httpx** - Async HTTP client

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Database
- **Supabase** - PostgreSQL with real-time
- **Row Level Security** - Data protection

### Internationalization
- **4 Languages** - EN, AR, HI, UR
- **RTL Support** - Arabic, Urdu

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account
- Azure OpenAI API key

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main_uae.py
```

### Environment Variables
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_DEPLOYMENT=gpt-4
```

---

## 📊 UAE-Specific Features

### VAT Rates
| Type | Rate | Examples |
|------|------|----------|
| Standard | 5% | Most goods & services |
| Zero-rated | 0% | Exports, healthcare, education |
| Exempt | N/A | Residential rent, life insurance |

### Seasonal Factors
| Event | Impact | Period |
|-------|--------|--------|
| Ramadan | +40% | 30 days |
| Eid Al Fitr | +50% | 3 days |
| Eid Al Adha | +30% | 4 days |
| Summer | -30% | June-August |
| DSF | +20% | January |

### UAE SME Programs
1. **Dubai SME** - Up to AED 15M funding
2. **Khalifa Fund** - Interest-free loans (Emiratis)
3. **MBRF** - Soft loans
4. **EDB** - Strategic sector financing
5. **in5** - Tech/Media incubator
6. **Sheraa** - Sharjah entrepreneurship
7. **RAK SME** - Northern Emirates support
8. **Expo Live** - Innovation grants

---

## 🗂 Project Structure

```
Kamai-main/
├── backend/
│   ├── main_uae.py              # UAE FastAPI backend
│   ├── agents/
│   │   ├── profit_agent.py      # Profit analysis
│   │   ├── credit_risk_agent.py # Trust scoring
│   │   ├── vat_agent.py         # VAT compliance
│   │   ├── business_health_agent.py
│   │   ├── reorder_agent.py     # Inventory
│   │   ├── uae_programs_agent.py
│   │   ├── recommendation_agent_uae.py
│   │   └── sales_pattern_agent.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardUAE.tsx
│   │   │   ├── CreditBookPage.tsx
│   │   │   ├── VATManagementPage.tsx
│   │   │   ├── BusinessHealthPage.tsx
│   │   │   └── UAEProgramsPage.tsx
│   │   ├── components/
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── BottomNavUAE.tsx
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx
│   │   ├── lib/
│   │   │   ├── i18n.ts          # Translations
│   │   │   └── uaeUtils.ts      # UAE utilities
│   │   ├── services/
│   │   │   └── uaeApi.ts        # API service
│   │   └── types/
│   │       └── uae.ts           # TypeScript types
│   └── package.json
└── database/
    └── storebuddy_uae_schema.sql
```

---

## 🙏 Acknowledgments

- UAE Federal Tax Authority (FTA) for VAT guidelines
- Dubai SME for SME program information
- Khalifa Fund for entrepreneur support resources

---

## 📄 License

MIT License - see LICENSE file

---

<div align="center">

**Built with ❤️ for UAE's hardworking shop owners**

🇦🇪 **د.إ** | **ستور بادي الإمارات** | **स्टोरबडी यूएई**

</div>
