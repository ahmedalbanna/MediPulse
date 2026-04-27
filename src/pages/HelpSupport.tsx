import React, { useState } from 'react';
import { HelpCircle, LifeBuoy, PhoneCall, Mail, MessageSquare, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    question: "How do I add a new patient to the system?",
    answer: "To add a new patient, navigate to the 'Patient Records' module using the sidebar or search menu. Click on the 'New Patient' button in the top right corner. Fill out the required demographic and medical history information in the modal that appears, and click 'Save Patient'."
  },
  {
    question: "How does the AI Diagnostic Engine work?",
    answer: "The AI Diagnostic Engine analyzes patient symptoms, vitals, and historical medical records to suggest potential diagnoses and treatment plans. It is designed to assist clinical workflows, but it should not override professional medical judgment. You can access it via the 'AI Diagnostics' section."
  },
  {
    question: "Can I export medical records or billing invoices?",
    answer: "Yes, you can export data from both the Medical Records and Finance & Billing modules. Look for the 'Export' or 'Download' button in the respective header sections. Currently, we support PDF and CSV formats."
  },
  {
    question: "How do I reset my password?",
    answer: "If you are logged into the system, navigate to your Profile Dropdown (top right corner) -> Account Settings -> Security, and follow the instructions to change your password. If you are locked out, contact your System Administrator."
  },
  {
    question: "How is patient data secured?",
    answer: "MediFlow Pro uses end-to-end encryption for all patient records. We comply with HIPAA and GDPR regulations. Access to sensitive data is restricted by Role-Based Access Control (RBAC), managed by Chief Administrators."
  }
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="p-8 pt-24 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <LifeBuoy className="w-8 h-8 text-blue-500" />
            Help & Support
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Find answers, get guidance, or contact our dedicated support team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content - FAQs */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors duration-200">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-colors duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 bg-white dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          
          {/* Documentation Links */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors duration-200">
             <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              System Documentation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="#" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 transition-all group">
                <span className="text-sm font-bold">Quick Start Guide</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 transition-all group">
                <span className="text-sm font-bold">API Reference</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 transition-all group">
                <span className="text-sm font-bold">Security & Compliance</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 transition-all group">
                <span className="text-sm font-bold">Release Notes</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar - Contact */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-bold mb-2 relative z-10">Need Immediate Help?</h3>
            <p className="text-blue-100 text-sm mb-8 relative z-10">Our clinical support team is available 24/7 for urgent technical issues.</p>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl">
                <PhoneCall className="w-5 h-5 text-blue-200" />
                <div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Emergency Hotline</div>
                  <div className="text-sm font-black text-white">+1 (800) MEDI-911</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl">
                <Mail className="w-5 h-5 text-blue-200" />
                <div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">General Support</div>
                  <div className="text-sm font-black text-white">support@mediflow.pro</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center transition-colors duration-200">
            <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">Have a feature request?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">We are constantly improving MediFlow based on clinician feedback.</p>
            {/* The feedback button in header handles this, but we can instruct them */}
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Use the feedback button in the top menu
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
