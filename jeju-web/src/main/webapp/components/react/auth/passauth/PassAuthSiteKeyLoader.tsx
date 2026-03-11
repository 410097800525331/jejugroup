import { useEffect } from "react";
import { fetchRecaptchaSiteKey } from "@front-components/auth/services/passAuthApi";
import { useAuthActions, useAuthState } from "@front-components/auth/state/context";

export const PassAuthSiteKeyLoader = () => {
  const { passAuth } = useAuthState();
  const actions = useAuthActions();

  useEffect(() => {
    let active = true;

    if (passAuth.recaptchaSiteKey) {
      return;
    }

    const load = async () => {
      const siteKey = await fetchRecaptchaSiteKey();
      if (!active) {
        return;
      }

      actions.patchPassAuth({ recaptchaSiteKey: siteKey });
    };

    void load();

    return () => {
      active = false;
    };
  }, [actions, passAuth.recaptchaSiteKey]);

  return null;
};
