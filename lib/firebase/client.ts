import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDmvDL_igo34DRsgS44y6XatuB0TC7oEVU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "website-b4855.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "website-b4855",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "website-b4855.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "50154934713",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:50154934713:web:e9941a76aeb982c6cb6668"
};

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

function ensureBrowserApp() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    return null;
  }

  if (!cachedApp) {
    cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return cachedApp;
}

export function getClientAuth() {
  if (cachedAuth) {
    return cachedAuth;
  }

  const app = ensureBrowserApp();
  if (!app) {
    return null;
  }

  cachedAuth = getAuth(app);
  return cachedAuth;
}

export function getClientDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const app = ensureBrowserApp();
  if (!app) {
    return null;
  }

  cachedDb = getFirestore(app);
  return cachedDb;
}

export function getClientStorage() {
  if (cachedStorage) {
    return cachedStorage;
  }

  const app = ensureBrowserApp();
  if (!app) {
    return null;
  }

  cachedStorage = getStorage(app);
  return cachedStorage;
}
