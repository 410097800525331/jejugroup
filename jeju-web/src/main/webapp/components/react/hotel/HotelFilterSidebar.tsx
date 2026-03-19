import type { HotelListFilterSection as HotelListFilterSectionData } from "./hotelListPageData";
import { HotelFilterSection } from "./HotelFilterSection";

interface HotelFilterSidebarProps {
  checkedOptionIds: Set<string>;
  mapButtonLabel: string;
  onToggle: (optionId: string) => void;
  sections: HotelListFilterSectionData[];
}

export const HotelFilterSidebar = ({
  checkedOptionIds,
  mapButtonLabel,
  onToggle,
  sections
}: HotelFilterSidebarProps) => {
  return (
    <aside className="filter-sidebar">
      <div className="map-banner-widget">
        <div className="map-bg"></div>
        <button className="map-btn" type="button">
          {mapButtonLabel}
        </button>
      </div>

      {sections.map((section) => (
        <HotelFilterSection
          checkedOptionIds={checkedOptionIds}
          key={section.id}
          onToggle={onToggle}
          section={section}
        />
      ))}
    </aside>
  );
};
