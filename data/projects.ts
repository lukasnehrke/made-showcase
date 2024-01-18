'use server';

import { asc, desc, eq, ilike, or } from 'drizzle-orm';
import { unstable_cache as cache } from 'next/cache';
import type { PgSelect } from 'drizzle-orm/pg-core';
import { db } from '@/lib/drizzle';
import { projects } from '@/lib/schema';

function withSearchQuery<T extends PgSelect>(qb: T, query?: string) {
  if (!query) return qb;
  return qb.where(
    or(
      ilike(projects.title, `%${query}%`),
      ilike(projects.summary, `%${query}%`),
    ),
  );
}

function withPagination<T extends PgSelect>(
  qb: T,
  offset: number,
  limit: number,
) {
  return qb.offset(offset).limit(limit);
}

export const getProjects = cache(
  async ({
    semester,
    query,
    offset,
    limit,
  }: {
    semester: string;
    offset: number;
    limit: number;
    query?: string;
  }) => {
    const dynamicQuery = db
      .select()
      .from(projects)
      .where(eq(projects.semester, semester))
      .orderBy(
        desc(projects.featured),
        desc(projects.starsCount),
        asc(projects.title),
      )
      .$dynamic();

    void withPagination(dynamicQuery, offset, limit);
    void withSearchQuery(dynamicQuery, query);

    return dynamicQuery;
  },
);
