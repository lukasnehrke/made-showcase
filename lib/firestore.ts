import { Firestore } from '@google-cloud/firestore';

export const firestore = new Firestore({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials:
    process.env.NODE_ENV === 'production'
      ? {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY,
        }
      : undefined,
});
