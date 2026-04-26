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

  // API Routes
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
