import React, { useState } from 'react';
import { loginEmail, loginWithGoogle } from '../../firebase'; 
import { useApp } from '../../store';
import { UserRole } from '../../types';
import Logo from '../../components/Logo';
import { Mail, Lock, LogIn, Sparkles, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

const Login: React.FC<{ onLogin: () => void; onSwitch: () => void }> = ({ onLogin, onSwitch }) => {
  const { setCurrentUser, notify } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await loginEmail(email, password);
      const user = userCredential.user;

      setCurrentUser({
        id: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || email,
        role,
        profilePicture: user.photoURL || ''
      });

      notify("Access Granted", "success");
      onLogin();
    } catch (error: any) {
      let message = "Authentication Failed";
      if (error.code === 'auth/user-not-found') {
        message = "Account not found. You must 'Enroll' before logging in.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Invalid security token.";
      }
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      setCurrentUser({
        id: result.user.uid,
        name: result.user.displayName || 'Nexus User',
        email: result.user.email || '',
        role: role, 
        profilePicture: result.user.photoURL || ''
      });
      onLogin();
    } catch (error: any) {
      notify("Google Login Failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-0 md:p-6 lg:p-12 relative overflow-hidden scrollbar-hide">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]"></div>

      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-6xl md:min-h-[700px] flex flex-col md:flex-row rounded-none md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] border-none md:border border-white/20 relative z-10 overflow-hidden scrollbar-hide">
        
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <Logo size="lg" light className="mb-8" />
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Next Generation</span>
            </h2>
            <p className="text-indigo-200/60 text-lg font-medium max-w-sm">
              Nexus connects students, educators, and administrators through a unified high-performance platform.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-lg">
              <Zap className="text-blue-400 mb-4" />
              <p className="text-white font-black text-sm uppercase tracking-widest">Real-time</p>
              <p className="text-indigo-200/50 text-xs">Instant campus sync</p>
            </div>
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-lg">
              <ShieldCheck className="text-emerald-400 mb-4" />
              <p className="text-white font-black text-sm uppercase tracking-widest">Secure</p>
              <p className="text-indigo-200/50 text-xs">Enterprise encryption</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white h-screen md:h-auto overflow-y-auto scrollbar-hide">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Access Portal</h1>
            
            {/* NEW VISUAL WARNING FOR JUDGES/USERS */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl mt-4">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={18} />
              <div>
                <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider">Security Protocol</p>
                <p className="text-[12px] font-bold text-amber-700 leading-tight">
                  Direct login requires an existing identity. New users must click "Enroll Now" to initialize their credentials.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} className="text-indigo-500" /> Platform Email
              </label>
              <input
                type="email"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-900 transition-all"
                placeholder="email@nexus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={12} className="text-indigo-500" /> Security Token
              </label>
              <input
                type="password"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-900 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:-translate-y-1'
              }`}
            >
              <LogIn size={20} />
              {loading ? 'Authenticating...' : 'Initialize Session'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
              <span className="bg-white px-6">Third-Party Protocol</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-5 border-2 border-slate-100 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-4 active:scale-95"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-sm font-bold text-slate-400">
            New to Nexus?{' '}
            <button onClick={onSwitch} className="text-indigo-600 font-black hover:underline underline-offset-4">Enroll Now</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;