import React from 'react';
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Smartphone,
  CreditCard,
  Banknote,
  Sparkles,
  Store,
  Share2,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface FooterProps {
  onNavigate: (view: string, data?: any) => void;
  onOpenWhatsAppSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenWhatsAppSupport,
}) => {
  const { resetToDefaults, settings } = useMarketplace();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs">
      {/* Top Banner inside Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-blue-950 tracking-tight">
                Angola<span className="text-blue-600">Market</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              A plataforma de comércio digital moderna para o mercado angolano. Ligamos produtores locais
              a clientes em Luanda e províncias, permitindo que milhares de jovens ganhem comissões como afiliados.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={onOpenWhatsAppSupport}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp de Suporte</span>
              </button>

              <PWAInstallButton />
            </div>
          </div>

          {/* Col 2: Para Clientes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Para Clientes
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <button
                  onClick={() => onNavigate('produtos')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('conta')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Rastrear Encomenda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('conta')}
                  className="hover:text-blue-600 transition-colors"
                >
                  A Minha Conta
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('produtos', { filter: 'promo' })}
                  className="hover:text-blue-600 transition-colors"
                >
                  Produtos em Promoção
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Para Produtores & Afiliados */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Monetização
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <button
                  onClick={() => onNavigate('afiliado')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3 text-blue-600" />
                  <span>Painel do Afiliado</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('produtor')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Store className="w-3 h-3 text-blue-600" />
                  <span>Painel do Produtor</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Acesso Administrativo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Métodos de Pagamento em Angola */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Pagamentos Aceites
            </h4>
            <div className="space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Multicaixa Express</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                <span>PayPay África</span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Transferência Bancária (IBAN)</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Pagamento na Entrega</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            <span>Zonas atendidas em Luanda:</span>{' '}
            <strong className="text-slate-600">
              Talatona · Kilamba · Viana · Cacuaco · Camama · Benfica · Maianga · Mutamba · Sequele
            </strong>{' '}
            e envios para Benguela, Huambo, Lubango e Cabinda.
          </div>

          <button
            onClick={() => {
              if (confirm('Tem a certeza de que deseja repor os dados de teste da demonstração?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors shrink-0"
            title="Repor dados de demonstração da plataforma"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repor Dados de Demonstração</span>
          </button>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>
            © 2026 AngolaMarket. Todos os direitos reservados. República de Angola.
          </span>
          <span className="text-slate-500">
            Ambiente Demonstrativo Funcional com Arquitetura Supabase & RLS
          </span>
        </div>
      </div>
    </footer>
  );
};
