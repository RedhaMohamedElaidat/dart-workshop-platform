// ============================================
// APP-SUPABASE.JS - Frontend avec Supabase
// ============================================

// État global
let currentUser = null;
let allUsers = []; // Stocker tous les utilisateurs

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
  
  // Charger tous les utilisateurs au démarrage
  loadAllUsers();
}

// ============================================
// CHARGER TOUS LES UTILISATEURS
// ============================================

async function loadAllUsers() {
  try {
    console.log("📊 Chargement de tous les utilisateurs...");
    
    const { data, error } = await window.supabase
      .from('users')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error("❌ Erreur chargement utilisateurs:", error);
      return;
    }

    allUsers = data || [];
    console.log("✅ Tous les utilisateurs chargés:", allUsers);
    
    // Afficher le tableau des utilisateurs dans la console
    displayUsersTable(allUsers);
    
    return allUsers;
  } catch (err) {
    console.error('🔥 Erreur:', err);
  }
}

// ============================================
// AFFICHER TABLEAU DES UTILISATEURS
// ============================================

function displayUsersTable(users) {
  console.log("\n" + "=".repeat(80));
  console.log("📋 LISTE DES UTILISATEURS ENREGISTRÉS");
  console.log("=".repeat(80));
  
  if (!users || users.length === 0) {
    console.log("❌ Aucun utilisateur trouvé");
    return;
  }
  
  // En-tête du tableau
  console.log("| ID | Nom complet | Date de création |");
  console.log("-".repeat(50));
  
  // Afficher chaque utilisateur
  users.forEach(user => {
    const date = new Date(user.created_at).toLocaleString('fr-FR');
    console.log(`| ${user.id} | ${user.full_name} | ${date} |`);
  });
  
  console.log("=".repeat(80));
  console.log(`✅ Total: ${users.length} utilisateur(s)`);
  console.log("=".repeat(80) + "\n");
}

// ============================================
// RECHERCHER UTILISATEUR DANS LE TABLEAU LOCAL
// ============================================

function findUserInLocalArray(full_name) {
  console.log(`🔍 Recherche de "${full_name}" dans le tableau local...`);
  
  // Recherche exacte (case insensitive)
  const exactMatch = allUsers.find(user => 
    user.full_name.toLowerCase() === full_name.toLowerCase()
  );
  
  if (exactMatch) {
    console.log("✅ Correspondance exacte trouvée:", exactMatch);
    return exactMatch;
  }
  
  // Recherche approximative (contient)
  const similarMatches = allUsers.filter(user => 
    user.full_name.toLowerCase().includes(full_name.toLowerCase()) ||
    full_name.toLowerCase().includes(user.full_name.toLowerCase())
  );
  
  if (similarMatches.length > 0) {
    console.log("⚠️ Correspondances similaires trouvées:", similarMatches);
    return similarMatches[0]; // Retourner la première correspondance
  }
  
  console.log("❌ Aucune correspondance trouvée");
  return null;
}

// ============================================
// LOGIN
// ============================================

async function handleLogin(e) {
  e.preventDefault();

  console.log("==== LOGIN START ====");

  const input = document.getElementById('fullName');
  console.log("Input element:", input);

  if (!input) {
    console.error("❌ Input fullName not found in HTML");
    return;
  }

  const full_name = input.value.trim();
  const errorDiv = document.getElementById('loginError');

  console.log("Typed name:", full_name);

  if (!full_name) {
    errorDiv.textContent = 'Please enter your name';
    console.warn("❌ Empty name");
    return;
  }

  try {
    console.log("🔍 Testing connection to Supabase...");
    console.log("Supabase client available:", window.supabase);

    // Vérifier que le client Supabase est disponible
    if (!window.supabase) {
      console.error("❌ window.supabase is undefined");
      errorDiv.textContent = "Database connection error: Supabase client not initialized";
      return;
    }

    // Vérifier que la méthode from existe
    if (typeof window.supabase.from !== 'function') {
      console.error("❌ window.supabase.from is not a function", window.supabase);
      errorDiv.textContent = "Database connection error: Invalid Supabase client";
      return;
    }

    // TEST 1: SELECT ALL USERS (pour mettre à jour le tableau)
    console.log("📊 Récupération de tous les utilisateurs...");
    const { data: allUsersData, error: allError } = await window.supabase
      .from('users')
      .select('*')
      .order('full_name', { ascending: true });

    console.log("Tous les utilisateurs:", allUsersData);
    console.log("Erreur éventuelle:", allError);

    if (allError) {
      console.error("❌ Erreur:", allError);
      
      if (allError.code === '42P01') {
        errorDiv.textContent = "Table 'users' doesn't exist. Please create it in Supabase.";
      } else if (allError.message.includes('permission denied')) {
        errorDiv.textContent = "Permission denied. Check RLS policies.";
      } else if (allError.message.includes('JWT')) {
        errorDiv.textContent = "Invalid API key. Check your Supabase anon key.";
      } else {
        errorDiv.textContent = "Database error: " + allError.message;
      }
      return;
    }

    // Mettre à jour le tableau local
    allUsers = allUsersData || [];
    
    // Afficher le tableau des utilisateurs
    displayUsersTable(allUsers);

    // TEST 2: Vérifier si l'utilisateur existe
    console.log(`🔍 Vérification si "${full_name}" existe...`);
    
    // Méthode 1: Recherche dans le tableau local (rapide)
    const localUser = findUserInLocalArray(full_name);
    
    if (localUser) {
      console.log("✅ Utilisateur trouvé dans le tableau local:", localUser);
      
      // Vérification supplémentaire avec la base de données
      const { data: dbUser, error: dbError } = await window.supabase
        .from('users')
        .select('*')
        .eq('full_name', localUser.full_name)
        .single();

      if (dbError) {
        console.error("❌ Erreur vérification BD:", dbError);
      } else {
        console.log("✅ Vérification BD réussie:", dbUser);
        
        currentUser = dbUser.full_name;
        localStorage.setItem('dartUser', dbUser.full_name);
        errorDiv.textContent = '';
        
        console.log(`✅ Connexion réussie pour: ${dbUser.full_name}`);
        console.log(`📊 Statistiques: Utilisateur #${dbUser.id}, inscrit le ${new Date(dbUser.created_at).toLocaleString()}`);
        
        showDashboard();
        loadUserSubmissions();
      }
    } else {
      console.warn(`❌ Utilisateur "${full_name}" non trouvé`);
      
      // Afficher les suggestions
      const suggestions = allUsers.filter(user => 
        user.full_name.toLowerCase().includes(full_name.toLowerCase())
      );
      
      if (suggestions.length > 0) {
        console.log("💡 Utilisateurs similaires trouvés:");
        suggestions.forEach(s => console.log(`   - ${s.full_name}`));
        errorDiv.textContent = `Utilisateur non trouvé. Essayez: ${suggestions.map(s => s.full_name).join(', ')}`;
      } else {
        errorDiv.textContent = 'Accès refusé. Vous n\'êtes pas enregistré.';
      }
    }

  } catch (err) {
    console.error('🔥 Erreur inattendue:', err);
    errorDiv.textContent = 'Erreur de connexion: ' + err.message;
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
  document.getElementById('userGreeting').textContent = `Bienvenue, ${currentUser}!`;
}

// ============================================
// SOUMETTRE UNE ACTIVITÉ
// ============================================

async function submitActivity(activityNumber) {
  if (!currentUser) {
    alert('Veuillez vous connecter d\'abord');
    return;
  }

  const code = document.getElementById(`code${activityNumber}`).value.trim();
  const feedbackDiv = document.getElementById(`feedback${activityNumber}`);

  if (!code) {
    showFeedback(feedbackDiv, '❌ Le code ne peut pas être vide', 'error');
    return;
  }

  try {
    console.log(`📝 Soumission activité ${activityNumber} pour ${currentUser}`);
    
    if (!window.supabase || typeof window.supabase.from !== 'function') {
      throw new Error("Client Supabase non initialisé");
    }

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
      console.error("❌ Erreur soumission:", error);
      
      if (error.code === '42P01') {
        showFeedback(feedbackDiv, '❌ Table submissions n\'existe pas', 'error');
      } else {
        showFeedback(feedbackDiv, '❌ ' + error.message, 'error');
      }
      return;
    }

    console.log("✅ Soumission réussie:", data);
    showFeedback(feedbackDiv, '✅ Soumis avec succès!', 'success');

  } catch (err) {
    console.error('🔥 Erreur soumission:', err);
    showFeedback(feedbackDiv, '❌ Erreur: ' + err.message, 'error');
  }
}

// ============================================
// CHARGER LES SOUMISSIONS
// ============================================

async function loadUserSubmissions() {
  if (!currentUser) return;

  try {
    console.log(`📂 Chargement des soumissions pour ${currentUser}`);
    
    const { data, error } = await window.supabase
      .from('submissions')
      .select('*')
      .eq('full_name', currentUser);

    if (error) {
      console.error('❌ Erreur chargement:', error);
      return;
    }

    console.log("📂 Soumissions chargées:", data);

    if (data && data.length > 0) {
      data.forEach(submission => {
        const textarea = document.getElementById(`code${submission.activity_number}`);
        if (textarea) {
          textarea.value = submission.code_text;
          console.log(`✅ Activité ${submission.activity_number} chargée`);
        }
      });
    }

  } catch (err) {
    console.error('🔥 Erreur:', err);
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

// ============================================
// FONCTIONS UTILITAIRES (à utiliser dans la console)
// ============================================

// Pour afficher tous les utilisateurs dans la console
window.showAllUsers = function() {
  displayUsersTable(allUsers);
};

// Pour rechercher un utilisateur
window.searchUser = function(name) {
  return findUserInLocalArray(name);
};

// Pour recharger la liste des utilisateurs
window.reloadUsers = async function() {
  await loadAllUsers();
};

console.log("🚀 Fonctions disponibles dans la console:");
console.log("   - showAllUsers() : Afficher tous les utilisateurs");
console.log("   - searchUser('nom') : Rechercher un utilisateur");
console.log("   - reloadUsers() : Recharger la liste");
