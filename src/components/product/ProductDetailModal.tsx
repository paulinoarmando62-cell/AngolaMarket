import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  MessageCircle,
  MapPin,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';
import { Product } from '../../types';
import { formatKz, calculateCommission } from '../../lib/formatters';
import { useMarketplace } from '../../context/MarketplaceContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onOpenWhatsApp: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
  onOpenWhatsApp,
}) => {
  const { addToCart, deliveryZones, currentUser, affiliateProfile } = useMarketplace();

  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedZoneId, setSelectedZoneId] = useState(deliveryZones[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);

  const effectivePrice = product.promotional_price || product.price;
  const commissionAmount = calculateCommission(
    effectivePrice,
    product.affiliate_commission_percent
  );

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];

  const affiliateRefCode = affiliateProfile.affiliate_code || 'AF-7821';
  const affiliateShareUrl = `${window.location.origin}/produto/${product.slug}?ref=${affiliateRefCode}`;

  const handleCopyAffiliateLink = () => {
    navigator.clipboard.writeText(affiliateShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Close Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-blue-700">{product.category_name}</span>
            <span aria-hidden="true">·</span>
            <span>{product.subcategory || 'Geral'}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Gallery Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-blue-600' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Producer Badge & Verified Origin */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {product.producer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{product.producer_name}</p>
                    <p className="text-[11px] text-slate-500">Produtor Verificado AngolaMarket</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenWhatsApp(product)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1 border-t border-slate-200/60">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Ponto de Recolha: {product.pickup_address}</span>
              </div>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {product.title}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-xs font-bold text-slate-800 tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">{product.review_count} avaliações</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-emerald-600 font-medium">
                  {product.stock > 0 ? `${product.stock} unidades em stock` : 'Esgotado'}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Preço Total</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 tabular-nums">
                    {formatKz(effectivePrice)}
                  </span>
                  {product.promotional_price && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      {formatKz(product.price)}
                    </span>
                  )}
                </div>
              </div>

              {product.discount_percent && product.discount_percent > 0 && (
                <div className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                  Economize {product.discount_percent}%
                </div>
              )}
            </div>

            {/* Affiliate Highlight Block */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-900">
                    Ganhe {formatKz(commissionAmount)} de comissão neste produto
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-700">
                  {product.affiliate_commission_percent}%
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Divulgue o seu link exclusivo nas suas redes ou grupos de WhatsApp. Quando comprarem,
                a comissão fica registada imediatamente no seu painel.
              </p>
              <button
                onClick={handleCopyAffiliateLink}
                className="w-full mt-1 py-2 px-3 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Link copiado para a área de transferência!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-700" />
                    <span>Gerar e Copiar Meu Link de Afiliado</span>
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Descrição do Produto
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Delivery Estimator Selector */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Calcular Entrega
                </span>
                <span className="text-xs font-extrabold text-blue-900 tabular-nums">
                  {formatKz(selectedZone?.price || 2500)}
                </span>
              </div>

              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
              >
                {deliveryZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.province} — {zone.zone_name} ({formatKz(zone.price)})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Prazo estimado: {selectedZone?.estimated_days_min} a {selectedZone?.estimated_days_max} dias úteis
                </span>
              </div>
            </div>

            {/* Quantity Stepper & Buy Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700">Quantidade:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                    aria-label="Diminuir"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                    aria-label="Aumentar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 rounded-xl text-xs font-bold border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedNotice ? 'Adicionado!' : 'Adicionar ao Carrinho'}</span>
                </button>

                <button
                  onClick={() => onBuyNow(product, quantity)}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Comprar Agora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
