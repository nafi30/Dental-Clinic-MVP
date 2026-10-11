/**
 * websocketService.js - Real-Time Event Synchronization for Dental Clinic OS
 */

import { WebSocketServer } from 'ws';

let wss = null;
const clients = new Set();

export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    clients.add(ws);
    console.log(`[WebSocket] Client connected from ${req.socket.remoteAddress}. Active clients: ${clients.size}`);

    // Send welcome and connection status
    ws.send(JSON.stringify({
      type: 'CONNECTION_ESTABLISHED',
      data: {
        serverTime: new Date().toISOString(),
        clinic: 'Beacon Peak Dental Group'
      }
    }));

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message);
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        }
      } catch (err) {
        // Ignore non-json ping/keepalive messages
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`[WebSocket] Client disconnected. Remaining: ${clients.size}`);
    });

    ws.on('error', (err) => {
      console.error('[WebSocket] Error on client connection:', err.message);
      clients.delete(ws);
    });
  });

  return wss;
}

/**
 * Broadcast an event to all connected clinic clients
 * @param {string} type - Event type (e.g. 'APPOINTMENT_CREATED', 'AI_CALL_RECOVERED')
 * @param {object} data - Event payload
 */
export function broadcast(type, data) {
  if (!wss || clients.size === 0) return;

  const payload = JSON.stringify({
    type,
    data,
    timestamp: new Date().toISOString()
  });

  for (const client of clients) {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(payload);
    }
  }
}
