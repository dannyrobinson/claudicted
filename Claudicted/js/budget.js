/* ══════════════════════════════════════════════════
   BUDGET TRACKER STATE & LOGIC
══════════════════════════════════════════════════ */
const CAT_COLORS = ['#FF6B35','#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#06B6D4','#84CC16'];
const CAT_EMOJIS = { housing:'🏠', rent:'🏠', food:'🍔', groceries:'🛒', transport:'🚗', car:'🚗', entertainment:'🎬', netflix:'📺', gym:'💪', health:'💊', clothes:'👗', shopping:'🛍️', claude:'🤖', ai:'🤖', api:'🤖', utilities:'⚡', internet:'📡', savings:'💰', misc:'📦', coffee:'☕', travel:'✈️' };

let budgetData = {
  categories: [
    { id:1, name:'Housing',    emoji:'🏠', budget:2200, spent:1584, color:CAT_COLORS[0] },
    { id:2, name:'Food',       emoji:'🍔', budget:800,  spent:385,  color:CAT_COLORS[1] },
    { id:3, name:'Transport',  emoji:'🚗', budget:400,  spent:210,  color:CAT_COLORS[2] },
    { id:4, name:'Claude API', emoji:'🤖', budget:50,   spent:187,  color:'#dc2626'     },
  ],
  transactions: [
    { id:1, catId:4, note:'claude.ai Pro + API overrun', amount:187, time:'2 days ago' },
    { id:2, catId:1, note:'Monthly rent',                amount:1500, time:'3 days ago' },
    { id:3, catId:2, note:'Whole Foods run',             amount:143,  time:'5 days ago' },
    { id:4, catId:3, note:'Gas + Uber',                  amount:85,   time:'1 week ago' },
    { id:5, catId:2, note:'Takeout × 3',                 amount:94,   time:'1 week ago' },
  ],
  nextId: 10,
  nextTxnId: 20,
};

let spendingCatId = null;

function getEmoji(name) {
  const lower = name.toLowerCase();
  for (const [k,v] of Object.entries(CAT_EMOJIS)) { if (lower.includes(k)) return v; }
  return ['📦','🎯','⭐','🎪','🌟'][Math.floor(Math.random()*5)];
}

function totalBudget() { return budgetData.categories.reduce((s,c)=>s+c.budget,0); }
function totalSpent()  { return budgetData.categories.reduce((s,c)=>s+c.spent,0); }

/* ── OPEN / CLOSE ──────────────────────────────── */
function openBudget() {
  const now = new Date();
  document.getElementById('baMonth').textContent =
    now.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  renderBudget();
  document.getElementById('budgetModal').classList.add('open');
}
function closeBudget() { document.getElementById('budgetModal').classList.remove('open'); }
function closeBudgetBg(e) { if (e.target===document.getElementById('budgetModal')) closeBudget(); }

function popoutBudget() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'BudgetTracker', 'width=640,height=780,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  // Snapshot state into the new window
  const stateJson = JSON.stringify(budgetData);
  const month = document.getElementById('baMonth').textContent;

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Budget Tracker 💸</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --trans: all 0.3s cubic-bezier(0.23,1,0.32,1); }
[data-theme="dark"] {
  --bg:#0f0f0f; --surface:#161616; --surface2:#1e1e1e;
  --border:rgba(255,255,255,0.08); --border-em:rgba(255,107,53,0.22);
  --ink:#FAF7F2; --ink-soft:#C8C0B8; --ink-muted:#666;
  --accent:#FF6B35; --accent-deep:#E8521A; --accent-glow:rgba(255,107,53,0.12);
  --input-bg:rgba(255,255,255,0.04); --input-border:rgba(255,255,255,0.1);
}
[data-theme="light"] {
  --bg:#FAF7F2; --surface:#FFFFFF; --surface2:#F5F0E8;
  --border:rgba(26,22,18,0.08); --border-em:rgba(212,82,26,0.18);
  --ink:#1A1612; --ink-soft:#3D3730; --ink-muted:#9B9086;
  --accent:#D4521A; --accent-deep:#B84416; --accent-glow:rgba(212,82,26,0.08);
  --input-bg:#FFFFFF; --input-border:rgba(26,22,18,0.1);
}
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--ink); font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; padding:24px; }
.app { max-width:560px; margin:0 auto; }

.ba-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; gap:16px; }
.ba-header-left { display:flex; align-items:center; gap:12px; }
.ba-logo { font-size:28px; }
.ba-title { font-family:'Fraunces',serif; font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.5px; }
.ba-month { font-family:'DM Mono',monospace; font-size:11px; color:var(--ink-muted); margin-top:2px; }
.ba-header-right { display:flex; align-items:center; gap:20px; }
.ba-total-wrap { text-align:right; }
.ba-total-label { font-family:'DM Mono',monospace; font-size:9px; text-transform:uppercase; letter-spacing:1.2px; color:var(--ink-muted); }
.ba-total { font-family:'Fraunces',serif; font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.5px; }
.theme-btn { width:32px;height:32px;border-radius:50%;background:rgba(128,128,128,0.1);border:none;cursor:pointer;color:var(--ink-muted);font-size:15px;display:flex;align-items:center;justify-content:center;transition:var(--trans); }
.theme-btn:hover { background:rgba(128,128,128,0.2);color:var(--ink); }

.ba-summary { display:flex; align-items:center; gap:24px; margin-bottom:24px; padding:20px; background:var(--surface2); border-radius:16px; border:1px solid var(--border); }
.ba-donut-wrap { position:relative; flex-shrink:0; width:100px; height:100px; }
.ba-donut { width:100%; height:100%; transform:rotate(-90deg); }
.ba-donut-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.ba-donut-pct { font-family:'Fraunces',serif; font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-1px; }
.ba-donut-sub { font-family:'DM Mono',monospace; font-size:9px; color:var(--ink-muted); text-transform:uppercase; letter-spacing:1px; }
.ba-legend { display:flex; flex-direction:column; gap:7px; flex:1; }
.ba-legend-item { display:flex; align-items:center; gap:8px; font-family:'DM Mono',monospace; font-size:11px; color:var(--ink-soft); }
.ba-legend-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.ba-legend-name { flex:1; }
.ba-legend-val { color:var(--ink-muted); font-size:10px; }

.ba-section-label { font-family:'DM Mono',monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--ink-muted); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.ba-txn-count { background:var(--accent-glow);color:var(--accent);border:1px solid var(--border-em);border-radius:100px;padding:1px 7px;font-size:10px; }
.ba-categories { display:flex; flex-direction:column; gap:8px; }
.ba-cat-row { display:grid; grid-template-columns:1fr auto; gap:10px; align-items:center; padding:14px 16px; background:var(--surface); border:1px solid var(--border); border-radius:12px; cursor:pointer; transition:var(--trans); position:relative; overflow:hidden; }
.ba-cat-row:hover { border-color:var(--border-em); transform:translateX(2px); }
.ba-cat-row.over-budget { border-color:rgba(220,38,38,0.3); }
.ba-cat-fill { position:absolute;left:0;top:0;bottom:0;border-radius:12px 0 0 12px;opacity:0.06;transition:width 0.6s cubic-bezier(0.23,1,0.32,1);pointer-events:none; }
.ba-cat-left { display:flex;flex-direction:column;gap:5px;position:relative; }
.ba-cat-top { display:flex;align-items:center;gap:10px; }
.ba-cat-emoji { font-size:16px; }
.ba-cat-name { font-size:13px;font-weight:600;color:var(--ink); }
.ba-cat-bar-wrap { height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-top:2px; }
.ba-cat-bar { height:100%;border-radius:2px;transition:width 0.6s cubic-bezier(0.23,1,0.32,1); }
.ba-cat-right { display:flex;flex-direction:column;align-items:flex-end;gap:4px;position:relative; }
.ba-cat-spent { font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:var(--ink);letter-spacing:-0.5px; }
.ba-cat-budget { font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted); }
.ba-cat-status { font-family:'DM Mono',monospace;font-size:10px; }
.ba-cat-actions { display:flex;gap:6px;margin-top:4px; }
.ba-cat-del { padding:3px 8px;border-radius:100px;font-size:10px;font-family:'DM Mono',monospace;font-weight:600;background:rgba(220,38,38,0.08);color:#dc2626;border:1px solid rgba(220,38,38,0.15);cursor:pointer;transition:var(--trans); }
.ba-cat-del:hover { background:rgba(220,38,38,0.15); }

.ba-add-row { display:flex;gap:8px;align-items:center;padding:12px 16px;border:1.5px dashed var(--border);border-radius:12px;margin-top:8px;transition:border-color 0.2s; }
.ba-add-row:focus-within { border-color:var(--accent);border-style:solid; }
.ba-input { flex:1;background:transparent;border:none;outline:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--ink); }
.ba-input::placeholder { color:var(--ink-muted); }
.ba-input-prefix { font-family:'DM Mono',monospace;font-size:13px;color:var(--ink-muted); }
.ba-input-num { flex:0 0 80px;font-family:'DM Mono',monospace; }
.ba-input-num::-webkit-inner-spin-button { -webkit-appearance:none; }
.ba-btn-add { padding:7px 16px;border-radius:100px;background:var(--accent);border:none;color:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:var(--trans);white-space:nowrap;flex-shrink:0; }
.ba-btn-add:hover { background:var(--accent-deep);transform:translateY(-1px); }

.ba-txns { display:flex;flex-direction:column;gap:6px;max-height:240px;overflow-y:auto;margin-top:4px; }
.ba-empty { font-family:'DM Mono',monospace;font-size:12px;color:var(--ink-muted);text-align:center;padding:24px; }
.ba-txn { display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:10px; }
.ba-txn-left { display:flex;align-items:center;gap:10px; }
.ba-txn-emoji { font-size:14px; }
.ba-txn-name { font-size:12px;font-weight:600;color:var(--ink); }
.ba-txn-note { font-size:11px;color:var(--ink-muted);font-family:'DM Mono',monospace; }
.ba-txn-right { display:flex;align-items:center;gap:10px; }
.ba-txn-amt { font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:var(--ink); }
.ba-txn-time { font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted); }
.ba-txn-del { background:none;border:none;cursor:pointer;color:var(--ink-muted);font-size:14px;opacity:0;transition:opacity 0.2s;padding:2px 4px; }
.ba-txn:hover .ba-txn-del { opacity:1; }

/* SPEND MODAL */
.spend-bg { position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.25s;z-index:100; }
.spend-bg.open { opacity:1;pointer-events:all; }
.spend-modal { background:var(--surface);border:1px solid var(--border);border-radius:20px;width:90%;max-width:340px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.3);transform:scale(0.94) translateY(12px);transition:all 0.3s cubic-bezier(0.23,1,0.32,1); }
.spend-bg.open .spend-modal { transform:scale(1) translateY(0); }
.spend-title { font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:var(--ink);margin-bottom:4px; }
.spend-cat-name { font-family:'DM Mono',monospace;font-size:12px;color:var(--accent);margin-bottom:4px; }
.spend-remaining { font-family:'DM Mono',monospace;font-size:11px;color:var(--ink-muted);margin-bottom:20px; }
.spend-field { margin-bottom:14px; }
.spend-field label { display:block;font-family:'DM Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--ink-muted);margin-bottom:7px; }
.spend-input-wrap { display:flex;align-items:center;gap:6px;background:var(--input-bg);border:1px solid var(--input-border);border-radius:10px;padding:10px 14px;transition:border-color 0.2s; }
.spend-input-wrap:focus-within { border-color:var(--accent); }
.spend-prefix { font-family:'DM Mono',monospace;font-size:14px;color:var(--ink-muted); }
.spend-input { background:none;border:none;outline:none;font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink);width:100%;letter-spacing:-0.5px; }
.spend-input-text { width:100%;background:var(--input-bg);border:1px solid var(--input-border);border-radius:10px;padding:10px 14px;font-family:'DM Mono',monospace;font-size:13px;color:var(--ink);outline:none;transition:border-color 0.2s; }
.spend-input-text:focus { border-color:var(--accent); }
.spend-preview { min-height:28px;font-family:'DM Mono',monospace;font-size:12px;color:var(--ink-muted);margin-bottom:16px;line-height:1.5; }
.spend-actions { display:flex;gap:10px;justify-content:flex-end; }
.ba-btn-cancel { padding:9px 18px;border-radius:100px;background:transparent;border:1px solid var(--border);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:var(--trans); }
.ba-btn-cancel:hover { border-color:var(--accent);color:var(--accent); }
.ba-btn-confirm { padding:9px 20px;border-radius:100px;background:var(--accent);border:none;color:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:var(--trans); }
.ba-btn-confirm:hover { background:var(--accent-deep);transform:translateY(-1px); }
.toast { position:fixed;bottom:20px;right:20px;padding:11px 16px;background:var(--surface);border:1px solid var(--border-em);border-radius:12px;font-size:13px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:8px;transform:translateY(60px);opacity:0;transition:all 0.35s cubic-bezier(0.23,1,0.32,1);z-index:999; }
.toast.show { transform:translateY(0);opacity:1; }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.ba-txn { animation:fadeIn 0.25s ease both; }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
</style>
</head>
<body>
<div class="app">
  <div class="ba-header">
    <div class="ba-header-left">
      <div class="ba-logo">&#x1F4B8;</div>
      <div>
        <div class="ba-title">Monthly Budget</div>
        <div class="ba-month" id="baMonth">${month}</div>
      </div>
    </div>
    <div class="ba-header-right">
      <div class="ba-total-wrap"><div class="ba-total-label">Total Spent</div><div class="ba-total" id="baTotalSpent">$0</div></div>
      <div class="ba-total-wrap"><div class="ba-total-label">Budget Left</div><div class="ba-total" id="baBudgetLeft">$0</div></div>
      <button class="theme-btn" onclick="toggleTheme()" title="Toggle theme">&#9680;</button>
    </div>
  </div>
  <div class="ba-summary">
    <div class="ba-donut-wrap"><svg class="ba-donut" viewBox="0 0 120 120" id="baDonut"></svg><div class="ba-donut-center"><div class="ba-donut-pct" id="baDPct">0%</div><div class="ba-donut-sub">used</div></div></div>
    <div class="ba-legend" id="baLegend"></div>
  </div>
  <div class="ba-section-label">Categories</div>
  <div class="ba-categories" id="baCategories"></div>
  <div class="ba-add-row" id="baAddRow">
    <input class="ba-input" id="baCatName" placeholder="Category name" maxlength="24">
    <div class="ba-input-prefix">$</div>
    <input class="ba-input ba-input-num" id="baCatBudget" placeholder="Budget" type="number" min="1">
    <button class="ba-btn-add" onclick="addCategory()">+ Add</button>
  </div>
  <div class="ba-section-label" style="margin-top:20px">Recent Transactions <span class="ba-txn-count" id="baTxnCount">0</span></div>
  <div class="ba-txns" id="baTxns"><div class="ba-empty">No transactions yet.</div></div>
</div>

<div class="spend-bg" id="spendBg" onclick="closeSpendBg(event)">
  <div class="spend-modal" id="spendModal">
    <div class="spend-title">Log Spend</div>
    <div class="spend-cat-name" id="spendCatName"></div>
    <div class="spend-remaining" id="spendRemaining"></div>
    <div class="spend-field"><label>Amount</label><div class="spend-input-wrap"><span class="spend-prefix">$</span><input class="spend-input" id="spendAmount" type="number" min="0.01" step="0.01" placeholder="0.00" oninput="updateSpendPreview()"></div></div>
    <div class="spend-field"><label>Note (optional)</label><input class="spend-input-text" id="spendNote" placeholder="e.g. Groceries run" maxlength="40" onkeydown="if(event.key==='Enter')confirmSpend()"></div>
    <div class="spend-preview" id="spendPreview"></div>
    <div class="spend-actions"><button class="ba-btn-cancel" onclick="closeSpend()">Cancel</button><button class="ba-btn-confirm" onclick="confirmSpend()">Log It</button></div>
  </div>
</div>
<div class="toast" id="toast"><span id="toastMsg"></span></div>

<script>
const CAT_COLORS=['#FF6B35','#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#06B6D4','#84CC16'];
const CAT_EMOJIS={housing:'&#x1F3E0;',rent:'&#x1F3E0;',food:'&#x1F354;',groceries:'&#x1F6D2;',transport:'&#x1F697;',car:'&#x1F697;',entertainment:'&#x1F3AC;',gym:'&#x1F4AA;',health:'&#x1F48A;',clothes:'&#x1F457;',shopping:'&#x1F6CD;&#xFE0F;',claude:'&#x1F916;',ai:'&#x1F916;',api:'&#x1F916;',utilities:'&#x26A1;',internet:'&#x1F4E1;',savings:'&#x1F4B0;',misc:'&#x1F4E6;',coffee:'&#x2615;',travel:'&#x2708;&#xFE0F;'};
let budgetData=${stateJson};
let spendingCatId=null;
function getEmoji(n){const l=n.toLowerCase();for(const[k,v]of Object.entries(CAT_EMOJIS)){if(l.includes(k))return v;}return['&#x1F4E6;','&#x1F3AF;','&#x2B50;'][Math.floor(Math.random()*3)];}
function totalBudget(){return budgetData.categories.reduce((s,c)=>s+c.budget,0);}
function totalSpent(){return budgetData.categories.reduce((s,c)=>s+c.spent,0);}
function fmt(n){return'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0});}
function toggleTheme(){const h=document.documentElement;h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark');}
function renderBudget(){
  const ts=totalSpent(),tb=totalBudget(),pct=tb>0?Math.min(Math.round(ts/tb*100),999):0,left=tb-ts;
  document.getElementById('baTotalSpent').textContent=fmt(ts);
  const le=document.getElementById('baBudgetLeft');le.textContent=left<0?'-'+fmt(Math.abs(left)):fmt(left);le.style.color=left<0?'#dc2626':'var(--accent)';
  document.getElementById('baDPct').textContent=pct+'%';
  renderDonut();renderLegend();renderCategories();renderTransactions();
}
function renderDonut(){
  const svg=document.getElementById('baDonut'),ts=totalSpent(),r=46,cx=60,cy=60,circ=2*Math.PI*r;
  let html='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--border)" stroke-width="10"/>',offset=0;
  budgetData.categories.forEach(c=>{if(c.spent<=0||ts<=0)return;const frac=c.spent/Math.max(ts,1),dash=frac*circ;html+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+c.color+'" stroke-width="10" stroke-dasharray="'+dash+' '+(circ-dash)+'" stroke-dashoffset="'+(-offset)+'" stroke-linecap="round"/>';offset+=dash;});
  svg.innerHTML=html;
}
function renderLegend(){const ts=totalSpent();document.getElementById('baLegend').innerHTML=budgetData.categories.map(c=>'<div class="ba-legend-item"><div class="ba-legend-dot" style="background:'+c.color+'"></div><span class="ba-legend-name">'+c.emoji+' '+c.name+'</span><span class="ba-legend-val">'+(ts>0?Math.round(c.spent/ts*100):0)+'%</span></div>').join('');}
function renderCategories(){
  document.getElementById('baCategories').innerHTML=budgetData.categories.map(c=>{
    const pct=c.budget>0?Math.min(c.spent/c.budget*100,100):100,over=c.spent>c.budget,remaining=c.budget-c.spent;
    const sc=over?'#dc2626':pct>75?'#f59e0b':'#16a34a',st=over?'&#x1F534; '+fmt(c.spent-c.budget)+' over':pct>75?'&#x26A0;&#xFE0F; '+fmt(remaining)+' left':'&#x2705; '+fmt(remaining)+' left';
    return '<div class="ba-cat-row'+(over?' over-budget':'')+'" onclick="openSpend('+c.id+')" id="catrow-'+c.id+'"><div class="ba-cat-fill" style="width:'+pct+'%;background:'+c.color+'"></div><div class="ba-cat-left"><div class="ba-cat-top"><span class="ba-cat-emoji">'+c.emoji+'</span><span class="ba-cat-name">'+c.name+'</span></div><div class="ba-cat-bar-wrap" style="width:160px"><div class="ba-cat-bar" style="width:'+pct+'%;background:'+c.color+'"></div></div><div class="ba-cat-status" style="color:'+sc+'">'+st+'</div></div><div class="ba-cat-right"><div class="ba-cat-spent" style="color:'+(over?'#dc2626':'var(--ink)')+'">'+fmt(c.spent)+'</div><div class="ba-cat-budget">of '+fmt(c.budget)+'</div><div class="ba-cat-actions"><button class="ba-cat-del" onclick="event.stopPropagation();deleteCategory('+c.id+')">&#x2715; remove</button></div></div></div>';
  }).join('');
}
function renderTransactions(){
  const wrap=document.getElementById('baTxns'),txns=[...budgetData.transactions].reverse();
  document.getElementById('baTxnCount').textContent=txns.length;
  if(!txns.length){wrap.innerHTML='<div class="ba-empty">No transactions yet. Click a category to log spend.</div>';return;}
  wrap.innerHTML=txns.map(t=>{const cat=budgetData.categories.find(c=>c.id===t.catId);return'<div class="ba-txn" id="txn-'+t.id+'"><div class="ba-txn-left"><span class="ba-txn-emoji">'+(cat?cat.emoji:'&#x1F4E6;')+'</span><div class="ba-txn-info"><div class="ba-txn-name">'+(cat?cat.name:'Unknown')+'</div>'+(t.note?'<div class="ba-txn-note">'+t.note+'</div>':'')+'</div></div><div class="ba-txn-right"><div class="ba-txn-amt" style="color:'+(cat&&cat.spent>cat.budget?'#dc2626':'var(--ink)')+'">-'+fmt(t.amount)+'</div><div class="ba-txn-time">'+t.time+'</div><button class="ba-txn-del" onclick="deleteTransaction('+t.id+')" title="Delete">&#x2715;</button></div></div>';}).join('');
}
function addCategory(){const n=document.getElementById('baCatName'),b=document.getElementById('baCatBudget'),name=n.value.trim(),budget=parseFloat(b.value);if(!name){n.focus();shake(n);return;}if(!budget||budget<=0){b.focus();shake(b);return;}budgetData.categories.push({id:budgetData.nextId++,name,budget,spent:0,emoji:getEmoji(name),color:CAT_COLORS[budgetData.categories.length%CAT_COLORS.length]});n.value='';b.value='';renderBudget();showToast(name+' added &#x1F4B8;');}
function deleteCategory(id){budgetData.categories=budgetData.categories.filter(c=>c.id!==id);budgetData.transactions=budgetData.transactions.filter(t=>t.catId!==id);renderBudget();}
function openSpend(catId){spendingCatId=catId;const cat=budgetData.categories.find(c=>c.id===catId);if(!cat)return;document.getElementById('spendCatName').textContent=cat.emoji+' '+cat.name;const rem=cat.budget-cat.spent;document.getElementById('spendRemaining').textContent=rem>=0?fmt(rem)+' remaining of '+fmt(cat.budget)+' budget':fmt(Math.abs(rem))+' over budget already &#x1F480;';document.getElementById('spendAmount').value='';document.getElementById('spendNote').value='';document.getElementById('spendPreview').textContent='';document.getElementById('spendBg').classList.add('open');setTimeout(()=>document.getElementById('spendAmount').focus(),200);}
function closeSpend(){document.getElementById('spendBg').classList.remove('open');spendingCatId=null;}
function closeSpendBg(e){if(e.target===document.getElementById('spendBg'))closeSpend();}
function updateSpendPreview(){const amt=parseFloat(document.getElementById('spendAmount').value),p=document.getElementById('spendPreview');if(!amt||amt<=0||!spendingCatId){p.textContent='';return;}const cat=budgetData.categories.find(c=>c.id===spendingCatId);if(!cat)return;const ns=cat.spent+amt,np=Math.round(ns/cat.budget*100);p.innerHTML=ns>cat.budget?'<span style="color:#dc2626">&#x26A0;&#xFE0F; This will put '+cat.name+' '+fmt(ns-cat.budget)+' over budget ('+np+'%)</span>':'<span style="color:#16a34a">&#x2192; '+fmt(ns)+' spent ('+np+'% of budget)</span>';}
function confirmSpend(){const amt=parseFloat(document.getElementById('spendAmount').value),note=document.getElementById('spendNote').value.trim();if(!amt||amt<=0){shake(document.getElementById('spendAmount'));return;}const cat=budgetData.categories.find(c=>c.id===spendingCatId);if(!cat)return;cat.spent+=amt;budgetData.transactions.push({id:budgetData.nextTxnId++,catId:spendingCatId,amount:amt,note:note||null,time:'just now'});closeSpend();renderBudget();showToast(cat.spent>cat.budget?cat.name+' is over budget &#x1F480;':fmt(amt)+' logged to '+cat.name+' &#x2713;');}
function deleteTransaction(id){const t=budgetData.transactions.find(x=>x.id===id);if(!t)return;const cat=budgetData.categories.find(c=>c.id===t.catId);if(cat)cat.spent=Math.max(0,cat.spent-t.amount);budgetData.transactions=budgetData.transactions.filter(x=>x.id!==id);renderBudget();}
let tt;function showToast(msg){const t=document.getElementById('toast'),m=document.getElementById('toastMsg');m.innerHTML=msg;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),3000);}
function shake(el){el.style.animation='shake 0.4s ease';el.addEventListener('animationend',()=>el.style.animation='',{once:true});}
document.getElementById('baCatBudget').addEventListener('keydown',e=>{if(e.key==='Enter')addCategory();});
document.getElementById('baCatName').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('baCatBudget').focus();});
document.getElementById('spendAmount').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('spendNote').focus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSpend();});
renderBudget();
<\/script>
</body></html>`);
  win.document.close();
  closeBudget();
  showToast('Popped out! 🚀');
}

/* ── RENDER ────────────────────────────────────── */
function renderBudget() {
  const ts = totalSpent(), tb = totalBudget();
  const pct = tb > 0 ? Math.min(Math.round(ts/tb*100),999) : 0;
  const left = tb - ts;

  document.getElementById('baTotalSpent').textContent = fmt(ts);
  const leftEl = document.getElementById('baBudgetLeft');
  leftEl.textContent = left < 0 ? `-${fmt(Math.abs(left))}` : fmt(left);
  leftEl.style.color = left < 0 ? '#dc2626' : 'var(--accent)';
  document.getElementById('baDPct').textContent = pct + '%';

  renderDonut();
  renderLegend();
  renderCategories();
  renderTransactions();
}

function renderDonut() {
  const svg = document.getElementById('baDonut');
  const ts = totalSpent();
  const r = 46, cx = 60, cy = 60, circ = 2*Math.PI*r;
  let html = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="10"/>`;
  let offset = 0;
  budgetData.categories.forEach(c => {
    if (c.spent <= 0 || ts <= 0) return;
    const frac = c.spent / Math.max(ts,1);
    const dash = frac * circ;
    html += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
      stroke="${c.color}" stroke-width="10"
      stroke-dasharray="${dash} ${circ-dash}"
      stroke-dashoffset="${-offset}"
      stroke-linecap="round"
      style="transition:stroke-dasharray 0.6s cubic-bezier(0.23,1,0.32,1)"/>`;
    offset += dash;
  });
  svg.innerHTML = html;
}

function renderLegend() {
  const ts = totalSpent();
  document.getElementById('baLegend').innerHTML = budgetData.categories.map(c => `
    <div class="ba-legend-item">
      <div class="ba-legend-dot" style="background:${c.color}"></div>
      <span class="ba-legend-name">${c.emoji} ${c.name}</span>
      <span class="ba-legend-val">${ts>0?Math.round(c.spent/ts*100):0}%</span>
    </div>
  `).join('');
}

function renderCategories() {
  document.getElementById('baCategories').innerHTML = budgetData.categories.map(c => {
    const pct = c.budget > 0 ? Math.min(c.spent / c.budget * 100, 100) : 100;
    const over = c.spent > c.budget;
    const remaining = c.budget - c.spent;
    const statusColor = over ? '#dc2626' : pct > 75 ? '#f59e0b' : '#16a34a';
    const statusText  = over
      ? `🔴 ${fmt(c.spent - c.budget)} over`
      : pct > 75
        ? `⚠️ ${fmt(remaining)} left`
        : `✅ ${fmt(remaining)} left`;
    return `
    <div class="ba-cat-row${over?' over-budget':''}" onclick="openSpend(${c.id})" id="catrow-${c.id}">
      <div class="ba-cat-fill" style="width:${pct}%;background:${c.color}"></div>
      <div class="ba-cat-left">
        <div class="ba-cat-top">
          <span class="ba-cat-emoji">${c.emoji}</span>
          <span class="ba-cat-name">${c.name}</span>
        </div>
        <div class="ba-cat-bar-wrap" style="width:160px">
          <div class="ba-cat-bar" style="width:${pct}%;background:${c.color}"></div>
        </div>
        <div class="ba-cat-status" style="color:${statusColor}">${statusText}</div>
      </div>
      <div class="ba-cat-right">
        <div class="ba-cat-spent" style="color:${over?'#dc2626':'var(--ink)'}">${fmt(c.spent)}</div>
        <div class="ba-cat-budget">of ${fmt(c.budget)}</div>
        <div class="ba-cat-actions">
          <button class="ba-cat-del" onclick="event.stopPropagation();deleteCategory(${c.id})">✕ remove</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderTransactions() {
  const wrap = document.getElementById('baTxns');
  const txns = [...budgetData.transactions].reverse();
  document.getElementById('baTxnCount').textContent = txns.length;
  if (!txns.length) {
    wrap.innerHTML = '<div class="ba-empty">No transactions yet. Click a category to log spend.</div>';
    return;
  }
  wrap.innerHTML = txns.map(t => {
    const cat = budgetData.categories.find(c=>c.id===t.catId);
    return `
    <div class="ba-txn" id="txn-${t.id}">
      <div class="ba-txn-left">
        <span class="ba-txn-emoji">${cat?cat.emoji:'📦'}</span>
        <div class="ba-txn-info">
          <div class="ba-txn-name">${cat?cat.name:'Unknown'}</div>
          ${t.note?`<div class="ba-txn-note">${t.note}</div>`:''}
        </div>
      </div>
      <div class="ba-txn-right">
        <div class="ba-txn-amt" style="color:${cat&&cat.spent>cat.budget?'#dc2626':'var(--ink)'}">-${fmt(t.amount)}</div>
        <div class="ba-txn-time">${t.time}</div>
        <button class="ba-txn-del" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>
      </div>
    </div>`;
  }).join('');
}

function fmt(n) { return '$' + Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0}); }

/* ── ADD CATEGORY ──────────────────────────────── */
function addCategory() {
  const nameEl = document.getElementById('baCatName');
  const budgEl = document.getElementById('baCatBudget');
  const name = nameEl.value.trim();
  const budget = parseFloat(budgEl.value);
  if (!name) { nameEl.focus(); shake(nameEl); return; }
  if (!budget || budget <= 0) { budgEl.focus(); shake(budgEl); return; }
  const colorIdx = budgetData.categories.length % CAT_COLORS.length;
  budgetData.categories.push({
    id: budgetData.nextId++,
    name, budget, spent: 0,
    emoji: getEmoji(name),
    color: CAT_COLORS[colorIdx],
  });
  nameEl.value = ''; budgEl.value = '';
  renderBudget();
  showToast(`${name} added 💸`);
}

function deleteCategory(id) {
  budgetData.categories = budgetData.categories.filter(c=>c.id!==id);
  budgetData.transactions = budgetData.transactions.filter(t=>t.catId!==id);
  renderBudget();
}

/* ── SPEND MODAL ───────────────────────────────── */
function openSpend(catId) {
  spendingCatId = catId;
  const cat = budgetData.categories.find(c=>c.id===catId);
  if (!cat) return;
  document.getElementById('spendCatName').textContent = `${cat.emoji} ${cat.name}`;
  const rem = cat.budget - cat.spent;
  document.getElementById('spendRemaining').textContent =
    rem >= 0 ? `${fmt(rem)} remaining of ${fmt(cat.budget)} budget`
             : `${fmt(Math.abs(rem))} over budget already 💀`;
  document.getElementById('spendAmount').value = '';
  document.getElementById('spendNote').value = '';
  document.getElementById('spendPreview').textContent = '';
  document.getElementById('spendBg').classList.add('open');
  setTimeout(()=>document.getElementById('spendAmount').focus(), 200);
}
function closeSpend() { document.getElementById('spendBg').classList.remove('open'); spendingCatId=null; }
function closeSpendBg(e) { if(e.target===document.getElementById('spendBg')) closeSpend(); }

function updateSpendPreview() {
  const amt = parseFloat(document.getElementById('spendAmount').value);
  const preview = document.getElementById('spendPreview');
  if (!amt || amt <= 0 || !spendingCatId) { preview.textContent=''; return; }
  const cat = budgetData.categories.find(c=>c.id===spendingCatId);
  if (!cat) return;
  const newSpent = cat.spent + amt;
  const newPct = Math.round(newSpent / cat.budget * 100);
  if (newSpent > cat.budget) {
    preview.innerHTML = `<span style="color:#dc2626">⚠️ This will put ${cat.name} ${fmt(newSpent-cat.budget)} over budget (${newPct}%)</span>`;
  } else {
    preview.innerHTML = `<span style="color:#16a34a">→ ${fmt(newSpent)} spent (${newPct}% of budget)</span>`;
  }
}

function confirmSpend() {
  const amt = parseFloat(document.getElementById('spendAmount').value);
  const note = document.getElementById('spendNote').value.trim();
  if (!amt || amt <= 0) { shake(document.getElementById('spendAmount')); return; }
  const cat = budgetData.categories.find(c=>c.id===spendingCatId);
  if (!cat) return;
  cat.spent += amt;
  budgetData.transactions.push({
    id: budgetData.nextTxnId++,
    catId: spendingCatId,
    amount: amt,
    note: note || null,
    time: 'just now',
  });
  closeSpend();
  renderBudget();
  const over = cat.spent > cat.budget;
  showToast(over ? `${cat.name} is over budget 💀` : `${fmt(amt)} logged to ${cat.name} ✓`);
}

function deleteTransaction(id) {
  const txn = budgetData.transactions.find(t=>t.id===id);
  if (!txn) return;
  const cat = budgetData.categories.find(c=>c.id===txn.catId);
  if (cat) cat.spent = Math.max(0, cat.spent - txn.amount);
  budgetData.transactions = budgetData.transactions.filter(t=>t.id!==id);
  renderBudget();
}

/* ── ENTER KEY IN ADD ROW ──────────────────────── */
document.getElementById('baCatBudget').addEventListener('keydown', e => { if(e.key==='Enter') addCategory(); });
document.getElementById('baCatName').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('baCatBudget').focus(); });
document.getElementById('spendAmount').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('spendNote').focus(); });
