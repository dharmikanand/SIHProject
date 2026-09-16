import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  ShoppingBag,
  Globe,
  PlusCircle,
  ShieldCheck,
  MessageSquare,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const {
    language,
    setLanguage,
    persona,
    setPersona,
    cart,
    setActiveModal,
    user,
    logout,
    t
  } = useApp();

  // Role-based access control (RBAC) — two clean role worlds:
  //   buyer  → market, my orders, logistics, forecast, impact (eNAM benchmark lives inside Impact)
  //   farmer → farmer portal, my orders, logistics, forecast, impact
  const isFarmer = user?.role === 'farmer';
  const personas = isFarmer
    ? [
        { id: 'farmer', label: t('navFarmer') },
        { id: 'orders', label: t('navMyOrders') },
        { id: 'logistics', label: t('navLogistics') },
        { id: 'ai-forecast', label: t('navForecast') },
        { id: 'impact', label: t('navImpact') }
      ]
    : [
        { id: 'buyer', label: t('navMarket') },
        { id: 'orders', label: t('navMyOrders') },
        { id: 'logistics', label: t('navLogistics') },
        { id: 'ai-forecast', label: t('navForecast') },
        { id: 'impact', label: t('navImpact') }
      ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-hairline">

      {/* Ink ministry strip */}
      <div className="bg-ink text-ink-3 text-meta py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2 uppercase tracking-widest">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-field-400 animate-pulse" />
          <span className="font-semibold text-paper">Smart India Hackathon 2026</span>
          <span className="text-ink-3">·</span>
          <span>PS <strong className="text-field-400 font-mono normal-case">26033</strong></span>
          <span className="hidden md:inline text-ink-3">·</span>
          <span className="hidden md:inline">Department of Consumer Affairs (DoCA)</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-field-400 font-medium hidden sm:inline flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Escrow Guaranteed
          </span>
          <div className="flex items-center gap-1.5 text-ink-3">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
              className="bg-transparent text-paper text-[11px] font-medium focus:outline-none cursor-pointer hover:text-field-400"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-ink text-paper">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => setPersona(isFarmer ? 'farmer' : 'buyer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-sm bg-field-500 flex items-center justify-center text-paper group-hover:bg-field-600 transition">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-semibold text-[22px] tracking-tight text-ink leading-none">
                  {t('brandName')}
                </span>
                <span className="text-meta font-extrabold uppercase tracking-widest text-field-500">
                  Direct&nbsp;Grid&nbsp;2.0
                </span>
              </div>
              <p className="text-[11px] text-ink-2 font-medium mt-0.5">
                {t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* Mobile controls — role-scoped */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={logout}
              aria-label="Log out"
              className="p-2 border border-hairline rounded-sm text-ink-2 hover:text-harvest-500 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal('notifications-gateway')}
              aria-label="Notifications"
              className="p-2 border border-hairline rounded-sm text-ink-2 hover:bg-paper-2 transition"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            {!isFarmer && (
              <button
                onClick={() => setActiveModal('cart')}
                aria-label="Basket"
                className="p-2 border border-hairline rounded-sm text-ink-2 relative hover:bg-paper-2 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-harvest-500 text-paper text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {cart.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Persona tabs — role-scoped, editorial uppercase, hairline underline for active */}
        <nav className="flex items-stretch border-b border-hairline w-full md:w-auto overflow-x-auto">
          {personas.map((p) => {
            const isActive = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-4 py-2.5 text-[12px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  isActive
                    ? 'text-field-500 border-field-500'
                    : 'text-ink-2 border-transparent hover:text-ink'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">

          <button
            onClick={() => setActiveModal('notifications-gateway')}
            title="Vernacular Notifications Gateway"
            aria-label="Notifications"
            className="p-2 border border-hairline hover:bg-paper-2 text-ink-2 rounded-sm transition"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Farmer-only: List Crop */}
          {isFarmer && (
            <button
              onClick={() => setActiveModal('add-listing')}
              className="flex items-center gap-1.5 px-3 py-2 bg-ink hover:bg-field-700 text-paper rounded-sm text-[12px] font-bold uppercase tracking-wide transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('listCrop')}</span>
            </button>
          )}

          {/* Buyer-only: Basket */}
          {!isFarmer && (
            <button
              onClick={() => setActiveModal('cart')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-field-500 hover:bg-field-600 text-paper rounded-sm text-[12px] font-bold uppercase tracking-wide transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('basket')}</span>
              {cart.length > 0 && (
                <span className="bg-paper text-field-700 px-1.5 py-0.5 rounded-full text-[10px] font-black tabular-nums">
                  {cart.length}
                </span>
              )}
            </button>
          )}

          {/* User chip + Logout */}
          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-hairline">
            <div className="text-right hidden xl:block">
              <p className="text-[12px] font-bold text-ink leading-tight max-w-[140px] truncate">
                {user?.name || 'Guest'}
              </p>
              <p className="text-meta uppercase text-ink-3 leading-tight">
                {user?.role === 'farmer' ? 'Farmer' : 'Buyer'}
              </p>
            </div>
            <button
              onClick={logout}
              title="Log out"
              aria-label="Log out"
              className="p-2 border border-hairline hover:border-harvest-500 hover:text-harvest-500 text-ink-2 rounded-sm transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </header>
  );
}
