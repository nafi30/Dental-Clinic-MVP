/**
 * api.js - Centralized REST API Router for Beacon Peak Dental Group OS
 */

import express from 'express';

import * as authController from '../controllers/authController.js';
import * as patientsController from '../controllers/patientsController.js';
import * as appointmentsController from '../controllers/appointmentsController.js';
import * as treatmentPlansController from '../controllers/treatmentPlansController.js';
import * as billingController from '../controllers/billingController.js';
import * as odontogramsController from '../controllers/odontogramsController.js';
import * as prescriptionsController from '../controllers/prescriptionsController.js';
import * as filesController from '../controllers/filesController.js';
import * as inventoryController from '../controllers/inventoryController.js';
import * as reportsController from '../controllers/reportsController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as auditController from '../controllers/auditController.js';
import * as communicationsController from '../controllers/communicationsController.js';
import * as aiReceptionistController from '../controllers/aiReceptionistController.js';
import * as demoController from '../controllers/demoController.js';

const router = express.Router();

// System Health & Demo Reset
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Beacon Peak Dental OS API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
router.post('/demo/reset', demoController.resetDemo);

// Auth & Users
router.get('/users', authController.getUsers);
router.get('/users/current', authController.getCurrentUser);
router.post('/users/switch', authController.switchUser);

// Settings & Practice Dentists
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);
router.get('/dentists', settingsController.getDentists);

// Patients & CRM
router.get('/patients', patientsController.getPatients);
router.get('/patients/check/duplicate', patientsController.checkDuplicatePatient);
router.get('/patients/:id', patientsController.getPatientById);
router.post('/patients', patientsController.createPatient);
router.put('/patients/:id', patientsController.updatePatient);
router.delete('/patients/:id', patientsController.deletePatient);

// Appointments & Multi-Chair Calendar
router.get('/appointments', appointmentsController.getAppointments);
router.get('/appointments/:id', appointmentsController.getAppointmentById);
router.post('/appointments', appointmentsController.createAppointment);
router.put('/appointments/:id', appointmentsController.updateAppointment);
router.delete('/appointments/:id', appointmentsController.deleteAppointment);
router.post('/appointments/check/conflict', appointmentsController.checkConflict);
router.post('/appointments/:id/reschedule', appointmentsController.rescheduleAppointment);

// Treatment Plans & Procedures Catalog
router.get('/treatment-plans', treatmentPlansController.getTreatmentPlans);
router.get('/treatment-plans/catalog', treatmentPlansController.getTreatmentsCatalog);
router.get('/treatment-plans/:id', treatmentPlansController.getTreatmentPlanById);
router.post('/treatment-plans', treatmentPlansController.createTreatmentPlan);
router.put('/treatment-plans/:id', treatmentPlansController.updateTreatmentPlan);

// Billing, Balances & Invoices
router.get('/invoices', billingController.getInvoices);
router.get('/invoices/:id', billingController.getInvoiceById);
router.post('/invoices', billingController.createInvoice);
router.post('/invoices/:id/pay', billingController.payInvoice);

// Dental Charting & 32-Tooth Odontograms
router.get('/odontograms/:patientId', odontogramsController.getOdontogram);
router.put('/odontograms/:patientId', odontogramsController.updateOdontogram);
router.patch('/odontograms/:patientId/tooth', odontogramsController.updateToothStatus);

// Prescriptions & Legal Rx Pad
router.get('/prescriptions', prescriptionsController.getPrescriptions);
router.post('/prescriptions', prescriptionsController.createPrescription);

// Files, Diagnostic Lightbox & Radiographs
router.get('/files', filesController.getFiles);
router.post('/files', filesController.createFile);
router.delete('/files/:id', filesController.deleteFile);
router.post('/files/upload', filesController.uploadMiddleware.single('file'), filesController.createFile);

// Inventory & Clinical Consumables
router.get('/inventory', inventoryController.getInventory);
router.post('/inventory', inventoryController.createInventoryItem);
router.patch('/inventory/:id/adjust', inventoryController.adjustInventory);

// Reports & Practice Analytics
router.get('/reports', reportsController.getReports);

// HIPAA Security Audit Trail
router.get('/audit-logs', auditController.getAuditLogs);
router.post('/audit-logs', auditController.createAuditLog);

// Two-Way Communications Gateway (SMS / Email)
router.get('/communications', communicationsController.getCommunications);
router.post('/communications/send', communicationsController.sendCommunication);

// Flagship AI Receptionist
router.get('/ai/metrics', aiReceptionistController.getAiMetrics);
router.get('/ai/call-logs', aiReceptionistController.getCallLogs);
router.post('/ai/simulate-call', aiReceptionistController.simulateCall);
router.post('/ai/triage', aiReceptionistController.triageSymptom);
router.post('/ai/chat', aiReceptionistController.chatWithReceptionist);

export default router;
