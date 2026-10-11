/**
 * appointmentsController.js - Multi-Chair Appointment Scheduling & Conflict Engine
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getAppointments(req, res) {
  try {
    const { date, operatory, dentistId, patientId } = req.query;
    let query = 'SELECT data FROM appointments WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    if (operatory) {
      query += ' AND operatory LIKE ?';
      params.push(`%${operatory}%`);
    }

    if (dentistId) {
      query += ' AND dentistId = ?';
      params.push(dentistId);
    }

    if (patientId) {
      query += ' AND patientId = ?';
      params.push(patientId);
    }

    query += ' ORDER BY date ASC, time ASC';

    const rows = db.prepare(query).all(...params);
    const appointments = rows.map(r => JSON.parse(r.data));

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT data FROM appointments WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.json({ success: true, data: JSON.parse(row.data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createAppointment(req, res) {
  try {
    const payload = req.body;
    if (!payload.patientName || !payload.date || !payload.time || !payload.operatory) {
      return res.status(400).json({
        success: false,
        error: 'Missing required appointment fields (patientName, date, time, operatory)'
      });
    }

    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM appointments').get();
    const newId = payload.id || `apt-${100 + countRow.cnt + 1}`;

    const newAppt = {
      id: newId,
      patientId: payload.patientId || 'P-GUEST',
      patientName: payload.patientName,
      dentistId: payload.dentistId || 'd-1',
      dentistName: payload.dentistName || 'Dr. Alexander Vance',
      operatory: payload.operatory,
      treatment: payload.treatment || 'Consultation & Examination',
      date: payload.date,
      time: payload.time,
      duration: payload.duration || '45 min',
      status: payload.status || 'Confirmed',
      isAiBooked: !!payload.isAiBooked,
      notes: payload.notes || ''
    };

    db.prepare(`
      INSERT INTO appointments (id, patientId, patientName, dentistId, dentistName, operatory, date, time, status, isAiBooked, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newAppt.id,
      newAppt.patientId,
      newAppt.patientName,
      newAppt.dentistId,
      newAppt.dentistName,
      newAppt.operatory,
      newAppt.date,
      newAppt.time,
      newAppt.status,
      newAppt.isAiBooked ? 1 : 0,
      JSON.stringify(newAppt)
    );

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Staff',
      role: 'Calendar Scheduler',
      action: 'Appointment Created',
      details: `${newAppt.patientName} scheduled for ${newAppt.treatment} on ${newAppt.date} at ${newAppt.time} (${newAppt.operatory})`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('APPOINTMENT_CREATED', newAppt);

    res.status(201).json({ success: true, data: newAppt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT data FROM appointments WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    const currentData = JSON.parse(existing.data);
    const updated = { ...currentData, ...req.body, id };

    db.prepare(`
      UPDATE appointments 
      SET patientId = ?, patientName = ?, dentistId = ?, dentistName = ?, operatory = ?, date = ?, time = ?, status = ?, isAiBooked = ?, data = ?
      WHERE id = ?
    `).run(
      updated.patientId,
      updated.patientName,
      updated.dentistId,
      updated.dentistName,
      updated.operatory,
      updated.date,
      updated.time,
      updated.status,
      updated.isAiBooked ? 1 : 0,
      JSON.stringify(updated),
      id
    );

    broadcast('APPOINTMENT_UPDATED', updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT data FROM appointments WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
    broadcast('APPOINTMENT_DELETED', { id });

    res.json({ success: true, message: `Appointment ${id} removed` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Checks for chair or provider scheduling collisions
 */
export function checkConflict(req, res) {
  try {
    const { date, time, operatory, ignoreApptId } = req.body;
    if (!date || !time || !operatory) {
      return res.status(400).json({ success: false, error: 'date, time, and operatory are required' });
    }

    const rows = db.prepare('SELECT data FROM appointments WHERE date = ? AND status != ?').all(date, 'Cancelled');
    const existingList = rows.map(r => JSON.parse(r.data));

    const conflict = existingList.find(a => {
      if (ignoreApptId && a.id === ignoreApptId) return false;
      const isSameTime = a.time.split(':')[0] === time.split(':')[0] && a.time.includes(time.includes('AM') ? 'AM' : 'PM');
      const isSameChair = a.operatory.toLowerCase().includes(operatory.toLowerCase());
      return isSameTime && isSameChair;
    });

    res.json({
      success: true,
      hasConflict: !!conflict,
      conflictingAppt: conflict || null
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Drag-and-drop or modal appointment rescheduling
 */
export function rescheduleAppointment(req, res) {
  try {
    const { id } = req.params;
    const { newTime, newOperatory, newDentistName, isDoubleBooked = false } = req.body;

    const existing = db.prepare('SELECT data FROM appointments WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    const appt = JSON.parse(existing.data);
    const oldTime = appt.time;
    const oldChair = appt.operatory;

    appt.time = newTime || appt.time;
    appt.operatory = newOperatory || appt.operatory;
    if (newDentistName) appt.dentistName = newDentistName;

    if (isDoubleBooked) {
      appt.status = 'Double-Booked (Override)';
    } else if (appt.status.includes('Double-Booked')) {
      appt.status = 'Confirmed';
    }

    db.prepare(`
      UPDATE appointments
      SET time = ?, operatory = ?, dentistName = ?, status = ?, data = ?
      WHERE id = ?
    `).run(appt.time, appt.operatory, appt.dentistName, appt.status, JSON.stringify(appt), id);

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Dr. Alexander Vance, DDS',
      role: 'Clinic Owner',
      action: 'Appointment Rescheduled',
      details: `${appt.patientName} moved from ${oldChair} (${oldTime}) to ${appt.operatory} (${appt.time}) ${isDoubleBooked ? '[Emergency Double-Booking Override]' : ''}`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    // Simulated SMS dispatch
    const commId = 'comm-' + Date.now();
    const comm = {
      id: commId,
      patientId: appt.patientId,
      patientName: appt.patientName,
      destination: '(512) 555-0182',
      type: 'SMS',
      message: `Beacon Peak Dental: Hi ${appt.patientName.split(' ')[0]}, your appointment has been updated to ${appt.time} in ${appt.operatory}. Reply C to confirm.`,
      timestamp: 'Just now',
      status: 'Delivered',
      carrier: 'Twilio Carrier Network',
      latency: '310ms'
    };
    db.prepare('INSERT INTO communications (id, patientId, type, destination, timestamp, data) VALUES (?, ?, ?, ?, ?, ?)')
      .run(comm.id, comm.patientId, comm.type, comm.destination, comm.timestamp, JSON.stringify(comm));

    broadcast('APPOINTMENT_RESCHEDULED', { appointment: appt, communication: comm });

    res.json({ success: true, data: appt, communication: comm });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
