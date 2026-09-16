import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Apple, 
  Check, 
  X, 
  Sparkles,
  Share,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean; fullWidth?: boolean }> = ({ compact = false, fullWidth = false }) => {
  const { isInstallable, isInstalled, isIOS, platformName, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'mac' | 'windows' | 'android' | 'ios'>(
    platformName === 'mac' ? 'mac' : platformName === 'windows' ? 'windows' : platformName === 'android' ? 'android' : platformName === 'ios' ? 'ios' : 'android'
  );

  // If already installed and running standalone, show subtle verified pill or hide
  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 ${fullWidth ? 'w-full justify-center' : 'hidden sm:inline-flex'}`}>
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span>TuneForge App Terinstal</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-xl font-semibold transition-all cursor-pointer shadow-2xs border ${
          fullWidth ? 'w-full justify-center py-2' : ''
        } ${
          compact
            ? 'px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-600/30'
            : 'px-3.5 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm'
        }`}
        title="Install TuneForge di macOS, Windows, atau Android"
      >
        <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate">Install App</span>
      </button>

      {/* MODAL PANDUAN INSTALASI PWA LINTAS PLATFORM */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-md">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Install TuneForge App
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gunakan TuneForge seperti aplikasi bawaan di laptop & smartphone Anda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Trigger If Ready */}
            {isInstallable && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                <div className="text-xs text-amber-900 font-medium">
                  Browser Anda siap untuk langsung menginstal!
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Install Sekarang
                </button>
              </div>
            )}

            {/* Tab Platform Picker */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('mac')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'mac'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>macOS</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('windows')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'windows'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Windows</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                <span>iOS / iPad</span>
              </button>
            </div>

            {/* Petunjuk Spesifik Platform */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 min-h-[140px]">
              {activeTab === 'mac' && (
                <div className="space-y-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Apple className="w-4 h-4 text-slate-700" />
                    <span>Cara Install di macOS (Chrome / Edge / Safari):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                    <li>Buka aplikasi TuneForge di <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, atau <strong>Safari</strong> di Mac Anda.</li>
                    <li>
                      <strong>Chrome / Edge:</strong> Klik ikon <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">Install / Unduh [⬇️]</span> di ujung kanan bilah alamat (URL bar).
                    </li>
                    <li>
                      <strong>Safari (macOS Sonoma+):</strong> Klik menu <span className="font-semibold text-slate-800">File &gt; Add to Dock (Tambahkan ke Dock)</span>.
                    </li>
                    <li>Aplikasi TuneForge akan muncul di <strong>Launchpad / Dock</strong> dan berjalan di jendela mandiri tanpa address bar browser.</li>
                  </ol>
                </div>
              )}

              {activeTab === 'windows' && (
                <div className="space-y-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-blue-600" />
                    <span>Cara Install di Windows 10 / 11:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                    <li>Buka link aplikasi di <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong>.</li>
                    <li>Klik ikon <strong>"App available. Install TuneForge"</strong> di ujung kanan URL bar (atau menu titik tiga <span className="font-semibold text-slate-800">&gt; Simpan dan bagikan &gt; Install TuneForge</span>).</li>
                    <li>TuneForge akan terpasang di <strong>Start Menu</strong> dan <strong>Taskbar Windows</strong> dengan performa cepat.</li>
                  </ol>
                </div>
              )}

              {activeTab === 'android' && (
                <div className="space-y-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Cara Install di HP Android (Chrome / Samsung Internet):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                    <li>Buka halaman TuneForge di browser <strong>Chrome Android</strong>.</li>
                    <li>Ketuk menu titik tiga (<strong>⋮</strong>) di sudut kanan atas browser.</li>
                    <li>Pilih menu <strong>"Install aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama" (Add to Home screen)</strong>.</li>
                    <li>Ikon TuneForge otomatis tersimpan di daftar aplikasi HP Android Anda sebagai aplikasi mandiri (WebAPK).</li>
                  </ol>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Share className="w-4 h-4 text-blue-500" />
                    <span>Cara Install di iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                    <li>Buka halaman TuneForge menggunakan browser bawaan <strong>Safari</strong>.</li>
                    <li>Ketuk tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah ke atas di bilah bawah).</li>
                    <li>Gulir ke bawah dan ketuk opsi <strong>"Add to Home Screen" (Tambahkan ke Layar Utama)</strong>.</li>
                    <li>Ketuk <strong>Add (Tambah)</strong> di sudut kanan atas. TuneForge kini siap dibuka langsung dari Home Screen.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-1">
              <a
                href={window.location.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Buka di Tab Baru untuk Menginstal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
