(function (root, factory) {
  var api = factory(root);

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root && !root.frontI18n) {
    root.frontI18n = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function (root) {
  var DEFAULT_LANG = "ko";
  var SUPPORTED_LANGS = { ko: true, en: true };
  var LANGUAGE_CHANGED_EVENT = "languageChanged";
  var FAB_LANGUAGE_CHANGED_EVENT = "fabLanguageChanged";
  var LANGUAGE_CHANGE_EVENT = "front:i18n-change";
  var STORAGE_KEYS = ["jeju_lang", "front.lang", "jeju_fab_lang"];
  var LANGUAGE_NAMESPACE = "frontI18n";
  var listeners = new Set();
  var cachedLangData = null;
  var cachedCopyMap = null;
  var nativeEventsBound = false;
  var suppressNativeEventNotify = 0;

  function normalizeLang(value) {
    if (typeof value !== "string") {
      return null;
    }

    var trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      return null;
    }

    if (trimmed.indexOf("en") === 0) {
      return "en";
    }

    if (trimmed.indexOf("ko") === 0) {
      return "ko";
    }

    return SUPPORTED_LANGS[trimmed] ? trimmed : null;
  }

  function getGlobalLangData(rootScope) {
    if (cachedLangData) {
      return cachedLangData;
    }

    if (typeof langData !== "undefined") {
      cachedLangData = langData;
      return cachedLangData;
    }

    if (rootScope && rootScope.langData) {
      cachedLangData = rootScope.langData;
      return cachedLangData;
    }

    if (typeof require === "function") {
      try {
        var requiredLangData = require("./lang_data.js");
        if (requiredLangData && requiredLangData.default && requiredLangData.default.ko) {
          cachedLangData = requiredLangData.default;
          return cachedLangData;
        }
        if (requiredLangData && requiredLangData.langData && requiredLangData.langData.ko) {
          cachedLangData = requiredLangData.langData;
          return cachedLangData;
        }
        if (requiredLangData && requiredLangData.ko) {
          cachedLangData = requiredLangData;
          return cachedLangData;
        }
      } catch (error) {
        // lang_data.js는 전역 로드가 우선이라 실패해도 조용히 넘긴다.
      }
    }

    return null;
  }

  function getFrontKoEnCopyMap(rootScope) {
    if (cachedCopyMap) {
      return cachedCopyMap;
    }

    if (rootScope && rootScope.frontKoEnCopyMap) {
      cachedCopyMap = rootScope.frontKoEnCopyMap;
      return cachedCopyMap;
    }

    if (typeof frontKoEnCopyMap !== "undefined") {
      cachedCopyMap = frontKoEnCopyMap;
      return cachedCopyMap;
    }

    if (typeof require === "function") {
      try {
        var requiredCopyMap = require("./front-ko-en-copy-map.js");
        if (requiredCopyMap && requiredCopyMap.frontKoEnCopyMap) {
          cachedCopyMap = requiredCopyMap.frontKoEnCopyMap;
          return cachedCopyMap;
        }
        if (requiredCopyMap && requiredCopyMap.default) {
          cachedCopyMap = requiredCopyMap.default;
          return cachedCopyMap;
        }
      } catch (error) {
        // copy map은 보조 자료라 여기서도 조용히 빠진다.
      }
    }

    return {};
  }

  function readPersistedLang(rootScope) {
    try {
      if (rootScope && rootScope.localStorage) {
        var i;
        for (i = 0; i < STORAGE_KEYS.length; i += 1) {
          var storedLang = normalizeLang(rootScope.localStorage.getItem(STORAGE_KEYS[i]));
          if (storedLang) {
            return storedLang;
          }
        }
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function readDocumentLang(rootScope) {
    if (!rootScope || !rootScope.document) {
      return null;
    }

    var doc = rootScope.document;
    var html = doc.documentElement;

    if (html) {
      var langAttr = normalizeLang(html.getAttribute("lang"));
      if (langAttr) {
        return langAttr;
      }

      if (html.lang) {
        var langProp = normalizeLang(html.lang);
        if (langProp) {
          return langProp;
        }
      }
    }

    if (doc.body && doc.body.dataset) {
      var currentBodyLang = normalizeLang(doc.body.dataset.currentLang || doc.body.getAttribute("data-current-lang"));
      if (currentBodyLang) {
        return currentBodyLang;
      }
    }

    return null;
  }

  function readNavigatorLang(rootScope) {
    if (!rootScope || !rootScope.navigator || !rootScope.navigator.language) {
      return null;
    }

    return normalizeLang(rootScope.navigator.language);
  }

  function resolveCurrentLang(preferredLang) {
    var explicit = normalizeLang(preferredLang);
    if (explicit) {
      return explicit;
    }

    var persisted = readPersistedLang(root);
    if (persisted) {
      return persisted;
    }

    var documentLang = readDocumentLang(root);
    if (documentLang) {
      return documentLang;
    }

    var navigatorLang = readNavigatorLang(root);
    if (navigatorLang) {
      return navigatorLang;
    }

    return DEFAULT_LANG;
  }

  function getCurrentLang() {
    return resolveCurrentLang();
  }

  function getLangPack(lang) {
    var langDataObject = getGlobalLangData(root);
    var resolvedLang = normalizeLang(lang) || DEFAULT_LANG;

    if (langDataObject && langDataObject[resolvedLang]) {
      return langDataObject[resolvedLang];
    }

    return null;
  }

  function lookupInLangData(lang, key) {
    var pack = getLangPack(lang);
    if (!pack || typeof key !== "string") {
      return null;
    }

    if (Object.prototype.hasOwnProperty.call(pack, key)) {
      var value = pack[key];
      return typeof value === "string" ? value : value == null ? null : String(value);
    }

    return null;
  }

  function lookupInCopyMap(key) {
    var copyMap = getFrontKoEnCopyMap(root);
    if (!copyMap || typeof key !== "string") {
      return null;
    }

    if (Object.prototype.hasOwnProperty.call(copyMap, key)) {
      var value = copyMap[key];
      return typeof value === "string" ? value : value == null ? null : String(value);
    }

    return null;
  }

  function translate(key, options) {
    var config = options && typeof options === "object" ? options : {};
    var lang = normalizeLang(config.lang) || resolveCurrentLang();
    var fallback = Object.prototype.hasOwnProperty.call(config, "fallback")
      ? config.fallback
      : key;
    var translated = lookupInLangData(lang, key);

    if (translated !== null) {
      return translated;
    }

    if (lang === "en") {
      translated = lookupInCopyMap(key);
      if (translated !== null) {
        return translated;
      }
    }

    if (fallback === null || typeof fallback === "undefined") {
      return typeof key === "string" ? key : "";
    }

    return fallback;
  }

  function applyNodeTranslation(node, lang, options) {
    if (!node || typeof node.getAttribute !== "function") {
      return false;
    }

    if (isCurrentLangCarrier(node)) {
      return false;
    }

    var token = node.getAttribute("data-lang");
    if (!token && node.dataset && node.dataset.lang) {
      token = node.dataset.lang;
    }

    if (!token) {
      return false;
    }

    var translated = translate(token, {
      lang: lang,
      fallback: token,
    });

    var renderHtml = false;
    if (options && options.renderHtml) {
      renderHtml = true;
    } else if (node.dataset && node.dataset.langHtml === "true") {
      renderHtml = true;
    } else if (node.getAttribute("data-lang-html") === "true") {
      renderHtml = true;
    }

    if (renderHtml && typeof node.innerHTML === "string") {
      node.innerHTML = translated;
    } else if ("textContent" in node) {
      node.textContent = translated;
    }

    if (node.tagName && /^(INPUT|TEXTAREA)$/i.test(node.tagName) && "value" in node) {
      node.value = translated;
    }

    return true;
  }

  function applyPlaceholderTranslation(node, lang) {
    if (!node || typeof node.setAttribute !== "function") {
      return false;
    }

    var token = node.getAttribute("data-lang-placeholder");
    if (!token && node.dataset && node.dataset.langPlaceholder) {
      token = node.dataset.langPlaceholder;
    }

    if (!token) {
      return false;
    }

    node.setAttribute(
      "placeholder",
      translate(token, {
        lang: lang,
        fallback: token,
      }),
    );

    return true;
  }

  function isCurrentLangCarrier(node) {
    if (!node || !root || !root.document) {
      return false;
    }

    var doc = root.document;
    return node === doc.body || node === doc.documentElement || (node.tagName && /^(HTML|BODY)$/i.test(node.tagName));
  }

  function applyLanguageToRoot(rootNode, options) {
    var config = options && typeof options === "object" ? options : {};
    var scope = rootNode || (root && root.document ? root.document : null);
    var lang = normalizeLang(config.lang) || resolveCurrentLang();
    var translatedCount = 0;

    if (!scope || typeof scope.querySelectorAll !== "function") {
      return translatedCount;
    }

    var elements = scope.querySelectorAll("[data-lang]");
    var placeholders = scope.querySelectorAll("[data-lang-placeholder]");
    var translatedElements = [];
    var i;

    for (i = 0; i < elements.length; i += 1) {
      if (!isCurrentLangCarrier(elements[i])) {
        translatedElements.push(elements[i]);
      }
    }

    for (i = 0; i < translatedElements.length; i += 1) {
      if (applyNodeTranslation(translatedElements[i], lang, config)) {
        translatedCount += 1;
      }
    }

    for (i = 0; i < placeholders.length; i += 1) {
      if (applyPlaceholderTranslation(placeholders[i], lang)) {
        translatedCount += 1;
      }
    }

    return translatedCount;
  }

  function extractEventLang(event) {
    if (!event) {
      return null;
    }

    if (typeof event.detail === "string") {
      return normalizeLang(event.detail);
    }

    if (event.detail && typeof event.detail === "object") {
      return normalizeLang(event.detail.lang || event.detail.currentLang || event.detail.value);
    }

    return null;
  }

  function notifySubscribers(detail) {
    var payload = detail || {};

    listeners.forEach(function (listener) {
      try {
        listener(payload);
      } catch (error) {
        // 구독자 예외는 다른 구독자를 막지 않게 삼킨다.
      }
    });
  }

  function notifyFromExternalEvent(event) {
    if (!event || suppressNativeEventNotify > 0) {
      return;
    }

    var lang = extractEventLang(event);
    if (!lang) {
      return;
    }

    var currentLang = resolveCurrentLang();
    var previousLang = null;

    if (event.detail && typeof event.detail === "object" && !Array.isArray(event.detail)) {
      previousLang = normalizeLang(event.detail.previousLang || event.detail.before || event.detail.from);
    }

    if (!previousLang && currentLang && currentLang !== lang) {
      previousLang = currentLang;
    }

    notifySubscribers({
      lang: lang,
      previousLang: previousLang,
      source: event.type || "external",
      external: true,
      eventDetail: event.detail,
    });
  }

  function bindNativeLanguageListeners() {
    if (nativeEventsBound || !root) {
      return;
    }

    var targets = [];
    var doc = root.document;

    if (doc && typeof doc.addEventListener === "function") {
      targets.push(doc);
    }

    if (typeof root.addEventListener === "function") {
      targets.push(root);
    }

    if (!targets.length) {
      return;
    }

    var handler = function (event) {
      notifyFromExternalEvent(event);
    };

    var i;
    for (i = 0; i < targets.length; i += 1) {
      targets[i].addEventListener(LANGUAGE_CHANGED_EVENT, handler);
      targets[i].addEventListener(FAB_LANGUAGE_CHANGED_EVENT, handler);
      targets[i].addEventListener(LANGUAGE_CHANGE_EVENT, handler);
    }

    nativeEventsBound = true;
  }

  function dispatchLanguageChange(detail) {
    var eventDetail = detail && typeof detail === "object" && !Array.isArray(detail)
      ? detail
      : { lang: normalizeLang(detail) || resolveCurrentLang() };
    var eventTarget = null;
    var createCustomEvent = root && typeof root.CustomEvent === "function" ? root.CustomEvent : null;

    if (root && root.document && typeof root.document.dispatchEvent === "function") {
      eventTarget = root.document;
    } else if (root && typeof root.dispatchEvent === "function") {
      eventTarget = root;
    }

    if (!eventTarget || !createCustomEvent) {
      return false;
    }

    suppressNativeEventNotify += 1;
    try {
      eventTarget.dispatchEvent(new createCustomEvent(LANGUAGE_CHANGED_EVENT, { detail: eventDetail.lang }));
      eventTarget.dispatchEvent(new createCustomEvent(FAB_LANGUAGE_CHANGED_EVENT, { detail: eventDetail.lang }));
      eventTarget.dispatchEvent(new createCustomEvent(LANGUAGE_CHANGE_EVENT, { detail: eventDetail }));
    } finally {
      suppressNativeEventNotify = Math.max(0, suppressNativeEventNotify - 1);
    }

    return true;
  }

  function updateDocumentLang(lang) {
    if (!root || !root.document) {
      return;
    }

    var doc = root.document;
    var html = doc.documentElement;

    if (html) {
      html.setAttribute("lang", lang);
      html.lang = lang;
    }

    if (doc.body) {
      doc.body.setAttribute("data-current-lang", lang);

      if (typeof doc.body.removeAttribute === "function") {
        doc.body.removeAttribute("data-lang");
      }

      if (doc.body.dataset) {
        if (Object.prototype.hasOwnProperty.call(doc.body.dataset, "lang")) {
          try {
            delete doc.body.dataset.lang;
          } catch (error) {
            doc.body.dataset.lang = "";
          }
        }

        doc.body.dataset.currentLang = lang;
      } else if (typeof doc.body.setAttribute === "function") {
        doc.body.setAttribute("data-current-lang", lang);
      }
    }
  }

  function persistLang(lang) {
    try {
      if (root && root.localStorage) {
        var i;
        for (i = 0; i < STORAGE_KEYS.length; i += 1) {
          root.localStorage.setItem(STORAGE_KEYS[i], lang);
        }
      }
    } catch (error) {
      // 저장 실패는 무시한다.
    }
  }

  function setCurrentLang(nextLang, options) {
    var config = options && typeof options === "object" ? options : {};
    var resolved = normalizeLang(nextLang) || DEFAULT_LANG;
    var previous = resolveCurrentLang();
    var payload = {
      lang: resolved,
      previousLang: previous,
      source: config.source || "setCurrentLang",
    };

    if (config.persist !== false) {
      persistLang(resolved);
    }

    updateDocumentLang(resolved);
    notifySubscribers(payload);
    dispatchLanguageChange(payload);

    return resolved;
  }

  function subscribeLanguageChange(listener) {
    if (typeof listener !== "function") {
      return function () {};
    }

    bindNativeLanguageListeners();
    listeners.add(listener);

    return function unsubscribe() {
      listeners.delete(listener);
    };
  }

  function unsubscribeLanguageChange(listener) {
    return listeners.delete(listener);
  }

  function createTranslator(langOrOptions) {
    var config = langOrOptions && typeof langOrOptions === "object" ? langOrOptions : { lang: langOrOptions };
    var fixedLang = normalizeLang(config.lang) || resolveCurrentLang();
    var fixedFallback = Object.prototype.hasOwnProperty.call(config, "fallback") ? config.fallback : undefined;

    return function frontTranslator(key, runtimeOptions) {
      var mergedOptions = runtimeOptions && typeof runtimeOptions === "object" ? runtimeOptions : {};
      var nextOptions = {};

      nextOptions.lang = fixedLang;

      if (Object.prototype.hasOwnProperty.call(mergedOptions, "fallback")) {
        nextOptions.fallback = mergedOptions.fallback;
      } else if (typeof fixedFallback !== "undefined") {
        nextOptions.fallback = fixedFallback;
      }

      return translate(key, nextOptions);
    };
  }

  bindNativeLanguageListeners();

  var api = {
    namespace: LANGUAGE_NAMESPACE,
    DEFAULT_LANG: DEFAULT_LANG,
    LANGUAGE_CHANGED_EVENT: LANGUAGE_CHANGED_EVENT,
    FAB_LANGUAGE_CHANGED_EVENT: FAB_LANGUAGE_CHANGED_EVENT,
    LANGUAGE_CHANGE_EVENT: LANGUAGE_CHANGE_EVENT,
    resolveCurrentLang: resolveCurrentLang,
    getCurrentLang: getCurrentLang,
    setCurrentLang: setCurrentLang,
    translate: translate,
    createTranslator: createTranslator,
    applyLanguageToRoot: applyLanguageToRoot,
    subscribeLanguageChange: subscribeLanguageChange,
    unsubscribeLanguageChange: unsubscribeLanguageChange,
    dispatchLanguageChange: dispatchLanguageChange,
  };

  if (root) {
    root.frontI18n = api;
    root[LANGUAGE_NAMESPACE] = api;
  }

  return Object.freeze(api);
});
