import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Share2 } from 'lucide-react';
import { Product } from '../../types';
import { formatKz, calculateCommission } from '../../lib/formatters';
import { useMarketplace } from '../../context/MarketplaceContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  showAffiliateCommission?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  showAffiliateCommission = false,
}) => {
  const { addToCart, currentUser, activeAffiliateRef } = useMarketplace();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const effectivePrice = product.promotional_price || product.price;
  const commissionAmount = calculateCommission(
    effectivePrice,
    product.affiliate_commission_percent
  );

  const isAffiliateMode = currentUser.role === 'affiliate' || showAffiliateCommission;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative"
    >
      {/* Product Image Slot (65% proportion) */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.images[0]}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ShoppingBag className="w-8 h-8 mb-1 text-slate-300" />
            <span className="text-xs">{product.title}</span>
          </div>
        )}

        {/* Promo discount tag if applicable */}
        {product.discount_percent && product.discount_percent > 0 && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            -{product.discount_percent}%
          </div>
        )}

        {/* Affiliate Commission Callout Tag (if affiliate) */}
        {isAffiliateMode && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            <span>+{formatKz(commissionAmount)}</span>
          </div>
        )}
      </div>

      {/* Product Info Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata: Category & Producer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-600">{product.category_name}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.producer_name.split(' ')[0]}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700 tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400">({product.review_count})</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-blue-900 tabular-nums">
              {formatKz(effectivePrice)}
            </span>
            {product.promotional_price && (
              <span className="text-xs text-slate-400 line-through tabular-nums -mt-0.5">
                {formatKz(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
            }`}
            title="Adicionar ao carrinho"
            aria-label="Adicionar ao carrinho"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
