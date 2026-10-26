import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatKz } from '../../lib/formatters';
import { PaymentMethod, Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const {
    cart,
    cartSubtotal,
    deliveryZones,
    appliedCoupon,
    createOrder,
    currentUser,
    settings,
  } = useMarketplace();

  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+244 9');
  const [customerWhatsapp, setCustomerWhatsapp] = useState(currentUser.whatsapp || '+244 9');
  const [province, setProvince] = useState('Luanda');
  const [selectedZoneId, setSelectedZoneId] = useState(deliveryZones[0]?.id || '');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('multicaixa_express');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Selected delivery zone object
  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const deliveryFee = selectedZone ? selectedZone.price : 2500;

  const discountAmount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const total = Math.max(0, cartSubtotal - discountAmount) + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !neighborhood.trim()) {
      setErrorMsg('Por favor preencha todos os campos obrigatórios marcados com (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customerName,
        customerPhone,
        customerWhatsapp: customerWhatsapp || customerPhone,
        province,
        municipality: selectedZone.municipality,
        neighborhood,
        address,
        referencePoint,
        notes,
        deliveryFee,
        paymentMethod,
      });

      setIsSubmitting(false);
      onOrderCreated(order);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Erro ao gerar o pedido. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">
              Checkout Seguro · AngolaMarket
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Fechar checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Customer Contacts */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              1. Dados do Destinatário
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maria António Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+244 923 000 000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  WhatsApp (Para Notificações)
                </label>
                <input
                  type="tel"
                  placeholder="+244 923 000 000"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Delivery Location & Dynamic Zone */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              2. Endereço e Zona de Entrega em Angola
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Província *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                >
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huambo">Huambo</option>
                  <option value="Huíla">Huíla (Lubango)</option>
                  <option value="Cabinda">Cabinda</option>
                  <option value="Cuanza Sul">Cuanza Sul</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Município & Zona de Entrega *
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white font-medium"
                >
                  {deliveryZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.zone_name} — {formatKz(zone.price)} ({zone.estimated_days_min}-{zone.estimated_days_max} dias)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Bairro / Condomínio / Centralidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Talatona / Condomínio Austin"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Rua, Edifício ou Número de Casa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua 12, Bloco 4, Apartamento 2B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ponto de Referência
                </label>
                <input
                  type="text"
                  placeholder="Ex: Próximo à bomba da Sonangol ou Restaurante Veneza"
                  value={referencePoint}
                  onChange={(e) => setReferencePoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Instruções Adicionais / Observações
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tocar a campainha 2B ou ligar ao chegar"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              3. Forma de Pagamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {settings.enabled_payments.multicaixa_express && (
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'multicaixa_express'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="multicaixa_express"
                    checked={paymentMethod === 'multicaixa_express'}
                    onChange={() => setPaymentMethod('multicaixa_express')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      Multicaixa Express
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pague no telemóvel por referência bancária ou notificação direta.
                    </p>
                  </div>
                </label>
              )}

              {settings.enabled_payments.paypay && (
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'paypay'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paypay"
                    checked={paymentMethod === 'paypay'}
                    onChange={() => setPaymentMethod('paypay')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      PayPay África
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pagamento rápido via carteira digital PayPay.
                    </p>
                  </div>
                </label>
              )}

              {settings.enabled_payments.bank_transfer && (
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Banknote className="w-4 h-4 text-blue-600" />
                      Transferência Bancária (IBAN)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Envio de comprovativo para validação rápida pela equipa.
                    </p>
                  </div>
                </label>
              )}

              {settings.enabled_payments.cash_on_delivery && (
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Truck className="w-4 h-4 text-blue-600" />
                      Pagamento na Entrega
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pague em dinheiro ou TPA ao estafeta no momento da receção.
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal dos Produtos ({cart.length} itens)</span>
              <span className="font-semibold text-slate-800 tabular-nums">{formatKz(cartSubtotal)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                <span>Desconto Cupom ({appliedCoupon.code})</span>
                <span className="tabular-nums">-{formatKz(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-slate-600">
              <span>Taxa de Entrega ({selectedZone.zone_name})</span>
              <span className="font-semibold text-slate-800 tabular-nums">{formatKz(deliveryFee)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total a Pagar</span>
              <span className="text-xl font-extrabold text-blue-900 tabular-nums">
                {formatKz(total)}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isSubmitting ? (
              <span>A Registar Pedido...</span>
            ) : (
              <>
                <span>Confirmar e Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
