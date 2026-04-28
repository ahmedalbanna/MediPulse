import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Branch = {
  id: string;
  name: string;
  location: string;
};

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentBranch: Branch;
  setBranch: (branchId: string) => void;
  branches: Branch[];
  t: (key: string) => string;
}

const branches: Branch[] = [
  { id: 'BR-001', name: 'فرع الرياض الرئيسي', location: 'الرياض، السعودية' },
  { id: 'BR-002', name: 'فرع دبي الطبي', location: 'دبي، الإمارات' },
  { id: 'BR-003', name: 'فرع الكويت التخصصي', location: 'بنييد القار، الكويت' },
];

const translations = {
  ar: {
    dashboard: 'لوحة التحكم',
    patients: 'المرضى',
    appointments: 'المواعيد',
    records: 'السجلات الطبية',
    ai_diagnostics: 'التشخيص الذكي',
    billing: 'الفواتير',
    inventory: 'المخزون',
    pharmacy: 'الصيدلية',
    hr: 'الموارد البشرية',
    settings: 'الإعدادات',
    analytics: 'التحليلات',
    help: 'المساعدة',
    branch_selector: 'اختر الفرع',
    lang_selector: 'Language',
  },
  en: {
    dashboard: 'Dashboard',
    patients: 'Patients',
    appointments: 'Appointments',
    records: 'Medical Records',
    ai_diagnostics: 'AI Diagnostics',
    billing: 'Billing',
    inventory: 'Inventory',
    pharmacy: 'Pharmacy',
    hr: 'Human Resources',
    settings: 'Settings',
    analytics: 'Analytics',
    help: 'Help & Support',
    branch_selector: 'Select Branch',
    lang_selector: 'اللغة',
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentBranch, setCurrentBranch] = useState<Branch>(branches[0]);

  useEffect(() => {
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) setCurrentBranch(branch);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, currentBranch, setBranch, branches, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
