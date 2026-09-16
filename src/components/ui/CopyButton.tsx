import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'amber' | 'minimal' | 'light';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Salin',
  className = '',
  variant = 'default'
}) => {
  const [copied, setCopied] = useState(false);
  const showToast = useTuneForgeStore((s) => s.showToast);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast('Tersalin ke clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title="Salin ke clipboard"
        className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer shadow-xs shrink-0 ${
          copied
            ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
            : 'bg-slate-900 hover:bg-black text-white hover:scale-105 active:scale-95'
        } ${className}`}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
      </button>
    );
  }

  if (variant === 'light') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs border border-white/20 ${
          copied
            ? 'bg-emerald-600 text-white'
            : 'bg-white hover:bg-slate-100 text-slate-950 hover:shadow'
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-950" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'amber') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
          copied
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm hover:shadow'
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs ${
        copied
          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
          : 'bg-slate-900 hover:bg-black text-white hover:shadow-md hover:scale-[1.02] active:scale-98'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-white" />
          <span>Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-white" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export const GlobalToast: React.FC = () => {
  const toastMessage = useTuneForgeStore((s) => s.toastMessage);
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg shadow-slate-900/10 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <Check className="w-4 h-4 text-amber-400" />
      <span>{toastMessage}</span>
    </div>
  );
};
