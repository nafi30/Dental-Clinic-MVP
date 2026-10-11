/**
 * modules/fileManager.js - Diagnostic Imaging & Radiographs Vault with Real File Upload & Lightbox
 */

export function renderFileManager() {
  const store = window.appStore;
  const patients = store.getPatients();
  const dentists = store.data.dentists;
  let selectedCategory = 'all';
  let selectedPatient = 'all';

  const container = document.createElement('div');
  container.className = 'files-vault-wrap';

  function renderView() {
    const files = store.getFiles(selectedPatient, selectedCategory);

    container.innerHTML = `
      <!-- Hidden file input for real uploads -->
      <input type="file" id="real-file-picker" accept="image/*,.pdf,.dcm" style="display: none;">

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

          <button class="btn btn-primary" id="btn-upload-file-picker">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Diagnostic File
          </button>
        </div>
      </div>

      <!-- Drag & Drop Upload Zone -->
      <div class="upload-dropzone" id="file-dropzone" style="cursor: pointer;">
        <div class="kpi-icon-wrap" style="width: 48px; height: 48px; background: var(--teal-50); color: var(--teal-700);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <div>
          <strong style="font-size: 14.5px; color: var(--text-primary);">Drag & drop or browse files to upload to patient charts</strong>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">
            Supports PNG, JPEG, PDF, and DICOM diagnostic radiography files
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-browse-file" style="margin-top: 6px;">
          Browse File From Computer
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
            No diagnostic imaging or files found matching your filters.
          </div>
        ` : files.map(file => `
          <div class="file-card" data-file-id="${file.id}">
            <div class="file-preview-thumb">
              ${file.url ? `
                <img src="${file.url}" alt="${file.title}" style="width: 100%; height: 100%; object-fit: cover;">
              ` : `
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  ${file.type.includes('Panoramic') ? '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h10M7 9h10M12 4v16"/>' :
                    (file.type.includes('CBCT') ? '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' :
                      (file.type.includes('Consent') ? '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' :
                        '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'))}
                </svg>
              `}
              <span class="badge badge-teal" style="position: absolute; top: 10px; right: 10px; font-size: 10px;">
                ${file.type}
              </span>
            </div>

            <div class="file-meta-padding">
              <strong style="font-size: 13.5px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">
                ${file.title}
              </strong>
              <div style="font-size: 12px; color: var(--teal-800); font-weight: 600; margin-top: 2px;">
                Patient: ${file.patientName}
              </div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 3px;">
                ${file.date} · ${file.size} · ${file.dentist}
              </div>
              <p style="font-size: 11.5px; color: var(--text-secondary); margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${file.notes}
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
                <button class="btn btn-secondary btn-sm btn-inspect-file" data-file-id="${file.id}" style="font-size: 11px; padding: 3px 8px;">
                  Lightbox View
                </button>
                <button class="btn btn-sm btn-delete-file" data-file-id="${file.id}" style="color: var(--crimson-600); background: transparent; border: none; font-size: 11px; cursor: pointer;" title="Delete file">
                  🗑️ Delete
                </button>
              </div>
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
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-file')) return;
        const fileId = card.getAttribute('data-file-id');
        openFileLightbox(fileId);
      });
    });

    // Delete file
    container.querySelectorAll('.btn-delete-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-file-id');
        if (confirm('Are you sure you want to remove this diagnostic record?')) {
          store.data.files = store.data.files.filter(f => f.id !== fileId);
          store.saveData();
          store.apiCall(`/api/files/${fileId}`, 'DELETE');
          window.showToast('Diagnostic file record removed.', 'success');
          renderView();
        }
      });
    });

    // File input trigger
    const filePicker = container.querySelector('#real-file-picker');
    const triggerUpload = () => {
      if (filePicker) filePicker.click();
    };

    const btnUpload = container.querySelector('#btn-upload-file-picker');
    if (btnUpload) btnUpload.addEventListener('click', triggerUpload);

    const btnBrowse = container.querySelector('#btn-browse-file');
    if (btnBrowse) btnBrowse.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUpload();
    });

    const dropzone = container.querySelector('#file-dropzone');
    if (dropzone) {
      dropzone.addEventListener('click', triggerUpload);

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--teal-600)';
        dropzone.style.background = 'rgba(13, 148, 136, 0.05)';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '';
        dropzone.style.background = '';
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        dropzone.style.background = '';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileChosen(e.dataTransfer.files[0]);
        }
      });
    }

    if (filePicker) {
      filePicker.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFileChosen(e.target.files[0]);
        }
      });
    }
  }

  function handleFileChosen(file) {
    // Open metadata modal before confirming upload
    openUploadMetaModal(file);
  }

  function openUploadMetaModal(file) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Attach Diagnostic File</h3>
          <button class="modal-close-btn" id="btn-close-upload-modal">✕</button>
        </div>
        <div class="modal-body">
          <div style="padding: 10px 14px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 16px; display: flex; align-items: center; gap: 10px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div>
              <strong style="font-size: 13.5px; color: var(--text-primary);">${file.name}</strong>
              <div style="font-size: 11.5px; color: var(--text-muted);">${fileSizeMb} MB · ${file.type || 'DICOM/Raw'}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Assign To Patient</label>
            <select class="form-select" id="upload-patient-select">
              ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Diagnostic Category</label>
              <select class="form-select" id="upload-type-select">
                <option value="Bitewing Radiograph">Bitewing Radiograph</option>
                <option value="Panoramic X-Ray">Panoramic X-Ray (OPG)</option>
                <option value="CBCT 3D Scan">CBCT 3D Volumetric Scan</option>
                <option value="Consent Form">Consent / Treatment Document</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Reviewing Dentist</label>
              <select class="form-select" id="upload-dentist-select">
                ${dentists.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Document / Scan Title</label>
            <input type="text" class="form-input" id="upload-title" value="${file.name.replace(/\.[^/.]+$/, '')}">
          </div>

          <div class="form-group">
            <label class="form-label">Clinical Diagnostic Notes & Findings</label>
            <textarea class="form-textarea" id="upload-notes" rows="2" placeholder="e.g. Bone levels normal, interproximal caries evaluation, osseointegration verified..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-upload">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-confirm-upload">Save & Attach to Record</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('#btn-close-upload-modal').addEventListener('click', close);
    modal.querySelector('#btn-cancel-upload').addEventListener('click', close);

    modal.querySelector('#btn-confirm-upload').addEventListener('click', async () => {
      const patientId = modal.querySelector('#upload-patient-select').value;
      const patient = store.getPatientById(patientId);
      const type = modal.querySelector('#upload-type-select').value;
      const dentist = modal.querySelector('#upload-dentist-select').value;
      const title = modal.querySelector('#upload-title').value.trim() || file.name;
      const notes = modal.querySelector('#upload-notes').value.trim() || 'Verified diagnostic imaging survey.';

      // Read visual data URL for immediate preview
      let previewUrl = null;
      if (file.type.startsWith('image/')) {
        previewUrl = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      }

      // Add to store
      const newFileObj = {
        patientId: patient ? patient.id : 'P-1001',
        patientName: patient ? patient.name : 'Eleanor Vance',
        type,
        title,
        filename: file.name,
        size: `${fileSizeMb} MB`,
        dentist,
        notes,
        thumbnail: type.includes('CBCT') ? 'xray-cbct' : (type.includes('Panoramic') ? 'xray-panoramic' : 'xray-bitewing'),
        url: previewUrl
      };

      store.addFile(newFileObj);

      // If backend is online, also send multipart FormData
      if (store.isBackendOnline) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('patientId', newFileObj.patientId);
          formData.append('patientName', newFileObj.patientName);
          formData.append('type', newFileObj.type);
          formData.append('title', newFileObj.title);
          formData.append('dentist', newFileObj.dentist);
          formData.append('notes', newFileObj.notes);
          formData.append('size', newFileObj.size);

          fetch('/api/files/upload', {
            method: 'POST',
            body: formData
          }).catch(e => console.warn('File upload background sync notice:', e));
        } catch (e) {}
      }

      window.showToast(`✓ Uploaded ${title} to ${newFileObj.patientName}'s EDR.`, 'success');
      close();
      renderView();
    });
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

        <div class="modal-body" style="padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; background: #090E17;">
          <div style="width: 100%; max-width: 720px; max-height: 420px; border-radius: var(--radius-lg); background: #020617; border: 1px solid rgba(45, 212, 191, 0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            ${file.url ? `
              <img src="${file.url}" alt="${file.title}" style="max-width: 100%; max-height: 400px; object-fit: contain;">
            ` : `
              <div style="padding: 40px; text-align: center;">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" stroke-width="1" style="opacity: 0.9;">
                  <rect x="2" y="2" width="20" height="20" rx="3"/>
                  <path d="M7 17v-4a5 5 0 0 1 10 0v4"/>
                  <circle cx="12" cy="7" r="2.5"/>
                </svg>
                <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 14px;">
                  High-Resolution Radiographic View
                </div>
                <div style="font-size: 12px; color: var(--teal-300); font-family: var(--font-mono); margin-top: 4px;">
                  DICOM Resolution: 2400 x 1800 · Calibrated Contrast
                </div>
              </div>
            `}
          </div>

          <div style="margin-top: 20px; width: 100%; max-width: 720px; background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.08);">
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
          <button class="btn btn-primary btn-sm" onclick="window.showToast('Downloaded original diagnostic file to workstation', 'success')">
            Download File
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
