// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAUe_1inybfDgVhEZDOS5dtDPyTu6Iy4xk",
    authDomain: "travelsafe-51072.firebaseapp.com",
    projectId: "travelsafe-51072",
    storageBucket: "travelsafe-51072.appspot.com",
    messagingSenderId: "773447634710",
    appId: "1:773447634710:web:28c3d10ca58a7015110a37",
    measurementId: "G-PY0XZR9HXF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app);
const storage = getStorage(app);

export default app;

export { db, auth, storage };
