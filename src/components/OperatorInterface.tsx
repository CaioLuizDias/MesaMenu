import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  UtensilsCrossed, 
  BarChart3, 
  Settings, 
  Power, 
  TrendingUp, 
  Users, 
  Receipt, 
  DollarSign, 
  Clock, 
  Printer, 
  Check, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Globe, 
  Download,
  AlertTriangle,
  History,
  QrCode,
  CalendarDays,
  FileImage,
  Sparkles,
  Play,
  X
} from 'lucide-react';
import { Product, Order, AttentionAlert, CategoryType, OrderItem } from '../types';

interface OperatorInterfaceProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  alerts: AttentionAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<AttentionAlert[]>>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function OperatorInterface({
  products,
  setProducts,
  orders,
  setOrders,
  alerts,
  setAlerts,
  isOpen,
  setIsOpen
}: OperatorInterfaceProps) {
  // Navigation: 'dashboard' | 'kds' | 'menu' | 'reports' | 'config'
  const [activeMenuTab, setActiveMenuTab] = useState<'dashboard' | 'kds' | 'menu' | 'reports' | 'config'>('dashboard');

  // Sector filter in KDS: 'Todos' | 'Cozinha' | 'Bar'
  const [kdsSectorFilter, setKdsSectorFilter] = useState<'Todos' | 'Cozinha' | 'Bar'>('Todos');

  // Search and Category states in Menu management
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');

  // Add Product Modal side panel state
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  // New product form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryType>('Bebidas');
  const [newProdImage, setNewProdImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuCUDdqiCjN_X706wSMq_lj0lgPgcYkqbN3CJxuBEeIAjBRuOnSHzgSwU1_Lhpqq_oBoXmfiy6Tm8XdLo40taTeAd51DPSe9E6FrXtqA-s_3-AVF_xB8D2eris8iGjsR012NQ73fxtSsrIVtjuDLPmUQCRMCL59qHdguTDCPaveHInstD3q1XqlViAqb3rMl8sbzfgJkHNLc4jIUpH23_7K_yy8Zz889F1h0EfcZEhnHhB8nee37GqaoQp85R8WL5abaPBBvM42JkeRD');

  // Preset upload options for quick high-quality visuals
  const presetFoodImages = [
    { label: "Caipirinha", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUDdqiCjN_X706wSMq_lj0lgPgcYkqbN3CJxuBEeIAjBRuOnSHzgSwU1_Lhpqq_oBoXmfiy6Tm8XdLo40taTeAd51DPSe9E6FrXtqA-s_3-AVF_xB8D2eris8iGjsR012NQ73fxtSsrIVtjuDLPmUQCRMCL59qHdguTDCPaveHInstD3q1XqlViAqb3rMl8sbzfgJkHNLc4jIUpH23_7K_yy8Zz889F1h0EfcZEhnHhB8nee37GqaoQp85R8WL5abaPBBvM42JkeRD" },
    { label: "Chopp", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDANR0D6cmQF8Y3i9nMY1Sfr8PGX3SM-XPdgHbOdFJFDW1622VyJQ_V0Dh61S9Wnn0hgLFZdx8K9SGFOgyQUxbjkHgglGiCVSit1S1YfOUvDKYNEaLuXm8fs_LlNzYkdPzVY3gajb9pxZ5ukKXg3HlFLbj-82n-Jr_Oc1CCPMJNE9RhgiHJntNDUBnh2Q54jum6as7J3CdRJBnW8M9nL5fTW6jAIoCjXCb9Oa_gmMkQI3-hA-QkQGlrEpi2LLeswgvo7DevgiHWNVDZ" },
    { label: "Água de Coco", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbqxNfQXhIyN32wMumiwphrXigSdEFYrXlQQnxHkcC8ysgGOlsAJgXIych_MZTSr2v0SYkrKzX_sIL8uNIUoSdGfz_loVSm0mNSvNN9EkcMyqNr-E2YnzlVY5WFh8CjfQEcffzyp22g_cN6-DM5B0YdlTW-Ho7ZA-n2NfHDdoFswaGCdYbMEVEMUIK6DEb1EmVgygB3f7NVauvDjiXvhJAtXjBUlXsckTtN0j_RDOYld7rEVJraDYY7kV1zl9_Y9wB1oesuS52WuCo" },
    { label: "Rigatoni Pasta", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuChMG8qesNP_v7jJSqkaU0c7AMUeR2PbJSFc-MkDQJHfXtJENX9RUObnFBPFxWbPGWxX8BcwS1DJEn9O5KJJ2wuAMrDee-ZrCYsfLKYqF_7jys5K_QzEfUEH5cQDWYZ5_LdPcbB_Ppy-0nR7FeyeDISLlttIfnU5p8ldDyVbIzz6TZZqGcONw594i3F5iEVqZOBM5AMfyfbZV9kFBdeAkZWa-eK1nzWiYwXgVluekaqZr-SUpIkBHeJbuB-TyUV2IPr_fOuM2O_mq" },
    { label: "Citrus Spritz", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi06k0LuqOtKLjeWcFXsmDhsC7j5Ch3ffywA8ebC3NTbKeE9_AE1bdCgwIFnWmybTXx5lfc9mdEZsxlp8mGyuH5642bn16VucA9RBOvHV20IpW7VMN2ELDfwxpLHj4XB0i2uxv4JglaFFzfYmc-A0aZnA60av3KXFGE_4KHVFcFZg6NM7qcrV59zi1Q-a15H8OOsgBqteHEWIFowGoHCZHMOf36M_vcLOqw0s4708O2_WUsGuaiSoF-ij0PUG9sBT_9Mh5XIhVVP1g" },
    { label: "Salmão", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq6TR2eBNnfYgvNk8bav4ab2UrY9MeQ36tS5UaDx8pdsZwDo1SyIkkTe3qU2n0LZRIVhT3jk_KVoQm51E6IPO9iXYrsxUckLUgEhwQIazM8gIS7wXUAX6eC1EKHDW8fqDrb8Fq2dX5wHfmG8ctVoPlmyVtpH7ePt04Pdui4zo1LEL7puGWqAU3vivLUI0mamZmxYoXTmZMU9fevNWXuM5H4PeCXguvh3OCKzH4GXNDCom4Pk9wdOTinbY7Vxj5lw6D4zYwkuZ2wTAd" },
    { label: "Tiramisu", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzo9822HCWfN0l5ZXb48-CLpr9MYxgPafaHRdzNyOgYD0dM_HAyh6y3B8QfaYXIGQPSmJJU4dRUVShSjXA5Otyw2hU2YhqGj0pYgqU7qp9PhDCzHOwZ_ZfSGLUlznIy-Fz_T1-PRar6211eNaP7JW6sqSrSG3FyI9IAh96Yd-R1Ve2EFHvCTA6qHNAOYxwPwlDYwptvzHG8KjsoYdPxwYv31M87bOVgElvh9ZNHTEc05xW0nmH1v7Ah-Hu048bhkK1uWj9qUiojvLp" },
    { label: "Carpaccio", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9YumeH9UdIOHlY3h7mBXulMCqKowslSAL3BLlH5mLu3S1ezZ-rai10M8J9pWN1fjBaVAkXYHQ6iuU3a0D87GVdDcxWecLdB3BNlxrK7k0dzubhb6aIB-tJ2Cgn66n8M68Q78kxyLqRShsYlYTcs_hXLcKz2LYqDEg8XOBFmTsNGzv_31TiK_KnXY6kEmZ2vaeNoW4x38SswnNTDFmsq8PkbjqVaykfLqtHJ-cxLpV-ia1NxNJaRdTtO6H9_rFmjfsMFd2F6zSkTCf" }
  ];

  // Simulated metrics
  const activeTablesCount = 24;
  const totalTables = 40;
  const ticketMedia = 185.50;
  const openOrdersCount = orders.filter(o => o.status !== 'Entregue').length;
  const baseRevenue = 4452.00;
  
  // Calculate revenue dynamically based on actual status
  const currentOrdersTotal = orders
    .filter(o => o.status === 'Entregue')
    .reduce((v, o) => v + o.items.reduce((s, i) => s + (i.price * i.quantity), 0), 0);
  const totalRevenue = baseRevenue + currentOrdersTotal;

  // Manage Order Status transitions (KDS Actions)
  const handleStartOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'Em Preparo' } : o
    ));
  };

  const handleFinishOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'Pronto' } : o
    ));
  };

  const handleDeliverOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'Entregue' } : o
    ));
  };

  // Toggle active status in menu table
  const handleToggleProductActive = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, active: !p.active } : p
    ));
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      description: newProdDesc || "Produto artesanal fresco.",
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      image: newProdImage,
      active: true
    };

    setProducts(prev => [...prev, newProduct]);

    // Reset fields
    setNewProdName('');
    setNewProdDesc('');
    setNewProdPrice('');
    setIsAddPanelOpen(false);
  };

  const filterKDSOrders = (order: Order) => {
    if (order.status === 'Entregue') return false;
    
    if (kdsSectorFilter === 'Todos') return true;
    if (kdsSectorFilter === 'Bar') {
      return order.items.some(item => item.category === 'Bebidas');
    }
    if (kdsSectorFilter === 'Cozinha') {
      return order.items.some(item => item.category !== 'Bebidas');
    }
    return true;
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
    const matchesCategory = menuCategoryFilter === 'all' || p.category === menuCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-brand-bg flex h-screen overflow-hidden text-brand-charcoal font-sans relative">
      {/* ==================== SIDEBAR ==================== */}
      <aside className="w-60 bg-brand-dark flex flex-col justify-between py-6 px-4 shrink-0 transition-all border-r border-[#E1F5EE]/10 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="px-3">
            <h1 className="font-serif text-2xl font-bold text-brand-menta tracking-tight">MenuMesa</h1>
            <p className="text-[10px] text-white/50 tracking-widest font-bold uppercase mt-1">SaaS Painel Operador</p>
          </div>

          {/* Profile card at the very top of Sidebar */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 mx-1">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACmzjjKdiT2UJiOM4fXpyS_TWMsZxn-CaBQefB1qJ9iS7OWw1Fd09TkJ5SXtXOwpD-mg-DzOhr_4E6vayx0ibFo7BDz8g0o86OwgZkZ8i19IyKvOI91EIT9-0S2cH7VfosGa1C4jZ4p0Eor-SpNG9t_jhG5kG3HFBIUAZEeGyrCvbeOj_YreqJv8O5aBnwaedDZyeyTl4F5JPcoY7P8YxV-0HjUmco9fcgumOgon_G7EYP9QlJ1F1_3LewZ01bTKmZZCf5McPYshx-" 
              alt="Avatar Operador" 
              className="w-10 h-10 rounded-full object-cover border border-brand-menta/30"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">Gerente Mesa</span>
              <span className="text-[10px] text-white/60 truncate">Unidade Coqueiro</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-1">
            <button
              onClick={() => setActiveMenuTab('dashboard')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all ${
                activeMenuTab === 'dashboard' 
                  ? 'bg-brand-primary text-white font-bold border-l-4 border-brand-menta shadow-sm' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveMenuTab('kds')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all ${
                activeMenuTab === 'kds' 
                  ? 'bg-brand-primary text-white font-bold border-l-4 border-brand-menta shadow-sm' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Bell className="w-4.5 h-4.5" />
              Pedidos ao Vivo (KDS)
              {orders.filter(o => o.status === 'Novo').length > 0 && (
                <span className="ml-auto bg-brand-gold text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {orders.filter(o => o.status === 'Novo').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveMenuTab('menu')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all ${
                activeMenuTab === 'menu' 
                  ? 'bg-brand-primary text-white font-bold border-l-4 border-brand-menta shadow-sm' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4.5 h-4.5" />
              Gestão de Cardápio
            </button>
            <button
              onClick={() => setActiveMenuTab('reports')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all ${
                activeMenuTab === 'reports' 
                  ? 'bg-brand-primary text-white font-bold border-l-4 border-brand-menta shadow-sm' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              Relatórios & KPIs
            </button>
            <button
              onClick={() => setActiveMenuTab('config')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all ${
                activeMenuTab === 'config' 
                  ? 'bg-brand-primary text-white font-bold border-l-4 border-brand-menta shadow-sm' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              Configurações
            </button>
          </nav>
        </div>

        {/* Real-time Establishment Status Controller */}
        <div className="border-t border-[#E1F5EE]/10 pt-4 px-2">
          <div className="flex items-center justify-between bg-white/5 rounded-xl p-2 px-3 border border-white/10 shadow-sm text-white">
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
              {isOpen ? "Aberto" : "Fechado"}
            </span>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`w-9 h-5 rounded-full relative transition-colors ${
                isOpen ? 'bg-brand-primary' : 'bg-gray-600'
              }`}
            >
              <span className={`absolute top-[2.5px] w-3.5 h-3.5 rounded-full bg-white transition-all ${
                isOpen ? 'right-1' : 'left-1'
              }`}></span>
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT CONTAINER ==================== */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TOP BAR / HEADER */}
        <header className="h-[70px] border-b border-brand-light flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl font-bold tracking-tight text-brand-dark capitalize">
              {activeMenuTab === 'dashboard' && 'Dashboard Operacional'}
              {activeMenuTab === 'kds' && 'Cozinha Digital (KDS)'}
              {activeMenuTab === 'menu' && 'Gerenciamento do Cardápio'}
              {activeMenuTab === 'reports' && 'Relatórios de Performance'}
              {activeMenuTab === 'config' && 'Mesa & Ajustes Gerais'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 font-mono text-xs font-semibold rounded-full border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Conexão
            </div>
            <span className="text-brand-gray text-xs font-mono font-medium">Quiosque Coqueiro 🌴</span>
          </div>
        </header>

        {/* SCREEN CONTENT CONDITIONAL RENDERING */}
        <div className="p-8 flex-1">
          {/* ================== TELA 1: Dashboard Principal ================== */}
          {activeMenuTab === 'dashboard' && (
            <div className="flex flex-col gap-6 max-w-5xl animate-fade-in">
              {/* Metrics cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-brand-light p-5 shadow-[0_4px_16px_rgba(4,52,44,0.02)] flex flex-col gap-2 relative overflow-hidden group hover:border-brand-primary transition-colors">
                  <div className="flex justify-between items-center text-brand-gray">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Mesas Ativas</span>
                    <Users className="w-4.5 h-4.5 text-brand-primary/60" />
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className="font-serif text-2xl font-bold text-brand-primary">{activeTablesCount}</span>
                    <span className="text-xs text-brand-gray font-mono">/ {totalTables}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-brand-light p-5 shadow-[0_4px_16px_rgba(4,52,44,0.02)] flex flex-col gap-2 relative overflow-hidden group hover:border-brand-primary transition-colors">
                  <div className="flex justify-between items-center text-brand-gray">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Pedidos em Aberto</span>
                    <Receipt className="w-4.5 h-4.5 text-brand-primary/60" />
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-serif text-2xl font-bold text-brand-gold">{openOrdersCount}</span>
                    <span className="text-[10px] bg-brand-gold-light text-brand-gold px-1.5 py-0.5 rounded-full font-bold ml-2">Hoje</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-brand-light p-5 shadow-[0_4px_16px_rgba(4,52,44,0.02)] flex flex-col gap-2 relative overflow-hidden group hover:border-brand-primary transition-colors">
                  <div className="flex justify-between items-center text-brand-gray">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Ticket Médio</span>
                    <DollarSign className="w-4.5 h-4.5 text-brand-primary/60" />
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="font-mono text-xl font-bold text-brand-primary">R$ {ticketMedia.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-brand-light p-5 shadow-[0_4px_16px_rgba(4,52,44,0.02)] flex flex-col gap-2 relative overflow-hidden group hover:border-brand-primary transition-colors">
                  <div className="flex justify-between items-center text-brand-gray">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Faturamento Diário</span>
                    <TrendingUp className="w-4.5 h-4.5 text-brand-primary/60" />
                  </div>
                  <div className="flex items-baseline mt-1 relative z-10">
                    <span className="font-mono text-xl font-bold text-brand-primary">
                      R$ {totalRevenue.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {/* Subtle vector sparkline design */}
                  <div className="absolute bottom-0 inset-x-0 h-6 opacity-10 bg-gradient-to-t from-brand-primary to-transparent flex items-end">
                    <div className="w-full h-2.5 bg-brand-primary"></div>
                  </div>
                </div>
              </div>

              {/* Bento box bottom grid */}
              <div className="grid grid-cols-12 gap-6 mt-2">
                {/* Left Live Order Feed */}
                <div className="col-span-8 bg-white border border-brand-light rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                      <Clock className="w-5 h-5 text-brand-primary" />
                      Feed de Pedidos Recentes
                    </h3>
                    <button 
                      onClick={() => setActiveMenuTab('kds')}
                      className="text-xs text-brand-primary font-bold hover:underline"
                    >
                      Ver Tudo no KDS
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-brand-light text-brand-gray tracking-wider uppercase font-bold text-[10px] bg-brand-bg/60">
                          <th className="py-2.5 px-3 rounded-l-lg">ID</th>
                          <th className="py-2.5 px-3">Mesa/Canal</th>
                          <th className="py-2.5 px-3">Itens do Consumo</th>
                          <th className="py-2.5 px-3">Subtotal</th>
                          <th className="py-2.5 px-3 rounded-r-lg text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-light/30">
                        {orders.slice().reverse().map((order) => {
                          const orderVal = order.items.reduce((s, i) => s + (i.price * i.quantity), 0);
                          return (
                            <tr key={order.id} className="hover:bg-brand-bg/30">
                              <td className="py-3 px-3 font-mono font-bold text-brand-primary">{order.id}</td>
                              <td className="py-3 px-3 font-bold text-brand-dark">{order.table}</td>
                              <td className="py-3 px-3 text-brand-gray truncate max-w-[220px]">
                                {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                              </td>
                              <td className="py-3 px-3 font-mono font-semibold">R$ {orderVal.toFixed(2).replace('.', ',')}</td>
                              <td className="py-3 px-3 text-right">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                                  order.status === 'Novo' ? 'bg-red-50 text-red-700 animate-pulse border border-red-200' :
                                  order.status === 'Em Preparo' ? 'bg-brand-gold-light text-brand-gold border border-brand-gold/20' :
                                  'bg-brand-light text-brand-primary border border-brand-light/90'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Alerts & Actions panel */}
                <div className="col-span-4 flex flex-col gap-6">
                  {/* Quick Action boxes */}
                  <div className="bg-brand-primary text-white p-5 rounded-2xl shadow-md flex flex-col gap-3">
                    <h3 className="font-serif text-md font-bold">Ações Rápidas</h3>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button 
                        onClick={() => {
                          // Simulate customer ordering Caipirinhas and Rigatoni onto the orders list
                          const quickOrder: Order = {
                            id: `#${Math.floor(1000 + Math.random() * 9000)}`,
                            table: `Mesa ${Math.floor(1 + Math.random() * 30)}`,
                            timestamp: "20/05 15:20",
                            elapsedMinutes: 0,
                            items: [
                              { productName: "Chopp Artesanal", quantity: 2, price: 16.00, category: "Bebidas" },
                              { productName: "Carpaccio de Carne", quantity: 1, price: 65.00, category: "Petiscos" }
                            ],
                            status: "Novo",
                            sector: "Cozinha"
                          };
                          setOrders(prev => [...prev, quickOrder]);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors shadow-inner"
                      >
                        <Plus className="w-5 h-5 text-white" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">Novo Pedido</span>
                      </button>

                      <button 
                        onClick={() => {
                          const alert: AttentionAlert = {
                            id: `alert-${Date.now()}`,
                            type: 'warning',
                            title: `Mesa ${Math.floor(1 + Math.random() * 20)} chama garçom`,
                            description: "Solicitação recebida via QR Code.",
                            time: "Agora"
                          };
                          setAlerts(prev => [alert, ...prev]);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-colors shadow-inner"
                      >
                        <QrCode className="w-5 h-5 text-white" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">Ler Comanda</span>
                      </button>
                    </div>
                  </div>

                  {/* Attention Alerts List */}
                  <div className="bg-white border border-brand-light rounded-2xl p-5 shadow-sm">
                    <h3 className="font-serif text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-brand-gold animate-bounce" />
                      Atenção Necessária
                    </h3>

                    <ul className="flex flex-col gap-3">
                      {alerts.map((al) => (
                        <li key={al.id} className="flex gap-2.5 items-start p-3 bg-brand-light/30 border border-brand-light rounded-xl group relative">
                          <button 
                            onClick={() => setAlerts(p => p.filter(alertItem => alertItem.id !== al.id))}
                            className="absolute top-2 right-2 text-brand-gray/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${al.type === 'warning' ? 'bg-brand-gold animate-pulse' : 'bg-red-500'}`}></span>
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-brand-dark">{al.title}</p>
                            <p className="text-brand-gray mt-0.5 leading-normal">{al.description}</p>
                            {al.time && <span className="text-[9px] font-mono font-medium text-brand-gray/70 mt-1 block">{al.time}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================== TELA 2: Pedidos ao Vivo (KDS) ================== */}
          {activeMenuTab === 'kds' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Filter controls bar */}
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-brand-light shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest px-2">Setores KDS:</span>
                  {(['Todos', 'Cozinha', 'Bar'] as const).map(set => (
                    <button
                      key={set}
                      onClick={() => setKdsSectorFilter(set)}
                      className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                        kdsSectorFilter === set 
                          ? 'bg-brand-primary text-white shadow-sm' 
                          : 'text-brand-gray hover:bg-brand-light hover:text-brand-dark'
                      }`}
                    >
                      {set}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-brand-gray font-mono pr-2">
                  Monitorando <span className="font-bold text-brand-primary">{orders.filter(filterKDSOrders).length}</span> pedidos ativos
                </p>
              </div>

              {/* KDS order cards list */}
              {orders.filter(filterKDSOrders).length === 0 ? (
                <div className="bg-white border border-brand-light rounded-2xl p-16 text-center flex flex-col items-center gap-4 justify-center">
                  <div className="w-14 h-14 rounded-full bg-brand-light/50 flex justify-center items-center">
                    <Check className="w-7 h-7 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-dark">KDS Limpo!</h3>
                    <p className="text-xs text-brand-gray mt-1">Todos os pedidos foram preparados, entregues ou estão vazios.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {orders.filter(filterKDSOrders).map((order) => {
                    const isDelayed = order.warningTime || order.elapsedMinutes > 15;
                    return (
                      <article 
                        key={order.id}
                        className={`bg-white rounded-2xl shadow-md border overflow-hidden flex flex-col transition-all ${
                          isDelayed ? 'border-2 border-brand-gold shadow-[0_4px_16px_rgba(186,117,23,0.1)]' : 'border-brand-light'
                        }`}
                      >
                        {/* Card Header */}
                        <div className={`p-4 border-b flex justify-between items-start ${isDelayed ? 'bg-brand-gold-light text-brand-gold' : 'bg-brand-bg/40 border-brand-light'}`}>
                          <div>
                            <span className="text-[10px] font-bold tracking-wider uppercase block">Mesa</span>
                            <h4 className="font-serif text-xl font-bold leading-tight">{order.table}</h4>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-xs text-brand-gray">ID {order.id}</span>
                            <div className={`mt-2 flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-mono text-xs font-bold ${
                              isDelayed ? 'bg-brand-gold text-white animate-pulse' : 'bg-brand-light text-brand-dark'
                            }`}>
                              <Clock className="w-3.5 h-3.5" />
                              {order.elapsedMinutes}m
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 flex-grow flex flex-col gap-3 text-xs leading-relaxed">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <span className="w-5 h-5 rounded-md bg-brand-light text-brand-dark font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                                {item.quantity}
                              </span>
                              <div className="flex-1">
                                <p className="font-bold text-brand-dark font-sans">{item.productName}</p>
                                {item.notes && (
                                  <p className={`text-[10px] italic mt-0.5 font-medium ${isDelayed ? 'text-brand-gold font-bold' : 'text-brand-gray'}`}>
                                    Obs: "{item.notes}"
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Card Actions */}
                        <footer className="p-3 bg-brand-bg/25 border-t border-brand-light flex gap-2">
                          <button 
                            className="bg-brand-light/50 hover:bg-brand-light text-brand-dark p-2 rounded-xl transition-colors font-bold text-xs flex items-center justify-center gap-1 flex-1"
                            onClick={() => alert(`Enviando layout para impressora térmica da copa: Pedido ${order.id}`)}
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cupom
                          </button>
                          
                          {order.status === 'Novo' && (
                            <button
                              onClick={() => handleStartOrder(order.id)}
                              className="bg-brand-primary hover:bg-brand-medium text-white px-4 py-2 rounded-xl transition-colors font-bold text-xs flex-1 text-center"
                            >
                              Iniciar
                            </button>
                          )}

                          {order.status === 'Em Preparo' && (
                            <button
                              onClick={() => handleFinishOrder(order.id)}
                              className="bg-brand-gold hover:bg-brand-gold/90 text-white px-4 py-2 rounded-xl transition-colors font-bold text-xs flex-1 text-center"
                            >
                              Pronto
                            </button>
                          )}

                          {order.status === 'Pronto' && (
                            <button
                              onClick={() => handleDeliverOrder(order.id)}
                              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors font-bold text-xs flex-1 text-center"
                            >
                              Concluir
                            </button>
                          )}
                        </footer>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================== TELA 3: Gestão de Cardápio ================== */}
          {activeMenuTab === 'menu' && (
            <div className="flex flex-col gap-6 animate-fade-in relative">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
                {/* Search query input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Filtrar produtos por nome..." 
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    className="w-full bg-white hover:border-brand-primary border border-brand-light px-9 py-2 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-primary"
                  />
                </div>

                {/* Category select filter */}
                <div className="relative min-w-44 select-none">
                  <Filter className="w-3.5 h-3.5 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select 
                    value={menuCategoryFilter}
                    onChange={(e) => setMenuCategoryFilter(e.target.value)}
                    className="w-full bg-white hover:border-brand-primary border border-brand-light pl-8 pr-6 py-2 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-primary appearance-none cursor-pointer"
                  >
                    <option value="all">Filtro: Categorias</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Pratos">PratosPrincipais</option>
                    <option value="Petiscos">Petiscos</option>
                    <option value="Sobremesas">Sobremesas</option>
                  </select>
                </div>

                <button 
                  onClick={() => setIsAddPanelOpen(true)}
                  className="bg-brand-primary hover:bg-brand-medium text-white px-5 py-2 rounded-xl transition-transform hover:scale-[1.01] font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Novo Produto
                </button>
              </div>

              {/* Products Grid Table */}
              <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden mt-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-bg/65 border-b border-brand-light text-brand-gray tracking-wider uppercase font-bold text-[10px]">
                        <th className="py-3 px-5 text-center w-20">Foto</th>
                        <th className="py-3 px-4">Nome do Gastro-Item</th>
                        <th className="py-3 px-4">Categoria</th>
                        <th className="py-3 px-4 text-right">Preço Un.</th>
                        <th className="py-3 px-4 text-center w-28">Exibir no Cardápio</th>
                        <th className="py-3 px-5 text-right w-24">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-light/30">
                      {filteredProducts.map((p) => (
                        <tr 
                          key={p.id} 
                          className={`hover:bg-brand-bg/25 transition-colors ${!p.active ? 'bg-brand-light/10 text-brand-gray/50' : ''}`}
                        >
                          <td className="py-2.5 px-5">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className={`w-10 h-10 object-cover rounded-lg border border-brand-light shadow-inner ${!p.active ? 'grayscale-[60%] opacity-50' : ''}`}
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-brand-dark block text-xs">{p.name}</span>
                            <span className="text-[10px] text-brand-gray/70 truncate block max-w-sm mt-0.5">{p.description}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                              !p.active ? 'bg-transparent border border-brand-light text-brand-gray/50' :
                              p.category === 'Bebidas' ? 'bg-brand-menta/25 text-brand-dark' :
                              p.category === 'Pratos' ? 'bg-brand-gold-light text-brand-gold' :
                              'bg-brand-light text-brand-primary'
                            }`}>
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold">R$ {p.price.toFixed(2).replace('.', ',')}</td>
                          <td className="py-3 px-4 text-center">
                            {/* Toggle switcher */}
                            <button
                              onClick={() => handleToggleProductActive(p.id)}
                              className={`h-5 w-10 rounded-full relative transition-colors bg-brand-light ${
                                p.active ? 'bg-brand-primary' : 'bg-brand-gray/30'
                              }`}
                            >
                              <span className={`absolute top-[2.5px] w-3.5 h-3.5 rounded-full bg-white transition-all ${
                                p.active ? 'right-1' : 'left-1'
                              }`}></span>
                            </button>
                          </td>
                          <td className="py-3 px-5 text-right font-bold">
                            <button 
                              onClick={() => setProducts(prev => prev.filter(item => item.id !== p.id))}
                              className="p-1 px-2 hover:bg-red-50 text-brand-gray hover:text-red-500 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SIDE DRAWER SIDE OVER PANEL FOR ADDING PRODUCT */}
              {isAddPanelOpen && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-brand-light z-50 p-6 flex flex-col gap-6 animate-slide-left">
                  <header className="flex justify-between items-center pb-3 border-b border-brand-light">
                    <h3 className="font-serif text-md font-bold text-brand-dark">Adicionar Produto</h3>
                    <button 
                      onClick={() => setIsAddPanelOpen(false)}
                      className="p-1 text-brand-gray hover:text-brand-dark rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </header>

                  <form onSubmit={handleAddProductSubmit} className="flex-1 flex flex-col justify-between text-xs font-medium">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1">Nome do Item</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Ceviche de Robalo" 
                          required
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          className="w-full bg-brand-bg border border-brand-light rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
                        />
                      </div>

                      <div>
                        <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1">Descrição Curta</label>
                        <textarea 
                          placeholder="Massa fresca ao dente e frutos do mar frescos" 
                          rows={2}
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          className="w-full bg-brand-bg border border-brand-light rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1">Preço (R$)</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            placeholder="35,00" 
                            required
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-light rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1">Categoria</label>
                          <select 
                            value={newProdCategory}
                            onChange={(e) => setNewProdCategory(e.target.value as CategoryType)}
                            className="w-full bg-brand-bg border border-brand-light rounded-lg py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 cursor-pointer"
                          >
                            <option value="Bebidas">Bebidas</option>
                            <option value="Pratos">Pratos</option>
                            <option value="Petiscos">Petiscos</option>
                            <option value="Sobremesas">Sobremesas</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1.5">Escolher Imagem Preset</label>
                        <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-brand-bg rounded-lg border border-brand-light">
                          {presetFoodImages.map((img, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setNewProdImage(img.url)}
                              className={`aspect-square rounded-md overflow-hidden relative border ${
                                newProdImage === img.url ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-transparent'
                              }`}
                              title={img.label}
                            >
                              <img src={img.url} alt={img.label} className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-medium text-white py-3 rounded-xl font-bold tracking-wide shadow-md uppercase text-center mt-6 transition-colors"
                    >
                      Cadastrar Produto
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ================== TELA 4: Relatórios ================== */}
          {activeMenuTab === 'reports' && (
            <div className="flex flex-col gap-6 max-w-5xl animate-fade-in">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-4 border border-brand-light shadow-sm text-center">
                  <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Taxa de Recompra</span>
                  <p className="font-serif text-xl font-bold text-brand-primary mt-1.5">28,5%</p>
                  <p className="text-[10px] text-brand-gray/60 mt-0.5">+2.4% no mês</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-brand-light shadow-sm text-center">
                  <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Tempo de KDS Médio</span>
                  <p className="font-serif text-xl font-bold text-brand-primary mt-1.5">14,2 min</p>
                  <p className="text-[10px] text-brand-gray/60 mt-0.5">Meta: abaixo de 15m</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-brand-light shadow-sm text-center">
                  <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Pedidos Cancelados</span>
                  <p className="font-serif text-xl font-bold text-brand-dark mt-1.5">2 pedidos</p>
                  <p className="text-[10px] text-brand-gray/60 mt-0.5">Taxa de cancelamento: &lt;1%</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6 mt-2">
                {/* Simulated Revenue History Area chart */}
                <div className="col-span-8 bg-white border border-brand-light rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-md font-bold text-brand-dark mb-4">Volume de Faturamento (Histórico 7 Dias)</h3>
                  
                  {/* Styled CSS vector area graph representation */}
                  <div className="h-60 relative flex flex-col justify-end border-b border-l border-brand-light/80 p-4">
                    {/* Simulated points & tooltip bubble */}
                    <div className="absolute top-10 right-28 bg-brand-dark text-white text-[10px] p-2.5 rounded-xl shadow-md z-10 animate-fade-in flex flex-col">
                      <span className="font-bold">Sábado</span>
                      <span className="font-mono mt-0.5 text-brand-menta">R$ 9.200,00</span>
                    </div>

                    <div className="absolute inset-0 p-4">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M 0,70 L 16,60 L 32,65 L 48,50 L 64,20 L 80,10 L 100,25" fill="none" stroke="#1A6B4A" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 0,70 L 16,60 L 32,65 L 48,50 L 64,20 L 80,10 L 100,25 L 100,100 L 0,100 Z" fill="rgba(26, 107, 74, 0.08)" />
                      </svg>
                    </div>

                    {/* X Axis Labels */}
                    <div className="flex justify-between font-mono text-[10px] text-brand-gray w-full mt-4">
                      <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                    </div>
                  </div>
                </div>

                {/* Best Sellers */}
                <div className="col-span-4 bg-white border border-brand-light rounded-2xl p-5 shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-brand-dark mb-5">Mais Vendidos do Período</h3>
                  
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between items-baseline text-xs mb-1">
                        <span className="font-bold text-brand-dark">Risoto de Frutos</span>
                        <span className="font-mono text-brand-gray font-semibold">42 un.</span>
                      </div>
                      <div className="w-full bg-brand-light rounded-full h-2">
                        <div className="bg-brand-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline text-xs mb-1">
                        <span className="font-bold text-brand-dark">Ceviche Clássico</span>
                        <span className="font-mono text-brand-gray font-semibold">38 un.</span>
                      </div>
                      <div className="w-full bg-brand-light rounded-full h-2">
                        <div className="bg-brand-primary/80 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline text-xs mb-1">
                        <span className="font-bold text-brand-dark">Moqueca Baiana</span>
                        <span className="font-mono text-brand-gray font-semibold">29 un.</span>
                      </div>
                      <div className="w-full bg-brand-light rounded-full h-2">
                        <div className="bg-brand-primary/60 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================== TELA 5: Configurações ================== */}
          {activeMenuTab === 'config' && (
            <div className="flex flex-col md:flex-row gap-8 max-w-5xl animate-fade-in">
              {/* Form entries */}
              <div className="flex-1 bg-white border border-brand-light rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                <h3 className="font-serif text-lg font-bold text-brand-dark pb-3 border-b border-brand-light">Informações do Restaurante</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1">Razão Comercial</label>
                    <input type="text" className="w-full bg-brand-bg rounded-lg border border-brand-light py-2 px-3 focus:outline-none" defaultValue="Quiosque Coqueiro Beach Club" />
                  </div>
                  <div>
                    <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1">Telefone Contato</label>
                    <input type="text" className="w-full bg-brand-bg rounded-lg border border-brand-light py-2 px-3 focus:outline-none font-mono" defaultValue="(48) 99884-2104" />
                  </div>
                </div>

                <div className="text-xs font-semibold">
                  <label className="block text-brand-gray uppercase tracking-widest text-[9px] font-bold mb-1">Local / Endereço completo</label>
                  <input type="text" className="w-full bg-brand-bg rounded-lg border border-brand-light py-2 px-3 focus:outline-none" defaultValue="Av. Beira Mar, Quiosque 4, Coqueiros, Florianópolis - SC" />
                </div>

                <div className="flex flex-col gap-2 text-xs font-medium mt-1">
                  <h4 className="font-bold text-brand-dark tracking-wide text-xs">Horário de Funcionamento Presencial</h4>
                  <div className="p-3 bg-brand-bg rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Segunda Feira</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold">FECHADO / FOLGA OPERACIONAL</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-brand-light/60 pt-2.5">
                      <span className="font-bold">Terça a Sexta</span>
                      <span className="font-mono text-brand-primary font-semibold">11:30 às 23:00</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-brand-light/60 pt-2.5">
                      <span className="font-bold">Sábados, Domingos & Feriados</span>
                      <span className="font-mono text-brand-primary font-semibold">12:00 às 00:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code display template on right side */}
              <div className="w-72 bg-white border border-brand-light rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-primary bg-brand-light border border-brand-primary/20 px-4 py-1 rounded-full mb-4">
                  QR Code Totem da Mesa
                </span>
                
                <h4 className="font-serif text-lg font-bold text-brand-dark mb-1">Mesa 04</h4>
                <p className="text-[11px] text-brand-gray italic font-serif">Quiosque Coqueiro</p>

                {/* Placed stylised QR code card */}
                <div className="w-40 h-40 bg-zinc-50 border border-brand-light rounded-xl flex items-center justify-center p-2.5 my-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVbKA839BdGmjTkT8aw90rAOc7sY5HQ_jNqtXsX3Do26DrCiErv6GAINN73elR0STqCxELoJxWpFxWl_XKiK1Puxj3v-1WtHp25EJDyznIvW6n_z10B5hizl4iBMOK_YRsOR8ZUUMJGuNOUmS7LB4lbcjC7eo40GpIvzTUoVJe9s7fHuGrRTU6OKUkU5vvE5XCKNz0cHQTUJtMQ253F8mIpuC47gAvAuzgnOa7wry7ESNjf8o2MiIHghCF0Lv9ko0RX-HqQFLChVU8" 
                    alt="MenuMesa QR Code Scanner Visual" 
                    className="w-full h-full object-contain grayscale font-bold shadow-md opacity-90"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <button 
                  onClick={() => alert("Baixando pacotes de totens (Mesas 1 a 40) compactados em PDF de altíssima resolução para impressão gráfica...")}
                  className="bg-brand-primary hover:bg-brand-medium text-white py-2 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Exportar Totens (.pdf)
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
