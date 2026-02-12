(() => {
  const boardEl = document.getElementById('board');
  const mineCountEl = document.getElementById('mine-count');
  const timerEl = document.getElementById('timer');
  const gameMessage = document.getElementById('game-message');
  const newGameBtn = document.getElementById('new-game-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  const diffBtns = document.querySelectorAll('.diff-btn');

  const CONFIGS = {
    easy:   { rows: 9,  cols: 9,  mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard:   { rows: 16, cols: 30, mines: 99 }
  };

  let rows, cols, totalMines, grid, revealed, flagged, cellEls;
  let gameOver, firstClick, flagCount, timerInterval, seconds;
  let difficulty = 'easy';

  function init() {
    const cfg = CONFIGS[difficulty];
    rows = cfg.rows;
    cols = cfg.cols;
    totalMines = cfg.mines;

    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    flagged = Array.from({ length: rows }, () => Array(cols).fill(false));

    gameOver = false;
    firstClick = true;
    flagCount = 0;
    seconds = 0;
    clearInterval(timerInterval);
    timerEl.textContent = '00:00';
    mineCountEl.textContent = totalMines;
    gameMessage.classList.add('hidden');

    buildBoard();
  }

  function placeMines(safeR, safeC) {
    let placed = 0;
    while (placed < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      // Keep safe zone around first click
      if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
      if (grid[r][c] === -1) continue;
      grid[r][c] = -1;
      placed++;
    }
    // Calculate numbers
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === -1) continue;
        let count = 0;
        forNeighbors(r, c, (nr, nc) => {
          if (grid[nr][nc] === -1) count++;
        });
        grid[r][c] = count;
      }
    }
  }

  function forNeighbors(r, c, fn) {
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) fn(nr, nc);
      }
  }

  function buildBoard() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    cellEls = [];

    for (let r = 0; r < rows; r++) {
      cellEls[r] = [];
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => handleClick(r, c));
        cell.addEventListener('contextmenu', e => {
          e.preventDefault();
          handleFlag(r, c);
        });
        boardEl.appendChild(cell);
        cellEls[r][c] = cell;
      }
    }
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      seconds++;
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000);
  }

  function handleClick(r, c) {
    if (gameOver || flagged[r][c] || revealed[r][c]) return;

    if (firstClick) {
      firstClick = false;
      placeMines(r, c);
      startTimer();
    }

    if (grid[r][c] === -1) {
      // Hit a mine
      revealMines(r, c);
      endGame(false);
      return;
    }

    reveal(r, c);
    checkWin();
  }

  function reveal(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (revealed[r][c] || flagged[r][c]) return;

    revealed[r][c] = true;
    const cell = cellEls[r][c];
    cell.classList.add('revealed');

    if (grid[r][c] > 0) {
      cell.textContent = grid[r][c];
      cell.classList.add(`n${grid[r][c]}`);
    } else if (grid[r][c] === 0) {
      // Flood fill empty cells
      forNeighbors(r, c, (nr, nc) => reveal(nr, nc));
    }
  }

  function handleFlag(r, c) {
    if (gameOver || revealed[r][c]) return;

    if (flagged[r][c]) {
      flagged[r][c] = false;
      cellEls[r][c].classList.remove('flagged');
      flagCount--;
    } else {
      flagged[r][c] = true;
      cellEls[r][c].classList.add('flagged');
      flagCount++;
    }
    mineCountEl.textContent = totalMines - flagCount;
  }

  function revealMines(hitR, hitC) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === -1) {
          cellEls[r][c].classList.add('revealed', 'mine-shown');
          if (r === hitR && c === hitC) {
            cellEls[r][c].classList.add('mine-hit');
          }
        }
      }
    }
  }

  function checkWin() {
    let unrevealedSafe = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c] !== -1 && !revealed[r][c]) unrevealedSafe++;

    if (unrevealedSafe === 0) {
      endGame(true);
    }
  }

  function endGame(won) {
    gameOver = true;
    clearInterval(timerInterval);
    const msg = gameMessage.querySelector('p');
    if (won) {
      msg.textContent = `Cleared in ${timerEl.textContent}!`;
      gameMessage.classList.remove('lost');
      // Auto-flag remaining mines
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (grid[r][c] === -1 && !flagged[r][c]) {
            flagged[r][c] = true;
            cellEls[r][c].classList.add('flagged');
          }
      mineCountEl.textContent = '0';
    } else {
      msg.textContent = 'BOOM!';
      gameMessage.classList.add('lost');
    }
    gameMessage.classList.remove('hidden');
  }

  // Difficulty buttons
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      difficulty = btn.dataset.diff;
      init();
    });
  });

  newGameBtn.addEventListener('click', init);
  playAgainBtn.addEventListener('click', init);

  init();
})();
