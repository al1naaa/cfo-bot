import React from 'react';

export default function Header({ onExport, onExportPdf, hasResults, theme, onToggleTheme, session, onLogout }) {
  const isDark = theme === 'dark';

  return (
    <header style={{
      borderBottom: `1px solid ${isDark ? '#2a2d3a' : '#dde3f0'}`,
      background: isDark ? '#111318' : '#ffffff',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      {/* Left - Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #0090ff, #00e5a0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700, color: '#fff',
          fontFamily: 'Space Mono, monospace',
        }}>C</div>
        <div>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 15,
            color: isDark ? '#e8eaf0' : '#1a1a2e', letterSpacing: '-0.5px',
          }}>
            CFO Bot
          </div>
          <div style={{ fontSize: 11, color: isDark ? '#555a6e' : '#888', marginTop: -2 }}>
            Cloud Cost Estimator
          </div>
        </div>
      </div>

      {/* Right - Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* TSIS badge */}
        <div style={{
          fontSize: 11, color: isDark ? '#555a6e' : '#aaa',
          fontFamily: 'Space Mono, monospace',
          background: isDark ? '#181b23' : '#f4f7fb',
          padding: '4px 10px', borderRadius: 20,
          border: `1px solid ${isDark ? '#2a2d3a' : '#dde3f0'}`,
        }}>
          TSIS-3
        </div>

        {/* Theme toggle */}
        <button onClick={onToggleTheme} title="Toggle theme" style={{
          background: isDark ? '#181b23' : '#f4f7fb',
          border: `1px solid ${isDark ? '#2a2d3a' : '#dde3f0'}`,
          color: isDark ? '#8b90a0' : '#555',
          width: 32, height: 32, borderRadius: 8,
          cursor: 'pointer', fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {isDark ? 'L' : 'D'}
        </button>

        {/* Export buttons */}
        {hasResults && (
          <>
            <button onClick={onExport} style={{
              background: 'transparent',
              border: `1px solid ${isDark ? '#00e5a0' : '#0090ff'}`,
              color: isDark ? '#00e5a0' : '#0090ff',
              padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: 11,
              fontWeight: 700, transition: 'all 0.2s',
            }}>
              CSV
            </button>
            <button onClick={onExportPdf} style={{
              background: 'transparent',
              border: `1px solid ${isDark ? '#0090ff' : '#7c3aed'}`,
              color: isDark ? '#0090ff' : '#7c3aed',
              padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: 11,
              fontWeight: 700, transition: 'all 0.2s',
            }}>
              PDF
            </button>
          </>
        )}

        {/* User info */}
        {session && (
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
            <span style={{ fontSize: 12, color: isDark ? '#8b90a0' : '#555', fontFamily: 'Space Mono, monospace' }}>
              {session.name.split(' ')[0]}
            </span>
            <button onClick={onLogout} style={{
              background: 'transparent', border: 'none',
              color: isDark ? '#555a6e' : '#aaa', cursor: 'pointer',
              fontSize: 11, padding: '4px 6px',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
