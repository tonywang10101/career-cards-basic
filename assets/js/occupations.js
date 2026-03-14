/* ===================================================================
   occupations.js – Holland Occupations selection tool logic
   =================================================================== */

// ===== CONSTANTS =====
const MAX_LIKE = 15;

// Per-letter colors matching the RIASEC palette
const CODE_COLORS = {
  R: { color: '#F97316', bg: '#FFF7ED' },
  I: { color: '#6366F1', bg: '#EEF2FF' },
  A: { color: '#EC4899', bg: '#FDF2F8' },
  S: { color: '#10B981', bg: '#ECFDF5' },
  E: { color: '#EAB308', bg: '#FEFCE8' },
  C: { color: '#0EA5E9', bg: '#F0F9FF' }
};

// ===== OCCUPATION DATA =====
// Sorted by id. Empty fields/arrays = data pending.
const OCCUPATIONS = [
  { id:  1, name:'幼教老師', field:'', code:'SA', skills:[], goals:[], desc:'' },
  { id:  2, name:'國高中老師', field:'', code:'SA', skills:[], goals:[], desc:'' },
  { id:  3, name:'社工師', field:'', code:'SE', skills:[], goals:[], desc:'' },
  { id:  4, name:'神職人員', field:'', code:'SEA', skills:[], goals:[], desc:'' },
  { id:  5, name:'導遊/導覽員', field:'', code:'SEA', skills:[], goals:[], desc:'' },
  { id:  6, name:'服務生', field:'', code:'SEC', skills:[], goals:[], desc:'' },
  { id:  7, name:'家教/補習班老師', field:'', code:'SEI', skills:[], goals:[], desc:'' },
  { id:  8, name:'教授', field:'', code:'SI', skills:[], goals:[], desc:'' },
  { id:  9, name:'諮商與臨床心理師', field:'', code:'SIA', skills:[], goals:[], desc:'' },
  { id: 10, name:'護理師', field:'', code:'SIC', skills:[], goals:[], desc:'' },
  { id: 11, name:'物理與職能治療師', field:'', code:'SIR', skills:[], goals:[], desc:'' },
  { id: 12, name:'看護', field:'', code:'SRC', skills:[], goals:[], desc:'' },
  { id: 13, name:'運動教練', field:'', code:'SRE', skills:[], goals:[], desc:'' },
  { id: 14, name:'遊戲設計師', field:'', code:'AE', skills:[], goals:[], desc:'' },
  { id: 15, name:'是內設計師', field:'', code:'AE', skills:[], goals:[], desc:'' },
  { id: 16, name:'音樂家', field:'', code:'AE', skills:[], goals:[], desc:'' },
  { id: 17, name:'演員', field:'', code:'AE', skills:[], goals:[], desc:'' },
  { id: 18, name:'藝術總監', field:'', code:'AE', skills:[], goals:[], desc:'' },
  { id: 19, name:'編輯', field:'', code:'AEC', skills:[], goals:[], desc:'' },
  { id: 20, name:'記者/特派員', field:'', code:'AEI', skills:[], goals:[], desc:'' },
  { id: 21, name:'商業與工業設計師', field:'', code:'AER', skills:[], goals:[], desc:'' },
  { id: 22, name:'流行服飾設計師', field:'', code:'AER', skills:[], goals:[], desc:'' },
  { id: 23, name:'廣電主播/主持人', field:'', code:'AES', skills:[], goals:[], desc:'' },
  { id: 24, name:'造型設計師', field:'', code:'AES', skills:[], goals:[], desc:'' },
  { id: 25, name:'詩人/作家', field:'', code:'AI', skills:[], goals:[], desc:'' },
  { id: 26, name:'多媒體設計師', field:'', code:'AI', skills:[], goals:[], desc:'' },
  { id: 27, name:'建築師', field:'', code:'AIR', skills:[], goals:[], desc:'' },
  { id: 28, name:'攝影師', field:'', code:'AR', skills:[], goals:[], desc:'' },
  { id: 29, name:'藝術家', field:'', code:'AR', skills:[], goals:[], desc:'' },
  { id: 30, name:'舞者', field:'', code:'AR', skills:[], goals:[], desc:'' },
  { id: 31, name:'平面設計師', field:'', code:'ARE', skills:[], goals:[], desc:'' },
  { id: 32, name:'景觀/園藝設計師', field:'', code:'ARE', skills:[], goals:[], desc:'' },
  { id: 33, name:'翻譯/口譯', field:'', code:'AS', skills:[], goals:[], desc:'' },
  { id: 34, name:'數位行銷', field:'', code:'EA', skills:[], goals:[], desc:'' },
  { id: 35, name:'廣告文案', field:'', code:'EA', skills:[], goals:[], desc:'' },
  { id: 36, name:'導演', field:'', code:'EA', skills:[], goals:[], desc:'' },
  { id: 37, name:'公關', field:'', code:'EAS', skills:[], goals:[], desc:'' },
  { id: 38, name:'不動產經紀人', field:'', code:'EC', skills:[], goals:[], desc:'' },
  { id: 39, name:'業務人員', field:'', code:'EC', skills:[], goals:[], desc:'' },
  { id: 40, name:'門市/專櫃人員', field:'', code:'EC', skills:[], goals:[], desc:'' },
  { id: 41, name:'軍官', field:'', code:'ECR', skills:[], goals:[], desc:'' },
  { id: 42, name:'咖啡師', field:'', code:'ECR', skills:[], goals:[], desc:'' },
  { id: 43, name:'保險經紀人', field:'', code:'ECS', skills:[], goals:[], desc:'' },
  { id: 44, name:'總經理', field:'', code:'ECS', skills:[], goals:[], desc:'' },
  { id: 45, name:'專案管理師', field:'', code:'ECS', skills:[], goals:[], desc:'' },
  { id: 46, name:'人力資源專員', field:'', code:'ECS', skills:[], goals:[], desc:'' },
  { id: 47, name:'律師', field:'', code:'EI', skills:[], goals:[], desc:'' },
  { id: 48, name:'網站行銷策劃', field:'', code:'EIC', skills:[], goals:[], desc:'' },
  { id: 49, name:'企業顧問', field:'', code:'EIC', skills:[], goals:[], desc:'' },
  { id: 50, name:'船長/領航員', field:'', code:'ERC', skills:[], goals:[], desc:'' },
  { id: 51, name:'法官', field:'', code:'ES', skills:[], goals:[], desc:'' },
  { id: 52, name:'議員/立法委員', field:'', code:'ES', skills:[], goals:[], desc:'' },
  { id: 53, name:'禮儀師', field:'', code:'ESC', skills:[], goals:[], desc:'' },
  { id: 54, name:'空服員', field:'', code:'ESC', skills:[], goals:[], desc:'' },
  { id: 55, name:'客服人員', field:'', code:'ESC', skills:[], goals:[], desc:'' },
  { id: 56, name:'按摩/美容師', field:'', code:'ESR', skills:[], goals:[], desc:'' },
  { id: 57, name:'會計師', field:'', code:'CE', skills:[], goals:[], desc:'' },
  { id: 58, name:'採購', field:'', code:'CE', skills:[], goals:[], desc:'' },
  { id: 59, name:'行政人員', field:'', code:'CER', skills:[], goals:[], desc:'' },
  { id: 60, name:'公務員', field:'', code:'CES', skills:[], goals:[], desc:'' },
  { id: 61, name:'資料與檔案管理員', field:'', code:'CI', skills:[], goals:[], desc:'' },
  { id: 62, name:'精算師', field:'', code:'CIE', skills:[], goals:[], desc:'' },
  { id: 63, name:'金融投資分析師', field:'', code:'CIE', skills:[], goals:[], desc:'' },
  { id: 64, name:'資訊安全人員', field:'', code:'CIR', skills:[], goals:[], desc:'' },
  { id: 65, name:'網站開發人員', field:'', code:'CIR', skills:[], goals:[], desc:'' },
  { id: 66, name:'人類學家', field:'社會與心理學群', code:'IA', skills:["社會人類", "教育訓練", "語文文學"], goals:["搜尋資訊", "處理資料", "分析資訊"], desc:'研究人類的行為、社會變遷、組織架構、語言和文化等等。' },
  { id: 67, name:'程式設計師', field:'資訊學群', code:'IC', skills:["資訊電子", "數學", "管理"], goals:["運用電腦工作", "持續進修專業知識", "分析資訊"], desc:'分析、編寫、修改、測試程式碼，開發電腦應用程式。' },
  { id: 68, name:'數據分析師', field:'數理化/資訊', code:'ICE', skills:["數學", "資訊電子", "工程科技"], goals:["分析資訊", "創新設計", "提供諮詢"], desc:'收集並分析大量數據，依此歸納與預測未來趨勢、評估與訂定決策。' },
  { id: 69, name:'藥師', field:'醫藥衛生學群', code:'ICS', skills:["醫學", "化學", "顧客服務"], goals:["持續進修專業知識", "找出關鍵資訊和線索", "檢查是否符合規範"], desc:'根據醫師的處方簽進行檢核，並提供所需之藥物。' },
  { id: 70, name:'市場調查人員', field:'財經/管理/社會與心理學群', code:'IEC', skills:["銷售行銷", "顧客服務", "數學"], goals:["安排工作和活動時程", "建立夥伴關係", "分析資訊"], desc:'調查並研究市場現況與外來趨勢，提供行銷決策時所必需的資料。' },
  { id: 71, name:'商業智慧分析師', field:'資訊/數理化/管理學群', code:'IEC', skills:["銷售行銷", "管理", "數學"], goals:["持續進修專業知識", "分析資訊", "組織內部溝通"], desc:'透過資料分析工具，研究過去企業資料，整理成報表輔佐決策。' },
  { id: 72, name:'大氣科學家', field:'地球與環境/生命科學學群', code:'IR', skills:["數學", "地球環境", "資訊電子"], goals:["持續進修專業知識", "處理資料", "分析資訊"], desc:'研究氣象並解釋衛星、雷達和氣象預報等資料' },
  { id: 73, name:'電機工程師', field:'工程/數理化學群', code:'IR', skills:["工程科技", "設計", "資訊電子"], goals:["持續進修專業知識", "出解決問題的方案", "創新設計"], desc:'開發、監測電機設備或電機系統的製造和安裝。' },
  { id: 74, name:'航太工程師', field:'工程/數理化學群', code:'IR', skills:["工程科技", "設計", "機械"], goals:["持續進修專業知識", "製作圖稿與規格書並解說", "創新設計"], desc:'進行專案，設計、開發和測試飛機飛彈和太空等設備。' },
  { id: 75, name:'人因工程師', field:'工程/社會與心理學', code:'IR', skills:["心理學", "工程科技", "數學"], goals:["創新設計", "持續進修專業知識", "處理資料"], desc:'根據人類行為，設計設備工具或工作環境，讓人與系統互動發揮更大效益。' },
  { id: 76, name:'生命科學家', field:'生命科學/生物資源學群', code:'IR', skills:["生命科學", "數學", "化學"], goals:["持續進修觀葉知識", "處理資料", "分析資訊"], desc:'研究各種生命的知識，包含起源、發展、結構和功能等。' },
  { id: 77, name:'生化工程師', field:'數理化/工程/生命科學學程', code:'IR', skills:["生命科學", "工程設計", "化學"], goals:["找出關鍵資訊和線索", "持續進修專業知識", "處理資料"], desc:'以生命科學與化學知識、技術開發產品，解決人、動植物、微生物相關問題。' },
  { id: 78, name:'化工工程師', field:'數理化/工程/生命科學學群', code:'IR', skills:["工程科技", "化學", "數學"], goals:["持續進修觀葉知識", "提出解決問題的方案", "處理資料"], desc:'設計化工長得製造流程及開發化工產品，如化妝品、塑膠、水泥等。' },
  { id: 79, name:'環工工程師', field:'地球與環境/工程學群', code:'IRC', skills:["工程科技", "數學", "設計"], goals:["持續進修專業知識", "主理資料", "提出解決問題的方案"], desc:'設計、規劃或執行與環境衛生相關的工程，如廢棄物處理等。' },
  { id: 80, name:'機電工程師', field:'工程/數理化學群', code:'IRC', skills:["工程科技", "設計", "資訊電子"], goals:["製作圖稿與規格書並解說", "持進修專業知識", "創新設計"], desc:'運用機械、電機與電腦工程原理，設計自動化或智慧型的系統與產品。' },
  { id: 81, name:'機械工程師', field:'工程/數理化學群', code:'IRC', skills:["設計", "工程科技", "數學"], goals:["持續進修專業知識", "創新設計", "處理資料"], desc:'規劃和設計工具、引擎、機器等裝備，也會負責安裝、操作、維修等工作。' },
  { id: 82, name:'光電工程師', field:'數理化/工程學群', code:'IRC', skills:["工程科技", "物理", "數學"], goals:["處理資料", "創新設計", "分析資訊"], desc:'運用工程與數學原理，研發光能利用的技術。' },
  { id: 83, name:'電腦硬體工程師', field:'資訊/工程學群', code:'IRC', skills:["資訊電子", "工程科技", "數學"], goals:["創新設計", "持續進修專業知識", "資料處理"], desc:'研究、設計、開發與測試電腦硬體設備，或是監測製造與安裝過程。' },
  { id: 84, name:'網管人員', field:'資訊學群', code:'IRC', skills:["資訊電子", "通訊電信", "行政"], goals:["運用電腦工作", "找出關鍵資訊和線索", "持續進修觀葉知識"], desc:'負責維繫企業的網路環境，進行維護與檢測，確保網路環境順暢運作。' },
  { id: 85, name:'水土保育人員', field:'', code:'IRE', skills:[], goals:[], desc:'' },
  { id: 86, name:'材料工程師', field:'', code:'IRE', skills:[], goals:[], desc:'' },
  { id: 87, name:'牙醫師', field:'', code:'IRS', skills:[], goals:[], desc:'' },
  { id: 88, name:'營養師', field:'', code:'IS', skills:[], goals:[], desc:'' },
  { id: 89, name:'醫師', field:'', code:'ISR', skills:[], goals:[], desc:'' },
  { id: 90, name:'獸醫', field:'醫藥衛生/生物資源學群', code:'ISR', skills:["醫學", "顧客服務", "生命科學"], goals:["找出關鍵資訊和線索", "提出解決問題的方案", "協助和照顧他人"], desc:'針對有疾病或障礙的動物進行診斷與治療。也可能從事研發、諮詢、銷售等等。' },
  { id: 91, name:'保全', field:'', code:'RCE', skills:[], goals:[], desc:'' },
  { id: 92, name:'產品維修人員', field:'', code:'RCI', skills:[], goals:[], desc:'' },
  { id: 93, name:'機長', field:'', code:'RCI', skills:[], goals:[], desc:'' },
  { id: 94, name:'運動員', field:'', code:'RE', skills:[], goals:[], desc:'' },
  { id: 95, name:'廚師', field:'', code:'REA', skills:[], goals:[], desc:'' },
  { id: 96, name:'警察', field:'', code:'REC', skills:[], goals:[], desc:'' },
  { id: 97, name:'動物飼養員', field:'', code:'RI', skills:[], goals:[], desc:'' },
  { id: 98, name:'地理與航照測繪員', field:'', code:'RIC', skills:[], goals:[], desc:'' },
  { id: 99, name:'土木工程師', field:'', code:'RIC', skills:[], goals:[], desc:'' },
  { id:100, name:'農業與食品技術員', field:'', code:'RIC', skills:[], goals:[], desc:'' },  
];

// ===================================================================
// STATE
// ===================================================================
let liked    = new Set();   // occupation ids that are liked
let disliked = new Set();   // occupation ids that are disliked
let currentIndex = 0;

// ===================================================================
// URL PARAMS  (human-readable)
// Share URL format:  ?like=66,67,68
// ===================================================================

function buildShareURL() {
  const likedIds = [...liked].join(',');
  const params   = new URLSearchParams();
  if (likedIds) params.set('like', likedIds);
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function parseURLLiked() {
  const params = new URLSearchParams(window.location.search);
  const raw    = params.get('like');
  if (!raw) return null;

  const ids = new Set(
    raw.split(',')
       .map(s => parseInt(s.trim(), 10))
       .filter(n => !isNaN(n) && OCCUPATIONS.some(o => o.id === n))
  );
  return ids.size > 0 ? ids : null;
}

// ===================================================================
// INIT
// ===================================================================

function initOccupations() {
  const fromURL = parseURLLiked();
  if (fromURL) {
    liked = fromURL;
    switchMode('display');
  } else {
    switchMode('select');
  }
}

// ===================================================================
// MODE SWITCH
// ===================================================================

function switchMode(mode) {
  const selectView  = document.getElementById('select-view');
  const displayView = document.getElementById('display-view');
  const selectBtn   = document.getElementById('mode-select-btn');
  const displayBtn  = document.getElementById('mode-display-btn');

  if (mode === 'select') {
    selectView.style.display  = '';
    displayView.style.display = 'none';
    selectBtn.classList.add('active');
    displayBtn.classList.remove('active');
    renderCards();
    renderDots();
    updateStatusBar();
    renderChips();
  } else {
    selectView.style.display  = 'none';
    displayView.style.display = '';
    selectBtn.classList.remove('active');
    displayBtn.classList.add('active');
    renderDisplay();
  }
}

// ===================================================================
// SELECTION VIEW
// ===================================================================

function renderCards() {
  const track = document.getElementById('cardsTrack');
  track.innerHTML = '';

  OCCUPATIONS.forEach((occ, i) => {
    const isLiked    = liked.has(occ.id);
    const isDisliked = disliked.has(occ.id);
    const atMax      = liked.size >= MAX_LIKE;

    const slide = document.createElement('div');
    slide.className = 'occ-card-slide';
    slide.id = `occ-slide-${i}`;

    const statusLabel = isLiked ? '喜歡 ✓' : (isDisliked ? '不喜歡' : '');
    const statusClass = isLiked ? 'is-liked' : (isDisliked ? 'is-disliked' : '');

    slide.innerHTML = `
      <div class="occ-card-inner ${statusClass}">
        <div class="card-status-ribbon">${statusLabel}</div>
        <div class="occ-card-header">
          <div class="occ-code-badges">${renderCodeBadges(occ.code)}</div>
          <div class="occ-card-titles">
            <div class="occ-card-name">${occ.name}</div>
            <div class="occ-card-field">${occ.field}</div>
          </div>
        </div>
        <div class="occ-card-desc">${occ.desc}</div>
        <div class="occ-card-section">
          <div class="occ-section-label">知識技能</div>
          <div class="occ-tags">
            ${occ.skills.map(s => `<span class="occ-tag occ-tag-skill">${s}</span>`).join('')}
          </div>
        </div>
        <div class="occ-card-section">
          <div class="occ-section-label">職業目標</div>
          <div class="occ-tags">
            ${occ.goals.map(g => `<span class="occ-tag occ-tag-goal">${g}</span>`).join('')}
          </div>
        </div>
        <div class="action-buttons">
          <button class="action-btn like-btn ${isLiked ? 'selected' : ''}"
                  ${atMax && !isLiked ? 'disabled' : ''}
                  onclick="handleLike(${occ.id}, ${i})">
            <span class="action-icon">😊</span>喜歡
          </button>
          <button class="action-btn dislike-btn ${isDisliked ? 'selected' : ''}"
                  onclick="handleDislike(${occ.id}, ${i})">
            <span class="action-icon">😶</span>不喜歡
          </button>
        </div>
      </div>`;
    track.appendChild(slide);
  });

  updateCarouselPosition();
  updateArrows();
}

function renderCodeBadges(code) {
  return [...code].map(letter => {
    const c = CODE_COLORS[letter] || { color: '#6B7280', bg: '#F3F4F6' };
    return `<span class="occ-code-letter"
                  style="background:${c.bg}; color:${c.color}">${letter}</span>`;
  }).join('');
}

// ===================================================================
// ACTIONS
// ===================================================================

function handleLike(id, cardIndex) {
  if (liked.size >= MAX_LIKE && !liked.has(id)) {
    showToast(`最多只能選 ${MAX_LIKE} 個喜歡的職業！`);
    return;
  }
  liked.add(id);
  disliked.delete(id);
  afterAction(id, cardIndex);
}

function handleDislike(id, cardIndex) {
  disliked.add(id);
  liked.delete(id);
  afterAction(id, cardIndex);
}

function afterAction(id, cardIndex) {
  updateStatusBar();
  renderChips();
  refreshCardUI(cardIndex);
  updateDots();

  // Auto-advance to next unevaluated card (or just next if all done)
  const nextUnevaluated = findNextUnevaluated(cardIndex);
  if (nextUnevaluated !== null) {
    setTimeout(() => goToCard(nextUnevaluated), 300);
  }

  // Show complete banner when every card has been evaluated
  const evaluated = liked.size + disliked.size;
  if (evaluated === OCCUPATIONS.length) {
    document.getElementById('occ-complete-banner').style.display = '';
  }
}

function findNextUnevaluated(fromIndex) {
  // Search forward first, then wrap
  for (let i = fromIndex + 1; i < OCCUPATIONS.length; i++) {
    const occ = OCCUPATIONS[i];
    if (!liked.has(occ.id) && !disliked.has(occ.id)) return i;
  }
  for (let i = 0; i < fromIndex; i++) {
    const occ = OCCUPATIONS[i];
    if (!liked.has(occ.id) && !disliked.has(occ.id)) return i;
  }
  return null; // all evaluated
}

function refreshCardUI(cardIndex) {
  const occ      = OCCUPATIONS[cardIndex];
  const inner    = document.querySelector(`#occ-slide-${cardIndex} .occ-card-inner`);
  const ribbon   = document.querySelector(`#occ-slide-${cardIndex} .card-status-ribbon`);
  const likeBtn  = document.querySelector(`#occ-slide-${cardIndex} .like-btn`);
  const dislikeBtn = document.querySelector(`#occ-slide-${cardIndex} .dislike-btn`);
  if (!inner) return;

  const isLiked    = liked.has(occ.id);
  const isDisliked = disliked.has(occ.id);
  const atMax      = liked.size >= MAX_LIKE;

  inner.classList.toggle('is-liked',    isLiked);
  inner.classList.toggle('is-disliked', isDisliked);

  if (ribbon) ribbon.textContent = isLiked ? '喜歡 ✓' : (isDisliked ? '不喜歡' : '');

  if (likeBtn) {
    likeBtn.classList.toggle('selected', isLiked);
    likeBtn.disabled = atMax && !isLiked;
  }
  if (dislikeBtn) {
    dislikeBtn.classList.toggle('selected', isDisliked);
  }
}

// ===================================================================
// REMOVE LIKE (from chip)
// ===================================================================

function removeLike(id) {
  liked.delete(id);
  // Reset to unevaluated (not disliked)
  disliked.delete(id);

  const cardIndex = OCCUPATIONS.findIndex(o => o.id === id);
  if (cardIndex !== -1) refreshCardUI(cardIndex);

  updateStatusBar();
  renderChips();
  updateDots();

  // Re-enable like buttons on all cards that were disabled at MAX
  OCCUPATIONS.forEach((_, i) => refreshCardUI(i));

  // Hide complete banner since something was un-evaluated
  document.getElementById('occ-complete-banner').style.display = 'none';
}

// ===================================================================
// STATUS BAR + CHIPS
// ===================================================================

function updateStatusBar() {
  const evaluated = liked.size + disliked.size;
  const total     = OCCUPATIONS.length;
  const remaining = total - evaluated;
  const pct       = (evaluated / total) * 100;

  const counterEl   = document.getElementById('liked-counter');
  const progressEl  = document.getElementById('occ-progress-fill');
  const labelEl     = document.getElementById('occ-progress-label');
  const remainingEl = document.getElementById('occ-remaining-text');

  if (counterEl)  counterEl.innerHTML =
    `<span class="badge-num">${liked.size}</span> / ${MAX_LIKE} 已選喜歡`;
  if (progressEl) progressEl.style.width = `${pct}%`;
  if (labelEl)    labelEl.textContent = `已評估 ${evaluated} / ${total} 張`;
  if (remainingEl) {
    remainingEl.textContent = remaining > 0
      ? `還有 ${remaining} 張未評估`
      : '所有卡片已評估完畢 ✓';
  }
}

function renderChips() {
  const container = document.getElementById('liked-chips');
  const countEl   = document.getElementById('chips-count');
  if (!container) return;

  if (countEl) countEl.textContent = `${liked.size} / ${MAX_LIKE}`;

  if (liked.size === 0) {
    container.innerHTML = `<span class="liked-chips-empty">尚未選擇喜歡的職業</span>`;
    return;
  }

  container.innerHTML = [...liked].map(id => {
    const occ = OCCUPATIONS.find(o => o.id === id);
    if (!occ) return '';
    return `
      <div class="liked-chip">
        ${occ.name}
        <button class="liked-chip-remove" onclick="removeLike(${id})"
                title="移除 ${occ.name}">✕</button>
      </div>`;
  }).join('');
}

// ===================================================================
// CAROUSEL
// ===================================================================

function goToCard(i) {
  currentIndex = Math.max(0, Math.min(i, OCCUPATIONS.length - 1));
  updateCarouselPosition();
  updateArrows();
  updateDots();
}

function prevCard() { goToCard(currentIndex - 1); }
function nextCard() { goToCard(currentIndex + 1); }

function updateCarouselPosition() {
  const track = document.getElementById('cardsTrack');
  if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function updateArrows() {
  const prev = document.getElementById('prev-btn');
  const next = document.getElementById('next-btn');
  if (prev) prev.disabled = currentIndex === 0;
  if (next) next.disabled = currentIndex === OCCUPATIONS.length - 1;
}

function renderDots() {
  const dotsEl = document.getElementById('carousel-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  OCCUPATIONS.forEach((occ, i) => {
    const dot = document.createElement('div');
    const stateClass = liked.has(occ.id) ? 'liked' : (disliked.has(occ.id) ? 'disliked' : '');
    dot.className = `carousel-dot ${stateClass} ${i === currentIndex ? 'active' : ''}`;
    dot.title = occ.name;
    dot.onclick = () => goToCard(i);
    dotsEl.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll('#carousel-dots .carousel-dot').forEach((dot, i) => {
    const occ = OCCUPATIONS[i];
    dot.className = 'carousel-dot';
    if (liked.has(occ.id))    dot.classList.add('liked');
    else if (disliked.has(occ.id)) dot.classList.add('disliked');
    if (i === currentIndex)   dot.classList.add('active');
  });
}

// ===================================================================
// DISPLAY VIEW
// ===================================================================

function renderDisplay() {
  const grid    = document.getElementById('display-grid');
  const countEl = document.getElementById('display-liked-count');
  if (!grid) return;

  if (countEl) countEl.textContent = `共 ${liked.size} 個職業`;

  const likedOccs = OCCUPATIONS.filter(o => liked.has(o.id));

  if (likedOccs.length === 0) {
    grid.innerHTML = `
      <div class="display-empty-state" style="grid-column:1/-1">
        <div class="empty-icon">💼</div>
        <p>尚未選擇任何喜歡的職業</p>
      </div>`;
    return;
  }

  grid.innerHTML = likedOccs.map(occ => `
    <div class="display-occ-card">
      <div class="display-card-header">
        <div class="occ-code-badges" style="margin-right:10px">
          ${renderCodeBadges(occ.code)}
        </div>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--gray-800)">${occ.name}</div>
          <div style="font-size:11px;color:var(--gray-400);margin-top:2px">${occ.field}</div>
        </div>
      </div>
      <div class="display-card-body">
        <div class="display-card-desc">${occ.desc}</div>
        <div class="occ-tags" style="margin-bottom:6px">
          ${occ.skills.map(s => `<span class="occ-tag occ-tag-skill">${s}</span>`).join('')}
        </div>
        <div class="occ-tags">
          ${occ.goals.map(g => `<span class="occ-tag occ-tag-goal">${g}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

// ===================================================================
// SHARE
// ===================================================================

function shareResult() {
  if (liked.size === 0) {
    showToast('請先選擇喜歡的職業再分享！');
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
  liked    = new Set();
  disliked = new Set();
  currentIndex = 0;
  history.replaceState({}, '', location.pathname);
  document.getElementById('occ-complete-banner').style.display = 'none';
  switchMode('select');
}

// ===================================================================
// TOUCH / SWIPE
// ===================================================================

let _touchStartX = 0;
let _touchStartY = 0;

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('cardsViewport');
  if (!viewport) return;

  viewport.addEventListener('touchstart', e => {
    _touchStartX = e.touches[0].clientX;
    _touchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _touchStartX;
    const dy = e.changedTouches[0].clientY - _touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextCard(); else prevCard();
    }
  }, { passive: true });
});
