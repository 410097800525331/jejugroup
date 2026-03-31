import { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { API_BASE_URL } from "../../../core/modules/config/api_config.module.js";
import type { CompanionRelationState, CompanionSearchMode, ItineraryCompanion } from "./types";

interface UseCompanionManagerProps {
  initialCompanions?: ItineraryCompanion[];
  searchMembers?: CompanionMemberSearch;
}

type CompanionMemberSearch = (
  memberIdPrefix: string,
  options?: {
    limit?: number;
    signal?: AbortSignal;
  },
) => Promise<ItineraryCompanion[]>;

const SEARCH_ENDPOINT = "/api/mypage/members/search";
const COMPANION_UNLINK_ENDPOINT = "/api/mypage/companion-links";
const SEARCH_DEBOUNCE_MS = 180;
const MAX_SUGGESTIONS = 5;
const RELATION_STATE_MAP: Record<string, CompanionRelationState> = {
  available: "none",
  invited: "outgoing_pending",
  incoming_pending: "incoming_pending",
  linked: "linked",
  needs_response: "incoming_pending",
  none: "none",
  outgoing_pending: "outgoing_pending",
};

const normalizeMemberId = (value: string) => value.trim().toLowerCase();

const isValidMemberIdQuery = (value: string) => /^[a-z0-9._-]{1,30}$/i.test(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const extractBackendMessage = (payload: unknown, fallbackMessage: string) => {
  if (isRecord(payload)) {
    const message = payload.message ?? payload.error;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallbackMessage;
};

const normalizeRelationState = (value: unknown): CompanionRelationState | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return RELATION_STATE_MAP[normalized];
};

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

const buildSearchUrl = (memberIdPrefix: string, limit?: number) => {
  const path = SEARCH_ENDPOINT.startsWith("/") ? SEARCH_ENDPOINT : `/${SEARCH_ENDPOINT}`;
  const baseUrl = API_BASE_URL?.trim();
  const url = baseUrl ? new URL(path, baseUrl) : new URL(path, window.location.origin);

  url.searchParams.set("query", memberIdPrefix);
  url.searchParams.set("memberIdPrefix", memberIdPrefix);
  url.searchParams.set("prefix", memberIdPrefix);

  if (typeof limit === "number") {
    url.searchParams.set("limit", String(limit));
  }

  return baseUrl ? url.toString() : `${url.pathname}${url.search}`;
};

const collectSearchEntries = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const keys = ["companions", "members", "users", "results", "items", "data"] as const;
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

  if (isRecord(payload.data)) {
    const nestedKeys = ["companions", "members", "users", "results", "items"] as const;
    for (const key of nestedKeys) {
      const nestedValue = payload.data[key];
      if (Array.isArray(nestedValue)) {
        return nestedValue;
      }
    }
  }

  return [];
};

const collectInvitePayload = (payload: unknown) => {
  if (!isRecord(payload)) {
    return null;
  }

  const candidates = [payload.invite, payload.data, payload.result, payload.item];
  for (const candidate of candidates) {
    if (isRecord(candidate)) {
      return candidate;
    }
  }

  return payload;
};

const toCompanion = (value: unknown): ItineraryCompanion | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = toText(value.id ?? value.memberId ?? value.userId ?? value.loginId);
  const name = toText(value.name ?? value.displayName ?? value.userName ?? value.nickname ?? value.fullName);
  const avatarUrl = toText(value.avatarUrl ?? value.avatar ?? value.profileImageUrl ?? value.imageUrl ?? value.photoUrl);
  const bio = toText(value.bio ?? value.intro ?? value.description ?? value.summary);
  const relationState =
    normalizeRelationState(
      value.relationState ??
        value.relation_state ??
        value.relationStatus ??
        value.relation_status ??
        value.companionRelationState ??
        value.companion_relation_state ??
        (isRecord(value.relation) ? value.relation.state : undefined),
    ) ?? ((value.isLinked === true || value.linked === true) ? "linked" : undefined);

  if (!id || !name) {
    return null;
  }

  return {
    avatarUrl: avatarUrl ?? undefined,
    bio: bio ?? undefined,
    id,
    isMember: value.isMember !== false,
    name,
    relationState,
  };
};

const dedupeCompanions = (companions: ItineraryCompanion[]) => {
  const seen = new Set<string>();
  const deduped: ItineraryCompanion[] = [];

  for (const companion of companions) {
    if (seen.has(companion.id)) {
      continue;
    }

    seen.add(companion.id);
    deduped.push(companion);
  }

  return deduped;
};

const defaultSearchMembers: CompanionMemberSearch = async (memberIdPrefix, options) => {
  const response = await fetch(buildSearchUrl(memberIdPrefix, options?.limit), {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    method: "GET",
    signal: options?.signal,
  });

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    throw new Error("로그인이 필요합니다.");
  }

  if (!response.ok) {
    const message =
      (isRecord(payload) && typeof payload.message === "string" && payload.message.trim()) ||
      (isRecord(payload) && typeof payload.error === "string" && payload.error.trim()) ||
      "회원 조회에 실패했다";
    throw new Error(message);
  }

  if (isRecord(payload) && payload.success === false) {
    const message =
      (typeof payload.message === "string" && payload.message.trim()) ||
      (typeof payload.error === "string" && payload.error.trim()) ||
      "회원 조회에 실패했다";
    throw new Error(message);
  }

  const results = collectSearchEntries(payload)
    .map(toCompanion)
    .filter((companion): companion is ItineraryCompanion => companion !== null);

  return dedupeCompanions(results).filter((companion) => companion.id.toLowerCase().startsWith(memberIdPrefix));
};

const createCompanionInvite = async (companion: ItineraryCompanion, signal?: AbortSignal) => {
  const response = await fetch("/api/mypage/companion-invites", {
    body: JSON.stringify({
      companionUserId: companion.id,
      inviteeId: companion.id,
      inviteeUserId: companion.id,
      memberId: companion.id,
      targetUserId: companion.id,
      userId: companion.id,
    }),
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    signal,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || (isRecord(payload) && payload.success === false)) {
    throw new Error(
      extractBackendMessage(
        payload,
        response.status === 401 ? "로그인이 필요합니다." : "동행 초대에 실패했다",
      ),
    );
  }

  return collectInvitePayload(payload);
};

const unlinkCompanion = async (companionId: string, signal?: AbortSignal) => {
  const response = await fetch(`${COMPANION_UNLINK_ENDPOINT}/${encodeURIComponent(companionId)}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    method: "DELETE",
    signal,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || (isRecord(payload) && payload.success === false)) {
    throw new Error(
      extractBackendMessage(
        payload,
        response.status === 401 ? "로그인이 필요합니다." : "동행 해제에 실패했다",
      ),
    );
  }

  return payload;
};

const resolveSearchErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "회원 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
};

const resolveInviteErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "동행 초대 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
};

const resolveUnlinkErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "동행 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
};

export const useCompanionManager = ({
  initialCompanions = [],
  searchMembers = defaultSearchMembers,
}: UseCompanionManagerProps = {}) => {
  const [companions, setCompanions] = useState<ItineraryCompanion[]>(initialCompanions);
  const [searchQuery, setSearchQueryState] = useState("");
  const [searchResults, setSearchResults] = useState<ItineraryCompanion[]>([]);
  const [searchMode, setSearchMode] = useState<CompanionSearchMode>("suggestions");
  const [isSearching, setIsSearching] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<{ message: string } | null>(null);
  const activeRequestIdRef = useRef(0);
  const pendingUnlinkIdsRef = useRef<Set<string>>(new Set());
  const suggestionRequestRef = useRef<{ controller: AbortController | null; timerId: number | null }>({
    controller: null,
    timerId: null,
  });
  const strictSearchControllerRef = useRef<AbortController | null>(null);

  const cancelSuggestionSearch = useCallback(() => {
    const pendingSuggestion = suggestionRequestRef.current;

    if (pendingSuggestion.timerId !== null) {
      window.clearTimeout(pendingSuggestion.timerId);
    }

    pendingSuggestion.controller?.abort();
    pendingSuggestion.controller = null;
    pendingSuggestion.timerId = null;
    setIsSuggestionLoading(false);
  }, []);

  const cancelStrictSearch = useCallback(() => {
    strictSearchControllerRef.current?.abort();
    strictSearchControllerRef.current = null;
    setIsSearching(false);
  }, []);

  const runSearch = useCallback(
    async (query: string, options?: { strict?: boolean; signal?: AbortSignal }) => {
      const normalizedQuery = normalizeMemberId(query);

      if (!normalizedQuery) {
        setSearchResults([]);
        if (options?.strict) {
          setErrorObj({ message: "검색할 제주그룹 회원 ID를 입력해 주세요." });
        }
        return [];
      }

      if (!isValidMemberIdQuery(normalizedQuery)) {
        setSearchResults([]);
        if (options?.strict) {
          setErrorObj({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" });
        }
        return [];
      }

      const requestId = ++activeRequestIdRef.current;

      if (options?.strict) {
        cancelSuggestionSearch();
        const strictController = new AbortController();
        strictSearchControllerRef.current = strictController;
        setSearchResults([]);
        setErrorObj(null);
        setSearchMode("results");
        setIsSearching(true);
        options = {
          ...options,
          signal: options.signal ?? strictController.signal,
        };
      } else {
        setIsSuggestionLoading(true);
      }

      try {
        const results = await searchMembers(normalizedQuery, {
          limit: options?.strict ? undefined : MAX_SUGGESTIONS,
          signal: options?.signal,
        });

        if (requestId !== activeRequestIdRef.current || options?.signal?.aborted) {
          return [];
        }

        setSearchResults(results);

        if (options?.strict) {
          if (results.length === 0) {
            setErrorObj({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
          } else {
            setErrorObj(null);
          }
        } else {
          setErrorObj(null);
        }

        return results;
      } catch (error) {
        if (requestId !== activeRequestIdRef.current || options?.signal?.aborted) {
          return [];
        }

        setSearchResults([]);
        setErrorObj({ message: resolveSearchErrorMessage(error) });
        return [];
      } finally {
        if (requestId === activeRequestIdRef.current && !options?.signal?.aborted) {
          if (options?.strict) {
            setIsSearching(false);
            if (strictSearchControllerRef.current?.signal === options.signal) {
              strictSearchControllerRef.current = null;
            }
          } else {
            setIsSuggestionLoading(false);
          }
        }
      }
    },
    [cancelSuggestionSearch, searchMembers],
  );

  useEffect(() => {
    const normalizedQuery = normalizeMemberId(searchQuery);

    if (!normalizedQuery) {
      setSearchResults([]);
      setErrorObj(null);
      setIsSuggestionLoading(false);
      return () => {
        activeRequestIdRef.current += 1;
      };
    }

    if (!isValidMemberIdQuery(normalizedQuery)) {
      setSearchResults([]);
      setErrorObj({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" });
      setIsSuggestionLoading(false);
      return () => {
        activeRequestIdRef.current += 1;
      };
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void runSearch(normalizedQuery, { signal: controller.signal });
    }, SEARCH_DEBOUNCE_MS);

    suggestionRequestRef.current.controller = controller;
    suggestionRequestRef.current.timerId = timer;

    return () => {
      controller.abort();
      window.clearTimeout(timer);
      if (suggestionRequestRef.current.controller === controller) {
        suggestionRequestRef.current.controller = null;
      }
      if (suggestionRequestRef.current.timerId === timer) {
        suggestionRequestRef.current.timerId = null;
      }
      activeRequestIdRef.current += 1;
    };
  }, [runSearch, searchQuery]);

  const setSearchQuery = useCallback((value: string) => {
    cancelStrictSearch();
    setSearchQueryState(value);
    setSearchResults([]);
    setSearchMode("suggestions");
    setErrorObj(null);
    cancelSuggestionSearch();
  }, [cancelStrictSearch, cancelSuggestionSearch]);

  const clearSearch = useCallback(() => {
    cancelStrictSearch();
    cancelSuggestionSearch();
    activeRequestIdRef.current += 1;
    setSearchQueryState("");
    setSearchResults([]);
    setSearchMode("suggestions");
    setIsSearching(false);
    setIsSuggestionLoading(false);
    setErrorObj(null);
  }, [cancelStrictSearch, cancelSuggestionSearch]);

  const handleSearch = useCallback(
    async (query: string) => {
      cancelSuggestionSearch();
      const results = await runSearch(query, { strict: true });
      return results;
    },
    [cancelSuggestionSearch, runSearch],
  );

  const inviteCompanion = useCallback(async (companion: ItineraryCompanion) => {
    setErrorObj(null);

    try {
      const invite = await createCompanionInvite(companion);
      const relationState = isRecord(invite)
        ? normalizeRelationState(
            invite.relationState ??
              invite.relation_state ??
              invite.status ??
              invite.inviteState ??
              invite.invite_state,
          ) ?? "outgoing_pending"
        : "outgoing_pending";

      setSearchResults((prev) =>
        prev.map((current) =>
          current.id === companion.id
            ? {
                ...current,
                relationState,
              }
            : current,
        ),
      );
    } catch (error) {
      setErrorObj({ message: resolveInviteErrorMessage(error) });
    }
  }, []);

  const removeCompanion = useCallback(async (id: string) => {
    setErrorObj(null);
    pendingUnlinkIdsRef.current.add(id);
    setCompanions((prev) => prev.filter((companion) => companion.id !== id));
    setSearchResults((prev) =>
      prev.map((current) =>
        current.id === id
          ? {
              ...current,
              relationState: "none",
            }
          : current,
      ),
    );
  }, []);

  const commitPendingUnlinks = useCallback(async () => {
    const pendingIds = Array.from(pendingUnlinkIdsRef.current);
    if (pendingIds.length === 0) {
      return;
    }

    for (const id of pendingIds) {
      try {
        await unlinkCompanion(id);
        pendingUnlinkIdsRef.current.delete(id);
      } catch (error) {
        setErrorObj({ message: resolveUnlinkErrorMessage(error) });
        throw error;
      }
    }
  }, []);

  return {
    companions,
    clearSearch,
    errorObj,
    handleSearch,
    isSearching,
    isSuggestionLoading,
    inviteCompanion,
    commitPendingUnlinks,
    removeCompanion,
    searchMode,
    searchQuery,
    searchResults,
    setSearchQuery,
    visibleSuggestionCount: MAX_SUGGESTIONS,
  };
};
