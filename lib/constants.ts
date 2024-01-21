import type { Project } from '@/lib/schema';

export const baseUrl = 'https://made-showcase.vercel.app';

export const madeTemplateRepository = {
  owner: 'jvalue',
  repo: 'made-template',
};

export const semesters = ['ss23', 'ws23'];

// prettier-ignore
export const overrides: Record<string, Partial<Project>> = {
  'nmarkert/electromobility': {
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/09/madess23_markert-480x320.jpg',
  },
  'thesagni/2023-AMSE-Sagni': {
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/08/majumdar-MADE-SS23-463x320.jpg',
  },
};
