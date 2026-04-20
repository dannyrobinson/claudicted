// scripted.js
// Pre-authored trip data for the four demo intents.
// Claude's role is reduced to parsing the intent and selecting which
// scripted trip applies (or generating a fresh one for off-script inputs).

export const SCRIPTED_INTENTS = {
  'nyc-board': {
    id: 'nyc-board',
    rawIntent: "I need to be in NYC Tuesday for the Q2 board",
    parsedIntent: {
      headline: 'New York, <em>Mon to Wed</em>, for the Q2 board.',
      source: '📅 From your calendar · Sheraton Times Square · 9:00 AM',
      reasoning_preview: "Checking your calendar for the board meeting…",
    },
    proposal: {
      chips: [
        { label: 'Within policy', kind: 'active' },
        { label: 'Aisle seat', kind: 'active' },
        { label: 'Delta', kind: 'active' },
        { label: 'Walk to venue', kind: 'active' },
        { label: 'Tight AM', kind: 'warn' },
      ],
      trips: [
        {
          icon: '✈',
          title: 'SFO → JFK · Delta 1428',
          meta: 'Mon 7:00 AM → 3:32 PM · 12C aisle',
          price: '$412',
          priceMeta: 'main cabin',
        },
        {
          icon: '⌂',
          title: 'The Times Square EDITION',
          meta: '2 nights · king · 0.3 mi to venue',
          tag: { initials: 'AG', text: 'Akshita is also staying here' },
          price: '$684',
          priceMeta: 'total',
        },
        {
          icon: '⌗',
          title: 'JFK → hotel · Revel black car',
          meta: 'Meet at arrivals · 45 min',
          price: '$78',
          priceMeta: 'fixed',
        },
        {
          icon: '✈',
          title: 'JFK → SFO · Delta 401',
          meta: 'Wed 5:55 PM → 9:12 PM · 8D aisle',
          price: '$388',
          priceMeta: 'main cabin',
        },
      ],
      why: "<strong>Why this?</strong> Skipped the 6 AM because you flagged early departures last March.",
      total: '$1,562',
      cap: '94% of cap',
      confirmId: 'SPN-4829',
      confirm: {
        heading: "You're set for<br/>New York.",
        sub: "On your calendar · 4 things Luna's watching · <strong>$1,562</strong> total",
        timeline: [
          {
            dayLabel: 'Monday, May 5',
            items: [
              { time: '7:00 AM', title: 'Depart SFO · Delta 1428', meta: 'Direct · arrive JFK 3:32 PM · aisle 12C' },
              { time: '3:32 PM', title: 'JFK → hotel', meta: 'Revel black car · meet at arrivals' },
              { time: '4:30 PM', title: 'Check in · Times Square EDITION', meta: 'King, 2 nights · 0.3 mi to venue', tag: { initials: 'AG', text: 'Akshita staying here too' } },
            ],
          },
          {
            dayLabel: 'Tuesday, May 6',
            items: [
              { time: '9:00 AM', title: 'Q2 board review', meta: 'Sheraton Times Square · 10 min walk', anchor: true },
            ],
          },
          {
            dayLabel: 'Wednesday, May 7',
            items: [
              { time: '5:55 PM', title: 'Depart JFK · Delta 401', meta: 'Direct · home SFO 9:12 PM · aisle 8D' },
            ],
          },
        ],
      },
    },
  },

  'sf-customer': {
    id: 'sf-customer',
    rawIntent: "SF Thursday to meet with the Acme team",
    parsedIntent: {
      headline: 'San Francisco, <em>Thu day trip</em>, Acme at 11 AM.',
      source: '📅 From Vikram\'s invite · Acme HQ · 11:00 AM',
      reasoning_preview: "Pulling the Acme meeting location and your team's past trips…",
    },
    proposal: {
      chips: [
        { label: 'Within policy', kind: 'active' },
        { label: 'Aisle seat', kind: 'active' },
        { label: 'Day trip', kind: 'active' },
        { label: 'Under 90 min ground', kind: 'active' },
      ],
      trips: [
        {
          icon: '✈',
          title: 'BOS → SFO · United 523',
          meta: 'Thu 5:55 AM → 9:08 AM · 14C aisle',
          price: '$486',
          priceMeta: 'main cabin',
        },
        {
          icon: '⌗',
          title: 'SFO → Acme HQ · Revel black car',
          meta: 'Direct · 38 min in traffic',
          price: '$84',
          priceMeta: 'fixed',
        },
        {
          icon: '⌗',
          title: 'Acme → SFO · Revel black car',
          meta: 'Pickup 3:30 PM · 45 min buffer',
          price: '$84',
          priceMeta: 'fixed',
        },
        {
          icon: '✈',
          title: 'SFO → BOS · JetBlue 488',
          meta: 'Thu 5:40 PM → 2:15 AM · 9D aisle',
          price: '$394',
          priceMeta: 'red-eye',
        },
      ],
      why: "<strong>Why the red-eye back?</strong> Sarah did this same run last month and wanted to be home Friday. I assumed the same.",
      total: '$1,048',
      cap: '62% of cap',
      confirmId: 'SPN-5104',
      confirm: {
        heading: "You're set for<br/>San Francisco.",
        sub: "Day trip · <strong>$1,048</strong> total · home by breakfast",
        timeline: [
          {
            dayLabel: 'Thursday, April 23',
            items: [
              { time: '5:55 AM', title: 'Depart BOS · United 523', meta: 'Direct · arrive SFO 9:08 AM · aisle 14C' },
              { time: '9:30 AM', title: 'SFO → Acme HQ', meta: 'Revel black car · 38 min' },
              { time: '11:00 AM', title: 'Acme team meeting', meta: 'Acme HQ, 3rd floor · with Vikram', anchor: true },
              { time: '3:30 PM', title: 'Acme HQ → SFO', meta: 'Revel black car · 45 min buffer' },
              { time: '5:40 PM', title: 'Depart SFO · JetBlue 488', meta: 'Red-eye · home BOS 2:15 AM · aisle 9D' },
            ],
          },
        ],
      },
    },
  },

  'london-offsite': {
    id: 'london-offsite',
    rawIntent: "London next week for the leadership offsite",
    parsedIntent: {
      headline: 'London, <em>Tue to Fri</em>, leadership offsite.',
      source: '📅 From Sarosh\'s invite · The Ned London · 9:00 AM Wed',
      reasoning_preview: "Looking at the offsite agenda and past London trips…",
    },
    proposal: {
      chips: [
        { label: 'Within policy', kind: 'active' },
        { label: 'Business class (10hr+)', kind: 'active' },
        { label: 'Aisle seat', kind: 'active' },
        { label: 'Walk to venue', kind: 'active' },
        { label: 'Arriving day before', kind: 'active' },
      ],
      trips: [
        {
          icon: '✈',
          title: 'BOS → LHR · British Airways 238',
          meta: 'Tue 10:00 PM → Wed 9:45 AM · 7K business',
          price: '$3,240',
          priceMeta: 'business',
        },
        {
          icon: '⌂',
          title: 'The Ned London',
          meta: '3 nights · king room · same hotel as offsite',
          tag: { initials: '5', text: '5 teammates staying here' },
          price: '$1,680',
          priceMeta: 'total',
        },
        {
          icon: '⌗',
          title: 'LHR → hotel · Addison Lee',
          meta: 'Pre-booked · 55 min',
          price: '$96',
          priceMeta: 'fixed',
        },
        {
          icon: '✈',
          title: 'LHR → BOS · British Airways 213',
          meta: 'Fri 2:20 PM → 5:05 PM · 8D business',
          price: '$2,980',
          priceMeta: 'business',
        },
      ],
      why: "<strong>Why business class?</strong> Flight is 7 hours. Policy allows business on transatlantic over 6 hours and you've flagged jet lag before.",
      total: '$7,996',
      cap: '89% of cap',
      confirmId: 'SPN-5287',
      confirm: {
        heading: "You're set for<br/>London.",
        sub: "3 nights · <strong>$7,996</strong> total · 5 teammates on the same hotel",
        timeline: [
          {
            dayLabel: 'Tuesday, April 28',
            items: [
              { time: '10:00 PM', title: 'Depart BOS · BA 238', meta: 'Direct · arrive LHR 9:45 AM Wed · 7K business' },
            ],
          },
          {
            dayLabel: 'Wednesday, April 29',
            items: [
              { time: '9:45 AM', title: 'LHR → The Ned', meta: 'Addison Lee · 55 min' },
              { time: '11:00 AM', title: 'Check in · The Ned London', meta: 'Same hotel as offsite venue', tag: { initials: '5', text: '5 teammates here' } },
              { time: '2:00 PM', title: 'Leadership offsite · Day 1', meta: 'The Ned · Tapestry Room', anchor: true },
            ],
          },
          {
            dayLabel: 'Friday, May 1',
            items: [
              { time: '2:20 PM', title: 'Depart LHR · BA 213', meta: 'Direct · home BOS 5:05 PM · 8D business' },
            ],
          },
        ],
      },
    },
  },

  'austin-conference': {
    id: 'austin-conference',
    rawIntent: "Austin for SXSW, arriving Monday",
    parsedIntent: {
      headline: 'Austin, <em>Mon to Thu</em>, SXSW.',
      source: '📅 From your calendar · 3 sessions on Tue-Wed',
      reasoning_preview: "Checking conference schedule and lodging near the venues…",
    },
    proposal: {
      chips: [
        { label: 'Within policy', kind: 'active' },
        { label: 'Aisle seat', kind: 'active' },
        { label: 'Walk to convention center', kind: 'active' },
        { label: 'Surge pricing', kind: 'warn' },
      ],
      trips: [
        {
          icon: '✈',
          title: 'BOS → AUS · Delta 1247',
          meta: 'Mon 8:15 AM → 11:52 AM · 11C aisle',
          price: '$562',
          priceMeta: 'main cabin',
        },
        {
          icon: '⌂',
          title: 'Hotel Van Zandt',
          meta: '3 nights · king · 0.4 mi to convention center',
          price: '$1,380',
          priceMeta: 'total · SXSW surge',
        },
        {
          icon: '⌗',
          title: 'AUS → hotel · Revel',
          meta: 'Direct · 22 min',
          price: '$64',
          priceMeta: 'fixed',
        },
        {
          icon: '✈',
          title: 'AUS → BOS · JetBlue 1104',
          meta: 'Thu 6:45 PM → 11:20 PM · 7D aisle',
          price: '$498',
          priceMeta: 'main cabin',
        },
      ],
      why: "<strong>Why Van Zandt?</strong> All your preferred hotels (Four Seasons, JW) are sold out for SXSW. Van Zandt is walking distance and had a $200/night price drop this morning.",
      total: '$2,504',
      cap: '112% of cap',
      confirmId: 'SPN-5412',
      confirm: {
        heading: "You're set for<br/>Austin.",
        sub: "SXSW · 3 nights · <strong>$2,504</strong> total · walking distance",
        timeline: [
          {
            dayLabel: 'Monday, March 9',
            items: [
              { time: '8:15 AM', title: 'Depart BOS · Delta 1247', meta: 'Direct · arrive AUS 11:52 AM · aisle 11C' },
              { time: '12:30 PM', title: 'AUS → Hotel Van Zandt', meta: 'Revel · 22 min' },
              { time: '1:30 PM', title: 'Check in · Hotel Van Zandt', meta: 'King, 3 nights · 0.4 mi to convention center' },
            ],
          },
          {
            dayLabel: 'Tuesday, March 10',
            items: [
              { time: '10:00 AM', title: 'SXSW · AI & Travel Panel', meta: 'Convention Center · Room 15AB', anchor: true },
            ],
          },
          {
            dayLabel: 'Thursday, March 12',
            items: [
              { time: '6:45 PM', title: 'Depart AUS · JetBlue 1104', meta: 'Direct · home BOS 11:20 PM · aisle 7D' },
            ],
          },
        ],
      },
    },
  },
};

// ============================================================
// Mid-flight scripted replanning (scripted for the demo flow,
// but replayed via a live Claude call when you tap the mic)
// ============================================================
export const MIDFLIGHT_SCRIPT = {
  voiceTranscript: "Board meeting moved to Wednesday. Shift everything.",
  steps: [
    { line: "<strong>Meeting</strong> moved to <strong>Wed, May 7 · 9 AM</strong> <span class=\"muted\">· calendar updated</span>", delay: 900 },
    { line: "<strong>Hotel</strong> extended <span class=\"muted\">· 3 nights instead of 2, same room</span>", delay: 1700 },
    { line: "<strong>Return flight</strong> moved <span class=\"muted\">· DL 402, Thu 8:20 PM, aisle preserved</span>", delay: 2600 },
    { line: "<strong>Revel pickup</strong> moved to Thu <span class=\"muted\">· Friday ride canceled</span>", delay: 3500 },
    { line: "<strong>Akshita</strong> notified <span class=\"muted\">· extending her trip to match</span>", delay: 4400 },
    { line: "<span class=\"working\">Re-checking policy for new dates…</span>", delay: 5300, active: true },
  ],
  finalizePolicy: {
    delay: 7200,
    policyText: "<strong>Over policy cap by 15%.</strong> Qualifies for auto-approval. Meeting change is a documented reason. I'll log it; no action needed from you.",
    summary: [
      { label: 'Original trip', value: '$1,562' },
      { label: '+ 1 hotel night · king', value: '+$342', delta: true },
      { label: '+ flight change fee', value: '+$0', delta: true, free: 'waived · Platinum' },
    ],
    total: { label: 'New total', value: '$1,904', muted: '115% of cap' },
  },
};

// ============================================================
// Lookup by scripted id or rough intent match
// ============================================================
export function findScriptedByRaw(raw) {
  if (!raw) return null;
  const r = raw.toLowerCase();
  if (/\b(nyc|new york|manhattan|board)\b/.test(r)) return SCRIPTED_INTENTS['nyc-board'];
  if (/\b(sf|san francisco|acme)\b/.test(r)) return SCRIPTED_INTENTS['sf-customer'];
  if (/\b(london|offsite)\b/.test(r)) return SCRIPTED_INTENTS['london-offsite'];
  if (/\b(austin|sxsw|conference)\b/.test(r)) return SCRIPTED_INTENTS['austin-conference'];
  return null;
}

export function getScriptedById(id) {
  return SCRIPTED_INTENTS[id] || null;
}
