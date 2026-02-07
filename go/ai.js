// Go AI - multiple difficulty levels using heuristics and Monte Carlo Tree Search

const GoAI = (() => {

  // Simple eye detection (don't fill your own eyes)
  function isEye(engine, r, c, color) {
    if (engine.board[r][c] !== 0) return false;
    const nbrs = engine.adj(r, c);
    if (!nbrs.every(([nr, nc]) => engine.board[nr][nc] === color)) return false;
    const diags = [[r-1,c-1],[r-1,c+1],[r+1,c-1],[r+1,c+1]]
      .filter(([dr, dc]) => engine.inBounds(dr, dc));
    const friendly = diags.filter(([dr, dc]) => engine.board[dr][dc] === color).length;
    const needed = diags.length <= 2 ? diags.length : diags.length - 1;
    return friendly >= needed;
  }

  // ---- Random AI ----
  function randomMove(engine) {
    const moves = engine.validMoves();
    if (!moves.length) return null;
    const good = moves.filter(([r, c]) => !isEye(engine, r, c, engine.current));
    const pool = good.length ? good : moves;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ---- Easy AI: greedy one-ply evaluation ----
  function evaluate(engine, color) {
    const terr = engine.territory();
    let score = 0;
    const opp = engine.opp(color);
    for (let r = 0; r < engine.size; r++) {
      for (let c = 0; c < engine.size; c++) {
        const v = engine.board[r][c] || terr[r][c];
        if (v === color) score++;
        else if (v === opp) score--;
      }
    }
    score += (engine.captures[color] - engine.captures[opp]) * 1.5;
    return score;
  }

  function easyMove(engine) {
    const moves = engine.validMoves();
    if (!moves.length) return null;
    const color = engine.current;
    let best = -Infinity;
    let bestMoves = [];

    for (const [r, c] of moves) {
      if (isEye(engine, r, c, color)) continue;
      const sim = engine.clone();
      sim.play(r, c);
      const s = evaluate(sim, color);
      if (s > best) { best = s; bestMoves = [[r, c]]; }
      else if (s === best) bestMoves.push([r, c]);
    }
    if (!bestMoves.length) return randomMove(engine);
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  // ---- MCTS ----
  class MCTSNode {
    constructor(engine, move, parent) {
      this.engine = engine;
      this.move = move;
      this.parent = parent;
      this.children = [];
      this.wins = 0;
      this.visits = 0;
      this._untried = null;
    }

    untried() {
      if (this._untried === null) {
        this._untried = this.engine.over ? [] :
          this.engine.validMoves().filter(
            ([r, c]) => !isEye(this.engine, r, c, this.engine.current)
          );
      }
      return this._untried;
    }

    ucb1() {
      if (this.visits === 0) return Infinity;
      return (this.wins / this.visits) +
        1.414 * Math.sqrt(Math.log(this.parent.visits) / this.visits);
    }

    bestChild() {
      let best = null, bestVal = -Infinity;
      for (const ch of this.children) {
        const v = ch.ucb1();
        if (v > bestVal) { bestVal = v; best = ch; }
      }
      return best;
    }

    expand() {
      const ut = this.untried();
      if (!ut.length) return null;
      const idx = Math.floor(Math.random() * ut.length);
      const move = ut.splice(idx, 1)[0];
      const sim = this.engine.clone();
      sim.play(move[0], move[1]);
      const child = new MCTSNode(sim, move, this);
      this.children.push(child);
      return child;
    }
  }

  function simulate(engine) {
    const sim = engine.clone();
    let passes = 0;
    let count = 0;
    const max = sim.size * sim.size * 3;

    while (passes < 2 && count < max && !sim.over) {
      const empty = [];
      for (let r = 0; r < sim.size; r++)
        for (let c = 0; c < sim.size; c++)
          if (sim.board[r][c] === 0) empty.push([r, c]);

      // Shuffle
      for (let i = empty.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [empty[i], empty[j]] = [empty[j], empty[i]];
      }

      let placed = false;
      for (const [r, c] of empty) {
        if (isEye(sim, r, c, sim.current)) continue;
        if (sim.canPlay(r, c, sim.current)) {
          sim.play(r, c);
          placed = true;
          passes = 0;
          break;
        }
      }
      if (!placed) { sim.pass(); passes++; }
      count++;
    }
    return sim.score();
  }

  function mctsSearch(engine, iterations) {
    const root = new MCTSNode(engine.clone(), null, null);

    for (let i = 0; i < iterations; i++) {
      // Selection
      let node = root;
      while (node.untried().length === 0 && node.children.length > 0) {
        node = node.bestChild();
      }
      // Expansion
      if (node.untried().length > 0) {
        const child = node.expand();
        if (child) node = child;
      }
      // Simulation
      const result = simulate(node.engine);
      const winner = result.black > result.white ? 1 : 2;
      // Backpropagation
      let n = node;
      while (n) {
        n.visits++;
        const mover = 3 - n.engine.current;
        if (mover === winner) n.wins++;
        n = n.parent;
      }
    }

    if (!root.children.length) return null;
    return root.children.reduce((a, b) => a.visits > b.visits ? a : b).move;
  }

  // Iteration counts per difficulty and board size
  const MCTS_ITERS = {
    medium: { 9: 400, 13: 200, 19: 100 },
    hard:   { 9: 1500, 13: 600, 19: 250 },
  };

  // ---- Public API ----
  return {
    isEye,

    getMove(engine, difficulty) {
      switch (difficulty) {
        case 'random': return randomMove(engine);
        case 'easy':   return easyMove(engine);
        case 'medium': return mctsSearch(engine, MCTS_ITERS.medium[engine.size] || 200);
        case 'hard':   return mctsSearch(engine, MCTS_ITERS.hard[engine.size] || 500);
        default:       return randomMove(engine);
      }
    },

    // Async wrapper to keep UI responsive
    async getMoveAsync(engine, difficulty) {
      // Yield to UI before heavy computation
      await new Promise(r => setTimeout(r, 10));
      return this.getMove(engine, difficulty);
    }
  };
})();
