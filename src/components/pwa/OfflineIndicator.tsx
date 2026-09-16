import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900/95 text-white border border-slate-700/80 px-3.5 py-2 text-xs font-medium shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Mode Offline — Data tersimpan lokal tetap dapat diakses.</span>
    </div>
  );
};
