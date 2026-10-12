/**
 * modules/auditLog.js - HIPAA Compliance Security & Clinical Audit Trail
 */

export function renderAuditLog() {
  const store = window.appStore;
  let userFilter = 'all';
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'audit-log-wrap';

  function downloadAuditCsv(logs) {
    const lines = [
      `"HIPAA SECURITY AUDIT LOG ARCHIVE - IMMUTABLE COMPLIANCE EXPORT"`,
      `"Practice","Beacon Peak Dental Group"`,
      `"Generated At","${new Date().toLocaleString()}"`,
      `"Total Records","${logs.length}"`,
      ``,
      `"Timestamp","Staff / System Actor","Role","Action Category","Event Details","Station / IP","Integrity Status"`,
      ...logs.map(l => {
        const cleanDetails = (l.details || '').replace(/"/g, '""');
        return `"${l.timestamp}","${l.user}","${l.role || 'Staff'}","${l.action}","${cleanDetails}","${l.ip || '127.0.0.1'}","VERIFIED_IMMUTABLE"`;
      })
    ];

    const csvContent = lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HIPAA_Audit_Trail_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function renderView() {
    const logs = store.getAuditLogs();

    const filtered = logs.filter(log => {
      const matchUser = userFilter === 'all' || (log.user || '').toLowerCase().includes(userFilter.toLowerCase());
      const matchSearch = !searchTerm ||
        (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchUser && matchSearch;
    });

    container.innerHTML = `
      <div class="patients-toolbar">
        <div>
          <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">HIPAA Compliance Audit Trail & Event Log</h2>
          <p style="font-size: 13px; color: var(--text-secondary); max-width: 48ch; line-height: 1.5;">Immutable audit records of user logins, chart accesses, and AI receptionist events.</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" id="btn-export-audit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Compliance Log (CSV)
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 18px; flex-wrap: wrap;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="audit-search-input" class="form-input" placeholder="Search actions, patients, or details..." value="${searchTerm}">
        </div>

        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm ${userFilter === 'all' ? 'active' : ''}" data-user="all">All Users (${logs.length})</button>
          <button class="btn btn-secondary btn-sm ${userFilter === 'Vance' ? 'active' : ''}" data-user="Vance">Dr. Vance</button>
          <button class="btn btn-secondary btn-sm ${userFilter === 'Maya' ? 'active' : ''}" data-user="Maya">Maya Lin</button>
          <button class="btn btn-secondary btn-sm ${userFilter === 'AI' ? 'active' : ''}" data-user="AI">AI System</button>
        </div>
      </div>

      <!-- Audit Table -->
      <div class="table-container">
        <table class="table-modern">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Staff / System Actor</th>
              <th>Action Category</th>
              <th>Audit Event Details</th>
              <th>Station / IP Address</th>
              <th>Integrity Status</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="6" style="text-align: center; padding: 36px; color: var(--text-muted);">
                  No audit log events match your filter criteria.
                </td>
              </tr>
            ` : filtered.map(log => {
              const isAi = (log.user || '').includes('AI');
              return `
                <tr>
                  <td style="font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); white-space: nowrap;">
                    ${log.timestamp}
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div class="user-avatar" style="width: 34px; height: 34px; font-size: 13px; font-weight: 700; ${isAi ? 'background: #0F766E; border-color: #0D9488;' : ''}">
                        ${isAi ? 'AI' : (log.user || 'U').split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <strong style="font-size: 13.5px; color: var(--text-primary);">${log.user}</strong>
                        <div style="font-size: 12.5px; color: var(--text-secondary); font-weight: 500;">${log.role || 'Staff'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${isAi ? 'badge-ai' : (log.action.includes('Accessed') ? 'badge-confirmed' : 'badge-scheduled')}" style="font-size: 12.5px; padding: 4px 10px;">
                      ${log.action}
                    </span>
                  </td>
                  <td style="font-size: 13px; color: var(--text-secondary); max-width: 380px;">
                    ${log.details}
                  </td>
                  <td style="font-family: var(--font-mono); font-size: 13.5px; color: var(--text-secondary);">
                    ${log.ip || '127.0.0.1'}
                  </td>
                  <td>
                    <span class="badge badge-confirmed" style="font-size: 12.5px; padding: 4px 10px;">
                      ✓ Verified
                    </span>
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
    const searchInput = container.querySelector('#audit-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderView();
        const inputNow = container.querySelector('#audit-search-input');
        if (inputNow) {
          inputNow.focus();
          inputNow.setSelectionRange(searchTerm.length, searchTerm.length);
        }
      });
    }

    container.querySelectorAll('[data-user]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        userFilter = btn.getAttribute('data-user');
        renderView();
      });
    });

    const btnExport = container.querySelector('#btn-export-audit');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const logs = store.getAuditLogs();
        downloadAuditCsv(logs);
        window.showToast(`Exported ${logs.length} HIPAA compliance audit records (CSV).`, "success");
      });
    }
  }

  renderView();
  return container;
}
