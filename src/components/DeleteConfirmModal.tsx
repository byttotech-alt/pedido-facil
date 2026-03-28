'use client';

interface DeleteConfirmModalProps {
  orderName: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteConfirmModal({
  orderName,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        style={{ maxWidth: '400px' }}
      >
        <div className="delete-modal-body">
          <div className="delete-modal-icon">⚠️</div>
          <h2 className="modal-title">Excluir Pedido</h2>
          <p className="delete-modal-text">
            Tem certeza que deseja excluir o pedido de{' '}
            <span className="delete-modal-name">{orderName}</span>?
            <br />
            <br />
            Esta ação não poderá ser desfeita.
          </p>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? <span className="spinner spinner--sm" /> : 'Excluir Definitivamente'}
          </button>
        </div>
      </div>
    </div>
  );
}
