/**
 * server.js - Main Application Server for Beacon Peak Dental Group OS
 * Pairs Express REST API, SQLite Persistence, and WebSockets Live Sync.
 */

import express from 'express';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDatabase } from './config/db.js';
import { initWebSocketServer } from './services/websocketService.js';
import apiRouter from './routes/api.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.resolve(rootDir, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize SQLite database
initDatabase();

// Create Express application
const app = express();
const server = http.createServer(app);

// Initialize real-time WebSockets
initWebSocketServer(server);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[HTTP] ${req.method} ${req.url}`);
    }
    next();
  });
}

// REST API routes
app.use('/api', apiRouter);

// Serve uploaded diagnostic files & radiographs
app.use('/uploads', express.static(uploadsDir));

// Serve static frontend assets
app.use(express.static(rootDir));

// SPA fallback
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.url.startsWith('/api') && !req.url.startsWith('/ws')) {
    return res.sendFile(path.resolve(rootDir, 'index.html'));
  }
  next();
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   🦷 BEACON PEAK DENTAL GROUP · CLINIC MANAGEMENT OS BACKEND      ║
╠═══════════════════════════════════════════════════════════════════╣
║   ⚡ Server Port       : http://localhost:${PORT}                    ║
║   🌐 Frontend UI       : http://localhost:${PORT}/                   ║
║   🔌 REST API Base     : http://localhost:${PORT}/api/               ║
║   📡 WebSocket Live    : ws://localhost:${PORT}/ws                   ║
║   🏥 Health Check      : http://localhost:${PORT}/api/health         ║
║   💾 SQLite Database   : ${process.env.DB_PATH || './data/clinic.db'}               ║
╚═══════════════════════════════════════════════════════════════════╝
  `);
});

export { app, server };
