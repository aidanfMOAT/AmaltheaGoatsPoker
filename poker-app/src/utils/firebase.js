import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA9pnrbOtrEMIstFNdf9sry7K863YtYNH0",
  authDomain: "amalthea-goats-poker.firebaseapp.com",
  databaseURL: "https://amalthea-goats-poker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "amalthea-goats-poker",
  storageBucket: "amalthea-goats-poker.firebasestorage.app",
  messagingSenderId: "1054419553129",
  appId: "1:1054419553129:web:737704e3e78438987e8bf8",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, onValue };
