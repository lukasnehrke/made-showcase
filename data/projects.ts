'use server';

import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { unstable_cache as cache } from 'next/cache';
import type { PgSelect } from 'drizzle-orm/pg-core';
import { db } from '@/lib/drizzle';
import type { Project} from '@/lib/schema';
import { projects } from '@/lib/schema';

function withSearchQuery<T extends PgSelect>(qb: T, semester: string, query?: string) {
  if (!query) return qb;

  // TODO: use full-text search once it's available in drizzle?
  return qb.where(
    and(
      eq(projects.semester, semester),
      or(
        ilike(projects.title, `%${query}%`),
        ilike(projects.summary, `%${query}%`),
        ilike(projects.ownerName, `%${query}%`),
        ilike(projects.ownerUsername, `%${query}%`),
      ),
    ),
  );
}

export const getProject = async (ownerId: string): Promise<Project | undefined> => {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, parseInt(ownerId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
};

export const getProjects = cache(
  async ({ semester, query, offset, limit }: { semester: string; offset: number; limit: number; query?: string }) => {
    const dynamicQuery = db
      .select()
      .from(projects)
      .where(eq(projects.semester, semester))
      .orderBy(desc(projects.score))
      .offset(offset)
      .limit(limit)
      .$dynamic();

    void withSearchQuery(dynamicQuery, semester, query);
    return dynamicQuery;
  },
);
