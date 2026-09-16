import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { generateTuneForgePackage, regenerateSingleBlock, ForgeInput } from './server/geminiService';
import { dbRepository } from './server/dbRepository';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// API ROUTES (FIRST)
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    phase: 'Fase 2',
    timestamp: new Date().toISOString(),
    aiReady: hasGeminiKey,
    model: hasGeminiKey ? 'gemini-3.6-flash (Resilient Multi-Model Engine)' : 'TuneForge Algorithmic Engine',
    uptime: process.uptime()
  });
});

// Generate Full 7-Block Package
app.post('/api/forge', async (req: Request, res: Response) => {
  try {
    const input: ForgeInput = req.body;
    if (!input.categoryId || !input.subGenre) {
      return res.status(400).json({ error: 'Kategori dan sub-genre wajib dipilih.' });
    }

    const pkg = await generateTuneForgePackage(input);
    dbRepository.createPackage(pkg);

    dbRepository.addAuditLog({
      adminEmail: 'creator@tuneforge.ai',
      action: 'FORGE_PACKAGE',
      entity: 'ContentPackage',
      details: `Paket dibuat untuk ${pkg.categoryName} (${pkg.subGenre}) [${pkg.id}]`
    });

    res.status(201).json(pkg);
  } catch (error: any) {
    console.error('Error in /api/forge:', error);
    res.status(500).json({ error: 'Gagal men-generate paket konten.', details: error?.message });
  }
});

// Regenerate Single Block
app.post('/api/regenerate-block', async (req: Request, res: Response) => {
  try {
    const { blockName, currentPackage } = req.body;
    if (!blockName || !currentPackage) {
      return res.status(400).json({ error: 'blockName dan currentPackage wajib dikirim.' });
    }

    const result = await regenerateSingleBlock(blockName, currentPackage);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/regenerate-block:', error);
    res.status(500).json({ error: 'Gagal me-regenerate blok.', details: error?.message });
  }
});

// Get Packages History
app.get('/api/packages', (req: Request, res: Response) => {
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
  const packages = dbRepository.getPackages(search, categoryId);
  res.json({ packages, total: packages.length });
});

// Get Single Package
app.get('/api/packages/:id', (req: Request, res: Response) => {
  const pkg = dbRepository.getPackageById(req.params.id);
  if (!pkg) {
    return res.status(404).json({ error: 'Paket tidak ditemukan' });
  }
  res.json(pkg);
});

// Delete Package
app.delete('/api/packages/:id', (req: Request, res: Response) => {
  const success = dbRepository.deletePackage(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Paket tidak ditemukan atau sudah terhapus' });
  }
  res.json({ success: true, message: 'Paket berhasil dihapus' });
});

// Categories
app.get('/api/categories', (req: Request, res: Response) => {
  res.json(dbRepository.getCategories());
});

app.post('/api/categories', (req: Request, res: Response) => {
  const { name, slug, description, iconEmoji, sortOrder, isActive, subGenres, moods } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'Name dan slug wajib diisi' });
  }
  const newCat = dbRepository.createCategory({
    name,
    slug,
    description: description || '',
    iconEmoji: iconEmoji || '🎵',
    sortOrder: sortOrder || 99,
    isActive: isActive !== false,
    subGenres: Array.isArray(subGenres) ? subGenres : [],
    moods: Array.isArray(moods) ? moods : []
  });
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const updated = dbRepository.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Kategori tidak ditemukan' });
  }
  res.json(updated);
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const success = dbRepository.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Kategori tidak ditemukan atau gagal dihapus' });
  }
  res.json({ success: true, message: 'Kategori berhasil dihapus dari Knowledge Base' });
});

// Prompt Templates
app.get('/api/templates', (req: Request, res: Response) => {
  res.json(dbRepository.getTemplates());
});

app.post('/api/templates', (req: Request, res: Response) => {
  const { categoryId, categoryName, style, promptText } = req.body;
  if (!style || !promptText) {
    return res.status(400).json({ error: 'style dan promptText wajib diisi' });
  }
  const newTmpl = dbRepository.createTemplate({
    categoryId: categoryId || 'cat-01',
    categoryName: categoryName || 'Lo-fi & Chill Beats',
    style,
    promptText
  });
  res.status(201).json(newTmpl);
});

app.put('/api/templates/:id', (req: Request, res: Response) => {
  const { promptText } = req.body;
  if (!promptText) {
    return res.status(400).json({ error: 'promptText tidak boleh kosong' });
  }
  const updated = dbRepository.updateTemplate(req.params.id, promptText);
  if (!updated) {
    return res.status(404).json({ error: 'Template tidak ditemukan' });
  }
  res.json(updated);
});

app.delete('/api/templates/:id', (req: Request, res: Response) => {
  const success = dbRepository.deleteTemplate(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Template tidak ditemukan' });
  }
  res.json({ success: true, message: 'Template berhasil dihapus' });
});

// Users Management
app.get('/api/users', (req: Request, res: Response) => {
  res.json(dbRepository.getUsers());
});

app.put('/api/users/:id/role', (req: Request, res: Response) => {
  const { role } = req.body;
  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'Role harus "user" atau "admin"' });
  }
  const updated = dbRepository.updateUserRole(req.params.id, role);
  if (!updated) {
    return res.status(404).json({ error: 'User tidak ditemukan' });
  }
  res.json(updated);
});

// Audit Logs
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json(dbRepository.getAuditLogs());
});

// System Stats
app.get('/api/stats', (req: Request, res: Response) => {
  res.json(dbRepository.getStats());
});

// Export Packages
app.get('/api/packages/export/json', (req: Request, res: Response) => {
  const packages = dbRepository.getPackages();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="tuneforge-packages-export.json"');
  res.json({
    exportedAt: new Date().toISOString(),
    total: packages.length,
    packages
  });
});

// ==========================================
// VITE MIDDLEWARE / STATIC ASSETS
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TuneForge Server running on http://0.0.0.0:${PORT} [Fase 2 Active]`);
  });
}

startServer();
