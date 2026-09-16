import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n';
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, ArrowRight, Globe } from 'lucide-react';

/**
 * KrishiSetu Voice AI — conversations happen entirely in the user's chosen language.
 * Flow: (1) language selection step (spoken aloud), (2) assistant step where every
 * transcript, reply and TTS utterance uses the selected language's BCP-47 locale.
 */

// Localized sample queries & replies per language code
const VOICE_CORPUS = {
  en: {
    greeting: 'Hello! I am your KrishiSetu assistant. Ask me about prices, forecasts, or selling your crop.',
    queries: [
      {
        text: 'What is the onion price in Nashik today?',
        action: 'price_query',
        reply: 'In Nashik mandi, onions trade at ₹16 per kg locally. On KrishiSetu, farmers receive ₹28 per kg directly. Demand is expected to rise over the next 5 days.',
      },
      {
        text: 'Show my cluster milk-run route.',
        action: 'open_logistics',
        reply: 'Opening the logistics dashboard. Your Nashik cluster route combines 5 farmers into one optimized run, saving 65% on freight.',
      },
      {
        text: 'When should I sell my tomato crop?',
        action: 'forecast_query',
        reply: 'Kolar tomato expects heavy arrivals next week. My advice: sell Grade-A produce within 48 hours to bulk buyers or group-buy orders.',
      },
      {
        text: 'I want to list 20 quintals of wheat.',
        action: 'open_listing',
        reply: 'Opening the farmer portal for you. You can register your new crop listing now.',
      },
    ],
  },
  hi: {
    greeting: 'नमस्ते! मैं आपकी कृषिसेतु सहायक हूँ। भाव, पूर्वानुमान या फसल बेचने के बारे में पूछें।',
    queries: [
      {
        text: 'आज नासिक में प्याज का क्या भाव है?',
        action: 'price_query',
        reply: 'नासिक मंडी में प्याज ₹16 प्रति किलो चल रहा है, जबकि कृषिसेतु पर किसान सीधे ₹28 प्रति किलो पाते हैं। अगले 5 दिनों में मांग बढ़ने का अनुमान है।',
      },
      {
        text: 'मेरे क्लस्टर का मिल्क-रन रूट दिखाओ।',
        action: 'open_logistics',
        reply: 'लॉजिस्टिक्स डैशबोर्ड खोल रही हूँ। नासिक क्लस्टर के 5 किसानों का माल एक अनुकूलित मार्ग पर 65% ढुलाई बचाता है।',
      },
      {
        text: 'मुझे टमाटर की फसल कब बेचनी चाहिए?',
        action: 'forecast_query',
        reply: 'कोलार टमाटर में अगले हफ्ते भारी आवक संभव है। सलाह: ग्रेड-ए टमाटर 48 घंटे में थोक खरीदारों को बेच दें।',
      },
      {
        text: '20 क्विंटल गेहूं बेचना है, नई लिस्टिंग खोलो।',
        action: 'open_listing',
        reply: 'किसान पोर्टल खोल दिया है। अब आप अपनी नई फसल दर्ज कर सकते हैं।',
      },
    ],
  },
  mr: {
    greeting: 'नमस्कार! मी तुमची कृषीसेतू सहाय्यक आहे. भाव, अंदाज किंवा पीक विक्रीबद्दल विचारा.',
    queries: [
      {
        text: 'आज नाशिकमध्ये कांद्याचा दर काय आहे?',
        action: 'price_query',
        reply: 'नाशिक बाजार समितीत कांदा ₹16 प्रति किलो आहे, तर कृषीसेतूवर शेतकरी थेट ₹28 प्रति किलो मिळवतात. पुढील 5 दिवसांत मागणी वाढण्याची शक्यता आहे.',
      },
      {
        text: 'माझ्या क्लस्टरचा मिल्क-रन मार्ग दाखवा.',
        action: 'open_logistics',
        reply: 'लॉजिस्टिक्स डॅशबोर्ड उघडत आहे. नाशिक क्लस्टरमधील 5 शेतकऱ्यांचा माल एका मार्गाने 65% वाहतूक खर्च वाचवतो.',
      },
      {
        text: 'टोमॅटोचे पीक कधी विकावे?',
        action: 'forecast_query',
        reply: 'कोल्हापूर टोमॅटोला पुढच्या आठवड्यात मोठा पुरवठा अपेक्षित आहे. सल्ला: ग्रेड-ए टोमॅटो 48 तासांत घाऊक खरेदीदारांना विका.',
      },
      {
        text: '20 क्विंटल गहू विकायचा आहे.',
        action: 'open_listing',
        reply: 'शेतकरी पोर्टल उघडले आहे. आता तुम्ही नवीन पीक नोंदवू शकता.',
      },
    ],
  },
  pa: {
    greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕ੍ਰਿਸ਼ੀ ਸੇਤੂ ਸਹਾਇਕ ਹਾਂ। ਰੇਟ, ਅਨੁਮਾਨ ਜਾਂ ਫਸਲ ਵੇਚਣ ਬਾਰੇ ਪੁੱਛੋ।',
    queries: [
      {
        text: 'ਅੱਜ ਨਾਸਿਕ ਵਿੱਚ ਪਿਆਜ਼ ਦਾ ਰੇਟ ਕੀ ਹੈ?',
        action: 'price_query',
        reply: 'ਨਾਸਿਕ ਮੰਡੀ ਵਿੱਚ ਪਿਆਜ਼ ₹16 ਪ੍ਰਤੀ ਕਿੱਲੋ ਹੈ, ਜਦਕਿ ਕ੍ਰਿਸ਼ੀ ਸੇਤੂ ਉੱਤੇ ਕਿਸਾਨ ਸਿੱਧੇ ₹28 ਪ੍ਰਤੀ ਕਿੱਲੋ ਲੈਂਦੇ ਹਨ। ਅਗਲੇ 5 ਦਿਨਾਂ ਵਿੱਚ ਮੰਗ ਵੱਧਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।',
      },
      {
        text: 'ਮੇਰੇ ਕਲੱਸਟਰ ਦਾ ਮਿਲਕ-ਰਨ ਰੂਟ ਵਿਖਾਓ।',
        action: 'open_logistics',
        reply: 'ਲੌਜਿਸਟਿਕਸ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ। ਨਾਸਿਕ ਕਲੱਸਟਰ ਦੇ 5 ਕਿਸਾਨਾਂ ਦਾ ਮਾਲ ਇੱਕ ਰੂਟ ਉੱਤੇ 65% ਢੁਆਈ ਬਚਾਉਂਦਾ ਹੈ।',
      },
      {
        text: 'ਟਮਾਟਰ ਦੀ ਫਸਲ ਕਦੋਂ ਵੇਚਾਂ?',
        action: 'forecast_query',
        reply: 'ਕੋਲਾਰ ਟਮਾਟਰ ਅਗਲੇ ਹਫ਼ਤੇ ਜ਼ਿਆਦਾ ਆਵਾਜਾਈ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਸਲਾਹ: ਗ੍ਰੇਡ-ਏ ਟਮਾਟਰ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਥੋਕ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਵੇਚ ਦਿਓ।',
      },
      {
        text: '20 ਕਵਿੰਟਲ ਕਣਕ ਵੇਚਣੀ ਹੈ।',
        action: 'open_listing',
        reply: 'ਕਿਸਾਨ ਪੋਰਟਲ ਖੋਲ੍ਹ ਦਿੱਤਾ ਹੈ। ਹੁਣ ਤੁਸੀਂ ਨਵੀਂ ਫਸਲ ਦਰਜ ਕਰ ਸਕਦੇ ਹੋ।',
      },
    ],
  },
  ta: {
    greeting: 'வணக்கம்! நான் உங்கள் கிருஷி சேது உதவியாளர். விலை, கணிப்பு அல்லது விற்பனை பற்றி கேளுங்கள்.',
    queries: [
      {
        text: 'இன்று நாசிக்கில் வெங்காய விலை என்ன?',
        action: 'price_query',
        reply: 'நாசிக் சந்தையில் வெங்காயம் கிலோ ₹16. கிருஷி சேதுவில் விவசாயிகள் நேரடியாக கிலோ ₹28 பெறுகிறார்கள். அடுத்த 5 நாட்களில் தேவை அதிகரிக்கும்.',
      },
      {
        text: 'என் கிளஸ்டர் மில்க்-ரன் பாதையை காட்டு.',
        action: 'open_logistics',
        reply: 'லாஜிஸ்டிக்ஸ் டாஷ்போர்டு திறக்கிறது. நாசிக் கிளஸ்டரின் 5 விவசாயிகளின் சரக்கு ஒரே பாதையில் 65% போக்குவரத்து செலவை மிச்சப்படுத்துகிறது.',
      },
      {
        text: 'தக்காளி பயிரை எப்போது விக்க வேண்டும்?',
        action: 'forecast_query',
        reply: 'கோலார் தக்காளிக்கு அடுத்த வாரம் அதிக வரவு எதிர்பார்க்கப்படுகிறது. ஆலோசனை: கிரேட்-ஏ தக்காளியை 48 மணி நேரத்தில் மொத்த வாங்குபவர்களிடம் விற்றுவிடுங்கள்.',
      },
      {
        text: '20 குவின்டால் கோதுமை விக்க வேண்டும்.',
        action: 'open_listing',
        reply: 'விவசாயி போர்ட்டல் திறக்கப்பட்டது. இப்போது புதிய பயிரை பதிவு செய்யலாம்.',
      },
    ],
  },
  te: {
    greeting: 'నమస్కారం! నేను మీ కృషిసేతు సహాయకురాలిని. ధరలు, అంచనాలు లేదా పంట అమ్మకం గురించి అడగండి.',
    queries: [
      {
        text: 'ఈరోజు నాసిక్‌లో ఉల్లి ధర ఎంత?',
        action: 'price_query',
        reply: 'నాసిక్ మార్కెట్‌లో ఉల్లి కిలో ₹16. కృషిసేతులో రైతులు నేరుగా కిలో ₹28 పొందుతారు. వచ్చే 5 రోజుల్లో డిమాండ్ పెరుగుతుంది.',
      },
      {
        text: 'నా క్లస్టర్ మిల్క్-రన్ మార్గం చూపించు.',
        action: 'open_logistics',
        reply: 'లాజిస్టిక్స్ డాష్‌బోర్డ్ తెరుస్తోంది. నాసిక్ క్లస్టర్‌లోని 5 రైతుల సరుకు ఒకే మార్గంలో 65% రవాణా ఖర్చు ఆదా చేస్తుంది.',
      },
      {
        text: 'టమాటా పంట ఎప్పుడు అమ్మాలి?',
        action: 'forecast_query',
        reply: 'కోలార్ టమాటాకు వచ్చే వారం అధిక రాక ఉండవచ్చు. సలహా: గ్రేడ్-ఏ టమాటాను 48 గంటల్లో హోల్‌సేల్ కొనుగోలుదారులకు అమ్మేయండి.',
      },
      {
        text: '20 క్వింటాల్స్ గోధుమ అమ్మాలి.',
        action: 'open_listing',
        reply: 'రైతు పోర్టల్ తెరవబడింది. ఇప్పుడు మీ కొత్త పంటను నమోదు చేయవచ్చు.',
      },
    ],
  },
};

export default function VoiceAssistantModal() {
  const { activeModal, setActiveModal, setPersona, language, addNotification, t } = useApp();
  const [stage, setStage] = useState('language'); // 'language' | 'assistant'
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const spokenOnce = useRef(false);

  const corpus = VOICE_CORPUS[language] || VOICE_CORPUS.en;
  const locale = (LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]).bcp47;

  const handleSpeak = (text, lang = locale) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
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
    }
    setIsSpeaking(false);
  };

  // Reset to language step each time the modal opens
  useEffect(() => {
    if (activeModal === 'voice-assistant') {
      setStage('language');
      setTranscript('');
      setAssistantReply('');
      spokenOnce.current = false;
    } else {
      handleStopSpeaking();
    }
  }, [activeModal]);

  // When language chosen → greet in that language
  const chooseLanguage = (code) => {
    setStage('assistant');
    const greet = (VOICE_CORPUS[code] || VOICE_CORPUS.en).greeting;
    setAssistantReply(greet);
    if (!spokenOnce.current) {
      handleSpeak(greet, (LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]).bcp47);
      spokenOnce.current = true;
    }
  };

  const executeVoiceCommand = (query) => {
    setTranscript(query.text);
    setAssistantReply(query.reply);
    handleSpeak(query.reply);

    if (query.action === 'open_listing') {
      setPersona('farmer');
      setTimeout(() => setActiveModal('add-listing'), 900);
    } else if (query.action === 'open_logistics') {
      setPersona('logistics');
      setTimeout(() => setActiveModal(null), 1000);
    } else if (query.action === 'forecast_query') {
      setPersona('ai-forecast');
      setTimeout(() => setActiveModal(null), 1000);
    } else if (query.action === 'price_query') {
      setPersona('buyer');
      addNotification('KrishiSetu AI', query.reply.slice(0, 80) + '…', 'info');
    }
  };

  const toggleMicListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript('');
      // Simulated speech detection (Web Speech API mic requires permissions)
      setTimeout(() => {
        setIsListening(false);
        const q = corpus.queries[Math.floor(Math.random() * corpus.queries.length)];
        executeVoiceCommand(q);
      }, 2200);
    }
  };

  if (activeModal !== 'voice-assistant') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 animate-fadeIn" role="dialog" aria-modal="true" aria-label="Voice assistant">
      <div className="bg-paper border border-hairline shadow-modal max-w-xl w-full relative overflow-hidden animate-settle">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline bg-paper-2/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-field-500 flex items-center justify-center text-paper">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-ink leading-tight">
                {t('voiceTitle')}
              </h3>
              <p className="text-xs text-ink-2">{t('voiceSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => { handleStopSpeaking(); setActiveModal(null); }}
            aria-label="Close"
            className="p-2 text-ink-3 hover:text-ink hover:bg-paper-2 rounded-sm transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {stage === 'language' ? (
          /* ---------- Language selection step ---------- */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-sm bg-field-50 border border-field-200 flex items-center justify-center text-field-500 mb-4">
              <Globe className="w-7 h-7" />
            </div>
            <h4 className="font-display font-semibold text-2xl text-ink">
              {t('voiceChooseLanguage')}
            </h4>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md mx-auto">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => chooseLanguage(l.code)}
                  className="py-3 px-2 border border-hairline bg-white hover:border-field-500 hover:bg-field-50 transition rounded-sm"
                >
                  <span className="font-display font-semibold text-lg text-ink block">{l.sample}</span>
                  <span className="text-[11px] text-ink-3 uppercase tracking-widest">{l.code}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ---------- Assistant step ---------- */
          <div className="p-5 sm:p-6">
            {/* Mic centerpiece */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="relative">
                {isListening && <div className="absolute -inset-4 rounded-full bg-field-500/20 animate-ping" />}
                <button
                  onClick={toggleMicListening}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-raised ${
                    isListening
                      ? 'bg-harvest-500 text-paper scale-105'
                      : 'bg-field-500 hover:bg-field-600 text-paper hover:scale-105'
                  }`}
                >
                  {isListening ? <MicOff className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>
              <p className="text-sm font-semibold mt-4 text-ink">
                {isListening ? t('voiceListening') : t('voiceTapMic')}
              </p>
              <p className="text-meta uppercase text-ink-3 mt-1">{t('voiceSupported')}</p>
            </div>

            {/* Transcript + reply */}
            {(transcript || assistantReply) && (
              <div className="mb-5 border border-hairline bg-white divide-y divide-hairline">
                {transcript && (
                  <div className="p-4">
                    <span className="eyebrow block">{t('voiceYouAsked')}</span>
                    <p className="text-sm text-ink font-medium mt-1">“{transcript}”</p>
                  </div>
                )}
                {assistantReply && (
                  <div className="p-4 flex items-start gap-3">
                    <div className="p-1.5 bg-field-50 text-field-500 border border-field-200 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="eyebrow text-field-500 block">{t('voiceReply')}</span>
                      <p className="text-sm text-ink leading-relaxed mt-1">{assistantReply}</p>
                    </div>
                    {isSpeaking ? (
                      <button onClick={handleStopSpeaking} title={t('voiceStopAudio')} className="p-1.5 text-ink-3 hover:text-ink border border-hairline">
                        <VolumeX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => handleSpeak(assistantReply)} title={t('voicePlayAudio')} className="p-1.5 text-field-500 hover:text-field-600 border border-hairline">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sample commands in the chosen language */}
            <p className="eyebrow mb-2">{t('voiceTryThese')}</p>
            <div className="space-y-1.5">
              {corpus.queries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => executeVoiceCommand(q)}
                  className="w-full text-left text-xs p-3 border border-hairline bg-white hover:border-field-500 text-ink-2 hover:text-ink flex items-center justify-between group transition rounded-sm"
                >
                  <span className="truncate pr-2">“{q.text}”</span>
                  <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-field-500 shrink-0 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
