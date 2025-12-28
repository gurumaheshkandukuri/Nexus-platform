
import React from 'react';
import { useApp } from '../store';
import { Bell, Info, CheckCircle, AlertTriangle, Video, X, Clock, ExternalLink } from 'lucide-react';

const NotificationPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, currentUser, markNotificationsRead, notify } = useApp();

  const userNotifications = notifications.filter(n => !n.targetRole || n.targetRole === currentUser?.role);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleAction = (n: any) => {
    if (n.type === 'meeting') {
      notify("Redirecting to your scheduled session...", "info");
      window.open('https://meet.google.com/new', '_blank');
    } else if (n.type === 'success') {
      notify("Opening registration portal...", "info");
      window.open('https://www.netacad.com/', '_blank');
    } else {
      notify("Details for this notification are being loaded...", "info");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed md:absolute top-20 md:top-16 right-4 md:right-0 w-[calc(100vw-2rem)] md:w-[26rem] bg-white material-card shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[150] animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
        <div>
          <h3 className="text-lg md:text-xl font-black text-indigo-950 flex items-center gap-2">
            Alerts <span className="bg-blue-600 text-white text-[8px] md:text-[10px] px-2 py-0.5 rounded-full">{unreadCount} New</span>
          </h3>
          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">
            Campus Intelligence
          </p>
        </div>
        <div className="flex gap-2 md:gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={markNotificationsRead}
              className="text-[8px] md:text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 md:px-3 py-1 rounded-lg"
            >
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto divide-y divide-slate-50">
        {userNotifications.length > 0 ? userNotifications.map(n => (
          <div 
            key={n.id} 
            className={`p-4 md:p-6 flex gap-3 md:gap-4 hover:bg-slate-50/50 transition-all cursor-default relative group ${!n.read ? 'bg-indigo-50/30' : ''}`}
          >
            {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>}
            
            <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
              n.type === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
              n.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
              n.type === 'warning' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
              'bg-indigo-50 text-indigo-600 border border-indigo-100'
            }`}>
              {n.type === 'info' && <Info size={18} md:size={22} />}
              {n.type === 'success' && <CheckCircle size={18} md:size={22} />}
              {n.type === 'warning' && <AlertTriangle size={18} md:size={22} />}
              {n.type === 'meeting' && <Video size={18} md:size={22} />}
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-xs md:text-sm font-black text-indigo-950 leading-tight group-hover:text-blue-700 transition-colors truncate">{n.title}</h4>
                <div className="flex items-center gap-1 text-[8px] md:text-[10px] text-slate-400 font-black whitespace-nowrap ml-2">
                  <Clock size={10} /> {n.timestamp.split('T')[1]?.split('.')[0]?.slice(0,5)}
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-slate-600 font-medium leading-relaxed mb-3 line-clamp-2">{n.message}</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(n)}
                  className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-white border border-slate-200 rounded-xl text-[8px] md:text-[10px] font-black text-indigo-900 hover:bg-indigo-900 hover:text-white transition-all"
                >
                  {n.type === 'meeting' ? 'Join' : 'View'}
                  <ExternalLink size={10} />
                </button>
                {!n.read && (
                  <button className="text-[8px] md:text-[10px] font-black text-blue-600 hover:underline uppercase tracking-tighter">
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="p-12 md:p-16 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <Bell className="text-indigo-200" size={32} md:size={40} />
            </div>
            <h4 className="text-base md:text-lg font-black text-indigo-900 mb-1">Catching up...</h4>
            <p className="text-xs text-slate-400 font-medium">You're all caught up with campus alerts.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-[8px] md:text-[10px] font-black text-slate-400 hover:text-indigo-900 transition-all uppercase tracking-[0.2em] shadow-sm">
          Browse Archive
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
