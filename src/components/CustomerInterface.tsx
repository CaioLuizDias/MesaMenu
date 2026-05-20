import React, { useState } from 'react';
import { 
  Utensils, 
  BookOpen, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronRight, 
  X, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  User, 
  CreditCard,
  ChefHat,
  Trash2
} from 'lucide-react';
import { Product, CartItem, Order, CategoryType, OrderItem } from '../types';

interface CustomerInterfaceProps {
  products: Product[];
  onSubmitOrder: (items: OrderItem[], table: string) => void;
  onRequestFechamento: (total: number, table: string) => void;
  orders: Order[];
  tableName?: string;
}

export default function CustomerInterface({ 
  products, 
  onSubmitOrder, 
  onRequestFechamento,
  orders,
  tableName = "Mesa 04"
}: CustomerInterfaceProps) {
  // Mobile app screens: 'splash' | 'menu' | 'cart' | 'tracking' | 'account'
  const [activeTab, setActiveTab] = useState<'splash' | 'menu' | 'cart' | 'tracking' | 'account'>('splash');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Bebidas');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastSubmittedOrderId, setLastSubmittedOrderId] = useState<string | null>(null);
  const [fechamentoStatus, setFechamentoStatus] = useState<'none' | 'processing' | 'done'>('none');

  // Customer consumption cumulative totals for "Acompanhamento"
  const [historicalOrders, setHistoricalOrders] = useState<OrderItem[]>([
    { productName: "Ceviche Clássico", quantity: 1, price: 68.00, category: "Petiscos" },
    { productName: "Porção de Lula à Dorê", quantity: 1, price: 82.00, category: "Petiscos" },
    { productName: "Água Mineral com Gás", quantity: 1, price: 8.00, category: "Bebidas" }
  ]);

  const activeProducts = products.filter(p => p.active);

  // Helper to add item to menu
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, {
        id: `cart-item-${Date.now()}-${product.id}`,
        product,
        quantity: 1,
        notes: ''
      }];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, amount: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const handleUpdateNotes = (cartItemId: string, notes: string) => {
    setCart(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, notes } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendOrder = () => {
    if (cart.length === 0) return;
    
    // Convert to OrderItems
    const orderItems: OrderItem[] = cart.map(item => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      notes: item.notes,
      category: item.product.category
    }));

    // Register consumption
    setHistoricalOrders(prev => [...prev, ...orderItems]);
    
    // Submit to dashboard
    onSubmitOrder(orderItems, tableName);

    // Save cart state
    setCart([]);
    setLastSubmittedOrderId(`#${Math.floor(1000 + Math.random() * 9000)}`);
    setActiveTab('tracking');
  };

  const handleSolicitarFechamento = () => {
    setFechamentoStatus('processing');
    setTimeout(() => {
      setFechamentoStatus('done');
      onRequestFechamento(finalTotal, tableName);
    }, 1500);
  };

  // Calculations for Screen 5 Account
  const subtotalConsumo = historicalOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxaServico = subtotalConsumo * 0.1;
  const colertArtistico = 15.00;
  const finalTotal = subtotalConsumo + taxaServico + colertArtistico;

  return (
    <div className="w-full max-w-sm mx-auto h-[780px] bg-brand-bg rounded-[40px] border-[10px] border-brand-dark/90 shadow-[0_24px_50px_rgba(4,52,44,0.35)] relative overflow-hidden flex flex-col font-sans select-none my-2">
      {/* Device Top Speaker Detail */}
      <div className="absolute top-0 inset-x-0 h-6 bg-brand-dark flex justify-center items-center z-[100] rounded-b-xl">
        <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
      </div>

      <div className="flex-1 overflow-y-auto pt-6 pb-20 flex flex-col">
        {/* ================== TELA 1: Splash / Boas-vindas ================== */}
        {activeTab === 'splash' && (
          <div className="flex-1 flex flex-col justify-between items-center bg-brand-dark px-6 py-8 relative text-center">
            {/* Background Organic Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1A6B4A_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
            
            <header className="flex flex-col items-center gap-2 mt-8 z-10 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-brand-light/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg mb-2">
                <Utensils className="w-7 h-7 text-brand-menta" />
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white">MenuMesa</h1>
            </header>

            <section className="flex flex-col items-center text-center gap-4 z-10 w-full px-2">
              <span className="inline-flex items-center justify-center bg-brand-gold text-white font-mono text-sm tracking-widest font-bold px-5 py-1.5 rounded-full shadow-[0_6px_12px_rgba(186,117,23,0.3)]">
                {tableName.toUpperCase()}
              </span>
              <div className="flex flex-col gap-1 mt-4">
                <p className="text-white/60 text-sm">Bem-vindo ao</p>
                <h2 className="font-serif text-2xl font-semibold text-white leading-tight">
                  Quiosque Coqueiro 🌴
                </h2>
              </div>
            </section>

            <footer className="w-full z-10 pb-4">
              <button 
                onClick={() => setActiveTab('menu')}
                className="w-full bg-brand-primary hover:bg-brand-medium text-white font-semibold text-base py-3 rounded-2xl shadow-[0_8px_20px_rgba(26,107,74,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                id="btn-ver-cardapio"
              >
                <BookOpen className="w-5 h-5 text-white" />
                Ver Cardápio
              </button>
              <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mt-4">
                Atendimento Digital Premium
              </p>
            </footer>
          </div>
        )}

        {/* ================== TELA 2: Cardápio Digital ================== */}
        {activeTab === 'menu' && (
          <div className="flex-1 flex flex-col bg-brand-bg">
            <header className="bg-brand-dark text-white px-5 py-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-brand-menta" />
                <span className="font-serif text-lg font-bold">Quiosque Coqueiro</span>
              </div>
              <span className="text-xs font-mono bg-brand-gold/20 text-brand-gold-light border border-brand-gold/40 px-3 py-1 rounded-full font-bold">
                {tableName}
              </span>
            </header>

            {/* Horizontal Categories */}
            <nav className="overflow-x-auto hide-scrollbar px-4 py-3 bg-brand-bg flex gap-2 sticky top-[58px] z-20">
              {(['Bebidas', 'Pratos', 'Petiscos', 'Sobremesas'] as CategoryType[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all whitespace-nowrap border ${
                    selectedCategory === cat 
                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                      : 'bg-brand-light text-brand-dark border-brand-light hover:bg-brand-light/75'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Product Cards List */}
            <section className="flex-1 px-4 py-2 flex flex-col gap-4">
              {activeProducts
                .filter(p => p.category === selectedCategory)
                .map((product) => {
                  const numInCart = cart.find(ci => ci.product.id === product.id)?.quantity || 0;
                  return (
                    <article 
                      key={product.id}
                      className="bg-white rounded-2xl border border-brand-light shadow-[0_4px_12px_rgba(4,52,44,0.02)] overflow-hidden flex flex-col relative"
                    >
                      <div className="w-full h-36 bg-gray-100 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {numInCart > 0 && (
                          <span className="absolute top-2 right-2 bg-brand-gold text-white font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                            {numInCart}
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-1 flex-1">
                        <h3 className="font-serif text-md text-brand-dark font-bold leading-tight">{product.name}</h3>
                        <p className="text-xs text-brand-gray line-clamp-2 min-h-[32px]">{product.description}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-mono text-brand-primary font-bold text-sm">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            {numInCart > 0 && (
                              <button 
                                onClick={() => handleUpdateQuantity(cart.find(ci => ci.product.id === product.id)!.id, -1)}
                                className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center hover:bg-red-100 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="w-8 h-8 rounded-full bg-brand-primary hover:bg-brand-medium text-white flex items-center justify-center shadow-md transition-all active:scale-[0.95]"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </section>

            {/* Cart Floating Bottom action bar */}
            {cart.length > 0 && (
              <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-80 z-40 bg-brand-dark text-white rounded-2xl shadow-xl border border-white/10 p-3.5 flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-menta" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-brand-menta uppercase tracking-wider">
                      {cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'} no carrinho
                    </span>
                    <span className="font-mono font-bold text-sm">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('cart')}
                  className="bg-brand-primary hover:bg-brand-medium text-white text-xs font-bold px-4 py-2 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  Ver Carrinho
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================== TELA 3: Carrinho / Revisão do Pedido ================== */}
        {activeTab === 'cart' && (
          <div className="flex-1 flex flex-col bg-brand-bg px-5">
            <header className="py-4 border-b border-brand-light flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('menu')}
                className="p-1.5 hover:bg-brand-light rounded-full transition-colors text-brand-dark"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-serif text-lg font-bold text-brand-dark flex-1">Meu Pedido</h2>
            </header>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-md font-bold text-brand-dark">Carrinho vazio</h3>
                  <p className="text-xs text-brand-gray mt-1 px-4">Adicione itens deliciosos do Quiosque Coqueiro na página de cardápio.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="bg-brand-primary text-white text-xs font-bold px-6 py-2 rounded-xl"
                >
                  Voltar ao Cardápio
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between mt-4">
                {/* Cart Items List */}
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[380px] pr-1">
                  {cart.map((item) => (
                    <article 
                      key={item.id}
                      className="bg-white rounded-xl border border-brand-light p-3 flex gap-3 relative shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-20 object-cover rounded-lg shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="text-xs font-bold text-brand-dark font-sans truncate pr-1">{item.product.name}</h3>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, -item.quantity)}
                            className="text-brand-gray hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-mono text-xs font-bold text-brand-primary">
                            R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                          
                          <div className="flex items-center bg-brand-bg rounded-full border border-brand-light">
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="px-2 py-1 text-brand-dark"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold px-1.5">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="px-2 py-1 text-brand-dark"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Note Input */}
                        <div className="mt-2.5">
                          <input 
                            type="text" 
                            placeholder="Obs: sem cebola, com gelo..." 
                            value={item.notes}
                            onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                            className="w-full bg-brand-bg border-none py-1 px-2.5 rounded-lg text-xs text-brand-dark placeholder:text-brand-gray/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                  
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="text-brand-primary font-medium text-xs underline underline-offset-4 mt-1"
                  >
                    Adicionar mais itens
                  </button>
                </div>

                {/* Subtotals & Finalize */}
                <div className="border-t border-brand-light pt-4 mt-auto">
                  <div className="bg-brand-light/35 p-3.5 rounded-xl border border-brand-light flex justify-between items-center mb-4">
                    <span className="text-xs text-brand-gray font-medium">Subtotal</span>
                    <span className="font-mono text-brand-dark font-bold">
                      R$ {cartTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button 
                    onClick={handleSendOrder}
                    className="w-full bg-brand-primary hover:bg-brand-medium text-white rounded-xl py-3.5 font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 group transition-transform active:scale-[0.98]"
                  >
                    <span>Confirmar e Enviar Pedido</span>
                    <ShoppingBag className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================== TELA 4: Pedido Enviado / Acompanhamento ================== */}
        {activeTab === 'tracking' && (
          <div className="flex-1 flex flex-col bg-brand-bg px-5 justify-between">
            <header className="flex flex-col items-center text-center mt-6">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 animate-scale-in">
                <CheckCircle2 className="w-9 h-9 text-brand-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">Pedido Enviado!</h2>
              
              <div className="inline-flex items-center gap-1.5 bg-brand-gold-light text-brand-gold px-4 py-1.5 rounded-full border border-brand-gold/20 mt-3.5 shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-bold font-mono">Preparo em 15-20 min</span>
              </div>
            </header>

            {/* Timeline Tracker */}
            <section className="bg-white rounded-2xl p-5 border border-brand-light shadow-[0_4px_16px_rgba(4,52,44,0.02)] my-6 relative">
              <div className="relative flex flex-col gap-6 pl-5">
                {/* Visual Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2.5px] bg-brand-light"></div>
                {/* Active Indicator progress */}
                <div className="absolute left-[7px] top-2 h-10 w-[2.5px] bg-brand-primary"></div>

                <div className="absolute left-[2px] top-1.5 w-3 h-3 rounded-full bg-brand-primary ring-4 ring-brand-light animate-pulse"></div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-brand-primary">Em preparo</h3>
                  <p className="text-xs text-brand-gray mt-1">O chef já recebeu seu pedido e está preparando com excelência.</p>
                </div>

                <div className="absolute left-[3px] top-[74px] w-[9px] h-[9px] rounded-full border border-brand-gray/30 bg-white"></div>
                <div className="flex flex-col opacity-40">
                  <h3 className="text-sm font-bold text-brand-dark">Pronto</h3>
                </div>

                <div className="absolute left-[3px] top-[120px] w-[9px] h-[9px] rounded-full border border-brand-gray/30 bg-white"></div>
                <div className="flex flex-col opacity-40 font-mono">
                  <h3 className="text-sm font-bold text-brand-dark">Entregue</h3>
                </div>
              </div>
            </section>

            {/* Sticky Consumer actions */}
            <footer className="flex flex-col gap-2 mt-auto">
              <button 
                onClick={() => setActiveTab('menu')}
                className="w-full bg-brand-primary hover:bg-brand-medium text-white py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                Fazer Novo Pedido
              </button>
              <button 
                onClick={() => setActiveTab('account')}
                className="w-full bg-brand-light hover:bg-brand-light/75 text-brand-dark py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Ver Consumo da Mesa
              </button>
            </footer>
          </div>
        )}

        {/* ================== TELA 5: Conta / Fechamento ================== */}
        {activeTab === 'account' && (
          <div className="flex-1 flex flex-col bg-brand-bg px-5 justify-between">
            <header className="flex flex-col items-center text-center mt-4">
              <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-light border border-brand-primary/20 px-4 py-1 rounded-full mb-1">
                Atendimento Coqueiro
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">Sua Conta</h2>
              <p className="text-xs text-brand-gray">{tableName} • Aberta às 12:30</p>
            </header>

            {/* Receipt Card */}
            <section className="bg-white rounded-2xl border border-brand-light p-4 shadow-lg flex flex-col my-5 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-primary"></div>
              
              <div className="flex justify-center mb-3">
                <FileText className="w-7 h-7 text-brand-light" />
              </div>

              {/* Consumption Items with dotted leaders */}
              <div className="flex flex-col gap-2">
                {historicalOrders.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-xs">
                    <div className="flex items-baseline gap-1 min-w-0 max-w-[70%]">
                      <span className="font-mono text-brand-gray/8 w-5 text-right">{item.quantity}x</span>
                      <span className="text-brand-dark truncate">{item.productName}</span>
                    </div>
                    <div className="flex-1 border-b border-dotted border-brand-light mx-2"></div>
                    <span className="font-mono text-brand-dark font-medium">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal section */}
              <div className="border-t border-brand-light/60 border-dashed pt-3 mt-3 flex flex-col gap-1.5 text-xs text-brand-gray">
                <div className="flex justify-between items-baseline">
                  <span>Subtotal Consumo</span>
                  <span className="font-mono">R$ {subtotalConsumo.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span>Taxa de Serviço (10%)</span>
                  <span className="font-mono">R$ {taxaServico.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span>Couvert Artístico</span>
                  <span className="font-mono">R$ {colertArtistico.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Grand Total Footer */}
              <div className="border-t border-brand-primary/25 pt-3.5 mt-3.5 flex justify-between items-end">
                <span className="font-serif text-base font-bold text-brand-primary">Total Geral</span>
                <span className="font-mono text-xl font-bold text-brand-primary">
                  R$ {finalTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </section>

            {/* Checkout Action Button */}
            <footer className="flex flex-col gap-3 mt-auto">
              {fechamentoStatus === 'none' && (
                <button 
                  onClick={handleSolicitarFechamento}
                  className="w-full py-3.5 px-6 rounded-xl bg-brand-primary text-white font-bold text-xs uppercase tracking-wider relative shadow-md transition-all active:scale-[0.98] border border-brand-gold/40 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  Solicitar Fechamento
                </button>
              )}

              {fechamentoStatus === 'processing' && (
                <button 
                  disabled
                  className="w-full py-3.5 px-6 rounded-xl bg-brand-light text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-brand-light"
                >
                  <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </button>
              )}

              {fechamentoStatus === 'done' && (
                <div className="w-full py-3 px-6 rounded-xl bg-green-50 border border-green-200 text-green-800 text-center flex flex-col items-center gap-1 animate-scale-in">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Garçom Chamado!
                  </div>
                  <p className="text-[10px] text-green-600">Um atendente trará a maquininha em instantes.</p>
                </div>
              )}

              <p className="text-center text-xs text-brand-gray italic mt-1 pb-2 font-serif">
                Obrigado pela visita no Quiosque Coqueiro!
              </p>
            </footer>
          </div>
        )}
      </div>

      {/* ================== NAVIGATION BOTTOM BAR (Except splash) ================== */}
      {activeTab !== 'splash' && (
        <nav className="absolute bottom-0 inset-x-0 h-14 bg-white border-t border-brand-light z-50 flex justify-around items-center rounded-t-2xl pb-safe">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'menu' ? 'text-brand-primary' : 'text-brand-gray hover:text-brand-primary'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Cardápio</span>
          </button>

          <button 
            onClick={() => setActiveTab('tracking')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'tracking' ? 'text-brand-primary' : 'text-brand-gray hover:text-brand-primary'
            }`}
          >
            <ChefHat className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Pedidos</span>
          </button>

          <button 
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
              activeTab === 'cart' ? 'text-brand-primary' : 'text-brand-gray hover:text-brand-primary'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cart.length > 0 && (
              <span className="absolute top-1 right-5 bg-brand-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                {cartItemCount}
              </span>
            )}
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Carrinho</span>
          </button>

          <button 
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'account' ? 'text-brand-primary' : 'text-brand-gray hover:text-brand-primary'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Conta</span>
          </button>
        </nav>
      )}

      {/* Device Bottom Home Indicator detail */}
      <div className="absolute bottom-1.5 inset-x-0 h-1 bg-brand-dark flex justify-center items-center z-[100]">
        <div className="w-28 h-1 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
}
