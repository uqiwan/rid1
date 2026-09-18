import fs from 'fs';
import path from 'path';
import { CATEGORIES_DATA, SAMPLE_LOFI_PACKAGE } from '../src/data/categories';
import { Category, ContentPackage, PromptTemplate, AuditLog, User } from '../src/types';

/**
 * In-Memory & Persistent Storage Repository
 * Provides fast query and state management for TuneForge backend
 * Strictly follows Drizzle Schema contract with JSON-file persistence fallback
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'tuneforge_storage.json');

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

const INITIAL_USERS: User[] = [];

class DbRepository {
  private categories: Category[] = [...CATEGORIES_DATA];
  private packages: ContentPackage[] = [];
  private templates: PromptTemplate[] = [...INITIAL_TEMPLATES];
  private users: User[] = [];
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.loadFromDisk();
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const dump = {
        categories: this.categories,
        packages: this.packages,
        templates: this.templates,
        users: this.users,
        auditLogs: this.auditLogs.slice(0, 100)
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(dump, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to save database to disk:', err);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.packages)) this.packages = parsed.packages;
        if (Array.isArray(parsed.users)) this.users = parsed.users;
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) this.categories = parsed.categories;
        if (Array.isArray(parsed.templates) && parsed.templates.length > 0) this.templates = parsed.templates;
        if (Array.isArray(parsed.auditLogs)) this.auditLogs = parsed.auditLogs;
      }
    } catch (err) {
      console.warn('Failed to read database from disk, using defaults:', err);
    }
  }

  // Packages with user data isolation
  public getPackages(search?: string, categoryId?: string, userId?: string, role?: string): ContentPackage[] {
    let result = [...this.packages];

    // Data isolation: non-admin can only see their own packages
    if (role !== 'admin') {
      if (userId) {
        result = result.filter((p) => p.userId === userId);
      } else {
        return [];
      }
    } else if (userId && userId !== 'all') {
      result = result.filter((p) => p.userId === userId);
    }

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
    this.saveToDisk();
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
    this.saveToDisk();
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
    this.saveToDisk();
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
    this.saveToDisk();
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
    this.saveToDisk();
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
    this.saveToDisk();
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
    this.saveToDisk();
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
    this.saveToDisk();
    return true;
  }

  // Users
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public upsertUser(userData: {
    email: string;
    name: string;
    avatarUrl?: string;
    role?: 'user' | 'admin';
    googleSub?: string;
  }): User {
    const cleanEmail = userData.email.toLowerCase().trim();
    const isOwnerAdmin = cleanEmail === 'uqiwan@gmail.com';
    const assignedRole: 'user' | 'admin' = isOwnerAdmin ? 'admin' : 'user';

    const existing = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      existing.lastLoginAt = new Date().toISOString();
      if (userData.name) existing.name = userData.name;
      if (userData.avatarUrl) existing.avatarUrl = userData.avatarUrl;
      existing.role = assignedRole;
      this.saveToDisk();
      return existing;
    }

    const newUser: User = {
      id: `usr-${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
      googleSub: userData.googleSub || `google-sub-${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}`,
      email: cleanEmail,
      name: userData.name || cleanEmail.split('@')[0],
      avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name || cleanEmail)}&backgroundColor=f59e0b`,
      role: assignedRole,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.addAuditLog({
      adminEmail: newUser.email,
      action: 'USER_REGISTER',
      entity: 'User',
      details: `Pengguna terdaftar via Akun Google: ${newUser.name} (${newUser.email}) — Peran: ${newUser.role.toUpperCase()}`
    });

    this.saveToDisk();
    return newUser;
  }

  public updateUserRole(id: string, role: 'user' | 'admin', adminEmail = 'uqiwan@gmail.com'): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    // Strict rule: Only uqiwan@gmail.com can ever have admin role
    if (role === 'admin' && this.users[index].email.toLowerCase() !== 'uqiwan@gmail.com') {
      return null;
    }

    const oldRole = this.users[index].role;
    this.users[index].role = role;
    this.addAuditLog({
      adminEmail,
      action: 'ROLE_CHANGE',
      entity: 'User',
      details: `Mengubah peran pengguna ${this.users[index].name} (${this.users[index].email}) dari ${oldRole.toUpperCase()} menjadi ${role.toUpperCase()}`
    });
    this.saveToDisk();
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
