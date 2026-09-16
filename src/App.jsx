import React, { lazy, Suspense, useEffect } from 'react';
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
import VoiceFab from './components/VoiceFab';
import LoginPage from './pages/LoginPage';

// Code-split persona pages: keeps initial bundle small for rural 3G networks (NFR-1).
const BuyerMarketplace = lazy(() => import('./pages/BuyerMarketplace'));
const FarmerDashboard = lazy(() => import('./pages/FarmerDashboard'));
const LogisticsDashboard = lazy(() => import('./pages/LogisticsDashboard'));
const AIForecastPage = lazy(() => import('./pages/AIForecastPage'));
const ENAMComparisonPage = lazy(() => import('./pages/ENAMComparisonPage')); // retained: reachable from Impact (policy benchmark)
const NationalImpactDashboard = lazy(() => import('./pages/NationalImpactDashboard'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));

import { Sprout, Heart } from 'lucide-react';

function PageLoader() {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4" role="status" aria-live="polite">
      <div className="w-10 h-10 rounded-full border-2 border-hairline border-t-field-500 animate-spin" />
      <p className="eyebrow">{t('loadingModule')}</p>
    </div>
  );
}

function MainContent() {
  const { persona, setPersona, user, activeModal, setActiveModal, t } = useApp();

  // Impact page can open the eNAM audit as a full-screen policy overlay (any role).
  // Hook declared unconditionally, before any early return.
  useEffect(() => {
    const open = () => setActiveModal('enam-audit');
    window.addEventListener('open-enam-audit', open);
    return () => window.removeEventListener('open-enam-audit', open);
  }, [setActiveModal]);

  // Auth gate: no session → editorial login page. All modals/toasts still mounted so
  // the login page stays clean while the rest of the app stays warm.
  if (!user) {
    return (
      <div className="min-h-screen bg-paper text-ink font-sans">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  // RBAC guard: a role can never render the other role's private surface
  const roleAllowed =
    (persona === 'buyer' && user.role === 'buyer') ||
    (persona === 'farmer' && user.role === 'farmer') ||
    ['orders', 'logistics', 'ai-forecast', 'impact'].includes(persona);
  if (!roleAllowed) {
    setPersona(user.role === 'farmer' ? 'farmer' : 'buyer');
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Persona Page Content (lazy-loaded, error-isolated) */}
      <main className="flex-1 pb-16">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            {persona === 'buyer' && user.role === 'buyer' && <BuyerMarketplace />}
            {persona === 'farmer' && user.role === 'farmer' && <FarmerDashboard />}
            {persona === 'orders' && <MyOrdersPage />}
            {persona === 'logistics' && <LogisticsDashboard />}
            {persona === 'ai-forecast' && <AIForecastPage />}
            {persona === 'impact' && <NationalImpactDashboard />}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* eNAM audit overlay (opened from Impact policy section) */}
      {activeModal === 'enam-audit' && (
        <div className="fixed inset-0 z-50 bg-paper overflow-y-auto animate-fadeIn">
          <div className="sticky top-0 bg-paper/95 backdrop-blur-sm border-b border-hairline px-4 sm:px-8 py-3 flex items-center justify-between z-10">
            <p className="eyebrow">{t('enamOverlayTitle')}</p>
            <button
              onClick={() => setActiveModal(null)}
              className="px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-ink-2 border border-hairline rounded-sm hover:bg-paper-2 transition"
            >
              ✕ {t('closeLabel')}
            </button>
          </div>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <ENAMComparisonPage />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      {/* Floating voice-AI launcher (bottom-right) */}
      <VoiceFab />

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
      <footer className="bg-ink text-ink-3 text-xs py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-field-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-field-500 flex items-center justify-center text-paper font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-paper font-display font-semibold text-lg">KrishiSetu 2.0</h4>
                <p className="text-[11px] text-ink-3">
                  {t('footerNational')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-widest">
              <span className="border border-field-700 px-3 py-1.5 rounded-sm text-ink-3">
                {t('footerMinistry')}
              </span>
              <span className="text-field-400 border border-field-700 px-3 py-1.5 rounded-sm">
                Department of Consumer Affairs (DoCA)
              </span>
              <span className="border border-field-700 px-3 py-1.5 rounded-sm font-mono text-harvest-200">
                SIH 2026 • PS ID: 26033
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[11px] leading-relaxed">
            <div>
              <p className="text-paper font-bold uppercase tracking-widest mb-2">{t('footerPsTitle')}</p>
              <p className="text-ink-3">
                {t('footerPsBody')}
              </p>
            </div>

            <div>
              <p className="text-paper font-bold uppercase tracking-widest mb-2">{t('footerTechTitle')}</p>
              <ul className="space-y-1 text-ink-3">
                {t('footerTechItems').map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-paper font-bold uppercase tracking-widest mb-2">{t('footerProtectionTitle')}</p>
              <ul className="space-y-1 text-ink-3">
                {t('footerProtectionItems').map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-paper font-bold uppercase tracking-widest mb-2">{t('footerWhyEnamTitle')}</p>
              <p className="text-ink-3">
                {t('footerWhyEnamBody')}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-field-700 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-3 gap-3">
            <span>{t('footerRights')}</span>
            <span className="flex items-center gap-1">
              {t('footerMadeWith')} <Heart className="w-3 h-3 text-red-500 fill-red-500" />
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
