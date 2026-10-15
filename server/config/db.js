/**
 * db.js - SQLite Database Layer using Node.js built-in DatabaseSync
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_DATA } from '../services/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH 
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.resolve(dbDir, 'clinic.db');

const targetDir = path.dirname(dbPath);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// Enable WAL mode for optimal concurrent performance
try {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
} catch (e) {
  console.warn('[DB] PRAGMA config warning:', e.message);
}

/**
 * Initialize all database tables and indexes
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clinic_info (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      roleKey TEXT NOT NULL,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dentists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      chair TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      status TEXT,
      balance TEXT,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
    CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT,
      dentistId TEXT,
      dentistName TEXT,
      operatory TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL,
      isAiBooked INTEGER DEFAULT 0,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patientId);

    CREATE TABLE IF NOT EXISTS treatments_catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS treatment_plans (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      title TEXT,
      status TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      date TEXT,
      paymentStatus TEXT,
      total REAL,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_metrics (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_call_logs (
      id TEXT PRIMARY KEY,
      patientName TEXT,
      callerId TEXT,
      time TEXT,
      recovered INTEGER,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS odontograms (
      patientId TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT,
      medication TEXT NOT NULL,
      date TEXT,
      status TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      type TEXT,
      title TEXT,
      date TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      quantity REAL NOT NULL,
      threshold REAL NOT NULL,
      status TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      user TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS communications (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      type TEXT NOT NULL,
      destination TEXT,
      timestamp TEXT NOT NULL,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS current_user_session (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL
    );
  `);

  // Check if initial seed data is needed
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM patients').get();
  if (countRow.cnt === 0) {
    seedDatabase();
  }
}

/**
 * Wipe and re-populate the database with factory demonstration datasets
 */
export function seedDatabase() {
  console.log('[DB] Seeding database with clinic initial data...');

  // Clear existing
  db.exec(`
    DELETE FROM clinic_info;
    DELETE FROM users;
    DELETE FROM dentists;
    DELETE FROM patients;
    DELETE FROM appointments;
    DELETE FROM treatments_catalog;
    DELETE FROM treatment_plans;
    DELETE FROM invoices;
    DELETE FROM ai_metrics;
    DELETE FROM ai_call_logs;
    DELETE FROM odontograms;
    DELETE FROM prescriptions;
    DELETE FROM files;
    DELETE FROM inventory;
    DELETE FROM reports;
    DELETE FROM settings;
    DELETE FROM audit_log;
    DELETE FROM communications;
    DELETE FROM current_user_session;
  `);

  // 1. Clinic
  const insClinic = db.prepare('INSERT INTO clinic_info (id, data) VALUES (?, ?)');
  insClinic.run(INITIAL_DATA.clinic.id, JSON.stringify(INITIAL_DATA.clinic));

  // 2. Users
  const insUser = db.prepare('INSERT INTO users (id, roleKey, data) VALUES (?, ?, ?)');
  for (const u of INITIAL_DATA.users) {
    insUser.run(u.id, u.roleKey, JSON.stringify(u));
  }

  // Session user
  const insSession = db.prepare('INSERT INTO current_user_session (id, userId) VALUES (?, ?)');
  insSession.run('session', INITIAL_DATA.currentUser.id);

  // 3. Dentists
  const insDentist = db.prepare('INSERT INTO dentists (id, name, chair, data) VALUES (?, ?, ?, ?)');
  for (const d of INITIAL_DATA.dentists) {
    insDentist.run(d.id, d.name, d.chair, JSON.stringify(d));
  }

  // 4. Patients
  const insPatient = db.prepare('INSERT INTO patients (id, name, phone, email, status, balance, data) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const p of INITIAL_DATA.patients) {
    insPatient.run(p.id, p.name, p.phone || '', p.email || '', p.status, p.balance || '$0.00', JSON.stringify(p));
  }

  // 5. Appointments
  const insAppt = db.prepare('INSERT INTO appointments (id, patientId, patientName, dentistId, dentistName, operatory, date, time, status, isAiBooked, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const a of INITIAL_DATA.appointments) {
    insAppt.run(a.id, a.patientId, a.patientName, a.dentistId, a.dentistName, a.operatory, a.date, a.time, a.status, a.isAiBooked ? 1 : 0, JSON.stringify(a));
  }

  // 6. Treatments Catalog
  const insTrt = db.prepare('INSERT INTO treatments_catalog (id, name, price, data) VALUES (?, ?, ?, ?)');
  for (const t of INITIAL_DATA.treatmentsCatalog) {
    insTrt.run(t.id, t.name, t.price, JSON.stringify(t));
  }

  // 7. Treatment Plans
  const insTp = db.prepare('INSERT INTO treatment_plans (id, patientId, title, status, data) VALUES (?, ?, ?, ?, ?)');
  for (const tp of INITIAL_DATA.treatmentPlans) {
    insTp.run(tp.id, tp.patientId, tp.title, tp.status, JSON.stringify(tp));
  }

  // 8. Invoices
  const insInv = db.prepare('INSERT INTO invoices (id, patientId, date, paymentStatus, total, data) VALUES (?, ?, ?, ?, ?, ?)');
  for (const inv of INITIAL_DATA.invoices) {
    insInv.run(inv.id, inv.patientId, inv.date, inv.paymentStatus, inv.total, JSON.stringify(inv));
  }

  // 9. AI Metrics
  const insMetrics = db.prepare('INSERT INTO ai_metrics (id, data) VALUES (?, ?)');
  insMetrics.run('metrics', JSON.stringify(INITIAL_DATA.aiReceptionist.metrics));

  // 10. AI Call Logs
  const insCall = db.prepare('INSERT INTO ai_call_logs (id, patientName, callerId, time, recovered, data) VALUES (?, ?, ?, ?, ?, ?)');
  for (const c of INITIAL_DATA.aiReceptionist.callLogs) {
    insCall.run(c.id, c.patientName, c.callerId, c.time, c.recovered ? 1 : 0, JSON.stringify(c));
  }

  // 11. Odontograms
  const insOdonto = db.prepare('INSERT INTO odontograms (patientId, data) VALUES (?, ?)');
  for (const [pid, od] of Object.entries(INITIAL_DATA.odontograms)) {
    insOdonto.run(pid, JSON.stringify(od));
  }

  // 12. Prescriptions
  const insRx = db.prepare('INSERT INTO prescriptions (id, patientId, patientName, medication, date, status, data) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const rx of INITIAL_DATA.prescriptions) {
    insRx.run(rx.id, rx.patientId, rx.patientName, rx.medication, rx.date, rx.status, JSON.stringify(rx));
  }

  // 13. Files
  const insFile = db.prepare('INSERT INTO files (id, patientId, type, title, date, data) VALUES (?, ?, ?, ?, ?, ?)');
  for (const f of INITIAL_DATA.files) {
    insFile.run(f.id, f.patientId, f.type, f.title, f.date, JSON.stringify(f));
  }

  // 14. Inventory
  const insInvItem = db.prepare('INSERT INTO inventory (id, name, category, quantity, threshold, status, data) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const it of INITIAL_DATA.inventory) {
    insInvItem.run(it.id, it.name, it.category, it.quantity, it.threshold, it.status, JSON.stringify(it));
  }

  // 15. Reports
  const insReports = db.prepare('INSERT INTO reports (id, data) VALUES (?, ?)');
  insReports.run('monthly', JSON.stringify(INITIAL_DATA.reports));

  // 16. Settings
  const insSettings = db.prepare('INSERT INTO settings (id, data) VALUES (?, ?)');
  insSettings.run('clinic_settings', JSON.stringify(INITIAL_DATA.settings));

  // 17. Audit Log
  const insAudit = db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)');
  for (const log of INITIAL_DATA.auditLog) {
    insAudit.run(log.id, log.action, log.user, log.timestamp, JSON.stringify(log));
  }

  // 18. Communications
  const insComm = db.prepare('INSERT INTO communications (id, patientId, type, destination, timestamp, data) VALUES (?, ?, ?, ?, ?, ?)');
  for (const comm of INITIAL_DATA.communications) {
    insComm.run(comm.id, comm.patientId, comm.type, comm.destination, comm.timestamp, JSON.stringify(comm));
  }

  console.log('[DB] Seeding completed successfully.');
}
