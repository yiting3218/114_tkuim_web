// week09/client/signup_form.js
const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // 將表單資料轉換為物件
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  // 增加預設密碼，與其他字段
  payload.password = payload.confirmPassword = 'demoPass88';
  payload.interests = ['後端入門']; // 假設這是一個興趣陣列
  payload.terms = true; // 假設用戶勾選了條款

  try {
    resultEl.textContent = '送出中...';

    // 發送 API 請求到後端
    const res = await fetch('http://localhost:3001/api/signup', {  // 後端 API URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '失敗');
    }

    // 顯示成功訊息，重設表單
    resultEl.textContent = JSON.stringify(data, null, 2);
    form.reset();
  } catch (error) {
    // 顯示錯誤訊息
    resultEl.textContent = `錯誤：${error.message}`;
  }
});
