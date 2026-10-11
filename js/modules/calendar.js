/**
 * modules/calendar.js - Multi-Provider & Multi-Chair Appointment Calendar
 * Supports Day, Week, and Month Views, Date Navigation, Drag & Drop, and Collision Detection.
 */

export function renderCalendar() {
  const store = window.appStore;
  const dentists = store.data.dentists;
  let activeDentistFilter = 'all';
  let activeView = 'day'; // 'day', 'week', 'month'
  let currentDate = '2026-10-12'; // Monday default demo anchor

  const container = document.createElement('div');
  container.className = 'calendar-module-wrap';

  function formatDateHeading(dateStr, view) {
    const d = new Date(dateStr + 'T00:00:00');
    if (view === 'day') {
      const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
      return d.toLocaleDateString('en-US', options);
    } else if (view === 'week') {
      // Find Monday and Saturday of this week
      const day = d.getDay();
      const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
      const mon = new Date(d);
      mon.setDate(diffToMon);
      const sat = new Date(mon);
      sat.setDate(mon.getDate() + 5);

      return `${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sat.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }

  function adjustDate(deltaDays) {
    const d = new Date(currentDate + 'T00:00:00');
    if (activeView === 'day') {
      d.setDate(d.getDate() + deltaDays);
    } else if (activeView === 'week') {
      d.setDate(d.getDate() + (deltaDays * 7));
    } else if (activeView === 'month') {
      d.setMonth(d.getMonth() + (deltaDays > 0 ? 1 : -1));
    }
    currentDate = d.toISOString().split('T')[0];
    renderContent();
  }

  function renderContent() {
    const appointments = store.getAppointments();

    // Filter appointments by dentist if selected
    let filteredAppts = appointments;
    if (activeDentistFilter !== 'all') {
      filteredAppts = filteredAppts.filter(a => a.dentistId === activeDentistFilter);
    }

    container.innerHTML = `
      <div class="calendar-controls">
        <div class="calendar-nav-wrap">
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="cal-prev" style="padding: 4px 10px;" title="Previous">◀</button>
            <button class="btn btn-secondary btn-sm" id="cal-today" style="padding: 4px 10px; font-weight: 600;">Today</button>
            <button class="btn btn-secondary btn-sm" id="cal-next" style="padding: 4px 10px;" title="Next">▶</button>
            <input type="date" id="cal-picker" class="form-input" style="width: auto; padding: 4px 8px; font-size: 12px;" value="${currentDate}">
          </div>

          <div class="calendar-current-date" style="margin-left: 10px;">
            ${formatDateHeading(currentDate, activeView)}
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

      <!-- Dynamic View Container (Day / Week / Month) -->
      ${activeView === 'day' ? renderDayGrid(filteredAppts) : (activeView === 'week' ? renderWeekGrid(filteredAppts) : renderMonthGrid(filteredAppts))}

      <!-- Notice & Keyboard Shortcuts -->
      <div style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-muted); flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
          <span><strong style="color:var(--teal-700);">💡 Tip:</strong> Click an empty operatory slot to book directly, or <strong>DRAG</strong> any card to reschedule chairs/times.</span>
          <span><span class="badge badge-ai" style="font-size:10px; padding:2px 6px;">AI Booked</span> Auto-captured after-hours by Aesora.</span>
        </div>
        <div>
          <span>Clinical Hours: 8:00 AM – 5:00 PM CST · 3 Active Operatories</span>
        </div>
      </div>
    `;

    attachEvents();
  }

  // --- DAY VIEW ---
  function renderDayGrid(appts) {
    const dayAppts = appts.filter(a => a.date === currentDate || a.date === 'Today');

    const hours = [
      "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
      "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
    ];

    return `
      <div class="calendar-grid">
        <div class="grid-header-cell">Time</div>
        <div class="grid-header-cell">Chair 1 · Dr. Vance (Surgical/Restorative)</div>
        <div class="grid-header-cell">Chair 2 · Dr. Thorne (Endodontics)</div>
        <div class="grid-header-cell">Chair 3 · Dr. Patel (General & Family)</div>

        ${hours.map(timeStr => renderDayTimeRow(timeStr, dayAppts)).join('')}
      </div>
    `;
  }

  function renderDayTimeRow(timeStr, appts) {
    const isAm = timeStr.includes("AM");

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
      <div class="grid-operatory-cell ${!apptChair1 ? 'empty-bookable' : ''}" data-time="${timeStr}" data-chair-index="1" data-chair-name="Chair 1 (Operatory A)" data-dentist="Dr. Alexander Vance" title="${!apptChair1 ? 'Click to book Chair 1 at ' + timeStr : ''}">
        ${apptChair1 ? renderApptCard(apptChair1) : '<span class="empty-slot-hint">+ Book Slot</span>'}
      </div>
      <div class="grid-operatory-cell ${!apptChair2 ? 'empty-bookable' : ''}" data-time="${timeStr}" data-chair-index="2" data-chair-name="Chair 2 (Operatory B)" data-dentist="Dr. Aris Thorne" title="${!apptChair2 ? 'Click to book Chair 2 at ' + timeStr : ''}">
        ${apptChair2 ? renderApptCard(apptChair2) : '<span class="empty-slot-hint">+ Book Slot</span>'}
      </div>
      <div class="grid-operatory-cell ${!apptChair3 ? 'empty-bookable' : ''}" data-time="${timeStr}" data-chair-index="3" data-chair-name="Chair 3 (Operatory C)" data-dentist="Dr. Clara Patel" title="${!apptChair3 ? 'Click to book Chair 3 at ' + timeStr : ''}">
        ${apptChair3 ? renderApptCard(apptChair3) : '<span class="empty-slot-hint">+ Book Slot</span>'}
      </div>
    `;
  }

  // --- WEEK VIEW ---
  function renderWeekGrid(appts) {
    const curr = new Date(currentDate + 'T00:00:00');
    const day = curr.getDay();
    const diffToMon = curr.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(curr);
    mon.setDate(diffToMon);

    const weekDays = [];
    for (let i = 0; i < 6; i++) { // Mon - Sat
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      weekDays.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: d.toISOString().split('T')[0] === currentDate
      });
    }

    return `
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; min-height: 480px; background: var(--bg-surface-subtle); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        ${weekDays.map(wd => {
          const dayAppts = appts.filter(a => a.date === wd.dateStr);
          return `
            <div style="display: flex; flex-direction: column; background: #FFFFFF; border-radius: var(--radius-md); border: 1px solid ${wd.isToday ? 'var(--teal-500)' : 'var(--border-subtle)'}; overflow: hidden; box-shadow: ${wd.isToday ? '0 0 0 2px rgba(13,148,136,0.15)' : 'none'};">
              <div style="padding: 10px 12px; background: ${wd.isToday ? 'rgba(13,148,136,0.1)' : 'var(--color-slate-50)'}; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; font-size: 13px; color: ${wd.isToday ? 'var(--teal-800)' : 'var(--text-primary)'};">${wd.dayName}</span>
                <span style="font-size: 14px; font-weight: 800; color: ${wd.isToday ? 'var(--teal-700)' : 'var(--color-slate-600)'};">${wd.dayNum}</span>
              </div>
              <div style="flex: 1; padding: 10px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto;">
                ${dayAppts.length === 0 ? `
                  <div style="font-size: 11.5px; color: var(--text-muted); text-align: center; margin-top: 20px;">
                    No bookings
                  </div>
                ` : dayAppts.map(a => `
                  <div class="appt-event-card status-${a.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}" data-apt-id="${a.id}" style="padding: 8px 10px; cursor: pointer;">
                    <div style="font-size: 11.5px; font-weight: 700; color: var(--teal-900);">${a.time}</div>
                    <div style="font-weight: 700; font-size: 12px; color: var(--text-primary); margin: 2px 0;">${a.patientName}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${a.treatment}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                      <span style="font-size: 10px; color: var(--teal-700); font-weight: 600;">${a.operatory.split(' ')[0]} ${a.operatory.split(' ')[1]}</span>
                      <span class="badge badge-${a.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}" style="font-size: 9.5px; padding: 1px 4px;">${a.status}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div style="padding: 8px; border-top: 1px solid var(--border-subtle); text-align: center;">
                <button class="btn btn-secondary btn-sm btn-quick-book-day" data-date="${wd.dateStr}" style="width: 100%; font-size: 11px; padding: 4px 6px;">
                  + Add Booking
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- MONTH VIEW ---
  function renderMonthGrid(appts) {
    const curr = new Date(currentDate + 'T00:00:00');
    const year = curr.getFullYear();
    const month = curr.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return `
      <div style="background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden; padding: 16px;">
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center; font-weight: 700; font-size: 12px; color: var(--color-slate-500); padding-bottom: 10px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 10px;">
          ${dayHeaders.map(dh => `<div>${dh}</div>`).join('')}
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">
          ${Array.from({ length: firstDay }).map(() => `
            <div style="height: 85px; background: var(--color-slate-50); border-radius: var(--radius-md); opacity: 0.5;"></div>
          `).join('')}
          ${Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayAppts = appts.filter(a => a.date === dayStr);
            const isSelected = dayStr === currentDate;

            return `
              <div class="month-day-cell" data-date="${dayStr}" style="height: 85px; background: #FFFFFF; border: 1px solid ${isSelected ? 'var(--teal-500)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); padding: 6px; display: flex; flex-direction: column; cursor: pointer; transition: all 0.15s; ${isSelected ? 'box-shadow: 0 0 0 2px rgba(13,148,136,0.2);' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 800; font-size: 12px; color: ${isSelected ? 'var(--teal-700)' : 'var(--text-primary)'};">${dayNum}</span>
                  ${dayAppts.length > 0 ? `<span class="badge badge-teal" style="font-size: 9.5px; padding: 1px 5px;">${dayAppts.length} appt</span>` : ''}
                </div>
                <div style="flex: 1; overflow-y: auto; margin-top: 4px; display: flex; flex-direction: column; gap: 3px;">
                  ${dayAppts.slice(0, 2).map(a => `
                    <div style="font-size: 10px; font-weight: 600; background: rgba(13,148,136,0.1); color: var(--teal-800); border-radius: 3px; padding: 1px 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${a.time.split(' ')[0]} ${a.patientName.split(' ')[0]}
                    </div>
                  `).join('')}
                  ${dayAppts.length > 2 ? `<div style="font-size: 9.5px; color: var(--text-muted); text-align: center;">+${dayAppts.length - 2} more</div>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
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
    // Date Navigation
    const btnPrev = container.querySelector('#cal-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => adjustDate(-1));

    const btnNext = container.querySelector('#cal-next');
    if (btnNext) btnNext.addEventListener('click', () => adjustDate(1));

    const btnToday = container.querySelector('#cal-today');
    if (btnToday) btnToday.addEventListener('click', () => {
      currentDate = '2026-10-12';
      renderContent();
    });

    const calPicker = container.querySelector('#cal-picker');
    if (calPicker) calPicker.addEventListener('change', (e) => {
      currentDate = e.target.value;
      renderContent();
    });

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

    // Click on empty bookable cell in Day view
    container.querySelectorAll('.grid-operatory-cell.empty-bookable').forEach(cell => {
      cell.addEventListener('click', (e) => {
        if (e.target.closest('.appt-event-card')) return;
        const time = cell.getAttribute('data-time');
        const chair = cell.getAttribute('data-chair-name');
        window.openBookAppointmentModal(null, { date: currentDate, time, chair });
      });
    });

    // Quick book in Week view
    container.querySelectorAll('.btn-quick-book-day').forEach(btn => {
      btn.addEventListener('click', () => {
        const date = btn.getAttribute('data-date');
        window.openBookAppointmentModal(null, { date });
      });
    });

    // Click day cell in Month view switches to Day view
    container.querySelectorAll('.month-day-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        currentDate = cell.getAttribute('data-date');
        activeView = 'day';
        renderContent();
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
        window.openBookAppointmentModal(null, { date: currentDate });
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
