
import React, { useMemo } from 'react';
import { useApp } from '../store';
import { Calendar as CalendarIcon, ExternalLink, X, ChevronLeft, ChevronRight, Video, Bell, Bookmark } from 'lucide-react';

interface CalendarEvent {
  title: string;
  type: 'deadline' | 'meet' | 'event';
  date: string;
}

const CalendarWidget: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
  const { isCalendarOpen, setIsCalendarOpen } = useApp();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentMonth = "January 2026";

  const hasType = useMemo(() => ({
    deadline: events.some(e => e.type === 'deadline'),
    meet: events.some(e => e.type === 'meet'),
    event: events.some(e => e.type === 'event'),
  }), [events]);

  const handleJoinNext = () => {
    const nextMeet = events.find(e => e.type === 'meet');
    if (nextMeet) window.open('https://meet.google.com/new', '_blank');
  };

  if (!isCalendarOpen) {
    return (
      <button 
        onClick={() => setIsCalendarOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-indigo-950 text-blue-400 rounded-3xl shadow-[0_15px_30px_rgba(30,27,75,0.4)] flex items-center justify-center hover:scale-110 hover:bg-blue-600 hover:text-white transition-all active:scale-95 z-50 border-4 border-white group"
        title="Open Nexus Calendar"
      >
        <CalendarIcon size={24} className="md:size-[28px] group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
           <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-x-6 md:inset-x-auto bottom-24 md:bottom-8 md:right-8 md:w-[24rem] max-h-[75vh] md:max-h-[85vh] bg-white material-card shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-indigo-50 z-[110] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-indigo-950 p-5 md:p-6 text-white relative flex-shrink-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full -mr-8 -mt-8"></div>
        <div className="flex justify-between items-center relative z-10 mb-4">
          <div>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Campus Schedule</p>
            <h3 className="text-xl md:text-2xl font-black">{currentMonth}</h3>
          </div>
          <button 
            onClick={() => setIsCalendarOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <button className="p-1 hover:text-blue-400 transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex-1 h-px bg-white/10"></div>
          <button className="p-1 hover:text-blue-400 transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 overflow-y-auto bg-slate-50/30">
        <div className="bg-white p-3 md:p-4 rounded-3xl shadow-sm border border-indigo-50 mb-6">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-slate-400 py-1 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map(d => {
              const dateStr = `2026-01-${String(d).padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isDeadline = dayEvents.some(e => e.type === 'deadline');
              const isMeet = dayEvents.some(e => e.type === 'meet');
              const isEvent = dayEvents.some(e => e.type === 'event');

              return (
                <div
                  key={d}
                  className={`aspect-square flex flex-col items-center justify-center text-[10px] md:text-xs rounded-2xl transition-all cursor-pointer relative group
                    ${dayEvents.length > 0 ? 'bg-indigo-50 font-black text-indigo-900' : 'hover:bg-slate-100 text-slate-600 font-medium'}`}
                >
                  {d}
                  <div className="flex gap-0.5 mt-0.5">
                    {isDeadline && <div className="w-1 h-1 bg-rose-500 rounded-full"></div>}
                    {isMeet && <div className="w-1 h-1 bg-blue-500 rounded-full"></div>}
                    {isEvent && <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-indigo-900 text-white p-2 rounded-xl text-[8px] md:text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-90 group-hover:scale-100 shadow-xl z-20">
                      {dayEvents.map((e, i) => <div key={i} className="truncate">• {e.title}</div>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-around px-2 md:px-4 mb-6">
          {hasType.deadline && (
            <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
               <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Deadline</span>
            </div>
          )}
          {hasType.meet && (
            <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
               <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Meet</span>
            </div>
          )}
          {hasType.event && (
            <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
               <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Event</span>
            </div>
          )}
        </div>

        <div className="space-y-3 pb-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Timeline</h4>
          {events.length > 0 ? events.map((e, idx) => (
            <div key={idx} className="p-4 bg-white rounded-3xl flex items-center justify-between group hover:border-blue-200 border border-indigo-50 transition-all shadow-sm">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                  e.type === 'meet' ? 'bg-blue-50 text-blue-600' : 
                  e.type === 'deadline' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {e.type === 'meet' && <Video size={18} />}
                  {e.type === 'deadline' && <Bell size={18} />}
                  {e.type === 'event' && <Bookmark size={18} />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs md:text-sm font-black text-indigo-950 leading-tight mb-0.5 truncate">{e.title}</p>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase">{e.date}</p>
                </div>
              </div>
              {e.type === 'meet' && (
                <button 
                  onClick={() => window.open('https://meet.google.com/new', '_blank')}
                  className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg active:scale-90 flex-shrink-0"
                >
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          )) : (
            <div className="p-6 text-center text-slate-400 font-bold italic text-xs">No upcoming items.</div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-white border-t border-indigo-50 flex-shrink-0">
        <button 
          onClick={handleJoinNext}
          className="w-full py-4 bg-indigo-950 text-white rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group/btn"
        >
          <Video size={16} /> Sync Next Meet
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;
