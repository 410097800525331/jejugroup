import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HotelListPageHotel } from "./hotelListPageData";
import { HotelCardPremium } from "./HotelCardPremium";

interface HotelResultListProps {
  hotels: HotelListPageHotel[];
}

const PAGE_SIZE = 50;
const AUTO_BATCH_SIZE = 10;
const INITIAL_VISIBLE_COUNT = 4;
const PRELOAD_ROOT_MARGIN = "360px 0px";
const SCROLL_TRIGGER_OFFSET = 180;

export const HotelResultList = ({ hotels }: HotelResultListProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(hotels.length / PAGE_SIZE));
  }, [hotels.length]);

  const currentPageHotels = useMemo(() => {
    const pageStartIndex = (currentPage - 1) * PAGE_SIZE;
    return hotels.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);
  }, [currentPage, hotels]);

  const visibleHotels = useMemo(() => {
    return currentPageHotels.slice(0, visibleCount);
  }, [currentPageHotels, visibleCount]);

  const ensureViewportFilled = useCallback(() => {
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
      Math.max(INITIAL_VISIBLE_COUNT, Math.ceil((availableHeight + rowGap) / (cardHeight + rowGap)) + 1)
    );

    setVisibleCount((current) => {
      if (cardsNeeded <= current) {
        return current;
      }

      return cardsNeeded;
    });
  }, [currentPageHotels.length]);

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(Math.min(INITIAL_VISIBLE_COUNT, hotels.length));
  }, [hotels]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(ensureViewportFilled);
    window.addEventListener("resize", ensureViewportFilled);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", ensureViewportFilled);
    };
  }, [ensureViewportFilled, visibleHotels.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || visibleCount >= currentPageHotels.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setVisibleCount((current) => Math.min(current + AUTO_BATCH_SIZE, currentPageHotels.length));
        });
      },
      {
        root: null,
        rootMargin: PRELOAD_ROOT_MARGIN,
        threshold: 0.01
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [currentPageHotels.length, visibleCount]);

  useEffect(() => {
    if (visibleCount >= currentPageHotels.length) {
      return undefined;
    }

    const handleScrollLoad = () => {
      const hotelList = listRef.current;
      if (!hotelList) {
        return;
      }

      const listBottom = hotelList.getBoundingClientRect().bottom;
      const viewportBottomReached =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - SCROLL_TRIGGER_OFFSET;
      const listBottomReached = listBottom <= window.innerHeight + SCROLL_TRIGGER_OFFSET;

      if (!viewportBottomReached && !listBottomReached) {
        return;
      }

      setVisibleCount((current) => Math.min(current + AUTO_BATCH_SIZE, currentPageHotels.length));
    };

    const frameId = window.requestAnimationFrame(handleScrollLoad);
    window.addEventListener("scroll", handleScrollLoad, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScrollLoad);
    };
  }, [currentPageHotels.length, visibleCount]);

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
      <div className="hotel-main-column">
        <section className="hotel-main-list">
          <div className="hotel-runtime-fallback hotel-runtime-fallback--list">
            <strong>조건에 맞는 호텔이 없음</strong>
            <span>평점이나 숙소 종류 필터를 조금 풀어서 다시 봐라.</span>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="hotel-main-column">
      <section className="hotel-main-list" ref={listRef}>
        {visibleHotels.map((hotel) => (
          <HotelCardPremium hotel={hotel} key={hotel.id} />
        ))}
        {visibleCount < currentPageHotels.length ? <div aria-hidden="true" className="hotel-list-sentinel" ref={sentinelRef} /> : null}
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
    </div>
  );
};
