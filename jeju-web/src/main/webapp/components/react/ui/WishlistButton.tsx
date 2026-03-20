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
      <span className="wishlist-btn__surface" />
      <span aria-hidden="true" className="wishlist-btn__icon">
        <svg fill="none" role="presentation" viewBox="0 0 24 24">
          <path d="M12 21s-6.716-4.351-9.193-8.223C.828 9.74 1.3 5.524 4.56 3.66c2.168-1.24 4.964-.906 6.94.818 1.976-1.724 4.772-2.058 6.94-.818 3.26 1.864 3.733 6.08 1.753 9.117C18.716 16.649 12 21 12 21Z" />
        </svg>
      </span>
    </button>
  );
};
