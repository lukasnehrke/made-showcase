'use server';

import { z } from 'zod';
import { getProjects } from '@/data/projects';
import type { Project } from '@/lib/schema';

const schema = z.object({
  semester: z.string(),
  query: z.string().optional(),
  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(25),
});

export interface FetchProjectsForm {
  ok: boolean;
  projects: Project[];
}

export async function fetchProjects(_prevState: FetchProjectsForm, formData: FormData): Promise<FetchProjectsForm> {
  const fields = schema.safeParse({
    semester: formData.get('semester'),
    query: formData.get('query'),
    offset: formData.get('offset'),
    limit: formData.get('limit'),
  });

  if (!fields.success) {
    return { ok: false, projects: [] };
  }

  const projects = await getProjects(fields.data);
  return { ok: true, projects };
}
