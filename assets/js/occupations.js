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
  { id:  1, name:'幼教老師', field:'教育學群', code:'SA', skills:["教育訓練", "心理學", "顧客服務"], goals:["教導與培育幼兒", "協助和照顧他人", "創造安全的學習環境"], desc:'規劃並執行學齡前兒童的教育課程，透過遊戲與互動促進幼兒認知、語言與社會發展。' },
  { id:  2, name:'國高中老師', field:'教育學群', code:'SA', skills:["教育訓練", "語文文學", "社會人類"], goals:["教導與培育學生", "持續進修專業知識", "激勵學生學習動力"], desc:'負責中學各科目的教學工作，設計課程與評量，引導學生建立學科知識與思辨能力。' },
  { id:  3, name:'社工師', field:'社會與心理學群', code:'SE', skills:["社會人類", "顧客服務", "法律"], goals:["協助和照顧他人", "發現與解決他人問題", "建立社會支持網絡"], desc:'協助個人、家庭或社區解決各種生活困境，提供資源連結與心理支持，維護弱勢族群的權益。' },
  { id:  4, name:'神職人員', field:'宗教/社會與心理學群', code:'SEA', skills:["語文文學", "社會人類", "教育訓練"], goals:["協助和照顧他人", "傳遞信仰與精神價值", "帶領社群活動"], desc:'在宗教機構中主持儀式、講道與牧養工作，提供信眾靈性支持與生命輔導。' },
  { id:  5, name:'導遊/導覽員', field:'餐旅及民生服務學群', code:'SEA', skills:["語文文學", "顧客服務", "地理歷史"], goals:["與他人溝通協調", "分享知識與文化", "安排行程與活動"], desc:'帶領旅客或訪客進行參觀，解說地方歷史、文化與自然景觀，提供優質的旅遊體驗。' },
  { id:  6, name:'服務生', field:'餐旅及民生服務學群', code:'SEC', skills:["顧客服務", "食品餐飲", "行政"], goals:["提供優質用餐服務", "協助顧客需求", "維持餐廳順暢運作"], desc:'在餐廳或餐飲場所協助顧客點餐、上菜與結帳，確保顧客有舒適的用餐體驗。' },
  { id:  7, name:'家教/補習班老師', field:'教育學群', code:'SEI', skills:["教育訓練", "語文文學", "數學"], goals:["教導與培育學生", "找出學習關鍵問題", "激勵學生學習動力"], desc:'針對學生個別需求提供課後補習或一對一家教，幫助學生加強學科能力與應試技巧。' },
  { id:  8, name:'教授', field:'教育/各學群', code:'SI', skills:["教育訓練", "研究分析", "語文文學"], goals:["持續進修專業知識", "教導與培育學生", "發表與分享研究成果"], desc:'在大學或研究機構從事教學與學術研究，培育高等人才，推進所屬領域的知識發展。' },
  { id:  9, name:'諮商與臨床心理師', field:'社會與心理學群', code:'SIA', skills:["心理學", "社會人類", "顧客服務"], goals:["協助和照顧他人", "發現與解決他人問題", "找出關鍵資訊和線索"], desc:'運用心理學理論與技術，評估並治療個案的心理健康問題，提供個別或團體諮商服務。' },
  { id: 10, name:'護理師', field:'醫藥衛生學群', code:'SIC', skills:["醫學", "顧客服務", "生命科學"], goals:["協助和照顧病患", "執行醫療照護程序", "持續進修專業知識"], desc:'在醫療機構中協助醫師照護病患，執行注射、換藥等護理處置，並提供健康教育與衛教指導。' },
  { id: 11, name:'物理與職能治療師', field:'醫藥衛生學群', code:'SIR', skills:["醫學", "生命科學", "顧客服務"], goals:["協助和照顧他人", "提出個人化復健方案", "持續進修專業知識"], desc:'為身體功能受損的個案提供復健治療，透過運動治療與輔具應用，協助恢復日常生活能力。' },
  { id: 12, name:'看護', field:'醫藥衛生學群', code:'SRC', skills:["顧客服務", "醫學", "安全衛生"], goals:["協助和照顧病患日常起居", "維持生活照護品質", "與病患及家屬溝通"], desc:'在醫療機構或居家環境中，協助行動不便或高齡者的日常生活照護，包含飲食、清潔與移位等工作。' },
  { id: 13, name:'運動教練', field:'體育學群', code:'SRE', skills:["體育運動", "教育訓練", "心理學"], goals:["教導與培育運動技能", "激勵選手挑戰極限", "規劃訓練計畫"], desc:'指導運動員或學員的體能訓練與技術養成，制訂競技策略，協助選手在比賽中發揮最佳狀態。' },
  { id: 14, name:'遊戲設計師', field:'資訊/藝術學群', code:'AE', skills:["設計", "資訊電子", "藝術"], goals:["創新設計遊戲體驗", "整合技術與創意", "分析玩家行為回饋"], desc:'負責規劃遊戲的世界觀、角色、關卡與玩法機制，結合美術與程式資源打造完整的遊戲體驗。' },
  { id: 15, name:'室內設計師', field:'設計學群', code:'AE', skills:["設計", "藝術", "建築工程"], goals:["創新設計空間美感", "規劃與組織室內空間", "整合客戶需求與預算"], desc:'依據客戶需求與建築條件，規劃室內空間配置、風格、材料與照明，創造兼具美感與功能的居住或商業環境。' },
  { id: 16, name:'音樂家', field:'藝術學群', code:'AE', skills:["藝術", "語文文學", "教育訓練"], goals:["創作與表演音樂作品", "傳遞情感與美感", "持續精進演奏技藝"], desc:'從事音樂創作、演奏或演唱，在舞台上傳達情感與故事，可能同時擔任作曲、編曲或音樂教學工作。' },
  { id: 17, name:'演員', field:'藝術學群', code:'AE', skills:["藝術", "語文文學", "心理學"], goals:["詮釋與表演角色", "傳遞情感與故事", "持續精進表演技藝"], desc:'在影視、舞台或廣告等媒介中詮釋角色，透過肢體語言、聲音與情感表達，賦予角色真實的生命力。' },
  { id: 18, name:'藝術總監', field:'藝術/設計學群', code:'AE', skills:["設計", "藝術", "管理"], goals:["主導創意視覺方向", "整合團隊完成創作", "建立品牌視覺識別"], desc:'負責廣告、影視或品牌專案的視覺整體策略，帶領設計與創意團隊，確保所有視覺呈現符合品牌定位。' },
  { id: 19, name:'編輯', field:'大眾傳播/語文學群', code:'AEC', skills:["語文文學", "傳播媒體", "資訊電子"], goals:["審閱與優化文字內容", "找出關鍵資訊和線索", "協調作者與出版流程"], desc:'審核、修改與整理書籍、雜誌或網路媒體的文稿，確保內容品質，並與作者、美編協調完成出版工作。' },
  { id: 20, name:'記者/特派員', field:'大眾傳播學群', code:'AEI', skills:["語文文學", "傳播媒體", "社會人類"], goals:["搜尋與報導新聞事件", "分析資訊", "與各方建立採訪聯繫"], desc:'深入採訪各類新聞事件，撰寫或播報報導，以客觀公正的方式將時事資訊傳達給大眾。' },
  { id: 21, name:'商業與工業設計師', field:'設計學群', code:'AER', skills:["設計", "工程科技", "藝術"], goals:["創新設計符合市場需求的產品", "整合美感與功能性", "研究使用者需求"], desc:'為工業產品或消費性商品進行外觀與功能設計，結合工程可行性與美學考量，開發具競爭力的產品。' },
  { id: 22, name:'流行服飾設計師', field:'設計學群', code:'AER', skills:["設計", "藝術", "銷售行銷"], goals:["創作服飾設計作品", "掌握流行趨勢", "結合美感與實穿機能"], desc:'依據流行趨勢與品牌定位，設計服裝與配件，監督打版、打樣與生產流程，展現獨特的美學風格。' },
  { id: 23, name:'廣電主播/主持人', field:'大眾傳播學群', code:'AES', skills:["語文文學", "傳播媒體", "顧客服務"], goals:["傳遞資訊與新聞", "與觀眾建立互動連結", "持續提升表達能力"], desc:'在電視、廣播或網路平台上主持節目或播報新聞，以清晰的口條與專業形象向觀眾傳達各類資訊。' },
  { id: 24, name:'造型設計師', field:'設計/藝術學群', code:'AES', skills:["設計", "藝術", "顧客服務"], goals:["創作個人化造型風格", "掌握流行趨勢", "滿足客戶形象需求"], desc:'為客戶或藝人規劃整體造型，包含服裝、髮型與彩妝搭配，打造符合場合或個人特色的視覺形象。' },
  { id: 25, name:'詩人/作家', field:'語文學群', code:'AI', skills:["語文文學", "藝術", "社會人類"], goals:["創作文學作品", "傳遞思想與情感", "持續精進寫作技藝"], desc:'透過文字創作詩歌、小說、散文等文學作品，以獨特的語言風格記錄生命經驗並引發讀者共鳴。' },
  { id: 26, name:'多媒體設計師', field:'資訊/藝術學群', code:'AI', skills:["資訊電子", "設計", "藝術"], goals:["整合多媒體創作內容", "創新設計數位作品", "持續進修數位設計技能"], desc:'運用影像、動畫、音效與互動技術，創作數位內容或互動媒體，廣泛應用於廣告、教育與娛樂領域。' },
  { id: 27, name:'建築師', field:'建築及都市設計學群', code:'AIR', skills:["設計", "工程科技", "數學"], goals:["規劃與設計建築空間", "創新設計融合環境", "整合法規與美感需求"], desc:'依據客戶需求與基地條件，規劃建築物的空間配置與外觀造型，並監督施工確保設計品質與安全。' },
  { id: 28, name:'攝影師', field:'藝術/設計學群', code:'AR', skills:["藝術", "設計", "資訊電子"], goals:["捕捉與詮釋視覺影像", "創作攝影作品", "持續精進拍攝技術"], desc:'運用相機與後製技術拍攝人物、商品、風景或新聞等各類題材，透過光線與構圖傳遞視覺美感與訊息。' },
  { id: 29, name:'藝術家', field:'藝術學群', code:'AR', skills:["藝術", "設計", "語文文學"], goals:["創作藝術作品", "傳遞個人觀點與情感", "探索創作媒材與技法"], desc:'以繪畫、雕塑、裝置或數位等多元媒材進行藝術創作，透過展覽與交流表達個人的觀點與美學主張。' },
  { id: 30, name:'舞者', field:'藝術學群', code:'AR', skills:["藝術", "體育運動", "教育訓練"], goals:["詮釋與表演舞蹈", "傳遞情感與肢體美感", "持續精進舞蹈技藝"], desc:'透過肢體律動詮釋音樂與故事，在舞台上展現各類舞蹈風格，可能同時從事教學或編舞工作。' },
  { id: 31, name:'平面設計師', field:'設計學群', code:'ARE', skills:["設計", "藝術", "資訊電子"], goals:["創作視覺設計作品", "傳達品牌視覺訊息", "整合美感與溝通功能"], desc:'運用排版、色彩與圖像等視覺元素，設計海報、包裝、網頁等各類平面素材，傳遞品牌或訊息。' },
  { id: 32, name:'景觀/園藝設計師', field:'設計/生物資源學群', code:'ARE', skills:["設計", "地球環境", "生命科學"], goals:["規劃與設計戶外景觀空間", "創造美化自然環境", "整合生態與美感需求"], desc:'為公園、社區或私人庭院規劃植栽配置與景觀設施，結合生態知識與美學設計打造舒適的戶外環境。' },
  { id: 33, name:'翻譯/口譯', field:'語文學群', code:'AS', skills:["語文文學", "社會人類", "顧客服務"], goals:["跨語言精確傳達訊息", "協助跨文化溝通", "持續進修語言能力"], desc:'將文件、書籍或口語內容在不同語言之間進行轉換，確保語意準確且符合目標語言的文化習慣。' },
  { id: 34, name:'數位行銷', field:'管理/傳播學群', code:'EA', skills:["銷售行銷", "資訊電子", "傳播媒體"], goals:["制定數位行銷策略", "分析市場與用戶數據", "提升品牌曝光與轉換率"], desc:'運用社群媒體、搜尋引擎及網路廣告等數位管道，規劃與執行品牌行銷活動，並透過數據分析持續優化成效。' },
  { id: 35, name:'廣告文案', field:'大眾傳播/管理學群', code:'EA', skills:["語文文學", "銷售行銷", "傳播媒體"], goals:["創作具說服力的廣告文案", "傳達品牌核心價值", "整合創意與行銷策略"], desc:'為品牌或產品撰寫廣告標語、影片腳本與行銷文字，透過精準的語言表達激發消費者共鳴與購買慾望。' },
  { id: 36, name:'導演', field:'藝術/傳播學群', code:'EA', skills:["藝術", "傳播媒體", "管理"], goals:["主導影視創作方向", "整合製作團隊完成作品", "傳遞故事與情感意境"], desc:'統籌電影、電視或廣告的拍攝製作，指導演員詮釋角色，把控整體視覺風格與敘事節奏。' },
  { id: 37, name:'公關', field:'管理/傳播學群', code:'EAS', skills:["銷售行銷", "傳播媒體", "顧客服務"], goals:["建立與維護企業品牌形象", "與媒體及公眾溝通", "危機處理與輿情管理"], desc:'代表企業或品牌與媒體、政府和公眾進行溝通，規劃公關活動，並在危機發生時管理對外訊息與形象。' },
  { id: 38, name:'不動產經紀人', field:'財經學群', code:'EC', skills:["銷售行銷", "法律", "顧客服務"], goals:["協助買賣雙方完成交易", "建立客戶信任關係", "分析房地產市場行情"], desc:'協助客戶買賣或租賃房屋，提供市場行情分析、帶看物件與交易協商服務，並處理相關法律文件。' },
  { id: 39, name:'業務人員', field:'管理學群', code:'EC', skills:["銷售行銷", "顧客服務", "管理"], goals:["達成業績目標", "開發與維護客戶關係", "找出商業機會"], desc:'主動開發新客戶並維護既有客戶關係，推廣公司產品或服務，完成銷售目標並回饋市場情報。' },
  { id: 40, name:'門市/專櫃人員', field:'管理/餐旅學群', code:'EC', skills:["顧客服務", "銷售行銷", "行政"], goals:["提供優質顧客服務", "達成門市銷售目標", "維持商品與環境整潔"], desc:'在零售門市或百貨專櫃為顧客介紹商品、協助選購與結帳，維護陳列環境，達成銷售績效。' },
  { id: 41, name:'軍官', field:'軍警國防學群', code:'ECR', skills:["管理", "法律", "體育運動"], goals:["領導與管理部隊", "維護國家安全", "訓練與培育部屬"], desc:'在軍事單位中帶領士兵執行任務與訓練，負責部隊管理、作戰規劃及維護國家安全。' },
  { id: 42, name:'咖啡師', field:'餐旅及民生服務學群', code:'ECR', skills:["食品餐飲", "顧客服務", "藝術"], goals:["精製高品質咖啡飲品", "提供優質服務體驗", "持續精進沖煮技藝"], desc:'熟練掌握各式咖啡萃取技術，根據顧客喜好調製飲品，並維護咖啡設備，同時提供親切的服務。' },
  { id: 43, name:'保險經紀人', field:'財經學群', code:'ECS', skills:["銷售行銷", "顧客服務", "法律"], goals:["分析客戶保障需求", "建立長期客戶信任關係", "提供財務風險規劃建議"], desc:'了解客戶的財務狀況與保障需求，推薦適合的保險商品，協助辦理理賠事宜，提供長期保障規劃服務。' },
  { id: 44, name:'總經理', field:'管理學群', code:'ECS', skills:["管理", "銷售行銷", "財務"], goals:["制定企業策略與目標", "領導與激勵管理團隊", "推動組織持續成長"], desc:'統籌企業各部門的營運，制定經營方向與年度目標，整合資源並帶領團隊達成公司整體業績與發展。' },
  { id: 45, name:'專案管理師', field:'管理學群', code:'ECS', skills:["管理", "資訊電子", "溝通協調"], goals:["規劃與執行專案流程", "協調跨部門合作", "掌控時程品質與成本"], desc:'負責統籌管理特定專案，制訂計畫、分配資源、協調各方利害關係人，確保專案如期如質完成。' },
  { id: 46, name:'人力資源專員', field:'管理學群', code:'ECS', skills:["管理", "顧客服務", "法律"], goals:["招募與培育優秀人才", "制定人才發展策略", "建立正向組織文化"], desc:'負責招募遴選、員工教育訓練、薪酬福利管理與勞資關係，協助組織吸引並留住優秀人才。' },
  { id: 47, name:'律師', field:'法律學群', code:'EI', skills:["法律", "語文文學", "社會人類"], goals:["維護當事人合法權益", "分析法律爭議", "撰寫法律文件與辯護狀"], desc:'為當事人提供法律諮詢與訴訟代理服務，運用法律知識保障客戶權益，處理民事、刑事或商業等各類法律事務。' },
  { id: 48, name:'網站行銷策劃', field:'管理/資訊學群', code:'EIC', skills:["銷售行銷", "資訊電子", "數學"], goals:["規劃網路行銷策略", "分析用戶行為數據", "提升網站流量與轉換率"], desc:'整合SEO、廣告投放與內容行銷等策略，規劃品牌的網路行銷計畫，並以數據分析持續優化成效。' },
  { id: 49, name:'企業顧問', field:'管理學群', code:'EIC', skills:["管理", "銷售行銷", "數學"], goals:["診斷企業問題與需求", "提供策略改善建議", "協助客戶達成業務目標"], desc:'深入了解客戶企業的營運挑戰，運用產業知識與分析方法提供解決方案，協助企業提升競爭力。' },
  { id: 50, name:'船長/領航員', field:'運輸與物流學群', code:'ERC', skills:["工程科技", "地球環境", "管理"], goals:["安全駕駛與導航船隻", "管理船員與貨物運送", "掌握氣象與航行規劃"], desc:'負責指揮船舶航行，確保船員、旅客及貨物的安全，掌握航路規劃、氣象判斷與緊急應變處理。' },
  { id: 51, name:'法官', field:'法律學群', code:'ES', skills:["法律", "語文文學", "社會人類"], goals:["公正裁判法律糾紛", "解釋與適用法律條文", "維護社會正義"], desc:'在法院中主持訴訟程序，依法審查證據與雙方陳述，作出公正客觀的判決，捍衛人民的合法權益。' },
  { id: 52, name:'議員/立法委員', field:'法律/社會與心理學群', code:'ES', skills:["法律", "社會人類", "語文文學"], goals:["制定法律與公共政策", "代表民意發聲", "協調公共事務與資源"], desc:'代表選民在立法機關審議法案、監督政府施政，透過協商與倡議推動有益社會的政策與立法。' },
  { id: 53, name:'禮儀師', field:'餐旅及民生服務學群', code:'ESC', skills:["顧客服務", "社會人類", "行政"], goals:["規劃與執行殯葬儀式流程", "以同理心陪伴家屬", "協調殯葬各項行政事宜"], desc:'協助家屬處理往生者的告別式安排，包含遺體護理、儀式規劃與行政流程，以溫暖與專業陪伴喪親家庭。' },
  { id: 54, name:'空服員', field:'餐旅及民生服務學群', code:'ESC', skills:["顧客服務", "語文文學", "安全衛生"], goals:["提供優質客艙飛行服務", "維護旅客飛行安全", "跨文化溝通協調"], desc:'在航班上提供餐飲服務、安全示範與緊急應變，以多國語言與旅客溝通，確保每趟飛行的舒適與安全。' },
  { id: 55, name:'客服人員', field:'管理學群', code:'ESC', skills:["顧客服務", "溝通協調", "資訊電子"], goals:["解決客戶問題與需求", "維護客戶滿意度", "記錄與分析客戶回饋"], desc:'透過電話、線上聊天或電子郵件接受客戶諮詢與投訴，提供問題解決方案，提升顧客服務體驗。' },
  { id: 56, name:'按摩/美容師', field:'餐旅及民生服務學群', code:'ESR', skills:["顧客服務", "醫學", "藝術"], goals:["提供身體舒壓與護理服務", "了解客戶健康與美容需求", "持續精進專業技術"], desc:'為客戶提供按摩、美容護膚或美體服務，舒緩身體疲勞與壓力，並根據客戶需求推薦適合的護理方案。' },
  { id: 57, name:'會計師', field:'財經學群', code:'CE', skills:["數學", "財務", "法律"], goals:["編製財務報告", "稽核財務資料正確性", "提供財務合規建議"], desc:'負責企業財務帳目的記錄與核算，編製財務報表，並依稅法規定申報，確保財務作業的正確性與合規性。' },
  { id: 58, name:'採購', field:'管理/財經學群', code:'CE', skills:["銷售行銷", "管理", "財務"], goals:["評估與選擇供應商", "控管採購成本", "建立穩定的供應鏈關係"], desc:'根據公司需求向供應商詢價、比價與議價，確保物料或服務的品質、數量與時程，並維護良好的廠商關係。' },
  { id: 59, name:'行政人員', field:'管理學群', code:'CER', skills:["行政", "資訊電子", "管理"], goals:["維持辦公室行政順暢運作", "處理文件資料與歸檔", "協調內部溝通事務"], desc:'負責辦公室日常行政作業，包含文件處理、行程安排、會議籌辦及跨部門聯繫，確保組織運作效率。' },
  { id: 60, name:'公務員', field:'管理/法律學群', code:'CES', skills:["行政", "法律", "管理"], goals:["執行政府政策與法令", "提供民眾公共服務", "維持行政程序正確性"], desc:'在政府機關依法執行各項行政業務，受理民眾申請、執行政策並維護公共秩序，確保行政公正與效率。' },
  { id: 61, name:'資料與檔案管理員', field:'管理/資訊學群', code:'CI', skills:["行政", "資訊電子", "數學"], goals:["建立與維護資料檔案系統", "確保資料安全與完整", "優化資料查詢效率"], desc:'負責組織資料的建檔、分類、儲存與維護，管理實體或電子文件，確保資訊可快速查詢且保存完整。' },
  { id: 62, name:'精算師', field:'財經/數理化學群', code:'CIE', skills:["數學", "財務", "統計"], goals:["建立風險評估模型", "分析保險與財務數據", "提供精算與財務建議"], desc:'運用數學與統計方法評估金融及保險相關風險，建立精算模型，為保費定價、準備金提存等決策提供科學依據。' },
  { id: 63, name:'金融投資分析師', field:'財經學群', code:'CIE', skills:["財務", "數學", "銷售行銷"], goals:["分析金融市場趨勢", "評估投資風險與報酬", "撰寫投資研究報告"], desc:'深入研究產業與公司財務數據，評估股票、債券或基金等投資標的的價值，提供投資建議與資產配置策略。' },
  { id: 64, name:'資訊安全人員', field:'資訊學群', code:'CIR', skills:["資訊電子", "工程科技", "法律"], goals:["保護系統與資料安全", "偵測與回應資安事件", "持續進修資安知識"], desc:'規劃並執行企業的資訊安全策略，監控網路與系統異常，防範駭客攻擊，確保資料與基礎設施安全。' },
  { id: 65, name:'網站開發人員', field:'資訊學群', code:'CIR', skills:["資訊電子", "設計", "數學"], goals:["開發與維護網站系統", "優化使用者操作體驗", "持續進修程式技術"], desc:'負責網站或網路應用程式的前後端開發，撰寫程式碼、測試功能與維護系統效能，確保網站穩定運作。' },
  { id: 66, name:'人類學家', field:'社會與心理學群', code:'IA', skills:["社會人類", "教育訓練", "語文文學"], goals:["搜尋資訊", "處理資料", "分析資訊"], desc:'研究人類的行為、社會變遷、組織架構、語言和文化等等。' },
  { id: 67, name:'程式設計師', field:'資訊學群', code:'IC', skills:["資訊電子", "數學", "管理"], goals:["運用電腦工作", "持續進修專業知識", "分析資訊"], desc:'分析、編寫、修改、測試程式碼，開發電腦應用程式。' },
  { id: 68, name:'數據分析師', field:'數理化/資訊', code:'ICE', skills:["數學", "資訊電子", "工程科技"], goals:["分析資訊", "創新設計", "提供諮詢"], desc:'收集並分析大量數據，依此歸納與預測未來趨勢、評估與訂定決策。' },
  { id: 69, name:'藥師', field:'醫藥衛生學群', code:'ICS', skills:["醫學", "化學", "顧客服務"], goals:["持續進修專業知識", "找出關鍵資訊和線索", "檢查是否符合規範"], desc:'根據醫師的處方簽進行檢核，並提供所需之藥物。' },
  { id: 70, name:'市場調查人員', field:'財經/管理/社會與心理學群', code:'IEC', skills:["銷售行銷", "顧客服務", "數學"], goals:["安排工作和活動時程", "建立夥伴關係", "分析資訊"], desc:'調查並研究市場現況與外來趨勢，提供行銷決策時所必需的資料。' },
  { id: 71, name:'商業智慧分析師', field:'資訊/數理化/管理學群', code:'IEC', skills:["銷售行銷", "管理", "數學"], goals:["持續進修專業知識", "分析資訊", "組織內部溝通"], desc:'透過資料分析工具，研究過去企業資料，整理成報表輔佐決策。' },
  { id: 72, name:'大氣科學家', field:'地球與環境/生命科學學群', code:'IR', skills:["數學", "地球環境", "資訊電子"], goals:["持續進修專業知識", "處理資料", "分析資訊"], desc:'研究氣象並解釋衛星、雷達和氣象預報等資料。' },
  { id: 73, name:'電機工程師', field:'工程/數理化學群', code:'IR', skills:["工程科技", "設計", "資訊電子"], goals:["持續進修專業知識", "提出解決問題的方案", "創新設計"], desc:'開發、監測電機設備或電機系統的製造和安裝。' },
  { id: 74, name:'航太工程師', field:'工程/數理化學群', code:'IR', skills:["工程科技", "設計", "機械"], goals:["持續進修專業知識", "製作圖稿與規格書並解說", "創新設計"], desc:'進行專案，設計、開發和測試飛機飛彈和太空等設備。' },
  { id: 75, name:'人因工程師', field:'工程/社會與心理學', code:'IR', skills:["心理學", "工程科技", "數學"], goals:["創新設計", "持續進修專業知識", "處理資料"], desc:'根據人類行為，設計設備工具或工作環境，讓人與系統互動發揮更大效益。' },
  { id: 76, name:'生命科學家', field:'生命科學/生物資源學群', code:'IR', skills:["生命科學", "數學", "化學"], goals:["持續進修專業知識", "處理資料", "分析資訊"], desc:'研究各種生命的知識，包含起源、發展、結構和功能等。' },
  { id: 77, name:'生化工程師', field:'數理化/工程/生命科學學程', code:'IR', skills:["生命科學", "工程設計", "化學"], goals:["找出關鍵資訊和線索", "持續進修專業知識", "處理資料"], desc:'以生命科學與化學知識、技術開發產品，解決人、動植物、微生物相關問題。' },
  { id: 78, name:'化工工程師', field:'數理化/工程/生命科學學群', code:'IR', skills:["工程科技", "化學", "數學"], goals:["持續進修專業知識", "提出解決問題的方案", "處理資料"], desc:'設計化工製造流程及開發化工產品，如化妝品、塑膠、水泥等。' },
  { id: 79, name:'環工工程師', field:'地球與環境/工程學群', code:'IRC', skills:["工程科技", "數學", "設計"], goals:["持續進修專業知識", "處理資料", "提出解決問題的方案"], desc:'設計、規劃或執行與環境衛生相關的工程，如廢棄物處理等。' },
  { id: 80, name:'機電工程師', field:'工程/數理化學群', code:'IRC', skills:["工程科技", "設計", "資訊電子"], goals:["製作圖稿與規格書並解說", "持續進修專業知識", "創新設計"], desc:'運用機械、電機與電腦工程原理，設計自動化或智慧型的系統與產品。' },
  { id: 81, name:'機械工程師', field:'工程/數理化學群', code:'IRC', skills:["設計", "工程科技", "數學"], goals:["持續進修專業知識", "創新設計", "處理資料"], desc:'規劃和設計工具、引擎、機器等裝備，也會負責安裝、操作、維修等工作。' },
  { id: 82, name:'光電工程師', field:'數理化/工程學群', code:'IRC', skills:["工程科技", "物理", "數學"], goals:["處理資料", "創新設計", "分析資訊"], desc:'運用工程與數學原理，研發光能利用的技術。' },
  { id: 83, name:'電腦硬體工程師', field:'資訊/工程學群', code:'IRC', skills:["資訊電子", "工程科技", "數學"], goals:["創新設計", "持續進修專業知識", "資料處理"], desc:'研究、設計、開發與測試電腦硬體設備，或是監測製造與安裝過程。' },
  { id: 84, name:'網管人員', field:'資訊學群', code:'IRC', skills:["資訊電子", "通訊電信", "行政"], goals:["運用電腦工作", "找出關鍵資訊和線索", "持續進修專業知識"], desc:'負責維繫企業的網路環境，進行維護與檢測，確保網路環境順暢運作。' },
  { id: 85, name:'水土保育人員', field:'地球與環境學群', code:'IRE', skills:["地球環境", "工程科技", "生命科學"], goals:["調查與評估水土資源", "執行水土保持工程", "維護自然生態環境"], desc:'調查評估山坡地與農地的水土流失狀況，規劃並執行水土保持工程，維護土地資源與生態環境。' },
  { id: 86, name:'材料工程師', field:'工程/數理化學群', code:'IRE', skills:["工程科技", "化學", "數學"], goals:["研發新型工程材料", "測試材料性能與可靠度", "應用材料解決工程問題"], desc:'研究金屬、陶瓷、高分子等各類材料的性質與應用，開發具備特定性能的新材料，應用於製造業或科技產業。' },
  { id: 87, name:'牙醫師', field:'醫藥衛生學群', code:'IRS', skills:["醫學", "生命科學", "顧客服務"], goals:["診斷與治療口腔疾病", "預防口腔健康問題", "提供牙科諮詢服務"], desc:'診斷並治療牙齒、牙周及口腔相關疾病，提供補牙、拔牙、矯正等醫療服務，維護患者的口腔健康。' },
  { id: 88, name:'營養師', field:'醫藥衛生學群', code:'IS', skills:["醫學", "生命科學", "顧客服務"], goals:["評估個人營養狀況", "制定個人化飲食計畫", "推廣健康飲食觀念"], desc:'根據個案健康狀況與疾病需求，提供飲食評估與營養諮詢，制訂均衡飲食計畫，協助改善健康狀態。' },
  { id: 89, name:'醫師', field:'醫藥衛生學群', code:'ISR', skills:["醫學", "生命科學", "顧客服務"], goals:["診斷與治療疾病", "持續進修醫學知識", "協助病患恢復健康"], desc:'透過問診、檢查與檢驗評估病患狀況，開立診斷與治療方案，提供藥物或手術等醫療處置。' },
  { id: 90, name:'獸醫', field:'醫藥衛生/生物資源學群', code:'ISR', skills:["醫學", "顧客服務", "生命科學"], goals:["找出關鍵資訊和線索", "提出解決問題的方案", "協助和照顧他人"], desc:'針對有疾病或障礙的動物進行診斷與治療。也可能從事研發、諮詢、銷售等等。' },
  { id: 91, name:'保全', field:'軍警國防學群', code:'RCE', skills:["安全衛生", "法律", "體育運動"], goals:["維護場所安全與秩序", "監控安全設備與系統", "應對緊急突發事件"], desc:'在企業、社區或公共場所執行安全警衛工作，監控出入人員、巡邏場域，防範各類安全事故發生。' },
  { id: 92, name:'產品維修人員', field:'工程學群', code:'RCI', skills:["機械", "工程科技", "資訊電子"], goals:["診斷與修復產品故障", "確保設備正常運作", "提供技術維修服務"], desc:'負責診斷並修復各類電子或機械產品的故障，進行保養維護作業，確保設備在最佳狀態下運作。' },
  { id: 93, name:'機長', field:'運輸與物流學群', code:'RCI', skills:["工程科技", "地球環境", "管理"], goals:["安全駕駛飛機", "確保旅客飛行安全", "掌握航空氣象與航路規劃"], desc:'負責民航或軍用飛機的飛行操作，掌握氣象、航路與緊急應變，確保乘客與機組人員的飛行安全。' },
  { id: 94, name:'運動員', field:'體育學群', code:'RE', skills:["體育運動", "管理", "心理學"], goals:["提升競技運動技術", "追求最佳運動表現", "挑戰個人與競技極限"], desc:'全力投入特定運動項目的訓練與比賽，透過系統性的體能訓練與技術磨練，在競賽中爭取優異成績。' },
  { id: 95, name:'廚師', field:'餐旅及民生服務學群', code:'REA', skills:["食品餐飲", "藝術", "管理"], goals:["烹調高品質料理", "創作與研發新菜色", "掌控食材品質與衛生"], desc:'運用烹飪技術與食材知識，在餐廳或廚房準備各類料理，兼顧食物的味道、外觀與衛生安全。' },
  { id: 96, name:'警察', field:'軍警國防學群', code:'REC', skills:["法律", "安全衛生", "體育運動"], goals:["維護社會治安與秩序", "偵查犯罪事件", "保護民眾人身安全"], desc:'執行犯罪偵查、交通管理、社會秩序維護等勤務，保障民眾安全並依法處理各類違法事件。' },
  { id: 97, name:'動物飼養員', field:'生物資源學群', code:'RI', skills:["生命科學", "安全衛生", "顧客服務"], goals:["照顧與飼育各類動物", "維護動物健康狀況", "推廣動物保育知識"], desc:'在動物園、農場或研究機構中照顧動物的日常起居，提供適切的飼料、環境與健康管理。' },
  { id: 98, name:'地理與航照測繪員', field:'地球與環境學群', code:'RIC', skills:["地球環境", "工程科技", "數學"], goals:["測繪地形與地物資料", "處理地理空間資訊", "製作精確地圖資料"], desc:'使用測量儀器或航空攝影技術蒐集地理資訊，進行地形圖製作、坐標定位與空間資料分析。' },
  { id: 99, name:'土木工程師', field:'工程學群', code:'RIC', skills:["工程科技", "數學", "設計"], goals:["規劃與設計基礎建設", "監督工程施工品質", "確保工程安全符合法規"], desc:'設計並監督道路、橋梁、隧道、水壩等基礎設施的興建，確保工程品質、安全及環境影響符合規範。' },
  { id:100, name:'農業與食品技術員', field:'生物資源學群', code:'RIC', skills:["生命科學", "地球環境", "食品餐飲"], goals:["管理農業生產作業", "改善農作物品質與產量", "推廣農業技術"], desc:'負責農作物的種植、灌溉與病蟲害防治管理，或從事食品加工與品質檢驗，確保農產品達到標準品質。' },
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

const INPUT_SLOTS = 12;

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

function onSlotInput(slotIndex) {
  const field   = document.getElementById(`input-slot-${slotIndex}`);
  const preview = document.getElementById(`input-slot-preview-${slotIndex}`);
  if (!field || !preview) return;

  const raw = field.value.trim();
  if (raw === '') {
    field.className = 'input-slot-field';
    preview.className = 'input-slot-preview';
    preview.textContent = '';
    return;
  }

  const num = parseInt(raw, 10);
  if (isNaN(num) || num !== parseFloat(raw) || num < 1) {
    field.className = 'input-slot-field is-error';
    preview.className = 'input-slot-preview preview-error';
    preview.textContent = '請輸入正整數';
    return;
  }

  const occ = OCCUPATIONS.find(o => o.id === num);
  if (!occ) {
    field.className = 'input-slot-field is-error';
    preview.className = 'input-slot-preview preview-error';
    preview.textContent = `找不到編號 ${num}`;
    return;
  }

  // Check duplicate across other slots
  const isDup = checkDuplicate(slotIndex, num);
  if (isDup) {
    field.className = 'input-slot-field is-dup';
    preview.className = 'input-slot-preview preview-dup';
    preview.textContent = '重複的編號';
    return;
  }

  field.className = 'input-slot-field is-valid';
  preview.className = 'input-slot-preview preview-name';
  preview.textContent = occ.name;

  // Re-validate other slots that might now be un-duplicated
  revalidateAllSlots();
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
  const ids    = [];
  const errors = [];

  for (let i = 0; i < INPUT_SLOTS; i++) {
    const field = document.getElementById(`input-slot-${i}`);
    if (!field || field.value.trim() === '') continue;

    const num = parseInt(field.value.trim(), 10);
    if (isNaN(num) || num < 1) { errors.push(`第 ${i + 1} 格`); continue; }

    const occ = OCCUPATIONS.find(o => o.id === num);
    if (!occ) { errors.push(`第 ${i + 1} 格（編號 ${num} 不存在）`); continue; }
    if (ids.includes(num)) { errors.push(`第 ${i + 1} 格（編號 ${num} 重複）`); continue; }
    ids.push(num);
  }

  const summaryEl = document.getElementById('input-error-summary');

  if (errors.length > 0) {
    summaryEl.textContent = `⚠️ 有錯誤：${errors.join('、')}，請修正後再試`;
    return;
  }

  if (ids.length === 0) {
    summaryEl.textContent = '⚠️ 請至少輸入一個職業編號';
    return;
  }

  summaryEl.textContent = '';

  const params = new URLSearchParams();
  params.set('like', ids.join(','));
  // Build URL pointing to this page
  const url = `${location.origin}${location.pathname}?${params.toString()}`;

  const resultBox   = document.getElementById('input-result-box');
  const urlEl       = document.getElementById('input-result-url');
  const namesEl     = document.getElementById('input-result-names');

  if (urlEl)  urlEl.textContent = url;
  if (namesEl) {
    const matched = ids.map(id => OCCUPATIONS.find(o => o.id === id)).filter(Boolean);
    namesEl.innerHTML = matched.map(occ =>
      `<span class="occ-tag occ-tag-skill">${occ.id} ${occ.name}</span>`
    ).join('');
  }
  if (resultBox) resultBox.classList.add('visible');

  // Store URL for copy
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
  renderInputSlots();
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
