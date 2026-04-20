# Luna — AI-native corporate travel prototype

A working prototype of Luna, built as a vanilla HTML/CSS/JS PWA. No build step, no framework, no server required (beyond a static file server for ES modules to load).

## Running it locally

1. **Add your Anthropic API key** to `config.js`:
   ```js
   export const ANTHROPIC_API_KEY = 'sk-ant-...';
   ```
   `config.js` is gitignored — your key won't get committed.

2. **Serve the directory** (ES modules need HTTP, not `file://`):
   ```bash
   cd luna
   python3 -m http.server 8000
   ```
   Or any equivalent: `npx serve`, `caddy file-server`, VSCode Live Server, etc.

3. **Open** `http://localhost:8000` in your browser. On iPhone, use your Mac's local IP (e.g. `http://192.168.1.12:8000`) from Safari.

## The four flows

1. **Home → Proposal.** Tap a suggestion chip OR hold the mic (waveform animates 2s, then drops pre-written text) OR type an intent. Claude parses, the "thinking" ledger animates, the proposal assembles.
2. **Proposal → Confirmation.** Tap "Confirm" — the committed itinerary with anchor meeting, Luna's watch list, and the silence promise.
3. **Disruption.** From the proposal screen, tap the small `◈` icon in the bottom-left corner (dev trigger). Shows the "your flight was canceled, your trip wasn't" scripted scene.
4. **Mid-flight.** From the Confirmation screen, tap "Simulate mid-flight change." Hold the mid-flight mic. Claude replans live (falls back to scripted if the call is slow).

## Hidden shortcuts

- **Triple-tap the status bar** to cycle through all screens manually.
- **`◈` bottom-left on the proposal screen** jumps straight to Disruption.
- The API key missing? Scripted paths still work — only generative fallback is disabled.

## How Claude is used

- **Intent parsing** (home → proposal): Claude decides which of the four scripted intents matches, OR generates a fresh trip from scratch for off-script inputs. Timeout: 8s. Falls back to regex match + scripted data if anything fails.
- **Mid-flight replan**: Claude generates parallel replanning steps from the user's voice input. Runs in parallel with scripted animation as a safety net — scripted UI shows instantly, Claude's version swaps in if it returns in time.

## Architecture notes

- **No build step.** Open `index.html` (via a local server), done.
- **No persistence.** Every page reload starts fresh. Intentional for demo stability.
- **No service worker.** You said browser-only works; skipping PWA install machinery.
- **Min 2.4s ledger duration** on the thinking screen, regardless of Claude speed. The "working" moment has to feel crafted, not raced.
- **Parallel Claude + scripted animation** on mid-flight. Scripted UI paints immediately; Claude's result swaps in if usable within 5.5s.

## File tour

```
index.html      — Four screens stacked, toggled by .active class
styles.css      — All CSS, ported from the narrative reference
config.js       — API key (gitignored)
app.js          — State, routing, intent flow
claude.js       — Anthropic API wrapper, CORS-header, timeout, JSON parse
prompts.js      — Three system prompts (parser, trip generator, mid-flight)
scripted.js     — Four canned demo intents + their full trip data
templates.js    — Pure HTML render functions
voice.js        — Tap-and-hold mic with waveform, no real STT
```

## Swapping models

In `claude.js`, change the `MODEL` constant. Sonnet 4.5 is the default. When Sonnet 4.6 is available in your account, use that model string instead.
