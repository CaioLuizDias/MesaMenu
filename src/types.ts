export type CategoryType = 'Bebidas' | 'Pratos' | 'Petiscos' | 'Sobremesas';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  price: number;
  image: string;
  active: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  notes: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  notes?: string;
  category: CategoryType;
}

export interface Order {
  id: string; // e.g. "#4092"
  table: string; // e.g. "Mesa 12"
  items: OrderItem[];
  timestamp: string; // e.g. "15/05 14:30"
  elapsedMinutes: number;
  status: 'Novo' | 'Em Preparo' | 'Pronto' | 'Entregue';
  sector: 'Bar' | 'Cozinha';
  warningTime?: boolean; // elapsed > 15m
  clientDemoradaMessage?: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change?: string;
  subValue?: string;
  icon: string;
}

export interface AttentionAlert {
  id: string;
  type: 'warning' | 'inventory';
  title: string;
  description: string;
  time?: string;
}
