/**
 * life-balance.js – 生命平衡輪 (Life Balance Wheel)
 *
 * URL params: ?cur=7,8,6,5,4,3,2,1,9,10&ideal=9,9,8,7,6,5,4,3,2,1
 */

// ===== DATA =====
const LB_DIMS = [
  { id: 0, label: '心理靈性',     icon: '🧘', color: '#8B5CF6' },
  { id: 1, label: '理財與經濟',   icon: '💰', color: '#F59E0B' },
  { id: 2, label: '工作／職業',   icon: '💼', color: '#3B82F6' },
  { id: 3, label: '健康與體態',   icon: '💪', color: '#10B981' },
  { id: 4, label: '休閒娛樂',     icon: '🎮', color: '#EC4899' },
  { id: 5, label: '生活環境',     icon: '🏠', color: '#F97316' },
  { id: 6, label: '社群與社團',   icon: '🤝', color: '#06B6D4' },
  { id: 7, label: '家庭與朋友',   icon: '👨‍👩‍👧', color: '#EF4444' },
  { id: 8, label: '愛與伴侶',     icon: '❤️', color: '#E879F9' },
  { id: 9, label: '學習與成長',   icon: '📚', color: '#14B8A6' }
];

const N = LB_DIMS.length; // 10

// ===== STATE =====
let lbScores = {
  current: new Array(N).fill(0),
  ideal:   new Array(N).fill(0)
};
let lbEditMode = 'current'; // 'current' | 'ideal'
let lbViewMode = 'wheel';   // 'wheel' | 'list' | 'display' | 'input'

// ===== INIT =====
function initLifeBalance() {
  parseURL();
  renderAll();
  updateModeBar();
  updateToggle();
}

// ===== URL =====
function parseURL() {
  const p = new URLSearchParams(location.search);
  if (p.has('cur')) {
    const vals = p.get('cur').split(',').map(Number);
    for (let i = 0; i < N; i++) lbScores.current[i] = clamp(vals[i] || 0, 0, 10);
  }
  if (p.has('ideal')) {
    const vals = p.get('ideal').split(',').map(Number);
    for (let i = 0; i < N; i++) lbScores.ideal[i] = clamp(vals[i] || 0, 0, 10);
  }
}

function buildShareURL() {
  const params = new URLSearchParams();
  params.set('cur',   lbScores.current.join(','));
  params.set('ideal', lbScores.ideal.join(','));
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function shareResult() {
  navigator.clipboard.writeText(buildShareURL()).then(() => {
    showToast('🔗 連結已複製！');
  }).catch(() => {
    showToast('複製失敗，請手動複製網址');
  });
}

function resetAll() {
  lbScores.current = new Array(N).fill(0);
  lbScores.ideal   = new Array(N).fill(0);
  lbEditMode = 'current';
  history.replaceState(null, '', location.pathname);
  renderAll();
  updateToggle();
  showToast('🔄 已重新開始');
}

// ===== HELPERS =====
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ===== SET SCORE =====
function lbSetScore(dim, score) {
  const arr = lbScores[lbEditMode];
  // toggle-off: click same score → 0
  arr[dim] = (arr[dim] === score) ? 0 : score;
  renderAll();
}

// ===== MODE =====
function switchLbMode(mode) {
  lbViewMode = mode;
  updateModeBar();

  document.getElementById('lb-wheel-view').style.display   = mode === 'wheel'   ? '' : 'none';
  document.getElementById('lb-list-view').style.display    = mode === 'list'    ? '' : 'none';
  document.getElementById('lb-display-view').style.display = mode === 'display' ? '' : 'none';
  document.getElementById('lb-input-view').style.display   = mode === 'input'   ? '' : 'none';

  // Hide edit toggle in input mode (two-column layout) and display mode (shows both at once)
  const toggleWrap = document.getElementById('lb-edit-toggle-wrap');
  if (toggleWrap) toggleWrap.style.display = (mode === 'input' || mode === 'display') ? 'none' : 'flex';

  if (mode === 'input') _fillLbSlotsFromState();
}

function updateModeBar() {
  ['wheel','list','display','input'].forEach(m => {
    const btn = document.getElementById(`lb-mode-${m}-btn`);
    if (btn) btn.classList.toggle('active', lbViewMode === m);
  });
}

function setEditMode(mode) {
  lbEditMode = mode;
  updateToggle();
  renderAll();
}

function updateToggle() {
  document.getElementById('lb-toggle-current').classList.toggle('active', lbEditMode === 'current');
  document.getElementById('lb-toggle-ideal').classList.toggle('active', lbEditMode === 'ideal');
}

// ===== RENDER ALL =====
function renderAll() {
  renderWheel();
  renderList();
  renderDisplay();
  // input view: only update if visible (handled via _fillSlotsFromState on switchMode)
  if (lbViewMode === 'input') _fillLbSlotsFromState();
}

// ===== WHEEL (SVG) =====
function renderWheel() {
  const svg = document.getElementById('lb-wheel-svg');
  if (!svg) return;

  const size = 500;
  const cx = size / 2, cy = size / 2;
  const maxR = 168;
  const minR = 18;
  const rings = 10;

  let html = '';

  // Background rings (faint circles)
  for (let r = 1; r <= rings; r++) {
    const radius = minR + (maxR - minR) * r / rings;
    html += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>`;
  }

  // Spoke lines
  for (let i = 0; i < N; i++) {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const x2 = cx + maxR * Math.cos(angle);
    const y2 = cy + maxR * Math.sin(angle);
    html += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#e5e7eb" stroke-width="0.8"/>`;
  }

  // Sector arc cells (clickable)
  const scores = lbScores[lbEditMode];
  for (let i = 0; i < N; i++) {
    const dim = LB_DIMS[i];
    const a1 = (2 * Math.PI * i / N) - Math.PI / 2;
    const a2 = (2 * Math.PI * (i + 1) / N) - Math.PI / 2;
    const gap = 0.03; // radians gap between sectors

    for (let ring = 1; ring <= rings; ring++) {
      const r1 = minR + (maxR - minR) * (ring - 1) / rings;
      const r2 = minR + (maxR - minR) * ring / rings;
      const isActive = scores[i] >= ring;
      const isHover  = scores[i] + 1 === ring; // next ring hint

      const fillColor = isActive
        ? hexWithAlpha(dim.color, 0.8 + 0.02 * ring)
        : '#f3f4f6';

      const path = arcPath(cx, cy, r1 + 1, r2 - 0.5, a1 + gap, a2 - gap);
      html += `<path d="${path}"
        fill="${fillColor}"
        stroke="white" stroke-width="1"
        class="lb-arc-cell${isActive ? ' active' : ''}"
        onclick="lbSetScore(${i}, ${ring})"
        data-dim="${i}" data-ring="${ring}">
        <title>${dim.label}: ${ring} 分</title>
      </path>`;
    }
  }

  // Score filled polygon (radar line on wheel)
  const curPts = lbScores.current.map((s, i) => {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const r = minR + (maxR - minR) * s / rings;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const idealPts = lbScores.ideal.map((s, i) => {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const r = minR + (maxR - minR) * s / rings;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });

  // Overlay polygons — pointer-events:none so clicks pass through to arc cells below
  if (lbScores.current.some(s => s > 0)) {
    html += `<polygon points="${curPts.map(p=>p.join(',')).join(' ')}"
      fill="rgba(79,70,229,0.15)" stroke="#4F46E5" stroke-width="2" fill-rule="evenodd"
      pointer-events="none"/>`;
  }
  if (lbScores.ideal.some(s => s > 0)) {
    html += `<polygon points="${idealPts.map(p=>p.join(',')).join(' ')}"
      fill="rgba(16,185,129,0.10)" stroke="#10B981" stroke-width="2" stroke-dasharray="5,3" fill-rule="evenodd"
      pointer-events="none"/>`;
  }

  // Labels — placed at sector CENTER angle (halfway between spoke lines)
  for (let i = 0; i < N; i++) {
    const dim = LB_DIMS[i];
    const angle = (2 * Math.PI * (i + 0.5) / N) - Math.PI / 2; // sector midpoint
    const labelR = maxR + 30;
    const lx = cx + labelR * Math.cos(angle);
    const ly = cy + labelR * Math.sin(angle);
    const score = scores[i];
    const anchor = lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle';

    html += `
      <text x="${lx}" y="${ly - 6}" text-anchor="${anchor}"
            font-size="11" font-weight="600" fill="${dim.color}">${dim.icon} ${dim.label}</text>
      <text x="${lx}" y="${ly + 9}" text-anchor="${anchor}"
            font-size="13" font-weight="700" fill="${score > 0 ? dim.color : '#9ca3af'}">${score > 0 ? score : '–'}</text>`;
  }

  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.innerHTML = html;
}

function arcPath(cx, cy, r1, r2, a1, a2) {
  const x1o = cx + r1 * Math.cos(a1), y1o = cy + r1 * Math.sin(a1);
  const x2o = cx + r2 * Math.cos(a1), y2o = cy + r2 * Math.sin(a1);
  const x3o = cx + r2 * Math.cos(a2), y3o = cy + r2 * Math.sin(a2);
  const x4o = cx + r1 * Math.cos(a2), y4o = cy + r1 * Math.sin(a2);
  const large = (a2 - a1) > Math.PI ? 1 : 0;
  return [
    `M ${x1o} ${y1o}`,
    `L ${x2o} ${y2o}`,
    `A ${r2} ${r2} 0 ${large} 1 ${x3o} ${y3o}`,
    `L ${x4o} ${y4o}`,
    `A ${r1} ${r1} 0 ${large} 0 ${x1o} ${y1o}`,
    'Z'
  ].join(' ');
}

function hexWithAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${Math.min(1, alpha)})`;
}

// ===== LIST VIEW =====
function renderList() {
  const el = document.getElementById('lb-list-body');
  if (!el) return;
  const scores = lbScores[lbEditMode];

  el.innerHTML = LB_DIMS.map((dim, i) => {
    const score = scores[i];
    const dots = Array.from({length: 10}, (_, ring) => {
      const active = score >= ring + 1;
      return `<button class="lb-dot${active ? ' active' : ''}"
        style="${active ? `background:${dim.color};border-color:${dim.color}` : ''}"
        onclick="lbSetScore(${i}, ${ring + 1})"
        title="${ring + 1} 分">${ring + 1}</button>`;
    }).join('');

    return `
      <div class="lb-list-row">
        <div class="lb-list-label" style="color:${dim.color}">
          <span class="lb-list-icon">${dim.icon}</span>
          <span>${dim.label}</span>
        </div>
        <div class="lb-list-dots">${dots}</div>
        <div class="lb-list-score" style="color:${dim.color}">${score > 0 ? score : '–'}</div>
      </div>`;
  }).join('');
}

// ===== DISPLAY VIEW (radar chart comparison) =====
function renderDisplay() {
  const svg = document.getElementById('lb-display-svg');
  if (!svg) return;

  const size = 520;
  const cx = size / 2, cy = size / 2;
  const maxR = 165;
  const minR = 16;
  const rings = 10;

  let html = '';

  // Background rings
  for (let r = 1; r <= rings; r++) {
    const radius = minR + (maxR - minR) * r / rings;
    html += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="${r % 5 === 0 ? 1.2 : 0.5}"/>`;
    if (r % 5 === 0) {
      html += `<text x="${cx + 4}" y="${cy - radius + 4}" font-size="9" fill="#9ca3af">${r}</text>`;
    }
  }

  // Spokes (dividers at sector boundaries)
  for (let i = 0; i < N; i++) {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const x2 = cx + maxR * Math.cos(angle);
    const y2 = cy + maxR * Math.sin(angle);
    html += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#e5e7eb" stroke-width="1"/>`;
  }

  // Labels — at sector CENTER angle (halfway between spoke lines)
  for (let i = 0; i < N; i++) {
    const labelAngle = (2 * Math.PI * (i + 0.5) / N) - Math.PI / 2;
    const dim = LB_DIMS[i];
    const labelR = maxR + 32;
    const lx = cx + labelR * Math.cos(labelAngle);
    const ly = cy + labelR * Math.sin(labelAngle);
    const anchor = lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle';
    const curScore = lbScores.current[i];
    const idealScore = lbScores.ideal[i];

    html += `
      <text x="${lx}" y="${ly - 7}" text-anchor="${anchor}" font-size="11" font-weight="600" fill="${dim.color}">${dim.icon} ${dim.label}</text>
      <text x="${lx}" y="${ly + 7}" text-anchor="${anchor}" font-size="10" fill="#4F46E5">現${curScore > 0 ? curScore : '–'} </text>
      <text x="${lx}" y="${ly + 19}" text-anchor="${anchor}" font-size="10" fill="#10B981">理${idealScore > 0 ? idealScore : '–'}</text>`;
  }

  // Current polygon
  const curPts = lbScores.current.map((s, i) => {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const r = minR + (maxR - minR) * s / rings;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });

  // Ideal polygon
  const idealPts = lbScores.ideal.map((s, i) => {
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const r = minR + (maxR - minR) * s / rings;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });

  if (lbScores.ideal.some(s => s > 0)) {
    html += `<polygon points="${idealPts.map(p=>p.join(',')).join(' ')}"
      fill="rgba(16,185,129,0.12)" stroke="#10B981" stroke-width="2.5" stroke-dasharray="6,3"/>`;
  }
  if (lbScores.current.some(s => s > 0)) {
    html += `<polygon points="${curPts.map(p=>p.join(',')).join(' ')}"
      fill="rgba(79,70,229,0.18)" stroke="#4F46E5" stroke-width="2.5"/>`;
  }

  // Dots
  lbScores.current.forEach((s, i) => {
    if (s === 0) return;
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const r = minR + (maxR - minR) * s / rings;
    html += `<circle cx="${cx + r * Math.cos(angle)}" cy="${cy + r * Math.sin(angle)}" r="4" fill="#4F46E5"/>`;
  });
  lbScores.ideal.forEach((s, i) => {
    if (s === 0) return;
    const angle = (2 * Math.PI * i / N) - Math.PI / 2;
    const r = minR + (maxR - minR) * s / rings;
    html += `<circle cx="${cx + r * Math.cos(angle)}" cy="${cy + r * Math.sin(angle)}" r="4" fill="#10B981" stroke="white" stroke-width="1.5"/>`;
  });

  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.innerHTML = html;

  // Scores table
  const tableEl = document.getElementById('lb-display-table');
  if (tableEl) {
    tableEl.innerHTML = LB_DIMS.map((dim, i) => {
      const cur = lbScores.current[i];
      const ideal = lbScores.ideal[i];
      const diff = ideal - cur;
      const diffStr = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '—';
      const diffClass = diff > 0 ? 'lb-diff-pos' : diff < 0 ? 'lb-diff-neg' : 'lb-diff-zero';
      return `<tr>
        <td><span style="color:${dim.color}">${dim.icon} ${dim.label}</span></td>
        <td class="lb-score-cell" style="color:#4F46E5">${cur > 0 ? cur : '–'}</td>
        <td class="lb-score-cell" style="color:#10B981">${ideal > 0 ? ideal : '–'}</td>
        <td class="lb-score-cell ${diffClass}">${diffStr}</td>
      </tr>`;
    }).join('');
  }
}

// ===== INPUT VIEW =====
function renderInputSlots() {
  const grid = document.getElementById('lb-input-grid');
  if (!grid) return;

  grid.innerHTML = LB_DIMS.map((dim, i) => `
    <div class="lb-input-row">
      <div class="lb-input-label" style="color:${dim.color}">${dim.icon} ${dim.label}</div>
      <div class="lb-input-fields">
        <div class="lb-input-field-wrap">
          <label class="lb-input-sub-label" style="color:#4F46E5">目前</label>
          <input type="number" min="1" max="10" class="lb-slot-input" id="lb-cur-${i}"
            placeholder="1-10" oninput="onLbSlotInput()" value="${lbScores.current[i] || ''}">
        </div>
        <div class="lb-input-field-wrap">
          <label class="lb-input-sub-label" style="color:#10B981">理想</label>
          <input type="number" min="1" max="10" class="lb-slot-input" id="lb-ideal-${i}"
            placeholder="1-10" oninput="onLbSlotInput()" value="${lbScores.ideal[i] || ''}">
        </div>
      </div>
    </div>`).join('');
}

function onLbSlotInput() {
  _applyLbInputToState();
}

function _applyLbInputToState() {
  for (let i = 0; i < N; i++) {
    const curEl   = document.getElementById(`lb-cur-${i}`);
    const idealEl = document.getElementById(`lb-ideal-${i}`);

    if (curEl) {
      const v = parseInt(curEl.value, 10);
      const isEmpty = curEl.value.trim() === '';
      const isValid = isEmpty || (!isNaN(v) && v >= 1 && v <= 10);
      curEl.classList.toggle('lb-slot-invalid', !isValid);
      lbScores.current[i] = isEmpty ? 0 : (isValid ? v : lbScores.current[i]);
    }
    if (idealEl) {
      const v = parseInt(idealEl.value, 10);
      const isEmpty = idealEl.value.trim() === '';
      const isValid = isEmpty || (!isNaN(v) && v >= 1 && v <= 10);
      idealEl.classList.toggle('lb-slot-invalid', !isValid);
      lbScores.ideal[i] = isEmpty ? 0 : (isValid ? v : lbScores.ideal[i]);
    }
  }
  renderWheel();
  renderList();
  renderDisplay();
}

function _fillLbSlotsFromState() {
  renderInputSlots();
}

function generateLbURL() {
  const url = buildShareURL();
  const resultBox = document.getElementById('lb-input-result-box');
  const resultUrl = document.getElementById('lb-input-result-url');
  if (resultBox && resultUrl) {
    resultUrl.textContent = url;
    resultBox.style.display = '';
  }
}

function copyLbInputURL() {
  const url = document.getElementById('lb-input-result-url')?.textContent;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => showToast('📋 連結已複製！'));
}

function clearLbInput() {
  lbScores.current = new Array(N).fill(0);
  lbScores.ideal   = new Array(N).fill(0);
  renderInputSlots();
  renderWheel();
  renderList();
  renderDisplay();
  const resultBox = document.getElementById('lb-input-result-box');
  if (resultBox) resultBox.style.display = 'none';
  showToast('✕ 已清除');
}
