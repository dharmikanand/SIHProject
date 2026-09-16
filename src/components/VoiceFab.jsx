import React from 'react';
import { useApp } from '../context/AppContext';
import { Mic } from 'lucide-react';

/**
 * Floating voice-AI launcher — bottom-right, always visible.
 * Sits above content, pulses once on mount for discoverability, respects z-index
 * of modals (modals are z-50; this is z-40 so it never blocks them).
 */
export default function VoiceFab() {
  const { setActiveModal, t } = useApp();

  return (
    <button
      onClick={() => setActiveModal('voice-assistant')}
      aria-label={t('voiceAssistant')}
      title={t('voiceAssistant')}
      className="fixed bottom-5 right-5 z-40 group"
    >
      {/* Label chip reveals on hover (desktop) */}
      <span className="hidden sm:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap bg-ink text-paper text-[12px] font-bold px-3 py-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-raised">
        {t('voiceAi')}
      </span>

      <span className="relative flex w-14 h-14 rounded-full bg-field-500 hover:bg-field-600 text-paper items-center justify-center shadow-raised transition-transform group-hover:scale-105">
        {/* Soft attention ring */}
        <span className="absolute inset-0 rounded-full bg-field-500/30 animate-ping" aria-hidden="true" />
        <Mic className="relative w-6 h-6" />
      </span>
    </button>
  );
}
