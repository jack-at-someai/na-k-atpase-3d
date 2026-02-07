(() => {
  const SIZE = 4;
  let grid, score, bestScore, gameOver, won;

  const scoreEl = document.getElementById('score');
  const bestScoreEl = document.getElementById('best-score');
  const tileContainer = document.getElementById('tile-container');
  const gameBoard = document.getElementById('game-board');
  const gameMessage = document.getElementById('game-message');
  const newGameBtn = document.getElementById('new-game-btn');
  const retryBtn = document.getElementById('retry-btn');

  // Build grid background cells
  const gridBg = document.querySelector('.grid-background');
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    gridBg.appendChild(cell);
  }

  // Load best score
  bestScore = parseInt(localStorage.getItem('2048-best') || '0', 10);
  bestScoreEl.textContent = bestScore;

  function init() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    score = 0;
    gameOver = false;
    won = false;
    scoreEl.textContent = '0';
    gameMessage.classList.add('hidden');
    gameMessage.classList.remove('game-won');
    addRandomTile();
    addRandomTile();
    render();
  }

  function addRandomTile() {
    const empty = [];
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (grid[r][c] === 0) empty.push({ r, c });
    if (empty.length === 0) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return { r, c };
  }

  function render(newTile, mergedPositions) {
    tileContainer.innerHTML = '';
    const boardWidth = gameBoard.offsetWidth;
    const padding = 12;
    const gap = 12;
    const cellSize = (boardWidth - padding * 2 - gap * (SIZE - 1)) / SIZE;

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = grid[r][c];
        if (val === 0) continue;

        const tile = document.createElement('div');
        const displayClass = val <= 2048 ? `tile-${val}` : 'tile-super';
        tile.className = `tile ${displayClass}`;

        // Font sizing
        let fontSize;
        if (val < 100) fontSize = cellSize * 0.5;
        else if (val < 1000) fontSize = cellSize * 0.4;
        else fontSize = cellSize * 0.3;

        tile.style.width = `${cellSize}px`;
        tile.style.height = `${cellSize}px`;
        tile.style.top = `${padding + r * (cellSize + gap)}px`;
        tile.style.left = `${padding + c * (cellSize + gap)}px`;
        tile.style.fontSize = `${fontSize}px`;
        tile.textContent = val;

        if (newTile && newTile.r === r && newTile.c === c) {
          tile.classList.add('new');
        }
        if (mergedPositions && mergedPositions.some(p => p.r === r && p.c === c)) {
          tile.classList.add('merged');
        }

        tileContainer.appendChild(tile);
      }
    }
  }

  function slide(row) {
    let arr = row.filter(v => v !== 0);
    const merged = [];
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        merged.push(i);
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(v => v !== 0);
    while (arr.length < SIZE) arr.push(0);
    return { result: arr, merged };
  }

  function move(direction) {
    if (gameOver) return;

    const prev = grid.map(r => [...r]);
    const mergedPositions = [];

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < SIZE; r++) {
        let row = [...grid[r]];
        if (direction === 'right') row.reverse();
        const { result, merged } = slide(row);
        if (direction === 'right') {
          result.reverse();
          merged.forEach(i => {
            mergedPositions.push({ r, c: SIZE - 1 - i });
          });
        } else {
          merged.forEach(i => mergedPositions.push({ r, c: i }));
        }
        grid[r] = result;
      }
    } else {
      for (let c = 0; c < SIZE; c++) {
        let col = [];
        for (let r = 0; r < SIZE; r++) col.push(grid[r][c]);
        if (direction === 'down') col.reverse();
        const { result, merged } = slide(col);
        if (direction === 'down') {
          result.reverse();
          merged.forEach(i => {
            mergedPositions.push({ r: SIZE - 1 - i, c });
          });
        } else {
          merged.forEach(i => mergedPositions.push({ r: i, c }));
        }
        for (let r = 0; r < SIZE; r++) grid[r][c] = result[r];
      }
    }

    // Check if anything moved
    let moved = false;
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (grid[r][c] !== prev[r][c]) moved = true;

    if (!moved) return;

    // Update score
    scoreEl.textContent = score;
    if (score > bestScore) {
      bestScore = score;
      bestScoreEl.textContent = bestScore;
      localStorage.setItem('2048-best', bestScore);
    }

    const newTile = addRandomTile();
    render(newTile, mergedPositions);

    // Check win
    if (!won) {
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
          if (grid[r][c] === 2048) {
            won = true;
            showMessage('You Win!', true);
            return;
          }
    }

    // Check game over
    if (isGameOver()) {
      gameOver = true;
      showMessage('Game Over!', false);
    }
  }

  function isGameOver() {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) return false;
        if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
        if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
      }
    return true;
  }

  function showMessage(text, isWin) {
    gameMessage.querySelector('p').textContent = text;
    gameMessage.classList.remove('hidden');
    if (isWin) gameMessage.classList.add('game-won');
    else gameMessage.classList.remove('game-won');
  }

  // Keyboard controls
  document.addEventListener('keydown', e => {
    const map = {
      ArrowUp: 'up', ArrowDown: 'down',
      ArrowLeft: 'left', ArrowRight: 'right'
    };
    if (map[e.key]) {
      e.preventDefault();
      move(map[e.key]);
    }
  });

  // Touch / swipe controls
  let touchStartX, touchStartY;
  gameBoard.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  gameBoard.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const minSwipe = 30;

    if (Math.max(absDx, absDy) < minSwipe) return;

    if (absDx > absDy) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  // Handle resize
  window.addEventListener('resize', () => render());

  // Buttons
  newGameBtn.addEventListener('click', init);
  retryBtn.addEventListener('click', init);

  // Start
  init();
})();
