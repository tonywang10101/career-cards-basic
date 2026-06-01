/* ===================================================================
   inventory.js – 職能盤點 (Inventory) tool logic
   =================================================================== */

// ===== CONSTANTS =====
const MAX_STRENGTH = 7;
const MAX_WEAKNESS = 7;

const CATEGORY_META = {
  'Action & Execution':  { color: '#F97316', bg: '#FFF7ED', label: '行動執行' },
  'Thinking & Mindset':  { color: '#6366F1', bg: '#EEF2FF', label: '思維心態' },
  'People & Leadership': { color: '#10B981', bg: '#ECFDF5', label: '人際領導' },
  'Skills & Application':{ color: '#0EA5E9', bg: '#F0F9FF', label: '技能應用' }
};

// ===== CARD DATA =====
const INVENTORY_CARDS = [
  { id:1, category:"Action & Execution", title:"追求品質",
    descLines:["自我要求高，用高標準做事", "對瑕疵不妥協，堅持做到好", "持續打磨細節", "樹立品質標竿，超越既有水準"],
    shadow1:"過度專注局部，延誤整體時效", shadow2:"標準過高，對他人過度挑剔，合作氣氛緊繃",
    consequence1:"進度延宕", adjustment1:"設定「夠好的程度」，到點就交付",
    consequence2:"團隊挫折", adjustment2:"先肯定80分，再提 1-2 個最關鍵優化點",
    fitRole:"品管、客戶服務、法務", fitTask:"打造高價值與影響力品牌", fitGeneral:"建立高標準信譽，贏得客戶信賴",
    improveSteps:["1. 設定標竿 (Benchmark），拆解關鍵要素", "2. 事情對齊標準，和利害關係人確認「要好到什麼程度」"] },
  { id:2, category:"Action & Execution", title:"目標導向",
    descLines:["鎖定目標、聚焦最終成果", "每週檢視進度，必要時主動調整路線", "以成果為核心，排除非必要流程", "遇到干擾時會回到目標檢核：這件事有幫助嗎？"],
    shadow1:"為達到目標不擇手段", shadow2:"只在乎結果，忽略人的感受",
    consequence1:"忽視秩序、破壞信任", adjustment1:"堅守正直，在規範內行事",
    consequence2:"團隊士氣低落，流動率高", adjustment2:"兼顧關係，平衡管理",
    fitRole:"業務、專案經理", fitTask:"季度業績衝刺、推動組織變革", fitGeneral:"協助團隊在混亂中聚焦，收斂方向",
    improveSteps:["1. 練習 SMART 原則，設定清晰目標", "2. 建立檢核表：完成/延宕/阻礙/下一步"] },
  { id:3, category:"Action & Execution", title:"提升效率",
    descLines:["總能找到最快路徑，省時省力", "厭惡冗餘流程，主動尋求簡化", "會把重複工作變模板或自動化", "以更少投入，創造更多產出"],
    shadow1:"只追速度，品質下滑、錯誤增加", shadow2:"抄捷徑，跳過必要流程",
    consequence1:"產出品質不穩，後續修改更耗時", adjustment1:"建立檢查清單，快但不能錯",
    consequence2:"埋下潛在溝通與執行風險，引發後續問題", adjustment2:"在規範和協作內加速",
    fitRole:"流程改善、生產管理、營運", fitTask:"導入新系統、優化工作流", fitGeneral:"擴大範圍協助提升團隊效率",
    improveSteps:["1. 導入敏捷開發精神，小步快跑", "2. 學習時間管理（如蕃茄鐘）與工具"] },
  { id:4, category:"Action & Execution", title:"擷取重點",
    descLines:["能快速抓取大量資訊中的核心", "會把資訊整理成 3-5 個關鍵點", "精準判斷重要度與緊急度", "善於筆記或重點整理"],
    shadow1:"簡化過頭，忽略訊息脈絡", shadow2:"缺乏耐心接收資訊，過早下判斷",
    consequence1:"資訊傳遞失真，他人理解錯誤", adjustment1:"總結後，多一步確認細節",
    consequence2:"誤判情勢，做出錯誤決策", adjustment2:"重新審慎核對完整資訊",
    fitRole:"幕僚、顧問、高階主管特助", fitTask:"彙報、商業分析、策略/跨部門會議", fitGeneral:"會議最後5分鐘做「共識回述」",
    improveSteps:["1. 閱讀資訊後，強迫自己寫下幾句摘要", "2. 練習艾森豪矩陣，區分輕重緩急"] },
  { id:5, category:"Action & Execution", title:"責任承諾",
    descLines:["答應的事會做到，無法達成會提前預警", "容易承擔權責不清的任務", "有錯會承擔，並提出補救方案", "交付前會自我檢查、主動回報進度，讓人好合作"],
    shadow1:"過度承諾、累死自己又自責", shadow2:"單打獨鬥、不願求助；難以授權、讓人誤會想獨裁",
    consequence1:"答應許多事情卻做不到", adjustment1:"承諾前誠實評估能力與時程",
    consequence2:"效率變差甚至突然崩潰", adjustment2:"學會求助，尋求支援",
    fitRole:"任何工作、客戶服務", fitTask:"關鍵專案執行、危機處理", fitGeneral:"建立團隊當責文化的基石",
    improveSteps:["1. 練習「小承諾」並主動回報進度", "2. 建立提醒系統（行事曆/任務清單），不遺漏事情"] },
  { id:6, category:"Action & Execution", title:"廣泛收集",
    descLines:["充滿好奇心，主動挖掘", "未來可能會用到", "擁有多元豐富的資訊來源或人脈網", "會想知道或擁有好東西（情報、人脈、知識、資源等）"],
    shadow1:"缺乏篩選，收集很多但用不到、無法斷捨離", shadow2:"只有輸入沒有輸出",
    consequence1:"抓不到重點，浪費時間", adjustment1:"先對應問題，再精準蒐集",
    consequence2:"無法產出洞察", adjustment2:"練習輸出觀點或方案",
    fitRole:"市場研究、策略規劃、研發", fitTask:"競品分析、趨勢預測、新市場開發", fitGeneral:"決策時，提供更宏觀的視角",
    improveSteps:["1. 練習針對某個主題收集資料", "2. 培養對事物的好奇心和開放心態"] },
  { id:7, category:"Action & Execution", title:"規劃秩序",
    descLines:["嚴格遵守流程規範", "遵守法規與資料保護", "落實版本控制與檔案命名", "會把流程寫成 SOP"],
    shadow1:"抗拒改變與創新、逃避模糊情境，面對例外狀況難以變通", shadow2:"流程大於目的，文件過多拖累速度",
    consequence1:"僵化", adjustment1:"為 SOP 設「彈性條款」，理解規範背後的目的，彈性應對",
    consequence2:"增加不必要的內耗與文書作業", adjustment2:"精簡到「最低可行文件」",
    fitRole:"醫藥、金融、法務、製造、財會、稽核、品管、營運", fitTask:"建立制度、風險控管、SOP撰寫", fitGeneral:"規則的遵守與把關",
    improveSteps:["1. 從一條流程開始寫 SOP", "2. 嘗試理解規範的重要性"] },
  { id:8, category:"Action & Execution", title:"資源應用",
    descLines:["清楚知道手邊有哪些人、時、錢、工具可用", "會借力使力（外包、合作、授權）", "善於整合資源與工具，調度時程、錯開需求高峰", "會比較方案的投入/產出比，用最省力的方法達成目標"],
    shadow1:"過度依賴人脈，忽視自身實力", shadow2:"借力不顧品質，外包難以控管",
    consequence1:"缺乏硬實力，難以獨當一面", adjustment1:"資源是槓桿，核心能力才是根本",
    consequence2:"外包控管", adjustment2:"設定驗收條款",
    fitRole:"專案經理、公關、新創", fitTask:"預算緊、時間趕的案子", fitGeneral:"資源盤點表常態化",
    improveSteps:["1. 盤點人脈地圖，並主動維護", "2. 練習互惠，主動提供價值"] },
  { id:9, category:"Action & Execution", title:"靈活應變",
    descLines:["擁抱變化，靈活運用工具或規則", "遇到突發狀況，能迅速調整心態並應對", "根據情況調整行為或方法，不守舊", "在模糊不清的狀態下能快速判斷情勢，當機立斷"],
    shadow1:"變來變去，團隊無所適從", shadow2:"只救火、立即反應，但沒有解決根本問題",
    consequence1:"頻繁變動，難以累積成果", adjustment1:"公告「變更準則」",
    consequence2:"留下許多管理債和營運債", adjustment2:"事後保留完整時間解決問題",
    fitRole:"新創、市場行銷、專案管理、客戶服務", fitTask:"危機處理、應對市場變化、活動現場", fitGeneral:"應對突發狀況",
    improveSteps:["1. 刻意讓自己跨出舒適圈，接觸新事物", "2. 學會「最小可行調整」思維"] },
  { id:10, category:"Action & Execution", title:"統籌規劃",
    descLines:["化繁為簡，拆解複雜任務", "考量變數、找到資源配置的最佳做法", "擅長安排時程、資源與分工", "制定行動藍圖，設定里程碑與交付物"],
    shadow1:"規劃過度，花太多時間在準備和找最佳方案", shadow2:"控制欲強，管太細造成壓力",
    consequence1:"錯失時機，計劃趕不上變化", adjustment1:"完成 80% 的計劃就去行動",
    consequence2:"個人主導太多導致團隊被動", adjustment2:"抓大放小，練習授權",
    fitRole:"專案經理、活動策劃、幕僚", fitTask:"大型專案導入、年度計劃、活動籌辦", fitGeneral:"共用甘特圖或儀表板，讓複雜任務視覺化，對齊所有人的認知",
    improveSteps:["1. 學習 WBS 工作分解結構", "2. 學習只用專案管理工具"] },
  { id:11, category:"Action & Execution", title:"持續優化",
    descLines:["不滿足現況，總在問能更好嗎", "持續迭代改善", "對現有流程提出質疑，尋求升級", "把問題變成改進目標"],
    shadow1:"快速大改，或尚未看到成效就又再改", shadow2:"過度優化，投入與產出不成比例",
    consequence1:"團隊疲於奔命", adjustment1:"逐步施行優化，檢驗成效再推進",
    consequence2:"浪費資源", adjustment2:"每次迭代前評估投入/回報，只做關鍵優化",
    fitRole:"流程改善、營運管理、產品經理", fitTask:"數位與AI轉型、流程再造、成本控制", fitGeneral:"找到缺口或痛點提出改善建議",
    improveSteps:["1. 建立個人改善日誌，紀錄優化", "2. 訪問使用者（內/外部），尋找痛點"] },
  { id:12, category:"Action & Execution", title:"積極主動",
    descLines:["主動把握、爭取或創造機會", "超越職責範圍，主動補位協作", "預見未來需求，先一步採取行動", "不會處於被動、依賴或等待他人"],
    shadow1:"被視為愛出風頭、侵略性高、搶別人工作", shadow2:"過度熱心，把自己累垮",
    consequence1:"引起反感，破壞協作關係", adjustment1:"事前評估界線與範疇",
    consequence2:"攬事卻搞砸", adjustment2:"先確認方向和評估自身狀況再承接",
    fitRole:"業務開發、管理職、新專案啟動", fitTask:"新市場開拓、建立新制度、危機預防", fitGeneral:"成為團隊的發動機，感染他人",
    improveSteps:["1. 每週設定一個主動行動目標", "2. 看到問題，帶著解決方案去回報"] },
  { id:13, category:"Action & Execution", title:"解決問題",
    descLines:["擅長釐清問題有關的影響因素", "面對複雜難題，能保持冷靜", "找出根本解 (Root Cause)", "預見潛在風險，建立處理機制"],
    shadow1:"陷入分析癱瘓，無法行動", shadow2:"不勾偷，只選自己熟悉的解法",
    consequence1:"錯失解決問題的黃金時機", adjustment1:"設分析停損點，推最小可行方案",
    consequence2:"解方不接地氣，或推動受阻", adjustment2:"納入利害關係人共同討論",
    fitRole:"工程師、顧問、幕僚、客服主管", fitTask:"客訴處理、流程改善、危機應對", fitGeneral:"成為團隊的拆彈專家或偵探",
    improveSteps:["1. 學習 5 Whys 分析法", "2. 練習問題重寫：把抱怨改成可解的題目"] },
  { id:14, category:"Action & Execution", title:"冒險挑戰",
    descLines:["願意挑戰高難度目標，不懼失敗", "願意嘗試新市場、新事物、新方法", "能評估風險，在可控範圍內冒險", "視失敗為學習，快速復原"],
    shadow1:"樂觀變成豪賭，低估風險和困難", shadow2:"追求刺激，認為基礎很無聊",
    consequence1:"造成巨大損失或不可逆傷害", adjustment1:"冒險不等於賭博，做好評估",
    consequence2:"基礎不穩，挑戰注定失敗", adjustment2:"先紮實基本功再談顛覆",
    fitRole:"創新、業務開發、研發", fitTask:"新產品上市、開拓新市場、組織轉型、跨國拓點", fitGeneral:"激勵團隊，挑戰不可能的任務",
    improveSteps:["1. 主動爭取跳出舒適圈的任務", "2. 從低風險小挑戰開始"] },
  { id:15, category:"Action & Execution", title:"毅力堅持",
    descLines:["長期任務能維持節奏，不暴衝", "面對挫折會調整策略而非放棄", "專注長期目標，不因短期困難動搖", "踏實穩定、默默專注"],
    shadow1:"固執不懂變通，在錯誤的方向堅持，浪費資源", shadow2:"忽視個人的極限和健康",
    consequence1:"不斷投入沉沒成本", adjustment1:"區分何時該堅持、何時該放棄",
    consequence2:"身心耗竭", adjustment2:"學習配速與休息",
    fitRole:"長期研發、長線業務（toB市場）、創業", fitTask:"長期專案、重大變革、高壓環境", fitGeneral:"展現恆毅力，穩定團隊軍心",
    improveSteps:["1. 建立支持系統（夥伴、教練）", "2. 視覺化紀錄進展，累積小小成就感"] },
  { id:16, category:"Action & Execution", title:"行動執行",
    descLines:["快速啟動，不拖泥帶水", "任務落地，即知即行", "專注當下，解決眼前具體障礙", "具備強大推進力"],
    shadow1:"只顧執行，忘記對齊核心目標", shadow2:"缺乏規劃，邊做邊想導致重工",
    consequence1:"戰術勤奮掩蓋戰略懶惰", adjustment1:"任務前和過程中確認目標",
    consequence2:"資源浪費", adjustment2:"建立前期規劃 SOP",
    fitRole:"業務、倉儲物流、生產線", fitTask:"活動現場執行、危機處理小組", fitGeneral:"消除拖延，帶動專案的執行節奏",
    improveSteps:["1. 每日工作先列出今日 Top 3", "2. 將大任務拆解為「立刻可做」的10分鐘小任務"] },
  { id:17, category:"Action & Execution", title:"時間管理",
    descLines:["區分輕重緩急，專注要是", "視時間為寶貴資產，精打細算", "批次處理相似任務，降低切換成本", "短時間完成多項任務會很滿足"],
    shadow1:"任務導向，人際互動失去溫度", shadow2:"安排過密",
    consequence1:"關係疏離", adjustment1:"將溝通與關懷視為必要的時間投資",
    consequence2:"明明有時間但是感性上已經不想去做", adjustment2:"照顧自己的身心能量",
    fitRole:"主管、專案管理、特助", fitTask:"多專案並行、遠距/跨時區的協作", fitGeneral:"準確預估工時，提升承諾的可信度",
    improveSteps:["1. 學習艾森豪矩陣，斷捨離不重要的瑣事", "2. 紀錄「時間日誌」，每週檢視時間花在哪裡"] },
  { id:18, category:"Action & Execution", title:"成就導向",
    descLines:["創造獨特或重大的成果", "享受成就達成的滿足感", "需要用客觀標準衡量進步", "閒不下來，自我驅動無需外在鞭策"],
    shadow1:"對自己或現況永不滿意\n容易變成工作狂或身心失衡", shadow2:"沒產出或進步就會感到沮喪覺得自己沒價值",
    consequence1:"忽略現有成果、缺乏成就感而焦慮", adjustment1:"定義夠好的標準",
    consequence2:"過勞、績效與創造力下降", adjustment2:"培養健康休息",
    fitRole:"業務、創業、開拓市場、打造產品", fitTask:"業務、產品上線衝刺、競賽", fitGeneral:"建立「成果看板+里程碑審查」節奏",
    improveSteps:["1. 針對任務做「一頁式目標」：目標值、里程碑、風險、資源、驗收標準", "2. 每週追蹤進度與阻礙"] },
  { id:19, category:"Thinking & Mindset", title:"自我覺察",
    descLines:["知道自己的優勢、劣勢與極限", "能覺知情緒、想法與感受", "在收到他人回饋時，能反思是否屬實", "清楚自己的價值觀"],
    shadow1:"過度內省而鑽牛角尖，影響自信、裹足不前", shadow2:"公開過量：在不適合的場合過度自我揭露",
    consequence1:"害怕犯錯，失去行動勇氣", adjustment1:"設定反思時限，聚焦可控行動",
    consequence2:"不適宜的自我揭露", adjustment2:"練習情境判斷，在安全場合才深談",
    fitRole:"領導者、教練、人資、創作型職業、人文社會與身心靈領域", fitTask:"善於反思", fitGeneral:"鼓勵自己和他人活出真實的自我",
    improveSteps:["1. 練習正念，調節感受", "2. 撰寫日誌記錄思考和情緒"] },
  { id:20, category:"Thinking & Mindset", title:"創新思維",
    descLines:["挑戰既有的框架，質疑理所當然", "會引用類比與跨域點子，能把問題換句話說來找到新角度", "允許小實驗，對失敗友善", "保持高度好奇，探索未來可能"],
    shadow1:"創意不切實際，輕忽代價與實際價值、缺乏落地規劃", shadow2:"追逐新奇點子，導致資源發散",
    consequence1:"淪為空談，提案不被信任", adjustment1:"同步納入可行性分析",
    consequence2:"頻繁切換方向", adjustment2:"先放入點子儲存庫，學會收斂",
    fitRole:"行銷、廣告、產品開發", fitTask:"企業策略規劃、新事業開發", fitGeneral:"協助建立點子庫與評估表",
    improveSteps:["1. 拓展知識邊界，進行跨域學習", "2. 練習 What if 提問，顛覆假設"] },
  { id:21, category:"Thinking & Mindset", title:"邏輯推理",
    descLines:["擅長歸納演繹，辨識因果關係與模式", "能區分前提、證據、結論", "具備數據思維，能從中解讀意義", "能指出推論中的漏洞與偏誤"],
    shadow1:"缺乏感性，忽視人性", shadow2:"用數據掩護立場，只找支持證據",
    consequence1:"無法處理好人際關係", adjustment1:"練習理解他人感受",
    consequence2:"立場偏誤", adjustment2:"多面向思考與處理資訊",
    fitRole:"數據分析、市場調查、學術研究、工程師", fitTask:"策略分析、商業提案、風險評估、數據應用", fitGeneral:"數據佐證讓論述更有說服力",
    improveSteps:["1. 學習金字塔原理和 MECE 原則", "2. 針對某個主題，閱讀反方觀點並重寫論述"] },
  { id:22, category:"Thinking & Mindset", title:"策略洞察",
    descLines:["看得見趨勢、競品動向與結構性變化", "能把外部機會對上內部能力", "能在時機成熟時果斷轉向", "優秀的軍師幕僚"],
    shadow1:"高空盤旋，缺少落地步驟、忽略執行細節與困難", shadow2:"太容易看見問題和障礙而放棄行動",
    consequence1:"策略不接地氣，與第一線脫節", adjustment1:"將策略轉譯為可執行的任務",
    consequence2:"過度悲觀、迴避困難", adjustment2:"小規模先做試驗",
    fitRole:"高階主管、策略幕僚、產品負責人", fitTask:"年度計劃、市場分析、組織轉型", fitGeneral:"協助團隊理解為何而戰",
    improveSteps:["1. 閱讀產業報告，分析競品動態", "2. 學習 SWOT 或五力分析框架"] },
  { id:23, category:"Thinking & Mindset", title:"系統思考",
    descLines:["看見全貌，而非單一片段", "把問題放在整體流程與關係網中看", "預見牽一髮動全身的連鎖反應", "不陷入本位主義，追求整體最優"],
    shadow1:"想得太複雜而動不了", shadow2:"難以接受簡單解，總想大改",
    consequence1:"錯失表達或採取行動時機", adjustment1:"在全面與速度間找尋平衡",
    consequence2:"低估大幅變革的執行成本", adjustment2:"從最小可行變革開始測試",
    fitRole:"流程改善、組織發展、架構師", fitTask:"流程再造、組織架構調整", fitGeneral:"建立可規模化的制度",
    improveSteps:["1. 練習畫心智圖", "2. 閱讀《第五項修練》"] },
  { id:24, category:"Thinking & Mindset", title:"高效學習",
    descLines:["高速抓取新知並轉化為行動", "願意花費時間心力提升自我", "願意向人請教、拆解高手做法", "享受學習過程，不排斥新事物"],
    shadow1:"依賴學習作為安全感來源", shadow2:"會默認大家應該要知道某些東西",
    consequence1:"把學習作為一種逃避手段", adjustment1:"先辨識此刻是需要更多知識還是安撫焦慮",
    consequence2:"沒有耐心跟慢速者共事", adjustment2:"不要急著行動而是先嘗試同步",
    fitRole:"新創、顧問、研發、數位轉型", fitTask:"導入新技術、開拓新市場", fitGeneral:"成為團隊的知識引擎與開拓者",
    improveSteps:["1. 費曼學習法：教別人是學習最快的方法", "2. 練習問對問題、主題式學習"] },
  { id:25, category:"Thinking & Mindset", title:"自律節制",
    descLines:["不需要他人監督", "在面對人際衝突或客戶抱怨時保持專業，不說出不恰當的內容", "能管理自身情緒，在高壓下穩定", "控制衝動、抵抗誘惑、節制慾望"],
    shadow1:"強制壓抑感受和情緒", shadow2:"過度理性精準管控生活",
    consequence1:"身心出問題", adjustment1:"練習身心覺察與照顧",
    consequence2:"與他人產生距離感", adjustment2:"展現彈性放鬆的一面",
    fitRole:"遠距工作、獨立貢獻者、管理職", fitTask:"多工處理、高壓專案、獨立作業", fitGeneral:"重大決策或專案的團隊定心丸",
    improveSteps:["1. 練習時間日誌、分析時間去向", "2. 用三件最重要的事開啟一天"] },
  { id:26, category:"Thinking & Mindset", title:"相信自己",
    descLines:["能夠肯定自我價值", "相信自身判斷，敢於做出決策", "面對質疑，能堅定立場", "相信許多事情的結果是自己可以控制的"],
    shadow1:"自負而聽不進他人建議、為了面子掩蓋錯誤", shadow2:"低估風險，做出過度樂觀的判斷",
    consequence1:"其他人都噤聲不再發言", adjustment1:"練習表達脆弱",
    consequence2:"準備不周導致失敗", adjustment2:"考慮反方觀點、建立風險清單",
    fitRole:"領導者、業務、公關、發言人", fitTask:"談判、提案簡報、危機處理", fitGeneral:"在關鍵時刻扛住，激勵團隊士氣",
    improveSteps:["1. 建立成功日誌，紀錄小勝利", "2. 採用正向自我對話"] },
  { id:27, category:"Thinking & Mindset", title:"尊重包容",
    descLines:["允許不同觀點被聽見", "允許他人表達異議和質疑的聲音", "會詢問而不是直接否定，面對衝突保持禮貌與界線", "擁抱多元觀點，創造協同價值"],
    shadow1:"為了和諧而迴避衝突", shadow2:"淪為過度迎合、犧牲原則",
    consequence1:"表面和諧但潛藏問題", adjustment1:"真誠面對解決問題",
    consequence2:"劣幣驅逐良幣或團隊混亂", adjustment2:"寫下核心底線，不包容錯誤行為",
    fitRole:"人資、管理職、跨國團隊管理", fitTask:"跨文化團隊建立、跨部門協作、DEI 推動", fitGeneral:"提升團隊心理安全感，吸引並留住多元背景的優秀人才",
    improveSteps:["1. 刻意接觸不同溫層的人", "2. 練習非暴力溝通 （NVC)"] },
  { id:28, category:"Thinking & Mindset", title:"誠信正直",
    descLines:["守法、守約、守底線", "在壓力下仍按原則做事", "對機密資訊妥善保護", "不說不實數據與誇大承諾"],
    shadow1:"過度僵化缺乏彈性", shadow2:"道德潔癖，可能內在衝突強烈或是對他人瑕疵零容忍",
    consequence1:"在協作中被孤立", adjustment1:"區分原則與方法，方法彈性",
    consequence2:"人際關係緊繃", adjustment2:"先看對方的情境與動機",
    fitRole:"任何會接觸到機密或隱私的適合工作（資安、法務、財會、技術研發或專利）", fitTask:"合約處理、稽核、管理高敏感資訊", fitGeneral:"提醒合規與倫理基準",
    improveSteps:["1. 寫下個人底線清單", "2. 學習組織倫理案例"] },
  { id:29, category:"Thinking & Mindset", title:"克敵制勝",
    descLines:["想贏", "喜歡競爭和比賽，享受挑戰並超越對手", "經常比較自己和他人的差距", "能激勵團隊點燃戰鬥激情"],
    shadow1:"只看對手，忽視客戶或真正的目標", shadow2:"只想自己贏，忽視團隊合作，造成內部競爭",
    consequence1:"忽視客戶", adjustment1:"把使用者價值放在首位",
    consequence2:"失去他人信任", adjustment2:"釐清正確對手，槍口一致對外",
    fitRole:"業務、競賽團隊、市場開發", fitTask:"業績競爭、競品攻防、市場拓展", fitGeneral:"在逆境中，激發團隊的戰鬥力",
    improveSteps:["1. 研究對手三項優勢與弱點", "2. 練習「先客戶、後對手」的思考順序"] },
  { id:30, category:"Thinking & Mindset", title:"回顧復盤",
    descLines:["重複回顧與檢視", "擅長分析成功與失敗的關鍵因素", "從錯誤中學習，避免重蹈覆轍", "透過過往經驗和智慧尋找解答"],
    shadow1:"復盤淪為批判大會抓戰犯，追究責任超過學習", shadow2:"流於形式，只有討論沒有行動",
    consequence1:"團隊離心", adjustment1:"復盤對事不對人，也要找成功可複製因子",
    consequence2:"問題重複發生", adjustment2:"復盤的重點是下次怎麼做",
    fitRole:"專案經理、領導者、教練", fitTask:"專案結案、SOP優化、團隊建立", fitGeneral:"建立復盤模板，讓經驗得以傳承",
    improveSteps:["1. 從 15 分鐘小復盤開始", "2. 建立錯誤日誌，紀錄學到的事"] },
  { id:31, category:"Thinking & Mindset", title:"審慎周全",
    descLines:["對法規、合約、成本細節敏感", "會未雨綢繆減少變數和風險", "交付之前會反覆檢查，確保無誤", "決策前會多方求證，不貿然行動"],
    shadow1:"非理性的過度悲觀，決策保守", shadow2:"準備過久，陷入分析癱瘓",
    consequence1:"錯失需要快速挑戰的機會", adjustment1:"以數據重新評估風險，採取小風險嘗試",
    consequence2:"錯失行動時機，方案過時", adjustment2:"建立停損點，在有限資訊下行動",
    fitRole:"財會、法務、稽核、採購、高階幕僚、資訊安全", fitTask:"風險控管、合約審查、重大決策", fitGeneral:"提供決策前後清單檢核",
    improveSteps:["1. 為每個專案列出前三大風險與對策", "2. 建立檢查清單 （Checklist）"] },
  { id:32, category:"Thinking & Mindset", title:"描繪未來",
    descLines:["能把願景說得具體有畫面", "擅長說故事，感染他人", "看見未來的機會與可能性", "運用願景激發他人動力"],
    shadow1:"只有畫餅，缺乏落地路徑", shadow2:"耽溺願景，急著想要實現未來或忽略實際營運問題",
    consequence1:"失去信任", adjustment1:"設定與願景連接的行動",
    consequence2:"每天做夢", adjustment2:"未來是從現在開始抵達的",
    fitRole:"領導者、創辦人、策略長、變革推動者", fitTask:"組織變革、年度目標宣導、激勵團隊", fitGeneral:"為團隊注入希望和意義感",
    improveSteps:["1. 練習把願景轉成北極星指標", "2. 多看趨勢報告，思考三年後的樣貌"] },
  { id:33, category:"Thinking & Mindset", title:"發揮優勢",
    descLines:["關注運用天賦而不是過度彌補弱點", "專注於擅長的事，創造高價值", "能辨識自己的強項與能量來源", "幫助他人發掘並善用其優勢"],
    shadow1:"逃避短板", shadow2:"優勢偏執：只挑自己擅長的事、所有問題都用同一招解決",
    consequence1:"短板成為致命傷拖垮優勢", adjustment1:"設定短板最低標準與外部支援時間點",
    consequence2:"無法應對新挑戰", adjustment2:"每季接一項不擅長任務來鍛鍊",
    fitRole:"顧問、講師、技術專家、領導者", fitTask:"職涯規劃、團隊組建、任務分配", fitGeneral:"看見他人優勢",
    improveSteps:["1. 嘗試進行特質相關的測評", "2. 回想巔峰時刻，分析成功要素", "3. 主動請求發揮優勢的任務"] },
  { id:34, category:"Thinking & Mindset", title:"樂觀正向",
    descLines:["在困境中仍能看到可能性", "遇到挫折能快速恢復正能量", "朋友中的小太陽，帶來希望與動能", "不會糾結過負面的部分"],
    shadow1:"盲目樂觀，忽略風險", shadow2:"正能量壓迫：不允許自己或他人的負面情緒",
    consequence1:"錯估局勢而失敗", adjustment1:"加入最壞情境評估",
    consequence2:"團隊假性正向，問題被掩蓋", adjustment2:"允許負面回饋被看見與處理",
    fitRole:"業務、客服、團隊領導者、公關", fitTask:"高壓環境、變革推動、激勵士氣", fitGeneral:"用勝利日誌與小慶祝創造正向氛圍",
    improveSteps:["1. 練習轉念", "2. 將問題拆成可行小步驟"] },
  { id:35, category:"Thinking & Mindset", title:"獨立思考",
    descLines:["不盲從權威或多數", "用證據與原則做判斷", "會檢查自己的偏誤", "不會直接相信、照單全收"],
    shadow1:"忽視團隊共識，難以合作", shadow2:"批判性強，讓人心生防衛與不悅",
    consequence1:"過多爭辯造成團隊內耗", adjustment1:"提出觀點也要尊重決議",
    consequence2:"溝通風格過於尖銳", adjustment2:"挑戰觀點而非挑戰人，用提問代替指責",
    fitRole:"顧問、策略、研發、法遵、內稽", fitTask:"決策會議、風險評估、創意發想", fitGeneral:"提出另一種觀點",
    improveSteps:["1. 練習反向思考，刻意唱反調", "2. 閱讀不同立場的資訊"] },
  { id:36, category:"Thinking & Mindset", title:"深度專注",
    descLines:["能長時間專注，產出高品質成果", "擅長排除干擾，主動隔絕通知與噪音", "處理複雜問題時，能深入思考", "重視質而非量的工作"],
    shadow1:"與世隔絕：進入個人世界，與團隊脫節", shadow2:"對打擾過度敏感，反應激烈",
    consequence1:"團隊不知進度、資訊不同步", adjustment1:"安排協作溝通時間",
    consequence2:"破壞合作關係", adjustment2:"事情建立勿擾提醒",
    fitRole:"工程師、創作者、研發、策略規劃", fitTask:"寫程式、做研究、寫企劃、解難題", fitGeneral:"協助團隊建立專注時間與空間",
    improveSteps:["1. 建立無干擾環境（關閉通知）", "2. 練習單點任務，一次只做一件事"] },
  { id:37, category:"Thinking & Mindset", title:"身心續航",
    descLines:["知道自己的恢復方式，懂得補充能量", "了解自身壓力訊號，主動調節", "健康的睡眠、運動、飲食習慣", "懂得關機，充分休息"],
    shadow1:"過度養生，迴避高壓任務", shadow2:"健康主義：苛責別人的生活方式",
    consequence1:"團隊需要時無法挺身而出、被視為抗壓性低", adjustment1:"區分恢復和拖延",
    consequence2:"苛責他人", adjustment2:"尊重他人節奏，聚焦自我改善",
    fitRole:"任何適合（高壓/高責任工作）", fitTask:"長期專案、高壓期、應對變革、出差密集、大量利害關係人溝通", fitGeneral:"帶動團隊文化建立健康 KPI",
    improveSteps:["1. 培養工作以外的愛好", "2. 學習各種舒壓方式", "3. 培養一個健康習慣"] },
  { id:38, category:"People & Leadership", title:"社交敏銳",
    descLines:["擅長閱讀空氣，懂得調整語氣、場合與出手時機", "能精準辨識利害關係人的意圖、角色、動機與顧慮", "覺察組織中檯面下的權力動態", "能快速看懂關係網與「誰影響誰」"],
    shadow1:"過度世故導致失去信任", shadow2:"陷入他人眼光，決策搖擺、不敢表達真實觀點",
    consequence1:"失去信任", adjustment1:"改為利益透明與立場清楚，說清楚彼此需要",
    consequence2:"因為從眾而判斷錯誤", adjustment2:"回到商業價值面判斷、或反思是否自己真心想要",
    fitRole:"公關、業務、幕僚、管理職", fitTask:"談判協商、利害關係人管理、跨部門專案協調、重大提案拜會", fitGeneral:"建立利害關係人地圖與影響策略",
    improveSteps:["1. 分析組織圖，誰跟誰連結", "2. 每次開會前寫「三問一底線」：對方要什麼、擔心什麼、能給什麼與我的底線"] },
  { id:39, category:"People & Leadership", title:"感同身受",
    descLines:["敏銳察覺他人情緒與潛在需求", "傾聽並理解他人未說出的觀點", "感知團隊氣氛，扮演關係潤滑劑", "主動給予關懷，建立心理安全感"],
    shadow1:"過度情感共鳴，失去客觀判斷、迴避艱難對話", shadow2:"情緒過載，把別人的情緒背在自己身上",
    consequence1:"延誤問題處理時機", adjustment1:"同理後再回到事實與選項",
    consequence2:"失去能量", adjustment2:"建立情緒界線，建立心理復原方法",
    fitRole:"人資、用戶體驗、客服", fitTask:"績效回顧、客訴處理、變革管理、衝突協調", fitGeneral:"精準解讀客戶（內/外部）真實需求",
    improveSteps:["1. 練習積極傾聽，複述並確認感受", "2. 進行換位思考，模擬對方處境"] },
  { id:40, category:"People & Leadership", title:"協調衝突",
    descLines:["敏銳覺察，在衝突擴大前介入", "保持中立傾聽，同理各方觀點", "協助建立共識，修復團隊信任", "能安撫情緒，讓討論回歸事實"],
    shadow1:"表面和諧但問題未解", shadow2:"介入過深，花費太多時間心力",
    consequence1:"衝突暫時平息但未來會再爆發", adjustment1:"鼓勵建設性衝突",
    consequence2:"沒有做好該做的事", adjustment2:"建立界線",
    fitRole:"專案經理、人資、法務、主管", fitTask:"跨部門協商、勞資會議、客訴處理", fitGeneral:"處理團隊內耗，讓組織重新聚焦",
    improveSteps:["1. 學習非暴力溝通（NVC）", "2. 扮演會議主持人，也學會找需求交集"] },
  { id:41, category:"People & Leadership", title:"客戶導向",
    descLines:["主動預測並滿足客戶需求", "視客戶成功為自己的責任", "總能多走一步，創造優質體驗", "會預先想到對方的困難並先準備"],
    shadow1:"過度討好、承諾過量、失去底線、成本失控", shadow2:"犧牲公司或團隊權益只為討好特定客戶",
    consequence1:"承諾無法兌現而傷害信譽", adjustment1:"清楚定義服務範圍",
    consequence2:"造成營運虧損或資源錯配", adjustment2:"在客戶滿意與公司利益間取得平衡",
    fitRole:"客服、業務、用戶體驗", fitTask:"建立客戶服務流程、客訴處理", fitGeneral:"提升客戶（內/外部）滿意度與忠誠度",
    improveSteps:["1. 練習站在客戶角度走過一遍流程", "2. 建立客戶回饋機制，主動收集"] },
  { id:42, category:"People & Leadership", title:"推動影響",
    descLines:["沒有權力也能讓人願意跟著做", "找到利害關係人共同推動", "讓他人接受或支持自己的主張", "有意識地透過言語或行為影響他人"],
    shadow1:"藉由操弄謀取私利、或是過度話術包裝", shadow2:"控制狂、強勢",
    consequence1:"信用破產、承諾無法兌現", adjustment1:"同時考量可行性與長期信任",
    consequence2:"合作破裂", adjustment2:"平衡雙方需求",
    fitRole:"領導者、業務、行銷、公關、變革推動者", fitTask:"簡報提案、跨部門協商、推動新政", fitGeneral:"爭取資源，讓重要專案得以啟動",
    improveSteps:["1. 學習黃金圈法則 （Why/How/What)", "2. 分析利害關係人，找出關鍵決策者"] },
  { id:43, category:"People & Leadership", title:"培養他人",
    descLines:["樂於分享，以鼓勵與挑戰兼具的方式帶人", "擅長發現他人潛力，並給予舞台", "善於提問引導、給予回饋", "會設定學習目標與里程碑"],
    shadow1:"給予不請自來的建議", shadow2:"把自己的樣子複製到其他人身上，過度保護反而讓他人難以成長",
    consequence1:"過度指導讓人反感，壓抑主動性", adjustment1:"引導而非複製，先確認性格特質與學習風格",
    consequence2:"過度保護", adjustment2:"逐步放手設計難度曲線，讓他人逐步獨立",
    fitRole:"領導者、人資、導師、講師、教練", fitTask:"團隊建立、接班人計劃、新人培訓", fitGeneral:"提升團隊總戰力，解放主管時間",
    improveSteps:["1. 學習情境領導，因材施教", "2. 練習 GROW 教練模型 (Goal, Reality, Options , Will)"] },
  { id:44, category:"People & Leadership", title:"國際合作",
    descLines:["主動分享資訊與資源、避免各自為政", "願意補位，而非本位主義", "能為整體目標讓步與支援", "會照顧團隊節奏與氛圍"],
    shadow1:"害怕衝突，不敢建言", shadow2:"避免承擔主要責任",
    consequence1:"團隊表面和諧但績效低落", adjustment1:"面對並解決問題",
    consequence2:"個人成長有限", adjustment2:"主動爭取發展機會",
    fitRole:"任何工作（尤其是專案、跨部門）", fitTask:"跨功能專案、敏捷開發、團隊建立", fitGeneral:"創造 1+1 > 2 的團隊綜效",
    improveSteps:["1. 建立共同語言與協作工具", "2. 尊重他人貢獻與團隊決議"] },
  { id:45, category:"People & Leadership", title:"領導統率",
    descLines:["能夠帶領團隊", "激勵士氣，在逆境中穩定軍心", "能做取捨與決策，承擔最終責任", "說清方向與標準，會分配資源與權責"],
    shadow1:"英雄主義，凡事自己來", shadow2:"權威壓迫、控制欲強。決策黑箱，與團隊產生距離",
    consequence1:"團隊工具人話，缺乏授權與接班", adjustment1:"設定授權梯度與決策邊界",
    consequence2:"團隊被動，壓抑自主性", adjustment2:"領導是賦能，練習抓大放小",
    fitRole:"組織主管、專案負責人、意見領袖", fitTask:"帶領團隊、組織變革、危機處理", fitGeneral:"建立有向心力的組織文化",
    improveSteps:["1. 學會「情境領導」四象限", "2. 建立授權清待與追蹤節點", "3. 固定與核心成員一對一"] },
  { id:46, category:"People & Leadership", title:"建立界線",
    descLines:["清楚定義職權與責任範圍", "面對不合理要求能禮貌拒絕", "避免不必要的外部干擾", "設定互動規則與回覆時段"],
    shadow1:"界線太硬，只畫線不溝通", shadow2:"過度拒絕而阻斷發展機會",
    consequence1:"被討厭，跨部門協作難", adjustment1:"先理解再劃線，同時解釋原因與影響",
    consequence2:"錯失機會", adjustment2:"持續檢視是否因慣性錯過好機會",
    fitRole:"專案經理、主管、獨立工作者", fitTask:"專案範疇界定、資源保護、工作排序、專案變更控管、外部客製需求", fitGeneral:"確保團隊聚焦在高價值任務上",
    improveSteps:["1. 練習 Not-to-do list，定義不做什麼", "2. 學習溫和但堅定的拒絕話術"] },
  { id:47, category:"People & Leadership", title:"善於識人",
    descLines:["從言行與情境線索判讀特質與動機", "把對的人放在對的位置", "對每個人的差異和獨特性很敏銳", "能判斷成熟度與可授權範圍，辨識高潛人才"],
    shadow1:"過度解讀他人行為與想法", shadow2:"為了配合不同人，把事情複雜化或是差別待遇",
    consequence1:"解讀錯誤", adjustment1:"和對方核對確認、觀察",
    consequence2:"降低效率或被認為用人唯親", adjustment2:"建立基礎公平流程",
    fitRole:"人資、高階主管、獵頭", fitTask:"面試招募、團隊組建、接班人計劃", fitGeneral:"能夠建立好團隊，降低磨合成本",
    improveSteps:["1. 學習 BEI （行為事件訪談）提問", "2. 回顧招募失誤，校準職人標準"] },
  { id:48, category:"People & Leadership", title:"深化關係",
    descLines:["人際關係重質不重量", "擅長一對一深度交流", "維持長期互信互惠的合作", "能在衝突後修復並升級關係"],
    shadow1:"受人情影響、被情感綁架、只談關係不談現實", shadow2:"害怕分離，為了維繫熟悉的生活圈而不想改變",
    consequence1:"不解決問題、決策不公", adjustment1:"區分公私，回到專業與績效",
    consequence2:"發展受限、錯失機會", adjustment2:"真實的關係不會因為情境改變",
    fitRole:"業務、公關、人資、客戶成功", fitTask:"大客戶維護、利害關係人管理、社群經營", fitGeneral:"了解對方真實心聲",
    improveSteps:["1. 嘗試關懷他人", "2. 定期主動關心，而非有事才找"] },
  { id:49, category:"People & Leadership", title:"結識新人",
    descLines:["樂於走出舒適圈，認識新朋友", "擅長在陌生場合，快速破冰", "建立廣泛的人脈網路與資訊", "能連結不同人脈，創造新機會"],
    shadow1:"目的性太強、點頭之交廣而不深", shadow2:"沈迷社交，忽略能力養成",
    consequence1:"關係量大質低，關鍵時刻無人相助", adjustment1:"設定每次交流人數與時間",
    consequence2:"停留在無效社交", adjustment2:"創造自己的合作價值",
    fitRole:"業務開發、公關、創投、獵頭", fitTask:"市場開發、募資、外部資源整合、展會/論壇", fitGeneral:"成為團隊的人際雷達與連結器",
    improveSteps:["1. 練習 30秒自我介紹，清晰有力", "2. 參加跨界活動"] },
  { id:50, category:"People & Leadership", title:"表達技巧",
    descLines:["擅長口語或文字，清晰傳達", "遣詞用字精準，能引發他人共鳴", "能用聽得懂的語言解釋複雜內容", "會依聽眾調整深度與用詞，看場合切換風格"],
    shadow1:"內容空洞或是刻意煽動", shadow2:"沉溺於表達過度輸出",
    consequence1:"信任下降", adjustment1:"用數據與證據支撐觀點",
    consequence2:"溝通單向缺乏傾聽", adjustment2:"刻意停頓與提問",
    fitRole:"講師、公關、行銷、作家、主持人", fitTask:"簡報提案、公開演說、文案撰寫", fitGeneral:"成為團隊發言人，對齊內外資訊",
    improveSteps:["1. 學習故事力，增加染感力", "2. 錄音/錄影，客觀檢視表達盲點"] },
  { id:51, category:"People & Leadership", title:"談判協商",
    descLines:["清楚底線，並鎖定理想目標", "策略性提問，探尋對方更多情報", "靈活說服，創造雙贏價值方案", "堅持關鍵利益，策略性讓步成交"],
    shadow1:"好鬥，凡事都要爭", shadow2:"零和博弈，只求單次勝利",
    consequence1:"破壞團隊互信", adjustment1:"區分該爭與該讓的情境",
    consequence2:"犧牲長期關係、失去未來機會", adjustment2:"導入長期主義思維",
    fitRole:"採購、業務、法務、人資", fitTask:"商務合約、薪資談判、跨部門爭取資源", fitGeneral:"為團隊爭取合理的資源與時程",
    improveSteps:["1. 學習談判框架 （BATBA）", "2. 練習殺價"] },
  { id:52, category:"Skills & Application", title:"美感創作",
    descLines:["審美強，對美的事物有見解", "專注戲劇、文學、舞蹈、影像、公益或音樂等領域", "注重美感"],
    shadow1:"炫技過度，忽略功能與實用；耗時過久，在細節上鑽牛角尖", shadow2:"品味綁架，只接受自己的審美",
    consequence1:"成果偏離商業目標；耽誤時效，影響專案進程", adjustment1:"先做可用信測試並設定停損點",
    consequence2:"協作困難被視為難以配合", adjustment2:"尊重需求方",
    fitRole:"視覺設計、UI/UX、行銷、品牌企劃", fitTask:"品牌識別（CIS）、廣告素材、產品包裝", fitGeneral:"將美感注入 SOP，優化體驗",
    improveSteps:["1. 大量閱覽頂尖作品，建立資料庫", "2. 每週1次拆解模仿：臨摹優秀版面並說出規則"] },
  { id:53, category:"Skills & Application", title:"肢體活動",
    descLines:["具備協調性、耐力或力量", "能感知並準確控制自己的身體", "透過實作學習，而非理論", "精力充沛，能勝任高強度勞動"],
    shadow1:"輕忽理論與規劃的重要性，容易用行動取代思考", shadow2:"易衝動行事，缺乏周全思考",
    consequence1:"缺乏方法論，效率無法提升", adjustment1:"動手也要動腦",
    consequence2:"決策草率，造成公安或品質問題", adjustment2:"行動前先做好評估",
    fitRole:"運動員/教練、軍警、技師、表演藝術家", fitTask:"實作演練、體能勞務、活動搭建/展演團隊、倉儲理貨/物流", fitGeneral:"在動態環境中快速反應",
    improveSteps:["1. 導入刻意練習，分解細節", "2. 尋求教練指導，客觀修正動作"] },
  { id:54, category:"Skills & Application", title:"動手實作",
    descLines:["享受從無到有把東西做出來", "擅長操作工具或精密儀器", "容易沉浸在實作過程中", "能快速拆解並修復事物"],
    shadow1:"埋頭苦幹，忽略溝通與協作", shadow2:"抗拒理論，只信親手經驗",
    consequence1:"與團隊脫節，成品不符需求", adjustment1:"實作前先對齊規格",
    consequence2:"錯失升級機會，方法過時", adjustment2:"接觸新知，實作驗證",
    fitRole:"工程師、研發、廚師、醫護、手工藝", fitTask:"產品打樣、維修、實驗、教具/展件製作、Maker、木工", fitGeneral:"在動態環境中快速反應",
    improveSteps:["1. 學習拆解日常用品再組裝", "2. 參加工作坊，嘗試動手實作"] },
  { id:55, category:"Skills & Application", title:"科技應用",
    descLines:["能挑選合適的數位/ AI 工具處理任務", "會評估成本、風險與效益（含資安）", "能將科技與實務需求結合", "具備 AI 協作思維，善用工具賦能"],
    shadow1:"太多工具，複雜又難維護", shadow2:"科技黑箱，他人無法接手",
    consequence1:"降低效率，增加學習成本", adjustment1:"定期檢視工具應用複雜度",
    consequence2:"無法傳承", adjustment2:"建立 SOP 與教學，賦能團隊",
    fitRole:"資訊、數位行銷、產品經理", fitTask:"數位轉型、AI協作導入、自動化、資料處理與報表、營運分析", fitGeneral:"成為團隊的科技/AI 大使，解決痛點",
    improveSteps:["1. 嘗試新的數位工具", "2. 從痛點切入自動化（如制式回應）"] },
  { id:56, category:"Skills & Application", title:"永續思維",
    descLines:["對環境與生命具高度敏感", "關心生態系統", "投入農林漁牧、生態與自然科學", "具備永續思維，考量長期影響"],
    shadow1:"理想化，忽視商業現實", shadow2:"難以在發展與永續間妥協",
    consequence1:"方案不接地氣", adjustment1:"將永續轉化為商業機會",
    consequence2:"成為阻力，而非助力", adjustment2:"尋找雙贏路徑，而非對立",
    fitRole:"ESG 永續管理、農業研究、環境工程", fitTask:"企業永續報告、供應鏈減碳、生態研究", fitGeneral:"協助組織實踐社會責任（CSR）",
    improveSteps:["1. 練習田野調查，紀錄細節", "2. 學習 ESG 或 SDGs 相關知識"] },
  { id:57, category:"Skills & Application", title:"國際移動",
    descLines:["具備跨文化敏感度與適應力", "樂於在不同國家或城市工作", "不害怕跟外國人溝通", "能理解不同的文化脈絡"],
    shadow1:"變成浮萍，缺乏深耕", shadow2:"忽視本地市場的獨特性",
    consequence1:"身份與歸屬感迷失，難以建立人際關係", adjustment1:"與原有的生活圈保持聯絡",
    consequence2:"觀點與做法不接地氣", adjustment2:"長期深入耕耘才能建立在地洞察",
    fitRole:"外派人員、國際業務、跨國企業", fitTask:"開拓海外市場、跨國專案協作", fitGeneral:"成為在地與總部的溝通橋樑",
    improveSteps:["1. 先從短期出差試水溫，逐步拉長", "2. 接觸國際媒體，培養全球觀點"] },
  { id:58, category:"Skills & Application", title:"商業思維",
    descLines:["圍繞商業目的，思考如何創造價值", "透過數據與策略，協助做出更加決策", "決策時，能考量成本與效益", "以市場需求為導向，提供解決方案"],
    shadow1:"過度功利，凡事只看錢", shadow2:"容易忽略文化與人的非財務因素",
    consequence1:"缺乏使命感", adjustment1:"建立營收以外的願景目標",
    consequence2:"人際關係功利化", adjustment2:"將人脈重新定義為連結、練習不帶目的的給予",
    fitRole:"任何工作（管理、專案管理、業務）", fitTask:"編列預算、產品定價、策略規劃", fitGeneral:"評估新商業模式或專案的可行性",
    improveSteps:["1. 分析競品的商業模式，寫比較表", "2. 練習用「成本效益」分析日常工作"] },
  { id:59, category:"Skills & Application", title:"照顧他人",
    descLines:["常能提供對方實體（或心理）的協助", "能敏銳覺察他人需求", "具備專業服務的實務技巧", "以尊重包容態度、給予直接幫助"],
    shadow1:"情緒過度捲入：共感過高、難以抽離；無界限承接：超出職務、浩劫加劇", shadow2:"做得太多，剝奪對方自主與成長機會",
    consequence1:"對方退化", adjustment1:"鼓勵對方做能力範圍內的事，賦能而非替代",
    consequence2:"倦怠與角色混亂", adjustment2:"明確服務範圍、值班/輪班與轉介門檻",
    fitRole:"護理、長照、幼教、社工、專業服務工作者", fitTask:"客服或人員關懷", fitGeneral:"在高壓或危險環境下，安撫他人情緒與不安",
    improveSteps:["1. 練習觀察非語言訊息（表情/肢體）並核對需求", "2. 學習基礎護理、急救或服務接待技能"] },
  { id:60, category:"Skills & Application", title:"財務管理",
    descLines:["數字觀念強，能理解數字背後的意義", "確實掌握收支，可控管預算與成本", "定期檢視財務規劃，重視財務健康", "風險意識高，預防財務漏洞"],
    shadow1:"過度保守", shadow2:"只看數字，忽略人與文化的無形價值",
    consequence1:"因小失大錯失機會", adjustment1:"區分費用 Cost 與投資 Investment 的差異",
    consequence2:"犧牲長期資產與研發能量", adjustment2:"給長期 KPI（品牌資產、留任、研發佔比）",
    fitRole:"會計/財務長/採購、創意家/事業部主管", fitTask:"年度預算、評估新專案的可行性與投資報酬率（ROI）", fitGeneral:"優化資源配置、減少不必要的浪費",
    improveSteps:["1. 從個人記帳開始，練習分析現金流向", "2. 培養「成本效益分析」習慣，購物或決策前先算帳"] },
];

// ===================================================================
// STATE
// ===================================================================
let strength = new Set();
let weakness = new Set();
let skipped  = new Set();
let currentIndex = 0;

// ===================================================================
// URL PARAMS  (skipped is not serialized – it's session-only)
// Share URL format:  ?strength=1,2,3&weakness=4,5,6
// ===================================================================

function buildShareURL() {
  const params = new URLSearchParams();
  if (strength.size) params.set('strength', [...strength].join(','));
  if (weakness.size) params.set('weakness', [...weakness].join(','));
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

function parseURLState() {
  const params   = new URLSearchParams(window.location.search);
  const parseIds = key => {
    const raw = params.get(key);
    if (!raw) return new Set();
    return new Set(
      raw.split(',')
         .map(s => parseInt(s.trim(), 10))
         .filter(n => !isNaN(n) && INVENTORY_CARDS.some(c => c.id === n))
    );
  };
  const s = parseIds('strength');
  const w = parseIds('weakness');
  return (s.size > 0 || w.size > 0) ? { strength: s, weakness: w } : null;
}

// ===================================================================
// INIT
// ===================================================================

function initInventory() {
  const fromURL = parseURLState();
  if (fromURL) {
    strength = fromURL.strength;
    weakness = fromURL.weakness;
    switchMode('display');
  } else {
    switchMode('select');
  }
}

// ===================================================================
// MODE SWITCH
// ===================================================================

function switchMode(mode) {
  const views   = ['inv-select-view', 'inv-spread-view', 'inv-display-view', 'inv-input-view'];
  const buttons = ['mode-select-btn', 'mode-spread-btn', 'mode-display-btn', 'mode-input-btn'];
  views.forEach(id   => { const el = document.getElementById(id);   if (el) el.style.display = 'none'; });
  buttons.forEach(id => { const el = document.getElementById(id);   if (el) el.classList.remove('active'); });

  if (mode === 'select') {
    _show('inv-select-view');  _active('mode-select-btn');
    renderCards(); renderDots(); updateStatusBar(); renderChips();
  } else if (mode === 'spread') {
    _show('inv-spread-view');  _active('mode-spread-btn');
    renderSpreadCards(); renderChips(); updateStatusBar();
  } else if (mode === 'input') {
    _show('inv-input-view');   _active('mode-input-btn');
    renderInputSlots();
    _fillSlotsFromState();
  } else {
    _show('inv-display-view'); _active('mode-display-btn');
    renderDisplay();
  }
}

function _show(id)   { const el = document.getElementById(id); if (el) el.style.display = ''; }
function _active(id) { const el = document.getElementById(id); if (el) el.classList.add('active'); }

// ===================================================================
// HELPERS
// ===================================================================

function getCategoryMeta(category) {
  return CATEGORY_META[category.trim()] || { color: '#6B7280', bg: '#F3F4F6', label: category.trim() };
}

function renderDescLines(card) {
  return (card.descLines || []).map(s => `<li>${s}</li>`).join('');
}

// ===================================================================
// CAROUSEL VIEW – CARDS
// ===================================================================

function renderCards() {
  const track = document.getElementById('inv-cards-track');
  if (!track) return;
  track.innerHTML = '';

  INVENTORY_CARDS.forEach((card, i) => {
    const isStr  = strength.has(card.id);
    const isWeak = weakness.has(card.id);
    const isSk   = skipped.has(card.id);
    const atMaxStr  = strength.size >= MAX_STRENGTH;
    const atMaxWeak = weakness.size >= MAX_WEAKNESS;
    const meta = getCategoryMeta(card.category);

    const statusLabel = isStr ? '強勢 ✓' : (isWeak ? '劣勢 ✓' : (isSk ? '略過' : ''));
    const statusClass = isStr ? 'is-strength' : (isWeak ? 'is-weakness' : (isSk ? 'is-skipped' : ''));

    const slide = document.createElement('div');
    slide.className = 'inv-card-slide';
    slide.id = `inv-slide-${i}`;
    slide.innerHTML = `
      <div class="inv-card-inner ${statusClass}" style="--cat-color:${meta.color};--cat-bg:${meta.bg}">
        <div class="inv-card-status-ribbon">${statusLabel}</div>
        <!-- ☀️ Sun section: title + description -->
        <div class="inv-card-sun">
          <div class="inv-card-header">
            <span class="inv-category-badge" style="background:${meta.bg};color:${meta.color}">${meta.label}</span>
            <span class="inv-card-id">#${card.id}</span>
          </div>
          <div class="inv-card-title" style="color:${meta.color}">${card.title}</div>
          <ul class="inv-card-desc">${renderDescLines(card)}</ul>
        </div>
        <!-- Diagonal divider -->
        <div class="inv-card-diagonal"></div>
        <!-- 🌙 Moon section: ability shadow -->
        <div class="inv-card-moon">
          <span class="inv-moon-icon">🌙</span>
          <div class="inv-moon-shadows">
            <div class="inv-shadow-item">— ${card.shadow1}</div>
            ${card.shadow2 ? `<div class="inv-shadow-item">— ${card.shadow2}</div>` : ''}
          </div>
        </div>
        <!-- Footer -->
        <div class="inv-card-footer">
          <button class="inv-detail-btn" onclick="openDetailModal(${card.id})">📋 詳情</button>
          <div class="inv-action-buttons">
            <button class="inv-action-btn strength-btn ${isStr ? 'selected' : ''}"
                    ${atMaxStr && !isStr ? 'disabled' : ''}
                    onclick="handleStrength(${card.id}, ${i})">
              <span class="inv-action-icon">💪</span>強勢
            </button>
            <button class="inv-action-btn skip-btn ${isSk ? 'selected' : ''}"
                    onclick="handleSkip(${card.id}, ${i})">
              <span class="inv-action-icon">⏭</span>略過
            </button>
            <button class="inv-action-btn weakness-btn ${isWeak ? 'selected' : ''}"
                    ${atMaxWeak && !isWeak ? 'disabled' : ''}
                    onclick="handleWeakness(${card.id}, ${i})">
              <span class="inv-action-icon">🌱</span>劣勢
            </button>
          </div>
        </div>
      </div>`;
    track.appendChild(slide);
  });

  updateCarouselPosition();
  updateArrows();
}

// ===================================================================
// CAROUSEL ACTIONS
// ===================================================================

function handleStrength(id, cardIndex) {
  if (strength.size >= MAX_STRENGTH && !strength.has(id)) {
    showToast(`強勢職能最多只能選 ${MAX_STRENGTH} 個！`); return;
  }
  strength.add(id); weakness.delete(id); skipped.delete(id);
  afterAction(id, cardIndex);
}

function handleWeakness(id, cardIndex) {
  if (weakness.size >= MAX_WEAKNESS && !weakness.has(id)) {
    showToast(`劣勢職能最多只能選 ${MAX_WEAKNESS} 個！`); return;
  }
  weakness.add(id); strength.delete(id); skipped.delete(id);
  afterAction(id, cardIndex);
}

function handleSkip(id, cardIndex) {
  skipped.add(id); strength.delete(id); weakness.delete(id);
  afterAction(id, cardIndex);
}

function afterAction(id, cardIndex) {
  updateStatusBar(); renderChips(); refreshCardUI(cardIndex); updateDots();
  const next = findNextUnevaluated(cardIndex);
  if (next !== null) setTimeout(() => goToCard(next), 300);
  if (strength.size + weakness.size + skipped.size === INVENTORY_CARDS.length) {
    document.getElementById('inv-complete-banner').style.display = '';
  }
}

function findNextUnevaluated(fromIndex) {
  for (let i = fromIndex + 1; i < INVENTORY_CARDS.length; i++) {
    const c = INVENTORY_CARDS[i];
    if (!strength.has(c.id) && !weakness.has(c.id) && !skipped.has(c.id)) return i;
  }
  for (let i = 0; i < fromIndex; i++) {
    const c = INVENTORY_CARDS[i];
    if (!strength.has(c.id) && !weakness.has(c.id) && !skipped.has(c.id)) return i;
  }
  return null;
}

function refreshCardUI(cardIndex) {
  const card   = INVENTORY_CARDS[cardIndex];
  const inner  = document.querySelector(`#inv-slide-${cardIndex} .inv-card-inner`);
  const ribbon = document.querySelector(`#inv-slide-${cardIndex} .inv-card-status-ribbon`);
  const strBtn = document.querySelector(`#inv-slide-${cardIndex} .strength-btn`);
  const weakBtn= document.querySelector(`#inv-slide-${cardIndex} .weakness-btn`);
  const skipBtn= document.querySelector(`#inv-slide-${cardIndex} .skip-btn`);
  if (!inner) return;

  const isStr  = strength.has(card.id);
  const isWeak = weakness.has(card.id);
  const isSk   = skipped.has(card.id);
  const atMaxStr  = strength.size >= MAX_STRENGTH;
  const atMaxWeak = weakness.size >= MAX_WEAKNESS;

  inner.className = 'inv-card-inner' +
    (isStr ? ' is-strength' : isWeak ? ' is-weakness' : isSk ? ' is-skipped' : '');

  if (ribbon) ribbon.textContent = isStr ? '強勢 ✓' : (isWeak ? '劣勢 ✓' : (isSk ? '略過' : ''));
  if (strBtn)  { strBtn.classList.toggle('selected', isStr);   strBtn.disabled  = atMaxStr  && !isStr; }
  if (weakBtn) { weakBtn.classList.toggle('selected', isWeak); weakBtn.disabled = atMaxWeak && !isWeak; }
  if (skipBtn) { skipBtn.classList.toggle('selected', isSk); }
}

// ===================================================================
// REMOVE FROM CHIPS
// ===================================================================

function removeStrength(id) {
  strength.delete(id);
  const idx = INVENTORY_CARDS.findIndex(c => c.id === id);
  if (idx !== -1) refreshCardUI(idx);
  INVENTORY_CARDS.forEach((_, i) => refreshCardUI(i)); // re-enable buttons
  refreshSpreadCardUI(id);
  refreshAllSpreadDisabled();
  updateStatusBar(); renderChips(); updateDots();
  document.getElementById('inv-complete-banner').style.display = 'none';
}

function removeWeakness(id) {
  weakness.delete(id);
  const idx = INVENTORY_CARDS.findIndex(c => c.id === id);
  if (idx !== -1) refreshCardUI(idx);
  INVENTORY_CARDS.forEach((_, i) => refreshCardUI(i));
  refreshSpreadCardUI(id);
  refreshAllSpreadDisabled();
  updateStatusBar(); renderChips(); updateDots();
  document.getElementById('inv-complete-banner').style.display = 'none';
}

// ===================================================================
// STATUS BAR + CHIPS
// ===================================================================

function updateStatusBar() {
  const evaluated = strength.size + weakness.size + skipped.size;
  const total     = INVENTORY_CARDS.length;
  const pct       = (evaluated / total) * 100;
  const remaining = total - evaluated;

  const strCountEl  = document.getElementById('inv-strength-counter');
  const weakCountEl = document.getElementById('inv-weakness-counter');
  const progressEl  = document.getElementById('inv-progress-fill');
  const labelEl     = document.getElementById('inv-progress-label');
  const remainEl    = document.getElementById('inv-remaining-text');

  if (strCountEl)  strCountEl.innerHTML  = `<span class="badge-num">${strength.size}</span> / ${MAX_STRENGTH} 強勢`;
  if (weakCountEl) weakCountEl.innerHTML = `<span class="badge-num badge-weak">${weakness.size}</span> / ${MAX_WEAKNESS} 劣勢`;
  if (progressEl)  progressEl.style.width = `${pct}%`;
  if (labelEl)     labelEl.textContent   = `已評估 ${evaluated} / ${total} 張`;
  if (remainEl)    remainEl.textContent  = remaining > 0 ? `還有 ${remaining} 張未評估` : '所有卡片已評估完畢 ✓';
}

function renderChips() {
  // Carousel mode chip strips
  renderChipSet('inv-strength-chips',  'inv-chips-str-count',  strength, 'removeStrength', MAX_STRENGTH);
  renderChipSet('inv-weakness-chips',  'inv-chips-weak-count', weakness, 'removeWeakness', MAX_WEAKNESS);
  // Spread mode chip strips
  renderChipSet('inv-spr-str-chips',   'inv-spr-str-count',    strength, 'removeStrength', MAX_STRENGTH);
  renderChipSet('inv-spr-weak-chips',  'inv-spr-weak-count',   weakness, 'removeWeakness', MAX_WEAKNESS);
}

function renderChipSet(containerId, countId, set, removeFn, max) {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;
  if (countEl) countEl.textContent = `${set.size} / ${max}`;
  if (set.size === 0) { container.innerHTML = `<span class="inv-chips-empty">尚未選擇</span>`; return; }
  container.innerHTML = [...set].map(id => {
    const card = INVENTORY_CARDS.find(c => c.id === id);
    if (!card) return '';
    return `<div class="inv-chip">${card.title}
      <button class="inv-chip-remove" onclick="${removeFn}(${id})" title="移除">✕</button>
    </div>`;
  }).join('');
}

// ===================================================================
// CAROUSEL
// ===================================================================

function goToCard(i) {
  currentIndex = Math.max(0, Math.min(i, INVENTORY_CARDS.length - 1));
  updateCarouselPosition(); updateArrows(); updateDots();
}

function prevCard() { goToCard(currentIndex - 1); }
function nextCard() { goToCard(currentIndex + 1); }

function updateCarouselPosition() {
  const track = document.getElementById('inv-cards-track');
  if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function updateArrows() {
  const prev = document.getElementById('inv-prev-btn');
  const next = document.getElementById('inv-next-btn');
  if (prev) prev.disabled = currentIndex === 0;
  if (next) next.disabled = currentIndex === INVENTORY_CARDS.length - 1;
}

function renderDots() {
  const dotsEl = document.getElementById('inv-carousel-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  INVENTORY_CARDS.forEach((card, i) => {
    const dot = document.createElement('div');
    dot.className = `inv-carousel-dot ${dotClass(card.id)} ${i === currentIndex ? 'active' : ''}`;
    dot.title = card.title;
    dot.onclick = () => goToCard(i);
    dotsEl.appendChild(dot);
  });
}

function dotClass(id) {
  return strength.has(id) ? 'is-strength' : (weakness.has(id) ? 'is-weakness' : (skipped.has(id) ? 'is-skipped-dot' : ''));
}

function updateDots() {
  document.querySelectorAll('#inv-carousel-dots .inv-carousel-dot').forEach((dot, i) => {
    const card = INVENTORY_CARDS[i];
    dot.className = `inv-carousel-dot ${dotClass(card.id)} ${i === currentIndex ? 'active' : ''}`;
  });
}

// ===================================================================
// SPREAD VIEW
// ===================================================================

function renderSpreadCards() {
  const grid = document.getElementById('inv-spread-grid');
  if (!grid) return;
  grid.innerHTML = '';
  INVENTORY_CARDS.forEach(card => {
    const isStr  = strength.has(card.id);
    const isWeak = weakness.has(card.id);
    const isSk   = skipped.has(card.id);
    const atMaxStr  = strength.size >= MAX_STRENGTH;
    const atMaxWeak = weakness.size >= MAX_WEAKNESS;
    const meta = getCategoryMeta(card.category);
    const stateClass = isStr ? 'spr-is-strength' : (isWeak ? 'spr-is-weakness' : (isSk ? 'spr-is-skipped' : ''));

    const wrap = document.createElement('div');
    wrap.className = 'inv-spr-wrap';
    wrap.id = `inv-spr-wrap-${card.id}`;
    wrap.innerHTML = `
      <div class="inv-spr-actions">
        <button class="inv-spr-btn spr-str-btn ${isStr ? 'selected' : ''}"
                ${atMaxStr && !isStr ? 'disabled' : ''}
                onclick="handleStrSpread(${card.id})">
          <span>💪</span><span>強勢</span>
        </button>
        <button class="inv-spr-btn spr-weak-btn ${isWeak ? 'selected' : ''}"
                ${atMaxWeak && !isWeak ? 'disabled' : ''}
                onclick="handleWeakSpread(${card.id})">
          <span>🌱</span><span>劣勢</span>
        </button>
      </div>
      <div class="inv-spr-card ${stateClass}">
        <span class="inv-category-badge"
              style="background:${meta.bg};color:${meta.color};font-size:10px">${meta.label}</span>
        <div class="inv-spr-title" style="color:${meta.color}">${card.title}</div>
        <div class="inv-spr-card-footer">
          <span class="inv-card-id">#${card.id}</span>
          <button class="inv-detail-btn inv-detail-btn-xs" onclick="openDetailModal(${card.id})">詳情</button>
        </div>
      </div>`;
    grid.appendChild(wrap);
  });
}

function handleStrSpread(id) {
  if (strength.size >= MAX_STRENGTH && !strength.has(id)) {
    showToast(`強勢職能最多只能選 ${MAX_STRENGTH} 個！`); return;
  }
  strength.add(id); weakness.delete(id); skipped.delete(id);
  refreshSpreadCardUI(id); refreshAllSpreadDisabled();
  updateStatusBar(); renderChips();
}

function handleWeakSpread(id) {
  if (weakness.size >= MAX_WEAKNESS && !weakness.has(id)) {
    showToast(`劣勢職能最多只能選 ${MAX_WEAKNESS} 個！`); return;
  }
  weakness.add(id); strength.delete(id); skipped.delete(id);
  refreshSpreadCardUI(id); refreshAllSpreadDisabled();
  updateStatusBar(); renderChips();
}

function refreshSpreadCardUI(id) {
  const wrap = document.getElementById(`inv-spr-wrap-${id}`);
  if (!wrap) return;
  const isStr  = strength.has(id);
  const isWeak = weakness.has(id);
  const isSk   = skipped.has(id);
  const card   = wrap.querySelector('.inv-spr-card');
  const strBtn = wrap.querySelector('.spr-str-btn');
  const weakBtn= wrap.querySelector('.spr-weak-btn');
  if (card) card.className = 'inv-spr-card' +
    (isStr ? ' spr-is-strength' : isWeak ? ' spr-is-weakness' : isSk ? ' spr-is-skipped' : '');
  if (strBtn)  strBtn.classList.toggle('selected', isStr);
  if (weakBtn) weakBtn.classList.toggle('selected', isWeak);
}

function refreshAllSpreadDisabled() {
  const atMaxStr  = strength.size >= MAX_STRENGTH;
  const atMaxWeak = weakness.size >= MAX_WEAKNESS;
  INVENTORY_CARDS.forEach(card => {
    const wrap = document.getElementById(`inv-spr-wrap-${card.id}`);
    if (!wrap) return;
    const strBtn  = wrap.querySelector('.spr-str-btn');
    const weakBtn = wrap.querySelector('.spr-weak-btn');
    if (strBtn)  strBtn.disabled  = atMaxStr  && !strength.has(card.id);
    if (weakBtn) weakBtn.disabled = atMaxWeak && !weakness.has(card.id);
  });
}

// ===================================================================
// DISPLAY VIEW
// ===================================================================

function renderDisplay() {
  renderDisplayGroup('inv-display-strength-grid', 'inv-display-str-count', strength, 'strength');
  renderDisplayGroup('inv-display-weakness-grid', 'inv-display-weak-count', weakness, 'weakness');
}

function renderDisplayGroup(gridId, countId, set, type) {
  const grid    = document.getElementById(gridId);
  const countEl = document.getElementById(countId);
  if (!grid) return;
  if (countEl) countEl.textContent = `共 ${set.size} 項`;
  const cards = INVENTORY_CARDS.filter(c => set.has(c.id));
  if (cards.length === 0) {
    grid.innerHTML = `<div class="inv-display-empty" style="grid-column:1/-1">
      <p>${type === 'strength' ? '尚未選擇強勢職能' : '尚未選擇劣勢職能'}</p></div>`;
    return;
  }
  grid.innerHTML = cards.map(card => {
    const meta = getCategoryMeta(card.category);
    return `<div class="inv-display-card" style="--cat-color:${meta.color};--cat-bg:${meta.bg}">
      <div class="inv-display-card-sun">
        <div class="inv-display-card-head">
          <span class="inv-category-badge" style="background:${meta.bg};color:${meta.color}">${meta.label}</span>
          <span class="inv-card-id">#${card.id}</span>
        </div>
        <div class="inv-display-card-title" style="color:${meta.color}">${card.title}</div>
        <ul class="inv-display-card-desc">${renderDescLines(card)}</ul>
      </div>
      <div class="inv-display-card-diagonal"></div>
      <div class="inv-display-card-moon">
        <span class="inv-moon-icon-sm">🌙</span>
        <span class="inv-shadow-item-sm">${card.shadow1}${card.shadow2 ? '；' + card.shadow2 : ''}</span>
      </div>
      <button class="inv-detail-btn inv-detail-btn-sm" onclick="openDetailModal(${card.id})">📋 詳情</button>
    </div>`;
  }).join('');
}

// ===================================================================
// SHARE
// ===================================================================

function shareResult() {
  if (strength.size === 0 && weakness.size === 0) { showToast('請先選擇職能再分享！'); return; }
  const url = buildShareURL();
  navigator.clipboard.writeText(url).then(() => showToast('✅ 連結已複製到剪貼簿！'))
    .catch(() => prompt('複製此連結：', url));
}

// ===================================================================
// RESET
// ===================================================================

function resetAll() {
  if (!confirm('確定要重新開始嗎？目前所有選擇將會清除。')) return;
  strength = new Set(); weakness = new Set(); skipped = new Set(); currentIndex = 0;
  history.replaceState({}, '', location.pathname);
  document.getElementById('inv-complete-banner').style.display = 'none';
  switchMode('select');
}

// ===================================================================
// QUICK-INPUT PANEL
// ===================================================================

const INV_INPUT_SLOTS = 7;

function renderInputSlots() {
  renderInputGroup('inv-input-strength-grid', 'strength', INV_INPUT_SLOTS);
  renderInputGroup('inv-input-weakness-grid', 'weakness', INV_INPUT_SLOTS);
  const rb = document.getElementById('inv-input-result-box');
  if (rb) rb.classList.remove('visible');
  document.getElementById('inv-input-error-summary').textContent = '';
}

function renderInputGroup(gridId, type, count) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const slot = document.createElement('div');
    slot.className = 'input-slot';
    slot.innerHTML = `
      <div class="input-slot-label">編號 ${i + 1}</div>
      <input type="number" class="input-slot-field" id="inv-input-${type}-${i}"
             min="1" max="60" placeholder="–" oninput="onInvSlotInput('${type}', ${i})">
      <div class="input-slot-preview" id="inv-input-preview-${type}-${i}"></div>`;
    grid.appendChild(slot);
  }
}

let _invRevalidating = false;

function onInvSlotInput(type, idx) {
  const field   = document.getElementById(`inv-input-${type}-${idx}`);
  const preview = document.getElementById(`inv-input-preview-${type}-${idx}`);
  if (!field || !preview) return;
  const raw = field.value.trim();
  if (raw === '') { field.className = 'input-slot-field'; preview.className = 'input-slot-preview'; preview.textContent = ''; _applyInputToState(); return; }
  const num = parseInt(raw, 10);
  if (isNaN(num) || num < 1) { _slotErr(field, preview, '請輸入正整數'); return; }
  const card = INVENTORY_CARDS.find(c => c.id === num);
  if (!card) { _slotErr(field, preview, `找不到編號 ${num}`); return; }
  if (checkInvDuplicate(type, idx, num)) { field.className = 'input-slot-field is-dup'; preview.className = 'input-slot-preview preview-dup'; preview.textContent = '重複的編號'; _applyInputToState(); return; }
  field.className = 'input-slot-field is-valid';
  preview.className = 'input-slot-preview preview-name';
  preview.textContent = card.title;
  // Revalidate sibling slots (e.g. un-dup a slot whose partner just changed),
  // guarded to prevent infinite recursion
  if (!_invRevalidating) {
    _invRevalidating = true;
    revalidateInvGroup(type);
    _invRevalidating = false;
  }
  _applyInputToState();
}

function _slotErr(f, p, msg) { f.className = 'input-slot-field is-error'; p.className = 'input-slot-preview preview-error'; p.textContent = msg; }

function checkInvDuplicate(type, currentIdx, num) {
  const other = type === 'strength' ? 'weakness' : 'strength';
  for (let i = 0; i < INV_INPUT_SLOTS; i++) {
    if (i !== currentIdx) { const f = document.getElementById(`inv-input-${type}-${i}`); if (f && parseInt(f.value.trim(), 10) === num) return true; }
    const f2 = document.getElementById(`inv-input-${other}-${i}`);
    if (f2 && parseInt(f2.value.trim(), 10) === num) return true;
  }
  return false;
}

function revalidateInvGroup(type) {
  for (let i = 0; i < INV_INPUT_SLOTS; i++) {
    const f = document.getElementById(`inv-input-${type}-${i}`);
    if (f && f.value.trim() && (f.className.includes('is-valid') || f.className.includes('is-dup'))) onInvSlotInput(type, i);
  }
}

function generateInputURL() {
  const strIds = [], weakIds = [], errors = [];
  const collect = (type, ids) => {
    for (let i = 0; i < INV_INPUT_SLOTS; i++) {
      const f = document.getElementById(`inv-input-${type}-${i}`);
      if (!f || !f.value.trim()) continue;
      const num = parseInt(f.value.trim(), 10);
      const lbl = type === 'strength' ? '強勢' : '劣勢';
      if (isNaN(num) || num < 1) { errors.push(`${lbl} 第${i+1}格`); continue; }
      const card = INVENTORY_CARDS.find(c => c.id === num);
      if (!card) { errors.push(`${lbl} 第${i+1}格（編號${num}不存在）`); continue; }
      const cross = type === 'strength' ? weakIds : strIds;
      if (ids.includes(num) || cross.includes(num)) { errors.push(`${lbl} 第${i+1}格（重複）`); continue; }
      ids.push(num);
    }
  };
  collect('strength', strIds); collect('weakness', weakIds);
  const summaryEl = document.getElementById('inv-input-error-summary');
  if (errors.length) { summaryEl.textContent = `⚠️ ${errors.join('、')} 有錯誤，請修正後再試`; return; }
  if (!strIds.length && !weakIds.length) { summaryEl.textContent = '⚠️ 請至少輸入一個編號'; return; }
  summaryEl.textContent = '';
  const params = new URLSearchParams();
  if (strIds.length)  params.set('strength', strIds.join(','));
  if (weakIds.length) params.set('weakness', weakIds.join(','));
  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  const rb = document.getElementById('inv-input-result-box');
  const urlEl = document.getElementById('inv-input-result-url');
  const namesEl = document.getElementById('inv-input-result-names');
  if (urlEl) urlEl.textContent = url;
  if (namesEl) {
    const strCards  = strIds.map(id  => INVENTORY_CARDS.find(c => c.id === id)).filter(Boolean);
    const weakCards = weakIds.map(id => INVENTORY_CARDS.find(c => c.id === id)).filter(Boolean);
    let html = '';
    if (strCards.length)  html += `<div class="inv-result-group-label">💪 強勢：</div>` + strCards.map(c => `<span class="occ-tag occ-tag-skill">${c.id} ${c.title}</span>`).join('');
    if (weakCards.length) html += `<div class="inv-result-group-label" style="margin-top:6px">🌱 劣勢：</div>` + weakCards.map(c => `<span class="occ-tag occ-tag-goal">${c.id} ${c.title}</span>`).join('');
    namesEl.innerHTML = html;
  }
  if (rb) rb.classList.add('visible');
  window._invGeneratedURL = url;
}

function copyInputURL() {
  const url = window._invGeneratedURL;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => showToast('✅ 連結已複製到剪貼簿！')).catch(() => prompt('複製此連結：', url));
}

function clearInputPanel() {
  strength = new Set();
  weakness = new Set();
  skipped.clear();
  currentIndex = 0;
  renderInputSlots();
  // Sync cleared state to other views
  renderCards(); renderDots(); updateStatusBar(); renderChips();
}

// ===================================================================
// INPUT ↔ STATE SYNC
// ===================================================================

// Read every input slot and rebuild strength/weakness from valid entries,
// then re-render select / spread / display views silently.
function _applyInputToState() {
  const newStr  = new Set();
  const newWeak = new Set();
  for (let i = 0; i < INV_INPUT_SLOTS; i++) {
    const sf = document.getElementById(`inv-input-strength-${i}`);
    const wf = document.getElementById(`inv-input-weakness-${i}`);
    if (sf && sf.classList.contains('is-valid')) {
      const n = parseInt(sf.value.trim(), 10);
      if (!isNaN(n)) newStr.add(n);
    }
    if (wf && wf.classList.contains('is-valid')) {
      const n = parseInt(wf.value.trim(), 10);
      if (!isNaN(n)) newWeak.add(n);
    }
  }
  strength = newStr;
  weakness = newWeak;
  renderCards();
  renderDots();
  updateStatusBar();
  renderChips();
}

// Pre-fill the input slots from the current strength/weakness Sets
// (called when switching into input mode with existing state).
function _fillSlotsFromState() {
  const strArr  = [...strength];
  const weakArr = [...weakness];
  for (let i = 0; i < INV_INPUT_SLOTS; i++) {
    const sf = document.getElementById(`inv-input-strength-${i}`);
    const wf = document.getElementById(`inv-input-weakness-${i}`);
    if (sf) {
      sf.value = i < strArr.length ? strArr[i] : '';
      onInvSlotInput('strength', i);
    }
    if (wf) {
      wf.value = i < weakArr.length ? weakArr[i] : '';
      onInvSlotInput('weakness', i);
    }
  }
}

// ===================================================================
// TOUCH / SWIPE
// ===================================================================

let _invTouchStartX = 0, _invTouchStartY = 0;

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('inv-cards-viewport');
  if (!viewport) return;
  viewport.addEventListener('touchstart', e => {
    _invTouchStartX = e.touches[0].clientX; _invTouchStartY = e.touches[0].clientY;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _invTouchStartX;
    const dy = e.changedTouches[0].clientY - _invTouchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) { if (dx < 0) nextCard(); else prevCard(); }
  }, { passive: true });
});

// ===================================================================
// DETAIL MODAL
// ===================================================================

function openDetailModal(id) {
  const card = INVENTORY_CARDS.find(c => c.id === id);
  if (!card) return;
  const meta = getCategoryMeta(card.category);
  const isStr  = strength.has(id);
  const isWeak = weakness.has(id);
  const statusBadge = isStr
    ? `<span class="inv-detail-status-badge str-badge">💪 強勢</span>`
    : isWeak
      ? `<span class="inv-detail-status-badge weak-badge">🌱 劣勢</span>`
      : '';

  const modalHtml = `
  <div class="inv-modal-overlay" id="inv-modal-overlay" onclick="closeModal(event)">
    <div class="inv-modal" onclick="event.stopPropagation()">
      <button class="inv-modal-close" onclick="closeModalBtn()">✕</button>
      <div class="inv-modal-body">

        <!-- ===== FRONT ===== -->
        <div class="inv-modal-side">
          <div class="inv-modal-side-label">正面</div>
          <div class="inv-modal-card-front" style="--cat-color:${meta.color};--cat-bg:${meta.bg}">
            <div class="inv-card-sun inv-modal-sun">
              <div class="inv-card-header">
                <span class="inv-category-badge" style="background:${meta.bg};color:${meta.color}">${meta.label}</span>
                <span class="inv-card-id">#${card.id}</span>
              </div>
              ${statusBadge}
              <div class="inv-card-title" style="color:${meta.color}">${card.title}</div>
              <ul class="inv-card-desc">${renderDescLines(card)}</ul>
            </div>
            <div class="inv-card-diagonal"></div>
            <div class="inv-card-moon inv-modal-moon">
              <span class="inv-moon-icon">🌙</span>
              <div class="inv-moon-shadows">
                <div class="inv-shadow-item">— ${card.shadow1}</div>
                ${card.shadow2 ? `<div class="inv-shadow-item">— ${card.shadow2}</div>` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- ===== BACK ===== -->
        <div class="inv-modal-side">
          <div class="inv-modal-side-label">背面</div>
          <div class="inv-modal-card-back">

            <!-- 如何管理陰影 -->
            <div class="inv-back-section">
              <div class="inv-back-section-head" style="color:${meta.color}">
                🔥🔥 如何管理陰影？
              </div>
              <div class="inv-back-rows">
                <div class="inv-back-row">
                  <span class="inv-back-badge consequence-badge">後果</span>
                  <span>${card.consequence1}</span>
                </div>
                <div class="inv-back-row">
                  <span class="inv-back-badge adjust-badge">調整</span>
                  <span>${card.adjustment1}</span>
                </div>
                ${card.consequence2 ? `
                <div class="inv-back-row">
                  <span class="inv-back-badge consequence-badge">後果</span>
                  <span>${card.consequence2}</span>
                </div>
                <div class="inv-back-row">
                  <span class="inv-back-badge adjust-badge">調整</span>
                  <span>${card.adjustment2}</span>
                </div>` : ''}
              </div>
            </div>

            <!-- 如何發揮優勢 -->
            <div class="inv-back-section">
              <div class="inv-back-section-head" style="color:${meta.color}">
                ☀️ 如何發揮優勢？
              </div>
              <div class="inv-back-rows">
                <div class="inv-back-row">
                  <span class="inv-back-badge role-badge">職業</span>
                  <span>${card.fitRole}</span>
                </div>
                <div class="inv-back-row">
                  <span class="inv-back-badge task-badge">任務</span>
                  <span>${card.fitTask}</span>
                </div>
                <div class="inv-back-row">
                  <span class="inv-back-badge general-badge">通用</span>
                  <span>${card.fitGeneral}</span>
                </div>
              </div>
            </div>

            <!-- 缺乏如何提升 -->
            <div class="inv-back-section">
              <div class="inv-back-section-head" style="color:${meta.color}">
                🔥 缺乏如何提升？
              </div>
              <div class="inv-improve-steps">
                ${card.improveSteps.map(s => `<div class="inv-improve-step">${s}</div>`).join('')}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('inv-modal-overlay')) return;
  const overlay = document.getElementById('inv-modal-overlay');
  if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
}

function closeModalBtn() {
  const overlay = document.getElementById('inv-modal-overlay');
  if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
}
