import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  CartItem,
  Category,
  Coupon,
  DeliveryZone,
  Notification,
  Order,
  OrderStatus,
  PlatformSettings,
  Product,
  User,
  UserRole,
  Withdrawal,
  WithdrawalMethod,
  WithdrawalStatus,
  AffiliateProfile,
  AffiliateSale,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_WITHDRAWALS,
  INITIAL_AFFILIATE_PROFILE,
} from '../lib/mockData';
import { generateOrderId, calculateCommission } from '../lib/formatters';

interface MarketplaceContextType {
  currentUser: User;
  users: User[];
  products: Product[];
  categories: Category[];
  deliveryZones: DeliveryZone[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  orders: Order[];
  affiliateProfile: AffiliateProfile;
  withdrawals: Withdrawal[];
  settings: PlatformSettings;
  notifications: Notification[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  activeAffiliateRef: string | null;
  setActiveAffiliateRef: (ref: string | null) => void;

  // Actions
  switchRole: (role: UserRole) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp: string;
    province: string;
    municipality: string;
    neighborhood: string;
    address: string;
    referencePoint: string;
    notes?: string;
    deliveryFee: number;
    paymentMethod: any;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  addProduct: (productData: Partial<Product>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  toggleProductStatus: (productId: string) => void;
  requestWithdrawal: (data: {
    amount: number;
    method: WithdrawalMethod;
    accountNumber: string;
    accountHolder: string;
    notes?: string;
  }) => { success: boolean; message: string };
  updateWithdrawalStatus: (withdrawalId: string, status: WithdrawalStatus) => void;
  updateDeliveryZone: (zoneId: string, updates: Partial<DeliveryZone>) => void;
  addDeliveryZone: (zone: Partial<DeliveryZone>) => void;
  updateSettings: (settings: Partial<PlatformSettings>) => void;
  updateCategory: (catId: string, updates: Partial<Category>) => void;
  addCategory: (category: Partial<Category>) => void;
  markNotificationAsRead: (id: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'angolamarket_v1_store';

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read stored market state, using initial seed', e);
    }
    return null;
  };

  const stored = loadInitialState();

  const [users, setUsers] = useState<User[]>(stored?.users || INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(
    stored?.currentUser || INITIAL_USERS.find((u) => u.role === 'client') || INITIAL_USERS[0]
  );
  const [products, setProducts] = useState<Product[]>(stored?.products || INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(stored?.categories || INITIAL_CATEGORIES);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(stored?.deliveryZones || INITIAL_DELIVERY_ZONES);
  const [cart, setCart] = useState<CartItem[]>(stored?.cart || []);
  const [orders, setOrders] = useState<Order[]>(stored?.orders || INITIAL_ORDERS);
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateProfile>(
    stored?.affiliateProfile || INITIAL_AFFILIATE_PROFILE
  );
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(stored?.withdrawals || INITIAL_WITHDRAWALS);
  const [settings, setSettings] = useState<PlatformSettings>(stored?.settings || INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<Notification[]>(stored?.notifications || INITIAL_NOTIFICATIONS);
  const [coupons, setCoupons] = useState<Coupon[]>(stored?.coupons || INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeAffiliateRef, setActiveAffiliateRef] = useState<string | null>(() => {
    // Check URL parameters for ?ref=AF-XXXX
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('ref') || null;
    }
    return null;
  });

  // Track ref if detected in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setActiveAffiliateRef(ref);
        // increment clicks
        setAffiliateProfile((prev) => ({
          ...prev,
          total_clicks: prev.total_clicks + 1,
        }));
      }
    }
  }, []);

  // Persist state to local storage
  useEffect(() => {
    try {
      const stateToSave = {
        users,
        currentUser,
        products,
        categories,
        deliveryZones,
        cart,
        orders,
        affiliateProfile,
        withdrawals,
        settings,
        notifications,
        coupons,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [
    users,
    currentUser,
    products,
    categories,
    deliveryZones,
    cart,
    orders,
    affiliateProfile,
    withdrawals,
    settings,
    notifications,
    coupons,
  ]);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const effectivePrice = item.product.promotional_price || item.product.price;
      return sum + effectivePrice * item.quantity;
    }, 0);
  }, [cart]);

  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    } else {
      // Create user for role
      const newUser: User = {
        id: `user-${role}-${Date.now()}`,
        name: `Utilizador ${role.toUpperCase()}`,
        email: `${role}@angolamarket.ao`,
        phone: '+244 923 000 000',
        whatsapp: '+244 923 000 000',
        role,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prevCart, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active
    );
    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    if (cartSubtotal < found.min_order_amount) {
      return {
        success: false,
        message: `Este cupom requer um pedido mínimo de ${found.min_order_amount.toLocaleString()} Kz.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Cupom ${found.code} aplicado com sucesso!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp: string;
    province: string;
    municipality: string;
    neighborhood: string;
    address: string;
    referencePoint: string;
    notes?: string;
    deliveryFee: number;
    paymentMethod: any;
  }) => {
    const orderId = generateOrderId();
    const discountAmount = appliedCoupon
      ? appliedCoupon.discount_type === 'percentage'
        ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
        : appliedCoupon.value
      : 0;

    const total = Math.max(0, cartSubtotal - discountAmount) + orderData.deliveryFee;

    // Calculate affiliate commission if ref exists
    let totalAffiliateCommission = 0;
    const orderItems = cart.map((item) => {
      const effectivePrice = item.product.promotional_price || item.product.price;
      const commissionForProduct = calculateCommission(
        effectivePrice * item.quantity,
        item.product.affiliate_commission_percent
      );
      totalAffiliateCommission += commissionForProduct;

      return {
        id: `item-${Date.now()}-${item.product.id}`,
        product_id: item.product.id,
        title: item.product.title,
        price: effectivePrice,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        producer_id: item.product.producer_id,
        producer_name: item.product.producer_name,
        affiliate_commission_amount: commissionForProduct,
      };
    });

    const newOrder: Order = {
      id: orderId,
      customer_id: currentUser.id,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_whatsapp: orderData.customerWhatsapp,
      province: orderData.province,
      municipality: orderData.municipality,
      neighborhood: orderData.neighborhood,
      address: orderData.address,
      reference_point: orderData.referencePoint,
      notes: orderData.notes,
      items: orderItems,
      subtotal: cartSubtotal,
      delivery_fee: orderData.deliveryFee,
      discount_amount: discountAmount,
      total,
      payment_method: orderData.paymentMethod,
      payment_status: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'confirmed',
      order_status: orderData.paymentMethod === 'cash_on_delivery' ? 'received' : 'payment_confirmed',
      affiliate_id: activeAffiliateRef ? 'user-affiliate-1' : undefined,
      affiliate_ref: activeAffiliateRef || undefined,
      affiliate_commission_total: activeAffiliateRef ? totalAffiliateCommission : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tracking_history: [
        {
          status: 'received',
          label: 'Pedido Recebido',
          timestamp: 'Agora mesmo',
          note: `Pedido registado com pagamento via ${orderData.paymentMethod}`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartMatch.quantity),
          };
        }
        return prod;
      })
    );

    // If affiliate sale occurred, register in affiliate profile
    if (activeAffiliateRef) {
      setAffiliateProfile((prev) => ({
        ...prev,
        total_orders: prev.total_orders + 1,
        total_sales_volume: prev.total_sales_volume + cartSubtotal,
        commission_pending: prev.commission_pending + totalAffiliateCommission,
      }));
    }

    // Add internal notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        user_id: currentUser.id,
        title: `Novo pedido ${orderId}`,
        message: `O seu pedido no valor de ${total.toLocaleString()} Kz foi registado com sucesso!`,
        type: 'order',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const statusLabels: Record<OrderStatus, string> = {
            received: 'Pedido Recebido',
            payment_pending: 'Aguardando Pagamento',
            payment_confirmed: 'Pagamento Confirmado',
            in_preparation: 'Em Preparação',
            awaiting_pickup: 'Aguardando Recolha',
            in_delivery: 'Em Entrega',
            delivered: 'Entregue com Sucesso',
            cancelled: 'Pedido Cancelado',
          };

          const newEvent = {
            status,
            label: statusLabels[status],
            timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
            note: note || `Estado atualizado para ${statusLabels[status]}`,
          };

          // If order is delivered, release pending commission to available for affiliate!
          if (status === 'delivered' && order.affiliate_commission_total && order.affiliate_id) {
            setAffiliateProfile((affPrev) => ({
              ...affPrev,
              commission_pending: Math.max(0, affPrev.commission_pending - order.affiliate_commission_total!),
              commission_available: affPrev.commission_available + order.affiliate_commission_total!,
            }));
          }

          return {
            ...order,
            order_status: status,
            payment_status: status === 'payment_confirmed' || status === 'delivered' ? 'confirmed' : order.payment_status,
            updated_at: new Date().toISOString(),
            tracking_history: [...order.tracking_history, newEvent],
          };
        }
        return order;
      })
    );
  };

  const addProduct = (productData: Partial<Product>): Product => {
    const slug = (productData.title || 'produto')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: productData.title || 'Novo Produto',
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      description: productData.description || '',
      price: productData.price || 10000,
      promotional_price: productData.promotional_price,
      discount_percent: productData.promotional_price
        ? Math.round((1 - productData.promotional_price / (productData.price || 10000)) * 100)
        : 0,
      category_id: productData.category_id || categories[0]?.id || 'cat-eletronicos',
      category_name: productData.category_name || categories[0]?.name || 'Eletrónicos',
      subcategory: productData.subcategory || 'Geral',
      stock: productData.stock || 10,
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['/src/assets/images/product_smartphone_galaxy_1793008581253.jpg'],
      producer_id: currentUser.id,
      producer_name: currentUser.name,
      producer_phone: currentUser.phone,
      producer_whatsapp: currentUser.whatsapp,
      pickup_address: productData.pickup_address || 'Luanda, Angola',
      affiliate_commission_percent: productData.affiliate_commission_percent || settings.default_affiliate_commission,
      rating: 5.0,
      review_count: 0,
      status: settings.require_product_approval && currentUser.role !== 'admin' ? 'pending_approval' : 'approved',
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        user_id: 'user-admin-1',
        title: 'Novo produto submetido',
        message: `${newProd.title} foi cadastrado por ${currentUser.name}.`,
        type: 'product',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return newProd;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const toggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus = p.status === 'approved' ? 'paused' : 'approved';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const requestWithdrawal = (data: {
    amount: number;
    method: WithdrawalMethod;
    accountNumber: string;
    accountHolder: string;
    notes?: string;
  }) => {
    if (data.amount < settings.min_withdrawal_amount) {
      return {
        success: false,
        message: `O valor mínimo para levantamento é de ${settings.min_withdrawal_amount.toLocaleString()} Kz.`,
      };
    }
    if (data.amount > affiliateProfile.commission_available) {
      return {
        success: false,
        message: 'Saldo disponível insuficiente para este levantamento.',
      };
    }

    const fee = Math.round((data.amount * settings.withdrawal_fee_percent) / 100);
    const netAmount = data.amount - fee;

    const newWithdrawal: Withdrawal = {
      id: `with-${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role === 'producer' ? 'producer' : 'affiliate',
      amount: data.amount,
      fee,
      net_amount: netAmount,
      method: data.method,
      account_number: data.accountNumber,
      account_holder: data.accountHolder,
      notes: data.notes,
      status: 'pending',
      requested_at: new Date().toISOString(),
    };

    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    // Deduct from available balance
    setAffiliateProfile((prev) => ({
      ...prev,
      commission_available: prev.commission_available - data.amount,
    }));

    return {
      success: true,
      message: `Pedido de levantamento de ${data.amount.toLocaleString()} Kz registado com sucesso!`,
    };
  };

  const updateWithdrawalStatus = (withdrawalId: string, status: WithdrawalStatus) => {
    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id === withdrawalId) {
          if (status === 'approved' || status === 'processed') {
            setAffiliateProfile((affPrev) => ({
              ...affPrev,
              commission_withdrawn: affPrev.commission_withdrawn + w.amount,
            }));
          } else if (status === 'rejected') {
            // Refund to available balance
            setAffiliateProfile((affPrev) => ({
              ...affPrev,
              commission_available: affPrev.commission_available + w.amount,
            }));
          }
          return {
            ...w,
            status,
            processed_at: new Date().toISOString(),
          };
        }
        return w;
      })
    );
  };

  const updateDeliveryZone = (zoneId: string, updates: Partial<DeliveryZone>) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, ...updates } : z))
    );
  };

  const addDeliveryZone = (zone: Partial<DeliveryZone>) => {
    const newZone: DeliveryZone = {
      id: `dz-${Date.now()}`,
      province: zone.province || 'Luanda',
      municipality: zone.municipality || 'Luanda',
      zone_name: zone.zone_name || 'Nova Zona',
      price: zone.price || 2500,
      estimated_days_min: zone.estimated_days_min || 1,
      estimated_days_max: zone.estimated_days_max || 2,
      is_active: true,
    };
    setDeliveryZones((prev) => [...prev, newZone]);
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateCategory = (catId: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, ...updates } : c))
    );
  };

  const addCategory = (cat: Partial<Category>) => {
    const slug = (cat.name || 'categoria').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: cat.name || 'Nova Categoria',
      slug,
      description: cat.description || '',
      icon: cat.icon || 'Folder',
      subcategories: cat.subcategories || [],
      product_count: 0,
      is_active: true,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS.find((u) => u.role === 'client') || INITIAL_USERS[0]);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setDeliveryZones(INITIAL_DELIVERY_ZONES);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setAffiliateProfile(INITIAL_AFFILIATE_PROFILE);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setSettings(INITIAL_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCoupons(INITIAL_COUPONS);
    setAppliedCoupon(null);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        users,
        products,
        categories,
        deliveryZones,
        cart,
        cartCount,
        cartSubtotal,
        orders,
        affiliateProfile,
        withdrawals,
        settings,
        notifications,
        coupons,
        appliedCoupon,
        activeAffiliateRef,
        setActiveAffiliateRef,
        switchRole,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        toggleProductStatus,
        requestWithdrawal,
        updateWithdrawalStatus,
        updateDeliveryZone,
        addDeliveryZone,
        updateSettings,
        updateCategory,
        addCategory,
        markNotificationAsRead,
        resetToDefaults,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
