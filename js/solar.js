/* ══════════════════════════════════════════════════
   SOLAR SYSTEM — COSMOS
══════════════════════════════════════════════════ */

const PLANETS = [
  { name:'Mercury', color:'#9CA3AF', radius:2.4, orbit:3.9, period:0.24, diameter:'4,879 km', distance:'57.9M km', emoji:'⚫', fact:'A day on Mercury is longer than its year — it takes 59 Earth days to rotate once.' },
  { name:'Venus',   color:'#FBBF24', radius:3.8, orbit:5.4, period:0.62, diameter:'12,104 km', distance:'108.2M km', emoji:'🟡', fact:'Venus spins backwards compared to most planets, and its surface is hot enough to melt lead.' },
  { name:'Earth',   color:'#3B82F6', radius:4,   orbit:7.0, period:1.00, diameter:'12,742 km', distance:'149.6M km', emoji:'🌍', fact:'Earth is the only planet not named after a Greek or Roman god. It comes from Germanic/Old English.' },
  { name:'Mars',    color:'#EF4444', radius:3.2, orbit:8.8, period:1.88, diameter:'6,779 km',  distance:'227.9M km', emoji:'🔴', fact:'Mars has the tallest volcano in the solar system — Olympus Mons at 21.9 km high.' },
  { name:'Jupiter', color:'#D97706', radius:8,   orbit:12,  period:11.86, diameter:'139,820 km', distance:'778.5M km', emoji:'🟠', fact:'Jupiter\'s Great Red Spot is a storm that\'s been raging for over 350 years.' },
  { name:'Saturn',  color:'#F59E0B', radius:7,   orbit:16,  period:29.46, diameter:'116,460 km', distance:'1.43B km', emoji:'🪐', fact:'Saturn\'s rings are only about 10 meters thick on average, despite spanning 282,000 km.' },
  { name:'Uranus',  color:'#06B6D4', radius:5.2, orbit:20,  period:84.01, diameter:'50,724 km',  distance:'2.87B km', emoji:'🔵', fact:'Uranus rotates on its side — it\'s tilted 98 degrees, likely from a massive ancient collision.' },
  { name:'Neptune', color:'#4F46E5', radius:5,   orbit:24,  period:164.8, diameter:'49,244 km',  distance:'4.5B km', emoji:'🔵', fact:'Neptune\'s winds are the fastest in the solar system, reaching 2,100 km/h.' },
];

let solarState = {
  playing: true,
  speed: 1,
  zoom: 1,
  showTrails: false,
  time: 0,
  selectedPlanet: null,
  animId: null,
  canvas: null,
  ctx: null,
  trails: [],
  stars: [],
};

/* ── OPEN / CLOSE ──────────────────────────────── */
function openSolar() {
  document.getElementById('solarModal').classList.add('open');
  setTimeout(() => {
    initSolarCanvas();
    if (!solarState.animId) solarLoop();
  }, 100);
}
function closeSolar() {
  document.getElementById('solarModal').classList.remove('open');
  if (solarState.animId) { cancelAnimationFrame(solarState.animId); solarState.animId = null; }
}
function closeSolarBg(e) { if (e.target === document.getElementById('solarModal')) closeSolar(); }

/* ── CANVAS INIT ───────────────────────────────── */
function initSolarCanvas() {
  const canvas = document.getElementById('solarCanvas');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  canvas.width = wrap.clientWidth * (window.devicePixelRatio || 1);
  canvas.height = wrap.clientHeight * (window.devicePixelRatio || 1);
  canvas.style.width = wrap.clientWidth + 'px';
  canvas.style.height = wrap.clientHeight + 'px';
  solarState.canvas = canvas;
  solarState.ctx = canvas.getContext('2d');

  // Generate stars
  if (solarState.stars.length === 0) {
    for (let i = 0; i < 200; i++) {
      solarState.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  // Click handler for planet selection
  canvas.onclick = function(e) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mx = (e.clientX - rect.left) * dpr;
    const my = (e.clientY - rect.top) * dpr;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const z = solarState.zoom;

    let clicked = null;
    PLANETS.forEach((p, i) => {
      const orbitR = p.orbit * 16 * z;
      const angle = (solarState.time / p.period) * Math.PI * 2;
      const px = cx + Math.cos(angle) * orbitR;
      const py = cy + Math.sin(angle) * orbitR;
      const pr = Math.max(p.radius * z * 1.2, 8); // generous click area
      const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
      if (dist < pr + 6) clicked = i;
    });

    // Check sun click
    const sunDist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
    if (sunDist < 18 * solarState.zoom) {
      selectPlanet(null);
      showToast('The Sun: 1.4 million km diameter, 4.6 billion years old ☀️');
      return;
    }

    selectPlanet(clicked);
  };
}

function selectPlanet(idx) {
  solarState.selectedPlanet = idx;
  const info = document.getElementById('soInfo');
  if (idx === null) {
    info.classList.remove('open');
    return;
  }
  const p = PLANETS[idx];
  document.getElementById('soInfoIcon').textContent = p.emoji;
  document.getElementById('soInfoName').textContent = p.name;
  document.getElementById('soInfoDist').textContent = p.distance;
  document.getElementById('soInfoPeriod').textContent = p.period + ' years';
  document.getElementById('soInfoDiam').textContent = p.diameter;
  document.getElementById('soInfoFact').textContent = p.fact;
  info.classList.add('open');
}

/* ── RENDER LOOP ───────────────────────────────── */
function solarLoop() {
  if (solarState.playing) {
    solarState.time += 0.002 * solarState.speed;
  }
  drawSolar();
  updateSolarTime();
  solarState.animId = requestAnimationFrame(solarLoop);
}

function drawSolar() {
  const { canvas, ctx, zoom, time, stars, showTrails, trails, selectedPlanet } = solarState;
  if (!ctx || !canvas) return;
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const z = zoom;

  // Clear
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, W, H);

  // Stars
  stars.forEach(s => {
    s.twinkle += s.speed;
    const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.twinkle));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });

  // Orbit paths
  PLANETS.forEach(p => {
    const orbitR = p.orbit * 16 * z;
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // Sun glow
  const sunPulse = 1 + Math.sin(time * 8) * 0.05;
  const sunR = 14 * z * sunPulse;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 3);
  grad.addColorStop(0, 'rgba(251,191,36,0.4)');
  grad.addColorStop(0.5, 'rgba(251,191,36,0.1)');
  grad.addColorStop(1, 'rgba(251,191,36,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, sunR * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
  ctx.fillStyle = '#FBBF24';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, sunR * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = '#FDE68A';
  ctx.fill();

  // Trails (behind planets)
  if (showTrails && trails.length > 0) {
    trails.forEach(trail => {
      for (let i = 1; i < trail.points.length; i++) {
        const alpha = (i / trail.points.length) * 0.6;
        ctx.beginPath();
        ctx.moveTo(trail.points[i-1].x, trail.points[i-1].y);
        ctx.lineTo(trail.points[i].x, trail.points[i].y);
        ctx.strokeStyle = trail.color.replace(')', `,${alpha})`).replace('rgb', 'rgba');
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }

  // Planets
  PLANETS.forEach((p, i) => {
    const orbitR = p.orbit * 16 * z;
    const angle = (time / p.period) * Math.PI * 2;
    const px = cx + Math.cos(angle) * orbitR;
    const py = cy + Math.sin(angle) * orbitR;
    const pr = p.radius * z;

    // Trail tracking
    if (showTrails) {
      if (!trails[i]) trails[i] = { points: [], color: `rgb(${hexToRGB(p.color)})` };
      trails[i].points.push({ x: px, y: py });
      if (trails[i].points.length > 200) trails[i].points.shift();
    }

    // Planet glow
    if (selectedPlanet === i) {
      ctx.beginPath();
      ctx.arc(px, py, pr + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(129,140,248,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Saturn rings
    if (p.name === 'Saturn') {
      ctx.beginPath();
      ctx.ellipse(px, py, pr * 2.2, pr * 0.5, -0.3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245,158,11,0.4)';
      ctx.lineWidth = 2.5 * z;
      ctx.stroke();
    }

    // Planet body
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Jupiter bands
    if (p.name === 'Jupiter') {
      for (let b = -2; b <= 2; b++) {
        ctx.beginPath();
        ctx.arc(px, py + b * pr * 0.3, pr, -0.3, Math.PI + 0.3, false);
        ctx.strokeStyle = b % 2 === 0 ? 'rgba(180,120,60,0.4)' : 'rgba(200,150,80,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Earth's moon
    if (p.name === 'Earth') {
      const moonAngle = time * 12;
      const moonDist = pr + 6 * z;
      const mx = px + Math.cos(moonAngle) * moonDist;
      const my = py + Math.sin(moonAngle) * moonDist;
      ctx.beginPath();
      ctx.arc(mx, my, 1.5 * z, 0, Math.PI * 2);
      ctx.fillStyle = '#9CA3AF';
      ctx.fill();
    }

    // Planet name label
    ctx.font = `${10 * z}px 'DM Mono', monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, px, py + pr + 12 * z);
  });
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r},${g},${b}`;
}

function updateSolarTime() {
  const years = solarState.time.toFixed(2);
  const el = document.getElementById('soTimeDisplay');
  if (el) el.innerHTML = `Earth Years: <span>${years}</span>`;
}

/* ── CONTROLS ──────────────────────────────────── */
function toggleSolarPlay() {
  solarState.playing = !solarState.playing;
  const btn = document.getElementById('soPlayBtn');
  btn.textContent = solarState.playing ? '⏸' : '▶';
  btn.classList.toggle('active', solarState.playing);
  if (solarState.playing && !solarState.animId) solarLoop();
}

function setSolarSpeed(val) {
  solarState.speed = parseFloat(val);
  document.getElementById('soSpeedVal').textContent = val + 'x';
}

function solarZoomIn() {
  solarState.zoom = Math.min(3, solarState.zoom * 1.2);
}
function solarZoomOut() {
  solarState.zoom = Math.max(0.3, solarState.zoom / 1.2);
}

function toggleSolarTrails() {
  solarState.showTrails = !solarState.showTrails;
  if (!solarState.showTrails) solarState.trails = [];
  document.getElementById('soTrailBtn').classList.toggle('active', solarState.showTrails);
}

function closePlanetInfo() {
  solarState.selectedPlanet = null;
  document.getElementById('soInfo').classList.remove('open');
}

/* ── RESIZE ────────────────────────────────────── */
window.addEventListener('resize', () => {
  if (document.getElementById('solarModal').classList.contains('open')) {
    initSolarCanvas();
  }
});

/* ── POPOUT ────────────────────────────────────── */
function popoutSolar() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'SolarSystem', 'width=740,height=640,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  const cssEl = document.querySelector('link[href="css/solar.css"]');
  const cssText = Array.from(document.styleSheets).reduce((acc, sheet) => {
    try {
      if (sheet.href && sheet.href.includes('solar.css')) {
        acc += Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
      }
    } catch(e) {}
    return acc;
  }, '');

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cosmos 🪐</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --trans: all 0.3s cubic-bezier(0.23,1,0.32,1); }
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:#050510; color:#FAF7F2; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; margin:0; overflow:hidden; }
.app { width:100%; height:100vh; display:flex; flex-direction:column; }
.toast{position:fixed;bottom:20px;right:20px;padding:11px 16px;background:#161616;border:1px solid rgba(255,107,53,0.22);border-radius:12px;font-size:13px;font-weight:600;color:#FAF7F2;display:flex;align-items:center;gap:8px;transform:translateY(60px);opacity:0;transition:all 0.35s cubic-bezier(0.23,1,0.32,1);z-index:999}
.toast.show{transform:translateY(0);opacity:1}
.so-canvas-wrap { flex:1; position:relative; }
.so-canvas-wrap canvas { width:100%; height:100%; display:block; }
.so-time-display { position:absolute; top:12px; left:16px; font-family:'DM Mono',monospace; font-size:11px; color:rgba(255,255,255,0.5); pointer-events:none; z-index:2; }
.so-time-display span { color:#fbbf24; font-weight:600; }
${cssText}
</style>
</head>
<body>
<div class="app">
  <div class="so-canvas-wrap">
    <canvas id="solarCanvas"></canvas>
    <div class="so-time-display" id="soTimeDisplay">Earth Years: <span>0.00</span></div>
  </div>
  <div class="so-controls">
    <button class="so-ctrl-btn active" id="soPlayBtn" onclick="toggleSolarPlay()">⏸</button>
    <div class="so-speed-wrap">
      <span class="so-speed-label">Speed</span>
      <input type="range" class="so-speed-slider" min="0.5" max="10" step="0.5" value="1" oninput="setSolarSpeed(this.value)">
      <span class="so-speed-val" id="soSpeedVal">1x</span>
    </div>
    <button class="so-ctrl-btn" onclick="solarZoomIn()">+</button>
    <button class="so-ctrl-btn" onclick="solarZoomOut()">−</button>
    <button class="so-trail-btn" id="soTrailBtn" onclick="toggleSolarTrails()">Trails</button>
  </div>
  <div class="so-info" id="soInfo">
    <div class="so-info-inner">
      <div class="so-info-icon" id="soInfoIcon"></div>
      <div class="so-info-details">
        <div class="so-info-name" id="soInfoName"></div>
        <div class="so-info-grid">
          <div class="so-info-item"><div class="so-info-label">Distance</div><div class="so-info-val" id="soInfoDist"></div></div>
          <div class="so-info-item"><div class="so-info-label">Orbital Period</div><div class="so-info-val" id="soInfoPeriod"></div></div>
          <div class="so-info-item"><div class="so-info-label">Diameter</div><div class="so-info-val" id="soInfoDiam"></div></div>
        </div>
        <div class="so-info-fact" id="soInfoFact"></div>
      </div>
      <button class="so-info-close" onclick="closePlanetInfo()">&#215;</button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}
const PLANETS = ${JSON.stringify(PLANETS)};
let solarState = {
  playing:true, speed:1, zoom:1, showTrails:false,
  time:${solarState.time}, selectedPlanet:null, animId:null,
  canvas:null, ctx:null, trails:[], stars:[]
};
${initSolarCanvas.toString()}
${selectPlanet.toString()}
${solarLoop.toString()}
${drawSolar.toString()}
${hexToRGB.toString()}
${updateSolarTime.toString()}
${toggleSolarPlay.toString()}
${setSolarSpeed.toString()}
${solarZoomIn.toString()}
${solarZoomOut.toString()}
${toggleSolarTrails.toString()}
${closePlanetInfo.toString()}
setTimeout(()=>{initSolarCanvas();solarLoop();},100);
window.addEventListener('resize',()=>initSolarCanvas());
<\/script>
</body></html>`);
  win.document.close();
  closeSolar();
  showToast('Popped out! 🚀');
}
