
import React, { useState } from 'react';
import { useApp } from '../../store';
import { GraduationCap, Home, Calendar, ChevronRight, MapPin, Clock, Users, Link as LinkIcon, ExternalLink } from 'lucide-react';

const StudentAnnouncements: React.FC = () => {
  const { currentUser, courses, hostelAnnouncements, events, addEnrollment, notify, announcementTab, setAnnouncementTab } = useApp();
  const [hostelType, setHostelType] = useState<'Girls' | 'Boys'>('Girls');

  const handleInterested = (eventName: string) => {
    if (!currentUser) return;
    addEnrollment({ studentName: currentUser.name, studentEmail: currentUser.email, itemName: eventName, type: 'Event' });
    notify(`Interest Logged: You've been marked as attending ${eventName}.`, 'success');
  };

  const handleRegisterClick = (courseName: string, url: string) => {
    if (!currentUser) return;
    addEnrollment({ studentName: currentUser.name, studentEmail: currentUser.email, itemName: courseName, type: 'Course' });
    notify(`Establishing Portal: Redirecting to ${courseName} official site.`, 'info');
    window.open(url, '_blank');
  };

  return (
    <div className="p-10 max-w-7xl mx-auto pb-40">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-indigo-950 tracking-tight mb-4">Campus Bulletins</h1>
        <div className="flex gap-4 p-2 bg-slate-200/50 rounded-2xl w-fit">
          {['Courses', 'Hostels', 'Events'].map(t => (
            <button
              key={t}
              //@ts-ignore
              onClick={() => setAnnouncementTab(t)}
              className={`flex items-center gap-3 px-8 py-4 font-black text-sm rounded-xl transition-all ${announcementTab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-indigo-950'}`}
            >
              {t === 'Courses' && <GraduationCap size={18} />}
              {t === 'Hostels' && <Home size={18} />}
              {t === 'Events' && <Calendar size={18} />}
              {t}
            </button>
          ))}
        </div>
      </div>

      {announcementTab === 'Courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-2xl transition-all relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${course.name.includes('Cisco') ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'} transition-colors`}>
                    <GraduationCap size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ends</p>
                    <p className="text-xs font-black text-indigo-950">{course.deadline}</p>
                  </div>
                </div>
                <h3 className="text-xl font-black text-indigo-950 mb-3 leading-tight">{course.name}</h3>
                <p className="text-slate-500 font-medium mb-6 text-sm">{course.description}</p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fees</span>
                  <span className="text-sm font-black text-indigo-950">{course.cost}</span>
                </div>
              </div>
              <button 
                onClick={() => handleRegisterClick(course.name, course.website)}
                className="mt-6 flex items-center justify-center gap-2 py-4 bg-[#1e1b4b] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
              >
                Go to Portal <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {announcementTab === 'Hostels' && (
        <div className="space-y-10">
          <div className="flex gap-4 p-2 bg-slate-200/50 rounded-2xl w-fit">
            {['Girls', 'Boys'].map(t => (
              <button
                key={t}
                //@ts-ignore
                onClick={() => setHostelType(t)}
                className={`px-10 py-4 rounded-xl font-black text-sm transition-all ${hostelType === t ? 'bg-[#1e1b4b] text-white shadow-xl' : 'text-slate-500 hover:bg-white/50'}`}
              >
                {t} Residence
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hostelAnnouncements.filter(a => a.type === hostelType).map(ann => (
              <div key={ann.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-8 group hover:border-blue-200 transition-all">
                <div className="w-1.5 h-full bg-blue-600 rounded-full flex-shrink-0 self-stretch"></div>
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{ann.date}</span>
                  </div>
                  <p className="text-indigo-950 font-bold text-lg leading-relaxed">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {announcementTab === 'Events' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map(event => (
            <div key={event.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">
                <Calendar size={14} /> {event.date} • <Clock size={14} /> {event.time}
              </div>
              <h3 className="text-3xl font-black text-indigo-950 mb-6">{event.name}</h3>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-slate-500 font-bold">
                  <MapPin size={20} className="text-blue-600" /> {event.venue}
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-bold">
                  <Users size={20} className="text-blue-600" /> Capacity: {event.capacity} Students
                </div>
              </div>
              <button 
                onClick={() => handleInterested(event.name)}
                className="w-full py-5 bg-[#1e1b4b] text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 uppercase text-xs tracking-widest"
              >
                Register Interest
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncements;
