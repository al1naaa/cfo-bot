import React, { useState, useMemo, useCallback } from 'react';
import { AI_MODELS, CLOUD_PROVIDERS } from './config/pricing.config.js';
import { calculateAllProviders, exportToCsv } from './utils/calculator.js';
import InputPanel from './components/InputPanel.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ComparisonChart from './components/ComparisonChart.jsx';
import Header from './components/Header.jsx';

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
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [error, setError] = useState(null);

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

  const handleExport = useCallback(() => {
    const csv = exportToCsv(results, params);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfo-bot-estimate-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results, params]);

  const update = useCallback((key, val) => {
    setParams(p => ({ ...p, [key]: val }));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onExport={handleExport} hasResults={results.length > 0} />

      {error && (
        <div style={{
          background: 'rgba(255,71,87,0.1)', border: '1px solid var(--danger)',
          borderRadius: 'var(--radius-sm)', padding: '12px 20px',
          margin: '0 20px', color: 'var(--danger)', fontFamily: 'var(--font-mono)',
          fontSize: 13,
        }}>
          ⚠ {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: '0',
        flex: 1,
        minHeight: 0,
      }} className="main-grid">
        <InputPanel params={params} onUpdate={update} models={AI_MODELS} />
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <ResultsPanel results={results} params={params} model={selectedModel} />
          {results.length > 0 && <ComparisonChart results={results} currency={params.currency} />}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
