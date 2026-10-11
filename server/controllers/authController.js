/**
 * authController.js - Current User Session & Persona Switcher
 */

import { db } from '../config/db.js';

export function getUsers(req, res) {
  try {
    const rows = db.prepare('SELECT data FROM users').all();
    const users = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getCurrentUser(req, res) {
  try {
    const session = db.prepare('SELECT userId FROM current_user_session WHERE id = ?').get('session');
    const userId = session ? session.userId : 'usr-1';

    const row = db.prepare('SELECT data FROM users WHERE id = ?').get(userId);
    const user = row ? JSON.parse(row.data) : null;

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function switchUser(req, res) {
  try {
    const { roleKey, userId } = req.body;

    let targetUser = null;
    if (userId) {
      const row = db.prepare('SELECT data FROM users WHERE id = ?').get(userId);
      if (row) targetUser = JSON.parse(row.data);
    } else if (roleKey) {
      const row = db.prepare('SELECT data FROM users WHERE roleKey = ?').get(roleKey);
      if (row) targetUser = JSON.parse(row.data);
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User persona not found' });
    }

    db.prepare('INSERT OR REPLACE INTO current_user_session (id, userId) VALUES (?, ?)').run('session', targetUser.id);

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditEntry = {
      id: auditId,
      user: targetUser.name,
      role: targetUser.role,
      action: 'Persona Switched',
      details: `Active session switched to ${targetUser.name} (${targetUser.role})`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditEntry.action, auditEntry.user, auditEntry.timestamp, JSON.stringify(auditEntry));

    res.json({ success: true, data: targetUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
