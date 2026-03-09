/* ????? ? ?? */
const SHELL_QUERY_KEY = 'shell';
const SHELL_STORAGE_KEY = 'jeju:mypage-shell';
const SHELLS = new Set(['main', 'stay', 'air']);
const APP_ROOT = new URL('../../', import.meta.url).href;
const DRAWER_ACTION = 'OPEN_RESERVATION_DRAWER';

let commonBindingsReady = false;
let mountedShell = null;

const headerHost = document.getElementById('mypage-shell-header');
const footerHost = document.getElementById('mypage-shell-footer');

const toAbsoluteUrl = (path) => new URL(path, APP_ROOT).href;

const loadText = async (path) => {
  const response = await fetch(toAbsoluteUrl(path));
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.text();
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const absoluteSrc = /^[a-z]+:/i.test(src) ? src : toAbsoluteUrl(src);
    const alreadyLoaded = Array.from(document.scripts).some((script) => {
      const currentSrc = script.getAttribute('src') || script.src;
      return currentSrc === absoluteSrc;
    });

    if (alreadyLoaded) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = absoluteSrc;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const loadStyle = (href) => {
  const absoluteHref = /^[a-z]+:/i.test(href) ? href : toAbsoluteUrl(href);
  const alreadyLoaded = Array.from(document.styleSheets).some((sheet) => sheet.href === absoluteHref);
  if (alreadyLoaded) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = absoluteHref;
  document.head.appendChild(link);
};

const setDocumentBase = (shell) => {
  let baseElement = document.getElementById('mypage-shell-base');
  if (shell === 'air') {
    if (!baseElement) {
      baseElement = document.createElement('base');
      baseElement.id = 'mypage-shell-base';
      document.head.prepend(baseElement);
    }
    baseElement.href = toAbsoluteUrl('jejuair/');
    document.body.classList.add('jejuair-main-content');
    return;
  }

  if (baseElement) {
    baseElement.remove();
  }
  document.body.classList.remove('jejuair-main-content');
};

const resolveShellFromReferrer = () => {
  if (!document.referrer) {
    return null;
  }

  try {
    const referrerUrl = new URL(document.referrer);
    const pathname = referrerUrl.pathname.toLowerCase();

    if (pathname.includes('/jejuair/')) {
      return 'air';
    }

    if (pathname.includes('/jejustay/')) {
      return 'stay';
    }

    if (pathname.endsWith('/index.html') || pathname === '/' || pathname.includes('/front/index.html')) {
      return 'main';
    }
  } catch (error) {
    return null;
  }

  return null;
};

const resolveShell = () => {
  const params = new URLSearchParams(window.location.search);
  const queryShell = params.get(SHELL_QUERY_KEY);
  if (SHELLS.has(queryShell)) {
    return queryShell;
  }

  const referrerShell = resolveShellFromReferrer();
  if (referrerShell) {
    return referrerShell;
  }

  const storedShell = window.sessionStorage.getItem(SHELL_STORAGE_KEY);
  if (SHELLS.has(storedShell)) {
    return storedShell;
  }

  return 'main';
};

const persistShell = (shell) => {
  window.sessionStorage.setItem(SHELL_STORAGE_KEY, shell);
  document.body.dataset.mypageShell = shell;
};

const initCommonBindings = async () => {
  if (commonBindingsReady) {
    return;
  }

  commonBindingsReady = true;

  const { initRouterBinder } = await import('../../core/utils/router_binder.js');
  initRouterBinder();

  document.body.addEventListener('click', async (event) => {
    const actionElement = event.target.closest(`[data-action="${DRAWER_ACTION}"]`);
    if (!actionElement) {
      return;
    }

    event.preventDefault();

    try {
      const { reservationDrawer } = await import('../../components/ui/reservation_drawer/drawer.js');
      reservationDrawer.open();
    } catch (error) {
      console.error('[MyPageShell] Drawer open failed:', error);
    }
  });
};

const dispatchShellEvents = () => {
  document.dispatchEvent(new Event('mainHeaderLoaded'));
  document.dispatchEvent(new Event('mainFooterLoaded'));
};

const renderMainShell = async () => {
  const [headerHtml, footerHtml] = await Promise.all([
    loadText('components/layout/header/main_header.html'),
    loadText('components/layout/footer/main_footer.html')
  ]);

  headerHost.innerHTML = headerHtml.replace(/\{BASE_PATH\}/g, APP_ROOT);
  footerHost.innerHTML = footerHtml.replace(/\{BASE_PATH\}/g, APP_ROOT);

  await Promise.all([
    loadScript('components/layout/header/header.js'),
    loadScript('components/layout/mega_menu/mega-menu.js'),
    loadScript('components/layout/footer/footer.js')
  ]);

  if (typeof window.initHeader === 'function') {
    window.initHeader();
  }
  if (typeof window.initFooter === 'function') {
    window.initFooter();
  }
};

const renderStayShell = async () => {
  const [headerHtml, footerHtml] = await Promise.all([
    loadText('components/layout/header/header.html'),
    loadText('components/layout/footer/footer.html')
  ]);

  headerHost.innerHTML = headerHtml.replace(/\{BASE_PATH\}/g, APP_ROOT);
  footerHost.innerHTML = footerHtml.replace(/\{BASE_PATH\}/g, APP_ROOT);

  await Promise.all([
    loadScript('components/layout/header/header.js'),
    loadScript('components/layout/mega_menu/mega-menu.js'),
    loadScript('components/layout/footer/footer.js')
  ]);

  if (typeof window.initHeader === 'function') {
    window.initHeader();
  }
  if (typeof window.initMegaMenu === 'function') {
    window.initMegaMenu();
  }
  if (typeof window.initFooter === 'function') {
    window.initFooter();
  }
};

const renderAirShell = async () => {
  loadStyle('jejuair/css/main.css');
  headerHost.innerHTML = '<header id="header_wrap"></header>';
  footerHost.innerHTML = '<footer id="footer_wrap"></footer>';

  await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
  await loadScript('jejuair/js/header.js');
  await loadScript('jejuair/js/footer.js');
};

export const mountMyPageShell = async () => {
  if (!headerHost || !footerHost) {
    return 'main';
  }

  const shell = resolveShell();
  persistShell(shell);
  setDocumentBase(shell);
  await initCommonBindings();

  if (mountedShell === shell && headerHost.childElementCount > 0 && footerHost.childElementCount > 0) {
    dispatchShellEvents();
    return shell;
  }

  if (shell === 'air') {
    await renderAirShell();
    await new Promise((resolve) => window.setTimeout(resolve, 40));
  } else if (shell === 'stay') {
    await renderStayShell();
  } else {
    await renderMainShell();
  }

  mountedShell = shell;
  dispatchShellEvents();
  return shell;
};
