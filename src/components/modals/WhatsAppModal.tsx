import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Product, Order } from '../../types';
import { formatKz } from '../../lib/formatters';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  order?: Order | null;
  target?: 'support' | 'producer' | 'order';
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  product,
  order,
  target = 'support',
}) => {
  const { settings } = useMarketplace();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Determine phone number & message
  let recipientPhone = settings.whatsapp_support_number;
  let recipientLabel = 'Suporte Oficial AngolaMarket';
  let message = `Olá! Gostaria de mais informações sobre os serviços da AngolaMarket.`;

  if (target === 'producer' && product) {
    recipientPhone = product.producer_whatsapp || product.producer_phone;
    recipientLabel = product.producer_name;
    message = `Olá ${product.producer_name}! Estou interessado no produto "${product.title}" (${formatKz(
      product.promotional_price || product.price
    )}) na AngolaMarket. O artigo encontra-se disponível para entrega imediata?`;
  } else if (target === 'order' && order) {
    recipientPhone = settings.whatsapp_support_number;
    recipientLabel = 'Apoio ao Pedido AngolaMarket';
    message = `Olá! Gostaria de acompanhar o meu pedido *${order.id}* no valor de ${formatKz(
      order.total
    )} com entrega para ${order.neighborhood}, ${order.municipality}. Obrigado!`;
  }

  // Format clean international WhatsApp link
  const cleanNumber = recipientPhone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conversar no WhatsApp</h3>
              <p className="text-[11px] text-slate-500">{recipientLabel}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prepared Message Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Mensagem Pré-formatada
          </label>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
            {message}
          </div>
          <p className="text-[11px] text-slate-400">
            Destinatário: <strong className="text-slate-700">{recipientPhone}</strong>
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir no WhatsApp</span>
          </a>

          <button
            onClick={handleCopyMessage}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Mensagem copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar Texto da Mensagem</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
