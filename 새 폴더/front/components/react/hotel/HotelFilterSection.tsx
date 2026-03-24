import type { HotelListFilterSection as HotelListFilterSectionData } from "./hotelListPageData";

interface HotelFilterSectionProps {
  checkedOptionIds: Set<string>;
  onToggle: (optionId: string) => void;
  section: HotelListFilterSectionData;
}

export const HotelFilterSection = ({ checkedOptionIds, onToggle, section }: HotelFilterSectionProps) => {
  return (
    <div className="filter-section">
      <h3 className="filter-title">{section.title}</h3>
      <div className="filter-items">
        {section.options.map((option) => {
          const isChecked = checkedOptionIds.has(option.id);

          return (
            <label className="filter-checkbox" key={option.id}>
              <input
                checked={isChecked}
                onChange={() => {
                  onToggle(option.id);
                }}
                type="checkbox"
              />
              <span>
                {option.label}
                {typeof option.count === "number" ? <span className="count">({option.count})</span> : null}
                {option.description ? (
                  <span className="filter-option-description">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
