import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, GithubAuthProvider, 
  signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged 
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDm2uFWikGKRA_hg1E2h07xTLytWnPd0tE",
  authDomain: "poverty-line-5ed46.firebaseapp.com",
  projectId: "poverty-line-5ed46",
  storageBucket: "poverty-line-5ed46.appspot.com",
  messagingSenderId: "529215531106",
  appId: "1:529215531106:web:85968f7b5a4a1a4eb3893b",
  measurementId: "G-V6N9PXQXNB"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


export const handleRedirectResult = async (setUser) => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("User after redirect:", result.user);
      await sendUserToBackend(result.user, setUser);
    }
  } catch (error) {
    console.error("Error handling redirect result:", error.message);
  }
};


export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
};

export const signInWithGithub = async () => {
  try {
    await signInWithRedirect(auth, githubProvider);
  } catch (error) {
    console.error("GitHub Sign-In Error:", error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out from Firebase");
  } catch (error) {
    console.error("Firebase logout error:", error);
  }
};



const sendUserToBackend = async (user, setUser) => {
  try {
    const token = await user.getIdToken();
    const response = await fetch("http://127.0.0.1:5000/social_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        uid: user.uid, 
        provider: user.providerData[0]?.providerId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send user data to backend");
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token); 
    setUser(data.user); 
  } catch (error) {
    console.error("Error sending user data to backend:", error.message);
  }
};


export const listenForAuthChanges = (setUser) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User state changed:", user);
      await sendUserToBackend(user, setUser); 
    } else {
      setUser(null);
    }
  });
};