import path from 'node:path';
import { eq } from 'drizzle-orm';
import { octokit } from '@/lib/octokit';
import { db } from '@/lib/drizzle';
import { projects } from '@/lib/schema';
import { ignoredReadmeHashes, madeTemplateRepository, overrides } from '@/lib/constants';
import { summarizeProject } from '@/lib/ai';
import { getHeading } from '@/lib/md';
import { getSemester } from '@/lib/utils';

interface Fork {
  id: number;
  name: string;
  html_url: string;
  stargazers_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
  owner: {
    id: number;
    login: string;
    html_url: string;
    avatar_url: string;
  };
}

interface UpdateProject {
  score: number;
  title?: string;
  summary?: string;
  semester?: string;
  repositoryUrl?: string;
  bannerUrl?: string;
  reportUrl?: string;
  presentationUrl?: string;
  starsCount: number;
  ownerId: number;
  ownerUsername: string;
  ownerUrl: string;
  ownerAvatarUrl: string;
}

interface Status {
  id: string;
  result: string;
  warnings: unknown[];
}

export const updateProjects = async () => {
  const forks = await getTemplateForks(1, 10);

  const statuses: Status[] = [];
  for await (const fork of forks) {
    const status = await updateFork(fork);
    statuses.push(status);
  }

  return statuses;
};

export const updateFork = async (fork: Fork): Promise<Status> => {
  const id = String(fork.id);
  const warnings: unknown[] = [];

  return db.transaction(async (tx) => {
    const existing = await tx.query.projects.findFirst({
      columns: {
        semester: true,
        title: true,
        summary: true,
        reportUrl: true,
        bannerUrl: true,
        presentationUrl: true,
        claimed: true,
        excluded: true,
        updatedAt: true,
      },
      where: eq(projects.id, id),
    });

    if (existing?.claimed) {
      return { id, result: 'skipped (claimed)', warnings };
    }

    if (existing?.excluded) {
      return { id, result: 'skipped (excluded)', warnings };
    }

    if (existing?.updatedAt && fork.updated_at && existing.updatedAt >= new Date(fork.updated_at)) {
      await tx.update(projects).set({ updatedAt: new Date() }).where(eq(projects.id, id));

      return { id, result: 'skipped (not modified)', warnings };
    }

    const project: UpdateProject = {
      title: existing?.title,
      summary: existing?.summary,
      score: fork.stargazers_count ?? 0,
      repositoryUrl: fork.html_url,
      reportUrl: existing?.reportUrl ?? undefined,
      presentationUrl: existing?.presentationUrl ?? undefined,
      bannerUrl: existing?.bannerUrl ?? undefined,
      starsCount: fork.stargazers_count ?? 0,
      ownerId: fork.owner.id,
      ownerUrl: fork.owner.html_url,
      ownerUsername: fork.owner.login,
      ownerAvatarUrl: fork.owner.avatar_url,
    };

    // set semester the project was created: ssXX or wsXX
    if (!existing?.semester) {
      const createdAt = fork.created_at ? new Date(fork.created_at) : new Date();

      project.semester = getSemester(createdAt);
    }

    try {
      // parse README.md contents
      const readme = await octokit.rest.repos.getContent({
        owner: fork.owner.login,
        repo: fork.name,
        path: 'README.md',
        headers: {
          'If-Modified-Since': existing?.updatedAt.toUTCString(),
        },
      });

      if (!Array.isArray(readme.data) && readme.data.type === 'file' && readme.data.encoding === 'base64') {
        if (!ignoredReadmeHashes.includes(readme.data.sha)) {
          const contents = atob(readme.data.content);
          const heading = getHeading(contents);

          if (heading && !heading.toLowerCase().includes('template')) {
            try {
              // Generate title and description using AI
              const { title, description } = await summarizeProject(contents);
              project.title = title;
              project.summary = description;
            } catch (err) {
              warnings.push(err);
            }
          }
        }
      } else {
        warnings.push('README has invalid encoding, is a directory or is too large');
      }
    } catch (err) {
      if (isError(err)) throw err;
    }

    try {
      // fetch project directory
      const files = await octokit.rest.repos.getContent({
        owner: fork.owner.login,
        repo: fork.name,
        path: 'project',
        headers: {
          'If-Modified-Since': existing?.updatedAt.toUTCString(),
        },
      });

      if (Array.isArray(files.data)) {
        files.data.forEach((file) => {
          const { name, ext } = path.parse(file.name.toLowerCase());

          // update link to the final report
          if (name === 'report') {
            if (ext === '.pdf' && file.download_url) {
              project.reportUrl = file.download_url;
            } else if (file.html_url) {
              project.reportUrl = file.html_url;
            }
          }

          // update link to the final presentation
          if (name === 'presentation-video') {
            if (['mp4', 'mov', 'web', 'ogg'].includes(ext) && file.download_url) {
              project.presentationUrl = file.download_url;
            } else if (file.html_url) {
              project.presentationUrl = file.html_url;
            }
          }
        });
      }
    } catch (err) {
      if (isError(err)) throw err;
    }

    // handle overrides
    if (`${fork.owner.login}/${fork.name}` in overrides) {
      Object.assign(project, overrides[`${fork.owner.login}/${fork.name}`]);
    }

    // calculate score
    if (project.reportUrl) project.score += 3;
    if (project.presentationUrl) project.score += 3;
    if (project.bannerUrl) project.score += 3;

    // fallback to repository name
    if (!project.title) {
      project.title = fork.name;
      project.score -= 5;
    }

    // fallback to default summary
    if (!project.summary) {
      project.summary = 'An awesome MADE project.';
      project.score -= 5;
    }

    if (existing) {
      await tx.update(projects).set(project).where(eq(projects.id, id));
      return { id, result: 'updated', warnings };
    }

    await tx.insert(projects).values({
      id,
      ...project,
      semester: project.semester!,
      repositoryUrl: project.repositoryUrl!,
      title: project.title,
      summary: project.summary,
    });

    return { id, result: 'created', warnings };
  });
};

const getTemplateForks = async (page: number, limit: number) => {
  return octokit.rest.repos
    .listForks({
      ...madeTemplateRepository,
      page,
      per_page: limit,
      sort: 'newest',
    })
    .then((res) => res.data.filter((fork) => fork.visibility === 'public' && !fork.disabled && !fork.is_template));
};

// --- Error Helpers ---

const isError = (err?: unknown) => {
  if (!err || typeof err !== 'object' || !('status' in err)) return false;
  return err.status !== 304 && err.status !== 404;
};
