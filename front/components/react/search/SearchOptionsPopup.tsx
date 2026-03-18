import type { SearchOptionItem } from "./types";

interface SearchOptionsPopupProps {
  popupId: string;
  isOpen: boolean;
  options: SearchOptionItem[];
  selectedValues: string[];
  onInteract: (event: React.MouseEvent<HTMLElement>) => void;
  onToggle: (value: string) => void;
}

export const SearchOptionsPopup = ({
  popupId,
  isOpen,
  options,
  selectedValues,
  onInteract,
  onToggle
}: SearchOptionsPopupProps) => {
  return (
    <div className={`options-popup-new${isOpen ? " active" : ""}`} id={popupId} onClick={onInteract}>
      <div className="options-grid">
        {options.map((option) => (
          <label className="option-check-item" key={option.value}>
            <span className="option-name" data-lang={option.dataLang}>
              {option.label}
            </span>
            <input
              checked={selectedValues.includes(option.value)}
              className="option-checkbox"
              onChange={() => {
                onToggle(option.value);
              }}
              type="checkbox"
              value={option.value}
            />
          </label>
        ))}
      </div>
    </div>
  );
};
