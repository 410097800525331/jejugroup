import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { API_BASE_URL } from "../../../core/modules/config/api_config.module.js";
import type { CompanionInviteDirection, CompanionInviteItem, CompanionInviteStatus } from "./types";

interface UseCompanionInvitesOptions {
  enabled?: boolean;
}

const INVITE_LIST_ENDPOINT = "/api/mypage/companion-invites";

const INVITE_STATUS_VALUES: CompanionInviteStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "expired",
];

const INVITE_DIRECTION_VALUES: CompanionInviteDirection[] = ["sent", "received"];

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

const toNullableText = (value: unknown): string | undefined => toText(value) ?? undefined;

const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = API_BASE_URL?.trim();

  if (!baseUrl) {
    return normalizedPath;
  }

  return new URL(normalizedPath, baseUrl).toString();
};

const normalizeStatus = (value: unknown): CompanionInviteStatus => {
  if (typeof value !== "string") {
    return "pending";
  }

  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return INVITE_STATUS_VALUES.includes(normalized as CompanionInviteStatus)
    ? (normalized as CompanionInviteStatus)
    : "pending";
};

const normalizeDirection = (value: unknown): CompanionInviteDirection => {
  if (typeof value !== "string") {
    return "received";
  }

  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return INVITE_DIRECTION_VALUES.includes(normalized as CompanionInviteDirection)
    ? (normalized as CompanionInviteDirection)
    : "received";
};

const extractMessage = (payload: unknown, fallbackMessage: string) => {
  if (isRecord(payload)) {
    const message = payload.message ?? payload.error;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallbackMessage;
};

const collectInviteEntries = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const keys = ["invites", "items", "results", "data"] as const;
  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value;
    }
    if (isRecord(value) && Array.isArray(value.items)) {
      return value.items;
    }
    if (isRecord(value) && Array.isArray(value.results)) {
      return value.results;
    }
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const toInviteItem = (value: unknown): CompanionInviteItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = typeof value.id === "number" && Number.isFinite(value.id) ? value.id : Number(value.id);
  const senderUserId = toText(value.senderUserId ?? value.sender_user_id ?? value.senderId ?? value.sender_id);
  const receiverUserId = toText(value.receiverUserId ?? value.receiver_user_id ?? value.receiverId ?? value.receiver_id);
  const senderName = toText(value.senderName ?? value.sender_name ?? value.senderDisplayName ?? value.senderDisplayName);
  const receiverName = toText(value.receiverName ?? value.receiver_name ?? value.receiverDisplayName ?? value.receiverDisplayName);

  if (!Number.isFinite(id) || !senderUserId || !receiverUserId || !senderName || !receiverName) {
    return null;
  }

  return {
    createdAt: toNullableText(value.createdAt ?? value.created_at),
    direction: normalizeDirection(value.direction ?? value.inviteDirection ?? value.invite_direction),
    expiresAt: toNullableText(value.expiresAt ?? value.expires_at),
    id,
    receiverAvatarUrl: toNullableText(value.receiverAvatarUrl ?? value.receiver_avatar_url),
    receiverBio: toNullableText(value.receiverBio ?? value.receiver_bio),
    receiverName,
    receiverUserId,
    respondedAt: toNullableText(value.respondedAt ?? value.responded_at),
    senderAvatarUrl: toNullableText(value.senderAvatarUrl ?? value.sender_avatar_url),
    senderBio: toNullableText(value.senderBio ?? value.sender_bio),
    senderName,
    senderUserId,
    status: normalizeStatus(value.status ?? value.inviteStatus ?? value.invite_status),
  };
};

const resolveApiErrorMessage = (payload: unknown, fallbackMessage: string) =>
  extractMessage(payload, fallbackMessage);

export const useCompanionInvites = (options: UseCompanionInvitesOptions = {}) => {
  const { enabled = true } = options;
  const [invites, setInvites] = useState<CompanionInviteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<{ message: string } | null>(null);
  const activeRequestIdRef = useRef(0);

  const pendingReceivedInvites = useMemo(
    () => invites.filter((invite) => invite.direction === "received" && invite.status === "pending"),
    [invites],
  );

  const refreshInvites = useCallback(async () => {
    const requestId = ++activeRequestIdRef.current;
    setIsLoading(true);
    setErrorObj(null);

    try {
      const response = await fetch(buildApiUrl(INVITE_LIST_ENDPOINT), {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        throw new Error("로그인이 필요합니다.");
      }

      if (!response.ok || (isRecord(payload) && payload.success === false)) {
        throw new Error(resolveApiErrorMessage(payload, "동행 초대를 불러오지 못했다"));
      }

      const normalizedInvites = collectInviteEntries(payload)
        .map(toInviteItem)
        .filter((invite): invite is CompanionInviteItem => invite !== null);

      if (requestId !== activeRequestIdRef.current) {
        return normalizedInvites;
      }

      setInvites(normalizedInvites);
      return normalizedInvites;
    } catch (error) {
      if (requestId !== activeRequestIdRef.current) {
        return [];
      }

      setInvites([]);
      setErrorObj({
        message: error instanceof Error && error.message.trim() ? error.message : "동행 초대를 불러오지 못했다",
      });
      return [];
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    void refreshInvites();
    return () => {
      activeRequestIdRef.current += 1;
    };
  }, [enabled, refreshInvites]);

  const runInviteAction = useCallback(
    async (inviteId: number, action: "accept" | "reject") => {
      const endpoint = action === "accept" ? "accept" : "reject";
      setErrorObj(null);

      try {
        const response = await fetch(buildApiUrl(`${INVITE_LIST_ENDPOINT}/${inviteId}/${endpoint}`), {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          method: "POST",
        });

        const payload = await response.json().catch(() => null);

        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        }

        if (!response.ok || (isRecord(payload) && payload.success === false)) {
          throw new Error(resolveApiErrorMessage(payload, "동행 초대를 처리하지 못했다"));
        }

        await refreshInvites();
        return true;
      } catch (error) {
        setErrorObj({
          message: error instanceof Error && error.message.trim() ? error.message : "동행 초대를 처리하지 못했다",
        });
        return false;
      }
    },
    [refreshInvites],
  );

  const acceptInvite = useCallback(
    async (inviteId: number) => runInviteAction(inviteId, "accept"),
    [runInviteAction],
  );

  const rejectInvite = useCallback(
    async (inviteId: number) => runInviteAction(inviteId, "reject"),
    [runInviteAction],
  );

  return {
    acceptInvite,
    errorObj,
    isLoading,
    pendingInviteCount: pendingReceivedInvites.length,
    pendingReceivedInvites,
    refreshInvites,
    rejectInvite,
  };
};
