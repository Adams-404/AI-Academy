import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCrEy1KN7KNR10nExgRFYRu71TyuIG03_Q",
  authDomain: "gdg-ai-academy.firebaseapp.com",
  projectId: "gdg-ai-academy",
  storageBucket: "gdg-ai-academy.firebasestorage.app",
  messagingSenderId: "52409287353",
  appId: "1:52409287353:web:7ae26884a556ee27bf1168",
  measurementId: "G-3PWS8K9SZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 