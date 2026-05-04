'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  findUser,
  findUserByEmail,
  createUser,
  updateUser,
  getSession,
  saveSession,
  clearSession,
} from '@/lib/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session on mount
  useEffect(() => {
    const sessionUser = getSession();
    setUser(sessionUser);
    setLoading(false);
  }, []);

  /**
   * Register a new user.
   * @returns {{ error: string|null }}
   */
  const register = useCallback(({ username, email, password }) => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      return { error: 'All fields are required.' };
    }
    if (username.length < 3) {
      return { error: 'Username must be at least 3 characters.' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }
    if (findUser(username)) {
      return { error: 'Username is already taken.' };
    }
    if (findUserByEmail(email)) {
      return { error: 'Email is already registered.' };
    }
    const newUser = createUser({ username, email, password });
    saveSession(newUser.id);
    setUser(newUser);
    return { error: null };
  }, []);

  /**
   * Login an existing user.
   * @returns {{ error: string|null }}
   */
  const login = useCallback(({ username, password }) => {
    if (!username.trim() || !password.trim()) {
      return { error: 'Username and password are required.' };
    }
    const found = findUser(username);
    if (!found || found.password !== password) {
      return { error: 'Invalid username or password.' };
    }
    saveSession(found.id);
    setUser(found);
    return { error: null };
  }, []);

  /** Logout the current user */
  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  /**
   * Record a problem attempt / solve on the user profile.
   * @param {{ id, title, difficulty }} problem
   * @param {boolean} solved
   */
  const updateStats = useCallback(
    (problem, solved) => {
      if (!user) return;

      const alreadySolved = user.solvedProblems.some(
        (p) => p.id === problem.id
      );
      const newTotalAttempts = user.totalAttempts + 1;

      let newSolved = [...user.solvedProblems];
      if (solved && !alreadySolved) {
        newSolved.push({
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          solvedAt: new Date().toISOString(),
        });
      }

      const updated = updateUser(user.id, {
        totalAttempts: newTotalAttempts,
        solvedProblems: newSolved,
      });
      setUser(updated);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateStats }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth context */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
