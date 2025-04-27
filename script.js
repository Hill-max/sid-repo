const pwInput = document.getElementById('pwInput');
const togglePassword = document.getElementById('togglePassword');
const enterBtn = document.getElementById('enterBtn');
const errorMsg = document.getElementById('errorMsg');
const loginCard = document.getElementById('login');
const contentCard = document.getElementById('content');
const themeToggle = document.getElementById('themeToggle');

togglePassword.addEventListener('click', () => {
  const isPassword = pwInput.getAttribute('type') === 'password';
  pwInput.setAttribute('type', isPassword ? 'text' : 'password');
  togglePassword.textContent = isPassword ? 'Hide' : 'Show';
});

enterBtn.addEventListener('click', async () => {
  const password = pwInput.value.trim();
  const response = await fetch('/.netlify/functions/protect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  const result = await response.json();
  if (result.success) {
    loginCard.classList.add('hidden');
    contentCard.classList.remove('hidden');
  } else {
    errorMsg.textContent = 'Incorrect password!';
    pwInput.classList.add('animate-shake');
    setTimeout(() => pwInput.classList.remove('animate-shake'), 500);
  }
});

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', isLight ? 'dark' : 'light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  themeToggle.classList.add('rotating');
  setTimeout(() => themeToggle.classList.remove('rotating'), 500);
});

addButton.addEventListener('click', () => {
  alert('Add button clicked!');
});

const saved = localStorage.getItem('theme');
if (saved) setTheme(saved);
else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

togglePassword.addEventListener('click', () => {
  const type = pwInput.getAttribute('type') === 'password' ? 'text' : 'password';
  pwInput.setAttribute('type', type);
  togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
  togglePassword.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
});

async function checkPassword() {
  errorMsg.textContent = '';
  try {
    const res = await fetch('/.netlify/functions/protect', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({password: pwInput.value})
    });
    const {success, html, message} = await res.json();
    if (!success) throw new Error(message || 'Incorrect password');
    loginCard.classList.add('animate-fade-in');
    loginCard.classList.add('fade-out');
    await new Promise(r => setTimeout(r, 500));
    loginCard.classList.add('hidden');
    contentCard.classList.remove('hidden');
    contentCard.classList.add('animate-fade-in');
    contentCard.innerHTML = html;
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
pwInput.addEventListener('keyup', e => e.key==='Enter' && checkPassword());
