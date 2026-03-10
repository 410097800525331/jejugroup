(function () {
  const currentScript = document.currentScript;
  const scriptSrc = currentScript instanceof HTMLScriptElement ? currentScript.src : window.location.href;
  const runtimeUrl = new URL("../../../runtime/shell-runtime.js", scriptSrc).href;

  const run = async () => {
    const runtime = await import(runtimeUrl);
    runtime.setupLegacyFabRuntime();
  };

  const safeRun = () => {
    run().catch((error) => {
      console.error("[FAB Adapter] failed", error);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      safeRun();
    });
  } else {
    safeRun();
  }
})();
