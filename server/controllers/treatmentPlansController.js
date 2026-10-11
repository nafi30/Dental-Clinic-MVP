/**
 * treatmentPlansController.js - Multi-Stage Restorative Dental Plans
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function getTreatmentPlans(req, res) {
  try {
    const { patientId } = req.query;
    let query = 'SELECT data FROM treatment_plans WHERE 1=1';
    const params = [];

    if (patientId) {
      query += ' AND patientId = ?';
      params.push(patientId);
    }

    query += ' ORDER BY id DESC';

    const rows = db.prepare(query).all(...params);
    const plans = rows.map(r => JSON.parse(r.data));

    res.json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getTreatmentPlanById(req, res) {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT data FROM treatment_plans WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ success: false, error: 'Treatment plan not found' });
    }

    res.json({ success: true, data: JSON.parse(row.data) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function createTreatmentPlan(req, res) {
  try {
    const payload = req.body;
    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM treatment_plans').get();
    const newId = payload.id || `tp-${500 + countRow.cnt + 1}`;

    const newPlan = {
      id: newId,
      patientId: payload.patientId,
      patientName: payload.patientName || 'Patient',
      dentistName: payload.dentistName || 'Dr. Alexander Vance',
      title: payload.title || 'Comprehensive Restorative Plan',
      status: payload.status || 'Planned',
      totalCost: payload.totalCost || 0,
      approvalStatus: payload.approvalStatus || 'Pending Patient Review',
      stages: payload.stages || []
    };

    db.prepare('INSERT INTO treatment_plans (id, patientId, title, status, data) VALUES (?, ?, ?, ?, ?)')
      .run(newPlan.id, newPlan.patientId, newPlan.title, newPlan.status, JSON.stringify(newPlan));

    broadcast('TREATMENT_PLAN_CREATED', newPlan);

    res.status(201).json({ success: true, data: newPlan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function updateTreatmentPlan(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT data FROM treatment_plans WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Treatment plan not found' });
    }

    const currentData = JSON.parse(existing.data);
    const updated = { ...currentData, ...req.body, id };

    db.prepare('UPDATE treatment_plans SET title = ?, status = ?, data = ? WHERE id = ?')
      .run(updated.title, updated.status, JSON.stringify(updated), id);

    broadcast('TREATMENT_PLAN_UPDATED', updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getTreatmentsCatalog(req, res) {
  try {
    const rows = db.prepare('SELECT data FROM treatments_catalog').all();
    const catalog = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, count: catalog.length, data: catalog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
