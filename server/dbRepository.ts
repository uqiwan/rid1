import { CATEGORIES_DATA, SAMPLE_LOFI_PACKAGE } from '../src/data/categories';
import { Category, ContentPackage, PromptTemplate, AuditLog, User } from '../src/types';

/**
 * In-Memory & Persistent Storage Repository
 * Provides fast query and state management for TuneForge backend
 * Strictly follows Drizzle Schema contract
 */

// Initial templates
const INITIAL_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tmpl-cinematic',
    categoryId: 'cat-01',
    categoryName: 'Lo-fi & Chill Beats',
    style: 'cinematic',
    promptText: 'Cinematic widescreen photograph, 16:9 aspect ratio, 35mm lens f/1.8 depth of field. Scene features {KEYWORD_CONTEXT} representing {CATEGORY_NAME} with dramatic warm amber side-lighting. Ultra-detailed textures, moody atmospheric bokeh, and intentional clean negative space on the left third for high-contrast typography overlay.'
  },
  {
    id: 'tmpl-split',
    categoryId: 'cat-01',
    categoryName: 'Lo-fi & Chill Beats',
    style: 'split',
    promptText: 'Split composition 16:9 YouTube thumbnail layout. Left side: Macro close-up of musical or thematic detail representing {SUB_GENRE} with warm ambient glow. Right side: Wide angle aesthetic scene of {KEYWORD_CONTEXT} with rich color grading and high dynamic range contrast. Highly clickable, clear separation.'
  },
  {
    id: 'tmpl-minimal',
    categoryId: 'cat-01',
    categoryName: 'Lo-fi & Chill Beats',
    style: 'minimal',
    promptText: 'Minimalist high-contrast aesthetic graphic photograph, 16:9 ratio. Dark textured slate background, single high-key beam of golden light illuminating iconic symbolic artifact of {CATEGORY_NAME}. Expansive negative space covering 60% of canvas designed for bold title typography.'
  },
  {
    id: 'tmpl-lifestyle',
    categoryId: 'cat-01',
    categoryName: 'Lo-fi & Chill Beats',
    style: 'lifestyle',
    promptText: 'Authentic cozy lifestyle photography, 16:9 ratio. Relatable creator desk space or cozy living room environment themed around {KEYWORD_CONTEXT} and {MOODS}. Soft ambient lighting from desk lamp, subtle natural film grain, intimate and melancholic atmosphere.'
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr-demo',
    googleSub: 'google-sub-109283746592817263',
    email: 'uqiwan@gmail.com',
    name: 'Uqiwan Studio',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: '2025-01-10T08:00:00Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-002',
    googleSub: 'google-sub-948293812491028374',
    email: 'john.lofi@producer.io',
    name: 'John Lofi Beats',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    createdAt: '2025-02-01T10:00:00Z',
    lastLoginAt: '2025-11-14T14:20:00Z'
  },
  {
    id: 'usr-003',
    googleSub: 'google-sub-738192039182736451',
    email: 'sarah.piano@cinematic.com',
    name: 'Sarah Solo Keys',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    createdAt: '2025-02-15T09:30:00Z',
    lastLoginAt: '2025-11-13T18:40:00Z'
  },
  {
    id: 'usr-004',
    googleSub: 'google-sub-119283948572615243',
    email: 'alex.ambient@sleepsound.org',
    name: 'Alex Ambient Studio',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    createdAt: '2025-03-01T11:00:00Z',
    lastLoginAt: '2025-11-12T08:15:00Z'
  }
];

class DbRepository {
  private categories: Category[] = [...CATEGORIES_DATA];
  private packages: ContentPackage[] = [
    SAMPLE_LOFI_PACKAGE,
    {
      id: 'pkg-synth-002',
      userId: 'usr-demo',
      categoryId: 'cat-02',
      categoryName: 'Synthwave & Retrowave',
      subGenre: 'Outrun 80s Cyberpunk',
      moods: ['Nostalgic', 'Energetic', 'Night Drive'],
      optionalKeyword: 'neon highway sunset',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      generationMs: 3120,
      model: 'gemini-3.8-flash',
      metadata: {
        titleA: 'Neon Highway 1984 🚗 Retrowave & Synthwave Mix [1 Hour Retro Night Drive]',
        titleB: 'Cyberpunk 80s Synthwave Chill — Nostalgic Outrun Beats for Coding / Driving',
        titleC: 'Retro Electro Dreams ⚡ Sunset Drive Synthwave (1 Hour Seamless Audio Loop)',
        description: 'Take an immersive cruise through the neon-lit grid with synthwave and outrun retro electronic beats.\n\nMastered to YouTube -14 LUFS standard for maximum acoustic fidelity.\n\n#synthwave #retrowave #nightdrive #cyberpunk',
        tags: ['synthwave', 'retrowave', '80s beats', 'night drive', 'cyberpunk music', 'chillwave', 'outrun', 'retro electro']
      },
      thumbnailText: {
        variant1: 'NIGHT DRIVE 80s 🚗',
        variant2: 'RETRO SYNTH ⚡',
        variant3: 'OUTRUN 1984 🌆'
      },
      introHook: 'Ignite the engine, dim the room, and let the retro-futuristic synths take over your flow state.',
      thumbnailPrompts: {
        cinematic: 'Cinematic 16:9 shot of a sleek 1980s sports car dashboard driving towards a massive magenta synthwave grid sunset. Neon purple and cyan lighting reflections on chrome trim, ultra detailed.',
        split: 'Split screen 16:9 thumbnail. Left: glowing vintage synthesizer keyboard. Right: neon grid freeway stretching to digital horizon.',
        minimal: 'High contrast minimalist silhouette of an 80s supercar against an oversized retro chrome grid sun.',
        lifestyle: 'Night time creator room with purple and cyan neon strip lighting, VHS tape collection, and retro arcade cabinet.'
      },
      imagePrompts: [
        'Standalone single scene: Retrowave sports car parked on a scenic coastal overlook facing a neon magenta horizon, static locked-off composition for video looping.',
        'Standalone single scene: Cyberpunk highway stretching into a vibrant neon sunset grid with gentle pixel dust reflections, locked camera framing.',
        'Standalone single scene: Retro futuristic bedroom overlooking a neon cityscape, warm twilight glow, balanced negative space.'
      ],
      videoPrompt: 'Image-to-video seamless loop: Locked-off camera on tripod. Subtle gentle pulsing of the neon horizon and faint ambient dust drifting slowly. Zero camera panning, flawless 10s loop cycle.',
      technicalNotes: '• Target: -14 LUFS\n• Bitrate: 320kbps AAC audio\n• Visual: 10s loop extended to 60 minutes timeline.'
    }
  ];
  private templates: PromptTemplate[] = [...INITIAL_TEMPLATES];
  private users: User[] = [...INITIAL_USERS];
  private auditLogs: AuditLog[] = [
    {
      id: 'log-01',
      adminEmail: 'uqiwan@gmail.com',
      action: 'INIT_SYSTEM',
      entity: 'System',
      details: 'Sistem TuneForge Fase 3 berhasil diinisialisasi dengan portal Super Admin & Knowledge Base sinkron.',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'log-02',
      adminEmail: 'uqiwan@gmail.com',
      action: 'UPDATE',
      entity: 'Category',
      details: 'Memverifikasi konsistensi search intent untuk 18 Kategori Musik Instrumental.',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  // Packages
  public getPackages(search?: string, categoryId?: string): ContentPackage[] {
    let result = [...this.packages];
    if (categoryId && categoryId !== 'all') {
      result = result.filter((p) => p.categoryId === categoryId);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.categoryName.toLowerCase().includes(q) ||
          p.subGenre.toLowerCase().includes(q) ||
          p.metadata.titleA.toLowerCase().includes(q) ||
          (p.optionalKeyword && p.optionalKeyword.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getPackageById(id: string): ContentPackage | undefined {
    return this.packages.find((p) => p.id === id);
  }

  public createPackage(pkg: ContentPackage): ContentPackage {
    this.packages.unshift(pkg);
    this.addAuditLog({
      adminEmail: pkg.userId === 'usr-demo' ? 'uqiwan@gmail.com' : pkg.userId,
      action: 'FORGE_PACKAGE',
      entity: 'ContentPackage',
      details: `Membuat paket konten baru: "${pkg.metadata.titleA.slice(0, 50)}..." [${pkg.categoryName}]`
    });
    return pkg;
  }

  public deletePackage(id: string, adminEmail = 'uqiwan@gmail.com'): boolean {
    const target = this.packages.find((p) => p.id === id);
    if (!target) return false;
    this.packages = this.packages.filter((p) => p.id !== id);
    this.addAuditLog({
      adminEmail,
      action: 'DELETE',
      entity: 'ContentPackage',
      details: `Menghapus paket ID ${id} (${target.metadata.titleA.slice(0, 40)}...)`
    });
    return true;
  }

  // Categories
  public getCategories(): Category[] {
    return this.categories;
  }

  public getCategoryById(id: string): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  public createCategory(cat: Omit<Category, 'id'>, adminEmail = 'uqiwan@gmail.com'): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`
    };
    this.categories.push(newCat);
    this.addAuditLog({
      adminEmail,
      action: 'CREATE',
      entity: 'Category',
      details: `Menambahkan kategori baru: "${newCat.name}" (${newCat.iconEmoji})`
    });
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>, adminEmail = 'uqiwan@gmail.com'): Category | null {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.categories[index] = { ...this.categories[index], ...updates };
    this.addAuditLog({
      adminEmail,
      action: 'UPDATE',
      entity: 'Category',
      details: `Memperbarui kategori: "${this.categories[index].name}"`
    });
    return this.categories[index];
  }

  public deleteCategory(id: string, adminEmail = 'uqiwan@gmail.com'): boolean {
    const target = this.categories.find((c) => c.id === id);
    if (!target) return false;
    this.categories = this.categories.filter((c) => c.id !== id);
    this.addAuditLog({
      adminEmail,
      action: 'DELETE',
      entity: 'Category',
      details: `Menghapus kategori "${target.name}" dari Knowledge Base`
    });
    return true;
  }

  // Templates
  public getTemplates(): PromptTemplate[] {
    return this.templates;
  }

  public createTemplate(tmpl: Omit<PromptTemplate, 'id'>, adminEmail = 'uqiwan@gmail.com'): PromptTemplate {
    const newTmpl: PromptTemplate = {
      ...tmpl,
      id: `tmpl-${Date.now()}`
    };
    this.templates.push(newTmpl);
    this.addAuditLog({
      adminEmail,
      action: 'CREATE',
      entity: 'PromptTemplate',
      details: `Menambahkan prompt template baru: "${newTmpl.style}"`
    });
    return newTmpl;
  }

  public updateTemplate(id: string, promptText: string, adminEmail = 'uqiwan@gmail.com'): PromptTemplate | null {
    const index = this.templates.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.templates[index].promptText = promptText;
    this.addAuditLog({
      adminEmail,
      action: 'UPDATE',
      entity: 'PromptTemplate',
      details: `Memperbarui formula prompt template: "${this.templates[index].style}"`
    });
    return this.templates[index];
  }

  public deleteTemplate(id: string, adminEmail = 'uqiwan@gmail.com'): boolean {
    const target = this.templates.find((t) => t.id === id);
    if (!target) return false;
    this.templates = this.templates.filter((t) => t.id !== id);
    this.addAuditLog({
      adminEmail,
      action: 'DELETE',
      entity: 'PromptTemplate',
      details: `Menghapus prompt template "${target.style}"`
    });
    return true;
  }

  // Users
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public updateUserRole(id: string, role: 'user' | 'admin', adminEmail = 'uqiwan@gmail.com'): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    const oldRole = this.users[index].role;
    this.users[index].role = role;
    this.addAuditLog({
      adminEmail,
      action: 'ROLE_CHANGE',
      entity: 'User',
      details: `Mengubah peran pengguna ${this.users[index].name} (${this.users[index].email}) dari ${oldRole.toUpperCase()} menjadi ${role.toUpperCase()}`
    });
    return this.users[index];
  }

  // Audit Logs
  public getAuditLogs(limit = 50): AuditLog[] {
    return this.auditLogs.slice(0, limit);
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // Stats
  public getStats() {
    return {
      totalCategories: this.categories.length,
      totalPackages: this.packages.length,
      totalUsers: this.users.length,
      totalTemplates: this.templates.length,
      activeModel: 'gemini-3.8-flash',
      avgLatencyMs: 2850,
      recentAuditLogs: this.getAuditLogs(5)
    };
  }
}

export const dbRepository = new DbRepository();
