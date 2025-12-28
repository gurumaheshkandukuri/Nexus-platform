
import React from 'react';
import Logo from './Logo';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0f172a] flex flex-col items-center justify-center z-[1000] animate-in fade-in duration-500">
      <div className="relative">
        <Logo size="xl" showText light className="animate-pulse" />
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-10 -z-10 animate-pulse"></div>
      </div>
      
      <div className="absolute bottom-16 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full animate-[loading_3s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
