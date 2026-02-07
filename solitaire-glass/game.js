/* =========================================================
   Liquid Glass Solitaire – Klondike
   ========================================================= */

(() => {
  "use strict";

  // ── Constants ──────────────────────────────────────────
  const SUITS = ["hearts", "diamonds", "clubs", "spades"];
  const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const RANK_VALUE = {};
  RANKS.forEach((r, i) => (RANK_VALUE[r] = i));

  const isRed = (suit) => suit === "hearts" || suit === "diamonds";

  const PIP_ID = {
    hearts: "#pip-hearts",
    diamonds: "#pip-diamonds",
    clubs: "#pip-clubs",
    spades: "#pip-spades",
  };

  // ── State ──────────────────────────────────────────────
  let stock = [];
  let waste = [];
  let foundations = [[], [], [], []];
  let tableau = [[], [], [], [], [], [], []];
  let moveCount = 0;
  let timerSeconds = 0;
  let timerInterval = null;
  let undoStack = [];
  let selectedCard = null; // { zone, index, cardIndex }

  // ── DOM refs ───────────────────────────────────────────
  const $board = document.getElementById("game-board");
  const $stock = document.getElementById("stock");
  const $waste = document.getElementById("waste");
  const $foundations = [0, 1, 2, 3].map((i) => document.getElementById(`foundation-${i}`));
  const $tableaux = [0, 1, 2, 3, 4, 5, 6].map((i) => document.getElementById(`tableau-${i}`));
  const $moveCounter = document.getElementById("move-counter");
  const $timer = document.getElementById("timer");
  const $newGameBtn = document.getElementById("new-game-btn");
  const $undoBtn = document.getElementById("undo-btn");
  const $winOverlay = document.getElementById("win-overlay");
  const $winStats = document.getElementById("win-stats");
  const $playAgainBtn = document.getElementById("play-again-btn");

  // ── Deck helpers ───────────────────────────────────────
  function createDeck() {
    const deck = [];
    for (const suit of SUITS)
      for (const rank of RANKS)
        deck.push({ suit, rank, faceUp: false });
    return deck;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ── Card rendering ─────────────────────────────────────
  function pipSVG(suit, cls = "center-pip") {
    return `<svg class="${cls}"><use href="${PIP_ID[suit]}"/></svg>`;
  }

  function smallPipSVG(suit) {
    return `<svg class="card-pip-small"><use href="${PIP_ID[suit]}"/></svg>`;
  }

  /* Build pip layout for number cards (2-10) */
  function numberPipLayout(suit, count) {
    // Pip positions: each array element is a row; -1 = left, 0 = center, 1 = right
    const layouts = {
      2: [[[0]], [[0, "inv"]]],
      3: [[[0]], [[0]], [[0, "inv"]]],
      4: [[[-1, 1]], [[-1, 1, "inv"]]],
      5: [[[-1, 1]], [[0]], [[-1, 1, "inv"]]],
      6: [[[-1, 1]], [[-1, 1]], [[-1, 1, "inv"]]],
      7: [[[-1, 1]], [[-1, 0, 1]], [[-1, 1, "inv"]]],
      8: [[[-1, 1]], [[-1, 0, 1]], [[-1, 0, 1, "inv"]]],
      9: [[[-1, 1]], [[-1, 1]], [[0]], [[-1, 1, "inv"]], [[-1, 1, "inv"]]],
      10: [[[-1, 1]], [[-1, 1]], [[0]], [[0, "inv"]], [[-1, 1, "inv"]], [[-1, 1, "inv"]]],
    };
    const rows = layouts[count] || [];
    let html = `<div class="pip-layout">`;
    for (const row of rows) {
      const positions = row[0];
      const inv = row.length > 1 && row[row.length - 1] === "inv";
      html += `<div class="pip-row${inv ? " inverted" : ""}">`;
      for (const p of positions) {
        if (typeof p === "string") continue;
        html += pipSVG(suit, "");
      }
      html += `</div>`;
    }
    html += `</div>`;
    return html;
  }

  function faceCardHTML(suit, rank) {
    const spriteId = rank === "J" ? "#face-jack" : rank === "Q" ? "#face-queen" : "#face-king";
    return `<div class="card-center"><svg class="face-sprite"><use href="${spriteId}"/></svg></div>`;
  }

  function aceHTML(suit) {
    return `<div class="card-center">
      <svg class="ace-bg"><use href="#ace-ornament"/></svg>
      ${pipSVG(suit, "ace-center-pip")}
    </div>`;
  }

  function renderCardInner(card) {
    const { suit, rank } = card;
    const val = RANK_VALUE[rank];
    let center = "";
    if (val === 0) center = aceHTML(suit);
    else if (val >= 1 && val <= 9) center = numberPipLayout(suit, val + 1);
    else center = faceCardHTML(suit, rank);

    return `
      <div class="card-face">
        <div class="card-rank top-left">${rank}${smallPipSVG(suit)}</div>
        ${center}
        <div class="card-rank bottom-right">${rank}${smallPipSVG(suit)}</div>
      </div>
      <div class="card-back"><svg><use href="#card-back-pattern"/></svg></div>
    `;
  }

  function createCardEl(card) {
    const el = document.createElement("div");
    el.className = `card suit-${card.suit} ${card.faceUp ? "face-up" : "face-down"}`;
    el.innerHTML = renderCardInner(card);
    el.dataset.suit = card.suit;
    el.dataset.rank = card.rank;
    return el;
  }

  // ── Rendering ──────────────────────────────────────────
  function clearCards(container) {
    container.querySelectorAll(".card").forEach((c) => c.remove());
  }

  function renderAll() {
    renderStock();
    renderWaste();
    for (let i = 0; i < 4; i++) renderFoundation(i);
    for (let i = 0; i < 7; i++) renderTableau(i);
    $moveCounter.textContent = `Moves: ${moveCount}`;
  }

  function renderStock() {
    clearCards($stock);
    $stock.classList.toggle("empty-stock", stock.length === 0);
    if (stock.length > 0) {
      const el = createCardEl(stock[stock.length - 1]);
      el.style.top = "0"; el.style.left = "0";
      $stock.appendChild(el);
    }
  }

  function renderWaste() {
    clearCards($waste);
    if (waste.length > 0) {
      const card = waste[waste.length - 1];
      card.faceUp = true;
      const el = createCardEl(card);
      el.style.top = "0"; el.style.left = "0";
      $waste.appendChild(el);
    }
  }

  function renderFoundation(fi) {
    const container = $foundations[fi];
    clearCards(container);
    const pile = foundations[fi];
    if (pile.length > 0) {
      const card = pile[pile.length - 1];
      card.faceUp = true;
      const el = createCardEl(card);
      el.style.top = "0"; el.style.left = "0";
      container.appendChild(el);
    }
  }

  function renderTableau(ti) {
    const container = $tableaux[ti];
    clearCards(container);
    const pile = tableau[ti];
    pile.forEach((card, ci) => {
      const el = createCardEl(card);
      el.style.top = ci * getStackOffset() + "px";
      el.style.left = "0";
      el.style.zIndex = ci + 1;
      el.dataset.cardIndex = ci;
      container.appendChild(el);
    });
    // Update min-height so empty columns stay droppable
    container.style.minHeight =
      pile.length > 0
        ? `${(pile.length - 1) * getStackOffset() + getCSSVar("--card-h")}px`
        : `${getCSSVar("--card-h")}px`;
  }

  function getStackOffset() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--stack-offset")) || 28;
  }
  function getCSSVar(name) {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue(name)) || 140;
  }

  // ── Game init ──────────────────────────────────────────
  function startGame() {
    clearTimer();
    const deck = shuffle(createDeck());
    stock = [];
    waste = [];
    foundations = [[], [], [], []];
    tableau = [[], [], [], [], [], [], []];
    moveCount = 0;
    timerSeconds = 0;
    undoStack = [];
    selectedCard = null;
    $winOverlay.classList.add("hidden");

    // Deal tableau
    for (let col = 0; col < 7; col++) {
      for (let row = col; row < 7; row++) {
        const card = deck.pop();
        card.faceUp = row === col;
        tableau[row].push(card);
      }
    }

    // Remaining cards go to stock
    stock = deck.reverse(); // top of stock = last element
    stock.forEach((c) => (c.faceUp = false));

    renderAll();
    startTimer();
  }

  // ── Timer ──────────────────────────────────────────────
  function startTimer() {
    timerInterval = setInterval(() => {
      timerSeconds++;
      const m = Math.floor(timerSeconds / 60);
      const s = timerSeconds % 60;
      $timer.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    }, 1000);
  }
  function clearTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  // ── Save / Undo ────────────────────────────────────────
  function saveState() {
    undoStack.push({
      stock: stock.map((c) => ({ ...c })),
      waste: waste.map((c) => ({ ...c })),
      foundations: foundations.map((f) => f.map((c) => ({ ...c }))),
      tableau: tableau.map((t) => t.map((c) => ({ ...c }))),
      moveCount,
    });
    if (undoStack.length > 50) undoStack.shift();
  }

  function undo() {
    if (undoStack.length === 0) return;
    const state = undoStack.pop();
    stock = state.stock;
    waste = state.waste;
    foundations = state.foundations;
    tableau = state.tableau;
    moveCount = state.moveCount;
    selectedCard = null;
    renderAll();
  }

  // ── Move validation ────────────────────────────────────
  function canPlaceOnFoundation(card, fi) {
    const pile = foundations[fi];
    if (pile.length === 0) return card.rank === "A";
    const top = pile[pile.length - 1];
    return top.suit === card.suit && RANK_VALUE[card.rank] === RANK_VALUE[top.rank] + 1;
  }

  function canPlaceOnTableau(card, ti) {
    const pile = tableau[ti];
    if (pile.length === 0) return card.rank === "K";
    const top = pile[pile.length - 1];
    if (!top.faceUp) return false;
    return isRed(card.suit) !== isRed(top.suit) && RANK_VALUE[card.rank] === RANK_VALUE[top.rank] - 1;
  }

  // ── Auto-flip top tableau card ─────────────────────────
  function autoFlipTableau(ti) {
    const pile = tableau[ti];
    if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
      pile[pile.length - 1].faceUp = true;
      renderTableau(ti);
      // animate flip
      const container = $tableaux[ti];
      const topEl = container.querySelector(".card:last-child");
      if (topEl) topEl.classList.add("animate-flip");
    }
  }

  // ── Moves ──────────────────────────────────────────────
  function drawFromStock() {
    if (stock.length === 0) {
      // Recycle waste back to stock
      if (waste.length === 0) return;
      saveState();
      stock = waste.reverse();
      stock.forEach((c) => (c.faceUp = false));
      waste = [];
      moveCount++;
    } else {
      saveState();
      const card = stock.pop();
      card.faceUp = true;
      waste.push(card);
      moveCount++;
    }
    renderAll();
  }

  function moveWasteToFoundation(fi) {
    if (waste.length === 0) return false;
    const card = waste[waste.length - 1];
    if (!canPlaceOnFoundation(card, fi)) return false;
    saveState();
    foundations[fi].push(waste.pop());
    moveCount++;
    renderAll();
    checkWin();
    return true;
  }

  function moveWasteToTableau(ti) {
    if (waste.length === 0) return false;
    const card = waste[waste.length - 1];
    if (!canPlaceOnTableau(card, ti)) return false;
    saveState();
    tableau[ti].push(waste.pop());
    moveCount++;
    renderAll();
    return true;
  }

  function moveTableauToFoundation(fromTi, fi) {
    const pile = tableau[fromTi];
    if (pile.length === 0) return false;
    const card = pile[pile.length - 1];
    if (!card.faceUp) return false;
    if (!canPlaceOnFoundation(card, fi)) return false;
    saveState();
    foundations[fi].push(pile.pop());
    moveCount++;
    autoFlipTableau(fromTi);
    renderAll();
    checkWin();
    return true;
  }

  function moveTableauStack(fromTi, cardIndex, toTi) {
    const fromPile = tableau[fromTi];
    if (cardIndex < 0 || cardIndex >= fromPile.length) return false;
    const card = fromPile[cardIndex];
    if (!card.faceUp) return false;
    if (!canPlaceOnTableau(card, toTi)) return false;
    saveState();
    const moving = fromPile.splice(cardIndex);
    tableau[toTi].push(...moving);
    moveCount++;
    autoFlipTableau(fromTi);
    renderAll();
    return true;
  }

  function moveFoundationToTableau(fi, ti) {
    const pile = foundations[fi];
    if (pile.length === 0) return false;
    const card = pile[pile.length - 1];
    if (!canPlaceOnTableau(card, ti)) return false;
    saveState();
    tableau[ti].push(pile.pop());
    moveCount++;
    renderAll();
    return true;
  }

  // ── Auto-complete to foundations ────────────────────────
  function tryAutoComplete() {
    let moved = true;
    while (moved) {
      moved = false;
      // Try waste
      if (waste.length > 0) {
        const card = waste[waste.length - 1];
        for (let fi = 0; fi < 4; fi++) {
          if (canPlaceOnFoundation(card, fi) && isSafeAutoMove(card)) {
            foundations[fi].push(waste.pop());
            moveCount++;
            moved = true;
            break;
          }
        }
      }
      // Try tableau tops
      for (let ti = 0; ti < 7; ti++) {
        const pile = tableau[ti];
        if (pile.length === 0) continue;
        const card = pile[pile.length - 1];
        if (!card.faceUp) continue;
        for (let fi = 0; fi < 4; fi++) {
          if (canPlaceOnFoundation(card, fi) && isSafeAutoMove(card)) {
            foundations[fi].push(pile.pop());
            moveCount++;
            autoFlipTableau(ti);
            moved = true;
            break;
          }
        }
      }
    }
    renderAll();
    checkWin();
  }

  function isSafeAutoMove(card) {
    const val = RANK_VALUE[card.rank];
    if (val <= 1) return true; // Aces and 2s are always safe
    // Safe if both opposite-color foundation have value >= val-1
    const oppositeColor = isRed(card.suit) ? "black" : "red";
    let minOpposite = 13;
    for (let fi = 0; fi < 4; fi++) {
      const pile = foundations[fi];
      const suit = SUITS[fi];
      if ((isRed(suit) ? "red" : "black") === oppositeColor) {
        const topVal = pile.length > 0 ? RANK_VALUE[pile[pile.length - 1].rank] : -1;
        minOpposite = Math.min(minOpposite, topVal);
      }
    }
    return val <= minOpposite + 2;
  }

  // ── Win check ──────────────────────────────────────────
  function checkWin() {
    if (foundations.every((f) => f.length === 13)) {
      clearTimer();
      const m = Math.floor(timerSeconds / 60);
      const s = timerSeconds % 60;
      $winStats.textContent = `${moveCount} moves in ${m}:${s.toString().padStart(2, "0")}`;
      $winOverlay.classList.remove("hidden");
      spawnConfetti();
    }
  }

  function spawnConfetti() {
    const colors = ["#ff4d6a", "#4d8bff", "#4dff8b", "#ffd84d", "#d84dff", "#4dfff3"];
    for (let i = 0; i < 120; i++) {
      const el = document.createElement("div");
      el.className = "confetti";
      el.style.left = Math.random() * 100 + "vw";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = (6 + Math.random() * 8) + "px";
      el.style.height = (6 + Math.random() * 8) + "px";
      el.style.animationDuration = (2 + Math.random() * 3) + "s";
      el.style.animationDelay = Math.random() * 2 + "s";
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }
  }

  // ── Click / Selection handling ─────────────────────────
  function clearSelection() {
    if (selectedCard) {
      document.querySelectorAll(".card.selected").forEach((el) => el.classList.remove("selected"));
      document.querySelectorAll(".drop-highlight").forEach((el) => el.classList.remove("drop-highlight"));
      selectedCard = null;
    }
  }

  function handleStockClick() {
    clearSelection();
    drawFromStock();
  }

  function handleWasteClick() {
    if (waste.length === 0) return;
    if (selectedCard && selectedCard.zone === "waste") {
      // Try auto-move to foundation
      for (let fi = 0; fi < 4; fi++) {
        if (moveWasteToFoundation(fi)) { clearSelection(); return; }
      }
      clearSelection();
      return;
    }
    clearSelection();
    selectedCard = { zone: "waste" };
    const el = $waste.querySelector(".card");
    if (el) el.classList.add("selected");
  }

  function handleFoundationClick(fi) {
    if (selectedCard) {
      let moved = false;
      if (selectedCard.zone === "waste") {
        moved = moveWasteToFoundation(fi);
      } else if (selectedCard.zone === "tableau") {
        // Only single card (top of pile)
        const pile = tableau[selectedCard.index];
        if (selectedCard.cardIndex === pile.length - 1) {
          moved = moveTableauToFoundation(selectedCard.index, fi);
        }
      }
      clearSelection();
      if (moved) tryAutoComplete();
      return;
    }
    // Select foundation top card (for moving back to tableau)
    if (foundations[fi].length > 0) {
      selectedCard = { zone: "foundation", index: fi };
      const el = $foundations[fi].querySelector(".card");
      if (el) el.classList.add("selected");
    }
  }

  function handleTableauClick(ti, cardIndex) {
    const pile = tableau[ti];

    // Clicking face-down card at the end of a pile: do nothing (auto-flip handled elsewhere)
    if (cardIndex !== undefined && cardIndex < pile.length && !pile[cardIndex].faceUp) {
      return;
    }

    // If we have a selection, try to place it
    if (selectedCard) {
      let moved = false;
      if (selectedCard.zone === "waste") {
        moved = moveWasteToTableau(ti);
      } else if (selectedCard.zone === "foundation") {
        moved = moveFoundationToTableau(selectedCard.index, ti);
      } else if (selectedCard.zone === "tableau") {
        if (selectedCard.index !== ti) {
          moved = moveTableauStack(selectedCard.index, selectedCard.cardIndex, ti);
        }
      }
      clearSelection();
      if (moved) tryAutoComplete();
      return;
    }

    // Double-click behavior: if clicking the top card, try foundation
    if (cardIndex !== undefined && cardIndex === pile.length - 1) {
      // Check if this was a "quick second click" (we'll use selection instead)
    }

    // Select this card (and all below it in the stack)
    if (cardIndex === undefined) {
      // Clicked empty column, nothing to select
      return;
    }
    if (pile[cardIndex].faceUp) {
      selectedCard = { zone: "tableau", index: ti, cardIndex };
      const container = $tableaux[ti];
      const cards = container.querySelectorAll(".card");
      for (let i = cardIndex; i < cards.length; i++) {
        cards[i].classList.add("selected");
      }
    }
  }

  // Double-click: try to send to foundation
  function handleDoubleClick(zone, index, cardIndex) {
    clearSelection();
    if (zone === "waste") {
      for (let fi = 0; fi < 4; fi++) {
        if (moveWasteToFoundation(fi)) { tryAutoComplete(); return; }
      }
    } else if (zone === "tableau") {
      const pile = tableau[index];
      if (pile.length > 0 && cardIndex === pile.length - 1) {
        for (let fi = 0; fi < 4; fi++) {
          if (moveTableauToFoundation(index, fi)) { tryAutoComplete(); return; }
        }
      }
    }
  }

  // ── Drag & Drop ────────────────────────────────────────
  let dragState = null;

  function startDrag(e, zone, index, cardIndex) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let cards = [];
    let els = [];

    if (zone === "waste") {
      if (waste.length === 0) return;
      cards = [waste[waste.length - 1]];
      els = [$waste.querySelector(".card")];
    } else if (zone === "foundation") {
      if (foundations[index].length === 0) return;
      cards = [foundations[index][foundations[index].length - 1]];
      els = [$foundations[index].querySelector(".card")];
    } else if (zone === "tableau") {
      const pile = tableau[index];
      if (!pile[cardIndex] || !pile[cardIndex].faceUp) return;
      cards = pile.slice(cardIndex);
      const container = $tableaux[index];
      const allEls = container.querySelectorAll(".card");
      els = Array.from(allEls).slice(cardIndex);
    }

    if (els.length === 0) return;

    const rect = els[0].getBoundingClientRect();
    dragState = {
      zone, index, cardIndex,
      cards, els,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
      startX: clientX,
      startY: clientY,
      hasMoved: false,
      origPositions: els.map((el) => ({
        top: el.style.top,
        left: el.style.left,
        position: el.style.position,
        zIndex: el.style.zIndex,
        parent: el.parentElement,
      })),
    };

    els.forEach((el) => {
      el.classList.add("dragging");
      el.style.position = "fixed";
      el.style.zIndex = "9999";
    });

    updateDragPosition(clientX, clientY);
  }

  function updateDragPosition(clientX, clientY) {
    if (!dragState) return;
    const stackOff = getStackOffset();
    dragState.els.forEach((el, i) => {
      el.style.left = (clientX - dragState.offsetX) + "px";
      el.style.top = (clientY - dragState.offsetY + i * stackOff) + "px";
    });
  }

  function onDragMove(e) {
    if (!dragState) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (Math.abs(clientX - dragState.startX) > 5 || Math.abs(clientY - dragState.startY) > 5) {
      dragState.hasMoved = true;
    }

    updateDragPosition(clientX, clientY);
    highlightDropTarget(clientX, clientY);
  }

  function highlightDropTarget(x, y) {
    document.querySelectorAll(".drop-highlight").forEach((el) => el.classList.remove("drop-highlight"));
    const target = findDropTarget(x, y);
    if (target) target.element.classList.add("drop-highlight");
  }

  function findDropTarget(x, y) {
    if (!dragState) return null;
    const card = dragState.cards[0];

    // Check foundations (only single cards)
    if (dragState.cards.length === 1) {
      for (let fi = 0; fi < 4; fi++) {
        const rect = $foundations[fi].getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          if (canPlaceOnFoundation(card, fi)) {
            return { zone: "foundation", index: fi, element: $foundations[fi] };
          }
        }
      }
    }

    // Check tableau columns
    for (let ti = 0; ti < 7; ti++) {
      const container = $tableaux[ti];
      const rect = container.getBoundingClientRect();
      // Wider hit box
      if (x >= rect.left - 10 && x <= rect.right + 10 && y >= rect.top - 10 && y <= rect.bottom + 30) {
        if (canPlaceOnTableau(card, ti)) {
          return { zone: "tableau", index: ti, element: container };
        }
      }
    }
    return null;
  }

  function endDrag(e) {
    if (!dragState) return;
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    document.querySelectorAll(".drop-highlight").forEach((el) => el.classList.remove("drop-highlight"));

    if (dragState.hasMoved) {
      const target = findDropTarget(clientX, clientY);
      let moved = false;

      if (target) {
        if (target.zone === "foundation") {
          if (dragState.zone === "waste") moved = moveWasteToFoundation(target.index);
          else if (dragState.zone === "tableau") moved = moveTableauToFoundation(dragState.index, target.index);
          else if (dragState.zone === "foundation") moved = false;
        } else if (target.zone === "tableau") {
          if (dragState.zone === "waste") moved = moveWasteToTableau(target.index);
          else if (dragState.zone === "foundation") moved = moveFoundationToTableau(dragState.index, target.index);
          else if (dragState.zone === "tableau") moved = moveTableauStack(dragState.index, dragState.cardIndex, target.index);
        }
      }

      if (!moved) {
        // Snap back
        returnDraggedCards();
      } else {
        dragState.els.forEach((el) => el.classList.remove("dragging"));
        tryAutoComplete();
      }
    } else {
      // It was just a click, not a drag — restore and handle as click
      returnDraggedCards();
    }

    dragState = null;
  }

  function returnDraggedCards() {
    if (!dragState) return;
    dragState.els.forEach((el, i) => {
      el.classList.remove("dragging");
      el.style.position = dragState.origPositions[i].position || "absolute";
      el.style.top = dragState.origPositions[i].top;
      el.style.left = dragState.origPositions[i].left;
      el.style.zIndex = dragState.origPositions[i].zIndex;
    });
  }

  // ── Event wiring ───────────────────────────────────────
  let lastClickTime = 0;
  let lastClickTarget = null;

  $board.addEventListener("pointerdown", (e) => {
    const cardEl = e.target.closest(".card");
    const slot = e.target.closest(".card-slot");
    if (!slot) return;

    const zone = slot.dataset.zone;
    const index = parseInt(slot.dataset.index);

    // Stock click
    if (zone === "stock") {
      handleStockClick();
      return;
    }

    // Determine card index for tableau
    let cardIndex;
    if (zone === "tableau" && cardEl) {
      cardIndex = parseInt(cardEl.dataset.cardIndex);
    }

    // Double-click detection
    const now = Date.now();
    if (cardEl && now - lastClickTime < 350 && lastClickTarget === cardEl) {
      if (zone === "waste" || zone === "tableau") {
        handleDoubleClick(zone, index, cardIndex);
        lastClickTime = 0;
        lastClickTarget = null;
        return;
      }
    }
    lastClickTime = now;
    lastClickTarget = cardEl;

    // Start drag if face-up card
    if (cardEl && !cardEl.classList.contains("face-down")) {
      if (zone === "waste") startDrag(e, "waste", 0, 0);
      else if (zone === "foundation") startDrag(e, "foundation", index, 0);
      else if (zone === "tableau") startDrag(e, "tableau", index, cardIndex);
      return;
    }

    // Clicking empty tableau column
    if (zone === "tableau" && !cardEl) {
      handleTableauClick(index, undefined);
      return;
    }

    // Clicking foundation slot
    if (zone === "foundation" && !cardEl) {
      handleFoundationClick(index);
    }
  });

  $board.addEventListener("pointermove", onDragMove);
  $board.addEventListener("pointerup", (e) => {
    if (dragState) {
      if (!dragState.hasMoved) {
        returnDraggedCards();
        // Treat as click
        const zone = dragState.zone;
        const index = dragState.index;
        const cardIndex = dragState.cardIndex;
        dragState = null;

        if (zone === "waste") handleWasteClick();
        else if (zone === "foundation") handleFoundationClick(index);
        else if (zone === "tableau") handleTableauClick(index, cardIndex);
      } else {
        endDrag(e);
      }
    }
  });
  $board.addEventListener("pointerleave", (e) => {
    if (dragState && dragState.hasMoved) endDrag(e);
  });

  // Touch support
  document.addEventListener("touchmove", (e) => {
    if (dragState) e.preventDefault();
  }, { passive: false });

  // Buttons
  $newGameBtn.addEventListener("click", startGame);
  $undoBtn.addEventListener("click", undo);
  $playAgainBtn.addEventListener("click", startGame);

  // Keyboard shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key === "z" && (e.ctrlKey || e.metaKey)) { undo(); e.preventDefault(); }
    if (e.key === "n" && (e.ctrlKey || e.metaKey)) { startGame(); e.preventDefault(); }
    if (e.key === "Escape") clearSelection();
  });

  // ── Start ──────────────────────────────────────────────
  startGame();
})();
