const form = document.getElementById('loginForm');
const message = document.getElementById('formMessage');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    if (!name || !email || password.length < 4) {
      message.textContent = 'Please enter your name, email, and a password with at least 4 characters.';
      message.className = 'message';
      return;
    }

    localStorage.setItem('smartGroceryUser', JSON.stringify({ name, email }));
    message.textContent = 'Login successful. Redirecting to your dashboard...';
    message.className = 'message success';

    window.setTimeout(() => {
      window.location.href = 'frontend/dashboard.html';
    }, 500);
  });
}
