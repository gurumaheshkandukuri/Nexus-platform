
import React, { useState, useMemo } from 'react';
import { useApp } from '../../store';
import GlobalSearch from '../../components/GlobalSearch';
import NotificationPanel from '../../components/NotificationPanel';
import { Bell, Users, MessageSquare, Video, School, ShieldCheck, AlertCircle, ArrowRight, User as UserIcon } from 'lucide-react';

const EducatorDashboard: React.FC = () => {
  const { currentUser, feedbacks, questions, notifications, setCurrentRoute, meetings } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read && (!n.targetRole || n.targetRole === currentUser?.role)).length;
  
  const highPriorityQueries = useMemo(() => {
    return questions.filter(q => q.priority === 'high');
  }, [questions]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-full pb-32">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentRoute('Profile')} 
            className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 border-2 border-indigo-100 hover:border-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center text-indigo-400"
          >
            <UserIcon size={32} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-indigo-950 flex items-center gap-3">
              Welcome, Prof. {currentUser?.name}
              <ShieldCheck size={24} className="text-blue-600" />
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <School size={16} className="text-blue-600" />
              <span className="font-bold">MVGR COLLEGE OF ENGINEERING (A)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <GlobalSearch />
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:bg-indigo-50 relative transition-all shadow-sm active:scale-95 ${isNotifOpen ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-inner' : ''}`}
            >
              <Bell size={22} />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 border-2 border-white rounded-full text-[8px] text-white font-black flex items-center justify-center animate-bounce">
                  {unreadNotifs}
                </span>
              )}
            </button>
            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12">
          {highPriorityQueries.length > 0 && (
            <div className="mb-8 p-8 bg-rose-50 border-2 border-rose-100 material-card shadow-lg shadow-rose-100/50 flex items-center justify-between group animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-200 animate-pulse">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-rose-950 font-black text-xl mb-1 tracking-tight">Urgent Action Required</h3>
                  <p className="text-rose-600 font-bold text-sm">There are {highPriorityQueries.length} student queries flagged as critical in your classroom.</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-8 py-4 bg-white text-rose-600 font-black rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm group-hover:shadow-md active:scale-95">
                Dispatch Answers <ArrowRight size={20} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              { label: 'Campus Reach', val: '450+', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Student Sentiment', val: feedbacks.length.toString(), icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Scheduled Sessions', val: meetings.length.toString(), icon: Video, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 material-card border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-6px] transition-all cursor-default group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:rotate-12 shadow-sm`}>
                  <stat.icon size={32} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] relative z-10 mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black text-indigo-950 relative z-10">{stat.val}</h3>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Classroom Engagement Pulse</h2>
              <div className="flex gap-2">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">85% Positive</span>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Live Updates</span>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {feedbacks.length > 0 ? feedbacks.slice(0, 5).map((fb, i) => (
                <div key={i} className="p-10 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-8">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-xl ${
                      fb.status === 'On Track' ? 'bg-emerald-500 shadow-emerald-500/20' :
                      fb.status === 'Need a Refresh' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-rose-500 shadow-rose-500/20'
                    }`}></div>
                    <div>
                      <h4 className="font-black text-indigo-950 text-xl group-hover:text-blue-700 transition-colors tracking-tight">Learning pulse for {fb.subject}</h4>
                      <p className="text-base text-slate-500 font-medium mt-1">Status report: <span className="text-indigo-900 font-black uppercase tracking-tighter text-sm">"{fb.status}"</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Reviewing detailed analytics for ${fb.subject}...`)}
                    className="px-8 py-4 bg-indigo-950 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
                  >
                    Drill Down
                  </button>
                </div>
              )) : (
                <div className="p-24 text-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <MessageSquare size={64} className="text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-400">Quiet Campus Pulse</h3>
                  <p className="text-lg text-slate-300 font-medium max-w-sm mx-auto mt-4">Student sentiment data from your MVGR classrooms will appear here as reviews are submitted.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboard;
