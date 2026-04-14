/**
 * value-navigation.js – 價值導航卡
 *
 * Sub-modes:
 *   'all'  – all 70 cards, MAX_LIKED = 15
 *   'cat'  – filtered by one category, MAX_LIKED = 10
 *
 * URL params:
 *   ?liked=1,2,3&sub=all
 *   ?liked=41,42&sub=cat&cat=工作追求
 */

// ===== DATA =====

const VALUE_CARDS = [
  { id:  1, text: '享受生活、美食等休閒娛樂', category: '自我與生活' },
  { id:  2, text: '有趣的人事物', category: '自我與生活' },
  { id:  3, text: '忠於自我', category: '自我與生活' },
  { id:  4, text: '自由自在不受拘束', category: '自我與生活' },
  { id:  5, text: '內在的平靜', category: '自我與生活' },
  { id:  6, text: '對生命、人性或人生的洞察智慧', category: '自我與生活' },
  { id:  7, text: '保持潔淨身體、心靈或環境', category: '自我與生活' },
  { id:  8, text: '健康的身體與心靈', category: '自我與生活' },
  { id:  9, text: '保有隱私 不受人打擾', category: '自我與生活' },
  { id: 10, text: '追求真理與知性', category: '自我與生活' },
  { id: 11, text: '自我肯定 喜歡自己', category: '自我與生活' },
  { id: 12, text: '自我表達與呈現', category: '自我與生活' },
  { id: 13, text: '舒適的環境', category: '自我與生活' },
  { id: 14, text: '信仰、宗教或靈性的生活', category: '自我與生活' },
  { id: 15, text: '平凡的生活', category: '自我與生活' },
  { id: 16, text: '能親近大自然', category: '自我與生活' },
  { id: 17, text: '規律的生活', category: '自我與生活' },
  { id: 18, text: '有獨處的空間', category: '自我與生活' },
  { id: 19, text: '低調 不張揚', category: '自我與生活' },
  { id: 20, text: '忠誠', category: '美德價值' },
  { id: 21, text: '國家主權 民族意識', category: '美德價值' },
  { id: 22, text: '不欺騙 不說謊', category: '美德價值' },
  { id: 23, text: '不要傷害別人', category: '美德價值' },
  { id: 24, text: '知恩圖報', category: '美德價值' },
  { id: 25, text: '真誠一致', category: '美德價值' },
  { id: 26, text: '全人類的福祉', category: '美德價值' },
  { id: 27, text: '尊重傳統延續歷史', category: '美德價值' },
  { id: 28, text: '公平正義', category: '美德價值' },
  { id: 29, text: '保護環境或動植物', category: '美德價值' },
  { id: 30, text: '社會公益 關懷弱勢', category: '美德價值' },
  { id: 31, text: '交友廣闊', category: '人際關係' },
  { id: 32, text: '愛與被愛', category: '人際關係' },
  { id: 33, text: '歸屬與認同 屬於某個身份或團體', category: '人際關係' },
  { id: 34, text: '能彼此尊重', category: '人際關係' },
  { id: 35, text: '獲得父母的認同', category: '人際關係' },
  { id: 36, text: '有一個安穩的家', category: '人際關係' },
  { id: 37, text: '深刻友誼', category: '人際關係' },
  { id: 38, text: '人際和諧', category: '人際關係' },
  { id: 39, text: '有小孩', category: '人際關係' },
  { id: 40, text: '能好好照顧家人', category: '人際關係' },
  { id: 41, text: '有夥伴一起打拼', category: '工作追求' },
  { id: 42, text: '解決他人的問題 幫助他人成長', category: '工作追求' },
  { id: 43, text: '對他人社會有影響力', category: '工作追求' },
  { id: 44, text: '負責 勇於承擔責任', category: '工作追求' },
  { id: 45, text: '資產與金錢', category: '工作追求' },
  { id: 46, text: '晉升的機會與速度', category: '工作追求' },
  { id: 47, text: '擁有自己的事業', category: '工作追求' },
  { id: 48, text: '權威身份 擁有特定地位職權', category: '工作追求' },
  { id: 49, text: '社會認可 受人尊重', category: '工作追求' },
  { id: 50, text: '有效率、有效能', category: '工作追求' },
  { id: 51, text: '領導團隊', category: '工作追求' },
  { id: 52, text: '務實 重視可行性', category: '工作追求' },
  { id: 53, text: '能被看見 有舞台能發光', category: '工作追求' },
  { id: 54, text: '清楚的流程與規範', category: '工作追求' },
  { id: 55, text: '隨遇而安 順勢而為', category: '工作追求' },
  { id: 56, text: '工作穩定性', category: '工作追求' },
  { id: 57, text: '工作生活平衡', category: '工作追求' },
  { id: 58, text: '發揮自己的天賦能力', category: '工作追求' },
  { id: 59, text: '追求美感或藝術', category: '工作追求' },
  { id: 60, text: '專業', category: '工作追求' },
  { id: 61, text: '創新與創造', category: '工作追求' },
  { id: 62, text: '追求工作品質', category: '工作追求' },
  { id: 63, text: '獨立自主', category: '工作追求' },
  { id: 64, text: '邏輯清晰', category: '工作追求' },
  { id: 65, text: '能持續自我成長', category: '工作追求' },
  { id: 66, text: '安全感 工作上或心裡面可預測或可掌控', category: '工作追求' },
  { id: 67, text: '冒險挑戰', category: '工作追求' },
  { id: 68, text: '有明確的目標或方向', category: '工作追求' },
  { id: 69, text: '有成就感', category: '工作追求' },
  { id: 70, text: '有秩序與穩定的環境', category: '工作追求' }
];

const VAL_CATEGORIES = ['自我與生活', '美德價值', '人際關係', '工作追求'];

const CAT_COLOR = {
  '自我與生活': 'cat-pink',
  '美德價值':   'cat-teal',
  '人際關係':   'cat-amber',
  '工作追求':   'cat-blue'
};

const MAX_ALL = 15;
const MAX_CAT = 10;

// ===== STATE =====
let valSubMode   = 'all';       // 'all' | 'cat'
let valCategory  = '工作追求';
let currentMode  = 'select';    // tracks active view for re-render on filter change
let liked        = new Set();
let disliked     = new Set();
let currentIndex = 0;

// ===== HELPERS =====

function getActiveCards() {
  if (valSubMode === 'all') return VALUE_CARDS;
  return VALUE_CARDS.filter(c => c.category === valCategory);
}

function getMaxLiked() {
  return valSubMode === 'all' ? MAX_ALL : MAX_CAT;
}

function cardById(id) {
  return VALUE_CARDS.find(c => c.id === id);
}

// Keep liked set trimmed to max, preserving insertion order.
// Returns true if any were removed.
function _trimLikedToMax(max) {
  if (liked.size <= max) return false;
  const arr = [...liked].slice(0, max);
  liked = new Set(arr);
  return true;
}

// ===== INIT =====

function initValueNavigation() {
  const params     = new URLSearchParams(location.search);
  const likedParam = params.get('liked');
  const subParam   = params.get('sub');
  const catParam   = params.get('cat');

  if (subParam === 'all' || subParam === 'cat') valSubMode = subParam;
  if (catParam && VAL_CATEGORIES.includes(catParam)) valCategory = catParam;
  if (likedParam) {
    likedParam.split(',').forEach(s => {
      const id = parseInt(s, 10);
      if (!isNaN(id)) liked.add(id);
    });
  }

  renderFilterBar();
  renderCards();
  renderChips();
  updateStatusBar();
  renderInputSlots();

  // If URL had data, jump straight to display mode
  if (liked.size > 0 && subParam) {
    switchMode('display');
  }
}

// ===== FILTER BAR =====

function renderFilterBar() {
  const allBtn = document.getElementById('val-sub-all');
  const catBtn = document.getElementById('val-sub-cat');
  if (allBtn) {
    allBtn.classList.toggle('active', valSubMode === 'all');
    catBtn.classList.toggle('active', valSubMode === 'cat');
  }

  const tabsWrap = document.getElementById('val-cat-tabs');
  if (!tabsWrap) return;
  if (valSubMode === 'cat') {
    tabsWrap.style.display = 'flex';
    tabsWrap.innerHTML = VAL_CATEGORIES.map(cat => `
      <button class="val-cat-tab ${CAT_COLOR[cat]} ${cat === valCategory ? 'active' : ''}"
              onclick="setValCategory('${cat}')">${cat}</button>
    `).join('');
  } else {
    tabsWrap.style.display = 'none';
  }
}

// ===== SUB-MODE / CATEGORY SWITCHING =====

function setValSubMode(sub) {
  if (sub === valSubMode) return;

  if (sub === 'cat') {
    // all → cat: keep only liked cards that belong to valCategory, trim to MAX_CAT
    const catIds = new Set(VALUE_CARDS.filter(c => c.category === valCategory).map(c => c.id));
    liked = new Set([...liked].filter(id => catIds.has(id)));
    _trimLikedToMax(MAX_CAT);
  } else {
    // cat → all: keep all current liked, trim to MAX_ALL if somehow over
    _trimLikedToMax(MAX_ALL);
  }

  disliked.clear();
  currentIndex = 0;
  valSubMode = sub;

  renderFilterBar();
  _rerenderActiveView();
  renderChips();
  updateStatusBar();
  renderInputSlots();
  refreshAllSpreadDisabled();
}

function setValCategory(cat) {
  if (cat === valCategory) return;

  // Keep liked cards that belong to the new category, trim to MAX_CAT
  const catIds = new Set(VALUE_CARDS.filter(c => c.category === cat).map(c => c.id));
  liked = new Set([...liked].filter(id => catIds.has(id)));
  _trimLikedToMax(MAX_CAT);

  disliked.clear();
  currentIndex = 0;
  valCategory = cat;

  renderFilterBar();
  _rerenderActiveView();
  renderChips();
  updateStatusBar();
  renderInputSlots();
  refreshAllSpreadDisabled();
}

// Re-render whichever content view is currently active (select or spread)
function _rerenderActiveView() {
  if (currentMode === 'spread') {
    renderSpreadCards();
  } else {
    renderCards(); // select mode (or default)
  }
}

// ===== MODE SWITCHER =====

function switchMode(mode) {
  currentMode = mode;

  const selectView  = document.getElementById('val-select-view');
  const spreadView  = document.getElementById('val-spread-view');
  const displayView = document.getElementById('val-display-view');
  const inputView   = document.getElementById('val-input-view');
  const filterBar   = document.getElementById('val-filter-bar');

  [selectView, spreadView, displayView, inputView].forEach(v => { if (v) v.style.display = 'none'; });
  ['mode-select-btn','mode-spread-btn','mode-display-btn','mode-input-btn']
    .forEach(id => { const b = document.getElementById(id); if (b) b.classList.remove('active'); });

  if (mode === 'select') {
    if (selectView)  selectView.style.display = '';
    document.getElementById('mode-select-btn')?.classList.add('active');
    if (filterBar)   filterBar.style.display  = '';
    renderCards();
    renderChips();
    updateStatusBar();

  } else if (mode === 'spread') {
    if (spreadView)  spreadView.style.display = '';
    document.getElementById('mode-spread-btn')?.classList.add('active');
    if (filterBar)   filterBar.style.display  = '';
    renderSpreadCards();
    renderChips();

  } else if (mode === 'display') {
    if (displayView) displayView.style.display = '';
    document.getElementById('mode-display-btn')?.classList.add('active');
    if (filterBar)   filterBar.style.display   = 'none';
    renderDisplayCards();

  } else if (mode === 'input') {
    if (inputView)   inputView.style.display   = '';
    document.getElementById('mode-input-btn')?.classList.add('active');
    if (filterBar)   filterBar.style.display   = '';   // ← visible in input too
    renderInputSlots();
    _fillSlotsFromState();
  }
}

// ===== STATUS BAR =====

function updateStatusBar() {
  const cards    = getActiveCards();
  const total    = cards.length;
  const evaluated = cards.filter(c => liked.has(c.id) || disliked.has(c.id)).length;
  const remaining = total - evaluated;
  const maxLiked  = getMaxLiked();

  const likedCounter = document.getElementById('val-liked-counter');
  if (likedCounter) {
    likedCounter.querySelector('.badge-num').textContent = liked.size;
    likedCounter.querySelector('.val-max-label').textContent = `/ ${maxLiked} 已選認同`;
  }

  const progressLabel = document.getElementById('val-progress-label');
  if (progressLabel) progressLabel.textContent = `已評估 ${evaluated} / ${total} 張`;

  const progressFill = document.getElementById('val-progress-fill');
  if (progressFill) progressFill.style.width = total > 0 ? `${(evaluated / total) * 100}%` : '0%';

  const remainingText = document.getElementById('val-remaining-text');
  if (remainingText) remainingText.textContent = `還有 ${remaining} 張未評估`;

  const banner = document.getElementById('val-complete-banner');
  if (banner) banner.style.display = (remaining === 0) ? '' : 'none';
}

// ===== CAROUSEL =====

function renderCards() {
  const track    = document.getElementById('val-cards-track');
  const dotsWrap = document.getElementById('val-carousel-dots');
  if (!track || !dotsWrap) return;

  const cards = getActiveCards();
  if (currentIndex >= cards.length) currentIndex = 0;

  track.innerHTML = cards.map((card, idx) => {
    const isLiked    = liked.has(card.id);
    const isDisliked = disliked.has(card.id);
    const catClass   = CAT_COLOR[card.category] || '';

    return `
      <div class="val-card-slide${idx === currentIndex ? ' active' : ''}" data-idx="${idx}">
        <div class="val-card-inner${isLiked ? ' is-liked' : isDisliked ? ' is-disliked' : ''}">
          <div class="val-card-num">#${card.id}</div>
          <div class="val-card-cat-tag ${catClass}">${card.category}</div>
          <div class="val-card-text">${card.text}</div>
          <div class="val-card-actions">
            <button class="val-btn val-like-btn${isLiked ? ' selected' : ''}"
                    onclick="handleLike(${card.id})"
                    ${!isLiked && liked.size >= getMaxLiked() ? 'disabled' : ''}>
              <span class="val-btn-emoji">😊</span>
              <span class="val-btn-label">認同</span>
            </button>
            <button class="val-btn val-dislike-btn${isDisliked ? ' selected' : ''}"
                    onclick="handleDislike(${card.id})">
              <span class="val-btn-emoji">😐</span>
              <span class="val-btn-label">不認同</span>
            </button>
          </div>
        </div>
      </div>`;
  }).join('');

  dotsWrap.innerHTML = cards.map((card, idx) => {
    let cls = 'val-carousel-dot';
    if (liked.has(card.id))         cls += ' is-liked-dot';
    else if (disliked.has(card.id)) cls += ' is-disliked-dot';
    if (idx === currentIndex)       cls += ' active';
    return `<span class="${cls}" onclick="goToCard(${idx})"></span>`;
  }).join('');

  updateNavBtns(cards.length);
}

function updateNavBtns(total) {
  const prev = document.getElementById('val-prev-btn');
  const next = document.getElementById('val-next-btn');
  if (prev) prev.disabled = (currentIndex === 0);
  if (next) next.disabled = (currentIndex === total - 1);
}

function goToCard(idx) { currentIndex = idx; renderCards(); }
function prevCard() { if (currentIndex > 0) { currentIndex--; renderCards(); } }
function nextCard() {
  const cards = getActiveCards();
  if (currentIndex < cards.length - 1) { currentIndex++; renderCards(); }
}

function findNextUnevaluated() {
  const cards = getActiveCards();
  for (let i = currentIndex + 1; i < cards.length; i++) {
    if (!liked.has(cards[i].id) && !disliked.has(cards[i].id)) return i;
  }
  for (let i = 0; i < currentIndex; i++) {
    if (!liked.has(cards[i].id) && !disliked.has(cards[i].id)) return i;
  }
  return currentIndex + 1 < cards.length ? currentIndex + 1 : currentIndex;
}

// ===== ACTIONS (carousel) =====

function handleLike(id) {
  if (!liked.has(id) && liked.size >= getMaxLiked()) return;
  liked.add(id);
  disliked.delete(id);
  currentIndex = findNextUnevaluated();
  renderCards();
  renderChips();
  updateStatusBar();
  refreshAllSpreadDisabled();
}

function handleDislike(id) {
  disliked.add(id);
  liked.delete(id);
  currentIndex = findNextUnevaluated();
  renderCards();
  renderChips();
  updateStatusBar();
  refreshAllSpreadDisabled();
}

function removeLike(id) {
  liked.delete(id);
  renderCards();
  renderChips();
  updateStatusBar();
  refreshValSpreadCardUI(id);
  refreshAllSpreadDisabled();
}

// ===== CHIPS =====

function _renderChipContainer(containerId, countId) {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;

  const maxLiked = getMaxLiked();
  if (countEl) countEl.textContent = `${liked.size} / ${maxLiked}`;

  if (liked.size === 0) {
    container.innerHTML = '<span class="val-chips-empty">尚未選擇</span>';
    return;
  }

  container.innerHTML = [...liked].map(id => {
    const card     = cardById(id);
    const catClass = card ? CAT_COLOR[card.category] : '';
    return `<span class="val-chip ${catClass}" onclick="removeLike(${id})" title="點擊移除">
      ${card ? card.text : `#${id}`} ✕
    </span>`;
  }).join('');
}

function renderChips() {
  _renderChipContainer('val-liked-chips',     'val-chips-count');
  _renderChipContainer('val-spr-liked-chips', 'val-spr-liked-count');
}

// ===== SPREAD VIEW =====

function renderSpreadCards() {
  const grid = document.getElementById('val-spread-grid');
  if (!grid) return;

  const cards    = getActiveCards();
  const maxLiked = getMaxLiked();

  grid.innerHTML = cards.map(card => {
    const isLiked      = liked.has(card.id);
    const isDisliked   = disliked.has(card.id);
    const likeDisabled = !isLiked && liked.size >= maxLiked;
    const catClass     = CAT_COLOR[card.category] || '';

    return `
      <div class="val-spr-wrap" id="val-spr-wrap-${card.id}">
        <div class="val-spr-actions">
          <button class="val-spr-btn spr-like-btn ${isLiked ? 'selected' : ''}"
                  id="val-spr-like-${card.id}"
                  onclick="handleLikeSpread(${card.id})"
                  ${likeDisabled ? 'disabled' : ''}>✓</button>
          <button class="val-spr-btn spr-dislike-btn ${isDisliked ? 'selected' : ''}"
                  id="val-spr-dislike-${card.id}"
                  onclick="handleDislikeSpread(${card.id})">✕</button>
        </div>
        <div class="val-spr-card${isLiked ? ' spr-is-liked' : isDisliked ? ' spr-is-disliked' : ''}"
             id="val-spr-card-${card.id}">
          <div class="val-spr-num">#${card.id}</div>
          <div class="val-card-cat-tag ${catClass}">${card.category}</div>
          <div class="val-spr-text">${card.text}</div>
        </div>
      </div>`;
  }).join('');
}

function handleLikeSpread(id) {
  if (!liked.has(id) && liked.size >= getMaxLiked()) return;
  liked.add(id);
  disliked.delete(id);
  refreshValSpreadCardUI(id);
  refreshAllSpreadDisabled();
  updateStatusBar();
  renderChips();
}

function handleDislikeSpread(id) {
  disliked.add(id);
  liked.delete(id);
  refreshValSpreadCardUI(id);
  refreshAllSpreadDisabled();
  updateStatusBar();
  renderChips();
}

function refreshValSpreadCardUI(id) {
  const card       = document.getElementById(`val-spr-card-${id}`);
  const likeBtn    = document.getElementById(`val-spr-like-${id}`);
  const dislikeBtn = document.getElementById(`val-spr-dislike-${id}`);
  if (!card) return;

  const isLiked    = liked.has(id);
  const isDisliked = disliked.has(id);

  card.classList.toggle('spr-is-liked',    isLiked);
  card.classList.toggle('spr-is-disliked', isDisliked);
  if (likeBtn)     likeBtn.classList.toggle('selected',    isLiked);
  if (dislikeBtn)  dislikeBtn.classList.toggle('selected', isDisliked);
}

function refreshAllSpreadDisabled() {
  const maxLiked = getMaxLiked();
  const atMax    = liked.size >= maxLiked;
  getActiveCards().forEach(card => {
    const btn = document.getElementById(`val-spr-like-${card.id}`);
    if (btn) btn.disabled = atMax && !liked.has(card.id);
  });
}

// ===== DISPLAY VIEW =====

function renderDisplayCards() {
  const grid    = document.getElementById('val-display-grid');
  const countEl = document.getElementById('val-display-liked-count');
  if (!grid) return;

  if (countEl) countEl.textContent = `共 ${liked.size} 個價值`;

  if (liked.size === 0) {
    grid.innerHTML = '<p class="val-empty-hint">尚未選擇任何認同的價值。</p>';
    return;
  }

  grid.innerHTML = [...liked].map(id => {
    const card = cardById(id);
    if (!card) return '';
    const catClass = CAT_COLOR[card.category] || '';
    return `
      <div class="val-display-card">
        <div class="val-card-num">#${card.id}</div>
        <div class="val-card-cat-tag ${catClass}">${card.category}</div>
        <div class="val-display-text">${card.text}</div>
      </div>`;
  }).join('');
}

// ===== SHARE =====

function buildShareURL() {
  const params = new URLSearchParams();
  if (liked.size > 0) params.set('liked', [...liked].join(','));
  params.set('sub', valSubMode);
  if (valSubMode === 'cat') params.set('cat', valCategory);
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function shareResult() {
  if (liked.size === 0) { showToast('尚未選擇任何認同的價值。'); return; }
  const url = buildShareURL();
  navigator.clipboard.writeText(url).then(() => {
    showToast('✅ 連結已複製！');
  }).catch(() => {
    prompt('複製以下連結：', url);
  });
}

// ===== RESET =====

function resetAll() {
  if (!confirm('確定要重新開始？所有選擇將清除。')) return;
  liked.clear();
  disliked.clear();
  currentIndex = 0;
  renderCards();
  renderChips();
  updateStatusBar();
  switchMode('select');
  history.replaceState(null, '', location.pathname);
  showToast('已重新開始');
}

// ===== QUICK INPUT =====
// Uses same slot design as occupations.js:
//   .input-slot > .input-slot-label + input.input-slot-field + .input-slot-preview

function _getSlotCount() {
  return getMaxLiked(); // 15 (all) or 10 (cat)
}

function renderInputSlots() {
  const grid = document.getElementById('val-input-slots-grid');
  if (!grid) return;

  const count = _getSlotCount();
  grid.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const slot = document.createElement('div');
    slot.className = 'input-slot';
    slot.id = `val-slot-${i}`;
    slot.innerHTML = `
      <div class="input-slot-label">認同 ${i + 1}</div>
      <input type="number" class="input-slot-field"
             id="val-slot-input-${i}"
             min="1" max="70" step="1" placeholder="編號"
             oninput="onValSlotInput(${i})"
             onkeydown="onValSlotKeydown(event, ${i})">
      <div class="input-slot-preview" id="val-slot-preview-${i}"></div>`;
    grid.appendChild(slot);
  }

  // Update intro text to reflect current sub-mode
  const intro = document.getElementById('val-input-intro-count');
  if (intro) intro.textContent = count;

  // Hide result box on re-render (slot count may have changed)
  const resultBox = document.getElementById('val-input-result-box');
  if (resultBox) resultBox.classList.remove('visible');
  const errEl = document.getElementById('val-input-error-summary');
  if (errEl) errEl.textContent = '';
}

function onValSlotInput(idx) {
  const field   = document.getElementById(`val-slot-input-${idx}`);
  const preview = document.getElementById(`val-slot-preview-${idx}`);
  if (!field || !preview) return;

  const val = field.value.trim();
  field.className   = 'input-slot-field';
  preview.className = 'input-slot-preview';
  preview.textContent = '';

  if (val === '') {
    _revalidateAllValSlots();
    _applyInputToState();
    return;
  }

  const id   = parseInt(val, 10);
  const card = VALUE_CARDS.find(c => c.id === id);

  if (isNaN(id) || id < 1 || id > 70 || !card) {
    field.className   = 'input-slot-field is-error';
    preview.className = 'input-slot-preview preview-error';
    preview.textContent = '查無此編號';
  } else if (_checkValDuplicate(idx, id)) {
    field.className   = 'input-slot-field is-dup';
    preview.className = 'input-slot-preview preview-dup';
    preview.textContent = '編號重複';
  } else {
    field.className   = 'input-slot-field is-valid';
    preview.className = 'input-slot-preview preview-name';
    preview.textContent = card.text;
  }

  _revalidateAllValSlots();
  _applyInputToState();
}

function onValSlotKeydown(e, idx) {
  if (e.key === 'Backspace') {
    const field = document.getElementById(`val-slot-input-${idx}`);
    if (field && field.value === '' && idx > 0) {
      const prev = document.getElementById(`val-slot-input-${idx - 1}`);
      if (prev) { prev.focus(); prev.select(); }
    }
  }
}

function _checkValDuplicate(currentIdx, id) {
  const count = _getSlotCount();
  for (let i = 0; i < count; i++) {
    if (i === currentIdx) continue;
    const f = document.getElementById(`val-slot-input-${i}`);
    if (f && parseInt(f.value, 10) === id) return true;
  }
  return false;
}

function _revalidateAllValSlots() {
  const count = _getSlotCount();
  for (let i = 0; i < count; i++) {
    const field   = document.getElementById(`val-slot-input-${i}`);
    const preview = document.getElementById(`val-slot-preview-${i}`);
    if (!field || !preview) continue;

    const val = field.value.trim();
    field.className   = 'input-slot-field';
    preview.className = 'input-slot-preview';
    preview.textContent = '';

    if (val === '') continue;

    const id   = parseInt(val, 10);
    const card = VALUE_CARDS.find(c => c.id === id);

    if (isNaN(id) || id < 1 || id > 70 || !card) {
      field.className   = 'input-slot-field is-error';
      preview.className = 'input-slot-preview preview-error';
      preview.textContent = '查無此編號';
    } else if (_checkValDuplicate(i, id)) {
      field.className   = 'input-slot-field is-dup';
      preview.className = 'input-slot-preview preview-dup';
      preview.textContent = '編號重複';
    } else {
      field.className   = 'input-slot-field is-valid';
      preview.className = 'input-slot-preview preview-name';
      preview.textContent = card.text;
    }
  }
}

function generateInputURL() {
  const errEl = document.getElementById('val-input-error-summary');
  if (liked.size === 0) {
    if (errEl) errEl.textContent = '⚠️ 請至少輸入一個編號';
    return;
  }
  if (errEl) errEl.textContent = '';

  const url        = buildShareURL();
  const resultBox  = document.getElementById('val-input-result-box');
  const resultUrl  = document.getElementById('val-input-result-url');
  const resultNames = document.getElementById('val-input-result-names');

  if (resultBox)   resultBox.classList.add('visible');
  if (resultUrl)   resultUrl.textContent   = url;
  if (resultNames) resultNames.innerHTML   = [...liked].map(id => {
    const c = cardById(id);
    return `<span class="result-name-chip">#${id} ${c ? c.text : ''}</span>`;
  }).join('');
}

function copyInputURL() {
  const urlEl = document.getElementById('val-input-result-url');
  if (!urlEl || !urlEl.textContent) return;
  navigator.clipboard.writeText(urlEl.textContent).then(() => {
    showToast('✅ 連結已複製！');
  }).catch(() => {
    prompt('複製以下連結：', urlEl.textContent);
  });
}

function clearInputPanel() {
  liked = new Set();
  renderInputSlots();          // resets all slot DOM
  renderCards();
  renderChips();
  updateStatusBar();
  const resultBox = document.getElementById('val-input-result-box');
  if (resultBox) resultBox.classList.remove('visible');
  const errEl = document.getElementById('val-input-error-summary');
  if (errEl) errEl.textContent = '';
}

// ===== INPUT ↔ STATE SYNC =====

// Read all is-valid slots → rebuild liked Set → re-render other views silently.
function _applyInputToState() {
  const count    = _getSlotCount();
  const newLiked = new Set();
  for (let i = 0; i < count; i++) {
    const f = document.getElementById(`val-slot-input-${i}`);
    if (f && f.classList.contains('is-valid')) {
      const id = parseInt(f.value, 10);
      if (!isNaN(id)) newLiked.add(id);
    }
  }
  liked = newLiked;
  liked.forEach(id => disliked.delete(id)); // can't be both
  renderCards();
  renderChips();
  updateStatusBar();
}

// Pre-fill slots from current liked Set (called when entering input mode).
function _fillSlotsFromState() {
  const likedArr = [...liked];
  const count    = _getSlotCount();
  for (let i = 0; i < count; i++) {
    const field   = document.getElementById(`val-slot-input-${i}`);
    const preview = document.getElementById(`val-slot-preview-${i}`);
    if (!field || !preview) continue;
    if (i < likedArr.length) {
      field.value = likedArr[i];
      onValSlotInput(i);
    }
    // empty slots are already blank from renderInputSlots()
  }
}

// ===== TOUCH / SWIPE =====

(function () {
  let startX = 0;
  document.addEventListener('touchstart', e => {
    const vp = document.getElementById('val-cards-viewport');
    if (vp && vp.contains(e.target)) startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const vp = document.getElementById('val-cards-viewport');
    if (!vp || !vp.contains(e.target)) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) dx < 0 ? nextCard() : prevCard();
  }, { passive: true });
})();
