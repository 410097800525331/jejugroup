export const initPremiumAnimations = () => {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const heroSubtitle = document.querySelector(".hero-subtitle-top");
  if (heroSubtitle) {
    gsap.from(heroSubtitle, {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2
    });
  }

  const searchWidget = document.querySelector(".search-widget-large");
  if (searchWidget) {
    gsap.from(searchWidget, {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.5
    });
  }

  const destinationCards = document.querySelectorAll(".destinations-grid .destination-card");
  if (destinationCards.length > 0) {
    gsap.utils.toArray(destinationCards).forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: ".destinations-grid",
          start: "top 85%"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: index * 0.15
      });
    });
  }

  const promoCards = document.querySelectorAll(".promo-card");
  if (promoCards.length > 0) {
    gsap.from(promoCards, {
      scrollTrigger: {
        trigger: ".promo-section",
        start: "top 85%"
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)"
    });
  }
};
