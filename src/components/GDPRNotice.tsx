import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export function GDPRNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('tractor_gdpr_accepted');
      if (!accepted) {
        setShow(true);
      }
    } catch (e) {
      console.error('Failed to access localStorage for GDPR notice', e);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('tractor_gdpr_accepted', 'true');
    } catch (e) {
      console.error('Failed to set localStorage for GDPR notice', e);
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-sm text-slate-300 max-w-4xl">
        <strong className="text-slate-100 uppercase tracking-wider text-[10px] block mb-1">Local Storage Consent</strong>
        We use your browser's local storage to save your equipment logs, maintenance history, and fuel data directly on this device. By continuing to use Tractor, you consent to this local data storage.
      </p>
      <Button 
        onClick={handleAccept} 
        className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto"
      >
        I Understand
      </Button>
    </div>
  );
}
