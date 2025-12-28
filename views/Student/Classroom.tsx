
import React, { useState, useMemo } from 'react';
import { useApp } from '../../store';
import { StatusType } from '../../types';
import { MessageSquare, ExternalLink, Send, BookOpen, ChevronRight, X, Video, Calendar, Clock, CheckCircle } from 'lucide-react';

const StudentClassroom: React.FC = () => {
  const { currentUser, topics, submitFeedback, feedbacks, addQuestion, notify, meetings } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('DSA');
  const [anonymousMsg, setAnonymousMsg] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const currentTopic = topics.find(t => t.subject === selectedSubject)?.topicName || 'TBA';

  // Find the existing feedback status for the selected subject and student
  const currentStatus = useMemo(() => {
    return feedbacks.find(f => f.studentId === currentUser?.id && f.subject === selectedSubject)?.status;
  }, [feedbacks, selectedSubject, currentUser]);

  // Filter meetings that are student-facing
  const approvedMeetings = meetings.filter(m => m.type === 'Student');

  const handleStatusSubmit = (status: StatusType) => {
    if (!currentUser) return;
    submitFeedback({ studentId: currentUser.id, subject: selectedSubject, status });
    notify(`Review Logged: You are currently "${status}" in ${selectedSubject}.`, 'success');
  };

  const handleSendAnon = () => {
    if (!anonymousMsg.trim()) {
      notify("Please type your question first.", 'error');
      return;
    }
    addQuestion({ id: Math.random().toString(), subject: selectedSubject, text: anonymousMsg, timestamp: new Date().toLocaleString() });
    notify(`Anonymous question sent to Educator.`, 'success');
    setAnonymousMsg('');
  };

  const handleJoinSession = (link: string) => {
    notify("Establishing Secure Connection: Redirecting to Google Meet.", 'info');
    window.open(link, '_blank');
    setShowJoinModal(false);
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto pb-40">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 flex items-center gap-3">
            Virtual Classroom 
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Live</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2">Active curriculum and performance tracking.</p>
        </div>
        <button 
          onClick={() => setShowJoinModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-950 text-white font-black rounded-2xl hover:bg-indigo-900 shadow-xl shadow-indigo-900/20 active:scale-95 transition-all"
        >
          <ExternalLink size={20} />
          Join Class
        </button>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
        {['DSA', 'Python', 'Machine Learning'].map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-10 py-4 rounded-xl font-black transition-all whitespace-nowrap border-2 ${selectedSubject === sub ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen size={24} /></div>
            <h2 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Active Lesson</h2>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Selected Subject Topic</p>
          <h3 className="text-2xl font-black text-indigo-950 mb-10 leading-tight">{currentTopic}</h3>
          
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400 font-bold">How is your understanding?</p>
            {currentStatus && (
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <CheckCircle size={10} /> Currently Selected
              </span>
            )}
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => handleStatusSubmit(StatusType.ON_TRACK)} 
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all active:scale-[0.98] border-2 ${
                currentStatus === StatusType.ON_TRACK 
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                : 'bg-emerald-50 text-emerald-700 border-transparent hover:bg-emerald-100'
              } font-black`}
            >
              <span className="flex items-center gap-2">
                {currentStatus === StatusType.ON_TRACK ? '✔️' : '🟢'} On Track
              </span>
              <ChevronRight size={20} className={currentStatus === StatusType.ON_TRACK ? 'text-white' : 'text-emerald-700'} />
            </button>
            <button 
              onClick={() => handleStatusSubmit(StatusType.NEED_REFRESH)} 
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all active:scale-[0.98] border-2 ${
                currentStatus === StatusType.NEED_REFRESH 
                ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02]' 
                : 'bg-amber-50 text-amber-700 border-transparent hover:bg-amber-100'
              } font-black`}
            >
              <span className="flex items-center gap-2">
                {currentStatus === StatusType.NEED_REFRESH ? '✔️' : '🟡'} Need a Refresh
              </span>
              <ChevronRight size={20} className={currentStatus === StatusType.NEED_REFRESH ? 'text-white' : 'text-amber-700'} />
            </button>
            <button 
              onClick={() => handleStatusSubmit(StatusType.STUCK)} 
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all active:scale-[0.98] border-2 ${
                currentStatus === StatusType.STUCK 
                ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20 scale-[1.02]' 
                : 'bg-rose-50 text-rose-700 border-transparent hover:bg-rose-100'
              } font-black`}
            >
              <span className="flex items-center gap-2">
                {currentStatus === StatusType.STUCK ? '✔️' : '🔴'} Help! I'm Stuck
              </span>
              <ChevronRight size={20} className={currentStatus === StatusType.STUCK ? 'text-white' : 'text-rose-700'} />
            </button>
          </div>
        </div>

        <div className="bg-[#1e1b4b] p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20"><MessageSquare size={20} /></div>
              <h3 className="text-lg font-black tracking-tight">Direct Query</h3>
            </div>
            <p className="text-indigo-200 mb-6 font-bold text-xs leading-relaxed">Ask your educator anonymously for help.</p>
            <textarea
              className="w-full h-32 bg-indigo-900 border-none rounded-2xl p-5 text-white placeholder-indigo-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none font-bold text-sm shadow-inner"
              placeholder="Message for Teacher..."
              value={anonymousMsg}
              onChange={(e) => setAnonymousMsg(e.target.value)}
            ></textarea>
          </div>
          <button 
            onClick={handleSendAnon}
            className="mt-6 w-full py-4 bg-white text-indigo-950 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
          >
            <Send size={16} /> Dispatch Query
          </button>
        </div>
      </div>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[200] bg-indigo-950/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">Join Live Session</h2>
                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mt-1">Educator Approved Slots</p>
              </div>
              <button onClick={() => setShowJoinModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
              {approvedMeetings.length > 0 ? (
                approvedMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => handleJoinSession(meeting.link)}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 rounded-3xl transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Video size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-indigo-950 group-hover:text-blue-700 transition-colors">{meeting.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {meeting.date}</span>
                          <span className="flex items-center gap-1 text-blue-600"><Clock size={12} /> {meeting.time}</span>
                        </div>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="text-blue-600" />
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-500 font-bold">No approved sessions found.</p>
                  <p className="text-xs text-slate-400 mt-1 italic">Wait for an educator to approve your slot or conduct a session.</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowJoinModal(false)}
                className="px-8 py-4 bg-indigo-950 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClassroom;
