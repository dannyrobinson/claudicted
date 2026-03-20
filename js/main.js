/* ══════════════════════════════════════════════════
   CLAUDICTED — SHARED JS
   Theme, prompt box, modals, toast, login
══════════════════════════════════════════════════ */

// ── UTILS ──────────────────────────────────────────
function shake(el) {
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', ()=>el.style.animation='', {once:true});
}

// ── THEME ──────────────────────────────────────────
let isDark = true;

function toggleTheme() {
  isDark = !isDark;
  const html = document.documentElement;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('toggleEmoji').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('toggleLabel').textContent = isDark ? 'Day' : 'Night';
}

// ── PROMPT BOX ─────────────────────────────────────
const MAX = 500;

function onPromptInput(el) {
  const len = el.value.length;
  document.getElementById('charCount').textContent = `${len} / ${MAX}`;
  document.getElementById('sendBtn').disabled = len === 0;
  if (len > MAX) el.value = el.value.slice(0, MAX);
  // auto-grow
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 240) + 'px';
}

function handleKey(e) {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    sendPrompt();
  }
}

function insertChip(text) {
  const ta = document.getElementById('promptInput');
  ta.value = text + ' ';
  ta.focus();
  onPromptInput(ta);
}

const responses = [
  "Sounds like a killer build! Sounds like it fits best under **Full Apps** → **Dashboard**. Want to tag it with `react`, `shadcn`, and `saas`? I'll pre-fill the rest.",
  "Love it. I'd title this: *\"I built X in one sitting and I refuse to explain myself.\"* Want me to draft the full post?",
  "Game builds always go viral here. I'll tag it `game`, `canvas`, and `2m build`. Should I add your live URL or is this a local legend?",
  "This is Claudicted material. Want me to pull the exact prompt from your description and auto-generate the tags?",
  "Okay this is going in the *Going Wild* category and I will not be taking questions. Confirm and I'll post it? 🔥"
];
let rIdx = 0;

function sendPrompt() {
  const val = document.getElementById('promptInput').value.trim();
  if (!val) return;
  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  // simulate thinking
  const r = document.getElementById('aiResponse');
  const rt = document.getElementById('aiResponseText');
  r.classList.remove('show');
  setTimeout(() => {
    rt.innerHTML = responses[rIdx % responses.length].replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
    r.classList.add('show');
    rIdx++;
    btn.disabled = false;
  }, 800);
}

// ── UI HELPERS ─────────────────────────────────────
function openModal() { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }
function closeMBg(e) { if (e.target === document.getElementById('modal')) closeModal(); }
function submitVibe() { closeModal(); showToast("Vibe posted! You're officially Claudicted 🔥"); }
function setF(btn) { document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('on')); btn.classList.add('on'); }

let tt;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(()=>t.classList.remove('show'), 3000);
}
function likeCard(btn) {
  const n = parseInt(btn.textContent.replace(/\D/g,''));
  if (btn.dataset.liked) {
    btn.textContent = `❤ ${(n-1).toLocaleString()}`;
    btn.style.color = '';
    delete btn.dataset.liked;
  } else {
    btn.textContent = `❤ ${(n+1).toLocaleString()}`;
    btn.style.color = '#FF6B35';
    btn.dataset.liked = '1';
    showToast('Liked! Good taste 🔥');
  }
}
document.addEventListener('keydown', e => { if (e.key==='Escape') { closeModal(); closeLogin(); } });

// ── LOGIN ────────────────────────────────────────────────
const USERS = {
  'danny@fpes.ca': { name: 'Danny', color: '#818cf8', initials: 'D' },
  'david@claudicted.com': { name: 'David', color: '#FF6B35', initials: 'D' },
};
const PASS = 'claudicted2025';

function openLogin() {
  document.getElementById('loginModal').classList.add('open');
  setTimeout(() => document.getElementById('loginEmail').focus(), 100);
}
function closeLogin() {
  document.getElementById('loginModal').classList.remove('open');
  document.getElementById('loginHint').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
}
function checkLoginHint() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  document.getElementById('loginHint').style.display = USERS[email] ? 'block' : 'none';
  document.getElementById('loginError').style.display = 'none';
}
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPassword').value;
  const user  = USERS[email];
  if (!user || pass !== PASS) {
    document.getElementById('loginError').style.display = 'block';
    shake(document.getElementById('loginPassword'));
    return;
  }
  closeLogin();
  // Update nav sign-in button
  const btn = document.querySelector('.btn-primary');
  btn.textContent = `${user.name} ✓`;
  btn.style.background = user.color;
  btn.onclick = null;
  // If Danny, show him online
  if (email === 'danny@fpes.ca') {
    const dot = document.getElementById('dannyOnlineDot');
    if (dot) { dot.style.background = '#16a34a'; dot.title = 'Online'; }
  }
  showToast(`Welcome back, ${user.name}! 🔥`);
}
