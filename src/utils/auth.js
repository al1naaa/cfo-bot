// auth.js - User authentication and session management via localStorage

const USERS_KEY = 'cfobot_users';
const SESSION_KEY = 'cfobot_session';
const PARAMS_KEY = 'cfobot_params';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(email, password, name) {
  if (!email || !password || !name) throw new Error('All fields are required');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address');

  const users = getUsers();
  const key = email.toLowerCase();
  if (users[key]) throw new Error('An account with this email already exists');

  users[key] = { email: key, name, passwordHash: btoa(password), createdAt: Date.now() };
  saveUsers(users);

  const session = { email: key, name, loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function login(email, password) {
  if (!email || !password) throw new Error('Email and password are required');
  const users = getUsers();
  const key = email.toLowerCase();
  const user = users[key];

  if (!user || user.passwordHash !== btoa(password)) {
    throw new Error('Invalid email or password');
  }

  const session = { email: key, name: user.name, loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveParams(params) {
  try {
    localStorage.setItem(PARAMS_KEY, JSON.stringify(params));
  } catch {
    // storage quota exceeded - silently ignore
  }
}

export function loadParams() {
  try {
    const raw = localStorage.getItem(PARAMS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
