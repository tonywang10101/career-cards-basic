/* ===================================================================
   holland.js – RIASEC (Holland Code) sorting tool logic
   =================================================================== */

// ===== CARD DATA =====
const CARDS = [
  {
    code: 'R',
    english: 'Realistic',
    chinese: '實踐者',
    description: '實踐者注重實際行動，常獨自完成任務，喜歡機械或可操作的工具，喜歡戶外活動、肢體運動和各種冒險探索。面對問題時，比起討論或空想，更喜歡直接嘗試。在生涯選擇上，喜歡能產生具體作品或成果的工作。',
    strengths: ['機械與設備操作', '對工具運用、設備操作有天賦', '廚藝手工', '畜養動物'],
    careers: ['機械電子', '農林漁牧', '運動', '建築工藝領域']
  },
  {
    code: 'I',
    english: 'Investigative',
    chinese: '思考者',
    description: '思考者好奇心強，喜歡分析、思考與解決複雜問題。擅長觀察、構想、搜尋真理並提出各種假設。常接觸人文科學或科技領域的資訊，在資料分析與理論建構方面，是不可多得的人才。在生涯選擇上，喜歡需要思考與研究的專業工作。',
    strengths: ['理解、解決科學或數學問題', '研究分析與解釋資料', '構想與理論', '抽象思考'],
    careers: ['理工生醫', '人文科學領域']
  },
  {
    code: 'A',
    english: 'Artistic',
    chinese: '創造者',
    description: '創造者充滿創意與想像力，總是有很多新穎的想法，喜歡設計、戲劇、文學、舞蹈、音樂等活動，具有強大的直覺與靈感，對美的追求更勝於科學。在生涯選擇上，喜歡待在充滿變化與挑戰的環境，讓自己的獨特性能充分發揮。',
    strengths: ['運用想像力與創造力產生靈感', '做事創新、彈性而靈活', '喜於設計與創造', '具有文藝天賦'],
    careers: ['藝術', '設計等領域']
  },
  {
    code: 'S',
    english: 'Social',
    chinese: '助人者',
    description: '助人者個性友善且極具包容力，喜歡和人互動與幫助他人，關懷社會、生命或周遭的人群，經常教導、協助、照顧別人，解決他人的困難，懂得傾聽和溝通，擅長解決人際衝突。在生涯選擇上，適合與人互動、協助他人和教導培訓等工作。',
    strengths: ['協調人際活動', '發現與解決他人問題', '優秀的人際與情緒管理能力'],
    careers: ['教育', '社工心理', '醫護', '宗教等領域']
  },
  {
    code: 'E',
    english: 'Enterprising',
    chinese: '影響者',
    description: '影響者自信果敢且充滿精力，勇於競爭與冒險，喜歡商業活動與決策。善用自己的資源和能力影響或說服別人，讓別人買回自己提出的想法或執行方式。適合當企業家，或在團隊中擔任並發起計劃的角色。在生涯選擇上，會追求經營地位較高的工作。',
    strengths: ['能找出商業或獲利機會', '適合管理與監督工作', '具有銷售與說服技巧的潛力'],
    careers: ['企業領導', '行銷企劃', '法律政治等領域']
  },
  {
    code: 'C',
    english: 'Conventional',
    chinese: '組織者',
    description: '組織者喜歡有系統、組織化效率的 SOP 工作方式，無法接受混亂、沒有秩序的環境，在乎事情的精確細節並一絲不苟。在生涯選擇上，偏好規則清楚且明確的環境，善於透過行政處理讓事情順利運轉。',
    strengths: ['善於數字運算', '資訊處理', '組織、規劃與統整', '文書、行政方面具精確的處理技巧'],
    careers: ['財務金融', '特助秘書', '會計', '行政等領域']
  }
];

const CODE_COLORS = {
  R: { color: '#F97316', bg: '#FFF7ED' },
  I: { color: '#6366F1', bg: '#EEF2FF' },
  A: { color: '#EC4899', bg: '#FDF2F8' },
  S: { color: '#10B981', bg: '#ECFDF5' },
  E: { color: '#EAB308', bg: '#FEFCE8' },
  C: { color: '#0EA5E9', bg: '#F0F9FF' }
};

const GROUPS        = ['相似', '普通', '不像'];
const GROUP_COLORS  = { '相似': '#10B981', '普通': '#F59E0B', '不像': '#EF4444' };

// URL param keys – human-readable
const PARAM_KEY = { '相似': 'like', '普通': 'normal', '不像': 'unlike' };
const PARAM_VAL = { like: '相似', normal: '普通', unlike: '不像' };

// ===== STATE =====
let ratings      = {};   // { code: '相似' | '普通' | '不像' }
let currentIndex = 0;

// ===================================================================
// URL ENCODING  (human-readable query string)
// e.g. ?like=R,I&normal=S,E&unlike=C
// ===================================================================

function buildShareURL() {
  const groups = { like: [], normal: [], unlike: [] };
  for (const [code, label] of Object.entries(ratings)) {
    groups[PARAM_KEY[label]].push(code);
  }
  const params = new URLSearchParams();
  if (groups.like.length)   params.set('like',   groups.like.join(','));
  if (groups.normal.length) params.set('normal', groups.normal.join(','));
  if (groups.unlike.length) params.set('unlike', groups.unlike.join(','));
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function parseURLRatings() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [paramKey, label] of Object.entries(PARAM_VAL)) {
    const val = params.get(paramKey);
    if (val) {
      val.split(',').forEach(code => {
        const c = code.trim().toUpperCase();
        if (c && CARDS.some(card => card.code === c)) result[c] = label;
      });
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

// ===================================================================
// INIT
// ===================================================================

function initHolland() {
  const fromURL = parseURLRatings();
  if (fromURL) {
    ratings = fromURL;
    switchMode('display');
  } else {
    switchMode('sort');
  }
}

// ===================================================================
// MODE
// ===================================================================

function switchMode(mode) {
  const sortView    = document.getElementById('sort-view');
  const displayView = document.getElementById('display-view');
  const sortBtn     = document.getElementById('mode-sort-btn');
  const displayBtn  = document.getElementById('mode-display-btn');

  if (mode === 'sort') {
    sortView.style.display    = '';
    displayView.style.display = 'none';
    sortBtn.classList.add('active');
    displayBtn.classList.remove('active');
    renderCards();
    renderDots();
    updateProgress();
  } else {
    sortView.style.display    = 'none';
    displayView.style.display = '';
    sortBtn.classList.remove('active');
    displayBtn.classList.add('active');
    renderDisplay();
  }
}

// ===================================================================
// SORT VIEW – CARDS
// ===================================================================

function renderCards() {
  const track = document.getElementById('cardsTrack');
  track.innerHTML = '';

  CARDS.forEach((card, i) => {
    const c = CODE_COLORS[card.code];
    const sel = ratings[card.code];

    const el = document.createElement('div');
    el.className = 'riasec-card';
    el.id = `card-${i}`;
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-header">
          <div class="card-code-badge"
               style="background:${c.bg}; color:${c.color}">${card.code}</div>
          <div class="card-titles">
            <div class="card-en">${card.english}</div>
            <div class="card-zh">${card.chinese}</div>
          </div>
        </div>
        <div class="card-desc">${card.description}</div>
        <div class="card-strengths">
          <div class="card-strengths-label">優勢特質</div>
          <ul>${card.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="card-careers">
          ${card.careers.map(c2 => `<span class="career-tag">${c2}</span>`).join('')}
        </div>
        <div class="rating-row">
          <button class="rating-btn similar ${sel === '相似' ? 'selected' : ''}"
                  onclick="rate('${card.code}', '相似', ${i})">
            <span class="btn-icon">😊</span>相似
          </button>
          <button class="rating-btn neutral ${sel === '普通' ? 'selected' : ''}"
                  onclick="rate('${card.code}', '普通', ${i})">
            <span class="btn-icon">😐</span>普通
          </button>
          <button class="rating-btn different ${sel === '不像' ? 'selected' : ''}"
                  onclick="rate('${card.code}', '不像', ${i})">
            <span class="btn-icon">😶</span>不像
          </button>
        </div>
      </div>`;
    track.appendChild(el);
  });

  updateCarouselPosition();
  updateArrows();
}

function renderDots() {
  const dotsEl = document.getElementById('carousel-dots');
  dotsEl.innerHTML = '';
  CARDS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
    dot.onclick = () => goToCard(i);
    dotsEl.appendChild(dot);
  });
}

// ===================================================================
// CAROUSEL
// ===================================================================

function goToCard(i) {
  currentIndex = Math.max(0, Math.min(i, CARDS.length - 1));
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
  if (next) next.disabled = currentIndex === CARDS.length - 1;
}

function updateDots() {
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });
}

// ===================================================================
// RATING
// ===================================================================

function rate(code, group, cardIndex) {
  ratings[code] = group;
  updateProgress();

  // Refresh button states on this card
  const row = document.querySelector(`#card-${cardIndex} .rating-row`);
  if (row) {
    row.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
    const map = { '相似': 'similar', '普通': 'neutral', '不像': 'different' };
    const sel = row.querySelector('.' + map[group]);
    if (sel) sel.classList.add('selected');
  }

  // Auto-advance
  if (Object.keys(ratings).length < CARDS.length && cardIndex < CARDS.length - 1) {
    setTimeout(() => goToCard(cardIndex + 1), 300);
  }

  // Show completion banner
  if (Object.keys(ratings).length === CARDS.length) {
    document.getElementById('sort-complete-banner').style.display = '';
  }
}

function updateProgress() {
  const count = Object.keys(ratings).length;
  const pct   = (count / CARDS.length) * 100;
  const txt   = document.getElementById('progress-text');
  const fill  = document.getElementById('progress-fill');
  if (txt)  txt.textContent  = `${count} / ${CARDS.length} 張已評分`;
  if (fill) fill.style.width = `${pct}%`;
}

// ===================================================================
// DISPLAY VIEW
// ===================================================================

function renderDisplay() {
  const container = document.getElementById('display-groups');
  if (!container) return;
  container.innerHTML = '';

  GROUPS.forEach(group => {
    const groupCards = CARDS.filter(c => ratings[c.code] === group);
    const color = GROUP_COLORS[group];

    const section = document.createElement('div');
    section.className = 'display-group';

    let cardsHTML = '';
    if (groupCards.length === 0) {
      cardsHTML = `<div class="display-empty">尚未分類任何卡片</div>`;
    } else {
      cardsHTML = groupCards.map(card => {
        const c = CODE_COLORS[card.code];
        return `
          <div class="display-card">
            <div class="display-card-top">
              <div class="display-card-badge"
                   style="background:${c.bg}; color:${c.color}">${card.code}</div>
              <div>
                <div class="display-card-name">${card.english}</div>
                <div class="display-card-zh">${card.chinese}</div>
              </div>
            </div>
          </div>`;
      }).join('');
    }

    section.innerHTML = `
      <div class="display-group-header">
        <div class="display-group-dot" style="background:${color}"></div>
        <div class="display-group-title" style="color:${color}">${group}</div>
        <div class="display-group-count">${groupCards.length} 張</div>
      </div>
      <div class="display-cards-row">${cardsHTML}</div>`;

    container.appendChild(section);
  });
}

// ===================================================================
// SHARE
// ===================================================================

function shareResult() {
  if (Object.keys(ratings).length === 0) {
    showToast('請先完成排序再分享！');
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
  if (!confirm('確定要重新開始嗎？目前評分將會清除。')) return;
  ratings      = {};
  currentIndex = 0;
  history.replaceState({}, '', location.pathname);
  document.getElementById('sort-complete-banner').style.display = 'none';
  switchMode('sort');
}

// ===================================================================
// TOUCH / SWIPE
// ===================================================================

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('cardsViewport');
  if (!viewport) return;

  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextCard(); else prevCard();
    }
  }, { passive: true });
});
