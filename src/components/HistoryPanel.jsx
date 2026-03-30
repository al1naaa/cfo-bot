import React, { useState, useEffect } from 'react';
import { loadHistory, deleteHistoryEntry } from '../utils/auth.js';

export default function HistoryPanel({ theme, onClose, session, onLoginRequest }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isDark = theme === 'dark';
  const bg      = isDark ? '#111318' : '#fff';
  const border  = isDark ? '#2a2d3a' : '#dde3f0';
  const text    = isDark ? '#e8eaf0' : '#1a1a2e';
  const text2   = isDark ? '#8b90a0' : '#555';
  const text3   = isDark ? '#555a6e' : '#aaa';
  const bg2     = isDark ? '#181b23' : '#f4f7fb';
  const bg3     = isDark ? '#0a0b0f' : '#eef1f8';

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    loadHistory(session.uid)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [session]);

  async function handleDelete(entryId) {
    setDeletingId(entryId);
    try {
      await deleteHistoryEntry(session.uid, entryId);
      setHistory(h => h.filter(e => e.id !== entryId));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function fmtNum(n) {
    if (!n && n !== 0) return '-';
    return Number(n).toLocaleString();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end',
      backdropFilter: 'blur(3px)',
    }} onClick={onClose}>
      <div style={{
        background: bg, borderLeft: `1px solid ${border}`,
        width: 420, maxWidth: '100vw',
        height: '100vh', overflowY: 'auto',
        padding: 24,
        boxShadow: '-12px 0 40px rgba(0,0,0,0.35)',
        animation: 'slideIn 0.22s ease',
        display: 'flex', flexDirection: 'column', gap: 0,
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 14, color: text }}>
              Calculation History
            </div>
            {session && (
              <div style={{ fontSize: 11, color: text3, marginTop: 2 }}>
                {session.name} - {session.email}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: `1px solid ${border}`,
            color: text2, padding: '5px 12px', borderRadius: 6,
            cursor: 'pointer', fontSize: 12,
          }}>Close</button>
        </div>

        {/* Not logged in */}
        {!session && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16, textAlign: 'center', padding: '40px 20px',
          }}>
            <div style={{ fontSize: 36 }}>🔒</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, color: text, fontWeight: 700 }}>
              Sign in to view history
            </div>
            <div style={{ fontSize: 12, color: text2, lineHeight: 1.6 }}>
              Your saved calculations are tied to your account and visible only to you.
            </div>
            <button onClick={() => { onClose(); onLoginRequest(); }} style={{
              background: '#0090ff', color: '#fff', border: 'none',
              padding: '10px 24px', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'Space Mono, monospace',
              fontSize: 12, fontWeight: 700,
            }}>Sign In / Register</button>
          </div>
        )}

        {/* Loading */}
        {session && loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: text3, fontFamily: 'Space Mono, monospace', fontSize: 12 }}>
            Loading...
          </div>
        )}

        {/* Empty */}
        {session && !loading && history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: text3, fontFamily: 'Space Mono, monospace', fontSize: 12 }}>
            No saved sessions yet.
            <br />
            <span style={{ fontSize: 10, marginTop: 8, display: 'block' }}>
              Use "Save Session" after running a calculation.
            </span>
          </div>
        )}

        {/* Entries */}
        {session && !loading && history.map((s) => (
          <div key={s.id} style={{
            background: bg2, border: `1px solid ${border}`,
            borderRadius: 12, padding: '16px', marginBottom: 12,
            position: 'relative',
          }}>
            {/* Date + delete */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: text3 }}>
                {fmtDate(s.savedAt)}
              </span>
              <button
                onClick={() => handleDelete(s.id)}
                disabled={deletingId === s.id}
                style={{
                  background: 'transparent', border: `1px solid ${deletingId === s.id ? border : '#ff4757'}`,
                  color: deletingId === s.id ? text3 : '#ff4757',
                  padding: '2px 8px', borderRadius: 4,
                  cursor: deletingId === s.id ? 'default' : 'pointer',
                  fontSize: 10, fontFamily: 'Space Mono, monospace',
                }}>
                {deletingId === s.id ? '...' : 'Delete'}
              </button>
            </div>

            {/* Model */}
            <div style={{
              fontFamily: 'Space Mono, monospace', fontSize: 12, fontWeight: 700,
              color: '#0090ff', marginBottom: 10,
            }}>
              {s.model}
            </div>

            {/* Context grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '6px 16px', marginBottom: 12,
            }}>
              {[
                { label: 'Daily messages', val: fmtNum(s.dailyMessages) },
                { label: 'Monthly messages', val: fmtNum(s.monthlyMessages) },
                { label: 'Monthly users', val: fmtNum(s.monthlyUsers) },
                { label: 'Input tokens', val: fmtNum(s.tokensIn) },
                { label: 'Output tokens', val: fmtNum(s.tokensOut) },
                { label: 'Exec time', val: s.execMs ? `${s.execMs}ms` : '-' },
                { label: 'Memory', val: s.memGb ? `${s.memGb} GB` : '-' },
                { label: 'Currency', val: s.currency || 'USD' },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 9, color: text3, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Space Mono, monospace' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 12, color: text, fontFamily: 'Space Mono, monospace', fontWeight: 600 }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {/* Results */}
            {s.cheapest && (
              <div style={{ background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: '#00e5a0', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Space Mono, monospace', marginBottom: 4 }}>
                  Cheapest option
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 13, color: '#00e5a0' }}>
                  {s.cheapest.providerName}
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, color: text }}>
                  ${Number(s.cheapest.totalUsd).toFixed(2)}/mo
                  <span style={{ color: text3, fontSize: 11 }}> = {fmtNum(s.cheapest.totalKzt)} KZT</span>
                </div>
              </div>
            )}

            {/* Top 3 breakdown */}
            {s.topThree && s.topThree.length > 1 && (
              <div style={{ background: bg3, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: text3, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Space Mono, monospace', marginBottom: 8 }}>
                  Top 3 providers
                </div>
                {s.topThree.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: text2 }}>
                      <span style={{ color: text3, marginRight: 6 }}>#{i + 1}</span>
                      {r.providerName}
                    </div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: text, fontWeight: 600 }}>
                      ${Number(r.totalUsd).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
