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

## 💻 Quick Start

No Node.js, npm, or build tools required.

### Option 1: Any Local HTTP Server
```bash
# Python
python -m http.server 3000

# Or Node (if installed)
npx serve .
```
Navigate to `http://localhost:3000` in your browser.

### Option 2: Direct File Open
Simply double-click `index.html` to open in Google Chrome, Microsoft Edge, or Safari.

---

## 📁 Repository Structure

```text
├── index.html                 # Main single-page application shell
├── .gitignore                 # Standard clean git exclusions
├── README.md                  # System documentation & feature matrix
├── css/
│   ├── variables.css          # Design tokens, color palette, typography
│   ├── base.css               # App shell, sidebar navigation, topbar
│   ├── components.css         # Modals, drawers, call simulator UI
│   ├── modules.css            # Phase 1 module layouts & cards
│   └── phase2.css             # Odontogram arch, Rx pad, Lightbox, Inventory
└── js/
    ├── app.js                 # Core SPA router, persona switcher, SMS gateway
    ├── store.js               # Central state management & LocalStorage sync
    ├── callSimulator.js       # Web Audio API telephone simulator & AI cascade
    └── modules/
        ├── dashboard.js       # Practice overview & KPI cards
        ├── calendar.js        # Multi-chair calendar with drag-and-drop
        ├── patients.js        # Patient list & search directory
        ├── patientProfile.js  # Medical history & EDR drawer
        ├── treatmentPlan.js   # Treatment planning & procedure codes
        ├── billing.js         # Invoices, balances & payments
        ├── aiReceptionist.js  # AI call logs, transcripts & audio recordings
        ├── dentalChart.js     # 32-tooth interactive odontogram
        ├── prescriptions.js   # Rx generator with allergy checks & legal pad
        ├── fileManager.js     # Radiographs vault & diagnostic lightbox
        ├── inventory.js       # Stock levels & low-inventory alerts
        ├── reports.js         # Production, collections & chair utilization
        ├── settings.js        # Clinic credentials & AI voice parameters
        └── auditLog.js        # HIPAA compliance trail & event logs
```

---

## 📄 License

Proprietary — All rights reserved. Created for sales demonstrations and clinical management systems.
