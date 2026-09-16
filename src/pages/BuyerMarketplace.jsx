import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Scale,
  QrCode,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Users,
  Building2,
  TrendingDown,
  TrendingUp,
  Scan
} from 'lucide-react';
import { calculatePriceBreakdown } from '../utils/aiForecast';

export default function BuyerMarketplace() {
  const {
    crops,
    setSelectedCrop,
    setActiveModal,
    addToCart,
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mode, setMode] = useState('B2C'); // 'B2C' (Retail & Society Group Buying) vs 'B2B' (Institutional Bulk)
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false);

  const categories = [
    { id: 'All', label: t('filterAll') },
    { id: 'Vegetables', label: t('filterVegetables') },
    { id: 'Grains', label: t('filterGrains') },
    { id: 'Fruits', label: t('filterFruits') },
    { id: 'Spices', label: t('filterSpices') },
  ];

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmer.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmer.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory; // category ids stay English keys
    const matchesOrganic = !showOnlyOrganic || crop.organicCert;
    return matchesSearch && matchesCategory && matchesOrganic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-settle">

      {/* Editorial Front Page — masthead hero, no gradient banner */}
      <section className="border border-hairline bg-paper-2/60">
        <div className="px-6 sm:px-10 pt-8 pb-6">
          <p className="eyebrow flex items-center gap-2 mb-4">
            <span className="w-8 border-t border-harvest-500 inline-block" />
            {t('heroEyebrow')}
          </p>

          <h1 className="font-display font-semibold text-3xl sm:text-5xl leading-[1.1] tracking-tight text-ink max-w-3xl">
            {t('heroTitleA')}{' '}
            <span className="italic text-field-500">{t('heroTitleB')}</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ink-2 leading-relaxed max-w-2xl">
            {t('heroBody')}
          </p>

          {/* Stat row — serif numerals with hairline dividers */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-hairline border-t border-hairline">
            <div className="py-3 sm:pr-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-field-500 shrink-0" />
              <div>
                <p className="stat-display text-2xl text-ink leading-none">+75%</p>
                <p className="text-meta uppercase text-ink-2 mt-1">{t('statFarmerGain')}</p>
              </div>
            </div>
            <div className="py-3 sm:px-6 flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-harvest-500 shrink-0" />
              <div>
                <p className="stat-display text-2xl text-ink leading-none">−25%</p>
                <p className="text-meta uppercase text-ink-2 mt-1">{t('statConsumerDrop')}</p>
              </div>
            </div>
            <div className="py-3 sm:pl-6 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
              <div>
                <p className="stat-display text-2xl text-ink leading-none">100%</p>
                <p className="text-meta uppercase text-ink-2 mt-1">{t('statEscrow')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Channel switcher */}
        <div className="px-6 sm:px-10 py-4 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-paper">
          <div className="flex items-center gap-0" role="tablist" aria-label="Trading mode">
            <button
              onClick={() => setMode('B2C')}
              role="tab"
              aria-selected={mode === 'B2C'}
              className={`flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition border ${
                mode === 'B2C'
                  ? 'bg-field-500 text-paper border-field-500'
                  : 'text-ink-2 border-hairline hover:border-ink-3'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t('modeB2c')}</span>
            </button>
            <button
              onClick={() => setMode('B2B')}
              role="tab"
              aria-selected={mode === 'B2B'}
              className={`flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition border -ml-px ${
                mode === 'B2B'
                  ? 'bg-field-500 text-paper border-field-500'
                  : 'text-ink-2 border-hairline hover:border-ink-3'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t('modeB2b')}</span>
            </button>
          </div>

          <p className="text-xs text-ink-2">
            {mode === 'B2C' ? (
              <>{t('minOrder')}: <strong className="text-ink">10 kg</strong> · {t('kgGroupDelivery')}</>
            ) : (
              <>{t('wholesaleContracts')}: <strong className="text-ink">250–1000 kg</strong> · {t('tieredFreight')}</>
            )}
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-ink-3 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-hairline rounded-sm text-sm text-ink placeholder-ink-3 focus:outline-none focus:border-field-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-[12px] font-bold uppercase tracking-wide whitespace-nowrap transition border rounded-sm ${
                selectedCategory === cat
                  ? 'bg-ink text-paper border-ink'
                  : 'text-ink-2 border-hairline hover:border-ink-3 bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <button
            onClick={() => setShowOnlyOrganic(!showOnlyOrganic)}
            aria-pressed={showOnlyOrganic}
            className={`px-3 py-2 text-[12px] font-bold uppercase tracking-wide whitespace-nowrap border rounded-sm flex items-center gap-1.5 transition ${
              showOnlyOrganic
                ? 'bg-field-50 text-field-500 border-field-200'
                : 'text-ink-2 border-hairline hover:border-ink-3 bg-white'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${showOnlyOrganic ? 'text-field-500' : 'text-ink-3'}`} />
            <span>{t('jaivikOnly')}</span>
          </button>
        </div>
      </div>

      {/* Produce Grid — editorial cards: hairline border, no shadow, serif price */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCrops.map((crop) => {
          const { direct } = calculatePriceBreakdown(crop);

          return (
            <article
              key={crop.id}
              className="bg-white border border-hairline hover:border-ink-3 transition-colors flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-paper-2">
                <img
                  src={crop.image}
                  alt={crop.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  <span className="px-2 py-0.5 bg-ink text-paper text-meta font-bold uppercase rounded-sm">
                    {crop.qualityGrade}
                  </span>
                  {crop.organicCert && (                      <span className="px-2 py-0.5 bg-field-500 text-paper text-meta font-bold uppercase rounded-sm">
                      {t('jaivikBharat')}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('quality-assay');
                    }}
                    title={t('qualityAssayTitle')}
                    className="p-1.5 px-2 bg-paper/95 hover:bg-white text-ink border border-hairline rounded-sm text-meta font-bold flex items-center gap-1 transition"
                  >
                    <Scan className="w-3.5 h-3.5 text-field-500" />
                    <span>{t('assay')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('traceability');
                    }}
                    title={t('traceTitle')}
                    className="p-1.5 px-2 bg-paper/95 hover:bg-white text-ink border border-hairline rounded-sm text-meta font-bold flex items-center gap-1 transition"
                  >
                    <QrCode className="w-3.5 h-3.5 text-field-500" />
                    <span>{t('trace')}</span>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-ink/85 px-3 py-1.5 text-paper text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-field-400 shrink-0" />
                    {crop.farmer.village}, {crop.farmer.district}
                  </span>
                  <span className="text-field-400 font-bold shrink-0">★ {crop.farmer.rating}</span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold text-ink text-lg leading-snug line-clamp-1">
                    {crop.name}
                  </h3>
                  <p className="text-xs text-ink-2 mt-1 line-clamp-2 leading-relaxed">
                    {crop.description}
                  </p>
                </div>

                {/* The Rupee — signature block, serif numerals */}
                <div className="border-t border-hairline pt-3 space-y-2.5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-meta uppercase text-ink-2">{t('youPayDirect')}</p>
                      <p className="stat-display text-[26px] leading-none text-field-500">
                        ₹{crop.krishiSetuPrice}
                        <span className="text-sm text-ink-2 font-sans font-medium"> /kg</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-meta uppercase text-ink-2">{t('retailMandi')}</p>
                      <p className="text-sm font-semibold text-ink-3 line-through tabular-nums">
                        ₹{crop.retailPrice}/kg
                      </p>
                    </div>
                  </div>

                  {/* Farmer share bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="text-ink-2">{t('farmerGets')} ₹{crop.farmerPrice}/kg</span>
                      <span className="text-field-500 font-bold tabular-nums">+{direct.farmerGainPercentage}%</span>
                    </div>
                    <div
                      className="w-full h-1.5 bg-paper-3 overflow-hidden flex"
                    role="img"
                    aria-label={t('farmerShareAria', direct.farmerPercentOfRupee)}
                    >
                      <div className="bg-field-500 h-full" style={{ width: `${direct.farmerPercentOfRupee}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setActiveModal('price-breakdown');
                    }}
                    className="w-full text-center text-[11px] font-bold text-ink-2 hover:text-ink flex items-center justify-center gap-1.5 pt-0.5 transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5 text-harvest-500" />
                    <span className="underline underline-offset-2 decoration-hairline hover:decoration-ink">
                      {t('whereRupeeGoes')}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink-2 border-t border-hairline pt-2.5">
                  <span>{t('available')}: <strong className="text-ink tabular-nums">{crop.quantity} {t('quintalShort')}</strong></span>
                  <span className="text-ink-3">{crop.harvestDate}</span>
                </div>

                <button
                  onClick={() => addToCart(crop, mode === 'B2B' ? crop.minOrderBulk : 20, mode)}
                  className="w-full py-2.5 bg-ink hover:bg-field-500 text-paper text-[12px] font-bold uppercase tracking-wide rounded-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{mode === 'B2B' ? t('procureBulkKg', crop.minOrderBulk) : t('addToBasket')}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
