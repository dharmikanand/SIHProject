import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Smartphone, 
  Bell, 
  Sparkles,
  PhoneCall,
  Clock
} from 'lucide-react';

export default function NotificationGatewayModal() {
  const { activeModal, setActiveModal, addNotification, language } = useApp();
  const [activeChannel, setActiveChannel] = useState('whatsapp'); // 'whatsapp', 'sms'
  // Follow the app language when supported by the gateway mock (hi/mr/en), else English
  const [selectedLanguage, setSelectedLanguage] = useState(
    ['hi', 'mr', 'en'].includes(language) ? language : 'en'
  );

  if (activeModal !== 'notifications-gateway') return null;

  const messages = {
    hi: {
      pickup: "🚜 [कृषि सेतु मिल्क-रन अलर्ट]\nनमस्ते रामेश्वर जी, आपके 24 क्विंटल नासिक लाल प्याज का सुबह का पिकअप निर्धारित है।\n⏰ समय: कल सुबह 06:30 - 07:30 बजे\n🚚 वाहन: MH-15-EG-4401 (इलेक्ट्रिक रीफर)\n👨‍✈️ चालक: संदीप कोली (+91 98231-10294)\nकृपया क्रेट्स फार्मगेट पर तैयार रखें।",
      escrowPaid: "💰 [कृषि सेतु एस्क्रो भुगतान]\nबधाई रामेश्वर जी! आपकी फसल की डिलीवरी सफलतापूर्वक सत्यापित हो गई है।\n₹67,200 आपके बैंक खाते (HDFC Bank A/C **8819) में UPI/NEFT द्वारा तुरंत जमा कर दिए गए हैं। शून्य दलाली!",
      buyerOrder: "📦 [KrishiSetu Fresh Direct]\nआपका ताज़ा फसल ऑर्डर #ORD-2026-9812 पुष्टि हो गया है। ₹9,300 डिजिटल एस्क्रो में सुरक्षित है। किसान रामेश्वर पाटिल द्वारा कल सुबह 08:30 बजे तक सीधा डिलीवरी होगी।"
    },
    mr: {
      pickup: "🚜 [कृषी सेतू वाहतूक संदेश]\nनमस्कार रामेश्वरजी, तुमचा २४ क्विंटल कांदा उद्या सकाळी पिकअप होणार आहे.\n⏰ वेळ: सकाळी ०६:३० ते ०७:३०\n🚚 गाडी: MH-15-EG-4401\nचालक: संदीप कोळी (+91 98231-10294).",
      escrowPaid: "💰 [कृषी सेतू थेट नफा जमा]\nअभिनंदन! डिलिव्हरी पूर्ण झाल्यावर ६७,२०० रुपये थेट तुमच्या बँक खात्यात तत्काळ जमा झाले आहेत. दलालांची मध्यस्थी शून्य!",
      buyerOrder: "📦 [KrishiSetu ऑर्डर निश्चित]\nतुमचा भाजीपाला थेट शेतकऱ्याकडून निघत आहे. डिलिव्हरी उद्या सकाळी ०८:३० पर्यंत होईल."
    },
    en: {
      pickup: "🚜 [KrishiSetu Milk-Run Dispatch]\nHello Rameshwar Patil, your 24 Qtl Red Onion pickup is confirmed.\n⏰ Window: Tomorrow 06:30 AM - 07:30 AM\n🚚 Vehicle: MH-15-EG-4401 (Reefer EV)\n👨‍✈️ Driver: Sandeep Koli (+91 98231-10294).",
      escrowPaid: "💰 [KrishiSetu Escrow Settlement]\nCongratulations! Produce delivery verified via OTP.\n₹67,200 has been credited directly to your bank account via UPI. Zero middleman commission deducted.",
      buyerOrder: "📦 [KrishiSetu Fresh Direct]\nOrder #ORD-2026-9812 confirmed. ₹9,300 locked in Escrow. Directly dispatched from farm gate."
    }
  };

  const handleTestSend = (title) => {
    addNotification(
      `Gateway Alert: ${title}`,
      `Dispatched via ${activeChannel.toUpperCase()} Gateway (Twilio/MSG91 Mock API).`,
      "success"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  Twilio & MSG91 Gateway
                </span>
                <span className="text-xs font-mono text-stone-400">Rural Vernacular SMS</span>
              </div>
              <h3 className="text-lg font-bold text-paper mt-1">
                Automated Dispatch & Payment Notification Rails
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Channel and Language Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveChannel('whatsapp')}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeChannel === 'whatsapp' ? 'bg-[#25D366] text-white shadow-sm' : 'text-stone-600'
                }`}
              >
                WhatsApp Gateway
              </button>
              <button
                onClick={() => setActiveChannel('sms')}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeChannel === 'sms' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600'
                }`}
              >
                Vernacular SMS
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-stone-500">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-stone-800 focus:outline-none"
              >
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Simulated WhatsApp / SMS Feed */}
          <div className="space-y-4">
            
            {/* Template 1: Milk-Run Morning Alert */}
            <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                <span>1. Farmer Morning Pickup Window Alert</span>
                <button
                  onClick={() => handleTestSend("Farmer Milk-Run Pickup")}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] flex items-center gap-1 transition shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Fire</span>
                </button>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs font-mono text-stone-800 whitespace-pre-line leading-relaxed shadow-sm">
                {messages[selectedLanguage].pickup}
              </div>
            </div>

            {/* Template 2: Escrow Disbursed Alert */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-950 font-bold">
                <span>2. Instant Bank Settlement (Zero Dalal Deduction)</span>
                <button
                  onClick={() => handleTestSend("Escrow Payout Disbursed")}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] flex items-center gap-1 transition shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Fire</span>
                </button>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs font-mono text-stone-800 whitespace-pre-line leading-relaxed shadow-sm">
                {messages[selectedLanguage].escrowPaid}
              </div>
            </div>

            {/* Template 3: Buyer Dispatch Alert */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-950 font-bold">
                <span>3. Buyer Society Group Booking Confirmation</span>
                <button
                  onClick={() => handleTestSend("Buyer Society Order Confirmation")}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] flex items-center gap-1 transition shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Fire</span>
                </button>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs font-mono text-stone-800 whitespace-pre-line leading-relaxed shadow-sm">
                {messages[selectedLanguage].buyerOrder}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-stone-50 border-t border-stone-200 rounded-b-3xl flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <CheckCheck className="w-4 h-4 text-[#25D366]" />
            DND-exempted transactional route for Indian farmers
          </span>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
