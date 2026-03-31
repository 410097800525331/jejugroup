let staggerBound = false;

const createSplitGroup = (text: string, className: string) => {
  const group = document.createElement("span");
  group.className = className;
  group.setAttribute("aria-hidden", className.includes("clone") ? "true" : "false");

  text.split("").forEach((char, index) => {
    const charSpan = document.createElement("span");
    charSpan.className = "stagger-char";
    charSpan.textContent = char === " " ? "\u00A0" : char;
    charSpan.style.transitionDelay = `${index * 30}ms`;
    group.appendChild(charSpan);
  });

  return group;
};

export const initStaggerNav = () => {
  const navLinks = document.querySelectorAll<HTMLElement>(".hotel-shell-nav-link, .nav-link");

  navLinks.forEach((link) => {
    const textSpan = link.querySelector<HTMLElement>("span[data-lang]") || link.querySelector<HTMLElement>("span");
    if (!textSpan) {
      return;
    }

    if (textSpan.querySelector(".stagger-wrapper")) {
      return;
    }

    const originalText = textSpan.textContent?.trim() ?? "";
    if (!originalText) {
      return;
    }

    const wrapper = document.createElement("span");
    wrapper.className = "stagger-wrapper";
    wrapper.appendChild(createSplitGroup(originalText, "stagger-original"));
    wrapper.appendChild(createSplitGroup(originalText, "stagger-clone"));

    textSpan.textContent = "";
    textSpan.appendChild(wrapper);

    let isAnimating = false;
    let isMouseOver = false;

    link.addEventListener("mouseenter", () => {
      isMouseOver = true;
      if (isAnimating) {
        return;
      }

      isAnimating = true;
      link.classList.add("is-animating");

      const totalTime = originalText.length * 30 + 300 + 50;
      setTimeout(() => {
        isAnimating = false;
        if (!isMouseOver) {
          link.classList.remove("is-animating");
        }
      }, totalTime);
    });

    link.addEventListener("mouseleave", () => {
      isMouseOver = false;
      if (!isAnimating) {
        link.classList.remove("is-animating");
      }
    });
  });
};

export const ensureStaggerBinding = () => {
  if (staggerBound) {
    return;
  }

  staggerBound = true;
  document.addEventListener("mainHeaderLoaded", initStaggerNav);
};
