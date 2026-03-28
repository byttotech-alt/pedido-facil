export type OrderStatus = 'pendente' | 'em_producao' | 'entregue' | 'pago';
export type ProductType = 'Bolo' | 'Doce' | 'Salgado' | 'Kit Festa' | 'Outro';

export interface Order {
  id: string;
  user_id: string;
  client_name: string;
  client_phone: string | null;
  product_type: ProductType;
  description: string;
  value: number;
  delivery_date: string;
  status: OrderStatus;
  created_at: string;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: 'Pendente',
  em_producao: 'Em Produção',
  entregue: 'Entregue',
  pago: 'Pago',
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pendente: '#f59e0b',
  em_producao: '#3b82f6',
  entregue: '#10b981',
  pago: '#8b5cf6',
};
