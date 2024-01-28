import { integer, pgTable, serial, text, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: varchar('id').primaryKey(),
  claimed: boolean('claimed').notNull().default(false),
  hidden: boolean('hidden').notNull().default(false),
  excluded: boolean('excluded').notNull().default(false),
  semester: varchar('semester').notNull(),
  score: integer('score').notNull().default(0),
  title: varchar('title').notNull(),
  summary: text('summary').notNull(),
  repositoryUrl: varchar('repository_url').notNull(),
  reportUrl: varchar('report_url'),
  presentationUrl: varchar('presentation_url'),
  bannerUrl: varchar('banner_url'),
  starsCount: integer('stars_count').notNull().default(0),
  ownerId: serial('owner_id').notNull(),
  ownerName: varchar('owner_name'),
  ownerUsername: varchar('owner_username').notNull(),
  ownerUrl: varchar('owner_url').notNull(),
  ownerAvatarUrl: varchar('owner_avatar_url').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
