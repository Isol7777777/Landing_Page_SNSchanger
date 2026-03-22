import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { recordPageView } from "./lib/pageViews";
import "./styles/index.css";

// OS 설정(다크/라이트)에 따라 자동으로 다크모드를 적용합니다.
// (토글 버튼 없이 prefers-color-scheme을 기준으로 .dark 클래스를 토글)
function syncThemeWithSystem() {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (!mq) return;

  const apply = () => {
    root.classList.toggle("dark", mq.matches);
  };

  apply();
  // Safari 구버전 호환: addEventListener가 없을 수 있어 fallback 처리
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", apply);
    return;
  }
  mq.addListener(apply);
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  syncThemeWithSystem();
  void recordPageView();
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Root element with id 'root' not found.");
}

