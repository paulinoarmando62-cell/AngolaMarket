import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  MessageCircle,
  Copy,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatKz, formatDateTime, getPaymentMethodLabel, getOrderStatusLabel } from '../../lib/formatters';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenWhatsApp: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onOpenWhatsApp,
}) => {
  if (!order) return null;

  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'received', label: 'Pedido Recebido', desc: 'Registo e verificação dos itens' },
    { key: 'payment_confirmed', label: 'Pagamento Confirmado', desc: 'Validação pelo sistema ou comprovativo' },
    { key: 'in_preparation', label: 'Em Preparação', desc: 'Produtor está a separar e embalar' },
    { key: 'in_delivery', label: 'Em Rota de Entrega', desc: 'Estafeta AngolaMarket a caminho' },
    { key: 'delivered', label: 'Entregue com Sucesso', desc: 'Mercadoria entregue no destino' },
  ];

  // Helper to determine step index
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
      case 'payment_pending':
        return 0;
      case 'payment_confirmed':
        return 1;
      case 'in_preparation':
      case 'awaiting_pickup':
        return 2;
      case 'in_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.order_status);
  const statusInfo = getOrderStatusLabel(order.order_status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Acompanhamento de Encomenda
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Order Header Box */}
          <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 font-medium">Número do Pedido</p>
              <h2 className="text-lg font-black text-blue-950 font-mono tracking-tight">
                {order.id}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Registado em: {formatDateTime(order.created_at)}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="text-sm font-extrabold text-blue-900 mt-1 tabular-nums">
                {formatKz(order.total)}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Estado da Encomenda
            </h3>
            <div className="space-y-4">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isPassed
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-7 mt-1 ${
                            idx < currentStepIdx ? 'bg-blue-600' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>

                    <div className="pt-0.5">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-blue-900' : isPassed ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destination & Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Endereço de Entrega
              </p>
              <p className="text-slate-600 font-medium">{order.customer_name}</p>
              <p className="text-slate-500">
                {order.address}, {order.neighborhood}
              </p>
              <p className="text-slate-500">
                {order.municipality}, {order.province}
              </p>
              {order.reference_point && (
                <p className="text-[11px] text-slate-400 pt-1">
                  Ponto de ref: {order.reference_point}
                </p>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-blue-600" />
                Detalhes de Pagamento
              </p>
              <p className="text-slate-600">
                Método: <strong>{getPaymentMethodLabel(order.payment_method)}</strong>
              </p>
              <p className="text-slate-600">
                Estado: <span className="capitalize">{order.payment_status}</span>
              </p>
              <p className="text-slate-600">
                Subtotal: {formatKz(order.subtotal)}
              </p>
              <p className="text-slate-600">
                Entrega: {formatKz(order.delivery_fee)}
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Artigos da Encomenda
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.quantity}x a {formatKz(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatKz(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action: Enviar pelo WhatsApp */}
          <div className="pt-2">
            <button
              onClick={() => onOpenWhatsApp(order)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Pedido pelo WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
