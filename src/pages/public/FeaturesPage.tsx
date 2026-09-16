import React from 'react';
import { 
  FileText, 
  Type, 
  Radio, 
  Image as ImageIcon, 
  Video, 
  Settings2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';

export const FeaturesPage: React.FC = () => {
  const navigate = useTuneForgeStore((s) => s.navigate);

  const modules = [
    {
      num: '01',
      title: 'YouTube Metadata (Judul A/B/C, Deskripsi, Tags)',
      tag: 'SEARCH INTENT AS',
      icon: FileText,
      desc: 'Menghasilkan 3 varian judul dengan formula teruji audience Amerika Serikat ("X beats to relax / study to", "[1 Hour Loop]", "No Lyrics"). Dilengkapi deskripsi terstruktur dengan timestamp dan daftar tag relevan untuk ranking pencarian YouTube.',
      highlights: [
        'Formula judul high-CTR dengan emoji terukur',
        'Deskripsi siap paste lengkap dengan timestamps & hashtag',
        'Tag khusus target audience Tier-1 US'
      ],
      sample: 'Rainy Night In Tokyo 🌧️ Lofi Hip Hop Beats [1 Hour Study & Relax Loop]'
    },
    {
      num: '02',
      title: 'Teks Thumbnail CTR >20%',
      tag: 'VISUAL HOOK',
      icon: Type,
      desc: 'Teks singkat (2–4 kata) dengan kontras tinggi yang dirancang agar tetap terbaca jelas di layar smartphone berukuran di bawah 120 piksel. Menghindari teks panjang yang terpotong durasi video di sudut kanan bawah.',
      highlights: [
        '3 varian: Fokus, Atmosfer, dan Benefit psikologis',
        'Terbaca di semua resolusi thumbnail (mobile friendly)',
        'Dirancang khusus melipatgandakan Click-Through-Rate'
      ],
      sample: 'STUDY & CHILL 📚 | DEEP FOCUS ⚡ | RAIN IN TOKYO 🌧️'
    },
    {
      num: '03',
      title: 'Intro Hook Video (0–10 Detik Pertama)',
      tag: 'RETENTION LOCK',
      icon: Radio,
      desc: 'Naskah pembuka 1–2 kalimat yang langsung mengonfirmasi ekspektasi penonton saat mengklik video. Menghindari penonton membatalkan tontonan (bounce) di detik awal, sehingga retensi rata-rata bertahan di atas 3 menit.',
      highlights: [
        'Dapat digunakan untuk teks animasi atau audio voiceover singkat',
        'Membangun janji emosional yang langsung terpenuhi',
        'Mencegah drop retensi di 30 detik pertama algoritma'
      ],
      sample: '"Rain outside, warm amber light inside — press play, let this continuous loop run, and slip into effortless deep focus for the next hour."'
    },
    {
      num: '04',
      title: 'Prompt Thumbnail 4 Varian Gaya',
      tag: 'VISUAL DIVERSITY',
      icon: ImageIcon,
      desc: 'Tidak semua channel memiliki estetika yang sama. TuneForge menyediakan 4 prompt siap render ke Midjourney/Imagen dengan gaya: Cinematic Widescreen, Split/Kolase Kontras, Minimal Typography, dan Emotional Lifestyle.',
      highlights: [
        'Spesifikasi aspect ratio 16:9 & panduan negative space untuk teks',
        'Detail pencahayaan 35mm f/1.8 dan color grading terkalibrasi',
        'Gaya teruji menarik klik di beranda YouTube'
      ],
      sample: 'Cinematic widescreen photograph, 16:9, 35mm lens f/1.8... warm amber desk lamp, negative space on left third for bold typography.'
    },
    {
      num: '05',
      title: 'Prompt Gambar AI (3 Alternatif Base Scene Mandiri)',
      tag: 'STANDALONE BASE SCENE',
      icon: Sparkles,
      desc: 'Tiga opsi prompt gambar 1 scene yang masing-masing berdiri sendiri (bukan sekuens urutan kejadian). Pilih salah satu gambar terbaik untuk di-generate, lalu gunakan gambar tersebut sebagai base image yang dianimasikan dengan prompt video di Blok 06.',
      highlights: [
        '3 alternatif pemandangan mandiri untuk fleksibilitas tema visual channel',
        'Masing-masing berdiri sendiri sebagai single scene utuh (bukan urutan scene 1 sampai 3)',
        'Dioptimalkan sebagai base image untuk Google Veo, Kling, Runway, Luma, & Haiper'
      ],
      sample: 'Alternatif 1: Single standalone scene of an aesthetic loft in Shibuya during midnight rain, centered wooden desk with warm lamp, 8k Unreal 5 style.'
    },
    {
      num: '06',
      title: 'Prompt Video AI (Seamless Loop)',
      tag: 'IMAGE-TO-VIDEO',
      icon: Video,
      desc: 'Prompt khusus image-to-video untuk model seperti Google Veo / Luma / Runway. Menginstruksikan kamera statis (locked-off) dengan gerakan mikro terisolasi (tetesan hujan, uap kopi, partikel debu melayang) agar loop tidak patah saat diulang.',
      highlights: [
        'Kamera terkunci (locked camera) tanpa goyangan yang memusingkan',
        'Looping mulus tanpa ada lonjakan frame (seamless transition)',
        'Menghemat kapasitas render dengan klip pendek yang diduplikasi'
      ],
      sample: 'Image-to-video seamless loop: Completely locked-off camera. Subtle isolated motion only: continuous rain droplets sliding down glass...'
    },
    {
      num: '07',
      title: 'Catatan Teknis & Pre-Upload Checklist',
      tag: 'STANDAR INDUSTRI',
      icon: Settings2,
      desc: 'Petunjuk teknis audio dan video agar konten Anda memenuhi standar YouTube: target loudness -14 LUFS, durasi loop, resolusi 16:9 4K, hingga checklist kata kunci sebelum menekan tombol Publish.',
      highlights: [
        'Target audio loudness YouTube (-14 LUFS integrated)',
        'Checklist verifikasi judul pada batas potong mobile (<70 karakter)',
        'Tips penempatan thumbnail text agar tidak tertimpa cap waktu'
      ],
      sample: '• Target Loudness: -14 LUFS • Resolution: 16:9 (3840x2160) • 10s seamless clip duplicated in timeline'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Arsitektur 7 Blok Output Lengkap</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Semua yang Dibutuhkan Kreator Musik YouTube dalam Sekali Forge.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Setiap blok dirancang secara presisi berdasarkan analisis search intent audiens Amerika Serikat dan algoritma rekomendasi YouTube.
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-8">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.num}
                className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-400 text-sm">{m.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                        {m.title}
                      </h2>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {m.tag}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {m.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Keunggulan Modul:
                    </h3>
                    <ul className="space-y-2">
                      {m.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                          Snippet Cuplikan:
                        </span>
                        <CopyButton textToCopy={m.sample} variant="minimal" />
                      </div>
                      <p className="font-mono text-xs text-slate-800 line-clamp-3 leading-relaxed">
                        {m.sample}
                      </p>
                    </div>
                    <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Bahasa Output: 100% Native English</span>
                      <span className="text-emerald-700 font-medium">Siap Paste</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
            Ingin Mencoba Menghasilkan Paket Konten Anda?
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
            Pilih 1 dari 18 kategori musik kurasi kami dan rasakan kecepatan produksi konten YouTube modern.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-all shadow-sm"
          >
            <span>Buka Generator Sekarang</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
