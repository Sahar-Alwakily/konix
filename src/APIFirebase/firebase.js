import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function firebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId);
}

let database;

export function getFirebaseDatabase() {
  if (!firebaseConfigured()) return null;
  if (!database) database = getDatabase(initializeApp(firebaseConfig));
  return database;
}

/** Realtime Database paths the dummy layer mirrors. Swap reads in StoreContext when the keys exist. */
export const paths = {
  root: 'kunix',
  settings: 'kunix/settings',
  products: 'kunix/products',
  invoices: 'kunix/invoices',
  staff: 'kunix/staff',
  moves: 'kunix/stockMoves',
  cash: 'kunix/cashMoves',
  attendance: 'kunix/attendance',
};
