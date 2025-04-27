// script.js
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

function setTheme(theme) {
  rootEl.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

const loginDiv = document.getElementById('login');
const contentDiv = document.getElementById('content');
const pwInput = document.getElementById('pwInput');
const enterBtn = document.getElementById('enterBtn');
const errorMsg = document.getElementById('errorMsg');

async function checkPassword() {
  errorMsg.textContent = '';
  try {
    const res = await fetch('/.netlify/functions/protect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwInput.value })
    });
    const { success, html, message } = await res.json();
    if (success) {
      loginDiv.style.display = 'none';
      contentDiv.style.display = 'block';
      contentDiv.innerHTML = html;
    } else {
      throw new Error(message || 'Incorrect password');
    }
  } catch (err) {
    errorMsg.textContent = err.message;
    pwInput.value = '';
    pwInput.focus();
  }
}

enterBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') checkPassword();
});
