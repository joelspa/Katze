// Configuración de Firebase
// Setup de Firebase para almacenamiento de imágenes y Firestore database

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Configuración del proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCLQKRTdZ6cSC0juOaY5zjwDhP9d-Cc5wQ",
    authDomain: "katze-app.firebaseapp.com",
    projectId: "katze-app",
    storageBucket: "katze-app.firebasestorage.app",
    messagingSenderId: "716332773584",
    appId: "1:716332773584:web:b08d8fca3d7821a3c8de92"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta el servicio de storage para subir imágenes
export const storage = getStorage(app);

// Exporta el servicio de Firestore para registros de aplicaciones
export const db = getFirestore(app);
