import React from 'react';

export default function Header({
  onExport, onExportPdf, onSaveSession, onShowHistory,
  savedMsg, hasResults, theme, onToggleTheme, session, onLogout
}) {
  const isDark = theme === 'dark';
  const borderC = isDark ? '#2a2d3a' : '#dde3f0';
  const bg = isDark ? '#111318' : '#ffffff';
  const text = isDark ? '#e8eaf0' : '#1a1a2e';
  const text2 = isDark ? '#8b90a0' : '#555';
  const text3 = isDark ? '#555a6e' : '#aaa';
  const bg2 = isDark ? '#181b23' : '#f4f7fb';

  const btnBase = {
    border: `1px solid ${borderC}`,
    background: bg2,
    color: text2,
    padding: '6px 12px', borderRadius: 6,
    cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: 11,
    fontWeight: 700, transition: 'all 0.2s', whiteSpace: 'nowrap',
  };

  return (
    <header style={{
      borderBottom: `1px solid ${borderC}`,
      background: bg,
      padding: '0 20px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.2s, border-color 0.2s',
      gap: 12,
    }}>
      {/* Left - Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'linear-gradient(135deg, #0090ff, #00e5a0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff',
          fontFamily: 'Space Mono, monospace', flexShrink: 0,
        }}>C</div>
        <div>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 15,
            color: text, letterSpacing: '-0.5px', lineHeight: 1.2,
          }}>CFO Bot</div>
          <div style={{ fontSize: 10, color: text3, lineHeight: 1 }}>Cloud Cost Estimator</div>
        </div>
      </div>

      {/* Right - Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>

        {/* Theme toggle */}
        <button onClick={onToggleTheme} title="Toggle theme" style={{
          ...btnBase, width: 32, height: 32, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: isDark ? '#FFF' : '#000',
        }}>
          {isDark ? '☀' : '◑'}
        </button>

        {/* History */}
        <button onClick={onShowHistory} style={{ ...btnBase }}>
          History
        </button>

        {/* Save session */}
        {hasResults && (
          <button onClick={onSaveSession} style={{
            ...btnBase,
            color: savedMsg ? '#00e5a0' : text2,
            borderColor: savedMsg ? '#00e5a0' : borderC,
          }}>
            {savedMsg || 'Save Session'}
          </button>
        )}

        {/* Export CSV */}
        {hasResults && (
          <button onClick={onExport} style={{
            ...btnBase, color: isDark ? '#00e5a0' : '#0090ff',
            borderColor: isDark ? '#00e5a0' : '#0090ff',
          }}>CSV</button>
        )}

        {/* Export PDF */}
        {hasResults && (
          <button onClick={onExportPdf} style={{
            ...btnBase, color: isDark ? '#0090ff' : '#7c3aed',
            borderColor: isDark ? '#0090ff' : '#7c3aed',
          }}>PDF</button>
        )}

        {/* User info */}
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0090ff, #00e5a0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
              fontFamily: 'Space Mono, monospace',
            }}>
              {session.name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: text2, fontFamily: 'Space Mono, monospace' }}>
              {session.name.split(' ')[0]}
            </span>
            <button onClick={onLogout} style={{
              background: 'transparent', border: 'none',
              color: text3, cursor: 'pointer', fontSize: 11,
              fontFamily: 'DM Sans, sans-serif', padding: '2px 4px',
            }}>Sign out</button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
