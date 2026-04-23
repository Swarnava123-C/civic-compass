import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./utils/analytics";

// Initialize GA4 analytics (consent-safe, no-op if unconfigured)
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
