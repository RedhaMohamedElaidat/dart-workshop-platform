// ============================================
// ADMIN.JS - Admin Panel Logic
// ============================================

// Admin state
const adminState = {
  allSubmissions: [],
  filteredSubmissions: [],
  adminToken: 'admin_dart_workshop_2024'
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
  initializeAdmin();
});

function initializeAdmin() {
  // Load submissions
  loadAllSubmissions();

  // Set up event listeners
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/';
  });

  document.getElementById('exportBtn').addEventListener('click', exportToCSV);

  // Check token in URL (optional: for direct admin access)
  const params = new URLSearchParams(window.location.search);
  if (!params.has('token') && !sessionStorage.getItem('adminToken')) {
    // Could add password protection here
    // For now, admin panel is publicly accessible but token-gated at API level
  }
}

// ============================================
// LOAD ALL SUBMISSIONS
// ============================================

async function loadAllSubmissions() {
  try {
    const response = await fetch('/api/admin/submissions', {
      method: 'GET',
      headers: {
        'x-admin-token': adminState.adminToken
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      adminState.allSubmissions = data.submissions || [];
      adminState.filteredSubmissions = [...adminState.allSubmissions];

      // Populate student filter dropdown
      populateStudentFilter();

      // Display submissions
      displaySubmissions();
    } else {
      showError('Failed to load submissions: ' + data.message);
    }
  } catch (err) {
    console.error('Load submissions error:', err);
    showError('Error loading submissions. Please refresh the page.');
  }
}

// ============================================
// POPULATE STUDENT FILTER
// ============================================

function populateStudentFilter() {
  const filterSelect = document.getElementById('filterStudent');
  const students = [...new Set(adminState.allSubmissions.map(s => s.full_name))];
  students.sort();

  students.forEach(student => {
    if (!filterSelect.querySelector(`option[value="${student}"]`)) {
      const option = document.createElement('option');
      option.value = student;
      option.textContent = student;
      filterSelect.appendChild(option);
    }
  });
}

// ============================================
// FILTER SUBMISSIONS
// ============================================

function filterSubmissions() {
  const studentFilter = document.getElementById('filterStudent').value;
  const activityFilter = document.getElementById('filterActivity').value;

  adminState.filteredSubmissions = adminState.allSubmissions.filter(submission => {
    const matchStudent = !studentFilter || submission.full_name === studentFilter;
    const matchActivity = !activityFilter || submission.activity_number.toString() === activityFilter;
    return matchStudent && matchActivity;
  });

  displaySubmissions();
}

// ============================================
// DISPLAY SUBMISSIONS TABLE
// ============================================

function displaySubmissions() {
  const tbody = document.getElementById('submissionsTable');
  tbody.innerHTML = '';

  if (adminState.filteredSubmissions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center no-data">
          No submissions found
        </td>
      </tr>
    `;
    return;
  }

  adminState.filteredSubmissions.forEach((submission, index) => {
    const row = document.createElement('tr');
    const timestamp = new Date(submission.timestamp);
    const formattedDate = timestamp.toLocaleString();
    const codePreview = submission.code_text.substring(0, 50).replace(/\n/g, ' ') + 
                        (submission.code_text.length > 50 ? '...' : '');

    row.innerHTML = `
      <td><strong>${submission.full_name}</strong></td>
      <td>
        <span class="activity-badge">#${submission.activity_number}</span>
      </td>
      <td>${formattedDate}</td>
      <td>
        <code class="code-preview">${escapeHtml(codePreview)}</code>
      </td>
      <td>
        <button class="btn btn-primary" onclick="viewCode('${index}', ${submission.activity_number})">
          View
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ============================================
// VIEW CODE MODAL
// ============================================

function viewCode(index, activityNum) {
  const submission = adminState.filteredSubmissions[index];
  const modal = document.getElementById('codeModal');
  const modalTitle = document.getElementById('modalTitle');
  const codeContent = document.getElementById('codeContent');

  modalTitle.textContent = `${submission.full_name} - Activity #${activityNum}`;
  codeContent.textContent = submission.code_text;

  modal.classList.add('show');
}

function closeCodeModal() {
  const modal = document.getElementById('codeModal');
  modal.classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('codeModal');
  if (e.target === modal) {
    closeCodeModal();
  }
});

// ============================================
// EXPORT TO CSV
// ============================================

function exportToCSV() {
  if (adminState.filteredSubmissions.length === 0) {
    alert('No submissions to export');
    return;
  }

  const headers = ['Student Name', 'Activity #', 'Submission Date', 'Code'];
  const rows = adminState.filteredSubmissions.map(sub => [
    sub.full_name,
    `Activity ${sub.activity_number}`,
    new Date(sub.timestamp).toLocaleString(),
    sub.code_text
  ]);

  // Escape quotes in code
  rows.forEach(row => {
    row[3] = `"${row[3].replace(/"/g, '""')}"`;
  });

  // Create CSV content
  let csv = headers.map(h => `"${h}"`).join(',') + '\n';
  csv += rows.map(row => row.join(',')).join('\n');

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `dart-submissions-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

function showError(message) {
  const tbody = document.getElementById('submissionsTable');
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center">
        <div style="color: #fca5a5; padding: 20px;">
          ⚠️ ${escapeHtml(message)}
        </div>
      </td>
    </tr>
  `;
}

// Keyboard shortcut to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCodeModal();
  }
});
