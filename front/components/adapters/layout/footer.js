(function () {
  const currentScript = document.currentScript;
  const scriptSrc = currentScript instanceof HTMLScriptElement ? currentScript.src : window.location.href;
  const runtimeUrl = new URL("../../runtime/shell-runtime.js", scriptSrc).href;

  const run = async () => {
    const runtime = await import(runtimeUrl);
    runtime.ensureFooterBehavior();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      run().catch((error) => {
        console.error("[Footer Adapter] failed", error);
      });
    });
  } else {
    run().catch((error) => {
      console.error("[Footer Adapter] failed", error);
    });
  }
})();
