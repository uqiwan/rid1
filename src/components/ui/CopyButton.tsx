import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'amber' | 'minimal' | 'light' | 'white';
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
        className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer border shrink-0 ${
          copied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200 active:scale-95'
        } ${className}`}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
      </button>
    );
  }

  if (variant === 'white') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors border shadow-2xs ${
          copied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200'
            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 active:scale-[0.98]'
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-emerald-700">Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span>{label}</span>
          </>
        )}
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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border shadow-2xs ${
        copied
          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200 shadow-xs'
          : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 border-slate-200/90 active:scale-[0.98]'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold text-emerald-700">Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-500" />
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
