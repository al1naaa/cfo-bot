import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const USD_TO_KZT = 450;

export default function ComparisonChart({ results, currency }) {
  const data = useMemo(() => {
    const sorted = [...results].sort((a, b) => a.totalUsd - b.totalUsd);
    const labels = sorted.map(r => `${r.providerFlag} ${r.providerName.replace(/^(AWS|GCP|Azure|Firebase|Digital Ocean|PS Cloud|Qaztelecom) ?/, '').trim() || r.providerName}`);
    const mult = currency === 'KZT' ? USD_TO_KZT : 1;

    return {
      labels,
      datasets: [
        {
          label: 'AI API',
          data: sorted.map(r => +(r.breakdown.aiCost * mult).toFixed(2)),
          backgroundColor: 'rgba(0, 144, 255, 0.85)',
          borderRadius: 4,
        },
        {
          label: 'Compute',
          data: sorted.map(r => +(r.breakdown.computeCost * mult).toFixed(2)),
          backgroundColor: 'rgba(0, 229, 160, 0.85)',
          borderRadius: 4,
        },
        {
          label: 'Storage',
          data: sorted.map(r => +(r.breakdown.storageCost * mult).toFixed(2)),
          backgroundColor: 'rgba(245, 166, 35, 0.85)',
          borderRadius: 4,
        },
        {
          label: 'Bandwidth',
          data: sorted.map(r => +(r.breakdown.bandwidthCost * mult).toFixed(2)),
          backgroundColor: 'rgba(167, 139, 250, 0.85)',
          borderRadius: 4,
        },
      ],
    };
  }, [results, currency]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#8b90a0', font: { family: 'DM Sans', size: 12 }, boxWidth: 12 },
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Cost Comparison — All Providers (${currency})`,
        color: '#e8eaf0',
        font: { family: 'Space Mono', size: 13, weight: 'bold' },
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: '#181b23',
        borderColor: '#2a2d3a',
        borderWidth: 1,
        titleColor: '#e8eaf0',
        bodyColor: '#8b90a0',
        callbacks: {
          label: ctx => {
            const v = ctx.raw;
            return ` ${ctx.dataset.label}: ${currency === 'KZT' ? `${v.toLocaleString()} ₸` : `$${v.toFixed(4)}`}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#8b90a0', font: { family: 'DM Sans', size: 11 } },
        grid: { color: 'rgba(42,45,58,0.5)' },
      },
      y: {
        stacked: true,
        ticks: {
          color: '#8b90a0',
          font: { family: 'Space Mono', size: 11 },
          callback: v => currency === 'KZT' ? `${v.toLocaleString()}₸` : `$${v}`,
        },
        grid: { color: 'rgba(42,45,58,0.5)' },
      },
    },
  };

  return (
    <div style={{
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      padding: '24px',
      height: 320,
    }}>
      <Bar data={data} options={options} />
    </div>
  );
}
