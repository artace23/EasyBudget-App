import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM5jqi79REMCfI2s3cYBqY6lLRdPz6dik",
  authDomain: "easybudget-app.firebaseapp.com",
  projectId: "easybudget-app",
  storageBucket: "easybudget-app.firebasestorage.app",
  messagingSenderId: "254138761596",
  appId: "1:254138761596:web:ebd2a5f8a55c2610e2a4f9",
  measurementId: "G-Y8SW1GSS3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;