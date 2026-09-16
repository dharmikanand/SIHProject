import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Ban,
  IndianRupee
} from 'lucide-react';

/**
 * My Orders — visible to both roles but scoped by role:
 *  buyer  → their placed orders, cancel-while-waiting, OTP release
 *  farmer → incoming orders whose escrow will pay them, + released payout history
 * Order lifecycle: WAITING → IN_TRANSIT → DELIVERED  |  CANCELLED (refund).
 */
export default function MyOrdersPage() {
  const { orders, cancelOrder, releaseEscrow, user, t, language } = useApp();
  const [confirmId, setConfirmId] = useState(null);
  const isFarmer = user?.role === 'farmer';

  const statusBadge = (o) => {
    if (o.status === 'CANCELLED')
      return { label: t('orderCancelled'), cls: 'bg-harvest-100 text-harvest-700 border-harvest-200', icon: XCircle };
    if (o.escrowStatus === 'RELEASED_TO_FARMER')
      return { label: t('orderDelivered'), cls: 'bg-field-50 text-field-500 border-field-200', icon: CheckCircle2 };
    if (o.logisticsStatus === 'IN_TRANSIT')
      return { label: t('orderInTransit'), cls: 'bg-gold-100 text-gold-600 border-gold-100', icon: Truck };
    return { label: t('orderWaiting'), cls: 'bg-paper-2 text-ink-2 border-hairline', icon: Clock };
  };

  const escrowBadge = (o) => {
    if (o.status === 'CANCELLED') return t('orderEscrowRefunded');
    if (o.escrowStatus === 'RELEASED_TO_FARMER') return t('orderEscrowReleased');
    return t('orderEscrowLocked');
  };

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-settle">
      <header className="rule pt-6">
        <p className="eyebrow mb-1">{isFarmer ? t('navFarmer') : t('navMarket')}</p>
        <h1 className="font-display font-semibold text-3xl text-ink">{t('ordersTitle')}</h1>
        <p className="text-sm text-ink-2 mt-1">{t('ordersSubtitle')}</p>
      </header>

      {orders.length === 0 && (
        <div className="border border-dashed border-hairline p-12 text-center">
          <Package className="w-10 h-10 text-ink-3 mx-auto mb-3" />
          <p className="text-sm text-ink-2">{t('orderEmpty')}</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((o) => {
          const badge = statusBadge(o);
          const BadgeIcon = badge.icon;
          const cancellable = o.status !== 'CANCELLED' && o.escrowStatus === 'LOCKED_IN_ESCROW' && !isFarmer;

          return (
            <article key={o.id} className="bg-white border border-hairline" data-order-id={o.id}>
              {/* Head row */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-hairline">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink-2">{o.id}</span>
                  <span className={`inline-flex items-center gap-1.5 text-meta font-bold uppercase px-2 py-1 border rounded-sm ${badge.cls}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    {badge.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                    {escrowBadge(o)}
                  </span>
                  <span>{o.date}</span>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-4 space-y-2">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-ink font-medium">
                      {it.cropName} <span className="text-ink-3">× {it.quantityKg} kg</span>
                    </span>
                    <span className="tabular-nums text-ink-2">{fmt(it.unitPrice * it.quantityKg)}</span>
                  </div>
                ))}
              </div>

              {/* Footer: counterparty, total, actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-hairline bg-paper-2/50">
                <div className="text-xs text-ink-2 space-y-0.5">
                  <p>
                    {isFarmer ? t('orderBuyer') : t('orderFarmer')}:{' '}
                    <strong className="text-ink">{o.farmerName || o.buyerName}</strong>
                  </p>
                  {o.estimatedArrival && o.status !== 'CANCELLED' && (
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t('orderArrival')}: {o.estimatedArrival}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-meta uppercase text-ink-2">{t('orderTotal')}</p>
                    <p className="stat-display text-xl text-ink leading-none">{fmt(o.totalAmount)}</p>
                  </div>

                  {/* Buyer actions */}
                  {cancellable && confirmId !== o.id && (
                    <button
                      onClick={() => setConfirmId(o.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-harvest-600 border border-harvest-200 hover:bg-harvest-100 rounded-sm transition"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      {t('orderCancel')}
                    </button>
                  )}
                  {cancellable && confirmId === o.id && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { cancelOrder(o.id); setConfirmId(null); }}
                        className="px-3 py-2 text-[12px] font-bold uppercase bg-harvest-500 text-paper rounded-sm hover:bg-harvest-600 transition"
                      >
                        {t('orderCancelConfirm').split('?')[0]}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-2 text-[12px] font-bold uppercase text-ink-2 border border-hairline rounded-sm hover:bg-paper-2 transition"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* OTP release (buyer, delivered-ready escrow demo) */}
                  {!isFarmer && o.escrowStatus === 'LOCKED_IN_ESCROW' && o.status !== 'CANCELLED' && o.deliveryOtp && (
                    <button
                      onClick={() => releaseEscrow(o.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold uppercase tracking-wide bg-field-500 hover:bg-field-600 text-paper rounded-sm transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t('orderTrack')}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
