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

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

// Setup auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async (setUser = null) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("✅ Google Auth Result:", result);
    await sendUserToBackend(result.user, setUser);
    return result.user;
  } catch (error) {
    console.error("Google login failed:", error);
    return null;
  }
};

export const signInWithGithub = async (setUser = null) => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("GitHub Login Success:", result.user);
    await sendUserToBackend(result.user, setUser);

    if (window.opener) {
      window.close();
    } else {
      console.warn("Window close blocked by COOP policy.");
    }
    
    return result.user;
  } catch (error) {
    console.error("GitHub Login Error:", error.message);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out from Firebase");
    return true;
  } catch (error) {
    console.error("Firebase logout error:", error.message);
    return false;
  }
};

export async function sendUserToBackend(user, setUser = null) {
  try {
    console.log("Sending user to backend:", user);

    if (!user) {
      console.error("No user provided to sendUserToBackend");
      return;
    }

    // Check if user has getIdToken method
    if (typeof user.getIdToken !== "function") {
      console.error("Invalid Firebase user object (No getIdToken method)", user);
      return;
    }

    const token = await user.getIdToken();
    console.log("Firebase ID Token generated successfully");

    const response = await fetch("http://127.0.0.1:5000/social_login", {
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
    console.log("✅ Backend Response:", data);

    if (!data.user_id) {
      console.error("Backend did not return a valid user_id!");
      return;
    }

    if (setUser && typeof setUser === "function") {
      setUser({
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
        user_id: data.user_id, 
      });
    }
    
    return data;
  } catch (error) {
    console.error("Error sending user data to backend:", error);
    return null;
  }
}

export const listenForAuthChanges = (setUser) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Firebase Auth State Changed:", user);
      await sendUserToBackend(user, setUser);
    } else {
      console.log("No user logged in.");
      if (setUser && typeof setUser === "function") {
        setUser(null);
      }
    }
  });
};