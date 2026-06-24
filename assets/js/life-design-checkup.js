const LDC_AREAS = [
  {
    key: 'health',
    label: '健康',
    prompt: '身體、心理、睡眠、能量與照顧自己的狀態如何？',
    placeholder: '例如：最近睡眠不太穩定，但有固定散步；壓力高時容易忽略吃飯。'
  },
  {
    key: 'work',
    label: '工作',
    prompt: '工作、學習、志業或正在投入的主要責任，帶給你什麼感受？',
    placeholder: '例如：任務量可以負荷，但缺少成長感；想重新確認這份工作的意義。'
  },
  {
    key: 'play',
    label: '遊戲',
    prompt: '讓你好奇、放鬆、享受或忘記時間的活動，最近是否還存在？',
    placeholder: '例如：很少安排純粹好玩的事；週末打球時會覺得自己比較像自己。'
  },
  {
    key: 'love',
    label: '愛',
    prompt: '你與重要他人、社群、家人、伴侶或自己的連結狀態如何？',
    placeholder: '例如：和朋友有聯絡，但很少深入聊天；想把陪伴家人的時間排進日常。'
  }
];

const LDC_STORAGE_KEY = 'career-tools-life-design-checkup';
const LDC_MAX_CHARS = 200;
const LDC_EXPORT_WIDTH = 1754;
const LDC_EXPORT_HEIGHT = 1240;

let ldcState = {
  scores: {},
  notes: {}
};

function initLifeDesignCheckup() {
  loadLifeDesignState();
  renderLifeDesignScores();
  renderLifeDesignReflections();
}

function renderLifeDesignScores() {
  const list = document.getElementById('ldc-score-list');
  if (!list) return;

  list.innerHTML = '';
  LDC_AREAS.forEach(area => {
    if (!Number.isInteger(ldcState.scores[area.key])) ldcState.scores[area.key] = 0;

    const row = document.createElement('div');
    row.className = 'ldc-score-row';

    const name = document.createElement('div');
    name.className = 'ldc-score-name';
    name.textContent = area.label;
    row.appendChild(name);

    const value = document.createElement('div');
    value.className = 'ldc-score-value';
    value.id = `ldc-score-value-${area.key}`;
    value.textContent = ldcState.scores[area.key];
    row.appendChild(value);

    const steps = document.createElement('div');
    steps.className = 'ldc-score-steps';
    steps.setAttribute('role', 'group');
    steps.setAttribute('aria-label', `${area.label}分數`);

    for (let score = 1; score <= 6; score += 1) {
      const step = document.createElement('button');
      step.type = 'button';
      step.className = 'ldc-score-step';
      step.classList.toggle('is-active', score <= ldcState.scores[area.key]);
      step.setAttribute('aria-label', `${area.label} ${score} 分`);
      step.addEventListener('click', () => setLifeDesignScore(area.key, score));
      steps.appendChild(step);
    }

    row.appendChild(steps);

    const full = document.createElement('div');
    full.className = 'ldc-score-full';
    full.textContent = '滿格';
    row.appendChild(full);

    list.appendChild(row);
  });
}

function renderLifeDesignReflections() {
  const grid = document.getElementById('ldc-reflection-grid');
  if (!grid) return;

  grid.innerHTML = '';
  LDC_AREAS.forEach((area, index) => {
    const card = document.createElement('label');
    card.className = 'ldc-reflection-card';

    const label = document.createElement('span');
    label.className = 'ldc-reflection-label';
    label.textContent = area.label;

    const number = document.createElement('span');
    number.className = 'ldc-reflection-number';
    number.textContent = index + 1;
    label.appendChild(number);
    card.appendChild(label);

    const textarea = document.createElement('textarea');
    textarea.maxLength = LDC_MAX_CHARS;
    textarea.value = ldcState.notes[area.key] || '';
    textarea.placeholder = `${area.prompt}\n${area.placeholder}`;
    textarea.addEventListener('input', () => {
      ldcState.notes[area.key] = textarea.value;
      updateLifeDesignCounter(area.key, textarea.value.length);
      saveLifeDesignState();
    });
    card.appendChild(textarea);

    const counter = document.createElement('span');
    counter.className = 'ldc-char-count';
    counter.id = `ldc-char-count-${area.key}`;
    card.appendChild(counter);

    grid.appendChild(card);
    updateLifeDesignCounter(area.key, textarea.value.length);
  });
}

function setLifeDesignScore(key, score) {
  ldcState.scores[key] = score;
  saveLifeDesignState();
  renderLifeDesignScores();
}

function updateLifeDesignCounter(key, length) {
  const counter = document.getElementById(`ldc-char-count-${key}`);
  if (!counter) return;
  counter.textContent = `${length}/${LDC_MAX_CHARS}`;
  counter.classList.toggle('is-full', length >= LDC_MAX_CHARS);
}

function loadLifeDesignState() {
  try {
    const saved = JSON.parse(localStorage.getItem(LDC_STORAGE_KEY) || '{}');
    ldcState = {
      scores: saved.scores || {},
      notes: saved.notes || {}
    };
  } catch (error) {
    ldcState = { scores: {}, notes: {} };
  }
}

function saveLifeDesignState() {
  localStorage.setItem(LDC_STORAGE_KEY, JSON.stringify(ldcState));
}

function resetLifeDesignCheckup() {
  const hasContent = LDC_AREAS.some(area => {
    return (ldcState.scores[area.key] || 0) > 0 || (ldcState.notes[area.key] || '').trim();
  });
  if (!hasContent) return;
  if (!window.confirm('要清空目前的生命設計健檢內容嗎？')) return;

  ldcState = { scores: {}, notes: {} };
  saveLifeDesignState();
  renderLifeDesignScores();
  renderLifeDesignReflections();
  showToast('已清空生命設計健檢');
}

function downloadLifeDesignPng() {
  const canvas = renderLifeDesignCanvas();
  const link = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = canvas.toDataURL('image/png');
  link.download = `life-design-checkup-${stamp}.png`;
  link.click();
  showToast('已下載 PNG');
}

function downloadLifeDesignPdf() {
  const canvas = renderLifeDesignCanvas();
  const jpeg = canvas.toDataURL('image/jpeg', 0.92);
  const pdfUrl = createSinglePagePdf(jpeg, LDC_EXPORT_WIDTH, LDC_EXPORT_HEIGHT);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = pdfUrl;
  link.download = `life-design-checkup-${stamp}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
  showToast('已下載 PDF');
}

function renderLifeDesignCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = LDC_EXPORT_WIDTH;
  canvas.height = LDC_EXPORT_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported');

  drawLifeDesignSheet(ctx, LDC_EXPORT_WIDTH, LDC_EXPORT_HEIGHT);
  return canvas;
}

function drawLifeDesignSheet(ctx, width, height) {
  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#2563a8';
  ctx.fillRect(0, 0, width, 30);
  ctx.fillRect(0, height - 30, width, 30);

  const padX = 82;
  const top = 92;

  drawGaugeMark(ctx, padX + 92, top + 42);
  ctx.fillStyle = '#174d8e';
  ctx.font = font(800, 66);
  ctx.textBaseline = 'top';
  ctx.fillText('生命設計健檢', padX + 220, top - 6);

  ctx.fillStyle = '#315f93';
  ctx.font = font(600, 24);
  wrapCanvasText(
    ctx,
    '先替健康、工作、遊戲與愛四個面向打分，再寫下此刻的具體觀察。分數不是成績，而是讓你看見哪裡需要重新設計、哪裡只是暫時需要被接住。',
    padX + 220,
    top + 80,
    1040,
    36
  );

  ctx.strokeStyle = 'rgba(37, 99, 168, 0.45)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(padX, 224);
  ctx.lineTo(width - padX, 224);
  ctx.stroke();

  drawPromptBox(ctx, padX + 6, 314, 410, 150);
  drawScoreRows(ctx, padX + 506, 300, width - padX - 520);
  drawReflectionCards(ctx, padX, 534, width - padX * 2, height - 626);
}

function drawGaugeMark(ctx, centerX, centerY) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.fillStyle = '#2563a8';
  [-42, -21, 0, 21, 42].forEach((angle, index) => {
    ctx.save();
    ctx.rotate((angle * Math.PI) / 180);
    roundRectPath(ctx, -12, -72 + index * 2, 24, 74 - Math.abs(index - 2) * 7, 12);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

function drawPromptBox(ctx, x, y, width, height) {
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#f3f4f6';
  roundRectPath(ctx, x, y, width, height, 38);
  ctx.fill();

  ctx.fillStyle = '#174d8e';
  ctx.font = font(800, 30);
  ctx.fillText('定位現況', x + 34, y + 36);
  ctx.fillStyle = '#315f93';
  ctx.font = font(800, 24);
  wrapCanvasText(ctx, '盤點以下四個領域的目前狀態。', x + 34, y + 78, width - 68, 34);
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('最近的你，還好嗎？', x + 34, y + 118);
}

function drawScoreRows(ctx, x, y, width) {
  LDC_AREAS.forEach((area, index) => {
    const rowY = y + index * 54;
    const score = ldcState.scores[area.key] || 0;

    ctx.fillStyle = '#174d8e';
    ctx.font = font(800, 26);
    ctx.textBaseline = 'middle';
    ctx.fillText(area.label, x, rowY + 20);
    ctx.fillText(String(score), x + 72, rowY + 20);

    const barX = x + 118;
    const barW = width - 178;
    const stepW = barW / 6;
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#2f6dad';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX, rowY, barW, 40);
    ctx.strokeRect(barX, rowY, barW, 40);

    for (let step = 1; step <= 6; step += 1) {
      if (step <= score) {
        ctx.fillStyle = '#2563a8';
        ctx.fillRect(barX + (step - 1) * stepW + 3, rowY + 3, stepW - 6, 34);
      }
      if (step < 6) {
        ctx.beginPath();
        ctx.moveTo(barX + step * stepW, rowY);
        ctx.lineTo(barX + step * stepW, rowY + 40);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#315f93';
    ctx.font = font(800, 24);
    ctx.fillText('滿格', x + width - 48, rowY + 20);
  });
}

function drawReflectionCards(ctx, x, y, width, height) {
  const gapX = 34;
  const gapY = 38;
  const cardW = (width - gapX) / 2;
  const cardH = (height - gapY) / 2;

  LDC_AREAS.forEach((area, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const cardX = x + col * (cardW + gapX);
    const cardY = y + row * (cardH + gapY);
    drawReflectionCard(ctx, area, index + 1, cardX, cardY, cardW, cardH);
  });
}

function drawReflectionCard(ctx, area, number, x, y, width, height) {
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.strokeStyle = '#2f6dad';
  ctx.lineWidth = 5;
  roundRectPath(ctx, x, y, width, height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e5e7eb';
  ctx.strokeStyle = '#2f6dad';
  roundRectPath(ctx, x + 28, y - 26, 190, 58, 29);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + 28, y, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2563a8';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#174d8e';
  ctx.font = font(900, 26);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(number), x + 28, y);

  ctx.textAlign = 'left';
  ctx.font = font(800, 30);
  ctx.textBaseline = 'middle';
  ctx.fillText(area.label, x + 92, y + 3);

  const note = (ldcState.notes[area.key] || '').trim();
  ctx.textBaseline = 'top';
  ctx.fillStyle = note ? '#1f2937' : '#94a3b8';
  ctx.font = font(500, 24);
  wrapCanvasText(ctx, note || area.prompt, x + 34, y + 58, width - 68, 38, 6);

  ctx.fillStyle = '#6b7280';
  ctx.font = font(800, 18);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`${Array.from(note).length}/${LDC_MAX_CHARS}`, x + width - 24, y + height - 22);
  ctx.textAlign = 'left';
}

function createSinglePagePdf(imageDataUrl, widthPx, heightPx) {
  const imageBytes = dataUrlToBinary(imageDataUrl);
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const objects = [];

  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  const pageStream = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ`;
  objects.push(`<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n${imageBytes}\nendstream`);
  objects.push(`<< /Length ${pageStream.length} >>\nstream\n${pageStream}\nendstream`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
}

function dataUrlToBinary(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const raw = atob(base64);
  let binary = '';
  for (let i = 0; i < raw.length; i += 1) {
    binary += String.fromCharCode(raw.charCodeAt(i));
  }
  return binary;
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const chars = Array.from(text);
  const lines = [];
  let current = '';

  chars.forEach(char => {
    const next = current + char;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);

  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function font(weight, size) {
  return `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", sans-serif`;
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
