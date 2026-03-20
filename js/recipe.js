/* ══════════════════════════════════════════════════
   PANTRY AI — RECIPE APP
══════════════════════════════════════════════════ */

const PANTRY_INGREDIENTS = [
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Eggs', emoji: '🥚' },
  { name: 'Butter', emoji: '🧈' },
  { name: 'Garlic', emoji: '🧄' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Cheese', emoji: '🧀' },
  { name: 'Broccoli', emoji: '🥦' },
  { name: 'Salmon', emoji: '🐟' },
  { name: 'Avocado', emoji: '🥑' },
  { name: 'Lemon', emoji: '🍋' },
  { name: 'Olive Oil', emoji: '🫒' },
  { name: 'Bell Pepper', emoji: '🫑' },
  { name: 'Mushroom', emoji: '🍄' },
  { name: 'Spinach', emoji: '🥬' },
  { name: 'Tofu', emoji: '🫘' },
  { name: 'Ginger', emoji: '🫚' },
  { name: 'Soy Sauce', emoji: '🥫' },
];

const RECIPES = [
  {
    name: 'Garlic Butter Chicken',
    time: '30 min',
    difficulty: 'Easy',
    ingredients: ['Chicken', 'Butter', 'Garlic', 'Lemon', 'Olive Oil'],
    steps: [
      'Season chicken thighs with salt, pepper, and a squeeze of lemon.',
      'Heat olive oil in a large skillet over medium-high heat.',
      'Sear chicken skin-side down for 6 minutes until golden and crispy.',
      'Flip chicken, add minced garlic and butter to the pan.',
      'Baste chicken with the garlic butter for 3-4 minutes.',
      'Rest for 5 minutes, then serve with pan juices drizzled over top.'
    ]
  },
  {
    name: 'Classic Egg Fried Rice',
    time: '15 min',
    difficulty: 'Easy',
    ingredients: ['Rice', 'Eggs', 'Soy Sauce', 'Garlic', 'Onion'],
    steps: [
      'Beat eggs and scramble in a hot wok with a little oil. Set aside.',
      'Add diced onion and minced garlic, stir-fry 1 minute.',
      'Add day-old rice, breaking up clumps. Fry on high heat 3 minutes.',
      'Drizzle soy sauce around the edge of the wok, toss to coat.',
      'Return scrambled eggs, toss everything together.',
      'Serve immediately — crispy rice is the goal.'
    ]
  },
  {
    name: 'Creamy Tomato Pasta',
    time: '25 min',
    difficulty: 'Easy',
    ingredients: ['Pasta', 'Tomato', 'Garlic', 'Butter', 'Cheese'],
    steps: [
      'Cook pasta in heavily salted water until al dente. Reserve 1 cup pasta water.',
      'Dice tomatoes. Sauté minced garlic in butter until fragrant.',
      'Add tomatoes, cook down for 8 minutes into a chunky sauce.',
      'Add a splash of pasta water, stir in grated cheese until creamy.',
      'Toss pasta in the sauce, adding more pasta water if needed.',
      'Serve with extra cheese and cracked black pepper.'
    ]
  },
  {
    name: 'Lemon Herb Salmon',
    time: '20 min',
    difficulty: 'Medium',
    ingredients: ['Salmon', 'Lemon', 'Garlic', 'Butter', 'Olive Oil'],
    steps: [
      'Pat salmon fillets dry, season generously with salt and pepper.',
      'Heat olive oil in an oven-safe skillet over medium-high.',
      'Place salmon skin-side up, sear 4 minutes until a crust forms.',
      'Flip, add butter, garlic, and lemon slices to the pan.',
      'Transfer to 400°F oven for 6 minutes until just cooked through.',
      'Squeeze fresh lemon over top and serve immediately.'
    ]
  },
  {
    name: 'Mushroom & Spinach Stir Fry',
    time: '15 min',
    difficulty: 'Easy',
    ingredients: ['Mushroom', 'Spinach', 'Garlic', 'Soy Sauce', 'Ginger', 'Tofu'],
    steps: [
      'Press and cube tofu. Pan-fry until golden on all sides. Set aside.',
      'Slice mushrooms. Heat oil, add ginger and garlic, fry 30 seconds.',
      'Add mushrooms, cook on high heat until golden, about 4 minutes.',
      'Toss in spinach and crispy tofu.',
      'Drizzle soy sauce, toss until spinach is just wilted.',
      'Serve over rice or noodles.'
    ]
  },
  {
    name: 'Avocado Egg Toast',
    time: '10 min',
    difficulty: 'Easy',
    ingredients: ['Avocado', 'Eggs', 'Lemon', 'Olive Oil'],
    steps: [
      'Mash avocado with a fork, add lemon juice, salt, and pepper.',
      'Toast your bread until golden and crunchy.',
      'Fry or poach eggs to your preference (runny yolk recommended).',
      'Spread avocado generously on toast.',
      'Top with egg, drizzle olive oil, add flaky salt.',
      'Optional: red pepper flakes for a kick.'
    ]
  },
  {
    name: 'Cheesy Broccoli Rice Bake',
    time: '35 min',
    difficulty: 'Medium',
    ingredients: ['Broccoli', 'Rice', 'Cheese', 'Butter', 'Onion', 'Garlic'],
    steps: [
      'Preheat oven to 375°F. Butter a baking dish.',
      'Sauté diced onion and garlic in butter until soft.',
      'Steam broccoli florets until just tender, about 3 minutes.',
      'Mix cooked rice, broccoli, sautéed onion, and most of the cheese.',
      'Transfer to baking dish, top with remaining cheese.',
      'Bake 20 minutes until bubbly and golden on top.'
    ]
  },
  {
    name: 'Ginger Soy Glazed Tofu',
    time: '25 min',
    difficulty: 'Easy',
    ingredients: ['Tofu', 'Ginger', 'Soy Sauce', 'Garlic', 'Rice'],
    steps: [
      'Press tofu for 15 minutes, cut into thick slabs.',
      'Mix soy sauce, grated ginger, minced garlic, and a pinch of sugar.',
      'Pan-fry tofu in oil until crispy on both sides, about 3 min per side.',
      'Pour glaze into the pan, let it reduce and coat the tofu.',
      'Cook rice according to package directions.',
      'Serve glazed tofu over rice with remaining sauce spooned over.'
    ]
  },
  {
    name: 'Stuffed Bell Peppers',
    time: '40 min',
    difficulty: 'Medium',
    ingredients: ['Bell Pepper', 'Rice', 'Tomato', 'Cheese', 'Onion', 'Garlic'],
    steps: [
      'Preheat oven to 375°F. Cut peppers in half, remove seeds.',
      'Sauté diced onion and garlic until translucent.',
      'Mix cooked rice, diced tomato, sautéed onion, and half the cheese.',
      'Stuff pepper halves with the rice mixture.',
      'Place in baking dish, top with remaining cheese.',
      'Cover with foil, bake 25 min. Uncover, bake 10 more until golden.'
    ]
  },
  {
    name: 'One-Pan Chicken & Veggies',
    time: '35 min',
    difficulty: 'Easy',
    ingredients: ['Chicken', 'Broccoli', 'Bell Pepper', 'Olive Oil', 'Garlic', 'Lemon'],
    steps: [
      'Preheat oven to 425°F. Cut chicken into bite-sized pieces.',
      'Toss chicken, broccoli, and sliced bell pepper with olive oil and garlic.',
      'Season generously with salt, pepper, and dried herbs.',
      'Spread in a single layer on a sheet pan — don\'t crowd it.',
      'Roast 22-25 minutes until chicken is cooked and veggies are charred.',
      'Squeeze lemon over everything and serve straight from the pan.'
    ]
  },
];

let selectedIngredients = new Set();
let currentRecipe = null;

/* ── OPEN / CLOSE ──────────────────────────────── */
function openRecipe() {
  renderPantry();
  document.getElementById('recipeResult').classList.remove('visible');
  document.getElementById('recipeModal').classList.add('open');
}
function closeRecipe() { document.getElementById('recipeModal').classList.remove('open'); }
function closeRecipeBg(e) { if (e.target === document.getElementById('recipeModal')) closeRecipe(); }

/* ── PANTRY ────────────────────────────────────── */
function renderPantry() {
  const wrap = document.getElementById('rcPantry');
  wrap.innerHTML = PANTRY_INGREDIENTS.map((ing, i) =>
    `<div class="rc-chip${selectedIngredients.has(ing.name) ? ' active' : ''}"
          onclick="toggleIngredient('${ing.name}', this)"
          data-ing="${ing.name}">
      ${ing.emoji} ${ing.name}
    </div>`
  ).join('');
  updateCount();
}

function toggleIngredient(name, el) {
  if (selectedIngredients.has(name)) {
    selectedIngredients.delete(name);
    el.classList.remove('active');
  } else {
    selectedIngredients.add(name);
    el.classList.add('active');
  }
  updateCount();
}

function selectAllIngredients() {
  PANTRY_INGREDIENTS.forEach(i => selectedIngredients.add(i.name));
  renderPantry();
}

function clearIngredients() {
  selectedIngredients.clear();
  renderPantry();
  document.getElementById('recipeResult').classList.remove('visible');
}

function updateCount() {
  const el = document.getElementById('rcSelectedCount');
  if (el) el.textContent = selectedIngredients.size;
}

/* ── GENERATE RECIPE ───────────────────────────── */
function generateRecipe() {
  if (selectedIngredients.size === 0) {
    showToast('Select some ingredients first! 🥄');
    return;
  }

  const btn = document.getElementById('rcGenBtn');
  btn.classList.add('loading');
  document.getElementById('recipeResult').classList.remove('visible');

  // Simulate "thinking" delay
  setTimeout(() => {
    btn.classList.remove('loading');

    // Score all recipes
    const scored = RECIPES.map(r => {
      const have = r.ingredients.filter(i => selectedIngredients.has(i)).length;
      const total = r.ingredients.length;
      const score = Math.round((have / total) * 100);
      return { ...r, have, total, score };
    }).filter(r => r.have >= 1).sort((a, b) => b.score - a.score || a.total - b.total);

    if (scored.length === 0) {
      showNoMatch();
      return;
    }

    // Pick the best match (or random among top ties)
    const topScore = scored[0].score;
    const topRecipes = scored.filter(r => r.score === topScore);
    currentRecipe = topRecipes[Math.floor(Math.random() * topRecipes.length)];

    renderRecipe(currentRecipe);
    showToast(`Found a ${currentRecipe.score}% match! 🍳`);
  }, 600);
}

function showNoMatch() {
  const el = document.getElementById('recipeResult');
  el.innerHTML = `
    <div class="rc-no-match">
      <div class="rc-no-match-emoji">🤔</div>
      <div>No recipes match your ingredients.<br>Try selecting a few more!</div>
    </div>`;
  el.classList.add('visible');
}

function renderRecipe(r) {
  const matchClass = r.score >= 80 ? 'high' : r.score >= 50 ? 'medium' : 'low';

  const ingsHtml = r.ingredients.map(ing => {
    const has = selectedIngredients.has(ing);
    return `<span class="rc-ing ${has ? 'have' : 'missing'}">${has ? '✓' : '✗'} ${ing}</span>`;
  }).join('');

  const stepsHtml = r.steps.map((step, i) =>
    `<div class="rc-step" style="animation-delay:${i * 0.08}s">
      <div class="rc-step-num">${i + 1}</div>
      <div class="rc-step-text">${step}</div>
    </div>`
  ).join('');

  const el = document.getElementById('recipeResult');
  el.innerHTML = `
    <div class="rc-recipe-card">
      <div class="rc-recipe-header">
        <div>
          <div class="rc-recipe-title">${r.name}</div>
          <div class="rc-recipe-meta">
            <span class="rc-meta-item"><span class="rc-meta-icon">⏱</span> ${r.time}</span>
            <span class="rc-meta-item"><span class="rc-meta-icon">📊</span> ${r.difficulty}</span>
            <span class="rc-meta-item"><span class="rc-meta-icon">🥘</span> ${r.total} ingredients</span>
          </div>
        </div>
        <div class="rc-match ${matchClass}">${r.score}% match</div>
      </div>
      <div class="rc-ingredients">
        <div class="rc-ing-label">Ingredients (${r.have}/${r.total} in pantry)</div>
        <div class="rc-ing-list">${ingsHtml}</div>
      </div>
      <div class="rc-steps">
        <div class="rc-steps-label">Instructions</div>
        ${stepsHtml}
      </div>
    </div>`;

  // Trigger animation
  requestAnimationFrame(() => el.classList.add('visible'));
}

/* ── POPOUT ─────────────────────────────────────── */
function popoutRecipe() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const win = window.open('', 'PantryAI', 'width=660,height=780,resizable=yes,scrollbars=yes');
  if (!win) { showToast('Pop-up blocked — allow pop-ups and try again'); return; }

  const cssText = document.querySelector('link[href="css/recipe.css"]').sheet;
  let css = '';
  try { for (const rule of cssText.cssRules) css += rule.cssText + '\n'; } catch(e) {}

  const mainCss = document.querySelector('link[href="css/main.css"]').sheet;
  let mainCssText = '';
  try { for (const rule of mainCss.cssRules) mainCssText += rule.cssText + '\n'; } catch(e) {}

  const appHtml = document.getElementById('recipeApp').outerHTML;
  const stateIngredients = JSON.stringify([...selectedIngredients]);
  const stateRecipes = JSON.stringify(RECIPES);
  const statePantry = JSON.stringify(PANTRY_INGREDIENTS);

  win.document.write(`<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PantryAI 🍳</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${mainCssText}
${css}
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--ink); font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; padding:24px; }
.recipe-app { width:100%; max-width:600px; margin:0 auto; transform:none; box-shadow:none; border:none; padding:0; max-height:none; }
.rc-close, .rc-popout { display:none; }
</style>
</head>
<body>
${appHtml}
<script>
const PANTRY_INGREDIENTS=${statePantry};
const RECIPES=${stateRecipes};
let selectedIngredients=new Set(${stateIngredients});
let currentRecipe=null;
${renderPantry.toString()}
${toggleIngredient.toString()}
${selectAllIngredients.toString()}
${clearIngredients.toString()}
${updateCount.toString()}
${generateRecipe.toString()}
${showNoMatch.toString()}
${renderRecipe.toString()}
function showToast(){}
renderPantry();
<\/script>
</body></html>`);
  win.document.close();
  closeRecipe();
  showToast('Popped out! 🚀');
}

/* ── KEYBOARD ──────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('recipeModal').classList.contains('open')) {
    closeRecipe();
  }
});
