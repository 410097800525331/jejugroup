import { HotelShellIcon } from "@front-components/layout/HotelShellIcon";
import type { SearchTabItem } from "./types";

interface SearchTabsProps {
  activeTab: string;
  items: SearchTabItem[];
  onTabChange: (tab: string) => void;
  onInteract: (event: React.MouseEvent<HTMLElement>) => void;
}

export const SearchTabs = ({ activeTab, items, onTabChange, onInteract }: SearchTabsProps) => {
  return (
    <div className="search-tabs-large" onClick={onInteract}>
      {items.map((tab) => (
        <button
          className={`search-tab-large${activeTab === tab.tab ? " active" : ""}`}
          data-tab={tab.tab}
          key={tab.tab}
          onClick={() => {
            onTabChange(tab.tab);
          }}
          type="button"
        >
          <HotelShellIcon className="search-tab-icon" name={tab.icon} />
          <span data-lang={tab.dataLang}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
