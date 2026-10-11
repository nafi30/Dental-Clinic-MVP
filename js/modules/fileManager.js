/**
 * modules/fileManager.js - X-Ray, CBCT, & Document Vault with Preview Lightbox
 */

export function renderFileManager() {
  const store = window.appStore;
  const patients = store.getPatients();
  let selectedCategory = 'all';
  let selectedPatient = 'all';

  const container = document.createElement('div');
  container.className = 'files-vault-wrap';

  function renderView() {
    const files = store.getFiles(selectedPatient, selectedCategory);

    container.innerHTML = `
      <div class="patients-toolbar">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Diagnostic Imaging & Clinical Documents</h3>
          <p style="font-size: 12.5px; color: var(--text-muted);">Intraoral bitewings, panoramic radiographs, CBCT volume scans, and patient consent forms</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <select class="form-select" id="file-patient-filter" style="width: 200px;">
            <option value="all">All Patients</option>
            ${patients.map(p => `
              <option value="${p.id}" ${p.id === selectedPatient ? 'selected' : ''}>${p.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Drag & Drop Upload Zone -->
      <div class="upload-dropzone" id="file-dropzone">
        <div class="kpi-icon-wrap" style="width: 48px; height: 48px; background: var(--teal-50); color: var(--teal-700);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <div>
          <strong style="font-size: 14.5px; color: var(--text-primary);">Drag & drop DICOM, PNG, or PDF files to upload</strong>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">
            Supports Bitewing Radiographs, Panoramic OPG, CBCT 3D volume slices, and Treatment Consents
          </div>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-browse-file" style="margin-top: 6px;">
          Simulate Upload New X-Ray
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div style="display: flex; gap: 8px; margin-top: 20px; overflow-x: auto; padding-bottom: 4px;">
        <button class="btn btn-secondary btn-sm ${selectedCategory === 'all' ? 'active' : ''}" data-cat="all" style="${selectedCategory === 'all' ? 'background:var(--teal-50); border-color:var(--teal-600); color:var(--teal-800);' : ''}">All Files (${store.data.files.length})</button>
        <button class="btn btn-secondary btn-sm ${selectedCategory === 'Bitewing' ? 'active' : ''}" data-cat="Bitewing" style="${selectedCategory === 'Bitewing' ? 'background:var(--teal-50); border-color:var(--teal-600); color:var(--teal-800);' : ''}">Bitewings</button>
        <button class="btn btn-secondary btn-sm ${selectedCategory === 'Panoramic' ? 'active' : ''}" data-cat="Panoramic" style="${selectedCategory === 'Panoramic' ? 'background:var(--teal-50); border-color:var(--teal-600); color:var(--teal-800);' : ''}">Panoramic OPG</button>
        <button class="btn btn-secondary btn-sm ${selectedCategory === 'CBCT' ? 'active' : ''}" data-cat="CBCT" style="${selectedCategory === 'CBCT' ? 'background:var(--teal-50); border-color:var(--teal-600); color:var(--teal-800);' : ''}">CBCT 3D Scans</button>
        <button class="btn btn-secondary btn-sm ${selectedCategory === 'Consent' ? 'active' : ''}" data-cat="Consent" style="${selectedCategory === 'Consent' ? 'background:var(--teal-50); border-color:var(--teal-600); color:var(--teal-800);' : ''}">Consent Forms</button>
      </div>

      <!-- Files Grid -->
      <div class="files-grid">
        ${files.length === 0 ? `
          <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
            No imaging or files found matching your filters.
          </div>
        ` : files.map(file => `
          <div class="file-card" data-file-id="${file.id}">
            <div class="file-preview-thumb">
              <!-- Stylized Dark Clinical Graphic -->
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                ${file.type.includes('Panoramic') ? '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h10M7 9h10M12 4v16"/>' :
                  (file.type.includes('CBCT') ? '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' :
                    (file.type.includes('Consent') ? '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' :
                      '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'))}
              </svg>
              <span class="badge badge-teal" style="position: absolute; top: 10px; right: 10px; font-size: 10px;">
                ${file.type}
              </span>
            </div>

            <div class="file-meta-padding">
              <strong style="font-size: 13.5px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${file.title}
              </strong>
              <div style="font-size: 12px; color: var(--teal-800); font-weight: 600;">
                Patient: ${file.patientName}
              </div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">
                ${file.date} · ${file.size} · ${file.dentist}
              </div>
              <p style="font-size: 11.5px; color: var(--text-secondary); margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${file.notes}
              </p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Patient filter
    const patientFilter = container.querySelector('#file-patient-filter');
    if (patientFilter) {
      patientFilter.addEventListener('change', (e) => {
        selectedPatient = e.target.value;
        renderView();
      });
    }

    // Category pills
    container.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedCategory = btn.getAttribute('data-cat');
        renderView();
      });
    });

    // File card click to preview lightbox
    container.querySelectorAll('.file-card').forEach(card => {
      card.addEventListener('click', () => {
        const fileId = card.getAttribute('data-file-id');
        openFileLightbox(fileId);
      });
    });

    // Simulate upload button
    const btnBrowse = container.querySelector('#btn-browse-file');
    if (btnBrowse) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = store.getPatients()[0];
        store.addFile({
          patientId: p.id,
          patientName: p.name,
          type: "Bitewing Radiograph",
          title: `Bitewing_Q1_Right_${new Date().toISOString().split('T')[0]}.png`,
          filename: `bitewing_sim_${Date.now()}.png`,
          size: "4.1 MB",
          dentist: "Dr. Alexander Vance",
          notes: "Routine recall bitewings uploaded to clinical vault.",
          thumbnail: "xray-bitewing"
        });
        window.showToast("Uploaded Bitewing radiograph to patient record.", "success");
        renderView();
      });
    }
  }

  function openFileLightbox(fileId) {
    const file = store.data.files.find(f => f.id === fileId);
    if (!file) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';

    modal.innerHTML = `
      <div class="modal-dialog modal-xl" style="background: #0B1320; color: #FFFFFF; border-color: rgba(45, 212, 191, 0.3);">
        <div class="modal-header" style="background: #070D17; border-color: rgba(255, 255, 255, 0.1);">
          <div>
            <h3 class="modal-title" style="color: #FFFFFF;">${file.title}</h3>
            <div style="font-size: 12px; color: var(--color-slate-400);">${file.type} · Patient: ${file.patientName} (${file.patientId})</div>
          </div>
          <button class="modal-close-btn" id="btn-close-lightbox" style="color: #FFFFFF;">✕</button>
        </div>

        <div class="modal-body" style="padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; background: #090E17;">
          <div style="width: 100%; max-width: 680px; height: 340px; border-radius: var(--radius-lg); background: #020617; border: 1px solid rgba(45, 212, 191, 0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" stroke-width="1" style="opacity: 0.9;">
              <rect x="2" y="2" width="20" height="20" rx="3"/>
              <path d="M7 17v-4a5 5 0 0 1 10 0v4"/>
              <circle cx="12" cy="7" r="2.5"/>
            </svg>
            <div style="font-size: 13.5px; font-weight: 700; color: #FFFFFF; margin-top: 14px;">
              High-Resolution Radiographic View
            </div>
            <div style="font-size: 12px; color: var(--teal-300); font-family: var(--font-mono);">
              Resolution: 2400 x 1800 · DICOM Standard Calibration
            </div>
          </div>

          <div style="margin-top: 20px; width: 100%; max-width: 680px; background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--teal-300); margin-bottom: 4px;">
              Clinical Diagnostic Notes
            </div>
            <div style="font-size: 13.5px; color: var(--color-slate-200); line-height: 1.5;">
              ${file.notes}
            </div>
            <div style="margin-top: 8px; font-size: 11.5px; color: var(--color-slate-400);">
              Acquired on ${file.date} by ${file.dentist} · Verified for clinical records
            </div>
          </div>
        </div>

        <div class="modal-footer" style="background: #070D17; border-color: rgba(255, 255, 255, 0.1);">
          <button class="btn btn-secondary btn-sm" id="btn-close-box" style="background: rgba(255,255,255,0.1); color: #FFF; border-color: rgba(255,255,255,0.2);">
            Close
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.showToast('Downloaded original DICOM file to workstation', 'success')">
            Download Full DICOM
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('#btn-close-lightbox').addEventListener('click', close);
    modal.querySelector('#btn-close-box').addEventListener('click', close);
  }

  renderView();
  return container;
}
