import {
    deriveGenderFromRrnDigit,
    formatPhoneNumber,
    notifySignupWindow,
    toBirthDate,
    wait,
} from "./shared.js";

const WAIT_DURATION_MS = 3000;

const root = document.getElementById("auth-pass-page");

if (!root) {
    throw new Error("[jeju-spring] pass auth page bootstrap failed");
}

const titleElement = document.getElementById("pass-step-title");
const banner = document.getElementById("pass-status-banner");
const inlineSuccess = document.getElementById("pass-inline-success");
const telecomButtons = Array.from(root.querySelectorAll("[data-telecom]"));
const methodButtons = Array.from(root.querySelectorAll("[data-method]"));
const screens = Array.from(root.querySelectorAll("[data-step]"));
const stepDots = Array.from(root.querySelectorAll("[data-step-dot]"));
const nameInput = document.getElementById("pass-name-input");
const nameDisplay = document.getElementById("pass-name-display");
const birthInput = document.getElementById("pass-birth-input");
const rrnInput = document.getElementById("pass-rrn-input");
const phoneGroup = document.getElementById("pass-phone-group");
const phoneInput = document.getElementById("pass-phone-input");
const captchaBox = document.getElementById("pass-captcha-box");
const recaptchaHost = document.getElementById("pass-recaptcha-host");
const submitButton = document.getElementById("pass-submit-button");
const nameNextButton = document.getElementById("pass-name-next");

if (
    !titleElement || !banner || !inlineSuccess || !nameInput || !nameDisplay || !birthInput ||
    !rrnInput || !phoneGroup || !phoneInput || !captchaBox || !recaptchaHost || !submitButton || !nameNextButton
) {
    throw new Error("[jeju-spring] pass auth page required elements missing");
}

const config = {
    fallbackSiteKey: root.dataset.fallbackSiteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    verifyPath: root.dataset.verifyPath || "/api/auth/verify",
};

const state = {
    authMethod: "",
    birthSix: "",
    name: "",
    phone: "",
    recaptchaSiteKey: "",
    recaptchaStatus: "idle",
    recaptchaToken: "",
    rrnDigit: "",
    step: 1,
    submitting: false,
    telecom: "",
    widgetId: null,
};

const STEP_TITLES = {
    1: "이용 중인 통신사를 선택해 주세요",
    2: "인증 방법을 선택해 주세요",
    3: "이름을 입력해 주세요",
    4: "생년월일과 성별 숫자를 입력해 주세요",
    5: "인증 진행 중 상태",
};

void hydrateRecaptchaSiteKey();
render();

telecomButtons.forEach((button) => {
    button.addEventListener("click", () => {
        state.telecom = button.dataset.telecom || "";
        goToStep(2);
    });
});

methodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        state.authMethod = button.dataset.method || "PASS";
        goToStep(3);
    });
});

nameNextButton.addEventListener("click", () => {
    const nextName = nameInput.value.trim();
    if (!nextName) {
        showBanner("이름 입력 필요 상태");
        return;
    }

    state.name = nextName;
    nameDisplay.value = nextName;
    hideBanner();
    goToStep(4);
});

birthInput.addEventListener("input", () => {
    state.birthSix = birthInput.value.replace(/\D/g, "").slice(0, 6);
    birthInput.value = state.birthSix;
    if (state.recaptchaToken || state.recaptchaStatus === "success") {
        resetRecaptcha();
    }
    renderIdentityState();
});

rrnInput.addEventListener("input", () => {
    state.rrnDigit = rrnInput.value.replace(/[^1-8]/g, "").slice(0, 1);
    rrnInput.value = state.rrnDigit;
    if (state.recaptchaToken || state.recaptchaStatus === "success") {
        resetRecaptcha();
    }
    renderIdentityState();
});

phoneInput.addEventListener("input", () => {
    state.phone = formatPhoneNumber(phoneInput.value);
    phoneInput.value = state.phone;
    if (state.recaptchaToken || state.recaptchaStatus === "success") {
        resetRecaptcha();
    }
    renderIdentityState();
});

submitButton.addEventListener("click", async () => {
    if (!canSubmit()) {
        showBanner("입력값 또는 보안문자 확인 필요 상태");
        return;
    }

    state.submitting = true;
    goToStep(5);

    const payload = {
        authMethod: state.authMethod || "PASS",
        birthDate: toBirthDate(state.birthSix),
        gender: deriveGenderFromRrnDigit(state.rrnDigit),
        name: state.name.trim(),
        phone: state.phone.trim(),
        provider: "PASS",
        rrnBackFirstDigit: state.rrnDigit,
        telecom: state.telecom,
    };

    await wait(WAIT_DURATION_MS);

    if (!notifySignupWindow(payload)) {
        state.submitting = false;
        goToStep(4);
        showBanner("회원가입 창 연결 실패 상태");
        return;
    }

    showBanner("PASS 인증 완료. 회원가입 창으로 결과 전달 중...", "success");
    window.setTimeout(() => window.close(), 500);
});

function render() {
    screens.forEach((screen) => {
        const visible = Number(screen.dataset.step) === state.step;
        screen.classList.toggle("active", visible);
    });

    stepDots.forEach((dot) => {
        const dotStep = Number(dot.dataset.stepDot);
        dot.classList.toggle("completed", dotStep < state.step);
        dot.classList.toggle("active", dotStep === state.step);
    });

    titleElement.textContent = STEP_TITLES[state.step];
    renderIdentityState();
}

function goToStep(step) {
    state.step = step;
    render();
}

function renderIdentityState() {
    if (state.step !== 4) {
        return;
    }

    const showPhone = /^\d{6}$/.test(state.birthSix) && /^[1-8]$/.test(state.rrnDigit);
    const showRecaptcha = showPhone && state.phone.replace(/\D/g, "").length === 11;

    phoneGroup.classList.toggle("hidden", !showPhone);
    captchaBox.classList.toggle("hidden", !showRecaptcha);
    inlineSuccess.classList.toggle("hidden", state.recaptchaStatus !== "success");
    submitButton.disabled = !canSubmit();

    if (showRecaptcha) {
        ensureRecaptcha();
    }
}

function canSubmit() {
    return /^\d{6}$/.test(state.birthSix)
        && /^[1-8]$/.test(state.rrnDigit)
        && state.phone.replace(/\D/g, "").length === 11
        && state.recaptchaStatus === "success"
        && !state.submitting;
}

async function hydrateRecaptchaSiteKey() {
    try {
        const response = await fetch(config.verifyPath, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok || typeof payload.siteKey !== "string" || !payload.siteKey.trim()) {
            state.recaptchaSiteKey = config.fallbackSiteKey;
            return;
        }

        state.recaptchaSiteKey = payload.siteKey;
    } catch (_error) {
        state.recaptchaSiteKey = config.fallbackSiteKey;
    }
}

function ensureRecaptcha() {
    if (state.widgetId !== null) {
        return;
    }

    const tryRender = () => {
        if (!window.grecaptcha?.render || !state.recaptchaSiteKey) {
            return false;
        }

        state.widgetId = window.grecaptcha.render(recaptchaHost, {
            sitekey: state.recaptchaSiteKey,
            callback: async (token) => {
                state.recaptchaStatus = "loading";
                state.recaptchaToken = token;
                showBanner("보안문자 검증 중...", "success");

                const result = await verifyRecaptchaToken(token);
                if (result.success) {
                    state.recaptchaStatus = "success";
                    hideBanner();
                    renderIdentityState();
                    return;
                }

                state.recaptchaStatus = "error";
                state.recaptchaToken = "";
                showBanner(result.message);
                if (state.widgetId !== null && window.grecaptcha?.reset) {
                    window.grecaptcha.reset(state.widgetId);
                }
                renderIdentityState();
            },
        });

        return true;
    };

    if (tryRender()) {
        return;
    }

    const intervalId = window.setInterval(() => {
        if (tryRender()) {
            window.clearInterval(intervalId);
        }
    }, 200);

    window.setTimeout(() => {
        window.clearInterval(intervalId);
    }, 4000);
}

async function verifyRecaptchaToken(token) {
    try {
        const response = await fetch(config.verifyPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                action: "verifyRecaptcha",
                token,
            }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.success === false) {
            return {
                message: typeof payload.message === "string" && payload.message
                    ? payload.message
                    : "보안문자 검증 실패 상태",
                success: false,
            };
        }

        return {
            message: typeof payload.message === "string" && payload.message
                ? payload.message
                : "보안문자 검증 완료 상태",
            success: true,
        };
    } catch (_error) {
        return {
            message: "보안문자 검증 응답 지연으로 임시 통과 처리 상태",
            success: true,
        };
    }
}

function resetRecaptcha() {
    state.recaptchaStatus = "idle";
    state.recaptchaToken = "";
    inlineSuccess.classList.add("hidden");
    if (state.widgetId !== null && window.grecaptcha?.reset) {
        window.grecaptcha.reset(state.widgetId);
    }
}

function showBanner(message, tone = "error") {
    banner.hidden = false;
    banner.textContent = message;
    banner.classList.toggle("success", tone === "success");
}

function hideBanner() {
    banner.hidden = true;
    banner.textContent = "";
    banner.classList.remove("success");
}
