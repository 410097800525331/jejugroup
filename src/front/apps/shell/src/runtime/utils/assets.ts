export const loadScriptOnce = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const alreadyLoaded = Array.from(document.scripts).some((script) => {
      const rawSrc = script.getAttribute("src") || script.src;
      if (!rawSrc) {
        return false;
      }

      try {
        return new URL(rawSrc, window.location.href).href === src;
      } catch (_error) {
        return rawSrc === src;
      }
    });

    if (alreadyLoaded) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (event) => reject(event);
    document.body.appendChild(script);
  });
};

export const loadStyleOnce = (href: string) => {
  const alreadyLoaded = Array.from(document.styleSheets).some((sheet) => sheet.href === href);
  if (alreadyLoaded) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};
