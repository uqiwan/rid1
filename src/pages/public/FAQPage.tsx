import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Wand2 } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

export const FAQPage: React.FC = () => {
  const navigate = useTuneForgeStore((s) => s.navigate);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu TuneForge dan siapa yang membutuhkannya?',
      a: 'TuneForge adalah studio otomasi konten berbasis AI yang dibuat khusus untuk produser musik instrumental dan YouTuber niche santai/fokus. Dari 1 kali pemilihan kategori, TuneForge menghasilkan 1 paket lengkap siap pakai (3 varian judul YouTube, deskripsi SEO, tags, teks thumbnail CTR >20%, intro hook, 4 prompt thumbnail, 3 prompt visual, prompt video loop, dan catatan teknis).'
    },
    {
      q: 'Mengapa output TuneForge menggunakan Bahasa Inggris sementara UI-nya Bahasa Indonesia?',
      a: 'Sesuai Bab 9 PRD, target utama penonton musik instrumental dengan nilai monetisasi CPM tertinggi adalah audience Tier-1 Amerika Serikat dan Global. Karena itu, seluruh hasil generatif (metadata, judul, tags, teks thumbnail, dan prompt AI) diformulasikan dalam bahasa Inggris native dengan search intent AS ("beats to study to", "deep sleep 8 hours"). Antarmuka aplikasi tetap menggunakan Bahasa Indonesia yang ramah bagi kreator tanah air.'
    },
    {
      q: 'Bagaimana cara mencapai target CTR di atas 20%?',
      a: 'TuneForge menggunakan 3 formula peningkat CTR: 1) Teks thumbnail pendek (2–3 kata kontras tinggi) yang terbaca di layar HP <120px, 2) Komposisi prompt gambar dengan negative space terarah agar teks tidak bertabrakan dengan subjek visual, dan 3) 3 varian judul dengan pola search intent spesifik yang langsung menjawab kebutuhan pendengar.'
    },
    {
      q: 'Apakah TuneForge menghasilkan file musik MP3 atau video MP4 jadi?',
      a: 'Tidak. TuneForge adalah arsitek konten dan prompt compiler. Anda membawa karya musik instrumental Anda sendiri, dan TuneForge menyediakan seluruh paket metadata dan prompt AI visual/video yang terkurasi. Anda dapat menempelkan prompt video langsung ke Google Flow AI (Veo), Imagen, Midjourney, atau runway.'
    },
    {
      q: 'Bagaimana cara memastikan loop video tidak patah (seamless)?',
      a: 'Prompt video AI yang dihasilkan TuneForge secara eksplisit memerintahkan model video untuk mengunci kamera (locked-off static camera, zero panning) dan hanya menggerakkan elemen mikro berulang (tetesan hujan di kaca jendela, uap kopi yang membubung, partikel debu melayang dalam sinar lampu). Ini memastikan klip 10 detik dapat di-loop ratusan kali tanpa jeda yang mengganggu penonton.'
    },
    {
      q: 'Berapa banyak kategori musik yang tersedia?',
      a: 'Ada 18 kategori terkurasi lengkap: Lo-fi & Chill Beats, Piano & Solo Keys, Study & Deep Focus, Cinematic, Biola & Strings, Bossa Nova & Cafe Beats, Cover Instrumental Pop, Drum & Percussion, Electronic Synthwave, Game Music Chiptune, Gitar Akustik Fingerstyle, Jazz Smooth Lounge, Musik Klasik Masterpiece, New Age Meditasi Healing, Seruling Flute, Sleep & Deep Relaxation (8 Hours), Ukulele Island Vibes, dan World Celtic Heritage.'
    },
    {
      q: 'Apakah ada batasan jumlah generate per pengguna?',
      a: 'Pada versi MVP ini, setiap pengguna dapat mengenerate hingga 20 paket per jam untuk menjaga performa sistem dan mencegah spam. Riwayat hingga 500 paket tersimpan otomatis di akun Anda.'
    },
    {
      q: 'Apakah paket konten yang saya generate bersifat unik dan aman untuk monetisasi?',
      a: 'Ya. Setiap kombinasi kategori, sub-genre, mood, dan kata kunci konteks opsional diproses secara khusus oleh AI Studio engine sehingga menghasilkan paket yang khas, bebas klaim hak cipta teks, dan siap dimonetisasi di YouTube Partner Program.'
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Pusat Bantuan &amp; Tanya Jawab</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Semua hal yang perlu Anda ketahui tentang alur kerja TuneForge dan optimasi channel YouTube instrumental Anda.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-display font-semibold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900">
            Masih ada pertanyaan lain seputar produksi YouTube musik Anda?
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Langsung coba dan lihat sendiri kualitas output 7 blok dengan menekan tombol generator di bawah.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Mulai Generate Gratis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
