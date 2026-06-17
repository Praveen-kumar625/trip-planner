import admin from 'firebase-admin';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

if (!admin.apps.length) {
  try {
    if (env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines if passed through env vars
          privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      logger.info('Firebase Admin Initialized (with service account)');
    } else {
      admin.initializeApp();
      logger.info('Firebase Admin Initialized (default)');
    }
  } catch (error) {
    logger.error('Firebase Admin Initialization Error:', error);
  }
}

export const firestore = admin.firestore();
export const auth = admin.auth();
