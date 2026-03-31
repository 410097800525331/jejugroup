import { useRef } from "react";

interface WishlistButtonProps {
  active: boolean;
  ariaLabel: string;
  className?: string;
  onToggle: (nextActive: boolean) => void;
}

const clearMotionClasses = (button: HTMLButtonElement) => {
  if (button.dataset.wishlistResetTimer) {
    window.clearTimeout(Number(button.dataset.wishlistResetTimer));
    delete button.dataset.wishlistResetTimer;
  }

  button.classList.remove("is-pressing", "is-releasing");
};

const animateWishlistButton = (button: HTMLButtonElement, activating: boolean) => {
  clearMotionClasses(button);
  button.classList.add("is-pressing");

  if (typeof button.animate === "function") {
    button.animate(
      activating
        ? [
            { transform: "translateY(0) scale(1)" },
            { transform: "translateY(0) scale(0.94)", offset: 0.2 },
            { transform: "translateY(-2px) scale(1.08)", offset: 0.56 },
            { transform: "translateY(0) scale(1)" }
          ]
        : [
            { transform: "translateY(0) scale(1)" },
            { transform: "translateY(0) scale(0.92)", offset: 0.26 },
            { transform: "translateY(0) scale(1.02)", offset: 0.58 },
            { transform: "translateY(0) scale(1)" }
          ],
      {
        duration: activating ? 620 : 360,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );
  }

  const surface = button.querySelector<HTMLElement>(".wishlist-btn__surface");
  if (surface && typeof surface.animate === "function") {
    surface.animate(
      activating
        ? [
            { transform: "scale(1)" },
            { transform: "scale(0.88)", offset: 0.2 },
            { transform: "scale(1.04)", offset: 0.68 },
            { transform: "scale(1)" }
          ]
        : [
            { transform: "scale(1)" },
            { transform: "scale(0.9)", offset: 0.28 },
            { transform: "scale(1)" }
          ],
      {
        duration: activating ? 500 : 320,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );
  }

  const burstElements = button.querySelectorAll<HTMLElement>(".wishlist-btn__burst");
  if (activating && burstElements.length > 0) {
    burstElements.forEach((burst, index) => {
      if (typeof burst.animate !== "function") {
        return;
      }

      burst.animate(
        [
          { opacity: 0, transform: "translate(-50%, -50%) scale(0.2)" },
          {
            opacity: 0.95,
            transform: "translate(calc(-50% + (var(--burst-x) * 0.52)), calc(-50% + (var(--burst-y) * 0.52))) scale(1)",
            offset: 0.24
          },
          {
            opacity: 0,
            transform: "translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y))) scale(0.72)"
          }
        ],
        {
          delay: index * 18,
          duration: 420,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both"
        }
      );
    });
  }

  const icon = button.querySelector<HTMLElement>(".wishlist-btn__icon");
  if (icon && typeof icon.animate === "function") {
    icon.animate(
      activating
        ? [
            { transform: "scale(1)" },
            { transform: "scale(0.78)", offset: 0.2 },
            { transform: "scale(1.06)", offset: 0.64 },
            { transform: "scale(1)" }
          ]
        : [
            { transform: "scale(1)" },
            { transform: "scale(0.88)", offset: 0.3 },
            { transform: "scale(1)" }
          ],
      {
        duration: activating ? 480 : 300,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );
  }

  button.dataset.wishlistResetTimer = String(
    window.setTimeout(() => {
      button.classList.remove("is-pressing");
      button.classList.add("is-releasing");

      window.setTimeout(() => {
        clearMotionClasses(button);
      }, 180);
    }, activating ? 240 : 160)
  );
};

export const WishlistButton = ({ active, ariaLabel, className = "", onToggle }: WishlistButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const resolvedClassName = className.trim() ? `wishlist-btn ${className}` : "wishlist-btn";

  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`${resolvedClassName}${active ? " active" : ""}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        const nextActive = !active;
        if (buttonRef.current) {
          animateWishlistButton(buttonRef.current, nextActive);
        }

        onToggle(nextActive);
      }}
      ref={buttonRef}
      type="button"
    >
      <span aria-hidden="true" className="wishlist-btn__burst-layer">
        <span className="wishlist-btn__burst wishlist-btn__burst--1" />
        <span className="wishlist-btn__burst wishlist-btn__burst--2" />
        <span className="wishlist-btn__burst wishlist-btn__burst--3" />
        <span className="wishlist-btn__burst wishlist-btn__burst--4" />
      </span>
      <span className="wishlist-btn__surface" />
      <span aria-hidden="true" className="wishlist-btn__icon">
        <svg fill="none" role="presentation" viewBox="0 0 24 24">
          <path d="M12 21s-6.716-4.351-9.193-8.223C.828 9.74 1.3 5.524 4.56 3.66c2.168-1.24 4.964-.906 6.94.818 1.976-1.724 4.772-2.058 6.94-.818 3.26 1.864 3.733 6.08 1.753 9.117C18.716 16.649 12 21 12 21Z" />
        </svg>
      </span>
    </button>
  );
};
