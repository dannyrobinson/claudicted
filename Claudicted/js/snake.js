/* ══════════════════════════════════════════════════
   SNAKE GAME ENGINE
══════════════════════════════════════════════════ */
const SN = {
  GRID: 20,        // cells per side
  CELL: 20,        // px per cell
  SPEEDS: [180, 120, 75],  // ms per tick (slow/normal/fast)
  speedIdx: 1,
  running: false,
  paused: false,
  loop: null,
  frame: null,
  playerName: 'You',

  // Persistent leaderboard (session)
  leaderboard: [
    { name: 'xXSnakeLordXx', score: 312 },
    { name: 'vibe_coder_99', score: 278 },
    { name: 'asmithdev',     score: 241 },
    { name: 'priyalives',    score: 197 },
    { name: 'mkovalenko',    score: 156 },
  ],

  snakes: [],
  food: [],
  powerups: [],
  tick: 0,
  canvas: null,
  ctx: null,
};

const SNAKE_COLORS = ['#4ade80', '#FF6B35', '#60a5fa', '#f472b6'];
const BOT_NAMES    = ['Bot_Sly', 'Bot_Rex', 'Bot_Zap'];
const FOOD_COLORS  = ['#fbbf24','#f87171','#a78bfa','#34d399'];

function openSnake() {
  document.getElementById('snakeModal').classList.add('open');
  SN.canvas  = document.getElementById('snCanvas');
  SN.ctx     = SN.canvas.getContext('2d');
  renderLeaderboard();
  renderLivePlayers([]);
  // make sure overlays are right
  document.getElementById('snStartOverlay').style.display = 'flex';
  document.getElementById('snDeadOverlay').style.display  = 'none';
  document.getElementById('snPauseOverlay').style.display = 'none';
}
function closeSnake() {
  stopGame();
  document.getElementById('snakeModal').classList.remove('open');
}
function closeSnakeBg(e) { if (e.target === document.getElementById('snakeModal')) closeSnake(); }

/* ── INIT ──────────────────────────────────────── */
function startGame() {
  stopGame();
  SN.playerName = document.getElementById('snNameInput').value.trim() || 'You';
  SN.tick = 0;
  SN.running = true;
  SN.paused  = false;

  // Hide all overlays
  ['snStartOverlay','snDeadOverlay','snPauseOverlay'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('snPauseBtn').textContent = '⏸ Pause';

  // Create snakes
  const starts = [
    { x:2,  y:2,  dir:{x:1,y:0}  },
    { x:17, y:17, dir:{x:-1,y:0} },
    { x:2,  y:17, dir:{x:1,y:0}  },
    { x:17, y:2,  dir:{x:0,y:1}  },
  ];
  SN.snakes = [SN.playerName, ...BOT_NAMES].map((name, i) => ({
    name,
    color: SNAKE_COLORS[i],
    body: [{ x: starts[i].x, y: starts[i].y }],
    dir:  { ...starts[i].dir },
    nextDir: { ...starts[i].dir },
    alive: true,
    score: 0,
    isPlayer: i === 0,
    growCount: 2,
  }));

  SN.food     = [];
  SN.powerups = [];
  spawnFood(5);
  updateScoreDisplay();
  renderLivePlayers(SN.snakes);
  SN.loop = setInterval(gameTick, SN.SPEEDS[SN.speedIdx]);
  requestAnimFrame();
}

function stopGame() {
  SN.running = false;
  if (SN.loop)  { clearInterval(SN.loop);  SN.loop  = null; }
  if (SN.frame) { cancelAnimationFrame(SN.frame); SN.frame = null; }
}

/* ── GAME TICK ─────────────────────────────────── */
function gameTick() {
  if (!SN.running || SN.paused) return;
  SN.tick++;

  // Bot AI
  SN.snakes.forEach(s => {
    if (!s.alive || s.isPlayer) return;
    botThink(s);
  });

  // Move all snakes
  SN.snakes.forEach(s => {
    if (!s.alive) return;
    s.dir = { ...s.nextDir };
    const head = { x: s.body[0].x + s.dir.x, y: s.body[0].y + s.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= SN.GRID || head.y < 0 || head.y >= SN.GRID) {
      killSnake(s); return;
    }
    // Self collision
    if (s.body.some(seg => seg.x === head.x && seg.y === head.y)) {
      killSnake(s); return;
    }
    // Other snake collision
    for (const other of SN.snakes) {
      if (!other.alive) continue;
      if (other.body.some(seg => seg.x === head.x && seg.y === head.y)) {
        killSnake(s); return;
      }
    }

    s.body.unshift(head);

    // Food check
    const fi = SN.food.findIndex(f => f.x === head.x && f.y === head.y);
    if (fi !== -1) {
      const pts = SN.food[fi].value;
      s.score += pts;
      s.growCount += SN.food[fi].big ? 4 : 1;
      SN.food.splice(fi, 1);
      spawnFood(1);
      if (s.isPlayer) updateScoreDisplay();
    } else {
      if (s.growCount > 0) { s.growCount--; } else { s.body.pop(); }
    }

    // Powerup check
    const pi = SN.powerups.findIndex(p => p.x === head.x && p.y === head.y);
    if (pi !== -1) {
      s.score += 25;
      s.growCount += 3;
      SN.powerups.splice(pi, 1);
      if (s.isPlayer) { updateScoreDisplay(); flashScore(); }
    }
  });

  // Spawn powerup occasionally
  if (SN.tick % 40 === 0 && SN.powerups.length < 2) spawnPowerup();

  // Level check (player only)
  const player = SN.snakes[0];
  if (player && player.alive) {
    const lvl = Math.floor(player.score / 50) + 1;
    document.getElementById('snLevel').textContent = lvl;
  }

  renderLivePlayers(SN.snakes);

  // Check if player is dead
  if (player && !player.alive) { endGame(); return; }
  // Check if only player left (win)
  const aliveBots = SN.snakes.filter(s => !s.isPlayer && s.alive);
  if (aliveBots.length === 0 && player && player.alive) { endGame(true); }
}

/* ── BOT AI ────────────────────────────────────── */
function botThink(snake) {
  const head = snake.body[0];
  const dirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

  // Filter out reverse direction
  const valid = dirs.filter(d => !(d.x === -snake.dir.x && d.y === -snake.dir.y));

  // Score each direction
  const scored = valid.map(d => {
    const nx = head.x + d.x, ny = head.y + d.y;
    if (nx<0||nx>=SN.GRID||ny<0||ny>=SN.GRID) return { d, score: -1000 };

    let score = 0;
    // Avoid all snake bodies
    for (const s of SN.snakes) {
      if (!s.alive) continue;
      if (s.body.some(seg => seg.x===nx && seg.y===ny)) return { d, score: -1000 };
    }
    // Chase closest food
    if (SN.food.length) {
      const nearest = SN.food.reduce((best, f) => {
        const dist = Math.abs(f.x-nx)+Math.abs(f.y-ny);
        return dist < best.dist ? {dist,f} : best;
      }, {dist:Infinity,f:null});
      if (nearest.f) score += 20 - nearest.dist;
    }
    // Slight randomness so bots don't all clump
    score += (Math.random() - 0.5) * 8;
    return { d, score };
  });

  scored.sort((a,b) => b.score - a.score);
  if (scored.length && scored[0].score > -900) snake.nextDir = scored[0].d;
}

/* ── FOOD & POWERUPS ───────────────────────────── */
function randomEmpty() {
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(Math.random() * SN.GRID);
    const y = Math.floor(Math.random() * SN.GRID);
    const blocked = SN.snakes.some(s => s.body.some(seg => seg.x===x&&seg.y===y))
                 || SN.food.some(f => f.x===x&&f.y===y)
                 || SN.powerups.some(p => p.x===x&&p.y===y);
    if (!blocked) return {x, y};
  }
  return null;
}

function spawnFood(n) {
  for (let i = 0; i < n; i++) {
    const pos = randomEmpty();
    if (!pos) continue;
    const big = Math.random() < 0.12;
    SN.food.push({ ...pos, value: big ? 15 : 5, big, color: FOOD_COLORS[Math.floor(Math.random()*FOOD_COLORS.length)] });
  }
}

function spawnPowerup() {
  const pos = randomEmpty();
  if (pos) SN.powerups.push({ ...pos, type: '⭐' });
}

/* ── KILL & END ────────────────────────────────── */
function killSnake(s) {
  s.alive = false;
  if (s.isPlayer) {
    // spawn food where body was
    s.body.forEach(seg => { if (Math.random()<0.4) SN.food.push({...seg, value:5, big:false, color:'#fbbf24'}); });
  }
}

function endGame(won = false) {
  stopGame();
  const player = SN.snakes[0];
  const score  = player ? player.score : 0;

  // Update leaderboard
  const name = SN.playerName;
  const existing = SN.leaderboard.find(e => e.name === name);
  let isNew = false;
  if (existing) {
    if (score > existing.score) { existing.score = score; isNew = true; }
  } else {
    SN.leaderboard.push({ name, score, isNew: true });
    isNew = true;
  }
  SN.leaderboard.sort((a,b) => b.score - a.score);
  SN.leaderboard = SN.leaderboard.slice(0, 10);

  // High score
  const hi = Math.max(...SN.leaderboard.map(e => e.score));
  document.getElementById('snHigh').textContent = hi;

  renderLeaderboard(isNew ? name : null);

  // Show end overlay
  const overlay = document.getElementById('snDeadOverlay');
  document.getElementById('snDeadIcon').textContent  = won ? '🏆' : '💀';
  document.getElementById('snDeadTitle').textContent = won ? 'You Win!' : 'Game Over';
  document.getElementById('snDeadSub').textContent   = `You scored ${score}${won ? ' — Bots defeated!' : ''}`;
  overlay.style.display = 'flex';
}

/* ── RENDER ────────────────────────────────────── */
function requestAnimFrame() {
  SN.frame = requestAnimationFrame(() => {
    if (!SN.running) return;
    drawFrame();
    requestAnimFrame();
  });
}

function drawFrame() {
  const ctx = SN.ctx, C = SN.CELL, G = SN.GRID;
  const W = C * G;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  // Background
  ctx.fillStyle = isDark ? '#0d0d0d' : '#F5F0E8';
  ctx.fillRect(0, 0, W, W);

  // Grid lines
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,22,18,0.04)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= G; i++) {
    ctx.beginPath(); ctx.moveTo(i*C, 0); ctx.lineTo(i*C, W); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i*C); ctx.lineTo(W, i*C); ctx.stroke();
  }

  // Food
  SN.food.forEach(f => {
    const cx = f.x*C + C/2, cy = f.y*C + C/2;
    const r = f.big ? C*0.42 : C*0.3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fillStyle = f.color;
    ctx.fill();
    if (f.big) {
      ctx.shadowBlur = 8; ctx.shadowColor = f.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  // Powerups
  SN.powerups.forEach(p => {
    const pulse = 0.8 + 0.2 * Math.sin(Date.now() / 200);
    ctx.font = `${Math.round(C * 0.75 * pulse)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(p.type, p.x*C + C/2, p.y*C + C/2);
  });

  // Snakes
  SN.snakes.forEach(s => {
    if (!s.alive) return;
    s.body.forEach((seg, i) => {
      const alpha = s.isPlayer ? 1 : (0.75 + 0.25 * (1 - i / s.body.length));
      ctx.globalAlpha = alpha;
      const r = i === 0 ? C*0.44 : C*0.38;
      const x = seg.x * C + C/2, y = seg.y * C + C/2;

      // Body segment
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(seg.x*C+1, seg.y*C+1, C-2, C-2, r*0.6) :
                      ctx.rect(seg.x*C+1, seg.y*C+1, C-2, C-2);
      ctx.fillStyle = s.color;
      ctx.fill();

      // Head eye
      if (i === 0) {
        ctx.globalAlpha = 1;
        const ex = x + s.dir.x * C*0.2 + s.dir.y * C*0.15;
        const ey = y + s.dir.y * C*0.2 + s.dir.x * C*0.15;
        ctx.beginPath(); ctx.arc(ex, ey, C*0.1, 0, Math.PI*2);
        ctx.fillStyle = isDark ? '#000' : '#fff';
        ctx.fill();

        // Player crown
        if (s.isPlayer) {
          ctx.font = `${Math.round(C*0.5)}px serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.globalAlpha = 0.9;
          ctx.fillText('👑', x, y - C*0.55);
        }
      }
    });
    ctx.globalAlpha = 1;
  });
}

function renderLivePlayers(snakes) {
  const wrap = document.getElementById('snPlayers');
  if (!snakes.length) { wrap.innerHTML = '<div style="font-family:\'DM Mono\',monospace;font-size:11px;color:var(--ink-muted)">Waiting for game...</div>'; return; }
  wrap.innerHTML = snakes.map(s => `
    <div class="sn-player-row${s.alive===false?' dead':''}">
      <div class="sn-player-dot" style="background:${s.color}"></div>
      <span class="sn-player-name">${s.isPlayer ? '👑 ' : '🤖 '}${s.name}</span>
      <span class="sn-player-score">${s.score}</span>
      <span class="sn-player-badge">${s.alive===false ? '💀' : '🟢'}</span>
    </div>`).join('');
}

function renderLeaderboard(highlightName = null) {
  const wrap = document.getElementById('snLeaderboard');
  const medals = ['🥇','🥈','🥉'];
  wrap.innerHTML = SN.leaderboard.slice(0, 8).map((e, i) => `
    <div class="sn-lb-row">
      <span class="sn-lb-rank">${medals[i] || (i+1)}</span>
      <span class="sn-lb-name">${e.name}</span>
      ${e.name === highlightName ? '<span class="sn-lb-new">NEW</span>' : ''}
      <span class="sn-lb-score">${e.score}</span>
    </div>`).join('');
}

function updateScoreDisplay() {
  const player = SN.snakes[0];
  if (!player) return;
  document.getElementById('snScore').textContent = player.score;
  const hi = Math.max(...SN.leaderboard.map(e=>e.score), player.score);
  document.getElementById('snHigh').textContent = hi;
}

let _flashTimeout;
function flashScore() {
  const el = document.getElementById('snScore');
  el.style.color = '#fbbf24';
  clearTimeout(_flashTimeout);
  _flashTimeout = setTimeout(() => el.style.color = '', 400);
}

/* ── CONTROLS ──────────────────────────────────── */
function togglePause() {
  if (!SN.running) return;
  SN.paused = !SN.paused;
  document.getElementById('snPauseBtn').textContent = SN.paused ? '▶ Resume' : '⏸ Pause';
  const po = document.getElementById('snPauseOverlay');
  po.style.display = SN.paused ? 'flex' : 'none';
  if (!SN.paused) requestAnimFrame();
}

function setSpeed(idx) {
  SN.speedIdx = idx - 1;
  document.querySelectorAll('.sn-speed-btn').forEach((b,i) => b.classList.toggle('active', i===SN.speedIdx));
  if (SN.running && SN.loop) {
    clearInterval(SN.loop);
    SN.loop = setInterval(gameTick, SN.SPEEDS[SN.speedIdx]);
  }
}

// Keyboard handler
(function() {
  const KEY_MAP = {
    ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
    w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0},
    W:{x:0,y:-1}, S:{x:0,y:1}, A:{x:-1,y:0}, D:{x:1,y:0},
  };
  document.addEventListener('keydown', e => {
    // Only hijack game keys when snake modal is open
    if (!document.getElementById('snakeModal').classList.contains('open')) return;
    if (!SN.running) return;

    if (e.key === ' ' || e.key === 'p' || e.key === 'P') { e.preventDefault(); togglePause(); return; }
    if (e.key === 'Escape') { return; } // let global handler deal with modal close

    const dir = KEY_MAP[e.key];
    if (!dir) return;
    e.preventDefault();

    const player = SN.snakes[0];
    if (!player || !player.alive) return;
    // Prevent 180° reverse
    if (dir.x === -player.dir.x && dir.y === -player.dir.y) return;
    player.nextDir = dir;
  });
})();

// Touch / swipe support
(function() {
  let tx0, ty0;
  const canvas = () => document.getElementById('snCanvas');
  function addTouch() {
    canvas().addEventListener('touchstart', e => { tx0=e.touches[0].clientX; ty0=e.touches[0].clientY; e.preventDefault(); }, {passive:false});
    canvas().addEventListener('touchend', e => {
      if (!SN.running || SN.paused) return;
      const dx = e.changedTouches[0].clientX - tx0;
      const dy = e.changedTouches[0].clientY - ty0;
      const player = SN.snakes[0];
      if (!player || !player.alive) return;
      let dir;
      if (Math.abs(dx) > Math.abs(dy)) dir = dx>0 ? {x:1,y:0} : {x:-1,y:0};
      else dir = dy>0 ? {x:0,y:1} : {x:0,y:-1};
      if (dir.x===-player.dir.x && dir.y===-player.dir.y) return;
      player.nextDir = dir;
      e.preventDefault();
    }, {passive:false});
  }
  // Wait for modal open
  document.getElementById('snakeModal').addEventListener('transitionend', addTouch, {once:true});
})();

/* ── POPOUT ────────────────────────────────────── */
function popoutSnake() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'SnakeArena', 'width=820,height=640,resizable=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }
  const lbJson = JSON.stringify(SN.leaderboard);

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Snake Arena 🐍</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--trans:all 0.3s cubic-bezier(0.23,1,0.32,1);}
[data-theme="dark"]{--bg:#0f0f0f;--surface:#161616;--surface2:#1e1e1e;--border:rgba(255,255,255,0.08);--border-em:rgba(76,222,128,0.3);--ink:#FAF7F2;--ink-muted:#666;--accent:#4ade80;--accent-glow:rgba(74,222,128,0.12);}
[data-theme="light"]{--bg:#FAF7F2;--surface:#fff;--surface2:#F5F0E8;--border:rgba(26,22,18,0.08);--border-em:rgba(22,163,74,0.25);--ink:#1A1612;--ink-muted:#9B9086;--accent:#16a34a;--accent-glow:rgba(22,163,74,0.08);}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;height:100vh;display:flex;flex-direction:column;overflow:hidden;}
.header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);gap:12px;flex-shrink:0;}
.h-left{display:flex;align-items:center;gap:10px;}
.h-title{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:var(--ink);}
.h-stats{display:flex;gap:20px;}
.stat-w{text-align:right;}
.stat-l{font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:var(--ink-muted);}
.stat-v{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:var(--ink);}
.theme-btn{width:28px;height:28px;border-radius:50%;background:rgba(128,128,128,0.1);border:none;cursor:pointer;color:var(--ink-muted);font-size:13px;display:flex;align-items:center;justify-content:center;transition:var(--trans);}
.main{display:flex;flex:1;overflow:hidden;padding:16px;gap:16px;}
.canvas-col{display:flex;flex-direction:column;gap:12px;}
canvas{display:block;border-radius:12px;border:2px solid var(--border);}
.ctrl-row{display:flex;gap:8px;}
.btn{padding:7px 14px;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:var(--trans);border:1px solid var(--border);background:rgba(128,128,128,0.08);color:var(--ink);}
.btn:hover{border-color:var(--accent);color:var(--accent);}
.btn.green{background:var(--accent);border-color:var(--accent);color:white;}
.btn.green:hover{opacity:0.85;}
.btn.danger:hover{border-color:#dc2626;color:#dc2626;}
.speed-row{display:flex;align-items:center;gap:8px;margin-left:auto;}
.sp-l{font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted);}
.sp-btn{padding:4px 10px;border-radius:100px;border:1px solid var(--border);background:transparent;cursor:pointer;font-size:12px;transition:var(--trans);}
.sp-btn.on{background:var(--accent);border-color:var(--accent);}
.sidebar{display:flex;flex-direction:column;gap:12px;width:200px;flex-shrink:0;overflow-y:auto;}
.panel{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:12px;}
.p-label{font-family:'DM Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--ink-muted);margin-bottom:8px;}
.pr{display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--border);}
.pr:last-child{border-bottom:none;}
.pr.dead{opacity:0.35;}
.pd{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.pn{font-size:11px;font-weight:600;color:var(--ink);flex:1;}
.ps{font-family:'Fraunces',serif;font-size:13px;font-weight:600;color:var(--ink);}
.lr{display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border);}
.lr:last-child{border-bottom:none;}
.lrank{font-family:'DM Mono',monospace;font-size:9px;color:var(--ink-muted);width:16px;}
.lname{font-size:11px;font-weight:600;color:var(--ink);flex:1;}
.lscore{font-family:'Fraunces',serif;font-size:13px;font-weight:600;color:var(--ink);}
.lnew{font-size:9px;background:rgba(74,222,128,0.12);color:var(--accent);border:1px solid rgba(74,222,128,0.25);border-radius:4px;padding:1px 5px;font-family:'DM Mono',monospace;}
.overlay{position:absolute;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border-radius:12px;}
.ov-icon{font-size:36px;}
.ov-title{font-family:'Fraunces',serif;font-size:26px;font-weight:600;color:white;letter-spacing:-1px;}
.ov-sub{font-family:'DM Mono',monospace;font-size:11px;color:rgba(255,255,255,0.5);text-align:center;}
.name-inp{padding:9px 16px;border-radius:100px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;outline:none;text-align:center;width:160px;}
.ctrl-hint{font-family:'DM Mono',monospace;font-size:10px;color:rgba(255,255,255,0.3);}
.toast{position:fixed;bottom:16px;right:16px;padding:10px 14px;background:var(--surface);border:1px solid var(--border-em);border-radius:10px;font-size:12px;font-weight:600;color:var(--ink);transform:translateY(50px);opacity:0;transition:all 0.3s cubic-bezier(0.23,1,0.32,1);}
.toast.show{transform:translateY(0);opacity:1;}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
</style></head><body>
<div class="header">
  <div class="h-left"><span style="font-size:22px">🐍</span><span class="h-title">Snake Arena</span></div>
  <div class="h-stats">
    <div class="stat-w"><div class="stat-l">Score</div><div class="stat-v" id="pScore">0</div></div>
    <div class="stat-w"><div class="stat-l">High Score</div><div class="stat-v" id="pHigh">0</div></div>
    <div class="stat-w"><div class="stat-l">Level</div><div class="stat-v" id="pLevel">1</div></div>
  </div>
  <button class="theme-btn" onclick="document.documentElement.setAttribute('data-theme',document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')">◑</button>
</div>
<div class="main">
  <div class="canvas-col">
    <div style="position:relative;line-height:0;">
      <canvas id="gc" width="480" height="480"></canvas>
      <div class="overlay" id="startOv">
        <div class="ov-icon">🐍</div>
        <div class="ov-title">Snake Arena</div>
        <div class="ov-sub">You vs 3 bots · eat food · last snake wins</div>
        <input class="name-inp" id="nameInp" placeholder="Your name" maxlength="12" value="You">
        <button class="btn green" onclick="startG()" style="padding:11px 28px;font-size:14px;">▶ Play</button>
        <div class="ctrl-hint">← → ↑ ↓ or W A S D · Space to pause</div>
      </div>
      <div class="overlay" id="deadOv" style="display:none">
        <div class="ov-icon" id="deadIcon">💀</div>
        <div class="ov-title" id="deadTitle">Game Over</div>
        <div class="ov-sub" id="deadSub"></div>
        <button class="btn green" onclick="startG()" style="padding:11px 28px;font-size:14px;">↺ Play Again</button>
      </div>
      <div class="overlay" id="pauseOv" style="display:none">
        <div class="ov-icon">⏸</div><div class="ov-title">Paused</div>
        <button class="btn green" onclick="toggleP()">▶ Resume</button>
      </div>
    </div>
    <div class="ctrl-row">
      <button class="btn" id="pauseBtn" onclick="toggleP()">⏸ Pause</button>
      <button class="btn danger" onclick="startG()">↺ Restart</button>
      <div class="speed-row">
        <span class="sp-l">Speed</span>
        <button class="sp-btn" onclick="setSp(1)" id="s1">🐢</button>
        <button class="sp-btn on" onclick="setSp(2)" id="s2">🐍</button>
        <button class="sp-btn" onclick="setSp(3)" id="s3">⚡</button>
      </div>
    </div>
  </div>
  <div class="sidebar">
    <div class="panel"><div class="p-label">Live Players</div><div id="livePl"></div></div>
    <div class="panel"><div class="p-label">🏆 Leaderboard</div><div id="lb"></div></div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
const GRID=24,CELL=20,SPEEDS=[180,120,75];
const SCOL=['#4ade80','#FF6B35','#60a5fa','#f472b6'];
const BNAMES=['Bot_Sly','Bot_Rex','Bot_Zap'];
const FCOL=['#fbbf24','#f87171','#a78bfa','#34d399'];
let G={running:false,paused:false,loop:null,frame:null,spdIdx:1,tick:0,snakes:[],food:[],powerups:[],lb:${lbJson}};
function fmt(n){return n;}
function startG(){
  if(G.loop)clearInterval(G.loop);
  if(G.frame)cancelAnimationFrame(G.frame);
  G.running=true;G.paused=false;G.tick=0;
  const name=document.getElementById('nameInp').value.trim()||'You';
  G.playerName=name;
  ['startOv','deadOv','pauseOv'].forEach(id=>document.getElementById(id).style.display='none');
  document.getElementById('pauseBtn').textContent='⏸ Pause';
  const starts=[{x:2,y:2,d:{x:1,y:0}},{x:21,y:21,d:{x:-1,y:0}},{x:2,y:21,d:{x:1,y:0}},{x:21,y:2,d:{x:0,y:1}}];
  G.snakes=[name,...BNAMES].map((n,i)=>({name:n,color:SCOL[i],body:[{x:starts[i].x,y:starts[i].y}],dir:{...starts[i].d},nextDir:{...starts[i].d},alive:true,score:0,isPlayer:i===0,grow:2}));
  G.food=[];G.powerups=[];
  spawnF(6);renderLB();renderPlayers();
  G.loop=setInterval(tick,SPEEDS[G.spdIdx]);
  raf();
}
function tick(){
  if(!G.running||G.paused)return;
  G.tick++;
  G.snakes.forEach(s=>{if(!s.alive||s.isPlayer)return;botAI(s);});
  G.snakes.forEach(s=>{
    if(!s.alive)return;
    s.dir={...s.nextDir};
    const h={x:s.body[0].x+s.dir.x,y:s.body[0].y+s.dir.y};
    if(h.x<0||h.x>=GRID||h.y<0||h.y>=GRID){kill(s);return;}
    if(s.body.some(g=>g.x===h.x&&g.y===h.y)){kill(s);return;}
    for(const o of G.snakes){if(!o.alive||o===s)continue;if(o.body.some(g=>g.x===h.x&&g.y===h.y)){kill(s);return;}}
    s.body.unshift(h);
    const fi=G.food.findIndex(f=>f.x===h.x&&f.y===h.y);
    if(fi!==-1){s.score+=G.food[fi].big?15:5;s.grow+=G.food[fi].big?4:1;G.food.splice(fi,1);spawnF(1);if(s.isPlayer)updScore();}
    else{if(s.grow>0)s.grow--;else s.body.pop();}
    const pi=G.powerups.findIndex(p=>p.x===h.x&&p.y===h.y);
    if(pi!==-1){s.score+=25;s.grow+=3;G.powerups.splice(pi,1);if(s.isPlayer){updScore();flashS();}}
  });
  if(G.tick%40===0&&G.powerups.length<2)spawnPU();
  const pl=G.snakes[0];
  if(pl&&pl.alive)document.getElementById('pLevel').textContent=Math.floor(pl.score/50)+1;
  renderPlayers();
  if(pl&&!pl.alive){endG();return;}
  if(G.snakes.filter(s=>!s.isPlayer&&s.alive).length===0&&pl&&pl.alive)endG(true);
}
function botAI(s){
  const h=s.body[0];
  const dirs=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}].filter(d=>!(d.x===-s.dir.x&&d.y===-s.dir.y));
  const sc=dirs.map(d=>{
    const nx=h.x+d.x,ny=h.y+d.y;
    if(nx<0||nx>=GRID||ny<0||ny>=GRID)return{d,v:-999};
    let v=0;
    for(const sn of G.snakes){if(!sn.alive)continue;if(sn.body.some(g=>g.x===nx&&g.y===ny))return{d,v:-999};}
    if(G.food.length){const near=G.food.reduce((b,f)=>{const dist=Math.abs(f.x-nx)+Math.abs(f.y-ny);return dist<b.d?{d:dist,f}:b},{d:Infinity,f:null});if(near.f)v+=20-near.d;}
    v+=(Math.random()-.5)*8;return{d,v};
  });
  sc.sort((a,b)=>b.v-a.v);
  if(sc.length&&sc[0].v>-900)s.nextDir=sc[0].d;
}
function kill(s){s.alive=false;if(s.isPlayer)s.body.forEach(seg=>{if(Math.random()<.4)G.food.push({...seg,value:5,big:false,color:'#fbbf24'});});}
function endG(won=false){
  G.running=false;
  if(G.loop)clearInterval(G.loop);
  if(G.frame)cancelAnimationFrame(G.frame);
  const pl=G.snakes[0],score=pl?pl.score:0,name=G.playerName;
  const ex=G.lb.find(e=>e.name===name);
  let isNew=false;
  if(ex){if(score>ex.score){ex.score=score;isNew=true;}}else{G.lb.push({name,score});isNew=true;}
  G.lb.sort((a,b)=>b.score-a.score);G.lb=G.lb.slice(0,10);
  const hi=Math.max(...G.lb.map(e=>e.score));
  document.getElementById('pHigh').textContent=hi;
  renderLB(isNew?name:null);
  document.getElementById('deadIcon').textContent=won?'🏆':'💀';
  document.getElementById('deadTitle').textContent=won?'You Win!':'Game Over';
  document.getElementById('deadSub').textContent='Score: '+score+(won?' — Bots defeated!':'');
  document.getElementById('deadOv').style.display='flex';
}
function rEmpty(){for(let i=0;i<200;i++){const x=Math.floor(Math.random()*GRID),y=Math.floor(Math.random()*GRID);const b=G.snakes.some(s=>s.body.some(g=>g.x===x&&g.y===y))||G.food.some(f=>f.x===x&&f.y===y)||G.powerups.some(p=>p.x===x&&p.y===y);if(!b)return{x,y};}return null;}
function spawnF(n){for(let i=0;i<n;i++){const p=rEmpty();if(!p)continue;const big=Math.random()<.12;G.food.push({...p,value:big?15:5,big,color:FCOL[Math.floor(Math.random()*FCOL.length)]});}}
function spawnPU(){const p=rEmpty();if(p)G.powerups.push({...p,type:'⭐'});}
function updScore(){const pl=G.snakes[0];if(pl){document.getElementById('pScore').textContent=pl.score;const hi=Math.max(...G.lb.map(e=>e.score),pl.score);document.getElementById('pHigh').textContent=hi;}}
let _ft;function flashS(){const el=document.getElementById('pScore');el.style.color='#fbbf24';clearTimeout(_ft);_ft=setTimeout(()=>el.style.color='',400);}
function toggleP(){if(!G.running)return;G.paused=!G.paused;document.getElementById('pauseBtn').textContent=G.paused?'▶ Resume':'⏸ Pause';document.getElementById('pauseOv').style.display=G.paused?'flex':'none';if(!G.paused)raf();}
function setSp(i){G.spdIdx=i-1;document.querySelectorAll('.sp-btn').forEach((b,j)=>b.classList.toggle('on',j===G.spdIdx));if(G.running&&G.loop){clearInterval(G.loop);G.loop=setInterval(tick,SPEEDS[G.spdIdx]);}}
function raf(){G.frame=requestAnimationFrame(()=>{if(!G.running)return;draw();raf();});}
function draw(){
  const canvas=document.getElementById('gc'),ctx=canvas.getContext('2d'),C=CELL,W=GRID*C;
  const dk=document.documentElement.getAttribute('data-theme')!=='light';
  ctx.fillStyle=dk?'#0d0d0d':'#F5F0E8';ctx.fillRect(0,0,W,W);
  ctx.strokeStyle=dk?'rgba(255,255,255,0.025)':'rgba(26,22,18,0.04)';ctx.lineWidth=.5;
  for(let i=0;i<=GRID;i++){ctx.beginPath();ctx.moveTo(i*C,0);ctx.lineTo(i*C,W);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*C);ctx.lineTo(W,i*C);ctx.stroke();}
  G.food.forEach(f=>{const cx=f.x*C+C/2,cy=f.y*C+C/2,r=f.big?C*.42:C*.3;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=f.color;if(f.big){ctx.shadowBlur=8;ctx.shadowColor=f.color;}ctx.fill();ctx.shadowBlur=0;});
  G.powerups.forEach(p=>{const pulse=.8+.2*Math.sin(Date.now()/200);ctx.font=Math.round(C*.75*pulse)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.type,p.x*C+C/2,p.y*C+C/2);});
  G.snakes.forEach(s=>{
    if(!s.alive)return;
    s.body.forEach((seg,i)=>{
      ctx.globalAlpha=s.isPlayer?1:(.75+.25*(1-i/s.body.length));
      ctx.fillStyle=s.color;
      ctx.beginPath();
      if(ctx.roundRect)ctx.roundRect(seg.x*C+1,seg.y*C+1,C-2,C-2,(C*.38)*.6);
      else ctx.rect(seg.x*C+1,seg.y*C+1,C-2,C-2);
      ctx.fill();
      if(i===0){
        ctx.globalAlpha=1;
        const ex=seg.x*C+C/2+s.dir.x*C*.2+s.dir.y*C*.15,ey=seg.y*C+C/2+s.dir.y*C*.2+s.dir.x*C*.15;
        ctx.beginPath();ctx.arc(ex,ey,C*.1,0,Math.PI*2);ctx.fillStyle=dk?'#000':'#fff';ctx.fill();
        if(s.isPlayer){ctx.font=Math.round(C*.5)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalAlpha=.9;ctx.fillText('👑',seg.x*C+C/2,seg.y*C+C/2-C*.55);}
      }
    });
    ctx.globalAlpha=1;
  });
}
function renderPlayers(){const w=document.getElementById('livePl');w.innerHTML=G.snakes.map(s=>'<div class="pr'+(s.alive===false?' dead':'')+'"><div class="pd" style="background:'+s.color+'"></div><span class="pn">'+(s.isPlayer?'👑 ':'🤖 ')+s.name+'</span><span class="ps">'+s.score+'</span><span style="font-size:10px">'+(s.alive===false?'💀':'🟢')+'</span></div>').join('');}
function renderLB(hl){const w=document.getElementById('lb'),m=['🥇','🥈','🥉'];w.innerHTML=G.lb.slice(0,8).map((e,i)=>'<div class="lr"><span class="lrank">'+(m[i]||(i+1))+'</span><span class="lname">'+e.name+'</span>'+(e.name===hl?'<span class="lnew">NEW</span>':'')+'<span class="lscore">'+e.score+'</span></div>').join('');}
const KM={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0},W:{x:0,y:-1},S:{x:0,y:1},A:{x:-1,y:0},D:{x:1,y:0}};
document.addEventListener('keydown',e=>{
  if(!G.running)return;
  if(e.key===' '||e.key==='p'||e.key==='P'){e.preventDefault();toggleP();return;}
  const dir=KM[e.key];if(!dir)return;e.preventDefault();
  const pl=G.snakes[0];if(!pl||!pl.alive)return;
  if(dir.x===-pl.dir.x&&dir.y===-pl.dir.y)return;
  pl.nextDir=dir;
});
let tx0,ty0;
document.getElementById('gc').addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;e.preventDefault();},{passive:false});
document.getElementById('gc').addEventListener('touchend',e=>{
  if(!G.running||G.paused)return;
  const dx=e.changedTouches[0].clientX-tx0,dy=e.changedTouches[0].clientY-ty0;
  const pl=G.snakes[0];if(!pl||!pl.alive)return;
  let dir;if(Math.abs(dx)>Math.abs(dy))dir=dx>0?{x:1,y:0}:{x:-1,y:0};else dir=dy>0?{x:0,y:1}:{x:0,y:-1};
  if(dir.x===-pl.dir.x&&dir.y===-pl.dir.y)return;pl.nextDir=dir;e.preventDefault();
},{passive:false});
renderLB();
<\/script></body></html>`);
  win.document.close();
  closeSnake();
  showToast('Snake Arena popped out! 🐍');
}