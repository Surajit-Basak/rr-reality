'use server';
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { firebaseConfig } from './config';

// It's generally safe to directly use service account JSON here if the environment
// is secure (e.g., server-side, not exposed to the client).
// However, using environment variables is a best practice.
// For this context, we will assume service account keys are managed securely.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined; // Or provide a fallback for local dev if needed

const app = !getApps().length
  ? initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
      storageBucket: firebaseConfig.storageBucket,
    })
  : getApp();

const storage = getStorage(app);

export { app, storage };
