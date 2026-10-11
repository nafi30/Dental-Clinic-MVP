/**
 * inventoryController.js - Clinical Consumables & Reorder Alerts
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getInventory(req, res) {
  try {
    const rows = db.prepare('SELECT data FROM inventory ORDER BY quantity ASC').all();
    const items = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function adjustInventory(req, res) {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    if (delta === undefined || isNaN(Number(delta))) {
      return res.status(400).json({ success: false, error: 'Numeric delta is required' });
    }

    const row = db.prepare('SELECT data FROM inventory WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Inventory item not found' });
    }

    const item = JSON.parse(row.data);
    item.quantity = Math.max(0, item.quantity + Number(delta));
    item.status = item.quantity <= item.threshold ? 'Low Stock Alert' : 'In Stock';

    db.prepare('UPDATE inventory SET quantity = ?, status = ?, data = ? WHERE id = ?')
      .run(item.quantity, item.status, JSON.stringify(item), id);

    // Audit log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: 'Maya Lin',
      role: 'Front Desk Lead',
      action: 'Inventory Adjusted',
      details: `${item.name}: quantity adjusted by ${delta > 0 ? '+' + delta : delta} (${item.quantity} ${item.unit} remaining)`,
      timestamp: 'Just now',
      ip: req.ip || '127.0.0.1'
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    broadcast('INVENTORY_ADJUSTED', item);

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createInventoryItem(req, res) {
  try {
    const payload = req.body;
    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM inventory').get();
    const newId = payload.id || `inv-item-${countRow.cnt + 1}`;

    const quantity = Number(payload.quantity || 0);
    const threshold = Number(payload.threshold || 5);

    const newItem = {
      id: newId,
      name: payload.name,
      category: payload.category || 'General',
      quantity,
      threshold,
      unit: payload.unit || 'Units',
      supplier: payload.supplier || 'Patterson Dental',
      costPerUnit: Number(payload.costPerUnit || 0),
      status: quantity <= threshold ? 'Low Stock Alert' : 'In Stock'
    };

    db.prepare('INSERT INTO inventory (id, name, category, quantity, threshold, status, data) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(newItem.id, newItem.name, newItem.category, newItem.quantity, newItem.threshold, newItem.status, JSON.stringify(newItem));

    broadcast('INVENTORY_ITEM_CREATED', newItem);

    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
