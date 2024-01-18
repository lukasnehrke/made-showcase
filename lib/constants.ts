import type { Project } from '@/data/projects';

export const madeTemplateRepository = {
  owner: 'jvalue',
  repo: 'made-template',
};

// prettier-ignore
export const overrides: Record<string, Partial<Project>> = {
  'nmarkert/electromobility': {
    featured: true,
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/09/madess23_markert-480x320.jpg',
  },
  'thesagni/2023-AMSE-Sagni': {
    featured: true,
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/08/majumdar-MADE-SS23-463x320.jpg',
  },
};
