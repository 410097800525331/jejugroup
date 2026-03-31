import { ServiceCenterApiError as ServiceCenterApiErrorClass } from "@/types/service-center";
import type {
  ApiResult,
  DeletedRecord,
  FaqApi,
  FaqFormDraft,
  NoticeApi,
  NoticeFormDraft,
  TicketAttachmentApi,
  TicketAttachmentDraft,
  TicketCommentApi,
  TicketCommentDraft,
  ServiceCenterApiError,
  SessionUser,
  ServiceType,
  SupportTicketPriority,
  SupportTicketStatus,
  TicketApi,
  TicketCreateRequest,
  TicketCreateResponse,
  TicketDetailApiResponse,
  TicketListApiResponse,
  TicketMessageApi,
  TicketAttachmentDeleteResult,
  TicketCommentDeleteResult,
} from "@/types/service-center";

const JSON_HEADERS = {
  Accept: "application/json",
};

const CUSTOMER_CENTER_API_PREFIX = "/api/customer-center";
const AUTH_SESSION_ENDPOINT = "/api/auth/session";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeString = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
};

const normalizeMaybeString = (value: unknown): string | undefined => {
  const next = normalizeString(value);
  return next.length > 0 ? next : undefined;
};

const normalizeRecordString = (value: Record<string, unknown>, keys: string[]): string | undefined => {
  for (const key of keys) {
    const next = normalizeMaybeString(value[key]);
    if (next) {
      return next;
    }
  }

  return undefined;
};

const normalizeArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value.filter(Boolean) as T[]) : []);

const normalizeBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no", "n"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
};

const normalizeNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const normalizeIdentifier = (value: unknown, fallback: number | string): number | string => {
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }

  const normalizedNumber = normalizeNumber(value);
  if (typeof normalizedNumber === "number") {
    return normalizedNumber;
  }

  const normalizedString = normalizeMaybeString(value);
  return normalizedString ?? fallback;
};

const normalizeServiceTypeValue = (value: unknown): ServiceType => {
  const normalized = normalizeString(value).toLowerCase().replace(/[_\s]+/g, "-");

  switch (normalized) {
    case "jeju-air":
    case "air":
    case "airline":
      return "jeju-air";
    case "jeju-stay":
    case "stay":
    case "hotel":
      return "jeju-stay";
    case "jeju-rental":
    case "rental":
    case "car":
      return "jeju-rental";
    case "common":
    case "all":
    default:
      return "common";
  }
};

const normalizeApiError = (input: {
  status: number;
  url: string;
  payload?: unknown;
  fallbackMessage: string;
  code?: string;
}): ServiceCenterApiError => {
  const payload = input.payload;
  const payloadMessage =
    isRecord(payload) && typeof payload.message === "string"
      ? payload.message
      : isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : undefined;

  const message = payloadMessage || input.fallbackMessage;
  return new ServiceCenterApiErrorClass(message, {
    status: input.status,
    code: input.code,
    details: payload,
    url: input.url,
  });
};

const createErrorResult = (error: ServiceCenterApiError): ApiResult<never> => ({
  ok: false,
  status: error.status,
  data: null,
  error,
});

const createSuccessResult = <T>(data: T, status: number): ApiResult<T> => ({
  ok: true,
  status,
  data,
  error: null,
});

const parseJsonSafely = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  const raw = await response.text();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
};

const requestJson = async (path: string, init?: RequestInit): Promise<ApiResult<unknown>> => {
  try {
    const response = await fetch(path, {
      ...init,
      credentials: "include",
      headers: {
        ...JSON_HEADERS,
        ...(init?.headers ?? {}),
      },
    });

    const payload = await parseJsonSafely(response);

    if (!response.ok) {
      if (path === AUTH_SESSION_ENDPOINT && response.status === 401) {
        return createSuccessResult(null, response.status);
      }

      const fallbackMessage = response.status >= 500 ? "서버 응답이 불안정합니다." : "요청을 처리할 수 없습니다.";
      return createErrorResult(
        normalizeApiError({
          status: response.status,
          url: path,
          payload,
          fallbackMessage,
        }),
      );
    }

    return createSuccessResult(payload, response.status);
  } catch (cause) {
    return createErrorResult(
      new ServiceCenterApiErrorClass("네트워크 요청에 실패했습니다.", {
        status: 0,
        code: "NETWORK_ERROR",
        details: cause,
        url: path,
      }),
    );
  }
};

const extractArrayPayload = <T>(payload: unknown, keys: string[]): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value as T[];
    }

    if (isRecord(value) && Array.isArray(value.items)) {
      return value.items as T[];
    }

    if (isRecord(value) && Array.isArray(value.data)) {
      return value.data as T[];
    }
  }

  if (Array.isArray(payload.data)) {
    return payload.data as T[];
  }

  if (isRecord(payload.data) && Array.isArray(payload.data.items)) {
    return payload.data.items as T[];
  }

  return [];
};

const extractSinglePayload = <T>(payload: unknown, keys: string[]): T | null => {
  if (payload === null || payload === undefined) {
    return null;
  }

  if (isRecord(payload)) {
    for (const key of keys) {
      const value = payload[key];
      if (value && typeof value === "object") {
        return value as T;
      }
    }

    if (isRecord(payload.data)) {
      return payload.data as T;
    }
  }

  return payload as T;
};

const normalizeSessionUser = (value: unknown): SessionUser | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = normalizeMaybeString(value.id ?? value.userId ?? value.memberId ?? value.loginId);
  const name = normalizeMaybeString(value.name ?? value.userName ?? value.nickname ?? value.fullName);

  if (!id || !name) {
    return null;
  }

  const email = normalizeString(value.email ?? value.userEmail ?? value.loginEmail);
  const phone = normalizeMaybeString(value.phone ?? value.mobile ?? value.tel ?? value.phoneNumber);
  const roles = normalizeArray<unknown>(value.roles)
    .map((role) => normalizeString(role))
    .filter((role): role is string => role.length > 0);

  return {
    ...value,
    id,
    name,
    email,
    phone: phone ?? "",
    ...(normalizeMaybeString(value.role) ? { role: normalizeMaybeString(value.role) } : {}),
    ...(roles.length > 0 ? { roles } : {}),
    ...(normalizeMaybeString(value.authSource) ? { authSource: normalizeMaybeString(value.authSource) } : {}),
    ...(typeof value.isLocalAdmin === "boolean" ? { isLocalAdmin: value.isLocalAdmin } : {}),
  };
};

const normalizeNotice = (value: NoticeApi): NoticeApi => ({
  ...value,
  id: value.id,
  serviceType: normalizeServiceTypeValue(value.serviceType ?? value.service),
  service: normalizeServiceTypeValue(value.service ?? value.serviceType),
  title: normalizeMaybeString(value.title),
  content: normalizeMaybeString(value.content),
  excerpt: normalizeMaybeString(value.excerpt ?? value.summary),
  publishedAt: normalizeMaybeString(value.publishedAt ?? value.createdAt ?? value.updatedAt),
  createdAt: normalizeMaybeString(value.createdAt),
  updatedAt: normalizeMaybeString(value.updatedAt),
  ...(normalizeBoolean(value.active ?? value.isActive) !== undefined
    ? { active: normalizeBoolean(value.active ?? value.isActive) }
    : {}),
  ...(normalizeBoolean(value.pinned ?? value.isPinned) !== undefined
    ? { pinned: normalizeBoolean(value.pinned ?? value.isPinned) }
    : {}),
  category: normalizeMaybeString(value.category),
});

const normalizeFaq = (value: FaqApi): FaqApi => ({
  ...value,
  id: value.id,
  serviceType: normalizeServiceTypeValue(value.serviceType ?? value.service),
  service: normalizeServiceTypeValue(value.service ?? value.serviceType),
  category: normalizeMaybeString(value.category),
  question: normalizeMaybeString(value.question),
  answer: normalizeMaybeString(value.answer),
  sortOrder: normalizeNumber(value.sortOrder ?? value.order),
  createdAt: normalizeMaybeString(value.createdAt),
  updatedAt: normalizeMaybeString(value.updatedAt),
  ...(normalizeBoolean(value.active ?? value.isActive) !== undefined
    ? { active: normalizeBoolean(value.active ?? value.isActive) }
    : {}),
});

const normalizeTicketComment = (value: TicketCommentApi): TicketCommentApi => {
  const raw = value as Record<string, unknown>;

  return {
    ...value,
    id: value.id,
    ticketId: value.ticketId ?? raw.ticket_id,
    authorUserId: normalizeMaybeString(value.authorUserId ?? raw.author_user_id),
    authorRole: normalizeMaybeString(value.authorRole ?? raw.author_role),
    authorName: normalizeMaybeString(value.authorName ?? raw.author_name),
    content: normalizeMaybeString(value.content ?? raw.body),
    internal: normalizeBoolean(value.internal ?? raw.is_internal),
    createdAt: normalizeMaybeString(value.createdAt ?? raw.created_at),
    updatedAt: normalizeMaybeString(value.updatedAt ?? raw.updated_at),
  };
};

const normalizeTicketAttachment = (value: TicketAttachmentApi): TicketAttachmentApi => {
  const raw = value as Record<string, unknown>;

  return {
    ...value,
    id: value.id,
    ticketId: value.ticketId ?? raw.ticket_id,
    uploadedByUserId: normalizeMaybeString(value.uploadedByUserId ?? raw.uploaded_by_user_id),
    originalFilename: normalizeMaybeString(value.originalFilename ?? raw.original_filename),
    storedFilename: normalizeMaybeString(value.storedFilename ?? raw.stored_filename),
    storageKey: normalizeMaybeString(value.storageKey ?? raw.storage_key),
    contentType: normalizeMaybeString(value.contentType ?? raw.content_type) ?? null,
    fileSizeBytes: normalizeNumber(value.fileSizeBytes ?? raw.file_size_bytes),
    createdAt: normalizeMaybeString(value.createdAt ?? raw.created_at),
    updatedAt: normalizeMaybeString(value.updatedAt ?? raw.updated_at),
  };
};

const normalizeDeletedRecord = (value: unknown): DeletedRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id ?? value.noticeId ?? value.faqId ?? value.commentId ?? value.attachmentId;
  const entity = normalizeMaybeString(value.entity ?? value.type);

  if (id === undefined || !entity) {
    return null;
  }

  return {
    id: typeof id === "number" || typeof id === "string" ? id : normalizeString(id),
    entity,
  };
};

const normalizeNoticePayload = (payload: unknown): NoticeApi | null => {
  const item = extractSinglePayload<NoticeApi>(payload, ["notice", "item", "data"]);
  return isRecord(item) ? normalizeNotice(item as NoticeApi) : null;
};

const normalizeFaqPayload = (payload: unknown): FaqApi | null => {
  const item = extractSinglePayload<FaqApi>(payload, ["faq", "item", "data"]);
  return isRecord(item) ? normalizeFaq(item as FaqApi) : null;
};

const normalizeCommentPayload = (payload: unknown): TicketCommentApi | null => {
  const item = extractSinglePayload<TicketCommentApi>(payload, ["comment", "item", "data"]);
  return isRecord(item) ? normalizeTicketComment(item as TicketCommentApi) : null;
};

const normalizeAttachmentPayload = (payload: unknown): TicketAttachmentApi | null => {
  const item = extractSinglePayload<TicketAttachmentApi>(payload, ["attachment", "item", "data"]);
  return isRecord(item) ? normalizeTicketAttachment(item as TicketAttachmentApi) : null;
};

const normalizeTicket = (value: TicketApi): TicketApi => {
  const raw = value as Record<string, unknown>;

  return {
    ...value,
    id: value.id,
    ticketId: value.ticketId ?? value.id,
    serviceType: normalizeServiceTypeValue(
      value.serviceType ??
        raw.service_type ??
        raw.serviceTypeCode ??
        raw.service_type_code ??
        value.service ??
        raw.serviceCode,
    ),
    service: normalizeServiceTypeValue(
      value.service ??
        raw.service_type ??
        raw.serviceTypeCode ??
        raw.service_type_code ??
        value.serviceType ??
        raw.serviceCode,
    ),
    inquiryType: normalizeRecordString(raw, [
      "inquiryType",
      "inquiryTypeCode",
      "inquiry_type",
      "inquiry_type_code",
      "inquiryCode",
      "inquiry_code",
      "categoryCode",
      "category_code",
    ]),
    inquiryTypeCode: normalizeRecordString(raw, [
      "inquiryTypeCode",
      "inquiry_type_code",
      "inquiryCode",
      "inquiry_code",
      "categoryCode",
      "category_code",
    ]),
    requesterName: normalizeRecordString(raw, ["requesterName", "requester_name", "name", "requester"]),
    requesterEmail: normalizeRecordString(raw, ["requesterEmail", "requester_email", "email", "requesterMail"]),
    requesterPhone: normalizeRecordString(raw, ["requesterPhone", "requester_phone", "phone", "requesterTel"]),
    title: normalizeRecordString(raw, ["title", "subject", "inquiryTitle", "ticketTitle"]),
    content: normalizeRecordString(raw, ["content", "body", "message", "description", "inquiryContent"]),
    status: normalizeRecordString(raw, ["status", "ticketStatus", "ticket_status", "state"]),
    priority: normalizeRecordString(raw, ["priority", "ticketPriority", "ticket_priority"]),
    reply: normalizeRecordString(raw, ["reply", "answer", "response", "replyContent", "reply_content"]) ?? null,
    repliedAt: normalizeRecordString(raw, ["repliedAt", "replied_at", "replyAt", "reply_at", "answeredAt"]) ?? null,
    createdAt: normalizeMaybeString(value.createdAt ?? raw.created_at),
    updatedAt: normalizeMaybeString(value.updatedAt ?? raw.updated_at),
    messages: normalizeArray<TicketMessageApi>(value.messages ?? raw.messages),
    comments: normalizeArray<TicketCommentApi>(value.comments ?? raw.comments).map(normalizeTicketComment),
    attachments: normalizeArray<TicketAttachmentApi>(value.attachments ?? raw.attachments).map(normalizeTicketAttachment),
  };
};

const normalizeTicketPayload = (payload: unknown): TicketApi | null => {
  const item = extractSinglePayload<TicketApi>(payload, ["ticket", "item", "data"]);
  if (!isRecord(item)) {
    return null;
  }

  return normalizeTicket(item as TicketApi);
};

const normalizeSessionResponse = (payload: unknown): SessionUser | null => {
  if (!isRecord(payload)) {
    return normalizeSessionUser(payload);
  }

  const candidates = [
    payload.user,
    payload.session,
    isRecord(payload.data) ? payload.data.user : null,
    isRecord(payload.data) ? payload.data.session : null,
    payload.data,
  ];

  for (const candidate of candidates) {
    const user = normalizeSessionUser(candidate);
    if (user) {
      return user;
    }
  }

  return normalizeSessionUser(payload);
};

export const normalizeServiceType = normalizeServiceTypeValue;

export const getSessionUser = async (): Promise<ApiResult<SessionUser | null>> => {
  const response = await requestJson(AUTH_SESSION_ENDPOINT);
  if (!response.ok) {
    return response;
  }

  const user = normalizeSessionResponse(response.data);
  return createSuccessResult(user, response.status);
};

export const listNotices = async (): Promise<ApiResult<NoticeApi[]>> => {
  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/notices`);
  if (!response.ok) {
    return response;
  }

  return createSuccessResult(
    extractArrayPayload<NoticeApi>(response.data, ["notices", "items", "data"]).map(normalizeNotice),
    response.status,
  );
};

export const listFaqs = async (): Promise<ApiResult<FaqApi[]>> => {
  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/faqs`);
  if (!response.ok) {
    return response;
  }

  return createSuccessResult(
    extractArrayPayload<FaqApi>(response.data, ["faqs", "items", "data"]).map(normalizeFaq),
    response.status,
  );
};

export const createNotice = async (payload: NoticeFormDraft): Promise<ApiResult<NoticeApi | null>> => {
  const serviceType = normalizeServiceTypeValue(payload.serviceType);
  const publishedAt = normalizeMaybeString(payload.publishedAt);

  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceType,
      title: normalizeMaybeString(payload.title),
      excerpt: normalizeMaybeString(payload.excerpt),
      content: normalizeMaybeString(payload.content),
      ...(typeof payload.pinned === "boolean" ? { pinned: payload.pinned } : {}),
      ...(typeof payload.active === "boolean" ? { active: payload.active } : {}),
      ...(publishedAt ? { publishedAt } : {}),
    }),
  });

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeNoticePayload(response.data), response.status);
};

export const updateNotice = async (
  noticeId: number | string,
  payload: NoticeFormDraft,
): Promise<ApiResult<NoticeApi | null>> => {
  const serviceType = normalizeServiceTypeValue(payload.serviceType);
  const publishedAt = normalizeMaybeString(payload.publishedAt);

  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/notices/${encodeURIComponent(String(noticeId))}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceType,
      title: normalizeMaybeString(payload.title),
      excerpt: normalizeMaybeString(payload.excerpt),
      content: normalizeMaybeString(payload.content),
      ...(typeof payload.pinned === "boolean" ? { pinned: payload.pinned } : {}),
      ...(typeof payload.active === "boolean" ? { active: payload.active } : {}),
      ...(publishedAt ? { publishedAt } : {}),
    }),
  });

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeNoticePayload(response.data), response.status);
};

export const deleteNotice = async (noticeId: number | string): Promise<ApiResult<DeletedRecord | null>> => {
  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/notices/${encodeURIComponent(String(noticeId))}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeDeletedRecord(response.data), response.status);
};

export const createFaq = async (payload: FaqFormDraft): Promise<ApiResult<FaqApi | null>> => {
  const serviceType = normalizeServiceTypeValue(payload.serviceType);
  const sortOrder = normalizeNumber(payload.sortOrder);

  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/faqs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceType,
      category: normalizeMaybeString(payload.category),
      question: normalizeMaybeString(payload.question),
      answer: normalizeMaybeString(payload.answer),
      ...(typeof sortOrder === "number" ? { sortOrder } : {}),
      ...(typeof payload.active === "boolean" ? { active: payload.active } : {}),
    }),
  });

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeFaqPayload(response.data), response.status);
};

export const updateFaq = async (faqId: number | string, payload: FaqFormDraft): Promise<ApiResult<FaqApi | null>> => {
  const serviceType = normalizeServiceTypeValue(payload.serviceType);
  const sortOrder = normalizeNumber(payload.sortOrder);

  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/faqs/${encodeURIComponent(String(faqId))}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceType,
      category: normalizeMaybeString(payload.category),
      question: normalizeMaybeString(payload.question),
      answer: normalizeMaybeString(payload.answer),
      ...(typeof sortOrder === "number" ? { sortOrder } : {}),
      ...(typeof payload.active === "boolean" ? { active: payload.active } : {}),
    }),
  });

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeFaqPayload(response.data), response.status);
};

export const deleteFaq = async (faqId: number | string): Promise<ApiResult<DeletedRecord | null>> => {
  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/faqs/${encodeURIComponent(String(faqId))}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeDeletedRecord(response.data), response.status);
};

export const listTicketComments = async (ticketId: number | string): Promise<ApiResult<TicketCommentApi[]>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/comments`,
  );
  if (!response.ok) {
    return response;
  }

  return createSuccessResult(
    extractArrayPayload<TicketCommentApi>(response.data, ["comments", "items", "data"]).map(normalizeTicketComment),
    response.status,
  );
};

export const createTicketComment = async (
  ticketId: number | string,
  payload: TicketCommentDraft,
): Promise<ApiResult<TicketCommentApi | null>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: normalizeMaybeString(payload.content),
        ...(typeof payload.isInternal === "boolean" ? { isInternal: payload.isInternal } : {}),
      }),
    },
  );

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeCommentPayload(response.data), response.status);
};

export const updateTicketComment = async (
  ticketId: number | string,
  commentId: number | string,
  payload: TicketCommentDraft,
): Promise<ApiResult<TicketCommentApi | null>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/comments/${encodeURIComponent(
      String(commentId),
    )}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: normalizeMaybeString(payload.content),
        ...(typeof payload.isInternal === "boolean" ? { isInternal: payload.isInternal } : {}),
      }),
    },
  );

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeCommentPayload(response.data), response.status);
};

export const deleteTicketComment = async (
  ticketId: number | string,
  commentId: number | string,
): Promise<ApiResult<TicketCommentDeleteResult | null>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/comments/${encodeURIComponent(
      String(commentId),
    )}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    return response;
  }

  const payload = isRecord(response.data)
    ? {
        deleted: normalizeBoolean(response.data.deleted) ?? true,
        commentId: normalizeIdentifier(
          response.data.commentId ?? response.data.id ?? response.data.comment_id,
          commentId,
        ),
      }
    : null;

  return createSuccessResult(payload, response.status);
};

export const listTicketAttachments = async (ticketId: number | string): Promise<ApiResult<TicketAttachmentApi[]>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/attachments`,
  );
  if (!response.ok) {
    return response;
  }

  return createSuccessResult(
    extractArrayPayload<TicketAttachmentApi>(response.data, ["attachments", "items", "data"]).map(
      normalizeTicketAttachment,
    ),
    response.status,
  );
};

export const createTicketAttachment = async (
  ticketId: number | string,
  payload: TicketAttachmentDraft,
): Promise<ApiResult<TicketAttachmentApi | null>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/attachments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalFilename: normalizeMaybeString(payload.originalFilename),
        storedFilename: normalizeMaybeString(payload.storedFilename),
        storageKey: normalizeMaybeString(payload.storageKey),
        ...(normalizeMaybeString(payload.contentType) ? { contentType: normalizeMaybeString(payload.contentType) } : {}),
        ...(typeof payload.fileSizeBytes === "number" && Number.isFinite(payload.fileSizeBytes)
          ? { fileSizeBytes: payload.fileSizeBytes }
          : {}),
      }),
    },
  );

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeAttachmentPayload(response.data), response.status);
};

export const updateTicketAttachment = async (
  ticketId: number | string,
  attachmentId: number | string,
  payload: TicketAttachmentDraft,
): Promise<ApiResult<TicketAttachmentApi | null>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/attachments/${encodeURIComponent(
      String(attachmentId),
    )}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalFilename: normalizeMaybeString(payload.originalFilename),
        storedFilename: normalizeMaybeString(payload.storedFilename),
        storageKey: normalizeMaybeString(payload.storageKey),
        ...(normalizeMaybeString(payload.contentType) ? { contentType: normalizeMaybeString(payload.contentType) } : {}),
        ...(typeof payload.fileSizeBytes === "number" && Number.isFinite(payload.fileSizeBytes)
          ? { fileSizeBytes: payload.fileSizeBytes }
          : {}),
      }),
    },
  );

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeAttachmentPayload(response.data), response.status);
};

export const deleteTicketAttachment = async (
  ticketId: number | string,
  attachmentId: number | string,
): Promise<ApiResult<TicketAttachmentDeleteResult | null>> => {
  const response = await requestJson(
    `${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}/attachments/${encodeURIComponent(
      String(attachmentId),
    )}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    return response;
  }

  const payload = isRecord(response.data)
    ? {
        deleted: normalizeBoolean(response.data.deleted) ?? true,
        attachmentId: normalizeIdentifier(
          response.data.attachmentId ?? response.data.id ?? response.data.attachment_id,
          attachmentId,
        ),
      }
    : null;

  return createSuccessResult(payload, response.status);
};

export const listMyTickets = async (): Promise<ApiResult<TicketApi[]>> => {
  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/support/tickets`);
  if (!response.ok) {
    return response;
  }

  return createSuccessResult(
    extractArrayPayload<TicketApi>(response.data, ["tickets", "items", "data"]).map(normalizeTicket),
    response.status,
  );
};

export const getTicketDetail = async (ticketId: number | string): Promise<ApiResult<TicketApi | null>> => {
  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/support/tickets/${encodeURIComponent(String(ticketId))}`);
  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeTicketPayload(response.data), response.status);
};

export const createTicket = async (payload: TicketCreateRequest): Promise<ApiResult<TicketApi | null>> => {
  const serviceType = normalizeServiceTypeValue(payload.serviceType);
  const inquiryTypeCode = normalizeMaybeString(payload.inquiryTypeCode ?? payload.inquiryType);
  const requesterName = normalizeMaybeString(payload.requesterName ?? payload.name);
  const requesterEmail = normalizeMaybeString(payload.requesterEmail ?? payload.email);
  const requesterPhone = normalizeMaybeString(payload.requesterPhone ?? payload.phone);
  const status = normalizeMaybeString(payload.status);
  const priority = normalizeMaybeString(payload.priority);

  const response = await requestJson(`${CUSTOMER_CENTER_API_PREFIX}/support/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceType,
      inquiryTypeCode,
      requesterName,
      requesterEmail,
      requesterPhone,
      title: normalizeMaybeString(payload.title),
      content: normalizeMaybeString(payload.content),
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
    }),
  });

  if (!response.ok) {
    return response;
  }

  return createSuccessResult(normalizeTicketPayload(response.data), response.status);
};

export const isServiceCenterApiError = (value: unknown): value is ServiceCenterApiError =>
  value instanceof ServiceCenterApiErrorClass;

export type {
  ApiResult,
  DeletedRecord,
  FaqApi,
  FaqFormDraft,
  NoticeApi,
  NoticeFormDraft,
  SupportTicketPriority,
  SupportTicketStatus,
  ServiceCenterApiError,
  SessionUser,
  TicketAttachmentApi,
  TicketAttachmentDeleteResult,
  TicketAttachmentDraft,
  TicketCommentApi,
  TicketCommentDeleteResult,
  TicketCommentDraft,
  TicketApi,
  TicketCreateRequest,
  TicketCreateResponse,
  TicketDetailApiResponse,
  TicketListApiResponse,
};
