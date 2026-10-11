/**
 * api.test.js - Comprehensive Automated Integration Test Suite for Dental Clinic OS Backend
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

process.env.PORT = '3099';
process.env.DB_PATH = './data/test_clinic.db';

let server;
const baseUrl = 'http://localhost:3099/api';

async function api(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await res.json();
  return { status: res.status, data };
}

describe('Beacon Peak Dental OS Backend API Tests', () => {
  before(async () => {
    const serverModule = await import('../server/server.js');
    server = serverModule.server;
    // Wait for server to listen
    await new Promise(resolve => setTimeout(resolve, 600));
  });

  after(async () => {
    if (server) {
      server.close();
    }
  });

  test('GET /api/health returns healthy status', async () => {
    const res = await api('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'healthy');
    assert.strictEqual(res.data.system, 'Beacon Peak Dental OS API');
  });

  test('GET /api/users returns users list with roles', async () => {
    const res = await api('/users');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length >= 3);
  });

  test('POST /api/users/switch switches current persona', async () => {
    const res = await api('/users/switch', {
      method: 'POST',
      body: JSON.stringify({ roleKey: 'dentist' })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.roleKey, 'dentist');

    const curr = await api('/users/current');
    assert.strictEqual(curr.data.data.roleKey, 'dentist');
  });

  test('GET /api/patients returns patient records', async () => {
    const res = await api('/patients');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.count >= 5);
    const eleanor = res.data.data.find(p => p.id === 'P-1001');
    assert.ok(eleanor);
    assert.strictEqual(eleanor.name, 'Eleanor Vance');
  });

  test('GET /api/patients/check/duplicate detects duplicate names/phones', async () => {
    const res = await api('/patients/check/duplicate?name=Eleanor');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.hasDuplicates, true);
    assert.ok(res.data.duplicates.length > 0);
  });

  test('POST /api/patients creates new patient chart', async () => {
    const res = await api('/patients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jonathan Doe',
        phone: '(512) 555-9988',
        email: 'jdoe@test.com',
        bloodGroup: 'B+'
      })
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.data.data.id);
    assert.strictEqual(res.data.data.name, 'Jonathan Doe');
  });

  test('GET /api/appointments returns schedule', async () => {
    const res = await api('/appointments');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.count >= 5);
  });

  test('POST /api/appointments/check/conflict detects operatory double booking', async () => {
    const res = await api('/appointments/check/conflict', {
      method: 'POST',
      body: JSON.stringify({
        date: '2026-10-12',
        time: '10:00 AM',
        operatory: 'Chair 1 (Operatory A)'
      })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.hasConflict, true);
  });

  test('POST /api/appointments/:id/reschedule updates slot and chair', async () => {
    const res = await api('/appointments/apt-101/reschedule', {
      method: 'POST',
      body: JSON.stringify({
        newTime: '10:30 AM',
        newOperatory: 'Chair 3 (Operatory C)'
      })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.time, '10:30 AM');
    assert.strictEqual(res.data.data.operatory, 'Chair 3 (Operatory C)');
    assert.ok(res.data.communication);
  });

  test('GET /api/treatment-plans and catalog', async () => {
    const res = await api('/treatment-plans');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.count >= 2);

    const cat = await api('/treatment-plans/catalog');
    assert.strictEqual(cat.status, 200);
    assert.ok(cat.data.count >= 8);
  });

  test('POST /api/invoices/:id/pay marks invoice as paid', async () => {
    const res = await api('/invoices/INV-2026-080/pay', {
      method: 'POST',
      body: JSON.stringify({ paymentMethod: 'MasterCard' })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.paymentStatus, 'Paid');
  });

  test('PATCH /api/odontograms/:patientId/tooth updates tooth condition', async () => {
    const res = await api('/odontograms/P-1001/tooth', {
      method: 'PATCH',
      body: JSON.stringify({ toothNumber: '19', status: 'Implant' })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.toothStatuses['19'], 'Implant');
  });

  test('POST /api/prescriptions warns on penicillin allergy', async () => {
    const res = await api('/prescriptions', {
      method: 'POST',
      body: JSON.stringify({
        patientId: 'P-1001', // Eleanor Vance has Penicillin allergy
        patientName: 'Eleanor Vance',
        medication: 'Amoxicillin 500mg'
      })
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.data.contraindicationAlert);
    assert.strictEqual(res.data.contraindicationAlert.level, 'SEVERE_WARNING');
  });

  test('PATCH /api/inventory/:id/adjust modifies stock level and triggers alert', async () => {
    const res = await api('/inventory/inv-item-1/adjust', {
      method: 'PATCH',
      body: JSON.stringify({ delta: -2 })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.quantity, 2);
    assert.strictEqual(res.data.data.status, 'Low Stock Alert');
  });

  test('POST /api/ai/triage evaluates symptoms and suggests emergency chair', async () => {
    const res = await api('/ai/triage', {
      method: 'POST',
      body: JSON.stringify({ symptoms: 'Broken lower right molar severe throbbing pain', painScale: 9 })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.severity, 'EMERGENCY');
    assert.strictEqual(res.data.data.recommendedChair, 'Chair 1 (Operatory A)');
  });

  test('POST /api/ai/simulate-call executes full centerpiece booking cascade', async () => {
    const res = await api('/ai/simulate-call', {
      method: 'POST',
      body: JSON.stringify({
        patientName: 'Marcus Sterling',
        phone: '+1 (512) 555-3928',
        estimatedValue: 380
      })
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.data.patient.name, 'Marcus Sterling');
    assert.ok(res.data.data.appointment.isAiBooked);
    assert.ok(res.data.data.callLog);
    assert.ok(res.data.data.metrics.revenueSaved >= 14860);
    assert.ok(res.data.data.communication);
  });

  test('POST /api/demo/reset restores clean initial demo state', async () => {
    const res = await api('/demo/reset', { method: 'POST' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });
});
