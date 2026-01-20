const API_BASE = "http://localhost:3000";

// ===== DOM helpers =====
const $ = (id) => document.getElementById(id);
const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");

function setMsg(el, text, type = "error") {
  el.textContent = text;
  el.className = `msg ${type}`;
  show(el);
}
function clearMsg(el) {
  el.textContent = "";
  el.className = "msg hidden";
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===== Auth DOM =====
const authView = $("authView");
const appView = $("appView");

const tabLogin = $("tabLogin");
const tabRegister = $("tabRegister");
const loginForm = $("loginForm");
const registerForm = $("registerForm");

const loginUsername = $("loginUsername");
const loginPassword = $("loginPassword");
const loginMsg = $("loginMsg");

const registerUsername = $("registerUsername");
const registerPassword = $("registerPassword");
const registerPassword2 = $("registerPassword2");
const registerMsg = $("registerMsg");

const userBadge = $("userBadge");
const logoutBtn = $("logoutBtn");

// ===== App DOM =====
const statTotal = $("statTotal");
const statConfirmed = $("statConfirmed");
const statPending = $("statPending");

const tabCreate = $("tabCreate");
const tabList = $("tabList");
const createView = $("createView");
const listView = $("listView");

const createForm = $("createForm");
const nameInput = $("name");
const studentIdInput = $("studentId");
const departmentInput = $("department");
const eventTitleInput = $("eventTitle");
const createMsg = $("createMsg");

const searchInput = $("searchInput");
const refreshBtn = $("refreshBtn");
const listTbody = $("list");
const listMsg = $("listMsg");

// ===== storage (demo) =====
const USERS_KEY = "cem_users";
const SESSION_KEY = "cem_session";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}
function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ===== Tabs: Auth =====
function switchAuthTab(mode) {
  clearMsg(loginMsg);
  clearMsg(registerMsg);

  if (mode === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    show(loginForm);
    hide(registerForm);
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    show(registerForm);
    hide(loginForm);
  }
}

tabLogin.addEventListener("click", () => switchAuthTab("login"));
tabRegister.addEventListener("click", () => switchAuthTab("register"));

// ===== Auth: Register =====
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMsg(registerMsg);

  const u = registerUsername.value.trim();
  const p = registerPassword.value.trim();
  const p2 = registerPassword2.value.trim();

  if (!/^[a-zA-Z0-9]{4,}$/.test(u)) {
    return setMsg(registerMsg, "帳號需至少 4 碼，且只能英文或數字。");
  }
  if (p.length < 6) {
    return setMsg(registerMsg, "密碼需至少 6 碼。");
  }
  if (p !== p2) {
    return setMsg(registerMsg, "兩次密碼不一致。");
  }

  const users = getUsers();
  if (users[u]) {
    return setMsg(registerMsg, "此帳號已存在。");
  }

  users[u] = p;
  setUsers(users);
  setMsg(registerMsg, "註冊成功，請登入。", "ok");

  switchAuthTab("login");
  loginUsername.value = u;
  loginPassword.value = "";
});

// ===== Auth: Login =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMsg(loginMsg);

  const u = loginUsername.value.trim();
  const p = loginPassword.value.trim();

  const users = getUsers();
  if (!users[u] || users[u] !== p) {
    return setMsg(loginMsg, "帳號或密碼錯誤。");
  }

  setSession({ username: u });
  render();
  openAppTab("create");
});

// ===== Logout =====
logoutBtn.addEventListener("click", () => {
  clearSession();
  render();
  switchAuthTab("login");
});

// ===== Render auth state =====
function render() {
  const session = getSession();
  if (!session) {
    show(authView);
    hide(appView);
    hide(userBadge);
    hide(logoutBtn);
    return;
  }

  hide(authView);
  show(appView);
  userBadge.textContent = session.username;
  show(userBadge);
  show(logoutBtn);

  // 登入後先載入資料
  fetchAndRenderList();
}

// ===== App Tabs =====
function openAppTab(mode) {
  clearMsg(createMsg);
  clearMsg(listMsg);

  if (mode === "create") {
    tabCreate.classList.add("active");
    tabList.classList.remove("active");
    show(createView);
    hide(listView);
  } else {
    tabList.classList.add("active");
    tabCreate.classList.remove("active");
    show(listView);
    hide(createView);
  }
}

tabCreate.addEventListener("click", () => openAppTab("create"));
tabList.addEventListener("click", () => {
  openAppTab("list");
  fetchAndRenderList();
});

refreshBtn.addEventListener("click", () => fetchAndRenderList());
searchInput.addEventListener("input", () => renderListWithFilter());

// ===== CRUD state =====
let allParticipants = [];
let editingId = null; // 用來做 Update

// ===== API calls =====
async function apiGetParticipants() {
  const res = await fetch(`${API_BASE}/api/participants`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "取得資料失敗");
  return data.data;
}

async function apiCreateParticipant(payload) {
  const res = await fetch(`${API_BASE}/api/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "新增失敗");
  return data.data;
}

async function apiUpdateParticipant(id, payload) {
  const res = await fetch(`${API_BASE}/api/participants/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "更新失敗");
  return data.data;
}

async function apiDeleteParticipant(id) {
  const res = await fetch(`${API_BASE}/api/participants/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "刪除失敗");
  return true;
}

// ===== Form submit: Create/Update =====
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMsg(createMsg);

  const payload = {
    name: nameInput.value.trim(),
    studentId: studentIdInput.value.trim(),
    department: departmentInput.value.trim(),
    eventTitle: eventTitleInput.value.trim(),
  };

  if (!payload.name || !payload.studentId || !payload.department || !payload.eventTitle) {
    return setMsg(createMsg, "請填寫完整資料。");
  }

  try {
    if (editingId) {
      await apiUpdateParticipant(editingId, payload);
      setMsg(createMsg, "更新成功。", "ok");
      editingId = null;
      // 按鈕文字恢復
      createForm.querySelector("button[type='submit']").textContent = "新增報名";
    } else {
      await apiCreateParticipant(payload);
      setMsg(createMsg, "新增成功，已切換到清單。", "ok");
    }

    // 清空表單
    nameInput.value = "";
    studentIdInput.value = "";
    departmentInput.value = "";
    eventTitleInput.value = "";

    // 重新載入清單並切換到清單頁
    await fetchAndRenderList();
    openAppTab("list");
  } catch (err) {
    setMsg(createMsg, err.message || "操作失敗");
  }
});

// ===== Load + Render list =====
async function fetchAndRenderList() {
  clearMsg(listMsg);
  try {
    allParticipants = await apiGetParticipants();

    // 你後端若沒 status，這邊給預設值 pending
    allParticipants = allParticipants.map((p) => ({
      ...p,
      status: p.status || "pending",
    }));

    updateStats();
    renderListWithFilter();
  } catch (err) {
    setMsg(listMsg, err.message || "載入清單失敗");
  }
}

function updateStats() {
  const total = allParticipants.length;
  const confirmed = allParticipants.filter((p) => p.status === "confirmed").length;
  const pending = total - confirmed;

  statTotal.textContent = total;
  statConfirmed.textContent = confirmed;
  statPending.textContent = pending;
}

function renderListWithFilter() {
  const keyword = (searchInput.value || "").trim().toLowerCase();

  const filtered = allParticipants.filter((p) => {
    const hay = `${p.name} ${p.studentId} ${p.department} ${p.eventTitle}`.toLowerCase();
    return hay.includes(keyword);
  });

  renderList(filtered);
}

function renderList(rows) {
  if (!rows.length) {
    listTbody.innerHTML = `<tr><td colspan="6" class="empty">目前尚無報名資料</td></tr>`;
    return;
  }

  listTbody.innerHTML = rows
    .map((p) => {
      const statusText = p.status === "confirmed" ? "已確認" : "待確認";
      const statusClass = p.status === "confirmed" ? "badge ok" : "badge";
      const id = p._id || p.id; // 兼容不同欄位

      return `
        <tr>
          <td>${escapeHTML(p.name)}</td>
          <td>${escapeHTML(p.studentId)}</td>
          <td>${escapeHTML(p.department)}</td>
          <td>${escapeHTML(p.eventTitle)}</td>
          <td><span class="${statusClass}">${statusText}</span></td>
          <td class="actions">
            <button class="btn ghost sm" data-act="edit" data-id="${id}">編輯</button>
            <button class="btn ghost sm" data-act="confirm" data-id="${id}">確認</button>
            <button class="btn ghost sm danger" data-act="delete" data-id="${id}">刪除</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

// ===== Actions: edit / confirm / delete =====
listTbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;

  const act = btn.dataset.act;
  const id = btn.dataset.id;

  const target = allParticipants.find((p) => (p._id || p.id) === id);
  if (!target) return;

  try {
    if (act === "edit") {
      // 帶入表單
      editingId = id;
      nameInput.value = target.name || "";
      studentIdInput.value = target.studentId || "";
      departmentInput.value = target.department || "";
      eventTitleInput.value = target.eventTitle || "";

      createForm.querySelector("button[type='submit']").textContent = "更新報名";
      openAppTab("create");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMsg(createMsg, "已載入資料，可直接修改後按「更新報名」。", "ok");
    }

    if (act === "confirm") {
      await apiUpdateParticipant(id, { status: "confirmed" });
      await fetchAndRenderList();
      setMsg(listMsg, "已確認。", "ok");
    }

    if (act === "delete") {
      if (!confirm("確定要刪除這筆報名資料嗎？")) return;
      await apiDeleteParticipant(id);
      await fetchAndRenderList();
      setMsg(listMsg, "已刪除。", "ok");
    }
  } catch (err) {
    setMsg(listMsg, err.message || "操作失敗");
  }
});

// ===== Init =====
render();
switchAuthTab("login");
openAppTab("create");
