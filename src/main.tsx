import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./utils/analytics";
import { registerSW } from "virtual:pwa-register";

// Initialize GA4 analytics (consent-safe, no-op if unconfigured)
initAnalytics();

// Register PWA service worker
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);
