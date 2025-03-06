// src/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

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
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google Login Success:", result.user);
    await sendUserToBackend(result.user);
  } catch (error) {
    console.error("Google Login Error:", error.message);
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("GitHub Login Success:", result.user);
    await sendUserToBackend(result.user);
  } catch (error) {
    console.error("GitHub Login Error:", error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out from Firebase");
  } catch (error) {
    console.error("Firebase logout error:", error.message);
  }
};

async function sendUserToBackend(user) {
  try {
    const token = await user.getIdToken();
    const response = await fetch("http://127.0.0.1:5000/social-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    if (data.user_id) {
      console.log("User successfully logged in with backend:", data);
    }
  } catch (error) {
    console.error("Error sending user data to backend:", error);
  }
}

export const listenForAuthChanges = (setUser) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await sendUserToBackend(user);
      setUser({ email: user.email, uid: user.uid });
    } else {
      setUser(null);
    }
  });
};
