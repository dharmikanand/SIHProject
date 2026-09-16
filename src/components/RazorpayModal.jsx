import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RazorpayModal() {
  const { activeModal, setActiveModal, cart, placeOrder, addNotification, t } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('farmerbuyer@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (activeModal !== 'razorpay') return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.crop.krishiSetuPrice * item.quantityKg, 0) || 4800;
  
  // Razorpay Route Split Payouts calculation
  const farmerSplit = Math.round(totalAmount * 0.85);
  const logisticsSplit = Math.round(totalAmount * 0.11);
  const platformQASplit = Math.round(totalAmount * 0.04);

  const handleRazorpayPay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      placeOrder({
        buyerName: "Verified Buyer (Razorpay Escrow)",
        buyerType: "Consumer Direct & Group Buy",
        paymentId: `pay_RZP_${Math.floor(10000000 + Math.random() * 90000000)}`,
        orderId: `order_RZP_${Math.floor(10000000 + Math.random() * 90000000)}`
      });
      addNotification(
        t('rzpToastTitle'),
        t('rzpToastBody', totalAmount.toLocaleString('en-IN')),
        "success"
      );
      setActiveModal(null);
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        
        {/* Razorpay Branded Top Header */}
        <div className="bg-[#0c2340] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2b84ea] flex items-center justify-center font-black text-white tracking-tighter text-sm shadow">
              Rzp
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">{t('rzpTitle')}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  PCI-DSS Level 1
                </span>
              </div>
              <p className="text-[11px] text-ink-3">
                {t('rzpSub')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleRazorpayPay} className="p-6 space-y-5">
          
          {/* Amount Badge */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-[10px] text-ink-2 font-semibold uppercase block">{t('amountPayable')}</span>
              <span className="text-2xl font-black text-stone-900 mt-0.5 block">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {t('escrowProtected')}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'upi'
                    ? 'border-[#2b84ea] bg-blue-50 text-[#0c2340] font-bold shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#2b84ea]" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'card'
                    ? 'border-[#2b84ea] bg-blue-50 text-[#0c2340] font-bold shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#2b84ea]" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#2b84ea] bg-blue-50 text-[#0c2340] font-bold shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Building className="w-4 h-4 text-[#2b84ea]" />
                <span>Netbanking</span>
              </button>
            </div>
          </div>

          {/* UPI Field */}
          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Enter UPI ID (Google Pay, PhonePe, Paytm, BHIM)
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2b84ea]"
                placeholder="mobile@upi"
              />
            </div>
          )}

          {/* Razorpay Route Split Payout Breakdown */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#0c2340] font-bold">
              <Layers className="w-4 h-4 text-[#2b84ea]" />
              <span>Razorpay Route Automated Split Ledger</span>
            </div>
            <div className="space-y-1 text-[11px] text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Farmer Farmgate Direct Account (85%):</span>
                <span className="font-extrabold text-emerald-700">₹{farmerSplit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Cluster Reefer Milk-Run Fleet (11%):</span>
                <span className="font-semibold text-stone-800">₹{logisticsSplit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>KrishiSetu Assaying & Escrow Fee (4%):</span>
                <span className="font-semibold text-stone-800">₹{platformQASplit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#2b84ea] hover:bg-[#2070ce] text-white text-xs font-black rounded-2xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isProcessing ? "Authorizing Escrow Lock..." : `Pay ₹${totalAmount.toLocaleString('en-IN')} with Razorpay`}
            </span>
          </button>

          <p className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Held securely in digital escrow. Transferred to farmer upon delivery OTP.
          </p>

        </form>

      </div>
    </div>
  );
}
