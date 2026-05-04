'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProblemById } from '../../../engine/problems';
import { createSession, processInput, getSessionStatus } from '../../../engine/judge';
import { useAuth } from '@/context/AuthContext';

export default function ProblemPage() {
  const { id } = useParams();
  const { user, logout, updateStats } = useAuth();
  const [problem, setProblem] = useState(null);
  const [session, setSession] = useState(null);
  const [consoleLines, setConsoleLines] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [hasWon, setHasWon] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const outputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const prob = getProblemById(id);
    if (prob) {
      setProblem(prob);
      initGame(prob);
    }
  }, [id]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [consoleLines]);

  const initGame = (prob) => {
    const newSession = createSession(prob);
    setSession(newSession);
    setConsoleLines([
      { type: 'system', text: 'Welcome to CodeBattle! The system has chosen a secret number.' },
      { type: 'system', text: 'Use "? N" to query and "! N" to submit your answer.' },
      { type: 'system', text: '───────────────────────────────────────' }
    ]);
    setShowResult(false);
    setInputValue('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSend = () => {
    const value = inputValue.trim();
    if (!value || !session) return;

    setConsoleLines(prev => [...prev, { type: 'query', text: `❯ ${value}` }]);
    setInputValue('');

    const result = processInput(session, value);
    // processInput mutates session, so we clone it to trigger re-renders
    setSession({ ...result.session });

    let lineType = 'response';
    if (result.type === 'success') lineType = 'success';
    else if (result.type === 'error') lineType = 'error';
    else if (result.type === 'info') lineType = 'info';

    setConsoleLines(prev => [...prev, { type: lineType, text: result.message }]);

    if (result.session.isFinished) {
      const won = result.session.won;
      setHasWon(won);
      setResultMessage(result.message);
      setShowResult(true);
      // Record stats on user profile
      if (problem) updateStats(problem, won);
    }
  };

  const clearConsole = () => {
    setConsoleLines([
      { type: 'system', text: 'Console cleared. Continue your game...' }
    ]);
    inputRef.current?.focus();
  };

  if (problem === null) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p>Loading problem...</p>
      </div>
    );
  }

  if (problem === undefined) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Problem Not Found</h1>
        <p>The requested problem does not exist.</p>
        <Link href="/problems" className="btn btn--primary">← Back to Problems</Link>
      </div>
    );
  }

  const status = session ? getSessionStatus(session) : null;
  
  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar__logo">
          <div className="navbar__logo-icon">CB</div>
          CodeBattle
        </Link>
        <ul className="navbar__links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/problems">Problems</Link></li>
          {user && <li><Link href="/profile">Profile</Link></li>}
        </ul>
        {user ? (
          <div className="navbar__user">
            <button
              id="problem-avatar-btn"
              className="navbar__avatar"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-expanded={dropdownOpen}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </button>
            {dropdownOpen && (
              <div className="navbar__dropdown" role="menu">
                <div className="navbar__dropdown-header">
                  <strong>{user.username}</strong>
                  <span>{user.email}</span>
                </div>
                <Link href="/profile" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)} role="menuitem">👤 My Profile</Link>
                <button id="problem-logout-btn" className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={() => { logout(); setDropdownOpen(false); }} role="menuitem">🚪 Logout</button>
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

      <div className="problem-page">
        {/* Left Panel */}
        <div className="problem-panel">
          <div className="problem-panel__header">
            <Link href="/problems" className="problem-panel__back">←</Link>
            <h1 className="problem-panel__title">{problem.title}</h1>
          </div>

          <div className="problem-panel__tags">
            <span className={`tag tag--${problem.difficulty}`}>{problem.difficulty}</span>
            {problem.tags.map(t => (
              <span key={t} className="tag tag--interactive">{t}</span>
            ))}
          </div>

          <div className="problem-panel__section">
            <h3>Problem Statement</h3>
            <p dangerouslySetInnerHTML={{ __html: problem.statement.description }}></p>
          </div>

          <div className="problem-panel__section">
            <h3>Interaction Format</h3>
            <ul>
              {problem.statement.interaction.map((line, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: line }}></li>
              ))}
            </ul>
          </div>

          <div className="problem-panel__section">
            <h3>Rules</h3>
            <ul>
              {problem.statement.rules.map((line, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: line }}></li>
              ))}
            </ul>
          </div>

          <div className="problem-panel__section">
            <h3>Example Interaction</h3>
            <div className="problem-panel__example">
              {problem.example.map((line, idx) => (
                <div key={idx} className={line.type === 'query' ? 'query' : line.type === 'answer' ? 'answer' : 'response'} dangerouslySetInnerHTML={{ __html: line.text }}>
                </div>
              ))}
            </div>
          </div>

          <div className="problem-panel__section">
            <h3>💡 Hint</h3>
            <p dangerouslySetInnerHTML={{ __html: problem.statement.hint }}></p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="console-panel">
          <div className="console-panel__header">
            <span className="console-panel__title">⚡ Interactive Console</span>
            {status && (
              <div className="console-panel__stats">
                <div className={`stat ${status.queriesRemaining <= 2 ? 'stat--danger' : status.queriesRemaining <= 4 ? 'stat--warning' : ''}`}>
                  <span>Queries:</span>
                  <span className="stat__value">{status.queriesUsed}/{problem.maxQueries}</span>
                </div>
                <div className={`stat ${status.attemptsRemaining <= 0 ? 'stat--danger' : status.attemptsRemaining === 1 ? 'stat--warning' : ''}`}>
                  <span>Attempts:</span>
                  <span className="stat__value">{status.currentAttempt}/{problem.maxAttempts}</span>
                </div>
              </div>
            )}
          </div>

          <div id="console-output" className="console-panel__output" ref={outputRef}>
            {consoleLines.map((line, i) => (
              <div key={i} className={`console-line console-line--${line.type}`}>
                {line.type === 'response' ? <span className="console-prefix">← </span> : null}
                <span>{line.text}</span>
              </div>
            ))}
          </div>

          <div className="console-panel__input-area">
            <div className="console-input-row">
              <label htmlFor="console-input">❯</label>
              <input
                type="text"
                id="console-input"
                className="console-input"
                placeholder='Type "? 50" to query or "! 42" to answer...'
                autoComplete="off"
                autoFocus
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={session?.isFinished}
                ref={inputRef}
              />
              <button 
                id="send-btn"
                className="btn btn--primary btn--sm" 
                onClick={handleSend}
                disabled={session?.isFinished || !inputValue.trim()}
              >
                Send
              </button>
            </div>
          </div>

          <div className="console-panel__actions">
            <button id="reset-btn" className="btn btn--outline btn--sm" onClick={() => initGame(problem)}>
              🔄 New Game
            </button>
            <button className="btn btn--outline btn--sm" onClick={clearConsole}>
              🗑️ Clear Console
            </button>
          </div>
        </div>
      </div>

      {showResult && (
        <div className="result-overlay" style={{ display: 'flex' }}>
          <div className="result-modal">
            <div className="result-modal__icon">{hasWon ? '🎉' : '💔'}</div>
            <h2 className={`result-modal__title ${hasWon ? 'result-modal__title--success' : 'result-modal__title--failure'}`}>
              {hasWon ? 'Victory!' : 'Defeated'}
            </h2>
            <p className="result-modal__message">{resultMessage}</p>
            <div className="result-modal__actions">
              <button 
                className={`btn ${hasWon ? 'btn--success' : 'btn--primary'}`} 
                onClick={() => initGame(problem)}
              >
                {hasWon ? '🔄 Play Again' : '🔄 Try Again'}
              </button>
              <Link href="/problems" className="btn btn--outline">
                📋 All Problems
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
