import { initializeApp, getApps, getApp  } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, GithubAuthProvider, 
  signInWithPopup, signOut, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDm2uFWikGKRA_hg1E2h07xTLytWnPd0tE",
  authDomain: "poverty-line-5ed46.firebaseapp.com",
  projectId: "poverty-line-5ed46",
  storageBucket: "poverty-line-5ed46.firebasestorage.app",
  messagingSenderId: "529215531106",
  appId: "1:529215531106:web:85968f7b5a4a1a4eb3893b",
  measurementId: "G-V6N9PXQXNB"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign-Up Error:", error.message);
    return null;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    return null;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    return null;
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    console.error("GitHub Sign-In Error:", error.message);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

export { app, auth, analytics, googleProvider, githubProvider };
