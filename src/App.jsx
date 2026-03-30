import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AI_MODELS, CLOUD_PROVIDERS } from './config/pricing.config.js';
import { calculateAllProviders, exportToCsv } from './utils/calculator.js';
import { exportToPdf } from './utils/exportPdf.js';
import { getSession, logout, saveParams, loadParams } from './utils/auth.js';
import InputPanel from './components/InputPanel.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ComparisonChart from './components/ComparisonChart.jsx';
import Header from './components/Header.jsx';
import AuthModal from './components/AuthModal.jsx';
import HistoryPanel from "./components/HistoryPanel";

const DEFAULT_PARAMS = {
  dailyMessages: 1000,
  monthlyUsers: 500,
  tokensIn: 500,
  tokensOut: 300,
  execMs: 800,
  memGb: 0.25,
  modelId: 'gemini-3-flash',
  currency: 'USD',
};

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('cfobot_theme') || 'dark');
  const [session, setSession] = useState(() => getSession());
  const [showAuth, setShowAuth] = useState(false);
  const [params, setParams] = useState(() => loadParams() || DEFAULT_PARAMS);
  const [error, setError] = useState(null);

  const isDark = theme === 'dark';

  // Sync theme to CSS variables and localStorage
  useEffect(() => {
    localStorage.setItem('cfobot_theme', theme);
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg', '#0a0b0f');
      root.style.setProperty('--bg2', '#111318');
      root.style.setProperty('--bg3', '#181b23');
      root.style.setProperty('--border', '#2a2d3a');
      root.style.setProperty('--text', '#e8eaf0');
      root.style.setProperty('--text2', '#8b90a0');
      root.style.setProperty('--text3', '#555a6e');
      root.style.setProperty('--shadow', 'rgba(0,0,0,0.4)');
    } else {
      root.style.setProperty('--bg', '#f0f2f8');
      root.style.setProperty('--bg2', '#ffffff');
      root.style.setProperty('--bg3', '#f4f7fb');
      root.style.setProperty('--border', '#dde3f0');
      root.style.setProperty('--text', '#1a1a2e');
      root.style.setProperty('--text2', '#444a6a');
      root.style.setProperty('--text3', '#888');
      root.style.setProperty('--shadow', 'rgba(0,0,0,0.08)');
    }
    document.body.style.background = isDark ? '#0a0b0f' : '#f0f2f8';
    document.body.style.color = isDark ? '#e8eaf0' : '#1a1a2e';
  }, [theme, isDark]);

  // Persist params when user is logged in
  useEffect(() => {
    if (session) saveParams(params);
  }, [params, session]);

  const selectedModel = useMemo(
    () => AI_MODELS.find(m => m.id === params.modelId) || AI_MODELS[0],
    [params.modelId]
  );

  const results = useMemo(() => {
    try {
      setError(null);
      if (!params.dailyMessages || params.dailyMessages <= 0) {
        setError('Daily messages must be greater than 0');
        return [];
      }
      return calculateAllProviders({ ...params, model: selectedModel }, CLOUD_PROVIDERS);
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, [params, selectedModel]);

  const handleExportCsv = useCallback(() => {
    const csv = exportToCsv(results, params);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfo-bot-estimate-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results, params]);

  const handleExportPdf = useCallback(() => {
    exportToPdf(results, params, selectedModel);
  }, [results, params, selectedModel]);

  const handleAuth = useCallback((sess) => {
    setSession(sess);
    setShowAuth(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setSession(null);
  }, []);

  const update = useCallback((key, val) => {
    setParams(p => ({ ...p, [key]: val }));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showAuth && <AuthModal onAuth={handleAuth} theme={theme} />}

      <Header
        onExport={handleExportCsv}
        onExportPdf={handleExportPdf}
        hasResults={results.length > 0}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        session={session}
        onLogout={handleLogout}
      />

      {/* Login prompt banner */}
      {!session && !showAuth && (
        <div style={{
          background: isDark ? 'rgba(0,144,255,0.07)' : 'rgba(0,144,255,0.06)',
          borderBottom: `1px solid ${isDark ? 'rgba(0,144,255,0.2)' : '#c5d9f5'}`,
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 13,
        }}>
          <span style={{ color: isDark ? '#8b90a0' : '#555' }}>
            Sign in to save your parameters across sessions.
          </span>
          <button onClick={() => setShowAuth(true)} style={{
            background: '#0090ff', color: '#fff', border: 'none',
            padding: '5px 14px', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'Space Mono, monospace', fontSize: 11, fontWeight: 700,
          }}>
            Sign In / Register
          </button>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(255,71,87,0.07)', border: '1px solid #ff4757',
          borderRadius: 8, padding: '10px 20px',
          margin: '8px 20px', color: '#ff4757',
          fontFamily: 'Space Mono, monospace', fontSize: 12,
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: 0,
        flex: 1,
        minHeight: 0,
      }} className="main-grid">
        <InputPanel params={params} onUpdate={update} models={AI_MODELS} theme={theme} />
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <ResultsPanel results={results} params={params} model={selectedModel} theme={theme} />
          {results.length > 0 && (
            <ComparisonChart results={results} currency={params.currency} theme={theme} />
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
