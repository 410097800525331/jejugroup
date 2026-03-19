import { useEffect, useMemo, useRef, useState } from "react";
import type { HotelListPageHotel } from "./hotelListPageData";
import { HotelCardPremium } from "./HotelCardPremium";

interface HotelResultListProps {
  hotels: HotelListPageHotel[];
}

const PAGE_SIZE = 50;
const AUTO_BATCH_SIZE = 2;
const INITIAL_VISIBLE_COUNT = 2;
const VIEWPORT_TRIGGER_OFFSET = 120;

export const HotelResultList = ({ hotels }: HotelResultListProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLElement | null>(null);
  const hasMountedRef = useRef(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(hotels.length / PAGE_SIZE));
  }, [hotels.length]);

  const currentPageHotels = useMemo(() => {
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    return hotels.slice(pageStart, pageStart + PAGE_SIZE);
  }, [currentPage, hotels]);

  const visibleHotels = useMemo(() => {
    return currentPageHotels.slice(0, visibleCount);
  }, [currentPageHotels, visibleCount]);

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE_COUNT, hotels.length));
    setCurrentPage(1);
  }, [hotels]);

  useEffect(() => {
    const fillViewport = () => {
      const hotelList = listRef.current;
      if (!hotelList || currentPageHotels.length === 0) {
        return;
      }

      const firstCard = hotelList.querySelector<HTMLElement>(".hotel-card-premium");
      if (!firstCard) {
        return;
      }

      const computedStyle = window.getComputedStyle(hotelList);
      const rowGap = Number.parseFloat(computedStyle.gap || "0") || 0;
      const cardHeight = firstCard.offsetHeight;
      const listTop = hotelList.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - listTop;

      if (cardHeight <= 0 || availableHeight <= 0) {
        return;
      }

      const cardsNeeded = Math.min(
        currentPageHotels.length,
        Math.max(
          INITIAL_VISIBLE_COUNT,
          Math.ceil((availableHeight + rowGap) / (cardHeight + rowGap))
        )
      );

      if (cardsNeeded > visibleCount) {
        setVisibleCount(cardsNeeded);
      }
    };

    const frameId = window.requestAnimationFrame(fillViewport);
    window.addEventListener("resize", fillViewport);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", fillViewport);
    };
  }, [currentPageHotels.length, visibleCount]);

  useEffect(() => {
    const currentPageHotels = hotels.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    if (visibleCount >= currentPageHotels.length) {
      return undefined;
    }

    const evaluateAutoLoad = () => {
      const hotelList = listRef.current;

      if (!hotelList) {
        return;
      }

      const listBottom = hotelList.getBoundingClientRect().bottom;
      const shouldLoadMore = listBottom < window.innerHeight - VIEWPORT_TRIGGER_OFFSET;

      if (shouldLoadMore) {
        setVisibleCount((current) => Math.min(current + AUTO_BATCH_SIZE, currentPageHotels.length));
      }
    };

    const frameId = window.requestAnimationFrame(evaluateAutoLoad);
    window.addEventListener("scroll", evaluateAutoLoad);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", evaluateAutoLoad);
    };
  }, [currentPage, hotels, visibleCount]);

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE_COUNT, currentPageHotels.length));
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage, currentPageHotels.length]);

  if (hotels.length === 0) {
    return (
      <section className="hotel-main-list">
        <div className="hotel-runtime-fallback hotel-runtime-fallback--list">
          <strong>조건에 맞는 호텔이 없음</strong>
          <span>평점이나 숙소 종류 필터를 조금 풀어서 다시 봐라.</span>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hotel-main-list" ref={listRef}>
        {visibleHotels.map((hotel) => (
          <HotelCardPremium hotel={hotel} key={hotel.id} />
        ))}
      </section>

      {totalPages > 1 && visibleCount >= currentPageHotels.length ? (
        <div className="load-more-container pagination-container">
          <span className="page-indicator">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <button
              className="btn-load-more"
              onClick={() => {
                setCurrentPage((current) => Math.min(current + 1, totalPages));
              }}
              type="button"
            >
              다음 페이지
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
