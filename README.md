# Claudicted

**The gallery for vibe coders.** Share what you built with Claude. Discover what's possible. Find your next prompt obsession.

A showcase of interactive web apps built entirely through conversational prompting with Claude — no frameworks, no build steps, just vanilla HTML/CSS/JS.

## Live Demo

[claudicted.com](https://claudicted.com)

## Interactive Apps

Every card in the gallery opens a fully functional app:

| App | Description |
|-----|-------------|
| 🧠 **Synapse Analytics** | Full SaaS dashboard with multi-view navigation, KPI cards, line/bar/donut charts, and data tables |
| 🐍 **Snake Game** | Multiplayer snake with AI bot opponents, leaderboard, speed controls, and canvas rendering |
| 💸 **Budget Tracker** | Monthly budget manager with donut charts, category tracking, transaction logging, and spend modals |
| 🍳 **PantryAI** | Smart recipe finder — toggle pantry ingredients, get matched recipes with step-by-step instructions |
| 🌊 **Portfolio** | Animated designer portfolio with project cards, skill bars, section navigation, and staggered transitions |
| ✍️ **WriteFlow** | Real-time writing coach with Clarity, Flow, and Vibe Score™ gauges, tone detection, and suggestions |
| 🔥 **Streakr** | Habit tracker with streak detection, contribution calendar, shame mode roasts, and fire celebrations |
| 🪐 **Cosmos** | Interactive solar system with canvas-rendered planets at real orbital ratios, speed/zoom controls |
| ✅ **done.** | The todo app that judges you — category tabs, shame mode, snarky toasts, and confetti on completion |

Every app supports **popout mode** — open in its own window with full functionality.

## Project Structure

```
├── index.html            # HTML shell, card grid, all modal markup
├── css/
│   ├── main.css          # Page layout, themes, nav, cards, footer, modals
│   ├── dashboard.css     # Synapse Analytics styles
│   ├── snake.css         # Snake Game styles
│   ├── budget.css        # Budget Tracker styles
│   ├── recipe.css        # PantryAI styles
│   ├── portfolio.css     # Portfolio styles
│   ├── writer.css        # WriteFlow styles
│   ├── habit.css         # Streakr styles
│   ├── solar.css         # Cosmos styles
│   └── todo.css          # done. styles
├── js/
│   ├── main.js           # Theme toggle, prompt box, toast, login, shared utils
│   ├── dashboard.js      # Synapse Analytics logic + popout
│   ├── snake.js          # Snake Game logic + popout
│   ├── budget.js         # Budget Tracker logic + popout
│   ├── recipe.js         # PantryAI logic + popout
│   ├── portfolio.js      # Portfolio logic + popout
│   ├── writer.js         # WriteFlow logic + popout
│   ├── habit.js          # Streakr logic + popout
│   ├── solar.js          # Cosmos logic + popout
│   └── todo.js           # done. logic + popout
└── CNAME                 # Custom domain config
```

## Features

- **Dark/Light theme** toggle with CSS custom properties
- **No build step** — pure static files, open `index.html` and go
- **Responsive** — works on desktop and mobile
- **Popout windows** — every app can detach into its own window
- **Zero dependencies** — vanilla JS, no frameworks, no npm

## Running Locally

Just serve the files with any static server:

```bash
# Python
python3 -m http.server 8765

# Node
npx serve .

# Or just open index.html in your browser
```

## Built By

**David** & **Danny** Robinson — built with vibes & [Claude](https://claude.ai)
