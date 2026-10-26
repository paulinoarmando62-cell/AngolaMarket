import React, { useState } from 'react';
import {
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  PauseCircle,
  PlayCircle,
  Edit,
  Trash2,
  X,
  Store,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatKz, calculatePlatformCut } from '../../lib/formatters';
import { Product } from '../../types';

export const ProducerDashboardView: React.FC = () => {
  const {
    currentUser,
    products,
    categories,
    orders,
    addProduct,
    updateProduct,
    toggleProductStatus,
    settings,
  } = useMarketplace();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(25000);
  const [promotionalPrice, setPromotionalPrice] = useState<string>('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [subcategory, setSubcategory] = useState('');
  const [stock, setStock] = useState<number>(10);
  const [pickupAddress, setPickupAddress] = useState(
    'Talatona, Belas Business Park, Edifício Bengo, Luanda'
  );
  const [affiliateCommission, setAffiliateCommission] = useState<number>(10);
  const [imageUrl, setImageUrl] = useState('');

  // Products belonging to this producer
  const myProducts = products.filter(
    (p) => p.producer_id === currentUser.id || p.producer_name.includes('Kandengue')
  );

  // Orders that contain producer products
  const myOrderItems = orders.flatMap((o) =>
    o.items.filter((i) => i.producer_id === currentUser.id || myProducts.some((p) => p.id === i.product_id))
  );

  const totalGrossSales = myOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { platformFee, producerNet } = calculatePlatformCut(
    totalGrossSales,
    settings.platform_fee_percent
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice(25000);
    setPromotionalPrice('');
    setCategoryId(categories[0]?.id || '');
    setSubcategory('');
    setStock(15);
    setImageUrl('/src/assets/images/product_smartphone_galaxy_1793008581253.jpg');
    setAffiliateCommission(10);
    setShowAddModal(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price);
    setPromotionalPrice(prod.promotional_price ? String(prod.promotional_price) : '');
    setCategoryId(prod.category_id);
    setSubcategory(prod.subcategory || '');
    setStock(prod.stock);
    setPickupAddress(prod.pickup_address);
    setAffiliateCommission(prod.affiliate_commission_percent);
    setImageUrl(prod.images[0] || '');
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === categoryId) || categories[0];

    const prodPayload = {
      title,
      description,
      price: Number(price),
      promotional_price: promotionalPrice ? Number(promotionalPrice) : undefined,
      category_id: categoryId,
      category_name: cat?.name || 'Geral',
      subcategory: subcategory || 'Geral',
      stock: Number(stock),
      pickup_address: pickupAddress,
      affiliate_commission_percent: Number(affiliateCommission),
      images: [imageUrl || '/src/assets/images/product_smartphone_galaxy_1793008581253.jpg'],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, prodPayload);
    } else {
      addProduct(prodPayload);
    }

    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Producer Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Painel do Produtor
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300">{currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestão de Produtos & Vendas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Registe artigos, acompanhe o stock, receba pedidos de clientes e visualize o rendimento líquido
            após a taxa da plataforma AngolaMarket ({settings.platform_fee_percent}%).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Receita Líquida</span>
          <p className="text-2xl font-extrabold text-blue-900 tabular-nums">
            {formatKz(producerNet)}
          </p>
          <p className="text-[11px] text-slate-500">
            Bruto: {formatKz(totalGrossSales)} (Taxa {settings.platform_fee_percent}%: -{formatKz(platformFee)})
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Produtos no Catálogo</span>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {myProducts.length}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            {myProducts.filter((p) => p.status === 'approved').length} ativos no mercado
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Itens Vendidos</span>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {myOrderItems.reduce((acc, i) => acc + i.quantity, 0)}
          </p>
          <p className="text-[11px] text-slate-500">Distribuídos por clientes em Luanda</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Stock Total Restante</span>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {myProducts.reduce((acc, p) => acc + p.stock, 0)}
          </p>
          <p className="text-[11px] text-slate-500">Unidades disponíveis para entrega</p>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Os Seus Produtos Cadastrados
          </h2>
          <span className="text-xs text-slate-500">
            Total de {myProducts.length} produtos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Produto</th>
                <th className="py-3 px-4 font-semibold">Categoria</th>
                <th className="py-3 px-4 font-semibold">Preço (Kz)</th>
                <th className="py-3 px-4 font-semibold">Comissão Afiliados</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                        {prod.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{prod.category_name}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                    {formatKz(prod.promotional_price || prod.price)}
                  </td>
                  <td className="py-3 px-4 font-medium text-amber-600">
                    {prod.affiliate_commission_percent}%
                  </td>
                  <td className="py-3 px-4 font-bold tabular-nums">
                    <span className={prod.stock <= 5 ? 'text-rose-600' : 'text-slate-700'}>
                      {prod.stock} un.
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : prod.status === 'paused'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {prod.status === 'approved'
                        ? 'Ativo'
                        : prod.status === 'paused'
                        ? 'Pausado'
                        : 'Aguardando Aprovação'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleProductStatus(prod.id)}
                        className="p-1.5 text-slate-500 hover:text-slate-800"
                        title={prod.status === 'approved' ? 'Pausar venda' : 'Ativar venda'}
                      >
                        {prod.status === 'approved' ? (
                          <PauseCircle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-slate-500 hover:text-blue-600"
                        title="Editar produto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto na AngolaMarket'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Smartphone Pro 256GB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição Detalhada *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Indique especificações, garantia e detalhes do produto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço Normal (Kz) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 tabular-nums font-bold focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço Promocional (Opcional)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    placeholder="Deixe em branco se sem desconto"
                    value={promotionalPrice}
                    onChange={(e) => setPromotionalPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 tabular-nums focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria Principal *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subcategoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Telemóveis, Vestuário"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantidade em Estoque *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold tabular-nums focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Comissão do Afiliado (% da Venda) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={affiliateCommission}
                    onChange={(e) => setAffiliateCommission(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold tabular-nums focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Endereço do Ponto de Recolha / Loja *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Talatona, Belas Business Park, Torre C, Luanda"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  {editingProduct ? 'Guardar Alterações' : 'Submeter Produto para o Mercado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
