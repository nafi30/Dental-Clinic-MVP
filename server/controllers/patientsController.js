/**
 * patientsController.js - Patient EDR & CRM Management
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getPatients(req, res) {
  try {
    const { search, status } = req.query;
    let query = 'SELECT data FROM patients WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC';

    const rows = db.prepare(query).all(...params);
    const patients = rows.map(r => JSON.parse(r.data));

    res.json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT data FROM patients WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true, data: JSON.parse(row.data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createPatient(req, res) {
  try {
    const payload = req.body;
    if (!payload.name) {
      return res.status(400).json({ success: false, error: 'Patient name is required' });
    }

    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM patients').get();
    const newId = payload.id || `P-${1000 + countRow.cnt + 1}`;

    const newPatient = {
      id: newId,
      name: payload.name,
      age: payload.age || 0,
      gender: payload.gender || 'Unspecified',
      dob: payload.dob || '',
      phone: payload.phone || '',
      email: payload.email || '',
      address: payload.address || '',
      emergencyContact: payload.emergencyContact || '',
      bloodGroup: payload.bloodGroup || 'O+',
      status: payload.status || 'Active',
      balance: payload.balance || '$0.00',
      medicalHistory: payload.medicalHistory || {
        conditions: [],
        dentalHistory: '',
        allergies: ['NKDA'],
        habits: []
      },
      lastVisit: payload.lastVisit || 'New Patient',
      nextAppointment: payload.nextAppointment || 'None Scheduled'
    };

    db.prepare('INSERT INTO patients (id, name, phone, email, status, balance, data) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(newPatient.id, newPatient.name, newPatient.phone, newPatient.email, newPatient.status, newPatient.balance, JSON.stringify(newPatient));

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Staff',
      role: 'Receptionist / EDR',
      action: 'Patient Registered',
      details: `Created new patient chart for ${newPatient.name} (${newPatient.id})`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('PATIENT_CREATED', newPatient);

    res.status(201).json({ success: true, data: newPatient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT data FROM patients WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const currentData = JSON.parse(existing.data);
    const updated = { ...currentData, ...req.body, id };

    db.prepare('UPDATE patients SET name = ?, phone = ?, email = ?, status = ?, balance = ?, data = ? WHERE id = ?')
      .run(updated.name, updated.phone, updated.email, updated.status, updated.balance, JSON.stringify(updated), id);

    broadcast('PATIENT_UPDATED', updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT data FROM patients WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    db.prepare('DELETE FROM patients WHERE id = ?').run(id);
    broadcast('PATIENT_DELETED', { id });

    res.json({ success: true, message: `Patient ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function checkDuplicatePatient(req, res) {
  try {
    const { name = '', phone = '', email = '' } = req.query;

    const cleanName = name.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName && !cleanPhone && !cleanEmail) {
      return res.json({ success: true, duplicates: [] });
    }

    const rows = db.prepare('SELECT data FROM patients').all();
    const allPatients = rows.map(r => JSON.parse(r.data));

    const matches = allPatients.filter(p => {
      const pName = (p.name || '').toLowerCase();
      const pPhone = (p.phone || '').replace(/\D/g, '');
      const pEmail = (p.email || '').toLowerCase();

      const nameMatch = cleanName.length >= 3 && (pName.includes(cleanName) || cleanName.includes(pName));
      const phoneMatch = cleanPhone.length >= 7 && pPhone.includes(cleanPhone);
      const emailMatch = cleanEmail.length >= 5 && pEmail === cleanEmail;

      return nameMatch || phoneMatch || emailMatch;
    });

    res.json({
      success: true,
      hasDuplicates: matches.length > 0,
      duplicates: matches
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
