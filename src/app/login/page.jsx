'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error: err } = login(form);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="auth-page">
      <nav className="navbar">
        <Link href="/" className="navbar__logo">
          <div className="navbar__logo-icon">CB</div>
          CodeBattle
        </Link>
      </nav>

      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-card__icon">⚔️</div>
            <h1 className="auth-card__title">Welcome Back</h1>
            <p className="auth-card__subtitle">Sign in to continue your journey</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="login-form">
            {error && <div className="auth-error" role="alert">{error}</div>}

            <div className="auth-field">
              <label htmlFor="login-username" className="auth-label">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                className="auth-input"
                placeholder="your_handle"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn--primary auth-btn"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="auth-link">Register here</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
