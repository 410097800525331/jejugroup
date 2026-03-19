import {
    isPassAuthSuccessMessage,
    openCenteredPopup,
} from "./shared.js";

const root = document.getElementById("auth-signup-page");
const form = document.getElementById("auth-signup-form");
const idInput = document.getElementById("signup-id");
const idFeedback = document.getElementById("signup-id-feedback");
const idCheckButton = document.getElementById("signup-id-check");
const submitButton = document.getElementById("auth-signup-submit");
const statusBanner = document.getElementById("auth-signup-status");
const termsCheckbox = document.getElementById("signup-agree-terms");
const passwordInput = document.getElementById("signup-password");
const passwordConfirmInput = document.getElementById("signup-password-confirm");
const passPopupButton = document.getElementById("auth-open-pass-popup");
const passAuthLink = document.getElementById("auth-pass-auth-link");
const phoneInput = document.getElementById("signup-phone");
const nameInput = document.getElementById("signup-name");
const birthDateInput = document.getElementById("signup-birth-date");
const rrnDigitInput = document.getElementById("signup-rrn-digit");

if (
    !root || !form || !idInput || !idFeedback || !idCheckButton || !submitButton ||
    !statusBanner || !termsCheckbox || !passwordInput || !passwordConfirmInput ||
    !passPopupButton || !passAuthLink || !phoneInput || !nameInput || !birthDateInput || !rrnDigitInput
) {
    throw new Error("[jeju-spring] auth signup page bootstrap failed");
}

const config = {
    loginPath: root.dataset.loginPath || "/pages/auth/login.html",
    provider: root.dataset.provider || "PASS",
    signupPath: root.dataset.signupPath || "/api/auth/signup",
    verifyPath: root.dataset.verifyPath || "/api/auth/verify",
};

let idAvailability = {
    checked: false,
    value: "",
};

window.addEventListener("message", handlePassAuthMessage);

passPopupButton.addEventListener("click", openPassAuthPopup);
passAuthLink.addEventListener("click", (event) => {
    event.preventDefault();
    openPassAuthPopup();
});

idInput.addEventListener("input", () => {
    idAvailability = { checked: false, value: "" };
    setIdFeedback("가입 전에 아이디 중복 확인이 필요하다.", "");
});

idCheckButton.addEventListener("click", async () => {
    const userId = idInput.value.trim();
    if (!userId) {
        setIdFeedback("중복 확인할 아이디를 먼저 입력해라.", "error");
        return;
    }

    lockCheckButton(true);
    setIdFeedback("아이디 확인 중...", "");

    try {
        const result = await verifyIdAvailability(userId);
        if (!result.available) {
            idAvailability = { checked: false, value: "" };
            setIdFeedback(result.message, "error");
            return;
        }

        idAvailability = { checked: true, value: userId };
        setIdFeedback(result.message, "success");
    } catch (error) {
        setIdFeedback(resolveMessage(error), "error");
    } finally {
        lockCheckButton(false);
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = buildPayload();
    const validationMessage = validatePayload(payload);
    if (validationMessage) {
        showStatus(validationMessage);
        return;
    }

    if (!idAvailability.checked || idAvailability.value !== payload.id) {
        showStatus("아이디 중복 확인부터 끝내라.");
        return;
    }

    lockForm(true);
    showStatus("회원가입 요청 보내는 중...", "success");

    try {
        const response = await fetch(config.signupPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(payload),
        });

        const responseBody = await response.json().catch(() => ({}));

        if (!response.ok || responseBody.success === false) {
            const message = responseBody && typeof responseBody.message === "string" && responseBody.message
                ? responseBody.message
                : `회원가입 처리 실패 상태 (${response.status})`;
            throw new Error(message);
        }

        showStatus("회원가입 완료. 로그인 페이지로 이동한다.", "success");
        window.setTimeout(() => {
            window.location.replace(config.loginPath);
        }, 1200);
    } catch (error) {
        showStatus(resolveMessage(error));
        lockForm(false);
    }
});

async function verifyIdAvailability(userId) {
    const response = await fetch(config.verifyPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            action: "checkId",
            id: userId,
        }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.success === false) {
        return {
            available: false,
            message: typeof payload.message === "string" && payload.message
                ? payload.message
                : "이미 사용 중인 아이디 상태",
        };
    }

    return {
        available: true,
        message: typeof payload.message === "string" && payload.message
            ? payload.message
            : "사용 가능한 아이디 상태",
    };
}

function buildPayload() {
    const formData = new FormData(form);

    return {
        birthDate: normalizeBirthDate(String(formData.get("birthDate") || "")),
        email: String(formData.get("email") || "").trim(),
        id: String(formData.get("id") || "").trim(),
        name: String(formData.get("name") || "").trim(),
        phone: normalizeDigits(String(formData.get("phone") || "")),
        provider: config.provider,
        pw: String(formData.get("pw") || ""),
        rrnBackFirstDigit: normalizeDigits(String(formData.get("rrnBackFirstDigit") || "")).slice(0, 1),
    };
}

function validatePayload(payload) {
    if (!payload.name || !payload.id || !payload.email || !payload.phone || !payload.birthDate || !payload.rrnBackFirstDigit || !payload.pw) {
        return "필수 입력값부터 다 채워라.";
    }

    if (!/^[A-Za-z0-9_]{4,20}$/.test(payload.id)) {
        return "아이디는 4~20자의 영문, 숫자, 언더스코어만 허용한다.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        return "이메일 형식이 틀렸다.";
    }

    if (!/^01\d{8,9}$/.test(payload.phone)) {
        return "휴대폰 번호는 숫자만 입력해라.";
    }

    if (!/^\d{2}-\d{2}-\d{2}$/.test(payload.birthDate)) {
        return "생년월일은 YY-MM-DD 형식으로 입력해라.";
    }

    if (!/^[1-8]$/.test(payload.rrnBackFirstDigit)) {
        return "주민번호 뒤 첫 자리는 1~8만 허용한다.";
    }

    if (payload.pw.length < 8) {
        return "비밀번호는 8자 이상으로 잡아라.";
    }

    if (passwordInput.value !== passwordConfirmInput.value) {
        return "비밀번호 확인이 일치하지 않는다.";
    }

    if (!termsCheckbox.checked) {
        return "이용약관 동의는 필수다.";
    }

    return "";
}

function normalizeBirthDate(value) {
    const digits = normalizeDigits(value);
    if (digits.length !== 6) {
        return value.trim();
    }

    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
}

function normalizeDigits(value) {
    return value.replace(/\D/g, "");
}

function lockForm(locked) {
    Array.from(form.elements).forEach((element) => {
        if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
            element.disabled = locked;
        }
    });
}

function lockCheckButton(locked) {
    idCheckButton.disabled = locked;
}

function setIdFeedback(message, tone) {
    idFeedback.textContent = message;
    idFeedback.classList.remove("success", "error");
    if (tone) {
        idFeedback.classList.add(tone);
    }
}

function showStatus(message, tone = "error") {
    statusBanner.hidden = false;
    statusBanner.textContent = message;
    statusBanner.classList.toggle("success", tone === "success");
}

function openPassAuthPopup() {
    const popup = openCenteredPopup(passAuthLink.href, "PASS_Auth_Popup", 430, 800);

    if (!popup) {
        showStatus("팝업 차단 해제 필요 상태");
        return;
    }

    showStatus("PASS 인증 완료 후 자동 반영 예정 상태", "success");
}

function handlePassAuthMessage(event) {
    if (event.origin !== window.location.origin) {
        return;
    }

    const message = event.data;
    if (!isPassAuthSuccessMessage(message)) {
        return;
    }

    const payload = message.payload;
    nameInput.value = payload.name || "";
    phoneInput.value = payload.phone || "";
    birthDateInput.value = payload.birthDate || "";
    rrnDigitInput.value = payload.rrnBackFirstDigit || "";
    showStatus("PASS 인증 정보 반영 완료. 나머지 가입 정보를 입력해라.", "success");
}

function resolveMessage(error) {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return "회원가입 처리 중 알 수 없는 에러가 발생했다.";
}
