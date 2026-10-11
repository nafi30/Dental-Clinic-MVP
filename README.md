# 🦷 Beacon Peak Dental Group — Clinic Management OS & AI Receptionist MVP

> **Interactive Multi-Provider Dental Practice Operating System & AI Voice Receptionist Demo**  
> Designed for high-converting sales demonstrations and enterprise dental group presentations.

---

## 🌟 Overview

**Beacon Peak Dental Group** is a modern, responsive, front-end-first practice management system built specifically for multi-provider dental clinics. It pairs complete day-to-day dental clinical and administrative workflows with a flagship **Autonomous AI Voice Receptionist** that answers patient inquiries, triages dental emergencies, resolves scheduling conflicts, and records structured appointments in real time.

Built with **Zero Build Overhead** (Vanilla HTML5, CSS3, and ES6 Modules), the entire application runs directly in any modern browser without npm dependencies, bundlers, or compilation steps.

---

## 🚀 Key Modules & Capabilities

### Phase 1: Core Clinical Operations & Flagship AI
- **1-Click Persona Switcher:** Instantly toggle between **Dr. Alexander Vance, DDS** (Owner/Admin), **Dr. Aris Thorne, DDS** (Associate Dentist), and **Maya Lin** (Front Desk / Receptionist).
- **Executive Dashboard:** Live clinical KPIs, chair utilization metrics, today's operatory schedule, and revenue recovered by the AI receptionist.
- **Multi-Chair Appointment Calendar:** Color-coded multi-operatory grid supporting Day, Week, and Month views across 4 dedicated chairs (Surgical, Restorative, Hygiene, Overflow).
- **Patient Directory & CRM:** Searchable patient records with medical condition badges, insurance carriers, and outstanding balances.
- **Electronic Dental Record (EDR) Drawer:** Detailed patient charts with medical history alerts, allergy contraindications, and active treatment tracking.
- **Treatment Plans:** Phased restorative treatment planning with procedure codes (CDT), insurance coverage estimates, and patient co-pays.
- **Billing & Statements:** Account balance ledgers, insurance claims status, and printable ADA-compliant statements.
- **★ Flagship AI Voice Receptionist (Module 14):**
  - Live Interactive Call Simulator with dual-tone telephone synthesis (Web Audio API).
  - Multi-turn emergency triage cascade (e.g., severe molar pain with root canal contraindications).
  - Autonomous slot discovery, patient chart creation, SMS confirmation dispatch, and calendar booking.

### Phase 2: Comprehensive Clinical Suite
- **Interactive 32-Tooth Odontogram:** Maxillary (#1–#16) and Mandibular (#17–#32) anatomical dental chart with 5-surface tooth marking (Mesial, Distal, Occlusal, Buccal, Lingual) and clinical condition tags (Decayed, Crown, Root Canal, Implant, Filling, Missing).
- **Prescription Generator & Legal Rx Pad:** Common dental pharmacology catalog with **automatic penicillin/amoxicillin allergy contraindication warnings** and a printable legal Rx pad.
- **X-Rays & CBCT Diagnostic Vault:** High-resolution radiographs, bitewings, and panoramic surveys with a full-screen diagnostic DICOM-style lightbox.
- **Clinical Supplies & Inventory:** Real-time tracking of consumables (Septocaine, nitrile gloves, composite resins) with low-stock warnings and 1-click reorder PO generator.
- **Practice Analytics & Reports:** Gross production vs. collections efficiency, new patient acquisition channels, and procedure mix breakdown.
- **Clinic Settings & Operatory Layout:** Practice commercial NPI, 4-chair doctor assignments, and Aesora Voice AI answering parameters.
- **HIPAA Audit Log:** Immutable chronological audit trail recording chart views, edits, prescription authorizations, and AI autonomous actions.

### Phase 3: Advanced Operational Logic
- **Drag-and-Drop Calendar Rescheduling:** Intuitive HTML5 drag-and-drop slot reallocation with chair assignment updates.
- **Double-Booking Prevention Logic:** Automatic collision detection for chairs and providers with an emergency override workflow.
- **Real-Time Duplicate Patient Detection:** Instant fuzzy and exact matching against patient name, phone, and email during registration.
- **Communications Gateway:** Integrated two-way SMS & Email simulation with smartphone visualizer, automated appointment reminders, and delivery receipts.
- **Role-Based Access Control (RBAC):** Strict operational permission boundaries (e.g., receptionists are blocked from signing prescriptions or altering clinic tax credentials).

---

## 🎨 Design Philosophy

- **Zero "AI Slop":** Strictly **no purple or violet gradients**.
- **Clinical High-Trust Aesthetic:** Deep slate navy (`#0B1320`), clinical surgical teal (`#0D9488`), warm neutrals (`#F8FAFC`), and crisp typography using *Plus Jakarta Sans* and *JetBrains Mono*.
- **Factory Reset Capability:** Persistent LocalStorage state with an instant `↺ Reset Demo` button to restore factory sales demo state anytime.

---

---

## 💻 Quick Start & Running the App

### Option 1: Full-Stack Mode with Node.js Backend & Live Sync (Recommended)
Features built-in SQLite persistence, REST API, and real-time WebSocket synchronization across terminals:

```bash
# 1. Install dependencies (Express, CORS, SQLite, WebSockets)
npm install

# 2. Start the backend server
npm start

# 3. Or run in hot-reload development mode
npm run dev
```

Navigate to **`http://localhost:3000`** in your browser.

- **Frontend UI:** `http://localhost:3000/`
- **REST API:** `http://localhost:3000/api/`
- **Health Check:** `http://localhost:3000/api/health`
- **WebSocket Gateway:** `ws://localhost:3000/ws`

### Run Backend Integration Tests
Execute the automated integration test suite covering all 17 clinical and AI endpoints:

```bash
npm test
```

### Option 2: Standalone Local Mode (Without Server)
The frontend retains full offline fallback capability and operates seamlessly using LocalStorage:
```bash
# Python local server
python -m http.server 3000

# Or open index.html directly in Chrome, Edge, or Safari
```

---

## 🔌 Backend Architecture & REST API Matrix

The backend is built with **Node.js, Express, WebSockets (`ws`), and built-in SQLite (`node:sqlite`)** requiring zero native C++ compilation:

| Category | Method & Route | Description |
| :--- | :--- | :--- |
| **System** | `GET /api/health` | Uptime, API status, and server timestamp |
| | `POST /api/demo/reset` | Resets clinic database back to pristine factory demo state |
| **Auth** | `GET /api/users` | List clinic staff (Owner Dr. Vance, Dr. Thorne, Maya Lin) |
| | `GET /api/users/current` | Active session user persona |
| | `POST /api/users/switch` | Switch active persona & record security audit log |
| **Patients** | `GET /api/patients` | Query patients with optional search & status filter |
| | `GET /api/patients/check/duplicate` | Real-time duplicate name, phone, and email detection |
| | `GET /api/patients/:id` | Full EDR record with medical alerts & allergy flags |
| | `POST /api/patients` | Register new patient chart and generate unique ID |
| | `PUT /api/patients/:id` | Update patient record & broadcast change |
| **Appointments** | `GET /api/appointments` | Operatory chair appointments by date/chair |
| | `POST /api/appointments` | Book appointment across Operatories A, B, C |
| | `POST /api/appointments/check/conflict` | Operatory double-booking & collision detection |
| | `POST /api/appointments/:id/reschedule` | Slot/chair reallocation with audit & SMS dispatch |
| **Treatment Plans**| `GET /api/treatment-plans` | Multi-stage restorative plans & co-pays |
| | `GET /api/treatment-plans/catalog` | CDT procedure codes & standard fee schedule |
| | `POST /api/treatment-plans` | Create phased dental treatment plan |
| **Billing** | `GET /api/invoices` | Invoices, insurance copays & balances |
| | `POST /api/invoices` | Generate ADA-compliant billing statement |
| | `POST /api/invoices/:id/pay` | Record payment & update balance ledgers |
| **Dental Chart** | `GET /api/odontograms/:patientId` | 32-tooth maxillary/mandibular anatomical status |
| | `PATCH /api/odontograms/:patientId/tooth` | Update single tooth condition tag (Decayed, Crown, Implant) |
| **Prescriptions** | `GET /api/prescriptions` | Active Rx history |
| | `POST /api/prescriptions` | Legal Rx pad issuance with **Penicillin allergy contraindication guard** |
| **Files & Imaging**| `GET /api/files` | Diagnostic radiographs, bitewings & CBCT scans |
| | `POST /api/files/upload` | Multipart file upload and lightbox serving |
| **Inventory** | `GET /api/inventory` | Clinical consumables & anesthetic supply counts |
| | `PATCH /api/inventory/:id/adjust` | Increment/decrement stock with Low Stock alerts |
| **Analytics** | `GET /api/reports` | Gross production, collections efficiency & chair utilization |
| **Security Audit**| `GET /api/audit-logs` | HIPAA chronological immutable audit trail |
| **Gateway** | `GET /api/communications` | Two-way SMS & email transmission logs |
| | `POST /api/communications/send` | Dispatches simulated Twilio/SendGrid clinical notices |
| **Flagship AI** | `GET /api/ai/metrics` | Total calls, recovered after-hours revenue & recovery rate |
| | `GET /api/ai/call-logs` | Multi-turn transcripts & triage logs |
| | `POST /api/ai/triage` | Symptom severity assessment & chair recommendation |
| | `POST /api/ai/simulate-call` | Full Marcus Sterling emergency booking cascade |
| | `POST /api/ai/chat` | Conversational responses from Aesora digital receptionist |

---

## 📁 Repository Structure

```text
├── index.html                 # Main single-page application shell
├── package.json               # Backend dependencies & npm scripts
├── .env.example               # Environment variables configuration
├── .gitignore                 # Standard clean git exclusions
├── README.md                  # System documentation & feature matrix
├── css/
│   ├── variables.css          # Design tokens, color palette, typography
│   ├── base.css               # App shell, sidebar navigation, topbar
│   ├── components.css         # Modals, drawers, call simulator UI
│   ├── modules.css            # Phase 1 module layouts & cards
│   └── phase2.css             # Odontogram arch, Rx pad, Lightbox, Inventory
├── js/
│   ├── app.js                 # Core SPA router, persona switcher, SMS gateway
│   ├── store.js               # Reactive state store with hybrid REST/WebSocket sync
│   ├── callSimulator.js       # Web Audio API telephone simulator & AI cascade
│   └── modules/               # 14 Clinical and operational frontend modules
├── server/
│   ├── server.js              # Express + WebSocket HTTP server entrypoint
│   ├── config/
│   │   └── db.js              # SQLite database layer with node:sqlite
│   ├── controllers/           # Modular REST controllers for all clinic domains
│   ├── routes/
│   │   └── api.js             # Consolidated REST API router
│   └── services/
│       ├── aiTriageService.js # Clinical emergency triage & Aesora dialog engine
│       ├── websocketService.js# Real-time WebSocket event broadcaster
│       └── seedData.js        # Factory clinical database seeder
└── tests/
    └── api.test.js            # Automated integration test suite (17 tests)
```

---

## 📄 License

Proprietary — All rights reserved. Created for sales demonstrations and clinical management systems.
