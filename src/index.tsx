/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App";

// Desktop viewport hygiene: suppress native browser right-click context menu
if (typeof window !== "undefined") {
  window.addEventListener("contextmenu", (e) => {
    // Allow context menu only on native input elements if needed, otherwise block
    const target = e.target as HTMLElement | null;
    if (target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  });
}

render(() => <App />, document.getElementById("root") as HTMLElement);
