import React from "react";
import { createRoot } from "react-dom/client";
import FABContainer from "@front-fab/FABContainer";

/**
 * 전역 배포용 부트스트래퍼
 * HTML 페이지에서 <div id="jeju-fab-root"></div> 를 찾아서 마운트함
 */
const mountFAB = () => {
  const rootId = "jeju-fab-root";
  let rootElement = document.getElementById(rootId);

  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = rootId;
    document.body.appendChild(rootElement);
  }

  const root = createRoot(rootElement);
  root.render(<FABContainer />);
};

// 즉시 실행
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountFAB);
  } else {
    mountFAB();
  }
}

export default mountFAB;
