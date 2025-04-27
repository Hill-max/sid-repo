// script.js
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const loginCard = document.getElementById('login');
const contentCard = document.getElementById('content');
const pwInput = document.getElementById('pwInput');
const enterBtn = document.getElementById('enterBtn');
const errorMsg = document.getElementById('errorMsg');

function setTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeToggle.textContent = getComputedStyle(root)
    .getPropertyValue('--toggle-icon').replace(/['"]/g,'');
}

themeToggle.addEventListener('click', async () => {
  themeToggle.classList.add('rotating');
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  await new Promise(r => setTimeout(r, 300));
  themeToggle.classList.remove('rotating');
});

const saved = localStorage.getItem('theme');
if (saved) setTheme(saved);
else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

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
    // trigger reflow to restart shake
    void loginCard.offsetWidth;
    loginCard.classList.add('animate-shake');
    pwInput.value = '';
    pwInput.focus();
  }
}

enterBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keyup', e => e.key==='Enter' && checkPassword());
