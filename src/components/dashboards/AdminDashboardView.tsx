import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Settings,
  ShieldCheck,
  Percent,
  Plus,
  Edit,
  Tag,
  Check,
  X,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatKz, formatDateTime, getOrderStatusLabel } from '../../lib/formatters';
import { OrderStatus, DeliveryZone, WithdrawalStatus } from '../../types';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    products,
    orders,
    categories,
    deliveryZones,
    withdrawals,
    settings,
    updateOrderStatus,
    updateProduct,
    updateDeliveryZone,
    addDeliveryZone,
    updateWithdrawalStatus,
    updateSettings,
    updateCategory,
    addCategory,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'withdrawals' | 'delivery' | 'settings'
  >('overview');

  // Delivery zone editing state
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [zonePriceInput, setZonePriceInput] = useState<number>(2500);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneMunicipality, setNewZoneMunicipality] = useState('Luanda');
  const [newZoneProvince, setNewZoneProvince] = useState('Luanda');
  const [newZonePrice, setNewZonePrice] = useState<number>(3000);

  // Settings state
  const [platformFee, setPlatformFee] = useState<number>(settings.platform_fee_percent);
  const [defaultAffiliateComm, setDefaultAffiliateComm] = useState<number>(settings.default_affiliate_commission);
  const [withdrawalFee, setWithdrawalFee] = useState<number>(settings.withdrawal_fee_percent);
  const [minWithdrawal, setMinWithdrawal] = useState<number>(settings.min_withdrawal_amount);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Metrics calculation
  const totalUsers = users.length;
  const clientsCount = users.filter((u) => u.role === 'client').length;
  const affiliatesCount = users.filter((u) => u.role === 'affiliate').length;
  const producersCount = users.filter((u) => u.role === 'producer').length;

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const platformRevenue = Math.round((totalGMV * settings.platform_fee_percent) / 100);
  const totalCommissions = orders.reduce((sum, o) => sum + (o.affiliate_commission_total || 0), 0);

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const pendingOrders = orders.filter((o) => o.order_status !== 'delivered' && o.order_status !== 'cancelled');
  const pendingProducts = products.filter((p) => p.status === 'pending_approval');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      platform_fee_percent: Number(platformFee),
      default_affiliate_commission: Number(defaultAffiliateComm),
      withdrawal_fee_percent: Number(withdrawalFee),
      min_withdrawal_amount: Number(minWithdrawal),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSaveZonePrice = (zoneId: string) => {
    updateDeliveryZone(zoneId, { price: Number(zonePriceInput) });
    setEditingZoneId(null);
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    addDeliveryZone({
      province: newZoneProvince,
      municipality: newZoneMunicipality,
      zone_name: newZoneName,
      price: Number(newZonePrice),
      estimated_days_min: 1,
      estimated_days_max: 3,
    });
    setShowAddZoneModal(false);
    setNewZoneName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Painel de Administração Geral
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300">Controlo Total da Plataforma</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AngolaMarket Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Gestão operacional de encomendas, comissões de afiliados, aprovação de produtos,
            taxa da plataforma ({settings.platform_fee_percent}%) e tabela dinâmica de entregas em Angola.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Pedidos ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'withdrawals' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Levantamentos ({pendingWithdrawals.length})
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'delivery' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Zonas de Entrega
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-xl transition-colors ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Taxas & Regras
          </button>
        </div>
      </div>

      {/* TAB 1: VISÃO GERAL */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Main KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Volume Total (GMV)</span>
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {formatKz(totalGMV)}
              </p>
              <p className="text-[11px] text-slate-400">{orders.length} pedidos no total</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">
                Receita da Plataforma ({settings.platform_fee_percent}%)
              </span>
              <p className="text-2xl font-extrabold text-blue-900 tabular-nums">
                {formatKz(platformRevenue)}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">Margem líquida da AngolaMarket</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Comissões de Afiliados</span>
              <p className="text-2xl font-extrabold text-amber-600 tabular-nums">
                {formatKz(totalCommissions)}
              </p>
              <p className="text-[11px] text-slate-400">Distribuídas pela rede</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Utilizadores Registados</span>
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalUsers}</p>
              <p className="text-[11px] text-slate-400">
                {clientsCount} clientes · {affiliatesCount} afiliados · {producersCount} produtores
              </p>
            </div>
          </div>

          {/* Pending Action Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Levantamentos Pendentes</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  {pendingWithdrawals.length} solicitações aguardam processamento manual
                </p>
              </div>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
              >
                Ver
              </button>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-900">Pedidos em Rota / Preparação</p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  {pendingOrders.length} encomendas em processamento logístico
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
              >
                Gerir
              </button>
            </div>

            <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-900">Preços de Entrega</p>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  {deliveryZones.length} zonas configuradas para Luanda e Províncias
                </p>
              </div>
              <button
                onClick={() => setActiveTab('delivery')}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700"
              >
                Ajustar
              </button>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Últimas Encomendas Registadas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Nº Pedido</th>
                    <th className="py-2.5 px-3 font-semibold">Cliente</th>
                    <th className="py-2.5 px-3 font-semibold">Localidade</th>
                    <th className="py-2.5 px-3 font-semibold">Total</th>
                    <th className="py-2.5 px-3 font-semibold">Comissão Afiliado</th>
                    <th className="py-2.5 px-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((o) => {
                    const status = getOrderStatusLabel(o.order_status);
                    return (
                      <tr key={o.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{o.id}</td>
                        <td className="py-2.5 px-3 text-slate-800">{o.customer_name}</td>
                        <td className="py-2.5 px-3 text-slate-500">{o.municipality}, {o.province}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 tabular-nums">
                          {formatKz(o.total)}
                        </td>
                        <td className="py-2.5 px-3 text-amber-600 font-medium tabular-nums">
                          {o.affiliate_commission_total ? formatKz(o.affiliate_commission_total) : '—'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PEDIDOS & ATUALIZADOR DE ESTADOS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Gestão Operacional de Pedidos ({orders.length})
              </h2>
              <p className="text-xs text-slate-500">
                Altere o estado dos pedidos para avançar o rastreio do cliente e liberar as comissões.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3 font-semibold">ID / Data</th>
                  <th className="py-3 px-3 font-semibold">Cliente & Contacto</th>
                  <th className="py-3 px-3 font-semibold">Artigos</th>
                  <th className="py-3 px-3 font-semibold">Total</th>
                  <th className="py-3 px-3 font-semibold">Método</th>
                  <th className="py-3 px-3 font-semibold">Estado Atual</th>
                  <th className="py-3 px-3 font-semibold">Atualizar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <p className="font-mono font-bold text-blue-900">{o.id}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(o.created_at).toLocaleDateString('pt-AO')}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{o.customer_name}</p>
                      <p className="text-[11px] text-slate-500">{o.customer_phone}</p>
                      <p className="text-[10px] text-slate-400">{o.neighborhood}, {o.municipality}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-slate-700 font-medium">{o.items.length} item(s)</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {o.items.map((i) => i.title).join(', ')}
                      </p>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                      {formatKz(o.total)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 capitalize">
                      {o.payment_method.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getOrderStatusLabel(o.order_status).color}`}>
                        {getOrderStatusLabel(o.order_status).label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={o.order_status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-600"
                      >
                        <option value="received">Pedido Recebido</option>
                        <option value="payment_confirmed">Pagamento Confirmado</option>
                        <option value="in_preparation">Em Preparação</option>
                        <option value="awaiting_pickup">Aguardando Recolha</option>
                        <option value="in_delivery">Em Entrega</option>
                        <option value="delivered">Entregue (Libera Comissão)</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LEVANTAMENTOS & COMISSÕES */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Processamento Manual de Levantamentos
            </h2>
            <p className="text-xs text-slate-500">
              Valide as solicitações de levantamento enviadas por afiliados e produtores via Multicaixa Express, PayPay ou IBAN.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3 font-semibold">Data / ID</th>
                  <th className="py-3 px-3 font-semibold">Beneficiário</th>
                  <th className="py-3 px-3 font-semibold">Método & Conta</th>
                  <th className="py-3 px-3 font-semibold">Valor Bruto</th>
                  <th className="py-3 px-3 font-semibold">Taxa Admin ({settings.withdrawal_fee_percent}%)</th>
                  <th className="py-3 px-3 font-semibold">Líquido a Pagar</th>
                  <th className="py-3 px-3 font-semibold">Estado</th>
                  <th className="py-3 px-3 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <p className="font-mono text-slate-700">{w.id}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(w.requested_at).toLocaleDateString('pt-AO')}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{w.user_name}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{w.user_role}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-700 capitalize">{w.method.replace('_', ' ')}</p>
                      <p className="font-mono text-[11px] text-slate-500">{w.account_number}</p>
                      <p className="text-[10px] text-slate-400">{w.account_holder}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 tabular-nums">
                      {formatKz(w.amount)}
                    </td>
                    <td className="py-3 px-3 text-slate-400 tabular-nums">
                      {formatKz(w.fee)}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700 tabular-nums">
                      {formatKz(w.net_amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'approved' || w.status === 'processed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : w.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {w.status === 'approved' || w.status === 'processed'
                          ? 'Aprovado'
                          : w.status === 'pending'
                          ? 'Pendente'
                          : 'Rejeitado'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateWithdrawalStatus(w.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => updateWithdrawalStatus(w.id, 'rejected')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            Rejeitar
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Processado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ZONAS & PREÇOS DE ENTREGA (NÃO DEIXAR VALORES FIXOS NO CÓDIGO) */}
      {activeTab === 'delivery' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Tabela Dinâmica de Zonas & Preços de Entrega
              </h2>
              <p className="text-xs text-slate-500">
                Altere os valores de entrega para Talatona, Kilamba, Viana, Cacuaco, etc. Os valores atualizam imediatamente no carrinho e checkout.
              </p>
            </div>

            <button
              onClick={() => setShowAddZoneModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Zona de Entrega</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3 font-semibold">Província</th>
                  <th className="py-3 px-3 font-semibold">Município</th>
                  <th className="py-3 px-3 font-semibold">Designação da Zona</th>
                  <th className="py-3 px-3 font-semibold">Prazo Estimado</th>
                  <th className="py-3 px-3 font-semibold">Preço de Entrega (Kz)</th>
                  <th className="py-3 px-3 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveryZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-medium text-slate-800">{zone.province}</td>
                    <td className="py-3 px-3 text-slate-600">{zone.municipality}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{zone.zone_name}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {zone.estimated_days_min} a {zone.estimated_days_max} dias úteis
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-900 tabular-nums">
                      {editingZoneId === zone.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="250"
                            min="0"
                            value={zonePriceInput}
                            onChange={(e) => setZonePriceInput(Number(e.target.value))}
                            className="w-24 bg-white border border-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold"
                          />
                          <button
                            onClick={() => handleSaveZonePrice(zone.id)}
                            className="p-1 bg-emerald-600 text-white rounded"
                            title="Guardar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingZoneId(null)}
                            className="p-1 bg-slate-200 text-slate-600 rounded"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span>{formatKz(zone.price)}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {editingZoneId !== zone.id && (
                        <button
                          onClick={() => {
                            setEditingZoneId(zone.id);
                            setZonePriceInput(zone.price);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Alterar Preço
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal to add new zone */}
          {showAddZoneModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Nova Zona de Entrega</h3>
                  <button onClick={() => setShowAddZoneModal(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleAddZone} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Província</label>
                    <input
                      type="text"
                      required
                      value={newZoneProvince}
                      onChange={(e) => setNewZoneProvince(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Município</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Talatona, Viana, Cazenga"
                      value={newZoneMunicipality}
                      onChange={(e) => setNewZoneMunicipality(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome da Zona</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Benfica (Zona A)"
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preço de Entrega (Kz)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="250"
                      value={newZonePrice}
                      onChange={(e) => setNewZonePrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold tabular-nums"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
                  >
                    Guardar Zona
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: TAXAS & CONFIGURAÇÕES DA PLATAFORMA */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Configurações & Taxas Administrativas
            </h2>
            <p className="text-xs text-slate-500">
              Ajuste as percentagens de remuneração da plataforma, comissões padrão e parâmetros de levantamento.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configurações atualizadas com sucesso em toda a plataforma!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Taxa da Plataforma AngolaMarket (% sobre a venda do produtor)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="40"
                    step="0.5"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="w-32 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 tabular-nums focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="text-sm font-bold text-slate-500">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Exemplo: Numa venda de 10.000 Kz, a taxa de {platformFee}% retém {formatKz((10000 * platformFee) / 100)} para a plataforma e {formatKz(10000 - (10000 * platformFee) / 100)} para o produtor.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Comissão Padrão do Afiliado (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={defaultAffiliateComm}
                    onChange={(e) => setDefaultAffiliateComm(Number(e.target.value))}
                    className="w-32 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 tabular-nums focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="text-sm font-bold text-slate-500">%</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Taxa de Processamento de Levantamento (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={withdrawalFee}
                    onChange={(e) => setWithdrawalFee(Number(e.target.value))}
                    className="w-32 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 tabular-nums focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="text-sm font-bold text-slate-500">%</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Valor Mínimo para Levantamento (Kz)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={minWithdrawal}
                  onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                  className="w-48 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 tabular-nums focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Guardar Configurações
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
