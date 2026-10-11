/**
 * aiReceptionistController.js - Centerpiece Module 14: Autonomous Voice AI Gateway
 */

import { db } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';
import { AiTriageService } from '../services/aiTriageService.js';

export function getAiMetrics(req, res) {
  try {
    const row = db.prepare('SELECT data FROM ai_metrics WHERE id = ?').get('metrics');
    res.json({ success: true, data: row ? JSON.parse(row.data) : {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export function getCallLogs(req, res) {
  try {
    const rows = db.prepare('SELECT data FROM ai_call_logs ORDER BY id DESC').all();
    const callLogs = rows.map(r => JSON.parse(r.data));
    res.json({ success: true, count: callLogs.length, data: callLogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Flagship Centerpiece: Simulates or processes an incoming patient call
 * Autonomously resolves slot discovery, chart registration, SMS confirmation & metrics
 */
export function simulateCall(req, res) {
  try {
    const {
      patientName = "Marcus Sterling",
      phone = "+1 (512) 555-3928",
      reason = "Emergency Broken Molar with Acute Pain",
      dentistName = "Dr. Alexander Vance",
      dentistId = "d-1",
      date = "2026-10-13",
      time = "9:30 AM",
      operatory = "Chair 1 (Operatory A)",
      estimatedValue = 380
    } = req.body || {};

    // 1. Locate or create patient in CRM
    const existingPatientRow = db.prepare('SELECT data FROM patients WHERE LOWER(name) = ?').get(patientName.toLowerCase());
    let patient;

    if (existingPatientRow) {
      patient = JSON.parse(existingPatientRow.data);
    } else {
      const patientCount = db.prepare('SELECT COUNT(*) as cnt FROM patients').get().cnt;
      patient = {
        id: `P-${1000 + patientCount + 1}`,
        name: patientName,
        age: 38,
        gender: "Male",
        dob: "1988-06-22",
        phone: phone,
        email: "marcus.sterling@sterlingarch.com",
        address: "712 Congress Ave, Austin, TX",
        emergencyContact: "Elena Sterling (Spouse) - (512) 555-3929",
        bloodGroup: "O+",
        status: "Active",
        balance: "$0.00",
        medicalHistory: {
          conditions: ["None reported"],
          dentalHistory: "Fractured lingual cusp on Tooth #30 while chewing. Needs emergency assessment.",
          allergies: ["NKDA"],
          habits: ["Non-smoker"]
        },
        lastVisit: "New Patient (First Visit)",
        nextAppointment: `Tomorrow (${date}), ${time}`
      };

      db.prepare('INSERT INTO patients (id, name, phone, email, status, balance, data) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(patient.id, patient.name, patient.phone, patient.email, patient.status, patient.balance, JSON.stringify(patient));
    }

    // 2. Book appointment on multi-chair calendar
    const apptCount = db.prepare('SELECT COUNT(*) as cnt FROM appointments').get().cnt;
    const newAppt = {
      id: `apt-${100 + apptCount + 1}`,
      patientId: patient.id,
      patientName: patient.name,
      dentistId: dentistId,
      dentistName: dentistName,
      operatory: operatory,
      treatment: "Emergency Exam & Broken Molar Palliative Care",
      date: date,
      time: time,
      duration: "45 min",
      status: "Confirmed",
      isAiBooked: true,
      notes: "⚡ AI RECOVERED AFTER-HOURS CALL: Patient in acute pain from broken molar. SMS confirmation dispatched."
    };

    db.prepare(`
      INSERT INTO appointments (id, patientId, patientName, dentistId, dentistName, operatory, date, time, status, isAiBooked, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newAppt.id,
      newAppt.patientId,
      newAppt.patientName,
      newAppt.dentistId,
      newAppt.dentistName,
      newAppt.operatory,
      newAppt.date,
      newAppt.time,
      newAppt.status,
      1,
      JSON.stringify(newAppt)
    );

    // 3. Log AI Call transcript
    const callCount = db.prepare('SELECT COUNT(*) as cnt FROM ai_call_logs').get().cnt;
    const newCallLog = {
      id: `call-${900 + callCount + 1}`,
      patientName: patient.name,
      callerId: phone,
      time: "Just now (After-Hours Recovered)",
      duration: "1m 32s",
      intent: "Emergency Broken Molar",
      outcome: "Booked Emergency Slot",
      recovered: true,
      estimatedRevenue: estimatedValue,
      sentiment: "Extremely Relieved",
      transcript: [
        { speaker: "AI", text: "Thank you for calling Beacon Peak Dental Group after hours. I'm Aesora, the clinic's digital coordinator. How can I assist you tonight?" },
        { speaker: "Caller", text: "Hi, I fractured a back tooth eating dinner about twenty minutes ago. It's sharp, hurting badly, and I can't sleep like this. Can I see a dentist first thing tomorrow?" },
        { speaker: "AI", text: "I'm so sorry to hear you're hurting, Marcus! We treat broken teeth with high priority. Dr. Alexander Vance has an emergency operatory slot open tomorrow at 9:30 AM in Chair 1. Would that work for you?" },
        { speaker: "Caller", text: "Yes! 9:30 AM is perfect. Thank you so much." },
        { speaker: "AI", text: "You are locked in for 9:30 AM tomorrow with Dr. Vance. I've automatically reserved Chair 1 and sent an SMS with clinic directions and temporary pain tips to this number. We'll take care of you in the morning!" }
      ]
    };

    db.prepare('INSERT INTO ai_call_logs (id, patientName, callerId, time, recovered, data) VALUES (?, ?, ?, ?, ?, ?)')
      .run(newCallLog.id, newCallLog.patientName, newCallLog.callerId, newCallLog.time, 1, JSON.stringify(newCallLog));

    // 4. Update AI Metrics
    const metricsRow = db.prepare('SELECT data FROM ai_metrics WHERE id = ?').get('metrics');
    const metrics = metricsRow ? JSON.parse(metricsRow.data) : { totalCalls: 0, recoveredCalls: 0, revenueSaved: 0 };
    metrics.totalCalls += 1;
    metrics.recoveredCalls += 1;
    metrics.revenueSaved += estimatedValue;
    metrics.recoveryRate = `${((metrics.recoveredCalls / metrics.totalCalls) * 100).toFixed(1)}%`;

    db.prepare('UPDATE ai_metrics SET data = ? WHERE id = ?').run(JSON.stringify(metrics), 'metrics');

    // 5. Send automated confirmation SMS
    const commId = 'comm-' + Date.now();
    const comm = {
      id: commId,
      patientId: patient.id,
      patientName: patient.name,
      destination: phone,
      type: "SMS",
      message: `Beacon Peak Dental: Hi ${patient.name.split(' ')[0]}, Aesora has reserved your emergency appointment with Dr. Vance tomorrow at ${time} in ${operatory}. Palliative tip: avoid cold water & chewing on that tooth. Reply C to confirm.`,
      timestamp: "Just now",
      status: "Delivered",
      carrier: "Twilio Carrier Network",
      latency: "290ms"
    };
    db.prepare('INSERT INTO communications (id, patientId, type, destination, timestamp, data) VALUES (?, ?, ?, ?, ?, ?)')
      .run(comm.id, comm.patientId, comm.type, comm.destination, comm.timestamp, JSON.stringify(comm));

    // 6. Security Audit Log
    const auditId = 'aud-' + Date.now();
    const auditLog = {
      id: auditId,
      user: "AI Receptionist (Aesora)",
      role: "Automated Agent",
      action: "Emergency Slot Auto-Booked",
      details: `Autonomous triage & calendar lock: ${patient.name} for ${date} ${time} (${operatory}) +$${estimatedValue}`,
      timestamp: "Just now",
      ip: "127.0.0.1 (Local Voice Gateway)"
    };
    db.prepare('INSERT INTO audit_log (id, action, user, timestamp, data) VALUES (?, ?, ?, ?, ?)')
      .run(auditId, auditLog.action, auditLog.user, auditLog.timestamp, JSON.stringify(auditLog));

    const responsePayload = {
      patient,
      appointment: newAppt,
      callLog: newCallLog,
      metrics,
      communication: comm
    };

    // Broadcast live event to all connected clinic dashboards
    broadcast('AI_CALL_RECOVERED', responsePayload);

    res.status(201).json({ success: true, data: responsePayload });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Triage dental symptoms with clinical severity rating
 */
export function triageSymptom(req, res) {
  try {
    const { symptoms = '', painScale = 8 } = req.body;
    const result = AiTriageService.triageSymptom(symptoms, Number(painScale));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Interactive multi-turn chat with Aesora
 */
export function chatWithReceptionist(req, res) {
  try {
    const { message = '', callerName = 'Caller' } = req.body;
    const reply = AiTriageService.generateReceptionistResponse(message, callerName);
    res.json({ success: true, data: reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
