'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: err } = register({
      username: form.username,
      email: form.email,
      password: form.password,
    });
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
            <div className="auth-card__icon">🚀</div>
            <h1 className="auth-card__title">Join CodeBattle</h1>
            <p className="auth-card__subtitle">
              Create your account and start competing
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            id="register-form"
          >
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="reg-username" className="auth-label">
                Username
              </label>
              <input
                id="reg-username"
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
              <label htmlFor="reg-email" className="auth-label">
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password" className="auth-label">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className="auth-input"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-confirm" className="auth-label">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                name="confirm"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn--primary auth-btn"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link href="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
