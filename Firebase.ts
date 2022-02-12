// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUe_1inybfDgVhEZDOS5dtDPyTu6Iy4xk",
  authDomain: "travelsafe-51072.firebaseapp.com",
  projectId: "travelsafe-51072",
  storageBucket: "travelsafe-51072.appspot.com",
  messagingSenderId: "773447634710",
  appId: "1:773447634710:web:28c3d10ca58a7015110a37",
  measurementId: "G-PY0XZR9HXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, 'localhost:9099');
connectStorageEmulator(storage, 'localhost', 9199);

export default app;

export { db, auth, storage };