
import React, { useState, useMemo } from 'react';
import { useApp } from '../../store';
import { Video, Calendar, User, Users, ChevronRight, Play, X, CheckCircle, Clock, ExternalLink, CalendarDays } from 'lucide-react';
import { UserRole } from '../../types';

const EducatorMeetings: React.FC = () => {
  const { meetings, addMeeting, officeHourSlots, approveOfficeHour, notify, addNotification, setIsCalendarOpen, currentUser } = useApp();
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const pendingRequestsCount = officeHourSlots.filter(s => s.status === 'requested').length;
  const bookedMeetings = useMemo(() => [...meetings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [meetings]);

  const handleConductMeeting = () => {
    const meetLink = 'https://meet.google.com/nexus-live-session';
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add persistent meeting to the platform
    addMeeting({
      id: Math.random().toString(36).substring(2, 9),
      title: `Instant Session: Prof. ${currentUser?.name}`,
      date: dateStr,
      time: timeStr,
      type: 'Student',
      link: meetLink
    });

    // 2. Broadcast notification to all students
    addNotification({
      title: 'Live Session Starting NOW',
      message: `Prof. ${currentUser?.name} has initiated an immediate live session. Join via the Join Class button in your classroom.`,
      type: 'meeting',
      targetRole: UserRole.STUDENT
    });

    notify("Broadcast Initialized: Push notifications dispatched and session added to student calendars.", 'success');
    
    // 3. Open the meet for the educator
    window.open(meetLink, '_blank');
  };

  const handleSessionAction = (title: string, link: string) => {
    notify(`Establishing Secure Connection to: ${title}`, 'info');
    window.open(link, '_blank');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto pb-40">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-indigo-950">Meetings Hub</h1>
          <p className="text-slate-500 font-medium">Strategic calendar management for your mentorship sessions.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowRequestsModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-white text-indigo-950 border-2 border-slate-200 font-black rounded-2xl hover:border-indigo-950 transition-all active:scale-95 shadow-sm relative"
          >
            <CalendarDays size={20} className="text-blue-600" />
            Review Requests
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-[#f1f5f9]">
                {pendingRequestsCount}
              </span>
            )}
          </button>
          <button 
            onClick={handleConductMeeting}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-950 text-white font-black rounded-2xl hover:bg-indigo-900 shadow-xl shadow-indigo-900/20 transition-all active:scale-95"
          >
            <Play fill="white" size={20} />
            Instant Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Availability Control</p>
            <h2 className="text-3xl font-black mb-4">Office Hours</h2>
            <p className="text-indigo-200/70 text-sm font-medium leading-relaxed mb-8">
              Manage your Saturday mentorship slots and faculty board sessions.
            </p>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-2xl font-black leading-none">3</p>
                <p className="text-[8px] font-black uppercase text-indigo-400 mt-1">Free Slots</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-2xl font-black leading-none">{pendingRequestsCount}</p>
                <p className="text-[8px] font-black uppercase text-indigo-400 mt-1">Requests</p>
              </div>
            </div>
          </div>
          <CalendarDays className="absolute bottom-[-40px] right-[-40px] w-64 h-64 text-white/5 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
        </div>
        
        <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-indigo-950">Upcoming Timeline</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Confirmed Engagements</p>
            </div>
            <button 
              onClick={() => setIsCalendarOpen(true)}
              className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest"
            >
              View Full Calendar
            </button>
          </div>
          
          <div className="space-y-4 relative z-10 overflow-y-auto max-h-[300px] pr-2">
            {bookedMeetings.slice(0, 5).map(m => (
              <div key={m.id} className="p-5 bg-slate-50/50 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-lg hover:translate-x-2 transition-all border border-transparent hover:border-blue-100">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.type === 'Student' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {m.type === 'Student' ? <User size={24} /> : <Users size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-indigo-950 text-sm group-hover:text-blue-700 transition-colors">{m.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {m.date}</span>
                      <span className="flex items-center gap-1 text-blue-600"><Clock size={12} /> {m.time}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleSessionAction(m.title, m.link)}
                  className="p-3 bg-white text-indigo-950 rounded-xl shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all active:scale-90"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
            {bookedMeetings.length === 0 && (
              <div className="py-12 text-center text-slate-300 font-bold italic">
                No sessions confirmed yet. Approve requests or conduct a session.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-xl font-black text-indigo-950">Schedule Master List</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit of all platform meetings</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">Live Feed</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase">Auto-Sync</span>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {bookedMeetings.length > 0 ? bookedMeetings.map(m => (
            <div key={m.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m.type === 'Student' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {m.type === 'Student' ? <User size={28} /> : <Users size={28} />}
                </div>
                <div>
                  <h4 className="font-black text-indigo-950 text-lg group-hover:text-blue-700 transition-colors">{m.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {m.date}</span>
                    <span className="flex items-center gap-1.5 text-blue-600 font-black"><Clock size={14} /> {m.time}</span>
                    <span className={`px-2 py-0.5 rounded-lg ${m.type === 'Student' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {m.type} Session
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block mr-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-600 flex items-center gap-1 justify-end"><CheckCircle size={12} /> Confirmed</p>
                </div>
                <button 
                  onClick={() => handleSessionAction(m.title, m.link)}
                  className="px-6 py-3 bg-indigo-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-indigo-900/10"
                >
                  Enter Room
                </button>
              </div>
            </div>
          )) : (
            <div className="p-24 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Calendar className="text-slate-200" size={48} />
              </div>
              <h3 className="text-xl font-black text-slate-400">Empty Calendar</h3>
              <p className="text-slate-300 font-medium max-w-sm mx-auto mt-2">Scheduled meetings and approved office hours will appear here in chronological order.</p>
            </div>
          )}
        </div>
      </div>

      {/* Saturday Slots Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 z-[200] bg-indigo-950/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-10 bg-blue-600 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight">Mentorship Requests</h2>
                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mt-1">Strategic Session Approval • Saturday Window</p>
              </div>
              <button onClick={() => setShowRequestsModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
              <div className="bg-blue-50 p-6 rounded-3xl flex items-center gap-6 border border-blue-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                   <Clock size={24} />
                </div>
                <p className="text-sm font-bold text-blue-900 leading-relaxed">
                  Approve mentorship requests to automatically schedule Google Meet sessions and update the platform calendar.
                </p>
              </div>

              <div className="space-y-4">
                {officeHourSlots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className={`p-6 rounded-[2.5rem] border-2 transition-all ${
                      slot.status === 'booked' ? 'bg-emerald-50 border-emerald-100' :
                      slot.status === 'requested' ? 'bg-white border-blue-100 shadow-xl hover:border-blue-300' : 'bg-slate-50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${
                          slot.status === 'booked' ? 'bg-emerald-500 text-white' :
                          slot.status === 'requested' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-200 text-slate-400'
                        }`}>
                          <Clock size={32} />
                        </div>
                        <div>
                          <p className="text-indigo-950 font-black text-xl leading-none">{slot.time}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{slot.day} Schedule</p>
                          {slot.studentName && (
                            <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-black text-indigo-900 flex items-center gap-2">
                                <User size={16} className="text-blue-500" /> {slot.studentName} 
                              </p>
                              <p className="text-xs text-slate-500 font-bold italic mt-1 leading-relaxed">"{slot.reason}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        {slot.status === 'requested' && (
                          <button 
                            onClick={() => {
                              approveOfficeHour(slot.id);
                              notify(`Mentorship Confirmed with ${slot.studentName}`, 'success');
                            }}
                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                          >
                            Grant Slot
                          </button>
                        )}
                        {slot.status === 'booked' && (
                          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-100 px-4 py-2 rounded-xl">
                            <CheckCircle size={16} /> Confirmed
                          </div>
                        )}
                        {slot.status === 'available' && (
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-2 border-slate-200 px-4 py-2 rounded-xl">
                            Available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowRequestsModal(false)}
                className="px-10 py-5 bg-indigo-950 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
              >
                Close Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducatorMeetings;
