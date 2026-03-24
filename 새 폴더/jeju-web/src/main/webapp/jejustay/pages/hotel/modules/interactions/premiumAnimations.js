const CTA_SELECTOR = ".cta-bounce-target, .search-btn-pill, .search-btn-v2";

const markOnce = (element, key) => {
  if (!element || element.dataset[key] === "true") {
    return false;
  }

  element.dataset[key] = "true";
  return true;
};

const prefersReducedMotion = () =>
  Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

const finalizeRevealState = (gsap, targets) => {
  const elements = (Array.isArray(targets) ? targets : [targets]).filter(Boolean);
  if (elements.length === 0) {
    return;
  }

  gsap.killTweensOf(elements);
  gsap.set(elements, { clearProps: "opacity,transform" });
};

const animateHeroSubtitle = (gsap) => {
  const heroSubtitle = document.querySelector(".hero-subtitle-top");
  if (!markOnce(heroSubtitle, "premiumReveal")) {
    return;
  }

  if (prefersReducedMotion()) {
    finalizeRevealState(gsap, heroSubtitle);
    return;
  }

  gsap.from(heroSubtitle, {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.2,
    clearProps: "opacity,transform"
  });
};

const animateSearchWidget = (gsap) => {
  const searchWidget = document.querySelector(".search-widget-large");
  if (!markOnce(searchWidget, "premiumReveal")) {
    return;
  }

  if (prefersReducedMotion()) {
    finalizeRevealState(gsap, searchWidget);
    return;
  }

  gsap.from(searchWidget, {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.35,
    clearProps: "opacity,transform"
  });
};

const animateDestinationCards = (gsap, ScrollTrigger) => {
  const destinationCards = gsap.utils
    .toArray(".destinations-grid .destination-card")
    .filter((card) => markOnce(card, "premiumReveal"));

  if (destinationCards.length === 0) {
    return;
  }

  if (prefersReducedMotion()) {
    finalizeRevealState(gsap, destinationCards);
    return;
  }

  destinationCards.forEach((card, index) => {
    const animationConfig = {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: index * 0.15,
      clearProps: "opacity,transform"
    };

    if (ScrollTrigger) {
      animationConfig.scrollTrigger = {
        trigger: ".destinations-grid",
        start: "top 85%"
      };
    }

    gsap.from(card, animationConfig);
  });
};

const animatePromoCards = (gsap, ScrollTrigger) => {
  const promoCards = gsap
    .utils
    .toArray(".promo-card")
    .filter((card) => markOnce(card, "premiumReveal"));

  if (promoCards.length === 0) {
    return;
  }

  if (prefersReducedMotion()) {
    finalizeRevealState(gsap, promoCards);
    return;
  }

  const animationConfig = {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.7)",
    clearProps: "opacity,transform"
  };

  if (ScrollTrigger) {
    animationConfig.scrollTrigger = {
      trigger: ".promo-section",
      start: "top 85%"
    };
  }

  gsap.from(promoCards, animationConfig);
};

const connectCtaBounce = (gsap) => {
  const targets = gsap.utils
    .toArray(CTA_SELECTOR)
    .filter((element) => markOnce(element, "premiumCtaReady"));

  if (targets.length === 0) {
    return;
  }

  targets.forEach((element, index) => {
    gsap.set(element, { "--cta-bounce-offset": "0px" });

    if (prefersReducedMotion()) {
      return;
    }

    const timeline = gsap.timeline({
      paused: true,
      repeat: -1,
      repeatDelay: 2.4 + (index % 3) * 0.25,
      delay: 0.9 + index * 0.12
    });

    timeline
      .to(element, {
        "--cta-bounce-offset": "-5px",
        duration: 0.22,
        ease: "power2.out"
      })
      .to(element, {
        "--cta-bounce-offset": "0px",
        duration: 0.42,
        ease: "bounce.out"
      });

    const nudge = () => {
      gsap.killTweensOf(element);
      gsap.fromTo(
        element,
        { "--cta-bounce-offset": "0px" },
        {
          "--cta-bounce-offset": "-6px",
          duration: 0.18,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.set(element, { "--cta-bounce-offset": "0px" });
          }
        }
      );
    };

    element.addEventListener("mouseenter", nudge);
    element.addEventListener("focus", nudge);

    if (!("IntersectionObserver" in window)) {
      timeline.play();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.play();
            return;
          }

          timeline.pause(0);
          gsap.set(element, { "--cta-bounce-offset": "0px" });
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
  });
};

const watchDynamicTargets = (gsap, ScrollTrigger) => {
  const body = document.body;
  if (!body || body.dataset.premiumObserverBound === "true") {
    return;
  }

  body.dataset.premiumObserverBound = "true";

  const observer = new MutationObserver(() => {
    animateSearchWidget(gsap);
    animatePromoCards(gsap, ScrollTrigger);
    connectCtaBounce(gsap);
  });

  observer.observe(body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 6000);
};

export const initPremiumAnimations = () => {
  const { gsap, ScrollTrigger } = window;
  if (!gsap) {
    return;
  }

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  animateHeroSubtitle(gsap);
  animateSearchWidget(gsap);
  animateDestinationCards(gsap, ScrollTrigger);
  animatePromoCards(gsap, ScrollTrigger);
  connectCtaBounce(gsap);
  watchDynamicTargets(gsap, ScrollTrigger);
};
