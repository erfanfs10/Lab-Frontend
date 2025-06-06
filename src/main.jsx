import { StrictMode } from "react";
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/toaster";
import { Provider } from "./components/ui/provider";
import App from "./App.jsx";
import "./index.css";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: "system-ui, sans-serif, Vazirimatn" },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <App />
      <Toaster />
    </Provider>
  </StrictMode>
);
