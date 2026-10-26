import React, { useState } from 'react';
import {
  Package,
  User as UserIcon,
  MapPin,
  Heart,
  Star,
  Clock,
  ShieldCheck,
  ChevronRight,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatKz, formatDateTime, getOrderStatusLabel } from '../../lib/formatters';
import { Order } from '../../types';

interface ClientAccountViewProps {
  onViewOrderTracking: (order: Order) => void;
  onOpenWhatsApp: (order: Order) => void;
}

export const ClientAccountView: React.FC<ClientAccountViewProps> = ({
  onViewOrderTracking,
  onOpenWhatsApp,
}) => {
  const { currentUser, orders } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Orders placed by current client or mock orders
  const myOrders = orders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Client Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                Cliente AngolaMarket
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.email} · {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            As Minhas Encomendas ({myOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'addresses' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Endereços Guardados
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'profile' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Dados Pessoais
          </button>
        </div>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Histórico de Encomendas & Rastreio
            </h2>
          </div>

          {myOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Package className="w-8 h-8 mx-auto text-slate-300" />
              <p>Ainda não realizou qualquer encomenda na AngolaMarket.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const status = getOrderStatusLabel(order.order_status);
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-blue-900">{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        Efetuada em {formatDateTime(order.created_at)} · {order.items.length} artigo(s)
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-xs text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          Entrega em: {order.neighborhood}, {order.municipality} ({order.province})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 shrink-0">
                      <span className="text-base font-extrabold text-blue-900 tabular-nums">
                        {formatKz(order.total)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewOrderTracking(order)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rastrear Pedido</span>
                        </button>

                        <button
                          onClick={() => onOpenWhatsApp(order)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors"
                          title="Falar sobre este pedido no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 max-w-xl">
          <h2 className="text-base font-bold text-slate-900">Endereço Principal de Entrega</h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <p className="font-bold text-slate-900">Residência / Trabalho</p>
            <p className="text-slate-600">Cidade Financeira, Edifício Bengo, 4B</p>
            <p className="text-slate-600">Talatona, Luanda, Angola</p>
            <p className="text-[11px] text-slate-400 pt-1">
              Ponto de referência: Próximo ao Hotel Palmeiras
            </p>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 max-w-xl text-xs">
          <h2 className="text-base font-bold text-slate-900">Dados da Conta</h2>
          <div className="space-y-3">
            <div>
              <span className="text-slate-500 font-semibold block">Nome Completo</span>
              <p className="text-slate-900 font-bold mt-0.5">{currentUser.name}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Correio Eletrónico</span>
              <p className="text-slate-900 font-bold mt-0.5">{currentUser.email}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Contacto Telefónico</span>
              <p className="text-slate-900 font-bold mt-0.5">{currentUser.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
