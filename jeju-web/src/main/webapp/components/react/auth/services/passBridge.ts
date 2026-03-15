import type { PassAuthMethod } from "@front-components/auth/state/types";
import { resolveRoute } from "@front-core-utils/path_resolver.js";

export const PASS_AUTH_MESSAGE_TYPE = "JEJU_PASS_AUTH_SUCCESS";

export interface PassAuthSuccessPayload {
  authMethod: PassAuthMethod;
  birthDate: string;
  gender: string;
  name: string;
  phone: string;
  provider: "PASS";
  rrnBackFirstDigit: string;
  telecom: string;
}

interface PassAuthSuccessMessage {
  payload: PassAuthSuccessPayload;
  source: "jeju-pass-auth";
  type: typeof PASS_AUTH_MESSAGE_TYPE;
}

export const openPassAuthPopup = () => {
  const width = 430;
  const height = 800;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
  const popupUrl = resolveRoute("AUTH.PASS_AUTH");

  return window.open(
    popupUrl,
    "PASS_Auth_Popup",
    `width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)},toolbar=no,menubar=no,scrollbars=yes,resizable=no`,
  );
};

export const createPassAuthSuccessMessage = (payload: PassAuthSuccessPayload): PassAuthSuccessMessage => ({
  payload,
  source: "jeju-pass-auth",
  type: PASS_AUTH_MESSAGE_TYPE,
});

export const isPassAuthSuccessMessage = (value: unknown): value is PassAuthSuccessMessage => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<PassAuthSuccessMessage>;
  return message.type === PASS_AUTH_MESSAGE_TYPE && message.source === "jeju-pass-auth" && Boolean(message.payload);
};

export const notifySignupWindow = (payload: PassAuthSuccessPayload) => {
  if (!window.opener || window.opener.closed) {
    return false;
  }

  window.opener.postMessage(createPassAuthSuccessMessage(payload), window.location.origin);
  return true;
};
