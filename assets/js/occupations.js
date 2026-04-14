/* ===================================================================
   occupations.js – Holland Occupations selection tool logic
   =================================================================== */

// ===== CONSTANTS =====
const MAX_LIKE = 15;

// Per-letter colors matching the RIASEC palette
const CODE_COLORS = {
  R: { color: '#F97316', bg: '#FFF7ED' },
  I: { color: '#6366F1', bg: '#EEF2FF' },
  A: { color: '#EC4899', bg: '#FDF2F8' },
  S: { color: '#10B981', bg: '#ECFDF5' },
  E: { color: '#EAB308', bg: '#FEFCE8' },
  C: { color: '#0EA5E9', bg: '#F0F9FF' }
};

// ===== OCCUPATION DATA =====
// Sorted by RIASEC cluster. Based on Taiwan job market (104/1111).
const OCCUPATIONS = [
  { id: 1, name:'幼教老師', field:'教育學群', code:'SA', skills:["顧客服務", "教育訓練", "語文文學"], goals:["建立夥伴關係", "教導與協助個人發展", "安排工作和活動時程"], desc:'負責教導幼兒知識與課程，促進孩子的身心與社會發展。' },
  { id: 2, name:'國高中老師', field:'教育學群', code:'SA', skills:["教育訓練", "語文文學", "顧客服務"], goals:["安排工作和活動時程", "組織內部溝通", "教導與協助個人發展"], desc:'在學校教導國高中學生知識與課程，可能教多個科目或帶領班級。' },
  { id: 3, name:'社工師', field:'社會與心理學群', code:'SE', skills:["治療諮商", "心理學", "顧客服務"], goals:["建立夥伴關係", "協助和照顧他人", "調解衝突"], desc:'協助個案適應與融入社會，包含家庭、社區、醫療機構、司法單位等場域。' },
  { id: 4, name:'神職人員', field:'社會與心理/文史哲學群', code:'SEA', skills:["哲學宗教", "顧客服務", "管理"], goals:["協助和照顧他人", "安排工作和活動時程", "組織內部溝通"], desc:'負責宗教活動與儀式，提供信仰、精神和生活等方面的輔導。' },
  { id: 5, name:'導遊/導覽員', field:'遊憩與運動學群', code:'SEA', skills:["顧客服務", "歷史文化", "地球環境"], goals:["服務與應對人群", "建立夥伴關係", "代表組織對外溝通"], desc:'帶領團隊介紹觀光景點、風景名勝，或於博物館、畫廊進行導覽。' },
  { id: 6, name:'服務生', field:'遊憩與運動學群', code:'SEC', skills:["顧客服務", "銷售行銷", "語文文學"], goals:["服務與應對人群", "搬運與動手操作", "體能活動"], desc:'負責接待顧客、安排帶位、協助點餐、介紹菜色、端送食物等工作。' },
  { id: 7, name:'家教/補習班老師', field:'教育學群', code:'SEI', skills:["語文文學", "教育訓練", "顧客服務"], goals:["教導他人", "建立夥伴關係", "搜尋資訊"], desc:'在正規的學校學習之外，為學生提供額外學業指導。' },
  { id: 8, name:'教授', field:'無特定學群', code:'SI', skills:["教育訓練", "語文文學", "管理"], goals:["持續進修專業知識", "教導與協助個人發展", "創新設計"], desc:'從事學術研究，在大專院校進行研究與教學工作。' },
  { id: 9, name:'諮商與臨床心理師', field:'社會與心理學群', code:'SIA', skills:["治療諮商", "心理學", "顧客服務"], goals:["建立夥伴關係", "協助和照顧他人", "教導與協助個人發展"], desc:'評估個人心理與情緒問題，實施療程或提供諮商，協助個案面對問題。' },
  { id:10, name:'護理師', field:'醫藥衛生學群', code:'SIC', skills:["醫學", "顧客服務", "治療諮商"], goals:["找出關鍵資訊和線索", "協助和照顧他人", "監控過程、物件或環境"], desc:'評估病人的健康問題，提供護理建議與服務，管理並照顧病人。' },
  { id:11, name:'物理與職能治療師', field:'醫藥衛生學群', code:'SIR', skills:["治療諮商", "教育訓練", "顧客服務"], goals:["協助和照顧他人", "持續進修專業知識", "搬運與動手操作"], desc:'規劃病人、傷者或身心障礙人士的療程，協助改善或恢復獨立生活能力。' },
  { id:12, name:'看護', field:'醫藥衛生/社會與心理學群', code:'SRC', skills:["顧客服務", "治療諮商", "教育訓練"], goals:["監控過程、物件或環境", "協助和照顧他人", "搬運與動手操作"], desc:'在機構或家中，協助高齡者或身心障礙人士的日常活動，包含食衣住行等層面。' },
  { id:13, name:'運動教練', field:'遊憩與運動學群', code:'SRE', skills:["運動保健", "教育訓練", "顧客服務"], goals:["體能活動", "教導與協助個人發展", "建立夥伴關係"], desc:'指導個人或團體關於運動的知識和方法，增進其運動表現。' },
  { id:14, name:'遊戲設計師', field:'大眾傳播/資訊/藝術學群', code:'AE', skills:["設計", "資訊電子", "傳播媒體"], goals:["創新設計", "安排工作和活動時程", "組織內部溝通"], desc:'設計遊戲，可能包含遊戲玩法、故事劇本、人物設定等。' },
  { id:15, name:'室內設計師', field:'建築與設計/藝術學群', code:'AE', skills:["設計", "建築營造", "銷售行銷"], goals:["創新設計", "安排工作和活動時程", "代表組織對外溝通"], desc:'設計室內空間，包含商業大樓、工業建築、住宅等，兼顧美學和功能性。' },
  { id:16, name:'音樂家', field:'藝術學群', code:'AE', skills:["藝術", "顧客服務", "語文文學"], goals:["創新設計", "服務與應對人群", "建立夥伴關係"], desc:'在舞台、節目、電影或錄音作品中，演奏樂器或演唱、伴唱。' },
  { id:17, name:'演員', field:'藝術/大眾傳播學群', code:'AE', skills:["藝術", "語文文學", "傳播媒體"], goals:["創新設計", "服務與應對人群", "建立夥伴關係"], desc:'在舞臺、節目或電影演出，透過聲音、肢體動作或歌曲舞蹈來呈現角色。' },
  { id:18, name:'藝術總監', field:'藝術學群', code:'AE', skills:["藝術", "傳播媒體", "教育訓練"], goals:["安排工作和活動時程", "創新設計", "組織內部溝通"], desc:'設計整體藝術呈現的理念，指導工作團隊的表演和呈現，並規劃行銷包裝。' },
  { id:19, name:'編輯', field:'文史哲/外語/大眾傳播學群', code:'AEC', skills:["傳播媒體", "語文文學", "行政"], goals:["持續進修專業知識", "安排工作和活動時程", "建立夥伴關係"], desc:'在各種素材出版前，進行後製與審核，包含文字、圖像、多媒體等。' },
  { id:20, name:'記者/特派員', field:'大眾傳播學群', code:'AEI', skills:["傳播媒體", "語文文學", "顧客服務"], goals:["代表組織對外溝通", "搜尋資訊", "創新設計"], desc:'收集與分析有報導價值的事件，並為報章雜誌、廣播電視進行報導。' },
  { id:21, name:'商業與工業設計師', field:'建築與設計/工程/藝術學群', code:'AER', skills:["設計", "工程科技", "機械"], goals:["創新設計", "製作圖稿與規格書並解說", "組織內部溝通"], desc:'按照需求規格，設計兼具美感和功能的產品，如家電用品、手機等。' },
  { id:22, name:'流行服飾設計師', field:'建築與設計/藝術學群', code:'AER', skills:["設計", "管理", "生產與作業"], goals:["創新設計", "提出解決問題的方案", "代表組織對外溝通"], desc:'掌握時尚趨勢，設計服飾和配件。可能包含使用不同色彩與材質的創新。' },
  { id:23, name:'廣電主播/主持人', field:'大眾傳播學群', code:'AES', skills:["傳播媒體", "語文文學", "顧客服務"], goals:["服務與應對人群", "代表組織對外溝通", "創新設計"], desc:'在廣播或電視中主持與談話。如訪問、介紹來賓、主持典禮、播報新聞等。' },
  { id:24, name:'造型設計師', field:'建築與設計/藝術學群', code:'AES', skills:["顧客服務", "銷售行銷", "藝術"], goals:["服務與應對人群", "創新設計", "提供諮詢"], desc:'指導整體造型搭配，包含美容、上妝、髮型設計、服裝穿搭等。' },
  { id:25, name:'多媒體設計師', field:'建築與設計/藝術/資訊學群', code:'AI', skills:["藝術", "傳播媒體", "設計"], goals:["創新設計", "持續進修專業知識", "運用電腦工作"], desc:'利用電腦、影片等多媒體素材，創作動畫、電影、特效、廣告等。' },
  { id:26, name:'詩人/作家', field:'文史哲學群', code:'AI', skills:["語文文學", "傳播媒體", "藝術"], goals:["創新設計", "與人解說", "持續進修專業知識"], desc:'創作文學作品，包含文章、詩作、歌詞、劇本等內容。' },
  { id:27, name:'建築師', field:'建築與設計/工程學群', code:'AIR', skills:["設計", "建築營造", "工程科技"], goals:["創新設計", "安排工作和活動時程", "製作圖稿與規格書並解說"], desc:'設計並規劃開發案件，如交通設施、都市規劃、遊樂設施、住宅區等。' },
  { id:28, name:'攝影師', field:'藝術學群', code:'AR', skills:["資訊電子", "傳播媒體", "顧客服務"], goals:["創新設計", "搬運與動手操作", "建立夥伴關係"], desc:'拍攝影片或影像，主題包含人文、商品、景觀等，可能包含印刷品製作。' },
  { id:29, name:'藝術家', field:'藝術學群', code:'AR', skills:["藝術", "設計", "銷售行銷"], goals:["創新設計", "搬運與動手操作", "代表組織對外溝通"], desc:'運用各種素材和技巧創作藝術品，如畫家、雕刻家和插畫家等。' },
  { id:30, name:'舞者', field:'藝術/遊憩與運動學群', code:'AR', skills:["藝術", "教育訓練", "運動保健"], goals:["體能活動", "服務與應對人群", "建立夥伴關係"], desc:'演出各類型舞蹈，包含古典、流行等風格。可能需要唱歌或演戲。' },
  { id:31, name:'平面設計師', field:'建築與設計/藝術學群', code:'ARE', skills:["設計", "藝術", "傳播媒體"], goals:["創新設計", "持續進修專業知識", "安排工作和活動時程"], desc:'按照客戶需求，以各種材料設計圖案，於銷售或宣傳時使用。' },
  { id:32, name:'景觀/園藝設計師', field:'建築與設計/生物資源學群', code:'ARE', skills:["顧客服務", "藝術", "生產與作業"], goals:["創新設計", "服務與應對人群", "體能活動"], desc:'景觀設計，包含造景、建築、庭園、花草等，可能需要栽種、修剪、施肥。' },
  { id:33, name:'翻譯/口譯', field:'外語學群', code:'AS', skills:["外國語文", "語文文學", "顧客服務"], goals:["建立夥伴關係", "與人解說", "持續進修專業知識"], desc:'翻譯文字資料或口語內容給其他語言族群，包含筆譯、口譯、手語翻譯等。' },
  { id:34, name:'數位行銷', field:'管理/大眾傳播學群', code:'EA', skills:["銷售行銷", "顧客服務", "管理"], goals:["運用電腦工作", "創新設計", "推銷或影響他人"], desc:'於網路進行商業活動，規劃營運策略、販售商品服務、處理網路訂單等。' },
  { id:35, name:'廣告文案', field:'文史哲/大眾傳播學群', code:'EA', skills:["語文文學", "銷售行銷", "傳播媒體"], goals:["代表組織對外溝通", "推銷或影響他人", "創新設計"], desc:'為產品或公司撰寫宣傳文案，於各種媒體與廣告中使用。' },
  { id:36, name:'導演', field:'藝術/大眾傳播學群', code:'EA', skills:["傳播媒體", "語文文學", "藝術"], goals:["組織內部溝通", "安排工作和活動時程", "服務與應對人群"], desc:'詮釋戲劇、電影或節目的劇本，指導演員演出和舞台呈現。' },
  { id:37, name:'公關', field:'大眾傳播/管理學群', code:'EAS', skills:["傳播媒體", "銷售行銷", "顧客服務"], goals:["代表組織對外溝通", "安排工作和活動時程", "建立夥伴關係"], desc:'運用各種宣傳素材、廣告媒體和公開活動，進而提升個人或組織形象。' },
  { id:38, name:'不動產經紀人', field:'法政/財經學群', code:'EC', skills:["顧客服務", "行政", "管理"], goals:["安排工作和活動時程", "調解衝突", "監控資源"], desc:'指導或整合不動產的買賣交易、租賃、代銷等事務。' },
  { id:39, name:'業務人員', field:'管理學群', code:'EC', skills:["銷售行銷", "顧客服務", "管理"], goals:["推銷或影響他人", "代表組織對外溝通", "安排工作和活動時程"], desc:'需熟悉公司產品並負責銷售，可能需陌生開發、簽約報價、提供顧客服務。' },
  { id:40, name:'門市/專櫃人員', field:'無特定學群', code:'EC', skills:["顧客服務", "銷售行銷", "語文文學"], goals:["服務與應對人群", "推銷或影響他人", "建立夥伴關係"], desc:'在商店進行銷售，販賣食衣住行育樂等用品。' },
  { id:41, name:'軍官', field:'無特定學群', code:'ECR', skills:["管理", "行政", "公共安全"], goals:["安排工作和活動的時程", "體能活動", "盤點與檢查物品"], desc:'由國家授權，負責管理軍隊的官員，擔任領導或是幕僚工作。' },
  { id:42, name:'咖啡師', field:'遊憩與運動學群', code:'ECR', skills:["顧客服務", "生資食科", "銷售行銷"], goals:["服務與應對人群", "控制機器與程序", "推銷或影響他人"], desc:'萃取咖啡提供給顧客，可能也要進行拉花、研發新的咖啡品項。' },
  { id:43, name:'保險經紀人', field:'財經學群', code:'ECS', skills:["顧客服務", "銷售行銷", "行政"], goals:["建立夥伴關係", "代表組織對外溝通", "推銷或影響他人"], desc:'販賣各類保險，如：儲蓄險、壽險、意外險等。可能獨立工作或隸屬於公司。' },
  { id:44, name:'總經理', field:'管理/財經學群', code:'ECS', skills:["顧客服務", "管理", "人力資源"], goals:["安排工作和活動時程", "指導與激勵部屬", "提出解決問題的方案"], desc:'指導公司運作，包含營運政策、日常管理、規畫財務及人力使用。' },
  { id:45, name:'專案管理師', field:'管理學群', code:'ECS', skills:["顧客服務", "行政", "語文文學"], goals:["安排工作和活動時程", "組織內部溝通", "調解衝突"], desc:'負責專案計畫的控管和執行，需要掌握溝通、時間、成本等知識與能力。' },
  { id:46, name:'人力資源專員', field:'社會與心理/管理學群', code:'ECS', skills:["行政", "人力資源", "管理"], goals:["安排工作和活動時程", "建立夥伴關係", "組織內部溝通"], desc:'從事企業的人力資源相關工作，包括招募、教育訓練、薪酬等層面。' },
  { id:47, name:'律師', field:'法政學群', code:'EI', skills:["法律政治", "語文文學", "顧客服務"], goals:["調解衝突", "搜尋資訊", "提出解決問題的方案"], desc:'受委託或指定，在法律程序中，協助當事人進行訴訟、辯護或其他事項。' },
  { id:48, name:'網站行銷策畫', field:'管理/資訊/大眾傳播學群', code:'EIC', skills:["銷售行銷", "顧客服務", "傳播媒體"], goals:["運用電腦工作", "分析資訊", "持續進修專業知識"], desc:'研究搜尋引擎的收錄規則、研究使用者行為，增加網路曝光程度。' },
  { id:49, name:'企管顧問', field:'管理學群', code:'EIC', skills:["管理", "銷售行銷", "顧客服務"], goals:["建立夥伴關係", "提供諮詢", "提出解決問題的方案"], desc:'參與企業管理與和決策過程，提出未來發展建議或現況改善方案。' },
  { id:50, name:'船長/領航員', field:'生物資源/工程/管理學群', code:'ERC', skills:["交通運輸", "地球環境", "公共安全"], goals:["操作運載工具、儀器或設備", "監控過程、物件或環境", "控制機器與程序"], desc:'指揮或監督船隻航行，包含進出港口、河流和海洋等。' },
  { id:51, name:'法官', field:'法政學群', code:'ES', skills:["法律政治", "語文文學", "心理學"], goals:["提出解決問題的方案", "檢查是否符合規範", "服務與應對人群"], desc:'司法機關人員，在法庭中裁決或執行審判。包含民刑事判決、結婚見證等。' },
  { id:52, name:'議員/立法委員', field:'法政學群', code:'ES', skills:["法律政治", "行政", "公共安全"], goals:["調解衝突", "檢查是否符合規範", "提出解決問題的方案"], desc:'由人民選出，議決重大案件、制定或修改法律條文。' },
  { id:53, name:'禮儀師', field:'社會與心理學群', code:'ESC', skills:["顧客服務", "化學", "行政"], goals:["搬運與動手操作", "代表組織對外溝通", "協助和照顧他人"], desc:'指導葬禮進行，包含現場人員管理、場地布置、交通規劃、舉行儀式等。' },
  { id:54, name:'空服員', field:'外語/遊憩與運動學群', code:'ESC', skills:["顧客服務", "心理學", "公共安全"], goals:["安排工作和活動時程", "建立夥伴關係", "組織內部溝通"], desc:'提供旅客服務，讓乘客感到安全舒適。包含接待、設備使用說明、提供飲食。' },
  { id:55, name:'客服人員', field:'無特定學群', code:'ESC', skills:["顧客服務", "語文文學", "行政"], goals:["建立夥伴關係", "安排工作和活動時程", "提出解決問題的方案"], desc:'回應並處理顧客所提出的問題。' },
  { id:56, name:'按摩/美容師', field:'醫藥衛生/遊憩與運動學群', code:'ESR', skills:["顧客服務", "銷售行銷", "教育訓練"], goals:["服務與應對人群", "協助和照顧他人", "建立夥伴關係"], desc:'為顧客提供臉部和身體保養或按摩療程，藉此恢復活力或增加美觀。' },
  { id:57, name:'會計師', field:'財經學群', code:'CE', skills:["經濟會計", "行政", "數學"], goals:["安排工作和活動時程", "處理資料", "檢查是否符合規範"], desc:'分析企業財務現況，編製各種報表，包含資產負債、利潤虧損等項目。' },
  { id:58, name:'採購', field:'管理學群', code:'CE', skills:["管理", "行政", "銷售行銷"], goals:["建立夥伴關係", "安排工作和活動時程", "組織內部溝通"], desc:'購買企業所需的物品或服務。採購原物料、設備或工具等，以利生產。' },
  { id:59, name:'行政人員', field:'管理/無特定學群', code:'CER', skills:["行政", "顧客服務", "語文文學"], goals:["建立夥伴關係", "安排工作和活動時程", "組織內部溝通"], desc:'處理辦公室行政，可能包含接聽電話、設備操作、文件處理。' },
  { id:60, name:'公務員', field:'無特定/法政學群', code:'CES', skills:["管理", "顧客服務", "行政"], goals:["安排工作和活動時程", "組織內部溝通", "服務與應對人群"], desc:'在公家單位服務，處理行政、公文流程、民眾服務。' },
  { id:61, name:'資料與檔案管理員', field:'文史哲/資訊學群', code:'CI', skills:["行政", "資訊電子", "歷史文化"], goals:["搜尋資訊", "分析資訊", "代表組織對外溝通"], desc:'保存、維護並管理資料、文件、檔案及相關系統，包含數位內容或實際物品。' },
  { id:62, name:'精算師', field:'財經學群', code:'CIE', skills:["數學", "經濟會計", "資訊電子"], goals:["分析資訊", "處理資料", "提出解決問題的方案"], desc:'分析人口統計資料，進行風險預測、預估資金流動、計算保險費率等。' },
  { id:63, name:'金融投資分析師', field:'財經學群', code:'CIE', skills:["經濟會計", "數學", "語文文學"], goals:["處理資料", "分析資訊", "組織內部溝通"], desc:'收集市場資訊進行分析，研判趨勢並引導投資者進行投資。' },
  { id:64, name:'資訊安全人員', field:'資訊學群', code:'CIR', skills:["資訊電子", "通訊電信", "工程科技"], goals:["運用電腦工作", "找出關鍵資訊和線索", "持續進修專業知識"], desc:'保護網路、資訊和重要的電子設備；處理電腦安全漏洞和病毒。' },
  { id:65, name:'網站開發人員', field:'資訊/大眾傳播/建築與設計學群', code:'CIR', skills:["資訊電子", "教育訓練", "數學"], goals:["持續進修專業知識", "創新設計", "運用電腦工作"], desc:'分析使用者需求，設計網站內容，包含文字、圖形、影像等。' },
  { id:66, name:'人類學家', field:'社會與心理學群', code:'IA', skills:["社會人類", "教育訓練", "語文文學"], goals:["搜尋資訊", "處理資料", "分析資訊"], desc:'研究人類的行為、社會變遷、組織架構、語言和文化等。' },
  { id:67, name:'程式設計師', field:'資訊學群', code:'IC', skills:["資訊電子", "數學", "管理"], goals:["運用電腦工作", "持續進修專業知識", "分析資訊"], desc:'分析、編寫、修改、測試程式碼，開發電腦應用程式。' },
  { id:68, name:'數據分析師', field:'數理化/資訊學群', code:'ICE', skills:["數學", "資訊電子", "工程科技"], goals:["分析資訊", "創新設計", "提供諮詢"], desc:'收集並分析大量數據，依此歸納與預測未來趨勢、評估與訂定決策。' },
  { id:69, name:'藥師', field:'醫藥衛生學群', code:'ICS', skills:["醫學", "化學", "顧客服務"], goals:["持續進修專業知識", "找出關鍵資訊和線索", "檢查是否符合規範"], desc:'根據醫師的處方箋進行檢核，並提供所需之藥物。' },
  { id:70, name:'市場調查人員', field:'財經/管理/社會與心理學群', code:'IEC', skills:["銷售行銷", "顧客服務", "數學"], goals:["安排工作和活動時程", "建立夥伴關係", "分析資訊"], desc:'調查並研究市場現況與未來趨勢，提供行銷決策時所必需的資料。' },
  { id:71, name:'商業智慧分析師', field:'資訊/數理化/管理學群', code:'IEC', skills:["銷售行銷", "管理", "數學"], goals:["持續進修專業知識", "分析資訊", "組織內部溝通"], desc:'透過資料分析工具，研究過去企業資料，整理成報表輔佐決策。' },
  { id:72, name:'大氣科學家', field:'地球與環境/生命科學學群', code:'IR', skills:["數學", "地球環境", "資訊電子"], goals:["持續進修專業知識", "處理資料", "分析資訊"], desc:'研究氣象並解釋衛星、雷達和氣象預報等資料。' },
  { id:73, name:'電機工程師', field:'工程/數理化學群', code:'IR', skills:["工程科技", "設計", "資訊電子"], goals:["持續進修專業知識", "提出解決問題的方案", "創新設計"], desc:'開發、監測電機設備或電機系統的製造和安裝。' },
  { id:74, name:'航太工程師', field:'工程/數理化學群', code:'IR', skills:["工程科技", "設計", "機械"], goals:["持續進修專業知識", "製作圖稿與規格書並解說", "創新設計"], desc:'進行專案，設計、開發和測試飛機、飛彈和太空船等設備。' },
  { id:75, name:'人因工程師', field:'工程/社會與心理學群', code:'IR', skills:["心理學", "工程科技", "數學"], goals:["創新設計", "持續進修專業知識", "處理資料"], desc:'根據人類行為，設計設備工具或工作環境，讓人與系統互動發揮更大效益。' },
  { id:76, name:'生命科學家', field:'生命科學/生物資源學群', code:'IR', skills:["生命科學", "數學", "化學"], goals:["持續進修專業知識", "處理資料", "分析資訊"], desc:'研究各種生命的知識，包含起源、發展、結構和功能等。' },
  { id:77, name:'生化工程師', field:'數理化/工程/生命科學學群', code:'IR', skills:["生命科學", "工程科技", "化學"], goals:["找出關鍵資訊和線索", "持續進修專業知識", "處理資料"], desc:'以生命科學與化學知識、技術開發產品，解決人、動植物、微生物相關問題。' },
  { id:78, name:'化工工程師', field:'數理化/工程/生命科學學群', code:'IR', skills:["工程科技", "化學", "數學"], goals:["持續進修專業知識", "提出解決問題的方案", "處理資料"], desc:'設計化工廠的製造流程及開發化工產品，如化妝品、塑膠、水泥等。' },
  { id:79, name:'環工工程師', field:'地球與環境/工程學群', code:'IRC', skills:["工程科技", "數學", "設計"], goals:["持續進修專業知識", "處理資料", "提出解決問題的方案"], desc:'設計、規劃或執行與環境衛生相關的工程，如廢棄物處理等。' },
  { id:80, name:'機電工程師', field:'工程/數理化學群', code:'IRC', skills:["工程科技", "設計", "資訊電子"], goals:["製作圖稿與規格書並解說", "持續進修專業知識", "創新設計"], desc:'運用機械、電機與電腦工程原理，設計自動化或智慧型的系統與產品。' },
  { id:81, name:'機械工程師', field:'工程/數理化學群', code:'IRC', skills:["設計", "工程科技", "數學"], goals:["持續進修專業知識", "創新設計", "處理資料"], desc:'規劃和設計工具、引擎、機器等裝備，也會負責安裝、操作、維修等工作。' },
  { id:82, name:'光電工程師', field:'數理化/工程學群', code:'IRC', skills:["工程科技", "物理", "數學"], goals:["處理資料", "創新設計", "分析資訊"], desc:'運用工程與數學原理，研發光能利用的技術。' },
  { id:83, name:'電腦硬體工程師', field:'資訊/工程學群', code:'IRC', skills:["資訊電子", "工程科技", "數學"], goals:["創新設計", "持續進修專業知識", "處理資料"], desc:'研究、設計、開發與測試電腦硬體設備，或是監測製造與安裝過程。' },
  { id:84, name:'網管人員', field:'資訊學群', code:'IRC', skills:["資訊電子", "通訊電信", "行政"], goals:["運用電腦工作", "找出關鍵資訊和線索", "持續進修專業知識"], desc:'負責維繫企業的網路環境，進行維護與檢測，確保網路環境順暢運作。' },
  { id:85, name:'水土保育人員', field:'地球與環境/生物資源學群', code:'IRE', skills:["顧客服務", "教育訓練", "生命科學"], goals:["建立夥伴關係", "提出解決問題的方案", "持續進修專業知識"], desc:'規劃合理使用土地的方法，包含水土保持、控制土壤侵蝕等。' },
  { id:86, name:'材料工程師', field:'工程/數理化學群', code:'IRE', skills:["工程科技", "化學", "物理"], goals:["處理資料", "分析資訊", "創新設計"], desc:'評估材料和製程，製造符合產品設計與規格的材料，如金屬、塑膠、陶瓷等。' },
  { id:87, name:'牙醫師', field:'醫藥衛生學群', code:'IRS', skills:["顧客服務", "醫學", "生命科學"], goals:["找出關鍵資訊和線索", "提出解決問題的方案", "持續進修專業知識"], desc:'診斷、治療跟牙齒和口腔相關的疾病和受損。' },
  { id:88, name:'營養師', field:'醫藥衛生學群', code:'IS', skills:["教育訓練", "顧客服務", "生命科學"], goals:["持續進修專業知識", "搜尋資訊", "建立夥伴關係"], desc:'規劃食品與營養計畫，協助改善健康或控制疾病，也可能進行監督或諮詢。' },
  { id:89, name:'醫師', field:'醫藥衛生學群', code:'ISR', skills:["醫學", "治療諮商", "顧客服務"], goals:["協助和照顧他人", "提出解決問題的方案", "持續進修專業知識"], desc:'診斷、治療與協助預防各種疾病和傷害。' },
  { id:90, name:'獸醫', field:'醫藥衛生/生物資源學群', code:'ISR', skills:["醫學", "顧客服務", "生命科學"], goals:["找出關鍵資訊和線索", "提出解決問題的方案", "協助和照顧他人"], desc:'針對有疾病或障礙的動物進行診斷與治療。也可能從事研發、諮詢、銷售等。' },
  { id:91, name:'保全', field:'無特定學群', code:'RCE', skills:["公共安全", "管理", "顧客服務"], goals:["提出解決問題的方案", "檢查是否符合規範", "協助和照顧他人"], desc:'巡查或守衛社區、房屋或銀行等各種場所，防止偷盜、搶劫等違法行為。' },
  { id:92, name:'產品維修人員', field:'工程/資訊學群', code:'RCI', skills:["資訊電子", "工程科技", "機械"], goals:["持續進修專業知識", "搬運與動手操作", "維修設備"], desc:'修理電子或機械設備，包含電腦、通訊設備、各類運輸工具等。' },
  { id:93, name:'機長', field:'無特定/外語/工程學群', code:'RCI', skills:["交通運輸", "地球環境", "資訊電子"], goals:["控制機器與程序", "操作運載工具、儀器", "找出關鍵資訊和線索"], desc:'負責駕駛飛機運輸乘客或貨物，需要長時間訓練和相對應的執照。' },
  { id:94, name:'運動員', field:'遊憩與運動學群', code:'RE', skills:["運動保健", "治療諮商", "教育訓練"], goals:["體能活動", "建立夥伴關係", "教導與協助個人發展"], desc:'參與各項運動比賽，取得榮譽。' },
  { id:95, name:'廚師', field:'遊憩與運動學群', code:'REA', skills:["生資食科", "生產與作業", "顧客服務"], goals:["搬運與動手操作", "檢查是否符合規範", "體能活動"], desc:'準備食材，料理肉類、湯品、菜餚、甜點等。可能需要負責採購、研發菜色。' },
  { id:96, name:'警察', field:'法政學群', code:'REC', skills:["顧客服務", "公共安全", "法律政治"], goals:["找出關鍵資訊和線索", "調解衝突", "服務與應對人群"], desc:'負責執法、維護公共安全、保障人民生命財產、防治犯罪、逮捕犯人。' },
  { id:97, name:'動物飼養員', field:'生物資源/生命科學學群', code:'RI', skills:["生產與作業", "管理", "行政"], goals:["搬運與動手操作", "找出關鍵資訊和線索", "監控過程、物件或環境"], desc:'飼養動物，包含畜牧業(牛羊馬)、家禽、家畜或寵物等。需要記錄資料。' },
  { id:98, name:'地理與航照測繪員', field:'地球與環境/工程學群', code:'RIC', skills:["地球環境", "資訊電子", "數學"], goals:["持續進修專業知識", "處理資料", "運用電腦工作"], desc:'收集、分析和說明地理資訊。可能包含設計和規劃地理資訊系統。' },
  { id:99, name:'土木工程師', field:'工程/數理化學群', code:'RIC', skills:["工程科技", "設計", "建築營造"], goals:["指導與激勵部屬", "創新設計", "提出解決問題的方案"], desc:'規劃、設計、監督、維護工程與建築設施，包含道路、橋梁、港口、電廠等。' },
  { id:100, name:'農業與食品技術員', field:'生物資源/生命科學學群', code:'RIC', skills:["生命科學", "生產與作業", "資訊電子"], goals:["搬運與動手操作", "處理資料", "持續進修專業知識"], desc:'研發、改良和生產農業產品或食物；也可能從事動物研究、飼育和疾病預防。' }
];

// ===================================================================
// STATE
// ===================================================================
let liked    = new Set();   // occupation ids that are liked
let disliked = new Set();   // occupation ids that are disliked
let currentIndex = 0;

// ===================================================================
// URL PARAMS  (human-readable)
// Share URL format:  ?like=66,67,68
// ===================================================================

function buildShareURL() {
  const likedIds = [...liked].join(',');
  const params   = new URLSearchParams();
  if (likedIds) params.set('like', likedIds);
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function parseURLLiked() {
  const params = new URLSearchParams(window.location.search);
  const raw    = params.get('like');
  if (!raw) return null;

  const ids = new Set(
    raw.split(',')
       .map(s => parseInt(s.trim(), 10))
       .filter(n => !isNaN(n) && OCCUPATIONS.some(o => o.id === n))
  );
  return ids.size > 0 ? ids : null;
}

// ===================================================================
// INIT
// ===================================================================

function initOccupations() {
  const fromURL = parseURLLiked();
  if (fromURL) {
    liked = fromURL;
    switchMode('display');
  } else {
    switchMode('select');
  }
}

// ===================================================================
// MODE SWITCH
// ===================================================================

function switchMode(mode) {
  const views   = ['select-view', 'occ-spread-view', 'display-view', 'input-view'];
  const buttons = ['mode-select-btn', 'mode-spread-btn', 'mode-display-btn', 'mode-input-btn'];
  views.forEach(id   => { const el = document.getElementById(id);   if (el) el.style.display = 'none'; });
  buttons.forEach(id => { const el = document.getElementById(id);   if (el) el.classList.remove('active'); });

  if (mode === 'select') {
    const el = document.getElementById('select-view');
    const btn = document.getElementById('mode-select-btn');
    if (el) el.style.display = ''; if (btn) btn.classList.add('active');
    renderCards(); renderDots(); updateStatusBar(); renderChips();
  } else if (mode === 'spread') {
    const el = document.getElementById('occ-spread-view');
    const btn = document.getElementById('mode-spread-btn');
    if (el) el.style.display = ''; if (btn) btn.classList.add('active');
    renderOccSpreadCards(); renderChips(); updateStatusBar();
  } else if (mode === 'input') {
    const el = document.getElementById('input-view');
    const btn = document.getElementById('mode-input-btn');
    if (el) el.style.display = ''; if (btn) btn.classList.add('active');
    renderInputSlots();
    _fillOccSlotsFromState();
  } else {
    const el = document.getElementById('display-view');
    const btn = document.getElementById('mode-display-btn');
    if (el) el.style.display = ''; if (btn) btn.classList.add('active');
    renderDisplay();
  }
}

// ===================================================================
// SELECTION VIEW
// ===================================================================

function renderCards() {
  const track = document.getElementById('cardsTrack');
  track.innerHTML = '';

  OCCUPATIONS.forEach((occ, i) => {
    const isLiked    = liked.has(occ.id);
    const isDisliked = disliked.has(occ.id);
    const atMax      = liked.size >= MAX_LIKE;

    const slide = document.createElement('div');
    slide.className = 'occ-card-slide';
    slide.id = `occ-slide-${i}`;

    const statusLabel = isLiked ? '喜歡 ✓' : (isDisliked ? '不喜歡' : '');
    const statusClass = isLiked ? 'is-liked' : (isDisliked ? 'is-disliked' : '');

    slide.innerHTML = `
      <div class="occ-card-inner ${statusClass}">
        <div class="card-status-ribbon">${statusLabel}</div>
        <div class="occ-card-header">
          <div class="occ-code-badges">${renderCodeBadges(occ.code)}</div>
          <div class="occ-card-titles">
            <div class="occ-card-name">${occ.name}
              <span class="occ-id-badge">#${occ.id}</span>
            </div>
            <div class="occ-card-field">${occ.field}</div>
          </div>
        </div>
        <div class="occ-card-desc">${occ.desc}</div>
        <div class="occ-card-section">
          <div class="occ-section-label">知識技能</div>
          <div class="occ-tags">
            ${occ.skills.map(s => `<span class="occ-tag occ-tag-skill">${s}</span>`).join('')}
          </div>
        </div>
        <div class="occ-card-section">
          <div class="occ-section-label">職業目標</div>
          <div class="occ-tags">
            ${occ.goals.map(g => `<span class="occ-tag occ-tag-goal">${g}</span>`).join('')}
          </div>
        </div>
        <div class="action-buttons">
          <button class="action-btn like-btn ${isLiked ? 'selected' : ''}"
                  ${atMax && !isLiked ? 'disabled' : ''}
                  onclick="handleLike(${occ.id}, ${i})">
            <span class="action-icon">😊</span>喜歡
          </button>
          <button class="action-btn dislike-btn ${isDisliked ? 'selected' : ''}"
                  onclick="handleDislike(${occ.id}, ${i})">
            <span class="action-icon">😶</span>不喜歡
          </button>
        </div>
      </div>`;
    track.appendChild(slide);
  });

  updateCarouselPosition();
  updateArrows();
}

function renderCodeBadges(code) {
  return [...code].map(letter => {
    const c = CODE_COLORS[letter] || { color: '#6B7280', bg: '#F3F4F6' };
    return `<span class="occ-code-letter"
                  style="background:${c.bg}; color:${c.color}">${letter}</span>`;
  }).join('');
}

// ===================================================================
// ACTIONS
// ===================================================================

function handleLike(id, cardIndex) {
  if (liked.size >= MAX_LIKE && !liked.has(id)) {
    showToast(`最多只能選 ${MAX_LIKE} 個喜歡的職業！`);
    return;
  }
  liked.add(id);
  disliked.delete(id);
  afterAction(id, cardIndex);
}

function handleDislike(id, cardIndex) {
  disliked.add(id);
  liked.delete(id);
  afterAction(id, cardIndex);
}

function afterAction(id, cardIndex) {
  updateStatusBar();
  renderChips();
  refreshCardUI(cardIndex);
  updateDots();

  // Auto-advance to next unevaluated card (or just next if all done)
  const nextUnevaluated = findNextUnevaluated(cardIndex);
  if (nextUnevaluated !== null) {
    setTimeout(() => goToCard(nextUnevaluated), 300);
  }

  // Show complete banner when every card has been evaluated
  const evaluated = liked.size + disliked.size;
  if (evaluated === OCCUPATIONS.length) {
    document.getElementById('occ-complete-banner').style.display = '';
  }
}

function findNextUnevaluated(fromIndex) {
  // Search forward first, then wrap
  for (let i = fromIndex + 1; i < OCCUPATIONS.length; i++) {
    const occ = OCCUPATIONS[i];
    if (!liked.has(occ.id) && !disliked.has(occ.id)) return i;
  }
  for (let i = 0; i < fromIndex; i++) {
    const occ = OCCUPATIONS[i];
    if (!liked.has(occ.id) && !disliked.has(occ.id)) return i;
  }
  return null; // all evaluated
}

function refreshCardUI(cardIndex) {
  const occ      = OCCUPATIONS[cardIndex];
  const inner    = document.querySelector(`#occ-slide-${cardIndex} .occ-card-inner`);
  const ribbon   = document.querySelector(`#occ-slide-${cardIndex} .card-status-ribbon`);
  const likeBtn  = document.querySelector(`#occ-slide-${cardIndex} .like-btn`);
  const dislikeBtn = document.querySelector(`#occ-slide-${cardIndex} .dislike-btn`);
  if (!inner) return;

  const isLiked    = liked.has(occ.id);
  const isDisliked = disliked.has(occ.id);
  const atMax      = liked.size >= MAX_LIKE;

  inner.classList.toggle('is-liked',    isLiked);
  inner.classList.toggle('is-disliked', isDisliked);

  if (ribbon) ribbon.textContent = isLiked ? '喜歡 ✓' : (isDisliked ? '不喜歡' : '');

  if (likeBtn) {
    likeBtn.classList.toggle('selected', isLiked);
    likeBtn.disabled = atMax && !isLiked;
  }
  if (dislikeBtn) {
    dislikeBtn.classList.toggle('selected', isDisliked);
  }
}

// ===================================================================
// REMOVE LIKE (from chip)
// ===================================================================

function removeLike(id) {
  liked.delete(id);
  disliked.delete(id);

  const cardIndex = OCCUPATIONS.findIndex(o => o.id === id);
  if (cardIndex !== -1) refreshCardUI(cardIndex);

  // Re-enable like buttons on all cards that were disabled at MAX
  OCCUPATIONS.forEach((_, i) => refreshCardUI(i));

  // Also refresh spread view
  refreshOccSpreadCardUI(id);
  refreshAllOccSpreadDisabled();

  updateStatusBar(); renderChips(); updateDots();
  document.getElementById('occ-complete-banner').style.display = 'none';
}

// ===================================================================
// STATUS BAR + CHIPS
// ===================================================================

function updateStatusBar() {
  const evaluated = liked.size + disliked.size;
  const total     = OCCUPATIONS.length;
  const remaining = total - evaluated;
  const pct       = (evaluated / total) * 100;

  const counterEl   = document.getElementById('liked-counter');
  const progressEl  = document.getElementById('occ-progress-fill');
  const labelEl     = document.getElementById('occ-progress-label');
  const remainingEl = document.getElementById('occ-remaining-text');

  if (counterEl)  counterEl.innerHTML =
    `<span class="badge-num">${liked.size}</span> / ${MAX_LIKE} 已選喜歡`;
  if (progressEl) progressEl.style.width = `${pct}%`;
  if (labelEl)    labelEl.textContent = `已評估 ${evaluated} / ${total} 張`;
  if (remainingEl) {
    remainingEl.textContent = remaining > 0
      ? `還有 ${remaining} 張未評估`
      : '所有卡片已評估完畢 ✓';
  }
}

function _renderChipContainer(containerId, countId) {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;
  if (countEl) countEl.textContent = `${liked.size} / ${MAX_LIKE}`;
  if (liked.size === 0) { container.innerHTML = `<span class="liked-chips-empty">尚未選擇喜歡的職業</span>`; return; }
  container.innerHTML = [...liked].map(id => {
    const occ = OCCUPATIONS.find(o => o.id === id);
    if (!occ) return '';
    return `<div class="liked-chip">${occ.name}<button class="liked-chip-remove" onclick="removeLike(${id})" title="移除 ${occ.name}">✕</button></div>`;
  }).join('');
}

function renderChips() {
  // Also update spread view chip strip (if exists)
  _renderChipContainer('occ-spr-liked-chips', 'occ-spr-liked-count');

  const container = document.getElementById('liked-chips');
  const countEl   = document.getElementById('chips-count');
  if (!container) return;

  if (countEl) countEl.textContent = `${liked.size} / ${MAX_LIKE}`;

  if (liked.size === 0) {
    container.innerHTML = `<span class="liked-chips-empty">尚未選擇喜歡的職業</span>`;
    return;
  }

  container.innerHTML = [...liked].map(id => {
    const occ = OCCUPATIONS.find(o => o.id === id);
    if (!occ) return '';
    return `
      <div class="liked-chip">
        ${occ.name}
        <button class="liked-chip-remove" onclick="removeLike(${id})"
                title="移除 ${occ.name}">✕</button>
      </div>`;
  }).join('');
}

// ===================================================================
// CAROUSEL
// ===================================================================

function goToCard(i) {
  currentIndex = Math.max(0, Math.min(i, OCCUPATIONS.length - 1));
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
  if (next) next.disabled = currentIndex === OCCUPATIONS.length - 1;
}

function renderDots() {
  const dotsEl = document.getElementById('carousel-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  OCCUPATIONS.forEach((occ, i) => {
    const dot = document.createElement('div');
    const stateClass = liked.has(occ.id) ? 'liked' : (disliked.has(occ.id) ? 'disliked' : '');
    dot.className = `carousel-dot ${stateClass} ${i === currentIndex ? 'active' : ''}`;
    dot.title = occ.name;
    dot.onclick = () => goToCard(i);
    dotsEl.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll('#carousel-dots .carousel-dot').forEach((dot, i) => {
    const occ = OCCUPATIONS[i];
    dot.className = 'carousel-dot';
    if (liked.has(occ.id))    dot.classList.add('liked');
    else if (disliked.has(occ.id)) dot.classList.add('disliked');
    if (i === currentIndex)   dot.classList.add('active');
  });
}

// ===================================================================
// DISPLAY VIEW
// ===================================================================

function renderDisplay() {
  const grid    = document.getElementById('display-grid');
  const countEl = document.getElementById('display-liked-count');
  if (!grid) return;

  if (countEl) countEl.textContent = `共 ${liked.size} 個職業`;

  const likedOccs = OCCUPATIONS.filter(o => liked.has(o.id));

  if (likedOccs.length === 0) {
    grid.innerHTML = `
      <div class="display-empty-state" style="grid-column:1/-1">
        <div class="empty-icon">💼</div>
        <p>尚未選擇任何喜歡的職業</p>
      </div>`;
    return;
  }

  grid.innerHTML = likedOccs.map(occ => `
    <div class="display-occ-card">
      <div class="display-card-header">
        <div class="occ-code-badges" style="margin-right:10px">
          ${renderCodeBadges(occ.code)}
        </div>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--gray-800)">${occ.name}</div>
          <div style="font-size:11px;color:var(--gray-400);margin-top:2px">${occ.field}</div>
        </div>
      </div>
      <div class="display-card-body">
        <div class="display-card-desc">${occ.desc}</div>
        <div class="occ-tags" style="margin-bottom:6px">
          ${occ.skills.map(s => `<span class="occ-tag occ-tag-skill">${s}</span>`).join('')}
        </div>
        <div class="occ-tags">
          ${occ.goals.map(g => `<span class="occ-tag occ-tag-goal">${g}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

// ===================================================================
// SHARE
// ===================================================================

function shareResult() {
  if (liked.size === 0) {
    showToast('請先選擇喜歡的職業再分享！');
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
  if (!confirm('確定要重新開始嗎？目前所有選擇將會清除。')) return;
  liked    = new Set();
  disliked = new Set();
  currentIndex = 0;
  history.replaceState({}, '', location.pathname);
  document.getElementById('occ-complete-banner').style.display = 'none';
  switchMode('select');
}

// ===================================================================
// QUICK-INPUT PANEL  (counselor tool)
// ===================================================================

const INPUT_SLOTS = 15;

function renderInputSlots() {
  const grid = document.getElementById('input-slots-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < INPUT_SLOTS; i++) {
    const slot = document.createElement('div');
    slot.className = 'input-slot';
    slot.innerHTML = `
      <div class="input-slot-label">編號 ${i + 1}</div>
      <input type="number" class="input-slot-field"
             id="input-slot-${i}"
             min="1" max="${OCCUPATIONS[OCCUPATIONS.length - 1].id}"
             placeholder="–"
             oninput="onSlotInput(${i})">
      <div class="input-slot-preview" id="input-slot-preview-${i}"></div>`;
    grid.appendChild(slot);
  }
  // Clear result box
  const resultBox = document.getElementById('input-result-box');
  if (resultBox) resultBox.classList.remove('visible');
  document.getElementById('input-error-summary').textContent = '';
}

let _occRevalidating = false;

function onSlotInput(slotIndex) {
  const field   = document.getElementById(`input-slot-${slotIndex}`);
  const preview = document.getElementById(`input-slot-preview-${slotIndex}`);
  if (!field || !preview) return;

  const raw = field.value.trim();
  if (raw === '') {
    field.className = 'input-slot-field';
    preview.className = 'input-slot-preview';
    preview.textContent = '';
    _applyOccInputToState();
    return;
  }

  const num = parseInt(raw, 10);
  if (isNaN(num) || num !== parseFloat(raw) || num < 1) {
    field.className = 'input-slot-field is-error';
    preview.className = 'input-slot-preview preview-error';
    preview.textContent = '請輸入正整數';
    _applyOccInputToState();
    return;
  }

  const occ = OCCUPATIONS.find(o => o.id === num);
  if (!occ) {
    field.className = 'input-slot-field is-error';
    preview.className = 'input-slot-preview preview-error';
    preview.textContent = `找不到編號 ${num}`;
    _applyOccInputToState();
    return;
  }

  // Check duplicate across other slots
  const isDup = checkDuplicate(slotIndex, num);
  if (isDup) {
    field.className = 'input-slot-field is-dup';
    preview.className = 'input-slot-preview preview-dup';
    preview.textContent = '重複的編號';
    _applyOccInputToState();
    return;
  }

  field.className = 'input-slot-field is-valid';
  preview.className = 'input-slot-preview preview-name';
  preview.textContent = occ.name;

  // Re-validate other slots (guarded against infinite recursion)
  if (!_occRevalidating) {
    _occRevalidating = true;
    revalidateAllSlots();
    _occRevalidating = false;
  }
  _applyOccInputToState();
}

function checkDuplicate(currentSlot, num) {
  for (let i = 0; i < INPUT_SLOTS; i++) {
    if (i === currentSlot) continue;
    const f = document.getElementById(`input-slot-${i}`);
    if (!f || f.value.trim() === '') continue;
    if (parseInt(f.value.trim(), 10) === num) return true;
  }
  return false;
}

function revalidateAllSlots() {
  for (let i = 0; i < INPUT_SLOTS; i++) {
    const field = document.getElementById(`input-slot-${i}`);
    if (!field || field.value.trim() === '') continue;
    // Only re-check slots that currently have valid or dup state
    const cls = field.className;
    if (cls.includes('is-valid') || cls.includes('is-dup')) {
      onSlotInput(i);
    }
  }
}

function generateInputURL() {
  const summaryEl = document.getElementById('input-error-summary');
  if (liked.size === 0) {
    summaryEl.textContent = '⚠️ 請至少輸入一個職業編號';
    return;
  }
  summaryEl.textContent = '';

  const ids    = [...liked];
  const params = new URLSearchParams();
  params.set('like', ids.join(','));
  const url = `${location.origin}${location.pathname}?${params.toString()}`;

  const resultBox = document.getElementById('input-result-box');
  const urlEl     = document.getElementById('input-result-url');
  const namesEl   = document.getElementById('input-result-names');

  if (urlEl)  urlEl.textContent = url;
  if (namesEl) {
    const matched = ids.map(id => OCCUPATIONS.find(o => o.id === id)).filter(Boolean);
    namesEl.innerHTML = matched.map(occ =>
      `<span class="occ-tag occ-tag-skill">${occ.id} ${occ.name}</span>`
    ).join('');
  }
  if (resultBox) resultBox.classList.add('visible');
  window._inputGeneratedURL = url;
}

function copyInputURL() {
  const url = window._inputGeneratedURL;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => {
    showToast('✅ 連結已複製到剪貼簿！');
  }).catch(() => {
    prompt('複製此連結：', url);
  });
}

function clearInputPanel() {
  liked    = new Set();
  disliked = new Set();
  currentIndex = 0;
  renderInputSlots();
  renderCards(); renderDots(); updateStatusBar(); renderChips();
  const rb = document.getElementById('input-result-box');
  if (rb) rb.classList.remove('visible');
  document.getElementById('input-error-summary').textContent = '';
}

// ===================================================================
// INPUT ↔ STATE SYNC
// ===================================================================

// Read all is-valid slots → rebuild liked Set → re-render other views.
function _applyOccInputToState() {
  const newLiked = new Set();
  for (let i = 0; i < INPUT_SLOTS; i++) {
    const f = document.getElementById(`input-slot-${i}`);
    if (f && f.classList.contains('is-valid')) {
      const id = parseInt(f.value, 10);
      if (!isNaN(id)) newLiked.add(id);
    }
  }
  liked = newLiked;
  liked.forEach(id => disliked.delete(id)); // can't be both
  renderCards(); renderDots(); updateStatusBar(); renderChips();
}

// Pre-fill slots from current liked Set (called when entering input mode).
function _fillOccSlotsFromState() {
  const likedArr = [...liked];
  for (let i = 0; i < INPUT_SLOTS; i++) {
    const field   = document.getElementById(`input-slot-${i}`);
    const preview = document.getElementById(`input-slot-preview-${i}`);
    if (!field || !preview) continue;
    if (i < likedArr.length) {
      field.value = likedArr[i];
      onSlotInput(i);
    }
    // empty slots already blank from renderInputSlots()
  }
}

// ===================================================================
// SPREAD VIEW
// ===================================================================

function renderOccSpreadCards() {
  const grid = document.getElementById('occ-spread-grid');
  if (!grid) return;
  grid.innerHTML = '';
  OCCUPATIONS.forEach(occ => {
    const isLiked    = liked.has(occ.id);
    const isDisliked = disliked.has(occ.id);
    const atMax      = liked.size >= MAX_LIKE;
    const stateClass = isLiked ? 'spr-is-liked' : (isDisliked ? 'spr-is-disliked' : '');

    const wrap = document.createElement('div');
    wrap.className = 'occ-spr-wrap';
    wrap.id = `occ-spr-wrap-${occ.id}`;
    wrap.innerHTML = `
      <div class="occ-spr-actions">
        <button class="occ-spr-btn spr-like-btn ${isLiked ? 'selected' : ''}"
                ${atMax && !isLiked ? 'disabled' : ''}
                onclick="handleLikeSpread(${occ.id})">
          <span>😊</span><span>喜歡</span>
        </button>
        <button class="occ-spr-btn spr-dislike-btn ${isDisliked ? 'selected' : ''}"
                onclick="handleDislikeSpread(${occ.id})">
          <span>😶</span><span>不喜歡</span>
        </button>
      </div>
      <div class="occ-spr-card ${stateClass}">
        <div class="occ-spr-codes">${renderCodeBadges(occ.code)}</div>
        <div class="occ-spr-name">${occ.name}</div>
        <div class="occ-spr-field">${occ.field}</div>
        <div style="font-size:10px;color:var(--gray-400);margin-top:2px">#${occ.id}</div>
      </div>`;
    grid.appendChild(wrap);
  });
}

function handleLikeSpread(id) {
  if (liked.size >= MAX_LIKE && !liked.has(id)) {
    showToast(`最多只能選 ${MAX_LIKE} 個喜歡的職業！`); return;
  }
  liked.add(id); disliked.delete(id);
  refreshOccSpreadCardUI(id); refreshAllOccSpreadDisabled();
  updateStatusBar(); renderChips();
}

function handleDislikeSpread(id) {
  disliked.add(id); liked.delete(id);
  refreshOccSpreadCardUI(id); refreshAllOccSpreadDisabled();
  updateStatusBar(); renderChips();
}

function refreshOccSpreadCardUI(id) {
  const wrap = document.getElementById(`occ-spr-wrap-${id}`);
  if (!wrap) return;
  const isLiked    = liked.has(id);
  const isDisliked = disliked.has(id);
  const card    = wrap.querySelector('.occ-spr-card');
  const likeBtn = wrap.querySelector('.spr-like-btn');
  const disBtn  = wrap.querySelector('.spr-dislike-btn');
  if (card) card.className = 'occ-spr-card' + (isLiked ? ' spr-is-liked' : isDisliked ? ' spr-is-disliked' : '');
  if (likeBtn) likeBtn.classList.toggle('selected', isLiked);
  if (disBtn)  disBtn.classList.toggle('selected', isDisliked);
}

function refreshAllOccSpreadDisabled() {
  const atMax = liked.size >= MAX_LIKE;
  OCCUPATIONS.forEach(occ => {
    const wrap = document.getElementById(`occ-spr-wrap-${occ.id}`);
    if (!wrap) return;
    const likeBtn = wrap.querySelector('.spr-like-btn');
    if (likeBtn) likeBtn.disabled = atMax && !liked.has(occ.id);
  });
}

// ===================================================================
// TOUCH / SWIPE
// ===================================================================

let _touchStartX = 0;
let _touchStartY = 0;

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('cardsViewport');
  if (!viewport) return;

  viewport.addEventListener('touchstart', e => {
    _touchStartX = e.touches[0].clientX;
    _touchStartY = e.touches[0].clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _touchStartX;
    const dy = e.changedTouches[0].clientY - _touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextCard(); else prevCard();
    }
  }, { passive: true });
});
