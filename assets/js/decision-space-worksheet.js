const DSW_STAGE_WIDTH = 920;
const DSW_STAGE_HEIGHT_DESKTOP = 600;
const DSW_STAGE_HEIGHT_MOBILE = 760;
const DSW_MIN_RADIUS = 54;
const DSW_MAX_RADIUS = 140;
const DSW_RADIUS_STEP = 12;

let dswBubbles = [];
let dswSelectedId = null;
let dswDraftText = '';
let dswDragState = null;

function initDecisionSpaceWorksheet() {
  const form = document.getElementById('dsw-form');
  const textInput = document.getElementById('bubble-text');
  const updateBtn = document.getElementById('update-bubble-btn');
  const clearBtn = document.getElementById('clear-form-btn');
  const enlargeBtn = document.getElementById('enlarge-bubble-btn');
  const shrinkBtn = document.getElementById('shrink-bubble-btn');
  const deleteBtn = document.getElementById('delete-bubble-btn');
  const stage = document.getElementById('decision-space-stage');

  if (!form || !textInput || !stage) return;

  form.addEventListener('submit', handleBubbleCreate);
  updateBtn.addEventListener('click', handleBubbleUpdate);
  clearBtn.addEventListener('click', clearBubbleForm);
  enlargeBtn.addEventListener('click', () => resizeSelectedBubble(DSW_RADIUS_STEP));
  shrinkBtn.addEventListener('click', () => resizeSelectedBubble(-DSW_RADIUS_STEP));
  deleteBtn.addEventListener('click', deleteSelectedBubble);

  textInput.addEventListener('input', () => {
    dswDraftText = textInput.value;
    syncUpdateButtonState();
  });

  stage.addEventListener('pointerdown', handleStagePointerDown);

  renderDecisionSpace();
  syncFormWithSelection();
}

function getStageHeight() {
  return window.innerWidth <= 768 ? DSW_STAGE_HEIGHT_MOBILE : DSW_STAGE_HEIGHT_DESKTOP;
}

function handleBubbleCreate(event) {
  event.preventDefault();
  const text = getTrimmedBubbleText();
  if (!text) {
    showToast('請先輸入泡泡內容');
    return;
  }

  const radius = 70;
  const bubble = {
    id: crypto.randomUUID(),
    text,
    radius,
    x: clamp(160 + (dswBubbles.length % 4) * 165, radius, DSW_STAGE_WIDTH - radius),
    y: clamp(160 + Math.floor(dswBubbles.length / 4) * 135, radius, getStageHeight() - radius)
  };

  dswBubbles.push(bubble);
  dswSelectedId = bubble.id;
  dswDraftText = '';

  renderDecisionSpace();
  syncFormWithSelection();
  showToast('已新增生涯泡泡');
}

function handleBubbleUpdate() {
  const bubble = getSelectedBubble();
  if (!bubble) return;

  const text = getTrimmedBubbleText();
  if (!text) {
    showToast('請先輸入要更新的內容');
    return;
  }

  bubble.text = text;
  dswDraftText = text;
  renderDecisionSpace();
  syncFormWithSelection();
  showToast('已更新泡泡內容');
}

function clearBubbleForm() {
  const hasDraft = Boolean(document.getElementById('bubble-text')?.value.trim());
  if (hasDraft && !window.confirm('要清空目前表單內容嗎？')) return;

  dswDraftText = '';
  dswSelectedId = null;
  syncFormWithSelection();
  renderDecisionSpace();
}

function handleStagePointerDown(event) {
  if (event.target.id === 'decision-space-stage' || event.target.id === 'decision-space-inner') {
    if (hasUnsavedChanges()) {
      const shouldSubmit = window.confirm('目前表單有尚未送出的修改，要先送出嗎？');
      if (shouldSubmit && !submitCurrentDraft()) return;
    }

    dswSelectedId = null;
    syncFormWithSelection();
    renderDecisionSpace();
  }
}

function renderDecisionSpace() {
  const stageInner = document.getElementById('decision-space-inner');
  const emptyState = document.getElementById('decision-space-empty');
  const toolbar = document.getElementById('bubble-toolbar');
  if (!stageInner || !emptyState || !toolbar) return;

  stageInner.querySelectorAll('.career-bubble').forEach(node => node.remove());
  emptyState.hidden = dswBubbles.length > 0;

  dswBubbles.forEach(bubble => {
    const bubbleEl = document.createElement('button');
    bubbleEl.type = 'button';
    bubbleEl.className = 'career-bubble';
    if (bubble.id === dswSelectedId) bubbleEl.classList.add('is-selected');
    bubbleEl.dataset.id = bubble.id;
    bubbleEl.setAttribute('aria-label', bubble.text);

    const label = document.createElement('span');
    label.className = 'career-bubble-label';
    bubbleEl.appendChild(label);

    const handle = document.createElement('span');
    handle.className = 'bubble-resize-handle';
    handle.dataset.role = 'resize';
    handle.title = '拖曳調整大小';
    bubbleEl.appendChild(handle);

    bubbleEl.addEventListener('click', event => {
      if (event.target.dataset.role === 'resize') return;
      selectBubbleWithGuard(bubble.id);
    });

    bubbleEl.addEventListener('pointerdown', event => {
      const isResize = event.target.dataset.role === 'resize';
      startBubblePointerAction(event, bubble.id, isResize ? 'resize' : 'drag');
    });

    paintBubbleElement(bubbleEl, bubble);
    stageInner.appendChild(bubbleEl);
  });

  toolbar.hidden = !getSelectedBubble();
}

function selectBubbleWithGuard(id) {
  if (id === dswSelectedId) {
    syncFormWithSelection();
    renderDecisionSpace();
    return;
  }

  if (hasUnsavedChanges()) {
    const shouldSubmit = window.confirm('目前表單有尚未送出的修改，要先送出嗎？');
    if (shouldSubmit && !submitCurrentDraft()) return;
  }

  dswSelectedId = id;
  syncFormWithSelection();
  renderDecisionSpace();
}

function startBubblePointerAction(event, bubbleId, type) {
  const bubble = dswBubbles.find(item => item.id === bubbleId);
  const bubbleEl = event.currentTarget;
  if (!bubble || !bubbleEl) return;

  if (hasUnsavedChanges() && bubbleId !== dswSelectedId) {
    const shouldSubmit = window.confirm('目前表單有尚未送出的修改，要先送出嗎？');
    if (shouldSubmit && !submitCurrentDraft()) return;
  }

  if (type === 'drag') {
    dswSelectedId = bubbleId;
    syncFormWithSelection();
    updateSelectionState();
  } else if (bubbleId !== dswSelectedId) {
    dswSelectedId = bubbleId;
    syncFormWithSelection();
    updateSelectionState();
  }

  event.preventDefault();
  bubbleEl.setPointerCapture(event.pointerId);

  dswDragState = {
    pointerId: event.pointerId,
    type,
    bubbleId,
    startX: event.clientX,
    startY: event.clientY,
    originX: bubble.x,
    originY: bubble.y,
    originRadius: bubble.radius
  };

  bubbleEl.classList.add(type === 'resize' ? 'is-resizing' : 'is-dragging');
  bubbleEl.addEventListener('pointermove', handleBubblePointerMove);
  bubbleEl.addEventListener('pointerup', endBubblePointerAction);
  bubbleEl.addEventListener('pointercancel', endBubblePointerAction);
}

function handleBubblePointerMove(event) {
  if (!dswDragState || event.pointerId !== dswDragState.pointerId) return;
  const bubble = dswBubbles.find(item => item.id === dswDragState.bubbleId);
  if (!bubble) return;
  const bubbleEl = document.querySelector(`.career-bubble[data-id="${bubble.id}"]`);
  if (!bubbleEl) return;

  const dx = event.clientX - dswDragState.startX;
  const dy = event.clientY - dswDragState.startY;

  if (dswDragState.type === 'drag') {
    bubble.x = clamp(dswDragState.originX + dx, bubble.radius, DSW_STAGE_WIDTH - bubble.radius);
    bubble.y = clamp(dswDragState.originY + dy, bubble.radius, getStageHeight() - bubble.radius);
  } else {
    const nextRadius = clamp(
      dswDragState.originRadius + Math.max(dx, dy),
      DSW_MIN_RADIUS,
      DSW_MAX_RADIUS
    );
    bubble.radius = fitRadiusWithinStage(bubble.x, bubble.y, nextRadius);
  }

  paintBubbleElement(bubbleEl, bubble);
}

function endBubblePointerAction(event) {
  if (!dswDragState || event.pointerId !== dswDragState.pointerId) return;
  const bubbleEl = event.currentTarget;
  bubbleEl.classList.remove('is-dragging', 'is-resizing');
  bubbleEl.removeEventListener('pointermove', handleBubblePointerMove);
  bubbleEl.removeEventListener('pointerup', endBubblePointerAction);
  bubbleEl.removeEventListener('pointercancel', endBubblePointerAction);
  dswDragState = null;
  renderDecisionSpace();
}

function resizeSelectedBubble(delta) {
  const bubble = getSelectedBubble();
  if (!bubble) return;

  const nextRadius = fitRadiusWithinStage(
    bubble.x,
    bubble.y,
    clamp(bubble.radius + delta, DSW_MIN_RADIUS, DSW_MAX_RADIUS)
  );

  if (nextRadius === bubble.radius) {
    showToast('已到可調整的大小上限');
    return;
  }

  bubble.radius = nextRadius;
  renderDecisionSpace();
}

function deleteSelectedBubble() {
  const bubble = getSelectedBubble();
  if (!bubble) return;
  if (!window.confirm(`要刪除「${bubble.text}」這個泡泡嗎？`)) return;

  dswBubbles = dswBubbles.filter(item => item.id !== bubble.id);
  dswSelectedId = null;
  dswDraftText = '';
  renderDecisionSpace();
  syncFormWithSelection();
  showToast('已刪除泡泡');
}

function updateSelectionState() {
  document.querySelectorAll('.career-bubble').forEach(node => {
    node.classList.toggle('is-selected', node.dataset.id === dswSelectedId);
  });
  const toolbar = document.getElementById('bubble-toolbar');
  if (toolbar) toolbar.hidden = !getSelectedBubble();
}

function paintBubbleElement(element, bubble) {
  element.style.width = `${bubble.radius * 2}px`;
  element.style.height = `${bubble.radius * 2}px`;
  element.style.left = `${bubble.x - bubble.radius}px`;
  element.style.top = `${bubble.y - bubble.radius}px`;

  const label = element.querySelector('.career-bubble-label');
  if (label) {
    label.textContent = bubble.text;
    label.style.fontSize = `${clamp(bubble.radius * 0.36, 14, 22)}px`;
  }
}

function syncFormWithSelection() {
  const textInput = document.getElementById('bubble-text');
  const updateBtn = document.getElementById('update-bubble-btn');
  if (!textInput || !updateBtn) return;

  const selectedBubble = getSelectedBubble();
  textInput.value = selectedBubble ? selectedBubble.text : dswDraftText;
  updateBtn.disabled = !selectedBubble || !textInput.value.trim();
}

function syncUpdateButtonState() {
  const updateBtn = document.getElementById('update-bubble-btn');
  if (!updateBtn) return;
  updateBtn.disabled = !getSelectedBubble() || !getTrimmedBubbleText();
}

function submitCurrentDraft() {
  return getSelectedBubble() ? submitBubbleUpdateFromGuard() : submitBubbleCreateFromGuard();
}

function submitBubbleCreateFromGuard() {
  const text = getTrimmedBubbleText();
  if (!text) {
    showToast('請先完成目前表單內容');
    return false;
  }
  handleBubbleCreate(new Event('submit'));
  return true;
}

function submitBubbleUpdateFromGuard() {
  const text = getTrimmedBubbleText();
  if (!text) {
    showToast('請先完成目前表單內容');
    return false;
  }
  handleBubbleUpdate();
  return true;
}

function hasUnsavedChanges() {
  const text = getTrimmedBubbleText();
  if (!text) return false;

  const bubble = getSelectedBubble();
  if (!bubble) return text.length > 0;
  return bubble.text !== text;
}

function getTrimmedBubbleText() {
  return (document.getElementById('bubble-text')?.value || '').trim();
}

function getSelectedBubble() {
  return dswBubbles.find(item => item.id === dswSelectedId) || null;
}

function fitRadiusWithinStage(x, y, radius) {
  return Math.min(
    radius,
    x,
    y,
    DSW_STAGE_WIDTH - x,
    getStageHeight() - y,
    DSW_MAX_RADIUS
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resetDecisionSpace() {
  if (dswBubbles.length === 0 && !getTrimmedBubbleText()) return;
  if (!window.confirm('要清空目前所有生涯泡泡嗎？')) return;

  dswBubbles = [];
  dswSelectedId = null;
  dswDraftText = '';
  renderDecisionSpace();
  syncFormWithSelection();
  showToast('已清空決策空間');
}
