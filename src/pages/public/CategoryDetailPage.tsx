import React from 'react';
import { ArrowLeft, Wand2, Compass, CheckCircle2, Sparkles, Copy, Layers } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';

interface CategoryDetailPageProps {
  slug: string;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({ slug }) => {
  const { categories, navigate, setSelectedCategory } = useTuneForgeStore();

  const category = categories.find((c) => c.slug === slug) || categories[0];
  const sample = category.samplePackage;

  const handleStartForge = () => {
    setSelectedCategory(category.id);
    navigate('/generate');
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/kategori')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog 18 Kategori</span>
        </button>

        {/* Hero Card for Category */}
        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{category.iconEmoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {category.name}
                </h1>
                <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {category.slug}
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-2 max-w-xl leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          <button
            onClick={handleStartForge}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-all shadow-sm shrink-0"
          >
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Forge Konten Kategori Ini</span>
          </button>
        </div>

        {/* Sub-genres & Moods Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-white rounded-xl border border-slate-200">
            <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Sub-Genre Terkurasi ({category.subGenres.length})</span>
            </h3>
            <div className="space-y-2">
              {category.subGenres.map((sg, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 flex items-center justify-between">
                  <span>{sg}</span>
                  <span className="text-[10px] text-slate-400 font-mono">High Retention</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200">
            <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Moods &amp; Emosi Penonton</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Kombinasi mood yang mengarahkan algoritma AI menyusun prompt pencahayaan, tempo, dan hook video:
            </p>
            <div className="flex flex-wrap gap-2">
              {category.moods.map((m, i) => (
                <span key={i} className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-full text-xs font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Real Sample Package Preview */}
        {sample ? (
          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-amber-400">Contoh Hasil Riset</span>
                <h2 className="font-display font-bold text-xl text-white mt-1">
                  {sample.metadata.titleA}
                </h2>
              </div>
              <CopyButton textToCopy={sample.metadata.titleA} label="Salin Judul" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-800/80 rounded-xl space-y-2">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Teks Thumbnail CTR:</span>
                <p className="text-amber-300 font-bold text-sm">{sample.thumbnailText.variant1}</p>
                <p className="text-slate-300">{sample.thumbnailText.variant2}</p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl space-y-2">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Intro Hook:</span>
                <p className="text-slate-200 italic font-sans">"{sample.introHook}"</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-2 font-mono">Prompt Thumbnail (Cinematic):</span>
              <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 leading-relaxed">
                {sample.thumbnailPrompts.cinematic}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p className="text-sm text-slate-600 mb-4">
              Paket konten untuk kategori <span className="font-semibold text-slate-900">{category.name}</span> siap digenerate dengan AI Studio Engine.
            </p>
            <button
              onClick={handleStartForge}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>Forge Kategori Ini Sekarang</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
