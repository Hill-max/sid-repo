document.addEventListener("DOMContentLoaded", () => {
  const password = "Hilltop2030";
  const enterBtn = document.getElementById("enterBtn");
  const pwInput = document.getElementById("pwInput");
  const errorMsg = document.getElementById("errorMsg");
  const loginCard = document.getElementById("login");
  const contentCard = document.getElementById("content");
  const rpOfficeBtn = document.getElementById("rpOfficeBtn");

  // Event listener for "Enter" button
  enterBtn.addEventListener("click", () => {
    if (pwInput.value === password) {
      // Hide login card and show content card
      loginCard.classList.add("fade-out");
      setTimeout(() => {
        loginCard.classList.add("hidden");
        contentCard.classList.remove("hidden");
        rpOfficeBtn.classList.remove("hidden"); // Show the R.P Office button
      }, 500);
    } else {
      errorMsg.textContent = "Incorrect password! Please try again.";
      errorMsg.classList.add("animate-shake");
    }
  });

  // Show/hide password functionality
  const togglePassword = document.getElementById("togglePassword");
  togglePassword.addEventListener("click", () => {
    if (pwInput.type === "password") {
      pwInput.type = "text";
      togglePassword.textContent = "Hide";
    } else {
      pwInput.type = "password";
      togglePassword.textContent = "Show";
    }
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    document.documentElement.setAttribute(
      "data-theme",
      document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"
    );
    themeToggle.textContent =
      themeToggle.textContent === "🌙" ? "☀️" : "🌙";
    themeToggle.classList.toggle("rotating");
  });
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
