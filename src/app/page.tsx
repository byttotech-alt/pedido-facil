import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import OrderList from '@/components/OrderList';
import type { Order } from '@/types/order';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Busca todos os pedidos do usuário, ordenados pelos mais próximos da entrega (data e status)
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('status', { ascending: true }) // pendente -> em producao -> entregue -> pago (alfabetico aproxima isso com sorte, mas ideal é data)
    .order('delivery_date', { ascending: true })
    .returns<Order[]>();

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
  }

  // Ordenação manual de status p/ melhorar o visual: Pendente -> Em Prod -> Entregue -> Pago
  const statusOrder = { pendente: 1, em_producao: 2, entregue: 3, pago: 4 };
  const sortedOrders = (orders || []).sort((a, b) => {
    if (a.status !== b.status) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime();
  });

  return (
    <div className="page-container">
      <Header userEmail={user.email!} />
      
      <main>
        <OrderList orders={sortedOrders} />
      </main>
    </div>
  );
}
