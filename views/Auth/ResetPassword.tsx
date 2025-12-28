
import React, { useState } from 'react';
import { useApp } from '../../store';
import { ArrowLeft, KeyRound, Mail, Send, CheckCircle2 } from 'lucide-react';

const ResetPassword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { notify } = useApp();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mocking the reset email flow
    notify(`Reset instructions dispatched to ${email}`, 'success');
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-[#1e1b4b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -ml-40 -mb-40"></div>

      <div className="bg-white w-full max-w-md p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-indigo-900/10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
            <KeyRound size={32} />
          </div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 tracking-tight">Security Recovery</h1>
          <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">
            Enter your registered email to receive access restoration instructions.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} className="text-blue-600" /> Platform Email
              </label>
              <input
                type="email"
                required
                className="w-full px-6 py-4 rounded-2xl bg-[#f1f5f9] border-2 border-transparent focus:bg-white focus:border-blue-500 outline-none font-bold text-indigo-950 transition-all placeholder:text-slate-300 shadow-inner"
                placeholder="email@nexus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Send size={18} /> Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="py-8 px-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-black text-emerald-900 text-lg mb-2">Check Your Inbox</h3>
              <p className="text-emerald-700 text-xs font-bold leading-relaxed">
                We've sent a secure recovery link to <span className="underline">{email}</span>. Please check your spam folder if you don't see it.
              </p>
            </div>
            <button 
              onClick={onBack}
              className="w-full py-5 bg-indigo-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-900 transition-all active:scale-95 shadow-lg"
            >
              Return to Login
            </button>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Platform OS Security v1.4</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
