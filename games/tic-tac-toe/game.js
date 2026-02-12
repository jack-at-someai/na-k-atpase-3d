(() => {
  const cells = document.querySelectorAll('.cell');
  const message = document.getElementById('message');
  const resetBtn = document.getElementById('reset-btn');
  const scoreXEl = document.getElementById('score-x');
  const scoreOEl = document.getElementById('score-o');
  const playerXEl = document.querySelector('.player-x');
  const playerOEl = document.querySelector('.player-o');

  const HUMAN = 'X';
  const AI = 'O';

  const WINS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let board, turn, gameOver, scoreX, scoreO;

  scoreX = 0;
  scoreO = 0;

  function init() {
    board = Array(9).fill(null);
    turn = HUMAN;
    gameOver = false;
    message.textContent = "Your turn";
    message.className = 'message';
    playerXEl.classList.add('active');
    playerOEl.classList.remove('active');
    cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
    });
  }

  function checkWin(mark) {
    for (const [a, b, c] of WINS) {
      if (board[a] === mark && board[b] === mark && board[c] === mark) {
        return [a, b, c];
      }
    }
    return null;
  }

  function isBoardFull() {
    return board.every(c => c !== null);
  }

  // Minimax algorithm
  function minimax(b, isMaximizing) {
    // Terminal checks
    if (checkWinBoard(b, AI)) return 10;
    if (checkWinBoard(b, HUMAN)) return -10;
    if (b.every(c => c !== null)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = AI;
          best = Math.max(best, minimax(b, false));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = HUMAN;
          best = Math.min(best, minimax(b, true));
          b[i] = null;
        }
      }
      return best;
    }
  }

  function checkWinBoard(b, mark) {
    for (const [a, bc, c] of WINS) {
      if (b[a] === mark && b[bc] === mark && b[c] === mark) return true;
    }
    return false;
  }

  function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = AI;
        const score = minimax(board, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  function placeMove(idx, mark) {
    board[idx] = mark;
    cells[idx].textContent = mark;
    cells[idx].classList.add(mark.toLowerCase(), 'taken');
  }

  function handleResult(mark) {
    const winCombo = checkWin(mark);
    if (winCombo) {
      gameOver = true;
      if (mark === HUMAN) {
        message.textContent = 'You win!';
        scoreX++;
        scoreXEl.textContent = scoreX;
      } else {
        message.textContent = 'AI wins!';
        scoreO++;
        scoreOEl.textContent = scoreO;
      }
      message.className = 'message win';
      winCombo.forEach(i => cells[i].classList.add('win-cell'));
      return true;
    }
    if (isBoardFull()) {
      gameOver = true;
      message.textContent = "It's a draw!";
      message.className = 'message draw';
      return true;
    }
    return false;
  }

  function aiMove() {
    if (gameOver) return;
    const move = getBestMove();
    if (move === -1) return;

    placeMove(move, AI);

    if (!handleResult(AI)) {
      turn = HUMAN;
      message.textContent = 'Your turn';
      playerXEl.classList.add('active');
      playerOEl.classList.remove('active');
    }
  }

  function handleClick(e) {
    if (gameOver || turn !== HUMAN) return;
    const idx = parseInt(e.target.dataset.index);
    if (board[idx] !== null) return;

    placeMove(idx, HUMAN);

    if (handleResult(HUMAN)) return;

    turn = AI;
    message.textContent = 'AI is thinking...';
    playerXEl.classList.remove('active');
    playerOEl.classList.add('active');

    setTimeout(aiMove, 300);
  }

  cells.forEach(cell => cell.addEventListener('click', handleClick));
  resetBtn.addEventListener('click', init);

  init();
})();
