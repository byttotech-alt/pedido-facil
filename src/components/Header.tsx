'use client';

import { signOut } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface HeaderProps {
  userEmail: string;
}

export default function Header({ userEmail }: HeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      router.push('/login');
    });
  };

  const initials = userEmail
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">P</div>
        <span className="header-title">PedidoFácil</span>
      </div>

      <div className="header-right">
        <div className="header-user">
          <div className="header-user-avatar">{initials}</div>
          <span>{userEmail}</span>
        </div>
        <button
          className="btn btn-ghost"
          onClick={handleSignOut}
          disabled={isPending}
          title="Sair"
        >
          {isPending ? <span className="spinner spinner--sm" /> : '↗ Sair'}
        </button>
      </div>
    </header>
  );
}
