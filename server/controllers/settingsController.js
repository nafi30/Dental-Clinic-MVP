/**
 * settingsController.js - Practice Metadata, Operatories & Voice AI Answering Settings
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getSettings(req, res) {
  try {
    const row = db.prepare('SELECT data FROM settings WHERE id = ?').get('clinic_settings');
    res.json({ success: true, data: row ? JSON.parse(row.data) : {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function updateSettings(req, res) {
  try {
    const existing = db.prepare('SELECT data FROM settings WHERE id = ?').get('clinic_settings');
    const current = existing ? JSON.parse(existing.data) : {};
    const updated = { ...current, ...req.body };

    db.prepare('INSERT OR REPLACE INTO settings (id, data) VALUES (?, ?)')
      .run('clinic_settings', JSON.stringify(updated));

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Dr. Alexander Vance, DDS',
      role: 'Clinic Owner',
      action: 'Clinic Settings Saved',
      details: 'Practice configuration and AI thresholds updated',
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('SETTINGS_UPDATED', updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getDentists(req, res) {
  try {
    const rows = db.prepare('SELECT data FROM dentists').all();
    const dentists = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, count: dentists.length, data: dentists });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
