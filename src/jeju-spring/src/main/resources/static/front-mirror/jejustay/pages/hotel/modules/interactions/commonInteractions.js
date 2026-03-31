export const initWishlistButtons = () => {
  window.JejuWishlistButton?.init();
};

let scrollAnimationsObserver = null;
let scrollAnimationsMutationObserver = null;
const scrollAnimationsObserved = new WeakSet();

export const initScrollAnimations = () => {
  const targetSelector = ".hotel-card, .destination-card";

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(targetSelector).forEach((element) => {
      element.classList.add("animate-in");
    });
    return;
  }

  if (!scrollAnimationsObserver) {
    scrollAnimationsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("animate-in");
          scrollAnimationsObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
  }

  const observeTargets = (root = document) => {
    root.querySelectorAll(targetSelector).forEach((element) => {
      if (scrollAnimationsObserved.has(element) || element.dataset.scrollObserved === "true") {
        return;
      }

      element.dataset.scrollObserved = "true";
      scrollAnimationsObserved.add(element);
      scrollAnimationsObserver?.observe(element);
    });
  };

  observeTargets();

  if (scrollAnimationsMutationObserver || !document.body) {
    return;
  }

  scrollAnimationsMutationObserver = new MutationObserver(() => {
    observeTargets();
  });

  scrollAnimationsMutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
};
