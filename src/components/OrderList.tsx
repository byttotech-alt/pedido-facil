'use client';

import { useState, useTransition } from 'react';
import type { Order, OrderStatus } from '@/types/order';
import { STATUS_LABELS } from '@/types/order';
import OrderCard from './OrderCard';
import OrderModal from './OrderModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { createOrder, updateOrder, deleteOrder, updateOrderStatus } from '@/app/actions';

interface OrderListProps {
  orders: Order[];
}

type FilterType = 'todos' | OrderStatus;

export default function OrderList({ orders }: OrderListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'todos' || order.status === activeFilter;
    const matchesSearch =
      !searchQuery ||
      order.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Count by status
  const counts: Record<string, number> = {
    todos: orders.length,
    pendente: orders.filter((o) => o.status === 'pendente').length,
    em_producao: orders.filter((o) => o.status === 'em_producao').length,
    entregue: orders.filter((o) => o.status === 'entregue').length,
    pago: orders.filter((o) => o.status === 'pago').length,
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendente', label: 'Pendente' },
    { key: 'em_producao', label: 'Em Produção' },
    { key: 'entregue', label: 'Entregue' },
    { key: 'pago', label: 'Pago' },
  ];

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createOrder(formData);
      if (result?.error) {
        alert(result.error);
      } else {
        setShowModal(false);
      }
    });
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingOrder) return;
    startTransition(async () => {
      const result = await updateOrder(editingOrder.id, formData);
      if (result?.error) {
        alert(result.error);
      } else {
        setEditingOrder(null);
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingOrder) return;
    startTransition(async () => {
      const result = await deleteOrder(deletingOrder.id);
      if (result?.error) {
        alert(result.error);
      } else {
        setDeletingOrder(null);
      }
    });
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(id, status);
    });
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-filters">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn ${activeFilter === filter.key ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
              <span className="filter-count">{counts[filter.key]}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="search-orders"
              className="search-input"
              type="text"
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Novo Pedido
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2 className="empty-state-title">
            {orders.length === 0 ? 'Nenhum pedido ainda' : 'Nenhum resultado'}
          </h2>
          <p className="empty-state-text">
            {orders.length === 0
              ? 'Comece criando seu primeiro pedido para organizar suas encomendas do Instagram.'
              : 'Tente ajustar os filtros ou o termo de busca.'}
          </p>
          {orders.length === 0 && (
            <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
              + Criar Primeiro Pedido
            </button>
          )}
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              onEdit={() => setEditingOrder(order)}
              onDelete={() => setDeletingOrder(order)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <OrderModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
          isPending={isPending}
        />
      )}

      {/* Edit Modal */}
      {editingOrder && (
        <OrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSubmit={handleUpdate}
          isPending={isPending}
        />
      )}

      {/* Delete Confirm Modal */}
      {deletingOrder && (
        <DeleteConfirmModal
          orderName={deletingOrder.client_name}
          onClose={() => setDeletingOrder(null)}
          onConfirm={handleDelete}
          isPending={isPending}
        />
      )}
    </>
  );
}
