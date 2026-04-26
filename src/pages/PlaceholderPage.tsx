import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-8 pt-24 min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold">{title[0]}</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          The <span className="font-semibold text-slate-700">{title}</span> module is currently being optimized for high-performance medical workflows. 
          Please check back shortly as we sync live data.
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Live Sync Enabled
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span> DB v4.2 Secure
          </div>
        </div>
      </div>
    </div>
  );
}
