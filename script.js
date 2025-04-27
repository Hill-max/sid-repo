const loginDiv   = document.getElementById('login');
const contentDiv = document.getElementById('content');
const pwInput    = document.getElementById('pwInput');
const enterBtn   = document.getElementById('enterBtn');
const errorMsg   = document.getElementById('errorMsg');

async function checkPassword() {
  errorMsg.textContent = '';
  try {
    const res = await fetch('/.netlify/functions/protect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwInput.value })
    });
    const data = await res.json();
    if (data.success) {
      loginDiv.style.display   = 'none';
      contentDiv.style.display = 'block';
      contentDiv.innerHTML     = data.html;
    } else {
      throw new Error(data.message || 'Incorrect password');
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
