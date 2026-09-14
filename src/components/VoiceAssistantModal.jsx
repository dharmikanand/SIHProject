import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function VoiceAssistantModal() {
  const { activeModal, setActiveModal, setPersona, addNotification, crops } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Pre-configured voice queries for quick testing
  const sampleQueries = [
    {
      text: "आज नासिक में प्याज का क्या भाव चल रहा है?",
      action: "price_query",
      reply: "नासिक मंडी में प्याज का स्थानीय भाव ₹16 प्रति किलो है, जबकि कृषि सेतु पर किसान सीधे ₹28 प्रति किलो पा रहे हैं। मांग अगले 5 दिनों में बढ़ने का अनुमान है।"
    },
    {
      text: "कोलार टमाटर का मांग पूर्वानुमान और कटाई सलाह क्या है?",
      action: "forecast_query",
      reply: "कोलार टमाटर में अगले सप्ताह भारी आवक की संभावना है। सलाह दी जाती है कि ग्रेड-ए टमाटर 48 घंटे में सीधे थोक खरीदार या ग्रुप-बाय में बेचें।"
    },
    {
      text: "मुझे 20 क्विंटल शरबती गेहूं बेचना है, नई लिस्टिंग खोलो।",
      action: "open_listing",
      reply: "जी हाँ, मैंने किसान पोर्टल खोल दिया है। आप अपनी नई फसल का विवरण भर सकते हैं।"
    },
    {
      text: "मेरे क्लस्टर का एआई मिल्क-रन रूट दिखाओ।",
      action: "open_logistics",
      reply: "लॉजिस्टिक्स डैशबोर्ड खोला जा रहा है। नासिक क्लस्टर के 5 किसानों का रूट एक साथ जोड़कर 65% ढुलाई खर्च बचाया गया है।"
    }
  ];

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const executeVoiceCommand = (query) => {
    setTranscript(query.text);
    setAssistantReply(query.reply);
    handleSpeak(query.reply);

    if (query.action === 'open_listing') {
      setPersona('farmer');
      setTimeout(() => {
        setActiveModal('add-listing');
      }, 900);
    } else if (query.action === 'open_logistics') {
      setPersona('logistics');
      setTimeout(() => {
        setActiveModal(null);
      }, 1000);
    } else if (query.action === 'forecast_query') {
      setPersona('ai-forecast');
      setTimeout(() => {
        setActiveModal(null);
      }, 1000);
    }
  };

  const toggleMicListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript("Listening for your voice... (सुन रहे हैं...)");
      // Simulate speech detection if Web Speech API is not granted or supported
      setTimeout(() => {
        setIsListening(false);
        executeVoiceCommand(sampleQueries[0]);
      }, 2500);
    }
  };

  if (activeModal !== 'voice-assistant') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 text-white relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-harvest-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                KrishiSetu Voice AI (कृषि वाणी)
              </h3>
              <p className="text-xs text-emerald-400">
                Multilingual Speech Assistant for Farmers & Buyers
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStopSpeaking();
              setActiveModal(null);
            }}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Pulse Centerpiece */}
        <div className="py-8 flex flex-col items-center justify-center text-center relative z-10">
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-4 rounded-full bg-emerald-500/30 animate-ping" />
            )}
            <button
              onClick={toggleMicListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                isListening
                  ? 'bg-red-500 text-white shadow-red-500/50 scale-105'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/40 hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 animate-pulse" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <p className="text-sm font-semibold mt-5 text-stone-200">
            {isListening ? "Listening... बोलिए..." : "Tap mic or choose a common voice query below"}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Supports Hindi (हिन्दी), Marathi, Punjabi, Tamil & English
          </p>
        </div>

        {/* Live Transcript / Assistant Answer Box */}
        {(transcript || assistantReply) && (
          <div className="mb-6 p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3 relative z-10">
            {transcript && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">You asked</span>
                <p className="text-sm text-stone-100 font-medium mt-0.5">"{transcript}"</p>
              </div>
            )}
            {assistantReply && (
              <div className="pt-2 border-t border-stone-700/60 flex items-start gap-2.5">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">KrishiSetu AI Reply</span>
                  <p className="text-sm text-emerald-100 leading-relaxed mt-0.5">{assistantReply}</p>
                </div>
                {isSpeaking ? (
                  <button
                    onClick={handleStopSpeaking}
                    className="p-1.5 text-stone-400 hover:text-white bg-stone-700/50 rounded-lg"
                    title="Stop Audio"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSpeak(assistantReply)}
                    className="p-1.5 text-emerald-400 hover:text-white bg-stone-700/50 rounded-lg"
                    title="Play Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Voice Prompt Shortcuts */}
        <div className="space-y-2 relative z-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            Try Sample Farmer Voice Commands (एक क्लिक में पूछें):
          </p>
          <div className="grid grid-cols-1 gap-2">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => executeVoiceCommand(q)}
                className="text-left text-xs p-3 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700/60 hover:border-emerald-500/50 text-stone-200 hover:text-white flex items-center justify-between group transition"
              >
                <span className="truncate pr-2">"{q.text}"</span>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 shrink-0 transform group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
