// example5_script.js
// 攔截 submit，聚焦第一個錯誤並模擬送出流程 + 顯示隱私權條款視窗

const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const agree = document.getElementById('agree');

function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
  controls.forEach((control) => {
    control.classList.remove('is-invalid');
    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) {
        firstInvalid = control;
      }
    }
  });
  return firstInvalid;
}

// 點擊「我已閱讀並同意隱私權條款」時顯示視窗
agree.addEventListener('click', (event) => {
  // 若使用者要勾選時才顯示條款內容
  if (!agree.checked) {
    event.preventDefault(); 
    alert('這是隱私權條款：\n\n1. 我們將妥善保護您的個人資料。\n2. 本表單資料僅供聯絡用途，不作其他用途。\n3. 若有疑問請與我們聯繫。\n\n請確認您已閱讀並同意後再按「確定」。');
    agree.checked = true; 
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  const firstInvalid = validateAllInputs(form);
  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    firstInvalid.focus();
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('資料已送出，感謝您的聯絡！');
  form.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  Array.from(form.elements).forEach((element) => {
    element.classList.remove('is-invalid');
  });
});

form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});
