/* Eat Me First: fridge finder, illustrated recipe cards, hero art, offline hooks. No dependencies. */
(() => {
'use strict';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);

/* ---------- Data ---------- */
const CATS = [['veg', 'Vegetables & herbs'], ['fruit', 'Fruit'], ['dairy', 'Eggs & dairy'], ['protein', 'Meat, fish & pulses'], ['grain', 'Bread, rice & pasta'], ['jar', 'Jars & tins']];
const ING = [
  ['onion', 'Onion', '🧅', 'veg'], ['garlic', 'Garlic', '🧄', 'veg'], ['tomatoes', 'Tomatoes', '🍅', 'veg'], ['potatoes', 'Potatoes', '🥔', 'veg'],
  ['sweet potato', 'Sweet potato', '🍠', 'veg'], ['carrots', 'Carrots', '🥕', 'veg'], ['spinach', 'Spinach', '🥬', 'veg'], ['cabbage', 'Cabbage', '🥬', 'veg'],
  ['broccoli', 'Broccoli', '🥦', 'veg'], ['mushrooms', 'Mushrooms', '🍄', 'veg'], ['peppers', 'Peppers', '🫑', 'veg'], ['chillies', 'Chillies', '🌶️', 'veg'],
  ['aubergine', 'Aubergine', '🍆', 'veg'], ['cucumber', 'Cucumber', '🥒', 'veg'], ['sweetcorn', 'Sweetcorn', '🌽', 'veg'], ['peas', 'Peas', '🟢', 'veg'],
  ['avocado', 'Avocado', '🥑', 'veg'], ['ginger', 'Ginger', '🫚', 'veg'], ['fresh herbs', 'Fresh herbs', '🌿', 'veg'],
  ['bananas', 'Bananas', '🍌', 'fruit'], ['apples', 'Apples', '🍎', 'fruit'], ['lemons', 'Lemons', '🍋', 'fruit'], ['oranges', 'Oranges', '🍊', 'fruit'],
  ['berries', 'Berries', '🍓', 'fruit'], ['pears', 'Pears', '🍐', 'fruit'],
  ['eggs', 'Eggs', '🥚', 'dairy'], ['milk', 'Milk', '🥛', 'dairy'], ['cheese', 'Cheese', '🧀', 'dairy'], ['yogurt', 'Yogurt', '🥣', 'dairy'], ['butter', 'Butter', '🧈', 'dairy'],
  ['chicken', 'Chicken', '🍗', 'protein'], ['mince', 'Beef mince', '🥩', 'protein'], ['sausages', 'Sausages', '🌭', 'protein'], ['bacon', 'Bacon', '🥓', 'protein'],
  ['tuna', 'Tinned tuna', '🐟', 'protein'], ['salmon', 'Salmon', '🍣', 'protein'], ['prawns', 'Prawns', '🍤', 'protein'], ['tofu', 'Tofu', '⬜', 'protein'],
  ['chickpeas', 'Chickpeas', '🧆', 'protein'], ['beans', 'Beans', '🫘', 'protein'], ['lentils', 'Lentils', '🟤', 'protein'],
  ['bread', 'Bread', '🍞', 'grain'], ['rice', 'Rice', '🍚', 'grain'], ['pasta', 'Pasta', '🍝', 'grain'], ['oats', 'Oats', '🌾', 'grain'],
  ['noodles', 'Noodles', '🍜', 'grain'], ['tortillas', 'Tortillas', '🌮', 'grain'],
  ['peanut butter', 'Peanut butter', '🥜', 'jar'], ['coconut milk', 'Coconut milk', '🥥', 'jar'], ['honey', 'Honey', '🍯', 'jar']
].map(([id, name, e, cat]) => ({ id, name, e, cat }));
const BY_ID = Object.fromEntries(ING.map(i => [i.id, i]));

/* Art helpers: L(kind, count, colour, colour2, size, spread, extras) describes one scattered layer of a plate. */
const L = (k, n, c, c2, s, rad, o = {}) => ({ k, n, c, c2, s, rad, ...o });
const DISC = (c, c2, s, o = {}) => ({ k: 'disc', c, c2, s, n: 1, rad: 0, ...o });

const RECIPES = [
  {
    id: 'potato-omelette', name: 'Potato & onion omelette', time: 35, serves: 2, starter: true,
    ing: ['eggs', 'potatoes', 'onion'], pantry: ['oil', 'salt', 'pepper'],
    steps: [
      'Peel and thinly slice 2 medium potatoes and 1 onion.',
      'Warm 3 tbsp oil in a non-stick frying pan over a medium heat. Add the potatoes and onion with a pinch of salt and cook gently for about 15 minutes, stirring now and then, until soft but not browned.',
      'Beat 4 eggs with salt and pepper. Tip in the potatoes and onion, stir, and leave for 5 minutes so the egg soaks in.',
      'Return the pan to a low heat for 4–5 minutes until the edges set. Slide onto a plate, flip it back into the pan and cook for 2 minutes more.',
      'Rest for 5 minutes, then cut into wedges. Good warm or cold.'
    ],
    art: { table: ['#ecdcbf', '#d5bf98'], vessel: 'plate', layers: [DISC('#f4cf57', '#d99a1c', 84, { squash: .92 }), L('crumb', 16, '#c78a1e', '#c78a1e', 7, 70), L('herb', 12, '#3f8f45', '#2f7a3a', 6, 58), L('round', 14, '#5a4630', '#5a4630', 1.5, 66)] }
  },
  {
    id: 'tomato-garlic-pasta', name: 'Garlic & tomato pasta', time: 20, serves: 2, starter: true,
    ing: ['pasta', 'tomatoes', 'garlic', 'cheese'], pantry: ['oil', 'salt', 'pepper'],
    steps: [
      'Boil 200 g pasta in well-salted water for the time on the packet.',
      'Meanwhile slice 3 cloves of garlic and chop 4 ripe tomatoes (or use a 400 g tin).',
      'Warm 2 tbsp oil in a wide pan. Add the garlic for 30 seconds without letting it brown, then the tomatoes and a pinch of salt.',
      'Simmer for 10 minutes, squashing the tomatoes with the back of a spoon, until saucy.',
      'Drain the pasta, keeping a cupful of the water. Toss the pasta through the sauce with a splash of water, then grate cheese over the top and add pepper.'
    ],
    art: { table: ['#e6d3bd', '#cfae8d'], vessel: 'bowl', layers: [DISC('#e2603f', '#b93a20', 88), L('noodle', 22, '#f2d78a', '#f2d78a', 52, 66), L('slice', 5, '#d93a22', '#f26a4a', 14, 62, { seeds: '#ffd7a8' }), L('leaf', 5, '#2f7d3a', '#5aa75a', 11, 58), L('crumb', 14, '#fbf1cf', '#fbf1cf', 4, 60)] }
  },
  {
    id: 'egg-fried-rice', name: 'Egg fried rice with peas', time: 20, serves: 2, starter: false,
    ing: ['rice', 'eggs', 'peas', 'carrots', 'garlic'], pantry: ['oil', 'soy sauce', 'salt', 'pepper'],
    steps: [
      'Use about 250 g cold cooked rice, ideally cooked the day before and chilled quickly. Break up any clumps with your fingers.',
      'Dice 1 carrot small and mince 2 cloves of garlic. Beat 2 eggs with a pinch of salt.',
      'Heat 1 tbsp oil in a large pan over a high heat. Fry the carrot for 3 minutes, add the garlic for 30 seconds, then push everything to one side.',
      'Pour the eggs into the space and scramble until just set. Add a handful of frozen peas and the rice.',
      'Stir-fry for 4–5 minutes until steaming hot all the way through. Finish with a splash of soy sauce and black pepper.'
    ],
    art: { table: ['#d9d9cf', '#b8baa9'], vessel: 'bowl', layers: [DISC('#f1e3b8', '#d8c07f', 88), L('grain', 90, '#fbf6e4', '#fbf6e4', 5.5, 72), L('crumb', 14, '#f5cb3d', '#f5cb3d', 7, 64), L('cube', 10, '#e8812a', '#f6a14c', 5, 64), L('round', 22, '#6fae45', '#6fae45', 4.4, 70)] }
  },
  {
    id: 'garlic-mushrooms-toast', name: 'Garlic mushrooms on toast', time: 15, serves: 2, starter: false,
    ing: ['bread', 'mushrooms', 'garlic', 'butter'], pantry: ['salt', 'pepper'],
    steps: [
      'Wipe 250 g mushrooms clean and slice them thickly. Mince 2 cloves of garlic.',
      'Melt a knob of butter in a wide pan over a medium-high heat. Add the mushrooms in one layer, season, and leave them alone for 3 minutes so they brown.',
      'Stir, add the garlic and a little more butter, and cook for 2 minutes more.',
      'Toast 2–4 slices of bread and spread with butter.',
      'Pile the mushrooms on the toast with the buttery juices from the pan and plenty of black pepper.'
    ],
    art: { table: ['#e3d6c0', '#c9b894'], vessel: 'board', layers: [L('toast', 2, '#c98a45', '#f0cf93', 54, 0, { pos: [[-62, 4], [66, 8]], sv: 0 }), L('mush', 7, '#b88d5e', '#ead9bb', 17, 40, { at: [-62, 0] }), L('mush', 7, '#b88d5e', '#ead9bb', 17, 40, { at: [66, 4] }), L('herb', 14, '#3f8f45', '#3f8f45', 5, 60, { at: [2, 6] }), L('round', 8, '#f7e7a1', '#f7e7a1', 3, 70, { at: [2, 6] })] }
  },
  {
    id: 'banana-oat-pancakes', name: 'Banana oat pancakes', time: 20, serves: 2, starter: false,
    ing: ['bananas', 'oats', 'eggs', 'milk'], pantry: ['oil', 'cinnamon (optional)'],
    steps: [
      'Mash 2 very ripe bananas in a bowl. Beat in 2 eggs.',
      'Stir in 100 g oats and about 50 ml milk to make a thick, spoonable batter. Add a pinch of cinnamon if you like. Leave it for 5 minutes so the oats soften.',
      'Brush a non-stick pan with a little oil over a medium heat. Spoon in small rounds of batter.',
      'Cook for 2–3 minutes until bubbles appear and the underside is golden, then flip and cook for 2 minutes more.',
      'Stack and top with slices of a third banana, or whatever fruit is going soft.'
    ],
    art: { table: ['#e8d5c0', '#d3b08f'], vessel: 'plate', layers: [DISC('#e3a959', '#bd7a2c', 74, { at: [-8, 8] }), DISC('#e8b468', '#c4852f', 70, { at: [6, -2] }), DISC('#ebbc72', '#c98c35', 64, { at: [-2, -10] }), L('slice', 9, '#f0cf62', '#fbeaa4', 12, 44, { seeds: '#b8903a' }), L('crumb', 14, '#e9d6ac', '#e9d6ac', 4, 66), L('blob', 2, '#7e3f10', '#7e3f10', 17, 40)] }
  },
  {
    id: 'apple-crumble-pots', name: 'Apple & oat crumble pots', time: 30, serves: 2, starter: false,
    ing: ['apples', 'oats', 'butter', 'yogurt'], pantry: ['sugar', 'cinnamon'],
    steps: [
      'Heat the oven to 190°C (170°C fan, gas 5).',
      'Chop 2 apples into small chunks and toss with 1 tbsp sugar, a pinch of cinnamon and a splash of water. Divide between 2 ovenproof cups or ramekins.',
      'Rub 40 g cold butter into 60 g oats and 2 tbsp sugar with your fingertips until clumpy.',
      'Scatter the crumble over the apples and bake for about 20 minutes, until golden on top and bubbling at the edges.',
      'Cool for a few minutes and serve each with a spoonful of yogurt.'
    ],
    art: { table: ['#d8d3c8', '#bdb4a2'], vessel: 'bowl', layers: [DISC('#cf8a37', '#a05f1a', 86), L('crumb', 70, '#e2ad5c', '#d9a24d', 6, 76), L('crumb', 24, '#b7762a', '#b7762a', 5, 74), L('cube', 6, '#e8d27a', '#f6ecb0', 7, 60), DISC('#fffaf0', '#eadfca', 24, { at: [14, -10] })] }
  },
  {
    id: 'chickpea-curry', name: 'Chickpea, tomato & spinach curry', time: 30, serves: 3, starter: false,
    ing: ['chickpeas', 'tomatoes', 'spinach', 'onion', 'garlic'], pantry: ['oil', 'curry powder', 'salt'],
    steps: [
      'Chop 1 onion and 2 cloves of garlic. Warm 2 tbsp oil in a pan and cook the onion for 8 minutes until soft and golden.',
      'Add the garlic and 1–2 tbsp curry powder and stir for 1 minute.',
      'Add 4 chopped tomatoes (or a 400 g tin), a drained 400 g tin of chickpeas, a pinch of salt and a splash of water.',
      'Simmer for 15 minutes, until thick. Add water if it gets too dry.',
      'Stir in 2–3 big handfuls of spinach until wilted. Taste, add salt, and serve with rice or bread.'
    ],
    art: { table: ['#e2cdb5', '#c9a67f'], vessel: 'bowl', layers: [DISC('#d8662c', '#b3431a', 88), L('round', 24, '#e6c27a', '#e6c27a', 8, 70), L('leaf', 6, '#2d6a3a', '#4f9a55', 14, 62), L('crumb', 10, '#f3e3b0', '#f3e3b0', 5, 60), DISC('#fffaf0', '#eee2c8', 15, { at: [20, -18] })] }
  },
  {
    id: 'tuna-bean-pasta-salad', name: 'Tuna, bean & lemon pasta salad', time: 20, serves: 2, starter: false,
    ing: ['pasta', 'tuna', 'beans', 'lemons'], pantry: ['oil', 'salt', 'pepper'],
    steps: [
      'Cook 150 g pasta in salted water, then drain and rinse under cold water to cool it.',
      'Drain a tin of tuna and a tin of white beans.',
      'Whisk the juice of 1 lemon with 3 tbsp oil, salt and pepper to make a dressing.',
      'Toss the pasta, tuna and beans with the dressing. Grate in a little lemon zest if you have it.',
      'Eat straight away, or keep it chilled for lunch the next day.'
    ],
    art: { table: ['#dfe0d2', '#bfc5ac'], vessel: 'bowl', layers: [DISC('#f1e6c4', '#dccfa0', 88), L('penne', 18, '#eacb7a', '#eacb7a', 13, 70), L('round', 20, '#f7eed6', '#f7eed6', 7, 70), L('crumb', 14, '#cda585', '#cda585', 7, 66), L('wedge', 2, '#f2c315', '#fff2a0', 19, 40, { at: [0, 0] }), L('herb', 8, '#3f8f45', '#3f8f45', 5, 62)] }
  },
  {
    id: 'lemon-chicken-traybake', name: 'Lemon chicken traybake', time: 55, serves: 3, starter: false,
    ing: ['chicken', 'lemons', 'potatoes', 'carrots', 'garlic'], pantry: ['oil', 'salt', 'pepper', 'dried herbs'],
    steps: [
      'Heat the oven to 200°C (180°C fan, gas 6).',
      'Cut 500 g potatoes and 2 carrots into chunky pieces. Toss in a large roasting tin with 2 tbsp oil, salt, pepper and a pinch of dried herbs.',
      'Rub 4 chicken thighs or drumsticks with oil, salt and pepper and nestle them among the vegetables, skin side up. Add 4 unpeeled garlic cloves.',
      'Cut 1 lemon into wedges and tuck them in. Roast for 40–45 minutes, turning the vegetables once.',
      'The chicken is done when the skin is golden and the juices run clear, with no pink near the bone. Squeeze the roasted lemon over everything before serving.'
    ],
    art: { table: ['#e0d6c8', '#c2b39b'], vessel: 'tray', layers: [L('cube', 14, '#d9a441', '#eac877', 11, 100, { squash: .62 }), L('slice', 10, '#e8782a', '#f4a04c', 11, 98, { squash: .62 }), L('blob', 4, '#d98f4a', '#d98f4a', 26, 78, { squash: .6 }), L('wedge', 3, '#f2c315', '#fff2a0', 15, 90, { squash: .6 }), L('herb', 12, '#3f8f45', '#3f8f45', 5, 110, { squash: .6 })] }
  },
  {
    id: 'cucumber-yogurt-dip', name: 'Cucumber yogurt dip with toast', time: 10, serves: 2, starter: false,
    ing: ['cucumber', 'yogurt', 'garlic', 'lemons', 'bread'], pantry: ['oil', 'salt', 'pepper', 'dried mint (optional)'],
    steps: [
      'Grate half a cucumber, squeeze out the water with your hands, and put it in a bowl.',
      'Stir in 200 g yogurt, 1 grated or very finely chopped garlic clove, a squeeze of lemon juice and a pinch of salt.',
      'Taste and adjust with more lemon or salt. Spoon into a shallow dish and drizzle with oil. Add a pinch of dried mint if you have it.',
      'Toast 2–3 slices of bread and cut into triangles.',
      'Serve with the toast and the rest of the cucumber cut into sticks.'
    ],
    art: { table: ['#d9d6cc', '#b9b5a6'], vessel: 'board', layers: [L('tri', 5, '#d9a066', '#f0cf93', 36, 0, { pos: [[-92, -52], [-96, 40], [92, -48], [96, 44], [0, -84]], sv: 0 }), DISC('#fbf7ec', '#efe6d0', 66, { rim: '#ffffff' }), L('slice', 8, '#4e8a3c', '#cfe6a8', 11, 44, { seeds: '#a9cc7e' }), L('round', 12, '#d9a21b', '#d9a21b', 3, 48), L('herb', 6, '#2f7a3a', '#2f7a3a', 5, 42)] }
  },
  {
    id: 'stuffed-peppers', name: 'Cheesy stuffed peppers', time: 50, serves: 2, starter: false,
    ing: ['peppers', 'rice', 'tomatoes', 'cheese', 'onion'], pantry: ['oil', 'salt', 'pepper'],
    steps: [
      'Heat the oven to 200°C (180°C fan, gas 6). Halve 2 peppers lengthways and scoop out the seeds. Place cut side up in a baking dish.',
      'Soften 1 chopped onion in 1 tbsp oil for 5 minutes. Add 2 chopped tomatoes and cook for 5 minutes more.',
      'Mix with about 150 g cooked rice, half the grated cheese, salt and pepper.',
      'Spoon the filling into the pepper halves and top with the rest of the cheese.',
      'Bake for 25–30 minutes, until the peppers are soft and the cheese is bubbling and golden.'
    ],
    art: { table: ['#e5cdb6', '#cfa585'], vessel: 'tray', layers: [L('stuffed', 4, '#d73a22', '#e9c98f', 52, 0, { pos: [[-86, -34], [8, -34], [-40, 42], [56, 42]], c3: '#f2c53f' }), L('herb', 12, '#3f8f45', '#3f8f45', 4.5, 120, { squash: .55 })] }
  },
  {
    id: 'beans-cheese-melts', name: 'Beans & cheese melts', time: 15, serves: 2, starter: true,
    ing: ['beans', 'cheese', 'bread', 'tomatoes'], pantry: ['pepper', 'hot sauce (optional)'],
    steps: [
      'Warm a tin of beans in a small pan for 5 minutes, stirring, until thick. Season with pepper.',
      'Toast 2–4 slices of bread on one side under a hot grill.',
      'Turn the bread over. Spoon on the beans, add a few slices of tomato and cover with grated cheese.',
      'Grill for 2–3 minutes until the cheese bubbles and browns in places.',
      'Eat while hot, with hot sauce if you like.'
    ],
    art: { table: ['#e3d3bb', '#c8ac85'], vessel: 'board', layers: [L('toast', 2, '#c98a45', '#f0cf93', 54, 0, { pos: [[-62, 2], [66, 6]], sv: 0 }), L('round', 18, '#b5522a', '#b5522a', 6, 34, { at: [-62, 2] }), L('round', 18, '#b5522a', '#b5522a', 6, 34, { at: [66, 6] }), L('blob', 3, '#f4c542', '#f4c542', 14, 32, { at: [-62, 2] }), L('blob', 3, '#f4c542', '#f4c542', 14, 32, { at: [66, 6] }), L('slice', 3, '#d93a22', '#f26a4a', 11, 36, { at: [-60, 4], seeds: '#ffd7a8' })] }
  },
  {
    id: 'carrot-potato-soup', name: 'Creamy carrot & potato soup', time: 35, serves: 4, starter: false,
    ing: ['carrots', 'potatoes', 'onion', 'milk', 'butter'], pantry: ['stock cube', 'salt', 'pepper'],
    steps: [
      'Chop 1 onion and soften it in a knob of butter in a large pan for 5 minutes.',
      'Add 400 g carrots and 250 g potatoes, peeled and chopped small, and stir for 2 minutes.',
      'Pour in about 800 ml hot water with a stock cube. Simmer for 20 minutes, until the vegetables are very soft.',
      'Blend until smooth with a stick blender (or mash well). Stir in 150 ml milk and warm through gently without boiling.',
      'Season with salt and pepper. Add a little extra butter on top if you fancy it.'
    ],
    art: { table: ['#e0d4c0', '#c4b08e'], vessel: 'bowl', layers: [DISC('#ec9532', '#cf6e16', 90), DISC('#f8d7a0', '#f0b86a', 60, { squash: .5, at: [0, 4] }), L('cube', 6, '#d9a65a', '#efc98a', 8, 56), L('herb', 6, '#3f8f45', '#3f8f45', 5, 48), L('round', 12, '#3b2a1a', '#3b2a1a', 1.6, 60)] }
  },
  {
    id: 'french-toast', name: 'Eggy bread (French toast)', time: 15, serves: 2, starter: true,
    ing: ['bread', 'eggs', 'milk', 'butter'], pantry: ['cinnamon', 'sugar (optional)'],
    steps: [
      'Whisk 2 eggs with 100 ml milk and a pinch of cinnamon in a shallow dish.',
      'Soak 4 slices of slightly stale bread in the mixture for about 30 seconds each side, until soaked but not falling apart.',
      'Melt a knob of butter in a frying pan over a medium heat.',
      'Fry the bread for 2–3 minutes on each side, until golden and cooked through in the middle.',
      'Serve hot with a little sugar or whatever fruit is in the bowl.'
    ],
    art: { table: ['#e6d4bd', '#d1b08e'], vessel: 'plate', layers: [L('toast', 2, '#c27f31', '#ebb865', 64, 0, { pos: [[-26, 8], [20, -6]], sv: 0 }), L('cube', 1, '#fbe38a', '#fff0b0', 17, 0, { pos: [[30, -8]] }), L('blob', 2, '#7e3f10', '#7e3f10', 13, 0, { pos: [[-30, 14], [10, 16]] }), L('crumb', 14, '#fff6e0', '#fff6e0', 3, 70)] }
  },
  {
    id: 'pea-spinach-rice', name: 'Green pea & spinach rice', time: 30, serves: 3, starter: false,
    ing: ['rice', 'peas', 'spinach', 'onion', 'butter', 'cheese'], pantry: ['stock cube', 'salt', 'pepper'],
    steps: [
      'Chop 1 onion and cook it in a knob of butter for 5 minutes until soft.',
      'Stir in 200 g rice for 1 minute, then add 450 ml hot stock and a pinch of salt.',
      'Cover and simmer gently for about 12 minutes, until the rice is nearly tender and the liquid has mostly gone.',
      'Stir in 150 g peas and a few handfuls of spinach. Cover off the heat for 5 minutes so everything cooks through.',
      'Fluff with a fork, stir in grated cheese and plenty of black pepper.'
    ],
    art: { table: ['#d8dccb', '#b6c0a2'], vessel: 'bowl', layers: [DISC('#e6e4b4', '#c4c283', 88), L('grain', 90, '#f7f3d8', '#f7f3d8', 5.5, 74), L('round', 30, '#6fae45', '#6fae45', 5, 72), L('leaf', 8, '#2d6a3a', '#4f9a55', 13, 64), L('crumb', 10, '#fff8e0', '#fff8e0', 4, 62)] }
  },
  {
    id: 'sausage-bean-casserole', name: 'Sausage & bean casserole', time: 40, serves: 3, starter: false,
    ing: ['sausages', 'beans', 'tomatoes', 'onion', 'garlic'], pantry: ['oil', 'salt', 'pepper', 'dried herbs'],
    steps: [
      'Brown 6 sausages in 1 tbsp oil in a wide pan over a medium heat for about 8 minutes. Lift out and slice into chunks.',
      'In the same pan soften 1 chopped onion for 5 minutes, then add 2 chopped garlic cloves for 30 seconds.',
      'Add 4 chopped tomatoes (or a 400 g tin), a drained tin of beans, a pinch of dried herbs and 100 ml water. Return the sausages.',
      'Simmer gently for 20 minutes, until thick. Check the sausages are cooked through with no pink in the middle.',
      'Season and serve with bread or mash.'
    ],
    art: { table: ['#e2cdb5', '#c4a27c'], vessel: 'bowl', layers: [DISC('#c4502a', '#9b3519', 88), L('round', 24, '#f4ead0', '#f4ead0', 7, 70), L('strip', 4, '#8a4a2a', '#a8643c', 22, 54, { sv: .15 }), L('slice', 6, '#e9d3a0', '#fff1c8', 8, 62), L('herb', 8, '#3f8f45', '#3f8f45', 5, 60)] }
  },
  {
    id: 'bacon-egg-avocado-toast', name: 'Bacon, egg & avocado toast', time: 15, serves: 2, starter: false,
    ing: ['bacon', 'eggs', 'avocado', 'bread'], pantry: ['oil', 'salt', 'pepper', 'chilli flakes (optional)'],
    steps: [
      'Fry 4 rashers of bacon in a dry pan over a medium heat for 5–6 minutes, turning once, until crisp. Lift out.',
      'Toast 2 slices of bread. Mash half an avocado per slice with a pinch of salt and pepper and spread it on.',
      'Fry 2 eggs in the bacon fat (add a little oil if the pan is dry) until the whites are set.',
      'Top each toast with an egg and two rashers. Finish with pepper and chilli flakes if you like.'
    ],
    art: { table: ['#e6d8c2', '#cdb28d'], vessel: 'board', layers: [L('toast', 2, '#c98a45', '#f0cf93', 54, 0, { pos: [[-62, 4], [66, 8]], sv: 0 }), L('oval', 3, '#5b8a3a', '#b9d77c', 24, 22, { at: [-62, 2], sv: .15 }), L('blob', 1, '#fffdf5', '#fffdf5', 22, 0, { pos: [[66, 6]] }), L('round', 1, '#f5ae15', '#f5ae15', 9, 0, { pos: [[66, 4]] }), L('strip', 2, '#c4553a', '#f0c0a8', 28, 0, { pos: [[-8, -60], [6, 64]], rot: 6, sv: 0 })] }
  },
  {
    id: 'beef-chilli', name: 'Quick beef chilli', time: 40, serves: 3, starter: false,
    ing: ['mince', 'beans', 'tomatoes', 'onion', 'chillies'], pantry: ['oil', 'salt', 'cumin', 'paprika'],
    steps: [
      'Soften 1 chopped onion in 1 tbsp oil for 5 minutes. Add 1–2 finely chopped chillies (keep the seeds for more heat).',
      'Add 400 g mince and cook over a high heat, breaking it up, until browned.',
      'Stir in 1 tsp each of cumin and paprika, then 4 chopped tomatoes (or a 400 g tin), a drained tin of beans, a pinch of salt and 100 ml water.',
      'Simmer for 25 minutes, stirring now and then, until rich and thick. The mince must be cooked right through.',
      'Serve with rice, a baked potato or tortillas.'
    ],
    art: { table: ['#e0d0bc', '#b99a78'], vessel: 'bowl', layers: [DISC('#a63a1e', '#7a2410', 88), L('crumb', 26, '#5a2f1b', '#5a2f1b', 8, 66), L('round', 20, '#8c2b1c', '#8c2b1c', 7, 68), L('slice', 6, '#2f8f3a', '#d9ec9c', 8, 60), DISC('#fffaf0', '#eee2c8', 15, { at: [22, -20] })] }
  },
  {
    id: 'spaghetti-bolognese', name: 'Easy spaghetti bolognese', time: 45, serves: 3, starter: false,
    ing: ['pasta', 'mince', 'tomatoes', 'onion', 'carrots', 'garlic'], pantry: ['oil', 'salt', 'pepper', 'dried herbs'],
    steps: [
      'Finely chop 1 onion and 1 carrot. Cook them in 1 tbsp oil for 8 minutes until soft, adding 2 chopped garlic cloves at the end.',
      'Add 400 g mince and brown it over a high heat, breaking it up.',
      'Stir in 5 chopped tomatoes (or a 400 g tin), a pinch of dried herbs, salt and pepper, and 150 ml water.',
      'Simmer for 30 minutes, until thick and rich. Make sure the mince is cooked through.',
      'Boil 250 g pasta in salted water, drain, and toss with the sauce.'
    ],
    art: { table: ['#e8d6c0', '#cfa985'], vessel: 'plate', layers: [L('noodle', 26, '#f2d78a', '#f2d78a', 56, 80, { squash: .9 }), DISC('#c4482a', '#8f2c16', 46, { at: [0, 2] }), L('crumb', 14, '#5a2f1b', '#5a2f1b', 6, 36, { at: [0, 2] }), L('leaf', 3, '#2f7d3a', '#5aa75a', 10, 30, { at: [0, 0] }), L('crumb', 10, '#fbf1cf', '#fbf1cf', 4, 40, { at: [0, 2] })] }
  },
  {
    id: 'coconut-lentil-dal', name: 'Coconut lentil dal', time: 35, serves: 3, starter: false,
    ing: ['lentils', 'coconut milk', 'onion', 'garlic', 'spinach'], pantry: ['oil', 'salt', 'curry powder or turmeric & cumin'],
    steps: [
      'Rinse 200 g red lentils. Chop 1 onion and 2 garlic cloves.',
      'Soften the onion in 1 tbsp oil for 5 minutes, then add the garlic and 1–2 tsp curry powder for 1 minute.',
      'Add the lentils, a 400 ml tin of coconut milk, 300 ml water and a pinch of salt. Simmer for 20 minutes, stirring often, until soft and thick.',
      'Stir in a few handfuls of spinach until wilted. Add water if it is too thick.',
      'Serve with rice, bread or on its own.'
    ],
    art: { table: ['#e4cfa8', '#c9a56a'], vessel: 'bowl', layers: [DISC('#e8a63a', '#c47d1a', 88), L('round', 34, '#b9701f', '#b9701f', 3.2, 70), DISC('#fffaf0', '#efe4cc', 34, { squash: .5, at: [0, 0] }), L('leaf', 6, '#2d6a3a', '#4f9a55', 13, 62), L('herb', 6, '#3f8f45', '#3f8f45', 5, 58)] }
  },
  {
    id: 'sweet-potato-tacos', name: 'Sweet potato & black bean tacos', time: 40, serves: 2, starter: false,
    ing: ['sweet potato', 'beans', 'tortillas', 'avocado', 'cheese'], pantry: ['oil', 'salt', 'paprika or cumin'],
    steps: [
      'Heat the oven to 200°C (180°C fan, gas 6). Cut 1 large sweet potato into small cubes, toss with 1 tbsp oil, salt and a pinch of paprika, and roast for 25 minutes.',
      'Warm a drained tin of beans in a pan with a splash of water and a pinch of salt.',
      'Mash an avocado with salt. Warm the tortillas in a dry pan for 30 seconds each side.',
      'Fill the tortillas with sweet potato, beans and avocado, then scatter with grated cheese.'
    ],
    art: { table: ['#dfd2bd', '#bfa57e'], vessel: 'plate', layers: [DISC('#f0dcb0', '#d9bd84', 60, { at: [-46, 0] }), DISC('#f0dcb0', '#d9bd84', 60, { at: [48, 6] }), L('cube', 8, '#e9892f', '#f4ad5a', 6, 34, { at: [-46, 0] }), L('round', 14, '#3a2a22', '#3a2a22', 4.5, 32, { at: [-46, 0] }), L('oval', 3, '#5b8a3a', '#b9d77c', 12, 26, { at: [-46, 0] }), L('cube', 8, '#e9892f', '#f4ad5a', 6, 34, { at: [48, 6] }), L('round', 14, '#3a2a22', '#3a2a22', 4.5, 32, { at: [48, 6] }), L('oval', 3, '#5b8a3a', '#b9d77c', 12, 26, { at: [48, 6] }), L('crumb', 10, '#f4c542', '#f4c542', 3.5, 50, { at: [0, 4] })] }
  },
  {
    id: 'tofu-noodle-stir-fry', name: 'Tofu & veg noodle stir-fry', time: 25, serves: 2, starter: false,
    ing: ['tofu', 'noodles', 'broccoli', 'carrots', 'garlic', 'ginger'], pantry: ['oil', 'soy sauce', 'pepper'],
    steps: [
      'Press 200 g tofu between paper towels for 10 minutes, then cut into cubes. Cook the noodles as the packet says, then drain.',
      'Fry the tofu in 1 tbsp oil over a high heat for 6–8 minutes until golden on most sides. Lift out.',
      'In the same pan stir-fry a sliced carrot and a handful of broccoli florets for 4 minutes. Add 2 chopped garlic cloves and a thumb of grated ginger for 30 seconds.',
      'Return the tofu, add the noodles and 2 tbsp soy sauce, and toss for 2 minutes until hot.'
    ],
    art: { table: ['#dcdccc', '#b7b89f'], vessel: 'bowl', layers: [DISC('#d9b26a', '#b88a3c', 88), L('noodle', 22, '#efd9a0', '#efd9a0', 52, 66), L('cube', 9, '#f2e4bd', '#fbf3d7', 9, 62), L('floret', 6, '#3f8f45', '#6bb35a', 11, 58), L('slice', 8, '#e8782a', '#f4a04c', 8, 64), L('round', 16, '#fffaf0', '#fffaf0', 1.5, 70)] }
  },
  {
    id: 'garlic-prawn-noodles', name: 'Garlic prawn noodles', time: 20, serves: 2, starter: false,
    ing: ['prawns', 'noodles', 'garlic', 'chillies', 'peppers'], pantry: ['oil', 'soy sauce', 'salt'],
    steps: [
      'Cook the noodles as the packet says, drain and rinse briefly. Slice 1 pepper into strips and finely chop 3 garlic cloves and 1 chilli.',
      'Heat 1 tbsp oil in a wide pan over a high heat. Stir-fry the pepper for 3 minutes.',
      'Add 200 g raw prawns and cook for 2–3 minutes, until pink and opaque all the way through. Add the garlic and chilli for the last 30 seconds.',
      'Tip in the noodles with 2 tbsp soy sauce and toss until hot.'
    ],
    art: { table: ['#d8dacb', '#b2b8a0'], vessel: 'bowl', layers: [DISC('#e9cf8e', '#c9a85a', 88), L('noodle', 22, '#f6e3a8', '#f6e3a8', 52, 66), L('prawn', 6, '#f08a5d', '#f6b08c', 15, 58), L('strip', 6, '#d9372a', '#e8563c', 14, 62), L('slice', 4, '#c41e1e', '#f4b07a', 6, 58), L('crumb', 10, '#fff4d0', '#fff4d0', 4, 60)] }
  },
  {
    id: 'lemon-baked-salmon', name: 'Lemon baked salmon & broccoli', time: 30, serves: 2, starter: false,
    ing: ['salmon', 'lemons', 'broccoli', 'potatoes'], pantry: ['oil', 'salt', 'pepper'],
    steps: [
      'Heat the oven to 200°C (180°C fan, gas 6). Cut 300 g potatoes into small chunks, toss with oil and salt, and roast for 15 minutes.',
      'Add the broccoli florets to the tin, and place 2 salmon fillets on top with a drizzle of oil, salt, pepper and a few lemon slices.',
      'Roast for 12–15 minutes, until the salmon flakes easily and is opaque all the way through.',
      'Squeeze over lemon juice and serve straight from the tin.'
    ],
    art: { table: ['#dbd6ca', '#bcb29c'], vessel: 'tray', layers: [L('cube', 9, '#d9a441', '#eac877', 11, 100, { squash: .62 }), L('floret', 8, '#3f8f45', '#6bb35a', 13, 98, { squash: .62 }), L('blob', 2, '#f08a5a', '#f08a5a', 30, 0, { pos: [[-48, -4], [52, 8]] }), L('wedge', 4, '#f2c315', '#fff2a0', 14, 92, { squash: .6 }), L('herb', 8, '#3f8f45', '#3f8f45', 4.5, 110, { squash: .6 })] }
  },
  {
    id: 'aubergine-tomato-bake', name: 'Aubergine & tomato bake', time: 55, serves: 3, starter: false,
    ing: ['aubergine', 'tomatoes', 'cheese', 'garlic', 'fresh herbs'], pantry: ['oil', 'salt', 'pepper'],
    steps: [
      'Heat the oven to 200°C (180°C fan, gas 6). Slice 2 aubergines into rounds, brush with oil on both sides, and roast on a tray for 20 minutes, turning once.',
      'Meanwhile chop 4 tomatoes and 2 garlic cloves and simmer with a pinch of salt for 10 minutes into a rough sauce.',
      'In a baking dish layer sauce, aubergine and a handful of torn herbs, finishing with sauce.',
      'Cover with grated cheese and bake for 20 minutes, until bubbling and golden.'
    ],
    art: { table: ['#e3cfba', '#c7a083'], vessel: 'tray', layers: [L('slice', 14, '#4a2a5a', '#e7e1b8', 17, 96, { squash: .6 }), L('slice', 8, '#d93a22', '#f26a4a', 12, 96, { squash: .6, seeds: '#ffd7a8' }), L('blob', 8, '#f4c542', '#f4c542', 11, 98, { squash: .6 }), L('leaf', 12, '#2f7d3a', '#5aa75a', 8, 110, { squash: .6 })] }
  },
  {
    id: 'broccoli-cheese-soup', name: 'Broccoli & cheese soup', time: 30, serves: 3, starter: false,
    ing: ['broccoli', 'potatoes', 'cheese', 'onion', 'milk'], pantry: ['oil', 'stock cube', 'salt', 'pepper'],
    steps: [
      'Soften 1 chopped onion in 1 tbsp oil for 5 minutes. Add 2 chopped potatoes and 1 stock cube dissolved in 600 ml water.',
      'Simmer for 10 minutes, then add 1 large head of broccoli in florets (stalk too, chopped) and cook for 8 minutes more.',
      'Blend until smooth. Stir in 100 ml milk and a handful of grated cheese until melted.',
      'Season and serve with more cheese on top.'
    ],
    art: { table: ['#dde0cf', '#b9c1a2'], vessel: 'bowl', layers: [DISC('#9fc06a', '#6e9a3a', 90), DISC('#f8f1d8', '#ead9a8', 42, { squash: .5 }), L('floret', 4, '#3f8f45', '#6bb35a', 10, 44), L('crumb', 8, '#f4c542', '#f4c542', 4, 52), L('round', 10, '#2a2a2a', '#2a2a2a', 1.4, 60)] }
  },
  {
    id: 'sweetcorn-fritters', name: 'Sweetcorn fritters', time: 20, serves: 2, starter: false,
    ing: ['sweetcorn', 'eggs', 'milk', 'fresh herbs'], pantry: ['flour', 'oil', 'salt', 'pepper'],
    steps: [
      'Whisk 2 eggs with 3 tbsp milk. Stir in 5 tbsp flour, salt and pepper to make a thick batter.',
      'Fold in a tin of drained sweetcorn (or 150 g frozen, thawed) and a handful of chopped herbs.',
      'Heat a little oil in a frying pan over a medium heat. Drop in spoonfuls of batter and flatten slightly.',
      'Cook for 2–3 minutes on each side until golden and set in the middle. Serve warm.'
    ],
    art: { table: ['#e8dcc4', '#d2bf96'], vessel: 'plate', layers: [DISC('#e8b73a', '#c88f1a', 36, { at: [-42, -14] }), DISC('#e8b73a', '#c88f1a', 36, { at: [38, -18] }), DISC('#e8b73a', '#c88f1a', 36, { at: [0, 36] }), L('round', 9, '#f6d23a', '#f6d23a', 3.4, 26, { at: [-42, -14] }), L('round', 9, '#f6d23a', '#f6d23a', 3.4, 26, { at: [38, -18] }), L('round', 9, '#f6d23a', '#f6d23a', 3.4, 26, { at: [0, 36] }), L('herb', 8, '#3f8f45', '#3f8f45', 5, 70)] }
  },
  {
    id: 'peanut-noodles', name: 'Peanut butter noodles', time: 15, serves: 2, starter: false,
    ing: ['noodles', 'peanut butter', 'carrots', 'cucumber', 'chillies'], pantry: ['soy sauce', 'warm water'],
    steps: [
      'Cook the noodles as the packet says, drain, and rinse under cold water.',
      'Stir 3 tbsp peanut butter with 2 tbsp soy sauce and 3–4 tbsp warm water until it makes a smooth, pourable sauce. Add a finely chopped chilli.',
      'Cut the carrot and cucumber into thin sticks.',
      'Toss the noodles with the sauce and vegetables. Eat warm or cold.'
    ],
    art: { table: ['#e0d6c6', '#c4ae8a'], vessel: 'bowl', layers: [DISC('#c98a4a', '#9a5f26', 88), L('noodle', 22, '#f2d78a', '#f2d78a', 52, 66), L('strip', 8, '#e8782a', '#f4a04c', 14, 62), L('slice', 8, '#4e8a3c', '#cfe6a8', 9, 62), L('round', 20, '#d9a96a', '#d9a96a', 4.2, 62), L('slice', 3, '#c41e1e', '#f4b07a', 6, 54)] }
  },
  {
    id: 'sweet-potato-coconut-curry', name: 'Sweet potato & coconut curry', time: 40, serves: 3, starter: false,
    ing: ['sweet potato', 'coconut milk', 'chickpeas', 'spinach', 'ginger', 'onion'], pantry: ['oil', 'salt', 'curry powder'],
    steps: [
      'Soften 1 chopped onion in 1 tbsp oil for 5 minutes. Add a thumb of grated ginger and 1–2 tbsp curry powder for 1 minute.',
      'Add 1 large sweet potato in small cubes, a drained tin of chickpeas, a 400 ml tin of coconut milk, 100 ml water and a pinch of salt.',
      'Simmer for 20 minutes, until the sweet potato is tender and the sauce has thickened.',
      'Stir in a few handfuls of spinach until wilted. Serve with rice or bread.'
    ],
    art: { table: ['#e4cfb0', '#c8a068'], vessel: 'bowl', layers: [DISC('#e9a23a', '#c47a14', 88), L('cube', 10, '#e9892f', '#f4ad5a', 9, 66), L('round', 16, '#e6c27a', '#e6c27a', 7, 66), L('leaf', 6, '#2d6a3a', '#4f9a55', 13, 62), DISC('#fffaf0', '#efe4cc', 16, { at: [20, -18] })] }
  },
  {
    id: 'cabbage-bacon-fry', name: 'Cabbage, bacon & potato fry-up', time: 25, serves: 2, starter: false,
    ing: ['cabbage', 'bacon', 'potatoes', 'onion'], pantry: ['oil', 'salt', 'pepper'],
    steps: [
      'Dice 2 potatoes small and boil for 6 minutes until just tender. Drain well.',
      'Fry 4 chopped rashers of bacon in a large pan until crisp. Add 1 sliced onion and cook for 5 minutes in the bacon fat.',
      'Add the potatoes and cook for 5 minutes until golden, then add a few handfuls of shredded cabbage.',
      'Stir-fry for 4–5 minutes until the cabbage wilts and the edges catch. Season well.'
    ],
    art: { table: ['#d9d6cb', '#b2ae9d'], vessel: 'pan', layers: [L('strip', 40, '#9cc46f', '#cfe3a8', 14, 96, { squash: .95, sv: .3 }), L('cube', 10, '#e8cf86', '#f6e8b4', 9, 92), L('strip', 6, '#b0402e', '#e49c88', 22, 90, { sv: .2 }), L('slice', 5, '#e9d3a0', '#fff1c8', 8, 90)] }
  },
  {
    id: 'cabbage-apple-slaw', name: 'Crunchy cabbage & apple slaw', time: 15, serves: 3, starter: false,
    ing: ['cabbage', 'carrots', 'apples', 'yogurt', 'lemons'], pantry: ['salt', 'pepper'],
    steps: [
      'Shred a quarter of a cabbage finely. Grate 2 carrots and cut 1 apple into thin matchsticks.',
      'Stir 4 tbsp yogurt with the juice of half a lemon, salt and pepper.',
      'Toss everything together and leave for 10 minutes so the cabbage softens a little.',
      'Taste and add more lemon or salt. Good with sausages, burgers or baked potatoes.'
    ],
    art: { table: ['#dde2cd', '#b8c4a0'], vessel: 'bowl', layers: [DISC('#f3efe0', '#e3dcc0', 88), L('strip', 50, '#bcd98a', '#e1f0bb', 14, 70), L('strip', 24, '#e8782a', '#f4a04c', 10, 68), L('cube', 8, '#e8e2a0', '#f6f1c8', 5, 66), L('wedge', 2, '#f2c315', '#fff2a0', 13, 50)] }
  },
  {
    id: 'chicken-avocado-wraps', name: 'Chicken & avocado wraps', time: 15, serves: 2, starter: false,
    ing: ['chicken', 'tortillas', 'avocado', 'cucumber', 'yogurt'], pantry: ['salt', 'pepper'],
    steps: [
      'Shred or slice about 200 g cooked chicken (leftover roast chicken is ideal).',
      'Mash an avocado with a pinch of salt and pepper. Stir 2 tbsp yogurt into the chicken.',
      'Warm 2 tortillas in a dry pan for 20 seconds each side. Spread with avocado.',
      'Add the chicken and cucumber sticks, fold in the sides and roll up tightly. Cut in half.'
    ],
    art: { table: ['#e2d6c0', '#c8b08a'], vessel: 'board', layers: [L('strip', 2, '#efd9a8', '#f6e6c0', 74, 0, { pos: [[0, -38], [0, 36]], rot: 3, sv: 0 }), L('oval', 3, '#5b8a3a', '#b9d77c', 14, 12, { at: [0, -38] }), L('slice', 6, '#4e8a3c', '#cfe6a8', 8, 60, { at: [0, 0], squash: .35 }), L('crumb', 6, '#e6d3b0', '#e6d3b0', 5, 60, { at: [0, 0], squash: .4 })] }
  },
  {
    id: 'orange-honey-porridge', name: 'Orange & honey porridge', time: 10, serves: 1, starter: false,
    ing: ['oats', 'milk', 'oranges', 'honey'], pantry: ['salt (a pinch)', 'water'],
    steps: [
      'Put 50 g oats, 150 ml milk, 100 ml water and a pinch of salt in a small pan.',
      'Cook over a medium heat for 5 minutes, stirring, until thick and creamy.',
      'Peel an orange and cut it into segments, catching any juice.',
      'Pour the porridge into a bowl, top with the orange and a drizzle of honey.'
    ],
    art: { table: ['#e8dcc6', '#d1b992'], vessel: 'bowl', layers: [DISC('#e3d3b0', '#c8b27e', 88), L('crumb', 20, '#d8c08a', '#d8c08a', 4, 70), L('wedge', 5, '#f28c1c', '#ffd37a', 13, 54), L('blob', 1, '#e0a020', '#e0a020', 16, 0, { pos: [[14, -8]] })] }
  },
  {
    id: 'berry-yogurt-pots', name: 'Berry oat yogurt pots', time: 5, serves: 2, starter: false,
    ing: ['berries', 'yogurt', 'oats', 'honey'], pantry: [],
    steps: [
      'Toast 3 tbsp oats in a dry pan for 2–3 minutes until they smell nutty. Let them cool.',
      'Spoon yogurt into 2 glasses or bowls.',
      'Top with a handful of berries each, crushing a few with a fork so the juice runs.',
      'Scatter over the oats and finish with a drizzle of honey.'
    ],
    art: { table: ['#e3dbd0', '#c9b9a6'], vessel: 'bowl', layers: [DISC('#fbf7ec', '#efe6d0', 88), L('round', 14, '#c2185b', '#c2185b', 8, 64), L('round', 10, '#3b3b7a', '#3b3b7a', 6.5, 64), L('crumb', 16, '#d8b070', '#d8b070', 4, 66), L('blob', 2, '#e0a020', '#e0a020', 12, 40)] }
  },
  {
    id: 'honey-baked-pears', name: 'Honey baked pears with oats', time: 30, serves: 2, starter: false,
    ing: ['pears', 'honey', 'oats', 'butter'], pantry: ['cinnamon'],
    steps: [
      'Heat the oven to 190°C (170°C fan, gas 5). Halve 2 pears and scoop out the cores.',
      'Place the halves cut side up in a baking dish. Fill each hollow with a little butter, a drizzle of honey and a pinch of cinnamon.',
      'Mix 3 tbsp oats with 1 tbsp honey and a little melted butter. Pile it onto the pears.',
      'Bake for 20–25 minutes, until the pears are soft and the oats golden.'
    ],
    art: { table: ['#e0d6c4', '#c4b08c'], vessel: 'plate', layers: [L('slice', 2, '#c9a24a', '#f2e2a0', 44, 0, { pos: [[-44, 0], [44, 8]], sv: 0, seeds: '#5a3a1a' }), L('crumb', 30, '#d8b070', '#d8b070', 5, 60), L('blob', 2, '#e0a020', '#e0a020', 12, 0, { pos: [[-44, 0], [44, 8]] })] }
  },
  {
    id: 'peanut-banana-toast', name: 'Peanut butter & banana toast', time: 5, serves: 1, starter: false,
    ing: ['bananas', 'peanut butter', 'bread', 'honey'], pantry: [],
    steps: [
      'Toast 2 slices of bread until golden.',
      'Spread each generously with peanut butter.',
      'Slice a banana and arrange it on top.',
      'Finish with a thin drizzle of honey. Eat straight away.'
    ],
    art: { table: ['#e6d6c0', '#d0b08c'], vessel: 'board', layers: [L('toast', 2, '#c98a45', '#f0cf93', 54, 0, { pos: [[-62, 2], [66, 6]], sv: 0 }), L('blob', 2, '#c98a4a', '#c98a4a', 24, 0, { pos: [[-62, 2], [66, 6]] }), L('slice', 8, '#f0cf62', '#fbeaa4', 11, 34, { at: [-62, 2] }), L('slice', 8, '#f0cf62', '#fbeaa4', 11, 34, { at: [66, 6] }), L('blob', 2, '#e0a020', '#e0a020', 8, 0, { pos: [[-50, -4], [76, 10]] })] }
  },
  {
    id: 'herby-potato-salad', name: 'Herby potato salad', time: 25, serves: 3, starter: false,
    ing: ['potatoes', 'fresh herbs', 'yogurt', 'lemons'], pantry: ['salt', 'pepper'],
    steps: [
      'Cut 500 g potatoes into even chunks and boil in salted water for 12–15 minutes, until just tender. Drain and cool for 10 minutes.',
      'Stir 4 tbsp yogurt with the juice of half a lemon, salt and pepper.',
      'Chop a generous handful of herbs and fold through the potatoes and dressing.',
      'Taste, add more lemon or salt, and serve warm or cold.'
    ],
    art: { table: ['#e0dccb', '#bfb899'], vessel: 'bowl', layers: [DISC('#f3ecd2', '#dccf9a', 88), L('cube', 16, '#e8cf86', '#f6e8b4', 12, 66), L('herb', 22, '#3f8f45', '#3f8f45', 6, 70), L('crumb', 8, '#ffffff', '#ffffff', 5, 62), L('wedge', 1, '#f2c315', '#fff2a0', 14, 0, { pos: [[58, -40]] })] }
  },
  {
    id: 'mushroom-herb-omelette', name: 'Mushroom & herb omelette', time: 15, serves: 1, starter: false,
    ing: ['mushrooms', 'eggs', 'cheese', 'fresh herbs'], pantry: ['butter or oil', 'salt', 'pepper'],
    steps: [
      'Slice 100 g mushrooms and fry in a little oil or butter over a high heat for 4–5 minutes until golden. Season and tip out.',
      'Beat 3 eggs with salt and pepper. Melt a little butter in the pan over a medium heat and pour in the eggs.',
      'Stir gently for 30 seconds, then leave to set for 1 minute. Scatter on the mushrooms, cheese and chopped herbs.',
      'Fold in half, cook for 30 seconds more and slide onto a plate. The egg should be cooked through.'
    ],
    art: { table: ['#e5d8c1', '#cdb48c'], vessel: 'plate', layers: [DISC('#f4cf57', '#d99a1c', 84, { squash: .85 }), L('mush', 6, '#b88d5e', '#ead9bb', 14, 50), L('herb', 14, '#3f8f45', '#3f8f45', 5, 56), L('crumb', 6, '#fff2b0', '#fff2b0', 5, 50)] }
  },
  {
    id: 'tuna-sweetcorn-cakes', name: 'Tuna & sweetcorn potato cakes', time: 35, serves: 3, starter: false,
    ing: ['tuna', 'potatoes', 'sweetcorn', 'eggs', 'fresh herbs'], pantry: ['flour', 'oil', 'salt', 'pepper'],
    steps: [
      'Boil 400 g potatoes until soft, drain well and mash with salt and pepper. Let it steam dry for 5 minutes.',
      'Mix in a drained tin of tuna, a handful of sweetcorn, chopped herbs and 1 beaten egg.',
      'Shape into 6 patties and dust lightly with flour.',
      'Fry in a little oil over a medium heat for 4 minutes each side, until golden and hot all the way through.'
    ],
    art: { table: ['#e0d6c4', '#c2b08e'], vessel: 'plate', layers: [DISC('#d9a441', '#a8741a', 34, { at: [-42, -14] }), DISC('#d9a441', '#a8741a', 34, { at: [40, -16] }), DISC('#d9a441', '#a8741a', 34, { at: [0, 38] }), L('round', 7, '#f6d23a', '#f6d23a', 3, 22, { at: [-42, -14] }), L('round', 7, '#f6d23a', '#f6d23a', 3, 22, { at: [40, -16] }), L('round', 7, '#f6d23a', '#f6d23a', 3, 22, { at: [0, 38] }), L('herb', 8, '#3f8f45', '#3f8f45', 5, 70), L('wedge', 1, '#f2c315', '#fff2a0', 14, 0, { pos: [[82, 44]] })] }
  },
  {
    id: 'sausage-pepper-traybake', name: 'Sausage & pepper traybake', time: 45, serves: 3, starter: false,
    ing: ['sausages', 'peppers', 'onion', 'potatoes'], pantry: ['oil', 'salt', 'pepper', 'dried herbs'],
    steps: [
      'Heat the oven to 200°C (180°C fan, gas 6). Cut 500 g potatoes into chunks, 2 peppers into strips and 2 onions into wedges.',
      'Toss the vegetables with 2 tbsp oil, salt, pepper and dried herbs in a large roasting tin.',
      'Nestle 6 sausages among the vegetables.',
      'Roast for 35–40 minutes, turning everything once, until the sausages are browned and cooked through with no pink inside.'
    ],
    art: { table: ['#e0d4c2', '#c2ac88'], vessel: 'tray', layers: [L('cube', 10, '#d9a441', '#eac877', 10, 100, { squash: .62 }), L('strip', 12, '#d93a22', '#e8563c', 14, 100, { squash: .62 }), L('slice', 8, '#a8508a', '#e9c9dc', 12, 100, { squash: .62 }), L('strip', 5, '#8a4a2a', '#a8643c', 26, 94, { squash: .6, sv: .15 }), L('herb', 8, '#3f8f45', '#3f8f45', 4.5, 110, { squash: .6 })] }
  }
];

/* ---------- Illustrations: top-down "photo" style, drawn from ingredient shapes ---------- */
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed) => { let s = seed || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; };
const f = (n) => Math.round(n * 10) / 10;

const shape = {
  round: (o) => `<circle r="${o.s}" fill="${o.c}"/><circle cx="${f(-o.s * .3)}" cy="${f(-o.s * .35)}" r="${f(o.s * .36)}" fill="#fff" opacity=".3"/>`,
  grain: (o) => `<ellipse rx="${o.s}" ry="${f(o.s * .4)}" fill="${o.c}"/><ellipse cx="${f(-o.s * .2)}" cy="${f(-o.s * .12)}" rx="${f(o.s * .45)}" ry="${f(o.s * .1)}" fill="#fff" opacity=".5"/>`,
  slice: (o) => `<circle r="${o.s}" fill="${o.c}"/><circle r="${f(o.s * .84)}" fill="${o.c2}"/>` + (o.seeds ? [0, 1, 2, 3, 4].map(i => `<ellipse cx="${f(Math.cos(i * 1.2566) * o.s * .5)}" cy="${f(Math.sin(i * 1.2566) * o.s * .5)}" rx="${f(o.s * .1)}" ry="${f(o.s * .17)}" fill="${o.seeds}" transform="rotate(${i * 72} ${f(Math.cos(i * 1.2566) * o.s * .5)} ${f(Math.sin(i * 1.2566) * o.s * .5)})"/>`).join('') : '') + `<circle r="${f(o.s * .84)}" fill="none" stroke="#fff" stroke-opacity=".35"/>`,
  wedge: (o) => `<circle r="${o.s}" fill="${o.c}"/><circle r="${f(o.s * .86)}" fill="${o.c2}"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="0" y1="0" x2="${f(Math.cos(i * .7854) * o.s * .82)}" y2="${f(Math.sin(i * .7854) * o.s * .82)}" stroke="${o.c}" stroke-width="1.2" opacity=".75"/>`).join('') + `<circle r="${f(o.s * .1)}" fill="#fff8c8"/>`,
  leaf: (o) => { const s = o.s; return `<path d="M0 ${-s} C ${f(s * .85)} ${f(-s * .6)} ${f(s * .85)} ${f(s * .5)} 0 ${s} C ${f(-s * .85)} ${f(s * .5)} ${f(-s * .85)} ${f(-s * .6)} 0 ${-s}Z" fill="${o.c}"/><path d="M0 ${-s} L0 ${s}" stroke="${o.c2}" stroke-width="1.4" opacity=".8"/><path d="M0 ${f(-s * .2)} L${f(s * .4)} ${f(-s * .5)} M0 ${f(s * .2)} L${f(-s * .4)} ${f(-s * .1)}" stroke="${o.c2}" stroke-width="1" opacity=".6"/>`; },
  herb: (o) => `<ellipse cx="${o.s * .5}" rx="${o.s}" ry="${f(o.s * .5)}" fill="${o.c}"/><ellipse cx="${f(-o.s * .5)}" rx="${o.s}" ry="${f(o.s * .5)}" fill="${o.c}" transform="rotate(50)"/>`,
  cube: (o) => `<rect x="${-o.s}" y="${f(-o.s + 2)}" width="${o.s * 2}" height="${o.s * 2}" rx="${f(o.s * .25)}" fill="${o.c}"/><rect x="${-o.s}" y="${-o.s}" width="${o.s * 2}" height="${o.s * 2}" rx="${f(o.s * .25)}" fill="${o.c2}"/><rect x="${f(-o.s * .6)}" y="${f(-o.s * .6)}" width="${f(o.s * .7)}" height="${f(o.s * .35)}" rx="2" fill="#fff" opacity=".28"/>`,
  crumb: (o) => `<path d="M${-o.s} 0 L${f(-o.s * .3)} ${-o.s} L${o.s} ${f(-o.s * .2)} L${f(o.s * .5)} ${o.s} L${f(-o.s * .5)} ${f(o.s * .6)}Z" fill="${o.c}" stroke="${o.c}" stroke-width="2" stroke-linejoin="round"/>`,
  penne: (o) => `<rect x="${-o.s}" y="${f(-o.s * .42)}" width="${o.s * 2}" height="${f(o.s * .84)}" rx="${f(o.s * .38)}" fill="${o.c}"/><path d="M${f(-o.s * .6)} ${f(-o.s * .2)}H${f(o.s * .6)}M${f(-o.s * .6)} 0H${f(o.s * .6)}M${f(-o.s * .6)} ${f(o.s * .2)}H${f(o.s * .6)}" stroke="#b8923f" stroke-width="1" opacity=".5"/><ellipse cx="${f(o.s * .85)}" rx="${f(o.s * .12)}" ry="${f(o.s * .3)}" fill="#c9a54f" opacity=".7"/>`,
  noodle: (o) => `<path d="M${-o.s} 0 q${f(o.s * .5)} ${f(-o.s * .55)} ${o.s} 0 t${o.s} 0" fill="none" stroke="${o.c}" stroke-width="4.6" stroke-linecap="round"/><path d="M${-o.s} -1.2 q${f(o.s * .5)} ${f(-o.s * .55)} ${o.s} 0 t${o.s} 0" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.5" stroke-linecap="round"/>`,
  mush: (o) => `<path d="M${-o.s} 0 C ${-o.s} ${f(-o.s * 1.05)} ${o.s} ${f(-o.s * 1.05)} ${o.s} 0Z" fill="${o.c}"/><path d="M${f(-o.s * .3)} 0 L${f(-o.s * .26)} ${f(o.s * .8)} Q0 ${f(o.s * .95)} ${f(o.s * .26)} ${f(o.s * .8)} L${f(o.s * .3)} 0Z" fill="${o.c2}"/><path d="M${f(-o.s * .6)} ${f(-o.s * .5)} q${f(o.s * .5)} ${f(-o.s * .3)} ${f(o.s * 1)} 0" stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none"/>`,
  toast: (o) => { const w = o.s, h = o.s * .84; return `<path d="M${-w} ${h} V${f(-h * .3)} C${-w} ${f(-h * 1.2)} ${f(-w * .3)} ${f(-h * 1.15)} 0 ${f(-h * 1.1)} C${f(w * .3)} ${f(-h * 1.15)} ${w} ${f(-h * 1.2)} ${w} ${f(-h * .3)} V${h}Z" fill="${o.c}"/><path d="M${f(-w * .86)} ${f(h * .86)} V${f(-h * .28)} C${f(-w * .86)} ${f(-h * 1.0)} ${f(-w * .28)} ${f(-h * .98)} 0 ${f(-h * .95)} C${f(w * .28)} ${f(-h * .98)} ${f(w * .86)} ${f(-h * 1.0)} ${f(w * .86)} ${f(-h * .28)} V${f(h * .86)}Z" fill="${o.c2}"/><circle cx="${f(-w * .3)}" cy="${f(-h * .2)}" r="2" fill="#c99a52" opacity=".5"/><circle cx="${f(w * .35)}" cy="${f(h * .3)}" r="2.4" fill="#c99a52" opacity=".5"/><circle cx="${f(-w * .1)}" cy="${f(h * .5)}" r="1.8" fill="#c99a52" opacity=".5"/>`; },
  tri: (o) => `<path d="M${-o.s} ${f(-o.s * .6)} L${o.s} ${f(-o.s * .6)} L0 ${f(o.s * .85)}Z" fill="${o.c}" stroke="${o.c}" stroke-width="3" stroke-linejoin="round"/><path d="M${f(-o.s * .72)} ${f(-o.s * .42)} L${f(o.s * .72)} ${f(-o.s * .42)} L0 ${f(o.s * .58)}Z" fill="${o.c2}" stroke="${o.c2}" stroke-width="2" stroke-linejoin="round"/>`,
  stuffed: (o) => `<path d="M${-o.s} ${f(-o.s * .3)} C${-o.s} ${f(-o.s * .95)} ${o.s} ${f(-o.s * .95)} ${o.s} ${f(-o.s * .3)} V${f(o.s * .3)} C${o.s} ${f(o.s * .9)} ${-o.s} ${f(o.s * .9)} ${-o.s} ${f(o.s * .3)}Z" fill="${o.c}"/><ellipse rx="${f(o.s * .78)}" ry="${f(o.s * .62)}" fill="${o.c2}"/><ellipse cx="${f(o.s * .05)}" cy="${f(-o.s * .05)}" rx="${f(o.s * .62)}" ry="${f(o.s * .46)}" fill="${o.c3 || '#f2c53f'}" opacity=".95"/><circle cx="${f(-o.s * .2)}" cy="${f(-o.s * .12)}" r="${f(o.s * .1)}" fill="#d9951a"/><circle cx="${f(o.s * .22)}" cy="${f(o.s * .1)}" r="${f(o.s * .09)}" fill="#d9951a"/><ellipse cx="${f(-o.s * .6)}" cy="${f(-o.s * .62)}" rx="${f(o.s * .22)}" ry="${f(o.s * .08)}" fill="#fff" opacity=".35"/>`,
  floret: (o) => `<rect x="-2.2" y="0" width="4.4" height="${f(o.s * .8)}" rx="2" fill="${o.c2}"/><circle cx="${f(-o.s * .5)}" cy="${f(-o.s * .05)}" r="${f(o.s * .52)}" fill="${o.c}"/><circle cx="${f(o.s * .5)}" cy="${f(-o.s * .05)}" r="${f(o.s * .52)}" fill="${o.c}"/><circle cx="0" cy="${f(-o.s * .55)}" r="${f(o.s * .58)}" fill="${o.c}"/><circle cx="${f(-o.s * .2)}" cy="${f(-o.s * .7)}" r="${f(o.s * .2)}" fill="#fff" opacity=".22"/>`,
  prawn: (o) => `<path d="M${-o.s} ${f(o.s * .2)} A ${o.s} ${o.s} 0 0 1 ${o.s} ${f(o.s * .2)}" fill="none" stroke="${o.c}" stroke-width="${f(o.s * .62)}" stroke-linecap="round"/><path d="M${f(-o.s * .8)} ${f(-o.s * .1)} l${f(o.s * .3)} ${f(o.s * .12)} M${f(-o.s * .3)} ${f(-o.s * .62)} l${f(o.s * .08)} ${f(o.s * .3)} M${f(o.s * .3)} ${f(-o.s * .62)} l${f(-o.s * .08)} ${f(o.s * .3)} M${f(o.s * .8)} ${f(-o.s * .1)} l${f(-o.s * .3)} ${f(o.s * .12)}" stroke="${o.c2}" stroke-width="2" opacity=".8"/><path d="M${f(o.s * .95)} ${f(o.s * .3)} l${f(o.s * .35)} ${f(o.s * .35)} l${f(-o.s * .05)} ${f(-o.s * .45)}Z" fill="${o.c}"/>`,
  strip: (o) => `<rect x="${-o.s}" y="${f(-o.s * .26)}" width="${o.s * 2}" height="${f(o.s * .52)}" rx="${f(o.s * .26)}" fill="${o.c}"/><rect x="${f(-o.s * .86)}" y="${f(-o.s * .13)}" width="${f(o.s * 1.7)}" height="${f(o.s * .12)}" rx="${f(o.s * .06)}" fill="${o.c2}" opacity=".7"/>`,
  oval: (o) => `<ellipse rx="${o.s}" ry="${f(o.s * .5)}" fill="${o.c}"/><ellipse rx="${f(o.s * .86)}" ry="${f(o.s * .38)}" fill="${o.c2}"/><ellipse cx="${f(-o.s * .3)}" cy="${f(-o.s * .1)}" rx="${f(o.s * .3)}" ry="${f(o.s * .08)}" fill="#fff" opacity=".35"/>`,
  blob: (o) => { const r = rng(hashStr(o.id + o.i)); const pts = []; for (let a = 0; a < 9; a++) { const t = a / 9 * 6.2832, d = o.s * (.78 + r() * .4); pts.push(`${f(Math.cos(t) * d)},${f(Math.sin(t) * d * .85)}`); } return `<polygon points="${pts.join(' ')}" fill="${o.c}" stroke="${o.c}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="${f(-o.s * .2)}" cy="${f(-o.s * .25)}" rx="${f(o.s * .4)}" ry="${f(o.s * .18)}" fill="#fff" opacity=".22"/>`; }
};

const artCache = new Map();
function recipeArt(rec) {
  if (artCache.has(rec.id)) return artCache.get(rec.id);
  const a = rec.art, id = 'a-' + rec.id, rnd = rng(hashStr(rec.id));
  let defs = `<linearGradient id="${id}-t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a.table[0]}"/><stop offset="1" stop-color="${a.table[1]}"/></linearGradient>
    <radialGradient id="${id}-pl" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e2d2"/></radialGradient>
    <radialGradient id="${id}-in" cx=".5" cy=".5" r=".5"><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
    <radialGradient id="${id}-vg" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
    <linearGradient id="${id}-lt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}-wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf9f66"/><stop offset="1" stop-color="#a97b47"/></linearGradient>
    <linearGradient id="${id}-mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3e6e8"/><stop offset="1" stop-color="#a6abb0"/></linearGradient>
    <filter id="${id}-ds" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1" dy="2.2" stdDeviation="1.7" flood-color="#2a1a05" flood-opacity=".38"/></filter>
    <filter id="${id}-bs" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#2a1a05" flood-opacity=".35"/></filter>
    <filter id="${id}-gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${hashStr(rec.id) % 50}"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .07  0 0 0 0 .02  0 0 0 .55 0"/></filter>
    <filter id="${id}-wg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .22" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .25  0 0 0 0 .13  0 0 0 0 .02  0 0 0 .5 0"/></filter>`;
  let svg = `<rect width="400" height="300" fill="url(#${id}-t)"/>`;
  // linen weave lines for the table
  svg += `<g opacity=".08" stroke="#5a4020" stroke-width="1">${Array.from({ length: 16 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="400" y2="${i * 20}"/>`).join('')}</g>`;
  // vessel
  const v = a.vessel;
  if (v === 'plate') svg += `<g filter="url(#${id}-bs)"><circle cx="200" cy="150" r="128" fill="url(#${id}-pl)"/></g><circle cx="200" cy="150" r="104" fill="none" stroke="#000" stroke-opacity=".07" stroke-width="2"/><circle cx="200" cy="150" r="100" fill="url(#${id}-in)"/>`;
  else if (v === 'bowl') svg += `<g filter="url(#${id}-bs)"><circle cx="200" cy="150" r="126" fill="url(#${id}-pl)"/></g><circle cx="200" cy="150" r="108" fill="#f3eee2" stroke="#000" stroke-opacity=".08" stroke-width="2"/><circle cx="200" cy="150" r="100" fill="#d9d1bd"/><circle cx="200" cy="150" r="100" fill="url(#${id}-in)"/>`;
  else if (v === 'board') svg += `<g filter="url(#${id}-bs)"><rect x="40" y="48" width="320" height="204" rx="22" fill="url(#${id}-wd)"/></g><rect x="40" y="48" width="320" height="204" rx="22" filter="url(#${id}-wg)" opacity=".55"/><rect x="40" y="48" width="320" height="204" rx="22" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
  else if (v === 'pan') svg += `<g filter="url(#${id}-bs)"><rect x="300" y="141" width="92" height="18" rx="9" fill="#262a28"/><circle cx="200" cy="150" r="128" fill="#3a3f3c"/></g><circle cx="200" cy="150" r="116" fill="#2b302d" stroke="#555b57" stroke-width="2"/><circle cx="200" cy="150" r="116" fill="url(#${id}-vg)"/>`;
  else if (v === 'tray') svg += `<g filter="url(#${id}-bs)"><rect x="26" y="36" width="348" height="228" rx="16" fill="url(#${id}-mt)"/></g><rect x="38" y="48" width="324" height="204" rx="10" fill="#c9ced2" stroke="#8b9096" stroke-width="2"/><rect x="38" y="48" width="324" height="204" rx="10" fill="url(#${id}-vg)"/>`;
  // layers
  let gi = 0;
  a.layers.forEach((ly, li) => {
    const at = ly.at || [0, 0], sq = ly.squash || 1;
    if (ly.k === 'disc') {
      const gid = `${id}-d${gi++}`;
      defs += `<radialGradient id="${gid}" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="${ly.c2}"/><stop offset="1" stop-color="${ly.c}"/></radialGradient>`;
      svg += `<g filter="url(#${id}-ds)"><ellipse cx="${200 + at[0]}" cy="${150 + at[1]}" rx="${ly.s}" ry="${f(ly.s * sq)}" fill="url(#${gid})"/></g><ellipse cx="${f(200 + at[0] - ly.s * .25)}" cy="${f(150 + at[1] - ly.s * sq * .3)}" rx="${f(ly.s * .45)}" ry="${f(ly.s * sq * .18)}" fill="#fff" opacity=".18"/>`;
      return;
    }
    let items = '';
    for (let i = 0; i < ly.n; i++) {
      let x, y;
      if (ly.pos) { [x, y] = ly.pos[i % ly.pos.length]; x += 200; y += 150; }
      else { const ang = rnd() * 6.2832, d = (ly.rmin || 0) + ((ly.rad) - (ly.rmin || 0)) * Math.sqrt(rnd()); x = 200 + at[0] + Math.cos(ang) * d; y = 150 + at[1] + Math.sin(ang) * d * sq; }
      const rot = ly.rot !== undefined ? ly.rot + (rnd() - .5) * 6 : ly.k === 'toast' || ly.k === 'stuffed' || ly.k === 'tri' ? (ly.pos ? (rnd() - .5) * 14 : rnd() * 360) : rnd() * 360;
      const size = ly.s * (1 - (ly.sv ?? .35) / 2 + rnd() * (ly.sv ?? .35));
      items += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">${shape[ly.k]({ ...ly, s: size, id: rec.id, i: li * 100 + i })}</g>`;
    }
    svg += `<g filter="url(#${id}-ds)">${items}</g>`;
  });
  svg += `<rect width="400" height="300" fill="url(#${id}-vg)"/><rect width="400" height="300" fill="url(#${id}-lt)"/><rect width="400" height="300" filter="url(#${id}-gr)" opacity=".5" style="mix-blend-mode:multiply"/>`;
  const out = `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of ${rec.name}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${svg}</svg>`;
  artCache.set(rec.id, out);
  return out;
}

/* ---------- Hero and CTA scenes ---------- */
function heroScene() {
  const defs = `<defs>
    <radialGradient id="h-tom" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff8264"/><stop offset=".55" stop-color="#dc432b"/><stop offset="1" stop-color="#a62a16"/></radialGradient>
    <radialGradient id="h-lem" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#fff58a"/><stop offset="1" stop-color="#eeb90f"/></radialGradient>
    <radialGradient id="h-egg" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#e7d3a9"/></radialGradient>
    <linearGradient id="h-car" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6a443"/><stop offset="1" stop-color="#d9631a"/></linearGradient>
    <linearGradient id="h-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6cbc5f"/><stop offset="1" stop-color="#2b7a38"/></linearGradient>
    <linearGradient id="h-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4a56d"/><stop offset="1" stop-color="#a8793f"/></linearGradient>
    <linearGradient id="h-crust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf8d44"/><stop offset="1" stop-color="#a5652a"/></linearGradient>
    <radialGradient id="h-gar" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#dccfb4"/></radialGradient>
    <radialGradient id="h-cap" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#e9cfa8"/><stop offset="1" stop-color="#b08655"/></radialGradient>
    <filter id="h-ds" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="2" dy="8" stdDeviation="6" flood-color="#2a1a05" flood-opacity=".35"/></filter>
    <filter id="h-wg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".01 .2" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .25  0 0 0 0 .13  0 0 0 0 .02  0 0 0 .5 0"/></filter>
  </defs>`;
  const tomato = (r) => `<circle r="${r}" fill="url(#h-tom)"/><ellipse cx="${f(-r * .36)}" cy="${f(-r * .42)}" rx="${f(r * .3)}" ry="${f(r * .15)}" fill="#fff" opacity=".4" transform="rotate(-35 ${f(-r * .36)} ${f(-r * .42)})"/><g transform="translate(0 ${f(-r * .86)})">${[0, 1, 2, 3, 4].map(i => `<ellipse rx="${f(r * .3)}" ry="${f(r * .09)}" fill="#3f8f3f" transform="rotate(${i * 72})"/>`).join('')}<rect x="-2" y="${f(-r * .26)}" width="4" height="${f(r * .26)}" rx="2" fill="#4b7a2c"/></g>`;
  const lemonHalf = (r) => `<circle r="${r}" fill="#f2c315"/><circle r="${f(r * .88)}" fill="#fff3a6"/>${Array.from({ length: 9 }, (_, i) => `<path d="M0 0 L${f(Math.cos(i * .698) * r * .8)} ${f(Math.sin(i * .698) * r * .8)}" stroke="#f2c315" stroke-width="2" opacity=".8"/>`).join('')}<circle r="${f(r * .09)}" fill="#fff9d0"/><circle r="${f(r * .88)}" fill="none" stroke="#fff" stroke-opacity=".5"/>`;
  const egg = (r) => `<ellipse rx="${f(r * .8)}" ry="${r}" fill="url(#h-egg)"/><ellipse cx="${f(-r * .3)}" cy="${f(-r * .4)}" rx="${f(r * .18)}" ry="${f(r * .3)}" fill="#fff" opacity=".6"/>`;
  const garlic = (r) => `<path d="M0 ${-r} C ${f(r * .15)} ${f(-r * .55)} ${f(r * .95)} ${f(-r * .25)} ${f(r * .85)} ${f(r * .35)} C ${f(r * .7)} ${f(r * .95)} ${f(-r * .7)} ${f(r * .95)} ${f(-r * .85)} ${f(r * .35)} C ${f(-r * .95)} ${f(-r * .25)} ${f(-r * .15)} ${f(-r * .55)} 0 ${-r}Z" fill="url(#h-gar)"/><path d="M0 ${f(-r * .8)} C ${f(r * .3)} 0 ${f(r * .35)} ${f(r * .5)} ${f(r * .12)} ${f(r * .95)} M${f(-r * .3)} ${f(-r * .5)} C ${f(-r * .6)} 0 ${f(-r * .5)} ${f(r * .5)} ${f(-r * .3)} ${f(r * .9)}" fill="none" stroke="#cbb994" stroke-width="2" opacity=".8"/><path d="M${f(-r * .12)} ${f(r * .95)} l-3 6 M0 ${f(r * .97)} v7 M${f(r * .12)} ${f(r * .95)} l3 6" stroke="#b9a57b" stroke-width="2"/>`;
  const carrot = (len) => { const w = len * .13; return `<path d="M${-w} 0 Q0 ${f(-w * .7)} ${w} 0 L${f(w * .1)} ${len} Q0 ${f(len * 1.04)} ${f(-w * .1)} ${len}Z" fill="url(#h-car)"/>` + [.2, .38, .55, .72].map(t => `<path d="M${f(-w * (1 - t) * .9)} ${f(len * t)} q${f(w * (1 - t) * .9)} ${f(w * .35)} ${f(w * (1 - t) * 1.8)} 0" stroke="#a84a10" stroke-opacity=".35" fill="none" stroke-width="2"/>`).join('') + `<g transform="translate(0 ${f(-w * .4)})">${[-24, 0, 24].map(a => `<path d="M0 0 C ${f(w * .2)} ${f(-w * 1.5)} ${f(w * .2)} ${f(-w * 3)} 0 ${f(-w * 4)} C ${f(-w * .5)} ${f(-w * 3)} ${f(-w * .5)} ${f(-w * 1.5)} 0 0Z" fill="url(#h-leaf)" transform="rotate(${a})"/>`).join('')}</g>`; };
  const leaf = (s) => `<path d="M0 ${-s} C ${f(s * .9)} ${f(-s * .5)} ${f(s * .85)} ${f(s * .55)} 0 ${s} C ${f(-s * .85)} ${f(s * .55)} ${f(-s * .9)} ${f(-s * .5)} 0 ${-s}Z" fill="url(#h-leaf)"/><path d="M0 ${-s} V${s}" stroke="#bfe6a8" stroke-width="2.5" opacity=".8"/><path d="M0 ${f(-s * .3)} l${f(s * .45)} ${f(-s * .3)} M0 ${f(s * .2)} l${f(-s * .45)} ${f(-s * .3)} M0 ${f(s * .5)} l${f(s * .35)} ${f(-s * .2)}" stroke="#bfe6a8" stroke-width="1.6" opacity=".7"/>`;
  const bread = (s) => `<path d="M${-s} ${f(s * .9)} V${f(-s * .1)} C${-s} ${f(-s * 1.05)} ${f(-s * .35)} ${f(-s * 1.15)} 0 ${f(-s * 1.1)} C${f(s * .35)} ${f(-s * 1.15)} ${s} ${f(-s * 1.05)} ${s} ${f(-s * .1)} V${f(s * .9)}Z" fill="url(#h-crust)"/><path d="M${f(-s * .86)} ${f(s * .78)} V${f(-s * .08)} C${f(-s * .86)} ${f(-s * .92)} ${f(-s * .3)} ${f(-s * 1.0)} 0 ${f(-s * .96)} C${f(s * .3)} ${f(-s * 1.0)} ${f(s * .86)} ${f(-s * .92)} ${f(s * .86)} ${f(-s * .08)} V${f(s * .78)}Z" fill="#f6e4b8"/>` + [[-.4, -.5], [.3, -.3], [-.1, .1], [.45, .35], [-.5, .4], [.1, -.75], [-.2, .62], [.55, -.6]].map(([x, y]) => `<ellipse cx="${f(x * s)}" cy="${f(y * s)}" rx="${f(s * .06)}" ry="${f(s * .04)}" fill="#dcbf86"/>`).join('');
  const mush = (r) => `<path d="M${f(-r * .3)} 0 L${f(-r * .24)} ${f(r * .85)} Q0 ${f(r * 1.02)} ${f(r * .24)} ${f(r * .85)} L${f(r * .3)} 0Z" fill="#f2e6d0"/><path d="M${-r} 0 C ${-r} ${f(-r * 1.05)} ${r} ${f(-r * 1.05)} ${r} 0Z" fill="url(#h-cap)"/><path d="M${f(-r * .6)} ${f(-r * .55)} q${f(r * .55)} ${f(-r * .35)} ${f(r * 1.1)} 0" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const G = (x, y, rot, inner, depth, fd) => `<g transform="translate(${x} ${y}) rotate(${rot})"><g class="par" data-depth="${depth}"><g class="float" style="--fd:${fd}s" filter="url(#h-ds)">${inner}</g></g></g>`;
  let s = `<svg viewBox="0 0 560 520" focusable="false">${defs}`;
  s += `<circle cx="290" cy="230" r="205" fill="var(--hl)" opacity=".92"/>`;
  s += `<g transform="rotate(-4 280 360)"><g filter="url(#h-ds)"><rect x="40" y="250" width="470" height="236" rx="30" fill="url(#h-wood)"/></g><rect x="40" y="250" width="470" height="236" rx="30" filter="url(#h-wg)" opacity=".6"/><rect x="40" y="250" width="470" height="236" rx="30" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/><circle cx="484" cy="276" r="9" fill="#7c5427" opacity=".55"/></g>`;
  s += G(120, 330, -10, leaf(48), 6, 0) + G(150, 250, 24, leaf(40), 8, 1.2);
  s += G(190, 328, -9, bread(86), 10, .4);
  s += G(318, 320, 0, tomato(70), 12, .9);
  s += G(428, 390, 0, tomato(46), 16, 1.6);
  s += G(250, 436, 8, egg(36), 14, .2) + G(294, 448, -18, egg(34), 14, 2);
  s += G(380, 450, 0, lemonHalf(40), 12, 1.1);
  s += G(112, 428, 0, garlic(38), 12, 1.8);
  s += G(470, 242, 58, carrot(190), 8, .6);
  s += G(380, 188, 0, mush(34), 18, 2.2);
  s += G(330, 120, -20, leaf(52), 10, .7) + G(284, 96, 18, leaf(40), 10, 1.5);
  s += `</svg>`;
  return s;
}
function ctaScene() {
  return `<svg viewBox="0 0 300 300" focusable="false"><defs>
    <radialGradient id="c-tom" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff3e8"/><stop offset=".6" stop-color="#ffd9c2"/><stop offset="1" stop-color="#f0a98a"/></radialGradient>
    <filter id="c-ds"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000" flood-opacity=".25"/></filter></defs>
    <circle cx="150" cy="150" r="118" fill="rgba(255,255,255,.14)"/>
    <g filter="url(#c-ds)"><circle cx="150" cy="156" r="92" fill="#fffdf6"/><circle cx="150" cy="156" r="74" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/>
    <path d="M110 150 q40 -50 80 0 q-40 50 -80 0Z" fill="#f2c53f"/><circle cx="150" cy="150" r="15" fill="#fff"/><circle cx="150" cy="150" r="9" fill="#ffb300"/>
    <g fill="#2f7d3a"><ellipse cx="108" cy="112" rx="16" ry="7" transform="rotate(-30 108 112)"/><ellipse cx="196" cy="116" rx="16" ry="7" transform="rotate(30 196 116)"/><ellipse cx="120" cy="198" rx="16" ry="7" transform="rotate(25 120 198)"/></g>
    <g fill="#d93a22"><circle cx="196" cy="190" r="13"/><circle cx="106" cy="160" r="10"/></g></g>
    <g class="float" style="--fd:.4s"><path d="M232 52c10 6 14 18 10 30-12-2-22-10-24-22 2-4 8-8 14-8Z" fill="var(--hl)"/></g></svg>`;
}

/* ---------- Finder ---------- */
const state = new Set();
const chipsEl = $('#chips'), resultsEl = $('#results'), statusEl = $('#status'), hintEl = $('#hint');
const countNum = $('#countNum'), countEl = $('#count'), jumpBtn = $('#jump'), jumpText = $('#jumpText');
const cards = new Map();
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const pill = (id) => `<li><span aria-hidden="true">${BY_ID[id].e}</span>${BY_ID[id].name}</li>`;

function buildChips() {
  chipsEl.insertAdjacentHTML('beforeend', CATS.map(([cat, label]) => `<div class="chip-group" role="group" aria-label="${label}"><h3 class="chip-group__h">${label}</h3><div class="chip-grid">${ING.filter(i => i.cat === cat).map(i => `<button type="button" class="chip" aria-pressed="false" data-id="${i.id}"><span class="chip__e" aria-hidden="true">${i.e}</span><span class="chip__n">${i.name}</span><span class="chip__tick" aria-hidden="true">✓</span></button>`).join('')}</div></div>`).join(''));
}

function rank() {
  if (state.size === 0) return { mode: 'starter', list: RECIPES.filter(r => r.starter).slice(0, 4) };
  const list = RECIPES.map(r => ({ r, used: r.ing.filter(i => state.has(i)).length, missing: r.ing.filter(i => !state.has(i)).length }))
    .filter(x => x.used > 0)
    .sort((a, b) => b.used - a.used || a.missing - b.missing || a.r.time - b.r.time || a.r.name.localeCompare(b.r.name))
    .slice(0, 6).map(x => x.r);
  return { mode: 'match', list };
}

function createCard(r) {
  const li = document.createElement('li');
  li.className = 'card'; li.dataset.id = r.id;
  li.innerHTML = `<div class="card__img">${recipeArt(r)}<span class="badge"></span></div>
    <div class="card__body">
      <h3 class="card__title">${r.name}</h3>
      <p class="card__meta"><span><span aria-hidden="true">⏱</span> ${r.time} min</span><span><span aria-hidden="true">🍽</span> Serves ${r.serves}</span></p>
      <div class="meter"><span class="meter__txt"></span><div class="meter__bar" aria-hidden="true"><i style="--p:0"></i></div></div>
      <div class="lists"></div>
      <p class="basics"><b>Cupboard basics assumed:</b> ${r.pantry.join(', ')}.</p>
      <details class="method"><summary><span>Method</span><span class="plus" aria-hidden="true">+</span></summary><ol class="steps">${r.steps.map(s => `<li>${s}</li>`).join('')}</ol></details>
    </div>`;
  cards.set(r.id, li);
  return li;
}

function updateCard(el, r, mode) {
  const have = r.ing.filter(i => state.has(i)), need = r.ing.filter(i => !state.has(i));
  const badge = $('.badge', el), meter = $('.meter', el), lists = $('.lists', el);
  if (mode === 'starter') {
    badge.textContent = 'Easy starter'; badge.className = 'badge';
    meter.hidden = true;
    lists.innerHTML = `<div class="list"><h4>You'll need</h4><ul class="pills pills--plain">${r.ing.map(pill).join('')}</ul></div>`;
  } else {
    const done = need.length === 0;
    badge.textContent = done ? 'You have it all' : `Uses ${have.length} of your ${state.size}`;
    badge.className = 'badge' + (done ? ' badge--full' : '');
    meter.hidden = false;
    $('.meter__txt', el).textContent = `You have ${have.length} of ${r.ing.length} ingredients`;
    $('.meter__bar i', el).style.setProperty('--p', Math.round(have.length / r.ing.length * 100));
    lists.innerHTML = `<div class="list"><h4>You have</h4><ul class="pills pills--have">${have.map(pill).join('')}</ul></div>
      <div class="list"><h4>Still need</h4>${done ? '<p class="allset">Nothing. You have it all.</p>' : `<ul class="pills pills--need">${need.map(pill).join('')}</ul>`}</div>`;
  }
}

function render(note = '') {
  const { mode, list } = rank();
  const first = new Map();
  [...resultsEl.children].forEach(el => first.set(el.dataset.id, el.getBoundingClientRect()));
  const keep = new Set(list.map(r => r.id));
  [...resultsEl.children].forEach(el => { if (!keep.has(el.dataset.id)) el.remove(); });
  list.forEach((r, i) => {
    const el = cards.get(r.id) || createCard(r);
    updateCard(el, r, mode);
    if (resultsEl.children[i] !== el) resultsEl.insertBefore(el, resultsEl.children[i] || null);
  });
  if (!reduce) list.forEach((r, i) => {
    const el = cards.get(r.id), prev = first.get(r.id);
    if (prev) {
      const now = el.getBoundingClientRect(), dx = prev.left - now.left, dy = prev.top - now.top;
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
    } else {
      el.animate([{ opacity: 0, transform: 'translateY(22px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: i * 70, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    }
  });
  if (mode === 'starter') {
    statusEl.textContent = 'Nothing ticked yet. Here are four easy starters.';
    hintEl.textContent = 'Tip: start with the things that need using up first, like soft tomatoes or the last of the bread.';
  } else {
    const top = list[0], topNeeds = top.ing.filter(i => !state.has(i)).length;
    statusEl.textContent = `${note}${plural(state.size, 'ingredient')} ticked. Showing ${plural(list.length, 'recipe')}, best match first.${topNeeds === 0 ? ' The first one needs nothing else.' : ''}`;
    hintEl.textContent = '';
  }
  const n = state.size;
  countNum.textContent = n;
  jumpText.textContent = `See ${plural(list.length, 'recipe')}`;
  updateJump();
}

function setChip(id, on) {
  const b = chipsEl.querySelector(`[data-id="${id}"]`);
  if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false');
}
function bump() { countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump'); }

chipsEl.addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b) return;
  const id = b.dataset.id, on = !state.has(id);
  on ? state.add(id) : state.delete(id);
  setChip(id, on); bump(); render();
});
$('#clear').addEventListener('click', () => {
  if (!state.size) return;
  state.forEach(id => setChip(id, false)); state.clear(); bump(); render();
});
$('#pick').addEventListener('click', () => {
  state.forEach(id => setChip(id, false)); state.clear();
  const pool = ING.map(i => i.id);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const picks = pool.slice(0, 3);
  picks.forEach((id, k) => {
    state.add(id); setChip(id, true);
    const b = chipsEl.querySelector(`[data-id="${id}"]`);
    if (!reduce) { b.style.setProperty('--k', k); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
  });
  bump(); render(`Picked at random: ${picks.map(id => BY_ID[id].name).join(', ')}. `);
});

/* Floating "see recipes" pill: shown on small screens while the chips are on screen but the results are not. */
let finderVisible = false, resultsVisible = false;
function updateJump() { jumpBtn.hidden = !(finderVisible && !resultsVisible && state.size > 0); }
jumpBtn.addEventListener('click', () => $('#resultsWrap').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => { finderVisible = e.isIntersecting; updateJump(); }, { threshold: 0.05 }).observe($('#finder'));
  new IntersectionObserver(([e]) => { resultsVisible = e.isIntersecting; updateJump(); }, { threshold: 0, rootMargin: '0px 0px -28% 0px' }).observe($('#resultsWrap'));
}

/* ---------- Page motion ---------- */
function countUp(el) {
  const to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0, dur = 1500, t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * e).toFixed(dec);
    if (p < 1) requestAnimationFrame(tick); else el.textContent = to.toFixed(dec);
  };
  el.textContent = (0).toFixed(dec);
  requestAnimationFrame(tick);
}
function setupReveals() {
  const els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
  const co = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(e => co.observe(e));
}
function setupParallax() {
  const hero = $('.hero'); if (!hero || reduce || !matchMedia('(pointer: fine)').matches) return;
  const layers = [...hero.querySelectorAll('.par')];
  let raf = 0, px = 0, py = 0;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; layers.forEach(l => { const d = +l.dataset.depth; l.style.translate = `${f(px * d * -2.2)}px ${f(py * d * -1.6)}px`; }); });
  });
  hero.addEventListener('pointerleave', () => layers.forEach(l => { l.style.translate = '0 0'; }));
}

/* ---------- Offline ---------- */
function setupOffline() {
  if (!('serviceWorker' in navigator) || !/^https:|^http:\/\/(localhost|127\.0\.0\.1)/.test(location.href)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(() => {
      const n = $('#offlineNote'); if (n) n.textContent = 'Saved on this device. It works offline now.';
    }).catch(() => {});
  });
}

/* ---------- Boot ---------- */
const note = $('#heroNote'); if (note) note.textContent = `${ING.length} everyday ingredients · ${RECIPES.length} simple recipes · works offline`;
$('#heroArt').innerHTML = heroScene();
$('#ctaArt').innerHTML = ctaScene();
buildChips();
render();
setupReveals();
setupParallax();
setupOffline();

/* Exposed for testing only */
window.__EMF = { RECIPES, ING, state, rank, recipeArt };
})();
