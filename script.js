const MASTER_SHAPES = [
    {
        color: '#ff6b6b',
        name: 'heart',
        svg: '<svg viewBox="0 0 100 100"><path d="M50,20 C30,0 10,20 10,40 C10,70 50,95 50,95 C50,95 90,70 90,40 C90,20 70,0 50,20 Z" fill="#ff6b6b" stroke="#d63031" stroke-width="3" stroke-linejoin="round"/></svg>'
    },
    {
        color: '#4d96ff',
        name: 'star',
        svg: '<svg viewBox="0 0 100 100"><path d="M50,10 L58,38 L88,38 L62,56 L72,84 L50,68 L28,84 L38,56 L12,38 L42,38 Z" fill="#4d96ff" stroke="#1e5dbf" stroke-width="3" stroke-linejoin="round"/></svg>'
    },
    {
        color: '#6bcB77',
        name: 'triangle',
        svg: '<svg viewBox="0 0 100 100"><polygon points="50,15 90,85 10,85" fill="#6bcB77" stroke="#2d8a3c" stroke-width="4" stroke-linejoin="round"/></svg>'
    },
    {
        color: '#ffd166',
        name: 'circle',
        svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#ffd166" stroke="#e6a900" stroke-width="4"/></svg>'
    },
    {
        color: '#6a0dad',
        name: 'square',
        svg: '<svg viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" rx="8" fill="#6a0dad" stroke="#3a0a7a" stroke-width="4"/></svg>'
    },
    {
        color: '#ff7f50',
        name: 'diamond',
        svg: '<svg viewBox="0 0 100 100"><polygon points="50,15 85,50 50,85 15,50" fill="#ff7f50" stroke="#d45a2a" stroke-width="4" stroke-linejoin="round"/></svg>'
    },
    {
        color: '#f08080',
        name: 'pentagon',
        svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 90,40 72,88 28,88 10,40" fill="#f08080" stroke="#cc5c5c" stroke-width="3" stroke-linejoin="round"/></svg>'
    },
    {
        color: '#add8e6',
        name: 'hexagon',
        svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="#add8e6" stroke="#5fa9d1" stroke-width="3" stroke-linejoin="round"/></svg>'
    },
    {
        color: '#ee82ee',
        name: 'cross',
        svg: '<svg viewBox="0 0 100 100"><path d="M40,20 H60 V40 H80 V60 H60 V80 H40 V60 H20 V40 H40 Z" fill="#ee82ee" stroke="#cc5cbf" stroke-width="3" stroke-linejoin="round"/></svg>'
    },
    {
        color: '#98fb98',
        name: 'arrow',
        svg: '<svg viewBox="0 0 100 100"><path d="M20,50 L50,20 L50,40 L80,40 L80,60 L50,60 L50,80 Z" fill="#98fb98" stroke="#5cbb5c" stroke-width="3" stroke-linejoin="round"/></svg>'
    },
    // Replace just these two entries in your array:

    {
        color: '#d2b48c',
        name: 'moon',
        svg: '<svg viewBox="0 0 100 100"><path d="M75,50 A35,35 0 1,1 50,15 A20,20 0 1,0 75,50 Z" fill="#d2b48c" stroke="#a88a5c" stroke-width="4"/></svg>'
    },
    {
        color: '#d3d3d3',
        name: 'cloud',
        svg: '<svg viewBox="0 0 100 100"><path d="M20,60 Q20,40 40,40 Q55,30 70,40 Q85,40 85,60 Q85,75 70,75 Q60,85 45,78 Q30,85 20,75 Q15,70 20,60 Z" fill="#d3d3d3" stroke="#a9a9a9" stroke-width="4" stroke-linejoin="round"/></svg>'
    }
];

let gameState = {};
let chainTiles = []; // ✅ Global: stores references to DOM tiles

const ageGateScreen = document.getElementById('age-gate');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const ageInput = document.getElementById('age-input');
const startGameBtn = document.getElementById('start-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const statusMessage = document.getElementById('status-message');
const memoryGrid = document.getElementById('memory-grid');
const gameOverMessage = document.getElementById('game-over-message');
const world = document.getElementById('world');

// Path layout — DO NOT change unless redesigning path
const PATH_POSITIONS = [
    { row: 0, col: 2 },
    { row: 0, col: 3 },
    { row: 0, col: 4 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
    { row: 2, col: 3 },
    { row: 2, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 0 },
    { row: 3, col: 0 },
    { row: 4, col: 0 },
    { row: 4, col: 1 },
    { row: 4, col: 2 },
    { row: 4, col: 3 },
    { row: 4, col: 4 },
    { row: 5, col: 4 },
    { row: 6, col: 4 },
    { row: 6, col: 3 },
    { row: 6, col: 2 },
    { row: 6, col: 1 },
    { row: 6, col: 0 },
    { row: 7, col: 0 },
    { row: 8, col: 0 },
    { row: 8, col: 1 },
    { row: 8, col: 2 },
];

// ---------------------
// Game Initialization
// ---------------------

function init() {
    ageGateScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    gameState = {
        age: 0,
        shapePalette: [],
        memoryCardLayout: [],
        gameChain: [],
        playerChainPosition: 12,
        isInputBlocked: false,
    };

    chainTiles = []; // reset
    ageInput.value = '';
    statusMessage.textContent = '';
    world.innerHTML = '';
    memoryGrid.innerHTML = '';
}

// ---------------------
// Start Game
// ---------------------

function handleStartGame() {
    const age = parseInt(ageInput.value, 10);
    if (isNaN(age) || age < 3 || age > 10) {
        alert('Please enter an age between 3 and 10.');
        return;
    }
    gameState.age = age;

    generateShapePalette();
    generateGameChain();
    gameState.memoryCardLayout = [...gameState.shapePalette].sort(() => 0.5 - Math.random());
    renderMemoryGrid();

    ageGateScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    // Build static grid once
    world.innerHTML = '';
    chainTiles = [];

    PATH_POSITIONS.forEach((pos, index) => {
        const tile = document.createElement('div');
        tile.className = 'chain-tile';
        tile.style.gridColumn = pos.col + 1;
        tile.style.gridRow = pos.row + 1;

        const shapeContainer = document.createElement('div');
        shapeContainer.className = 'chain-shape';
        tile.appendChild(shapeContainer);

        const bubble = document.createElement('div');
        bubble.className = 'player-bubble';
        bubble.textContent = 'P';
        bubble.style.display = 'none';
        tile.appendChild(bubble);

        world.appendChild(tile);
        chainTiles.push({ shapeContainer, bubble });
    });

    // Fire pit
    const fire = document.createElement('div');
    fire.className = 'chain-item fire-pit';
    fire.textContent = '🔥 FIRE';
    fire.style.gridColumn = '2';
    fire.style.gridRow = '1';
    world.appendChild(fire);

    // Exit gate
    const exit = document.createElement('div');
    exit.className = 'chain-item exit-gate';
    exit.textContent = '🚪 EXIT';
    exit.style.gridColumn = '4';
    exit.style.gridRow = '9';
    world.appendChild(exit);

    updateChainDisplay();
    prepareNextTurn();
}

// ---------------------
// Game Data Generators
// ---------------------

function generateShapePalette() {
    const numberOfShapes = Math.min(gameState.age * 2, MASTER_SHAPES.length);
    const shuffled = [...MASTER_SHAPES].sort(() => 0.5 - Math.random());
    gameState.shapePalette = shuffled.slice(0, numberOfShapes);
}

function generateGameChain() {
    const chain = [];
    for (let i = 0; i < 25; i++) {
        let randomShape;
        do {
            randomShape = gameState.shapePalette[Math.floor(Math.random() * gameState.shapePalette.length)];
        } while (i > 0 && randomShape === chain[i - 1]);
        chain.push(randomShape);
    }
    gameState.gameChain = chain;
}

function generateNewChainShape() {
    let randomShape;
    const lastShape = gameState.gameChain[gameState.gameChain.length - 1];
    do {
        randomShape = gameState.shapePalette[Math.floor(Math.random() * gameState.shapePalette.length)];
    } while (randomShape === lastShape);
    return randomShape;
}

// ---------------------
// Update Chain Display (with smooth fade)
// ---------------------

function updateChainDisplay() {
    gameState.gameChain.forEach((shape, index) => {
        const { shapeContainer, bubble } = chainTiles[index];

        shapeContainer.style.opacity = '0';
        setTimeout(() => {
            shapeContainer.innerHTML = shape.svg;
            shapeContainer.style.opacity = '1';
        }, 30);

        bubble.style.display = (index === gameState.playerChainPosition) ? 'flex' : 'none';
    });
}

// ---------------------
// Memory Cards
// ---------------------

function renderMemoryGrid() {
    memoryGrid.innerHTML = '';
    gameState.memoryCardLayout.forEach(shape => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        const safeSvg = shape.svg;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${safeSvg}</div>
            </div>
        `;
        card.addEventListener('click', () => handleMemoryCardClick(shape, card));
        memoryGrid.appendChild(card);
    });
}

// ---------------------
// Game Loop
// ---------------------

function prepareNextTurn() {
    gameState.isInputBlocked = false;
    const currentShape = gameState.gameChain[gameState.playerChainPosition];
    if (!currentShape) {
        statusMessage.textContent = 'Waiting...';
        return;
    }
    statusMessage.innerHTML = `You're on the <strong>${currentShape.name}</strong>. Find the matching card!`;

    document.querySelectorAll('.memory-card.is-flipped, .memory-card.is-incorrect').forEach(c => {
        c.classList.remove('is-flipped', 'is-incorrect');
    });
}

function handleMemoryCardClick(clickedShape, cardElement) {
    if (gameState.isInputBlocked || cardElement.classList.contains('is-flipped')) return;

    gameState.isInputBlocked = true;
    cardElement.classList.add('is-flipped');

    const correctShape = gameState.gameChain[gameState.playerChainPosition];

    setTimeout(() => {
        if (clickedShape.name === correctShape.name && clickedShape.color === correctShape.color) {
            gameState.playerChainPosition++;
            if (gameState.playerChainPosition >= 25) {
                updateChainDisplay();
                setTimeout(() => endGame(true), 500);
                return;
            }
            updateChainDisplay();
            setTimeout(prepareNextTurn, 500);
        } else {
            cardElement.classList.add('is-incorrect');
            gameState.gameChain.shift();
            gameState.gameChain.push(generateNewChainShape());
            gameState.playerChainPosition--;

            if (gameState.playerChainPosition < 0) {
                updateChainDisplay();
                setTimeout(() => endGame(false), 500);
                return;
            }

            updateChainDisplay();
            setTimeout(() => {
                cardElement.classList.remove('is-flipped', 'is-incorrect');
                gameState.isInputBlocked = false;
                prepareNextTurn();
            }, 900);
        }
    }, 450);
}

// ---------------------
// End Game
// ---------------------

function endGame(isWin) {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    gameOverMessage.textContent = isWin ? 'You Escaped!' : 'The Fire Got You!';
}

// ---------------------
// Event Listeners
// ---------------------

startGameBtn.addEventListener('click', handleStartGame);
playAgainBtn.addEventListener('click', () => init());
window.addEventListener('resize', () => {
    // Optional: you can remove recenterChain if not defined
    // or define it if you want custom resize logic
});

// Start
init();