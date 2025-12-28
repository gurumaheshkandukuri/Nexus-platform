
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Plus, BarChart3, Edit3, X, MessageCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EducatorClassroom: React.FC = () => {
  const { topics, updateTopic, feedbacks, questions, notify } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState('DSA');
  const [formData, setFormData] = useState({ subject: 'DSA', topicName: '' });

  const currentFeedback = feedbacks.filter(f => f.subject === activeSubject);
  const chartData = [
    { name: 'On Track', value: currentFeedback.filter(f => f.status === 'On Track').length || 0, color: '#10b981' },
    { name: 'Need Refresh', value: currentFeedback.filter(f => f.status === 'Need a Refresh').length || 0, color: '#f59e0b' },
    { name: 'Stuck', value: currentFeedback.filter(f => f.status === 'Help! I\'m Stuck').length || 0, color: '#f43f5e' },
  ];

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateTopic({ id: Math.random().toString(), ...formData });
    notify(`Topic Dispatched: ${formData.subject} updated.`, 'success');
    setShowModal(false);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-indigo-950">Classroom Intel</h1>
          <p className="text-slate-400 font-bold mt-2">Manage curriculum and track student sentiment.</p>
        </div>
        <div className="flex gap-3">
          {['DSA', 'Python', 'Machine Learning'].map(s => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${activeSubject === s ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Edit3 size={24} /></div>
              <h2 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Active Curriculum</h2>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mb-10 group relative overflow-hidden">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selected Course</p>
              <p className="text-xl font-black text-indigo-900 mb-6">{activeSubject}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Topic</p>
              <p className="text-3xl font-black text-blue-600">
                {topics.find(t => t.subject === activeSubject)?.topicName || 'TBA'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => { setFormData({ subject: activeSubject, topicName: topics.find(t => t.subject === activeSubject)?.topicName || '' }); setShowModal(true); }}
            className="w-full py-5 bg-[#1e1b4b] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
          >
            <Plus size={20} /> Modify Subject Data
          </button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><BarChart3 size={24} /></div>
            <h2 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Feedback Breakdown</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-12">
         <h2 className="text-2xl font-black text-indigo-950 mb-8 flex items-center gap-3">
            <MessageCircle className="text-blue-600" /> Student Queries
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.filter(q => q.subject === activeSubject).map(q => (
              <div key={q.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">ANONYMOUS QUERY</span>
                  <span className="text-[10px] font-black text-slate-300">{q.timestamp}</span>
                </div>
                <p className="text-lg font-bold text-indigo-900 mb-6 group-hover:text-blue-600 transition-colors">"{q.text}"</p>
                <button 
                  onClick={() => notify("Establishing Secure Link: Opening response terminal.", "info")}
                  className="w-full py-3 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-950 hover:bg-slate-50 transition-all"
                >
                  Dispatch Reply
                </button>
              </div>
            ))}
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#1e1b4b]/60 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative animate-in zoom-in duration-300 border border-indigo-100">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-indigo-950">Update Content</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                <input readOnly value={formData.subject} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-indigo-950 border-none outline-none cursor-not-allowed" />
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic Title</label>
                <input 
                  type="text" required placeholder="e.g. Asynchronous I/O"
                  className="w-full p-5 bg-[#f1f5f9] border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none font-bold text-indigo-950 transition-all"
                  value={formData.topicName}
                  onChange={(e) => setFormData({...formData, topicName: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                Commit Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducatorClassroom;
