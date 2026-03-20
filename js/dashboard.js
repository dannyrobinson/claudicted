/* ══════════════════════════════════════════════════
   SAAS DASHBOARD STATE
══════════════════════════════════════════════════ */
const SA = {
  view: 'overview',
  range: 30,
  searchQ: '',
};

// ── DATA GENERATORS ─────────────────────────────
function saRandSeries(n, base, variance, trend = 0) {
  const out = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += trend + (Math.random() - 0.45) * variance;
    v = Math.max(base * 0.2, v);
    out.push(Math.round(v));
  }
  return out;
}

function saGetData(range) {
  const seed = range * 7;
  // deterministic-ish based on range
  const r = (base, v, t) => saRandSeries(range, base, v, t);
  return {
    revenue:  r(48000, 4000, 300),
    users:    r(12000, 600, 80),
    churn:    r(230, 30, -2).map(v => Math.max(10, v)),
    mrr:      r(82000, 5000, 500),
    labels:   Array.from({length: range}, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (range - 1 - i));
      return range <= 7  ? d.toLocaleDateString('en-US',{weekday:'short'}) :
             range <= 30 ? d.toLocaleDateString('en-US',{month:'short',day:'numeric'}) :
             range <= 90 ? d.toLocaleDateString('en-US',{month:'short',day:'numeric'}) :
                           d.toLocaleDateString('en-US',{month:'short'});
    }),
  };
}

const SA_CUSTOMERS = [
  { name: 'Acme Corp',        email: 'ops@acme.io',       plan: 'Enterprise', mrr: 1200, status: 'active',  joined: '2023-03-12' },
  { name: 'Bubble Studio',    email: 'hi@bubble.co',      plan: 'Pro',        mrr: 149,  status: 'active',  joined: '2024-01-08' },
  { name: 'DataForge',        email: 'team@dataforge.dev',plan: 'Enterprise', mrr: 2400, status: 'active',  joined: '2022-11-01' },
  { name: 'Echo Analytics',   email: 'admin@echo.ai',     plan: 'Pro',        mrr: 149,  status: 'trial',   joined: '2024-11-20' },
  { name: 'FlyBase',          email: 'billing@flybase.io',plan: 'Starter',    mrr: 49,   status: 'churned', joined: '2023-08-15' },
  { name: 'Grova Health',     email: 'fin@grova.com',     plan: 'Enterprise', mrr: 3600, status: 'active',  joined: '2022-06-22' },
  { name: 'Hive Collective',  email: 'pay@hive.co',       plan: 'Pro',        mrr: 149,  status: 'active',  joined: '2023-12-03' },
  { name: 'Inkform',          email: 'hello@inkform.io',  plan: 'Starter',    mrr: 49,   status: 'trial',   joined: '2024-10-18' },
  { name: 'Juno Ops',         email: 'ops@juno.run',      plan: 'Pro',        mrr: 149,  status: 'active',  joined: '2024-02-27' },
  { name: 'Kaleidoscope',     email: 'sub@kaleid.xyz',    plan: 'Enterprise', mrr: 1800, status: 'active',  joined: '2023-05-14' },
  { name: 'Lumi Devices',     email: 'acct@lumi.tech',    plan: 'Pro',        mrr: 149,  status: 'churned', joined: '2023-07-30' },
  { name: 'Metronode',        email: 'pay@metronode.io',  plan: 'Starter',    mrr: 49,   status: 'active',  joined: '2024-09-02' },
];

const SA_PLANS = [
  { name: 'Starter',    price: 49,   seats: 3,   count: 3,  color: '#60a5fa' },
  { name: 'Pro',        price: 149,  seats: 10,  count: 5,  color: '#a78bfa' },
  { name: 'Enterprise', price: 1200, seats: 999, count: 4,  color: '#FF6B35' },
];

// ── OPEN / CLOSE ─────────────────────────────────
function openSaaS() {
  SA.view = 'overview';
  document.getElementById('saasModal').classList.add('open');
  // reset nav
  document.querySelectorAll('.sa-nav-item').forEach((b,i) => b.classList.toggle('active', i===0));
  document.getElementById('saPageTitle').textContent = 'Overview';
  document.getElementById('saPageSub').textContent = 'All metrics · Last 30 days';
  saRenderView();
}
function closeSaaS() { document.getElementById('saasModal').classList.remove('open'); }
function closeSaasBg(e) { if (e.target === document.getElementById('saasModal')) closeSaaS(); }

function saSetView(view, btn) {
  SA.view = view;
  document.querySelectorAll('.sa-nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const titles = { overview:'Overview', revenue:'Revenue', users:'Users', churn:'Churn', plans:'Plans' };
  document.getElementById('saPageTitle').textContent = titles[view];
  document.getElementById('saPageSub').textContent = 'Detailed analytics · ' + document.getElementById('saRange').options[document.getElementById('saRange').selectedIndex].text;
  saRenderView();
}

function saRefresh() {
  SA.range = parseInt(document.getElementById('saRange').value);
  document.getElementById('saPageSub').textContent = document.querySelector('.sa-nav-item.active').textContent.trim() + ' · ' + document.getElementById('saRange').options[document.getElementById('saRange').selectedIndex].text;
  saRenderView();
}

function saExport() { showToast('Exporting CSV... (just kidding, this is a demo 😅)'); }

// ── RENDER ROUTER ────────────────────────────────
function saRenderView() {
  const el = document.getElementById('saView');
  const data = saGetData(SA.range);
  switch(SA.view) {
    case 'overview': el.innerHTML = saOverviewHTML(data); break;
    case 'revenue':  el.innerHTML = saRevenueHTML(data);  break;
    case 'users':    el.innerHTML = saUsersHTML(data);     break;
    case 'churn':    el.innerHTML = saChurnHTML(data);     break;
    case 'plans':    el.innerHTML = saPlansHTML(data);     break;
  }
  requestAnimationFrame(() => {
    saDrawLineChart('saRevCanvas', data.revenue, data.labels, '#FF6B35');
    if (SA.view === 'revenue') saDrawLineChart('saRevCanvas2', data.revenue, data.labels, '#FF6B35');
    if (SA.view === 'users')   saDrawLineChart('saUsrCanvas', data.users, data.labels, '#60a5fa');
    if (SA.view === 'churn')   saDrawLineChart('saChurnCanvas', data.churn, data.labels, '#f87171');
    saBindTooltips();
    saBindSearch();
  });
}

// ── KPI CARDS ────────────────────────────────────
function saKpiHTML(label, val, delta, positive, sparkData, color) {
  const sign = positive ? '+' : '';
  const dc = positive ? '#16a34a' : '#dc2626';
  const arr = positive ? '↑' : '↓';
  const max = Math.max(...sparkData);
  const bars = sparkData.map((v,i) => {
    const h = Math.round((v/max)*100);
    const delay = i * 30;
    return `<div class="sa-kpi-spark-bar" style="height:${h}%;background:${color};opacity:${0.3+0.7*(h/100)};animation-delay:${delay}ms"></div>`;
  }).join('');
  return `
  <div class="sa-kpi">
    <div class="sa-kpi-label">${label}</div>
    <div class="sa-kpi-val">${val}</div>
    <div class="sa-kpi-delta" style="color:${dc}">${arr} ${sign}${delta}</div>
    <div class="sa-kpi-spark">${bars}</div>
  </div>`;
}

// ── OVERVIEW ─────────────────────────────────────
function saOverviewHTML(data) {
  const rev = data.revenue;
  const usr = data.users;
  const churn = data.churn;
  const totalRev = rev[rev.length-1];
  const totalUsr = usr[usr.length-1];
  const churnRate = ((churn[churn.length-1] / totalUsr) * 100).toFixed(1);
  const mrr = Math.round(totalRev / 30 * 30);
  const spark7 = rev.slice(-7);
  const spark7u = usr.slice(-7);
  const spark7c = churn.slice(-7);

  const prevRev = rev[0];
  const revPct = Math.abs(((totalRev - prevRev)/prevRev*100)).toFixed(1);
  const prevUsr = usr[0];
  const usrPct = Math.abs(((totalUsr - prevUsr)/prevUsr*100)).toFixed(1);

  return `
  <div class="sa-kpis">
    ${saKpiHTML('MRR', '$'+(mrr/1000).toFixed(1)+'k', '$'+(Math.round(mrr*0.12/100)*100/1000).toFixed(1)+'k', true, spark7, '#FF6B35')}
    ${saKpiHTML('Active Users', totalUsr.toLocaleString(), usrPct+'%', true, spark7u, '#60a5fa')}
    ${saKpiHTML('Churn Rate', churnRate+'%', '0.2%', false, spark7c, '#f87171')}
    ${saKpiHTML('Revenue', '$'+(totalRev/1000).toFixed(1)+'k', revPct+'%', true, spark7, '#a78bfa')}
  </div>
  <div class="sa-charts">
    <div class="sa-chart-panel">
      <div class="sa-chart-title">Revenue Trend</div>
      <div class="sa-chart-sub">Daily revenue over period</div>
      <div class="sa-line-wrap"><canvas class="sa-canvas" id="saRevCanvas" height="110"></canvas></div>
    </div>
    <div class="sa-chart-panel">
      <div class="sa-chart-title">Plan Mix</div>
      <div class="sa-chart-sub">By customer count</div>
      ${saPlanDonutHTML()}
    </div>
  </div>
  ${saCustomerTableHTML(SA_CUSTOMERS, true)}`;
}

// ── REVENUE VIEW ─────────────────────────────────
function saRevenueHTML(data) {
  const rev = data.revenue;
  const total = rev.reduce((s,v)=>s+v,0);
  const avg = Math.round(total/rev.length);
  const peak = Math.max(...rev);
  const spark7 = rev.slice(-7);
  return `
  <div class="sa-kpis" style="grid-template-columns:repeat(3,1fr)">
    ${saKpiHTML('Total Revenue', '$'+(total/1000).toFixed(0)+'k', '12.4%', true, spark7, '#FF6B35')}
    ${saKpiHTML('Daily Avg', '$'+avg.toLocaleString(), '8.1%', true, spark7, '#fbbf24')}
    ${saKpiHTML('Peak Day', '$'+peak.toLocaleString(), 'this period', true, spark7, '#a78bfa')}
  </div>
  <div class="sa-chart-panel" style="margin-bottom:16px">
    <div class="sa-chart-title">Revenue Over Time</div>
    <div class="sa-chart-sub">Daily revenue · ${document.getElementById('saRange').options[document.getElementById('saRange').selectedIndex].text}</div>
    <div class="sa-line-wrap"><canvas class="sa-canvas" id="saRevCanvas2" height="150"></canvas></div>
  </div>
  <div class="sa-chart-panel">
    <div class="sa-chart-title">Revenue by Plan</div>
    <div class="sa-chart-sub">Breakdown by subscription tier</div>
    <div class="sa-bar-chart">
      ${SA_PLANS.map((p,i) => {
        const h = Math.round((p.price * p.count) / (SA_PLANS.reduce((s,x)=>s+x.price*x.count,0)) * 100);
        return `<div class="sa-bar-col" style="animation-delay:${i*80}ms">
          <div class="sa-bar" style="height:${h}%;background:${p.color};min-height:4px" data-tip="${p.name}: $${(p.price*p.count).toLocaleString()}/mo"></div>
          <div class="sa-bar-label">${p.name}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

// ── USERS VIEW ───────────────────────────────────
function saUsersHTML(data) {
  const usr = data.users;
  const total = usr[usr.length-1];
  const new_ = Math.round(total * 0.08);
  const active = Math.round(total * 0.74);
  const spark7 = usr.slice(-7);
  return `
  <div class="sa-kpis" style="grid-template-columns:repeat(3,1fr)">
    ${saKpiHTML('Total Users', total.toLocaleString(), '8.1%', true, spark7, '#60a5fa')}
    ${saKpiHTML('New This Period', '+'+new_.toLocaleString(), '14.2%', true, spark7.map(v=>Math.round(v*0.08)), '#34d399')}
    ${saKpiHTML('Active (30d)', active.toLocaleString(), '3.7%', true, spark7.map(v=>Math.round(v*0.74)), '#a78bfa')}
  </div>
  <div class="sa-chart-panel" style="margin-bottom:16px">
    <div class="sa-chart-title">User Growth</div>
    <div class="sa-chart-sub">Cumulative active users over time</div>
    <div class="sa-line-wrap"><canvas class="sa-canvas" id="saUsrCanvas" height="140"></canvas></div>
  </div>
  ${saCustomerTableHTML(SA_CUSTOMERS)}`;
}

// ── CHURN VIEW ───────────────────────────────────
function saChurnHTML(data) {
  const churn = data.churn;
  const rate = ((churn[churn.length-1] / data.users[data.users.length-1])*100).toFixed(1);
  const total = churn.reduce((s,v)=>s+v,0);
  const lost = Math.round(total * 149); // avg rev per churned
  const spark7 = churn.slice(-7);
  return `
  <div class="sa-kpis" style="grid-template-columns:repeat(3,1fr)">
    ${saKpiHTML('Churn Rate', rate+'%', '0.2%', false, spark7, '#f87171')}
    ${saKpiHTML('Churned Users', total.toLocaleString(), '18%', false, spark7, '#fb923c')}
    ${saKpiHTML('Revenue Lost', '$'+(lost/1000).toFixed(0)+'k', '11%', false, spark7.map(v=>v*149), '#fbbf24')}
  </div>
  <div class="sa-chart-panel" style="margin-bottom:16px">
    <div class="sa-chart-title">Churn Over Time</div>
    <div class="sa-chart-sub">Daily churned users — lower is better</div>
    <div class="sa-line-wrap"><canvas class="sa-canvas" id="saChurnCanvas" height="140"></canvas></div>
  </div>
  ${saCustomerTableHTML(SA_CUSTOMERS.filter(c=>c.status==='churned').concat(SA_CUSTOMERS.filter(c=>c.status!=='churned')))}`;
}

// ── PLANS VIEW ───────────────────────────────────
function saPlansHTML(data) {
  const total = SA_PLANS.reduce((s,p)=>s+p.count,0);
  const totalMRR = SA_PLANS.reduce((s,p)=>s+p.price*p.count,0);
  return `
  <div class="sa-kpis" style="grid-template-columns:repeat(3,1fr)">
    ${saKpiHTML('Total MRR', '$'+(totalMRR/1000).toFixed(1)+'k', '9.3%', true, data.revenue.slice(-7), '#FF6B35')}
    ${saKpiHTML('Paid Accounts', total+'', '5', true, [total,total,total,total,total,total,total], '#a78bfa')}
    ${saKpiHTML('ARPU', '$'+Math.round(totalMRR/total)+'', '6.2%', true, data.mrr.slice(-7), '#60a5fa')}
  </div>
  <div class="sa-charts" style="grid-template-columns:1fr 1fr">
    ${SA_PLANS.map(p => `
    <div class="sa-chart-panel">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <div class="sa-chart-title">${p.name}</div>
          <div class="sa-chart-sub">$${p.price}/mo · up to ${p.seats === 999 ? 'unlimited' : p.seats} seats</div>
        </div>
        <div style="width:10px;height:10px;border-radius:50%;background:${p.color};flex-shrink:0"></div>
      </div>
      <div style="font-family:'Fraunces',serif;font-size:28px;font-weight:600;color:var(--ink);letter-spacing:-1px">${p.count}</div>
      <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted);margin-top:4px">accounts</div>
      <div style="margin-top:10px;height:5px;background:var(--border);border-radius:3px">
        <div style="height:100%;width:${Math.round(p.count/total*100)}%;background:${p.color};border-radius:3px;transition:width 0.6s cubic-bezier(0.23,1,0.32,1)"></div>
      </div>
      <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--ink-muted);margin-top:6px">${Math.round(p.count/total*100)}% of accounts · $${(p.price*p.count).toLocaleString()}/mo MRR</div>
    </div>`).join('')}
  </div>`;
}

// ── SHARED COMPONENTS ────────────────────────────
function saPlanDonutHTML() {
  const total = SA_PLANS.reduce((s,p)=>s+p.count,0);
  const r=46, cx=60, cy=60, circ=2*Math.PI*r;
  let html = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="10"/>`;
  let offset = 0;
  SA_PLANS.forEach(p => {
    const frac = p.count/total;
    const dash = frac*circ;
    html += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.color}" stroke-width="10"
      stroke-dasharray="${dash} ${circ-dash}" stroke-dashoffset="${-offset}" stroke-linecap="round"/>`;
    offset += dash;
  });
  return `
  <div class="sa-donut-wrap">
    <svg class="sa-donut-svg" viewBox="0 0 120 120">${html}</svg>
    <div class="sa-donut-center">
      <div class="sa-donut-pct">${total}</div>
      <div class="sa-donut-lbl">accounts</div>
    </div>
  </div>
  <div class="sa-legend-list">
    ${SA_PLANS.map(p=>`<div class="sa-legend-row"><div class="sa-legend-dot" style="background:${p.color}"></div><span style="flex:1">${p.name}</span><span>${p.count} · $${(p.price*p.count/1000).toFixed(1)}k</span></div>`).join('')}
  </div>`;
}

function saCustomerTableHTML(rows, compact=false) {
  return `
  <div class="sa-table-panel">
    <div class="sa-table-head">
      <span class="sa-table-title">Customers</span>
      <input class="sa-search-input" id="saSearchInput" placeholder="Search customers..." oninput="saFilterTable(this.value)">
    </div>
    <table class="sa-table" id="saCustomerTable">
      <thead><tr>
        <th>Company</th>
        <th>Email</th>
        <th>Plan</th>
        <th>MRR</th>
        <th>Status</th>
        ${!compact ? '<th>Joined</th>' : ''}
      </tr></thead>
      <tbody id="saTableBody">
        ${saTableRows(rows, compact)}
      </tbody>
    </table>
  </div>`;
}

function saTableRows(rows, compact=false) {
  return rows.map(c => `
    <tr>
      <td style="font-weight:600">${c.name}</td>
      <td style="font-family:'DM Mono',monospace;font-size:11px;color:var(--ink-muted)">${c.email}</td>
      <td>${c.plan}</td>
      <td style="font-family:'Fraunces',serif;font-weight:600">$${c.mrr.toLocaleString()}</td>
      <td><span class="sa-badge ${c.status}">${c.status}</span></td>
      ${!compact ? `<td style="font-family:'DM Mono',monospace;font-size:11px;color:var(--ink-muted)">${c.joined}</td>` : ''}
    </tr>`).join('');
}

function saFilterTable(q) {
  SA.searchQ = q.toLowerCase();
  const filtered = SA_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(SA.searchQ) ||
    c.email.toLowerCase().includes(SA.searchQ) ||
    c.plan.toLowerCase().includes(SA.searchQ) ||
    c.status.toLowerCase().includes(SA.searchQ)
  );
  const body = document.getElementById('saTableBody');
  if (body) body.innerHTML = saTableRows(filtered);
}

function saBindSearch() {
  const inp = document.getElementById('saSearchInput');
  if (inp && SA.searchQ) inp.value = SA.searchQ;
}

// ── LINE CHART (canvas) ──────────────────────────
function saDrawLineChart(id, data, labels, color) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  const H = canvas.height;
  canvas.width = W;

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);

  const pad = { t:8, r:8, b:24, l:40 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  const min = Math.min(...data) * 0.92;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;

  const xStep = cW / (data.length - 1);
  const pts = data.map((v,i) => ({ x: pad.l + i*xStep, y: pad.t + cH - ((v-min)/range)*cH }));

  // Grid lines
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(26,22,18,0.06)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (cH/4)*i;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    // Y labels
    const val = max - (range/4)*i;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,22,18,0.4)';
    ctx.font = '9px DM Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(val > 1000 ? '$'+(val/1000).toFixed(0)+'k' : Math.round(val), pad.l - 4, y + 3);
  }

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + cH);
  grad.addColorStop(0, color + '33');
  grad.addColorStop(1, color + '00');
  ctx.beginPath();
  pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
  ctx.lineTo(pts[pts.length-1].x, pad.t+cH);
  ctx.lineTo(pts[0].x, pad.t+cH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots + X labels (sparse)
  const labelStep = Math.max(1, Math.floor(data.length / 6));
  pts.forEach((p,i) => {
    // dot on hover candidate
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
    ctx.fillStyle = color; ctx.fill();

    if (i % labelStep === 0 || i === data.length-1) {
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,22,18,0.4)';
      ctx.font = '9px DM Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], p.x, H - 4);
    }
  });

  // Store pts on canvas for tooltip
  canvas._saPts = pts;
  canvas._saData = data;
  canvas._saLabels = labels;
  canvas._saColor = color;
}

// ── TOOLTIPS ────────────────────────────────────
function saBindTooltips() {
  document.querySelectorAll('[data-tip]').forEach(el => {
    el.addEventListener('mouseenter', e => {
      const tt = document.getElementById('saTooltip');
      tt.textContent = e.target.dataset.tip;
      tt.classList.add('show');
    });
    el.addEventListener('mousemove', e => {
      const tt = document.getElementById('saTooltip');
      tt.style.left = (e.clientX + 12) + 'px';
      tt.style.top  = (e.clientY - 28) + 'px';
    });
    el.addEventListener('mouseleave', () => {
      document.getElementById('saTooltip').classList.remove('show');
    });
  });

  // Canvas chart hover tooltip
  document.querySelectorAll('canvas.sa-canvas').forEach(canvas => {
    canvas.addEventListener('mousemove', e => {
      if (!canvas._saPts) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      // Find nearest point
      let nearest = null, nearDist = Infinity;
      canvas._saPts.forEach((p,i) => {
        const d = Math.abs(p.x - mx);
        if (d < nearDist) { nearDist = d; nearest = i; }
      });
      if (nearest !== null && nearDist < 20) {
        const tt = document.getElementById('saTooltip');
        const val = canvas._saData[nearest];
        const lbl = canvas._saLabels[nearest];
        tt.textContent = lbl + ': ' + (val > 1000 ? '$' + (val/1000).toFixed(1) + 'k' : val);
        tt.style.left = (e.clientX + 12) + 'px';
        tt.style.top  = (e.clientY - 28) + 'px';
        tt.classList.add('show');
      }
    });
    canvas.addEventListener('mouseleave', () => {
      document.getElementById('saTooltip').classList.remove('show');
    });
  });
}

// ── POPOUT ───────────────────────────────────────
function popoutSaaS() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'SaaSAnalytics', 'width=980,height=700,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Synapse Analytics</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--trans:all 0.3s cubic-bezier(0.23,1,0.32,1);}
[data-theme="dark"]{--bg:#0A0A0A;--surface:#111;--surface2:#181818;--border:rgba(255,255,255,0.07);--border-em:rgba(255,107,53,0.22);--ink:#FAF7F2;--ink-soft:#C8C0B8;--ink-muted:#666;--accent:#FF6B35;--accent-deep:#E8521A;--accent-glow:rgba(255,107,53,0.12);}
[data-theme="light"]{--bg:#FAF7F2;--surface:#fff;--surface2:#F5F0E8;--border:rgba(26,22,18,0.08);--border-em:rgba(212,82,26,0.18);--ink:#1A1612;--ink-soft:#3D3730;--ink-muted:#9B9086;--accent:#D4521A;--accent-deep:#B84416;--accent-glow:rgba(212,82,26,0.08);}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;height:100vh;display:flex;overflow:hidden;}
.sidebar{width:200px;flex-shrink:0;background:var(--surface2);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:18px 10px;}
[data-theme="dark"] .sidebar{background:rgba(255,255,255,0.025);}
.brand{display:flex;align-items:center;gap:8px;padding:0 6px;margin-bottom:22px;}
.brand-mark{width:26px;height:26px;border-radius:7px;background:var(--accent);color:white;font-family:'Fraunces',serif;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.brand-name{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:var(--ink);}
.nav{display:flex;flex-direction:column;gap:2px;flex:1;}
.nav-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:transparent;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500;color:var(--ink-muted);cursor:pointer;transition:var(--trans);text-align:left;}
.nav-btn:hover{background:var(--accent-glow);color:var(--ink);}
.nav-btn.on{background:var(--accent-glow);color:var(--accent);font-weight:700;border:1px solid var(--border-em);}
.nav-bottom{display:flex;align-items:center;gap:6px;padding-top:14px;border-top:1px solid var(--border);margin-top:auto;}
.theme-btn{padding:5px 10px;border-radius:100px;background:rgba(128,128,128,0.08);border:1px solid var(--border);color:var(--ink-muted);font-family:'DM Mono',monospace;font-size:10px;cursor:pointer;transition:var(--trans);}
.theme-btn:hover{border-color:var(--accent);color:var(--accent);}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--border);flex-shrink:0;}
.page-title{font-family:'Fraunces',serif;font-size:17px;font-weight:600;color:var(--ink);letter-spacing:-0.4px;}
.page-sub{font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted);margin-top:2px;}
.topbar-r{display:flex;align-items:center;gap:8px;}
select.sa-sel{padding:6px 10px;border-radius:100px;background:var(--surface2);border:1px solid var(--border);color:var(--ink);font-family:'DM Mono',monospace;font-size:11px;cursor:pointer;outline:none;}
.exp-btn{padding:6px 12px;border-radius:100px;background:transparent;border:1px solid var(--border);color:var(--ink-muted);font-family:'DM Mono',monospace;font-size:11px;cursor:pointer;transition:var(--trans);}
.exp-btn:hover{border-color:var(--accent);color:var(--accent);}
.view{flex:1;overflow-y:auto;padding:18px 22px;scrollbar-width:thin;}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;}
.kpi{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px;transition:var(--trans);cursor:default;}
[data-theme="dark"] .kpi{background:rgba(255,255,255,0.03);}
.kpi:hover{border-color:var(--border-em);transform:translateY(-1px);}
.kpi-lbl{font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:1.4px;color:var(--ink-muted);margin-bottom:6px;}
.kpi-val{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:var(--ink);letter-spacing:-1px;line-height:1;}
.kpi-d{font-family:'DM Mono',monospace;font-size:10px;margin-top:5px;}
.kpi-spark{display:flex;align-items:flex-end;gap:2px;height:20px;margin-top:8px;}
.ksp{flex:1;border-radius:2px 2px 0 0;}
.charts{display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-bottom:18px;}
.cpanel{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;}
[data-theme="dark"] .cpanel{background:rgba(255,255,255,0.03);}
.ct{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;color:var(--ink);margin-bottom:3px;}
.cs{font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted);margin-bottom:14px;}
canvas.lc{width:100%;border-radius:4px;}
.bc{display:flex;align-items:flex-end;gap:5px;height:100px;}
.bc-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%;justify-content:flex-end;}
.bc-bar{width:100%;border-radius:3px 3px 0 0;cursor:pointer;transition:opacity .2s;}
.bc-bar:hover{opacity:.75;}
.bc-lbl{font-family:'DM Mono',monospace;font-size:9px;color:var(--ink-muted);}
.dnw{position:relative;width:100px;height:100px;margin:0 auto 12px;}
.dn{width:100%;height:100%;transform:rotate(-90deg);}
.dnc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.dn-pct{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink);letter-spacing:-1px;}
.dn-lbl{font-family:'DM Mono',monospace;font-size:9px;color:var(--ink-muted);text-transform:uppercase;letter-spacing:1px;}
.leg{display:flex;flex-direction:column;gap:5px;}
.leg-row{display:flex;align-items:center;gap:6px;font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-soft);}
.leg-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.tpanel{background:var(--surface2);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:16px;}
[data-theme="dark"] .tpanel{background:rgba(255,255,255,0.03);}
.thead{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);}
.ttitle{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;color:var(--ink);}
.tsearch{padding:5px 11px;border-radius:100px;background:var(--surface);border:1px solid var(--border);color:var(--ink);font-family:'DM Mono',monospace;font-size:11px;outline:none;width:150px;transition:border-color .2s;}
.tsearch:focus{border-color:var(--accent);}
table{width:100%;border-collapse:collapse;}
th{padding:9px 16px;font-family:'DM Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:var(--ink-muted);text-align:left;border-bottom:1px solid var(--border);background:var(--surface2);}
[data-theme="dark"] th{background:rgba(255,255,255,0.02);}
td{padding:10px 16px;font-size:12px;color:var(--ink);border-bottom:1px solid var(--border);transition:background .15s;}
tr:last-child td{border-bottom:none;}
tbody tr:hover td{background:var(--accent-glow);}
.badge{display:inline-flex;padding:2px 7px;border-radius:100px;font-family:'DM Mono',monospace;font-size:9px;font-weight:600;}
.badge.active{background:rgba(22,163,74,.12);color:#16a34a;border:1px solid rgba(22,163,74,.2);}
.badge.trial{background:rgba(245,158,11,.12);color:#d97706;border:1px solid rgba(245,158,11,.2);}
.badge.churned{background:rgba(220,38,38,.1);color:#dc2626;border:1px solid rgba(220,38,38,.15);}
.toast{position:fixed;bottom:16px;right:16px;padding:10px 14px;background:var(--surface);border:1px solid var(--border-em);border-radius:10px;font-size:12px;font-weight:600;color:var(--ink);transform:translateY(50px);opacity:0;transition:all .3s cubic-bezier(.23,1,.32,1);z-index:999;}
.toast.show{transform:translateY(0);opacity:1;}
.tooltip{position:fixed;z-index:9999;background:var(--surface);border:1px solid var(--border-em);border-radius:7px;padding:6px 10px;font-family:'DM Mono',monospace;font-size:11px;color:var(--ink);pointer-events:none;opacity:0;transition:opacity .15s;box-shadow:0 4px 16px rgba(0,0,0,.2);}
.tooltip.show{opacity:1;}
@keyframes saBI{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.bc-bar{transform-origin:bottom;animation:saBI .5s cubic-bezier(.23,1,.32,1) both;}
</style></head><body>
<div class="sidebar">
  <div class="brand"><div class="brand-mark">S</div><span class="brand-name">Synapse</span></div>
  <nav class="nav" id="navEl">
    <button class="nav-btn on" onclick="sv('overview',this)">📊 Overview</button>
    <button class="nav-btn" onclick="sv('revenue',this)">💵 Revenue</button>
    <button class="nav-btn" onclick="sv('users',this)">👥 Users</button>
    <button class="nav-btn" onclick="sv('churn',this)">📉 Churn</button>
    <button class="nav-btn" onclick="sv('plans',this)">⭐ Plans</button>
  </nav>
  <div class="nav-bottom">
    <button class="theme-btn" onclick="document.documentElement.setAttribute('data-theme',document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');rerender()">◑ Theme</button>
  </div>
</div>
<div class="main">
  <div class="topbar">
    <div><div class="page-title" id="ptitle">Overview</div><div class="page-sub" id="psub">All metrics · Last 30 days</div></div>
    <div class="topbar-r">
      <select class="sa-sel" id="rng" onchange="rerender()">
        <option value="7">Last 7 days</option>
        <option value="30" selected>Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="365">Last year</option>
      </select>
      <button class="exp-btn" onclick="toast('Exporting CSV... (just kidding 😅)')">↓ Export</button>
    </div>
  </div>
  <div class="view" id="vw"></div>
</div>
<div class="tooltip" id="tip"></div>
<div class="toast" id="toastEl"></div>
<script>
const PLANS=[{name:'Starter',price:49,seats:3,count:3,color:'#60a5fa'},{name:'Pro',price:149,seats:10,count:5,color:'#a78bfa'},{name:'Enterprise',price:1200,seats:999,count:4,color:'#FF6B35'}];
const CUSTS=[{name:'Acme Corp',email:'ops@acme.io',plan:'Enterprise',mrr:1200,status:'active',joined:'2023-03-12'},{name:'Bubble Studio',email:'hi@bubble.co',plan:'Pro',mrr:149,status:'active',joined:'2024-01-08'},{name:'DataForge',email:'team@dataforge.dev',plan:'Enterprise',mrr:2400,status:'active',joined:'2022-11-01'},{name:'Echo Analytics',email:'admin@echo.ai',plan:'Pro',mrr:149,status:'trial',joined:'2024-11-20'},{name:'FlyBase',email:'billing@flybase.io',plan:'Starter',mrr:49,status:'churned',joined:'2023-08-15'},{name:'Grova Health',email:'fin@grova.com',plan:'Enterprise',mrr:3600,status:'active',joined:'2022-06-22'},{name:'Hive Collective',email:'pay@hive.co',plan:'Pro',mrr:149,status:'active',joined:'2023-12-03'},{name:'Inkform',email:'hello@inkform.io',plan:'Starter',mrr:49,status:'trial',joined:'2024-10-18'},{name:'Juno Ops',email:'ops@juno.run',plan:'Pro',mrr:149,status:'active',joined:'2024-02-27'},{name:'Kaleidoscope',email:'sub@kaleid.xyz',plan:'Enterprise',mrr:1800,status:'active',joined:'2023-05-14'},{name:'Lumi Devices',email:'acct@lumi.tech',plan:'Pro',mrr:149,status:'churned',joined:'2023-07-30'},{name:'Metronode',email:'pay@metronode.io',plan:'Starter',mrr:49,status:'active',joined:'2024-09-02'}];
let CUR={view:'overview',range:30};
function rnd(n,b,v,t){const o=[];let x=b;for(let i=0;i<n;i++){x+=t+(Math.random()-.45)*v;x=Math.max(b*.2,x);o.push(Math.round(x));}return o;}
function dat(r){const rev=rnd(r,48000,4000,300),usr=rnd(r,12000,600,80),churn=rnd(r,230,30,-2).map(v=>Math.max(10,v));
const labels=Array.from({length:r},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(r-1-i));return r<=7?d.toLocaleDateString('en-US',{weekday:'short'}):r<=90?d.toLocaleDateString('en-US',{month:'short',day:'numeric'}):d.toLocaleDateString('en-US',{month:'short'});});
return{rev,usr,churn,labels};}
function sv(view,btn){CUR.view=view;document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');const t={overview:'Overview',revenue:'Revenue',users:'Users',churn:'Churn',plans:'Plans'};document.getElementById('ptitle').textContent=t[view];rerender();}
function rerender(){CUR.range=parseInt(document.getElementById('rng').value);render();}
function render(){const d=dat(CUR.range),el=document.getElementById('vw');
if(CUR.view==='overview')el.innerHTML=ovHTML(d);
else if(CUR.view==='revenue')el.innerHTML=revHTML(d);
else if(CUR.view==='users')el.innerHTML=usrHTML(d);
else if(CUR.view==='churn')el.innerHTML=churnHTML(d);
else el.innerHTML=plansHTML(d);
requestAnimationFrame(()=>{['lc1','lc2','lc3'].forEach(id=>{const c=document.getElementById(id);if(c)drawLine(c,c.dataset.vals?JSON.parse(c.dataset.vals):d.rev,JSON.parse(c.dataset.lbls||'[]')||d.labels,c.dataset.color||'#FF6B35');});bindTT();});}
function kpi(lbl,val,delta,pos,spark,color){const dc=pos?'#16a34a':'#dc2626',arr=pos?'↑':'↓',mx=Math.max(...spark);return'<div class="kpi"><div class="kpi-lbl">'+lbl+'</div><div class="kpi-val">'+val+'</div><div class="kpi-d" style="color:'+dc+'">'+arr+' '+delta+'</div><div class="kpi-spark">'+spark.map((v,i)=>'<div class="ksp" style="height:'+Math.round(v/mx*100)+'%;background:'+color+';opacity:'+(0.3+0.7*(v/mx))+';animation-delay:'+(i*25)+'ms"></div>').join('')+'</div></div>';}
function donut(){const tot=PLANS.reduce((s,p)=>s+p.count,0),r=46,cx=60,cy=60,circ=2*Math.PI*r;let html='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--border)" stroke-width="10"/>',off=0;PLANS.forEach(p=>{const d=p.count/tot*circ;html+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+p.color+'" stroke-width="10" stroke-dasharray="'+d+' '+(circ-d)+'" stroke-dashoffset="'+(-off)+'" stroke-linecap="round"/>';off+=d;});return'<div class="dnw"><svg class="dn" viewBox="0 0 120 120">'+html+'</svg><div class="dnc"><div class="dn-pct">'+tot+'</div><div class="dn-lbl">accts</div></div></div><div class="leg">'+PLANS.map(p=>'<div class="leg-row"><div class="leg-dot" style="background:'+p.color+'"></div><span style="flex:1">'+p.name+'</span><span>'+p.count+' · $'+(p.price*p.count/1000).toFixed(1)+'k</span></div>').join('')+'</div>';}
function tbl(rows){return'<div class="tpanel"><div class="thead"><span class="ttitle">Customers</span><input class="tsearch" placeholder="Search..." oninput="filt(this.value)"></div><table><thead><tr><th>Company</th><th>Plan</th><th>MRR</th><th>Status</th><th>Joined</th></tr></thead><tbody id="tb">'+rows.map(c=>'<tr><td style="font-weight:600">'+c.name+'</td><td>'+c.plan+'</td><td style="font-family:\'Fraunces\',serif;font-weight:600">$'+c.mrr+'</td><td><span class="badge '+c.status+'">'+c.status+'</span></td><td style="font-family:\'DM Mono\',monospace;font-size:11px;color:var(--ink-muted)">'+c.joined+'</td></tr>').join('')+'</tbody></table></div>';}
function filt(q){const rows=CUSTS.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||c.plan.toLowerCase().includes(q.toLowerCase())||c.status.toLowerCase().includes(q.toLowerCase()));const tb=document.getElementById('tb');if(tb)tb.innerHTML=rows.map(c=>'<tr><td style="font-weight:600">'+c.name+'</td><td>'+c.plan+'</td><td style="font-family:\'Fraunces\',serif;font-weight:600">$'+c.mrr+'</td><td><span class="badge '+c.status+'">'+c.status+'</span></td><td style="font-family:\'DM Mono\',monospace;font-size:11px;color:var(--ink-muted)">'+c.joined+'</td></tr>').join('');}
function ovHTML(d){const rev=d.rev,usr=d.usr,tot=rev[rev.length-1],sp7=rev.slice(-7),sp7u=usr.slice(-7);return'<div class="kpis">'+kpi('MRR','$'+(tot/1000).toFixed(1)+'k','12.4%',true,sp7,'#FF6B35')+kpi('Active Users',usr[usr.length-1].toLocaleString(),'8.1%',true,sp7u,'#60a5fa')+kpi('Churn Rate','2.3%','0.2%',false,d.churn.slice(-7),'#f87171')+kpi('Revenue','$'+(tot/1000).toFixed(1)+'k','9.3%',true,sp7,'#a78bfa')+'</div><div class="charts"><div class="cpanel"><div class="ct">Revenue Trend</div><div class="cs">Daily revenue</div><canvas class="lc" id="lc1" height="110" data-vals=\''+JSON.stringify(rev)+'\' data-lbls=\''+JSON.stringify(d.labels)+'\' data-color="#FF6B35"></canvas></div><div class="cpanel"><div class="ct">Plan Mix</div><div class="cs">By account count</div>'+donut()+'</div></div>'+tbl(CUSTS);}
function revHTML(d){const rev=d.rev,tot=rev.reduce((s,v)=>s+v,0),avg=Math.round(tot/rev.length),peak=Math.max(...rev);return'<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+kpi('Total Revenue','$'+(tot/1000).toFixed(0)+'k','12.4%',true,rev.slice(-7),'#FF6B35')+kpi('Daily Avg','$'+avg.toLocaleString(),'8.1%',true,rev.slice(-7),'#fbbf24')+kpi('Peak Day','$'+peak.toLocaleString(),'this period',true,rev.slice(-7),'#a78bfa')+'</div><div class="cpanel" style="margin-bottom:14px"><div class="ct">Revenue Over Time</div><div class="cs">Daily revenue</div><canvas class="lc" id="lc2" height="150" data-vals=\''+JSON.stringify(rev)+'\' data-lbls=\''+JSON.stringify(d.labels)+'\' data-color="#FF6B35"></canvas></div><div class="cpanel"><div class="ct">Revenue by Plan</div><div class="cs">Monthly breakdown</div><div class="bc">'+PLANS.map((p,i)=>'<div class="bc-col" style="animation-delay:'+(i*80)+'ms"><div class="bc-bar" data-tip="'+p.name+': $'+(p.price*p.count).toLocaleString()+'/mo" style="height:'+Math.round(p.price*p.count/PLANS.reduce((s,x)=>s+x.price*x.count,0)*100)+'%;background:'+p.color+';min-height:4px"></div><div class="bc-lbl">'+p.name+'</div></div>').join('')+'</div></div>';}
function usrHTML(d){const usr=d.usr,tot=usr[usr.length-1];return'<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+kpi('Total Users',tot.toLocaleString(),'8.1%',true,usr.slice(-7),'#60a5fa')+kpi('New This Period','+'+Math.round(tot*.08).toLocaleString(),'14.2%',true,usr.slice(-7).map(v=>Math.round(v*.08)),'#34d399')+kpi('Active (30d)',Math.round(tot*.74).toLocaleString(),'3.7%',true,usr.slice(-7).map(v=>Math.round(v*.74)),'#a78bfa')+'</div><div class="cpanel" style="margin-bottom:14px"><div class="ct">User Growth</div><div class="cs">Cumulative users</div><canvas class="lc" id="lc3" height="140" data-vals=\''+JSON.stringify(usr)+'\' data-lbls=\''+JSON.stringify(d.labels)+'\' data-color="#60a5fa"></canvas></div>'+tbl(CUSTS);}
function churnHTML(d){const c=d.churn,rate=((c[c.length-1]/d.usr[d.usr.length-1])*100).toFixed(1);return'<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+kpi('Churn Rate',rate+'%','0.2%',false,c.slice(-7),'#f87171')+kpi('Churned Users',c.reduce((s,v)=>s+v,0).toLocaleString(),'18%',false,c.slice(-7),'#fb923c')+kpi('Revenue Lost','$'+(c.reduce((s,v)=>s+v,0)*149/1000).toFixed(0)+'k','11%',false,c.slice(-7).map(v=>v*149),'#fbbf24')+'</div><div class="cpanel" style="margin-bottom:14px"><div class="ct">Churn Over Time</div><div class="cs">Daily churned users</div><canvas class="lc" id="lc3" height="140" data-vals=\''+JSON.stringify(c)+'\' data-lbls=\''+JSON.stringify(d.labels)+'\' data-color="#f87171"></canvas></div>'+tbl(CUSTS.filter(x=>x.status==='churned').concat(CUSTS.filter(x=>x.status!=='churned')));}
function plansHTML(){const tot=PLANS.reduce((s,p)=>s+p.count,0),tmrr=PLANS.reduce((s,p)=>s+p.price*p.count,0);return'<div class="kpis" style="grid-template-columns:repeat(3,1fr)">'+kpi('Total MRR','$'+(tmrr/1000).toFixed(1)+'k','9.3%',true,[1,2,3,4,5,6,7],'#FF6B35')+kpi('Paid Accounts',tot+'','5',true,[tot,tot,tot,tot,tot,tot,tot],'#a78bfa')+kpi('ARPU','$'+Math.round(tmrr/tot),'6.2%',true,[1,2,3,4,5,6,7],'#60a5fa')+'</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'+PLANS.map(p=>'<div class="cpanel"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><div><div class="ct">'+p.name+'</div><div class="cs">$'+p.price+'/mo</div></div><div style="width:9px;height:9px;border-radius:50%;background:'+p.color+'"></div></div><div style="font-family:\'Fraunces\',serif;font-size:28px;font-weight:600;color:var(--ink);letter-spacing:-1px">'+p.count+'</div><div style="font-family:\'DM Mono\',monospace;font-size:10px;color:var(--ink-muted);margin-top:3px">accounts</div><div style="margin-top:10px;height:4px;background:var(--border);border-radius:2px"><div style="height:100%;width:'+Math.round(p.count/tot*100)+'%;background:'+p.color+';border-radius:2px"></div></div><div style="font-family:\'DM Mono\',monospace;font-size:10px;color:var(--ink-muted);margin-top:5px">'+Math.round(p.count/tot*100)+'% · $'+(p.price*p.count).toLocaleString()+'/mo</div></div>').join('')+'</div>';}
function drawLine(canvas,data,labels,color){const ctx=canvas.getContext('2d'),W=canvas.offsetWidth||500,H=canvas.height;canvas.width=W;const dk=document.documentElement.getAttribute('data-theme')!=='light';ctx.clearRect(0,0,W,H);const pad={t:8,r:8,b:22,l:38},cW=W-pad.l-pad.r,cH=H-pad.t-pad.b,mn=Math.min(...data)*.92,mx=Math.max(...data)*1.05,rng=mx-mn||1,xS=cW/(data.length-1),pts=data.map((v,i)=>({x:pad.l+i*xS,y:pad.t+cH-((v-mn)/rng)*cH}));ctx.strokeStyle=dk?'rgba(255,255,255,0.05)':'rgba(26,22,18,0.06)';ctx.lineWidth=.5;for(let i=0;i<=4;i++){const y=pad.t+(cH/4)*i;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();const val=mx-(rng/4)*i;ctx.fillStyle=dk?'rgba(255,255,255,.3)':'rgba(26,22,18,.4)';ctx.font='9px DM Mono,monospace';ctx.textAlign='right';ctx.fillText(val>1000?'$'+(val/1000).toFixed(0)+'k':Math.round(val),pad.l-4,y+3);}const g=ctx.createLinearGradient(0,pad.t,0,pad.t+cH);g.addColorStop(0,color+'33');g.addColorStop(1,color+'00');ctx.beginPath();pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,pad.t+cH);ctx.lineTo(pts[0].x,pad.t+cH);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.beginPath();pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();const ls=Math.max(1,Math.floor(data.length/6));pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(i%ls===0||i===data.length-1){ctx.fillStyle=dk?'rgba(255,255,255,.3)':'rgba(26,22,18,.4)';ctx.font='9px DM Mono,monospace';ctx.textAlign='center';ctx.fillText(labels[i],p.x,H-3);}});canvas._pts=pts;canvas._d=data;canvas._l=labels;}
function bindTT(){const tt=document.getElementById('tip');document.querySelectorAll('[data-tip]').forEach(el=>{el.addEventListener('mouseenter',e=>{tt.textContent=e.target.dataset.tip;tt.classList.add('show');});el.addEventListener('mousemove',e=>{tt.style.left=(e.clientX+12)+'px';tt.style.top=(e.clientY-28)+'px';});el.addEventListener('mouseleave',()=>tt.classList.remove('show'));});document.querySelectorAll('canvas.lc').forEach(c=>{c.addEventListener('mousemove',e=>{if(!c._pts)return;const r=c.getBoundingClientRect(),mx=e.clientX-r.left;let ni=null,nd=Infinity;c._pts.forEach((p,i)=>{const d=Math.abs(p.x-mx);if(d<nd){nd=d;ni=i;}});if(ni!==null&&nd<20){const v=c._d[ni],l=c._l[ni];tt.textContent=l+': '+(v>1000?'$'+(v/1000).toFixed(1)+'k':v);tt.style.left=(e.clientX+12)+'px';tt.style.top=(e.clientY-28)+'px';tt.classList.add('show');}});c.addEventListener('mouseleave',()=>tt.classList.remove('show'));});}
let _tt;function toast(msg){const t=document.getElementById('toastEl');t.textContent=msg;t.classList.add('show');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),3000);}
render();
<\/script></body></html>`);
  win.document.close();
  closeSaaS();
  showToast('Synapse Analytics popped out! 📊');
}
