// Go Engine - core game rules, board management, scoring
class GoEngine {
  constructor(size = 9, komi = 6.5) {
    this.size = size;
    this.komi = komi;
    this.reset();
  }

  reset() {
    this.board = [];
    for (let i = 0; i < this.size; i++) this.board.push(new Array(this.size).fill(0));
    this.current = 1; // 1=black, 2=white
    this.captures = [0, 0, 0]; // index 0 unused; captures[1]=black's, captures[2]=white's
    this.koPoint = null;
    this.passes = 0;
    this.history = []; // for undo
    this.moves = [];
    this.lastMove = null;
    this.over = false;
  }

  opp(c) { return 3 - c; }

  inBounds(r, c) { return r >= 0 && r < this.size && c >= 0 && c < this.size; }

  adj(r, c) {
    const n = [];
    if (r > 0) n.push([r - 1, c]);
    if (r < this.size - 1) n.push([r + 1, c]);
    if (c > 0) n.push([r, c - 1]);
    if (c < this.size - 1) n.push([r, c + 1]);
    return n;
  }

  // Find connected group + liberty count
  group(r, c) {
    const color = this.board[r][c];
    if (!color) return { stones: [], liberties: 0 };
    const sz = this.size;
    const visited = new Uint8Array(sz * sz);
    const libSeen = new Uint8Array(sz * sz);
    const stones = [];
    let liberties = 0;
    const stack = [r * sz + c];

    while (stack.length) {
      const idx = stack.pop();
      if (visited[idx]) continue;
      visited[idx] = 1;
      const cr = (idx / sz) | 0, cc = idx % sz;
      if (this.board[cr][cc] !== color) continue;
      stones.push([cr, cc]);
      for (const [nr, nc] of this.adj(cr, cc)) {
        const ni = nr * sz + nc;
        if (visited[ni]) continue;
        if (this.board[nr][nc] === color) {
          stack.push(ni);
        } else if (this.board[nr][nc] === 0 && !libSeen[ni]) {
          libSeen[ni] = 1;
          liberties++;
        }
      }
    }
    return { stones, liberties };
  }

  // Check if a move is legal
  canPlay(r, c, color) {
    if (!this.inBounds(r, c) || this.board[r][c] !== 0 || this.over) return false;
    if (this.koPoint && this.koPoint[0] === r && this.koPoint[1] === c) return false;

    this.board[r][c] = color;
    let captures = false;
    for (const [nr, nc] of this.adj(r, c)) {
      if (this.board[nr][nc] === this.opp(color)) {
        if (this.group(nr, nc).liberties === 0) { captures = true; break; }
      }
    }
    if (!captures && this.group(r, c).liberties === 0) {
      this.board[r][c] = 0;
      return false;
    }
    this.board[r][c] = 0;
    return true;
  }

  saveState() {
    return {
      board: this.board.map(r => r.slice()),
      current: this.current,
      captures: this.captures.slice(),
      koPoint: this.koPoint,
      passes: this.passes,
      lastMove: this.lastMove,
      over: this.over,
    };
  }

  play(r, c) {
    const color = this.current;
    if (!this.canPlay(r, c, color)) return false;

    this.history.push(this.saveState());
    this.board[r][c] = color;

    let captured = 0;
    let singleCap = null;
    for (const [nr, nc] of this.adj(r, c)) {
      if (this.board[nr][nc] === this.opp(color)) {
        const g = this.group(nr, nc);
        if (g.liberties === 0) {
          captured += g.stones.length;
          if (g.stones.length === 1) singleCap = g.stones[0];
          for (const [sr, sc] of g.stones) this.board[sr][sc] = 0;
        }
      }
    }
    this.captures[color] += captured;

    // Ko detection
    this.koPoint = null;
    if (captured === 1 && singleCap) {
      const mg = this.group(r, c);
      if (mg.stones.length === 1 && mg.liberties === 1) {
        this.koPoint = singleCap;
      }
    }

    this.passes = 0;
    this.lastMove = [r, c];
    this.moves.push({ type: 'move', r, c, color, captured });
    this.current = this.opp(color);
    return true;
  }

  pass() {
    this.history.push(this.saveState());
    this.passes++;
    this.koPoint = null;
    this.moves.push({ type: 'pass', color: this.current });
    this.lastMove = null;
    this.current = this.opp(this.current);
    if (this.passes >= 2) this.over = true;
  }

  undo() {
    if (!this.history.length) return false;
    const s = this.history.pop();
    this.board = s.board;
    this.current = s.current;
    this.captures = s.captures;
    this.koPoint = s.koPoint;
    this.passes = s.passes;
    this.lastMove = s.lastMove;
    this.over = s.over;
    this.moves.pop();
    return true;
  }

  clone() {
    const g = new GoEngine(this.size, this.komi);
    g.board = this.board.map(r => r.slice());
    g.current = this.current;
    g.captures = this.captures.slice();
    g.koPoint = this.koPoint;
    g.passes = this.passes;
    g.lastMove = this.lastMove;
    g.over = this.over;
    return g;
  }

  validMoves(color) {
    color = color || this.current;
    const m = [];
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++)
        if (this.canPlay(r, c, color)) m.push([r, c]);
    return m;
  }

  // Territory estimation via flood fill
  territory() {
    const sz = this.size;
    const terr = [];
    for (let i = 0; i < sz; i++) terr.push(new Array(sz).fill(0));
    const visited = new Uint8Array(sz * sz);

    for (let r = 0; r < sz; r++) {
      for (let c = 0; c < sz; c++) {
        if (this.board[r][c] !== 0 || visited[r * sz + c]) continue;
        const region = [];
        const stack = [[r, c]];
        let black = false, white = false;

        while (stack.length) {
          const [cr, cc] = stack.pop();
          const idx = cr * sz + cc;
          if (!this.inBounds(cr, cc) || visited[idx]) continue;
          if (this.board[cr][cc] === 1) { black = true; continue; }
          if (this.board[cr][cc] === 2) { white = true; continue; }
          visited[idx] = 1;
          region.push([cr, cc]);
          for (const [nr, nc] of this.adj(cr, cc)) stack.push([nr, nc]);
        }

        const owner = (black && !white) ? 1 : (!black && white) ? 2 : 0;
        for (const [rr, rc] of region) terr[rr][rc] = owner;
      }
    }
    return terr;
  }

  // Chinese scoring (area = stones + territory)
  score() {
    const terr = this.territory();
    let b = 0, w = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.board[r][c] || terr[r][c];
        if (v === 1) b++;
        else if (v === 2) w++;
      }
    }
    return { black: b, white: w + this.komi };
  }

  // Get liberties for a specific position (for UI display)
  libertiesAt(r, c) {
    if (this.board[r][c] === 0) return -1;
    return this.group(r, c).liberties;
  }

  // Check if position is in atari (1 liberty)
  isAtari(r, c) {
    if (this.board[r][c] === 0) return false;
    return this.group(r, c).liberties === 1;
  }
}
