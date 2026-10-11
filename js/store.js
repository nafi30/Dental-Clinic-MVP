/**
 * store.js - Centralized Reactive State Store & Sample Data for Beacon Peak Dental Group Demo
 */

const STORAGE_KEY = 'dental_mvp_store_v2';

const INITIAL_DATA = {
  clinic: {
    name: "Beacon Peak Dental Group",
    location: "Austin, TX",
    phone: "(512) 892-4400",
    timezone: "CST (UTC-6)"
  },

  currentUser: {
    id: "usr-1",
    name: "Dr. Alexander Vance, DDS",
    role: "Clinic Owner & Lead Dentist",
    roleKey: "admin",
    avatar: "AV",
    email: "alexander.vance@beaconpeakdental.com"
  },

  users: [
    {
      id: "usr-1",
      name: "Dr. Alexander Vance, DDS",
      role: "Clinic Owner & Lead Dentist",
      roleKey: "admin",
      avatar: "AV",
      email: "alexander.vance@beaconpeakdental.com"
    },
    {
      id: "usr-2",
      name: "Dr. Aris Thorne, DMD",
      role: "Associate Dentist (Endodontics)",
      roleKey: "dentist",
      avatar: "AT",
      email: "aris.thorne@beaconpeakdental.com"
    },
    {
      id: "usr-3",
      name: "Maya Lin",
      role: "Front Desk & Patient Coordinator",
      roleKey: "receptionist",
      avatar: "ML",
      email: "maya.lin@beaconpeakdental.com"
    }
  ],

  dentists: [
    { id: "d-1", name: "Dr. Alexander Vance", title: "Lead Prosthodontist", chair: "Chair 1 (Operatory A)", color: "#0D9488" },
    { id: "d-2", name: "Dr. Aris Thorne", title: "Endodontist", chair: "Chair 2 (Operatory B)", color: "#2563EB" },
    { id: "d-3", name: "Dr. Clara Patel", title: "General & Cosmetic", chair: "Chair 3 (Operatory C)", color: "#D97706" }
  ],

  patients: [
    {
      id: "P-1001",
      name: "Eleanor Vance",
      age: 62,
      gender: "Female",
      dob: "1964-04-12",
      phone: "(512) 555-0182",
      email: "eleanor.vance@gmail.com",
      address: "2408 South Congress Ave, Austin, TX",
      emergencyContact: "Thomas Vance (Spouse) - (512) 555-0199",
      bloodGroup: "O+",
      status: "Active",
      balance: "$0.00",
      medicalHistory: {
        conditions: ["Hypertension", "Osteoporosis"],
        dentalHistory: "Full upper crown bridge (2018), routine periodontal maintenance every 4 months.",
        allergies: ["Penicillin (Severe Rash)", "Aspirin"],
        habits: ["Former smoker (quit 2015)", "Moderate coffee drinker"]
      },
      lastVisit: "2026-09-18",
      nextAppointment: "Today, 10:00 AM"
    },
    {
      id: "P-1002",
      name: "David Chen",
      age: 34,
      gender: "Male",
      dob: "1992-08-25",
      phone: "(512) 555-0341",
      email: "david.chen@techcorp.io",
      address: "1100 Barton Springs Rd, Austin, TX",
      emergencyContact: "Linda Chen (Sister) - (512) 555-0348",
      bloodGroup: "A+",
      status: "Active",
      balance: "$120.00",
      medicalHistory: {
        conditions: ["Mild Asthma (Inhaler as needed)"],
        dentalHistory: "Orthodontics completed 2012. Needs composite filling on Tooth #14.",
        allergies: ["No Known Drug Allergies (NKDA)"],
        habits: ["Occasional bruxism (night grinding)"]
      },
      lastVisit: "2026-08-10",
      nextAppointment: "Today, 11:30 AM"
    },
    {
      id: "P-1003",
      name: "Sophia Rodriguez",
      age: 29,
      gender: "Female",
      dob: "1997-03-14",
      phone: "(512) 555-0812",
      email: "sophia.rodriguez@austinart.org",
      address: "410 E 6th Street, Austin, TX",
      emergencyContact: "Carlos Rodriguez (Brother) - (512) 555-0888",
      bloodGroup: "B+",
      status: "Active",
      balance: "$0.00",
      medicalHistory: {
        conditions: ["Pregnancy (2nd Trimester - 22 Weeks)"],
        dentalHistory: "Regular checkups, slight gingival bleeding due to pregnancy.",
        allergies: ["Latex Sensitivity (Use nitrile gloves)"],
        habits: ["None"]
      },
      lastVisit: "2026-06-04",
      nextAppointment: "Today, 2:00 PM"
    },
    {
      id: "P-1004",
      name: "Robert Miller",
      age: 58,
      gender: "Male",
      dob: "1968-11-03",
      phone: "(512) 555-0929",
      email: "rmiller@texasoil.com",
      address: "8800 Great Hills Trail, Austin, TX",
      emergencyContact: "Brenda Miller (Wife) - (512) 555-0930",
      bloodGroup: "O-",
      status: "Active",
      balance: "$450.00",
      medicalHistory: {
        conditions: ["Type 2 Diabetes (HbA1c 6.8)", "Coronary Stent (2023)"],
        dentalHistory: "Implant on #19, generalized bone loss stage II.",
        allergies: ["Sulfa drugs"],
        habits: ["Non-smoker"]
      },
      lastVisit: "2026-09-02",
      nextAppointment: "Tomorrow, 1:00 PM"
    },
    {
      id: "P-1005",
      name: "Jessica Taylor",
      age: 42,
      gender: "Female",
      dob: "1984-01-19",
      phone: "(512) 555-0677",
      email: "jtaylor@designstudio.com",
      address: "1604 Westlake Dr, Austin, TX",
      emergencyContact: "Mark Taylor (Spouse) - (512) 555-0679",
      bloodGroup: "AB+",
      status: "Active",
      balance: "$0.00",
      medicalHistory: {
        conditions: ["None"],
        dentalHistory: "Ceramic veneer teeth #7-#10. Flosses daily.",
        allergies: ["NKDA"],
        habits: ["None"]
      },
      lastVisit: "2026-07-21",
      nextAppointment: "Today, 3:30 PM"
    }
  ],

  appointments: [
    {
      id: "apt-101",
      patientId: "P-1001",
      patientName: "Eleanor Vance",
      dentistId: "d-1",
      dentistName: "Dr. Alexander Vance",
      operatory: "Chair 1 (Operatory A)",
      treatment: "Periodontal Maintenance & Crown Evaluation",
      date: "2026-10-12",
      time: "10:00 AM",
      duration: "45 min",
      status: "Confirmed",
      isAiBooked: false,
      notes: "Patient prefers warm water rinse due to dentin sensitivity."
    },
    {
      id: "apt-102",
      patientId: "P-1002",
      patientName: "David Chen",
      dentistId: "d-2",
      dentistName: "Dr. Aris Thorne",
      operatory: "Chair 2 (Operatory B)",
      treatment: "Composite Resin Filling (Tooth #14)",
      date: "2026-10-12",
      time: "11:30 AM",
      duration: "60 min",
      status: "In Progress",
      isAiBooked: false,
      notes: "Local anesthesia with Septocaine 4%."
    },
    {
      id: "apt-103",
      patientId: "P-1003",
      patientName: "Sophia Rodriguez",
      dentistId: "d-3",
      dentistName: "Dr. Clara Patel",
      operatory: "Chair 3 (Operatory C)",
      treatment: "Prenatal Gentle Dental Cleaning & Exam",
      date: "2026-10-12",
      time: "2:00 PM",
      duration: "45 min",
      status: "Scheduled",
      isAiBooked: false,
      notes: "Patient is 22 weeks pregnant. Ensure semi-reclined seating."
    },
    {
      id: "apt-104",
      patientId: "P-1005",
      patientName: "Jessica Taylor",
      dentistId: "d-1",
      dentistName: "Dr. Alexander Vance",
      operatory: "Chair 1 (Operatory A)",
      treatment: "Veneer Polish & Occlusal Check",
      date: "2026-10-12",
      time: "3:30 PM",
      duration: "30 min",
      status: "Confirmed",
      isAiBooked: true,
      notes: "AI Receptionist booked online after patient inquiry."
    },
    {
      id: "apt-105",
      patientId: "P-1004",
      patientName: "Robert Miller",
      dentistId: "d-2",
      dentistName: "Dr. Aris Thorne",
      operatory: "Chair 2 (Operatory B)",
      treatment: "Implant Torque Check & Hygiene",
      date: "2026-10-13",
      time: "1:00 PM",
      duration: "45 min",
      status: "Scheduled",
      isAiBooked: false,
      notes: "Pre-medication verified."
    }
  ],

  treatmentsCatalog: [
    { id: "trt-1", name: "Comprehensive Oral Exam & Bitewings", duration: "30 min", price: 140 },
    { id: "trt-2", name: "Standard Adult Prophylaxis (Cleaning)", duration: "45 min", price: 110 },
    { id: "trt-3", name: "Composite Resin Filling (1 Surface)", duration: "45 min", price: 185 },
    { id: "trt-4", name: "Porcelain-Fused-to-Zirconia Crown", duration: "90 min", price: 1250 },
    { id: "trt-5", name: "Molar Endodontic Therapy (Root Canal)", duration: "90 min", price: 1100 },
    { id: "trt-6", name: "Surgical Tooth Extraction", duration: "60 min", price: 380 },
    { id: "trt-7", name: "Periodontal Deep Scaling (Per Quad)", duration: "60 min", price: 290 },
    { id: "trt-8", name: "Emergency Pain Relief & Palliative Exam", duration: "30 min", price: 195 }
  ],

  treatmentPlans: [
    {
      id: "tp-501",
      patientId: "P-1002",
      patientName: "David Chen",
      dentistName: "Dr. Aris Thorne",
      title: "Restorative Treatment Plan - Quads 1 & 2",
      status: "In Progress",
      totalCost: 590,
      approvalStatus: "Approved by Patient",
      stages: [
        { stage: "Stage 1", procedure: "Composite Filling #14 MO", status: "In Progress", cost: 185 },
        { stage: "Stage 2", procedure: "Composite Filling #15 DO", status: "Planned", cost: 185 },
        { stage: "Stage 3", procedure: "Custom Night Guard Fabrication", status: "Planned", cost: 220 }
      ]
    },
    {
      id: "tp-502",
      patientId: "P-1004",
      patientName: "Robert Miller",
      dentistName: "Dr. Alexander Vance",
      title: "Implant Crown Restoration Plan",
      status: "Planned",
      totalCost: 1650,
      approvalStatus: "Pending Insurance Pre-Auth",
      stages: [
        { stage: "Stage 1", procedure: "Custom Titanium Abutment #19", status: "Planned", cost: 400 },
        { stage: "Stage 2", procedure: "Zirconia Implant Crown #19", status: "Planned", cost: 1250 }
      ]
    }
  ],

  invoices: [
    {
      id: "INV-2026-081",
      patientId: "P-1001",
      patientName: "Eleanor Vance",
      date: "2026-10-12",
      items: [
        { description: "Periodontal Maintenance", quantity: 1, unitPrice: 160 },
        { description: "Fluoride Varnish Treatment", quantity: 1, unitPrice: 45 }
      ],
      subtotal: 205,
      discount: 0,
      tax: 0,
      total: 205,
      paymentStatus: "Paid",
      paymentMethod: "Credit Card (Visa - 4412)"
    },
    {
      id: "INV-2026-082",
      patientId: "P-1002",
      patientName: "David Chen",
      date: "2026-10-12",
      items: [
        { description: "Composite Resin Filling (Tooth #14)", quantity: 1, unitPrice: 185 }
      ],
      subtotal: 185,
      discount: 0,
      tax: 0,
      total: 185,
      paymentStatus: "Partially Paid",
      paidAmount: 65,
      paymentMethod: "Delta Dental Copay / Cash"
    },
    {
      id: "INV-2026-080",
      patientId: "P-1004",
      patientName: "Robert Miller",
      date: "2026-10-09",
      items: [
        { description: "Emergency Exam & Radiographs", quantity: 1, unitPrice: 220 },
        { description: "Sedative Filling Stabilization", quantity: 1, unitPrice: 230 }
      ],
      subtotal: 450,
      discount: 0,
      tax: 0,
      total: 450,
      paymentStatus: "Unpaid",
      paymentMethod: "Pending"
    }
  ],

  aiReceptionist: {
    metrics: {
      totalCalls: 142,
      recoveredCalls: 38,
      revenueSaved: 14480,
      recoveryRate: "94.8%"
    },
    callLogs: [
      {
        id: "call-901",
        patientName: "Sarah Jenkins",
        callerId: "+1 (512) 555-7193",
        time: "Yesterday, 8:42 PM (After Hours)",
        duration: "1m 48s",
        intent: "Emergency Toothache",
        outcome: "Booked Appointment",
        recovered: true,
        estimatedRevenue: 380,
        sentiment: "Relieved",
        transcript: [
          { speaker: "AI", text: "Thank you for calling Beacon Peak Dental Group after hours. I'm Aesora, the clinic's digital coordinator. How can I help you this evening?" },
          { speaker: "Caller", text: "Hi, I have a terrible throbbing pain in my lower right jaw that started an hour ago. Do you have any emergency openings tomorrow?" },
          { speaker: "AI", text: "I'm so sorry you're dealing with that severe pain, Sarah. We reserve dedicated emergency slots for this exact reason. I have an opening tomorrow at 11:30 AM with Dr. Aris Thorne in Chair 2. Would that work for you?" },
          { speaker: "Caller", text: "Yes please, 11:30 AM works great." },
          { speaker: "AI", text: "You're all set for tomorrow at 11:30 AM with Dr. Thorne. I've sent a confirmation SMS to your number with our address and palliative care steps. Hang in there tonight, Sarah!" }
        ]
      },
      {
        id: "call-902",
        patientName: "Thomas Wright",
        callerId: "+1 (512) 555-8910",
        time: "Yesterday, 7:15 PM (After Hours)",
        duration: "2m 10s",
        intent: "Insurance & Cleaning Inquiry",
        outcome: "Booked Consultation",
        recovered: true,
        estimatedRevenue: 250,
        sentiment: "Satisfied",
        transcript: [
          { speaker: "AI", text: "Hello! Thank you for calling Beacon Peak Dental Group. I'm Aesora. Are you calling to book a visit or ask about our treatments?" },
          { speaker: "Caller", text: "Hi! I just moved to Austin and wanted to know if you accept MetLife PPO for new patient cleanings?" },
          { speaker: "AI", text: "Welcome to Austin, Thomas! Yes, Beacon Peak Dental is an in-network preferred provider for MetLife PPO. We can schedule your comprehensive exam and cleaning this Thursday at 2:00 PM with Dr. Clara Patel." },
          { speaker: "Caller", text: "That's super convenient. Let's do Thursday at 2." },
          { speaker: "AI", text: "Fantastic! You are booked for Thursday, October 15 at 2:00 PM with Dr. Patel. I've texted your digital intake form so you can skip clipboard paperwork when you arrive." }
        ]
      },
      {
        id: "call-903",
        patientName: "Emily Watson",
        callerId: "+1 (512) 555-4011",
        time: "Today, 7:05 AM (Pre-Opening)",
        duration: "1m 15s",
        intent: "Child Dental Checkup",
        outcome: "Booked Appointment",
        recovered: true,
        estimatedRevenue: 280,
        sentiment: "Friendly",
        transcript: [
          { speaker: "AI", text: "Good morning! Beacon Peak Dental Group AI receptionist. How can I assist you today?" },
          { speaker: "Caller", text: "Good morning, I'd like to schedule a 6-month checkup for my 8-year-old son Lucas." },
          { speaker: "AI", text: "We love seeing young patients! Dr. Clara Patel specializes in pediatric and family care. We have an opening next Monday at 3:30 PM, right after school hours. Would Lucas be available then?" },
          { speaker: "Caller", text: "3:30 PM is perfect." },
          { speaker: "AI", text: "Wonderful, Lucas is on our schedule with Dr. Patel. We look forward to seeing you both!" }
        ]
      }
    ]
  },

  // PHASE 2 DATASETS
  odontograms: {
    "P-1001": {
      patientId: "P-1001",
      notes: "Full upper zirconia bridge on #3-#14 placed 2018. Periodontal bone levels stable. Hygiene recall 4 months.",
      toothStatuses: {
        3: "Crown", 4: "Crown", 5: "Crown", 6: "Crown", 7: "Crown", 8: "Crown", 9: "Crown", 10: "Crown", 11: "Crown", 12: "Crown", 13: "Crown", 14: "Crown",
        19: "Healthy", 30: "Filling"
      }
    },
    "P-1002": {
      patientId: "P-1002",
      notes: "Tooth #14 distal caries detected on bitewings. Patient scheduled for composite resin restoration. Occlusal wear on lower incisors.",
      toothStatuses: {
        1: "Missing", 14: "Decayed", 15: "Filling", 16: "Missing", 17: "Missing", 19: "Filling", 30: "Filling", 32: "Missing"
      }
    },
    "P-1004": {
      patientId: "P-1004",
      notes: "Titanium implant osseointegrated at site #19. Torque test passed (35 Ncm). Awaiting final zirconia crown delivery.",
      toothStatuses: {
        18: "Crown", 19: "Implant", 20: "Healthy", 30: "Root Canal", 31: "Crown"
      }
    }
  },

  prescriptions: [
    {
      id: "RX-8401",
      patientId: "P-1002",
      patientName: "David Chen",
      dentistName: "Dr. Aris Thorne, DMD",
      medication: "Amoxicillin 500mg Capsule",
      dosage: "500 mg",
      sig: "Take 1 capsule by mouth three times daily (every 8 hours) with food until finished.",
      quantity: "21 capsules",
      refills: 0,
      date: "2026-10-12",
      status: "Active",
      indication: "Prophylaxis / Deep carious excavation"
    },
    {
      id: "RX-8398",
      patientId: "P-1001",
      patientName: "Eleanor Vance",
      dentistName: "Dr. Alexander Vance, DDS",
      medication: "Chlorhexidine Gluconate 0.12% Oral Rinse",
      dosage: "0.12% Liquid",
      sig: "Swish 15 mL (1 tablespoon) in mouth for 30 seconds twice daily after brushing and spit.",
      quantity: "473 mL (1 Pint)",
      refills: 1,
      date: "2026-10-10",
      status: "Active",
      indication: "Periodontal maintenance & tissue health"
    },
    {
      id: "RX-8392",
      patientId: "P-1004",
      patientName: "Robert Miller",
      dentistName: "Dr. Aris Thorne, DMD",
      medication: "Ibuprofen 600mg Tablet",
      dosage: "600 mg",
      sig: "Take 1 tablet every 6 hours as needed for dental pain or inflammation.",
      quantity: "16 tablets",
      refills: 0,
      date: "2026-10-09",
      status: "Completed",
      indication: "Post-operative implant evaluation analgesia"
    }
  ],

  files: [
    {
      id: "file-101",
      patientId: "P-1002",
      patientName: "David Chen",
      type: "Bitewing Radiograph",
      title: "Left Posterior Bitewing (Teeth #13-#15)",
      filename: "bitewing_q2_posterior_chen.png",
      date: "2026-08-10",
      size: "3.4 MB",
      dentist: "Dr. Aris Thorne",
      notes: "Shows interproximal radiolucency invading inner enamel on Tooth #14 DO.",
      thumbnail: "xray-bitewing"
    },
    {
      id: "file-102",
      patientId: "P-1001",
      patientName: "Eleanor Vance",
      type: "Panoramic X-Ray",
      title: "Full Arch Orthopantomogram (OPG)",
      filename: "panoramic_full_survey_vance.png",
      date: "2026-09-18",
      size: "8.1 MB",
      dentist: "Dr. Alexander Vance",
      notes: "Full survey verifying bridge abutment health and TMJ condylar symmetry.",
      thumbnail: "xray-panoramic"
    },
    {
      id: "file-103",
      patientId: "P-1004",
      patientName: "Robert Miller",
      type: "CBCT 3D Scan",
      title: "Mandibular Sectional CBCT #19 Site",
      filename: "cbct_volumetric_implant_miller.png",
      date: "2026-09-02",
      size: "24.6 MB",
      dentist: "Dr. Alexander Vance",
      notes: "Cross-sectional nerve canal distance 4.2mm clear of implant apex.",
      thumbnail: "xray-cbct"
    },
    {
      id: "file-104",
      patientId: "P-1003",
      patientName: "Sophia Rodriguez",
      type: "Consent Form",
      title: "Pregnancy & Dental Care Informed Consent",
      filename: "signed_maternal_dental_consent.pdf",
      date: "2026-06-04",
      size: "480 KB",
      dentist: "Dr. Clara Patel",
      notes: "Signed authorization for 2nd trimester routine hygiene and non-invasive exam.",
      thumbnail: "doc-consent"
    }
  ],

  inventory: [
    {
      id: "inv-item-1",
      name: "Septocaine 4% with Epinephrine 1:100,000",
      category: "Anesthetics",
      quantity: 4,
      threshold: 8,
      unit: "Boxes (50 carpules/box)",
      supplier: "Patterson Dental",
      costPerUnit: 74.50,
      status: "Low Stock Alert"
    },
    {
      id: "inv-item-2",
      name: "Nitrile Examination Gloves - Size M",
      category: "Infection Control",
      quantity: 2,
      threshold: 6,
      unit: "Cases (10 boxes/case)",
      supplier: "Henry Schein",
      costPerUnit: 82.00,
      status: "Low Stock Alert"
    },
    {
      id: "inv-item-3",
      name: "3M Filtek Supreme Ultra Composite Capsule A2",
      category: "Restorative",
      quantity: 12,
      threshold: 5,
      unit: "Packs (20 capsules/pack)",
      supplier: "Henry Schein",
      costPerUnit: 118.00,
      status: "In Stock"
    },
    {
      id: "inv-item-4",
      name: "Level 3 ASTM Surgical Earloop Masks",
      category: "Infection Control",
      quantity: 15,
      threshold: 4,
      unit: "Boxes (50 masks/box)",
      supplier: "Patterson Dental",
      costPerUnit: 19.95,
      status: "In Stock"
    },
    {
      id: "inv-item-5",
      name: "Kerr OptiBond Universal Adhesive 5mL",
      category: "Restorative",
      quantity: 6,
      threshold: 2,
      unit: "Bottles",
      supplier: "Benco Dental",
      costPerUnit: 135.00,
      status: "In Stock"
    },
    {
      id: "inv-item-6",
      name: "Dentsply Maillefer Gutta Percha Points Assorted",
      category: "Endodontics",
      quantity: 9,
      threshold: 3,
      unit: "Packs",
      supplier: "Henry Schein",
      costPerUnit: 44.50,
      status: "In Stock"
    },
    {
      id: "inv-item-7",
      name: "CaviCide Surface Disinfectant Spray 1 Gal",
      category: "Sterilization",
      quantity: 8,
      threshold: 3,
      unit: "Gallons",
      supplier: "Benco Dental",
      costPerUnit: 38.00,
      status: "In Stock"
    },
    {
      id: "inv-item-8",
      name: "Dental Patient Bibs 3-Ply Teal (500/case)",
      category: "Disposables",
      quantity: 14,
      threshold: 4,
      unit: "Cases",
      supplier: "Henry Schein",
      costPerUnit: 34.00,
      status: "In Stock"
    }
  ],

  reports: {
    monthlyProduction: 48250,
    monthlyCollections: 44620,
    collectionRate: "92.5%",
    newPatientsThisMonth: 24,
    returningPatients: 148,
    activeRecallRate: "88.4%",
    chairUtilization: {
      "Dr. Alexander Vance (Chair 1)": "91%",
      "Dr. Aris Thorne (Chair 2)": "86%",
      "Dr. Clara Patel (Chair 3)": "82%"
    },
    cancellationRate: "4.1%",
    noShowRate: "1.8%",
    procedureMix: [
      { name: "Restorative & Fillings", percentage: 38, revenue: 18335 },
      { name: "Hygiene & Periodontal", percentage: 31, revenue: 14957 },
      { name: "Crown & Bridge / Implants", percentage: 19, revenue: 9167 },
      { name: "Endodontics & Surgery", percentage: 12, revenue: 5791 }
    ]
  },

  settings: {
    clinicName: "Beacon Peak Dental Group",
    address: "2408 South Congress Ave, Suite 300, Austin, TX 78704",
    phone: "(512) 892-4400",
    email: "reception@beaconpeakdental.com",
    website: "https://beaconpeakdental.com",
    taxId: "XX-XXX8492",
    npi: "1942859102",
    operatingHours: "Monday – Friday: 8:00 AM – 5:00 PM CST",
    operatories: [
      { name: "Chair 1 (Operatory A)", primaryDoctor: "Dr. Alexander Vance", type: "Prosthodontics & Surgery" },
      { name: "Chair 2 (Operatory B)", primaryDoctor: "Dr. Aris Thorne", type: "Endodontics & Restorative" },
      { name: "Chair 3 (Operatory C)", primaryDoctor: "Dr. Clara Patel", type: "Pediatric & Cosmetic" },
      { name: "Chair 4 (Surgical Suite)", primaryDoctor: "Hygiene / Emergency Overflow", type: "Specialized" }
    ],
    aiReceptionistConfig: {
      answerDelay: "2 Rings (1.2s)",
      voiceTone: "Empathetic, Professional, Clinical Confidence",
      triageMode: "High Priority Emergency Detection",
      smsConfirmation: "Enabled (Instant SMS with directions)",
      emergencyEscalationPhone: "(512) 555-0199"
    }
  },

  auditLog: [
    {
      id: "aud-901",
      user: "Dr. Alexander Vance, DDS",
      role: "Clinic Owner",
      action: "Clinical Record Accessed",
      details: "Viewed patient medical history & odontogram for Eleanor Vance (P-1001)",
      timestamp: "Today, 10:14 AM",
      ip: "192.168.1.104"
    },
    {
      id: "aud-902",
      user: "Maya Lin",
      role: "Front Desk Lead",
      action: "Invoice Payment Collected",
      details: "Recorded $205.00 payment for Invoice INV-2026-081 (Credit Card)",
      timestamp: "Today, 09:48 AM",
      ip: "192.168.1.102"
    },
    {
      id: "aud-903",
      user: "AI Receptionist (System)",
      role: "Automated Agent",
      action: "Emergency Slot Auto-Booked",
      details: "Triage & calendar lock: Marcus Sterling for Oct 13 9:30 AM (Chair 1)",
      timestamp: "Today, 08:52 AM",
      ip: "127.0.0.1 (Local Voice Gateway)"
    },
    {
      id: "aud-904",
      user: "Maya Lin",
      role: "Front Desk Lead",
      action: "User Login",
      details: "Authenticated successfully at Front Desk Reception Terminal #1",
      timestamp: "Today, 08:30 AM",
      ip: "192.168.1.102"
    },
    {
      id: "aud-905",
      user: "Dr. Alexander Vance, DDS",
      role: "Clinic Owner",
      action: "User Login",
      details: "Authenticated successfully at Doctor Operatory Station #1",
      timestamp: "Today, 08:15 AM",
      ip: "192.168.1.104"
    },
    {
      id: "aud-906",
      user: "AI Receptionist (System)",
      role: "Automated Agent",
      action: "After-Hours Call Recovered",
      details: "Triaged call from Sarah Jenkins (+1 512-555-7193) · Rescheduled consultation",
      timestamp: "Yesterday, 08:42 PM",
      ip: "127.0.0.1 (Local Voice Gateway)"
    }
  ]
};

class Store {
  constructor() {
    this.data = this.loadData();
    this.listeners = [];
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not load from localStorage, using INITIAL_DATA", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
    this.notify();
  }

  resetDemoData() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.data));
  }

  // Current User / Auth
  setCurrentUser(userKey) {
    const user = this.data.users.find(u => u.roleKey === userKey) || this.data.users[0];
    this.data.currentUser = user;
    this.saveData();
  }

  // Patients
  getPatients() {
    return this.data.patients;
  }

  getPatientById(id) {
    return this.data.patients.find(p => p.id === id);
  }

  addPatient(patient) {
    const nextId = "P-" + (1000 + this.data.patients.length + 1);
    const newPatient = {
      id: nextId,
      status: "Active",
      balance: "$0.00",
      ...patient
    };
    this.data.patients.unshift(newPatient);
    this.saveData();
    return newPatient;
  }

  // Appointments
  getAppointments() {
    return this.data.appointments;
  }

  addAppointment(appt) {
    const nextId = "apt-" + (100 + this.data.appointments.length + 1);
    const newAppt = {
      id: nextId,
      ...appt
    };
    this.data.appointments.push(newAppt);
    this.saveData();
    return newAppt;
  }

  // Treatment Plans
  getTreatmentPlans() {
    return this.data.treatmentPlans;
  }

  addTreatmentPlan(tp) {
    const nextId = "tp-" + (500 + this.data.treatmentPlans.length + 1);
    const newPlan = { id: nextId, ...tp };
    this.data.treatmentPlans.unshift(newPlan);
    this.saveData();
    return newPlan;
  }

  // Invoices
  getInvoices() {
    return this.data.invoices;
  }

  addInvoice(invoice) {
    const nextId = "INV-2026-" + String(80 + this.data.invoices.length + 1).padStart(3, '0');
    const newInv = { id: nextId, ...invoice };
    this.data.invoices.unshift(newInv);
    this.saveData();
    return newInv;
  }

  // AI Receptionist
  getAiMetrics() {
    return this.data.aiReceptionist.metrics;
  }

  getCallLogs() {
    return this.data.aiReceptionist.callLogs;
  }

  /**
   * Hero Centerpiece: Simulates the incoming call cascade for Marcus Sterling.
   * Books appointment on calendar, adds Marcus to CRM, updates dashboard metrics.
   */
  executeAiBookingCascade(bookingDetails) {
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
    } = bookingDetails || {};

    // 1. Check if Marcus Sterling already exists or create him
    let patient = this.data.patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
    if (!patient) {
      patient = {
        id: "P-" + (1000 + this.data.patients.length + 1),
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
      this.data.patients.unshift(patient);
    }

    // 2. Add New Appointment to the Calendar
    const newAppt = {
      id: "apt-" + (100 + this.data.appointments.length + 1),
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
    this.data.appointments.push(newAppt);

    // 3. Log Call in AI Receptionist History
    const newCallLog = {
      id: "call-" + (900 + this.data.aiReceptionist.callLogs.length + 1),
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
    this.data.aiReceptionist.callLogs.unshift(newCallLog);

    // 4. Update AI Metrics and Recovery Pipeline
    this.data.aiReceptionist.metrics.totalCalls += 1;
    this.data.aiReceptionist.metrics.recoveredCalls += 1;
    this.data.aiReceptionist.metrics.revenueSaved += estimatedValue;

    this.saveData();

    return { patient, appointment: newAppt, callLog: newCallLog };
  }

  // Phase 2: Odontogram
  getOdontogram(patientId) {
    if (!this.data.odontograms[patientId]) {
      this.data.odontograms[patientId] = {
        patientId,
        notes: "Routine dentition chart.",
        toothStatuses: {}
      };
    }
    return this.data.odontograms[patientId];
  }

  updateToothStatus(patientId, toothNum, status, notes) {
    const chart = this.getOdontogram(patientId);
    chart.toothStatuses[toothNum] = status;
    if (notes !== undefined) chart.notes = notes;
    this.saveData();
    this.addAuditLog("Odontogram Updated", `Tooth #${toothNum} marked as ${status} for ${patientId}`);
    return chart;
  }

  // Phase 2: Prescriptions
  getPrescriptions() {
    return this.data.prescriptions;
  }

  addPrescription(rx) {
    const nextId = "RX-" + (8400 + this.data.prescriptions.length + 1);
    const newRx = { id: nextId, date: new Date().toISOString().split('T')[0], status: "Active", ...rx };
    this.data.prescriptions.unshift(newRx);
    this.saveData();
    this.addAuditLog("Prescription Issued", `${newRx.medication} prescribed to ${newRx.patientName}`);
    return newRx;
  }

  // Phase 2: Files & Imaging
  getFiles(patientId, type) {
    return this.data.files.filter(f => {
      const matchPatient = !patientId || patientId === 'all' || f.patientId === patientId;
      const matchType = !type || type === 'all' || f.type.toLowerCase().includes(type.toLowerCase());
      return matchPatient && matchType;
    });
  }

  addFile(fileObj) {
    const nextId = "file-" + (100 + this.data.files.length + 1);
    const newFile = { id: nextId, date: new Date().toISOString().split('T')[0], ...fileObj };
    this.data.files.unshift(newFile);
    this.saveData();
    this.addAuditLog("Clinical File Uploaded", `${newFile.title} (${newFile.type}) added for ${newFile.patientName}`);
    return newFile;
  }

  // Phase 2: Inventory
  getInventory() {
    return this.data.inventory;
  }

  adjustInventory(itemId, delta) {
    const item = this.data.inventory.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(0, item.quantity + delta);
      item.status = item.quantity <= item.threshold ? "Low Stock Alert" : "In Stock";
      this.saveData();
      this.addAuditLog("Inventory Adjusted", `${item.name}: quantity adjusted by ${delta > 0 ? '+' + delta : delta} (${item.quantity} ${item.unit} remaining)`);
    }
    return item;
  }

  // Phase 2: Reports & Settings
  getReports() {
    return this.data.reports;
  }

  getSettings() {
    return this.data.settings;
  }

  saveSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
    this.addAuditLog("Clinic Settings Saved", "Practice configuration and AI thresholds updated");
  }

  // Phase 2: Audit Log
  getAuditLogs() {
    return this.data.auditLog;
  }

  addAuditLog(action, details, user) {
    const activeUser = user || this.data.currentUser;
    const newLog = {
      id: "aud-" + (900 + this.data.auditLog.length + 1),
      user: activeUser.name,
      role: activeUser.role,
      action: action,
      details: details,
      timestamp: "Just now",
      ip: "192.168.1.104"
    };
    this.data.auditLog.unshift(newLog);
    this.saveData();
  // Phase 3: Scheduling Conflict & Double-Booking Logic
  checkSchedulingConflict(date, time, operatory, ignoreApptId = null) {
    const existing = this.data.appointments.find(a => {
      if (ignoreApptId && a.id === ignoreApptId) return false;
      const isSameDate = a.date === date;
      const isSameTime = a.time.split(':')[0] === time.split(':')[0] && a.time.includes(time.includes('AM') ? 'AM' : 'PM');
      const isSameChair = a.operatory.toLowerCase().includes(operatory.toLowerCase());
      return isSameDate && isSameTime && isSameChair && a.status !== 'Cancelled';
    });

    return {
      hasConflict: !!existing,
      conflictingAppt: existing || null
    };
  }

  rescheduleAppointment(apptId, newTime, newOperatory, newDentistName, isDoubleBooked = false) {
    const appt = this.data.appointments.find(a => a.id === apptId);
    if (!appt) return null;

    const oldTime = appt.time;
    const oldChair = appt.operatory;
    appt.time = newTime;
    appt.operatory = newOperatory;
    if (newDentistName) appt.dentistName = newDentistName;
    if (isDoubleBooked) {
      appt.status = "Double-Booked (Override)";
    } else if (appt.status.includes('Double-Booked')) {
      appt.status = "Confirmed";
    }

    this.saveData();

    // Audit and dispatch simulated SMS
    this.addAuditLog(
      "Appointment Rescheduled",
      `${appt.patientName} moved from ${oldChair} (${oldTime}) to ${newOperatory} (${newTime}) ${isDoubleBooked ? '[Emergency Double-Booking Override]' : ''}`
    );

    this.sendCommunication(
      appt.patientId,
      "SMS",
      `Beacon Peak Dental: Hi ${appt.patientName.split(' ')[0]}, your appointment has been updated to ${newTime} in ${newOperatory}. Reply C to confirm.`
    );

    return appt;
  }

  // Phase 3: Duplicate Patient Detection
  checkDuplicatePatient(name = '', phone = '', email = '') {
    const cleanName = name.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName && !cleanPhone && !cleanEmail) return [];

    return this.data.patients.filter(p => {
      const pName = p.name.toLowerCase();
      const pPhone = p.phone.replace(/\D/g, '');
      const pEmail = (p.email || '').toLowerCase();

      const nameMatch = cleanName.length >= 3 && (pName.includes(cleanName) || cleanName.includes(pName));
      const phoneMatch = cleanPhone.length >= 7 && pPhone.includes(cleanPhone);
      const emailMatch = cleanEmail.length >= 5 && pEmail === cleanEmail;

      return nameMatch || phoneMatch || emailMatch;
    });
  }

  // Phase 3: Simulated Real SMS / Email Dispatcher
  sendCommunication(patientId, type = "SMS", message = "") {
    if (!this.data.communications) this.data.communications = [];
    const patient = this.getPatientById(patientId);
    const comm = {
      id: "comm-" + (100 + this.data.communications.length + 1),
      patientId: patientId,
      patientName: patient ? patient.name : "Patient",
      destination: type === "SMS" ? (patient ? patient.phone : "+1 (512) 555-0100") : (patient ? patient.email : "patient@example.com"),
      type: type,
      message: message,
      timestamp: "Just now",
      status: "Delivered",
      carrier: type === "SMS" ? "Twilio Carrier Network (AT&T / Verizon)" : "SendGrid Dedicated Medical IP",
      latency: "340ms"
    };

    this.data.communications.unshift(comm);
    this.saveData();
    this.addAuditLog(`Outbound ${type} Dispatched`, `Sent to ${comm.patientName} (${comm.destination})`);
    return comm;
  }

  getCommunications(patientId = null) {
    if (!this.data.communications) this.data.communications = [];
    if (patientId) {
      return this.data.communications.filter(c => c.patientId === patientId);
    }
    return this.data.communications;
  }

  // Phase 3: Real Role Permissions Enforcement
  hasPermission(action) {
    const roleKey = this.data.currentUser.roleKey;
    const permissions = {
      admin: ['all'],
      dentist: [
        'view_calendar', 'schedule_appointment', 'view_patients',
        'edit_medical_history', 'write_prescription', 'edit_odontogram',
        'upload_files', 'create_treatment_plan', 'view_inventory'
      ],
      receptionist: [
        'view_calendar', 'schedule_appointment', 'reschedule_appointment',
        'view_patients', 'register_patient', 'create_invoice',
        'collect_payment', 'view_ai_receptionist', 'send_sms', 'adjust_inventory'
      ]
    };

    const userPerms = permissions[roleKey] || [];
    return userPerms.includes('all') || userPerms.includes(action);
  }
}

// Global singleton instance
window.appStore = new Store();

