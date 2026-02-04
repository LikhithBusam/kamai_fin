# StoreBuddy UAE - Frontend

AI-Powered Financial Companion for UAE Retail & Distribution Businesses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:8080`

## 🔧 Configuration

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (App, Language)
├── hooks/          # Custom hooks
├── lib/            # Utilities & helpers
├── pages/          # Page components
├── services/       # API & database services
├── types/          # TypeScript definitions
├── App.tsx         # Main app with routes
└── main.tsx        # Entry point
```

## 🇦🇪 Key Features

- **VAT Management** - 5% UAE VAT tracking & compliance
- **Credit Book** - Customer credit (Udhar) with trust scores
- **Business Health** - 7-dimension health scoring
- **UAE Programs** - Access to 8+ SME funding programs
- **Multi-language** - English, Arabic, Hindi, Urdu

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn/UI
- Supabase (database & auth)
- Framer Motion (animations)
- Recharts (charts)

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/auth` | Login/Signup |
| `/dashboard` | Main dashboard |
| `/transactions` | Transaction history |
| `/budget` | Budget management |
| `/goals` | Financial goals |
| `/savings` | Savings & investments |
| `/tax` | UAE Tax & VAT info |
| `/vat` | VAT Management |
| `/credit-book` | Customer credit tracking |
| `/business-health` | Business health score |
| `/uae-programs` | UAE SME programs |
| `/benefits` | Business benefits |
| `/profile` | User profile |

## 📱 Responsive Design

- Mobile-first approach
- Bottom navigation on mobile
- Sidebar navigation on desktop
- Fully responsive components

---

Built for UAE Small Businesses 🇦🇪
