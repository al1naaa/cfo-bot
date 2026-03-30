// auth.js - User accounts stored in Firestore, session cached in localStorage
import { db } from '../config/firebase.js';
import {
  doc, getDoc, setDoc, collection,
  addDoc, deleteDoc, getDocs, orderBy, query
} from 'firebase/firestore';

const SESSION_KEY = 'cfobot_session';
const PARAMS_KEY  = 'cfobot_params';

function hashPassword(p) { return btoa(encodeURIComponent(p)); }
function emailToKey(email) { return email.toLowerCase().replace(/[.#$[\]]/g, '_'); }

// ── auth ─────────────────────────────────────────────────────

export async function register(email, password, name) {
  if (!email || !password || !name) throw new Error('All fields are required');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email address');

  const key = emailToKey(email);
  const snap = await getDoc(doc(db, 'users', key));
  if (snap.exists()) throw new Error('An account with this email already exists');

  await setDoc(doc(db, 'users', key), {
    email: email.toLowerCase(), name,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  });

  const session = { uid: key, email: email.toLowerCase(), name, loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function login(email, password) {
  if (!email || !password) throw new Error('Email and password are required');

  const key = emailToKey(email);
  const snap = await getDoc(doc(db, 'users', key));
  if (!snap.exists()) throw new Error('Invalid email or password');

  const user = snap.data();
  if (user.passwordHash !== hashPassword(password)) throw new Error('Invalid email or password');

  const session = { uid: key, email: user.email, name: user.name, loggedInAt: Date.now() };
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
    // storage quota exceeded
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

// ── per-user history in Firestore ────────────────────────────

export async function saveHistoryEntry(uid, entry) {
  return await addDoc(collection(db, 'users', uid, 'history'), {
    ...entry,
    savedAt: Date.now(),
  });
}

export async function loadHistory(uid) {
  const q = query(
    collection(db, 'users', uid, 'history'),
    orderBy('savedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteHistoryEntry(uid, entryId) {
  await deleteDoc(doc(db, 'users', uid, 'history', entryId));
}
