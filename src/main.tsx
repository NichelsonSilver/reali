import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY no está configurada");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: "#14b8a6",
          colorBackground: "#030712",
          colorText: "#f3f4f6",
          colorInputBackground: "#111827",
          colorInputText: "#f3f4f6",
        },
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
