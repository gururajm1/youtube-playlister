// utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCJ0sCDP2X_MgSj3AMGClvHTa-4H17qYzg",
  authDomain: "playlister-6de50.firebaseapp.com",
  projectId: "playlister-6de50",
  storageBucket: "playlister-6de50.appspot.com",
  messagingSenderId: "540035027317",
  appId: "1:540035027317:web:232782405c0939982a033c",
  measurementId: "G-4WDS5TEGC5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
