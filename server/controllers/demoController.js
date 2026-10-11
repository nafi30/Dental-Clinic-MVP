/**
 * demoController.js - Factory Reset for Sales Presentations & Testing
 */

import { seedDatabase } from '../config/db.js';
import { broadcast } from '../services/websocketService.js';

export function resetDemo(req, res) {
  try {
    seedDatabase();
    broadcast('DEMO_RESET', { timestamp: new Date().toISOString() });
    res.json({ success: true, message: 'Database reset to initial factory demo state successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
