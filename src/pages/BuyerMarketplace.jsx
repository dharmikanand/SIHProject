import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Scale, 
  QrCode, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Building2, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Tag,
  Scan
} from 'lucide-react';
import { calculatePriceBreakdown } from '../utils/aiForecast';

export default function BuyerMarketplace() {
  const { 
    crops, 
    setSelectedCrop, 
    setActiveModal, 
    addToCart, 
    t 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mode, setMode] = useState('B2C'); // 'B2C' (Retail & Society Group Buying) vs 'B2B' (Institutional Bulk)
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);

  const categories = ['All', 'Vegetables', 'Grains', 'Fruits', 'Spices'];

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmer.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmer.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesOrganic = !showOnlyOrganic || crop.organicCert;
    return matchesSearch && matchesCategory && matchesOrganic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner with Problem Statement Focus */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-stone-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 2026 Problem Statement #26033: Disintermediation Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Buy Direct From Verified Farmers & FPOs. <br />
            <span className="text-emerald-400">Zero Commission Dalals. Fair Prices for All.</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
            Eliminating 4-5 layers of intermediaries ensures farmers earn up to <strong>80% more</strong> while consumers & bulk buyers save <strong>20-30%</strong> on farm-fresh produce with 100% digital escrow guarantee.
          </p>

          {/* Quick Stat Pill Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/15">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>+75% Avg Farmer Payout Gain</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/15">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <span>-25% Consumer Price Drop</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>UPI / Escrow Gate-Pass Safety</span>
            </div>
          </div>
        </div>

        {/* Channel Switcher (B2C vs B2B) */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center bg-stone-800/90 p-1.5 rounded-2xl border border-stone-700/80 w-fit">
            <button
              onClick={() => setMode('B2C')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'B2C'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Consumer Direct & Society Group Buy (B2C)</span>
            </button>
            <button
              onClick={() => setMode('B2B')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'B2B'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Bulk Institutional Procurement (B2B)</span>
            </button>
          </div>

          <div className="text-xs text-stone-300 flex items-center gap-2">
            {mode === 'B2C' ? (
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-xl">
                🏡 Minimum order: 10 kg | Neighborhood group delivery available
              </span>
            ) : (
              <span className="bg-amber-950/80 text-amber-300 border border-amber-800 px-3 py-1.5 rounded-xl">
                🏭 Wholesale contracts: Minimum 250 - 1000 kg | Tiered freight
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat === 'All' ? t('filterAll') : cat}
            </button>
          ))}

          <button
            onClick={() => setShowOnlyOrganic(!showOnlyOrganic)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border flex items-center gap-1.5 transition ${
              showOnlyOrganic
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${showOnlyOrganic ? 'text-emerald-700' : 'text-stone-400'}`} />
            <span>Organic / Jaivik Only</span>
          </button>
        </div>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCrops.map((crop) => {
          const { direct, traditional } = calculatePriceBreakdown(crop);

          return (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image & Badges */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {crop.qualityGrade.split(' ')[0]} {crop.qualityGrade.split(' ')[1]}
                  </span>
                  {crop.organicCert && (
                    <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">
                      🌿 Jaivik Bharat
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('quality-assay');
                    }}
                    className="p-1.5 px-2 bg-emerald-700/90 hover:bg-emerald-600 text-white rounded-xl shadow-md backdrop-blur-md text-[10px] font-bold flex items-center gap-1 transition"
                    title="Smartphone AI Quality Assaying"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>AI Assay</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('traceability');
                    }}
                    className="p-1.5 px-2 bg-white/90 hover:bg-white text-stone-800 rounded-xl shadow-md backdrop-blur-md text-[10px] font-bold flex items-center gap-1 transition"
                    title="Trace farm-of-origin"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Trace</span>
                  </button>
                </div>

                <div className="absolute bottom-2 left-3 right-3 bg-stone-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1 truncate text-stone-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {crop.farmer.village}, {crop.farmer.district}
                  </span>
                  <span className="text-emerald-300 font-bold shrink-0">★ {crop.farmer.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-stone-900 text-base leading-snug line-clamp-1">
                      {crop.name}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {crop.description}
                  </p>
                </div>

                {/* Direct Price Breakdown Gauge */}
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 uppercase">You Pay (Direct Rate)</span>
                      <p className="text-lg font-black text-emerald-800">
                        ₹{crop.krishiSetuPrice} <span className="text-xs font-normal text-stone-600">/kg</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-stone-500 uppercase">Retail Mandi</span>
                      <p className="text-sm font-bold text-stone-400 line-through">
                        ₹{crop.retailPrice}/kg
                      </p>
                    </div>
                  </div>

                  {/* Profit Share Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-emerald-700">Farmer gets: ₹{crop.farmerPrice}/kg</span>
                      <span className="text-emerald-600">+{direct.farmerGainPercentage}% Gain</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-emerald-600 h-full rounded-full transition-all" 
                        style={{ width: `${direct.farmerPercentOfRupee}%` }} 
                        title={`Farmer share: ${direct.farmerPercentOfRupee}%`}
                      />
                    </div>
                  </div>

                  {/* Dissect Rupee Button */}
                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('price-breakdown');
                    }}
                    className="w-full text-center text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center justify-center gap-1 pt-1 hover:underline"
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span>See full value breakdown vs Dalals</span>
                  </button>
                </div>

                {/* Bulk / Retail availability */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Available: <strong>{crop.quantity} Quintals</strong></span>
                  <span className="text-stone-400">{crop.harvestDate}</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(crop, mode === 'B2B' ? crop.minOrderBulk : 20, mode)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{mode === 'B2B' ? `Procure Bulk (${crop.minOrderBulk} kg)` : 'Add to Basket'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
