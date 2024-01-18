'use server';

import { unstable_cache as cache } from 'next/cache';
import { firestore } from '@/lib/firestore';

export interface Project {
  id: string;
  semester: string;
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

export const getProjects = cache(
  async (semester: string): Promise<Project[]> => {
    // eslint-disable-next-line no-console -- logging
    console.log('fetching projects again');

    const projects: Project[] = [];

    const query = await firestore
      .collection('projects')
      .where('semester', '==', semester)
      .get();

    query.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });

    return projects;
  },
  ['projects'],
);
