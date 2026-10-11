/**
 * filesController.js - Diagnostic Imaging, Radiographs & Lightbox Assets
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}_${baseName}${ext}`);
  }
});

export const uploadMiddleware = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

export function getFiles(req, res) {
  try {
    const { patientId, type } = req.query;
    let query = 'SELECT data FROM files WHERE 1=1';
    const params = [];

    if (patientId && patientId !== 'all') {
      query += ' AND patientId = ?';
      params.push(patientId);
    }

    if (type && type !== 'all') {
      query += ' AND type LIKE ?';
      params.push(`%${type}%`);
    }

    query += ' ORDER BY id DESC';

    const rows = db.prepare(query).all(...params);
    const files = rows.map(r => JSON.parse(r.data));

    res.json({ success: true, count: files.length, data: files });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createFile(req, res) {
  try {
    const payload = req.body;
    const file = req.file;

    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM files').get();
    const newId = payload.id || `file-${100 + countRow.cnt + 1}`;

    const newFile = {
      id: newId,
      patientId: payload.patientId || 'P-1001',
      patientName: payload.patientName || 'Patient',
      type: payload.type || 'Bitewing Radiograph',
      title: payload.title || (file ? file.originalname : 'Diagnostic Scan'),
      filename: file ? file.filename : (payload.filename || 'radiograph.png'),
      date: payload.date || new Date().toISOString().split('T')[0],
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : (payload.size || '3.2 MB'),
      dentist: payload.dentist || 'Dr. Alexander Vance',
      notes: payload.notes || 'Diagnostic radiograph survey.',
      thumbnail: payload.thumbnail || (payload.type && payload.type.includes('CBCT') ? 'xray-cbct' : 'xray-bitewing'),
      url: file ? `/uploads/${file.filename}` : undefined
    };

    db.prepare('INSERT INTO files (id, patientId, type, title, date, data) VALUES (?, ?, ?, ?, ?, ?)')
      .run(newFile.id, newFile.patientId, newFile.type, newFile.title, newFile.date, JSON.stringify(newFile));

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Dr. Alexander Vance, DDS',
      role: 'Clinic Owner',
      action: 'Clinical File Uploaded',
      details: `${newFile.title} (${newFile.type}) attached to patient ${newFile.patientId}`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('FILE_UPLOADED', newFile);

    res.status(201).json({ success: true, data: newFile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function deleteFile(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT data FROM files WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    db.prepare('DELETE FROM files WHERE id = ?').run(id);
    broadcast('FILE_DELETED', { id });

    res.json({ success: true, message: `File ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
