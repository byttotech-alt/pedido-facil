'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/actions';

interface SidebarProps {
  storeName: string;
}

export default function Sidebar({ storeName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">P</div>
        <h1 className="sidebar-title">{storeName || 'PedidoFácil'}</h1>
      </div>

      <nav className="sidebar-nav">
        <Link 
          href="/" 
          className={`sidebar-link ${pathname === '/' ? 'active' : ''}`}
        >
          📦 Pedidos
        </Link>
        <Link 
          href="/relatorio" 
          className={`sidebar-link ${pathname === '/relatorio' ? 'active' : ''}`}
        >
          📊 Financeiro / Relatórios
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link 
          href="/configuracoes" 
          className={`sidebar-link ${pathname === '/configuracoes' ? 'active' : ''}`}
        >
          ⚙️ Configurações
        </Link>
        <button 
          className="sidebar-link sidebar-link--danger" 
          onClick={() => signOut()}
        >
          🚪 Sair da Conta
        </button>
      </div>
    </aside>
  );
}
