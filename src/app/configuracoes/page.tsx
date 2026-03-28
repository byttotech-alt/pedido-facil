import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { updateStoreName } from '@/app/actions';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const currentStoreName = user.user_metadata?.store_name || '';

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="header-title">Configurações</h1>
      </div>
      
      <div className="order-card" style={{ maxWidth: '600px', marginTop: 'var(--space-6)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-xl)' }}>Sua Loja</h2>
        
        <form action={updateStoreName}>
          <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
            <label className="form-label" htmlFor="store_name">
              Nome da Loja do SaaS
            </label>
            <input
              id="store_name"
              name="store_name"
              className="form-input"
              type="text"
              defaultValue={currentStoreName}
              placeholder="Ex: Confeitaria da Joana"
              required
            />
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              Este nome aparecerá no menu esquerdo principal e em documentos do sistema.
            </p>
          </div>
          
          <button type="submit" className="btn btn-primary">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
