import React, { useState } from 'react';
import { Activity, ShieldAlert, Sparkles, Brain, FileText, ChevronRight, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import DiagnosticModal from '../components/diagnostics/DiagnosticModal';

export default function AIDiagnostics() {
  const [symptoms, setSymptoms] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setInsight('');
    
    try {
      const response = await fetch('/api/ai-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setInsight(data.insight);
    } catch (error) {
      console.error(error);
      setInsight('An error occurred while generating the diagnostic insight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pt-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-600" />
            AI Diagnostics Assistant
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Leverage advanced AI for preliminary clinical insights.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600" />
        <div className="text-sm">
          <strong>Privacy & Safety Notice:</strong> This AI tool is designed to assist medical professionals with preliminary insights. It does not provide definitive medical diagnoses or treatment plans. Do not input personally identifiable patient information (PII) such as full names or ID numbers into this prompt.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input area */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 card-shadow flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
            Clinical Findings & Symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter observed symptoms, patient complaints, vital signs, and relevant medical history... (e.g. 45yo male presenting with sudden onset shortness of breath, mild chest discomfort, and SpO2 at 92%...)"
            className="w-full flex-grow min-h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all"
          />
          <div className="mt-4 flex justify-between items-center">
            <Link to="/records" className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
              <FileText className="w-4 h-4" /> Reference Medical Records
            </Link>
            <button
              onClick={handleAnalyze}
              disabled={loading || !symptoms.trim()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Analyze Symptoms
            </button>
          </div>
        </div>

        {/* Output area */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>
          <div className="flex items-center justify-between relative z-10 mb-4">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> Diagnostic Insight
            </h2>
            {insight && (
              <button 
                onClick={() => setShowModal(true)}
                className="text-slate-400 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="View Full Report"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex-grow text-slate-300 text-sm overflow-y-auto pr-2 relative z-10 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Processing clinical data...</p>
              </div>
            ) : insight ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="markdown-body prose prose-invert prose-sm max-w-none"
              >
                <ReactMarkdown>{insight}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-8">
                <Brain className="w-16 h-16 mb-4 opacity-50" />
                <p>Awaiting symptom input.</p>
                <p className="text-xs mt-2 opacity-70">Enter clinical details to generate potential diagnoses and recommended pathways.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DiagnosticModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        insight={insight}
        symptoms={symptoms}
      />
    </div>
  );
}
