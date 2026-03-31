import { LoginApp } from "@front-components/auth";
import { mountIsland } from "@runtime/pages/islandMount";

export const mountLoginRuntime = () => {
  mountIsland("jeju-login-app", <LoginApp />);
};
