/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { ProductCard } from './components/product/ProductCard';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { AffiliateDashboardView } from './components/dashboards/AffiliateDashboardView';
import { ProducerDashboardView } from './components/dashboards/ProducerDashboardView';
import { AdminDashboardView } from './components/dashboards/AdminDashboardView';
import { ClientAccountView } from './components/dashboards/ClientAccountView';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { Product, Order } from './types';
import { formatKz } from './lib/formatters';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Share2,
  Store,
  Filter,
  Layers,
} from 'lucide-react';

function MarketplaceApp() {
  const { products, categories, orders } = useMarketplace();

  // Navigation & View state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // WhatsApp modal
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppTarget, setWhatsAppTarget] = useState<'support' | 'producer' | 'order'>('support');
  const [whatsAppProduct, setWhatsAppProduct] = useState<Product | null>(null);
  const [whatsAppOrder, setWhatsAppOrder] = useState<Order | null>(null);

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'produto' && data) {
      setSelectedProduct(data);
      return;
    }
    if (view === 'produtos' && data?.categoryId) {
      setSelectedCategoryFilter(data.categoryId);
      setCurrentView('produtos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOpenWhatsAppSupport = () => {
    setWhatsAppTarget('support');
    setWhatsAppProduct(null);
    setWhatsAppOrder(null);
    setWhatsAppModalOpen(true);
  };

  const handleOpenWhatsAppProduct = (prod: Product) => {
    setWhatsAppTarget('producer');
    setWhatsAppProduct(prod);
    setWhatsAppOrder(null);
    setWhatsAppModalOpen(true);
  };

  const handleOpenWhatsAppOrder = (ord: Order) => {
    setWhatsAppTarget('order');
    setWhatsAppProduct(null);
    setWhatsAppOrder(ord);
    setWhatsAppModalOpen(true);
  };

  // Filtered products for catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategoryFilter === 'all' || p.category_id === selectedCategoryFilter;
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch && p.status === 'approved';
    });
  }, [products, selectedCategoryFilter, searchQuery]);

  const featuredProducts = products.filter((p) => p.is_featured && p.status === 'approved');
  const promoProducts = products.filter((p) => (p.is_promo || (p.discount_percent && p.discount_percent > 0)) && p.status === 'approved');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setCurrentView('conta')}
        currentView={currentView}
        onNavigate={handleNavigate}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <HeroBanner
              onExplore={() => handleNavigate('produtos')}
              onBeAffiliate={() => handleNavigate('afiliado')}
              onBeProducer={() => handleNavigate('produtor')}
            />

            {/* Featured Products Collection */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    <span>COLEÇÃO EM DESTAQUE</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 font-normal">PRODUTORES VERIFICADOS</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Produtos em Destaque em Angola
                  </h2>
                </div>

                <button
                  onClick={() => handleNavigate('produtos')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors self-start sm:self-auto"
                >
                  <span>Ver Todos os Artigos ({products.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3-column / 4-column product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </section>

            {/* Category Quick Filter Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Compre por Categoria
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Explore departamentos selecionados com entregas na sua zona.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleNavigate('produtos', { categoryId: cat.id })}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {cat.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {cat.subcategories.slice(0, 2).join(', ')}
                        </p>
                      </div>
                      <span className="text-[10px] text-blue-600 font-semibold mt-3 flex items-center gap-1">
                        Ver Catálogo <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Promotional Offers Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
                    <span>OPORTUNIDADES DA SEMANA</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 font-normal">DESCONTOS ESPECIAIS</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Promoções AngolaMarket
                  </h2>
                </div>

                <button
                  onClick={() => handleNavigate('produtos')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <span>Ver Mais</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {promoProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </section>

            {/* Affiliate & Producer Spotlight Banners */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Affiliate banner */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 shadow-md">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Ganhe Dinheiro como Afiliado
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                      Trabalhe a partir de casa divulgando produtos no WhatsApp, Facebook e Instagram.
                      Receba até 15% de comissão direta por cada venda concluída, com levantamento por Multicaixa Express.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('afiliado')}
                    className="self-start px-5 py-3 bg-white hover:bg-blue-50 text-blue-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <span>Aceder ao Painel de Afiliado</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Producer banner */}
                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 shadow-md">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                      <Store className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Venda os Seus Produtos na AngolaMarket
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Alcance milhares de compradores em Talatona, Kilamba, Viana e províncias.
                      Gestão completa de stock, recolha simplificada e comissões automáticas.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('produtor')}
                    className="self-start px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <span>Registar Loja / Produtor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW: CATALOG (TODOS OS PRODUTOS) */}
        {currentView === 'produtos' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                <span>CATÁLOGO GERAL</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500 font-normal">MERCADO ANGOLANO</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Todos os Produtos Disponíveis
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Apresentando {filteredProducts.length} artigos verificados com entrega em Angola.
              </p>
            </div>

            {/* Filter Pills / Buttons Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todas as Categorias
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryFilter(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === c.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <p className="text-base font-bold text-slate-700">Nenhum produto encontrado</p>
                <p className="text-xs">Tente limpar os termos de pesquisa ou filtros.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: AFILIADO DASHBOARD */}
        {currentView === 'afiliado' && <AffiliateDashboardView />}

        {/* VIEW: AFILIADOS INFO / LANDING */}
        {currentView === 'afiliados-info' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-center sm:text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Programa Oficial de Afiliados
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-balance">
                Monetize o seu público e contactos com a AngolaMarket
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                O programa de afiliados da AngolaMarket permite a qualquer criador de conteúdo,
                promotor ou utilizador ganhar comissões reais em Kwanzas divulgando produtos de qualidade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">1</span>
                <h4 className="text-sm font-bold text-slate-900">Escolha o Produto</h4>
                <p className="text-xs text-slate-500">Selecione artigos no catálogo que os seus contactos gostariam de comprar.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">2</span>
                <h4 className="text-sm font-bold text-slate-900">Partilhe o Link</h4>
                <p className="text-xs text-slate-500">Divulgue o seu link exclusivo com código de rastreio nas redes ou WhatsApp.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">3</span>
                <h4 className="text-sm font-bold text-slate-900">Receba a Comissão</h4>
                <p className="text-xs text-slate-500">Levante o saldo por Multicaixa Express, PayPay ou diretamente por IBAN.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleNavigate('afiliado')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>Aceder ao Meu Painel de Afiliado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW: PRODUTOR DASHBOARD */}
        {currentView === 'produtor' && <ProducerDashboardView />}

        {/* VIEW: PRODUTOR INFO / LANDING */}
        {currentView === 'produtor-info' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-center sm:text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Para Fabricantes, Lojistas e Importadores
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-balance">
                Venda na maior rede de distribuição digital de Angola
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Cadastre a sua loja, conte com centenas de afiliados a divulgar os seus artigos
                e beneficie do serviço de entrega da AngolaMarket.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleNavigate('produtor')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>Entrar no Painel do Produtor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {currentView === 'admin' && <AdminDashboardView />}

        {/* VIEW: CLIENT ACCOUNT & ORDERS */}
        {currentView === 'conta' && (
          <ClientAccountView
            onViewOrderTracking={(ord) => setTrackedOrder(ord)}
            onOpenWhatsApp={handleOpenWhatsAppOrder}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWhatsAppSupport={handleOpenWhatsAppSupport}
      />

      {/* MODAL: Product Detail */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={handleBuyNow}
          onOpenWhatsApp={handleOpenWhatsAppProduct}
        />
      )}

      {/* DRAWER: Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* MODAL: Checkout */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderCreated={(order) => {
            setIsCheckoutOpen(false);
            setTrackedOrder(order);
          }}
        />
      )}

      {/* MODAL: Order Tracking */}
      {trackedOrder && (
        <OrderTrackingModal
          order={trackedOrder}
          onClose={() => setTrackedOrder(null)}
          onOpenWhatsApp={handleOpenWhatsAppOrder}
        />
      )}

      {/* MODAL: WhatsApp Integration */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        target={whatsAppTarget}
        product={whatsAppProduct}
        order={whatsAppOrder}
      />

      {/* PWA Offline Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceApp />
    </MarketplaceProvider>
  );
}
