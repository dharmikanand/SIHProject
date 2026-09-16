import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n';
import { Sprout, Tractor, ShoppingBasket, Globe, ArrowRight, ShieldCheck, Phone, Check } from 'lucide-react';

/** Static field wrapper — MUST live outside the component: defining it inline
 *  creates a new component type every render, remounting inputs and dropping focus. */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const INPUT_CLS =
  'w-full px-3 py-2.5 bg-white border border-hairline rounded-sm text-sm text-ink placeholder-ink-3 focus:outline-none focus:border-field-500';

/**
 * Editorial login gate: role selection → language → mobile OTP.
 * Demo OTP is 4321. Auth state lives in AppContext (`login`, `user`).
 */
export default function LoginPage() {
  const { t, login, language, setLanguage } = useApp();
  const [step, setStep] = useState('role'); // 'role' | 'details'
  const [role, setRole] = useState(null); // 'farmer' | 'buyer'
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const pickRole = (r) => {
    setRole(r);
    setStep('details');
    setError('');
  };

  const sendOtp = () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError(t('authInvalidMobile'));
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const verify = () => {
    if (otp !== '4321') {
      setError(t('authInvalidOtp'));
      return;
    }
    login({ name: name || (role === 'farmer' ? 'Farmer' : 'Buyer'), role, mobile, language });
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      {/* Ink ministry strip */}
      <div className="bg-ink text-ink-3 text-meta py-1.5 px-4 sm:px-8 flex items-center justify-between uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-field-400 animate-pulse" />
          {t('sihBanner')} · {t('psLabel')} <strong className="text-field-400 font-mono">26033</strong>
        </span>
        <span className="hidden sm:inline">{t('docaLabel')}</span>
      </div>

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left: editorial panel */}
        <div className="hidden lg:flex flex-col justify-between bg-ink text-paper p-12">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-sm bg-field-500 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-semibold text-2xl leading-none">{t('brandName')}</p>
              <p className="text-[11px] text-ink-3 mt-1">{t('brandSubtitle')}</p>
            </div>
          </div>

          <div>
            <p className="eyebrow text-field-400 mb-4 flex items-center gap-2">
              <span className="w-8 border-t border-field-400 inline-block" />
              {t('heroEyebrow')}
            </p>
            <h1 className="font-display font-semibold text-4xl xl:text-5xl leading-[1.12] tracking-tight">
              {t('heroTitleA')}{' '}
              <span className="italic text-field-400">{t('heroTitleB')}</span>
            </h1>
            <p className="mt-5 text-sm text-ink-3 leading-relaxed max-w-md">{t('heroBody')}</p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-ink-3 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            {t('escrowGuaranteed')} · DoCA
          </div>
        </div>

        {/* Right: auth card */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-sm bg-field-500 flex items-center justify-center text-paper">
                <Sprout className="w-5 h-5" />
              </div>
              <p className="font-display font-semibold text-2xl">{t('brandName')}</p>
            </div>

            <p className="eyebrow mb-2">{t('authWelcome')}</p>
            <p className="text-sm text-ink-2 mb-6">{t('authTagline')}</p>

            {/* Language selector */}
            <div className="mb-7">
              <p className="eyebrow mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {t('authLanguageTitle')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    aria-pressed={language === l.code}
                    className={`px-3 py-1.5 text-[12px] font-bold rounded-sm border transition ${
                      language === l.code
                        ? 'bg-field-500 text-paper border-field-500'
                        : 'bg-white text-ink-2 border-hairline hover:border-ink-3'
                    }`}
                  >
                    {l.sample}
                  </button>
                ))}
              </div>
            </div>

            {step === 'role' ? (
              <>
                <div className="rule pt-6">
                  <p className="eyebrow mb-3">{t('authChooseRole')}</p>
                  <div className="space-y-3">
                    <button
                      onClick={() => pickRole('farmer')}
                      className="w-full text-left p-4 border border-hairline hover:border-field-500 bg-white group transition flex items-center gap-4"
                    >
                      <div className="w-11 h-11 rounded-sm bg-field-50 border border-field-200 flex items-center justify-center text-field-500 group-hover:bg-field-500 group-hover:text-paper transition">
                        <Tractor className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-lg text-ink leading-tight">{t('authRoleFarmer')}</p>
                        <p className="text-xs text-ink-2 mt-0.5">{t('authRoleFarmerDesc')}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-field-500 group-hover:translate-x-0.5 transition" />
                    </button>

                    <button
                      onClick={() => pickRole('buyer')}
                      className="w-full text-left p-4 border border-hairline hover:border-harvest-500 bg-white group transition flex items-center gap-4"
                    >
                      <div className="w-11 h-11 rounded-sm bg-harvest-100 border border-harvest-200 flex items-center justify-center text-harvest-500 group-hover:bg-harvest-500 group-hover:text-paper transition">
                        <ShoppingBasket className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-lg text-ink leading-tight">{t('authRoleBuyer')}</p>
                        <p className="text-xs text-ink-2 mt-0.5">{t('authRoleBuyerDesc')}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-harvest-500 group-hover:translate-x-0.5 transition" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rule pt-6 space-y-4">
                <p className="eyebrow">
                  {role === 'farmer' ? t('authRoleFarmer') : t('authRoleBuyer')}
                </p>

                <Field label={t('authNameLabel')}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('authNamePlaceholder')}
                    className={INPUT_CLS}
                  />
                </Field>

                <Field label={t('authMobileLabel')}>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-ink-3 absolute left-3 top-3" />
                    <input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder={t('authMobilePlaceholder')}
                      inputMode="numeric"
                      className={`${INPUT_CLS} pl-9 tabular-nums`}
                    />
                  </div>
                </Field>

                {otpSent ? (
                  <div>
                    <p className="text-xs text-ink-2 mb-2">
                      {t('authOtpSent')} <strong className="text-ink">+91 {mobile}</strong> ·{' '}
                      <span className="text-gold-600 font-semibold">{t('authDemoOtp')}</span>
                    </p>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((i) => (
                        <input
                          key={i}
                          value={otp[i] || ''}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '');
                            const digit = v.slice(-1); // keep only the last pressed digit
                            setOtp((otp.slice(0, i) + digit + otp.slice(i + 1)).slice(0, 4));
                            if (digit) {
                              const next = e.target.nextElementSibling;
                              if (next) next.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !e.target.value) {
                              const prev = e.target.previousElementSibling;
                              if (prev) prev.focus();
                            }
                          }}
                          inputMode="numeric"
                          aria-label={`OTP digit ${i + 1}`}
                          className="w-12 h-12 text-center font-display text-xl bg-white border border-hairline rounded-sm focus:outline-none focus:border-field-500"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {error && <p className="text-xs text-harvest-600 font-medium">{error}</p>}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => { setStep('role'); setOtpSent(false); setError(''); }}
                    className="px-3 py-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-2 border border-hairline rounded-sm hover:bg-paper-2 transition"
                  >
                    {t('authBack')}
                  </button>
                  {!otpSent ? (
                    <button
                      onClick={sendOtp}
                      className="flex-1 py-2.5 bg-ink hover:bg-field-500 text-paper text-[12px] font-bold uppercase tracking-wide rounded-sm transition"
                    >
                      {t('authSendOtp')}
                    </button>
                  ) : (
                    <button
                      onClick={verify}
                      className="flex-1 py-2.5 bg-field-500 hover:bg-field-600 text-paper text-[12px] font-bold uppercase tracking-wide rounded-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      {t('authVerifyLogin')}
                    </button>
                  )}
                </div>
              </div>
            )}

            <p className="text-[11px] text-ink-3 mt-8 leading-relaxed">{t('authByProceeding')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
