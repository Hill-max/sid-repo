const pwInput       = document.getElementById('pwInput');
const togglePassword= document.getElementById('togglePassword');
const enterBtn      = document.getElementById('enterBtn');
const backBtn       = document.getElementById('backBtn');
const errorMsg      = document.getElementById('errorMsg');
const loginCard     = document.getElementById('login');
const contentCard   = document.getElementById('content');
const protectedSlot = document.getElementById('protectedSlot');
const themeToggle   = document.getElementById('themeToggle');
const addButton     = document.getElementById('addButton');
const addForm       = document.getElementById('addForm');
const cancelAdd     = document.getElementById('cancelAdd');
const personName    = document.getElementById('personName');
const modeSelect    = document.getElementById('modeSelect');
const rpOfficeBtn   = document.getElementById('rpOfficeBtn');

// Persist theme
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-pressed', theme === 'dark');
}
const saved = localStorage.getItem('theme');
setTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const isPwd = pwInput.type === 'password';
  pwInput.type = isPwd ? 'text' : 'password';
  togglePassword.textContent = isPwd ? 'Hide' : 'Show';
  togglePassword.setAttribute('aria-pressed', isPwd);
});

// Toggle theme with spin
themeToggle.addEventListener('click', () => {
  themeToggle.classList.add('rotating');
  setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  setTimeout(() => themeToggle.classList.remove('rotating'), 500);
});

// Check password & inject only into protectedSlot
async function checkPassword() {
  errorMsg.textContent = '';
  try {
    const res = await fetch('/.netlify/functions/protect', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ password: pwInput.value.trim() })
    });
    const { success, html, message } = await res.json();
    if (!success) throw new Error(message || 'Incorrect password.');

    // show content & controls
    loginCard.classList.add('hidden');
    contentCard.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    rpOfficeBtn.classList.remove('hidden');

    // inject protected HTML
    if (html) protectedSlot.innerHTML = html;
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

// Back button resets view
backBtn.addEventListener('click', () => {
  loginCard.classList.remove('hidden');
  contentCard.classList.add('hidden');
  backBtn.classList.add('hidden');
  rpOfficeBtn.classList.add('hidden');
  addForm.classList.add('hidden');
  addButton.classList.remove('hidden');
  pwInput.value = '';
  pwInput.focus();
});

// Show Add form
addButton.addEventListener('click', () => {
  addForm.classList.remove('hidden');
  addButton.classList.add('hidden');
  personName.focus();
});

// Cancel Add
cancelAdd.addEventListener('click', () => {
  addForm.reset();
  addForm.classList.add('hidden');
  addButton.classList.remove('hidden');
});

// Handle Add form submit
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = personName.value.trim();
  const mode = modeSelect.value;
  console.log('New person:', { name, mode });
  // TODO: send to server or update UI...
  addForm.reset();
  addForm.classList.add('hidden');
  addButton.classList.remove('hidden');
});

// R.P Office button logic placeholder
rpOfficeBtn.addEventListener('click', () => {
  // Your R.P Office action here
});
