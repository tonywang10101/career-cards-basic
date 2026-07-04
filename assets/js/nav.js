/**
 * nav.js – shared sidebar / navigation
 *
 * Usage: call initNav(activeKey, rootPath) once the DOM is ready.
 *   activeKey – one of the NAV_ITEMS keys ('home' | 'holland-basic')
 *   rootPath  – relative path from current page back to the site root
 *               e.g. '../' for sub-pages, './' for root index.html
 */

const NAV_ITEMS = [
  {
    section: '首頁',
    items: [
      { key: 'home', icon: '🏠', label: '工具總覽', href: 'index.html' }
    ]
  },
  {
    section: '測驗工具',
    items: [
      { key: 'holland-basic',       icon: '🎯', label: '旅人卡 - 何倫碼',   href: 'holland-basic/index.html' },
      { key: 'holland-occupations', icon: '💼', label: '旅人卡 - 職業偏好',     href: 'holland-occupations/index.html' },
      { key: 'inventory',           icon: '🧩', label: '職能盤點卡',             href: 'inventory/index.html' },
      { key: 'value-navigation',    icon: '💎', label: '價值導航卡',               href: 'value-navigation/index.html' },
      { key: 'life-balance',        icon: '⚖️', label: '生命平衡輪',               href: 'life-balance/index.html' },
      { key: 'life-design-checkup', icon: '🧭', label: '生命設計健檢',             href: 'life-design-checkup/index.html' },
      { key: 'adult-attachment',    icon: '◇', label: '成人依附風格檢測',         href: 'adult-attachment/index.html' },
      { key: 'good-time-journal',   icon: '📓', label: '好時光日記',               href: 'good-time-journal/index.html' },
      { key: 'odyssey-plan',        icon: '💡', label: '奧德賽計畫',               href: 'odyssey-plan/index.html' },
      { key: 'decision-space-worksheet', icon: '🫧', label: '決策空間工作表',      href: 'decision-space-worksheet/index.html' },
      { key: 'three-triangles-map', icon: '△', label: '職涯三角地圖',             href: 'three-triangles-map/index.html' }
    ]
  }
];

function initNav(activeKey, rootPath = './') {
  // Inject sidebar HTML
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let html = `
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="sidebar-brand-text">
          <h1>生涯諮詢工具箱</h1>
          <p>Career Counseling Tools</p>
        </div>
      </div>
      <button
        type="button"
        class="sidebar-collapse-btn"
        id="sidebar-collapse-btn"
        onclick="toggleSidebarCollapse()"
        aria-label="收合側邊欄"
        aria-expanded="true"
        title="收合側邊欄"
      >
        <span class="sidebar-collapse-icon" aria-hidden="true">◀</span>
      </button>
    </div>
    <nav class="sidebar-nav">`;

  NAV_ITEMS.forEach(group => {
    html += `<div class="nav-section-label">${group.section}</div>`;
    group.items.forEach(item => {
      const href = rootPath + item.href;
      const active = item.key === activeKey ? ' active' : '';
      html += `
        <a class="nav-item${active}" href="${href}" title="${item.label}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-text">${item.label}</span>
        </a>`;
    });
  });

  html += `</nav>`;
  sidebar.innerHTML = html;
  applySidebarCollapseState();
}

// ===== HAMBURGER (mobile) =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

const SIDEBAR_COLLAPSE_KEY = 'career-tools-sidebar-collapsed';

function setSidebarCollapseState(collapsed) {
  const appShell = document.querySelector('.app-shell');
  const toggleBtn = document.getElementById('sidebar-collapse-btn');
  if (!appShell || !toggleBtn) return;

  appShell.classList.toggle('sidebar-collapsed', collapsed);
  toggleBtn.setAttribute('aria-expanded', String(!collapsed));
  toggleBtn.setAttribute('aria-label', collapsed ? '展開側邊欄' : '收合側邊欄');
  toggleBtn.setAttribute('title', collapsed ? '展開側邊欄' : '收合側邊欄');

  const icon = toggleBtn.querySelector('.sidebar-collapse-icon');
  if (icon) icon.textContent = collapsed ? '▶' : '◀';
}

function applySidebarCollapseState() {
  if (window.innerWidth <= 768) {
    setSidebarCollapseState(false);
    return;
  }

  const collapsed = localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === 'true';
  setSidebarCollapseState(collapsed);
}

function toggleSidebarCollapse() {
  if (window.innerWidth <= 768) return;

  const appShell = document.querySelector('.app-shell');
  if (!appShell) return;

  const collapsed = !appShell.classList.contains('sidebar-collapsed');
  setSidebarCollapseState(collapsed);
  localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(collapsed));
}

window.addEventListener('resize', applySidebarCollapseState);

// ===== TOAST (shared) =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
