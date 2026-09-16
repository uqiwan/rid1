import React, { useState, useEffect } from 'react';
import { FileText, Edit2, Save, ArrowLeft, Check, Sparkles, Video, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  formula: string;
  target: string;
}

const DEFAULT_TEMPLATES: TemplateItem[] = [
  {
    id: 'tmpl-cinematic',
    name: 'Cinematic Widescreen (16:9)',
    category: 'Thumbnail Prompt',
    formula: 'Cinematic widescreen photograph, 16:9 aspect ratio, 35mm lens f/1.8 depth of field. Scene features {KEYWORD_CONTEXT} representing {CATEGORY_NAME} with dramatic warm amber side-lighting. Ultra-detailed textures, moody atmospheric bokeh, and intentional clean negative space on the left third for high-contrast typography overlay.',
    target: 'Untuk visual atmosferik, lofi, film score, dan nocturnal study.'
  },
  {
    id: 'tmpl-split',
    name: 'Split Screen / Kolase Kontras (16:9)',
    category: 'Thumbnail Prompt',
    formula: 'Split composition 16:9 YouTube thumbnail layout. Left side: Macro close-up of musical or thematic detail representing {SUB_GENRE} with warm ambient glow. Right side: Wide angle aesthetic scene of {KEYWORD_CONTEXT} with rich color grading and high dynamic range contrast. Highly clickable, clear separation.',
    target: 'Meningkatkan rasa penasaran (curiosity gap) untuk CTR >20%.'
  },
  {
    id: 'tmpl-minimal',
    name: 'Minimal Typography Centric (16:9)',
    category: 'Thumbnail Prompt',
    formula: 'Minimalist high-contrast aesthetic graphic photograph, 16:9 ratio. Dark textured slate background, single high-key beam of golden light illuminating iconic symbolic artifact of {CATEGORY_NAME}. Expansive negative space covering 60% of canvas designed for bold title typography.',
    target: 'Sangat efektif di beranda mobile YouTube karena teks tidak tertutup.'
  },
  {
    id: 'tmpl-lifestyle',
    name: 'Emotional Lifestyle Authentic (16:9)',
    category: 'Thumbnail Prompt',
    formula: 'Authentic cozy lifestyle photography, 16:9 ratio. Relatable creator desk space or cozy living room environment themed around {KEYWORD_CONTEXT} and {MOODS}. Soft ambient lighting from desk lamp, subtle natural film grain, intimate and melancholic atmosphere.',
    target: 'Untuk konten "Study With Me", deep sleep, dan membaca buku.'
  },
  {
    id: 'tmpl-video-loop',
    name: 'AI Video Seamless Loop (Google Veo / Runway)',
    category: 'Video Prompt',
    formula: 'Image-to-video seamless loop animation. Camera is completely locked-off and static on tripod, no panning, no camera shake, no perspective shifts. Subtle isolated motion only: continuous micro-movement in atmosphere matching {KEYWORD_CONTEXT} (such as rain droplets sliding down glass or gentle steam curling). Flawless 10-second looping cycle, zero artifacting.',
    target: 'Standar video musik YouTube agar looping tidak patah dan mata tidak lelah.'
  }
];

export const AdminPromptTemplates: React.FC = () => {
  const { navigate, showToast, templates, fetchTemplates, updateTemplate } = useTuneForgeStore();
  const [items, setItems] = useState<TemplateItem[]>(DEFAULT_TEMPLATES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Sync with backend templates if available
  useEffect(() => {
    if (templates.length > 0) {
      setItems((prev) =>
        prev.map((it) => {
          const matched = templates.find((t) => t.id === it.id || t.style.toLowerCase() === it.id.replace('tmpl-', '').toLowerCase());
          if (matched) {
            return { ...it, formula: matched.promptText };
          }
          return it;
        })
      );
    }
  }, [templates]);

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id: string) => {
    setIsSaving(true);
    // Update local display immediately
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, formula: editText } : t))
    );
    // Persist to backend
    await updateTemplate(id, editText);
    setIsSaving(false);
    setEditingId(null);
    showToast('Template prompt berhasil diperbarui dan disinkronkan ke AI Engine');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Admin Dashboard</span>
          </button>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Prompt Template &amp; Style Library
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Atur struktur formula prompt yang digunakan AI Studio untuk menghasilkan 4 varian visual thumbnail dan video seamless loop.
          </p>
        </div>

        <button
          onClick={() => {
            fetchTemplates().then(() => showToast('Template disinkronkan dari database'));
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {items.map((tmpl) => {
          const isEditing = editingId === tmpl.id;
          return (
            <div key={tmpl.id} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {tmpl.category === 'Video Prompt' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                      {tmpl.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {tmpl.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={() => saveEdit(tmpl.id)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(tmpl.id, tmpl.formula)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Template</span>
                    </button>
                  )}
                  <CopyButton textToCopy={tmpl.formula} variant="minimal" />
                </div>
              </div>

              {isEditing ? (
                <textarea
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed text-slate-900 focus:ring-1 focus:ring-amber-500"
                />
              ) : (
                <p className="p-3.5 bg-slate-50 rounded-xl text-xs font-mono text-slate-800 leading-relaxed border border-slate-200/70">
                  {tmpl.formula}
                </p>
              )}

              <p className="text-[11px] text-slate-500 italic">
                *Target Penggunaan: {tmpl.target}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
