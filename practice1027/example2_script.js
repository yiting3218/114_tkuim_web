// example2_script.js
// 驗證 Email 與手機欄位，限定學校信箱後拋出自訂訊息再提示使用者

const form = document.getElementById('contact-form');
const email = document.getElementById('email');
const phone = document.getElementById('phone');

function showValidity(input) {
  if (input.validity.valueMissing) {
    input.setCustomValidity('這個欄位必填');
  } else if (input === email && !/^[A-Za-z0-9._%+-]+@o365\.tku\.edu\.tw$/.test(input.value)) {
    input.setCustomValidity('請輸入學校信箱，例如 412637786@o365.tku.edu.tw');
  } else if (input.validity.typeMismatch) {
    input.setCustomValidity('格式不正確，請確認輸入內容');
  } else if (input.validity.patternMismatch) {
    input.setCustomValidity(input.title || '格式不正確');
  } else {
    input.setCustomValidity('');
  }
  return input.reportValidity();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailOk = showValidity(email);
  const phoneOk = showValidity(phone);
  if (emailOk && phoneOk) {
    alert('表單驗證成功，準備送出資料');
    form.reset();
  }
});

email.addEventListener('blur', () => {
  showValidity(email);
});

phone.addEventListener('blur', () => {
  showValidity(phone);
});
