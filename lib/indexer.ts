import type { Timestamp } from '@google-cloud/firestore';
import { FieldValue } from '@google-cloud/firestore';
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

export const updateProjects = async () => {
  const forks = await getTemplateForks(1);

  const statuses: Status[] = [];

  for await (const fork of forks) {
    const docRef = firestore.collection('projects').doc(String(fork.id));

    const result = await firestore.runTransaction(async (t) => {
      const doc = await t.get(docRef);

      const updatedAt: Date | undefined = doc.exists
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
        title: fork.name,
        summary: fork.description ?? 'An awesome MADE project.',
        repositoryUrl: fork.html_url,
        starsUrl: fork.stargazers_url,
        starsCount: fork.stargazers_count ?? 0,
        owner: {
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
        const year = createdAt.getFullYear() % 100;

        // ssXX starts in 1. April and ends in 30. September, wsXX starts in 1. October and ends in 31. March
        project.semester =
          createdAt.getMonth() < 9 && createdAt.getMonth() > 2
            ? `ss${year}`
            : `ws${year}`;
      }

      if (doc.exists) {
        t.update(docRef, { project, updatedAt: FieldValue.serverTimestamp() });
        return { id: docRef.id, result: 'updated' };
      }

      t.set(docRef, { ...project, createdAt: FieldValue.serverTimestamp() });
      return { id: docRef.id, result: 'created' };
    });

    statuses.push(result);
  }

  return statuses;
};
