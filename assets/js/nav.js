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
      { key: 'inventory',           icon: '🧩', label: '職能盤點卡',             href: 'inventory/index.html' }
    ]
  }
];

function initNav(activeKey, rootPath = './') {
  // Inject sidebar HTML
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let html = `
    <div class="sidebar-logo">
      <h1>生涯諮詢工具</h1>
      <p>Career Counseling Tools</p>
    </div>
    <nav class="sidebar-nav">`;

  NAV_ITEMS.forEach(group => {
    html += `<div class="nav-section-label">${group.section}</div>`;
    group.items.forEach(item => {
      const href = rootPath + item.href;
      const active = item.key === activeKey ? ' active' : '';
      html += `
        <a class="nav-item${active}" href="${href}">
          <span class="nav-icon">${item.icon}</span>
          ${item.label}
        </a>`;
    });
  });

  html += `</nav>`;
  sidebar.innerHTML = html;
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

// ===== TOAST (shared) =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
