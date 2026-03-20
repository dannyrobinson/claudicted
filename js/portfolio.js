/* ══════════════════════════════════════════════════
   PORTFOLIO APP
══════════════════════════════════════════════════ */

const pfProjects = [
  {
    title: 'Claudicted Gallery',
    desc: 'A curated showcase of vibe-coded projects. Built entirely through conversation with Claude.',
    tags: ['react', 'vibe coding', 'gallery'],
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #E8521A 50%, #8B5CF6 100%)',
  },
  {
    title: 'FinTrack Dashboard',
    desc: 'Real-time financial analytics with buttery smooth charts. Dark mode first, always.',
    tags: ['dashboard', 'charts', 'd3.js'],
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #10B981 100%)',
  },
  {
    title: 'MoodBoard AI',
    desc: 'Drag-and-drop mood board generator powered by AI color extraction and layout algorithms.',
    tags: ['ai', 'design tool', 'canvas'],
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
  },
  {
    title: 'Type.motion',
    desc: 'Kinetic typography playground. Animate any text with physics-based spring animations.',
    tags: ['motion', 'typography', 'gsap'],
    gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)',
  },
];

const pfSkills = [
  { name: 'UI / UX', pct: 94 },
  { name: 'React', pct: 88 },
  { name: 'Motion Design', pct: 91 },
  { name: 'Vibe Coding', pct: 97 },
  { name: 'Typography', pct: 85 },
];

let pfCurrentSection = 'work';

function openPortfolio() {
  pfCurrentSection = 'work';
  document.getElementById('portfolioModal').classList.add('open');
  renderPortfolioNav();
  showPortfolioSection('work');
  // Animate hero on open
  setTimeout(() => animatePortfolioSection(), 100);
}

function closePortfolio() {
  document.getElementById('portfolioModal').classList.remove('open');
}

function closePortfolioBg(e) {
  if (e.target === document.getElementById('portfolioModal')) closePortfolio();
}

function renderPortfolioNav() {
  const dots = document.querySelectorAll('.pf-nav-dot');
  dots.forEach(d => {
    d.classList.toggle('active', d.dataset.section === pfCurrentSection);
  });
}

function showPortfolioSection(section) {
  pfCurrentSection = section;
  renderPortfolioNav();

  document.querySelectorAll('.pf-section').forEach(s => {
    s.classList.remove('active');
  });

  const target = document.getElementById('pfSection-' + section);
  if (target) {
    target.classList.add('active');
    setTimeout(() => animatePortfolioSection(), 50);
  }
}

function animatePortfolioSection() {
  if (pfCurrentSection === 'work') {
    const cards = document.querySelectorAll('.pf-project');
    cards.forEach((c, i) => {
      setTimeout(() => c.classList.add('visible'), i * 100);
    });
  } else if (pfCurrentSection === 'about') {
    const bio = document.querySelector('.pf-about-bio');
    if (bio) setTimeout(() => bio.classList.add('visible'), 100);
    const rows = document.querySelectorAll('.pf-skill-row');
    rows.forEach((r, i) => {
      setTimeout(() => {
        r.classList.add('visible');
        const bar = r.querySelector('.pf-skill-bar');
        if (bar) bar.style.width = bar.dataset.pct + '%';
      }, 200 + i * 120);
    });
  }
}

function pfHandleContact(e) {
  e.preventDefault();
  showToast('Message sent! (just kidding, this is a demo) ✨');
}

/* ── POPOUT ──────────────────────────────────────── */
function popoutPortfolio() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'Portfolio', 'width=680,height=800,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  const projectsHtml = pfProjects.map((p, i) => `
    <div class="pf-project visible" style="transition-delay:${i*0.1}s">
      <div class="pf-project-img" style="background:${p.gradient}"></div>
      <div class="pf-project-body">
        <div class="pf-project-title">${p.title}</div>
        <div class="pf-project-desc">${p.desc}</div>
        <div class="pf-project-tags">${p.tags.map(t=>'<span class="pf-project-tag">'+t+'</span>').join('')}</div>
      </div>
    </div>`).join('');

  const skillsHtml = pfSkills.map(s => `
    <div class="pf-skill-row visible">
      <span class="pf-skill-name">${s.name}</span>
      <div class="pf-skill-bar-wrap"><div class="pf-skill-bar" style="width:${s.pct}%"></div></div>
      <span class="pf-skill-pct">${s.pct}%</span>
    </div>`).join('');

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Daniel Osei — Portfolio 🌊</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --trans: all 0.3s cubic-bezier(0.23,1,0.32,1); }
[data-theme="dark"] {
  --bg:#0f0f0f;--surface:#161616;--surface2:#1e1e1e;
  --border:rgba(255,255,255,0.08);--border-em:rgba(255,107,53,0.22);
  --ink:#FAF7F2;--ink-soft:#C8C0B8;--ink-muted:#666;
  --accent:#FF6B35;--accent-deep:#E8521A;--accent-glow:rgba(255,107,53,0.12);
  --input-bg:rgba(255,255,255,0.04);--input-border:rgba(255,255,255,0.1);
}
[data-theme="light"] {
  --bg:#FAF7F2;--surface:#FFFFFF;--surface2:#F5F0E8;
  --border:rgba(26,22,18,0.08);--border-em:rgba(212,82,26,0.18);
  --ink:#1A1612;--ink-soft:#3D3730;--ink-muted:#9B9086;
  --accent:#D4521A;--accent-deep:#B84416;--accent-glow:rgba(212,82,26,0.08);
  --input-bg:#FFFFFF;--input-border:rgba(26,22,18,0.1);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;padding:24px;}
.app{max-width:600px;margin:0 auto;}
.pf-hero{text-align:center;padding:40px 0 24px;}
.pf-hero-name{font-family:'Fraunces',serif;font-size:52px;font-weight:700;letter-spacing:-2px;color:var(--ink);line-height:1.05;}
.pf-hero-name em{font-style:italic;color:var(--accent);display:block;}
.pf-hero-role{font-family:'DM Mono',monospace;font-size:13px;color:var(--ink-muted);letter-spacing:2px;text-transform:uppercase;margin-top:16px;}
.pf-hero-line{width:48px;height:2px;background:var(--accent);margin:20px auto 0;}
.pf-nav{display:flex;justify-content:center;gap:6px;margin-bottom:24px;}
.pf-nav-dot{padding:6px 18px;border-radius:100px;font-family:'DM Mono',monospace;font-size:11px;font-weight:600;color:var(--ink-muted);background:transparent;border:1px solid var(--border);cursor:pointer;transition:var(--trans);}
.pf-nav-dot:hover{border-color:var(--accent);color:var(--ink);}
.pf-nav-dot.active{background:var(--accent);color:white;border-color:var(--accent);}
.pf-section{display:none;} .pf-section.active{display:block;}
.pf-work-grid{display:flex;flex-direction:column;gap:14px;}
.pf-project{border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;transition:var(--trans);}
.pf-project:hover{border-color:var(--border-em);transform:translateY(-4px) scale(1.01);box-shadow:0 16px 48px rgba(0,0,0,0.15);}
.pf-project-img{height:120px;position:relative;overflow:hidden;}
.pf-project-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,var(--surface) 0%,transparent 60%);}
.pf-project-body{padding:16px 18px;}
.pf-project-title{font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:var(--ink);letter-spacing:-0.3px;margin-bottom:6px;}
.pf-project-desc{font-size:12px;color:var(--ink-muted);line-height:1.6;margin-bottom:10px;}
.pf-project-tags{display:flex;flex-wrap:wrap;gap:6px;}
.pf-project-tag{padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;color:var(--accent);background:var(--accent-glow);border:1px solid var(--border-em);}
.pf-skills-label{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--ink-muted);margin-bottom:14px;}
.pf-about-bio{font-size:14px;line-height:1.8;color:var(--ink-soft);margin-bottom:24px;}
.pf-skills{display:flex;flex-direction:column;gap:10px;}
.pf-skill-row{display:flex;align-items:center;gap:12px;}
.pf-skill-name{font-family:'DM Mono',monospace;font-size:11px;color:var(--ink);width:100px;flex-shrink:0;}
.pf-skill-bar-wrap{flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden;}
.pf-skill-bar{height:100%;border-radius:3px;background:var(--accent);transition:width 0.8s cubic-bezier(0.23,1,0.32,1);}
.pf-skill-pct{font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted);width:32px;text-align:right;}
.pf-contact-intro{font-size:14px;color:var(--ink-soft);margin-bottom:20px;line-height:1.6;}
.pf-form{display:flex;flex-direction:column;gap:14px;}
.pf-field{display:flex;flex-direction:column;gap:6px;}
.pf-field label{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--ink-muted);}
.pf-input{background:var(--input-bg);border:1px solid var(--input-border);border-radius:10px;padding:12px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--ink);outline:none;}
.pf-input:focus{border-color:var(--accent);}
.pf-textarea{background:var(--input-bg);border:1px solid var(--input-border);border-radius:10px;padding:12px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--ink);outline:none;resize:vertical;min-height:80px;}
.pf-textarea:focus{border-color:var(--accent);}
.pf-submit{align-self:flex-start;padding:10px 24px;border-radius:100px;background:var(--accent);border:none;color:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:var(--trans);}
.pf-submit:hover{background:var(--accent-deep);transform:translateY(-1px);}
.theme-btn{width:32px;height:32px;border-radius:50%;background:rgba(128,128,128,0.1);border:none;cursor:pointer;color:var(--ink-muted);font-size:15px;display:flex;align-items:center;justify-content:center;transition:var(--trans);}
.theme-btn:hover{background:rgba(128,128,128,0.2);color:var(--ink);}
.pf-footer{text-align:center;font-family:'DM Mono',monospace;font-size:10px;color:var(--ink-muted);padding:20px 0;border-top:1px solid var(--border);margin-top:24px;}
</style>
</head>
<body>
<div class="app">
  <div style="display:flex;justify-content:flex-end;margin-bottom:8px;"><button class="theme-btn" onclick="toggleTheme()" title="Toggle theme">&#9680;</button></div>
  <div class="pf-hero">
    <div class="pf-hero-name">Daniel<em>Osei</em></div>
    <div class="pf-hero-role">Designer &times; Vibe Coder</div>
    <div class="pf-hero-line"></div>
  </div>
  <div class="pf-nav">
    <button class="pf-nav-dot active" onclick="showSec('work',this)">Work</button>
    <button class="pf-nav-dot" onclick="showSec('about',this)">About</button>
    <button class="pf-nav-dot" onclick="showSec('contact',this)">Contact</button>
  </div>
  <div id="sec-work" class="pf-section active"><div class="pf-work-grid">${projectsHtml}</div></div>
  <div id="sec-about" class="pf-section">
    <div class="pf-about-bio">I'm Daniel — a designer who fell in love with vibe coding. I describe what I want, Claude builds it, and together we make things that feel alive. Currently obsessed with motion, typography, and shipping fast.</div>
    <div class="pf-skills-label">Skills</div>
    <div class="pf-skills">${skillsHtml}</div>
  </div>
  <div id="sec-contact" class="pf-section">
    <div class="pf-contact-intro">Want to collab or just say hi? Drop a message below.</div>
    <form class="pf-form" onsubmit="event.preventDefault();alert('Demo only!');">
      <div class="pf-field"><label>Name</label><input class="pf-input" placeholder="Your name"></div>
      <div class="pf-field"><label>Email</label><input class="pf-input" type="email" placeholder="you@example.com"></div>
      <div class="pf-field"><label>Message</label><textarea class="pf-textarea" placeholder="What's on your mind?"></textarea></div>
      <button class="pf-submit" type="submit">Send Message</button>
    </form>
  </div>
  <div class="pf-footer">Built with vibes &amp; Claude &middot; 2024</div>
</div>
<script>
function toggleTheme(){const h=document.documentElement;h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark');}
function showSec(id,btn){document.querySelectorAll('.pf-section').forEach(s=>s.classList.remove('active'));document.getElementById('sec-'+id).classList.add('active');document.querySelectorAll('.pf-nav-dot').forEach(d=>d.classList.remove('active'));btn.classList.add('active');}
<\/script>
</body></html>`);
  win.document.close();
  closePortfolio();
  showToast('Popped out! 🚀');
}

/* ── ESC KEY ─────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('portfolioModal').classList.contains('open')) {
    closePortfolio();
  }
});
