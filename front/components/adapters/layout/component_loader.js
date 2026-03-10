(function () {
  const currentScript = document.currentScript;
  const scriptSrc = currentScript instanceof HTMLScriptElement ? currentScript.src : window.location.href;
  const runtimeUrl = new URL("../runtime/shell-runtime.js", scriptSrc).href;

  const run = async () => {
    try {
      const runtime = await import(runtimeUrl);
      await runtime.mountMainShellRuntime();
    } catch (error) {
      console.error("[Component Loader Adapter] failed", error);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      run().catch(() => {});
    });
  } else {
    run().catch(() => {});
  }
})();
