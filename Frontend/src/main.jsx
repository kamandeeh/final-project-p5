import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import "bootstrap-icons/font/bootstrap-icons.css";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
 
 <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>

  </React.StrictMode>
);
