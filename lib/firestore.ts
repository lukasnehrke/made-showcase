import { Firestore } from '@google-cloud/firestore';

export const firestore = new Firestore({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: process.env.GOOGLE_CREDENTIALS
    ? (JSON.parse(atob(process.env.GOOGLE_CREDENTIALS)) as never)
    : undefined,
});
