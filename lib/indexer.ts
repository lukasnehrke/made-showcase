import type { Timestamp } from '@google-cloud/firestore';
import { FieldValue } from '@google-cloud/firestore';
import * as cheerio from 'cheerio';
import { octokit } from '@/lib/octokit';
import { firestore } from '@/lib/firestore';
import type { Project } from '@/data/projects';

interface Status {
  id: string;
  result: string;
}

const madeTemplateRepository = { owner: 'jvalue', repo: 'made-template' };

const getTemplateForks = async (page: number) => {
  return octokit.rest.repos
    .listForks({
      ...madeTemplateRepository,
      page,
      per_page: 3,
      sort: 'oldest',
    })
    .then((res) =>
      res.data.filter(
        (fork) =>
          fork.visibility === 'public' && !fork.disabled && !fork.is_template,
      ),
    );
};

const isVideo = (file: string) =>
  file.endsWith('.mp4') || file.endsWith('.mov');

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
    const docRef = firestore.collection('projects').doc(String(fork.id));

    const result = await firestore.runTransaction(async (t) => {
      const doc = await t.get(docRef);

      const updatedAt: Date | undefined =
        doc.exists && doc.get('updatedAt')
          ? (doc.get('updatedAt') as Timestamp).toDate()
          : undefined;

      if (
        updatedAt &&
        fork.updated_at &&
        updatedAt >= new Date(fork.updated_at)
      ) {
        t.update(docRef, { updatedAt: FieldValue.serverTimestamp() });
        return { id: docRef.id, result: 'skipped' };
      }

      const project: Omit<Partial<Project>, 'id'> = {
        repositoryUrl: fork.html_url,
        starsUrl: `${fork.html_url}/stargazers`,
        starsCount: fork.stargazers_count ?? 0,
        owner: {
          id: fork.owner.id,
          name: `@${fork.owner.login}`,
          username: fork.owner.login,
          avatarUrl: fork.owner.avatar_url,
          url: fork.owner.html_url,
        },
      };

      // set semester the project was created: ssXX or wsXX
      if (!doc.exists) {
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
          mediaType: {
            format: 'html',
          },
          headers: {
            'If-Modified-Since': updatedAt?.toUTCString(),
          },
        });

        const $ = cheerio.load(readme.data as unknown as string);
        project.title =
          $('h1, h2, h3, h4, h5, h6').first().text().trim() || fork.name;
        project.summary = fork.description ?? 'An awesome MADE project.';
      } catch (err) {
        if (
          !err ||
          typeof err !== 'object' ||
          !('status' in err) ||
          err.status !== 304
        ) {
          console.error(err);
          project.title = fork.name;
          project.summary = fork.description ?? 'An awesome MADE project.';
        }
      }

      try {
        // fetch project directory
        const files = await octokit.rest.repos.getContent({
          owner: fork.owner.login,
          repo: fork.name,
          path: 'project',
          headers: {
            'If-Modified-Since': updatedAt?.toUTCString(),
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
        if (
          !err ||
          typeof err !== 'object' ||
          !('status' in err) ||
          err.status !== 304
        ) {
          console.error(err);
        }
      }

      if (doc.exists) {
        t.update(docRef, {
          ...project,
          updatedAt: FieldValue.serverTimestamp(),
        });
        return { id: docRef.id, result: 'updated' };
      }

      t.set(docRef, { ...project, createdAt: FieldValue.serverTimestamp() });
      return { id: docRef.id, result: 'created' };
    });

    statuses.push(result);
  }

  return statuses;
};
