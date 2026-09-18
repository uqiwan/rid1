import { create } from 'zustand';
import { CATEGORIES_DATA, INITIAL_HISTORY_PACKAGES, SAMPLE_LOFI_PACKAGE } from '../data/categories';
import { Category, ContentPackage, User, PromptTemplate, AuditLog, CinematicVariantType } from '../types';
import { generateRefinedTitleVariants } from '../data/titleFormulaEngine';
import { generateEngineeredThumbnailPrompts } from '../data/thumbnailPromptEngine';
import { generateGoogleFlowPrompts } from '../data/googleFlowEngine';
import { generateCinematicVisualBundle } from '../data/cinematicPromptEngine';
import { 
  translateDurationToEnglish, 
  translateUseCaseToEnglish, 
  translateKeywordToEnglish 
} from '../utils/languageTranslator';
import { 
  TextPositionCode, 
  ColorPaletteCode, 
  CustomColorInput 
} from '../data/thumbnailSettingsEngine';

interface SystemStats {
  totalCategories: number;
  totalPackages: number;
  totalUsers: number;
  totalTemplates: number;
  activeModel: string;
  avgLatencyMs: number;
  recentAuditLogs: AuditLog[];
}

interface TuneForgeState {
  // Authentication & User State
  currentUser: User | null;
  isLoggedIn: boolean;
  setUserRole: (role: 'user' | 'admin') => void;
  loginWithGoogle: (params?: { email?: string; name?: string; role?: 'user' | 'admin'; creatorPassword?: string; avatarUrl?: string }) => Promise<User>;
  login: () => void;
  logout: () => void;

  // Navigation (Clean SPA Routing)
  currentRoute: string;
  routeParam: string | null;
  navigate: (route: string, param?: string) => void;

  // Categories & Knowledge Base
  categories: Category[];
  fetchCategories: () => Promise<void>;
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Templates Management
  templates: PromptTemplate[];
  fetchTemplates: () => Promise<void>;
  updateTemplate: (id: string, promptText: string) => Promise<boolean>;
  createTemplate: (tmpl: Omit<PromptTemplate, 'id'>) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;

  // Users Management
  usersList: User[];
  fetchUsers: () => Promise<void>;
  updateUserRoleInBackend: (id: string, role: 'user' | 'admin') => Promise<boolean>;

  // Audit Logs & Stats
  auditLogs: AuditLog[];
  fetchAuditLogs: () => Promise<void>;
  systemStats: SystemStats | null;
  fetchStats: () => Promise<void>;

  // Generator Form State
  selectedCategoryId: string;
  selectedSubGenre: string;
  selectedMoods: string[];
  selectedThumbnailStyle: 'all' | 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  duration: string; // opsional: "1 Hour", "3 Hours", etc.
  useCase: string; // opsional: "Study & Sleep", "Deep Focus & Work", etc.
  optionalKeyword: string;
  selectedTextPosition: TextPositionCode;
  selectedColorPalette: ColorPaletteCode;
  customColors: CustomColorInput;
  isGenerating: boolean;
  generationStepMessage: string;

  setSelectedCategory: (categoryId: string) => void;
  setSelectedSubGenre: (subGenre: string) => void;
  toggleMood: (mood: string) => void;
  setSelectedThumbnailStyle: (style: 'all' | 'cinematic' | 'split' | 'minimal' | 'lifestyle') => void;
  setDuration: (duration: string) => void;
  setUseCase: (useCase: string) => void;
  setOptionalKeyword: (keyword: string) => void;
  setSelectedTextPosition: (pos: TextPositionCode) => void;
  setSelectedColorPalette: (pal: ColorPaletteCode) => void;
  setCustomColors: (colors: Partial<CustomColorInput>) => void;
  resetThumbnailSettings: () => void;
  resetForm: () => void;

  // Packages & History
  packages: ContentPackage[];
  fetchPackages: () => Promise<void>;
  currentPackage: ContentPackage | null;
  setCurrentPackageById: (id: string) => void;
  forgeNewPackage: () => Promise<string>;
  regenerateBlockInCurrentPackage: (blockName: string) => Promise<boolean>;
  setCinematicVariant: (variant: CinematicVariantType) => void;
  deletePackage: (id: string) => Promise<void>;

  // AI Status
  aiEngineStatus: { ready: boolean; model: string };
  checkAiHealth: () => Promise<void>;

  // Toast System
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

const getStoredSession = (): { user: User | null; isLoggedIn: boolean } => {
  try {
    const raw = localStorage.getItem('tuneforge_session_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.email) {
        return { user: parsed, isLoggedIn: true };
      }
    }
  } catch {
    // Sesi gagal dibaca, gunakan guest state default
  }
  return { user: null, isLoggedIn: false };
};

const initialSession = getStoredSession();

export const useTuneForgeStore = create<TuneForgeState>((set, get) => ({
  currentUser: initialSession.user,
  isLoggedIn: initialSession.isLoggedIn,

  setUserRole: (role) => {
    set((state) => {
      if (!state.currentUser) return state;
      const updatedUser = { ...state.currentUser, role };
      try {
        localStorage.setItem('tuneforge_session_user', JSON.stringify(updatedUser));
      } catch {}
      return { currentUser: updatedUser };
    });
    const current = get().currentUser;
    if (current) {
      get().updateUserRoleInBackend(current.id, role).catch(() => {});
    }
  },

  loginWithGoogle: async (params?: { email?: string; name?: string; creatorPassword?: string; avatarUrl?: string }) => {
    const email = params?.email?.trim().toLowerCase() || '';
    const name = params?.name?.trim() || '';
    const creatorPassword = params?.creatorPassword?.trim() || '';
    const avatarUrl = params?.avatarUrl || '';

    if (!email) {
      throw new Error('Alamat email Google wajib diisi.');
    }

    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, creatorPassword, avatarUrl })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal melakukan verifikasi akun Google.');
    }

    if (data.user) {
      try {
        localStorage.setItem('tuneforge_session_user', JSON.stringify(data.user));
      } catch {}
      set({
        currentUser: data.user,
        isLoggedIn: true,
        currentRoute: '/dashboard'
      });
      get().showToast(data.message || `Berhasil masuk sebagai ${data.user.name}`);
      get().fetchPackages();
      if (data.user.role === 'admin') {
        get().fetchUsers();
        get().fetchStats();
      }
      return data.user;
    }

    throw new Error('Respon server tidak valid.');
  },

  login: () => {
    const session = getStoredSession();
    if (session.user) {
      set({ currentUser: session.user, isLoggedIn: true, currentRoute: '/dashboard' });
      get().fetchPackages();
    } else {
      set({ currentRoute: '/login' });
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('tuneforge_session_user');
    } catch {}
    set({
      currentUser: null,
      isLoggedIn: false,
      packages: [],
      currentPackage: null,
      currentRoute: '/login',
      routeParam: null
    });
    get().showToast('Anda telah keluar dari akun.');
  },

  currentRoute: initialSession.isLoggedIn ? '/dashboard' : '/login',
  routeParam: null,
  navigate: (route, param = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({ currentRoute: route, routeParam: param });
  },

  categories: CATEGORIES_DATA,
  fetchCategories: async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        set({ categories: data });
      }
    } catch {}
  },
  addCategory: async (newCat) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        const saved = await res.json();
        set((state) => ({ categories: [...state.categories, saved] }));
        return;
      }
    } catch {}
    set((state) => ({
      categories: [
        ...state.categories,
        {
          ...newCat,
          id: `cat-${Date.now()}`,
        }
      ]
    }));
  },
  updateCategory: async (id, updated) => {
    try {
      fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(() => {});
    } catch {}
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...updated } : c))
    }));
  },
  deleteCategory: async (id) => {
    try {
      fetch(`/api/categories/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id)
    }));
  },

  // Templates Management
  templates: [],
  fetchTemplates: async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) {
        const data = await res.json();
        set({ templates: data });
      }
    } catch {}
  },
  updateTemplate: async (id, promptText) => {
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText })
      });
      if (res.ok) {
        set((state) => ({
          templates: state.templates.map((t) => (t.id === id ? { ...t, promptText } : t))
        }));
        return true;
      }
    } catch {}
    return false;
  },
  createTemplate: async (tmpl) => {
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tmpl)
      });
      if (res.ok) {
        const created = await res.json();
        set((state) => ({ templates: [...state.templates, created] }));
        return true;
      }
    } catch {}
    return false;
  },
  deleteTemplate: async (id) => {
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({ templates: state.templates.filter((t) => t.id !== id) }));
        return true;
      }
    } catch {}
    return false;
  },

  // Users Management
  usersList: [],
  fetchUsers: async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        set({ usersList: data });
      }
    } catch {}
  },
  updateUserRoleInBackend: async (id, role) => {
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        set((state) => ({
          usersList: state.usersList.map((u) => (u.id === id ? { ...u, role } : u))
        }));
        return true;
      }
    } catch {}
    return false;
  },

  // Audit Logs & Stats
  auditLogs: [],
  fetchAuditLogs: async () => {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        set({ auditLogs: data });
      }
    } catch {}
  },
  systemStats: null,
  fetchStats: async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        set({ systemStats: data });
      }
    } catch {}
  },

  // Form
  selectedCategoryId: 'cat-01',
  selectedSubGenre: 'Lo-fi Hip-Hop Study',
  selectedMoods: ['Cozy', 'Focus'],
  selectedThumbnailStyle: 'all',
  duration: '1 Hour',
  useCase: 'Study & Work',
  optionalKeyword: '',
  selectedTextPosition: 'POS-AUTO',
  selectedColorPalette: 'PAL-AUTO',
  customColors: { dominant: '#1A3A1A', accent: '#C9A030', textZone: '#0D1A0D' },
  isGenerating: false,
  generationStepMessage: '',

  setSelectedCategory: (catId) => {
    const cat = get().categories.find((c) => c.id === catId);
    if (!cat) return;
    set({
      selectedCategoryId: catId,
      selectedSubGenre: cat.subGenres[0] || '',
      selectedMoods: cat.moods.slice(0, 2)
    });
  },

  setSelectedSubGenre: (subGenre) => set({ selectedSubGenre: subGenre }),

  toggleMood: (mood) => {
    const current = get().selectedMoods;
    if (current.includes(mood)) {
      if (current.length > 1) {
        set({ selectedMoods: current.filter((m) => m !== mood) });
      }
    } else {
      if (current.length < 3) {
        set({ selectedMoods: [...current, mood] });
      }
    }
  },

  setSelectedThumbnailStyle: (style) => set({ selectedThumbnailStyle: style }),
  setDuration: (duration) => set({ duration }),
  setUseCase: (useCase) => set({ useCase }),
  setOptionalKeyword: (keyword) => set({ optionalKeyword: keyword.slice(0, 120) }),
  setSelectedTextPosition: (pos) => set({ selectedTextPosition: pos }),
  setSelectedColorPalette: (pal) => set({ selectedColorPalette: pal }),
  setCustomColors: (colors) => set((s) => ({ customColors: { ...s.customColors, ...colors } })),
  resetThumbnailSettings: () => set({
    selectedTextPosition: 'POS-AUTO',
    selectedColorPalette: 'PAL-AUTO',
    customColors: { dominant: '#1A3A1A', accent: '#C9A030', textZone: '#0D1A0D' }
  }),

  resetForm: () => {
    const firstCat = get().categories[0];
    set({
      selectedCategoryId: firstCat.id,
      selectedSubGenre: firstCat.subGenres[0] || '',
      selectedMoods: firstCat.moods.slice(0, 2),
      selectedThumbnailStyle: 'all',
      duration: '1 Hour',
      useCase: 'Study & Work',
      optionalKeyword: '',
      selectedTextPosition: 'POS-AUTO',
      selectedColorPalette: 'PAL-AUTO',
      customColors: { dominant: '#1A3A1A', accent: '#C9A030', textZone: '#0D1A0D' },
      isGenerating: false,
      generationStepMessage: ''
    });
  },

  packages: [],
  fetchPackages: async () => {
    const user = get().currentUser;
    if (!user) {
      set({ packages: [] });
      return;
    }
    try {
      const url = `/api/packages?userId=${encodeURIComponent(user.id)}&role=${encodeURIComponent(user.role)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.packages)) {
          set({ packages: data.packages });
          if (data.packages.length > 0 && !get().currentPackage) {
            set({ currentPackage: data.packages[0] });
          }
        }
      }
    } catch {
      // Abaikan jika fetch paket offline
    }
  },
  currentPackage: null,

  aiEngineStatus: { ready: true, model: 'gemini-3.8-flash (Live AI Engine)' },
  checkAiHealth: async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        set({ aiEngineStatus: { ready: data.aiReady, model: data.model } });
      }
    } catch {
      // Dev mode fallback
    }
  },

  setCurrentPackageById: (id) => {
    const pkg = get().packages.find((p) => p.id === id);
    if (pkg) {
      set({ currentPackage: pkg });
    }
  },

  forgeNewPackage: async () => {
    // 2A Debounce/Lock: Hanya satu request yang diproses saat isGenerating
    if (get().isGenerating) {
      return get().currentPackage?.id || null;
    }

    set({ isGenerating: true, generationStepMessage: 'Menganalisis search intent penonton YouTube...' });

    const state = get();
    const cat = state.categories.find((c) => c.id === state.selectedCategoryId) || state.categories[0];
    const rawKw = (state.optionalKeyword || '').replace(/<[^>]*>?/gm, '').replace(/[<>{}[\]\\]/g, '').trim().slice(0, 100);
    const cleanKw = translateKeywordToEnglish(rawKw) || (rawKw ? rawKw : 'Midnight Session');
    const cleanDuration = translateDurationToEnglish(state.duration);
    const cleanUseCase = translateUseCaseToEnglish(state.useCase);

    // Background progression timer
    const stepInterval = setInterval(() => {
      const msgs = [
        'Menganalisis search intent penonton YouTube...',
        'Meracik 3 varian judul YouTube & deskripsi SEO dengan -14 LUFS...',
        'Merancang thumbnail hook & teks thumbnail CTR >20%...',
        'Mengompilasi 4 gaya thumbnail prompt (Cinematic, Split, Minimal, Lifestyle)...',
        'Merumuskan 3 alternatif prompt gambar mandiri & video seamless loop...'
      ];
      const currentIdx = msgs.indexOf(get().generationStepMessage);
      if (currentIdx >= 0 && currentIdx < msgs.length - 1) {
        set({ generationStepMessage: msgs[currentIdx + 1] });
      }
    }, 750);

    // 2A Timeout 30 detik untuk panggilan API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const response = await fetch('/api/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          categoryId: cat.id,
          categoryName: cat.name,
          subGenre: state.selectedSubGenre,
          moods: state.selectedMoods,
          preferredThumbnailStyle: state.selectedThumbnailStyle,
          duration: cleanDuration,
          useCase: cleanUseCase,
          optionalKeyword: cleanKw,
          userId: state.currentUser?.id || 'usr-creator'
        })
      });

      clearTimeout(timeoutId);
      clearInterval(stepInterval);

      if (response.ok) {
        const newPkg: ContentPackage = await response.json();
        set((s) => ({
          packages: [newPkg, ...s.packages],
          currentPackage: newPkg,
          isGenerating: false,
          generationStepMessage: ''
        }));
        return newPkg.id;
      } else if (response.status === 429) {
        state.showToast('Batas kuota API AI tercapai sementara. Mengaktifkan mesin kompilasi lokal...');
      } else {
        const errJson = await response.json().catch(() => ({}));
        state.showToast(errJson.error || 'Server sibuk. Menggunakan mesin kompilasi lokal...');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      clearInterval(stepInterval);
      if (err?.name === 'AbortError') {
        state.showToast('Proses terlalu lama (>30 detik). Dialihkan ke generator cepat lokal.');
      }
    }

    clearInterval(stepInterval);

    // Fallback if backend network issue
    const newId = `pkg-${Date.now()}`;
    const fallbackVariants = generateRefinedTitleVariants({
      categoryName: cat.name,
      genre: state.selectedSubGenre,
      moods: state.selectedMoods,
      duration: cleanDuration,
      useCase: cleanUseCase,
      optionalKeyword: cleanKw
    });

    const fallbackThumbs = generateEngineeredThumbnailPrompts({
      categoryName: cat.name,
      genre: state.selectedSubGenre,
      moods: state.selectedMoods,
      preferredStyle: state.selectedThumbnailStyle,
      duration: cleanDuration,
      useCase: cleanUseCase,
      optionalKeyword: cleanKw,
      textPosition: state.selectedTextPosition,
      colorPalette: state.selectedColorPalette,
      customColors: state.customColors
    });

    const fallbackFlow = generateGoogleFlowPrompts({
      categoryName: cat.name,
      genre: state.selectedSubGenre,
      moods: state.selectedMoods,
      optionalKeyword: cleanKw,
      variationIndex: 0
    });

    const newPkg: ContentPackage = {
      id: newId,
      userId: state.currentUser?.id || 'usr-creator',
      categoryId: cat.id,
      categoryName: cat.name,
      subGenre: state.selectedSubGenre,
      moods: state.selectedMoods,
      preferredThumbnailStyle: state.selectedThumbnailStyle,
      duration: state.duration,
      useCase: state.useCase,
      optionalKeyword: cleanKw,
      textPosition: state.selectedTextPosition,
      colorPalette: state.selectedColorPalette,
      customColors: state.customColors,
      createdAt: new Date().toISOString(),
      generationMs: 3200,
      model: 'TuneForge Google Flow Engine (Client)',
      metadata: {
        titleA: fallbackVariants[0].title,
        titleB: fallbackVariants[1].title,
        titleC: fallbackVariants[2].title,
        titleVariants: fallbackVariants,
        description: `Experience continuous calm and focused energy with ${cat.name} (${state.selectedSubGenre}). Specially curated for deep work, coding, reading, and stress relief with zero distracting lyrics.\n\nContext: ${cleanKw}\nMoods: ${state.selectedMoods.join(', ')}\nMastered to YouTube -14 LUFS standards.\n\n#instrumental #${cat.slug} #studymusic #focusbeats`,
        tags: [
          cat.slug,
          state.selectedSubGenre.toLowerCase(),
          'instrumental music',
          'study beats',
          'no lyrics',
          cleanKw.toLowerCase(),
          'focus music',
          'youtube background music',
          'relaxing loop'
        ]
      },
      thumbnailText: {
        variant1: `${cleanKw.toUpperCase().slice(0, 18)} ⚡`,
        variant2: `${state.selectedSubGenre.toUpperCase().slice(0, 18)} 🎧`,
        variant3: `DEEP ${state.selectedMoods[0]?.toUpperCase() || 'FOCUS'} 📚`
      },
      introHook: `Welcome to this 1-hour session of ${state.selectedSubGenre}. Keep your focus uninterrupted, let the rhythm flow, and enjoy your deepest work yet.`,
      thumbnailPrompts: fallbackThumbs.prompts,
      thumbnailDetails: fallbackThumbs.details,
      cinematicVisualBundle: generateCinematicVisualBundle(cat.id, cat.name, 'Scene'),
      imagePrompts: [fallbackFlow.imagePrompt],
      videoPrompt: fallbackFlow.videoPrompt,
      googleFlowDetails: fallbackFlow,
      technicalNotes: `• Target Loudness: -14 LUFS (Integrated)\n• Recommended Loop Duration: 10s base clip extended to 1 hour timeline\n• Aspect Ratio: 16:9 (3840x2160 or 1920x1080)\n• High CTR Tip: Pair Thumbnail Text Variant 1 with the Cinematic or Minimal Typography thumbnail prompt.`
    };

    set((s) => ({
      packages: [newPkg, ...s.packages],
      currentPackage: newPkg,
      isGenerating: false,
      generationStepMessage: ''
    }));

    return newId;
  },

  setCinematicVariant: (variant: CinematicVariantType) => {
    const state = get();
    const currentPkg = state.currentPackage;
    if (!currentPkg) return;

    const bundle = currentPkg.cinematicVisualBundle || generateCinematicVisualBundle(currentPkg.categoryId, currentPkg.categoryName, variant);
    const updatedBundle = {
      ...bundle,
      activeVariant: variant
    };
    const activeData = updatedBundle.variants[variant];

    const modifiedPackage: ContentPackage = {
      ...currentPkg,
      cinematicVisualBundle: updatedBundle,
      imagePrompts: activeData ? [activeData.imagePrompt] : currentPkg.imagePrompts,
      videoPrompt: activeData ? activeData.videoPrompt : currentPkg.videoPrompt
    };

    set((s) => ({
      currentPackage: modifiedPackage,
      packages: s.packages.map((p) => (p.id === modifiedPackage.id ? modifiedPackage : p))
    }));
    state.showToast(`Varian visual diganti ke: ${variant} (${activeData?.variantTitle || variant})`);
  },

  regenerateBlockInCurrentPackage: async (blockName: string) => {
    const state = get();
    const currentPkg = state.currentPackage;
    if (!currentPkg) return false;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const response = await fetch('/api/regenerate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ blockName, currentPackage: currentPkg })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const { updatedData, model } = await response.json();
        const modifiedPackage = { ...currentPkg, model };

        if (blockName === 'Metadata YouTube' && updatedData.titleA) {
          modifiedPackage.metadata = updatedData;
        } else if (blockName === 'Teks Thumbnail' && updatedData.variant1) {
          modifiedPackage.thumbnailText = updatedData;
        } else if (blockName === 'Intro Hook Video' && updatedData.introHook) {
          modifiedPackage.introHook = updatedData.introHook;
        } else if (blockName === 'Prompt Thumbnail' && updatedData.cinematic) {
          modifiedPackage.thumbnailPrompts = {
            cinematic: updatedData.cinematic,
            split: updatedData.split,
            minimal: updatedData.minimal,
            lifestyle: updatedData.lifestyle
          };
          if (updatedData.thumbnailDetails) {
            modifiedPackage.thumbnailDetails = updatedData.thumbnailDetails;
          }
        } else if (blockName === 'Prompt Gambar AI' || blockName === 'Prompt Video AI' || blockName === 'Google Flow Prompts' || blockName === 'Prompt Visual & Video') {
          if (updatedData.imagePrompts) modifiedPackage.imagePrompts = updatedData.imagePrompts;
          if (updatedData.videoPrompt) modifiedPackage.videoPrompt = updatedData.videoPrompt;
          if (updatedData.googleFlowDetails) modifiedPackage.googleFlowDetails = updatedData.googleFlowDetails;
          if (updatedData.cinematicVisualBundle) modifiedPackage.cinematicVisualBundle = updatedData.cinematicVisualBundle;
        } else if (blockName === 'Catatan Teknis' && updatedData.technicalNotes) {
          modifiedPackage.technicalNotes = updatedData.technicalNotes;
        }

        set((s) => ({
          currentPackage: modifiedPackage,
          packages: s.packages.map((p) => (p.id === modifiedPackage.id ? modifiedPackage : p))
        }));
        state.showToast(`${blockName} berhasil diperbarui via ${model}`);
        return true;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === 'AbortError') {
        state.showToast('Proses terlalu lama (>30 detik). Menggunakan generator cepat...');
      }
    }

    // Client-side fallback regeneration
    if (blockName === 'Prompt Gambar AI' || blockName === 'Prompt Video AI' || blockName === 'Google Flow Prompts' || blockName === 'Prompt Visual & Video') {
      const currentVar = currentPkg.googleFlowDetails?.variationIndex ?? 0;
      const nextVar = (currentVar + 1) % 3;
      const variantNames: ('Scene' | 'Subjek' | 'Abstrak')[] = ['Scene', 'Subjek', 'Abstrak'];
      const targetVariant = variantNames[nextVar];
      const cinematicBundle = generateCinematicVisualBundle(currentPkg.categoryId, currentPkg.categoryName, targetVariant);

      const regeneratedFlow = generateGoogleFlowPrompts({
        categoryName: currentPkg.categoryName,
        genre: currentPkg.subGenre,
        moods: currentPkg.moods,
        optionalKeyword: currentPkg.optionalKeyword || 'Session',
        variationIndex: nextVar
      });

      const modifiedPackage: ContentPackage = {
        ...currentPkg,
        cinematicVisualBundle: cinematicBundle,
        imagePrompts: [cinematicBundle.variants[targetVariant].imagePrompt],
        videoPrompt: cinematicBundle.variants[targetVariant].videoPrompt,
        googleFlowDetails: regeneratedFlow,
        model: `TuneForge Cinematic Engine (Varian ${targetVariant})`
      };

      set((s) => ({
        currentPackage: modifiedPackage,
        packages: s.packages.map((p) => (p.id === modifiedPackage.id ? modifiedPackage : p))
      }));
      state.showToast(`Prompt Cinematic baru (Varian ${targetVariant}) berhasil di-generate!`);
      return true;
    }

    return false;
  },

  deletePackage: async (id) => {
    try {
      fetch(`/api/packages/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
    set((state) => ({
      packages: state.packages.filter((p) => p.id !== id)
    }));
  },

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 2000);
  },
  clearToast: () => set({ toastMessage: null })
}));
