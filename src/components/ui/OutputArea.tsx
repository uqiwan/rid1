import React from 'react';
import { CopyButton } from './CopyButton';

interface OutputAreaProps {
  label: string;
  content?: string | null;
  copyLabel?: string;
  badge?: string;
  maxHeight?: string;
  className?: string;
}

/**
 * Komponen Area Output (Teks Siap Copy)
 * Mengikuti spesifikasi macOS Design System Bagian 3D:
 * ┌─────────────────────────────────────────────────────┐
 * │  Label output                      [Salin]          │
 * ├─────────────────────────────────────────────────────┤
 * │  [teks output — font mono, leading loose,           │
 * │   selectable teks, max-height dengan scroll]        │
 * └─────────────────────────────────────────────────────┘
 * - Background: var(--bg-inset) (#F2F2F7)
 * - Border: 1px solid var(--border-subtle) (#E5E5EA)
 * - Radius: var(--radius-md) (10px)
 * - Max-height: 280px dengan overflow-y: auto
 * - Scroll hanya di dalam area output
 * - Tombol [Salin] di pojok kanan atas (Varian 3)
 * - Hanya tampil saat ada konten (active-only)
 */
export const OutputArea: React.FC<OutputAreaProps> = ({
  label,
  content,
  copyLabel = 'Salin',
  badge,
  maxHeight,
  className = ''
}) => {
  // 2D: Empty state satu baris jika output kosong
  if (!content || !content.trim()) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-inset)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
        }}
        className={`flex items-center justify-between text-xs ${className}`}
      >
        <span style={{ fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
          Belum ada output yang di-generate
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-inset)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
      }}
      className={`overflow-hidden flex flex-col ${className}`}
    >
      {/* Header Area Output */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '8px 14px',
        }}
        className="flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-primary)',
            }}
            className="truncate"
          >
            {label}
          </span>
          {badge && (
            <span className="macos-badge text-[10px] py-0 px-2">
              {badge}
            </span>
          )}
        </div>

        {/* Tombol Salin Varian 3 */}
        <CopyButton textToCopy={content} label={copyLabel} />
      </div>

      {/* Konten Area Output */}
      <div
        style={{
          maxHeight,
          padding: '12px 14px',
        }}
        className="overflow-y-auto output-textarea"
      >
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-loose)',
            color: 'var(--text-primary)',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          className="whitespace-pre-wrap break-words select-all m-0"
        >
          {content}
        </pre>
      </div>
    </div>
  );
};
