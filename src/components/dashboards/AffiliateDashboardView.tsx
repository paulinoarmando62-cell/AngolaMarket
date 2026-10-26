import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  Percent,
  Copy,
  Check,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Wallet,
  X,
  CreditCard,
  Share2,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatKz, calculateCommission } from '../../lib/formatters';
import { WithdrawalMethod, Product } from '../../types';

export const AffiliateDashboardView: React.FC = () => {
  const {
    affiliateProfile,
    products,
    withdrawals,
    requestWithdrawal,
    settings,
  } = useMarketplace();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState(
    Math.min(affiliateProfile.commission_available, 20000) || 5000
  );
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawalMethod>('multicaixa_express');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(affiliateProfile.user_name || '');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [withdrawFeedback, setWithdrawFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  const conversionRate =
    affiliateProfile.total_clicks > 0
      ? ((affiliateProfile.total_orders / affiliateProfile.total_clicks) * 100).toFixed(1)
      : '0.0';

  const handleCopyProductLink = (prod: Product) => {
    const url = `${window.location.origin}/produto/${prod.slug}?ref=${affiliateProfile.affiliate_code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(prod.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawFeedback(null);

    if (!accountNumber.trim() || !accountHolder.trim()) {
      setWithdrawFeedback({ msg: 'Por favor preencha os dados da conta.', isError: true });
      return;
    }

    const res = requestWithdrawal({
      amount: Number(withdrawAmount),
      method: withdrawMethod,
      accountNumber,
      accountHolder,
      notes: withdrawNotes,
    });

    if (res.success) {
      setWithdrawFeedback({ msg: res.message, isError: false });
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawFeedback(null);
      }, 2000);
    } else {
      setWithdrawFeedback({ msg: res.message, isError: true });
    }
  };

  const myWithdrawals = withdrawals.filter((w) => w.user_role === 'affiliate');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner: Affiliate Identifier */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-800 text-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Painel do Afiliado Oficial
            </span>
            <span className="text-xs text-blue-300">·</span>
            <span className="text-xs text-blue-200">ID: {affiliateProfile.affiliate_code}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {affiliateProfile.user_name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Divulgue os produtos do catálogo com o seu código de referência. As comissões são
            calculadas automaticamente a cada compra confirmada.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-start gap-2 shrink-0">
          <p className="text-xs text-blue-200">Seu Código Exclusivo</p>
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono font-black tracking-wider text-amber-400">
              {affiliateProfile.affiliate_code}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(affiliateProfile.affiliate_code);
                setCopiedId('code');
                setTimeout(() => setCopiedId(null), 2000);
              }}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs transition-colors"
              title="Copiar código"
            >
              {copiedId === 'code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Tabular Figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saldo Disponível</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatKz(affiliateProfile.commission_available)}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Pronto para levantamento
            </p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={affiliateProfile.commission_available < settings.min_withdrawal_amount}
            className="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Solicitar Levantamento</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pending Commissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Comissões Pendentes</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatKz(affiliateProfile.commission_pending)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Liberadas após entrega da encomenda
            </p>
          </div>
        </div>

        {/* Total Earned / Sales Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Volume de Vendas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatKz(affiliateProfile.total_sales_volume)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {affiliateProfile.total_orders} pedidos gerados
            </p>
          </div>
        </div>

        {/* Clicks & Conversion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cliques & Conversão</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {affiliateProfile.total_clicks} <span className="text-xs font-normal text-slate-400">cliques</span>
            </p>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
              {conversionRate}% taxa de conversão
            </p>
          </div>
        </div>
      </div>

      {/* Section: Produtos para Divulgar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Produtos para Divulgar & Ganhar Comissão
            </h2>
            <p className="text-xs text-slate-500">
              Clique em &quot;Gerar Link&quot; para copiar o link personalizado com o seu código de referência.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((prod) => {
            const effectivePrice = prod.promotional_price || prod.price;
            const commKz = calculateCommission(effectivePrice, prod.affiliate_commission_percent);
            const isCopied = copiedId === prod.id;

            return (
              <div
                key={prod.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 items-center justify-between"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                    Preço: {formatKz(effectivePrice)}
                  </p>
                  <p className="text-xs font-extrabold text-amber-600 mt-0.5 tabular-nums">
                    Sua Comissão: {formatKz(commKz)} ({prod.affiliate_commission_percent}%)
                  </p>
                </div>

                <button
                  onClick={() => handleCopyProductLink(prod)}
                  className={`p-2.5 rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1 ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                  }`}
                  title="Gerar e copiar link de afiliado"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: Histórico de Levantamentos */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4 p-5">
        <h3 className="text-sm font-bold text-slate-900">
          Histórico de Solicitações de Levantamento
        </h3>

        {myWithdrawals.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Nenhuma solicitação de levantamento efetuada até ao momento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Data</th>
                  <th className="py-2.5 px-3 font-semibold">Método</th>
                  <th className="py-2.5 px-3 font-semibold">Conta / IBAN</th>
                  <th className="py-2.5 px-3 font-semibold">Valor Bruto</th>
                  <th className="py-2.5 px-3 font-semibold">Taxa Admin</th>
                  <th className="py-2.5 px-3 font-semibold">Líquido a Receber</th>
                  <th className="py-2.5 px-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-600">
                      {new Date(w.requested_at).toLocaleDateString('pt-AO')}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 capitalize">
                      {w.method.replace('_', ' ')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{w.account_number}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 tabular-nums">
                      {formatKz(w.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 tabular-nums">
                      {formatKz(w.fee)}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700 tabular-nums">
                      {formatKz(w.net_amount)}
                    </td>
                    <td className="py-2.5 px-3">
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
                          ? 'Pago'
                          : w.status === 'pending'
                          ? 'Pendente'
                          : 'Rejeitado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Solicitar Levantamento de Comissões
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawFeedback && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  withdrawFeedback.isError
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {withdrawFeedback.msg}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor a Levantar (Saldo Disponível: {formatKz(affiliateProfile.commission_available)})
                </label>
                <input
                  type="number"
                  min={settings.min_withdrawal_amount}
                  max={affiliateProfile.commission_available}
                  step="500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold tabular-nums focus:outline-hidden focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Taxa administrativa AngolaMarket ({settings.withdrawal_fee_percent}%):{' '}
                  {formatKz((withdrawAmount * settings.withdrawal_fee_percent) / 100)} ·
                  Receberá líquido:{' '}
                  <strong className="text-emerald-700">
                    {formatKz(withdrawAmount - (withdrawAmount * settings.withdrawal_fee_percent) / 100)}
                  </strong>
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Método de Receção</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as WithdrawalMethod)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                >
                  <option value="multicaixa_express">Multicaixa Express (Número de Telemóvel)</option>
                  <option value="paypay">PayPay África</option>
                  <option value="iban">Transferência Bancária (IBAN)</option>
                  <option value="unitel_money">Unitel Money</option>
                  <option value="afrimoney">Afrimoney</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Número de Telemóvel / IBAN
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    withdrawMethod === 'iban'
                      ? 'AO06 0040 0000 ...'
                      : 'Ex: 923 000 000'
                  }
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo do Titular
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome associado à conta ou serviço"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observações (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Banco BAI ou BFA"
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
              >
                Confirmar Solicitação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
