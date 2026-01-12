const API_URL = "http://localhost:3000/api/participants";

const listEl = document.getElementById("list");
const form = document.getElementById("createForm");

// 正確抓 input 元素
const nameInput = document.getElementById("name");
const studentIdInput = document.getElementById("studentId");
const departmentInput = document.getElementById("department");
const eventTitleInput = document.getElementById("eventTitle");

/* 取得資料 */
async function fetchParticipants() {
  const res = await fetch(API_URL);
  const result = await res.json();

  listEl.innerHTML = "";

  if (!result.data || result.data.length === 0) {
    listEl.innerHTML = `
      <tr>
        <td colspan="6" class="empty">目前尚無報名資料</td>
      </tr>
    `;
    return;
  }

  result.data.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.studentId}</td>
      <td>${item.department}</td>
      <td>${item.eventTitle}</td>
      <td>
        <span class="badge ${item.status === "confirmed" ? "success" : "pending"}">
          ${item.status || "pending"}
        </span>
      </td>
      <td class="actions">
        <button class="btn-confirm" onclick="updateStatus('${item._id}', 'confirmed')">
          確認
        </button>
        <button class="btn-delete" onclick="deleteParticipant('${item._id}')">
          刪除
        </button>
      </td>
    `;

    listEl.appendChild(tr);
  });
}

/* 新增報名 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const studentId = studentIdInput.value.trim();
  const department = departmentInput.value.trim();
  const eventTitle = eventTitleInput.value.trim();

  if (!name || !studentId || !department || !eventTitle) {
    alert("請填寫所有欄位");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      studentId,
      department,
      eventTitle
    })
  });

  form.reset();
  fetchParticipants(); 
});

/* 更新狀態 */
async function updateStatus(id, status) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  fetchParticipants();
}

/* 刪除 */
async function deleteParticipant(id) {
  if (!confirm("確定要刪除此筆資料？")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchParticipants();
}

/* 初始化 */
fetchParticipants();
