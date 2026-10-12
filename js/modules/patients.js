/**
 * modules/patients.js - Patient Management CRM & Registration
 */

export function renderPatients() {
  const store = window.appStore;
  let searchTerm = '';
  let statusFilter = 'all';

  const container = document.createElement('div');
  container.className = 'patients-module-wrap';

  function renderList() {
    const allPatients = store.getPatients();
    let patients = allPatients.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.medicalHistory && p.medicalHistory.conditions && p.medicalHistory.conditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    container.innerHTML = `
      <div class="patients-toolbar">
        <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="patient-search-input" class="form-input" placeholder="Search patients by name, phone, or medical condition..." value="${searchTerm}">
          </div>

          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm ${statusFilter === 'all' ? 'active' : ''}" data-status="all">All (${allPatients.length})</button>
            <button class="btn btn-secondary btn-sm ${statusFilter === 'active' ? 'active' : ''}" data-status="active">Active</button>
          </div>
        </div>

        <button class="btn btn-primary" id="btn-add-patient">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Register New Patient
        </button>
      </div>

      <!-- Patients Table -->
      <div class="table-container">
        <table class="table-modern">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Contact Info</th>
              <th>Age / Gender</th>
              <th>Medical Alerts & Conditions</th>
              <th>Next Appt / Last Visit</th>
              <th>Balance</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${patients.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 36px; color: var(--text-muted);">
                  No patients found matching your search.
                </td>
              </tr>
            ` : patients.map(p => {
              const hasAllergies = p.medicalHistory && p.medicalHistory.allergies && !p.medicalHistory.allergies.includes("NKDA");
              const conditions = p.medicalHistory ? p.medicalHistory.conditions : [];

              return `
                <tr class="patient-row" data-patient-id="${p.id}">
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div class="user-avatar" style="width: 32px; height: 32px; font-size: 11px; background: var(--teal-800); border-color: var(--teal-600);">
                        ${p.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: var(--text-primary); font-size: 13.5px;">${p.name}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); font-family: var(--font-mono);">${p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 13px; font-weight: 500;">${p.phone}</div>
                    <div style="font-size: 12.5px; color: var(--text-secondary);">${p.email}</div>
                  </td>
                  <td>
                    <div style="font-size: 13px;">${p.age} yrs · ${p.gender}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Blood: ${p.bloodGroup || 'O+'}</div>
                  </td>
                  <td>
                    <div style="display: flex; flex-wrap: wrap; gap: 5px; max-width: 250px;">
                      ${hasAllergies ? `
                        <span class="badge badge-alert">
                          ⚠️ ${p.medicalHistory.allergies[0]}
                        </span>
                      ` : ''}
                      ${conditions.slice(0, 2).map(c => `
                        <span class="badge badge-scheduled">
                          ${c}
                        </span>
                      `).join('')}
                      ${!hasAllergies && conditions.length === 0 ? '<span style="color:var(--text-secondary); font-size:12.5px;">None reported</span>' : ''}
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 12.5px; font-weight: 600; color: var(--teal-800);">${p.nextAppointment || 'None'}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Last: ${p.lastVisit}</div>
                  </td>
                  <td>
                    <div style="font-weight: 700; font-family: var(--font-mono); color: ${p.balance === '$0.00' ? 'var(--emerald-700)' : 'var(--crimson-700)'};">
                      ${p.balance}
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-active">${p.status}</span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm btn-open-profile" data-patient-id="${p.id}" style="padding: 5px 10px;">
                      View Record
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const searchInput = container.querySelector('#patient-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderList();
        const inputNow = container.querySelector('#patient-search-input');
        if (inputNow) {
          inputNow.focus();
          inputNow.setSelectionRange(searchTerm.length, searchTerm.length);
        }
      });
    }

    // Patient row clicks
    container.querySelectorAll('.patient-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const patientId = row.getAttribute('data-patient-id');
        window.openPatientDrawer(patientId);
      });
    });

    // Button view profile
    container.querySelectorAll('.btn-open-profile').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const patientId = btn.getAttribute('data-patient-id');
        window.openPatientDrawer(patientId);
      });
    });

    // Add Patient button
    const btnAdd = container.querySelector('#btn-add-patient');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        window.openRegisterPatientModal();
      });
    }
  }

  renderList();
  return container;
}
