import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Root element with id 'root' not found.");
}

