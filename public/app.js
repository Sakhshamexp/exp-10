/**
 * Student Management System - Frontend JavaScript
 * Handles all CRUD operations using Fetch API
 */

// API Base URL
const API = '/api/students';

// State management
let editMode = false;
let currentEditId = null;

// DOM Elements
const studentForm = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const formMsg = document.getElementById('formMsg');
const tableBody = document.getElementById('tableBody');
const studentCount = document.getElementById('studentCount');
const spinner = document.getElementById('spinner');
const tableMessage = document.getElementById('tableMessage');
const toastContainer = document.getElementById('toastContainer');

// Input fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const courseInput = document.getElementById('course');
const editIdInput = document.getElementById('editId');

/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();
});

/**
 * Fetch all students from the API
 */
async function fetchStudents() {
  showSpinner(true);
  hideTableMessage();

  try {
    const response = await fetch(API);
    const result = await response.json();

    if (result.success) {
      renderTable(result.data);
      updateCount(result.data.length);
    } else {
      showTableMessage(result.error || 'Failed to fetch students');
    }
  } catch (error) {
    showTableMessage('Network error. Please check your connection.');
    console.error('Fetch error:', error);
  } finally {
    showSpinner(false);
  }
}

/**
 * Render the student table with data
 * @param {Array} students - Array of student objects
 */
function renderTable(students) {
  tableBody.innerHTML = '';

  if (!students || students.length === 0) {
    showTableMessage('No records found.');
    return;
  }

  students.forEach((student, index) => {
    const row = document.createElement('tr');
    
    const createdDate = new Date(student.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.course)}</td>
      <td>${createdDate}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-small btn-edit" onclick="enterEditMode('${student._id}')">✏️ Edit</button>
          <button class="btn btn-small btn-delete" onclick="deleteStudent('${student._id}', '${escapeHtml(student.name)}')">🗑️ Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * Update the student count badge
 * @param {number} count - Number of students
 */
function updateCount(count) {
  studentCount.textContent = count;
}

/**
 * Show spinner
 * @param {boolean} show - Whether to show the spinner
 */
function showSpinner(show) {
  if (show) {
    spinner.classList.add('visible');
  } else {
    spinner.classList.remove('visible');
  }
}

/**
 * Show message in table area
 * @param {string} message - Message to display
 */
function showTableMessage(message) {
  tableMessage.textContent = message;
  tableMessage.style.display = 'block';
}

/**
 * Hide table message
 */
function hideTableMessage() {
  tableMessage.style.display = 'none';
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Handle form submission for create/update
 * @param {Event} event - Form submit event
 */
async function createOrUpdateStudent(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const course = courseInput.value.trim();

  // Validate all fields
  if (!name || !email || !course) {
    showFormMessage('All fields are required', 'error');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage('Please enter a valid email address', 'error');
    return;
  }

  try {
    let response;
    let url = API;
    let method = 'POST';

    if (editMode && currentEditId) {
      url = `${API}/${currentEditId}`;
      method = 'PUT';
    }

    response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, course })
    });

    const result = await response.json();

    if (result.success) {
      if (editMode) {
        showFormMessage('Student updated successfully!', 'success');
      } else {
        showFormMessage('Student added successfully!', 'success');
      }
      clearForm();
      fetchStudents();
    } else {
      showFormMessage(result.error || 'An error occurred', 'error');
    }
  } catch (error) {
    showFormMessage('Network error. Please try again.', 'error');
    console.error('Submit error:', error);
  }
}

/**
 * Delete a student
 * @param {string} id - Student ID
 * @param {string} name - Student name
 */
async function deleteStudent(id, name) {
  const confirmed = confirm(`Are you sure you want to delete ${name}?`);
  
  if (!confirmed) return;

  try {
    const response = await fetch(`${API}/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      showToast('Deleted successfully', 'success');
      fetchStudents();
    } else {
      showToast(result.error || 'Failed to delete student', 'error');
    }
  } catch (error) {
    showToast('Network error. Please try again.', 'error');
    console.error('Delete error:', error);
  }
}

/**
 * Enter edit mode with student data
 * @param {string} id - Student ID
 */
async function enterEditMode(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();

    if (result.success) {
      const student = result.data;
      
      editMode = true;
      currentEditId = student._id;
      
      editIdInput.value = student._id;
      nameInput.value = student.name;
      emailInput.value = student.email;
      courseInput.value = student.course;
      
      formTitle.textContent = '✏️ Edit Student';
      submitBtn.textContent = 'Update Student';
      
      // Scroll to form
      document.querySelector('.form-card').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      showToast(result.error || 'Failed to fetch student', 'error');
    }
  } catch (error) {
    showToast('Network error. Please try again.', 'error');
    console.error('Edit fetch error:', error);
  }
}

/**
 * Clear the form and reset edit mode
 */
function clearForm() {
  studentForm.reset();
  
  editMode = false;
  currentEditId = null;
  editIdInput.value = '';
  
  formTitle.textContent = 'Add New Student';
  submitBtn.textContent = 'Add Student';
  
  hideFormMessage();
}

/**
 * Show form message
 * @param {string} message - Message to display
 * @param {string} type - Message type (success/error)
 */
function showFormMessage(message, type) {
  formMsg.textContent = message;
  formMsg.className = 'form-message ' + type;
  
  // Auto-clear after 3 seconds
  setTimeout(() => {
    hideFormMessage();
  }, 3000);
}

/**
 * Hide form message
 */
function hideFormMessage() {
  formMsg.textContent = '';
  formMsg.className = 'form-message';
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Message type (success/error)
 */
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Auto-dismiss after 2.5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

// Event Listeners
studentForm.addEventListener('submit', createOrUpdateStudent);
clearBtn.addEventListener('click', clearForm);
refreshBtn.addEventListener('click', fetchStudents);