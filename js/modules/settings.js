/**
 * modules/settings.js - Clinic Profile, Operatory Layout, Staff & AI Configuration
 */

export function renderSettings() {
  const store = window.appStore;
  const settings = store.getSettings();
  const users = store.data.users;

  const container = document.createElement('div');
  container.className = 'settings-module-wrap';

  container.innerHTML = `
    <div class="patients-toolbar">
      <div>
        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Clinic Profile & Operatory Configuration</h2>
        <p style="font-size: 12.5px; color: var(--text-muted);">Manage clinic locations, doctor operatory assignments, staff accounts & voice AI parameters</p>
      </div>

      <button class="btn btn-primary" id="btn-save-settings">
        Save Settings
      </button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Practice Profile -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Practice Identification & Legal Registration
          </div>
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Clinic Commercial Name</label>
              <input type="text" class="form-input" id="setting-name" value="${settings.clinicName || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Main Reception Phone</label>
              <input type="text" class="form-input" id="setting-phone" value="${settings.phone || ''}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Physical Address</label>
              <input type="text" class="form-input" id="setting-address" value="${settings.address || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Operating Schedule</label>
              <input type="text" class="form-input" id="setting-hours" value="${settings.operatingHours || ''}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Federal Tax ID (EIN)</label>
              <input type="text" class="form-input" id="setting-taxid" value="${settings.taxId || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">National Provider Identifier (NPI)</label>
              <input type="text" class="form-input" id="setting-npi" value="${settings.npi || ''}">
            </div>
          </div>
        </div>
      </div>

      <!-- Operatory Layout -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Operatory Chairs & Clinical Layout
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <table class="table-modern">
            <thead>
              <tr>
                <th>Operatory Chair</th>
                <th>Primary Attending Dentist</th>
                <th>Clinical Specialty / Focus</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(settings.operatories || []).map(op => `
                <tr>
                  <td><strong style="color: var(--text-primary);">${op.name}</strong></td>
                  <td style="font-weight: 600; color: var(--teal-800);">${op.primaryDoctor}</td>
                  <td>${op.type}</td>
                  <td><span class="badge badge-confirmed">Active & Equipped</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Staff Accounts Overview -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Staff Accounts & Access Credentials
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <table class="table-modern">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Assigned Role</th>
                <th>Email Address</th>
                <th>Security Role Key</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div class="user-avatar" style="width: 28px; height: 28px; font-size: 11px;">${u.avatar}</div>
                      <strong style="color: var(--text-primary);">${u.name}</strong>
                    </div>
                  </td>
                  <td>${u.role}</td>
                  <td>${u.email}</td>
                  <td><span class="badge badge-teal">${u.roleKey}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- AI Receptionist Voice Parameters -->
      <div class="card" style="border: 1px solid var(--border-subtle);">
        <div class="card-header" style="background: var(--bg-surface-subtle);">
          <div class="card-title" style="color: var(--teal-900);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Aesora AI Voice Agent Configuration
          </div>
          <span class="badge badge-recovered">Live & Active</span>
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Call Answering Latency</label>
              <input type="text" class="form-input" id="setting-ai-delay" value="${(settings.aiReceptionistConfig && settings.aiReceptionistConfig.answerDelay) || '2 rings (< 1.2s)'}">
            </div>
            <div class="form-group">
              <label class="form-label">Voice Persona & Demeanor</label>
              <input type="text" class="form-input" id="setting-ai-tone" value="${(settings.aiReceptionistConfig && settings.aiReceptionistConfig.voiceTone) || 'Empathetic, Clinical, Conversational'}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Triage & Priority Detection</label>
              <input type="text" class="form-input" id="setting-ai-triage" value="${(settings.aiReceptionistConfig && settings.aiReceptionistConfig.triageMode) || 'Real-time Emergency CDT-Code Mapping'}">
            </div>
            <div class="form-group">
              <label class="form-label">Escalation Mobile Number</label>
              <input type="text" class="form-input" id="setting-ai-escalation" value="${(settings.aiReceptionistConfig && settings.aiReceptionistConfig.emergencyEscalationPhone) || '+1 (512) 555-0199'}">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Save button with Role Permissions Enforcement
  const btnSave = container.querySelector('#btn-save-settings');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      if (!store.hasPermission('edit_settings')) {
        alert(`Access Restricted: Modifying practice corporate information, operatory configurations, and AI gateway settings requires Practice Owner / Administrator privileges. Please switch persona to Dr. Alexander Vance in the sidebar.`);
        return;
      }

      const name = container.querySelector('#setting-name').value;
      const phone = container.querySelector('#setting-phone').value;
      const address = container.querySelector('#setting-address').value;
      const hours = container.querySelector('#setting-hours').value;
      const taxId = container.querySelector('#setting-taxid').value;
      const npi = container.querySelector('#setting-npi').value;
      const delay = container.querySelector('#setting-ai-delay').value;
      const tone = container.querySelector('#setting-ai-tone').value;
      const triage = container.querySelector('#setting-ai-triage').value;
      const escalation = container.querySelector('#setting-ai-escalation').value;

      store.saveSettings({
        clinicName: name,
        phone: phone,
        address: address,
        operatingHours: hours,
        taxId: taxId,
        npi: npi,
        aiReceptionistConfig: {
          answerDelay: delay,
          voiceTone: tone,
          triageMode: triage,
          emergencyEscalationPhone: escalation
        }
      });

      window.showToast("Clinic settings and AI parameters saved successfully.", "success");
    });
  }

  return container;
}
