// ============================================
// APP-SUPABASE.JS - Frontend avec Supabase
// ============================================

// État global
let currentUser = null;

// Initialiser l'app
document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 App initializing...");
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

  console.log("==== LOGIN START ====");

  const input = document.getElementById('fullName');
  const full_name = input.value.trim();
  const errorDiv = document.getElementById('loginError');

  console.log("Typed name:", full_name);

  if (!full_name) {
    errorDiv.textContent = 'Please enter your name';
    return;
  }

  try {
    console.log("🔍 Testing connection to Supabase...");

    // RECHERCHE DE L'UTILISATEUR
    console.log("🔍 Searching for user:", full_name);
    const { data, error } = await window.supabase
      .from('users')
      .select('*')
      .eq('full_name', full_name);

    console.log("User Query Data:", data);
    console.log("User Query Error:", error);

    if (error) {
      console.error("❌ Query error:", error);
      errorDiv.textContent = "Database error: " + error.message;
      return;
    }

    if (!data || data.length === 0) {
      console.warn("❌ User not found:", full_name);
      errorDiv.textContent = 'Access denied. You are not registered.';
      return;
    }

    console.log("✅ LOGIN SUCCESS for user:", data[0]);

    currentUser = full_name;
    localStorage.setItem('dartUser', full_name);
    errorDiv.textContent = '';
    showDashboard();
    loadUserSubmissions();

  } catch (err) {
    console.error('🔥 Unexpected Login Error:', err);
    errorDiv.textContent = 'Connection error: ' + err.message;
  }

  console.log("==== LOGIN END ====");
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
    console.log(`📝 Submitting activity ${activityNumber} for user ${currentUser}`);
    
    // Insérer ou mettre à jour dans Supabase
    const { data, error } = await window.supabase
      .from('submissions')
      .upsert(
        {
          full_name: currentUser,
          activity_number: activityNumber,
          code_text: code,
          submitted_at: new Date().toISOString()
        },
        { 
          onConflict: 'full_name,activity_number'
        }
      );

    if (error) {
      console.error("❌ Submit error:", error);
      showFeedback(feedbackDiv, '❌ ' + error.message, 'error');
      return;
    }

    console.log("✅ Submit success:", data);
    showFeedback(feedbackDiv, '✅ Submitted successfully!', 'success');

  } catch (err) {
    console.error('🔥 Submit error:', err);
    showFeedback(feedbackDiv, '❌ Error submitting: ' + err.message, 'error');
  }
}

// ============================================
// CHARGER LES SOUMISSIONS DE L'UTILISATEUR
// ============================================

async function loadUserSubmissions() {
  if (!currentUser) return;

  try {
    console.log(`📂 Loading submissions for user: ${currentUser}`);
    
    const { data, error } = await window.supabase
      .from('submissions')
      .select('*')
      .eq('full_name', currentUser);

    if (error) {
      console.error('❌ Load error:', error);
      return;
    }

    console.log("📂 Loaded submissions:", data);

    // Afficher les soumissions sauvegardées
    if (data && data.length > 0) {
      data.forEach(submission => {
        const textarea = document.getElementById(`code${submission.activity_number}`);
        if (textarea) {
          textarea.value = submission.code_text;
        }
      });
    }

  } catch (err) {
    console.error('🔥 Load submissions error:', err);
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
