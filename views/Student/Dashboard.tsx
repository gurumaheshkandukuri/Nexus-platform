
import React, { useState } from 'react';
import { useApp } from '../../store';
import GlobalSearch from '../../components/GlobalSearch';
import NotificationPanel from '../../components/NotificationPanel';
import { Bell, TrendingUp, BookOpen, Clock, ChevronRight, Zap, User as UserIcon } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { currentUser, events, notifications, setCurrentRoute, setAnnouncementTab } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read && (!n.targetRole || n.targetRole === currentUser?.role)).length;

  const subjects = [
    { name: 'DSA', progress: 85, color: '#3b82f6', bgColor: 'bg-blue-50', label: 'Advanced' },
    { name: 'Python', progress: 62, color: '#4f46e5', bgColor: 'bg-indigo-50', label: 'Intermediate' },
    { name: 'Machine Learning', progress: 40, color: '#60a5fa', bgColor: 'bg-blue-100', label: 'Beginner' },
  ];

  const handleEventClick = () => {
    setAnnouncementTab('Events');
    setCurrentRoute('Announcements');
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-full pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1e1b4b] tracking-tight">Hey!!, {currentUser?.name} 👋</h1>
          <p className="text-slate-400 font-bold mt-1 md:mt-2 text-sm md:text-base">Welcome to your academic Nexus portal.</p>
        </div>
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <GlobalSearch />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-3 md:p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 relative transition-all shadow-sm active:scale-95"
            >
              <Bell size={24} />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 border-4 border-[#f1f5f9] rounded-full text-[8px] text-white font-black flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
          <button 
            onClick={() => setCurrentRoute('Profile')} 
            className="hidden md:flex w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 shadow-xl hover:scale-105 transition-transform items-center justify-center text-indigo-400 hover:text-indigo-600"
          >
            <UserIcon size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12 relative z-10">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-indigo-950 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <TrendingUp size={20} />
                </div>
                Mastery Heatmap
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Curriculum Proficiency Tracking</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {subjects.map(s => {
              const radius = 54;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (s.progress / 100) * circumference;
              const safeId = s.name.replace(/\s+/g, '-').toLowerCase();

              return (
                <div key={s.name} className="flex flex-col items-center group">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 md:mb-8 transition-transform duration-500 group-hover:scale-105">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 160 160">
                      <defs>
                        <filter id={`glow-${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id={`grad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={s.color} />
                          <stop offset="100%" stopColor={`${s.color}cc`} />
                        </linearGradient>
                      </defs>
                      <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                      <circle cx="80" cy="80" r={radius} stroke={`url(#grad-${safeId})`} strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: `url(#glow-${safeId})`, transition: 'stroke-dashoffset 1.5s ease-out' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="flex items-baseline">
                        <span className="text-2xl md:text-3xl font-black text-indigo-950 leading-none">{s.progress}</span>
                        <span className="text-[10px] md:text-sm font-black text-slate-400 ml-0.5">%</span>
                      </div>
                      <div className={`mt-1 px-2 py-0.5 rounded-full ${s.bgColor} border border-indigo-50`}>
                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">{s.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-black text-indigo-900 group-hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      {s.name}
                      {s.progress > 80 && <Zap size={14} className="text-amber-500 fill-amber-500" />}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div className="flex gap-6 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
              </div>
            </div>
            <button onClick={() => setCurrentRoute('Classroom')} className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest flex items-center gap-2 transition-all hover:gap-3">
              Deep Analytics <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="bg-[#1e1b4b] p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"><BookOpen size={24} /></div>
              <h3 className="text-xl font-black tracking-tight">Active Bulletin</h3>
            </div>
            <div className="space-y-6">
              {events.slice(0, 3).map(e => (
                <div key={e.id} onClick={handleEventClick} className="border-l-2 border-blue-500/30 pl-4 py-1 hover:border-blue-500 transition-all cursor-pointer group/item">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{e.date}</p>
                  <p className="font-bold text-sm leading-tight group-hover/item:text-blue-300 transition-colors">{e.name}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setAnnouncementTab('Courses'); setCurrentRoute('Announcements'); }} className="mt-8 md:mt-12 w-full py-4 bg-white text-indigo-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95">
              Announcements
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {events.map(e => (
          <div key={e.id} onClick={handleEventClick} className="p-6 md:p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase">Campus Event</span>
              <Clock size={16} className="text-slate-300" />
            </div>
            <h3 className="font-black text-indigo-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{e.name}</h3>
            <p className="text-xs text-slate-400 font-bold mb-4 md:mb-6">{e.venue}</p>
            <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-50">
               <span className="text-[10px] font-black text-indigo-950 uppercase">{e.date}</span>
               <ChevronRight size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
