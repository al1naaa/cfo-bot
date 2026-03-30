// exportPdf.js - Generate a PDF report from CFO Bot results using browser print

export function exportToPdf(results, params, model) {
  const monthly = params.dailyMessages * 30;
  const currency = params.currency;
  const USD_TO_KZT = 450;

  function fmt(usd) {
    if (currency === 'KZT') return `${Math.round(usd * USD_TO_KZT).toLocaleString()} KZT`;
    if (usd === 0) return '$0.00';
    if (usd < 0.01) return `$${usd.toFixed(6)}`;
    return `$${usd.toFixed(2)}`;
  }

  const rows = results.map((r, i) => `
    <tr class="${i === 0 ? 'cheapest' : ''}">
      <td>${r.providerFlag} ${r.providerName}</td>
      <td>${fmt(r.breakdown.aiCost)}</td>
      <td>${fmt(r.breakdown.computeCost)}</td>
      <td>${fmt(r.breakdown.storageCost)}</td>
      <td>${fmt(r.breakdown.bandwidthCost)}</td>
      <td class="total">${fmt(r.totalUsd)}</td>
      <td>$${r.perMessageUsd < 0.000001 ? r.perMessageUsd.toExponential(2) : r.perMessageUsd.toFixed(6)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CFO Bot - Cloud Cost Estimate</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; padding: 32px; }
    h1 { font-size: 22px; color: #0f3460; margin-bottom: 4px; }
    .subtitle { color: #555; font-size: 12px; margin-bottom: 24px; }
    .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
    .meta-box { background: #f4f7fb; border-radius: 8px; padding: 12px 16px; }
    .meta-box .label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; }
    .meta-box .value { font-size: 16px; font-weight: 700; color: #0f3460; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #0f3460; color: #fff; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
    td { padding: 9px 12px; border-bottom: 1px solid #e8ecf4; font-size: 12px; font-family: 'Courier New', monospace; }
    tr:hover td { background: #f4f7fb; }
    tr.cheapest td { background: #e8fdf5; }
    tr.cheapest td:first-child::after { content: ' (cheapest)'; color: #00a86b; font-size: 10px; font-style: italic; }
    .total { font-weight: 700; color: #0f3460; }
    .formula { background: #f4f7fb; border-left: 3px solid #0f3460; padding: 12px 16px; margin-top: 28px; border-radius: 0 8px 8px 0; font-size: 11px; }
    .formula h3 { font-size: 12px; color: #0f3460; margin-bottom: 8px; }
    .formula code { font-family: 'Courier New', monospace; display: block; line-height: 1.8; color: #333; }
    .footer { margin-top: 28px; font-size: 10px; color: #aaa; border-top: 1px solid #e8ecf4; padding-top: 12px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>CFO Bot - Cloud Cost Estimate</h1>
  <div class="subtitle">Generated on ${new Date().toLocaleString()} | TSIS-3 Academic Project</div>

  <div class="meta">
    <div class="meta-box">
      <div class="label">AI Model</div>
      <div class="value">${model.name.split(' ').slice(0, 2).join(' ')}</div>
    </div>
    <div class="meta-box">
      <div class="label">Daily Messages</div>
      <div class="value">${params.dailyMessages.toLocaleString()}</div>
    </div>
    <div class="meta-box">
      <div class="label">Monthly Messages</div>
      <div class="value">${monthly.toLocaleString()}</div>
    </div>
    <div class="meta-box">
      <div class="label">Monthly Users</div>
      <div class="value">${params.monthlyUsers.toLocaleString()}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Provider</th>
        <th>AI API</th>
        <th>Compute</th>
        <th>Storage</th>
        <th>Bandwidth</th>
        <th>Total/mo</th>
        <th>Per Message</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="formula">
    <h3>Cost Formulas Applied</h3>
    <code>
      TOTAL = cost_ai + cost_compute + cost_storage + cost_bandwidth<br>
      cost_ai = (monthly_messages * tokens_in / 1,000,000) * price_input<br>
              + (monthly_messages * tokens_out / 1,000,000) * price_output<br>
      cost_storage = max(0, stored_gb - free_gb) * price_per_gb<br>
      cost_bandwidth = max(0, egress_gb - free_gb) * price_per_gb<br>
      KZT = total_usd * 450
    </code>
  </div>

  <div class="footer">
    CFO Bot v1.0 | Input tokens: ${params.tokensIn} | Output tokens: ${params.tokensOut} | Exec time: ${params.execMs}ms | Memory: ${params.memGb}GB
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    // popup blocked fallback - download as html
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfo-bot-report-${Date.now()}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
