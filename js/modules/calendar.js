/**
 * modules/calendar.js - Multi-Provider & Multi-Chair Appointment Calendar
 */

export function renderCalendar() {
  const store = window.appStore;
  const dentists = store.data.dentists;
  let activeDentistFilter = 'all';
  let activeView = 'day'; // 'day', 'week', 'month'
  let currentDate = '2026-10-12'; // Monday

  const container = document.createElement('div');
  container.className = 'calendar-module-wrap';

  function renderContent() {
    const appointments = store.getAppointments();

    // Filter appointments
    let filteredAppts = appointments;
    if (activeDentistFilter !== 'all') {
      filteredAppts = filteredAppts.filter(a => a.dentistId === activeDentistFilter);
    }

    container.innerHTML = `
      <div class="calendar-controls">
        <div class="calendar-nav-wrap">
          <div class="calendar-current-date">
            ${activeView === 'day' ? 'Monday, Oct 12, 2026' : (activeView === 'week' ? 'Oct 12 - Oct 17, 2026' : 'October 2026')}
          </div>
          <div class="calendar-view-toggle">
            <button class="view-toggle-btn ${activeView === 'day' ? 'active' : ''}" data-view="day">Day</button>
            <button class="view-toggle-btn ${activeView === 'week' ? 'active' : ''}" data-view="week">Week</button>
            <button class="view-toggle-btn ${activeView === 'month' ? 'active' : ''}" data-view="month">Month</button>
          </div>
        </div>

        <!-- Dentist Filter Bar -->
        <div class="provider-filter-bar">
          <div class="provider-filter-chip ${activeDentistFilter === 'all' ? 'active' : ''}" data-dentist="all">
            <span class="provider-dot" style="background-color: var(--teal-600);"></span>
            All Chairs & Providers
          </div>
          ${dentists.map(d => `
            <div class="provider-filter-chip ${activeDentistFilter === d.id ? 'active' : ''}" data-dentist="${d.id}">
              <span class="provider-dot" style="background-color: ${d.color};"></span>
              ${d.name} (${d.chair.split(' ')[0]} ${d.chair.split(' ')[1]})
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary" id="btn-open-book-modal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Schedule Appointment
        </button>
      </div>

      <!-- Calendar Time Grid -->
      <div class="calendar-grid">
        <!-- Header Row -->
        <div class="grid-header-cell">Time</div>
        <div class="grid-header-cell">Chair 1 · Dr. Vance</div>
        <div class="grid-header-cell">Chair 2 · Dr. Thorne</div>
        <div class="grid-header-cell">Chair 3 · Dr. Patel</div>

        <!-- 8:00 AM -->
        ${renderTimeRow("8:00 AM", filteredAppts)}
        <!-- 9:00 AM -->
        ${renderTimeRow("9:00 AM", filteredAppts)}
        <!-- 10:00 AM -->
        ${renderTimeRow("10:00 AM", filteredAppts)}
        <!-- 11:00 AM -->
        ${renderTimeRow("11:00 AM", filteredAppts)}
        <!-- 12:00 PM (Lunch / Emergency Hold) -->
        ${renderTimeRow("12:00 PM", filteredAppts)}
        <!-- 1:00 PM -->
        ${renderTimeRow("1:00 PM", filteredAppts)}
        <!-- 2:00 PM -->
        ${renderTimeRow("2:00 PM", filteredAppts)}
        <!-- 3:00 PM -->
        ${renderTimeRow("3:00 PM", filteredAppts)}
        <!-- 4:00 PM -->
        ${renderTimeRow("4:00 PM", filteredAppts)}
      </div>

      <!-- Notice for Demo Users -->
      <div style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <span><strong style="color:var(--teal-700);">Tip:</strong> Click any appointment block to inspect clinical notes or change status.</span>
          <span><span class="badge badge-ai" style="font-size:10px; padding:2px 6px;">AI Booked</span> Indicates after-hours appointments captured by Aesora.</span>
        </div>
        <div>
          <span>Operating Hours: 8:00 AM – 5:00 PM CST</span>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderTimeRow(timeStr, appts) {
    const timeNum = parseInt(timeStr);
    const isAm = timeStr.includes("AM");

    // Match appointments around this hour for Oct 12 or next day
    function getApptForChair(chairIndex) {
      const operatoryStr = `Chair ${chairIndex}`;
      return appts.find(a => {
        const matchesChair = a.operatory.includes(operatoryStr);
        const matchesTime = a.time.startsWith(timeStr.split(':')[0]) && a.time.includes(isAm ? "AM" : "PM");
        return matchesChair && matchesTime;
      });
    }

    const apptChair1 = getApptForChair(1);
    const apptChair2 = getApptForChair(2);
    const apptChair3 = getApptForChair(3);

    return `
      <div class="grid-time-slot">${timeStr}</div>
      <div class="grid-operatory-cell" data-time="${timeStr}" data-chair-index="1" data-chair-name="Chair 1 (Operatory A)" data-dentist="Dr. Alexander Vance">
        ${apptChair1 ? renderApptCard(apptChair1) : ''}
      </div>
      <div class="grid-operatory-cell" data-time="${timeStr}" data-chair-index="2" data-chair-name="Chair 2 (Operatory B)" data-dentist="Dr. Aris Thorne">
        ${apptChair2 ? renderApptCard(apptChair2) : ''}
      </div>
      <div class="grid-operatory-cell" data-time="${timeStr}" data-chair-index="3" data-chair-name="Chair 3 (Operatory C)" data-dentist="Dr. Clara Patel">
        ${apptChair3 ? renderApptCard(apptChair3) : ''}
      </div>
    `;
  }

  function renderApptCard(appt) {
    const isDoubleBooked = appt.status.includes('Double-Booked');
    return `
      <div class="appt-event-card status-${appt.status.toLowerCase().replace(/[^a-z0-9]/g, '-')} ${isDoubleBooked ? 'status-double-booked' : ''}"
           data-apt-id="${appt.id}"
           draggable="true"
           title="Click to view details or DRAG to reschedule to another chair/time">
        <div class="appt-event-patient">
          <span style="cursor: grab; margin-right: 3px; opacity: 0.6;">⠿</span>
          ${appt.patientName}
          ${appt.isAiBooked ? '<span class="badge badge-ai" style="padding:1px 5px; font-size:9.5px; margin-left:4px;">AI Booked</span>' : ''}
          ${isDoubleBooked ? '<span class="badge badge-alert" style="padding:1px 4px; font-size:9px; margin-left:2px;">⚠️ Conflict Override</span>' : ''}
        </div>
        <div class="appt-event-proc">${appt.treatment}</div>
        <div class="appt-event-footer">
          <span>${appt.time} (${appt.duration})</span>
          <span class="badge badge-${appt.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}" style="font-size:10px; padding:1px 6px;">${appt.status}</span>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    // View toggle buttons
    container.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeView = e.target.getAttribute('data-view');
        renderContent();
      });
    });

    // Dentist filters
    container.querySelectorAll('.provider-filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        activeDentistFilter = chip.getAttribute('data-dentist');
        renderContent();
      });
    });

    // Click on appointment block
    container.querySelectorAll('.appt-event-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (card.classList.contains('dragging')) return;
        const aptId = card.getAttribute('data-apt-id');
        window.openAppointmentModal(aptId);
      });

      // Dragstart & Dragend
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.getAttribute('data-apt-id'));
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => card.classList.add('dragging'), 0);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });

    // Drop zones on operatory cells
    container.querySelectorAll('.grid-operatory-cell').forEach(cell => {
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      cell.addEventListener('dragenter', (e) => {
        e.preventDefault();
        cell.classList.add('drag-over');
      });

      cell.addEventListener('dragleave', (e) => {
        if (!cell.contains(e.relatedTarget)) {
          cell.classList.remove('drag-over');
        }
      });

      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('drag-over');

        const apptId = e.dataTransfer.getData('text/plain');
        if (!apptId) return;

        const targetTime = cell.getAttribute('data-time');
        const targetChair = cell.getAttribute('data-chair-name');
        const targetDentist = cell.getAttribute('data-dentist');

        handleRescheduleDrop(apptId, targetTime, targetChair, targetDentist);
      });
    });

    // Open Book Appointment modal
    const btnBook = container.querySelector('#btn-open-book-modal');
    if (btnBook) {
      btnBook.addEventListener('click', () => {
        window.openBookAppointmentModal();
      });
    }
  }

  // Phase 3: Drag & Drop Reschedule with Double-Booking Conflict Modal
  function handleRescheduleDrop(apptId, targetTime, targetChair, targetDentist) {
    const appt = store.getAppointments().find(a => a.id === apptId);
    if (!appt) return;

    // Check if double booking conflict exists
    const conflict = store.checkSchedulingConflict(currentDate, targetTime, targetChair, apptId);

    if (conflict.hasConflict) {
      const existing = conflict.conflictingAppt;
      openDoubleBookingConflictModal(appt, existing, targetTime, targetChair, targetDentist);
    } else {
      // Direct clean reschedule
      store.rescheduleAppointment(apptId, targetTime, targetChair, targetDentist, false);
      renderContent();
      window.showToast(`✓ Rescheduled ${appt.patientName} to ${targetChair} at ${targetTime}. Automated SMS confirmation sent.`, "success");
    }
  }

  function openDoubleBookingConflictModal(appt, existingAppt, targetTime, targetChair, targetDentist) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header" style="background: var(--crimson-50); border-bottom-color: var(--crimson-200);">
          <div style="display: flex; align-items: center; gap: 8px; color: var(--crimson-800);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h3 class="modal-title" style="color: var(--crimson-800);">Operatory Double-Booking Conflict Detected</h3>
          </div>
          <button class="modal-close-btn" id="btn-close-conflict">✕</button>
        </div>

        <div class="modal-body">
          <p style="font-size: 13.5px; color: var(--color-slate-800); line-height: 1.5;">
            <strong>${targetChair}</strong> is already reserved at <strong>${targetTime}</strong> for:
          </p>

          <div style="margin: 14px 0; padding: 12px 16px; background: var(--color-slate-100); border-radius: var(--radius-md); border-left: 4px solid var(--crimson-600);">
            <div style="font-weight: 700; color: var(--color-slate-900);">${existingAppt.patientName}</div>
            <div style="font-size: 12px; color: var(--color-slate-600);">${existingAppt.treatment} · Provider: ${existingAppt.dentistName}</div>
            <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Reserved Duration: ${existingAppt.duration}</div>
          </div>

          <p style="font-size: 13px; color: var(--color-slate-600);">
            Moving <strong>${appt.patientName}</strong> (${appt.treatment}) here would create a chair overlap. How would you like to proceed?
          </p>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-conflict">Cancel Move</button>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="btn-open-chair2" style="border-color: var(--teal-600); color: var(--teal-800);">
              Move to Open Chair (Chair 2)
            </button>
            <button class="btn btn-primary btn-sm" id="btn-force-double-book" style="background: var(--crimson-600); border-color: var(--crimson-600);">
              Force Double-Booking (Emergency Override)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('#btn-close-conflict').addEventListener('click', close);
    modal.querySelector('#btn-cancel-conflict').addEventListener('click', close);

    // Alternative Chair
    modal.querySelector('#btn-open-chair2').addEventListener('click', () => {
      store.rescheduleAppointment(appt.id, targetTime, "Chair 2 (Operatory B)", "Dr. Aris Thorne", false);
      close();
      renderContent();
      window.showToast(`✓ Resolved: Moved ${appt.patientName} to available Chair 2 at ${targetTime}.`, "success");
    });

    // Emergency Override
    modal.querySelector('#btn-force-double-book').addEventListener('click', () => {
      store.rescheduleAppointment(appt.id, targetTime, targetChair, targetDentist, true);
      close();
      renderContent();
      window.showToast(`⚠️ Emergency Double-Booking logged for ${appt.patientName} in ${targetChair}.`, "success");
    });
  }

  renderContent();
  return container;
}
