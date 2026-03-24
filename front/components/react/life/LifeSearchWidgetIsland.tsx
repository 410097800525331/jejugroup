import { useLayoutEffect } from "react";
import { LifeSearchWidget } from "./LifeSearchWidget";

export const SEARCH_WIDGET_MOUNTED_EVENT = "jeju:search-widget-mounted";

export const LifeSearchWidgetIsland = () => {
  useLayoutEffect(() => {
    document.dispatchEvent(new Event(SEARCH_WIDGET_MOUNTED_EVENT));
  }, []);

  return <LifeSearchWidget />;
};
