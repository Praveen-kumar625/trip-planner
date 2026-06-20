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

export const firestore = admin.apps.length ? admin.firestore() : new Proxy({}, {
  get(target, prop) {
    if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check FIREBASE_PRIVATE_KEY.");
    const fs = admin.firestore();
    const value = fs[prop];
    return typeof value === 'function' ? value.bind(fs) : value;
  }
});

export const auth = admin.apps.length ? admin.auth() : new Proxy({}, {
  get(target, prop) {
    if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check FIREBASE_PRIVATE_KEY.");
    const a = admin.auth();
    const value = a[prop];
    return typeof value === 'function' ? value.bind(a) : value;
  }
});

export const firebaseAdmin = admin;
