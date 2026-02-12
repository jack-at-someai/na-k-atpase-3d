(() => {
  const boardEl = document.getElementById('board');
  const timerEl = document.getElementById('timer');
  const mistakesEl = document.getElementById('mistakes');
  const gameMessage = document.getElementById('game-message');
  const newGameBtn = document.getElementById('new-game-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  const diffBtns = document.querySelectorAll('.diff-btn');
  const numBtns = document.querySelectorAll('.num-btn');

  const MAX_MISTAKES = 3;
  let solution, puzzle, cellEls, selected, mistakes, timerInterval, seconds, difficulty, gameOver;

  difficulty = 'easy';

  // Difficulty: how many cells to remove
  const REMOVE = { easy: 36, medium: 45, hard: 54 };

  // Generate a valid completed sudoku board
  function generateSolution() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValid(board, row, col, num) {
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
      }
      const br = Math.floor(row / 3) * 3;
      const bc = Math.floor(col / 3) * 3;
      for (let r = br; r < br + 3; r++)
        for (let c = bc; c < bc + 3; c++)
          if (board[r][c] === num) return false;
      return true;
    }

    function fill(board) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            const nums = shuffle([1,2,3,4,5,6,7,8,9]);
            for (const n of nums) {
              if (isValid(board, r, c, n)) {
                board[r][c] = n;
                if (fill(board)) return true;
                board[r][c] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    fill(board);
    return board;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generatePuzzle(sol, removeCount) {
    const p = sol.map(r => [...r]);
    const positions = shuffle(
      Array.from({ length: 81 }, (_, i) => i)
    );
    for (let i = 0; i < removeCount; i++) {
      const idx = positions[i];
      p[Math.floor(idx / 9)][idx % 9] = 0;
    }
    return p;
  }

  function buildBoard() {
    boardEl.innerHTML = '';
    cellEls = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        // 3x3 box borders
        if (c === 2 || c === 5) cell.classList.add('border-right');
        if (r === 2 || r === 5) cell.classList.add('border-bottom');

        if (puzzle[r][c] !== 0) {
          cell.textContent = puzzle[r][c];
          cell.classList.add('given');
        }

        cell.addEventListener('click', () => selectCell(r, c));
        boardEl.appendChild(cell);
        cellEls.push(cell);
      }
    }
  }

  function selectCell(row, col) {
    if (gameOver) return;
    const idx = row * 9 + col;
    const cell = cellEls[idx];

    // Deselect previous
    cellEls.forEach(c => c.classList.remove('selected', 'highlight'));

    selected = { row, col };
    cell.classList.add('selected');

    // Highlight same row, col, box
    for (let i = 0; i < 9; i++) {
      cellEls[row * 9 + i].classList.add('highlight');
      cellEls[i * 9 + col].classList.add('highlight');
    }
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++)
      for (let c = bc; c < bc + 3; c++)
        cellEls[r * 9 + c].classList.add('highlight');

    cell.classList.remove('highlight');
    cell.classList.add('selected');
  }

  function placeNumber(num) {
    if (!selected || gameOver) return;
    const { row, col } = selected;
    const idx = row * 9 + col;
    const cell = cellEls[idx];

    if (cell.classList.contains('given')) return;

    // Erase
    if (num === 0) {
      puzzle[row][col] = 0;
      cell.textContent = '';
      cell.className = 'cell';
      // Re-add borders
      if (col === 2 || col === 5) cell.classList.add('border-right');
      if (row === 2 || row === 5) cell.classList.add('border-bottom');
      cell.classList.add('selected');
      updateCompletedNums();
      return;
    }

    puzzle[row][col] = num;
    cell.textContent = num;

    // Check correctness
    if (num === solution[row][col]) {
      cell.classList.remove('error');
      cell.classList.add('filled');
    } else {
      cell.classList.remove('filled');
      cell.classList.add('error');
      mistakes++;
      mistakesEl.textContent = `Mistakes: ${mistakes}/${MAX_MISTAKES}`;
      if (mistakes >= MAX_MISTAKES) {
        endGame(false);
        return;
      }
    }

    updateCompletedNums();

    // Check win
    if (checkWin()) {
      endGame(true);
    }
  }

  function checkWin() {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (puzzle[r][c] !== solution[r][c]) return false;
    return true;
  }

  function updateCompletedNums() {
    const counts = Array(10).fill(0);
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (puzzle[r][c] === solution[r][c] && puzzle[r][c] !== 0)
          counts[puzzle[r][c]]++;

    numBtns.forEach(btn => {
      const n = parseInt(btn.dataset.num);
      if (n === 0) return;
      if (counts[n] >= 9) btn.classList.add('completed');
      else btn.classList.remove('completed');
    });
  }

  function endGame(won) {
    gameOver = true;
    clearInterval(timerInterval);
    const msg = gameMessage.querySelector('p');
    if (won) {
      msg.textContent = `Solved in ${timerEl.textContent}!`;
      gameMessage.classList.remove('lost');
    } else {
      msg.textContent = 'Too many mistakes!';
      gameMessage.classList.add('lost');
    }
    gameMessage.classList.remove('hidden');
  }

  function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerEl.textContent = '00:00';
    timerInterval = setInterval(() => {
      seconds++;
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000);
  }

  function init() {
    gameOver = false;
    selected = null;
    mistakes = 0;
    mistakesEl.textContent = `Mistakes: 0/${MAX_MISTAKES}`;
    gameMessage.classList.add('hidden');
    solution = generateSolution();
    puzzle = generatePuzzle(solution, REMOVE[difficulty]);
    buildBoard();
    updateCompletedNums();
    startTimer();
  }

  // Keyboard input
  document.addEventListener('keydown', e => {
    if (e.key >= '1' && e.key <= '9') {
      placeNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      placeNumber(0);
    } else if (e.key === 'ArrowUp' && selected) {
      selectCell(Math.max(0, selected.row - 1), selected.col);
    } else if (e.key === 'ArrowDown' && selected) {
      selectCell(Math.min(8, selected.row + 1), selected.col);
    } else if (e.key === 'ArrowLeft' && selected) {
      selectCell(selected.row, Math.max(0, selected.col - 1));
    } else if (e.key === 'ArrowRight' && selected) {
      selectCell(selected.row, Math.min(8, selected.col + 1));
    }
  });

  // Numpad clicks
  numBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const n = parseInt(btn.dataset.num);
      if (n !== 0 && btn.classList.contains('completed')) return;
      placeNumber(n);
    });
  });

  // Difficulty
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
