import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBsk1vT_osPsSeus0TeSuuc4Y-BPOpOBjQ",
  authDomain: "bao-gia-hung-decor.firebaseapp.com",
  projectId: "bao-gia-hung-decor",
  storageBucket: "bao-gia-hung-decor.firebasestorage.app",
  messagingSenderId: "192103262486",
  appId: "1:192103262486:web:bd06887b6df3fb64020837"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
