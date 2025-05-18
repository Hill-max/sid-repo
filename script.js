const pwInput = document.getElementById('pwInput');
const togglePassword = document.getElementById('togglePassword');
const enterBtn = document.getElementById('enterBtn');
const backBtn = document.getElementById('backBtn');
const errorMsg = document.getElementById('errorMsg');
const loginCard = document.getElementById('login');
const contentCard = document.getElementById('content');
const themeToggle = document.getElementById('themeToggle');
const addButton = document.getElementById('addButton');
const addForm = document.getElementById('addForm');
const cancelAdd = document.getElementById('cancelAdd');
const personName = document.getElementById('personName');
const modeSelect = document.getElementById('modeSelect');
const rpOfficeBtn = document.getElementById('rpOfficeBtn');

// Theme persistence
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-pressed', theme === 'dark');
}

// Initialize theme
const saved = localStorage.getItem('theme');
setTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

togglePassword.addEventListener('click', () => {
  const isPassword = pwInput.getAttribute('type') === 'password';
  pwInput.setAttribute('type', isPassword ? 'text' : 'password');
  togglePassword.textContent = isPassword ? 'Hide' : 'Show';
  togglePassword.setAttribute('aria-pressed', isPassword);
});

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
  themeToggle.classList.add('rotating');
  setTimeout(() => themeToggle.classList.remove('rotating'), 500);
});

async function checkPassword() {
  errorMsg.textContent = '';
  try {
    const res = await fetch('/.netlify/functions/protect', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ password: pwInput.value.trim() })
    });
    const { success, html, message } = await res.json();

    if (!success) throw new Error(message || 'Incorrect password');

    loginCard.classList.add('hidden');
    contentCard.classList.remove('hidden');
    rpOfficeBtn.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    if (html) contentCard.innerHTML = html;
    contentCard.focus();
  } catch (err) {
    errorMsg.textContent = err.message;
    loginCard.classList.remove('animate-shake');
    void loginCard.offsetWidth;
    loginCard.classList.add('animate-shake');
    pwInput.value = '';
    pwInput.focus();
  }
}

enterBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keyup', e => e.key === 'Enter' && checkPassword());

backBtn.addEventListener('click', () => {
  loginCard.classList.remove('hidden');
  contentCard.classList.add('hidden');
  rpOfficeBtn.classList.add('hidden');
  backBtn.classList.add('hidden');
  addForm.classList.add('hidden');
  addButton.classList.remove('hidden');
  pwInput.value = '';
  pwInput.focus();
});

addButton.addEventListener('click', () => {
  addForm.classList.remove('hidden');
  addButton.classList.add('hidden');
  personName.focus();
});

cancelAdd.addEventListener('click', () => {
  addForm.reset();
  addForm.classList.add('hidden');
  addButton.classList.remove('hidden');
});

addForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = personName.value.trim();
  const mode = modeSelect.value;
  // Handle form data (e.g., send to server or update UI)
  console.log('New person:', { name, mode });
  addForm.reset();
  addForm.classList.add('hidden');
  addButton.classList.remove('hidden');
});

rpOfficeBtn.addEventListener('click', () => {
  // Your R.P Office logic here
});
