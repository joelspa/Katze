// frontend/src/firebase.ts
import { initializeApp } from "firebase/app";
// 1. Quita 'getAnalytics' e importa 'getStorage'
import { getStorage } from "firebase/storage";

// ----------------------------------------------------------------
// TUS LLAVES (¡Están perfectas!)
// ----------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCLQKRTdZ6cSC0juOaY5zjwDhP9d-Cc5wQ",
    authDomain: "katze-app.firebaseapp.com",
    projectId: "katze-app",
    storageBucket: "katze-app.firebasestorage.app", // Corregí un typo, debe ser .app y no .appspot.com (¡Bien hecho!)
    messagingSenderId: "847252170771",
    appId: "1:847252170771:web:3276c8dc8973d5f00df7e6",
    measurementId: "G-9YF5MVQ1KP"
};
// ----------------------------------------------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Quita 'analytics' y exporta 'storage'
export const storage = getStorage(app);