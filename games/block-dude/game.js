(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const levelDisplay = document.getElementById('level-display');
  const movesDisplay = document.getElementById('moves-display');
  const btnRestart = document.getElementById('btn-restart');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const arrowBtns = document.querySelectorAll('.arrow-btn');

  // Tile types
  const EMPTY = 0;
  const WALL = 1;
  const BLOCK = 2;
  const DOOR = 4;

  // Sounder colors
  const COL = {
    bg: '#060910',
    wall: '#1e293b',
    wallHi: '#334155',
    wallSh: '#111827',
    block: '#818cf8',
    blockHi: '#AA66E0',
    blockSh: '#6366f1',
    player: '#22d3ee',
    playerDark: '#148077',
    door: '#ec4899',
    doorGlow: 'rgba(236, 72, 153, 0.25)',
    eye: '#060910',
    carried: '#94a3b8',
    grid: '#1a003a'
  };

  let currentLevel = 0;
  let grid, rows, cols, player, carrying, facing, moves, won;
  let doorPos;
  let tileSize;
  let savedProgress = parseInt(localStorage.getItem('bd-progress') || '0', 10);

  function parseLevel(idx) {
    const data = window.LEVELS[idx];
    const maxCols = Math.max(...data.map(r => r.length));
    rows = data.length;
    cols = maxCols;
    grid = Array.from({ length: rows }, () => Array(cols).fill(EMPTY));
    player = null;
    doorPos = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < data[r].length; c++) {
        const ch = data[r][c];
        if (ch === 'x') grid[r][c] = WALL;
        else if (ch === '0') grid[r][c] = BLOCK;
        else if (ch === '!') {
          // '!' is the DOOR/GOAL
          doorPos = { r, c };
          grid[r][c] = DOOR;
        }
        else if (ch === '<' || ch === '>') {
          // '<'/'>' is the PLAYER with facing direction
          player = { r, c };
          facing = ch === '>' ? 1 : -1;
          grid[r][c] = EMPTY;
        }
      }
    }

    // If player not found, default
    if (!player) player = { r: 0, c: 0 };
    if (!doorPos) doorPos = { r: 0, c: cols - 1 };

    carrying = false;
    moves = 0;
    won = false;

    // Calculate tile size
    resizeCanvas();
  }

  function resizeCanvas() {
    const maxW = Math.min(672, window.innerWidth - 40);
    tileSize = Math.floor(maxW / cols);
    if (tileSize * rows > 500) tileSize = Math.floor(500 / rows);
    tileSize = Math.max(16, Math.min(tileSize, 32));
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
  }

  function issolid(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return true;
    return grid[r][c] === WALL || grid[r][c] === BLOCK;
  }

  function isEmpty(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    return grid[r][c] === EMPTY || grid[r][c] === DOOR;
  }

  function applyGravity() {
    // Player gravity
    while (player.r + 1 < rows && isEmpty(player.r + 1, player.c)) {
      player.r++;
    }
  }

  function isEmptyNotDoor(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    return grid[r][c] === EMPTY;
  }

  function applyBlockGravity() {
    // Make all blocks fall (but never onto the door)
    let changed = true;
    while (changed) {
      changed = false;
      for (let r = rows - 2; r >= 0; r--) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === BLOCK && r + 1 < rows && isEmptyNotDoor(r + 1, c)) {
            grid[r + 1][c] = BLOCK;
            grid[r][c] = EMPTY;
            changed = true;
          }
        }
      }
    }
  }

  function movePlayer(dir) {
    if (won) return;
    facing = dir;

    const nc = player.c + dir;
    const nr = player.r;

    // Check if target is in bounds
    if (nc < 0 || nc >= cols) return;

    // Walk on same level
    if (isEmpty(nr, nc)) {
      player.c = nc;
      applyGravity();
      moves++;
      checkWin();
      return;
    }

    // Climb up one block
    if (issolid(nr, nc) && nr - 1 >= 0 && isEmpty(nr - 1, nc)) {
      // Make sure there's room above (if carrying)
      if (carrying && nr - 2 >= 0 && !isEmpty(nr - 2, nc)) return;
      if (carrying && nr - 2 < 0) return;

      // Check nothing blocking above player currently
      if (!isEmpty(nr - 1, player.c) && grid[nr - 1][player.c] !== DOOR) return;
      if (carrying && (nr - 2 < 0 || !isEmpty(nr - 2, player.c))) return;

      player.c = nc;
      player.r = nr - 1;
      applyGravity();
      moves++;
      checkWin();
      return;
    }
  }

  function pickupOrPlace() {
    if (won) return;

    const fc = player.c + facing;

    if (carrying) {
      // Place block in front
      if (fc < 0 || fc >= cols) return;

      const aboveFront = player.r - 1;
      if (aboveFront < 0) return;

      // Option 1: front at same level AND above-front are both empty -> drop in front, gravity applies
      if (isEmptyNotDoor(player.r, fc) && isEmptyNotDoor(aboveFront, fc)) {
        grid[player.r][fc] = BLOCK;
        applyBlockGravity();
        carrying = false;
        moves++;
        return;
      }

      // Option 2: obstacle in front but above-front is empty -> place on top
      if (isEmptyNotDoor(aboveFront, fc)) {
        grid[aboveFront][fc] = BLOCK;
        carrying = false;
        moves++;
        return;
      }
    } else {
      // Pick up block in front at same level
      if (fc >= 0 && fc < cols && grid[player.r][fc] === BLOCK) {
        // Make sure nothing on top of the block
        if (player.r - 1 >= 0 && issolid(player.r - 1, fc)) return;
        // Make sure room above player head
        if (player.r - 1 < 0) return;
        if (!isEmpty(player.r - 1, player.c)) return;

        grid[player.r][fc] = EMPTY;
        applyBlockGravity();
        carrying = true;
        moves++;
        return;
      }
    }
  }

  function checkWin() {
    if (player.r === doorPos.r && player.c === doorPos.c) {
      won = true;
      if (currentLevel + 1 > savedProgress) {
        savedProgress = currentLevel + 1;
        localStorage.setItem('bd-progress', savedProgress);
      }
      draw();
      setTimeout(() => {
        if (currentLevel < window.LEVELS.length - 1) {
          currentLevel++;
          loadLevel();
        } else {
          alert('You completed all levels!');
        }
      }, 600);
    }
  }

  function loadLevel() {
    parseLevel(currentLevel);
    levelDisplay.textContent = `Level ${currentLevel + 1}`;
    movesDisplay.textContent = 'Moves: 0';
    draw();
  }

  // ---- DRAWING ----

  function drawTile(c, r, color, hiColor, shColor) {
    const x = c * tileSize;
    const y = r * tileSize;
    const s = tileSize;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, s, s);

    // Highlight top-left
    ctx.fillStyle = hiColor;
    ctx.fillRect(x, y, s, 2);
    ctx.fillRect(x, y, 2, s);

    // Shadow bottom-right
    ctx.fillStyle = shColor;
    ctx.fillRect(x, y + s - 2, s, 2);
    ctx.fillRect(x + s - 2, y, 2, s);
  }

  function draw() {
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = COL.grid;
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * tileSize, 0);
      ctx.lineTo(c * tileSize, canvas.height);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * tileSize);
      ctx.lineTo(canvas.width, r * tileSize);
      ctx.stroke();
    }

    // Tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === WALL) {
          drawTile(c, r, COL.wall, COL.wallHi, COL.wallSh);
        } else if (grid[r][c] === BLOCK) {
          drawTile(c, r, COL.block, COL.blockHi, COL.blockSh);
        } else if (grid[r][c] === DOOR) {
          // Door glow
          const gx = (c + 0.5) * tileSize;
          const gy = (r + 0.5) * tileSize;
          const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, tileSize * 1.5);
          glow.addColorStop(0, COL.doorGlow);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(gx - tileSize * 1.5, gy - tileSize * 1.5, tileSize * 3, tileSize * 3);

          // Door shape
          const dx = c * tileSize + 3;
          const dy = r * tileSize + 2;
          const dw = tileSize - 6;
          const dh = tileSize - 2;
          ctx.fillStyle = COL.door;
          ctx.beginPath();
          ctx.moveTo(dx, dy + dh);
          ctx.lineTo(dx, dy + dw * 0.3);
          ctx.arc(dx + dw / 2, dy + dw * 0.3, dw / 2, Math.PI, 0);
          ctx.lineTo(dx + dw, dy + dh);
          ctx.closePath();
          ctx.fill();

          // Door knob
          ctx.fillStyle = COL.bg;
          ctx.beginPath();
          ctx.arc(dx + dw * 0.65, dy + dh * 0.55, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Player
    drawPlayer(player.c, player.r, facing);

    // Carried block
    if (carrying) {
      const bx = player.c * tileSize;
      const by = (player.r - 1) * tileSize;
      ctx.fillStyle = COL.carried;
      ctx.fillRect(bx + 2, by + 2, tileSize - 4, tileSize - 4);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(bx + 2, by + 2, tileSize - 4, 2);
      ctx.fillRect(bx + 2, by + 2, 2, tileSize - 4);
    }

    movesDisplay.textContent = `Moves: ${moves}`;
  }

  function drawPlayer(col, row, dir) {
    const x = col * tileSize;
    const y = row * tileSize;
    const s = tileSize;

    // Body
    ctx.fillStyle = COL.player;
    ctx.fillRect(x + 4, y + s * 0.3, s - 8, s * 0.65);

    // Head
    ctx.fillStyle = COL.player;
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s * 0.3, s * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    const eyeX = x + s / 2 + dir * s * 0.1;
    const eyeY = y + s * 0.26;
    ctx.fillStyle = COL.eye;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, s * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = COL.playerDark;
    ctx.fillRect(x + s * 0.25, y + s * 0.85, s * 0.2, s * 0.15);
    ctx.fillRect(x + s * 0.55, y + s * 0.85, s * 0.2, s * 0.15);
  }

  // ---- INPUT ----

  document.addEventListener('keydown', e => {
    if (won) return;
    switch (e.key) {
      case 'ArrowLeft': case 'a': case 'A':
        e.preventDefault();
        movePlayer(-1);
        draw();
        break;
      case 'ArrowRight': case 'd': case 'D':
        e.preventDefault();
        movePlayer(1);
        draw();
        break;
      case 'ArrowUp': case 'w': case 'W': case ' ':
        e.preventDefault();
        pickupOrPlace();
        draw();
        break;
    }
  });

  // Mobile buttons
  arrowBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (won) return;
      const action = btn.dataset.action;
      if (action === 'left') movePlayer(-1);
      else if (action === 'right') movePlayer(1);
      else if (action === 'pickup') pickupOrPlace();
      draw();
    });
  });

  // Control buttons
  btnRestart.addEventListener('click', () => {
    loadLevel();
  });

  btnPrev.addEventListener('click', () => {
    if (currentLevel > 0) {
      currentLevel--;
      loadLevel();
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentLevel < window.LEVELS.length - 1) {
      currentLevel++;
      loadLevel();
    }
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
  });

  // Start
  loadLevel();
})();
