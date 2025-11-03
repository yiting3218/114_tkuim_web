// signup_form.js
// 即時驗證 + 密碼強度 + localStorage 暫存 + 防重送

const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const interests = document.getElementById('interests');
const terms = document.getElementById('terms');
const strengthLabel = document.getElementById('strength');

function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setCustomValidity(message);
  error.textContent = message;
  if (message) input.classList.add('is-invalid');
  else input.classList.remove('is-invalid');
}

function validateInput(input) {
  const value = input.value.trim();
  let message = '';

  if (!value) {
    message = '此欄位必填';
  } else if (input === emailInput) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) message = '請輸入正確的 Email 格式';
  } else if (input === phoneInput) {
    if (!/^09\d{8}$/.test(value)) message = '請輸入09開頭的10碼手機號碼';
  } else if (input === passwordInput) {
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    if (value.length < 8) message = '密碼至少需 8 碼';
    else if (!hasLetter || !hasNumber) message = '密碼需包含英文字母與數字';
  } else if (input === confirmInput) {
    if (confirmInput.value !== passwordInput.value) message = '兩次密碼輸入不一致';
  }

  setError(input, message);
  return !message;
}

// 密碼強度顯示
function updatePasswordStrength() {
  const value = passwordInput.value;
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  let strength = 0;
  if (hasLetter) strength++;
  if (hasNumber) strength++;
  if (hasSymbol) strength++;
  if (value.length >= 8) strength++;

  if (value.length === 0) {
    strengthLabel.textContent = '';
  } else if (strength <= 2) {
    strengthLabel.textContent = '強度：弱';
    strengthLabel.style.color = 'red';
  } else if (strength === 3) {
    strengthLabel.textContent = '強度：中';
    strengthLabel.style.color = 'orange';
  } else {
    strengthLabel.textContent = '強度：強';
    strengthLabel.style.color = 'green';
  }
}

// localStorage 暫存
function saveToLocalStorage() {
  const data = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    password: passwordInput.value,
    confirm: confirmInput.value,
    interests: Array.from(interests.querySelectorAll('input:checked')).map(i => i.id),
    terms: terms.checked
  };
  localStorage.setItem('signupData', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('signupData'));
  if (!data) return;
  nameInput.value = data.name || '';
  emailInput.value = data.email || '';
  phoneInput.value = data.phone || '';
  passwordInput.value = data.password || '';
  confirmInput.value = data.confirm || '';
  data.interests?.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = true;
  });
  terms.checked = !!data.terms;
  updatePasswordStrength();
}

function clearLocalStorage() {
  localStorage.removeItem('signupData');
}

// 事件委派：興趣勾選變化
interests.addEventListener('change', () => {
  const checked = interests.querySelectorAll('input:checked').length;
  const interestError = document.getElementById('interest-error');
  if (checked === 0) interestError.textContent = '請至少勾選一個興趣';
  else interestError.textContent = '';
  saveToLocalStorage();
});

// 即時驗證與暫存
form.addEventListener('blur', (e) => {
  if (e.target.matches('input')) validateInput(e.target);
  saveToLocalStorage();
}, true);

form.addEventListener('input', (e) => {
  if (e.target === passwordInput) updatePasswordStrength();
  if (e.target.matches('input')) {
    if (e.target.validationMessage) validateInput(e.target);
  }
  saveToLocalStorage();
});

// 送出攔截
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const inputs = [nameInput, emailInput, phoneInput, passwordInput, confirmInput];
  let firstInvalid = null;

  inputs.forEach((input) => {
    const valid = validateInput(input);
    if (!valid && !firstInvalid) firstInvalid = input;
  });

  const checkedInterests = interests.querySelectorAll('input:checked').length;
  const interestError = document.getElementById('interest-error');
  if (checkedInterests === 0) {
    interestError.textContent = '請至少勾選一個興趣';
    if (!firstInvalid) firstInvalid = interests.querySelector('input');
  } else {
    interestError.textContent = '';
  }

  const termsError = document.getElementById('terms-error');
  if (!terms.checked) {
    termsError.textContent = '請勾選服務條款';
    if (!firstInvalid) firstInvalid = terms;
  } else {
    termsError.textContent = '';
  }

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('註冊成功');
  form.reset();
  strengthLabel.textContent = '';
  clearLocalStorage();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

// 重設按鈕
resetBtn.addEventListener('click', () => {
  form.reset();
  document.querySelectorAll('.text-danger').forEach((el) => (el.textContent = ''));
  document.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  strengthLabel.textContent = '';
  clearLocalStorage();
});

// 初始化：載入暫存資料
loadFromLocalStorage();
