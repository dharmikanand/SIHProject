import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  BarChart3, 
  Mic, 
  Globe, 
  PlusCircle, 
  ShieldCheck,
  Building2,
  ChevronDown,
  MessageSquare,
  Scale
} from 'lucide-react';

export default function Navbar() {
  const { 
    language, 
    setLanguage, 
    persona, 
    setPersona, 
    cart, 
    setActiveModal, 
    t 
  } = useApp();

  const personas = [
    { id: 'buyer', label: '🛒 Buyer Market', desc: 'Direct Produce & Group Buying' },
    { id: 'farmer', label: '🌾 Farmer / FPO', desc: 'List Crops & View Escrow' },
    { id: 'logistics', label: '🚚 OR-Tools & PostGIS', desc: 'Cluster Milk-Run Fleet' },
    { id: 'ai-forecast', label: '📈 Prophet Forecast', desc: 'Agmarknet & Price Shocks' },
    { id: 'enam-audit', label: '⚖️ eNAM Audit', desc: 'Hackathon Winning Differentiator' },
    { id: 'impact', label: '🏛️ National Impact', desc: 'DoCA Policy Metrics' }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all">
      
      {/* Top Ministry Banner */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Smart India Hackathon 2026</span>
          <span className="text-stone-500">|</span>
          <span className="text-stone-300">Problem Statement ID: <strong className="text-emerald-400 font-mono">26033</strong></span>
          <span className="hidden md:inline text-stone-500">|</span>
          <span className="hidden md:inline text-stone-400">Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-medium hidden sm:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Razorpay Escrow Guaranteed
          </span>
          <div className="flex items-center gap-1 text-stone-400 text-xs">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white text-[11px] font-medium focus:outline-none cursor-pointer hover:text-emerald-300"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-stone-900 text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div 
            onClick={() => setPersona('buyer')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-stone-900">
                  {t('brandName')}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Direct Grid 2.0
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium -mt-0.5">
                {t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setActiveModal('notifications-gateway')}
              className="p-2 bg-stone-100 text-stone-800 rounded-xl"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveModal('voice-assistant')}
              className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveModal('cart')}
              className="p-2 bg-stone-100 text-stone-800 rounded-xl relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Persona Navigation Pills */}
        <nav className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 overflow-x-auto max-w-full">
          {personas.map((p) => {
            const isActive = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-emerald-950 shadow-sm border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          
          {/* SMS / WhatsApp Gateway Button */}
          <button
            onClick={() => setActiveModal('notifications-gateway')}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition border border-stone-300/80"
            title="Twilio / MSG91 Vernacular Notifications Gateway"
          >
            <MessageSquare className="w-4 h-4 text-stone-700" />
          </button>

          {/* Voice Assistant Button */}
          <button
            onClick={() => setActiveModal('voice-assistant')}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 rounded-xl text-xs font-bold transition shadow-sm group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Mic className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition" />
            <span>वाणी AI</span>
          </button>

          {/* Quick List Crop Button */}
          <button
            onClick={() => {
              setPersona('farmer');
              setActiveModal('add-listing');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>List Crop</span>
          </button>

          {/* Basket Button */}
          <button
            onClick={() => setActiveModal('cart')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-700/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Basket</span>
            {cart.length > 0 && (
              <span className="bg-white text-emerald-800 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                {cart.length}
              </span>
            )}
          </button>

        </div>

      </div>

    </header>
  );
}
