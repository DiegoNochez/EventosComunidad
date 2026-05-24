import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTcg49kLOWU0DOUwZI1DWbncvYT5BgpmU",
  authDomain: "eventoscomunidad.firebaseapp.com",
  projectId: "eventoscomunidad",
  storageBucket: "eventoscomunidad.firebasestorage.app",
  messagingSenderId: "681034346465",
  appId: "1:681034346465:web:31d488a7143e6fa9dbeca0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);