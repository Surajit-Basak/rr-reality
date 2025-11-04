'use server';
import { initializeApp, getApp, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { firebaseConfig } from './config';

// The 'firebase-admin' admin SDK is initialized without credentials.
// It discovers credentials automatically from the environment when deployed on Google Cloud.
const app = !getApps().length
  ? initializeApp({
      storageBucket: firebaseConfig.storageBucket,
    })
  : getApp();

const storage = getStorage(app);

export { app, storage };
