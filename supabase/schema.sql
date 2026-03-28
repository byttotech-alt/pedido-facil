-- ============================================
-- PedidoFácil — Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Tabela de pedidos
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  client_phone text,
  description text NOT NULL,
  value numeric(10,2) NOT NULL DEFAULT 0,
  delivery_date date NOT NULL,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_producao', 'entregue', 'pago')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios pedidos
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Usuários podem criar seus próprios pedidos
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios pedidos
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar seus próprios pedidos
CREATE POLICY "Users can delete their own orders"
ON public.orders
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Índice para melhor performance nas buscas
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_delivery_date ON public.orders(delivery_date);
