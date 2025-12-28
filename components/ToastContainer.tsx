
import React from 'react';
import { useApp } from '../store';
import { CheckCircle, Info, AlertCircle, X, Terminal } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast, currentUser } = useApp();

  // Filter toasts by targetRole if set, otherwise show to everyone
  const visibleToasts = toasts.filter(t => !t.targetRole || t.targetRole === currentUser?.role);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-4 pointer-events-none w-full max-w-md px-6">
      {visibleToasts.map(toast => (
        <div 
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-4 p-5 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-2 backdrop-blur-xl animate-in slide-in-from-top-6 fade-in duration-500 ${
            toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-100 text-emerald-900' :
            toast.type === 'error' ? 'bg-rose-50/90 border-rose-100 text-rose-900' :
            'bg-blue-50/90 border-blue-100 text-blue-900'
          }`}
        >
          <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' :
            toast.type === 'error' ? 'bg-rose-500 text-white' :
            'bg-blue-600 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle size={24} />}
            {toast.type === 'error' && <AlertCircle size={24} />}
            {toast.type === 'info' && <Terminal size={24} />}
          </div>
          
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-0.5">
              {toast.type === 'success' ? 'Nexus Success' : toast.type === 'error' ? 'Nexus Alert' : 'Nexus System'}
            </p>
            <p className="text-sm font-bold leading-tight">{toast.message}</p>
          </div>

          <button 
            onClick={() => removeToast(toast.id)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
