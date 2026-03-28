'use client';

import type { Order, OrderStatus } from '@/types/order';
import { STATUS_LABELS } from '@/types/order';

interface OrderCardProps {
  order: Order;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

export default function OrderCard({
  order,
  index,
  onEdit,
  onDelete,
  onStatusChange,
}: OrderCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deliveryDate = new Date(order.delivery_date + 'T00:00:00');
  const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = diffDays <= 2 && diffDays >= 0 && order.status !== 'entregue' && order.status !== 'pago';
  const isOverdue = diffDays < 0 && order.status !== 'entregue' && order.status !== 'pago';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getDeliveryLabel = () => {
    if (isOverdue) return `Atrasado ${Math.abs(diffDays)} dia(s)`;
    if (diffDays === 0) return 'Hoje!';
    if (diffDays === 1) return 'Amanhã';
    return formatDate(order.delivery_date);
  };

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const getWhatsAppLink = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    const withCountry = digits.startsWith('55') ? digits : `55${digits}`;
    return `https://wa.me/${withCountry}`;
  };

  return (
    <div
      className={`order-card order-card--${order.status} ${isUrgent || isOverdue ? 'order-card--urgent' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="order-card-header">
        <div>
          <div className="order-card-client">{order.client_name}</div>
          {order.client_phone && (
            <div className="order-card-phone">
              📱{' '}
              <a
                href={getWhatsAppLink(order.client_phone)}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir no WhatsApp"
              >
                {formatPhone(order.client_phone)}
              </a>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {(isUrgent || isOverdue) && (
            <span className="urgent-badge">⚠️ Urgente</span>
          )}
          <span className={`status-badge status-badge--${order.status}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      <div className="order-card-description">{order.description}</div>

      <div className="order-card-details">
        <span className="order-card-value">{formatValue(order.value)}</span>
        <span
          className={`order-card-date ${isUrgent || isOverdue ? 'order-card-date--urgent' : ''}`}
        >
          📅 {getDeliveryLabel()}
        </span>
      </div>

      <div className="order-card-footer">
        <select
          className="order-card-status-select"
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
          title="Alterar status"
        >
          <option value="pendente">Pendente</option>
          <option value="em_producao">Em Produção</option>
          <option value="entregue">Entregue</option>
          <option value="pago">Pago</option>
        </select>

        <div className="order-card-actions">
          <button className="btn btn-ghost btn-icon" onClick={onEdit} title="Editar pedido">
            ✏️
          </button>
          <button className="btn btn-ghost btn-icon" onClick={onDelete} title="Excluir pedido">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
