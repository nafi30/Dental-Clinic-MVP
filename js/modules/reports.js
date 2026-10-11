/**
 * modules/reports.js - Practice Analytics, Clinical Productivity & Financial Reporting
 */

export function renderReports() {
  const store = window.appStore;
  const reports = store.getReports();

  const container = document.createElement('div');
  container.className = 'reports-module-wrap';

  container.innerHTML = `
    <!-- Top Filter & Action Bar -->
    <div class="patients-toolbar">
      <div>
        <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Practice Analytics & Executive Reporting</h3>
        <p style="font-size: 12.5px; color: var(--text-muted);">Real-time financial yield, dentist operatory productivity & patient retention metrics</p>
      </div>

      <div style="display: flex; gap: 10px;">
        <select class="form-select" id="report-period-select" style="width: 170px;">
          <option value="month">Current Month (Oct 2026)</option>
          <option value="q3">Q3 2026 (Jul - Sep)</option>
          <option value="ytd">Year to Date (2026)</option>
        </select>
        <button class="btn btn-secondary btn-sm" id="btn-export-reports">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV Summary
        </button>
      </div>
    </div>

    <!-- Reports 4-Col KPI Grid -->
    <div class="reports-kpi-grid">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Gross Production (MTD)</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="kpi-val" style="color: var(--teal-800);">$${reports.monthlyProduction.toLocaleString()}</div>
        <div class="kpi-footer"><span class="trend-up">↑ 14.2%</span> vs last month</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Collected Revenue</span>
          <div class="kpi-icon-wrap" style="background: var(--emerald-50); color: var(--emerald-700);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
        </div>
        <div class="kpi-val" style="color: var(--emerald-600);">$${reports.monthlyCollections.toLocaleString()}</div>
        <div class="kpi-footer"><span style="font-weight: 700; color: var(--emerald-700);">${reports.collectionRate}</span> collection efficiency</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">New Patients Acquired</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
        </div>
        <div class="kpi-val">${reports.newPatientsThisMonth} Patients</div>
        <div class="kpi-footer"><span class="trend-up">↑ 8 from AI Receptionist</span> after-hours</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Patient Retention Recall</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
        </div>
        <div class="kpi-val">${reports.activeRecallRate}</div>
        <div class="kpi-footer">6-Month hygiene recall compliance</div>
      </div>
    </div>

    <!-- 2-Column Split: Provider Productivity & Procedure Mix -->
    <div class="chart-card-split">
      <!-- Provider Productivity -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Operatory Utilization by Attending Dentist
          </div>
          <div class="card-subtitle">Active chair hours vs available capacity</div>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 18px;">
            ${Object.entries(reports.chairUtilization).map(([doctor, pct]) => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13.5px; font-weight: 600; margin-bottom: 6px;">
                  <span>${doctor}</span>
                  <span style="font-family: var(--font-mono); color: var(--teal-800);">${pct}</span>
                </div>
                <div style="width: 100%; height: 10px; background: var(--color-slate-100); border-radius: 6px; overflow: hidden;">
                  <div style="width: ${pct}; height: 100%; background: linear-gradient(90deg, var(--teal-600), var(--teal-700)); border-radius: 6px;"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
            <div>Cancellation Rate: <strong style="color: var(--text-primary);">${reports.cancellationRate}</strong></div>
            <div>No-Show Rate: <strong style="color: var(--text-primary);">${reports.noShowRate}</strong></div>
            <div>Industry Average: <strong>8.5%</strong></div>
          </div>
        </div>
      </div>

      <!-- Procedure Mix Breakdown -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            Clinical Procedure Mix & Revenue
          </div>
          <div class="card-subtitle">Contribution by department</div>
        </div>
        <div class="card-body" style="padding: 0;">
          <table class="table-modern">
            <thead>
              <tr>
                <th>Category</th>
                <th>Share</th>
                <th style="text-align: right;">Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${reports.procedureMix.map(item => `
                <tr>
                  <td style="font-weight: 600; font-size: 13px;">${item.name}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 50px; height: 6px; background: var(--color-slate-100); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${item.percentage}%; height: 100%; background: var(--teal-600);"></div>
                      </div>
                      <span style="font-size: 11.5px; font-weight: 700;">${item.percentage}%</span>
                    </div>
                  </td>
                  <td style="text-align: right; font-weight: 700; font-family: var(--font-mono); color: var(--teal-800); font-size: 13.5px;">
                    $${item.revenue.toLocaleString()}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Attach event
  const btnExport = container.querySelector('#btn-export-reports');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      window.showToast("Exported Practice Production & Clinical KPI Summary (CSV).", "success");
    });
  }

  return container;
}
