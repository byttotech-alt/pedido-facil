'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('Conta criada. Verifique seu e-mail!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro no login com Google';
      setError(message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212', position: 'relative', overflow: 'hidden', width: '100%' }}>
      {/* Centered glass card */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '24rem', borderRadius: '1.5rem', background: 'linear-gradient(to right, rgba(255,255,255,0.06), #121212)', backdropFilter: 'blur(4px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>P</span>
        </div>
        
        {/* Title */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>
          PedidoFácil
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              placeholder="E-mail"
              type="email"
              value={email}
              style={{ width: '100%', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '0.875rem', outline: 'none', border: '1px solid transparent', transition: 'border-color 0.2s' }}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Senha"
              type="password"
              value={password}
              style={{ width: '100%', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '0.875rem', outline: 'none', border: '1px solid transparent', transition: 'border-color 0.2s' }}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            
            {error && (
              <div style={{ fontSize: '0.875rem', color: '#f87171', textAlign: 'left' }}>{error}</div>
            )}
            {success && (
              <div style={{ fontSize: '0.875rem', color: '#34d399', textAlign: 'left' }}>{success}</div>
            )}
          </div>

          <hr style={{ opacity: 0.1, margin: '0.5rem 0', borderColor: '#ffffff' }} />

          <div>
            <button
              disabled={loading}
              type="submit"
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 500, padding: '0.75rem 1.25rem', borderRadius: '9999px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', cursor: loading ? 'not-allowed' : 'pointer', border: 'none', transition: 'background-color 0.2s', fontSize: '0.875rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Entrar'}
            </button>

            {/* Google Sign In */}
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(to bottom, #232526, #2d2e30)', color: '#ffffff', fontWeight: 500, padding: '0.75rem 1.25rem', borderRadius: '9999px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', cursor: 'pointer', border: 'none', transition: 'filter 0.2s', fontSize: '0.875rem', marginTop: '0.5rem' }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                style={{ width: '1.25rem', height: '1.25rem', display: 'inline-block' }}
              />
              Entrar com Google
            </button>

            <div style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {isSignUp ? 'Já tem conta? ' : 'Não tem conta? '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignUp(!isSignUp);
                    setError('');
                    setSuccess('');
                  }}
                  style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                >
                  {isSignUp ? 'Faça login' : 'Crie agora'}
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
