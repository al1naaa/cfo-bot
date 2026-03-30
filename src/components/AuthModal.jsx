import React, { useState } from 'react';
import { login, register } from '../utils/auth.js';

export default function AuthModal({ onAuth, onClose, theme }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';
  const bg = isDark ? '#111318' : '#ffffff';
  const bg2 = isDark ? '#181b23' : '#f4f7fb';
  const border = isDark ? '#2a2d3a' : '#dde3f0';
  const text = isDark ? '#e8eaf0' : '#1a1a2e';
  const text2 = isDark ? '#8b90a0' : '#555';
  const accent = '#0090ff';

  function handleField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setError('');
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      let sess;
      if (mode === 'register') {
        sess = await register(form.email, form.password, form.name);
      } else {
        sess = await login(form.email, form.password);
      }
      onAuth(sess);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  const inputStyle = {
    width: '100%',
    background: bg2,
    border: `1px solid ${error ? '#ff4757' : border}`,
    color: text,
    padding: '10px 14px',
    borderRadius: 8,
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14,
    outline: 'none',
    marginBottom: 12,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: bg, border: `1px solid ${border}`,
        borderRadius: 16, padding: '32px 36px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        animation: 'fadeUp 0.25s ease',
      }} onClick={e => e.stopPropagation()}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #0090ff, #00e5a0)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, marginBottom: 12, color: '#fff', fontWeight: 700,
            fontFamily: 'Space Mono, monospace',
          }}>C</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 18, color: text }}>
            CFO Bot
          </div>
          <div style={{ fontSize: 12, color: text2, marginTop: 2 }}>
            {mode === 'login' ? 'Sign in to continue' : 'Create an account'}
          </div>
        </div>

        <div style={{
          display: 'flex', background: bg2, borderRadius: 8,
          padding: 4, marginBottom: 24, border: `1px solid ${border}`,
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '7px 0', borderRadius: 6, border: 'none',
              background: mode === m ? accent : 'transparent',
              color: mode === m ? '#fff' : text2,
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {mode === 'register' && (
          <input placeholder="Full Name" value={form.name}
            onChange={e => handleField('name', e.target.value)}
            onKeyDown={handleKeyDown} style={inputStyle} />
        )}
        <input placeholder="Email Address" type="email" value={form.email}
          onChange={e => handleField('email', e.target.value)}
          onKeyDown={handleKeyDown} style={inputStyle} />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => handleField('password', e.target.value)}
          onKeyDown={handleKeyDown} style={{ ...inputStyle, marginBottom: 16 }} />

        {error && (
          <div style={{
            fontSize: 12, color: '#ff4757',
            background: 'rgba(255,71,87,0.08)',
            border: '1px solid rgba(255,71,87,0.2)',
            borderRadius: 6, padding: '8px 12px',
            marginBottom: 16, fontFamily: 'Space Mono, monospace',
          }}>{error}</div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '11px 0',
          background: loading ? '#555' : accent,
          color: '#fff', border: 'none', borderRadius: 8,
          fontFamily: 'Space Mono, monospace', fontSize: 13, fontWeight: 700,
          cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s',
        }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: text2 }}>
          Data is stored in Firebase cloud.
        </div>
      </div>
    </div>
  );
}
