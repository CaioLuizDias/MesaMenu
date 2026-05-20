import React, { useState, useEffect } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Laptop, 
  Smartphone, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  HelpCircle,
  X,
  Palmtree,
  Maximize2,
  Tv,
  Coins,
  QrCode,
  Info,
  ChevronLeft,
  Settings,
  ChevronRight,
  Database,
  CalendarDays,
  ShoppingBag,
  Bell
} from 'lucide-react';
import { Product, Order, AttentionAlert, OrderItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_ALERTS } from './data';
import CustomerInterface from './components/CustomerInterface';
import OperatorInterface from './components/OperatorInterface';
import { 
  supabase,
  isSupabaseConfigured,
  SUPABASE_SQL_CREATION_SCRIPT,
  seedDatabaseIfEmpty,
  dbGetProducts,
  dbSaveProductsToStorage,
  dbSaveProduct,
  dbGetOrders,
  dbSaveOrdersToStorage,
  dbCreateOrder,
  dbUpdateOrder,
  dbGetAlerts,
  dbSaveAlertsToStorage,
  dbCreateAlert,
  dbDeleteAlert,
  dbGetIsOpen,
  dbSetIsOpen
} from './lib/supabase';

// Helper to format table identifiers elegantly from URL parameter
function formatTableName(id: string): string {
  if (!id) return "Mesa 04";
  const decoded = decodeURIComponent(id).trim();
  if (/^(mesa|balcão|balcao|_)/i.test(decoded)) {
    return decoded.charAt(0).toUpperCase() + decoded.slice(1).replace('_', ' ');
  }
  if (/^\d+$/.test(decoded)) {
    return `Mesa ${decoded.padStart(2, '0')}`;
  }
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Shared states loaded and synced across screens using localStorage (and Supabase)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('menumesa_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('menumesa_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [alerts, setAlerts] = useState<AttentionAlert[]>(() => {
    const saved = localStorage.getItem('menumesa_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [isEstablishmentOpen, setIsEstablishmentOpen] = useState(() => {
    const saved = localStorage.getItem('menumesa_isOpen');
    return saved ? JSON.parse(saved) : true;
  });

  const [isLoadingDb, setIsLoadingDb] = useState(isSupabaseConfigured);

  // Sync state with LocalStorage when local modifications are made (fallback)
  useEffect(() => {
    if (!supabase) {
      localStorage.setItem('menumesa_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (!supabase) {
      localStorage.setItem('menumesa_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (!supabase) {
      localStorage.setItem('menumesa_alerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  useEffect(() => {
    if (!supabase) {
      localStorage.setItem('menumesa_isOpen', JSON.stringify(isEstablishmentOpen));
    }
  }, [isEstablishmentOpen]);

  // Load all initial data from Supabase or LocalStorage
  const loadAllData = async () => {
    try {
      if (isSupabaseConfigured) {
        setIsLoadingDb(true);
        await seedDatabaseIfEmpty();
      }
      const [prodsData, ordersData, alertsData, openData] = await Promise.all([
        dbGetProducts(),
        dbGetOrders(),
        dbGetAlerts(),
        dbGetIsOpen()
      ]);
      setProducts(prodsData);
      setOrders(ordersData);
      setAlerts(alertsData);
      setIsEstablishmentOpen(openData);
    } catch (err) {
      console.error("Erro ao sincronizar dados com banco de dados:", err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Set up Supabase Realtime subscriptional replication
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('menumesa-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menumesa_orders' }, () => {
        dbGetOrders().then(setOrders);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menumesa_alerts' }, () => {
        dbGetAlerts().then(setAlerts);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menumesa_products' }, () => {
        dbGetProducts().then(setProducts);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menumesa_config' }, () => {
        dbGetIsOpen().then(setIsEstablishmentOpen);
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  // Multi-tabs localStorage sync fallback
  useEffect(() => {
    if (supabase) return;
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'menumesa_products') setProducts(JSON.parse(e.newValue));
        if (e.key === 'menumesa_orders') setOrders(JSON.parse(e.newValue));
        if (e.key === 'menumesa_alerts') setAlerts(JSON.parse(e.newValue));
        if (e.key === 'menumesa_isOpen') setIsEstablishmentOpen(JSON.parse(e.newValue));
      } catch (err) {
        console.error("Erro ao sincronizar dados de localStorage", err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // System dynamic reset
  const handleResetData = async () => {
    if (window.confirm("Deseja realmente resetar a simulação para as configurações iniciais?")) {
      if (supabase) {
        try {
          setIsLoadingDb(true);
          // Delete all records and reseed
          await supabase.from('menumesa_products').delete().neq('id', 'dummy');
          await supabase.from('menumesa_orders').delete().neq('id', 'dummy');
          await supabase.from('menumesa_alerts').delete().neq('id', 'dummy');
          await supabase.from('menumesa_config').delete().eq('key', 'isOpen');
          await seedDatabaseIfEmpty();
          await loadAllData();
          alert("Banco de dados Supabase resetado e semeado com sucesso!");
        } catch (err) {
          console.error(err);
          alert("Ocorreu um erro ao deletar/resetar dados no Supabase. Verifique se as Tabelas e as Políticas RLS estão corretas.");
        } finally {
          setIsLoadingDb(false);
        }
      } else {
        setProducts(INITIAL_PRODUCTS);
        setOrders(INITIAL_ORDERS);
        setAlerts(INITIAL_ALERTS);
        setIsEstablishmentOpen(true);
        localStorage.clear();
        alert("Simulação de localStorage resetada! Dados iniciais restaurados.");
        navigate('/');
      }
    }
  };

  // State update wrapper handlers for operator/client
  const handleSetProducts = (value: React.SetStateAction<Product[]>) => {
    setProducts(prev => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (supabase) {
        // Sync modified/added products to Supabase
        next.forEach((p: Product) => {
          const prevItem = prev.find(item => item.id === p.id);
          if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(p)) {
            dbSaveProduct(p);
          }
        });
      } else {
        dbSaveProductsToStorage(next);
      }
      return next;
    });
  };

  const handleSetOrders = (value: React.SetStateAction<Order[]>) => {
    setOrders(prev => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (supabase) {
        next.forEach((o: Order) => {
          const prevItem = prev.find(item => item.id === o.id);
          if (!prevItem) {
            dbCreateOrder(o);
          } else if (JSON.stringify(prevItem) !== JSON.stringify(o)) {
            dbUpdateOrder(o);
          }
        });
      } else {
        dbSaveOrdersToStorage(next);
      }
      return next;
    });
  };

  const handleSetAlerts = (value: React.SetStateAction<AttentionAlert[]>) => {
    setAlerts(prev => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (supabase) {
        // Deleted alerts
        prev.forEach((a: AttentionAlert) => {
          const matched = next.find(item => item.id === a.id);
          if (!matched) {
            dbDeleteAlert(a.id);
          }
        });
        // Added alerts
        next.forEach((a: AttentionAlert) => {
          const prevItem = prev.find(item => item.id === a.id);
          if (!prevItem) {
            dbCreateAlert(a);
          }
        });
      } else {
        dbSaveAlertsToStorage(next);
      }
      return next;
    });
  };

  const handleSetIsOpen = (open: boolean) => {
    setIsEstablishmentOpen(open);
    if (supabase) {
      dbSetIsOpen(open);
    } else {
      localStorage.setItem('menumesa_isOpen', JSON.stringify(open));
    }
  };

  // Real-time integration bridge: client placed an order
  const handleSubmitOrder = async (orderItems: OrderItem[], table: string) => {
    const minStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dayMonth = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const newOrder: Order = {
      id: `#${Math.floor(4100 + Math.random() * 800)}`,
      table: table,
      items: orderItems,
      timestamp: `${dayMonth} ${minStr}`,
      elapsedMinutes: 0,
      status: 'Novo',
      sector: orderItems.every(i => i.category === 'Bebidas') ? 'Bar' : 'Cozinha',
      warningTime: false
    };

    if (supabase) {
      await dbCreateOrder(newOrder);
    } else {
      setOrders(prev => {
        const updated = [...prev, newOrder];
        localStorage.setItem('menumesa_orders', JSON.stringify(updated));
        return updated;
      });
    }
    
    // Add operational attention alert
    const newAlert: AttentionAlert = {
      id: `alert-ord-${Date.now()}`,
      type: 'warning',
      title: `Novo Pedido! ${table}`,
      description: `${orderItems.map(i => `${i.quantity}x ${i.productName}`).join(', ')}`,
      time: "Agora"
    };

    if (supabase) {
      await dbCreateAlert(newAlert);
    } else {
      setAlerts(prev => {
        const updated = [newAlert, ...prev];
        localStorage.setItem('menumesa_alerts', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Real-time integration bridge: client requested closure/checkout
  const handleRequestFechamento = async (total: number, table: string) => {
    const newAlert: AttentionAlert = {
      id: `alert-close-${Date.now()}`,
      type: 'warning',
      title: `${table} solicita fechamento`,
      description: `Mesa solicitou a conta no valor de R$ ${total.toFixed(2).replace('.', ',')}`,
      time: "Agora"
    };
    
    if (supabase) {
      await dbCreateAlert(newAlert);
    } else {
      setAlerts(prev => {
        const updated = [newAlert, ...prev];
        localStorage.setItem('menumesa_alerts', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const activeOrdersCount = orders.filter(o => o.status === 'Novo' || o.status === 'Em Preparo').length;
  const activeAlertsCount = alerts.length;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-charcoal font-sans flex flex-col selection:bg-brand-primary/10">
      
      {/* Dynamic Route Rendering */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePortal 
                activeOrders={activeOrdersCount}
                activeAlerts={activeAlertsCount}
                orders={orders}
                onReset={handleResetData}
              />
            } 
          />
          <Route 
            path="/mesa/:tableId" 
            element={
              <ClientPage 
                products={products}
                onSubmitOrder={handleSubmitOrder}
                onRequestFechamento={handleRequestFechamento}
                orders={orders}
              />
            } 
          />
          <Route 
            path="/restaurante" 
            element={
              <OperatorPage 
                products={products}
                setProducts={handleSetProducts}
                orders={orders}
                setOrders={handleSetOrders}
                alerts={alerts}
                setAlerts={handleSetAlerts}
                isOpen={isEstablishmentOpen}
                setIsOpen={handleSetIsOpen}
              />
            } 
          />
          <Route 
            path="/splitscreen" 
            element={
              <SplitScreenSim 
                products={products}
                setProducts={handleSetProducts}
                orders={orders}
                setOrders={handleSetOrders}
                alerts={alerts}
                setAlerts={handleSetAlerts}
                isOpen={isEstablishmentOpen}
                setIsOpen={handleSetIsOpen}
                onSubmitOrder={handleSubmitOrder}
                onRequestFechamento={handleRequestFechamento}
              />
            } 
          />
        </Routes>
      </div>

      {/* FLOATING LIVE SESSION HUD - Always visible except on home page */}
      {location.pathname !== '/' && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-brand-dark/95 backdrop-blur-md rounded-2xl p-3 border border-brand-menta/20 shadow-[0_12px_40px_rgba(4,52,44,0.4)] flex items-center gap-3 text-white">
          <div className="flex items-center gap-1.5 border-r border-white/10 pr-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-menta opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-menta"></span>
            </span>
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Demo Live MenuMesa</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              🏠 Portal
            </Link>
            
            <Link 
              to="/restaurante" 
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                location.pathname === '/restaurante' 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white'
              }`}
            >
              📋 KDS Operador
            </Link>

            <div className="relative group">
              <button className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                📱 Mesas <span className="text-[9px] text-brand-menta">▼</span>
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-brand-dark rounded-xl shadow-xl border border-brand-menta/10 overflow-hidden transform scale-0 origin-bottom-right group-hover:scale-100 transition-all z-[1000] p-1.5 flex flex-col gap-1 text-left">
                <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest px-2 py-1 block">Simular Mesas</span>
                {['02', '03', '04', '08', '12'].map(num => (
                  <Link 
                    key={num}
                    to={`/mesa/${num}`}
                    className="w-full text-left px-2 py-1 text-xs text-white/80 hover:text-white hover:bg-brand-primary rounded transition-all block"
                  >
                    Mesa {num} (Cliente)
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/splitscreen" 
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                location.pathname === '/splitscreen' 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white'
              }`}
            >
              ⚡ Splitscreen
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================== PORTAL HOME PAGE ==========================
interface HomePortalProps {
  activeOrders: number;
  activeAlerts: number;
  orders: Order[];
  onReset: () => void;
}
function HomePortal({ activeOrders, activeAlerts, orders, onReset }: HomePortalProps) {
  const navigate = useNavigate();
  const [customTableNum, setCustomTableNum] = useState('');
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const handleCustomTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTableNum) return;
    const cleanNum = customTableNum.trim().replace(/\s+/g, '_');
    navigate(`/mesa/${cleanNum}`);
  };

  return (
    <div className="flex-1 bg-brand-bg flex flex-col overflow-y-auto">
      {/* Decorative Top header */}
      <section className="bg-brand-dark text-white pt-16 pb-20 px-6 relative overflow-hidden text-center">
        {/* Background Organic Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1A6B4A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 backdrop-blur-md flex items-center justify-center border border-brand-primary/30 shadow-2xl mb-2">
            <Palmtree className="w-9 h-9 text-brand-menta" />
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">
            Portal MenuMesa
          </h1>
          <p className="text-brand-menta font-sans text-xs uppercase tracking-widest font-bold bg-brand-primary/20 px-4 py-1.5 rounded-full border border-brand-primary/30">
            Quiosque Coqueiro • Atendimento Digital Live Demo
          </p>
          <p className="text-white/70 max-w-lg text-sm leading-relaxed mt-2">
            Explore a experiência de ponta a ponta. Simule pedidos de clientes diretamente de mesas exclusivas via link e veja-os aparecer em tempo real no KDS do restaurante.
          </p>

          <button 
            onClick={onReset}
            className="mt-4 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-white/50 hover:text-white border border-white/5 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resetar Simulação (Limpar Dados)
          </button>
        </div>
      </section>

      {/* Main Grid Simulator Area */}
      <main className="max-w-5xl mx-auto w-full px-6 -mt-10 pb-20 relative z-20 flex flex-col gap-8">
        
        {/* Statistics Live Sync Header Bar */}
        <div className="bg-white rounded-2xl border border-[#EEE] shadow-lg p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider font-bold">Pedidos Novos/Preparo</div>
              <div className="text-xl font-bold text-brand-dark font-serif">{activeOrders} ativos</div>
            </div>
          </div>
          <div className="flex items-center gap-4 border-y sm:border-y-0 sm:border-x border-gray-100 py-4 sm:py-0 sm:px-6">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider font-bold">Alertas Operacionais</div>
              <div className="text-xl font-bold text-brand-dark font-serif">{activeAlerts} alertas</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isSupabaseConfigured ? 'bg-green-100 text-green-700' : 'bg-[#E1F5EE] text-[#0A6C51]'
            }`}>
              <Database className={`w-5 h-5 ${isSupabaseConfigured ? 'animate-pulse' : 'animate-spin'}`} style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="text-[10px] text-brand-gray uppercase tracking-wider font-bold">Instância de Dados</div>
              <div className={`text-xs rounded px-2 py-0.5 font-bold inline-block mt-0.5 ${
                isSupabaseConfigured 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {isSupabaseConfigured ? 'Nuvem Supabase Ativa' : 'Tempo Real (Simulado Local)'}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Board Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card left: Admin Operator Panel */}
          <section className="bg-white rounded-3xl p-6 border border-[#EEE] shadow-md flex flex-col justify-between hover:shadow-lg transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-light px-3 py-1 rounded-full">
                  Administrativo & Cozinha
                </span>
                <Laptop className="w-6 h-6 text-brand-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mt-2 mb-3">
                Painel do Operador (Restaurante)
              </h2>
              <p className="text-sm text-brand-gray leading-relaxed mb-6">
                Gerencie o estabelecimento. Visualize e interaja com o monitor KDS (Kitchen Display System), atualize o status dos pratos, adicione/ative novos pratos no cardápio e gerencie os alertas de atendimento ou pagamentos.
              </p>
            </div>
            <Link 
              to="/restaurante"
              className="group w-full py-4 px-5 bg-brand-primary hover:bg-brand-medium text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Abrir Monitor de Pedidos / KDS</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>

          {/* Card right: Customer View */}
          <section className="bg-white rounded-3xl p-6 border border-[#EEE] shadow-md flex flex-col justify-between hover:shadow-lg transition-transform duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-gold-light px-3 py-1 rounded-full">
                  Autoatendimento Cliente
                </span>
                <Smartphone className="w-6 h-6 text-brand-gold" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mt-2 mb-3">
                Acesso do Cliente (Mesa)
              </h2>
              <p className="text-sm text-brand-gray leading-relaxed mb-4">
                Simule a experiência do cliente sentado à mesa do Quiosque Coqueiro. Escolha uma das mesas ativas abaixo ou digite um número de mesa customizado de sua escolha:
              </p>

              {/* Grid of standard tables */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {['02', '04', '08', '12'].map((tbl) => (
                  <Link 
                    key={tbl}
                    to={`/mesa/${tbl}`}
                    className="py-2.5 bg-brand-bg hover:bg-brand-light border border-[#EEE] hover:border-brand-primary/30 rounded-xl text-center text-xs font-bold text-brand-dark transition-all transform active:scale-95 flex flex-col items-center gap-0.5 shadow-sm"
                  >
                    <span className="text-[9px] text-[#9AA5A1] uppercase font-bold">Mesa</span>
                    <span className="font-serif text-sm text-brand-primary">{tbl}</span>
                  </Link>
                ))}
              </div>

              {/* Form custom table identifier */}
              <form onSubmit={handleCustomTableSubmit} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ex: Mesa 42, Balcão B5, Guardassol 15..."
                  value={customTableNum}
                  onChange={(e) => setCustomTableNum(e.target.value)}
                  className="flex-1 bg-brand-bg border border-[#DDD] hover:border-brand-primary/30 rounded-xl px-4 py-2.5 text-xs text-brand-dark placeholder:text-[#BBB]"
                />
                <button 
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-medium text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Ir
                </button>
              </form>
            </div>
          </section>

        </div>

        {/* Supabase Integration Portal Panel */}
        <section className={`rounded-3xl p-6 border transition-all ${
          isSupabaseConfigured 
            ? 'bg-green-50/40 border-green-200 text-green-900 shadow-sm' 
            : 'bg-white border-brand-light shadow-md'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isSupabaseConfigured 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isSupabaseConfigured ? 'Supabase Ativo Cloud' : 'Ambiente Local Simulado'}
                </span>
                <span className="text-[10px] text-brand-gray font-mono">
                  {isSupabaseConfigured ? 'Sincronização total em tempo real com BD!' : 'Modo Demonstrativo (Válido local)'}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold leading-tight mb-2">
                {isSupabaseConfigured 
                  ? '🔌 Seu Supabase está conectado e sincronizado!' 
                  : '🔓 Conecte seu próprio Supabase em minutos!'
                }
              </h3>
              <p className="text-brand-gray text-xs leading-relaxed max-w-2xl">
                {isSupabaseConfigured 
                  ? `O aplicativo está gravando transações, pedidos e controle de cardápio diretamente no seu projeto Supabase (${(import.meta as any).env.VITE_SUPABASE_URL}). Abra múltiplos navegadores ou o Splitscreen para assistir a replicação instantânea via WebSockets!` 
                  : 'Este applet suporta persistência real. Habilite em segundos adicionando suas credenciais do Supabase nas variáveis de ambiente ou Secrets do AI Studio para torná-lo 100% autônomo na nuvem com dados persistentes.'
                }
              </p>
            </div>
            
            <button 
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSupabaseConfigured 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm' 
                  : 'bg-brand-primary hover:bg-brand-medium text-white shadow-md'
              }`}
            >
              {showSqlGuide ? 'Ocultar Guia de Banco ✕' : 'Ver Guia Supabase SQL ⚡'}
            </button>
          </div>

          {/* Expanded SQL & Environment Variables Instruction Panel */}
          {showSqlGuide && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-5 animate-fade-in text-brand-dark">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <h4 className="font-serif text-sm font-bold text-brand-dark flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-sans flex items-center justify-center font-bold font-mono">1</span>
                    Como Configurar no Supabase:
                  </h4>
                  <ul className="text-xs text-brand-gray flex flex-col gap-2 list-decimal list-inside ml-1">
                    <li>Inscreva-se ou crie um banco em <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-bold">supabase.com</a>.</li>
                    <li>Navegue até a guia <strong>SQL Editor</strong> e crie uma nova query.</li>
                    <li>Cole o script fornecido no campo ao lado e clique em <strong>Run</strong>.</li>
                    <li>Isto criará de forma segura as tabelas de produtos, pedidos, alertas e configurações, habilitando também as notificações em tempo real.</li>
                  </ul>

                  <h4 className="font-serif text-sm font-bold text-brand-dark flex items-center gap-1.5 mt-2">
                    <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-sans flex items-center justify-center font-bold font-mono">2</span>
                    Adicionar as credenciais nos Secrets:
                  </h4>
                  <p className="text-xs text-brand-gray leading-relaxed pl-1.5">
                    No painel lateral de <strong>Secrets</strong> do AI Studio, adicione as seguintes chaves com as credenciais obtidas nas configurações do seu projeto Supabase:
                  </p>
                  <div className="bg-brand-bg border border-brand-light rounded-xl p-3 flex flex-col gap-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center bg-white p-1.5 px-2.5 rounded border border-gray-150">
                      <span className="font-bold text-brand-primary">VITE_SUPABASE_URL</span>
                      <span className="text-gray-400">URL da API do seu projeto</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-1.5 px-2.5 rounded border border-gray-150">
                      <span className="font-bold text-brand-primary">VITE_SUPABASE_ANON_KEY</span>
                      <span className="text-gray-400">Chave pública anon</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 font-sans">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-sm font-bold text-brand-dark flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-sans flex items-center justify-center font-bold font-mono">3</span>
                      Script SQL de Configuração:
                    </h4>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_SQL_CREATION_SCRIPT);
                        alert("Script SQL copiado com sucesso!");
                      }}
                      className="px-2.5 py-1 bg-brand-light hover:bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-lg border border-brand-primary/10 transition-colors cursor-pointer"
                    >
                      Copiar SQL
                    </button>
                  </div>
                  <textarea 
                    readOnly
                    value={SUPABASE_SQL_CREATION_SCRIPT}
                    className="w-full flex-1 min-h-[220px] bg-brand-dark text-white/90 p-3 rounded-2xl font-mono text-[9px] resize-none leading-relaxed border border-white/5 shadow-inner focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Combined simulator splitscreen card */}
        <section className="bg-gradient-to-br from-[#064239] to-[#032620] text-white p-7 rounded-3xl border border-brand-menta/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <span className="inline-block text-[10px] font-extrabold uppercase bg-brand-primary text-brand-menta px-3 py-1 rounded-full mb-3 tracking-widest border border-brand-menta/20">
              Ambiente de Desenvolvimento Integrado
            </span>
            <h3 className="font-serif text-2xl font-bold leading-tight mb-2">
              Deseja testar com splitscreen lado-a-lado?
            </h3>
            <p className="text-white/70 text-xs leading-relaxed max-w-xl">
              Nós mantemos a visualização integrada clássica pra você! Ao acessar o <strong>Showcase Splitscreen</strong>, o app divide a interface: exibe o celular do cliente simulado de forma tátil à esquerda e o painel operacional de desktop à direita na mesma janela, com comunicação imediata!
            </p>
          </div>
          <Link 
            to="/splitscreen"
            className="bg-brand-primary hover:bg-brand-medium border border-brand-menta/30 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg transition-transform transform hover:scale-[1.02] shrink-0"
          >
            Abrir Showcase Splitscreen
          </Link>
        </section>

      </main>

      {/* Brand footer bar */}
      <footer className="mt-auto border-t border-[#DDD] bg-white py-6 text-center text-xs text-brand-gray font-medium">
        <p>© 2026 MenuMesa Premium Food-Tech - Quiosque Coqueiro 🌴. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// ========================== COMPLEMENTARY PAGE: CLIENT TABLE PAGES ==========================
interface ClientPageProps {
  products: Product[];
  onSubmitOrder: (items: OrderItem[], table: string) => void;
  onRequestFechamento: (total: number, table: string) => void;
  orders: Order[];
}
function ClientPage({ products, onSubmitOrder, onRequestFechamento, orders }: ClientPageProps) {
  const { tableId } = useParams<{ tableId: string }>();
  const normalizedTable = formatTableName(tableId || "04");

  return (
    <div className="flex-1 bg-[#F0EFEA] flex flex-col items-center justify-center p-4 relative min-h-screen">
      {/* Table Badge Header */}
      <div className="w-full max-w-md bg-brand-dark/90 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-brand-menta" />
          <div className="flex flex-col">
            <span className="text-[9px] text-[#A9C3B9] uppercase font-bold tracking-widest leading-none">QR Code Lançado</span>
            <span className="text-sm font-semibold font-serif leading-tight">{normalizedTable}</span>
          </div>
        </div>
        <Link 
          to="/" 
          className="text-xs bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1.5 rounded-xl font-bold transition-all"
        >
          Voltar ao Portal
        </Link>
      </div>

      {/* Simulator Device Frame */}
      <div className="my-2 select-none">
        <CustomerInterface 
          products={products}
          onSubmitOrder={onSubmitOrder}
          onRequestFechamento={onRequestFechamento}
          orders={orders}
          tableName={normalizedTable}
        />
      </div>

      <div className="text-center text-xs text-[#828073] mt-4 max-w-sm leading-relaxed font-medium">
        ⭐ Simule escanear o QR Code de outra mesa trocando o parâmetro no URL ou clicando em <strong>Mesas</strong> no HUD flutuante!
      </div>
    </div>
  );
}

// ========================== COMPLEMENTARY PAGE: OPERATOR PAGE ==========================
interface OperatorPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  alerts: AttentionAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<AttentionAlert[]>>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
function OperatorPage({ 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  alerts, 
  setAlerts, 
  isOpen, 
  setIsOpen 
}: OperatorPageProps) {
  return (
    <div className="flex-grow flex flex-col bg-brand-bg md:h-screen overflow-hidden">
      {/* Elegant minimalist path tracker bar */}
      <div className="bg-brand-dark text-white px-6 py-2 flex items-center justify-between text-xs font-bold border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Laptop className="w-4 h-4 text-brand-menta" />
          <span>PAINEL ADMINISTRATIVO KDS</span>
        </div>
        <Link 
          to="/" 
          className="hover:text-brand-menta transition-colors"
        >
          Voltar ao Menu Portal 🏠
        </Link>
      </div>
      <div className="flex-1 overflow-hidden">
        <OperatorInterface 
          products={products}
          setProducts={setProducts}
          orders={orders}
          setOrders={setOrders}
          alerts={alerts}
          setAlerts={setAlerts}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
}

// ========================== COMPLEMENTARY PAGE: SPLIT SCREEN INTEGRATOR ==========================
interface SplitScreenSimProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  alerts: AttentionAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<AttentionAlert[]>>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmitOrder: (items: OrderItem[], table: string) => void;
  onRequestFechamento: (total: number, table: string) => void;
}
function SplitScreenSim({
  products,
  setProducts,
  orders,
  setOrders,
  alerts,
  setAlerts,
  isOpen,
  setIsOpen,
  onSubmitOrder,
  onRequestFechamento
}: SplitScreenSimProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Splitscreen top controls */}
      <header className="bg-brand-dark border-b border-[#E1F5EE]/10 flex items-center justify-between px-6 py-2.5 shrink-0 text-white shadow-lg sticky top-0 z-[1000] text-xs">
        <div className="flex items-center gap-2">
          <Palmtree className="w-4.5 h-4.5 text-brand-menta" />
          <span className="font-serif text-sm font-semibold">Simulador de Showcase Integrado</span>
          <span className="text-[9px] bg-brand-primary text-brand-menta font-mono font-bold px-2 py-0.5 rounded tracking-wide leading-none uppercase">Splitscreen ativo</span>
        </div>
        
        <Link 
          to="/" 
          className="text-xs font-bold text-white/50 hover:text-white"
        >
          Sair do Showcase ✕
        </Link>
      </header>

      {/* Screens layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left column cell: Smartphone client (fixed to Mesa 04 for showcase comfort) */}
        <div className="lg:w-[440px] bg-gradient-to-br from-[#E2DFD5] to-[#CAC7B8] flex items-center justify-center p-4 border-r border-[#BBB8A9] relative overflow-hidden shrink-0">
          <div className="absolute top-2 left-4 text-[10px] font-bold text-[#848275] uppercase tracking-wider flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            Mesa 04 (Ambiente do Cliente)
          </div>
          <CustomerInterface 
            products={products}
            onSubmitOrder={onSubmitOrder}
            onRequestFechamento={onRequestFechamento}
            orders={orders}
            tableName="Mesa 04"
          />
        </div>

        {/* Right column cell: Operator */}
        <div className="flex-1 bg-brand-bg relative overflow-hidden">
          <OperatorInterface 
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            alerts={alerts}
            setAlerts={setAlerts}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
