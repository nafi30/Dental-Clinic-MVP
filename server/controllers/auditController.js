/**
 * auditController.js - HIPAA Security Trail & Chronological Action Log
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getAuditLogs(req, res) {
  try {
    const rows = db.prepare('SELECT data FROM audit_log ORDER BY id DESC LIMIT 100').all();
    const logs = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createAuditLog(req, res) {
  try {
    const { action, details, user, role } = req.body;
    if (!action) {
      return res.status(400).json({ success: false, error: 'action is required' });
    }

    const auditId = 'aud-' + Date.now();
    const newLog = {
      id: auditId,
      user: user || 'Dr. Alexander Vance, DDS',
      role: role || 'Clinic Owner',
      action,
      details: details || '',
      timestamp: 'Just now',
      ip: req.ip || '192.168.1.104'
    };

    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(newLog.id, newLog.action, newLog.user, newLog.timestamp, JSON.stringify(newLog));

    broadcast('AUDIT_LOG_ADDED', newLog);

    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
