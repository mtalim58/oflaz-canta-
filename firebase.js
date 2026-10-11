
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKcnkRkmg8bsgCOe3Oq-oUxH5dt4XjWvw",
  authDomain: "oflaz-canta.firebaseapp.com",
  projectId: "oflaz-canta",
  storageBucket: "oflaz-canta.firebasestorage.app",
  messagingSenderId: "961901026929",
  appId: "1:961901026929:web:dad8ae7c29e0d2429e85d0",
  measurementId: "G-N2PYGC940K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
