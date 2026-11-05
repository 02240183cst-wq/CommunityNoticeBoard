import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDuYZhy3xx1GnRvv6AEVVzb1XON9tVrW8k",
  authDomain: 'community-notice-board-196e4.firebaseapp.com',
  projectId: 'community-notice-board-196e4',
  storageBucket: 'community-notice-board-196e4.appspot.com',
  messagingSenderId: "71888410582",
  appId: "1:71888410582:web:4af52589bf152362707677",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };