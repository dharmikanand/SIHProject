import React, { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import PriceBreakdownModal from './components/PriceBreakdownModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import TraceabilityModal from './components/TraceabilityModal';
import AddCropListingModal from './components/AddCropListingModal';
import CartCheckoutModal from './components/CartCheckoutModal';
import QualityAssayingModal from './components/QualityAssayingModal';
import RazorpayModal from './components/RazorpayModal';
import NotificationGatewayModal from './components/NotificationGatewayModal';

// Code-split persona pages: keeps initial bundle small for rural 3G networks (NFR-1).
const BuyerMarketplace = lazy(() => import('./pages/BuyerMarketplace'));
const FarmerDashboard = lazy(() => import('./pages/FarmerDashboard'));
const LogisticsDashboard = lazy(() => import('./pages/LogisticsDashboard'));
const AIForecastPage = lazy(() => import('./pages/AIForecastPage'));
const ENAMComparisonPage = lazy(() => import('./pages/ENAMComparisonPage'));
const NationalImpactDashboard = lazy(() => import('./pages/NationalImpactDashboard'));

import { Sprout, Heart } from 'lucide-react';

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4" role="status" aria-live="polite">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      <p className="text-sm text-stone-500 font-medium">Loading KrishiSetu module…</p>
    </div>
  );
}

function MainContent() {
  const { persona } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Persona Page Content (lazy-loaded, error-isolated) */}
      <main className="flex-1 pb-16">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            {persona === 'buyer' && <BuyerMarketplace />}
            {persona === 'farmer' && <FarmerDashboard />}
            {persona === 'logistics' && <LogisticsDashboard />}
            {persona === 'ai-forecast' && <AIForecastPage />}
            {persona === 'enam-audit' && <ENAMComparisonPage />}
            {persona === 'impact' && <NationalImpactDashboard />}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* All Functional Modals & Toasts */}
      <PriceBreakdownModal />
      <VoiceAssistantModal />
      <TraceabilityModal />
      <AddCropListingModal />
      <CartCheckoutModal />
      <QualityAssayingModal />
      <RazorpayModal />
      <NotificationGatewayModal />
      <ToastContainer />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-black text-base">KrishiSetu (कृषि सेतु) 2.0</h4>
                <p className="text-[11px] text-stone-400">
                  National Direct Agri-Grid & Fair Public Marketplace
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700 text-stone-300">
                Ministry of Consumer Affairs, Food & Public Distribution
              </span>
              <span className="bg-emerald-950/80 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-800">
                Department of Consumer Affairs (DoCA)
              </span>
              <span className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700 text-amber-300 font-mono">
                SIH 2026 • PS ID: 26033
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[11px] leading-relaxed">
            <div>
              <p className="text-stone-200 font-bold uppercase tracking-wider mb-2">Problem Statement</p>
              <p className="text-stone-400">
                Multiple intermediaries reduce farmers earnings and increase consumer prices. KrishiSetu connects farmers/FPOs directly with consumers & bulk buyers, delivers shared logistics, and utilizes AI for demand forecasting & route optimization.
              </p>
            </div>

            <div>
              <p className="text-stone-200 font-bold uppercase tracking-wider mb-2">Core Advanced Tech</p>
              <ul className="space-y-1 text-stone-400">
                <li>• Google OR-Tools VRPTW Solver</li>
                <li>• PostGIS DBSCAN Cluster Aggregator</li>
                <li>• Meta Prophet Price Decomposition</li>
                <li>• Computer Vision Produce Assayer</li>
              </ul>
            </div>

            <div>
              <p className="text-stone-200 font-bold uppercase tracking-wider mb-2">Farmer Protections</p>
              <ul className="space-y-1 text-stone-400">
                <li>• Razorpay Route 85% Split Escrow</li>
                <li>• 5% Dispute Buffer with Pre-Dispatch QA</li>
                <li>• Vernacular Twilio & MSG91 SMS Alerts</li>
                <li>• Direct UPI / Bank Gate-Pass Release</li>
              </ul>
            </div>

            <div>
              <p className="text-stone-200 font-bold uppercase tracking-wider mb-2">Why We Beat eNAM</p>
              <p className="text-stone-400">
                eNAM is Mandi-to-Mandi wholesale for commission agents. KrishiSetu is Farmgate-to-Buyer with physical pickup clustering, digital doorstep assaying, and cold reefer fleet management.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
            <span>© 2026 KrishiSetu. Smart India Hackathon Winning Architecture. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Indian Farmers & Consumers
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
