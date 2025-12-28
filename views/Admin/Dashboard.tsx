
import React, { useState, useEffect } from 'react';
import { useApp } from '../../store';
import { AdminType, UserRole } from '../../types';
import { Shield, BookOpen, Calendar, Home, Plus, Globe, X, Bell, Users, Clock, MapPin, Activity, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import GlobalSearch from '../../components/GlobalSearch';
import NotificationPanel from '../../components/NotificationPanel';

const AdminDashboard: React.FC = () => {
  const { currentUser, addCourse, addEvent, addHostelAnnouncement, events, courses, hostelAnnouncements, notifications, notify } = useApp();
  const [adminMode, setAdminMode] = useState<AdminType | null>(null);
  const [activeTab, setActiveTab] = useState<'Events' | 'Courses' | 'Hostels' | 'Activity'>('Events');
  const [hostelSubTab, setHostelSubTab] = useState<'Girls' | 'Boys'>('Girls');
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Filter relevant notifications for the Admin feed
  const adminNotifications = notifications.filter(n => n.targetRole === UserRole.ADMIN);
  const unreadCount = adminNotifications.filter(n => !n.read).length;

  // Form states
  const [eventForm, setEventForm] = useState({ name: '', venue: '', time: '', date: '', capacity: 100 });
  const [courseForm, setCourseForm] = useState({ name: '', cost: '', deadline: '', description: '', website: '' });
  const [hostelForm, setHostelForm] = useState({ type: 'Girls' as 'Girls' | 'Boys', content: '' });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Pre-set hostel type when opening modal based on sub-tab
  useEffect(() => {
    if (activeTab === 'Hostels') {
      setHostelForm(prev => ({ ...prev, type: hostelSubTab }));
    }
  }, [hostelSubTab, activeTab]);

  const formatRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      
      const diff = Math.floor((currentTime.getTime() - date.getTime()) / 1000);
      
      if (diff < 60) return 'just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 84600) return `${Math.floor(diff / 3600)} hours ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return timestamp;
    }
  };

  if (!adminMode) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-[#f1f5f9]">
        <div className="text-center max-w-2xl">
          <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <Shield size={48} />
          </div>
          <h1 className="text-5xl font-black text-[#1e1b4b] mb-4 tracking-tighter">Command Center</h1>
          <p className="text-slate-400 mb-12 text-lg font-bold">Verify your administrative clearance to proceed.</p>
          <div className="grid grid-cols-2 gap-8">
            <button 
              onClick={() => { setAdminMode(AdminType.OFFICIAL); setActiveTab('Events'); }}
              className="p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-blue-500 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-black text-indigo-950">Official Admin</h3>
              <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Academics & Events</p>
            </button>
            <button 
              onClick={() => { setAdminMode(AdminType.WARDEN); setActiveTab('Hostels'); }}
              className="p-10 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-[#1e1b4b] transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#1e1b4b] group-hover:text-white transition-colors">
                <Home size={32} />
              </div>
              <h3 className="text-xl font-black text-indigo-950">Warden</h3>
              <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Residency Life</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'Events') {
      addEvent({ id: Math.random().toString(), ...eventForm });
      notify(`Broadcast Sent: ${eventForm.name} is now public.`, 'success');
    } else if (activeTab === 'Courses') {
      addCourse({ id: Math.random().toString(), ...courseForm });
      notify(`Catalog Updated: ${courseForm.name} added.`, 'success');
    } else if (activeTab === 'Hostels') {
      addHostelAnnouncement({ id: Math.random().toString(), date: new Date().toLocaleDateString(), ...hostelForm });
      notify(`Bulletin Posted: New update for ${hostelForm.type} residence.`, 'success');
    }
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-full pb-40">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-[0.2em]">{adminMode} Mode</span>
          <h1 className="text-4xl font-black text-indigo-950 mt-2 tracking-tight">Hey!!, {currentUser?.name} 👋</h1>
          <p className="text-slate-400 font-bold mt-1">Platform Management & Campus Bulletins</p>
        </div>
        <div className="flex items-center gap-6">
          <GlobalSearch />
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 relative transition-all shadow-sm active:scale-95 ${isNotifOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`}
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 border-4 border-[#f8fafc] rounded-full text-[8px] text-white font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
          <button 
            onClick={() => setAdminMode(null)} 
            className="text-xs font-black text-slate-400 hover:text-indigo-950 uppercase tracking-widest transition-colors flex items-center gap-2 group"
          >
            Switch Role <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          {activeTab !== 'Activity' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus size={20} /> {activeTab === 'Hostels' ? `Add ${hostelSubTab} Update` : `Add New ${activeTab.slice(0, -1)}`}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-4 border-b border-slate-100">
        {adminMode === AdminType.OFFICIAL ? (
          <>
            <button onClick={() => setActiveTab('Events')} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Events' ? 'bg-[#1e1b4b] text-white shadow-xl' : 'text-slate-400 hover:text-indigo-950'}`}>Campus Events</button>
            <button onClick={() => setActiveTab('Courses')} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Courses' ? 'bg-[#1e1b4b] text-white shadow-xl' : 'text-slate-400 hover:text-indigo-950'}`}>Course Catalog</button>
            <button onClick={() => setActiveTab('Activity')} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Activity' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-indigo-950'} flex items-center gap-2`}><Activity size={14} /> Activity Feed</button>
          </>
        ) : (
          <>
            <button onClick={() => setActiveTab('Hostels')} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Hostels' ? 'bg-[#1e1b4b] text-white shadow-xl' : 'text-slate-400 hover:text-indigo-950'}`}>Hostel Bulletins</button>
            <button onClick={() => setActiveTab('Activity')} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Activity' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-indigo-950'} flex items-center gap-2`}><Activity size={14} /> Alerts</button>
          </>
        )}
      </div>

      {activeTab === 'Hostels' && (
        <div className="flex gap-4 mb-10 p-2 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => setHostelSubTab('Girls')}
            className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${hostelSubTab === 'Girls' ? 'bg-white text-indigo-950 shadow-md' : 'text-slate-400 hover:text-indigo-950'}`}
          >
            Girls Residence
          </button>
          <button 
            onClick={() => setHostelSubTab('Boys')}
            className={`px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${hostelSubTab === 'Boys' ? 'bg-white text-indigo-950 shadow-md' : 'text-slate-400 hover:text-indigo-950'}`}
          >
            Boys Residence
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div> Feed Overview
        </h2>
        
        {activeTab === 'Events' && events.map(ev => (
          <div key={ev.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-900 rounded-2xl flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <div>
                <p className="font-black text-indigo-950 text-lg leading-tight mb-1">{ev.name}</p>
                <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {ev.venue}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {ev.time}</span>
                  <span className="text-blue-600 font-black">{ev.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
              <button className="p-2 text-slate-300 hover:text-indigo-950 transition-colors"><X size={18} /></button>
            </div>
          </div>
        ))}

        {activeTab === 'Courses' && courses.map(c => (
          <div key={c.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="font-black text-indigo-950 text-lg leading-tight mb-1">{c.name}</p>
                <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <span>Fee: <span className="text-indigo-950 font-black">{c.cost}</span></span>
                  <span>Deadline: <span className="text-rose-500 font-black">{c.deadline}</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Cataloged</span>
              <button className="p-2 text-slate-300 hover:text-indigo-950 transition-colors"><X size={18} /></button>
            </div>
          </div>
        ))}

        {activeTab === 'Hostels' && hostelAnnouncements.filter(h => h.type === hostelSubTab).map(h => (
          <div key={h.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-slate-50 text-indigo-950 rounded-2xl flex items-center justify-center">
                <Home size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-indigo-950 text-base leading-snug line-clamp-1 mb-1">{h.content}</p>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> {h.type} Residence Update</span>
                  <span>{h.date}</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-slate-300 hover:text-indigo-950 transition-colors"><X size={18} /></button>
          </div>
        ))}

        {activeTab === 'Activity' && (
          <div className="space-y-4">
            {adminNotifications.length > 0 ? adminNotifications.map(n => (
              <div key={n.id} className={`p-6 rounded-[2rem] border-2 flex items-start gap-5 hover:scale-[1.01] transition-all group animate-in slide-in-from-right-4 duration-300 ${n.type === 'success' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className={`p-4 rounded-2xl flex-shrink-0 shadow-sm ${n.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  {n.type === 'success' ? <UserPlus size={22} /> : <Bell size={22} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-indigo-950 text-base">{n.title}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} /> {formatRelativeTime(n.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-3">{n.message}</p>
                  {n.type === 'success' && (
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-lg uppercase tracking-widest">Student Enrollment</span>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <Activity size={32} className="text-slate-200 mx-auto mb-6" />
                <p className="text-slate-400 font-bold">No recent alerts or activity.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-indigo-950">
                   {activeTab === 'Hostels' ? `Add ${hostelSubTab} Update` : `Add New ${activeTab.slice(0, -1)}`}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Update</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handlePost} className="p-8 space-y-6 overflow-y-auto">
              {activeTab === 'Events' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Event Name</label>
                    <input type="text" required placeholder="e.g. Google Developer Group" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setEventForm({...eventForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Venue</label>
                    <input type="text" required placeholder="Seminar Hall" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setEventForm({...eventForm, venue: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Date</label>
                      <input type="date" required className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Time</label>
                      <input type="text" required placeholder="4:00 PM" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setEventForm({...eventForm, time: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Courses' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Course Title</label>
                    <input type="text" required placeholder="e.g. Full Stack Mastery" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setCourseForm({...courseForm, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Fee</label>
                      <input type="text" required placeholder="₹ 2499" className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setCourseForm({...courseForm, cost: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Deadline</label>
                      <input type="date" required className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setCourseForm({...courseForm, deadline: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Website Link</label>
                    <input type="url" required placeholder="https://..." className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all" onChange={e => setCourseForm({...courseForm, website: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Description</label>
                    <textarea required placeholder="Short description..." className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 h-24 resize-none" onChange={e => setCourseForm({...courseForm, description: e.target.value})}></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'Hostels' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Assigned Hostel</label>
                    <input readOnly value={`${hostelForm.type} Residence`} className="w-full p-4 bg-slate-100 border-none rounded-2xl font-bold text-indigo-950 outline-none cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest ml-1">Update Message</label>
                    <textarea required placeholder={`Enter bulletin for ${hostelForm.type} residents...`} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 h-40 resize-none" onChange={e => setHostelForm({...hostelForm, content: e.target.value})}></textarea>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-slate-50">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-indigo-950 transition-colors">Cancel</button>
                <button type="submit" className="flex-2 py-4 px-10 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Publish Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
