// ============================================
// ADMIN.JS - Admin Panel avec Supabase
// ============================================

let allSubmissions = [];
let filteredSubmissions = [];

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/';
  });

  document.getElementById('exportBtn').addEventListener('click', exportToCSV);

  loadAllSubmissions();
});

// ============================================
// CHARGER TOUTES LES SOUMISSIONS
// ============================================

async function loadAllSubmissions() {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('full_name', { ascending: true })
      .order('activity_number', { ascending: true });

    if (error) {
      document.getElementById('submissionsTable').innerHTML = `
        <tr>
          <td colspan="5" class="text-center error">
            ${error.message}
          </td>
        </tr>
      `;
      return;
    }

    allSubmissions = data || [];
    filteredSubmissions = [...allSubmissions];
    populateFilters();
    displaySubmissions();

  } catch (err) {
    console.error('Load error:', err);
    document.getElementById('submissionsTable').innerHTML = `
      <tr>
        <td colspan="5" class="text-center error">
          Connection error
        </td>
      </tr>
    `;
  }
}

// ============================================
// REMPLIR LES FILTRES
// ============================================

function populateFilters() {
  const studentFilter = document.getElementById('filterStudent');
  const uniqueStudents = [...new Set(allSubmissions.map(s => s.full_name))];

  uniqueStudents.forEach(student => {
    const option = document.createElement('option');
    option.value = student;
    option.textContent = student;
    studentFilter.appendChild(option);
  });
}

// ============================================
// FILTRER LES SOUMISSIONS
// ============================================

function filterSubmissions() {
  const studentFilter = document.getElementById('filterStudent').value;
  const activityFilter = document.getElementById('filterActivity').value;

  filteredSubmissions = allSubmissions.filter(submission => {
    const studentMatch = !studentFilter || submission.full_name === studentFilter;
    const activityMatch = !activityFilter || submission.activity_number.toString() === activityFilter;
    return studentMatch && activityMatch;
  });

  displaySubmissions();
}

// ============================================
// AFFICHER LES SOUMISSIONS
// ============================================

function displaySubmissions() {
  const tbody = document.getElementById('submissionsTable');

  if (filteredSubmissions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">No submissions found</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredSubmissions.map(submission => `
    <tr>
      <td>${submission.full_name}</td>
      <td class="activity-num">Activity #${submission.activity_number}</td>
      <td>${new Date(submission.created_at).toLocaleString()}</td>
      <td class="code-preview">${getCodePreview(submission.code_text)}</td>
      <td>
        <button class="btn btn-small btn-primary" onclick="viewCode('${escapeHtml(submission.full_name)}', ${submission.activity_number}, '${escapeHtml(submission.code_text)}')">
          View Code
        </button>
      </td>
    </tr>
  `).join('');
}

// ============================================
// VOIR LE CODE
// ============================================

function viewCode(studentName, activityNum, code) {
  document.getElementById('modalTitle').textContent = `${studentName} - Activity #${activityNum}`;
  document.getElementById('codeContent').textContent = code;
  document.getElementById('codeModal').classList.add('active');
}

function closeCodeModal() {
  document.getElementById('codeModal').classList.remove('active');
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('codeModal');
  if (e.target === modal) {
    closeCodeModal();
  }
});

// ============================================
// EXPORTER EN CSV
// ============================================

function exportToCSV() {
  if (filteredSubmissions.length === 0) {
    alert('No submissions to export');
    return;
  }

  let csv = 'Student Name,Activity Number,Submission Date,Code\n';

  filteredSubmissions.forEach(submission => {
    const studentName = submission.full_name.replace(/,/g, '');
    const date = new Date(submission.created_at).toLocaleString().replace(/,/g, '');
    const code = submission.code_text.replace(/"/g, '""').replace(/\n/g, ' ');

    csv += `"${studentName}","${submission.activity_number}","${date}","${code}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dart_submissions_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// ============================================
// HELPERS
// ============================================

function getCodePreview(code) {
  const preview = code.substring(0, 50).replace(/\n/g, ' ');
  return preview + (code.length > 50 ? '...' : '');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}