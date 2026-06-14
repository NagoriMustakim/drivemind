/**
 * Otto widget entry. Reads config from the <script> tag and mounts the Panel
 * into an ISOLATED container so it never clashes with the host page
 * (Constitution V): a SHADOW DOM root by default, or an IFRAME when the embed
 * sets data-mode="iframe" (T055). All UI lives in panel.tsx.
 *
 *   <script src="https://<chatbot-host>/otto.js"
 *           data-dealer-id="nextgear" data-api="https://<chatbot-host>/api"
 *           data-mode="shadow"  <!-- or "iframe" --> async></script>
 */
import { render } from "preact";
import { Panel, type Config } from "./panel";
import { STYLES } from "./styles";

function readConfig(): (Config & { mode: "shadow" | "iframe" }) | null {
  const script =
    (document.currentScript as HTMLScriptElement | null) ??
    document.querySelector<HTMLScriptElement>("script[data-dealer-id]");
  const dealerId = script?.dataset.dealerId;
  const apiBase = (script?.dataset.api ?? "").replace(/\/$/, "");
  const mode = script?.dataset.mode === "iframe" ? "iframe" : "shadow";
  if (!dealerId) {
    console.warn("[otto] missing data-dealer-id; widget not mounted");
    return null;
  }
  return { dealerId, apiBase, mode };
}

function mountShadow(config: Config): void {
  const host = document.createElement("div");
  host.id = "drivemind-otto-root";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = STYLES;
  shadow.appendChild(style);
  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);
  render(<Panel config={config} />, mountPoint);
}

function mountIframe(config: Config): void {
  // Stronger isolation: render the panel inside an iframe document.
  const frame = document.createElement("iframe");
  frame.id = "drivemind-otto-frame";
  frame.setAttribute("title", "Otto car assistant");
  Object.assign(frame.style, {
    position: "fixed",
    bottom: "0",
    right: "0",
    width: "420px",
    height: "640px",
    maxWidth: "100vw",
    border: "none",
    background: "transparent",
    zIndex: "2147483000",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    mountShadow(config); // fallback if the iframe document is unavailable
    return;
  }
  const style = doc.createElement("style");
  style.textContent = `html,body{margin:0;background:transparent}` + STYLES;
  doc.head.appendChild(style);
  const mountPoint = doc.createElement("div");
  doc.body.appendChild(mountPoint);
  render(<Panel config={config} />, mountPoint);
}

const cfg = readConfig();
if (cfg) {
  if (cfg.mode === "iframe") mountIframe(cfg);
  else mountShadow(cfg);
}
