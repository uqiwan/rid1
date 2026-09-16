import React from 'react';
import { 
  Layers, 
  ArrowRight, 
  Copy, 
  CheckCircle2, 
  Video, 
  Youtube, 
  Sparkles, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

export const HowItWorksPage: React.FC = () => {
  const navigate = useTuneForgeStore((s) => s.navigate);

  const steps = [
    {
      step: '01',
      title: 'Pilih Kategori, Sub-Genre & Mood di TuneForge',
      desc: 'Buka generator TuneForge, pilih 1 dari 18 kategori musik instrumental (misal: "Lo-fi & Chill Beats"), pilih sub-genre spesifik ("Lo-fi Hip-Hop Study"), dan tandai 1–3 mood yang diinginkan. Anda juga bisa menambahkan kata kunci konteks opsional (contoh: "rainy night in tokyo").',
      badge: 'INPUT KREATOR'
    },
    {
      step: '02',
      title: 'Generate Paket Konten (7 Blok Terstruktur)',
      desc: 'Hanya dalam waktu kurang dari 15 detik, AI Forge Engine menyusun 7 blok output siap pakai dalam Bahasa Inggris dengan search intent audience Amerika Serikat: 3 varian judul, deskripsi YouTube SEO, teks thumbnail, intro hook, 4 gaya prompt thumbnail, 3 prompt gambar, prompt video loop, dan catatan teknis.',
      badge: 'AI FORGE ENGINE'
    },
    {
      step: '03',
      title: 'Paste Prompt Thumbnail ke Image Generator AI',
      desc: 'Salin salah satu dari 4 gaya prompt thumbnail (Cinematic, Split, Minimal, atau Lifestyle) ke generator gambar AI favorit Anda (Google Imagen, Midjourney, atau Flux). Semua prompt sudah diatur dengan rasio 16:9 dan ruang negatif (negative space) untuk menempatkan teks thumbnail.',
      badge: 'VISUAL ASSETS'
    },
    {
      step: '04',
      title: 'Paste Prompt Video ke Google Flow AI (Veo) / Video Loop',
      desc: 'Gunakan prompt video AI kami pada Google Flow AI / Veo / Runway. Prompt dirancang khusus dengan instruksi locked-off static camera dan gerakan mikro terisolasi sehingga hasil klip 10 detik dapat di-loop terus-menerus tanpa terlihat patah atau membuat penonton pusing.',
      badge: 'VIDEO PRODUCTION'
    },
    {
      step: '05',
      title: 'Render Audio Anda & Paste Metadata ke YouTube Studio',
      desc: 'Rangkai audio musik instrumental Anda dengan video loop di video editor (Premiere, CapCut, DaVinci). Salin Judul A/B/C, deskripsi terstruktur, dan daftar tag langsung ke YouTube Studio. Konten Anda siap tayang dengan target CTR di atas 20%!',
      badge: 'PUBLISH & MONETIZE'
    }
  ];

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Alur Produksi Cepat</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Panduan Dari Ide Hingga Publish di YouTube
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            TuneForge mengubah proses manual yang memakan waktu 2–4 jam menjadi alur kerja copy-paste terintegrasi dalam hitungan menit.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-slate-200 before:z-0">
          {steps.map((s, idx) => (
            <div key={idx} className="relative z-10 flex items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-amber-400 font-display font-bold text-lg sm:text-xl flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                {s.step}
              </div>

              <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {s.badge}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Langkah {idx + 1}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips Box */}
        <div className="mt-16 p-6 sm:p-8 bg-amber-50/70 rounded-2xl border border-amber-200">
          <h3 className="font-display font-bold text-base text-amber-950 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>3 Tips Maksimalkan CTR &gt; 20% &amp; Algoritma YouTube</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-amber-900">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Gunakan Teks Thumbnail 2–3 Kata:</strong> Jangan masukkan judul lengkap ke gambar. Gunakan Varian 1 (misal: "STUDY &amp; CHILL 📚") dengan font sans-serif tebal.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Kamera Statis pada Video:</strong> Jangan biarkan AI video melakukan zooming liar atau pergeseran perspektif. Penonton musik instrumental butuh ketenangan visual agar video bisa dibiarkan bermain berjam-jam.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Kepatuhan Loudness -14 LUFS:</strong> Ekspor audio dengan batas -14 LUFS agar tidak diturunkan volumenya secara otomatis oleh kompresor YouTube.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
          >
            <span>Mulai Buat Paket Konten Pertama</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
