import { useEffect, useMemo, useState } from "react";
import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import { WishlistButton } from "@front-components/ui/WishlistButton";
import { buildHotelPaymentPageHref, type HotelListPageHotel } from "./hotelListPageData";

interface HotelCardPremiumProps {
  hotel: HotelListPageHotel;
}

const REVIEW_LABEL_MAP: Record<string, string> = {
  Exceptional: "최고",
  Excellent: "우수",
  Great: "좋은",
  "Very Good": "양호",
  Good: "좋은"
};

export const HotelCardPremium = ({ hotel }: HotelCardPremiumProps) => {
  const paymentPageHref = useMemo(() => {
    return buildHotelPaymentPageHref(hotel, window.location.search);
  }, [hotel]);
  const wishlistItem = useMemo(() => {
    return {
      id: hotel.id,
      name: hotel.title,
      image: hotel.imageUrl,
      location: hotel.location,
      price: hotel.currentPrice
    };
  }, [hotel.currentPrice, hotel.id, hotel.imageUrl, hotel.location, hotel.title]);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    return window.FABState ? window.FABState.isInWishlist(wishlistItem.id) : false;
  });
  const reviewLabel = REVIEW_LABEL_MAP[hotel.reviewLabel] ?? hotel.reviewLabel;
  const hasBadge = hotel.badge.trim().length > 0;

  const handleNavigateToPayment = () => {
    window.location.href = paymentPageHref;
  };

  useEffect(() => {
    if (!window.FABState) {
      return undefined;
    }

    const syncWishlistState = () => {
      setIsWishlisted(window.FABState?.isInWishlist(wishlistItem.id) ?? false);
    };

    syncWishlistState();
    document.addEventListener("fabWishlistUpdated", syncWishlistState);

    return () => {
      document.removeEventListener("fabWishlistUpdated", syncWishlistState);
    };
  }, [wishlistItem.id]);

  return (
    <article
      aria-label={`${hotel.title} 결제 페이지로 이동`}
      className="hotel-card-premium"
      onClick={(event) => {
        const target = event.target;
        if (target instanceof Element && target.closest("button, a, input, select, textarea, label")) {
          return;
        }

        handleNavigateToPayment();
      }}
      onKeyDown={(event) => {
        const target = event.target;
        if (target instanceof Element && target.closest("button, a, input, select, textarea, label")) {
          return;
        }

        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        handleNavigateToPayment();
      }}
      role="link"
      style={{ cursor: "pointer" }}
      tabIndex={0}
    >
      <div className="hotel-card-image">
        <img alt={hotel.title} decoding="async" loading="lazy" src={hotel.imageUrl} />
        {hasBadge ? <span className="badge-overlay">{hotel.badge}</span> : null}
        <WishlistButton
          active={isWishlisted}
          ariaLabel={`${hotel.title} 찜하기`}
          className="wishlist-btn--premium"
          onToggle={(nextActive) => {
            if (!window.FABState) {
              setIsWishlisted(nextActive);
              return;
            }

            window.FABState.addToWishlist(wishlistItem);
            setIsWishlisted(window.FABState.isInWishlist(wishlistItem.id));
          }}
        />
      </div>
      <div className="hotel-card-content">
        <div className="hotel-card-header">
          <div className="hotel-title-group">
            <h3>{hotel.title}</h3>
            <div className="hotel-stars">{hotel.stars}</div>
          </div>
          <div className="review-badge">
            <span className="score">{hotel.reviewScore}</span>
            <small>{reviewLabel}</small>
          </div>
        </div>
        <div className="hotel-location-text">
          <HotelShellIcon className="hotel-location-icon" name="map" />
          <span>{hotel.location}</span>
        </div>
        <div className="hotel-tags">
          {hotel.tags.map((tag) => (
            <span className="tag-item" key={`${hotel.id}-${tag}`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="hotel-price-zone">
          <div className="price-original">{hotel.originalPrice}</div>
          <div className="price-current">{hotel.currentPrice}</div>
          <div className="price-unit">1박당 / 세금 포함</div>
        </div>
      </div>
    </article>
  );
};
