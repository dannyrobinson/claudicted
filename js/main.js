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
let isDark = false;

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
function openModal() {
  if (!currentUser) {
    openLogin();
    showToast('Sign in first to share your vibe!');
    return;
  }
  document.getElementById('modal').classList.add('open');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }
function closeMBg(e) { if (e.target === document.getElementById('modal')) closeModal(); }
function submitVibe() {
  // Check if user is signed in
  if (!currentUser) {
    closeModal();
    openLogin();
    showToast('Sign in first to share your vibe!');
    return;
  }

  const title = document.getElementById('vibeTitle')?.value?.trim();
  const prompt = document.getElementById('vibePrompt')?.value?.trim();
  const description = document.getElementById('vibeDescription')?.value?.trim();
  const liveUrl = document.getElementById('vibeUrl')?.value?.trim();
  const tagsStr = document.getElementById('vibeTags')?.value?.trim();

  if (!title) {
    showToast('Give your vibe a title!');
    shake(document.getElementById('vibeTitle'));
    return;
  }

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

  createPost({
    title,
    prompt: prompt || '',
    description: description || '',
    liveUrl: liveUrl || '',
    tags
  }).then(() => {
    // Clear form
    document.getElementById('vibeTitle').value = '';
    document.getElementById('vibePrompt').value = '';
    document.getElementById('vibeDescription').value = '';
    document.getElementById('vibeUrl').value = '';
    document.getElementById('vibeTags').value = '';
    closeModal();
    showToast("Vibe posted! You're officially Claudicted 🔥");
  }).catch(err => {
    console.error('Post failed:', err);
    showToast('Something went wrong. Try again!');
  });
}
function setF(btn) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const filterText = btn.textContent.trim().toLowerCase();

  if (filterText === 'all vibes') activeFilter = 'all';
  else if (filterText === 'full apps') activeFilter = 'app';
  else if (filterText === 'ui / components') activeFilter = 'ui';
  else if (filterText === 'tools') activeFilter = 'tool';
  else if (filterText === 'games') activeFilter = 'game';
  else if (filterText === 'going wild') activeFilter = 'wild';
  else activeFilter = 'all';

  renderCards();
}

let tt;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(()=>t.classList.remove('show'), 3000);
}
function likeCard(btn) {
  const postId = btn.dataset.postId;
  if (!postId) {
    // Fallback for non-firebase cards (shouldn't happen but just in case)
    const n = parseInt(btn.textContent.replace(/\D/g, ''));
    btn.textContent = `❤ ${(n + 1).toLocaleString()}`;
    btn.style.color = '#FF6B35';
    return;
  }

  if (!currentUser) {
    openLogin();
    showToast('Sign in to like vibes!');
    return;
  }

  toggleLike(postId, btn);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeLogin();
    if (typeof closeMyVibes === 'function') closeMyVibes();
    if (typeof closeProfileEdit === 'function') closeProfileEdit();
    if (typeof closeEditPost === 'function') closeEditPost();
    if (typeof closeDeleteConfirm === 'function') closeDeleteConfirm();
  }
});

/* ── Auth (delegates to firebase-app.js) ── */
function openLogin() {
  document.getElementById('loginModal').classList.add('open');
}
function closeLogin() {
  document.getElementById('loginModal').classList.remove('open');
}
