export const initWishlistButtons = () => {
  document.querySelectorAll(".wishlist-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      button.classList.toggle("active");
    });
  });
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
