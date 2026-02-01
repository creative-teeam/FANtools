/* 坂道ツール (GitHub Pages / static)
   - no external libs
   - no network calls
   - stores only in localStorage
*/

"use strict";

/* =========================
   Storage Keys
========================= */
const STORE = {
  theme: "sakamichi_theme_v1",
  notes: "sakamichi_notes_v1",
  checklist: "sakamichi_checklist_v1",
};

/* =========================
   Utilities
========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const nowDateISO = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
};

const safeJSONParse = (str, fallback) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

const saveLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const loadLS = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  return safeJSONParse(raw, fallback);
};

const normalizeJP = (s) => (s || "")
  .toString()
  .trim()
  .toLowerCase()
  // 全角英数→半角っぽく（簡易）
  .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));

/* かな/カナ揺れ軽減（最低限） */
const kataToHira = (s) => (s || "").replace(/[\u30a1-\u30f6]/g, (ch) =>
  String.fromCharCode(ch.charCodeAt(0) - 0x60)
);

const groupLabel = (g) => ({
  nogi: "乃木坂46",
  sakura: "櫻坂46",
  hinata: "日向坂46",
  common: "共通",
}[g] || g);

const typeLabel = (t) => ({
  live: "ライブ",
  event: "イベント",
  meet: "ミーグリ/握手",
  stream: "配信",
  other: "その他",
}[t] || t);

/* =========================
   Color Map (name -> hex)
   ※見やすさ目的の近似色。公式の色味は会場/ペンライトに準拠。
========================= */
const COLOR_HEX = {
  "ホワイト": "#ffffff",
  "白": "#ffffff",

  "ブルー": "#2563eb",
  "青": "#2563eb",

  "水色": "#38bdf8",
  "パステルブルー": "#7dd3fc",

  "エメラルドグリーン": "#10b981",
  "グリーン": "#22c55e",
  "緑": "#22c55e",
  "ライトグリーン": "#84cc16",
  "黄緑": "#84cc16",

  "パールグリーン": "#34d399",

  "イエロー": "#fbbf24",
  "黄色": "#fbbf24",

  "オレンジ": "#fb923c",
  "ピンク": "#f472b6",
  "サクラピンク": "#fb7185",
  "パッションピンク": "#ec4899",

  "レッド": "#ef4444",
  "赤": "#ef4444",

  "パープル": "#a855f7",
  "紫": "#a855f7",
  "バイオレット": "#7c3aed",
  "ターコイズ": "#14b8a6",

  // 一部サイト表記
  "黒": "#111827",
  "消灯": "#111827",
  "クラップ": "#111827",
  "※虹色": "#111827",
  "虹色": "#111827",
};

const colorToHex = (name) => COLOR_HEX[name] || "#94a3b8";

/* =========================
   Member Color Data
   参照元（更新日含む）：
   - 乃木坂46: NogiSnap（2026/1時点 在籍メンバー）等
   - 櫻坂46: 櫻坂46⊿応援ブログ / 公式NEWS（三期・四期）
   - 日向坂46: 日向坂46まとめ（2026.01.17）
========================= */

/* 乃木坂46（現役として記載されているメンバー） */
const NOGI = [
  // 3期
  { group:"nogi", gen:"3期", name:"伊藤理々杏", aka:"りりあ", kana:"いとうりりあ", c1:"紫", c2:"赤" },
  { group:"nogi", gen:"3期", name:"岩本蓮加", aka:"れんたん", kana:"いわもとれんか", c1:"赤", c2:"ピンク" },
  { group:"nogi", gen:"3期", name:"梅澤美波", aka:"みなみん", kana:"うめざわみなみ", c1:"青", c2:"水色" },
  { group:"nogi", gen:"3期", name:"吉田綾乃クリスティー", aka:"あやてぃー", kana:"よしだあやのくりすてぃー", c1:"ピンク", c2:"紫" },

  // 4期
  { group:"nogi", gen:"4期", name:"遠藤さくら", aka:"さくちゃん", kana:"えんどうさくら", c1:"ピンク", c2:"白" },
  { group:"nogi", gen:"4期", name:"賀喜遥香", aka:"かっきー", kana:"かきはるか", c1:"オレンジ", c2:"緑" },
  { group:"nogi", gen:"4期", name:"金川紗耶", aka:"やんちゃん", kana:"かながわさや", c1:"水色", c2:"赤" },
  { group:"nogi", gen:"4期", name:"黒見明香", aka:"くろみん", kana:"くろみはるか", c1:"紫", c2:"緑" },
  { group:"nogi", gen:"4期", name:"佐藤璃果", aka:"りかちゃん", kana:"さとうりか", c1:"ピンク", c2:"ターコイズ" },
  { group:"nogi", gen:"4期", name:"柴田柚菜", aka:"ゆんちゃん", kana:"しばたゆな", c1:"青", c2:"黄緑" },
  { group:"nogi", gen:"4期", name:"田村真佑", aka:"まゆたん", kana:"たむらまゆ", c1:"紫", c2:"水色" },
  { group:"nogi", gen:"4期", name:"筒井あやめ", aka:"あやめん", kana:"つついあやめ", c1:"紫", c2:"紫" },
  { group:"nogi", gen:"4期", name:"林瑠奈", aka:"はやし", kana:"はやしるな", c1:"ピンク", c2:"ピンク" },
  { group:"nogi", gen:"4期", name:"弓木奈於", aka:"ゆみっきー", kana:"ゆみきなお", c1:"赤", c2:"黄緑" },

  // 5期
  { group:"nogi", gen:"5期", name:"五百城茉央", aka:"まおちゃん", kana:"いおきまお", c1:"ターコイズ", c2:"青" },
  { group:"nogi", gen:"5期", name:"池田瑛紗", aka:"てれぱん", kana:"いけだてれさ", c1:"緑", c2:"白" },
  { group:"nogi", gen:"5期", name:"一ノ瀬美空", aka:"みーきゅん", kana:"いちのせみく", c1:"水色", c2:"水色" },
  { group:"nogi", gen:"5期", name:"井上和", aka:"なぎちゃん", kana:"いのうえなぎ", c1:"赤", c2:"白" },
  { group:"nogi", gen:"5期", name:"岡本姫奈", aka:"ひなちゃん", kana:"おかもとひな", c1:"紫", c2:"青" },
  { group:"nogi", gen:"5期", name:"小川彩", aka:"あーや", kana:"おがわあや", c1:"白", c2:"白" },
  { group:"nogi", gen:"5期", name:"奥田いろは", aka:"いろは", kana:"おくだいろは", c1:"黄緑", c2:"ピンク" },
  { group:"nogi", gen:"5期", name:"川﨑桜", aka:"さくたん", kana:"かわさきさくら", c1:"ピンク", c2:"緑" },
  { group:"nogi", gen:"5期", name:"菅原咲月", aka:"さつき", kana:"すがわらさつき", c1:"ピンク", c2:"水色" },
  { group:"nogi", gen:"5期", name:"冨里奈央", aka:"なおちゃん", kana:"とみさとなお", c1:"ターコイズ", c2:"ターコイズ" },
  { group:"nogi", gen:"5期", name:"中西アルノ", aka:"あるの", kana:"なかにしあるの", c1:"水色", c2:"ターコイズ" },

  // 6期
  { group:"nogi", gen:"6期", name:"愛宕心響", aka:"ここねん", kana:"あたごここね", c1:"ピンク", c2:"青" },
  { group:"nogi", gen:"6期", name:"大越ひなの", aka:"ひなの", kana:"おおこしひなの", c1:"白", c2:"黄色" },
  { group:"nogi", gen:"6期", name:"小津玲奈", aka:"おづちゃん", kana:"おづれいな", c1:"紫", c2:"ターコイズ" },
  { group:"nogi", gen:"6期", name:"海邉朱莉", aka:"あかり", kana:"かいべあかり", c1:"青", c2:"赤" },
  { group:"nogi", gen:"6期", name:"川端晃菜", aka:"ひーつん", kana:"かわばたひな", c1:"水色", c2:"緑" },
  { group:"nogi", gen:"6期", name:"鈴木佑捺", aka:"ゆうな", kana:"すずきゆうな", c1:"水色", c2:"白" },
  { group:"nogi", gen:"6期", name:"瀬戸口心月", aka:"みつき", kana:"せとぐちみつき", c1:"青", c2:"黄色" },
  { group:"nogi", gen:"6期", name:"長嶋凛桜", aka:"りおたん", kana:"ながしまりお", c1:"ピンク", c2:"オレンジ" },
  { group:"nogi", gen:"6期", name:"増田三莉音", aka:"みりね", kana:"ますだみりね", c1:"青", c2:"青" },
  { group:"nogi", gen:"6期", name:"森平麗心", aka:"うるみん", kana:"もりひらうるみ", c1:"黄色", c2:"黄色" },
  { group:"nogi", gen:"6期", name:"矢田萌華", aka:"やだちゃん", kana:"やだもえか", c1:"白", c2:"紫" },
];

/* 櫻坂46 */
const SAKURA = [
  // 二期（色番号表記→色名はそのまま扱う）
  { group:"sakura", gen:"2期", name:"井上梨名", aka:"", kana:"いのうえりな", c1:"ブルー", c2:"ブルー" },
  { group:"sakura", gen:"2期", name:"遠藤光莉", aka:"", kana:"えんどうひかり", c1:"パープル", c2:"パープル" },
  { group:"sakura", gen:"2期", name:"大園玲", aka:"", kana:"おおぞのれい", c1:"バイオレット", c2:"バイオレット" },
  { group:"sakura", gen:"2期", name:"大沼晶保", aka:"", kana:"おおぬまあきほ", c1:"パステルブルー", c2:"イエロー" },
  { group:"sakura", gen:"2期", name:"幸阪茉里乃", aka:"", kana:"こうさかまりの", c1:"パールグリーン", c2:"サクラピンク" },
  { group:"sakura", gen:"2期", name:"武元唯衣", aka:"", kana:"たけもとゆい", c1:"パッションピンク", c2:"ブルー" },
  { group:"sakura", gen:"2期", name:"田村保乃", aka:"", kana:"たむらほの", c1:"パステルブルー", c2:"パステルブルー" },
  { group:"sakura", gen:"2期", name:"藤吉夏鈴", aka:"", kana:"ふじよしかりん", c1:"ホワイト", c2:"バイオレット" },
  { group:"sakura", gen:"2期", name:"増本綺良", aka:"", kana:"ますもときら", c1:"オレンジ", c2:"オレンジ" },
  { group:"sakura", gen:"2期", name:"松田里奈", aka:"", kana:"まつだりな", c1:"グリーン", c2:"イエロー" },
  { group:"sakura", gen:"2期", name:"森田ひかる", aka:"", kana:"もりたひかる", c1:"レッド", c2:"ブルー" },
  { group:"sakura", gen:"2期", name:"守屋麗奈", aka:"", kana:"もりやれな", c1:"イエロー", c2:"ピンク" },
  { group:"sakura", gen:"2期", name:"山﨑天", aka:"てん", kana:"やまさきてん", c1:"ホワイト", c2:"グリーン" },

  // 三期
  { group:"sakura", gen:"3期", name:"石森璃花", aka:"", kana:"いしもりりか", c1:"グリーン", c2:"ピンク" },
  { group:"sakura", gen:"3期", name:"遠藤理子", aka:"", kana:"えんどうりこ", c1:"サクラピンク", c2:"バイオレット" },
  { group:"sakura", gen:"3期", name:"小田倉麗奈", aka:"", kana:"おだくられいな", c1:"ホワイト", c2:"パッションピンク" },
  { group:"sakura", gen:"3期", name:"小島凪紗", aka:"", kana:"こじまなぎさ", c1:"パステルブルー", c2:"オレンジ" },
  { group:"sakura", gen:"3期", name:"谷口愛季", aka:"", kana:"たにぐちあいり", c1:"レッド", c2:"パープル" },
  { group:"sakura", gen:"3期", name:"中嶋優月", aka:"", kana:"なかしまゆづき", c1:"ピンク", c2:"ピンク" },
  { group:"sakura", gen:"3期", name:"的野美青", aka:"", kana:"まとのみお", c1:"パステルブルー", c2:"ブルー" },
  { group:"sakura", gen:"3期", name:"向井純葉", aka:"", kana:"むかいとは", c1:"パステルブルー", c2:"エメラルドグリーン" },
  { group:"sakura", gen:"3期", name:"村井優", aka:"", kana:"むらいゆう", c1:"パープル", c2:"ブルー" },
  { group:"sakura", gen:"3期", name:"村山美羽", aka:"", kana:"むらやまみう", c1:"パープル", c2:"バイオレット" },
  { group:"sakura", gen:"3期", name:"山下瞳月", aka:"", kana:"やましたしづき", c1:"レッド", c2:"パステルブルー" },

  // 四期
  { group:"sakura", gen:"4期", name:"浅井恋乃未", aka:"", kana:"あさいこのみ", c1:"レッド", c2:"エメラルドグリーン" },
  { group:"sakura", gen:"4期", name:"稲熊ひな", aka:"", kana:"いなぐまひな", c1:"エメラルドグリーン", c2:"オレンジ" },
  { group:"sakura", gen:"4期", name:"勝又春", aka:"", kana:"かつまたはる", c1:"サクラピンク", c2:"レッド" },
  { group:"sakura", gen:"4期", name:"佐藤愛桜", aka:"", kana:"さとうあい", c1:"サクラピンク", c2:"パステルブルー" },
  { group:"sakura", gen:"4期", name:"中川智尋", aka:"", kana:"なかがわちひろ", c1:"イエロー", c2:"バイオレット" },
  { group:"sakura", gen:"4期", name:"松本和子", aka:"", kana:"まつもとかずこ", c1:"ホワイト", c2:"エメラルドグリーン" },
  { group:"sakura", gen:"4期", name:"目黒陽色", aka:"", kana:"めぐろひいろ", c1:"サクラピンク", c2:"パッションピンク" },
  { group:"sakura", gen:"4期", name:"山川宇衣", aka:"", kana:"やまかわうい", c1:"ホワイト", c2:"パステルブルー" },
  { group:"sakura", gen:"4期", name:"山田桃実", aka:"", kana:"やまだももみ", c1:"パステルブルー", c2:"バイオレット" },
];

/* 日向坂46 */
const HINATA = [
  // 二期
  { group:"hinata", gen:"2期", name:"金村美玖", aka:"", kana:"かねむらみく", c1:"パステルブルー", c2:"イエロー" },
  { group:"hinata", gen:"2期", name:"河田陽菜", aka:"", kana:"かわたひな", c1:"イエロー", c2:"サクラピンク" },
  { group:"hinata", gen:"2期", name:"小坂菜緒", aka:"こさかな", kana:"こさかなお", c1:"ホワイト", c2:"バイオレット" },
  { group:"hinata", gen:"2期", name:"松田好花", aka:"このか", kana:"まつだこのか", c1:"パールグリーン", c2:"サクラピンク" },

  // 三期
  { group:"hinata", gen:"3期", name:"上村ひなの", aka:"", kana:"かみむらひなの", c1:"エメラルドグリーン", c2:"レッド" },
  { group:"hinata", gen:"3期", name:"髙橋未来虹", aka:"", kana:"たかはしみくに", c1:"グリーン", c2:"パープル" },
  { group:"hinata", gen:"3期", name:"森本茉莉", aka:"", kana:"もりもとまり", c1:"オレンジ", c2:"ブルー" },
  { group:"hinata", gen:"3期", name:"山口陽世", aka:"", kana:"やまぐちはるよ", c1:"パールグリーン", c2:"イエロー" },

  // 四期
  { group:"hinata", gen:"4期", name:"石塚瑶季", aka:"", kana:"いしづかたまき", c1:"サクラピンク", c2:"オレンジ" },
  { group:"hinata", gen:"4期", name:"小西夏菜実", aka:"", kana:"こにしななみ", c1:"パープル", c2:"ブルー" },
  { group:"hinata", gen:"4期", name:"清水理央", aka:"", kana:"しみずりお", c1:"パステルブルー", c2:"ピンク" },
  { group:"hinata", gen:"4期", name:"正源司陽子", aka:"", kana:"しょうげんじようこ", c1:"オレンジ", c2:"レッド" },
  { group:"hinata", gen:"4期", name:"竹内希来里", aka:"", kana:"たけうちきらり", c1:"イエロー", c2:"レッド" },
  { group:"hinata", gen:"4期", name:"平尾帆夏", aka:"", kana:"ひらおほのか", c1:"パステルブルー", c2:"オレンジ" },
  { group:"hinata", gen:"4期", name:"平岡海月", aka:"", kana:"ひらおかみつき", c1:"ブルー", c2:"イエロー" },
  { group:"hinata", gen:"4期", name:"藤嶌果歩", aka:"", kana:"ふじしまかほ", c1:"サクラピンク", c2:"ブルー" },
  { group:"hinata", gen:"4期", name:"宮地すみれ", aka:"", kana:"みやちすみれ", c1:"バイオレット", c2:"レッド" },
  { group:"hinata", gen:"4期", name:"山下葉留花", aka:"", kana:"やましたはるか", c1:"ホワイト", c2:"エメラルドグリーン" },
  { group:"hinata", gen:"4期", name:"渡辺莉奈", aka:"", kana:"わたなべりな", c1:"ブルー", c2:"ホワイト" },

  // 五期
  { group:"hinata", gen:"5期", name:"大田美月", aka:"", kana:"おおたみづき", c1:"サクラピンク", c2:"ピンク" },
  { group:"hinata", gen:"5期", name:"大野愛実", aka:"", kana:"おおのまなみ", c1:"レッド", c2:"レッド" },
  { group:"hinata", gen:"5期", name:"片山紗希", aka:"", kana:"かたやまさき", c1:"パステルブルー", c2:"パステルブルー" },
  { group:"hinata", gen:"5期", name:"蔵盛妃那乃", aka:"", kana:"くらもりひなの", c1:"サクラピンク", c2:"レッド" },
  { group:"hinata", gen:"5期", name:"坂井新奈", aka:"", kana:"さかいにいな", c1:"ホワイト", c2:"ホワイト" },
  { group:"hinata", gen:"5期", name:"佐藤優羽", aka:"", kana:"さとうゆう", c1:"エメラルドグリーン", c2:"エメラルドグリーン" },
  { group:"hinata", gen:"5期", name:"下田衣珠季", aka:"", kana:"しもだいずき", c1:"パステルブルー", c2:"エメラルドグリーン" },
  { group:"hinata", gen:"5期", name:"高井俐香", aka:"", kana:"たかいりか", c1:"パープル", c2:"イエロー" },
  { group:"hinata", gen:"5期", name:"鶴崎仁香", aka:"", kana:"つるさきにこ", c1:"イエロー", c2:"オレンジ" },
  { group:"hinata", gen:"5期", name:"松尾桜", aka:"", kana:"まつおさくら", c1:"サクラピンク", c2:"ホワイト" },
];

const ALL_MEMBERS = [...NOGI, ...SAKURA, ...HINATA];

/* =========================
   Tabs
========================= */
const tabs = $$(".tab");
const panels = {
  colors: $("#tab-colors"),
  notes: $("#tab-notes"),
  checklist: $("#tab-checklist"),
  links: $("#tab-links"),
};

function setTab(name){
  tabs.forEach(t => t.classList.toggle("is-active", t.dataset.tab === name));
  Object.entries(panels).forEach(([k, el]) => el.classList.toggle("is-active", k === name));
  history.replaceState(null, "", setHashFromState(name));
}

function setHashFromState(activeTab){
  const url = new URL(location.href);
  url.hash = "";
  url.searchParams.set("tab", activeTab);

  // keep current filters (colors tab)
  if (activeTab === "colors"){
    url.searchParams.set("g", $("#groupSelect").value);
    url.searchParams.set("gen", $("#genSelect").value);
    const q = $("#colorSearch").value.trim();
    if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
  }
  return url.toString();
}

tabs.forEach(btn => {
  btn.addEventListener("click", () => setTab(btn.dataset.tab));
});

/* =========================
   Theme
========================= */
function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  saveLS(STORE.theme, theme);
  $("#themeBtn .btn__icon").textContent = theme === "light" ? "☀" : "☾";
}
$("#themeBtn").addEventListener("click", () => {
  const cur = loadLS(STORE.theme, "dark");
  applyTheme(cur === "dark" ? "light" : "dark");
});

/* =========================
   Colors UI
========================= */
const groupSelect = $("#groupSelect");
const genSelect = $("#genSelect");
const colorSearch = $("#colorSearch");
const tbody = $("#colorsTbody");
const countPill = $("#countPill");

function buildGenOptions(group){
  const items = (group === "all") ? ALL_MEMBERS : ALL_MEMBERS.filter(m => m.group === group);
  const gens = Array.from(new Set(items.map(m => m.gen))).sort((a,b)=> a.localeCompare(b, "ja"));
  genSelect.innerHTML = `<option value="all">すべて</option>` + gens.map(g => `<option value="${g}">${g}</option>`).join("");
}

function memberMatches(m, q){
  if (!q) return true;
  const nq = normalizeJP(kataToHira(q));
  const hay = normalizeJP(kataToHira([m.name, m.kana, m.aka, groupLabel(m.group), m.gen].join(" ")));
  return hay.includes(nq);
}

function renderColors(){
  const g = groupSelect.value;
  const gen = genSelect.value;
  const q = colorSearch.value.trim();

  let rows = (g === "all") ? ALL_MEMBERS : ALL_MEMBERS.filter(m => m.group === g);
  if (gen !== "all") rows = rows.filter(m => m.gen === gen);
  if (q) rows = rows.filter(m => memberMatches(m, q));

  // sort: group -> gen -> name
  rows.sort((a,b) => {
    const ga = a.group.localeCompare(b.group);
    if (ga) return ga;
    const ge = a.gen.localeCompare(b.gen, "ja");
    if (ge) return ge;
    return a.name.localeCompare(b.name, "ja");
  });

  countPill.textContent = `${rows.length}件`;

  tbody.innerHTML = rows.map(m => {
    const c1hex = colorToHex(m.c1);
    const c2hex = colorToHex(m.c2);

    const chips = `
      <div class="colorChips">
        <span class="chip"><span class="dot" style="background:${c1hex}"></span>${m.c1}</span>
        <span class="chip"><span class="dot" style="background:${c2hex}"></span>${m.c2}</span>
      </div>
    `;

    return `
      <tr>
        <td>${groupLabel(m.group)}</td>
        <td>${m.gen}</td>
        <td>
          <div style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-weight:700;">${m.name}</span>
            <span class="small muted">${m.aka ? `愛称：${m.aka}` : ""}</span>
          </div>
        </td>
        <td>${chips}</td>
      </tr>
    `;
  }).join("");
}

groupSelect.addEventListener("change", () => {
  buildGenOptions(groupSelect.value);
  genSelect.value = "all";
  renderColors();
  history.replaceState(null, "", setHashFromState("colors"));
});

genSelect.addEventListener("change", () => {
  renderColors();
  history.replaceState(null, "", setHashFromState("colors"));
});

colorSearch.addEventListener("input", () => {
  renderColors();
  history.replaceState(null, "", setHashFromState("colors"));
});

$("#resetFilterBtn").addEventListener("click", () => {
  groupSelect.value = "nogi";
  buildGenOptions("nogi");
  genSelect.value = "all";
  colorSearch.value = "";
  renderColors();
  history.replaceState(null, "", setHashFromState("colors"));
});

$("#copyShareBtn").addEventListener("click", async () => {
  const url = setHashFromState("colors");
  try{
    await navigator.clipboard.writeText(url);
    alert("URLをコピーしました！");
  }catch{
    prompt("コピーできない場合はこのURLを手動でコピーしてください:", url);
  }
});

/* =========================
   Notes
========================= */
const noteGroup = $("#noteGroup");
const noteDate = $("#noteDate");
const noteVenue = $("#noteVenue");
const noteType = $("#noteType");
const noteText = $("#noteText");
const noteTags = $("#noteTags");
const notesList = $("#notesList");
const notesCount = $("#notesCount");
const notesSearch = $("#notesSearch");
const notesFilterGroup = $("#notesFilterGroup");

function loadNotes(){
  return loadLS(STORE.notes, []);
}
function saveNotes(notes){
  saveLS(STORE.notes, notes);
}
function newId(){
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function parseTags(str){
  const raw = (str || "").trim();
  if (!raw) return [];
  // space separated, allow "#"
  return raw.split(/\s+/).map(t => t.trim()).filter(Boolean);
}

function renderNotes(){
  const notes = loadNotes();
  const q = normalizeJP(kataToHira(notesSearch.value.trim()));
  const g = notesFilterGroup.value;

  let rows = [...notes];
  if (g !== "all") rows = rows.filter(n => n.group === g);

  if (q){
    rows = rows.filter(n => {
      const hay = normalizeJP(kataToHira([n.venue, n.text, ...(n.tags||[])].join(" ")));
      return hay.includes(q);
    });
  }

  // newest first
  rows.sort((a,b) => (b.date || "").localeCompare(a.date || "") || (b.createdAt||0)-(a.createdAt||0));

  notesCount.textContent = `${notes.length}件`;

  if (rows.length === 0){
    notesList.innerHTML = `<div class="small muted">メモがありません。</div>`;
    return;
  }

  notesList.innerHTML = rows.map(n => {
    const tags = (n.tags||[]).map(t => `<span class="badge">${t}</span>`).join(" ");
    const meta = `
      <div class="noteMeta">
        <span class="badge">${groupLabel(n.group)}</span>
        <span class="badge">${typeLabel(n.type)}</span>
        ${n.date ? `<span class="badge">${n.date}</span>` : ""}
        ${n.venue ? `<span class="badge">${escapeHTML(n.venue)}</span>` : ""}
      </div>
    `;
    return `
      <div class="noteItem" data-id="${n.id}">
        <div class="noteTop">
          ${meta}
        </div>
        <p class="noteText">${escapeHTML(n.text || "")}</p>
        <div class="noteActions">
          ${tags ? `<div style="display:flex; gap:6px; flex-wrap:wrap;">${tags}</div>` : ""}
          <div style="flex:1"></div>
          <button class="iconBtn" data-action="copy">コピー</button>
          <button class="iconBtn iconBtn--danger" data-action="delete">削除</button>
        </div>
      </div>
    `;
  }).join("");
}

function escapeHTML(s){
  return (s || "").replace(/[&<>"']/g, (ch) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
  }[ch]));
}

$("#saveNoteBtn").addEventListener("click", () => {
  const text = (noteText.value || "").trim();
  if (!text){
    alert("メモ本文が空です。");
    return;
  }
  // simple safety reminder
  if (/(住所|電話|tel|メール|mail|@|instagram|twitter|x\.com|line|学校|本名)/i.test(text)){
    const ok = confirm("個人情報が含まれていそうです。保存しますか？（推奨：保存しない）");
    if (!ok) return;
  }

  const notes = loadNotes();
  notes.push({
    id: newId(),
    group: noteGroup.value,
    date: noteDate.value || "",
    venue: (noteVenue.value || "").trim(),
    type: noteType.value,
    text,
    tags: parseTags(noteTags.value),
    createdAt: Date.now(),
  });
  saveNotes(notes);
  noteText.value = "";
  noteTags.value = "";
  noteVenue.value = "";
  renderNotes();
  alert("保存しました（端末内）。");
});

$("#clearNoteBtn").addEventListener("click", () => {
  noteText.value = "";
  noteTags.value = "";
  noteVenue.value = "";
});

notesSearch.addEventListener("input", renderNotes);
notesFilterGroup.addEventListener("change", renderNotes);

notesList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const item = e.target.closest(".noteItem");
  if (!item) return;
  const id = item.dataset.id;
  const action = btn.dataset.action;

  const notes = loadNotes();
  const idx = notes.findIndex(n => n.id === id);
  if (idx < 0) return;

  if (action === "delete"){
    const ok = confirm("このメモを削除しますか？（元に戻せません）");
    if (!ok) return;
    notes.splice(idx, 1);
    saveNotes(notes);
    renderNotes();
  }

  if (action === "copy"){
    const n = notes[idx];
    const lines = [
      `【${groupLabel(n.group)} / ${typeLabel(n.type)}】`,
      n.date ? `日付：${n.date}` : "",
      n.venue ? `会場：${n.venue}` : "",
      n.tags?.length ? `タグ：${n.tags.join(" ")}` : "",
      "",
      n.text || ""
    ].filter(Boolean).join("\n");

    try{
      await navigator.clipboard.writeText(lines);
      alert("コピーしました！");
    }catch{
      prompt("コピーできない場合はここから手動コピーしてください:", lines);
    }
  }
});

$("#clearAllNotesBtn").addEventListener("click", () => {
  const ok = confirm("全メモを削除しますか？（元に戻せません）");
  if (!ok) return;
  saveNotes([]);
  renderNotes();
});

/* Export / Import */
$("#exportNotesBtn").addEventListener("click", () => {
  const data = loadNotes();
  const blob = new Blob([JSON.stringify({version:1, exportedAt: new Date().toISOString(), notes:data}, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sakamichi_notes_export.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

$("#importNotesInput").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try{
    const text = await file.text();
    const obj = JSON.parse(text);
    if (!obj || !Array.isArray(obj.notes)) throw new Error("Invalid JSON");
    const ok = confirm("このJSONをインポートしますか？（上書きではなく追加）\n※他人のJSONは読み込まないでください。");
    if (!ok) return;

    const cur = loadNotes();
    const merged = [...cur, ...obj.notes.map(n => ({
      id: n.id || newId(),
      group: n.group || "common",
      date: n.date || "",
      venue: (n.venue || "").toString().slice(0,80),
      type: n.type || "other",
      text: (n.text || "").toString(),
      tags: Array.isArray(n.tags) ? n.tags.map(String) : [],
      createdAt: n.createdAt || Date.now(),
    }))];

    saveNotes(merged);
    renderNotes();
    alert("インポートしました。");
  }catch(err){
    alert("読み込みに失敗しました。JSON形式を確認してください。");
  }finally{
    e.target.value = "";
  }
});

/* =========================
   Checklist
========================= */
const checkGroup = $("#checkGroup");
const checkList = $("#checkList");
const checkProgress = $("#checkProgress");

const TEMPLATE = [
  "チケット（電子/紙）",
  "身分証（必須）",
  "公式ペンライト",
  "予備電池/モバイルバッテリー",
  "財布/交通IC/現金少し",
  "飲み物",
  "タオル",
  "防寒/暑さ対策",
  "雨具",
  "双眼鏡（必要なら）",
  "グッズ用袋/ジップ袋",
  "待ち時間対策（軽食/充電）",
];

function loadChecklistAll(){
  return loadLS(STORE.checklist, {});
}
function saveChecklistAll(obj){
  saveLS(STORE.checklist, obj);
}

function getChecklist(group){
  const all = loadChecklistAll();
  if (!all[group]){
    all[group] = TEMPLATE.map(text => ({ id:newId(), text, done:false, builtIn:true }));
    saveChecklistAll(all);
  }
  return all[group];
}

function setChecklist(group, items){
  const all = loadChecklistAll();
  all[group] = items;
  saveChecklistAll(all);
}

function renderChecklist(){
  const g = checkGroup.value;
  const items = getChecklist(g);
  const done = items.filter(i => i.done).length;
  checkProgress.textContent = `${done}/${items.length}`;

  checkList.innerHTML = items.map(i => `
    <div class="checkItem" data-id="${i.id}">
      <div class="checkLeft">
        <input type="checkbox" ${i.done ? "checked" : ""} aria-label="チェック" />
        <div class="checkText">${escapeHTML(i.text)}</div>
      </div>
      <div class="checkRight">
        ${i.builtIn ? "" : `<button class="iconBtn iconBtn--danger" data-action="remove">削除</button>`}
      </div>
    </div>
  `).join("");
}

checkGroup.addEventListener("change", renderChecklist);

checkList.addEventListener("click", (e) => {
  const itemEl = e.target.closest(".checkItem");
  if (!itemEl) return;
  const id = itemEl.dataset.id;
  const g = checkGroup.value;

  const items = getChecklist(g);
  const idx = items.findIndex(i => i.id === id);
  if (idx < 0) return;

  const btn = e.target.closest("button");
  if (btn && btn.dataset.action === "remove"){
    const ok = confirm("この項目を削除しますか？");
    if (!ok) return;
    items.splice(idx, 1);
    setChecklist(g, items);
    renderChecklist();
    return;
  }

  const cb = e.target.closest("input[type='checkbox']");
  if (cb){
    items[idx].done = cb.checked;
    setChecklist(g, items);
    renderChecklist();
  }
});

$("#addItemBtn").addEventListener("click", () => {
  const text = ($("#newItemText").value || "").trim();
  if (!text) return;
  if (/(住所|電話|tel|メール|mail|@|line|学校|本名)/i.test(text)){
    alert("個人情報が含まれそうな項目は追加しないでください。");
    return;
  }
  const g = checkGroup.value;
  const items = getChecklist(g);
  items.unshift({ id:newId(), text, done:false, builtIn:false });
  setChecklist(g, items);
  $("#newItemText").value = "";
  renderChecklist();
});

$("#resetChecklistBtn").addEventListener("click", () => {
  const g = checkGroup.value;
  const ok = confirm("テンプレに戻しますか？（追加した項目は消えます）");
  if (!ok) return;
  setChecklist(g, TEMPLATE.map(text => ({ id:newId(), text, done:false, builtIn:true })));
  renderChecklist();
});

$("#clearChecklistBtn").addEventListener("click", () => {
  const g = checkGroup.value;
  const items = getChecklist(g).map(i => ({...i, done:false}));
  setChecklist(g, items);
  renderChecklist();
});

/* =========================
   Wipe All
========================= */
$("#wipeAllBtn").addEventListener("click", () => {
  const ok = confirm("全データ（メモ/チェック/テーマ）を初期化します。よろしいですか？");
  if (!ok) return;
  Object.values(STORE).forEach(k => localStorage.removeItem(k));
  location.reload();
});

/* =========================
   Init from URL
========================= */
function initFromURL(){
  const url = new URL(location.href);
  const tab = url.searchParams.get("tab") || "colors";
  const g = url.searchParams.get("g");
  const gen = url.searchParams.get("gen");
  const q = url.searchParams.get("q");

  // theme
  applyTheme(loadLS(STORE.theme, "dark"));

  // tabs
  const safeTab = ["colors","notes","checklist","links"].includes(tab) ? tab : "colors";

  // colors filters
  if (g && ["nogi","sakura","hinata","all"].includes(g)) groupSelect.value = g;
  buildGenOptions(groupSelect.value);

  if (gen){
    // if gen exists in options
    const opt = Array.from(genSelect.options).some(o => o.value === gen);
    if (opt) genSelect.value = gen;
  }
  if (q) colorSearch.value = q;

  renderColors();

  // notes defaults
  noteDate.value = nowDateISO();
  renderNotes();

  // checklist
  renderChecklist();

  // apply tab
  setTab(safeTab);
}

/* =========================
   Boot
========================= */
initFromURL();
