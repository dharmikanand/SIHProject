import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, TrendingUp, ShieldCheck, Check, AlertCircle, ArrowRight, Sparkles, Scale } from 'lucide-react';
import { calculatePriceBreakdown } from '../utils/aiForecast';

export default function PriceBreakdownModal() {
  const { activeModal, setActiveModal, selectedCrop } = useApp();
  const [calcQuantity, setCalcQuantity] = useState(100); // 100 kg default slider

  if (activeModal !== 'price-breakdown' || !selectedCrop) return null;

  const { traditional, direct } = calculatePriceBreakdown(selectedCrop);

  // Computed total savings for slider quantity
  const totalFarmerGain = Math.round((direct.farmerShare - traditional.farmerShare) * calcQuantity);
  const totalConsumerSavings = Math.round((traditional.finalConsumerPrice - direct.finalConsumerPrice) * calcQuantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 text-white p-5 px-6 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  DoCA Verified Model
                </span>
                <span className="text-xs text-stone-400 font-mono">PS ID: 26033</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Transparent Value Chain Dissection: {selectedCrop.name}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Top High-Impact Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md shadow-emerald-200">
                +{direct.farmerGainPercentage}%
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Direct Farmer Income Gain</p>
                <p className="text-base font-bold text-emerald-950">
                  Farmer earns ₹{direct.farmerShare}/kg instead of ₹{traditional.farmerShare}/kg
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">Middlemen commissions eliminated completely</p>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-500/40 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md shadow-amber-200">
                -{direct.consumerSavingsPercentage}%
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Direct Consumer Price Relief</p>
                <p className="text-base font-bold text-amber-950">
                  Consumer pays ₹{direct.finalConsumerPrice}/kg instead of ₹{traditional.finalConsumerPrice}/kg
                </p>
                <p className="text-xs text-amber-700 mt-0.5">Saves ₹{direct.consumerSavings}/kg on fresh produce</p>
              </div>
            </div>
          </div>

          {/* Interactive Rupee Flow Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Traditional Multi-Intermediary System */}
            <div className="border border-red-200 bg-red-50/30 rounded-xl p-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-4">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Traditional APMC Model</span>
                  <h4 className="text-base font-bold text-stone-900">4-5 Intermediary Layers</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500">Consumer Pays</span>
                  <p className="text-xl font-black text-red-700">₹{traditional.finalConsumerPrice}/kg</p>
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-red-100">
                  <span className="text-stone-700 font-medium">Farmer Farmgate Share (Mandi Distress Sale)</span>
                  <span className="font-bold text-stone-900">₹{traditional.farmerShare}.00 (Only {traditional.farmerPercentOfRupee}%)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-red-100/50 rounded-lg border border-red-200/60 text-red-900">
                  <span>Village Aggregator (Kaccha Arhatiya)</span>
                  <span className="font-semibold">+₹{traditional.villageAggregator}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-red-100/50 rounded-lg border border-red-200/60 text-red-900">
                  <span>Mandi Dalal Commission & APMC Cess</span>
                  <span className="font-semibold">+₹{traditional.mandiCommissionDalal}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-red-100/50 rounded-lg border border-red-200/60 text-red-900">
                  <span>Transit Spoilage & Multiple Loading Losses (~10%)</span>
                  <span className="font-semibold">+₹{traditional.transportAndSpoilageLoss}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-red-100/50 rounded-lg border border-red-200/60 text-red-900">
                  <span>Secondary Wholesaler & Retail Store Markup</span>
                  <span className="font-semibold">+₹{traditional.wholesalerAndRetailerMargin}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-red-100/80 rounded-lg text-[11px] text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>
                  Farmer receives only <strong>{traditional.farmerPercentOfRupee}%</strong> of the end consumer price. The rest is eaten away by commission agents and transit spoilage.
                </span>
              </div>
            </div>

            {/* KrishiSetu Direct Model */}
            <div className="border-2 border-emerald-500 bg-emerald-50/20 rounded-xl p-5 relative shadow-sm">
              <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                Disintermediated
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">KrishiSetu Smart Grid</span>
                  <h4 className="text-base font-bold text-stone-900">Direct Farmer-to-Consumer</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500">Consumer Pays</span>
                  <p className="text-xl font-black text-emerald-700">₹{direct.finalConsumerPrice}/kg</p>
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-emerald-100/80 rounded-lg border border-emerald-300 text-emerald-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-700" />
                    Direct Farmer Farmgate Payout (Escrow)
                  </span>
                  <span className="text-emerald-900 font-extrabold text-sm">₹{direct.farmerShare}.00 ({direct.farmerPercentOfRupee}%)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-stone-200 text-stone-700">
                  <span>AI Milk-Run Logistics & Cold Fleet</span>
                  <span className="font-semibold">+₹{direct.logisticsAndClusterPickup}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-stone-200 text-stone-700">
                  <span>Platform Operations & Quality Certification</span>
                  <span className="font-semibold">+₹{direct.platformAndQualityGrade}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 font-semibold">
                  <span>Middlemen Commission Cut</span>
                  <span className="text-emerald-700 font-bold">₹0.00 (Zero)</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-100/80 rounded-lg text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
                <span>
                  Farmer captures <strong>{direct.farmerPercentOfRupee}%</strong> of consumer value with automated escrow protection. Transit losses drop from 10% to under 1.5%.
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Live Volume Calculator */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h5 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-harvest-600" />
                  Order Impact Simulator (Batch Scale)
                </h5>
                <p className="text-xs text-stone-500">Drag to calculate collective wealth created for farmers and consumers</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Batch Size:</span>
                <span className="text-sm font-bold font-mono bg-white px-2.5 py-1 rounded-md border border-stone-300">
                  {calcQuantity} kg ({Math.round((calcQuantity / 100) * 10) / 10} Qtl)
                </span>
              </div>
            </div>

            <input
              type="range"
              min="20"
              max="2000"
              step="20"
              value={calcQuantity}
              onChange={(e) => setCalcQuantity(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-stone-200 text-center">
              <div className="bg-white p-3 rounded-lg border border-emerald-200">
                <p className="text-xs text-emerald-700 font-medium">Extra Farmer Earnings</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
                  +₹{totalFarmerGain.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-stone-500">Directly in farmer's bank account</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700 font-medium">Consumer Pocket Savings</p>
                <p className="text-xl font-extrabold text-amber-700 mt-0.5">
                  ₹{totalConsumerSavings.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-stone-500">Saved on wholesale/retail purchases</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-stone-50 border-t border-stone-200 rounded-b-2xl flex items-center justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition shadow"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
