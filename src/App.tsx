import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PlaceholderPage from './pages/PlaceholderPage';
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
            <Route path="/appointments" element={<PlaceholderPage title="Appointments" />} />
            <Route path="/records" element={<PlaceholderPage title="Medical Records" />} />
            <Route path="/ai-diagnostics" element={<PlaceholderPage title="AI Diagnostics" />} />
            <Route path="/billing" element={<PlaceholderPage title="Finance & Billing" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          </Routes>
        </main>
        <AIChatbot />
      </div>
    </BrowserRouter>
  );
}
