/**
 * modules/treatmentPlan.js - Simple Treatment Planning & Procedure Catalog
 */

export function renderTreatmentPlan() {
  const store = window.appStore;
  const plans = store.getTreatmentPlans();
  const catalog = store.data.treatmentsCatalog;

  const container = document.createElement('div');
  container.className = 'treatment-plans-wrap';

  container.innerHTML = `
    <div class="patients-toolbar">
      <div>
        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Active Clinical Treatment Plans</h2>
        <p style="font-size: 12.5px; color: var(--text-muted);">Custom treatment courses formulated by dentists with stage progression & cost breakdown</p>
      </div>

      <button class="btn btn-primary" id="btn-create-plan">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Treatment Plan
      </button>
    </div>

    <!-- 2 Column Layout: Plans on Left, Procedure Catalog on Right -->
    <div class="dash-two-col" style="grid-template-columns: 2fr 1fr; margin-top: 18px;">
      <!-- Plans List -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${plans.map(plan => `
          <div class="card treatment-plan-card" style="margin-bottom: 0;">
            <div class="card-header" style="background: var(--bg-surface-subtle); padding: 16px 20px;">
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <strong style="font-size: 15px; color: var(--text-primary);">${plan.title}</strong>
                  <span class="badge badge-confirmed">${plan.approvalStatus}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                  Patient: <strong style="color:var(--text-primary);">${plan.patientName}</strong> · Provider: <strong>${plan.dentistName}</strong>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Total Estimate</div>
                <div style="font-size: 18px; font-weight: 800; color: var(--teal-800); font-family: var(--font-mono);">$${plan.totalCost}</div>
              </div>
            </div>

            <div class="card-body" style="padding: 16px 20px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--color-slate-600); text-transform: uppercase; margin-bottom: 8px;">
                Phased Stages & Procedures
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${plan.stages.map(st => `
                  <div class="treatment-stage-item" style="margin-top: 0;">
                    <div>
                      <span style="font-weight: 700; font-size: 12.5px; color: var(--teal-800);">${st.stage}:</span>
                      <span style="font-size: 13.5px; color: var(--text-primary); margin-left: 8px;">${st.procedure}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <span style="font-weight: 700; font-family: var(--font-mono);">$${st.cost}</span>
                      <span class="badge badge-${st.status.toLowerCase().replace(' ', '-')}">${st.status}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Quick Treatment Catalog Widget -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Standard Fee Schedule
          </div>
        </div>
        <div class="card-body" style="padding: 0;">
          <table class="table-modern">
            <thead>
              <tr>
                <th>Procedure</th>
                <th>Time</th>
                <th style="text-align: right;">Fee</th>
              </tr>
            </thead>
            <tbody>
              ${catalog.map(c => `
                <tr>
                  <td style="font-size: 12.5px; font-weight: 600;">${c.name}</td>
                  <td style="font-size: 11.5px; color: var(--text-muted);">${c.duration}</td>
                  <td style="text-align: right; font-weight: 700; font-family: var(--font-mono); color: var(--teal-800);">$${c.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const btnCreate = container.querySelector('#btn-create-plan');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      window.openNewTreatmentPlanModal();
    });
  }

  return container;
}
