/**
 * billingController.js - Dental Invoicing, Balances & Payment Processing
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getInvoices(req, res) {
  try {
    const { patientId } = req.query;
    let query = 'SELECT data FROM invoices WHERE 1=1';
    const params = [];

    if (patientId) {
      query += ' AND patientId = ?';
      params.push(patientId);
    }

    query += ' ORDER BY id DESC';

    const rows = db.prepare(query).all(...params);
    const invoices = rows.map(r => JSON.parse(r.data));

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getInvoiceById(req, res) {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT data FROM invoices WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    res.json({ success: true, data: JSON.parse(row.data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createInvoice(req, res) {
  try {
    const payload = req.body;
    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM invoices').get();
    const newId = payload.id || `INV-2026-${String(80 + countRow.cnt + 1).padStart(3, '0')}`;

    const items = payload.items || [];
    const subtotal = payload.subtotal || items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
    const discount = payload.discount || 0;
    const tax = payload.tax || 0;
    const total = payload.total || (subtotal - discount + tax);

    const newInvoice = {
      id: newId,
      patientId: payload.patientId,
      patientName: payload.patientName || 'Patient',
      date: payload.date || new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentStatus: payload.paymentStatus || 'Unpaid',
      paymentMethod: payload.paymentMethod || 'Pending'
    };

    db.prepare('INSERT INTO invoices (id, patientId, date, paymentStatus, total, data) VALUES (?, ?, ?, ?, ?, ?)')
      .run(newInvoice.id, newInvoice.patientId, newInvoice.date, newInvoice.paymentStatus, newInvoice.total, JSON.stringify(newInvoice));

    broadcast('INVOICE_CREATED', newInvoice);

    res.status(201).json({ success: true, data: newInvoice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function payInvoice(req, res) {
  try {
    const { id } = req.params;
    const { paymentMethod = 'Credit Card', amount } = req.body;

    const row = db.prepare('SELECT data FROM invoices WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    const inv = JSON.parse(row.data);
    inv.paymentStatus = 'Paid';
    inv.paymentMethod = paymentMethod;
    if (amount) inv.paidAmount = amount;

    db.prepare('UPDATE invoices SET paymentStatus = ?, data = ? WHERE id = ?')
      .run(inv.paymentStatus, JSON.stringify(inv), id);

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Maya Lin',
      role: 'Front Desk Lead',
      action: 'Invoice Payment Collected',
      details: `Collected payment of $${inv.total} for invoice ${inv.id} via ${paymentMethod}`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('INVOICE_PAID', inv);

    res.json({ success: true, data: inv });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
