import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import AIDiagnostics from './pages/AIDiagnostics';
import UserManagement from './pages/settings/UserManagement';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import AIChatbot from './components/chat/AIChatbot';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#F0F4F8] min-h-screen text-slate-800 font-sans">
        <Sidebar />
        <Header />
        <main className="pl-64 min-h-screen transition-all duration-300">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/records" element={<MedicalRecords />} />
            <Route path="/ai-diagnostics" element={<AIDiagnostics />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/users" element={<UserManagement />} />
            <Route path="/help" element={<HelpSupport />} />
          </Routes>
        </main>
        <AIChatbot />
      </div>
    </BrowserRouter>
  );
}
