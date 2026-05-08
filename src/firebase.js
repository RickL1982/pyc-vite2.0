import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADLbw8dZYc-XazFMLe-HJxxoWSdpRsrV0",
  authDomain: "proteccion-cuidado-appweb.firebaseapp.com",
  projectId: "proteccion-cuidado-appweb",
  storageBucket: "proteccion-cuidado-appweb.firebasestorage.app",
  messagingSenderId: "211244597118",
  appId: "1:211244597118:web:9502bf38184ef4e522bd2f"
};

const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const auth = getAuth(app);
