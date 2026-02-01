"use strict";

/* =========================
   Storage Keys
========================= */
const STORE = {
  theme: "sakamichi_theme_v3",
  notes: "sakamichi_notes_v3",
  checklist: "sakamichi_checklist_v3",
  favorites: "sakamichi_favorites_v3",
};

/* =========================
   Helpers
========================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const nowDateISO = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
};

const safeJSONParse = (str, fallback) => { try { return JSON.parse(str); } catch { return fallback; } };
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
  .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));

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

function escapeHTML(s){
  return (s || "").replace(/[&<>"']/g, (ch) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
  }[ch]));
}

function newId(){ return Math.random().toString(16).slice(2) + Date.now().toString(16); }

/* =========================
   Theme
========================= */
function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  saveLS(STORE.theme, theme);
  const icon = $("#themeBtn .btn__icon");
  if (icon) icon.textContent = theme === "light" ? "☀" : "☾";
}
$("#themeBtn").addEventListener("click", () => {
  const cur = loadLS(STORE.theme, "dark");
  applyTheme(cur === "dark" ? "light" : "dark");
});

/* =========================
   Color Map (name -> hex) 近似
========================= */
const COLOR_HEX = {
  "ホワイト": "#ffffff", "白": "#ffffff",
  "ブルー": "#2563eb", "青": "#2563eb",
  "水色": "#38bdf8", "パステルブルー": "#7dd3fc",
  "エメラルドグリーン": "#10b981",
  "グリーン": "#22c55e", "緑": "#22c55e",
  "ライトグリーン": "#84cc16", "黄緑": "#84cc16",
  "パールグリーン": "#34d399",
  "イエロー": "#fbbf24", "黄色": "#fbbf24",
  "オレンジ": "#fb923c",
  "ピンク": "#f472b6", "サクラピンク": "#fb7185", "パッションピンク": "#ec4899",
  "レッド": "#ef4444", "赤": "#ef4444",
  "パープル": "#a855f7", "紫": "#a855f7",
  "バイオレット": "#7c3aed",
  "ターコイズ": "#14b8a6",
  "黒": "#111827", "消灯": "#111827", "虹色": "#111827",
};
const colorToHex = (name) => COLOR_HEX[name] || "#94a3b8";

/* =========================
   Member Data
   ※前に出していたものと同じ構造です（ここに追加していけます）
========================= */
/* --- 乃木坂46 --- */
const NOGI = [
  { group:"nogi", gen:"3期", name:"伊藤理々杏", aka:"りりあ", kana:"いとうりりあ", c1:"紫", c2:"赤" },
  { group:"nogi", gen:"3期", name:"岩本蓮加", aka:"れんたん", kana:"いわもとれんか", c1:"赤", c2:"ピンク" },
  { group:"nogi", gen:"3期", name:"梅澤美波", aka:"みなみん", kana:"うめざわみなみ", c1:"青", c2:"水色" },
  { group:"nogi", gen:"3期", name:"吉田綾乃クリスティー", aka:"あやてぃー", kana:"よしだあやのくりすてぃー", c1:"ピンク", c2:"紫" },

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
];

/* --- 櫻坂46 --- */
const SAKURA = [
  { group:"sakura", gen:"2期", name:"井上梨名", aka:"", kana:"いのうえりな", c1:"ブルー", c2:"ブルー" },
  { group:"sakura", gen:"2期", name:"遠藤光莉", aka:"", kana:"えんどうひかり", c1:"パープル", c2:"パープル" },
  { group:"sakura", gen:"2期", name:"田村保乃", aka:"", kana:"たむらほの", c1:"パステルブルー", c2:"パステルブルー" },
  { group:"sakura", gen:"2期", name:"森田ひかる", aka:"", kana:"もりたひかる", c1:"レッド", c2:"ブルー" },
  { group:"sakura", gen:"2期", name:"守屋麗奈", aka:"", kana:"もりやれな", c1:"イエロー", c2:"ピンク" },
  { group:"sakura", gen:"2期", name:"山﨑天", aka:"てん", kana:"やまさきてん", c1:"ホワイト", c2:"グリーン" },

  { group:"sakura", gen:"3期", name:"石森璃花", aka:"", kana:"いしもりりか", c1:"グリーン", c2:"ピンク" },
  { group:"sakura", gen:"3期", name:"谷口愛季", aka:"", kana:"たにぐちあいり", c1:"レッド", c2:"パープル" },
  { group:"sakura", gen:"3期", name:"中嶋優月", aka:"", kana:"なかしまゆづき", c1:"ピンク", c2:"ピンク" },
];

/* --- 日向坂46 --- */
const HINATA = [
  { group:"hinata", gen:"2期", name:"金村美玖", aka:"", kana:"かねむらみく", c1:"パステルブルー", c2:"イエロー" },
  { group:"hinata", gen:"2期", name:"河田陽菜", aka:"", kana:"かわたひな", c1:"イエロー", c2:"サクラピンク" },
  { group:"hinata", gen:"2期", name:"小坂菜緒", aka:"こさかな", kana:"こさかなお", c1:"ホワイト", c2:"バイオレット" },
  { group:"hinata", gen:"2期", name:"松田好花", aka:"このか", kana:"まつだこのか", c1:"パールグリーン", c2:"サクラピンク" },

  { group:"hinata", gen:"3期", name:"上村ひなの", aka:"", kana:"かみむらひなの", c1:"エメラルドグリーン", c2:"レッド" },
  { group:"hinata", gen:"4期", name:"正源司陽子", aka:"", kana:"しょうげんじようこ", c1:"オレンジ", c2:"レッド" },
];

const ALL_MEMBERS = [...NOGI, ...SAKURA, ...HINATA];

/* =========================
   Favorites
========================= */
function favKey(m){ return `${m.group}|${m.gen}|${m.name}`; }
function loadFavs(){ return loadLS(STORE.favorites, []); }
function saveFavs(arr){ saveLS(STORE.favorites, arr); }
function isFav(key){ return loadFavs().includes(key); }
function toggleFav(key){
  const favs = loadFavs();
  const idx = favs.indexOf(key);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.unshift(key);
  saveFavs(favs);
}
function clearFavs(){ saveFavs([]); }

/* =========================
   Colors UI
========================= */
const groupSelect = $("#groupSelect");
const genSelect = $("#genSelect");
const colorSearch = $("#colorSearch");
const tbody = $("#colorsTbody");
const countPill = $("#countPill");
const favList = $("#favList");
const favPill = $("#favPill");
const favGroup = $("#favGroup");

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

function renderFavs(){
  const favs = loadFavs();
  const g = favGroup.value;

  const map = new Map();
  ALL_MEMBERS.forEach(m => map.set(favKey(m), m));

  const items = favs
    .map(k => map.get(k))
    .filter(Boolean)
    .filter(m => (g === "all") ? true : m.group === g);

  favPill.textContent = `${items.length}人`;

  if (items.length === 0){
    favList.innerHTML = `<div class="small muted">★を押すとここに出ます。</div>`;
    return;
  }

  favList.innerHTML = items.map(m => {
    const c1hex = colorToHex(m.c1);
    const c2hex = colorToHex(m.c2);
    return `
      <div class="favItem">
        <div class="favTop">
          <div>
            <div class="favName">${escapeHTML(m.name)}</div>
            <div class="favMeta">${groupLabel(m.group)} / ${escapeHTML(m.gen)} ${m.aka ? ` / ${escapeHTML(m.aka)}` : ""}</div>
          </div>
          <button class="starBtn is-on" type="button" data-action="fav" data-key="${escapeHTML(favKey(m))}">★</button>
        </div>
        <div class="favChips">
          <div class="colorChips">
            <span class="chip"><span class="dot" style="background:${c1hex}"></span>${escapeHTML(m.c1)}</span>
            <span class="chip"><span class="dot" style="background:${c2hex}"></span>${escapeHTML(m.c2)}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderColors(){
  const g = groupSelect.value;
  const gen = genSelect.value;
  const q = colorSearch.value.trim();

  let rows = (g === "all") ? ALL_MEMBERS : ALL_MEMBERS.filter(m => m.group === g);
  if (gen !== "all") rows = rows.filter(m => m.gen === gen);
  if (q) rows = rows.filter(m => memberMatches(m, q));

  rows.sort((a,b) => {
    const ga = a.group.localeCompare(b.group);
    if (ga) return ga;
    const ge = a.gen.localeCompare(b.gen, "ja");
    if (ge) return ge;
    return a.name.localeCompare(b.name, "ja");
  });

  countPill.textContent = `${rows.length}件`;

  tbody.innerHTML = rows.map(m => {
    const key = favKey(m);
    const on = isFav(key);
    const c1hex = colorToHex(m.c1);
    const c2hex = colorToHex(m.c2);

    const akaLine = m.aka ? `愛称：${escapeHTML(m.aka)}` : "";

    return `
      <tr data-key="${escapeHTML(key)}">
        <td class="colFav">
          <button class="starBtn ${on ? "is-on" : ""}" type="button" data-action="fav">
            ${on ? "★" : "☆"}
          </button>
        </td>
        <td>${groupLabel(m.group)}</td>
        <td>${escapeHTML(m.gen)}</td>
        <td>
          <div style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-weight:800;">${escapeHTML(m.name)}</span>
            <span class="small muted">${akaLine}</span>
          </div>
        </td>
        <td>
          <div class="colorChips">
            <span class="chip"><span class="dot" style="background:${c1hex}"></span>${escapeHTML(m.c1)}</span>
            <span class="chip"><span class="dot" style="background:${c2hex}"></span>${escapeHTML(m.c2)}</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  renderFavs();
}

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.action !== "fav") return;
  const tr = e.target.closest("tr");
  const key = tr?.dataset.key;
  if (!key) return;
  toggleFav(key);
  renderColors();
});

favList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.action !== "fav") return;
  const key = btn.dataset.key;
  if (!key) return;
  toggleFav(key);
  renderColors();
});

favGroup.addEventListener("change", renderFavs);

$("#clearFavBtn").addEventListener("click", () => {
  const ok = confirm("お気に入りを全解除しますか？");
  if (!ok) return;
  clearFavs();
  renderColors();
});

groupSelect.addEventListener("change", () => {
  buildGenOptions(groupSelect.value);
  genSelect.value = "all";
  renderColors();
  history.replaceState(null, "", makeShareURL());
});
genSelect.addEventListener("change", () => {
  renderColors();
  history.replaceState(null, "", makeShareURL());
});
colorSearch.addEventListener("input", () => {
  renderColors();
  history.replaceState(null, "", makeShareURL());
});

$("#resetFilterBtn").addEventListener("click", () => {
  groupSelect.value = "nogi";
  buildGenOptions("nogi");
  genSelect.value = "all";
  colorSearch.value = "";
  renderColors();
  history.replaceState(null, "", makeShareURL());
});

function makeShareURL(){
  const url = new URL(location.href);
  url.searchParams.set("g", groupSelect.value);
  url.searchParams.set("gen", genSelect.value);
  const q = colorSearch.value.trim();
  if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
  return url.toString();
}

$("#copyShareBtn").addEventListener("click", async () => {
  const url = makeShareURL();
  try{
    await navigator.clipboard.writeText(url);
    alert("条件URLをコピーしました！");
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

function loadNotes(){ return loadLS(STORE.notes, []); }
function saveNotes(notes){ saveLS(STORE.notes, notes); }

function parseTags(str){
  const raw = (str || "").trim();
  if (!raw) return [];
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

  rows.sort((a,b) => (b.date || "").localeCompare(a.date || "") || (b.createdAt||0)-(a.createdAt||0));
  notesCount.textContent = `${notes.length}件`;

  if (rows.length === 0){
    notesList.innerHTML = `<div class="small muted">メモがありません。</div>`;
    return;
  }

  notesList.innerHTML = rows.map(n => {
    const tags = (n.tags||[]).map(t => `<span class="badge">${escapeHTML(t)}</span>`).join(" ");
    return `
      <div class="noteItem" data-id="${escapeHTML(n.id)}">
        <div class="noteMeta">
          <span class="badge">${groupLabel(n.group)}</span>
          <span class="badge">${typeLabel(n.type)}</span>
          ${n.date ? `<span class="badge">${escapeHTML(n.date)}</span>` : ""}
          ${n.venue ? `<span class="badge">${escapeHTML(n.venue)}</span>` : ""}
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

$("#saveNoteBtn").addEventListener("click", () => {
  const text = (noteText.value || "").trim();
  if (!text){ alert("メモ本文が空です。"); return; }

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
  }catch{
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

function loadChecklistAll(){ return loadLS(STORE.checklist, {}); }
function saveChecklistAll(obj){ saveLS(STORE.checklist, obj); }

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
    <div class="checkItem" data-id="${escapeHTML(i.id)}">
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
  const ok = confirm("全データ（メモ/チェック/テーマ/お気に入り）を初期化します。よろしいですか？");
  if (!ok) return;
  Object.values(STORE).forEach(k => localStorage.removeItem(k));
  location.reload();
});

/* =========================
   Init
========================= */
function initFromURL(){
  // theme
  applyTheme(loadLS(STORE.theme, "dark"));

  // notes date
  $("#noteDate").value = nowDateISO();

  // colors from URL
  const url = new URL(location.href);
  const g = url.searchParams.get("g");
  const gen = url.searchParams.get("gen");
  const q = url.searchParams.get("q");

  if (g && ["nogi","sakura","hinata","all"].includes(g)) groupSelect.value = g;
  buildGenOptions(groupSelect.value);

  if (gen){
    const opt = Array.from(genSelect.options).some(o => o.value === gen);
    if (opt) genSelect.value = gen;
  }
  if (q) colorSearch.value = q;

  renderNotes();
  renderChecklist();
  renderColors();
}

initFromURL();
