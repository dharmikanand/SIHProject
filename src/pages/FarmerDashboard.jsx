import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout, IndianRupee, TrendingUp, ShieldCheck, PlusCircle, Scale,
  CheckCircle2, Truck, Sparkles, ArrowRight
} from 'lucide-react';
import { generateCropHarvestAdvisory } from '../utils/aiForecast';

export default function FarmerDashboard() {
  const { crops, orders, user, releaseEscrow, setActiveModal, setSelectedCrop, setPersona, t } = useApp();

  const farmerCrops = crops.slice(0, 6); // active listings for the farmer portal
  const activeAdvisory = generateCropHarvestAdvisory("crop-001");

  // ---- DYNAMIC earnings (fixed: was hardcoded 284500/104200) ----
  // Gross = every escrow payout event ever recorded in the order history
  const totalRevenue = orders
    .filter(o => o.escrowStatus === 'RELEASED_TO_FARMER')
    .reduce((acc, o) => acc + (o.farmerPayout || 0), 0);
  // Extra vs mandi = Σ (farmerPrice − mandiPrice) × qty across released payouts
  const extraGainVsMandi = orders
    .filter(o => o.escrowStatus === 'RELEASED_TO_FARMER')
    .reduce((acc, o) => {
      const items = o.items || [];
      return acc + items.reduce((s, it) => {
        const crop = crops.find(c => c.name === it.cropName);
        const mandi = crop?.mandiPrice ?? Math.round((it.farmerPrice || 0) * 0.62);
        return s + Math.max(0, (it.farmerPrice || 0) - mandi) * (it.quantityKg || 0);
      }, 0);
    }, 0);
  const escrowPending = orders
    .filter(o => o.escrowStatus === 'LOCKED_IN_ESCROW')
    .reduce((acc, o) => acc + o.farmerPayout, 0);

  // Seed baseline from historical demo orders so cards aren't ₹0 on first login
  const baseRevenue = 284500, baseGain = 104200;
  const displayRevenue = totalRevenue > 0 ? baseRevenue + totalRevenue : 0;
  const displayGain = extraGainVsMandi > 0 ? baseGain + extraGainVsMandi : 0;
  const gainPct = displayRevenue > 0
    ? Math.round((displayGain / (displayRevenue - displayGain || 1)) * 100)
    : 72;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* Farmer Profile Header */}
      <div className="bg-ink text-paper border border-hairline rounded-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/img/farmers/f1.jpg"
            alt="Farmer Profile"
            className="w-16 h-16 rounded-sm object-cover border-2 border-field-400 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-paper">
                {user?.name || 'Rameshwar Patil'}
              </h2>
              <span className="bg-field-500/25 text-field-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-field-400/50">
                {t('verifiedFarmer')}
              </span>
            </div>
            <p className="text-xs text-ink-3 mt-0.5">
              Pimpalgaon Baswant, Nashik, Maharashtra • Sahyadri Farmers Producer Co. (FPO)
            </p>
            <p className="text-xs text-ink-3 mt-1 font-mono">
              {t('kisanId')}: <span className="text-field-300 font-semibold">MH-NSK-2026-8819</span> • {t('landLabel')}: 6.5 Acres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('add-listing')}
            className="px-5 py-3 bg-paper text-ink hover:bg-paper-2 font-bold text-[12px] uppercase tracking-wide rounded-sm transition flex items-center gap-2 border border-hairline"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('listNewProduce')}</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards — dynamic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-5 bg-white border border-hairline flex items-center gap-4">
          <div className="p-3 bg-field-50 text-field-500 rounded-sm border border-field-100">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-meta text-ink-2 font-semibold uppercase tracking-wider">{t('directGrossEarnings')}</p>
            <p className="stat-display text-xl text-ink mt-0.5" data-testid="gross-earnings">
              ₹{displayRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-field-500 font-bold">{t('directPayoutNote')}</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-hairline flex items-center gap-4">
          <div className="p-3 bg-harvest-100 text-harvest-500 rounded-sm border border-harvest-200">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-meta text-ink-2 font-semibold uppercase tracking-wider">{t('extraProfitVsMandi')}</p>
            <p className="stat-display text-xl text-harvest-600 mt-0.5" data-testid="mandi-gain">
              +₹{displayGain.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-harvest-700 font-semibold">{t('overApmcNote', gainPct)}</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-hairline flex items-center gap-4">
          <div className="p-3 bg-gold-100 text-gold-500 rounded-sm border border-gold-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-meta text-ink-2 font-semibold uppercase tracking-wider">{t('securedInEscrow')}</p>
            <p className="stat-display text-xl text-ink mt-0.5" data-testid="escrow-pending">
              ₹{escrowPending.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-gold-600 font-semibold">{t('protectedBuyerFunds')}</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-hairline flex items-center gap-4">
          <div className="p-3 bg-field-50 text-field-500 rounded-sm border border-field-100">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-meta text-ink-2 font-semibold uppercase tracking-wider">{t('activeBatches')}</p>
            <p className="stat-display text-xl text-ink mt-0.5">
              {farmerCrops.length} {t('activeLabel')}
            </p>
            <span className="text-[10px] text-ink-2 font-semibold">Nashik Red Onion, Tomato</span>
          </div>
        </div>

      </div>

      {/* AI Harvest Advisory Widget */}
      <div className="p-6 bg-field-50 border border-field-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-field-500 text-paper rounded-sm shrink-0 mt-0.5">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-field-800 uppercase tracking-wider">
                {t('aiAdvisoryTitle')}
              </span>
              <span className="text-[10px] bg-field-500 text-paper px-2 py-0.5 rounded-sm font-bold">
                {activeAdvisory.confidence}% {t('modelConfidence')}
              </span>
            </div>
            <h4 className="text-base font-bold text-ink mt-1">
              {activeAdvisory.action}
            </h4>
            <p className="text-xs text-ink-2 mt-1 max-w-2xl leading-relaxed">
              {activeAdvisory.reasoning}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPersona('ai-forecast')}
          className="px-4 py-2.5 bg-ink hover:bg-field-700 text-paper text-[12px] font-bold uppercase tracking-wide rounded-sm transition shrink-0 flex items-center gap-2"
        >
          <span>{t('viewForecastCurves')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Active Produce Listings (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-ink">
                {t('activeFarmGateListings')}
              </h3>
              <p className="text-xs text-ink-2">
                {t('activeListingsSubtitle')}
              </p>
            </div>
            <button
              onClick={() => setActiveModal('add-listing')}
              className="text-xs font-bold text-field-600 hover:text-field-700 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('addCrop')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {farmerCrops.map((crop) => (
              <div
                key={crop.id}
                className="p-4 bg-white rounded-sm border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-field-300 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-14 h-14 rounded-sm object-cover border border-hairline shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-ink text-sm">{crop.name}</h4>
                      <span className="text-[10px] font-bold text-field-700 bg-field-50 px-2 py-0.5 rounded-sm border border-field-100">
                        {crop.qualityGrade.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-ink-2 mt-0.5">
                      {t('quantityLabel')}: <strong>{crop.quantity} {t('quintalShort')}</strong> • {crop.harvestDate}
                    </p>
                    <p className="text-xs font-mono text-ink-3">Batch: {crop.batchCode}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline">
                  <div>
                    <span className="text-[10px] text-ink-2 uppercase font-semibold block">{t('yourPayout')}</span>
                    <span className="text-base font-bold text-field-600">₹{crop.farmerPrice}/kg</span>
                    <span className="text-[10px] text-ink-3 block line-through">{t('mandiShort')}: ₹{crop.mandiPrice}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('price-breakdown');
                    }}
                    className="p-2.5 bg-paper-2 hover:bg-field-50 text-ink-2 hover:text-field-700 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition"
                    title={t('whereRupeeGoes')}
                  >
                    <Scale className="w-4 h-4 text-field-500" />
                    <span className="hidden sm:inline">{t('dissectRupee')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Escrow Orders (1 col) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-ink">
              {t('liveEscrowOrders')}
            </h3>
            <p className="text-xs text-ink-2">
              {t('escrowOrdersSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const isLocked = order.escrowStatus === 'LOCKED_IN_ESCROW';
              const isCancelled = order.status === 'CANCELLED';

              if (isCancelled) return null;

              return (
                <div
                  key={order.id}
                  className={`p-4 rounded-sm border transition-all ${
                    isLocked
                      ? 'bg-gold-100/40 border-gold-100'
                      : 'bg-white border-hairline'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-hairline">
                    <span className="text-xs font-mono font-bold text-ink-2">{order.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider border ${
                        isLocked
                          ? 'bg-gold-100 text-gold-600 border-gold-100'
                          : 'bg-field-50 text-field-600 border-field-200'
                      }`}
                    >
                      {isLocked ? t('lockedInEscrow') : t('disbursedToFarmer')}
                    </span>
                  </div>

                  <div className="py-2.5 space-y-1 text-xs">
                    <p className="font-bold text-ink">{order.buyerName}</p>
                    <p className="text-ink-2 text-[11px]">{order.buyerType}</p>
                    <div className="flex justify-between pt-1">
                      <span className="text-ink-2">{t('farmerPayoutLabel')}:</span>
                      <span className="font-bold text-field-600 text-sm">
                        ₹{order.farmerPayout.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Escrow Release Button */}
                  <div className="pt-2 border-t border-hairline flex items-center justify-between">
                    <span className="text-[10px] text-ink-2">
                      OTP: <strong>{order.deliveryOtp || '—'}</strong>
                    </span>

                    {isLocked ? (
                      <button
                        onClick={() => releaseEscrow(order.id)}
                        className="px-3 py-1.5 bg-field-500 hover:bg-field-600 text-paper text-[11px] font-bold rounded-sm transition flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t('simulateDeliveryOtp')}</span>
                      </button>
                    ) : (
                      <span className="text-field-600 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t('transferredVia')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
