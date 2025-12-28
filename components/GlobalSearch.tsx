
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, GraduationCap, Calendar, Home, BookOpen, ChevronRight } from 'lucide-react';
import { useApp } from '../store';

const GlobalSearch: React.FC = () => {
  const { courses, events, hostelAnnouncements, topics } = useApp();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedCourses = courses.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .map(c => ({ ...c, type: 'Course', icon: GraduationCap }));

    const matchedEvents = events.filter(e => e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q))
      .map(e => ({ ...e, type: 'Event', icon: Calendar }));

    const matchedAnnouncements = hostelAnnouncements.filter(a => a.content.toLowerCase().includes(q))
      .map(a => ({ ...a, name: a.content, type: 'Announcement', icon: Home }));

    const matchedTopics = topics.filter(t => t.topicName.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
      .map(t => ({ ...t, name: `${t.subject}: ${t.topicName}`, type: 'Classroom', icon: BookOpen }));

    return [...matchedCourses, ...matchedEvents, ...matchedAnnouncements, ...matchedTopics].slice(0, 10);
  }, [query, courses, events, hostelAnnouncements, topics]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <div className="relative group w-full">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 md:gap-3 pl-4 pr-4 md:pr-10 py-2 md:py-2.5 bg-indigo-50/50 border-2 border-transparent hover:border-indigo-200 rounded-2xl text-slate-400 font-medium transition-all w-full md:w-64 text-left group-hover:bg-indigo-50"
        >
          <Search size={18} className="group-hover:text-blue-600 transition-colors flex-shrink-0" />
          <span className="truncate text-sm">Search Nexus...</span>
          <span className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase pointer-events-none">⌘K</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-indigo-950/40 backdrop-blur-md flex items-start justify-center pt-10 md:pt-20 p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl material-card shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
              <Search className="text-blue-600 flex-shrink-0" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search Nexus..."
                className="flex-1 bg-transparent border-none text-lg md:text-xl font-bold text-indigo-950 placeholder-slate-400 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto p-4 space-y-2">
              {results.length > 0 ? (
                results.map((res: any, idx) => (
                  <div key={idx} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-indigo-50 rounded-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-blue-100">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                      <res.icon size={20} md:size={24} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] md:text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">{res.type}</span>
                        <h4 className="font-bold text-indigo-950 text-sm md:text-base truncate">{res.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{res.description || res.venue || 'Platform update'}</p>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0" size={18} />
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p className="text-slate-400 font-medium text-sm">
                    {query ? `No results found for "${query}"` : 'Start typing to search Nexus...'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Search Control</span>
              <div className="hidden md:flex gap-4 text-xs font-bold text-slate-500">
                <span><kbd className="bg-white border border-slate-200 px-1 rounded">↵</kbd> Select</span>
                <span><kbd className="bg-white border border-slate-200 px-1 rounded">↑↓</kbd> Navigate</span>
                <span><kbd className="bg-white border border-slate-200 px-1 rounded">esc</kbd> Close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
