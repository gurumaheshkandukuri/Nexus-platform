
import React, { useState } from 'react';
import { useApp } from '../store';
import { Save, User as UserIcon, Shield, Lock, RefreshCw, Camera } from 'lucide-react';

const ProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser, notify } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    profilePicture: currentUser?.profilePicture || ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: formData.name,
      profilePicture: formData.profilePicture
    });
    notify("Profile updated and synced with Nexus servers.", "success");
  };

  return (
    <div className="p-10 max-w-4xl mx-auto h-full overflow-y-auto pb-40">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Identity Hub</h1>
        <p className="text-slate-400 font-bold mt-2">Manage your platform identity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Visual Identity */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center group transition-all hover:border-indigo-100">
            <div className="relative group/photo mb-8">
              <div className="w-48 h-48 rounded-[3rem] bg-indigo-50 flex items-center justify-center border-8 border-slate-50 shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={64} className="text-indigo-400" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all border-4 border-white cursor-pointer active:scale-90">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Identity Badge</p>
            <p className="text-xl font-black text-indigo-900 mt-2">{currentUser?.name}</p>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-1">Display Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-900 transition-all shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  System Email <Lock size={10} />
                </label>
                <input
                  type="email"
                  readOnly
                  className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-100 border-2 border-transparent text-slate-400 font-bold outline-none cursor-not-allowed italic"
                  value={currentUser?.email}
                />
              </div>
            </div>

            <div className="p-8 bg-indigo-50 rounded-[2.5rem] flex items-center gap-6 border border-indigo-100">
              <div className="p-4 bg-white text-indigo-600 rounded-2xl shadow-sm">
                <Shield size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Platform Clearance</p>
                <p className="text-xl font-black text-indigo-950">{currentUser?.role} Operations Authorized</p>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-indigo-600 text-white font-black rounded-3xl uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Save size={20} /> Synchronize Profile Data
            </button>
          </form>

          <div className="bg-[#1e1b4b] p-10 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
              <RefreshCw size={24} className="text-blue-400 animate-spin-slow" /> System Sync
            </h3>
            <p className="text-indigo-200/70 text-sm font-medium leading-relaxed">
              Your profile is synchronized across all Nexus campus services including Attendance, Grades, and Meet sessions. Updates are real-time.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfileView;
