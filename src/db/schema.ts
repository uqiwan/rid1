import { pgTable, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

/**
 * TuneForge Database Schema (Bab 10 PRD)
 * Built with Drizzle ORM for PostgreSQL / Cloud SQL compatibility
 */

// 1. Users Table
export const users = pgTable('users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  googleSub: varchar('google_sub', { length: 128 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  role: varchar('role', { length: 32 }).notNull().default('user'), // 'user' | 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at').defaultNow().notNull(),
});

// 2. Categories Table (18 Pre-seeded Categories)
export const categories = pgTable('categories', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  description: text('description').notNull(),
  iconEmoji: varchar('icon_emoji', { length: 16 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  subGenres: jsonb('sub_genres').notNull().$type<string[]>(),
  moods: jsonb('moods').notNull().$type<string[]>(),
});

// 3. Content Packages Table (7 Output Blocks)
export const contentPackages = pgTable('content_packages', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  categoryId: varchar('category_id', { length: 64 }).notNull(),
  categoryName: varchar('category_name', { length: 128 }).notNull(),
  subGenre: varchar('sub_genre', { length: 128 }).notNull(),
  moods: jsonb('moods').notNull().$type<string[]>(),
  optionalKeyword: varchar('optional_keyword', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  generationMs: integer('generation_ms').notNull(),
  model: varchar('model', { length: 64 }).notNull().default('gemini-3.8-flash'),

  // Block 01: YouTube Metadata
  metadata: jsonb('metadata').notNull().$type<{
    titleA: string;
    titleB: string;
    titleC: string;
    description: string;
    tags: string[];
  }>(),

  // Block 02: Thumbnail Text (CTR > 20%)
  thumbnailText: jsonb('thumbnail_text').notNull().$type<{
    variant1: string;
    variant2: string;
    variant3: string;
  }>(),

  // Block 03: Intro Hook (0-10s)
  introHook: text('intro_hook').notNull(),

  // Block 04: 4 Thumbnail Prompts
  thumbnailPrompts: jsonb('thumbnail_prompts').notNull().$type<{
    cinematic: string;
    split: string;
    minimal: string;
    lifestyle: string;
  }>(),

  // Block 05: 3 Standalone Single-Scene Image Prompts
  imagePrompts: jsonb('image_prompts').notNull().$type<string[]>(),

  // Block 06: AI Video Looping Prompt (Locked-off camera)
  videoPrompt: text('video_prompt').notNull(),

  // Block 07: Technical Notes & Checklist
  technicalNotes: text('technical_notes').notNull(),
});

// 4. Prompt Templates Table (Admin Management)
export const promptTemplates = pgTable('prompt_templates', {
  id: varchar('id', { length: 64 }).primaryKey(),
  categoryId: varchar('category_id', { length: 64 }).notNull(),
  categoryName: varchar('category_name', { length: 128 }).notNull(),
  style: varchar('style', { length: 64 }).notNull(), // 'cinematic' | 'split' | 'minimal' | 'lifestyle' | 'video_loop'
  promptText: text('prompt_text').notNull(),
  referenceMeta: jsonb('reference_meta').$type<{
    hook?: string;
    tags?: string[];
  }>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Audit Logs Table (Admin Governance)
export const auditLogs = pgTable('audit_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  adminEmail: varchar('admin_email', { length: 255 }).notNull(),
  action: varchar('action', { length: 128 }).notNull(),
  entity: varchar('entity', { length: 128 }).notNull(),
  details: text('details').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});
