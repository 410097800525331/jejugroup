import type { SearchDestinationColumn } from "./types";

interface SearchDestinationDropdownProps {
  dropdownId: string;
  isOpen: boolean;
  columns: SearchDestinationColumn[];
  onInteract: (event: React.MouseEvent<HTMLElement>) => void;
  onSelect: (value: string) => void;
}

export const SearchDestinationDropdown = ({
  dropdownId,
  isOpen,
  columns,
  onInteract,
  onSelect
}: SearchDestinationDropdownProps) => {
  return (
    <div className={`destination-dropdown${isOpen ? " active" : ""}`} id={dropdownId} onClick={onInteract}>
      <div className="dropdown-columns">
        {columns.map((column) => (
          <div className="dropdown-column" key={column.title}>
            <div className="dropdown-header" data-lang={column.titleLang}>
              {column.title}
            </div>
            <ul className="destination-list">
              {column.items.map((item) => (
                <li
                  className="destination-item"
                  data-value={item.value}
                  key={item.value}
                  onClick={() => {
                    onSelect(item.value);
                  }}
                >
                  <img alt={item.alt} src={item.image} />
                  <div className="destination-info">
                    <span className="destination-name" data-lang={item.nameLang}>
                      {item.name}
                    </span>
                    <span className="destination-count">{item.count}</span>
                    <span className="destination-desc" data-lang={item.descLang}>
                      {item.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
