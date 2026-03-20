export const initWishlistButtons = () => {
  window.JejuWishlistButton?.init();
};

export const initScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".hotel-card, .destination-card").forEach((element) => {
    observer.observe(element);
  });
};
