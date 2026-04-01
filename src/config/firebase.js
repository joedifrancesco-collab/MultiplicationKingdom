import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project config
// Get this from Firebase Console → Project Settings → Web App Config

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDBQg-OUAMA5IE6GqAvMkZ3bUFr1L5cPE",
  authDomain: "multiplication-kingdom-e8c53.firebaseapp.com",
  projectId: "multiplication-kingdom-e8c53",
  storageBucket: "multiplication-kingdom-e8c53.firebasestorage.app",
  messagingSenderId: "21184528155",
  appId: "1:21184528155:web:eff9acb075a4ff2cce9dbe",
  measurementId: "G-EBYCK4Y68Y"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
