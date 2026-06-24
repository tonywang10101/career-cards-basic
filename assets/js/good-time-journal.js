const GTJ_ROW_COUNT = 4;
const GTJ_MAX_CHARS = 200;
const GTJ_STORAGE_KEY = 'career-tools-good-time-journal';
const GTJ_EXPORT_WIDTH = 1754;
const GTJ_EXPORT_HEIGHT = 1240;

let gtjDate = '';
let gtjState = {
  rows: []
};

function initGoodTimeJournal() {
  const dateInput = document.getElementById('gtj-date');
  if (!dateInput) return;

  gtjDate = getLocalDateString();
  dateInput.value = gtjDate;
  dateInput.addEventListener('change', () => {
    gtjDate = dateInput.value || getLocalDateString();
    dateInput.value = gtjDate;
    loadGoodTimeState();
    renderGoodTimeJournal();
  });

  loadGoodTimeState();
  renderGoodTimeJournal();
}

function renderGoodTimeJournal() {
  const dateLabel = document.getElementById('gtj-display-date');
  if (dateLabel) dateLabel.textContent = formatDisplayDate(gtjDate);

  const rowList = document.getElementById('gtj-row-list');
  if (!rowList) return;

  rowList.innerHTML = '';
  gtjState.rows.forEach((row, index) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'gtj-row';
    rowEl.dataset.rowLabel = `第 ${index + 1} 段活動`;

    rowEl.appendChild(createGoodTimeEntry(index, 'good', '投入 / 精力充沛', '寫下讓你投入、好奇、感到有能量的活動或片刻。'));
    rowEl.appendChild(createGaugePair(index, row));
    rowEl.appendChild(createGoodTimeEntry(index, 'bad', '無法投入 / 精疲力竭', '寫下讓你分心、卡住、疲憊或想逃離的活動或片刻。'));

    rowList.appendChild(rowEl);
  });
}

function createGoodTimeEntry(rowIndex, key, label, placeholder) {
  const field = document.createElement('label');
  field.className = 'gtj-entry';
  field.dataset.label = label;

  const textarea = document.createElement('textarea');
  textarea.maxLength = GTJ_MAX_CHARS;
  textarea.value = gtjState.rows[rowIndex][key] || '';
  textarea.placeholder = placeholder;
  textarea.addEventListener('input', () => {
    gtjState.rows[rowIndex][key] = textarea.value;
    updateGoodTimeCounter(rowIndex, key, textarea.value.length);
    saveGoodTimeState();
  });
  field.appendChild(textarea);

  const counter = document.createElement('span');
  counter.className = 'gtj-char-count';
  counter.id = `gtj-count-${rowIndex}-${key}`;
  field.appendChild(counter);

  updateGoodTimeCounter(rowIndex, key, textarea.value.length);
  return field;
}

function createGaugePair(rowIndex, row) {
  const wrap = document.createElement('div');
  wrap.className = 'gtj-gauge-pair';
  wrap.appendChild(createGauge(rowIndex, 'engagement', row.engagement, '投入度', '低', '心流'));
  wrap.appendChild(createGauge(rowIndex, 'energy', row.energy, '能量', '低', '高'));
  return wrap;
}

function createGauge(rowIndex, key, value, label, lowLabel, highLabel) {
  const card = document.createElement('div');
  card.className = 'gtj-gauge-card';

  const gauge = document.createElement('button');
  gauge.type = 'button';
  gauge.className = 'gtj-gauge';
  gauge.setAttribute('aria-label', `${label} ${value}`);
  gauge.addEventListener('click', event => {
    const rect = gauge.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    setGoodTimeGauge(rowIndex, key, Math.round(ratio * 4));
  });

  const face = document.createElement('span');
  face.className = 'gtj-gauge-face';
  gauge.appendChild(face);

  // for (let i = 0; i < 5; i += 1) {
  //   const tick = document.createElement('span');
  //   tick.className = 'gtj-gauge-tick';
  //   tick.style.transform = `rotate(${-72 + i * 36}deg)`;
  //   gauge.appendChild(tick);
  // }

  const needle = document.createElement('span');
  needle.className = 'gtj-gauge-needle';
  needle.style.transform = `rotate(${gaugeAngle(value)}deg)`;
  gauge.appendChild(needle);

  const hub = document.createElement('span');
  hub.className = 'gtj-gauge-hub';
  gauge.appendChild(hub);

  const scale = document.createElement('div');
  scale.className = 'gtj-gauge-label';
  scale.innerHTML = `<span>${lowLabel}</span><span>${highLabel}</span>`;

  const name = document.createElement('div');
  name.className = 'gtj-gauge-name';
  name.textContent = `${label} ${value}`;

  card.appendChild(gauge);
  card.appendChild(scale);
  card.appendChild(name);
  return card;
}

function setGoodTimeGauge(rowIndex, key, value) {
  gtjState.rows[rowIndex][key] = value;
  saveGoodTimeState();
  renderGoodTimeJournal();
}

function updateGoodTimeCounter(rowIndex, key, length) {
  const counter = document.getElementById(`gtj-count-${rowIndex}-${key}`);
  if (!counter) return;
  counter.textContent = `${length}/${GTJ_MAX_CHARS}`;
  counter.classList.toggle('is-full', length >= GTJ_MAX_CHARS);
}

function loadGoodTimeState() {
  let allEntries = {};
  try {
    allEntries = JSON.parse(localStorage.getItem(GTJ_STORAGE_KEY) || '{}');
  } catch (error) {
    allEntries = {};
  }

  gtjState = allEntries[gtjDate] || createEmptyGoodTimeState();
  normalizeGoodTimeState();
}

function saveGoodTimeState() {
  let allEntries = {};
  try {
    allEntries = JSON.parse(localStorage.getItem(GTJ_STORAGE_KEY) || '{}');
  } catch (error) {
    allEntries = {};
  }

  allEntries[gtjDate] = gtjState;
  localStorage.setItem(GTJ_STORAGE_KEY, JSON.stringify(allEntries));
}

function createEmptyGoodTimeState() {
  return {
    rows: Array.from({ length: GTJ_ROW_COUNT }, () => ({
      good: '',
      bad: '',
      engagement: 2,
      energy: 2
    }))
  };
}

function normalizeGoodTimeState() {
  if (!Array.isArray(gtjState.rows)) gtjState.rows = [];
  while (gtjState.rows.length < GTJ_ROW_COUNT) {
    gtjState.rows.push({ good: '', bad: '', engagement: 2, energy: 2 });
  }
  gtjState.rows = gtjState.rows.slice(0, GTJ_ROW_COUNT).map(row => ({
    good: row.good || '',
    bad: row.bad || '',
    engagement: Number.isInteger(row.engagement) ? clamp(row.engagement, 0, 4) : 2,
    energy: Number.isInteger(row.energy) ? clamp(row.energy, 0, 4) : 2
  }));
}

function resetGoodTimeJournal() {
  const hasContent = gtjState.rows.some(row => {
    return row.good.trim() || row.bad.trim() || row.engagement !== 2 || row.energy !== 2;
  });
  if (!hasContent) return;
  if (!window.confirm(`要清空 ${formatDisplayDate(gtjDate)} 的好時光日記嗎？`)) return;

  gtjState = createEmptyGoodTimeState();
  saveGoodTimeState();
  renderGoodTimeJournal();
  showToast('已清空好時光日記');
}

function downloadGoodTimePng() {
  const canvas = renderGoodTimeCanvas();
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `good-time-journal-${gtjDate}.png`;
  link.click();
  showToast('已下載 PNG');
}

function downloadGoodTimePdf() {
  const canvas = renderGoodTimeCanvas();
  const jpeg = canvas.toDataURL('image/jpeg', 0.92);
  const pdfUrl = createSinglePagePdf(jpeg, GTJ_EXPORT_WIDTH, GTJ_EXPORT_HEIGHT);
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = `good-time-journal-${gtjDate}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
  showToast('已下載 PDF');
}

function renderGoodTimeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = GTJ_EXPORT_WIDTH;
  canvas.height = GTJ_EXPORT_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported');
  drawGoodTimeSheet(ctx, GTJ_EXPORT_WIDTH, GTJ_EXPORT_HEIGHT);
  return canvas;
}

function drawGoodTimeSheet(ctx, width, height) {
  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#2563a8';
  ctx.fillRect(0, 0, width, 30);
  ctx.fillRect(0, height - 30, width, 30);

  const padX = 92;
  drawDiaryIcon(ctx, padX + 600, 42);

  ctx.fillStyle = '#174d8e';
  ctx.textBaseline = 'top';
  ctx.font = font(800, 38);
  ctx.fillText('找出自己的路', padX + 720, 46);
  ctx.font = font(800, 72);
  ctx.fillText('好時光日記', padX + 720, 98);

  ctx.fillStyle = '#2563a8';
  roundRectPath(ctx, width - padX - 220, 66, 220, 66, 33);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = font(800, 28);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatDisplayDate(gtjDate), width - padX - 110, 99);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(37, 99, 168, 0.45)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(padX, 214);
  ctx.lineTo(width - padX, 214);
  ctx.stroke();

  drawPill(ctx, padX + 150, 248, 310, 60, '投入 / 精力充沛');
  drawPill(ctx, width - padX - 460, 248, 350, 60, '無法投入 / 精疲力竭');

  const startY = 336;
  const rowH = 196;
  gtjState.rows.forEach((row, index) => {
    const y = startY + index * rowH;
    drawTextBox(ctx, padX, y, 600, 160, row.good, '投入 / 精力充沛');
    drawExportGaugePair(ctx, padX + 635, y + 18, row.engagement, row.energy);
    drawTextBox(ctx, width - padX - 600, y, 600, 160, row.bad, '無法投入 / 精疲力竭');
  });
}

function drawDiaryIcon(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#eab308';
  roundRectPath(ctx, x, y + 4, 80, 116, 12);
  ctx.fill();
  ctx.fillStyle = '#6fa8dc';
  roundRectPath(ctx, x + 14, y, 76, 120, 12);
  ctx.fill();
  ctx.strokeStyle = '#315f93';
  ctx.lineWidth = 6;
  roundRectPath(ctx, x + 14, y, 76, 120, 12);
  ctx.stroke();
  ctx.fillStyle = '#1f3f6f';
  ctx.font = font(900, 18);
  ctx.fillText('DIARY', x + 24, y + 16);
  ['#facc15', '#ffffff', '#ef4444'].forEach((color, index) => {
    ctx.fillStyle = color;
    roundRectPath(ctx, x + 30, y + 48 + index * 20, 44 - index * 4, 9, 5);
    ctx.fill();
  });
  ctx.restore();
}

function drawPill(ctx, x, y, width, height, text) {
  ctx.fillStyle = '#2563a8';
  roundRectPath(ctx, x, y, width, height, height / 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = font(800, 30);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + width / 2, y + height / 2);
  ctx.textAlign = 'left';
}

function drawTextBox(ctx, x, y, width, height, text, fallback) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.strokeStyle = '#7f9bd1';
  ctx.lineWidth = 5;
  roundRectPath(ctx, x, y, width, height, 24);
  ctx.fill();
  ctx.stroke();

  const value = text.trim();
  ctx.fillStyle = value ? '#1f2937' : '#94a3b8';
  ctx.font = font(500, 24);
  ctx.textBaseline = 'top';
  wrapCanvasText(ctx, value || fallback, x + 28, y + 24, width - 56, 36, 4);

  ctx.fillStyle = '#6b7280';
  ctx.font = font(800, 17);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`${Array.from(value).length}/${GTJ_MAX_CHARS}`, x + width - 20, y + height - 18);
  ctx.textAlign = 'left';
}

function drawExportGaugePair(ctx, x, y, engagement, energy) {
  drawExportGauge(ctx, x, y, engagement, '投入度', '低', '心流');
  drawExportGauge(ctx, x + 146, y, energy, '能量', '低', '高');
}

function drawExportGauge(ctx, x, y, value, label, lowLabel, highLabel) {
  ctx.save();
  ctx.translate(x + 62, y + 68);

  ctx.beginPath();
  ctx.arc(0, 0, 58, Math.PI, Math.PI * 2);
  ctx.lineTo(58, 0);
  ctx.lineTo(-58, 0);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  [
    ['#ef4444', Math.PI, Math.PI * 1.22],
    ['#f59e0b', Math.PI * 1.22, Math.PI * 1.78],
    ['#22c55e', Math.PI * 1.78, Math.PI * 2]
  ].forEach(([color, start, end]) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 58, start, end);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  });

  ctx.beginPath();
  ctx.arc(0, 0, 35, Math.PI, Math.PI * 2);
  ctx.lineTo(35, 0);
  ctx.lineTo(-35, 0);
  ctx.closePath();
  ctx.fillStyle = '#fffdf8';
  ctx.fill();

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 58, Math.PI, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 5; i += 1) {
    const angle = (-72 + i * 36) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(Math.sin(angle) * 46, -Math.cos(angle) * 46);
    ctx.lineTo(Math.sin(angle) * 56, -Math.cos(angle) * 56);
    ctx.stroke();
  }

  const needle = gaugeAngle(value) * Math.PI / 180;
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.sin(needle) * 46, -Math.cos(needle) * 46);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#1f2937';
  ctx.font = font(800, 17);
  ctx.textAlign = 'center';
  ctx.fillText(lowLabel, x + 8, y + 82);
  ctx.fillText(highLabel, x + 116, y + 82);
  ctx.font = font(900, 22);
  ctx.fillText(`${label} ${value}`, x + 62, y + 118);
  ctx.textAlign = 'left';
}

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${year}/${month}/${day}`;
}

function gaugeAngle(value) {
  return -72 + clamp(value, 0, 4) * 36;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
