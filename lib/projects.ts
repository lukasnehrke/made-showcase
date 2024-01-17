'use server';

import * as cheerio from 'cheerio';
import { octokit } from '@/lib/octokit';

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  report?: string;
  presentation?: string;
  image?: string;
  stars: number;
  owner: {
    name?: string;
    username: string;
    avatar: string;
    url: string;
  };
}

type ProjectOverrides = Record<string, Partial<Project>>;

const overrides: ProjectOverrides = {
  'nmarkert/electromobility': {
    image:
      'https://oss.cs.fau.de/wp-content/uploads/2023/09/madess23_markert-480x320.jpg',
  },
  'thesagni/2023-AMSE-Sagni': {
    image:
      'https://oss.cs.fau.de/wp-content/uploads/2023/08/majumdar-MADE-SS23-463x320.jpg',
  },
};

const getTemplateForks = async (page: number) => {
  // eslint-disable-next-line no-console -- allowed
  console.log('getTemplateForks', page);

  const template = { owner: 'jvalue', repo: 'made-template' };
  return octokit.rest.repos
    .listForks({ ...template, page, per_page: 30, sort: 'stargazers' })
    .then((res) => {
      return res.data;
    });
};

export const getProjects = async (): Promise<Project[]> => {
  const forks = (await getTemplateForks(1)).filter(
    (fork) =>
      fork.visibility === 'public' && !fork.disabled && !fork.is_template,
  );

  const projects = [];
  for await (const fork of forks) {
    const project: Project = {
      id: String(fork.id),
      title: fork.name,
      description: fork.description ?? 'An awesome MADE project.',
      url: fork.html_url,
      stars: fork.stargazers_count ?? 0,
      owner: {
        username: fork.owner.login,
        avatar: fork.owner.avatar_url,
        url: fork.owner.html_url,
      },
    };

    // fetch real name of the owner
    const res = await octokit.rest.users.getByUsername({
      username: fork.owner.login,
    });
    project.owner.name = res.data.name ?? undefined;

    // fetch project directory
    const files = await octokit.rest.repos.getContent({
      owner: fork.owner.login,
      repo: fork.name,
      path: 'project',
    });

    if (Array.isArray(files.data)) {
      files.data.forEach((file) => {
        // update link to the final report
        if (file.name.startsWith('report')) {
          if (file.name.endsWith('.pdf') && file.download_url) {
            project.report = file.download_url;
          } else if (file.html_url) {
            project.report = file.html_url;
          }
        }

        // update link to the final presentation
        if (file.name.startsWith('presentation-video')) {
          if (
            (file.name.endsWith('.mp4') || file.name.endsWith('.mov')) &&
            file.download_url
          ) {
            project.presentation = file.download_url;
          } else if (file.html_url) {
            project.presentation = file.html_url;
          }
        }
      });
    }

    // fetch html readme
    const readme = await octokit.rest.repos.getContent({
      owner: fork.owner.login,
      repo: fork.name,
      path: 'README.md',
      mediaType: {
        format: 'html',
      },
    });

    if (!Array.isArray(readme.data)) {
      const $ = cheerio.load(readme.data as unknown as string);
      project.title = $('h1, h2, h3, h4, h5, h6').first().text();
    }

    // handle overrides
    if (`${fork.owner.login}/${fork.name}` in overrides) {
      Object.assign(project, overrides[`${fork.owner.login}/${fork.name}`]);
    }

    projects.push(project);
  }

  return projects;
};
