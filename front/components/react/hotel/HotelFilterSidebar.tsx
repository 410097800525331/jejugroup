import { useEffect, useMemo, useRef, useState } from "react";
import type { HotelListFilterSection as HotelListFilterSectionData } from "./hotelListPageData";
import { HotelFilterSection } from "./HotelFilterSection";

interface HotelFilterSidebarProps {
  checkedOptionIds: Set<string>;
  mapButtonLabel: string;
  onPriceChange: (priceRange: { max: number; min: number }) => void;
  onToggle: (optionId: string) => void;
  priceBounds: { max: number; min: number };
  priceRange: { max: number; min: number };
  sections: HotelListFilterSectionData[];
}

const RANGE_STEP = 1000;
const STICKY_FILTER_BOTTOM_GAP = 24;
type StickyOverlayMode = "absolute" | "fixed";

const formatPrice = (price: number) => {
  return price.toLocaleString("ko-KR");
};

const parsePriceInput = (value: string) => {
  const parsed = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

interface StickyFilterSectionsProps {
  checkedOptionIds: Set<string>;
  mapButtonLabel: string;
  onPriceChange: (priceRange: { max: number; min: number }) => void;
  onToggle: (optionId: string) => void;
  popularSection?: HotelListFilterSectionData;
  priceBounds: { max: number; min: number };
  priceRange: { max: number; min: number };
}

const StickyFilterSections = ({
  checkedOptionIds,
  mapButtonLabel,
  onPriceChange,
  onToggle,
  popularSection,
  priceBounds,
  priceRange
}: StickyFilterSectionsProps) => {
  const rangePercentages = useMemo(() => {
    const spread = Math.max(1, priceBounds.max - priceBounds.min);

    return {
      left: ((priceRange.min - priceBounds.min) / spread) * 100,
      right: ((priceBounds.max - priceRange.max) / spread) * 100
    };
  }, [priceBounds.max, priceBounds.min, priceRange.max, priceRange.min]);

  return (
    <>
      <div className="map-banner-widget">
        <div className="map-bg"></div>
        <button className="map-btn" type="button">
          {mapButtonLabel}
        </button>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">1박당 요금</h3>
        <div className="price-slider-wrapper">
          <div className="range-slider-mock">
            <div className="range-bar" style={{ left: `${rangePercentages.left}%`, right: `${rangePercentages.right}%` }}></div>
            <input
              aria-label="최저 가격"
              className="range-input range-input-min"
              max={priceBounds.max}
              min={priceBounds.min}
              onChange={(event) => {
                const nextMin = Math.min(Number(event.target.value), priceRange.max);
                onPriceChange({
                  min: nextMin,
                  max: priceRange.max
                });
              }}
              step={RANGE_STEP}
              type="range"
              value={priceRange.min}
            />
            <input
              aria-label="최대 가격"
              className="range-input range-input-max"
              max={priceBounds.max}
              min={priceBounds.min}
              onChange={(event) => {
                const nextMax = Math.max(Number(event.target.value), priceRange.min);
                onPriceChange({
                  min: priceRange.min,
                  max: nextMax
                });
              }}
              step={RANGE_STEP}
              type="range"
              value={priceRange.max}
            />
          </div>
          <div className="price-inputs">
            <label className="price-box">
              <span>₩</span>
              <input
                inputMode="numeric"
                onChange={(event) => {
                  const nextMin = Math.min(parsePriceInput(event.target.value), priceRange.max);
                  onPriceChange({
                    min: nextMin,
                    max: priceRange.max
                  });
                }}
                value={formatPrice(priceRange.min)}
              />
            </label>
            <label className="price-box">
              <span>₩</span>
              <input
                inputMode="numeric"
                onChange={(event) => {
                  const nextMax = Math.max(parsePriceInput(event.target.value), priceRange.min);
                  onPriceChange({
                    min: priceRange.min,
                    max: nextMax
                  });
                }}
                value={formatPrice(priceRange.max)}
              />
            </label>
          </div>
        </div>
      </div>

      {popularSection ? (
        <HotelFilterSection
          checkedOptionIds={checkedOptionIds}
          onToggle={onToggle}
          section={popularSection}
        />
      ) : null}
    </>
  );
};

export const HotelFilterSidebar = ({
  checkedOptionIds,
  mapButtonLabel,
  onPriceChange,
  onToggle,
  priceBounds,
  priceRange,
  sections
}: HotelFilterSidebarProps) => {
  const originalSidebarContentRef = useRef<HTMLDivElement | null>(null);
  const sourceStickySectionsRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [stickyState, setStickyState] = useState({
    active: false,
    left: 0,
    mode: "fixed" as StickyOverlayMode,
    top: 0,
    width: 0
  });

  const popularSection = sections.find((section) => section.id === "popular");
  const remainingSections = sections.filter((section) => section.id !== "popular");

  useEffect(() => {
    const evaluateStickyState = () => {
      const sidebar = sidebarRef.current;
      const originalSidebarContent = originalSidebarContentRef.current;
      const sourceStickySections = sourceStickySectionsRef.current;

      if (!sidebar || !originalSidebarContent || !sourceStickySections) {
        return;
      }

      const header = document.querySelector<HTMLElement>(".header.hotel-shell-header");
      const stickySearch = document.getElementById("stickySearch");
      const paginationBoundary =
        document.querySelector<HTMLElement>(".load-more-container.pagination-container") ??
        document.querySelector<HTMLElement>(".pagination-container") ??
        document.querySelector<HTMLElement>(".load-more-container");
      const topOffset = (header?.offsetHeight ?? 72) + (stickySearch?.clientHeight ?? 72) + 24;
      const sidebarRect = sidebar.getBoundingClientRect();
      const originalSidebarContentRect = originalSidebarContent.getBoundingClientRect();
      const stickySectionsHeight = sourceStickySections.offsetHeight;
      const stickyShouldActivate = originalSidebarContentRect.bottom <= topOffset;
      const sidebarDocumentTop = window.scrollY + sidebarRect.top;
      const paginationBoundaryRect = paginationBoundary?.getBoundingClientRect();
      const boundaryDocumentTop =
        typeof paginationBoundaryRect?.top === "number" ? window.scrollY + paginationBoundaryRect.top : null;
      const fixedOverlayDocumentBottom = window.scrollY + topOffset + stickySectionsHeight;
      const shouldAnchorToBoundary =
        stickyShouldActivate &&
        typeof boundaryDocumentTop === "number" &&
        fixedOverlayDocumentBottom + STICKY_FILTER_BOTTOM_GAP >= boundaryDocumentTop;
      const anchoredTop =
        typeof boundaryDocumentTop === "number"
          ? Math.max(0, boundaryDocumentTop - sidebarDocumentTop - stickySectionsHeight - STICKY_FILTER_BOTTOM_GAP)
          : topOffset;

      const nextState = {
        active: stickyShouldActivate,
        left: shouldAnchorToBoundary ? 0 : sidebarRect.left,
        mode: shouldAnchorToBoundary ? "absolute" : "fixed",
        top: shouldAnchorToBoundary ? anchoredTop : topOffset,
        width: sidebarRect.width
      };

      setStickyState((current) => {
        if (
          current.active === nextState.active &&
          current.left === nextState.left &&
          current.mode === nextState.mode &&
          current.top === nextState.top &&
          current.width === nextState.width
        ) {
          return current;
        }

        return nextState;
      });
    };

    evaluateStickyState();
    window.addEventListener("scroll", evaluateStickyState, { passive: true });
    window.addEventListener("resize", evaluateStickyState);

    return () => {
      window.removeEventListener("scroll", evaluateStickyState);
      window.removeEventListener("resize", evaluateStickyState);
    };
  }, []);

  return (
    <aside className="filter-sidebar" ref={sidebarRef}>
      <div className="filter-sidebar-original-content" ref={originalSidebarContentRef}>
        <div className="filter-sidebar-sticky-source" ref={sourceStickySectionsRef}>
          <StickyFilterSections
            checkedOptionIds={checkedOptionIds}
            mapButtonLabel={mapButtonLabel}
            onPriceChange={onPriceChange}
            onToggle={onToggle}
            popularSection={popularSection}
            priceBounds={priceBounds}
            priceRange={priceRange}
          />
        </div>

        {remainingSections.map((section) => (
          <HotelFilterSection
            checkedOptionIds={checkedOptionIds}
            key={section.id}
            onToggle={onToggle}
            section={section}
          />
        ))}
      </div>

      <div
        className={`filter-sidebar-sticky-overlay${stickyState.active ? " is-visible" : ""}`}
        style={{
          left: `${stickyState.left}px`,
          position: stickyState.mode,
          top: `${stickyState.top}px`,
          width: `${stickyState.width}px`
        }}
      >
        <StickyFilterSections
          checkedOptionIds={checkedOptionIds}
          mapButtonLabel={mapButtonLabel}
          onPriceChange={onPriceChange}
          onToggle={onToggle}
          popularSection={popularSection}
          priceBounds={priceBounds}
          priceRange={priceRange}
        />
      </div>
    </aside>
  );
};
