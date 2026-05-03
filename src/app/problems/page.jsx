'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllProblems } from '../../engine/problems';
import { useAuth } from '@/context/AuthContext';

export default function ProblemsPage() {
  const problems = getAllProblems();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const solvedIds = user ? new Set(user.solvedProblems.map((p) => p.id)) : new Set();

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar__logo">
          <div className="navbar__logo-icon">CB</div>
          CodeBattle
        </Link>
        <ul className="navbar__links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/problems" className="active">Problems</Link></li>
          {user && <li><Link href="/profile">Profile</Link></li>}
        </ul>

        {user ? (
          <div className="navbar__user">
            <button
              id="problems-avatar-btn"
              className="navbar__avatar"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {user.username.slice(0, 2).toUpperCase()}
            </button>
            {dropdownOpen && (
              <div className="navbar__dropdown" role="menu">
                <div className="navbar__dropdown-header">
                  <strong>{user.username}</strong>
                  <span>{user.email}</span>
                </div>
                <Link
                  href="/profile"
                  className="navbar__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                  role="menuitem"
                >
                  👤 My Profile
                </Link>
                <button
                  id="problems-logout-btn"
                  className="navbar__dropdown-item navbar__dropdown-item--danger"
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  role="menuitem"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar__auth">
            <Link href="/login" className="btn btn--outline btn--sm">Sign In</Link>
            <Link href="/register" className="btn btn--primary btn--sm">Register</Link>
          </div>
        )}
      </nav>

      <div className="problems-page">
        <div className="problems-header">
          <h1>Problem Library</h1>
          <p>Select an interactive problem to solve. Remember, you must find the answer by querying the system!</p>
        </div>

        <div className="problems-grid">
          {problems.map((problem) => {
            const isSolved = solvedIds.has(problem.id);
            return (
              <Link href={`/problem/${problem.id}`} key={problem.id} className={`problem-card${isSolved ? ' problem-card--solved' : ''}`}>
                <div className="problem-card__header">
                  <div>
                    <span className={`tag tag--${problem.difficulty}`}>{problem.difficulty}</span>
                    {problem.tags.map(t => (
                      <span key={t} className="tag tag--interactive">{t}</span>
                    ))}
                  </div>
                  {isSolved && (
                    <span className="problem-card__solved-badge" title="Solved">✓ Solved</span>
                  )}
                </div>
                <h2 className="problem-card__title">{problem.title}</h2>
                <p className="problem-card__desc" dangerouslySetInnerHTML={{ __html: problem.statement.description }}></p>

                <div className="problem-card__meta">
                  <span>⚡ {problem.maxQueries} queries max</span>
                  <span>🎯 {problem.maxAttempts} attempts limit</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

