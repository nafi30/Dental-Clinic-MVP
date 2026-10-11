/**
 * app.js - Main Application Orchestrator & View Switcher
 */

import { renderDashboard } from './modules/dashboard.js';
import { renderCalendar } from './modules/calendar.js';
import { renderPatients } from './modules/patients.js';
import { renderPatientProfileDrawer } from './modules/patientProfile.js';
import { renderTreatmentPlan } from './modules/treatmentPlan.js';
import { renderBilling, renderInvoicePreviewDrawer } from './modules/billing.js';
import { renderAiReceptionist, renderTranscriptModalContent } from './modules/aiReceptionist.js';
import { renderDentalChart } from './modules/dentalChart.js';
import { renderPrescriptions } from './modules/prescriptions.js';
import { renderFileManager } from './modules/fileManager.js';
import { renderInventory } from './modules/inventory.js';
import { renderReports } from './modules/reports.js';
import { renderSettings } from './modules/settings.js';
import { renderAuditLog } from './modules/auditLog.js';
import './callSimulator.js';

let currentRoute = 'dashboard';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupUserSwitcher();
  setupDemoReset();
  setupMobileMenu();
  renderCurrentRoute();

  // Subscribe to store updates to keep counters fresh
  window.appStore.subscribe(() => {
    updateNavCounters();
  });
  updateNavCounters();
});

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const route = item.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      }
    });
  });

  // Topbar Centerpiece CTA
  const topbarSimBtn = document.getElementById('topbar-btn-sim');
  if (topbarSimBtn) {
    topbarSimBtn.addEventListener('click', () => {
      window.triggerCallSimulation();
    });
  }
}

export function navigateTo(route) {
  currentRoute = route;

  // Update nav active classes
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-route') === route) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Close mobile sidebar if open
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }

  renderCurrentRoute();
}

window.navigateTo = navigateTo;

function renderCurrentRoute() {
  const contentArea = document.getElementById('main-content-area');
  const pageTitle = document.getElementById('page-title');
  const pageDesc = document.getElementById('page-description');

  contentArea.innerHTML = '';

  switch (currentRoute) {
    case 'dashboard':
      pageTitle.textContent = 'Practice Overview';
      pageDesc.textContent = 'Executive operational & financial command center';
      contentArea.appendChild(renderDashboard());
      break;

    case 'calendar':
      pageTitle.textContent = 'Multi-Provider Schedule';
      pageDesc.textContent = 'Real-time chair allocation across operatories and dentists';
      contentArea.appendChild(renderCalendar());
      break;

    case 'patients':
      pageTitle.textContent = 'Patients Directory & CRM';
      pageDesc.textContent = 'Complete patient demographics, alert tags, and clinical charts';
      contentArea.appendChild(renderPatients());
      break;

    case 'treatment-plans':
      pageTitle.textContent = 'Treatment Plans & Fee Catalog';
      pageDesc.textContent = 'Multi-stage restorative plans, insurance estimates & fee schedule';
      contentArea.appendChild(renderTreatmentPlan());
      break;

    case 'billing':
      pageTitle.textContent = 'Billing, Collections & Invoices';
      pageDesc.textContent = 'Patient statements, payments received, and copay balances';
      contentArea.appendChild(renderBilling());
      break;

    case 'ai-receptionist':
      pageTitle.textContent = 'AI Voice Receptionist (Module 14)';
      pageDesc.textContent = 'Automated after-hours & overflow recovery pipeline';
      contentArea.appendChild(renderAiReceptionist());
      break;

    // Phase 2 Interactive Screens
    case 'dental-chart':
      pageTitle.textContent = 'Dental Chart & Odontogram';
      pageDesc.textContent = 'Interactive 32-tooth adult dentition mapper, surface tags & clinical notes';
      contentArea.appendChild(renderDentalChart());
      break;

    case 'prescriptions':
      pageTitle.textContent = 'Prescription Generator & Rx Pad';
      pageDesc.textContent = 'Digital medication orders, allergy contraindication checks & printable scripts';
      contentArea.appendChild(renderPrescriptions());
      break;

    case 'files':
      pageTitle.textContent = 'X-Rays & Clinical Document Vault';
      pageDesc.textContent = 'Bitewing radiographs, panoramic surveys, CBCT 3D volume scans & consent forms';
      contentArea.appendChild(renderFileManager());
      break;

    case 'inventory':
      pageTitle.textContent = 'Clinical Supplies & Consumables Inventory';
      pageDesc.textContent = 'Stock level monitoring, automated low stock threshold alerts & supplier POs';
      contentArea.appendChild(renderInventory());
      break;

    case 'reports':
      pageTitle.textContent = 'Practice Analytics & Executive Reports';
      pageDesc.textContent = 'Financial production, collections efficiency, dentist chair utilization & recall rate';
      contentArea.appendChild(renderReports());
      break;

    case 'settings':
      pageTitle.textContent = 'Clinic Profile & Practice Settings';
      pageDesc.textContent = 'Practice address, operatory chair layouts, staff accounts & voice AI parameters';
      contentArea.appendChild(renderSettings());
      break;

    case 'audit-log':
      pageTitle.textContent = 'HIPAA Security & Clinical Audit Trail';
      pageDesc.textContent = 'Tamper-evident logs of chart views, payment collections, logins & AI automated events';
      contentArea.appendChild(renderAuditLog());
      break;

    default:
      contentArea.appendChild(renderDashboard());
      break;
  }

  // Scroll to top of content
  contentArea.scrollTop = 0;
}

window.rerenderCurrentView = renderCurrentRoute;

function updateNavCounters() {
  const store = window.appStore;
  const patientsCount = store.getPatients().length;
  const aiRecoveredCount = store.getAiMetrics().recoveredCalls;

  const patientBadge = document.getElementById('nav-patient-count');
  if (patientBadge) patientBadge.textContent = patientsCount;

  const aiBadge = document.getElementById('nav-ai-recovered-count');
  if (aiBadge) aiBadge.textContent = aiRecoveredCount;
}

// User Switcher & Demo Login Modal
function setupUserSwitcher() {
  const userCard = document.getElementById('sidebar-user-card');
  if (userCard) {
    userCard.addEventListener('click', () => {
      openUserSwitcherModal();
    });
  }
}

function openUserSwitcherModal() {
  const store = window.appStore;
  const currentUser = store.data.currentUser;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">Switch Demo Persona / Role</h3>
        <button class="modal-close-btn" id="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
          Demonstrate how the system looks and functions for different staff members:
        </p>

        <div class="demo-role-selector">
          ${store.data.users.map(u => `
            <div class="role-pill-btn ${u.id === currentUser.id ? 'selected' : ''}" data-user-key="${u.roleKey}">
              <div class="role-pill-avatar">${u.avatar}</div>
              <div class="role-pill-info">
                <div class="role-pill-name">${u.name}</div>
                <div class="role-pill-desc">${u.role}</div>
              </div>
              ${u.id === currentUser.id ? '<span style="color:var(--teal-700); font-weight:700;">✓ Active</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" id="btn-cancel-user">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#modal-close').addEventListener('click', close);
  modal.querySelector('#btn-cancel-user').addEventListener('click', close);

  modal.querySelectorAll('.role-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userKey = btn.getAttribute('data-user-key');
      store.setCurrentUser(userKey);

      // Update sidebar user display
      const updatedUser = store.data.currentUser;
      const avatarEl = document.getElementById('user-avatar-initials');
      const nameEl = document.getElementById('user-display-name');
      const roleEl = document.getElementById('user-display-role');

      if (avatarEl) avatarEl.textContent = updatedUser.avatar;
      if (nameEl) nameEl.textContent = updatedUser.name;
      if (roleEl) roleEl.textContent = updatedUser.role;

      window.showToast(`Switched persona to ${updatedUser.name} (${updatedUser.role})`, "success");
      close();
      renderCurrentRoute();
    });
  });
}

// Reset Demo Data
function setupDemoReset() {
  const btnReset = document.getElementById('btn-reset-demo-data');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm("Reset demo data back to clean starting state?")) {
        window.appStore.resetDemoData();
        window.showToast("Demo data reset to clean initial state.", "success");
        renderCurrentRoute();
      }
    });
  }
}

// Mobile sidebar toggler
function setupMobileMenu() {
  const btnMenu = document.getElementById('btn-mobile-menu');
  const sidebar = document.querySelector('.sidebar');
  if (btnMenu && sidebar) {
    btnMenu.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// Global Drawer Manager
window.openPatientDrawer = function(patientId) {
  const drawerOverlay = document.getElementById('app-drawer-overlay');
  const drawerBody = document.getElementById('app-drawer-body');
  const drawerTitle = document.getElementById('app-drawer-title');

  const content = renderPatientProfileDrawer(patientId);
  if (!content) return;

  drawerTitle.textContent = "Patient Clinical Record";
  drawerBody.innerHTML = '';
  drawerBody.appendChild(content);

  drawerOverlay.classList.add('active');
};

window.openInvoiceView = function(invoiceId) {
  const drawerOverlay = document.getElementById('app-drawer-overlay');
  const drawerBody = document.getElementById('app-drawer-body');
  const drawerTitle = document.getElementById('app-drawer-title');

  const content = renderInvoicePreviewDrawer(invoiceId);
  if (!content) return;

  drawerTitle.textContent = "Invoice & Statement Preview";
  drawerBody.innerHTML = '';
  drawerBody.appendChild(content);

  drawerOverlay.classList.add('active');
};

window.closeDrawer = function() {
  const drawerOverlay = document.getElementById('app-drawer-overlay');
  if (drawerOverlay) {
    drawerOverlay.classList.remove('active');
  }
};

const btnCloseDrawer = document.getElementById('btn-close-drawer');
if (btnCloseDrawer) {
  btnCloseDrawer.addEventListener('click', window.closeDrawer);
}

const drawerOverlay = document.getElementById('app-drawer-overlay');
if (drawerOverlay) {
  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) window.closeDrawer();
  });
}

// Global Transcript Modal
window.openTranscriptModal = function(callId) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  const content = renderTranscriptModalContent(callId);
  if (!content) return;

  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-header">
        <h3 class="modal-title">AI Receptionist Call Audio & Transcript</h3>
        <button class="modal-close-btn" id="btn-close-transcript">✕</button>
      </div>
      <div class="modal-body" id="transcript-body"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" id="btn-dismiss-transcript">Close</button>
      </div>
    </div>
  `;

  modal.querySelector('#transcript-body').appendChild(content);
  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#btn-close-transcript').addEventListener('click', close);
  modal.querySelector('#btn-dismiss-transcript').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
};

// Global Appointment Inspection Modal
window.openAppointmentModal = function(aptId) {
  const store = window.appStore;
  const apt = store.getAppointments().find(a => a.id === aptId);
  if (!apt) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">Appointment Details</h3>
        <button class="modal-close-btn" id="btn-close-apt">✕</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <h4 style="font-size: 17px; font-weight: 800; color: var(--text-primary);">${apt.patientName}</h4>
            <div style="font-size: 12.5px; color: var(--text-muted);">${apt.treatment}</div>
          </div>
          <span class="badge badge-${apt.status.toLowerCase().replace(' ', '-')}">${apt.status}</span>
        </div>

        <div class="profile-meta-grid" style="margin-top: 10px;">
          <div class="profile-meta-item">
            <span class="meta-key">Date & Time</span>
            <span class="meta-val">${apt.date} at ${apt.time} (${apt.duration})</span>
          </div>
          <div class="profile-meta-item">
            <span class="meta-key">Attending Dentist</span>
            <span class="meta-val">${apt.dentistName}</span>
          </div>
          <div class="profile-meta-item">
            <span class="meta-key">Operatory</span>
            <span class="meta-val">${apt.operatory}</span>
          </div>
          <div class="profile-meta-item">
            <span class="meta-key">Source</span>
            <span class="meta-val">${apt.isAiBooked ? '⚡ AI Receptionist Auto-Booked' : 'Front Desk Manual'}</span>
          </div>
        </div>

        <div style="margin-top: 18px; padding: 12px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 11.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Clinical / Reception Notes</div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
            ${apt.notes || 'No special notes recorded.'}
          </p>
        </div>

        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label">Update Appointment Status</label>
          <select class="form-select" id="select-apt-status">
            <option value="Confirmed" ${apt.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="In Progress" ${apt.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${apt.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${apt.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>
      <div class="modal-footer" style="justify-content: space-between;">
        <button class="btn btn-secondary btn-sm" id="btn-send-apt-sms" style="border-color: var(--teal-600); color: var(--teal-800);">
          📱 Send SMS Reminder
        </button>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" id="btn-inspect-patient-rec">Open Patient Record</button>
          <button class="btn btn-primary btn-sm" id="btn-save-apt-status">Save Status</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#btn-close-apt').addEventListener('click', close);

  modal.querySelector('#btn-send-apt-sms').addEventListener('click', () => {
    close();
    window.openCommunicationsModal(apt.patientId, "SMS", `Beacon Peak Dental: Hi ${apt.patientName.split(' ')[0]}, this is a reminder for your dental appointment scheduled for ${apt.date} at ${apt.time} in ${apt.operatory}. Reply C to confirm.`);
  });

  modal.querySelector('#btn-inspect-patient-rec').addEventListener('click', () => {
    close();
    window.openPatientDrawer(apt.patientId);
  });

  modal.querySelector('#btn-save-apt-status').addEventListener('click', () => {
    const newStatus = modal.querySelector('#select-apt-status').value;
    apt.status = newStatus;
    store.saveData();
    window.showToast(`Updated appointment status to ${newStatus}`, "success");
    close();
    renderCurrentRoute();
  });
};

// Global Book Appointment Modal
window.openBookAppointmentModal = function(preselectedPatientId) {
  const store = window.appStore;
  const patients = store.getPatients();
  const dentists = store.data.dentists;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">Schedule New Appointment</h3>
        <button class="modal-close-btn" id="btn-close-book">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Patient</label>
          <select class="form-select" id="book-patient-select">
            ${patients.map(p => `
              <option value="${p.id}" ${p.id === preselectedPatientId ? 'selected' : ''}>${p.name} (${p.id})</option>
            `).join('')}
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Dentist</label>
            <select class="form-select" id="book-dentist-select">
              ${dentists.map(d => `
                <option value="${d.id}" data-chair="${d.chair}">${d.name} (${d.chair.split(' ')[0]} ${d.chair.split(' ')[1]})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Duration</label>
            <select class="form-select" id="book-duration-select">
              <option value="30 min">30 minutes</option>
              <option value="45 min" selected>45 minutes</option>
              <option value="60 min">60 minutes</option>
              <option value="90 min">90 minutes</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" id="book-date" value="2026-10-12">
          </div>
          <div class="form-group">
            <label class="form-label">Time Slot</label>
            <select class="form-select" id="book-time-select">
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:30 PM">3:30 PM</option>
              <option value="4:00 PM">4:00 PM</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Procedure / Treatment</label>
          <input type="text" class="form-input" id="book-treatment" placeholder="e.g. Comprehensive Exam, Composite Filling #14" value="Dental Prophylaxis & Evaluation">
        </div>

        <div class="form-group">
          <label class="form-label">Clinical Notes</label>
          <textarea class="form-textarea" id="book-notes" rows="2" placeholder="Patient preferences, pre-medication, or allergies..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" id="btn-cancel-book">Cancel</button>
        <button class="btn btn-primary btn-sm" id="btn-confirm-book">Confirm Booking</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#btn-close-book').addEventListener('click', close);
  modal.querySelector('#btn-cancel-book').addEventListener('click', close);

  modal.querySelector('#btn-confirm-book').addEventListener('click', () => {
    const patientId = modal.querySelector('#book-patient-select').value;
    const patient = store.getPatientById(patientId);
    const dentistSelect = modal.querySelector('#book-dentist-select');
    const dentistId = dentistSelect.value;
    const dentist = dentists.find(d => d.id === dentistId);
    const date = modal.querySelector('#book-date').value;
    const time = modal.querySelector('#book-time-select').value;
    const duration = modal.querySelector('#book-duration-select').value;
    const treatment = modal.querySelector('#book-treatment').value;
    const notes = modal.querySelector('#book-notes').value;

    store.addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      dentistId: dentist.id,
      dentistName: dentist.name,
      operatory: dentist.chair,
      treatment: treatment || "Dental Evaluation",
      date: date,
      time: time,
      duration: duration,
      status: "Confirmed",
      isAiBooked: false,
      notes: notes
    });

    window.showToast(`Appointment scheduled for ${patient.name} on ${time}`, "success");
    close();
    renderCurrentRoute();
  });
};

// Global Register New Patient Modal with Real-Time Duplicate Patient Detection
window.openRegisterPatientModal = function() {
  const store = window.appStore;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-header">
        <h3 class="modal-title">Register New Clinic Patient</h3>
        <button class="modal-close-btn" id="btn-close-reg">✕</button>
      </div>
      <div class="modal-body">
        <!-- Real-Time Duplicate Warning Container -->
        <div id="duplicate-warning-container" style="display: none;"></div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="reg-name" placeholder="First and last name" required autocomplete="off">
          </div>
          <div class="form-group">
            <label class="form-label">Date of Birth *</label>
            <input type="date" class="form-input" id="reg-dob" value="1990-05-15">
          </div>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select class="form-select" id="reg-gender">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Blood Group</label>
            <select class="form-select" id="reg-blood">
              <option value="O+">O+</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input type="tel" class="form-input" id="reg-phone" placeholder="(512) 555-0199" autocomplete="off">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" id="reg-email" placeholder="patient@example.com" autocomplete="off">
          </div>
          <div class="form-group">
            <label class="form-label">Emergency Contact</label>
            <input type="text" class="form-input" id="reg-emergency" placeholder="Name & Phone">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Residential Address</label>
          <input type="text" class="form-input" id="reg-address" placeholder="Street, City, State ZIP" value="Austin, TX">
        </div>

        <div style="border-top: 1px solid var(--border-subtle); margin: 16px 0; padding-top: 12px;">
          <h4 style="font-size: 13.5px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Medical & Dental History</h4>

          <div class="form-group">
            <label class="form-label">Systemic Conditions (comma-separated)</label>
            <input type="text" class="form-input" id="reg-conditions" placeholder="e.g. Hypertension, Diabetes, Asthma">
          </div>

          <div class="form-group">
            <label class="form-label">Allergies (Drug & Material - critical)</label>
            <input type="text" class="form-input" id="reg-allergies" placeholder="e.g. Penicillin, Latex (or NKDA)" value="NKDA">
          </div>

          <div class="form-group">
            <label class="form-label">Dental History & Chief Concerns</label>
            <textarea class="form-textarea" id="reg-dental-history" rows="2" placeholder="Previous procedures, implants, or current issues..."></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" id="btn-cancel-reg">Cancel</button>
        <button class="btn btn-primary btn-sm" id="btn-save-patient">Create Patient Profile</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#btn-close-reg').addEventListener('click', close);
  modal.querySelector('#btn-cancel-reg').addEventListener('click', close);

  // Real-Time Duplicate Patient Detection
  const nameInput = modal.querySelector('#reg-name');
  const phoneInput = modal.querySelector('#reg-phone');
  const emailInput = modal.querySelector('#reg-email');
  const dupContainer = modal.querySelector('#duplicate-warning-container');

  const checkDuplicates = () => {
    const candidates = store.checkDuplicatePatient(nameInput.value, phoneInput.value, emailInput.value);
    if (candidates.length > 0) {
      const match = candidates[0];
      dupContainer.style.display = 'block';
      dupContainer.innerHTML = `
        <div class="duplicate-warning-box">
          <div class="duplicate-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Potential Duplicate Patient Record Detected</span>
          </div>
          <div class="duplicate-desc">
            Found existing record matching <strong>${match.name}</strong> (${match.id}) · Phone: ${match.phone} · Email: ${match.email}
          </div>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-view-dup-record" style="font-size: 11px; padding: 4px 10px; background:#FFF; border-color:var(--amber-400); color:var(--amber-800);">
              Open Existing Record (${match.id}) →
            </button>
            <span style="font-size: 11px; color: var(--text-muted); align-self: center;">or continue to register as new file</span>
          </div>
        </div>
      `;

      const btnViewDup = dupContainer.querySelector('#btn-view-dup-record');
      if (btnViewDup) {
        btnViewDup.addEventListener('click', () => {
          close();
          window.openPatientDrawer(match.id);
        });
      }
    } else {
      dupContainer.style.display = 'none';
      dupContainer.innerHTML = '';
    }
  };

  nameInput.addEventListener('input', checkDuplicates);
  phoneInput.addEventListener('input', checkDuplicates);
  emailInput.addEventListener('input', checkDuplicates);

  modal.querySelector('#btn-save-patient').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Please provide the patient's full name.");
      return;
    }

    const dob = modal.querySelector('#reg-dob').value;
    const phone = phoneInput.value || "(512) 555-0199";
    const email = emailInput.value || "patient@example.com";
    const gender = modal.querySelector('#reg-gender').value;
    const blood = modal.querySelector('#reg-blood').value;
    const emergency = modal.querySelector('#reg-emergency').value;
    const address = modal.querySelector('#reg-address').value;
    const conditionsStr = modal.querySelector('#reg-conditions').value;
    const allergiesStr = modal.querySelector('#reg-allergies').value;
    const dentalHist = modal.querySelector('#reg-dental-history').value;

    const conditions = conditionsStr ? conditionsStr.split(',').map(s=>s.trim()).filter(Boolean) : [];
    const allergies = allergiesStr ? allergiesStr.split(',').map(s=>s.trim()).filter(Boolean) : ["NKDA"];

    const birthYear = new Date(dob).getFullYear();
    const age = new Date().getFullYear() - birthYear;

    const newPatient = store.addPatient({
      name: name,
      age: isNaN(age) ? 35 : age,
      gender: gender,
      dob: dob,
      phone: phone,
      email: email,
      address: address,
      emergencyContact: emergency,
      bloodGroup: blood,
      medicalHistory: {
        conditions: conditions,
        allergies: allergies,
        habits: ["None"],
        dentalHistory: dentalHist || "New patient intake."
      },
      lastVisit: "New Registration",
      nextAppointment: "None"
    });

    window.showToast(`Registered new patient ${newPatient.name} (${newPatient.id})`, "success");
    close();
    renderCurrentRoute();
    setTimeout(() => {
      window.openPatientDrawer(newPatient.id);
    }, 200);
  });
};

// Global Interactive SMS & Email Communications Modal
window.openCommunicationsModal = function(patientId, type = "SMS", defaultMsg = "") {
  const store = window.appStore;
  const patient = store.getPatientById(patientId);
  if (!patient) return;

  const phoneNum = patient.phone;
  const initialMsg = defaultMsg || `Beacon Peak Dental: Hi ${patient.name.split(' ')[0]}, your appointment is confirmed for today at 10:00 AM in Chair 1. Reply C to confirm or call (512) 892-4400 with any questions.`;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  modal.innerHTML = `
    <div class="modal-dialog modal-md" style="max-width: 480px;">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <h3 class="modal-title">Simulated Outbound Patient SMS</h3>
        </div>
        <button class="modal-close-btn" id="btn-close-comm">✕</button>
      </div>

      <div class="modal-body" style="padding: 20px; background: #F1F5F9;">
        <!-- Smartphone Visualizer -->
        <div class="phone-preview-shell">
          <div class="phone-screen">
            <div class="phone-header">
              <span style="font-size: 11px; font-weight: 700; color: var(--color-slate-500);">9:41 AM</span>
              <span style="font-size: 11.5px; font-weight: 700; color: var(--color-slate-900);">${patient.name}</span>
              <span style="font-size: 10px; color: var(--color-slate-400);">5G</span>
            </div>

            <div class="sms-thread" id="phone-sms-thread">
              <div class="sms-bubble outbound">
                <div>${initialMsg}</div>
                <div class="sms-time">Now · Delivered ✓✓</div>
              </div>
            </div>

            <div style="padding: 8px 12px; background: #FFF; border-top: 1px solid var(--border-subtle); display: flex; gap: 6px;">
              <input type="text" id="phone-reply-input" class="form-input" style="font-size: 12px; padding: 6px 10px;" placeholder="Simulate patient reply (e.g. C)...">
              <button class="btn btn-primary btn-sm" id="btn-phone-reply" style="padding: 6px 10px;">Send</button>
            </div>
          </div>
        </div>

        <div style="margin-top: 16px; padding: 12px; background: #FFFFFF; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 12px; color: var(--text-secondary);">
          <div style="font-weight: 700; color: var(--teal-800); margin-bottom: 2px;">⚡ Live Twilio Medical Gateway Dispatch</div>
          <div>Destination: <strong>${phoneNum}</strong> · Latency: <strong>320ms</strong> · Status: <span style="color:var(--emerald-600); font-weight:700;">Delivered</span></div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" id="btn-dismiss-comm">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#btn-close-comm').addEventListener('click', close);
  modal.querySelector('#btn-dismiss-comm').addEventListener('click', close);

  // Send communication to store
  store.sendCommunication(patient.id, "SMS", initialMsg);

  // Simulate patient reply
  const replyInput = modal.querySelector('#phone-reply-input');
  const btnReply = modal.querySelector('#btn-phone-reply');
  const thread = modal.querySelector('#phone-sms-thread');

  btnReply.addEventListener('click', () => {
    const text = replyInput.value.trim();
    if (!text) return;

    const replyBubble = document.createElement('div');
    replyBubble.className = 'sms-bubble';
    replyBubble.innerHTML = `
      <div>${text}</div>
      <div class="sms-time" style="text-align: left;">Just now</div>
    `;
    thread.appendChild(replyBubble);
    replyInput.value = '';

    store.addAuditLog("Inbound Patient SMS Received", `Patient ${patient.name} replied: "${text}"`);
    window.showToast(`Incoming SMS from ${patient.name}: "${text}"`, "success");
  });
};

// Global New Invoice Modal
window.openNewInvoiceModal = function(preselectedPatientId) {
  const store = window.appStore;
  const patients = store.getPatients();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">Generate Patient Invoice</h3>
        <button class="modal-close-btn" id="btn-close-inv-modal">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Patient</label>
          <select class="form-select" id="inv-patient-select">
            ${patients.map(p => `
              <option value="${p.id}" ${p.id === preselectedPatientId ? 'selected' : ''}>${p.name} (${p.id})</option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Primary Procedure / Description</label>
          <input type="text" class="form-input" id="inv-desc" value="Composite Resin Filling & Evaluation">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Amount ($)</label>
            <input type="number" class="form-input" id="inv-amount" value="230">
          </div>
          <div class="form-group">
            <label class="form-label">Payment Status</label>
            <select class="form-select" id="inv-status">
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid" selected>Unpaid</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Payment Method</label>
          <select class="form-select" id="inv-method">
            <option value="Credit Card (Visa / Mastercard)">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Dental Insurance Copay">Insurance Copay</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" id="btn-cancel-inv">Cancel</button>
        <button class="btn btn-primary btn-sm" id="btn-create-inv-submit">Generate Statement</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#btn-close-inv-modal').addEventListener('click', close);
  modal.querySelector('#btn-cancel-inv').addEventListener('click', close);

  modal.querySelector('#btn-create-inv-submit').addEventListener('click', () => {
    const patientId = modal.querySelector('#inv-patient-select').value;
    const patient = store.getPatientById(patientId);
    const desc = modal.querySelector('#inv-desc').value;
    const amount = parseFloat(modal.querySelector('#inv-amount').value) || 100;
    const status = modal.querySelector('#inv-status').value;
    const method = modal.querySelector('#inv-method').value;

    const newInv = store.addInvoice({
      patientId: patient.id,
      patientName: patient.name,
      date: new Date().toISOString().split('T')[0],
      items: [
        { description: desc, quantity: 1, unitPrice: amount }
      ],
      subtotal: amount,
      discount: 0,
      tax: 0,
      total: amount,
      paymentStatus: status,
      paymentMethod: method
    });

    window.showToast(`Invoice ${newInv.id} created for ${patient.name}`, "success");
    close();
    renderCurrentRoute();
    setTimeout(() => {
      window.openInvoiceView(newInv.id);
    }, 200);
  });
};

// Global New Treatment Plan Modal
window.openNewTreatmentPlanModal = function(preselectedPatientId) {
  const store = window.appStore;
  const patients = store.getPatients();
  const dentists = store.data.dentists;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">Create Treatment Plan</h3>
        <button class="modal-close-btn" id="btn-close-tp-modal">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Patient</label>
          <select class="form-select" id="tp-patient-select">
            ${patients.map(p => `
              <option value="${p.id}" ${p.id === preselectedPatientId ? 'selected' : ''}>${p.name} (${p.id})</option>
            `).join('')}
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Attending Provider</label>
            <select class="form-select" id="tp-dentist-select">
              ${dentists.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Approval Status</label>
            <select class="form-select" id="tp-approval-select">
              <option value="Approved by Patient">Approved by Patient</option>
              <option value="Pending Insurance Pre-Auth">Pending Insurance Pre-Auth</option>
              <option value="Proposed to Patient">Proposed to Patient</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Treatment Plan Title</label>
          <input type="text" class="form-input" id="tp-title" value="Comprehensive Full-Mouth Restoration">
        </div>

        <div class="form-group">
          <label class="form-label">Stage 1 Procedure & Fee</label>
          <div class="form-row">
            <input type="text" class="form-input" id="tp-stage1-proc" value="Deep Periodontal Scaling Quad 1 & 2">
            <input type="number" class="form-input" id="tp-stage1-fee" value="290">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Stage 2 Procedure & Fee</label>
          <div class="form-row">
            <input type="text" class="form-input" id="tp-stage2-proc" value="Porcelain Zirconia Crown Tooth #19">
            <input type="number" class="form-input" id="tp-stage2-fee" value="1250">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" id="btn-cancel-tp">Cancel</button>
        <button class="btn btn-primary btn-sm" id="btn-save-tp-submit">Save Treatment Plan</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector('#btn-close-tp-modal').addEventListener('click', close);
  modal.querySelector('#btn-cancel-tp').addEventListener('click', close);

  modal.querySelector('#btn-save-tp-submit').addEventListener('click', () => {
    const patientId = modal.querySelector('#tp-patient-select').value;
    const patient = store.getPatientById(patientId);
    const dentistName = modal.querySelector('#tp-dentist-select').value;
    const approval = modal.querySelector('#tp-approval-select').value;
    const title = modal.querySelector('#tp-title').value;
    const p1 = modal.querySelector('#tp-stage1-proc').value;
    const f1 = parseFloat(modal.querySelector('#tp-stage1-fee').value) || 0;
    const p2 = modal.querySelector('#tp-stage2-proc').value;
    const f2 = parseFloat(modal.querySelector('#tp-stage2-fee').value) || 0;

    const newPlan = store.addTreatmentPlan({
      patientId: patient.id,
      patientName: patient.name,
      dentistName: dentistName,
      title: title,
      status: "Planned",
      totalCost: f1 + f2,
      approvalStatus: approval,
      stages: [
        { stage: "Stage 1", procedure: p1, status: "Planned", cost: f1 },
        { stage: "Stage 2", procedure: p2, status: "Planned", cost: f2 }
      ]
    });

    window.showToast(`Created treatment plan for ${patient.name}`, "success");
    close();
    renderCurrentRoute();
  });
};

// Global Toast Notifications
window.showToast = function(message, type = 'normal') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : (type === 'recovered' ? 'toast-recovered' : '')}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};
