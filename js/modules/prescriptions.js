/**
 * modules/prescriptions.js - Prescription Generator & Printable Prescription Pad
 */

const MEDICATION_TEMPLATES = [
  {
    name: "Amoxicillin 500mg Capsule",
    dosage: "500 mg",
    sig: "Take 1 capsule by mouth three times daily (every 8 hours) with food until finished.",
    quantity: "21 capsules",
    indication: "Dental infection prophylaxis / restorative surgery"
  },
  {
    name: "Clindamycin 300mg Capsule (Penicillin-Allergic Alternative)",
    dosage: "300 mg",
    sig: "Take 1 capsule by mouth every 6 hours with a full glass of water for 7 days.",
    quantity: "28 capsules",
    indication: "Severe odontogenic infection in Penicillin-allergic patients"
  },
  {
    name: "Ibuprofen 600mg Tablet",
    dosage: "600 mg",
    sig: "Take 1 tablet by mouth every 6 hours as needed for dental pain or swelling.",
    quantity: "20 tablets",
    indication: "Post-operative inflammatory analgesia"
  },
  {
    name: "Chlorhexidine Gluconate 0.12% Oral Rinse",
    dosage: "0.12% Liquid",
    sig: "Swish 15 mL (1 tablespoon) in mouth for 30 seconds twice daily after brushing and expectorate.",
    quantity: "473 mL (1 Pint)",
    indication: "Periodontal tissue irrigation & gingivitis therapy"
  },
  {
    name: "Acetaminophen 500mg / Codeine 30mg (#3)",
    dosage: "300mg / 30mg",
    sig: "Take 1 to 2 tablets by mouth every 4 to 6 hours as needed for acute pain.",
    quantity: "12 tablets",
    indication: "Post-surgical palliative pain management (Schedule III)"
  }
];

export function renderPrescriptions() {
  const store = window.appStore;
  const patients = store.getPatients();
  const dentists = store.data.dentists;
  const prescriptions = store.getPrescriptions();

  let activePatientId = patients[0] ? patients[0].id : "P-1002";
  let activeTemplate = MEDICATION_TEMPLATES[0];

  const container = document.createElement('div');
  container.className = 'prescriptions-wrap';

  function renderView() {
    const patient = store.getPatientById(activePatientId);
    const hasPenicillinAllergy = patient && patient.medicalHistory &&
      patient.medicalHistory.allergies &&
      patient.medicalHistory.allergies.some(a => a.toLowerCase().includes('penicillin'));

    container.innerHTML = `
      <div class="patients-toolbar">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Electronic Prescription Generator</h3>
          <p style="font-size: 12.5px; color: var(--text-muted);">Generate clinical scripts with allergy checking, dosage calculations & printable legal pad</p>
        </div>
      </div>

      <!-- Allergy Warning Banner if Patient has Penicillin Allergy -->
      ${hasPenicillinAllergy ? `
        <div class="medical-alert-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <strong>ALLERGY CONTRAINDICATION ALERT:</strong> ${patient.name} has a documented
            <span style="font-weight: 700; text-decoration: underline;">Penicillin Allergy</span>.
            Do not prescribe Amoxicillin or Penicillin VK. Use Clindamycin or Azithromycin alternative.
          </div>
        </div>
      ` : ''}

      <!-- 2-Column: Form on Left, Live Printable Pad on Right -->
      <div class="prescription-layout">
        <!-- Form Generator -->
        <div class="card" style="padding: 22px;">
          <h4 style="font-size: 14.5px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">
            Order New Medication
          </h4>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Patient</label>
              <select class="form-select" id="rx-patient-select">
                ${patients.map(p => `
                  <option value="${p.id}" ${p.id === activePatientId ? 'selected' : ''}>${p.name} (${p.id})</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Prescribing Provider</label>
              <select class="form-select" id="rx-dentist-select">
                ${dentists.map(d => `<option value="${d.name}">${d.name}, ${d.title.includes('Prostho') ? 'DDS' : 'DMD'}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Select Standard Dental Drug Template</label>
            <select class="form-select" id="rx-template-select">
              ${MEDICATION_TEMPLATES.map((tmpl, idx) => `
                <option value="${idx}">${tmpl.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Medication & Strength</label>
            <input type="text" class="form-input" id="rx-med-name" value="${activeTemplate.name}">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Dispense Quantity</label>
              <input type="text" class="form-input" id="rx-quantity" value="${activeTemplate.quantity}">
            </div>
            <div class="form-group">
              <label class="form-label">Authorized Refills</label>
              <select class="form-select" id="rx-refills">
                <option value="0">0 (Zero Refills)</option>
                <option value="1">1 Refill</option>
                <option value="2">2 Refills</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Directions for Use (SIG Instructions)</label>
            <textarea class="form-textarea" id="rx-sig" rows="3">${activeTemplate.sig}</textarea>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn btn-primary" id="btn-issue-rx" style="flex: 1;">
              Sign & Issue Prescription
            </button>
          </div>
        </div>

        <!-- Live Printable Rx Pad -->
        <div class="rx-pad-card" id="printable-rx-pad">
          <div class="rx-pad-header">
            <div>
              <div style="font-size: 16px; font-weight: 800; color: var(--color-slate-900);">${store.data.clinic.name}</div>
              <div style="font-size: 11.5px; color: var(--text-muted);">${store.data.clinic.location} · ${store.data.clinic.phone}</div>
              <div style="font-size: 11px; color: var(--color-slate-500); margin-top: 2px;">
                DEA: BV4921092 · NPI: 1942859102 · State Lic: #49210
              </div>
            </div>
            <div style="text-align: right;">
              <div class="rx-symbol">℞</div>
              <div style="font-size: 11.5px; font-family: var(--font-mono); color: var(--color-slate-600); margin-top: 4px;">
                Date: 2026-10-12
              </div>
            </div>
          </div>

          <!-- Patient Subheader -->
          <div style="margin-bottom: 20px; font-size: 12.5px; color: var(--color-slate-800); display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
            <div>
              Patient: <strong>${patient ? patient.name : 'Selected Patient'}</strong>
              <div style="font-size: 11.5px; color: var(--text-muted);">${patient ? `${patient.dob} (${patient.age} yrs)` : ''}</div>
            </div>
            <div style="text-align: right;">
              Allergies: <strong>${patient && patient.medicalHistory && patient.medicalHistory.allergies ? patient.medicalHistory.allergies.join(', ') : 'NKDA'}</strong>
            </div>
          </div>

          <!-- Prescription Body -->
          <div class="rx-body-box">
            <div class="rx-med-title" id="preview-rx-name">${activeTemplate.name}</div>
            <div style="font-size: 13px; font-weight: 600; color: var(--teal-800); margin-bottom: 10px;">
              Dispense: <span id="preview-rx-qty">${activeTemplate.quantity}</span> · Refills: <span id="preview-rx-refills">0</span>
            </div>
            <div class="rx-instructions">
              <strong>SIG:</strong> <span id="preview-rx-sig">${activeTemplate.sig}</span>
            </div>
          </div>

          <!-- Signature block -->
          <div class="rx-sig-line">
            <div style="font-size: 11px; color: var(--text-muted);">
              Security Hash: #DNT-941829-TX
            </div>
            <div class="sig-border">
              <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 19px; color: var(--teal-900);">
                Dr. Alexander Vance, DDS
              </div>
              Authorized Prescriber Signature
            </div>
          </div>

          <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="window.print()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Prescription Pad
            </button>
          </div>
        </div>
      </div>

      <!-- Prescriptions History Log -->
      <div class="card" style="margin-top: 24px;">
        <div class="card-header">
          <div class="card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            Prescription Audit Log (${prescriptions.length})
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <table class="table-modern">
            <thead>
              <tr>
                <th>Rx ID</th>
                <th>Patient</th>
                <th>Medication</th>
                <th>Provider</th>
                <th>Date Issued</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${prescriptions.map(rx => `
                <tr>
                  <td style="font-family: var(--font-mono); font-weight: 700; color: var(--teal-800);">${rx.id}</td>
                  <td style="font-weight: 600;">${rx.patientName}</td>
                  <td>${rx.medication} (${rx.quantity})</td>
                  <td style="font-size: 12.5px; color: var(--color-slate-600);">${rx.dentistName}</td>
                  <td>${rx.date}</td>
                  <td><span class="badge badge-${rx.status === 'Active' ? 'confirmed' : 'paid'}">${rx.status}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.print()" style="padding: 4px 10px; font-size: 11px;">
                      Print
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const patientSelect = container.querySelector('#rx-patient-select');
    if (patientSelect) {
      patientSelect.addEventListener('change', (e) => {
        activePatientId = e.target.value;
        renderView();
      });
    }

    const templateSelect = container.querySelector('#rx-template-select');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value);
        activeTemplate = MEDICATION_TEMPLATES[idx];
        renderView();
      });
    }

    const medNameInput = container.querySelector('#rx-med-name');
    const previewName = container.querySelector('#preview-rx-name');
    if (medNameInput && previewName) {
      medNameInput.addEventListener('input', (e) => {
        previewName.textContent = e.target.value;
      });
    }

    const sigInput = container.querySelector('#rx-sig');
    const previewSig = container.querySelector('#preview-rx-sig');
    if (sigInput && previewSig) {
      sigInput.addEventListener('input', (e) => {
        previewSig.textContent = e.target.value;
      });
    }

    // Issue Rx Button with Role Permission Enforcement
    const btnIssue = container.querySelector('#btn-issue-rx');
    if (btnIssue) {
      btnIssue.addEventListener('click', () => {
        if (!store.hasPermission('write_prescription')) {
          alert(`Access Restricted: Your current role (${store.data.currentUser.role}) does not have DEA/Clinical prescribing authority. Please switch persona to Dr. Alexander Vance or Dr. Aris Thorne using the persona card in the sidebar.`);
          return;
        }

        const patient = store.getPatientById(activePatientId);
        const dentistName = container.querySelector('#rx-dentist-select').value;
        const medName = container.querySelector('#rx-med-name').value;
        const qty = container.querySelector('#rx-quantity').value;
        const sig = container.querySelector('#rx-sig').value;
        const refills = parseInt(container.querySelector('#rx-refills').value);

        store.addPrescription({
          patientId: patient.id,
          patientName: patient.name,
          dentistName: dentistName,
          medication: medName,
          dosage: "Standard",
          sig: sig,
          quantity: qty,
          refills: refills,
          indication: "Clinical prescription"
        });

        window.showToast(`Prescription for ${patient.name} issued and logged to audit trail.`, "success");
        renderView();
      });
    }
  }

  renderView();
  return container;
}
