import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  Bell,
  ChevronDown,
  Layers,
  Sparkles,
  Store,
  Share2,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatKz } from '../../lib/formatters';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAuth,
  currentView,
  onNavigate,
  onSearchChange,
  searchQuery,
}) => {
  const {
    currentUser,
    switchRole,
    cartCount,
    categories,
    notifications,
    products,
    markNotificationAsRead,
  } = useMarketplace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.is_read);

  // Quick search preview matches
  const searchMatches = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    if (role === 'admin') onNavigate('admin');
    else if (role === 'producer') onNavigate('produtor');
    else if (role === 'affiliate') onNavigate('afiliado');
    else onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top micro announcement bar */}
      <div className="bg-blue-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-amber-400">AngolaMarket</span>
            <span className="text-blue-200 hidden sm:inline">·</span>
            <span className="text-blue-100 hidden sm:inline">
              Entregas rápidas em Luanda e províncias com Multicaixa Express & PayPay
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-xs text-blue-200">
            {/* Simulation role switcher in top bar */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-white transition-colors bg-blue-800/80 px-2 py-0.5 rounded text-[11px] font-medium"
              >
                <span>Papel: <strong className="text-white capitalize">{currentUser.role}</strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-500 text-[10px] uppercase tracking-wider">
                    Alternar Modo de Demonstração
                  </div>
                  <button
                    onClick={() => handleRoleSelect('client')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      currentUser.role === 'client' ? 'font-bold text-blue-600 bg-blue-50/50' : ''
                    }`}
                  >
                    <span>Cliente (Maria Luanda)</span>
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleRoleSelect('producer')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      currentUser.role === 'producer' ? 'font-bold text-blue-600 bg-blue-50/50' : ''
                    }`}
                  >
                    <span>Produtor (Kandengue Tech)</span>
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleRoleSelect('affiliate')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      currentUser.role === 'affiliate' ? 'font-bold text-blue-600 bg-blue-50/50' : ''
                    }`}
                  >
                    <span>Afiliado (Carlos AF-7821)</span>
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between border-t border-slate-100 ${
                      currentUser.role === 'admin' ? 'font-bold text-blue-600 bg-blue-50/50' : ''
                    }`}
                  >
                    <span>Administrador Geral</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              {/* Logo SVG Icon */}
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-blue-900 leading-none">
                  Angola<span className="text-blue-600">Market</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                  Mercado de Angola
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar - Center Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Pesquisar por telemóvel, computador, moda, fragrâncias..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-600 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Instant Search Results Dropdown */}
            {searchFocused && searchMatches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Produtos Encontrados
                </div>
                {searchMatches.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate('produto', item);
                      onSearchChange('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50/50 flex items-center justify-between border-b border-slate-100 last:border-none transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-9 h-9 object-cover rounded-md bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-400">{item.category_name}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-700 tabular-nums">
                      {formatKz(item.promotional_price || item.price)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons & User Account */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Quick links to Dashboards based on role */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Painel Admin</span>
              </button>
            )}

            {currentUser.role === 'producer' && (
              <button
                onClick={() => onNavigate('produtor')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'produtor' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Painel Produtor</span>
              </button>
            )}

            {currentUser.role === 'affiliate' && (
              <button
                onClick={() => onNavigate('afiliado')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'afiliado' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Painel Afiliado</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg relative transition-colors"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Notificações</span>
                    <span className="text-[11px] text-blue-600 font-medium">
                      {unreadNotifs.length} novas
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">Sem notificações no momento</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.is_read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 p-2 sm:px-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors relative"
              aria-label="Carrinho de Compras"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800">
                Carrinho
              </span>
            </button>

            {/* User Account / Login */}
            <button
              onClick={() => {
                if (currentUser.role === 'admin') onNavigate('admin');
                else if (currentUser.role === 'producer') onNavigate('produtor');
                else if (currentUser.role === 'affiliate') onNavigate('afiliado');
                else onNavigate('conta');
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 line-clamp-1 max-w-[110px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-blue-600 capitalize font-medium">
                  {currentUser.role}
                </span>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Pesquisar produtos em Angola..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-600 focus:outline-hidden focus:border-blue-600"
            />
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Categories Horizontal Navigation Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/70 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between text-xs font-medium text-slate-600 overflow-x-auto py-2">
            <div className="flex items-center gap-6">
              <button
                onClick={() => onNavigate('home')}
                className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-0.5 ${
                  currentView === 'home' ? 'text-blue-700 font-bold' : ''
                }`}
              >
                Início
              </button>

              <button
                onClick={() => onNavigate('produtos')}
                className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-0.5 ${
                  currentView === 'produtos' ? 'text-blue-700 font-bold' : ''
                }`}
              >
                Todos os Produtos
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('produtos', { categoryId: cat.id })}
                  className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-0.5"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 shrink-0 text-slate-500">
              <button
                onClick={() => onNavigate('afiliados-info')}
                className="hover:text-blue-600 transition-colors whitespace-nowrap flex items-center gap-1 font-semibold text-blue-700"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ganhe como Afiliado</span>
              </button>
              <button
                onClick={() => onNavigate('produtor-info')}
                className="hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Venda na AngolaMarket
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Início
            </button>
            <button
              onClick={() => {
                onNavigate('produtos');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Catálogo de Produtos
            </button>
            <button
              onClick={() => {
                onNavigate('conta');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              A Minha Conta & Encomendas
            </button>
            <button
              onClick={() => {
                onNavigate('afiliados-info');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Ganhe Dinheiro como Afiliado
            </button>
            <button
              onClick={() => {
                onNavigate('produtor-info');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Vender Produtos (Área do Produtor)
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
              Categorias
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onNavigate('produtos', { categoryId: cat.id });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-1.5 px-2 rounded-md hover:bg-slate-50 text-slate-600"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
