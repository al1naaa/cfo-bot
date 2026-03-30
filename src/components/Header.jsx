import React from 'react';

export default function Header({ onExport, hasResults }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg2)',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>💹</div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.5px' }}>
            CFO Bot
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: -2 }}>
            Cloud Cost Estimator for Chat Bot Apps
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)',
          background: 'var(--bg3)', padding: '4px 10px', borderRadius: 20,
          border: '1px solid var(--border)',
        }}>
          v1.0.0 · TSIS-3
        </div>
        {hasResults && (
          <button onClick={onExport} style={{
            background: 'transparent', border: '1px solid var(--accent)',
            color: 'var(--accent)', padding: '6px 14px', borderRadius: 6,
            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12,
            fontWeight: 700, transition: 'all 0.2s',
          }}
          onMouseOver={e => e.target.style.background = 'rgba(0,229,160,0.1)'}
          onMouseOut={e => e.target.style.background = 'transparent'}>
            ↓ Export CSV
          </button>
        )}
      </div>
    </header>
  );
}
