import Link from 'next/link';
import { getAllProblems } from '../../engine/problems';

export default function ProblemsPage() {
  const problems = getAllProblems();

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
        </ul>
      </nav>

      <div className="problems-page">
        <div className="problems-header">
          <h1>Problem Library</h1>
          <p>Select an interactive problem to solve. Remember, you must find the answer by querying the system!</p>
        </div>

        <div className="problems-grid">
          {problems.map((problem) => (
            <Link href={`/problem/${problem.id}`} key={problem.id} className="problem-card">
              <div className="problem-card__header">
                <div>
                  <span className={`tag tag--${problem.difficulty}`}>{problem.difficulty}</span>
                  {problem.tags.map(t => (
                    <span key={t} className="tag tag--interactive">{t}</span>
                  ))}
                </div>
              </div>
              <h2 className="problem-card__title">{problem.title}</h2>
              <p className="problem-card__desc">{problem.statement.description}</p>
              
              <div className="problem-card__meta">
                <span>⚡ {problem.maxQueries} queries max</span>
                <span>🎯 {problem.maxAttempts} attempts limit</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
