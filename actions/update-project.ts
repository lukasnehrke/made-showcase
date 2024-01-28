'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { projects } from '@/lib/schema';
import { auth } from '@/lib/auth';

const schema = z.object({
  id: z.string(),
  hidden: z.boolean(),
  title: z.string().min(3).max(128),
  summary: z.string().min(3).max(255),
});

export interface UpdateProjectForm {
  ok: boolean;
  message?: string;
  project?: {
    hidden: boolean;
    title: string;
    summary: string;
  };
}

export async function updateProject(_prevState: UpdateProjectForm, formData: FormData): Promise<UpdateProjectForm> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Not authenticated.');
  }

  const fields = schema.safeParse({
    id: formData.get('id'),
    hidden: formData.get('hidden') === 'on',
    title: formData.get('title'),
    summary: formData.get('summary'),
  });

  if (!fields.success) {
    return { ok: false, message: 'Failed to safe project.' };
  }

  const project = await db.select().from(projects).where(eq(projects.id, fields.data.id)).limit(1);
  if (project.length === 0) {
    throw new Error('Project not found.');
  }

  if (String(project[0].ownerId) !== session.user.id) {
    throw new Error('Unauthorized');
  }

  await db
    .update(projects)
    .set({
      claimed: true,
      hidden: fields.data.hidden,
      title: fields.data.title,
      summary: fields.data.summary,
    })
    .where(eq(projects.id, fields.data.id));

  return {
    ok: true,
    message: 'Project was updated.',
    project: fields.data,
  };
}
