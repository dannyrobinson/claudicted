/* ══════════════════════════════════════════════════
   CLAUDICTED — SEED DATA
   Showcase posts & card preview templates
══════════════════════════════════════════════════ */

// ── FORMAT HELPER ────────────────────────────────
function formatCount(n) {
  if (n >= 1000) {
    const val = n / 1000;
    // Show one decimal if not a whole number
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'k';
  }
  return String(n);
}

// ── SHOWCASE POSTS ───────────────────────────────
const SHOWCASE_POSTS = [
  {
    showcaseId: 'saas',
    title: 'Full SaaS Analytics Dashboard \u2014 1 Prompt, 40 Minutes',
    prompt: 'build me a saas dashboard...',
    tags: ['saas', 'dashboard', 'react', 'shadcn'],
    authorName: '@mkovalenko',
    authorInitials: 'MK',
    authorGradient: 'linear-gradient(135deg,#6366f1,#818cf8)',
    authorTextColor: 'white',
    views: 18400,
    likes: 2800,
    featured: true,
    previewClass: 'p1',
    openFunction: 'openSaaS',
    openBtnText: 'Open Dashboard',
    type: 'showcase'
  },
  {
    showcaseId: 'budget',
    title: 'Budget Tracker That Actually Works',
    prompt: 'personal finance...',
    tags: ['finance', 'vanilla js'],
    authorName: '@jtanaka',
    authorInitials: 'JT',
    authorGradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    authorTextColor: '#1A1612',
    views: 9200,
    likes: 1200,
    featured: false,
    previewClass: 'p2',
    openFunction: 'openBudget',
    openBtnText: 'Open App',
    type: 'showcase'
  },
  {
    showcaseId: 'snake',
    title: 'Snake Game in 2 Minutes',
    prompt: 'create game',
    tags: ['game', 'canvas', '2m build'],
    authorName: '@asmithdev',
    authorInitials: 'AS',
    authorGradient: 'linear-gradient(135deg,#16a34a,#4ade80)',
    authorTextColor: 'white',
    views: 4700,
    likes: 743,
    featured: false,
    previewClass: 'p3',
    openFunction: 'openSnake',
    openBtnText: 'Play Now',
    type: 'showcase'
  },
  {
    showcaseId: 'recipe',
    title: 'Recipe App with Beautiful UI',
    prompt: 'design a recipe app...',
    tags: ['food', 'mobile ui', 'tailwind'],
    authorName: '@priyalives',
    authorInitials: 'PL',
    authorGradient: 'linear-gradient(135deg,#ec4899,#f472b6)',
    authorTextColor: 'white',
    views: 11300,
    likes: 2100,
    featured: false,
    previewClass: 'p4',
    openFunction: 'openRecipe',
    openBtnText: 'View Project',
    type: 'showcase'
  },
  {
    showcaseId: 'portfolio',
    title: 'Animated Portfolio Site',
    prompt: 'design a portfolio...',
    tags: ['portfolio', 'motion', 'gsap'],
    authorName: '@danielosei',
    authorInitials: 'DO',
    authorGradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    authorTextColor: 'white',
    views: 6800,
    likes: 1500,
    featured: false,
    previewClass: 'p5',
    openFunction: 'openPortfolio',
    openBtnText: 'View Project',
    type: 'showcase'
  },
  {
    showcaseId: 'writer',
    title: 'AI Writing Coach',
    prompt: 'build an ai writing coach...',
    tags: ['writing', 'ai tool'],
    authorName: '@nrachelw',
    authorInitials: 'NR',
    authorGradient: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    authorTextColor: 'white',
    views: 7100,
    likes: 976,
    featured: false,
    previewClass: 'p6',
    openFunction: 'openWriter',
    openBtnText: 'View Project',
    type: 'showcase'
  },
  {
    showcaseId: 'habit',
    title: 'Habit Tracker with Streaks',
    prompt: 'make me a habit tracker...',
    tags: ['habits', 'svelte'],
    authorName: '@knewton',
    authorInitials: 'KN',
    authorGradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    authorTextColor: '#1A1612',
    views: 8900,
    likes: 1700,
    featured: false,
    previewClass: 'p7',
    openFunction: 'openHabit',
    openBtnText: 'View Project',
    type: 'showcase'
  },
  {
    showcaseId: 'solar',
    title: 'Interactive Solar System',
    prompt: 'build a solar system...',
    tags: ['3d', 'three.js', 'science'],
    authorName: '@rvega',
    authorInitials: 'RV',
    authorGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    authorTextColor: 'white',
    views: 22100,
    likes: 3300,
    featured: false,
    previewClass: 'p8',
    openFunction: 'openSolar',
    openBtnText: 'View Project',
    type: 'showcase'
  },
  {
    showcaseId: 'todo',
    title: 'Minimal Todo App',
    prompt: 'build a minimal todo...',
    tags: ['todo', 'minimal'],
    authorName: '@zhuang_h',
    authorInitials: 'ZH',
    authorGradient: 'var(--ink)',
    authorTextColor: 'var(--bg)',
    views: 3200,
    likes: 567,
    featured: false,
    previewClass: 'p9',
    openFunction: 'openTodo',
    openBtnText: 'View Project',
    type: 'showcase'
  }
];

// ── PREVIEW HTML TEMPLATES ───────────────────────
// Returns the inner HTML for each card's .card-prev content (excluding the overlay)
function getShowcasePreviewHTML(showcaseId) {
  const templates = {
    saas: `<div class="badge tl">\u26a1 99 vibe score</div>
<div class="badge tr">"build me a saas dashboard..."</div>
<div style="width:84%;display:flex;gap:12px">
  <div class="mcard" style="flex:1;padding:16px">
    <div style="font-size:9px;color:var(--ink-muted);font-family:'DM Mono',monospace;margin-bottom:7px;letter-spacing:1px">REVENUE</div>
    <div style="font-size:22px;font-weight:700;letter-spacing:-1px;font-family:'Fraunces',serif;color:var(--ink)">$48,291</div>
    <div style="font-size:10px;color:#16a34a;margin-top:3px;font-family:'DM Mono',monospace">\u2191 12.4%</div>
    <div style="display:flex;align-items:flex-end;gap:3px;height:50px;margin-top:12px">
      <div style="flex:1;height:40%;background:var(--accent);opacity:0.3;border-radius:2px 2px 0 0"></div>
      <div style="flex:1;height:65%;background:var(--accent);opacity:0.4;border-radius:2px 2px 0 0"></div>
      <div style="flex:1;height:45%;background:var(--accent);opacity:0.3;border-radius:2px 2px 0 0"></div>
      <div style="flex:1;height:80%;background:var(--accent);opacity:0.7;border-radius:2px 2px 0 0"></div>
      <div style="flex:1;height:60%;background:var(--accent);opacity:0.4;border-radius:2px 2px 0 0"></div>
      <div style="flex:1;height:100%;background:var(--accent);border-radius:2px 2px 0 0"></div>
      <div style="flex:1;height:75%;background:var(--accent);opacity:0.5;border-radius:2px 2px 0 0"></div>
    </div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;gap:8px">
    <div class="mcard" style="flex:1;padding:12px">
      <div style="font-size:9px;color:var(--ink-muted);font-family:'DM Mono',monospace;margin-bottom:5px;letter-spacing:1px">USERS</div>
      <div style="font-size:18px;font-weight:700;letter-spacing:-0.8px;font-family:'Fraunces',serif;color:var(--ink)">12,847</div>
      <div style="font-size:10px;color:#16a34a;font-family:'DM Mono',monospace">\u2191 8.1%</div>
    </div>
    <div class="mcard" style="flex:1;padding:12px">
      <div style="font-size:9px;color:var(--ink-muted);font-family:'DM Mono',monospace;margin-bottom:5px;letter-spacing:1px">CHURN</div>
      <div style="font-size:18px;font-weight:700;letter-spacing:-0.8px;font-family:'Fraunces',serif;color:var(--ink)">2.3%</div>
      <div style="font-size:10px;color:#dc2626;font-family:'DM Mono',monospace">\u2191 0.2%</div>
    </div>
  </div>
</div>`,

    budget: `<div class="badge tr">"personal finance..."</div>
<div class="mcard" style="width:82%;padding:18px">
  <div style="font-size:9px;color:var(--ink-muted);font-family:'DM Mono',monospace;margin-bottom:12px;letter-spacing:1px">MONTHLY BUDGET</div>
  <div style="display:flex;flex-direction:column;gap:9px">
    <div><div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;font-family:'DM Mono',monospace;color:var(--ink)"><span>Housing</span><span style="color:var(--ink-muted)">$1,800</span></div><div style="height:5px;background:var(--accent-glow);border-radius:3px;border:1px solid var(--border-em)"><div style="height:100%;width:72%;background:var(--accent);border-radius:3px;opacity:0.7"></div></div></div>
    <div><div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;font-family:'DM Mono',monospace;color:var(--ink)"><span>Food</span><span style="color:var(--ink-muted)">$620</span></div><div style="height:5px;background:rgba(22,163,74,0.1);border-radius:3px"><div style="height:100%;width:48%;background:#16a34a;border-radius:3px;opacity:0.7"></div></div></div>
    <div><div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;font-family:'DM Mono',monospace;color:var(--ink)"><span>Claude API</span><span style="color:#dc2626;font-size:10px">over budget \ud83d\udc80</span></div><div style="height:5px;background:rgba(220,38,38,0.1);border-radius:3px"><div style="height:100%;width:100%;background:#dc2626;border-radius:3px;opacity:0.7"></div></div></div>
  </div>
</div>`,

    snake: `<div class="badge tl">\ud83c\udfae game</div>
<div class="mcard" style="width:82%;overflow:hidden">
  <div style="padding:8px 14px;background:var(--surface2);border-bottom:1px solid var(--border);font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted)">terminal</div>
  <div style="padding:14px;font-family:'DM Mono',monospace;font-size:11px;line-height:1.8;color:var(--ink)">
    <div><span style="color:#16a34a">\u27a1</span> <span style="color:var(--accent)">claudicted</span> create game</div>
    <div style="color:var(--ink-muted)">Building snake game...</div>
    <div><span style="color:#16a34a">\u2713</span> snake.js created</div>
    <div style="color:var(--accent)">\ud83c\udfae Ready in 2m 14s</div>
  </div>
</div>`,

    recipe: `<div class="badge tr">"design a recipe app..."</div>
<div class="mcard" style="width:76%;overflow:hidden">
  <div style="padding:13px 15px;border-bottom:1px solid var(--border)">
    <div style="font-size:9px;color:var(--accent);font-family:'DM Mono',monospace;margin-bottom:4px;letter-spacing:1px">TODAY'S RECIPE</div>
    <div style="font-size:13px;font-weight:600;color:var(--ink);font-family:'Fraunces',serif">Miso Ramen Bowl</div>
    <div style="font-size:10px;color:var(--ink-muted);font-family:'DM Mono',monospace">45 min \u00b7 2 servings</div>
  </div>
  <div style="padding:10px 15px;display:flex;gap:4px;flex-wrap:wrap">
    <span style="padding:2px 7px;background:var(--tag-bg);border-radius:4px;font-size:9px;color:var(--tag-color);font-family:'DM Mono',monospace;border:1px solid var(--tag-border)">noodles</span>
    <span style="padding:2px 7px;background:var(--tag-bg);border-radius:4px;font-size:9px;color:var(--tag-color);font-family:'DM Mono',monospace;border:1px solid var(--tag-border)">miso</span>
    <span style="padding:2px 7px;background:var(--tag-bg);border-radius:4px;font-size:9px;color:var(--tag-color);font-family:'DM Mono',monospace;border:1px solid var(--tag-border)">egg</span>
  </div>
</div>`,

    portfolio: `<div class="badge tl">\ud83c\udf0a smooth</div>
<div class="mcard" style="width:78%;padding:22px;text-align:center">
  <div style="font-size:9px;color:var(--ink-muted);font-family:'DM Mono',monospace;letter-spacing:2px;margin-bottom:12px">PORTFOLIO \u00b7 V3</div>
  <div style="font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:var(--ink);letter-spacing:-1px;line-height:1">Daniel<br><em style="color:var(--accent);font-style:italic">Osei</em></div>
  <div style="font-size:10px;color:var(--ink-muted);margin-top:10px;font-family:'DM Mono',monospace">Designer \u00d7 Vibe Coder</div>
  <div style="display:flex;justify-content:center;gap:7px;margin-top:14px">
    <div style="width:7px;height:7px;border-radius:50%;background:var(--ink)"></div>
    <div style="width:7px;height:7px;border-radius:50%;background:var(--border)"></div>
    <div style="width:7px;height:7px;border-radius:50%;background:var(--border)"></div>
  </div>
</div>`,

    writer: `<div class="mcard" style="width:82%;padding:16px">
  <div style="font-size:9px;color:var(--ink-muted);font-family:'DM Mono',monospace;margin-bottom:10px;letter-spacing:1px">AI WRITING COACH</div>
  <div style="background:var(--accent-glow);border-radius:7px;padding:10px;border-left:2px solid var(--accent);margin-bottom:10px">
    <div style="font-size:11px;color:var(--ink);line-height:1.6;font-family:'DM Mono',monospace">The quick brown fox<span style="border-right:1.5px solid var(--accent);animation:blink 1s infinite">|</span></div>
  </div>
  <div style="display:flex;gap:6px">
    <div style="flex:1;background:rgba(22,163,74,0.08);border-radius:6px;padding:7px;text-align:center;border:1px solid rgba(22,163,74,0.15)"><div style="font-size:15px;font-weight:700;color:#16a34a;font-family:'Fraunces',serif">92</div><div style="font-size:8px;color:var(--ink-muted);font-family:'DM Mono',monospace">CLARITY</div></div>
    <div style="flex:1;background:rgba(37,99,235,0.08);border-radius:6px;padding:7px;text-align:center;border:1px solid rgba(37,99,235,0.15)"><div style="font-size:15px;font-weight:700;color:#2563eb;font-family:'Fraunces',serif">87</div><div style="font-size:8px;color:var(--ink-muted);font-family:'DM Mono',monospace">FLOW</div></div>
    <div style="flex:1;background:var(--accent-glow);border-radius:6px;padding:7px;text-align:center;border:1px solid var(--border-em)"><div style="font-size:15px;font-weight:700;color:var(--accent);font-family:'Fraunces',serif">94</div><div style="font-size:8px;color:var(--ink-muted);font-family:'DM Mono',monospace">VIBE</div></div>
  </div>
</div>`,

    habit: `<div class="badge tr">"make me a habit tracker..."</div>
<div class="mcard" style="width:80%;padding:16px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <div style="font-size:12px;font-weight:600;color:var(--ink);font-family:'Fraunces',serif">Nov 2024</div>
    <div style="font-size:10px;color:var(--accent);font-family:'DM Mono',monospace">14 streak \ud83d\udd25</div>
  </div>
  <div class="habit-grid-preview" id="habitGridPreview" style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px"></div>
</div>`,
    // NOTE: habitGridPreview must be populated after render via populateHabitGridPreview()

    solar: `<div class="badge tl">\ud83e\udd2f wild</div>
<div class="mcard" style="width:76%;padding:18px;text-align:center">
  <div style="font-size:9px;color:var(--ink-muted);font-family:'DM Mono',monospace;letter-spacing:2px;margin-bottom:14px">SOLAR SYSTEM</div>
  <div style="position:relative;width:100px;height:100px;margin:0 auto">
    <div style="position:absolute;inset:0;border-radius:50%;border:1px solid var(--border)"></div>
    <div style="position:absolute;inset:20px;border-radius:50%;border:1px solid var(--border)"></div>
    <div style="position:absolute;inset:38px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b)"></div>
    <div style="position:absolute;top:5px;left:50%;width:7px;height:7px;background:#3b82f6;border-radius:50%;transform:translateX(-50%)"></div>
    <div style="position:absolute;bottom:9px;right:13px;width:5px;height:5px;background:#ef4444;border-radius:50%"></div>
  </div>
  <div style="font-size:9px;color:var(--ink-muted);margin-top:12px;font-family:'DM Mono',monospace">interactive \u00b7 real scale</div>
</div>`,

    todo: `<div class="mcard" style="width:76%;padding:18px">
  <div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:12px;font-family:'Fraunces',serif;letter-spacing:-0.3px">Today</div>
  <div style="display:flex;flex-direction:column;gap:9px">
    <div style="display:flex;align-items:center;gap:9px"><div style="width:15px;height:15px;border-radius:50%;background:var(--ink);flex-shrink:0;display:flex;align-items:center;justify-content:center"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><span style="font-size:11px;color:var(--ink-muted);text-decoration:line-through;font-family:'DM Mono',monospace">ship vibe project</span></div>
    <div style="display:flex;align-items:center;gap:9px"><div style="width:15px;height:15px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0"></div><span style="font-size:11px;color:var(--ink);font-family:'DM Mono',monospace">touch grass</span></div>
    <div style="display:flex;align-items:center;gap:9px"><div style="width:15px;height:15px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0"></div><span style="font-size:11px;color:var(--ink);font-family:'DM Mono',monospace">one more prompt...</span></div>
  </div>
</div>`
  };

  return templates[showcaseId] || '';
}

// ── HABIT GRID PREVIEW POPULATION ────────────────
// Call this after rendering cards that contain the habit preview
function populateHabitGridPreview() {
  const grid = document.getElementById('habitGridPreview');
  if (!grid || grid.children.length > 0) return;
  const greens = ['var(--accent-glow)', 'var(--accent)', 'rgba(255,107,53,0.3)', 'rgba(255,107,53,0.6)', '#FF6B35'];
  for (let i = 0; i < 28; i++) {
    const cell = document.createElement('div');
    cell.style.cssText = 'aspect-ratio:1;border-radius:2px;background:' +
      (Math.random() > 0.3 ? greens[Math.floor(Math.random() * greens.length)] : 'var(--surface2)');
    grid.appendChild(cell);
  }
}
