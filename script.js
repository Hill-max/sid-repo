const pwInput = document.getElementById('pwInput');
const togglePassword = document.getElementById('togglePassword');
const enterBtn = document.getElementById('enterBtn');
const backBtn = document.getElementById('backBtn');
const errorMsg = document.getElementById('errorMsg');
const loginCard = document.getElementById('login');
const contentCard = document.getElementById('content');
const themeToggle = document.getElementById('themeToggle');
const addButton = document.getElementById('addButton');
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

    // Hide login, show content and back button
    loginCard.classList.add('hidden');
    contentCard.classList.remove('hidden');
    rpOfficeBtn.classList.remove('hidden');
    backBtn.classList.remove('hidden');

    // Insert protected HTML if provided
    if (html) contentCard.innerHTML = html;

    // Accessibility: focus content
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
  // Show login, hide content and buttons
  loginCard.classList.remove('hidden');
  contentCard.classList.add('hidden');
  rpOfficeBtn.classList.add('hidden');
  backBtn.classList.add('hidden');

  // Reset input and focus
  pwInput.value = '';
  pwInput.focus();
});

addButton.addEventListener('click', () => {
  alert('Add button clicked!');
});

rpOfficeBtn.addEventListener('click', () => {
  // Your R.P Office logic here
});
```

### styles.css (add button styling)
```css
.back-button {
  /* reuse rp-office-btn styles with slight variation */
  background-color: #f44336; /* red for back */
  margin: 1rem auto 0;
}
