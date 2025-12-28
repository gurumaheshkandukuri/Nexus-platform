
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Save, User as UserIcon, Shield, Lock } from 'lucide-react';
import { useApp } from '../store';

const ProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser, notify } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        profilePicture: currentUser.profilePicture || ''
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

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
    notify("Identity synchronized. Profile picture updated.", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-[#0f172a] text-white">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
              <UserIcon size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Profile Hub</h2>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Identity Customization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-10 space-y-10 overflow-y-auto max-h-[70vh]">
          <div className="flex flex-col items-center">
            <div className="relative group mb-8">
              <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl relative bg-indigo-50 flex items-center justify-center">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  />
                ) : (
                  <UserIcon size={64} className="text-indigo-200" />
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-4 bg-indigo-600 text-white rounded-3xl shadow-2xl hover:bg-indigo-700 transition-all border-8 border-white active:scale-90"
              >
                <Camera size={22} />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Identity Avatar</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                   Public Display Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-slate-50 focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-900 transition-all shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  System Email <Lock size={10} />
                </label>
                <input
                  type="email"
                  readOnly
                  className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-100 border-2 border-slate-100 text-slate-400 font-bold outline-none cursor-not-allowed italic"
                  value={formData.email}
                />
              </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-[2rem] flex items-center gap-5 border border-indigo-100">
              <div className="p-4 bg-white text-indigo-600 rounded-2xl shadow-sm">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Platform Clearance</p>
                <p className="text-base font-black text-indigo-950">{currentUser?.role} Mode Active</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-2 py-5 px-10 bg-indigo-600 text-white font-black rounded-[1.5rem] uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Save size={20} /> Update Portal Identity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
