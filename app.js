// Magical Team Break Tracker - Client-side logic

// Motivational quotes
const quotes = [
  "Take a break, recharge your magic! ✨",
  "Great wizards rest often. 🧙‍♂️",
  "Even dragons need downtime. 🐉",
  "Let your spirit fly free for a moment! 🧚",
  "Elves meditate for their next adventure. 🧝",
  "Creativity blooms when you pause. 🌸"
];

// Avatars for team members
const avatars = {
  wizard: "🧙",
  elf: "🧝",
  dragon: "🐉",
  fairy: "🧚"
};

// Local data
let users = JSON.parse(localStorage.getItem('magical_users') || "[]");
let currentUser = JSON.parse(localStorage.getItem('magical_currentUser') || "null");

// Helper to show motivational quote
function showMotivation() {
  document.getElementById('motivation').textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// Registration
function register() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const avatar = document.getElementById('reg-avatar').value;

  if(!username || !password) {
    alert("Please enter a username and password!");
    return;
  }
  if(users.some(u => u.username === username)) {
    alert("Username already exists!");
    return;
  }

  users.push({username, password, avatar, breaks: []});
  localStorage.setItem('magical_users', JSON.stringify(users));
  alert("Registered! Please log in.");
  document.getElementById('reg-username').value = "";
  document.getElementById('reg-password').value = "";
}

// Login
function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const user = users.find(u => u.username === username && u.password === password);

  if(!user) {
    alert("Invalid credentials!");
    return;
  }

  currentUser = user;
  localStorage.setItem('magical_currentUser', JSON.stringify(currentUser));
  showDashboard();
}

// Logout
function logout() {
  currentUser = null;
  localStorage.setItem('magical_currentUser', "null");
  showAuth();
}

// Take a magical break
function takeBreak() {
  const now = new Date();
  currentUser.breaks.push(now.toISOString());
  users = users.map(u => u.username === currentUser.username ? currentUser : u);
  localStorage.setItem('magical_users', JSON.stringify(users));
  localStorage.setItem('magical_currentUser', JSON.stringify(currentUser));
  renderDashboard();
  alert("Enjoy your magical break!");
}

// Show authentication section
function showAuth() {
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  showMotivation();
}

// Show dashboard section
function showDashboard() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  renderDashboard();
  showMotivation();
}

// Render team dashboard grid
function renderDashboard() {
  const grid = document.getElementById('team-grid');
  grid.innerHTML = "";
  const filter = document.getElementById('filter-user').value.trim().toLowerCase();

  users.filter(u => u.username.toLowerCase().includes(filter)).forEach(u => {
    const member = document.createElement('div');
    member.className = "team-member";
    member.innerHTML = `
      <div class="avatar-img">${avatars[u.avatar] || "🧙"}</div>
      <div><strong>${u.username}</strong></div>
      <div>Breaks taken: ${u.breaks.length}</div>
      <ul style="padding-left:0;list-style:none;">
        ${u.breaks.slice(-3).map(b => `<li>${new Date(b).toLocaleString()}</li>`).join("")}
      </ul>
    `;
    grid.appendChild(member);
  });
}

// On load, show correct section
window.onload = function() {
  if(currentUser) showDashboard();
  else showAuth();
  showMotivation();
};
