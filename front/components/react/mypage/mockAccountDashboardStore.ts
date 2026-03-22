export const MYPAGE_DASHBOARD_MOCK_EVENT_NAME = "jeju:mypage-dashboard-mock-updated";
export const MYPAGE_DASHBOARD_MOCK_STORAGE_PREFIX = "jeju:mypage-dashboard:";

const SESSION_ACCOUNT_KEYS = ["id", "memberId", "userId", "email", "loginId", "username"] as const;
const SESSION_NESTED_KEYS = ["user", "member", "profile", "data", "session"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const toText = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
};

const normalizeAccountKey = (value: string) => {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".");
  return normalized.replace(/^\.+|\.+$/g, "");
};

const collectSessionRecords = (session: unknown) => {
  const records: Record<string, unknown>[] = [];

  if (!isRecord(session)) {
    return records;
  }

  records.push(session);

  for (const key of SESSION_NESTED_KEYS) {
    const value = session[key];
    if (isRecord(value)) {
      records.push(value);
    }
  }

  return records;
};

export const resolveDashboardMockAccountKey = (session: unknown): string | null => {
  const records = collectSessionRecords(session);

  for (const record of records) {
    for (const key of SESSION_ACCOUNT_KEYS) {
      const candidate = toText(record[key]);
      if (!candidate) {
        continue;
      }

      const normalized = normalizeAccountKey(candidate);
      if (normalized) {
        return normalized;
      }
    }
  }

  return null;
};

export const buildDashboardMockStorageKey = (accountKey: string) => `${MYPAGE_DASHBOARD_MOCK_STORAGE_PREFIX}${accountKey}`;

const parseStoredMock = (rawValue: string | null) => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const emitDashboardMockUpdate = (accountKey: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(MYPAGE_DASHBOARD_MOCK_EVENT_NAME, {
      detail: { accountKey },
    }),
  );
};

export const readAccountDashboardMock = (session: unknown): Record<string, unknown> | null => {
  const accountKey = resolveDashboardMockAccountKey(session);
  if (!accountKey) {
    return null;
  }

  try {
    return parseStoredMock(localStorage.getItem(buildDashboardMockStorageKey(accountKey)));
  } catch {
    return null;
  }
};

export const mergeDashboardSources = (base: unknown, override: unknown): Record<string, unknown> | null => {
  const baseRecord = isRecord(base) ? base : {};
  const overrideRecord = isRecord(override) ? override : {};

  if (Object.keys(baseRecord).length === 0 && Object.keys(overrideRecord).length === 0) {
    return null;
  }

  const merged: Record<string, unknown> = {
    ...baseRecord,
    ...overrideRecord,
  };

  for (const key of SESSION_NESTED_KEYS) {
    const baseValue = baseRecord[key];
    const overrideValue = overrideRecord[key];

    if (isRecord(baseValue) || isRecord(overrideValue)) {
      merged[key] = {
        ...(isRecord(baseValue) ? baseValue : {}),
        ...(isRecord(overrideValue) ? overrideValue : {}),
      };
    }
  }

  return merged;
};

export const writeAccountDashboardMock = (session: unknown, payload: Record<string, unknown>) => {
  const accountKey = resolveDashboardMockAccountKey(session);
  if (!accountKey) {
    return false;
  }

  try {
    localStorage.setItem(buildDashboardMockStorageKey(accountKey), JSON.stringify(payload));
    emitDashboardMockUpdate(accountKey);
    return true;
  } catch {
    return false;
  }
};

export const patchAccountDashboardMock = (session: unknown, patch: Record<string, unknown>) => {
  const nextPayload = mergeDashboardSources(readAccountDashboardMock(session), patch);
  if (!nextPayload) {
    return false;
  }

  return writeAccountDashboardMock(session, nextPayload);
};

export const clearAccountDashboardMock = (session: unknown) => {
  const accountKey = resolveDashboardMockAccountKey(session);
  if (!accountKey) {
    return false;
  }

  try {
    localStorage.removeItem(buildDashboardMockStorageKey(accountKey));
    emitDashboardMockUpdate(accountKey);
    return true;
  } catch {
    return false;
  }
};
