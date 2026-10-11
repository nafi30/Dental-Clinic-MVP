/**
 * modules/aiReceptionist.js - Flagship Module 14: AI Voice Receptionist & Live Call Simulator
 */

export function renderAiReceptionist() {
  const store = window.appStore;
  const metrics = store.getAiMetrics();
  const callLogs = store.getCallLogs();

  const container = document.createElement('div');
  container.className = 'ai-receptionist-grid';

  container.innerHTML = `
    <!-- Top AI Performance Metrics -->
    <div class="ai-stats-row">
      <div class="ai-stat-box highlight">
        <div class="kpi-top">
          <span class="kpi-label">Missed Calls Recovered</span>
          <div class="kpi-icon-wrap" style="background: rgba(45, 212, 191, 0.15); color: var(--teal-400);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
        </div>
        <div class="kpi-val" id="ai-metric-recovered">${metrics.recoveredCalls}</div>
        <div class="kpi-footer" style="color: var(--teal-300);">
          <span>After-hours & front desk busy overflow</span>
        </div>
      </div>

      <div class="ai-stat-box">
        <div class="kpi-top">
          <span class="kpi-label">Recovered Revenue Pipeline</span>
          <div class="kpi-icon-wrap" style="background: var(--emerald-50); color: var(--emerald-700);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="kpi-val" id="ai-metric-revenue" style="color: var(--emerald-600);">$${metrics.revenueSaved.toLocaleString()}</div>
        <div class="kpi-footer">
          <span class="trend-up">100% appointments retained</span>
        </div>
      </div>

      <div class="ai-stat-box">
        <div class="kpi-top">
          <span class="kpi-label">AI Booking Success Rate</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
        </div>
        <div class="kpi-val">${metrics.recoveryRate}</div>
        <div class="kpi-footer">
          <span>Trained on dental terminology & insurance</span>
        </div>
      </div>

      <div class="ai-stat-box">
        <div class="kpi-top">
          <span class="kpi-label">Average Answer Latency</span>
          <div class="kpi-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="kpi-val">1.2s</div>
        <div class="kpi-footer">
          <span>Answers within 2 rings 24/7/365</span>
        </div>
      </div>
    </div>

    <!-- Centerpiece Hero Call Launcher -->
    <div class="card call-sim-card" style="background: linear-gradient(135deg, #0B1422 0%, #132438 100%);">
      <div style="padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;">
        <div style="max-width: 600px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span class="ai-pulse-dot" style="margin-left: 0;"></span>
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--teal-300);">
              Interactive Live Demo Engine
            </span>
          </div>
          <h2 style="font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.01em;">
            Experience The AI Receptionist Live
          </h2>
          <p style="font-size: 13.5px; color: var(--color-slate-300); margin-top: 6px; line-height: 1.55;">
            Simulate a realistic after-hours emergency call from Marcus Sterling (broken molar). Watch the AI receptionist answer immediately, converse naturally, book him into Chair 1 with Dr. Vance, update the patient list, and register the revenue in real-time.
          </p>
        </div>

        <div>
          <button class="btn btn-simulate-call" id="btn-receptionist-run-sim" style="padding: 14px 28px; font-size: 14.5px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Simulate Incoming Patient Call Now
          </button>
        </div>
      </div>
    </div>

    <!-- Call Log History Table -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Recent AI Call Logs & Transcripts
          </div>
          <div class="card-subtitle">Every after-hours and overflow conversation is transcribed, summarized, and audited</div>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">
          Total Logged Calls: <strong>${callLogs.length}</strong>
        </div>
      </div>

      <div class="card-body" style="padding: 0;">
        <table class="table-modern">
          <thead>
            <tr>
              <th>Patient / Caller</th>
              <th>Phone Number</th>
              <th>Timestamp</th>
              <th>Intent & Triage</th>
              <th>Call Duration</th>
              <th>Revenue Retained</th>
              <th>Outcome</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${callLogs.map(call => `
              <tr class="call-log-row" data-call-id="${call.id}">
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="user-avatar" style="width: 28px; height: 28px; font-size: 10px; background: var(--teal-900); border-color: var(--teal-500);">
                      ${call.patientName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <strong style="color: var(--text-primary);">${call.patientName}</strong>
                  </div>
                </td>
                <td style="font-family: var(--font-mono); font-size: 12px;">${call.callerId}</td>
                <td style="font-size: 12px; color: var(--color-slate-600);">${call.time}</td>
                <td>
                  <span class="badge badge-teal" style="font-size: 11px;">
                    ${call.intent}
                  </span>
                </td>
                <td style="font-family: var(--font-mono); font-size: 12px;">${call.duration}</td>
                <td>
                  <strong style="color: var(--emerald-600); font-family: var(--font-mono); font-size: 13.5px;">+$${call.estimatedRevenue}</strong>
                </td>
                <td>
                  <span class="badge badge-recovered">${call.outcome}</span>
                </td>
                <td style="text-align: right;">
                  <button class="btn btn-secondary btn-sm btn-view-transcript" data-call-id="${call.id}" style="padding: 5px 12px;">
                    View Transcript
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach event listeners
  const btnRunSim = container.querySelector('#btn-receptionist-run-sim');
  if (btnRunSim) {
    btnRunSim.addEventListener('click', () => {
      window.triggerCallSimulation();
    });
  }

  container.querySelectorAll('.call-log-row').forEach(row => {
    row.addEventListener('click', (e) => {
      const callId = row.getAttribute('data-call-id');
      window.openTranscriptModal(callId);
    });
  });

  container.querySelectorAll('.btn-view-transcript').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const callId = btn.getAttribute('data-call-id');
      window.openTranscriptModal(callId);
    });
  });

  return container;
}

/**
 * Renders the full interactive transcript modal for an existing call
 */
export function renderTranscriptModalContent(callId) {
  const store = window.appStore;
  const call = store.getCallLogs().find(c => c.id === callId);
  if (!call) return null;

  const content = document.createElement('div');
  content.innerHTML = `
    <!-- Caller Info Bar -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); margin-bottom: 20px; border: 1px solid var(--border-subtle);">
      <div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary);">${call.patientName}</div>
        <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">${call.callerId} · ${call.time}</div>
      </div>
      <div style="text-align: right;">
        <span class="badge badge-recovered">Recovered: +$${call.estimatedRevenue}</span>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Duration: ${call.duration} · Sentiment: ${call.sentiment}</div>
      </div>
    </div>

    <!-- Audio Player Mock with Waveform -->
    <div style="background: var(--color-slate-900); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 20px; display: flex; align-items: center; gap: 14px;">
      <button class="btn btn-primary btn-sm" style="border-radius: 50%; width: 34px; height: 34px; padding: 0;" onclick="this.innerHTML = this.innerHTML.includes('▶') ? '❚❚' : '▶'">
        ▶
      </button>
      <div style="flex: 1; display: flex; align-items: center; gap: 3px;">
        ${Array.from({length: 36}).map((_, i) => `
          <div style="flex: 1; height: ${10 + (Math.sin(i * 0.5) + 1) * 12}px; background: ${i < 14 ? 'var(--teal-400)' : 'var(--color-slate-700)'}; border-radius: 2px;"></div>
        `).join('')}
      </div>
      <span style="font-family: var(--font-mono); font-size: 11px; color: var(--color-slate-400);">${call.duration}</span>
    </div>

    <!-- Conversational Transcript -->
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
      ${call.transcript.map(line => `
        <div style="display: flex; flex-direction: column; max-width: 85%; ${line.speaker === 'AI' ? 'align-self: flex-end;' : 'align-self: flex-start;'}">
          <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; margin-bottom: 3px; color: ${line.speaker === 'AI' ? 'var(--teal-700)' : 'var(--color-slate-500)'}; ${line.speaker === 'AI' ? 'text-align: right;' : ''}">
            ${line.speaker === 'AI' ? 'Aesora Voice AI (Receptionist)' : call.patientName + ' (Caller)'}
          </div>
          <div style="padding: 10px 14px; border-radius: var(--radius-md); font-size: 13px; line-height: 1.45; ${line.speaker === 'AI' ? 'background: var(--teal-50); border: 1px solid var(--teal-100); color: var(--teal-900);' : 'background: var(--color-slate-100); color: var(--color-slate-900);'}">
            ${line.text}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Automated Actions Carried Out by AI -->
    <div style="padding: 16px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-slate-700); margin-bottom: 8px;">
        ⚡ Automated Post-Call Actions Executed
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: var(--text-secondary);">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="color: var(--emerald-600); font-weight: 700;">✓</span>
          <span>Matched calendar availability for emergency operatory.</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="color: var(--emerald-600); font-weight: 700;">✓</span>
          <span>Appointment locked on schedule: Confirmed.</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="color: var(--emerald-600); font-weight: 700;">✓</span>
          <span>Dispatched SMS confirmation with address & emergency guidance to ${call.callerId}.</span>
        </div>
      </div>
    </div>
  `;

  return content;
}
