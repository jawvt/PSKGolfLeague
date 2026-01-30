// ========== STATE MANAGEMENT ==========
// Application state
const appState = {
    currentUser: null,
    isAdmin: false,
    currentWeek: 1,
    weekStarted: false,
    players: [],
    scores: {},
};

// Mock user database (with email-based authentication)
const mockUsers = {
    'john@example.com': { username: 'john', password: 'password123', isAdmin: false },
    'admin@pskgolfleague.com': { username: 'admin', password: 'admin123', isAdmin: true },
    'jane@example.com': { username: 'jane', password: 'golf456', isAdmin: false },
    'bob@example.com': { username: 'bob', password: 'birdie789', isAdmin: false },
};

// Mock data - player scores and round declarations
const playerData = {
    'john': {
        roundDeclared: false,
        declareTime: null,
        scoreEntered: false,
        submitTime: null,
        score: null,
        holes: [null, null, null, null, null, null, null, null, null],
    },
    'admin': {
        roundDeclared: false,
        declareTime: null,
        scoreEntered: false,
        submitTime: null,
        score: null,
        holes: [null, null, null, null, null, null, null, null, null],
    },
    'jane': {
        roundDeclared: true,
        declareTime: '10:30 AM',
        scoreEntered: true,
        submitTime: '11:15 AM',
        score: 42,
        holes: [4, 5, 3, 4, 5, 4, 3, 4, 5],
    },
    'bob': {
        roundDeclared: true,
        declareTime: '9:45 AM',
        scoreEntered: true,
        submitTime: '10:50 AM',
        score: 39,
        holes: [3, 5, 3, 4, 4, 4, 3, 4, 4],
    },
};

// ========== INITIALIZATION ==========
/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners for forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('score-form').addEventListener('submit', handleScoreSubmit);

    // Setup real-time score calculation
    for (let i = 1; i <= 9; i++) {
        const holeInput = document.getElementById(`hole-${i}`);
        if (holeInput) {
            holeInput.addEventListener('input', calculateTotal);
        }
    }

    // Show landing page by default
    navigateTo('landing-page');
});

// ========== NAVIGATION ==========
/**
 * Navigate to a specific page
 * @param {string} pageId - The ID of the page to navigate to
 */
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');

        // Refresh data when navigating to dashboard or leaderboard
        if (pageId === 'dashboard-page') {
            updateDashboard();
        } else if (pageId === 'leaderboard-page') {
            loadLeaderboard();
        } else if (pageId === 'score-entry-page') {
            updateUserDisplay('user-display-score');
        }
    }
}

// ========== AUTHENTICATION ==========
/**
 * Handle login form submission
 * @param {Event} e - The form submission event
 */
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validate credentials
    if (!mockUsers[email] || mockUsers[email].password !== password) {
        alert('Invalid email or password.\n\nTest Accounts:\nUser: john@example.com | Pass: password123\nUser: jane@example.com | Pass: golf456\nUser: bob@example.com | Pass: birdie789\n\nAdmin: admin@pskgolfleague.com | Pass: admin123');
        return;
    }

    // Login successful
    const username = mockUsers[email].username;
    appState.currentUser = username;
    appState.isAdmin = mockUsers[email].isAdmin;

    // Initialize player data if not exists
    if (!playerData[username]) {
        playerData[username] = {
            roundDeclared: false,
            declareTime: null,
            scoreEntered: false,
            submitTime: null,
            score: null,
            holes: [null, null, null, null, null, null, null, null, null],
        };
    }

    // Clear form and navigate
    document.getElementById('login-form').reset();
    navigateTo('dashboard-page');
}

/**
 * Handle signup form submission
 * @param {Event} e - The form submission event
 */
function handleSignup(e) {
    e.preventDefault();

    const email = document.getElementById('signup-email').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;

    // Validate input
    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    if (username.length < 3) {
        alert('Username must be at least 3 characters.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    if (mockUsers[email]) {
        alert('Email already registered. Please login or use another email.');
        return;
    }

    // Create new account
    mockUsers[email] = { username, password, isAdmin: false };
    playerData[username] = {
        roundDeclared: false,
        declareTime: null,
        scoreEntered: false,
        submitTime: null,
        score: null,
        holes: [null, null, null, null, null, null, null, null, null],
    };

    alert('Account created! Logging you in...');

    // Auto-login
    appState.currentUser = username;
    appState.isAdmin = false;

    // Clear form and navigate
    document.getElementById('signup-form').reset();
    toggleAuthForm(); // Reset to login form
    navigateTo('dashboard-page');
}

/**
 * Handle logout
 */
function logout() {
    appState.currentUser = null;
    appState.isAdmin = false;

    // Reset forms
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();

    // Switch back to login form
    if (document.getElementById('signup-form').classList.contains('visible')) {
        toggleAuthForm();
    }

    navigateTo('landing-page');
}

/**
 * Toggle between login and signup forms
 */
function toggleAuthForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleText = document.getElementById('toggle-text');

    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');

    if (signupForm.classList.contains('hidden')) {
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthForm(); return false;">Sign up</a>';
    } else {
        toggleText.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthForm(); return false;">Login</a>';
    }
}

/**
 * Toggle password visibility
 * @param {string} inputId - The ID of the password input
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target;

    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = 'Hide';
    } else {
        input.type = 'password';
        button.textContent = 'Show';
    }
}

// ========== DASHBOARD ==========
/**
 * Update the dashboard display
 */
function updateDashboard() {
    const user = appState.currentUser;
    const data = playerData[user];

    // Update week status
    updateWeekStatus();

    // Update user display
    updateUserDisplay('user-display');

    // Update player status
    document.getElementById('round-declared').textContent = data.roundDeclared ? 'Yes' : 'No';
    document.getElementById('declare-time').textContent = data.declareTime || '—';
    document.getElementById('score-entered').textContent = data.scoreEntered ? 'Yes' : 'No';
    document.getElementById('submit-time').textContent = data.submitTime || '—';
    document.getElementById('current-score').textContent = data.score !== null ? data.score : '—';

    // Update button states
    updateButtonStates();

    // Show/hide admin controls
    const adminControls = document.getElementById('admin-controls');
    if (appState.isAdmin) {
        adminControls.classList.remove('hidden');
    } else {
        adminControls.classList.add('hidden');
    }
}

/**
 * Update week status display
 */
function updateWeekStatus() {
    const weekEl = document.getElementById('current-week');
    const stateEl = document.getElementById('week-state');
    const deadlineEl = document.getElementById('declare-deadline');

    weekEl.textContent = appState.currentWeek;

    if (appState.weekStarted) {
        stateEl.textContent = 'Active';
        stateEl.classList.add('active');
        deadlineEl.textContent = '📅 Declare your round by Friday 5pm';
    } else {
        stateEl.textContent = 'Not Started';
        stateEl.classList.remove('active');
        deadlineEl.textContent = '⏳ Waiting for admin to start the week';
    }
}

/**
 * Update button states based on game rules
 */
function updateButtonStates() {
    const user = appState.currentUser;
    const data = playerData[user];

    const declareBtn = document.getElementById('declare-round-btn');
    const scoreBtn = document.getElementById('enter-score-btn');

    // Declare round button: enabled only if week is started and round not yet declared
    declareBtn.disabled = !appState.weekStarted || data.roundDeclared;

    // Score button: enabled only if round is declared and score not yet entered
    scoreBtn.disabled = !data.roundDeclared || data.scoreEntered;

    // Update button text and styling
    if (data.roundDeclared) {
        declareBtn.textContent = 'Round Declared ✓';
        declareBtn.classList.add('btn-success');
    } else {
        declareBtn.textContent = 'Declare Round';
        declareBtn.classList.remove('btn-success');
    }

    if (data.scoreEntered) {
        scoreBtn.textContent = 'Score Submitted ✓';
        scoreBtn.classList.add('btn-success');
    } else {
        scoreBtn.textContent = 'Enter Score';
        scoreBtn.classList.remove('btn-success');
    }
}

/**
 * Update user display name across pages
 * @param {string} elementId - The ID of the element to update
 */
function updateUserDisplay(elementId) {
    const user = appState.currentUser;
    const isAdmin = appState.isAdmin ? ' (Admin)' : '';
    const displayName = document.getElementById(elementId);
    if (displayName) {
        displayName.textContent = `${user}${isAdmin}`;
    }
}

// ========== DECLARE ROUND LOGIC ==========
/**
 * Open the declare round modal
 */
function openDeclareRound() {
    const modal = document.getElementById('declare-modal');
    const infoEl = document.getElementById('declare-info');

    const user = appState.currentUser;
    const data = playerData[user];

    if (!appState.weekStarted) {
        alert('❌ Admin has not started the week yet. Check back later!');
        return;
    }

    if (data.roundDeclared) {
        alert('❌ You have already declared a round this week.');
        return;
    }

    infoEl.textContent = `Week ${appState.currentWeek} - You can declare a round only once this week.`;
    modal.classList.remove('hidden');
}

/**
 * Close the declare round modal
 */
function closeDeclareRound() {
    const modal = document.getElementById('declare-modal');
    modal.classList.add('hidden');
}

/**
 * Confirm and declare a round
 */
function confirmDeclareRound() {
    const user = appState.currentUser;
    const data = playerData[user];

    // Declare the round
    data.roundDeclared = true;
    data.declareTime = formatTime(new Date());

    // Close modal and update dashboard
    closeDeclareRound();
    updateDashboard();

    alert('✅ Round declared! You can now enter your score.');
}

/**
 * Format time as HH:MM AM/PM
 * @param {Date} date - The date to format
 * @returns {string} Formatted time
 */
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
}

// ========== SCORE ENTRY LOGIC ==========
/**
 * Open the score entry page
 */
function openScoreEntry() {
    const user = appState.currentUser;
    const data = playerData[user];

    if (!data.roundDeclared) {
        alert('❌ You must declare a round first before entering your score.');
        return;
    }

    if (data.scoreEntered) {
        alert('❌ You have already submitted your score this week.');
        return;
    }

    // Load existing holes if any
    for (let i = 1; i <= 9; i++) {
        const hole = data.holes[i - 1];
        const input = document.getElementById(`hole-${i}`);
        if (hole !== null) {
            input.value = hole;
        } else {
            input.value = '';
        }
    }

    calculateTotal();
    navigateTo('score-entry-page');
}

/**
 * Calculate and display total score
 */
function calculateTotal() {
    let total = 0;
    let allFilled = true;

    for (let i = 1; i <= 9; i++) {
        const input = document.getElementById(`hole-${i}`);
        const value = parseInt(input.value) || 0;

        if (!input.value) {
            allFilled = false;
        }

        total += value;
    }

    // Update display
    const totalDisplay = document.getElementById('total-display');
    if (allFilled && total > 0) {
        totalDisplay.textContent = total;
    } else {
        totalDisplay.textContent = '0';
    }

    return { total, allFilled };
}

/**
 * Handle score form submission
 * @param {Event} e - The form submission event
 */
function handleScoreSubmit(e) {
    e.preventDefault();

    const { total, allFilled } = calculateTotal();

    if (!allFilled) {
        alert('❌ Please enter scores for all 9 holes.');
        return;
    }

    if (total === 0) {
        alert('❌ Please enter valid scores.');
        return;
    }

    // Show confirmation modal
    showScoreConfirmation(total);
}

/**
 * Show score confirmation modal
 * @param {number} total - The total score
 */
function showScoreConfirmation(total) {
    const modal = document.getElementById('score-confirm-modal');
    const confirmScore = document.getElementById('confirm-score');
    const breakdown = document.getElementById('score-breakdown');

    // Build score breakdown
    let breakdownHTML = '<p><strong>Your Scores:</strong></p>';
    for (let i = 1; i <= 9; i++) {
        const score = document.getElementById(`hole-${i}`).value;
        breakdownHTML += `<p>Hole ${i}: <strong>${score}</strong></p>`;
    }

    confirmScore.textContent = total;
    breakdown.innerHTML = breakdownHTML;

    modal.classList.remove('hidden');
}

/**
 * Close score confirmation modal
 */
function closeScoreConfirm() {
    const modal = document.getElementById('score-confirm-modal');
    modal.classList.add('hidden');
}

/**
 * Submit the score
 */
function submitScore() {
    const user = appState.currentUser;
    const data = playerData[user];

    // Store the holes data
    for (let i = 1; i <= 9; i++) {
        const score = parseInt(document.getElementById(`hole-${i}`).value);
        data.holes[i - 1] = score;
    }

    // Calculate total
    const total = data.holes.reduce((a, b) => a + b, 0);

    // Mark score as entered
    data.scoreEntered = true;
    data.submitTime = formatTime(new Date());
    data.score = total;

    // Clear form
    document.getElementById('score-form').reset();

    // Close modal and navigate back
    closeScoreConfirm();
    navigateTo('dashboard-page');

    alert('✅ Score submitted and locked! You scored ' + total + ' points.');
}

// ========== ADMIN LOGIC ==========
/**
 * Start the week (Admin only)
 */
function startWeek() {
    if (!appState.isAdmin) {
        alert('❌ Only admins can start the week.');
        return;
    }

    appState.weekStarted = true;

    alert(`✅ Week ${appState.currentWeek} started! Players can now declare rounds.`);
    updateDashboard();
}

/**
 * End the week (Admin only)
 */
function endWeek() {
    if (!appState.isAdmin) {
        alert('❌ Only admins can end the week.');
        return;
    }

    // Reset all players' round declarations for next week
    Object.keys(playerData).forEach(player => {
        playerData[player].roundDeclared = false;
        playerData[player].declareTime = null;
        playerData[player].scoreEntered = false;
        playerData[player].submitTime = null;
        // Keep scores for leaderboard
    });

    appState.weekStarted = false;
    appState.currentWeek += 1;

    alert(`✅ Week ended! Week ${appState.currentWeek} is ready to begin.`);
    updateDashboard();
}

// ========== LEADERBOARD ==========
/**
 * Load and display the leaderboard
 */
function loadLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    const weekEl = document.getElementById('lb-week');
    const currentUser = appState.currentUser;

    weekEl.textContent = appState.currentWeek;

    // Collect players with scores
    const players = [];
    Object.keys(playerData).forEach(username => {
        const data = playerData[username];
        players.push({
            name: username,
            score: data.score,
            status: data.scoreEntered ? 'Completed' : 'Pending',
            hasScore: data.score !== null,
        });
    });

    // Sort by score (ascending, lowest is best in golf)
    // Players without scores go to the bottom
    players.sort((a, b) => {
        if (!a.hasScore && !b.hasScore) return 0;
        if (!a.hasScore) return 1;
        if (!b.hasScore) return -1;
        return a.score - b.score;
    });

    // Build leaderboard HTML
    tbody.innerHTML = '';
    let rank = 1;

    players.forEach((player, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.className = 'rank';
        rankCell.textContent = rank;

        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;
        if (player.name === currentUser) {
            nameCell.style.fontWeight = 'bold';
            nameCell.textContent += ' (You)';
        }

        const scoreCell = document.createElement('td');
        scoreCell.textContent = player.hasScore ? player.score : '—';

        const statusCell = document.createElement('td');
        statusCell.className = player.status === 'Completed' ? 'status-complete' : 'status-pending';
        statusCell.textContent = player.status;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        row.appendChild(statusCell);

        tbody.appendChild(row);

        if (player.hasScore) {
            rank++;
        }
    });

    // Update user display
    updateUserDisplay('user-display-lb');
}

// ========== UTILITY FUNCTIONS ==========
/**
 * Disable scroll for body when modal is open
 */
function disableScroll() {
    document.body.style.overflow = 'hidden';
}

/**
 * Enable scroll for body
 */
function enableScroll() {
    document.body.style.overflow = 'auto';
}
