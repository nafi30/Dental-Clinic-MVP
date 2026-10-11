/**
 * modules/dashboard.js - Practice Owner Executive Dashboard
 */

export function renderDashboard() {
  const store = window.appStore;
  const patients = store.getPatients();
  const appointments = store.getAppointments();
  const invoices = store.getInvoices();
  const aiMetrics = store.getAiMetrics();
  const callLogs = store.getCallLogs();

  // Metrics calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a =>
    a.date === todayStr ||
    a.date === '2026-10-12' ||
    a.date === '2026-10-13' ||
    a.date === 'Today'
  );
  const pendingInvoices = invoices.filter(inv => inv.paymentStatus !== 'Paid');
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.total - (inv.paidAmount || 0)), 0);

  const container = document.createElement('div');
  container.className = 'dashboard-grid';

  container.innerHTML = `
    <!-- Top KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Today's Appointments</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
        </div>
        <div class="kpi-val" id="dash-today-appts">${todayAppts.length}</div>
        <div class="kpi-footer">
          <span class="trend-up">↑ 3 Chairs active</span> across 3 dentists
        </div>
      </div>

      <div class="kpi-card kpi-highlight">
        <div class="kpi-top">
          <span class="kpi-label">AI Recovered Calls</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><polyline points="16 2 16 6 20 6"/></svg>
          </div>
        </div>
        <div class="kpi-val" id="dash-recovered-calls" style="color: var(--teal-700);">${aiMetrics.recoveredCalls}</div>
        <div class="kpi-footer">
          <span class="badge badge-recovered" style="padding: 2px 6px; font-size: 11px;">${aiMetrics.recoveryRate} capture</span> after-hours & overflow
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Recovered Revenue Pipeline</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="kpi-val" id="dash-recovered-rev">$${aiMetrics.revenueSaved.toLocaleString()}</div>
        <div class="kpi-footer">
          <span class="trend-up">↑ 100% captured</span> from otherwise lost calls
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Pending Collections</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
        </div>
        <div class="kpi-val" id="dash-pending-rev">$${pendingAmount.toLocaleString()}</div>
        <div class="kpi-footer">
          <span style="color: var(--amber-700); font-weight: 600;">${pendingInvoices.length} invoices</span> awaiting copay/clearance
        </div>
      </div>
    </div>

    <!-- Centerpiece Hero Call Action Banner -->
    <div class="ai-hero-banner">
      <div class="ai-banner-content">
        <div class="ai-banner-tag">
          <span class="ai-pulse-dot" style="display:inline-block; margin-left:0; margin-right:4px;"></span>
          Aesora AI Voice Agent · Live & Monitoring
        </div>
        <h2 class="ai-banner-heading">Never Lose Another High-Value Patient to Voicemail</h2>
        <p class="ai-banner-desc">
          When patients call after 5:00 PM or when front desk phones are busy, our AI answers in 2 rings, triages dental urgency, schedules the appointment, and logs the patient into your CRM instantly.
        </p>
      </div>
      <div>
        <button class="btn btn-simulate-call" id="btn-banner-sim-call" style="padding: 12px 24px; font-size: 14px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Simulate Incoming Patient Call
        </button>
      </div>
    </div>

    <!-- 2-Column Split: Today's Operatory Schedule & Recent AI Recoveries -->
    <div class="dash-two-col">
      <!-- Left: Today's Appointments -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Today's Operatory Schedule
            </div>
            <div class="card-subtitle">Real-time schedule across all 3 active operatories</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-dash-view-calendar">View Full Calendar →</button>
        </div>
        <div class="card-body">
          <div class="timeline-list">
            ${todayAppts.length === 0 ? '<p style="color:var(--text-muted); padding:16px;">No appointments for today.</p>' :
              todayAppts.map(apt => `
                <div class="timeline-item" data-apt-id="${apt.id}" style="cursor: pointer;">
                  <span class="time-slot-badge">${apt.time}</span>
                  <div>
                    <div class="timeline-patient-name">
                      ${apt.patientName}
                      ${apt.isAiBooked ? '<span class="badge badge-ai" style="margin-left:6px; font-size:10px; padding:1px 6px;">AI Booked</span>' : ''}
                    </div>
                    <div class="timeline-patient-proc">${apt.treatment}</div>
                  </div>
                  <div class="timeline-provider">
                    <div>${apt.operatory.split(' ')[0]} ${apt.operatory.split(' ')[1]}</div>
                    <span class="badge badge-${apt.status.toLowerCase().replace(' ', '-')}">${apt.status}</span>
                  </div>
                </div>
              `).join('')
            }
          </div>
        </div>
      </div>

      <!-- Right: Recent AI Receptionist Recoveries -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Recent AI Call Recoveries
            </div>
            <div class="card-subtitle">Calls handled when office was closed/busy</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-dash-view-ai">Call Logs →</button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div style="display:flex; flex-direction:column;">
            ${callLogs.slice(0, 3).map(call => `
              <div class="ai-call-item" data-call-id="${call.id}">
                <div class="call-meta-col">
                  <div class="call-patient-title">
                    ${call.patientName}
                    <span class="badge badge-recovered" style="font-size:10.5px;">+$${call.estimatedRevenue}</span>
                  </div>
                  <div class="call-summary-snippet">${call.intent} · <span style="color:var(--text-muted);">${call.time}</span></div>
                </div>
                <button class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:11px;">Transcript</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  const btnBannerSim = container.querySelector('#btn-banner-sim-call');
  if (btnBannerSim) {
    btnBannerSim.addEventListener('click', () => {
      window.triggerCallSimulation();
    });
  }

  const btnViewCalendar = container.querySelector('#btn-dash-view-calendar');
  if (btnViewCalendar) {
    btnViewCalendar.addEventListener('click', () => {
      window.navigateTo('calendar');
    });
  }

  const btnViewAi = container.querySelector('#btn-dash-view-ai');
  if (btnViewAi) {
    btnViewAi.addEventListener('click', () => {
      window.navigateTo('ai-receptionist');
    });
  }

  // Click on appointment opens details
  container.querySelectorAll('.timeline-item').forEach(el => {
    el.addEventListener('click', () => {
      const aptId = el.getAttribute('data-apt-id');
      window.openAppointmentModal(aptId);
    });
  });

  // Click on call item opens transcript modal
  container.querySelectorAll('.ai-call-item').forEach(el => {
    el.addEventListener('click', () => {
      const callId = el.getAttribute('data-call-id');
      window.openTranscriptModal(callId);
    });
  });

  return container;
}
