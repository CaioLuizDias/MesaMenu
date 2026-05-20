import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, AttentionAlert } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_ALERTS } from '../data';

// Retrieve variables safely
export const SUPABASE_URL = ((import.meta as any).env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_ANON_KEY = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

export let supabase: SupabaseClient | null = null;

try {
  if (isSupabaseConfigured) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.error("Erro ao inicializar cliente Supabase: ", err);
}

// SQL Script to copy-paste into Supabase SQL Editor
export const SUPABASE_SQL_CREATION_SCRIPT = `-- ==========================================
-- SCRIPT DE INICIALIZAÇÃO MENUMESA (SUPABASE)
-- ==========================================
-- Cole este script no "SQL Editor" do seu painel do Supabase.

-- 1. Tabela de Produtos (Cardápio)
CREATE TABLE IF NOT EXISTS public.menumesa_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar RLS e Políticas Públicas para Leitura/Escrita Simplificada
ALTER TABLE public.menumesa_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso público irrestrito a produtos" ON public.menumesa_products FOR ALL USING (true) WITH CHECK (true);

-- 2. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.menumesa_orders (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  items JSONB NOT NULL,
  timestamp TEXT NOT NULL,
  elapsed_minutes INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Novo',
  sector TEXT NOT NULL DEFAULT 'Cozinha',
  warning_time BOOLEAN NOT NULL DEFAULT false,
  client_demorada_message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.menumesa_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso público irrestrito a pedidos" ON public.menumesa_orders FOR ALL USING (true) WITH CHECK (true);

-- 3. Tabela de Alertas de Atendimento
CREATE TABLE IF NOT EXISTS public.menumesa_alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'warning',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.menumesa_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso público irrestrito a alertas" ON public.menumesa_alerts FOR ALL USING (true) WITH CHECK (true);

-- 4. Tabela de Metadados / Configurações (ex: Estabelecimento aberto/fechado)
CREATE TABLE IF NOT EXISTS public.menumesa_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

ALTER TABLE public.menumesa_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso público irrestrito a config" ON public.menumesa_config FOR ALL USING (true) WITH CHECK (true);

-- 5. Habilitar Realtime para Pedidos e Alertas
alter publication supabase_realtime add table menumesa_orders;
alter publication supabase_realtime add table menumesa_alerts;
alter publication supabase_realtime add table menumesa_config;
alter publication supabase_realtime add table menumesa_products;
`;

// Helper: Seed data to Supabase if empty
export async function seedDatabaseIfEmpty() {
  if (!supabase) return;
  try {
    // Seed products
    const { data: existingProds } = await supabase.from('menumesa_products').select('id').limit(1);
    if (!existingProds || existingProds.length === 0) {
      const dbProds = INITIAL_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        image: p.image,
        active: p.active
      }));
      await supabase.from('menumesa_products').insert(dbProds);
    }

    // Seed orders
    const { data: existingOrders } = await supabase.from('menumesa_orders').select('id').limit(1);
    if (!existingOrders || existingOrders.length === 0) {
      const dbOrders = INITIAL_ORDERS.map(o => ({
        id: o.id,
        table_name: o.table,
        items: o.items,
        timestamp: o.timestamp,
        elapsed_minutes: o.elapsedMinutes,
        status: o.status,
        sector: o.sector,
        warning_time: !!o.warningTime,
        client_demorada_message: o.clientDemoradaMessage || null
      }));
      await supabase.from('menumesa_orders').insert(dbOrders);
    }

    // Seed alerts
    const { data: existingAlerts } = await supabase.from('menumesa_alerts').select('id').limit(1);
    if (!existingAlerts || existingAlerts.length === 0) {
      const dbAlerts = INITIAL_ALERTS.map(a => ({
        id: a.id,
        type: a.type,
        title: a.title,
        description: a.description
      }));
      await supabase.from('menumesa_alerts').insert(dbAlerts);
    }

    // Seed config
    const { data: existingConfig } = await supabase.from('menumesa_config').select('key').eq('key', 'isOpen').single();
    if (!existingConfig) {
      await supabase.from('menumesa_config').insert({ key: 'isOpen', value: { open: true } });
    }
  } catch (err) {
    console.error("Erro ao semear o banco do Supabase:", err);
  }
}

// ==========================================
// HIGH LEVEL API ACTIONS (AUTO-SWITCHING)
// ==========================================

// 1. PRODUCTS
export async function dbGetProducts(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('menumesa_products')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Erro ao ler produtos do Supabase, utilizando mock:", error);
    } else if (data) {
      return data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        category: p.category as any,
        price: Number(p.price),
        image: p.image || '',
        active: !!p.active
      }));
    }
  }

  // Local Recourse
  const saved = localStorage.getItem('menumesa_products');
  return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
}

export async function dbSaveProductsToStorage(prods: Product[]) {
  localStorage.setItem('menumesa_products', JSON.stringify(prods));
}

export async function dbSaveProduct(p: Product): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('menumesa_products').upsert({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      image: p.image,
      active: p.active
    });
    if (!error) return;
    console.error("Erro ao salvar produto no Supabase:", error);
  }
}

// 2. ORDERS
export async function dbGetOrders(): Promise<Order[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('menumesa_orders')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Erro ao ler pedidos do Supabase:", error);
    } else if (data) {
      return data.map(o => ({
        id: o.id,
        table: o.table_name,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
        timestamp: o.timestamp,
        elapsedMinutes: o.elapsed_minutes,
        status: o.status as any,
        sector: o.sector as any,
        warningTime: !!o.warning_time,
        clientDemoradaMessage: o.client_demorada_message || undefined
      }));
    }
  }

  const saved = localStorage.getItem('menumesa_orders');
  return saved ? JSON.parse(saved) : INITIAL_ORDERS;
}

export async function dbSaveOrdersToStorage(orders: Order[]) {
  localStorage.setItem('menumesa_orders', JSON.stringify(orders));
}

export async function dbCreateOrder(o: Order): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('menumesa_orders').insert({
      id: o.id,
      table_name: o.table,
      items: o.items,
      timestamp: o.timestamp,
      elapsed_minutes: o.elapsedMinutes,
      status: o.status,
      sector: o.sector,
      warning_time: !!o.warningTime,
      client_demorada_message: o.clientDemoradaMessage || null
    });
    if (!error) return;
    console.error("Erro ao criar pedido no Supabase:", error);
  }
}

export async function dbUpdateOrder(o: Order): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('menumesa_orders').update({
      table_name: o.table,
      items: o.items,
      timestamp: o.timestamp,
      elapsed_minutes: o.elapsedMinutes,
      status: o.status,
      sector: o.sector,
      warning_time: !!o.warningTime,
      client_demorada_message: o.clientDemoradaMessage || null
    }).eq('id', o.id);
    if (!error) return;
    console.error("Erro ao atualizar pedido no Supabase:", error);
  }
}

// 3. ALERTS
export async function dbGetAlerts(): Promise<AttentionAlert[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('menumesa_alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao ler alertas do Supabase:", error);
    } else if (data) {
      return data.map(a => ({
        id: a.id,
        type: a.type as any,
        title: a.title,
        description: a.description,
        time: "Agora"
      }));
    }
  }

  const saved = localStorage.getItem('menumesa_alerts');
  return saved ? JSON.parse(saved) : INITIAL_ALERTS;
}

export async function dbSaveAlertsToStorage(alerts: AttentionAlert[]) {
  localStorage.setItem('menumesa_alerts', JSON.stringify(alerts));
}

export async function dbCreateAlert(a: AttentionAlert): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('menumesa_alerts').insert({
      id: a.id,
      type: a.type,
      title: a.title,
      description: a.description
    });
    if (!error) return;
    console.error("Erro ao criar alerta no Supabase:", error);
  }
}

export async function dbDeleteAlert(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('menumesa_alerts').delete().eq('id', id);
    if (!error) return;
    console.error("Erro ao deletar alerta no Supabase:", error);
  }
}

// 4. CONFIG - ESTABLISHMENT IS OPEN
export async function dbGetIsOpen(): Promise<boolean> {
  if (supabase) {
    const { data, error } = await supabase
      .from('menumesa_config')
      .select('value')
      .eq('key', 'isOpen')
      .single();
    
    if (error) {
      console.error("Erro ao ler config do Supabase:", error);
    } else if (data && data.value) {
      return !!(data.value as any).open;
    }
  }

  const saved = localStorage.getItem('menumesa_isOpen');
  return saved ? JSON.parse(saved) : true;
}

export async function dbSetIsOpen(open: boolean): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('menumesa_config').upsert({
      key: 'isOpen',
      value: { open }
    });
    if (!error) return;
    console.error("Erro ao salvar config no Supabase:", error);
  }
}
