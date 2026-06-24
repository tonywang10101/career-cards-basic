const ODP_MAX_CHARS = 200;
const ODP_STORAGE_KEY = 'career-tools-odyssey-plan';
const ODP_EXPORT_WIDTH = 1754;
const ODP_EXPORT_HEIGHT = 1240;

const ODP_ROUTES = [
  {
    key: 'a',
    short: 'A 計畫',
    label: '第一條路',
    title: 'As usual',
    summary: 'A計畫｜As usual：你目前正做的事，或已經在軌道上的計畫。',
    description: '如果目前的生活繼續發展，或是你將手邊的目標放大，這會是什麼模樣？'
  },
  {
    key: 'b',
    short: 'B 計畫',
    label: '第二條路',
    title: 'Breakthrough',
    summary: 'B計畫｜Breakthrough：如果原本的計畫不可行，你會做的事。',
    description: '假設現在的產業被淘汰、目標突然受阻，或是你想轉換跑道，你會開創出什麼新生活？'
  },
  {
    key: 'c',
    short: 'C 計畫',
    label: '第三條路',
    title: 'Creative & Carefree',
    summary: 'C計畫｜Creative & Carefree：如果金錢與面子都不是問題，你想過的生活。',
    description: '把現實限制暫時放下，讓想像力先跑遠一點，再回頭找可實驗的一小步。'
  }
];

const ODP_GAUGES = [
  { key: 'resources', label: '資源' },
  { key: 'liking', label: '喜歡程度' },
  { key: 'confidence', label: '自信程度' },
  { key: 'coherence', label: '一致性' }
];

let odpActiveRoute = 'a';
let odpState = {};

function initOdysseyPlan() {
  loadOdysseyState();
  renderOdysseyTabs();
  renderOdysseyPlan();
}

function renderOdysseyTabs() {
  const tabs = document.getElementById('odp-tabs');
  if (!tabs) return;

  tabs.innerHTML = '';
  ODP_ROUTES.forEach(route => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'odp-tab';
    button.classList.toggle('is-active', route.key === odpActiveRoute);
    button.textContent = `${route.short}｜${route.title}`;
    button.addEventListener('click', () => {
      odpActiveRoute = route.key;
      renderOdysseyTabs();
      renderOdysseyPlan();
    });
    tabs.appendChild(button);
  });
}

function renderOdysseyPlan() {
  const route = getOdysseyRoute(odpActiveRoute);
  const plan = getActiveOdysseyPlan();

  const titleInput = document.getElementById('odp-plan-title');
  if (titleInput) {
    titleInput.value = plan.name;
    titleInput.oninput = () => {
      plan.name = titleInput.value;
      saveOdysseyState();
    };
  }

  const note = document.getElementById('odp-route-note');
  if (note) note.textContent = `${route.summary} ${route.description}`;

  const summary = document.getElementById('odp-route-summary');
  if (summary) summary.textContent = `${route.label}：${plan.name || route.summary}`;

  renderOdysseyTimeline(plan);
  renderOdysseyGauges(plan);
  renderOdysseyQuestions(plan);
}

function renderOdysseyTimeline(plan) {
  const timeline = document.getElementById('odp-timeline');
  if (!timeline) return;

  timeline.innerHTML = '';
  plan.years.forEach((year, index) => {
    const card = document.createElement('label');
    card.className = 'odp-year-card';

    const yearLabel = document.createElement('span');
    yearLabel.className = 'odp-year-label';

    const yearInput = document.createElement('input');
    yearInput.type = 'text';
    yearInput.inputMode = 'numeric';
    yearInput.maxLength = 4;
    yearInput.value = year;
    yearInput.setAttribute('aria-label', `第 ${index + 1} 格年份`);
    yearInput.addEventListener('input', () => {
      plan.years[index] = yearInput.value;
      saveOdysseyState();
    });
    yearLabel.appendChild(yearInput);

    const suffix = document.createElement('span');
    suffix.textContent = '年';
    yearLabel.appendChild(suffix);
    card.appendChild(yearLabel);

    const textarea = document.createElement('textarea');
    textarea.maxLength = ODP_MAX_CHARS;
    textarea.value = plan.timeline[index] || '';
    textarea.placeholder = `第 ${index + 1} 年：會在哪裡、做什麼、和誰一起、正在累積什麼？`;
    textarea.addEventListener('input', () => {
      plan.timeline[index] = textarea.value;
      updateOdysseyCounter(`timeline-${index}`, textarea.value.length);
      saveOdysseyState();
    });
    card.appendChild(textarea);

    const counter = document.createElement('span');
    counter.className = 'odp-char-count';
    counter.id = `odp-count-timeline-${index}`;
    card.appendChild(counter);
    timeline.appendChild(card);
    updateOdysseyCounter(`timeline-${index}`, textarea.value.length);
  });
}

function renderOdysseyGauges(plan) {
  const grid = document.getElementById('odp-gauge-grid');
  if (!grid) return;

  grid.innerHTML = '';
  ODP_GAUGES.forEach(gauge => {
    const card = document.createElement('div');
    card.className = 'odp-gauge-card';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'odp-gauge';
    button.setAttribute('aria-label', `${gauge.label} ${plan.gauges[gauge.key]} 分`);
    button.addEventListener('click', event => {
      const rect = button.getBoundingClientRect();
      const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      plan.gauges[gauge.key] = Math.round(ratio * 10);
      saveOdysseyState();
      renderOdysseyGauges(plan);
    });

    const face = document.createElement('span');
    face.className = 'odp-gauge-face';
    button.appendChild(face);

    const needle = document.createElement('span');
    needle.className = 'odp-gauge-needle';
    needle.style.transform = `rotate(${gaugeAngle(plan.gauges[gauge.key])}deg)`;
    button.appendChild(needle);

    const hub = document.createElement('span');
    hub.className = 'odp-gauge-hub';
    button.appendChild(hub);

    const scale = document.createElement('div');
    scale.className = 'odp-gauge-scale';
    scale.innerHTML = '<span>0</span><span>5</span><span>10</span>';

    const name = document.createElement('div');
    name.className = 'odp-gauge-name';
    name.textContent = `${gauge.label} ${plan.gauges[gauge.key]}`;

    card.appendChild(button);
    card.appendChild(scale);
    card.appendChild(name);
    grid.appendChild(card);
  });
}

function renderOdysseyQuestions(plan) {
  const list = document.getElementById('odp-question-list');
  if (!list) return;

  list.innerHTML = '';
  plan.questions.forEach((question, index) => {
    const label = document.createElement('label');
    label.className = 'odp-question';

    const qLabel = document.createElement('span');
    qLabel.className = 'odp-question-label';
    qLabel.textContent = `Q${index + 1}`;
    label.appendChild(qLabel);

    const field = document.createElement('span');
    field.className = 'odp-question-field';

    const textarea = document.createElement('textarea');
    textarea.maxLength = ODP_MAX_CHARS;
    textarea.value = question;
    textarea.placeholder = index === 0 ? '這條路最想驗證的假設是什麼？' : index === 1 ? '需要找誰聊聊或做什麼小實驗？' : '最擔心或最好奇的問題是什麼？';
    textarea.addEventListener('input', () => {
      plan.questions[index] = textarea.value;
      updateOdysseyCounter(`question-${index}`, textarea.value.length);
      saveOdysseyState();
    });
    field.appendChild(textarea);

    const counter = document.createElement('span');
    counter.className = 'odp-char-count';
    counter.id = `odp-count-question-${index}`;
    field.appendChild(counter);

    label.appendChild(field);
    list.appendChild(label);
    updateOdysseyCounter(`question-${index}`, textarea.value.length);
  });
}

function updateOdysseyCounter(id, length) {
  const counter = document.getElementById(`odp-count-${id}`);
  if (!counter) return;
  counter.textContent = `${length}/${ODP_MAX_CHARS}`;
  counter.classList.toggle('is-full', length >= ODP_MAX_CHARS);
}

function loadOdysseyState() {
  try {
    odpState = JSON.parse(localStorage.getItem(ODP_STORAGE_KEY) || '{}');
  } catch (error) {
    odpState = {};
  }

  ODP_ROUTES.forEach(route => {
    odpState[route.key] = normalizeOdysseyPlan(odpState[route.key], route);
  });
}

function saveOdysseyState() {
  localStorage.setItem(ODP_STORAGE_KEY, JSON.stringify(odpState));
}

function normalizeOdysseyPlan(plan, route) {
  const fallback = createEmptyOdysseyPlan(route);
  const next = plan || fallback;
  return {
    name: typeof next.name === 'string' ? next.name : fallback.name,
    years: normalizeArray(next.years, fallback.years, 5),
    timeline: normalizeArray(next.timeline, fallback.timeline, 5),
    gauges: {
      resources: Number.isInteger(next.gauges?.resources) ? clamp(next.gauges.resources, 0, 10) : 5,
      liking: Number.isInteger(next.gauges?.liking) ? clamp(next.gauges.liking, 0, 10) : 5,
      confidence: Number.isInteger(next.gauges?.confidence) ? clamp(next.gauges.confidence, 0, 10) : 5,
      coherence: Number.isInteger(next.gauges?.coherence) ? clamp(next.gauges.coherence, 0, 10) : 5
    },
    questions: normalizeArray(next.questions, fallback.questions, 3)
  };
}

function normalizeArray(value, fallback, size) {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length: size }, (_, index) => source[index] || fallback[index] || '');
}

function createEmptyOdysseyPlan(route) {
  return {
    name: route.short,
    years: ['1', '2', '3', '4', '5'],
    timeline: ['', '', '', '', ''],
    gauges: {
      resources: 5,
      liking: 5,
      confidence: 5,
      coherence: 5
    },
    questions: ['', '', '']
  };
}

function getActiveOdysseyPlan() {
  return odpState[odpActiveRoute];
}

function getOdysseyRoute(key) {
  return ODP_ROUTES.find(route => route.key === key) || ODP_ROUTES[0];
}

function resetOdysseyPlan() {
  const route = getOdysseyRoute(odpActiveRoute);
  if (!window.confirm(`要清空「${route.short}」目前內容嗎？`)) return;
  odpState[route.key] = createEmptyOdysseyPlan(route);
  saveOdysseyState();
  renderOdysseyPlan();
  showToast('已清空本路計畫');
}

function downloadOdysseyPng() {
  const canvas = renderOdysseyCanvas(odpActiveRoute);
  const route = getOdysseyRoute(odpActiveRoute);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `odyssey-plan-${route.key}.png`;
  link.click();
  showToast('已下載目前 PNG');
}

function downloadOdysseyPdf() {
  const images = ODP_ROUTES.map(route => {
    const canvas = renderOdysseyCanvas(route.key);
    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width: ODP_EXPORT_WIDTH,
      height: ODP_EXPORT_HEIGHT
    };
  });
  const pdfUrl = createMultiPagePdf(images);
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = 'odyssey-plan-three-routes.pdf';
  link.click();
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
  showToast('已下載三路合併 PDF');
}

function renderOdysseyCanvas(routeKey) {
  const canvas = document.createElement('canvas');
  canvas.width = ODP_EXPORT_WIDTH;
  canvas.height = ODP_EXPORT_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported');
  drawOdysseySheet(ctx, routeKey, ODP_EXPORT_WIDTH, ODP_EXPORT_HEIGHT);
  return canvas;
}

function drawOdysseySheet(ctx, routeKey, width, height) {
  const route = getOdysseyRoute(routeKey);
  const plan = odpState[routeKey];

  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#2563a8';
  ctx.fillRect(0, 0, width, 30);
  ctx.fillRect(0, height - 30, width, 30);

  const padX = 40;
  drawPlanTitle(ctx, padX, 58, 880, 96, plan.name || route.short);
  drawExportBrand(ctx, width - padX - 560, 42);

  ctx.strokeStyle = 'rgba(37, 99, 168, 0.45)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(padX, 204);
  ctx.lineTo(width - padX, 204);
  ctx.stroke();

  drawExportTimeline(ctx, padX, 250, width - padX * 2, 670, plan);
  drawExportRouteSummary(ctx, padX + 28, 972, 760, route, plan);
  drawExportGauges(ctx, padX + 42, 1052, plan);
  drawExportQuestions(ctx, width - padX - 850, 970, 850, plan);
}

function drawPlanTitle(ctx, x, y, width, height, title) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#2563a8';
  ctx.lineWidth = 5;
  roundRectPath(ctx, x, y, width, height, height / 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e5e7eb';
  roundRectPath(ctx, x + 8, y + 8, 220, height - 16, (height - 16) / 2);
  ctx.fill();

  ctx.fillStyle = '#174d8e';
  ctx.font = font(900, 46);
  ctx.textBaseline = 'middle';
  ctx.fillText(title || '計畫', x + 42, y + height / 2);
}

function drawExportBrand(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 12]);
  ctx.beginPath();
  ctx.arc(54, 54, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(54, 50, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1f2937';
  roundRectPath(ctx, 43, 72, 22, 14, 4);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#174d8e';
  ctx.font = font(800, 34);
  ctx.textBaseline = 'top';
  ctx.fillText('自己的生命自己設計', x + 120, y + 2);
  ctx.font = font(900, 58);
  ctx.fillText('奧德賽計畫', x + 120, y + 50);
}

function drawExportTimeline(ctx, x, y, width, height, plan) {
  const colW = width / 5;
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 5;
  ctx.strokeRect(x, y, width, height);

  for (let i = 0; i < 5; i += 1) {
    const colX = x + i * colW;
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(colX, y);
      ctx.lineTo(colX, y + height);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2563a8';
    roundRectPath(ctx, colX + colW / 2 - 70, y - 30, 140, 54, 27);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#174d8e';
    ctx.font = font(900, 28);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${plan.years[i] || i + 1} 年`, colX + colW / 2, y - 3);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = plan.timeline[i]?.trim() ? '#1f2937' : '#94a3b8';
    ctx.font = font(500, 23);
    wrapCanvasText(ctx, plan.timeline[i]?.trim() || `第 ${i + 1} 年的生活、工作、學習與關係。`, colX + 24, y + 48, colW - 48, 36, 15);
  }
  ctx.textAlign = 'left';
}

function drawExportRouteSummary(ctx, x, y, width, route, plan) {
  ctx.fillStyle = '#174d8e';
  ctx.font = font(900, 28);
  ctx.textBaseline = 'top';
  wrapCanvasText(ctx, `${route.label}：${plan.name || route.summary}`, x, y, width, 36, 2);
}

function drawExportGauges(ctx, x, y, plan) {
  ODP_GAUGES.forEach((gauge, index) => {
    drawExportGauge(ctx, x + index * 150, y, plan.gauges[gauge.key], gauge.label);
  });
}

function drawExportGauge(ctx, x, y, value, label) {
  ctx.save();
  ctx.translate(x + 58, y + 64);
  [
    ['#ef4444', Math.PI, Math.PI * 1.25],
    ['#f59e0b', Math.PI * 1.25, Math.PI * 1.7],
    ['#22c55e', Math.PI * 1.7, Math.PI * 2]
  ].forEach(([color, start, end]) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 58, start, end);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  });
  ctx.beginPath();
  ctx.arc(0, 0, 34, Math.PI, Math.PI * 2);
  ctx.lineTo(34, 0);
  ctx.lineTo(-34, 0);
  ctx.closePath();
  ctx.fillStyle = '#fffdf8';
  ctx.fill();
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 58, Math.PI, Math.PI * 2);
  ctx.stroke();
  const needle = gaugeAngle(value) * Math.PI / 180;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.sin(needle) * 46, -Math.cos(needle) * 46);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#1f2937';
  ctx.font = font(800, 16);
  ctx.textAlign = 'center';
  ctx.fillText('0', x + 4, y + 78);
  ctx.fillText('5', x + 58, y + 22);
  ctx.fillText('10', x + 112, y + 78);
  ctx.font = font(900, 20);
  ctx.fillText(`${label} ${value}`, x + 58, y + 112);
  ctx.textAlign = 'left';
}

function drawExportQuestions(ctx, x, y, width, plan) {
  plan.questions.forEach((question, index) => {
    const rowY = y + index * 70;
    ctx.fillStyle = '#e5e7eb';
    roundRectPath(ctx, x, rowY, 120, 54, 27);
    ctx.fill();
    ctx.fillStyle = '#174d8e';
    ctx.font = font(900, 28);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Q${index + 1}`, x + 60, rowY + 27);
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#a78787';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 132, rowY + 42);
    ctx.lineTo(x + width, rowY + 42);
    ctx.stroke();

    ctx.fillStyle = question.trim() ? '#1f2937' : '#94a3b8';
    ctx.font = font(500, 22);
    ctx.textBaseline = 'top';
    wrapCanvasText(ctx, question.trim() || `疑問 ${index + 1}`, x + 144, rowY + 4, width - 160, 30, 2);
  });
}

function gaugeAngle(value) {
  return -72 + clamp(value, 0, 10) * 14.4;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createMultiPagePdf(images) {
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>'];
  const pageObjectIds = [];

  images.forEach((image, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    pageObjectIds.push(`${pageId} 0 R`);

    const imageBytes = dataUrlToBinary(image.dataUrl);
    const pageStream = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im${index} Do\nQ`;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im${index} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n${imageBytes}\nendstream`);
    objects.push(`<< /Length ${pageStream.length} >>\nstream\n${pageStream}\nendstream`);
  });

  objects.splice(1, 0, `<< /Type /Pages /Kids [${pageObjectIds.join(' ')}] /Count ${images.length} >>`);

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
