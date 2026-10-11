/**
 * modules/patientProfile.js - Comprehensive Patient Profile & Electronic Medical History
 */

export function renderPatientProfileDrawer(patientId) {
  const store = window.appStore;
  const patient = store.getPatientById(patientId);

  if (!patient) return null;

  const med = patient.medicalHistory || { conditions: [], allergies: [], habits: [], dentalHistory: '' };
  const hasAllergies = med.allergies && med.allergies.length > 0 && !med.allergies.includes("NKDA");
  const patientAppts = store.getAppointments().filter(a => a.patientId === patient.id);
  const patientPlans = store.getTreatmentPlans().filter(tp => tp.patientId === patient.id);
  const patientInvoices = store.getInvoices().filter(inv => inv.patientId === patient.id);

  const drawerContent = document.createElement('div');

  drawerContent.innerHTML = `
    <!-- Top Patient Banner -->
    <div class="profile-header-card">
      <div class="profile-big-avatar">
        ${patient.name.split(' ').map(n=>n[0]).join('')}
      </div>
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-size: 19px; font-weight: 800; color: var(--text-primary);">${patient.name}</h2>
          <span class="badge badge-active">${patient.status}</span>
        </div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">
          Patient ID: <strong style="font-family: var(--font-mono); color: var(--text-primary);">${patient.id}</strong> ·
          ${patient.age} yrs · ${patient.gender} · Blood: <strong>${patient.bloodGroup || 'O+'}</strong>
        </div>
        <div style="display: flex; gap: 14px; margin-top: 8px; font-size: 12px; color: var(--color-slate-600); align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 14px;">
            <span>📞 ${patient.phone}</span>
            <span>✉️ ${patient.email}</span>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-profile-send-sms" style="border-color: var(--teal-600); color: var(--teal-800); padding: 3px 10px; font-size: 11.5px;">
            📱 Send SMS
          </button>
        </div>
      </div>
    </div>

    <!-- Critical Medical Alert Banner -->
    ${hasAllergies ? `
      <div class="medical-alert-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <strong>CRITICAL CLINICAL ALERT:</strong> Known severe allergies documented:
          <span style="font-weight: 700; text-decoration: underline;">${med.allergies.join(', ')}</span>.
          Do not administer without dentist verification.
        </div>
      </div>
    ` : ''}

    <!-- Tabs inside Profile Drawer -->
    <div class="tabs-nav" id="profile-tabs">
      <button class="tab-btn active" data-tab="medical">Medical & Dental History</button>
      <button class="tab-btn" data-tab="appointments">Appointments (${patientAppts.length})</button>
      <button class="tab-btn" data-tab="plans">Treatment Plans (${patientPlans.length})</button>
      <button class="tab-btn" data-tab="billing">Invoices & Billing</button>
    </div>

    <!-- Tab 1: Medical & Dental History -->
    <div id="tab-content-medical" class="tab-pane active">
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <span class="card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Systemic Medical Conditions
          </span>
        </div>
        <div class="card-body">
          <div class="history-tags-group">
            ${med.conditions && med.conditions.length > 0 ?
              med.conditions.map(c => `<span class="condition-tag">${c}</span>`).join('') :
              '<span style="color:var(--text-muted); font-size:13px;">No systemic conditions reported.</span>'
            }
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <span class="card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Allergies (Drug & Material)
          </span>
        </div>
        <div class="card-body">
          <div class="history-tags-group">
            ${med.allergies && med.allergies.length > 0 ?
              med.allergies.map(a => `<span class="${a.includes('NKDA') ? 'condition-tag' : 'allergy-tag'}">⚠️ ${a}</span>`).join('') :
              '<span style="color:var(--text-muted); font-size:13px;">No known allergies (NKDA).</span>'
            }
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header">
          <span class="card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Dental Procedure History
          </span>
        </div>
        <div class="card-body">
          <p style="font-size: 13.5px; line-height: 1.6; color: var(--text-secondary);">
            ${med.dentalHistory || 'Routine restorative and hygiene care.'}
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Lifestyle, Habits & Emergency Contact</span>
        </div>
        <div class="card-body">
          <div class="profile-meta-grid">
            <div class="profile-meta-item">
              <span class="meta-key">Habits / Risk Factors</span>
              <span class="meta-val">${med.habits ? med.habits.join(', ') : 'None'}</span>
            </div>
            <div class="profile-meta-item">
              <span class="meta-key">Emergency Contact</span>
              <span class="meta-val">${patient.emergencyContact || 'None on file'}</span>
            </div>
            <div class="profile-meta-item">
              <span class="meta-key">Residential Address</span>
              <span class="meta-val">${patient.address || 'Austin, TX'}</span>
            </div>
            <div class="profile-meta-item">
              <span class="meta-key">Date of Birth</span>
              <span class="meta-val">${patient.dob} (${patient.age} years old)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Appointments -->
    <div id="tab-content-appointments" class="tab-pane" style="display: none;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
        <button class="btn btn-primary btn-sm" id="btn-profile-book-appt">
          + Schedule For This Patient
        </button>
      </div>
      <div class="timeline-list">
        ${patientAppts.length === 0 ? '<p style="color:var(--text-muted); padding:16px;">No appointments found.</p>' :
          patientAppts.map(a => `
            <div class="timeline-item">
              <span class="time-slot-badge">${a.date} · ${a.time}</span>
              <div>
                <div class="timeline-patient-name">${a.treatment}</div>
                <div class="timeline-patient-proc">${a.dentistName} · ${a.operatory}</div>
                ${a.notes ? `<div style="font-size: 11.5px; color: var(--color-slate-500); margin-top: 4px;">📝 ${a.notes}</div>` : ''}
              </div>
              <span class="badge badge-${a.status.toLowerCase().replace(' ', '-')}" style="margin-left: auto;">${a.status}</span>
            </div>
          `).join('')
        }
      </div>
    </div>

    <!-- Tab 3: Treatment Plans -->
    <div id="tab-content-plans" class="tab-pane" style="display: none;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
        <button class="btn btn-primary btn-sm" id="btn-profile-new-plan">
          + Create Treatment Plan
        </button>
      </div>
      ${patientPlans.length === 0 ? '<p style="color:var(--text-muted); padding:16px;">No treatment plans generated yet for this patient.</p>' :
        patientPlans.map(tp => `
          <div class="treatment-plan-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <div>
                <strong style="font-size: 14.5px; color: var(--text-primary);">${tp.title}</strong>
                <div style="font-size: 12px; color: var(--text-muted);">Provider: ${tp.dentistName} · Total: $${tp.totalCost}</div>
              </div>
              <span class="badge badge-confirmed">${tp.approvalStatus}</span>
            </div>
            ${tp.stages.map(st => `
              <div class="treatment-stage-item">
                <div>
                  <span style="font-weight: 700; font-size: 12.5px; color: var(--teal-800);">${st.stage}:</span>
                  <span style="font-size: 13px; color: var(--text-primary); margin-left: 6px;">${st.procedure}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-weight: 700; font-family: var(--font-mono);">$${st.cost}</span>
                  <span class="badge badge-${st.status.toLowerCase().replace(' ', '-')}">${st.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')
      }
    </div>

    <!-- Tab 4: Billing & Invoices -->
    <div id="tab-content-billing" class="tab-pane" style="display: none;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
        <button class="btn btn-primary btn-sm" id="btn-profile-new-invoice">
          + Generate New Invoice
        </button>
      </div>
      <table class="table-modern">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          ${patientInvoices.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">No invoices for this patient.</td></tr>' :
            patientInvoices.map(inv => `
              <tr style="cursor: pointer;" onclick="window.openInvoiceView('${inv.id}')">
                <td style="font-family: var(--font-mono); font-weight: 700;">${inv.id}</td>
                <td>${inv.date}</td>
                <td style="font-weight: 700;">$${inv.total}</td>
                <td><span class="badge badge-${inv.paymentStatus.toLowerCase().replace(' ', '-')}">${inv.paymentStatus}</span></td>
                <td>${inv.paymentMethod}</td>
              </tr>
            `).join('')
          }
        </tbody>
      </table>
    </div>
  `;

  // Attach tab switching events
  drawerContent.querySelectorAll('#profile-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      drawerContent.querySelectorAll('#profile-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      drawerContent.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const targetPane = drawerContent.querySelector(`#tab-content-${tabId}`);
      if (targetPane) targetPane.style.display = 'block';
    });
  });

  // Action buttons
  const btnAppt = drawerContent.querySelector('#btn-profile-book-appt');
  if (btnAppt) {
    btnAppt.addEventListener('click', () => {
      window.closeDrawer();
      window.openBookAppointmentModal(patient.id);
    });
  }

  const btnPlan = drawerContent.querySelector('#btn-profile-new-plan');
  if (btnPlan) {
    btnPlan.addEventListener('click', () => {
      window.closeDrawer();
      window.openNewTreatmentPlanModal(patient.id);
    });
  }

  const btnInv = drawerContent.querySelector('#btn-profile-new-invoice');
  if (btnInv) {
    btnInv.addEventListener('click', () => {
      window.closeDrawer();
      window.openNewInvoiceModal(patient.id);
    });
  }

  const btnSendSms = drawerContent.querySelector('#btn-profile-send-sms');
  if (btnSendSms) {
    btnSendSms.addEventListener('click', () => {
      window.openCommunicationsModal(patient.id, "SMS");
    });
  }

  return drawerContent;
}
