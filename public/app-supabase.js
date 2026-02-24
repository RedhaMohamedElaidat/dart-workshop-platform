// ============================================
// APP.JS - Frontend avec Supabase (Sans Backend)
// ============================================

// État global
let currentUser = null;

// Initialiser l'app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Vérifier si l'utilisateur est connecté
  const savedUser = localStorage.getItem('dartUser');
  if (savedUser) {
    currentUser = savedUser;
    showDashboard();
    loadUserSubmissions();
  }

  // Event listeners
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// ============================================
// LOGIN
// ============================================

async function handleLogin(e) {
  e.preventDefault();
  const fullName = document.getElementById('fullName').value.trim();
  const errorDiv = document.getElementById('loginError');

  if (!fullName) {
    errorDiv.textContent = 'Please enter your name';
    return;
  }

  // Vérifier si l'utilisateur est autorisé
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('full_name', fullName)
      .single();

    if (error || !data) {
      errorDiv.textContent = 'Access denied. You are not registered.';
      return;
    }

    // Login réussi
    currentUser = fullName;
    localStorage.setItem('dartUser', fullName);
    errorDiv.textContent = '';
    showDashboard();
    loadUserSubmissions();

  } catch (err) {
    console.error('Login error:', err);
    errorDiv.textContent = 'Connection error. Please try again.';
  }
}

// ============================================
// LOGOUT
// ============================================

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('dartUser');

  // Vider les textareas
  document.getElementById('code1').value = '';
  document.getElementById('code2').value = '';
  document.getElementById('code3').value = '';

  showLoginScreen();
}

// ============================================
// NAVIGATION
// ============================================

function showLoginScreen() {
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('dashboardScreen').classList.remove('active');
}

function showDashboard() {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('dashboardScreen').classList.add('active');
  document.getElementById('userGreeting').textContent = `Welcome, ${currentUser}!`;
}

// ============================================
// SOUMETTRE UNE ACTIVITÉ
// ============================================

async function submitActivity(activityNumber) {
  if (!currentUser) {
    alert('Please login first');
    return;
  }

  const code = document.getElementById(`code${activityNumber}`).value.trim();
  const feedbackDiv = document.getElementById(`feedback${activityNumber}`);

  if (!code) {
    showFeedback(feedbackDiv, '❌ Code cannot be empty', 'error');
    return;
  }

  try {
    // Insérer ou mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('submissions')
      .upsert({
        full_name: currentUser,
        activity_number: activityNumber,
        code_text: code
      }, { onConflict: 'full_name,activity_number' });

    if (error) {
      showFeedback(feedbackDiv, '❌ ' + error.message, 'error');
      return;
    }

    showFeedback(feedbackDiv, '✅ Submitted successfully!', 'success');

  } catch (err) {
    console.error('Submit error:', err);
    showFeedback(feedbackDiv, '❌ Error submitting. Try again.', 'error');
  }
}

// ============================================
// CHARGER LES SOUMISSIONS DE L'UTILISATEUR
// ============================================

async function loadUserSubmissions() {
  if (!currentUser) return;

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('full_name', currentUser);

    if (error) {
      console.error('Load error:', error);
      return;
    }

    // Afficher les soumissions sauvegardées
    if (data) {
      data.forEach(submission => {
        const textarea = document.getElementById(`code${submission.activity_number}`);
        if (textarea) {
          textarea.value = submission.code_text;
        }
      });
    }

  } catch (err) {
    console.error('Load submissions error:', err);
  }
}

// ============================================
// HELPERS
// ============================================

function showFeedback(element, message, type) {
  element.textContent = message;
  element.className = `submission-feedback ${type}`;

  if (type === 'success') {
    setTimeout(() => {
      element.textContent = '';
      element.className = 'submission-feedback';
    }, 3000);
  }
}