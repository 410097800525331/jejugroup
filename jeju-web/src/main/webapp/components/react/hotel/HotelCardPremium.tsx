import { useState } from "react";
import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import type { HotelListPageHotel } from "./hotelListPageData";

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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const reviewLabel = REVIEW_LABEL_MAP[hotel.reviewLabel] ?? hotel.reviewLabel;

  return (
    <article className="hotel-card-premium">
      <div className="hotel-card-image">
        <img alt={hotel.title} src={hotel.imageUrl} />
        <span className="badge-overlay">{hotel.badge}</span>
        <button
          aria-label={`${hotel.title} 찜하기`}
          className={`wishlist-btn-premium${isWishlisted ? " active" : ""}`}
          onClick={() => {
            setIsWishlisted((current) => !current);
          }}
          type="button"
        >
          <HotelShellIcon className="wishlist-icon" name="heart" />
        </button>
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
