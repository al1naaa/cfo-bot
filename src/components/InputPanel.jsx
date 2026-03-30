import React from 'react';

const USD_TO_KZT = 450;

function SliderRow({ label, value, min, max, step = 1, onChange, format, hint, isDark }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500 }}>{label}</label>
        <span style={{
          fontFamily: 'Space Mono, monospace', fontSize: 12, fontWeight: 700,
          color: isDark ? '#00e5a0' : '#0090ff',
          background: isDark ? 'rgba(0,229,160,0.08)' : 'rgba(0,144,255,0.08)',
          padding: '1px 8px', borderRadius: 4,
        }}>
          {format ? format(value) : value.toLocaleString()}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: isDark ? '#00e5a0' : '#0090ff', height: 4, cursor: 'pointer' }}
      />
      {hint && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Select({ label, value, onChange, options, isDark }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
        color: 'var(--text)', padding: '8px 12px', borderRadius: 8,
        fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='${isDark ? '%238b90a0' : '%23888'}' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: 32,
      }}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 10, fontFamily: 'Space Mono, monospace', color: 'var(--text3)',
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14,
        paddingBottom: 8, borderBottom: '1px solid var(--border)',
      }}>{title}</div>
      {children}
    </div>
  );
}

export default function InputPanel({ params, onUpdate, models, theme }) {
  const isDark = theme === 'dark';

  const modelOptions = models.map(m => ({
    value: m.id,
    label: `${m.badge ? `[${m.badge}] ` : ''}${m.name} - $${m.inputPer1M}/$${m.outputPer1M} per 1M`,
  }));

  const memOptions = [0.125, 0.25, 0.5, 1, 2, 4, 8].map(v => ({
    value: v, label: `${v} GB`,
  }));

  const selectedModel = models.find(m => m.id === params.modelId);
  const kztNote = selectedModel
    ? `~${(selectedModel.inputPer1M * USD_TO_KZT).toFixed(0)} / ${(selectedModel.outputPer1M * USD_TO_KZT).toFixed(0)} KZT per 1M tokens`
    : '';

  return (
    <aside style={{
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      padding: '24px 20px',
      overflowY: 'auto',
      height: 'calc(100vh - 60px)',
      position: 'sticky',
      top: 60,
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      <Section title="AI Model">
        <Select
          label="Model"
          value={params.modelId}
          onChange={v => onUpdate('modelId', v)}
          options={modelOptions}
          isDark={isDark}
        />
        {kztNote && (
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: -8, marginBottom: 16, fontFamily: 'Space Mono, monospace' }}>
            {kztNote}
          </div>
        )}
        <SliderRow
          label="Avg Input Tokens / Message"
          value={params.tokensIn}
          min={50} max={8000} step={50}
          onChange={v => onUpdate('tokensIn', v)}
          hint="Includes system prompt and context history"
          isDark={isDark}
        />
        <SliderRow
          label="Avg Output Tokens / Response"
          value={params.tokensOut}
          min={10} max={4000} step={10}
          onChange={v => onUpdate('tokensOut', v)}
          isDark={isDark}
        />
      </Section>

      <Section title="Usage Assumptions">
        <SliderRow
          label="Daily Messages"
          value={params.dailyMessages}
          min={1} max={500000} step={100}
          onChange={v => onUpdate('dailyMessages', v)}
          format={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString()}
          hint={`${(params.dailyMessages * 30).toLocaleString()} messages/month`}
          isDark={isDark}
        />
        <SliderRow
          label="Monthly Active Users"
          value={params.monthlyUsers}
          min={1} max={100000} step={50}
          onChange={v => onUpdate('monthlyUsers', v)}
          format={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString()}
          isDark={isDark}
        />
      </Section>

      <Section title="Compute (Serverless)">
        <SliderRow
          label="Avg Execution Time"
          value={params.execMs}
          min={100} max={10000} step={100}
          onChange={v => onUpdate('execMs', v)}
          format={v => `${v}ms`}
          hint="Only affects serverless providers"
          isDark={isDark}
        />
        <Select
          label="Memory Allocation"
          value={params.memGb}
          onChange={v => onUpdate('memGb', parseFloat(v))}
          options={memOptions}
          isDark={isDark}
        />
      </Section>

      <Section title="Currency Display">
        <Select
          label="Primary Currency"
          value={params.currency}
          onChange={v => onUpdate('currency', v)}
          options={[
            { value: 'USD', label: '$ USD (US Dollar)' },
            { value: 'KZT', label: 'KZT (Kazakhstani Tenge)' },
          ]}
          isDark={isDark}
        />
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono, monospace' }}>
          Rate: 1 USD = 450 KZT
        </div>
      </Section>
    </aside>
  );
}
