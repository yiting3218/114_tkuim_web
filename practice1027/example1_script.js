// example1_script.js
// 統一在父層監聽點擊與送出事件，處理清單項目新增/刪除

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `
    <span>${value}</span>
    <div class="btn-group btn-group-sm">
      <button class="btn btn-outline-success" data-action="done">完成</button>
      <button class="btn btn-outline-danger" data-action="remove">刪除</button>
    </div>
  `;
  list.appendChild(item);
  input.value = '';
  input.focus();
});

list.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action]');
  if (!btn) return;
  const item = btn.closest('li');

  if (btn.dataset.action === 'remove') {
    item.remove();
  } else if (btn.dataset.action === 'done') {
    item.classList.toggle('list-group-item-success');
  }
});

input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') form.requestSubmit();
});