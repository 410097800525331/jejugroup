export const PASS_AUTH_MESSAGE_TYPE = "JEJU_PASS_AUTH_SUCCESS";

export function openCenteredPopup(url, name, width, height) {
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

    return window.open(
        url,
        name,
        `width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
    );
}

export function isPassAuthSuccessMessage(value) {
    return Boolean(
        value &&
        typeof value === "object" &&
        value.type === PASS_AUTH_MESSAGE_TYPE &&
        value.source === "jeju-pass-auth" &&
        value.payload
    );
}

export function notifySignupWindow(payload) {
    if (!window.opener || window.opener.closed) {
        return false;
    }

    window.opener.postMessage({
        payload,
        source: "jeju-pass-auth",
        type: PASS_AUTH_MESSAGE_TYPE,
    }, window.location.origin);
    return true;
}

export function formatPhoneNumber(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) {
        return digits;
    }
    if (digits.length < 8) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    if (digits.length === 10) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function deriveGenderFromRrnDigit(value) {
    if (value === "1" || value === "3" || value === "5" || value === "7") {
        return "M";
    }

    if (value === "2" || value === "4" || value === "6" || value === "8") {
        return "F";
    }

    return "";
}

export function toBirthDate(birthSix) {
    if (!/^\d{6}$/.test(birthSix)) {
        return "";
    }

    return `${birthSix.slice(0, 2)}-${birthSix.slice(2, 4)}-${birthSix.slice(4, 6)}`;
}

export function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
}
