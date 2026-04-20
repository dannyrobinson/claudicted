// app.js
// Entry point. Owns state, routing, and the flow from intent → proposal → confirm.

import { askClaude } from './claude.js';
import { INTENT_PARSER_SYSTEM, TRIP_GENERATOR_SYSTEM, MIDFLIGHT_REPLAN_SYSTEM } from './prompts.js';
import { findScriptedByRaw, getScriptedById, SCRIPTED_INTENTS, MIDFLIGHT_SCRIPT } from './scripted.js';
import { attachMic } from './voice.js';
import { renderChip, renderTrip, renderTimelineDay, renderThinkingStep, renderMidStep, renderMidSummary } from './templates.js';

// ============================================================
// State
// ============================================================
const state = {
  screen: 'home',
  rawIntent: null,
  scriptedId: null,
  proposal: null,
  confirmId: null,
  startTime: null,
};

// ============================================================
// Clock — update all status bar times to real current time
// ============================================================
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const mm = m < 10 ? '0' + m : m;
  const timeStr = `${hh}:${mm}`;
  document.querySelectorAll('[id^="clock"]').forEach(el => el.textContent = timeStr);
}
updateClock();
setInterval(updateClock, 30000);

// ============================================================
// Screen routing
// ============================================================
function showScreen(name) {
  state.screen = name;
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.toggle('active', s.dataset.screen === name);
  });
  window.scrollTo(0, 0);
}

// ============================================================
// Toast
// ============================================================
function toast(msg, ms = 2000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, ms);
}

// ============================================================
// HOME — input and mic
// ============================================================
const intentInput = document.getElementById('intent-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');

intentInput.addEventListener('input', () => {
  sendBtn.disabled = !intentInput.value.trim();
});
sendBtn.disabled = true;

sendBtn.addEventListener('click', () => {
  const text = intentInput.value.trim();
  if (text) handleIntent(text);
});
intentInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && intentInput.value.trim()) {
    handleIntent(intentInput.value.trim());
  }
});

// Suggestion chips
document.querySelectorAll('.suggestion-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const scriptedId = btn.dataset.intent;
    const scripted = getScriptedById(scriptedId);
    if (scripted) handleIntent(scripted.rawIntent, scriptedId);
  });
});

// Home mic — picks the first scripted intent as the "transcribed" text
attachMic(
  micBtn,
  () => SCRIPTED_INTENTS['nyc-board'].rawIntent,
  (text) => {
    intentInput.value = text;
    sendBtn.disabled = false;
    // Small beat to let the user see the "transcription" land
    setTimeout(() => handleIntent(text, 'nyc-board'), 400);
  }
);

// ============================================================
// Intent → proposal flow
// ============================================================
async function handleIntent(rawText, forcedScriptedId = null) {
  state.rawIntent = rawText;
  state.startTime = Date.now();

  // Show thinking screen immediately
  document.getElementById('thinking-quote').innerHTML = decorateQuote(rawText);
  const ledgerEl = document.getElementById('thinking-ledger');
  ledgerEl.innerHTML = '';
  showScreen('thinking');

  // Start elapsed counter
  const elapsedEl = document.getElementById('thinking-elapsed-val');
  const elapsedTimer = setInterval(() => {
    const s = ((Date.now() - state.startTime) / 1000).toFixed(1);
    elapsedEl.textContent = s;
  }, 100);

  // Step 1: decide path (scripted vs generate)
  const cheapMatch = forcedScriptedId
    ? getScriptedById(forcedScriptedId)
    : findScriptedByRaw(rawText);

  // Build the "thinking" ledger. For scripted paths, we use the scripted reasoning preview.
  // For generative, we use a generic set of steps.
  const steps = buildThinkingSteps(cheapMatch, rawText);
  renderThinkingLedger(steps);

  // Parallel: kick off the Claude call (if needed) AND run the minimum 2s animation
  const MIN_DURATION_MS = 2400;
  const animPromise = animateThinkingLedger(steps);

  let proposal;
  if (cheapMatch) {
    // Scripted path — we know the answer. Optionally still call Claude for the parse
    // (to validate intent), but don't block on it.
    proposal = buildProposalFromScripted(cheapMatch);
  } else {
    // Generative path — call Claude to make up a trip
    const genPromise = askClaude({
      system: TRIP_GENERATOR_SYSTEM,
      user: rawText,
      maxTokens: 1800,
      timeoutMs: 8000,
    });
    const [, gen] = await Promise.all([animPromise, genPromise]);
    if (gen && gen.trips && gen.trips.length) {
      proposal = normalizeGeneratedProposal(gen, rawText);
    } else {
      // Fallback: use nyc-board as safety net
      console.warn('[luna] Generation failed, falling back to nyc-board');
      proposal = buildProposalFromScripted(SCRIPTED_INTENTS['nyc-board']);
    }
  }

  // Ensure minimum duration so the ledger feels crafted, not raced
  const elapsed = Date.now() - state.startTime;
  if (elapsed < MIN_DURATION_MS) {
    await sleep(MIN_DURATION_MS - elapsed);
  }

  clearInterval(elapsedTimer);
  state.proposal = proposal;
  state.scriptedId = cheapMatch?.id || null;
  showProposal(proposal);
}

function buildThinkingSteps(scripted, rawText) {
  const base = [
    { text: "Parsing your intent…", status: 'active' },
    { text: "Reading your <strong>calendar</strong> for context", status: 'pending' },
    { text: "Checking <strong>who else</strong> is going", status: 'pending' },
    { text: "Searching flights across <strong>4 carriers</strong>", status: 'pending' },
    { text: "Matching <strong>hotels</strong> within walking distance", status: 'pending' },
    { text: "Checking <strong>policy</strong> against the route", status: 'pending' },
    { text: "Assembling your proposal", status: 'pending' },
  ];
  return base;
}

function renderThinkingLedger(steps) {
  const ledgerEl = document.getElementById('thinking-ledger');
  ledgerEl.innerHTML = steps.map(renderThinkingStep).join('');
}

async function animateThinkingLedger(steps) {
  const ledgerEl = document.getElementById('thinking-ledger');
  const els = Array.from(ledgerEl.querySelectorAll('.thinking-step'));
  const stepDelay = 300;
  // Stagger each step: transition pending→active→done
  for (let i = 0; i < els.length; i++) {
    await sleep(stepDelay);
    els[i].classList.remove('active');
    els[i].classList.add('done');
    if (els[i + 1]) els[i + 1].classList.add('active');
  }
  await sleep(200);
}

function buildProposalFromScripted(scripted) {
  return {
    intent: scripted.parsedIntent,
    ...scripted.proposal,
  };
}

function normalizeGeneratedProposal(gen, rawIntent) {
  return {
    intent: {
      headline: gen.intent_headline || `<em>${escapeHtml(rawIntent)}</em>`,
      source: gen.intent_source || '📅 Inferred from your intent',
    },
    chips: gen.chips || [],
    trips: gen.trips || [],
    why: gen.why || '',
    total: gen.total || '$—',
    cap: gen.cap || 'within cap',
    confirmId: gen.confirmId || ('SPN-' + Math.floor(1000 + Math.random() * 9000)),
    // Generated trips don't build confirmation timelines; fall back to first scripted for simplicity
    confirm: buildGenericConfirm(gen),
  };
}

function buildGenericConfirm(gen) {
  // For generated trips, build a simple single-day timeline from the trip array.
  // This keeps the Confirm screen working end-to-end without an LLM call.
  const items = (gen.trips || []).map(t => ({
    time: extractTime(t.meta) || '—',
    title: t.title,
    meta: t.meta,
  }));
  return {
    heading: "You're set.",
    sub: `${gen.trips?.length || 0} bookings · <strong>${gen.total || '$—'}</strong> total`,
    timeline: [
      { dayLabel: 'Your trip', items },
    ],
  };
}

function extractTime(meta) {
  const m = (meta || '').match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  return m ? m[1] : '—';
}

// ============================================================
// PROPOSAL — render + wire confirm
// ============================================================
function showProposal(proposal) {
  document.getElementById('prop-intent-h').innerHTML = proposal.intent.headline;
  document.getElementById('prop-intent-src').innerHTML = proposal.intent.source;

  const chipsEl = document.getElementById('prop-chips');
  chipsEl.innerHTML = proposal.chips.map((c, i) => {
    // Add staggered reveal via inline delay
    const html = renderChip(c);
    return html.replace('<span class="prop-chip', `<span style="animation-delay:${i * 70}ms" class="prop-chip`);
  }).join('') + '<span class="prop-chip" style="animation-delay:' + (proposal.chips.length * 70) + 'ms">+ constraint</span>';

  const tripsEl = document.getElementById('prop-trips');
  tripsEl.innerHTML = proposal.trips.map((t, i) => {
    const html = renderTrip(t);
    // Stagger reveal after chips
    return html.replace('<div class="prop-trip"', `<div style="animation-delay:${300 + i * 140}ms" class="prop-trip"`);
  }).join('');

  document.getElementById('prop-why').innerHTML = proposal.why;
  document.getElementById('prop-total').textContent = proposal.total;
  document.getElementById('prop-cap').textContent = '· ' + proposal.cap;

  // Animate the hold countdown
  startHoldCountdown();
  showScreen('proposal');
}

let holdTimer = null;
function startHoldCountdown() {
  if (holdTimer) clearInterval(holdTimer);
  let secs = 14 * 60 + 28; // 14:28
  const el = document.getElementById('prop-hold-text');
  holdTimer = setInterval(() => {
    secs -= 1;
    if (secs <= 0) {
      clearInterval(holdTimer);
      el.textContent = '2 seats held · expired';
      return;
    }
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    el.textContent = `2 seats held · ${m}:${s < 10 ? '0' + s : s} left`;
  }, 1000);
}

// ============================================================
// CONFIRMATION — built from the proposal's scripted confirm block
// ============================================================
function showConfirmation() {
  const p = state.proposal;
  if (!p || !p.confirm) {
    // Shouldn't happen, but defend
    showScreen('home');
    return;
  }
  const elapsedSec = Math.round((Date.now() - state.startTime) / 1000);
  document.getElementById('confirm-id').textContent = p.confirmId;
  document.getElementById('confirm-h').innerHTML = p.confirm.heading;
  document.getElementById('confirm-sub').innerHTML = p.confirm.sub;
  document.getElementById('confirm-elapsed').textContent = Math.max(elapsedSec, 4);

  const tlEl = document.getElementById('confirm-timeline');
  tlEl.innerHTML = p.confirm.timeline.map(renderTimelineDay).join('');

  if (holdTimer) clearInterval(holdTimer);
  showScreen('confirm');
}

// ============================================================
// MID-FLIGHT — live Claude call + animated ledger
// ============================================================
const midMicBtn = document.getElementById('mid-mic-btn');
const midEmpty = document.getElementById('mid-empty');
const midActive = document.getElementById('mid-active');

attachMic(
  midMicBtn,
  () => MIDFLIGHT_SCRIPT.voiceTranscript,
  (text) => runMidflight(text)
);

async function runMidflight(transcript) {
  midEmpty.hidden = true;
  midActive.hidden = false;

  document.getElementById('mid-qtext').innerHTML = decorateQuote(transcript);
  const logEl = document.getElementById('mid-log');
  const sumEl = document.getElementById('mid-sum');
  const polEl = document.getElementById('mid-policy');
  const botEl = document.getElementById('mid-bot');
  logEl.innerHTML = '';
  sumEl.hidden = true;
  polEl.hidden = true;
  botEl.hidden = true;

  const startedAt = Date.now();
  const elapsedEl = document.getElementById('mid-elapsed');
  const elapsedTimer = setInterval(() => {
    const s = Math.floor((Date.now() - startedAt) / 1000);
    elapsedEl.textContent = `0:${s < 10 ? '0' + s : s}`;
  }, 100);

  // Kick off a live Claude call, and in parallel start animating the scripted steps.
  // Whichever path yields a full result first "wins"; the other is discarded.
  // - If Claude returns usable JSON within ~5s, we abort the scripted reveal and swap in Claude's steps.
  // - If scripted reveal finishes first, we use it and ignore any later Claude response.
  // Minimum 2.8s total so the ledger feels crafted, not raced.

  const MIN_DURATION_MS = 2800;
  let claudeWon = false;
  let scriptedAborted = false;

  const claudePromise = askClaude({
    system: MIDFLIGHT_REPLAN_SYSTEM,
    user: transcript,
    maxTokens: 1200,
    timeoutMs: 5500,
  });

  // Reveal scripted steps one at a time, but abort the loop if Claude wins.
  const scriptedSteps = [...MIDFLIGHT_SCRIPT.steps];
  const scriptedReveal = (async () => {
    for (let i = 0; i < scriptedSteps.length; i++) {
      if (scriptedAborted) return false;
      await sleep(i === 0 ? 400 : 700);
      if (scriptedAborted) return false;
      const step = scriptedSteps[i];
      const html = renderMidStep(step, i);
      logEl.insertAdjacentHTML('beforeend', html);
    }
    return true; // scripted finished naturally
  })();

  // Race: whichever resolves first wins.
  const result = await Promise.race([
    claudePromise.then(r => ({ kind: 'claude', value: r })),
    scriptedReveal.then(() => ({ kind: 'scripted' })),
  ]);

  let finalData;

  if (result.kind === 'claude' && result.value && result.value.steps && result.value.steps.length >= 3) {
    // Claude won with usable JSON. Stop scripted reveal and swap in Claude's steps.
    scriptedAborted = true;
    console.log('[luna] Claude won the mid-flight race');
    // Brief fade-to-replace: clear and re-render with Claude's steps
    logEl.innerHTML = result.value.steps.map(renderMidStep).join('');
    finalData = {
      summary: result.value.summary || MIDFLIGHT_SCRIPT.finalizePolicy.summary,
      total: result.value.total || MIDFLIGHT_SCRIPT.finalizePolicy.total,
      policyText: result.value.policyText || MIDFLIGHT_SCRIPT.finalizePolicy.policyText,
    };
  } else {
    // Scripted won (or Claude returned junk). Make sure scripted finished; if Claude won with
    // bad data we still need to wait for the scripted reveal to complete.
    if (result.kind === 'claude') {
      console.log('[luna] Claude returned unusable data, waiting for scripted');
      await scriptedReveal;
    }
    finalData = MIDFLIGHT_SCRIPT.finalizePolicy;
  }

  // Enforce minimum duration so finalization doesn't snap in instantly on fast Claude calls
  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_DURATION_MS) {
    await sleep(MIN_DURATION_MS - elapsed);
  }

  // Mark the last step (which is the policy-check, `active` in scripted) as done
  const liEls = Array.from(logEl.querySelectorAll('.mid-li'));
  if (liEls.length) {
    const lastNode = liEls[liEls.length - 1].querySelector('.mid-ln');
    if (lastNode) {
      lastNode.classList.remove('active');
      lastNode.classList.add('done');
    }
    const lastLine = liEls[liEls.length - 1].querySelector('.mid-ll');
    if (lastLine && lastLine.querySelector('.working')) {
      lastLine.innerHTML = '<strong>Policy</strong> rechecked · <span class="muted">qualifies for auto-approval</span>';
    }
  }

  clearInterval(elapsedTimer);

  // Show summary + policy
  sumEl.innerHTML = renderMidSummary(finalData.summary, finalData.total);
  sumEl.hidden = false;
  polEl.innerHTML = `<p class="mid-policy-t">${finalData.policyText}</p>`;
  polEl.hidden = false;
  botEl.hidden = false;
}

function resetMidflight() {
  midEmpty.hidden = false;
  midActive.hidden = true;
  document.getElementById('mid-log').innerHTML = '';
  document.getElementById('mid-sum').hidden = true;
  document.getElementById('mid-policy').hidden = true;
  document.getElementById('mid-bot').hidden = true;
}

// ============================================================
// Global click handler for data-action buttons
// ============================================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  switch (action) {
    case 'back-home':
      resetMidflight();
      intentInput.value = '';
      sendBtn.disabled = true;
      showScreen('home');
      break;
    case 'cancel-thinking':
      showScreen('home');
      break;
    case 'confirm':
      showConfirmation();
      break;
    case 'show-disruption':
      showScreen('disruption');
      break;
    case 'show-midflight':
      resetMidflight();
      showScreen('midflight');
      break;
    case 'human':
      toast('A real agent would join here. (This is a demo.)');
      break;
  }
});

// ============================================================
// Helpers
// ============================================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function decorateQuote(text) {
  // Lightly italicize the second half if there's a natural break, for the serif voice treatment
  const parts = text.split(/\.\s+/);
  if (parts.length >= 2) {
    const first = parts[0] + '.';
    const rest = parts.slice(1).join('. ');
    return `${escapeHtml(first)} <em>${escapeHtml(rest)}</em>`;
  }
  return escapeHtml(text);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================
// Init
// ============================================================
showScreen('home');

// Dev shortcut: triple-tap the status bar to jump screens
let tapCount = 0, tapTimer = null;
document.querySelectorAll('.status-bar').forEach(bar => {
  bar.addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 600);
    if (tapCount >= 3) {
      tapCount = 0;
      const order = ['home', 'thinking', 'proposal', 'confirm', 'disruption', 'midflight'];
      const idx = order.indexOf(state.screen);
      const next = order[(idx + 1) % order.length];
      if (next === 'thinking') { showScreen('home'); return; } // skip thinking in manual tour
      if (next === 'midflight') resetMidflight();
      showScreen(next);
    }
  });
});

console.log('[luna] Ready. Triple-tap status bar to cycle screens.');
