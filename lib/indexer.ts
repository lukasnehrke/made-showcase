import * as cheerio from 'cheerio';
import { eq } from 'drizzle-orm';
import { octokit } from '@/lib/octokit';
import { db } from '@/lib/drizzle';
import { projects } from '@/lib/schema';
import { madeTemplateRepository, overrides } from '@/lib/constants';

interface UpdateProject {
  title?: string;
  summary?: string;
  semester?: string;
  repositoryUrl?: string;
  reportUrl?: string;
  presentationUrl?: string;
  starsCount: number;
  ownerId: number;
  ownerName?: string;
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
      per_page: 100,
      sort: 'oldest',
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
    !err || typeof err !== 'object' || !('status' in err) || err.status !== 304
  );
};

const getSemester = (date: Date): string => {
  // ssXX starts in 1. April and ends in 30. September, wsXX starts in 1. October and ends in 31. March
  const year = date.getFullYear() % 100;
  if (date.getMonth() < 9 && date.getMonth() > 2) {
    return `ss${year}`;
  }
  return `ws${year}`;
};

export const updateProjects = async () => {
  const forks = await getTemplateForks(1);

  const statuses: Status[] = [];
  for await (const fork of forks) {
    const id = String(fork.id);

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
        return { id, result: 'skipped' };
      }

      const project: UpdateProject = {
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
        // parser owner name
        const user = await octokit.rest.users.getByUsername({
          username: fork.owner.login,
          headers: {
            'If-Modified-Since': existingProject?.updatedAt.toUTCString(),
          },
        });

        project.ownerName = user.data.name ?? undefined;
      } catch (err) {
        if (isError(err)) throw err;
      }

      try {
        // parse README.md contents
        const readme = await octokit.rest.repos.getContent({
          owner: fork.owner.login,
          repo: fork.name,
          path: 'README.md',
          mediaType: {
            format: 'html',
          },
          headers: {
            'If-Modified-Since': existingProject?.updatedAt.toUTCString(),
          },
        });

        const $ = cheerio.load(readme.data as unknown as string);
        const heading = $('h1, h2, h3, h4, h5, h6').first().text().trim();

        project.title = heading || fork.name;
        project.summary = fork.description ?? 'An awesome MADE project.';
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

      if (!existingProject) {
        await tx.insert(projects).values({
          id,
          ...project,
          semester: project.semester!,
          repositoryUrl: project.repositoryUrl!,
          title: project.title!,
          summary: project.summary!,
        });
        return { id, result: 'updated' };
      }

      await tx.update(projects).set(project).where(eq(projects.id, id));
      return { id, result: 'created' };
    });

    statuses.push(status);
  }

  return statuses;
};
