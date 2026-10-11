/**
 * aiTriageService.js - Clinical Emergency Triage & Autonomous AI Receptionist Engine
 */

export class AiTriageService {
  /**
   * Evaluates patient dental symptoms and triages severity level
   */
  static triageSymptom(symptomText, painScale = 8) {
    const text = symptomText.toLowerCase();

    // Check high priority dental emergencies
    if (text.includes('broken') || text.includes('fractur') || text.includes('crack') || text.includes('molar')) {
      return {
        severity: 'EMERGENCY',
        urgency: 'Immediate (Within 12-24h)',
        triageCode: 'CDT-D9110',
        suggestedTreatment: 'Emergency Exam & Palliative Tooth Restoration',
        recommendedChair: 'Chair 1 (Operatory A)',
        recommendedDoctor: 'Dr. Alexander Vance',
        palliativeTips: [
          'Avoid chewing on the affected side',
          'Rinse gently with warm salt water',
          'Over-the-counter analgesics (Ibuprofen 400-600mg) if not contraindicated',
          'Keep any tooth fragments in whole milk or saline'
        ],
        estimatedRevenue: 380
      };
    }

    if (text.includes('swelling') || text.includes('abscess') || text.includes('pus') || text.includes('fever')) {
      return {
        severity: 'CRITICAL_INFECTION',
        urgency: 'Same-day urgent',
        triageCode: 'CDT-D0140',
        suggestedTreatment: 'Limited Oral Evaluation - Problem Focused & Incision/Drainage',
        recommendedChair: 'Chair 2 (Operatory B)',
        recommendedDoctor: 'Dr. Aris Thorne',
        palliativeTips: [
          'Do NOT apply heat to the face',
          'Cold compress on cheek for 15-minute intervals',
          'Seek ER immediately if experiencing difficulty swallowing or breathing'
        ],
        estimatedRevenue: 450
      };
    }

    if (text.includes('pain') || text.includes('ache') || text.includes('throbbing') || painScale >= 7) {
      return {
        severity: 'URGENT_PALLIATIVE',
        urgency: 'Next available emergency slot',
        triageCode: 'CDT-D9110',
        suggestedTreatment: 'Palliative Treatment of Dental Pain',
        recommendedChair: 'Chair 2 (Operatory B)',
        recommendedDoctor: 'Dr. Aris Thorne',
        palliativeTips: [
          'Avoid extremely hot, cold, or sugary foods and beverages',
          'Warm salt water rinse every 3-4 hours'
        ],
        estimatedRevenue: 280
      };
    }

    return {
      severity: 'ROUTINE',
      urgency: 'Scheduled appointment',
      triageCode: 'CDT-D0150',
      suggestedTreatment: 'Comprehensive Oral Evaluation & Prophylaxis',
      recommendedChair: 'Chair 3 (Operatory C)',
      recommendedDoctor: 'Dr. Clara Patel',
      palliativeTips: [
        'Maintain routine brushing twice daily and interdental flossing'
      ],
      estimatedRevenue: 250
    };
  }

  /**
   * Generates empathetic receptionist dialogue for Aesora
   */
  static generateReceptionistResponse(userMessage, callerName = "Caller") {
    const triage = this.triageSymptom(userMessage);

    if (triage.severity === 'EMERGENCY' || triage.severity === 'CRITICAL_INFECTION') {
      return {
        speaker: 'Aesora (AI Receptionist)',
        text: `I'm so sorry you're in pain, ${callerName}. Broken teeth and acute pain are high priorities for us at Beacon Peak Dental. We have an emergency slot held tomorrow morning at 9:30 AM with ${triage.recommendedDoctor} in ${triage.recommendedChair}. Would you like me to reserve that chair for you right now?`,
        triage
      };
    }

    return {
      speaker: 'Aesora (AI Receptionist)',
      text: `Hello ${callerName}! Thank you for contacting Beacon Peak Dental Group. We'd love to help you with your dental care. We have openings available this week with Dr. Clara Patel. Would morning or afternoon suit your schedule better?`,
      triage
    };
  }
}
