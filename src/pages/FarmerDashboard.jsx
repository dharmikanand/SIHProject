import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  IndianRupee, 
  TrendingUp, 
  ShieldCheck, 
  PlusCircle, 
  Scale, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { generateCropHarvestAdvisory } from '../utils/aiForecast';

export default function FarmerDashboard() {
  const { 
    crops, 
    orders, 
    releaseEscrow, 
    setActiveModal, 
    setSelectedCrop, 
    setPersona, 
    t 
  } = useApp();

  const farmerCrops = crops.slice(0, 4); // active listings for the farmer portal
  const activeAdvisory = generateCropHarvestAdvisory("crop-001");

  // Cumulative stats
  const totalRevenue = 284500;
  const extraGainVsMandi = 104200;
  const escrowPending = orders
    .filter(o => o.escrowStatus === 'LOCKED_IN_ESCROW')
    .reduce((acc, o) => acc + o.farmerPayout, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Farmer Profile Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            alt="Farmer Profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shrink-0 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Rameshwar Patil (रामेश्वर पाटिल)
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-400/40">
                Verified Farmer
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Pimpalgaon Baswant, Nashik, Maharashtra • Sahyadri Farmers Producer Co. (FPO)
            </p>
            <p className="text-xs text-stone-300 mt-1 font-mono">
              Kisan ID: <span className="text-white font-semibold">MH-NSK-2026-8819</span> • Land: 6.5 Acres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('add-listing')}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs rounded-2xl transition shadow-lg shadow-emerald-500/30 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-stone-950" />
            <span>{t('listNewProduce')}</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Direct Gross Earnings</p>
            <p className="text-xl font-black text-stone-900 mt-0.5">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">100% Direct Payout</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Extra Profit vs Mandi</p>
            <p className="text-xl font-black text-amber-700 mt-0.5">
              +₹{extraGainVsMandi.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-amber-800 font-semibold">+72% over APMC Dalals</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Secured in Escrow</p>
            <p className="text-xl font-black text-blue-700 mt-0.5">
              ₹{escrowPending.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-blue-800 font-semibold">Protected Buyer Funds</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Active Produce Batches</p>
            <p className="text-xl font-black text-purple-700 mt-0.5">
              {farmerCrops.length} Active
            </p>
            <span className="text-[10px] text-purple-800 font-semibold">Nashik Red Onion, Tomato</span>
          </div>
        </div>

      </div>

      {/* AI Harvest Advisory Widget */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-amber-50 border border-emerald-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0 mt-0.5">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                KrishiSetu AI Harvest & Selling Advisory
              </span>
              <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                {activeAdvisory.confidence}% Model Confidence
              </span>
            </div>
            <h4 className="text-base font-extrabold text-stone-900 mt-1">
              {activeAdvisory.action}
            </h4>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              {activeAdvisory.reasoning}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPersona('ai-forecast')}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-2 shadow"
        >
          <span>View Forecast Curves</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Two Column Section: Active Produce Listings & Live Escrow Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Produce Listings (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Active Farm Gate Listings
              </h3>
              <p className="text-xs text-stone-500">
                Your produce listed directly to consumer societies and bulk institutional buyers
              </p>
            </div>
            <button
              onClick={() => setActiveModal('add-listing')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Crop</span>
            </button>
          </div>

          <div className="space-y-3">
            {farmerCrops.map((crop) => (
              <div
                key={crop.id}
                className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-sm">{crop.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {crop.qualityGrade.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Quantity: <strong>{crop.quantity} Quintals</strong> • {crop.harvestDate}
                    </p>
                    <p className="text-xs font-mono text-stone-400">Batch: {crop.batchCode}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold block">Your Payout</span>
                    <span className="text-base font-extrabold text-emerald-700">₹{crop.farmerPrice}/kg</span>
                    <span className="text-[10px] text-stone-400 block line-through">Mandi: ₹{crop.mandiPrice}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('price-breakdown');
                    }}
                    className="p-2.5 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    title="View Price Breakdown"
                  >
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">Dissect Rupee</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Escrow Orders (1 col) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-stone-900">
              Live Escrow Orders & Payouts
            </h3>
            <p className="text-xs text-stone-500">
              Payments guaranteed in digital escrow
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const isLocked = order.escrowStatus === 'LOCKED_IN_ESCROW';

              return (
                <div
                  key={order.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLocked
                      ? 'bg-blue-50/40 border-blue-200'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-mono font-bold text-stone-700">{order.id}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isLocked
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isLocked ? 'Locked in Escrow' : 'Disbursed to Farmer'}
                    </span>
                  </div>

                  <div className="py-2.5 space-y-1 text-xs">
                    <p className="font-bold text-stone-900">{order.buyerName}</p>
                    <p className="text-stone-500 text-[11px]">{order.buyerType}</p>
                    <div className="flex justify-between pt-1">
                      <span className="text-stone-600">Farmer Payout:</span>
                      <span className="font-black text-emerald-700 text-sm">
                        ₹{order.farmerPayout.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Escrow Release Button */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">
                      OTP: <strong>{order.deliveryOtp}</strong>
                    </span>

                    {isLocked ? (
                      <button
                        onClick={() => releaseEscrow(order.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition shadow-sm flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Simulate Delivery OTP & Release Escrow</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Transferred via UPI / RTGS
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
