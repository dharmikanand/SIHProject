import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sprout, Mic, Sparkles, AlertCircle, CheckCircle2, IndianRupee } from 'lucide-react';

export default function AddCropListingModal() {
  const { activeModal, setActiveModal, addCropListing, t } = useApp();

  const [formData, setFormData] = useState({
    name: 'Sangli Turmeric (सांगली राजापुरी हल्दी)',
    category: 'Spices',
    variety: 'Rajapuri High-Curcumin',
    quantity: 60,
    unit: 'kg',
    farmerPrice: 110,
    mandiPrice: 70,
    retailPrice: 160,
    krishiSetuPrice: 125,
    qualityGrade: 'Grade A (Export / Super Grade)',
    organicCert: true,
    harvestDate: 'Harvested Yesterday',
    shelfLife: '360 Days',
    storageCondition: 'Airtight Jute Bags',
    minOrderBulk: 100,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    description: 'Golden yellow, aromatic Rajapuri turmeric with 4.8% curcumin content. Naturally sun-cured, zero chemical polishing.',
    farmer: {
      name: 'Anand Rao Patil',
      village: 'Walwa',
      district: 'Sangli',
      state: 'Maharashtra',
      phone: '+91 98221-44321',
      experience: '18 Years',
      landSize: '5.5 Acres',
      fpo: 'Krishna Valley Organic Farmers',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      coordinates: [16.852, 74.581]
    }
  });

  if (activeModal !== 'add-listing') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addCropListing(formData);
    setActiveModal(null);
  };

  const calculateGain = () => {
    const fPrice = Number(formData.farmerPrice) || 0;
    const mPrice = Number(formData.mandiPrice) || 0;
    if (mPrice === 0) return 0;
    return Math.round(((fPrice - mPrice) / mPrice) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/80 rounded-xl border border-emerald-600">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('listNewProduce')}
              </h3>
              <p className="text-xs text-emerald-200">
                Direct farm-gate listing with AI fair-pricing advisory
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* AI Fair Price Recommender Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI Mandi Rate Guidance
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Local APMC mandi wholesale rate: <strong>₹{formData.mandiPrice}/kg</strong>.
                Recommended KrishiSetu asking price: <strong>₹{formData.farmerPrice}/kg</strong>.
              </p>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-300 text-center shrink-0">
              <span className="text-[10px] text-stone-500 block uppercase font-bold">Your Extra Gain</span>
              <span className="text-base font-extrabold text-emerald-700">+{calculateGain()}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Crop Name & Language (फसल का नाम) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Category (श्रेणी) *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Vegetables">Vegetables (सब्जियां)</option>
                <option value="Grains">Grains (अनाज)</option>
                <option value="Fruits">Fruits (फल)</option>
                <option value="Spices">Spices (मसाले)</option>
                <option value="Pulses">Pulses (दालें)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Total Available Quantity (कुल मात्रा) *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="p-3 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl border border-stone-300">
                  Quintals
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Farmer Take-Home Price (₹ प्रति किलो) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-stone-500 text-xs font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.farmerPrice}
                  onChange={(e) => setFormData({
                    ...formData,
                    farmerPrice: Number(e.target.value),
                    krishiSetuPrice: Math.round(Number(e.target.value) * 1.15)
                  })}
                  className="w-full text-xs p-3 pl-7 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Quality Classification (गुणवत्ता ग्रेड) *
              </label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Grade A (Export / Super Grade)">Grade A (Export / Super Grade)</option>
                <option value="Grade B (Standard Market)">Grade B (Standard Market)</option>
                <option value="Grade C (Processing / Juice / Pulp)">Grade C (Processing / Pulp)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Harvest Date / Condition *
              </label>
              <input
                type="text"
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Harvested Yesterday"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              id="organicCert"
              checked={formData.organicCert}
              onChange={(e) => setFormData({ ...formData, organicCert: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
            />
            <label htmlFor="organicCert" className="text-xs font-semibold text-stone-800 cursor-pointer">
              Organic / Residue-Free Certified (NPOP / Jaivik Bharat / Zero chemical spray)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Produce Description & Harvest Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Direct payment guaranteed via Digital Escrow
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-700/30"
              >
                Publish Farm Gate Listing
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
