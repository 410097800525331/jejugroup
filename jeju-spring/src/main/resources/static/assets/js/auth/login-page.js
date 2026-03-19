const SAVED_ID_KEY = "jeju:spring:login-saved-id";

const root = document.getElementById("auth-login-page");
const form = document.getElementById("auth-login-form");
const idInput = document.getElementById("login-id");
const passwordInput = document.getElementById("login-password");
const saveIdCheckbox = document.getElementById("login-save-id");
const submitButton = document.getElementById("auth-login-submit");
const statusBanner = document.getElementById("auth-login-status");

if (!root || !form || !idInput || !passwordInput || !saveIdCheckbox || !submitButton || !statusBanner) {
    throw new Error("[jeju-spring] auth login page bootstrap failed");
}

const config = {
    adminPath: root.dataset.adminPath || "/admin/pages/dashboard.html",
    homePath: root.dataset.homePath || "/index.html",
    loginPath: root.dataset.loginPath || "/api/auth/login",
    migrationPath: root.dataset.migrationPath || "/migration",
    sessionPath: root.dataset.sessionPath || "/api/auth/session",
};

hydrateSavedId();
void restoreSession();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loginId = idInput.value.trim();
    const password = passwordInput.value;

    if (!loginId || !password) {
        showStatus("아이디와 비밀번호를 입력해라.");
        return;
    }

    lockForm(true);
    showStatus("로그인 요청 보내는 중...", "success");

    try {
        const response = await fetch(config.loginPath, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                id: loginId,
                pw: password,
            }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = payload && typeof payload.message === "string" && payload.message
                ? payload.message
                : resolveFallbackMessage(response.status);
            throw new Error(message);
        }

        persistSavedId(loginId);
        showStatus("로그인 성공. 이동 중...", "success");

        const redirect = resolveRedirectTarget(payload?.user);
        window.location.replace(redirect);
    } catch (error) {
        showStatus(resolveMessage(error));
        lockForm(false);
    }
});

async function restoreSession() {
    try {
        const response = await fetch(config.sessionPath, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            return;
        }

        const payload = await response.json().catch(() => ({}));
        if (!payload?.user) {
            return;
        }

        showStatus("이미 로그인된 세션이 있다. 이동 중...", "success");
        window.location.replace(resolveRedirectTarget(payload.user));
    } catch (_error) {
        // session probe failure should not block page usage
    }
}

function resolveRedirectTarget(user) {
    const redirectParam = new URLSearchParams(window.location.search).get("redirect");

    if (isSafeRedirect(redirectParam)) {
        return redirectParam;
    }

    if (user && typeof user.role === "string" && user.role.toUpperCase() === "ADMIN") {
        return config.adminPath;
    }

    return config.homePath || config.migrationPath;
}

function isSafeRedirect(value) {
    if (!value || typeof value !== "string") {
        return false;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return false;
    }

    const lowered = trimmed.toLowerCase();
    return !(lowered.startsWith("javascript:") || lowered.startsWith("data:"));
}

function hydrateSavedId() {
    const savedId = window.localStorage.getItem(SAVED_ID_KEY);
    if (!savedId) {
        return;
    }

    idInput.value = savedId;
    saveIdCheckbox.checked = true;
}

function persistSavedId(loginId) {
    if (saveIdCheckbox.checked) {
        window.localStorage.setItem(SAVED_ID_KEY, loginId);
        return;
    }

    window.localStorage.removeItem(SAVED_ID_KEY);
}

function lockForm(locked) {
    idInput.disabled = locked;
    passwordInput.disabled = locked;
    saveIdCheckbox.disabled = locked;
    submitButton.disabled = locked;
}

function showStatus(message, tone = "error") {
    statusBanner.hidden = false;
    statusBanner.textContent = message;
    statusBanner.classList.toggle("success", tone === "success");
}

function resolveMessage(error) {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return "로그인 처리 중 알 수 없는 에러가 발생했다.";
}

function resolveFallbackMessage(status) {
    if (status === 404) {
        return "기존 로그인 API가 아직 연결되지 않았다. 다음 슬라이스에서 Spring MVC auth 전환이 필요하다.";
    }

    if (status >= 500) {
        return "서버 쪽에서 로그인 처리 중 에러가 났다.";
    }

    return "로그인에 실패했다.";
}
