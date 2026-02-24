// ============================================
// APP.JS - Main Frontend Logic
// ============================================

// State management
const appState = {
  currentUser: null,
  submissions: {},
  isLoading: false
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Set up event listeners
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', handleLogin);

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('submit', handleLogout);
  logoutBtn.addEventListener('click', handleLogout);

  // Check if user is already logged in (session storage)
  const savedUser = sessionStorage.getItem('dartWorkshopUser');
  if (savedUser) {
    appState.currentUser = savedUser;
    showDashboard();
    loadUserSubmissions();
  }
}

// ============================================
// LOGIN HANDLER
// ============================================

async function handleLogin(e) {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const errorDiv = document.getElementById('loginError');

  // Clear error message
  errorDiv.classList.remove('show');
  errorDiv.textContent = '';

  if (!fullName) {
    showError('Please enter your full name', errorDiv);
    return;
  }

  appState.isLoading = true;
  const loginBtn = document.querySelector('.login-form button');
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName })
    });

    const data = await response.json();

    if (data.success) {
      // Save user session
      appState.currentUser = data.user;
      sessionStorage.setItem('dartWorkshopUser', data.user);
      sessionStorage.setItem('dartWorkshopToken', data.token);

      // Show dashboard
      showDashboard();
      loadUserSubmissions();
    } else {
      showError(data.message || 'Login failed', errorDiv);
    }
  } catch (err) {
    console.error('Login error:', err);
    showError('Network error. Please try again.', errorDiv);
  } finally {
    appState.isLoading = false;
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

// ============================================
// LOGOUT HANDLER
// ============================================

function handleLogout() {
  sessionStorage.removeItem('dartWorkshopUser');
  sessionStorage.removeItem('dartWorkshopToken');
  appState.currentUser = null;
  appState.submissions = {};

  // Clear textareas
  document.getElementById('code1').value = '';
  document.getElementById('code2').value = '';
  document.getElementById('code3').value = '';

  // Clear feedback
  ['feedback1', 'feedback2', 'feedback3'].forEach(id => {
    const feedback = document.getElementById(id);
    feedback.classList.remove('success', 'error');
    feedback.textContent = '';
  });

  // Reset login form
  document.getElementById('loginForm').reset();

  showLoginScreen();
}

// ============================================
// SCREEN NAVIGATION
// ============================================

function showLoginScreen() {
  const loginScreen = document.getElementById('loginScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');

  loginScreen.classList.add('active');
  dashboardScreen.classList.remove('active');
}

function showDashboard() {
  const loginScreen = document.getElementById('loginScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');

  loginScreen.classList.remove('active');
  dashboardScreen.classList.add('active');

  // Update user greeting
  const greeting = document.getElementById('userGreeting');
  greeting.textContent = `Welcome, ${appState.currentUser}!`;
}

// ============================================
// ACTIVITY SUBMISSION
// ============================================

async function submitActivity(activityNumber) {
  if (!appState.currentUser) {
    alert('Please login first');
    return;
  }

  const codeTextarea = document.getElementById(`code${activityNumber}`);
  const code = codeTextarea.value.trim();
  const feedbackDiv = document.getElementById(`feedback${activityNumber}`);

  // Clear feedback
  feedbackDiv.classList.remove('success', 'error');
  feedbackDiv.textContent = '';

  // Validate input
  if (!code) {
    showFeedback(feedbackDiv, 'Code cannot be empty', 'error');
    return;
  }

  if (code.length > 50000) {
    showFeedback(feedbackDiv, 'Code is too large (max 50KB)', 'error');
    return;
  }

  // Disable submit button
  const submitBtn = event.target;
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: appState.currentUser,
        activityNumber: activityNumber,
        code: code
      })
    });

    const data = await response.json();

    if (data.success) {
      showFeedback(feedbackDiv, '✓ Submitted successfully!', 'success');

      // Update local submission cache
      if (!appState.submissions[activityNumber]) {
        appState.submissions[activityNumber] = {};
      }
      appState.submissions[activityNumber].code = code;
      appState.submissions[activityNumber].timestamp = new Date().toISOString();
    } else {
      showFeedback(feedbackDiv, data.message || 'Submission failed', 'error');
    }
  } catch (err) {
    console.error('Submit error:', err);
    showFeedback(feedbackDiv, 'Network error. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// ============================================
// LOAD USER SUBMISSIONS
// ============================================

async function loadUserSubmissions() {
  if (!appState.currentUser) return;

  try {
    const response = await fetch(`/api/submissions/${encodeURIComponent(appState.currentUser)}`);
    const data = await response.json();

    if (data.success && data.submissions) {
      // Load submissions into form
      data.submissions.forEach(submission => {
        const actNum = submission.activity_number;
        const codeTextarea = document.getElementById(`code${actNum}`);
        if (codeTextarea) {
          codeTextarea.value = submission.code_text;
        }
      });

      // Store in app state
      appState.submissions = {};
      data.submissions.forEach(sub => {
        appState.submissions[sub.activity_number] = {
          code: sub.code_text,
          timestamp: sub.timestamp
        };
      });
    }
  } catch (err) {
    console.error('Load submissions error:', err);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function showError(message, element) {
  element.textContent = message;
  element.classList.add('show');
}

function showFeedback(element, message, type) {
  element.textContent = message;
  element.classList.add(type);

  // Auto-hide success message after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      element.classList.remove(type);
      element.textContent = '';
    }, 3000);
  }
}

// Keyboard shortcut to submit (Ctrl+Enter in any textarea)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.classList.contains('code-textarea')) {
      const activityNum = activeElement.id.replace('code', '');
      submitActivity(parseInt(activityNum));
    }
  }
});
