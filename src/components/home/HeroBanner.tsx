import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Percent, Smartphone } from 'lucide-react';

interface HeroBannerProps {
  onExplore: () => void;
  onBeAffiliate: () => void;
  onBeProducer: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplore,
  onBeAffiliate,
  onBeProducer,
}) => {
  return (
    <div className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Brand Headline */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed subtle kicker with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide">
              <span>MERCADO NACIONAL DE ANGOLA</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">LUANDA & PROVÍNCIAS</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">PAGAMENTOS MULTICAIXA & PAYPAY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight leading-[1.15] text-balance">
              O Marketplace Moderno onde Angola Compra, Vende e Lucra.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Descubra os melhores eletrónicos, moda e cosméticos de produtores verificados em Luanda.
              Ganhe até 15% de comissão divulgando produtos como afiliado oficial.
            </p>

            {/* CTAs Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBeAffiliate}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors"
              >
                Ganhe como Afiliado
              </button>

              <button
                onClick={onBeProducer}
                className="px-5 py-3.5 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Vender como Produtor
              </button>
            </div>

            {/* Quantitative Trust Strip (Claim-to-Proof Adjacency) */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-900 tabular-nums">24h — 48h</p>
                <p className="text-xs text-slate-500 mt-0.5">Entregas em Luanda</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-900 tabular-nums">100%</p>
                <p className="text-xs text-slate-500 mt-0.5">Pagamento Seguro</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-900 tabular-nums">Até 15%</p>
                <p className="text-xs text-slate-500 mt-0.5">Comissão por Venda</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Campaign Media */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100 group">
              <img
                src="/src/assets/images/hero_angola_marketplace_1793008579600.jpg"
                alt="AngolaMarket — Produtos em destaque de tecnologia e moda em Angola"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Clean bottom scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    Destaques da Semana
                  </p>
                  <p className="text-base font-bold text-white mt-0.5">
                    Gadgets, Alta Costura & Perfumaria Exclusiva
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Propositions Strip */}
        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Entregas Rápidas</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Talatona, Kilamba, Viana, Cacuaco e províncias.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Multicaixa & PayPay</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Pague facilmente por referência ou na entrega.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Rede de Afiliados</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Gere links, divulgue no WhatsApp e receba comissões.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Produtores Locais</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Garantia e suporte direto com vendedores verificados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
