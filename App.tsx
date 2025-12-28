import React, { useState, useEffect, useMemo } from 'react';
import { AppProvider, useApp } from './store';
import Login from './views/Auth/Login';
import Signup from './views/Auth/Signup';
import StudentDashboard from './views/Student/Dashboard';
import StudentClassroom from './views/Student/Classroom';
import StudentAnnouncements from './views/Student/Announcements';
import EducatorDashboard from './views/Educator/Dashboard';
import EducatorClassroom from './views/Educator/Classroom';
import EducatorMeetings from './views/Educator/Meetings';
import AdminDashboard from './views/Admin/Dashboard';
import ProfileView from './views/Profile';
import ToastContainer from './components/ToastContainer';
import SplashScreen from './components/SplashScreen';
import CalendarWidget from './components/CalendarWidget';
import Logo from './components/Logo';
import { UserRole } from './types';
import { LogOut, BookOpen, Bell, Video, Shield, User as UserIcon, LayoutGrid, DoorOpen, ChevronRight, Sparkles, Menu, X, Moon, Sun } from 'lucide-react';

// --- WALKING PERSON (STAYING PUT!) ---
const WalkingPerson: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`walking-person-svg ${isActive ? 'walking-active' : ''}`}>
    <circle cx="12" cy="5" r="2.5" fill="currentColor" />
    <path d="M12 7.5v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path className="arm arm-l" d="M12 9.5l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path className="arm arm-r" d="M12 9.5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path className="leg leg-l" d="M12 13.5l-3 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path className="leg leg-r" d="M12 13.5l3 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Main: React.FC = () => {
  const { currentUser, setCurrentUser, currentRoute, setCurrentRoute, courses, events, meetings } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState(localStorage.getItem('nexus-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const calendarEvents = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.STUDENT) {
      return [
        ...courses.map(c => ({ title: `Deadline: ${c.name}`, type: 'deadline' as const, date: c.deadline })),
        ...meetings.filter(m => m.type === 'Student').map(m => ({ title: m.title, type: 'meet' as const, date: m.date })),
        ...events.map(e => ({ title: e.name, type: 'event' as const, date: e.date }))
      ];
    }
    return meetings.map(m => ({ title: m.title, type: 'meet' as const, date: m.date }));
  }, [currentUser, courses, events, meetings]);

  if (showSplash) return <SplashScreen />;

  if (!currentUser) {
    return authMode === 'login' 
      ? <Login onLogin={() => {}} onSwitch={() => setAuthMode('signup')} /> 
      : <Signup onSignup={() => {}} onSwitch={() => setAuthMode('login')} />;
  }

  const handleLogout = () => {
    setIsLoggingOut(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      setCurrentUser(null);
      setAuthMode('login');
      setIsLoggingOut(false);
      setCurrentRoute('Home');
    }, 2000);
  };

  const navItems = {
    [UserRole.STUDENT]: [{ label: 'Home', icon: LayoutGrid }, { label: 'Classroom', icon: BookOpen }, { label: 'Announcements', icon: Bell }],
    [UserRole.EDUCATOR]: [{ label: 'Home', icon: LayoutGrid }, { label: 'Classroom', icon: BookOpen }, { label: 'Meetings', icon: Video }],
    [UserRole.ADMIN]: [{ label: 'Dashboard', icon: Shield }],
  };

  const renderContent = () => {
    if (currentRoute === 'Profile') return <ProfileView />;
    if (currentUser.role === UserRole.STUDENT) {
      switch (currentRoute) {
        case 'Home': return <StudentDashboard />;
        case 'Classroom': return <StudentClassroom />;
        case 'Announcements': return <StudentAnnouncements />;
        default: return <StudentDashboard />;
      }
    }
    if (currentUser.role === UserRole.EDUCATOR) {
        switch (currentRoute) {
          case 'Home': return <EducatorDashboard />;
          case 'Classroom': return <EducatorClassroom />;
          case 'Meetings': return <EducatorMeetings />;
          default: return <EducatorDashboard />;
        }
    }
    return <AdminDashboard />;
  };

  return (
    <div className="flex h-screen bg-canvas overflow-hidden flex-col md:flex-row transition-colors duration-500">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] text-white z-[60] border-b border-white/5">
        <div className="flex items-center gap-2">
          <Logo size="sm" light />
          <h1 className="text-xl font-black uppercase tracking-tight">Nexus</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 bg-white/10 rounded-xl text-yellow-400">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setCurrentRoute('Profile')} className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><UserIcon size={20} /></button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`fixed inset-0 z-[100] md:relative md:z-10 md:flex md:w-80 bg-[#0f172a] text-white p-6 md:p-8 flex-col shadow-2xl border-r border-white/5 transition-all duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto`}>
        <div className="hidden md:flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <Logo size="md" light />
            <h1 className="text-2xl font-black tracking-tight uppercase">Nexus</h1>
          </div>
          <button onClick={toggleTheme} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-indigo-400 transition-all">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
        </div>

        <nav className="space-y-2 flex-1 relative z-10">
          <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest mb-4 ml-1">Navigation</p>
          {navItems[currentUser.role].map(item => (
            <button key={item.label} onClick={() => { setCurrentRoute(item.label); setIsMobileMenuOpen(false); }} className={`w-full text-left px-5 py-4 rounded-2xl transition-all font-bold flex items-center gap-4 ${currentRoute === item.label ? 'bg-white text-[#0f172a] shadow-xl scale-[1.02]' : 'text-indigo-200/50 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20} /><span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* LOGOUT WITH FULL ANIMATION */}
        <div className="mt-auto pt-8 relative z-10 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className={`w-full py-5 rounded-2xl transition-all px-6 font-black text-xs uppercase tracking-widest flex items-center justify-between group overflow-hidden ${isLoggingOut ? 'bg-rose-600 text-white' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white'}`}
          >
            <span className={`transition-transform duration-700 ${isLoggingOut ? '-translate-x-20 opacity-0' : 'translate-x-0'}`}>Logout</span>
            <div className={`relative flex items-center justify-center w-12 h-12 ${isLoggingOut ? 'logout-stage-active' : ''}`}>
              <div className="door-container relative">
                <DoorOpen size={24} className={`door-icon transition-all duration-700 ${isLoggingOut ? 'door-opening opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all ${isLoggingOut ? 'person-exit-anim' : 'opacity-0'}`}>
                  <WalkingPerson isActive={isLoggingOut} />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative bg-main-surface w-full pb-20 md:pb-0 transition-colors duration-500">
        <div className="relative z-10 min-h-full">{renderContent()}</div>
        <ToastContainer />
        <CalendarWidget events={calendarEvents} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/5 z-[100] px-4 py-2 flex justify-around items-center transition-colors">
        {navItems[currentUser.role].map(item => (
          <button key={item.label} onClick={() => setCurrentRoute(item.label)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentRoute === item.label ? 'text-indigo-600' : 'text-slate-400'}`}>
            <item.icon size={20} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        :root { --canvas: #f1f5f9; --main-surface: #f8fafc; }
        [data-theme='dark'] { --canvas: #020617; --main-surface: #0f172a; }
        .bg-canvas { background-color: var(--canvas); }
        .bg-main-surface { background-color: var(--main-surface); }

        .door-container { perspective: 1000px; }
        .door-icon { transform-origin: left center; }
        @keyframes door-swing { 
            0% { transform: rotateY(0deg); opacity: 0.8; } 
            30% { transform: rotateY(-85deg); opacity: 1; } 
            100% { transform: rotateY(-85deg); opacity: 1; } 
        }
        .logout-stage-active .door-opening { animation: door-swing 2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        
        @keyframes person-exit-path { 
            0% { transform: translateX(-20px) scale(0.6); opacity: 0; } 
            20% { transform: translateX(-10px) scale(1); opacity: 1; } 
            80% { transform: translateX(35px) scale(1); opacity: 1; } 
            100% { transform: translateX(60px) scale(0.4); opacity: 0; } 
        }
        .logout-stage-active .person-exit-anim { animation: person-exit-path 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.2s forwards; }

        .walking-person-svg .leg, .walking-person-svg .arm { transform-origin: 12px 13.5px; }
        .walking-person-svg .arm { transform-origin: 12px 9.5px; }

        @keyframes leg-left-walk { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
        @keyframes leg-right-walk { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(-20deg); } }
        @keyframes arm-left-walk { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(-20deg); } }
        @keyframes arm-right-walk { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
        @keyframes body-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }

        .walking-active .leg-l { animation: leg-left-walk 0.5s ease-in-out infinite; }
        .walking-active .leg-r { animation: leg-right-walk 0.5s ease-in-out infinite; }
        .walking-active .arm-l { animation: arm-left-walk 0.5s ease-in-out infinite; }
        .walking-active .arm-r { animation: arm-right-walk 0.5s ease-in-out infinite; }
        .walking-active { animation: body-bob 0.25s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (<AppProvider><Main /></AppProvider>);
export default App;