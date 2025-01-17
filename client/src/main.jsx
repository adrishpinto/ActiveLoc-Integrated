import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="867952167780-bthenig6n01et3k74sk2a4o3jvmi43nl.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
