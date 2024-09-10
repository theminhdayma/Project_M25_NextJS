// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VITE_KEY_FIREBASE,
  authDomain: "projectm25nextjs.firebaseapp.com",
  projectId: "projectm25nextjs",
  storageBucket: "projectm25nextjs.appspot.com",
  messagingSenderId: "204514569916",
  appId: "1:204514569916:web:3183629a7ac439b5ae6ab9",
  measurementId: "G-YYJY7TXDDF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
