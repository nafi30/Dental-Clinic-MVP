/**
 * odontogramsController.js - 32-Tooth Anatomical Charting & Condition Tags
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getOdontogram(req, res) {
  try {
    const { patientId } = req.params;
    const row = db.prepare('SELECT data FROM odontograms WHERE patientId = ?').get(patientId);

    if (!row) {
      // Return default clean chart if not recorded yet
      const defaultChart = {
        patientId,
        notes: 'Routine dentition chart.',
        toothStatuses: {}
      };
      return res.json({ success: true, data: defaultChart });
    }

    res.json({ success: true, data: JSON.parse(row.data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function updateOdontogram(req, res) {
  try {
    const { patientId } = req.params;
    const { notes, toothStatuses } = req.body;

    const existingRow = db.prepare('SELECT data FROM odontograms WHERE patientId = ?').get(patientId);
    let chart = existingRow ? JSON.parse(existingRow.data) : { patientId, notes: '', toothStatuses: {} };

    if (notes !== undefined) chart.notes = notes;
    if (toothStatuses) chart.toothStatuses = { ...chart.toothStatuses, ...toothStatuses };

    db.prepare('INSERT OR REPLACE INTO odontograms (patientId, data) VALUES (?, ?)')
      .run(patientId, JSON.stringify(chart));

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Dr. Alexander Vance, DDS',
      role: 'Clinic Owner',
      action: 'Odontogram Updated',
      details: `Full dental chart updated for patient ${patientId}`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('ODONTOGRAM_UPDATED', chart);

    res.json({ success: true, data: chart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function updateToothStatus(req, res) {
  try {
    const { patientId } = req.params;
    const { toothNumber, status, notes } = req.body;

    if (!toothNumber || !status) {
      return res.status(400).json({ success: false, error: 'toothNumber and status are required' });
    }

    const existingRow = db.prepare('SELECT data FROM odontograms WHERE patientId = ?').get(patientId);
    let chart = existingRow ? JSON.parse(existingRow.data) : { patientId, notes: '', toothStatuses: {} };

    chart.toothStatuses[toothNumber] = status;
    if (notes !== undefined) chart.notes = notes;

    db.prepare('INSERT OR REPLACE INTO odontograms (patientId, data) VALUES (?, ?)')
      .run(patientId, JSON.stringify(chart));

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Dr. Alexander Vance, DDS',
      role: 'Clinic Owner',
      action: 'Odontogram Tooth Updated',
      details: `Tooth #${toothNumber} marked as ${status} for patient ${patientId}`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('ODONTOGRAM_TOOTH_UPDATED', { patientId, toothNumber, status, chart });

    res.json({ success: true, data: chart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
