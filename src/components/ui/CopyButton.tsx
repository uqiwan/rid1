import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

interface CopyButtonProps {
  textToCopy?: string | null;
  label?: string;
  className?: string;
  variant?: 'default' | 'minimal';
}

/**
 * Komponen Tombol Varian 3 — Copy Button (Khusus Salin Teks)
 * Mengikuti spesifikasi macOS Design System Bagian 3A & 4A:
 * - Warna BG: var(--bg-inset) (#F2F2F7)
 * - Warna Teks: var(--text-secondary) (#6E6E73)
 * - Border: 1px solid var(--border-subtle) (#E5E5EA)
 * - Hover BG: #E9E9EE
 * - Padding: 5px 12px
 * - Font: var(--text-xs) (11px) — weight medium
 * - Radius: var(--radius-sm) (6px)
 * - Label saat diklik: "✓ Tersalin" dengan teks var(--accent-green) selama 2 detik
 * - Active-only: Otomatis tersembunyi bila textToCopy kosong/null
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Salin',
  className = '',
  variant = 'default'
}) => {
  const [copied, setCopied] = useState(false);
  const showToast = useTuneForgeStore((s) => s.showToast);

  // Bagian 4A: Sembunyikan tombol copy jika konten kosong / null
  if (!textToCopy || !textToCopy.trim()) {
    return null;
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error('Clipboard API not available');
      }
      setCopied(true);
      showToast('Tersalin ke clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback untuk browser Safari / iframe konteks terbatas
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        showToast('Tersalin ke clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        showToast('Gagal menyalin otomatis');
      }
    }
  };

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Tersalin' : 'Salin'}
        style={{
          backgroundColor: copied ? 'rgba(52, 199, 89, 0.12)' : 'var(--bg-inset)',
          borderColor: copied ? 'var(--accent-green)' : 'var(--border-subtle)',
          color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 6px',
        }}
        className={`inline-flex items-center justify-center border transition-all cursor-pointer shrink-0 hover:bg-[#E9E9EE] ${className}`}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-green)' }} />
        ) : (
          <Copy className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        backgroundColor: copied ? 'rgba(52, 199, 89, 0.10)' : 'var(--bg-inset)',
        color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
        border: `1px solid ${copied ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '5px 12px',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
      }}
      className={`inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0 hover:bg-[#E9E9EE] select-none ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-green)' }} />
          <span>✓ Tersalin</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
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
    <div
      style={{
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--text-primary)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
      }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <Check className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
      <span>{toastMessage}</span>
    </div>
  );
};

