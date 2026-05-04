'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="profile-stat-card">
      <div className="profile-stat-card__icon" style={{ color }}>
        {icon}
      </div>
      <div className="profile-stat-card__value">{value}</div>
      <div className="profile-stat-card__label">{label}</div>
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  return <span className={`tag tag--${difficulty}`}>{difficulty}</span>;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ justifyContent: 'center' }}>
          <div className="profile-loading">Loading profile…</div>
        </div>
      </div>
    );
  }

  const solvedCount = user.solvedProblems.length;
  const totalAttempts = user.totalAttempts;
  const successRate =
    totalAttempts > 0 ? Math.round((solvedCount / totalAttempts) * 100) : 0;

  const initials = user.username.slice(0, 2).toUpperCase();

  // Simple rank based on solved problems
  const rank =
    solvedCount >= 50
      ? 'Grandmaster'
      : solvedCount >= 20
        ? 'Master'
        : solvedCount >= 10
          ? 'Expert'
          : solvedCount >= 5
            ? 'Specialist'
            : solvedCount >= 1
              ? 'Pupil'
              : 'Newbie';

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar__logo">
          <div className="navbar__logo-icon">CB</div>
          CodeBattle
        </Link>
        <ul className="navbar__links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/problems">Problems</Link>
          </li>
          <li>
            <Link href="/profile" className="active">
              Profile
            </Link>
          </li>
        </ul>
        <button
          id="profile-logout-btn"
          className="btn btn--outline btn--sm"
          onClick={() => {
            logout();
            router.push('/');
          }}
        >
          Logout
        </button>
      </nav>

      <main className="profile-page">
        {/* Hero Banner */}
        <div className="profile-hero">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{user.username}</h1>
            <p className="profile-hero__email">{user.email}</p>
            <div className="profile-hero__meta">
              <span className="profile-rank">{rank}</span>
              <span className="profile-join">
                Joined {formatDate(user.joinedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats">
          <StatCard
            icon="✅"
            label="Solved"
            value={solvedCount}
            color="var(--success)"
          />
          <StatCard
            icon="🎯"
            label="Attempts"
            value={totalAttempts}
            color="var(--info)"
          />
          <StatCard
            icon="📈"
            label="Success Rate"
            value={`${successRate}%`}
            color="var(--warning)"
          />
          <StatCard
            icon="🏅"
            label="Rank"
            value={rank}
            color="var(--text-accent)"
          />
        </div>

        {/* Solved Problems */}
        <section className="profile-section">
          <h2 className="profile-section__title">Problems Solved</h2>
          {solvedCount === 0 ? (
            <div className="profile-empty">
              <div className="profile-empty__icon">🧩</div>
              <p>No problems solved yet.</p>
              <Link
                href="/problems"
                className="btn btn--primary btn--sm"
                style={{ marginTop: '1rem' }}
              >
                Start Solving
              </Link>
            </div>
          ) : (
            <div className="profile-solved-list">
              {user.solvedProblems.map((p) => (
                <div key={p.id} className="profile-solved-item">
                  <div className="profile-solved-item__left">
                    <span className="profile-solved-item__check">✓</span>
                    <div>
                      <div className="profile-solved-item__title">
                        {p.title}
                      </div>
                      <div className="profile-solved-item__id">{p.id}</div>
                    </div>
                  </div>
                  <div className="profile-solved-item__right">
                    <DifficultyBadge difficulty={p.difficulty} />
                    <span className="profile-solved-item__date">
                      {formatDate(p.solvedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
