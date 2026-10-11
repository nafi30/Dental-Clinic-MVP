/**
 * modules/dentalChart.js - Interactive 32-Tooth Adult Odontogram / Dental Chart
 */

const TOOTH_NAMES = {
  1: "Maxillary Right 3rd Molar (Wisdom)",
  2: "Maxillary Right 2nd Molar",
  3: "Maxillary Right 1st Molar",
  4: "Maxillary Right 2nd Premolar",
  5: "Maxillary Right 1st Premolar",
  6: "Maxillary Right Canine",
  7: "Maxillary Right Lateral Incisor",
  8: "Maxillary Right Central Incisor",
  9: "Maxillary Left Central Incisor",
  10: "Maxillary Left Lateral Incisor",
  11: "Maxillary Left Canine",
  12: "Maxillary Left 1st Premolar",
  13: "Maxillary Left 2nd Premolar",
  14: "Maxillary Left 1st Molar",
  15: "Maxillary Left 2nd Molar",
  16: "Maxillary Left 3rd Molar (Wisdom)",
  17: "Mandibular Left 3rd Molar (Wisdom)",
  18: "Mandibular Left 2nd Molar",
  19: "Mandibular Left 1st Molar",
  20: "Mandibular Left 2nd Premolar",
  21: "Mandibular Left 1st Premolar",
  22: "Mandibular Left Canine",
  23: "Mandibular Left Lateral Incisor",
  24: "Mandibular Left Central Incisor",
  25: "Mandibular Right Central Incisor",
  26: "Mandibular Right Lateral Incisor",
  27: "Mandibular Right Canine",
  28: "Mandibular Right 1st Premolar",
  29: "Mandibular Right 2nd Premolar",
  30: "Mandibular Right 1st Molar",
  31: "Mandibular Right 2nd Molar",
  32: "Mandibular Right 3rd Molar (Wisdom)"
};

export function renderDentalChart() {
  const store = window.appStore;
  const patients = store.getPatients();
  let selectedPatientId = patients[0] ? patients[0].id : "P-1002";
  let selectedTooth = 14;

  const container = document.createElement('div');
  container.className = 'odontogram-wrap';

  function renderView() {
    const patient = store.getPatientById(selectedPatientId);
    const chart = store.getOdontogram(selectedPatientId);
    const toothStatuses = chart.toothStatuses || {};

    const currentStatus = toothStatuses[selectedTooth] || "Healthy";
    const currentToothName = TOOTH_NAMES[selectedTooth] || `Tooth #${selectedTooth}`;

    container.innerHTML = `
      <!-- Patient Selector & Legend Bar -->
      <div class="odontogram-patient-bar">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div>
            <label class="form-label" style="font-size: 11.5px; text-transform: uppercase;">Active Patient Chart</label>
            <select class="form-select" id="odontogram-patient-select" style="font-weight: 700; width: 240px;">
              ${patients.map(p => `
                <option value="${p.id}" ${p.id === selectedPatientId ? 'selected' : ''}>
                  ${p.name} (${p.id})
                </option>
              `).join('')}
            </select>
          </div>
          <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 16px;">
            <span>${patient ? `${patient.age} yrs · Blood: ${patient.bloodGroup || 'O+'}` : ''}</span>
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" id="btn-chart-view-profile">
            View Full Clinical Record →
          </button>
          <button class="btn btn-primary btn-sm" id="btn-save-chart">
            Save Chart Assessment
          </button>
        </div>
      </div>

      <!-- Color Status Legend -->
      <div class="tooth-status-legend">
        <span style="font-size: 11px; font-weight: 700; color: var(--color-slate-500); text-transform: uppercase; margin-right: 4px;">Status Legend:</span>
        <div class="legend-item"><span class="legend-swatch swatch-healthy"></span> Healthy</div>
        <div class="legend-item"><span class="legend-swatch swatch-decayed"></span> Decayed (Caries)</div>
        <div class="legend-item"><span class="legend-swatch swatch-crown"></span> Crown / Bridge</div>
        <div class="legend-item"><span class="legend-swatch swatch-implant"></span> Implant</div>
        <div class="legend-item"><span class="legend-swatch swatch-rootcanal"></span> Root Canal</div>
        <div class="legend-item"><span class="legend-swatch swatch-filling"></span> Composite Filling</div>
        <div class="legend-item"><span class="legend-swatch swatch-missing"></span> Missing</div>
      </div>

      <!-- Main Tooth Grid (Upper & Lower Arch) -->
      <div class="arch-container">
        <!-- Upper Arch (Maxillary 1-16) -->
        <div class="card" style="padding: 16px 20px;">
          <div class="arch-header">Maxillary Upper Arch (Teeth #1 – #16)</div>
          <div class="teeth-grid-row" style="margin-top: 12px;">
            ${Array.from({length: 16}, (_, i) => i + 1).map(num => renderToothCell(num, toothStatuses[num] || "Healthy", num === selectedTooth)).join('')}
          </div>
        </div>

        <!-- Lower Arch (Mandibular 17-32) -->
        <div class="card" style="padding: 16px 20px;">
          <div class="arch-header">Mandibular Lower Arch (Teeth #17 – #32)</div>
          <div class="teeth-grid-row" style="margin-top: 12px;">
            ${Array.from({length: 16}, (_, i) => i + 17).map(num => renderToothCell(num, toothStatuses[num] || "Healthy", num === selectedTooth)).join('')}
          </div>
        </div>
      </div>

      <!-- Tooth Inspector & Clinical Notes -->
      <div class="card" style="background: var(--bg-surface);">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            Selected Tooth Inspector: <span style="color: var(--teal-700); margin-left: 6px;">Tooth #${selectedTooth}</span>
          </div>
          <div class="card-subtitle">${currentToothName}</div>
        </div>

        <div class="card-body">
          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Tooth Status</label>
              <select class="form-select" id="selected-tooth-status">
                <option value="Healthy" ${currentStatus === 'Healthy' ? 'selected' : ''}>Healthy</option>
                <option value="Decayed" ${currentStatus === 'Decayed' ? 'selected' : ''}>Decayed (Active Caries)</option>
                <option value="Crown" ${currentStatus === 'Crown' ? 'selected' : ''}>Crown (Porcelain/Zirconia)</option>
                <option value="Implant" ${currentStatus === 'Implant' ? 'selected' : ''}>Implant (Titanium Post)</option>
                <option value="Root Canal" ${currentStatus === 'Root Canal' ? 'selected' : ''}>Endodontic (Root Canal)</option>
                <option value="Filling" ${currentStatus === 'Filling' ? 'selected' : ''}>Composite Filling</option>
                <option value="Missing" ${currentStatus === 'Missing' ? 'selected' : ''}>Missing / Extracted</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Involved Surfaces</label>
              <div style="display: flex; gap: 6px; margin-top: 4px;">
                <button class="btn btn-secondary btn-sm surface-toggle" data-surf="M">M</button>
                <button class="btn btn-secondary btn-sm surface-toggle active" data-surf="O" style="background:var(--teal-50); border-color:var(--teal-600); color:var(--teal-800);">O</button>
                <button class="btn btn-secondary btn-sm surface-toggle" data-surf="D">D</button>
                <button class="btn btn-secondary btn-sm surface-toggle" data-surf="B">B</button>
                <button class="btn btn-secondary btn-sm surface-toggle" data-surf="L">L</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Quick Clinical Tag</label>
              <div style="display: flex; gap: 6px; margin-top: 4px; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm quick-status-btn" data-status="Decayed">⚠️ Caries</button>
                <button class="btn btn-secondary btn-sm quick-status-btn" data-status="Crown">👑 Crown</button>
                <button class="btn btn-secondary btn-sm quick-status-btn" data-status="Healthy">✓ Healthy</button>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label class="form-label">Dentist Odontogram Notes for ${patient ? patient.name : 'Patient'}</label>
            <textarea class="form-textarea" id="odontogram-notes-input" rows="2">${chart.notes || ''}</textarea>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderToothCell(num, status, isSelected) {
    const statusClass = `status-${status.toLowerCase().replace(' ', '-')}`;
    const initials = {
      "Healthy": "",
      "Decayed": "C",
      "Missing": "X",
      "Crown": "Cr",
      "Root Canal": "RC",
      "Implant": "Imp",
      "Filling": "F"
    }[status] || "";

    return `
      <div class="tooth-cell ${statusClass} ${isSelected ? 'selected' : ''}" data-tooth="${num}">
        <span class="tooth-number">${num}</span>
        <div class="tooth-graphic">${initials}</div>
        <span class="tooth-status-label">${status}</span>
      </div>
    `;
  }

  function attachEvents() {
    // Patient select
    const patientSelect = container.querySelector('#odontogram-patient-select');
    if (patientSelect) {
      patientSelect.addEventListener('change', (e) => {
        selectedPatientId = e.target.value;
        renderView();
      });
    }

    // Tooth cell clicks
    container.querySelectorAll('.tooth-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        selectedTooth = parseInt(cell.getAttribute('data-tooth'));
        renderView();
      });
    });

    // Status change dropdown
    const statusSelect = container.querySelector('#selected-tooth-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        const notes = container.querySelector('#odontogram-notes-input').value;
        store.updateToothStatus(selectedPatientId, selectedTooth, newStatus, notes);
        renderView();
        window.showToast(`Updated Tooth #${selectedTooth} to ${newStatus}`, "success");
      });
    }

    // Quick status buttons
    container.querySelectorAll('.quick-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newStatus = btn.getAttribute('data-status');
        const notes = container.querySelector('#odontogram-notes-input').value;
        store.updateToothStatus(selectedPatientId, selectedTooth, newStatus, notes);
        renderView();
        window.showToast(`Updated Tooth #${selectedTooth} to ${newStatus}`, "success");
      });
    });

    // Save chart
    const btnSave = container.querySelector('#btn-save-chart');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const notes = container.querySelector('#odontogram-notes-input').value;
        const status = container.querySelector('#selected-tooth-status').value;
        store.updateToothStatus(selectedPatientId, selectedTooth, status, notes);
        window.showToast("Dental chart & clinical notes saved successfully.", "success");
      });
    }

    // View patient profile
    const btnProfile = container.querySelector('#btn-chart-view-profile');
    if (btnProfile) {
      btnProfile.addEventListener('click', () => {
        window.openPatientDrawer(selectedPatientId);
      });
    }
  }

  renderView();
  return container;
}
