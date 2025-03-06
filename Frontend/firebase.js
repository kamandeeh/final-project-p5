// firebase.js (Frontend)
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
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
export const auth = getAuth(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    console.log("Google Login Success:", firebaseUser);

    if (firebaseUser && typeof firebaseUser.getIdToken === 'function') {
      await sendUserToBackend(firebaseUser);
    } else {
      console.error("Firebase User object does not have getIdToken method.");
    }
  } catch (error) {
    console.error("Google Login Error:", error.message);
  }
};


export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("GitHub Login Success:", result.user);
    await sendUserToBackend(result.user);

    if (window.opener) {
      window.close();
    } else {
      console.warn("Window close blocked by COOP policy.");
    }
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

async function sendUserToBackend(user, setUser) {
  try {
    if (!user || !user.getIdToken) {
      console.error("Invalid Firebase user object:", user);
      return;
    }

    const token = await user.getIdToken();
    console.log("Sending request with token:", token);

    const response = await fetch("https://final-project-p5.onrender.com/social_login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        uid: user.uid,
      }),
    });

    if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);

    const data = await response.json();
    console.log("Backend Response:", data);

    if (!data.user_id) {
      console.error("Backend did not return a valid user_id!");
      return;
    }

    if (setUser) {
      setUser({
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
        user_id: data.user_id, // ✅ Correctly store user_id, NOT uid
      });
    }
  } catch (error) {
    console.error("Error sending user data to backend:", error);
  }
}

export const listenForAuthChanges = (setUser) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Firebase Auth State Changed:", user);
      await sendUserToBackend(user, setUser);
    } else {
      console.log("No user logged in.");
      if (setUser) {
        setUser(null);
      }
    }
  });
};
