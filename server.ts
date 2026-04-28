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
      id: 'PT015', name: 'أحمد محمود', email: 'ahmed.m@email.com', age: 38, gender: 'Male', lastVisit: '2024-04-20', status: 'Stable', contact: '0501234567',
      address: 'حي النرجس، الرياض',
      history: [
        { date: '2024-04-20', status: 'Stable', note: 'فحص دوري. المؤشرات الحيوية طبيعية.' },
        { date: '2024-03-10', status: 'Recovering', note: 'تحسن ملحوظ بعد العملية الجراحية.' }
      ],
      notes: ['حساسية من البنسلين.', 'يفضل المواعيد المسائية.'],
      medications: [
        { id: 'm1', name: 'أملوديبين', dosage: '5mg', frequency: 'مرة يومياً', startDate: '2024-01-15' }
      ],
      diagnoses: [
        { id: 'd1', date: '2024-01-15', condition: 'ارتفاع ضغط الدم الأولي', doctor: 'د. أحمد البنا', notes: 'يجب البدء في برنامج حمية غذائية.' }
      ],
      labResults: [
        { id: 'l1', date: '2024-04-18', testName: 'فحص الكوليسترول', result: '180 mg/dL', status: 'Normal' }
      ],
      treatmentPlans: [
        { id: 'tp1', startDate: '2024-01-20', goal: 'خفض الوزن وتحسين الضغط', steps: ['رياضة 30 دقيقة', 'تقليل الملح'], status: 'Active' }
      ]
    },
    { 
      id: 'PT016', name: 'سارة خالد', email: 'sara.k@email.com', age: 25, gender: 'Female', lastVisit: '2024-04-25', status: 'Recovering', contact: '0559876543',
      address: 'دبي ماربيا، حي الصفوح',
      history: [
        { date: '2024-04-25', status: 'Recovering', note: 'جلسة علاج طبيعي ناجحة.' }
      ],
      notes: ['تحتاج لمساعدة في الحركة.'],
      medications: [
        { id: 'm2', name: 'بانادول اكسترا', dosage: '500mg', frequency: 'عند اللزوم', startDate: '2024-04-10' }
      ],
      labResults: [],
      diagnoses: [
        { id: 'd2', date: '2024-04-10', condition: 'إجهاد عضلي بسيط', doctor: 'د. سارة عثمان', notes: 'الراحة التامة لمدة 3 أيام.' }
      ],
      treatmentPlans: []
    },
    {
      id: 'PT017', name: 'فهد العتيبي', email: 'fahad.o@email.com', age: 52, gender: 'Male', lastVisit: '2024-04-18', status: 'Critical', contact: '0543322110',
      address: 'جدة، حي السامر',
      history: [
        { date: '2024-04-18', status: 'Critical', note: 'دخول طوارئ بسبب ضيق تنفس.' }
      ],
      notes: ['مدخن سابق.'],
      medications: [
        { id: 'm4', name: 'فينتولين بخاخ', dosage: '100mcg', frequency: 'عند اللزوم', startDate: '2024-04-18' }
      ],
      diagnoses: [
        { id: 'd3', date: '2024-04-18', condition: 'أزمة ربو حادة', doctor: 'د. فيصل العمر', notes: 'تحت الملاحظة الشديدة.' }
      ],
      labResults: [
        { id: 'l2', date: '2024-04-18', testName: 'غازات الدم', result: 'Abnormal', status: 'Pending' }
      ],
      treatmentPlans: [
        { id: 'tp2', startDate: '2024-04-18', goal: 'استقرار الحالة التنفسية', steps: ['الأكسجين المستمر', 'جلسات البخار'], status: 'Active' }
      ]
    },
    {
      id: 'PT018', name: 'ليلى الأحمد', email: 'laila.a@email.com', age: 41, gender: 'Female', lastVisit: '2024-04-22', status: 'Stable', contact: '0567788990',
      address: 'الكويت، منطقة بيان',
      history: [
        { date: '2024-04-22', status: 'Stable', note: 'فحص ما بعد الولادة.' }
      ],
      notes: [],
      medications: [
        { id: 'm5', name: 'حديد وفيتامينات', dosage: '1 Tab', frequency: 'مرة يومياً', startDate: '2024-04-22' }
      ],
      diagnoses: [
        { id: 'd4', date: '2024-04-22', condition: 'فحص دوري بعد الولادة', doctor: 'د. منيرة الجاسم', notes: 'الحالة جيدة جداً.' }
      ],
      labResults: [
        { id: 'l3', date: '2024-04-22', testName: 'CBC Result', result: 'Normal', status: 'Normal' }
      ],
      treatmentPlans: []
    }
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
      patientId: 'PT015',
      patientName: 'أحمد محمود',
      doctor: 'Dr. Sarah Wilson',
      doctorId: 'USR001',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 30,
      type: 'Consultation',
      status: 'Waiting',
      priority: 'Medium',
      room: 'Room 101',
      notes: 'Routine checkup for blood pressure.'
    },
    {
      id: 'APP002',
      patientId: 'PT016',
      patientName: 'سارة خالد',
      doctor: 'Dr. Sarah Wilson',
      doctorId: 'USR001',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      duration: 45,
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Low',
      room: 'Room 101',
      notes: 'Should come after physical therapy.'
    },
    {
      id: 'APP003',
      patientId: 'PT017',
      patientName: 'فهد العتيبي',
      doctor: 'Dr. Sarah Wilson',
      doctorId: 'USR001',
      date: new Date().toISOString().split('T')[0],
      time: '11:00',
      duration: 30,
      type: 'Emergency',
      status: 'In-Progress',
      priority: 'Emergency',
      room: 'Room 102',
      notes: 'Acute respiratory distress.'
    }
  ];

  let invoices = [
    { id: 'INV001', patientId: 'PT015', patientName: 'أحمد محمود', amount: 450.00, discount: 50, total: 400.00, date: '2024-04-10', dueDate: '2024-04-24', status: 'Paid', items: [{ desc: 'Consultation', price: 150 }, { desc: 'Blood Test', price: 300 }] },
    { id: 'INV002', patientId: 'PT016', patientName: 'سارة خالد', amount: 1200.00, discount: 0, total: 1200.00, date: '2024-04-15', dueDate: '2024-04-29', status: 'Pending', items: [{ desc: 'Physical Therapy', price: 200 }, { desc: 'Post-Op Care', price: 1000 }] },
    { id: 'INV003', patientId: 'PT017', patientName: 'فهد العتيبي', amount: 3500.00, discount: 500, total: 3000.00, date: '2024-04-20', dueDate: '2024-05-04', status: 'Overdue', items: [{ desc: 'Emergency Admission', price: 1500 }, { desc: 'ICU Stay (1 day)', price: 2000 }] },
  ];

  let transactions = [
    { id: 'TRX001', invoiceId: 'INV001', type: 'Payment', amount: 400.00, method: 'Credit Card', date: '2024-04-11' },
  ];

  let claims = [
    { id: 'CLM001', invoiceId: 'INV002', patientName: 'سارة خالد', insuranceProvider: 'Bupa', amount: 1200.00, status: 'Processing', date: '2024-04-15' },
    { id: 'CLM002', invoiceId: 'INV001', patientName: 'أحمد محمود', insuranceProvider: 'Tawuniya', amount: 400.00, status: 'Approved', date: '2024-04-10' },
  ];

  let expenses = [
    { id: 'EXP001', category: 'Supplies', description: 'Medical Gauze and Bandages', amount: 250.00, date: '2024-04-20', status: 'Paid' },
    { id: 'EXP002', category: 'Utility', description: 'Electricity Bill - April', amount: 1500.00, date: '2024-04-25', status: 'Paid' },
    { id: 'EXP003', category: 'Maintenance', description: 'MRI Machine Service', amount: 800.00, date: '2024-04-26', status: 'Pending' },
  ];

  let users = [
    { id: 'USR001', name: 'Dr. Sarah Wilson', email: 's.wilson@hospital.com', role: 'Doctor', department: 'Cardiology', status: 'Active', permissions: ['view_patients', 'edit_records', 'prescribe_meds'] },
    { id: 'USR002', name: 'John Doe', email: 'j.doe@hospital.com', role: 'Admin', department: 'Administration', status: 'Active', permissions: ['all'] },
    { id: 'USR003', name: 'Nurse Emily Brown', email: 'e.brown@hospital.com', role: 'Nurse', department: 'Emergency', status: 'Active', permissions: ['view_patients', 'update_vitals'] },
    { id: 'USR004', name: 'James Wilson', email: 'james.w@gmail.com', role: 'Patient', department: 'Outpatient', status: 'Active', permissions: ['view_own_records'] },
  ];

  let staff = [
    { id: 'STF001', userId: 'USR001', name: 'Dr. Sarah Wilson', role: 'Doctor', specialization: 'Cardiology', joinDate: '2023-01-10', salary: 12000, status: 'Active' },
    { id: 'STF002', userId: 'USR003', name: 'Nurse Emily Brown', role: 'Nurse', specialization: 'Emergency Care', joinDate: '2023-03-15', salary: 6000, status: 'Active' },
    { id: 'STF003', userId: 'USR002', name: 'John Doe', role: 'HR Manager', specialization: 'Administration', joinDate: '2022-06-01', salary: 8000, status: 'Active' },
  ];

  let attendance = [
    { id: 'ATT001', staffId: 'STF001', date: '2024-04-28', checkIn: '08:00', checkOut: '16:00', status: 'Present' },
    { id: 'ATT002', staffId: 'STF002', date: '2024-04-28', checkIn: '07:55', checkOut: '15:45', status: 'Present' },
  ];

  let shifts = [
    { id: 'SHF001', staffId: 'STF001', day: 'Monday', startTime: '08:00', endTime: '16:00', room: 'C102' },
    { id: 'SHF002', staffId: 'STF002', day: 'Monday', startTime: '07:00', endTime: '15:00', room: 'ER-1' },
    { id: 'SHF003', staffId: 'STF001', day: 'Tuesday', startTime: '08:00', endTime: '16:00', room: 'C102' },
  ];

  let leaves = [
    { id: 'LV001', staffId: 'STF002', type: 'Annual', startDate: '2024-05-01', endDate: '2024-05-05', status: 'Approved', reason: 'Vacation' },
    { id: 'LV002', staffId: 'STF001', type: 'Sick', startDate: '2024-04-25', endDate: '2024-04-26', status: 'Completed', reason: 'Flu' },
  ];

  let medications = [
    { id: '1', name: 'أوميبرازول 20 ملغ', code: 'OMP-020', category: 'معدي ومعوي', type: 'Pill', quantity: 15, minQuantity: 20, price: 45, expiryDate: '2026-12-01', supplierId: 's1' },
    { id: '2', name: 'باراسيتامول 500 ملغ', code: 'PCM-500', category: 'مسكنات', type: 'Pill', quantity: 500, minQuantity: 100, price: 12, expiryDate: '2027-05-15', supplierId: 's2' },
    { id: '3', name: 'أموكسيسيلين 500 ملغ', code: 'AMX-500', category: 'مضاد حيوي', type: 'Pill', quantity: 24, minQuantity: 50, price: 85, expiryDate: '2026-08-20', supplierId: 's1' },
  ];

  let suppliers = [
    { id: 's1', name: 'شركة الحياة للأدوية', contactName: 'أحمد علي', phone: '+966 50 123 4567', email: 'ahmad@alhayat.com', address: 'الرياض، السعودية', category: 'أدوية' },
    { id: 's2', name: 'مؤسسة رعاية المستلزمات', contactName: 'سارة محمد', phone: '+966 50 987 6543', email: 'sara@care.com', address: 'جدة، السعودية', category: 'مستلزمات' },
  ];

  let prescriptions = [
    {
      id: 'pr1',
      patientId: 'PT015',
      doctorId: 'USR001',
      date: '2024-04-28',
      status: 'Pending',
      items: [
        { medicationId: '1', dosage: 'مرة واحدة يومياً', quantity: 1, status: 'Pending' },
        { medicationId: '2', dosage: 'عند اللزوم', quantity: 2, status: 'Pending' },
      ]
    },
    {
      id: 'pr2',
      patientId: 'PT016',
      doctorId: 'USR002',
      date: '2024-04-27',
      status: 'Completed',
      items: [
        { medicationId: '2', dosage: '3 مرات يومياً', quantity: 1, status: 'Dispensed' },
      ]
    }
  ];

  // API Routes
  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  // HR API
  app.get("/api/hr/staff", (req, res) => res.json(staff));
  app.post("/api/hr/staff", (req, res) => {
    const newStaff = { ...req.body, id: `STF${String(staff.length + 1).padStart(3, '0')}` };
    staff.push(newStaff);
    res.status(201).json(newStaff);
  });

  app.get("/api/hr/attendance", (req, res) => res.json(attendance));
  app.post("/api/hr/attendance/check-in", (req, res) => {
    const { staffId } = req.body;
    const newEntry = {
      id: `ATT${String(attendance.length + 1).padStart(3, '0')}`,
      staffId,
      date: new Date().toISOString().split('T')[0],
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: null,
      status: 'Present'
    };
    attendance.push(newEntry);
    res.status(201).json(newEntry);
  });

  app.get("/api/hr/shifts", (req, res) => res.json(shifts));
  app.get("/api/hr/leaves", (req, res) => res.json(leaves));
  app.post("/api/hr/leaves", (req, res) => {
    const newLeave = { ...req.body, id: `LV${String(leaves.length + 1).padStart(3, '0')}`, status: 'Pending' };
    leaves.push(newLeave);
    res.status(201).json(newLeave);
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
    const { amount, discount } = req.body;
    const newInvoice = {
      ...req.body,
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      total: (amount || 0) - (discount || 0),
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
        amount: invoices[index].total,
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

  app.get("/api/billing/claims", (req, res) => res.json(claims));
  app.get("/api/billing/expenses", (req, res) => res.json(expenses));
  app.post("/api/billing/expenses", (req, res) => {
    const newExpense = {
      ...req.body,
      id: `EXP${String(expenses.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0]
    };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
  });

  app.get("/api/billing/stats", (req, res) => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.total, 0);
    const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.total, 0);
    
    const monthlyRevenue = [
      { month: 'Jan', revenue: 4500 },
      { month: 'Feb', revenue: 5200 },
      { month: 'Mar', revenue: 4800 },
      { month: 'Apr', revenue: totalRevenue }
    ];

    res.json({
      totalRevenue,
      totalExpenses,
      netIncome,
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

  app.patch("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...req.body };
      res.json(appointments[index]);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  });

  app.delete("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  });

  app.post("/api/appointments", (req, res) => {
    const newAppointment = {
      ...req.body,
      id: `APP${String(appointments.length + 1).padStart(3, '0')}`,
    };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
  });

  // Inventory API
  app.get("/api/inventory/medications", (req, res) => res.json(medications));
  app.post("/api/inventory/medications", (req, res) => {
    const newMed = { ...req.body, id: String(medications.length + 1) };
    medications.push(newMed);
    res.status(201).json(newMed);
  });
  app.get("/api/inventory/suppliers", (req, res) => res.json(suppliers));

  // Pharmacy API
  app.get("/api/pharmacy/prescriptions", (req, res) => res.json(prescriptions));
  app.post("/api/pharmacy/dispense/:id", (req, res) => {
    const { id } = req.params;
    const index = prescriptions.findIndex(p => p.id === id);
    if (index !== -1) {
      prescriptions[index].status = 'Completed';
      // Basic quantity deduction logic
      prescriptions[index].items.forEach(item => {
        const medIndex = medications.findIndex(m => m.id === item.medicationId);
        if (medIndex !== -1) {
          medications[medIndex].quantity = Math.max(0, medications[medIndex].quantity - item.quantity);
        }
      });
      res.json(prescriptions[index]);
    } else {
      res.status(404).json({ error: "Prescription not found" });
    }
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
