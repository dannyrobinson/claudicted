// templates.js
// Pure render functions. Take data, return HTML strings.
// No DOM manipulation here — app.js does the inserting.

export function renderChip(chip) {
  const cls = chip.kind === 'warn' ? 'prop-chip warn'
            : chip.kind === 'active' ? 'prop-chip active'
            : 'prop-chip';
  return `<span class="${cls}"><span class="prop-chip-dot"></span>${escapeHtml(chip.label)}</span>`;
}

export function renderTrip(trip) {
  const tag = trip.tag
    ? `<p class="prop-trip-tag"><span class="prop-trip-tag-dot">${escapeHtml(trip.tag.initials)}</span>${escapeHtml(trip.tag.text)}</p>`
    : '';
  return `
    <div class="prop-trip">
      <div class="prop-trip-ic">${escapeHtml(trip.icon)}</div>
      <div class="prop-trip-body">
        <p class="prop-trip-t">${escapeHtml(trip.title)}</p>
        <p class="prop-trip-m">${escapeHtml(trip.meta)}</p>
        ${tag}
        <p class="prop-trip-p">${escapeHtml(trip.price)} <span class="muted">· ${escapeHtml(trip.priceMeta)}</span></p>
      </div>
    </div>
  `;
}

export function renderTimelineItem(item) {
  const anchorCls = item.anchor ? ' anchor' : '';
  const titleCls = item.anchor ? 'confirm-title anchor' : 'confirm-title';
  const tag = item.tag
    ? `<span class="confirm-tag"><span class="confirm-tag-dot">${escapeHtml(item.tag.initials)}</span>${escapeHtml(item.tag.text)}</span>`
    : '';
  const meta = item.meta
    ? `<p class="confirm-meta">${formatMeta(item.meta)}</p>`
    : '';
  return `
    <div class="confirm-ti">
      <div class="confirm-tn${anchorCls}"></div>
      <p class="confirm-tt">${escapeHtml(item.time)}</p>
      <p class="${titleCls}">${escapeHtml(item.title)}</p>
      ${meta}
      ${tag}
    </div>
  `;
}

export function renderTimelineDay(day) {
  const items = day.items.map(renderTimelineItem).join('');
  return `
    <p class="confirm-daylabel">${escapeHtml(day.dayLabel)}</p>
    <div class="confirm-tl">${items}</div>
  `;
}

export function renderThinkingStep(step, index) {
  const statusClass = step.status === 'done' ? 'done' : step.status === 'active' ? 'active' : '';
  return `
    <div class="thinking-step ${statusClass}" style="animation-delay: ${index * 120}ms">
      <p class="thinking-step-t">${step.text}</p>
    </div>
  `;
}

export function renderMidStep(step, index) {
  const nodeClass = step.active ? 'active' : 'done';
  return `
    <div class="mid-li" style="animation-delay: ${index * 40}ms">
      <div class="mid-ln ${nodeClass}"></div>
      <p class="mid-ll">${step.line}</p>
    </div>
  `;
}

export function renderMidSummary(summary, total) {
  const rows = summary.map(r => {
    const deltaCls = r.delta ? ' delta' : '';
    const free = r.free ? ` <span class="free">${escapeHtml(r.free)}</span>` : '';
    return `<div class="mid-sum-row"><span class="k">${escapeHtml(r.label)}</span><span class="v${deltaCls}">${escapeHtml(r.value)}${free}</span></div>`;
  }).join('');
  const totalRow = total
    ? `<div class="mid-sum-row total"><span class="k">${escapeHtml(total.label)}</span><span class="v">${escapeHtml(total.value)} <span class="muted">· ${escapeHtml(total.muted)}</span></span></div>`
    : '';
  return rows + totalRow;
}

// ============================================================
// Helpers
// ============================================================

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Meta strings use · as separator; wrap each separator in a muted sep span
function formatMeta(meta) {
  const parts = meta.split(' · ');
  if (parts.length === 1) return escapeHtml(meta);
  return parts.map(escapeHtml).join('<span class="sep">·</span>');
}
