/**
 * AngolaMarket Utility Formatters
 * Formatting for Angolan Kwanzas (Kz), phone numbers, dates, and commission math
 */

export function formatKz(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 Kz';
  }
  // Formats numbers with dot or space separator according to Angolan standard
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} Kz`;
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function generateOrderId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `AM-2026-${randomNum}`;
}

export function calculateCommission(price: number, commissionPercent: number): number {
  return Math.round((price * commissionPercent) / 100);
}

export function calculatePlatformCut(price: number, platformFeePercent: number): {
  platformFee: number;
  producerNet: number;
} {
  const platformFee = Math.round((price * platformFeePercent) / 100);
  const producerNet = price - platformFee;
  return { platformFee, producerNet };
}

export function getOrderStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case 'received':
      return { label: 'Pedido Recebido', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'payment_pending':
      return { label: 'Pagamento Pendente', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'payment_confirmed':
      return { label: 'Pagamento Confirmado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'in_preparation':
      return { label: 'Em Preparação', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'awaiting_pickup':
      return { label: 'Aguardando Recolha', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'in_delivery':
      return { label: 'Em Entrega', color: 'bg-sky-50 text-sky-700 border-sky-200' };
    case 'delivered':
      return { label: 'Entregue', color: 'bg-green-50 text-green-700 border-green-200' };
    case 'cancelled':
      return { label: 'Cancelado', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    default:
      return { label: status, color: 'bg-slate-50 text-slate-700 border-slate-200' };
  }
}

export function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case 'multicaixa_express':
      return 'Multicaixa Express';
    case 'paypay':
      return 'PayPay';
    case 'bank_transfer':
      return 'Transferência Bancária (IBAN)';
    case 'cash_on_delivery':
      return 'Pagamento na Entrega';
    default:
      return method;
  }
}
