const AA_STORAGE_KEY = 'career-tools-adult-attachment';
const AA_EXPORT_WIDTH = 1240;
const AA_EXPORT_HEIGHT = 1754;

const AA_SCALE = [
  '非常不符合',
  '不符合',
  '有點不符合',
  '有點符合',
  '符合',
  '非常符合'
];

const AA_STYLES = {
  secure: {
    label: '安全依附',
    short: '安全',
    color: '#2f80b7',
    items: [2, 13, 19, 21, 23, 24],
    summary: '你較能在親密與自主之間保持彈性，通常相信自己值得被接納，也較能相信重要他人會回應你。',
    reflection: '可以留意的是：當關係進入壓力或衝突時，你如何維持開放溝通，同時也照顧自己的界線。'
  },
  anxious: {
    label: '焦慮依附',
    short: '焦慮',
    color: '#b44a62',
    items: [7, 9, 12, 16, 18, 20],
    summary: '你可能很重視關係中的回應與確認，當對方距離變遠或訊號不清楚時，容易擔心自己不夠被在乎。',
    reflection: '可以練習把「需要被確認」說得更具體，也區分當下事實與內在擔心，讓關係需求比較容易被理解。'
  },
  avoidant: {
    label: '逃避依附',
    short: '逃避',
    color: '#15847b',
    items: [1, 4, 6, 11, 14, 15],
    summary: '你可能渴望連結，但在靠近、信任或依賴他人時感到不安，擔心受傷，因此會在親密關係中保持防備。',
    reflection: '可以先從低風險的分享開始，辨認哪些界線是保護，哪些界線其實讓自己更孤單。'
  },
  dismissing: {
    label: '排除依附',
    short: '排除',
    color: '#b7791f',
    items: [3, 5, 8, 10, 17, 22],
    summary: '你可能很重視獨立、自主與不麻煩別人，傾向把需求收回自己身上，並用距離維持穩定感。',
    reflection: '可以觀察自己何時把「我可以自己來」用成了習慣性的隔離，並嘗試在可控範圍內接受支持。'
  }
};

const AA_QUESTIONS = [
  '和別人親近會讓我覺得不舒服',
  '我發現自己很容易和別人親近',
  '即使沒有任何親近的情感關係我仍過得很自在',
  '我想要情感上的親密關係，但卻很難完全信賴別人',
  '對我來說，獨立和自給自足的感覺是非常重要的',
  '我擔心如果和別人太親近會容易受到傷害',
  '我會擔心別人並不那麼想跟我在一起',
  '我不喜歡依賴別人',
  '我會擔心別人不如我看重他們那樣的看重我',
  '我不會擔心自己孤單一人',
  '當別人太親近我時，會讓我感覺不自在',
  '我會擔心別人並不真正喜歡我',
  '我很少擔心別人不接納我',
  '我寧可和別人保持距離以避免失望',
  '當別人想要和我更親近時，我會感到不安焦慮',
  '我對自己不滿意',
  '通常我寧可自己一個人比較自由',
  '我發現自己一直在尋求別人的接納並藉以肯定自己',
  '我瞭解自己的優點與缺點，並且喜歡自己',
  '我時常太過於在乎別人對我的看法',
  '我可以很自在的讓別人依賴我',
  '一個人的生活就可以過得很好了',
  '即使別人不欣賞我，我仍然能肯定自己的價值',
  '當我需要朋友的時候，總會找得到人的'
];

let aaAnswers = {};
let aaLatestResult = null;

function initAdultAttachment() {
  loadAdultAttachment();
  renderAdultAttachmentQuestions();
  renderAdultAttachmentChart();
  renderAdultAttachmentScores();
  updateAdultAttachmentPdfButton();
}

function renderAdultAttachmentQuestions() {
  const form = document.getElementById('attachment-form');
  if (!form) return;

  form.innerHTML = '';
  AA_QUESTIONS.forEach((question, questionIndex) => {
    const number = questionIndex + 1;
    const row = document.createElement('fieldset');
    row.className = 'attachment-question';
    row.id = `attachment-question-${number}`;

    const legend = document.createElement('legend');
    legend.className = 'attachment-question-text';
    legend.innerHTML = `<span class="attachment-question-number">${number}.</span><span>${question}</span>`;
    row.appendChild(legend);

    AA_SCALE.forEach((label, scaleIndex) => {
      const value = scaleIndex + 1;
      const choice = document.createElement('label');
      choice.className = 'attachment-choice';
      choice.dataset.label = label;

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `aa-q-${number}`;
      input.value = String(value);
      input.checked = aaAnswers[number] === value;
      input.addEventListener('change', () => {
        aaAnswers[number] = value;
        clearAdultAttachmentResult();
        row.classList.remove('is-missing');
        saveAdultAttachment();
      });

      const dot = document.createElement('span');
      dot.setAttribute('aria-hidden', 'true');

      choice.appendChild(input);
      choice.appendChild(dot);
      row.appendChild(choice);
    });

    form.appendChild(row);
  });
}

function submitAdultAttachment() {
  const missing = AA_QUESTIONS
    .map((_, index) => index + 1)
    .filter(number => !aaAnswers[number]);

  document.querySelectorAll('.attachment-question').forEach(row => row.classList.remove('is-missing'));

  if (missing.length > 0) {
    missing.forEach(number => {
      const row = document.getElementById(`attachment-question-${number}`);
      if (row) row.classList.add('is-missing');
    });
    const firstMissing = document.getElementById(`attachment-question-${missing[0]}`);
    if (firstMissing) firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`還有 ${missing.length} 題未作答`);
    return;
  }

  aaLatestResult = calculateAdultAttachment();
  saveAdultAttachment();
  renderAdultAttachmentChart(aaLatestResult.scores);
  renderAdultAttachmentScores(aaLatestResult.scores);
  renderAdultAttachmentReport(aaLatestResult);
  updateAdultAttachmentPdfButton();
  showToast('已生成成人依附報告');
}

function calculateAdultAttachment() {
  const scores = {};

  Object.entries(AA_STYLES).forEach(([key, style]) => {
    const raw = style.items.reduce((sum, itemNumber) => sum + aaAnswers[itemNumber], 0);
    scores[key] = Math.round(((raw - style.items.length) / (style.items.length * 5)) * 50);
  });

  const primaryKey = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
  return { scores, primaryKey };
}

function renderAdultAttachmentChart(scores = emptyAdultAttachmentScores()) {
  const svg = document.getElementById('attachment-chart');
  if (!svg) return;

  const center = 210;
  const radius = 150;
  const axes = [
    { key: 'anxious', label: '焦慮依附', x: 0, y: -1, textX: 210, textY: 34, anchor: 'middle' },
    { key: 'secure', label: '安全依附', x: 1, y: 0, textX: 370, textY: 216, anchor: 'start' },
    { key: 'dismissing', label: '排除依附', x: 0, y: 1, textX: 210, textY: 392, anchor: 'middle' },
    { key: 'avoidant', label: '逃避依附', x: -1, y: 0, textX: 50, textY: 216, anchor: 'end' }
  ];

  const rings = [10, 20, 30, 40, 50];
  const points = axes.map(axis => {
    const distance = (scores[axis.key] / 50) * radius;
    return `${center + axis.x * distance},${center + axis.y * distance}`;
  }).join(' ');

  svg.innerHTML = '';

  rings.forEach(value => {
    const r = (value / 50) * radius;
    svg.appendChild(svgEl('polygon', {
      points: `${center},${center - r} ${center + r},${center} ${center},${center + r} ${center - r},${center}`,
      fill: 'none',
      stroke: value === 50 ? '#3f3f46' : '#b8bec8',
      'stroke-width': value === 50 ? 2 : 1.5
    }));
  });

  axes.forEach(axis => {
    svg.appendChild(svgEl('line', {
      x1: center,
      y1: center,
      x2: center + axis.x * (radius + 12),
      y2: center + axis.y * (radius + 12),
      stroke: '#717784',
      'stroke-width': 1.5
    }));
  });

  svg.appendChild(svgEl('polygon', {
    points,
    fill: 'rgba(47, 128, 183, .35)',
    stroke: '#2f80b7',
    'stroke-width': 4,
    'stroke-linejoin': 'round'
  }));

  axes.forEach(axis => {
    const distance = (scores[axis.key] / 50) * radius;
    svg.appendChild(svgEl('circle', {
      cx: center + axis.x * distance,
      cy: center + axis.y * distance,
      r: 6,
      fill: AA_STYLES[axis.key].color
    }));

    const label = svgEl('text', {
      x: axis.textX,
      y: axis.textY,
      'text-anchor': axis.anchor,
      fill: '#3f3f46',
      'font-size': 18,
      'font-weight': 700
    });
    label.textContent = axis.label;
    svg.appendChild(label);
  });

  [0, 10, 20, 30, 40, 50].forEach(value => {
    const text = svgEl('text', {
      x: center + (value / 50) * radius,
      y: center + 28,
      'text-anchor': 'middle',
      fill: '#555b66',
      'font-size': 18
    });
    text.textContent = String(value);
    svg.appendChild(text);
  });
}

function renderAdultAttachmentScores(scores = emptyAdultAttachmentScores()) {
  const grid = document.getElementById('attachment-score-grid');
  if (!grid) return;

  grid.innerHTML = '';
  ['secure', 'anxious', 'avoidant', 'dismissing'].forEach(key => {
    const card = document.createElement('div');
    card.className = 'attachment-score-card';
    card.innerHTML = `<strong>${AA_STYLES[key].label}</strong><span><b>${scores[key]}</b> / 50</span>`;
    grid.appendChild(card);
  });
}

function renderAdultAttachmentReport(result) {
  const body = document.getElementById('attachment-report-body');
  if (!body) return;

  const primary = AA_STYLES[result.primaryKey];
  const sorted = Object.keys(result.scores).sort((a, b) => result.scores[b] - result.scores[a]);
  const topLine = sorted.map(key => `${AA_STYLES[key].short} ${result.scores[key]}`).join('、');

  body.innerHTML = `
    <h4>主要傾向：${primary.label}</h4>
    <p>${primary.summary}</p>
    <p>${primary.reflection}</p>
    <ul class="attachment-report-list">
      <li>四類型分數：${topLine}。</li>
      <li>分數接近時，代表你可能會依情境、對象或壓力程度展現不同依附策略。</li>
      <li>Bartholomew 與 Horowitz 的四類型可理解為自我觀與他人觀的組合：安全較偏正向自我與正向他人；焦慮較在乎接納與關係確認；逃避常同時渴望靠近又害怕受傷；排除則較強調獨立與情感距離。</li>
    </ul>
    <p class="attachment-note">量表分數的解釋偏向教育性質，而非臨床診斷。我們希望問卷的這些解釋可以幫助你對自己有更多的認識；若有疑問，請諮詢相關專業人員。</p>
  `;
}

function emptyAdultAttachmentScores() {
  return { secure: 0, anxious: 0, avoidant: 0, dismissing: 0 };
}

function resetAdultAttachment() {
  if (Object.keys(aaAnswers).length === 0 && !aaLatestResult) return;
  if (!window.confirm('要清空目前的成人依附風格檢測內容嗎？')) return;

  aaAnswers = {};
  aaLatestResult = null;
  localStorage.removeItem(AA_STORAGE_KEY);
  renderAdultAttachmentQuestions();
  renderAdultAttachmentChart();
  renderAdultAttachmentScores();
  updateAdultAttachmentPdfButton();

  const body = document.getElementById('attachment-report-body');
  renderAdultAttachmentEmptyReport(body);

  showToast('已清空成人依附檢測');
}

function loadAdultAttachment() {
  try {
    const saved = JSON.parse(localStorage.getItem(AA_STORAGE_KEY) || '{}');
    aaAnswers = saved.answers || {};
    aaLatestResult = saved.latestResult || null;
  } catch (error) {
    aaAnswers = {};
    aaLatestResult = null;
  }

  if (aaLatestResult) {
    requestAnimationFrame(() => {
      renderAdultAttachmentChart(aaLatestResult.scores);
      renderAdultAttachmentScores(aaLatestResult.scores);
      renderAdultAttachmentReport(aaLatestResult);
      updateAdultAttachmentPdfButton();
    });
  }
}

function saveAdultAttachment() {
  localStorage.setItem(AA_STORAGE_KEY, JSON.stringify({
    answers: aaAnswers,
    latestResult: aaLatestResult
  }));
}

function svgEl(tag, attrs) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function updateAdultAttachmentPdfButton() {
  const button = document.getElementById('attachment-pdf-btn');
  if (!button) return;
  button.disabled = !aaLatestResult;
  button.title = aaLatestResult ? '下載 A4 PDF 報告' : '請先生成報告';
}

function clearAdultAttachmentResult() {
  if (!aaLatestResult) return;

  aaLatestResult = null;
  renderAdultAttachmentChart();
  renderAdultAttachmentScores();
  renderAdultAttachmentEmptyReport();
  updateAdultAttachmentPdfButton();
}

function renderAdultAttachmentEmptyReport(body = document.getElementById('attachment-report-body')) {
  if (!body) return;

  body.innerHTML = `
    <p>完成 24 題後，這裡會整理你的主要依附傾向、四類型分數與可思考的關係線索。</p>
    <p class="attachment-note">量表分數的解釋偏向教育性質，而非臨床診斷。我們希望問卷的這些解釋可以幫助你對自己有更多的認識；若有疑問，請諮詢相關專業人員。</p>
  `;
}

function downloadAdultAttachmentPdf() {
  if (!aaLatestResult) {
    showToast('請先生成報告後再下載 PDF');
    updateAdultAttachmentPdfButton();
    return;
  }

  const canvas = renderAdultAttachmentPdfCanvas();
  const jpeg = canvas.toDataURL('image/jpeg', 0.92);
  const pdfUrl = createAdultAttachmentPdf(jpeg, AA_EXPORT_WIDTH, AA_EXPORT_HEIGHT);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = pdfUrl;
  link.download = `adult-attachment-report-${stamp}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
  showToast('已下載 PDF');
}

function renderAdultAttachmentPdfCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = AA_EXPORT_WIDTH;
  canvas.height = AA_EXPORT_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported');

  drawAdultAttachmentPdf(ctx, AA_EXPORT_WIDTH, AA_EXPORT_HEIGHT);
  return canvas;
}

function drawAdultAttachmentPdf(ctx, width, height) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const pad = 72;
  const top = 70;
  const report = buildAdultAttachmentReportText(aaLatestResult);

  ctx.fillStyle = '#243044';
  ctx.font = aaFont(800, 34);
  ctx.textBaseline = 'top';
  ctx.fillText('成人依附風格檢測報告', pad, top);

  ctx.fillStyle = '#667085';
  ctx.font = aaFont(500, 17);
  ctx.fillText(`產生日期：${new Date().toLocaleDateString('zh-TW')}`, width - pad - 190, top + 10);

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, top + 64);
  ctx.lineTo(width - pad, top + 64);
  ctx.stroke();

  drawAdultAttachmentPdfChart(ctx, pad + 18, top + 100, 430, aaLatestResult.scores);
  drawAdultAttachmentPdfReport(ctx, pad + 505, top + 100, width - pad * 2 - 505, report);

  const dividerY = 875;
  ctx.strokeStyle = '#d8dde8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, dividerY);
  ctx.lineTo(width - pad, dividerY);
  ctx.stroke();

  drawAdultAttachmentPdfAnswers(ctx, pad, dividerY + 34, width - pad * 2);
}

function buildAdultAttachmentReportText(result) {
  const primary = AA_STYLES[result.primaryKey];
  const sorted = Object.keys(result.scores).sort((a, b) => result.scores[b] - result.scores[a]);
  const topLine = sorted.map(key => `${AA_STYLES[key].short} ${result.scores[key]}`).join('、');

  return {
    title: `主要傾向：${primary.label}`,
    paragraphs: [
      primary.summary,
      primary.reflection,
      `四類型分數：${topLine}。`,
      '分數接近時，代表你可能會依情境、對象或壓力程度展現不同依附策略。',
      '量表分數的解釋偏向教育性質，而非臨床診斷。我們希望問卷的這些解釋可以幫助你對自己有更多的認識；若有疑問，請諮詢相關專業人員。'
    ]
  };
}

function drawAdultAttachmentPdfChart(ctx, x, y, size, scores) {
  const centerX = x + size / 2;
  const centerY = y + size / 2 + 8;
  const radius = size * 0.34;
  const axes = [
    { key: 'anxious', label: '焦慮依附', x: 0, y: -1, labelX: centerX, labelY: centerY - radius - 48, align: 'center' },
    { key: 'secure', label: '安全依附', x: 1, y: 0, labelX: centerX + radius + 62, labelY: centerY - 11, align: 'center' },
    { key: 'dismissing', label: '排除依附', x: 0, y: 1, labelX: centerX, labelY: centerY + radius + 30, align: 'center' },
    { key: 'avoidant', label: '逃避依附', x: -1, y: 0, labelX: centerX - radius - 62, labelY: centerY - 11, align: 'center' }
  ];

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d8dde8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, x, y, size, size + 82, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#243044';
  ctx.font = aaFont(800, 22);
  ctx.fillText('結果四個象限', x + 26, y + 24);

  [10, 20, 30, 40, 50].forEach(value => {
    const r = (value / 50) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - r);
    ctx.lineTo(centerX + r, centerY);
    ctx.lineTo(centerX, centerY + r);
    ctx.lineTo(centerX - r, centerY);
    ctx.closePath();
    ctx.strokeStyle = value === 50 ? '#3f3f46' : '#b8bec8';
    ctx.lineWidth = value === 50 ? 2.5 : 1.5;
    ctx.stroke();
  });

  axes.forEach(axis => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + axis.x * (radius + 14), centerY + axis.y * (radius + 14));
    ctx.strokeStyle = '#717784';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  const points = axes.map(axis => ({
    x: centerX + axis.x * ((scores[axis.key] / 50) * radius),
    y: centerY + axis.y * ((scores[axis.key] / 50) * radius),
    key: axis.key
  }));

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(47, 128, 183, .32)';
  ctx.strokeStyle = '#2f80b7';
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();

  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = AA_STYLES[point.key].color;
    ctx.fill();
  });

  ctx.fillStyle = '#3f3f46';
  ctx.font = aaFont(800, 18);
  ctx.textAlign = 'center';
  axes.forEach(axis => ctx.fillText(axis.label, axis.labelX, axis.labelY));

  ctx.fillStyle = '#555b66';
  ctx.font = aaFont(500, 16);
  [0, 10, 20, 30, 40, 50].forEach(value => {
    ctx.fillText(String(value), centerX + (value / 50) * radius, centerY + 28);
  });

  const scoreY = y + size + 28;
  const labels = ['secure', 'anxious', 'avoidant', 'dismissing'];
  labels.forEach((key, index) => {
    const colX = x + 26 + (index % 2) * 188;
    const rowY = scoreY + Math.floor(index / 2) * 34;
    ctx.fillStyle = AA_STYLES[key].color;
    ctx.font = aaFont(800, 17);
    ctx.fillText(`${AA_STYLES[key].label} ${scores[key]}/50`, colX + 72, rowY);
  });

  ctx.restore();
}

function drawAdultAttachmentPdfReport(ctx, x, y, width, report) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d8dde8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, x, y, width, 520, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#243044';
  ctx.font = aaFont(800, 25);
  ctx.fillText(report.title, x + 26, y + 26);

  let cursorY = y + 72;
  report.paragraphs.forEach((paragraph, index) => {
    ctx.fillStyle = index === report.paragraphs.length - 1 ? '#4b5563' : '#243044';
    ctx.font = aaFont(index === report.paragraphs.length - 1 ? 600 : 500, index === report.paragraphs.length - 1 ? 17 : 19);
    cursorY = wrapCanvasText(ctx, paragraph, x + 26, cursorY, width - 52, index === report.paragraphs.length - 1 ? 27 : 31);
    cursorY += index === report.paragraphs.length - 1 ? 8 : 15;
  });

  ctx.restore();
}

function drawAdultAttachmentPdfAnswers(ctx, x, y, width) {
  ctx.fillStyle = '#243044';
  ctx.font = aaFont(800, 25);
  ctx.fillText('答題紀錄', x, y);

  const colGap = 34;
  const colWidth = (width - colGap) / 2;
  const rowHeight = 50;
  const startY = y + 46;

  AA_QUESTIONS.forEach((question, index) => {
    const col = index < 12 ? 0 : 1;
    const row = index % 12;
    const rowX = x + col * (colWidth + colGap);
    const rowY = startY + row * rowHeight;
    const number = index + 1;
    const answer = AA_SCALE[(aaAnswers[number] || 1) - 1];

    ctx.fillStyle = row % 2 === 0 ? '#f8fafc' : '#ffffff';
    roundRectPath(ctx, rowX, rowY - 11, colWidth, rowHeight - 6, 8);
    ctx.fill();

    ctx.fillStyle = '#4f46e5';
    ctx.font = aaFont(800, 17);
    ctx.fillText(`${number}.`, rowX + 14, rowY);

    ctx.fillStyle = '#243044';
    ctx.font = aaFont(500, 16);
    const questionText = truncateCanvasText(ctx, question, colWidth - 176);
    ctx.fillText(questionText, rowX + 46, rowY);

    ctx.fillStyle = '#667085';
    ctx.font = aaFont(800, 15);
    ctx.textAlign = 'right';
    ctx.fillText(answer, rowX + colWidth - 14, rowY);
    ctx.textAlign = 'left';
  });
}

function createAdultAttachmentPdf(imageDataUrl, width, height) {
  const imageBytes = dataUrlToBinaryString(imageDataUrl);
  const objects = [];

  const addObject = content => {
    objects.push(content);
    return objects.length;
  };

  const catalogId = addObject('<< /Type /Catalog /Pages 2 0 R >>');
  const pagesId = addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  const imageId = addObject(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n${imageBytes}\nendstream`);
  const content = 'q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ';
  const contentId = addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  void catalogId;
  void pageId;
  void imageId;
  void contentId;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach(offset => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
}

function dataUrlToBinaryString(dataUrl) {
  return atob(dataUrl.split(',')[1]);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  let cursorY = y;

  Array.from(text).forEach(char => {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = char;
      cursorY += lineHeight;
    } else {
      line = next;
    }
  });

  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }

  return cursorY;
}

function truncateCanvasText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let output = text;
  while (output.length > 0 && ctx.measureText(`${output}...`).width > maxWidth) {
    output = output.slice(0, -1);
  }
  return `${output}...`;
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function aaFont(weight, size) {
  return `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", sans-serif`;
}
