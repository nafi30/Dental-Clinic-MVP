/**
 * prescriptionsController.js - Dental Pharmacology & Allergy Contraindication Guard
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getPrescriptions(req, res) {
  try {
    const { patientId } = req.query;
    let query = 'SELECT data FROM prescriptions WHERE 1=1';
    const params = [];

    if (patientId) {
      query += ' AND patientId = ?';
      params.push(patientId);
    }

    query += ' ORDER BY id DESC';

    const rows = db.prepare(query).all(...params);
    const prescriptions = rows.map(r => JSON.parse(r.data));

    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createPrescription(req, res) {
  try {
    const payload = req.body;
    if (!payload.patientId || !payload.medication) {
      return res.status(400).json({ success: false, error: 'patientId and medication are required' });
    }

    // Check allergy contraindications against patient medical history
    let contraindicationAlert = null;
    const patientRow = db.prepare('SELECT data FROM patients WHERE id = ?').get(payload.patientId);
    if (patientRow) {
      const patient = JSON.parse(patientRow.data);
      const allergies = (patient.medicalHistory && patient.medicalHistory.allergies) || [];
      const medLower = payload.medication.toLowerCase();

      const hasPenicillinAllergy = allergies.some(a => a.toLowerCase().includes('penicillin') || a.toLowerCase().includes('amoxicillin'));
      const isBetaLactam = medLower.includes('amoxicillin') || medLower.includes('penicillin') || medLower.includes('augmentin');

      if (hasPenicillinAllergy && isBetaLactam) {
        contraindicationAlert = {
          level: 'SEVERE_WARNING',
          message: `CONTRAINDICATION ALERT: Patient ${patient.name} has a recorded allergy to Penicillin/Beta-lactams. Use Clindamycin or Azithromycin instead.`
        };
      }
    }

    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM prescriptions').get();
    const newId = payload.id || `RX-${8400 + countRow.cnt + 1}`;

    const newRx = {
      id: newId,
      patientId: payload.patientId,
      patientName: payload.patientName || 'Patient',
      dentistName: payload.dentistName || 'Dr. Aris Thorne, DMD',
      medication: payload.medication,
      dosage: payload.dosage || '',
      sig: payload.sig || 'As directed',
      quantity: payload.quantity || '1 bottle',
      refills: payload.refills !== undefined ? payload.refills : 0,
      date: payload.date || new Date().toISOString().split('T')[0],
      status: payload.status || 'Active',
      indication: payload.indication || 'Prophylaxis / Dental pain relief'
    };

    db.prepare('INSERT INTO prescriptions (id, patientId, patientName, medication, date, status, data) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(newRx.id, newRx.patientId, newRx.patientName, newRx.medication, newRx.date, newRx.status, JSON.stringify(newRx));

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: newRx.dentistName,
      role: 'Associate Dentist',
      action: 'Prescription Issued',
      details: `${newRx.medication} prescribed to ${newRx.patientName} (${newRx.id})`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('PRESCRIPTION_CREATED', newRx);

    res.status(201).json({
      success: true,
      data: newRx,
      contraindicationAlert
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
