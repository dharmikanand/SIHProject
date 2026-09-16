import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AI_FORECAST_CROPS } from '../data/mockData';
import { getProphetDecomposition } from '../utils/prophetEngine';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Calendar, 
  AlertTriangle, 
  ArrowUpRight, 
  Scale, 
  CloudRain, 
  Sun, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  Database,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function AIForecastPage() {
  const { user, t } = useApp();
  const isFarmer = user?.role === 'farmer';
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [viewMode, setViewMode] = useState('combined'); // 'combined', 'prophet_components'
  const [holdDaysSlider, setHoldDaysSlider] = useState(5);

  const selectedCrop = AI_FORECAST_CROPS.find(c => c.id === selectedCropId) || AI_FORECAST_CROPS[0];

  // Calculate dynamic Prophet decomposition data
  const prophetData = useMemo(() => {
    return getProphetDecomposition(selectedCropId, selectedCrop.currentMandiAvg);
  }, [selectedCropId, selectedCrop]);

  const simulatedPriceGainPerKg = selectedCropId === 'onion' 
    ? Math.round((holdDaysSlider * 0.9) * 10) / 10
    : selectedCropId === 'tomato'
    ? -Math.round((holdDaysSlider * 0.7) * 10) / 10
    : Math.round((holdDaysSlider * 0.4) * 10) / 10;

  const simulatedRevenueGain100Qtl = Math.round(simulatedPriceGainPerKg * 10000);

  // Buyer-facing outlook: derived from the same forecast signal the farmer gets
  const priceTrendUp = simulatedPriceGainPerKg > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('prophetBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight">
            {t('forecastHeadline')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-3 max-w-2xl leading-relaxed">
            {t('forecastBody')}
          </p>
        </div>

        {/* Crop Selector */}
        <div className="bg-stone-800/90 p-1.5 rounded-2xl border border-stone-700/80 flex items-center gap-1 shrink-0 overflow-x-auto">
          {AI_FORECAST_CROPS.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCropId(crop.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCropId === crop.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {crop.name.split(' ')[0]} {crop.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Official Agmarknet Verified Feed Bar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Database className="w-4 h-4" />
          </div>
          <div>
          <span className="font-bold text-ink block">
            {t('agmarknetFeed')}
          </span>
          <span className="text-ink-2 text-[11px]">
            {t('dailyBenchmark')}: <strong>₹{selectedCrop.currentMandiAvg}/kg</strong> • {t('mspVerified')}
          </span>
          </div>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl font-bold text-xs">
          <button
            onClick={() => setViewMode('combined')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'combined' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            {t('viewPriceArrival')}
          </button>
          <button
            onClick={() => setViewMode('prophet_components')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'prophet_components' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            {t('viewComponents')}
          </button>
        </div>
      </div>

      {/* Role-aware advisory: farmer = sell timing, buyer = procurement timing.
          Same Prophet signal, opposite action — answers "why does a buyer need a forecast?" */}
      <div className={`p-5 border ${priceTrendUp ? 'bg-harvest-50 border-harvest-200' : 'bg-field-50 border-field-200'} flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
        <div className={`p-3 rounded-sm shrink-0 ${priceTrendUp ? 'bg-harvest-500 text-paper' : 'bg-field-500 text-paper'}`}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-meta font-bold uppercase tracking-wider text-ink-3 mb-0.5">
            {isFarmer ? t('forFarmers') : t('forBuyers')}
          </p>
          <p className="text-base font-bold text-ink">
            {isFarmer
              ? selectedCrop.advisory
              : (priceTrendUp ? t('buyerBuyNow') : t('buyerWait'))}
          </p>
          {!isFarmer && (
            <p className="text-xs text-ink-2 mt-1">
              {t('buyerOutlook')}: {selectedCrop.projectedDemandStatus} · {selectedCrop.advisory}
            </p>
          )}
        </div>
        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-sm shrink-0 ${priceTrendUp ? 'bg-harvest-100 text-harvest-700' : 'bg-field-100 text-field-700'}`}>
          {simulatedPriceGainPerKg >= 0 ? `+₹${simulatedPriceGainPerKg}` : `-₹${Math.abs(simulatedPriceGainPerKg)}`}/kg · {t('holdDaysLabel', holdDaysSlider)}
        </span>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base font-extrabold text-stone-900">
            {viewMode === 'combined'
              ? t('chartCombinedTitle')
              : t('chartComponentsTitle')}
            </h3>
            <p className="text-xs text-ink-2">
              {viewMode === 'combined'
                ? t('chartCombinedSub')
                : t('chartComponentsSub')}
            </p>
          </div>

          <span className="text-[10px] font-mono text-field-800 bg-field-50 px-2.5 py-1 rounded-sm font-bold border border-field-100">
            {t('r2Fit')}: 0.94
          </span>
        </div>

        <div className="h-[370px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'combined' ? (
              <ComposedChart data={prophetData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} unit="₹" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} unit=" Qtl" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="right" dataKey="arrivalQuintals" name="Mandi Arrival Volume (Quintals)" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={24} />
                <Area yAxisId="left" type="monotone" dataKey="directPrice" name="KrishiSetu Direct Farmer Rate (₹/kg)" stroke="#16a34a" strokeWidth={3} fillOpacity={0.12} fill="#16a34a" />
                <Line yAxisId="left" type="monotone" dataKey="modalPrice" name="Official APMC Modal Price (₹/kg)" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </ComposedChart>
            ) : (
              <ComposedChart data={prophetData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="₹" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="trend_g_t" name="Macroeconomic Trend g(t)" stroke="#0284c7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="seasonality_s_t" name="Weekly Grocery Seasonality s(t)" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Bar dataKey="holidayShock" name="Indian Festive Shock h(t) [Navratri/Diwali]" fill="#f59e0b" barSize={18} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
          <span>{t('modelNote')}</span>
          <span className="text-field-600 font-semibold">{t('festivalActive')}</span>
        </div>
      </div>

      {/* Two Column: Driving Factors & What-If Storage Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Driving Factors */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-field-500" />
            {t('exogenousFactors')}
          </h4>

          <div className="space-y-3">
            {selectedCrop.drivingFactors.map((df, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
                <div>
                  <h5 className="font-bold text-stone-900 text-xs">{df.factor}</h5>
                  <p className="text-[11px] text-stone-500 mt-0.5">{df.description}</p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
                  df.impact.startsWith('+')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {df.impact} Impact
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Holding Simulator */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-harvest-600" />
              {t('whatIfTitle')}
            </h4>
            <span className="text-xs font-mono font-bold text-ink-2 bg-paper-2 px-2.5 py-1 rounded-sm">
              {t('holdDaysLabel', holdDaysSlider)}
            </span>
          </div>

          <p className="text-xs text-ink-2">
            {t('whatIfBody')}
          </p>

          <input
            type="range"
            min="1"
            max="15"
            value={holdDaysSlider}
            onChange={(e) => setHoldDaysSlider(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] text-ink-2 uppercase font-semibold block">{t('expectedShift')}</span>
              <span className={`text-lg font-black mt-0.5 block ${
                simulatedPriceGainPerKg >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {simulatedPriceGainPerKg >= 0 ? `+₹${simulatedPriceGainPerKg}` : `-₹${Math.abs(simulatedPriceGainPerKg)}`} /kg
              </span>
              <span className="text-[10px] text-ink-3">{t('afterDays', holdDaysSlider)}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] text-ink-2 uppercase font-semibold block">{t('netBatchGain')}</span>
              <span className={`text-lg font-black mt-0.5 block ${
                simulatedRevenueGain100Qtl >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {simulatedRevenueGain100Qtl >= 0 ? `+₹${simulatedRevenueGain100Qtl.toLocaleString('en-IN')}` : `-₹${Math.abs(simulatedRevenueGain100Qtl).toLocaleString('en-IN')}`}
              </span>
              <span className="text-[10px] text-ink-3">{t('extraFarmerIncome')}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {t('coldStorageNote')}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
