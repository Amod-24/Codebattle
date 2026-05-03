'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const terminalRef = useRef(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const lines = [
      '> Initializing judge system...',
      '> Loading interactive problems...',
      '> Establishing secure connection...',
      '> Ready. ? to query, ! to answer.',
      '_'
    ];

    let currentLine = 0;
    const terminalEl = terminalRef.current;
    if (!terminalEl) return;

    terminalEl.innerHTML = '';

    function typeLine() {
      if (currentLine >= lines.length) return;

      const line = lines[currentLine];
      const lineEl = document.createElement('div');

      if (currentLine === lines.length - 1) {
        lineEl.className = 'terminal-cursor';
        lineEl.textContent = line;
        terminalEl.appendChild(lineEl);
        return;
      }

      terminalEl.appendChild(lineEl);

      let charIndex = 0;
      const typeChar = () => {
        if (charIndex < line.length) {
          lineEl.textContent += line.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, Math.random() * 30 + 20);
        } else {
          currentLine++;
          setTimeout(typeLine, 300);
        }
      };

      typeChar();
    }

    typeLine();
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <div className="home-page">
      <nav className="navbar">
        <Link href="/" className="navbar__logo">
          <div className="navbar__logo-icon">CB</div>
          CodeBattle
        </Link>
        <ul className="navbar__links">
          <li><Link href="/" className="active">Home</Link></li>
          <li><Link href="/problems">Problems</Link></li>
          {user && <li><Link href="/profile">Profile</Link></li>}
        </ul>

        {/* Auth section */}
        {user ? (
          <div className="navbar__user">
            <button
              id="navbar-avatar-btn"
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
                  id="navbar-logout-btn"
                  className="navbar__dropdown-item navbar__dropdown-item--danger"
                  onClick={handleLogout}
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

      <main className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Master <span>Interactive</span> Algorithms
          </h1>
          <p className="hero__subtitle">
            A new breed of competitive programming where you deduce hidden answers
            through logical queries against our judge system.
          </p>
          <div className="hero__actions">
            <Link href="/problems" className="btn btn--primary btn--lg">
              Start Solving
            </Link>
            <a href="https://github.com/Amod-24/Codebattle" target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--lg">
              View on GitHub
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="dot dot--red"></span>
              <span className="dot dot--yellow"></span>
              <span className="dot dot--green"></span>
            </div>
            <div className="terminal-body" ref={terminalRef}>
            </div>
          </div>
        </div>
      </main>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">❓</div>
          <h3>Query the System</h3>
          <p>Unlike traditional problems with fixed inputs, interact with the judge in real-time to gather information.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3>Deduce Answers</h3>
          <p>Use logic and algorithms like Binary Search to narrow down possibilities with limited queries.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant Feedback</h3>
          <p>Get immediate responses to your queries and attempts. Learn from mistakes rapidly.</p>
        </div>
      </section>
    </div>
  );
}

