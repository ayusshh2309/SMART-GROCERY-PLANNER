const loginStatusText = document.getElementById('loginStatusText');
const loginNavLink = document.getElementById('loginNavLink');
const heroGreeting = document.getElementById('heroGreeting');
const currentDate = document.getElementById('currentDate');

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('smartGroceryUser'));
  } catch (error) {
    return null;
  }
}

function updateLandingView() {
  const user = getStoredUser();

  if (user && loginStatusText) {
    const firstName = user.name?.split(' ')[0] || 'friend';
    loginStatusText.textContent = `Welcome back, ${firstName}. Your dashboard is ready.`;
  }

  if (user && heroGreeting) {
    heroGreeting.textContent = `Hello ${user.name || 'there'}`;
  }

  if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }

  if (loginNavLink) {
    loginNavLink.textContent = user ? 'Dashboard' : 'Login';
    loginNavLink.href = user ? 'frontend/dashboard.html' : 'login.html';
  }
}

updateLandingView();
