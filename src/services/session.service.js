// session.service.js - localStorage-based session storage
// Firestore integration removed to prevent crashes on unauthenticated load

export async function saveSession(inputs, result) {
  try {
    const raw = localStorage.getItem('cfobot_history');
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({ inputs, result, createdAt: Date.now() });
    localStorage.setItem('cfobot_history', JSON.stringify(history.slice(0, 50)));
  } catch {
    // storage quota exceeded
  }
}

export async function loadSessions() {
  try {
    const raw = localStorage.getItem('cfobot_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
