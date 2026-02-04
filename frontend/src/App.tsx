// StoreBuddy - AI-Powered Financial Companion for Retail and Distribution Businesses
// Optimized for UAE retail environments

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";

// Core StoreBuddy Pages
import LandingPage from "./pages/LandingPage";
import FeaturesPage from "./pages/FeaturesPage";
import PhasesPage from "./pages/PhasesPage";
import Auth from "./pages/Auth";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Tips from "./pages/Tips";
import Profile from "./pages/Profile";
import Budget from "./pages/Budget";
import Tax from "./pages/Tax";
import Benefits from "./pages/Benefits";
import RiskDashboard from "./pages/RiskDashboard";
import Actions from "./pages/Actions";
import Goals from "./pages/Goals";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";

// UAE Business Tools (Additional Features)
import CreditBookPage from "./pages/CreditBookPage";
import VATManagementPage from "./pages/VATManagementPage";
import BusinessHealthPage from "./pages/BusinessHealthPage";
import UAEProgramsPage from "./pages/UAEProgramsPage";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      {/* ===== Public Routes ===== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/phases" element={<PhasesPage />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/login" element={<Auth />} />

      {/* ===== Main Dashboard (Protected) ===== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Transactions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Stats />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tips"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Tips />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Budget />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tax"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Tax />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/benefits"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Benefits />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/risk"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RiskDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Actions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Goals />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Savings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ===== UAE Business Tools (Protected) ===== */}
      <Route
        path="/credit-book"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreditBookPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <VATManagementPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business-health"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BusinessHealthPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/uae-programs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UAEProgramsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <LanguageProvider>
          <SidebarProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </SidebarProvider>
        </LanguageProvider>
      </AppProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
