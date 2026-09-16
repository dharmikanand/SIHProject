import React from 'react';
import { useApp } from '../context/AppContext';
import { X, QrCode, MapPin, Award, CheckCircle, ShieldCheck, ThermometerSnowflake, User, Calendar } from 'lucide-react';

export default function TraceabilityModal() {
  const { activeModal, setActiveModal, selectedCrop, t } = useApp();

  if (activeModal !== 'traceability' || !selectedCrop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-stone-900 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <QrCode className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  {t('traceBadge')}
                </span>
                <span className="text-xs font-mono text-stone-300">{selectedCrop.batchCode}</span>
              </div>
              <h3 className="text-lg font-bold text-paper mt-1">
                {t('traceModalTitle')}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Farmer & Farm Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <img
              src={selectedCrop.farmer.avatar}
              alt={selectedCrop.farmer.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shrink-0 shadow-sm"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="font-bold text-stone-900 text-base">{selectedCrop.farmer.name}</h4>
                <span className="text-xs font-semibold text-field-700 bg-field-50 px-2.5 py-0.5 rounded-sm">
                  ★ {selectedCrop.farmer.rating} {t('ratedLabel')}
                </span>
              </div>
              <p className="text-xs text-stone-600 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {selectedCrop.farmer.village}, {selectedCrop.farmer.district}, {selectedCrop.farmer.state}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200 text-xs">
                <div>
                  <span className="text-ink-2 block text-[10px] uppercase">{t('landholdingLabel')}</span>
                  <span className="font-semibold text-stone-800">{selectedCrop.farmer.landSize}</span>
                </div>
                <div>
                  <span className="text-ink-2 block text-[10px] uppercase">{t('fpoMemberLabel')}</span>
                  <span className="font-semibold text-stone-800 truncate block">{selectedCrop.farmer.fpo}</span>
                </div>
                <div>
                  <span className="text-ink-2 block text-[10px] uppercase">{t('farmingExpLabel')}</span>
                  <span className="font-semibold text-stone-800">{selectedCrop.farmer.experience}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality & Lab Diagnostics */}
          <div>
            <h5 className="text-xs font-bold text-ink-2 uppercase tracking-wider mb-3">
              {t('qualityMetricsTitle')}
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <span className="text-[10px] font-semibold text-field-800 block">{t('gradeClassification')}</span>
                <span className="font-bold text-emerald-950 text-sm mt-0.5 block">{selectedCrop.qualityGrade}</span>
                <span className="text-[10px] text-emerald-700">Visual AI Inspection</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200">
                <span className="text-[10px] font-semibold text-field-800 block">{t('pesticideResidue')}</span>
                <span className="font-bold text-field-900 text-sm mt-0.5 block">0.00 ppm ({t('cleanLabel')})</span>
                <span className="text-[10px] text-blue-700">Lab Chromatography</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
                <span className="text-[10px] font-semibold text-harvest-700 block">{t('harvestDateLabel')}</span>
                <span className="font-bold text-amber-950 text-sm mt-0.5 block">{selectedCrop.harvestDate}</span>
                <span className="text-[10px] text-amber-700">Farm Gate Sealed</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200">
                <span className="text-[10px] font-semibold text-harvest-700 block">{t('storageTelemetry')}</span>
                <span className="font-bold text-purple-950 text-sm mt-0.5 block">{selectedCrop.storageCondition}</span>
                <span className="text-[10px] text-purple-700">Cold-Chain Logged</span>
              </div>
            </div>
          </div>

          {/* Farm-to-Fork Timeline */}
          <div>
            <h5 className="text-xs font-bold text-ink-2 uppercase tracking-wider mb-3">
              {t('milestonesTitle')}
            </h5>
            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-300">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow" />
                <p className="text-xs font-bold text-ink">{t('milestone1')}</p>
                <p className="text-[11px] text-ink-2">{t('milestone1Sub', selectedCrop.farmer.fpo)}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow" />
                <p className="text-xs font-bold text-ink">{t('milestone2')}</p>
                <p className="text-[11px] text-ink-2">{t('milestone2Sub')}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow" />
                <p className="text-xs font-bold text-ink">{t('milestone3')}</p>
                <p className="text-[11px] text-ink-2">{t('milestone3Sub')}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-stone-50 border-t border-stone-200 rounded-b-3xl flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('traceFooterNote')}
          </span>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 bg-ink hover:bg-field-700 text-paper text-xs font-semibold rounded-sm transition"
          >
            {t('closeLabel')}
          </button>
        </div>

      </div>
    </div>
  );
}
