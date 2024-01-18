'use server';

import { unstable_cache as cache } from 'next/cache';
import type { Timestamp } from '@google-cloud/firestore';
import { firestore } from '@/lib/firestore';

export interface Project {
  id: string;
  semester: string;
  featured: boolean;
  title: string;
  summary: string;
  repositoryUrl: string;
  reportUrl?: string;
  presentationUrl?: string;
  bannerUrl?: string;
  starsUrl: string;
  starsCount: number;
  updatedAt: string;
  owner: {
    id: number;
    name?: string;
    username: string;
    url: string;
    avatarUrl: string;
  };
}

export const getProjects = cache(
  async ({
    semester,
    query,
    cursor,
  }: {
    semester: string;
    query?: string;
    cursor?: string;
  }): Promise<Project[]> => {
    console.log('fetching projects', semester, query, cursor);

    let firestoreQuery = firestore
      .collection('projects')
      .where('semester', '==', semester)
      .orderBy('featured', 'desc')
      .orderBy('starsCount', 'desc')
      .limit(25);

    if (cursor) {
      const cursorDoc = await firestore
        .collection('projects')
        .doc(cursor)
        .get();
      firestoreQuery = firestoreQuery.startAfter(cursorDoc);
    }

    return firestoreQuery.get().then(({ docs }) => {
      return docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
            updatedAt: (doc.get('updatedAt') as Timestamp | undefined)
              ?.toDate()
              .toISOString(),
          }) as Project,
      );
    });
  },
);
