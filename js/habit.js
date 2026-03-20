/* ══════════════════════════════════════════════════
   HABIT TRACKER — STREAKR
══════════════════════════════════════════════════ */

const SHAME_MSGS = [
  "pathetic", "we both know you're not doing this", "lol sure",
  "your future self is disappointed", "streak of zero. iconic.",
  "even your plant is more disciplined", "big talk, no walk"
];
const ROAST_MSGS = [
  "streak obliterated 💀", "RIP your discipline", "back to zero, champ",
  "the streak had a good run... not really", "oof. that's embarrassing"
];
const EMOJI_OPTIONS = ['💪','📖','🧘','💧','📵','💻','🎨','🏃','✍️','🎵','🥗','😴'];

let habitData = {
  habits: [
    { id:1, name:'Exercise',       emoji:'💪', history: generateHistory(14) },
    { id:2, name:'Read 30min',     emoji:'📖', history: generateHistory(8)  },
    { id:3, name:'Meditate',       emoji:'🧘', history: generateHistory(3)  },
    { id:4, name:'Drink Water',    emoji:'💧', history: generateHistory(21) },
    { id:5, name:'No Social Media',emoji:'📵', history: generateHistory(0)  },
    { id:6, name:'Code Something', emoji:'💻', history: generateHistory(5)  },
  ],
  nextId: 10,
  calMonth: new Date().getMonth(),
  calYear: new Date().getFullYear(),
  selectedEmoji: '🎯',
};

function generateHistory(streakDays) {
  const h = {};
  const today = new Date();
  for (let i = 0; i < streakDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    h[dateKey(d)] = true;
  }
  // sprinkle some older history
  for (let i = streakDays + 2; i < streakDays + 8; i++) {
    if (Math.random() > 0.5) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      h[dateKey(d)] = true;
    }
  }
  return h;
}

function dateKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function todayKey() { return dateKey(new Date()); }

function getStreak(habit) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (habit.history[dateKey(d)]) streak++;
    else break;
  }
  return streak;
}

function getBestStreak(habit) {
  let best = 0, cur = 0;
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (habit.history[dateKey(d)]) { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }
  return best;
}

function getLast7(habit) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(habit.history[dateKey(d)] ? true : false);
  }
  return days;
}

/* ── OPEN / CLOSE ──────────────────────────────── */
function openHabit() {
  renderHabit();
  document.getElementById('habitModal').classList.add('open');
}
function closeHabit() { document.getElementById('habitModal').classList.remove('open'); }
function closeHabitBg(e) { if (e.target === document.getElementById('habitModal')) closeHabit(); }

/* ── RENDER ────────────────────────────────────── */
function renderHabit() {
  renderHabitStats();
  renderHabitList();
  renderHabitCalendar();
}

function renderHabitStats() {
  const habits = habitData.habits;
  const streaks = habits.map(h => getStreak(h));
  const total = habits.length;
  const avgStreak = total ? (streaks.reduce((a,b) => a+b, 0) / total).toFixed(1) : 0;
  const bestStreak = Math.max(0, ...habits.map(h => getBestStreak(h)));
  const broken = streaks.filter(s => s === 0).length;
  const shameScore = total ? Math.round((broken / total) * 100) : 0;

  document.getElementById('haStatTotal').textContent = total;
  document.getElementById('haStatAvg').textContent = avgStreak;
  document.getElementById('haStatBest').textContent = bestStreak;
  document.getElementById('haStatShame').textContent = shameScore + '%';
  document.getElementById('haStatShame').style.color = shameScore > 50 ? '#dc2626' : shameScore > 25 ? '#f59e0b' : '#10b981';
}

function renderHabitList() {
  const container = document.getElementById('haHabits');
  const tk = todayKey();
  container.innerHTML = habitData.habits.map(h => {
    const streak = getStreak(h);
    const checked = h.history[tk];
    const last7 = getLast7(h);
    const isShame = streak === 0;
    const isFire = streak >= 7;
    const shameMsg = isShame ? SHAME_MSGS[h.id % SHAME_MSGS.length] : '';

    return `<div class="ha-habit ${isShame ? 'shame' : ''} ${isFire ? 'fire' : ''}" data-id="${h.id}">
      <button class="ha-habit-check ${checked ? 'checked' : ''}" onclick="toggleHabitToday(${h.id}, event)">${checked ? '✓' : ''}</button>
      <div class="ha-habit-emoji">${h.emoji}</div>
      <div class="ha-habit-info">
        <div class="ha-habit-name">${h.name}</div>
        ${isShame ? `<div class="ha-habit-shame">${shameMsg}</div>` : ''}
      </div>
      <div class="ha-habit-history">${last7.map(done =>
        `<div class="ha-hist-day ${done ? (streak >= 7 ? 'l4' : streak >= 3 ? 'l3' : 'l2') : ''}"></div>`
      ).join('')}</div>
      <div class="ha-habit-streak ${streak >= 7 ? 'hot' : ''}">
        ${streak > 0 ? streak + ' 🔥' : '0'}
      </div>
    </div>`;
  }).join('');
}

function toggleHabitToday(id, event) {
  event.stopPropagation();
  const habit = habitData.habits.find(h => h.id === id);
  if (!habit) return;
  const tk = todayKey();
  const hadStreak = getStreak(habit);

  if (habit.history[tk]) {
    delete habit.history[tk];
    // If breaking a streak > 1, roast
    if (hadStreak > 1) {
      showStreakBreak(event.target.closest('.ha-habit'), hadStreak);
    }
  } else {
    habit.history[tk] = true;
    const newStreak = getStreak(habit);
    if (newStreak >= 7) {
      spawnFireParticles(event.target.closest('.ha-habit'));
    }
    if (newStreak === 1 && hadStreak === 0) {
      showToast('First step! Keep it going 💪');
    } else if (newStreak >= 7) {
      showToast(`${habit.emoji} ${newStreak}-day streak! You're on fire! 🔥`);
    }
  }
  renderHabit();
}

function showStreakBreak(el, oldStreak) {
  const msg = ROAST_MSGS[Math.floor(Math.random() * ROAST_MSGS.length)];
  showToast(`${oldStreak}-day streak broken... ${msg}`);
  if (el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.5s ease';
  }
}

function spawnFireParticles(el) {
  if (!el) return;
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('span');
    p.className = 'ha-fire-particle';
    p.textContent = '🔥';
    p.style.left = (20 + Math.random() * 60) + '%';
    p.style.top = (20 + Math.random() * 40) + '%';
    p.style.animationDelay = (Math.random() * 0.3) + 's';
    el.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

/* ── CALENDAR ──────────────────────────────────── */
function renderHabitCalendar() {
  const { calMonth, calYear } = habitData;
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('haCalMonth').textContent = monthNames[calMonth] + ' ' + calYear;

  const grid = document.getElementById('haCalGrid');
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = dayLabels.map(d => `<div class="ha-cal-day-label">${d}</div>`).join('');

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    html += '<div class="ha-cal-day empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = calYear + '-' + String(calMonth+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    // Count how many habits were done on this day
    const count = habitData.habits.filter(h => h.history[key]).length;
    const total = habitData.habits.length;
    const ratio = total ? count / total : 0;
    let cls = '';
    if (ratio > 0.8) cls = 'c5';
    else if (ratio > 0.6) cls = 'c4';
    else if (ratio > 0.4) cls = 'c3';
    else if (ratio > 0.2) cls = 'c2';
    else if (ratio > 0) cls = 'c1';

    const isToday = today.getDate() === d && today.getMonth() === calMonth && today.getFullYear() === calYear;
    html += `<div class="ha-cal-day ${cls} ${isToday ? 'today' : ''}" onclick="toggleCalDay('${key}', this)">${d}</div>`;
  }

  grid.innerHTML = html;
}

function toggleCalDay(key, el) {
  // Toggle all habits for this day
  const allDone = habitData.habits.every(h => h.history[key]);
  habitData.habits.forEach(h => {
    if (allDone) delete h.history[key];
    else h.history[key] = true;
  });
  renderHabit();
}

function prevHabitMonth() {
  habitData.calMonth--;
  if (habitData.calMonth < 0) { habitData.calMonth = 11; habitData.calYear--; }
  renderHabitCalendar();
}
function nextHabitMonth() {
  habitData.calMonth++;
  if (habitData.calMonth > 11) { habitData.calMonth = 0; habitData.calYear++; }
  renderHabitCalendar();
}

/* ── ADD HABIT ─────────────────────────────────── */
function selectHabitEmoji(emoji, btn) {
  habitData.selectedEmoji = emoji;
  document.querySelectorAll('.ha-emoji-pick').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function addHabit() {
  const input = document.getElementById('haNewName');
  const name = input.value.trim();
  if (!name) { input.focus(); return; }
  habitData.habits.push({
    id: habitData.nextId++,
    name: name,
    emoji: habitData.selectedEmoji,
    history: {},
  });
  input.value = '';
  renderHabit();
  showToast(`${habitData.selectedEmoji} "${name}" added! Now actually do it.`);
}

/* ── POPOUT ────────────────────────────────────── */
function popoutHabit() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'HabitTracker', 'width=640,height=780,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  const stateJson = JSON.stringify(habitData);

  const cssEl = document.querySelector('link[href="css/habit.css"]');
  const cssText = Array.from(document.styleSheets).reduce((acc, sheet) => {
    try {
      if (sheet.href && sheet.href.includes('habit.css')) {
        acc += Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
      }
    } catch(e) {}
    return acc;
  }, '');

  // Read the JS source
  const jsEl = document.querySelector('script[src="js/habit.js"]');

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Streakr 🔥</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --trans: all 0.3s cubic-bezier(0.23,1,0.32,1); }
[data-theme="dark"] {
  --bg:#0f0f0f; --surface:#161616; --surface2:#1e1e1e;
  --border:rgba(255,255,255,0.08); --border-em:rgba(255,107,53,0.22);
  --ink:#FAF7F2; --ink-soft:#C8C0B8; --ink-muted:#666;
  --accent:#FF6B35; --accent-deep:#E8521A; --accent-glow:rgba(255,107,53,0.12);
}
[data-theme="light"] {
  --bg:#FAF7F2; --surface:#FFFFFF; --surface2:#F5F0E8;
  --border:rgba(26,22,18,0.08); --border-em:rgba(212,82,26,0.18);
  --ink:#1A1612; --ink-soft:#3D3730; --ink-muted:#9B9086;
  --accent:#D4521A; --accent-deep:#B84416; --accent-glow:rgba(212,82,26,0.08);
}
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--ink); font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; padding:24px; }
.app { max-width:560px; margin:0 auto; }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
.toast{position:fixed;bottom:20px;right:20px;padding:11px 16px;background:var(--surface);border:1px solid var(--border-em);border-radius:12px;font-size:13px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:8px;transform:translateY(60px);opacity:0;transition:all 0.35s cubic-bezier(0.23,1,0.32,1);z-index:999}
.toast.show{transform:translateY(0);opacity:1}
${cssText}
</style>
</head>
<body>
<div class="app">
${document.getElementById('habitApp').innerHTML}
</div>
<div class="toast" id="toast"></div>
<script>
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}
${generateHistory.toString()}
${dateKey.toString()}
${todayKey.toString()}
${getStreak.toString()}
${getBestStreak.toString()}
${getLast7.toString()}
${renderHabit.toString()}
${renderHabitStats.toString()}
${renderHabitList.toString()}
${toggleHabitToday.toString()}
${showStreakBreak.toString()}
${spawnFireParticles.toString()}
${renderHabitCalendar.toString()}
${toggleCalDay.toString()}
${prevHabitMonth.toString()}
${nextHabitMonth.toString()}
${selectHabitEmoji.toString()}
${addHabit.toString()}
const SHAME_MSGS = ${JSON.stringify(SHAME_MSGS)};
const ROAST_MSGS = ${JSON.stringify(ROAST_MSGS)};
const EMOJI_OPTIONS = ${JSON.stringify(EMOJI_OPTIONS)};
let habitData = ${stateJson};
renderHabit();
<\/script>
</body></html>`);
  win.document.close();
  closeHabit();
  showToast('Popped out! 🚀');
}
