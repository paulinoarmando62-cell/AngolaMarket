export type UserRole = 'admin' | 'producer' | 'affiliate' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  role: UserRole;
  avatar_url?: string;
  status: 'active' | 'suspended' | 'pending_approval';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: string[];
  product_count: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in Kz (Kwanzas)
  promotional_price?: number;
  discount_percent?: number;
  category_id: string;
  category_name: string;
  subcategory?: string;
  stock: number;
  images: string[];
  producer_id: string;
  producer_name: string;
  producer_phone: string;
  producer_whatsapp: string;
  pickup_address: string;
  affiliate_commission_percent: number; // e.g. 10 -> 10%
  rating: number;
  review_count: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_promo?: boolean;
  status: 'approved' | 'pending_approval' | 'paused';
  created_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  producer_id: string;
  producer_name: string;
  affiliate_commission_amount: number;
}

export type PaymentMethod = 'multicaixa_express' | 'paypay' | 'bank_transfer' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed';
export type OrderStatus =
  | 'received'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'in_preparation'
  | 'awaiting_pickup'
  | 'in_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTrackingEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string; // e.g. AM-2026-004128
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  province: string;
  municipality: string;
  neighborhood: string;
  address: string;
  reference_point: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  affiliate_id?: string;
  affiliate_ref?: string;
  affiliate_commission_total?: number;
  proof_file?: string;
  created_at: string;
  updated_at: string;
  tracking_history: OrderTrackingEvent[];
}

export interface DeliveryZone {
  id: string;
  province: string;
  municipality: string;
  zone_name: string;
  price: number; // Delivery fee in Kz
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
}

export interface AffiliateProfile {
  id: string;
  user_id: string;
  user_name: string;
  affiliate_code: string; // e.g. "AF-7821"
  commission_rate_default: number;
  total_clicks: number;
  total_orders: number;
  total_sales_volume: number;
  commission_pending: number;
  commission_available: number;
  commission_withdrawn: number;
  status: 'active' | 'pending' | 'suspended';
}

export interface AffiliateSale {
  id: string;
  affiliate_id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  sale_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'confirmed' | 'available' | 'withdrawn' | 'cancelled';
  created_at: string;
}

export type WithdrawalMethod = 'multicaixa_express' | 'paypay' | 'unitel_money' | 'afrimoney' | 'iban';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'processed';

export interface Withdrawal {
  id: string;
  user_id: string;
  user_name: string;
  user_role: 'affiliate' | 'producer';
  amount: number;
  fee: number;
  net_amount: number;
  method: WithdrawalMethod;
  account_number: string;
  account_holder: string;
  notes?: string;
  status: WithdrawalStatus;
  requested_at: string;
  processed_at?: string;
}

export interface PlatformSettings {
  platform_fee_percent: number; // default 10%
  default_affiliate_commission: number; // default 8%
  withdrawal_fee_percent: number; // default 2%
  min_withdrawal_amount: number; // default 5000 Kz
  require_product_approval: boolean;
  whatsapp_support_number: string;
  support_email: string;
  enabled_payments: {
    multicaixa_express: boolean;
    paypay: boolean;
    bank_transfer: boolean;
    cash_on_delivery: boolean;
  };
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number;
  is_active: boolean;
  usage_count: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  user_location: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string; // or 'all' or 'admin'
  title: string;
  message: string;
  type: 'order' | 'commission' | 'withdrawal' | 'product' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
