/* ══════════════════════════════════════════════════
   WRITING COACH WITH VIBE SCORE
══════════════════════════════════════════════════ */

const WRITER_SAMPLE = `Vibe coding is the art of describing what you want and letting AI build it. You don't wrestle with syntax. You don't debug for hours. You just vibe.

Think of it like being a creative director for your own software. You describe the mood, the feel, the energy — and Claude translates that into real, working code. It's not lazy. It's leverage.

The best vibe coders know what they want. They have taste. They iterate fast and ship faster. Every prompt is a design decision. Every conversation is a collaboration.

This is the future of building things on the internet. Not less craft — different craft. More human, more expressive, more fun.

Ship it! Let's go! The vibes are immaculate today.`;

const POWER_WORDS = ['incredible','amazing','powerful','beautiful','stunning','brilliant','extraordinary','remarkable','innovative','revolutionary','immaculate','legendary','epic','fantastic','magnificent','perfect','superb','outstanding','exceptional','excellent'];
const TRANSITION_WORDS = ['however','therefore','moreover','furthermore','additionally','consequently','nevertheless','meanwhile','similarly','likewise','instead','otherwise','thus','hence','accordingly','besides','indeed','notably','specifically','ultimately'];
const PASSIVE_PATTERNS = [/\b(is|are|was|were|been|being)\s+\w+ed\b/gi, /\b(is|are|was|were|been|being)\s+\w+en\b/gi];
const COMPLEX_WORDS_RE = /\b\w{12,}\b/g;

let writerDebounce = null;

function openWriter() {
  document.getElementById('writerModal').classList.add('open');
  const textarea = document.getElementById('wcTextarea');
  if (!textarea.value) {
    textarea.value = WRITER_SAMPLE;
  }
  setTimeout(() => analyzeWriting(), 100);
}

function closeWriter() {
  document.getElementById('writerModal').classList.remove('open');
}

function closeWriterBg(e) {
  if (e.target === document.getElementById('writerModal')) closeWriter();
}

function onWriterInput() {
  clearTimeout(writerDebounce);
  writerDebounce = setTimeout(analyzeWriting, 150);
}

/* ── ANALYSIS ENGINE ─────────────────────────────── */
function analyzeWriting() {
  const text = document.getElementById('wcTextarea').value;

  if (!text.trim()) {
    renderEmptyState();
    return;
  }

  const words = text.match(/\b\w+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chars = text.length;
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 230));

  // Average words per sentence
  const avgSentenceLen = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  // Syllable approximation for grade level
  const avgWordLen = words.length > 0 ? words.reduce((s, w) => s + w.length, 0) / words.length : 0;

  // Grade level (Coleman-Liau approximation)
  const gradeLevel = Math.max(1, Math.min(16, Math.round(0.0588 * (chars / wordCount * 100) - 0.296 * (sentenceCount / wordCount * 100) - 15.8))) || 5;

  // Clarity Score
  const passiveCount = PASSIVE_PATTERNS.reduce((count, re) => count + (text.match(re) || []).length, 0);
  const complexCount = (text.match(COMPLEX_WORDS_RE) || []).length;
  const passivePenalty = Math.min(30, passiveCount * 8);
  const complexPenalty = Math.min(25, complexCount * 3);
  const lengthPenalty = avgSentenceLen > 25 ? Math.min(20, (avgSentenceLen - 25) * 2) : 0;
  const clarityScore = Math.max(10, Math.min(100, Math.round(100 - passivePenalty - complexPenalty - lengthPenalty)));

  // Flow Score
  const transitionCount = words.filter(w => TRANSITION_WORDS.includes(w.toLowerCase())).length;
  const transitionBonus = Math.min(25, transitionCount * 5);
  const sentenceLengths = sentences.map(s => (s.match(/\b\w+\b/g) || []).length);
  const lengthVariance = sentenceLengths.length > 1 ?
    sentenceLengths.reduce((s, l) => s + Math.pow(l - avgSentenceLen, 2), 0) / sentenceLengths.length : 0;
  const varietyBonus = Math.min(20, Math.sqrt(lengthVariance) * 2);
  const paragraphBonus = Math.min(15, paragraphs.length * 3);
  const flowScore = Math.max(10, Math.min(100, Math.round(50 + transitionBonus + varietyBonus + paragraphBonus)));

  // Vibe Score
  const exclamationCount = (text.match(/!/g) || []).length;
  const emojiCount = (text.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || []).length;
  const powerWordCount = words.filter(w => POWER_WORDS.includes(w.toLowerCase())).length;
  const energyBonus = Math.min(20, exclamationCount * 4 + emojiCount * 5 + powerWordCount * 6);
  const vibeBase = Math.round((clarityScore + flowScore) / 2);
  const vibeScore = Math.max(10, Math.min(100, vibeBase + Math.round(energyBonus * 0.5)));

  // Tone detection
  const tone = detectTone(text, words, avgSentenceLen, exclamationCount, emojiCount, powerWordCount);

  // Generate suggestions
  const suggestions = generateSuggestions(clarityScore, flowScore, vibeScore, avgSentenceLen, passiveCount, transitionCount, exclamationCount, powerWordCount, sentenceCount, paragraphs.length);

  // Render
  renderStats(wordCount, sentenceCount, readingTime, gradeLevel);
  renderTone(tone);
  renderScores(clarityScore, flowScore, vibeScore);
  renderSuggestions(suggestions);
}

function detectTone(text, words, avgLen, exclams, emojis, powerWords) {
  const lower = text.toLowerCase();
  const questionCount = (text.match(/\?/g) || []).length;

  // Chaotic check
  if (exclams > 5 || emojis > 3 || (exclams > 3 && powerWords > 2)) {
    return { name: 'Chaotic', emoji: '🌀', desc: 'Unhinged energy (we love it)' };
  }
  // Academic
  if (avgLen > 20 && powerWords === 0 && exclams === 0) {
    return { name: 'Academic', emoji: '🎓', desc: 'Scholarly and measured' };
  }
  // Creative
  if (powerWords > 1 || (emojis > 0 && exclams > 0)) {
    return { name: 'Creative', emoji: '🎨', desc: 'Expressive and vivid' };
  }
  // Casual
  if (avgLen < 12 || exclams > 1 || lower.includes('lol') || lower.includes('tbh') || lower.includes('ngl')) {
    return { name: 'Casual', emoji: '😎', desc: 'Relaxed and friendly' };
  }
  // Default: Professional
  return { name: 'Professional', emoji: '💼', desc: 'Clear and polished' };
}

function generateSuggestions(clarity, flow, vibe, avgLen, passive, transitions, exclams, powerWords, sentences, paragraphs) {
  const tips = [];

  if (avgLen > 22) tips.push({ icon: '✂️', text: `Your average sentence is ${Math.round(avgLen)} words. Try breaking some into shorter ones for punchier prose.` });
  if (passive > 2) tips.push({ icon: '🎯', text: `Found ${passive} passive voice instances. Try rewriting with active voice for more directness.` });
  if (transitions === 0 && sentences > 3) tips.push({ icon: '🔗', text: 'No transition words detected. Add "however", "therefore", or "meanwhile" to improve flow.' });
  if (powerWords === 0) tips.push({ icon: '⚡', text: 'Try adding some power words (amazing, brilliant, innovative) to boost your vibe energy.' });
  if (paragraphs <= 1 && sentences > 5) tips.push({ icon: '📐', text: 'One big block of text! Break it into paragraphs for better readability.' });
  if (exclams === 0 && vibe < 70) tips.push({ icon: '🔥', text: 'Your writing is calm. Add some exclamation marks or emoji for extra energy!' });
  if (clarity >= 85 && flow >= 80) tips.push({ icon: '✨', text: 'Your writing is crisp and flows well. The vibes are immaculate.' });
  if (vibe >= 90) tips.push({ icon: '🚀', text: 'Vibe Score is through the roof! This writing has serious energy.' });
  if (avgLen < 8 && sentences > 3) tips.push({ icon: '📝', text: 'Sentences are quite short. Try mixing in a longer one for rhythm variety.' });

  if (tips.length === 0) tips.push({ icon: '👍', text: 'Looking solid! Keep writing to see more targeted suggestions.' });

  return tips.slice(0, 4);
}

/* ── RENDERERS ───────────────────────────────────── */
function renderStats(words, sentences, readTime, grade) {
  document.getElementById('wcWords').innerHTML = `<strong>${words}</strong> words`;
  document.getElementById('wcSentences').innerHTML = `<strong>${sentences}</strong> sentences`;
  document.getElementById('wcReadTime').innerHTML = `<strong>${readTime}</strong> min read`;
  document.getElementById('wcGrade').innerHTML = `Grade <strong>${grade}</strong>`;
}

function renderTone(tone) {
  document.getElementById('wcToneValue').textContent = `${tone.emoji} ${tone.name} — ${tone.desc}`;
}

function renderScores(clarity, flow, vibe) {
  updateScoreRing('wcClarity', clarity);
  updateScoreRing('wcFlow', flow);
  updateScoreRing('wcVibe', vibe);
}

function updateScoreRing(id, score) {
  const card = document.getElementById(id);
  const num = card.querySelector('.wc-score-num');
  const ring = card.querySelector('.wc-score-ring-fill');
  const r = 25;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  num.textContent = score;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = offset;

  // Color classes
  card.classList.remove('score-low', 'score-mid');
  if (score < 50) card.classList.add('score-low');
  else if (score < 70) card.classList.add('score-mid');
}

function renderSuggestions(tips) {
  const wrap = document.getElementById('wcSuggestions');
  wrap.innerHTML = tips.map((t, i) => `
    <div class="wc-suggestion" style="animation-delay:${i * 0.08}s">
      <span class="wc-suggestion-icon">${t.icon}</span>
      <span>${t.text}</span>
    </div>
  `).join('');
}

function renderEmptyState() {
  document.getElementById('wcWords').innerHTML = '<strong>0</strong> words';
  document.getElementById('wcSentences').innerHTML = '<strong>0</strong> sentences';
  document.getElementById('wcReadTime').innerHTML = '<strong>0</strong> min read';
  document.getElementById('wcGrade').innerHTML = 'Grade <strong>-</strong>';
  document.getElementById('wcToneValue').textContent = '— Start writing to detect tone';
  updateScoreRing('wcClarity', 0);
  updateScoreRing('wcFlow', 0);
  updateScoreRing('wcVibe', 0);
  document.getElementById('wcSuggestions').innerHTML = '<div class="wc-empty-hint">Start typing to see real-time writing analysis...</div>';
}

/* ── POPOUT ──────────────────────────────────────── */
function popoutWriter() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const text = document.getElementById('wcTextarea').value;
  const win = window.open('', 'WriteFlow', 'width=700,height=820,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  const textEscaped = text.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$/g,'\\$');

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>WriteFlow ✍️</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--trans:all 0.3s cubic-bezier(0.23,1,0.32,1);}
[data-theme="dark"]{--bg:#0f0f0f;--surface:#161616;--surface2:#1e1e1e;--border:rgba(255,255,255,0.08);--border-em:rgba(255,107,53,0.22);--ink:#FAF7F2;--ink-soft:#C8C0B8;--ink-muted:#666;--accent:#FF6B35;--accent-deep:#E8521A;--accent-glow:rgba(255,107,53,0.12);--input-bg:rgba(255,255,255,0.04);--input-border:rgba(255,255,255,0.1);}
[data-theme="light"]{--bg:#FAF7F2;--surface:#FFFFFF;--surface2:#F5F0E8;--border:rgba(26,22,18,0.08);--border-em:rgba(212,82,26,0.18);--ink:#1A1612;--ink-soft:#3D3730;--ink-muted:#9B9086;--accent:#D4521A;--accent-deep:#B84416;--accent-glow:rgba(212,82,26,0.08);--input-bg:#FFFFFF;--input-border:rgba(26,22,18,0.1);}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;padding:24px;}
.app{max-width:620px;margin:0 auto;}
.wc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.wc-header-left{display:flex;align-items:center;gap:12px;}
.wc-logo{font-size:28px;}
.wc-title{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink);letter-spacing:-0.5px;}
.wc-sub{font-family:'DM Mono',monospace;font-size:11px;color:var(--ink-muted);margin-top:2px;}
.theme-btn{width:32px;height:32px;border-radius:50%;background:rgba(128,128,128,0.1);border:none;cursor:pointer;color:var(--ink-muted);font-size:15px;display:flex;align-items:center;justify-content:center;transition:var(--trans);}
.theme-btn:hover{background:rgba(128,128,128,0.2);color:var(--ink);}
.wc-textarea{width:100%;min-height:160px;max-height:260px;background:var(--input-bg);border:1px solid var(--input-border);border-radius:14px;padding:16px 18px;font-family:'DM Mono',monospace;font-size:13px;line-height:1.8;color:var(--ink);resize:vertical;outline:none;transition:border-color 0.2s;margin-bottom:16px;}
.wc-textarea:focus{border-color:var(--accent);}
.wc-stats-bar{display:flex;flex-wrap:wrap;gap:12px;padding:10px 16px;background:var(--accent-glow);border:1px solid var(--border-em);border-radius:12px;margin-bottom:16px;}
.wc-stat{font-family:'DM Mono',monospace;font-size:11px;color:var(--ink-muted);}
.wc-stat strong{color:var(--ink);font-weight:600;}
.wc-tone{display:flex;align-items:center;gap:10px;padding:10px 16px;background:rgba(128,128,128,0.04);border:1px solid var(--border);border-radius:12px;margin-bottom:16px;}
.wc-tone-label{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--ink-muted);}
.wc-tone-value{font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;color:var(--ink);}
.wc-scores{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
.wc-score-card{padding:16px 14px;border-radius:14px;text-align:center;border:1px solid var(--border);transition:var(--trans);}
.wc-score-ring-wrap{position:relative;width:64px;height:64px;margin:0 auto 10px;}
.wc-score-ring{width:100%;height:100%;transform:rotate(-90deg);}
.wc-score-ring-bg{fill:none;stroke:var(--border);stroke-width:5;}
.wc-score-ring-fill{fill:none;stroke-width:5;stroke-linecap:round;transition:stroke-dashoffset 0.8s cubic-bezier(0.23,1,0.32,1),stroke 0.3s;}
.wc-score-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:18px;font-weight:700;letter-spacing:-0.5px;}
.wc-score-label{font-family:'DM Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--ink-muted);}
.wc-score-card.clarity{border-color:rgba(22,163,74,0.15);} .wc-score-card.clarity .wc-score-ring-fill{stroke:#16a34a;} .wc-score-card.clarity .wc-score-num{color:#16a34a;}
.wc-score-card.flow{border-color:rgba(37,99,235,0.15);} .wc-score-card.flow .wc-score-ring-fill{stroke:#2563eb;} .wc-score-card.flow .wc-score-num{color:#2563eb;}
.wc-score-card.vibe{border-color:var(--border-em);} .wc-score-card.vibe .wc-score-ring-fill{stroke:var(--accent);} .wc-score-card.vibe .wc-score-num{color:var(--accent);}
.wc-score-card.score-low .wc-score-ring-fill{stroke:#dc2626!important;} .wc-score-card.score-low .wc-score-num{color:#dc2626!important;}
.wc-score-card.score-mid .wc-score-ring-fill{stroke:#f59e0b!important;} .wc-score-card.score-mid .wc-score-num{color:#f59e0b!important;}
.wc-suggestions-label{font-family:'DM Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--ink-muted);margin-bottom:10px;}
.wc-suggestions{display:flex;flex-direction:column;gap:6px;}
.wc-suggestion{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:rgba(128,128,128,0.04);border:1px solid var(--border);border-radius:10px;font-size:12px;color:var(--ink-soft);line-height:1.5;}
.wc-suggestion-icon{font-size:14px;flex-shrink:0;margin-top:1px;}
</style>
</head>
<body>
<div class="app">
  <div class="wc-header">
    <div class="wc-header-left">
      <span class="wc-logo">&#x270D;&#xFE0F;</span>
      <div><div class="wc-title">WriteFlow</div><div class="wc-sub">AI writing coach with Vibe Score&trade;</div></div>
    </div>
    <button class="theme-btn" onclick="toggleTheme()">&#9680;</button>
  </div>
  <textarea class="wc-textarea" id="wcTextarea" oninput="onInput()" placeholder="Start writing...">\`+textEscaped+\`</textarea>
  <div class="wc-stats-bar">
    <span class="wc-stat" id="wcWords"><strong>0</strong> words</span>
    <span class="wc-stat" id="wcSentences"><strong>0</strong> sentences</span>
    <span class="wc-stat" id="wcReadTime"><strong>0</strong> min read</span>
    <span class="wc-stat" id="wcGrade">Grade <strong>-</strong></span>
  </div>
  <div class="wc-tone"><span class="wc-tone-label">Tone</span><span class="wc-tone-value" id="wcToneValue">--</span></div>
  <div class="wc-scores">
    <div class="wc-score-card clarity" id="wcClarity"><div class="wc-score-ring-wrap"><svg class="wc-score-ring" viewBox="0 0 60 60"><circle class="wc-score-ring-bg" cx="30" cy="30" r="25"/><circle class="wc-score-ring-fill" cx="30" cy="30" r="25" stroke-dasharray="157" stroke-dashoffset="157"/></svg><div class="wc-score-num">0</div></div><div class="wc-score-label">Clarity</div></div>
    <div class="wc-score-card flow" id="wcFlow"><div class="wc-score-ring-wrap"><svg class="wc-score-ring" viewBox="0 0 60 60"><circle class="wc-score-ring-bg" cx="30" cy="30" r="25"/><circle class="wc-score-ring-fill" cx="30" cy="30" r="25" stroke-dasharray="157" stroke-dashoffset="157"/></svg><div class="wc-score-num">0</div></div><div class="wc-score-label">Flow</div></div>
    <div class="wc-score-card vibe" id="wcVibe"><div class="wc-score-ring-wrap"><svg class="wc-score-ring" viewBox="0 0 60 60"><circle class="wc-score-ring-bg" cx="30" cy="30" r="25"/><circle class="wc-score-ring-fill" cx="30" cy="30" r="25" stroke-dasharray="157" stroke-dashoffset="157"/></svg><div class="wc-score-num">0</div></div><div class="wc-score-label">Vibe&trade;</div></div>
  </div>
  <div class="wc-suggestions-label">Suggestions</div>
  <div class="wc-suggestions" id="wcSuggestions"></div>
</div>
<script>
function toggleTheme(){const h=document.documentElement;h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark');}
const POWER_WORDS=${JSON.stringify(POWER_WORDS)};
const TRANSITION_WORDS=${JSON.stringify(TRANSITION_WORDS)};
const PASSIVE_PATTERNS=[/\\b(is|are|was|were|been|being)\\s+\\w+ed\\b/gi,/\\b(is|are|was|were|been|being)\\s+\\w+en\\b/gi];
const COMPLEX_WORDS_RE=/\\b\\w{12,}\\b/g;
let db=null;
function onInput(){clearTimeout(db);db=setTimeout(analyze,150);}
function analyze(){
  const text=document.getElementById('wcTextarea').value;
  if(!text.trim()){renderEmpty();return;}
  const words=text.match(/\\b\\w+\\b/g)||[];const sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
  const paragraphs=text.split(/\\n\\s*\\n/).filter(p=>p.trim().length>0);
  const chars=text.length,wc=words.length,sc=sentences.length,rt=Math.max(1,Math.ceil(wc/230));
  const avgSL=sc>0?wc/sc:0,grade=Math.max(1,Math.min(16,Math.round(0.0588*(chars/wc*100)-0.296*(sc/wc*100)-15.8)))||5;
  const passive=PASSIVE_PATTERNS.reduce((c,re)=>c+(text.match(re)||[]).length,0);
  const complex=(text.match(COMPLEX_WORDS_RE)||[]).length;
  const clarity=Math.max(10,Math.min(100,Math.round(100-Math.min(30,passive*8)-Math.min(25,complex*3)-(avgSL>25?Math.min(20,(avgSL-25)*2):0))));
  const tc=words.filter(w=>TRANSITION_WORDS.includes(w.toLowerCase())).length;
  const sls=sentences.map(s=>(s.match(/\\b\\w+\\b/g)||[]).length);
  const variance=sls.length>1?sls.reduce((s,l)=>s+Math.pow(l-avgSL,2),0)/sls.length:0;
  const flow=Math.max(10,Math.min(100,Math.round(50+Math.min(25,tc*5)+Math.min(20,Math.sqrt(variance)*2)+Math.min(15,paragraphs.length*3))));
  const exclams=(text.match(/!/g)||[]).length,emojis=(text.match(/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]/gu)||[]).length;
  const pwc=words.filter(w=>POWER_WORDS.includes(w.toLowerCase())).length;
  const energy=Math.min(20,exclams*4+emojis*5+pwc*6);
  const vibe=Math.max(10,Math.min(100,Math.round((clarity+flow)/2)+Math.round(energy*0.5)));
  let tone;
  if(exclams>5||emojis>3||(exclams>3&&pwc>2))tone={n:'Chaotic',e:'\\u{1F300}',d:'Unhinged energy'};
  else if(avgSL>20&&pwc===0&&exclams===0)tone={n:'Academic',e:'\\u{1F393}',d:'Scholarly and measured'};
  else if(pwc>1||(emojis>0&&exclams>0))tone={n:'Creative',e:'\\u{1F3A8}',d:'Expressive and vivid'};
  else if(avgSL<12||exclams>1)tone={n:'Casual',e:'\\u{1F60E}',d:'Relaxed and friendly'};
  else tone={n:'Professional',e:'\\u{1F4BC}',d:'Clear and polished'};
  document.getElementById('wcWords').innerHTML='<strong>'+wc+'</strong> words';
  document.getElementById('wcSentences').innerHTML='<strong>'+sc+'</strong> sentences';
  document.getElementById('wcReadTime').innerHTML='<strong>'+rt+'</strong> min read';
  document.getElementById('wcGrade').innerHTML='Grade <strong>'+grade+'</strong>';
  document.getElementById('wcToneValue').textContent=tone.e+' '+tone.n+' \\u2014 '+tone.d;
  upRing('wcClarity',clarity);upRing('wcFlow',flow);upRing('wcVibe',vibe);
  const tips=[];
  if(avgSL>22)tips.push({i:'\\u2702\\uFE0F',t:'Avg sentence: '+Math.round(avgSL)+' words. Try shorter ones.'});
  if(passive>2)tips.push({i:'\\u{1F3AF}',t:passive+' passive voice instances. Use active voice.'});
  if(tc===0&&sc>3)tips.push({i:'\\u{1F517}',t:'Add transition words for better flow.'});
  if(pwc===0)tips.push({i:'\\u26A1',t:'Add power words to boost vibe energy.'});
  if(clarity>=85&&flow>=80)tips.push({i:'\\u2728',t:'Crisp writing. Vibes are immaculate.'});
  if(vibe>=90)tips.push({i:'\\u{1F680}',t:'Vibe Score through the roof!'});
  if(!tips.length)tips.push({i:'\\u{1F44D}',t:'Looking solid! Keep writing.'});
  document.getElementById('wcSuggestions').innerHTML=tips.slice(0,4).map(t=>'<div class="wc-suggestion"><span class="wc-suggestion-icon">'+t.i+'</span><span>'+t.t+'</span></div>').join('');
}
function upRing(id,score){const card=document.getElementById(id),num=card.querySelector('.wc-score-num'),ring=card.querySelector('.wc-score-ring-fill'),circ=2*Math.PI*25,off=circ-(score/100)*circ;num.textContent=score;ring.style.strokeDasharray=circ;ring.style.strokeDashoffset=off;card.classList.remove('score-low','score-mid');if(score<50)card.classList.add('score-low');else if(score<70)card.classList.add('score-mid');}
function renderEmpty(){document.getElementById('wcWords').innerHTML='<strong>0</strong> words';document.getElementById('wcSentences').innerHTML='<strong>0</strong> sentences';document.getElementById('wcReadTime').innerHTML='<strong>0</strong> min read';document.getElementById('wcGrade').innerHTML='Grade <strong>-</strong>';document.getElementById('wcToneValue').textContent='-- Start writing to detect tone';upRing('wcClarity',0);upRing('wcFlow',0);upRing('wcVibe',0);document.getElementById('wcSuggestions').innerHTML='<div style="font-family:DM Mono,monospace;font-size:12px;color:var(--ink-muted);text-align:center;padding:16px">Start typing to see analysis...</div>';}
setTimeout(analyze,200);
<\/script>
</body></html>`);
  win.document.close();
  closeWriter();
  showToast('Popped out! 🚀');
}

/* ── ESC KEY ─────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('writerModal').classList.contains('open')) {
    closeWriter();
  }
});
