(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('high-score');
  const speedEl = document.getElementById('speed-display');
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlay-text');
  const startBtn = document.getElementById('start-btn');
  const arrowBtns = document.querySelectorAll('.arrow-btn');

  const GRID = 20;
  const COLS = 20;
  const ROWS = 20;

  // Sounder colors
  const COLORS = {
    bg: '#060910',
    grid: '#1a003a',
    snakeHead: '#22d3ee',
    snakeBody: '#1AAB9E',
    snakeTail: '#148077',
    food: '#ec4899',
    foodGlow: 'rgba(236, 72, 153, 0.3)',
    particle: '#ec4899'
  };

  let snake, dir, nextDir, food, score, highScore, gameLoop, running, speed, particles;

  highScore = parseInt(localStorage.getItem('snake-best') || '0', 10);
  highScoreEl.textContent = `Best: ${highScore}`;

  function resize() {
    const size = canvas.clientWidth;
    canvas.width = size;
    canvas.height = size;
  }
  window.addEventListener('resize', resize);
  resize();

  function init() {
    const mid = Math.floor(ROWS / 2);
    snake = [
      { x: 5, y: mid },
      { x: 4, y: mid },
      { x: 3, y: mid }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    speed = 1;
    particles = [];
    scoreEl.textContent = 'Score: 0';
    speedEl.textContent = 'Speed: 1';
    placeFood();
  }

  function placeFood() {
    const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (occupied.has(`${pos.x},${pos.y}`));
    food = pos;
  }

  function spawnParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      particles.push({
        x: (x + 0.5) * cellSize(),
        y: (y + 0.5) * cellSize(),
        vx: Math.cos(angle) * (2 + Math.random() * 2),
        vy: Math.sin(angle) * (2 + Math.random() * 2),
        life: 1
      });
    }
  }

  function cellSize() {
    return canvas.width / COLS;
  }

  function update() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall wrap
    if (head.x < 0) head.x = COLS - 1;
    if (head.x >= COLS) head.x = 0;
    if (head.y < 0) head.y = ROWS - 1;
    if (head.y >= ROWS) head.y = 0;

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOverSequence();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      spawnParticles(food.x, food.y);

      // Speed up every 5 points
      const newSpeed = Math.floor(score / 5) + 1;
      if (newSpeed !== speed) {
        speed = newSpeed;
        speedEl.textContent = `Speed: ${speed}`;
        clearInterval(gameLoop);
        gameLoop = setInterval(tick, Math.max(40, 120 - (speed - 1) * 10));
      }

      if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = `Best: ${highScore}`;
        localStorage.setItem('snake-best', highScore);
      }
      placeFood();
    } else {
      snake.pop();
    }
  }

  function draw() {
    const cs = cellSize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cs, 0);
      ctx.lineTo(i * cs, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cs);
      ctx.lineTo(canvas.width, i * cs);
      ctx.stroke();
    }

    // Food glow
    const fx = (food.x + 0.5) * cs;
    const fy = (food.y + 0.5) * cs;
    const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, cs * 1.5);
    glow.addColorStop(0, COLORS.foodGlow);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(food.x * cs - cs, food.y * cs - cs, cs * 3, cs * 3);

    // Food
    ctx.fillStyle = COLORS.food;
    ctx.shadowColor = COLORS.food;
    ctx.shadowBlur = 10;
    roundRect(food.x * cs + 1, food.y * cs + 1, cs - 2, cs - 2, 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    for (let i = snake.length - 1; i >= 0; i--) {
      const s = snake[i];
      const t = i / snake.length;

      if (i === 0) {
        ctx.fillStyle = COLORS.snakeHead;
        ctx.shadowColor = COLORS.snakeHead;
        ctx.shadowBlur = 8;
      } else if (t < 0.5) {
        ctx.fillStyle = COLORS.snakeBody;
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = COLORS.snakeTail;
        ctx.shadowBlur = 0;
      }

      const pad = i === 0 ? 0.5 : 1;
      roundRect(s.x * cs + pad, s.y * cs + pad, cs - pad * 2, cs - pad * 2, i === 0 ? 5 : 3);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Eyes on head
    const head = snake[0];
    const ex = head.x * cs + cs * 0.5;
    const ey = head.y * cs + cs * 0.5;
    const eyeOff = cs * 0.18;
    const eyeR = cs * 0.08;

    ctx.fillStyle = '#060910';
    if (dir.x === 1) {
      ctx.beginPath(); ctx.arc(ex + eyeOff, ey - eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex + eyeOff, ey + eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
    } else if (dir.x === -1) {
      ctx.beginPath(); ctx.arc(ex - eyeOff, ey - eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex - eyeOff, ey + eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
    } else if (dir.y === -1) {
      ctx.beginPath(); ctx.arc(ex - eyeOff, ey - eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex + eyeOff, ey - eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(ex - eyeOff, ey + eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex + eyeOff, ey + eyeOff, eyeR, 0, Math.PI * 2); ctx.fill();
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = COLORS.particle;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function tick() {
    update();
    draw();
  }

  function start() {
    if (running) return;
    running = true;
    overlay.classList.add('hidden');
    init();
    gameLoop = setInterval(tick, 120);
    draw();
  }

  function gameOverSequence() {
    running = false;
    clearInterval(gameLoop);
    overlayText.innerHTML = `Game Over!<br><span class="sub">Score: ${score}</span>`;
    startBtn.textContent = 'Play Again';
    overlay.classList.remove('hidden');
  }

  // Keyboard controls
  document.addEventListener('keydown', e => {
    const map = {
      ArrowUp:    { x: 0, y: -1 },
      ArrowDown:  { x: 0, y: 1 },
      ArrowLeft:  { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }
    };
    const nd = map[e.key];
    if (!nd) return;
    e.preventDefault();

    if (!running) { start(); return; }

    // Prevent 180 turn
    if (nd.x !== -dir.x || nd.y !== -dir.y) {
      nextDir = nd;
    }
  });

  // Mobile controls
  arrowBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dirMap = {
        up:    { x: 0, y: -1 },
        down:  { x: 0, y: 1 },
        left:  { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      };
      const nd = dirMap[btn.dataset.dir];
      if (!running) { start(); return; }
      if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
    });
  });

  // Touch swipe
  let touchX, touchY;
  canvas.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    if (!touchX) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;

    let nd;
    if (Math.abs(dx) > Math.abs(dy)) nd = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    else nd = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };

    if (!running) { start(); return; }
    if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
    touchX = null;
  }, { passive: true });

  startBtn.addEventListener('click', start);

  // Initial draw
  init();
  draw();
})();
