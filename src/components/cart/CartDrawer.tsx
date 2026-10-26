import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatKz } from '../../lib/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
  } = useMarketplace();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const discountAmount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                O Seu Carrinho ({cartCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">O seu carrinho está vazio</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Explore o nosso catálogo com milhares de produtos selecionados em Angola.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Continuar a Comprar
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const effectivePrice = item.product.promotional_price || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-18 h-18 object-cover rounded-xl bg-white border border-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.product.producer_name.split(' ')[0]}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-blue-900 tabular-nums">
                          {formatKz(effectivePrice)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 text-slate-500 hover:text-slate-800"
                            aria-label="Diminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                            aria-label="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                      title="Remover produto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white space-y-4 shrink-0">
              {/* Coupon Form */}
              <div>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Código de cupom (ex: BEMVINDO10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-600 uppercase focus:outline-hidden focus:border-blue-600"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="font-semibold text-emerald-800">
                      Cupom <strong>{appliedCoupon.code}</strong> ativo (-{formatKz(discountAmount)})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-rose-600 font-bold"
                    >
                      Remover
                    </button>
                  </div>
                )}

                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {formatKz(cartSubtotal)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Desconto</span>
                    <span className="tabular-nums">-{formatKz(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Entrega</span>
                  <span className="text-slate-400">Calculada no checkout</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Previsto</span>
                  <span className="text-lg font-extrabold text-blue-900 tabular-nums">
                    {formatKz(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
