(() => {
  const boardCanvas = document.getElementById('board');
  const ctx = boardCanvas.getContext('2d');
  const holdCanvas = document.getElementById('hold-canvas');
  const hctx = holdCanvas.getContext('2d');
  const nextCanvas = document.getElementById('next-canvas');
  const nctx = nextCanvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const linesEl = document.getElementById('lines');
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlay-text');
  const startBtn = document.getElementById('start-btn');
  const ctrlBtns = document.querySelectorAll('.ctrl-btn');

  const COLS = 10;
  const ROWS = 20;
  const BLOCK = 24;

  boardCanvas.width = COLS * BLOCK;
  boardCanvas.height = ROWS * BLOCK;

  // Sounder-themed piece colors
  const PIECE_COLORS = {
    I: '#21D6C6',  // teal
    O: '#F000D2',  // magenta
    T: '#8E33D5',  // purple
    S: '#7AE6DD',  // light teal
    Z: '#CE4F51',  // red
    J: '#5B00A2',  // dark purple
    L: '#AA66E0'   // medium purple
  };

  const GHOST_ALPHA = 0.2;

  const SHAPES = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    O: [[1,1],[1,1]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]]
  };

  // Wall kick data (SRS)
  const KICKS = {
    normal: [
      [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
      [[0,0],[1,0],[1,-1],[0,2],[1,2]],
      [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
      [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]
    ],
    I: [
      [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
      [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
      [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
      [[0,0],[1,0],[-2,0],[1,-2],[-2,1]]
    ]
  };

  let grid, current, held, canHold, bag, nextPieces;
  let score, level, totalLines, running, dropTimer, dropInterval, lastTime, lockDelay, lockTimer;

  const SCORE_TABLE = [0, 100, 300, 500, 800];

  function newBag() {
    const pieces = ['I','O','T','S','Z','J','L'];
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    return pieces;
  }

  function nextPiece() {
    if (bag.length === 0) bag = newBag();
    const type = bag.pop();
    const shape = SHAPES[type].map(r => [...r]);
    const x = Math.floor((COLS - shape[0].length) / 2);
    return { type, shape, x, y: 0, rotation: 0 };
  }

  function fillNext() {
    while (nextPieces.length < 3) {
      if (bag.length === 0) bag = newBag();
      nextPieces.push(bag.pop());
    }
  }

  function spawnPiece() {
    fillNext();
    const type = nextPieces.shift();
    const shape = SHAPES[type].map(r => [...r]);
    const x = Math.floor((COLS - shape[0].length) / 2);
    current = { type, shape, x, y: 0, rotation: 0 };
    lockTimer = 0;
    if (collides(current.shape, current.x, current.y)) {
      gameOver();
    }
  }

  function rotate(shape, dir) {
    const n = shape.length;
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        rotated[c][n - 1 - r] = shape[r][c];
    if (dir === -1) {
      // Rotate 3 times CW = 1 CCW
      return rotate(rotate(rotated, 1), 1);
    }
    return rotated;
  }

  function collides(shape, px, py) {
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const nx = px + c, ny = py + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && grid[ny][nx]) return true;
      }
    return false;
  }

  function lock() {
    for (let r = 0; r < current.shape.length; r++)
      for (let c = 0; c < current.shape[r].length; c++) {
        if (!current.shape[r][c]) continue;
        const ny = current.y + r;
        if (ny < 0) { gameOver(); return; }
        grid[ny][current.x + c] = current.type;
      }

    clearLines();
    canHold = true;
    spawnPiece();
  }

  function clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r].every(c => c !== 0)) {
        grid.splice(r, 1);
        grid.unshift(Array(COLS).fill(0));
        cleared++;
        r++; // recheck same row
      }
    }
    if (cleared > 0) {
      totalLines += cleared;
      score += SCORE_TABLE[cleared] * level;
      const newLevel = Math.floor(totalLines / 10) + 1;
      if (newLevel !== level) {
        level = newLevel;
        dropInterval = Math.max(50, 800 - (level - 1) * 70);
      }
      scoreEl.textContent = score;
      levelEl.textContent = level;
      linesEl.textContent = totalLines;
    }
  }

  function ghostY() {
    let gy = current.y;
    while (!collides(current.shape, current.x, gy + 1)) gy++;
    return gy;
  }

  function tryRotate(dir) {
    const newShape = rotate(current.shape, dir);
    const kicks = current.type === 'I' ? KICKS.I : KICKS.normal;
    const kickIndex = current.rotation;

    for (const [dx, dy] of kicks[kickIndex]) {
      if (!collides(newShape, current.x + dx, current.y - dy)) {
        current.shape = newShape;
        current.x += dx;
        current.y -= dy;
        current.rotation = (current.rotation + (dir === 1 ? 1 : 3)) % 4;
        lockTimer = 0;
        return;
      }
    }
  }

  function moveLeft() {
    if (!collides(current.shape, current.x - 1, current.y)) {
      current.x--;
      lockTimer = 0;
    }
  }

  function moveRight() {
    if (!collides(current.shape, current.x + 1, current.y)) {
      current.x++;
      lockTimer = 0;
    }
  }

  function softDrop() {
    if (!collides(current.shape, current.x, current.y + 1)) {
      current.y++;
      score += 1;
      scoreEl.textContent = score;
      dropTimer = 0;
    }
  }

  function hardDrop() {
    let dropped = 0;
    while (!collides(current.shape, current.x, current.y + 1)) {
      current.y++;
      dropped++;
    }
    score += dropped * 2;
    scoreEl.textContent = score;
    lock();
  }

  function holdPiece() {
    if (!canHold) return;
    canHold = false;
    const type = current.type;
    if (held) {
      const heldType = held;
      held = type;
      const shape = SHAPES[heldType].map(r => [...r]);
      current = { type: heldType, shape, x: Math.floor((COLS - shape[0].length) / 2), y: 0, rotation: 0 };
    } else {
      held = type;
      spawnPiece();
    }
  }

  // ---- DRAWING ----

  function drawBlock(context, x, y, color, size, alpha) {
    const a = alpha || 1;
    context.globalAlpha = a;
    context.fillStyle = color;
    context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);

    // Highlight
    context.fillStyle = 'rgba(255,255,255,0.15)';
    context.fillRect(x * size + 1, y * size + 1, size - 2, 3);
    context.fillRect(x * size + 1, y * size + 1, 3, size - 2);

    // Shadow
    context.fillStyle = 'rgba(0,0,0,0.2)';
    context.fillRect(x * size + 1, y * size + size - 3, size - 2, 2);
    context.fillRect(x * size + size - 3, y * size + 1, 2, size - 2);

    context.globalAlpha = 1;
  }

  function draw() {
    // Board background
    ctx.fillStyle = '#0d001a';
    ctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

    // Grid lines
    ctx.strokeStyle = '#1a003a';
    ctx.lineWidth = 0.5;
    for (let c = 1; c < COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * BLOCK, 0);
      ctx.lineTo(c * BLOCK, boardCanvas.height);
      ctx.stroke();
    }
    for (let r = 1; r < ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * BLOCK);
      ctx.lineTo(boardCanvas.width, r * BLOCK);
      ctx.stroke();
    }

    // Locked pieces
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (grid[r][c]) drawBlock(ctx, c, r, PIECE_COLORS[grid[r][c]], BLOCK);

    if (!current) return;

    // Ghost
    const gy = ghostY();
    for (let r = 0; r < current.shape.length; r++)
      for (let c = 0; c < current.shape[r].length; c++)
        if (current.shape[r][c])
          drawBlock(ctx, current.x + c, gy + r, PIECE_COLORS[current.type], BLOCK, GHOST_ALPHA);

    // Current piece
    for (let r = 0; r < current.shape.length; r++)
      for (let c = 0; c < current.shape[r].length; c++)
        if (current.shape[r][c] && current.y + r >= 0)
          drawBlock(ctx, current.x + c, current.y + r, PIECE_COLORS[current.type], BLOCK);

    // Hold
    drawMini(hctx, holdCanvas, held);

    // Next
    drawNextQueue();
  }

  function drawMini(context, canvas, type) {
    context.fillStyle = '#2E0051';
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (!type) return;
    const shape = SHAPES[type];
    const bs = 18;
    const ox = Math.floor((canvas.width - shape[0].length * bs) / 2);
    const oy = Math.floor((canvas.height - shape.length * bs) / 2);
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++)
        if (shape[r][c]) {
          context.fillStyle = PIECE_COLORS[type];
          context.fillRect(ox + c * bs + 1, oy + r * bs + 1, bs - 2, bs - 2);
        }
  }

  function drawNextQueue() {
    nctx.fillStyle = '#2E0051';
    nctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    const bs = 18;
    for (let i = 0; i < Math.min(3, nextPieces.length); i++) {
      const type = nextPieces[i];
      const shape = SHAPES[type];
      const ox = Math.floor((nextCanvas.width - shape[0].length * bs) / 2);
      const oy = 10 + i * 85;
      for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
          if (shape[r][c]) {
            nctx.fillStyle = PIECE_COLORS[type];
            nctx.fillRect(ox + c * bs + 1, oy + r * bs + 1, bs - 2, bs - 2);
          }
    }
  }

  // ---- GAME LOOP ----

  function gameLoop(time) {
    if (!running) return;
    const dt = time - lastTime;
    lastTime = time;

    dropTimer += dt;

    // Check if piece is on ground
    const onGround = collides(current.shape, current.x, current.y + 1);

    if (onGround) {
      lockTimer += dt;
      if (lockTimer >= lockDelay) {
        lock();
        draw();
        requestAnimationFrame(gameLoop);
        return;
      }
    } else {
      lockTimer = 0;
    }

    if (dropTimer >= dropInterval && !onGround) {
      current.y++;
      dropTimer = 0;
    }

    draw();
    requestAnimationFrame(gameLoop);
  }

  function init() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    bag = newBag();
    nextPieces = [];
    held = null;
    canHold = true;
    score = 0;
    level = 1;
    totalLines = 0;
    dropInterval = 800;
    dropTimer = 0;
    lockDelay = 500;
    lockTimer = 0;
    scoreEl.textContent = '0';
    levelEl.textContent = '1';
    linesEl.textContent = '0';
    spawnPiece();
    draw();
  }

  function start() {
    if (running) return;
    running = true;
    overlay.classList.add('hidden');
    init();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function gameOver() {
    running = false;
    overlayText.textContent = `Game Over! Score: ${score}`;
    startBtn.textContent = 'Play Again';
    overlay.classList.remove('hidden');
  }

  // ---- INPUT ----

  const DAS_DELAY = 170;
  const DAS_RATE = 50;
  let keys = {};
  let dasTimer = {};
  let dasActive = {};

  document.addEventListener('keydown', e => {
    if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','KeyZ','KeyX','KeyC','Space'].includes(e.code)) {
      e.preventDefault();
    }

    if (!running) {
      if (e.code === 'Space' || e.code === 'Enter') start();
      return;
    }

    if (keys[e.code]) return; // repeat guard
    keys[e.code] = true;

    switch (e.code) {
      case 'ArrowLeft': moveLeft(); dasTimer.left = 0; dasActive.left = false; break;
      case 'ArrowRight': moveRight(); dasTimer.right = 0; dasActive.right = false; break;
      case 'ArrowDown': softDrop(); break;
      case 'ArrowUp': case 'KeyX': tryRotate(1); break;
      case 'KeyZ': tryRotate(-1); break;
      case 'Space': hardDrop(); break;
      case 'KeyC': case 'ShiftLeft': case 'ShiftRight': holdPiece(); break;
    }
  });

  document.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

  // DAS for held keys
  setInterval(() => {
    if (!running) return;
    const dt = 16;
    if (keys['ArrowLeft']) {
      dasTimer.left = (dasTimer.left || 0) + dt;
      if (dasTimer.left >= DAS_DELAY) { moveLeft(); }
    }
    if (keys['ArrowRight']) {
      dasTimer.right = (dasTimer.right || 0) + dt;
      if (dasTimer.right >= DAS_DELAY) { moveRight(); }
    }
    if (keys['ArrowDown']) { softDrop(); }
  }, 16);

  // Mobile controls
  ctrlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!running) { start(); return; }
      switch (btn.dataset.action) {
        case 'left': moveLeft(); break;
        case 'right': moveRight(); break;
        case 'rotate': tryRotate(1); break;
        case 'soft': softDrop(); break;
        case 'hard': hardDrop(); break;
        case 'hold': holdPiece(); break;
      }
    });
  });

  startBtn.addEventListener('click', start);

  // Initial draw
  init();
  draw();
})();
