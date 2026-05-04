/**
 * storage.js - localStorage utility for CodeBattle auth system.
 */

const USERS_KEY = 'codebattle_users';
const SESSION_KEY = 'codebattle_session';

/** @returns {Array} All registered users */
export function getUsers() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Save the full users array */
export function saveUsers(users) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Find a user by username (case-insensitive) */
export function findUser(username) {
  return getUsers().find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

/** Find a user by email (case-insensitive) */
export function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Create a new user and persist.
 * @returns {object} The created user
 */
export function createUser({ username, email, password }) {
  const users = getUsers();
  const newUser = {
    id: `user_${Date.now()}`,
    username,
    email,
    password, // NOTE: plain text — fine for a demo/educational project
    joinedAt: new Date().toISOString(),
    solvedProblems: [], // [{ id, title, difficulty, solvedAt, attempts }]
    totalAttempts: 0,
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

/**
 * Update a user by id and persist.
 */
export function updateUser(userId, patch) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  return users[idx];
}

/** @returns {object|null} The currently logged-in user (full object) */
export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    const sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;
    const users = getUsers();
    return users.find((u) => u.id === sessionId) || null;
  } catch {
    return null;
  }
}

/** Save session (stores the user's id) */
export function saveSession(userId) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, userId);
}

/** Clear session */
export function clearSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}
