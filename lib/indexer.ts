import { eq } from 'drizzle-orm';
import { octokit } from '@/lib/octokit';
import { db } from '@/lib/drizzle';
import { projects } from '@/lib/schema';
import {
  ignoredReadmeHashes,
  madeTemplateRepository,
  overrides,
} from '@/lib/constants';
import { summarizeProject } from '@/lib/ai';
import { getHeading } from '@/lib/md';
import { getSemester } from '@/lib/utils';

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
}

const getTemplateForks = async (page: number) => {
  return octokit.rest.repos
    .listForks({
      ...madeTemplateRepository,
      page,
      per_page: 40,
      sort: 'newest',
    })
    .then((res) =>
      res.data.filter(
        (fork) =>
          fork.visibility === 'public' && !fork.disabled && !fork.is_template,
      ),
    );
};

const isVideo = (file?: string) => {
  const ext = file?.split('.').pop()?.toLowerCase();
  return ['mp4', 'mov', 'web', 'ogg'].includes(ext ?? '');
};

const isError = (err?: unknown) => {
  return (
    !err ||
    typeof err !== 'object' ||
    !('status' in err) ||
    (err.status !== 304 && err.status !== 404)
  );
};

export const updateProjects = async () => {
  const forks = await getTemplateForks(2);

  const statuses: Status[] = [];
  for await (const fork of forks) {
    const id = String(fork.id);
    const errors: unknown[] = [];

    const status = await db.transaction(async (tx) => {
      const existingProject = await tx.query.projects.findFirst({
        columns: { semester: true, updatedAt: true },
        where: eq(projects.id, id),
      });

      if (
        existingProject?.updatedAt &&
        fork.updated_at &&
        existingProject.updatedAt >= new Date(fork.updated_at)
      ) {
        await tx
          .update(projects)
          .set({ updatedAt: new Date() })
          .where(eq(projects.id, id));
        return { id, result: 'skipped', errors };
      }

      const project: UpdateProject = {
        score: fork.stargazers_count ?? 0,
        repositoryUrl: fork.html_url,
        starsCount: fork.stargazers_count ?? 0,
        ownerId: fork.owner.id,
        ownerUrl: fork.owner.html_url,
        ownerUsername: fork.owner.login,
        ownerAvatarUrl: fork.owner.avatar_url,
      };

      // set semester the project was created: ssXX or wsXX
      if (!existingProject?.semester) {
        const createdAt = fork.created_at
          ? new Date(fork.created_at)
          : new Date();

        project.semester = getSemester(createdAt);
      }

      try {
        // parse README.md contents
        const readme = await octokit.rest.repos.getContent({
          owner: fork.owner.login,
          repo: fork.name,
          path: 'README.md',
          headers: {
            'If-Modified-Since': existingProject?.updatedAt.toUTCString(),
          },
        });

        if (
          !Array.isArray(readme.data) &&
          readme.data.type === 'file' &&
          readme.data.encoding === 'base64'
        ) {
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
                errors.push(err);
              }
            }
          }
        } else {
          errors.push(
            'README.md has invalid encoding, is a directory or is too large',
          );
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
            'If-Modified-Since': existingProject?.updatedAt.toUTCString(),
          },
        });

        if (Array.isArray(files.data)) {
          files.data.forEach((file) => {
            // update link to the final report
            if (file.name.startsWith('report')) {
              if (file.name.endsWith('.pdf') && file.download_url) {
                project.reportUrl = file.download_url;
              } else if (file.html_url) {
                project.reportUrl = file.html_url;
              }
            }

            // update link to the final presentation
            if (file.name.startsWith('presentation-video')) {
              if (isVideo(file.name) && file.download_url) {
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

      if (existingProject) {
        await tx.update(projects).set(project).where(eq(projects.id, id));
        return { id, result: 'updated', errors };
      }

      await tx.insert(projects).values({
        id,
        ...project,
        semester: project.semester!,
        repositoryUrl: project.repositoryUrl!,
        title: project.title,
        summary: project.summary,
      });

      return { id, result: 'created', errors };
    });

    statuses.push(status);
  }

  return statuses;
};
