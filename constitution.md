# 生涯諮詢工具箱 – 實作憲法 (Constitution)

> **目的：** 讓後續 AI agent 或開發者能快速上手，理解設計原則、程式慣例與元件系統，無需反覆讀原始碼即可安全協作。

---

## 一、專案概覽

| 項目 | 說明 |
|------|------|
| 類型 | 純靜態網站，部署於 GitHub Pages |
| 技術棧 | HTML5 + CSS3 + 原生 JavaScript（無框架、無打包工具） |
| 語言 | 中文（繁體，zh-TW）+ 英文（程式碼注釋） |
| 根目錄 | `career-card-basic/` |
| 入口 | `index.html`（工具總覽首頁） |

---

## 二、目錄結構

```
career-card-basic/
├── index.html                  # 首頁：工具總覽卡片格
├── constitution.md             # ← 本文件
│
├── assets/
│   ├── css/
│   │   ├── main.css            # 全域樣式（必須優先載入）
│   │   ├── holland.css         # 旅人卡 - 何倫碼 專用
│   │   ├── occupations.css     # 旅人卡 - 職業偏好 專用（含共用 input-slot 樣式）
│   │   ├── inventory.css       # 職能盤點卡 專用
│   │   ├── value-navigation.css# 價值導航卡 專用（含 cat-* 色彩 token）
│   │   └── life-balance.css    # 生命平衡輪 專用
│   └── js/
│       ├── nav.js              # 側邊欄 + 共用全域函式（必須優先載入）
│       ├── holland.js          # 何倫碼邏輯
│       ├── occupations.js      # 職業偏好邏輯
│       ├── inventory.js        # 職能盤點邏輯
│       ├── value-navigation.js # 價值導航邏輯
│       └── life-balance.js     # 生命平衡輪邏輯
│
├── holland-basic/index.html    # 旅人卡 - 何倫碼
├── holland-occupations/index.html  # 旅人卡 - 職業偏好
├── inventory/index.html        # 職能盤點卡
├── value-navigation/index.html # 價值導航卡
└── life-balance/index.html     # 生命平衡輪
```

---

## 三、CSS 架構與設計系統

### 3.1 載入順序（每個子頁面 HTML 內）

```html
<link rel="stylesheet" href="../assets/css/main.css">
<link rel="stylesheet" href="../assets/css/[page].css">
<!-- 部分頁面額外載入 occupations.css 取得 input-slot 樣式 -->
```

首頁 `index.html` 只載入 `main.css`。

### 3.2 main.css — 全域共用

包含以下不可重複定義的樣式：

- **CSS 自訂屬性（Design Tokens）**

  ```css
  --primary, --primary-light, --primary-dark
  --gray-50 / 100 / 200 / 300 / 400 / 600 / 700 / 800
  --radius (12px)
  --shadow, --shadow-lg
  ```

- **App Shell**：`.app-shell`, `.sidebar`, `.main-content`
- **Sidebar**：`.sidebar-logo`, `.sidebar-nav`, `.nav-section-label`, `.nav-item`, `.nav-icon`
- **Page Header**：`.page-header`
- **Home Grid**：`.home-grid`, `.tool-card`
- **Shared Buttons**：`.btn`, `.btn-primary`, `.btn-outline`
- **Mode Bar（所有工具頁共用）**：`.mode-bar`, `.mode-btn`, `.mode-btn:hover`, `.mode-btn.active`, `.mode-spacer`
- **Toast**：`.toast`, `.toast.show`
- **Hamburger / Mobile**：`.hamburger`, `.sidebar-overlay`
- **Footer**：`.footer`
- **RWD breakpoints**：768px（mobile）、1100px（tablet）

> **重要**：`.mode-bar` 和 `.mode-btn` 已集中在 `main.css`。**不要**在各頁面 CSS 重複定義這些樣式。

### 3.3 occupations.css — 跨頁面共用 input-slot

以下樣式在 `occupations.css` 中定義，也被 `inventory` 與 `value-navigation` 頁面共用：

```css
.input-slots-grid
.input-slot
.input-slot-label
.input-slot-field
.input-slot-field.is-valid / .is-error / .is-dup
```

若新工具頁需要快速輸入面板，在 HTML 中額外載入 `occupations.css`：

```html
<link rel="stylesheet" href="../assets/css/occupations.css">
```

### 3.4 value-navigation.css — 類別色彩 Token

四種類別顏色，透過 class 套用於卡片容器：

```css
.cat-pink  { --cat-bg: #FDF2F8; --cat-border: #F9A8D4; --cat-text: #BE185D; }
.cat-teal  { --cat-bg: #F0FDFA; --cat-border: #5EEAD4; --cat-text: #0F766E; }
.cat-amber { --cat-bg: #FFFBEB; --cat-border: #FCD34D; --cat-text: #B45309; }
.cat-blue  { --cat-bg: #EFF6FF; --cat-border: #93C5FD; --cat-text: #1D4ED8; }
```

`inventory.js` 則是以 **inline style** 注入 `--cat-color` 和 `--cat-bg`（透過 `CATEGORY_META` 物件），不使用 `.cat-*` class。

### 3.5 CSS 命名慣例

| 頁面 | 類別前綴 |
|------|---------|
| main.css（全域） | 無前綴 / `.btn-*` / `.nav-*` |
| holland.css | 無前綴（`.card-inner`, `.rating-btn`…） |
| occupations.css | `.occ-*` |
| inventory.css | `.inv-*` |
| value-navigation.css | `.val-*` / `.cat-*` |
| life-balance.css | `.lb-*` |

各頁面的進度條、輪播軌道、狀態徽章等元件均使用各自的前綴，**不跨頁共用這些樣式**（因為結構與顏色有差異）。

---

## 四、JavaScript 架構與慣例

### 4.1 nav.js — 全域共用函式

所有頁面必須先載入 `nav.js`，取得以下全域函式：

| 函式 | 說明 |
|------|------|
| `initNav(activeKey, rootPath)` | 注入側邊欄 HTML，標記目前頁面 |
| `toggleSidebar()` | 開／關行動版側邊欄（漢堡按鈕用） |
| `closeSidebar()` | 關閉側邊欄 |
| `showToast(msg)` | 顯示底部提示泡泡（2.5 秒自動消失） |

`initNav` 的 `activeKey` 對應 `NAV_ITEMS` 中各項目的 `key`：
`'home' | 'holland-basic' | 'holland-occupations' | 'inventory' | 'value-navigation' | 'life-balance'`

新增工具頁時，在 `NAV_ITEMS` 陣列追加一個項目並給定 `key`。

### 4.2 頁面模組結構

每個頁面模組（如 `inventory.js`）遵循相同結構：

```
1. 常數（MAX_*, CATEGORY_META, CODE_COLORS…）
2. 資料陣列（INVENTORY_CARDS, OCCUPATIONS, CARDS…）
3. 狀態（純 JS：Set / Array / 數字）
4. URL 解析與序列化（parseURLParams, buildShareURL）
5. 模式切換（switchMode）
6. 渲染函式（renderCards, renderDots, renderDisplayGroup…）
7. 動作函式（selectStrength, selectWeakness, prevCard, nextCard…）
8. 分享（shareResult）
9. 重置（resetAll）
10. 初始化入口（initInventory, initOccupations…）
```

### 4.3 狀態管理

無框架、純 JS 狀態，以模組層級變數儲存：

```javascript
// 集合類（Set）
const strength = new Set();    // 選中的強勢職能 id
const weakness = new Set();    // 選中的劣勢職能 id
const liked = new Set();       // 喜歡的職業 id

// 陣列類
const lbScores = {
  current: Array(10).fill(5),
  ideal:   Array(10).fill(7)
};

// 數字/字串
let currentIndex = 0;          // 輪播目前卡片索引
let currentMode  = 'select';   // 目前模式
```

**更新 UI 時永遠重新渲染**，不做差量 DOM 更新。

### 4.4 URL 分享模式

所有頁面統一的分享流程：

```
1. buildShareURL()   → 讀取目前狀態，序列化成 ?str=1,3,5&wk=2,4,6
2. navigator.clipboard.writeText(url) + showToast('已複製')
3. 頁面載入時 parseURLParams() → 解析 URL → 還原狀態 → 自動切換至展示模式
```

URL 參數範例：

| 頁面 | 參數 |
|------|------|
| 職能盤點 | `?str=1,3,5&wk=2,4,6` |
| 職業偏好 | `?liked=1,3,5,7,9,11,13,15,17,19,21,23,25,27,29` |
| 何倫碼 | `?similar=R,I&neutral=A&different=S,E,C` |
| 生命平衡輪 | `?cur=5,7,8,6,5,7,8,6,5,7&ideal=8,9,9,8,8,9,9,8,8,9` |

### 4.5 快速輸入面板（Input Panel）模式

Inventory 和 Occupations 有「諮詢師快速輸入工具」，邏輯如下：

1. 畫面有 N 個 `<input type="number">` 欄位（input slots）
2. 使用者輸入編號
3. `_applyInputToState()` 驗證：去重、範圍檢查、不能同時是強勢＆劣勢
4. `_fillSlotsFromState()` 從 Set 填回輸入欄位
5. Revalidation 防止無限遞迴：`_invRevalidating` flag

**重要**：`input-slot-field` 的 class 狀態：
- `.is-valid` → 綠色邊框（有效）
- `.is-error` → 紅色邊框（無效/超範圍）
- `.is-dup` → 黃色邊框（重複或衝突）

### 4.6 模式切換

所有頁面均有 `switchMode(mode)` 函式，邏輯：

```javascript
function switchMode(mode) {
  currentMode = mode;
  // 隱藏所有 view div
  document.querySelectorAll('[id$="-view"]').forEach(v => v.style.display = 'none');
  // 顯示目標 view
  document.getElementById(`inv-${mode}-view`).style.display = '';
  // 更新 mode-btn active 狀態
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`mode-${mode}-btn`).classList.add('active');
  // 特定模式的額外邏輯（例如 display 模式先 renderDisplayGroup）
}
```

---

## 五、頁面 HTML 範本

每個工具子頁面的 HTML 必須包含以下結構：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <!-- Google tag 區塊 (copy from existing page) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>【工具名稱】 – 生涯諮詢工具</title>
  <link rel="stylesheet" href="../assets/css/main.css">
  <link rel="stylesheet" href="../assets/css/[page].css">
  <!-- 若需要 input-slot 樣式：-->
  <!-- <link rel="stylesheet" href="../assets/css/occupations.css"> -->
</head>
<body>

<!-- 漢堡按鈕（手機版） -->
<button class="hamburger" onclick="toggleSidebar()">☰</button>
<div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>

<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>

  <main class="main-content">

    <!-- 頁首 -->
    <div class="page-header">
      <h2>【工具名稱】</h2>
      <p>【副標說明】</p>
    </div>

    <!-- Mode bar -->
    <div class="mode-bar">
      <button class="mode-btn active" id="mode-[x]-btn" onclick="switchMode('[x]')">...</button>
      <!-- ... 其他模式按鈕 ... -->
      <div class="mode-spacer"></div>
      <button class="btn btn-outline" onclick="resetAll()">🔄 重新開始</button>
      <button class="btn btn-primary" onclick="shareResult()">🔗 分享結果</button>
    </div>

    <!-- 各 view（以 display:none 切換） -->
    <div id="[prefix]-select-view">...</div>
    <div id="[prefix]-spread-view"  style="display:none;">...</div>
    <div id="[prefix]-display-view" style="display:none;">...</div>
    <div id="[prefix]-input-view"   style="display:none;">...</div>

  </main>
</div><!-- /app-shell -->

<div class="toast" id="toast"></div>

<div class="footer">
  <p>此頁內容參照 © 2026 職游創新職涯發展與諮詢：...</p>
</div>

<script src="../assets/js/nav.js"></script>
<script src="../assets/js/[page].js"></script>
<script>
  initNav('[activeKey]', '../');
  init[Page]();
</script>
</body>
</html>
```

---

## 六、元件設計規範

### 6.1 Mode Bar

```html
<div class="mode-bar">
  <button class="mode-btn active" id="mode-select-btn" onclick="switchMode('select')">✏️ 選擇模式</button>
  <button class="mode-btn" id="mode-spread-btn"  onclick="switchMode('spread')">🃏 攤開選擇</button>
  <button class="mode-btn" id="mode-display-btn" onclick="switchMode('display')">📊 展示模式</button>
  <button class="mode-btn" id="mode-input-btn"   onclick="switchMode('input')">📋 快速輸入</button>
  <div class="mode-spacer"></div>
  <button class="btn btn-outline" onclick="resetAll()">🔄 重新開始</button>
  <button class="btn btn-primary" onclick="shareResult()">🔗 分享結果</button>
</div>
```

樣式在 `main.css`，不要在頁面 CSS 重複定義。

### 6.2 職能盤點卡（Sun/Moon 設計）

卡片結構（三層：太陽＋斜線＋月亮）：

```html
<div class="inv-card-inner [status-class]"
     style="--cat-color:[hex];--cat-bg:[hex]">
  <div class="inv-card-status-ribbon">[狀態文字]</div>
  <div class="inv-card-sun">
    <div class="inv-card-header">
      <span class="inv-card-num">#[id]</span>
      <span class="inv-card-category">[類別標籤]</span>
    </div>
    <div class="inv-card-title" style="color:var(--cat-color)">[標題]</div>
    <ul class="inv-card-desc">
      <li>[描述行]</li>
    </ul>
  </div>
  <div class="inv-card-diagonal"></div>  <!-- CSS 斜線分隔 -->
  <div class="inv-card-moon">
    <span class="inv-moon-icon">🌙</span>
    <div class="inv-moon-shadows">
      <div class="inv-shadow-item">— [陰影描述]</div>
    </div>
  </div>
  <div class="inv-card-footer">
    <button class="inv-detail-btn" onclick="openDetailModal([id])">📋 詳情</button>
    <div class="inv-action-buttons">
      <button class="inv-action-btn strength-btn">💪強勢</button>
      <button class="inv-action-btn skip-btn">⏭略過</button>
      <button class="inv-action-btn weakness-btn">🌱劣勢</button>
    </div>
  </div>
</div>
```

CSS 斜線原理：
```css
.inv-card-diagonal {
  height: 32px;
  background: linear-gradient(to bottom right, var(--cat-bg) 50%, rgba(0,0,0,0.07) 50%);
}
```

### 6.3 Modal（詳情彈窗）

動態建立，插入 body 末尾：

```javascript
function openDetailModal(id) {
  const card = INVENTORY_CARDS.find(c => c.id === id);
  const overlay = document.createElement('div');
  overlay.className = 'inv-modal-overlay';
  overlay.innerHTML = `...`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  setTimeout(() => overlay.classList.add('open'), 10);
}

function closeModal(event) {
  const overlay = document.getElementById('inv-modal-overlay');
  if (event.target === overlay) _doCloseModal();
}
function closeModalBtn() { _doCloseModal(); }
function _doCloseModal() {
  const overlay = document.getElementById('inv-modal-overlay');
  if (overlay) { overlay.classList.remove('open'); setTimeout(() => overlay.remove(), 250); }
  document.body.style.overflow = '';
}
```

### 6.4 輪播（Carousel）

通用模式（各頁面前綴不同，但邏輯相同）：

```javascript
let currentIndex = 0;
const track = document.getElementById('inv-cards-track');

function goToCard(idx) {
  currentIndex = idx;
  track.style.transform = `translateX(-${idx * 100}%)`;
  updateDots();
  updateNavButtons();
}
function prevCard() { if (currentIndex > 0) goToCard(currentIndex - 1); }
function nextCard() { if (currentIndex < total - 1) goToCard(currentIndex + 1); }
```

觸控滑動（swipe）亦已實作，使用 `touchstart` / `touchend` delta 判斷。

### 6.5 生命平衡輪（SVG Radar）

- SVG viewBox: `0 0 500 500`（輪播圖），`0 0 520 520`（展示圖）
- 圓心：`cx = cy = 250`，`maxR = 195`（留邊框空間給標籤）
- 10 個維度，N=10，每格弧長 = 2π/10
- **標籤位置**：每個扇形的**中間角度** `(i + 0.5) / N * 2π - π/2`（不在分隔線上）
- 互動時，overlay polygon 必須設定 `pointer-events="none"` 以避免遮蓋可點擊的 arc cell

```javascript
const angle = (i + 0.5) / N * 2 * Math.PI - Math.PI / 2;
const lx = cx + (maxR + 28) * Math.cos(angle);
const ly = cy + (maxR + 28) * Math.sin(angle);
```

---

## 七、資料規格

### 7.1 職能盤點卡（INVENTORY_CARDS）

```javascript
{
  id: 1,                          // 1–60，唯一
  category: "Action & Execution", // 4 種類別之一（見 CATEGORY_META）
  title: "追求品質",               // 職能名稱
  descLines: ["...", "..."],       // 正面描述（4行）
  shadow1: "...",                  // 陰影描述 1
  shadow2: "...",                  // 陰影描述 2（可為 null）
  consequence1: "...",             // 陰影結果 1
  adjustment1: "...",              // 調整建議 1
  consequence2: "...",             // 陰影結果 2
  adjustment2: "...",              // 調整建議 2
  fitRole: "...",                  // 適合角色
  fitTask: "...",                  // 適合任務
  fitGeneral: "...",               // 一般適用情境
  improveSteps: ["1. ...", "2. ..."] // 發展建議（通常 2 步）
}
```

### 7.2 CATEGORY_META（職能盤點）

```javascript
const CATEGORY_META = {
  'Action & Execution':  { color: '#F97316', bg: '#FFF7ED', label: '行動執行' },
  'Thinking & Mindset':  { color: '#6366F1', bg: '#EEF2FF', label: '思維心態' },
  'People & Leadership': { color: '#10B981', bg: '#ECFDF5', label: '人際領導' },
  'Skills & Application':{ color: '#0EA5E9', bg: '#F0F9FF', label: '技能應用' }
};
```

### 7.3 CODE_COLORS（RIASEC 顏色）

共用於 `holland.js` 和 `occupations.js`：

```javascript
const CODE_COLORS = {
  R: { color: '#F97316', bg: '#FFF7ED' },
  I: { color: '#6366F1', bg: '#EEF2FF' },
  A: { color: '#EC4899', bg: '#FDF2F8' },
  S: { color: '#10B981', bg: '#ECFDF5' },
  E: { color: '#EAB308', bg: '#FEFCE8' },
  C: { color: '#0EA5E9', bg: '#F0F9FF' }
};
```

---

## 八、新增工具頁 — 逐步清單

1. **規劃資料結構**：確定卡片欄位、狀態變數、URL 參數格式
2. **建立子目錄**：`[tool-name]/index.html`
3. **建立 CSS**：`assets/css/[tool-name].css`，使用新的前綴（如 `.abc-*`）
4. **建立 JS**：`assets/js/[tool-name].js`，遵循 §4.2 模組結構
5. **HTML 結構**：依照 §5 範本，記得：
   - 引入 `main.css` + 頁面 CSS
   - `<div class="sidebar" id="sidebar"></div>`
   - `<div class="toast" id="toast"></div>`
   - 調用 `initNav('[key]', '../')`
   - 調用 `init[Page]()`
6. **更新 nav.js**：在 `NAV_ITEMS` 加入新項目
   ```javascript
   { key: '[key]', icon: '[emoji]', label: '[名稱]', href: '[tool-name]/index.html' }
   ```
7. **更新首頁**：在 `index.html` 的 `.home-grid` 加入 `.tool-card`
8. **測試 URL 分享**：手動構造分享 URL 並驗證解析

---

## 九、禁止事項（Anti-patterns）

- ❌ 在頁面 CSS 重複定義 `.mode-bar`, `.mode-btn`, `.mode-spacer`（已在 main.css）
- ❌ 使用 localStorage / sessionStorage（不支援且無需要）
- ❌ 引入任何 npm 套件或打包工具
- ❌ 使用 CSS `@import` 跨 CSS 檔案（統一在 HTML `<link>` 管理）
- ❌ 跨頁面共用 DOM id（id 只在同一頁內唯一即可）
- ❌ 以 `!important` 強制覆蓋（遇到衝突應調整選擇器權重）
- ❌ 使用 `innerHTML` 插入含外部資料的 `<script>` 標籤
- ❌ 在同一個 Set 中同時加入「強勢」與「劣勢」的同一個 id

---

## 十、已知限制與設計決定

| 問題 | 決定 |
|------|------|
| 無後端，無資料庫 | 所有狀態以 URL 分享；session 內使用記憶體 |
| 無路由 | 子頁面直接以獨立 HTML 實作 |
| 無模組系統 | 全域函式命名需謹慎，避免衝突（用頁面前綴） |
| SVG 點擊被 polygon 遮蓋 | Overlay polygon 加 `pointer-events="none"` |
| input slot 防止遞迴 | 使用 `_[prefix]Revalidating` flag guard |
| 生命平衡輪標籤位置 | 使用扇形中心角 `(i+0.5)/N*2π`，不用分隔線角 `i/N*2π` |

---

*最後更新：2026-04-04*
