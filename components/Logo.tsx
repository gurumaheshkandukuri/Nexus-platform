
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = false, light = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className={`${sizes[size]} relative drop-shadow-2xl`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="nGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Stylized N Shape */}
          <path 
            d="M25 80V25C25 22.2386 27.2386 20 30 20H40C41.3261 20 42.5979 20.5268 43.5355 21.4645L66.4645 44.3934C67.4021 45.3311 68 46.6029 68 47.9289V75C68 77.7614 65.7614 80 63 80H53C51.6739 80 50.4021 79.4732 49.4645 78.5355L26.5355 55.6066C25.5979 54.6689 25 53.3971 25 52.0711V80" 
            fill="url(#nGradient)"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
          <path 
            d="M75 20V75C75 77.7614 72.7614 80 70 80H75V20Z" 
            fill="url(#nGradient)" 
            fillOpacity="0.5"
          />

          {/* Line Chart Path */}
          <path 
            d="M15 45L30 45L45 35L55 55L70 42L85 42" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Nodes */}
          <circle cx="15" cy="45" r="4" fill="#10B981" /> {/* Green */}
          <circle cx="30" cy="45" r="5" fill="#F59E0B" stroke="white" strokeWidth="1" /> {/* Yellow */}
          <circle cx="45" cy="35" r="4" fill="#34D399" /> {/* Green */}
          <circle cx="55" cy="55" r="4" fill="white" /> {/* White */}
          <circle cx="70" cy="42" r="5" fill="#1E1B4B" stroke="white" strokeWidth="1" /> {/* Dark */}
          <circle cx="85" cy="42" r="4" fill="white" /> {/* White */}
        </svg>
      </div>
      
      {showText && (
        <div className="text-center">
          <h1 className={`${textSizes[size]} font-black tracking-[0.1em] ${light ? 'text-white' : 'text-[#1E1B4B] uppercase'}`}>NEXUS</h1>
          <p className="text-[0.4em] font-black uppercase tracking-[0.4em] text-indigo-400 opacity-90">Uniting Learners & Educators</p>
        </div>
      )}
    </div>
  );
};

export default Logo;
