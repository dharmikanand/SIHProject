import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Leaf, 
  Award, 
  Scale, 
  Users, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';

export default function NationalImpactDashboard() {
  const stateImpacts = [
    {
      state: "Maharashtra (Nashik, Pune, Sangli)",
      registeredFarmers: "1,24,000",
      activeFPOs: "340",
      avgFarmerGain: "+78%",
      spoilageCut: "from 12% to 1.4%",
      topCrops: "Onion, Pomegranate, Turmeric, Grapes"
    },
    {
      state: "Karnataka (Kolar, Chikkaballapur, Belgaum)",
      registeredFarmers: "86,500",
      activeFPOs: "210",
      avgFarmerGain: "+72%",
      spoilageCut: "from 14% to 1.6%",
      topCrops: "Tomato, Capsicum, Carrot, Green Chilli"
    },
    {
      state: "Madhya Pradesh (Sehore, Dewas, Hoshangabad)",
      registeredFarmers: "98,200",
      activeFPOs: "280",
      avgFarmerGain: "+64%",
      spoilageCut: "from 8% to 0.8%",
      topCrops: "Sharbati Wheat, Soybean, Gram"
    },
    {
      state: "Punjab & Haryana (Karnal, Patiala, Ludhiana)",
      registeredFarmers: "74,000",
      activeFPOs: "190",
      avgFarmerGain: "+58%",
      spoilageCut: "from 6% to 0.5%",
      topCrops: "Pusa 1121 Basmati Rice, Kinnow, Mustard"
    },
    {
      state: "Uttar Pradesh (Agra, Aligarh, Barabanki)",
      registeredFarmers: "1,12,000",
      activeFPOs: "310",
      avgFarmerGain: "+68%",
      spoilageCut: "from 11% to 1.5%",
      topCrops: "Chandramukhi Potato, Mint, Peas"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Ministry of Consumer Affairs, Food & Public Distribution • DoCA Policy Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            National Agricultural Public Infrastructure
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Real-time macroeconomic assessment of supply chain disintermediation under Smart India Hackathon Problem Statement 26033.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 px-4 rounded-2xl border border-white/20 backdrop-blur-sm shrink-0">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">Digital India Standard</span>
            <span className="text-xs font-extrabold text-white">ONDC & UPI Protocol Aligned</span>
          </div>
        </div>
      </div>

      {/* High-Level Impact Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Farmer Wealth Generated</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700 mt-2">
            ₹142.8 Cr
          </p>
          <p className="text-xs text-stone-600 mt-1">
            Transferred directly into farmer bank accounts without commission cuts.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Consumer Inflation Relief</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-700 mt-2">
            ₹98.4 Cr
          </p>
          <p className="text-xs text-stone-600 mt-1">
            Saved by retail consumers & bulk food processing businesses.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Food Wastage Prevented</span>
            <Scale className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-purple-700 mt-2">
            48,200 MT
          </p>
          <p className="text-xs text-stone-600 mt-1">
            Perishables saved through AI milk-run routing & direct cold-chain.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Carbon Abatement</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-800 mt-2">
            1,240 MT
          </p>
          <p className="text-xs text-stone-600 mt-1">
            CO2 emissions eliminated via route optimization & EV cluster aggregation.
          </p>
        </div>

      </div>

      {/* State-wise Adoption Matrix */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base font-extrabold text-stone-900">
              State-wise KrishiSetu Grid Deployment Status
            </h3>
            <p className="text-xs text-stone-500">
              Active rural aggregation hubs, participating FPOs, and localized value retention metrics
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            5 Major Agri-States Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">State & Primary Corridors</th>
                <th className="py-3 px-3">Enrolled Farmers</th>
                <th className="py-3 px-3">Active FPOs</th>
                <th className="py-3 px-3">Avg. Farmer Gain</th>
                <th className="py-3 px-3">Transit Spoilage Drop</th>
                <th className="py-3 px-3">Key High-Value Crops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {stateImpacts.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/80 transition">
                  <td className="py-3.5 px-3 font-bold text-stone-900">{row.state}</td>
                  <td className="py-3.5 px-3 font-mono">{row.registeredFarmers}</td>
                  <td className="py-3.5 px-3 font-mono">{row.activeFPOs}</td>
                  <td className="py-3.5 px-3 font-extrabold text-emerald-700">{row.avgFarmerGain}</td>
                  <td className="py-3.5 px-3 text-purple-700 font-semibold">{row.spoilageCut}</td>
                  <td className="py-3.5 px-3 text-stone-600">{row.topCrops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Recommendations & DoCA Integration Box */}
      <div className="p-6 rounded-3xl bg-stone-900 text-white border border-stone-800 space-y-4">
        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          Department of Consumer Affairs (DoCA) Strategic Policy Alignment
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80">
            <h5 className="font-bold text-emerald-300">1. Price Stabilization Fund (PSF) Integration</h5>
            <p className="text-stone-300 mt-1 leading-relaxed">
              Real-time farmgate telemetry allows the ministry to detect early supply imbalances and release buffer stocks directly to consumer cooperatives before retail price spikes occur.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80">
            <h5 className="font-bold text-emerald-300">2. National Milk-Run Logistics Subsidy</h5>
            <p className="text-stone-300 mt-1 leading-relaxed">
              Consolidated EV aggregation qualifies for PM-eBus and FAME-III green rural freight incentives, lowering per-quintal transportation costs below ₹0.90/km.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80">
            <h5 className="font-bold text-emerald-300">3. Universal Kisan UPI Escrow</h5>
            <p className="text-stone-300 mt-1 leading-relaxed">
              Zero payment defaults. Eliminates the 60-90 day credit delays customary in private wholesale mandis, giving smallholders immediate liquidity upon gate delivery.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
