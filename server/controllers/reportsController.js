/**
 * reportsController.js - Practice Performance Analytics & Production KPIs
 */

import { db } from '../config/db.js';

export function getReports(req, res) {
  try {
    const row = db.prepare('SELECT data FROM reports WHERE id = ?').get('monthly');
    const reports = row ? JSON.parse(row.data) : {};

    // Dynamic live KPI calculations from real data
    const patientCount = db.prepare('SELECT COUNT(*) as cnt FROM patients').get().cnt;
    const apptCount = db.prepare('SELECT COUNT(*) as cnt FROM appointments WHERE status = ?').get('Confirmed').cnt;
    const invPaid = db.prepare('SELECT SUM(total) as total FROM invoices WHERE paymentStatus = ?').get('Paid').total || 0;
    const invUnpaid = db.prepare('SELECT SUM(total) as total FROM invoices WHERE paymentStatus = ?').get('Unpaid').total || 0;

    res.json({
      success: true,
      data: {
        ...reports,
        liveMetrics: {
          totalActivePatients: patientCount,
          confirmedAppointments: apptCount,
          totalCollected: invPaid,
          outstandingBalance: invUnpaid
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
