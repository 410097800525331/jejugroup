if (window.gsap) {
    document.documentElement.classList.add("hero-reveal-pending");
}

let heroRevealFallbackTimeoutId = null;
const scheduleHeroRevealFallback = () => {
    if (heroRevealFallbackTimeoutId !== null) {
        window.clearTimeout(heroRevealFallbackTimeoutId);
    }

    heroRevealFallbackTimeoutId = window.setTimeout(() => {
        document.documentElement.classList.remove("hero-reveal-pending");
        heroRevealFallbackTimeoutId = null;
    }, 4000);
};

scheduleHeroRevealFallback();

const HERO_SEARCH_WIDGET_STATE_ATTR = "data-search-widget-state";
const HERO_SEARCH_WIDGET_PENDING = "pending";
const HERO_SEARCH_WIDGET_READY = "ready";

const initHeroSearchWidgetStability = (hostId, readyEventName) => {
    const host = document.getElementById(hostId);
    if (!host) {
        return;
    }

    let resolved = false;

    const markReady = () => {
        if (resolved) {
            return;
        }

        resolved = true;
        host.setAttribute(HERO_SEARCH_WIDGET_STATE_ATTR, HERO_SEARCH_WIDGET_READY);
        host.setAttribute("aria-busy", "false");
    };

    host.setAttribute(HERO_SEARCH_WIDGET_STATE_ATTR, HERO_SEARCH_WIDGET_PENDING);
    host.setAttribute("aria-busy", "true");

    if (host.childElementCount > 0) {
        markReady();
        return;
    }

    const observer = new MutationObserver(() => {
        if (host.childElementCount > 0) {
            markReady();
            observer.disconnect();
        }
    });

    observer.observe(host, { childList: true });

    if (readyEventName) {
        document.addEventListener(readyEventName, () => {
            markReady();
            observer.disconnect();
        }, { once: true });
    }
};

initHeroSearchWidgetStability("hotel-search-widget-root", "jeju:hotel-search-widget-mounted");

const initSharedStayMotion = async () => {
    try {
        const [{ initPremiumAnimations }, { initScrollAnimations }] = await Promise.all([
            import("../hotel/modules/interactions/premiumAnimations.js"),
            import("../hotel/modules/interactions/commonInteractions.js")
        ]);

        initScrollAnimations();
        initPremiumAnimations();
    } catch (error) {
        console.error("[PrivateStayPage] shared motion init failed", error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide?.createIcons) {
        window.lucide.createIcons();
    }

    window.JejuWishlistButton?.init();
    void initSharedStayMotion();
});
