import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, GithubAuthProvider, 
  signInWithPopup, getRedirectResult, signOut, onAuthStateChanged 
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

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

/** 🔹 Handle Redirect Authentication (Google & GitHub) */
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
    const result = await signInWithPopup(auth, googleProvider);

    // ✅ Ensure user exists before getting ID token
    if (!result.user) {
      throw new Error("User authentication failed: No user returned from Firebase.");
    }

    const idToken = await result.user.getIdToken();
    
    if (!idToken) {
      throw new Error("No Firebase ID token received");
    }

    console.log("Google Sign-In: ID Token:", idToken);
    return { user: result.user, idToken };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};



export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);

    // ✅ Ensure user exists before getting ID token
    if (!result.user) {
      throw new Error("User authentication failed: No user returned from Firebase.");
    }

    const idToken = await result.user.getIdToken();
    
    if (!idToken) {
      throw new Error("No Firebase ID token received");
    }

    console.log("GitHub Sign-In: ID Token:", idToken);

    const response = await fetch("http://127.0.0.1:5000/social_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await response.json();
    console.log("GitHub Auth Response:", data);
  } catch (error) {
    console.error("GitHub Sign-In Error:", error);
  }
};


/** 🔹 Logout */
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out from Firebase");
  } catch (error) {
    console.error("Firebase logout error:", error);
  }
};

async function sendUserToBackend(user, setUser) {
  try {
    const token = await user.getIdToken();
    
    console.log("Sending request with token:", token);

    const response = await fetch("http://127.0.0.1:5000/social_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  // ✅ Ensure this is set
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        username: user.displayName || user.email.split("@")[0],
        uid: user.uid,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Backend Response:", data);

    if (!data.user_id) {
      console.error("Backend did not return a valid user_id!");
    }

    setUser && setUser({ ...user, user_id: data.user_id });
    return { ...user, user_id: data.user_id };
  } catch (error) {
    console.error("Error sending user data to backend:", error);
  }
}




export const listenForAuthChanges = (setUser) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User state changed:", user);
      const backendUser = await sendUserToBackend(user, setUser);
      setUser(backendUser);  // Ensure state updates correctly
    } else {
      setUser(null);
    }
  });
};

