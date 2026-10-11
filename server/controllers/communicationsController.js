/**
 * communicationsController.js - Two-Way SMS & Email Gateway Simulation
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getCommunications(req, res) {
  try {
    const { patientId } = req.query;
    let query = 'SELECT data FROM communications WHERE 1=1';
    const params = [];

    if (patientId) {
      query += ' AND patientId = ?';
      params.push(patientId);
    }

    query += ' ORDER BY id DESC';

    const rows = db.prepare(query).all(...params);
    const comms = rows.map(r => JSON.parse(r.data));

    res.json({ success: true, count: comms.length, data: comms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function sendCommunication(req, res) {
  try {
    const { patientId, type = 'SMS', message = '' } = req.body;

    let patientName = 'Patient';
    let destination = type === 'SMS' ? '+1 (512) 555-0100' : 'patient@example.com';

    if (patientId) {
      const pRow = db.prepare('SELECT data FROM patients WHERE id = ?').get(patientId);
      if (pRow) {
        const patient = JSON.parse(pRow.data);
        patientName = patient.name;
        destination = type === 'SMS' ? (patient.phone || destination) : (patient.email || destination);
      }
    }

    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM communications').get();
    const commId = `comm-${100 + countRow.cnt + 1}`;

    const comm = {
      id: commId,
      patientId: patientId || 'P-GUEST',
      patientName,
      destination,
      type,
      message,
      timestamp: 'Just now',
      status: 'Delivered',
      carrier: type === 'SMS' ? 'Twilio Carrier Network (AT&T / Verizon)' : 'SendGrid Dedicated Medical IP',
      latency: `${Math.floor(250 + Math.random() * 150)}ms`
    };

    db.prepare('INSERT INTO communications (id, patientId, type, destination, timestamp, data) VALUES (?, ?, ?, ?, ?, ?)')
      .run(comm.id, comm.patientId, comm.type, comm.destination, comm.timestamp, JSON.stringify(comm));

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Maya Lin',
      role: 'Front Desk Lead',
      action: `Outbound ${type} Dispatched`,
      details: `Sent to ${comm.patientName} (${comm.destination})`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('COMMUNICATION_SENT', comm);

    res.status(201).json({ success: true, data: comm });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
