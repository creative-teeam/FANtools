// 保存用キー
const STORAGE_KEY = "kids_support_tool_state_v3";

// ===============================
// 0. 病名・障害・特性 一覧 管理（追加＋編集）
// ===============================
const diagnosisListEl = document.getElementById("diagnosisList");
const addDiagnosisBtn = document.getElementById("addDiagnosisBtn");
const diagNameInput = document.getElementById("diagName");
const diagNotesInput = document.getElementById("diagNotes");

const diagnosisDetail = document.getElementById("diagnosisDetail");
const diagnosisDetailNameInput = document.getElementById(
  "diagnosisDetailNameInput"
);
const diagnosisDetailNotesInput = document.getElementById(
  "diagnosisDetailNotesInput"
);
const updateDiagnosisBtn = document.getElementById("updateDiagnosisBtn");

let diagnoses = [
  {
    id: "d1",
    name: "自閉スペクトラム症（ASD）",
    notes:
      "距離感・予定変更・感覚過敏などに注意。女の子との距離を詰めやすい場合、パーソナルスペースのルールを全体で共有。"
  },
  {
    id: "d2",
    name: "ADHD（注意欠如・多動症）",
    notes:
      "走り出しやすい・じっとしていられない場合、動ける役割を用意する。危険な場面では大人が近くで見守る。"
  }
];

let currentDiagnosisId = null;

function renderDiagnosisList() {
  diagnosisListEl.innerHTML = "";
  diagnoses.forEach((d) => {
    const li = document.createElement("li");
    li.textContent = d.name;
    li.dataset.id = d.id;
    li.addEventListener("click", () => showDiagnosisDetail(d.id));
    diagnosisListEl.appendChild(li);
  });
}

function showDiagnosisDetail(id) {
  const d = diagnoses.find((x) => x.id === id);
  if (!d) return;
  currentDiagnosisId = id;
  diagnosisDetailNameInput.value = d.name;
  diagnosisDetailNotesInput.value = d.notes || "";
  diagnosisDetail.classList.remove("hidden");
}

addDiagnosisBtn.addEventListener("click", () => {
  const name = diagNameInput.value.trim();
  const notes = diagNotesInput.value.trim();
  if (!name) {
    alert("名前を入力してください。");
    return;
  }
  const id = "d_" + Date.now();
  diagnoses.push({ id, name, notes });
  renderDiagnosisList();
  diagNameInput.value = "";
  diagNotesInput.value = "";
});

updateDiagnosisBtn.addEventListener("click", () => {
  if (!currentDiagnosisId) return;
  const d = diagnoses.find((x) => x.id === currentDiagnosisId);
  if (!d) return;
  const name = diagnosisDetailNameInput.value.trim();
  const notes = diagnosisDetailNotesInput.value.trim();
  if (!name) {
    alert("名前は空にできません。");
    return;
  }
  d.name = name;
  d.notes = notes;
  renderDiagnosisList();
});

// ===============================
// 1. 対応表・チェックリスト 一覧 管理（追加＋編集）
// ===============================
const responseListEl = document.getElementById("responseList");
const addResponseBtn = document.getElementById("addResponseBtn");
const respTitleInput = document.getElementById("respTitle");
const respBodyInput = document.getElementById("respBody");
const respLevelSelect = document.getElementById("respLevel");

const responseDetail = document.getElementById("responseDetail");
const responseDetailTitleInput = document.getElementById(
  "responseDetailTitleInput"
);
const responseDetailBodyInput = document.getElementById(
  "responseDetailBodyInput"
);
const responseDetailLevelSelect = document.getElementById(
  "responseDetailLevelSelect"
);
const updateResponseBtn = document.getElementById("updateResponseBtn");

let responses = [
  {
    id: "r1",
    title: "大きな音が苦手な子への配慮",
    body:
      "音出しや大きな拍手の前には、必ず「今から音が出るよ」と予告する。\n必要であればイヤーマフや耳栓の使用を許可する。\n本番中にどうするかは事前に本人・保護者と相談する。",
    level: "support"
  },
  {
    id: "r2",
    title: "発作がある子の緊急時対応",
    body:
      "事前に保護者から発作の種類・頻度・対応方法を聞き、紙で共有する。\n発作が起きたときは、周囲の危険物をどかし、頭を守る。\n必要に応じて119番通報し、保護者に連絡する。",
    level: "medical"
  }
];

let currentResponseId = null;

function renderResponseList() {
  responseListEl.innerHTML = "";
  responses.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r.title;
    li.dataset.id = r.id;
    li.addEventListener("click", () => showResponseDetail(r.id));
    responseListEl.appendChild(li);
  });
}

function showResponseDetail(id) {
  const r = responses.find((x) => x.id === id);
  if (!r) return;
  currentResponseId = id;
  responseDetailTitleInput.value = r.title;
  responseDetailBodyInput.value = r.body || "";
  responseDetailLevelSelect.value = r.level || "";
  responseDetail.classList.remove("hidden");
}

addResponseBtn.addEventListener("click", () => {
  const title = respTitleInput.value.trim();
  const body = respBodyInput.value.trim();
  const level = respLevelSelect.value;
  if (!title || !body) {
    alert("項目名と内容を入力してください。");
    return;
  }
  const id = "r_" + Date.now();
  responses.push({ id, title, body, level });
  renderResponseList();
  respTitleInput.value = "";
  respBodyInput.value = "";
  respLevelSelect.value = "";
});

updateResponseBtn.addEventListener("click", () => {
  if (!currentResponseId) return;
  const r = responses.find((x) => x.id === currentResponseId);
  if (!r) return;
  const title = responseDetailTitleInput.value.trim();
  const body = responseDetailBodyInput.value.trim();
  const level = responseDetailLevelSelect.value;
  if (!title || !body) {
    alert("項目名と内容を入力してください。");
    return;
  }
  r.title = title;
  r.body = body;
  r.level = level;
  renderResponseList();
});

// ===============================
// 2. 親の付き添い必須ラインチェックリスト
// ===============================
const evaluateButton = document.getElementById("evaluateChecklist");
const checklistResult = document.getElementById("checklistResult");

const addDailyItemBtn = document.getElementById("addDailyItemBtn");
const addSchoolItemBtn = document.getElementById("addSchoolItemBtn");
const dailyChecklistForm = document.getElementById("dailyChecklist");
const schoolChecklistForm = document.getElementById("schoolChecklist");

function addChecklistItem(formElement, groupName) {
  const text = prompt(
    "追加したい項目の内容を入力してください（画面にそのまま表示されます）"
  );
  if (!text) return;
  const type = prompt(
    "この項目の種類を半角で入力してください：\n" +
      "danger（危険） / support（見守り） / medical（医療）のいずれか"
  );
  const allowed = ["danger", "support", "medical"];
  const value = allowed.includes(type) ? type : "support";

  const label = document.createElement("label");
  label.innerHTML = `
    <input type="checkbox" name="${groupName}" value="${value}" />
    ${text}
  `;
  label.classList.add("custom-check-item");
  formElement.appendChild(label);
}

addDailyItemBtn.addEventListener("click", () => {
  addChecklistItem(dailyChecklistForm, "daily");
});

addSchoolItemBtn.addEventListener("click", () => {
  addChecklistItem(schoolChecklistForm, "school");
});

// 判定テンプレ管理
const resultTemplateSelect = document.getElementById("resultTemplateSelect");
const resultTemplateBody = document.getElementById("resultTemplateBody");
const addTemplateBtn = document.getElementById("addTemplateBtn");
const applyTemplateBtn = document.getElementById("applyTemplateBtn");
const newTemplateNameInput = document.getElementById("newTemplateName");
const newTemplateBodyInput = document.getElementById("newTemplateBody");

let resultTemplates = [
  {
    name: "付き添い原則必須（危険・医療リスクあり）",
    body:
      "危険な行動や医療的なリスクが確認されています。\n原則として、保護者または支援者の付き添いを必須とし、団体として対応可能かどうかを慎重に検討してください。"
  },
  {
    name: "付き添い推奨（安全上の不安あり）",
    body:
      "いくつかの場面で、1対1のサポートや見守りがあった方が安全・安心と考えられます。\n初期の数回だけでも、保護者の付き添いをお願いし、様子を一緒に確認することを検討してください。"
  },
  {
    name: "付き添い必須ではない（現時点）",
    body:
      "現在の情報からは、常時の保護者付き添いがなくても対応できる可能性があります。\nただし、初めての場では予想外の反応が出ることもあるため、最初の数回は連絡がつきやすい状態にしてもらいましょう。"
  }
];

function renderTemplateSelect() {
  resultTemplateSelect.innerHTML = "";
  resultTemplates.forEach((tpl, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = tpl.name;
    resultTemplateSelect.appendChild(opt);
  });
  if (resultTemplates.length > 0) {
    resultTemplateSelect.value = 0;
    resultTemplateBody.value = resultTemplates[0].body;
  }
}

resultTemplateSelect.addEventListener("change", () => {
  const idx = parseInt(resultTemplateSelect.value, 10);
  const tpl = resultTemplates[idx];
  if (!tpl) return;
  resultTemplateBody.value = tpl.body;
});

addTemplateBtn.addEventListener("click", () => {
  const name = newTemplateNameInput.value.trim();
  const body = newTemplateBodyInput.value.trim();
  if (!name || !body) {
    alert("テンプレ名と内容を入力してください。");
    return;
  }
  resultTemplates.push({ name, body });
  renderTemplateSelect();
  newTemplateNameInput.value = "";
  newTemplateBodyInput.value = "";
});

applyTemplateBtn.addEventListener("click", () => {
  if (checklistResult.classList.contains("hidden")) {
    alert("先に『付き添いの必要度を判定』ボタンを押してください。");
    return;
  }
  const body = resultTemplateBody.value.trim();
  if (!body) return;

  checklistResult.innerHTML += `
    <div class="info-block" style="margin-top:0.6rem; background:#eef2ff;">
      <div class="info-section-title">テンプレートからのコメント</div>
      <p>${body.replace(/\n/g, "<br />")}</p>
    </div>
  `;
});

evaluateButton.addEventListener("click", () => {
  const dailyChecks = Array.from(
    document.querySelectorAll("#dailyChecklist input[type='checkbox']")
  );
  const schoolChecks = Array.from(
    document.querySelectorAll("#schoolChecklist input[type='checkbox']")
  );

  let dangerCount = 0;
  let supportCount = 0;
  let medicalCount = 0;

  const allChecks = dailyChecks.concat(schoolChecks);
  allChecks.forEach((chk) => {
    if (chk.checked) {
      if (chk.value === "danger") dangerCount++;
      if (chk.value === "support") supportCount++;
      if (chk.value === "medical") medicalCount++;
    }
  });

  let message = "";
  let levelTitle = "";

  if (medicalCount > 0 || dangerCount >= 2) {
    levelTitle = "付き添い「原則必須」レベルの可能性が高いです";
    message = `
      <p>
        ・危険な行動や医療的なリスクが確認されています。<br />
        ・原則として、保護者または支援者の付き添いを必須とし、団体として対応可能かどうかを慎重に検討してください。
      </p>
    `;
  } else if (dangerCount === 1 || supportCount >= 2) {
    levelTitle = "付き添い「推奨」レベルの可能性があります";
    message = `
      <p>
        ・いくつかの場面で、1対1のサポートや見守りがあった方が安全・安心と考えられます。<br />
        ・初期の数回だけでも、保護者の付き添いをお願いし、様子を一緒に確認することを検討してください。
      </p>
    `;
  } else if (dangerCount === 0 && supportCount <= 1 && medicalCount === 0) {
    levelTitle = "付き添い「必須ではない」可能性が高いです";
    message = `
      <p>
        ・現時点の情報からは、常時の保護者付き添いがなくても対応できる可能性があります。<br />
        ・ただし、初めての場では予想外の反応が出ることもあるため、最初の数回は連絡がつきやすい状態にしてもらいましょう。
      </p>
    `;
  }

  if (!levelTitle) {
    levelTitle = "チェック項目が選択されていません";
    message = `
      <p>
        ・日常生活や学校での様子を、保護者や学校の先生に確認したうえで、もう一度チェックしてみてください。
      </p>
    `;
  }

  checklistResult.classList.remove("hidden");
  checklistResult.innerHTML = `
    <div class="info-section-title">${levelTitle}</div>
    ${message}
  `;
});

renderTemplateSelect();

// ===============================
// 3. その場の対応フロー（既存＋カスタム）
// ===============================
const incidentTypeSelect = document.getElementById("incidentType");
const incidentFlowDiv = document.getElementById("incidentFlow");
const customFlowNameInput = document.getElementById("customFlowName");
const customFlowBodyInput = document.getElementById("customFlowBody");
const addCustomFlowBtn = document.getElementById("addCustomFlowBtn");

let customFlows = []; // {id, name, body}

function renderIncidentFlow() {
  const value = incidentTypeSelect.value;
  if (!value) {
    incidentFlowDiv.classList.add("hidden");
    incidentFlowDiv.innerHTML = "";
    return;
  }

  let html = "";

  if (value === "immediateDanger") {
    html = `
      <div class="info-section-title">【既存】身体の危険がある場合の対応フロー</div>
      <ol>
        <li><strong>すぐに安全を確保する</strong>：<br />
          ・走り出した子どもを安全な場所まで誘導し、危険物や段差から遠ざける<br />
          ・他の子が巻き込まれないよう、近くの子どもを少し離す
        </li>
        <li><strong>場を一時停止する</strong>：<br />
          ・可能であれば進行を一旦止め、大人2名以上で対応する（1人は全体、1人は当事者）
        </li>
        <li><strong>落ち着いた場所で状況を確認する</strong>：<br />
          ・大きな声で叱るより、短く具体的に「何が危険だったか」「どうすると安全か」を伝える
        </li>
        <li><strong>その日の中でのルール再確認</strong>：<br />
          ・「もう一度同じことが起きたら、その日は見学に切り替える」など、分かりやすいルールを提示
        </li>
        <li><strong>終了後に保護者へ共有</strong>：<br />
          ・具体的な行動・対応・子どもの反応を伝え、今後の付き添いや参加方法を一緒に検討する
        </li>
      </ol>
    `;
  } else if (value === "psychological") {
    html = `
      <div class="info-section-title">【既存】他の子が怖がっている・不安な場合の対応フロー</div>
      <ol>
        <li><strong>まず「怖がっている側」を安心させる</strong>：<br />
          ・安全な場所に移動し、「怖かったね」「びっくりしたね」と気持ちを受け止める
        </li>
        <li><strong>その場を分ける</strong>：<br />
          ・当事者同士をすぐに直接話し合わせるのではなく、まず物理的な距離を取る
        </li>
        <li><strong>行動と人を分けて考える</strong>：<br />
          ・「あの行動はよくなかった」と伝え、人そのものを否定しない
        </li>
        <li><strong>必要に応じて、場のルールを全体に共有</strong>：<br />
          ・誰かを特定・非難せず、「みんなで守るルール」として確認する
        </li>
        <li><strong>保護者への説明</strong>：<br />
          ・事実と対応を冷静に共有し、感情的な blame にならないよう注意する
        </li>
      </ol>
    `;
  } else if (value === "ruleBreak") {
    html = `
      <div class="info-section-title">【既存】ルール違反が何度も続く場合の対応フロー</div>
      <ol>
        <li><strong>「具体的にどの行動か」を言語化する</strong>：<br />
          ・「ちゃんとして」ではなく、「○○のときに△△をしたのが困っている」と具体的に伝える
        </li>
        <li><strong>環境やルール側の工夫を考える</strong>：<br />
          ・ルールが難しすぎないか？情報量が多すぎないか？<br />
          ・立ち位置や役割を変えることで改善できないか？
        </li>
        <li><strong>それでも繰り返される場合</strong>：<br />
          ・「これ以上続くと、その日は見学に切り替える」「保護者に一度来てもらう」など、次のステップを事前に伝える
        </li>
        <li><strong>保護者と一緒に振り返る</strong>：<br />
          ・団体側だけで抱え込まず、家庭での様子や工夫を聞きながら、共通の方針を決める
        </li>
      </ol>
    `;
  } else if (value === "medicalEmergency") {
    html = `
      <div class="info-section-title">【既存】医療的な緊急事態（発作・アレルギーなど）の対応フロー</div>
      <ol>
        <li><strong>まず安全を確保する</strong>：<br />
          ・周囲の危険物（硬いもの・角があるもの）を遠ざける<br />
          ・倒れている場合は頭を守り、無理に抑えつけない
        </li>
        <li><strong>事前に聞いている「対応マニュアル」に従う</strong>：<br />
          ・エピペンや救急薬の使用条件・使い方を思い出し、可能なら複数人で確認しながら対応する
        </li>
        <li><strong>必要に応じて119番通報</strong>：<br />
          ・意識がない／呼吸が苦しそう／症状がどんどん強くなっている場合は、迷わず救急要請する
        </li>
        <li><strong>他の子どもたちへの対応</strong>：<br />
          ・状況を簡単に説明し、不安を煽らないように安心させる
        </li>
        <li><strong>事後に保護者・関係機関としっかり振り返る</strong>：<br />
          ・何が起きたか・どう対応したかを共有し、今後の参加方法や条件を一緒に決めていく
        </li>
      </ol>
    `;
  } else if (value.startsWith("custom:")) {
    const id = value.replace("custom:", "");
    const flow = customFlows.find((f) => f.id === id);
    if (flow) {
      html = `
        <div class="info-section-title">【カスタム】${flow.name}</div>
        <p>${flow.body.replace(/\n/g, "<br />")}</p>
      `;
    }
  }

  incidentFlowDiv.classList.remove("hidden");
  incidentFlowDiv.innerHTML = html;
}

incidentTypeSelect.addEventListener("change", renderIncidentFlow);

addCustomFlowBtn.addEventListener("click", () => {
  const name = customFlowNameInput.value.trim();
  const body = customFlowBodyInput.value.trim();
  if (!name || !body) {
    alert("フロー名と内容を入力してください。");
    return;
  }

  const id = "cf_" + Date.now();
  customFlows.push({ id, name, body });

  const opt = document.createElement("option");
  opt.value = "custom:" + id;
  opt.textContent = `【カスタム】${name}`;
  incidentTypeSelect.appendChild(opt);

  customFlowNameInput.value = "";
  customFlowBodyInput.value = "";
});

// ===============================
// 4. メモ欄 + メモログ（編集・削除可） & 全体保存・復元
// ===============================
const freeMemoEl = document.getElementById("freeMemo");
const memoLogListEl = document.getElementById("memoLogList");
const saveAllBtn = document.getElementById("saveAllBtn");

// メモログ：{ id, timestamp, text }
let memoLogs = [];

function renderMemoLogs() {
  memoLogListEl.innerHTML = "";
  if (memoLogs.length === 0) {
    memoLogListEl.innerHTML =
      '<p class="small-text">まだメモログはありません。</p>';
    return;
  }

  const logs = [...memoLogs].sort((a, b) => b.timestamp - a.timestamp);

  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    const dateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${
      String(date.getHours()).padStart(2, "0")
    }:${String(date.getMinutes()).padStart(2, "0")}`;

    const wrapper = document.createElement("div");
    wrapper.className = "info-block";
    wrapper.style.marginTop = "0.6rem";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const title = document.createElement("div");
    title.className = "info-section-title";
    title.textContent = `${dateStr} のメモ`;

    const btnArea = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.className = "sub-btn";
    editBtn.style.marginRight = "0.4rem";
    editBtn.addEventListener("click", () => editMemoLog(log.id));

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.className = "sub-btn";
    delBtn.style.backgroundColor = "#b91c1c";
    delBtn.addEventListener("click", () => deleteMemoLog(log.id));

    btnArea.appendChild(editBtn);
    btnArea.appendChild(delBtn);

    header.appendChild(title);
    header.appendChild(btnArea);

    const body = document.createElement("p");
    body.innerHTML = (log.text || "")
      .replace(/\n/g, "<br />")
      .replace(/ {2}/g, "&nbsp;&nbsp;");

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    memoLogListEl.appendChild(wrapper);
  });
}

function editMemoLog(id) {
  const log = memoLogs.find((l) => l.id === id);
  if (!log) return;
  const newText = prompt(
    "メモ内容を編集してください：",
    log.text || ""
  );
  if (newText === null) return; // キャンセル
  log.text = newText;
  renderMemoLogs();
}

function deleteMemoLog(id) {
  if (!confirm("このメモログを削除しますか？")) return;
  memoLogs = memoLogs.filter((l) => l.id !== id);
  renderMemoLogs();
}

// 状態を1つのオブジェクトにまとめる
function collectState() {
  const dailyCustomItems = Array.from(
    dailyChecklistForm.querySelectorAll("label.custom-check-item")
  ).map((label) => {
    const input = label.querySelector("input[type='checkbox']");
    return {
      text: label.textContent.trim(),
      value: input ? input.value : "support"
    };
  });

  const schoolCustomItems = Array.from(
    schoolChecklistForm.querySelectorAll("label.custom-check-item")
  ).map((label) => {
    const input = label.querySelector("input[type='checkbox']");
    return {
      text: label.textContent.trim(),
      value: input ? input.value : "support"
    };
  });

  return {
    diagnoses,
    responses,
    resultTemplates,
    customFlows,
    dailyCustomItems,
    schoolCustomItems,
    memo: freeMemoEl.value,
    memoLogs
  };
}

// 状態を画面に反映
function applyState(state) {
  if (!state) return;

  if (Array.isArray(state.diagnoses)) diagnoses = state.diagnoses;
  if (Array.isArray(state.responses)) responses = state.responses;
  if (Array.isArray(state.resultTemplates))
    resultTemplates = state.resultTemplates;
  if (Array.isArray(state.customFlows)) customFlows = state.customFlows;
  if (Array.isArray(state.memoLogs)) memoLogs = state.memoLogs;

  // 画面再描画
  renderDiagnosisList();
  renderResponseList();
  renderTemplateSelect();

  // カスタムフローをプルダウンに追加
  customFlows.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = "custom:" + f.id;
    opt.textContent = `【カスタム】${f.name}`;
    incidentTypeSelect.appendChild(opt);
  });

  // カスタムチェック項目を復元
  if (Array.isArray(state.dailyCustomItems)) {
    state.dailyCustomItems.forEach((item) => {
      const label = document.createElement("label");
      label.classList.add("custom-check-item");
      label.innerHTML = `
        <input type="checkbox" name="daily" value="${item.value}" />
        ${item.text}
      `;
      dailyChecklistForm.appendChild(label);
    });
  }

  if (Array.isArray(state.schoolCustomItems)) {
    state.schoolCustomItems.forEach((item) => {
      const label = document.createElement("label");
      label.classList.add("custom-check-item");
      label.innerHTML = `
        <input type="checkbox" name="school" value="${item.value}" />
        ${item.text}
      `;
      schoolChecklistForm.appendChild(label);
    });
  }

  if (typeof state.memo === "string") {
    freeMemoEl.value = state.memo;
  }

  renderMemoLogs();
}

// 保存ボタン
saveAllBtn.addEventListener("click", () => {
  try {
    const text = freeMemoEl.value.trim();
    if (text) {
      memoLogs.push({
        id: "m_" + Date.now(),
        timestamp: Date.now(),
        text
      });
    }

    const state = collectState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderMemoLogs();

    saveAllBtn.textContent = "保存しました";
    setTimeout(() => {
      saveAllBtn.textContent = "保存する";
    }, 1500);
  } catch (e) {
    alert("保存に失敗しました（ブラウザの制限の可能性があります）");
    console.error(e);
  }
});

// ページ読み込み時に復元
(function restoreAll() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // 初期描画
      renderDiagnosisList();
      renderResponseList();
      renderTemplateSelect();
      renderMemoLogs();
      return;
    }
    const state = JSON.parse(saved);
    applyState(state);
  } catch (e) {
    console.warn("保存データの復元に失敗しました:", e);
    renderDiagnosisList();
    renderResponseList();
    renderTemplateSelect();
    renderMemoLogs();
  }
})();
