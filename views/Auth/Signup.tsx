import React, { useState, useMemo } from 'react';
import { useApp } from '../../store';
import { UserRole } from '../../types';
import Logo from '../../components/Logo';
import { ShieldCheck, Shield, User, Mail, Lock, UserPlus, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
// IMPORT the Firebase functions
import { signupEmail, loginWithGoogle } from '../../firebase'; 

const Signup: React.FC<{ onSignup: () => void; onSwitch: () => void }> = ({ onSignup, onSwitch }) => {
  const { setCurrentUser, notify } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const passwordMetrics = useMemo(() => {
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLen = password.length >= 6;
    
    let score = 0;
    if (hasMinLen) score += 1;
    if (hasUpper) score += 1;
    if (hasSpecial) score += 1;

    return {
      hasUpper,
      hasSpecial,
      hasMinLen,
      score,
      label: score === 3 ? 'Strong' : score === 2 ? 'Medium' : score === 1 ? 'Weak' : 'Insufficient',
      color: score === 3 ? 'bg-emerald-500' : score === 2 ? 'bg-amber-500' : 'bg-rose-500',
      textColor: score === 3 ? 'text-emerald-600' : score === 2 ? 'text-amber-600' : 'text-rose-600'
    };
  }, [password]);

  const isFormValid = useMemo(() => {
    return name.trim().length > 0 && 
           email.includes('@') && 
           passwordMetrics.score === 3 && 
           role !== null;
  }, [name, email, passwordMetrics.score, role]);

  // UPDATED: Now actually creates a Firebase User
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        if (!role) notify("Please select an operational role.", "error");
        else if (passwordMetrics.score < 3) notify("Password security criteria not met.", "error");
        return;
    }

    setLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await signupEmail(email, password);
      const firebaseUser = userCredential.user;

      // 2. Set user in your local App Store
      setCurrentUser({
        id: firebaseUser.uid,
        name,
        email,
        role: role!,
        profilePicture: ''
      });
      
      notify("Enrollment Successful!", "success");
      onSignup();
    } catch (error: any) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Real Google Signup
  const handleGoogleSignup = async () => {
    try {
      const result = await loginWithGoogle();
      setCurrentUser({
        id: result.user.uid,
        name: result.user.displayName || 'Nexus User',
        email: result.user.email || '',
        role: UserRole.STUDENT, // Default role for Google signups
        profilePicture: result.user.photoURL || ''
      });
      onSignup();
    } catch (error: any) {
      notify(error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-0 md:p-6 lg:p-12 relative overflow-hidden scrollbar-hide">
      {/* Background Gradients */}
      <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[140px]"></div>

      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-6xl md:min-h-[800px] flex flex-col md:flex-row-reverse rounded-none md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-none md:border border-white/20 relative z-10 overflow-hidden scrollbar-hide">
        
        {/* Decorative Pane - Desktop Only */}
        <div className="hidden md:flex flex-1 bg-gradient-to-tr from-[#1e1b4b] to-[#4338ca] p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Logo size="lg" light className="mb-10" />
            <h2 className="text-5xl font-black text-white leading-tight mb-8">
              Join the <br />
              Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Ecosystem</span>
            </h2>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0"><CheckCircle2 className="text-emerald-400" /></div>
                  <p className="text-indigo-100 font-bold">Secure multi-role environment optimized for modern education.</p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0"><CheckCircle2 className="text-emerald-400" /></div>
                  <p className="text-indigo-100 font-bold">Integrated AI tools and real-time collaborative features.</p>
               </div>
            </div>
          </div>

          <div className="relative z-10 p-8 bg-black/20 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => <div key={i} className={`w-10 h-10 rounded-full bg-indigo-500 border-2 border-[#1e1b4b] flex items-center justify-center text-[10px] font-black`}>JD</div>)}
               </div>
               <p className="text-xs font-black text-white uppercase tracking-widest">+5,000 ACTIVE USERS</p>
            </div>
            <p className="text-indigo-200/50 text-[10px] font-bold">Join thousands of students and educators transforming their learning experience.</p>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 animate-float pointer-events-none">
             <Zap size={300} className="text-white" />
          </div>
        </div>

        {/* Form Pane */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white h-screen md:h-auto overflow-y-auto scrollbar-hide">
          <div className="md:hidden mb-8 text-center">
            <Logo size="md" className="mx-auto mb-4" />
          </div>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Enrollment</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure Identity Generation Protocol</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-900 transition-all shadow-inner" placeholder="Identity Name" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-1">Network Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-900 transition-all shadow-inner" placeholder="email@nexus.com" />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-1">Secure Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-900 transition-all shadow-inner" placeholder="••••••••" />
              
              {password.length > 0 && (
                <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black uppercase text-indigo-400">Security Criteria</span>
                    <span className={`text-[9px] font-black uppercase ${passwordMetrics.textColor}`}>{passwordMetrics.label}</span>
                  </div>
                  <div className="flex gap-1 h-1 mb-3">
                    <div className={`flex-1 rounded-full ${passwordMetrics.score >= 1 ? passwordMetrics.color : 'bg-slate-200'}`}></div>
                    <div className={`flex-1 rounded-full ${passwordMetrics.score >= 2 ? passwordMetrics.color : 'bg-slate-200'}`}></div>
                    <div className={`flex-1 rounded-full ${passwordMetrics.score >= 3 ? passwordMetrics.color : 'bg-slate-200'}`}></div>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    <div className={`flex items-center gap-2 text-[8px] font-black uppercase ${passwordMetrics.hasMinLen ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {passwordMetrics.hasMinLen ? <ShieldCheck size={10} /> : <Shield size={10} />} 6+ Characters
                    </div>
                    <div className={`flex items-center gap-2 text-[8px] font-black uppercase ${passwordMetrics.hasUpper ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {passwordMetrics.hasUpper ? <ShieldCheck size={10} /> : <Shield size={10} />} One Capital Letter
                    </div>
                    <div className={`flex items-center gap-2 text-[8px] font-black uppercase ${passwordMetrics.hasSpecial ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {passwordMetrics.hasSpecial ? <ShieldCheck size={10} /> : <Shield size={10} />} Special Character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest block text-center md:text-left mb-4">Operational Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[UserRole.STUDENT, UserRole.EDUCATOR, UserRole.ADMIN].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 text-[9px] font-black rounded-xl transition-all uppercase tracking-tighter border-2 ${
                      role === r 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 text-xs flex items-center justify-center gap-3 ${
                isFormValid && !loading
                ? 'bg-indigo-600 shadow-indigo-600/40 hover:bg-indigo-700 hover:-translate-y-1' 
                : 'bg-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              <UserPlus size={18} />
              {loading ? 'Processing...' : 'Commit Enrollment'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
              <span className="bg-white px-6">OAuth Secure Protocol</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleSignup}
            className="w-full py-4 border-2 border-slate-100 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-4 active:scale-95"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
            Sign up with Google
          </button>

          <p className="mt-8 text-center text-sm font-bold text-slate-400">
            Already Enrolled?{' '}
            <button onClick={onSwitch} className="text-indigo-600 font-black hover:underline underline-offset-4 decoration-2">Access Account</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;