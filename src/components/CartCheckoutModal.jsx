import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, ShoppingBag, Trash2, ArrowRight, CheckCircle, Truck, Sparkles } from 'lucide-react';

export default function CartCheckoutModal() {
  const { activeModal, setActiveModal, cart, updateCartQuantity, clearCart, placeOrder } = useApp();
  const [buyerName, setBuyerName] = useState('Priya Sharma (Society Coordinator)');
  const [buyerType, setBuyerType] = useState('Society Group Buying (B2C)');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Marvel Orchid Society, Hinjawadi Phase 1, Pune');

  if (activeModal !== 'cart') return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.crop.krishiSetuPrice * item.quantityKg, 0);
  const totalFarmerPayout = cart.reduce((acc, item) => acc + item.crop.farmerPrice * item.quantityKg, 0);
  const totalRetailEquivalent = cart.reduce((acc, item) => acc + item.crop.retailPrice * item.quantityKg, 0);
  const totalSaved = totalRetailEquivalent - totalAmount;

  const handleCheckout = (e) => {
    e.preventDefault();
    placeOrder({
      buyerName,
      buyerType,
      deliveryAddress
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Direct Farm Basket & Escrow Checkout
              </h3>
              <p className="text-xs text-stone-400">
                Zero middlemen. Direct farm-gate fresh delivery.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-600 font-semibold text-sm">Your produce basket is empty</p>
            <p className="text-stone-400 text-xs mt-1">Browse farm listings to add fresh crops directly</p>
            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Explore Produce
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="p-6 space-y-6">
            
            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Items in Basket ({cart.length})
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {cart.map((item) => (
                  <div key={item.crop.id} className="p-3.5 bg-white flex items-center justify-between gap-3">
                    <img
                      src={item.crop.image}
                      alt={item.crop.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.crop.name}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        ₹{item.crop.krishiSetuPrice}/kg <span className="text-stone-400 font-normal">| Farmer: {item.crop.farmer.name}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.crop.id, item.quantityKg - 10)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold font-mono">{item.quantityKg} kg</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.crop.id, item.quantityKg + 10)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-900 w-16 text-right">
                        ₹{(item.crop.krishiSetuPrice * item.quantityKg).toLocaleString('en-IN')}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.crop.id, 0)}
                        className="text-stone-400 hover:text-red-500 p-1 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow Guarantee Highlight */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  100% Digital Escrow Protection
                </h5>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  Your payment of <strong>₹{totalAmount.toLocaleString('en-IN')}</strong> will be safely secured in a regulated Escrow account. The farmer is guaranteed payment, but funds are only released after you inspect the fresh produce at your gate and provide the 4-digit OTP.
                </p>
              </div>
            </div>

            {/* Buyer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Buyer / Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Buyer Type / Procurement Channel *
                </label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Society Group Buying (B2C)">Society Group Buying (B2C)</option>
                  <option value="Individual Consumer (B2C)">Individual Consumer (B2C)</option>
                  <option value="Bulk Restaurant / HoReCa (B2B)">Bulk Restaurant / HoReCa (B2B)</option>
                  <option value="Food Processing Manufacturer (B2B)">Food Processing Manufacturer (B2B)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Drop-Off Address / Aggregation Point *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Total Produce Bill (Direct Rates):</span>
                <span className="font-semibold text-stone-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Direct Farmer Take-Home:</span>
                <span className="font-bold text-emerald-700">₹{totalFarmerPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Consumer Savings vs APMC Retail:</span>
                <span>-₹{totalSaved.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                <span>Total Amount to Escrow:</span>
                <span className="text-base text-emerald-700 font-extrabold">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline"
              >
                Clear Basket
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveModal('razorpay')}
                  className="flex-1 sm:flex-initial px-5 py-3 bg-[#0c2340] hover:bg-[#1a365d] text-white text-xs font-black rounded-xl transition shadow flex items-center justify-center gap-2 border border-[#2b84ea]/40"
                >
                  <span className="w-5 h-5 rounded-md bg-[#2b84ea] flex items-center justify-center text-[10px] font-black text-white">R</span>
                  <span>Pay via Razorpay Escrow</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Order</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
