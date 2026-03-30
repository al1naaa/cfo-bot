import React, { useMemo } from 'react';

const USD_TO_KZT = 480;

function costColor(usd) {
  if (usd === 0) return '#00e5a0';
  if (usd < 50) return '#00c87a';
  if (usd < 500) return '#f5a623';
  return '#ff4757';
}

function fmt(usd, currency) {
  if (currency === 'KZT') return `${Math.round(usd * USD_TO_KZT).toLocaleString()} KZT`;
  if (usd === 0) return '$0.00';
  if (usd < 0.01) return `$${usd.toFixed(6)}`;
  return `$${usd.toFixed(2)}`;
}

function BreakdownBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: 'var(--text2)' }}>{label}</span>
        <span style={{ color: 'var(--text)', fontFamily: 'Space Mono, monospace' }}>
          ${value.toFixed(4)} <span style={{ color: 'var(--text3)' }}>({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: 2, transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}

function CostCard({ result, rank, currency, isLowest }) {
  const { breakdown, totalUsd, totalKzt, perMessageUsd, providerFlag, providerName, modelName } = result;
  const color = costColor(totalUsd);

  return (
    <div style={{
      background: isLowest ? 'rgba(0,229,160,0.04)' : 'var(--bg2)',
      border: `1px solid ${isLowest ? 'rgba(0,229,160,0.25)' : 'var(--border)'}`,
      borderRadius: 12,
      padding: '16px',
      position: 'relative',
      transition: 'border-color 0.3s, background 0.2s',
      animation: 'fadeUp 0.3s ease both',
      animationDelay: `${rank * 0.04}s`,
    }}>
      {isLowest && (
        <div style={{
          position: 'absolute', top: -1, right: 16,
          background: '#00e5a0', color: '#000',
          fontSize: 9, fontWeight: 700, padding: '2px 8px',
          borderRadius: '0 0 6px 6px', fontFamily: 'Space Mono, monospace',
          letterSpacing: '0.06em',
        }}>
          CHEAPEST
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#fff',
              background: 'rgba(141, 146, 139, 0.72)',
              padding: '2px 6px', borderRadius: 4,
              fontFamily: 'Space Mono, monospace', letterSpacing: '0.04em',
            }}>{providerFlag}</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{providerName}</span>
            <span style={{
              fontSize: 10, color: rank === 0 ? '#00e5a0' : 'var(--text3)',
              padding: '1px 6px', borderRadius: 4,
              background: rank === 0 ? 'rgba(0,229,160,0.12)' : 'var(--bg3)',
              fontFamily: 'Space Mono, monospace',
            }}>
              #{rank + 1}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{modelName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 20, fontWeight: 700, color,
          }}>
            {fmt(totalUsd, currency)}
          </div>
          {currency === 'USD' && (
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono, monospace' }}>
              ~{totalKzt.toLocaleString()} KZT
            </div>
          )}
          {currency === 'KZT' && (
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Space Mono, monospace' }}>
              = ${totalUsd.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <BreakdownBar label="AI API"    value={breakdown.aiCost}        total={totalUsd} color="#0090ff" />
        <BreakdownBar label="Compute"   value={breakdown.computeCost}   total={totalUsd} color="#00e5a0" />
        <BreakdownBar label="Storage"   value={breakdown.storageCost}   total={totalUsd} color="#f5a623" />
        <BreakdownBar label="Bandwidth" value={breakdown.bandwidthCost} total={totalUsd} color="#a78bfa" />
      </div>

      <div style={{
        borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8,
        display: 'flex', justifyContent: 'space-between', fontSize: 11,
        color: 'var(--text3)', fontFamily: 'Space Mono, monospace',
      }}>
        <span>per message</span>
        <span style={{ color: 'var(--text2)' }}>
          ${perMessageUsd < 0.000001 ? perMessageUsd.toExponential(2) : perMessageUsd.toFixed(6)}
        </span>
      </div>
    </div>
  );
}

export default function ResultsPanel({ results, params, model }) {
  const monthly = params.dailyMessages * 30;

  const summary = useMemo(() => {
    if (!results.length) return null;
    const cheapest = results[0];
    const mostExpensive = results[results.length - 1];
    return { cheapest, mostExpensive, savings: mostExpensive.totalUsd - cheapest.totalUsd };
  }, [results]);

  return (
    <div style={{ padding: '20px', flex: 1 }}>
      {summary && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 20px',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          marginBottom: 20, animation: 'fadeUp 0.3s ease',
          transition: 'background 0.2s, border-color 0.2s',
        }}>
          {[
            { label: 'Monthly Messages', val: monthly.toLocaleString(), unit: 'messages' },
            { label: 'AI Model', val: model.name.split(' ').slice(0, 2).join(' '), unit: model.provider },
            { label: 'Cheapest Option', val: `$${summary.cheapest.totalUsd.toFixed(2)}`, unit: summary.cheapest.providerName },
            { label: 'Max Savings', val: `$${summary.savings.toFixed(2)}`, unit: 'vs most expensive' },
          ].map(({ label, val, unit }) => (
            <div key={label}>
              <div style={{
                fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase',
                letterSpacing: '0.08em', fontFamily: 'Space Mono, monospace', marginBottom: 4,
              }}>{label}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{val}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{unit}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
      }}>
        {results.map((r, i) => (
          <CostCard key={r.provider} result={r} rank={i} currency={params.currency} isLowest={i === 0} />
        ))}
      </div>

      {results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          color: 'var(--text3)', fontFamily: 'Space Mono, monospace',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>--</div>
          <div>Adjust parameters on the left to see cost estimates</div>
        </div>
      )}
    </div>
  );
}
