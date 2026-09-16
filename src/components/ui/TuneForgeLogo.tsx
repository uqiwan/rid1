import React from 'react';

interface TuneForgeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
  showSubtext?: boolean;
  subtext?: string;
  className?: string;
}

export const TuneForgeLogo: React.FC<TuneForgeLogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtext = false,
  subtext = 'by Ridwan Johari',
  className = ''
}) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6', iconSize: 24, text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', iconSize: 32, text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', iconSize: 40, text: 'text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-12 h-12', iconSize: 48, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', iconSize: 64, text: 'text-2xl', sub: 'text-sm' }
  };

  const current = sizeMap[size];

  // The distinctive TuneForge emblem: Equalizer Soundwave merged into a Radiant Golden Forge Crest
  const Emblem = (
    <div className={`relative ${current.box} flex items-center justify-center shrink-0`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="tf-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          
          <linearGradient id="tf-gold-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>

          <linearGradient id="tf-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          <linearGradient id="tf-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Squircle Badge Background */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="url(#tf-bg-grad)"
          stroke="url(#tf-border-grad)"
          strokeWidth="2.5"
        />

        {/* Forge Anvil / Equalizer Base Beam */}
        <path
          d="M 24 76 Q 50 73 76 76 Q 78 78 75 80 Q 50 82 25 80 Q 22 78 24 76 Z"
          fill="#D97706"
          opacity="0.85"
        />

        {/* Equalizer Bar 1 (Left Outer) */}
        <rect
          x="20"
          y="48"
          width="8"
          height="24"
          rx="4"
          fill="url(#tf-gold-grad)"
          opacity="0.75"
        />

        {/* Equalizer Bar 2 (Left Mid) */}
        <rect
          x="33"
          y="35"
          width="8"
          height="37"
          rx="4"
          fill="url(#tf-gold-grad)"
          opacity="0.9"
        />

        {/* Equalizer Bar 3 (Center Apex / Forge Spire) */}
        <rect
          x="46"
          y="24"
          width="8"
          height="48"
          rx="4"
          fill="url(#tf-gold-grad)"
        />

        {/* Equalizer Bar 4 (Right Mid) */}
        <rect
          x="59"
          y="35"
          width="8"
          height="37"
          rx="4"
          fill="url(#tf-gold-grad)"
          opacity="0.9"
        />

        {/* Equalizer Bar 5 (Right Outer) */}
        <rect
          x="72"
          y="48"
          width="8"
          height="24"
          rx="4"
          fill="url(#tf-gold-grad)"
          opacity="0.75"
        />

        {/* Spark of Creation / 4-Point Star at Apex */}
        <path
          d="M 50 10 Q 50 17 57 17 Q 50 17 50 24 Q 50 17 43 17 Q 50 17 50 10 Z"
          fill="url(#tf-spark-grad)"
        />
        
        {/* Ambient Glow Point */}
        <circle cx="50" cy="17" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return Emblem;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-display font-extrabold tracking-tight text-slate-900 ${current.text}`}>
            TuneForge
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
            AI Studio
          </span>
        </div>
        {showSubtext && (
          <span className={`text-slate-500 font-medium tracking-tight ${current.sub}`}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
