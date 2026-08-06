import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { wallpaperUrl } from "./data/serviceImages.js";
import "./index.css";

document.documentElement.style.setProperty(
  "--wallpaper-image",
  `url(${wallpaperUrl()})`,
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
