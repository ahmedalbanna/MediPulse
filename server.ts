import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API Data
  const patients = [
    { 
      id: 'PT001', name: 'James Wilson', email: 'j.wilson@email.com', age: 45, gender: 'Male', lastVisit: '2024-04-20', status: 'Stable', contact: '+1 234-567-8901',
      address: '123 Maple St, Springfield',
      history: [
        { date: '2024-04-20', status: 'Stable', note: 'Routine checkup. All vitals normal.' },
        { date: '2024-03-15', status: 'Recovering', note: 'Post-op review. Incision healing well.' }
      ],
      notes: ['Patient is allergic to Penicillin.', 'Prefers morning appointments.'],
      medications: [
        { id: 'm1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2023-01-15' }
      ]
    },
    { 
      id: 'PT002', name: 'Emma Thompson', email: 'emma.t@email.com', age: 29, gender: 'Female', lastVisit: '2024-04-25', status: 'Recovering', contact: '+1 234-567-8902',
      address: '456 Oak Ln, Riverton',
      history: [
        { date: '2024-04-25', status: 'Recovering', note: 'Physical therapy session.' }
      ],
      notes: ['Requires assistance with mobility.'],
      medications: [
        { id: 'm2', name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed for pain', startDate: '2024-04-10' },
        { id: 'm3', name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-04-20' }
      ]
    },
    { 
      id: 'PT003', name: 'Robert Davis', email: 'r.davis@email.com', age: 72, gender: 'Male', lastVisit: '2024-04-22', status: 'Critical', contact: '+1 234-567-8903',
      address: '789 Pine Rd, Hilltop',
      history: [
        { date: '2024-04-22', status: 'Critical', note: 'Admitted with respiratory distress.' }
      ],
      notes: ['History of cardiac issues.'],
      medications: []
    },
    { id: 'PT004', name: 'Sophia Martinez', email: 's.martinez@email.com', age: 34, gender: 'Female', lastVisit: '2024-04-24', status: 'Stable', contact: '+1 234-567-8904' },
    { id: 'PT005', name: 'Michael Chen', email: 'm.chen@email.com', age: 51, gender: 'Male', lastVisit: '2024-04-19', status: 'Stable', contact: '+1 234-567-8905' },
    { id: 'PT006', name: 'Sarah Miller', email: 's.miller@email.com', age: 42, gender: 'Female', lastVisit: '2024-04-26', status: 'Recovering', contact: '+1 234-567-8906' },
    { id: 'PT007', name: 'David Jones', email: 'd.jones@email.com', age: 65, gender: 'Male', lastVisit: '2024-04-21', status: 'Critical', contact: '+1 234-567-8907' },
    { id: 'PT008', name: 'Olivia Brown', email: 'o.brown@email.com', age: 27, gender: 'Female', lastVisit: '2024-04-23', status: 'Stable', contact: '+1 234-567-8908' },
    { id: 'PT009', name: 'William Garcia', email: 'w.garcia@email.com', age: 58, gender: 'Male', lastVisit: '2024-04-18', status: 'Stable', contact: '+1 234-567-8909' },
    { id: 'PT010', name: 'Isabella Lee', email: 'i.lee@email.com', age: 39, gender: 'Female', lastVisit: '2024-04-26', status: 'Recovering', contact: '+1 234-567-8910' },
    { id: 'PT011', name: 'Lucas White', email: 'l.white@email.com', age: 48, gender: 'Male', lastVisit: '2024-04-15', status: 'Stable', contact: '+1 234-567-8911' },
    { id: 'PT012', name: 'Mia Anderson', email: 'm.anderson@email.com', age: 31, gender: 'Female', lastVisit: '2024-04-17', status: 'Stable', contact: '+1 234-567-8912' },
    { id: 'PT013', name: 'Ethan Taylor', email: 'e.taylor@email.com', age: 52, gender: 'Male', lastVisit: '2024-04-14', status: 'Stable', contact: '+1 234-567-8913' },
    { id: 'PT014', name: 'Charlotte Moore', email: 'c.moore@email.com', age: 36, gender: 'Female', lastVisit: '2024-04-12', status: 'Recovering', contact: '+1 234-567-8914' },
  ];

  let medicalRecords = [
    {
      id: 'REC001',
      patientId: 'PT001',
      patientName: 'James Wilson',
      type: 'Laboratory',
      title: 'Complete Blood Count (CBC)',
      date: '2024-04-20',
      status: 'Final',
      doctor: 'Dr. Sarah Wilson',
      department: 'Hematology',
      fileSize: '1.2 MB'
    },
    {
      id: 'REC002',
      patientId: 'PT001',
      patientName: 'James Wilson',
      type: 'Radiology',
      title: 'Chest X-Ray PA View',
      date: '2024-03-15',
      status: 'Final',
      doctor: 'Dr. Michael Chen',
      department: 'Radiology',
      fileSize: '4.5 MB'
    },
    {
      id: 'REC003',
      patientId: 'PT002',
      patientName: 'Emma Thompson',
      type: 'Prescription',
      title: 'Post-Op Medication Plan',
      date: '2024-04-25',
      status: 'Active',
      doctor: 'Dr. Julian Vane',
      department: 'General Surgery',
      fileSize: '0.4 MB'
    },
    {
      id: 'REC004',
      patientId: 'PT003',
      patientName: 'Robert Davis',
      type: 'Laboratory',
      title: 'Metabolic Panel',
      date: '2024-04-22',
      status: 'Pending',
      doctor: 'Dr. Elena Rodriguez',
      department: 'Clinical Bio',
      fileSize: '0.8 MB'
    }
  ];

  const appointments = [
    {
      id: 'APP001',
      patientId: 'PT001',
      patientName: 'James Wilson',
      doctor: 'Dr. Sarah Wilson',
      date: '2024-04-28',
      time: '09:00',
      duration: 30,
      type: 'Consultation',
      status: 'Confirmed'
    },
    {
      id: 'APP002',
      patientId: 'PT002',
      patientName: 'Emma Thompson',
      doctor: 'Dr. Michael Chen',
      date: '2024-04-28',
      time: '10:30',
      duration: 45,
      type: 'Follow-up',
      status: 'Confirmed'
    },
    {
      id: 'APP003',
      patientId: 'PT004',
      patientName: 'Sophia Martinez',
      doctor: 'Dr. Sarah Wilson',
      date: '2024-04-29',
      time: '14:00',
      duration: 30,
      type: 'Examination',
      status: 'Pending'
    }
  ];

  let invoices = [
    { id: 'INV001', patientId: 'PT001', patientName: 'James Wilson', amount: 450.00, date: '2024-04-10', dueDate: '2024-04-24', status: 'Paid', items: [{ desc: 'Consultation', price: 150 }, { desc: 'Blood Test', price: 300 }] },
    { id: 'INV002', patientId: 'PT002', patientName: 'Emma Thompson', amount: 1200.00, date: '2024-04-15', dueDate: '2024-04-29', status: 'Pending', items: [{ desc: 'Physical Therapy', price: 200 }, { desc: 'Post-Op Care', price: 1000 }] },
    { id: 'INV003', patientId: 'PT003', patientName: 'Robert Davis', amount: 3500.00, date: '2024-04-20', dueDate: '2024-05-04', status: 'Overdue', items: [{ desc: 'Emergency Admission', price: 1500 }, { desc: 'ICU Stay (1 day)', price: 2000 }] },
    { id: 'INV004', patientId: 'PT004', patientName: 'Sophia Martinez', amount: 150.00, date: '2024-04-22', dueDate: '2024-05-06', status: 'Paid', items: [{ desc: 'General Checkup', price: 150 }] },
    { id: 'INV005', patientId: 'PT005', patientName: 'Michael Chen', amount: 85.00, date: '2024-04-23', dueDate: '2024-05-07', status: 'Pending', items: [{ desc: 'Prescription Renewal', price: 85 }] },
  ];

  let transactions = [
    { id: 'TRX001', invoiceId: 'INV001', type: 'Payment', amount: 450.00, method: 'Credit Card', date: '2024-04-11' },
    { id: 'TRX002', invoiceId: 'INV004', type: 'Payment', amount: 150.00, method: 'Insurance', date: '2024-04-23' },
  ];

  let users = [
    { id: 'USR001', name: 'Dr. Sarah Wilson', email: 's.wilson@hospital.com', role: 'Doctor', department: 'Cardiology', status: 'Active', permissions: ['view_patients', 'edit_records', 'prescribe_meds'] },
    { id: 'USR002', name: 'John Doe', email: 'j.doe@hospital.com', role: 'Admin', department: 'Administration', status: 'Active', permissions: ['all'] },
    { id: 'USR003', name: 'Nurse Emily Brown', email: 'e.brown@hospital.com', role: 'Nurse', department: 'Emergency', status: 'Active', permissions: ['view_patients', 'update_vitals'] },
    { id: 'USR004', name: 'James Wilson', email: 'james.w@gmail.com', role: 'Patient', department: 'Outpatient', status: 'Active', permissions: ['view_own_records'] },
  ];

  // API Routes
  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  app.post("/api/users", (req, res) => {
    const newUser = {
      ...req.body,
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
    };
    users.push(newUser);
    res.status(201).json(newUser);
  });

  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...req.body };
      res.json(users[index]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter(u => u.id !== id);
    res.status(204).send();
  });

  // Billing API
  app.get("/api/billing/invoices", (req, res) => {
    res.json(invoices);
  });

  app.post("/api/billing/invoices", (req, res) => {
    const newInvoice = {
      ...req.body,
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    invoices.push(newInvoice);
    res.status(201).json(newInvoice);
  });

  app.put("/api/billing/invoices/:id/pay", (req, res) => {
    const { id } = req.params;
    const { method } = req.body;
    const index = invoices.findIndex(inv => inv.id === id);
    
    if (index !== -1) {
      invoices[index].status = 'Paid';
      const newTrx = {
        id: `TRX${String(transactions.length + 1).padStart(3, '0')}`,
        invoiceId: id,
        type: 'Payment',
        amount: invoices[index].amount,
        method: method || 'Credit Card',
        date: new Date().toISOString().split('T')[0]
      };
      transactions.push(newTrx);
      res.json({ invoice: invoices[index], transaction: newTrx });
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
  });

  app.get("/api/billing/transactions", (req, res) => {
    res.json(transactions);
  });

  app.get("/api/billing/stats", (req, res) => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
    const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
    
    // Monthly aggregation (simple)
    const monthlyRevenue = [
      { month: 'Jan', revenue: 4500 },
      { month: 'Feb', revenue: 5200 },
      { month: 'Mar', revenue: 4800 },
      { month: 'Apr', revenue: totalRevenue }
    ];

    res.json({
      totalRevenue,
      pendingAmount,
      overdueAmount,
      monthlyRevenue,
      invoiceCount: invoices.length,
      paidCount: invoices.filter(i => i.status === 'Paid').length
    });
  });

  app.get("/api/appointments", (req, res) => {
    res.json(appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const newAppointment = {
      ...req.body,
      id: `APP${String(appointments.length + 1).padStart(3, '0')}`,
    };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
  });

  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    try {
      const response = await fetch("http://185.190.140.93:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen2.5:1.5b",
          prompt: `${history.map((h: any) => `${h.role}: ${h.parts[0].text}`).join("\n")}\nuser: ${message}`,
          stream: false
        })
      });
      if (!response.ok) {
        throw new Error('Ollama API error');
      }
      const data = await response.json();
      res.json({ response: data.response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to communicate with AI" });
    }
  });

  app.post("/api/ai-diagnostics", async (req, res) => {
    const { symptoms } = req.body;
    try {
      const response = await fetch("http://185.190.140.93:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen2.5:1.5b",
          prompt: `You are an AI medical diagnostic assistant. Based on the following symptoms and history: "${symptoms}", provide a concise preliminary diagnostic insight, potential causes, and recommended next steps or tests. You must state clearly that this is not medical advice and a professional consultation is required.`,
          stream: false
        })
      });
      if (!response.ok) {
        throw new Error('Ollama API error');
      }
      const data = await response.json();
      res.json({ insight: data.response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate diagnostic insight" });
    }
  });

  app.get("/api/records", (req, res) => {
    const { patientId, type } = req.query;
    let filtered = [...medicalRecords];
    
    if (patientId) filtered = filtered.filter(r => r.patientId === patientId);
    if (type && type !== 'All') filtered = filtered.filter(r => r.type === type);
    
    res.json(filtered);
  });
  app.get("/api/patients/all", (req, res) => {
    res.json(patients);
  });

  app.get("/api/patients", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const sortBy = (req.query.sortBy as string) || 'name';
    const sortOrder = (req.query.sortOrder as string) || 'asc';
    
    // Filters
    const status = req.query.status as string;
    const minAge = parseInt(req.query.minAge as string);
    const maxAge = parseInt(req.query.maxAge as string);
    const lastVisit = req.query.lastVisit as string;

    let filteredData = [...patients];

    if (status && status !== 'All') {
      filteredData = filteredData.filter(p => p.status === status);
    }
    if (!isNaN(minAge)) {
      filteredData = filteredData.filter(p => p.age >= minAge);
    }
    if (!isNaN(maxAge)) {
      filteredData = filteredData.filter(p => p.age <= maxAge);
    }
    if (lastVisit) {
      filteredData = filteredData.filter(p => p.lastVisit === lastVisit);
    }

    let sortedData = filteredData.sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    
    res.json({
      data: sortedData.slice(start, end),
      total: filteredData.length,
      page,
      pageSize: limit,
      totalPages: Math.ceil(filteredData.length / limit)
    });
  });

  app.put("/api/patients/:id", (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    const index = patients.findIndex(p => p.id === id);
    
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updateData };
      res.json(patients[index]);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  });

  app.post("/api/patients", (req, res) => {
    const newPatient = {
      ...req.body,
      id: `PT${String(patients.length + 1).padStart(3, '0')}`,
    };
    patients.unshift(newPatient); // Add to beginning
    res.status(201).json(newPatient);
  });

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "MediPulse Backend v4.2" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediPulse Pro Server running on http://localhost:${PORT}`);
  });
}

startServer();
