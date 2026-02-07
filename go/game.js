(() => {
  // ============================================================
  // TUTORIAL LESSONS
  // ============================================================
  const LESSONS = [
    {
      title: "What is Go?",
      steps: [
        {
          text: "Welcome to Go — the oldest strategy board game still played today, originating in China over 4,000 years ago.\n\nTwo players take turns placing black and white stones on a grid. The goal is simple: <strong>surround more territory than your opponent.</strong>",
          stones: []
        },
        {
          text: "Stones are placed on the <strong>intersections</strong> of the grid lines, not inside the squares. Once placed, stones never move — but they can be <strong>captured</strong> and removed.\n\nBlack always plays first. Let's learn the rules!",
          stones: [
            {r:2,c:2,color:1},{r:3,c:5,color:2},{r:5,c:3,color:1},{r:6,c:6,color:2},
            {r:4,c:1,color:1},{r:1,c:6,color:2}
          ]
        }
      ]
    },
    {
      title: "Liberties",
      steps: [
        {
          text: "Every stone needs <strong>liberties</strong> to survive. Liberties are the empty intersections directly adjacent to a stone (up, down, left, right — not diagonal).\n\nThe black stone in the center has <strong>4 liberties</strong>, shown as green dots.",
          stones: [{r:4,c:4,color:1}],
          markers: [{r:3,c:4,type:'liberty'},{r:5,c:4,type:'liberty'},{r:4,c:3,type:'liberty'},{r:4,c:5,type:'liberty'}]
        },
        {
          text: "A stone on the <strong>edge</strong> has only <strong>3 liberties</strong> — the board edge doesn't count as a liberty.",
          stones: [{r:4,c:0,color:1}],
          markers: [{r:3,c:0,type:'liberty'},{r:5,c:0,type:'liberty'},{r:4,c:1,type:'liberty'}]
        },
        {
          text: "A stone in the <strong>corner</strong> has only <strong>2 liberties</strong>. Corner stones are the most vulnerable!",
          stones: [{r:0,c:0,color:1}],
          markers: [{r:1,c:0,type:'liberty'},{r:0,c:1,type:'liberty'}]
        }
      ]
    },
    {
      title: "Connected Groups",
      steps: [
        {
          text: "Stones of the same color that are directly adjacent (up/down/left/right) form a <strong>group</strong>. A group shares all its liberties.\n\nThese two black stones form a group with <strong>6 liberties</strong>.",
          stones: [{r:4,c:4,color:1},{r:4,c:5,color:1}],
          markers: [
            {r:3,c:4,type:'liberty'},{r:3,c:5,type:'liberty'},
            {r:5,c:4,type:'liberty'},{r:5,c:5,type:'liberty'},
            {r:4,c:3,type:'liberty'},{r:4,c:6,type:'liberty'}
          ]
        },
        {
          text: "A larger group shares even more liberties. This L-shaped group has <strong>8 liberties</strong>.\n\nBigger groups are generally harder to capture!",
          stones: [{r:4,c:3,color:1},{r:4,c:4,color:1},{r:4,c:5,color:1},{r:5,c:5,color:1}],
          markers: [
            {r:3,c:3,type:'liberty'},{r:3,c:4,type:'liberty'},{r:3,c:5,type:'liberty'},
            {r:4,c:2,type:'liberty'},{r:4,c:6,type:'liberty'},
            {r:5,c:3,type:'liberty'},{r:5,c:4,type:'liberty'},
            {r:5,c:6,type:'liberty'},{r:6,c:5,type:'liberty'}
          ]
        },
        {
          text: "<strong>Diagonal stones are NOT connected.</strong> These two black stones are separate groups, each with their own liberties.",
          stones: [{r:4,c:4,color:1},{r:5,c:5,color:1}],
          markers: [
            {r:3,c:4,type:'liberty'},{r:4,c:3,type:'liberty'},{r:4,c:5,type:'liberty'},{r:5,c:4,type:'liberty'},
            {r:4,c:5,type:'liberty2'},{r:5,c:4,type:'liberty2'},{r:5,c:6,type:'liberty2'},{r:6,c:5,type:'liberty2'}
          ]
        }
      ]
    },
    {
      title: "Capturing Stones",
      steps: [
        {
          text: "When you fill ALL the liberties of an opponent's stone or group, you <strong>capture</strong> it — the stones are removed from the board.\n\nThis white stone has only <strong>1 liberty</strong> remaining (marked). It's in <strong>atari</strong> (one move from capture)!",
          stones: [
            {r:4,c:4,color:2},
            {r:3,c:4,color:1},{r:5,c:4,color:1},{r:4,c:3,color:1}
          ],
          markers: [{r:4,c:5,type:'atari'}]
        },
        {
          text: "Black plays at the last liberty — the white stone is captured and removed!\n\nCaptured stones count as points at the end of the game.",
          stones: [
            {r:3,c:4,color:1},{r:5,c:4,color:1},{r:4,c:3,color:1},{r:4,c:5,color:1}
          ],
          markers: [{r:4,c:4,type:'captured'}]
        },
        {
          text: "You can capture entire <strong>groups</strong> the same way. Fill every liberty of the group and all its stones are removed.\n\nThis white group has <strong>1 liberty</strong> left. One more black stone and the whole group is captured!",
          stones: [
            {r:3,c:3,color:2},{r:3,c:4,color:2},{r:4,c:3,color:2},{r:4,c:4,color:2},
            {r:2,c:3,color:1},{r:2,c:4,color:1},{r:3,c:2,color:1},{r:4,c:2,color:1},
            {r:5,c:3,color:1},{r:5,c:4,color:1},{r:4,c:5,color:1},{r:3,c:5,color:1}
          ],
          markers: []
        }
      ]
    },
    {
      title: "Self-Capture & Ko",
      steps: [
        {
          text: "<strong>Suicide is illegal.</strong> You cannot place a stone where it would have zero liberties — UNLESS doing so captures opponent stones first.\n\nBlack CANNOT play at the X — it would have zero liberties and captures nothing.",
          stones: [
            {r:0,c:1,color:2},{r:1,c:0,color:2}
          ],
          markers: [{r:0,c:0,type:'illegal'}]
        },
        {
          text: "But here, placing black at X <strong>captures</strong> the white stone first, which gives the black stone a liberty. This is legal!",
          stones: [
            {r:0,c:1,color:2},{r:1,c:0,color:1},{r:1,c:2,color:1},{r:2,c:1,color:1},{r:0,c:2,color:2}
          ],
          markers: [{r:0,c:0,type:'good'}]
        },
        {
          text: "<strong>The Ko Rule</strong> prevents infinite loops. If capturing a stone would recreate the exact previous board position, that move is forbidden.\n\nYou must play elsewhere first (a 'ko threat'), then you may recapture on a later turn.",
          stones: [
            {r:3,c:3,color:1},{r:3,c:5,color:2},
            {r:4,c:2,color:1},{r:4,c:4,color:2},{r:4,c:6,color:2},
            {r:5,c:3,color:1},{r:5,c:5,color:2},
            {r:4,c:3,color:2}
          ],
          markers: [{r:4,c:5,type:'ko'}]
        }
      ]
    },
    {
      title: "Life, Death & Two Eyes",
      steps: [
        {
          text: "This is the <strong>most important concept</strong> in Go.\n\nA group is <strong>alive</strong> (can never be captured) if it has <strong>two separate internal spaces called \"eyes.\"</strong> An eye is an empty point completely surrounded by your stones.",
          stones: [
            {r:2,c:2,color:1},{r:2,c:3,color:1},{r:2,c:4,color:1},{r:2,c:5,color:1},{r:2,c:6,color:1},
            {r:3,c:2,color:1},{r:3,c:6,color:1},
            {r:4,c:2,color:1},{r:4,c:4,color:1},{r:4,c:6,color:1},
            {r:5,c:2,color:1},{r:5,c:3,color:1},{r:5,c:4,color:1},{r:5,c:5,color:1},{r:5,c:6,color:1}
          ],
          markers: [{r:3,c:4,type:'eye'},{r:4,c:3,type:'eye'},{r:3,c:3,type:'eye'},{r:4,c:5,type:'eye'},{r:3,c:5,type:'eye'}]
        },
        {
          text: "Why two eyes? Because your opponent <strong>cannot fill both at once</strong>. Filling one eye is suicide (the stone would have no liberties), so the group can never reach zero liberties.\n\nA group with only <strong>one eye</strong> (or no eyes) is <strong>dead</strong> — the opponent can eventually capture it.",
          stones: [
            {r:3,c:2,color:1},{r:3,c:3,color:1},{r:3,c:4,color:1},
            {r:4,c:2,color:1},{r:4,c:4,color:1},
            {r:5,c:2,color:1},{r:5,c:3,color:1},{r:5,c:4,color:1},
            {r:2,c:2,color:2},{r:2,c:3,color:2},{r:2,c:4,color:2},{r:2,c:5,color:2},
            {r:3,c:5,color:2},{r:4,c:5,color:2},{r:5,c:5,color:2},
            {r:6,c:2,color:2},{r:6,c:3,color:2},{r:6,c:4,color:2},{r:6,c:5,color:2},
            {r:3,c:1,color:2},{r:4,c:1,color:2},{r:5,c:1,color:2}
          ],
          markers: [{r:4,c:3,type:'eye'}]
        },
        {
          text: "<strong>Key takeaway:</strong> Always try to give your groups two eyes. Always try to prevent your opponent's groups from making two eyes.\n\nThis fight over life and death is the heart of Go strategy!",
          stones: []
        }
      ]
    },
    {
      title: "Territory & Scoring",
      steps: [
        {
          text: "The game ends when <strong>both players pass consecutively</strong> (neither wants to play). This usually happens when all borders are settled.\n\nThen we count score using <strong>Chinese rules</strong> (area scoring):",
          stones: []
        },
        {
          text: "<strong>Your score = your stones on the board + empty intersections you surround (territory)</strong>\n\nWhite also receives <strong>komi</strong> (6.5 points) to compensate for Black going first. The half-point prevents ties.\n\nBlack territory is shown in dark, White territory in light.",
          stones: [
            {r:0,c:0,color:1},{r:0,c:1,color:1},{r:0,c:2,color:1},{r:0,c:3,color:1},
            {r:1,c:0,color:1},{r:1,c:3,color:1},{r:2,c:0,color:1},{r:2,c:3,color:1},
            {r:3,c:0,color:1},{r:3,c:1,color:1},{r:3,c:2,color:1},{r:3,c:3,color:1},
            {r:0,c:5,color:2},{r:0,c:6,color:2},{r:0,c:7,color:2},{r:0,c:8,color:2},
            {r:1,c:5,color:2},{r:1,c:8,color:2},{r:2,c:5,color:2},{r:2,c:8,color:2},
            {r:3,c:5,color:2},{r:3,c:6,color:2},{r:3,c:7,color:2},{r:3,c:8,color:2},
          ],
          markers: [
            {r:1,c:1,type:'territory-b'},{r:1,c:2,type:'territory-b'},
            {r:2,c:1,type:'territory-b'},{r:2,c:2,type:'territory-b'},
            {r:1,c:6,type:'territory-w'},{r:1,c:7,type:'territory-w'},
            {r:2,c:6,type:'territory-w'},{r:2,c:7,type:'territory-w'},
          ]
        }
      ]
    },
    {
      title: "Strategy: Where to Play",
      steps: [
        {
          text: "The single most important strategic principle:\n\n<strong>Corners first, then sides, then center.</strong>\n\nWhy? Because the board edges act as natural walls. You need fewer stones to enclose territory in a corner (2 walls help) than on a side (1 wall) than in the center (no walls).",
          stones: [],
          markers: [
            {r:2,c:2,type:'good'},{r:2,c:6,type:'good'},{r:6,c:2,type:'good'},{r:6,c:6,type:'good'}
          ]
        },
        {
          text: "In the opening, play on the <strong>3rd or 4th line</strong> from the edge.\n\n• <strong>3rd line</strong> (marked •) — secures territory along the edge\n• <strong>4th line</strong> (marked ★) — builds influence toward the center\n\nA balance of both is ideal. The star points (hoshi) on the 4th line are classic opening moves.",
          stones: [],
          markers: [
            {r:2,c:2,type:'dot'},{r:2,c:4,type:'dot'},{r:2,c:6,type:'dot'},
            {r:3,c:3,type:'star'},{r:3,c:5,type:'star'}
          ]
        },
        {
          text: "After corners, <strong>extend along the sides</strong> to sketch out frameworks of potential territory. Then fight over the middle.\n\nDon't try to surround everything — solid territory in corners and along sides wins games!",
          stones: [
            {r:2,c:2,color:1},{r:2,c:6,color:2},
            {r:6,c:2,color:2},{r:6,c:6,color:1},
            {r:2,c:4,color:1},{r:6,c:4,color:2},
            {r:4,c:2,color:2},{r:4,c:6,color:1}
          ],
          markers: []
        }
      ]
    },
    {
      title: "Key Principles",
      steps: [
        {
          text: "<strong>1. Keep your groups connected.</strong>\nConnected stones are stronger — they share liberties and are harder to capture. Cutting your opponent's groups apart makes them weaker.\n\n<strong>2. Give your groups two eyes.</strong>\nA group with two eyes is alive forever. If a group can't make two eyes, it's in danger.",
          stones: []
        },
        {
          text: "<strong>3. Don't chase what you can't catch.</strong>\nIf an opponent's group is strong and has room to make eyes, don't waste moves attacking it. Play elsewhere where your moves have more value.\n\n<strong>4. Think about the whole board.</strong>\nBeginners focus too much on one fight. The best move is often far from the current action. Look for the biggest opportunity on the board.",
          stones: []
        },
        {
          text: "<strong>5. Sente (initiative) is gold.</strong>\nA move that your opponent MUST respond to gives you \"sente\" — you keep the initiative. After they respond, you can play elsewhere.\n\n<strong>6. Don't be greedy.</strong>\nTrying to take too much territory makes your position thin and vulnerable. Solid, modest territory beats overextended claims.",
          stones: []
        }
      ]
    },
    {
      title: "Beginner Tips",
      steps: [
        {
          text: "Ready to play? Here are practical tips:\n\n• <strong>Start on 9×9.</strong> It's faster and lets you practice tactics.\n• <strong>Play the corners first.</strong> Move to star points (4-4) or 3-4 points.\n• <strong>Keep your stones connected.</strong> Don't scatter single stones everywhere.\n• <strong>When in doubt, make your groups stronger</strong> rather than starting new fights.",
          stones: []
        },
        {
          text: "• <strong>Count liberties</strong> before attacking or defending. If your group has fewer liberties than your opponent's, you'll be captured first.\n• <strong>Learn to recognize when groups are dead.</strong> Don't waste moves trying to save doomed stones.\n• <strong>Pass when you think the game is over.</strong> Two passes end the game.\n• <strong>Review your games.</strong> The undo button is your friend!",
          stones: []
        },
        {
          text: "Most importantly: <strong>don't worry about winning at first.</strong>\n\nGo has the most beautiful learning curve of any game. You'll lose your first hundred games, and each one will teach you something new.\n\nAs the proverb says:\n<em>\"Lose your first 100 games as quickly as possible.\"</em>\n\nNow go play! Start with the Random AI to learn the flow, then work your way up. Good luck!",
          stones: []
        }
      ]
    }
  ];

  // ============================================================
  // STATE
  // ============================================================
  const COLS = 'ABCDEFGHJKLMNOPQRST'; // no I
  let engine, canvas, ctx;
  let boardSize = 9, aiDifficulty = 'easy', playerColor = 1;
  let tileSize, margin, boardPx;
  let showTerritory = false, aiThinking = false;
  let hoverPos = null;
  let mode = 'play'; // 'play' or 'learn'
  let lessonIdx = 0, stepIdx = 0;
  let lessonCanvas, lessonCtx;

  // ============================================================
  // STAR POINTS
  // ============================================================
  function starPoints(sz) {
    if (sz === 9)  return [[2,2],[2,6],[6,2],[6,6],[4,4]];
    if (sz === 13) return [[3,3],[3,9],[9,3],[9,9],[6,6],[3,6],[6,3],[6,9],[9,6]];
    if (sz === 19) return [[3,3],[3,9],[3,15],[9,3],[9,9],[9,15],[15,3],[15,9],[15,15]];
    return [[Math.floor(sz/2), Math.floor(sz/2)]];
  }

  // ============================================================
  // RENDERING
  // ============================================================
  function calcSizes(sz, canvasEl) {
    const maxW = Math.min(560, window.innerWidth - 32);
    tileSize = Math.floor(maxW / (sz + 1));
    margin = tileSize;
    boardPx = margin * 2 + (sz - 1) * tileSize;
    canvasEl.width = boardPx;
    canvasEl.height = boardPx;
  }

  function drawBoard(c, sz, board, lastMv, terrData, hvr, hvrColor) {
    const w = c.canvas.width, h = c.canvas.height;
    // Wood background
    c.fillStyle = '#DCB35C';
    c.fillRect(0, 0, w, h);
    // Subtle grain
    c.fillStyle = 'rgba(180,140,60,0.15)';
    for (let i = 0; i < h; i += 6) {
      c.fillRect(0, i, w, 2);
    }

    // Grid lines
    c.strokeStyle = '#3a2a1a';
    c.lineWidth = 1;
    for (let i = 0; i < sz; i++) {
      const p = margin + i * tileSize;
      c.beginPath(); c.moveTo(margin, p); c.lineTo(margin + (sz - 1) * tileSize, p); c.stroke();
      c.beginPath(); c.moveTo(p, margin); c.lineTo(p, margin + (sz - 1) * tileSize); c.stroke();
    }

    // Star points
    for (const [r, col] of starPoints(sz)) {
      if (r >= sz || col >= sz) continue;
      const x = margin + col * tileSize, y = margin + r * tileSize;
      c.fillStyle = '#3a2a1a';
      c.beginPath(); c.arc(x, y, Math.max(3, tileSize * 0.1), 0, Math.PI * 2); c.fill();
    }

    // Coordinate labels
    c.fillStyle = '#5a4020';
    c.font = `${Math.max(10, tileSize * 0.35)}px sans-serif`;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 0; i < sz; i++) {
      const x = margin + i * tileSize;
      c.fillText(COLS[i], x, margin * 0.35);
      c.fillText(COLS[i], x, boardPx - margin * 0.35);
      const y = margin + i * tileSize;
      c.fillText(String(sz - i), margin * 0.35, y);
      c.fillText(String(sz - i), boardPx - margin * 0.35, y);
    }

    // Territory overlay
    if (terrData) {
      for (let r = 0; r < sz; r++) {
        for (let col = 0; col < sz; col++) {
          if (!board[r][col] && terrData[r][col]) {
            const x = margin + col * tileSize, y = margin + r * tileSize;
            const s = tileSize * 0.15;
            c.fillStyle = terrData[r][col] === 1 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.5)';
            c.fillRect(x - s, y - s, s * 2, s * 2);
          }
        }
      }
    }

    // Stones
    for (let r = 0; r < sz; r++) {
      for (let col = 0; col < sz; col++) {
        if (board[r][col]) drawStone(c, r, col, board[r][col], sz);
      }
    }

    // Last move marker
    if (lastMv) {
      const x = margin + lastMv[1] * tileSize, y = margin + lastMv[0] * tileSize;
      const clr = board[lastMv[0]][lastMv[1]] === 1 ? '#fff' : '#000';
      c.fillStyle = clr;
      c.beginPath(); c.arc(x, y, tileSize * 0.12, 0, Math.PI * 2); c.fill();
    }

    // Hover preview
    if (hvr && board[hvr[0]][hvr[1]] === 0) {
      const x = margin + hvr[1] * tileSize, y = margin + hvr[0] * tileSize;
      c.globalAlpha = 0.4;
      drawStone(c, hvr[0], hvr[1], hvrColor, sz);
      c.globalAlpha = 1;
    }
  }

  function drawStone(c, r, col, color, sz) {
    const x = margin + col * tileSize, y = margin + r * tileSize;
    const radius = tileSize * 0.44;
    // Shadow
    c.fillStyle = 'rgba(0,0,0,0.25)';
    c.beginPath(); c.arc(x + 1.5, y + 1.5, radius, 0, Math.PI * 2); c.fill();
    // Stone gradient
    const g = c.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
    if (color === 1) { g.addColorStop(0, '#555'); g.addColorStop(1, '#111'); }
    else { g.addColorStop(0, '#fff'); g.addColorStop(1, '#bbb'); }
    c.fillStyle = g;
    c.beginPath(); c.arc(x, y, radius, 0, Math.PI * 2); c.fill();
    // Shine
    c.fillStyle = color === 1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.55)';
    c.beginPath(); c.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.22, 0, Math.PI * 2); c.fill();
  }

  function drawLessonBoard(stones, markers) {
    const sz = 9;
    calcSizes(sz, lessonCanvas);
    const board = [];
    for (let i = 0; i < sz; i++) board.push(new Array(sz).fill(0));
    for (const s of stones) if (s.r < sz && s.c < sz) board[s.r][s.c] = s.color;
    drawBoard(lessonCtx, sz, board, null, null, null, 0);
    // Draw markers
    if (markers) {
      for (const m of markers) {
        if (m.r >= sz || m.c >= sz) continue;
        const x = margin + m.c * tileSize, y = margin + m.r * tileSize;
        const r = tileSize * 0.15;
        if (m.type === 'liberty' || m.type === 'liberty2') {
          lessonCtx.fillStyle = m.type === 'liberty' ? '#22d3ee' : '#ec4899';
          lessonCtx.beginPath(); lessonCtx.arc(x, y, r + 2, 0, Math.PI * 2); lessonCtx.fill();
        } else if (m.type === 'atari') {
          lessonCtx.strokeStyle = '#f43f5e';
          lessonCtx.lineWidth = 3;
          lessonCtx.beginPath(); lessonCtx.arc(x, y, tileSize * 0.35, 0, Math.PI * 2); lessonCtx.stroke();
        } else if (m.type === 'captured') {
          lessonCtx.strokeStyle = '#f43f5e';
          lessonCtx.lineWidth = 2;
          const s = tileSize * 0.25;
          lessonCtx.beginPath(); lessonCtx.moveTo(x-s,y-s); lessonCtx.lineTo(x+s,y+s); lessonCtx.stroke();
          lessonCtx.beginPath(); lessonCtx.moveTo(x+s,y-s); lessonCtx.lineTo(x-s,y+s); lessonCtx.stroke();
        } else if (m.type === 'illegal') {
          lessonCtx.strokeStyle = '#f43f5e';
          lessonCtx.lineWidth = 3;
          const s = tileSize * 0.2;
          lessonCtx.beginPath(); lessonCtx.moveTo(x-s,y-s); lessonCtx.lineTo(x+s,y+s); lessonCtx.stroke();
          lessonCtx.beginPath(); lessonCtx.moveTo(x+s,y-s); lessonCtx.lineTo(x-s,y+s); lessonCtx.stroke();
        } else if (m.type === 'good') {
          lessonCtx.fillStyle = '#22d3ee';
          lessonCtx.beginPath(); lessonCtx.arc(x, y, r + 3, 0, Math.PI * 2); lessonCtx.fill();
        } else if (m.type === 'ko') {
          lessonCtx.strokeStyle = '#ec4899';
          lessonCtx.lineWidth = 2;
          lessonCtx.setLineDash([3, 3]);
          lessonCtx.beginPath(); lessonCtx.arc(x, y, tileSize * 0.35, 0, Math.PI * 2); lessonCtx.stroke();
          lessonCtx.setLineDash([]);
        } else if (m.type === 'eye') {
          lessonCtx.fillStyle = 'rgba(34,211,238,0.4)';
          lessonCtx.fillRect(x - tileSize * 0.35, y - tileSize * 0.35, tileSize * 0.7, tileSize * 0.7);
        } else if (m.type === 'territory-b') {
          lessonCtx.fillStyle = 'rgba(0,0,0,0.3)';
          lessonCtx.fillRect(x - tileSize * 0.2, y - tileSize * 0.2, tileSize * 0.4, tileSize * 0.4);
        } else if (m.type === 'territory-w') {
          lessonCtx.fillStyle = 'rgba(255,255,255,0.5)';
          lessonCtx.fillRect(x - tileSize * 0.2, y - tileSize * 0.2, tileSize * 0.4, tileSize * 0.4);
        } else if (m.type === 'dot') {
          lessonCtx.fillStyle = '#6366f1';
          lessonCtx.beginPath(); lessonCtx.arc(x, y, r + 2, 0, Math.PI * 2); lessonCtx.fill();
        } else if (m.type === 'star') {
          lessonCtx.fillStyle = '#ec4899';
          const s = tileSize * 0.18;
          lessonCtx.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = (i * 72 - 90) * Math.PI / 180;
            const a2 = ((i * 72) + 36 - 90) * Math.PI / 180;
            lessonCtx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s);
            lessonCtx.lineTo(x + Math.cos(a2) * s * 0.5, y + Math.sin(a2) * s * 0.5);
          }
          lessonCtx.closePath(); lessonCtx.fill();
        }
      }
    }
  }

  // ============================================================
  // GAME LOGIC
  // ============================================================
  function newGame() {
    engine = new GoEngine(boardSize, 6.5);
    calcSizes(boardSize, canvas);
    aiThinking = false;
    showTerritory = document.getElementById('show-territory').checked;
    updateStatus();
    render();
    // If player chose white, AI plays first
    if (playerColor === 2) aiTurn();
  }

  function render() {
    const terr = showTerritory ? engine.territory() : null;
    const hvr = (!aiThinking && !engine.over) ? hoverPos : null;
    drawBoard(ctx, engine.size, engine.board, engine.lastMove, terr, hvr, engine.current);
  }

  function updateStatus() {
    const sc = engine.score();
    document.getElementById('cap-black').textContent = engine.captures[1];
    document.getElementById('cap-white').textContent = engine.captures[2];
    document.getElementById('score-black').textContent = sc.black.toFixed(1);
    document.getElementById('score-white').textContent = sc.white.toFixed(1);
    const turnEl = document.getElementById('turn-display');
    if (engine.over) {
      const winner = sc.black > sc.white ? 'Black' : 'White';
      const diff = Math.abs(sc.black - sc.white).toFixed(1);
      turnEl.innerHTML = `<strong>Game Over — ${winner} wins by ${diff}!</strong>`;
    } else if (aiThinking) {
      turnEl.textContent = 'AI is thinking...';
    } else {
      const color = engine.current === 1 ? 'Black' : 'White';
      const you = engine.current === playerColor ? ' (You)' : ' (AI)';
      turnEl.textContent = `${color}'s turn${you}`;
    }
    document.getElementById('move-count').textContent = `Move ${engine.moves.length}`;
  }

  function posFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const col = Math.round((px - margin) / tileSize);
    const row = Math.round((py - margin) / tileSize);
    if (row >= 0 && row < engine.size && col >= 0 && col < engine.size) return [row, col];
    return null;
  }

  function handleClick(e) {
    if (aiThinking || engine.over || engine.current !== playerColor) return;
    const pos = posFromEvent(e);
    if (!pos) return;
    if (engine.play(pos[0], pos[1])) {
      hoverPos = null;
      updateStatus();
      render();
      if (!engine.over) aiTurn();
    }
  }

  function handleHover(e) {
    if (aiThinking || engine.over) { hoverPos = null; return; }
    const pos = posFromEvent(e);
    if (pos && engine.current === playerColor && engine.canPlay(pos[0], pos[1], engine.current)) {
      hoverPos = pos;
    } else {
      hoverPos = null;
    }
    render();
  }

  async function aiTurn() {
    if (engine.over || engine.current === playerColor) return;
    aiThinking = true;
    updateStatus();
    render();

    const move = await GoAI.getMoveAsync(engine, aiDifficulty);
    if (move) {
      engine.play(move[0], move[1]);
    } else {
      engine.pass();
    }
    aiThinking = false;
    updateStatus();
    render();
  }

  function handlePass() {
    if (aiThinking || engine.over || engine.current !== playerColor) return;
    engine.pass();
    updateStatus();
    render();
    if (!engine.over) aiTurn();
  }

  function handleUndo() {
    if (aiThinking) return;
    // Undo twice (player + AI) if possible
    engine.undo();
    engine.undo();
    updateStatus();
    render();
  }

  function handleResign() {
    if (aiThinking || engine.over) return;
    engine.over = true;
    updateStatus();
    render();
  }

  // ============================================================
  // TUTORIAL UI
  // ============================================================
  function showLesson() {
    const lesson = LESSONS[lessonIdx];
    const step = lesson.steps[stepIdx];
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-text').innerHTML = step.text;
    document.getElementById('lesson-progress').textContent =
      `Lesson ${lessonIdx + 1}/${LESSONS.length} — Step ${stepIdx + 1}/${lesson.steps.length}`;
    drawLessonBoard(step.stones || [], step.markers || []);
    // Update nav
    document.getElementById('lesson-prev-step').disabled = (lessonIdx === 0 && stepIdx === 0);
    document.getElementById('lesson-next-step').disabled =
      (lessonIdx === LESSONS.length - 1 && stepIdx === lesson.steps.length - 1);
    // Update lesson list highlights
    document.querySelectorAll('.lesson-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === lessonIdx);
    });
  }

  function nextStep() {
    const lesson = LESSONS[lessonIdx];
    if (stepIdx < lesson.steps.length - 1) {
      stepIdx++;
    } else if (lessonIdx < LESSONS.length - 1) {
      lessonIdx++;
      stepIdx = 0;
    }
    showLesson();
  }

  function prevStep() {
    if (stepIdx > 0) {
      stepIdx--;
    } else if (lessonIdx > 0) {
      lessonIdx--;
      stepIdx = LESSONS[lessonIdx].steps.length - 1;
    }
    showLesson();
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    canvas = document.getElementById('board-canvas');
    ctx = canvas.getContext('2d');
    lessonCanvas = document.getElementById('lesson-canvas');
    lessonCtx = lessonCanvas.getContext('2d');

    // Event listeners - game
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleHover);
    canvas.addEventListener('mouseleave', () => { hoverPos = null; render(); });
    // Touch support
    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    });

    document.getElementById('btn-pass').addEventListener('click', handlePass);
    document.getElementById('btn-undo').addEventListener('click', handleUndo);
    document.getElementById('btn-resign').addEventListener('click', handleResign);
    document.getElementById('btn-new-game').addEventListener('click', () => {
      boardSize = parseInt(document.getElementById('sel-size').value);
      aiDifficulty = document.getElementById('sel-ai').value;
      playerColor = parseInt(document.getElementById('sel-color').value);
      newGame();
    });
    document.getElementById('show-territory').addEventListener('change', () => {
      showTerritory = document.getElementById('show-territory').checked;
      render();
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mode = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        document.getElementById('play-tab').style.display = mode === 'play' ? '' : 'none';
        document.getElementById('learn-tab').style.display = mode === 'learn' ? '' : 'none';
        if (mode === 'learn') showLesson();
      });
    });

    // Lesson nav
    document.getElementById('lesson-next-step').addEventListener('click', nextStep);
    document.getElementById('lesson-prev-step').addEventListener('click', prevStep);
    // Lesson list buttons
    const listEl = document.getElementById('lesson-list');
    LESSONS.forEach((l, i) => {
      const btn = document.createElement('button');
      btn.className = 'lesson-btn';
      btn.textContent = `${i + 1}. ${l.title}`;
      btn.addEventListener('click', () => { lessonIdx = i; stepIdx = 0; showLesson(); });
      listEl.appendChild(btn);
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (mode === 'learn') {
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextStep(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
      }
    });

    window.addEventListener('resize', () => {
      if (mode === 'play' && engine) { calcSizes(engine.size, canvas); render(); }
      if (mode === 'learn') showLesson();
    });

    // Start
    newGame();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
