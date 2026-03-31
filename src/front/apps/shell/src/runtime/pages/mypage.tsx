import { MyPageDashboardApp } from "@front-components/mypage";
import { mountIsland } from "@runtime/pages/islandMount";

export const mountMyPageDashboardRuntime = () => {
  mountIsland("mypage-dashboard-root", <MyPageDashboardApp />);
};
