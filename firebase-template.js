// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "ENV_VAR_API_KEY",
    authDomain: "ENV_VAR_AUTH_DOMAIN",
    projectId: "ENV_VAR_PROJECT_ID",
    storageBucket: "ENV_VAR_STORAGE_BUCKET",
    messagingSenderId: "ENV_VAR_MESSAGING_SENDER_ID",
    appId: "ENV_VAR_APP_ID",
    measurementId: "G-BLNLSKCY08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const storage = getStorage(app);

export default app;