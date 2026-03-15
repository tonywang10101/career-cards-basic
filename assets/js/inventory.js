/* ===================================================================
   inventory.js – 職能盤點 (Inventory) tool logic
   =================================================================== */

// ===== CONSTANTS =====
const MAX_STRENGTH = 7;
const MAX_WEAKNESS = 7;

// Per-category colors
const CATEGORY_META = {
  'Action & Execution': { color: '#F97316', bg: '#FFF7ED', label: '行動執行' },
  'Thinking & Mindset': { color: '#6366F1', bg: '#EEF2FF', label: '思維心態' },
  'People & Leadership': { color: '#10B981', bg: '#ECFDF5', label: '人際領導' },
  'Skills & Application': { color: '#0EA5E9', bg: '#F0F9FF', label: '技能應用' }
};

// ===== CARD DATA =====
const INVENTORY_CARDS = [
  { id:  1, category:'Action & Execution', title:'時間管理', desc:'規劃每日與長期時間;設定優先順序;在期限內完成任務;避免拖延維持效率', shadow:'過度安排時間缺乏彈性' },
  { id:  2, category:'Action & Execution', title:'目標導向', desc:'設定明確目標;追蹤進度;採取行動達成目標;維持動力直到完成', shadow:'過度專注成果忽略過程' },
  { id:  3, category:'Action & Execution', title:'提升效率', desc:'優化流程;找到更快速方法;減少時間浪費;提升整體效率', shadow:'過度追求效率忽略品質' },
  { id:  4, category:'Action & Execution', title:'擷取重點', desc:'快速理解核心;從大量資訊抓關鍵;整理重點;協助他人理解複雜內容', shadow:'過度簡化資訊' },
  { id:  5, category:'Action & Execution', title:'責任承諾', desc:'對工作結果負責;信守承諾;主動完成任務;困難時仍持續投入', shadow:'過度承擔責任' },
  { id:  6, category:'Action & Execution', title:'廣泛收集', desc:'蒐集大量資訊;多方來源尋找資料;建立完整資訊基礎;避免資訊不足造成錯誤', shadow:'資訊過多難以決策' },
  { id:  7, category:'Action & Execution', title:'規劃秩序', desc:'建立工作流程;安排任務順序;整理資料;維持環境整齊', shadow:'過度重視秩序缺乏彈性' },
  { id:  8, category:'Action & Execution', title:'資源應用', desc:'整合現有資源;善用人脈資金工具;限制條件下找解法;提升資源效率', shadow:'過度依賴資源' },
  { id:  9, category:'Action & Execution', title:'靈活應變', desc:'快速調整策略;在變化中找解法;因應環境變動;保持彈性', shadow:'缺乏長期規劃' },
  { id: 10, category:'Action & Execution', title:'統籌規劃', desc:'規劃整體流程;整合任務資源;掌握專案進度;協調工作環節', shadow:'過度掌控細節' },
  { id: 11, category:'Action & Execution', title:'持續優化', desc:'檢視流程;找出問題;改善成果品質;從經驗中學習', shadow:'過度修正降低效率' },
  { id: 12, category:'Action & Execution', title:'積極主動', desc:'主動提出想法;主動發現問題;不等待指示;願意承擔新任務', shadow:'忽略他人節奏' },
  { id: 13, category:'Action & Execution', title:'解決問題', desc:'分析問題原因;提出解決方案;整合資訊決策;修正解法', shadow:'過度分析延遲行動' },
  { id: 14, category:'Action & Execution', title:'冒險挑戰', desc:'嘗試新事物;面對不確定仍前進;不害怕失敗;從挑戰中學習', shadow:'忽略風險' },
  { id: 15, category:'Action & Execution', title:'熱力堅持', desc:'對目標充滿熱情;長期投入努力;遇困難不放棄;維持動力', shadow:'過度執著' },
  { id: 16, category:'Action & Execution', title:'行動執行', desc:'將想法轉為行動;快速開始任務;困難中仍行動;落實計畫', shadow:'衝動行動' },
  { id: 17, category:'Action & Execution', title:'時間規劃', desc:'安排任務時間;設定優先順序;有效利用時間;維持節奏', shadow:'過度控制時間' },
  { id: 18, category:'Action & Execution', title:'成就導向', desc:'渴望成果;追求更好表現;投入努力;從挑戰獲得動力', shadow:'過度競爭' },
  { id: 19, category:'Thinking & Mindset', title:'自我覺察', desc:'理解情緒想法;察覺偏好價值;反思行為原因;了解自己狀態', shadow:'過度自我反省' },
  { id: 20, category:'Thinking & Mindset', title:'創新思維', desc:'提出新想法;突破框架;連結不同概念;創造新可能', shadow:'忽略可行性' },
  { id: 21, category:'Thinking & Mindset', title:'邏輯推理', desc:'分析因果;建立推論;辨識矛盾;結構化思考', shadow:'忽略情感因素' },
  { id: 22, category:'Thinking & Mindset', title:'策略洞察', desc:'宏觀觀察情勢;理解複雜關聯;預測發展;制定策略', shadow:'過度分析' },
  { id: 23, category:'Thinking & Mindset', title:'系統思考', desc:'理解系統互動;看到整體結構;分析因果;避免只看局部', shadow:'過度複雜化' },
  { id: 24, category:'Thinking & Mindset', title:'高效學習', desc:'快速吸收知識;建立方法;整合資訊;持續提升能力', shadow:'只學不做' },
  { id: 25, category:'Thinking & Mindset', title:'自律節制', desc:'控制衝動;完成長期目標;抵抗誘惑;維持紀律', shadow:'過度壓抑' },
  { id: 26, category:'Thinking & Mindset', title:'相信自己', desc:'對能力有信心;壓力下保持信念;願意挑戰;不輕易放棄', shadow:'過度自信' },
  { id: 27, category:'Thinking & Mindset', title:'尊重包容', desc:'接受不同觀點;尊重價值;理解差異;保持開放', shadow:'過度退讓' },
  { id: 28, category:'Thinking & Mindset', title:'誠信正直', desc:'說到做到;維持原則;誠實行事;重視道德', shadow:'過度僵化' },
  { id: 29, category:'Thinking & Mindset', title:'克敵制勝', desc:'保持競爭優勢;制定策略;壓力下決策;提升競爭力', shadow:'過度競爭' },
  { id: 30, category:'Thinking & Mindset', title:'回顧復盤', desc:'回顧經驗;分析成功失敗;理解原因;調整策略', shadow:'陷入自責' },
  { id: 31, category:'Thinking & Mindset', title:'審慎周全', desc:'評估風險;全面分析;考慮長期影響;避免草率決定', shadow:'過度謹慎' },
  { id: 32, category:'Thinking & Mindset', title:'描繪未來', desc:'想像未來情境;規劃方向;描繪願景;轉為目標', shadow:'過度理想化' },
  { id: 33, category:'Thinking & Mindset', title:'發揮優勢', desc:'辨識強項;適合情境發揮;善用資源;轉化成果', shadow:'忽略弱點' },
  { id: 34, category:'Thinking & Mindset', title:'樂觀正向', desc:'看到正面;保持希望;鼓勵他人;積極心態', shadow:'忽略風險' },
  { id: 35, category:'Thinking & Mindset', title:'獨立思考', desc:'不盲從;形成觀點;分析立場;做出判斷', shadow:'過度固執' },
  { id: 36, category:'Thinking & Mindset', title:'深度專注', desc:'長時間專注;排除干擾;深入思考;完成高品質成果', shadow:'忽略整體' },
  { id: 37, category:'Thinking & Mindset', title:'身心續航', desc:'維持長期動力;照顧身心;壓力下持續前進;保持節奏', shadow:'忽略休息' },
  { id: 38, category:'People & Leadership', title:'社交敏銳', desc:'觀察反應;理解群體角色;調整行為;察覺關係變化', shadow:'過度在意他人' },
  { id: 39, category:'People & Leadership', title:'感同身受', desc:'理解情緒;體會處境;展現同理;提供支持', shadow:'忽略自己' },
  { id: 40, category:'People & Leadership', title:'協調衝突', desc:'處理衝突;促進溝通;建立理解;找到平衡', shadow:'過度調和' },
  { id: 41, category:'People & Leadership', title:'客戶導向', desc:'理解需求;分析問題;提供方案;提升滿意度', shadow:'過度迎合' },
  { id: 42, category:'People & Leadership', title:'推動影響', desc:'影響他人;推動行動;建立共識;促進改變', shadow:'操控他人' },
  { id: 43, category:'People & Leadership', title:'培養他人', desc:'指導成長;分享經驗;培養能力;支持發展', shadow:'過度干涉' },
  { id: 44, category:'People & Leadership', title:'國際合作', desc:'跨文化合作;建立關係;理解全球工作;團隊溝通', shadow:'忽略在地需求' },
  { id: 45, category:'People & Leadership', title:'領導統率', desc:'帶領團隊;建立方向;整合資源;激勵成員', shadow:'過度控制' },
  { id: 46, category:'People & Leadership', title:'建立界線', desc:'表達需求;設定界線;保護時間;拒絕不合理要求', shadow:'過度疏離' },
  { id: 47, category:'People & Leadership', title:'善於識人', desc:'觀察特質;判斷能力;安排角色;理解優勢', shadow:'過度評斷' },
  { id: 48, category:'People & Leadership', title:'深化關係', desc:'建立信任;維持連結;投入情感;長期關係', shadow:'過度依賴' },
  { id: 49, category:'People & Leadership', title:'結識新人', desc:'主動認識;建立關係;擴展網絡;快速融入', shadow:'關係表面' },
  { id: 50, category:'People & Leadership', title:'表達技巧', desc:'清楚表達;使用故事;有效溝通;說服他人', shadow:'忽略傾聽' },
  { id: 51, category:'People & Leadership', title:'談判協商', desc:'辨識需求;提出條件;平衡衝突;促進共識', shadow:'逃避衝突' },
  { id: 52, category:'Skills & Application', title:'美感創作', desc:'設計作品;運用媒材;表達想法;呈現概念', shadow:'過度追求形式' },
  { id: 53, category:'Skills & Application', title:'肢體活動', desc:'運動能力;身體學習;良好協調;體力活動', shadow:'忽略策略' },
  { id: 54, category:'Skills & Application', title:'動手實作', desc:'實際操作;把想法變成果;持續改進;動手學習', shadow:'忽略思考' },
  { id: 55, category:'Skills & Application', title:'科技應用', desc:'使用科技工具;學習新工具;整合科技;提升效率', shadow:'過度依賴科技' },
  { id: 56, category:'Skills & Application', title:'永續思維', desc:'長期發展;考慮環境社會;平衡資源;推動永續', shadow:'過度理想化' },
  { id: 57, category:'Skills & Application', title:'國際移動', desc:'跨文化適應;不同國家工作;理解文化差異;多元合作', shadow:'難建立穩定' },
  { id: 58, category:'Skills & Application', title:'商業思維', desc:'理解市場;評估成本收益;發現商機;制定策略', shadow:'過度逐利' },
  { id: 59, category:'Skills & Application', title:'照顧他人', desc:'理解需求;提供支持;陪伴困難;關懷他人', shadow:'忽略自己' },
  { id: 60, category:'Skills & Application', title:'財務管理', desc:'規劃預算;分析收支;管理資源;長期規劃', shadow:'過度保守' },
];

// ===================================================================
// STATE
// ===================================================================
let strength = new Set();  // card ids rated as 強勢
let weakness = new Set();  // card ids rated as 劣勢
let currentIndex = 0;

// ===================================================================
// URL PARAMS
// Share URL format:  ?strength=1,2,3&weakness=4,5,6
// ===================================================================

function buildShareURL() {
  const params = new URLSearchParams();
  if (strength.size) params.set('strength', [...strength].join(','));
  if (weakness.size) params.set('weakness', [...weakness].join(','));
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function parseURLState() {
  const params = new URLSearchParams(window.location.search);

  const parseIds = key => {
    const raw = params.get(key);
    if (!raw) return new Set();
    return new Set(
      raw.split(',')
         .map(s => parseInt(s.trim(), 10))
         .filter(n => !isNaN(n) && INVENTORY_CARDS.some(c => c.id === n))
    );
  };

  const s = parseIds('strength');
  const w = parseIds('weakness');
  return (s.size > 0 || w.size > 0) ? { strength: s, weakness: w } : null;
}

// ===================================================================
// INIT
// ===================================================================

function initInventory() {
  const fromURL = parseURLState();
  if (fromURL) {
    strength = fromURL.strength;
    weakness = fromURL.weakness;
    switchMode('display');
  } else {
    switchMode('select');
  }
}

// ===================================================================
// MODE SWITCH
// ===================================================================

function switchMode(mode) {
  const selectView  = document.getElementById('inv-select-view');
  const displayView = document.getElementById('inv-display-view');
  const inputView   = document.getElementById('inv-input-view');
  const selectBtn   = document.getElementById('mode-select-btn');
  const displayBtn  = document.getElementById('mode-display-btn');
  const inputBtn    = document.getElementById('mode-input-btn');

  [selectView, displayView, inputView].forEach(v => { if (v) v.style.display = 'none'; });
  [selectBtn, displayBtn, inputBtn].forEach(b => { if (b) b.classList.remove('active'); });

  if (mode === 'select') {
    if (selectView) selectView.style.display = '';
    if (selectBtn)  selectBtn.classList.add('active');
    renderCards();
    renderDots();
    updateStatusBar();
    renderChips();
  } else if (mode === 'input') {
    if (inputView) inputView.style.display = '';
    if (inputBtn)  inputBtn.classList.add('active');
    renderInputSlots();
  } else {
    if (displayView) displayView.style.display = '';
    if (displayBtn)  displayBtn.classList.add('active');
    renderDisplay();
  }
}

// ===================================================================
// HELPERS
// ===================================================================

function getCategoryMeta(category) {
  // Normalize (trim trailing spaces)
  const key = category.trim();
  return CATEGORY_META[key] || { color: '#6B7280', bg: '#F3F4F6', label: key };
}

function renderDescList(desc) {
  return desc.split(';').map(item => item.trim()).filter(Boolean)
    .map(item => `<li>${item}</li>`).join('');
}

// ===================================================================
// SELECTION VIEW – CARDS
// ===================================================================

function renderCards() {
  const track = document.getElementById('inv-cards-track');
  if (!track) return;
  track.innerHTML = '';

  INVENTORY_CARDS.forEach((card, i) => {
    const isStrength = strength.has(card.id);
    const isWeakness = weakness.has(card.id);
    const atMaxStr   = strength.size >= MAX_STRENGTH;
    const atMaxWeak  = weakness.size >= MAX_WEAKNESS;
    const meta       = getCategoryMeta(card.category);

    const statusLabel = isStrength ? '強勢 ✓' : (isWeakness ? '劣勢 ✓' : '');
    const statusClass = isStrength ? 'is-strength' : (isWeakness ? 'is-weakness' : '');

    const slide = document.createElement('div');
    slide.className = 'inv-card-slide';
    slide.id = `inv-slide-${i}`;

    slide.innerHTML = `
      <div class="inv-card-inner ${statusClass}">
        <div class="inv-card-status-ribbon">${statusLabel}</div>
        <div class="inv-card-header">
          <span class="inv-category-badge"
                style="background:${meta.bg};color:${meta.color}">${meta.label}</span>
          <span class="inv-card-id">#${card.id}</span>
        </div>
        <div class="inv-card-title">${card.title}</div>
        <ul class="inv-card-desc">${renderDescList(card.desc)}</ul>
        <div class="inv-card-shadow">
          <span class="inv-shadow-icon">🌑</span>
          <span class="inv-shadow-text">${card.shadow}</span>
        </div>
        <div class="inv-action-buttons">
          <button class="inv-action-btn strength-btn ${isStrength ? 'selected' : ''}"
                  ${atMaxStr && !isStrength ? 'disabled' : ''}
                  onclick="handleStrength(${card.id}, ${i})">
            <span class="inv-action-icon">💪</span>強勢
          </button>
          <button class="inv-action-btn weakness-btn ${isWeakness ? 'selected' : ''}"
                  ${atMaxWeak && !isWeakness ? 'disabled' : ''}
                  onclick="handleWeakness(${card.id}, ${i})">
            <span class="inv-action-icon">🌱</span>劣勢
          </button>
        </div>
      </div>`;
    track.appendChild(slide);
  });

  updateCarouselPosition();
  updateArrows();
}

// ===================================================================
// ACTIONS
// ===================================================================

function handleStrength(id, cardIndex) {
  if (strength.size >= MAX_STRENGTH && !strength.has(id)) {
    showToast(`強勢職能最多只能選 ${MAX_STRENGTH} 個！`);
    return;
  }
  strength.add(id);
  weakness.delete(id);
  afterAction(id, cardIndex);
}

function handleWeakness(id, cardIndex) {
  if (weakness.size >= MAX_WEAKNESS && !weakness.has(id)) {
    showToast(`劣勢職能最多只能選 ${MAX_WEAKNESS} 個！`);
    return;
  }
  weakness.add(id);
  strength.delete(id);
  afterAction(id, cardIndex);
}

function afterAction(id, cardIndex) {
  updateStatusBar();
  renderChips();
  refreshCardUI(cardIndex);
  updateDots();

  const nextUnevaluated = findNextUnevaluated(cardIndex);
  if (nextUnevaluated !== null) {
    setTimeout(() => goToCard(nextUnevaluated), 300);
  }

  const evaluated = strength.size + weakness.size;
  if (evaluated === INVENTORY_CARDS.length) {
    document.getElementById('inv-complete-banner').style.display = '';
  }
}

function findNextUnevaluated(fromIndex) {
  for (let i = fromIndex + 1; i < INVENTORY_CARDS.length; i++) {
    const c = INVENTORY_CARDS[i];
    if (!strength.has(c.id) && !weakness.has(c.id)) return i;
  }
  for (let i = 0; i < fromIndex; i++) {
    const c = INVENTORY_CARDS[i];
    if (!strength.has(c.id) && !weakness.has(c.id)) return i;
  }
  return null;
}

function refreshCardUI(cardIndex) {
  const card     = INVENTORY_CARDS[cardIndex];
  const inner    = document.querySelector(`#inv-slide-${cardIndex} .inv-card-inner`);
  const ribbon   = document.querySelector(`#inv-slide-${cardIndex} .inv-card-status-ribbon`);
  const strBtn   = document.querySelector(`#inv-slide-${cardIndex} .strength-btn`);
  const weakBtn  = document.querySelector(`#inv-slide-${cardIndex} .weakness-btn`);
  if (!inner) return;

  const isStrength = strength.has(card.id);
  const isWeakness = weakness.has(card.id);
  const atMaxStr   = strength.size >= MAX_STRENGTH;
  const atMaxWeak  = weakness.size >= MAX_WEAKNESS;

  inner.classList.toggle('is-strength', isStrength);
  inner.classList.toggle('is-weakness', isWeakness);

  if (ribbon) ribbon.textContent = isStrength ? '強勢 ✓' : (isWeakness ? '劣勢 ✓' : '');

  if (strBtn) {
    strBtn.classList.toggle('selected', isStrength);
    strBtn.disabled = atMaxStr && !isStrength;
  }
  if (weakBtn) {
    weakBtn.classList.toggle('selected', isWeakness);
    weakBtn.disabled = atMaxWeak && !isWeakness;
  }
}

// ===================================================================
// REMOVE FROM CHIP STRIPS
// ===================================================================

function removeStrength(id) {
  strength.delete(id);
  const idx = INVENTORY_CARDS.findIndex(c => c.id === id);
  if (idx !== -1) refreshCardUI(idx);
  // Re-enable disabled buttons
  INVENTORY_CARDS.forEach((_, i) => refreshCardUI(i));
  updateStatusBar();
  renderChips();
  updateDots();
  document.getElementById('inv-complete-banner').style.display = 'none';
}

function removeWeakness(id) {
  weakness.delete(id);
  const idx = INVENTORY_CARDS.findIndex(c => c.id === id);
  if (idx !== -1) refreshCardUI(idx);
  INVENTORY_CARDS.forEach((_, i) => refreshCardUI(i));
  updateStatusBar();
  renderChips();
  updateDots();
  document.getElementById('inv-complete-banner').style.display = 'none';
}

// ===================================================================
// STATUS BAR + CHIPS
// ===================================================================

function updateStatusBar() {
  const evaluated = strength.size + weakness.size;
  const total     = INVENTORY_CARDS.length;
  const remaining = total - evaluated;
  const pct       = (evaluated / total) * 100;

  const strCountEl  = document.getElementById('inv-strength-counter');
  const weakCountEl = document.getElementById('inv-weakness-counter');
  const progressEl  = document.getElementById('inv-progress-fill');
  const labelEl     = document.getElementById('inv-progress-label');
  const remainEl    = document.getElementById('inv-remaining-text');

  if (strCountEl)  strCountEl.innerHTML =
    `<span class="badge-num">${strength.size}</span> / ${MAX_STRENGTH} 強勢`;
  if (weakCountEl) weakCountEl.innerHTML =
    `<span class="badge-num badge-weak">${weakness.size}</span> / ${MAX_WEAKNESS} 劣勢`;
  if (progressEl)  progressEl.style.width = `${pct}%`;
  if (labelEl)     labelEl.textContent = `已評估 ${evaluated} / ${total} 張`;
  if (remainEl) {
    remainEl.textContent = remaining > 0
      ? `還有 ${remaining} 張未評估`
      : '所有卡片已評估完畢 ✓';
  }
}

function renderChips() {
  renderChipSet('inv-strength-chips', 'inv-chips-str-count', strength, 'removeStrength', MAX_STRENGTH);
  renderChipSet('inv-weakness-chips', 'inv-chips-weak-count', weakness, 'removeWeakness', MAX_WEAKNESS);
}

function renderChipSet(containerId, countId, set, removeFn, max) {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;

  if (countEl) countEl.textContent = `${set.size} / ${max}`;

  if (set.size === 0) {
    container.innerHTML = `<span class="inv-chips-empty">尚未選擇</span>`;
    return;
  }

  container.innerHTML = [...set].map(id => {
    const card = INVENTORY_CARDS.find(c => c.id === id);
    if (!card) return '';
    return `
      <div class="inv-chip">
        ${card.title}
        <button class="inv-chip-remove" onclick="${removeFn}(${id})"
                title="移除 ${card.title}">✕</button>
      </div>`;
  }).join('');
}

// ===================================================================
// CAROUSEL
// ===================================================================

function goToCard(i) {
  currentIndex = Math.max(0, Math.min(i, INVENTORY_CARDS.length - 1));
  updateCarouselPosition();
  updateArrows();
  updateDots();
}

function prevCard() { goToCard(currentIndex - 1); }
function nextCard() { goToCard(currentIndex + 1); }

function updateCarouselPosition() {
  const track = document.getElementById('inv-cards-track');
  if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function updateArrows() {
  const prev = document.getElementById('inv-prev-btn');
  const next = document.getElementById('inv-next-btn');
  if (prev) prev.disabled = currentIndex === 0;
  if (next) next.disabled = currentIndex === INVENTORY_CARDS.length - 1;
}

function renderDots() {
  const dotsEl = document.getElementById('inv-carousel-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  INVENTORY_CARDS.forEach((card, i) => {
    const dot = document.createElement('div');
    const stateClass = strength.has(card.id) ? 'is-strength' : (weakness.has(card.id) ? 'is-weakness' : '');
    dot.className = `inv-carousel-dot ${stateClass} ${i === currentIndex ? 'active' : ''}`;
    dot.title = card.title;
    dot.onclick = () => goToCard(i);
    dotsEl.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll('#inv-carousel-dots .inv-carousel-dot').forEach((dot, i) => {
    const card = INVENTORY_CARDS[i];
    dot.className = 'inv-carousel-dot';
    if (strength.has(card.id))      dot.classList.add('is-strength');
    else if (weakness.has(card.id)) dot.classList.add('is-weakness');
    if (i === currentIndex)         dot.classList.add('active');
  });
}

// ===================================================================
// DISPLAY VIEW
// ===================================================================

function renderDisplay() {
  renderDisplayGroup('inv-display-strength-grid', 'inv-display-str-count', strength, 'strength');
  renderDisplayGroup('inv-display-weakness-grid', 'inv-display-weak-count', weakness, 'weakness');
}

function renderDisplayGroup(gridId, countId, set, type) {
  const grid    = document.getElementById(gridId);
  const countEl = document.getElementById(countId);
  if (!grid) return;

  if (countEl) countEl.textContent = `共 ${set.size} 項`;

  const cards = INVENTORY_CARDS.filter(c => set.has(c.id));

  if (cards.length === 0) {
    grid.innerHTML = `
      <div class="inv-display-empty" style="grid-column:1/-1">
        <p>${type === 'strength' ? '尚未選擇強勢職能' : '尚未選擇劣勢職能'}</p>
      </div>`;
    return;
  }

  grid.innerHTML = cards.map(card => {
    const meta = getCategoryMeta(card.category);
    return `
      <div class="inv-display-card">
        <div class="inv-display-card-head">
          <span class="inv-category-badge"
                style="background:${meta.bg};color:${meta.color}">${meta.label}</span>
          <span class="inv-card-id">#${card.id}</span>
        </div>
        <div class="inv-display-card-title">${card.title}</div>
        <ul class="inv-display-card-desc">${renderDescList(card.desc)}</ul>
        <div class="inv-card-shadow" style="margin-top:auto">
          <span class="inv-shadow-icon">🌑</span>
          <span class="inv-shadow-text">${card.shadow}</span>
        </div>
      </div>`;
  }).join('');
}

// ===================================================================
// SHARE
// ===================================================================

function shareResult() {
  if (strength.size === 0 && weakness.size === 0) {
    showToast('請先選擇職能再分享！');
    return;
  }
  const url = buildShareURL();
  navigator.clipboard.writeText(url).then(() => {
    showToast('✅ 連結已複製到剪貼簿！');
  }).catch(() => {
    prompt('複製此連結：', url);
  });
}

// ===================================================================
// RESET
// ===================================================================

function resetAll() {
  if (!confirm('確定要重新開始嗎？目前所有選擇將會清除。')) return;
  strength = new Set();
  weakness = new Set();
  currentIndex = 0;
  history.replaceState({}, '', location.pathname);
  document.getElementById('inv-complete-banner').style.display = 'none';
  switchMode('select');
}

// ===================================================================
// QUICK-INPUT PANEL
// ===================================================================

const INV_INPUT_SLOTS = 7;

function renderInputSlots() {
  renderInputGroup('inv-input-strength-grid', 'strength', INV_INPUT_SLOTS);
  renderInputGroup('inv-input-weakness-grid', 'weakness', INV_INPUT_SLOTS);
  const resultBox = document.getElementById('inv-input-result-box');
  if (resultBox) resultBox.classList.remove('visible');
  document.getElementById('inv-input-error-summary').textContent = '';
}

function renderInputGroup(gridId, type, count) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const slot = document.createElement('div');
    slot.className = 'input-slot';
    slot.innerHTML = `
      <div class="input-slot-label">編號 ${i + 1}</div>
      <input type="number" class="input-slot-field"
             id="inv-input-${type}-${i}"
             min="1" max="60"
             placeholder="–"
             oninput="onInvSlotInput('${type}', ${i})">
      <div class="input-slot-preview" id="inv-input-preview-${type}-${i}"></div>`;
    grid.appendChild(slot);
  }
}

function onInvSlotInput(type, slotIndex) {
  const field   = document.getElementById(`inv-input-${type}-${slotIndex}`);
  const preview = document.getElementById(`inv-input-preview-${type}-${slotIndex}`);
  if (!field || !preview) return;

  const raw = field.value.trim();
  if (raw === '') {
    field.className = 'input-slot-field';
    preview.className = 'input-slot-preview';
    preview.textContent = '';
    return;
  }

  const num = parseInt(raw, 10);
  if (isNaN(num) || num < 1) {
    field.className = 'input-slot-field is-error';
    preview.className = 'input-slot-preview preview-error';
    preview.textContent = '請輸入正整數';
    return;
  }

  const card = INVENTORY_CARDS.find(c => c.id === num);
  if (!card) {
    field.className = 'input-slot-field is-error';
    preview.className = 'input-slot-preview preview-error';
    preview.textContent = `找不到編號 ${num}`;
    return;
  }

  if (checkInvDuplicate(type, slotIndex, num)) {
    field.className = 'input-slot-field is-dup';
    preview.className = 'input-slot-preview preview-dup';
    preview.textContent = '重複的編號';
    return;
  }

  field.className = 'input-slot-field is-valid';
  preview.className = 'input-slot-preview preview-name';
  preview.textContent = card.title;

  revalidateInvGroup(type);
}

function checkInvDuplicate(type, currentSlot, num) {
  // Check within same type
  for (let i = 0; i < INV_INPUT_SLOTS; i++) {
    if (i === currentSlot) continue;
    const f = document.getElementById(`inv-input-${type}-${i}`);
    if (!f || f.value.trim() === '') continue;
    if (parseInt(f.value.trim(), 10) === num) return true;
  }
  // Check across other type (can't be in both strength and weakness)
  const otherType = type === 'strength' ? 'weakness' : 'strength';
  for (let i = 0; i < INV_INPUT_SLOTS; i++) {
    const f = document.getElementById(`inv-input-${otherType}-${i}`);
    if (!f || f.value.trim() === '') continue;
    if (parseInt(f.value.trim(), 10) === num) return true;
  }
  return false;
}

function revalidateInvGroup(type) {
  for (let i = 0; i < INV_INPUT_SLOTS; i++) {
    const field = document.getElementById(`inv-input-${type}-${i}`);
    if (!field || field.value.trim() === '') continue;
    if (field.className.includes('is-valid') || field.className.includes('is-dup')) {
      onInvSlotInput(type, i);
    }
  }
}

function generateInputURL() {
  const strIds  = [];
  const weakIds = [];
  const errors  = [];

  const collectGroup = (type, ids) => {
    for (let i = 0; i < INV_INPUT_SLOTS; i++) {
      const field = document.getElementById(`inv-input-${type}-${i}`);
      if (!field || field.value.trim() === '') continue;
      const num = parseInt(field.value.trim(), 10);
      if (isNaN(num) || num < 1) { errors.push(`${type === 'strength' ? '強勢' : '劣勢'} 第 ${i + 1} 格`); continue; }
      const card = INVENTORY_CARDS.find(c => c.id === num);
      if (!card) { errors.push(`${type === 'strength' ? '強勢' : '劣勢'} 第 ${i + 1} 格（編號 ${num} 不存在）`); continue; }
      if (ids.includes(num)) { errors.push(`${type === 'strength' ? '強勢' : '劣勢'} 第 ${i + 1} 格（編號 ${num} 重複）`); continue; }
      // Cross-type duplicate
      const crossIds = type === 'strength' ? weakIds : strIds;
      if (crossIds.includes(num)) { errors.push(`第 ${i + 1} 格編號 ${num} 同時出現在強勢與劣勢`); continue; }
      ids.push(num);
    }
  };

  collectGroup('strength', strIds);
  collectGroup('weakness', weakIds);

  const summaryEl = document.getElementById('inv-input-error-summary');

  if (errors.length > 0) {
    summaryEl.textContent = `⚠️ 有錯誤：${errors.join('、')}，請修正後再試`;
    return;
  }

  if (strIds.length === 0 && weakIds.length === 0) {
    summaryEl.textContent = '⚠️ 請至少輸入一個職能編號';
    return;
  }

  summaryEl.textContent = '';

  const params = new URLSearchParams();
  if (strIds.length)  params.set('strength', strIds.join(','));
  if (weakIds.length) params.set('weakness', weakIds.join(','));
  const url = `${location.origin}${location.pathname}?${params.toString()}`;

  const resultBox = document.getElementById('inv-input-result-box');
  const urlEl     = document.getElementById('inv-input-result-url');
  const namesEl   = document.getElementById('inv-input-result-names');

  if (urlEl) urlEl.textContent = url;

  if (namesEl) {
    const strCards  = strIds.map(id => INVENTORY_CARDS.find(c => c.id === id)).filter(Boolean);
    const weakCards = weakIds.map(id => INVENTORY_CARDS.find(c => c.id === id)).filter(Boolean);
    let html = '';
    if (strCards.length) {
      html += `<div class="inv-result-group-label">💪 強勢：</div>`;
      html += strCards.map(c =>
        `<span class="occ-tag occ-tag-skill">${c.id} ${c.title}</span>`).join('');
    }
    if (weakCards.length) {
      html += `<div class="inv-result-group-label" style="margin-top:6px">🌱 劣勢：</div>`;
      html += weakCards.map(c =>
        `<span class="occ-tag occ-tag-goal">${c.id} ${c.title}</span>`).join('');
    }
    namesEl.innerHTML = html;
  }

  if (resultBox) resultBox.classList.add('visible');
  window._invGeneratedURL = url;
}

function copyInputURL() {
  const url = window._invGeneratedURL;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => {
    showToast('✅ 連結已複製到剪貼簿！');
  }).catch(() => {
    prompt('複製此連結：', url);
  });
}

function clearInputPanel() {
  renderInputSlots();
}

// ===================================================================
// TOUCH / SWIPE
// ===================================================================

let _invTouchStartX = 0;
let _invTouchStartY = 0;

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('inv-cards-viewport');
  if (!viewport) return;

  viewport.addEventListener('touchstart', e => {
    _invTouchStartX = e.touches[0].clientX;
    _invTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _invTouchStartX;
    const dy = e.changedTouches[0].clientY - _invTouchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextCard(); else prevCard();
    }
  }, { passive: true });
});
