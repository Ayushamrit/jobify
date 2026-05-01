// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// REPLACE THE VALUES BELOW WITH YOUR OWN FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyD-dRn_0HqubjAxTPqM-utiCja6CKnDJ0k",
  authDomain: "jobify-b920c.firebaseapp.com",
  projectId: "jobify-b920c",
  storageBucket: "jobify-b920c.firebasestorage.app",
  messagingSenderId: "1092497859409",
  appId: "1:1092497859409:web:9acb9f5f567d2c0d99a970",
  measurementId: "G-2J8LHBTYQB"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);



