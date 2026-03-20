/* ══════════════════════════════════════════════════
   DONE. — THE TODO APP THAT JUDGES YOU
══════════════════════════════════════════════════ */

const SNARKY_COMPLETE = [
  "wow, actually doing something?",
  "look at you being productive!",
  "only took you forever",
  "the bar was on the floor and you cleared it",
  "slow clap initiated",
  "a miracle has occurred",
  "screenshot this, it won't happen again",
  "your therapist would be proud",
];

const SNARKY_ADD = [
  "sure, add another one you'll ignore",
  "ambitious. love that for you.",
  "the audacity of adding more",
  "you know you won't do this, right?",
  "delusion is a powerful motivator",
  "noted. filed under: wishful thinking",
];

const SHAME_MESSAGES = [
  "3 days... really?",
  "this one's gathering dust",
  "it's judging you back",
  "at this point just delete it",
  "even your phone is disappointed",
  "this task has trust issues now",
];

const ROASTS = {
  terrible: [
    "your productivity is a war crime",
    "have you tried... doing things?",
    "the tasks are winning",
  ],
  bad: [
    "participation trophy energy",
    "it's giving 'I'll start Monday'",
    "you're statistically unimpressive",
  ],
  ok: [
    "mediocre, but make it fashion",
    "C+ effort, honestly",
    "the bare minimum was achieved",
  ],
  good: [
    "okay fine, you're doing alright",
    "giving main character energy (almost)",
    "your mom would be mildly proud",
  ],
  great: [
    "suspiciously productive today",
    "who are you and what happened?",
    "slay (said reluctantly)",
  ],
};

let todoData = {
  today: [
    { id: 1, text: "respond to that email from 2 weeks ago", done: false, tag: 'urgent', age: 3 },
    { id: 2, text: "ship the vibe project", done: true, tag: 'work', age: 0 },
    { id: 3, text: "touch grass (metaphorically counts)", done: false, tag: 'life', age: 5 },
    { id: 4, text: "fix that bug you introduced 'real quick'", done: false, tag: 'urgent', age: 2 },
    { id: 5, text: "drink water (you haven't since morning)", done: false, tag: 'life', age: 0 },
    { id: 6, text: "one more prompt... (lies)", done: true, tag: 'fun', age: 0 },
  ],
  tomorrow: [
    { id: 7, text: "actually read that article you bookmarked", done: false, tag: 'chill', age: 7 },
    { id: 8, text: "meal prep (lol who are we kidding)", done: false, tag: 'life', age: 4 },
    { id: 9, text: "update portfolio with new projects", done: false, tag: 'work', age: 1 },
    { id: 10, text: "call mom back", done: false, tag: 'urgent', age: 6 },
    { id: 11, text: "delete old screenshots (there are 4,000)", done: false, tag: 'chill', age: 0 },
  ],
  someday: [
    { id: 12, text: "learn that framework everyone's talking about", done: false, tag: 'work', age: 14 },
    { id: 13, text: "organize desktop (it's been 2 years)", done: false, tag: 'chill', age: 30 },
    { id: 14, text: "start a side project (another one)", done: false, tag: 'fun', age: 10 },
    { id: 15, text: "go to the gym (the free trial expired)", done: false, tag: 'life', age: 20 },
    { id: 16, text: "write that blog post about productivity", done: false, tag: 'fun', age: 45 },
    { id: 17, text: "become a morning person", done: false, tag: 'life', age: 365 },
  ],
};

let todoTab = 'today';
let todoNextId = 100;
let todoStreak = 3;

/* ── OPEN / CLOSE ──────────────────────────────── */
function openTodo() {
  renderTodo();
  document.getElementById('todoModal').classList.add('open');
}
function closeTodo() { document.getElementById('todoModal').classList.remove('open'); }
function closeTodoBg(e) { if (e.target === document.getElementById('todoModal')) closeTodo(); }

/* ── RENDER ────────────────────────────────────── */
function renderTodo() {
  renderTabs();
  renderTodoList();
  renderStats();
}

function renderTabs() {
  const tabs = document.getElementById('tdTabs');
  const categories = ['today', 'tomorrow', 'someday'];
  tabs.innerHTML = categories.map(cat => {
    const count = todoData[cat].filter(t => !t.done).length;
    return `<button class="td-tab${todoTab === cat ? ' active' : ''}"
                    onclick="switchTab('${cat}')">
      ${cat}
      <span class="td-tab-count">${count}</span>
    </button>`;
  }).join('');
}

function switchTab(tab) {
  todoTab = tab;
  renderTodo();
}

function renderTodoList() {
  const list = document.getElementById('tdList');
  const items = todoData[todoTab];

  if (!items.length) {
    list.innerHTML = '<div class="td-empty">nothing here. suspicious. 🤨</div>';
    return;
  }

  list.innerHTML = items.map((item, i) => {
    const isShame = !item.done && item.age >= 3;
    const shameMsg = isShame ? SHAME_MESSAGES[Math.floor(item.age * 7 % SHAME_MESSAGES.length)] : '';
    return `<div class="td-item${item.done ? ' done' : ''}${isShame ? ' shame' : ''}"
                 style="animation-delay:${i * 0.04}s" id="todo-${item.id}">
      <button class="td-check${item.done ? ' checked' : ''}"
              onclick="toggleTodo(${item.id}, event)"></button>
      <span class="td-text">${item.text}</span>
      ${item.tag ? `<span class="td-tag ${item.tag}">${item.tag}</span>` : ''}
      <button class="td-del" onclick="deleteTodo(${item.id})" title="Delete">&#215;</button>
      ${isShame ? `<span class="td-shame-msg">${shameMsg}</span>` : ''}
    </div>`;
  }).join('');
}

function renderStats() {
  const all = [...todoData.today, ...todoData.tomorrow, ...todoData.someday];
  const total = all.length;
  const done = all.filter(t => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('tdDone').textContent = done;
  document.getElementById('tdTotal').textContent = total;
  document.getElementById('tdStreak').textContent = todoStreak;
  document.getElementById('tdScore').textContent = pct + '%';

  // Roast
  const roastEl = document.getElementById('tdRoast');
  let tier;
  if (pct < 15) tier = 'terrible';
  else if (pct < 30) tier = 'bad';
  else if (pct < 50) tier = 'ok';
  else if (pct < 75) tier = 'good';
  else tier = 'great';

  const roasts = ROASTS[tier];
  roastEl.textContent = '"' + roasts[Math.floor(Math.random() * roasts.length)] + '"';
}

/* ── TOGGLE TODO ───────────────────────────────── */
function toggleTodo(id, event) {
  const items = todoData[todoTab];
  const item = items.find(t => t.id === id);
  if (!item) return;

  item.done = !item.done;

  if (item.done) {
    item.age = 0;
    todoStreak = Math.min(todoStreak + 1, 99);
    spawnConfetti(event);
    showToast(SNARKY_COMPLETE[Math.floor(Math.random() * SNARKY_COMPLETE.length)]);
  } else {
    todoStreak = Math.max(todoStreak - 1, 0);
  }

  renderTodo();
}

/* ── ADD TODO ──────────────────────────────────── */
function addTodo() {
  const input = document.getElementById('tdAddInput');
  const text = input.value.trim();
  if (!text) { input.focus(); return; }

  todoData[todoTab].push({
    id: todoNextId++,
    text: text,
    done: false,
    tag: null,
    age: 0,
  });

  input.value = '';
  renderTodo();
  showToast(SNARKY_ADD[Math.floor(Math.random() * SNARKY_ADD.length)]);
}

/* ── DELETE TODO ───────────────────────────────── */
function deleteTodo(id) {
  todoData[todoTab] = todoData[todoTab].filter(t => t.id !== id);
  renderTodo();
}

/* ── CONFETTI ──────────────────────────────────── */
function spawnConfetti(event) {
  const colors = ['#FF6B35', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
  const container = document.createElement('div');
  container.className = 'td-confetti';
  container.style.left = event.clientX + 'px';
  container.style.top = event.clientY + 'px';
  document.body.appendChild(container);

  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'td-particle';
    const angle = (Math.PI * 2 / 12) * i + (Math.random() - 0.5) * 0.5;
    const dist = 30 + Math.random() * 40;
    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(angle) * dist - 20 + 'px');
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 0.1) + 's';
    container.appendChild(p);
  }

  setTimeout(() => container.remove(), 1000);
}

/* ── POPOUT ─────────────────────────────────────── */
function popoutTodo() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'DoneTodo', 'width=560,height=720,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  const cssText = document.querySelector('link[href="css/todo.css"]').sheet;
  let css = '';
  try { for (const rule of cssText.cssRules) css += rule.cssText + '\n'; } catch(e) {}

  const mainCss = document.querySelector('link[href="css/main.css"]').sheet;
  let mainCssText = '';
  try { for (const rule of mainCss.cssRules) mainCssText += rule.cssText + '\n'; } catch(e) {}

  const appHtml = document.getElementById('todoApp').outerHTML;
  const stateData = JSON.stringify(todoData);

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>done. ✅</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${mainCssText}
${css}
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--ink); font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; padding:24px; }
.todo-app { width:100%; max-width:480px; margin:0 auto; transform:none; box-shadow:none; border:none; padding:0; max-height:none; }
.td-close, .td-popout { display:none; }
</style>
</head>
<body>
${appHtml}
<script>
const SNARKY_COMPLETE=${JSON.stringify(SNARKY_COMPLETE)};
const SNARKY_ADD=${JSON.stringify(SNARKY_ADD)};
const SHAME_MESSAGES=${JSON.stringify(SHAME_MESSAGES)};
const ROASTS=${JSON.stringify(ROASTS)};
let todoData=${stateData};
let todoTab='${todoTab}';
let todoNextId=${todoNextId};
let todoStreak=${todoStreak};
${renderTodo.toString()}
${renderTabs.toString()}
${switchTab.toString()}
${renderTodoList.toString()}
${renderStats.toString()}
${toggleTodo.toString()}
${addTodo.toString()}
${deleteTodo.toString()}
${spawnConfetti.toString()}
function showToast(m){/* no-op in popout */}
document.addEventListener('keydown',e=>{
  const input=document.getElementById('tdAddInput');
  if(e.key==='Enter'&&document.activeElement===input)addTodo();
});
renderTodo();
<\/script>
</body></html>`);
  win.document.close();
  closeTodo();
  showToast('Popped out! 🚀');
}

/* ── KEYBOARD ──────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('todoModal').classList.contains('open')) {
    closeTodo();
  }
  if (e.key === 'Enter' && document.activeElement === document.getElementById('tdAddInput')) {
    addTodo();
  }
});
