function $(sel) { return document.querySelector(sel); }

function setMsg(el, text, type) {
  if (!el) return;
  el.textContent = text || '';
  el.classList.remove('ok', 'bad');
  if (type) el.classList.add(type);
}

function randomToken() {
  const base = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = 'demo.';
  for (let i = 0; i < 32; i++) s += base[Math.floor(Math.random() * base.length)];
  return s;
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getAuth() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

function isAboutPage() {
  return location.pathname.endsWith('about.html');
}

(function init() {
  // About 頁守門：沒登入就導回 index
  if (isAboutPage()) {
    const { token } = getAuth();
    if (!token) location.href = './index.html';
  }

  // index.html：登入行為
  const loginForm = $('#loginForm');
  const msg = $('#msg');
  const fillDemo = $('#fillDemo');

  if (fillDemo && loginForm) {
    fillDemo.addEventListener('click', () => {
      loginForm.email.value = 'student@example.com';
      loginForm.password.value = 'pass1234';
      setMsg(msg, '已填入測試帳號', 'ok');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        setMsg(msg, '請輸入 Email 與 Password', 'bad');
        return;
      }

      const role = email.includes('admin') ? 'admin' : 'student';
      const user = { email, role };

      localStorage.setItem('token', randomToken());
      localStorage.setItem('user', JSON.stringify(user));

      setMsg(msg, '登入成功，正在前往 About…', 'ok');
      setTimeout(() => { location.href = './about.html'; }, 450);
    });
  }

  // about.html：顯示使用者資訊 + demo 區塊
  if (isAboutPage()) {
    const { token, user } = getAuth();

    const emailEl = $('#email');
    const roleEl = $('#role');
    const statusEl = $('#status');

    if (emailEl) emailEl.textContent = user?.email || '-';
    if (roleEl) roleEl.textContent = user?.role || '-';
    if (statusEl) statusEl.textContent = token ? '已登入' : '未登入';

    const logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        clearAuth();
        location.href = './index.html';
      });
    }

    const copyToken = $('#copyToken');
    if (copyToken) {
      copyToken.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(token || '');
          copyToken.textContent = '已複製';
          setTimeout(() => (copyToken.textContent = '複製 Token'), 900);
        } catch {
          // ignore
        }
      });
    }

    const loadBtn = $('#loadBtn');
    const clearBtn = $('#clearBtn');
    const output = $('#output');

    if (loadBtn && output) {
      loadBtn.addEventListener('click', () => {
        const demo = {
          message: '這裡可以放你的自我介紹、作業摘要或功能說明。',
          user,
          time: new Date().toISOString()
        };
        output.textContent = JSON.stringify(demo, null, 2);
      });
    }

    if (clearBtn && output) {
      clearBtn.addEventListener('click', () => {
        output.textContent = '已清除';
      });
    }
  }
})();
