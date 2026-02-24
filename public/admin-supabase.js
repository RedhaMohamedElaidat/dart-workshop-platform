// ============================================
// ADMIN-SUPABASE.JS - Panneau d'administration
// ============================================

let allSubmissions = [];
let allUsers = [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Admin panel initializing...");
  initializeAdmin();
});

function initializeAdmin() {
  // Event listeners
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/';
  });
  
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  
  // Charger les données
  loadAllData();
}

// ============================================
// CHARGER TOUTES LES DONNÉES
// ============================================

async function loadAllData() {
  try {
    // Charger les utilisateurs
    await loadUsers();
    
    // Charger les soumissions
    await loadSubmissions();
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
    showError('Failed to load data. Please refresh the page.');
  }
}

async function loadUsers() {
  try {
    const { data, error } = await window.supabase
      .from('users')
      .select('*')
      .order('full_name');

    if (error) throw error;

    allUsers = data || [];
    
    // Remplir le filtre des étudiants
    const filterStudent = document.getElementById('filterStudent');
    allUsers.forEach(user => {
      const option = document.createElement('option');
      option.value = user.full_name;
      option.textContent = user.full_name;
      filterStudent.appendChild(option);
    });
    
    console.log(`✅ Loaded ${allUsers.length} users`);
    
  } catch (error) {
    console.error('❌ Error loading users:', error);
  }
}

async function loadSubmissions() {
  try {
    const { data, error } = await window.supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allSubmissions = data || [];
    console.log(`✅ Loaded ${allSubmissions.length} submissions`);
    
    // Afficher les soumissions
    displaySubmissions(allSubmissions);
    
  } catch (error) {
    console.error('❌ Error loading submissions:', error);
    showError('Failed to load submissions.');
  }
}

// ============================================
// AFFICHER LES SOUMISSIONS
// ============================================

function displaySubmissions(submissions) {
  const tbody = document.getElementById('submissionsTable');
  
  if (!submissions || submissions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">No submissions found</td>
      </tr>
    `;
    return;
  }

  let html = '';
  
  submissions.forEach(sub => {
    const date = new Date(sub.created_at).toLocaleString('fr-FR');
    const codePreview = sub.code_text.substring(0, 100) + (sub.code_text.length > 100 ? '...' : '');
    
    html += `
      <tr>
        <td><strong>${escapeHtml(sub.full_name)}</strong></td>
        <td><span class="activity-badge">Activity ${sub.activity_number}</span></td>
        <td>${date}</td>
        <td><code class="code-preview">${escapeHtml(codePreview)}</code></td>
        <td>
          <button class="btn btn-small btn-primary" onclick="viewCode(${sub.id}, '${escapeHtml(sub.full_name)}', ${sub.activity_number})">
            View Code
          </button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
}

// ============================================
// FILTRER LES SOUMISSIONS
// ============================================

function filterSubmissions() {
  const studentFilter = document.getElementById('filterStudent').value;
  const activityFilter = document.getElementById('filterActivity').value;
  
  let filtered = allSubmissions;
  
  if (studentFilter) {
    filtered = filtered.filter(sub => sub.full_name === studentFilter);
  }
  
  if (activityFilter) {
    filtered = filtered.filter(sub => sub.activity_number === parseInt(activityFilter));
  }
  
  displaySubmissions(filtered);
}

// ============================================
// VIEW CODE MODAL
// ============================================

function viewCode(id, studentName, activityNumber) {
  const submission = allSubmissions.find(s => s.id === id);
  
  if (submission) {
    document.getElementById('modalTitle').textContent = 
      `${studentName} - Activity ${activityNumber}`;
    document.getElementById('codeContent').textContent = submission.code_text;
    document.getElementById('codeModal').style.display = 'block';
  }
}

function closeCodeModal() {
  document.getElementById('codeModal').style.display = 'none';
}

// ============================================
// EXPORT CSV
// ============================================

function exportToCSV() {
  if (allSubmissions.length === 0) {
    alert('No data to export');
    return;
  }
  
  // Créer les en-têtes CSV
  const headers = ['Student Name', 'Activity', 'Submission Date', 'Code'];
  const csvRows = [];
  
  // Ajouter les en-têtes
  csvRows.push(headers.join(','));
  
  // Ajouter les données
  allSubmissions.forEach(sub => {
    const date = new Date(sub.created_at).toLocaleString('fr-FR');
    const code = sub.code_text.replace(/"/g, '""'); // Échapper les guillemets
    const row = [
      `"${sub.full_name}"`,
      sub.activity_number,
      `"${date}"`,
      `"${code}"`
    ];
    csvRows.push(row.join(','));
  });
  
  // Créer le fichier CSV
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  const tbody = document.getElementById('submissionsTable');
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center error">❌ ${message}</td>
    </tr>
  `;
}

// ============================================
// MODAL CLICK OUTSIDE
// ============================================

window.onclick = function(event) {
  const modal = document.getElementById('codeModal');
  if (event.target === modal) {
    closeCodeModal();
  }
};
