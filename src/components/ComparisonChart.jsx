import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const USD_TO_KZT = 450;

export default function ComparisonChart({ results, currency, theme }) {
  const isDark = theme === 'dark';

  const axisColor = isDark ? '#555a6e' : '#aaa';
  const labelColor = isDark ? '#8b90a0' : '#555';
  const titleColor = isDark ? '#e8eaf0' : '#1a1a2e';
  const gridColor = isDark ? 'rgba(42,45,58,0.6)' : 'rgba(0,0,0,0.06)';
  const tooltipBg = isDark ? '#181b23' : '#fff';
  const tooltipBorder = isDark ? '#2a2d3a' : '#dde3f0';

  const data = useMemo(() => {
    const sorted = [...results].sort((a, b) => a.totalUsd - b.totalUsd);
    const labels = sorted.map(r => `${r.providerFlag} ${r.providerName}`);
    const mult = currency === 'KZT' ? USD_TO_KZT : 1;

    return {
      labels,
      datasets: [
        {
          label: 'AI API',
          data: sorted.map(r => +(r.breakdown.aiCost * mult).toFixed(4)),
          backgroundColor: 'rgba(0, 144, 255, 0.82)',
          borderRadius: 4,
        },
        {
          label: 'Compute',
          data: sorted.map(r => +(r.breakdown.computeCost * mult).toFixed(4)),
          backgroundColor: 'rgba(0, 229, 160, 0.82)',
          borderRadius: 4,
        },
        {
          label: 'Storage',
          data: sorted.map(r => +(r.breakdown.storageCost * mult).toFixed(4)),
          backgroundColor: 'rgba(245, 166, 35, 0.82)',
          borderRadius: 4,
        },
        {
          label: 'Bandwidth',
          data: sorted.map(r => +(r.breakdown.bandwidthCost * mult).toFixed(4)),
          backgroundColor: 'rgba(167, 139, 250, 0.82)',
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
        labels: { color: labelColor, font: { family: 'DM Sans', size: 12 }, boxWidth: 12 },
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Cost Comparison - All Providers (${currency})`,
        color: titleColor,
        font: { family: 'Space Mono', size: 13, weight: 'bold' },
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor,
        bodyColor: labelColor,
        callbacks: {
          label: ctx => {
            const v = ctx.raw;
            return ` ${ctx.dataset.label}: ${currency === 'KZT' ? `${v.toLocaleString()} KZT` : `$${v.toFixed(4)}`}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: axisColor, font: { family: 'DM Sans', size: 11 } },
        grid: { color: gridColor },
      },
      y: {
        stacked: true,
        ticks: {
          color: axisColor,
          font: { family: 'Space Mono', size: 11 },
          callback: v => currency === 'KZT' ? `${v.toLocaleString()} KZT` : `$${v}`,
        },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div style={{
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      padding: '24px',
      height: 320,
      transition: 'background 0.2s',
    }}>
      <Bar data={data} options={options} />
    </div>
  );
}
