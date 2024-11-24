import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DarkModeContextProvider } from "./Contexts/DarkModeContext.jsx";
import { UserContextProvider } from "./Contexts/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </DarkModeContextProvider>
  </StrictMode>
);
