const dashboardData = {
  stats: [
    { title: 'Total Items', value: '128', detail: '↑ 12 from last week', theme: 'total' },
    { title: 'Expiring Soon', value: '7', detail: 'View items', theme: 'alert' },
    { title: 'Low Stock Items', value: '14', detail: 'View items', theme: 'warning' },
    { title: 'Shopping List', value: '10', detail: 'View list', theme: 'list' },
    { title: 'Monthly Expense', value: '₹4,250', detail: '↓ 8% from last month', theme: 'expense' }
  ],
  lineChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [2100, 3600, 2900, 4100, 4700, 4300]
  },
  categories: [
    { name: 'Vegetables', value: 1487, color: '#53B37C' },
    { name: 'Fruits', value: 1062, color: '#4E88F1' },
    { name: 'Dairy', value: 850, color: '#F5A53A' },
    { name: 'Snacks', value: 425, color: '#9B67E7' },
    { name: 'Others', value: 426, color: '#F05759' }
  ],
  expiringSoon: [
    { name: 'Milk', meta: '1 Litre', note: 'Expires in 1 day', icon: '🥛', style: 'alert' },
    { name: 'Tomatoes', meta: '500 g', note: 'Expires in 2 days', icon: '🍅', style: 'warn' },
    { name: 'Paneer', meta: '200 g', note: 'Expires in 2 days', icon: '🧀', style: 'warn' },
    { name: 'Yogurt', meta: '400 g', note: 'Expires in 3 days', icon: '🥣', style: 'low' }
  ],
  lowStock: [
    { name: 'Rice', meta: '1 kg left', note: 'Low', icon: '🍚', style: 'low' },
    { name: 'Toor Dal', meta: '500 g left', note: 'Low', icon: '🌾', style: 'low' },
    { name: 'Cooking Oil', meta: '250 ml left', note: 'Low', icon: '🫒', style: 'low' },
    { name: 'Sugar', meta: '250 g left', note: 'Low', icon: '🍬', style: 'low' }
  ],
  activities: [
    { icon: '➕', title: 'Added Milk to pantry', time: '2 mins ago', color: '#2F7D4F' },
    { icon: '📝', title: 'Added Tomatoes to shopping list', time: '15 mins ago', color: '#4E88F1' },
    { icon: '💵', title: 'Recorded expense of ₹450 at Reliance Fresh', time: '1 hour ago', color: '#7355B0' },
    { icon: '⚠️', title: 'Paneer is expiring tomorrow', time: '2 hours ago', color: '#C24A3C' },
    { icon: '📈', title: 'Monthly report generated', time: '5 hours ago', color: '#3768C2' }
  ]
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('smartGroceryUser'));
  } catch (error) {
    return null;
  }
}

function applyUserSession() {
  const user = getStoredUser();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const greeting = document.getElementById('dashboardGreeting');
  const sub = document.getElementById('dashboardSub');
  const nameEl = document.getElementById('profileName');
  const avatarEl = document.getElementById('profileAvatar');
  const logoutBtn = document.getElementById('logoutBtn');

  if (greeting) {
    const firstName = user.name?.split(' ')[0] || 'there';
    greeting.textContent = `Good morning, ${firstName}! 👋`;
  }

  if (sub) {
    sub.textContent = `Here is what is happening with your groceries today, ${user.name || 'friend'}.`;
  }

  if (nameEl) {
    nameEl.textContent = user.name || 'Member';
  }

  if (avatarEl) {
    const initials = (user.name || 'MG')
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    avatarEl.textContent = initials;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('smartGroceryUser');
      window.location.href = '../index.html';
    });
  }
}

function renderStats() {
  const container = document.getElementById('statsRow');
  if (!container) return;
  container.innerHTML = '';

  dashboardData.stats.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'stat-card';
    cardEl.innerHTML = `
      <div class="card-top">
        <span class="icon ${card.theme}">${getCardIcon(card.theme)}</span>
        <span class="title">${card.title}</span>
      </div>
      <span class="value">${card.value}</span>
      <span class="detail">${card.detail}</span>
    `;
    container.appendChild(cardEl);
  });
}

function getCardIcon(theme) {
  switch (theme) {
    case 'total': return '🛒';
    case 'alert': return '⚠️';
    case 'warning': return '📉';
    case 'list': return '📝';
    case 'expense': return '₹';
    default: return '•';
  }
}

function drawLineChart() {
  const canvas = document.getElementById('lineChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { labels, values } = dashboardData.lineChart;
  const padding = 40;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const maxValue = Math.max(...values) * 1.06;
  const minValue = Math.min(...values) * 0.9;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  const stepX = chartWidth / (values.length - 1);

  ctx.fillStyle = '#101820cc';
  ctx.font = '12px ui-sans-serif';
  ctx.textAlign = 'center';

  values.forEach((value, index) => {
    const x = padding + stepX * index;
    const y = padding + (maxValue - value) / (maxValue - minValue) * chartHeight;
    ctx.fillText(`₹${value}`, x, y - 16);
  });

  ctx.strokeStyle = '#2F7D4F';
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = padding + stepX * index;
    const y = padding + (maxValue - value) / (maxValue - minValue) * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = 'rgba(47,125,79,0.18)';
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = padding + stepX * index;
    const y = padding + (maxValue - value) / (maxValue - minValue) * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(padding + chartWidth, padding + chartHeight);
  ctx.lineTo(padding, padding + chartHeight);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#D1D9DB';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let index = 0; index < labels.length; index += 1) {
    const x = padding + stepX * index;
    const y = padding + chartHeight;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 6);
  }
  ctx.stroke();

  ctx.fillStyle = '#677065';
  ctx.textAlign = 'center';
  labels.forEach((label, index) => {
    const x = padding + stepX * index;
    ctx.fillText(label, x, height - 12);
  });
}

function drawDonutChart() {
  const canvas = document.getElementById('donutChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const categories = dashboardData.categories;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const total = categories.reduce((sum, item) => sum + item.value, 0);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  let startAngle = -Math.PI / 2;

  categories.forEach((category) => {
    const sliceAngle = (category.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = category.color;
    ctx.fill();
    startAngle += sliceAngle;
  });

  ctx.beginPath();
  ctx.fillStyle = '#F4F6F2';
  ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  renderLegend();
}

function renderLegend() {
  const list = document.getElementById('legendList');
  if (!list) return;
  list.innerHTML = '';
  dashboardData.categories.forEach((category) => {
    const row = document.createElement('div');
    row.className = 'legend-row';
    row.innerHTML = `
      <div class="legend-item">
        <span class="legend-dot" style="background:${category.color}"></span>
        <span class="legend-label">${category.name}</span>
      </div>
      <span class="legend-value">₹${category.value}</span>
    `;
    list.appendChild(row);
  });
}

function renderListItems() {
  const expiring = document.getElementById('expiringList');
  const lowStock = document.getElementById('lowStockList');
  const activity = document.getElementById('activityList');

  expiring.innerHTML = '';
  lowStock.innerHTML = '';
  activity.innerHTML = '';

  dashboardData.expiringSoon.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <div class="list-thumb" style="background:${getTagBackground(item.style)}">${item.icon}</div>
      <div class="list-info">
        <div class="item-name">${item.name}</div>
        <div class="item-meta">${item.meta}</div>
      </div>
      <span class="tag ${item.style}">${item.note}</span>
    `;
    expiring.appendChild(row);
  });

  dashboardData.lowStock.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <div class="list-thumb" style="background:${getTagBackground(item.style)}">${item.icon}</div>
      <div class="list-info">
        <div class="item-name">${item.name}</div>
        <div class="item-meta">${item.meta}</div>
      </div>
      <span class="tag ${item.style}">${item.note}</span>
    `;
    lowStock.appendChild(row);
  });

  dashboardData.activities.forEach((activityItem) => {
    const row = document.createElement('div');
    row.className = 'activity-item';
    row.innerHTML = `
      <div class="activity-icon" style="background:${activityItem.color};">${activityItem.icon}</div>
      <div class="activity-info">
        <div class="activity-text">${activityItem.title}</div>
        <div class="activity-time">${activityItem.time}</div>
      </div>
    `;
    activity.appendChild(row);
  });
}

function getTagBackground(style) {
  switch (style) {
    case 'alert': return 'rgba(194,74,60,0.15)';
    case 'warn': return 'rgba(201,130,31,0.15)';
    case 'low': return 'rgba(55,104,194,0.15)';
    default: return 'rgba(47,125,79,0.15)';
  }
}

function setupSearch() {
  const search = document.getElementById('dashboardSearch');
  if (!search) return;
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    const filterItem = (item) => item.name.toLowerCase().includes(query) || item.meta.toLowerCase().includes(query);

    const expiringContainer = document.getElementById('expiringList');
    const lowStockContainer = document.getElementById('lowStockList');

    expiringContainer.innerHTML = '';
    dashboardData.expiringSoon.filter(filterItem).forEach((item) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = `
        <div class="list-thumb" style="background:${getTagBackground(item.style)}">${item.icon}</div>
        <div class="list-info">
          <div class="item-name">${item.name}</div>
          <div class="item-meta">${item.meta}</div>
        </div>
        <span class="tag ${item.style}">${item.note}</span>
      `;
      expiringContainer.appendChild(row);
    });

    lowStockContainer.innerHTML = '';
    dashboardData.lowStock.filter(filterItem).forEach((item) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = `
        <div class="list-thumb" style="background:${getTagBackground(item.style)}">${item.icon}</div>
        <div class="list-info">
          <div class="item-name">${item.name}</div>
          <div class="item-meta">${item.meta}</div>
        </div>
        <span class="tag ${item.style}">${item.note}</span>
      `;
      lowStockContainer.appendChild(row);
    });
  });
}

function handleResize() {
  drawLineChart();
  drawDonutChart();
}

function initDashboard() {
  applyUserSession();
  renderStats();
  renderListItems();
  drawLineChart();
  drawDonutChart();
  renderLegend();
  setupSearch();
  window.addEventListener('resize', handleResize);
}

window.addEventListener('load', initDashboard);
