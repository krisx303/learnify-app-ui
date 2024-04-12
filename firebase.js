// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0ODhnOsT5Pz4y05QFhDUnyms8v1a_1n8",
    authDomain: "brightpath-learnify.firebaseapp.com",
    projectId: "brightpath-learnify",
    storageBucket: "brightpath-learnify.appspot.com",
    messagingSenderId: "643661595188",
    appId: "1:643661595188:web:ac85ddc5124c7610390061",
    measurementId: "G-BLNLSKCY08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;