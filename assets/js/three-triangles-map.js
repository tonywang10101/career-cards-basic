const TTM_REFERENCE_URL = 'https://navicareer.tw/archives/4369';
const TTM_DESCRIPTION = `三個三角形的動態動生涯地圖，三角型皆會持續變動，需要不時重新評估和轉換

• 內在三角形｜個人的心理特質。
• 外在三角形｜職業世界的狀態。
• 生命三角形｜對工作、自我和人生的期待。想要成為什麼樣的人？想渡過什麼樣的生活？`;

const TTM_TRIANGLES = [
  {
    key: 'inner',
    label: '內在',
    displayTitle: '內在個人的心理特質',
    inventoryDescription: '內在三角形｜個人的心理特質。',
    stickyColor: '#fff3a6',
    themeClass: 'is-inner',
    items: [
      { key: 'interest', label: '熱情興趣' },
      { key: 'talent', label: '天賦能力' },
      { key: 'values', label: '價值觀' }
    ]
  },
  {
    key: 'outer',
    label: '外在',
    displayTitle: '外在職業世界的狀態',
    inventoryDescription: '外在三角形｜職業世界的狀態。',
    stickyColor: '#ffe3b3',
    themeClass: 'is-outer',
    items: [
      { key: 'industry', label: '產業' },
      { key: 'company', label: '公司' },
      { key: 'role', label: '職位' }
    ]
  },
  {
    key: 'life',
    label: '生命',
    displayTitle: '理想生命樣貌',
    inventoryDescription: '生命三角形｜對工作、自我和人生的期待。想要成為什麼樣的人？想渡過什麼樣的生活？',
    stickyColor: '#dff5bf',
    themeClass: 'is-life',
    items: [
      { key: 'work', label: '工作' },
      { key: 'life', label: '人生' },
      { key: 'self', label: '自我' }
    ]
  }
];

const ttmState = {
  mode: 'inventory',
  values: createEmptyTriangleValues(),
  stickyOpen: {
    inner: true,
    outer: true,
    life: true
  }
};

function initThreeTrianglesMap() {
  const inventoryBtn = document.getElementById('inventory-mode-btn');
  const displayBtn = document.getElementById('display-mode-btn');
  const csvBtn = document.getElementById('download-csv-btn');
  const pngBtn = document.getElementById('download-png-btn');

  if (!inventoryBtn || !displayBtn || !csvBtn || !pngBtn) return;

  inventoryBtn.addEventListener('click', () => setThreeTrianglesMode('inventory'));
  displayBtn.addEventListener('click', () => setThreeTrianglesMode('display'));
  csvBtn.addEventListener('click', downloadThreeTrianglesCsv);
  pngBtn.addEventListener('click', downloadThreeTrianglesPng);

  renderThreeTrianglesInventory();
  renderThreeTrianglesDisplay();
  syncThreeTrianglesModeUi();
}

function createEmptyTriangleValues() {
  return TTM_TRIANGLES.reduce((acc, triangle) => {
    acc[triangle.key] = triangle.items.reduce((itemAcc, item) => {
      itemAcc[item.key] = '';
      return itemAcc;
    }, {});
    return acc;
  }, {});
}

function setThreeTrianglesMode(mode) {
  ttmState.mode = mode;
  syncThreeTrianglesModeUi();
}

function syncThreeTrianglesModeUi() {
  const isDisplayMode = ttmState.mode === 'display';
  const inventoryBoard = document.getElementById('inventory-board');
  const displayBoard = document.getElementById('display-board');
  const csvBtn = document.getElementById('download-csv-btn');
  const pngBtn = document.getElementById('download-png-btn');

  document.getElementById('inventory-mode-btn')?.classList.toggle('active', !isDisplayMode);
  document.getElementById('display-mode-btn')?.classList.toggle('active', isDisplayMode);

  if (inventoryBoard) {
    inventoryBoard.hidden = isDisplayMode;
    inventoryBoard.style.display = isDisplayMode ? 'none' : 'flex';
  }

  if (displayBoard) {
    displayBoard.hidden = !isDisplayMode;
    displayBoard.style.display = isDisplayMode ? 'flex' : 'none';
  }

  if (csvBtn) {
    csvBtn.disabled = !isDisplayMode;
    csvBtn.hidden = !isDisplayMode;
    csvBtn.style.display = isDisplayMode ? 'inline-flex' : 'none';
  }

  if (pngBtn) {
    pngBtn.disabled = !isDisplayMode;
    pngBtn.hidden = !isDisplayMode;
    pngBtn.style.display = isDisplayMode ? 'inline-flex' : 'none';
  }
}

function renderThreeTrianglesInventory() {
  const board = document.getElementById('inventory-board');
  if (!board) return;

  const rows = TTM_TRIANGLES.map(triangle => {
    const fields = triangle.items.map(item => {
      const value = ttmState.values[triangle.key][item.key] || '';
      const remaining = 200 - value.length;
      return `
        <div class="ttm-note-field">
          <label for="ttm-${triangle.key}-${item.key}">${item.label}</label>
          <textarea id="ttm-${triangle.key}-${item.key}" data-triangle="${triangle.key}" data-item="${item.key}" maxlength="200" placeholder="${escapeHtml(getPlaceholderExample(item.key))}">${escapeHtml(value)}</textarea>
          <div class="ttm-char-counter">${remaining}/200</div>
        </div>
      `;
    }).join('');

    return `
      <section class="ttm-inventory-row ${triangle.themeClass}">
        <div class="ttm-inventory-description">${triangle.inventoryDescription}</div>
        <div class="ttm-triangle-wrap">
          ${getTriangleSvg(triangle.label, 'ttm-triangle')}
        </div>
        <div class="ttm-fields">
          ${fields}
        </div>
      </section>
    `;
  }).join('');

  board.innerHTML = `
    <h3 class="ttm-board-title">職涯地圖</h3>
    ${rows}
  `;

  board.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', handleThreeTrianglesInput);
  });
}

function handleThreeTrianglesInput(event) {
  const textarea = event.target;
  const triangleKey = textarea.dataset.triangle;
  const itemKey = textarea.dataset.item;
  if (!triangleKey || !itemKey) return;

  const nextValue = textarea.value.slice(0, 200);
  if (textarea.value !== nextValue) textarea.value = nextValue;
  ttmState.values[triangleKey][itemKey] = nextValue;

  const counter = textarea.parentElement?.querySelector('.ttm-char-counter');
  if (counter) counter.textContent = `${200 - nextValue.length}/200`;

  renderThreeTrianglesDisplay();
}

function renderThreeTrianglesDisplay() {
  const board = document.getElementById('display-board');
  if (!board) return;

  const columns = TTM_TRIANGLES.map(triangle => {
    const isOpen = ttmState.stickyOpen[triangle.key];
    const itemsHtml = triangle.items.map(item => `
      <div class="ttm-sticky-item">
        <strong>${item.label}</strong>
        <p>${escapeHtml(getDisplayPreviewText(ttmState.values[triangle.key][item.key])) || '尚未填寫'}</p>
      </div>
    `).join('');

    return `
      <section class="ttm-display-column ${triangle.themeClass} ${isOpen ? 'is-open' : ''}" data-triangle-column="${triangle.key}">
        <div class="ttm-display-stage">
          <div class="ttm-display-sticky" style="background:${triangle.stickyColor}">
            <button class="ttm-sticky-toggle" type="button" data-toggle-sticky="${triangle.key}" aria-expanded="${isOpen}">
              <span class="ttm-sticky-arrow">${isOpen ? '−' : '+'}</span>
            </button>
            <div class="ttm-sticky-body" ${isOpen ? '' : 'hidden'}>
              ${itemsHtml}
            </div>
          </div>
          ${getTriangleSvg(triangle.label, 'ttm-triangle ttm-display-triangle')}
        </div>
      </section>
    `;
  }).join('');

  board.innerHTML = `
    <h3 class="ttm-board-title">職涯地圖</h3>
    <div class="ttm-display-grid">${columns}</div>
    ${getBoardFooterHtml('bottom')}
  `;

  board.querySelectorAll('[data-toggle-sticky]').forEach(button => {
    button.addEventListener('click', () => toggleThreeTrianglesSticky(button.dataset.toggleSticky));
  });
}

function toggleThreeTrianglesSticky(triangleKey) {
  if (!triangleKey) return;
  ttmState.stickyOpen[triangleKey] = !ttmState.stickyOpen[triangleKey];
  renderThreeTrianglesDisplay();
}

function downloadThreeTrianglesCsv() {
  const rows = [['triangleKey', 'triangleLabel', 'itemKey', 'itemLabel', 'content']];

  TTM_TRIANGLES.forEach(triangle => {
    triangle.items.forEach(item => {
      rows.push([
        triangle.key,
        triangle.label,
        item.key,
        item.label,
        (ttmState.values[triangle.key][item.key] || '').replace(/\r?\n/g, '\n')
      ]);
    });
  });

  const csvText = '\uFEFF' + rows.map(row => row.map(toCsvCell).join(',')).join('\r\n');
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `three-triangles-map-${getDateStamp()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('已下載 CSV');
}

async function downloadThreeTrianglesPng() {
  try {
    const board = document.getElementById('display-board');
    if (!board || board.hidden) {
      showToast('請先切換到展示模式');
      return;
    }

    const dataUrl = renderDisplayBoardToPng(board);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `three-triangles-map-${getDateStamp()}.png`;
    link.click();
    showToast('已下載 PNG');
  } catch (error) {
    console.error(error);
    showToast('PNG 下載失敗，請稍後再試');
  }
}

function renderDisplayBoardToPng(board) {
  const rect = board.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(board.scrollHeight));
  const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2));

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable.');
  ctx.scale(scale, scale);

  drawBoardSurface(ctx, width, height);
  drawBoardTitle(ctx, board, rect);
  drawBoardColumns(ctx, board, rect);
  drawBoardFooter(ctx, board, rect);

  return canvas.toDataURL('image/png');
}

function drawBoardSurface(ctx, width, height) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  roundRectPath(ctx, 1.5, 1.5, width - 3, height - 3, 28);
  ctx.fill();
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawBoardTitle(ctx, board, boardRect) {
  const title = board.querySelector('.ttm-board-title');
  if (!title) return;
  const rect = title.getBoundingClientRect();
  const x = rect.left - boardRect.left;
  const y = rect.bottom - boardRect.top - 6;

  ctx.fillStyle = '#111827';
  ctx.font = '800 32px "Noto Sans TC", "PingFang TC", sans-serif';
  ctx.fillText(title.textContent || '職涯地圖', x, y);
}

function drawBoardColumns(ctx, board, boardRect) {
  board.querySelectorAll('.ttm-display-column').forEach(column => {
    drawDisplayColumn(ctx, column, boardRect);
  });
}

function drawDisplayColumn(ctx, column, boardRect) {
  const sticky = column.querySelector('.ttm-display-sticky');
  const triangle = column.querySelector('.ttm-display-triangle');
  if (!sticky || !triangle) return;

  const stickyRect = sticky.getBoundingClientRect();
  const triangleRect = triangle.getBoundingClientRect();
  const stickyX = stickyRect.left - boardRect.left;
  const stickyY = stickyRect.top - boardRect.top;
  const triangleX = triangleRect.left - boardRect.left;
  const triangleY = triangleRect.top - boardRect.top;
  const theme = getColumnTheme(column);

  drawStickyCard(ctx, sticky, stickyX, stickyY, stickyRect.width, stickyRect.height, theme);
  drawTriangleCard(ctx, triangle, triangleX, triangleY, triangleRect.width, triangleRect.height, theme);
}

function getColumnTheme(column) {
  if (column.classList.contains('is-inner')) {
    return {
      stickyTop: '#e6efff',
      stickyBottom: '#f8fbff',
      border: '#2c4a78',
      text: '#243b63',
      triangleFill: 'rgba(247, 250, 255, 0.42)'
    };
  }

  if (column.classList.contains('is-outer')) {
    return {
      stickyTop: '#ffe9d8',
      stickyBottom: '#fff8f2',
      border: '#7b4a2c',
      text: '#6b4127',
      triangleFill: 'rgba(255, 248, 242, 0.38)'
    };
  }

  return {
    stickyTop: '#e7f5df',
    stickyBottom: '#f8fcf6',
    border: '#355e3b',
    text: '#294c31',
    triangleFill: 'rgba(247, 252, 245, 0.36)'
  };
}

function drawStickyCard(ctx, sticky, x, y, width, height, theme) {
  ctx.save();
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const rotation = getStickyRotation(sticky);
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.translate(-width / 2, -height / 2);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, theme.stickyTop);
  gradient.addColorStop(1, theme.stickyBottom);
  ctx.fillStyle = gradient;
  roundRectPath(ctx, 0, 0, width, height, 18);
  ctx.fill();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  const body = sticky.querySelector('.ttm-sticky-body');
  const itemBoxes = body ? Array.from(body.querySelectorAll('.ttm-sticky-item')) : [];
  const isOpen = body && !body.hidden;

  ctx.fillStyle = theme.text;
  ctx.font = '700 22px "Noto Sans TC", "PingFang TC", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(isOpen ? '−' : '+', width - 18, 10);

  if (isOpen) {
    let currentY = 38;
    itemBoxes.forEach(item => {
      const boxHeight = 92;
      ctx.fillStyle = 'rgba(255,255,255,0.68)';
      roundRectPath(ctx, 18, currentY, width - 36, boxHeight, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(17, 24, 39, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const strong = item.querySelector('strong')?.textContent || '';
      const text = item.querySelector('p')?.textContent || '';

      ctx.fillStyle = theme.text;
      ctx.textAlign = 'left';
      ctx.font = '700 15px "Noto Sans TC", "PingFang TC", sans-serif';
      ctx.fillText(strong, 32, currentY + 14);

      ctx.fillStyle = '#1f2937';
      ctx.font = '400 14px "Noto Sans TC", "PingFang TC", sans-serif';
      const lines = wrapCanvasText(ctx, text, width - 64);
      lines.slice(0, 2).forEach((line, index) => {
        ctx.fillText(line, 32, currentY + 42 + index * 20);
      });

      currentY += 102;
    });
  }

  ctx.restore();
}

function getStickyRotation(sticky) {
  const transform = window.getComputedStyle(sticky).transform;
  if (!transform || transform === 'none') return 0;
  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) return 0;
  const parts = match[1].split(',').map(Number);
  return Math.atan2(parts[1], parts[0]);
}

function drawTriangleCard(ctx, triangle, x, y, width, height, theme) {
  const label = triangle.getAttribute('aria-label')?.replace('三角形', '') || '';
  const centerX = x + width / 2;
  const topY = y + height * 0.06;
  const leftX = x + width * 0.08;
  const rightX = x + width * 0.92;
  const bottomY = y + height * 0.92;

  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.lineTo(leftX, bottomY);
  ctx.lineTo(rightX, bottomY);
  ctx.closePath();
  ctx.fillStyle = theme.triangleFill;
  ctx.fill();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = theme.text;
  ctx.font = '700 22px "Noto Sans TC", "PingFang TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, centerX, y + height * 0.63);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawBoardFooter(ctx, board, boardRect) {
  const footer = board.querySelector('.ttm-board-footer');
  if (!footer) return;
  const rect = footer.getBoundingClientRect();
  const y = rect.top - boardRect.top;

  ctx.strokeStyle = 'rgba(17, 24, 39, 0.2)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(rect.left - boardRect.left, y);
  ctx.lineTo(rect.right - boardRect.left, y);
  ctx.stroke();
  ctx.setLineDash([]);

  const desc = footer.querySelector('p')?.textContent || '';
  const link = footer.querySelector('a')?.textContent || '';
  const left = rect.left - boardRect.left;

  ctx.fillStyle = '#374151';
  ctx.font = '400 14px "Noto Sans TC", "PingFang TC", sans-serif';
  const lines = wrapCanvasText(ctx, desc, rect.width - 180);
  lines.forEach((line, index) => {
    ctx.fillText(line, left, y + 28 + index * 22);
  });

  ctx.fillStyle = '#4F46E5';
  ctx.fillText(link, left, y + 28 + lines.length * 22 + 10);
}

function toCsvCell(value) {
  const safe = String(value ?? '').replace(/"/g, '""');
  return `"${safe}"`;
}

function getDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function getTriangleSvg(label, className) {
  return `
    <svg class="${className}" viewBox="0 0 150 130" role="img" aria-label="${label}三角形">
      <polygon points="75,8 12,120 138,120"></polygon>
      <text x="75" y="82" text-anchor="middle">${label}</text>
    </svg>
  `;
}

function getBoardFooterHtml(position = 'bottom') {
  const className = position === 'top' ? 'ttm-board-footer ttm-board-footer-top' : 'ttm-board-footer';
  return `
    <div class="${className}">
      <p>${TTM_DESCRIPTION}</p>
      <a href="${TTM_REFERENCE_URL}" target="_blank" rel="noreferrer">參考連結：${TTM_REFERENCE_URL}</a>
    </div>
  `;
}

function getPlaceholderExample(itemKey) {
  const examples = {
    interest: '例如：喜歡把複雜資訊整理成簡單圖表，也喜歡與人討論職涯方向。',
    talent: '例如：擅長傾聽、統整重點，能快速看見問題背後的脈絡。',
    values: '例如：重視成長、自主與真誠，希望工作能對他人有幫助。',
    industry: '例如：教育訓練、內容企劃、心理助人或數位產品相關產業。',
    company: '例如：重視學習文化、彈性高、願意給新人嘗試空間的團隊。',
    role: '例如：職涯顧問、內容企劃、專案管理或使用者研究相關角色。',
    work: '例如：希望工作能穩定投入，也保有創作與陪伴他人的空間。',
    life: '例如：想過有節奏、能持續學習，也能兼顧家人與健康的生活。',
    self: '例如：想成為溫柔而有判斷力的人，能做出符合自己價值的選擇。'
  };

  return examples[itemKey] || '請輸入 200 字以內的內容';
}

function getDisplayPreviewText(text) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= 50) return normalized;
  return `${normalized.slice(0, 50)}...`;
}

function wrapCanvasText(ctx, text, maxWidth) {
  const chars = Array.from(String(text || ''));
  const lines = [];
  let current = '';

  chars.forEach(char => {
    if (char === '\n') {
      lines.push(current);
      current = '';
      return;
    }

    const next = current + char;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  });

  if (current || lines.length === 0) lines.push(current);
  return lines;
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function roundRectPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
