import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { reportWebVitals } from "./lib/vitals";

// Root elementini al ve uygulamayı render et
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Web Vitals ölçümlerini başlat
reportWebVitals();
