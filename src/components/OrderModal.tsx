'use client';

import { useState, useEffect } from 'react';
import type { Order, OrderStatus, ProductType } from '@/types/order';

interface OrderModalProps {
  order?: Order;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

export default function OrderModal({ order, onClose, onSubmit, isPending }: OrderModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [productType, setProductType] = useState<ProductType>('Bolo');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [status, setStatus] = useState<OrderStatus>('pendente');

  useEffect(() => {
    if (order) {
      setClientName(order.client_name);
      setClientPhone(order.client_phone || '');
      setProductType(order.product_type || 'Bolo');
      setDescription(order.description);
      setValue(order.value.toString());
      setDeliveryDate(order.delivery_date);
      setStatus(order.status);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('client_name', clientName);
    formData.append('client_phone', clientPhone);
    formData.append('product_type', productType);
    formData.append('description', description);
    formData.append('value', value);
    formData.append('delivery_date', deliveryDate);
    formData.append('status', status);

    onSubmit(formData);
  };

  const handlePhoneMask = (val: string) => {
    let unmasked = val.replace(/\D/g, '');
    if (unmasked.length > 11) unmasked = unmasked.substring(0, 11);
    
    // Mask logic
    if (unmasked.length <= 2) {
      return unmasked;
    }
    if (unmasked.length <= 6) {
      return `(${unmasked.substring(0, 2)}) ${unmasked.substring(2)}`;
    }
    if (unmasked.length <= 10) {
      return `(${unmasked.substring(0, 2)}) ${unmasked.substring(2, 6)}-${unmasked.substring(6)}`;
    }
    return `(${unmasked.substring(0, 2)}) ${unmasked.substring(2, 7)}-${unmasked.substring(7)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {order ? 'Editar Pedido' : 'Novo Pedido'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="client-name">
                Nome do Cliente *
              </label>
              <input
                id="client-name"
                className="form-input"
                type="text"
                placeholder="Ex: Maria Alice"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="client-phone">
                  WhatsApp do Cliente
                </label>
                <input
                  id="client-phone"
                  className="form-input"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={handlePhoneMask(clientPhone)}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-type">
                  Tipo *
                </label>
                <select
                  id="product-type"
                  className="form-select"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as ProductType)}
                  required
                >
                  <option value="Bolo">Bolo</option>
                  <option value="Doce">Docinhos</option>
                  <option value="Salgado">Salgado</option>
                  <option value="Kit Festa">Kit Festa</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Descrição do Pedido *
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Ex: Bolo de chocolate 2kg com morangos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="value">
                  Valor (R$) *
                </label>
                <input
                  id="value"
                  className="form-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="delivery-date">
                  Data de Entrega *
                </label>
                <input
                  id="delivery-date"
                  className="form-input"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {order && (
              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_producao">Em Produção</option>
                  <option value="entregue">Entregue</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <span className="spinner spinner--sm" />
              ) : (
                order ? 'Salvar Edição' : 'Criar Pedido'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
