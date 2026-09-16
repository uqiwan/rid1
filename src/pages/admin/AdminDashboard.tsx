import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Database, 
  FileText, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

export const AdminDashboard: React.FC = () => {
  const { categories, packages, navigate, auditLogs, fetchAuditLogs, systemStats, fetchStats, showToast } = useTuneForgeStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
    fetchStats();
  }, [fetchAuditLogs, fetchStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAuditLogs(), fetchStats()]);
    setIsRefreshing(false);
    showToast('Data audit logs & statistik diperbarui');
  };

  const handleExportJSON = () => {
    window.open('/api/packages/export/json', '_blank');
    showToast('Mengunduh backup JSON paket konten...');
  };

  const displayLogs = auditLogs;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Portal Manajemen Super Admin (Fase 3)</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Statistik &amp; Konfigurasi Sistem TuneForge
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Kelola knowledge base riset 18 kategori, prompt templates, audit logs, dan otorisasi pengguna.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor JSON</span>
          </button>
          <button
            onClick={() => navigate('/admin/knowledge-base')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Kelola Knowledge Base</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Kategori Aktif</span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">
            {systemStats?.totalCategories || categories.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">100% Grounded di Database</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Paket Konten</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">
            {systemStats?.totalPackages || packages.length}
          </p>
          <span className="text-[11px] text-slate-400">Siap diekspor &amp; dipublikasikan</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Model AI Aktif</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="font-display font-bold text-base text-slate-900 font-mono">
            {systemStats?.activeModel || 'Gemini 3.8 Flash'}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Latency ~2.8s
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Kreator Terdaftar</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">
            {systemStats?.totalUsers ?? 0}
          </p>
          <span className="text-[11px] text-slate-400">Google OAuth 1-Klik</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/admin/knowledge-base')}
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900 mb-1">
            Knowledge Base 18 Kategori
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Kelola data kategori, daftar sub-genre, dan mood yang menjadi referensi grounding AI.
          </p>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            Buka Editor <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => navigate('/admin/prompt-templates')}
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900 mb-1">
            Prompt Library &amp; Gaya
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Atur formula template untuk 4 gaya thumbnail (Cinematic, Split, Minimal, Lifestyle) dan video loop.
          </p>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            Buka Templates <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div 
          onClick={() => navigate('/admin/users')}
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900 mb-1">
            Manajemen Pengguna
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Daftar pengguna terdaftar Google OAuth, pantau kuota generate, dan tentukan hak akses admin.
          </p>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            Lihat Pengguna <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              Audit Log Aktivitas Sistem (Audit Logs Bab 10)
            </h3>
          </div>
          <span className="text-xs text-emerald-600 font-medium font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Terhubung ke Server
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {displayLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' :
                  log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                  log.action === 'DELETE' ? 'bg-rose-100 text-rose-800' :
                  log.action === 'ROLE_CHANGE' ? 'bg-blue-100 text-blue-800' :
                  log.action === 'FORGE_PACKAGE' ? 'bg-purple-100 text-purple-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {log.action}
                </span>
                <span className="font-semibold text-slate-800">{log.entity}:</span>
                <span className="text-slate-600">{log.details}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span className="font-mono">{log.adminEmail}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
