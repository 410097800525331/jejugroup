(function () {
  const currentScript = document.currentScript;
  const scriptSrc = currentScript instanceof HTMLScriptElement ? currentScript.src : window.location.href;
  const runtimeUrl = new URL("../runtime/shell-runtime.js", scriptSrc).href;

  const run = async () => {
    const runtime = await import(runtimeUrl);
    runtime.installLegacyGlobals();
    window.JJRangeCalendar = {
      createRangeCalendar: (config) => runtime.createRangeCalendarRuntime(config)
    };
  };

  run().catch((error) => {
    console.error("[RangeCalendar Adapter] failed", error);
  });
})();
