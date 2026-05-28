import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, type Auth, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, type Firestore, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, type FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "local-dev-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "localhost",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "local-ottwebshop",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "local-ottwebshop.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:local"
};

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;
let authEmulatorConnected = false;
let firestoreEmulatorConnected = false;
let storageEmulatorConnected = false;

const useLocalEmulator = process.env.NEXT_PUBLIC_USE_LOCAL_FIREBASE_EMULATOR === "true";

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
  if (useLocalEmulator && !authEmulatorConnected) {
    connectAuthEmulator(cachedAuth, "http://127.0.0.1:9099", { disableWarnings: true });
    authEmulatorConnected = true;
  }
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
  if (useLocalEmulator && !firestoreEmulatorConnected) {
    connectFirestoreEmulator(cachedDb, "127.0.0.1", 8080);
    firestoreEmulatorConnected = true;
  }
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
  if (useLocalEmulator && !storageEmulatorConnected) {
    connectStorageEmulator(cachedStorage, "127.0.0.1", 9199);
    storageEmulatorConnected = true;
  }
  return cachedStorage;
}
