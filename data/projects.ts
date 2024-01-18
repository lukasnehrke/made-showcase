'use server';

import { unstable_cache as cache } from 'next/cache';
import { firestore } from '@/lib/firestore';

export interface Project {
  id: string;
  title: string;
  summary: string;
  repositoryUrl: string;
  reportUrl?: string;
  presentationUrl?: string;
  bannerUrl?: string;
  starsUrl: string;
  starsCount: number;
  owner: {
    name?: string;
    username: string;
    url: string;
    avatarUrl: string;
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  // eslint-disable-next-line no-console -- logging
  console.log('fetching projects again');

  const projects = [];

  const docs = await firestore.collection('projects').listDocuments();
  for await (const doc of docs) {
    const snapshot = await doc.get();
    projects.push({ id: doc.id, ...snapshot.data() } as Project);
  }

  return projects;
}, ['projects']);