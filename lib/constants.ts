import type { Project } from '@/lib/schema';

export const baseUrl = 'https://made-showcase.vercel.app';

export const madeTemplateRepository = {
  owner: 'jvalue',
  repo: 'made-template',
};

export const semesters = ['ss23', 'ws23', 'ss24'];

export const ignoredReadmeHashes = [
  'c3f139485c56deb74b26a8f5388759401f1a78c1',
  '234fed9f530a7bb4cc19822e430195d636e638db',
];

// prettier-ignore
export const overrides: Record<string, Partial<Project>> = {
  // https://oss.cs.fau.de/2023/10/04/made-ss23-project-electromobility-and-charging-infrastructure-in-germany/
  'nmarkert/electromobility': {
    title: 'Electromobility and Charging Infrastructure in Germany',
    summary: 'The aim of this project is to investigate if there is a relationship between the charging point infrastructure and electromobility in Germany.',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/09/madess23_markert-480x320.jpg',
  },
  // https://oss.cs.fau.de/2023/10/04/made-ss23-project-correlation-between-rates-of-accidents-in-germany-and-munster-with-respect-to-bicycle-count-in-munster/
  'thesagni/2023-AMSE-Sagni': {
    title: 'Correlation between rates of accidents in Germany and Münster with respect to bicycle count in Münster',
    summary: 'Münster, a city in North Rhine-Westphalia, is the home to an estimated 500,000 bicycles. It is famous for its bike-friendly streets and is hence popularly known as the “Bicycle capital of Germany”.',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/08/majumdar-MADE-SS23-463x320.jpg',
  },
};
