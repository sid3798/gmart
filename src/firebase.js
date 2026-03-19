import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your config (keep as it is)
const firebaseConfig = {
  apiKey: "AIzaSyAXJgvNiepws0CUuoYgMMH-h02WmbgQk28",
  authDomain: "khata-assistant-b38bf.firebaseapp.com",
  projectId: "khata-assistant-b38bf",
  storageBucket: "khata-assistant-b38bf.firebasestorage.app",
  messagingSenderId: "215231664114",
  appId: "1:215231664114:web:e4ef47ed553feeb5cb656b",
  measurementId: "G-KPSKZX9MSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 👉 Firestore DB
export const db = getFirestore(app);    