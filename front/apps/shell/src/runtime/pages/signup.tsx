import { SignupApp } from "@front-components/auth";
import { mountIsland } from "@runtime/pages/islandMount";

export const mountSignupRuntime = () => {
  mountIsland("jeju-signup-app", <SignupApp />);
};
